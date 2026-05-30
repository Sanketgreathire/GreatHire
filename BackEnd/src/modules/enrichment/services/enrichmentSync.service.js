import { indexCandidate, bulkIndexCandidates, deleteFromVectorStore } from "../../../../sourcing/ai/aiServiceClient.js";

export async function syncToElasticsearch(candidate) {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    if (!candidate || !candidate._id) {
      console.warn("Invalid candidate data for Elasticsearch sync");
      return;
    }

    const esData = {
      id: candidate._id.toString(),
      fullName: candidate.fullName,
      headline: candidate.headline,
      bio: candidate.bio,
      location: candidate.location,
      currentCompany: candidate.currentCompany,
      skills: candidate.skills || [],
      experience: candidate.totalExperience || 0,
      inferredSkills: candidate.inferredSkills || [],
      domainExpertise: candidate.domainExpertise || [],
      seniorityLevel: candidate.seniorityLevel || 'unknown',
      technicalScore: candidate.technicalScore || 0,
      experienceScore: candidate.experienceScore || 0,
      leadershipScore: candidate.leadershipScore || 0,
      semanticQualityScore: candidate.semanticQualityScore || 0,
      sourcingRecommendationScore: candidate.sourcingRecommendationScore || 0,
      savedByRecruiter: candidate.savedByRecruiter,
      enrichmentMetadata: candidate.enrichmentMetadata || {},
      githubInsights: candidate.githubInsights || null,
      careerIntelligence: candidate.careerIntelligence || null,
      candidateScores: candidate.candidateScores || null,
      updatedAt: new Date(),
      enrichedAt: candidate.enrichmentMetadata?.lastEnriched || new Date()
    };

    if (candidate.githubInsights && candidate.githubInsights.insights) {
      esData.githubLanguages = (candidate.githubInsights.insights.languages || []).map(lang => lang.name);
      esData.githubComplexity = candidate.githubInsights.insights.projectComplexity;
      esData.githubActivity = candidate.githubInsights.insights.activityLevel;
      esData.githubInnovation = candidate.githubInsights.insights.innovationScore;
    }

    if (candidate.careerIntelligence) {
      esData.startupExperience = candidate.careerIntelligence.startupExperience?.level || 'unknown';
      esData.leadershipLevel = candidate.careerIntelligence.leadershipSignals?.level || 'unknown';
      esData.careerTrajectory = candidate.careerIntelligence.careerTrajectory?.growthRate || 'unknown';
      esData.industryFit = candidate.careerIntelligence.industryFit?.primaryIndustry || 'unknown';
    }

    await esClient.default.index({
      index: "enriched-candidates",
      id: candidate._id.toString(),
      body: esData,
      refresh: true
    });

    console.log(`Successfully synced candidate ${candidate._id} to Elasticsearch`);
    return true;
  } catch (error) {
    console.error("Error syncing candidate to Elasticsearch:", error);
    return false;
  }
}

export async function syncToQdrant(candidate) {
  try {
    if (!candidate || !candidate._id) {
      console.warn("Invalid candidate data for Qdrant sync");
      return;
    }

    const enrichmentText = buildEnrichmentText(candidate);
    
    if (!enrichmentText || enrichmentText.length < 50) {
      console.warn("Insufficient enrichment text for Qdrant sync");
      return;
    }

    const vectorData = {
      candidate_id: candidate._id.toString(),
      text: enrichmentText,
      metadata: {
        fullName: candidate.fullName,
        currentCompany: candidate.currentCompany,
        location: candidate.location,
        skills: candidate.skills || [],
        inferredSkills: candidate.inferredSkills || [],
        domainExpertise: candidate.domainExpertise || [],
        seniorityLevel: candidate.seniorityLevel || 'unknown',
        technicalScore: candidate.technicalScore || 0,
        experienceScore: candidate.experienceScore || 0,
        leadershipScore: candidate.leadershipScore || 0,
        sourcingRecommendationScore: candidate.sourcingRecommendationScore || 0,
        githubLanguages: candidate.githubInsights?.insights?.languages?.map(lang => lang.name) || [],
        githubComplexity: candidate.githubInsights?.insights?.projectComplexity || 'unknown',
        leadershipLevel: candidate.careerIntelligence?.leadershipSignals?.level || 'unknown',
        industryFit: candidate.careerIntelligence?.industryFit?.primaryIndustry || 'unknown',
        enrichedAt: candidate.enrichmentMetadata?.lastEnriched || new Date()
      }
    };

    const result = await indexCandidate(vectorData);
    
    if (result) {
      console.log(`Successfully synced candidate ${candidate._id} to Qdrant`);
    }
    
    return result;
  } catch (error) {
    console.error("Error syncing candidate to Qdrant:", error);
    return false;
  }
}

