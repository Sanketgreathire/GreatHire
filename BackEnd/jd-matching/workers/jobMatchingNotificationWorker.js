import { Worker } from "bullmq";
import {
  getRedisConnection,
  isRedisAvailable,
} from "../../sourcing/queues/redisConnection.js";
import {
  JOB_MATCH_NOTIFICATION_QUEUE,
} from "../queues/jobMatchNotificationQueue.js";
import { CandidateJobMatch } from "../models/candidateJobMatch.model.js";
import { SourcingCandidate } from "../../models/sourcing/sourcingCandidate.model.js";
import { Job } from "../../models/job.model.js";
import { sendJobMatchEmail } from "../../utils/emailService.js";
import logger from "../../utils/logger.js";

let worker = null;

async function processJob(job) {
  const { matchId } = job.data;

  logger.queue(
    `🔄 Processing job match notification ${matchId}`,
    { matchId, attempt: job.attemptsMade }
  );

  const match = await CandidateJobMatch.findById(matchId).lean();

  if (!match) {
    logger.warn("job-match-notification-worker", "Match record not found", {
      matchId,
    });
    return;
  }

  // Already sent — never send duplicate email.
  if (match.notificationStatus === "SENT") {
    logger.queue("Notification already sent — skipping", { matchId });
    return;
  }

  const candidate = await SourcingCandidate.findById(match.candidateId)
    .select("fullName emails")
    .lean();

  if (!candidate?.emails?.[0]) {
    await CandidateJobMatch.updateOne(
      { _id: matchId },
      {
        $set: {
          notificationStatus: "FAILED",
          notificationError: "Candidate has no email address",
        },
      }
    );

    return;
  }

  const jobData = await Job.findById(match.jobId)
    .select("jobDetails.title jobDetails.companyName")
    .lean();

  if (!jobData) {
    throw new Error(`Job ${match.jobId} not found`);
  }

  const emailSent = await sendJobMatchEmail(
    candidate.emails[0],
    candidate.fullName,
    jobData.jobDetails?.title || "New Job Opportunity",
    jobData.jobDetails?.companyName || "GreatHire"
  );

  if (!emailSent) {
    // Important:
    // Throwing makes BullMQ retry the job.
    // We do NOT mark it SENT.
    throw new Error("Brevo email sending failed");
  }

  // Atomic update prevents a second worker from marking/sending
  // the same notification as successful after it was already sent.
  const updated = await CandidateJobMatch.updateOne(
    {
      _id: matchId,
      notificationStatus: { $ne: "SENT" },
    },
    {
      $set: {
        notificationStatus: "SENT",
        notificationSentAt: new Date(),
        notificationError: "",
      },
    }
  );

  if (updated.modifiedCount) {
    logger.queue("✅ Job match notification sent", {
      matchId,
      candidateId: match.candidateId,
      email: candidate.emails[0],
    });
  }
}

export async function startJobMatchNotificationWorker() {
  if (worker) return worker;

  const ok = await isRedisAvailable();

  if (!ok) {
    logger.warn(
      "job-match-notification-worker",
      "Redis unavailable — notification worker not started"
    );
    return null;
  }

  worker = new Worker(
    JOB_MATCH_NOTIFICATION_QUEUE,
    processJob,
    {
      connection: getRedisConnection(),
      concurrency: 2,
    }
  );

  worker.on("completed", (job) => {
    logger.queue(
      `✅ Notification job ${job.id} completed`,
      { matchId: job.data.matchId }
    );
  });

  worker.on("failed", (job, err) => {
    logger.error(
      "job-match-notification-worker",
      `Notification job ${job?.id} failed`,
      err,
      {
        matchId: job?.data?.matchId,
      }
    );
  });

  worker.on("error", (err) => {
    logger.error(
      "job-match-notification-worker",
      "Worker error",
      err
    );
  });

  logger.queue(
    `✅ Job match notification worker started [${JOB_MATCH_NOTIFICATION_QUEUE}]`
  );

  return worker;
}

export async function stopJobMatchNotificationWorker() {
  if (worker) {
    await worker.close();
    worker = null;
    logger.queue("Job match notification worker stopped");
  }
}