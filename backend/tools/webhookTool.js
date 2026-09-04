const Event = require("../models/Event");

async function getWebhookLogs(transactionId) {
  try {
    if (!transactionId) {
      return {
        success: false,
        error: "transactionId is required"
      };
    }

    const events = await Event.find({
      transactionId
    })
      .sort({ timestamp: -1 })
      .lean();

    if (!events || events.length === 0) {
      return {
        success: true,
        data: [],
        message: `No webhook events found for transaction ${transactionId}`
      };
    }
return {
  success: true,
  data: events.map((event) => ({
    eventId: event.eventId,
    transactionId: event.transactionId,
    eventType: event.eventType,
    status: event.status,
    timestamp: event.timestamp,
    metadata: event.metadata,
    replayed: event.replayed,
    replayedAt: event.replayedAt
  }))
};

  } catch (error) {
    console.error("getWebhookLogs tool error:", error);

    return {
      success: false,
      error: "Failed to retrieve webhook logs"
    };
  }
}

module.exports = {
  getWebhookLogs
};