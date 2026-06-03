/**
 * recommendationEngine.js
 * Groups scored candidates into recommendation buckets for recruiters.
 */
import { CandidateJobMatch } from "../models/candidateJobMatch.model.js";

/**
 * Build recommendation buckets from stored match records.
 * @param {string} jobId
 * @param {string} recruiterId
 * @returns {Object} recommendations
 */
export async function buildRecommendations(jobId, recruiterId) {
  const matches = await CandidateJobMatch.find({
    jobId,
    recruiterId,
    processingStatus: "COMPLETED",
  })
    .populate("candidateId", "fullName designation currentCompany location skills totalExperience emails phones githubUrl")
    .sort({ matchScore: -1 })
    .limit(200)
    .lean();

  const buckets = {
    topCandidates:    [],  // score >= 80, TOP_CANDIDATE
    hiddenGems:       [],  // HIDDEN_GEM category
    adjacentSkills:   [],  // ADJACENT_SKILLS category
    highPotential:    [],  // HIGH_POTENTIAL category
    strongMatches:    [],  // STRONG_MATCH tier
    allMatches:       [],  // everything else
  };

  for (const match of matches) {
    const summary = buildMatchSummary(match);

    if (match.category === "TOP_CANDIDATE")    buckets.topCandidates.push(summary);
    else if (match.category === "HIDDEN_GEM")  buckets.hiddenGems.push(summary);
    else if (match.category === "ADJACENT_SKILLS") buckets.adjacentSkills.push(summary);
    else if (match.category === "HIGH_POTENTIAL")  buckets.highPotential.push(summary);
    else if (match.tier === "STRONG_MATCH")    buckets.strongMatches.push(summary);
    else                                       buckets.allMatches.push(summary);
  }

  return {
    jobId,
    totalMatches:    matches.length,
    topCandidates:   buckets.topCandidates.slice(0, 10),
    hiddenGems:      buckets.hiddenGems.slice(0, 10),
    adjacentSkills:  buckets.adjacentSkills.slice(0, 10),
    highPotential:   buckets.highPotential.slice(0, 10),
    strongMatches:   buckets.strongMatches.slice(0, 20),
    allMatches:      buckets.allMatches.slice(0, 50),
    stats: {
      topCount:      buckets.topCandidates.length,
      hiddenGems:    buckets.hiddenGems.length,
      adjacent:      buckets.adjacentSkills.length,
      highPotential: buckets.highPotential.length,
      strong:        buckets.strongMatches.length,
    },
  };
}

function buildMatchSummary(match) {
  return {
    matchId:         match._id,
    candidateId:     match.candidateId?._id,
    fullName:        match.candidateId?.fullName,
    designation:     match.candidateId?.designation,
    currentCompany:  match.candidateId?.currentCompany,
    location:        match.candidateId?.location,
    totalExperience: match.candidateId?.totalExperience,
    skills:          (match.candidateId?.skills || []).slice(0, 8),
    matchScore:      match.matchScore,
    tier:            match.tier,
    category:        match.category,
    matchedSkills:   match.matchedSkills,
    missingSkills:   match.missingSkills,
    scores: {
      semantic:    match.semanticScore,
      skill:       match.skillScore,
      experience:  match.experienceScore,
      designation: match.designationScore,
    },
    feedback:        match.feedback?.status || "PENDING",
    contact: {
      email:  match.candidateId?.emails?.[0] || "",
      phone:  match.candidateId?.phones?.[0] || "",
      github: match.candidateId?.githubUrl   || "",
    },
  };
}

/**
 * Update recruiter feedback on a match.
 */
export async function updateMatchFeedback(matchId, recruiterId, status, note = "") {
  const match = await CandidateJobMatch.findOneAndUpdate(
    { _id: matchId, recruiterId },
    {
      $set: {
        "feedback.status":    status,
        "feedback.note":      note,
        "feedback.updatedAt": new Date(),
        "feedback.updatedBy": recruiterId,
      },
    },
    { new: true }
  );
  return match;
}
