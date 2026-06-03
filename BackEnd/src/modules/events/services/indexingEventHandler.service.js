import { kafkaConsumerService } from './kafkaConsumer.service.js';
import { ingestionEventPublisherService } from './ingestionEventPublisher.service.js';
import { SourcingCandidate } from '../../../../models/sourcing/sourcingCandidate.model.js';
import { eventBusService } from './eventBus.service.js';
import { v4 as uuidv4 } from 'uuid';

export class IndexingEventHandlerService {
  constructor() {
    this.consumerId = null;
    this.topics = [
      'candidate.indexing',
      'candidate.signals'
    ];
    this.processingStats = {
      indexed: 0,
      processed: 0,
      failed: 0,
      processingTime: []
    };
  }

  async initialize() {
    try {
      this.consumerId = await kafkaConsumerService.createConsumer(
        'indexing-event-handler-group',
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

      console.log('Indexing event handler initialized');
      console.log(`Consumer ID: ${this.consumerId}`);
      console.log(`Subscribed to topics: ${this.topics.join(', ')}`);

    } catch (error) {
      console.error('Failed to initialize indexing event handler:', error);
      throw error;
    }
  }

  async handleEvent(event) {
    const startTime = Date.now();
    
    try {
      console.log(`Processing indexing event: ${event.type}`, {
        eventId: event.id,
        correlationId: event.metadata.correlationId
      });

      switch (event.type) {
        case 'candidate.indexed':
          await this.handleCandidateIndexed(event);
          break;
          
        case 'candidate.signals.generated':
          await this.handleCandidateSignalsGenerated(event);
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
      console.error(`Error processing indexing event: ${event.type}`, error);
      this.processingStats.failed++;
      
      // Publish error event
      await this.publishErrorEvent(event, error);
      
      throw error;
    }
  }

  async handleCandidateIndexed(event) {
    const { candidateId, indexingData, indexingType, indexes, indexingStatus } = event.payload;
    
    try {
      // Find candidate
      const candidate = await SourcingCandidate.findById(candidateId);
      
      if (!candidate) {
        console.warn(`Candidate not found for indexing: ${candidateId}`);
        return null;
      }

      // Validate indexing data
      const validationResult = this.validateIndexingData(indexingData);
      
      if (!validationResult.valid) {
        console.warn(`Invalid indexing data for candidate: ${candidateId}`, validationResult.errors);
        return null;
      }

      // Process indexing based on type and indexes
      const indexingResult = await this.processIndexing(candidate, indexingData, indexingType, indexes);
      
      // Update candidate with indexing result
      await this.updateCandidateWithIndexingResult(candidate, indexingResult, indexingType, indexes);

      // Update stats
      this.processingStats.indexed++;

      // Check if all indexes are complete
      const requiredIndexes = ['elasticsearch', 'qdrant'];
      const completedIndexes = this.getCompletedIndexes(candidate, requiredIndexes);
      
      if (completedIndexes.length === requiredIndexes.length) {
        // Publish candidate refresh event
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
          source: 'indexing-event-handler',
          correlationId: event.metadata.correlationId
        });

        console.log(`All indexing completed for candidate: ${candidateId}`, {
          completedIndexes
        });
      }

      // Emit local event
      await eventBusService.publishEvent('candidate.indexing.processed', {
        candidateId,
        indexingType,
        indexes,
        status: indexingStatus
      }, {
        source: 'indexing-event-handler',
        correlationId: event.metadata.correlationId
      });

      console.log(`Candidate indexing processed: ${candidateId}`, {
        indexingType,
        indexes,
        status: indexingStatus
      });

      return indexingResult;

    } catch (error) {
      console.error(`Error handling candidate indexing: ${candidateId}`, error);
      throw error;
    }
  }

  async handleCandidateSignalsGenerated(event) {
    const { candidateId, signalsData, signalType, signalCount, signalCategories } = event.payload;
    
    try {
      // Find candidate
      const candidate = await SourcingCandidate.findById(candidateId);
      
      if (!candidate) {
        console.warn(`Candidate not found for signals processing: ${candidateId}`);
        return null;
      }

      // Validate signals data
      const validationResult = this.validateSignalsData(signalsData);
      
      if (!validationResult.valid) {
        console.warn(`Invalid signals data for candidate: ${candidateId}`, validationResult.errors);
        return null;
      }

      // Process signals based on type
      const processedSignals = await this.processSignals(signalsData, signalType);
      
      // Update candidate with signals data
      await this.updateCandidateWithSignals(candidate, processedSignals, signalType);

      // Update stats
      this.processingStats.processed++;

      // Update indexes with new signals
      await this.updateIndexesWithSignals(candidate, processedSignals);

      // Emit local event
      await eventBusService.publishEvent('candidate.signals.indexed', {
        candidateId,
        signalType,
        signalCount,
        signalCategories
      }, {
        source: 'indexing-event-handler',
        correlationId: event.metadata.correlationId
      });

      console.log(`Candidate signals processed and indexed: ${candidateId}`, {
        signalType,
        signalCount,
        signalCategories
      });

      return processedSignals;

    } catch (error) {
      console.error(`Error handling candidate signals: ${candidateId}`, error);
      throw error;
    }
  }

