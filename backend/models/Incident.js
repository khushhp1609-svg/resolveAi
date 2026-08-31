const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: String,
      required: true,
    },

    conversationId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "PAYMENT_ORDER_MISMATCH",
        "PAYMENT_NOT_VISIBLE",
        "SETTLEMENT_KYC",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "INVESTIGATING", "RESOLVED", "ESCALATED"],
      default: "OPEN",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    description: {
      type: String,
      required: true,
    },

    transactionId: {
      type: String,
      default: null,
    },

    rootCause: {
      type: String,
      default: null,
    },

    resolution: {
      type: String,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Incident", incidentSchema);