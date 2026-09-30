

// import { User } from "../../models/user.model.js";

// import { parseJobDescription } from "../../jd-matching/services/jdParserService.js";

// import { scoreCandidate } from "../../jd-matching/services/candidateMatchingService.js";

// import { sendNewJobMatchEmail } from "./jobMatchEmailService.js";


// // ============================================================
// // MATCH THRESHOLD
// // ============================================================

// const MATCH_THRESHOLD = 60;


// // ============================================================
// // CONVERT USER → CANDIDATE
// // ============================================================

// function mapUserToCandidate(user) {

//   const experiences = Array.isArray(
//     user.profile?.experiences
//   )
//     ? user.profile.experiences
//     : [];


//   const currentExperience =
//     experiences.find(
//       (exp) => exp?.currentlyWorking
//     ) ||
//     experiences[experiences.length - 1];


//   // ----------------------------------------------------------
//   // Calculate total experience
//   // ----------------------------------------------------------

//   const totalExperience = experiences.reduce(
//     (total, exp) => {

//       const duration = String(
//         exp?.duration || ""
//       );


//       const yearMatch = duration.match(
//         /(\d+(?:\.\d+)?)\s*(?:year|years|yr|yrs)/i
//       );


//       if (yearMatch) {

//         return (
//           total +
//           parseFloat(yearMatch[1])
//         );

//       }


//       const monthMatch = duration.match(
//         /(\d+)\s*(?:month|months|mo|mos)/i
//       );


//       if (monthMatch) {

//         return (
//           total +
//           parseFloat(monthMatch[1]) / 12
//         );

//       }


//       return total;

//     },
//     0
//   );


//   // ----------------------------------------------------------
//   // Location
//   // ----------------------------------------------------------

//   const location = [
//     user.address?.city,
//     user.address?.state,
//   ]
//     .filter(Boolean)
//     .join(", ");


//   // ----------------------------------------------------------
//   // Skills
//   // ----------------------------------------------------------

//   const userSkills =
//     Array.isArray(user.profile?.skills)
//       ? user.profile.skills.filter(Boolean)
//       : typeof user.profile?.skills === "string"
//         ? [user.profile.skills]
//         : [];


//   // ----------------------------------------------------------
//   // Candidate object
//   // ----------------------------------------------------------

//   return {

//     skills: userSkills,

//     normalizedSkills: userSkills,

//     totalExperience: Number(
//       totalExperience.toFixed(1)
//     ),

//     designation:
//       currentExperience?.jobProfile ||
//       currentExperience?.designation ||
//       "",

//     location,

//     summary:
//       user.profile?.bio || "",

//     resume:
//       user.profile?.resume || "",

//     fullName:
//       user.fullname || "",

//     email:
//       user.emailId?.email || "",

//   };
// }


// // ============================================================
// // MAIN FUNCTION
// // ============================================================

// export async function notifyMatchingJobSeekers(job) {

//   const stats = {

//     totalUsers: 0,

//     matchedUsers: 0,

//     emailsSent: 0,

//     emailsFailed: 0,

//     matchedCandidates: [],

//   };


//   try {

//     // ========================================================
//     // VALIDATION
//     // ========================================================

//     if (!job) {

//       throw new Error(
//         "Job is required for matching notification"
//       );

//     }


//     if (!job._id) {

//       throw new Error(
//         "Job ID is missing"
//       );

//     }


//     // ========================================================
//     // ONLY ACTIVE JOB
//     // ========================================================

//     if (!job.jobDetails?.isActive) {

//       return stats;

//     }


//     // ========================================================
//     // JOB TITLE
//     // ========================================================

//     const jobTitle =
//       job.jobDetails?.title || "";


//     // ========================================================
//     // BUILD JOB DESCRIPTION
//     // ========================================================

//     const rawText = [

//       job.jobDetails?.title,

//       job.jobDetails?.details,

//       ...(Array.isArray(
//         job.jobDetails?.skills
//       )
//         ? job.jobDetails.skills
//         : []),

//       ...(Array.isArray(
//         job.jobDetails?.qualifications
//       )
//         ? job.jobDetails.qualifications
//         : []),

//       ...(Array.isArray(
//         job.jobDetails?.responsibilities
//       )
//         ? job.jobDetails.responsibilities
//         : []),

//       job.jobDetails?.experience,

//       job.jobDetails?.location,

//     ]
//       .filter(Boolean)
//       .join("\n");


//     // ========================================================
//     // PARSE JOB DESCRIPTION
//     // ========================================================

//     const parsedData =
//       await parseJobDescription(rawText);


//     // ========================================================
//     // PREPARE JD
//     // ========================================================

