import cron from "node-cron";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { CandidateSubscription } from "../models/candidateSubscription.model.js";
import { Company } from "../models/company.model.js";
import Notification from "../models/notification.model.js";
import notificationService from "../utils/notificationService.js";

// On the 15th: look this many days ahead for plans about to expire.
const LOOKAHEAD_DAYS = 35;
const LOOKBACK_DAYS = 35;

const msPerDay = 24 * 60 * 60 * 1000;

const daysBetween = (a, b) => Math.ceil((a.getTime() - b.getTime()) / msPerDay);
const alreadyNotifiedToday = async (recruiterId, expiryDate, expired) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const existing = await Notification.findOne({
    recipient: recruiterId,
    type: "plan-expiry",
    createdAt: { $gte: startOfDay },
    "metadata.expiryDate": new Date(expiryDate),
    "metadata.expired": !!expired,
  }).lean();

  return !!existing;
};

const notifyCompanyRecruiters = async (company, planType, expiryDate, daysLeft, expired) => {
  if (!company || !Array.isArray(company.userId) || company.userId.length === 0) {
    console.warn(`[planExpiryNotifier] Company ${company?._id} has no recruiters to notify`);
    return;
  }

  for (const entry of company.userId) {
    const recruiterId = entry.user;
    if (!recruiterId) continue;

    try {
      const alreadySent = await alreadyNotifiedToday(recruiterId, expiryDate, expired);
      if (alreadySent) {
        console.log(
          `[planExpiryNotifier] Skipping recruiter ${recruiterId} — already notified today for this plan/expiry`
        );
        continue;
      }

      await notificationService.notifyPlanExpiry({
        userId: recruiterId,
        userType: "recruiter",
        planType,
        expiryDate,
        daysLeft,
        expired,
      });
    } catch (err) {
      console.error(
        `[planExpiryNotifier] Failed to notify recruiter ${recruiterId} for company ${company._id}:`,
        err.message
      );
    }
  }
};

export const runExpiringSoonCheck = async () => {
  const now = new Date();
  const lookaheadDate = new Date(now.getTime() + LOOKAHEAD_DAYS * msPerDay);

  console.log(`[planExpiryNotifier] Running "expiring soon" check at ${now.toISOString()}`);

  // ---------- Job Posting Subscriptions ----------
  try {
    const expiringJobSubs = await JobSubscription.find({
      status: "Active",
      expiryDate: { $gte: now, $lte: lookaheadDate },
    }).lean();

    console.log(`[planExpiryNotifier] Found ${expiringJobSubs.length} soon-to-expire JobSubscription(s)`);

    for (const sub of expiringJobSubs) {
      const company = await Company.findById(sub.company).lean();
      if (!company) continue;

      const daysLeft = daysBetween(new Date(sub.expiryDate), now);
      await notifyCompanyRecruiters(
        company,
        sub.planName || company.plan || "Job Posting",
        sub.expiryDate,
        daysLeft,
        false
      );
    }
  } catch (err) {
    console.error("[planExpiryNotifier] Error checking JobSubscriptions (expiring soon):", err);
  }

  // ---------- Candidate Database Subscriptions ----------
  try {
    const expiringCandidateSubs = await CandidateSubscription.find({
      status: "Active",
      expiryDate: { $gte: now, $lte: lookaheadDate },
    }).lean();

    console.log(`[planExpiryNotifier] Found ${expiringCandidateSubs.length} soon-to-expire CandidateSubscription(s)`);

    for (const sub of expiringCandidateSubs) {
      const company = await Company.findById(sub.company).lean();
      if (!company) continue;

      const daysLeft = daysBetween(new Date(sub.expiryDate), now);
      await notifyCompanyRecruiters(
        company,
        sub.planName || company.plan || "Candidate Database",
        sub.expiryDate,
        daysLeft,
        false
      );
    }
  } catch (err) {
    console.error("[planExpiryNotifier] Error checking CandidateSubscriptions (expiring soon):", err);
  }

  try {
    const freeCompanies = await Company.find({
      plan: "FREE",
      freePlanExpiry: { $gte: now, $lte: lookaheadDate },
    }).lean();

    console.log(`[planExpiryNotifier] Found ${freeCompanies.length} soon-to-expire FREE plan compan${freeCompanies.length === 1 ? "y" : "ies"}`);

    for (const company of freeCompanies) {
      const expiry = new Date(company.freePlanExpiry);
      const daysLeft = Math.max(0, daysBetween(expiry, now));
      await notifyCompanyRecruiters(company, "Free", expiry, daysLeft, false);
    }
  } catch (err) {
    console.error("[planExpiryNotifier] Error checking FREE plan companies (expiring soon):", err);
  }

  console.log("[planExpiryNotifier] \"Expiring soon\" check complete.");
};

