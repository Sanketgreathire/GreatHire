import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "recruiter",
    },
    position:{
      type: String,
      default: "" 
    },
    maxPostJobs: {
      type: Number,
      default:10
    },
    maxResumeDownload: {
      type: Number,
      default:10
    },
    haveSubscription: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Number,
      default: 0,
    },
    isCompanyCreated: {
      type: Boolean,
      default: false,
    },
    profile: {
      
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },

  { timestamps: true }
);

export const Recruiter = mongoose.model("Recruiter", recruiterSchema);
