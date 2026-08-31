import mongoose from "mongoose";

const emailNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed"],
      default: "pending",
    },

    attempts: {
      type: Number,
      default: 0,
    },

    sentAt: {
      type: Date,
      default: null,
    },

    lastError: {
      type: String,
      default: null,
    },

    nextRetryAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent sending the same job notification
// to the same candidate more than once.
emailNotificationSchema.index(
  { recipient: 1, job: 1 },
  { unique: true }
);

// Useful for finding pending emails
emailNotificationSchema.index({
  status: 1,
  nextRetryAt: 1,
});

const EmailNotification =
  mongoose.models.EmailNotification ||
  mongoose.model("EmailNotification", emailNotificationSchema);

export default EmailNotification;