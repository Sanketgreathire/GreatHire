import Razorpay from "razorpay";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { CandidateSubscription } from "../models/candidateSubscription.model.js";
import { isUserAssociated } from "./company.controller.js";

// ✅ Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    // 🔐 Check recruiter-company association
    const isAssociated = await isUserAssociated(companyId, userId);
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
    await JobSubscription.create({
      planName,
      creditedForJobs: creditsForJobs,               // ✅ FIXED
      creditedForCandidates: creditsForCandidates,   // ✅ FIXED
      price: amount,                                 // ✅ REQUIRED
      razorpayOrderId: order.id,                     // ✅ REQUIRED
      company: companyId,
      status: "Hold",
      paymentStatus: "created",
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // PRODUCTION: 1 month from now
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
