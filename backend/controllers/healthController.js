/**
 * GET /api/health
 * Confirms the API process is up. Later phases will extend this to report
 * on downstream dependencies (DB, AI agent, etc.) if useful.
 */
function getHealth(req, res) {
  res.status(200).json({
    success: true,
    message: "ResolveAI backend is running",
  });
}

module.exports = { getHealth };
