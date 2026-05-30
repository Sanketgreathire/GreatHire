import { SourcingCandidate } from "../../../../models/sourcing/SourcingCandidate.model.js";
import { TalentSignal } from "../../../models/talentSignal.model.js";

export class CareerTransitionPredictionService {
  constructor() {
    this.weights = {
      careerSignals: 0.35,
      activitySignals: 0.25,
      marketSignals: 0.2,
      skillSignals: 0.15,
      timingSignals: 0.05
    };
    
    this.transitionThresholds = {
      highTransition: 0.75,
      mediumTransition: 0.5,
      lowTransition: 0.25
    };
  }

  async predictCareerTransition(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const existingSignal = await TalentSignal.findOne({ candidateId });

      // Analyze different signal categories
      const careerSignals = await this.analyzeCareerSignals(candidate);
      const activitySignals = await this.analyzeActivitySignals(candidate);
      const marketSignals = await this.analyzeMarketSignals(candidate);
      const skillSignals = await this.analyzeSkillSignals(candidate);
      const timingSignals = await this.analyzeTimingSignals(candidate);

      // Calculate weighted scores
      const scores = {
        careerScore: this.calculateCareerScore(careerSignals),
        activityScore: this.calculateActivityScore(activitySignals),
        marketScore: this.calculateMarketScore(marketSignals),
        skillScore: this.calculateSkillScore(skillSignals),
        timingScore: this.calculateTimingScore(timingSignals)
      };

      // Calculate overall transition probability
      const transitionProbability = this.calculateTransitionProbability(scores);
      
      // Determine transition likelihood
      const transitionLikelihood = this.determineTransitionLikelihood(transitionProbability);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(scores, careerSignals);

      // Generate predictions
      const predictions = {
        likelyJobSwitchTiming: this.predictJobSwitchTiming(transitionProbability, timingSignals),
        careerGrowthAcceleration: this.predictCareerGrowthAcceleration(careerSignals, skillSignals),
        promotionProbability: this.predictPromotionProbability(careerSignals, marketSignals),
        industryTransitionPatterns: this.predictIndustryTransitionPatterns(careerSignals, skillSignals),
        roleTransitionReadiness: this.predictRoleTransitionReadiness(careerSignals, activitySignals),
        compensationExpectation: this.predictCompensationExpectation(careerSignals, marketSignals),
        locationFlexibility: this.predictLocationFlexibility(careerSignals, activitySignals)
      };

      return {
        candidateId,
        transitionProbability: Math.round(transitionProbability * 100) / 100,
        transitionLikelihood,
        confidence: Math.round(confidence * 100) / 100,
        scores,
        signals: {
          career: careerSignals,
          activity: activitySignals,
          market: marketSignals,
          skill: skillSignals,
          timing: timingSignals
        },
        predictions,
        metadata: {
          modelVersion: '1.0',
          timestamp: new Date(),
          dataQuality: this.assessDataQuality(candidate)
        }
      };

    } catch (error) {
      console.error('Error predicting career transition:', error);
      throw error;
    }
  }

  async analyzeCareerSignals(candidate) {
    const signals = {
      jobStability: 0,
      careerProgression: 0,
      companySize: 0,
      industryChanges: 0,
      roleComplexity: 0,
      leadershipExperience: 0
    };

    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const currentJob = experiences.find(exp => exp.isCurrentJob);
      
      // Job stability
      if (currentJob) {
        const jobDuration = (Date.now() - new Date(currentJob.startDate).getTime()) / (24 * 60 * 60 * 1000);
        signals.jobStability = Math.min(jobDuration / 365, 1); // Years at current job
        
        // Low stability (under 2 years) indicates higher transition likelihood
        if (jobDuration < 730) {
          signals.jobStability = 0.2; // Low stability = high transition signal
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
        
        // Company size progression
        if (current.companySize && previous.companySize) {
          if (current.companySize > previous.companySize) {
            progressionScore += 0.2;
          }
        }
      }
      signals.careerProgression = Math.min(progressionScore, 1);

      // Company size (smaller companies often lead to more transitions)
      if (currentJob && currentJob.companySize) {
        const sizeCategories = {
          'startup': 0.9,
          'small': 0.7,
          'medium': 0.5,
          'large': 0.3,
          'enterprise': 0.2
        };
        
        const companySize = (currentJob.companySize || '').toLowerCase();
        signals.companySize = 0.5; // Default
        
        for (const [category, score] of Object.entries(sizeCategories)) {
          if (companySize.includes(category)) {
            signals.companySize = score;
            break;
          }
        }
      }

      // Industry changes
      const industries = experiences.map(exp => exp.industry).filter(Boolean);
      const uniqueIndustries = [...new Set(industries)];
      signals.industryChanges = Math.min(uniqueIndustries.length / 3, 1);

      // Role complexity
      if (currentJob) {
        const complexityKeywords = ['senior', 'lead', 'principal', 'architect', 'manager', 'director'];
        const title = (currentJob.title || '').toLowerCase();
        const complexityCount = complexityKeywords.filter(keyword => title.includes(keyword)).length;
        signals.roleComplexity = Math.min(complexityCount / complexityKeywords.length, 1);
      }

      // Leadership experience
      const leadershipRoles = experiences.filter(exp => {
        const title = (exp.title || '').toLowerCase();
        return title.includes('lead') || title.includes('manager') || title.includes('director');
      });
      signals.leadershipExperience = Math.min(leadershipRoles.length / 3, 1);
    }

    return signals;
  }

  async analyzeActivitySignals(candidate) {
    const signals = {
      learningActivity: 0,
      networkingActivity: 0,
      jobSearchActivity: 0,
      skillDevelopment: 0,
      personalBranding: 0
    };

    // Learning activity
    if (candidate.githubData) {
      const githubData = candidate.githubData;
      
      if (githubData.recentCommits) {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const recentCommits = githubData.recentCommits.filter(commit => 
          new Date(commit.date) > ninetyDaysAgo
        ).length;
        signals.learningActivity = Math.min(recentCommits / 50, 1);
      }

      // New technology adoption
      if (githubData.technologies) {
        const recentTech = githubData.technologies.filter(tech => 
          tech.firstUsed && new Date(tech.firstUsed) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
        );
        signals.skillDevelopment = Math.min(recentTech.length / 5, 1);
      }
    }

    // Networking activity
    if (candidate.linkedinData) {
      const linkedinData = candidate.linkedinData;
      
      if (linkedinData.connections && linkedinData.connections.monthlyGrowth) {
        signals.networkingActivity = Math.min(linkedinData.connections.monthlyGrowth / 100, 1);
      }

      if (linkedinData.recentPosts) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentPosts = linkedinData.recentPosts.filter(post => 
          new Date(post.date) > thirtyDaysAgo
        ).length;
        signals.personalBranding = Math.min(recentPosts / 10, 1);
      }
    }

    // Job search activity indicators
    if (candidate.resumeData && candidate.resumeData.lastUpdated) {
      const daysSinceUpdate = (Date.now() - new Date(candidate.resumeData.lastUpdated).getTime()) / (24 * 60 * 60 * 1000);
      signals.jobSearchActivity = Math.max(0, 1 - daysSinceUpdate / 60); // Recent resume updates
    }

    return signals;
  }

  async analyzeMarketSignals(candidate) {
    const signals = {
      industryDemand: 0,
      skillDemand: 0,
      locationDemand: 0,
      compensationAlignment: 0,
      marketTrend: 0
    };

    // Industry demand (based on current role)
    if (candidate.experience) {
      const currentJob = candidate.experience.find(exp => exp.isCurrentJob);
      if (currentJob) {
        const highDemandIndustries = ['technology', 'software', 'data', 'ai', 'cloud', 'cybersecurity'];
        const jobText = `${currentJob.title} ${currentJob.company} ${currentJob.description || ''}`.toLowerCase();
        
        const demandScore = highDemandIndustries.some(industry => jobText.includes(industry)) ? 1 : 0.6;
        signals.industryDemand = demandScore;
      }
    }

    // Skill demand
    if (candidate.skills) {
      const highDemandSkills = ['react', 'node', 'python', 'aws', 'docker', 'kubernetes', 'machine learning'];
      const candidateSkills = candidate.skills.map(skill => skill.name).map(name => name.toLowerCase());
      
      const matchingSkills = highDemandSkills.filter(skill => 
        candidateSkills.some(candidateSkill => candidateSkill.includes(skill))
      );
      signals.skillDemand = Math.min(matchingSkills.length / highDemandSkills.length, 1);
    }

    // Location demand
    if (candidate.location) {
      const highDemandLocations = ['san francisco', 'new york', 'seattle', 'austin', 'boston', 'remote'];
      const location = candidate.location.toLowerCase();
      
      signals.locationDemand = highDemandLocations.some(loc => location.includes(loc)) ? 1 : 0.5;
    }

    // Market trend (based on recent market activity)
    signals.marketTrend = 0.7; // Placeholder - would integrate with real market data

    return signals;
  }

  async analyzeSkillSignals(candidate) {
    const signals = {
      skillRelevance: 0,
      skillGrowth: 0,
      certificationActivity: 0,
      technologyAdoption: 0,
      skillDiversity: 0
    };

    if (candidate.skills) {
      const skills = candidate.skills || [];
      
      // Skill relevance
      const relevantSkills = skills.filter(skill => skill.relevance > 0.7);
      signals.skillRelevance = Math.min(relevantSkills.length / 10, 1);

      // Skill growth (new skills acquired)
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const recentSkills = skills.filter(skill => 
        skill.acquiredDate && new Date(skill.acquiredDate) > ninetyDaysAgo
      );
      signals.skillGrowth = Math.min(recentSkills.length / 3, 1);

      // Technology adoption
      const modernTech = ['react', 'vue', 'angular', 'node', 'python', 'go', 'rust', 'kubernetes'];
      const candidateTech = skills.map(skill => skill.name).map(name => name.toLowerCase());
      
      const adoptedTech = modernTech.filter(tech => 
        candidateTech.some(candidateSkill => candidateSkill.includes(tech))
      );
      signals.technologyAdoption = Math.min(adoptedTech.length / modernTech.length, 1);

      // Skill diversity
      const skillCategories = ['frontend', 'backend', 'database', 'cloud', 'devops', 'mobile'];
      const candidateCategories = skills.map(skill => skill.category).filter(Boolean);
      const uniqueCategories = [...new Set(candidateCategories)];
      signals.skillDiversity = Math.min(uniqueCategories.length / skillCategories.length, 1);
    }

    return signals;
  }

  async analyzeTimingSignals(candidate) {
    const signals = {
      seasonalTiming: 0,
      economicTiming: 0,
      personalTiming: 0,
      careerTiming: 0,
      marketTiming: 0
    };

    // Seasonal timing (job search seasons)
    const currentMonth = new Date().getMonth();
    const peakSeasons = [1, 2, 9, 10]; // Feb, Mar, Oct, Nov are peak job search months
    signals.seasonalTiming = peakSeasons.includes(currentMonth) ? 0.8 : 0.4;

    // Personal timing (based on career stage)
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const totalExperience = experiences.reduce((sum, exp) => {
        if (exp.startDate && exp.endDate) {
          return sum + (new Date(exp.endDate) - new Date(exp.startDate)) / (365 * 24 * 60 * 60 * 1000);
        }
        return sum;
      }, 0);

      // 3-5 years and 8-10 years are common transition points
      if ((totalExperience >= 3 && totalExperience <= 5) || (totalExperience >= 8 && totalExperience <= 10)) {
        signals.personalTiming = 0.8;
      } else if (totalExperience >= 2 && totalExperience <= 12) {
        signals.personalTiming = 0.6;
      } else {
        signals.personalTiming = 0.3;
      }

      signals.careerTiming = signals.personalTiming;
    }

    // Market timing
    signals.marketTiming = 0.6; // Placeholder - would integrate with real market conditions

    return signals;
  }

  calculateCareerScore(signals) {
    return (
      (1 - signals.jobStability) * 0.25 + // Less stable = higher transition
      signals.careerProgression * 0.2 +
      (1 - signals.companySize) * 0.2 + // Smaller companies = more transitions
      signals.industryChanges * 0.15 +
      signals.roleComplexity * 0.1 +
      signals.leadershipExperience * 0.1
    );
  }

  calculateActivityScore(signals) {
    return (
      signals.learningActivity * 0.25 +
      signals.networkingActivity * 0.25 +
      signals.jobSearchActivity * 0.2 +
      signals.skillDevelopment * 0.2 +
      signals.personalBranding * 0.1
    );
  }

  calculateMarketScore(signals) {
    return (
      signals.industryDemand * 0.3 +
      signals.skillDemand * 0.3 +
      signals.locationDemand * 0.2 +
      signals.compensationAlignment * 0.1 +
      signals.marketTrend * 0.1
    );
  }

  calculateSkillScore(signals) {
    return (
      signals.skillRelevance * 0.3 +
      signals.skillGrowth * 0.25 +
      signals.certificationActivity * 0.2 +
      signals.technologyAdoption * 0.15 +
      signals.skillDiversity * 0.1
    );
  }

  calculateTimingScore(signals) {
    return (
      signals.seasonalTiming * 0.3 +
      signals.economicTiming * 0.2 +
      signals.personalTiming * 0.25 +
      signals.careerTiming * 0.15 +
      signals.marketTiming * 0.1
    );
  }

  calculateTransitionProbability(scores) {
    return (
      scores.careerScore * this.weights.careerSignals +
      scores.activityScore * this.weights.activitySignals +
      scores.marketScore * this.weights.marketSignals +
      scores.skillScore * this.weights.skillSignals +
      scores.timingScore * this.weights.timingSignals
    );
  }

  determineTransitionLikelihood(probability) {
    if (probability >= this.transitionThresholds.highTransition) return 'high';
    if (probability >= this.transitionThresholds.mediumTransition) return 'medium';
    return 'low';
  }

  calculateConfidence(scores, careerSignals) {
    // Higher confidence with more career data
    let baseConfidence = 0.5;
    
    if (careerSignals.jobStability > 0) {
      baseConfidence = 0.7;
    }
    
    if (careerSignals.careerProgression > 0) {
      baseConfidence += 0.1;
    }

    // Adjust based on score consistency
    const scoreVariance = this.calculateVariance([
      scores.careerScore,
      scores.activityScore,
      scores.marketScore,
      scores.skillScore,
      scores.timingScore
    ]);
    
    const consistencyBonus = Math.max(0, 1 - scoreVariance);
    
    return Math.min(baseConfidence + consistencyBonus * 0.2, 1);
  }

  predictJobSwitchTiming(transitionProbability, timingSignals) {
    if (transitionProbability > 0.8) {
      return 'immediate'; // Within 1 month
    } else if (transitionProbability > 0.6) {
      return 'short_term'; // 1-3 months
    } else if (transitionProbability > 0.4) {
      return 'medium_term'; // 3-6 months
    } else {
      return 'long_term'; // 6+ months
    }
  }

  predictCareerGrowthAcceleration(careerSignals, skillSignals) {
    const growthScore = (careerSignals.careerProgression + skillSignals.skillGrowth) / 2;
    
    if (growthScore > 0.7) return 'high_acceleration';
    if (growthScore > 0.4) return 'moderate_acceleration';
    return 'steady_growth';
  }

  predictPromotionProbability(careerSignals, marketSignals) {
    const promotionScore = (careerSignals.careerProgression + careerSignals.roleComplexity + marketSignals.industryDemand) / 3;
    
    if (promotionScore > 0.7) return 'high';
    if (promotionScore > 0.4) return 'medium';
    return 'low';
  }

  predictIndustryTransitionPatterns(careerSignals, skillSignals) {
    if (careerSignals.industryChanges > 0.5) {
      return 'frequent_changer';
    } else if (skillSignals.technologyAdoption > 0.7) {
      return 'tech_evolver';
    } else {
      return 'industry_specialist';
    }
  }

  predictRoleTransitionReadiness(careerSignals, activitySignals) {
    const readinessScore = (careerSignals.leadershipExperience + activitySignals.skillDevelopment) / 2;
    
    if (readinessScore > 0.7) return 'ready_for_senior';
    if (readinessScore > 0.4) return 'ready_for_lead';
    return 'individual_contributor';
  }

  predictCompensationExpectation(careerSignals, marketSignals) {
    const expectationScore = (careerSignals.roleComplexity + marketSignals.skillDemand) / 2;
    
    if (expectationScore > 0.7) return 'high_expectation';
    if (expectationScore > 0.4) return 'market_rate';
    return 'flexible';
  }

  predictLocationFlexibility(careerSignals, activitySignals) {
    const flexibilityScore = (careerSignals.industryChanges + activitySignals.networkingActivity) / 2;
    
    if (flexibilityScore > 0.7) return 'highly_flexible';
    if (flexibilityScore > 0.4) return 'moderately_flexible';
    return 'location_specific';
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
    if (candidate.githubData || candidate.linkedinData) {
      qualityScore += 1;
      totalChecks++;
    }

    return totalChecks > 0 ? qualityScore / totalChecks : 0;
  }

  async batchPredictCareerTransition(candidateIds) {
    const predictions = [];
    
    for (const candidateId of candidateIds) {
      try {
        const prediction = await this.predictCareerTransition(candidateId);
        predictions.push(prediction);
      } catch (error) {
        console.error(`Error predicting for candidate ${candidateId}:`, error);
        predictions.push({
          candidateId,
          error: error.message,
          transitionProbability: 0,
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
          predictionMetadata: {
            careerTransition: {
              probability: prediction.transitionProbability,
              confidence: prediction.confidence,
              likelihood: prediction.transitionLikelihood,
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

export const careerTransitionPredictionService = new CareerTransitionPredictionService();
export default careerTransitionPredictionService;
