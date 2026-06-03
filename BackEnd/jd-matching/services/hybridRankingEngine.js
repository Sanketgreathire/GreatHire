/**
 * hybridRankingEngine.js
 * Combines semantic (Qdrant), keyword (MongoDB), and content-based signals
 * for superior candidate ranking across JD matching pipeline.
 * 
 * Ranking Signals:
 * 1. Semantic similarity (vector cosine distance)
 * 2. Keyword match frequency (TF-IDF inspired)
 * 3. Skill overlap coefficient
 * 4. Experience relevance
 * 5. Recent activity/freshness
 * 6. Engagement score (application history)
 * 7. Location proximity
 * 8. Seniority alignment
 */

const HYBRID_WEIGHTS = {
  semantic:         0.25,  // Vector similarity
  keyword:          0.20,  // Keyword coverage
  skillOverlap:     0.20,  // Exact skill matches
  experience:       0.15,  // Experience alignment
  freshness:        0.08,  // Profile recency
  seniority:        0.07,  // Seniority match
  location:         0.05,  // Location proximity
};

/**
 * Compute hybrid rank score combining multiple signals.
 * @param {Object} candidate - SourcingCandidate document
 * @param {Object} parsedJd - Parsed job description
 * @param {number} semanticScore - Cosine similarity from Qdrant (0-1)
 * @param {Object} keywordMetrics - Keyword match data
 * @returns {number} - Composite hybrid score (0-1)
 */
export function computeHybridRankScore(candidate, parsedJd, semanticScore = 0, keywordMetrics = {}) {
  const scores = {
    semantic:      Math.min(1, semanticScore * 1.2),  // Boost semantic
    keyword:       computeKeywordScore(candidate, parsedJd, keywordMetrics),
    skillOverlap:  computeSkillOverlapCoefficient(candidate, parsedJd),
    experience:    computeExperienceRelevance(candidate, parsedJd),
    freshness:     computeFreshnessScore(candidate),
    seniority:     computeSeniorityAlignment(candidate, parsedJd),
    location:      computeLocationProximity(candidate, parsedJd),
  };

  // Weighted combination
  const hybridScore = Object.entries(HYBRID_WEIGHTS).reduce((sum, [key, weight]) => {
    return sum + (scores[key] || 0) * weight;
  }, 0);

  return {
    hybridScore:    Math.min(1, Math.max(0, hybridScore)),
    signalScores:   scores,
    explanation:    buildScoreExplanation(scores),
  };
}

/**
 * Keyword match score using frequency-based approach.
 */
function computeKeywordScore(candidate, parsedJd, keywordMetrics = {}) {
  if (!keywordMetrics.totalKeywords) return 0;

  const matchedKeywords = keywordMetrics.matchedKeywords || 0;
  const coverageScore = matchedKeywords / Math.max(1, keywordMetrics.totalKeywords);

  // Bonus for matching in high-importance fields
  let fieldBonus = 0;
  if (candidate.designation && parsedJd.designation) {
    if (candidate.designation.toLowerCase().includes(parsedJd.designation.toLowerCase())) {
      fieldBonus += 0.15;
    }
  }
  if (candidate.location && parsedJd.location) {
    if (candidate.location.toLowerCase() === parsedJd.location.toLowerCase()) {
      fieldBonus += 0.10;
    }
  }

  return Math.min(1, coverageScore + fieldBonus);
}

/**
 * Skill overlap Jaccard coefficient: intersection / union
 */
function computeSkillOverlapCoefficient(candidate, parsedJd) {
  const candidateSkills = new Set(
    (candidate.normalizedSkills || candidate.skills || []).map((s) => s.toLowerCase())
  );
  const jdSkills = new Set([
    ...(parsedJd.requiredSkills || []),
    ...(parsedJd.preferredSkills || []),
  ].map((s) => s.toLowerCase()));

  if (jdSkills.size === 0) return 0.5;

  const intersection = [...candidateSkills].filter((s) => jdSkills.has(s)).length;
  const union = new Set([...candidateSkills, ...jdSkills]).size;

  return intersection / Math.max(1, union);
}

/**
 * Experience relevance — bonus for exact match, penalty for significant gap.
 */
function computeExperienceRelevance(candidate, parsedJd) {
  const exp = candidate.totalExperience || 0;
  const minExp = parsedJd.minExperience || 0;
  const maxExp = parsedJd.maxExperience || 99;

  if (exp >= minExp && exp <= maxExp) return 1.0;

  if (exp < minExp) {
    const gap = minExp - exp;
    if (gap <= 1) return 0.85;
    if (gap <= 2) return 0.65;
    if (gap <= 3) return 0.40;
    return 0.15;
  }

  // Over-experienced
  const excess = exp - maxExp;
  if (excess <= 2) return 0.90;
  if (excess <= 5) return 0.70;
  return 0.50;
}

/**
 * Freshness score — reward recent profile updates.
 */
function computeFreshnessScore(candidate) {
  const now = Date.now();
  const updatedAt = new Date(candidate.updatedAt || candidate.createdAt).getTime();
  const ageMs = now - updatedAt;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays <= 30) return 1.0;
  if (ageDays <= 90) return 0.85;
  if (ageDays <= 180) return 0.70;
  if (ageDays <= 365) return 0.55;
  return 0.40;
}

/**
 * Seniority alignment between candidate and job.
 */
