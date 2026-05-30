import { SourcingCandidate } from "../../../../models/sourcing/SourcingCandidate.model.js";
import { GitHubCandidateMetadata } from "../../../models/githubCandidateMetadata.model.js";
import { PortfolioCandidateMetadata } from "../../../models/portfolioCandidateMetadata.model.js";
import { ResumeCandidateMetadata } from "../../../models/resumeCandidateMetadata.model.js";

export class OpenToWorkPredictionService {
  constructor() {
    this.predictionFactors = {
      github: {
        jobSeekingIndicators: [
          'looking for work',
          'open to opportunities',
          'available for hire',
          'seeking new challenges',
          'interested in opportunities'
        ],
        activityPatterns: {
          highActivity: 0.8,
          moderateActivity: 0.5,
          lowActivity: 0.2
        },
        profileCompleteness: {
          hasEmail: 0.3,
          hasLocation: 0.2,
          hasBio: 0.2,
          hasPortfolio: 0.3
        }
      },
      portfolio: {
        jobSeekingIndicators: [
          'available for freelance',
          'open to collaboration',
          'seeking full-time',
          'looking for opportunities',
          'interested in projects'
        ],
        updatePatterns: {
          recentUpdates: 0.7,
          moderateUpdates: 0.4,
          staleUpdates: 0.1
        },
        contactVisibility: {
          emailVisible: 0.4,
          phoneVisible: 0.3,
          socialLinks: 0.3
        }
      },
      resume: {
        jobSeekingIndicators: [
          'actively seeking',
          'immediate availability',
          'open to relocation',
          'seeking new role',
          'available immediately'
        ],
        freshnessPatterns: {
          veryRecent: 0.8,
          recent: 0.6,
          moderate: 0.3,
          stale: 0.1
        },
        contentSignals: {
          objectiveStatement: 0.3,
          availabilityInfo: 0.4,
          flexibilityIndicators: 0.3
        }
      }
    };
  }

