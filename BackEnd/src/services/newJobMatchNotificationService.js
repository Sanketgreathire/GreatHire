/**
 * newJobMatchNotificationService.js
 *
 * When a recruiter posts a NEW job:
<<<<<<< HEAD
 *
=======
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
 * 1. Get registered Job Seekers from User collection
 * 2. Parse the new Job Description using existing JD parser
 * 3. Convert User data into the format expected by existing scoreCandidate()
 * 4. Calculate existing match score
<<<<<<< HEAD
 * 5. Send email only when matchScore >= 70
=======
 * 5. Send email only when matchScore >= 50
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
 *
 * NOTE:
 * autoApply is intentionally NOT checked here.
 */

import { User } from "../../models/user.model.js";
<<<<<<< HEAD

import { parseJobDescription } from "../../jd-matching/services/jdParserService.js";

import { scoreCandidate } from "../../jd-matching/services/candidateMatchingService.js";

=======
import { parseJobDescription } from "../../jd-matching/services/jdParserService.js";
import { scoreCandidate } from "../../jd-matching/services/candidateMatchingService.js";
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
import { sendNewJobMatchEmail } from "./jobMatchEmailService.js";

const MATCH_THRESHOLD = 70;

<<<<<<< HEAD
console.log(
  "BREVO KEY EXISTS:",
  !!process.env.BREVO_API_KEY
);

=======
console.log("BREVO KEY EXISTS:", !!process.env.BREVO_API_KEY);
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
console.log(
  "BREVO KEY PREFIX:",
  process.env.BREVO_API_KEY?.substring(0, 10)
);

/**
 * Convert GreatHire User document into the candidate
 * structure expected by existing scoreCandidate().
 */
