import mongoose from "mongoose";

const ingestionJobSchema = new mongoose.Schema(
  {
    batchId:    { type: String, required: true, unique: true, index: true },
    sourceType: {
      type: String,
      enum: [
        "RESUME_UPLOAD", "CSV_IMPORT", "GITHUB_PROFILE",
        "PUBLIC_PROFILE", "CHROME_EXTENSION", "JOB_APPLICANT", "API_IMPORT",
      ],
      required: true,
    },
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true, index: true },
    status: {
      type: String,
      enum: ["QUEUED", "PROCESSING", "COMPLETED", "FAILED", "PARTIAL"],
      default: "QUEUED",
      index: true,
    },

    // Stats
    totalRows:    { type: Number, default: 0 },
    processed:    { type: Number, default: 0 },
    created:      { type: Number, default: 0 },
    duplicates:   { type: Number, default: 0 },
    failed:       { type: Number, default: 0 },

    // Error details
    errors: [
      {
        row:     Number,
        message: String,
        data:    mongoose.Schema.Types.Mixed,
      },
    ],

    startedAt:   { type: Date, default: null },
    completedAt: { type: Date, default: null },
    sourceUrl:   { type: String, default: "" },
    fileName:    { type: String, default: "" },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const IngestionJob = mongoose.model("IngestionJob", ingestionJobSchema);
