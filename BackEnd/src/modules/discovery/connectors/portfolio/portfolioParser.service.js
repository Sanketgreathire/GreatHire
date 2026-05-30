import * as cheerio from "cheerio";
import axios from "axios";

export class PortfolioParser {
  constructor() {
    this.selectors = {
      // Common selectors for portfolio elements
      name: [
        'h1',
        '.name',
        '.author',
        '.developer',
        '[class*="name"]',
        '[class*="title"]',
        'meta[name="author"]'
      ],
      title: [
        '.title',
        '.role',
        '.position',
        '.job-title',
        '[class*="title"]',
        '[class*="role"]'
      ],
      bio: [
        '.bio',
        '.about',
        '.description',
        '.summary',
        '.introduction',
        '[class*="bio"]',
        '[class*="about"]'
      ],
      skills: [
        '.skills',
        '.technologies',
        '.tech-stack',
        '.stack',
        '.expertise',
        '[class*="skill"]',
        '[class*="tech"]'
      ],
      projects: [
        '.projects',
        '.portfolio',
        '.work',
        '.showcase',
        '[class*="project"]',
        '[class*="portfolio"]'
      ],
      experience: [
        '.experience',
        '.work-history',
        '.employment',
        '.career',
        '[class*="experience"]',
        '[class*="work"]'
      ],
      education: [
        '.education',
        '.academic',
        '.degree',
        '.university',
        '[class*="education"]',
        '[class*="academic"]'
      ],
      contact: [
        '.contact',
        '.contact-info',
        '.connect',
        '[class*="contact"]',
        '[class*="connect"]'
      ],
      social: [
        '.social',
        '.social-links',
        '.links',
        '[class*="social"]',
        '[class*="link"]'
      ]
    };
  }

  async parsePortfolio(html, baseUrl) {
    try {
      const $ = cheerio.load(html);
      
      const portfolioData = {
        url: baseUrl,
        name: this.extractName($),
        title: this.extractTitle($),
        bio: this.extractBio($),
        skills: this.extractSkills($),
        projects: this.extractProjects($, baseUrl),
        experience: this.extractExperience($),
        education: this.extractEducation($),
        contact: this.extractContact($),
        social: this.extractSocial($),
        location: this.extractLocation($),
        metadata: this.extractMetadata($)
      };

      return portfolioData;
    } catch (error) {
      console.error('Error parsing portfolio:', error);
      throw error;
    }
  }