  async processIndexing(candidate, indexingData, indexingType, indexes) {
    const indexingResult = {
      candidateId: candidate._id,
      indexingType,
      indexes: [],
      results: {},
      errors: [],
      timestamp: new Date().toISOString()
    };

    try {
      // Process each index
      for (const index of indexes) {
        try {
          const indexResult = await this.processIndex(candidate, indexingData, index);
          
          if (indexResult.success) {
            indexingResult.results[index] = indexResult.data;
            indexingResult.indexes.push(index);
          } else {
            indexingResult.errors.push({
              index,
              error: indexResult.error
            });
          }
        } catch (error) {
          console.error(`Error processing index ${index}:`, error);
          indexingResult.errors.push({
            index,
            error: error.message
          });
        }
      }

      indexingResult.success = indexingResult.errors.length === 0;
      indexingResult.processedIndexesCount = indexingResult.indexes.length;
      indexingResult.errorsCount = indexingResult.errors.length;

    } catch (error) {
      console.error('Error processing indexing:', error);
      indexingResult.success = false;
      indexingResult.errors.push({
        error: error.message
      });
    }

    return indexingResult;
  }

  async processIndex(candidate, indexingData, index) {
    switch (index) {
      case 'elasticsearch':
        return await this.processElasticsearchIndexing(candidate, indexingData);
        
      case 'qdrant':
        return await this.processQdrantIndexing(candidate, indexingData);
        
      default:
        return {
          success: false,
          error: `Unknown index: ${index}`,
          data: null
        };
    }
  }

