import axios from 'axios';

/**
 * GitHub Public Profile Scraper
 * Fetches developers from GitHub based on search criteria
 */
export class GitHubScraper {
  constructor() {
    this.baseUrl = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN || null;
  }

  /**
   * Search GitHub users by criteria
   * @param {Object} criteria - { language, location, minRepos, minFollowers }
   * @param {Number} limit - Max results to fetch
   * @param {Number} page - Page number for pagination
   */
  async searchDevelopers(criteria = {}, limit = 30, page = 1) {
    try {
      const { language, location, minRepos = 1, minFollowers = 0 } = criteria;
      
      // Build search query
      let query = 'type:user';
      if (language) query += ` language:${language}`;
      if (location) query += ` location:${location}`;
      if (minRepos) query += ` repos:>=${minRepos}`;
      if (minFollowers) query += ` followers:>=${minFollowers}`;

      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GreatHire-Sourcing-Bot'
      };
      
      if (this.token) {
        headers['Authorization'] = `token ${this.token}`;
      }

      // Rotate sorting strategy based on page to get diverse results
      const sortStrategies = [
        { sort: 'joined', order: 'desc' },      // Recently joined users
        { sort: 'repositories', order: 'desc' }, // Most repos
        { sort: 'followers', order: 'desc' }     // Most followers
      ];
      const strategy = sortStrategies[page % sortStrategies.length];

      console.log(`   Using sort strategy: ${strategy.sort} ${strategy.order} (page ${page})`);

      const response = await axios.get(`${this.baseUrl}/search/users`, {
        params: { 
          q: query, 
          per_page: Math.min(limit, 100),
          page: Math.ceil(page / sortStrategies.length), // Actual API page
          sort: strategy.sort,
          order: strategy.order
        },
        headers
      });

      const users = response.data.items || [];
      const candidates = [];
      const seenUsernames = new Set();

      // Fetch detailed profile for each user
      for (const user of users.slice(0, limit)) {
        try {
          if (seenUsernames.has(user.login.toLowerCase())) {
            console.log(`   ⏭️ Skipping duplicate username: ${user.login}`);
            continue;
          }
          seenUsernames.add(user.login.toLowerCase());
          
          const profile = await this.fetchUserProfile(user.login);
          if (profile) candidates.push(profile);
          
          // Increased delay to avoid secondary rate limit (403)
          await this.sleep(this.token ? 800 : 2000);
        } catch (err) {
          console.warn(`Failed to fetch profile for ${user.login}:`, err.message);
          // On 403, back off longer before continuing
          if (err.response?.status === 403 || err.message.includes('403')) {
            console.warn('   ⏳ Rate limited, backing off for 60 seconds...');
            await this.sleep(60000);
          }
        }
      }

      return candidates;
    } catch (error) {
      console.error('GitHub search error:', error.message);
      throw new Error(`GitHub scraping failed: ${error.message}`);
    }
  }

  /**
   * Fetch detailed user profile
   */
  async fetchUserProfile(username, retries = 3) {
    try {
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GreatHire-Sourcing-Bot'
      };
      
      if (this.token) {
        headers['Authorization'] = `token ${this.token}`;
      }

      const [userRes, reposRes] = await Promise.all([
        axios.get(`${this.baseUrl}/users/${username}`, { headers }),
        axios.get(`${this.baseUrl}/users/${username}/repos`, { 
          params: { per_page: 30, sort: 'updated' },
          headers 
        })
      ]);

      // Small gap between the batch above and README fetch
      await this.sleep(300);
      const user = userRes.data;
      const repos = reposRes.data;

      // Extract skills from repo languages
      const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

      // Extract contact info from bio and README
      const contactInfo = await this.extractContactInfo(user, repos, headers);

      // Generate profile overview
      const profileOverview = this.generateProfileOverview(user, repos, languages, contactInfo);

      return {
        fullName: user.name || username,
        emails: contactInfo.emails,
        phones: contactInfo.phones,
        githubUrl: user.html_url,
        location: user.location || '',
        bio: user.bio || '',
        company: user.company || '',
        skills: languages,
        publicRepos: user.public_repos,
        followers: user.followers,
        avatarUrl: user.avatar_url,
        blogUrl: user.blog || '',
        portfolioUrl: contactInfo.portfolioUrl || user.blog || '',
        summary: profileOverview,
        designation: this.inferDesignation(repos, languages),
        totalExperience: this.estimateExperience(user, repos),
      };
    } catch (error) {
      // Retry on 403 with exponential backoff
      if ((error.response?.status === 403 || error.response?.status === 429) && retries > 0) {
        const backoff = (4 - retries) * 15000; // 15s, 30s, 45s
        console.warn(`   ⏳ Rate limited fetching ${username}, retrying in ${backoff/1000}s... (${retries} retries left)`);
        await this.sleep(backoff);
        return this.fetchUserProfile(username, retries - 1);
      }
      console.error(`Error fetching profile for ${username}:`, error.message);
      return null;
    }
  }

  /**
   * Extract contact information from bio, README, and profile
   */
  async extractContactInfo(user, repos, headers) {
    const emails = [];
    const phones = [];
    let portfolioUrl = '';

    // Add email from profile
    if (user.email) emails.push(user.email);

    // Extract from bio
    if (user.bio) {
      const bioEmails = this.extractEmails(user.bio);
      const bioPhones = this.extractPhones(user.bio);
      emails.push(...bioEmails);
      phones.push(...bioPhones);
    }

    // Extract from blog/website
    if (user.blog) {
      portfolioUrl = user.blog;
    }

    // Check README of profile repo (username/username)
    try {
      const profileRepo = repos.find(r => r.name.toLowerCase() === user.login.toLowerCase());
      if (profileRepo) {
        const readmeRes = await axios.get(
          `${this.baseUrl}/repos/${user.login}/${profileRepo.name}/readme`,
          { headers }
        );
        
        if (readmeRes.data && readmeRes.data.content) {
          const readmeContent = Buffer.from(readmeRes.data.content, 'base64').toString('utf-8');
          const readmeEmails = this.extractEmails(readmeContent);
          const readmePhones = this.extractPhones(readmeContent);
          emails.push(...readmeEmails);
          phones.push(...readmePhones);
        }
      }
    } catch (err) {
      // README not found or error - continue
    }

    return {
      emails: [...new Set(emails)].filter(Boolean),
      phones: [...new Set(phones)].filter(Boolean),
      portfolioUrl,
    };
  }

  /**
   * Extract email addresses from text
   */
  extractEmails(text) {
    if (!text) return [];
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return (text.match(emailRegex) || []).filter(email => 
      !email.includes('noreply') && !email.includes('example.com')
    );
  }

  /**
   * Extract phone numbers from text (supports multiple formats)
   */
  extractPhones(text) {
    if (!text) return [];
    const phones = [];
    
    // Indian format: +91-XXXXX-XXXXX, +91 XXXXX XXXXX, 91XXXXXXXXXX
    const indianRegex = /(?:\+91|91)?[\s-]?[6-9]\d{9}/g;
    const indianMatches = text.match(indianRegex) || [];
    phones.push(...indianMatches.map(p => p.replace(/[\s-]/g, '')));
    
    // International format: +XX-XXX-XXX-XXXX
    const intlRegex = /\+\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}/g;
    const intlMatches = text.match(intlRegex) || [];
    phones.push(...intlMatches.map(p => p.replace(/[\s()-]/g, '')));
    
    // US format: (XXX) XXX-XXXX
    const usRegex = /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
    const usMatches = text.match(usRegex) || [];
    phones.push(...usMatches.map(p => p.replace(/[\s()-]/g, '')));
    
    return [...new Set(phones)].filter(p => p.length >= 10 && p.length <= 15);
  }

  /**
   * Generate comprehensive profile overview
   */
  generateProfileOverview(user, repos, languages, contactInfo) {
    const parts = [];

    // Basic intro
    const name = user.name || user.login;
    const location = user.location ? ` based in ${user.location}` : '';
    parts.push(`${name} is a developer${location}.`);

    // Company info
    if (user.company) {
      parts.push(`Currently working at ${user.company.replace('@', '')}.`);
    }

    // Technical skills
    if (languages.length > 0) {
      const topLanguages = languages.slice(0, 5).join(', ');
      parts.push(`Skilled in ${topLanguages}.`);
    }

    // GitHub activity
    const repoCount = user.public_repos || 0;
    const followerCount = user.followers || 0;
    if (repoCount > 0) {
      parts.push(`Has ${repoCount} public repositories with ${followerCount} followers.`);
    }

    // Notable projects
    const topRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 3);
    
    if (topRepos.length > 0 && topRepos[0].stargazers_count > 0) {
      const projectNames = topRepos.map(r => `${r.name} (${r.stargazers_count}⭐)`).join(', ');
      parts.push(`Notable projects: ${projectNames}.`);
    }

    // Bio
    if (user.bio) {
      parts.push(user.bio);
    }

    // Contact availability
    if (contactInfo.emails.length > 0 || contactInfo.phones.length > 0) {
      parts.push('Contact information available.');
    }

    return parts.join(' ');
  }

  /**
   * Infer job designation from repos and languages
   */
  inferDesignation(repos, languages) {
    const repoNames = repos.map(r => r.name.toLowerCase()).join(' ');
    const repoDescriptions = repos.map(r => (r.description || '').toLowerCase()).join(' ');
    const allText = `${repoNames} ${repoDescriptions}`;

    // Check for specific roles
    if (allText.includes('frontend') || allText.includes('react') || allText.includes('vue')) {
      return 'Frontend Developer';
    }
    if (allText.includes('backend') || allText.includes('api') || allText.includes('server')) {
      return 'Backend Developer';
    }
    if (allText.includes('fullstack') || allText.includes('full-stack')) {
      return 'Full Stack Developer';
    }
    if (allText.includes('mobile') || allText.includes('android') || allText.includes('ios')) {
      return 'Mobile Developer';
    }
    if (allText.includes('devops') || allText.includes('kubernetes') || allText.includes('docker')) {
      return 'DevOps Engineer';
    }
    if (allText.includes('ml') || allText.includes('machine learning') || allText.includes('ai')) {
      return 'Machine Learning Engineer';
    }
    if (allText.includes('data') || allText.includes('analytics')) {
      return 'Data Engineer';
    }

    // Default based on primary language
    if (languages.length > 0) {
      return `${languages[0]} Developer`;
    }

    return 'Software Developer';
  }

  /**
   * Estimate years of experience based on account age and activity
   */
  estimateExperience(user, repos) {
    const accountCreated = new Date(user.created_at);
    const now = new Date();
    const yearsOnGitHub = (now - accountCreated) / (1000 * 60 * 60 * 24 * 365);

    // Get oldest repo date
    const oldestRepo = repos.reduce((oldest, repo) => {
      const repoDate = new Date(repo.created_at);
      return repoDate < oldest ? repoDate : oldest;
    }, now);

    const yearsFromRepos = (now - oldestRepo) / (1000 * 60 * 60 * 24 * 365);

    // Use the longer period and add 1-2 years (assuming they coded before GitHub)
    const estimatedYears = Math.max(yearsOnGitHub, yearsFromRepos) + 1;

    // Cap at reasonable values
    return Math.min(Math.max(Math.floor(estimatedYears), 0), 20);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
