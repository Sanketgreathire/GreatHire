import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { analyzeGitHubProfile } from "./githubAnalysis.service.js";
import { inferCandidateSkills } from "./skillInference.service.js";
import { analyzeCareerIntelligence } from "./careerIntelligence.service.js";
import { scoreCandidate } from "./candidateScoring.service.js";
import { enqueueBulkEnrichment } from "./enrichmentQueue.service.js";
import { syncToElasticsearch } from "./enrichmentSync.service.js";
import { syncToQdrant } from "./enrichmentSync.service.js";
// import { checkAiHealth } from "../../../sourcing/ai/aiServiceClient.js";

export async function enrichCandidate(candidateId, options = {}) {
  try {
    const { recruiterId, force = false, enrichGithub = true, inferSkills = true } = options;

    const candidate = await SourcingCandidate.findById(candidateId).lean();
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const lastEnriched = candidate.enrichmentMetadata?.lastEnriched;
    if (!force && lastEnriched && (Date.now() - new Date(lastEnriched).getTime()) < 24 * 60 * 60 * 1000) {
      return {
        success: true,
        message: "Candidate already enriched recently",
        enrichedAt: lastEnriched,
        skipped: true
      };
    }

    const enrichmentData = {
      candidateId,
      recruiterId,
      originalData: candidate,
      enrichedAt: new Date(),
      githubAnalysis: null,
      inferredSkills: [],
      careerIntelligence: null,
      candidateScores: null
    };

    if (enrichGithub && candidate.socialLinks?.some(link => link.platform === 'github')) {
      enrichmentData.githubAnalysis = await analyzeGitHubProfile(candidate);
    }

    if (inferSkills) {
      enrichmentData.inferredSkills = await inferCandidateSkills(candidate, enrichmentData.githubAnalysis);
    }

    enrichmentData.careerIntelligence = await analyzeCareerIntelligence(candidate, enrichmentData);

    enrichmentData.candidateScores = await scoreCandidate(candidate, enrichmentData);

    const updatedCandidate = await updateCandidateWithEnrichment(candidateId, enrichmentData);

    await Promise.allSettled([
      syncToElasticsearch(updatedCandidate),
      syncToQdrant(updatedCandidate)
    ]);

    return {
      success: true,
      candidateId,
      enrichedAt: enrichmentData.enrichedAt,
      githubAnalysis: enrichmentData.githubAnalysis,
      inferredSkills: enrichmentData.inferredSkills,
      careerIntelligence: enrichmentData.careerIntelligence,
      candidateScores: enrichmentData.candidateScores,
      updatedCandidate
    };
  } catch (error) {
    console.error("Error in enrichCandidate:", error);
    throw new Error(`Candidate enrichment failed: ${error.message}`);
  }
}

export async function bulkEnrichCandidates(candidateIds, options = {}) {
  try {
    const { recruiterId, batchSize = 5, force = false, enrichGithub = true, inferSkills = true } = options;

    const queueData = {
      candidateIds,
      recruiterId,
      batchSize,
      force,
      enrichGithub,
      inferSkills
    };

    const jobId = await enqueueBulkEnrichment(queueData);

    return {
      success: true,
      queueJobId: jobId,
      message: `Bulk enrichment initiated for ${candidateIds.length} candidates`,
      totalCandidates: candidateIds.length,
      batchSize,
      estimatedTime: Math.ceil(candidateIds.length / batchSize) * 3
    };
  } catch (error) {
    console.error("Error in bulkEnrichCandidates:", error);
    throw new Error(`Bulk enrichment failed: ${error.message}`);
  }
}

export async function getCandidateIntelligence(candidateId, options = {}) {
  try {
    const { recruiterId, includeRaw = false, includeHistory = false } = options;

    const candidate = await SourcingCandidate.findById(candidateId).lean();
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const intelligence = {
      candidateId,
      fullName: candidate.fullName,
      email: candidate.email,
      currentCompany: candidate.currentCompany,
      location: candidate.location,
      inferredSkills: candidate.inferredSkills || [],
      domainExpertise: candidate.domainExpertise || [],
      seniorityLevel: candidate.seniorityLevel || 'unknown',
      githubInsights: candidate.githubInsights || {},
      technicalScore: candidate.technicalScore || 0,
      experienceScore: candidate.experienceScore || 0,
      leadershipScore: candidate.leadershipScore || 0,
      semanticQualityScore: candidate.semanticQualityScore || 0,
      sourcingRecommendationScore: candidate.sourcingRecommendationScore || 0,
      enrichmentMetadata: candidate.enrichmentMetadata || {}
    };

    if (includeRaw) {
      intelligence.rawData = candidate;
    }

    if (includeHistory) {
      intelligence.enrichmentHistory = candidate.enrichmentHistory || [];
    }

    return intelligence;
  } catch (error) {
    console.error("Error in getCandidateIntelligence:", error);
    throw new Error(`Failed to get candidate intelligence: ${error.message}`);
  }
}

export async function getEnrichmentStatus(jobId, recruiterId) {
  try {
    const { getBulkEnrichmentStatus } = await import("./enrichmentQueue.service.js");
    const status = await getBulkEnrichmentStatus(jobId);
    
    return status;
  } catch (error) {
    console.error("Error in getEnrichmentStatus:", error);
    throw new Error(`Failed to get enrichment status: ${error.message}`);
  }
}

