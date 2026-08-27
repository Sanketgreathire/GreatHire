import { Worker } from "bullmq";
import {
  getRedisConnection,
  isRedisAvailable,
} from "../../sourcing/queues/redisConnection.js";
import { JOB_MATCH_EMAIL_QUEUE } from "../queues/jobMatchEmailQueue.js";
import { CandidateJobMatch } from "../models/candidateJobMatch.model.js";
import { Job } from "../../models/job.model.js";
import { SourcingCandidate } from "../../models/sourcing/sourcingCandidate.model.js";
import { sendJobMatchEmail } from "../../utils/emailService.js";
import logger from "../../utils/logger.js";

let worker = null;

async function processEmailJob(job) {
  const { matchId, jobId, candidateId } = job.data;

  logger.queue("📧 Processing job match email", {
    matchId,
    jobId,
    candidateId,
    attempt: job.attemptsMade,
  });

  // 1. Get match record
  const match = await CandidateJobMatch.findById(matchId);

  if (!match) {
    logger.warn("job-match-email-worker", "Match record not found", {
      matchId,
    });
    return;
  }

  // 2. DUPLICATE PROTECTION
  // Never send an email if it has already been sent.
  if (match.notificationStatus === "SENT") {
    logger.queue("⏭️ Email already sent, skipping", {
      matchId,
      candidateId,
    });
    return;
  }

  // 3. Get candidate
  const candidate = await SourcingCandidate.findById(candidateId)
    .select("fullName emails")
    .lean();

  if (!candidate) {
    throw new Error(`Candidate ${candidateId} not found`);
  }

  const candidateEmail = candidate.emails?.[0] || "";

  if (!candidateEmail) {
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

  // 4. Get job
  const jobData = await Job.findById(jobId).lean();

  if (!jobData) {
    throw new Error(`Job ${jobId} not found`);
  }

  const jobTitle = jobData.jobDetails?.title || "New Job Opportunity";
  const companyName =
    jobData.jobDetails?.companyName || "GreatHire Company";

  // 5. Mark as pending before sending
  await CandidateJobMatch.updateOne(
    { _id: matchId, notificationStatus: { $ne: "SENT" } },
    {
      $set: {
        notificationStatus: "PENDING",
        notificationError: "",
      },
    }
  );

  // 6. Send email
  const emailResult = await sendJobMatchEmail(
  candidateEmail,
  candidate.fullName,
  jobTitle,
  companyName
);

// 7. SUCCESS
if (emailResult.success) {
  await CandidateJobMatch.updateOne(
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

  logger.queue("✅ Job match email sent", {
    matchId,
    candidateId,
    email: candidateEmail,
  });

  return;
}

// 8. TEMPORARY FAILURE
// Keep PENDING so the pending-email processor can retry later.
if (emailResult.temporaryFailure) {
  await CandidateJobMatch.updateOne(
    { _id: matchId },
    {
      $set: {
        notificationStatus: "PENDING",
        notificationError: emailResult.error,
      },
    }
  );

  logger.queue("⏳ Email kept pending for later retry", {
    matchId,
    candidateId,
    reason: emailResult.error,
  });

  return;
}

// 9. PERMANENT FAILURE
await CandidateJobMatch.updateOne(
  { _id: matchId },
  {
    $set: {
      notificationStatus: "FAILED",
      notificationError: emailResult.error,
    },
  }
);

logger.warn("job-match-email-worker", "Permanent email failure", {
  matchId,
  candidateId,
  error: emailResult.error,
});
}

export async function startJobMatchEmailWorker() {
  if (worker) return worker;

  const ok = await isRedisAvailable();

  if (!ok) {
    logger.warn(
      "job-match-email-worker",
      "Redis unavailable — email worker not started"
    );

    return null;
  }

  worker = new Worker(
    JOB_MATCH_EMAIL_QUEUE,
    processEmailJob,
    {
      connection: getRedisConnection(),
      concurrency: 2,
    }
  );

  worker.on("completed", (job) => {
    logger.queue("✅ Job match email job completed", {
      jobId: job.id,
      matchId: job.data.matchId,
    });
  });

  worker.on("failed", (job, err) => {
    logger.error(
      "job-match-email-worker",
      `Email job ${job?.id} failed`,
      err,
      {
        matchId: job?.data?.matchId,
        attempt: job?.attemptsMade,
      }
    );
  });

  worker.on("error", (err) => {
    logger.error(
      "job-match-email-worker",
      "Worker error",
      err
    );
  });

  logger.queue(
    `✅ Job match email worker started [${JOB_MATCH_EMAIL_QUEUE}]`
  );

  return worker;
}

export async function stopJobMatchEmailWorker() {
  if (worker) {
    await worker.close();
    worker = null;

    logger.queue("Job match email worker stopped");
  }
}