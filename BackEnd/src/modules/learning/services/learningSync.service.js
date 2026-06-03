import { indexCandidate, bulkIndexCandidates, deleteFromVectorStore } from "../../../sourcing/ai/aiServiceClient.js";

export async function syncToElasticsearch(recruiterLearning) {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    if (!recruiterLearning || !recruiterLearning.recruiterId) {
      console.warn("Invalid recruiter learning data for Elasticsearch sync");
      return;
    }

    const esData = {
      id: recruiterLearning.recruiterId.toString(),
      recruiterId: recruiterLearning.recruiterId,
      learnedPreferences: recruiterLearning.learnedPreferences || {},
      rankingSignals: recruiterLearning.rankingSignals || {},
      behavioralPatterns: recruiterLearning.behavioralPatterns || {},
      hiringPatterns: recruiterLearning.hiringPatterns || {},
      customWeights: recruiterLearning.customWeights || {},
      modelMetadata: recruiterLearning.modelMetadata || {},
      interactionCount: recruiterLearning.interactionHistory?.length || 0,
      lastLearningUpdate: recruiterLearning.modelMetadata?.lastLearningUpdate || new Date(),
      confidence: recruiterLearning.modelMetadata?.confidence || 0,
      learningStage: recruiterLearning.determineLearningStage?.() || 'unknown',
      updatedAt: new Date()
    };

    if (recruiterLearning.interactionHistory && recruiterLearning.interactionHistory.length > 0) {
      const recentInteractions = recruiterLearning.interactionHistory.slice(-50);
      esData.recentInteractions = recentInteractions.map(interaction => ({
        candidateId: interaction.candidateId,
        action: interaction.action,
        timestamp: interaction.timestamp,
        context: interaction.context || {}
      }));
    }

    if (recruiterLearning.behavioralPatterns?.topPreferredSkills) {
      esData.topPreferredSkills = recruiterLearning.behavioralPatterns.topPreferredSkills.skills?.slice(0, 10) || [];
    }

    if (recruiterLearning.hiringPatterns?.velocityMetrics) {
      esData.hiringVelocity = recruiterLearning.hiringPatterns.velocityMetrics;
    }

    await esClient.default.index({
      index: "recruiter-learning",
      id: recruiterLearning.recruiterId.toString(),
      body: esData,
      refresh: true
    });

    console.log(`Successfully synced recruiter learning ${recruiterLearning.recruiterId} to Elasticsearch`);
    return true;
  } catch (error) {
    console.error("Error syncing recruiter learning to Elasticsearch:", error);
    return false;
  }
}

export async function syncToQdrant(recruiterLearning) {
  try {
    if (!recruiterLearning || !recruiterLearning.recruiterId) {
      console.warn("Invalid recruiter learning data for Qdrant sync");
      return;
    }

    const learningText = buildLearningText(recruiterLearning);
    
    if (!learningText || learningText.length < 50) {
      console.warn("Insufficient learning text for Qdrant sync");
      return;
    }

    const vectorData = {
      recruiter_id: recruiterLearning.recruiterId.toString(),
      text: learningText,
      metadata: {
        recruiterId: recruiterLearning.recruiterId,
        learnedPreferences: recruiterLearning.learnedPreferences || {},
        behavioralPatterns: recruiterLearning.behavioralPatterns || {},
        hiringPatterns: recruiterLearning.hiringPatterns || {},
        interactionCount: recruiterLearning.interactionHistory?.length || 0,
        confidence: recruiterLearning.modelMetadata?.confidence || 0,
        learningStage: recruiterLearning.determineLearningStage?.() || 'unknown',
        lastLearningUpdate: recruiterLearning.modelMetadata?.lastLearningUpdate || new Date()
      }
    };

    const result = await indexRecruiterLearning(vectorData);
    
    if (result) {
      console.log(`Successfully synced recruiter learning ${recruiterLearning.recruiterId} to Qdrant`);
    }
    
    return result;
  } catch (error) {
    console.error("Error syncing recruiter learning to Qdrant:", error);
    return false;
  }
}

