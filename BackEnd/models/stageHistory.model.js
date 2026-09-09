import mongoose from "mongoose";

const stageHistorySchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
       fromStage: {
      type: String,
      enum: ["Application", "Screening", "Shortlisted", "Interview", "Selected", "Joined", "Closed"],
      default: null,
    },
    toStage: {
      type: String,
      enum: ["Application", "Screening", "Shortlisted", "Interview", "Selected", "Joined", "Closed"],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const StageHistory = mongoose.model("StageHistory", stageHistorySchema);

export default StageHistory;