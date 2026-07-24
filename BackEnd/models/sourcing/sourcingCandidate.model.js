import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree:      { type: String, default: "" },
  institution: { type: String, default: "" },
  year:        { type: String, default: "" },
}, { _id: false });

const sourceTrackingSchema = new mongoose.Schema({
  sourceType: {
    type: String,
    enum: [
      "RESUME_UPLOAD",
      "CSV_IMPORT",
      "GITHUB_PROFILE",
      "PUBLIC_PROFILE",
      "CHROME_EXTENSION",
      "JOB_APPLICANT",
      "API_IMPORT",
      "MANUAL",
    ],
    required: true,
  },
  sourceUrl:   { type: String, default: "" },
  importedBy:  { type: mongoose.Schema.Types.ObjectId, refPath: "createdByModel" },
  importedAt:  { type: Date, default: Date.now },
  batchId:     { type: String, default: "" },   // for CSV batch tracking
  rawData:     { type: mongoose.Schema.Types.Mixed, default: null, select: false },
}, { _id: false });

const sourcingCandidateSchema = new mongoose.Schema(
  {
    // ── Core Identity ──────────────────────────────────────────────────────
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    emails:  { type: [String], default: [], index: true },
    phones:  { type: [String], default: [] },

    // ── Professional ──────────────────────────────────────────────────────
    skills:          { type: [String], default: [], index: true },
    normalizedSkills:{ type: [String], default: [] },   // canonical skill names
    totalExperience: { type: Number, default: 0, index: true },
    currentCompany:  { type: String, default: "", trim: true },
    designation:     { type: String, default: "", trim: true, index: true },
    location:        { type: String, default: "", trim: true, index: true },
    education:       { type: [educationSchema], default: [] },
    summary:         { type: String, default: "" },

    // ── External Profile Links (used for dedup) ────────────────────────────
    githubUrl:   { type: String, default: "", index: true, sparse: true },
    linkedinUrl: { type: String, default: "", index: true, sparse: true },
    portfolioUrl:{ type: String, default: "" },

    // ── Resume ────────────────────────────────────────────────────────────
    resumeUrl:          { type: String, default: "" },
    resumeOriginalName: { type: String, default: "" },
    parsedText:         { type: String, default: "", select: false },

    // ── Source Tracking ───────────────────────────────────────────────────
    sourceType: {
      type: String,
      enum: [
        "RESUME_UPLOAD", "CSV_IMPORT", "GITHUB_PROFILE",
        "PUBLIC_PROFILE", "CHROME_EXTENSION", "JOB_APPLICANT",
        "API_IMPORT", "MANUAL",
      ],
      default: "RESUME_UPLOAD",
      index: true,
    },
    sourceUrl:   { type: String, default: "" },
    importedAt:  { type: Date, default: Date.now },
    batchId:     { type: String, default: "", index: true },

    // Full source history (every time this candidate was re-imported)
    sourceHistory: { type: [sourceTrackingSchema], default: [] },

    // ── Ownership ─────────────────────────────────────────────────────────
    createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true, index: true },
    createdByModel: { type: String, enum: ["Recruiter", "Admin"], default: "Recruiter" },

    // ── Pipeline Status ───────────────────────────────────────────────────
    embeddingStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "DONE", "FAILED"],
      default: "PENDING",
      index: true,
    },
    ingestionStatus: {
      type: String,
      enum: ["QUEUED", "PROCESSING", "COMPLETED", "FAILED", "DUPLICATE"],
      default: "COMPLETED",
      index: true,
    },
    ingestionError: { type: String, default: "" },

    // ── Dedup fingerprint ─────────────────────────────────────────────────
    // SHA-256 of normalized(email[0] || phone[0] || githubUrl)
    dedupHash: { type: String, default: "", index: true, sparse: true },

    // ── AI / Search ───────────────────────────────────────────────────────
    // Placeholder for future vector embedding
    embedding:       { type: [Number], default: [], select: false },
    esIndexed:       { type: Boolean, default: false },
    esIndexedAt:     { type: Date, default: null },
  },
  { timestamps: true }
);

// ── Compound text index ────────────────────────────────────────────────────
sourcingCandidateSchema.index(
  {
    fullName: "text", skills: "text", normalizedSkills: "text",
    designation: "text", currentCompany: "text", location: "text", summary: "text",
  },
  { name: "sourcing_text_idx", weights: { fullName: 10, skills: 8, designation: 6, location: 4 } }
);

// ── Compound query indexes ─────────────────────────────────────────────────
sourcingCandidateSchema.index({ createdBy: 1, createdAt: -1 });
sourcingCandidateSchema.index({ createdBy: 1, sourceType: 1 });
sourcingCandidateSchema.index({ createdBy: 1, totalExperience: 1 });

export const SourcingCandidate =
  mongoose.models.SourcingCandidate ||
  mongoose.model("SourcingCandidate", sourcingCandidateSchema);