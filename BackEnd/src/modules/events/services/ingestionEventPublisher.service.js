import { kafkaProducerService } from './kafkaProducer.service.js';
import { v4 as uuidv4 } from 'uuid';

export class IngestionEventPublisherService {
  constructor() {
    this.topics = {
      CANDIDATE_DISCOVERY: 'candidate.discovery',
      CANDIDATE_NORMALIZATION: 'candidate.normalization',
      CANDIDATE_DEDUPLICATION: 'candidate.deduplication',
      CANDIDATE_CREATED: 'candidate.created',
      CANDIDATE_EMBEDDING: 'candidate.embedding',
      CANDIDATE_ENRICHMENT: 'candidate.enrichment',
      CANDIDATE_INDEXING: 'candidate.indexing',
      CANDIDATE_SIGNALS: 'candidate.signals',
      CANDIDATE_REFRESH: 'candidate.refresh'
    };
    this.defaultOptions = {
      retry: true,
      maxRetries: 3,
      priority: 'normal'
    };
  }

  async publishCandidateDiscovery(candidateData, source, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.discovered',
      payload: {
        candidateId: candidateData.id,
        source: source || 'unknown',
        data: candidateData,
        discoveryType: this.determineDiscoveryType(candidateData),
        discoveredAt: new Date().toISOString()
      },
      metadata: {
        source: 'ingestion-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_DISCOVERY,
      event,
      {
        ...options,
        key: candidateData.id || uuidv4(),
        headers: {
          'discovery-source': source,
          'discovery-type': event.payload.discoveryType
        }
      }
    );
  }

