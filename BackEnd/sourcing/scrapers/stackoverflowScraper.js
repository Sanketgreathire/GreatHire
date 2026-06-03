import axios from 'axios';

/**
 * Stack Overflow Developer Scraper
 * Fetches real developer profiles from Stack Overflow
 */
export class StackOverflowScraper {
  constructor() {
    this.baseUrl = 'https://api.stackexchange.com/2.3';
  }

  /**
   * Search Stack Overflow users
   * @param {Object} criteria - { location }
   * @param {Number} limit - Max results to fetch
   */
  async searchDevelopers(criteria = {}, limit = 30) {
    try {
      const { location = 'India' } = criteria;
      
      console.log(`🔍 Searching Stack Overflow for developers in ${location}...`);

      // Search users by location
      const response = await axios.get(`${this.baseUrl}/users`, {
        params: {
          order: 'desc',
          sort: 'reputation',
          inname: location,
          site: 'stackoverflow',
          pagesize: Math.min(limit, 100),
          filter: 'default'
        }
      });

      const users = response.data.items || [];
      const candidates = [];

      for (const user of users) {
        try {
          // Get user's top tags (skills)
          const tagsResponse = await axios.get(`${this.baseUrl}/users/${user.user_id}/top-tags`, {
            params: {
              site: 'stackoverflow',
              pagesize: 10
            }
          });

          const skills = tagsResponse.data.items?.map(tag => tag.tag_name) || [];

          candidates.push({
            fullName: user.display_name || 'Unknown',
            emails: [],
            phones: [],
            githubUrl: '',
            linkedinUrl: user.website_url?.includes('linkedin') ? user.website_url : '',
            portfolioUrl: user.website_url || '',
            location: user.location || location,
            bio: user.about_me ? this.stripHtml(user.about_me).substring(0, 200) : '',
            skills: skills.slice(0, 10),
            totalExperience: this.estimateExperience(user.creation_date),
            company: '',
            designation: this.getDesignationFromSkills(skills),
            education: []
          });

          // Rate limiting
          await this.sleep(100);
        } catch (err) {
          console.warn(`Failed to fetch tags for ${user.display_name}:`, err.message);
        }
      }

      console.log(`✅ Found ${candidates.length} Stack Overflow profiles`);
      return candidates;
    } catch (error) {
      console.error('Stack Overflow search error:', error.message);
      return [];
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  estimateExperience(creationDate) {
    const years = (Date.now() - creationDate * 1000) / (1000 * 60 * 60 * 24 * 365);
    return Math.max(0, Math.floor(years));
  }

  getDesignationFromSkills(skills) {
    if (skills.includes('javascript') || skills.includes('react')) return 'Full Stack Developer';
    if (skills.includes('python')) return 'Python Developer';
    if (skills.includes('java')) return 'Java Developer';
    if (skills.includes('node.js')) return 'Backend Developer';
    if (skills.includes('angular') || skills.includes('vue.js')) return 'Frontend Developer';
    return 'Software Developer';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
