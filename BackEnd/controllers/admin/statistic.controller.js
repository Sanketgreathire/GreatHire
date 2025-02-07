import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import { Application } from "../../models/application.model.js";

export const getStatisticForAdmin = async (req, res) => {
  try {
    // Run all queries concurrently
    const [
      totalUsers,
      totalRecruiters,
      verifiedRecruiters,
      totalJobs,
      activeJobs,
      expiredJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      rejectedApplications,
    ] = await Promise.all([
      // Total users in the system
      User.countDocuments(),
      // Total recruiters in the system
      Recruiter.countDocuments(),
      // A recruiter is verified if isVerify equals 1
      Recruiter.countDocuments({ isVerify: 1 }),
      // Total job postings
      Job.countDocuments(),
      // Active job postings. Note that the isActive field is nested in jobDetails.
      Job.countDocuments({ "jobDetails.isActive": true }),
      // Expired job postings (jobs that are not active)
      Job.countDocuments({ "jobDetails.isActive": false }),
      // Total applications submitted
      Application.countDocuments(),
      // Applications by status: Pending, Shortlisted, and Rejected
      Application.countDocuments({ status: "Pending" }),
      Application.countDocuments({ status: "Shortlisted" }),
      Application.countDocuments({ status: "Rejected" }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRecruiters,
        verifiedRecruiters,
        totalJobs,
        activeJobs,
        expiredJobs,
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        rejectedApplications,
      },
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    throw error;
  }
};

export const getApplicationsDataByYear = async (req, res) => {
  try {
    // Extract and validate the "year" query parameter
    const year = parseInt(req.query.year, 10);

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year query parameter is required and must be valid",
      });
    }

    // Define start and end dates for the given year
    const startDate = new Date(year, 0, 1); // January 1st of the given year
    const endDate = new Date(year + 1, 0, 1); // January 1st of the next year

    // Aggregate applications by month for the specified year
    const monthlyApplications = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // groups by month (1 for Jan, 2 for Feb, etc.)
          count: { $sum: 1 },
        },
      },
    ]);

    // Initialize an array for 12 months with zeros
    const monthlyCounts = Array(12).fill(0);

    // Map the aggregation result to the monthlyCounts array
    monthlyApplications.forEach((item) => {
      // Subtract 1 from month number to convert to 0-based index
      monthlyCounts[item._id - 1] = item.count;
    });

    // Return only the monthlyCounts array
    return res.status(200).json({
      success: true,
      data: monthlyCounts,
    });
  } catch (error) {
    console.error("Error fetching applications data:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
