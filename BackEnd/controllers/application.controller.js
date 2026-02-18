import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import Notification from "../models/notification.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { validationResult } from "express-validator";
import notificationService from "../utils/notificationService.js";

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
      status: "Pending",
    });

    await newApplication.save();

    // Push application into job
    job.application.push(newApplication._id);
    await job.save();

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