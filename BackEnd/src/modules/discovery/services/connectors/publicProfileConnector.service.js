import { SourceConnector } from "../sourceConnector.service.js";
import axios from "axios";
import * as cheerio from "cheerio";

export class PublicProfileConnector extends SourceConnector {
  constructor(config = {}) {
    super('public-profile', config);
    this.searchEngines = [
      'https://www.google.com/search?q=',
      'https://www.bing.com/search?q='
    ];
    this.profilePlatforms = [
      'linkedin.com/in/',
      'github.com/',
      'twitter.com/',
      'medium.com/@',
      'behance.net/',
      'dribbble.com/',
      'codepen.io/',
      'stackoverflow.com/users/',
      'angel.co/',
      'crunchbase.com/person/'
    ];
    this.searchQueries = [
      'software engineer portfolio site:.com',
      'full stack developer personal site:.io',
      'frontend developer website:.net',
      'backend developer blog:.org',
      'devops engineer portfolio site:.dev',
      'machine learning engineer site:.ai',
      'data scientist blog:.co',
      'react developer portfolio site:.me',
      'node.js developer personal site:.tech',
      'python developer website:.online'
    ];
  }

  async fetchProfiles(options = {}) {
    const { limit = 50, query } = options;
    
    try {
      const profiles = [];
      const queries = query ? [query] : this.searchQueries;
      
      for (const searchQuery of queries) {
        if (profiles.length >= limit) break;
        
        const searchResults = await this.searchPublicProfiles(searchQuery, Math.ceil((limit - profiles.length) / queries.length));
        
        for (const result of searchResults) {
          if (profiles.length >= limit) break;
          
          try {
            const profile = await this.extractProfileFromUrl(result.url);
            if (profile) {
              profiles.push(profile);
            }
          } catch (error) {
            console.error(`Error extracting profile from ${result.url}:`, error);
          }
        }
      }
      
      return profiles;
    } catch (error) {
      console.error("Error fetching public profiles:", error);
      throw error;
    }
  }

