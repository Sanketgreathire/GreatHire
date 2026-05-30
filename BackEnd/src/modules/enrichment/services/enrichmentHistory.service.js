import CandidateIntelligence from "../../../models/candidateIntelligence.model.js";

export async function saveEnrichmentRecord(enrichmentData) {
  try {
    const {
      candidateId,
      recruiterId,
      githubAnalysis,
      inferredSkills,
      careerIntelligence,
      candidateScores,
      enrichmentMetadata
    } = enrichmentData;

    const existingRecord = await CandidateIntelligence.findOne({ candidateId });
    
    if (existingRecord) {
      const updateData = {
        $set: {
          githubAnalysis: githubAnalysis || existingRecord.githubAnalysis,
          inferredSkills: inferredSkills || existingRecord.inferredSkills,
          careerIntelligence: careerIntelligence || existingRecord.careerIntelligence,
          candidateScores: candidateScores || existingRecord.candidateScores,
          enrichmentMetadata: {
            ...existingRecord.enrichmentMetadata,
            ...enrichmentMetadata,
            lastEnriched: new Date()
          }
        },
        $push: {
          enrichmentHistory: {
            enrichedAt: new Date(),
            enrichedBy: recruiterId,
            version: enrichmentMetadata.version || '1.0',
            components: {
              githubAnalysis: !!githubAnalysis,
              skillInference: Array.isArray(inferredSkills) && inferredSkills.length > 0,
              careerIntelligence: !!careerIntelligence,
              scoring: !!candidateScores
            }
          }
        }
      };

      const updatedRecord = await CandidateIntelligence.findByIdAndUpdate(
        candidateId,
        updateData,
        { new: true }
      );

      return updatedRecord;
    } else {
      const newRecord = new CandidateIntelligence({
        candidateId,
        inferredSkills: inferredSkills || [],
        githubInsights: githubAnalysis?.insights || null,
        seniorityLevel: careerIntelligence?.seniorityLevel || 'unknown',
        domainExpertise: careerIntelligence?.domainExpertise || [],
        technicalScore: candidateScores?.technicalScore || 0,
        experienceScore: candidateScores?.experienceScore || 0,
        leadershipScore: candidateScores?.leadershipScore || 0,
        semanticQualityScore: candidateScores?.semanticQualityScore || 0,
        sourcingRecommendationScore: candidateScores?.sourcingRecommendationScore || 0,
        githubAnalysis: githubAnalysis || null,
        careerIntelligence: careerIntelligence || null,
        candidateScores: candidateScores || null,
        enrichmentMetadata: {
          lastEnriched: new Date(),
          enrichedBy: recruiterId,
          enrichmentVersion: '1.0',
          githubAnalyzed: !!githubAnalysis,
          skillsInferred: Array.isArray(inferredSkills) && inferredSkills.length > 0,
          careerAnalyzed: !!careerIntelligence,
          scoringCompleted: !!candidateScores
        },
        enrichmentHistory: [{
          enrichedAt: new Date(),
          enrichedBy: recruiterId,
          version: '1.0',
          components: {
            githubAnalysis: !!githubAnalysis,
            skillInference: Array.isArray(inferredSkills) && inferredSkills.length > 0,
            careerIntelligence: !!careerIntelligence,
            scoring: !!candidateScores
          }
        }]
      });

      await newRecord.save();
      return newRecord;
    }
  } catch (error) {
    console.error("Error saving enrichment record:", error);
    throw new Error(`Failed to save enrichment record: ${error.message}`);
  }
}

export async function getEnrichmentHistory(candidateId, options = {}) {
  try {
    const { limit = 10, offset = 0 } = options;

    const record = await CandidateIntelligence.findOne({ candidateId })
      .populate('candidateId', 'fullName email currentCompany')
      .populate('enrichmentMetadata.enrichedBy', 'fullName email')
      .lean();

    if (!record) {
      return {
        candidateId,
        history: [],
        total: 0,
        hasMore: false
      };
    }

    const history = record.enrichmentHistory || [];
    const sortedHistory = history.sort((a, b) => new Date(b.enrichedAt) - new Date(a.enrichedAt));
    
    const paginatedHistory = sortedHistory.slice(offset, offset + limit);

    return {
      candidateId,
      candidate: record.candidateId,
      currentIntelligence: {
        inferredSkills: record.inferredSkills,
        githubInsights: record.githubInsights,
        careerIntelligence: record.careerIntelligence,
        candidateScores: record.candidateScores,
        enrichmentMetadata: record.enrichmentMetadata
      },
      history: paginatedHistory,
      total: history.length,
      hasMore: offset + limit < history.length
    };
  } catch (error) {
    console.error("Error getting enrichment history:", error);
    throw new Error(`Failed to get enrichment history: ${error.message}`);
  }
}

