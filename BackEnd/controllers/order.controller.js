import Razorpay from "razorpay";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { CandidateSubscription } from "../models/candidateSubscription.model.js";
import { isUserAssociated } from "./company.controller.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrderForJobPlan = async (req, res) => {
  try { 
    const { planName, companyId, amount, jobBoost } = req.body;

    const userId = req.id;

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

    // Check if there's an active or "created" subscription for this company
    const existingSubscription = await JobSubscription.findOne({
      company: companyId,
      status: { $in: ["Hold", "Expired"] },
    });

    if (existingSubscription) {
      await JobSubscription.deleteOne({ _id: existingSubscription._id });
    }

    // Create a Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Create a new subscription in the database
    const newSubscription = new JobSubscription({
      planName,
      price: amount,
      razorpayOrderId: razorpayOrder.id,
      company: companyId,
      paymentStatus: "created",
      jobBoost,
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

export const createOrderForCandidatePlan = async (req, res) => {
  try {
    const { planName, companyId, amount, creditBoost } = req.body;
    const userId = req.id;

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

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Create a new subscription in the database
    const newSubscription = new CandidateSubscription({
      planName,
      price: amount,
      razorpayOrderId: razorpayOrder.id,
      company: companyId,
      paymentStatus: "created",
      creditBoost,
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
