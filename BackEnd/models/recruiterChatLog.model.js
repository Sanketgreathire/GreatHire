import mongoose from "mongoose";

const recruiterChatLogSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    recruiterEmail: {
      type: String,
      default: "",
    },
    recruiterName: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    userMessage: {
      type: String,
      required: true,
    },
    botReply: {
      type: String,
      required: true,
    },
    detectedCategory: {
      type: String,
      default: "",
    },
    isRestricted: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const RecruiterChatLog = mongoose.model("RecruiterChatLog", recruiterChatLogSchema);