export async function updateEnrichmentComponent(candidateId, component, data, recruiterId) {
  try {
    const updateData = {
      $set: {
        [`enrichmentMetadata.lastEnriched`]: new Date(),
        [`enrichmentMetadata.enrichedBy`]: recruiterId
      }
    };

    switch (component) {
      case 'github':
        updateData.$set.githubAnalysis = data;
        updateData.$set['enrichmentMetadata.githubAnalyzed'] = true;
        break;
      
      case 'skills':
        updateData.$set.inferredSkills = data;
        updateData.$set['enrichmentMetadata.skillsInferred'] = true;
        break;
      
      case 'career':
        updateData.$set.careerIntelligence = data;
        updateData.$set['enrichmentMetadata.careerAnalyzed'] = true;
        break;
      
      case 'scoring':
        updateData.$set.candidateScores = data;
        updateData.$set['enrichmentMetadata.scoringCompleted'] = true;
        break;
      
      default:
        throw new Error(`Unknown enrichment component: ${component}`);
    }

    const updatedRecord = await CandidateIntelligence.findByIdAndUpdate(
      candidateId,
      {
        ...updateData,
        $push: {
          enrichmentHistory: {
            enrichedAt: new Date(),
            enrichedBy: recruiterId,
            version: '1.0',
            components: {
              [component]: true
            },
            changes: data
          }
        }
      },
      { new: true }
    );

    return updatedRecord;
  } catch (error) {
    console.error("Error updating enrichment component:", error);
    throw new Error(`Failed to update enrichment component: ${error.message}`);
  }
}

