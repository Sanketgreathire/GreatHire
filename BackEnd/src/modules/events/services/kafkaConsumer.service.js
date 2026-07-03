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
    this.kafkaAvailable = false;
    this.config = {
      clientId: process.env.KAFKA_CLIENT_ID || 'greathire-consumer',
      brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
      ssl: process.env.KAFKA_SSL === 'true',
      sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
      } : undefined,
      retry: {
        initialRetryTime: 100,
        retries: 2
      },
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
    if (process.env.KAFKA_DISABLED === 'true') return;
    try {
      if (this.isConnected) return;
      this.kafka = new Kafka(this.config);
      this.isConnected = true;
      this.kafkaAvailable = true;
      console.log('Kafka consumer connected successfully');
      this.startRetryProcessor();
    } catch (error) {
      this.isConnected = false;
      this.kafkaAvailable = false;
      this.kafka = null;
    }
  }

  async disconnect() {
    try {
      if (!this.isConnected) return;
      for (const [consumerId, consumer] of this.consumers.entries()) {
        try { await consumer.stop(); await consumer.disconnect(); } catch (e) {}
      }
      this.consumers.clear();
      this.consumerGroups.clear();
      this.isConnected = false;
      this.kafkaAvailable = false;
    } catch (error) {}
  }

  async createConsumer(groupId, options = {}) {
    try {
      await this.ensureConnected();
      if (!this.kafkaAvailable) return null;
      const consumerId = uuidv4();
      const consumerConfig = { ...this.config.consumerConfig, groupId, ...options };
      const consumer = this.kafka.consumer(consumerConfig);
      await consumer.connect();
      this.consumers.set(consumerId, { consumer, groupId, topics: new Set(), handler: null, options, createdAt: new Date() });
      this.consumerGroups.set(groupId, { consumerId, createdAt: new Date() });
      console.log(`Consumer created: ${consumerId}`, { groupId });
      return consumerId;
    } catch (error) {
      return null;
    }
  }

  async subscribe(consumerId, topics, handler, options = {}) {
    try {
      if (!consumerId || !this.kafkaAvailable) return null;
      const consumerInfo = this.consumers.get(consumerId);
      if (!consumerInfo) return null;
      await consumerInfo.consumer.subscribe({ topics: Array.isArray(topics) ? topics : [topics], fromBeginning: options.fromBeginning || false });
      const topicArray = Array.isArray(topics) ? topics : [topics];
      topicArray.forEach(topic => consumerInfo.topics.add(topic));
      consumerInfo.handler = handler;
      await this.startConsumer(consumerId, options);
      console.log(`Subscribed to topics: ${topicArray.join(', ')}`, { consumerId });
      return consumerId;
    } catch (error) {
      return null;
    }
  }

  async startConsumer(consumerId, options = {}) {
    const consumerInfo = this.consumers.get(consumerId);
    if (!consumerInfo) return;
    const consumer = consumerInfo.consumer;
    const concurrency = options.concurrency || this.maxConcurrency;
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const startTime = Date.now();
          if (this.currentlyProcessing.size >= concurrency) {
            this.processingQueue.push({ topic, partition, message, startTime, consumerId });
            return;
          }
          const processingId = uuidv4();
          this.currentlyProcessing.add(processingId);
          let event;
          try {
            event = JSON.parse(message.value.toString());
          } catch (parseError) {
            this.metrics.messagesFailed++;
            this.currentlyProcessing.delete(processingId);
            return;
          }
          event.metadata = { ...event.metadata, consumedAt: new Date().toISOString(), consumerId, topic, partition, offset: message.offset, key: message.key?.toString(), headers: message.headers };
          await this.processMessage(consumerId, event, processingId);
          const latency = Date.now() - startTime;
          this.metrics.messagesConsumed++;
          this.metrics.messagesProcessed++;
          this.metrics.processingLatency.push(latency);
          this.metrics.lastConsumptionTime = new Date();
          this.updateConsumerLag(topic, partition, message.offset);
          if (this.metrics.processingLatency.length > 1000) {
            this.metrics.processingLatency = this.metrics.processingLatency.slice(-1000);
          }
        } catch (error) {
          this.metrics.messagesFailed++;
          await this.handleProcessingError(topic, message, error, consumerId);
        } finally {
          this.currentlyProcessing.delete(processingId);
          if (this.processingQueue.length > 0 && this.currentlyProcessing.size < concurrency) {
            const nextItem = this.processingQueue.shift();
            this.processMessageFromQueue(nextItem);
          }
        }
      },
      eachBatch: options.eachBatch || null,
      partitionsConsumedConcurrently: options.partitionsConsumedConcurrently || false
    });
    consumer.on('consumer.group_join', (event) => this.emit('groupJoin', event));
    consumer.on('consumer.group_leave', (event) => this.emit('groupLeave', event));
    consumer.on('consumer.crash', (event) => this.emit('consumerCrash', event));
  }

  async processMessage(consumerId, event, processingId) {
    const consumerInfo = this.consumers.get(consumerId);
    if (!consumerInfo || !consumerInfo.handler) return;
    try {
      await consumerInfo.handler(event);
      this.emit('messageProcessed', { consumerId, event, processingId, timestamp: new Date() });
    } catch (error) {
      this.emit('messageError', { consumerId, event, processingId, error, timestamp: new Date() });
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
        this.currentlyProcessing.delete(processingId);
        return;
      }
      event.metadata = { ...event.metadata, consumedAt: new Date().toISOString(), consumerId, topic, partition, offset: message.offset, key: message.key?.toString(), headers: message.headers, queued: true, queueTime: Date.now() - startTime };
      await this.processMessage(consumerId, event, processingId);
    } catch (error) {
      await this.handleProcessingError(topic, message, error, consumerId);
    } finally {
      this.currentlyProcessing.delete(processingId);
    }
  }

  async handleProcessingError(topic, message, error, consumerId) {
    try {
      const event = JSON.parse(message.value.toString());
      const retryCount = event.metadata?.retryCount || 0;
      if (retryCount < this.maxRetries) {
        this.retryQueue.push({ topic, message: { ...message, value: JSON.stringify({ ...event, metadata: { ...event.metadata, retryCount: retryCount + 1, lastRetryAt: new Date().toISOString(), retryError: error.message } }) }, consumerId, retryAt: new Date(Date.now() + this.retryDelay * Math.pow(2, retryCount)), error: error.message });
      } else {
        this.deadLetterQueue.push({ topic, message, event, consumerId, error: error.message, failedAt: new Date(), retryCount });
      }
    } catch (e) {}
  }

  startRetryProcessor() {
    setInterval(async () => {
      const now = new Date();
      const readyToRetry = this.retryQueue.filter(item => item.retryAt <= now);
      if (readyToRetry.length === 0) return;
      this.retryQueue = this.retryQueue.filter(item => item.retryAt > now);
      for (const item of readyToRetry) {
        try {
          const consumerInfo = this.consumers.get(item.consumerId);
          if (consumerInfo) {
            const event = JSON.parse(item.message.value.toString());
            await this.processMessage(item.consumerId, event, uuidv4());
          }
        } catch (error) {
          await this.handleProcessingError(item.topic, item.message, error, item.consumerId);
        }
      }
    }, 1000);
  }

  updateConsumerLag(topic, partition, offset) {
    const key = `${topic}:${partition}`;
    if (!this.metrics.consumerLag.has(key)) {
      this.metrics.consumerLag.set(key, { topic, partition, offset: parseInt(offset), lag: 0, timestamp: new Date() });
    } else {
      const lagInfo = this.metrics.consumerLag.get(key);
      lagInfo.offset = parseInt(offset);
      lagInfo.timestamp = new Date();
    }
  }

  async pauseConsumer(consumerId) { try { const c = this.consumers.get(consumerId); if (c) await c.consumer.pause(); } catch (e) {} }
  async resumeConsumer(consumerId) { try { const c = this.consumers.get(consumerId); if (c) await c.consumer.resume(); } catch (e) {} }
  async stopConsumer(consumerId) { try { const c = this.consumers.get(consumerId); if (c) await c.consumer.stop(); } catch (e) {} }

  async removeConsumer(consumerId) {
    try {
      const consumerInfo = this.consumers.get(consumerId);
      if (consumerInfo) {
        await consumerInfo.consumer.stop();
        await consumerInfo.consumer.disconnect();
        this.consumers.delete(consumerId);
        for (const [groupId, groupInfo] of this.consumerGroups.entries()) {
          if (groupInfo.consumerId === consumerId) { this.consumerGroups.delete(groupId); break; }
        }
      }
    } catch (e) {}
  }

  getConsumerInfo(consumerId) { return this.consumers.get(consumerId); }
  getAllConsumers() { return Array.from(this.consumers.entries()).map(([id, info]) => ({ id, groupId: info.groupId, topics: Array.from(info.topics), createdAt: info.createdAt, options: info.options })); }
  getConsumerGroups() { return Array.from(this.consumerGroups.entries()).map(([groupId, info]) => ({ groupId, consumerId: info.consumerId, createdAt: info.createdAt })); }
  getDeadLetterQueue(limit = 100) { return this.deadLetterQueue.slice(-limit).sort((a, b) => new Date(b.failedAt) - new Date(a.failedAt)); }
  getRetryQueue() { return this.retryQueue.map(item => ({ topic: item.topic, consumerId: item.consumerId, retryAt: item.retryAt, error: item.error, eventId: JSON.parse(item.message.value.toString()).id })); }

  getMetrics() {
    const latency = this.metrics.processingLatency;
    return { ...this.metrics, averageLatency: latency.length > 0 ? latency.reduce((sum, l) => sum + l, 0) / latency.length : 0, maxLatency: latency.length > 0 ? Math.max(...latency) : 0, minLatency: latency.length > 0 ? Math.min(...latency) : 0, p95Latency: latency.length > 0 ? this.percentile(latency, 0.95) : 0, p99Latency: latency.length > 0 ? this.percentile(latency, 0.99) : 0, connected: this.isConnected, kafkaAvailable: this.kafkaAvailable, consumersCount: this.consumers.size, processingQueueSize: this.processingQueue.length, currentlyProcessing: this.currentlyProcessing.size, deadLetterQueueSize: this.deadLetterQueue.length, retryQueueSize: this.retryQueue.length, consumerLag: Array.from(this.metrics.consumerLag.values()) };
  }

  percentile(arr, p) { const sorted = arr.slice().sort((a, b) => a - b); return sorted[Math.ceil(sorted.length * p) - 1]; }

  resetMetrics() { this.metrics = { messagesConsumed: 0, messagesProcessed: 0, messagesFailed: 0, processingLatency: [], lastConsumptionTime: null, consumerLag: new Map(), partitions: new Map() }; }

  async healthCheck() { return { status: this.kafkaAvailable ? 'healthy' : 'unavailable', connected: this.isConnected, kafkaAvailable: this.kafkaAvailable, consumersCount: this.consumers.size, metrics: this.getMetrics() }; }

  async ensureConnected() { if (!this.isConnected) await this.connect(); }

  clearDeadLetterQueue() { this.deadLetterQueue = []; }
  clearRetryQueue() { this.retryQueue = []; }

  async replayDeadLetterMessage(index) {
    if (index >= this.deadLetterQueue.length) throw new Error('Invalid index');
    const item = this.deadLetterQueue[index];
    try {
      const consumerInfo = this.consumers.get(item.consumerId);
      if (consumerInfo) {
        await this.processMessage(item.consumerId, item.event, uuidv4());
        this.deadLetterQueue.splice(index, 1);
        return true;
      }
    } catch (error) { throw error; }
    return false;
  }
}

export const kafkaConsumerService = new KafkaConsumerService();
export default kafkaConsumerService;
