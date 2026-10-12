import { User } from "../../../../models/user.model.js";
import { getRecruiterMemory } from "../../../models/recruiterMemory.model.js";
import { getRecruiterInteractions } from "./interactionTracking.service.js";

const SEMANTIC_WEIGHT = 0.4;
const SKILL_WEIGHT = 0.3;
const EXPERIENCE_WEIGHT = 0.15;
const ADAPTIVE_WEIGHT = 0.15;

const CANDIDATE_FIELDS =
  "fullname profile.skills profile.experiences profile.qualification address.city address.state address.country profile.hasExperience updatedAt";

const TECHNOLOGY_STACK_MAP = {
  javascript: [
    "react", "vue", "angular", "node.js", "express", "next.js",
    "nuxt", "typescript", "webpack", "babel", "jest", "cypress",
  ],
  python: [
    "django", "flask", "fastapi", "pandas", "numpy",
    "scikit-learn", "tensorflow", "pytorch", "jupyter",
    "airflow", "celery",
  ],
  java: [
    "spring boot", "spring framework", "maven", "gradle",
    "hibernate", "junit", "mockito", "microservices", "rest apis",
  ],
  react: [
    "next.js", "redux", "mobx", "react router", "jest",
    "enzyme", "react testing library", "material-ui", "ant design",
  ],
  "node.js": [
    "express", "koa", "nest.js", "fastify", "socket.io",
    "sequelize", "mongoose", "prisma", "jwt", "oauth",
  ],
  aws: [
    "ec2", "s3", "lambda", "rds", "dynamodb", "cloudfront",
    "api gateway", "cloudformation", "terraform", "serverless",
  ],
  docker: [
    "kubernetes", "docker compose", "containerization",
    "microservices", "devops", "ci/cd", "jenkins", "gitlab ci",
  ],
  "machine learning": [
    "tensorflow", "pytorch", "scikit-learn", "keras",
    "deep learning", "neural networks", "mlops", "model deployment",
  ],
  microservices: [
    "rest apis", "graphql", "kubernetes", "docker",
    "service mesh", "api gateway", "load balancing",
    "distributed systems",
  ],
};

// Escape text before using it inside a regular expression.
function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCandidateSkills(candidate) {
  return Array.isArray(candidate?.profile?.skills)
    ? candidate.profile.skills
    : [];
}

function getCandidateExperiences(candidate) {
  return Array.isArray(candidate?.profile?.experiences)
    ? candidate.profile.experiences
    : [];
}

function getLatestExperience(candidate) {
  const experiences = getCandidateExperiences(candidate);
  return experiences.length ? experiences[experiences.length - 1] : {};
}

function getCandidateLocation(candidate) {
  return [
    candidate?.address?.city,
    candidate?.address?.state,
    candidate?.address?.country,
  ]
    .filter(Boolean)
    .join(", ");
}

// Supports durations such as "2 years", "3.5 years",
// "2 years 6 months", and date ranges such as "2021 - 2024".
function parseExperienceDuration(duration) {
  if (typeof duration !== "string" || !duration.trim()) {
    return 0;
  }

  const text = duration.trim();

  const yearRange = text.match(
    /\b(19\d{2}|20\d{2})\s*(?:-|–|to)\s*(present|current|19\d{2}|20\d{2})\b/i
  );

  if (yearRange) {
    const startYear = Number(yearRange[1]);
    const endYear = /present|current/i.test(yearRange[2])
      ? new Date().getFullYear()
      : Number(yearRange[2]);

    return Math.max(0, endYear - startYear);
  }

  const yearsMatch = text.match(/(\d+(?:\.\d+)?)\s*years?/i);
  const monthsMatch = text.match(/(\d+(?:\.\d+)?)\s*months?/i);

  if (yearsMatch || monthsMatch) {
    const years = yearsMatch ? Number(yearsMatch[1]) : 0;
    const months = monthsMatch ? Number(monthsMatch[1]) : 0;

    return years + months / 12;
  }

  return 0;
}

