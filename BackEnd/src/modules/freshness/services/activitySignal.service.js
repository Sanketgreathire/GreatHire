import axios from "axios";
import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";

export class ActivitySignalService {
  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN;
    this.activityThresholds = {
      github: {
        commits: 5, // Minimum commits in 30 days
        repos: 2, // Minimum active repositories
        followers: 10, // Minimum followers threshold
        lastActive: 90 // Days since last activity
      },
      portfolio: {
        lastUpdated: 180, // Days since last portfolio update
        projects: 3, // Minimum number of projects
        technologies: 5 // Minimum number of technologies
      },
      resume: {
        lastUpdated: 365, // Days since last resume update
        experience: 1 // Minimum years of experience
      }
    };
  }

  async analyzeGitHubActivity(candidateId, githubUsername) {
    try {
      if (!githubUsername || !this.githubToken) {
        return {
          activityScore: 0,
          signals: [],
          lastActivity: null,
          error: 'Missing GitHub username or token'
        };
      }

      const githubData = await this.fetchGitHubData(githubUsername);
      const signals = this.generateGitHubSignals(githubData);
      const activityScore = this.calculateGitHubActivityScore(githubData, signals);

      return {
        activityScore,
        signals,
        githubData,
        lastActivity: githubData.lastActivity,
        error: null
      };
    } catch (error) {
      console.error('Error analyzing GitHub activity:', error);
      return {
        activityScore: 0,
        signals: [],
        lastActivity: null,
        error: error.message
      };
    }
  }

  async analyzePortfolioActivity(candidateId, portfolioUrl) {
    try {
      if (!portfolioUrl) {
        return {
          activityScore: 0,
          signals: [],
          lastActivity: null,
          error: 'Missing portfolio URL'
        };
      }

      const portfolioData = await this.fetchPortfolioData(portfolioUrl);
      const signals = this.generatePortfolioSignals(portfolioData);
      const activityScore = this.calculatePortfolioActivityScore(portfolioData, signals);

      return {
        activityScore,
        signals,
        portfolioData,
        lastActivity: portfolioData.lastUpdated,
        error: null
      };
    } catch (error) {
      console.error('Error analyzing portfolio activity:', error);
      return {
        activityScore: 0,
        signals: [],
        lastActivity: null,
        error: error.message
      };
    }
  }

  async analyzeResumeActivity(candidateId, resumeUrl) {
    try {
      if (!resumeUrl) {
        return {
          activityScore: 0,
          signals: [],
          lastActivity: null,
          error: 'Missing resume URL'
        };
      }

      const resumeData = await this.fetchResumeData(resumeUrl);
      const signals = this.generateResumeSignals(resumeData);
      const activityScore = this.calculateResumeActivityScore(resumeData, signals);

      return {
        activityScore,
        signals,
        resumeData,
        lastActivity: resumeData.lastUpdated,
        error: null
      };
    } catch (error) {
      console.error('Error analyzing resume activity:', error);
      return {
        activityScore: 0,
        signals: [],
        lastActivity: null,
        error: error.message
      };
    }
  }

  async fetchGitHubData(username) {
    try {
      const [userResponse, reposResponse, eventsResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}`, {
          headers: { Authorization: `token ${this.githubToken}` }
        }),
        axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
          headers: { Authorization: `token ${this.githubToken}` }
        }),
        axios.get(`https://api.github.com/users/${username}/events?per_page=30`, {
          headers: { Authorization: `token ${this.githubToken}` }
        })
      ]);

      const userData = userResponse.data;
      const reposData = reposResponse.data;
      const eventsData = eventsResponse.data;

      // Calculate last activity from events
      const lastEvent = eventsData.length > 0 ? eventsData[0].created_at : null;

      // Filter active repositories (updated in last 6 months)
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      const activeRepos = reposData.filter(repo => new Date(repo.updated_at) > sixMonthsAgo);

      return {
        username: userData.login,
        name: userData.name,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        followers: userData.followers,
        following: userData.following,
        publicRepos: userData.public_repos,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
        lastActivity: lastEvent,
        repositories: reposData,
        activeRepos: activeRepos.length,
        totalStars: reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: reposData.reduce((sum, repo) => sum + repo.forks_count, 0),
        languages: this.extractLanguages(reposData),
        topics: this.extractTopics(reposData)
      };
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      throw error;
    }
  }

  async fetchPortfolioData(url) {
    try {
      // This would fetch portfolio data - placeholder implementation
      return {
        url,
        lastUpdated: new Date(),
        projects: [],
        technologies: [],
        contact: {},
        description: ''
      };
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      throw error;
    }
  }

  async fetchResumeData(url) {
    try {
      // This would fetch resume data - placeholder implementation
      return {
        url,
        lastUpdated: new Date(),
        experience: [],
        skills: [],
        education: [],
        contact: {}
      };
    } catch (error) {
      console.error('Error fetching resume data:', error);
      throw error;
    }
  }

  generateGitHubSignals(githubData) {
    const signals = [];
    const now = new Date();
    const threshold = this.activityThresholds.github;

    // Activity level signals
    if (githubData.activeRepos >= threshold.repos) {
      signals.push({
        type: 'high_activity',
        message: `Active developer with ${githubData.activeRepos} repositories`,
        score: 20
      });
    }

    // Commit activity signals
    const daysSinceLastActivity = githubData.lastActivity 
      ? Math.floor((now - new Date(githubData.lastActivity)) / (1000 * 60 * 60 * 24))
      : Infinity;

    if (daysSinceLastActivity <= threshold.lastActive) {
      signals.push({
        type: 'recent_commits',
        message: `Recent GitHub activity ${daysSinceLastActivity} days ago`,
        score: 25
      });
    } else if (daysSinceLastActivity > threshold.lastActive * 2) {
      signals.push({
        type: 'inactive',
        message: `No GitHub activity for ${daysSinceLastActivity} days`,
        score: -15
      });
    }

    // Follower signals
    if (githubData.followers >= threshold.followers) {
      signals.push({
        type: 'influential',
        message: `${githubData.followers} GitHub followers`,
        score: 15
      });
    }

    // Repository quality signals
    const hasPopularRepos = githubData.repositories.some(repo => 
      repo.stargazers_count >= 50 || repo.forks_count >= 25
    );

    if (hasPopularRepos) {
      signals.push({
        type: 'quality_projects',
        message: 'Has popular repositories with significant stars/forks',
        score: 20
      });
    }

    // Technology diversity signals
    if (githubData.languages && Object.keys(githubData.languages).length >= 5) {
      signals.push({
        type: 'tech_diversity',
        message: `Works with ${Object.keys(githubData.languages).length} different technologies`,
        score: 15
      });
    }

    // Account age signals
    const accountAge = githubData.createdAt 
      ? Math.floor((now - new Date(githubData.createdAt)) / (1000 * 60 * 60 * 24 * 365))
      : 0;

    if (accountAge >= 3) {
      signals.push({
        type: 'established',
        message: `Established GitHub account for ${accountAge} years`,
        score: 10
      });
    }

    return signals;
  }

  generatePortfolioSignals(portfolioData) {
    const signals = [];
    const threshold = this.activityThresholds.portfolio;

    // Portfolio freshness signals
    const daysSinceUpdate = portfolioData.lastUpdated 
      ? Math.floor((new Date() - new Date(portfolioData.lastUpdated)) / (1000 * 60 * 60 * 24))
      : Infinity;

    if (daysSinceUpdate <= threshold.lastUpdated) {
      signals.push({
        type: 'fresh_portfolio',
        message: `Portfolio updated ${daysSinceUpdate} days ago`,
        score: 25
      });
    } else if (daysSinceUpdate > threshold.lastUpdated * 2) {
      signals.push({
        type: 'stale_portfolio',
        message: `Portfolio not updated for ${daysSinceUpdate} days`,
        score: -20
      });
    }

    // Project quantity signals
    if (portfolioData.projects.length >= threshold.projects) {
      signals.push({
        type: 'project_rich',
        message: `Portfolio contains ${portfolioData.projects.length} projects`,
        score: 20
      });
    }

    // Technology diversity signals
    if (portfolioData.technologies.length >= threshold.technologies) {
      signals.push({
        type: 'tech_diverse',
        message: `Portfolio shows ${portfolioData.technologies.length} different technologies`,
        score: 15
      });
    }

    return signals;
  }

  generateResumeSignals(resumeData) {
    const signals = [];
    const threshold = this.activityThresholds.resume;

    // Resume freshness signals
    const daysSinceUpdate = resumeData.lastUpdated 
      ? Math.floor((new Date() - new Date(resumeData.lastUpdated)) / (1000 * 60 * 60 * 24))
      : Infinity;

    if (daysSinceUpdate <= threshold.lastUpdated) {
      signals.push({
        type: 'fresh_resume',
        message: `Resume updated ${daysSinceUpdate} days ago`,
        score: 20
      });
    } else if (daysSinceUpdate > threshold.lastUpdated * 2) {
      signals.push({
        type: 'stale_resume',
        message: `Resume not updated for ${daysSinceUpdate} days`,
        score: -15
      });
    }

    // Experience signals
    const totalExperience = this.calculateTotalExperience(resumeData.experience);
    if (totalExperience >= threshold.experience) {
      signals.push({
        type: 'experienced',
        message: `${totalExperience} years of experience`,
        score: 15
      });
    }

    // Skills diversity signals
    if (resumeData.skills.length >= 8) {
      signals.push({
        type: 'skill_rich',
        message: `Resume shows ${resumeData.skills.length} different skills`,
        score: 10
      });
    }

    return signals;
  }

  calculateGitHubActivityScore(githubData, signals) {
    let score = 50; // Base score

    signals.forEach(signal => {
      score += signal.score;
    });

    // Normalize to 0-100 scale
    return Math.max(0, Math.min(100, score));
  }

  calculatePortfolioActivityScore(portfolioData, signals) {
    let score = 50; // Base score

    signals.forEach(signal => {
      score += signal.score;
    });

    // Normalize to 0-100 scale
    return Math.max(0, Math.min(100, score));
  }

  calculateResumeActivityScore(resumeData, signals) {
    let score = 50; // Base score

    signals.forEach(signal => {
      score += signal.score;
    });

    // Normalize to 0-100 scale
    return Math.max(0, Math.min(100, score));
  }

  extractLanguages(repositories) {
    const languages = {};
    
    repositories.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return languages;
  }

  extractTopics(repositories) {
    const topics = new Set();
    
    repositories.forEach(repo => {
      if (repo.topics) {
        repo.topics.forEach(topic => topics.add(topic));
      }
    });

    return Array.from(topics);
  }

  calculateTotalExperience(experience) {
    if (!experience || !Array.isArray(experience)) return 0;

    let totalMonths = 0;
    const now = new Date();

    experience.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        totalMonths += Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
      } else if (exp.startDate) {
        const start = new Date(exp.startDate);
        totalMonths += Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()));
      }
    });

    return Math.floor(totalMonths / 12);
  }

  async analyzeCandidateActivity(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const activityData = {
        github: null,
        portfolio: null,
        resume: null
      };

      // Analyze GitHub activity if available
      if (candidate.githubUrl) {
        const githubUsername = this.extractGitHubUsername(candidate.githubUrl);
        if (githubUsername) {
          activityData.github = await this.analyzeGitHubActivity(candidateId, githubUsername);
        }
      }

      // Analyze portfolio activity if available
      if (candidate.portfolioUrl) {
        activityData.portfolio = await this.analyzePortfolioActivity(candidateId, candidate.portfolioUrl);
      }

      // Analyze resume activity if available
      if (candidate.resumeUrl) {
        activityData.resume = await this.analyzeResumeActivity(candidateId, candidate.resumeUrl);
      }

      // Calculate overall activity score
      const overallScore = this.calculateOverallActivityScore(activityData);

      return {
        candidateId,
        activityData,
        overallScore,
        lastActivity: this.getMostRecentActivity(activityData),
        signals: this.combineAllSignals(activityData)
      };
    } catch (error) {
      console.error('Error analyzing candidate activity:', error);
      throw error;
    }
  }

  extractGitHubUsername(githubUrl) {
    if (!githubUrl) return null;
    
    const match = githubUrl.match(/github\.com\/([^\/\?]+)/);
    return match ? match[1] : null;
  }

  calculateOverallActivityScore(activityData) {
    let totalScore = 0;
    let count = 0;

    if (activityData.github && activityData.github.activityScore !== null) {
      totalScore += activityData.github.activityScore;
      count++;
    }

    if (activityData.portfolio && activityData.portfolio.activityScore !== null) {
      totalScore += activityData.portfolio.activityScore;
      count++;
    }

    if (activityData.resume && activityData.resume.activityScore !== null) {
      totalScore += activityData.resume.activityScore;
      count++;
    }

    return count > 0 ? totalScore / count : 0;
  }

  getMostRecentActivity(activityData) {
    const activities = [];

    if (activityData.github?.lastActivity) {
      activities.push(new Date(activityData.github.lastActivity));
    }

    if (activityData.portfolio?.lastActivity) {
      activities.push(new Date(activityData.portfolio.lastActivity));
    }

    if (activityData.resume?.lastActivity) {
      activities.push(new Date(activityData.resume.lastActivity));
    }

    return activities.length > 0 ? new Date(Math.max(...activities)) : null;
  }

  combineAllSignals(activityData) {
    const allSignals = [];

    if (activityData.github?.signals) {
      allSignals.push(...activityData.github.signals);
    }

    if (activityData.portfolio?.signals) {
      allSignals.push(...activityData.portfolio.signals);
    }

    if (activityData.resume?.signals) {
      allSignals.push(...activityData.resume.signals);
    }

    return allSignals;
  }

  async updateCandidateActivity(candidateId, activityData) {
    try {
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        activityScore: activityData.overallScore,
        lastActivityAt: activityData.lastActivity,
        activitySignals: activityData.signals,
        activityMetadata: activityData.activityData
      });

      return true;
    } catch (error) {
      console.error('Error updating candidate activity:', error);
      throw error;
    }
  }

  async batchAnalyzeActivity(candidateIds) {
    try {
      const results = [];

      for (const candidateId of candidateIds) {
        try {
          const activityData = await this.analyzeCandidateActivity(candidateId);
          await this.updateCandidateActivity(candidateId, activityData);
          results.push(activityData);
        } catch (error) {
          console.error(`Error analyzing activity for candidate ${candidateId}:`, error);
          results.push({
            candidateId,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in batch activity analysis:', error);
      throw error;
    }
  }

  async getActivityTrends(timeRange = '30d') {
    try {
      const candidates = await SourcingCandidate.find({
        activityScore: { $exists: true },
        lastActivityAt: { $exists: true }
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

      const filteredCandidates = candidates.filter(candidate => 
        candidate.lastActivityAt && new Date(candidate.lastActivityAt) >= startDate
      );

      const trends = {
        activeCandidates: filteredCandidates.length,
        averageActivityScore: filteredCandidates.reduce((sum, c) => sum + (c.activityScore || 0), 0) / filteredCandidates.length,
        mostActiveCandidates: filteredCandidates
          .sort((a, b) => (b.activityScore || 0) - (a.activityScore || 0))
          .slice(0, 10)
          .map(c => ({
            candidateId: c._id,
            name: c.name,
            activityScore: c.activityScore,
            lastActivity: c.lastActivityAt
          }))
      };

      return trends;
    } catch (error) {
      console.error('Error getting activity trends:', error);
      throw error;
    }
  }
}

export const activitySignalService = new ActivitySignalService();
export default activitySignalService;
