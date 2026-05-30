import { kafkaConsumerService } from './kafkaConsumer.service.js';
import { ingestionEventPublisherService } from './ingestionEventPublisher.service.js';
import { SourcingCandidate } from '../../../../models/sourcing/sourcingCandidate.model.js';
import { eventBusService } from './eventBus.service.js';
import { v4 as uuidv4 } from 'uuid';

export class EnrichmentEventHandlerService {
  constructor() {
    this.consumerId = null;
    this.topics = [
      'candidate.enrichment',
      'candidate.created'
    ];
    this.processingStats = {
      enriched: 0,
      processed: 0,
      failed: 0,
      processingTime: []
    };
  }

  async initialize() {
    try {
      this.consumerId = await kafkaConsumerService.createConsumer(
        'enrichment-event-handler-group',
        {
          maxWaitTimeInMs: 5000,
          maxPollRecords: 50
        }
      );

      await kafkaConsumerService.subscribe(
        this.consumerId,
        this.topics,
        this.handleEvent.bind(this),
        {
          concurrency: 10,
          partitionsConsumedConcurrently: true
        }
      );

      // Subscribe to local event bus for integration
      await this.subscribeToEventBus();

      console.log('Enrichment event handler initialized');
      console.log(`Consumer ID: ${this.consumerId}`);
      console.log(`Subscribed to topics: ${this.topics.join(', ')}`);

    } catch (error) {
      console.error('Failed to initialize enrichment event handler:', error);
      throw error;
    }
  }

  async handleEvent(event) {
    const startTime = Date.now();
    
    try {
      console.log(`Processing enrichment event: ${event.type}`, {
        eventId: event.id,
        correlationId: event.metadata.correlationId
      });

      switch (event.type) {
        case 'candidate.created':
          await this.handleCandidateCreated(event);
          break;
          
        case 'candidate.enriched':
          await this.handleCandidateEnriched(event);
          break;
          
        default:
          console.warn(`Unknown event type: ${event.type}`);
      }

      const processingTime = Date.now() - startTime;
      this.processingStats.processingTime.push(processingTime);
      
      // Keep only last 1000 processing times
      if (this.processingStats.processingTime.length > 1000) {
        this.processingStats.processingTime = this.processingStats.processingTime.slice(-1000);
      }

      console.log(`Event processed successfully: ${event.type}`, {
        eventId: event.id,
        processingTime: `${processingTime}ms`
      });

    } catch (error) {
      console.error(`Error processing enrichment event: ${event.type}`, error);
      this.processingStats.failed++;
      
      // Publish error event
      await this.publishErrorEvent(event, error);
      
      throw error;
    }
  }

  async handleCandidateCreated(event) {
    const { candidateId, candidateData, source } = event.payload;
    
    try {
      // Find candidate
      const candidate = await SourcingCandidate.findById(candidateId);
      
      if (!candidate) {
        console.warn(`Candidate not found for enrichment: ${candidateId}`);
        return null;
      }

      // Determine enrichment strategy based on source and data completeness
      const enrichmentStrategy = this.determineEnrichmentStrategy(candidate);
      
      console.log(`Starting enrichment for candidate: ${candidateId}`, {
        strategy: enrichmentStrategy.type,
        priority: enrichmentStrategy.priority
      });

      // Execute enrichment based on strategy
      const enrichmentResult = await this.executeEnrichment(candidate, enrichmentStrategy);
      
      // Update candidate with enrichment data
      await this.updateCandidateWithEnrichment(candidate, enrichmentResult);
      
      // Update stats
      this.processingStats.enriched++;

      // Publish enrichment event
      await ingestionEventPublisherService.publishCandidateEnrichment(
        candidateId,
        enrichmentResult,
        {
          correlationId: event.metadata.correlationId,
          priority: enrichmentStrategy.priority
        }
      );

      // Emit local event
      await eventBusService.publishEvent('candidate.enriched', {
        candidateId,
        enrichmentResult,
        strategy: enrichmentStrategy.type
      }, {
        source: 'enrichment-event-handler',
        correlationId: event.metadata.correlationId
      });

      console.log(`Candidate enriched successfully: ${candidateId}`, {
        strategy: enrichmentStrategy.type,
        enrichedFields: enrichmentResult.enrichedFields?.length || 0
      });

      return enrichmentResult;

    } catch (error) {
      console.error(`Error handling candidate enrichment: ${candidateId}`, error);
      throw error;
    }
  }

