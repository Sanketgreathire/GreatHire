import mongoose from "mongoose";

const candidateJobMatchSchema = new mongoose.Schema(
  {
    // ── References ────────────────────────────────────────────────────────
    jobId:       { type: mongoose.Schema.Types.ObjectId, ref: "Job",              required: true, index: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "SourcingCandidate", required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter",         required: true },

    // ── Composite Scores ──────────────────────────────────────────────────
    matchScore:       { type: Number, default: 0, min: 0, max: 100, index: true }, // 0-100 overall
    semanticScore:    { type: Number, default: 0, min: 0, max: 1 },  // cosine similarity
    skillScore:       { type: Number, default: 0, min: 0, max: 100 }, // % skills matched
    experienceScore:  { type: Number, default: 0, min: 0, max: 100 },
    designationScore: { type: Number, default: 0, min: 0, max: 100 },
    locationScore:    { type: Number, default: 0, min: 0, max: 100 },
    domainScore:      { type: Number, default: 0, min: 0, max: 100 },

    // ── Skill Analysis ────────────────────────────────────────────────────
    matchedSkills:    { type: [String], default: [] },
    missingSkills:    { type: [String], default: [] },
    bonusSkills:      { type: [String], default: [] }, // candidate has extra relevant skills

    // ── Ranking Metadata ──────────────────────────────────────────────────
    rank:             { type: Number, default: 0 },
    tier: {
      type: String,
      enum: ["TOP_MATCH", "STRONG_MATCH", "GOOD_MATCH", "PARTIAL_MATCH", "WEAK_MATCH"],
      default: "PARTIAL_MATCH",
      index: true,
    },
    category: {
      type: String,
      enum: ["TOP_CANDIDATE", "HIDDEN_GEM", "ADJACENT_SKILLS", "HIGH_POTENTIAL", "STANDARD"],
      default: "STANDARD",
      index: true,
    },
    rankingMetadata: {
      experienceGap:    Number,   // years over/under requirement
      seniorityMatch:   Boolean,
      locationMatch:    Boolean,
      educationMatch:   Boolean,
      industryMatch:    Boolean,
    },

    // ── Recruiter Feedback ────────────────────────────────────────────────
    feedback: {
      status: {
        type: String,
        enum: ["PENDING", "SHORTLISTED", "REJECTED", "CONTACTED", "HIRED", "ON_HOLD"],
        default: "PENDING",
        index: true,
      },
      note:        { type: String, default: "" },
      updatedAt:   { type: Date, default: null },
      updatedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" },
    },

    // ── Processing ────────────────────────────────────────────────────────
    processingStatus: {
      type: String,
      enum: ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"],
      default: "COMPLETED",
    },
    batchId: { type: String, default: "", index: true },
  },
  { timestamps: true }
);

// Unique constraint — one match record per job+candidate pair
candidateJobMatchSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
candidateJobMatchSchema.index({ jobId: 1, matchScore: -1 });
candidateJobMatchSchema.index({ jobId: 1, tier: 1, matchScore: -1 });
candidateJobMatchSchema.index({ recruiterId: 1, createdAt: -1 });

export const CandidateJobMatch = mongoose.model("CandidateJobMatch", candidateJobMatchSchema);
