import { kafkaConsumerService } from './kafkaConsumer.service.js';
import { ingestionEventPublisherService } from './ingestionEventPublisher.service.js';
import { SourcingCandidate } from '../../../../models/sourcing/sourcingCandidate.model.js';
import { eventBusService } from './eventBus.service.js';
import { v4 as uuidv4 } from 'uuid';

export class DiscoveryEventHandlerService {
  constructor() {
    this.consumerId = null;
    this.topics = [
      'candidate.discovery',
      'candidate.normalization',
      'candidate.deduplication'
    ];
    this.processingStats = {
      discovered: 0,
      normalized: 0,
      deduplicated: 0,
      failed: 0,
      processingTime: []
    };
  }

  async initialize() {
    try {
      this.consumerId = await kafkaConsumerService.createConsumer(
        'discovery-event-handler-group',
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

      console.log('Discovery event handler initialized');
      console.log(`Consumer ID: ${this.consumerId}`);
      console.log(`Subscribed to topics: ${this.topics.join(', ')}`);

    } catch (error) {
      console.error('Failed to initialize discovery event handler:', error);
      throw error;
    }
  }

  async handleEvent(event) {
    const startTime = Date.now();
    
    try {
      console.log(`Processing discovery event: ${event.type}`, {
        eventId: event.id,
        correlationId: event.metadata.correlationId
      });

      switch (event.type) {
        case 'candidate.discovered':
          await this.handleCandidateDiscovered(event);
          break;
          
        case 'candidate.normalized':
          await this.handleCandidateNormalized(event);
          break;
          
        case 'candidate.deduplicated':
          await this.handleCandidateDeduplicated(event);
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
      console.error(`Error processing discovery event: ${event.type}`, error);
      this.processingStats.failed++;
      
      // Publish error event
      await this.publishErrorEvent(event, error);
      
      throw error;
    }
  }

  async handleCandidateDiscovered(event) {
    const { candidateId, source, data, discoveryType } = event.payload;
    
    try {
      // Check if candidate already exists
      const existingCandidate = await SourcingCandidate.findOne({
        $or: [
          { email: data.email },
          { 'githubData.username': data.github?.username },
          { 'portfolioData.url': data.portfolio?.url }
        ]
      });

      if (existingCandidate) {
        console.log(`Candidate already exists: ${candidateId}`, {
          existingId: existingCandidate._id,
          source
        });
        
        // Publish normalization event for existing candidate
        await ingestionEventPublisherService.publishCandidateNormalization(
          existingCandidate._id,
          data,
          {
            correlationId: event.metadata.correlationId,
            priority: 'normal'
          }
        );
        
        return existingCandidate;
      }

      // Create new candidate
      const candidate = new SourcingCandidate({
        _id: candidateId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        summary: data.summary,
        experience: data.experience || [],
        skills: data.skills || [],
        education: data.education || [],
        githubData: data.github || {},
        portfolioData: data.portfolio || {},
        linkedinData: data.linkedin || {},
        resumeData: data.resume || {},
        source: source,
        discoveryType: discoveryType,
        status: 'discovered',
        discoveredAt: new Date(),
        lastUpdated: new Date()
      });

      await candidate.save();

      // Update stats
      this.processingStats.discovered++;

      // Publish normalization event
      await ingestionEventPublisherService.publishCandidateNormalization(
        candidateId,
        candidate.toObject(),
        {
          correlationId: event.metadata.correlationId,
          priority: 'high'
        }
      );

      // Emit local event
      await eventBusService.publishEvent('candidate.discovered', {
        candidateId,
        source,
        discoveryType
      }, {
        source: 'discovery-event-handler',
        correlationId: event.metadata.correlationId
      });

      console.log(`Candidate discovered and saved: ${candidateId}`, {
        source,
        discoveryType
      });

      return candidate;

    } catch (error) {
      console.error(`Error handling candidate discovery: ${candidateId}`, error);
      throw error;
    }
  }

  async handleCandidateNormalized(event) {
    const { candidateId, normalizedData, normalizationType } = event.payload;
    
    try {
      // Find and update candidate
      const candidate = await SourcingCandidate.findById(candidateId);
      
      if (!candidate) {
        console.warn(`Candidate not found for normalization: ${candidateId}`);
        return null;
      }

      // Apply normalization based on type
      switch (normalizationType) {
        case 'skills_normalization':
          await this.normalizeSkills(candidate, normalizedData);
          break;
          
        case 'experience_normalization':
          await this.normalizeExperience(candidate, normalizedData);
          break;
          
        case 'education_normalization':
          await this.normalizeEducation(candidate, normalizedData);
          break;
          
        case 'full_normalization':
          await this.normalizeFullProfile(candidate, normalizedData);
          break;
          
        default:
          await this.updateCandidateData(candidate, normalizedData);
      }

      candidate.status = 'normalized';
      candidate.normalizedAt = new Date();
      candidate.lastUpdated = new Date();
      
      await candidate.save();

      // Update stats
      this.processingStats.normalized++;

      // Publish deduplication event
      await ingestionEventPublisherService.publishCandidateDeduplication(
        candidateId,
        {
          candidate: candidate.toObject(),
          duplicates: [],
          action: 'proceed'
        },
        {
          correlationId: event.metadata.correlationId,
          priority: 'high'
        }
      );

      // Emit local event
      await eventBusService.publishEvent('candidate.normalized', {
        candidateId,
        normalizationType,
        fieldsNormalized: event.payload.fieldsNormalized
      }, {
        source: 'discovery-event-handler',
        correlationId: event.metadata.correlationId
      });

      console.log(`Candidate normalized: ${candidateId}`, {
        normalizationType,
        fieldsNormalized: event.payload.fieldsNormalized.length
      });

      return candidate;

    } catch (error) {
      console.error(`Error handling candidate normalization: ${candidateId}`, error);
      throw error;
    }
  }

  async handleCandidateDeduplicated(event) {
    const { candidateId, duplicateData, deduplicationType, action } = event.payload;
    
    try {
      // Find candidate
      const candidate = await SourcingCandidate.findById(candidateId);
      
      if (!candidate) {
        console.warn(`Candidate not found for deduplication: ${candidateId}`);
        return null;
      }

      // Handle deduplication action
      switch (action) {
        case 'merge':
          await this.mergeCandidate(candidate, duplicateData);
          break;
          
        case 'skip':
          await this.skipDuplicate(candidate, duplicateData);
          break;
          
        case 'update':
          await this.updateDuplicate(candidate, duplicateData);
          break;
          
        default:
          console.log(`Proceeding with candidate: ${candidateId}`);
      }

      candidate.status = 'deduplicated';
      candidate.deduplicatedAt = new Date();
      candidate.lastUpdated = new Date();
      
      await candidate.save();

      // Update stats
      this.processingStats.deduplicated++;

      // Publish candidate created event if proceeding
      if (action === 'proceed' || action === 'update') {
        await ingestionEventPublisherService.publishCandidateCreated(
          candidateId,
          candidate.toObject(),
          {
            correlationId: event.metadata.correlationId,
            priority: 'high'
          }
        );
      }

      // Emit local event
      await eventBusService.publishEvent('candidate.deduplicated', {
        candidateId,
        deduplicationType,
        action,
        duplicatesFound: duplicateData.duplicates?.length || 0
      }, {
        source: 'discovery-event-handler',
        correlationId: event.metadata.correlationId
      });

      console.log(`Candidate deduplicated: ${candidateId}`, {
        deduplicationType,
        action,
        duplicatesFound: duplicateData.duplicates?.length || 0
      });

      return candidate;

    } catch (error) {
      console.error(`Error handling candidate deduplication: ${candidateId}`, error);
      throw error;
    }
  }

  async normalizeSkills(candidate, normalizedData) {
    if (normalizedData.skills) {
      candidate.skills = normalizedData.skills.map(skill => ({
        name: skill.name || skill,
        category: skill.category || 'technical',
        experience: skill.experience || 0,
        proficiency: skill.proficiency || 'intermediate',
        lastUsed: skill.lastUsed || new Date(),
        verified: skill.verified || false,
        source: skill.source || 'normalized'
      }));
    }
  }

  async normalizeExperience(candidate, normalizedData) {
    if (normalizedData.experience) {
      candidate.experience = normalizedData.experience.map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || null,
        endDate: exp.endDate || null,
        isCurrentJob: exp.isCurrentJob || false,
        description: exp.description || '',
        responsibilities: exp.responsibilities || [],
        achievements: exp.achievements || [],
        technologies: exp.technologies || [],
        companySize: exp.companySize || '',
        industry: exp.industry || '',
        normalized: true
      }));
    }
  }

  async normalizeEducation(candidate, normalizedData) {
    if (normalizedData.education) {
      candidate.education = normalizedData.education.map(edu => ({
        degree: edu.degree || '',
        field: edu.field || '',
        institution: edu.institution || '',
        location: edu.location || '',
        startDate: edu.startDate || null,
        endDate: edu.endDate || null,
        gpa: edu.gpa || null,
        honors: edu.honors || [],
        activities: edu.activities || [],
        normalized: true
      }));
    }
  }

  async normalizeFullProfile(candidate, normalizedData) {
    await this.normalizeSkills(candidate, normalizedData);
    await this.normalizeExperience(candidate, normalizedData);
    await this.normalizeEducation(candidate, normalizedData);
    
    // Normalize other fields
    if (normalizedData.name) candidate.name = normalizedData.name;
    if (normalizedData.email) candidate.email = normalizedData.email;
    if (normalizedData.phone) candidate.phone = normalizedData.phone;
    if (normalizedData.location) candidate.location = normalizedData.location;
    if (normalizedData.summary) candidate.summary = normalizedData.summary;
  }

  async updateCandidateData(candidate, normalizedData) {
    for (const [key, value] of Object.entries(normalizedData)) {
      if (candidate[key] !== undefined && typeof value === 'object') {
        candidate[key] = { ...candidate[key], ...value };
      } else {
        candidate[key] = value;
      }
    }
  }

  async mergeCandidate(candidate, duplicateData) {
    // Merge logic for duplicate candidates
    if (duplicateData.mergedFields) {
      for (const field of duplicateData.mergedFields) {
        if (duplicateData[field]) {
          candidate[field] = duplicateData[field];
        }
      }
    }
    
    candidate.duplicateOf = duplicateData.primaryCandidateId;
    candidate.mergeStatus = 'merged';
  }

  async skipDuplicate(candidate, duplicateData) {
    candidate.status = 'duplicate';
    candidate.duplicateOf = duplicateData.primaryCandidateId;
    candidate.skipReason = duplicateData.reason || 'duplicate_found';
  }

  async updateDuplicate(candidate, duplicateData) {
    // Update with additional data from duplicate
    if (duplicateData.additionalData) {
      await this.updateCandidateData(candidate, duplicateData.additionalData);
    }
    
    candidate.duplicateResolution = 'updated';
  }

  async subscribeToEventBus() {
    // Subscribe to relevant local events
    await eventBusService.subscribe('candidate.refresh', async (event) => {
      try {
        const { candidateId, refreshType } = event.payload;
        
        // Re-publish discovery event for refresh
        const candidate = await SourcingCandidate.findById(candidateId);
        if (candidate) {
          await ingestionEventPublisherService.publishCandidateDiscovery(
            candidate.toObject(),
            'refresh',
            {
              correlationId: event.metadata.correlationId,
              priority: 'normal'
            }
          );
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
          stage: 'discovery-event-handler',
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
      
      console.log('Discovery event handler shutdown complete');
    } catch (error) {
      console.error('Error shutting down discovery event handler:', error);
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
      discovered: 0,
      normalized: 0,
      deduplicated: 0,
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

export const discoveryEventHandlerService = new DiscoveryEventHandlerService();
export default discoveryEventHandlerService;
