import cron from "node-cron";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import notificationService from "./notificationService.js";
import { sendRejectionEmail } from "./emailService.js";

// Configuration: Auto-reject applications older than X days
const AUTO_REJECT_DAYS = parseInt(process.env.AUTO_REJECT_DAYS) || 30;

export const autoRejectOldApplications = async () => {
  try {
    console.log(`🔍 Checking for applications older than ${AUTO_REJECT_DAYS} days...`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - AUTO_REJECT_DAYS);

    // Find all pending applications older than cutoff date
    const oldApplications = await Application.find({
      status: "Pending",
      createdAt: { $lt: cutoffDate },
    })
      .populate("applicant", "fullname emailId")
      .populate("job", "jobDetails created_by");

    if (oldApplications.length === 0) {
      console.log("✅ No old applications to reject");
      return;
    }

    console.log(`📋 Found ${oldApplications.length} applications to auto-reject`);

    let successCount = 0;
    let failCount = 0;

    for (const application of oldApplications) {
      try {
        // Update application status to Rejected
        application.status = "Rejected";
        await application.save();

        const applicantEmail = application.applicant?.emailId?.email;
        const applicantName = application.applicant?.fullname || "Candidate";
        const jobTitle = application.job?.jobDetails?.title || "Position";
        const companyName = application.job?.jobDetails?.companyName || "Company";

        // Send rejection email
        if (applicantEmail) {
          await sendRejectionEmail(applicantEmail, applicantName, jobTitle, companyName);
        }

        // Send in-app notification
        await notificationService.notifyApplicationStatusChanged({
          applicantId: application.applicant._id,
          jobId: application.job._id,
          jobTitle: jobTitle,
          companyName: companyName,
          status: "Rejected",
          previousStatus: "Pending",
          recruiterId: application.job.created_by,
        });

        successCount++;
        console.log(`✅ Auto-rejected application ${application._id}`);
      } catch (error) {
        failCount++;
        console.error(`❌ Error rejecting application ${application._id}:`, error.message);
      }
    }

    console.log(`✅ Auto-rejection complete: ${successCount} succeeded, ${failCount} failed`);
  } catch (error) {
    console.error("❌ Error in auto-reject cron job:", error.message);
  }
};

// Schedule cron job to run daily at 2 AM
export const startAutoRejectCron = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("⏰ Running auto-reject cron job...");
    await autoRejectOldApplications();
  });

  console.log(`✅ Auto-reject cron job scheduled (runs daily at 2 AM, rejects applications older than ${AUTO_REJECT_DAYS} days)`);
};
