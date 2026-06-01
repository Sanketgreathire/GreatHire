import { Kafka } from 'kafkajs';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export class KafkaConsumerService extends EventEmitter {
  constructor() {
    super();
    this.kafka = null;
    this.consumers = new Map();
    this.consumerGroups = new Map();
    this.isConnected = false;
    this.config = {
      clientId: process.env.KAFKA_CLIENT_ID || 'greathire-consumer',
      brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
      ssl: process.env.KAFKA_SSL === 'true',
      sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
      } : undefined,
      consumerConfig: {
        groupId: process.env.KAFKA_GROUP_ID || 'greathire-consumer-group',
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxWaitTimeInMs: 5000,
        allowAutoTopicCreation: true,
        enableAutoCommit: false,
        autoOffsetReset: 'earliest',
        maxPollRecords: 100,
        maxPollInterval: 300000
      }
    };
    this.metrics = {
      messagesConsumed: 0,
      messagesProcessed: 0,
      messagesFailed: 0,
      processingLatency: [],
      lastConsumptionTime: null,
      consumerLag: new Map(),
      partitions: new Map()
    };
    this.processingQueue = [];
    this.maxConcurrency = 10;
    this.currentlyProcessing = new Set();
    this.deadLetterQueue = [];
    this.retryQueue = [];
    this.maxRetries = 3;
    this.retryDelay = 5000;
  }

  async connect() {
    try {
      if (this.isConnected) {
        return;
      }

      this.kafka = new Kafka(this.config);
      this.isConnected = true;

      console.log('Kafka consumer connected successfully');
      
      // Start retry queue processor
      this.startRetryProcessor();

    } catch (error) {
      console.error('Failed to connect Kafka consumer:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (!this.isConnected) {
        return;
      }

      // Stop all consumers
      for (const [consumerId, consumer] of this.consumers.entries()) {
        await consumer.stop();
        await consumer.disconnect();
      }

      this.consumers.clear();
      this.consumerGroups.clear();
      this.isConnected = false;

      console.log('Kafka consumer disconnected');

    } catch (error) {
      console.error('Error disconnecting Kafka consumer:', error);
      throw error;
    }
  }

  async createConsumer(groupId, options = {}) {
    try {
      await this.ensureConnected();

      const consumerId = uuidv4();
      const consumerConfig = {
        ...this.config.consumerConfig,
        groupId: groupId,
        ...options
      };

      const consumer = this.kafka.consumer(consumerConfig);
      
      await consumer.connect();

      this.consumers.set(consumerId, {
        consumer,
        groupId,
        topics: new Set(),
        handler: null,
        options,
        createdAt: new Date()
      });

      this.consumerGroups.set(groupId, {
        consumerId,
        createdAt: new Date()
      });

      console.log(`Consumer created: ${consumerId}`, { groupId });

      return consumerId;

    } catch (error) {
      console.error('Failed to create consumer:', error);
      throw error;
    }
  }

  async subscribe(consumerId, topics, handler, options = {}) {
    try {
      const consumerInfo = this.consumers.get(consumerId);
      
      if (!consumerInfo) {
        throw new Error(`Consumer not found: ${consumerId}`);
      }

      const consumer = consumerInfo.consumer;
      
      await consumer.subscribe({
        topics: Array.isArray(topics) ? topics : [topics],
        fromBeginning: options.fromBeginning || false
      });

      // Store topics
      const topicArray = Array.isArray(topics) ? topics : [topics];
      topicArray.forEach(topic => consumerInfo.topics.add(topic));

      // Store handler
      consumerInfo.handler = handler;

      // Start consuming
      await this.startConsumer(consumerId, options);

      console.log(`Subscribed to topics: ${topicArray.join(', ')}`, { consumerId });

      return consumerId;

    } catch (error) {
      console.error('Failed to subscribe to topics:', error);
      throw error;
    }
  }

  async startConsumer(consumerId, options = {}) {
    const consumerInfo = this.consumers.get(consumerId);
    
    if (!consumerInfo) {
      throw new Error(`Consumer not found: ${consumerId}`);
    }

    const consumer = consumerInfo.consumer;
    const concurrency = options.concurrency || this.maxConcurrency;

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const startTime = Date.now();
          
          // Check concurrency limits
          if (this.currentlyProcessing.size >= concurrency) {
            // Add to processing queue
            this.processingQueue.push({
              topic,
              partition,
              message,
              startTime,
              consumerId
            });
            return;
          }

          const processingId = uuidv4();
          this.currentlyProcessing.add(processingId);

          // Parse message
          let event;
          try {
            event = JSON.parse(message.value.toString());
          } catch (parseError) {
            console.error('Failed to parse message:', parseError);
            this.metrics.messagesFailed++;
            throw parseError;
          }

          // Add metadata
          event.metadata = {
            ...event.metadata,
            consumedAt: new Date().toISOString(),
            consumerId,
            topic,
            partition,
            offset: message.offset,
            key: message.key?.toString(),
            headers: message.headers
          };

          // Process message
          await this.processMessage(consumerId, event, processingId);

          const endTime = Date.now();
          const latency = endTime - startTime;

          // Update metrics
          this.metrics.messagesConsumed++;
          this.metrics.messagesProcessed++;
          this.metrics.processingLatency.push(latency);
          this.metrics.lastConsumptionTime = new Date();
          
          // Update consumer lag
          this.updateConsumerLag(topic, partition, message.offset);

          // Keep only last 1000 latency measurements
          if (this.metrics.processingLatency.length > 1000) {
            this.metrics.processingLatency = this.metrics.processingLatency.slice(-1000);
          }

          console.log(`Message processed: ${topic}`, {
            eventId: event.id,
            partition,
            offset: message.offset,
            latency: `${latency}ms`
          });

        } catch (error) {
          console.error(`Error processing message from ${topic}:`, error);
          this.metrics.messagesFailed++;
          
          // Add to retry queue or dead letter queue
          await this.handleProcessingError(topic, message, error, consumerId);
        } finally {
          this.currentlyProcessing.delete(processingId);
          
          // Process next item in queue
          if (this.processingQueue.length > 0 && this.currentlyProcessing.size < concurrency) {
            const nextItem = this.processingQueue.shift();
            this.processMessageFromQueue(nextItem);
          }
        }
      },
      eachBatch: options.eachBatch || null,
      partitionsConsumedConcurrently: options.partitionsConsumedConcurrently || false
    });

    // Handle consumer events
    consumer.on('consumer.group_join', (event) => {
      console.log('Consumer joined group:', event);
      this.emit('groupJoin', event);
    });

    consumer.on('consumer.group_leave', (event) => {
      console.log('Consumer left group:', event);
      this.emit('groupLeave', event);
    });

    consumer.on('consumer.crash', (event) => {
      console.error('Consumer crashed:', event);
      this.emit('consumerCrash', event);
    });
  }

  async processMessage(consumerId, event, processingId) {
    const consumerInfo = this.consumers.get(consumerId);
    
    if (!consumerInfo || !consumerInfo.handler) {
      throw new Error(`No handler found for consumer: ${consumerId}`);
    }

    try {
      await consumerInfo.handler(event);
      
      // Emit success event
      this.emit('messageProcessed', {
        consumerId,
        event,
        processingId,
        timestamp: new Date()
      });

    } catch (error) {
      // Emit error event
      this.emit('messageError', {
        consumerId,
        event,
        processingId,
        error,
        timestamp: new Date()
      });
      
      throw error;
    }
  }

  async processMessageFromQueue(queueItem) {
    const { topic, partition, message, startTime, consumerId } = queueItem;
    
    try {
      const processingId = uuidv4();
      this.currentlyProcessing.add(processingId);

      let event;
      try {
        event = JSON.parse(message.value.toString());
      } catch (parseError) {
        console.error('Failed to parse queued message:', parseError);
        this.currentlyProcessing.delete(processingId);
        return;
      }

      // Add metadata
      event.metadata = {
        ...event.metadata,
        consumedAt: new Date().toISOString(),
        consumerId,
        topic,
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        headers: message.headers,
        queued: true,
        queueTime: Date.now() - startTime
      };

      await this.processMessage(consumerId, event, processingId);

    } catch (error) {
      console.error('Error processing queued message:', error);
      await this.handleProcessingError(topic, message, error, consumerId);
    } finally {
      this.currentlyProcessing.delete(processingId);
    }
  }

  async handleProcessingError(topic, message, error, consumerId) {
    const event = JSON.parse(message.value.toString());
    const retryCount = event.metadata?.retryCount || 0;

    if (retryCount < this.maxRetries) {
      // Add to retry queue
      this.retryQueue.push({
        topic,
        message: {
          ...message,
          value: JSON.stringify({
            ...event,
            metadata: {
              ...event.metadata,
              retryCount: retryCount + 1,
              lastRetryAt: new Date().toISOString(),
              retryError: error.message
            }
          })
        },
        consumerId,
        retryAt: new Date(Date.now() + this.retryDelay * Math.pow(2, retryCount)),
        error: error.message
      });

      console.log(`Message queued for retry: ${topic}`, {
        eventId: event.id,
        retryCount: retryCount + 1,
        retryAt: this.retryQueue[this.retryQueue.length - 1].retryAt
      });

    } else {
      // Add to dead letter queue
      this.deadLetterQueue.push({
        topic,
        message,
        event,
        consumerId,
        error: error.message,
        failedAt: new Date(),
        retryCount
      });

      console.error(`Message moved to dead letter queue: ${topic}`, {
        eventId: event.id,
        retryCount,
        error: error.message
      });
    }
  }

  startRetryProcessor() {
    setInterval(async () => {
      const now = new Date();
      const readyToRetry = this.retryQueue.filter(item => item.retryAt <= now);
      
      if (readyToRetry.length === 0) {
        return;
      }

      // Remove ready items from queue
      const remainingItems = this.retryQueue.filter(item => item.retryAt > now);
      this.retryQueue = remainingItems;

      // Process retries
      for (const item of readyToRetry) {
        try {
          const consumerInfo = this.consumers.get(item.consumerId);
          if (consumerInfo) {
            let event;
            try {
              event = JSON.parse(item.message.value.toString());
            } catch (parseError) {
              console.error('Failed to parse retry message:', parseError);
              continue;
            }

            await this.processMessage(item.consumerId, event, uuidv4());
            
            console.log(`Retry processed: ${item.topic}`, {
              eventId: event.id,
              retryCount: event.metadata?.retryCount
            });
          }
        } catch (error) {
          console.error('Error during retry processing:', error);
          await this.handleProcessingError(item.topic, item.message, error, item.consumerId);
        }
      }
    }, 1000); // Check every second
  }

  updateConsumerLag(topic, partition, offset) {
    const key = `${topic}:${partition}`;
    
    if (!this.metrics.consumerLag.has(key)) {
      this.metrics.consumerLag.set(key, {
        topic,
        partition,
        offset: parseInt(offset),
        lag: 0,
        timestamp: new Date()
      });
    } else {
      const lagInfo = this.metrics.consumerLag.get(key);
      lagInfo.offset = parseInt(offset);
      lagInfo.timestamp = new Date();
      // Note: Actual lag calculation would require comparing with high watermark
    }
  }

  async pauseConsumer(consumerId) {
    const consumerInfo = this.consumers.get(consumerId);
    
    if (consumerInfo) {
      await consumerInfo.consumer.pause();
      console.log(`Consumer paused: ${consumerId}`);
    }
  }

  async resumeConsumer(consumerId) {
    const consumerInfo = this.consumers.get(consumerId);
    
    if (consumerInfo) {
      await consumerInfo.consumer.resume();
      console.log(`Consumer resumed: ${consumerId}`);
    }
  }

  async stopConsumer(consumerId) {
    const consumerInfo = this.consumers.get(consumerId);
    
    if (consumerInfo) {
      await consumerInfo.consumer.stop();
      console.log(`Consumer stopped: ${consumerId}`);
    }
  }

  async removeConsumer(consumerId) {
    const consumerInfo = this.consumers.get(consumerId);
    
    if (consumerInfo) {
      await consumerInfo.consumer.stop();
      await consumerInfo.consumer.disconnect();
      
      this.consumers.delete(consumerId);
      
      // Remove from consumer groups
      for (const [groupId, groupInfo] of this.consumerGroups.entries()) {
        if (groupInfo.consumerId === consumerId) {
          this.consumerGroups.delete(groupId);
          break;
        }
      }
      
      console.log(`Consumer removed: ${consumerId}`);
    }
  }

  getConsumerInfo(consumerId) {
    return this.consumers.get(consumerId);
  }

  getAllConsumers() {
    return Array.from(this.consumers.entries()).map(([id, info]) => ({
      id,
      groupId: info.groupId,
      topics: Array.from(info.topics),
      createdAt: info.createdAt,
      options: info.options
    }));
  }

  getConsumerGroups() {
    return Array.from(this.consumerGroups.entries()).map(([groupId, info]) => ({
      groupId,
      consumerId: info.consumerId,
      createdAt: info.createdAt
    }));
  }

  getDeadLetterQueue(limit = 100) {
    return this.deadLetterQueue
      .slice(-limit)
      .sort((a, b) => new Date(b.failedAt) - new Date(a.failedAt));
  }

  getRetryQueue() {
    return this.retryQueue.map(item => ({
      topic: item.topic,
      consumerId: item.consumerId,
      retryAt: item.retryAt,
      error: item.error,
      eventId: JSON.parse(item.message.value.toString()).id
    }));
  }

  getMetrics() {
    const latency = this.metrics.processingLatency;
    
    return {
      ...this.metrics,
      averageLatency: latency.length > 0 ? 
        latency.reduce((sum, l) => sum + l, 0) / latency.length : 0,
      maxLatency: latency.length > 0 ? Math.max(...latency) : 0,
      minLatency: latency.length > 0 ? Math.min(...latency) : 0,
      p95Latency: latency.length > 0 ? 
        this.percentile(latency, 0.95) : 0,
      p99Latency: latency.length > 0 ? 
        this.percentile(latency, 0.99) : 0,
      connected: this.isConnected,
      consumersCount: this.consumers.size,
      processingQueueSize: this.processingQueue.length,
      currentlyProcessing: this.currentlyProcessing.size,
      deadLetterQueueSize: this.deadLetterQueue.length,
      retryQueueSize: this.retryQueue.length,
      consumerLag: Array.from(this.metrics.consumerLag.values())
    };
  }

  percentile(arr, p) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }

  resetMetrics() {
    this.metrics = {
      messagesConsumed: 0,
      messagesProcessed: 0,
      messagesFailed: 0,
      processingLatency: [],
      lastConsumptionTime: null,
      consumerLag: new Map(),
      partitions: new Map()
    };
  }

  async healthCheck() {
    try {
      if (!this.isConnected) {
        return {
          status: 'unhealthy',
          connected: false,
          error: 'Not connected to Kafka'
        };
      }

      const consumers = this.getAllConsumers();
      const activeConsumers = consumers.filter(consumer => 
        this.consumers.has(consumer.id)
      );

      return {
        status: 'healthy',
        connected: true,
        consumersCount: consumers.length,
        activeConsumersCount: activeConsumers.length,
        metrics: this.getMetrics()
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        connected: this.isConnected,
        error: error.message
      };
    }
  }

  async ensureConnected() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  clearDeadLetterQueue() {
    this.deadLetterQueue = [];
    console.log('Dead letter queue cleared');
  }

  clearRetryQueue() {
    this.retryQueue = [];
    console.log('Retry queue cleared');
  }

  async replayDeadLetterMessage(index) {
    if (index >= this.deadLetterQueue.length) {
      throw new Error('Invalid dead letter message index');
    }

    const deadLetterItem = this.deadLetterQueue[index];
    
    try {
      const consumerInfo = this.consumers.get(deadLetterItem.consumerId);
      if (consumerInfo) {
        await this.processMessage(deadLetterItem.consumerId, deadLetterItem.event, uuidv4());
        
        // Remove from dead letter queue
        this.deadLetterQueue.splice(index, 1);
        
        console.log('Dead letter message replayed successfully');
        return true;
      }
    } catch (error) {
      console.error('Error replaying dead letter message:', error);
      throw error;
    }

    return false;
  }
}

export const kafkaConsumerService = new KafkaConsumerService();
export default kafkaConsumerService;
