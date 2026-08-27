/**
 * newJobMatchNotificationService.js
 *
 * When a recruiter posts a NEW job:
 * 1. Get registered Job Seekers from User collection
 * 2. Parse the new Job Description using existing JD parser
 * 3. Convert User data into the format expected by existing scoreCandidate()
 * 4. Calculate existing match score
 * 5. Send email only when matchScore >= 50
 *
 * NOTE:
 * autoApply is intentionally NOT checked here.
 */

import { User } from "../../models/user.model.js";
import { parseJobDescription } from "../../jd-matching/services/jdParserService.js";
import { scoreCandidate } from "../../jd-matching/services/candidateMatchingService.js";
import { sendNewJobMatchEmail } from "./jobMatchEmailService.js";

const MATCH_THRESHOLD = 70;

console.log("BREVO KEY EXISTS:", !!process.env.BREVO_API_KEY);
console.log(
  "BREVO KEY PREFIX:",
  process.env.BREVO_API_KEY?.substring(0, 10)
);

/**
 * Convert GreatHire User document into the candidate
 * structure expected by existing scoreCandidate().
 */
function mapUserToCandidate(user) {
  console.log("👤 Candidate profile:", {
  name: user.fullname,
  email: user.emailId?.email,
  skills: user.profile?.skills,
  experiences: user.profile?.experiences,
}); 

console.log("🎯 Candidate used for matching:", {
  name: candidate.fullName,
  designation: candidate.designation,
  experience: candidate.totalExperience,
  skills: candidate.skills,
}); 

  const experiences = user.profile?.experiences || [];

  const currentExperience =
    experiences.find((exp) => exp.currentlyWorking) ||
    experiences[experiences.length - 1];

  const totalExperience = experiences.reduce((total, exp) => {
    const duration = String(exp.duration || "");

    const yearMatch = duration.match(
      /(\d+(?:\.\d+)?)\s*(?:year|years|yr|yrs)/i
    );

    if (yearMatch) {
      return total + parseFloat(yearMatch[1]);
    }

    const monthMatch = duration.match(
      /(\d+)\s*(?:month|months|mo|mos)/i
    );

    if (monthMatch) {
      return total + parseFloat(monthMatch[1]) / 12;
    }

    return total;
  }, 0);

  const location = [
    user.address?.city,
    user.address?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    skills: user.profile?.skills || [],
    normalizedSkills: user.profile?.skills || [],
    totalExperience: Number(totalExperience.toFixed(1)),
    designation: currentExperience?.jobProfile || "",
    location,
    summary: user.profile?.bio || "",
    resume: user.profile?.resume || "",
    fullName: user.fullname,
    email: user.emailId?.email,
  };
}

/**
 * Send notification emails to Job Seekers whose profile
 * matches the newly posted job by 50% or more.
 *
 * @param {Object} job - Newly created Job document
 * @returns {Object} notification statistics
 */
export async function notifyMatchingJobSeekers(job) {
  const stats = {
    totalUsers: 0,
    matchedUsers: 0,
    emailsSent: 0,
    emailsFailed: 0,
  };

  try {
    if (!job) {
      throw new Error("Job is required for matching notification");
    }

    // ---------------------------------------------------------
    // 1. Build raw Job Description
    // ---------------------------------------------------------

    const rawText = [
      job.jobDetails?.title,
      job.jobDetails?.details,
      (job.jobDetails?.skills || []).join(", "),
      (job.jobDetails?.qualifications || []).join(", "),
      (job.jobDetails?.responsibilities || []).join(", "),
    ]
      .filter(Boolean)
      .join("\n");

    // ---------------------------------------------------------
    // 2. Use EXISTING JD parser
    // ---------------------------------------------------------

    const parsedData = await parseJobDescription(rawText);

    const matchingJd = {
      ...parsedData,

      // Existing scoreCandidate() expects these fields
      requiredSkills: parsedData.skills || [],
      preferredSkills: [],

      // Keep job data available for existing scoring functions
      designation:
        parsedData.designation || job.jobDetails?.title || "",

      experience:
        parsedData.experience || job.jobDetails?.experience || "",

      location:
        parsedData.location || job.jobDetails?.location || "",

         minExperience: 0,
  maxExperience: 99,
    };

    // ---------------------------------------------------------
    // 3. Get registered Job Seekers
    // ---------------------------------------------------------

    // IMPORTANT:
    // autoApply is NOT used here.
    //
    // autoApply ON  -> eligible
    // autoApply OFF -> eligible
    //
    // Only role/student users are considered Job Seekers.

    const users = await User.find({
  role: "student",
  "emailId.email": {
    $exists: true,
    $ne: "",
    }
   
  },
)

  .select(
    "fullname emailId profile.skills profile.experiences profile.bio profile.resume address"
  )
  .lean();

    stats.totalUsers = users.length;

    console.log(
      `📊 Checking ${users.length} Job Seekers for new job: ${job.jobDetails?.title}`
    );

    console.log("📊 REGISTERED JOB SEEKERS:", users.length);

    // ---------------------------------------------------------
    // 4. Match every Job Seeker
    // ---------------------------------------------------------

    for (const user of users) {
      try {
        const candidate = mapUserToCandidate(user);

        // Use EXISTING matching logic.
        const result = scoreCandidate(
          candidate,
          matchingJd,
          0
        );

        const matchScore = result.matchScore;

        console.log(
          `🔎 ${user.fullname} → ${job.jobDetails?.title}: ${matchScore}%`
        );

        // -------------------------------------------------------
        // 5. Only 70% or higher gets email
        // -------------------------------------------------------

        if (matchScore < MATCH_THRESHOLD) {
          continue;
        }

        stats.matchedUsers++;

        const email = user.emailId?.email;

        if (!email) {
          console.warn(
            `⚠️ No email found for Job Seeker: ${user.fullname}`
          );
          continue;
        }

        // -------------------------------------------------------
        // 6. Send email
        // -------------------------------------------------------

        const emailSent = await sendNewJobMatchEmail({
          email,
          fullname: user.fullname,
          jobId: job._id.toString(),
          jobTitle: job.jobDetails?.title,
          companyName: job.jobDetails?.companyName,
          matchPercentage: matchScore,
        });

        if (emailSent) {
          stats.emailsSent++;
        } else {
          stats.emailsFailed++;
        }
      } catch (userError) {
        stats.emailsFailed++;

        console.error(
          `❌ Matching failed for ${user.fullname}:`,
          userError.message
        );
      }
    }

    console.log(
      `✅ New job notification completed | Job: ${job._id} | ` +
        `Users: ${stats.totalUsers} | ` +
        `30%+ Matches: ${stats.matchedUsers} | ` +
        `Emails Sent: ${stats.emailsSent} | ` +
        `Failed: ${stats.emailsFailed}`
    );

    return stats;
  } catch (error) {
    console.error(
      `❌ New job matching notification failed for job ${job?._id}:`,
      error.message
    );

    throw error;
  }
}