  async handleCandidateEnriched(event) {
    const { candidateId, enrichmentData, enrichmentType } = event.payload;
    
    try {
      // Find candidate
      const candidate = await SourcingCandidate.findById(candidateId);
      
      if (!candidate) {
        console.warn(`Candidate not found for enrichment processing: ${candidateId}`);
        return null;
      }

      // Validate enrichment data
      const validationResult = this.validateEnrichmentData(enrichmentData);
      
      if (!validationResult.valid) {
        console.warn(`Invalid enrichment data for candidate: ${candidateId}`, validationResult.errors);
        return null;
      }

      // Apply enrichment to candidate
      await this.applyEnrichmentToCandidate(candidate, enrichmentData, enrichmentType);
      
      // Update candidate status
      candidate.status = 'enriched';
      candidate.enrichedAt = new Date();
      candidate.lastUpdated = new Date();
      
      await candidate.save();

      // Update stats
      this.processingStats.processed++;

      // Publish indexing event
      await ingestionEventPublisherService.publishCandidateIndexing(
        candidateId,
        {
          candidate: candidate.toObject(),
          enrichmentData,
          indexes: ['elasticsearch', 'qdrant'],
          status: 'ready'
        },
        {
          correlationId: event.metadata.correlationId,
          priority: 'high'
        }
      );

      // Emit local event
      await eventBusService.publishEvent('candidate.indexing.ready', {
        candidateId,
        enrichmentType,
        indexes: ['elasticsearch', 'qdrant']
      }, {
        source: 'enrichment-event-handler',
        correlationId: event.metadata.correlationId
      });

      console.log(`Candidate enrichment processed: ${candidateId}`, {
        enrichmentType,
        indexes: ['elasticsearch', 'qdrant']
      });

      return candidate;

    } catch (error) {
      console.error(`Error handling enriched candidate: ${candidateId}`, error);
      throw error;
    }
  }

  determineEnrichmentStrategy(candidate) {
    const dataCompleteness = this.assessDataCompleteness(candidate);
    const source = candidate.source || 'unknown';
    
    // Base strategy on data completeness and source
    if (dataCompleteness.score < 0.3) {
      return {
        type: 'comprehensive',
        priority: 'high',
        services: ['company', 'skills', 'education', 'social', 'contact']
      };
    } else if (dataCompleteness.score < 0.6) {
      return {
        type: 'targeted',
        priority: 'normal',
        services: ['company', 'skills']
      };
    } else {
      return {
        type: 'incremental',
        priority: 'low',
        services: ['skills']
      };
    }
  }

  async executeEnrichment(candidate, strategy) {
    const enrichmentResult = {
      candidateId: candidate._id,
      strategy: strategy.type,
      enrichedFields: [],
      enrichedData: {},
      errors: [],
      timestamp: new Date().toISOString()
    };

    try {
      // Execute enrichment based on strategy services
      for (const service of strategy.services) {
        try {
          const serviceResult = await this.executeEnrichmentService(candidate, service);
          
          if (serviceResult.success) {
            enrichmentResult.enrichedData[service] = serviceResult.data;
            enrichmentResult.enrichedFields.push(...serviceResult.fields);
          } else {
            enrichmentResult.errors.push({
              service,
              error: serviceResult.error
            });
          }
        } catch (error) {
          console.error(`Error in enrichment service ${service}:`, error);
          enrichmentResult.errors.push({
            service,
            error: error.message
          });
        }
      }

      enrichmentResult.success = enrichmentResult.errors.length === 0;
      enrichmentResult.enrichedFieldsCount = enrichmentResult.enrichedFields.length;
      enrichmentResult.errorsCount = enrichmentResult.errors.length;

    } catch (error) {
      console.error('Error executing enrichment strategy:', error);
      enrichmentResult.success = false;
      enrichmentResult.errors.push({
        service: 'strategy',
        error: error.message
      });
    }

    return enrichmentResult;
  }

  async executeEnrichmentService(candidate, service) {
    switch (service) {
      case 'company':
        return await this.enrichCompanyData(candidate);
        
      case 'skills':
        return await this.enrichSkillsData(candidate);
        
      case 'education':
        return await this.enrichEducationData(candidate);
        
      case 'social':
        return await this.enrichSocialData(candidate);
        
      case 'contact':
        return await this.enrichContactData(candidate);
        
      default:
        return {
          success: false,
          error: `Unknown enrichment service: ${service}`,
          fields: []
        };
    }
  }

