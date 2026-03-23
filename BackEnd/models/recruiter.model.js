
import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    emailId: {
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
      },
      isVerified: { 
        type: Boolean, 
        default: false 
      },
      otp: { 
        type: String, 
        default: null 
      },       
      otpExpiry: { 
        type: Date, 
        default: null 
      }, 

    },
    phoneNumber: {
      number: {
        type: String,
      },
      isVerified: {
        type: Boolean,
      },
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "recruiter",
    },
    position: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "", // Added new field for company name
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
    isActive: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
      enum: ["FREE", "STANDARD", "PREMIUM", "ENTERPRISE"],
      default: "FREE",
    },
    subscriptionStatus: {
      type: String,
      enum: ["INACTIVE", "ACTIVE", "EXPIRED"],
      default: "INACTIVE",
    },
    isRecruiterLoggedIn: {
      type: Boolean,
      default: false,
    },
    isCompanyDetailsCompleted: {
      type: Boolean,
      default: false,
    },
    lastLoginTime: {
      type: Date,
      default: null,
    },
    reminderEmailSent: {
      type: Boolean,
      default: false,
    },
    remainingJobPosts: {
      type: Number,
      default: 0,
    },
    candidateReferralsCount: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
  },

  { timestamps: true }
);

export const Recruiter = mongoose.model("Recruiter", recruiterSchema);