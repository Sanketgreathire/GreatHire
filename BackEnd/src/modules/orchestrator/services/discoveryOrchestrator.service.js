import { enqueueGitHubDiscovery } from "../../discovery/workers/githubDiscovery.worker.js";
import { enqueueBulkResumeDiscovery } from "../../discovery/workers/resumeDiscovery.worker.js";
import { enqueueEmbedding } from "../../../../sourcing/ai/embeddingQueue.js";
import { enqueueSingleEnrichment } from "../../enrichment/services/enrichmentQueue.service.js";
// import { SourcingCandidate } from "../../../../models/sourcingCandidate.model.js";
import { OrchestrationMetadata } from "../../../models/orchestrationMetadata.model.js";

export class DiscoveryOrchestratorService {
  constructor() {
    this.connectors = {
      github: {
        enabled: true,
        priority: 1,
        cooldown: 3600000, // 1 hour
        lastRun: null,
        batchSize: 50,
        concurrency: 3
      },
      resume: {
        enabled: true,
        priority: 2,
        cooldown: 7200000, // 2 hours
        lastRun: null,
        batchSize: 100,
        concurrency: 2
      },
      portfolio: {
        enabled: true,
        priority: 3,
        cooldown: 1800000, // 30 minutes
        lastRun: null,
        batchSize: 25,
        concurrency: 1
      }
    };
    
    this.pipelineStages = {
      discovery: { priority: 1, enabled: true },
      parsing: { priority: 2, enabled: true },
      normalization: { priority: 3, enabled: true },
      deduplication: { priority: 4, enabled: true },
      enrichment: { priority: 5, enabled: true },
      embedding: { priority: 6, enabled: true },
      indexing: { priority: 7, enabled: true },
      freshness: { priority: 8, enabled: true }
    };
  }

  async orchestrateDiscovery(options = {}) {
    try {
      const {
        connectors = ['github', 'resume', 'portfolio'],
        priority = 'normal',
        batchSize = 50,
        forceRun = false
      } = options;

      const orchestrationStart = new Date();
      const orchestrationId = this.generateOrchestrationId();

      await this.logOrchestrationEvent(orchestrationId, 'start', {
        connectors,
        priority,
        batchSize,
        forceRun,
        timestamp: orchestrationStart
      });

      const results = {};

      // Run each connector in priority order
      for (const connectorName of connectors) {
        const connector = this.connectors[connectorName];
        
        if (!connector.enabled) {
          continue;
        }

        if (!forceRun && this.isConnectorInCooldown(connectorName)) {
          await this.logOrchestrationEvent(orchestrationId, 'skip', {
            connector: connectorName,
            reason: 'cooldown',
            nextAvailable: new Date(connector.lastRun + connector.cooldown)
          });
          continue;
        }

        try {
          const connectorResult = await this.runConnector(connectorName, options);
          results[connectorName] = connectorResult;
          
          // Update connector state
          connector.lastRun = new Date();
          
          await this.logOrchestrationEvent(orchestrationId, 'connector_complete', {
            connector: connectorName,
            result: connectorResult,
            timestamp: new Date()
          });

        } catch (error) {
          console.error(`Error running connector ${connectorName}:`, error);
          results[connectorName] = {
            success: false,
            error: error.message
          };
          
          await this.logOrchestrationEvent(orchestrationId, 'connector_error', {
            connector: connectorName,
            error: error.message,
            timestamp: new Date()
          });
        }
      }

      // Coordinate pipeline stages
      const pipelineResult = await this.coordinatePipeline(results, orchestrationId);
      
      const orchestrationEnd = new Date();
      const duration = orchestrationEnd - orchestrationStart;

      await this.logOrchestrationEvent(orchestrationId, 'complete', {
        duration,
        results,
        pipelineResult,
        timestamp: orchestrationEnd
      });

      return {
        orchestrationId,
        success: true,
        duration,
        results,
        pipelineResult
      };

    } catch (error) {
      console.error('Error orchestrating discovery:', error);
      throw error;
    }
  }

