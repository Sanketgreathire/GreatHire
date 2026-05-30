import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { GitHubCandidateMetadata } from "../../../models/githubCandidateMetadata.model.js";
import { PortfolioCandidateMetadata } from "../../../models/portfolioCandidateMetadata.model.js";

export class JobMovementDetectionService {
  constructor() {
    this.movementSignals = {
      promotion: {
        titleChange: ['junior', 'mid', 'senior', 'lead', 'principal', 'manager', 'director'],
        companyChange: true,
        timeInRole: 12 // months
      },
      companyChange: {
        differentCompany: true,
        timeAtCompany: 24 // months
      },
      startupTransition: {
        companySize: ['startup', 'small', '1-10', '11-50'],
        roleChange: true
      },
      experienceGrowth: {
        experienceIncrease: 2, // years
        skillGrowth: 5 // new skills
      }
    };
  }

  async detectJobMovements(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const movementData = {
        candidateId,
        currentRole: candidate.title,
        currentCompany: candidate.experience?.[0]?.company,
        movements: [],
        signals: [],
        lastAnalysis: new Date()
      };

      // Analyze GitHub movements
      const githubMovements = await this.analyzeGitHubMovements(candidateId);
      if (githubMovements.length > 0) {
        movementData.movements.push(...githubMovements);
      }

      // Analyze portfolio movements
      const portfolioMovements = await this.analyzePortfolioMovements(candidateId);
      if (portfolioMovements.length > 0) {
        movementData.movements.push(...portfolioMovements);
      }

      // Analyze experience timeline
      const experienceMovements = this.analyzeExperienceTimeline(candidate.experience);
      if (experienceMovements.length > 0) {
        movementData.movements.push(...experienceMovements);
      }

      // Generate movement signals
      movementData.signals = this.generateMovementSignals(movementData.movements);

      return movementData;
    } catch (error) {
      console.error('Error detecting job movements:', error);
      throw error;
    }
  }

  async analyzeGitHubMovements(candidateId) {
    try {
      const githubMetadata = await GitHubCandidateMetadata.findOne({ candidateId });
      if (!githubMetadata) {
        return [];
      }

      const movements = [];

      // Analyze repository activity for company changes
      if (githubMetadata.rawProfile?.repositories) {
        const repoMovements = this.detectRepositoryMovements(githubMetadata.rawProfile.repositories);
        movements.push(...repoMovements);
      }

      // Analyze contribution patterns
      if (githubMetadata.rawProfile?.contributions) {
        const contributionMovements = this.detectContributionMovements(githubMetadata.rawProfile.contributions);
        movements.push(...contributionMovements);
      }

      return movements;
    } catch (error) {
      console.error('Error analyzing GitHub movements:', error);
      return [];
    }
  }

  async analyzePortfolioMovements(candidateId) {
    try {
      const portfolioMetadata = await PortfolioCandidateMetadata.findOne({ candidateId });
      if (!portfolioMetadata) {
        return [];
      }

      const movements = [];

      // Analyze project updates
      if (portfolioMetadata.rawProfile?.projects) {
        const projectMovements = this.detectProjectMovements(portfolioMetadata.rawProfile.projects);
        movements.push(...projectMovements);
      }

      // Analyze technology changes
      if (portfolioMetadata.rawProfile?.detectedTechnologies) {
        const techMovements = this.detectTechnologyMovements(portfolioMetadata.rawProfile.detectedTechnologies);
        movements.push(...techMovements);
      }

      return movements;
    } catch (error) {
      console.error('Error analyzing portfolio movements:', error);
      return [];
    }
  }

  analyzeExperienceTimeline(experience) {
    if (!experience || !Array.isArray(experience)) {
      return [];
    }

    const movements = [];

    for (let i = 0; i < experience.length; i++) {
      const currentExp = experience[i];
      const previousExp = i > 0 ? experience[i - 1] : null;

      // Detect promotions
      if (previousExp && this.detectPromotion(previousExp, currentExp)) {
        movements.push({
          type: 'promotion',
          fromRole: previousExp.title,
          toRole: currentExp.title,
          company: currentExp.company,
          date: currentExp.startDate,
          confidence: 0.8,
          evidence: `Title progression from ${previousExp.title} to ${currentExp.title}`
        });
      }

      // Detect company changes
      if (previousExp && this.detectCompanyChange(previousExp, currentExp)) {
        movements.push({
          type: 'company_change',
          fromCompany: previousExp.company,
          toCompany: currentExp.company,
          fromRole: previousExp.title,
          toRole: currentExp.title,
          date: currentExp.startDate,
          confidence: 0.9,
          evidence: `Changed company from ${previousExp.company} to ${currentExp.company}`
        });
      }

      // Detect startup transitions
      if (this.detectStartupTransition(currentExp)) {
        movements.push({
          type: 'startup_transition',
          company: currentExp.company,
          role: currentExp.title,
          date: currentExp.startDate,
          confidence: 0.7,
          evidence: `Joined startup: ${currentExp.company}`
        });
      }
    }

    return movements;
  }

  detectRepositoryMovements(repositories) {
    const movements = [];

    // Group repositories by company/organization
    const repoGroups = this.groupRepositoriesByCompany(repositories);

    Object.entries(repoGroups).forEach(([company, repos]) => {
      if (repos.length > 1) {
        // Check for activity patterns suggesting job changes
        const sortedRepos = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        for (let i = 1; i < sortedRepos.length; i++) {
          const currentRepo = sortedRepos[i];
          const previousRepo = sortedRepos[i - 1];
          
          const timeDiff = new Date(currentRepo.updated_at) - new Date(previousRepo.updated_at);
          const monthsDiff = timeDiff / (1000 * 60 * 60 * 24 * 30);
          
          if (monthsDiff > 6) { // Significant gap suggesting job change
            movements.push({
              type: 'github_activity_change',
              company,
              evidence: `New repository activity after ${monthsDiff.toFixed(1)} months gap`,
              date: currentRepo.updated_at,
              confidence: 0.6
            });
          }
        }
      }
    });

    return movements;
  }

  detectContributionMovements(contributions) {
    const movements = [];

    // Analyze contribution patterns for role changes
    const contributionPatterns = this.analyzeContributionPatterns(contributions);
    
    if (contributionPatterns.roleChange) {
      movements.push({
        type: 'github_role_change',
        evidence: 'Change in contribution patterns suggesting new role',
        confidence: 0.5,
        date: contributionPatterns.changeDate
      });
    }

    return movements;
  }

  detectProjectMovements(projects) {
    const movements = [];

    // Look for new projects suggesting career changes
    const sortedProjects = projects.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    
    for (let i = 1; i < sortedProjects.length; i++) {
      const currentProject = sortedProjects[i];
      const previousProject = sortedProjects[i - 1];
      
      const timeDiff = new Date(currentProject.createdAt || 0) - new Date(previousProject.createdAt || 0);
      const monthsDiff = timeDiff / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsDiff > 3 && this.isSignificantProject(currentProject)) {
        movements.push({
          type: 'portfolio_project_addition',
          project: currentProject.name,
          evidence: `New significant project after ${monthsDiff.toFixed(1)} months`,
          date: currentProject.createdAt,
          confidence: 0.6
        });
      }
    }

    return movements;
  }

  detectTechnologyMovements(technologies) {
    const movements = [];

    // Look for new technology acquisitions
    if (technologies.all && technologies.all.length > 0) {
      const recentTechs = technologies.all.slice(-5); // Last 5 technologies
      
      if (recentTechs.length >= 3) {
        movements.push({
          type: 'technology_acquisition',
          technologies: recentTechs,
          evidence: `Recently acquired ${recentTechs.length} new technologies`,
          confidence: 0.7
        });
      }
    }

    return movements;
  }

  detectPromotion(previousExp, currentExp) {
    const prevTitle = (previousExp.title || '').toLowerCase();
    const currTitle = (currentExp.title || '').toLowerCase();
    
    // Check for title progression
    const promotionLevels = this.movementSignals.promotion.titleChange;
    
    for (let i = 0; i < promotionLevels.length - 1; i++) {
      const currentLevel = promotionLevels[i];
      const nextLevel = promotionLevels[i + 1];
      
      if (prevTitle.includes(currentLevel) && currTitle.includes(nextLevel)) {
        return true;
      }
    }

    return false;
  }

  detectCompanyChange(previousExp, currentExp) {
    return previousExp.company && currentExp.company && 
           previousExp.company.toLowerCase() !== currentExp.company.toLowerCase();
  }

  detectStartupTransition(experience) {
    const startupKeywords = ['startup', 'inc', 'llc', 'ltd', 'private limited'];
    const smallCompanyKeywords = ['1-10', '11-50', 'small business'];
    
    const companyLower = (experience.company || '').toLowerCase();
    
    return startupKeywords.some(keyword => companyLower.includes(keyword)) ||
           smallCompanyKeywords.some(keyword => companyLower.includes(keyword));
  }

  groupRepositoriesByCompany(repositories) {
    const groups = {};
    
    repositories.forEach(repo => {
      const company = repo.organization?.login || 'Independent';
      if (!groups[company]) {
        groups[company] = [];
      }
      groups[company].push(repo);
    });
    
    return groups;
  }

  analyzeContributionPatterns(contributions) {
    const patterns = {
      roleChange: false,
      changeDate: null
    };

    // This would analyze contribution patterns for role changes
    // For now, return placeholder
    return patterns;
  }

  isSignificantProject(project) {
    // Consider a project significant if it has:
    // - Multiple technologies
    // - Detailed description
    // - Live URL
    // - Recent activity
    
    let significanceScore = 0;
    
    if (project.technologies && project.technologies.length > 2) significanceScore += 2;
    if (project.description && project.description.length > 100) significanceScore += 2;
    if (project.url) significanceScore += 1;
    if (project.images && project.images.length > 0) significanceScore += 1;
    
    return significanceScore >= 4;
  }

  generateMovementSignals(movements) {
    const signals = [];

    // Analyze movement types
    const movementTypes = movements.reduce((types, movement) => {
      types[movement.type] = (types[movement.type] || 0) + 1;
      return types;
    }, {});

    // Generate signals based on movement patterns
    if (movementTypes.promotion >= 1) {
      signals.push({
        type: 'career_growth',
        message: 'Recent promotion detected',
        score: 20,
        confidence: 0.8
      });
    }

    if (movementTypes.company_change >= 2 && movementTypes.company_change <= 3) {
      signals.push({
        type: 'job_hopper',
        message: 'Frequent job changes detected',
        score: -10,
        confidence: 0.7
      });
    } else if (movementTypes.company_change === 1) {
      signals.push({
        type: 'career_progression',
        message: 'Recent career move detected',
        score: 15,
        confidence: 0.8
      });
    }

    if (movementTypes.startup_transition >= 1) {
      signals.push({
        type: 'startup_experience',
        message: 'Startup experience detected',
        score: 10,
        confidence: 0.7
      });
    }

    // Analyze recency of movements
    const recentMovements = movements.filter(m => {
      const movementDate = new Date(movement.date);
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      return movementDate > sixMonthsAgo;
    });

    if (recentMovements.length >= 2) {
      signals.push({
        type: 'highly_active',
        message: 'Multiple recent career movements',
        score: 15,
        confidence: 0.8
      });
    }

    return signals;
  }

  async updateCandidateMovements(candidateId, movementData) {
    try {
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        jobMovements: movementData.movements,
        movementSignals: movementData.signals,
        lastMovementAnalysis: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error updating candidate movements:', error);
      throw error;
    }
  }

  async batchDetectMovements(candidateIds) {
    try {
      const results = [];

      for (const candidateId of candidateIds) {
        try {
          const movementData = await this.detectJobMovements(candidateId);
          await this.updateCandidateMovements(candidateId, movementData);
          results.push(movementData);
        } catch (error) {
          console.error(`Error detecting movements for candidate ${candidateId}:`, error);
          results.push({
            candidateId,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in batch movement detection:', error);
      throw error;
    }
  }

  async getMovementTrends(timeRange = '90d') {
    try {
      const candidates = await SourcingCandidate.find({
        movementSignals: { $exists: true },
        lastMovementAnalysis: { $exists: true }
      });

      const now = new Date();
      let startDate;

      switch (timeRange) {
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '180d':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }

      const recentMovements = candidates.filter(candidate => {
        const analysisDate = new Date(candidate.lastMovementAnalysis);
        return analysisDate >= startDate;
      });

      const trends = {
        totalCandidates: candidates.length,
        recentMovements: recentMovements.length,
        movementTypes: {},
        averageMovementsPerCandidate: 0,
        topMovementSignals: []
      };

      // Analyze movement types
      recentMovements.forEach(candidate => {
        if (candidate.jobMovements) {
          candidate.jobMovements.forEach(movement => {
            trends.movementTypes[movement.type] = (trends.movementTypes[movement.type] || 0) + 1;
          });
        }
      });

      // Calculate average movements
      const totalMovements = recentMovements.reduce((sum, candidate) => {
        return sum + (candidate.jobMovements ? candidate.jobMovements.length : 0);
      }, 0);

      trends.averageMovementsPerCandidate = recentMovements.length > 0 ? totalMovements / recentMovements.length : 0;

      // Get top movement signals
      const allSignals = recentMovements.flatMap(candidate => candidate.movementSignals || []);
      trends.topMovementSignals = allSignals
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      return trends;
    } catch (error) {
      console.error('Error getting movement trends:', error);
      throw error;
    }
  }

  async getCandidatesWithMovements(movementType, limit = 50) {
    try {
      const candidates = await SourcingCandidate.find({
        'jobMovements.type': movementType
      })
      .sort({ lastMovementAnalysis: -1 })
      .limit(limit)
      .select('name title email jobMovements movementSignals lastMovementAnalysis');

      return candidates;
    } catch (error) {
      console.error('Error getting candidates with movements:', error);
      throw error;
    }
  }
}

export const jobMovementDetectionService = new JobMovementDetectionService();
export default jobMovementDetectionService;
