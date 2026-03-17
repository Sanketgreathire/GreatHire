import Razorpay from "razorpay";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { CandidateSubscription } from "../models/candidateSubscription.model.js";
import { isUserAssociated, isUserAssociatedForPlan } from "./company.controller.js";

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
      planName,
      companyId,
      amount,
      creditsForJobs,
      creditsForCandidates,
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
    if (!planName || !companyId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🧹 Remove old subscription if exists
    const existingSubscription = await JobSubscription.findOne({
      company: companyId,
      status: { $in: ["Hold", "Expired"] },
    });

    if (existingSubscription) {
      await JobSubscription.deleteOne({ _id: existingSubscription._id });
    }

    // 💳 Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `jobplan_${Date.now()}`,
    });

    // 🧾 Save subscription (✅ schema-safe)
    const expiryMonths = planName === "Enterprise Elite" ? 12 : 1;
    await JobSubscription.create({
      planName,
      creditedForJobs: creditsForJobs,               // ✅ FIXED
      creditedForCandidates: creditsForCandidates,   // ✅ FIXED
      price: amount,                                 // ✅ REQUIRED
      razorpayOrderId: order.id,                     // ✅ REQUIRED
      company: companyId,
      status: "Hold",
      paymentStatus: "created",
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + expiryMonths)),
      purchaseDate: new Date(), // ✅ Set purchase date when order is created
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
// (UNCHANGED – kept safe)
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

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `candidateplan_${Date.now()}`,
    });

    await CandidateSubscription.create({
      planName,
      creditedForCandidates: credits,
      price: amount,
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
