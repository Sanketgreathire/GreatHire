import mongoose from "mongoose";

const jdEmbeddingSchema = new mongoose.Schema(
  {
    jobId:      { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, unique: true, index: true },
    recruiterId:{ type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true, index: true },

    // ── Parsed JD Fields ──────────────────────────────────────────────────
    parsedData: {
      requiredSkills:   { type: [String], default: [] },
      preferredSkills:  { type: [String], default: [] },
      designation:      { type: String, default: "" },
      minExperience:    { type: Number, default: 0 },
      maxExperience:    { type: Number, default: 99 },
      seniorityLevel:   { type: String, default: "" },  // junior/mid/senior/lead/principal
      industry:         { type: String, default: "" },
      domain:           { type: String, default: "" },
      location:         { type: String, default: "" },
      educationReq:     { type: String, default: "" },
      jobSummary:       { type: String, default: "" },
      hiddenRequirements: { type: [String], default: [] },
      normalizedSkills: { type: [String], default: [] },
    },

    // ── Embedding Status ──────────────────────────────────────────────────
    embeddingStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "DONE", "FAILED"],
      default: "PENDING",
      index: true,
    },
    qdrantIndexed: { type: Boolean, default: false },

    // ── Match Run Tracking ────────────────────────────────────────────────
    lastMatchRun:   { type: Date, default: null },
    totalMatches:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const JDEmbedding = mongoose.model("JDEmbedding", jdEmbeddingSchema);
