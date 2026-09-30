import { Job } from "../../models/job.model.js";

const cleanArray = (arr) =>
  Array.isArray(arr) ? arr.filter((item) => String(item).trim() !== "") : [];

// returing total jobs, total active jobs, total deactive jobs
export const getJobStats = async (req, res) => {
  try {
    const [totalJobs, totalActiveJobs, totalDeactiveJobs] = await Promise.all([
      Job.estimatedDocumentCount(),
      Job.countDocuments({ "jobDetails.isActive": true }),
      Job.countDocuments({ "jobDetails.isActive": false }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalActiveJobs,
        totalDeactiveJobs,
      },
    });
  } catch (err) {
    console.error("Error fetching job stats:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// get all job list
export const getAllJobList = async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      // Ensure the application array is defined, then count its size
      {
        $addFields: {
          numberOfApplications: { $size: { $ifNull: ["$application", []] } },
        },
      },
      // Add a new field "postedFormatted" to format the createdAt date
      {
        $addFields: {
          postedFormatted: {
            // date formate 
            $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
          },
        },
      },
      // Project the required fields from the nested jobDetails and the top-level fields
      {
        $project: {
          title: "$jobDetails.title",
          jobType: "$jobDetails.jobType",
          location: "$jobDetails.location",
          salary: "$jobDetails.salary",
          experience: "$jobDetails.experience",
          companyName: "$jobDetails.companyName",
          postedDate: "$postedFormatted", // using our formatted posted date
          numberOfApplications: 1,
          isActive: "$jobDetails.isActive", // status of the job (active/inactive)
          companyId: "$company", // the ObjectId reference to the Company
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching job list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update job details from the admin panel.
//
export const updateJobByAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobData = req.body || {};
    const edited = jobData.editedJob || {};

    const skillsArray = Array.isArray(edited.skills)
      ? edited.skills
      : String(edited.skills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "");

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          "jobDetails.details": edited.details,
          "jobDetails.skills": skillsArray,
          "jobDetails.qualifications": cleanArray(edited.qualifications),
          "jobDetails.benefits": cleanArray(edited.benefits),
          "jobDetails.responsibilities": cleanArray(edited.responsibilities),
          "jobDetails.experience": edited.experience,
          "jobDetails.salary": edited.salary,
          "jobDetails.jobType": edited.jobType,
          "jobDetails.location": edited.location,
          "jobDetails.numberOfOpening": edited.numberOfOpening,
          "jobDetails.respondTime": edited.respondTime,
          "jobDetails.duration": edited.duration,
          "jobDetails.shift": edited.shift,
          "jobDetails.workPlaceFlexibility": edited.workPlaceFlexibility,
        },
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (err) {
    console.error("Error updating job (admin):", err);
    return res.status(500).json({
      success: false,
      message: "Error updating job",
      error: err.message,
    });
  }
};
