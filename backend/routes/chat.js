const express = require("express");
const router = express.Router();

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { getConversationMemory } = require("../services/memoryService");

// Send a message and retrieve conversation memory
router.post("/", async (req, res) => {
  try {
    const {
      conversationId,
      userId,
      content
    } = req.body;

    // Validate required fields
    if (!conversationId || !userId || !content) {
      return res.status(400).json({
        success: false,
        message: "conversationId, userId and content are required"
      });
    }

    // Find conversation
    const conversation = await Conversation.findOne({
      conversationId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    // Save the new user message
    const message = await Message.create({
      conversationId,
      userId,
      role: "user",
      content,
      incidentId: conversation.activeIncidentId
    });

    // Retrieve updated conversation memory
    const memory = await getConversationMemory(conversationId);

    res.status(201).json({
      success: true,
      data: {
        message,
        memory
      }
    });

  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;