function computeSeniorityAlignment(candidate, parsedJd) {
  const seniorityMap = {
    intern:    { min: 0, max: 0 },
    junior:    { min: 0, max: 2 },
    mid:       { min: 2, max: 5 },
    senior:    { min: 5, max: 8 },
    lead:      { min: 8, max: 12 },
    principal: { min: 10, max: 99 },
    manager:   { min: 5, max: 99 },
  };

  const jdRange = seniorityMap[parsedJd.seniorityLevel] || { min: 0, max: 99 };
  const exp = candidate.totalExperience || 0;

  if (exp >= jdRange.min && exp <= jdRange.max) return 1.0;
  if (exp < jdRange.min) return Math.max(0.3, 1 - (jdRange.min - exp) * 0.15);
  return Math.max(0.3, 1 - (exp - jdRange.max) * 0.08);
}

/**
 * Location proximity — exact match > remote > partial > far.
 */
function computeLocationProximity(candidate, parsedJd) {
  const jdLoc = (parsedJd.location || "").toLowerCase();
  const candLoc = (candidate.location || "").toLowerCase();

  if (!jdLoc || jdLoc.includes("remote") || jdLoc.includes("wfh")) return 1.0;
  if (!candLoc) return 0.5;
  if (candLoc === jdLoc) return 1.0;
  if (candLoc.includes("remote") || candLoc.includes("anywhere")) return 0.95;
  if (candLoc.includes(jdLoc) || jdLoc.includes(candLoc)) return 0.85;
  return 0.30;
}

/**
 * Build human-readable explanation of scoring.
 */
function buildScoreExplanation(scores) {
  const entries = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `${key}: ${(value * 100).toFixed(0)}%`)
    .slice(0, 3);

  return entries.join(" | ");
}

/**
 * Hybrid ranking comparator for sorting candidates.
 * @param {Array} candidates - Array of candidates with hybrid scores
 * @param {Object} options - { tiebreaker: 'freshness'|'semantic'|'experience' }
 */
export function sortByHybridRank(candidates, options = {}) {
  const { tiebreaker = "semantic" } = options;

  return candidates.sort((a, b) => {
    const scoreDiff = (b.hybridScore || 0) - (a.hybridScore || 0);
    if (Math.abs(scoreDiff) > 0.01) return scoreDiff;

    // Tiebreaker
    const tbKey = `signalScores.${tiebreaker}`;
    const tbA = getNestedValue(a, tbKey) || 0;
    const tbB = getNestedValue(b, tbKey) || 0;
    return tbB - tbA;
  });
}

/**
 * Group candidates by hybrid score tiers.
 */
export function groupByHybridTier(candidates) {
  const tiers = {
    exceptional:  { min: 0.90, max: 1.0, candidates: [] },  // 90-100%
    excellent:    { min: 0.80, max: 0.90, candidates: [] }, // 80-90%
    strong:       { min: 0.70, max: 0.80, candidates: [] },  // 70-80%
    good:         { min: 0.60, max: 0.70, candidates: [] },  // 60-70%
    fair:         { min: 0.50, max: 0.60, candidates: [] },  // 50-60%
    weak:         { min: 0.0,  max: 0.50, candidates: [] },  // 0-50%
  };

  for (const candidate of candidates) {
    const score = candidate.hybridScore || 0;
    for (const [tierName, tier] of Object.entries(tiers)) {
      if (score >= tier.min && score < tier.max) {
        tier.candidates.push(candidate);
        break;
      }
    }
  }

  return tiers;
}

/**
 * Helper to get nested object values.
 */
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
}

/**
 * Compute diversity score — ensure variety in top candidates.
 * Prevents similar candidates dominating results.
 * @param {Array} topCandidates - Sorted candidate list
 * @param {number} limit - Max candidates to return
 * @returns {Array} - Diversity-balanced candidates
 */
export function diversifyTopCandidates(topCandidates, limit = 10) {
  if (topCandidates.length <= limit) return topCandidates;

  const selected = [];
  const used = new Set();

  for (const candidate of topCandidates) {
    if (selected.length >= limit) break;

    // Check diversity against selected
    let isDiverse = true;
    for (const selected of selected) {
      const similarity = computeCandidateSimilarity(candidate, selected);
      if (similarity > 0.85) {
        isDiverse = false;
        break;
      }
    }

    if (isDiverse) {
      selected.push(candidate);
      used.add(candidate._id.toString());
    }
  }

  // Fill remaining slots with next-best if needed
  if (selected.length < limit) {
    for (const candidate of topCandidates) {
      if (selected.length >= limit) break;
      if (!used.has(candidate._id.toString())) {
        selected.push(candidate);
      }
    }
  }

  return selected;
}

/**
 * Compute similarity between two candidates (skill overlap).
 */
function computeCandidateSimilarity(c1, c2) {
  const skills1 = new Set((c1.normalizedSkills || c1.skills || []).map((s) => s.toLowerCase()));
  const skills2 = new Set((c2.normalizedSkills || c2.skills || []).map((s) => s.toLowerCase()));

  if (skills1.size === 0 || skills2.size === 0) return 0;

  const intersection = [...skills1].filter((s) => skills2.has(s)).length;
  const union = new Set([...skills1, ...skills2]).size;
  return intersection / Math.max(1, union);
}

export default {
  computeHybridRankScore,
  sortByHybridRank,
  groupByHybridTier,
  diversifyTopCandidates,
  HYBRID_WEIGHTS,
};
