/*import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";
import Revenue from "../../models/revenue.model.js";
import JobReport from "../../models/jobReport.model.js";
import fs from "fs";
import path from "path";
import { Parser } from "json2csv";

export const getStatisticInRange = async (req, res) => {
  try {
    const { year, range } = req.query;
    const selectedYear = parseInt(year, 10) || new Date().getFullYear();
    const rangeVal = parseInt(range, 10) || 7;

    const now = new Date();
    let endDate;

    if (selectedYear === now.getFullYear()) {
      endDate = now;
    } else {
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    }

    let startDate;
    let groupFormat;

    if (rangeVal === 7 || rangeVal === 30) {
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - rangeVal + 1);
      groupFormat = "%Y-%m-%d";
    } else if (rangeVal === 1) {
      let targetYear = selectedYear;
      let targetMonth;
      if (selectedYear === now.getFullYear()) {
        targetMonth = now.getMonth() - 1;
        if (targetMonth < 0) {
          targetMonth = 11;
          targetYear = selectedYear - 1;
        }
      } else {
        targetMonth = 11;
      }
      startDate = new Date(targetYear, targetMonth, 1);
      endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
      groupFormat = "%Y-%m-%d";
    } else {
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - (rangeVal - 1));
      startDate.setDate(1);
      groupFormat = "%Y-%m";
    }

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

    const totalRevenueAgg = await Revenue.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: "$itemDetails.price" } } },
    ]);
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    const formattedRevenue = new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(totalRevenue);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

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

    const totalJobs = await Job.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: formattedRevenue,
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

    export const exportCorporateCSV = async (req, res) => {
  try {
    const { year, range } = req.query;

    let stats; // <-- ADD THIS

    await getStatisticInRange(
      { query: { year, range } },
      {
        status: () => ({
          json: (data) => {
            stats = data.stats; // <-- CAPTURE STATS SAFELY
            return data;
          },
        }),
      }
    );

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "No data found for CSV export",
      });
    }
    const fields = [
      { label: "Total Revenue", value: "totalRevenue" },
      { label: "New Users", value: "newUsers" },
      { label: "Total Applications", value: "totalApplications" },
      { label: "Shortlisted", value: "shortlistedApplications" },
      { label: "Rejected", value: "rejectedApplications" },
      { label: "Pending", value: "pendingApplications" },
      { label: "Total Jobs", value: "totalJobs" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(stats);

    const reportsDir = path.join(process.cwd(), "public", "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const fileName = `corporate_report_${Date.now()}.csv`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, csv);

    const fileURL = `${req.protocol}://${req.get("host")}/reports/${fileName}`;
    return res.status(200).json({ success: true, url: fileURL });
  } catch (error) {
    console.error("Error exporting corporate CSV:", error);
    return res.status(500).json({ success: false, message: "CSV export failed" });
  }
};

export const getApplicationsDataByYear = async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10);
    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year query parameter is required and must be valid",
      });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const monthlyApplications = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyCounts = Array(12).fill(0);
    monthlyApplications.forEach((item) => {
      monthlyCounts[item._id - 1] = item.count;
    });

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
    const now = new Date();

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(1).select("createdAt");
    const recentCompanies = await Company.find().sort({ createdAt: -1 }).limit(1).select("createdAt");
    const recentRecruiters = await Recruiter.find().sort({ createdAt: -1 }).limit(1).select("createdAt");
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(1).select("createdAt jobDetails.title");
    const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(1).select("createdAt");

    const formatTimeDifference = (createdAt) => {
      if (!createdAt) return null;
      const diffMs = now - new Date(createdAt);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    };

    let activityFeed = [];
    recentUsers.forEach((user) => activityFeed.push(`${formatTimeDifference(user.createdAt)}`));
    recentCompanies.forEach((company) => activityFeed.push(`${formatTimeDifference(company.createdAt)}`));
    recentRecruiters.forEach((recruiter) => activityFeed.push(`${formatTimeDifference(recruiter.createdAt)}`));
    recentJobs.forEach((job) => activityFeed.push(`${formatTimeDifference(job.createdAt)}`));
    recentApplications.forEach((application) => activityFeed.push(`${formatTimeDifference(application.createdAt)}`));

    return res.status(200).json({
      success: true,
      data: activityFeed.filter((activity) => activity !== null),
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================== FIXED LINES BELOW ==================
export const getRecentJobPostings = async (req, res) => {
  try {
    const now = new Date();

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "company",
        select: "companyName",
        options: { strictPopulate: false },
      })
      .populate({ path: "application", options: { strictPopulate: false } })
      .lean(); // ✅ IMPORTANT: prevents mongoose undefined issues

    const formatTimeDifference = (createdAt) => {
      if (!createdAt) return null;
      const diffMs = now - new Date(createdAt);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    };

    const jobPostings = recentJobs
      .filter(job => job && job.jobDetails)
      .map(job => {
        const companyName =
          job.company && job.company.companyName
            ? job.company.companyName
            : "Confidential Client";

        return {
          jobTitle: job.jobDetails?.title || "N/A",
          companyName, // ✅ SAFE
          posted: formatTimeDifference(job.createdAt),
          applications: Array.isArray(job.application) ? job.application.length : 0,
          status: job.jobDetails?.isActive ? "Active" : "Closed",
        };
      });

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
    const jobReports = await JobReport.find({})
      .populate("userId", "fullname emailId phoneNumber")
      .populate("jobId", "jobDetails")
      .lean();

    const jobReportMessages = jobReports.map((report) => ({
      id: report._id,
      type: "job_report",
      user: {
        fullname: report.userId?.fullname || "N/A",
        email: report.userId?.emailId?.email || "N/A",
        phone: report.userId?.phoneNumber?.number || "N/A",
      },
      job: {
        jobId: report.jobId?._id || null,
        title: report.jobId?.jobDetails?.title || "N/A",
        companyName: report.jobId?.jobDetails?.companyName || "Confidential Client",
      },
      reportTitle: report.reportTitle || "N/A",
      description: report.description || "",
      createdAt: report.createdAt,
    }));

    return res.status(200).json({ success: true, data: jobReportMessages });
  } catch (error) {
    console.error("Error fetching reported job list:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};*/

