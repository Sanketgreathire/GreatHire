import { Job } from "../../models/job.model.js";

// returing total jobs, total active jobs, total deactive jobs
export const getJobStats = async (req, res) => {
  try {
    // Total Jobs
    const totalJobs = await Job.countDocuments();
    // Total Active Jobs
    const totalActiveJobs = await Job.countDocuments({
      "jobDetails.isActive": true,
    });
    // total Deactive Jobs
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
            //  combines the day abbreviation with the formatted date.
            $concat: [
              {
                // $switch converts the day of the week ($dayOfWeek) from createdAt into a short string (e.g., "Sun", "Mon").
                $switch: {
                  branches: [
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] },
                      then: "Sun",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] },
                      then: "Mon",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] },
                      then: "Tue",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] },
                      then: "Wed",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] },
                      then: "Thu",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] },
                      then: "Fri",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] },
                      then: "Sat",
                    },
                  ],
                  default: "N/A",
                },
              },
              ", ",
              {
                // formats the date as day, year (e.g., 05, 2024).
                $dateToString: { format: "%d, %Y", date: "$createdAt" },
              },
            ],
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
