import mongoose from "mongoose";
import { Company } from "./models/company.model.js";
import { JobSubscription } from "./models/jobSubscription.model.js";
import dotenv from "dotenv";

dotenv.config();

const migratePaidPlanFreeJobs = async () => {
  try {
    console.log("🔄 Starting migration for paid plan free jobs...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find all companies that don't have the new fields
    const companies = await Company.find({
      $or: [
        { paidPlanFreeJobsPosted: { $exists: false } },
        { paidPlanFreeJobsRenewal: { $exists: false } }
      ]
    });

    console.log(`📊 Found ${companies.length} companies to migrate`);

    let migratedCount = 0;
    for (const company of companies) {
      // Check if company has active paid plan
      const activePlan = await JobSubscription.findOne({
        company: company._id,
        status: "Active"
      });

      const updateData = {};
      
      // Initialize new fields
      if (company.paidPlanFreeJobsPosted === undefined) {
        updateData.paidPlanFreeJobsPosted = 0;
      }
      
      if (company.paidPlanFreeJobsRenewal === undefined) {
        // If company has active paid plan, set renewal date to now
        // Otherwise, leave as null
        updateData.paidPlanFreeJobsRenewal = activePlan ? new Date() : null;
      }

      if (Object.keys(updateData).length > 0) {
        await Company.findByIdAndUpdate(company._id, updateData);
        migratedCount++;
        console.log(`✅ Migrated company: ${company.companyName} (${activePlan ? 'Paid Plan' : 'Free Plan'})`);
      }
    }

    console.log(`🎉 Migration completed! ${migratedCount} companies migrated.`);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run migration
migratePaidPlanFreeJobs();