
import mongoose from "mongoose";


const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     applicantName: { type: String },
    applicantEmail: { type: String },
    applicantPhone: { type: String },
    applicantProfile: { type: Object }, 
    resume: { type: String },
    answers: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Interview Schedule", "Shortlisted", "Rejected"],
      default: "Pending",
    },
    aiInterview: {
      status: {
        type: String,
        enum: ["Not Started", "Scheduled", "Completed", "Failed"],
        default: "Not Started",
      },
      blandCallId: { type: String, default: "" },
      transcript: { type: String, default: "" },
      recordingUrl: { type: String, default: "" },
      questions: { type: String, default: "" },
      score: { type: Number, default: 0 },
      matchScore: { type: Number, default: 0 },
      skillsMatched: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
    },
  },
   
  { timestamps: true }
  
);
// const Application = mongoose.model("Application", applicationSchema);
// export default Application;

export const Application = mongoose.model("Application", applicationSchema);