  extractName($) {
    for (const selector of this.selectors.name) {
      const element = $(selector).first();
      if (element.length > 0) {
        let name = element.text().trim();
        
        // Handle meta tags
        if (selector.includes('meta')) {
          name = element.attr('content') || '';
        }
        
        // Clean up the name
        name = name.replace(/[^a-zA-Z\s\-']/g, '').trim();
        
        if (name.length > 2 && name.length < 100) {
          return name;
        }
      }
    }
    
    // Try to extract from title tag
    const title = $('title').text().trim();
    if (title) {
      const nameMatch = title.match(/^([A-Za-z\s\-']+)/);
      if (nameMatch) {
        return nameMatch[1].trim();
      }
    }
    
    return null;
  }

  extractTitle($) {
    for (const selector of this.selectors.title) {
      const element = $(selector).first();
      if (element.length > 0) {
        const title = element.text().trim();
        if (title.length > 3 && title.length < 200) {
          return title;
        }
      }
    }
    
    // Try to infer from bio or about section
    const bio = this.extractBio($);
    if (bio) {
      const titlePatterns = [
        /(?:Software|Web|Full[-\s]?Stack|Front[-\s]?End|Back[-\s]?End|Mobile|DevOps|Data) (?:Developer|Engineer|Architect)/gi,
        /(?:Senior|Lead|Principal|Staff) (?:Software|Web|Developer|Engineer)/gi
      ];
      
      for (const pattern of titlePatterns) {
        const match = bio.match(pattern);
        if (match) {
          return match[0];
        }
      }
    }
    
    return null;
  }

  extractBio($) {
    for (const selector of this.selectors.bio) {
      const element = $(selector).first();
      if (element.length > 0) {
        const bio = element.text().trim();
        if (bio.length > 20 && bio.length < 1000) {
          return bio;
        }
      }
    }
    
    // Try to extract from meta description
    const metaDescription = $('meta[name="description"]').attr('content');
    if (metaDescription && metaDescription.length > 20) {
      return metaDescription;
    }
    
    return null;
  }

  extractSkills($) {
    const skills = new Set();
    
    for (const selector of this.selectors.skills) {
      $(selector).each((i, element) => {
        const $element = $(element);
        const text = $element.text().trim();
        
        // Extract skills from text
        const extractedSkills = this.parseSkillsFromText(text);
        extractedSkills.forEach(skill => skills.add(skill));
        
        // Extract from data attributes
        const dataSkills = $element.attr('data-skills') || $element.attr('data-tech');
        if (dataSkills) {
          dataSkills.split(',').forEach(skill => {
            skills.add(skill.trim().toLowerCase());
          });
        }
      });
    }
    
    return Array.from(skills);
  }

  parseSkillsFromText(text) {
    const skills = [];
    const skillPatterns = [
      // Programming languages
      /\b(javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|swift|kotlin|php|scala|elixir|haskell)\b/gi,
      // Frontend frameworks
      /\b(react|vue|angular|svelte|next\.js|nuxt\.js|gatsby|ember|backbone)\b/gi,
      // Backend frameworks
      /\b(express|django|flask|rails|spring|laravel|symfony|nest|fastapi|koa)\b/gi,
      // Databases
      /\b(mongodb|postgresql|mysql|redis|elasticsearch|cassandra|dynamodb|neo4j)\b/gi,
      // Cloud platforms
      /\b(aws|azure|gcp|google cloud|heroku|vercel|netlify|digitalocean)\b/gi,
      // DevOps tools
      /\b(docker|kubernetes|jenkins|gitlab|github actions|terraform|ansible)\b/gi,
      // Other technologies
      /\b(node\.js|npm|yarn|webpack|vite|babel|eslint|prettier|git|linux|unix)\b/gi
    ];
    
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => skills.add(match.toLowerCase()));
      }
    });
    
    return skills;
  }

  extractProjects($, baseUrl) {
    const projects = [];
    
    for (const selector of this.selectors.projects) {
      $(selector).children().each((i, element) => {
        const $project = $(element);
        const project = this.extractSingleProject($project, baseUrl);
        if (project) {
          projects.push(project);
        }
      });
    }
    
    // If no projects found, try to find individual project elements
    if (projects.length === 0) {
      $('.project, .portfolio-item, .work-item, .showcase-item').each((i, element) => {
        const $project = $(element);
        const project = this.extractSingleProject($project, baseUrl);
        if (project) {
          projects.push(project);
        }
      });
    }
    
    return projects;
  }

  extractSingleProject($project, baseUrl) {
    const project = {
      name: '',
      description: '',
      url: '',
      technologies: [],
      startDate: null,
      endDate: null,
      images: [],
      links: []
    };
    
    // Extract name
    const nameSelectors = ['h1', 'h2', 'h3', '.title', '.name', '[class*="title"]'];
    for (const selector of nameSelectors) {
      const nameElement = $project.find(selector).first();
      if (nameElement.length > 0) {
        project.name = nameElement.text().trim();
        break;
      }
    }
    
    // Extract description
    const descSelectors = ['.description', '.summary', '.about', 'p'];
    for (const selector of descSelectors) {
      const descElement = $project.find(selector).first();
      if (descElement.length > 0) {
        project.description = descElement.text().trim();
        break;
      }
    }
    
    // Extract URL
    const linkElement = $project.find('a').first();
    if (linkElement.length > 0) {
      project.url = this.resolveUrl(linkElement.attr('href'), baseUrl);
    }
    
    // Extract technologies
    const techElement = $project.find('.tech, .technologies, .skills, .stack');
    if (techElement.length > 0) {
      const techText = techElement.text().trim();
      project.technologies = this.parseSkillsFromText(techText);
    }
    
    // Extract images
    $project.find('img').each((i, img) => {
      const $img = $(img);
      const src = $img.attr('src');
      if (src) {
        project.images.push(this.resolveUrl(src, baseUrl));
      }
    });
    
    // Extract additional links
    $project.find('a').each((i, link) => {
      const $link = $(link);
      const href = $link.attr('href');
      const text = $link.text().trim();
      if (href && text) {
        project.links.push({
          text,
          url: this.resolveUrl(href, baseUrl)
        });
      }
    });
    
    // Only return project if it has a name
    return project.name ? project : null;
  }

  extractExperience($) {
    const experience = [];
    
    for (const selector of this.selectors.experience) {
      $(selector).children().each((i, element) => {
        const $exp = $(element);
        const exp = this.extractSingleExperience($exp);
        if (exp) {
          experience.push(exp);
        }
      });
    }
    
    return experience;
  }

  extractSingleExperience($exp) {
    const exp = {
      title: '',
      company: '',
      description: '',
      startDate: null,
      endDate: null,
      current: false
    };
    
    // Extract title
    const titleElement = $exp.find('.title, .role, .position').first();
    if (titleElement.length > 0) {
      exp.title = titleElement.text().trim();
    }
    
    // Extract company
    const companyElement = $exp.find('.company, .organization, .employer').first();
    if (companyElement.length > 0) {
      exp.company = companyElement.text().trim();
    }
    
    // Extract description
    const descElement = $exp.find('.description, .summary, .details').first();
    if (descElement.length > 0) {
      exp.description = descElement.text().trim();
    }
    
    // Extract dates
    const dateElement = $exp.find('.date, .period, .duration').first();
    if (dateElement.length > 0) {
      const dateText = dateElement.text().trim();
      const dates = this.parseDateRange(dateText);
      if (dates) {
        exp.startDate = dates.startDate;
        exp.endDate = dates.endDate;
        exp.current = dates.current;
      }
    }
    
    // Only return experience if it has a title
    return exp.title ? exp : null;
  }

  extractEducation($) {
    const education = [];
    
    for (const selector of this.selectors.education) {
      $(selector).children().each((i, element) => {
        const $edu = $(element);
        const edu = this.extractSingleEducation($edu);
        if (edu) {
          education.push(edu);
        }
      });
    }
    
    return education;
  }

  extractSingleEducation($edu) {
    const edu = {
      degree: '',
      institution: '',
      field: '',
      startDate: null,
      endDate: null
    };
    
    // Extract degree
    const degreeElement = $edu.find('.degree, .qualification').first();
    if (degreeElement.length > 0) {
      edu.degree = degreeElement.text().trim();
    }
    
    // Extract institution
    const instElement = $edu.find('.institution, .university, .school').first();
    if (instElement.length > 0) {
      edu.institution = instElement.text().trim();
    }
    
    // Extract field
    const fieldElement = $edu.find('.field, .major, .specialization').first();
    if (fieldElement.length > 0) {
      edu.field = fieldElement.text().trim();
    }
    
    // Extract dates
    const dateElement = $edu.find('.date, .period, .duration').first();
    if (dateElement.length > 0) {
      const dateText = dateElement.text().trim();
      const dates = this.parseDateRange(dateText);
      if (dates) {
        edu.startDate = dates.startDate;
        edu.endDate = dates.endDate;
      }
    }
    
    // Only return education if it has an institution
    return edu.institution ? edu : null;
  }

  extractContact($) {
    const contact = {};
    
    // Extract from contact section
    for (const selector of this.selectors.contact) {
      $(selector).each((i, element) => {
        const $contact = $(element);
        const text = $contact.text().trim();
        
        // Extract email
        const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
        if (emailMatch && !contact.email) {
          contact.email = emailMatch[0];
        }
        
        // Extract phone
        const phoneMatch = text.match(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g);
        if (phoneMatch && !contact.phone) {
          contact.phone = phoneMatch[0];
        }
        
        // Extract location
        const locationMatch = text.match(/(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
        if (locationMatch && !contact.location) {
          contact.location = locationMatch[0];
        }
      });
    }
    
    // Extract from links
    $('a[href^="mailto:"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && !contact.email) {
        contact.email = href.replace('mailto:', '');
      }
    });
    
    $('a[href^="tel:"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && !contact.phone) {
        contact.phone = href.replace('tel:', '');
      }
    });
    
