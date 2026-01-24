import mongoose from "mongoose";

const blacklistedCompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    adminEmail: {
      type: String,
      required: true,
      unique: true,
    },
    CIN: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      default: "Deleted by recruiter",
    },
    blacklistedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const BlacklistedCompany = mongoose.model(
  "BlacklistedCompany",
  blacklistedCompanySchema
);
