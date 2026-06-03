import axios from "axios";
import cheerio from "cherio";
import { portfolioParser } from "./portfolioParser.service.js";
import { projectAnalysis } from "./projectAnalysis.service.js";
import { technologyDetection } from "./technologyDetection.service.js";
import { enqueuePortfolioDiscovery } from "../../workers/portfolioDiscovery.worker.js";
import { SourceMetadata } from "../../../../models/sourceMetadata.model.js";
import { SourcingCandidate } from "../../../../../models/sourcing/sourcingCandidate.model.js";
import { PortfolioCandidateMetadata } from "../../../../models/portfolioCandidateMetadata.model.js";

export class PortfolioConnector {
  constructor(config = {}) {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      maxRedirects: 5,
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
    this.discoveredUrls = new Set();
    this.processedUrls = new Set();
  }

  async discoverPortfolioUrls(options = {}) {
    const {
      queries = [],
      domains = [],
      limit = 100,
      searchEngine = 'google'
    } = options;

    this.stats.startTime = new Date();
    
    try {
      const portfolioUrls = [];
      
      // Discover URLs from search queries
      if (queries.length > 0) {
        for (const query of queries) {
          const urls = await this.searchPortfolioUrls(query, Math.ceil((limit - portfolioUrls.length) / queries.length));
          portfolioUrls.push(...urls);
        }
      }

      // Discover URLs from specific domains
      if (domains.length > 0) {
        for (const domain of domains) {
          const urls = await this.exploreDomain(domain, Math.ceil((limit - portfolioUrls.length) / domains.length));
          portfolioUrls.push(...urls);
        }
      }

      // Remove duplicates and limit
      const uniqueUrls = [...new Set(portfolioUrls)].slice(0, limit);
      
      this.stats.endTime = new Date();
      this.stats.totalFetched = uniqueUrls.length;
      
      return {
        success: true,
        urls: uniqueUrls,
        stats: this.stats
      };
    } catch (error) {
      this.stats.endTime = new Date();
      this.stats.totalErrors++;
      
      console.error('Portfolio URL discovery error:', error);
      throw error;
    }
  }

  async searchPortfolioUrls(query, limit = 50) {
    try {
      const searchResults = await this.performSearch(query, limit);
      const portfolioUrls = [];
      
      for (const result of searchResults) {
        if (this.isPortfolioUrl(result.url)) {
          portfolioUrls.push(result.url);
        }
      }
      
      return portfolioUrls;
    } catch (error) {
      console.error(`Error searching portfolio URLs for query "${query}":`, error);
      return [];
    }
  }