  async processElasticsearchIndexing(candidate, indexingData) {
    try {
      // Mock Elasticsearch indexing - would integrate with actual Elasticsearch client
      const esDocument = {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        location: candidate.location,
        summary: candidate.summary,
        skills: candidate.skills || [],
        experience: candidate.experience || [],
        education: candidate.education || [],
        source: candidate.source,
        status: candidate.status,
        discoveredAt: candidate.discoveredAt,
        lastUpdated: candidate.lastUpdated,
        // Include enrichment data
        companyEnrichment: candidate.companyEnrichment,
        skillsEnrichment: candidate.skillsEnrichment,
        educationEnrichment: candidate.educationEnrichment,
        // Include embedding data
        embeddings: candidate.embeddings,
        // Include signals data
        signals: candidate.signals
      };

      // Mock indexing operation
      const indexingResult = {
        success: true,
        data: {
          documentId: candidate._id,
          index: 'candidates',
          operation: 'index',
          timestamp: new Date().toISOString(),
          document: esDocument
        }
      };

      console.log(`Elasticsearch indexing completed for candidate: ${candidate._id}`);
      return indexingResult;

    } catch (error) {
      console.error(`Error in Elasticsearch indexing for candidate: ${candidate._id}`, error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async processQdrantIndexing(candidate, indexingData) {
    try {
      // Mock Qdrant indexing - would integrate with actual Qdrant client
      const vectorData = candidate.embeddings?.profile?.vector || [];
      
      if (vectorData.length === 0) {
        return {
          success: false,
          error: 'No embedding vector available for Qdrant indexing',
          data: null
        };
      }

      const qdrantPoint = {
        id: candidate._id,
        vector: vectorData,
        payload: {
          candidateId: candidate._id,
          name: candidate.name,
          email: candidate.email,
          location: candidate.location,
          skills: candidate.skills || [],
          experience: candidate.experience || [],
          source: candidate.source,
          status: candidate.status,
          discoveredAt: candidate.discoveredAt,
          lastUpdated: candidate.lastUpdated,
          // Include enrichment data
          companyEnrichment: candidate.companyEnrichment,
          skillsEnrichment: candidate.skillsEnrichment,
          // Include signals data
          signals: candidate.signals
        }
      };

      // Mock indexing operation
      const indexingResult = {
        success: true,
        data: {
          pointId: candidate._id,
          collection: 'candidates',
          operation: 'upsert',
          timestamp: new Date().toISOString(),
          point: qdrantPoint,
          vectorDimensions: vectorData.length
        }
      };

      console.log(`Qdrant indexing completed for candidate: ${candidate._id}`);
      return indexingResult;

    } catch (error) {
      console.error(`Error in Qdrant indexing for candidate: ${candidate._id}`, error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async processSignals(signalsData, signalType) {
    try {
      // Mock signals processing - would integrate with actual signal processing
      const processedSignals = {
        ...signalsData,
        processedAt: new Date().toISOString(),
        processor: 'indexing-event-handler',
        signalType,
        processedCategories: Object.keys(signalsData),
        signalScores: this.calculateSignalScores(signalsData),
        aggregatedScore: this.calculateAggregatedSignalScore(signalsData)
      };

      return processedSignals;

    } catch (error) {
      console.error('Error processing signals:', error);
      throw error;
    }
  }

  async updateCandidateWithIndexingResult(candidate, indexingResult, indexingType, indexes) {
    // Update candidate with indexing status
    if (!candidate.indexingStatus) {
      candidate.indexingStatus = {};
    }

    for (const index of indexes) {
      if (indexingResult.results[index]) {
        candidate.indexingStatus[index] = {
          status: 'completed',
          indexingType,
          indexedAt: new Date(),
          lastUpdate: new Date(),
          result: indexingResult.results[index]
        };
      }
    }

    candidate.lastIndexingUpdate = new Date();
    candidate.lastUpdated = new Date();
    
    await candidate.save();
  }

  async updateCandidateWithSignals(candidate, processedSignals, signalType) {
    // Update candidate with signals data
    if (!candidate.signals) {
      candidate.signals = {};
    }

    candidate.signals[signalType] = processedSignals;
    candidate.lastSignalsUpdate = new Date();
    candidate.lastUpdated = new Date();
    
    await candidate.save();
  }

  async updateIndexesWithSignals(candidate, processedSignals) {
    // Update Elasticsearch with signals
    await this.updateElasticsearchWithSignals(candidate, processedSignals);
    
    // Update Qdrant with signals
    await this.updateQdrantWithSignals(candidate, processedSignals);
  }

  async updateElasticsearchWithSignals(candidate, processedSignals) {
    try {
      // Mock Elasticsearch update with signals
      const updateDocument = {
        signals: candidate.signals,
        lastSignalsUpdate: candidate.lastSignalsUpdate
      };

      console.log(`Elasticsearch updated with signals for candidate: ${candidate._id}`);
      return updateDocument;

    } catch (error) {
      console.error(`Error updating Elasticsearch with signals for candidate: ${candidate._id}`, error);
      throw error;
    }
  }

  async updateQdrantWithSignals(candidate, processedSignals) {
    try {
      // Mock Qdrant update with signals
      const updatePayload = {
        signals: candidate.signals,
        lastSignalsUpdate: candidate.lastSignalsUpdate
      };

      console.log(`Qdrant updated with signals for candidate: ${candidate._id}`);
      return updatePayload;

    } catch (error) {
      console.error(`Error updating Qdrant with signals for candidate: ${candidate._id}`, error);
      throw error;
    }
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

  validateSignalsData(signalsData) {
    const errors = [];
    
    if (!signalsData || typeof signalsData !== 'object') {
      errors.push('Signals data must be an object');
    }
    
    if (Object.keys(signalsData).length === 0) {
      errors.push('Signals data cannot be empty');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
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

  calculateSignalScores(signalsData) {
    const scores = {};
    
    for (const [category, signals] of Object.entries(signalsData)) {
      if (typeof signals === 'object' && signals !== null) {
        let categoryScore = 0;
        let signalCount = 0;
        
        for (const [signalName, signalValue] of Object.entries(signals)) {
          if (typeof signalValue === 'number') {
            categoryScore += signalValue;
            signalCount++;
          }
        }
        
        scores[category] = signalCount > 0 ? categoryScore / signalCount : 0;
      }
    }
    
    return scores;
  }

  calculateAggregatedSignalScore(signalsData) {
    const scores = this.calculateSignalScores(signalsData);
    const scoreValues = Object.values(scores);
    
    if (scoreValues.length === 0) return 0;
    
    return scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
  }

  async subscribeToEventBus() {
    // Subscribe to relevant local events
    await eventBusService.subscribe('candidate.refresh', async (event) => {
      try {
        const { candidateId, refreshType } = event.payload;
        
        if (refreshType === 'indexing' || refreshType === 'full') {
          // Re-publish indexing event for refresh
          const candidate = await SourcingCandidate.findById(candidateId);
          if (candidate) {
            await ingestionEventPublisherService.publishCandidateIndexing(
              candidateId,
              {
                candidate: candidate.toObject(),
                refresh: true,
                refreshType
              },
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
          stage: 'indexing-event-handler',
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
      
      console.log('Indexing event handler shutdown complete');
    } catch (error) {
      console.error('Error shutting down indexing event handler:', error);
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
      indexed: 0,
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

export const indexingEventHandlerService = new IndexingEventHandlerService();
export default indexingEventHandlerService;
