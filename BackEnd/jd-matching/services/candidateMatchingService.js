/**
 * candidateMatchingService.js
 * Scores candidates against a parsed JD across 6 dimensions.
 * Returns a composite matchScore (0-100) with breakdown.
 */
import { normalizeSkills } from "../../sourcing/services/normalizationService.js";

// ── Score weights ─────────────────────────────────────────────────────────────
const WEIGHTS = {
  semantic:    0.30,
  skill:       0.30,
  experience:  0.20,
  designation: 0.10,
  location:    0.05,
  domain:      0.05,
};

/**
 * Score a single candidate against a parsed JD.
 *
 * @param {Object} candidate   - SourcingCandidate document
 * @param {Object} parsedJd    - Output of jdParserService.parseJobDescription()
 * @param {number} semanticScore - Cosine similarity from Qdrant (0-1)
 * @returns {Object} scoreBreakdown
 */
export function scoreCandidate(candidate, parsedJd, semanticScore = 0) {
  const skillResult    = computeSkillScore(candidate, parsedJd);
  const expScore       = computeExperienceScore(candidate, parsedJd);
  const designScore    = computeDesignationScore(candidate, parsedJd);
  const locationScore  = computeLocationScore(candidate, parsedJd);
  const domainScore    = computeDomainScore(candidate, parsedJd);

  // Weighted composite score (0-100)
  const matchScore = Math.round(
    (semanticScore          * WEIGHTS.semantic    * 100) +
    (skillResult.score / 100 * WEIGHTS.skill      * 100) +
    (expScore / 100          * WEIGHTS.experience * 100) +
    (designScore / 100       * WEIGHTS.designation* 100) +
    (locationScore / 100     * WEIGHTS.location   * 100) +
    (domainScore / 100       * WEIGHTS.domain     * 100)
  );

  const tier = getTier(matchScore);
  const category = getCategory(matchScore, skillResult, candidate, parsedJd);

  return {
    matchScore:       Math.min(100, matchScore),
    semanticScore:    parseFloat(semanticScore.toFixed(4)),
    skillScore:       skillResult.score,
    experienceScore:  expScore,
    designationScore: designScore,
    locationScore,
    domainScore,
    matchedSkills:    skillResult.matched,
    missingSkills:    skillResult.missing,
    bonusSkills:      skillResult.bonus,
    tier,
    category,
    rankingMetadata: {
      experienceGap:  computeExpGap(candidate, parsedJd),
      seniorityMatch: checkSeniorityMatch(candidate, parsedJd),
      locationMatch:  locationScore >= 80,
      educationMatch: true, // simplified
      industryMatch:  domainScore >= 50,
    },
  };
}