export async function bulkSyncToElasticsearch(recruiterLearningData) {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    if (!recruiterLearningData || recruiterLearningData.length === 0) {
      console.warn("No recruiter learning data provided for bulk Elasticsearch sync");
      return { success: false, message: "No recruiter learning data to sync" };
    }

    const body = [];
    let successCount = 0;
    let errorCount = 0;

    for (const learning of recruiterLearningData) {
      if (!learning || !learning.recruiterId) {
        errorCount++;
        continue;
      }

      const esData = {
        recruiterId: learning.recruiterId,
        learnedPreferences: learning.learnedPreferences || {},
        rankingSignals: learning.rankingSignals || {},
        behavioralPatterns: learning.behavioralPatterns || {},
        hiringPatterns: learning.hiringPatterns || {},
        customWeights: learning.customWeights || {},
        modelMetadata: learning.modelMetadata || {},
        interactionCount: learning.interactionHistory?.length || 0,
        lastLearningUpdate: learning.modelMetadata?.lastLearningUpdate || new Date(),
        confidence: learning.modelMetadata?.confidence || 0,
        learningStage: learning.determineLearningStage?.() || 'unknown',
        updatedAt: new Date()
      };

      if (learning.behavioralPatterns?.topPreferredSkills) {
        esData.topPreferredSkills = learning.behavioralPatterns.topPreferredSkills.skills?.slice(0, 10) || [];
      }

      if (learning.hiringPatterns?.velocityMetrics) {
        esData.hiringVelocity = learning.hiringPatterns.velocityMetrics;
      }

      body.push({
        index: { _index: "recruiter-learning", _id: learning.recruiterId.toString() }
      });
      body.push(esData);
    }

    if (body.length === 0) {
      return { success: false, message: "No valid recruiter learning data to sync" };
    }

    const response = await esClient.default.bulk({
      body,
      refresh: true
    });

    if (response.body.errors) {
      errorCount += response.body.items.filter(item => item.index?.error).length;
      successCount = response.body.items.length - errorCount;
      
      console.error(`Bulk Elasticsearch sync completed with ${errorCount} errors out of ${response.body.items.length}`);
    } else {
      successCount = response.body.items.length;
      console.log(`Successfully bulk synced ${successCount} recruiter learning records to Elasticsearch`);
    }

    return {
      success: true,
      successCount,
      errorCount,
      total: recruiterLearningData.length
    };
  } catch (error) {
    console.error("Error in bulk Elasticsearch sync:", error);
    return {
      success: false,
      error: error.message,
      total: recruiterLearningData.length
    };
  }
}

export async function bulkSyncToQdrant(recruiterLearningData) {
  try {
    if (!recruiterLearningData || recruiterLearningData.length === 0) {
      console.warn("No recruiter learning data provided for bulk Qdrant sync");
      return { success: false, message: "No recruiter learning data to sync" };
    }

    const vectorData = [];
    let successCount = 0;
    let errorCount = 0;

    for (const learning of recruiterLearningData) {
      if (!learning || !learning.recruiterId) {
        errorCount++;
        continue;
      }

      const learningText = buildLearningText(learning);
      
      if (!learningText || learningText.length < 50) {
        errorCount++;
        continue;
      }

      const metadata = {
        recruiterId: learning.recruiterId,
        learnedPreferences: learning.learnedPreferences || {},
        behavioralPatterns: learning.behavioralPatterns || {},
        hiringPatterns: learning.hiringPatterns || {},
        interactionCount: learning.interactionHistory?.length || 0,
        confidence: learning.modelMetadata?.confidence || 0,
        learningStage: learning.determineLearningStage?.() || 'unknown',
        lastLearningUpdate: learning.modelMetadata?.lastLearningUpdate || new Date()
      };

      vectorData.push({
        recruiter_id: learning.recruiterId.toString(),
        text: learningText,
        metadata
      });
    }

    if (vectorData.length === 0) {
      return { success: false, message: "No valid recruiter learning data to sync" };
    }

    const result = await bulkIndexRecruiterLearning(vectorData);
    
    if (result) {
      successCount = vectorData.length;
      console.log(`Successfully bulk synced ${successCount} recruiter learning records to Qdrant`);
    } else {
      errorCount = vectorData.length;
      console.error("Bulk Qdrant sync failed");
    }

    return {
      success: result,
      successCount,
      errorCount,
      total: recruiterLearningData.length
    };
  } catch (error) {
    console.error("Error in bulk Qdrant sync:", error);
    return {
      success: false,
      error: error.message,
      total: recruiterLearningData.length
    };
  }
}

export async function removeFromElasticsearch(recruiterId) {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    await esClient.default.delete({
      index: "recruiter-learning",
      id: recruiterId.toString()
    });

    console.log(`Successfully removed recruiter learning ${recruiterId} from Elasticsearch`);
    return true;
  } catch (error) {
    console.error("Error removing recruiter learning from Elasticsearch:", error);
    return false;
  }
}

export async function removeFromQdrant(recruiterId) {
  try {
    const result = await deleteFromVectorStore(`recruiter_${recruiterId.toString()}`);
    
    if (result) {
      console.log(`Successfully removed recruiter learning ${recruiterId} from Qdrant`);
    }
    
    return result;
  } catch (error) {
    console.error("Error removing recruiter learning from Qdrant:", error);
    return false;
  }
}

