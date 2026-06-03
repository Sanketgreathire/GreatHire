import { SourceConnector } from "./sourceConnector.service.js";
import { getDiscoveryQueue } from "./discoveryQueue.service.js";
import { getConnectorsService, updateConnectorStatusService } from "./discoveryStats.service.js";
import { GitHubConnector } from "./connectors/githubConnector.service.js";
import { PublicProfileConnector } from "./connectors/publicProfileConnector.service.js";
import { ResumeUrlConnector } from "./connectors/resumeUrlConnector.service.js";

class ConnectorRegistry {
  constructor() {
    this.connectors = new Map();
    this.initializeConnectors();
  }

  initializeConnectors() {
    this.registerConnector(new GitHubConnector());
    this.registerConnector(new PublicProfileConnector());
    this.registerConnector(new ResumeUrlConnector());
  }

  registerConnector(connector) {
    this.connectors.set(connector.name, connector);
  }

  getConnector(name) {
    return this.connectors.get(name);
  }

  getAllConnectors() {
    return Array.from(this.connectors.values()).map(connector => ({
      name: connector.name,
      status: connector.status,
      lastRun: connector.lastRun,
      stats: connector.stats
    }));
  }

  async runConnector(name, options = {}) {
    const connector = this.getConnector(name);
    if (!connector) {
      throw new Error(`Connector ${name} not found`);
    }

    const queue = getDiscoveryQueue();
    
    const job = await queue.add(
      `run-${name}`,
      {
        connectorName: name,
        options,
        timestamp: new Date().toISOString()
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: 100,
        removeOnFail: 50
      }
    );

    await updateConnectorStatusService(name, {
      status: 'queued',
      jobId: job.id,
      queuedAt: new Date()
    });

    return {
      jobId: job.id,
      connectorName: name,
      status: 'queued'
    };
  }

  async testConnector(name, config = {}) {
    const connector = this.getConnector(name);
    if (!connector) {
      throw new Error(`Connector ${name} not found`);
    }

    if (config) {
      connector.config = { ...connector.config, ...config };
    }

    return await connector.testConnection();
  }

  async pauseConnector(name) {
    const connector = this.getConnector(name);
    if (!connector) {
      throw new Error(`Connector ${name} not found`);
    }

    if (connector.status === 'running') {
      connector.status = 'paused';
      await updateConnectorStatusService(name, {
        status: 'paused',
        pausedAt: new Date()
      });
    }

    return { success: true, status: connector.status };
  }

  async resumeConnector(name) {
    const connector = this.getConnector(name);
    if (!connector) {
      throw new Error(`Connector ${name} not found`);
    }

    if (connector.status === 'paused') {
      connector.status = 'idle';
      await updateConnectorStatusService(name, {
        status: 'idle',
        resumedAt: new Date()
      });
    }

    return { success: true, status: connector.status };
  }

  async getConnectorStatus(name) {
    const connector = this.getConnector(name);
    if (!connector) {
      throw new Error(`Connector ${name} not found`);
    }

    return connector.getStatus();
  }

  async getDiscoveryStatus() {
    const connectors = this.getAllConnectors();
    const queue = getDiscoveryQueue();
    
    const queueStats = {
      waiting: await queue.getWaiting(),
      active: await queue.getActive(),
      completed: await queue.getCompleted(),
      failed: await queue.getFailed()
    };

    return {
      connectors,
      queue: {
        waiting: queueStats.waiting.length,
        active: queueStats.active.length,
        completed: queueStats.completed.length,
        failed: queueStats.failed.length
      },
      timestamp: new Date()
    };
  }

  async cancelIngestion(jobId) {
    const queue = getDiscoveryQueue();
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.remove();
      return { success: true, message: `Job ${jobId} cancelled` };
    }
    
    throw new Error(`Job ${jobId} not found`);
  }

  async retryFailedIngestion(jobId) {
    const queue = getDiscoveryQueue();
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.retry();
      return { success: true, message: `Job ${jobId} retry started` };
    }
    
    throw new Error(`Job ${jobId} not found`);
  }
}

const connectorRegistry = new ConnectorRegistry();

export const runConnectorService = connectorRegistry.runConnector.bind(connectorRegistry);
export const testConnectorService = connectorRegistry.testConnector.bind(connectorRegistry);
export const pauseConnectorService = connectorRegistry.pauseConnector.bind(connectorRegistry);
export const resumeConnectorService = connectorRegistry.resumeConnector.bind(connectorRegistry);
export const getConnectorStatusService = connectorRegistry.getConnectorStatus.bind(connectorRegistry);
export const getDiscoveryStatusService = connectorRegistry.getDiscoveryStatus.bind(connectorRegistry);
export const cancelIngestionService = connectorRegistry.cancelIngestion.bind(connectorRegistry);
export const retryFailedIngestionService = connectorRegistry.retryFailedIngestion.bind(connectorRegistry);

export const getConnectorsServiceHandler = () => {
  return connectorRegistry.getAllConnectors();
};

export default connectorRegistry;
