import { SourceConnector } from "../sourceConnector.service.js";
import axios from "axios";

export class GitHubConnector extends SourceConnector {
  constructor(config = {}) {
    super('github', config);
    this.baseURL = 'https://api.github.com';
    this.rateLimitRemaining = 5000;
    this.rateLimitReset = null;
    this.searchQueries = [
      'software developer location:"San Francisco" followers:>50',
      'full stack developer location:"New York" followers:>30',
      'frontend developer location:"London" followers:>40',
      'backend developer location:"Berlin" followers:>35',
      'devops engineer location:"Amsterdam" followers:>25',
      'machine learning engineer location:"Boston" followers:>45',
      'data scientist location:"Seattle" followers:>40',
      'react developer location:"Austin" followers:>30',
      'node.js developer location:"Toronto" followers:>35',
      'python developer location:"Chicago" followers:>30'
    ];
  }

  async fetchProfiles(options = {}) {
    const { limit = 100, query } = options;
    
    try {
      const profiles = [];
      const queries = query ? [query] : this.searchQueries;
      
      for (const searchQuery of queries) {
        if (profiles.length >= limit) break;
        
        await this.checkRateLimit();
        
        const searchResults = await this.searchUsers(searchQuery, Math.ceil((limit - profiles.length) / queries.length));
        
        for (const user of searchResults) {
          if (profiles.length >= limit) break;
          
          await this.checkRateLimit();
          
          const userProfile = await this.getUserProfile(user.login);
          if (userProfile) {
            profiles.push(userProfile);
          }
        }
      }
      
      return profiles;
    } catch (error) {
      console.error("Error fetching GitHub profiles:", error);
      throw error;
    }
  }

