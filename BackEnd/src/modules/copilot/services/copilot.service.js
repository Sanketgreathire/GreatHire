import { parseQueryIntent } from "./queryIntentParser.service.js";
import { expandQuery } from "./queryExpansion.service.js";
import { rankCandidates } from "./copilotRanking.service.js";
import {
  semanticSearch,
  isAiServiceAvailable,
} from "../../../../sourcing/ai/aiServiceClient.js";
import { User } from "../../../../models/user.model.js";
import { getRecruiterMemory } from "../../../models/recruiterMemory.model.js";

const CANDIDATE_FIELDS =
  "fullname profile.skills profile.experiences profile.qualification address.city address.state address.country profile.hasExperience updatedAt";

export async function processCopilotQuery(
  message,
  recruiterId,
  context = {}
) {
  try {
    const startTime = Date.now();
    const normalizedMessage = String(message || "").trim().toLowerCase();

    // Handle greetings before candidate search.
    const isGreeting =
      /^(hi|hello|hey|hii|hiii|good morning|good afternoon|good evening)[!.?\s]*$/i.test(
        normalizedMessage
      );

    if (isGreeting) {
      return {
        type: "greeting",
        reply:
          "Hello! I'm GreatHire AI Copilot. Tell me what kind of candidates you're looking for, and I'll help you find suitable profiles.",
        candidates: [],
        recommendations: {
          hiddenGems: [],
          adjacentSkills: [],
          startupExperience: [],
          highSemanticMatch: [],
        },
        insights: {
          totalCandidatesEvaluated: 0,
          semanticMatches: 0,
          keywordMatches: 0,
          processingTimeMs: Date.now() - startTime,
          searchMode: "keyword",
          confidence: 1,
        },
        suggestions: [
          "Find Data Analysts with SQL and Power BI",
          "Find remote React developers",
        ],
      };
    }

    // Initialize these BEFORE using them.
    let semanticResults = [];
    let keywordResults = [];

    // Search actual student profiles in the User collection.
    const totalInDb = await User.countDocuments({ role: "student" });

    console.log(
      `[Copilot Debug] Total student profiles in DB: ${totalInDb}`
    );

    const recruiterMemory = await getRecruiterMemory(recruiterId);
    const interpretedIntent = await parseQueryIntent(
      message,
      recruiterMemory
    );
    const expandedQuery = await expandQuery(
      interpretedIntent,
      recruiterMemory
    );

    
console.log("[Copilot Debug] Interpreted intent:", JSON.stringify(interpretedIntent, null, 2));
console.log("[Copilot Debug] Expanded filters:", JSON.stringify(expandedQuery.filters, null, 2));
console.log("[Copilot Debug] Expanded skills:", JSON.stringify(expandedQuery.expandedSkills, null, 2));

    const topK = Math.max(
      1,
      Number.parseInt(expandedQuery?.topK, 10) || 10
    );

    const aiAvailable = await isAiServiceAvailable();

    // 1. Semantic search.
    if (aiAvailable && expandedQuery?.semanticQuery) {
      try {
        const semanticSearchResults = await semanticSearch({
          query: expandedQuery.semanticQuery,
          recruiterId: null,
          topK: topK * 2,
          scoreThreshold: expandedQuery.scoreThreshold || 0.3,
          filters: expandedQuery.filters,
        });

        semanticResults = Array.isArray(semanticSearchResults?.results)
          ? semanticSearchResults.results
          : [];

        console.log(
          `[Copilot Debug] Semantic results count: ${semanticResults.length}`
        );
      } catch (error) {
        console.warn(
          "[Copilot Debug] Semantic search failed:",
          error.message
        );
      }
    }

    // 2. Strict keyword search using the actual User schema.
    const mongoQuery = buildMongoQuery(expandedQuery);

    console.log(
      "[Copilot Debug] Strict query:",
      JSON.stringify(mongoQuery)
    );

    keywordResults = await User.find(mongoQuery)
      .select(CANDIDATE_FIELDS)
      .limit(topK * 2)
      .lean();

    console.log(
      `[Copilot Debug] Strict query results count: ${keywordResults.length}`
    );

    // 3. Fallback search if strict search returns no results.
    if (keywordResults.length === 0 && semanticResults.length === 0) {
      console.log(
        "[Copilot Debug] Strict search returned 0. Trying fallback query..."
      );

      const fallbackQuery = buildFallbackMongoQuery(expandedQuery);

      keywordResults = await User.find(fallbackQuery)
        .select(CANDIDATE_FIELDS)
        .limit(topK * 2)
        .lean();

      console.log(
        `[Copilot Debug] Fallback query results count: ${keywordResults.length}`
      );
    }

    // 4. Safety net: return student profiles if no search matched.
    if (
      keywordResults.length === 0 &&
      semanticResults.length === 0 &&
      totalInDb > 0
    ) {
      console.log(
        "[Copilot Debug] No matches found. Fetching sample student profiles..."
      );

      keywordResults = await User.find({ role: "student" })
        .select(CANDIDATE_FIELDS)
        .limit(topK)
        .lean();

      console.log(
        `[Copilot Debug] Safety-net results count: ${keywordResults.length}`
      );
    }

    // 5. Rank the candidates.
    const rankedCandidates = await rankCandidates(
      semanticResults,
      keywordResults,
      expandedQuery,
      recruiterMemory,
      {
        aiAvailable,
        queryType: interpretedIntent.type,
        recruiterId,
      }
    );

    const safeCandidates = Array.isArray(rankedCandidates)
      ? rankedCandidates
      : [];

    const recommendations = generateRecommendations(
      safeCandidates,
      interpretedIntent,
      recruiterMemory
    );

    const processingTime = Date.now() - startTime;

    return {
      interpretedIntent,
      appliedFilters: expandedQuery.filters,
      expandedSkills: expandedQuery.expandedSkills,
      expandedQuery: expandedQuery.semanticQuery,
      candidates: safeCandidates.slice(0, topK),
      recommendations,
      insights: {
        totalCandidatesEvaluated:
          keywordResults.length + semanticResults.length,
        semanticMatches: semanticResults.length,
        keywordMatches: keywordResults.length,
        processingTimeMs: processingTime,
        searchMode:
          aiAvailable && semanticResults.length > 0
            ? "hybrid"
            : "keyword",
        confidence: calculateConfidence(
          interpretedIntent,
          safeCandidates
        ),
      },
      suggestions: generateSuggestions(
        interpretedIntent,
        safeCandidates,
        recruiterMemory
      ),
    };
  } catch (error) {
    console.error("Error processing copilot query:", error);

    throw new Error(`Copilot processing failed: ${error.message}`);
  }
}