  async performSearch(query, limit = 50) {
    // This would integrate with search APIs (Google, Bing, DuckDuckGo)
    // For now, return placeholder results
    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${limit}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': this.config.userAgent
        },
        timeout: this.config.timeout
      });

      const $ = cheerio.load(response.data);
      const results = [];
      
      $('div.g a[href]').each((i, element) => {
        const href = $(element).attr('href');
        if (href && href.startsWith('/url?q=')) {
          const url = href.split('/url?q=')[1].split('&sa=')[0];
          const title = $(element).text().trim();
          
          if (url && title) {
            results.push({
              url: decodeURIComponent(url),
              title,
              snippet: $(element).parent().next().text().trim()
            });
          }
        }
      });

      return results.slice(0, limit);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async exploreDomain(domain, limit = 20) {
    try {
      const baseUrl = `https://${domain}`;
      const response = await this.fetchUrl(baseUrl);
      
      if (!response) return [];
      
      const $ = cheerio.load(response.data);
      const portfolioUrls = [];
      
      // Look for portfolio-related links
      const portfolioSelectors = [
        'a[href*="portfolio"]',
        'a[href*="projects"]',
        'a[href*="work"]',
        'a[href*="about"]',
        'a[href*="resume"]',
        'a[href*="cv"]'
      ];
      
      portfolioSelectors.forEach(selector => {
        $(selector).each((i, element) => {
          const href = $(element).attr('href');
          if (href && portfolioUrls.length < limit) {
            const fullUrl = this.resolveUrl(href, baseUrl);
            if (fullUrl && this.isPortfolioUrl(fullUrl)) {
              portfolioUrls.push(fullUrl);
            }
          }
        });
      });

      return portfolioUrls;
    } catch (error) {
      console.error(`Error exploring domain ${domain}:`, error);
      return [];
    }
  }

  async crawlPortfolioUrl(url) {
    try {
      if (this.processedUrls.has(url)) {
        return null;
      }

      const response = await this.fetchUrl(url);
      
      if (!response) {
        return null;
      }

      const portfolioData = await this.parsePortfolioPage(response.data, url);
      
      this.processedUrls.add(url);
      this.stats.totalProcessed++;
      
      return portfolioData;
    } catch (error) {
      console.error(`Error crawling portfolio URL ${url}:`, error);
      this.stats.totalErrors++;
      return null;
    }
  }

  async fetchUrl(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.config.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        },
        timeout: this.config.timeout,
        maxRedirects: this.config.maxRedirects,
        validateStatus: (status) => status >= 200 && status < 400
      });

      return response;
    } catch (error) {
      console.error(`Error fetching URL ${url}:`, error.message);
      return null;
    }
  }

  async parsePortfolioPage(html, baseUrl) {
    try {
      const parsedData = await portfolioParser.parsePortfolio(html, baseUrl);
      
      // Analyze projects
      if (parsedData.projects) {
        parsedData.projects = await Promise.all(
          parsedData.projects.map(async (project) => {
            const analysis = await projectAnalysis.analyzeProject(project, baseUrl);
            const technologies = await technologyDetection.detectTechnologies(project, baseUrl);
            
            return {
              ...project,
              analysis,
              technologies
            };
          })
        );
      }

      // Detect technologies from the entire page
      parsedData.detectedTechnologies = await technologyDetection.detectTechnologies(
        { html, projects: parsedData.projects || [] },
        baseUrl
      );

      // Calculate portfolio scores
      parsedData.portfolioScore = this.calculatePortfolioScore(parsedData);
      parsedData.engineeringSignals = this.calculateEngineeringSignals(parsedData);

      return parsedData;
    } catch (error) {
      console.error('Error parsing portfolio page:', error);
      throw error;
    }
  }

  calculatePortfolioScore(portfolioData) {
    let score = 0;
    const maxScore = 100;

    // Project diversity (0-25 points)
    const projectCount = portfolioData.projects?.length || 0;
    score += Math.min(projectCount * 3, 25);

    // Technical depth (0-20 points)
    const techCount = portfolioData.detectedTechnologies?.all?.length || 0;
    score += Math.min(techCount * 2, 20);

    // Quality indicators (0-20 points)
    if (portfolioData.contact?.email) score += 5;
    if (portfolioData.contact?.linkedin) score += 5;
    if (portfolioData.contact?.github) score += 5;
    if (portfolioData.bio && portfolioData.bio.length > 100) score += 5;

    // Professional presentation (0-15 points)
    if (portfolioData.name) score += 5;
    if (portfolioData.title) score += 5;
    if (portfolioData.experience?.length > 0) score += 5;

    // Innovation and complexity (0-20 points)
    const avgComplexity = portfolioData.projects?.reduce((sum, p) => sum + (p.analysis?.complexity || 0), 0) / (portfolioData.projects?.length || 1) || 0;
    score += Math.min(avgComplexity * 4, 20);

    return Math.min(score, maxScore);
  }

  calculateEngineeringSignals(portfolioData) {
    return {
      fullStack: this.isFullStackDeveloper(portfolioData),
      seniority: this.estimateSeniority(portfolioData),
      specialization: this.identifySpecialization(portfolioData),
      technicalLeadership: this.hasTechnicalLeadership(portfolioData),
      innovationScore: this.calculateInnovationScore(portfolioData),
      collaborationSkills: this.assessCollaborationSkills(portfolioData)
    };
  }

  isFullStackDeveloper(portfolioData) {
    const frontendTech = portfolioData.detectedTechnologies?.frontend || [];
    const backendTech = portfolioData.detectedTechnologies?.backend || [];
    
    return frontendTech.length > 0 && backendTech.length > 0;
  }

  estimateSeniority(portfolioData) {
    let seniorityScore = 0;
    
    // Project complexity
    const avgComplexity = portfolioData.projects?.reduce((sum, p) => sum + (p.analysis?.complexity || 0), 0) / (portfolioData.projects?.length || 1) || 0;
    seniorityScore += avgComplexity * 10;
    
    // Technology diversity
    const techCount = portfolioData.detectedTechnologies?.all?.length || 0;
    seniorityScore += Math.min(techCount * 2, 20);
    
    // Professional indicators
    if (portfolioData.experience?.length > 0) seniorityScore += 15;
    if (portfolioData.title?.toLowerCase().includes('senior')) seniorityScore += 10;
    if (portfolioData.title?.toLowerCase().includes('lead')) seniorityScore += 15;
    
    if (seniorityScore >= 70) return 'senior';
    if (seniorityScore >= 40) return 'mid';
    return 'junior';
  }

  identifySpecialization(portfolioData) {
    const tech = portfolioData.detectedTechnologies || {};
    const specializations = [];
    
    if (tech.frontend?.length > 3) specializations.push('frontend');
    if (tech.backend?.length > 3) specializations.push('backend');
    if (tech.cloud?.length > 0) specializations.push('cloud');
    if (tech.devops?.length > 0) specializations.push('devops');
    if (tech.ai_ml?.length > 0) specializations.push('ai_ml');
    if (tech.mobile?.length > 0) specializations.push('mobile');
    
    if (specializations.includes('frontend') && specializations.includes('backend')) {
      specializations.push('full_stack');
    }
    
    return specializations;
  }

  hasTechnicalLeadership(portfolioData) {
    const leadershipIndicators = [
      portfolioData.title?.toLowerCase().includes('lead'),
      portfolioData.title?.toLowerCase().includes('architect'),
      portfolioData.title?.toLowerCase().includes('manager'),
      portfolioData.projects?.some(p => p.analysis?.teamSize > 1),
      portfolioData.projects?.some(p => p.description?.toLowerCase().includes('led'))
    ];
    
    return leadershipIndicators.filter(Boolean).length >= 2;
  }

  calculateInnovationScore(portfolioData) {
    let innovationScore = 0;
    
    portfolioData.projects?.forEach(project => {
      const innovation = project.analysis?.innovation || 0;
      innovationScore += innovation;
    });
    
    return portfolioData.projects?.length > 0 ? innovationScore / portfolioData.projects.length : 0;
  }

  assessCollaborationSkills(portfolioData) {
    const collaborationIndicators = [
      portfolioData.contact?.github,
      portfolioData.contact?.linkedin,
      portfolioData.projects?.some(p => p.description?.toLowerCase().includes('team')),
      portfolioData.projects?.some(p => p.description?.toLowerCase().includes('collaborat'))
    ];
    
    return collaborationIndicators.filter(Boolean).length;
  }

  isPortfolioUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname.toLowerCase();
      
      // Common portfolio indicators
      const portfolioIndicators = [
        'portfolio', 'portfolios', 'work', 'projects', 'project', 'about', 'me',
        'personal', 'website', 'site', 'dev', 'developer', 'engineer'
      ];
      
      const hasPortfolioIndicator = portfolioIndicators.some(indicator => 
        pathname.includes(indicator) || hostname.includes(indicator)
      );
      
      // Exclude non-portfolio domains
      const excludedDomains = [
        'linkedin.com', 'facebook.com', 'twitter.com', 'instagram.com',
        'youtube.com', 'tiktok.com', 'reddit.com', 'medium.com'
      ];
      
      const isExcluded = excludedDomains.some(domain => hostname.includes(domain));
      
      return hasPortfolioIndicator && !isExcluded;
    } catch (error) {
      return false;
    }
  }

  resolveUrl(url, baseUrl) {
    try {
      if (url.startsWith('http')) {
        return url;
      }
      
      const baseObj = new URL(baseUrl);
      if (url.startsWith('/')) {
        return `${baseObj.protocol}//${baseObj.host}${url}`;
      } else {
        return `${baseUrl}/${url}`;
      }
    } catch (error) {
      return null;
    }
  }

  async bulkDiscover(options = {}) {
    const {
      queries = [
        'software developer portfolio',
        'web developer portfolio',
        'full stack developer portfolio',
        'frontend developer portfolio',
        'backend developer portfolio',
        'devops engineer portfolio',
        'mobile developer portfolio',
        'data scientist portfolio'
      ],
      domains = [],
      limit = 100
    } = options;

    const results = [];
    
    // Discover URLs
    const discoveryResult = await this.discoverPortfolioUrls({ queries, domains, limit });
    
    // Process URLs in batches
    const batchSize = 10;
    for (let i = 0; i < discoveryResult.urls.length; i += batchSize) {
      const batch = discoveryResult.urls.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(url => this.crawlPortfolioUrl(url))
      );
      
      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        }
      });
      
      // Add delay between batches
      if (i + batchSize < discoveryResult.urls.length) {
        await this.sleep(1000);
      }
    }

    return {
      success: true,
      results,
      totalProfiles: results.length,
      stats: this.stats
    };
  }

  async savePortfolioProfile(portfolioData) {
    try {
      // Check for existing candidate by portfolio URL
      const existingCandidate = await SourcingCandidate.findOne({
        portfolioUrl: portfolioData.url
      });

      if (existingCandidate) {
        // Update existing candidate
        await this.updateExistingCandidate(existingCandidate, portfolioData);
        return existingCandidate;
      }

      // Create new candidate
      const candidate = new SourcingCandidate({
        name: portfolioData.name,
        email: portfolioData.contact?.email,
        location: portfolioData.location,
        skills: portfolioData.detectedTechnologies?.all || [],
        experience: portfolioData.experience || [],
        education: portfolioData.education || [],
        portfolio: portfolioData.projects || [],
        portfolioUrl: portfolioData.url,
        githubUrl: portfolioData.contact?.github,
        linkedinUrl: portfolioData.contact?.linkedin,
        resumeUrl: portfolioData.contact?.resume,
        source: 'portfolio-discovery',
        isActive: true,
        summary: portfolioData.bio,
        title: portfolioData.title
      });

      const savedCandidate = await candidate.save();

      // Create portfolio metadata
      const portfolioMetadata = new PortfolioCandidateMetadata({
        candidateId: savedCandidate._id,
        portfolioUrl: portfolioData.url,
        detectedTechnologies: portfolioData.detectedTechnologies,
        projectInsights: portfolioData.projects?.map(p => p.analysis) || [],
        portfolioScore: portfolioData.portfolioScore,
        engineeringSignals: portfolioData.engineeringSignals,
        rawProfile: portfolioData
      });

      await portfolioMetadata.save();

      // Create source metadata
      const sourceMetadata = new SourceMetadata({
        sourceType: 'portfolio',
        sourceUrl: portfolioData.url,
        fetchedAt: new Date(),
        ingestionStatus: 'completed',
        connectorName: 'portfolio-discovery',
        confidenceScore: portfolioData.portfolioScore / 100,
        candidateId: savedCandidate._id,
        profileData: {
          name: portfolioData.name,
          email: portfolioData.contact?.email,
          skills: portfolioData.detectedTechnologies?.all,
          location: portfolioData.location
        }
      });

      await sourceMetadata.save();

      this.stats.totalSaved++;
      return savedCandidate;
    } catch (error) {
      console.error('Error saving portfolio profile:', error);
      this.stats.totalErrors++;
      throw error;
    }
  }

  async updateExistingCandidate(candidate, portfolioData) {
    // Merge skills
    const existingSkills = new Set(candidate.skills || []);
    const newSkills = portfolioData.detectedTechnologies?.all || [];
    newSkills.forEach(skill => existingSkills.add(skill));
    candidate.skills = Array.from(existingSkills);

    // Update other fields
    if (portfolioData.name && !candidate.name) candidate.name = portfolioData.name;
    if (portfolioData.contact?.email && !candidate.email) candidate.email = portfolioData.contact?.email;
    if (portfolioData.location && !candidate.location) candidate.location = portfolioData.location;
    if (portfolioData.bio && (!candidate.summary || portfolioData.bio.length > candidate.summary.length)) {
      candidate.summary = portfolioData.bio;
    }

    await candidate.save();

    // Update portfolio metadata
    await PortfolioCandidateMetadata.findOneAndUpdate(
      { candidateId: candidate._id },
      {
        detectedTechnologies: portfolioData.detectedTechnologies,
        projectInsights: portfolioData.projects?.map(p => p.analysis) || [],
        portfolioScore: portfolioData.portfolioScore,
        engineeringSignals: portfolioData.engineeringSignals,
        rawProfile: portfolioData
      },
      { upsert: true }
    );

    return candidate;
  }

  async queueBulkDiscovery(options) {
    return await enqueuePortfolioDiscovery({
      type: 'bulk-discovery',
      options,
      timestamp: new Date().toISOString()
    });
  }

  async queueSingleDiscovery(url) {
    return await enqueuePortfolioDiscovery({
      type: 'single-discovery',
      url,
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
    this.discoveredUrls.clear();
    this.processedUrls.clear();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const portfolioConnector = new PortfolioConnector();
export default portfolioConnector;
