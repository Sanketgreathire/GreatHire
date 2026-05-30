import mongoose from "mongoose";

const outreachHistorySchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SourcingCandidate",
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  outreachType: {
    type: String,
    enum: ["email", "linkedin", "followup", "cold"],
    required: true,
    index: true
  },
  tone: {
    type: String,
    enum: ["professional", "startup_casual", "aggressive_hiring", "executive_hiring"],
    required: true
  },
  generatedContent: {
    message: {
      type: String,
      required: true
    },
    subject: {
      type: String
    },
    personalizationScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    matchedSkills: [{
      type: String,
      trim: true
    }],
    candidateInsights: [{
      type: String,
      trim: true
    }],
    aiGenerated: {
      type: Boolean,
      default: false
    }
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OutreachTemplate"
  },
  customInstructions: {
    type: String,
    trim: true
  },
  sendRecord: {
    subject: String,
    message: String,
    sendMethod: {
      type: String,
      enum: ["email", "linkedin", "manual", "scheduled"],
      default: "manual"
    },
    sentAt: {
      type: Date
    },
    scheduledAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ["draft", "sent", "scheduled", "failed", "cancelled"],
      default: "draft"
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "delivered", "opened", "replied", "bounced", "failed"],
      default: "pending"
    },
    responseReceived: {
      type: Boolean,
      default: false
    },
    responseAt: Date,
    responseContent: String
  },
  performance: {
    openRate: {
      type: Number,
      default: 0
    },
    replyRate: {
      type: Number,
      default: 0
    },
    engagementScore: {
      type: Number,
      default: 0
    },
    conversionStatus: {
      type: String,
      enum: ["no_response", "interested", "not_interested", "interview_scheduled", "hired", "withdrawn"],
      default: "no_response"
    }
  },
  metadata: {
    generationTime: {
      type: Number,
      default: 0
    },
    personalizationTime: {
      type: Number,
      default: 0
    },
    candidateContext: {
      fullName: String,
      skills: [String],
      experience: Number,
      currentCompany: String,
      location: String
    },
    jobContext: {
      title: String,
      company: String,
      skills: [String]
    },
    recruiterContext: {
      name: String,
      company: String
    },
    version: {
      type: String,
      default: "1.0"
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: Date
}, {
  timestamps: true,
  collection: "outreachhistories"
});

outreachHistorySchema.index({ recruiterId: 1, createdAt: -1 });
outreachHistorySchema.index({ candidateId: 1, createdAt: -1 });
outreachHistorySchema.index({ jobId: 1, createdAt: -1 });
outreachHistorySchema.index({ outreachType: 1, createdAt: -1 });
outreachHistorySchema.index({ tone: 1, createdAt: -1 });
outreachHistorySchema.index({ "sendRecord.status": 1, createdAt: -1 });
outreachHistorySchema.index({ "performance.conversionStatus": 1, createdAt: -1 });
outreachHistorySchema.index({ "sendRecord.sentAt": -1 });

outreachHistorySchema.pre("save", function(next) {
  if (this.isModified("sendRecord.status") && this.sendRecord.status === "sent") {
    this.sendRecord.sentAt = this.sendRecord.sentAt || new Date();
  }
  next();
});

outreachHistorySchema.methods.updateSendStatus = function(status, additionalData = {}) {
  this.sendRecord.status = status;
  
  if (status === "sent") {
    this.sendRecord.sentAt = new Date();
  } else if (status === "scheduled") {
    this.sendRecord.scheduledAt = additionalData.scheduledAt || new Date();
  }
  
  if (additionalData.subject) this.sendRecord.subject = additionalData.subject;
  if (additionalData.message) this.sendRecord.message = additionalData.message;
  if (additionalData.sendMethod) this.sendRecord.sendMethod = additionalData.sendMethod;
  
  return this.save();
};

outreachHistorySchema.methods.updateDeliveryStatus = function(status, additionalData = {}) {
  this.sendRecord.deliveryStatus = status;
  
  if (status === "opened") {
    this.performance.openRate = 1;
  } else if (status === "replied") {
    this.sendRecord.responseReceived = true;
    this.sendRecord.responseAt = new Date();
    this.sendRecord.responseContent = additionalData.responseContent;
    this.performance.replyRate = 1;
    this.performance.conversionStatus = "interested";
  } else if (status === "bounced") {
    this.sendRecord.status = "failed";
  }
  
  return this.save();
};

outreachHistorySchema.methods.updatePerformance = function(performanceData) {
  Object.keys(performanceData).forEach(key => {
    if (this.performance[key] !== undefined) {
      this.performance[key] = performanceData[key];
    }
  });
  
  return this.save();
};

outreachHistorySchema.methods.archive = function() {
  this.isActive = false;
  this.archivedAt = new Date();
  return this.save();
};

