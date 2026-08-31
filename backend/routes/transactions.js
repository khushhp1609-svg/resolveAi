const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");

router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      transactionId: req.params.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
    });
  }
});

module.exports = router;