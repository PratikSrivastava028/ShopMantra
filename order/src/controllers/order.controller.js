const orderModel = require("../models/order.model")
const axios = require("axios")
const { publishToQueue } = require("../broker/borker");


async function createOrder(req, res) {

    const user = req.user;
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[ 1 ];

    try {

        // fetch user cart from cart service
        const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const productsWithNulls = await Promise.all(cartResponse.data.cart.items.map(async (item) => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/${item.productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data.data;
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    return null;
                }
                throw err;
            }
        }));

        const validItems = [];
        const products = [];
        for (let i = 0; i < cartResponse.data.cart.items.length; i++) {
            if (productsWithNulls[i]) {
                validItems.push(cartResponse.data.cart.items[i]);
                products.push(productsWithNulls[i]);
            }
        }

        if (validItems.length === 0) {
            throw new Error("No valid products in cart to order");
        }

        let priceAmount = 0;

        const orderItems = validItems.map((item) => {
            const product = products.find(p => p._id === item.productId);

            // if not in stock, does not allow order creation
            if (product.stock < item.quantity) {
                throw new Error(`Product ${product.title} is out of stock or insufficient stock`)
            }

            let unitPrice = product.price.amount;
            if (product.price.currency === 'USD') {
                unitPrice = unitPrice * 83;
            }
            const itemTotal = unitPrice * item.quantity;
            priceAmount += itemTotal;

            return {
                product: item.productId,
                quantity: item.quantity,
                price: {
                    amount: itemTotal,
                    currency: 'INR'
                }
            }
        })

        const discountPercent = Number(req.body.discountPercent) || 0;
        const discount = priceAmount * (discountPercent / 100);
        const tax = (priceAmount - discount) * 0.08;
        const shippingCost = (priceAmount - discount) > 5000 || priceAmount === 0 ? 0 : 150;
        const finalTotal = priceAmount - discount + tax + shippingCost;

        const order = await orderModel.create({
            user: user.id,
            items: orderItems,
            status: "PENDING",
            totalPrice: {
                amount: finalTotal,
                currency: "INR" // assuming all products are in USD for simplicity
            },
            shippingAddress: {
                street: req.body.shippingAddress.street,
                city: req.body.shippingAddress.city,
                state: req.body.shippingAddress.state,
                zip: req.body.shippingAddress.pincode,
                country: req.body.shippingAddress.country,
            }
        })

        // Clear cart in backend
        try {
            await axios.delete(`http://localhost:3002/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(`[order] Cart cleared for user ${user.id}`);
        } catch (cartErr) {
            console.error('[order] Failed to clear cart after order creation:', cartErr.message);
        }

        await publishToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED", order)

        res.status(201).json({ order })

    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: "Internal server error", error: err.message })
    }

}

async function getMyOrders(req, res) {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const orders = await orderModel.find({ user: user.id }).skip(skip).limit(limit).exec();
        const totalOrders = await orderModel.countDocuments({ user: user.id });

        res.status(200).json({
            orders,
            meta: {
                total: totalOrders,
                page,
                limit
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

async function getOrderById(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        res.status(200).json({ order })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

async function cancelOrderById(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        // only PENDING orders can be cancelled
        if (order.status !== "PENDING") {
            return res.status(409).json({ message: "Order cannot be cancelled at this stage" });
        }

        order.status = "CANCELLED";
        await order.save();

        await publishToQueue("ORDER_SELLER_DASHBOARD.ORDER_STATUS_UPDATED", { orderId: orderId, status: "CANCELLED" });

        res.status(200).json({ order });
    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


async function updateOrderAddress(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        // only PENDING orders can have address updated
        if (order.status !== "PENDING") {
            return res.status(409).json({ message: "Order address cannot be updated at this stage" });
        }

        order.shippingAddress = {
            street: req.body.shippingAddress.street,
            city: req.body.shippingAddress.city,
            state: req.body.shippingAddress.state,
            zip: req.body.shippingAddress.pincode,
            country: req.body.shippingAddress.country,
        };

        await order.save();

        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrderById,
    updateOrderAddress
}