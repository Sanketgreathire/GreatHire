import mongoose from "mongoose";

const failedJobSchema = new mongoose.Schema(
  {
    jobType: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastError: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["failed", "resolved"],
      default: "failed",
    },
  },
  { timestamps: true }
);

export const FailedJob = mongoose.model("FailedJob", failedJobSchema);