import mongoose from "mongoose";

const recruiterInteractionSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SourcingCandidate",
    required: true,
    index: true
  },
  interactionType: {
    type: String,
    enum: ["viewed", "shortlisted", "rejected", "contacted", "interviewed"],
    required: true,
    index: true
  },
  candidateData: {
    skills: [String],
    experience: Number,
    location: String,
    designation: String,
    company: String,
    summary: String,
    totalExperience: Number
  },
  metadata: {
    searchQuery: String,
    searchFilters: mongoose.Schema.Types.Mixed,
    session: String,
    source: {
      type: String,
      enum: ["search", "recommendation", "hidden_gem", "adjacent_skills", "startup_expert", "semantic_match"],
      default: "search"
    },
    position: Number,
    totalResults: Number,
    duration: Number,
    device: String,
    userAgent: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    tags: [String],
    wouldHire: Boolean,
    reason: {
      type: String,
      enum: ["not_interested", "salary", "location", "experience", "skills", "culture", "other"],
      default: null
    }
  },
  context: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    },
    jobTitle: String,
    jobDescription: String,
    matchingScore: Number,
    skillMatchScore: Number,
    semanticScore: Number,
    adaptiveScore: Number
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  session: {
    type: String,
    trim: true,
    index: true
  }
}, {
  timestamps: true,
  collection: "recruiterinteractions"
});

recruiterInteractionSchema.index({ recruiterId: 1, timestamp: -1 });
recruiterInteractionSchema.index({ recruiterId: 1, candidateId: 1 });
recruiterInteractionSchema.index({ recruiterId: 1, interactionType: 1, timestamp: -1 });
recruiterInteractionSchema.index({ session: 1, timestamp: -1 });

recruiterInteractionSchema.pre("save", function(next) {
  if (this.isNew && !this.metadata) {
    this.metadata = {};
  }
  next();
});

recruiterInteractionSchema.methods.updateFeedback = function(feedback) {
  if (feedback.rating !== undefined) this.feedback.rating = feedback.rating;
  if (feedback.notes) this.feedback.notes = feedback.notes;
  if (feedback.tags) this.feedback.tags = feedback.tags;
  if (feedback.wouldHire !== undefined) this.feedback.wouldHire = feedback.wouldHire;
  if (feedback.reason) this.feedback.reason = feedback.reason;
  
  return this.save();
};

recruiterInteractionSchema.methods.getInteractionScore = function() {
  const scores = {
    viewed: 1,
    shortlisted: 3,
    contacted: 5,
    interviewed: 4,
    rejected: -2
  };
  
  let score = scores[this.interactionType] || 0;
  
  if (this.feedback.rating) {
    score += (this.feedback.rating - 3) * 0.5;
  }
  
  if (this.feedback.wouldHire === true) {
    score += 2;
  } else if (this.feedback.wouldHire === false) {
    score -= 1;
  }
  
  return score;
};

recruiterInteractionSchema.statics.getRecruiterInteractions = async function(recruiterId, options = {}) {
  const { limit = 100, type, candidateId, session, startDate, endDate } = options;
  
  const query = { recruiterId };
  
  if (type) query.interactionType = type;
  if (candidateId) query.candidateId = candidateId;
  if (session) query.session = session;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }
  
  return this.find(query)
    .populate('candidateId', 'fullName email skills experience location designation currentCompany summary')
    .populate('context.jobId', 'title description')
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

recruiterInteractionSchema.statics.getInteractionStats = async function(recruiterId, timeRange = '30d') {
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  const stats = await this.aggregate([
    {
      $match: {
        recruiterId: new mongoose.Types.ObjectId(recruiterId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          type: "$interactionType",
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
        },
        count: { $sum: 1 },
        avgRating: { $avg: "$feedback.rating" },
        wouldHireRate: {
          $avg: { $cond: ["$feedback.wouldHire", 1, 0] }
        }
      }
    },
    {
      $group: {
        _id: "$_id.type",
        totalCount: { $sum: "$count" },
        dailyStats: {
          $push: {
            date: "$_id.date",
            count: "$count",
            avgRating: "$avgRating",
            wouldHireRate: "$wouldHireRate"
          }
        },
        avgRating: { $avg: "$avgRating" },
        wouldHireRate: { $avg: "$wouldHireRate" }
      }
    },
    {
      $sort: { totalCount: -1 }
    }
  ]);
  
  return stats;
};

