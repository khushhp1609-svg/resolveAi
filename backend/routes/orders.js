const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
});
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["PAID", "PENDING", "CANCELLED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Failed to update order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order"
    });
  }
});
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["PAID", "PENDING", "CANCELLED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Failed to update order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order"
    });
  }
});

module.exports = router;