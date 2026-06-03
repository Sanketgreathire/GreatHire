import mongoose from "mongoose";

const githubCandidateMetadataSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SourcingCandidate',
    required: true
  },
  githubUsername: {
    type: String,
    required: true
  },
  githubUrl: {
    type: String,
    required: true
  },
  repositories: [{
    id: Number,
    name: String,
    fullName: String,
    description: String,
    language: String,
    languages: mongoose.Schema.Types.Mixed,
    url: String,
    cloneUrl: String,
    sshUrl: String,
    size: Number,
    stargazersCount: Number,
    watchersCount: Number,
    forksCount: Number,
    openIssuesCount: Number,
    defaultBranch: String,
    createdAt: Date,
    updatedAt: Date,
    pushedAt: Date,
    homepage: String,
    topics: [String],
    hasPages: Boolean,
    archived: Boolean,
    disabled: Boolean,
    license: String,
    owner: {
      login: String,
      type: String
    },
    isPrivate: Boolean,
    isFork: Boolean,
    parent: {
      fullName: String,
      url: String
    },
    readme: String,
    languages: mongoose.Schema.Types.Mixed,
    contributors: Number,
    lastCommitAt: Date
  }],
  inferredSkills: {
    technical: [String],
    cloud: [String],
    devops: [String],
    ai_ml: [String],
    specialization: [String],
    seniority: {
      type: String,
      enum: ['junior', 'mid-junior', 'mid', 'senior', 'lead', 'principal'],
      default: 'junior'
    },
    experience: {
      years: Number,
      level: String
    },
    stack: {
      frontend: [String],
      backend: [String],
      databases: [String],
      tools: [String]
    },
    all: [String],
    confidence: mongoose.Schema.Types.Mixed
  },
  contributionScore: {
    type: Number,
    default: 0
  },
  developerScore: {
    type: Number,
    default: 0
  },
  organizationHistory: [{
    name: String,
    avatarUrl: String,
    description: String,
    login: String,
    joinedAt: Date
  }],
  githubStats: {
    followers: Number,
    following: Number,
    publicRepos: Number,
    totalStars: Number,
    totalForks: Number,
    totalIssues: Number,
    activeRepos: Number,
    accountAge: Number,
    lastActive: Date
  },
  activityMetrics: {
    lastMonthCommits: Number,
    lastThreeMonthsCommits: Number,
    lastSixMonthsCommits: Number,
    totalCommits: Number,
    averageCommitsPerMonth: Number,
    contributionStreak: Number,
    longestStreak: Number
  },
  expertise: {
    primary: String,
    secondary: [String],
    level: String,
    specializations: [String],
    languages: [{
      language: String,
      count: Number,
      percentage: Number
    }]
  },
  rawProfile: mongoose.Schema.Types.Mixed,
  lastSyncedAt: {
    type: Date,
    default: Date.now
  },
  syncStatus: {
    type: String,
    enum: ['pending', 'syncing', 'completed', 'failed'],
    default: 'completed'
  },
  enrichmentStatus: {
    embedded: {
      type: Boolean,
      default: false
    },
    enriched: {
      type: Boolean,
      default: false
    },
    graphProcessed: {
      type: Boolean,
      default: false
    }
  },
  qualityMetrics: {
    profileCompleteness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    dataFreshness: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    activityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    credibilityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  notes: String,
  flagged: {
    type: Boolean,
    default: false
  },
  flagReason: String
}, {
  timestamps: true,
  collection: 'github_candidate_metadata'
});

githubCandidateMetadataSchema.index({ candidateId: 1, githubUsername: 1 }, { unique: true });
githubCandidateMetadataSchema.index({ githubUrl: 1 }, { unique: true });
githubCandidateMetadataSchema.index({ contributionScore: -1 });
githubCandidateMetadataSchema.index({ developerScore: -1 });
githubCandidateMetadataSchema.index({ 'inferredSkills.seniority': 1 });
githubCandidateMetadataSchema.index({ 'inferredSkills.specialization': 1 });
githubCandidateMetadataSchema.index({ lastSyncedAt: -1 });
githubCandidateMetadataSchema.index({ syncStatus: 1 });
githubCandidateMetadataSchema.index({ flagged: 1 });
githubCandidateMetadataSchema.index({ tags: 1 });

