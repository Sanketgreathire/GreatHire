import { SourcingCandidate } from "../../../../models/sourcing/SourcingCandidate.model.js";
import { CandidateFreshness } from "../../../models/candidateFreshness.model.js";
import { TalentSignal } from "../../../models/talentSignal.model.js";

export class OpenToWorkPredictionService {
  constructor() {
    this.weights = {
      activitySignals: 0.3,
      careerSignals: 0.25,
      profileSignals: 0.2,
      engagementSignals: 0.15,
      freshnessSignals: 0.1
    };
    
    this.thresholds = {
      highOpenness: 0.75,
      mediumOpenness: 0.5,
      lowOpenness: 0.25
    };
  }

  async predictOpenToWork(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const freshness = await CandidateFreshness.findOne({ candidateId });
      const existingSignal = await TalentSignal.findOne({ candidateId });

      // Analyze different signal categories
      const activitySignals = await this.analyzeActivitySignals(candidate);
      const careerSignals = await this.analyzeCareerSignals(candidate);
      const profileSignals = await this.analyzeProfileSignals(candidate);
      const engagementSignals = await this.analyzeEngagementSignals(candidate);
      const freshnessSignals = await this.analyzeFreshnessSignals(freshness);

      // Calculate weighted scores
      const scores = {
        activityScore: this.calculateActivityScore(activitySignals),
        careerScore: this.calculateCareerScore(careerSignals),
        profileScore: this.calculateProfileScore(profileSignals),
        engagementScore: this.calculateEngagementScore(engagementSignals),
        freshnessScore: this.calculateFreshnessScore(freshnessSignals)
      };

      // Calculate overall open to work score
      const openToWorkScore = this.calculateOpenToWorkScore(scores);
      
      // Determine openness level
      const opennessLevel = this.determineOpennessLevel(openToWorkScore);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(scores, activitySignals, careerSignals);

      // Generate predictions
      const predictions = {
        likelyJobSeeker: openToWorkScore > this.thresholds.highOpenness,
        passiveCandidateOpenness: openToWorkScore > this.thresholds.mediumOpenness && openToWorkScore <= this.thresholds.highOpenness,
        recruiterEngagementProbability: this.calculateEngagementProbability(openToWorkScore, confidence),
        candidateAvailabilityScore: this.calculateAvailabilityScore(openToWorkScore, freshnessSignals),
        bestContactTime: this.predictBestContactTime(activitySignals),
        preferredCommunication: this.predictPreferredCommunication(profileSignals),
        jobSearchIntensity: this.predictJobSearchIntensity(activitySignals, careerSignals)
      };

      return {
        candidateId,
        openToWorkScore: Math.round(openToWorkScore * 100) / 100,
        opennessLevel,
        confidence: Math.round(confidence * 100) / 100,
        scores,
        signals: {
          activity: activitySignals,
          career: careerSignals,
          profile: profileSignals,
          engagement: engagementSignals,
          freshness: freshnessSignals
        },
        predictions,
        metadata: {
          modelVersion: '1.0',
          timestamp: new Date(),
          dataQuality: this.assessDataQuality(candidate, freshness)
        }
      };

    } catch (error) {
      console.error('Error predicting open to work:', error);
      throw error;
    }
  }

  async analyzeActivitySignals(candidate) {
    const signals = {
      githubActivity: 0,
      portfolioUpdates: 0,
      resumeChanges: 0,
      profileModifications: 0,
      recruiterInteractions: 0
    };

    // GitHub activity analysis
    if (candidate.githubData) {
      const githubData = candidate.githubData;
      const recentCommits = githubData.recentCommits || [];
      const repoActivity = githubData.repositoryActivity || [];
      
      // Recent commit frequency (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentCommitCount = recentCommits.filter(commit => 
        new Date(commit.date) > thirtyDaysAgo
      ).length;
      
      signals.githubActivity = Math.min(recentCommitCount / 10, 1); // Normalize to 0-1

      // Repository activity
      const activeRepos = repoActivity.filter(repo => 
        repo.lastUpdated && new Date(repo.lastUpdated) > thirtyDaysAgo
      ).length;
      
      signals.githubActivity = Math.max(signals.githubActivity, activeRepos / 5);
    }

    // Portfolio updates
    if (candidate.portfolioData) {
      const portfolioData = candidate.portfolioData;
      const recentProjects = portfolioData.projects || [];
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentProjectUpdates = recentProjects.filter(project => 
        project.lastUpdated && new Date(project.lastUpdated) > thirtyDaysAgo
      ).length;
      
      signals.portfolioUpdates = Math.min(recentProjectUpdates / 3, 1);
    }

    // Resume changes
    if (candidate.resumeData) {
      const resumeData = candidate.resumeData;
      if (resumeData.lastUpdated) {
        const daysSinceUpdate = (Date.now() - new Date(resumeData.lastUpdated).getTime()) / (24 * 60 * 60 * 1000);
        signals.resumeChanges = Math.max(0, 1 - daysSinceUpdate / 90); // Decay over 90 days
      }
    }

    // Profile modifications
    if (candidate.lastProfileUpdate) {
      const daysSinceUpdate = (Date.now() - new Date(candidate.lastProfileUpdate).getTime()) / (24 * 60 * 60 * 1000);
      signals.profileModifications = Math.max(0, 1 - daysSinceUpdate / 30); // Recent updates are stronger signals
    }

    // Recruiter interactions
    if (candidate.interactionHistory) {
      const recentInteractions = candidate.interactionHistory.filter(interaction => 
        interaction.type === 'recruiter_contact' && 
        new Date(interaction.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      
      const positiveResponses = recentInteractions.filter(interaction => 
        interaction.response === 'positive' || interaction.response === 'interested'
      ).length;
      
      signals.recruiterInteractions = Math.min(positiveResponses / 5, 1);
    }

    return signals;
  }

  async analyzeCareerSignals(candidate) {
    const signals = {
      jobStability: 0,
      careerProgression: 0,
      recentPromotion: 0,
      companyChanges: 0,
      skillUpdates: 0
    };

    // Job stability analysis
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const currentJob = experiences.find(exp => exp.isCurrentJob);
      
      if (currentJob) {
        const jobDuration = (Date.now() - new Date(currentJob.startDate).getTime()) / (24 * 60 * 60 * 1000);
        signals.jobStability = Math.min(jobDuration / 365, 1); // Normalize to years
        
        // Recent jobs under 1 year indicate potential job seeking
        if (jobDuration < 365) {
          signals.jobStability = 0.2; // Low stability = higher openness
        }
      }
    }

    // Career progression
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      let progressionScore = 0;
      
      for (let i = 1; i < experiences.length; i++) {
        const current = experiences[i];
        const previous = experiences[i - 1];
        
        // Title progression
        if (this.isPromotion(previous.title, current.title)) {
          progressionScore += 0.3;
        }
        
        // Responsibility increase
        if (current.responsibilities && previous.responsibilities) {
          if (current.responsibilities.length > previous.responsibilities.length) {
            progressionScore += 0.2;
          }
        }
      }
      
      signals.careerProgression = Math.min(progressionScore, 1);
    }

    // Recent promotion
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const currentJob = experiences.find(exp => exp.isCurrentJob);
      
      if (currentJob && currentJob.promotionDate) {
        const monthsSincePromotion = (Date.now() - new Date(currentJob.promotionDate).getTime()) / (30 * 24 * 60 * 60 * 1000);
        signals.recentPromotion = monthsSincePromotion < 6 ? 0.8 : 0.2; // Recent promotion might indicate stability
      }
    }

    // Company changes
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);
      const recentJobs = experiences.filter(exp => new Date(exp.startDate) > twoYearsAgo);
      
      signals.companyChanges = Math.min(recentJobs.length / 3, 1); // Multiple recent jobs indicate seeking
    }

    // Skill updates
    if (candidate.skills) {
      const skills = candidate.skills || [];
      const recentSkills = skills.filter(skill => 
        skill.lastUpdated && new Date(skill.lastUpdated) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      );
      
      signals.skillUpdates = Math.min(recentSkills.length / 5, 1);
    }

    return signals;
  }

  async analyzeProfileSignals(candidate) {
    const signals = {
      profileCompleteness: 0,
      summaryKeywords: 0,
      locationFlexibility: 0,
      salaryExpectation: 0,
      jobPreferences: 0
    };

    // Profile completeness
    const requiredFields = ['name', 'email', 'experience', 'skills', 'location'];
    const completedFields = requiredFields.filter(field => candidate[field]);
    signals.profileCompleteness = completedFields.length / requiredFields.length;

    // Summary keywords analysis
    if (candidate.summary) {
      const seekingKeywords = ['seeking', 'looking', 'opportunity', 'new role', 'challenge', 'growth', 'open'];
      const summary = candidate.summary.toLowerCase();
      
      const keywordCount = seekingKeywords.filter(keyword => summary.includes(keyword)).length;
      signals.summaryKeywords = Math.min(keywordCount / seekingKeywords.length, 1);
    }

    // Location flexibility
    if (candidate.location) {
      const flexibleIndicators = ['remote', 'willing to relocate', 'open to location', 'flexible'];
      const locationText = candidate.location.toLowerCase();
      
      const flexibilityCount = flexibleIndicators.filter(indicator => locationText.includes(indicator)).length;
      signals.locationFlexibility = Math.min(flexibilityCount / flexibleIndicators.length, 1);
    }

    // Salary expectation
    if (candidate.salaryExpectation || candidate.salaryRange) {
      signals.salaryExpectation = 0.8; // Having salary expectations indicates openness
    }

    // Job preferences
    if (candidate.jobPreferences || candidate.lookingFor) {
      signals.jobPreferences = 0.9; // Explicit job preferences are strong signals
    }

    return signals;
  }

  async analyzeEngagementSignals(candidate) {
    const signals = {
      linkedinActivity: 0,
      networkGrowth: 0,
      contentSharing: 0,
      groupParticipation: 0,
      profileViews: 0
    };

    // LinkedIn activity (if available)
    if (candidate.linkedinData) {
      const linkedinData = candidate.linkedinData;
      
      // Recent posts
      if (linkedinData.recentPosts) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentPosts = linkedinData.recentPosts.filter(post => 
          new Date(post.date) > thirtyDaysAgo
        ).length;
        
        signals.linkedinActivity = Math.min(recentPosts / 5, 1);
      }

      // Network growth
      if (linkedinData.connections) {
        const connectionGrowth = linkedinData.connections.monthlyGrowth || 0;
        signals.networkGrowth = Math.min(connectionGrowth / 50, 1); // 50 new connections per month
      }

      // Content sharing
      if (linkedinData.sharedContent) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentShares = linkedinData.sharedContent.filter(content => 
          new Date(content.date) > thirtyDaysAgo
        ).length;
        
        signals.contentSharing = Math.min(recentShares / 10, 1);
      }
    }

    return signals;
  }

  async analyzeFreshnessSignals(freshness) {
    const signals = {
      activityScore: 0,
      freshnessScore: 0,
      lastActivityDays: 0,
      engagementTrend: 0
    };

    if (freshness) {
      signals.activityScore = freshness.activityScore || 0;
      signals.freshnessScore = freshness.freshnessScore || 0;
      
      if (freshness.lastActivityAt) {
        const daysSinceActivity = (Date.now() - new Date(freshness.lastActivityAt).getTime()) / (24 * 60 * 60 * 1000);
        signals.lastActivityDays = daysSinceActivity;
        
        // Recent activity is a strong signal
        signals.engagementTrend = daysSinceActivity < 30 ? 0.8 : daysSinceActivity < 90 ? 0.5 : 0.2;
      }
    }

    return signals;
  }

  calculateActivityScore(signals) {
    return (
      signals.githubActivity * 0.3 +
      signals.portfolioUpdates * 0.25 +
      signals.resumeChanges * 0.2 +
      signals.profileModifications * 0.15 +
      signals.recruiterInteractions * 0.1
    );
  }

  calculateCareerScore(signals) {
    return (
      (1 - signals.jobStability) * 0.3 + // Lower stability = higher openness
      signals.careerProgression * 0.2 +
      (1 - signals.recentPromotion) * 0.2 + // No recent promotion = higher openness
      signals.companyChanges * 0.2 +
      signals.skillUpdates * 0.1
    );
  }

  calculateProfileScore(signals) {
    return (
      signals.profileCompleteness * 0.2 +
      signals.summaryKeywords * 0.3 +
      signals.locationFlexibility * 0.2 +
      signals.salaryExpectation * 0.15 +
      signals.jobPreferences * 0.15
    );
  }

  calculateEngagementScore(signals) {
    return (
      signals.linkedinActivity * 0.3 +
      signals.networkGrowth * 0.25 +
      signals.contentSharing * 0.25 +
      signals.groupParticipation * 0.1 +
      signals.profileViews * 0.1
    );
  }

  calculateFreshnessScore(signals) {
    return (
      signals.activityScore * 0.4 +
      signals.freshnessScore * 0.3 +
      (1 - signals.lastActivityDays / 365) * 0.2 + // Normalize days to years
      signals.engagementTrend * 0.1
    );
  }

  calculateOpenToWorkScore(scores) {
    return (
      scores.activityScore * this.weights.activitySignals +
      scores.careerScore * this.weights.careerSignals +
      scores.profileScore * this.weights.profileSignals +
      scores.engagementScore * this.weights.engagementSignals +
      scores.freshnessScore * this.weights.freshnessSignals
    );
  }

  determineOpennessLevel(score) {
    if (score >= this.thresholds.highOpenness) return 'high';
    if (score >= this.thresholds.mediumOpenness) return 'medium';
    return 'low';
  }

  calculateConfidence(scores, activitySignals, careerSignals) {
    // Higher confidence with more data points
    let dataPoints = 0;
    
    if (activitySignals.githubActivity > 0) dataPoints++;
    if (activitySignals.portfolioUpdates > 0) dataPoints++;
    if (careerSignals.jobStability > 0) dataPoints++;
    if (careerSignals.careerProgression > 0) dataPoints++;
    
    const baseConfidence = dataPoints / 5; // Normalize to 0-1
    
    // Adjust based on score consistency
    const scoreVariance = this.calculateVariance([
      scores.activityScore,
      scores.careerScore,
      scores.profileScore,
      scores.engagementScore,
      scores.freshnessScore
    ]);
    
    const consistencyBonus = Math.max(0, 1 - scoreVariance);
    
    return Math.min(baseConfidence + consistencyBonus * 0.2, 1);
  }

  calculateEngagementProbability(openToWorkScore, confidence) {
    // Higher openness and confidence = higher engagement probability
    return Math.min(openToWorkScore * confidence * 1.2, 1);
  }

  calculateAvailabilityScore(openToWorkScore, freshnessSignals) {
    const baseScore = openToWorkScore;
    
    // Adjust based on recent activity
    if (freshnessSignals.lastActivityDays < 30) {
      return Math.min(baseScore * 1.1, 1);
    } else if (freshnessSignals.lastActivityDays > 90) {
      return baseScore * 0.8;
    }
    
    return baseScore;
  }

  predictBestContactTime(activitySignals) {
    // Analyze activity patterns to predict best contact time
    if (activitySignals.githubActivity > 0.5) {
      return 'weekday_evening'; // Developers often active in evenings
    } else if (activitySignals.linkedinActivity > 0.5) {
      return 'weekday_morning'; // LinkedIn users often active in mornings
    }
    
    return 'weekday_afternoon'; // Default
  }

  predictPreferredCommunication(profileSignals) {
    if (profileSignals.linkedinActivity > 0.7) {
      return 'linkedin';
    } else if (profileSignals.githubActivity > 0.7) {
      return 'email';
    }
    
    return 'email'; // Default
  }

  predictJobSearchIntensity(activitySignals, careerSignals) {
    const intensity = (activitySignals.githubActivity + activitySignals.portfolioUpdates + 
                      careerSignals.companyChanges + careerSignals.skillUpdates) / 4;
    
    if (intensity > 0.7) return 'high';
    if (intensity > 0.4) return 'medium';
    return 'low';
  }

  assessDataQuality(candidate, freshness) {
    let qualityScore = 0;
    let totalChecks = 0;

    // Check data completeness
    const requiredFields = ['name', 'email', 'experience', 'skills'];
    const completedFields = requiredFields.filter(field => candidate[field]).length;
    qualityScore += completedFields / requiredFields.length;
    totalChecks++;

    // Check data recency
    if (candidate.lastProfileUpdate) {
      const daysSinceUpdate = (Date.now() - new Date(candidate.lastProfileUpdate).getTime()) / (24 * 60 * 60 * 1000);
      qualityScore += daysSinceUpdate < 90 ? 1 : 0.5;
      totalChecks++;
    }

    // Check freshness data
    if (freshness) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check activity data
    if (candidate.githubData || candidate.portfolioData || candidate.linkedinData) {
      qualityScore += 1;
      totalChecks++;
    }

    return totalChecks > 0 ? qualityScore / totalChecks : 0;
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

  async batchPredictOpenToWork(candidateIds) {
    const predictions = [];
    
    for (const candidateId of candidateIds) {
      try {
        const prediction = await this.predictOpenToWork(candidateId);
        predictions.push(prediction);
      } catch (error) {
        console.error(`Error predicting for candidate ${candidateId}:`, error);
        predictions.push({
          candidateId,
          error: error.message,
          openToWorkScore: 0,
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
          openToWorkScore: prediction.openToWorkScore,
          recruiterResponseScore: prediction.predictions.recruiterEngagementProbability,
          predictionMetadata: {
            openToWork: {
              score: prediction.openToWorkScore,
              confidence: prediction.confidence,
              level: prediction.opennessLevel,
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

export const openToWorkPredictionService = new OpenToWorkPredictionService();
export default openToWorkPredictionService;