    return Object.keys(contact).length > 0 ? contact : null;
  }

  extractSocial($) {
    const social = {};
    
    // Extract from social section
    for (const selector of this.selectors.social) {
      $(selector).find('a').each((i, element) => {
        const $link = $(element);
        const href = $link.attr('href');
        
        if (!href) return;
        
        // Extract different social platforms
        if (href.includes('linkedin.com') && !social.linkedin) {
          social.linkedin = href;
        } else if (href.includes('github.com') && !social.github) {
          social.github = href;
        } else if (href.includes('twitter.com') && !social.twitter) {
          social.twitter = href;
        } else if (href.includes('facebook.com') && !social.facebook) {
          social.facebook = href;
        } else if (href.includes('instagram.com') && !social.instagram) {
          social.instagram = href;
        } else if (href.includes('dribbble.com') && !social.dribbble) {
          social.dribbble = href;
        } else if (href.includes('behance.net') && !social.behance) {
          social.behance = href;
        }
      });
    }
    
    return Object.keys(social).length > 0 ? social : null;
  }

  extractLocation($) {
    // Try to extract location from various sources
    const locationSelectors = [
      '.location',
      '.address',
      '.city',
      '.region',
      '[class*="location"]',
      '[class*="address"]'
    ];
    
    for (const selector of locationSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        const location = element.text().trim();
        if (location.length > 2 && location.length < 100) {
          return location;
        }
      }
    }
    
    // Try to extract from meta tags
    const metaLocation = $('meta[name="geo.position"]').attr('content');
    if (metaLocation) {
      return metaLocation;
    }
    
    return null;
  }

  extractMetadata($) {
    const metadata = {};
    
    // Extract meta tags
    $('meta').each((i, element) => {
      const $meta = $(element);
      const name = $meta.attr('name') || $meta.attr('property');
      const content = $meta.attr('content');
      
      if (name && content) {
        metadata[name] = content;
      }
    });
    
    // Extract page title
    metadata.title = $('title').text().trim();
    
    // Extract language
    metadata.language = $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content');
    
    // Extract description
    metadata.description = $('meta[name="description"]').attr('content');
    
    // Extract keywords
    metadata.keywords = $('meta[name="keywords"]').attr('content');
    
    return metadata;
  }

  parseDateRange(dateText) {
    const datePatterns = [
      // Month Year - Month Year
      /(\w+\s+\d{4})\s*[-–—]\s*(\w+\s+\d{4}|present|current)/i,
      // Month Year - Present
      /(\w+\s+\d{4})\s*[-–—]\s*(present|current)/i,
      // Year - Year
      /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/i,
      // Month Year
      /(\w+\s+\d{4})/i,
      // Just year
      /(\d{4})/
    ];
    
    for (const pattern of datePatterns) {
      const match = dateText.match(pattern);
      if (match) {
        const startDate = this.parseDate(match[1]);
        const endDate = match[2] ? 
          (match[2].toLowerCase().includes('present') || match[2].toLowerCase().includes('current') ? 
            null : this.parseDate(match[2])) : null;
        
        return {
          startDate,
          endDate,
          current: !endDate
        };
      }
    }
    
    return null;
  }

  parseDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  }

  resolveUrl(url, baseUrl) {
    if (!url) return '';
    
    try {
      if (url.startsWith('http')) {
        return url;
      }
      
      const base = new URL(baseUrl);
      if (url.startsWith('/')) {
        return `${base.protocol}//${base.host}${url}`;
      } else {
        return `${baseUrl}/${url}`;
      }
    } catch (error) {
      return url;
    }
  }
}

export const portfolioParser = new PortfolioParser();
export default portfolioParser;
