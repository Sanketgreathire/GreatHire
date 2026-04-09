import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import Notification from "../models/notification.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { validationResult } from "express-validator";
import notificationService from "../utils/notificationService.js";
import { autoRejectOldApplications } from "../utils/autoRejectApplications.js";

// Only these 4 statuses are valid
export const VALID_STATUSES = [
  "Pending",
  "Interview Schedule",
  "Shortlisted",
  "Rejected",
];

// Apply to a particular job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const {
      fullname,
      email,
      number,
      city,
      state,
      country,
      coverLetter,
      experience,
      jobTitle,
      company,
      jobId,
      answers,
    } = req.body;
    const { resume } = req.files;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.jobDetails.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "This job is not active" });
    }

    if (fullname && fullname !== user.fullname) user.fullname = fullname;
    if (email && email !== user.emailId.email) {
      user.emailId.email = email;
      user.emailId.isVerified = false;
    }
    if (number && number !== user.phoneNumber.number) {
      user.phoneNumber.number = number;
      user.phoneNumber.isVerified = false;
    }
    if (city && city !== user.address.city) user.address.city = city;
    if (state && state !== user.address.state) user.address.state = state;
    if (country && country !== user.address.country) user.address.country = country;

    user.profile.coverLetter = coverLetter;
    user.profile.experience.experienceDetails = experience;
    user.profile.experience.jobProfile = jobTitle;
    user.profile.experience.companyName = company;


    // Upload resume if provided
    if (resume && resume.length > 0) {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "raw" },
          (error, result) => {
            if (error) reject(error);
            else {
              user.profile.resume = result.secure_url;
              user.profile.resumeOriginalName = resume[0].originalname;
              resolve();
            }
          }
        );
        uploadStream.end(resume[0].buffer);
      });
    }

    const updateUser = await user.save();
    // Check duplicate applications
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Create a New application & its always starts as "Pending"
    const newApplication = new Application({
      job: jobId,
      applicant: userId,
      applicantName: user.fullname || "Unknown",
      applicantEmail: user.emailId?.email || "noemail@example.com",
      applicantPhone: user.phoneNumber?.number || "",
      applicantProfile: user.profile || {},
      resume: user.profile?.resume || "",
      answers: Array.isArray(answers) ? answers : [],
      status: "Pending",
    });

    await newApplication.save();

    // Push application into job (use $push to avoid re-validating required fields on old jobs)
    await Job.findByIdAndUpdate(jobId, { $push: { application: newApplication._id } });

    // ✅ Create notifications using the notification service
    await notificationService.notifyApplicationSubmitted({
      applicantId: userId,
      jobId: jobId,
      jobTitle: job.jobDetails.title,
      companyName: job.jobDetails.companyName,
      recruiterId: job.created_by,
      applicationId: newApplication._id,
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      user: updateUser,
      newApplication,
    });
  } catch (err) {
    console.error("Error applying for job:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Get applied jobs for a single user
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    if (!application) {
      return res.status(404).json({ message: "No Applications.", success: false });
    }
    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Return applicants of a job to recruiter or admin
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const applicants = await Application.find({ job: jobId })
      .populate({
        path: "applicant",
        select: "fullname emailId phoneNumber profile address",
      })
      .select("applicant status answers createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, applicants });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get individual application details for recruiter
export const getApplicationDetails = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;

    const application = await Application.findOne({
      job: jobId,
      applicant: candidateId,
    })
      .populate({
        path: "applicant",
        select: "fullname emailId phoneNumber profile address",
      })
      .populate({
        path: "job",
        select: "jobDetails",
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found.", success: false });
    }

    // Format candidate data for frontend
    const candidateData = {
      name: application.applicant.fullname,
      email: application.applicant.emailId?.email,
      phone: application.applicant.phoneNumber?.number,
      experience: application.applicant.profile?.experience?.experienceDetails,
      skills: application.applicant.profile?.skills || [],
      resumeUrl: application.applicant.profile?.resume,
      status: application.status,
      appliedAt: application.createdAt,
    };

    return res.status(200).json({ success: true, data: candidateData });
  } catch (error) {
    console.error("Error fetching application details:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Recruiter updates the status of an application of user
export const updateStatus = async (req, res) => {
  try {
    // Trim whitespace to avoid any accidental space issues
    const status = req.body.status?.trim();
    const applicationId = req.params.id;

    if (!status) {
      return res
        .status(400)
        .json({ message: "Status is required.", success: false });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Valid values: ${VALID_STATUSES.join(", ")}`,
        success: false,
      });
    }

    const application = await Application.findById(applicationId).populate(
      "applicant job"
    );
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found.", success: false });
    }

    const previousStatus = application.status;
    application.status = status;
    await application.save();

    // ✅ Send notification to applicant about status change
    await notificationService.notifyApplicationStatusChanged({
      applicantId: application.applicant._id,
      jobId: application.job._id,
      jobTitle: application.job.jobDetails.title,
      companyName: application.job.jobDetails.companyName,
      status: status,
      previousStatus: previousStatus,
      recruiterId: req.id,
    });

    return res.status(200).json({ message: "Status updated successfully.", success: true });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Manual trigger for auto-rejecting old applications (Admin/Testing only)
export const triggerAutoReject = async (req, res) => {
  try {
    await autoRejectOldApplications();
    return res.status(200).json({ 
      success: true, 
      message: "Auto-reject process completed successfully" 
    });
  } catch (error) {
    console.error("Error triggering auto-reject:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error triggering auto-reject", 
      error: error.message 
    });
  }
};

// Bulk apply to multiple jobs
export const bulkApplyJobs = async (req, res) => {
  try {
    const userId = req.id;
    let { jobIds, answersMap } = req.body;

    // answersMap may arrive as a JSON string if sent via FormData
    if (typeof answersMap === "string") {
      try { answersMap = JSON.parse(answersMap); } catch { answersMap = {}; }
    }
    if (!answersMap || typeof answersMap !== "object") answersMap = {};

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ success: false, message: "jobIds array is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const applied = [];
    const skipped = [];

    for (const jobId of jobIds) {
      try {
        // Validate ObjectId before querying
        if (!jobId || !jobId.match(/^[a-fA-F0-9]{24}$/)) { skipped.push(jobId); continue; }

        const job = await Job.findById(jobId);
        if (!job || !job.jobDetails?.isActive) { skipped.push(jobId); continue; }

        // Skip jobs with unanswered questions (answersMap[jobId] must exist and be a non-empty array)
        if (job.questions?.length > 0 && (!answersMap[jobId] || !Array.isArray(answersMap[jobId]) || answersMap[jobId].length === 0)) { skipped.push(jobId); continue; }

        const existing = await Application.findOne({ job: jobId, applicant: userId });
        if (existing) { skipped.push(jobId); continue; }

        const newApplication = new Application({
          job: jobId,
          applicant: userId,
          applicantName: user.fullname || "Unknown",
          applicantEmail: user.emailId?.email || "noemail@example.com",
          applicantPhone: user.phoneNumber?.number || "",
          applicantProfile: user.profile || {},
          resume: user.profile?.resume || "",
          answers: Array.isArray(answersMap[jobId]) ? answersMap[jobId] : [],
          status: "Pending",
        });

        await newApplication.save();
        await Job.findByIdAndUpdate(jobId, { $push: { application: newApplication._id } });

        // Notification errors must not crash the loop
        try {
          await notificationService.notifyApplicationSubmitted({
            applicantId: userId,
            jobId,
            jobTitle: job.jobDetails.title,
            companyName: job.jobDetails.companyName,
            recruiterId: job.created_by,
            applicationId: newApplication._id,
          });
        } catch (notifErr) {
          console.error("Notification error for jobId", jobId, notifErr.message);
        }

        applied.push(jobId);
      } catch (jobErr) {
        console.error("Error processing jobId", jobId, jobErr.message);
        skipped.push(jobId);
      }
    }

    return res.status(201).json({ success: true, applied, skipped });
  } catch (err) {
    console.error("Error in bulk apply:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// Delete an application by ID
export const deleteApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found.", success: false });
    }

    // Remove application from the job's application array
    await Job.findByIdAndUpdate(application.job, {
      $pull: { application: applicationId },
    });

    // Delete the application
    await Application.findByIdAndDelete(applicationId);

    return res.status(200).json({ message: "Application deleted successfully.", success: true });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all applications (for admin)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "applicant",
        select: "fullname emailId phoneNumber profile",
      })
      .populate({
        path: "job",
        populate: { path: "company" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching all applications:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
