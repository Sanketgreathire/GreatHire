import { kafkaProducerService } from '../services/kafkaProducer.service.js';
import { kafkaConsumerService } from '../services/kafkaConsumer.service.js';
import { ingestionEventPublisherService } from '../services/ingestionEventPublisher.service.js';
import { discoveryEventHandlerService } from '../services/discoveryEventHandler.service.js';
import { enrichmentEventHandlerService } from '../services/enrichmentEventHandler.service.js';
import { embeddingEventHandlerService } from '../services/embeddingEventHandler.service.js';
import { indexingEventHandlerService } from '../services/indexingEventHandler.service.js';
import { candidateLifecycleService } from '../services/candidateLifecycle.service.js';
import { EventMetadata } from '../../../models/eventMetadata.model.js';

export const getEventStatus = async (req, res) => {
  try {
    const producerMetrics = await kafkaProducerService.getMetrics();
    const consumerMetrics = await kafkaConsumerService.getMetrics();
    const consumerGroups = kafkaConsumerService.getConsumerGroups();
    const deadLetterQueue = kafkaConsumerService.getDeadLetterQueue();
    const retryQueues = kafkaConsumerService.getRetryQueues();

    // Get event metadata statistics
    const eventStats = await EventMetadata.getEventStatistics('24h');
    const failureAnalysis = await EventMetadata.getFailureAnalysis('24h');
    const processingMetrics = await EventMetadata.getProcessingMetrics('24h');

    return res.status(200).json({
      success: true,
      data: {
        producer: producerMetrics,
        consumer: consumerMetrics,
        consumerGroups,
        deadLetterQueue,
        retryQueues,
        eventStats,
        failureAnalysis,
        processingMetrics,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting event status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get event status',
      error: error.message
    });
  }
};

export const getTopics = async (req, res) => {
  try {
    const topics = await kafkaProducerService.listTopics();
    const topicMetadata = {};

    // Get metadata for each topic
    for (const topic of topics) {
      try {
        const metadata = await kafkaProducerService.getTopicMetadata(topic);
        topicMetadata[topic] = metadata;
      } catch (error) {
        console.error(`Error getting metadata for topic ${topic}:`, error);
        topicMetadata[topic] = { error: error.message };
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        topics,
        topicMetadata,
        count: topics.length,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting topics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get topics',
      error: error.message
    });
  }
};

export const getThroughput = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const producerMetrics = await kafkaProducerService.getMetrics();
    const consumerMetrics = await kafkaConsumerService.getMetrics();
    const eventStats = await EventMetadata.getEventStatistics(timeRange);
    const performanceMetrics = await EventMetadata.getPerformanceMetrics(timeRange);

    // Calculate throughput metrics
    const throughput = {
      timeRange,
      producer: {
        messagesProduced: producerMetrics.messagesProduced,
        bytesProduced: producerMetrics.bytesProduced,
        averageLatency: producerMetrics.averageLatency,
        p95Latency: producerMetrics.p95Latency,
        p99Latency: producerMetrics.p99Latency,
        productionRate: producerMetrics.messagesProduced / (24 * 60 * 60) // messages per second
      },
      consumer: {
        messagesConsumed: consumerMetrics.messagesConsumed,
        messagesProcessed: consumerMetrics.messagesProcessed,
        messagesFailed: consumerMetrics.messagesFailed,
        averageProcessingTime: consumerMetrics.averageProcessingTime,
        p95ProcessingTime: consumerMetrics.p95ProcessingTime,
        p99ProcessingTime: consumerMetrics.p99ProcessingTime,
        processingRate: consumerMetrics.messagesProcessed / (24 * 60 * 60), // messages per second
        successRate: consumerMetrics.messagesConsumed > 0 ? 
          (consumerMetrics.messagesProcessed / consumerMetrics.messagesConsumed) * 100 : 0
      },
      events: {
        totalEvents: eventStats.totalEvents,
        completedEvents: eventStats.completedEvents,
        failedEvents: eventStats.failedEvents,
        retryingEvents: eventStats.retryingEvents,
        deadLetterEvents: eventStats.deadLetterEvents,
        successRate: eventStats.successRate,
        failureRate: eventStats.failureRate
      },
      performance: {
        averageProcessingTime: performanceMetrics.reduce((sum, metric) => sum + metric.avgProcessingTime, 0) / performanceMetrics.length,
        maxProcessingTime: Math.max(...performanceMetrics.map(m => m.maxProcessingTime)),
        minProcessingTime: Math.min(...performanceMetrics.map(m => m.minProcessingTime)),
        averageLatency: performanceMetrics.reduce((sum, metric) => sum + metric.avgLatency, 0) / performanceMetrics.length
      }
    };

    return res.status(200).json({
      success: true,
      data: throughput,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting throughput:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get throughput',
      error: error.message
    });
  }
};

