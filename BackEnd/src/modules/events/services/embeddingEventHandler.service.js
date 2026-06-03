import { kafkaConsumerService } from './kafkaConsumer.service.js';
import { ingestionEventPublisherService } from './ingestionEventPublisher.service.js';
import { SourcingCandidate } from '../../../../models/sourcing/sourcingCandidate.model.js';
import { eventBusService } from './eventBus.service.js';
import { v4 as uuidv4 } from 'uuid';

export class EmbeddingEventHandlerService {
  constructor() {
    this.consumerId = null;
    this.topics = [
      'candidate.embedding',
      'candidate.indexing'
    ];
    this.processingStats = {
      embedded: 0,
      processed: 0,
      failed: 0,
      processingTime: []
    };
  }

  async initialize() {
    try {
      this.consumerId = await kafkaConsumerService.createConsumer(
        'embedding-event-handler-group',
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

      console.log('Embedding event handler initialized');
      console.log(`Consumer ID: ${this.consumerId}`);
      console.log(`Subscribed to topics: ${this.topics.join(', ')}`);

    } catch (error) {
      console.error('Failed to initialize embedding event handler:', error);
      throw error;
    }
  }

  async handleEvent(event) {
    const startTime = Date.now();
    
    try {
      console.log(`Processing embedding event: ${event.type}`, {
        eventId: event.id,
        correlationId: event.metadata.correlationId
      });

      switch (event.type) {
        case 'candidate.embedded':
          await this.handleCandidateEmbedded(event);
          break;
          
        case 'candidate.indexed':
          await this.handleCandidateIndexed(event);
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
      console.error(`Error processing embedding event: ${event.type}`, error);
      this.processingStats.failed++;
      
      // Publish error event
      await this.publishErrorEvent(event, error);
      
      throw error;
    }
  }

  async handleCandidateEmbedded(event) {
    const { candidateId, embeddingData, embeddingType, vectorDimensions, embeddingModel } = event.payload;
    
    try {
      // Find candidate
      const candidate = await SourcingCandidate.findById(candidateId);
      
      if (!candidate) {
        console.warn(`Candidate not found for embedding processing: ${candidateId}`);
        return null;
      }

      // Validate embedding data
      const validationResult = this.validateEmbeddingData(embeddingData);
      
      if (!validationResult.valid) {
        console.warn(`Invalid embedding data for candidate: ${candidateId}`, validationResult.errors);
        return null;
      }

      // Process embedding based on type
      const processedEmbedding = await this.processEmbedding(embeddingData, embeddingType);
      
      // Update candidate with embedding data
      await this.updateCandidateWithEmbedding(candidate, processedEmbedding, embeddingType);
      
      // Update stats
      this.processingStats.embedded++;

      // Publish signals generation event (embedding is ready for signals)
      await ingestionEventPublisherService.publishCandidateSignals(
        candidateId,
        {
          embedding: processedEmbedding,
          embeddingType,
          vectorDimensions: processedEmbedding.vector ? processedEmbedding.vector.length : 0,
          embeddingModel: processedEmbedding.model || embeddingModel,
          embeddedAt: new Date().toISOString()
        },
        {
          correlationId: event.metadata.correlationId,
          priority: 'normal'
        }
      );

      // Emit local event
      await eventBusService.publishEvent('candidate.embedding.processed', {
        candidateId,
        embeddingType,
        vectorDimensions: processedEmbedding.vector ? processedEmbedding.vector.length : 0
      }, {
        source: 'embedding-event-handler',
        correlationId: event.metadata.correlationId
      });

      console.log(`Candidate embedding processed: ${candidateId}`, {
        embeddingType,
        vectorDimensions: processedEmbedding.vector ? processedEmbedding.vector.length : 0
      });

      return processedEmbedding;

    } catch (error) {
      console.error(`Error handling candidate embedding: ${candidateId}`, error);
      throw error;
    }
  }

  async handleCandidateIndexed(event) {
    const { candidateId, indexingData, indexingType, indexes, indexingStatus } = event.payload;
    
    try {
      // Find candidate
      const candidate = await SourcingCandidate.findById(candidateId);
      
      if (!candidate) {
        console.warn(`Candidate not found for indexing processing: ${candidateId}`);
        return null;
      }

      // Validate indexing data
      const validationResult = this.validateIndexingData(indexingData);
      
      if (!validationResult.valid) {
        console.warn(`Invalid indexing data for candidate: ${candidateId}`, validationResult.errors);
        return null;
      }

      // Update candidate with indexing status
      await this.updateCandidateWithIndexingStatus(candidate, indexingData, indexingType, indexes);

      // Update stats
      this.processingStats.processed++;

      // Check if all required indexes are complete
      const requiredIndexes = ['elasticsearch', 'qdrant'];
      const completedIndexes = this.getCompletedIndexes(candidate, requiredIndexes);
      
      if (completedIndexes.length === requiredIndexes.length) {
        // Publish candidate refresh event to trigger final processing
        await ingestionEventPublisherService.publishCandidateRefresh(
          candidateId,
          {
            indexingComplete: true,
            completedIndexes,
            refreshType: 'post-indexing',
            reason: 'all_indexes_completed'
          },
          {
            correlationId: event.metadata.correlationId,
            priority: 'normal'
          }
        );

        // Emit local event
        await eventBusService.publishEvent('candidate.indexing.completed', {
          candidateId,
          completedIndexes,
          indexingType
        }, {
          source: 'embedding-event-handler',
          correlationId: event.metadata.correlationId
        });

        console.log(`All indexing completed for candidate: ${candidateId}`, {
          completedIndexes
        });
      }

      console.log(`Candidate indexing processed: ${candidateId}`, {
        indexingType,
        indexes,
        status: indexingStatus
      });

      return candidate;

    } catch (error) {
      console.error(`Error handling candidate indexing: ${candidateId}`, error);
      throw error;
    }
  }

  async processEmbedding(embeddingData, embeddingType) {
    try {
      let processedEmbedding = {
        ...embeddingData,
        processedAt: new Date().toISOString(),
        processor: 'embedding-event-handler'
      };

      switch (embeddingType) {
        case 'text_embedding':
          processedEmbedding = await this.processTextEmbedding(processedEmbedding);
          break;
          
        case 'skills_embedding':
          processedEmbedding = await this.processSkillsEmbedding(processedEmbedding);
          break;
          
        case 'profile_embedding':
          processedEmbedding = await this.processProfileEmbedding(processedEmbedding);
          break;
          
        case 'semantic_embedding':
          processedEmbedding = await this.processSemanticEmbedding(processedEmbedding);
          break;
          
        default:
          processedEmbedding = await this.processGenericEmbedding(processedEmbedding);
      }

      return processedEmbedding;

    } catch (error) {
      console.error('Error processing embedding:', error);
      throw error;
    }
  }

  async processTextEmbedding(embeddingData) {
    // Mock text embedding processing
    const processedEmbedding = {
      ...embeddingData,
      type: 'text',
      model: embeddingData.model || 'text-embedding-ada-002',
      dimensions: embeddingData.vector ? embeddingData.vector.length : 1536,
      encoding: 'float32',
      normalized: this.normalizeVector(embeddingData.vector),
      metadata: {
        textLength: embeddingData.text ? embeddingData.text.length : 0,
        tokenCount: this.estimateTokenCount(embeddingData.text),
        language: this.detectLanguage(embeddingData.text),
        confidence: 0.95
      }
    };

    return processedEmbedding;
  }

  async processSkillsEmbedding(embeddingData) {
    // Mock skills embedding processing
    const processedEmbedding = {
      ...embeddingData,
      type: 'skills',
      model: embeddingData.model || 'skills-embedding-model',
      dimensions: embeddingData.vector ? embeddingData.vector.length : 768,
      encoding: 'float32',
      normalized: this.normalizeVector(embeddingData.vector),
      metadata: {
        skillsCount: embeddingData.skills ? embeddingData.skills.length : 0,
        categories: this.categorizeSkills(embeddingData.skills),
        experienceLevel: this.assessExperienceLevel(embeddingData.skills),
        confidence: 0.88
      }
    };

    return processedEmbedding;
  }

  async processProfileEmbedding(embeddingData) {
    // Mock profile embedding processing
    const processedEmbedding = {
      ...embeddingData,
      type: 'profile',
      model: embeddingData.model || 'profile-embedding-model',
      dimensions: embeddingData.vector ? embeddingData.vector.length : 1024,
      encoding: 'float32',
      normalized: this.normalizeVector(embeddingData.vector),
      metadata: {
        profileCompleteness: this.calculateProfileCompleteness(embeddingData.profile),
        dataSources: this.identifyDataSources(embeddingData.profile),
        freshness: this.assessProfileFreshness(embeddingData.profile),
        confidence: 0.92
      }
    };

    return processedEmbedding;
  }

  async processSemanticEmbedding(embeddingData) {
    // Mock semantic embedding processing
    const processedEmbedding = {
      ...embeddingData,
      type: 'semantic',
      model: embeddingData.model || 'semantic-embedding-model',
      dimensions: embeddingData.vector ? embeddingData.vector.length : 512,
      encoding: 'float32',
      normalized: this.normalizeVector(embeddingData.vector),
      metadata: {
        semanticContext: embeddingData.context || 'candidate_profile',
        relationships: this.identifySemanticRelationships(embeddingData),
        concepts: this.extractSemanticConcepts(embeddingData),
        confidence: 0.89
      }
    };

    return processedEmbedding;
  }

  async processGenericEmbedding(embeddingData) {
    // Mock generic embedding processing
    const processedEmbedding = {
      ...embeddingData,
      type: 'generic',
      model: embeddingData.model || 'generic-embedding-model',
      dimensions: embeddingData.vector ? embeddingData.vector.length : 256,
      encoding: 'float32',
      normalized: this.normalizeVector(embeddingData.vector),
      metadata: {
        processedBy: 'embedding-event-handler',
        processingTime: Date.now(),
        confidence: 0.85
      }
    };

    return processedEmbedding;
  }

  async updateCandidateWithEmbedding(candidate, embeddingData, embeddingType) {
    // Update candidate with embedding data
    if (!candidate.embeddings) {
      candidate.embeddings = {};
    }

    candidate.embeddings[embeddingType] = embeddingData;
    candidate.lastEmbeddingUpdate = new Date();
    candidate.lastUpdated = new Date();
    
    await candidate.save();
  }

  async updateCandidateWithIndexingStatus(candidate, indexingData, indexingType, indexes) {
    // Update candidate with indexing status
    if (!candidate.indexingStatus) {
      candidate.indexingStatus = {};
    }

    for (const index of indexes) {
      candidate.indexingStatus[index] = {
        status: indexingData.status || 'completed',
        indexingType: indexingType,
        indexedAt: new Date(),
        lastUpdate: new Date()
      };
    }

    candidate.lastIndexingUpdate = new Date();
    candidate.lastUpdated = new Date();
    
    await candidate.save();
  }

  validateEmbeddingData(embeddingData) {
    const errors = [];
    
    if (!embeddingData || typeof embeddingData !== 'object') {
      errors.push('Embedding data must be an object');
    }
    
    if (!embeddingData.vector || !Array.isArray(embeddingData.vector)) {
      errors.push('Embedding must contain a vector array');
    }
    
    if (embeddingData.vector && embeddingData.vector.length === 0) {
      errors.push('Embedding vector cannot be empty');
    }
    
    if (embeddingData.vector && embeddingData.vector.some(val => typeof val !== 'number')) {
      errors.push('Embedding vector must contain only numbers');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateIndexingData(indexingData) {
    const errors = [];
    
    if (!indexingData || typeof indexingData !== 'object') {
      errors.push('Indexing data must be an object');
    }
    
    if (!indexingData.indexes || !Array.isArray(indexingData.indexes)) {
      errors.push('Indexing data must contain an indexes array');
    }
    
    if (!indexingData.status || typeof indexingData.status !== 'string') {
      errors.push('Indexing data must contain a status string');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Helper methods for embedding processing
  normalizeVector(vector) {
    if (!vector || !Array.isArray(vector)) return [];
    
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude === 0) return vector;
    
    return vector.map(val => val / magnitude);
  }

  estimateTokenCount(text) {
    if (!text) return 0;
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  detectLanguage(text) {
    if (!text) return 'unknown';
    // Mock language detection
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with'];
    const words = text.toLowerCase().split(' ');
    const englishWordCount = words.filter(word => englishWords.includes(word)).length;
    
    return englishWordCount > words.length * 0.1 ? 'english' : 'unknown';
  }

  categorizeSkills(skills) {
    if (!skills || !Array.isArray(skills)) return [];
    
    const categories = {};
    skills.forEach(skill => {
      const category = skill.category || 'technical';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category]++;
    });
    
    return Object.keys(categories);
  }

  assessExperienceLevel(skills) {
    if (!skills || !Array.isArray(skills)) return 'unknown';
    
    const avgExperience = skills.reduce((sum, skill) => sum + (skill.experience || 0), 0) / skills.length;
    
    if (avgExperience < 2) return 'junior';
    if (avgExperience < 5) return 'mid';
    if (avgExperience < 10) return 'senior';
    return 'expert';
  }

  calculateProfileCompleteness(profile) {
    if (!profile) return 0;
    
    const requiredFields = ['name', 'email', 'experience', 'skills'];
    const presentFields = requiredFields.filter(field => profile[field] && profile[field].length > 0);
    
    return presentFields.length / requiredFields.length;
  }

  identifyDataSources(profile) {
    const sources = [];
    
    if (profile.githubData) sources.push('github');
    if (profile.linkedinData) sources.push('linkedin');
    if (profile.portfolioData) sources.push('portfolio');
    if (profile.resumeData) sources.push('resume');
    
    return sources;
  }

  assessProfileFreshness(profile) {
    if (!profile) return 'unknown';
    
    const now = new Date();
    let latestUpdate = null;
    
    if (profile.lastProfileUpdate) {
      latestUpdate = new Date(profile.lastProfileUpdate);
    } else if (profile.lastUpdated) {
      latestUpdate = new Date(profile.lastUpdated);
    }
    
    if (!latestUpdate) return 'unknown';
    
    const daysSinceUpdate = (now - latestUpdate) / (24 * 60 * 60 * 1000);
    
    if (daysSinceUpdate < 7) return 'fresh';
    if (daysSinceUpdate < 30) return 'recent';
    if (daysSinceUpdate < 90) return 'stale';
    return 'very_stale';
  }

  identifySemanticRelationships(embeddingData) {
    // Mock semantic relationship identification
    return [
      { type: 'skill_similarity', confidence: 0.85 },
      { type: 'experience_correlation', confidence: 0.78 },
      { type: 'industry_alignment', confidence: 0.72 }
    ];
  }

  extractSemanticConcepts(embeddingData) {
    // Mock semantic concept extraction
    return [
      { concept: 'software_development', weight: 0.92 },
      { concept: 'technical_leadership', weight: 0.78 },
      { concept: 'problem_solving', weight: 0.85 }
    ];
  }

  getCompletedIndexes(candidate, requiredIndexes) {
    const completedIndexes = [];
    
    if (candidate.indexingStatus) {
      for (const index of requiredIndexes) {
        if (candidate.indexingStatus[index] && 
            candidate.indexingStatus[index].status === 'completed') {
          completedIndexes.push(index);
        }
      }
    }
    
    return completedIndexes;
  }

  async subscribeToEventBus() {
    // Subscribe to relevant local events
    await eventBusService.subscribe('candidate.refresh', async (event) => {
      try {
        const { candidateId, refreshType } = event.payload;
        
        if (refreshType === 'embedding' || refreshType === 'full') {
          // Re-publish embedding event for refresh
          const candidate = await SourcingCandidate.findById(candidateId);
          if (candidate && candidate.embeddings) {
            for (const [embeddingType, embeddingData] of Object.entries(candidate.embeddings)) {
              await ingestionEventPublisherService.publishCandidateEmbedding(
                candidateId,
                embeddingData,
                {
                  correlationId: event.metadata.correlationId,
                  priority: 'normal'
                }
              );
            }
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
          stage: 'embedding-event-handler',
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
      
      console.log('Embedding event handler shutdown complete');
    } catch (error) {
      console.error('Error shutting down embedding event handler:', error);
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
      embedded: 0,
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

export const embeddingEventHandlerService = new EmbeddingEventHandlerService();
export default embeddingEventHandlerService;