githubCandidateMetadataSchema.statics = {
  async findByCandidateId(candidateId) {
    return this.findOne({ candidateId }).populate('candidateId', 'name email githubUrl');
  },

  async findByGithubUsername(username) {
    return this.findOne({ githubUsername: username }).populate('candidateId', 'name email githubUrl');
  },

  async getHighScoringDevelopers(minScore = 50, limit = 100) {
    return this.find({
      developerScore: { $gte: minScore },
      flagged: false
    })
    .sort({ developerScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl location skills');
  },

  async getActiveDevelopers(months = 6, limit = 100) {
    const cutoffDate = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000);
    
    return this.find({
      'githubStats.lastActive': { $gte: cutoffDate },
      flagged: false
    })
    .sort({ 'githubStats.lastActive': -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl location skills');
  },

  async getBySpecialization(specialization, limit = 50) {
    return this.find({
      'inferredSkills.specialization': specialization,
      flagged: false
    })
    .sort({ developerScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl location skills');
  },

  async getBySeniority(seniority, limit = 50) {
    return this.find({
      'inferredSkills.seniority': seniority,
      flagged: false
    })
    .sort({ developerScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl location skills');
  },

  async getBySkills(skills, limit = 50) {
    return this.find({
      'inferredSkills.all': { $in: skills },
      flagged: false
    })
    .sort({ developerScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl location skills');
  },

  async getFlaggedProfiles(reason = null, limit = 50) {
    const query = { flagged: true };
    if (reason) {
      query.flagReason = reason;
    }
    
    return this.find(query)
    .sort({ flagged: -1, createdAt: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl');
  },

  async getSyncStatusStats() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: '$syncStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  },

  async getSkillDistribution() {
    const stats = await this.aggregate([
      { $unwind: '$inferredSkills.all' },
      {
        $group: {
          _id: '$inferredSkills.all',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    return stats;
  },

  async getSeniorityDistribution() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: '$inferredSkills.seniority',
          count: { $sum: 1 },
          avgDeveloperScore: { $avg: '$developerScore' },
          avgContributionScore: { $avg: '$contributionScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  },

  async getSpecializationDistribution() {
    const stats = await this.aggregate([
      { $unwind: '$inferredSkills.specialization' },
      {
        $group: {
          _id: '$inferredSkills.specialization',
          count: { $sum: 1 },
          avgDeveloperScore: { $avg: '$developerScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  },

  async updateSyncStatus(candidateId, status, additionalData = {}) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        syncStatus: status,
        lastSyncedAt: new Date(),
        ...additionalData
      },
      { upsert: true, new: true }
    );
  },

  async updateEnrichmentStatus(candidateId, enrichmentType, status = true) {
    const update = {};
    update[`enrichmentStatus.${enrichmentType}`] = status;
    
    return this.findOneAndUpdate(
      { candidateId },
      update,
      { new: true }
    );
  },

  async calculateQualityMetrics(githubData) {
    const metrics = {
      profileCompleteness: 0,
      dataFreshness: 0,
      activityScore: 0,
      credibilityScore: 0
    };

    // Profile completeness
    let completenessScore = 0;
    if (githubData.basic?.name) completenessScore += 10;
    if (githubData.basic?.bio) completenessScore += 15;
    if (githubData.basic?.location) completenessScore += 10;
    if (githubData.basic?.email) completenessScore += 15;
    if (githubData.repositories?.length > 0) completenessScore += 20;
    if (githubData.organizations?.length > 0) completenessScore += 10;
    if (githubData.basic?.company) completenessScore += 10;
    if (githubData.basic?.blog) completenessScore += 10;
    
    metrics.profileCompleteness = Math.min(completenessScore, 100);

    // Data freshness
    if (githubData.basic?.updatedAt) {
      const daysSinceUpdate = (Date.now() - new Date(githubData.basic.updatedAt)) / (1000 * 60 * 60 * 24);
      metrics.dataFreshness = Math.max(0, 100 - (daysSinceUpdate * 2)); // Lose 2 points per day
    }

    // Activity score
    if (githubData.repositories) {
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      const activeRepos = githubData.repositories.filter(repo => new Date(repo.pushedAt) > sixMonthsAgo);
      metrics.activityScore = Math.min(100, activeRepos.length * 10);
    }

    // Credibility score
    let credibilityScore = 0;
    if (githubData.basic?.followers > 100) credibilityScore += 20;
    if (githubData.basic?.followers > 500) credibilityScore += 30;
    if (githubData.repositories?.length > 20) credibilityScore += 20;
    if (githubData.repositories?.length > 50) credibilityScore += 30;
    
    metrics.credibilityScore = Math.min(credibilityScore, 100);

    return metrics;
  },

  async flagProfile(candidateId, reason, notes = '') {
    return this.findOneAndUpdate(
      { candidateId },
      {
        flagged: true,
        flagReason: reason,
        notes,
        flaggedAt: new Date()
      },
      { new: true }
    );
  },

  async unflagProfile(candidateId) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        flagged: false,
        flagReason: null,
        notes: '',
        flaggedAt: null
      },
      { new: true }
    );
  },

  async searchDevelopers(criteria) {
    const query = { flagged: false };
    
    if (criteria.skills && criteria.skills.length > 0) {
      query['inferredSkills.all'] = { $in: criteria.skills };
    }
    
    if (criteria.specialization) {
      query['inferredSkills.specialization'] = criteria.specialization;
    }
    
    if (criteria.seniority) {
      query['inferredSkills.seniority'] = criteria.seniority;
    }
    
    if (criteria.minDeveloperScore) {
      query.developerScore = { $gte: criteria.minDeveloperScore };
    }
    
    if (criteria.location) {
      query['candidateId.location'] = { $regex: criteria.location, $options: 'i' };
    }

    const profiles = await this.find(query)
      .sort({ developerScore: -1 })
      .limit(criteria.limit || 50)
      .populate('candidateId', 'name email githubUrl location skills');

    return profiles;
  }
};

githubCandidateMetadataSchema.methods = {
  async updateRepositoryData(newRepositories) {
    this.repositories = newRepositories;
    this.githubStats.totalRepos = newRepositories.length;
    this.githubStats.activeRepos = newRepositories.filter(repo => {
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      return new Date(repo.pushedAt) > sixMonthsAgo;
    }).length;
    
    return this.save();
  },

  async updateInferredSkills(newSkills) {
    this.inferredSkills = newSkills;
    return this.save();
  },

  async updateScores(contributionScore, developerScore) {
    this.contributionScore = contributionScore;
    this.developerScore = developerScore;
    return this.save();
  },

  getPrimaryLanguage() {
    if (!this.expertise || !this.expertise.languages || this.expertise.languages.length === 0) {
      return null;
    }
    
    return this.expertise.languages[0].language;
  },

  getTopSkills(limit = 10) {
    if (!this.inferredSkills || !this.inferredSkills.all) {
      return [];
    }
    
    return this.inferredSkills.all.slice(0, limit);
  },

  isSeniorDeveloper() {
    return this.inferredSkills?.seniority === 'senior' || 
           this.inferredSkills?.seniority === 'lead' || 
           this.inferredSkills?.seniority === 'principal';
  },

  isActiveDeveloper(months = 6) {
    if (!this.githubStats?.lastActive) return false;
    
    const cutoffDate = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000);
    return new Date(this.githubStats.lastActive) > cutoffDate;
  },

  getQualityScore() {
    const metrics = this.qualityMetrics || {};
    return (metrics.profileCompleteness + metrics.dataFreshness + metrics.activityScore + metrics.credibilityScore) / 4;
  },

  async addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      return this.save();
    }
    return this;
  },

  async removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    return this.save();
  }
};

export const GitHubCandidateMetadata = mongoose.model('GitHubCandidateMetadata', githubCandidateMetadataSchema);
export default GitHubCandidateMetadata;
