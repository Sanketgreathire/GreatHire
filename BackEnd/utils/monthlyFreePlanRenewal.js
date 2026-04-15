import cron from "node-cron";
import { Company } from "../models/company.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";

// Runs daily at midnight
export const startMonthlyFreePlanRenewal = () => {
  cron.schedule("0 0 * * *", async () => { // every day at midnight
    try {
      console.log("🔄 Running monthly free plan renewal check...");
      const now = new Date();

      // ── FREE PLAN RESET ──────────────────────────────────────────────────────
      // Find FREE plan companies whose 30-day window has expired
      const expiredFreeCompanies = await Company.find({
        plan: "FREE",
        hasSubscription: false,
        freePlanExpiry: { $lte: now },
      });

      for (const company of expiredFreeCompanies) {
        // Safety check: skip if a paid plan was activated in the meantime
        const activePaid = await JobSubscription.findOne({
          company: company._id,
          status: "Active",
        });
        if (activePaid) {
          console.log(`⏭️ Skipping ${company.companyName} — paid plan active`);
          continue;
        }

        // Strict reset — no carry-forward
        company.creditedForJobs = 1000;       // 2 job posts (500 credits each)
        company.creditedForCandidates = 5;    // 5 candidate views
        company.freeJobsPosted = 0;
        company.lastFreePlanRenewal = now;
        company.freePlanExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Fresh 30-day FREE window
        await company.save();

        console.log(`✅ FREE plan reset for: ${company.companyName}`);
      }

      // Paid plan expiry check
      const activeSubscriptions = await JobSubscription.find({
        status: "Active",
        expiryDate: { $lte: now },
      });

      for (const sub of activeSubscriptions) {
        await sub.checkValidity(); // हे company ला FREE वर reset करतं
      }
      console.log(`✅ ${activeSubscriptions.length} paid plans expired`);


      // ── PAID PLAN — free job slot monthly renewal (unchanged behaviour) ──────
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const paidPlanCompanies = await Company.find({
        hasSubscription: true,
        $or: [
          { paidPlanFreeJobsRenewal: { $lte: oneMonthAgo } },
          { paidPlanFreeJobsRenewal: { $exists: false } },
          { paidPlanFreeJobsRenewal: null },
        ],
      });

      for (const company of paidPlanCompanies) {
        const activePlan = await JobSubscription.findOne({
          company: company._id,
          status: "Active",
        });
        if (activePlan) {
          company.paidPlanFreeJobsPosted = 0;
          company.paidPlanFreeJobsRenewal = now;
          await company.save();
          console.log(`✅ Paid plan free jobs renewed for: ${company.companyName}`);
        }
      }

      console.log(
        `✅ Renewal complete — ${expiredFreeCompanies.length} FREE resets, ${paidPlanCompanies.length} paid renewals.`
      );
    } catch (error) {
      console.error("❌ Error in monthly free plan renewal:", error);
    }
  });
};
