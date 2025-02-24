import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { validationResult } from "express-validator";

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

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
      experience, // this is details of previous experience
      jobTitle,
      company,
      jobId,
    } = req.body;
    const { resume } = req.files;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the job is active
    if (!job.jobDetails.isActive) {
      return res.status(400).json({ success: false, message: "This job is not active" });
    }

    // Update user details if necessary
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

    // Update resume if provided
    if (resume && resume.length > 0) {
      const fileUri = getDataUri(resume[0]);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = resume[0].originalname;
    }

    // Save the updated user
    const updateUser = await user.save();

    // Check if the user has already applied for the job
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

    // Create a new application
    const newApplication = new Application({
      job: jobId,
      applicant: userId,
      status: "Pending",
    });

    // Save the application to the database
    await newApplication.save();

    // Push the new application ID to the job's applications array
    job.application.push(newApplication._id);

    // Save the updated job
    await job.save();

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      user: updateUser,
      newApplication,
    });
  } catch (err) {
    console.error("Error applying for job:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Applied job
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No Applications.",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Admin section to see user applied
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find all applications for the given job and populate the applicant details
    const applicants = await Application.find({ job: jobId })
      .populate("applicant") // Populating applicant details
      .sort({ createdAt: -1 }); // Sorting by createdAt in descending order

    return res.status(200).json({
      success: true,
      applicants, // Returning only the list of applicants
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }

    // Find the application by applicant id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Update status
    application.status = status;
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Use the middleware in your routes
app.post('/apply-job', isAuthenticated, applyJob);
