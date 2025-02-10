import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";
import { formatDistanceToNow } from 'date-fns';

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
    // Get current timestamp
    const now = new Date();

    // Fetch latest users (new user registrations)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(1).select("createdAt");

    // Fetch latest company registrations
    const recentCompanies = await Company.find().sort({ createdAt: -1 }).limit(1).select("createdAt");

    // Fetch latest recruiter registrations
    const recentRecruiters = await Recruiter.find().sort({ createdAt: -1 }).limit(1).select("createdAt");

    // Fetch latest jobs (new job postings)
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(1).select("createdAt jobDetails.title");

    // Fetch latest applications (submissions)
    const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(1).select("createdAt");

    // Function to format time difference
    const formatTimeDifference = (createdAt) => {
      if (!createdAt) return null;
      const diffMs = now - new Date(createdAt); // Difference in milliseconds
      const diffMins = Math.floor(diffMs / 60000); // Convert to minutes
      const diffHours = Math.floor(diffMins / 60); // Convert to hours
      const diffDays = Math.floor(diffHours / 24); // Convert to days

      if (diffMins < 60) return `${diffMins} minutes ago`; // Show minutes if < 60
      if (diffHours < 24) return `${diffHours} hours ago`; // Show hours if < 24
      return `${diffDays} days ago`; // Show days otherwise
    };

    // Store formatted activity times
    let activityFeed = [];

    // Add user registration time
    recentUsers.forEach(user => activityFeed.push(`${formatTimeDifference(user.createdAt)}`));

    // Add company registration time
    recentCompanies.forEach(company => activityFeed.push(`${formatTimeDifference(company.createdAt)}`));

    // Add recruiter registration time
    recentRecruiters.forEach(recruiter => activityFeed.push(`${formatTimeDifference(recruiter.createdAt)}`));

    // Add job posting time
    recentJobs.forEach(job => activityFeed.push(`${formatTimeDifference(job.createdAt)}`));

    // Add application submission time
    recentApplications.forEach(application => activityFeed.push(`${formatTimeDifference(application.createdAt)}`));

    return res.status(200).json({
      success: true,
<<<<<<< HEAD
      activityFeed, // Returns an array of formatted strings
=======
      data: activityFeed.filter(activity => activity !== null), // Remove null values
>>>>>>> 566b28d610c1e78baf20114b84e5dab9cddbba68
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
    // Get current timestamp
    const now = new Date();

    // Fetch recent jobs (latest postings, limited to 5 for pagination)
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("company", "companyName") // Populate company details
      .populate("application"); // Fetch related applications
    // Function to format time difference
    const formatTimeDifference = (createdAt) => {
      if (!createdAt) return null;
      const diffMs = now - new Date(createdAt); // Difference in milliseconds
      const diffMins = Math.floor(diffMs / 60000); // Convert to minutes
      const diffHours = Math.floor(diffMins / 60); // Convert to hours
      const diffDays = Math.floor(diffHours / 24); // Convert to days
      if (diffMins < 60) return `${diffMins} minutes ago`; // Show minutes if < 60
      if (diffHours < 24) return `${diffHours} hours ago`; // Show hours if < 24
      return `${diffDays} days ago`; // Show days otherwise
    };

    // Format job postings and filter out jobs with zero applications
    const jobPostings = recentJobs
      .map(job => ({
        jobTitle: job.jobDetails.title,
        company: job.company.companyName, // Extracting company name
        posted: formatTimeDifference(job.createdAt),
        applications: job.application.length, // Counting applications
        status: job.jobDetails.isActive ? "Active" : "Closed", // Determine job status
      }));
    

    return res.status(200).json({
      success: true,
      jobPostings,
    });
  } catch (error) {
    console.error("Error fetching recent job postings:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