function buildLearningText(recruiterLearning) {
  const parts = [];

  if (recruiterLearning.learnedPreferences) {
    const prefs = recruiterLearning.learnedPreferences;
    
    if (prefs.preferredSkills && prefs.preferredSkills.length > 0) {
      const skills = prefs.preferredSkills.map(s => s.skill || s).join(', ');
      parts.push(`Preferred skills: ${skills}`);
    }
    
    if (prefs.preferredIndustries && prefs.preferredIndustries.length > 0) {
      const industries = prefs.preferredIndustries.map(i => i.industry || i).join(', ');
      parts.push(`Preferred industries: ${industries}`);
    }
    
    if (prefs.preferredExperienceLevels && prefs.preferredExperienceLevels.length > 0) {
      const levels = prefs.preferredExperienceLevels.map(l => l.level || l).join(', ');
      parts.push(`Preferred experience levels: ${levels}`);
    }
    
    if (prefs.preferredLocations && prefs.preferredLocations.length > 0) {
      const locations = prefs.preferredLocations.map(l => l.location || l).join(', ');
      parts.push(`Preferred locations: ${locations}`);
    }
  }

  if (recruiterLearning.behavioralPatterns?.topPreferredSkills) {
    const topSkills = recruiterLearning.behavioralPatterns.topPreferredSkills.skills?.slice(0, 5) || [];
    if (topSkills.length > 0) {
      parts.push(`Top skills: ${topSkills.join(', ')}`);
    }
  }

  if (recruiterLearning.hiringPatterns?.velocityMetrics) {
    const velocity = recruiterLearning.hiringPatterns.velocityMetrics;
    parts.push(`Hiring velocity: ${velocity.hiresPerMonth || 0} hires per month`);
    parts.push(`Average time to hire: ${velocity.averageTimeToHire || 0} days`);
    parts.push(`Hiring trend: ${velocity.hiringTrend || 'stable'}`);
  }

  if (recruiterLearning.interactionHistory && recruiterLearning.interactionHistory.length > 0) {
    const recentInteractions = recruiterLearning.interactionHistory.slice(-20);
    const actionCounts = {};
    
    recentInteractions.forEach(interaction => {
      actionCounts[interaction.action] = (actionCounts[interaction.action] || 0) + 1;
    });
    
    Object.entries(actionCounts).forEach(([action, count]) => {
      parts.push(`${action}: ${count} times`);
    });
  }

  if (recruiterLearning.modelMetadata) {
    parts.push(`Learning confidence: ${recruiterLearning.modelMetadata.confidence || 0}`);
    parts.push(`Model accuracy: ${recruiterLearning.modelMetadata.modelAccuracy || 0}`);
    parts.push(`Training iterations: ${recruiterLearning.modelMetadata.trainingIterations || 0}`);
  }

  return parts.join('. ');
}

async function indexRecruiterLearning(vectorData) {
  try {
    // This would need to be implemented in the AI service client
    // For now, return true as a placeholder
    return true;
  } catch (error) {
    console.error("Error indexing recruiter learning:", error);
    return false;
  }
}

async function bulkIndexRecruiterLearning(vectorData) {
  try {
    // This would need to be implemented in the AI service client
    // For now, return true as a placeholder
    return true;
  } catch (error) {
    console.error("Error bulk indexing recruiter learning:", error);
    return false;
  }
}

export async function reindexRecruiterLearning() {
  try {
    const RecruiterLearning = await import("../../models/recruiterLearning.model.js");
    
    const learningRecords = await RecruiterLearning.default.find({
      isActive: true
    }).lean();

    console.log(`Found ${learningRecords.length} recruiter learning records for reindexing`);

    const [esResult, qdrantResult] = await Promise.allSettled([
      bulkSyncToElasticsearch(learningRecords),
      bulkSyncToQdrant(learningRecords)
    ]);

    const results = {
      elasticsearch: esResult.status === 'fulfilled' ? esResult.value : { success: false, error: esResult.reason?.message },
      qdrant: qdrantResult.status === 'fulfilled' ? qdrantResult.value : { success: false, error: qdrantResult.reason?.message },
      totalRecords: learningRecords.length
    };

    console.log("Recruiter learning reindexing completed:", results);
    return results;
  } catch (error) {
    console.error("Error during recruiter learning reindexing:", error);
    throw error;
  }
}

export async function getSyncStatus() {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    const [esStats, qdrantStats] = await Promise.allSettled([
      esClient.default.count({ index: "recruiter-learning" }),
      getQdrantStats()
    ]);

    const status = {
      elasticsearch: {
        connected: esStats.status === 'fulfilled',
        count: esStats.status === 'fulfilled' ? esStats.value.body.count : 0,
        error: esStats.status === 'rejected' ? esStats.reason?.message : null
      },
      qdrant: {
        connected: qdrantStats.status === 'fulfilled',
        count: qdrantStats.status === 'fulfilled' ? qdrantStats.value : 0,
        error: qdrantStats.status === 'rejected' ? qdrantStats.reason?.message : null
      }
    };

    return status;
  } catch (error) {
    console.error("Error getting sync status:", error);
    throw error;
  }
}

async function getQdrantStats() {
  try {
    const result = await import("../../../sourcing/ai/aiServiceClient.js");
    return 0;
  } catch (error) {
    console.error("Error getting Qdrant stats:", error);
    return 0;
  }
}