  async publishCandidateNormalization(candidateId, normalizedData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.normalized',
      payload: {
        candidateId,
        normalizedData,
        normalizationType: this.determineNormalizationType(normalizedData),
        normalizedAt: new Date().toISOString(),
        fieldsNormalized: this.getNormalizedFields(normalizedData)
      },
      metadata: {
        source: 'normalization-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_NORMALIZATION,
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'normalization-type': event.payload.normalizationType,
          'fields-count': event.payload.fieldsNormalized.length.toString()
        }
      }
    );
  }

  async publishCandidateDeduplication(candidateId, duplicateData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.deduplicated',
      payload: {
        candidateId,
        duplicateData,
        deduplicationType: this.determineDeduplicationType(duplicateData),
        deduplicatedAt: new Date().toISOString(),
        duplicatesFound: duplicateData.duplicates || [],
        action: duplicateData.action || 'merge'
      },
      metadata: {
        source: 'deduplication-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_DEDUPLICATION,
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'deduplication-type': event.payload.deduplicationType,
          'duplicates-count': event.payload.duplicatesFound.length.toString(),
          'action': event.payload.action
        }
      }
    );
  }

  async publishCandidateCreated(candidateId, candidateData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.created',
      payload: {
        candidateId,
        candidateData,
        createdAt: new Date().toISOString(),
        source: candidateData.source || 'unknown',
        status: candidateData.status || 'active',
        completeness: this.calculateCompleteness(candidateData)
      },
      metadata: {
        source: 'candidate-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_CREATED,
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'candidate-source': event.payload.source,
          'candidate-status': event.payload.status,
          'completeness-score': event.payload.completeness.toString()
        }
      }
    );
  }

  async publishCandidateEmbedding(candidateId, embeddingData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.embedded',
      payload: {
        candidateId,
        embeddingData,
        embeddingType: this.determineEmbeddingType(embeddingData),
        embeddedAt: new Date().toISOString(),
        vectorDimensions: embeddingData.vector ? embeddingData.vector.length : 0,
        embeddingModel: embeddingData.model || 'default'
      },
      metadata: {
        source: 'embedding-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_EMBEDDING,
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'embedding-type': event.payload.embeddingType,
          'vector-dimensions': event.payload.vectorDimensions.toString(),
          'embedding-model': event.payload.embeddingModel
        }
      }
    );
  }

  async publishCandidateEnrichment(candidateId, enrichmentData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.enriched',
      payload: {
        candidateId,
        enrichmentData,
        enrichmentType: this.determineEnrichmentType(enrichmentData),
        enrichedAt: new Date().toISOString(),
        enrichedFields: this.getEnrichedFields(enrichmentData),
        enrichmentSource: enrichmentData.source || 'external'
      },
      metadata: {
        source: 'enrichment-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_ENRICHMENT,
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'enrichment-type': event.payload.enrichmentType,
          'enriched-fields-count': event.payload.enrichedFields.length.toString(),
          'enrichment-source': event.payload.enrichmentSource
        }
      }
    );
  }

  async publishCandidateIndexing(candidateId, indexingData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.indexed',
      payload: {
        candidateId,
        indexingData,
        indexingType: this.determineIndexingType(indexingData),
        indexedAt: new Date().toISOString(),
        indexes: indexingData.indexes || [],
        indexingStatus: indexingData.status || 'completed'
      },
      metadata: {
        source: 'indexing-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_INDEXING,
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'indexing-type': event.payload.indexingType,
          'indexes-count': event.payload.indexes.length.toString(),
          'indexing-status': event.payload.indexingStatus
        }
      }
    );
  }

  async publishCandidateSignals(candidateId, signalsData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.signals.generated',
      payload: {
        candidateId,
        signalsData,
        signalType: this.determineSignalType(signalsData),
        signalsGeneratedAt: new Date().toISOString(),
        signalCount: this.countSignals(signalsData),
        signalCategories: this.getSignalCategories(signalsData)
      },
      metadata: {
        source: 'signals-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_SIGNALS,
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'signal-type': event.payload.signalType,
          'signal-count': event.payload.signalCount.toString(),
          'signal-categories': event.payload.signalCategories.join(',')
        }
      }
    );
  }

  async publishCandidateRefresh(candidateId, refreshData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.refreshed',
      payload: {
        candidateId,
        refreshData,
        refreshType: this.determineRefreshType(refreshData),
        refreshedAt: new Date().toISOString(),
        refreshReason: refreshData.reason || 'scheduled',
        fieldsUpdated: this.getUpdatedFields(refreshData)
      },
      metadata: {
        source: 'refresh-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: options.priority || this.defaultOptions.priority
      }
    };

    return await kafkaProducerService.publishEvent(
      this.topics.CANDIDATE_REFRESH,
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'refresh-type': event.payload.refreshType,
          'refresh-reason': event.payload.refreshReason,
          'updated-fields-count': event.payload.fieldsUpdated.length.toString()
        }
      }
    );
  }

  async publishBatchEvents(events, options = {}) {
    const batchId = uuidv4();
    const batchEvents = events.map(eventData => {
      const { type, payload, topic } = eventData;
      
      return {
        type,
        payload: {
          ...payload,
          batchId,
          batchIndex: events.indexOf(eventData)
        },
        metadata: {
          source: 'ingestion-service',
          version: '1.0',
          correlationId: options.correlationId || uuidv4(),
          priority: options.priority || this.defaultOptions.priority,
          batchId,
          batchSize: events.length
        }
      };
    });

    // Group events by topic
    const topicGroups = batchEvents.reduce((groups, event) => {
      const topicName = this.getTopicByType(event.type);
      if (!groups[topicName]) {
        groups[topicName] = [];
      }
      groups[topicName].push(event);
      return groups;
    }, {});

    const results = [];
    
    for (const [topic, topicEvents] of Object.entries(topicGroups)) {
      const result = await kafkaProducerService.publishBatch(
        topic,
        topicEvents,
        {
          ...options,
          batchId,
          headers: {
            'batch-id': batchId,
            'batch-size': topicEvents.length.toString()
          }
        }
      );
      results.push(result);
    }

    return {
      batchId,
      results,
      totalEvents: events.length,
      topics: Object.keys(topicGroups)
    };
  }

  async publishProcessingError(candidateId, errorData, options = {}) {
    const event = {
      id: uuidv4(),
      type: 'candidate.processing.error',
      payload: {
        candidateId,
        errorData,
        errorType: this.determineErrorType(errorData),
        errorStage: errorData.stage || 'unknown',
        errorAt: new Date().toISOString(),
        errorMessage: errorData.message || 'Unknown error',
        retryable: this.isRetryableError(errorData)
      },
      metadata: {
        source: 'error-service',
        version: '1.0',
        correlationId: options.correlationId || uuidv4(),
        priority: 'high' // Error events have high priority
      }
    };

    return await kafkaProducerService.publishEvent(
      'candidate.processing.errors',
      event,
      {
        ...options,
        key: candidateId,
        headers: {
          'error-type': event.payload.errorType,
          'error-stage': event.payload.errorStage,
          'retryable': event.payload.retryable.toString()
        }
      }
    );
  }

  // Helper methods
  determineDiscoveryType(candidateData) {
    if (candidateData.github) return 'github';
    if (candidateData.portfolio) return 'portfolio';
    if (candidateData.resume) return 'resume';
    if (candidateData.linkedin) return 'linkedin';
    return 'unknown';
  }

  determineNormalizationType(normalizedData) {
    if (normalizedData.skills) return 'skills_normalization';
    if (normalizedData.experience) return 'experience_normalization';
    if (normalizedData.education) return 'education_normalization';
    return 'full_normalization';
  }

  determineDeduplicationType(duplicateData) {
    if (duplicateData.emailMatch) return 'email_deduplication';
    if (duplicateData.nameMatch) return 'name_deduplication';
    if (duplicateData.skillMatch) return 'skill_deduplication';
    return 'comprehensive_deduplication';
  }

  determineEmbeddingType(embeddingData) {
    if (embeddingData.type) return embeddingData.type;
    if (embeddingData.text) return 'text_embedding';
    if (embeddingData.skills) return 'skills_embedding';
    return 'profile_embedding';
  }

  determineEnrichmentType(enrichmentData) {
    if (enrichmentData.company) return 'company_enrichment';
    if (enrichmentData.skills) return 'skills_enrichment';
    if (enrichmentData.education) return 'education_enrichment';
    return 'comprehensive_enrichment';
  }

  determineIndexingType(indexingData) {
    if (indexingData.elasticsearch) return 'elasticsearch_indexing';
    if (indexingData.qdrant) return 'qdrant_indexing';
    if (indexingData.both) return 'dual_indexing';
    return 'standard_indexing';
  }

  determineSignalType(signalsData) {
    if (signalsData.talentSignals) return 'talent_signals';
    if (signalsData.freshness) return 'freshness_signals';
    if (signalsData.engagement) return 'engagement_signals';
    return 'comprehensive_signals';
  }

  determineRefreshType(refreshData) {
    if (refreshData.full) return 'full_refresh';
    if (refreshData.incremental) return 'incremental_refresh';
    if (refreshData.signals) return 'signals_refresh';
    return 'standard_refresh';
  }

  determineErrorType(errorData) {
    if (errorData.validation) return 'validation_error';
    if (errorData.network) return 'network_error';
    if (errorData.timeout) return 'timeout_error';
    if (errorData.rateLimit) return 'rate_limit_error';
    return 'processing_error';
  }

  getNormalizedFields(normalizedData) {
    return Object.keys(normalizedData).filter(key => 
      normalizedData[key] !== null && normalizedData[key] !== undefined
    );
  }

  getEnrichedFields(enrichmentData) {
    return Object.keys(enrichmentData).filter(key => 
      key !== 'source' && enrichmentData[key] !== null && enrichmentData[key] !== undefined
    );
  }

  getUpdatedFields(refreshData) {
    return Object.keys(refreshData).filter(key => 
      key !== 'reason' && refreshData[key] !== null && refreshData[key] !== undefined
    );
  }

  calculateCompleteness(candidateData) {
    const requiredFields = ['name', 'email', 'experience', 'skills'];
    const presentFields = requiredFields.filter(field => 
      candidateData[field] && candidateData[field].length > 0
    );
    return presentFields.length / requiredFields.length;
  }

  countSignals(signalsData) {
    let count = 0;
    for (const category of Object.values(signalsData)) {
      if (typeof category === 'object' && category !== null) {
        count += Object.keys(category).length;
      }
    }
    return count;
  }

  getSignalCategories(signalsData) {
    return Object.keys(signalsData);
  }

  isRetryableError(errorData) {
    const retryableErrors = ['network_error', 'timeout_error', 'rate_limit_error'];
    return retryableErrors.includes(this.determineErrorType(errorData));
  }

  getTopicByType(eventType) {
    const topicMapping = {
      'candidate.discovered': this.topics.CANDIDATE_DISCOVERY,
      'candidate.normalized': this.topics.CANDIDATE_NORMALIZATION,
      'candidate.deduplicated': this.topics.CANDIDATE_DEDUPLICATION,
      'candidate.created': this.topics.CANDIDATE_CREATED,
      'candidate.embedded': this.topics.CANDIDATE_EMBEDDING,
      'candidate.enriched': this.topics.CANDIDATE_ENRICHMENT,
      'candidate.indexed': this.topics.CANDIDATE_INDEXING,
      'candidate.signals.generated': this.topics.CANDIDATE_SIGNALS,
      'candidate.refreshed': this.topics.CANDIDATE_REFRESH
    };
    
    return topicMapping[eventType] || 'candidate.unknown';
  }

  async createTopics() {
    const topics = Object.values(this.topics);
    const results = [];
    
    for (const topic of topics) {
      try {
        const result = await kafkaProducerService.createTopic(topic, {
          numPartitions: 3,
          replicationFactor: 1,
          retensionMs: 604800000, // 7 days
          cleanupPolicy: 'delete'
        });
        results.push({ topic, result });
      } catch (error) {
        console.error(`Failed to create topic ${topic}:`, error);
        results.push({ topic, error: error.message });
      }
    }
    
    return results;
  }

  async getPublisherMetrics() {
    return await kafkaProducerService.getMetrics();
  }
}

export const ingestionEventPublisherService = new IngestionEventPublisherService();
export default ingestionEventPublisherService;
