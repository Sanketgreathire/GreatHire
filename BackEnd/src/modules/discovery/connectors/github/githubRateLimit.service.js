class GitHubRateLimitService {
  constructor() {
    this.rateLimit = {
      remaining: 5000,
      reset: null,
      limit: 5000,
      used: 0
    };
    this.requestHistory = [];
    this.lastRequestTime = null;
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.config = {
      maxRequestsPerHour: 5000,
      burstLimit: 30,
      burstWindowMs: 60000, // 1 minute
      retryDelayMs: 1000,
      maxRetryDelayMs: 60000 // 1 minute
    };
  }

  updateRateLimit(headers) {
    const remaining = parseInt(headers['x-ratelimit-remaining'] || 0);
    const reset = parseInt(headers['x-ratelimit-reset'] || 0);
    const limit = parseInt(headers['x-ratelimit-limit'] || 5000);

    this.rateLimit = {
      remaining,
      reset: reset * 1000, // Convert to milliseconds
      limit,
      used: limit - remaining
    };

    this.lastRequestTime = Date.now();
    this.requestHistory.push({
      timestamp: this.lastRequestTime,
      remaining,
      reset: this.rateLimit.reset
    });

    // Keep only last 100 requests in history
    if (this.requestHistory.length > 100) {
      this.requestHistory = this.requestHistory.slice(-100);
    }
  }

  async waitForQuota() {
    // Check if we're rate limited
    if (this.rateLimit.remaining <= 5) {
      const waitTime = this.calculateWaitTime();
      if (waitTime > 0) {
        console.log(`GitHub rate limit reached. Waiting ${waitTime}ms...`);
        await this.sleep(waitTime);
      }
    }

    // Check burst limit
    await this.checkBurstLimit();

    return true;
  }

  calculateWaitTime() {
    const now = Date.now();
    
    if (this.rateLimit.reset && this.rateLimit.reset > now) {
      return this.rateLimit.reset - now;
    }
    
    return 0;
  }

  async checkBurstLimit() {
    const now = Date.now();
    const recentRequests = this.requestHistory.filter(
      req => now - req.timestamp < this.config.burstWindowMs
    );

    if (recentRequests.length >= this.config.burstLimit) {
      const oldestRequest = recentRequests[0];
      const waitTime = this.config.burstWindowMs - (now - oldestRequest.timestamp);
      
      if (waitTime > 0) {
        console.log(`Burst limit reached. Waiting ${waitTime}ms...`);
        await this.sleep(waitTime);
      }
    }
  }

  async makeRequestWithRetry(requestFn, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.waitForQuota();
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (error.response?.status === 403) {
          // Rate limit exceeded
          const retryAfter = error.response.headers['retry-after'];
          let waitTime = this.config.retryDelayMs * Math.pow(2, attempt - 1);
          
          if (retryAfter) {
            waitTime = parseInt(retryAfter) * 1000;
          } else if (this.rateLimit.reset) {
            waitTime = Math.max(waitTime, this.rateLimit.reset - Date.now());
          }
          
          waitTime = Math.min(waitTime, this.config.maxRetryDelayMs);
          
          console.log(`Rate limit hit. Retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
          await this.sleep(waitTime);
        } else if (error.response?.status >= 500) {
          // Server error, retry with exponential backoff
          const waitTime = Math.min(
            this.config.retryDelayMs * Math.pow(2, attempt - 1),
            this.config.maxRetryDelayMs
          );
          
          console.log(`Server error. Retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
          await this.sleep(waitTime);
        } else {
          // Client error, don't retry
          throw error;
        }
      }
    }
    
    throw lastError;
  }

  async queueRequest(requestFn, priority = 0) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        requestFn,
        priority,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      // Sort queue by priority (higher priority first)
      this.requestQueue.sort((a, b) => b.priority - a.priority);
      
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const queueItem = this.requestQueue.shift();
      
      try {
        const result = await this.makeRequestWithRetry(queueItem.requestFn);
        queueItem.resolve(result);
      } catch (error) {
        queueItem.reject(error);
      }
    }

    this.isProcessingQueue = false;
  }

  getRateLimitStatus() {
    const now = Date.now();
    const resetIn = this.rateLimit.reset ? Math.max(0, this.rateLimit.reset - now) : 0;
    
    return {
      remaining: this.rateLimit.remaining,
      limit: this.rateLimit.limit,
      used: this.rateLimit.used,
      resetIn,
      resetAt: this.rateLimit.reset ? new Date(this.rateLimit.reset) : null,
      lastRequest: this.lastRequestTime ? new Date(this.lastRequestTime) : null,
      queueLength: this.requestQueue.length,
      isProcessingQueue: this.isProcessingQueue
    };
  }

  getUsageStats(timeRange = '1h') {
    const now = Date.now();
    let startTime;

    switch (timeRange) {
      case '1h':
        startTime = now - (60 * 60 * 1000);
        break;
      case '24h':
        startTime = now - (24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = now - (60 * 60 * 1000);
    }

    const requestsInRange = this.requestHistory.filter(req => req.timestamp >= startTime);
    
    return {
      timeRange,
      totalRequests: requestsInRange.length,
      averagePerHour: requestsInRange.length / (timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : 168),
      peakUsage: this.calculatePeakUsage(requestsInRange),
      efficiency: this.calculateEfficiency(requestsInRange)
    };
  }

  calculatePeakUsage(requests) {
    if (requests.length === 0) return 0;

    const hourlyUsage = {};
    requests.forEach(req => {
      const hour = new Date(req.timestamp).getHours();
      hourlyUsage[hour] = (hourlyUsage[hour] || 0) + 1;
    });

    return Math.max(...Object.values(hourlyUsage));
  }

  calculateEfficiency(requests) {
    if (requests.length === 0) return 0;

    const successfulRequests = requests.filter(req => req.remaining > 0).length;
    return (successfulRequests / requests.length) * 100;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset() {
    this.rateLimit = {
      remaining: 5000,
      reset: null,
      limit: 5000,
      used: 0
    };
    this.requestHistory = [];
    this.lastRequestTime = null;
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  setConfig(config) {
    this.config = { ...this.config, ...config };
  }

  getHealthStatus() {
    const status = this.getRateLimitStatus();
    const usage = this.getUsageStats('1h');
    
    return {
      healthy: status.remaining > 10,
      rateLimit: status,
      usage,
      queue: {
        length: status.queueLength,
        processing: status.isProcessingQueue
      },
      recommendations: this.getRecommendations(status, usage)
    };
  }

  getRecommendations(status, usage) {
    const recommendations = [];

    if (status.remaining < 100) {
      recommendations.push({
        type: 'warning',
        message: 'Rate limit running low. Consider reducing request frequency.',
        priority: 'high'
      });
    }

    if (usage.averagePerHour > this.config.maxRequestsPerHour * 0.8) {
      recommendations.push({
        type: 'warning',
        message: 'High usage detected. Consider implementing request batching.',
        priority: 'medium'
      });
    }

    if (status.queueLength > 50) {
      recommendations.push({
        type: 'warning',
        message: 'Large request queue. Consider increasing worker concurrency.',
        priority: 'medium'
      });
    }

    if (usage.efficiency < 80) {
      recommendations.push({
        type: 'info',
        message: 'Low request efficiency. Check for failed requests.',
        priority: 'low'
      });
    }

    return recommendations;
  }

  // Distributed throttling for multiple instances
  async acquireDistributedLock(resource, ttl = 60000) {
    // This would integrate with Redis or another distributed lock system
    // For now, we'll simulate with in-memory lock
    const lockKey = `rate_limit_lock_${resource}`;
    
    if (this[lockKey]) {
      return false;
    }
    
    this[lockKey] = true;
    setTimeout(() => {
      delete this[lockKey];
    }, ttl);
    
    return true;
  }

  async releaseDistributedLock(resource) {
    const lockKey = `rate_limit_lock_${resource}`;
    delete this[lockKey];
  }

  // Adaptive rate limiting based on response times
  async adaptiveRequest(requestFn) {
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequestWithRetry(requestFn);
      const responseTime = Date.now() - startTime;
      
      // Adjust rate limit based on response time
      if (responseTime > 5000) { // Slow response
        this.config.burstLimit = Math.max(10, this.config.burstLimit - 5);
      } else if (responseTime < 1000) { // Fast response
        this.config.burstLimit = Math.min(50, this.config.burstLimit + 2);
      }
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Reduce rate limit on errors
      this.config.burstLimit = Math.max(5, this.config.burstLimit - 10);
      
      throw error;
    }
  }

  // Batch request optimization
  async batchRequests(requests, batchSize = 10) {
    const results = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(req => this.makeRequestWithRetry(req))
      );
      
      results.push(...batchResults);
      
      // Add delay between batches
      if (i + batchSize < requests.length) {
        await this.sleep(1000);
      }
    }
    
    return results;
  }

  // Smart retry with jitter
  async smartRetry(requestFn, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.waitForQuota();
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Calculate delay with jitter
        const baseDelay = this.config.retryDelayMs * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 1000; // Up to 1 second jitter
        const delay = Math.min(baseDelay + jitter, this.config.maxRetryDelayMs);
        
        console.log(`Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }
}

export const githubRateLimitService = new GitHubRateLimitService();
export default githubRateLimitService;
