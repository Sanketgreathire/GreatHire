import mongoose from 'mongoose';

/**
 * Auto-Sourcing Configuration Model
 * Stores per-recruiter auto-sourcing preferences
 */
const autoSourcingConfigSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter',
      required: true,
      unique: true,
      index: true,
    },
    
    // Enable/Disable auto-sourcing for this recruiter
    enabled: {
      type: Boolean,
      default: true,
    },
    
    // Search criteria
    criteria: {
      // Platforms to source from
      platforms: {
        type: [String],
        enum: ['github', 'linkedin', 'indeed', 'naukri', 'stackoverflow', 'devto'],
        default: ['github', 'stackoverflow', 'devto'],
      },
      
      // Programming languages to search for
      languages: {
        type: [String],
        default: ['JavaScript', 'Python', 'Java'],
      },
      
      // Locations to search
      locations: {
        type: [String],
        default: ['India'],
      },
      
      // Job titles/keywords
      keywords: {
        type: [String],
        default: ['software developer', 'full stack developer'],
      },
      
      // Minimum repositories (GitHub)
      minRepos: {
        type: Number,
        default: 1,
        min: 0,
      },
      
      // Minimum followers (GitHub)
      minFollowers: {
        type: Number,
        default: 0,
        min: 0,
      },
      
      // Minimum experience (years)
      minExperience: {
        type: Number,
        default: 0,
        min: 0,
      },
      
      // Maximum candidates to fetch per run
      maxCandidatesPerRun: {
        type: Number,
        default: 30,
        min: 1,
        max: 100,
      },
    },
    
    // Statistics
    stats: {
      lastRunAt: {
        type: Date,
        default: null,
      },
      
      totalRuns: {
        type: Number,
        default: 0,
      },
      
      totalImported: {
        type: Number,
        default: 0,
      },
      
      totalSkipped: {
        type: Number,
        default: 0,
      },
      
      lastRunResult: {
        imported: { type: Number, default: 0 },
        skipped: { type: Number, default: 0 },
        errors: { type: Number, default: 0 },
      },
      
      // Track pagination for each platform
      platformPages: {
        github: { type: Number, default: 1 },
        linkedin: { type: Number, default: 1 },
        indeed: { type: Number, default: 1 },
        naukri: { type: Number, default: 1 },
        stackoverflow: { type: Number, default: 1 },
        devto: { type: Number, default: 1 },
      },
    },
  },
  { timestamps: true }
);

export const AutoSourcingConfig =
  mongoose.models.AutoSourcingConfig ||
  mongoose.model('AutoSourcingConfig', autoSourcingConfigSchema);
