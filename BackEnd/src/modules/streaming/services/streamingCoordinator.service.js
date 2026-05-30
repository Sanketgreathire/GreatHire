import { kafkaProducerService } from '../../events/services/kafkaProducer.service.js';
import { kafkaConsumerService } from '../../events/services/kafkaConsumer.service.js';
import { ingestionEventPublisherService } from '../../events/services/ingestionEventPublisher.service.js';
import { discoveryEventHandlerService } from '../../events/services/discoveryEventHandler.service.js';
import { enrichmentEventHandlerService } from '../../events/services/enrichmentEventHandler.service.js';
import { embeddingEventHandlerService } from '../../events/services/embeddingEventHandler.service.js';
import { indexingEventHandlerService } from '../../events/services/indexingEventHandler.service.js';
import { candidateLifecycleService } from '../../events/services/candidateLifecycle.service.js';
import { eventBusService } from '../../events/services/eventBus.service.js';
import { v4 as uuidv4 } from 'uuid';

export class StreamingCoordinatorService {
  constructor() {
    this.isInitialized = false;
    this.services = {
      producer: kafkaProducerService,
      consumer: kafkaConsumerService,
      eventPublisher: ingestionEventPublisherService,
      discoveryHandler: discoveryEventHandlerService,
      enrichmentHandler: enrichmentEventHandlerService,
      embeddingHandler: embeddingEventHandlerService,
      indexingHandler: indexingEventHandlerService,
      lifecycleService: candidateLifecycleService,
      eventBus: eventBusService
    };
    this.coordinatorMetrics = {
      servicesStarted: 0,
      servicesFailed: 0,
      totalEventsProcessed: 0,
      totalEventsFailed: 0,
      averageProcessingTime: 0,
      uptime: Date.now()
    };
    this.healthChecks = new Map();
    this.autoScalingHooks = new Map();
  }

  async initialize() {
    try {
      console.log('Initializing streaming coordinator...');
      
      // Try Kafka — if unavailable, skip gracefully
      try {
        await this.services.producer.connect();
        await this.services.consumer.connect();
        await this.createKafkaTopics();
        await this.initializeEventHandlers();
        this.initializeEventBus();
        this.coordinatorMetrics.servicesStarted = 8;
        console.log('✅ Streaming coordinator fully initialized with Kafka');
      } catch (kafkaErr) {
        console.warn('⚠️  Kafka unavailable — streaming coordinator running in degraded mode (BullMQ only):', kafkaErr.message);
        this.coordinatorMetrics.servicesFailed++;
      }

      this.startHealthMonitoring();
      this.startAutoScalingMonitoring();
      this.isInitialized = true;
      this.coordinatorMetrics.uptime = Date.now();

      return { success: true, message: 'Streaming coordinator initialized', timestamp: new Date() };
    } catch (error) {
      console.warn('⚠️  Streaming coordinator init failed (non-fatal):', error.message);
      this.isInitialized = false;
      return { success: false, message: error.message };
    }
  }

  async createKafkaTopics() {
    const topics = [
      'candidate.discovery',
      'candidate.normalization',
      'candidate.deduplication',
      'candidate.created',
      'candidate.embedding',
      'candidate.enrichment',
      'candidate.indexing',
      'candidate.signals',
      'candidate.refresh',
      'candidate.processing.errors'
    ];

    const results = [];
    
    for (const topic of topics) {
      try {
        const result = await this.services.producer.createTopic(topic, {
          numPartitions: 3,
          replicationFactor: 1,
          retensionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
          cleanupPolicy: 'delete',
          compressionType: 'gzip',
          maxMessageBytes: 1048576 // 1MB
        });
        results.push({ topic, result, success: true });
      } catch (error) {
        console.error(`Failed to create topic ${topic}:`, error);
        results.push({ topic, error: error.message, success: false });
      }
    }

    return results;
  }