// ── Skill scoring ─────────────────────────────────────────────────────────────
function computeSkillScore(candidate, parsedJd) {
  const candidateSkills = normalizeSkills([
    ...(candidate.skills || []),
    ...(candidate.normalizedSkills || []),
  ]).map((s) => s.toLowerCase());

  const required  = parsedJd.requiredSkills.map((s) => s.toLowerCase());
  const preferred = parsedJd.preferredSkills.map((s) => s.toLowerCase());
  const allJdSkills = [...new Set([...required, ...preferred])];

  const matched = [];
  const missing = [];
  const bonus   = [];

  for (const skill of required) {
    if (candidateSkills.some((cs) => cs.includes(skill) || skill.includes(cs))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  for (const skill of preferred) {
    if (candidateSkills.some((cs) => cs.includes(skill) || skill.includes(cs))) {
      if (!matched.includes(skill)) matched.push(skill);
    }
  }

  // Bonus skills — candidate has relevant skills not in JD
  for (const cs of candidateSkills) {
    if (!allJdSkills.some((js) => js.includes(cs) || cs.includes(js))) {
      bonus.push(cs);
    }
  }

  // Score: required skills weighted 70%, preferred 30%
  const reqScore  = required.length  ? (matched.filter((m) => required.includes(m)).length  / required.length)  * 70 : 70;
  const prefScore = preferred.length ? (matched.filter((m) => preferred.includes(m)).length / preferred.length) * 30 : 30;
  const score     = Math.round(reqScore + prefScore);

  return {
    score:   Math.min(100, score),
    matched: matched.slice(0, 20),
    missing: missing.slice(0, 20),
    bonus:   bonus.slice(0, 10),
  };
}

// ── Experience scoring ────────────────────────────────────────────────────────
function computeExperienceScore(candidate, parsedJd) {
  const exp    = candidate.totalExperience || 0;
  const minExp = parsedJd.minExperience    || 0;
  const maxExp = parsedJd.maxExperience    || 99;

  if (exp >= minExp && exp <= maxExp) return 100;
  if (exp < minExp) {
    const gap = minExp - exp;
    if (gap <= 1) return 80;
    if (gap <= 2) return 60;
    if (gap <= 3) return 40;
    return 20;
  }
  // Over-experienced
  const over = exp - maxExp;
  if (over <= 2) return 90;
  if (over <= 5) return 70;
  return 50;
}

function computeExpGap(candidate, parsedJd) {
  const exp = candidate.totalExperience || 0;
  return parseFloat((exp - (parsedJd.minExperience || 0)).toFixed(1));
}

// ── Designation scoring ───────────────────────────────────────────────────────
function computeDesignationScore(candidate, parsedJd) {
  const cDes = (candidate.designation || "").toLowerCase();
  const jDes = (parsedJd.designation  || "").toLowerCase();
  if (!cDes || !jDes) return 50;

  // Exact match
  if (cDes === jDes) return 100;

  // Partial word overlap
  const cWords = cDes.split(/\s+/);
  const jWords = jDes.split(/\s+/);
  const overlap = cWords.filter((w) => jWords.includes(w) && w.length > 3).length;
  const maxLen  = Math.max(cWords.length, jWords.length);
  return Math.round((overlap / maxLen) * 100);
}

// ── Location scoring ──────────────────────────────────────────────────────────
function computeLocationScore(candidate, parsedJd) {
  const cLoc = (candidate.location || "").toLowerCase();
  const jLoc = (parsedJd.location  || "").toLowerCase();

  if (!jLoc || jLoc.includes("remote") || jLoc.includes("wfh")) return 100;
  if (!cLoc) return 50;
  if (cLoc.includes(jLoc) || jLoc.includes(cLoc)) return 100;
  if (cLoc.includes("remote") || cLoc.includes("anywhere")) return 80;
  return 30;
}

// ── Domain scoring ────────────────────────────────────────────────────────────
function computeDomainScore(candidate, parsedJd) {
  if (!parsedJd.domain) return 70; // no domain requirement
  const cSkills = (candidate.normalizedSkills || candidate.skills || []).join(" ").toLowerCase();
  const cSummary = (candidate.summary || "").toLowerCase();
  const combined = cSkills + " " + cSummary;

  const domainKeywords = {
    fintech:    ["finance","banking","payment","fintech","trading"],
    healthtech: ["health","medical","clinical","pharma"],
    saas:       ["saas","b2b","enterprise","platform"],
    ai_ml:      ["machine learning","ai","data science","nlp","tensorflow"],
    ecommerce:  ["ecommerce","retail","marketplace"],
  };

  const keywords = domainKeywords[parsedJd.domain] || [];
  if (!keywords.length) return 70;

  const matches = keywords.filter((k) => combined.includes(k)).length;
  return Math.round((matches / keywords.length) * 100);
}

// ── Seniority match ───────────────────────────────────────────────────────────
function checkSeniorityMatch(candidate, parsedJd) {
  const exp = candidate.totalExperience || 0;
  const map = { intern: [0,1], junior: [0,2], mid: [2,5], senior: [5,9], lead: [8,15], principal: [10,99], manager: [5,99] };
  const range = map[parsedJd.seniorityLevel] || [0, 99];
  return exp >= range[0] && exp <= range[1];
}

// ── Tier classification ───────────────────────────────────────────────────────
function getTier(score) {
  if (score >= 85) return "TOP_MATCH";
  if (score >= 70) return "STRONG_MATCH";
  if (score >= 55) return "GOOD_MATCH";
  if (score >= 40) return "PARTIAL_MATCH";
  return "WEAK_MATCH";
}

// ── Category classification ───────────────────────────────────────────────────
function getCategory(score, skillResult, candidate, parsedJd) {
  // Top candidate: high overall score
  if (score >= 80) return "TOP_CANDIDATE";

  // Hidden gem: lower score but has all required skills + good semantic match
  if (score >= 55 && skillResult.missing.length === 0) return "HIDDEN_GEM";

  // Adjacent skills: has related but not exact skills
  if (score >= 45 && skillResult.bonus.length >= 3) return "ADJACENT_SKILLS";

  // High potential: junior but has most required skills
  const exp = candidate.totalExperience || 0;
  if (exp < parsedJd.minExperience && skillResult.score >= 70) return "HIGH_POTENTIAL";

  return "STANDARD";
}
