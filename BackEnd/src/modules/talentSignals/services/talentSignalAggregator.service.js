import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { TalentSignal } from "../../../models/talentSignal.model.js";
import { openToWorkPredictionService } from "./openToWorkPrediction.service.js";
import { recruiterResponsePredictionService } from "./recruiterResponsePrediction.service.js";
import { careerTransitionPredictionService } from "./careerTransitionPrediction.service.js";
import { startupAffinityService } from "./startupAffinity.service.js";
import { leadershipPotentialService } from "./leadershipPotential.service.js";

export class TalentSignalAggregatorService {
  constructor() {
    this.weights = {
      opportunityScore: {
        openToWork: 0.4,
        recruiterResponse: 0.3,
        careerTransition: 0.2,
        startupAffinity: 0.1
      },
      sourcingPriority: {
        leadership: 0.3,
        startupAffinity: 0.25,
        careerTransition: 0.25,
        recruiterResponse: 0.2
      },
      recruiterTargeting: {
        recruiterResponse: 0.4,
        openToWork: 0.3,
        leadership: 0.2,
        careerTransition: 0.1
      },
      talentMomentum: {
        careerTransition: 0.35,
        leadership: 0.25,
        startupAffinity: 0.2,
        openToWork: 0.2
      }
    };
  }

