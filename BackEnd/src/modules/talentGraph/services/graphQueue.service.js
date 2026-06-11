import { Queue, Worker } from 'bullmq';
import { getRedisConnection, isRedisAvailable } from '../../../config/redis.js';

const TALENT_GRAPH_QUEUE_NAME = "talent-graph-processing";

// Create queue instance
export async function getTalentGraphQueue() {
  try {
    const connection = getRedisConnection();
    const queue = new Queue(TALENT_GRAPH_QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });
    
    return queue;
  } catch (error) {
    console.error("Error creating talent graph queue:", error);
    throw error;
  }
}

// Enqueue graph building job
export async function enqueueGraphJob(jobType, data, options = {}) {
  try {
    const queue = await getTalentGraphQueue();
    
    const jobOptions = {
      priority: options.priority || 10,
      delay: options.delay || 0,
      attempts: options.attempts || 3,
      ...options
    };
    
    const job = await queue.add(jobType, data, jobOptions);
    
    console.log(`Enqueued ${jobType} job with ID: ${job.id}`);
    return job.id;
  } catch (error) {
    console.error("Error enqueuing graph job:", error);
    throw error;
  }
}

// Enqueue bulk graph jobs
export async function enqueueBulkGraphJobs(jobs) {
  try {
    const queue = await getTalentGraphQueue();
    
    const jobIds = [];
    
    for (const job of jobs) {
      const jobId = await enqueueGraphJob(job.type, job.data, job.options);
      jobIds.push(jobId);
    }
    
    return jobIds;
  } catch (error) {
    console.error("Error enqueuing bulk graph jobs:", error);
    throw error;
  }
}

// Get job status
export async function getGraphJobStatus(jobId) {
  try {
    const queue = await getTalentGraphQueue();
    const job = await queue.getJob(jobId);
    
    if (!job) {
      return { status: 'not_found' };
    }
    
    return {
      id: job.id,
      status: await job.getState(),
      progress: job.progress,
      data: job.data,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      returnvalue: job.returnvalue
    };
  } catch (error) {
    console.error("Error getting graph job status:", error);
    throw error;
  }
}

// Cancel job
export async function cancelGraphJob(jobId) {
  try {
    const queue = await getTalentGraphQueue();
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.remove();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error canceling graph job:", error);
    throw error;
  }
}

// Retry failed job
export async function retryGraphJob(jobId) {
  try {
    const queue = await getTalentGraphQueue();
    const job = await queue.getJob(jobId);
    
    if (job && (await job.getState()) === 'failed') {
      await job.retry();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error retrying graph job:", error);
    throw error;
  }
}

// Get queue stats
export async function getGraphQueueStats() {
  try {
    const queue = await getTalentGraphQueue();
    
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed()
    ]);
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      total: waiting.length + active.length + completed.length + failed.length + delayed.length
    };
  } catch (error) {
    console.error("Error getting graph queue stats:", error);
    throw error;
  }
}

// Clear queue
export async function clearGraphQueue() {
  try {
    const queue = await getTalentGraphQueue();
    await queue.clean(0, 0, 'completed');
    await queue.clean(0, 0, 'failed');
    
    console.log("Cleared talent graph queue");
    return true;
  } catch (error) {
    console.error("Error clearing graph queue:", error);
    throw error;
  }
}

// Pause queue
export async function pauseGraphQueue() {
  try {
    const queue = await getTalentGraphQueue();
    await queue.pause();
    
    console.log("Paused talent graph queue");
    return true;
  } catch (error) {
    console.error("Error pausing graph queue:", error);
    throw error;
  }
}

// Resume queue
export async function resumeGraphQueue() {
  try {
    const queue = await getTalentGraphQueue();
    await queue.resume();
    
    console.log("Resumed talent graph queue");
    return true;
  } catch (error) {
    console.error("Error resuming graph queue:", error);
    throw error;
  }
}

// Start talent graph worker
export async function startTalentGraphWorker() {
  try {
    const redisReady = await isRedisAvailable();
    if (!redisReady) {
      console.warn('⚠️  Talent graph worker: Redis unavailable, skipping startup');
      return null;
    }

    const connection = getRedisConnection();
    
    const worker = new Worker(
      TALENT_GRAPH_QUEUE_NAME,
      async (job) => {
        const { name, data } = job;
        
        try {
          switch (name) {
            case 'build-graph':
              await processBuildGraphJob(job);
              break;
            case 'update-node':
              await processUpdateNodeJob(job);
              break;
            case 'update-edge':
              await processUpdateEdgeJob(job);
              break;
            case 'calculate-scores':
              await processCalculateScoresJob(job);
              break;
            case 'analyze-network':
              await processAnalyzeNetworkJob(job);
              break;
            case 'sync-graph':
              await processSyncGraphJob(job);
              break;
            case 'cleanup-graph':
              await processCleanupGraphJob(job);
              break;
            default:
              throw new Error(`Unknown job type: ${name}`);
          }
        } catch (error) {
          console.error(`Error processing ${name} job ${job.id}:`, error);
          throw error;
        }
      },
      {
        connection,
        concurrency: 5,
        limiter: {
          max: 10,
          duration: 60000, // 1 minute
        },
      }
    );
    
    worker.on('completed', (job) => {
      console.log(`Completed ${job.name} job ${job.id}`);
    });
    
    worker.on('failed', (job, err) => {
      console.error(`Failed ${job.name} job ${job.id}:`, err);
    });
    
    worker.on('error', (err) => {
      console.error('Talent graph worker error:', err);
    });
    
    console.log('Talent graph worker started');
    return worker;
  } catch (error) {
    console.error("Error starting talent graph worker:", error);
    throw error;
  }
}

