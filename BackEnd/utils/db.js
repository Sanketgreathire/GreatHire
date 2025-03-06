import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/great_hire_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 500, // Limits concurrent connections
      minPoolSize: 10, // Keeps at least 10 connections alive
    });

    console.log("✅ MongoDB Connected Successfully");

    // Handling reconnections
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected! Attempting to reconnect...");
      setTimeout(connectDB, 5000); // Retry connection after 5 seconds
    });

  } catch (error) {
    console.error("❌ Initial MongoDB Connection Failed:", error);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;
