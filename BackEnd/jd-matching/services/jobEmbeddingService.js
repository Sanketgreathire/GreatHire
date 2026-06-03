/**
 * jobEmbeddingService.js
 * Generates embeddings for job descriptions and indexes them in Qdrant.
 * Uses a separate Qdrant collection: "sourcing_jobs"
 */
import { JDEmbedding }    from "../models/jdEmbedding.model.js";
import { embedText, isAiServiceAvailable, indexJobInQdrant } from "./aiJdClient.js";
import { buildJdEmbeddingText } from "./jdParserService.js";
import logger from "../../utils/logger.js";

/**
 * Generate embedding for a parsed JD and store in Qdrant + MongoDB.
 */
export async function embedAndIndexJob(jobId, recruiterId, parsedData, rawTitle = "") {
  try {
    await JDEmbedding.findOneAndUpdate(
      { jobId },
      { $set: { embeddingStatus: "PROCESSING" } }
    );

    const aiAvailable = await isAiServiceAvailable();
    if (!aiAvailable) {
      logger.warn("job-embedding", "AI service unavailable, cannot embed", { jobId });
      await JDEmbedding.findOneAndUpdate({ jobId }, { $set: { embeddingStatus: "FAILED" } });
      return { success: false, reason: "AI service unavailable" };
    }

    // Build rich text for embedding
    const embeddingText = buildJdEmbeddingText(parsedData, rawTitle);
    logger.debug("job-embedding", "Built embedding text", { jobId, textLength: embeddingText.length });

    // Generate embedding via Python AI service
    const embedding = await embedText(embeddingText);
    logger.debug("job-embedding", "Generated embedding", { jobId, embeddingDim: embedding.length });

    // Index in Qdrant jobs collection
    await indexJobInQdrant(jobId.toString(), embedding, {
      recruiter_id:    recruiterId.toString(),
      designation:     parsedData.designation,
      required_skills: parsedData.requiredSkills,
      domain:          parsedData.domain,
      seniority:       parsedData.seniorityLevel,
      location:        parsedData.location,
      min_experience:  parsedData.minExperience,
      max_experience:  parsedData.maxExperience,
    });

    await JDEmbedding.findOneAndUpdate({ jobId }, {
      $set: { embeddingStatus: "DONE", qdrantIndexed: true },
    });

    logger.jdEmbed(`Job embedded and indexed: ${jobId}`, { jobId, recruiterId });
    return { success: true, embeddingText };
  } catch (err) {
    logger.error("job-embedding", `Failed to embed job ${jobId}`, err, { jobId });
    await JDEmbedding.findOneAndUpdate({ jobId }, {
      $set: { embeddingStatus: "FAILED" },
    });
    throw err;
  }
}
