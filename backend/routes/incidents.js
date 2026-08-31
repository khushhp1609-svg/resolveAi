const express = require("express");
const router = express.Router();

const Incident = require("../models/Incident");

// Create a new incident
router.post("/", async (req, res) => {
  try {
    const {
      incidentId,
      userId,
      conversationId,
      type,
      priority,
      description,
      transactionId,
    } = req.body;

    const incident = await Incident.create({
      incidentId,
      userId,
      conversationId,
      type,
      priority,
      description,
      transactionId,
      status: "OPEN",
    });

    res.status(201).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error("Create incident error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create incident",
    });
  }
});

// Get incident by ID
router.get("/:incidentId", async (req, res) => {
  try {
    const incident = await Incident.findOne({
      incidentId: req.params.incidentId,
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error("Get incident error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch incident",
    });
  }
});

module.exports = router;