export const getFailures = async (req, res) => {
  try {
    const { timeRange = '24h', limit = 100 } = req.query;
    
    const failedEvents = await EventMetadata.findFailedEvents(parseInt(limit));
    const retryableEvents = await EventMetadata.findRetryableEvents(parseInt(limit));
    const deadLetterEvents = await EventMetadata.findDeadLetterEvents(parseInt(limit));
    const failureAnalysis = await EventMetadata.getFailureAnalysis(timeRange);

    // Group failures by type
    const failureGroups = failedEvents.reduce((groups, event) => {
      const key = `${event.eventType}_${event.metadata.source}`;
      if (!groups[key]) {
        groups[key] = {
          eventType: event.eventType,
          source: event.metadata.source,
          count: 0,
          lastFailure: null,
          errors: []
        };
      }
      groups[key].count++;
      if (!groups[key].lastFailure || new Date(event.processingInfo.lastErrorTimestamp) > new Date(groups[key].lastFailure)) {
        groups[key].lastFailure = event.processingInfo.lastErrorTimestamp;
      }
      if (event.processingInfo.lastError) {
        groups[key].errors.push(event.processingInfo.lastError);
      }
      return groups;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        timeRange,
        failedEvents: failedEvents.slice(0, parseInt(limit)),
        retryableEvents: retryableEvents.slice(0, parseInt(limit)),
        deadLetterEvents: deadLetterEvents.slice(0, parseInt(limit)),
        failureGroups: Object.values(failureGroups),
        failureAnalysis,
        summary: {
          totalFailed: failedEvents.length,
          totalRetryable: retryableEvents.length,
          totalDeadLetter: deadLetterEvents.length,
          uniqueFailureTypes: Object.keys(failureGroups).length
        },
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting failures:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get failures',
      error: error.message
    });
  }
};