  async runConnector(connectorName, options = {}) {
    const connector = this.connectors[connectorName];
    
    switch (connectorName) {
      case 'github':
        return await this.runGitHubConnector(options);
      case 'resume':
        return await this.runResumeConnector(options);
      case 'portfolio':
        return await this.runPortfolioConnector(options);
      default:
        throw new Error(`Unknown connector: ${connectorName}`);
    }
  }

  async runGitHubConnector(options = {}) {
    const { batchSize = 50, queries = [] } = options;
    
    const jobOptions = {
      priority: this.connectors.github.priority,
      delay: 0,
      attempts: 3
    };

    const result = await enqueueGitHubDiscovery({
      type: 'bulk-discovery',
      options: {
        queries: queries.length > 0 ? queries : [
          'react developer location:remote',
          'full stack developer location:remote',
          'node.js developer location:remote',
          'python developer location:remote'
        ],
        limit: batchSize
      }
    }, jobOptions);

    return {
      success: true,
      jobId: result.id,
      connector: 'github',
      batchSize,
      timestamp: new Date()
    };
  }

  async runResumeConnector(options = {}) {
    const { batchSize = 100, urls = [] } = options;
    
    const jobOptions = {
      priority: this.connectors.resume.priority,
      delay: 0,
      attempts: 3
    };

    const result = await enqueueBulkResumeDiscovery({
      type: 'bulk-discovery',
      options: {
        urls: urls.length > 0 ? urls : [],
        limit: batchSize,
        queries: [
          'software developer resume filetype:pdf',
          'web developer resume filetype:doc',
          'full stack developer resume filetype:docx'
        ]
      }
    }, jobOptions);

    return {
      success: true,
      jobId: result.id,
      connector: 'resume',
      batchSize,
      timestamp: new Date()
    };
  }

  async runPortfolioConnector(options = {}) {
    const { batchSize = 25, domains = [] } = options;
    
    // This would integrate with portfolio discovery
    // For now, return placeholder result
    return {
      success: true,
      jobId: `portfolio-${Date.now()}`,
      connector: 'portfolio',
      batchSize,
      domains,
      timestamp: new Date()
    };
  }

  async coordinatePipeline(results, orchestrationId) {
    const pipelineResult = {
      stages: {},
      totalProfiles: 0,
      processingTimes: {}
    };

    try {
      // Stage 1: Discovery (already completed)
      const discoveredProfiles = this.extractDiscoveredProfiles(results);
      pipelineResult.totalProfiles = discoveredProfiles.length;
      pipelineResult.stages.discovery = {
        success: true,
        count: discoveredProfiles.length,
        timestamp: new Date()
      };

      // Stage 2: Parsing (handled by individual connectors)
      pipelineResult.stages.parsing = {
        success: true,
        timestamp: new Date()
      };

      // Stage 3: Normalization (handled by individual connectors)
      pipelineResult.stages.normalization = {
        success: true,
        timestamp: new Date()
      };

      // Stage 4: Deduplication (handled by individual connectors)
      pipelineResult.stages.deduplication = {
        success: true,
        timestamp: new Date()
      };

      // Stage 5: Enrichment
      const enrichmentStart = Date.now();
      await this.enqueueEnrichmentBatch(discoveredProfiles);
      pipelineResult.stages.enrichment = {
        success: true,
        count: discoveredProfiles.length,
        processingTime: Date.now() - enrichmentStart,
        timestamp: new Date()
      };

      // Stage 6: Embedding
      const embeddingStart = Date.now();
      await this.enqueueEmbeddingBatch(discoveredProfiles);
      pipelineResult.stages.embedding = {
        success: true,
        count: discoveredProfiles.length,
        processingTime: Date.now() - embeddingStart,
        timestamp: new Date()
      };

      // Stage 7: Indexing (handled by enrichment/embedding workers)
      pipelineResult.stages.indexing = {
        success: true,
        timestamp: new Date()
      };

      // Stage 8: Freshness (handled by freshness worker)
      pipelineResult.stages.freshness = {
        success: true,
        timestamp: new Date()
      };

      await this.logOrchestrationEvent(orchestrationId, 'pipeline_complete', {
        pipelineResult,
        timestamp: new Date()
      });

      return pipelineResult;

    } catch (error) {
      console.error('Error coordinating pipeline:', error);
      pipelineResult.error = error.message;
      return pipelineResult;
    }
  }