recruiterInteractionSchema.statics.getTopCandidates = async function(recruiterId, options = {}) {
  const { limit = 10, timeRange = '30d' } = options;
  
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  const topCandidates = await this.aggregate([
    {
      $match: {
        recruiterId: new mongoose.Types.ObjectId(recruiterId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: "$candidateId",
        interactions: { $push: "$$ROOT" },
        totalInteractions: { $sum: 1 },
        lastInteraction: { $max: "$timestamp" },
        interactionTypes: { $addToSet: "$interactionType" },
        avgRating: { $avg: "$feedback.rating" },
        wouldHireRate: {
          $avg: { $cond: ["$feedback.wouldHire", 1, 0] }
        },
        totalScore: { $sum: { $sum: [1, { $cond: [{ $eq: ["$interactionType", "shortlisted"] }, 2, 0] }, { $cond: [{ $eq: ["$interactionType", "contacted"] }, 3, 0] }, { $cond: [{ $eq: ["$interactionType", "interviewed"] }, 4, 0] }] } }
      }
    },
    {
      $sort: { totalScore: -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: "sourcingcandidates",
        localField: "_id",
        foreignField: "_id",
        as: "candidate"
      }
    },
    {
      $unwind: "$candidate"
    }
  ]);
  
  return topCandidates.map(item => ({
    candidate: item.candidate,
    totalInteractions: item.totalInteractions,
    lastInteraction: item.lastInteraction,
    interactionTypes: item.interactionTypes,
    avgRating: item.avgRating,
    wouldHireRate: item.wouldHireRate,
    totalScore: item.totalScore,
    recentInteractions: item.interactions.slice(-5)
  }));
};

recruiterInteractionSchema.statics.getCandidateInteractions = async function(candidateId, options = {}) {
  const { limit = 50, recruiterId } = options;
  
  const query = { candidateId };
  if (recruiterId) query.recruiterId = recruiterId;
  
  return this.find(query)
    .populate('recruiterId', 'fullName email')
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

const RecruiterInteraction = mongoose.model("RecruiterInteraction", recruiterInteractionSchema);

export default RecruiterInteraction;

export const trackRecruiterInteraction = async function(recruiterId, candidateId, interactionType, metadata = {}) {
  try {
    const SourcingCandidate = (await import("../../../models/sourcing/sourcingCandidate.model.js")).SourcingCandidate;
    
    const candidate = await SourcingCandidate.findById(candidateId)
      .select('skills experience location designation currentCompany summary totalExperience')
      .lean();
    
    const interaction = new RecruiterInteraction({
      recruiterId,
      candidateId,
      interactionType,
      candidateData: candidate ? {
        skills: candidate.skills || [],
        experience: candidate.experience || 0,
        location: candidate.location || '',
        designation: candidate.designation || '',
        company: candidate.currentCompany || '',
        summary: candidate.summary || '',
        totalExperience: candidate.totalExperience || 0
      } : {},
      metadata: {
        ...metadata,
        timestamp: new Date()
      },
      timestamp: new Date()
    });
    
    await interaction.save();
    
    const RecruiterMemory = (await import("../../models/recruiterMemory.model.js")).RecruiterMemory;
    await RecruiterMemory.updateRecruiterMemory(recruiterId, {
      lastInteraction: {
        candidateId,
        type: interactionType,
        timestamp: new Date(),
        candidateData: candidate
      }
    });
    
    return interaction;
  } catch (error) {
    console.error('Error tracking recruiter interaction:', error);
    throw error;
  }
};

export const getRecruiterInteractions = RecruiterInteraction.getRecruiterInteractions;
export const getInteractionStats = RecruiterInteraction.getInteractionStats;
export const getTopCandidates = RecruiterInteraction.getTopCandidates;
export const getCandidateInteractions = RecruiterInteraction.getCandidateInteractions;