function mapUserToCandidate(user) {
<<<<<<< HEAD
  // console.log("👤 Candidate profile:", {
  //   name: user.fullname,
  //   email: user.emailId?.email,
  //   skills: user.profile?.skills,
  //   experiences: user.profile?.experiences,
  // });
=======
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
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3

  const experiences = user.profile?.experiences || [];

  const currentExperience =
    experiences.find((exp) => exp.currentlyWorking) ||
    experiences[experiences.length - 1];

  const totalExperience = experiences.reduce((total, exp) => {
    const duration = String(exp.duration || "");

    const yearMatch = duration.match(
<<<<<<< HEAD
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
=======
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

>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
    return total;
  }, 0);

  const location = [
    user.address?.city,
    user.address?.state,
  ]
    .filter(Boolean)
    .join(", ");

<<<<<<< HEAD
    const userSkills = Array.isArray(user.profile?.skills)
  ? user.profile.skills.filter(Boolean)
  : typeof user.profile?.skills === "string"
    ? [user.profile.skills]
    : [];

  const candidate = {
=======
  return {
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
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
<<<<<<< HEAD

  // console.log("🎯 Candidate used for matching:", {
  //   name: candidate.fullName,
  //   designation: candidate.designation,
  //   experience: candidate.totalExperience,
  //   skills: candidate.skills,
  // });

  return candidate;
=======
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
}

/**
 * Send notification emails to Job Seekers whose profile
<<<<<<< HEAD
 * matches the newly posted job by 70% or more.
=======
 * matches the newly posted job by 50% or more.
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
 *
 * @param {Object} job - Newly created Job document
 * @returns {Object} notification statistics
 */
export async function notifyMatchingJobSeekers(job) {
<<<<<<< HEAD

  //  console.log("========================================");
  // console.log("🚀 notifyMatchingJobSeekers() CALLED");
  // console.log("🔥 JOB ID:", job?._id);
  // console.log("🔥 JOB TITLE:", job?.jobDetails?.title);
  // console.log("========================================");

=======
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
  const stats = {
    totalUsers: 0,
    matchedUsers: 0,
    emailsSent: 0,
    emailsFailed: 0,
  };

  try {
    if (!job) {
<<<<<<< HEAD
      throw new Error(
        "Job is required for matching notification"
      );
=======
      throw new Error("Job is required for matching notification");
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
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

<<<<<<< HEAD
    console.log(
      "📝 Parsing new job:",
      job.jobDetails?.title
    );

=======
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
    // ---------------------------------------------------------
    // 2. Use EXISTING JD parser
    // ---------------------------------------------------------

<<<<<<< HEAD
    const parsedData =
      await parseJobDescription(rawText);
=======
    const parsedData = await parseJobDescription(rawText);
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3

    const matchingJd = {
      ...parsedData,

      // Existing scoreCandidate() expects these fields
      requiredSkills: parsedData.skills || [],
<<<<<<< HEAD

      preferredSkills: [],

      designation:
        parsedData.designation ||
        job.jobDetails?.title ||
        "",

      experience:
        parsedData.experience ||
        job.jobDetails?.experience ||
        "",

      location:
        parsedData.location ||
        job.jobDetails?.location ||
        "",

      minExperience: 0,

      maxExperience: 99,
    };

    console.log(
      "🎯 JD prepared for matching:",
      {
        designation: matchingJd.designation,
        skills: matchingJd.requiredSkills,
        experience: matchingJd.experience,
        location: matchingJd.location,
      }
    );

    // ---------------------------------------------------------
    // 3. Get registered Job Seekers
    // ---------------------------------------------------------
    //
    // IMPORTANT:
    // autoApply is NOT checked here.
=======
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
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
    //
    // autoApply ON  -> eligible
    // autoApply OFF -> eligible
    //
<<<<<<< HEAD
    // Current/latest profile is fetched from DB.
    //

    const users = await User.find({
      role: "student",

      "emailId.email": {
        $exists: true,
        $ne: "",
      },
    })
      .select(
        "fullname emailId profile.skills profile.experiences profile.bio profile.resume address"
      )
      .lean();
=======
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
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3

    stats.totalUsers = users.length;

    console.log(
      `📊 Checking ${users.length} Job Seekers for new job: ${job.jobDetails?.title}`
    );

<<<<<<< HEAD
    // console.log(
    //   "📊 REGISTERED JOB SEEKERS:",
    //   users.length
    // );
=======
    console.log("📊 REGISTERED JOB SEEKERS:", users.length);
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3

    // ---------------------------------------------------------
    // 4. Match every Job Seeker
    // ---------------------------------------------------------

    for (const user of users) {
      try {
<<<<<<< HEAD
    //     console.log("🧪 testCandidate:", {
    //   id: user._id,
    //   name: user.fullname,
    //   email: user.emailId?.email,
    //   skills: user.profile?.skills,
    // });
        /**
         * IMPORTANT:
         *
         * This uses the user's CURRENT profile from MongoDB.
         *
         * Example:
         *
         * Old designation:
         * Software Developer
         *
         * User updates profile:
         * HR
         *
         * Then this candidate will contain:
         *
         * designation: "HR"
         *
         * So new HR jobs are matched against HR profile.
         */

        const candidate =
          mapUserToCandidate(user);

        // -----------------------------------------------------
        // Existing matching logic
        // -----------------------------------------------------

=======
        const candidate = mapUserToCandidate(user);

        // Use EXISTING matching logic.
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
        const result = scoreCandidate(
          candidate,
          matchingJd,
          0
        );

<<<<<<< HEAD
        const matchScore = Number(
          result?.matchScore || 0
        );

        // console.log(
        //   `🔎 ${user.fullname} → ${job.jobDetails?.title}: ${matchScore}%`
        // );

        // -----------------------------------------------------
        // 5. Only 70% or higher gets email
        // -----------------------------------------------------

        if (matchScore < MATCH_THRESHOLD) {
          // console.log(
          //   `⏭️ Email skipped for ${user.fullname} - Match ${matchScore}%`
          // );

=======
        const matchScore = result.matchScore;

        console.log(
          `🔎 ${user.fullname} → ${job.jobDetails?.title}: ${matchScore}%`
        );

        // -------------------------------------------------------
        // 5. Only 70% or higher gets email
        // -------------------------------------------------------

        if (matchScore < MATCH_THRESHOLD) {
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
          continue;
        }

        stats.matchedUsers++;

        const email = user.emailId?.email;

        if (!email) {
          console.warn(
            `⚠️ No email found for Job Seeker: ${user.fullname}`
          );
<<<<<<< HEAD

          continue;
        }

        // -----------------------------------------------------
        // 6. Send email
        // -----------------------------------------------------

        console.log(
          `📧 Sending ${matchScore}% match email to ${email}`
        );

        const emailSent =
          await sendNewJobMatchEmail({
            email,

            fullname: user.fullname,

            jobId: job._id.toString(),

            jobTitle: job.jobDetails?.title,

            companyName:
              job.jobDetails?.companyName,

            matchPercentage: matchScore,
          });

        if (emailSent) {
          stats.emailsSent++;

          console.log(
            `✅ Match email sent to ${email}`
          );
        } else {
          stats.emailsFailed++;

          console.log(
            `❌ Email sending failed for ${email}`
          );
=======
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
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
        }
      } catch (userError) {
        stats.emailsFailed++;

<<<<<<< HEAD
        // console.error(
        //   `❌ Matching failed for ${user.fullname}:`,
        //   userError.message
        // );
=======
        console.error(
          `❌ Matching failed for ${user.fullname}:`,
          userError.message
        );
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
      }
    }

    console.log(
<<<<<<< HEAD
      `✅ New job notification completed | ` +
        `Job: ${job._id} | ` +
        `Users: ${stats.totalUsers} | ` +
        `70%+ Matches: ${stats.matchedUsers} | ` +
=======
      `✅ New job notification completed | Job: ${job._id} | ` +
        `Users: ${stats.totalUsers} | ` +
        `30%+ Matches: ${stats.matchedUsers} | ` +
>>>>>>> b45073ac91393ef342b08753a5cae28f470470e3
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