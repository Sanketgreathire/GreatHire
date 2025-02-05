import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/great_hire_db", {
      maxPoolSize: 500, // Limits concurrent connections
      minPoolSize: 10, // Keeps at least 10 connections alive
    });
    console.log(`MongoDB Connected 🔥`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit if connection fails
  }
};

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;