export const runExpiredCheck = async () => {
  const now = new Date();
  const lookbackDate = new Date(now.getTime() - LOOKBACK_DAYS * msPerDay);

  console.log(`[planExpiryNotifier] Running "expired" check at ${now.toISOString()}`);

  // ---------- Job Posting Subscriptions ----------
  try {
    const expiredJobSubs = await JobSubscription.find({
      status: { $in: ["Active", "Expired"] },
      expiryDate: { $gte: lookbackDate, $lte: now },
    }).lean();

    console.log(`[planExpiryNotifier] Found ${expiredJobSubs.length} expired JobSubscription(s)`);

    for (const sub of expiredJobSubs) {
      const company = await Company.findById(sub.company).lean();
      if (!company) continue;

      await notifyCompanyRecruiters(
        company,
        sub.planName || company.plan || "Job Posting",
        sub.expiryDate,
        0,
        true
      );
    }
  } catch (err) {
    console.error("[planExpiryNotifier] Error checking JobSubscriptions (expired):", err);
  }

  // ---------- Candidate Database Subscriptions ----------
  try {
    const expiredCandidateSubs = await CandidateSubscription.find({
      status: { $in: ["Active", "Expired"] },
      expiryDate: { $gte: lookbackDate, $lte: now },
    }).lean();

    console.log(`[planExpiryNotifier] Found ${expiredCandidateSubs.length} expired CandidateSubscription(s)`);

    for (const sub of expiredCandidateSubs) {
      const company = await Company.findById(sub.company).lean();
      if (!company) continue;

      await notifyCompanyRecruiters(
        company,
        sub.planName || company.plan || "Candidate Database",
        sub.expiryDate,
        0,
        true
      );
    }
  } catch (err) {
    console.error("[planExpiryNotifier] Error checking CandidateSubscriptions (expired):", err);
  }

  // ---------- Free Plan Companies ----------
  try {
    const freeCompanies = await Company.find({
      plan: "FREE",
      freePlanExpiry: { $gte: lookbackDate, $lte: now },
    }).lean();

    console.log(`[planExpiryNotifier] Found ${freeCompanies.length} expired FREE plan compan${freeCompanies.length === 1 ? "y" : "ies"}`);

    for (const company of freeCompanies) {
      const expiry = new Date(company.freePlanExpiry);
      await notifyCompanyRecruiters(company, "Free", expiry, 0, true);
    }
  } catch (err) {
    console.error("[planExpiryNotifier] Error checking FREE plan companies (expired):", err);
  }

  console.log("[planExpiryNotifier] \"Expired\" check complete.");
};

export const startPlanExpiryNotifier = () => {
  cron.schedule("0 9 15 * *", () => {
    console.log("[planExpiryNotifier] Triggering 15th-of-month 'expiring soon' run");
    runExpiringSoonCheck().catch((err) =>
      console.error("[planExpiryNotifier] Unhandled error in 15th-day run:", err)
    );
  });

  cron.schedule("0 9 20 * *", () => {
    console.log("[planExpiryNotifier] Triggering 20th-of-month 'expired' run");
    runExpiredCheck().catch((err) =>
      console.error("[planExpiryNotifier] Unhandled error in 20th-day run:", err)
    );
  });

  console.log(
    "[planExpiryNotifier] Scheduled: 15th ('expiring soon') and 20th ('plan expired') of every month at 9:00 AM"
  );
};