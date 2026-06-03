import { SourceConnector } from "../sourceConnector.service.js";
import axios from "axios";
import * as cheerio from "cheerio";
import pdfParse from "pdf-parse";

export class ResumeUrlConnector extends SourceConnector {
  constructor(config = {}) {
    super('resume-url', config);
    this.resumePlatforms = [
      'linkedin.com/in/',
      'drive.google.com/file/d/',
      'docs.google.com/document/d/',
      'dropbox.com/s/',
      'icloud.com/key/',
      'onedrive.live.com/',
      'notion.so/',
      'medium.com/',
      'github.com/',
      'gitlab.com/',
      'bitbucket.org/'
    ];
    this.fileExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
    this.resumeKeywords = [
      'resume', 'cv', 'curriculum vitae', 'bio', 'about me',
      'experience', 'skills', 'education', 'portfolio', 'projects'
    ];
  }

  async fetchProfiles(options = {}) {
    const { limit = 25, urls = [] } = options;
    
    try {
      const profiles = [];
      const resumeUrls = urls.length > 0 ? urls : await this.searchResumeUrls(limit);
      
      for (const resumeUrl of resumeUrls) {
        if (profiles.length >= limit) break;
        
        try {
          const profile = await this.extractProfileFromResumeUrl(resumeUrl);
          if (profile) {
            profiles.push(profile);
          }
        } catch (error) {
          console.error(`Error extracting profile from ${resumeUrl}:`, error);
        }
      }
      
      return profiles;
    } catch (error) {
      console.error("Error fetching resume URLs:", error);
      throw error;
    }
  }

  async searchResumeUrls(limit = 25) {
    const searchQueries = [
      'software engineer resume filetype:pdf',
      'full stack developer cv site:linkedin.com/in/',
      'frontend developer resume site:drive.google.com',
      'backend developer cv site:github.com',
      'devops engineer resume site:medium.com',
      'machine learning engineer cv site:notion.so',
      'data scientist resume site:dropbox.com',
      'react developer cv site:docs.google.com',
      'node.js developer resume site:onedrive.live.com',
      'python developer resume site:icloud.com'
    ];

    const urls = [];
    
    for (const query of searchQueries) {
      if (urls.length >= limit) break;
      
      try {
        const searchResults = await this.searchGoogle(query, Math.ceil((limit - urls.length) / searchQueries.length));
        urls.push(...searchResults);
      } catch (error) {
        console.error(`Error searching for "${query}":`, error);
      }
    }
    
    return urls.slice(0, limit);
  }

