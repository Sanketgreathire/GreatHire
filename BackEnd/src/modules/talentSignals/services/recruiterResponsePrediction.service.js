import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { TalentSignal } from "../../../models/talentSignal.model.js";

export class RecruiterResponsePredictionService {
  constructor() {
    this.weights = {
      engagementHistory: 0.35,
      profileSignals: 0.25,
      activitySignals: 0.2,
      careerSignals: 0.15,
      timingSignals: 0.05
    };
    
    this.responseThresholds = {
      highResponse: 0.75,
      mediumResponse: 0.5,
      lowResponse: 0.25
    };
  }

  async predictRecruiterResponse(candidateId, outreachContext = {}) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const existingSignal = await TalentSignal.findOne({ candidateId });

      // Analyze different signal categories
      const engagementHistory = await this.analyzeEngagementHistory(candidate);
      const profileSignals = await this.analyzeProfileSignals(candidate);
      const activitySignals = await this.analyzeActivitySignals(candidate);
      const careerSignals = await this.analyzeCareerSignals(candidate);
      const timingSignals = await this.analyzeTimingSignals(candidate, outreachContext);

      // Calculate weighted scores
      const scores = {
        engagementScore: this.calculateEngagementScore(engagementHistory),
        profileScore: this.calculateProfileScore(profileSignals),
        activityScore: this.calculateActivityScore(activitySignals),
        careerScore: this.calculateCareerScore(careerSignals),
        timingScore: this.calculateTimingScore(timingSignals)
      };

      // Calculate overall response probability
      const responseProbability = this.calculateResponseProbability(scores);
      
      // Determine response likelihood
      const responseLikelihood = this.determineResponseLikelihood(responseProbability);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(scores, engagementHistory);

      // Generate predictions
      const predictions = {
        outreachResponseProbability: Math.round(responseProbability * 100) / 100,
        recruiterEngagementLikelihood: responseLikelihood,
        candidateResponsivenessScore: this.calculateResponsivenessScore(scores),
        bestOutreachChannel: this.predictBestOutreachChannel(profileSignals, activitySignals),
        optimalOutreachTime: this.predictOptimalOutreachTime(activitySignals, timingSignals),
        expectedResponseTime: this.predictResponseTime(engagementHistory, responseProbability),
        followUpStrategy: this.recommendFollowUpStrategy(responseProbability, engagementHistory),
        personalizationApproach: this.recommendPersonalization(profileSignals, careerSignals)
      };

