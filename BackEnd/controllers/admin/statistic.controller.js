import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import { Application } from "../../models/application.model.js";
import { formatDistanceToNow } from "date-fns";

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

export const getRecentActivity = async (req, res) => {
  try {
    // Fetch latest users (new registrations)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .select("createdAt");

    // Fetch latest jobs (new job postings)
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .select("createdAt jobDetails.title");

    // Fetch latest applications (submissions)
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .select("createdAt");

    // Format data as plain text for frontend
    let activityFeed = [];

    // Add user registrations
    recentUsers.forEach(user => {
      activityFeed.push(`New User registration ${formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}`);
    });

    // Add job postings
    recentJobs.forEach(job => {
      activityFeed.push(`New job posted ${formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}`);
    });

    // Add application submissions
    recentApplications.forEach(application => {
      activityFeed.push(`Application submitted ${formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}`);
    });

    // Sort activities by latest time
    activityFeed.sort((a, b) => new Date(b.timeAgo) - new Date(a.timeAgo));

    return res.status(200).json({
      success: true,
      data: activityFeed, // Returns an array of formatted strings
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRecentJobPostings = async (req, res) => {
  try {
    // Fetch recent jobs (latest postings, limited to 5 for pagination)
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(15) // Adjust limit as per requirement
      .populate("company", "companyName") // Populate company details
      .populate("application"); // Fetch related applications

    // Format job postings
    const jobPostings = recentJobs.map((job) => ({
      jobTitle: job.jobDetails.title,
      company: job.company.companyName, // Extracting company name
      posted: job.createdAt,
      applications: job.application.length, // Counting applications
      status: job.jobDetails.isActive ? "Active" : "Closed", // Determine job status
    }));

    return res.status(200).json({
      success: true,
      data: jobPostings,
    });
  } catch (error) {
    console.error("Error fetching recent job postings:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
