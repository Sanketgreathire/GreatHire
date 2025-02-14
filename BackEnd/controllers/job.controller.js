import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { isUserAssociated } from "./company.controller.js";
import { Admin } from "../models/admin/admin.model.js";

export const postJob = async (req, res) => {
  try {
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
      location,

      numberOfOpening,
      respondTime,
      duration,

      companyId,
    } = req.body;

    // Extract recruiter ID from the request (assuming it's added to the request during authentication)
    const userId = req.id;

    if (!isUserAssociated(companyId, userId)) {
      return res.status(403).json({
        message: "You are not authorized",
        success: false,
      });
    }

    const company = await Company.findById(companyId);

    // Expire plan if maxPostJobs is 0
    if (company.maxJobPosts === 0) {
      return res.status(400).json({
        success: false,
        message: "Company need job plans",
      });
    }

    // Validate required fields
    if (
      !title ||
      !details ||
      !experience ||
      !salary ||
      !jobType ||
      !location ||
      !numberOfOpening ||
      !respondTime ||
      !duration ||
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Split skills, qualifications, benefits, responsibilities by new line or comma
    const splitSkills = skills.split(",").map((skill) => skill.trim());
    const splitQualifications = qualifications
      .split("\n")
      .map((qualification) => qualification.trim());
    const splitBenefits = benefits.split("\n").map((benefit) => benefit.trim());
    const splitResponsibilities = responsibilities
      .split("\n")
      .map((responsibility) => responsibility.trim());

    // Create new job instance
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
        location,

        numberOfOpening,
        respondTime,
        duration,
      },
      created_by: userId,
      company: companyId,
    });

    // Save the job to the database
    const savedJob = await newJob.save();

    if (company.maxJobPosts !== null && company.maxJobPosts > 0) {
      // Ensure `maxJobPosts` is decremented only if it's a number
      const updatedCompany = await Company.findOneAndUpdate(
        { _id: company._id }, // Find the company by ID
        { $inc: { maxJobPosts: -1 } }, // Decrement maxJobPosts by 1
        { new: true } // Return the updated document
      );

      // Check if maxJobPosts reached 0
      if (updatedCompany && updatedCompany.maxJobPosts === 0) {
        const activeSubscription = await JobSubscription.findOne({
          company: company._id,
          status: "Active",
        });

        if (activeSubscription) {
          if (activeSubscription.planName !== "Free") {
            activeSubscription.status = "Expired";
            await activeSubscription.save();
          }
        }
      }
    }

    // Respond with success and the saved job details
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
};

//get all jobs.....
export const getAllJobs = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
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
      if (!isFirst) {
        res.write(",");
      } else {
        isFirst = false;
      }

      res.write(JSON.stringify(doc.toObject())); // Write the job with application status
    });

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
      .skip(skip)
      .limit(limit);

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
export const deleteJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { companyId } = req.body;
    const { userId } = req.id;

    const admin = await Admin.findById(userId); // Check if user is an admin

    // If the user is neither an admin nor a valid recruiter, deny access
    if (!admin && !isUserAssociated(companyId, userId)) {
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
};

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
