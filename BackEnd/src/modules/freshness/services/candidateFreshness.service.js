import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { activitySignalService } from "./activitySignal.service.js";
import { jobMovementDetectionService } from "./jobMovementDetection.service.js";
import { openToWorkPredictionService } from "./openToWorkPrediction.service.js";

export class CandidateFreshnessService {
  constructor() {
    this.freshnessWeights = {
      activity: 0.4,
      movement: 0.3,
      openToWork: 0.3
    };
    
    this.decayFactors = {
      daily: 0.95,
      weekly: 0.85,
      monthly: 0.7,
      quarterly: 0.5,
      yearly: 0.3
    };
    
    this.freshnessThresholds = {
      veryFresh: 80,
      fresh: 60,
      moderate: 40,
      stale: 20,
      veryStale: 0
    };
  }

  async calculateFreshnessScore(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const freshnessData = {
        candidateId,
        activityScore: 0,
        movementScore: 0,
        openToWorkScore: 0,
        overallScore: 0,
        lastCalculated: new Date(),
        signals: []
      };

      // Calculate activity score
      const activityData = await activitySignalService.analyzeCandidateActivity(candidateId);
      if (activityData && activityData.overallScore !== null) {
        freshnessData.activityScore = activityData.overallScore;
        freshnessData.signals.push(...(activityData.signals || []));
      }

      // Calculate movement score
      const movementData = await jobMovementDetectionService.detectJobMovements(candidateId);
      if (movementData && movementData.signals.length > 0) {
        freshnessData.movementScore = this.calculateMovementScore(movementData.signals);
        freshnessData.signals.push(...movementData.signals);
      }

      // Calculate open to work score
      const openToWorkData = await openToWorkPredictionService.predictOpenToWork(candidateId);
      if (openToWorkData && openToWorkData.overallScore !== null) {
        freshnessData.openToWorkScore = openToWorkData.overallScore;
        freshnessData.signals.push(...(openToWorkData.signals || []));
      }

      // Calculate overall freshness score
      freshnessData.overallScore = this.calculateOverallFreshnessScore(freshnessData);

      return freshnessData;
    } catch (error) {
      console.error('Error calculating freshness score:', error);
      throw error;
    }
  }

  calculateMovementScore(signals) {
    if (!signals || signals.length === 0) return 0;

    let score = 50; // Base score

    signals.forEach(signal => {
      switch (signal.type) {
        case 'career_growth':
          score += 20;
          break;
        case 'career_progression':
          score += 15;
          break;
        case 'startup_experience':
          score += 10;
          break;
        case 'highly_active':
          score += 15;
          break;
        case 'job_hopper':
          score -= 10;
          break;
        case 'experience_growth':
          score += 10;
          break;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  calculateOverallFreshnessScore(freshnessData) {
    const weights = this.freshnessWeights;
    
    const weightedScore = 
      (freshnessData.activityScore * weights.activity) +
      (freshnessData.movementScore * weights.movement) +
      (freshnessData.openToWorkScore * weights.openToWork);

    return Math.round(weightedScore);
  }

  async updateCandidateFreshness(candidateId, freshnessData) {
    try {
      const updateData = {
        freshnessScore: freshnessData.overallScore,
        activityScore: freshnessData.activityScore,
        movementScore: freshnessData.movementScore,
        openToWorkScore: freshnessData.openToWorkScore,
        lastFreshnessAnalysis: freshnessData.lastCalculated,
        freshnessSignals: freshnessData.signals,
        freshnessLevel: this.getFreshnessLevel(freshnessData.overallScore)
      };

      await SourcingCandidate.findByIdAndUpdate(candidateId, updateData);
      return true;
    } catch (error) {
      console.error('Error updating candidate freshness:', error);
      throw error;
    }
  }

  getFreshnessLevel(score) {
    const thresholds = this.freshnessThresholds;
    
    if (score >= thresholds.veryFresh) return 'very_fresh';
    if (score >= thresholds.fresh) return 'fresh';
    if (score >= thresholds.moderate) return 'moderate';
    if (score >= thresholds.stale) return 'stale';
    return 'very_stale';
  }

  async applyRelevanceDecay(candidateId, daysSinceLastActivity) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate || !candidate.freshnessScore) {
        return null;
      }

      let decayFactor = 1.0;
      
      // Determine decay factor based on time since last activity
      if (daysSinceLastActivity <= 7) {
        decayFactor = this.decayFactors.daily;
      } else if (daysSinceLastActivity <= 30) {
        decayFactor = this.decayFactors.weekly;
      } else if (daysSinceLastActivity <= 90) {
        decayFactor = this.decayFactors.monthly;
      } else if (daysSinceLastActivity <= 365) {
        decayFactor = this.decayFactors.quarterly;
      } else {
        decayFactor = this.decayFactors.yearly;
      }

      const decayedScore = Math.round(candidate.freshnessScore * decayFactor);
      const decayedLevel = this.getFreshnessLevel(decayedScore);

      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        relevanceDecayScore: decayedScore,
        relevanceDecayLevel: decayedLevel,
        lastDecayCalculation: new Date()
      });

      return {
        originalScore: candidate.freshnessScore,
        decayedScore,
        decayFactor,
        level: decayedLevel
      };
    } catch (error) {
      console.error('Error applying relevance decay:', error);
      throw error;
    }
  }

  async batchCalculateFreshness(candidateIds) {
    try {
      const results = [];

      for (const candidateId of candidateIds) {
        try {
          const freshnessData = await this.calculateFreshnessScore(candidateId);
          await this.updateCandidateFreshness(candidateId, freshnessData);
          results.push(freshnessData);
        } catch (error) {
          console.error(`Error calculating freshness for candidate ${candidateId}:`, error);
          results.push({
            candidateId,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in batch freshness calculation:', error);
      throw error;
    }
  }

  async refreshStaleCandidates(daysThreshold = 90, limit = 100) {
    try {
      const cutoffDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
      
      const staleCandidates = await SourcingCandidate.find({
        $or: [
          { lastActivityAt: { $lt: cutoffDate } },
          { lastFreshnessAnalysis: { $lt: cutoffDate } },
          { freshnessScore: { $lt: this.freshnessThresholds.stale } }
        ]
      })
      .sort({ lastFreshnessAnalysis: 1 })
      .limit(limit);

      const refreshResults = [];

      for (const candidate of staleCandidates) {
        try {
          const freshnessData = await this.calculateFreshnessScore(candidate._id);
          await this.updateCandidateFreshness(candidate._id, freshnessData);
          
          refreshResults.push({
            candidateId: candidate._id,
            name: candidate.name,
            previousScore: candidate.freshnessScore,
            newScore: freshnessData.overallScore,
            improvement: freshnessData.overallScore - (candidate.freshnessScore || 0),
            refreshed: true
          });
        } catch (error) {
          console.error(`Error refreshing stale candidate ${candidate._id}:`, error);
          refreshResults.push({
            candidateId: candidate._id,
            name: candidate.name,
            error: error.message,
            refreshed: false
          });
        }
      }

      return {
        totalStale: staleCandidates.length,
        refreshed: refreshResults.filter(r => r.refreshed).length,
        failed: refreshResults.filter(r => !r.refreshed).length,
        results: refreshResults
      };
    } catch (error) {
      console.error('Error refreshing stale candidates:', error);
      throw error;
    }
  }

  async getFreshnessDistribution() {
    try {
      const distribution = await SourcingCandidate.aggregate([
        {
          $match: {
            freshnessScore: { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $gte: ['$freshnessScore', this.freshnessThresholds.veryFresh] }, then: 'very_fresh' },
                  { case: { $gte: ['$freshnessScore', this.freshnessThresholds.fresh] }, then: 'fresh' },
                  { case: { $gte: ['$freshnessScore', this.freshnessThresholds.moderate] }, then: 'moderate' },
                  { case: { $gte: ['$freshnessScore', this.freshnessThresholds.stale] }, then: 'stale' }
                ],
                default: 'very_stale'
              }
            },
            count: { $sum: 1 },
            avgScore: { $avg: '$freshnessScore' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return distribution;
    } catch (error) {
      console.error('Error getting freshness distribution:', error);
      throw error;
    }
  }

  async getFreshnessTrends(timeRange = '30d') {
    try {
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

      const trends = await SourcingCandidate.aggregate([
        {
          $match: {
            lastFreshnessAnalysis: { $gte: startDate },
            freshnessScore: { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$lastFreshnessAnalysis'
              }
            },
            avgFreshness: { $avg: '$freshnessScore' },
            count: { $sum: 1 },
            maxFreshness: { $max: '$freshnessScore' },
            minFreshness: { $min: '$freshnessScore' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return {
        timeRange,
        startDate,
        endDate: now,
        trends
      };
    } catch (error) {
      console.error('Error getting freshness trends:', error);
      throw error;
    }
  }

  async getCandidatesByFreshness(minScore = 0, maxScore = 100, limit = 50) {
    try {
      const candidates = await SourcingCandidate.find({
        freshnessScore: { $gte: minScore, $lte: maxScore }
      })
      .sort({ freshnessScore: -1 })
      .limit(limit)
      .select('name email freshnessScore freshnessLevel lastFreshnessAnalysis');

      return candidates;
    } catch (error) {
      console.error('Error getting candidates by freshness:', error);
      throw error;
    }
  }

  async getTopFreshCandidates(limit = 20) {
    try {
      const candidates = await SourcingCandidate.find({
        freshnessScore: { $gte: this.freshnessThresholds.fresh }
      })
      .sort({ freshnessScore: -1, lastFreshnessAnalysis: -1 })
      .limit(limit)
      .select('name email freshnessScore freshnessLevel lastFreshnessAnalysis activityScore openToWorkScore');

      return candidates;
    } catch (error) {
      console.error('Error getting top fresh candidates:', error);
      throw error;
    }
  }

  async getStaleCandidates(daysThreshold = 90, limit = 50) {
    try {
      const cutoffDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
      
      const candidates = await SourcingCandidate.find({
        $or: [
          { lastActivityAt: { $lt: cutoffDate } },
          { lastFreshnessAnalysis: { $lt: cutoffDate } },
          { freshnessScore: { $lt: this.freshnessThresholds.stale } }
        ]
      })
      .sort({ lastFreshnessAnalysis: 1 })
      .limit(limit)
      .select('name email freshnessScore freshnessLevel lastFreshnessAnalysis lastActivityAt');

      return candidates;
    } catch (error) {
      console.error('Error getting stale candidates:', error);
      throw error;
    }
  }

  async calculateEngagementScore(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      let engagementScore = 0;

      // Profile completeness contributes to engagement
      const completenessScore = this.calculateProfileCompleteness(candidate);
      engagementScore += completenessScore * 0.3;

      // Recent activity contributes to engagement
      const activityScore = candidate.activityScore || 0;
      engagementScore += activityScore * 0.4;

      // Open to work score contributes to engagement
      const openToWorkScore = candidate.openToWorkScore || 0;
      engagementScore += openToWorkScore * 0.3;

      return Math.round(engagementScore);
    } catch (error) {
      console.error('Error calculating engagement score:', error);
      throw error;
    }
  }

  calculateProfileCompleteness(candidate) {
    let score = 0;
    const maxScore = 100;

    // Basic information
    if (candidate.name) score += 15;
    if (candidate.email) score += 15;
    if (candidate.location) score += 10;

    // Professional information
    if (candidate.title) score += 10;
    if (candidate.summary) score += 10;

    // Links and profiles
    if (candidate.githubUrl) score += 10;
    if (candidate.portfolioUrl) score += 10;
    if (candidate.resumeUrl) score += 10;
    if (candidate.linkedinUrl) score += 10;

    // Skills and experience
    if (candidate.skills && candidate.skills.length > 0) score += 10;

    return Math.min(maxScore, score);
  }

  async scheduleFreshnessUpdate(candidateId, delayMinutes = 0) {
    try {
      const updateData = {
        candidateId,
        scheduledAt: new Date(Date.now() + delayMinutes * 60 * 1000),
        type: 'freshness_update'
      };

      // This would integrate with your scheduling system
      // For now, return the scheduled update data
      return updateData;
    } catch (error) {
      console.error('Error scheduling freshness update:', error);
      throw error;
    }
  }

  async getFreshnessStats(timeRange = '30d') {
    try {
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

      const stats = await SourcingCandidate.aggregate([
        {
          $match: {
            lastFreshnessAnalysis: { $gte: startDate },
            freshnessScore: { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            totalCandidates: { $sum: 1 },
            avgFreshness: { $avg: '$freshnessScore' },
            maxFreshness: { $max: '$freshnessScore' },
            minFreshness: { $min: '$freshnessScore' },
            veryFresh: {
              $sum: { $cond: [{ $gte: ['$freshnessScore', this.freshnessThresholds.veryFresh] }, 1, 0] }
            },
            fresh: {
              $sum: { $cond: [{ $gte: ['$freshnessScore', this.freshnessThresholds.fresh] }, 1, 0] }
            },
            moderate: {
              $sum: { $cond: [{ $gte: ['$freshnessScore', this.freshnessThresholds.moderate] }, 1, 0] }
            },
            stale: {
              $sum: { $cond: [{ $gte: ['$freshnessScore', this.freshnessThresholds.stale] }, 1, 0] }
            },
            veryStale: {
              $sum: { $cond: [{ $lt: ['$freshnessScore', this.freshnessThresholds.stale] }, 1, 0] }
            }
          }
        }
      ]);

      return {
        timeRange,
        period: { start: startDate, end: now },
        stats: stats[0] || {
          totalCandidates: 0,
          avgFreshness: 0,
          maxFreshness: 0,
          minFreshness: 0,
          veryFresh: 0,
          fresh: 0,
          moderate: 0,
          stale: 0,
          veryStale: 0
        }
      };
    } catch (error) {
      console.error('Error getting freshness stats:', error);
      throw error;
    }
  }
}

export const candidateFreshnessService = new CandidateFreshnessService();
export default candidateFreshnessService;
