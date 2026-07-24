import mongoose from "mongoose";

const aiSourcedCandidateSchema = new mongoose.Schema(
  {
    fullName:        { type: String, required: true, trim: true, index: true },
    email:           { type: String, default: null, index: true, sparse: true },
    phone:           { type: String, default: null },
    skills:          { type: [String], default: [] },
    totalExperience: { type: Number, default: 0 },
    currentCompany:  { type: String, default: null },
    designation:     { type: String, default: null },
    location:        { type: String, default: null },
    education:       { type: mongoose.Schema.Types.Mixed, default: [] },
    summary:         { type: String, default: null },
    githubUrl:       { type: String, default: null, index: true, sparse: true },
    linkedinUrl:     { type: String, default: null, index: true, sparse: true },
    portfolioUrl:    { type: String, default: null },
    resumeUrl:       { type: String, default: null },
    aiSourceType:    { type: String, enum: ["GITHUB", "LINKEDIN", "NAUKRI", "INDEED", "API_IMPORT", "CSV_IMPORT", "MANUAL"], default: "API_IMPORT", index: true },
    aiSourcedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    recruiterId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  },
  { timestamps: true }
);

// Compound indexes
aiSourcedCandidateSchema.index({ recruiterId: 1, createdAt: -1 });
aiSourcedCandidateSchema.index({ aiSourceType: 1 });

export const AISourcedCandidate =
  mongoose.models.AISourcedCandidate ||
  mongoose.model("AISourcedCandidate", aiSourcedCandidateSchema);