import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";
import Revenue from "../../models/revenue.model.js";
import JobReport from "../../models/jobReport.model.js";
import fs from "fs";
import path from "path";
import { Parser } from "json2csv";

/* ======================================================
   STATISTICS IN RANGE
====================================================== */
export const getStatisticInRange = async (req, res) => {
  try {
    const { year, range } = req.query;
    const selectedYear = parseInt(year, 10) || new Date().getFullYear();
    const rangeVal = parseInt(range, 10) || 7;

    const now = new Date();
    let endDate;

    if (selectedYear === now.getFullYear()) {
      endDate = now;
    } else {
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    }

    let startDate;
    let groupFormat;

    if (rangeVal === 7 || rangeVal === 30) {
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - rangeVal + 1);
      groupFormat = "%Y-%m-%d";
    } else if (rangeVal === 1) {
      let targetYear = selectedYear;
      let targetMonth;

      if (selectedYear === now.getFullYear()) {
        targetMonth = now.getMonth() - 1;
        if (targetMonth < 0) {
          targetMonth = 11;
          targetYear -= 1;
        }
      } else {
        targetMonth = 11;
      }

      startDate = new Date(targetYear, targetMonth, 1);
      endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
      groupFormat = "%Y-%m-%d";
    } else {
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - (rangeVal - 1));
      startDate.setDate(1);
      groupFormat = "%Y-%m";
    }

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

    const totalRevenueAgg = await Revenue.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: "$itemDetails.price" } } },
    ]);

    const totalRevenue =
      totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    const formattedRevenue = new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(totalRevenue);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

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

    const totalJobs = await Job.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue: formattedRevenue,
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
    return res.status(500).json({
      message: "Error fetching admin statistics",
      error: error.message,
    });
  }
};

