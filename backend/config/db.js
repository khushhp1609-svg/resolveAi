const mongoose = require("mongoose");

/**
 * Connects to MongoDB Atlas using the MONGODB_URI environment variable.
 * Only the backend ever talks to the database — the React frontend never
 * receives this connection string.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
