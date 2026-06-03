import axios from "axios";
import { resumeParser } from "./resumeParser.service.js";
import { documentExtraction } from "./documentExtraction.service.js";
import { resumeNormalization } from "./resumeNormalization.service.js";
import { enqueueResumeDiscovery } from "../../workers/resumeDiscovery.worker.js";
import { SourceMetadata } from "../../../../models/sourceMetadata.model.js";
import { SourcingCandidate } from "../../../../../models/sourcing/sourcingCandidate.model.js";
import { ResumeCandidateMetadata } from "../../../../models/resumeCandidateMetadata.model.js";

export class ResumeDiscoveryService {
  constructor(config = {}) {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      maxRedirects: 5,
      downloadPath: './temp/resumes/',
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

  async discoverResumeUrls(options = {}) {
    const {
      queries = [],
      domains = [],
      limit = 100,
      searchEngine = 'google'
    } = options;

    this.stats.startTime = new Date();
    
    try {
      const resumeUrls = [];
      
      // Discover URLs from search queries
      if (queries.length > 0) {
        for (const query of queries) {
          const urls = await this.searchResumeUrls(query, Math.ceil((limit - resumeUrls.length) / queries.length));
          resumeUrls.push(...urls);
        }
      }

      // Discover URLs from specific domains
      if (domains.length > 0) {
        for (const domain of domains) {
          const urls = await this.exploreDomain(domain, Math.ceil((limit - resumeUrls.length) / domains.length));
          resumeUrls.push(...urls);
        }
      }

      // Remove duplicates and limit
      const uniqueUrls = [...new Set(resumeUrls)].slice(0, limit);
      
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
      
      console.error('Resume URL discovery error:', error);
      throw error;
    }
  }

  async searchResumeUrls(query, limit = 50) {
    try {
      const searchResults = await this.performSearch(query, limit);
      const resumeUrls = [];
      
      for (const result of searchResults) {
        if (this.isResumeUrl(result.url)) {
          resumeUrls.push(result.url);
        }
      }
      
      return resumeUrls;
    } catch (error) {
      console.error(`Error searching resume URLs for query "${query}":`, error);
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
      const resumeUrls = [];
      
      // Look for resume-related links
      const resumeSelectors = [
        'a[href*="resume"]',
        'a[href*="cv"]',
        'a[href*="vita"]',
        'a[href*="about"]',
        'a[href*="profile"]'
      ];
      
      resumeSelectors.forEach(selector => {
        $(selector).each((i, element) => {
          const href = $(element).attr('href');
          if (href && resumeUrls.length < limit) {
            const fullUrl = this.resolveUrl(href, baseUrl);
            if (fullUrl && this.isResumeUrl(fullUrl)) {
              resumeUrls.push(fullUrl);
            }
          }
        });
      });

      return resumeUrls;
    } catch (error) {
      console.error(`Error exploring domain ${domain}:`, error);
      return [];
    }
  }

  async downloadResume(url) {
    try {
      if (this.processedUrls.has(url)) {
        return null;
      }

      const response = await this.fetchUrl(url);
      
      if (!response) {
        return null;
      }

      const documentType = this.getDocumentType(url, response.headers);
      
      if (!this.isSupportedDocumentType(documentType)) {
        console.warn(`Unsupported document type: ${documentType} for URL: ${url}`);
        return null;
      }

      const fileName = this.generateFileName(url, documentType);
      const filePath = `${this.config.downloadPath}${fileName}`;
      
      // Save the document
      await this.saveDocument(response.data, filePath);
      
      this.processedUrls.add(url);
      this.stats.totalProcessed++;
      
      return {
        url,
        filePath,
        documentType,
        fileName,
        size: response.data.length,
        downloadTime: new Date()
      };
    } catch (error) {
      console.error(`Error downloading resume from ${url}:`, error);
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
        responseType: 'arraybuffer',
        validateStatus: (status) => status >= 200 && status < 400
      });

      return response;
    } catch (error) {
      console.error(`Error fetching URL ${url}:`, error.message);
      return null;
    }
  }

  getDocumentType(url, headers = {}) {
    const contentType = headers['content-type'] || '';
    const urlLower = url.toLowerCase();
    
    // Check content type first
    if (contentType.includes('application/pdf')) return 'pdf';
    if (contentType.includes('application/msword')) return 'doc';
    if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'docx';
    if (contentType.includes('text/plain')) return 'txt';
    
    // Check URL extension
    if (urlLower.endsWith('.pdf')) return 'pdf';
    if (urlLower.endsWith('.doc')) return 'doc';
    if (urlLower.endsWith('.docx')) return 'docx';
    if (urlLower.endsWith('.txt')) return 'txt';
    
    return 'unknown';
  }

  isSupportedDocumentType(documentType) {
    const supportedTypes = ['pdf', 'doc', 'docx', 'txt'];
    return supportedTypes.includes(documentType);
  }

  generateFileName(url, documentType) {
    const urlHash = this.hashUrl(url);
    const timestamp = Date.now();
    return `${urlHash}_${timestamp}.${documentType}`;
  }

  hashUrl(url) {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  async saveDocument(data, filePath) {
    const fs = require('fs').promises;
    const path = require('path');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, data);
  }

  async processResume(documentInfo) {
    try {
      // Extract text from document
      const extractedData = await documentExtraction.extractText(documentInfo.filePath, documentInfo.documentType);
      
      // Parse resume data
      const parsedData = await resumeParser.parseResume(extractedData.text, extractedData);
      
      // Normalize resume data
      const normalizedData = await resumeNormalization.normalizeResume(parsedData);
      
      // Calculate parsing confidence
      const parsingConfidence = this.calculateParsingConfidence(extractedData, parsedData, normalizedData);
      
      return {
        url: documentInfo.url,
        documentType: documentInfo.documentType,
        fileName: documentInfo.fileName,
        size: documentInfo.size,
        downloadTime: documentInfo.downloadTime,
        extractedData,
        parsedData,
        normalizedData,
        parsingConfidence,
        processingTime: new Date()
      };
    } catch (error) {
      console.error('Error processing resume:', error);
      throw error;
    }
  }

  calculateParsingConfidence(extractedData, parsedData, normalizedData) {
    let confidence = 0;
    const maxConfidence = 100;
    
    // Text extraction confidence
    if (extractedData.text && extractedData.text.length > 100) {
      confidence += 20;
    }
    
    // Structured sections confidence
    if (extractedData.sections && Object.keys(extractedData.sections).length > 2) {
      confidence += 15;
    }
    
    // Contact metadata confidence
    if (extractedData.contact && Object.keys(extractedData.contact).length > 0) {
      confidence += 10;
    }
    
    // Parsed data confidence
    if (parsedData.fullName) confidence += 15;
    if (parsedData.experience && parsedData.experience.length > 0) confidence += 10;
    if (parsedData.skills && parsedData.skills.length > 0) confidence += 10;
    if (parsedData.education && parsedData.education.length > 0) confidence += 10;
    
    // Normalized data confidence
    if (normalizedData.normalizedSkills && normalizedData.normalizedSkills.length > 0) confidence += 5;
    if (normalizedData.normalizedCompanies && normalizedData.normalizedCompanies.length > 0) confidence += 5;
    
    return Math.min(confidence, maxConfidence);
  }

  isResumeUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname.toLowerCase();
      
      // Common resume indicators
      const resumeIndicators = [
        'resume', 'resumes', 'cv', 'vita', 'vita', 'curriculum',
        'profile', 'about', 'bio', 'portfolio', 'credentials'
      ];
      
      const hasResumeIndicator = resumeIndicators.some(indicator => 
        pathname.includes(indicator) || hostname.includes(indicator)
      );
      
      // Check file extensions
      const resumeExtensions = ['.pdf', '.doc', '.docx', '.txt'];
      const hasResumeExtension = resumeExtensions.some(ext => pathname.endsWith(ext));
      
      // Common resume hosting platforms
      const resumePlatforms = [
        'linkedin.com/in/', 'indeed.com/resume', 'monster.com/resume',
        'glassdoor.com/profile', 'ziprecruiter.com/profile', 'resume.com'
      ];
      
      const isResumePlatform = resumePlatforms.some(platform => url.includes(platform));
      
      return hasResumeIndicator || hasResumeExtension || isResumePlatform;
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
        'software developer resume filetype:pdf',
        'web developer resume filetype:doc',
        'full stack developer resume filetype:docx',
        'frontend developer resume filetype:pdf',
        'backend developer resume filetype:pdf',
        'devops engineer resume filetype:pdf',
        'mobile developer resume filetype:pdf',
        'data scientist resume filetype:pdf'
      ],
      domains = [],
      limit = 100
    } = options;

    const results = [];
    
    // Discover URLs
    const discoveryResult = await this.discoverResumeUrls({ queries, domains, limit });
    
    // Process URLs in batches
    const batchSize = 10;
    for (let i = 0; i < discoveryResult.urls.length; i += batchSize) {
      const batch = discoveryResult.urls.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(url => this.downloadResume(url))
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
      totalDocuments: results.length,
      stats: this.stats
    };
  }

  async saveResumeProfile(resumeData) {
    try {
      // Check for existing candidate by resume URL
      const existingCandidate = await SourcingCandidate.findOne({
        resumeUrl: resumeData.url
      });

      if (existingCandidate) {
        // Update existing candidate
        await this.updateExistingCandidate(existingCandidate, resumeData);
        return existingCandidate;
      }

      // Create new candidate
      const candidate = new SourcingCandidate({
        name: resumeData.normalizedData.fullName,
        email: resumeData.normalizedData.email,
        location: resumeData.normalizedData.location,
        skills: resumeData.normalizedData.normalizedSkills,
        experience: resumeData.normalizedData.normalizedExperience,
        education: resumeData.normalizedData.normalizedEducation,
        certifications: resumeData.normalizedData.certifications,
        resumeUrl: resumeData.url,
        githubUrl: resumeData.normalizedData.socialLinks?.github,
        linkedinUrl: resumeData.normalizedData.socialLinks?.linkedin,
        source: 'resume-discovery',
        isActive: true,
        summary: resumeData.parsedData.summary,
        title: resumeData.parsedData.designation
      });

      const savedCandidate = await candidate.save();

      // Create resume metadata
      const resumeMetadata = new ResumeCandidateMetadata({
        candidateId: savedCandidate._id,
        documentUrl: resumeData.url,
        documentType: resumeData.documentType,
        parsedSections: resumeData.extractedData.sections,
        parsingConfidence: resumeData.parsingConfidence,
        ingestionMetadata: {
          downloadTime: resumeData.downloadTime,
          processingTime: resumeData.processingTime,
          documentSize: resumeData.size,
          fileName: resumeData.fileName
        },
        rawProfile: resumeData
      });

      await resumeMetadata.save();

      // Create source metadata
      const sourceMetadata = new SourceMetadata({
        sourceType: 'resume',
        sourceUrl: resumeData.url,
        fetchedAt: new Date(),
        ingestionStatus: 'completed',
        connectorName: 'resume-discovery',
        confidenceScore: resumeData.parsingConfidence / 100,
        candidateId: savedCandidate._id,
        profileData: {
          name: resumeData.normalizedData.fullName,
          email: resumeData.normalizedData.email,
          skills: resumeData.normalizedData.normalizedSkills,
          location: resumeData.normalizedData.location
        }
      });

      await sourceMetadata.save();

      this.stats.totalSaved++;
      return savedCandidate;
    } catch (error) {
      console.error('Error saving resume profile:', error);
      this.stats.totalErrors++;
      throw error;
    }
  }

  async updateExistingCandidate(candidate, resumeData) {
    // Merge skills
    const existingSkills = new Set(candidate.skills || []);
    const newSkills = resumeData.normalizedData.normalizedSkills || [];
    newSkills.forEach(skill => existingSkills.add(skill));
    candidate.skills = Array.from(existingSkills);

    // Update other fields
    if (resumeData.normalizedData.fullName && !candidate.name) candidate.name = resumeData.normalizedData.fullName;
    if (resumeData.normalizedData.email && !candidate.email) candidate.email = resumeData.normalizedData.email;
    if (resumeData.normalizedData.location && !candidate.location) candidate.location = resumeData.normalizedData.location;
    if (resumeData.parsedData.summary && (!candidate.summary || resumeData.parsedData.summary.length > candidate.summary.length)) {
      candidate.summary = resumeData.parsedData.summary;
    }

    await candidate.save();

    // Update resume metadata
    await ResumeCandidateMetadata.findOneAndUpdate(
      { candidateId: candidate._id },
      {
        documentUrl: resumeData.url,
        documentType: resumeData.documentType,
        parsedSections: resumeData.extractedData.sections,
        parsingConfidence: resumeData.parsingConfidence,
        ingestionMetadata: {
          downloadTime: resumeData.downloadTime,
          processingTime: resumeData.processingTime,
          documentSize: resumeData.size,
          fileName: resumeData.fileName
        },
        rawProfile: resumeData
      },
      { upsert: true }
    );

    return candidate;
  }

  async queueBulkDiscovery(options) {
    return await enqueueResumeDiscovery({
      type: 'bulk-discovery',
      options,
      timestamp: new Date().toISOString()
    });
  }

  async queueSingleDiscovery(url) {
    return await enqueueResumeDiscovery({
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

export const resumeDiscovery = new ResumeDiscoveryService();
export default resumeDiscovery;