  async searchPublicProfiles(query, limit = 10) {
    const results = [];
    
    for (const searchEngine of this.searchEngines) {
      if (results.length >= limit) break;
      
      try {
        const searchUrl = `${searchEngine}${encodeURIComponent(query)}&num=${limit}`;
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        });

        const urls = this.extractUrlsFromSearchResults(response.data, searchEngine);
        
        for (const url of urls) {
          if (results.length >= limit) break;
          
          if (this.isValidProfileUrl(url)) {
            results.push({
              url,
              title: this.extractTitleFromUrl(url),
              source: searchEngine.includes('google') ? 'google' : 'bing'
            });
          }
        }
      } catch (error) {
        console.error(`Error searching ${searchEngine}:`, error);
      }
    }
    
    return results.slice(0, limit);
  }

  extractUrlsFromSearchResults(html, searchEngine) {
    const $ = cheerio.load(html);
    const urls = [];
    
    if (searchEngine.includes('google')) {
      $('div.g a[href]').each((i, element) => {
        const href = $(element).attr('href');
        if (href && href.startsWith('/url?q=')) {
          const url = href.split('/url?q=')[1].split('&sa=')[0];
          urls.push(decodeURIComponent(url));
        }
      });
    } else if (searchEngine.includes('bing')) {
      $('cite').each((i, element) => {
        const url = $(element).text();
        if (url.startsWith('http')) {
          urls.push(url);
        }
      });
    }
    
    return urls;
  }

  extractTitleFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      return pathParts[pathParts.length - 1] || urlObj.hostname;
    } catch (error) {
      return url;
    }
  }

  isValidProfileUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname.toLowerCase();
      
      const isValidPlatform = this.profilePlatforms.some(platform => 
        hostname.includes(platform.replace(/[^a-zA-Z0-9]/g, '')) ||
        pathname.includes(platform)
      );
      
      const hasPortfolioIndicators = [
        'portfolio', 'about', 'profile', 'resume', 'cv', 'bio',
        'developer', 'engineer', 'programmer', 'coder'
      ].some(indicator => pathname.includes(indicator));
      
      const isPersonalDomain = [
        '.github.io', '.netlify.app', '.vercel.app', '.me', '.dev',
        '.tech', '.io', '.co', '.online', '.site', '.website'
      ].some(domain => hostname.endsWith(domain));
      
      return isValidPlatform || hasPortfolioIndicators || isPersonalDomain;
    } catch (error) {
      return false;
    }
  }

  async extractProfileFromUrl(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      const profile = {
        url,
        title: this.extractPageTitle($),
        name: this.extractName($, url),
        email: this.extractEmail($, response.data),
        bio: this.extractBio($),
        location: this.extractLocation($),
        skills: this.extractSkills($, response.data),
        experience: this.extractExperience($),
        education: this.extractEducation($),
        portfolio: this.extractPortfolioProjects($, url),
        githubUrl: this.extractGithubUrl($, response.data),
        linkedinUrl: this.extractLinkedinUrl($, response.data),
        socialLinks: this.extractSocialLinks($),
        sourceUrl: url,
        confidenceScore: this.calculateConfidenceScore($, response.data),
        rawProfile: {
          html: response.data,
          url
        }
      };

      return profile.name || profile.email ? profile : null;
    } catch (error) {
      console.error(`Error extracting profile from ${url}:`, error);
      return null;
    }
  }

  extractPageTitle($) {
    return $('title').text().trim() || $('h1').first().text().trim();
  }

  extractName($, url) {
    const selectors = [
      '[class*="name"]',
      '[class*="title"]',
      '[class*="header"]',
      '[class*="hero"]',
      'h1',
      '.author',
      '.developer',
      '.engineer'
    ];

    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      if (text && text.length > 2 && text.length < 100) {
        return text;
      }
    }

    const title = $('title').text().trim();
    if (title && title.length < 100) {
      return title.split(' - ')[0] || title.split(' | ')[0] || title;
    }

    return null;
  }

  extractEmail($, html) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = html.match(emailRegex);
    return matches ? matches[0] : null;
  }

  extractBio($) {
    const selectors = [
      '[class*="bio"]',
      '[class*="about"]',
      '[class*="description"]',
      '[class*="summary"]',
      '[class*="intro"]',
      'meta[name="description"]'
    ];

    for (const selector of selectors) {
      const text = $(selector).first().text().trim() || $(selector).first().attr('content');
      if (text && text.length > 10 && text.length < 500) {
        return text;
      }
    }

    return null;
  }

  extractLocation($) {
    const selectors = [
      '[class*="location"]',
      '[class*="address"]',
      '[class*="city"]',
      '[class*="country"]',
      '[class*="geo"]'
    ];

    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      if (text && text.length > 2 && text.length < 100) {
        return text;
      }
    }

    return null;
  }

  extractSkills($, html) {
    const skills = new Set();
    
    const skillKeywords = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'express',
      'python', 'django', 'flask', 'java', 'spring', 'kotlin', 'swift',
      'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'scala', 'dart',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
      'tensorflow', 'pytorch', 'machine learning', 'ai', 'data science',
      'blockchain', 'web3', 'mobile', 'ios', 'android', 'testing'
    ];

    const textLower = html.toLowerCase();
    
    skillKeywords.forEach(skill => {
      if (textLower.includes(skill)) {
        skills.add(skill);
      }
    });

    const skillSelectors = [
      '[class*="skill"]',
      '[class*="tech"]',
      '[class*="technology"]',
      '[class*="stack"]',
      '[class*="tool"]'
    ];

    skillSelectors.forEach(selector => {
      $(selector).each((i, element) => {
        const text = $(element).text().toLowerCase().trim();
        if (text && text.length < 50) {
          skillKeywords.forEach(skill => {
            if (text.includes(skill)) {
              skills.add(skill);
            }
          });
        }
      });
    });

    return Array.from(skills);
  }

  extractExperience($) {
    const experience = [];
    
    const selectors = [
      '[class*="experience"]',
      '[class*="work"]',
      '[class*="job"]',
      '[class*="career"]',
      '[class*="employment"]'
    ];

    selectors.forEach(selector => {
      $(selector).each((i, element) => {
        const $element = $(element);
        const title = $element.find('[class*="title"], [class*="position"]').first().text().trim();
        const company = $element.find('[class*="company"], [class*="organization"]').first().text().trim();
        const description = $element.find('[class*="description"]').first().text().trim();
        
        if (title && company) {
          experience.push({
            title,
            company,
            description,
            type: 'public-profile'
          });
        }
      });
    });

    return experience.slice(0, 5);
  }

  extractEducation($) {
    const education = [];
    
    const selectors = [
      '[class*="education"]',
      '[class*="school"]',
      '[class*="university"]',
      '[class*="college"]',
      '[class*="degree"]'
    ];

    selectors.forEach(selector => {
      $(selector).each((i, element) => {
        const $element = $(element);
        const degree = $element.find('[class*="degree"]').first().text().trim();
        const school = $element.find('[class*="school"], [class*="university"]').first().text().trim();
        
        if (degree || school) {
          education.push({
            degree,
            school,
            type: 'public-profile'
          });
        }
      });
    });

    return education.slice(0, 3);
  }

  extractPortfolioProjects($, baseUrl) {
    const projects = [];
    
    const selectors = [
      '[class*="project"]',
      '[class*="portfolio"]',
      '[class*="work"]',
      '[class*="showcase"]'
    ];

    selectors.forEach(selector => {
      $(selector).each((i, element) => {
        const $element = $(element);
        const title = $element.find('[class*="title"], h3, h4').first().text().trim();
        const description = $element.find('[class*="description"], p').first().text().trim();
        const link = $element.find('a').first().attr('href');
        
        if (title) {
          projects.push({
            title,
            description,
            url: link ? (link.startsWith('http') ? link : new URL(link, baseUrl).href) : null,
            type: 'public-profile'
          });
        }
      });
    });

    return projects.slice(0, 10);
  }

  extractGithubUrl($, html) {
    const githubRegex = /https?:\/\/(?:www\.)?github\.com\/[\w-]+/g;
    const matches = html.match(githubRegex);
    return matches ? matches[0] : null;
  }

  extractLinkedinUrl($, html) {
    const linkedinRegex = /https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+/g;
    const matches = html.match(linkedinRegex);
    return matches ? matches[0] : null;
  }

  extractSocialLinks($) {
    const links = {};
    
    $('a[href]').each((i, element) => {
      const href = $(element).attr('href');
      const hostname = new URL(href).hostname.toLowerCase();
      
      if (hostname.includes('twitter.com')) {
        links.twitter = href;
      } else if (hostname.includes('linkedin.com')) {
        links.linkedin = href;
      } else if (hostname.includes('github.com')) {
        links.github = href;
      } else if (hostname.includes('medium.com')) {
        links.medium = href;
      } else if (hostname.includes('behance.net')) {
        links.behance = href;
      } else if (hostname.includes('dribbble.com')) {
        links.dribbble = href;
      }
    });

    return links;
  }

  calculateConfidenceScore($, html) {
    let score = 0.3; // Base score

    if (this.extractEmail($, html)) score += 0.2;
    if (this.extractBio($)) score += 0.1;
    if (this.extractLocation($)) score += 0.1;
    if (this.extractSkills($, html).length > 3) score += 0.1;
    if (this.extractExperience($).length > 0) score += 0.1;
    if (this.extractGithubUrl($, html)) score += 0.1;
    if (this.extractLinkedinUrl($, html)) score += 0.1;
    
    const textLength = html.length;
    if (textLength > 5000) score += 0.1;
    if (textLength > 10000) score += 0.1;

    return Math.min(score, 1.0);
  }

  parseProfiles(rawProfiles) {
    return rawProfiles
      .filter(profile => profile && (profile.name || profile.email))
      .map(profile => ({
        ...profile,
        sourceType: 'public-profile'
      }));
  }

  async testConnection() {
    try {
      const testUrl = 'https://github.com/torvalds';
      const profile = await this.extractProfileFromUrl(testUrl);
      
      return {
        success: !!profile,
        message: profile ? 'Public profile extraction working' : 'Failed to extract test profile',
        testProfile: profile ? {
          name: profile.name,
          email: profile.email,
          skills: profile.skills?.length || 0
        } : null
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default PublicProfileConnector;
