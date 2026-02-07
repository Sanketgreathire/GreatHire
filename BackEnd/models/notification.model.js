// notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Recipient is required"],
      refPath: "recipientModel",
    },
    recipientModel: {
      type: String,
      required: [true, "Recipient model is required"],
      enum: {
        values: ["User", "Recruiter", "Admin", "Company"],
        message: "Recipient model must be User, Recruiter, Admin, or Company"
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      enum: {
        values: ["User", "Recruiter", "Admin", "Company"],
        message: "Sender model must be User, Recruiter, Admin, or Company"
      },
    },
    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: [
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
        message: "Invalid notification type"
      },
    },
    title: { 
      type: String, 
      required: [true, "Title is required"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    message: { 
      type: String, 
      required: [true, "Message is required"],
      maxlength: [1000, "Message cannot exceed 1000 characters"]
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedEntityModel",
    },
    relatedEntityModel: {
      type: String,
      enum: {
        values: ["Job", "Application", "Order", "User", "Company", null],
        message: "Related entity model must be Job, Application, Order, User, Company, or null"
      },
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "Priority must be low, medium, high, or urgent"
      },
      default: "medium"
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    actionUrl: { 
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^(https?:\/\/|\/)/.test(v);
        },
        message: "Action URL must be a valid URL or path"
      }
    },
    imageUrl: { 
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Image URL must be a valid HTTP/HTTPS URL"
      }
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
notificationSchema.index({ recipient: 1, recipientModel: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

// Add validation middleware
notificationSchema.pre('save', function() {
  // Ensure sender and senderModel are consistent
  if (this.sender && !this.senderModel) {
    throw new Error('senderModel is required when sender is provided');
  }
  if (!this.sender && this.senderModel) {
    throw new Error('sender is required when senderModel is provided');
  }
  
  // Ensure relatedEntity and relatedEntityModel are consistent
  if (this.relatedEntity && !this.relatedEntityModel) {
    throw new Error('relatedEntityModel is required when relatedEntity is provided');
  }
  if (!this.relatedEntity && this.relatedEntityModel) {
    throw new Error('relatedEntity is required when relatedEntityModel is provided');
  }
});

// ✅ Prevent OverwriteModelError
const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification; // <-- default export
