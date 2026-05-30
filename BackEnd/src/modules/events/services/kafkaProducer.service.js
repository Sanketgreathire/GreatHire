import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

export class KafkaProducerService {
  constructor() {
    this.kafka = null;
    this.producer = null;
    this.isConnected = false;
    this.config = {
      clientId: process.env.KAFKA_CLIENT_ID || 'greathire-producer',
      brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
      ssl: process.env.KAFKA_SSL === 'true',
      sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
      } : undefined,
      retry: {
        initialRetryTime: 100,
        retries: 8
      },
      producerConfig: {
        maxInFlightRequests: 1,
        idempotent: true,
        transactionTimeout: 30000,
        requestTimeout: 30000,
        acks: 'all',
        compressionType: 'gzip'
      }
    };
    this.metrics = {
      messagesProduced: 0,
      messagesFailed: 0,
      bytesProduced: 0,
      productionLatency: [],
      lastProductionTime: null
    };
    this.batchQueue = [];
    this.batchSize = 100;
    this.batchTimeout = 5000; // 5 seconds
    this.batchTimer = null;
  }

  async connect() {
    try {
      if (this.isConnected) {
        return;
      }

      this.kafka = new Kafka(this.config);
      this.producer = this.kafka.producer(this.config.producerConfig);

      await this.producer.connect();
      this.isConnected = true;

      console.log('Kafka producer connected successfully');
      
      // Start batch processing
      this.startBatchProcessor();

    } catch (error) {
      console.error('Failed to connect Kafka producer:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
        this.batchTimer = null;
      }

      // Flush any remaining batch
      if (this.batchQueue.length > 0) {
        await this.flushBatch();
      }

      if (this.producer && this.isConnected) {
        await this.producer.disconnect();
        this.isConnected = false;
        console.log('Kafka producer disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting Kafka producer:', error);
      throw error;
    }
  }

  async publishEvent(topic, event, options = {}) {
    try {
      await this.ensureConnected();

      const startTime = Date.now();
      
      const message = {
        key: options.key || event.id || uuidv4(),
        value: JSON.stringify({
          ...event,
          metadata: {
            ...event.metadata,
            producedAt: new Date().toISOString(),
            producerId: this.config.clientId,
            partition: options.partition || null,
            headers: {
              ...options.headers,
              'content-type': 'application/json',
              'event-version': event.metadata?.version || '1.0'
            }
          }
        }),
        headers: {
          'event-id': event.id || uuidv4(),
          'event-type': event.type,
          'correlation-id': event.metadata?.correlationId || uuidv4(),
          'causation-id': event.metadata?.causationId || null,
          'source': event.metadata?.source || 'unknown',
          'timestamp': event.metadata?.timestamp || new Date().toISOString(),
          'content-type': 'application/json',
          ...options.headers
        },
        partition: options.partition || null,
        timestamp: Date.now()
      };

      const result = await this.producer.send({
        topic,
        messages: [message]
      });

      const endTime = Date.now();
      const latency = endTime - startTime;

      // Update metrics
      this.metrics.messagesProduced++;
      this.metrics.bytesProduced += message.value.length;
      this.metrics.productionLatency.push(latency);
      this.metrics.lastProductionTime = new Date();

      // Keep only last 1000 latency measurements
      if (this.metrics.productionLatency.length > 1000) {
        this.metrics.productionLatency = this.metrics.productionLatency.slice(-1000);
      }

      console.log(`Event published to topic ${topic}`, {
        eventId: event.id || message.headers['event-id'],
        eventType: event.type,
        partition: result[0]?.partition,
        offset: result[0]?.offset,
        latency: `${latency}ms`
      });

      return {
        success: true,
        topic,
        partition: result[0]?.partition,
        offset: result[0]?.offset,
        timestamp: new Date(),
        latency
      };

    } catch (error) {
      console.error(`Failed to publish event to topic ${topic}:`, error);
      this.metrics.messagesFailed++;
      
      if (options.retry !== false) {
        return await this.retryPublish(topic, event, options);
      }
      
      throw error;
    }
  }

  async publishBatch(topic, events, options = {}) {
    try {
      await this.ensureConnected();

      const startTime = Date.now();
      
      const messages = events.map(event => ({
        key: options.key || event.id || uuidv4(),
        value: JSON.stringify({
          ...event,
          metadata: {
            ...event.metadata,
            producedAt: new Date().toISOString(),
            producerId: this.config.clientId,
            batchId: options.batchId || uuidv4(),
            batchSize: events.length
          }
        }),
        headers: {
          'event-id': event.id || uuidv4(),
          'event-type': event.type,
          'correlation-id': event.metadata?.correlationId || uuidv4(),
          'source': event.metadata?.source || 'unknown',
          'timestamp': event.metadata?.timestamp || new Date().toISOString(),
          'content-type': 'application/json',
          'batch-id': options.batchId || uuidv4(),
          'batch-size': events.length.toString(),
          ...options.headers
        },
        partition: options.partition || null,
        timestamp: Date.now()
      }));

      const result = await this.producer.send({
        topic,
        messages
      });

      const endTime = Date.now();
      const latency = endTime - startTime;

      // Update metrics
      this.metrics.messagesProduced += events.length;
      this.metrics.bytesProduced += messages.reduce((sum, msg) => sum + msg.value.length, 0);
      this.metrics.productionLatency.push(latency);
      this.metrics.lastProductionTime = new Date();

      console.log(`Batch published to topic ${topic}`, {
        batchSize: events.length,
        batchId: options.batchId,
        latency: `${latency}ms`
      });

      return {
        success: true,
        topic,
        batchSize: events.length,
        batchId: options.batchId,
        results: result,
        timestamp: new Date(),
        latency
      };

    } catch (error) {
      console.error(`Failed to publish batch to topic ${topic}:`, error);
      this.metrics.messagesFailed += events.length;
      throw error;
    }
  }

  async addToBatch(topic, event, options = {}) {
    this.batchQueue.push({
      topic,
      event,
      options,
      timestamp: Date.now()
    });

    // If batch is full, flush immediately
    if (this.batchQueue.length >= this.batchSize) {
      await this.flushBatch();
    }
  }

  async flushBatch() {
    if (this.batchQueue.length === 0) {
      return;
    }

    // Group by topic
    const topicGroups = this.batchQueue.reduce((groups, item) => {
      if (!groups[item.topic]) {
        groups[item.topic] = [];
      }
      groups[item.topic].push(item);
      return groups;
    }, {});

    this.batchQueue = [];

    // Publish each topic group
    const results = [];
    for (const [topic, items] of Object.entries(topicGroups)) {
      try {
        const events = items.map(item => item.event);
        const options = items[0].options; // Use first item's options for batch
        
        const result = await this.publishBatch(topic, events, options);
        results.push(result);
      } catch (error) {
        console.error(`Failed to publish batch for topic ${topic}:`, error);
        results.push({ success: false, topic, error: error.message });
      }
    }

    return results;
  }

  startBatchProcessor() {
    this.batchTimer = setInterval(async () => {
      if (this.batchQueue.length > 0) {
        await this.flushBatch();
      }
    }, this.batchTimeout);
  }

  async retryPublish(topic, event, options, attempt = 1) {
    const maxRetries = options.maxRetries || 3;
    const retryDelay = options.retryDelay || 1000 * Math.pow(2, attempt - 1);

    if (attempt > maxRetries) {
      console.error(`Max retries exceeded for topic ${topic}`, {
        eventId: event.id,
        attempts: attempt - 1
      });
      throw new Error(`Failed to publish event after ${maxRetries} attempts`);
    }

    console.log(`Retrying event publish to topic ${topic}`, {
      eventId: event.id,
      attempt,
      delay: `${retryDelay}ms`
    });

    await new Promise(resolve => setTimeout(resolve, retryDelay));

    try {
      return await this.publishEvent(topic, event, {
        ...options,
        retry: false // Prevent infinite retry loops
      });
    } catch (error) {
      return await this.retryPublish(topic, event, options, attempt + 1);
    }
  }

  async createTopic(topic, options = {}) {
    try {
      const admin = this.kafka.admin();
      await admin.connect();

      const topicConfig = {
        topic,
        numPartitions: options.numPartitions || 3,
        replicationFactor: options.replicationFactor || 1,
        config: {
          'retention.ms': options.retentionMs || 604800000, // 7 days
          'cleanup.policy': options.cleanupPolicy || 'delete',
          'compression.type': options.compressionType || 'gzip',
          'max.message.bytes': options.maxMessageBytes || 1048576, // 1MB
          ...options.config
        }
      };

      await admin.createTopics({
        topics: [topicConfig]
      });

      await admin.disconnect();

      console.log(`Topic created: ${topic}`, topicConfig);
      return topicConfig;

    } catch (error) {
      if (error.type === 'TOPIC_ALREADY_EXISTS') {
        console.log(`Topic already exists: ${topic}`);
        return null;
      }
      console.error(`Failed to create topic ${topic}:`, error);
      throw error;
    }
  }

  async deleteTopic(topic) {
    try {
      const admin = this.kafka.admin();
      await admin.connect();

      await admin.deleteTopics({
        topics: [topic]
      });

      await admin.disconnect();

      console.log(`Topic deleted: ${topic}`);
      return true;

    } catch (error) {
      console.error(`Failed to delete topic ${topic}:`, error);
      throw error;
    }
  }

  async listTopics() {
    try {
      const admin = this.kafka.admin();
      await admin.connect();

      const topics = await admin.listTopics();
      
      await admin.disconnect();

      return topics;

    } catch (error) {
      console.error('Failed to list topics:', error);
      throw error;
    }
  }

  async getTopicMetadata(topic) {
    try {
      const admin = this.kafka.admin();
      await admin.connect();

      const metadata = await admin.fetchTopicMetadata({
        topics: [topic]
      });

      await admin.disconnect();

      return metadata.topics[0];

    } catch (error) {
      console.error(`Failed to get topic metadata for ${topic}:`, error);
      throw error;
    }
  }

  async ensureConnected() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  getMetrics() {
    const latency = this.metrics.productionLatency;
    
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
      batchQueueSize: this.batchQueue.length
    };
  }

  percentile(arr, p) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }

  resetMetrics() {
    this.metrics = {
      messagesProduced: 0,
      messagesFailed: 0,
      bytesProduced: 0,
      productionLatency: [],
      lastProductionTime: null
    };
  }

  async healthCheck() {
    try {
      await this.ensureConnected();
      
      // Test connection by listing topics
      const topics = await this.listTopics();
      
      return {
        status: 'healthy',
        connected: this.isConnected,
        topicsCount: topics.length,
        lastProductionTime: this.metrics.lastProductionTime,
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
}

export const kafkaProducerService = new KafkaProducerService();
export default kafkaProducerService;
