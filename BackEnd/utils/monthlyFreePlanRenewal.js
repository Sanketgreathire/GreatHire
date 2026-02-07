import cron from "node-cron";
import { Company } from "../models/company.model.js";

// Run every day at midnight to check for monthly free plan renewal
export const startMonthlyFreePlanRenewal = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("🔄 Running monthly free plan renewal check...");

      const now = new Date();
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

      // Find companies that need free plan renewal
      const companies = await Company.find({
        lastFreePlanRenewal: { $lte: oneMonthAgo },
        creditedForJobs: { $lt: 1000 },
        creditedForCandidates: { $lt: 5 },
      });

      for (const company of companies) {
        // Renew free plan credits
        company.creditedForJobs = 1000; // 2 job posts
        company.creditedForCandidates = 5; // 5 candidate views
        company.lastFreePlanRenewal = new Date();
        await company.save();

        console.log(`✅ Renewed free plan for company: ${company.companyName}`);
      }

      console.log(`✅ Monthly free plan renewal completed. ${companies.length} companies renewed.`);
    } catch (error) {
      console.error("❌ Error in monthly free plan renewal:", error);
    }
  });
};