  extractDiscoveredProfiles(results) {
    const profiles = [];
    
    Object.values(results).forEach(result => {
      if (result.success && result.profiles) {
        profiles.push(...result.profiles);
      }
    });

    return profiles;
  }

  async enqueueEnrichmentBatch(profiles) {
    const enrichmentPromises = profiles.map(profile =>
      enqueueSingleEnrichment({ candidateId: (profile.candidateId || profile._id).toString() }).catch(() => {})
    );
    await Promise.allSettled(enrichmentPromises);
  }

  async enqueueEmbeddingBatch(profiles) {
    const embeddingPromises = profiles.map(profile => 
      enqueueEmbedding(profile.candidateId || profile._id)
    );

    await Promise.allSettled(embeddingPromises);
  }

  isConnectorInCooldown(connectorName) {
    const connector = this.connectors[connectorName];
    if (!connector.lastRun) return false;
    
    const timeSinceLastRun = Date.now() - connector.lastRun.getTime();
    return timeSinceLastRun < connector.cooldown;
  }

  async getConnectorStatus() {
    const status = {};
    
    Object.entries(this.connectors).forEach(([name, connector]) => {
      status[name] = {
        enabled: connector.enabled,
        priority: connector.priority,
        cooldown: connector.cooldown,
        lastRun: connector.lastRun,
        nextAvailable: connector.lastRun ? 
          new Date(connector.lastRun.getTime() + connector.cooldown) : 
          new Date(),
        inCooldown: this.isConnectorInCooldown(name),
        batchSize: connector.batchSize,
        concurrency: connector.concurrency
      };
    });

    return status;
  }

  async updateConnectorConfig(connectorName, config) {
    if (!this.connectors[connectorName]) {
      throw new Error(`Unknown connector: ${connectorName}`);
    }

    this.connectors[connectorName] = {
      ...this.connectors[connectorName],
      ...config
    };

    await this.logOrchestrationEvent('system', 'connector_config_update', {
      connector: connectorName,
      config,
      timestamp: new Date()
    });

    return this.connectors[connectorName];
  }

  async enableConnector(connectorName) {
    return await this.updateConnectorConfig(connectorName, { enabled: true });
  }

  async disableConnector(connectorName) {
    return await this.updateConnectorConfig(connectorName, { enabled: false });
  }

  async setConnectorCooldown(connectorName, cooldownMs) {
    return await this.updateConnectorConfig(connectorName, { cooldown: cooldownMs });
  }

  async setConnectorPriority(connectorName, priority) {
    return await this.updateConnectorConfig(connectorName, { priority });
  }

  async getPipelineStatus() {
    const status = {};
    
    Object.entries(this.pipelineStages).forEach(([name, stage]) => {
      status[name] = {
        enabled: stage.enabled,
        priority: stage.priority
      };
    });

    return status;
  }

  async enablePipelineStage(stageName) {
    if (!this.pipelineStages[stageName]) {
      throw new Error(`Unknown pipeline stage: ${stageName}`);
    }

    this.pipelineStages[stageName].enabled = true;
    
    await this.logOrchestrationEvent('system', 'stage_enable', {
      stage: stageName,
      timestamp: new Date()
    });

    return true;
  }

  async disablePipelineStage(stageName) {
    if (!this.pipelineStages[stageName]) {
      throw new Error(`Unknown pipeline stage: ${stageName}`);
    }

    this.pipelineStages[stageName].enabled = false;
    
    await this.logOrchestrationEvent('system', 'stage_disable', {
      stage: stageName,
      timestamp: new Date()
    });

    return true;
  }