export async function bulkSyncToElasticsearch(candidates) {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    if (!candidates || candidates.length === 0) {
      console.warn("No candidates provided for bulk Elasticsearch sync");
      return { success: false, message: "No candidates to sync" };
    }

    const body = [];
    let successCount = 0;
    let errorCount = 0;

    for (const candidate of candidates) {
      if (!candidate || !candidate._id) {
        errorCount++;
        continue;
      }

      const esData = {
        fullName: candidate.fullName,
        headline: candidate.headline,
        bio: candidate.bio,
        location: candidate.location,
        currentCompany: candidate.currentCompany,
        skills: candidate.skills || [],
        experience: candidate.totalExperience || 0,
        inferredSkills: candidate.inferredSkills || [],
        domainExpertise: candidate.domainExpertise || [],
        seniorityLevel: candidate.seniorityLevel || 'unknown',
        technicalScore: candidate.technicalScore || 0,
        experienceScore: candidate.experienceScore || 0,
        leadershipScore: candidate.leadershipScore || 0,
        semanticQualityScore: candidate.semanticQualityScore || 0,
        sourcingRecommendationScore: candidate.sourcingRecommendationScore || 0,
        savedByRecruiter: candidate.savedByRecruiter,
        enrichmentMetadata: candidate.enrichmentMetadata || {},
        githubInsights: candidate.githubInsights || null,
        careerIntelligence: candidate.careerIntelligence || null,
        candidateScores: candidate.candidateScores || null,
        updatedAt: new Date(),
        enrichedAt: candidate.enrichmentMetadata?.lastEnriched || new Date()
      };

      if (candidate.githubInsights && candidate.githubInsights.insights) {
        esData.githubLanguages = (candidate.githubInsights.insights.languages || []).map(lang => lang.name);
        esData.githubComplexity = candidate.githubInsights.insights.projectComplexity;
        esData.githubActivity = candidate.githubInsights.insights.activityLevel;
        esData.githubInnovation = candidate.githubInsights.insights.innovationScore;
      }

      if (candidate.careerIntelligence) {
        esData.startupExperience = candidate.careerIntelligence.startupExperience?.level || 'unknown';
        esData.leadershipLevel = candidate.careerIntelligence.leadershipSignals?.level || 'unknown';
        esData.careerTrajectory = candidate.careerIntelligence.careerTrajectory?.growthRate || 'unknown';
        esData.industryFit = candidate.careerIntelligence.industryFit?.primaryIndustry || 'unknown';
      }

      body.push({
        index: { _index: "enriched-candidates", _id: candidate._id.toString() }
      });
      body.push(esData);
    }

    if (body.length === 0) {
      return { success: false, message: "No valid candidates to sync" };
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
      console.log(`Successfully bulk synced ${successCount} candidates to Elasticsearch`);
    }

    return {
      success: true,
      successCount,
      errorCount,
      total: candidates.length
    };
  } catch (error) {
    console.error("Error in bulk Elasticsearch sync:", error);
    return {
      success: false,
      error: error.message,
      total: candidates.length
    };
  }
}

