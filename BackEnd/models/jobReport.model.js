import mongoose from "mongoose";

const jobReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    reportTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // NEW FIELDS
    reportType: {
      type: String,
      enum: ["offensive", "money", "incorrect", "selling", "other"],
      required: true,
    },

    // Panel: Offensive / Harassment
    offensiveDetails: {
      offensiveType: { type: String, trim: true },   // e.g. "Sexual harassment"
      offensiveWhere: { type: String, trim: true },  // e.g. "During interview / call"
    },

    // Panel: Money / Fake Job
    moneyDetails: {
      feeAmount: { type: Number },
      paymentMode: { type: String, trim: true },  // e.g. "UPI / GPay / PhonePe"
      feeReason: { type: String, trim: true },  // e.g. "Registration / Joining Fee"
      didPay: { type: String, enum: ["yes", "no", "partial", ""] },
    },
    // Panel: Incorrect Details
    incorrectDetails: {
      wrongFields: { type: [String], default: [] }, // e.g. ["company", "salary"]
      correctInfo: { type: String, trim: true },
    },

    // Panel: Selling Something
    sellingDetails: {
      sellingWhat: { type: String, trim: true },  // e.g. "MLM / Network marketing"
      askedToBuy: { type: String, enum: ["yes", "no", "unclear", ""] },
    },
    // Panel: Other
    otherDetails: {
      otherCategory: { type: String, trim: true }, // e.g. "Ghost job (never responds)"
    },

    screenshots: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["seen", "unseen"],
      default: "unseen",
    },
  },
  {
    timestamps: true,
  }
);

const JobReport = mongoose.model("JobReport", jobReportSchema);
export default JobReport;
