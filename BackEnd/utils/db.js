import mongoose from "mongoose";
import dns from "dns";

// Force Google DNS to resolve Atlas SRV records (local router DNS fails SRV lookups)
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const connectDB = async (retries = 5, delay = 5000) => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/great_hire_db";
  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(uri, {
        maxPoolSize: 500,
        minPoolSize: 10,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected 🔥 [${uri.startsWith("mongodb+srv") ? "Atlas" : "Local"}]`);
      return;
    } catch (error) {
      console.error(`MongoDB Connection Error (attempt ${i}/${retries}):`, error.message);
      if (i === retries) {
        console.error("All retries exhausted. Exiting.");
        process.exit(1);
      }
      console.log(`Retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

// Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;
