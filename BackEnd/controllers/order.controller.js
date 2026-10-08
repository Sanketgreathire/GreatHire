import Razorpay from "razorpay";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { CandidateSubscription } from "../models/candidateSubscription.model.js";
import { isUserAssociated, isUserAssociatedForPlan } from "./company.controller.js";
import { findJobPlan, findCandidatePlan } from "../config/plans.config.js";

// ✅ Razorpay instance
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ RAZORPAY credentials missing in environment variables");
  console.error("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "Present" : "Missing");
  console.error("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "Present" : "Missing");
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("✅ Razorpay initialized with key:", process.env.RAZORPAY_KEY_ID);

// ===============================
// CREATE ORDER FOR JOB PLAN
// ===============================
export const createOrderForJobPlan = async (req, res) => {
  try {
    const {
      planId,
      planName,
      companyId,
      amount,
      creditsForJobs,
      creditsForCandidates,
      durationMonths,
      aiSourcingCredits = 0,
      teamUserLimit = null,
    } = req.body;

    const userId = req.id; // recruiter id

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: no user ID" });
    }

    // 🔐 Check recruiter-company association (membership only — allows unverified recruiters to purchase)
    const isAssociated = await isUserAssociatedForPlan(companyId, userId);
    if (!isAssociated) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    // ✅ Validate input
    if ((!planId && !planName) || !companyId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🔒 Server-Authoritative Plan Lookup (Prevents Price Tampering)
    const serverPlan = findJobPlan(planId || planName);

    let finalPrice = Number(amount);
    let finalCreditsForJobs = Number(creditsForJobs);
    let finalCreditsForCandidates = Number(creditsForCandidates);
    let finalAiSourcingCredits = Number(aiSourcingCredits) || 0;
    let finalTeamUserLimit = teamUserLimit != null ? Number(teamUserLimit) : null;
    let finalDurationMonths = Number(durationMonths) || 1;
    let finalPlanName = planName || planId;

    if (serverPlan) {
      // Enforce strict server-side values
      finalPrice = serverPlan.price;
      finalCreditsForJobs = serverPlan.creditsForJobs;
      finalCreditsForCandidates = serverPlan.creditsForCandidates;
      finalAiSourcingCredits = serverPlan.aiSourcingCredits;
      finalTeamUserLimit = serverPlan.teamUserLimit;
      finalDurationMonths = serverPlan.durationMonths;
      finalPlanName = serverPlan.title;
    } else {
      // If plan not found in catalog, do not allow arbitrary small amounts (min ₹100 safety check)
      if (!finalPrice || finalPrice < 100) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan or amount specified",
        });
      }
    }

    // 🧹 Remove old Hold/Expired subscriptions (keep Active — it will be expired on payment success)
    await JobSubscription.deleteMany({
      company: companyId,
      status: { $in: ["Hold", "Expired"] },
    });

    // 💳 Create Razorpay order with server-enforced price
    const order = await razorpayInstance.orders.create({
      amount: Math.round(finalPrice * 100), // convert to paise
      currency: "INR",
      receipt: `jobplan_${Date.now()}`,
    });

    // 🧾 Save subscription (✅ schema-safe & server-verified)
    await JobSubscription.create({
      planName: finalPlanName,
      creditedForJobs: finalCreditsForJobs,
      creditedForCandidates: finalCreditsForCandidates,
      aiSourcingCredits: finalAiSourcingCredits,
      teamUserLimit: finalTeamUserLimit,
      price: finalPrice,                                 // ✅ Server-verified price
      razorpayOrderId: order.id,                         // ✅ REQUIRED
      company: companyId,
      status: "Hold",
      paymentStatus: "created",
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + finalDurationMonths)),
      purchaseDate: new Date(),
    });

    // ✅ Send response to frontend
    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating job plan order:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create job plan order",
    });
  }
};

// ===============================
// CREATE ORDER FOR CANDIDATE PLAN
// ===============================
export const createOrderForCandidatePlan = async (req, res) => {
  try {
    const { planName, companyId, amount, credits } = req.body;
    const userId = req.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const isAssociated = await isUserAssociated(companyId, userId);
    if (!isAssociated) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // 🔒 Server-Authoritative Candidate Plan Lookup
    const serverPlan = findCandidatePlan(planName);

    let finalPrice = Number(amount);
    let finalCredits = Number(credits);
    let finalPlanName = planName;

    if (serverPlan) {
      finalPrice = serverPlan.price;
      finalCredits = serverPlan.creditBoost;
      finalPlanName = serverPlan.title;
    } else {
      if (!finalPrice || finalPrice < 100) {
        return res.status(400).json({
          success: false,
          message: "Invalid candidate plan or amount specified",
        });
      }
    }

    const order = await razorpayInstance.orders.create({
      amount: Math.round(finalPrice * 100),
      currency: "INR",
      receipt: `candidateplan_${Date.now()}`,
    });

    await CandidateSubscription.create({
      planName: finalPlanName,
      creditedForCandidates: finalCredits,
      price: finalPrice,
      razorpayOrderId: order.id,
      company: companyId,
      status: "Hold",
      paymentStatus: "created",
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating candidate plan order:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create candidate plan order",
    });
  }
};
