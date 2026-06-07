const { subscribeToQueue } = require("./broker")
const userModel = require("../models/user.model")
const productModel = require("../models/product.model")
const orderModel = require("../models/order.model")
const paymentModel = require("../models/payment.model")

module.exports = async function () {
    subscribeToQueue("AUTH_SELLER_DASHBOARD.USER_CREATED", async (user) => {
        try {
            await userModel.create(user);
            console.log('[seller-dashboard] User created:', user.username);
        } catch (err) {
            console.error('[seller-dashboard] Error creating user:', err);
        }
    })

    subscribeToQueue("PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED", async (product) => {
        try {
            await productModel.create(product);
            console.log('[seller-dashboard] Product created:', product.title);
        } catch (err) {
            console.error('[seller-dashboard] Error creating product:', err);
        }
    })

    subscribeToQueue("PRODUCT_SELLER_DASHBOARD.PRODUCT_UPDATED", async (product) => {
        try {
            await productModel.findOneAndUpdate({ _id: product._id }, { ...product }, { new: true });
            console.log('[seller-dashboard] Product updated:', product.title);
        } catch (err) {
            console.error('[seller-dashboard] Error updating product:', err);
        }
    })

    subscribeToQueue("PRODUCT_SELLER_DASHBOARD.PRODUCT_DELETED", async (data) => {
        try {
            await productModel.findOneAndDelete({ _id: data.id });
            console.log('[seller-dashboard] Product deleted:', data.id);
        } catch (err) {
            console.error('[seller-dashboard] Error deleting product:', err);
        }
    })

    subscribeToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED", async (order) => {
        try {
            await orderModel.create(order);
            console.log('[seller-dashboard] Order created:', order._id);
        } catch (err) {
            console.error('[seller-dashboard] Error creating order:', err);
        }
    })

    subscribeToQueue("PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED", async (payment) => {
        try {
            await paymentModel.create(payment);
            console.log('[seller-dashboard] Payment created:', payment.orderId);
        } catch (err) {
            console.error('[seller-dashboard] Error creating payment:', err);
        }
    })

    subscribeToQueue("PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATED", async (payment) => {
        try {
            await paymentModel.findOneAndUpdate({ orderId: payment.orderId }, { ...payment });
            console.log('[seller-dashboard] Payment updated:', payment.orderId);
        } catch (err) {
            console.error('[seller-dashboard] Error updating payment:', err);
        }
    })

    subscribeToQueue("ORDER_SELLER_DASHBOARD.ORDER_STATUS_UPDATED", async (data) => {
        try {
            const { orderId, status } = data;
            await orderModel.findOneAndUpdate({ _id: orderId }, { status });
            console.log('[seller-dashboard] Order status updated:', orderId, status);
        } catch (err) {
            console.error('[seller-dashboard] Error updating order status:', err);
        }
    })
} 