export const getConsumerLag = async (req, res) => {
  try {
    const consumerMetrics = await kafkaConsumerService.getMetrics();
    const consumerGroups = kafkaConsumerService.getAllConsumers();
    
    // Calculate lag per consumer
    const lagAnalysis = consumerGroups.map(consumer => {
      const lagInfo = consumerMetrics.consumerLag.find(lag => 
        lag.topic && lag.topic.includes(consumer.topics[0])
      );
      
      return {
        consumerId: consumer.id,
        groupId: consumer.groupId,
        topics: consumer.topics,
        lag: lagInfo ? {
          topic: lagInfo.topic,
          partition: lagInfo.partition,
          offset: lagInfo.offset,
          lag: lagInfo.lag || 0
        } : null,
        status: lagInfo ? 'active' : 'no_data'
      };
    });

    // Calculate overall lag metrics
    const totalLag = lagAnalysis
      .filter(lag => lag.lag && lag.lag.lag > 0)
      .reduce((sum, lag) => sum + lag.lag.lag, 0);

    const avgLag = lagAnalysis.length > 0 ? totalLag / lagAnalysis.length : 0;
    const maxLag = Math.max(...lagAnalysis.map(lag => lag.lag ? lag.lag.lag : 0));

    return res.status(200).json({
      success: true,
      data: {
        consumerLag: lagAnalysis,
        metrics: {
          totalLag,
          averageLag: Math.round(avgLag),
          maxLag,
          consumersWithLag: lagAnalysis.filter(lag => lag.lag && lag.lag.lag > 0).length
        },
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting consumer lag:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get consumer lag',
      error: error.message
    });
  }
};

export const getDeadLetterQueue = async (req, res) => {
  try {
    const { limit = 100, topic } = req.query;
    
    const deadLetterEvents = kafkaConsumerService.getDeadLetterQueue(parseInt(limit));
    const eventDeadLetterEvents = await EventMetadata.findDeadLetterEvents(parseInt(limit));

    // Combine and deduplicate
    const allDeadLetterEvents = [...deadLetterEvents, ...eventDeadLetterEvents];
    
    // Group by topic if specified
    let filteredEvents = allDeadLetterEvents;
    if (topic) {
      filteredEvents = allDeadLetterEvents.filter(event => 
        event.topic === topic || event.eventType === topic
      );
    }

    // Group by error type
    const errorGroups = filteredEvents.reduce((groups, event) => {
      const errorType = event.error || event.processingInfo?.lastError || 'unknown';
      if (!groups[errorType]) {
        groups[errorType] = {
          errorType,
          count: 0,
          events: []
        };
      }
      groups[errorType].count++;
      groups[errorType].events.push(event);
      return groups;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        deadLetterEvents: filteredEvents.slice(0, parseInt(limit)),
        errorGroups: Object.values(errorGroups),
        summary: {
          totalEvents: filteredEvents.length,
          uniqueErrors: Object.keys(errorGroups).length,
          oldestEvent: filteredEvents.length > 0 ? 
            Math.min(...filteredEvents.map(e => new Date(e.failedAt || e.deadLetterInfo?.deadLetterAt))) : null,
          newestEvent: filteredEvents.length > 0 ? 
            Math.max(...filteredEvents.map(e => new Date(e.failedAt || e.deadLetterInfo?.deadLetterAt))) : null
        },
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting dead letter queue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get dead letter queue',
      error: error.message
    });
  }
};

export const retryDeadLetterEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    // Find the dead letter event
    const deadLetterEvent = await EventMetadata.findOne({
      $or: [
        { eventId },
        { 'deadLetterInfo.originalEventId': eventId }
      ]
    });

    if (!deadLetterEvent) {
      return res.status(404).json({
        success: false,
        message: 'Dead letter event not found'
      });
    }

    // Replay the event
    const replayedEvent = await kafkaConsumerService.replayDeadLetterEvent(0);
    
    return res.status(200).json({
      success: true,
      data: {
        originalEventId: eventId,
        replayedEvent,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error retrying dead letter event:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retry dead letter event',
      error: error.message
    });
  }
};

