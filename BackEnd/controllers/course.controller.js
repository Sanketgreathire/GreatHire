import { CourseEnquiry } from "../models/courseEnquiry.model.js";
import { OtpModel } from "../models/otp.model.js";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/v1/courses/counsellor/send-otp  (public)
export const sendCounsellorOtp = async (req, res) => {
  const { email, phone } = req.body;
  if (!email || !phone)
    return res.status(400).json({ success: false, message: "Email and phone required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await OtpModel.findOneAndUpdate(
    { phone },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ✅ use service instead of manual host/port/tls
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Must be Gmail App Password (16 chars)
      },
    });

    await transporter.sendMail({
      from: `"GreatHire" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP - Talk to Counsellor | GreatHire",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9f9f9;">
          <div style="background:#fff;border-radius:10px;padding:28px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <h2 style="color:#1D4ED8;margin:0 0 4px;">Great<span style="color:#111;">Hire</span></h2>
            <p style="color:#555;margin:16px 0 8px;">Your OTP for Talk to Counsellor:</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#1D4ED8;text-align:center;padding:16px 0;">${otp}</div>
            <p style="color:#888;font-size:13px;margin:12px 0 0;">Valid for <strong>10 minutes</strong>. Do not share this OTP with anyone.</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${email} for phone ${phone}`);
    return res.json({ success: true, message: "OTP sent to email" });

  } catch (err) {
    console.error("❌ OTP email error code:", err.code);
    console.error("❌ OTP email error message:", err.message);

    // Clean up so user can retry cleanly
    await OtpModel.deleteOne({ phone });

    // Specific messages based on nodemailer error codes
    let message = "Failed to send OTP. Please try again.";
    if (err.code === "EAUTH") message = "Email authentication failed. Contact support.";
    if (err.code === "ECONNECTION" || err.code === "ETIMEDOUT") message = "Mail server unreachable. Try again later.";

    return res.status(500).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { debug: err.message }),
    });
  }
};

// POST /api/v1/courses/counsellor/verify-otp  (public)
export const verifyCounsellorOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.status(400).json({ success: false, message: "Phone and OTP are required" });

  const record = await OtpModel.findOne({ phone });

  if (!record)
    return res.status(400).json({ success: false, message: "OTP not found. Please request a new one." });

  if (record.otp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });

  await OtpModel.deleteOne({ phone });
  return res.json({ success: true, message: "OTP verified successfully" });
};

// POST /api/v1/courses/enquiry  (public)
export const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, courseName, fee, mode, batch, type } = req.body;

    if (!name || !email || !phone || !courseName || !type) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const entry = await CourseEnquiry.create({ name, email, phone, courseName, fee, mode, batch, type });
    return res.status(201).json({ success: true, message: "Submitted successfully", data: entry });

  } catch (error) {
    console.error("submitEnquiry error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/v1/courses/admin/all  (admin)
export const getAllEnquiries = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const filter = type ? { type } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      CourseEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      CourseEnquiry.countDocuments(filter),
    ]);

    const counts = await CourseEnquiry.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const summary = { enquiry: 0, demo: 0, enrollment: 0, counsellor: 0 };
    counts.forEach((c) => { summary[c._id] = c.count; });

    return res.status(200).json({ success: true, data, total, summary });

  } catch (error) {
    console.error("getAllEnquiries error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/v1/courses/admin/:id  (admin)
export const deleteEnquiry = async (req, res) => {
  try {
    const entry = await CourseEnquiry.findByIdAndDelete(req.params.id);
    if (!entry)
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("deleteEnquiry error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/v1/courses/admin/:id/status  (admin)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status)
      return res.status(400).json({ success: false, message: "Status is required" });

    const entry = await CourseEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!entry)
      return res.status(404).json({ success: false, message: "Enquiry not found" });

    return res.status(200).json({ success: true, data: entry });

  } catch (error) {
    console.error("updateStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/v1/courses/payment/create-order  (public)
export const createCourseOrder = async (req, res) => {
  try {
    const { name, email, phone, courseName, amount, batch, mode } = req.body;
    if (!name || !email || !phone || !courseName || !amount)
      return res.status(400).json({ success: false, message: "Required fields missing" });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `course_${Date.now()}`,
    });

    const entry = await CourseEnquiry.create({
      name, email, phone, courseName,
      fee: `₹${amount.toLocaleString("en-IN")}`,
      batch: batch || "",
      mode: mode || "Online",
      type: "enrollment",
      razorpayOrderId: order.id,
      paymentStatus: "pending",
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      enrollmentId: entry._id,
    });
  } catch (error) {
    console.error("createCourseOrder error:", error);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// POST /api/v1/courses/payment/verify  (public)
export const verifyCoursePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ success: false, message: "Payment verification failed" });

    await CourseEnquiry.findByIdAndUpdate(enrollmentId, {
      paymentId: razorpay_payment_id,
      paymentStatus: "paid",
      status: "enrolled",
    });

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("verifyCoursePayment error:", error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};