export async function getEnrichmentStats(recruiterId, timeRange = '30d') {
  try {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const stats = await CandidateIntelligence.aggregate([
      {
        $match: {
          "enrichmentMetadata.lastEnriched": { $gte: startDate },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalEnriched: { $sum: 1 },
          avgTechnicalScore: { $avg: "$candidateScores.technicalScore" },
          avgExperienceScore: { $avg: "$candidateScores.experienceScore" },
          avgLeadershipScore: { $avg: "$candidateScores.leadershipScore" },
          avgSemanticQualityScore: { $avg: "$candidateScores.semanticQualityScore" },
          avgRecommendationScore: { $avg: "$candidateScores.sourcingRecommendationScore" },
          githubAnalyzed: { $sum: { $cond: ["$enrichmentMetadata.githubAnalyzed", 1, 0] } },
          skillsInferred: { $sum: { $cond: ["$enrichmentMetadata.skillsInferred", 1, 0] } },
          careerAnalyzed: { $sum: { $cond: ["$enrichmentMetadata.careerAnalyzed", 1, 0] } },
          scoringCompleted: { $sum: { $cond: ["$enrichmentMetadata.scoringCompleted", 1, 0] } },
          aiUsed: { $sum: { $cond: ["$enrichmentMetadata.aiUsed", 1, 0] } },
          avgProcessingTime: { $avg: "$enrichmentMetadata.processingTime" }
        }
      }
    ]);

    const componentStats = await CandidateIntelligence.aggregate([
      {
        $match: {
          "enrichmentMetadata.lastEnriched": { $gte: startDate },
          isActive: true
        }
      },
      {
        $group: {
          _id: "$enrichmentMetadata.enrichedBy",
          recruiterName: { $first: "$enrichmentMetadata.enrichedBy" },
          totalEnriched: { $sum: 1 },
          githubAnalyzed: { $sum: { $cond: ["$enrichmentMetadata.githubAnalyzed", 1, 0] } },
          skillsInferred: { $sum: { $cond: ["$enrichmentMetadata.skillsInferred", 1, 0] } },
          careerAnalyzed: { $sum: { $cond: ["$enrichmentMetadata.careerAnalyzed", 1, 0] } },
          scoringCompleted: { $sum: { $cond: ["$enrichmentMetadata.scoringCompleted", 1, 0] } },
          avgScore: { $avg: "$candidateScores.sourcingRecommendationScore" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "recruiter"
        }
      },
      {
        $unwind: "$recruiter"
      },
      {
        $project: {
          recruiterId: "$_id",
          recruiterName: { $ifNull: ["$recruiter.fullName", "Unknown"] },
          totalEnriched: 1,
          githubAnalyzed: 1,
          skillsInferred: 1,
          careerAnalyzed: 1,
          scoringCompleted: 1,
          avgScore: 1
        }
      },
      {
        $sort: { totalEnriched: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const seniorityDistribution = await CandidateIntelligence.aggregate([
      {
        $match: {
          "enrichmentMetadata.lastEnriched": { $gte: startDate },
          isActive: true,
          "careerIntelligence.seniorityLevel": { $ne: "unknown" }
        }
      },
      {
        $group: {
          _id: "$careerIntelligence.seniorityLevel",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const domainDistribution = await CandidateIntelligence.aggregate([
      {
        $match: {
          "enrichmentMetadata.lastEnriched": { $gte: startDate },
          isActive: true
        }
      },
      {
        $unwind: "$domainExpertise"
      },
      {
        $group: {
          _id: "$domainExpertise.domain",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const result = stats[0] || {
      totalEnriched: 0,
      avgTechnicalScore: 0,
      avgExperienceScore: 0,
      avgLeadershipScore: 0,
      avgSemanticQualityScore: 0,
      avgRecommendationScore: 0,
      githubAnalyzed: 0,
      skillsInferred: 0,
      careerAnalyzed: 0,
      scoringCompleted: 0,
      aiUsed: 0,
      avgProcessingTime: 0
    };

    return {
      overall: {
        totalEnriched: result.totalEnriched,
        avgTechnicalScore: result.avgTechnicalScore || 0,
        avgExperienceScore: result.avgExperienceScore || 0,
        avgLeadershipScore: result.avgLeadershipScore || 0,
        avgSemanticQualityScore: result.avgSemanticQualityScore || 0,
        avgRecommendationScore: result.avgRecommendationScore || 0,
        githubAnalyzed: result.githubAnalyzed,
        skillsInferred: result.skillsInferred,
        careerAnalyzed: result.careerAnalyzed,
        scoringCompleted: result.scoringCompleted,
        aiUsed: result.aiUsed,
        avgProcessingTime: result.avgProcessingTime || 0
      },
      byRecruiter: componentStats,
      seniorityDistribution,
      domainDistribution,
      timeRange
    };
  } catch (error) {
    console.error("Error getting enrichment stats:", error);
    throw new Error(`Failed to get enrichment stats: ${error.message}`);
  }
}

export async function archiveEnrichmentRecord(candidateId) {
  try {
    const record = await CandidateIntelligence.findById(candidateId);
    if (!record) {
      throw new Error("Enrichment record not found");
    }

    await record.archive();
    return record;
  } catch (error) {
    console.error("Error archiving enrichment record:", error);
    throw new Error(`Failed to archive enrichment record: ${error.message}`);
  }
}

export async function getTopEnrichedCandidates(limit = 20, filters = {}) {
  try {
    const query = { isActive: true };
    
    if (filters.minScore) {
      query["candidateScores.sourcingRecommendationScore"] = { $gte: filters.minScore };
    }
    
    if (filters.seniorityLevel) {
      query["careerIntelligence.seniorityLevel"] = filters.seniorityLevel;
    }
    
    if (filters.domain) {
      query["domainExpertise.domain"] = filters.domain;
    }

    const candidates = await CandidateIntelligence.find(query)
      .populate('candidateId', 'fullName email currentCompany location skills')
      .populate('enrichmentMetadata.enrichedBy', 'fullName email')
      .sort({ "candidateScores.sourcingRecommendationScore": -1 })
      .limit(limit)
      .lean();

    return candidates.map(candidate => ({
      ...candidate,
      overallScore: candidate.getOverallScore(),
      isHighlyRecommended: candidate.isHighlyRecommended(),
      isRecommended: candidate.isRecommended(),
      enrichmentCompleteness: candidate.getEnrichmentCompleteness()
    }));
  } catch (error) {
    console.error("Error getting top enriched candidates:", error);
    throw new Error(`Failed to get top enriched candidates: ${error.message}`);
  }
}

export async function getEnrichmentTrends(timeRange = '30d') {
  try {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const trends = await CandidateIntelligence.aggregate([
      {
        $match: {
          "enrichmentMetadata.lastEnriched": { $gte: startDate },
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$enrichmentMetadata.lastEnriched" } },
            component: {
              $switch: {
                branches: [
                  { case: { $eq: ["$enrichmentMetadata.githubAnalyzed", true] }, then: "github" },
                  { case: { $eq: ["$enrichmentMetadata.skillsInferred", true] }, then: "skills" },
                  { case: { $eq: ["$enrichmentMetadata.careerAnalyzed", true] }, then: "career" },
                  { case: { $eq: ["$enrichmentMetadata.scoringCompleted", true] }, then: "scoring" }
                ],
                default: "unknown"
              }
            }
          },
          count: { $sum: 1 },
          avgScore: { $avg: "$candidateScores.sourcingRecommendationScore" }
        }
      },
      {
        $sort: { "_id.date": 1, "_id.component": 1 }
      }
    ]);

    const scoreTrends = await CandidateIntelligence.aggregate([
      {
        $match: {
          "enrichmentMetadata.lastEnriched": { $gte: startDate },
          isActive: true,
          "candidateScores.sourcingRecommendationScore": { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$enrichmentMetadata.lastEnriched" } }
          },
          avgScore: { $avg: "$candidateScores.sourcingRecommendationScore" },
          maxScore: { $max: "$candidateScores.sourcingRecommendationScore" },
          minScore: { $min: "$candidateScores.sourcingRecommendationScore" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    return {
      componentTrends: trends,
      scoreTrends,
      timeRange
    };
  } catch (error) {
    console.error("Error getting enrichment trends:", error);
    throw new Error(`Failed to get enrichment trends: ${error.message}`);
  }
}