export const clearDeadLetterQueue = async (req, res) => {
  try {
    const { topic } = req.query;
    
    // Clear Kafka dead letter queue
    kafkaConsumerService.clearDeadLetterQueue();
    
    // Clear event metadata dead letter events
    const filter = topic ? { 'deadLetterInfo.movedToDeadLetter': true } : { 'deadLetterInfo.movedToDeadLetter': true };
    const result = await EventMetadata.deleteMany(filter);
    
    return res.status(200).json({
      success: true,
      data: {
        clearedCount: result.deletedCount,
        topic: topic || 'all',
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error clearing dead letter queue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear dead letter queue',
      error: error.message
    });
  }
};

export const getEventFlow = async (req, res) => {
  try {
    const { correlationId } = req.query;
    
    if (!correlationId) {
      return res.status(400).json({
        success: false,
        message: 'Correlation ID is required'
      });
    }

    const eventFlow = await EventMetadata.getEventFlow(correlationId);
    
    // Calculate flow metrics
    const flowMetrics = {
      totalEvents: eventFlow.length,
      duration: eventFlow.length > 1 ? 
        new Date(eventFlow[eventFlow.length - 1].timestamp) - new Date(eventFlow[0].timestamp) : 0,
      averageEventTime: eventFlow.length > 0 ? 
        eventFlow.reduce((sum, event) => sum + (event.performanceMetrics?.processingTime || 0), 0) / eventFlow.length : 0,
      stages: [...new Set(eventFlow.map(event => event.eventType))],
      sources: [...new Set(eventFlow.map(event => event.metadata.source))]
    };

    return res.status(200).json({
      success: true,
      data: {
        correlationId,
        eventFlow,
        flowMetrics,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting event flow:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get event flow',
      error: error.message
    });
  }
};

export const createTopic = async (req, res) => {
  try {
    const { topic, config } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic name is required'
      });
    }

    const topicConfig = {
      numPartitions: config?.numPartitions || 3,
      replicationFactor: config?.replicationFactor || 1,
      retensionMs: config?.retentionMs || 604800000, // 7 days
      cleanupPolicy: config?.cleanupPolicy || 'delete',
      compressionType: config?.compressionType || 'gzip',
      maxMessageBytes: config?.maxMessageBytes || 1048576, // 1MB
      ...config
    };

    const result = await kafkaProducerService.createTopic(topic, topicConfig);
    
    return res.status(200).json({
      success: true,
      data: {
        topic,
        config: topicConfig,
        result,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create topic',
      error: error.message
    });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic name is required'
      });
    }

    const result = await kafkaProducerService.deleteTopic(topic);
    
    return res.status(200).json({
      success: true,
      data: {
        topic,
        result,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete topic',
      error: error.message
    });
  }
};

export const publishTestEvent = async (req, res) => {
  try {
    const { topic, eventType, payload } = req.body;
    
    if (!topic || !eventType) {
      return res.status(400).json({
        success: false,
        message: 'Topic and event type are required'
      });
    }

    const testEvent = {
      id: `test-${Date.now()}`,
      type: eventType,
      payload: payload || { test: true, timestamp: new Date().toISOString() },
      metadata: {
        source: 'test-controller',
        version: '1.0',
        correlationId: `test-${Date.now()}`,
        priority: 'normal'
      }
    };

    const result = await kafkaProducerService.publishEvent(topic, testEvent);
    
    return res.status(200).json({
      success: true,
      data: {
        topic,
        eventType,
        eventId: testEvent.id,
        result,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error publishing test event:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish test event',
      error: error.message
    });
  }
};

export const getEventHandlerStatus = async (req, res) => {
  try {
    const handlers = [
      { name: 'discovery', service: discoveryEventHandlerService },
      { name: 'enrichment', service: enrichmentEventHandlerService },
      { name: 'embedding', service: embeddingEventHandlerService },
      { name: 'indexing', service: indexingEventHandlerService }
    ];

    const handlerStatuses = await Promise.all(
      handlers.map(async handler => {
        try {
          const status = await handler.service.healthCheck();
          return {
            name: handler.name,
            ...status
          };
        } catch (error) {
          return {
            name: handler.name,
            status: 'unhealthy',
            error: error.message
          };
        }
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        handlers: handlerStatuses,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting event handler status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get event handler status',
      error: error.message
    });
  }
};

export const restartEventHandler = async (req, res) => {
  try {
    const { handlerName } = req.params;
    
    const handlers = {
      discovery: discoveryEventHandlerService,
      enrichment: enrichmentEventHandlerService,
      embedding: embeddingEventHandlerService,
      indexing: indexingEventHandlerService
    };

    const handler = handlers[handlerName];
    if (!handler) {
      return res.status(400).json({
        success: false,
        message: 'Invalid handler name'
      });
    }

    await handler.shutdown();
    await handler.initialize();
    
    return res.status(200).json({
      success: true,
      data: {
        handlerName,
        restartedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error restarting event handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to restart event handler',
      error: error.message
    });
  }
};