function getCandidateExperience(candidate) {
  return getCandidateExperiences(candidate).reduce(
    (total, experience) =>
      total + parseExperienceDuration(experience.duration),
    0
  );
}

function getExperienceRange(experience) {
  if (experience < 2) return "entry";
  if (experience < 5) return "junior";
  if (experience < 10) return "mid";
  if (experience < 15) return "senior";
  return "lead";
}

function getInteractionWeight(interactionType) {
  const weights = {
    viewed: 1,
    shortlisted: 3,
    contacted: 5,
    interviewed: 4,
    rejected: -2,
  };

  return weights[interactionType] || 0;
}

export async function rankCandidates(
  semanticResults = [],
  keywordResults = [],
  expandedQuery = {},
  recruiterMemory = {},
  options = {}
) {
  const {
    aiAvailable = false,
    queryType = "search",
    recruiterId,
  } = options;

  const semanticMap = new Map(
    (semanticResults || []).map((result) => [
      String(result.candidate_id || result._id),
      result.score ?? 0.8,
    ])
  );

  const keywordMap = new Map(
    (keywordResults || []).map((candidate) => [
      String(candidate._id),
      1,
    ])
  );

  const allIds = new Set([
    ...keywordMap.keys(),
    ...semanticMap.keys(),
  ]);

  const ranked = [];
  let recruiterInteractions = [];

  if (recruiterId) {
    try {
      const interactions = await getRecruiterInteractions(recruiterId);

      recruiterInteractions = Array.isArray(interactions)
        ? interactions
        : [];
    } catch (error) {
      console.warn(
        "Could not fetch recruiter interactions:",
        error.message
      );
    }
  }

  const adaptivePreferences = calculateAdaptivePreferences(
    recruiterMemory || {},
    recruiterInteractions
  );

  for (const candidateId of allIds) {
    // Prefer the actual User document returned by keyword search.
    let candidate = (keywordResults || []).find(
      (item) => String(item._id) === candidateId
    );

    // Resolve semantic-only IDs against User, not SourcingCandidate.
    if (!candidate) {
      try {
        candidate = await User.findOne({
          _id: candidateId,
          role: "student",
        })
          .select(CANDIDATE_FIELDS)
          .lean();
      } catch (error) {
        console.warn(
          `Could not fetch student profile ${candidateId}:`,
          error.message
        );
        continue;
      }
    }

    if (!candidate || candidate.role && candidate.role !== "student") {
      continue;
    }

    const candidateSkills = getCandidateSkills(candidate);
    const candidateExp = getCandidateExperience(candidate);

    const requiredSkills =
      expandedQuery.filters?.skills ||
      expandedQuery.expandedSkills ||
      [];

    const semScore = semanticMap.get(candidateId) ?? 0.5;

    const skillScore = calculateSkillScore(
      candidateSkills,
      requiredSkills
    );

    const expScore = calculateExperienceScore(
      candidateExp,
      expandedQuery.filters?.experience ?? expandedQuery.experience
    );

    const adaptiveScore = calculateAdaptiveScore(
      candidate,
      adaptivePreferences,
      recruiterInteractions
    );

    const totalScore = aiAvailable
      ? SEMANTIC_WEIGHT * semScore +
        SKILL_WEIGHT * skillScore +
        EXPERIENCE_WEIGHT * expScore +
        ADAPTIVE_WEIGHT * adaptiveScore
      : 0.5 * skillScore +
        0.3 * expScore +
        0.2 * adaptiveScore;

    const { matchedSkills, missingSkills } = analyzeSkillMatch(
      candidateSkills,
      requiredSkills
    );

   ranked.push({
  ...candidate,

  // Keep a consistent name field for the frontend.
  fullname:
    candidate.fullname ||
    candidate.fullName ||
    candidate.name ||
    "Unnamed candidate",

  name:
    candidate.fullname ||
    candidate.fullName ||
    candidate.name ||
    "Unnamed candidate",

      _scores: {
        semantic: +semScore.toFixed(4),
        skill: +skillScore.toFixed(4),
        experience: +expScore.toFixed(4),
        adaptive: +adaptiveScore.toFixed(4),
        total: +totalScore.toFixed(4),
        hybrid: +totalScore.toFixed(4),
      },

      _insights: {
        matchQuality: getMatchQuality(totalScore),
        skillMatchPercentage: getSkillMatchPercentage(
          matchedSkills,
          missingSkills
        ),
        recommendationReason: getRecommendationReason(
          candidate,
          semScore,
          skillScore,
          adaptiveScore,
          queryType
        ),
        riskFactors: identifyRiskFactors(candidate),
        strengths: identifyStrengths(candidate),
      },

      matchedSkills,
      missingSkills,

      _metadata: {
        source:
          semanticMap.has(candidateId) && keywordMap.has(candidateId)
            ? "both"
            : semanticMap.has(candidateId)
              ? "semantic"
              : "keyword",

        interactionCount: recruiterInteractions.filter(
          (interaction) =>
            String(interaction.candidateId) === candidateId
        ).length,

        lastInteraction: getLastInteraction(
          candidateId,
          recruiterInteractions
        ),

        isNewCandidate: isNewCandidate(
          candidate,
          recruiterInteractions
        ),
      },
    });
  }

  ranked.sort(
    (a, b) => (b._scores?.hybrid || 0) - (a._scores?.hybrid || 0)
  );

  return ranked;
}

