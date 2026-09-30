import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mode: {
      type: String,
      enum: ["in-person", "video"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Pending", "Rescheduled", "No-show"],
      default: "Scheduled",
    },
    feedback: {
      type: String,
      default: "",
    },
    zoomLink: {
      type: String,
      default: "",
    },
    calendarEventId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;