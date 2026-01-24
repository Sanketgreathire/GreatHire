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
