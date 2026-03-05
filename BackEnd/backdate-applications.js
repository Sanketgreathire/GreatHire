import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Application } from "./models/application.model.js";
import connectDB from "./utils/db.js";

/**
 * Utility script to backdate applications for testing auto-reject feature
 * Usage: node BackEnd/backdate-applications.js
 */

const backdateApplications = async () => {
  try {
    await connectDB();
    
    console.log("🔍 Finding pending applications...");
    
    // Find all pending applications
    const pendingApps = await Application.find({ status: "Pending" })
      .populate("applicant", "fullname emailId")
      .populate("job", "jobDetails");
    
    if (pendingApps.length === 0) {
      console.log("❌ No pending applications found");
      process.exit(0);
    }
    
    console.log(`📋 Found ${pendingApps.length} pending applications\n`);
    
    // Display applications with index
    pendingApps.forEach((app, index) => {
      console.log(`[${index + 1}] ${app.applicant?.fullname || 'Unknown'} - ${app.job?.jobDetails?.title || 'Unknown Job'}`);
      console.log(`    Created: ${app.createdAt.toLocaleDateString()}`);
      console.log(`    Email: ${app.applicant?.emailId?.email || 'N/A'}\n`);
    });
    
    // For testing, backdate the first application to 35 days ago
    if (pendingApps.length > 0) {
      const daysToBackdate = parseInt(process.env.AUTO_REJECT_DAYS || 30) + 5;
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - daysToBackdate);
      
      const appToUpdate = pendingApps[0];
      
      console.log(`\n⏰ Backdating first application to ${daysToBackdate} days ago...`);
      console.log(`   Application ID: ${appToUpdate._id}`);
      console.log(`   Candidate: ${appToUpdate.applicant?.fullname}`);
      console.log(`   Job: ${appToUpdate.job?.jobDetails?.title}`);
      console.log(`   Old Date: ${appToUpdate.createdAt.toLocaleDateString()}`);
      console.log(`   New Date: ${oldDate.toLocaleDateString()}`);
      
      // Update the createdAt date directly in MongoDB
      await Application.updateOne(
        { _id: appToUpdate._id },
        { $set: { createdAt: oldDate } }
      );
      
      console.log("\n✅ Application backdated successfully!");
      console.log("\n📝 Next steps:");
      console.log("   1. Run: node BackEnd/test-auto-reject.js");
      console.log("   2. Or call: POST /api/v1/application/auto-reject/trigger");
      console.log("   3. Check if application gets rejected and email is sent");
    }
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

backdateApplications();
