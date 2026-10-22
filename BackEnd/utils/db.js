import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/great_hire_db", {
      maxPoolSize: 500,
      minPoolSize: 10,
      socketTimeoutMS: 45000
    });
    console.log(`MongoDB Connected 🔥`);
    return conn;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;



