import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, index: true },
  emailOtp: { type: String },
  emailOtpExpiry: { type: Date },
  emailVerified: { type: Boolean, default: false },
  emailAttempts: { type: Number, default: 0 },
  lastEmailRequest: { type: Date },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

export const OtpModel = mongoose.model("Otp", otpSchema);