/**
 * Build a strict MongoDB query using the real User schema.
 */
function buildMongoQuery(expandedQuery = {}) {
  const conditions = [];
  const filters = expandedQuery.filters || {};

  
  // Skills: require every requested skill to match.
  if (Array.isArray(filters.skills) && filters.skills.length > 0) {
    const skillConditions = filters.skills
      .filter((skill) => typeof skill === "string" && skill.trim())
      .map((skill) => ({
        "profile.skills": new RegExp(escapeRegex(skill.trim()), "i"),
      }));

    conditions.push(...skillConditions);
  }

  // Designation.
  if (
    typeof filters.designation === "string" &&
    filters.designation.trim()
  ) {
    conditions.push({
      "profile.experiences.jobProfile": new RegExp(
        escapeRegex(filters.designation.trim()),
        "i"
      ),
    });
  }

  // Location.
  if (typeof filters.location === "string" && filters.location.trim()) {
    const location = filters.location.trim();
    const isRemote = /\b(remote|wfh|work from home|hybrid)\b/i.test(
      location
    );

    // The User schema has no confirmed remote-work field.
    // Do not filter out candidates by address for remote searches.
    if (!isRemote) {
      const locationRegex = new RegExp(escapeRegex(location), "i");

      conditions.push({
        $or: [
          { "address.city": locationRegex },
          { "address.state": locationRegex },
          { "address.country": locationRegex },
        ],
      });
    }
  }

  // Only search job-seeker/student profiles.
  conditions.push({ role: "student" });

  return { $and: conditions };
}

/**
 * Build a broader fallback query.
 */
function buildFallbackMongoQuery(expandedQuery = {}) {
  const filters = expandedQuery.filters || {};
  const fallbackConditions = [];

  if (Array.isArray(filters.skills)) {
    for (const skill of filters.skills) {
      if (typeof skill === "string" && skill.trim()) {
        fallbackConditions.push({
          "profile.skills": new RegExp(
            escapeRegex(skill.trim()),
            "i"
          ),
        });
      }
    }
  }

  if (
    typeof filters.designation === "string" &&
    filters.designation.trim()
  ) {
    fallbackConditions.push({
      "profile.experiences.jobProfile": new RegExp(
        escapeRegex(filters.designation.trim()),
        "i"
      ),
    });
  }

  if (typeof filters.location === "string" && filters.location.trim()) {
    const location = filters.location.trim();
    const isRemote = /\b(remote|wfh|work from home|hybrid)\b/i.test(
      location
    );

    if (!isRemote) {
      const locationRegex = new RegExp(escapeRegex(location), "i");

      fallbackConditions.push({
        $or: [
          { "address.city": locationRegex },
          { "address.state": locationRegex },
          { "address.country": locationRegex },
        ],
      });
    }
  }

  // Never include recruiters or admins in fallback results.
  if (fallbackConditions.length === 0) {
    return { role: "student" };
  }

  
return {
  role: "student",
  $and: fallbackConditions,
};
}

/**
 * Escape user-provided text before using it in a regular expression.
 */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generateRecommendations(
  candidates = [],
  intent = {},
  memory = {}
) {
  const highSemanticMatch = candidates.filter(
    (candidate) => (candidate._scores?.semantic || 0) >= 0.8
  );

  const startupExperience = candidates.filter((candidate) => {
    const experiences = Array.isArray(candidate.profile?.experiences)
      ? candidate.profile.experiences
      : [];

    return experiences.some((experience) => {
      const company = String(experience.companyName || "").toLowerCase();

      return (
        company.includes("startup") ||
        company.includes("inc") ||
        company.includes("llc")
      );
    });
  });

  return {
    hiddenGems: candidates.slice(-3),
    adjacentSkills: [],
    startupExperience,
    highSemanticMatch,
  };
}

function generateSuggestions(
  intent = {},
  candidates = [],
  memory = {}
) {
  const suggestions = [];

  if (candidates.length === 0) {
    suggestions.push(
      "Try broader skill sets like SQL, Java, Python, or React."
    );
    suggestions.push(
      "Try removing location restrictions or using a different location."
    );
  } else if (candidates.length < 5) {
    suggestions.push(
      "Try broadening your search with related skills or experience levels."
    );
  }

  return suggestions;
}

function calculateConfidence(intent = {}, candidates = []) {
  if (!candidates.length) {
    return 0;
  }

  const intentConfidence = Number(intent.confidence) || 0;

  return Math.min(1, Math.max(0.5, 0.5 + intentConfidence * 0.3));
}