  async aggregateTalentSignals(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      // Get all individual predictions
      const [
        openToWorkPrediction,
        recruiterResponsePrediction,
        careerTransitionPrediction,
        startupAffinityPrediction,
        leadershipPrediction
      ] = await Promise.all([
        openToWorkPredictionService.predictOpenToWork(candidateId),
        recruiterResponsePredictionService.predictRecruiterResponse(candidateId),
        careerTransitionPredictionService.predictCareerTransition(candidateId),
        startupAffinityService.predictStartupAffinity(candidateId),
        leadershipPotentialService.predictLeadershipPotential(candidateId)
      ]);

      // Calculate aggregated scores
      const aggregatedScores = {
        opportunityScore: this.calculateOpportunityScore({
          openToWork: openToWorkPrediction.openToWorkScore,
          recruiterResponse: recruiterResponsePrediction.responseProbability,
          careerTransition: careerTransitionPrediction.transitionProbability,
          startupAffinity: startupAffinityPrediction.startupAffinityScore
        }),
        sourcingPriorityScore: this.calculateSourcingPriorityScore({
          leadership: leadershipPrediction.leadershipScore,
          startupAffinity: startupAffinityPrediction.startupAffinityScore,
          careerTransition: careerTransitionPrediction.transitionProbability,
          recruiterResponse: recruiterResponsePrediction.responseProbability
        }),
        recruiterTargetingScore: this.calculateRecruiterTargetingScore({
          recruiterResponse: recruiterResponsePrediction.responseProbability,
          openToWork: openToWorkPrediction.openToWorkScore,
          leadership: leadershipPrediction.leadershipScore,
          careerTransition: careerTransitionPrediction.transitionProbability
        }),
        talentMomentumScore: this.calculateTalentMomentumScore({
          careerTransition: careerTransitionPrediction.transitionProbability,
          leadership: leadershipPrediction.leadershipScore,
          startupAffinity: startupAffinityPrediction.startupAffinityScore,
          openToWork: openToWorkPrediction.openToWorkScore
        })
      };

      // Calculate overall confidence
      const overallConfidence = this.calculateOverallConfidence([
        openToWorkPrediction.confidence,
        recruiterResponsePrediction.confidence,
        careerTransitionPrediction.confidence,
        startupAffinityPrediction.confidence,
        leadershipPrediction.confidence
      ]);

      // Generate insights and recommendations
      const insights = this.generateInsights({
        openToWork: openToWorkPrediction,
        recruiterResponse: recruiterResponsePrediction,
        careerTransition: careerTransitionPrediction,
        startupAffinity: startupAffinityPrediction,
        leadership: leadershipPrediction
      });

      const recommendations = this.generateRecommendations({
        openToWork: openToWorkPrediction,
        recruiterResponse: recruiterResponsePrediction,
        careerTransition: careerTransitionPrediction,
        startupAffinity: startupAffinityPrediction,
        leadership: leadershipPrediction,
        aggregatedScores
      });

      // Update talent signal with aggregated data
      await this.updateTalentSignal(candidateId, {
        aggregatedScores,
        overallConfidence,
        insights,
        recommendations,
        individualPredictions: {
          openToWork: openToWorkPrediction,
          recruiterResponse: recruiterResponsePrediction,
          careerTransition: careerTransitionPrediction,
          startupAffinity: startupAffinityPrediction,
          leadership: leadershipPrediction
        }
      });

      return {
        candidateId,
        aggregatedScores,
        overallConfidence,
        insights,
        recommendations,
        individualPredictions: {
          openToWork: openToWorkPrediction,
          recruiterResponse: recruiterResponsePrediction,
          careerTransition: careerTransitionPrediction,
          startupAffinity: startupAffinityPrediction,
          leadership: leadershipPrediction
        },
        metadata: {
          modelVersion: '1.0',
          timestamp: new Date(),
          dataQuality: this.assessDataQuality(candidate)
        }
      };

    } catch (error) {
      console.error('Error aggregating talent signals:', error);
      throw error;
    }
  }

  calculateOpportunityScore(scores) {
    const weights = this.weights.opportunityScore;
    
    return Math.round(
      (scores.openToWork * weights.openToWork +
       scores.recruiterResponse * weights.recruiterResponse +
       scores.careerTransition * weights.careerTransition +
       scores.startupAffinity * weights.startupAffinity) * 100
    ) / 100;
  }

  calculateSourcingPriorityScore(scores) {
    const weights = this.weights.sourcingPriority;
    
    return Math.round(
      (scores.leadership * weights.leadership +
       scores.startupAffinity * weights.startupAffinity +
       scores.careerTransition * weights.careerTransition +
       scores.recruiterResponse * weights.recruiterResponse) * 100
    ) / 100;
  }

  calculateRecruiterTargetingScore(scores) {
    const weights = this.weights.recruiterTargeting;
    
    return Math.round(
      (scores.recruiterResponse * weights.recruiterResponse +
       scores.openToWork * weights.openToWork +
       scores.leadership * weights.leadership +
       scores.careerTransition * weights.careerTransition) * 100
    ) / 100;
  }

  calculateTalentMomentumScore(scores) {
    const weights = this.weights.talentMomentum;
    
    return Math.round(
      (scores.careerTransition * weights.careerTransition +
       scores.leadership * weights.leadership +
       scores.startupAffinity * weights.startupAffinity +
       scores.openToWork * weights.openToWork) * 100
    ) / 100;
  }

  calculateOverallConfidence(confidences) {
    const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    return Math.round(avgConfidence * 100) / 100;
  }

  generateInsights(predictions) {
    const insights = [];

    // Open to work insights
    if (predictions.openToWork.openToWorkScore > 0.75) {
      insights.push({
        type: 'high_opportunity',
        category: 'open_to_work',
        message: 'Candidate shows strong signals of being open to new opportunities',
        confidence: predictions.openToWork.confidence,
        actionable: true
      });
    }

    // Recruiter response insights
    if (predictions.recruiterResponse.responseProbability > 0.8) {
      insights.push({
        type: 'high_engagement',
        category: 'recruiter_response',
        message: 'Candidate is likely to respond positively to recruiter outreach',
        confidence: predictions.recruiterResponse.confidence,
        actionable: true
      });
    }

    // Career transition insights
    if (predictions.careerTransition.transitionProbability > 0.7) {
      insights.push({
        type: 'transition_ready',
        category: 'career_transition',
        message: 'Candidate is likely to make a career transition soon',
        confidence: predictions.careerTransition.confidence,
        actionable: true
      });
    }

    // Startup affinity insights
    if (predictions.startupAffinity.startupAffinityScore > 0.7) {
      insights.push({
        type: 'startup_fit',
        category: 'startup_affinity',
        message: 'Candidate shows strong affinity for startup environments',
        confidence: predictions.startupAffinity.confidence,
        actionable: true
      });
    }

    // Leadership insights
    if (predictions.leadership.leadershipScore > 0.75) {
      insights.push({
        type: 'leadership_potential',
        category: 'leadership',
        message: 'Candidate demonstrates high leadership potential',
        confidence: predictions.leadership.confidence,
        actionable: true
      });
    }

    // Combined insights
    if (predictions.openToWork.openToWorkScore > 0.7 && 
        predictions.recruiterResponse.responseProbability > 0.7) {
      insights.push({
        type: 'prime_candidate',
        category: 'combined',
        message: 'Prime candidate for immediate outreach - high openness and engagement likelihood',
        confidence: Math.min(predictions.openToWork.confidence, predictions.recruiterResponse.confidence),
        actionable: true
      });
    }

    if (predictions.startupAffinity.startupAffinityScore > 0.7 && 
        predictions.leadership.leadershipScore > 0.7) {
      insights.push({
        type: 'startup_leader',
        category: 'combined',
        message: 'Strong fit for startup leadership roles',
        confidence: Math.min(predictions.startupAffinity.confidence, predictions.leadership.confidence),
        actionable: true
      });
    }

    return insights;
  }

  generateRecommendations(predictions, aggregatedScores) {
    const recommendations = [];

    // Outreach recommendations
    if (aggregatedScores.recruiterTargetingScore > 0.7) {
      recommendations.push({
        type: 'outreach',
        priority: 'high',
        action: 'immediate_outreach',
        message: 'Reach out immediately with personalized message',
        timing: predictions.recruiterResponse.predictions.optimalOutreachTime,
        channel: predictions.recruiterResponse.predictions.bestOutreachChannel
      });
    } else if (aggregatedScores.recruiterTargetingScore > 0.5) {
      recommendations.push({
        type: 'outreach',
        priority: 'medium',
        action: 'strategic_outreach',
        message: 'Plan strategic outreach with value proposition',
        timing: 'within_week',
        channel: 'linkedin'
      });
    }

    // Role recommendations
    if (predictions.leadership.leadershipScore > 0.7) {
      recommendations.push({
        type: 'role',
        priority: 'high',
        action: 'leadership_roles',
        message: 'Focus on leadership and management opportunities',
        roles: ['Tech Lead', 'Engineering Manager', 'Principal Engineer']
      });
    }

    if (predictions.startupAffinity.startupAffinityScore > 0.7) {
      recommendations.push({
        type: 'company',
        priority: 'high',
        action: 'startup_companies',
        message: 'Target fast-growing startups and scale-ups',
        stages: ['Series A', 'Series B', 'Growth Stage']
      });
    }

    // Compensation recommendations
    if (predictions.startupAffinity.predictions.equityVsSalaryPreference === 'equity_focused') {
      recommendations.push({
        type: 'compensation',
        priority: 'medium',
        action: 'equity_heavy',
        message: 'Emphasize equity and growth potential in compensation package'
      });
    }

    // Follow-up recommendations
    if (predictions.recruiterResponse.predictions.followUpStrategy === 'gentle_follow_up') {
      recommendations.push({
        type: 'follow_up',
        priority: 'medium',
        action: 'gentle_followup',
        message: 'Plan gentle follow-up after 3-5 days',
        timing: '3-5_days'
      });
    }

    return recommendations;
  }

  async updateTalentSignal(candidateId, aggregatedData) {
    try {
      await TalentSignal.findOneAndUpdate(
        { candidateId },
        {
          candidateId,
          opportunityScore: aggregatedData.aggregatedScores.opportunityScore,
          sourcingPriorityScore: aggregatedData.aggregatedScores.sourcingPriorityScore,
          recruiterTargetingScore: aggregatedData.aggregatedScores.recruiterTargetingScore,
          talentMomentumScore: aggregatedData.aggregatedScores.talentMomentumScore,
          predictionMetadata: {
            aggregated: {
              scores: aggregatedData.aggregatedScores,
              confidence: aggregatedData.overallConfidence,
              insights: aggregatedData.insights,
              recommendations: aggregatedData.recommendations,
              individualPredictions: aggregatedData.individualPredictions,
              metadata: aggregatedData.metadata
            }
          },
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error updating talent signal:', error);
      throw error;
    }
  }

  async batchAggregateSignals(candidateIds) {
    const results = [];
    
    for (const candidateId of candidateIds) {
      try {
        const result = await this.aggregateTalentSignals(candidateId);
        results.push(result);
      } catch (error) {
        console.error(`Error aggregating signals for candidate ${candidateId}:`, error);
        results.push({
          candidateId,
          error: error.message,
          aggregatedScores: {
            opportunityScore: 0,
            sourcingPriorityScore: 0,
            recruiterTargetingScore: 0,
            talentMomentumScore: 0
          },
          overallConfidence: 0
        });
      }
    }
    
    return results;
  }

  async getTopCandidatesByScore(scoreType = 'opportunityScore', limit = 50) {
    try {
      const candidates = await TalentSignal.find({})
        .sort({ [scoreType]: -1 })
        .limit(limit)
        .lean();

      return candidates.map(candidate => ({
        candidateId: candidate.candidateId,
        score: candidate[scoreType],
        opportunityScore: candidate.opportunityScore,
        sourcingPriorityScore: candidate.sourcingPriorityScore,
        recruiterTargetingScore: candidate.recruiterTargetingScore,
        talentMomentumScore: candidate.talentMomentumScore,
        lastUpdated: candidate.lastUpdated
      }));
    } catch (error) {
      console.error('Error getting top candidates:', error);
      return [];
    }
  }

  async getCandidateSegments() {
    try {
      const allCandidates = await TalentSignal.find({}).lean();
      
      const segments = {
        highOpportunity: allCandidates.filter(c => c.opportunityScore > 0.75),
        highPriority: allCandidates.filter(c => c.sourcingPriorityScore > 0.75),
        highTargeting: allCandidates.filter(c => c.recruiterTargetingScore > 0.75),
        highMomentum: allCandidates.filter(c => c.talentMomentumScore > 0.75),
        primeCandidates: allCandidates.filter(c => 
          c.opportunityScore > 0.75 && c.recruiterTargetingScore > 0.75
        ),
        startupLeaders: allCandidates.filter(c => 
          c.startupAffinityScore > 0.75 && c.leadershipScore > 0.75
        )
      };

      return {
        totalCandidates: allCandidates.length,
        segments: Object.entries(segments).reduce((acc, [key, candidates]) => {
          acc[key] = {
            count: candidates.length,
            percentage: ((candidates.length / allCandidates.length) * 100).toFixed(2),
            candidates: candidates.slice(0, 10).map(c => ({
              candidateId: c.candidateId,
              scores: {
                opportunity: c.opportunityScore,
                priority: c.sourcingPriorityScore,
                targeting: c.recruiterTargetingScore,
                momentum: c.talentMomentumScore
              }
            }))
          };
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error getting candidate segments:', error);
      return { totalCandidates: 0, segments: {} };
    }
  }

  async getSignalAnalytics(timeRange = '30d') {
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

      const candidates = await TalentSignal.find({
        lastUpdated: { $gte: startDate }
      }).lean();

      const analytics = {
        timeRange,
        period: { start: startDate, end: now },
        totalCandidates: candidates.length,
        scoreDistributions: {
          opportunityScore: this.calculateScoreDistribution(candidates, 'opportunityScore'),
          sourcingPriorityScore: this.calculateScoreDistribution(candidates, 'sourcingPriorityScore'),
          recruiterTargetingScore: this.calculateScoreDistribution(candidates, 'recruiterTargetingScore'),
          talentMomentumScore: this.calculateScoreDistribution(candidates, 'talentMomentumScore')
        },
        averages: {
          opportunityScore: this.calculateAverage(candidates, 'opportunityScore'),
          sourcingPriorityScore: this.calculateAverage(candidates, 'sourcingPriorityScore'),
          recruiterTargetingScore: this.calculateAverage(candidates, 'recruiterTargetingScore'),
          talentMomentumScore: this.calculateAverage(candidates, 'talentMomentumScore')
        },
        topPerformers: {
          opportunity: this.getTopPerformers(candidates, 'opportunityScore', 5),
          priority: this.getTopPerformers(candidates, 'sourcingPriorityScore', 5),
          targeting: this.getTopPerformers(candidates, 'recruiterTargetingScore', 5),
          momentum: this.getTopPerformers(candidates, 'talentMomentumScore', 5)
        }
      };

      return analytics;
    } catch (error) {
      console.error('Error getting signal analytics:', error);
      return {
        timeRange,
        totalCandidates: 0,
        scoreDistributions: {},
        averages: {},
        topPerformers: {}
      };
    }
  }

  calculateScoreDistribution(candidates, scoreField) {
    const distribution = {
      high: candidates.filter(c => c[scoreField] > 0.75).length,
      medium: candidates.filter(c => c[scoreField] > 0.5 && c[scoreField] <= 0.75).length,
      low: candidates.filter(c => c[scoreField] <= 0.5).length
    };

    const total = candidates.length;
    return {
      ...distribution,
      highPercentage: total > 0 ? ((distribution.high / total) * 100).toFixed(2) : 0,
      mediumPercentage: total > 0 ? ((distribution.medium / total) * 100).toFixed(2) : 0,
      lowPercentage: total > 0 ? ((distribution.low / total) * 100).toFixed(2) : 0
    };
  }

  calculateAverage(candidates, scoreField) {
    if (candidates.length === 0) return 0;
    
    const sum = candidates.reduce((total, candidate) => total + (candidate[scoreField] || 0), 0);
    return Math.round((sum / candidates.length) * 100) / 100;
  }

  getTopPerformers(candidates, scoreField, limit) {
    return candidates
      .sort((a, b) => (b[scoreField] || 0) - (a[scoreField] || 0))
      .slice(0, limit)
      .map(candidate => ({
        candidateId: candidate.candidateId,
        score: candidate[scoreField],
        lastUpdated: candidate.lastUpdated
      }));
  }

  assessDataQuality(candidate) {
    let qualityScore = 0;
    let totalChecks = 0;

    // Check experience data
    if (candidate.experience && candidate.experience.length > 0) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check skills data
    if (candidate.skills && candidate.skills.length > 0) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check activity data
    if (candidate.githubData || candidate.linkedinData || candidate.portfolioData) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check communication data
    if (candidate.summary) {
      qualityScore += 1;
      totalChecks++;
    }

    return totalChecks > 0 ? qualityScore / totalChecks : 0;
  }

  async refreshCandidateSignals(candidateId) {
    try {
      // Re-run all individual predictions
      await Promise.all([
        openToWorkPredictionService.predictOpenToWork(candidateId),
        recruiterResponsePredictionService.predictRecruiterResponse(candidateId),
        careerTransitionPredictionService.predictCareerTransition(candidateId),
        startupAffinityService.predictStartupAffinity(candidateId),
        leadershipPotentialService.predictLeadershipPotential(candidateId)
      ]);

      // Re-aggregate signals
      return await this.aggregateTalentSignals(candidateId);
    } catch (error) {
      console.error('Error refreshing candidate signals:', error);
      throw error;
    }
  }

  async batchRefreshSignals(candidateIds) {
    const results = [];
    
    for (const candidateId of candidateIds) {
      try {
        const result = await this.refreshCandidateSignals(candidateId);
        results.push(result);
      } catch (error) {
        console.error(`Error refreshing signals for candidate ${candidateId}:`, error);
        results.push({
          candidateId,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

export const talentSignalAggregatorService = new TalentSignalAggregatorService();
export default talentSignalAggregatorService;
