import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";
import Revenue from "../../models/revenue.model.js";
import JobReport from '../../models/jobReport.model.js';


export const getStatisticInRange = async (req, res) => {
  try {
    // Extract query parameters: year and range.
    const { year, range } = req.query;
    const selectedYear = parseInt(year, 10) || new Date().getFullYear();
    const rangeVal = parseInt(range, 10) || 7; // default to 7 if not provided

    const now = new Date();
    let endDate;

    // Determine endDate:
    // If the selected year is the current year, use the current time.
    // Otherwise, use December 31st of the selected year.
    if (selectedYear === now.getFullYear()) {
      endDate = now;
    } else {
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    }

    let startDate;
    let groupFormat;

    /*  
      Decide the grouping based on the range:
      - For range of 7 or 30 days, we use day-level grouping.
      - For range of 1 (interpreted as "last month"), we want day-level breakdown
        for the entire previous month.
      - For range of 3, 6, or 12 (months), we use month-level grouping.
    */
    if (rangeVal === 7 || rangeVal === 30) {
      // For day-based ranges: subtract days from endDate.
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - rangeVal + 1);
      groupFormat = "%Y-%m-%d"; // Group by exact date.
    } else if (rangeVal === 1) {
      // "Last month" case: we want the full previous month with daily data.
      let targetYear = selectedYear;
      let targetMonth;
      if (selectedYear === now.getFullYear()) {
        // For the current year, last month is the previous month.
        targetMonth = now.getMonth() - 1;
        if (targetMonth < 0) {
          // If current month is January, last month is December of the previous year.
          targetMonth = 11;
          targetYear = selectedYear - 1;
        }
      } else {
        // If a past year is selected, we assume the last month is December.
        targetMonth = 11;
      }
      // Set startDate to the first day of the target month.
      startDate = new Date(targetYear, targetMonth, 1);
      // Set endDate to the last day of the target month.
      endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
      groupFormat = "%Y-%m-%d"; // Daily grouping for the month.
    } else {
      // For month-based ranges (3, 6, or 12 months):
      // We assume the window spans whole months and group by month.
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - (rangeVal - 1));
      startDate.setDate(1); // Ensure starting from the first of the month.
      groupFormat = "%Y-%m"; // Group by month.
    }

    // ----- Get Trend Data for Revenue -----
    // Aggregate revenue documents within the date window.
    // Group by the formatted date (daily or monthly) and sum the prices.
    const revenueTrendAgg = await Revenue.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          revenue: { $sum: "$itemDetails.price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const revenueTrend = revenueTrendAgg.map((item) => ({
      date: item._id,
      revenue: item.revenue,
    }));

    // ----- Get Trend Data for New Users -----
    // Aggregate User documents within the same date window.
    // Group by date and count the number of new users.
    const newUsersTrendAgg = await User.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const newUsersTrend = newUsersTrendAgg.map((item) => ({
      date: item._id,
      users: item.count,
    }));

    // ----- Other Aggregated Statistics -----
    // Total revenue across the window.
    const totalRevenueAgg = await Revenue.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: "$itemDetails.price" } } },
    ]);
    const totalRevenue =
      totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    // Count of new users.
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Count total applications and applications by status.
    const totalApplications = await Application.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const pendingApplications = await Application.countDocuments({
      status: "Pending",
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const shortlistedApplications = await Application.countDocuments({
      status: "Shortlisted",
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const rejectedApplications = await Application.countDocuments({
      status: "Rejected",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Count total jobs.
    const totalJobs = await Job.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // ----- Return All Statistics -----
    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        newUsers,
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        rejectedApplications,
        totalJobs,
        revenueTrend,
        newUsersTrend,
      },
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    res.status(500).json({
      message: "Error fetching admin statistics",
      error: error.message,
    });
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
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .select("createdAt");

    // Fetch latest company registrations
    const recentCompanies = await Company.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .select("createdAt");

    // Fetch latest recruiter registrations
    const recentRecruiters = await Recruiter.find()
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
    recentUsers.forEach((user) =>
      activityFeed.push(`${formatTimeDifference(user.createdAt)}`)
    );

    // Add company registration time
    recentCompanies.forEach((company) =>
      activityFeed.push(`${formatTimeDifference(company.createdAt)}`)
    );

    // Add recruiter registration time
    recentRecruiters.forEach((recruiter) =>
      activityFeed.push(`${formatTimeDifference(recruiter.createdAt)}`)
    );

    // Add job posting time
    recentJobs.forEach((job) =>
      activityFeed.push(`${formatTimeDifference(job.createdAt)}`)
    );

    // Add application submission time
    recentApplications.forEach((application) =>
      activityFeed.push(`${formatTimeDifference(application.createdAt)}`)
    );

    return res.status(200).json({
      success: true,
      data: activityFeed.filter((activity) => activity !== null), // Remove null values
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
    const jobPostings = recentJobs.map((job) => ({
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

export const getReportedJobList = async (req, res) => {
  try {
    // Find all job reports and populate user and job details.
    // For the user, we select 'fullname' and 'emailId'.
    // For the job, we select 'title' and 'jobDetails'.
    const reports = await JobReport.find({})
      .populate("userId", "fullname emailId")
      .populate("jobId", "title jobDetails");

    // Format each report
    const formattedReports = reports.map((report) => {
      // Extract user details
      const userFullname = report.userId?.fullname;
      // Assuming user.emailId is an object that holds an 'email' property.
      const userEmail = report.userId?.emailId?.email || "";

      // Extract job details
      const jobTitle = report.jobId?.title;
      // Assuming job.jobDetails is an object containing companyName.
      const jobCompanyName = report.jobId?.jobDetails?.companyName || "";

      // Format createdAt date to "Feb, 15, 2025"
      const createdDate = new Date(report.createdAt);
      const month = createdDate.toLocaleString("en-US", { month: "short" });
      const day = createdDate.getDate();
      const year = createdDate.getFullYear();
      const formattedDate = `${month}, ${day}, ${year}`;

      return {
        reportId: report._id,
        reportTitle: report.reportTitle,
        description: report.description,
        user: {
          id: report.userId?._id,
          fullname: userFullname,
          email: userEmail,
        },
        job: {
          id: report.jobId?._id,
          title: jobTitle,
          companyName: jobCompanyName,
        },
        createdAt: formattedDate,
      };
    });

    return res.status(200).json({ success: true, data: formattedReports });
  } catch (error) {
    console.error("Error fetching reported job list:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