//     const matchingJd = {

//       ...parsedData,

//       requiredSkills:
//         parsedData?.skills ||
//         job.jobDetails?.skills ||
//         [],

//       preferredSkills: [],

//       designation:
//         parsedData?.designation ||
//         jobTitle ||
//         "",

//       experience:
//         parsedData?.experience ||
//         job.jobDetails?.experience ||
//         "",

//       location:
//         parsedData?.location ||
//         job.jobDetails?.location ||
//         "",

//       minExperience: 0,

//       maxExperience: 99,

//     };


//     // ========================================================
//     // GET REGISTERED JOB SEEKERS
//     // ========================================================

//     const users = await User.find({

//       role: "student",

//       "emailId.email": {

//         $exists: true,

//         $ne: "",

//       },

//     })
//       .select(

//         [
//           "fullname",
//           "emailId",
//           "profile.skills",
//           "profile.experiences",
//           "profile.bio",
//           "profile.resume",
//           "address",
//         ].join(" ")

//       )
//       .lean();


//     stats.totalUsers =
//       users.length;


//     // ========================================================
//     // CHECK EVERY USER
//     // ========================================================

//     for (const user of users) {

//       try {

//         // ----------------------------------------------------
//         // Convert user to candidate
//         // ----------------------------------------------------

//         const candidate =
//           mapUserToCandidate(user);


//         // ----------------------------------------------------
//         // EXISTING MATCHING LOGIC
//         // ----------------------------------------------------

//         const result =
//           await scoreCandidate(
//             candidate,
//             matchingJd
//           );


//         const matchScore =
//           Math.round(
//             Number(
//               result?.matchScore
//             ) || 0
//           );


//         // ----------------------------------------------------
//         // BELOW 60%
//         // COMPLETELY HIDDEN
//         // ----------------------------------------------------

//         if (
//           matchScore <
//           MATCH_THRESHOLD
//         ) {

//           continue;

//         }


//         // ----------------------------------------------------
//         // EMAIL
//         // ----------------------------------------------------

//         const candidateEmail =
//           user.emailId?.email || "";


//         // ----------------------------------------------------
//         // MATCHED CANDIDATE COUNT
//         // ----------------------------------------------------

//         stats.matchedUsers++;


//         stats.matchedCandidates.push({

//           name:
//             user.fullname ||
//             "Unknown",

//           email:
//             candidateEmail ||
//             "No Email",

//           matchPercentage:
//             matchScore,

//         });


//         // ====================================================
//         // SHOW MATCHED CANDIDATE
//         // ====================================================

//         console.log(
//           `🔎 ${user.fullname} → ${jobTitle}: ${matchScore}%`
//         );


//         // ====================================================
//         // SEND EMAIL
//         // ====================================================

//         if (!candidateEmail) {

//           stats.emailsFailed++;

//           console.log(
//             `⚠️ EMAIL NOT SENT: No email (${matchScore}% match)`
//           );

//           continue;

//         }


//         try {

//           await sendNewJobMatchEmail({

//             email:
//               candidateEmail,

//             name:
//               user.fullname,

//             jobTitle,

//             matchPercentage:
//               matchScore,

//             jobId:
//               job._id,

//           });


//           // --------------------------------------------------
//           // EMAIL SUCCESS
//           // --------------------------------------------------

//           stats.emailsSent++;


//           console.log(
//             "\n========== BREVO EMAIL DEBUG =========="
//           );


//           console.log(
//             "Candidate Email:",
//             candidateEmail
//           );


//           console.log(
//             "Candidate Name:",
//             user.fullname
//           );


//           console.log(
//             "Job Title:",
//             jobTitle
//           );


//           console.log(
//             "Match Percentage:",
//             matchScore
//           );


//           console.log(
//             "BREVO KEY EXISTS:",
//             !!process.env.BREVO_API_KEY
//           );


//           console.log(
//             "BREVO SENDER:",
//             process.env.BREVO_SENDER_EMAIL
//           );


//           console.log(
//             "========================================\n"
//           );


//           console.log(
//             "✅ EMAIL ACCEPTED BY BREVO"
//           );


//           console.log(
//             "📧 EMAIL SENT TO:",
//             candidateEmail
//           );


//           console.log(
//             `✅ Job match email sent to ${candidateEmail} (${matchScore}% match)`
//           );


//         } catch (emailError) {

//           // --------------------------------------------------
//           // EMAIL FAILED
//           // Candidate is still a MATCHED candidate.
//           // --------------------------------------------------

//           stats.emailsFailed++;


//           console.log(
//             `⚠️ EMAIL NOT SENT: ${candidateEmail} (${matchScore}% match)`
//           );

//         }


