import axios from 'axios';

/**
 * Dev.to Developer Scraper
 * Fetches real developer profiles from Dev.to community
 */
export class DevToScraper {
  constructor() {
    this.baseUrl = 'https://dev.to/api';
  }

  /**
   * Search Dev.to users
   * @param {Object} criteria - { keywords }
   * @param {Number} limit - Max results to fetch
   */
  async searchDevelopers(criteria = {}, limit = 30) {
    try {
      console.log(`🔍 Searching Dev.to for developers...`);

      // Get latest articles to find active developers
      const response = await axios.get(`${this.baseUrl}/articles`, {
        params: {
          per_page: 100,
          top: 7 // Last 7 days
        }
      });

      const articles = response.data || [];
      const userMap = new Map();

      // Extract unique users from articles
      for (const article of articles) {
        if (userMap.size >= limit) break;
        
        const user = article.user;
        if (!user || userMap.has(user.username)) continue;

        try {
          // Get user details
          const userResponse = await axios.get(`${this.baseUrl}/users/${user.username}`);
          const userData = userResponse.data;

          // Extract skills from user's tags
          const skills = this.extractSkills(article.tag_list);

          userMap.set(user.username, {
            fullName: userData.name || user.name || 'Unknown',
            emails: [],
            phones: [],
            githubUrl: userData.github_username ? `https://github.com/${userData.github_username}` : '',
            linkedinUrl: '',
            portfolioUrl: userData.website_url || '',
            location: userData.location || 'India',
            bio: userData.summary || '',
            skills: skills,
            totalExperience: 0,
            company: '',
            designation: this.getDesignationFromSkills(skills),
            education: []
          });

          // Rate limiting
          await this.sleep(200);
        } catch (err) {
          console.warn(`Failed to fetch user ${user.username}:`, err.message);
        }
      }

      const candidates = Array.from(userMap.values());
      console.log(`✅ Found ${candidates.length} Dev.to profiles`);
      return candidates;
    } catch (error) {
      console.error('Dev.to search error:', error.message);
      return [];
    }
  }

  extractSkills(tagList) {
    const techTags = [
      'javascript', 'python', 'java', 'react', 'nodejs', 'typescript',
      'angular', 'vue', 'docker', 'kubernetes', 'aws', 'mongodb',
      'postgresql', 'mysql', 'redis', 'graphql', 'rest', 'api'
    ];

    return tagList
      .filter(tag => techTags.includes(tag.toLowerCase()))
      .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
  }

  getDesignationFromSkills(skills) {
    const skillStr = skills.join(' ').toLowerCase();
    if (skillStr.includes('react') || skillStr.includes('vue')) return 'Frontend Developer';
    if (skillStr.includes('node')) return 'Backend Developer';
    if (skillStr.includes('python')) return 'Python Developer';
    if (skillStr.includes('java')) return 'Java Developer';
    return 'Software Developer';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
