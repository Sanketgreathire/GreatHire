import { IngestionHistory } from "../../../models/ingestionHistory.model.js";
import { ConnectorStatus } from "../../../models/connectorStatus.model.js";
import { SourceMetadata } from "../../../models/sourceMetadata.model.js";
import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";

class DiscoveryStatsService {
  constructor() {
    this.statsCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async updateConnectorStatus(connectorName, statusData) {
    try {
      const existingStatus = await ConnectorStatus.findOne({ connectorName });
      
      if (existingStatus) {
        Object.assign(existingStatus, statusData, { updatedAt: new Date() });
        await existingStatus.save();
      } else {
        const newStatus = new ConnectorStatus({
          connectorName,
          ...statusData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await newStatus.save();
      }

      this.clearCache();
      return existingStatus || newStatus;
    } catch (error) {
      console.error("Error updating connector status:", error);
      throw error;
    }
  }

  async updateIngestionHistory(ingestionData) {
    try {
      const history = new IngestionHistory({
        ...ingestionData,
        createdAt: new Date()
      });
      await history.save();
      
      this.clearCache();
      return history;
    } catch (error) {
      console.error("Error updating ingestion history:", error);
      throw error;
    }
  }

  async getDiscoveryStats(timeRange = '24h') {
    const cacheKey = `discovery-stats-${timeRange}`;
    
    if (this.statsCache.has(cacheKey)) {
      const cached = this.statsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const stats = await this.calculateDiscoveryStats(timeRange);
    
    this.statsCache.set(cacheKey, {
      data: stats,
      timestamp: Date.now()
    });

    return stats;
  }

  async calculateDiscoveryStats(timeRange) {
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

    const ingestionHistory = await IngestionHistory.find({
      startedAt: { $gte: startDate }
    }).sort({ startedAt: -1 });

    const sourceMetadata = await SourceMetadata.find({
      fetchedAt: { $gte: startDate }
    }).sort({ fetchedAt: -1 });

    const candidates = await SourcingCandidate.find({
      createdAt: { $gte: startDate },
      source: 'discovery'
    }).sort({ createdAt: -1 });

    const connectorStatuses = await ConnectorStatus.find().sort({ updatedAt: -1 });

    const stats = {
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
        successRate: this.calculateSuccessRate(ingestionHistory)
      },
      sources: {
        total: sourceMetadata.length,
        successful: sourceMetadata.filter(s => s.ingestionStatus === 'completed').length,
        failed: sourceMetadata.filter(s => s.ingestionStatus === 'failed').length,
        processing: sourceMetadata.filter(s => s.ingestionStatus === 'processing').length
      },
      candidates: {
        total: candidates.length,
        unique: candidates.length,
        withEmail: candidates.filter(c => c.email).length,
        withGithub: candidates.filter(c => c.githubUrl).length,
        withLinkedin: candidates.filter(c => c.linkedinUrl).length,
        withResume: candidates.filter(c => c.resumeUrl).length,
        avgSkills: this.calculateAverageSkills(candidates)
      },
      connectors: connectorStatuses.map(status => ({
        name: status.connectorName,
        status: status.status,
        lastRun: status.lastRun,
        stats: status.stats || {},
        uptime: status.uptime || 0,
        errorRate: status.errorRate || 0
      })),
      trends: this.calculateTrends(ingestionHistory, sourceMetadata, candidates, timeRange)
    };

    return stats;
  }

  calculateSuccessRate(ingestionHistory) {
    if (ingestionHistory.length === 0) return 0;
    const completed = ingestionHistory.filter(h => h.status === 'completed').length;
    return (completed / ingestionHistory.length * 100).toFixed(2);
  }

  calculateAverageSkills(candidates) {
    if (candidates.length === 0) return 0;
    const totalSkills = candidates.reduce((sum, candidate) => sum + (candidate.skills?.length || 0), 0);
    return (totalSkills / candidates.length).toFixed(2);
  }

  calculateTrends(ingestionHistory, sourceMetadata, candidates, timeRange) {
    const hourlyData = this.groupByHour(ingestionHistory, sourceMetadata, candidates, timeRange);
    
    return {
      ingestion: hourlyData.map(hour => ({
        timestamp: hour.timestamp,
        completed: hour.ingestion.completed,
        failed: hour.ingestion.failed
      })),
      sources: hourlyData.map(hour => ({
        timestamp: hour.timestamp,
        successful: hour.sources.successful,
        failed: hour.sources.failed
      })),
      candidates: hourlyData.map(hour => ({
        timestamp: hour.timestamp,
        added: hour.candidates.added
      }))
    };
  }

  groupByHour(ingestionHistory, sourceMetadata, candidates, timeRange) {
    const hours = [];
    const now = new Date();
    let hoursBack = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;

    for (let i = hoursBack - 1; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourEnd = new Date(now.getTime() - (i - 1) * 60 * 60 * 1000);

      const hourIngestion = ingestionHistory.filter(h => 
        h.startedAt >= hourStart && h.startedAt < hourEnd
      );

      const hourSources = sourceMetadata.filter(s => 
        s.fetchedAt >= hourStart && s.fetchedAt < hourEnd
      );

      const hourCandidates = candidates.filter(c => 
        c.createdAt >= hourStart && c.createdAt < hourEnd
      );

      hours.push({
        timestamp: hourStart,
        ingestion: {
          completed: hourIngestion.filter(h => h.status === 'completed').length,
          failed: hourIngestion.filter(h => h.status === 'failed').length
        },
        sources: {
          successful: hourSources.filter(s => s.ingestionStatus === 'completed').length,
          failed: hourSources.filter(s => s.ingestionStatus === 'failed').length
        },
        candidates: {
          added: hourCandidates.length
        }
      });
    }

    return hours;
  }

  async getIngestionHistory(options = {}) {
    const { page = 1, limit = 20, connector, status, timeRange = '30d' } = options;
    
    let startDate;
    const now = new Date();
    
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
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const query = {
      startedAt: { $gte: startDate }
    };

    if (connector) {
      query.connectorName = connector;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const history = await IngestionHistory.find(query)
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await IngestionHistory.countDocuments(query);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getSourceStats(options = {}) {
    const { connector, timeRange = '24h' } = options;
    
    let startDate;
    const now = new Date();
    
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

    const query = {
      fetchedAt: { $gte: startDate }
    };

    if (connector) {
      query.connectorName = connector;
    }

    const sources = await SourceMetadata.find(query).sort({ fetchedAt: -1 });

    const stats = {
      total: sources.length,
      byStatus: {
        completed: sources.filter(s => s.ingestionStatus === 'completed').length,
        failed: sources.filter(s => s.ingestionStatus === 'failed').length,
        processing: sources.filter(s => s.ingestionStatus === 'processing').length
      },
      byConnector: this.groupByConnector(sources),
      bySourceType: this.groupBySourceType(sources),
      avgConfidenceScore: this.calculateAverageConfidence(sources),
      recentSources: sources.slice(0, 10)
    };

    return stats;
  }

  groupByConnector(sources) {
    const grouped = {};
    sources.forEach(source => {
      const connector = source.connectorName || 'unknown';
      if (!grouped[connector]) {
        grouped[connector] = { total: 0, completed: 0, failed: 0 };
      }
      grouped[connector].total++;
      if (source.ingestionStatus === 'completed') {
        grouped[connector].completed++;
      } else if (source.ingestionStatus === 'failed') {
        grouped[connector].failed++;
      }
    });
    return grouped;
  }

  groupBySourceType(sources) {
    const grouped = {};
    sources.forEach(source => {
      const type = source.sourceType || 'unknown';
      if (!grouped[type]) {
        grouped[type] = { total: 0, completed: 0, failed: 0 };
      }
      grouped[type].total++;
      if (source.ingestionStatus === 'completed') {
        grouped[type].completed++;
      } else if (source.ingestionStatus === 'failed') {
        grouped[type].failed++;
      }
    });
    return grouped;
  }

  calculateAverageConfidence(sources) {
    if (sources.length === 0) return 0;
    const totalConfidence = sources.reduce((sum, source) => sum + (source.confidenceScore || 0), 0);
    return (totalConfidence / sources.length).toFixed(2);
  }

  async getConnectorsService() {
    const connectorStatuses = await ConnectorStatus.find().sort({ updatedAt: -1 });
    
    return connectorStatuses.map(status => ({
      name: status.connectorName,
      status: status.status,
      lastRun: status.lastRun,
      stats: status.stats || {},
      uptime: status.uptime || 0,
      errorRate: status.errorRate || 0,
      config: status.config || {},
      createdAt: status.createdAt,
      updatedAt: status.updatedAt
    }));
  }

  async getConnectorStatusService(connectorName) {
    const status = await ConnectorStatus.findOne({ connectorName });
    
    if (!status) {
      throw new Error(`Connector ${connectorName} not found`);
    }

    return {
      name: status.connectorName,
      status: status.status,
      lastRun: status.lastRun,
      stats: status.stats || {},
      uptime: status.uptime || 0,
      errorRate: status.errorRate || 0,
      config: status.config || {},
      createdAt: status.createdAt,
      updatedAt: status.updatedAt
    };
  }

  clearCache() {
    this.statsCache.clear();
  }
}

export const discoveryStatsService = new DiscoveryStatsService();
export const updateConnectorStatusService = discoveryStatsService.updateConnectorStatus.bind(discoveryStatsService);
export const updateIngestionHistoryService = discoveryStatsService.updateIngestionHistory.bind(discoveryStatsService);
export const getDiscoveryStatusService = discoveryStatsService.getDiscoveryStats.bind(discoveryStatsService);
export const getIngestionHistoryService = discoveryStatsService.getIngestionHistory.bind(discoveryStatsService);
export const getSourceStatsService = discoveryStatsService.getSourceStats.bind(discoveryStatsService);
export const getConnectorsService = discoveryStatsService.getConnectorsService.bind(discoveryStatsService);
export const getConnectorStatusService = discoveryStatsService.getConnectorStatusService.bind(discoveryStatsService);

export default discoveryStatsService;