//       } catch (candidateError) {

//         // ----------------------------------------------------
//         // Candidate error completely hidden
//         // ----------------------------------------------------

//         continue;

//       }

//     }


//     // ========================================================
//     // MATCHED CANDIDATES
//     // ========================================================

//     console.log(
//       "\n========== MATCHED CANDIDATES =========="
//     );


//     stats.matchedCandidates.forEach(
//       (candidate, index) => {

//         console.log(

//           `${index + 1}. ${candidate.name} → ${candidate.matchPercentage}% → ${candidate.email}`

//         );

//       }
//     );


//     console.log(
//       "========================================"
//     );


//     // ========================================================
//     // FINAL SUMMARY
//     // ========================================================

//     console.log(
//       `\n📊 ${stats.matchedUsers} users matched ${MATCH_THRESHOLD}%+`
//     );


//     console.log(
//       `📧 ${stats.emailsSent} emails sent`
//     );


//     console.log(
//       `⚠️ ${stats.emailsFailed} emails not sent`
//     );


//     return stats;


//   } catch (error) {

//     // Only actual service-level error
//     // will be passed to caller.

//     throw error;

//   }

// }

import { User } from "../../models/user.model.js";

import { parseJobDescription } from "../../jd-matching/services/jdParserService.js";

import { scoreCandidate } from "../../jd-matching/services/candidateMatchingService.js";

import { sendNewJobMatchEmail } from "./jobMatchEmailService.js";

// ============================================================
// MATCH THRESHOLD
// ============================================================

const MATCH_THRESHOLD = 60;

// ============================================================
// CONVERT USER → CANDIDATE
// ============================================================

