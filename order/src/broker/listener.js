const { subscribeToQueue } = require("./borker");
const orderModel = require("../models/order.model");

module.exports = async function () {
    subscribeToQueue("ORDER_SERVICE.ORDER_STATUS_UPDATED", async (data) => {
        try {
            const { orderId, status } = data;
            const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
            if (order) {
                console.log(`[order] Order ${orderId} status updated to ${status}`);
            } else {
                console.warn(`[order] Order ${orderId} not found for status update`);
            }
        } catch (err) {
            console.error('[order] Error updating order status:', err);
        }
    });
};