function calculateAdaptivePreferences(
  recruiterMemory,
  recruiterInteractions = []
) {
  const preferences = {
    skills: {},
    experience: {},
    locations: {},
    designations: {},
    companies: {},
  };

  (recruiterMemory.preferences?.skills || []).forEach((skill) => {
    const key = String(skill).toLowerCase();
    preferences.skills[key] = (preferences.skills[key] || 0) + 2;
  });

  recruiterInteractions.forEach((interaction) => {
    const weight = getInteractionWeight(interaction.type);

    (interaction.candidateSkills || []).forEach((skill) => {
      const key = String(skill).toLowerCase();
      preferences.skills[key] = (preferences.skills[key] || 0) + weight;
    });

    if (interaction.candidateExperience !== undefined) {
      const range = getExperienceRange(
        Number(interaction.candidateExperience) || 0
      );

      preferences.experience[range] =
        (preferences.experience[range] || 0) + weight;
    }

    if (interaction.candidateLocation) {
      const key = interaction.candidateLocation.toLowerCase();

      preferences.locations[key] =
        (preferences.locations[key] || 0) + weight;
    }

    if (interaction.candidateDesignation) {
      const key = interaction.candidateDesignation.toLowerCase();

      preferences.designations[key] =
        (preferences.designations[key] || 0) + weight;
    }

    if (interaction.candidateCompany) {
      const key = interaction.candidateCompany.toLowerCase();

      preferences.companies[key] =
        (preferences.companies[key] || 0) + weight;
    }
  });

  return preferences;
}