  async predictOpenToWork(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const predictionData = {
        candidateId,
        github: null,
        portfolio: null,
        resume: null,
        overallScore: 0,
        confidence: 0,
        signals: []
      };

      // Analyze GitHub signals
      if (candidate.githubUrl) {
        predictionData.github = await this.analyzeGitHubSignals(candidateId, candidate.githubUrl);
      }

      // Analyze portfolio signals
      if (candidate.portfolioUrl) {
        predictionData.portfolio = await this.analyzePortfolioSignals(candidateId, candidate.portfolioUrl);
      }

      // Analyze resume signals
      if (candidate.resumeUrl) {
        predictionData.resume = await this.analyzeResumeSignals(candidateId, candidate.resumeUrl);
      }

      // Calculate overall prediction
      const overallPrediction = this.calculateOverallPrediction(predictionData);
      predictionData.overallScore = overallPrediction.score;
      predictionData.confidence = overallPrediction.confidence;
      predictionData.signals = overallPrediction.signals;

      return predictionData;
    } catch (error) {
      console.error('Error predicting open to work:', error);
      throw error;
    }
  }

  async analyzeGitHubSignals(candidateId, githubUrl) {
    try {
      const githubMetadata = await GitHubCandidateMetadata.findOne({ candidateId });
      if (!githubMetadata) {
        return {
          score: 0,
          signals: [],
          confidence: 0
        };
      }

      const signals = [];
      let score = 0;

      // Analyze bio for job seeking indicators
      if (githubMetadata.rawProfile?.bio) {
        const bioSignals = this.detectJobSeekingIndicators(
          githubMetadata.rawProfile.bio,
          this.predictionFactors.github.jobSeekingIndicators
        );
        
        if (bioSignals.length > 0) {
          signals.push(...bioSignals);
          score += bioSignals.length * 15;
        }
      }

      // Analyze activity patterns
      const activityScore = this.calculateGitHubActivityScore(githubMetadata);
      score += activityScore * 20;

      if (activityScore > 0.6) {
        signals.push({
          type: 'high_github_activity',
          message: 'High GitHub activity suggests active job seeking',
          score: activityScore * 20
        });
      }

      // Analyze profile completeness
      const completenessScore = this.calculateGitHubCompleteness(githubMetadata);
      score += completenessScore * 15;

      if (completenessScore > 0.7) {
        signals.push({
          type: 'complete_github_profile',
          message: 'Complete GitHub profile suggests job readiness',
          score: completenessScore * 15
        });
      }

      // Analyze repository activity patterns
      const repoSignals = this.analyzeRepositoryActivity(githubMetadata);
      signals.push(...repoSignals);
      score += repoSignals.reduce((sum, signal) => sum + signal.score, 0);

      return {
        score: Math.min(100, score),
        signals,
        confidence: this.calculateConfidence(signals.length, 3)
      };
    } catch (error) {
      console.error('Error analyzing GitHub signals:', error);
      return {
        score: 0,
        signals: [],
        confidence: 0
      };
    }
  }

  async analyzePortfolioSignals(candidateId, portfolioUrl) {
    try {
      const portfolioMetadata = await PortfolioCandidateMetadata.findOne({ candidateId });
      if (!portfolioMetadata) {
        return {
          score: 0,
          signals: [],
          confidence: 0
        };
      }

      const signals = [];
      let score = 0;

      // Analyze portfolio content for job seeking indicators
      if (portfolioMetadata.rawProfile) {
        const contentSignals = this.detectJobSeekingIndicators(
          JSON.stringify(portfolioMetadata.rawProfile),
          this.predictionFactors.portfolio.jobSeekingIndicators
        );
        
        if (contentSignals.length > 0) {
          signals.push(...contentSignals);
          score += contentSignals.length * 20;
        }
      }

      // Analyze update patterns
      const updateScore = this.calculatePortfolioUpdateScore(portfolioMetadata);
      score += updateScore * 25;

      if (updateScore > 0.6) {
        signals.push({
          type: 'recent_portfolio_updates',
          message: 'Recent portfolio updates suggest active job seeking',
          score: updateScore * 25
        });
      }

      // Analyze contact visibility
      const contactScore = this.calculatePortfolioContactVisibility(portfolioMetadata);
      score += contactScore * 20;

      if (contactScore > 0.7) {
        signals.push({
          type: 'high_contact_visibility',
          message: 'High contact visibility suggests openness to opportunities',
          score: contactScore * 20
        });
      }

      // Analyze project activity
      const projectSignals = this.analyzePortfolioProjectActivity(portfolioMetadata);
      signals.push(...projectSignals);
      score += projectSignals.reduce((sum, signal) => sum + signal.score, 0);

      return {
        score: Math.min(100, score),
        signals,
        confidence: this.calculateConfidence(signals.length, 3)
      };
    } catch (error) {
      console.error('Error analyzing portfolio signals:', error);
      return {
        score: 0,
        signals: [],
        confidence: 0
      };
    }
  }

  async analyzeResumeSignals(candidateId, resumeUrl) {
    try {
      const resumeMetadata = await ResumeCandidateMetadata.findOne({ candidateId });
      if (!resumeMetadata) {
        return {
          score: 0,
          signals: [],
          confidence: 0
        };
      }

      const signals = [];
      let score = 0;

      // Analyze resume content for job seeking indicators
      if (resumeMetadata.rawProfile) {
        const contentSignals = this.detectJobSeekingIndicators(
          JSON.stringify(resumeMetadata.rawProfile),
          this.predictionFactors.resume.jobSeekingIndicators
        );
        
        if (contentSignals.length > 0) {
          signals.push(...contentSignals);
          score += contentSignals.length * 25;
        }
      }

      // Analyze resume freshness
      const freshnessScore = this.calculateResumeFreshness(resumeMetadata);
      score += freshnessScore * 30;

      if (freshnessScore > 0.7) {
        signals.push({
          type: 'fresh_resume',
          message: 'Recent resume updates suggest active job seeking',
          score: freshnessScore * 30
        });
      }

      // Analyze content signals
      const contentSignals = this.analyzeResumeContent(resumeMetadata);
      signals.push(...contentSignals);
      score += contentSignals.reduce((sum, signal) => sum + signal.score, 0);

      return {
        score: Math.min(100, score),
        signals,
        confidence: this.calculateConfidence(signals.length, 3)
      };
    } catch (error) {
      console.error('Error analyzing resume signals:', error);
      return {
        score: 0,
        signals: [],
        confidence: 0
      };
    }
  }

  detectJobSeekingIndicators(text, indicators) {
    const signals = [];
    const textLower = text.toLowerCase();

    indicators.forEach(indicator => {
      if (textLower.includes(indicator.toLowerCase())) {
        signals.push({
          type: 'job_seeking_indicator',
          message: `Found job seeking indicator: "${indicator}"`,
          score: 20
        });
      }
    });

    return signals;
  }

  calculateGitHubActivityScore(githubMetadata) {
    let score = 0;
    const factors = this.predictionFactors.github.activityPatterns;

    // Analyze recent activity
    if (githubMetadata.rawProfile?.lastActivity) {
      const daysSinceActivity = this.getDaysSinceDate(githubMetadata.rawProfile.lastActivity);
      
      if (daysSinceActivity <= 7) {
        score += factors.highActivity;
      } else if (daysSinceActivity <= 30) {
        score += factors.moderateActivity;
      } else if (daysSinceActivity <= 90) {
        score += factors.lowActivity;
      }
    }

    // Analyze repository activity
    if (githubMetadata.rawProfile?.repositories) {
      const activeRepos = githubMetadata.rawProfile.repositories.filter(repo => 
        this.getDaysSinceDate(repo.updated_at) <= 30
      );
      
      if (activeRepos.length >= 3) {
        score += factors.highActivity * 0.5;
      } else if (activeRepos.length >= 1) {
        score += factors.moderateActivity * 0.5;
      }
    }

    return Math.min(1, score);
  }

  calculateGitHubCompleteness(githubMetadata) {
    let score = 0;
    const factors = this.predictionFactors.github.profileCompleteness;

    if (githubMetadata.rawProfile?.email) score += factors.hasEmail;
    if (githubMetadata.rawProfile?.location) score += factors.hasLocation;
    if (githubMetadata.rawProfile?.bio) score += factors.hasBio;
    if (githubMetadata.rawProfile?.repositories?.length > 0) score += factors.hasPortfolio;

    return Math.min(1, score);
  }

  analyzeRepositoryActivity(githubMetadata) {
    const signals = [];

    if (githubMetadata.rawProfile?.repositories) {
      const repos = githubMetadata.rawProfile.repositories;
      
      // Look for recent fork activity (suggesting exploration)
      const recentForks = repos.filter(repo => 
        repo.fork && this.getDaysSinceDate(repo.created_at) <= 30
      );
      
      if (recentForks.length >= 2) {
        signals.push({
          type: 'recent_fork_activity',
          message: 'Recent fork activity suggests technology exploration',
          score: 15
        });
      }

      // Look for new repository creation
      const recentRepos = repos.filter(repo => 
        this.getDaysSinceDate(repo.created_at) <= 30
      );
      
      if (recentRepos.length >= 1) {
        signals.push({
          type: 'new_repository_creation',
          message: 'New repository creation suggests active development',
          score: 20
        });
      }
    }

    return signals;
  }

  calculatePortfolioUpdateScore(portfolioMetadata) {
    let score = 0;
    const factors = this.predictionFactors.portfolio.updatePatterns;

    if (portfolioMetadata.ingestionMetadata?.processingTime) {
      const daysSinceUpdate = this.getDaysSinceDate(portfolioMetadata.ingestionMetadata.processingTime);
      
      if (daysSinceUpdate <= 7) {
        score += factors.recentUpdates;
      } else if (daysSinceUpdate <= 30) {
        score += factors.moderateUpdates;
      } else if (daysSinceUpdate <= 90) {
        score += factors.staleUpdates;
      }
    }

    return Math.min(1, score);
  }

  calculatePortfolioContactVisibility(portfolioMetadata) {
    let score = 0;
    const factors = this.predictionFactors.portfolio.contactVisibility;

    if (portfolioMetadata.rawProfile?.contact?.email) score += factors.emailVisible;
    if (portfolioMetadata.rawProfile?.contact?.phone) score += factors.phoneVisible;
    if (portfolioMetadata.rawProfile?.socialLinks && 
        Object.keys(portfolioMetadata.rawProfile.socialLinks).length > 0) {
      score += factors.socialLinks;
    }

    return Math.min(1, score);
  }

  analyzePortfolioProjectActivity(portfolioMetadata) {
    const signals = [];

    if (portfolioMetadata.rawProfile?.projects) {
      const projects = portfolioMetadata.rawProfile.projects;
      
      // Look for recent project updates
      const recentProjects = projects.filter(project => 
        project.createdAt && this.getDaysSinceDate(project.createdAt) <= 30
      );
      
      if (recentProjects.length >= 1) {
        signals.push({
          type: 'recent_project_activity',
          message: 'Recent project updates suggest active development',
          score: 15
        });
      }

      // Look for "available for work" indicators in projects
      projects.forEach(project => {
        if (project.description) {
          const availabilitySignals = this.detectJobSeekingIndicators(
            project.description,
            ['freelance', 'available', 'hire me', 'for hire']
          );
          
          if (availabilitySignals.length > 0) {
            signals.push({
              type: 'project_availability_indicator',
              message: 'Project contains availability indicators',
              score: 20
            });
          }
        }
      });
    }

    return signals;
  }

  calculateResumeFreshness(resumeMetadata) {
    let score = 0;
    const factors = this.predictionFactors.resume.freshnessPatterns;

    if (resumeMetadata.ingestionMetadata?.processingTime) {
      const daysSinceUpdate = this.getDaysSinceDate(resumeMetadata.ingestionMetadata.processingTime);
      
      if (daysSinceUpdate <= 7) {
        score += factors.veryRecent;
      } else if (daysSinceUpdate <= 30) {
        score += factors.recent;
      } else if (daysSinceUpdate <= 90) {
        score += factors.moderate;
      } else {
        score += factors.stale;
      }
    }

    return Math.min(1, score);
  }

  analyzeResumeContent(resumeMetadata) {
    const signals = [];
    const factors = this.predictionFactors.resume.contentSignals;

    if (resumeMetadata.rawProfile) {
      const profile = resumeMetadata.rawProfile;
      
      // Look for objective statement
      if (profile.summary) {
        const objectiveSignals = this.detectJobSeekingIndicators(
          profile.summary,
          ['objective', 'seeking', 'looking for', 'goal']
        );
        
        if (objectiveSignals.length > 0) {
          signals.push({
            type: 'objective_statement',
            message: 'Resume contains objective statement',
            score: factors.objectiveStatement * 100
          });
        }
      }

      // Look for availability information
      const contentText = JSON.stringify(profile);
      const availabilitySignals = this.detectJobSeekingIndicators(
        contentText,
        ['available', 'immediately', 'start asap', 'flexible']
      );
      
      if (availabilitySignals.length > 0) {
        signals.push({
          type: 'availability_info',
          message: 'Resume contains availability information',
          score: factors.availabilityInfo * 100
        });
      }

      // Look for flexibility indicators
      const flexibilitySignals = this.detectJobSeekingIndicators(
        contentText,
        ['relocation', 'remote', 'flexible', 'negotiable']
      );
      
      if (flexibilitySignals.length > 0) {
        signals.push({
          type: 'flexibility_indicators',
          message: 'Resume shows flexibility indicators',
          score: factors.flexibilityIndicators * 100
        });
      }
    }

    return signals;
  }

  calculateOverallPrediction(predictionData) {
    const signals = [];
    let totalScore = 0;
    let weightSum = 0;

    // Combine GitHub signals
    if (predictionData.github) {
      signals.push(...predictionData.github.signals);
      totalScore += predictionData.github.score * 0.3;
      weightSum += 0.3;
    }

    // Combine portfolio signals
    if (predictionData.portfolio) {
      signals.push(...predictionData.portfolio.signals);
      totalScore += predictionData.portfolio.score * 0.4;
      weightSum += 0.4;
    }

    // Combine resume signals
    if (predictionData.resume) {
      signals.push(...predictionData.resume.signals);
      totalScore += predictionData.resume.score * 0.3;
      weightSum += 0.3;
    }

    const overallScore = weightSum > 0 ? totalScore / weightSum : 0;
    const confidence = this.calculateConfidence(signals.length, 3);

    return {
      score: Math.min(100, overallScore),
      confidence,
      signals
    };
  }

  calculateConfidence(signalCount, maxSignals) {
    // Higher confidence when more signals are detected
    return Math.min(1, signalCount / maxSignals);
  }

  getDaysSinceDate(date) {
    if (!date) return Infinity;
    
    const now = new Date();
    const targetDate = new Date(date);
    const diffTime = now - targetDate;
    
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  async updateCandidateOpenToWork(candidateId, predictionData) {
    try {
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        openToWorkScore: predictionData.overallScore,
        openToWorkConfidence: predictionData.confidence,
        openToWorkSignals: predictionData.signals,
        lastOpenToWorkAnalysis: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error updating candidate open to work:', error);
      throw error;
    }
  }

  async batchPredictOpenToWork(candidateIds) {
    try {
      const results = [];

      for (const candidateId of candidateIds) {
        try {
          const predictionData = await this.predictOpenToWork(candidateId);
          await this.updateCandidateOpenToWork(candidateId, predictionData);
          results.push(predictionData);
        } catch (error) {
          console.error(`Error predicting open to work for candidate ${candidateId}:`, error);
          results.push({
            candidateId,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in batch open to work prediction:', error);
      throw error;
    }
  }

  async getOpenToWorkTrends(timeRange = '30d') {
    try {
      const candidates = await SourcingCandidate.find({
        openToWorkScore: { $exists: true },
        lastOpenToWorkAnalysis: { $exists: true }
      });

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

      const recentCandidates = candidates.filter(candidate => 
        candidate.lastOpenToWorkAnalysis && new Date(candidate.lastOpenToWorkAnalysis) >= startDate
      );

      const trends = {
        totalCandidates: recentCandidates.length,
        averageOpenToWorkScore: recentCandidates.reduce((sum, c) => sum + (c.openToWorkScore || 0), 0) / recentCandidates.length,
        highOpenToWorkCandidates: recentCandidates.filter(c => (c.openToWorkScore || 0) >= 70).length,
        moderateOpenToWorkCandidates: recentCandidates.filter(c => (c.openToWorkScore || 0) >= 40 && (c.openToWorkScore || 0) < 70).length,
        lowOpenToWorkCandidates: recentCandidates.filter(c => (c.openToWorkScore || 0) < 40).length,
        topOpenToWorkCandidates: recentCandidates
          .sort((a, b) => (b.openToWorkScore || 0) - (a.openToWorkScore || 0))
          .slice(0, 10)
          .map(c => ({
            candidateId: c._id,
            name: c.name,
            openToWorkScore: c.openToWorkScore,
            confidence: c.openToWorkConfidence,
            lastAnalysis: c.lastOpenToWorkAnalysis
          }))
      };

      return trends;
    } catch (error) {
      console.error('Error getting open to work trends:', error);
      throw error;
    }
  }

  async getCandidatesByOpenToWork(minScore = 50, maxScore = 100, limit = 50) {
    try {
      const candidates = await SourcingCandidate.find({
        openToWorkScore: { $gte: minScore, $lte: maxScore }
      })
      .sort({ openToWorkScore: -1 })
      .limit(limit)
      .select('name email openToWorkScore openToWorkConfidence lastOpenToWorkAnalysis');

      return candidates;
    } catch (error) {
      console.error('Error getting candidates by open to work:', error);
      throw error;
    }
  }
}

export const openToWorkPredictionService = new OpenToWorkPredictionService();
export default openToWorkPredictionService;
