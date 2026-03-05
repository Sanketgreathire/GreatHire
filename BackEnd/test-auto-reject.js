import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./utils/db.js";
import { autoRejectOldApplications } from "./utils/autoRejectApplications.js";

/**
 * Test script for auto-reject functionality
 * Usage: node BackEnd/test-auto-reject.js
 */

const testAutoReject = async () => {
  try {
    console.log("🧪 Testing Auto-Reject Feature\n");
    console.log("=" .repeat(50));
    
    // Connect to database
    console.log("\n1️⃣ Connecting to database...");
    await connectDB();
    console.log("✅ Connected to MongoDB");
    
    // Check configuration
    console.log("\n2️⃣ Checking configuration...");
    const autoRejectDays = process.env.AUTO_REJECT_DAYS || 30;
    console.log(`✅ AUTO_REJECT_DAYS: ${autoRejectDays} days`);
    console.log(`✅ EMAIL_USER: ${process.env.EMAIL_USER}`);
    
    // Run auto-reject
    console.log("\n3️⃣ Running auto-reject process...");
    console.log("=" .repeat(50));
    await autoRejectOldApplications();
    console.log("=" .repeat(50));
    
    console.log("\n✅ Test completed!");
    console.log("\n📝 Check the logs above to see:");
    console.log("   - How many applications were found");
    console.log("   - Which applications were rejected");
    console.log("   - If emails were sent successfully");
    console.log("   - Any errors that occurred");
    
    console.log("\n💡 Tips:");
    console.log("   - If no applications found, use: node BackEnd/backdate-applications.js");
    console.log("   - Check candidate email inbox for rejection email");
    console.log("   - Check MongoDB to verify status changed to 'Rejected'");
    console.log("   - Check notifications collection for in-app notifications");
    
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

testAutoReject();
