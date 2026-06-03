import { parseQueryIntent } from "./queryIntentParser.service.js";
import { expandQuery } from "./queryExpansion.service.js";
import { rankCandidates } from "./copilotRanking.service.js";
import { semanticSearch, isAiServiceAvailable } from "../../../../sourcing/ai/aiServiceClient.js";
import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { getRecruiterMemory } from "../../../models/recruiterMemory.model.js";

export async function processCopilotQuery(message, recruiterId, context = {}) {
  try {
    const startTime = Date.now();
    
    const recruiterMemory = await getRecruiterMemory(recruiterId);
    
    const interpretedIntent = await parseQueryIntent(message, recruiterMemory);
    
    const expandedQuery = await expandQuery(interpretedIntent, recruiterMemory);
    
    const aiAvailable = await isAiServiceAvailable();
    
    let semanticResults = [];
    let keywordResults = [];
    
    if (aiAvailable && expandedQuery.semanticQuery) {
      try {
        const semanticSearchResults = await semanticSearch({
          query: expandedQuery.semanticQuery,
          recruiterId: null,
          topK: expandedQuery.topK * 2,
          scoreThreshold: expandedQuery.scoreThreshold || 0.3,
          filters: expandedQuery.filters
        });
        semanticResults = semanticSearchResults.results || [];
      } catch (error) {
        console.warn("Semantic search failed in copilot:", error.message);
      }
    }
    
    const mongoQuery = buildMongoQuery(expandedQuery);
    keywordResults = await SourcingCandidate.find(mongoQuery)
      .select("-parsedText")
      .limit(expandedQuery.topK * 2)
      .lean();
    
    const rankedCandidates = await rankCandidates(
      semanticResults,
      keywordResults,
      expandedQuery,
      recruiterMemory,
      {
        aiAvailable,
        queryType: interpretedIntent.type,
        recruiterId
      }
    );
    
    const recommendations = generateRecommendations(
      rankedCandidates,
      interpretedIntent,
      recruiterMemory
    );
    
    const processingTime = Date.now() - startTime;
    
    return {
      interpretedIntent,
      appliedFilters: expandedQuery.filters,
      expandedSkills: expandedQuery.expandedSkills,
      expandedQuery: expandedQuery.semanticQuery,
      candidates: rankedCandidates.slice(0, expandedQuery.topK),
      recommendations,
      insights: {
        totalCandidatesEvaluated: semanticResults.length + keywordResults.length,
        semanticMatches: semanticResults.length,
        keywordMatches: keywordResults.length,
        processingTimeMs: processingTime,
        searchMode: aiAvailable ? 'hybrid' : 'keyword',
        confidence: calculateConfidence(interpretedIntent, rankedCandidates)
      },
      suggestions: generateSuggestions(interpretedIntent, rankedCandidates, recruiterMemory)
    };
    
  } catch (error) {
    console.error("Error processing copilot query:", error);
    throw new Error(`Copilot processing failed: ${error.message}`);
  }
}

function buildMongoQuery(expandedQuery) {
  const query = {};
  
  if (expandedQuery.filters?.skills?.length) {
    query.skills = { $in: expandedQuery.filters.skills.map(skill => new RegExp(skill, 'i')) };
  }
  
  if (expandedQuery.filters?.designation) {
    query.designation = { $regex: expandedQuery.filters.designation, $options: 'i' };
  }
  
  if (expandedQuery.filters?.location) {
    const isRemote = /\b(remote|wfh|work from home|hybrid)\b/i.test(expandedQuery.filters.location);
    if (isRemote) {
      query.$or = [
        { location: { $regex: /remote|wfh|work from home/i } },
        { location: { $regex: expandedQuery.filters.location, $options: 'i' } }
      ];
    } else {
      query.location = { $regex: expandedQuery.filters.location, $options: 'i' };
    }
  }
  
  if (expandedQuery.filters?.experience) {
    const expRange = parseExperienceRange(expandedQuery.filters.experience);
    if (expRange.min !== null || expRange.max !== null) {
      query.totalExperience = {};
      if (expRange.min !== null) query.totalExperience.$gte = expRange.min;
      if (expRange.max !== null) query.totalExperience.$lte = expRange.max;
    }
  }
  
  if (expandedQuery.filters?.industry) {
    query.industry = { $regex: expandedQuery.filters.industry, $options: 'i' };
  }
  
  if (expandedQuery.filters?.seniority) {
    query.seniority = { $regex: expandedQuery.filters.seniority, $options: 'i' };
  }
  
  return query;
}

function parseExperienceRange(experienceText) {
  const rangeMatch = experienceText.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  }

  const plusMatch = experienceText.match(/(\d+)\+?/);
  if (plusMatch) {
    return { min: parseInt(plusMatch[1]), max: null };
  }

  const exactMatch = experienceText.match(/(\d+)/);
  if (exactMatch) {
    const years = parseInt(exactMatch[1]);
    return { min: years, max: years };
  }

  return { min: null, max: null };
}

function generateRecommendations(candidates, intent, memory) {
  const recommendations = {
    hiddenGems: [],
    adjacentSkills: [],
    startupExperience: [],
    highSemanticMatch: []
  };
  
  candidates.forEach((candidate, index) => {
    if (candidate._scores?.semantic >= 0.8) {
      recommendations.highSemanticMatch.push({
        ...candidate,
        reason: "Strong semantic similarity to your search"
      });
    }
    
    if (candidate.currentCompany && 
        (candidate.currentCompany.toLowerCase().includes('startup') || 
         candidate.currentCompany.toLowerCase().includes('inc') ||
         candidate.currentCompany.toLowerCase().includes('llc'))) {
      recommendations.startupExperience.push({
        ...candidate,
        reason: "Has startup experience"
      });
    }
    
    if (index > candidates.length * 0.7 && candidate._scores?.semantic >= 0.6) {
      recommendations.hiddenGems.push({
        ...candidate,
        reason: "Hidden gem with good semantic match"
      });
    }
  });
  
  return recommendations;
}

function generateSuggestions(intent, candidates, memory) {
  const suggestions = [];
  
  if (candidates.length < 5) {
    suggestions.push("Try broadening your search with related skills or experience levels");
  }
  
  if (intent.filters?.skills?.length === 0) {
    suggestions.push("Add specific skills to get more relevant results");
  }
  
  if (!intent.filters?.location) {
    suggestions.push("Specify a location or 'remote' for better matches");
  }
  
  const avgScore = candidates.reduce((sum, c) => sum + (c._scores?.total || 0), 0) / candidates.length;
  if (avgScore < 0.5) {
    suggestions.push("Consider adjusting your search criteria for better matches");
  }
  
  return suggestions;
}

function calculateConfidence(intent, candidates) {
  if (candidates.length === 0) return 0;
  
  let confidence = 0.5;
  
  if (intent.confidence) confidence += intent.confidence * 0.3;
  
  const avgScore = candidates.reduce((sum, c) => sum + (c._scores?.total || 0), 0) / candidates.length;
  confidence += avgScore * 0.2;
  
  return Math.min(1, confidence);
}
