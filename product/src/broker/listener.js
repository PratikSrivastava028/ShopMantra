const { subscribeToQueue } = require("./borker");
const productModel = require("../models/product.model");
const { publishToQueue } = require("./borker");

module.exports = async function () {
    subscribeToQueue("ORDER_PRODUCT.ORDER_CREATED", async (order) => {
        try {
            console.log('[product] Order created received for stock update:', order._id);
            for (const item of order.items) {
                const productId = item.product;
                const quantity = item.quantity;

                const product = await productModel.findById(productId);
                if (product) {
                    const originalStock = product.stock;
                    product.stock = Math.max(0, product.stock - quantity);
                    await product.save();
                    console.log(`[product] Updated stock for "${product.title}": ${originalStock} -> ${product.stock}`);

                    // Publish product update to sync with seller dashboard
                    await publishToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_UPDATED', product);
                } else {
                    console.warn(`[product] Product ${productId} not found for stock update`);
                }
            }
        } catch (err) {
            console.error('[product] Error updating stock for order:', err);
        }
    });
};
