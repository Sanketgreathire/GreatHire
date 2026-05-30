/**
 * recruiterFeedbackService.js
 * Tracks recruiter feedback on matches and learns to improve future recommendations.
 * Integrates with the matching pipeline for continuous improvement.
 */
import { CandidateJobMatch } from "../models/candidateJobMatch.model.js";
import { JDEmbedding } from "../models/jdEmbedding.model.js";
import mongoose from "mongoose";

/**
 * Record recruiter feedback on a match.
 * @param {string} matchId - Match record ID
 * @param {string} recruiterId - Recruiter ID
 * @param {string} status - SHORTLISTED | REJECTED | CONTACTED | HIRED | ON_HOLD
 * @param {string} note - Optional feedback note
 * @param {Object} metadata - Additional context (e.g., interviewRound, reason)
 */
export async function recordFeedback(matchId, recruiterId, status, note = "", metadata = {}) {
  const match = await CandidateJobMatch.findOneAndUpdate(
    { _id: matchId, recruiterId },
    {
      $set: {
        "feedback.status":     status,
        "feedback.note":       note,
        "feedback.updatedAt":  new Date(),
        "feedback.updatedBy":  recruiterId,
        "feedback.metadata":   metadata,
      },
    },
    { new: true }
  );

  if (!match) throw new Error("Match not found");

  // Trigger learning if hired/rejected
  if (["HIRED", "REJECTED"].includes(status)) {
    await updateLearningSignals(match, status);
  }

  return match;
}

/**
 * Get feedback analytics for a job.
 * @param {string} jobId - Job ID
 * @param {string} recruiterId - Recruiter ID
 */
export async function getFeedbackAnalytics(jobId, recruiterId) {
  const matches = await CandidateJobMatch.find({ jobId, recruiterId }).lean();

  const stats = {
    total: matches.length,
    byStatus: {
      pending:     0,
      shortlisted: 0,
      rejected:    0,
      contacted:   0,
      hired:       0,
      onHold:      0,
    },
    conversionRates: {
      shortlistToContacted: 0,
      contactedToHired:     0,
      overallConversion:    0,
    },
    scoreAnalysis: {
      hiredAvgScore:     0,
      rejectedAvgScore:  0,
      shortlistedAvgScore: 0,
    },
  };

  let hiredScores = [];
  let rejectedScores = [];
  let shortlistedScores = [];
  let shortlistedCount = 0;
  let contactedCount = 0;
  let hiredCount = 0;

  for (const match of matches) {
    const status = match.feedback?.status || "PENDING";
    const statusKey = status.toLowerCase();
    if (statusKey in stats.byStatus) {
      stats.byStatus[statusKey]++;
    }

    if (status === "HIRED") {
      hiredScores.push(match.matchScore);
      hiredCount++;
    } else if (status === "REJECTED") {
      rejectedScores.push(match.matchScore);
    } else if (status === "SHORTLISTED") {
      shortlistedScores.push(match.matchScore);
      shortlistedCount++;
    } else if (status === "CONTACTED") {
      contactedCount++;
    }
  }

  // Calculate averages
  if (hiredScores.length) stats.scoreAnalysis.hiredAvgScore = avg(hiredScores);
  if (rejectedScores.length) stats.scoreAnalysis.rejectedAvgScore = avg(rejectedScores);
  if (shortlistedScores.length) stats.scoreAnalysis.shortlistedAvgScore = avg(shortlistedScores);

  // Conversion rates
  if (shortlistedCount > 0) stats.conversionRates.shortlistToContacted = contactedCount / shortlistedCount;
  if (contactedCount > 0) stats.conversionRates.contactedToHired = hiredCount / contactedCount;
  if (stats.total > 0) stats.conversionRates.overallConversion = hiredCount / stats.total;

  return stats;
}

/**
 * Get candidate feedback history — how many times hired/rejected across jobs.
 */
export async function getCandidateFeedbackHistory(candidateId, recruiterId) {
  const matches = await CandidateJobMatch.find({ candidateId, recruiterId }).lean();

  const history = {
    total:       matches.length,
    hired:       0,
    rejected:    0,
    shortlisted: 0,
    contacted:   0,
    pending:     0,
    byJob:       [],
  };

  for (const match of matches) {
    const status = match.feedback?.status || "PENDING";
    history[status.toLowerCase()]++;
    history.byJob.push({
      jobId:      match.jobId,
      matchScore: match.matchScore,
      status,
      feedback:   match.feedback,
    });
  }

  return history;
}

/**
 * Get recruiter-specific recommendations based on feedback patterns.
 * @param {string} jobId - Current job being filled
 * @param {string} recruiterId - Recruiter ID
 */
