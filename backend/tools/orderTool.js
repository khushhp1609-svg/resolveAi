const Order = require("../models/Order");

async function getOrder(transactionId) {
  try {
    if (!transactionId) {
      return {
        success: false,
        error: "transactionId is required"
      };
    }

    const order = await Order.findOne({
      transactionId
    }).lean();

    if (!order) {
      return {
        success: false,
        error: `Order for transaction ${transactionId} not found`
      };
    }

    return {
      success: true,
      data: {
        orderId: order.orderId,
        transactionId: order.transactionId,
        merchantId: order.merchantId,
        amount: order.amount,
        status: order.status,
        createdAt: order.createdAt
      }
    };
  } catch (error) {
    console.error("getOrder tool error:", error);

    return {
      success: false,
      error: "Failed to retrieve order"
    };
  }
}

module.exports = {
  getOrder
};