require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/health");
const transactionRoutes = require("./routes/transactions");
const orderRoutes = require("./routes/orders");
const webhookRoutes = require("./routes/webhooks");
const app = express();
const PORT = process.env.PORT || 5000;
const incidentRoutes = require("./routes/incidents");

const conversationRoutes = require("./routes/conversations");
const chatRoutes = require("./routes/chat");

// Only allow the local Vite dev server for now. Widen this deliberately in
// a later phase when there's a real deployed frontend origin to allow.
const allowedOrigins = [
  "http://localhost:5173",
  "https://resolve-ai-three-brown.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());
app.use("/api/transactions", transactionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use("/api/health", healthRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/chat", chatRoutes);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`ResolveAI backend listening on port ${PORT}`);
  });
}

start();
