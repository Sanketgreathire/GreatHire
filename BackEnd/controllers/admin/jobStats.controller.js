import { Job } from "../../models/job.model.js";
import { Application } from "../../models/application.model.js"; // Adjust the path as needed

export const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalActiveJobs = await Job.countDocuments({
      "jobDetails.isActive": true,
    });
    const totalDeactiveJobs = await Job.countDocuments({
      "jobDetails.isActive": false,
    });

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
