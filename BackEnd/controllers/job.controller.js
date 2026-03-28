
import { Job } from "../models/job.model.js";
import  {Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { isUserAssociated } from "./company.controller.js";
import { Admin } from "../models/admin/admin.model.js";
import { check, validationResult } from "express-validator";
import { BlacklistedCompany } from "../models/blacklistedCompany.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { User } from "../models/user.model.js";
import notificationService from "../utils/notificationService.js";
import axios from "axios";


// Plan limits configuration
const PLAN_LIMITS = {
  FREE:       { jobsPerMonth: 2,         resumeCredits: 5 },
  STANDARD:   { jobsPerMonth: 5,         resumeCredits: 333 },
  PREMIUM:    { jobsPerMonth: 15,        resumeCredits: 1000 },
  ENTERPRISE: { jobsPerMonth: Infinity,  resumeCredits: 8333 },
};

// Free job posts for paid plans (monthly)
const PAID_PLAN_FREE_JOBS = 2;

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
  check("shift").notEmpty().withMessage("Shift is required"),
  check("anyAmount").notEmpty().withMessage("Please specify if applicants need to pay"),
  check("companyId").notEmpty().withMessage("Company ID is required"),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        companyName, urgentHiring, title, details, skills, qualifications,
        benefits, responsibilities, experience, salary, jobType,
        workPlaceFlexibility, location, numberOfOpening, respondTime,
        duration, shift, anyAmount, companyId, questions,
      } = req.body;

      const userId = req.id;
      const company = await Company.findById(companyId);
      const recruiter = await Recruiter.findById(userId);

      if (!company) {
        return res.status(404).json({ success: false, message: "Company not found. Please create a company first." });
      }

      const companyPlan = company.plan || "FREE";
      const isVerified = company.isActive;
      const isFirstJob = company.freeJobsPosted === 0;

      // --- Unified pre-verification check (applies to ALL plans) ---
      // Count how many jobs have been posted so far (use the correct counter per plan)
      const jobsPostedSoFar = companyPlan === "FREE"
        ? company.freeJobsPosted
        : (company.planJobsPostedThisMonth || 0) + (company.paidPlanFreeJobsPosted || 0);

      // Check if there are any pending jobs (first job waiting for verification)
      const pendingJobs = await Job.countDocuments({
        company: companyId,
        "jobDetails.status": "pending"
      });

      if (!isVerified) {
        const hasRemainingPosts = recruiter && recruiter.remainingJobPosts > 0;
        if (pendingJobs > 0) {
          return res.status(400).json({
            success: false,
            message: "Your first job is currently under admin review. You can post your next job once your account is verified.",
            requiresVerification: true,
            redirectTo: "/recruiter/dashboard/home",
          });
        } else if (jobsPostedSoFar >= 1 && !hasRemainingPosts) {
          return res.status(400).json({
            success: false,
            message: "Your account and company are currently under admin verification. You can post one job now. Once your account is verified, you will be able to post more jobs according to your plan.",
            requiresVerification: true,
            redirectTo: "/recruiter/dashboard/home",
          });
        }
      }

      // --- Plan-specific limits (only reached after verification) ---
      console.log("Remaining before post:", recruiter?.remainingJobPosts);

      // ── Layer 0: Referral bonus slots (bypass all limits) ──
      if (recruiter && recruiter.remainingJobPosts > 0) {
        recruiter.remainingJobPosts -= 1;
        await recruiter.save();
      } else if (companyPlan === "FREE") {
        // ── FREE plan: check against freeJobsPosted limit ──
        if (company.freeJobsPosted >= PLAN_LIMITS.FREE.jobsPerMonth) {
          return res.status(400).json({
            success: false,
            message: "You have used your 2 free monthly job posts. Please upgrade your plan to post more jobs.",
            redirectTo: "/recruiter/dashboard/upgrade-plans",
          });
        }
      } else {
        // ── Paid plan: check planJobsPostedThisMonth against plan limit ──
        const now = new Date();
        const monthStart = company.planMonthStart ? new Date(company.planMonthStart) : null;
        const isPaidSameMonth = monthStart &&
          monthStart.getMonth() === now.getMonth() &&
          monthStart.getFullYear() === now.getFullYear();
        if (!isPaidSameMonth) {
          company.planJobsPostedThisMonth = 0;
          company.planMonthStart = now;
        }

        const paidPlanLimit = PLAN_LIMITS[companyPlan]?.jobsPerMonth ?? 0;
        if (paidPlanLimit !== Infinity && company.planJobsPostedThisMonth >= paidPlanLimit) {
          return res.status(400).json({
            success: false,
            message: `You have used all ${paidPlanLimit} job posts for this month. Please upgrade your plan.`,
            redirectTo: "/recruiter/dashboard/upgrade-plans",
          });
        }
      }

      const splitSkills = (typeof skills === 'string') ? skills.split(",").map(s => s.trim()) : [];
      const splitQualifications = (typeof qualifications === 'string') ? qualifications.split("\n").map(q => q.trim()) : [];
      const splitBenefits = (typeof benefits === 'string') ? benefits.split("\n").map(b => b.trim()) : [];
      const splitResponsibilities = (typeof responsibilities === 'string') ? responsibilities.split("\n").map(r => r.trim()) : [];

      // First job for any unverified company → pending (acts as verification request)
      const jobStatus = (!isVerified && jobsPostedSoFar === 0) ? "pending" : "active";
      const jobIsActive = jobStatus === "active";

      const newJob = new Job({
        jobDetails: {
          companyName, urgentHiring, title, details,
          skills: splitSkills, benefits: splitBenefits,
          qualifications: splitQualifications, responsibilities: splitResponsibilities,
          salary, experience, jobType, workPlaceFlexibility,
          location, numberOfOpening, respondTime, duration, shift, anyAmount,
          isActive: jobIsActive,
          status: jobStatus,
        },
        questions: Array.isArray(questions) ? questions.filter(q => q.trim()) : [],
        created_by: userId,
        company: companyId,
      });

      await newJob.save();

      // Update counters
      if (companyPlan === "FREE") {
        company.freeJobsPosted += 1;
        if (company.freeJobsPosted >= PLAN_LIMITS.FREE.jobsPerMonth && !company.hasUsedFreePlan) {
          company.hasUsedFreePlan = true;
        }
      } else {
        company.planJobsPostedThisMonth = (company.planJobsPostedThisMonth || 0) + 1;
      }
      await company.save();

      // Notify recruiter
      try {
        await notificationService.notifyNewJobPosted({ recruiterId: userId, jobId: newJob._id, jobTitle: title, companyName });
      } catch (e) {
        console.error('❌ Job posting notification error:', e);
      }

      // Notify matching candidates only for active jobs
      if (jobIsActive) {
        try { await findAndNotifyMatchingCandidates(newJob); } catch (e) { console.error('❌ Matching candidates error:', e.message); }
      }

      const message = jobStatus === "pending"
        ? "Job submitted for verification. It will be published after admin approval."
        : "Job posted successfully.";

      return res.status(201).json({ success: true, message, jobStatus });
    } catch (error) {
      console.error("Error posting job:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
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

// Apply for a Job
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.id;
    const { answers } = req.body;

    // Job exist check karo
    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if job is active
    if (!job.jobDetails.isActive) {
      return res.status(400).json({ success: false, message: "This job is not active" });
    }

    // User exist check karo
    const user = await User.findById(userId);
    console.log("Applying job user check kro :", user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Already applied check karo
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "Already applied for this job" });
    }

    // New application create karo
    const newApplication = new Application({
      job: jobId,
      applicant: userId,
      applicantName: user.fullname,
      applicantEmail: user.email,
      applicantPhone: user.phone || "",
      applicantProfile: user.profile || {},
      resume: user.resume || "",
      answers: Array.isArray(answers) ? answers : [],
      status: "Pending",
    });

    await newApplication.save();

    // Add application to job
    job.application.push(newApplication._id);
    await job.save();

  // ✅ Send notifications
  try {
    console.log('📨 Sending application notification...', {
      applicantId: userId,
      jobId: jobId,
      jobTitle: job.jobDetails.title,
      companyName: job.jobDetails.companyName,
      recruiterId: job.created_by
    });
    
    await notificationService.notifyApplicationSubmitted({
      applicantId: userId,
      jobId: jobId,
      jobTitle: job.jobDetails.title,
      companyName: job.jobDetails.companyName,
      recruiterId: job.created_by,
      applicationId: newApplication._id
    });
    
    console.log('✅ Application notification sent successfully');
  } catch (notificationError) {
    console.error('❌ Error sending application notification:', notificationError);
    // Don't fail the application if notification fails
  }

    return res.status(201).json({
      success: true,
      message: "Job applied successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("Error applying job:", error);  // <-- yahi log bahut important hai
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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


// Get latest 20 jobs for slider/carousel - lightweight function
export const getLatestJobsForSlider = async (req, res) => {
  try {
    const latestJobs = await Job.find({ "jobDetails.isActive": true })
      .select("jobDetails company created_by createdAt saveJob")
      .populate("company", "name logo")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      jobs: latestJobs,
      count: latestJobs.length
    });
  } catch (error) {
    console.error("Error fetching latest jobs for slider:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching jobs for slider",
      error: error.message
    });
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
// export const getJobById = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({
//         message: "Jobs not found.",
//         success: false,
//       });
//     }
// return res.status(200).json(job);

//   } catch (error) {
//     console.log(error);
//   }
// };


// get job by id...
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("company") // company details populate
      .populate({
        path: "application",
        populate: { path: "applicant" }, // applicants ke details
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      job, // ✅ wrapper ke andar bhejna
    });
  } catch (error) {
    console.error("Error fetching job by id:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
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
          "jobDetails.shift": jobData.editedJob.shift,
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

// Helper function to find and notify matching candidates
async function findAndNotifyMatchingCandidates(job) {
  try {
    const jobSkills = job.jobDetails.skills || [];
    const jobLocation = job.jobDetails.location;
    const MAX_NOTIFICATIONS = 50; // Limit notifications to prevent timeout
    
    // Find users with matching skills, location, or category preferences
    const matchingUsers = await User.find({
      $or: [
        { "profile.skills": { $in: jobSkills } },
        { "address.city": { $regex: jobLocation, $options: 'i' } },
        { "profile.category": { $in: jobSkills } }
      ]
    }).limit(MAX_NOTIFICATIONS).select('_id profile.skills profile.category address.city');

    if (matchingUsers.length === 0) return;

    // Process notifications asynchronously without blocking
    setImmediate(async () => {
      try {
        const notifications = matchingUsers.map((user) => {
          const userSkills = user.profile?.skills || [];
          const userCategories = user.profile?.category || [];
          
          const matchingSkills = jobSkills.filter(skill => 
            userSkills.some(userSkill => 
              userSkill.toLowerCase().includes(skill.toLowerCase())
            ) || userCategories.some(category =>
              category.toLowerCase().includes(skill.toLowerCase())
            )
          );
          
          let matchScore = 30;
          if (matchingSkills.length > 0) {
            matchScore = Math.min(
              Math.round((matchingSkills.length / Math.max(jobSkills.length, 1)) * 100),
              95
            );
          }
          
          if (user.address?.city && 
              user.address.city.toLowerCase().includes(jobLocation.toLowerCase())) {
            matchScore += 10;
          }
          
          return {
            recipient: user._id,
            recipientModel: 'User',
            type: 'job-recommendation',
            title: 'New Job Match Found!',
            message: `${job.jobDetails.title} at ${job.jobDetails.companyName} matches your profile (${Math.min(matchScore, 95)}% match)`,
            relatedEntity: job._id,
            relatedEntityModel: 'Job',
            priority: matchScore >= 70 ? 'high' : 'medium',
            actionUrl: `/jobs/${job._id}`,
            metadata: { jobTitle: job.jobDetails.title, companyName: job.jobDetails.companyName, matchScore: Math.min(matchScore, 95), location: job.jobDetails.location, salary: job.jobDetails.salary }
          };
        });
        
        // Bulk insert notifications
        await Notification.insertMany(notifications);
        console.log(`✅ Notified ${notifications.length} candidates`);
      } catch (error) {
        console.error("Error sending notifications:", error.message);
      }
    });
  } catch (error) {
    console.error("Error finding matching candidates:", error.message);
  }
}

// Helper function to send general job alerts to recent active users
async function sendGeneralJobAlert(job) {
  // Removed to prevent timeout - only skill-based matching is used
}