      return {
        candidateId,
        responseProbability: Math.round(responseProbability * 100) / 100,
        responseLikelihood,
        confidence: Math.round(confidence * 100) / 100,
        scores,
        signals: {
          engagement: engagementHistory,
          profile: profileSignals,
          activity: activitySignals,
          career: careerSignals,
          timing: timingSignals
        },
        predictions,
        metadata: {
          modelVersion: '1.0',
          timestamp: new Date(),
          outreachContext,
          dataQuality: this.assessDataQuality(candidate)
        }
      };

    } catch (error) {
      console.error('Error predicting recruiter response:', error);
      throw error;
    }
  }

  async analyzeEngagementHistory(candidate) {
    const signals = {
      responseRate: 0,
      averageResponseTime: 0,
      positiveResponseRatio: 0,
      recentEngagement: 0,
      outreachFrequency: 0
    };

    if (candidate.interactionHistory) {
      const interactions = candidate.interactionHistory || [];
      const recruiterInteractions = interactions.filter(interaction => 
        interaction.type === 'recruiter_outreach' && interaction.response
      );

      if (recruiterInteractions.length > 0) {
        // Response rate
        const totalOutreach = interactions.filter(interaction => 
          interaction.type === 'recruiter_outreach'
        ).length;
        signals.responseRate = recruiterInteractions.length / Math.max(totalOutreach, 1);

        // Average response time
        const responseTimes = recruiterInteractions.map(interaction => {
          if (interaction.responseTimestamp && interaction.timestamp) {
            return new Date(interaction.responseTimestamp) - new Date(interaction.timestamp);
          }
          return 0;
        }).filter(time => time > 0);

        if (responseTimes.length > 0) {
          signals.averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
        }

        // Positive response ratio
        const positiveResponses = recruiterInteractions.filter(interaction => 
          interaction.response === 'positive' || interaction.response === 'interested'
        ).length;
        signals.positiveResponseRatio = positiveResponses / recruiterInteractions.length;

        // Recent engagement (last 90 days)
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const recentInteractions = recruiterInteractions.filter(interaction => 
          new Date(interaction.timestamp) > ninetyDaysAgo
        );
        signals.recentEngagement = recentInteractions.length / Math.max(recruiterInteractions.length, 1);
      }

      // Outreach frequency tolerance
      const outreachFrequency = this.calculateOutreachFrequency(interactions);
      signals.outreachFrequency = Math.min(outreachFrequency / 10, 1); // Normalize
    }

    return signals;
  }

  async analyzeProfileSignals(candidate) {
    const signals = {
      profileCompleteness: 0,
      professionalNetwork: 0,
      industryKeywords: 0,
      opennessIndicators: 0,
      contactPreference: 0
    };

    // Profile completeness
    const requiredFields = ['name', 'email', 'experience', 'skills', 'location'];
    const completedFields = requiredFields.filter(field => candidate[field]);
    signals.profileCompleteness = completedFields.length / requiredFields.length;

    // Professional network
    if (candidate.linkedinData && candidate.linkedinData.connections) {
      const connectionCount = candidate.linkedinData.connections.count || 0;
      signals.professionalNetwork = Math.min(connectionCount / 1000, 1); // Normalize to 1000 connections
    }

    // Industry keywords
    if (candidate.summary || candidate.experience) {
      const text = `${candidate.summary || ''} ${(candidate.experience || []).map(exp => exp.description).join(' ')}`;
      const professionalKeywords = ['professional', 'career', 'opportunity', 'network', 'collaborate'];
      const keywordCount = professionalKeywords.filter(keyword => text.toLowerCase().includes(keyword)).length;
      signals.industryKeywords = Math.min(keywordCount / professionalKeywords.length, 1);
    }

    // Openness indicators
    if (candidate.summary || candidate.lookingFor) {
      const text = `${candidate.summary || ''} ${candidate.lookingFor || ''}`;
      const opennessKeywords = ['open', 'considering', 'exploring', 'interested', 'opportunity'];
      const keywordCount = opennessKeywords.filter(keyword => text.toLowerCase().includes(keyword)).length;
      signals.opennessIndicators = Math.min(keywordCount / opennessKeywords.length, 1);
    }

    // Contact preference
    if (candidate.contactPreferences) {
      signals.contactPreference = candidate.contactPreferences.includes('recruiter') ? 1 : 0.5;
    }

    return signals;
  }

  async analyzeActivitySignals(candidate) {
    const signals = {
      linkedinActivity: 0,
      githubActivity: 0,
      portfolioActivity: 0,
      contentEngagement: 0,
      networkGrowth: 0
    };

    // LinkedIn activity
    if (candidate.linkedinData) {
      const linkedinData = candidate.linkedinData;
      
      if (linkedinData.recentPosts) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentPosts = linkedinData.recentPosts.filter(post => 
          new Date(post.date) > thirtyDaysAgo
        ).length;
        signals.linkedinActivity = Math.min(recentPosts / 5, 1);
      }

      if (linkedinData.connections && linkedinData.connections.monthlyGrowth) {
        signals.networkGrowth = Math.min(linkedinData.connections.monthlyGrowth / 50, 1);
      }
    }

    // GitHub activity
    if (candidate.githubData) {
      const githubData = candidate.githubData;
      
      if (githubData.recentCommits) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentCommits = githubData.recentCommits.filter(commit => 
          new Date(commit.date) > thirtyDaysAgo
        ).length;
        signals.githubActivity = Math.min(recentCommits / 20, 1);
      }
    }

    // Portfolio activity
    if (candidate.portfolioData) {
      const portfolioData = candidate.portfolioData;
      
      if (portfolioData.projects) {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const recentProjects = portfolioData.projects.filter(project => 
          project.lastUpdated && new Date(project.lastUpdated) > ninetyDaysAgo
        ).length;
        signals.portfolioActivity = Math.min(recentProjects / 3, 1);
      }
    }

    // Content engagement
    if (candidate.linkedinData && candidate.linkedinData.contentInteractions) {
      const interactions = candidate.linkedinData.contentInteractions;
      const engagementRate = (interactions.likes + interactions.comments + interactions.shares) / 
                           Math.max(interactions.views, 1);
      signals.contentEngagement = Math.min(engagementRate, 1);
    }

    return signals;
  }

  async analyzeCareerSignals(candidate) {
    const signals = {
      jobStability: 0,
      careerProgression: 0,
      industryRelevance: 0,
      seniorityLevel: 0,
      transitionReadiness: 0
    };

    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const currentJob = experiences.find(exp => exp.isCurrentJob);
      
      // Job stability
      if (currentJob) {
        const jobDuration = (Date.now() - new Date(currentJob.startDate).getTime()) / (24 * 60 * 60 * 1000);
        signals.jobStability = Math.min(jobDuration / 365, 1); // Years at current job
        
        // Too stable might mean less responsive
        if (signals.jobStability > 5) {
          signals.jobStability = 0.3; // Very stable = less likely to respond
        } else if (signals.jobStability < 1) {
          signals.jobStability = 0.8; // Recent job change = more responsive
        }
      }

      // Career progression
      let progressionScore = 0;
      for (let i = 1; i < experiences.length; i++) {
        const current = experiences[i];
        const previous = experiences[i - 1];
        
        if (this.isPromotion(previous.title, current.title)) {
          progressionScore += 0.3;
        }
      }
      signals.careerProgression = Math.min(progressionScore, 1);

      // Industry relevance (based on current role)
      if (currentJob) {
        const inDemandIndustries = ['technology', 'software', 'engineering', 'data', 'ai', 'cloud'];
        const jobText = `${currentJob.title} ${currentJob.company} ${currentJob.description || ''}`.toLowerCase();
        signals.industryRelevance = inDemandIndustries.some(industry => jobText.includes(industry)) ? 1 : 0.5;
      }

      // Seniority level
      if (currentJob) {
        const seniorityLevels = {
          'junior': 0.2,
          'mid': 0.4,
          'senior': 0.6,
          'lead': 0.7,
          'principal': 0.8,
          'director': 0.9,
          'vp': 1.0
        };
        
        const title = currentJob.title.toLowerCase();
        signals.seniorityLevel = 0.5; // Default
        
        for (const [level, score] of Object.entries(seniorityLevels)) {
          if (title.includes(level)) {
            signals.seniorityLevel = score;
            break;
          }
        }
      }

      // Transition readiness
      const totalExperience = experiences.reduce((sum, exp) => {
        if (exp.startDate && exp.endDate) {
          return sum + (new Date(exp.endDate) - new Date(exp.startDate)) / (365 * 24 * 60 * 60 * 1000);
        }
        return sum;
      }, 0);
      
      signals.transitionReadiness = totalExperience > 5 ? 0.7 : totalExperience > 2 ? 0.5 : 0.3;
    }

    return signals;
  }

  async analyzeTimingSignals(candidate, outreachContext) {
    const signals = {
      bestDayOfWeek: 0,
      bestTimeOfDay: 0,
      seasonalPreference: 0,
      responsePattern: 0,
      currentAvailability: 0
    };

    if (candidate.interactionHistory) {
      const interactions = candidate.interactionHistory || [];
      const successfulInteractions = interactions.filter(interaction => 
        interaction.type === 'recruiter_outreach' && 
        interaction.response && 
        interaction.response === 'positive'
      );

      if (successfulInteractions.length > 0) {
        // Best day of week
        const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday
        successfulInteractions.forEach(interaction => {
          const day = new Date(interaction.timestamp).getDay();
          dayCounts[day]++;
        });
        
        const maxDayCount = Math.max(...dayCounts);
        signals.bestDayOfWeek = maxDayCount / successfulInteractions.length;

        // Best time of day
        const hourCounts = new Array(24).fill(0);
        successfulInteractions.forEach(interaction => {
          const hour = new Date(interaction.timestamp).getHours();
          hourCounts[hour]++;
        });
        
        const maxHourCount = Math.max(...hourCounts);
        signals.bestTimeOfDay = maxHourCount / successfulInteractions.length;

        // Response pattern consistency
        signals.responsePattern = Math.min(successfulInteractions.length / 10, 1);
      }
    }

    // Current availability (based on recent activity)
    const now = new Date();
    const hour = now.getHours();
    
    // Business hours (9-17) are generally better
    if (hour >= 9 && hour <= 17) {
      signals.currentAvailability = 0.8;
    } else if (hour >= 18 && hour <= 21) {
      signals.currentAvailability = 0.6;
    } else {
      signals.currentAvailability = 0.3;
    }

    return signals;
  }

  calculateEngagementScore(signals) {
    return (
      signals.responseRate * 0.3 +
      (1 - signals.averageResponseTime / (7 * 24 * 60 * 60 * 1000)) * 0.25 + // Normalize to 7 days
      signals.positiveResponseRatio * 0.25 +
      signals.recentEngagement * 0.15 +
      (1 - signals.outreachFrequency) * 0.05 // Lower frequency tolerance = higher score
    );
  }

  calculateProfileScore(signals) {
    return (
      signals.profileCompleteness * 0.3 +
      signals.professionalNetwork * 0.25 +
      signals.industryKeywords * 0.2 +
      signals.opennessIndicators * 0.15 +
      signals.contactPreference * 0.1
    );
  }

  calculateActivityScore(signals) {
    return (
      signals.linkedinActivity * 0.3 +
      signals.githubActivity * 0.2 +
      signals.portfolioActivity * 0.2 +
      signals.contentEngagement * 0.2 +
      signals.networkGrowth * 0.1
    );
  }

  calculateCareerScore(signals) {
    return (
      (1 - signals.jobStability) * 0.3 + // Less stable = more responsive
      signals.careerProgression * 0.2 +
      signals.industryRelevance * 0.25 +
      signals.seniorityLevel * 0.15 +
      signals.transitionReadiness * 0.1
    );
  }

  calculateTimingScore(signals) {
    return (
      signals.bestDayOfWeek * 0.2 +
      signals.bestTimeOfDay * 0.2 +
      signals.seasonalPreference * 0.1 +
      signals.responsePattern * 0.3 +
      signals.currentAvailability * 0.2
    );
  }

  calculateResponseProbability(scores) {
    return (
      scores.engagementScore * this.weights.engagementHistory +
      scores.profileScore * this.weights.profileSignals +
      scores.activityScore * this.weights.activitySignals +
      scores.careerScore * this.weights.careerSignals +
      scores.timingScore * this.weights.timingSignals
    );
  }

  determineResponseLikelihood(probability) {
    if (probability >= this.responseThresholds.highResponse) return 'high';
    if (probability >= this.responseThresholds.mediumResponse) return 'medium';
    return 'low';
  }

  calculateConfidence(scores, engagementHistory) {
    // Higher confidence with more engagement history
    let baseConfidence = 0;
    
    if (engagementHistory.responseRate > 0) {
      baseConfidence = 0.8; // High confidence with historical data
    } else if (scores.profileScore > 0.7) {
      baseConfidence = 0.6; // Medium confidence with strong profile
    } else {
      baseConfidence = 0.4; // Low confidence with limited data
    }

    // Adjust based on score consistency
    const scoreVariance = this.calculateVariance([
      scores.engagementScore,
      scores.profileScore,
      scores.activityScore,
      scores.careerScore,
      scores.timingScore
    ]);
    
    const consistencyBonus = Math.max(0, 1 - scoreVariance);
    
    return Math.min(baseConfidence + consistencyBonus * 0.2, 1);
  }

  calculateResponsivenessScore(scores) {
    return Math.round((scores.engagementScore * 0.4 + 
                       scores.profileScore * 0.3 + 
                       scores.activityScore * 0.2 + 
                       scores.timingScore * 0.1) * 100) / 100;
  }

  predictBestOutreachChannel(profileSignals, activitySignals) {
    if (profileSignals.professionalNetwork > 0.7 && activitySignals.linkedinActivity > 0.5) {
      return 'linkedin';
    } else if (activitySignals.githubActivity > 0.7) {
      return 'email';
    } else if (profileSignals.contactPreference > 0.5) {
      return 'email';
    }
    
    return 'linkedin'; // Default
  }

  predictOptimalOutreachTime(activitySignals, timingSignals) {
    const activityScore = activitySignals.linkedinActivity + activitySignals.githubActivity;
    
    if (timingSignals.bestTimeOfDay > 0.7) {
      return 'custom_timing';
    } else if (activityScore > 1.0) {
      return 'weekday_evening';
    } else {
      return 'weekday_morning';
    }
  }

  predictResponseTime(engagementHistory, responseProbability) {
    if (engagementHistory.averageResponseTime > 0) {
      return engagementHistory.averageResponseTime;
    }
    
    // Predict based on probability
    if (responseProbability > 0.8) {
      return 24 * 60 * 60 * 1000; // 1 day
    } else if (responseProbability > 0.5) {
      return 3 * 24 * 60 * 60 * 1000; // 3 days
    } else {
      return 7 * 24 * 60 * 60 * 1000; // 1 week
    }
  }

  recommendFollowUpStrategy(responseProbability, engagementHistory) {
    if (responseProbability > 0.8) {
      return 'gentle_follow_up'; // High probability, gentle follow-up
    } else if (responseProbability > 0.5) {
      return 'value_add_follow_up'; // Medium probability, add value
    } else {
      return 'no_follow_up'; // Low probability, don't follow up
    }
  }

  recommendPersonalization(profileSignals, careerSignals) {
    if (careerSignals.industryRelevance > 0.8) {
      return 'industry_specific';
    } else if (profileSignals.opennessIndicators > 0.7) {
      return 'opportunity_focused';
    } else if (careerSignals.seniorityLevel > 0.7) {
      return 'seniority_appropriate';
    }
    
    return 'general'; // Default
  }

  calculateOutreachFrequency(interactions) {
    const outreachInteractions = interactions.filter(interaction => 
      interaction.type === 'recruiter_outreach'
    );
    
    if (outreachInteractions.length < 2) return 0;
    
    const sortedInteractions = outreachInteractions.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    const intervals = [];
    for (let i = 1; i < sortedInteractions.length; i++) {
      const interval = new Date(sortedInteractions[i].timestamp) - new Date(sortedInteractions[i-1].timestamp);
      intervals.push(interval);
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return (90 * 24 * 60 * 60 * 1000) / avgInterval; // Frequency per 90 days
  }

  isPromotion(previousTitle, currentTitle) {
    const seniorityLevels = ['junior', 'mid', 'senior', 'lead', 'principal', 'staff', 'director', 'vp'];
    
    const prevLevel = seniorityLevels.findIndex(level => previousTitle.toLowerCase().includes(level));
    const currLevel = seniorityLevels.findIndex(level => currentTitle.toLowerCase().includes(level));
    
    return currLevel > prevLevel;
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
    
    return Math.sqrt(avgSquaredDiff);
  }

  assessDataQuality(candidate) {
    let qualityScore = 0;
    let totalChecks = 0;

    // Check interaction history
    if (candidate.interactionHistory && candidate.interactionHistory.length > 0) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check profile completeness
    const requiredFields = ['name', 'email', 'experience', 'skills'];
    const completedFields = requiredFields.filter(field => candidate[field]).length;
    qualityScore += completedFields / requiredFields.length;
    totalChecks++;

    // Check activity data
    if (candidate.linkedinData || candidate.githubData) {
      qualityScore += 1;
      totalChecks++;
    }

    return totalChecks > 0 ? qualityScore / totalChecks : 0;
  }

  async batchPredictRecruiterResponse(candidateIds, outreachContext = {}) {
    const predictions = [];
    
    for (const candidateId of candidateIds) {
      try {
        const prediction = await this.predictRecruiterResponse(candidateId, outreachContext);
        predictions.push(prediction);
      } catch (error) {
        console.error(`Error predicting for candidate ${candidateId}:`, error);
        predictions.push({
          candidateId,
          error: error.message,
          responseProbability: 0,
          confidence: 0
        });
      }
    }
    
    return predictions;
  }

  async updateTalentSignal(candidateId, prediction) {
    try {
      await TalentSignal.findOneAndUpdate(
        { candidateId },
        {
          candidateId,
          recruiterResponseScore: prediction.responseProbability,
          predictionMetadata: {
            recruiterResponse: {
              score: prediction.responseProbability,
              confidence: prediction.confidence,
              likelihood: prediction.responseLikelihood,
              predictions: prediction.predictions,
              signals: prediction.signals,
              metadata: prediction.metadata
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
}

export const recruiterResponsePredictionService = new RecruiterResponsePredictionService();
export default recruiterResponsePredictionService;