  async initializeEventHandlers() {
    const handlers = [
      { name: 'discovery', service: this.services.discoveryHandler },
      { name: 'enrichment', service: this.services.enrichmentHandler },
      { name: 'embedding', service: this.services.embeddingHandler },
      { name: 'indexing', service: this.services.indexingHandler }
    ];

    const results = [];
    
    for (const handler of handlers) {
      try {
        await handler.service.initialize();
        results.push({ name: handler.name, success: true });
        console.log(`${handler.name} event handler initialized`);
      } catch (error) {
        console.error(`Failed to initialize ${handler.name} event handler:`, error);
        results.push({ name: handler.name, error: error.message, success: false });
        this.coordinatorMetrics.servicesFailed++;
      }
    }

    return results;
  }

  initializeEventBus() {
    // Subscribe to key local events for coordination
    this.services.eventBus.subscribe('candidate.discovered', async (event) => {
      try {
        await this.handleCandidateDiscovered(event);
      } catch (error) {
        console.error('Error handling candidate discovered event:', error);
      }
    });

    this.services.eventBus.subscribe('candidate.enriched', async (event) => {
      try {
        await this.handleCandidateEnriched(event);
      } catch (error) {
        console.error('Error handling candidate enriched event:', error);
      }
    });

    this.services.eventBus.subscribe('candidate.embedded', async (event) => {
      try {
        await this.handleCandidateEmbedded(event);
      } catch (error) {
        console.error('Error handling candidate embedded event:', error);
      }
    });

    this.services.eventBus.subscribe('candidate.indexed', async (event) => {
      try {
        await this.handleCandidateIndexed(event);
      } catch (error) {
        console.error('Error handling candidate indexed event:', error);
      }
    });

    this.services.eventBus.subscribe('candidate.signals.generated', async (event) => {
      try {
        await this.handleCandidateSignalsGenerated(event);
      } catch (error) {
        console.error('Error handling candidate signals generated event:', error);
      }
    });

    this.services.eventBus.subscribe('processing.error', async (event) => {
      try {
        await this.handleProcessingError(event);
      } catch (error) {
        console.error('Error handling processing error event:', error);
      }
    });
  }

  async handleCandidateDiscovered(event) {
    const { candidateId, source } = event.payload;
    
    // Track discovery in lifecycle
    await this.services.lifecycleService.trackStageStart(candidateId, 'discovered', {
      source,
      correlationId: event.metadata.correlationId
    });

    // Publish normalization event
    await this.services.eventPublisher.publishCandidateNormalization(
      candidateId,
      event.payload.data,
      {
        correlationId: event.metadata.correlationId,
        priority: 'high'
      }
    );

    this.coordinatorMetrics.totalEventsProcessed++;
  }

  async handleCandidateEnriched(event) {
    const { candidateId, enrichmentType } = event.payload;
    
    // Track enrichment in lifecycle
    await this.services.lifecycleService.trackStageCompletion(candidateId, 'enriched', {
      enrichmentType,
      correlationId: event.metadata.correlationId
    });

    // Publish embedding event
    await this.services.eventPublisher.publishCandidateEmbedding(
      candidateId,
      event.payload.enrichmentData,
      {
        correlationId: event.metadata.correlationId,
        priority: 'normal'
      }
    );

    this.coordinatorMetrics.totalEventsProcessed++;
  }

  async handleCandidateEmbedded(event) {
    const { candidateId, embeddingType } = event.payload;
    
    // Track embedding in lifecycle
    await this.services.lifecycleService.trackStageCompletion(candidateId, 'embedded', {
      embeddingType,
      correlationId: event.metadata.correlationId
    });

    // Publish indexing event
    await this.services.eventPublisher.publishCandidateIndexing(
      candidateId,
      {
        candidate: event.payload.embeddingData,
        enrichmentData: event.payload.enrichmentData,
        indexes: ['elasticsearch', 'qdrant'],
        status: 'ready'
      },
      {
        correlationId: event.metadata.correlationId,
        priority: 'high'
      }
    );

    this.coordinatorMetrics.totalEventsProcessed++;
  }

