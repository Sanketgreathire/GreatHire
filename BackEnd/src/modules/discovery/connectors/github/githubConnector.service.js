import axios from "axios";
import { githubRateLimitService } from "../github/githubRateLimit.service.js";
import { githubProfileParser } from "../github/githubProfileParser.service.js";
import { githubSkillInference } from "../github/githubSkillInference.service.js";
import { enqueueGitHubDiscovery } from "../../workers/githubDiscovery.worker.js";
import { SourceMetadata } from "../../../../models/sourceMetadata.model.js";
import { SourcingCandidate } from "../../../../../models/sourcing/sourcingCandidate.model.js";
import { GitHubCandidateMetadata } from "../../../../models/githubCandidateMetadata.model.js";

export class GitHubConnector {
  constructor(config = {}) {
    this.baseURL = 'https://api.github.com';
    this.config = {
      token: process.env.GITHUB_TOKEN || config.token,
      maxRequestsPerHour: 5000,
      batchSize: 100,
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };
    this.stats = {
      totalFetched: 0,
      totalProcessed: 0,
      totalSaved: 0,
      totalErrors: 0,
      startTime: null,
      endTime: null
    };
  }

  async discoverGitHubProfiles(options = {}) {
    const {
      query = '',
      location = '',
      language = '',
      followers = '>=50',
      repos = '>=10',
      limit = 100,
      sort = 'followers',
      order = 'desc'
    } = options;

    this.stats.startTime = new Date();
    
    try {
      const searchQuery = this.buildSearchQuery({ query, location, language, followers, repos });
      const profiles = await this.searchAndFetchProfiles(searchQuery, limit, sort, order);
      
      this.stats.endTime = new Date();
      this.stats.totalFetched = profiles.length;
      
      return {
        success: true,
        profiles,
        stats: this.stats,
        query: searchQuery
      };
    } catch (error) {
      this.stats.endTime = new Date();
      this.stats.totalErrors++;
      
      console.error('GitHub discovery error:', error);
      throw error;
    }
  }

  buildSearchQuery({ query, location, language, followers, repos }) {
    const parts = [];
    
    if (query) parts.push(query);
    if (location) parts.push(`location:"${location}"`);
    if (language) parts.push(`language:${language}`);
    if (followers) parts.push(`followers:${followers}`);
    if (repos) parts.push(`repos:${repos}`);
    
    return parts.join(' ');
  }

  async searchAndFetchProfiles(query, limit, sort, order) {
    const profiles = [];
    let page = 1;
    const perPage = Math.min(limit, 100);
    
    while (profiles.length < limit) {
      await githubRateLimitService.waitForQuota();
      
      const searchResults = await this.searchUsers(query, page, perPage, sort, order);
      
      if (searchResults.items.length === 0) break;
      
      for (const user of searchResults.items) {
        if (profiles.length >= limit) break;
        
        try {
          const profile = await this.fetchCompleteProfile(user.login);
          if (profile) {
            profiles.push(profile);
          }
        } catch (error) {
          console.error(`Error fetching profile for ${user.login}:`, error);
          this.stats.totalErrors++;
        }
      }
      
      page++;
      
      if (searchResults.items.length < perPage) break;
    }
    
    return profiles;
  }

  async searchUsers(query, page = 1, perPage = 100, sort = 'followers', order = 'desc') {
    const url = `${this.baseURL}/search/users`;
    const params = {
      q: query,
      page,
      per_page: perPage,
      sort,
      order
    };

    const response = await this.makeGitHubRequest('GET', url, params);
    githubRateLimitService.updateRateLimit(response.headers);
    
    return response.data;
  }

  async fetchCompleteProfile(username) {
    await githubRateLimitService.waitForQuota();
    
    const [userResponse, reposResponse, orgsResponse] = await Promise.all([
      this.getUserProfile(username),
      this.getUserRepositories(username),
      this.getUserOrganizations(username)
    ]);

    const user = userResponse.data;
    const repos = reposResponse.data;
    const orgs = orgsResponse.data;

    const parsedProfile = await githubProfileParser.parseProfile({
      user,
      repositories: repos,
      organizations: orgs
    });

    const inferredSkills = await githubSkillInference.inferSkills(parsedProfile);

    const completeProfile = {
      ...parsedProfile,
      inferredSkills,
      githubUsername: username,
      githubUrl: user.html_url,
      contributionScore: this.calculateContributionScore(repos, user),
      developerScore: this.calculateDeveloperScore(user, repos, inferredSkills),
      organizationHistory: orgs.map(org => ({
        name: org.login,
        avatarUrl: org.avatar_url,
        description: org.description
      }))
    };

    return completeProfile;
  }

