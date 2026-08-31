const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Incident = require("../models/Incident");

async function getConversationMemory(conversationId, limit = 10) {
  try {
    // Find the conversation
    const conversation = await Conversation.findOne({
      conversationId
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Get recent messages
    const messages = await Message.find({
      conversationId
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Reverse so oldest message comes first
    messages.reverse();

    // Find active incident
    let incident = null;

    if (conversation.activeIncidentId) {
      incident = await Incident.findOne({
        incidentId: conversation.activeIncidentId
      });
    }

    return {
      conversation: {
        conversationId: conversation.conversationId,
        userId: conversation.userId,
        title: conversation.title,
        status: conversation.status
      },

      activeIncident: incident
        ? {
            incidentId: incident.incidentId,
            type: incident.type,
            status: incident.status,
            priority: incident.priority,
            description: incident.description,
            transactionId: incident.transactionId,
            rootCause: incident.rootCause,
            resolution: incident.resolution
          }
        : null,

      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
        incidentId: message.incidentId,
        createdAt: message.createdAt
      }))
    };
  } catch (error) {
    console.error("Memory service error:", error);
    throw error;
  }
}

module.exports = {
  getConversationMemory
};