  async enrichCompanyData(candidate) {
    try {
      const enrichedData = {};
      const fields = [];

      // Enrich current company if available
      if (candidate.experience && candidate.experience.length > 0) {
        const currentJob = candidate.experience.find(exp => exp.isCurrentJob);
        
        if (currentJob && currentJob.company) {
          // Mock company enrichment - would integrate with external services
          enrichedData.companyInfo = {
            industry: this.inferIndustry(currentJob),
            companySize: this.inferCompanySize(currentJob),
            revenue: this.inferRevenue(currentJob),
            description: currentJob.description || '',
            website: this.inferWebsite(currentJob),
            founded: this.inferFoundedYear(currentJob),
            locations: [currentJob.location || 'Unknown']
          };
          
          fields.push('companyInfo', 'industry', 'companySize', 'revenue');
        }
      }

      return {
        success: true,
        data: enrichedData,
        fields
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        fields: []
      };
    }
  }

  async enrichSkillsData(candidate) {
    try {
      const enrichedData = {};
      const fields = [];

      if (candidate.skills && candidate.skills.length > 0) {
        // Mock skills enrichment - would integrate with skills APIs
        enrichedData.skillsEnhancement = {
          trendingSkills: this.identifyTrendingSkills(candidate.skills),
          skillLevels: this.assessSkillLevels(candidate.skills),
          skillCategories: this.categorizeSkills(candidate.skills),
          marketDemand: this.assessMarketDemand(candidate.skills),
          relatedSkills: this.findRelatedSkills(candidate.skills),
          certifications: this.suggestCertifications(candidate.skills)
        };
        
        fields.push('skillsEnhancement', 'trendingSkills', 'skillLevels', 'marketDemand');
      }

      return {
        success: true,
        data: enrichedData,
        fields
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        fields: []
      };
    }
  }

  async enrichEducationData(candidate) {
    try {
      const enrichedData = {};
      const fields = [];

      if (candidate.education && candidate.education.length > 0) {
        // Mock education enrichment - would integrate with education APIs
        enrichedData.educationEnhancement = {
          institutionRankings: this.getInstitutionRankings(candidate.education),
          degreeAccreditation: this.verifyDegreeAccreditation(candidate.education),
          fieldRelevance: this.assessFieldRelevance(candidate.education),
          graduationDates: this.normalizeGraduationDates(candidate.education)
        };
        
        fields.push('educationEnhancement', 'institutionRankings', 'degreeAccreditation');
      }

      return {
        success: true,
        data: enrichedData,
        fields
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        fields: []
      };
    }
  }

  async enrichSocialData(candidate) {
    try {
      const enrichedData = {};
      const fields = [];

      // Mock social enrichment - would integrate with social APIs
      if (candidate.githubData) {
        enrichedData.githubEnhancement = {
          followers: candidate.githubData.followers || 0,
          following: candidate.githubData.following || 0,
          repositories: candidate.githubData.repositories || 0,
          contributions: candidate.githubData.contributions || 0,
          languages: candidate.githubData.languages || [],
          activityScore: this.calculateGithubActivityScore(candidate.githubData)
        };
        fields.push('githubEnhancement', 'activityScore');
      }

      if (candidate.linkedinData) {
        enrichedData.linkedinEnhancement = {
          connections: candidate.linkedinData.connections || 0,
          profileViews: candidate.linkedinData.profileViews || 0,
          posts: candidate.linkedinData.posts || 0,
          endorsements: candidate.linkedinData.endorsements || 0,
          recommendations: candidate.linkedinData.recommendations || 0
        };
        fields.push('linkedinEnhancement');
      }

      return {
        success: true,
        data: enrichedData,
        fields
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        fields: []
      };
    }
  }

  async enrichContactData(candidate) {
    try {
      const enrichedData = {};
      const fields = [];

      // Mock contact enrichment - would integrate with contact APIs
      if (candidate.email) {
        enrichedData.contactEnhancement = {
          emailValidation: this.validateEmail(candidate.email),
          phoneValidation: candidate.phone ? this.validatePhone(candidate.phone) : null,
          locationAccuracy: this.validateLocation(candidate.location),
          timezone: this.inferTimezone(candidate.location),
          languages: this.inferLanguages(candidate.location)
        };
        fields.push('contactEnhancement', 'emailValidation', 'locationAccuracy');
      }

      return {
        success: true,
        data: enrichedData,
        fields
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        fields: []
      };
    }
  }