  async searchGoogle(query, limit = 5) {
    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${limit}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const urls = this.extractUrlsFromSearchResults(response.data);
      return urls.filter(url => this.isValidResumeUrl(url));
    } catch (error) {
      console.error("Error searching Google:", error);
      return [];
    }
  }

  extractUrlsFromSearchResults(html) {
    const $ = cheerio.load(html);
    const urls = [];
    
    $('div.g a[href]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/url?q=')) {
        const url = href.split('/url?q=')[1].split('&sa=')[0];
        urls.push(decodeURIComponent(url));
      }
    });
    
    return urls;
  }

  isValidResumeUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname.toLowerCase();
      
      const isResumePlatform = this.resumePlatforms.some(platform => 
        hostname.includes(platform) || pathname.includes(platform)
      );
      
      const hasResumeKeywords = this.resumeKeywords.some(keyword => 
        pathname.includes(keyword) || url.includes(keyword)
      );
      
      const hasResumeExtension = this.fileExtensions.some(ext => 
        pathname.endsWith(ext) || url.toLowerCase().endsWith(ext)
      );
      
      return isResumePlatform || hasResumeKeywords || hasResumeExtension;
    } catch (error) {
      return false;
    }
  }

  async extractProfileFromResumeUrl(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000,
        responseType: 'arraybuffer'
      });

      const contentType = response.headers['content-type'];
      let profile;

      if (contentType && contentType.includes('application/pdf')) {
        profile = await this.extractFromPDF(response.data, url);
      } else if (contentType && (contentType.includes('application/msword') || contentType.includes('application/vnd.openxmlformats-officedocument'))) {
        profile = await this.extractFromDocument(response.data, url);
      } else {
        const text = response.data.toString('utf8');
        profile = await this.extractFromText(text, url);
      }

      return profile;
    } catch (error) {
      console.error(`Error extracting profile from resume URL ${url}:`, error);
      return null;
    }
  }

  async extractFromPDF(buffer, url) {
    try {
      const data = await pdfParse(buffer);
      const text = data.text;
      return await this.extractFromText(text, url);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      return null;
    }
  }

  async extractFromDocument(buffer, url) {
    try {
      const text = buffer.toString('utf8');
      return await this.extractFromText(text, url);
    } catch (error) {
      console.error("Error parsing document:", error);
      return null;
    }
  }

  async extractFromText(text, url) {
    const profile = {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      location: this.extractLocation(text),
      summary: this.extractSummary(text),
      skills: this.extractSkills(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      portfolio: this.extractPortfolio(text),
      githubUrl: this.extractGithubUrl(text),
      linkedinUrl: this.extractLinkedinUrl(text),
      resumeUrl: url,
      sourceUrl: url,
      confidenceScore: this.calculateConfidenceScore(text),
      rawProfile: {
        text,
        url
      }
    };

    return profile.name || profile.email ? profile : null;
  }

  extractName(text) {
    const namePatterns = [
      /^(.+?)\s+(?:email|phone|address|location)/mi,
      /(?:name|full name):\s*(.+?)(?:\n|$)/mi,
      /^(.+?)\s+\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/mi,
      /^(.+?)\s+[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/mi
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        if (name.length > 2 && name.length < 50 && /^[A-Za-z\s\-']+$/.test(name)) {
          return name;
        }
      }
    }

    return null;
  }

  extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
  }

  extractPhone(text) {
    const phonePatterns = [
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      /\b\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      /\b\(\d{3}\)\s*\d{3}[-.\s]?\d{4}\b/g
    ];

    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  extractLocation(text) {
    const locationPatterns = [
      /(?:location|address):\s*(.+?)(?:\n|$)/mi,
      /(?:city|state|country):\s*(.+?)(?:\n|$)/mi,
      /(?:based in|located in):\s*(.+?)(?:\n|$)/mi
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    const cityStateRegex = /\b([A-Z][a-z\s]+),\s*([A-Z]{2})\b/;
    const match = text.match(cityStateRegex);
    if (match) {
      return `${match[1]}, ${match[2]}`;
    }

    return null;
  }

  extractSummary(text) {
    const summaryPatterns = [
      /(?:summary|about|profile|objective):\s*(.+?)(?:\n\s*\n|\n[A-Z]|\n\d)/mis,
      /(?:professional summary|career summary):\s*(.+?)(?:\n\s*\n|\n[A-Z]|\n\d)/mis
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }

    const firstParagraph = text.split('\n\n')[0];
    if (firstParagraph.length > 50 && firstParagraph.length < 500) {
      return firstParagraph.trim();
    }

    return null;
  }

  extractSkills(text) {
    const skills = new Set();
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
      'testing', 'jest', 'mocha', 'cypress', 'selenium',
      'git', 'github', 'gitlab', 'bitbucket', 'agile', 'scrum'
    ];

    const textLower = text.toLowerCase();
    
    skillKeywords.forEach(skill => {
      if (textLower.includes(skill)) {
        skills.add(skill);
      }
    });

    const skillsSection = text.match(/(?:skills|technical skills|technologies|stack):\s*(.+?)(?:\n\n|\n[A-Z]|\n\d)/mis);
    if (skillsSection && skillsSection[1]) {
      const skillsText = skillsSection[1];
      skillKeywords.forEach(skill => {
        if (skillsText.toLowerCase().includes(skill)) {
          skills.add(skill);
        }
      });
    }

    return Array.from(skills);
  }

  extractExperience(text) {
    const experience = [];
    const experienceSection = text.match(/(?:experience|work experience|professional experience|employment):\s*(.+?)(?:\n\n|\n[A-Z]|\n\d)/mis);
    
    if (experienceSection && experienceSection[1]) {
      const experienceText = experienceSection[1];
      const jobEntries = experienceText.split(/\n\n+/);
      
      jobEntries.forEach(entry => {
        const lines = entry.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          const titleLine = lines[0];
          const companyLine = lines[1];
          
          const title = this.extractJobTitle(titleLine);
          const company = this.extractCompany(companyLine);
          const dates = this.extractDates(titleLine + ' ' + companyLine);
          
          if (title && company) {
            experience.push({
              title,
              company,
              startDate: dates.start,
              endDate: dates.end,
              current: dates.current,
              description: lines.slice(2).join(' ').trim(),
              type: 'resume'
            });
          }
        }
      });
    }

    return experience.slice(0, 5);
  }

  extractJobTitle(text) {
    const titleKeywords = [
      'software engineer', 'developer', 'programmer', 'full stack', 'frontend',
      'backend', 'devops', 'sre', 'machine learning', 'data scientist',
      'analyst', 'architect', 'lead', 'senior', 'junior', 'principal'
    ];

    for (const keyword of titleKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        const match = text.match(/(.+?)(?:\s+at|\s+@|\s*\(|\s*\n)/);
        if (match) {
          return match[1].trim();
        }
      }
    }

    return null;
  }

  extractCompany(text) {
    const atPattern = /(?:at|@)\s*(.+?)(?:\s*\(|\s*\n|\s*\d)/;
    const match = text.match(atPattern);
    return match ? match[1].trim() : null;
  }

  extractDates(text) {
    const datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})/,
      /(\w+\s+\d{4})\s*-\s*(\w+\s+\d{4})/,
      /(\w+\s+\d{4})\s*-\s*(present|current)/,
      /(\d{4})\s*-\s*(\d{4})/
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        return {
          start: match[1],
          end: match[2] === 'present' || match[2] === 'current' ? null : match[2],
          current: match[2] === 'present' || match[2] === 'current'
        };
      }
    }

    return { start: null, end: null, current: false };
  }

  extractEducation(text) {
    const education = [];
    const educationSection = text.match(/(?:education|academic|qualification):\s*(.+?)(?:\n\n|\n[A-Z]|\n\d)/mis);
    
    if (educationSection && educationSection[1]) {
      const educationText = educationSection[1];
      const educationEntries = educationText.split(/\n\n+/);
      
      educationEntries.forEach(entry => {
        const lines = entry.split('\n').filter(line => line.trim());
        if (lines.length >= 1) {
          const degree = this.extractDegree(lines[0]);
          const school = this.extractSchool(lines[0] + ' ' + (lines[1] || ''));
          const dates = this.extractDates(lines[0] + ' ' + (lines[1] || ''));
          
          if (degree || school) {
            education.push({
              degree,
              school,
              startDate: dates.start,
              endDate: dates.end,
              type: 'resume'
            });
          }
        }
      });
    }

    return education.slice(0, 3);
  }

  extractDegree(text) {
    const degreeKeywords = [
      'bachelor', 'master', 'phd', 'doctorate', 'associate', 'certificate',
      'bs', 'ms', 'ba', 'ma', 'b.s.', 'm.s.', 'b.a.', 'm.a.',
      'computer science', 'engineering', 'information technology'
    ];

    for (const keyword of degreeKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        const match = text.match(/(.+?)(?:\s+at|\s+@|\s*\(|\s*\n)/);
        if (match) {
          return match[1].trim();
        }
      }
    }

    return null;
  }

  extractSchool(text) {
    const schoolKeywords = ['university', 'college', 'institute', 'school'];
    for (const keyword of schoolKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        const match = text.match(/(.+?)(?:\s*\(|\s*\n|\s*\d)/);
        if (match) {
          return match[1].trim();
        }
      }
    }
    return null;
  }

  extractPortfolio(text) {
    const portfolio = [];
    const portfolioSection = text.match(/(?:projects|portfolio|work):\s*(.+?)(?:\n\n|\n[A-Z]|\n\d)/mis);
    
    if (portfolioSection && portfolioSection[1]) {
      const portfolioText = portfolioSection[1];
      const projects = portfolioText.split(/\n\n+/);
      
      projects.forEach(project => {
        const lines = project.split('\n').filter(line => line.trim());
        if (lines.length >= 1) {
          const title = lines[0].trim();
          const description = lines.slice(1).join(' ').trim();
          
          if (title) {
            portfolio.push({
              title,
              description,
              type: 'resume'
            });
          }
        }
      });
    }

    return portfolio.slice(0, 10);
  }

  extractGithubUrl(text) {
    const githubRegex = /https?:\/\/(?:www\.)?github\.com\/[\w-]+/g;
    const matches = text.match(githubRegex);
    return matches ? matches[0] : null;
  }

  extractLinkedinUrl(text) {
    const linkedinRegex = /https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+/g;
    const matches = text.match(linkedinRegex);
    return matches ? matches[0] : null;
  }

  calculateConfidenceScore(text) {
    let score = 0.3; // Base score

    if (this.extractEmail(text)) score += 0.2;
    if (this.extractPhone(text)) score += 0.1;
    if (this.extractLocation(text)) score += 0.1;
    if (this.extractSkills(text).length > 3) score += 0.1;
    if (this.extractExperience(text).length > 0) score += 0.1;
    if (this.extractEducation(text).length > 0) score += 0.1;
    if (this.extractGithubUrl(text)) score += 0.05;
    if (this.extractLinkedinUrl(text)) score += 0.05;
    
    const textLength = text.length;
    if (textLength > 1000) score += 0.1;
    if (textLength > 2000) score += 0.1;

    return Math.min(score, 1.0);
  }

  parseProfiles(rawProfiles) {
    return rawProfiles
      .filter(profile => profile && (profile.name || profile.email))
      .map(profile => ({
        ...profile,
        sourceType: 'resume-url'
      }));
  }

  async testConnection() {
    try {
      const testText = `
John Doe
Email: john.doe@example.com
Phone: (555) 123-4567
Location: San Francisco, CA

Summary
Experienced software engineer with 5+ years of experience in full-stack development.

Skills
JavaScript, React, Node.js, Python, AWS, Docker

Experience
Software Engineer at Tech Company (2020-Present)
- Developed web applications using React and Node.js
- Implemented CI/CD pipelines using Docker and Jenkins

Education
Bachelor of Science in Computer Science
University of California, Berkeley (2016-2020)
      `;

      const profile = await this.extractFromText(testText, 'test://resume');
      
      return {
        success: !!profile,
        message: profile ? 'Resume parsing working' : 'Failed to parse test resume',
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

export default ResumeUrlConnector;