export async function bulkSyncToQdrant(candidates) {
  try {
    if (!candidates || candidates.length === 0) {
      console.warn("No candidates provided for bulk Qdrant sync");
      return { success: false, message: "No candidates to sync" };
    }

    const vectorData = [];
    let successCount = 0;
    let errorCount = 0;

    for (const candidate of candidates) {
      if (!candidate || !candidate._id) {
        errorCount++;
        continue;
      }

      const enrichmentText = buildEnrichmentText(candidate);
      
      if (!enrichmentText || enrichmentText.length < 50) {
        errorCount++;
        continue;
      }

      const metadata = {
        fullName: candidate.fullName,
        currentCompany: candidate.currentCompany,
        location: candidate.location,
        skills: candidate.skills || [],
        inferredSkills: candidate.inferredSkills || [],
        domainExpertise: candidate.domainExpertise || [],
        seniorityLevel: candidate.seniorityLevel || 'unknown',
        technicalScore: candidate.technicalScore || 0,
        experienceScore: candidate.experienceScore || 0,
        leadershipScore: candidate.leadershipScore || 0,
        sourcingRecommendationScore: candidate.sourcingRecommendationScore || 0,
        githubLanguages: candidate.githubInsights?.insights?.languages?.map(lang => lang.name) || [],
        githubComplexity: candidate.githubInsights?.insights?.projectComplexity || 'unknown',
        leadershipLevel: candidate.careerIntelligence?.leadershipSignals?.level || 'unknown',
        industryFit: candidate.careerIntelligence?.industryFit?.primaryIndustry || 'unknown',
        enrichedAt: candidate.enrichmentMetadata?.lastEnriched || new Date()
      };

      vectorData.push({
        candidate_id: candidate._id.toString(),
        text: enrichmentText,
        metadata
      });
    }

    if (vectorData.length === 0) {
      return { success: false, message: "No valid candidates to sync" };
    }

    const result = await bulkIndexCandidates(vectorData);
    
    if (result) {
      successCount = vectorData.length;
      console.log(`Successfully bulk synced ${successCount} candidates to Qdrant`);
    } else {
      errorCount = vectorData.length;
      console.error("Bulk Qdrant sync failed");
    }

    return {
      success: result,
      successCount,
      errorCount,
      total: candidates.length
    };
  } catch (error) {
    console.error("Error in bulk Qdrant sync:", error);
    return {
      success: false,
      error: error.message,
      total: candidates.length
    };
  }
}

export async function removeFromElasticsearch(candidateId) {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    await esClient.default.delete({
      index: "enriched-candidates",
      id: candidateId.toString()
    });

    console.log(`Successfully removed candidate ${candidateId} from Elasticsearch`);
    return true;
  } catch (error) {
    console.error("Error removing candidate from Elasticsearch:", error);
    return false;
  }
}

export async function removeFromQdrant(candidateId) {
  try {
    const result = await deleteFromVectorStore(candidateId.toString());
    
    if (result) {
      console.log(`Successfully removed candidate ${candidateId} from Qdrant`);
    }
    
    return result;
  } catch (error) {
    console.error("Error removing candidate from Qdrant:", error);
    return false;
  }
}