// Job processors
async function processBuildGraphJob(job) {
  try {
    const { updateType, force, timestamp } = job.data;
    
    job.updateProgress(10, 'Starting graph build');
    
    // Import required services
    const { buildTalentGraph } = await import('./talentGraph.service.js');
    const { updateGraphScores } = await import('./graphScoring.service.js');
    
    job.updateProgress(20, 'Building talent graph');
    
    // Build the graph
    const result = await buildTalentGraph({
      force,
      updateType
    });
    
    job.updateProgress(50, 'Calculating graph scores');
    
    // Calculate scores for the graph
    if (result.success) {
      const scoringData = await generateScoringData(updateType);
      await updateGraphScores(result.graphId, scoringData);
    }
    
    job.updateProgress(80, 'Syncing graph data');
    
    // Sync with external systems
    await syncGraphWithExternalSystems(result.graphId);
    
    job.updateProgress(100, 'Graph build completed');
    
    return {
      success: true,
      graphId: result.graphId,
      updateType,
      timestamp,
      completedAt: new Date()
    };
  } catch (error) {
    console.error("Error processing build graph job:", error);
    throw error;
  }
}

async function processUpdateNodeJob(job) {
  try {
    const { nodeId, nodeType, nodeData, graphId } = job.data;
    
    job.updateProgress(25, 'Updating node');
    
    const TalentGraph = await import("../../models/talentGraph.model.js");
    const graph = await TalentGraph.default.findById(graphId);
    
    if (!graph) {
      throw new Error("Graph not found");
    }
    
    await graph.addNode({
      id: nodeId,
      type: nodeType,
      data: nodeData,
      score: nodeData.score || 0.5,
      influence: nodeData.influence || 0.5
    });
    
    job.updateProgress(75, 'Updating related scores');
    
    // Update scores for affected nodes
    await updateNodeScores(graph, nodeId);
    
    job.updateProgress(100, 'Node update completed');
    
    return {
      success: true,
      nodeId,
      graphId,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error("Error processing update node job:", error);
    throw error;
  }
}

async function processUpdateEdgeJob(job) {
  try {
    const { edgeId, sourceId, targetId, edgeType, edgeData, graphId } = job.data;
    
    job.updateProgress(25, 'Updating edge');
    
    const TalentGraph = await import("../../models/talentGraph.model.js");
    const graph = await TalentGraph.default.findById(graphId);
    
    if (!graph) {
      throw new Error("Graph not found");
    }
    
    await graph.addEdge({
      id: edgeId,
      source: sourceId,
      target: targetId,
      type: edgeType,
      strength: edgeData.strength || 0.5,
      weight: edgeData.weight || 0.5,
      metadata: edgeData.metadata || {}
    });
    
    job.updateProgress(75, 'Updating edge scores');
    
    // Update edge strength scores
    await updateEdgeScores(graph, edgeId);
    
    job.updateProgress(100, 'Edge update completed');
    
    return {
      success: true,
      edgeId,
      graphId,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error("Error processing update edge job:", error);
    throw error;
  }
}

async function processCalculateScoresJob(job) {
  try {
    const { graphId, scoringType, options } = job.data;
    
    job.updateProgress(20, 'Calculating scores');
    
    const { calculateRelationshipStrength, calculateSkillProximity, calculateCompanySimilarity, calculateCandidateInfluence } = await import('./graphScoring.service.js');
    const TalentGraph = await import("../../models/talentGraph.model.js");
    
    const graph = await TalentGraph.default.findById(graphId);
    if (!graph) {
      throw new Error("Graph not found");
    }
    
    let scoringData = {};
    
    job.updateProgress(40, `Calculating ${scoringType} scores`);
    
    switch (scoringType) {
      case 'relationship':
        scoringData = await calculateRelationshipStrengthForGraph(graph, options);
        break;
      case 'skill':
        scoringData = await calculateSkillProximityForGraph(graph, options);
        break;
      case 'company':
        scoringData = await calculateCompanySimilarityForGraph(graph, options);
        break;
      case 'candidate':
        scoringData = await calculateCandidateInfluenceForGraph(graph, options);
        break;
      case 'all':
        scoringData = await calculateAllScoresForGraph(graph, options);
        break;
      default:
        throw new Error(`Unknown scoring type: ${scoringType}`);
    }
    
    job.updateProgress(80, 'Updating graph with scores');
    
    const { updateGraphScores } = await import('./graphScoring.service.js');
    await updateGraphScores(graphId, scoringData);
    
    job.updateProgress(100, 'Score calculation completed');
    
    return {
      success: true,
      graphId,
      scoringType,
      scoresUpdated: Object.keys(scoringData).length,
      completedAt: new Date()
    };
  } catch (error) {
    console.error("Error processing calculate scores job:", error);
    throw error;
  }
}

async function processAnalyzeNetworkJob(job) {
  try {
    const { graphId, analysisType, options } = job.data;
    
    job.updateProgress(20, 'Analyzing network');
    
    const { calculateGraphMetrics } = await import('./graphScoring.service.js');
    const TalentGraph = await import("../../models/talentGraph.model.js");
    
    const graph = await TalentGraph.default.findById(graphId);
    if (!graph) {
      throw new Error("Graph not found");
    }
    
    job.updateProgress(50, 'Calculating metrics');
    
    const metrics = await calculateGraphMetrics(graph, options);
    
    job.updateProgress(80, 'Storing analysis results');
    
    // Store analysis results
    await storeAnalysisResults(graphId, analysisType, metrics);
    
    job.updateProgress(100, 'Network analysis completed');
    
    return {
      success: true,
      graphId,
      analysisType,
      metrics,
      completedAt: new Date()
    };
  } catch (error) {
    console.error("Error processing analyze network job:", error);
    throw error;
  }
}

async function processSyncGraphJob(job) {
  try {
    const { graphId, syncType, options } = job.data;
    
    job.updateProgress(20, 'Starting sync');
    
    const TalentGraph = await import("../../models/talentGraph.model.js");
    const graph = await TalentGraph.default.findById(graphId);
    
    if (!graph) {
      throw new Error("Graph not found");
    }
    
    job.updateProgress(40, 'Syncing with Elasticsearch');
    
    if (syncType === 'elasticsearch' || syncType === 'all') {
      await syncWithElasticsearch(graph, options);
    }
    
    job.updateProgress(70, 'Syncing with Qdrant');
    
    if (syncType === 'qdrant' || syncType === 'all') {
      await syncWithQdrant(graph, options);
    }
    
    job.updateProgress(100, 'Sync completed');
    
    return {
      success: true,
      graphId,
      syncType,
      completedAt: new Date()
    };
  } catch (error) {
    console.error("Error processing sync graph job:", error);
    throw error;
  }
}

async function processCleanupGraphJob(job) {
  try {
    const { cleanupType, options } = job.data;
    
    job.updateProgress(20, 'Starting cleanup');
    
    const TalentGraph = await import("../../models/talentGraph.model.js");
    
    job.updateProgress(40, 'Cleaning up archived graphs');
    
    if (cleanupType === 'archived' || cleanupType === 'all') {
      const deletedCount = await TalentGraph.default.cleanupArchived(options.olderThanDays || 30);
      job.updateProgress(70, `Cleaned up ${deletedCount} archived graphs`);
    }
    
    job.updateProgress(90, 'Cleaning up queue');
    
    if (cleanupType === 'queue' || cleanupType === 'all') {
      await clearGraphQueue();
    }
    
    job.updateProgress(100, 'Cleanup completed');
    
    return {
      success: true,
      cleanupType,
      completedAt: new Date()
    };
  } catch (error) {
    console.error("Error processing cleanup graph job:", error);
    throw error;
  }
}

// Helper functions
async function generateScoringData(updateType) {
  try {
    return {
      nodeScores: {},
      edgeStrengths: {},
      relationshipStrength: {},
      skillProximity: {},
      companySimilarity: {},
      candidateInfluence: {}
    };
  } catch (error) {
    console.error("Error generating scoring data:", error);
    return {};
  }
}

async function syncGraphWithExternalSystems(graphId) {
  try {
    // Placeholder for external system sync
    console.log(`Syncing graph ${graphId} with external systems`);
  } catch (error) {
    console.error("Error syncing with external systems:", error);
  }
}

async function updateNodeScores(graph, nodeId) {
  try {
    // Placeholder for node score updates
    console.log(`Updating scores for node ${nodeId}`);
  } catch (error) {
    console.error("Error updating node scores:", error);
  }
}

async function updateEdgeScores(graph, edgeId) {
  try {
    // Placeholder for edge score updates
    console.log(`Updating scores for edge ${edgeId}`);
  } catch (error) {
    console.error("Error updating edge scores:", error);
  }
}

async function calculateRelationshipStrengthForGraph(graph, options) {
  try {
    const { calculateRelationshipStrength } = await import('./graphScoring.service.js');
    
    const relationshipTypes = ['knows', 'works_at', 'has_skill', 'in_industry', 'recruited_by'];
    const scoringData = {};
    
    for (const type of relationshipTypes) {
      const strengths = await calculateRelationshipStrength(graph, type, options);
      scoringData.relationshipStrength = { ...scoringData.relationshipStrength, ...strengths };
    }
    
    return scoringData;
  } catch (error) {
    console.error("Error calculating relationship strength for graph:", error);
    return {};
  }
}

async function calculateSkillProximityForGraph(graph, options) {
  try {
    const { calculateSkillProximity } = await import('./graphScoring.service.js');
    
    const skillNodes = graph.nodes.filter(node => node.type === 'skill');
    const scoringData = {};
    
    for (let i = 0; i < skillNodes.length; i++) {
      for (let j = i + 1; j < skillNodes.length; j++) {
        const skill1 = skillNodes[i].id;
        const skill2 = skillNodes[j].id;
        const key = `${skill1}-${skill2}`;
        
        const proximity = await calculateSkillProximity(skill1, skill2, options);
        scoringData.skillProximity[key] = {
          proximity: proximity.overallScore,
          cooccurrence: proximity.cooccurrence,
          compatibility: proximity.compatibility
        };
      }
    }
    
    return scoringData;
  } catch (error) {
    console.error("Error calculating skill proximity for graph:", error);
    return {};
  }
}

async function calculateCompanySimilarityForGraph(graph, options) {
  try {
    const { calculateCompanySimilarity } = await import('./graphScoring.service.js');
    
    const companyNodes = graph.nodes.filter(node => node.type === 'company');
    const scoringData = {};
    
    for (let i = 0; i < companyNodes.length; i++) {
      for (let j = i + 1; j < companyNodes.length; j++) {
        const company1 = companyNodes[i].id;
        const company2 = companyNodes[j].id;
        const key = `${company1}-${company2}`;
        
        const similarity = await calculateCompanySimilarity(company1, company2, options);
        scoringData.companySimilarity[key] = {
          similarity: similarity.overallScore,
          industry: similarity.industry,
          size: similarity.size,
          location: similarity.location
        };
      }
    }
    
    return scoringData;
  } catch (error) {
    console.error("Error calculating company similarity for graph:", error);
    return {};
  }
}

async function calculateCandidateInfluenceForGraph(graph, options) {
  try {
    const { calculateCandidateInfluence } = await import('./graphScoring.service.js');
    
    const candidateNodes = graph.nodes.filter(node => node.type === 'candidate');
    const scoringData = {};
    
    for (const node of candidateNodes) {
      const influence = await calculateCandidateInfluence(node.id, options);
      scoringData.candidateInfluence[node.id] = {
        influence: influence.overallScore,
        reach: influence.networkCentrality,
        centrality: {
          degree: 0,
          betweenness: 0,
          closeness: 0,
          eigenvector: 0
        }
      };
    }
    
    return scoringData;
  } catch (error) {
    console.error("Error calculating candidate influence for graph:", error);
    return {};
  }
}

async function calculateAllScoresForGraph(graph, options) {
  try {
    const relationshipScores = await calculateRelationshipStrengthForGraph(graph, options);
    const skillScores = await calculateSkillProximityForGraph(graph, options);
    const companyScores = await calculateCompanySimilarityForGraph(graph, options);
    const candidateScores = await calculateCandidateInfluenceForGraph(graph, options);
    
    return {
      ...relationshipScores,
      ...skillScores,
      ...companyScores,
      ...candidateScores
    };
  } catch (error) {
    console.error("Error calculating all scores for graph:", error);
    return {};
  }
}

async function storeAnalysisResults(graphId, analysisType, metrics) {
  try {
    // Placeholder for storing analysis results
    console.log(`Storing ${analysisType} analysis results for graph ${graphId}`);
  } catch (error) {
    console.error("Error storing analysis results:", error);
  }
}

async function syncWithElasticsearch(graph, options) {
  try {
    // Placeholder for Elasticsearch sync
    console.log(`Syncing graph ${graph._id} with Elasticsearch`);
  } catch (error) {
    console.error("Error syncing with Elasticsearch:", error);
  }
}

async function syncWithQdrant(graph, options) {
  try {
    // Placeholder for Qdrant sync
    console.log(`Syncing graph ${graph._id} with Qdrant`);
  } catch (error) {
    console.error("Error syncing with Qdrant:", error);
  }
}

export { TALENT_GRAPH_QUEUE_NAME };
