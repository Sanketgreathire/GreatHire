import mongoose from "mongoose";

const counsellorOtpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // auto-deletes after 10 min
});

export const CounsellorOtpModel = mongoose.model("CounsellorOtp", counsellorOtpSchema);