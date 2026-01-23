import Razorpay from "razorpay";
// import { JobSubscription } from "../models/jobSubscription.model.js";
// import { CandidateSubscription } from "../models/candidateSubscription.model.js";
import { isUserAssociated } from "./company.controller.js";

// creating razorpay object or instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// this one create order for job plan
export const createOrderForJobPlan = async (req, res) => {
  try { 
    const { planName, companyId, amount, creditsForJobs,creditsForCandidates } = req.body;
    console.log("req.body", req.body);

    const userId = req.id; // recruiter id
    //console.log("userId:", userId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized: no user ID" });


    const isAssociated = await isUserAssociated(companyId, userId);
    if (!isAssociated) {
      return res.status(403).json({
        message: "You are not authorized",
        success: false,
      });
    }
    

    // Validate input
    if (!planName || !companyId || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if there's an active or "created" subscription for this company
    const existingSubscription = await JobSubscription.findOne({
      company: companyId,
      status: { $in: ["Hold", "Expired"] },
    });

    // if any plan existing of a company, first remove old one.
    if (existingSubscription) {
      await JobSubscription.deleteOne({ _id: existingSubscription._id });
    }

    // Create a Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
 
    // creating razorpay order
    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Create a new subscription in the database
    const newSubscription = new JobSubscription({
      planName,
      price: amount,
      razorpayOrderId: razorpayOrder.id,
      company: companyId,
      paymentStatus: "created",
      creditedForJobs: creditsForJobs,
      creditedForCandidates: creditsForCandidates,
    });

    await newSubscription.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount / 100, // Convert to INR
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create order", error });
  }
};

// this one create order for candidate plan
export const createOrderForCandidatePlan = async (req, res) => {
  try {
    const { planName, companyId, amount, credits } = req.body;
    const userId = req.id; // recruiter id
    console.log(" create orsed for candiate plan req.body", req.body);

    if (!isUserAssociated(companyId, userId)) {
      return res.status(403).json({
        message: "You are not authorized",
        success: false,
      });
    }

    // Validate input
    if (!planName || !companyId || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check for an existing order
    const existingSubscription = await JobSubscription.findOne({
      company: companyId,
      status: { $in: ["Hold", "Expired"] },
    });

    // If an existing order is found, delete it before creating a new one
    if (existingSubscription) {
      await CandidateSubscription.deleteOne({ _id: existingSubscription._id });
    }

    // Create a new Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // creating razorpay order
    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Create a new subscription in the database
    const newSubscription = new CandidateSubscription({
      planName,
      price: amount,
      razorpayOrderId: razorpayOrder.id,
      company: companyId,
      paymentStatus: "created",
      credits,
    });

    await newSubscription.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount / 100, // Convert to INR
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create order", error });
  }
};