function calculateAdaptiveScore(
  candidate,
  adaptivePreferences,
  recruiterInteractions = []
) {
  let score = 0.5;

  const skills = getCandidateSkills(candidate);

  if (skills.length > 0) {
    const skillScore =
      skills.reduce((total, skill) => {
        return (
          total +
          (adaptivePreferences.skills[String(skill).toLowerCase()] || 0)
        );
      }, 0) / skills.length;

    score += Math.min(0.3, skillScore / 10);
  }

  const candidateExp = getCandidateExperience(candidate);
  const experienceRange = getExperienceRange(candidateExp);
  const experiencePreference =
    adaptivePreferences.experience[experienceRange] || 0;

  score += Math.min(0.2, Math.max(0, experiencePreference) / 5);

  const location = getCandidateLocation(candidate).toLowerCase();

  if (location) {
    const locationPreference = Object.entries(
      adaptivePreferences.locations
    ).reduce((total, [preferredLocation, weight]) => {
      return location.includes(preferredLocation) ||
        preferredLocation.includes(location)
        ? total + weight
        : total;
    }, 0);

    score += Math.min(0.15, Math.max(0, locationPreference) / 3);
  }

  const designation = String(
    getLatestExperience(candidate).jobProfile || ""
  ).toLowerCase();

  if (designation) {
    const designationPreference = Object.entries(
      adaptivePreferences.designations
    ).reduce((total, [preferredDesignation, weight]) => {
      return designation.includes(preferredDesignation) ||
        preferredDesignation.includes(designation)
        ? total + weight
        : total;
    }, 0);

    score += Math.min(
      0.15,
      Math.max(0, designationPreference) / 3
    );
  }

  const candidateId = String(candidate._id);

  const previousInteractions = recruiterInteractions.filter(
    (interaction) => String(interaction.candidateId) === candidateId
  );

  if (previousInteractions.length > 0) {
    const latestInteraction =
      previousInteractions[previousInteractions.length - 1];

    if (
      latestInteraction.type === "shortlisted" ||
      latestInteraction.type === "contacted"
    ) {
      score += 0.1;
    } else if (latestInteraction.type === "rejected") {
      score -= 0.2;
    }
  }

  return Math.max(0, Math.min(1, score));
}

function calculateSkillScore(candidateSkills = [], requiredSkills = []) {
  if (!requiredSkills.length) return 0.8;
  if (!candidateSkills.length) return 0.3;

  const candidateSkillsLower = candidateSkills.map((skill) =>
    String(skill).toLowerCase()
  );

  const requiredSkillsLower = requiredSkills.map((skill) =>
    String(skill).toLowerCase()
  );

  const matchedSkills = requiredSkillsLower.filter((requiredSkill) =>
    candidateSkillsLower.some(
      (candidateSkill) =>
        candidateSkill.includes(requiredSkill) ||
        requiredSkill.includes(candidateSkill)
    )
  );

  return matchedSkills.length / requiredSkillsLower.length;
}

function calculateExperienceScore(candidateExp, requiredExp) {
  if (requiredExp === undefined || requiredExp === null || requiredExp === "") {
    return 0.8;
  }

  const text = String(requiredExp);

  const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);

  if (rangeMatch) {
    const min = Number(rangeMatch[1]);
    const max = Number(rangeMatch[2]);

    if (candidateExp >= min && candidateExp <= max) return 1;

    if (candidateExp < min) {
      return Math.max(0.2, candidateExp / Math.max(min, 1));
    }

    return Math.max(
      0.5,
      1 - ((candidateExp - max) / Math.max(max, 1)) * 0.3
    );
  }

  const plusMatch = text.match(/(\d+(?:\.\d+)?)\s*\+/);

  if (plusMatch) {
    const min = Number(plusMatch[1]);

    return candidateExp >= min
      ? 1
      : Math.max(0.2, candidateExp / Math.max(min, 1));
  }

  const exactMatch = text.match(/(\d+(?:\.\d+)?)/);

  if (exactMatch) {
    const required = Number(exactMatch[1]);

    return candidateExp >= required
      ? 1
      : Math.max(0.2, candidateExp / Math.max(required, 1));
  }

  return 0.7;
}

function analyzeSkillMatch(candidateSkills = [], requiredSkills = []) {
  const candidateSkillsLower = candidateSkills.map((skill) =>
    String(skill).toLowerCase()
  );

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((requiredSkill) => {
    const required = String(requiredSkill).toLowerCase();

    const matched = candidateSkills.find((skill) => {
      const value = String(skill).toLowerCase();

      return value.includes(required) || required.includes(value);
    });

    if (matched) {
      matchedSkills.push(matched);
    } else {
      missingSkills.push(required);
    }
  });

  return { matchedSkills, missingSkills };
}