  async handleCandidateIndexed(event) {
    const { candidateId, indexes, indexingStatus } = event.payload;
    
    // Track indexing in lifecycle
    await this.services.lifecycleService.trackStageCompletion(candidateId, 'indexed', {
      indexes,
      indexingStatus,
      correlationId: event.metadata.correlationId
    });

    // Check if all required indexes are complete
    const requiredIndexes = ['elasticsearch', 'qdrant'];
    const completedIndexes = this.getCompletedIndexes(candidateId, requiredIndexes);
    
    if (completedIndexes.length === requiredIndexes.length) {
      // Publish signals generation event
      await this.services.eventPublisher.publishCandidateSignals(
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

      // Mark lifecycle as completed
      await this.services.lifecycleService.trackStageCompletion(candidateId, 'completed', {
        completedIndexes,
        correlationId: event.metadata.correlationId
      });
    }

    this.coordinatorMetrics.totalEventsProcessed++;
  }

  async handleCandidateSignalsGenerated(event) {
    const { candidateId, signalType } = event.payload;
    
    // Track signals generation in lifecycle
    await this.services.lifecycleService.trackStageCompletion(candidateId, 'signals_generated', {
      signalType,
      correlationId: event.metadata.correlationId
    });

    // Publish refresh event to complete the pipeline
    await this.services.eventPublisher.publishCandidateRefresh(
      candidateId,
      {
        signalsComplete: true,
        signalType,
        refreshType: 'post-signals',
        reason: 'pipeline_completed'
      },
      {
        correlationId: event.metadata.correlationId,
        priority: 'normal'
      }
    );

    this.coordinatorMetrics.totalEventsProcessed++;
  }

  async handleProcessingError(event) {
    const { candidateId, errorData, stage } = event.payload;
    
    // Track error in lifecycle
    await this.services.lifecycleService.trackStageFailure(candidateId, stage, new Error(errorData.error), {
      errorData,
      correlationId: event.metadata.correlationId
    });

    // Determine if retry is needed
    if (errorData.retryable) {
      await this.scheduleRetry(candidateId, stage, errorData, event.metadata.correlationId);
    } else {
      // Move to dead letter queue
      await this.moveToDeadLetter(candidateId, stage, errorData, event.metadata.correlationId);
    }

    this.coordinatorMetrics.totalEventsFailed++;
  }

  async scheduleRetry(candidateId, stage, errorData, correlationId) {
    const retryDelay = this.calculateRetryDelay(errorData.retryCount || 0);
    
    setTimeout(async () => {
      try {
        await this.services.lifecycleService.trackStageRetry(candidateId, stage, {
          retryReason: errorData.error,
          correlationId
        });

        // Re-publish the appropriate event based on stage
        switch (stage) {
          case 'discovery':
            await this.services.eventPublisher.publishCandidateDiscovery(
              candidateId,
              errorData.originalEvent?.payload?.data || {},
              errorData.originalEvent?.payload?.source || 'retry',
              {
                correlationId,
                priority: 'high'
              }
            );
            break;
            
          case 'enrichment':
            await this.services.eventPublisher.publishCandidateEnrichment(
              candidateId,
              errorData.originalEvent?.payload?.enrichmentData || {},
              {
                correlationId,
                priority: 'high'
              }
            );
            break;
            
          case 'embedding':
            await this.services.eventPublisher.publishCandidateEmbedding(
              candidateId,
              errorData.originalEvent?.payload?.embeddingData || {},
              {
                correlationId,
                priority: 'high'
              }
            );
            break;
            
          case 'indexing':
            await this.services.eventPublisher.publishCandidateIndexing(
              candidateId,
              errorData.originalEvent?.payload?.indexingData || {},
              {
                correlationId,
                priority: 'high'
              }
            );
            break;
            
          default:
            console.warn(`Unknown stage for retry: ${stage}`);
        }

        console.log(`Retry scheduled for candidate ${candidateId}, stage: ${stage}`);

      } catch (error) {
        console.error(`Error during retry for candidate ${candidateId}:`, error);
        await this.moveToDeadLetter(candidateId, stage, errorData, correlationId);
      }
    }, retryDelay);
  }

  async moveToDeadLetter(candidateId, stage, errorData, correlationId) {
    try {
      await this.services.lifecycleService.trackStageFailure(candidateId, stage, new Error('Moved to dead letter'), {
        deadLetterReason: errorData.error,
        correlationId
      });

      // Publish to dead letter topic
      await this.services.producer.publishEvent('candidate.processing.errors', {
        id: uuidv4(),
        type: 'candidate.processing.error',
        payload: {
          candidateId,
          originalEvent: errorData.originalEvent?.id || uuidv4(),
          error: errorData.error,
          stack: errorData.stack,
          stage,
          timestamp: new Date().toISOString()
        },
        metadata: {
          source: 'streaming-coordinator',
          version: '1.0',
          correlationId,
          priority: 'high'
        }
      });

      console.log(`Candidate ${candidateId} moved to dead letter queue for stage: ${stage}`);

    } catch (error) {
      console.error(`Error moving candidate to dead letter queue: ${candidateId}:`, error);
    }
  }

  calculateRetryDelay(retryCount) {
    // Exponential backoff with jitter
    const baseDelay = 5000; // 5 seconds
    const maxDelay = 300000; // 5 minutes
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    
    return delay + jitter;
  }

  getCompletedIndexes(candidateId, requiredIndexes) {
    // This would typically query the candidate's indexing status
    // For now, return a mock implementation
    return requiredIndexes;
  }

  startHealthMonitoring() {
    setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('Error during health check:', error);
      }
    }, 60000); // Every minute
  }

  async performHealthCheck() {
    const healthStatus = {
      timestamp: new Date(),
      services: {},
      overall: 'healthy'
    };

    // Check Kafka producer
    try {
      const producerHealth = await this.services.producer.healthCheck();
      healthStatus.services.producer = producerHealth;
    } catch (error) {
      healthStatus.services.producer = { status: 'unhealthy', error: error.message };
      healthStatus.overall = 'unhealthy';
    }

    // Check Kafka consumer
    try {
      const consumerHealth = await this.services.consumer.healthCheck();
      healthStatus.services.consumer = consumerHealth;
    } catch (error) {
      healthStatus.services.consumer = { status: 'unhealthy', error: error.message };
      healthStatus.overall = 'unhealthy';
    }

    // Check event handlers
    const handlers = [
      { name: 'discovery', service: this.services.discoveryHandler },
      { name: 'enrichment', service: this.services.enrichmentHandler },
      { name: 'embedding', service: this.services.embeddingHandler },
      { name: 'indexing', service: this.services.indexingHandler }
    ];

    for (const handler of handlers) {
      try {
        const handlerHealth = await handler.service.healthCheck();
        healthStatus.services[handler.name] = handlerHealth;
      } catch (error) {
        healthStatus.services[handler.name] = { status: 'unhealthy', error: error.message };
        if (healthStatus.overall === 'healthy') {
          healthStatus.overall = 'degraded';
        }
      }
    }

    // Store health check result
    this.healthChecks.set(Date.now(), healthStatus);

    // Log health status
    if (healthStatus.overall !== 'healthy') {
      console.warn('Streaming coordinator health degraded:', healthStatus);
    }

    // Update metrics
    this.coordinatorMetrics.totalEventsProcessed++;
  }

  startAutoScalingMonitoring() {
    setInterval(async () => {
      try {
        await this.checkAutoScalingTriggers();
      } catch (error) {
        console.error('Error during auto-scaling check:', error);
      }
    }, 30000); // Every 30 seconds
  }

  async checkAutoScalingTriggers() {
    try {
      const metrics = await this.getCoordinatorMetrics();
      const consumerMetrics = metrics.consumerMetrics || {};
      const triggers = [];

      if (consumerMetrics.consumerLag) {
        for (const [topic, lagInfo] of Object.entries(consumerMetrics.consumerLag)) {
          if (lagInfo.lag > 1000) triggers.push({ type: 'consumer_lag', topic, value: lagInfo.lag, threshold: 1000, action: 'scale_up' });
        }
      }

      if (metrics.averageProcessingTime > 5000) triggers.push({ type: 'processing_time', value: metrics.averageProcessingTime, threshold: 5000, action: 'scale_up' });

      const failureRate = metrics.totalEventsProcessed > 0 ? (metrics.totalEventsFailed / metrics.totalEventsProcessed) * 100 : 0;
      if (failureRate > 5) triggers.push({ type: 'failure_rate', value: failureRate, threshold: 5, action: 'scale_up' });

      if (triggers.length > 0) {
        this.autoScalingHooks.set(Date.now(), triggers);
        for (const trigger of triggers) await this.triggerAutoScalingHook(trigger);
      }
    } catch (err) {
      // non-fatal
    }
  }

  async triggerAutoScalingHook(trigger) {
    const hookData = {
      trigger,
      timestamp: new Date(),
      coordinatorMetrics: await this.getCoordinatorMetrics()
    };

    // This would integrate with your auto-scaling system
    console.log('Auto-scaling hook triggered:', hookData);
    
    // Store hook for monitoring
    this.autoScalingHooks.set(Date.now(), hookData);
  }

  async getCoordinatorMetrics() {
    let producerMetrics = {};
    let consumerMetrics = {};
    try { producerMetrics = await this.services.producer.getMetrics(); } catch {}
    try { consumerMetrics = await this.services.consumer.getMetrics(); } catch {}

    return {
      uptime: Date.now() - this.coordinatorMetrics.uptime,
      servicesStarted: this.coordinatorMetrics.servicesStarted,
      servicesFailed: this.coordinatorMetrics.servicesFailed,
      totalEventsProcessed: this.coordinatorMetrics.totalEventsProcessed,
      totalEventsFailed: this.coordinatorMetrics.totalEventsFailed,
      successRate: this.coordinatorMetrics.totalEventsProcessed > 0 ? 
        ((this.coordinatorMetrics.totalEventsProcessed - this.coordinatorMetrics.totalEventsFailed) / 
         this.coordinatorMetrics.totalEventsProcessed) * 100 : 0,
      producerMetrics,
      consumerMetrics,
      healthChecks: Array.from(this.healthChecks.entries()).slice(-10), // Last 10 health checks
      autoScalingHooks: Array.from(this.autoScalingHooks.entries()).slice(-50), // Last 50 triggers
      timestamp: new Date()
    };
  }

  async shutdown() {
    try {
      console.log('Shutting down streaming coordinator...');
      try { await this.services.discoveryHandler.shutdown(); } catch {}
      try { await this.services.enrichmentHandler.shutdown(); } catch {}
      try { await this.services.embeddingHandler.shutdown(); } catch {}
      try { await this.services.indexingHandler.shutdown(); } catch {}
      try { await this.services.consumer.disconnect(); } catch {}
      try { await this.services.producer.disconnect(); } catch {}
      this.healthChecks.clear();
      this.autoScalingHooks.clear();
      this.isInitialized = false;
      console.log('Streaming coordinator shutdown complete');
    } catch (error) {
      console.warn('Error shutting down streaming coordinator (non-fatal):', error.message);
    }
  }

  async restart() {
    try {
      await this.shutdown();
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      await this.initialize();
    } catch (error) {
      console.error('Error restarting streaming coordinator:', error);
      throw error;
    }
  }

  getHealthStatus() {
    return {
      initialized: this.isInitialized,
      uptime: Date.now() - this.coordinatorMetrics.uptime,
      services: Object.keys(this.services),
      metrics: this.coordinatorMetrics,
      lastHealthCheck: Array.from(this.healthChecks.entries()).pop()
    };
  }

  async getAutoScalingHooks(limit = 50) {
    return Array.from(this.autoScalingHooks.entries())
      .slice(-limit)
      .map(([timestamp, hook]) => ({
        timestamp: new Date(timestamp),
        hook
      }));
  }

  async getHealthChecks(limit = 50) {
    return Array.from(this.healthChecks.entries())
      .slice(-limit)
      .map(([timestamp, check]) => ({
        timestamp: new Date(timestamp),
        check
      }));
  }
}

export const streamingCoordinatorService = new StreamingCoordinatorService();
export default streamingCoordinatorService;
