import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export class EventBusService extends EventEmitter {
  constructor() {
    super();
    this.eventHistory = new Map();
    this.eventSubscriptions = new Map();
    this.eventMetrics = {
      published: 0,
      processed: 0,
      failed: 0,
      retries: 0
    };
    this.retryQueues = new Map();
    this.deadLetterQueue = [];
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
  }

  async publishEvent(eventType, payload, options = {}) {
    try {
      const event = {
        id: uuidv4(),
        type: eventType,
        payload,
        metadata: {
          timestamp: new Date().toISOString(),
          source: options.source || 'unknown',
          version: options.version || '1.0',
          correlationId: options.correlationId || uuidv4(),
          causationId: options.causationId || null,
          messageId: options.messageId || uuidv4(),
          userId: options.userId || null,
          sessionId: options.sessionId || null,
          tenantId: options.tenantId || null,
          priority: options.priority || 'normal',
          retryCount: 0,
          maxRetries: options.maxRetries || this.maxRetries
        }
      };

      // Store event in history
      this.eventHistory.set(event.id, {
        ...event,
        status: 'published',
        publishedAt: new Date()
      });

      // Update metrics
      this.eventMetrics.published++;

      // Emit to local subscribers
      this.emit(eventType, event);

      // Emit to wildcard subscribers
      this.emit('*', event);

      // Log event publication
      console.log(`Event published: ${eventType}`, {
        eventId: event.id,
        correlationId: event.metadata.correlationId,
        source: event.metadata.source
      });

      return event;

    } catch (error) {
      console.error(`Error publishing event ${eventType}:`, error);
      this.eventMetrics.failed++;
      throw error;
    }
  }

  async publishBatch(events, options = {}) {
    const batchId = uuidv4();
    const batchEvents = [];

    try {
      for (const eventData of events) {
        const event = await this.publishEvent(eventData.type, eventData.payload, {
          ...options,
          batchId
        });
        batchEvents.push(event);
      }

      return {
        batchId,
        events: batchEvents,
        count: batchEvents.length
      };

    } catch (error) {
      console.error(`Error publishing batch ${batchId}:`, error);
      throw error;
    }
  }

  subscribe(eventType, handler, options = {}) {
    const subscriptionId = uuidv4();
    
    const wrappedHandler = async (event) => {
      try {
        await handler(event);
        this.eventMetrics.processed++;
        
        // Update event status
        if (this.eventHistory.has(event.id)) {
          const historyEvent = this.eventHistory.get(event.id);
          historyEvent.status = 'processed';
          historyEvent.processedAt = new Date();
          historyEvent.processingLatency = new Date() - new Date(historyEvent.metadata.timestamp);
        }

      } catch (error) {
        console.error(`Error processing event ${eventType}:`, error);
        this.eventMetrics.failed++;
        
        // Update event status
        if (this.eventHistory.has(event.id)) {
          const historyEvent = this.eventHistory.get(event.id);
          historyEvent.status = 'failed';
          historyEvent.error = error.message;
          historyEvent.failedAt = new Date();
        }

        // Handle retry logic
        await this.handleEventRetry(event, error);
      }
    };

    // Subscribe to specific event type
    this.on(eventType, wrappedHandler);

    // Store subscription
    this.eventSubscriptions.set(subscriptionId, {
      id: subscriptionId,
      eventType,
      handler: wrappedHandler,
      options: {
        once: options.once || false,
        priority: options.priority || 'normal',
        filter: options.filter || null,
        transform: options.transform || null
      }
    });

    console.log(`Subscription created: ${eventType}`, { subscriptionId });

    return subscriptionId;
  }

  unsubscribe(subscriptionId) {
    const subscription = this.eventSubscriptions.get(subscriptionId);
    
    if (subscription) {
      this.off(subscription.eventType, subscription.handler);
      this.eventSubscriptions.delete(subscriptionId);
      console.log(`Subscription removed: ${subscription.eventType}`, { subscriptionId });
      return true;
    }

    return false;
  }

  async handleEventRetry(event, error) {
    const retryCount = event.metadata.retryCount || 0;
    const maxRetries = event.metadata.maxRetries || this.maxRetries;

    if (retryCount < maxRetries) {
      // Increment retry count
      event.metadata.retryCount = retryCount + 1;
      
      // Add to retry queue
      if (!this.retryQueues.has(event.type)) {
        this.retryQueues.set(event.type, []);
      }
      
      this.retryQueues.get(event.type).push({
        event,
        retryAt: new Date(Date.now() + this.retryDelay * Math.pow(2, retryCount)),
        error: error.message
      });

      this.eventMetrics.retries++;
      
      console.log(`Event queued for retry: ${event.type}`, {
        eventId: event.id,
        retryCount: retryCount + 1,
        retryAt: this.retryQueues.get(event.type)[this.retryQueues.get(event.type).length - 1].retryAt
      });

      // Schedule retry
      setTimeout(() => {
        this.processRetryQueue(event.type);
      }, this.retryDelay * Math.pow(2, retryCount));

    } else {
      // Add to dead letter queue
      this.deadLetterQueue.push({
        event,
        error: error.message,
        failedAt: new Date(),
        retryCount: retryCount
      });

      console.error(`Event moved to dead letter queue: ${event.type}`, {
        eventId: event.id,
        retryCount,
        error: error.message
      });
    }
  }

  async processRetryQueue(eventType) {
    const retryQueue = this.retryQueues.get(eventType);
    
    if (!retryQueue || retryQueue.length === 0) {
      return;
    }

    const now = new Date();
    const readyToRetry = retryQueue.filter(item => item.retryAt <= now);
    
    if (readyToRetry.length === 0) {
      return;
    }

    // Remove ready items from queue
    const remainingItems = retryQueue.filter(item => item.retryAt > now);
    this.retryQueues.set(eventType, remainingItems);

    // Process retries
    for (const item of readyToRetry) {
      try {
        // Update event status
        if (this.eventHistory.has(item.event.id)) {
          const historyEvent = this.eventHistory.get(item.event.id);
          historyEvent.status = 'retrying';
          historyEvent.lastRetryAt = new Date();
        }

        // Re-emit event
        this.emit(item.event.type, item.event);

        console.log(`Event retry processed: ${item.event.type}`, {
          eventId: item.event.id,
          retryCount: item.event.metadata.retryCount
        });

      } catch (error) {
        console.error(`Error during event retry: ${item.event.type}`, error);
        await this.handleEventRetry(item.event, error);
      }
    }
  }

  getEventHistory(eventId) {
    return this.eventHistory.get(eventId);
  }

  getEventsByType(eventType, limit = 100) {
    const events = Array.from(this.eventHistory.values())
      .filter(event => event.type === eventType)
      .sort((a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp))
      .slice(0, limit);

    return events;
  }

  getEventsByCorrelationId(correlationId) {
    return Array.from(this.eventHistory.values())
      .filter(event => event.metadata.correlationId === correlationId)
      .sort((a, b) => new Date(a.metadata.timestamp) - new Date(b.metadata.timestamp));
  }

  getDeadLetterQueue(limit = 100) {
    return this.deadLetterQueue
      .slice(-limit)
      .sort((a, b) => new Date(b.failedAt) - new Date(a.failedAt));
  }

  getRetryQueues() {
    const queues = {};
    
    for (const [eventType, queue] of this.retryQueues.entries()) {
      queues[eventType] = {
        count: queue.length,
        nextRetry: queue.length > 0 ? Math.min(...queue.map(item => item.retryAt)) : null,
        items: queue.slice(0, 10) // Show first 10 items
      };
    }

    return queues;
  }

  getMetrics() {
    return {
      ...this.eventMetrics,
      subscriptions: this.eventSubscriptions.size,
      historySize: this.eventHistory.size,
      deadLetterQueueSize: this.deadLetterQueue.length,
      retryQueueSize: Array.from(this.retryQueues.values()).reduce((sum, queue) => sum + queue.length, 0)
    };
  }

  clearHistory(olderThan = null) {
    if (olderThan) {
      const cutoffDate = new Date(olderThan);
      
      for (const [eventId, event] of this.eventHistory.entries()) {
        if (new Date(event.metadata.timestamp) < cutoffDate) {
          this.eventHistory.delete(eventId);
        }
      }
    } else {
      this.eventHistory.clear();
    }
  }

  clearDeadLetterQueue() {
    this.deadLetterQueue = [];
  }

  clearRetryQueues() {
    this.retryQueues.clear();
  }

  async replayEvent(eventId, options = {}) {
    const event = this.eventHistory.get(eventId);
    
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    // Create new event with same payload but new metadata
    const replayEvent = {
      ...event,
      id: uuidv4(),
      metadata: {
        ...event.metadata,
        timestamp: new Date().toISOString(),
        correlationId: options.correlationId || event.metadata.correlationId,
        causationId: event.id, // Original event is the cause
        messageId: uuidv4(),
        retryCount: 0,
        replayed: true,
        originalEventId: eventId
      }
    };

    // Store replayed event
    this.eventHistory.set(replayEvent.id, {
      ...replayEvent,
      status: 'published',
      publishedAt: new Date()
    });

    // Emit replayed event
    this.emit(replayEvent.type, replayEvent);

    console.log(`Event replayed: ${replayEvent.type}`, {
      originalEventId: eventId,
      newEventId: replayEvent.id
    });

    return replayEvent;
  }

  async replayEventsByType(eventType, options = {}) {
    const events = this.getEventsByType(eventType, options.limit || 100);
    const replayedEvents = [];

    for (const event of events) {
      try {
        const replayedEvent = await this.replayEvent(event.id, options);
        replayedEvents.push(replayedEvent);
      } catch (error) {
        console.error(`Error replaying event ${event.id}:`, error);
      }
    }

    return replayedEvents;
  }

  createEventFilter(filterCriteria) {
    return (event) => {
      if (filterCriteria.eventType && event.type !== filterCriteria.eventType) {
        return false;
      }
      
      if (filterCriteria.source && event.metadata.source !== filterCriteria.source) {
        return false;
      }
      
      if (filterCriteria.priority && event.metadata.priority !== filterCriteria.priority) {
        return false;
      }
      
      if (filterCriteria.timestampRange) {
        const eventTime = new Date(event.metadata.timestamp);
        if (eventTime < filterCriteria.timestampRange.start || eventTime > filterCriteria.timestampRange.end) {
          return false;
        }
      }
      
      if (filterCriteria.payloadFilter) {
        for (const [key, value] of Object.entries(filterCriteria.payloadFilter)) {
          if (event.payload[key] !== value) {
            return false;
          }
        }
      }
      
      return true;
    };
  }

  getSubscriptionStats() {
    const stats = {};
    
    for (const subscription of this.eventSubscriptions.values()) {
      if (!stats[subscription.eventType]) {
        stats[subscription.eventType] = 0;
      }
      stats[subscription.eventType]++;
    }

    return stats;
  }

  async shutdown() {
    console.log('Shutting down event bus...');
    
    // Clear all subscriptions
    for (const subscriptionId of this.eventSubscriptions.keys()) {
      this.unsubscribe(subscriptionId);
    }
    
    // Clear retry queues
    this.clearRetryQueues();
    
    // Clear history
    this.clearHistory();
    
    // Remove all listeners
    this.removeAllListeners();
    
    console.log('Event bus shutdown complete');
  }
}

export const eventBusService = new EventBusService();
export default eventBusService;
