// this is an applicaton controller to perform action related to application
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { validationResult } from "express-validator";

// this controller apply to a particular job
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
    console.log("resume", resume);

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

    // Check if the job is active, user cannot apply if job is not active
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
      console.log("Uploading resume to Cloudinary...");
      
      // Upload the file buffer directly to Cloudinary using upload_stream
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "raw" }, // Treat it as a generic file
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              user.profile.resume = result.secure_url;
              user.profile.resumeOriginalName = resume[0].originalname;
              console.log("Resume uploaded successfully:", result.secure_url);
              resolve();
            }
          }
        );
        uploadStream.end(resume[0].buffer);
      });
    }

    console.log("resume", user.profile.resume);
    console.log("resumeOriginalName", user.profile.resumeOriginalName);

    // Save the updated user
    const updateUser = await user.save();

    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    // If the application exists, prevent duplicate applications
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

// Applied job by a single user
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    // return application of a user in assecending order
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

// Return applicatants of a job to recruiter or admin
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find all applications for the given job and populate the applicant user details
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

// This recruiter update the status of application of user 
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
