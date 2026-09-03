const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const Order = require("../models/Order");
const Incident = require("../models/Incident");

// Get webhook events for a transaction
router.get("/:transactionId", async (req, res) => {
  try {
    const events = await Event.find({
      transactionId: req.params.transactionId,
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Webhook fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch webhook events",
    });
  }
});

// Replay a failed webhook
router.post("/replay", async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "transactionId is required",
      });
    }

    const event = await Event.findOne({
      transactionId,
      eventType: "PAYMENT_SUCCESS",
      status: "FAILED",
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Failed webhook event not found",
      });
    }

    event.status = "SUCCESS";

    event.metadata = {
      ...event.metadata,
      replayed: true,
      replayedAt: new Date(),
    };

    await event.save();

    const order = await Order.findOne({
      transactionId,
    });

    if (order) {
      order.status = "PAID";
      await order.save();
    }

    res.json({
      success: true,
      message: "Webhook replayed successfully",
      data: {
        transactionId,
        webhookStatus: event.status,
        orderStatus: order ? order.status : null,
      },
    });
  } catch (error) {
    console.error("Webhook replay error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to replay webhook",
    });
  }
});

// Reset complete demo state
router.post("/reset-demo", async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "transactionId is required",
      });
    }

    // 1. Reset webhook
    const event = await Event.findOne({
      transactionId,
      eventType: "PAYMENT_SUCCESS",
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Webhook event not found",
      });
    }

    event.status = "FAILED";

    event.metadata = {
      reason: "Merchant endpoint timeout",
      replayed: false,
    };

    await event.save();

    // 2. Reset order
    const order = await Order.findOne({
      transactionId,
    });

    if (order) {
      order.status = "PENDING";
      await order.save();
    }

    // 3. Reset incident
    const incident = await Incident.findOne({
      transactionId,
    });

    if (incident) {
      incident.status = "OPEN";
      incident.rootCause = null;
      incident.resolution = null;
      await incident.save();
    }

    res.json({
      success: true,
      message: "Complete demo state reset",
      data: {
        transactionId,
        webhookStatus: event.status,
        orderStatus: order ? order.status : null,
        incidentId: incident ? incident.incidentId : null,
        incidentStatus: incident ? incident.status : null,
      },
    });
  } catch (error) {
    console.error("Demo reset error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reset demo state",
    });
  }
});

// Temporary test endpoint for replay action
const { replayWebhook } = require("../tools/replayWebhookTool");

router.post("/test-replay", async (req, res) => {
  try {
    const { transactionId } = req.body;

    const result = await replayWebhook(transactionId);

    res.json(result);
  } catch (error) {
    console.error("Test replay error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;