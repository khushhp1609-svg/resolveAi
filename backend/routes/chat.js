const express = require("express");
const router = express.Router();

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const {
  getConversationMemory
} = require("../services/memoryService");

const {
  runResolveAIAgent
} = require("../services/aiAgentService");


// Send a message and run ResolveAI agent
router.post("/", async (req, res) => {
  try {
    const {
      conversationId,
      userId,
      content
    } = req.body;

    // Validate request
    if (!conversationId || !userId || !content) {
      return res.status(400).json({
        success: false,
        message:
          "conversationId, userId and content are required"
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

    // Save merchant message
    const userMessage = await Message.create({
      conversationId,
      userId,
      role: "user",
      content,
      incidentId: conversation.activeIncidentId
    });

    // Get conversation memory
    const memory = await getConversationMemory(
      conversationId
    );

    // Run ResolveAI
    const agentResult = await runResolveAIAgent({
      userMessage: content,
      memory
    });

    if (!agentResult.success) {
      return res.status(500).json({
        success: false,
        message: agentResult.error || "AI agent failed"
      });
    }

    // Save AI response
    const aiMessage = await Message.create({
      conversationId,
      userId,
      role: "assistant",
      content: agentResult.response,
      incidentId: conversation.activeIncidentId
    });

    // Get updated memory
    const updatedMemory =
      await getConversationMemory(conversationId);

    res.status(201).json({
      success: true,
      data: {
        message: userMessage,
        response: aiMessage,
        memory: updatedMemory
      }
    });

  } catch (error) {
    console.error("AI Chat error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;