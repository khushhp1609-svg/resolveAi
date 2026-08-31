const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "New Conversation",
    },

    activeIncidentId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);