export async function getEnrichmentStatistics(recruiterId, timeRange = '30d') {
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

    const stats = await SourcingCandidate.aggregate([
      {
        $match: {
          savedByRecruiter: new mongoose.Types.ObjectId(recruiterId),
          "enrichmentMetadata.lastEnriched": { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEnriched: { $sum: 1 },
          avgTechnicalScore: { $avg: "$technicalScore" },
          avgExperienceScore: { $avg: "$experienceScore" },
          avgLeadershipScore: { $avg: "$leadershipScore" },
          avgSemanticQualityScore: { $avg: "$semanticQualityScore" },
          avgSourcingRecommendationScore: { $avg: "$sourcingRecommendationScore" },
          githubAnalyzed: { $sum: { $cond: [{ $ne: ["$githubInsights", null] }, 1, 0] } },
          skillsInferred: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$inferredSkills", []] } }, 0] }, 1, 0] } },
          careerAnalyzed: { $sum: { $cond: [{ $ne: ["$seniorityLevel", null] }, 1, 0] } }
        }
      }
    ]);

    const enrichmentTrends = await SourcingCandidate.aggregate([
      {
        $match: {
          savedByRecruiter: new mongoose.Types.ObjectId(recruiterId),
          "enrichmentMetadata.lastEnriched": { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$enrichmentMetadata.lastEnriched" } }
          },
          count: { $sum: 1 },
          avgScore: { $avg: "$sourcingRecommendationScore" }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    const result = stats[0] || {
      totalEnriched: 0,
      avgTechnicalScore: 0,
      avgExperienceScore: 0,
      avgLeadershipScore: 0,
      avgSemanticQualityScore: 0,
      avgSourcingRecommendationScore: 0,
      githubAnalyzed: 0,
      skillsInferred: 0,
      careerAnalyzed: 0
    };

    return {
      overall: {
        totalEnriched: result.totalEnriched,
        avgTechnicalScore: result.avgTechnicalScore || 0,
        avgExperienceScore: result.avgExperienceScore || 0,
        avgLeadershipScore: result.avgLeadershipScore || 0,
        avgSemanticQualityScore: result.avgSemanticQualityScore || 0,
        avgSourcingRecommendationScore: result.avgSourcingRecommendationScore || 0,
        githubAnalyzed: result.githubAnalyzed,
        skillsInferred: result.skillsInferred,
        careerAnalyzed: result.careerAnalyzed
      },
      trends: enrichmentTrends,
      timeRange
    };
  } catch (error) {
    console.error("Error in getEnrichmentStatistics:", error);
    throw new Error(`Failed to get enrichment statistics: ${error.message}`);
  }
}

export async function triggerFullEnrichment(options = {}) {
  try {
    const { recruiterId, candidateIds, filters = {}, batchSize = 10 } = options;

    let candidatesToEnrich = [];

    if (candidateIds && candidateIds.length > 0) {
      candidatesToEnrich = candidateIds;
    } else {
      const query = {
        savedByRecruiter: new mongoose.Types.ObjectId(recruiterId),
        ...filters
      };

      const candidates = await SourcingCandidate.find(query)
        .select('_id')
        .lean();

      candidatesToEnrich = candidates.map(c => c._id.toString());
    }

    const result = await bulkEnrichCandidates(candidatesToEnrich, {
      recruiterId,
      batchSize,
      force: true,
      enrichGithub: true,
      inferSkills: true
    });

    return {
      success: true,
      message: `Full enrichment pipeline triggered for ${candidatesToEnrich.length} candidates`,
      ...result
    };
  } catch (error) {
    console.error("Error in triggerFullEnrichment:", error);
    throw new Error(`Full enrichment failed: ${error.message}`);
  }
}

async function updateCandidateWithEnrichment(candidateId, enrichmentData) {
  try {
    const updateData = {
      $set: {
        inferredSkills: enrichmentData.inferredSkills,
        githubInsights: enrichmentData.githubAnalysis,
        seniorityLevel: enrichmentData.careerIntelligence?.seniorityLevel,
        domainExpertise: enrichmentData.careerIntelligence?.domainExpertise,
        technicalScore: enrichmentData.candidateScores?.technicalScore,
        experienceScore: enrichmentData.candidateScores?.experienceScore,
        leadershipScore: enrichmentData.candidateScores?.leadershipScore,
        semanticQualityScore: enrichmentData.candidateScores?.semanticQualityScore,
        sourcingRecommendationScore: enrichmentData.candidateScores?.sourcingRecommendationScore,
        enrichmentMetadata: {
          lastEnriched: enrichmentData.enrichedAt,
          enrichedBy: enrichmentData.recruiterId,
          enrichmentVersion: '1.0',
          githubAnalyzed: !!enrichmentData.githubAnalysis,
          skillsInferred: enrichmentData.inferredSkills.length > 0,
          careerAnalyzed: !!enrichmentData.careerIntelligence,
          scoringCompleted: !!enrichmentData.candidateScores
        }
      },
      $addToSet: {
        enrichmentHistory: {
          enrichedAt: enrichmentData.enrichedAt,
          enrichedBy: enrichmentData.recruiterId,
          version: '1.0',
          components: {
            githubAnalysis: !!enrichmentData.githubAnalysis,
            skillInference: enrichmentData.inferredSkills.length > 0,
            careerIntelligence: !!enrichmentData.careerIntelligence,
            scoring: !!enrichmentData.candidateScores
          }
        }
      }
    };

    const updatedCandidate = await SourcingCandidate.findByIdAndUpdate(
      candidateId,
      updateData,
      { new: true }
    ).lean();

    return updatedCandidate;
  } catch (error) {
    console.error("Error updating candidate with enrichment:", error);
    throw new Error(`Failed to update candidate: ${error.message}`);
  }
}
