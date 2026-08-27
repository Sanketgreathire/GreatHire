import { User } from "../../models/user.model.js";
import { Job } from "../../models/job.model.js";
import { Application } from "../../models/application.model.js";
import notificationService from "../../utils/notificationService.js";
import { calculateMatchPercentage } from "./resumeMatching.service.js";




const AUTO_APPLY_THRESHOLD = 65;

export const autoApply = async (jobId) => {
  try {
   console.log("🚀 AUTO APPLY FUNCTION CALLED");
    console.log("🎯 AUTO APPLY JOB ID:", jobId);
    // 1. Find the newly posted job
    const job = await Job.findById(jobId);

    if (!job) {
      console.log(`Auto Apply: Job ${jobId} not found`);
      return;
    }

    // 2. Only process active jobs
    if (!job.jobDetails?.isActive) {
      console.log(`Auto Apply: Job ${jobId} is not active`);
      return;
    }

    // 3. Get users who enabled Auto Apply
    const users = await User.find({
      "profile.autoApply": true,
    });

    console.log("👥 AUTO APPLY USERS FOUND:", users.length);

users.forEach((user) => {
  console.log("👤 User ID:", user._id);
  console.log("👤 User Name:", user.fullname);
  console.log("⚡ Auto Apply:", user.profile?.autoApply);
});

    console.log("========== AUTO APPLY DEBUG ==========");
console.log("Auto Apply users count:", users.length);

users.forEach((user) => {
  console.log("User:", user._id);
  console.log("Name:", user.fullname);
  console.log("Auto Apply:", user.profile?.autoApply);
  console.log("Skills:", user.profile?.skills);
});

console.log("======================================");




    // 4. Get job skills
    const jobSkills = job.jobDetails?.skills || [];

    console.log("💼 JOB SKILLS:", jobSkills);
console.log("💼 JOB SKILLS COUNT:", jobSkills.length);

    if (!jobSkills.length) {
      console.log(`Auto Apply: Job ${jobId} has no skills`);
      return;
    }

    // 5. Check every user
    for (const user of users) {
      try {
        // Get user's skills
        const userSkills = user.profile?.skills || [];

        console.log("👤 USER:", user.fullname);
console.log("🛠️ USER SKILLS:", userSkills);
console.log("🛠️ USER SKILLS COUNT:", userSkills.length);

        if (!userSkills.length) {
          console.log(
            `Auto Apply: User ${user._id} has no skills`
          );
          continue;
        }

        // 6. Calculate match percentage
        const matchPercentage = calculateMatchPercentage(
          userSkills,
          jobSkills
        );

//         console.log("📊 MATCH CALCULATION");
// console.log("👤 User:", user.fullname);
// console.log("🛠️ User Skills:", userSkills);
// console.log("💼 Job Skills:", jobSkills);
// console.log("📈 Match Percentage:", matchPercentage + "%");
// console.log("🎯 Required Threshold:", AUTO_APPLY_THRESHOLD + "%");

        console.log(
          `Auto Apply: User ${user._id} → Job ${jobId} → ${matchPercentage}%`
        );

        // 7. Apply only if match is 65% or more
        if (matchPercentage < AUTO_APPLY_THRESHOLD) {
          console.log(
            `Auto Apply: User ${user._id} skipped (${matchPercentage}%)`
          );
          continue;
        }

        // 8. Check duplicate application
        const existingApplication = await Application.findOne({
          job: jobId,
          applicant: user._id,
        });

//         console.log("🔎 CHECKING EXISTING APPLICATION");
// console.log("👤 Applicant:", user._id);
// console.log("💼 Job:", jobId);
// console.log(
//   "📌 Existing Application:",
//   existingApplication ? existingApplication._id : "NONE"
// );

        if (existingApplication) {
          console.log(
            `Auto Apply: User ${user._id} already applied`
          );
          continue;
        }

        // 9. Create new application
//         console.log("📝 CREATING AUTO APPLICATION");
// console.log("👤 Applicant:", user._id);
// console.log("💼 Job:", jobId);
// console.log("📈 Match:", matchPercentage + "%"); 

        const newApplication = new Application({
          job: jobId,
          applicant: user._id,

          applicantName: user.fullname || "Unknown",

          applicantEmail:
            user.emailId?.email || "noemail@example.com",

          applicantPhone:
            user.phoneNumber?.number || "",

          applicantProfile:
            user.profile || {},

          resume:
            user.profile?.resume || "",

          answers: [],

          status: "Pending",

          isAutoApplied: true,
          matchPercentage: matchPercentage,
        });

        // 10. Save application
        await newApplication.save();

        // 11. Add application to Job
        await Job.findByIdAndUpdate(jobId, {
          $push: {
            application: newApplication._id,
          },
        });

        // 12. Create Notification for User
        const jobTitle = job.jobDetails?.title || "a new job";

       await notificationService.createAndEmit({
  recipient: user._id,
  recipientModel: "User",
  type: "auto-apply",
  title: "🎯 Job Auto-Applied!",
  message: `You were automatically applied to "${jobTitle}" with a ${matchPercentage}% match score.`,
  relatedEntity: jobId,
  relatedEntityModel: "Job",
  priority: "medium",
  actionUrl: `/jobs/${jobId}`,
  metadata: {
    matchPercentage,
    jobId,
    jobTitle,
    autoApplied: true,
  },
});

        console.log(
          `Auto Apply SUCCESS: User ${user._id} applied to Job ${jobId} with ${matchPercentage}% match`
        );
      } catch (userError) {
        console.error(
          `Auto Apply error for user ${user._id}:`,
          userError.message
        );
      }
    }

    console.log(
      `Auto Apply completed successfully for Job ${jobId}`
    );
  } catch (error) {
    console.error(
      "Auto Apply service error:",
      error.message
    );
  }
};


