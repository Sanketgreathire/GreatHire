import { SourcingCandidate } from '../../../../models/sourcing/sourcingCandidate.model.js';
import { TalentSignal } from '../../../models/talentSignal.model.js';
import { CandidateFreshness } from '../../../models/candidateFreshness.model.js';
import { eventBusService } from './eventBus.service.js';
import { ingestionEventPublisherService } from './ingestionEventPublisher.service.js';
import { v4 as uuidv4 } from 'uuid';

export class CandidateLifecycleService {
  constructor() {
    this.lifecycleStages = {
      DISCOVERED: 'discovered',
      NORMALIZING: 'normalizing',
      NORMALIZED: 'normalized',
      DEDUPLICATING: 'deduplicating',
      DEDUPLICATED: 'deduplicated',
      CREATED: 'created',
      ENRICHING: 'enriching',
      ENRICHED: 'enriched',
      EMBEDDING: 'embedding',
      EMBEDDED: 'embedded',
      INDEXING: 'indexing',
      INDEXED: 'indexed',
      SIGNALS_GENERATING: 'signals_generating',
      SIGNALS_GENERATED: 'signals_generated',
      REFRESHING: 'refreshing',
      COMPLETED: 'completed',
      FAILED: 'failed',
      PAUSED: 'paused'
    };
    
    this.processingStates = {
      PENDING: 'pending',
      PROCESSING: 'processing',
      COMPLETED: 'completed',
      FAILED: 'failed',
      RETRYING: 'retrying'
    };
    
    this.retryHistory = new Map();
    this.processingMetrics = {
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      averageProcessingTime: 0,
      stageMetrics: {}
    };
  }

  async trackCandidateLifecycle(candidateId, stage, metadata = {}) {
    try {
      const timestamp = new Date().toISOString();
      const lifecycleEvent = {
        candidateId,
        stage,
        previousStage: metadata.previousStage || null,
        timestamp,
        duration: metadata.duration || null,
        status: metadata.status || this.processingStates.PROCESSING,
        error: metadata.error || null,
        metadata: {
          source: metadata.source || 'lifecycle-service',
          correlationId: metadata.correlationId || uuidv4(),
          ...metadata
        }
      };

      // Update candidate lifecycle status
      await this.updateCandidateLifecycleStatus(candidateId, lifecycleEvent);

      // Emit lifecycle event
      await eventBusService.publishEvent('candidate.lifecycle.updated', lifecycleEvent, {
        source: 'candidate-lifecycle-service',
        correlationId: metadata.correlationId
      });

      // Update metrics
      this.updateMetrics(stage, metadata);

      console.log(`Candidate lifecycle tracked: ${candidateId}`, {
        stage,
        status: lifecycleEvent.status,
        timestamp
      });

      return lifecycleEvent;

    } catch (error) {
      console.error(`Error tracking candidate lifecycle: ${candidateId}`, error);
      throw error;
    }
  }

  async updateCandidateLifecycleStatus(candidateId, lifecycleEvent) {
    try {
      // Update in SourcingCandidate
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $set: {
          'lifecycle.currentStage': lifecycleEvent.stage,
          'lifecycle.lastUpdated': new Date(),
          'lifecycle.status': lifecycleEvent.status,
          'lifecycle.lastEvent': lifecycleEvent
        }
      });