function getMatchQuality(score) {
  if (score >= 0.8) return "excellent";
  if (score >= 0.6) return "good";
  if (score >= 0.4) return "fair";
  return "poor";
}

function getSkillMatchPercentage(matchedSkills, missingSkills) {
  const total = matchedSkills.length + missingSkills.length;

  return total
    ? Math.round((matchedSkills.length / total) * 100)
    : 0;
}

function getRecommendationReason(
  candidate,
  semanticScore,
  skillScore,
  adaptiveScore
) {
  const reasons = [];
  const experience = getCandidateExperience(candidate);
  const company = String(
    getLatestExperience(candidate).companyName || ""
  );

  if (semanticScore >= 0.8) {
    reasons.push("Strong semantic similarity");
  }

  if (skillScore >= 0.8) {
    reasons.push("Excellent skill match");
  }

  if (adaptiveScore >= 0.7) {
    reasons.push("Matches your preferences");
  }

  if (experience >= 10) {
    reasons.push("Extensive experience");
  }

  if (/startup/i.test(company)) {
    reasons.push("Startup experience");
  }

  if (!reasons.length) {
    reasons.push("Potential match");
  }

  return reasons.join(", ");
}

function identifyRiskFactors(candidate) {
  const risks = [];
  const skills = getCandidateSkills(candidate);
  const experience = getCandidateExperience(candidate);

  if (!skills.length) {
    risks.push("No skills listed");
  }

  if (experience < 1) {
    risks.push("Limited experience");
  }

  if (!getCandidateLocation(candidate)) {
    risks.push("Location not specified");
  }

  return risks;
}

function identifyStrengths(candidate) {
  const strengths = [];
  const skills = getCandidateSkills(candidate);
  const experience = getCandidateExperience(candidate);

  if (experience >= 5) {
    strengths.push("Experienced professional");
  }

  if (skills.length >= 8) {
    strengths.push("Broad skill set");
  }

  return strengths;
}

function getLastInteraction(candidateId, recruiterInteractions = []) {
  const interactions = recruiterInteractions
    .filter((item) => String(item.candidateId) === candidateId)
    .sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

  return interactions[0] || null;
}

function isNewCandidate(candidate, recruiterInteractions = []) {
  const candidateId = String(candidate._id);

  return !recruiterInteractions.some(
    (interaction) => String(interaction.candidateId) === candidateId
  );
}

export async function getPersonalizedRecommendations(
  recruiterId,
  options = {}
) {
  const { type = "all", limit = 10 } = options;

  const recruiterMemory = await getRecruiterMemory(recruiterId);

  let recruiterInteractions = [];

  try {
    const interactions = await getRecruiterInteractions(recruiterId);

    recruiterInteractions = Array.isArray(interactions)
      ? interactions
      : [];
  } catch (error) {
    console.warn(
      "Could not fetch recruiter interactions:",
      error.message
    );
  }

  const recommendations = {
    hiddenGems: [],
    adjacentSkills: [],
    startupExperience: [],
    highSemanticMatch: [],
    recentActivity: [],
  };

  if (type === "all" || type === "hiddenGems") {
    recommendations.hiddenGems = await getHiddenGemCandidates(
      recruiterInteractions,
      limit
    );
  }

  if (type === "all" || type === "adjacentSkills") {
    recommendations.adjacentSkills = await getAdjacentSkillCandidates(
      recruiterMemory,
      recruiterInteractions,
      limit
    );
  }

  if (type === "all" || type === "startupExperience") {
    recommendations.startupExperience = await getStartupExperienceCandidates(
      recruiterInteractions,
      limit
    );
  }

  if (type === "all" || type === "highSemanticMatch") {
    recommendations.highSemanticMatch = await getHighSemanticMatchCandidates(
      recruiterMemory,
      limit
    );
  }

  if (type === "all" || type === "recentActivity") {
    recommendations.recentActivity = await getRecentActivityCandidates(
      recruiterInteractions,
      limit
    );
  }

  return recommendations;
}

