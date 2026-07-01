import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/great_hire_db", {
      maxPoolSize: 500,
      minPoolSize: 10,
      socketTimeoutMS: 45000
    });
    console.log(`MongoDB Connected 🔥`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;
