import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      //unique: true,
    },
    companyWebsite: {
      type: String,
    },
    industry: {
      type: String,
    },
    address: {
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
    },
    CIN: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true
    },
    businessFile: {
      type: String, // Store the file path or URL
    },
    bussinessFileName: {
      type: String,
    },
    maxJobPosts: {
      type: String,
      default: "Unlimited", // Default for Free plan
    },
    creditedForJobs: {
      type: Number,
      default: 1000, // 2 free job posts (500 credits each)
    },
    creditedForCandidates: {
      type: Number,
      default: 5, // 5 free candidate views
    },
    customCreditsForJobs: {
      type: Number,
      default: null, // Admin can set custom credits
    },
    customCreditsForCandidates: {
      type: Number,
      default: null, // Admin can set custom credits
    },
    customMaxJobPosts: {
      type: Number,
      default: null, // Admin can set custom max job posts
    },
    hasUsedFreePlan: {
      type: Boolean,
      default: false, // Track if user has used free plan
    },
    lastFreePlanRenewal: {
      type: Date,
      default: Date.now, // Track when free plan was last renewed
    },
    hasSubscription: { 
      type: Boolean, 
      default: false 
    },
    userId: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
