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
      type: Number,
      default: null, // null means Unlimited
    },
    creditedForJobs: {
      type: Number,
      default: 500, // 1 free job post (500 credits each)
    },
    creditedForCandidates: {
      type: Number,
      default: 30, // 30 free candidate views
    },
    aiSourcingCredits: {
      type: Number,
      default: 0, // AI sourcing credits — added by plan purchase
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
    freePlanExpiry: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days (1 month) from creation
    },
    freeJobsPosted: {
      type: Number,
      default: 0, // Track free jobs posted before/after verification
    },
    paidPlanFreeJobsPosted: {
      type: Number,
      default: 0, // Track free jobs posted by paid plan users this month
    },
    paidPlanFreeJobsRenewal: {
      type: Date,
      default: null, // Track when paid plan free jobs were last renewed
    },
    plan: {
      type: String,
      enum: ["FREE", "STANDARD", "PREMIUM", "PRO", "ENTERPRISE"],
      default: "FREE",
    },
    planJobsPostedThisMonth: {
      type: Number,
      default: 0,
    },
    planMonthStart: {
      type: Date,
      default: null,
    },
    hasSubscription: {
      type: Boolean,
      default: false
    },
    // Overrides the flat per-plan USER_LIMITS table (see recruiter.contoller.js)
    // for ENTERPRISE companies — set per purchased duration (3/6/12 team users
    // for the 3-month/6-month/1-year plans). null = fall back to the table.
    teamUserLimit: {
      type: Number,
      default: null,
    },
    // ── 3-day free trial (Starter plan only) ────────────────────────────
    // Unlocks paid-tier limits (jobs, filters, AI auto-scoring, etc.) for 3
    // days, no card required. AI Sourcing stays gated on `hasSubscription`
    // and is intentionally NEVER unlocked by the trial.
    trialActive: {
      type: Boolean,
      default: false,
    },
    trialStartedAt: {
      type: Date,
      default: null,
    },
    trialExpiresAt: {
      type: Date,
      default: null,
    },
    hasUsedTrial: {
      type: Boolean,
      default: false, // one trial per company, ever
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