      // Create lifecycle history record
      await this.createLifecycleHistory(candidateId, lifecycleEvent);

    } catch (error) {
      console.error(`Error updating candidate lifecycle status: ${candidateId}`, error);
      throw error;
    }
  }

  async createLifecycleHistory(candidateId, lifecycleEvent) {
    try {
      // This would typically store in a separate lifecycle history collection
      // For now, we'll store it in the candidate document
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $push: {
          'lifecycle.history': {
            $each: [lifecycleEvent],
            $position: 0
          }
        }
      });

    } catch (error) {
      console.error(`Error creating lifecycle history: ${candidateId}`, error);
      throw error;
    }
  }

  async getLifecycleStatus(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId)
        .select('lifecycle')
        .lean();

      return candidate?.lifecycle || {
        currentStage: null,
        status: null,
        lastUpdated: null,
        lastEvent: null,
        history: []
      };

    } catch (error) {
      console.error(`Error getting lifecycle status: ${candidateId}`, error);
      throw error;
    }
  }

  async getLifecycleHistory(candidateId, limit = 50) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId)
        .select('lifecycle.history')
        .lean();

      const history = candidate?.lifecycle?.history || [];
      
      return history
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

    } catch (error) {
      console.error(`Error getting lifecycle history: ${candidateId}`, error);
      throw error;
    }
  }

  async trackStageStart(candidateId, stage, metadata = {}) {
    const startTime = new Date().toISOString();
    
    // Store stage start time
    this.stageStartTimes = this.stageStartTimes || new Map();
    this.stageStartTimes.set(`${candidateId}:${stage}`, startTime);

    return await this.trackCandidateLifecycle(candidateId, stage, {
      ...metadata,
      status: this.processingStates.PROCESSING,
      startTime
    });
  }

  async trackStageCompletion(candidateId, stage, metadata = {}) {
    const stageKey = `${candidateId}:${stage}`;
    const startTime = this.stageStartTimes?.get(stageKey);
    const endTime = new Date().toISOString();
    
    let duration = null;
    if (startTime) {
      duration = new Date(endTime).getTime() - new Date(startTime).getTime();
      this.stageStartTimes.delete(stageKey);
    }

    return await this.trackCandidateLifecycle(candidateId, stage, {
      ...metadata,
      status: this.processingStates.COMPLETED,
      startTime,
      endTime,
      duration
    });
  }

  async trackStageFailure(candidateId, stage, error, metadata = {}) {
    const stageKey = `${candidateId}:${stage}`;
    const startTime = this.stageStartTimes?.get(stageKey);
    const endTime = new Date().toISOString();
    
    let duration = null;
    if (startTime) {
      duration = new Date(endTime).getTime() - new Date(startTime).getTime();
      this.stageStartTimes.delete(stageKey);
    }

    // Add to retry history
    await this.addToRetryHistory(candidateId, stage, error, metadata);

    return await this.trackCandidateLifecycle(candidateId, stage, {
      ...metadata,
      status: this.processingStates.FAILED,
      startTime,
      endTime,
      duration,
      error: error.message || error
    });
  }

  async trackStageRetry(candidateId, stage, metadata = {}) {
    const retryCount = this.getRetryCount(candidateId, stage);
    const maxRetries = 3;

    if (retryCount >= maxRetries) {
      return await this.trackStageFailure(candidateId, stage, 
        new Error(`Max retries (${maxRetries}) exceeded`), metadata);
    }

    return await this.trackCandidateLifecycle(candidateId, stage, {
      ...metadata,
      status: this.processingStates.RETRYING,
      retryCount: retryCount + 1,
      maxRetries
    });
  }

  async addToRetryHistory(candidateId, stage, error, metadata) {
    const retryKey = `${candidateId}:${stage}`;
    const retryHistory = this.retryHistory.get(retryKey) || [];
    
    retryHistory.push({
      timestamp: new Date().toISOString(),
      error: error.message || error,
      metadata,
      retryCount: retryHistory.length + 1
    });

    this.retryHistory.set(retryKey, retryHistory);
  }

  getRetryCount(candidateId, stage) {
    const retryKey = `${candidateId}:${stage}`;
    const retryHistory = this.retryHistory.get(retryKey) || [];
    return retryHistory.length;
  }

  getRetryHistory(candidateId, stage) {
    const retryKey = `${candidateId}:${stage}`;
    return this.retryHistory.get(retryKey) || [];
  }

  async clearRetryHistory(candidateId, stage) {
    const retryKey = `${candidateId}:${stage}`;
    this.retryHistory.delete(retryKey);
  }

  async trackIngestionState(candidateId, ingestionState, metadata = {}) {
    try {
      const timestamp = new Date().toISOString();
      
      const stateEvent = {
        candidateId,
        ingestionState,
        timestamp,
        metadata: {
          source: metadata.source || 'lifecycle-service',
          correlationId: metadata.correlationId || uuidv4(),
          ...metadata
        }
      };

      // Update candidate ingestion state
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $set: {
          'ingestion.currentState': ingestionState,
          'ingestion.lastUpdated': new Date(),
          'ingestion.lastEvent': stateEvent
        }
      });

      // Create ingestion history record
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $push: {
          'ingestion.history': {
            $each: [stateEvent],
            $position: 0
          }
        }
      });

      // Emit ingestion state event
      await eventBusService.publishEvent('candidate.ingestion.updated', stateEvent, {
        source: 'candidate-lifecycle-service',
        correlationId: metadata.correlationId
      });

      console.log(`Candidate ingestion state tracked: ${candidateId}`, {
        ingestionState,
        timestamp
      });

      return stateEvent;

    } catch (error) {
      console.error(`Error tracking ingestion state: ${candidateId}`, error);
      throw error;
    }
  }

  async trackProcessingStages(candidateId, processingStages, metadata = {}) {
    try {
      const timestamp = new Date().toISOString();
      
      const stagesEvent = {
        candidateId,
        processingStages,
        timestamp,
        metadata: {
          source: metadata.source || 'lifecycle-service',
          correlationId: metadata.correlationId || uuidv4(),
          ...metadata
        }
      };

      // Update candidate processing stages
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $set: {
          'processing.currentStages': processingStages,
          'processing.lastUpdated': new Date(),
          'processing.lastEvent': stagesEvent
        }
      });

      // Create processing stages history record
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $push: {
          'processing.history': {
            $each: [stagesEvent],
            $position: 0
          }
        }
      });

      // Emit processing stages event
      await eventBusService.publishEvent('candidate.processing.updated', stagesEvent, {
        source: 'candidate-lifecycle-service',
        correlationId: metadata.correlationId
      });

      console.log(`Candidate processing stages tracked: ${candidateId}`, {
        processingStages,
        timestamp
      });

      return stagesEvent;

    } catch (error) {
      console.error(`Error tracking processing stages: ${candidateId}`, error);
      throw error;
    }
  }

  async trackIndexingStages(candidateId, indexingStages, metadata = {}) {
    try {
      const timestamp = new Date().toISOString();
      
      const indexingEvent = {
        candidateId,
        indexingStages,
        timestamp,
        metadata: {
          source: metadata.source || 'lifecycle-service',
          correlationId: metadata.correlationId || uuidv4(),
          ...metadata
        }
      };

      // Update candidate indexing stages
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $set: {
          'indexing.currentStages': indexingStages,
          'indexing.lastUpdated': new Date(),
          'indexing.lastEvent': indexingEvent
        }
      });

      // Create indexing stages history record
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $push: {
          'indexing.history': {
            $each: [indexingEvent],
            $position: 0
          }
        }
      });

      // Emit indexing stages event
      await eventBusService.publishEvent('candidate.indexing.updated', indexingEvent, {
        source: 'candidate-lifecycle-service',
        correlationId: metadata.correlationId
      });

      console.log(`Candidate indexing stages tracked: ${candidateId}`, {
        indexingStages,
        timestamp
      });

      return indexingEvent;

    } catch (error) {
      console.error(`Error tracking indexing stages: ${candidateId}`, error);
      throw error;
    }
  }

  async trackEnrichmentStages(candidateId, enrichmentStages, metadata = {}) {
    try {
      const timestamp = new Date().toISOString();
      
      const enrichmentEvent = {
        candidateId,
        enrichmentStages,
        timestamp,
        metadata: {
          source: metadata.source || 'lifecycle-service',
          correlationId: metadata.correlationId || uuidv4(),
          ...metadata
        }
      };

      // Update candidate enrichment stages
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $set: {
          'enrichment.currentStages': enrichmentStages,
          'enrichment.lastUpdated': new Date(),
          'enrichment.lastEvent': enrichmentEvent
        }
      });

      // Create enrichment stages history record
      await SourcingCandidate.findByIdAndUpdate(candidateId, {
        $push: {
          'enrichment.history': {
            $each: [enrichmentEvent],
            $position: 0
          }
        }
      });

      // Emit enrichment stages event
      await eventBusService.publishEvent('candidate.enrichment.updated', enrichmentEvent, {
        source: 'candidate-lifecycle-service',
        correlationId: metadata.correlationId
      });

      console.log(`Candidate enrichment stages tracked: ${candidateId}`, {
        enrichmentStages,
        timestamp
      });

      return enrichmentEvent;

    } catch (error) {
      console.error(`Error tracking enrichment stages: ${candidateId}`, error);
      throw error;
    }
  }

  async getCandidateProgress(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId)
        .select('lifecycle ingestion processing indexing enrichment')
        .lean();

      const progress = {
        candidateId,
        overallStatus: 'unknown',
        lifecycle: candidate?.lifecycle || {},
        ingestion: candidate?.ingestion || {},
        processing: candidate?.processing || {},
        indexing: candidate?.indexing || {},
        enrichment: candidate?.enrichment || {},
        completionPercentage: 0,
        estimatedTimeRemaining: null,
        lastUpdated: new Date()
      };

      // Calculate overall status
      progress.overallStatus = this.calculateOverallStatus(progress);

      // Calculate completion percentage
      progress.completionPercentage = this.calculateCompletionPercentage(progress);

      // Estimate time remaining
      progress.estimatedTimeRemaining = this.estimateTimeRemaining(progress);

      return progress;

    } catch (error) {
      console.error(`Error getting candidate progress: ${candidateId}`, error);
      throw error;
    }
  }

  calculateOverallStatus(progress) {
    const { lifecycle, ingestion, processing, indexing, enrichment } = progress;
    
    // Check lifecycle status first
    if (lifecycle.status === 'failed') return 'failed';
    if (lifecycle.status === 'processing') return 'processing';
    if (lifecycle.status === 'completed') return 'completed';
    
    // Check individual stage statuses
    const stages = [
      { name: 'ingestion', status: ingestion.currentState },
      { name: 'processing', status: processing.currentStages?.status },
      { name: 'indexing', status: indexing.currentStages?.status },
      { name: 'enrichment', status: enrichment.currentStages?.status }
    ];

    const failedStages = stages.filter(stage => stage.status === 'failed');
    const processingStages = stages.filter(stage => stage.status === 'processing');
    const completedStages = stages.filter(stage => stage.status === 'completed');

    if (failedStages.length > 0) return 'failed';
    if (processingStages.length > 0) return 'processing';
    if (completedStages.length === stages.length) return 'completed';
    
    return 'pending';
  }

  calculateCompletionPercentage(progress) {
    const { lifecycle, ingestion, processing, indexing, enrichment } = progress;
    
    // Define stage weights
    const stageWeights = {
      lifecycle: 0.1,
      ingestion: 0.2,
      processing: 0.2,
      enrichment: 0.25,
      indexing: 0.25
    };

    let totalPercentage = 0;

    // Calculate lifecycle completion
    if (lifecycle.currentStage) {
      const stageIndex = Object.values(this.lifecycleStages).indexOf(lifecycle.currentStage);
      const totalStages = Object.keys(this.lifecycleStages).length;
      totalPercentage += (stageIndex + 1) / totalStages * stageWeights.lifecycle * 100;
    }

    // Calculate other stage completions
    const stages = [
      { data: ingestion, weight: stageWeights.ingestion },
      { data: processing, weight: stageWeights.processing },
      { data: enrichment, weight: stageWeights.enrichment },
      { data: indexing, weight: stageWeights.indexing }
    ];

    for (const stage of stages) {
      if (stage.data.currentState === 'completed') {
        totalPercentage += stage.weight * 100;
      } else if (stage.data.currentStages?.status === 'completed') {
        totalPercentage += stage.weight * 100;
      } else if (stage.data.currentStages?.progress) {
        totalPercentage += stage.data.currentStages.progress * stage.weight;
      }
    }

    return Math.min(Math.round(totalPercentage), 100);
  }

  estimateTimeRemaining(progress) {
    // This would use historical data to estimate time remaining
    // For now, return a placeholder
    const { completionPercentage } = progress;
    
    if (completionPercentage >= 100) return 0;
    if (completionPercentage <= 0) return null;
    
    // Mock estimation: 5 minutes total processing time
    const totalTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const elapsed = (completionPercentage / 100) * totalTime;
    const remaining = totalTime - elapsed;
    
    return Math.max(0, remaining);
  }

  updateMetrics(stage, metadata) {
    this.processingMetrics.totalProcessed++;
    
    if (metadata.status === this.processingStates.COMPLETED) {
      this.processingMetrics.successful++;
    } else if (metadata.status === this.processingStates.FAILED) {
      this.processingMetrics.failed++;
    }

    // Update stage-specific metrics
    if (!this.processingMetrics.stageMetrics[stage]) {
      this.processingMetrics.stageMetrics[stage] = {
        processed: 0,
        successful: 0,
        failed: 0,
        averageTime: 0
      };
    }

    const stageMetric = this.processingMetrics.stageMetrics[stage];
    stageMetric.processed++;
    
    if (metadata.status === this.processingStates.COMPLETED) {
      stageMetric.successful++;
      
      // Update average time
      if (metadata.duration) {
        const totalTime = stageMetric.averageTime * (stageMetric.successful - 1) + metadata.duration;
        stageMetric.averageTime = totalTime / stageMetric.successful;
      }
    } else if (metadata.status === this.processingStates.FAILED) {
      stageMetric.failed++;
    }
  }

  getMetrics() {
    return {
      ...this.processingMetrics,
      successRate: this.processingMetrics.totalProcessed > 0 ? 
        (this.processingMetrics.successful / this.processingMetrics.totalProcessed) * 100 : 0,
      averageProcessingTime: this.processingMetrics.averageProcessingTime || 0,
      retryHistorySize: this.retryHistory.size
    };
  }

  resetMetrics() {
    this.processingMetrics = {
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      averageProcessingTime: 0,
      stageMetrics: {}
    };
  }

  async getCandidatesByStage(stage, limit = 50) {
    try {
      const candidates = await SourcingCandidate.find({
        'lifecycle.currentStage': stage
      })
      .select('name email lifecycle.currentStage lifecycle.lastUpdated')
      .sort({ 'lifecycle.lastUpdated': -1 })
      .limit(limit)
      .lean();

      return candidates;

    } catch (error) {
      console.error(`Error getting candidates by stage ${stage}:`, error);
      throw error;
    }
  }

  async getCandidatesByStatus(status, limit = 50) {
    try {
      const candidates = await SourcingCandidate.find({
        'lifecycle.status': status
      })
      .select('name email lifecycle.status lifecycle.lastUpdated')
      .sort({ 'lifecycle.lastUpdated': -1 })
      .limit(limit)
      .lean();

      return candidates;

    } catch (error) {
      console.error(`Error getting candidates by status ${status}:`, error);
      throw error;
    }
  }

  async getStalledCandidates(hoursThreshold = 24, limit = 50) {
    try {
      const thresholdDate = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);
      
      const candidates = await SourcingCandidate.find({
        'lifecycle.lastUpdated': { $lt: thresholdDate },
        'lifecycle.status': { $in: ['processing', 'retrying'] }
      })
      .select('name email lifecycle.currentStage lifecycle.status lifecycle.lastUpdated')
      .sort({ 'lifecycle.lastUpdated': -1 })
      .limit(limit)
      .lean();

      return candidates.map(candidate => ({
        ...candidate,
        stalledHours: Math.floor((Date.now() - new Date(candidate.lifecycle.lastUpdated).getTime()) / (60 * 60 * 1000))
      }));

    } catch (error) {
      console.error('Error getting stalled candidates:', error);
      throw error;
    }
  }

  async retryStalledCandidates(hoursThreshold = 24) {
    try {
      const stalledCandidates = await this.getStalledCandidates(hoursThreshold);
      const retryResults = [];

      for (const candidate of stalledCandidates) {
        try {
          // Publish retry event
          await ingestionEventPublisherService.publishCandidateRefresh(
            candidate._id,
            {
              reason: 'stalled_processing',
              stalledHours: candidate.stalledHours,
              retry: true
            }
          );

          retryResults.push({
            candidateId: candidate._id,
            success: true,
            stalledHours: candidate.stalledHours
          });

        } catch (error) {
          console.error(`Error retrying stalled candidate ${candidate._id}:`, error);
          retryResults.push({
            candidateId: candidate._id,
            success: false,
            error: error.message
          });
        }
      }

      return {
        totalCandidates: stalledCandidates.length,
        retryResults,
        retriedCount: retryResults.filter(r => r.success).length,
        failedCount: retryResults.filter(r => !r.success).length
      };

    } catch (error) {
      console.error('Error retrying stalled candidates:', error);
      throw error;
    }
  }

  async cleanupOldHistory(daysThreshold = 30) {
    try {
      const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
      
      const result = await SourcingCandidate.updateMany(
        {
          $or: [
            { 'lifecycle.history.timestamp': { $lt: thresholdDate } },
            { 'ingestion.history.timestamp': { $lt: thresholdDate } },
            { 'processing.history.timestamp': { $lt: thresholdDate } },
            { 'indexing.history.timestamp': { $lt: thresholdDate } },
            { 'enrichment.history.timestamp': { $lt: thresholdDate } }
          ]
        },
        {
          $pull: {
            'lifecycle.history': { timestamp: { $lt: thresholdDate } },
            'ingestion.history': { timestamp: { $lt: thresholdDate } },
            'processing.history': { timestamp: { $lt: thresholdDate } },
            'indexing.history': { timestamp: { $lt: thresholdDate } },
            'enrichment.history': { timestamp: { $lt: thresholdDate } }
          }
        }
      );

      console.log(`Cleaned up old history: ${result.modifiedCount} candidates updated`);
      return result;

    } catch (error) {
      console.error('Error cleaning up old history:', error);
      throw error;
    }
  }
}

export const candidateLifecycleService = new CandidateLifecycleService();
export default candidateLifecycleService;
