import cron from "node-cron";
import { Company } from "../models/company.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";

// PRODUCTION: Run daily at midnight (change to "* * * * *" for testing - every minute)
export const startMonthlyFreePlanRenewal = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("🔄 Running monthly free plan renewal check...");

      const now = new Date();
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1)); // PRODUCTION: 1 month ago

      // Find companies that need free plan renewal (only those WITHOUT active paid plans)
      const companies = await Company.find({
        maxJobPosts: 0, // Only free plan users
        $or: [
          {
            lastFreePlanRenewal: { $lte: oneMonthAgo },
            creditedForJobs: { $lt: 1000 },
          },
          {
            lastFreePlanRenewal: { $lte: oneMonthAgo },
            creditedForCandidates: { $lt: 5 },
          },
          {
            lastFreePlanRenewal: { $exists: false }, // Older companies without this field
            creditedForJobs: { $lt: 1000 },
          },
          {
            lastFreePlanRenewal: null, // Companies with null value
            creditedForJobs: { $lt: 1000 },
          }
        ]
      });

      for (const company of companies) {
        // Double-check: Skip if company has active paid plan
        const activePlan = await JobSubscription.findOne({
          company: company._id,
          status: "Active"
        });

        if (activePlan) {
          console.log(`⏭️ Skipping company ${company.companyName} - has active paid plan`);
          continue;
        }

        // Renew free plan credits
        company.creditedForJobs = 1000; // 2 job posts
        company.creditedForCandidates = 5; // 5 candidate views
        company.maxJobPosts = 0; // Reset maxJobPosts
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