export const autoApplyExistingJobsForUser = async (userId) => {
  try {
    // 1. User find karo
    const user = await User.findById(userId);

    if (!user) {
      console.log(`Auto Apply Existing Jobs: User ${userId} not found`);
      return;
    }

    // 2. Auto Apply ON hona chahiye
    if (user.profile?.autoApply !== true) {
      console.log(`Auto Apply Existing Jobs: User ${userId} has Auto Apply OFF`);
      return;
    }

    // 3. User skills
    const userSkills = user.profile?.skills || [];

    if (!userSkills.length) {
      console.log(`Auto Apply Existing Jobs: User ${userId} has no skills`);
      return;
    }

    // 4. Existing active jobs find karo
    const jobs = await Job.find({
      "jobDetails.isActive": true,
    });

    console.log(
      `Auto Apply Existing Jobs: Found ${jobs.length} active jobs for User ${userId}`
    );

    // 5. Har existing job check karo
    for (const job of jobs) {
      try {
        const jobSkills = job.jobDetails?.skills || [];

        if (!jobSkills.length) {
          continue;
        }

        // 6. Match percentage calculate karo
        const matchPercentage = calculateMatchPercentage(
          userSkills,
          jobSkills
        );

//         console.log("📊 AUTO APPLY MATCH CHECK");
// console.log("User:", user._id);
// console.log("User Skills:", userSkills);
// console.log("Job Skills:", jobSkills);
// console.log("Match Percentage:", matchPercentage);
// console.log("Threshold:", AUTO_APPLY_THRESHOLD);

        console.log(
          `Existing Job Match: User ${userId} → Job ${job._id} → ${matchPercentage}%`
        );

        // 7. 65% se kam hai to skip
        if (matchPercentage < AUTO_APPLY_THRESHOLD) {
          continue;
        }

        // 8. Already applied check
        const existingApplication = await Application.findOne({
          job: job._id,
          applicant: userId,
        });

        if (existingApplication) {
          console.log(
            `Already applied: User ${userId} → Job ${job._id}`
          );
          continue;
        }

        // 9. Application create karo
        const newApplication = new Application({
          job: job._id,
          applicant: userId,

          applicantName: user.fullname || "Unknown",

          applicantEmail:
            user.emailId?.email || "noemail@example.com",

          applicantPhone:
            user.phoneNumber?.number || "",

          applicantProfile:
            user.profile || {},

          resume:
            user.profile?.resume || "",

          answers: [],

          status: "Pending",

          isAutoApplied: true,
          matchPercentage: matchPercentage,
        });

        // 10. Save application
        await newApplication.save();

//         console.log("✅ APPLICATION SAVED");
// console.log("📝 Application ID:", newApplication._id);
// console.log("👤 Applicant:", newApplication.applicant);
// console.log("💼 Job:", newApplication.job);
// console.log("📈 Match Percentage:", newApplication.matchPercentage);
// console.log("🤖 Auto Applied:", newApplication.isAutoApplied);

        // 11. Job mein application add karo
        await Job.findByIdAndUpdate(job._id, {
          $push: {
            application: newApplication._id,
          },
        });

        // 12. User ko notification
        const jobTitle =
          job.jobDetails?.title || "a new job";

//           console.log("🔔 ABOUT TO CREATE AUTO APPLY NOTIFICATION");
// console.log("👤 Notification recipient:", user._id);
// console.log("💼 Notification job:", jobId);
// console.log("📈 Notification match:", matchPercentage);

        await notificationService.createAndEmit({
          recipient: userId,
          recipientModel: "User",
          type: "auto-apply",
          title: "🎯 Job Auto-Applied!",
          message: `You were automatically applied to "${jobTitle}" with a ${matchPercentage}% match score.`,
          relatedEntity: job._id,
          relatedEntityModel: "Job",
          priority: "medium",
          actionUrl: `/jobs/${job._id}`,
          metadata: {
            matchPercentage,
            jobId: job._id,
            jobTitle,
            autoApplied: true,
          },
        });

        console.log(
          `✅ Existing Job Auto Apply SUCCESS: User ${userId} → Job ${job._id} → ${matchPercentage}%`
        );

      } catch (jobError) {
        console.error(
          `Existing Job Auto Apply error for Job ${job._id}:`,
          jobError.message
        );
      }
    }

    console.log(
      `✅ Existing jobs Auto Apply completed for User ${userId}`
    );

  } catch (error) {
    console.error(
      "Existing jobs Auto Apply service error:",
      error.message
    );
  }
};

