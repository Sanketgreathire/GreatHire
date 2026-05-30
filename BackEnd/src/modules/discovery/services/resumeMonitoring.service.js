import { ResumeCandidateMetadata } from "../../../models/resumeCandidateMetadata.model.js";
import { IngestionHistory } from "../../../models/ingestionHistory.model.js";
import { SourceMetadata } from "../../../models/sourceMetadata.model.js";
import { getResumeDiscoveryQueueStats } from "../workers/resumeDiscovery.worker.js";

class ResumeMonitoringService {
  constructor() {
    this.metricsCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getIngestionMetrics(timeRange = '24h') {
    const cacheKey = `resume-ingestion-metrics-${timeRange}`;
    
    if (this.metricsCache.has(cacheKey)) {
      const cached = this.metricsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    try {
      // Get ingestion history
      const ingestionHistory = await IngestionHistory.find({
        connectorName: 'resume-discovery',
        startedAt: { $gte: startDate }
      }).sort({ startedAt: -1 });

      // Get source metadata
      const sourceMetadata = await SourceMetadata.find({
        sourceType: 'resume',
        fetchedAt: { $gte: startDate }
      }).sort({ fetchedAt: -1 });

      // Get queue stats
      const queueStats = await getResumeDiscoveryQueueStats();

      // Calculate metrics
      const metrics = {
        timeRange,
        period: {
          start: startDate,
          end: now
        },
        ingestion: {
          total: ingestionHistory.length,
          completed: ingestionHistory.filter(h => h.status === 'completed').length,
          failed: ingestionHistory.filter(h => h.status === 'failed').length,
          running: ingestionHistory.filter(h => h.status === 'running').length,
          queued: ingestionHistory.filter(h => h.status === 'queued').length,
          successRate: this.calculateSuccessRate(ingestionHistory),
          avgProcessingTime: this.calculateAvgProcessingTime(ingestionHistory)
        },
        sources: {
          total: sourceMetadata.length,
          successful: sourceMetadata.filter(s => s.ingestionStatus === 'completed').length,
          failed: sourceMetadata.filter(s => s.ingestionStatus === 'failed').length,
          processing: sourceMetadata.filter(s => s.ingestionStatus === 'processing').length,
          avgConfidenceScore: this.calculateAvgConfidenceScore(sourceMetadata)
        },
        queue: queueStats,
        trends: this.calculateTrends(ingestionHistory, sourceMetadata, timeRange)
      };

      this.metricsCache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      console.error('Error getting resume ingestion metrics:', error);
      throw error;
    }
  }

  async getProfileMetrics(timeRange = '24h') {
    const cacheKey = `resume-profile-metrics-${timeRange}`;
    
    if (this.metricsCache.has(cacheKey)) {
      const cached = this.metricsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    try {
      // Get resume candidates created in time range
      const candidates = await ResumeCandidateMetadata.find({
        createdAt: { $gte: startDate }
      }).populate('candidateId', 'name email resumeUrl location skills');

      // Calculate profile metrics
      const metrics = {
        timeRange,
        period: {
          start: startDate,
          end: now
        },
        profiles: {
          total: candidates.length,
          withEmail: candidates.filter(c => c.candidateId?.email).length,
          withLocation: candidates.filter(c => c.candidateId?.location).length,
          flagged: candidates.filter(c => c.flagged).length,
          avgParsingConfidence: this.calculateAvgParsingConfidence(candidates),
          avgQualityScore: this.calculateAvgQualityScore(candidates)
        },
        documentTypes: this.getDocumentTypeDistribution(candidates),
        qualityMetrics: this.getQualityMetrics(candidates),
        processing: this.getProcessingMetrics(candidates)
      };

      this.metricsCache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      console.error('Error getting resume profile metrics:', error);
      throw error;
    }
  }

  async getRealTimeMetrics() {
    try {
      const queueStats = await getResumeDiscoveryQueueStats();
      
      // Get current active candidates
      const activeCandidates = await ResumeCandidateMetadata.getRecentlyProcessed(1, 10);
      
      // Get recent failures
      const recentFailures = await IngestionHistory.find({
        connectorName: 'resume-discovery',
        status: 'failed',
        completedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
      }).sort({ completedAt: -1 }).limit(10);

      return {
        timestamp: new Date(),
        queue: queueStats,
        activeCandidates: activeCandidates.length,
        recentFailures: recentFailures.length,
        health: {
          queueHealthy: queueStats.waiting < 100,
          processingHealthy: queueStats.active < 5,
          failureRate: recentFailures.length > 0 ? 'high' : 'normal'
        }
      };
    } catch (error) {
      console.error('Error getting resume real-time metrics:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(timeRange = '24h') {
    const cacheKey = `resume-performance-metrics-${timeRange}`;
    
    if (this.metricsCache.has(cacheKey)) {
      const cached = this.metricsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const ingestionHistory = await IngestionHistory.find({
        connectorName: 'resume-discovery',
        status: 'completed',
        completedAt: { $gte: new Date(Date.now() - this.getTimeRangeMs(timeRange)) }
      });

      const metrics = {
        timeRange,
        performance: {
          avgProcessingTime: this.calculateAvgProcessingTime(ingestionHistory),
          avgProfilesPerSecond: this.calculateAvgProfilesPerSecond(ingestionHistory),
          throughput: this.calculateThroughput(ingestionHistory, timeRange),
          efficiency: this.calculateEfficiency(ingestionHistory),
          bottlenecks: this.identifyBottlenecks(ingestionHistory)
        },
        quality: {
          avgConfidenceScore: this.calculateAvgConfidenceFromHistory(ingestionHistory),
          duplicateRate: this.calculateDuplicateRate(ingestionHistory),
          errorRate: this.calculateErrorRate(ingestionHistory)
        }
      };

      this.metricsCache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      console.error('Error getting resume performance metrics:', error);
      throw error;
    }
  }

  async getHealthStatus() {
    try {
      const queueStats = await getResumeDiscoveryQueueStats();
      const recentFailures = await IngestionHistory.find({
        connectorName: 'resume-discovery',
        status: 'failed',
        completedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
      });

      const health = {
        status: 'healthy',
        issues: [],
        recommendations: []
      };

      // Check queue health
      if (queueStats.waiting > 100) {
        health.status = 'degraded';
        health.issues.push('High queue backlog');
        health.recommendations.push('Consider increasing worker concurrency');
      }

      if (queueStats.failed > 10) {
        health.status = 'unhealthy';
        health.issues.push('High failure rate');
        health.recommendations.push('Check document download and parsing logic');
      }

      // Check recent failures
      if (recentFailures.length > 5) {
        health.status = 'unhealthy';
        health.issues.push('Multiple recent failures');
        health.recommendations.push('Review error logs and adjust parsing strategy');
      }

      return {
        ...health,
        queue: queueStats,
        recentFailures: recentFailures.length,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error getting resume health status:', error);
      throw error;
    }
  }

  calculateSuccessRate(history) {
    if (history.length === 0) return 0;
    const completed = history.filter(h => h.status === 'completed').length;
    return (completed / history.length * 100).toFixed(2);
  }

  calculateAvgProcessingTime(history) {
    const completed = history.filter(h => h.status === 'completed' && h.duration);
    if (completed.length === 0) return 0;
    const totalTime = completed.reduce((sum, h) => sum + h.duration, 0);
    return Math.round(totalTime / completed.length);
  }

  calculateAvgConfidenceScore(metadata) {
    if (metadata.length === 0) return 0;
    const totalConfidence = metadata.reduce((sum, m) => sum + (m.confidenceScore || 0), 0);
    return (totalConfidence / metadata.length).toFixed(2);
  }

  calculateAvgParsingConfidence(candidates) {
    if (candidates.length === 0) return 0;
    const totalConfidence = candidates.reduce((sum, c) => sum + (c.parsingConfidence || 0), 0);
    return (totalConfidence / candidates.length).toFixed(2);
  }

  calculateAvgQualityScore(candidates) {
    if (candidates.length === 0) return 0;
    const totalScore = candidates.reduce((sum, c) => sum + (c.getOverallQualityScore ? c.getOverallQualityScore() : 0), 0);
    return (totalScore / candidates.length).toFixed(2);
  }

  getDocumentTypeDistribution(candidates) {
    const distribution = {};
    candidates.forEach(candidate => {
      const docType = candidate.documentType || 'unknown';
      distribution[docType] = (distribution[docType] || 0) + 1;
    });
    return distribution;
  }

  getQualityMetrics(candidates) {
    if (candidates.length === 0) {
      return {
        avgProfileCompleteness: 0,
        avgDataQuality: 0,
        avgStructureQuality: 0,
        avgContentQuality: 0
      };
    }

    const metrics = {
      avgProfileCompleteness: 0,
      avgDataQuality: 0,
      avgStructureQuality: 0,
      avgContentQuality: 0
    };

    candidates.forEach(candidate => {
      const quality = candidate.qualityMetrics || {};
      metrics.avgProfileCompleteness += quality.profileCompleteness || 0;
      metrics.avgDataQuality += quality.dataQuality || 0;
      metrics.avgStructureQuality += quality.structureQuality || 0;
      metrics.avgContentQuality += quality.contentQuality || 0;
    });

    Object.keys(metrics).forEach(key => {
      metrics[key] = (metrics[key] / candidates.length).toFixed(2);
    });

    return metrics;
  }

  getProcessingMetrics(candidates) {
    const totalCandidates = candidates.length;
    const highConfidence = candidates.filter(c => c.parsingConfidence >= 70).length;
    const mediumConfidence = candidates.filter(c => c.parsingConfidence >= 40 && c.parsingConfidence < 70).length;
    const lowConfidence = candidates.filter(c => c.parsingConfidence < 40).length;

    return {
      total: totalCandidates,
      highConfidence,
      mediumConfidence,
      lowConfidence,
      avgProcessingDuration: this.calculateAvgProcessingDuration(candidates),
      parseSuccessRate: this.calculateParseSuccessRate(candidates)
    };
  }

  calculateAvgProcessingDuration(candidates) {
    const processedCandidates = candidates.filter(c => c.ingestionMetadata?.processingTime && c.ingestionMetadata?.downloadTime);
    if (processedCandidates.length === 0) return 0;

    const totalDuration = processedCandidates.reduce((sum, c) => {
      return sum + (new Date(c.ingestionMetadata.processingTime) - new Date(c.ingestionMetadata.downloadTime));
    }, 0);

    return Math.round(totalDuration / processedCandidates.length);
  }

  calculateParseSuccessRate(candidates) {
    if (candidates.length === 0) return 0;
    
    const successful = candidates.filter(c => c.processingMetrics?.parsingSuccess).length;
    return (successful / candidates.length * 100).toFixed(2);
  }

  calculateTrends(ingestionHistory, sourceMetadata, timeRange) {
    // This would typically calculate hourly/daily trends
    // For now, return placeholder data
    return {
      ingestion: [],
      sources: [],
      successRate: []
    };
  }

  calculateAvgProfilesPerSecond(history) {
    const completed = history.filter(h => h.status === 'completed');
    if (completed.length === 0) return 0;
    
    const totalProfiles = completed.reduce((sum, h) => sum + (h.result?.profiles?.length || 0), 0);
    const totalTime = completed.reduce((sum, h) => sum + h.duration, 0);
    
    return (totalProfiles / (totalTime / 1000)).toFixed(2);
  }

  calculateThroughput(history, timeRange) {
    const completed = history.filter(h => h.status === 'completed');
    const timeMs = this.getTimeRangeMs(timeRange);
    
    return (completed.length / (timeMs / 1000 / 3600)).toFixed(2); // profiles per hour
  }

  calculateEfficiency(history) {
    const completed = history.filter(h => h.status === 'completed');
    if (completed.length === 0) return 0;
    
    const successful = completed.filter(h => h.result?.success);
    return (successful.length / completed.length * 100).toFixed(2);
  }

  identifyBottlenecks(history) {
    const bottlenecks = [];
    
    // Check for long processing times
    const avgTime = this.calculateAvgProcessingTime(history);
    if (avgTime > 30000) { // 30 seconds
      bottlenecks.push('Long processing times detected');
    }
    
    // Check for high failure rate
    const failureRate = (100 - parseFloat(this.calculateSuccessRate(history)));
    if (failureRate > 20) {
      bottlenecks.push('High failure rate detected');
    }
    
    return bottlenecks;
  }

  calculateAvgConfidenceFromHistory(history) {
    const completed = history.filter(h => h.status === 'completed');
    if (completed.length === 0) return 0;
    
    const totalConfidence = completed.reduce((sum, h) => {
      return sum + (h.result?.avgConfidenceScore || 0);
    }, 0);
    
    return (totalConfidence / completed.length).toFixed(2);
  }

  calculateDuplicateRate(history) {
    const completed = history.filter(h => h.status === 'completed');
    if (completed.length === 0) return 0;
    
    const totalDuplicates = completed.reduce((sum, h) => {
      return sum + (h.result?.duplicates?.length || 0);
    }, 0);
    
    const totalProfiles = completed.reduce((sum, h) => {
      return sum + (h.result?.totalProfiles || 0);
    }, 0);
    
    if (totalProfiles === 0) return 0;
    return (totalDuplicates / totalProfiles * 100).toFixed(2);
  }

  calculateErrorRate(history) {
    if (history.length === 0) return 0;
    const failed = history.filter(h => h.status === 'failed').length;
    return (failed / history.length * 100).toFixed(2);
  }

  getTimeRangeMs(timeRange) {
    switch (timeRange) {
      case '1h': return 60 * 60 * 1000;
      case '24h': return 24 * 60 * 60 * 1000;
      case '7d': return 7 * 24 * 60 * 60 * 1000;
      case '30d': return 30 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  }

  clearCache() {
    this.metricsCache.clear();
  }

  async generateReport(timeRange = '24h') {
    try {
      const [ingestionMetrics, profileMetrics, performanceMetrics, healthStatus] = await Promise.all([
        this.getIngestionMetrics(timeRange),
        this.getProfileMetrics(timeRange),
        this.getPerformanceMetrics(timeRange),
        this.getHealthStatus()
      ]);

      return {
        timeRange,
        generatedAt: new Date(),
        summary: {
          totalProfiles: profileMetrics.profiles.total,
          successRate: ingestionMetrics.ingestion.successRate,
          avgProcessingTime: ingestionMetrics.ingestion.avgProcessingTime,
          healthStatus: healthStatus.status
        },
        ingestion: ingestionMetrics,
        profiles: profileMetrics,
        performance: performanceMetrics,
        health: healthStatus,
        recommendations: this.generateRecommendations(ingestionMetrics, profileMetrics, performanceMetrics, healthStatus)
      };
    } catch (error) {
      console.error('Error generating resume report:', error);
      throw error;
    }
  }

  generateRecommendations(ingestionMetrics, profileMetrics, performanceMetrics, healthStatus) {
    const recommendations = [];

    // Queue recommendations
    if (ingestionMetrics.queue.waiting > 50) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Consider increasing worker concurrency to reduce queue backlog',
        action: 'Increase resume discovery worker concurrency'
      });
    }

    // Quality recommendations
    if (profileMetrics.profiles.avgParsingConfidence < 60) {
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        message: 'Average parsing confidence is low. Consider improving parsing algorithms.',
        action: 'Enhance resume parsing and normalization logic'
      });
    }

    // Performance recommendations
    if (performanceMetrics.performance.avgProcessingTime > 20000) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'Processing times are high. Consider optimizing document processing.',
        action: 'Review and optimize document extraction and parsing'
      });
    }

    // Health recommendations
    if (healthStatus.status !== 'healthy') {
      recommendations.push({
        type: 'health',
        priority: 'high',
        message: 'System health issues detected. Immediate attention required.',
        action: 'Review error logs and address identified issues'
      });
    }

    return recommendations;
  }
}

export const resumeMonitoringService = new ResumeMonitoringService();
export default resumeMonitoringService;
