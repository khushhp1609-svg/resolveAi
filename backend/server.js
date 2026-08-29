require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/health");

const app = express();
const PORT = process.env.PORT || 5000;

// Only allow the local Vite dev server for now. Widen this deliberately in
// a later phase when there's a real deployed frontend origin to allow.
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.use("/api/health", healthRoutes);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`ResolveAI backend listening on port ${PORT}`);
  });
}

start();
