const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const Order = require("../models/Order");

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

    // Mark webhook as successfully replayed
    event.status = "SUCCESS";

    event.metadata = {
      ...event.metadata,
      replayed: true,
      replayedAt: new Date(),
    };

    await event.save();

    // Update the related order
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

module.exports = router;