async function getHiddenGemCandidates(
  recruiterInteractions = [],
  limit = 10
) {
  const interactedIds = recruiterInteractions.map(
    (interaction) => interaction.candidateId
  );

  const candidates = await User.find({
    role: "student",
    _id: { $nin: interactedIds },
    "profile.skills.0": { $exists: true },
  })
    .select(CANDIDATE_FIELDS)
    .limit(limit * 2)
    .lean();

  return candidates.slice(0, limit).map((candidate) => ({
    ...candidate,
    reason: "Hidden gem - not previously viewed",
    _metadata: {
      isNew: true,
      interactionCount: 0,
    },
  }));
}

async function getAdjacentSkillCandidates(
  recruiterMemory,
  recruiterInteractions = [],
  limit = 10
) {
  const preferredSkills = recruiterMemory.preferences?.skills || [];

  if (!preferredSkills.length) return [];

  const adjacentSkills = [];

  preferredSkills.forEach((skill) => {
    const stack = TECHNOLOGY_STACK_MAP[String(skill).toLowerCase()] || [];
    adjacentSkills.push(...stack);
  });

  if (!adjacentSkills.length) return [];

  const candidates = await User.find({
    role: "student",
    "profile.skills": {
      $in: adjacentSkills.map(
        (skill) => new RegExp(`^${escapeRegex(skill)}$`, "i")
      ),
    },
    _id: {
      $nin: recruiterInteractions
        .map((interaction) => interaction.candidateId)
        .slice(-20),
    },
  })
    .select(CANDIDATE_FIELDS)
    .limit(limit)
    .lean();

  return candidates.map((candidate) => ({
    ...candidate,
    reason: "Adjacent skills to your preferences",
  }));
}

async function getStartupExperienceCandidates(
  recruiterInteractions = [],
  limit = 10
) {
  const candidates = await User.find({
    role: "student",
    "profile.experiences.companyName": {
      $regex: /startup|inc|llc|technologies|solutions/i,
    },
    _id: {
      $nin: recruiterInteractions
        .map((interaction) => interaction.candidateId)
        .slice(-10),
    },
  })
    .select(CANDIDATE_FIELDS)
    .limit(limit)
    .lean();

  return candidates.map((candidate) => ({
    ...candidate,
    reason: "Startup experience",
  }));
}

async function getHighSemanticMatchCandidates(
  recruiterMemory,
  limit = 10
) {
  const preferredSkills = recruiterMemory.preferences?.skills || [];

  if (!preferredSkills.length) return [];

  const candidates = await User.find({
    role: "student",
    "profile.skills": {
      $in: preferredSkills.map(
        (skill) =>
          new RegExp(`^${escapeRegex(skill)}$`, "i")
      ),
    },
  })
    .select(CANDIDATE_FIELDS)
    .limit(limit)
    .lean();

  return candidates.map((candidate) => ({
    ...candidate,
    reason: "High semantic match to your preferences",
  }));
}

async function getRecentActivityCandidates(
  recruiterInteractions = [],
  limit = 10
) {
  const recentInteractions = [...recruiterInteractions]
    .sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    )
    .slice(0, limit);

  const candidateIds = recentInteractions
    .map((interaction) => interaction.candidateId)
    .filter(Boolean);

  if (!candidateIds.length) return [];

  const candidates = await User.find({
    role: "student",
    _id: { $in: candidateIds },
  })
    .select(CANDIDATE_FIELDS)
    .lean();

  return candidates.map((candidate) => {
    const interaction = recentInteractions.find(
      (item) => String(item.candidateId) === String(candidate._id)
    );

    return {
      ...candidate,
      reason: `Recently ${interaction?.type || "interacted"}`,
      _metadata: {
        lastInteraction: interaction || null,
        interactionType: interaction?.type || null,
      },
    };
  });
}