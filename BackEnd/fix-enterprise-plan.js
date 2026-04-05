import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Company } from "./models/company.model.js";
import { JobSubscription } from "./models/jobSubscription.model.js";
import { Recruiter } from "./models/recruiter.model.js";

const PLAN_LIMITS = {
  FREE:       2,
  STANDARD:   5,
  PREMIUM:    15,
  ENTERPRISE: Infinity,
};

function getPlanTypeFromCredits(creditsForJobs) {
  if (creditsForJobs >= 999999) return "ENTERPRISE";
  if (creditsForJobs >= 15)     return "PREMIUM";
  if (creditsForJobs >= 5)      return "STANDARD";
  return "FREE";
}

async function fixEnterprisePlans() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Find all active subscriptions
  const activeSubs = await JobSubscription.find({ status: "Active", paymentStatus: "paid" });
  console.log(`Found ${activeSubs.length} active paid subscription(s)`);

  let fixed = 0;

  for (const sub of activeSubs) {
    const correctPlan = getPlanTypeFromCredits(sub.creditedForJobs);
    const company = await Company.findById(sub.company);

    if (!company) {
      console.log(`  ⚠️  Company not found for subscription ${sub._id}`);
      continue;
    }

    console.log(`\nCompany: ${company.companyName}`);
    console.log(`  Subscription: ${sub.planName} | creditsForJobs: ${sub.creditedForJobs}`);
    console.log(`  Current plan: ${company.plan} → Correct plan: ${correctPlan}`);

    if (company.plan !== correctPlan) {
      company.plan = correctPlan;
      company.hasSubscription = true;
      company.maxJobPosts = "Unlimited";
      await company.save();

      // Fix all recruiters under this company
      const recruiterIds = company.userId.map((u) => u.user);
      await Recruiter.updateMany(
        { _id: { $in: recruiterIds } },
        { plan: correctPlan, subscriptionStatus: "ACTIVE" }
      );

      console.log(`  ✅ Fixed → plan set to ${correctPlan}`);
      fixed++;
    } else {
      console.log(`  ✓  Already correct, no change needed`);
    }
  }

  console.log(`\n🎉 Done. Fixed ${fixed} company/companies.`);
  await mongoose.connection.close();
}

fixEnterprisePlans().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
