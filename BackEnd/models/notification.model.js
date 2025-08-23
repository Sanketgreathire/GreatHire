// notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel",
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["User", "Recruiter", "Admin", "Company"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      enum: ["User", "Recruiter", "Admin", "Company", null],
    },
    type: {
      type: String,
      required: true,
      enum: [
        "application-submitted",
        "application-status-changed", 
        "application-viewed",
        "application-shortlisted",
        "application-rejected",
        "new-job-match",
        "job-posted",
        "job-expired",
        "profile-viewed",
        "plan-expiry",
        "plan-renewed",
        "new-message",
        "interview-scheduled",
        "interview-reminder",
        "system-alert",
        "welcome",
        "job-recommendation",
        "similar-candidates",
        "company-follow"
      ],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedEntityModel",
    },
    relatedEntityModel: {
      type: String,
      enum: ["Job", "Application", "Order", "User", "Company", null],
    },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    actionUrl: { type: String }, // URL to redirect when notification is clicked
    imageUrl: { type: String }, // For profile pictures, company logos, etc.
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification; // <-- default export
