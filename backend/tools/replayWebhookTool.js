
const Event = require("../models/Event");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const Incident = require("../models/Incident");

async function replayWebhook(transactionId) {
  try {
    if (!transactionId) {
      return {
        success: false,
        error: "transactionId is required"
      };
    }

    // 1. Verify transaction exists and is successful
    const transaction = await Transaction.findOne({
      transactionId
    }).lean();

    if (!transaction) {
      return {
        success: false,
        error: `Transaction ${transactionId} not found`
      };
    }

    if (transaction.status !== "SUCCESS") {
      return {
        success: false,
        error: `Webhook replay blocked because transaction ${transactionId} is not SUCCESS`
      };
    }

    // 2. Find the corresponding order
    const order = await Order.findOne({
      transactionId
    });

    if (!order) {
      return {
        success: false,
        error: `Order for transaction ${transactionId} not found`
      };
    }

    // 3. Safety check — do not replay if order is already paid
    if (order.status === "PAID") {
      return {
        success: false,
        error: `Order ${order.orderId} is already PAID`
      };
    }

    // 4. Find the failed PAYMENT_SUCCESS webhook
    const event = await Event.findOne({
      transactionId,
      eventType: "PAYMENT_SUCCESS",
      status: "FAILED"
    });

    if (!event) {
      return {
        success: false,
        error: `Failed PAYMENT_SUCCESS webhook not found for transaction ${transactionId}`
      };
    }

    // 5. Replay the webhook
    event.status = "SUCCESS";

    event.metadata = {
      ...event.metadata,
      replayed: true,
      replayedAt: new Date()
    };

    await event.save();

    // 6. Synchronize the order
    order.status = "PAID";
    await order.save();

    // 7. Update the active incident
    const incident = await Incident.findOne({
      transactionId,
      status: "OPEN"
    });

    if (incident) {
      incident.rootCause =
        "PAYMENT_SUCCESS webhook failed due to merchant endpoint timeout";

      incident.resolution =
        "Failed PAYMENT_SUCCESS webhook was replayed successfully and the order was synchronized to PAID";

      incident.status = "RESOLVED";

      await incident.save();
    }

    // 8. Return verified action result
    return {
      success: true,
      message: "Webhook replayed and order synchronized successfully",
      data: {
        transactionId,
        transactionStatus: transaction.status,
        webhookEventId: event.eventId,
        webhookStatus: event.status,
        orderId: order.orderId,
        orderStatus: order.status,
        incidentId: incident ? incident.incidentId : null,
        incidentStatus: incident ? incident.status : null
      }
    };

  } catch (error) {
    console.error("replayWebhook tool error:", error);

    return {
      success: false,
      error: "Failed to replay webhook"
    };
  }
}

module.exports = {
  replayWebhook
};