  async getUserProfile(username) {
    const url = `${this.baseURL}/users/${username}`;
    return this.makeGitHubRequest('GET', url);
  }

  async getUserRepositories(username, page = 1, perPage = 100) {
    const url = `${this.baseURL}/users/${username}/repos`;
    const params = {
      page,
      per_page: perPage,
      sort: 'updated',
      type: 'owner'
    };

    const response = await this.makeGitHubRequest('GET', url, params);
    githubRateLimitService.updateRateLimit(response.headers);
    
    return response;
  }

  async getUserOrganizations(username) {
    const url = `${this.baseURL}/users/${username}/orgs`;
    const response = await this.makeGitHubRequest('GET', url);
    githubRateLimitService.updateRateLimit(response.headers);
    
    return response;
  }

  async getRepositoryReadme(owner, repo) {
    const url = `${this.baseURL}/repos/${owner}/${repo}/readme`;
    try {
      const response = await this.makeGitHubRequest('GET', url);
      return Buffer.from(response.data.content, 'base64').toString('utf8');
    } catch (error) {
      return null;
    }
  }

  async getRepositoryLanguages(owner, repo) {
    const url = `${this.baseURL}/repos/${owner}/${repo}/languages`;
    try {
      const response = await this.makeGitHubRequest('GET', url);
      return response.data;
    } catch (error) {
      return {};
    }
  }