  async updateCandidateWithEnrichment(candidate, enrichmentResult) {
    // Update candidate with enriched data
    if (enrichmentResult.enrichedData.companyInfo) {
      candidate.companyEnrichment = enrichmentResult.enrichedData.companyInfo;
    }
    
    if (enrichmentResult.enrichedData.skillsEnhancement) {
      candidate.skillsEnrichment = enrichmentResult.enrichedData.skillsEnhancement;
    }
    
    if (enrichmentResult.enrichedData.educationEnhancement) {
      candidate.educationEnrichment = enrichmentResult.enrichedData.educationEnhancement;
    }
    
    if (enrichmentResult.enrichedData.githubEnhancement) {
      candidate.githubEnrichment = enrichmentResult.enrichedData.githubEnhancement;
    }
    
    if (enrichmentResult.enrichedData.linkedinEnhancement) {
      candidate.linkedinEnrichment = enrichmentResult.enrichedData.linkedinEnhancement;
    }
    
    if (enrichmentResult.enrichedData.contactEnhancement) {
      candidate.contactEnrichment = enrichmentResult.enrichedData.contactEnhancement;
    }

    candidate.enrichmentStatus = enrichmentResult.success ? 'completed' : 'partial';
    candidate.enrichedAt = new Date();
    candidate.lastUpdated = new Date();
    
    await candidate.save();
  }

  async applyEnrichmentToCandidate(candidate, enrichmentData, enrichmentType) {
    // Apply specific enrichment data to candidate
    switch (enrichmentType) {
      case 'company_enrichment':
        if (enrichmentData.company) {
          candidate.companyEnrichment = enrichmentData.company;
        }
        break;
        
      case 'skills_enrichment':
        if (enrichmentData.skills) {
          candidate.skillsEnrichment = enrichmentData.skills;
        }
        break;
        
      case 'education_enrichment':
        if (enrichmentData.education) {
          candidate.educationEnrichment = enrichmentData.education;
        }
        break;
        
      case 'comprehensive_enrichment':
        // Apply all enrichment data
        for (const [key, value] of Object.entries(enrichmentData)) {
          if (key.endsWith('Enrichment') || key.endsWith('Enhancement')) {
            candidate[key] = value;
          }
        }
        break;
    }
  }

