const express = require("express");
const router = express.Router();

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { getConversationMemory } = require("../services/memoryService");

// Create a new conversation
router.post("/", async (req, res) => {
  try {
    const {
      conversationId,
      userId,
      title,
      activeIncidentId
    } = req.body;

    const conversation = await Conversation.create({
      conversationId,
      userId,
      title,
      activeIncidentId
    });

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get a conversation
router.get("/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      conversationId: req.params.conversationId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update a conversation
router.patch("/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      {
        conversationId: req.params.conversationId
      },
      {
        $set: req.body
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error("Update conversation error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add a message to a conversation
router.post("/:conversationId/messages", async (req, res) => {
  try {
    const {
      userId,
      role,
      content,
      incidentId,
      metadata
    } = req.body;

    const conversation = await Conversation.findOne({
      conversationId: req.params.conversationId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const message = await Message.create({
      conversationId: req.params.conversationId,
      userId,
      role,
      content,
      incidentId: incidentId || conversation.activeIncidentId,
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error("Create message error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get conversation message history
router.get("/:conversationId/messages", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort({
      createdAt: 1
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// Get conversation memory
router.get("/:conversationId/memory", async (req, res) => {
  try {
    const memory = await getConversationMemory(
      req.params.conversationId
    );

    res.json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error("Get conversation memory error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