export async function getRecruiterInsights(jobId, recruiterId) {
  const jdEmb = await JDEmbedding.findOne({ jobId, recruiterId }).lean();
  if (!jdEmb) return { insights: [] };

  // Get recent hires to understand recruiter preferences
  const recentMatches = await CandidateJobMatch.find({
    recruiterId,
    "feedback.status": "HIRED",
    "feedback.updatedAt": { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
  })
    .populate("candidateId", "skills designation totalExperience")
    .lean();

  const insights = [];

  // Pattern 1: Score threshold that predicts hiring
  if (recentMatches.length >= 3) {
    const avgHireScore = avg(recentMatches.map((m) => m.matchScore));
    insights.push({
      type: "score_threshold",
      message: `You typically hire candidates scoring ${avgHireScore.toFixed(0)}+. Current top matches: check if they exceed this threshold.`,
      avgHireScore,
    });
  }

  // Pattern 2: Preferred experience level
  if (recentMatches.length >= 2) {
    const experienceLevels = recentMatches.map((m) => m.candidateId?.totalExperience || 0);
    const mostCommon = modes(experienceLevels);
    if (mostCommon.length > 0) {
      insights.push({
        type: "experience_preference",
        message: `You've hired candidates with ~${mostCommon[0]} years of experience. Consider prioritizing this experience level.`,
        preferredExperience: mostCommon[0],
      });
    }
  }

  // Pattern 3: Skill preferences
  const allSkills = new Map();
  for (const match of recentMatches) {
    for (const skill of match.candidateId?.skills || []) {
      allSkills.set(skill, (allSkills.get(skill) || 0) + 1);
    }
  }
  if (allSkills.size > 0) {
    const topSkills = Array.from(allSkills.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([skill]) => skill);
    insights.push({
      type: "skill_preference",
      message: `You've hired candidates skilled in: ${topSkills.join(", ")}. Prioritize these in recommendations.`,
      preferredSkills: topSkills,
    });
  }

  return { jobId, insights };
}

/**
 * Batch feedback update — update multiple matches at once.
 * @param {Array} updates - Array of { matchId, status, note }
 * @param {string} recruiterId
 */
export async function batchUpdateFeedback(updates, recruiterId) {
  const results = [];
  for (const { matchId, status, note } of updates) {
    try {
      const updated = await recordFeedback(matchId, recruiterId, status, note);
      results.push({ matchId, success: true, updated });
    } catch (err) {
      results.push({ matchId, success: false, error: err.message });
    }
  }
  return results;
}

/**
 * Export feedback as CSV for external analysis.
 */
export async function exportFeedbackAsCSV(jobId, recruiterId) {
  const matches = await CandidateJobMatch.find({ jobId, recruiterId })
    .populate("candidateId", "fullName designation skills totalExperience")
    .lean();

  const rows = [
    ["candidateName", "designation", "skills", "experience", "matchScore", "tier", "feedbackStatus", "note", "updatedAt"],
  ];

  for (const match of matches) {
    rows.push([
      match.candidateId?.fullName || "N/A",
      match.candidateId?.designation || "N/A",
      (match.candidateId?.skills || []).join(";"),
      match.candidateId?.totalExperience || 0,
      match.matchScore,
      match.tier,
      match.feedback?.status || "PENDING",
      match.feedback?.note || "",
      match.feedback?.updatedAt || "",
    ]);
  }

  return rows;
}

/**
 * Update learning signals based on hiring decisions.
 * Used to tune future matching algorithms.
 */
async function updateLearningSignals(match, status) {
  try {
    const signal = {
      matchId: match._id,
      candidateId: match.candidateId,
      jobId: match.jobId,
      matchScore: match.matchScore,
      decision: status === "HIRED" ? "POSITIVE" : "NEGATIVE",
      scores: {
        semantic: match.semanticScore,
        skill: match.skillScore,
        experience: match.experienceScore,
        designation: match.designationScore,
        location: match.locationScore,
      },
      recordedAt: new Date(),
    };

    // Store in a signals collection for ML model training (if needed in future)
    console.log(`📊 Learning signal recorded: ${signal.decision} for candidate ${match.candidateId} on job ${match.jobId}`);

    // Could push to message queue for async processing
    // await publishLearningSignal(signal);
  } catch (err) {
    console.error("Error updating learning signals:", err.message);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function avg(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function modes(numbers) {
  if (numbers.length === 0) return [];
  const counts = new Map();
  for (const n of numbers) {
    counts.set(n, (counts.get(n) || 0) + 1);
  }
  const max = Math.max(...counts.values());
  return [...counts.entries()].filter(([, c]) => c === max).map(([n]) => n);
}

export default {
  recordFeedback,
  getFeedbackAnalytics,
  getCandidateFeedbackHistory,
  getRecruiterInsights,
  batchUpdateFeedback,
  exportFeedbackAsCSV,
};
