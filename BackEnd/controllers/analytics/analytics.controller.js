import { Company } from "../../models/company.model.js";
import { Job } from "../../models/job.model.js";
import { Application } from "../../models/application.model.js";
import { Recruiter } from "../../models/recruiter.model.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const recruiterId = req.id;

    const company = await Company.findOne({ "userId.user": recruiterId })
      .select("_id plan creditedForJobs creditedForCandidates maxJobPosts userId freeJobsPosted planJobsPostedThisMonth paidPlanFreeJobsPosted")
      .lean();

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const companyId = company._id;
    const recruiterIds = company.userId.map((u) => u.user);

    const [jobs, recruiterDocs] = await Promise.all([
      Job.find({ company: companyId })
        .select("_id jobDetails.title jobDetails.isActive created_by createdAt application")
        .lean(),
      Recruiter.find({ _id: { $in: recruiterIds } })
        .select("_id fullname")
        .lean(),
    ]);

    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .select("_id job applicantName status createdAt")
      .populate("job", "jobDetails.title created_by")
      .lean();

    // KPIs
    const totalApplicants = applications.length;
    const activeJobs      = jobs.filter((j) => j.jobDetails?.isActive).length;
    const shortlisted     = applications.filter((a) => a.status === "Shortlisted").length;
    const interviewed     = applications.filter((a) => a.status === "Interview Schedule").length;
    const successRate     = totalApplicants > 0 ? Math.round((shortlisted / totalApplicants) * 100) : 0;

    // Remaining job posts
    const plan = company.plan || "FREE";
    const PLAN_LIMITS = { FREE: 1, STANDARD: 5, PREMIUM: 10, PRO: 25, ENTERPRISE: Infinity };
    const jobsUsed = plan === "FREE"
      ? (company.freeJobsPosted || 0)
      : (company.planJobsPostedThisMonth || 0);
    const planLimit = PLAN_LIMITS[plan] ?? 1;
    const remainingJobPosts = planLimit === Infinity ? "∞" : Math.max(0, planLimit - jobsUsed);

    // Applications trend — last 7 days
    const trendMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      trendMap[key] = 0;
    }
    applications.forEach((a) => {
      const key = new Date(a.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      if (key in trendMap) trendMap[key]++;
    });
    const applicationsTrend = Object.entries(trendMap).map(([date, count]) => ({ date, applications: count }));

    // Funnel
    const funnel = [
      { name: "Applicants",  value: totalApplicants },
      { name: "Shortlisted", value: shortlisted },
      { name: "Interview",   value: interviewed },
      { name: "Hired",       value: shortlisted }, // use shortlisted as proxy until Hired status exists
    ];

    // Recruiter performance
    const hiresByRecruiter = {};
    applications
      .filter((a) => a.status === "Shortlisted")
      .forEach((a) => {
        const rid = a.job?.created_by?.toString();
        if (rid) hiresByRecruiter[rid] = (hiresByRecruiter[rid] || 0) + 1;
      });
    const recruitersPerformance = recruiterDocs.map((r) => ({
      name:  r.fullname?.split(" ")[0] || "Recruiter",
      hires: hiresByRecruiter[r._id.toString()] || 0,
    }));

    // Monthly hiring — last 5 months
    const monthlyMap = {};
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString("en-IN", { month: "short" });
      monthlyMap[key] = 0;
    }
    applications
      .filter((a) => a.status === "Shortlisted")
      .forEach((a) => {
        const key = new Date(a.createdAt).toLocaleDateString("en-IN", { month: "short" });
        if (key in monthlyMap) monthlyMap[key]++;
      });
    const monthlyHiring = Object.entries(monthlyMap).map(([month, hired]) => ({ month, hired }));

    // Applications by job role (horizontal bar)
    const roleMap = {};
    applications.forEach((a) => {
      const title = a.job?.jobDetails?.title || "Unknown";
      roleMap[title] = (roleMap[title] || 0) + 1;
    });
    const applicationsByRole = Object.entries(roleMap)
      .map(([role, count]) => ({ role, applications: count }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 6);

    // Top job categories — group by keyword in title
    const categoryKeywords = {
      Development: ["developer", "engineer", "frontend", "backend", "fullstack", "software"],
      Design:      ["design", "ui", "ux", "graphic"],
      "Data Science": ["data", "analyst", "ml", "ai", "machine"],
      Marketing:   ["marketing", "seo", "content", "social"],
      HR:          ["hr", "human resource", "recruiter", "talent"],
    };
    const catCount = { Development: 0, Design: 0, "Data Science": 0, Marketing: 0, HR: 0, Others: 0 };
    applications.forEach((a) => {
      const t = (a.job?.jobDetails?.title || "").toLowerCase();
      let matched = false;
      for (const [cat, kws] of Object.entries(categoryKeywords)) {
        if (kws.some((kw) => t.includes(kw))) { catCount[cat]++; matched = true; break; }
      }
      if (!matched) catCount.Others++;
    });
    const topCategories = Object.entries(catCount)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));

    // Applications heatmap — day × hour buckets
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const HOURS = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "11 PM"];
    const heatGrid = {};
    DAYS.forEach((d) => { heatGrid[d] = {}; HOURS.forEach((h) => { heatGrid[d][h] = 0; }); });
    applications.forEach((a) => {
      const dt = new Date(a.createdAt);
      const day = DAYS[(dt.getDay() + 6) % 7];
      const hr = dt.getHours();
      const bucket = hr < 4 ? "12 AM" : hr < 8 ? "4 AM" : hr < 12 ? "8 AM" : hr < 16 ? "12 PM" : hr < 20 ? "4 PM" : hr < 23 ? "8 PM" : "11 PM";
      heatGrid[day][bucket]++;
    });
    const heatmap = DAYS.map((day) => ({ day, ...heatGrid[day] }));

    // Sources
    const sources = [{ name: "GreatHire", value: totalApplicants }];

    // AI Insights — generated from real data
    const insights = [
      `${totalApplicants} total applications received this period`,
      shortlisted > 0
        ? `${shortlisted} candidates shortlisted (${successRate}% success rate)`
        : "No candidates shortlisted yet — review pending applications",
      interviewed > 0
        ? `${interviewed} interviews scheduled`
        : "No interviews scheduled yet",
      remainingJobPosts === "∞"
        ? "Unlimited job posts available on your Enterprise plan"
        : `${remainingJobPosts} job posts remaining this month`,
    ];

    // Live activity feed
    const activities = applications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((a) => ({
        title: `${a.applicantName || "Candidate"} applied for ${a.job?.jobDetails?.title || "a role"}`,
        time:  new Date(a.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      }));

    return res.status(200).json({
      success: true,
      // flat fields for KPI cards
      recruiters:        recruiterDocs.length,
      postedJobs:        jobs.length,
      remainingJobPosts,
      activeJobs,
      applicants:        totalApplicants,
      shortlisted,
      successRate,
      databaseCredits:   company.creditedForCandidates ?? 0,
      // chart data
      applicationsTrend,
      funnel,
      recruitersPerformance,
      monthlyHiring,
      sources,
      applicationsByRole,
      topCategories,
      heatmap,
      activities,
      insights,
      plan,
    });
  } catch (error) {
    console.error("[getDashboardAnalytics] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
