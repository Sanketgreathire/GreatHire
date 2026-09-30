import { FailedJob } from "../models/failedJob.model.js";

const DELAYS_MS = [1000, 2000, 4000, 8000]; // 1s, 2s, 4s, 8s
const MAX_ATTEMPTS = 5;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const retryWithBackoff = async (fn, { jobType, payload }) => {
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await fn();
      if (attempt > 1) {
        console.log(`✅ ${jobType} succeeded on attempt ${attempt}`);
      }
      return;
    } catch (error) {
      lastError = error;
      console.error(`❌ ${jobType} failed (attempt ${attempt}/${MAX_ATTEMPTS}):`, error.message);

      if (attempt < MAX_ATTEMPTS) {
        const delay = DELAYS_MS[attempt - 1];
        console.log(`⏳ Retrying ${jobType} in ${delay / 1000}s...`);
        await wait(delay);
      }
    }
  }

  try {
    await FailedJob.create({
      jobType,
      payload,
      attempts: MAX_ATTEMPTS,
      lastError: lastError?.message || "Unknown error",
      status: "failed",
    });
    console.error(`💀 ${jobType} moved to Dead Letter Queue after ${MAX_ATTEMPTS} attempts`);
  } catch (dlqError) {
    console.error("🔥 CRITICAL: Failed to save to DLQ:", dlqError.message);
  }
};