  async searchUsers(query, limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/search/users`, {
        headers: this.getHeaders(),
        params: {
          q: query,
          per_page: Math.min(limit, 100),
          sort: 'followers',
          order: 'desc'
        }
      });

      this.updateRateLimit(response.headers);
      return response.data.items || [];
    } catch (error) {
      console.error("Error searching GitHub users:", error);
      throw error;
    }
  }

  async getUserProfile(username) {
    try {
      const [userResponse, reposResponse] = await Promise.all([
        axios.get(`${this.baseURL}/users/${username}`, { headers: this.getHeaders() }),
        axios.get(`${this.baseURL}/users/${username}/repos`, {
          headers: this.getHeaders(),
          params: { per_page: 100, sort: 'updated', type: 'owner' }
        })
      ]);

      this.updateRateLimit(userResponse.headers);
      this.updateRateLimit(reposResponse.headers);

      const user = userResponse.data;
      const repos = reposResponse.data;

      if (!user.email && !user.blog && !user.company) {
        return null;
      }

      return {
        login: user.login,
        name: user.name || user.login,
        email: user.email,
        bio: user.bio,
        location: user.location,
        company: user.company,
        blog: user.blog,
        html_url: user.html_url,
        avatar_url: user.avatar_url,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        created_at: user.created_at,
        updated_at: user.updated_at,
        repositories: repos.map(repo => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updated_at: repo.updated_at,
          html_url: repo.html_url
        }))
      };
    } catch (error) {
      console.error(`Error getting GitHub profile for ${username}:`, error);
      return null;
    }
  }

  parseProfiles(rawProfiles) {
    return rawProfiles
      .filter(profile => profile && (profile.email || profile.blog || profile.company))
      .map(profile => this.parseGitHubProfile(profile));
  }

  parseGitHubProfile(profile) {
    const skills = this.extractSkillsFromRepos(profile.repositories || []);
    const experience = this.extractExperienceFromRepos(profile.repositories || []);
    const portfolio = this.extractPortfolioFromRepos(profile.repositories || []);

    return {
      name: profile.name || profile.login,
      email: profile.email,
      bio: profile.bio,
      location: profile.location,
      company: profile.company,
      githubUrl: profile.html_url,
      blog: profile.blog,
      avatarUrl: profile.avatar_url,
      followers: profile.followers,
      following: profile.followers,
      publicRepos: profile.public_repos,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      skills,
      experience,
      portfolio,
      sourceUrl: profile.html_url,
      confidenceScore: this.calculateConfidenceScore(profile),
      rawProfile: profile
    };
  }

  extractSkillsFromRepos(repositories) {
    const skills = new Set();
    const languageCount = {};

    repositories.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }

      const nameSkills = this.extractSkillsFromText(repo.name);
      const descSkills = this.extractSkillsFromText(repo.description || '');

      nameSkills.forEach(skill => skills.add(skill));
      descSkills.forEach(skill => skills.add(skill));
    });

    Object.entries(languageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([language]) => skills.add(language));

    return Array.from(skills);
  }

  extractSkillsFromText(text) {
    if (!text) return [];

    const skillKeywords = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'express',
      'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'kotlin',
      'swift', 'objective-c', 'c++', 'c#', 'php', 'laravel', 'ruby', 'rails',
      'go', 'rust', 'scala', 'elixir', 'haskell', 'dart', 'flutter',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
      'ci/cd', 'devops', 'microservices', 'api', 'rest', 'graphql',
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
      'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
      'machine learning', 'deep learning', 'ai', 'data science',
      'blockchain', 'web3', 'ethereum', 'smart contracts',
      'mobile', 'ios', 'android', 'react native', 'flutter',
      'testing', 'jest', 'mocha', 'cypress', 'selenium'
    ];

    const textLower = text.toLowerCase();
    const foundSkills = [];

    skillKeywords.forEach(skill => {
      if (textLower.includes(skill)) {
        foundSkills.push(skill);
      }
    });

    return foundSkills;
  }

  extractExperienceFromRepos(repositories) {
    const experience = [];
    const currentDate = new Date();

    repositories
      .filter(repo => repo.language && repo.stars > 0)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5)
      .forEach(repo => {
        const startDate = new Date(repo.created_at);
        const endDate = new Date(repo.updated_at);
        
        experience.push({
          title: `${repo.language} Developer`,
          company: 'Open Source',
          description: `Developed and maintained ${repo.name} - ${repo.description || 'A public repository'}`,
          technologies: [repo.language],
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          current: (currentDate - endDate) < (30 * 24 * 60 * 60 * 1000), // Active in last 30 days
          achievements: [
            `${repo.stars} stars`,
            `${repo.forks} forks`,
            `${repo.language} project`
          ]
        });
      });

    return experience;
  }

  extractPortfolioFromRepos(repositories) {
    return repositories
      .filter(repo => repo.description && repo.stars > 0)
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10)
      .map(repo => ({
        title: repo.name,
        url: repo.html_url,
        description: repo.description,
        technologies: repo.language ? [repo.language] : [],
        stars: repo.stars,
        forks: repo.forks,
        language: repo.language,
        updatedAt: repo.updated_at,
        type: 'github-repo'
      }));
  }

  calculateConfidenceScore(profile) {
    let score = 0.5; // Base score

    if (profile.email) score += 0.2;
    if (profile.bio && profile.bio.length > 50) score += 0.1;
    if (profile.location) score += 0.1;
    if (profile.company) score += 0.1;
    if (profile.blog) score += 0.1;
    if (profile.followers > 50) score += 0.1;
    if (profile.public_repos > 10) score += 0.1;
    if (profile.followers > 100) score += 0.1;
    if (profile.public_repos > 50) score += 0.1;

    return Math.min(score, 1.0);
  }

  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GreatHire-Discovery/1.0'
    };

    if (this.config.githubToken) {
      headers['Authorization'] = `token ${this.config.githubToken}`;
    }

    return headers;
  }

  updateRateLimit(headers) {
    this.rateLimitRemaining = parseInt(headers['x-ratelimit-remaining'] || 0);
    this.rateLimitReset = parseInt(headers['x-ratelimit-reset'] || 0);
  }

  async checkRateLimit() {
    if (this.rateLimitRemaining < 10) {
      const resetTime = this.rateLimitReset * 1000;
      const now = Date.now();
      
      if (resetTime > now) {
        const waitTime = Math.ceil((resetTime - now) / 1000);
        console.log(`Rate limit reached. Waiting ${waitTime} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      }
    }
  }

  async testConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/rate_limit`, {
        headers: this.getHeaders()
      });

      this.updateRateLimit(response.headers);
      
      return {
        success: true,
        message: 'GitHub API connection successful',
        rateLimit: {
          remaining: this.rateLimitRemaining,
          reset: new Date(this.rateLimitReset * 1000)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }
}

export default GitHubConnector;
