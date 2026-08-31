import { CandidateJobMatch } from "../models/candidateJobMatch.model.js";
import { enqueueJobMatchEmail } from "../queues/jobMatchEmailQueue.js";
import logger from "../../utils/logger.js";

let processorInterval = null;

const PROCESS_INTERVAL = 60 * 60 * 1000; // every 1 hour
const BATCH_SIZE = 50;

async function processPendingJobMatchEmails() {
  try {
    // Only retry emails that have been pending for at least 1 hour.
    const retryBefore = new Date(Date.now() - PROCESS_INTERVAL);

    const pendingMatches = await CandidateJobMatch.find({
      notificationStatus: "PENDING",
      updatedAt: { $lte: retryBefore },
    })
      .select("_id jobId candidateId")
      .sort({ updatedAt: 1 })
      .limit(BATCH_SIZE)
      .lean();

    if (!pendingMatches.length) {
      logger.queue("📭 No pending job match emails ready for retry");
      return;
    }

    logger.queue(
      `📧 Found ${pendingMatches.length} pending job match emails ready for retry`
    );

    for (const match of pendingMatches) {
      try {
        await enqueueJobMatchEmail({
          matchId: match._id,
          jobId: match.jobId,
          candidateId: match.candidateId,
        });

        // Update updatedAt so the same record isn't immediately
        // picked up again by the pending processor.
        await CandidateJobMatch.updateOne(
          {
            _id: match._id,
            notificationStatus: "PENDING",
          },
          {
            $set: {
              updatedAt: new Date(),
            },
          }
        );

        logger.queue("📧 Pending email re-queued", {
          matchId: match._id,
          jobId: match.jobId,
          candidateId: match.candidateId,
        });
      } catch (err) {
        logger.error(
          "pending-job-match-email",
          "Failed to re-queue pending email",
          err,
          {
            matchId: match._id,
          }
        );
      }
    }
  } catch (err) {
    logger.error(
      "pending-job-match-email",
      "Pending email processor failed",
      err
    );
  }
}

export function startPendingJobMatchEmailProcessor() {
  if (processorInterval) {
    return;
  }

  // Run once when the processor starts.
  processPendingJobMatchEmails();

  // Then periodically check for pending emails.
  processorInterval = setInterval(
    processPendingJobMatchEmails,
    PROCESS_INTERVAL
  );

  logger.queue("✅ Pending job match email processor started");
}

export function stopPendingJobMatchEmailProcessor() {
  if (processorInterval) {
    clearInterval(processorInterval);
    processorInterval = null;

    logger.queue("🛑 Pending job match email processor stopped");
  }
}