  async getRepositoryContributors(owner, repo) {
    const url = `${this.baseURL}/repos/${owner}/${repo}/contributors`;
    try {
      const response = await this.makeGitHubRequest('GET', url);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  calculateContributionScore(repositories, user) {
    let score = 0;
    
    // Base score from followers
    score += Math.min(user.followers / 100, 10);
    
    // Repository contributions
    score += repositories.length * 0.5;
    
    // Stars received
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    score += Math.min(totalStars / 10, 20);
    
    // Forks received
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    score += Math.min(totalForks / 5, 10);
    
    // Active repositories (updated in last 6 months)
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const activeRepos = repositories.filter(repo => new Date(repo.updated_at) > sixMonthsAgo);
    score += activeRepos.length * 2;
    
    // Account age bonus
    const accountAge = (Date.now() - new Date(user.created_at)) / (365 * 24 * 60 * 60 * 1000);
    score += Math.min(accountAge, 5);
    
    return Math.round(score * 10) / 10;
  }

  calculateDeveloperScore(user, repositories, inferredSkills) {
    let score = 0;
    
    // Repository diversity
    const languages = new Set();
    repositories.forEach(repo => {
      if (repo.language) languages.add(repo.language);
    });
    score += languages.size * 2;
    
    // Skill depth
    score += (inferredSkills.technical?.length || 0) * 1.5;
    score += (inferredSkills.cloud?.length || 0) * 2;
    score += (inferredSkills.devops?.length || 0) * 2;
    score += (inferredSkills.ai_ml?.length || 0) * 3;
    
    // Seniority signals
    if (user.followers > 100) score += 5;
    if (user.followers > 500) score += 10;
    if (repositories.length > 20) score += 5;
    if (repositories.length > 50) score += 10;
    
    // Organization history
    if (user.company) score += 3;
    
    return Math.round(score * 10) / 10;
  }

  async makeGitHubRequest(method, url, params = {}, data = null) {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GreatHire-Discovery/1.0'
    };

    if (this.config.token) {
      headers['Authorization'] = `token ${this.config.token}`;
    }

    const config = {
      method,
      url,
      headers,
      params,
      data,
      timeout: 30000
    };

    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new Error('GitHub rate limit exceeded');
      }
      throw error;
    }
  }

  async bulkDiscover(options) {
    const queries = options.queries || [
      'software developer location:"San Francisco"',
      'full stack developer location:"New York"',
      'frontend developer location:"London"',
      'backend developer location:"Berlin"',
      'devops engineer location:"Amsterdam"'
    ];

    const results = [];
    
    for (const query of queries) {
      try {
        const result = await this.discoverGitHubProfiles({
          ...options,
          query,
          limit: Math.floor((options.limit || 100) / queries.length)
        });
        results.push(result);
      } catch (error) {
        console.error(`Error with query "${query}":`, error);
        this.stats.totalErrors++;
      }
    }
    
    return {
      success: true,
      results,
      totalProfiles: results.reduce((sum, result) => sum + result.profiles.length, 0),
      stats: this.stats
    };
  }

  async saveProfile(profile) {
    try {
      // Check for existing candidate by GitHub URL
      const existingCandidate = await SourcingCandidate.findOne({
        githubUrl: profile.githubUrl
      });

      if (existingCandidate) {
        // Update existing candidate
        await this.updateExistingCandidate(existingCandidate, profile);
        return existingCandidate;
      }

      // Create new candidate
      const candidate = new SourcingCandidate({
        name: profile.name || profile.githubUsername,
        email: profile.email,
        location: profile.location,
        skills: [...(profile.skills || []), ...(profile.inferredSkills?.all || [])],
        experience: this.formatExperience(profile.repositories),
        education: profile.education || [],
        portfolio: profile.portfolio || [],
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        resumeUrl: profile.resumeUrl,
        source: 'github-discovery',
        isActive: true,
        summary: profile.bio,
        title: profile.title
      });

      const savedCandidate = await candidate.save();

      // Create GitHub metadata
      const githubMetadata = new GitHubCandidateMetadata({
        candidateId: savedCandidate._id,
        githubUsername: profile.githubUsername,
        githubUrl: profile.githubUrl,
        repositories: profile.repositories,
        inferredSkills: profile.inferredSkills,
        contributionScore: profile.contributionScore,
        developerScore: profile.developerScore,
        organizationHistory: profile.organizationHistory,
        rawProfile: profile
      });

      await githubMetadata.save();

      // Create source metadata
      const sourceMetadata = new SourceMetadata({
        sourceType: 'github',
        sourceUrl: profile.githubUrl,
        fetchedAt: new Date(),
        ingestionStatus: 'completed',
        connectorName: 'github-discovery',
        confidenceScore: profile.confidenceScore || 1.0,
        candidateId: savedCandidate._id,
        profileData: {
          name: profile.name,
          email: profile.email,
          skills: profile.skills,
          location: profile.location
        }
      });

      await sourceMetadata.save();

      this.stats.totalSaved++;
      return savedCandidate;
    } catch (error) {
      console.error('Error saving profile:', error);
      this.stats.totalErrors++;
      throw error;
    }
  }

  async updateExistingCandidate(candidate, profile) {
    // Merge skills
    const existingSkills = new Set(candidate.skills || []);
    const newSkills = [...(profile.skills || []), ...(profile.inferredSkills?.all || [])];
    newSkills.forEach(skill => existingSkills.add(skill));
    candidate.skills = Array.from(existingSkills);

    // Update other fields
    if (profile.email && !candidate.email) candidate.email = profile.email;
    if (profile.location && !candidate.location) candidate.location = profile.location;
    if (profile.bio && (!candidate.summary || profile.bio.length > candidate.summary.length)) {
      candidate.summary = profile.bio;
    }

    await candidate.save();

    // Update GitHub metadata
    await GitHubCandidateMetadata.findOneAndUpdate(
      { candidateId: candidate._id },
      {
        repositories: profile.repositories,
        inferredSkills: profile.inferredSkills,
        contributionScore: profile.contributionScore,
        developerScore: profile.developerScore,
        organizationHistory: profile.organizationHistory,
        rawProfile: profile
      },
      { upsert: true }
    );

    return candidate;
  }

  formatExperience(repositories) {
    return repositories
      .filter(repo => repo.language && repo.stargazers_count > 0)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5)
      .map(repo => ({
        title: `${repo.language} Developer`,
        company: 'Open Source',
        description: repo.description || `Developed and maintained ${repo.name}`,
        technologies: repo.language ? [repo.language] : [],
        startDate: new Date(repo.created_at).toISOString().split('T')[0],
        endDate: new Date(repo.updated_at).toISOString().split('T')[0],
        current: (Date.now() - new Date(repo.updated_at)) < (30 * 24 * 60 * 60 * 1000),
        achievements: [
          `${repo.stargazers_count} stars`,
          `${repo.forks_count} forks`,
          `${repo.language} project`
        ]
      }));
  }

  async queueBulkDiscovery(options) {
    return await enqueueGitHubDiscovery({
      type: 'bulk-discovery',
      options,
      timestamp: new Date().toISOString()
    });
  }

  async queueSingleDiscovery(username) {
    return await enqueueGitHubDiscovery({
      type: 'single-discovery',
      username,
      timestamp: new Date().toISOString()
    });
  }

  getStats() {
    return {
      ...this.stats,
      duration: this.stats.endTime ? this.stats.endTime - this.stats.startTime : null,
      successRate: this.stats.totalFetched > 0 ? (this.stats.totalSaved / this.stats.totalFetched) * 100 : 0
    };
  }

  resetStats() {
    this.stats = {
      totalFetched: 0,
      totalProcessed: 0,
      totalSaved: 0,
      totalErrors: 0,
      startTime: null,
      endTime: null
    };
  }
}

export const githubConnector = new GitHubConnector();
export default githubConnector;
