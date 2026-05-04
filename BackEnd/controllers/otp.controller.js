import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { OtpModel } from "../models/otp.model.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_REQUESTS_PER_WINDOW = 3;
const WINDOW_MINUTES = 10;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const isRateLimited = (lastRequest, attempts) => {
  if (!lastRequest) return false;
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  return lastRequest > windowStart && attempts >= MAX_REQUESTS_PER_WINDOW;
};

// POST /api/v1/otp/send-email
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    let record = await OtpModel.findOne({ email });

    if (record && isRateLimited(record.lastEmailRequest, record.emailAttempts)) {
      return res.status(429).json({ success: false, message: "Too many OTP requests. Try again after 10 minutes." });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    if (record) {
      const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
      const newAttempts = record.lastEmailRequest > windowStart ? record.emailAttempts + 1 : 1;
      record.emailOtp = hashedOtp;
      record.emailOtpExpiry = expiry;
      record.emailVerified = false;
      record.emailAttempts = newAttempts;
      record.lastEmailRequest = new Date();
      await record.save();
    } else {
      await OtpModel.create({
        email,
        emailOtp: hashedOtp,
        emailOtpExpiry: expiry,
        emailAttempts: 1,
        lastEmailRequest: new Date(),
      });
    }

    await transporter.sendMail({
      from: `"GreatHire" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your GreatHire Email Verification OTP",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:10px;">
          <h2 style="color:#1D4ED8;text-align:center;">Great<span style="color:#333;">Hire</span></h2>
          <p style="color:#555;">Your email verification OTP is:</p>
          <div style="text-align:center;margin:24px 0;">
            <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1D4ED8;">${otp}</span>
          </div>
          <p style="color:#888;font-size:13px;">This OTP expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
        </div>`,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("sendEmailOtp error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// POST /api/v1/otp/verify-email
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

    const record = await OtpModel.findOne({ email });
    if (!record || !record.emailOtp) return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    if (record.emailVerified) return res.status(400).json({ success: false, message: "Email already verified" });
    if (new Date() > record.emailOtpExpiry) return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });

    const isMatch = await bcrypt.compare(otp, record.emailOtp);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    record.emailVerified = true;
    record.emailOtp = null;
    await record.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyEmailOtp error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
