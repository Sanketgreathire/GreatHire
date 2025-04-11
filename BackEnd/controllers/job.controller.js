import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { isUserAssociated } from "./company.controller.js";
import { Admin } from "../models/admin/admin.model.js";
import { check, validationResult } from "express-validator";
import { BlacklistedCompany } from "../models/blacklistedCompany.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import axios from "axios";

// postjob by recruiter
export const postJob = [
  check("title").notEmpty().withMessage("Title is required"),
  check("details").notEmpty().withMessage("Details are required"),
  check("experience").notEmpty().withMessage("Experience is required"),
  check("salary").notEmpty().withMessage("Salary is required"),
  check("jobType").notEmpty().withMessage("Job type is required"),
  check("location").notEmpty().withMessage("Location is required"),
  check("numberOfOpening").notEmpty().withMessage("Number of openings is required"),
  check("duration").notEmpty().withMessage("Duration is required"),
  check("companyId").notEmpty().withMessage("Company ID is required"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        companyName,
        urgentHiring,
        title,
        details,
        skills,
        qualifications,
        benefits,
        responsibilities,
        experience,
        salary,
        jobType,
        workPlaceFlexibility,
        location,
        numberOfOpening,
        respondTime,
        duration,
        anyAmount,
        companyId,
      } = req.body;

      const userId = req.id;

      const company = await Company.findById(companyId);

      if (company.maxJobPosts === 0) {
        return res.status(400).json({
          success: false,
          message: "Company needs job plans",
        });
      }

      const splitSkills = (typeof skills === 'string') ? skills.split(",").map(s => s.trim()) : [];
      const splitQualifications = (typeof qualifications === 'string') ? qualifications.split("\n").map(q => q.trim()) : [];
      const splitBenefits = (typeof benefits === 'string') ? benefits.split("\n").map(b => b.trim()) : [];
      const splitResponsibilities = (typeof responsibilities === 'string') ? responsibilities.split("\n").map(r => r.trim()) : [];

      if (anyAmount === "Yes") {
        const blacklistedData = {
          companyName: company.companyName,
          email: company.email,
          adminEmail: company.adminEmail,
          CIN: company.CIN,
        };

        const existingBlacklist = await BlacklistedCompany.findOne({ CIN: company.CIN });

        if (!existingBlacklist) {
          await BlacklistedCompany.create(blacklistedData);
        }

        await Recruiter.updateOne(
          { _id: userId },
          { $set: { isActive: false, isBlocked: true } }
        );

        return res.status(403).json({
          success: false,
          message: "Your company has been blacklisted. Please contact the admin.",
        });
      }

      const newJob = new Job({
        jobDetails: {
          companyName,
          urgentHiring,
          title,
          details,
          skills: splitSkills,
          benefits: splitBenefits,
          qualifications: splitQualifications,
          responsibilities: splitResponsibilities,
          salary,
          experience,
          jobType,
          workPlaceFlexibility,
          location,
          numberOfOpening,
          respondTime,
          duration,
          anyAmount,
          isActive: true,
        },
        created_by: userId,
        company: companyId,
      });

      await newJob.save();

      if (company.maxJobPosts > 0) {
        const updatedCompany = await Company.findOneAndUpdate(
          { _id: company._id },
          { $inc: { maxJobPosts: -1 } },
          { new: true }
        );

        if (updatedCompany && updatedCompany.maxJobPosts === 0) {
          const activeSubscription = await JobSubscription.findOne({
            company: company._id,
            status: "Active",
          });

          if (activeSubscription && activeSubscription.planName !== "Free") {
            activeSubscription.status = "Expired";
            await activeSubscription.save();
          }
        }
      }

      return res.status(201).json({
        success: true,
        message: "Job posted successfully.",
      });
    } catch (error) {
      console.error("Error posting job:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
];

// Implement getExternalJobsFromFindwork
export const getExternalJobsFromFindwork = async (req, res) => {
  try {
    // Fetch jobs data from Findwork API
    const response = await axios.get('https://findwork.dev/api/jobs/?search=remote');
    
    // Return the fetched data in response
    return res.status(200).json({
      success: true,
      jobs: response.data,
    });
  } catch (error) {
    console.error("Error fetching external jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching external jobs from Findwork.",
    });
  }
};

