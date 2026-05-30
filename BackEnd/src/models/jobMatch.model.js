import mongoose from "mongoose";

const jobMatchSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SourcingCandidate",
    required: true
  },
  semanticScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0
  },
  skillScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0
  },
  experienceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0
  },
  locationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0
  },
  designationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    default: 0
  },
  totalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  matchedSkills: [{
    type: String,
    trim: true
  }],
  missingSkills: [{
    type: String,
    trim: true
  }],
  matchStatus: {
    type: String,
    enum: ["pending", "matched", "rejected", "contacted", "interviewed", "hired"],
    default: "matched"
  },
  recruiterNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  candidateFeedback: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  lastContactedAt: {
    type: Date
  },
  interviewScheduledAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    enum: ["not_interested", "salary", "location", "experience", "skills", "culture", "other"],
    default: null
  },
  hiredAt: {
    type: Date
  },
  processingStatus: {
    type: String,
    enum: ["processing", "completed", "failed"],
    default: "completed"
  },
  processingError: {
    type: String,
    trim: true
  },
  processingMetadata: {
    semanticSearchAvailable: {
      type: Boolean,
      default: false
    },
    keywordSearchUsed: {
      type: Boolean,
      default: false
    },
    totalCandidatesEvaluated: {
      type: Number,
      default: 0
    },
    processingTimeMs: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  collection: "jobmatches"
});

jobMatchSchema.index({ jobId: 1, totalScore: -1 });
jobMatchSchema.index({ candidateId: 1 });
jobMatchSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
jobMatchSchema.index({ createdAt: -1 });
jobMatchSchema.index({ matchStatus: 1 });
jobMatchSchema.index({ totalScore: -1 });

jobMatchSchema.pre("save", function(next) {
  if (this.isNew && this.totalScore > 0.8) {
    this.matchStatus = "matched";
  }
  next();
});

jobMatchSchema.methods.updateMatchStatus = function(status, metadata = {}) {
  this.matchStatus = status;
  
  const now = new Date();
  
  switch (status) {
    case "contacted":
      this.lastContactedAt = now;
      break;
    case "interviewed":
      this.interviewScheduledAt = now;
      break;
    case "rejected":
      this.rejectedAt = now;
      if (metadata.reason) {
        this.rejectionReason = metadata.reason;
      }
      break;
    case "hired":
      this.hiredAt = now;
      break;
  }
  
  if (metadata.notes) {
    this.recruiterNotes = metadata.notes;
  }
  
  if (metadata.feedback) {
    this.candidateFeedback = metadata.feedback;
  }
  
  return this.save();
};

jobMatchSchema.methods.getMatchQuality = function() {
  if (this.totalScore >= 0.8) return "excellent";
  if (this.totalScore >= 0.6) return "good";
  if (this.totalScore >= 0.4) return "fair";
  return "poor";
};

jobMatchSchema.methods.getSkillMatchPercentage = function() {
  const totalSkills = (this.matchedSkills?.length || 0) + (this.missingSkills?.length || 0);
  if (totalSkills === 0) return 0;
  return Math.round(((this.matchedSkills?.length || 0) / totalSkills) * 100);
};

jobMatchSchema.statics.getJobMatchStats = async function(jobId) {
  const stats = await this.aggregate([
    { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
    {
      $group: {
        _id: null,
        totalMatches: { $sum: 1 },
        avgSemanticScore: { $avg: "$semanticScore" },
        avgSkillScore: { $avg: "$skillScore" },
        avgExperienceScore: { $avg: "$experienceScore" },
        avgLocationScore: { $avg: "$locationScore" },
        avgDesignationScore: { $avg: "$designationScore" },
        avgTotalScore: { $avg: "$totalScore" },
        excellentMatches: {
          $sum: { $cond: [{ $gte: ["$totalScore", 0.8] }, 1, 0] }
        },
        goodMatches: {
          $sum: { $cond: [{ $and: [{ $gte: ["$totalScore", 0.6] }, { $lt: ["$totalScore", 0.8] }] }, 1, 0] }
        },
        fairMatches: {
          $sum: { $cond: [{ $and: [{ $gte: ["$totalScore", 0.4] }, { $lt: ["$totalScore", 0.6] }] }, 1, 0] }
        },
        poorMatches: {
          $sum: { $cond: [{ $lt: ["$totalScore", 0.4] }, 1, 0] }
        },
        contactedCount: {
          $sum: { $cond: [{ $eq: ["$matchStatus", "contacted"] }, 1, 0] }
        },
        interviewedCount: {
          $sum: { $cond: [{ $eq: ["$matchStatus", "interviewed"] }, 1, 0] }
        },
        rejectedCount: {
          $sum: { $cond: [{ $eq: ["$matchStatus", "rejected"] }, 1, 0] }
        },
        hiredCount: {
          $sum: { $cond: [{ $eq: ["$matchStatus", "hired"] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalMatches: 0,
    avgSemanticScore: 0,
    avgSkillScore: 0,
    avgExperienceScore: 0,
    avgLocationScore: 0,
    avgDesignationScore: 0,
    avgTotalScore: 0,
    excellentMatches: 0,
    goodMatches: 0,
    fairMatches: 0,
    poorMatches: 0,
    contactedCount: 0,
    interviewedCount: 0,
    rejectedCount: 0,
    hiredCount: 0
  };
};

jobMatchSchema.statics.getCandidateMatchHistory = async function(candidateId, limit = 10) {
  return this.find({ candidateId })
    .populate("jobId", "title description company location")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

jobMatchSchema.statics.getTopMatches = async function(jobId, limit = 20) {
  return this.find({ jobId })
    .populate("candidateId", "fullName email skills experience location designation currentCompany summary")
    .sort({ totalScore: -1 })
    .limit(limit)
    .lean();
};

const JobMatch = mongoose.model("JobMatch", jobMatchSchema);

export default JobMatch;