outreachHistorySchema.methods.getEngagementMetrics = function() {
  return {
    personalizationScore: this.generatedContent.personalizationScore,
    matchedSkillsCount: this.generatedContent.matchedSkills.length,
    candidateInsightsCount: this.generatedContent.candidateInsights.length,
    aiGenerated: this.generatedContent.aiGenerated,
    deliveryStatus: this.sendRecord.deliveryStatus,
    responseReceived: this.sendRecord.responseReceived,
    conversionStatus: this.performance.conversionStatus,
    engagementScore: this.performance.engagementScore
  };
};

outreachHistorySchema.statics.getOutreachHistory = async function(recruiterId, options = {}) {
  const {
    limit = 20,
    offset = 0,
    filters = {}
  } = options;

  const query = { recruiterId, isActive: true };
  
  if (filters.candidateId) query.candidateId = filters.candidateId;
  if (filters.outreachType) query.outreachType = filters.outreachType;
  if (filters.tone) query.tone = filters.tone;
  if (filters.status) query["sendRecord.status"] = filters.status;
  if (filters.dateRange) {
    const { startDate, endDate } = filters.dateRange;
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const history = await this.find(query)
    .populate('candidateId', 'fullName email currentCompany skills')
    .populate('jobId', 'title company')
    .populate('templateId', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .lean();

  const total = await this.countDocuments(query);

  return {
    history,
    total,
    hasMore: offset + limit < total
  };
};

outreachHistorySchema.statics.getOutreachStatistics = async function(recruiterId, timeRange = '30d') {
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
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: {
          outreachType: "$outreachType",
          tone: "$tone",
          status: "$sendRecord.status",
          conversionStatus: "$performance.conversionStatus"
        },
        count: { $sum: 1 },
        avgPersonalizationScore: { $avg: "$generatedContent.personalizationScore" },
        totalResponses: { $sum: { $cond: ["$sendRecord.responseReceived", 1, 0] } },
        aiGenerated: { $sum: { $cond: ["$generatedContent.aiGenerated", 1, 0] } }
      }
    },
    {
      $group: {
        _id: "$_id.outreachType",
        stats: {
          $push: {
            tone: "$_id.tone",
            status: "$_id.status",
            conversionStatus: "$_id.conversionStatus",
            count: "$count",
            avgPersonalizationScore: "$avgPersonalizationScore",
            totalResponses: "$totalResponses",
            aiGenerated: "$aiGenerated"
          }
        },
        totalCount: { $sum: "$count" },
        totalResponses: { $sum: "$totalResponses" },
        avgPersonalizationScore: { $avg: "$avgPersonalizationScore" }
      }
    },
    {
      $sort: { totalCount: -1 }
    }
  ]);

  const overallStats = await this.aggregate([
    {
      $match: {
        recruiterId: new mongoose.Types.ObjectId(recruiterId),
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalOutreach: { $sum: 1 },
        sentOutreach: { $sum: { $cond: [{ $eq: ["$sendRecord.status", "sent"] }, 1, 0] } },
        responsesReceived: { $sum: { $cond: ["$sendRecord.responseReceived", 1, 0] } },
        avgPersonalizationScore: { $avg: "$generatedContent.personalizationScore" },
        conversions: {
          $sum: { $cond: [{ $in: ["$performance.conversionStatus", ["interview_scheduled", "hired"]] }, 1, 0] }
        }
      }
    }
  ]);

  const result = overallStats[0] || {
    totalOutreach: 0,
    sentOutreach: 0,
    responsesReceived: 0,
    avgPersonalizationScore: 0,
    conversions: 0
  };

  return {
    overall: {
      totalOutreach: result.totalOutreach,
      sentOutreach: result.sentOutreach,
      responseRate: result.totalOutreach > 0 ? (result.responsesReceived / result.totalOutreach) * 100 : 0,
      conversionRate: result.sentOutreach > 0 ? (result.conversions / result.sentOutreach) * 100 : 0,
      avgPersonalizationScore: result.avgPersonalizationScore || 0
    },
    byType: stats,
    timeRange
  };
};

outreachHistorySchema.statics.getTopPerformingOutreach = async function(recruiterId, limit = 10) {
  const topOutreach = await this.find({
    recruiterId,
    isActive: true,
    "sendRecord.responseReceived": true
  })
  .populate('candidateId', 'fullName currentCompany skills')
  .populate('jobId', 'title company')
  .sort({ "performance.engagementScore": -1 })
  .limit(limit)
  .lean();

  return topOutreach.map(outreach => ({
    ...outreach,
    metrics: outreach.getEngagementMetrics()
  }));
};

outreachHistorySchema.statics.getOutreachTrends = async function(recruiterId, timeRange = '30d') {
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

  const trends = await this.aggregate([
    {
      $match: {
        recruiterId: new mongoose.Types.ObjectId(recruiterId),
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          outreachType: "$outreachType"
        },
        count: { $sum: 1 },
        responses: { $sum: { $cond: ["$sendRecord.responseReceived", 1, 0] } },
        avgPersonalizationScore: { $avg: "$generatedContent.personalizationScore" }
      }
    },
    {
      $sort: { "_id.date": 1, "_id.outreachType": 1 }
    }
  ]);

  return trends;
};

const OutreachHistory = mongoose.model("OutreachHistory", outreachHistorySchema);

export default OutreachHistory;