function mapUserToCandidate(user) {
  const experiences = Array.isArray(user.profile?.experiences)
    ? user.profile.experiences
    : [];

  const currentExperience =
    experiences.find((exp) => exp?.currentlyWorking) ||
    experiences[experiences.length - 1];

  // ----------------------------------------------------------
  // Calculate total experience
  // ----------------------------------------------------------

  const totalExperience = experiences.reduce((total, exp) => {
    const duration = String(exp?.duration || "");

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

  // ----------------------------------------------------------
  // Location
  // ----------------------------------------------------------

  const location = [
    user.address?.city,
    user.address?.state,
  ]
    .filter(Boolean)
    .join(", ");

  // ----------------------------------------------------------
  // Skills
  // ----------------------------------------------------------

  const userSkills = Array.isArray(user.profile?.skills)
    ? user.profile.skills.filter(Boolean)
    : typeof user.profile?.skills === "string"
      ? [user.profile.skills]
      : [];

  // ----------------------------------------------------------
  // Candidate object
  // ----------------------------------------------------------

  return {
    skills: userSkills,

    normalizedSkills: userSkills,

    totalExperience: Number(
      totalExperience.toFixed(1)
    ),

    designation:
      currentExperience?.jobProfile ||
      currentExperience?.designation ||
      "",

    location,

    summary:
      user.profile?.bio || "",

    resume:
      user.profile?.resume || "",

    fullName:
      user.fullname || "",

    email:
      user.emailId?.email || "",
  };
}

// ============================================================
// MAIN FUNCTION
// ============================================================

export async function notifyMatchingJobSeekers(job) {
  const stats = {
    totalUsers: 0,
    matchedUsers: 0,
    emailsSent: 0,
    emailsFailed: 0,
    matchedCandidates: [],
  };

  try {
    // ========================================================
    // VALIDATION
    // ========================================================

    if (!job) {
      throw new Error(
        "Job is required for matching notification"
      );
    }

    if (!job._id) {
      throw new Error(
        "Job ID is missing"
      );
    }

    // ========================================================
    // ONLY ACTIVE JOB
    // ========================================================

    if (!job.jobDetails?.isActive) {
      return stats;
    }

    // ========================================================
    // JOB TITLE
    // ========================================================

    const jobTitle =
      job.jobDetails?.title || "";

    // ========================================================
    // BUILD JOB DESCRIPTION
    // ========================================================

    const rawText = [
      job.jobDetails?.title,

      job.jobDetails?.details,

      ...(Array.isArray(job.jobDetails?.skills)
        ? job.jobDetails.skills
        : []),

      ...(Array.isArray(job.jobDetails?.qualifications)
        ? job.jobDetails.qualifications
        : []),

      ...(Array.isArray(job.jobDetails?.responsibilities)
        ? job.jobDetails.responsibilities
        : []),

      job.jobDetails?.experience,

      job.jobDetails?.location,
    ]
      .filter(Boolean)
      .join("\n");

    // ========================================================
    // PARSE JOB DESCRIPTION
    // ========================================================

    const parsedData =
      await parseJobDescription(rawText);

    // ========================================================
    // PREPARE JD
    // ========================================================

    const matchingJd = {
      ...parsedData,

      requiredSkills:
        parsedData?.skills ||
        job.jobDetails?.skills ||
        [],

      preferredSkills: [],

      designation:
        parsedData?.designation ||
        jobTitle ||
        "",

      experience:
        parsedData?.experience ||
        job.jobDetails?.experience ||
        "",

      location:
        parsedData?.location ||
        job.jobDetails?.location ||
        "",

      minExperience: 0,

      maxExperience: 99,
    };

    // ========================================================
    // GET REGISTERED JOB SEEKERS
    // ========================================================

    const users = await User.find({
      role: "student",

      "emailId.email": {
        $exists: true,
        $ne: "",
      },
    })
      .select(
        [
          "fullname",
          "emailId",
          "profile.skills",
          "profile.experiences",
          "profile.bio",
          "profile.resume",
          "address",
        ].join(" ")
      )
      .lean();

    stats.totalUsers = users.length;

    // ========================================================
    // CHECK EVERY USER
    // ========================================================

    for (const user of users) {
      try {
        // ----------------------------------------------------
        // Convert user to candidate
        // ----------------------------------------------------

        const candidate =
          mapUserToCandidate(user);

        // ----------------------------------------------------
        // EXISTING MATCHING LOGIC
        // ----------------------------------------------------

        const result =
          await scoreCandidate(
            candidate,
            matchingJd
          );

        const matchScore =
          Math.round(
            Number(result?.matchScore) || 0
          );

        // ----------------------------------------------------
        // BELOW 60%
        // COMPLETELY HIDDEN
        // ----------------------------------------------------

        if (
          matchScore <
          MATCH_THRESHOLD
        ) {
          continue;
        }

        // ----------------------------------------------------
        // EMAIL
        // ----------------------------------------------------

        const candidateEmail =
          user.emailId?.email || "";

        // ----------------------------------------------------
        // MATCHED CANDIDATE COUNT
        // ----------------------------------------------------

        stats.matchedUsers++;

        stats.matchedCandidates.push({
          name:
            user.fullname ||
            "Unknown",

          email:
            candidateEmail ||
            "No Email",

          matchPercentage:
            matchScore,
        });

        // ====================================================
        // SHOW MATCHED CANDIDATE
        // ====================================================

        console.log(
          `🔎 ${user.fullname} → ${jobTitle}: ${matchScore}%`
        );

        // ====================================================
        // SEND EMAIL
        // ====================================================

        if (!candidateEmail) {
          stats.emailsFailed++;

          console.log(
            `⚠️ EMAIL NOT SENT: No email (${matchScore}% match)`
          );

          continue;
        }

        try {
          await sendNewJobMatchEmail({
            email: candidateEmail,

            name: user.fullname,

            jobTitle,

            matchPercentage: matchScore,

            jobId: job._id,
          });

          // --------------------------------------------------
          // EMAIL SUCCESS
          // --------------------------------------------------

          stats.emailsSent++;

          console.log(
            `✅ EMAIL SENT TO: ${candidateEmail} (${matchScore}% match)`
          );

        } catch (emailError) {
          // --------------------------------------------------
          // EMAIL FAILED
          // Candidate is still a MATCHED candidate.
          // --------------------------------------------------

          stats.emailsFailed++;

          console.log(
            `⚠️ EMAIL NOT SENT: ${candidateEmail} (${matchScore}% match)`
          );

          console.error(
            "Email Error:",
            emailError.message
          );
        }

      } catch (candidateError) {
        // ----------------------------------------------------
        // Candidate error completely hidden
        // ----------------------------------------------------

        continue;
      }
    }

    // ========================================================
    // MATCHED CANDIDATES
    // ========================================================

    console.log(
      "\n========== MATCHED CANDIDATES =========="
    );

    stats.matchedCandidates.forEach(
      (candidate, index) => {
        console.log(
          `${index + 1}. ${candidate.name} → ${candidate.matchPercentage}% → ${candidate.email}`
        );
      }
    );

    console.log(
      "========================================"
    );

    // ========================================================
    // FINAL SUMMARY
    // ========================================================

    console.log(
      `\n📊 ${stats.matchedUsers} users matched ${MATCH_THRESHOLD}%+`
    );

    console.log(
      `📧 ${stats.emailsSent} emails sent`
    );

    console.log(
      `⚠️ ${stats.emailsFailed} emails not sent`
    );

    return stats;

  } catch (error) {
    // Only actual service-level error
    // will be passed to caller.

    throw error;
  }
}