  async getOrchestrationMetrics(timeRange = '24h') {
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

    // This would typically query your metrics database
    // For now, return placeholder metrics
    return {
      timeRange,
      period: { start: startDate, end: now },
      orchestrations: {
        total: 0,
        successful: 0,
        failed: 0,
        avgDuration: 0
      },
      connectors: {
        github: { runs: 0, success: 0, avgDuration: 0 },
        resume: { runs: 0, success: 0, avgDuration: 0 },
        portfolio: { runs: 0, success: 0, avgDuration: 0 }
      },
      pipeline: {
        discovery: { processed: 0, success: 0 },
        enrichment: { processed: 0, success: 0 },
        embedding: { processed: 0, success: 0 }
      }
    };
  }

  async runSpecificConnector(connectorName, options = {}) {
    const connector = this.connectors[connectorName];
    
    if (!connector) {
      throw new Error(`Unknown connector: ${connectorName}`);
    }

    if (!connector.enabled) {
      throw new Error(`Connector ${connectorName} is disabled`);
    }

    if (!options.forceRun && this.isConnectorInCooldown(connectorName)) {
      throw new Error(`Connector ${connectorName} is in cooldown`);
    }

    const result = await this.runConnector(connectorName, options);
    connector.lastRun = new Date();

    return result;
  }

  async restartConnector(connectorName) {
    // Reset connector state
    const connector = this.connectors[connectorName];
    connector.lastRun = null;
    connector.enabled = true;

    await this.logOrchestrationEvent('system', 'connector_restart', {
      connector: connectorName,
      timestamp: new Date()
    });

    return true;
  }

  async forceRunAllConnectors(options = {}) {
    const results = {};
    
    for (const connectorName of Object.keys(this.connectors)) {
      try {
        results[connectorName] = await this.runSpecificConnector(connectorName, { ...options, forceRun: true });
      } catch (error) {
        results[connectorName] = {
          success: false,
          error: error.message
        };
      }
    }

    return results;
  }

  generateOrchestrationId() {
    return `orch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async logOrchestrationEvent(orchestrationId, eventType, data) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId,
        eventType,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging orchestration event:', error);
    }
  }

  async getOrchestrationHistory(limit = 50) {
    try {
      const history = await OrchestrationMetadata.find({
        eventType: { $in: ['start', 'complete'] }
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

      return history;
    } catch (error) {
      console.error('Error getting orchestration history:', error);
      return [];
    }
  }

  async getOrchestrationDetails(orchestrationId) {
    try {
      const events = await OrchestrationMetadata.find({
        orchestrationId
      })
      .sort({ timestamp: 1 })
      .lean();

      return {
        orchestrationId,
        events,
        startTime: events[0]?.timestamp,
        endTime: events[events.length - 1]?.timestamp,
        duration: events.length > 1 ? 
          new Date(events[events.length - 1].timestamp) - new Date(events[0].timestamp) : 
          0
      };
    } catch (error) {
      console.error('Error getting orchestration details:', error);
      return null;
    }
  }

  async getSystemHealth() {
    const connectorStatus = await this.getConnectorStatus();
    const pipelineStatus = await this.getPipelineStatus();
    
    const health = {
      status: 'healthy',
      connectors: connectorStatus,
      pipeline: pipelineStatus,
      issues: []
    };

    // Check for issues
    Object.entries(connectorStatus).forEach(([name, status]) => {
      if (!status.enabled) {
        health.issues.push(`Connector ${name} is disabled`);
      }
      if (status.inCooldown) {
        health.issues.push(`Connector ${name} is in cooldown`);
      }
    });

    Object.entries(pipelineStatus).forEach(([name, status]) => {
      if (!status.enabled) {
        health.issues.push(`Pipeline stage ${name} is disabled`);
      }
    });

    if (health.issues.length > 0) {
      health.status = 'degraded';
    }

    return health;
  }
}

export const discoveryOrchestratorService = new DiscoveryOrchestratorService();
export default discoveryOrchestratorService;