// Other functions like getAllJobs, getJobById, etc.
/** get all jobs for home page in stream manner like
this controller does not return all jobs at once. Instead, it uses streaming to send jobs to the client incrementally, which is particularly useful when dealing with large datasets. */
export const getAllJobs = async (req, res) => {
  // this one specify returnable content type as JSON with UTF-8 encoding
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // preventing the caching of the response 
  res.setHeader("Cache-Control", "no-cache");

  try {
    // Using cursor to stream the data in LIFO order (newest to oldest)
    const cursor = Job.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "application",
      })
      .cursor();

    res.write("["); // Start the JSON array

    let isFirst = true;
    cursor.on("data", (doc) => {
      // add comma to all json object but not be first document
      if (!isFirst) {
        res.write(",");
      } else {
        isFirst = false;
      }
 // convert document into plain object
      res.write(JSON.stringify(doc.toObject())); // Write the job with application status to response stream
    });

//     "end" event: Triggered when all documents are streamed.
// Finalizes the JSON array and ends the response.

    cursor.on("end", () => {
      res.write("]"); // End the JSON array
      res.end();
    });

    cursor.on("error", (error) => {
      console.error("Error streaming jobs:", error);
      res.status(500).json({ message: "Internal server error" });
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get job by recruiter id...
export const getJobByRecruiterId = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch paginated jobs
    const jobs = await Job.find({ created_by: recruiterId })
      .select(
        "jobDetails.companyName jobDetails.title jobDetails.location jobDetails.jobType jobDetails.isActive"
      )
      .sort({ createdAt: -1 })
      .skip(skip) // for skipped the document
      .limit(limit); // return only limited document

    // Total job count for the recruiter
    const totalJobs = await Job.countDocuments({ created_by: recruiterId });

    // Total pages
    const totalPages = Math.ceil(totalJobs / limit);

    // Return paginated response
    return res.status(200).json({
      jobs,
      totalJobs,
      totalPages,
      currentPage: page,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching jobs by recruiter ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//get job by id...
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// help to fecth all job of a particular company
export const getJobByCompanyId = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;

    if (!isUserAssociated(companyId, userId)) {
      return res.status(403).json({
        message: "You are not authorized.",
        success: false,
      });
    }

    // Fetch jobs by company ID
    const jobs = await Job.find({ company: companyId })
      .select("jobDetails.title jobDetails.isActive createdAt")
      .sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this company" });
    }
    return res.status(200).json({ jobs, success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// job can be deleted either by recruiter or admin
export const deleteJobById = [
  // Input validation
  check("id").isMongoId().withMessage("Invalid job ID"),
  check("companyId").isMongoId().withMessage("Invalid company ID"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const jobId = req.params.id;
      const { companyId } = req.body;
      const userId = req.id;

      const admin = await Admin.findById(userId); // Check if user is an admin

      // If the user is neither an admin nor a valid recruiter, deny access
      if (!admin && companyId && !await isUserAssociated(companyId, userId)) {
        return res.status(403).json({
          message: "You are not authorized",
          success: false,
        });
      }

      // Check if the job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found.",
        });
      }

      // Delete the job
      await Job.findByIdAndDelete(jobId);

      // Delete all applications related to this job
      await Application.deleteMany({ job: jobId });

      // Respond with success message
      return res.status(200).json({
        success: true,
        message: "Job and related applications deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
];

// bookmark the job
export const bookmarkJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.id; // Assuming req.id is the authenticated user's ID

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user already bookmarked the job
    const isBookmarked = job.saveJob.includes(userId);

    // Update saveJob field (add or remove user ID)
    if (isBookmarked) {
      job.saveJob = job.saveJob.filter((id) => id.toString() !== userId);
    } else {
      job.saveJob.push(userId);
    }

    await job.save();

    res.status(200).json({
      message: !isBookmarked ? "Save successfully" : "Unsave successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// this controller active or de-active the job
export const toggleActive = async (req, res) => {
  try {
    const { jobId, isActive, companyId } = req.body;
    const userId = req.id;

    const admin = await Admin.findById(userId); // Check if user is an admin

    // If the user is neither an admin nor a valid recruiter, deny access
    if (!admin && !isUserAssociated(companyId, userId)) {
      return res.status(403).json({
        message: "You are not authorized",
        success: false,
      });
    }

    // Find the job by its ID and update the isActive field
    const job = await Job.findByIdAndUpdate(
      jobId,
      { "jobDetails.isActive": isActive },
      { new: true } // Return the updated document
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job status updated successfully.",
      job,
    });
  } catch (error) {
    console.error("Error toggling job status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// update the deatils of job
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobData = req.body;
    const userId = req.id;
    const companyId = jobData.companyId;

    if (!isUserAssociated(companyId, userId)) {
      return res.status(403).json({
        message: "You are not authorized",
        success: false,
      });
    }

    // Normalize skills input: If it's a string, split it into an array; otherwise, use it as is
    const skillsArray = Array.isArray(jobData.editedJob.skills)
      ? jobData.editedJob.skills
      : jobData.editedJob.skills.split(",").map((skill) => skill.trim());

    // Remove empty values from arrays (benefits, qualifications, responsibilities)
    const cleanArray = (arr) =>
      Array.isArray(arr) ? arr.filter((item) => item.trim() !== "") : [];

    // Find the job by its ID and update
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          "jobDetails.details": jobData.editedJob.details,
          "jobDetails.skills": skillsArray, // Convert to an array
          "jobDetails.qualifications": cleanArray(
            jobData.editedJob.qualifications
          ),
          "jobDetails.benefits": cleanArray(jobData.editedJob.benefits), // Remove empty values
          "jobDetails.responsibilities": cleanArray(
            jobData.editedJob.responsibilities
          ),
          "jobDetails.experience": jobData.editedJob.experience,
          "jobDetails.salary": jobData.editedJob.salary,
          "jobDetails.jobType": jobData.editedJob.jobType,
          "jobDetails.location": jobData.editedJob.location,
          "jobDetails.numberOfOpening": jobData.editedJob.numberOfOpening,
          "jobDetails.respondTime": jobData.editedJob.respondTime,
          "jobDetails.duration": jobData.editedJob.duration,
        },
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

// this will return stats of job
export const getJobsStatistics = async (req, res) => {
  try {
    const companyId = req.params.id; // Accessing companyId from the URL params
    const userId = req.id; // Assuming the user ID is stored in req.id after authentication

    if (!isUserAssociated(companyId, userId)) {
      return res.status(403).json({
        message: "You are not authorized",
        success: false,
      });
    }

    // Get all job IDs associated with the company
    const jobs = await Job.find({ company: companyId }, { _id: 1 });
    const jobIds = jobs.map((job) => job._id);

    // Get the total number of jobs posted by the company
    const totalJobs = jobs.length;

    // Get the number of active jobs posted by the company
    const activeJobs = await Job.countDocuments({
      company: companyId,
      "jobDetails.isActive": true,
    });

    // Get the number of inactive jobs posted by the company
    const inactiveJobs = await Job.countDocuments({
      company: companyId,
      "jobDetails.isActive": false,
    });

    // Get the total number of applicants for the company's jobs
    const totalApplicants = await Application.countDocuments({
      job: { $in: jobIds },
    });

    // Get the number of selected candidates for the company's jobs
    const selectedCandidates = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Shortlisted",
    });

    // Format the response
    const statistics = {
      totalJobs,
      activeJobs,
      inactiveJobs,
      totalApplicants,
      selectedCandidates,
    };

    return res.status(200).json({
      message: "Statistics fetched successfully",
      success: true,
      statistics,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: err.message,
    });
  }
};