/* ======================================================
   EXPORT CSV
====================================================== */
export const exportCorporateCSV = async (req, res) => {
  try {
    const { year, range } = req.query;

    const statsResponse = await getStatisticInRange(
      { query: { year, range } },
      { status: () => ({ json: (d) => d }) }
    );

    const stats = statsResponse?.stats;
    if (!stats) {
      return res
        .status(404)
        .json({ success: false, message: "No data found for CSV export" });
    }

    const fields = [
      { label: "Total Revenue", value: "totalRevenue" },
      { label: "New Users", value: "newUsers" },
      { label: "Total Applications", value: "totalApplications" },
      { label: "Shortlisted", value: "shortlistedApplications" },
      { label: "Rejected", value: "rejectedApplications" },
      { label: "Pending", value: "pendingApplications" },
      { label: "Total Jobs", value: "totalJobs" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(stats);

    const reportsDir = path.join(process.cwd(), "public", "reports");
    if (!fs.existsSync(reportsDir))
      fs.mkdirSync(reportsDir, { recursive: true });

    const fileName = `corporate_report_${Date.now()}.csv`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, csv);

    const fileURL = `${req.protocol}://${req.get("host")}/reports/${fileName}`;
    return res.status(200).json({ success: true, url: fileURL });
  } catch (error) {
    console.error("Error exporting corporate CSV:", error);
    return res
      .status(500)
      .json({ success: false, message: "CSV export failed" });
  }
};

/* ======================================================
   APPLICATIONS BY YEAR
====================================================== */
export const getApplicationsDataByYear = async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10);
    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year query parameter is required and must be valid",
      });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const monthlyApplications = await Application.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    ]);

    const monthlyCounts = Array(12).fill(0);
    monthlyApplications.forEach((item) => {
      monthlyCounts[item._id - 1] = item.count;
    });

    return res.status(200).json({ success: true, data: monthlyCounts });
  } catch (error) {
    console.error("Error fetching applications data:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   RECENT ACTIVITY
====================================================== */
export const getRecentActivity = async (req, res) => {
  try {
    const now = new Date();

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(1);
    const recentCompanies = await Company.find().sort({ createdAt: -1 }).limit(1);
    const recentRecruiters = await Recruiter.find()
      .sort({ createdAt: -1 })
      .limit(1);
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(1);
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(1);

    const formatTimeDifference = (createdAt) => {
      if (!createdAt) return null;
      const diffMs = now - new Date(createdAt);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    };

    const activityFeed = [];

    recentUsers.forEach((u) =>
      activityFeed.push(formatTimeDifference(u.createdAt))
    );
    recentCompanies.forEach((c) =>
      activityFeed.push(formatTimeDifference(c.createdAt))
    );
    recentRecruiters.forEach((r) =>
      activityFeed.push(formatTimeDifference(r.createdAt))
    );
    recentJobs.forEach((j) =>
      activityFeed.push(formatTimeDifference(j.createdAt))
    );
    recentApplications.forEach((a) =>
      activityFeed.push(formatTimeDifference(a.createdAt))
    );

    return res.status(200).json({
      success: true,
      data: activityFeed.filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   RECENT JOB POSTINGS  ✅ FIXED
====================================================== */
export const getRecentJobPostings = async (req, res) => {
  try {
    const now = new Date();

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("company", "companyName")
      .populate("application");

    const formatTimeDifference = (createdAt) => {
      if (!createdAt) return null;
      const diffMs = now - new Date(createdAt);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    };

    const jobPostings = recentJobs.map((job) => ({
      jobTitle: job.jobDetails?.title,
      company: job.company?.companyName,
      posted: formatTimeDifference(job.createdAt),
      applications: Array.isArray(job.application)
        ? job.application.length
        : 0,
      status: job.jobDetails?.isActive ? "Active" : "Closed",
    }));

    return res.status(200).json({ success: true, jobPostings });
  } catch (error) {
    console.error("Error fetching recent job postings:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   REPORTED JOBS
====================================================== */
export const getReportedJobList = async (req, res) => {
  try {
    const jobReports = await JobReport.find({})
      .populate("userId", "fullname emailId phoneNumber")
      .populate("jobId", "jobDetails")
      .lean();

    const jobReportMessages = jobReports.map((report) => ({
      id: report._id,
      type: "job_report",
      user: {
        fullname: report.userId?.fullname,
        email: report.userId?.emailId?.email,
        phone: report.userId?.phoneNumber?.number,
      },
      job: {
        jobId: report.jobId?._id,
        title: report.jobId?.jobDetails?.title,
        companyName: report.jobId?.jobDetails?.companyName,
      },
      reportTitle: report.reportTitle,
      description: report.description,
      createdAt: report.createdAt,
    }));

    return res.status(200).json({ success: true, data: jobReportMessages });
  } catch (error) {
    console.error("Error fetching reported job list:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

