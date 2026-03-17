import mongoose from "mongoose";
import { Company } from "./models/company.model.js";
import { JobSubscription } from "./models/jobSubscription.model.js";
import dotenv from "dotenv";

dotenv.config();

const testPaidPlanFreeJobs = async () => {
  try {
    console.log("🧪 Testing paid plan free jobs functionality...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find a company with active paid plan
    const activePlan = await JobSubscription.findOne({ status: "Active" }).populate('company');
    
    if (!activePlan) {
      console.log("⚠️ No active paid plans found. Please create a paid plan first.");
      return;
    }

    const company = activePlan.company;
    console.log(`📊 Testing with company: ${company.companyName}`);
    console.log(`📋 Current plan: ${company.plan}`);
    console.log(`📈 Plan jobs posted this month: ${company.planJobsPostedThisMonth || 0}`);
    console.log(`🆓 Free jobs posted this month: ${company.paidPlanFreeJobsPosted || 0}`);
    
    // Calculate limits
    const PLAN_LIMITS = {
      STANDARD: 5,
      PREMIUM: 15,
      ENTERPRISE: Infinity
    };
    
    const PAID_PLAN_FREE_JOBS = 2;
    const paidPlanLimit = PLAN_LIMITS[company.plan] || 0;
    const totalAllowedJobs = paidPlanLimit === Infinity ? Infinity : paidPlanLimit + PAID_PLAN_FREE_JOBS;
    const totalJobsPosted = (company.planJobsPostedThisMonth || 0) + (company.paidPlanFreeJobsPosted || 0);
    
    console.log(`\n📊 Job Posting Limits:`);
    console.log(`   Paid plan limit: ${paidPlanLimit === Infinity ? 'Unlimited' : paidPlanLimit}`);
    console.log(`   Free jobs included: ${PAID_PLAN_FREE_JOBS}`);
    console.log(`   Total allowed: ${totalAllowedJobs === Infinity ? 'Unlimited' : totalAllowedJobs}`);
    console.log(`   Currently used: ${totalJobsPosted}`);
    console.log(`   Remaining: ${totalAllowedJobs === Infinity ? 'Unlimited' : totalAllowedJobs - totalJobsPosted}`);
    
    // Test free jobs consumption logic
    console.log(`\n🧪 Testing job posting logic:`);
    if ((company.paidPlanFreeJobsPosted || 0) < PAID_PLAN_FREE_JOBS) {
      console.log(`   ✅ Next job will consume FREE job post (${(company.paidPlanFreeJobsPosted || 0) + 1}/${PAID_PLAN_FREE_JOBS})`);
    } else {
      console.log(`   ✅ Next job will consume PAID job post (${(company.planJobsPostedThisMonth || 0) + 1}/${paidPlanLimit === Infinity ? 'Unlimited' : paidPlanLimit})`);
    }
    
    console.log(`\n🎉 Test completed successfully!`);
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run test
testPaidPlanFreeJobs();