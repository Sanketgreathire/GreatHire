import axios from 'axios';

/**
 * LinkedIn Profile Scraper using ProxyCurl API
 */
export class LinkedInScraper {
  constructor() {
    this.apiKey = process.env.PROXYCURL_API_KEY;
    this.baseUrl = 'https://nubela.co/proxycurl/api';
  }

  /**
   * Search LinkedIn profiles by criteria
   * @param {Object} criteria - { keywords, location, language }
   * @param {Number} limit - Max results to fetch
   */
  async searchProfiles(criteria = {}, limit = 20) {
    if (!this.apiKey) {
      console.log('⚠️ PROXYCURL_API_KEY not set - skipping LinkedIn');
      return [];
    }

    try {
      const { keywords = 'software developer', location = 'India', language } = criteria;
      const searchQuery = language ? `${language} developer` : keywords;
      
      console.log(`🔍 Searching LinkedIn via ProxyCurl: "${searchQuery}" in ${location}`);
      
      const response = await axios.get(`${this.baseUrl}/v2/search/person`, {
        params: {
          country: 'IN',
          keyword: searchQuery,
          page_size: Math.min(limit, 10),
          enrich_profiles: 'enrich'
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 30000
      });

      if (!response.data?.results) {
        console.log('⚠️ No LinkedIn results from ProxyCurl');
        return [];
      }

      const profiles = response.data.results.map(person => this.transformProfile(person));
      console.log(`✅ Found ${profiles.length} LinkedIn profiles via ProxyCurl`);
      
      return profiles;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('❌ Invalid PROXYCURL_API_KEY');
      } else if (error.response?.status === 429) {
        console.error('⚠️ ProxyCurl rate limit reached');
      } else {
        console.error('LinkedIn search error:', error.message);
      }
      return [];
    }
  }

  /**
   * Transform ProxyCurl response to our format
   */
  transformProfile(person) {
    const profile = person.profile || person;
    
    return {
      fullName: profile.full_name || 'Unknown',
      emails: this.extractEmails(profile),
      phones: [],
      linkedinUrl: profile.linkedin_profile_url || profile.public_identifier ? `https://linkedin.com/in/${profile.public_identifier}` : '',
      designation: profile.headline || profile.occupation || '',
      location: this.formatLocation(profile),
      bio: profile.summary || '',
      skills: this.extractSkills(profile),
      totalExperience: this.calculateExperience(profile.experiences),
      company: profile.experiences?.[0]?.company || '',
      education: this.extractEducation(profile.education)
    };
  }

  extractEmails(profile) {
    const emails = [];
    if (profile.personal_emails) emails.push(...profile.personal_emails);
    if (profile.work_email) emails.push(profile.work_email);
    return [...new Set(emails)];
  }

  formatLocation(profile) {
    if (profile.city && profile.country) {
      return `${profile.city}, ${profile.country}`;
    }
    return profile.city || profile.country || profile.location || '';
  }

  extractSkills(profile) {
    const skills = [];
    if (profile.skills) {
      skills.push(...profile.skills);
    }
    if (profile.headline) {
      const techKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node', 'AWS', 'Docker', 'Kubernetes'];
      techKeywords.forEach(keyword => {
        if (profile.headline.includes(keyword)) skills.push(keyword);
      });
    }
    return [...new Set(skills)];
  }

  calculateExperience(experiences) {
    if (!experiences || experiences.length === 0) return 0;
    
    let totalMonths = 0;
    experiences.forEach(exp => {
      if (exp.starts_at && exp.ends_at) {
        const start = new Date(exp.starts_at.year, exp.starts_at.month || 0);
        const end = exp.ends_at.year ? new Date(exp.ends_at.year, exp.ends_at.month || 0) : new Date();
        totalMonths += (end - start) / (1000 * 60 * 60 * 24 * 30);
      }
    });
    
    return Math.round(totalMonths / 12);
  }

  extractEducation(education) {
    if (!education) return [];
    
    return education.map(edu => ({
      degree: edu.degree_name || '',
      institution: edu.school || '',
      year: edu.ends_at?.year || ''
    }));
  }


}
