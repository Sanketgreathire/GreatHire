import { Worker } from "bullmq";
import { getRedisConnection } from "../../../../sourcing/queues/redisConnection.js";
import { matchCandidatesForJob } from "../services/candidateMatching.service.js";
import { generateJobEmbedding } from "../services/jobEmbedding.service.js";
import JobMatch from "../../../models/jobMatch.model.js";
import { JOB_MATCHING_QUEUE_NAME } from "../services/jobMatchingQueue.service.js";

let worker = null;
let isRunning = false;

export async function startJobMatchingWorker() {
  if (isRunning) {
    console.warn("Job matching worker is already running");
    return;
  }

  try {
    worker = new Worker(
      JOB_MATCHING_QUEUE_NAME,
      async (job) => {
        const { jobData, options } = job.data;
        console.log(`Processing job matching for job: ${jobData.jobId}`);

        try {
          await JobMatch.updateMany(
            { jobId: jobData.jobId },
            { 
              processingStatus: "processing",
              processingError: null
            }
          );

          const embeddingResult = await generateJobEmbedding(jobData);
          if (embeddingResult) {
            console.log(`Generated embedding for job ${jobData.jobId}`);
          }

          const matchResults = await matchCandidatesForJob(jobData, options);

          await JobMatch.updateMany(
            { jobId: jobData.jobId },
            { 
              processingStatus: "completed",
              processingMetadata: {
                semanticSearchAvailable: matchResults.mode === 'hybrid',
                keywordSearchUsed: true,
                totalCandidatesEvaluated: matchResults.total,
                processingTimeMs: matchResults.timings?.total_ms || 0
              }
            }
          );

          console.log(`Successfully processed job matching for job ${jobData.jobId}. Found ${matchResults.results.length} matches`);
          
          return {
            success: true,
            jobId: jobData.jobId,
            matchesFound: matchResults.results.length,
            totalEvaluated: matchResults.total,
            mode: matchResults.mode,
            timings: matchResults.timings
          };

        } catch (error) {
          console.error(`Error processing job matching for job ${jobData.jobId}:`, error);
          
          await JobMatch.updateMany(
            { jobId: jobData.jobId },
            { 
              processingStatus: "failed",
              processingError: error.message
            }
          );

          throw error;
        }
      },
      {
        connection: getRedisConnection(),
        concurrency: 2,
        limiter: {
          max: 10,
          duration: 60000
        }
      }
    );

    worker.on("completed", (job, result) => {
      console.log(`Job matching completed for job ${job.data.jobData.jobId}:`, result);
    });

    worker.on("failed", (job, err) => {
      console.error(`Job matching failed for job ${job.data.jobData.jobId}:`, err);
    });

    worker.on("error", (err) => {
      console.error("Job matching worker error:", err);
    });

    isRunning = true;
    console.log("Job matching worker started successfully");

  } catch (error) {
    console.error("Failed to start job matching worker:", error);
    throw error;
  }
}

export async function stopJobMatchingWorker() {
  if (!worker || !isRunning) {
    console.warn("Job matching worker is not running");
    return;
  }

  try {
    await worker.close();
    isRunning = false;
    console.log("Job matching worker stopped successfully");
  } catch (error) {
    console.error("Error stopping job matching worker:", error);
    throw error;
  }
}

export function isJobMatchingWorkerRunning() {
  return isRunning;
}
