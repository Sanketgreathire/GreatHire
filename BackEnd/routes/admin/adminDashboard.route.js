import express from "express";
import { User } from "../../models/user.model.js";
import { Job } from "../../models/job.model.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";
import { Recruiter } from "../../models/recruiter.model.js";

const router = express.Router();

// ============================================
// HELPER: Build date filter
// ============================================
const buildDateFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }
  return filter;
};

// ============================================
// 1. KPI ENDPOINT
// GET /api/v1/admin/dashboard/kpi
// ============================================
router.get("/kpi", async (req, res) => {
  try {
    const { startDate, endDate, position, recruiter } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    // Total Employees = total Users (job seekers)
    const totalEmployees = await User.countDocuments({
      role: { $in: ["student", "jobseeker", "user"] },
      ...dateFilter,
    });

    // Total Applications
    const appFilter = { ...dateFilter };
    if (position) {
      const jobs = await Job.find({ "jobDetails.title": position }).select("_id");
      appFilter.job = { $in: jobs.map((j) => j._id) };
    }
    const totalApplications = await Application.countDocuments(appFilter);

    // Total Interviews (applications that reached Interview Schedule or beyond)
    const totalInterviews = await Application.countDocuments({
      ...appFilter,
      status: { $in: ["Interview Schedule", "Shortlisted"] },
    });

    // Total Selected (Shortlisted)
    const totalSelected = await Application.countDocuments({
      ...appFilter,
      status: "Shortlisted",
    });

    // Total Joined (using Shortlisted as proxy - adjust if you have a Joined status)
    const totalJoined = totalSelected;

    // Attrition Rate (calculated as rejected / total applications * 100)
    const totalRejected = await Application.countDocuments({
      ...appFilter,
      status: "Rejected",
    });
    const attritionRate = totalApplications > 0
      ? parseFloat(((totalRejected / totalApplications) * 100).toFixed(1))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalApplications,
        totalInterviews,
        totalSelected,
        totalJoined,
        attritionRate,
      },
    });
  } catch (error) {
    console.error("Error in /kpi:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 2. FUNNEL ENDPOINT
// GET /api/v1/admin/dashboard/funnel
// ============================================
router.get("/funnel", async (req, res) => {
  try {
    const { startDate, endDate, position } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const appFilter = { ...dateFilter };
    if (position) {
      const jobs = await Job.find({ "jobDetails.title": position }).select("_id");
      appFilter.job = { $in: jobs.map((j) => j._id) };
    }

    // Get counts by status
    const totalApplications = await Application.countDocuments(appFilter);
    const shortlisted = await Application.countDocuments({
      ...appFilter,
      status: "Shortlisted",
    });
    const interviewSchedule = await Application.countDocuments({
      ...appFilter,
      status: "Interview Schedule",
    });
    const rejected = await Application.countDocuments({
      ...appFilter,
      status: "Rejected",
    });
    const pending = await Application.countDocuments({
      ...appFilter,
      status: "Pending",
    });

    // Build funnel (stage counts decreasing as we filter)
    const data = [
      { stage: "Applied", count: totalApplications },
      { stage: "Screened", count: totalApplications - rejected },
      { stage: "Interviewed", count: interviewSchedule + shortlisted },
      { stage: "Offered", count: shortlisted },
      { stage: "Selected", count: shortlisted },
      { stage: "Joined", count: shortlisted },
    ];

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in /funnel:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 3. MONTHLY TREND ENDPOINT
// GET /api/v1/admin/dashboard/trend
// ============================================
router.get("/trend", async (req, res) => {
  try {
    const { startDate, endDate, position } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const appFilter = { ...dateFilter };
    if (position) {
      const jobs = await Job.find({ "jobDetails.title": position }).select("_id");
      appFilter.job = { $in: jobs.map((j) => j._id) };
    }

    // Aggregate applications by month
    const pipeline = [
      { $match: appFilter },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const results = await Application.aggregate(pipeline);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Build last 12 months trend
    const data = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;

      const found = results.find(
        (r) => r._id.year === year && r._id.month === month
      );

      data.push({
        month: `${monthNames[month - 1]} ${year}`,
        hires: found ? found.count : 0,
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in /trend:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 4. DEPARTMENT-WISE ENDPOINT
// GET /api/v1/admin/dashboard/department
// ============================================
router.get("/department", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    // Group jobs by industry (as proxy for department)
    const pipeline = [
      { $match: dateFilter },
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "companyData",
        },
      },
      { $unwind: { path: "$companyData", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$companyData.industry", "Other"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ];

    const results = await Job.aggregate(pipeline);

    const data = results.map((r) => ({
      department: r._id || "Other",
      count: r.count,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in /department:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 5. INTERVIEW STATUS ENDPOINT
// GET /api/v1/admin/dashboard/interview-status
// ============================================
router.get("/interview-status", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    // Aggregate by application status
    const pipeline = [
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const results = await Application.aggregate(pipeline);

    const data = results.map((r) => ({
      status: r._id || "Unknown",
      count: r.count,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in /interview-status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 6. FILTER OPTIONS ENDPOINT
// GET /api/v1/admin/dashboard/filter-options
// ============================================
 
router.get("/filter-options", async (req, res) => {
  try {
    // Get distinct values (MongoDB distinct already removes duplicates)
    const positionsRaw = await Job.distinct("jobDetails.title");
    const departmentsRaw = await Company.distinct("industry");
    const recruitersRaw = await Recruiter.distinct("fullname");

    // Clean + deduplicate (case-insensitive)
    const cleanArray = (arr) => {
      const cleaned = arr
        .filter((item) => item && typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);

      // Remove case-insensitive duplicates
      const uniqueMap = new Map();
      cleaned.forEach((item) => {
        const key = item.toLowerCase();
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      });

      return Array.from(uniqueMap.values()).sort();
    };

    const positions = cleanArray(positionsRaw);
    const departments = cleanArray(departmentsRaw);
    const recruiters = cleanArray(recruitersRaw);

    const sources = ["LinkedIn", "Naukri", "Referral", "Indeed", "Company Website", "Direct"];
    const statuses = ["Pending", "Interview Schedule", "Shortlisted", "Rejected"];

    res.status(200).json({
      success: true,
      data: {
        departments,
        positions,
        sources,
        recruiters,
        statuses,
      },
    });
  } catch (error) {
    console.error("Error in /filter-options:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;


 