/**
 * matchingPipelineService.js
 * Full pipeline:
 * JD → Parse → Embed → Semantic Search → Score All → Save Matches
 */
import { Job }                   from "../../models/job.model.js";
import { SourcingCandidate }     from "../../models/sourcing/sourcingCandidate.model.js";
import { JDEmbedding }           from "../models/jdEmbedding.model.js";
import { CandidateJobMatch }     from "../models/candidateJobMatch.model.js";
import { parseJobDescription, buildJdEmbeddingText } from "./jdParserService.js";
import { scoreCandidate }        from "./candidateMatchingService.js";
import { searchCandidatesForJd, isAiServiceAvailable } from "./aiJdClient.js";
import { computeHybridRankScore, sortByHybridRank, diversifyTopCandidates } from "./hybridRankingEngine.js";
import logger                   from "../../utils/logger.js";

const BATCH_SIZE = 50; // candidates to score per batch

/**
 * Run the complete matching pipeline for a job.
 * @param {string} jobId
 * @param {string} recruiterId
 * @returns {{ matched, skipped, errors }}
 */
export async function runMatchingPipeline(jobId, recruiterId) {
  logger.pipeline(`Starting pipeline for jobId=${jobId}`, { jobId, recruiterId });

  try {
    // ── 1. Load job ───────────────────────────────────────────────────────────
    const job = await Job.findById(jobId).lean();
    if (!job) throw new Error(`Job ${jobId} not found`);

    const rawText = [
      job.jobDetails?.title,
      job.jobDetails?.details,
      (job.jobDetails?.skills || []).join(", "),
      (job.jobDetails?.qualifications || []).join(", "),
      (job.jobDetails?.responsibilities || []).join(", "),
    ].filter(Boolean).join("\n");

    // ── 2. Parse JD ───────────────────────────────────────────────────────────
    const parsedData = parseJobDescription(rawText, {
      title:      job.jobDetails?.title,
      skills:     job.jobDetails?.skills || [],
      experience: job.jobDetails?.experience,
      location:   job.jobDetails?.location,
    });
    logger.jdParse(`JD parsed: ${parsedData.requiredSkills.length} required, ${parsedData.preferredSkills.length} preferred`, {
      jobId,
      requiredSkills: parsedData.requiredSkills.length,
      preferredSkills: parsedData.preferredSkills.length,
    });

    // ── 3. Upsert JDEmbedding record ──────────────────────────────────────────
    await JDEmbedding.findOneAndUpdate(
      { jobId },
      { $set: { jobId, recruiterId, parsedData, embeddingStatus: "PENDING", lastMatchRun: new Date() } },
      { upsert: true, new: true }
    );

    // ── 4. Get semantic candidates (if AI available) ───────────────────────────
    const aiAvailable = await isAiServiceAvailable();
    let semanticScoreMap = new Map(); // candidateId → semantic score

    if (aiAvailable) {
      try {
        const embeddingText = buildJdEmbeddingText(parsedData, job.jobDetails?.title);
        const { results }   = await searchCandidatesForJd({
          jdEmbeddingText: embeddingText,
          recruiterId,
          topK:            200,
          scoreThreshold:  0.2,
        });
        logger.pipeline(`Semantic search returned ${results.length} candidates`, { jobId, semanticCount: results.length });
        for (const r of results) {
          semanticScoreMap.set(r.candidate_id, r.score);
        }
      } catch (err) {
        logger.warn("matching-pipeline", "Semantic search failed, using keyword only", { jobId, error: err.message });
      }
    } else {
      logger.warn("matching-pipeline", "AI service unavailable, keyword-only matching", { jobId });
    }

  // ── 5. Get keyword candidates (MongoDB) ───────────────────────────────────
    const keywordQuery = { createdBy: recruiterId };
    if (parsedData.requiredSkills.length) {
      keywordQuery.skills = { $in: parsedData.requiredSkills.map((s) => new RegExp(s, "i")) };
    }

    const keywordCandidates = await SourcingCandidate.find(keywordQuery)
      .select("-parsedText")
      .limit(500)
      .lean();
    logger.pipeline(`Keyword search returned ${keywordCandidates.length} candidates`, {
      jobId,
      keywordCount: keywordCandidates.length,
    });

    // ── 6. Merge candidate pools ──────────────────────────────────────────────
    const allCandidateIds = new Set([
      ...keywordCandidates.map((c) => c._id.toString()),
      ...semanticScoreMap.keys(),
    ]);

    // Fetch any semantic-only candidates not in keyword results
    const semanticOnlyIds = [...semanticScoreMap.keys()]
      .filter((id) => !keywordCandidates.find((c) => c._id.toString() === id));

    let extraCandidates = [];
    if (semanticOnlyIds.length) {
      extraCandidates = await SourcingCandidate.find({
        _id: { $in: semanticOnlyIds }, createdBy: recruiterId,
      }).select("-parsedText").lean();
    }

    const allCandidates = [...keywordCandidates, ...extraCandidates];
    logger.pipeline(`Total candidates to score: ${allCandidates.length}`, {
      jobId,
      totalCandidates: allCandidates.length,
    });

  // ── 7. Score all candidates ───────────────────────────────────────────────
  const stats = { matched: 0, skipped: 0, errors: 0 };
  const matchDocs = [];

  for (const candidate of allCandidates) {
    try {
      const semScore = semanticScoreMap.get(candidate._id.toString()) || 0;
      const scores   = scoreCandidate(candidate, parsedData, semScore);

      // Compute hybrid rank score for improved sorting
      const keywordMetrics = {
        totalKeywords: parsedData.requiredSkills.length + parsedData.preferredSkills.length + 5,
        matchedKeywords: scores.matchedSkills.length + (scores.bonusSkills.length * 0.5),
      };
      const { hybridScore, signalScores, explanation } = computeHybridRankScore(
        candidate,
        parsedData,
        semScore,
        keywordMetrics
      );

      // Skip very weak matches
      if (scores.matchScore < 20) { stats.skipped++; continue; }

      matchDocs.push({
        jobId,
        candidateId:     candidate._id,
        recruiterId,
        matchScore:      Math.round(hybridScore * 100), // Convert to 0-100 scale
        hybridScore:     hybridScore,
        semanticScore:   scores.semanticScore,
        skillScore:      scores.skillScore,
        experienceScore: scores.experienceScore,
        designationScore:scores.designationScore,
        locationScore:   scores.locationScore,
        domainScore:     scores.domainScore,
        matchedSkills:   scores.matchedSkills,
        missingSkills:   scores.missingSkills,
        bonusSkills:     scores.bonusSkills,
        tier:            scores.tier,
        category:        scores.category,
        rankingMetadata: {
          ...scores.rankingMetadata,
          hybridSignals:  signalScores,
          explanation,
        },
        processingStatus:"COMPLETED",
        batchId:         `match_${jobId}_${Date.now()}`,
      });
      stats.matched++;
    } catch (err) {
      stats.errors++;
      logger.error(`Score error for candidate ${candidate._id}:`, err.message);
    }
  }

  // ── 8. Bulk upsert match records ──────────────────────────────────────────
  if (matchDocs.length) {
    const ops = matchDocs.map((doc) => ({
      updateOne: {
        filter: { jobId: doc.jobId, candidateId: doc.candidateId },
        update: { $set: doc },
        upsert: true,
      },
    }));

    // Process in batches
    for (let i = 0; i < ops.length; i += BATCH_SIZE) {
      await CandidateJobMatch.bulkWrite(ops.slice(i, i + BATCH_SIZE));
    }
    logger.pipeline(`Upserted ${matchDocs.length} candidate matches`, { jobId, matched: matchDocs.length });
  }

  // ── 9. Assign ranks ───────────────────────────────────────────────────────
  await assignRanks(jobId);
  logger.ranking(`Ranks assigned for jobId=${jobId}`, { jobId });

  // ── 10. Update JDEmbedding stats ──────────────────────────────────────────
  await JDEmbedding.findOneAndUpdate({ jobId }, {
    $set: { totalMatches: stats.matched, embeddingStatus: "DONE" },
  });

  logger.pipeline(`Pipeline completed for jobId=${jobId}`, {
    jobId,
    matched: stats.matched,
    skipped: stats.skipped,
    errors: stats.errors,
  });

  return stats;
  } catch (err) {
    logger.error("matching-pipeline", `Pipeline failed for jobId=${jobId}`, err, { jobId });
    throw err;
  }
}

async function assignRanks(jobId) {
  const matches = await CandidateJobMatch.find({ jobId })
    .sort({ matchScore: -1 })
    .select("_id")
    .lean();

  const ops = matches.map((m, i) => ({
    updateOne: { filter: { _id: m._id }, update: { $set: { rank: i + 1 } } },
  }));

  if (ops.length) await CandidateJobMatch.bulkWrite(ops);
}
