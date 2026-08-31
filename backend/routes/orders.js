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

module.exports = router;