function buildEnrichmentText(candidate) {
  const parts = [];

  if (candidate.fullName) parts.push(candidate.fullName);
  if (candidate.headline) parts.push(candidate.headline);
  if (candidate.bio) parts.push(candidate.bio);
  if (candidate.currentCompany) parts.push(`Current company: ${candidate.currentCompany}`);
  if (candidate.location) parts.push(`Location: ${candidate.location}`);
  if (candidate.totalExperience) parts.push(`Experience: ${candidate.totalExperience} years`);

  if (candidate.skills && candidate.skills.length > 0) {
    parts.push(`Skills: ${candidate.skills.join(', ')}`);
  }

  if (candidate.inferredSkills && candidate.inferredSkills.length > 0) {
    const inferredSkills = Array.isArray(candidate.inferredSkills) 
      ? candidate.inferredSkills 
      : candidate.inferredSkills.map(skill => skill.skill || skill);
    parts.push(`Inferred skills: ${inferredSkills.join(', ')}`);
  }

  if (candidate.domainExpertise && candidate.domainExpertise.length > 0) {
    const domains = Array.isArray(candidate.domainExpertise)
      ? candidate.domainExpertise
      : candidate.domainExpertise.map(domain => domain.domain || domain);
    parts.push(`Domain expertise: ${domains.join(', ')}`);
  }

  if (candidate.seniorityLevel && candidate.seniorityLevel !== 'unknown') {
    parts.push(`Seniority: ${candidate.seniorityLevel}`);
  }

  if (candidate.githubInsights && candidate.githubInsights.insights) {
    const insights = candidate.githubInsights.insights;
    
    if (insights.languages && insights.languages.length > 0) {
      const languages = insights.languages.map(lang => lang.name).join(', ');
      parts.push(`GitHub languages: ${languages}`);
    }
    
    if (insights.technicalSkills && insights.technicalSkills.length > 0) {
      parts.push(`GitHub technical skills: ${insights.technicalSkills.join(', ')}`);
    }
    
    if (insights.expertiseAreas && insights.expertiseAreas.length > 0) {
      parts.push(`Expertise areas: ${insights.expertiseAreas.join(', ')}`);
    }
    
    if (insights.projectComplexity && insights.projectComplexity !== 'unknown') {
      parts.push(`Project complexity: ${insights.projectComplexity}`);
    }
  }

  if (candidate.careerIntelligence) {
    const career = candidate.careerIntelligence;
    
    if (career.startupExperience && career.startupExperience.level !== 'none') {
      parts.push(`Startup experience: ${career.startupExperience.level}`);
    }
    
    if (career.leadershipSignals && career.leadershipSignals.level !== 'individual-contributor') {
      parts.push(`Leadership level: ${career.leadershipSignals.level}`);
    }
    
    if (career.industryFit && career.industryFit.primaryIndustry && career.industryFit.primaryIndustry !== 'unknown') {
      parts.push(`Industry fit: ${career.industryFit.primaryIndustry}`);
    }
  }

  if (candidate.candidateScores) {
    const scores = candidate.candidateScores;
    parts.push(`Technical score: ${scores.technicalScore || 0}`);
    parts.push(`Experience score: ${scores.experienceScore || 0}`);
    parts.push(`Leadership score: ${scores.leadershipScore || 0}`);
    parts.push(`Recommendation score: ${scores.sourcingRecommendationScore || 0}`);
  }

  return parts.join('. ');
}

export async function reindexEnrichedCandidates() {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const candidates = await SourcingCandidate.default.find({
      $or: [
        { "enrichmentMetadata.lastEnriched": { $exists: true } },
        { inferredSkills: { $exists: true, $ne: [] } },
        { githubInsights: { $exists: true, $ne: null } },
        { careerIntelligence: { $exists: true, $ne: null } },
        { candidateScores: { $exists: true, $ne: null } }
      ]
    }).lean();

    console.log(`Found ${candidates.length} enriched candidates for reindexing`);

    const [esResult, qdrantResult] = await Promise.allSettled([
      bulkSyncToElasticsearch(candidates),
      bulkSyncToQdrant(candidates)
    ]);

    const results = {
      elasticsearch: esResult.status === 'fulfilled' ? esResult.value : { success: false, error: esResult.reason?.message },
      qdrant: qdrantResult.status === 'fulfilled' ? qdrantResult.value : { success: false, error: qdrantResult.reason?.message },
      totalCandidates: candidates.length
    };

    console.log("Reindexing completed:", results);
    return results;
  } catch (error) {
    console.error("Error during reindexing:", error);
    throw error;
  }
}

export async function getSyncStatus() {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    const [esStats, qdrantStats] = await Promise.allSettled([
      esClient.default.count({ index: "enriched-candidates" }),
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
