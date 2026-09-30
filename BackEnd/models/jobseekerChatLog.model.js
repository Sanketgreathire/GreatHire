import mongoose from "mongoose";

const jobseekerChatLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userEmail: {
      type: String,
      default: "",
    },
    userName: {
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
    detectedRole: {
      type: String,
      default: "",
    },
    detectedLocation: {
      type: String,
      default: "",
    },
    isJobSearch: {
      type: Boolean,
      default: false,
    },
    jobsCount: {
      type: Number,
      default: 0,
    },
    coursesCount: {
      type: Number,
      default: 0,
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

export const JobseekerChatLog = mongoose.model("JobseekerChatLog", jobseekerChatLogSchema);