  validateEnrichmentData(enrichmentData) {
    const errors = [];
    
    if (!enrichmentData || typeof enrichmentData !== 'object') {
      errors.push('Enrichment data must be an object');
    }
    
    if (Object.keys(enrichmentData).length === 0) {
      errors.push('Enrichment data cannot be empty');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  assessDataCompleteness(candidate) {
    const requiredFields = ['name', 'email', 'experience', 'skills'];
    const optionalFields = ['education', 'githubData', 'linkedinData', 'portfolioData'];
    
    const presentRequired = requiredFields.filter(field => 
      candidate[field] && (Array.isArray(candidate[field]) ? candidate[field].length > 0 : true)
    ).length;
    
    const presentOptional = optionalFields.filter(field => 
      candidate[field] && (Array.isArray(candidate[field]) ? candidate[field].length > 0 : true)
    ).length;
    
    const requiredScore = presentRequired / requiredFields.length;
    const optionalScore = presentOptional / optionalFields.length;
    
    return {
      score: (requiredScore * 0.7) + (optionalScore * 0.3),
      requiredFields: presentRequired,
      optionalFields: presentOptional,
      totalFields: presentRequired + presentOptional
    };
  }

  // Mock enrichment helper methods
  inferIndustry(job) {
    const techKeywords = ['software', 'technology', 'engineering', 'developer', 'programmer'];
    const jobText = `${job.title} ${job.description || ''}`.toLowerCase();
    
    if (techKeywords.some(keyword => jobText.includes(keyword))) {
      return 'Technology';
    }
    return 'Unknown';
  }

  inferCompanySize(job) {
    // Mock company size inference
    return '50-200';
  }

  inferRevenue(job) {
    // Mock revenue inference
    return '$10M-$50M';
  }

  inferWebsite(job) {
    // Mock website inference
    return 'https://example.com';
  }

  inferFoundedYear(job) {
    // Mock founded year inference
    return 2010;
  }

  identifyTrendingSkills(skills) {
    // Mock trending skills identification
    return skills.slice(0, 5).map(skill => skill.name);
  }

  assessSkillLevels(skills) {
    // Mock skill level assessment
    return skills.map(skill => ({
      name: skill.name,
      level: 'intermediate',
      confidence: 0.8
    }));
  }

  categorizeSkills(skills) {
    // Mock skill categorization
    return skills.map(skill => ({
      name: skill.name,
      category: skill.category || 'technical'
    }));
  }

  assessMarketDemand(skills) {
    // Mock market demand assessment
    return skills.map(skill => ({
      name: skill.name,
      demand: 'high',
      growth: 'positive'
    }));
  }

  findRelatedSkills(skills) {
    // Mock related skills finding
    return skills.slice(0, 3).map(skill => skill.name);
  }

  suggestCertifications(skills) {
    // Mock certification suggestions
    return ['AWS Certified Developer', 'Google Cloud Professional'];
  }

  getInstitutionRankings(education) {
    // Mock institution rankings
    return education.map(edu => ({
      institution: edu.institution,
      ranking: 'Top 100',
      country: 'US'
    }));
  }

  verifyDegreeAccreditation(education) {
    // Mock degree accreditation verification
    return education.map(edu => ({
      degree: edu.degree,
      accredited: true,
      agency: 'Regional Accreditation'
    }));
  }

  assessFieldRelevance(education) {
    // Mock field relevance assessment
    return education.map(edu => ({
      field: edu.field,
      relevance: 'high',
      marketDemand: 'strong'
    }));
  }

  normalizeGraduationDates(education) {
    // Mock graduation date normalization
    return education.map(edu => ({
      ...edu,
      normalizedDate: edu.endDate
    }));
  }

  calculateGithubActivityScore(githubData) {
    // Mock GitHub activity score calculation
    return Math.min((githubData.repositories || 0) * 10 + (githubData.contributions || 0), 100);
  }

  validateEmail(email) {
    // Mock email validation
    return {
      valid: true,
      format: 'professional',
      domain: 'company'
    };
  }

  validatePhone(phone) {
    // Mock phone validation
    return {
      valid: true,
      type: 'mobile',
      country: 'US'
    };
  }

  validateLocation(location) {
    // Mock location validation
    return {
      valid: true,
      accuracy: 'high',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    };
  }

  inferTimezone(location) {
    // Mock timezone inference
    return 'America/Los_Angeles';
  }

  inferLanguages(location) {
    // Mock language inference
    return ['English'];
  }

  async subscribeToEventBus() {
    // Subscribe to relevant local events
    await eventBusService.subscribe('candidate.refresh', async (event) => {
      try {
        const { candidateId, refreshType } = event.payload;
        
        if (refreshType === 'enrichment' || refreshType === 'full') {
          // Re-publish enrichment event for refresh
          const candidate = await SourcingCandidate.findById(candidateId);
          if (candidate) {
            await ingestionEventPublisherService.publishCandidateEnrichment(
              candidateId,
              candidate.toObject(),
              {
                correlationId: event.metadata.correlationId,
                priority: 'normal'
              }
            );
          }
        }
      } catch (error) {
        console.error('Error handling refresh event:', error);
      }
    });
  }

  async publishErrorEvent(originalEvent, error) {
    try {
      await ingestionEventPublisherService.publishProcessingError(
        originalEvent.payload.candidateId || 'unknown',
        {
          originalEvent: originalEvent.id,
          error: error.message,
          stack: error.stack,
          stage: 'enrichment-event-handler',
          timestamp: new Date().toISOString()
        },
        {
          correlationId: originalEvent.metadata.correlationId,
          priority: 'high'
        }
      );
    } catch (publishError) {
      console.error('Failed to publish error event:', publishError);
    }
  }

  async shutdown() {
    try {
      if (this.consumerId) {
        await kafkaConsumerService.removeConsumer(this.consumerId);
        this.consumerId = null;
      }
      
      console.log('Enrichment event handler shutdown complete');
    } catch (error) {
      console.error('Error shutting down enrichment event handler:', error);
      throw error;
    }
  }

  getProcessingStats() {
    const processingTime = this.processingStats.processingTime;
    
    return {
      ...this.processingStats,
      averageProcessingTime: processingTime.length > 0 ? 
        processingTime.reduce((sum, time) => sum + time, 0) / processingTime.length : 0,
      maxProcessingTime: processingTime.length > 0 ? Math.max(...processingTime) : 0,
      minProcessingTime: processingTime.length > 0 ? Math.min(...processingTime) : 0,
      p95ProcessingTime: processingTime.length > 0 ? 
        this.percentile(processingTime, 0.95) : 0,
      p99ProcessingTime: processingTime.length > 0 ? 
        this.percentile(processingTime, 0.99) : 0,
      consumerId: this.consumerId,
      topics: this.topics
    };
  }

  percentile(arr, p) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }

  resetStats() {
    this.processingStats = {
      enriched: 0,
      processed: 0,
      failed: 0,
      processingTime: []
    };
  }

  async healthCheck() {
    try {
      const consumerInfo = this.consumerId ? 
        kafkaConsumerService.getConsumerInfo(this.consumerId) : null;
      
      return {
        status: 'healthy',
        consumerId: this.consumerId,
        connected: !!consumerInfo,
        topics: this.topics,
        stats: this.getProcessingStats()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        consumerId: this.consumerId
      };
    }
  }
}

export const enrichmentEventHandlerService = new EnrichmentEventHandlerService();
export default enrichmentEventHandlerService;
