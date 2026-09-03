const Transaction = require("../models/Transaction");

async function getTransaction(transactionId) {
  try {
    if (!transactionId) {
      return {
        success: false,
        error: "transactionId is required"
      };
    }

    const transaction = await Transaction.findOne({
      transactionId
    }).lean();

    if (!transaction) {
      return {
        success: false,
        error: `Transaction ${transactionId} not found`
      };
    }

    return {
      success: true,
      data: {
        transactionId: transaction.transactionId,
        merchantId: transaction.merchantId,
        customerId: transaction.customerId,
        amount: transaction.amount,
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    };
  } catch (error) {
    console.error("getTransaction tool error:", error);

    return {
      success: false,
      error: "Failed to retrieve transaction"
    };
  }
}

module.exports = {
  getTransaction
};