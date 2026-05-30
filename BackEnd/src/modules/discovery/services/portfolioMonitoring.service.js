import { PortfolioCandidateMetadata } from "../../../models/portfolioCandidateMetadata.model.js";
import { IngestionHistory } from "../../../models/ingestionHistory.model.js";
import { SourceMetadata } from "../../../models/sourceMetadata.model.js";
import { getPortfolioDiscoveryQueueStats } from "../workers/portfolioDiscovery.worker.js";

class PortfolioMonitoringService {
  constructor() {
    this.metricsCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getIngestionMetrics(timeRange = '24h') {
    const cacheKey = `portfolio-ingestion-metrics-${timeRange}`;
    
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
        connectorName: 'portfolio-discovery',
        startedAt: { $gte: startDate }
      }).sort({ startedAt: -1 });

      // Get source metadata
      const sourceMetadata = await SourceMetadata.find({
        sourceType: 'portfolio',
        fetchedAt: { $gte: startDate }
      }).sort({ fetchedAt: -1 });

      // Get queue stats
      const queueStats = await getPortfolioDiscoveryQueueStats();

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
      console.error('Error getting portfolio ingestion metrics:', error);
      throw error;
    }
  }

  async getProfileMetrics(timeRange = '24h') {
    const cacheKey = `portfolio-profile-metrics-${timeRange}`;
    
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
      // Get portfolio candidates created in time range
      const candidates = await PortfolioCandidateMetadata.find({
        createdAt: { $gte: startDate }
      }).populate('candidateId', 'name email portfolioUrl location skills');

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
          avgPortfolioScore: this.calculateAvgPortfolioScore(candidates),
          avgInnovationScore: this.calculateAvgInnovationScore(candidates)
        },
        engineeringSignals: {
          fullStack: candidates.filter(c => c.engineeringSignals?.fullStack).length,
          seniority: this.getSeniorityDistribution(candidates),
          specialization: this.getSpecializationDistribution(candidates),
          technicalLeadership: candidates.filter(c => c.engineeringSignals?.technicalLeadership).length
        },
        technologies: this.getTechnologyDistribution(candidates),
        quality: this.getQualityMetrics(candidates),
        projects: this.getProjectMetrics(candidates)
      };

      this.metricsCache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      console.error('Error getting portfolio profile metrics:', error);
      throw error;
    }
  }

  async getRealTimeMetrics() {
    try {
      const queueStats = await getPortfolioDiscoveryQueueStats();
      
      // Get current active candidates
      const activeCandidates = await PortfolioCandidateMetadata.getActivePortfolios(1, 10);
      
      // Get recent failures
      const recentFailures = await IngestionHistory.find({
        connectorName: 'portfolio-discovery',
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
      console.error('Error getting portfolio real-time metrics:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(timeRange = '24h') {
    const cacheKey = `portfolio-performance-metrics-${timeRange}`;
    
    if (this.metricsCache.has(cacheKey)) {
      const cached = this.metricsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const ingestionHistory = await IngestionHistory.find({
        connectorName: 'portfolio-discovery',
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
      console.error('Error getting portfolio performance metrics:', error);
      throw error;
    }
  }

  async getHealthStatus() {
    try {
      const queueStats = await getPortfolioDiscoveryQueueStats();
      const recentFailures = await IngestionHistory.find({
        connectorName: 'portfolio-discovery',
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
        health.recommendations.push('Check portfolio crawling logic and error handling');
      }

      // Check recent failures
      if (recentFailures.length > 5) {
        health.status = 'unhealthy';
        health.issues.push('Multiple recent failures');
        health.recommendations.push('Review error logs and adjust crawling strategy');
      }

      return {
        ...health,
        queue: queueStats,
        recentFailures: recentFailures.length,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error getting portfolio health status:', error);
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

  calculateAvgPortfolioScore(candidates) {
    if (candidates.length === 0) return 0;
    const totalScore = candidates.reduce((sum, c) => sum + (c.portfolioScore || 0), 0);
    return (totalScore / candidates.length).toFixed(2);
  }

  calculateAvgInnovationScore(candidates) {
    if (candidates.length === 0) return 0;
    const totalScore = candidates.reduce((sum, c) => sum + (c.engineeringSignals?.innovationScore || 0), 0);
    return (totalScore / candidates.length).toFixed(2);
  }

  getSeniorityDistribution(candidates) {
    const distribution = {};
    candidates.forEach(candidate => {
      const seniority = candidate.engineeringSignals?.seniority || 'unknown';
      distribution[seniority] = (distribution[seniority] || 0) + 1;
    });
    return distribution;
  }

  getSpecializationDistribution(candidates) {
    const distribution = {};
    candidates.forEach(candidate => {
      const specializations = candidate.engineeringSignals?.specialization || [];
      specializations.forEach(spec => {
        distribution[spec] = (distribution[spec] || 0) + 1;
      });
    });
    return distribution;
  }

  getTechnologyDistribution(candidates) {
    const distribution = {};
    candidates.forEach(candidate => {
      const technologies = candidate.detectedTechnologies?.all || [];
      technologies.forEach(tech => {
        distribution[tech] = (distribution[tech] || 0) + 1;
      });
    });
    
    // Sort by frequency
    return Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50)
      .reduce((obj, [tech, count]) => {
        obj[tech] = count;
        return obj;
      }, {});
  }

  getQualityMetrics(candidates) {
    if (candidates.length === 0) {
      return {
        avgPortfolioQuality: 0,
        avgTechnicalDepth: 0,
        avgInnovationLevel: 0,
        avgEngineeringMaturity: 0
      };
    }

    const metrics = {
      avgPortfolioQuality: 0,
      avgTechnicalDepth: 0,
      avgInnovationLevel: 0,
      avgEngineeringMaturity: 0
    };

    candidates.forEach(candidate => {
      const quality = candidate.qualityMetrics || {};
      metrics.avgPortfolioQuality += quality.portfolioQuality || 0;
      metrics.avgTechnicalDepth += quality.technicalDepth || 0;
      metrics.avgInnovationLevel += quality.innovationLevel || 0;
      metrics.avgEngineeringMaturity += quality.engineeringMaturity || 0;
    });

    Object.keys(metrics).forEach(key => {
      metrics[key] = (metrics[key] / candidates.length).toFixed(2);
    });

    return metrics;
  }

  getProjectMetrics(candidates) {
    const totalProjects = candidates.reduce((sum, c) => sum + (c.projectInsights?.length || 0), 0);
    const avgProjectsPerCandidate = candidates.length > 0 ? totalProjects / candidates.length : 0;
    
    const complexityDistribution = {};
    const innovationDistribution = {};
    
    candidates.forEach(candidate => {
      candidate.projectInsights?.forEach(project => {
        const complexity = project.complexity?.level || 'unknown';
        complexityDistribution[complexity] = (complexityDistribution[complexity] || 0) + 1;
        
        const innovation = project.innovationScore?.level || 'unknown';
        innovationDistribution[innovation] = (innovationDistribution[innovation] || 0) + 1;
      });
    });

    return {
      totalProjects,
      avgProjectsPerCandidate: avgProjectsPerCandidate.toFixed(2),
      complexityDistribution,
      innovationDistribution
    };
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
    if (avgTime > 60000) { // 60 seconds
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
      console.error('Error generating portfolio report:', error);
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
        action: 'Increase portfolio discovery worker concurrency'
      });
    }

    // Quality recommendations
    if (profileMetrics.profiles.avgPortfolioScore < 50) {
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        message: 'Average portfolio score is low. Consider refining search criteria.',
        action: 'Adjust portfolio search queries to target higher quality candidates'
      });
    }

    // Performance recommendations
    if (performanceMetrics.performance.avgProcessingTime > 45000) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'Processing times are high. Consider optimizing portfolio parsing.',
        action: 'Review and optimize portfolio parsing and technology detection'
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

export const portfolioMonitoringService = new PortfolioMonitoringService();
export default portfolioMonitoringService;
