 
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/admin/Navbar";

import { useDispatch,useSelector } from "react-redux";
import {
  fetchCompanyStats,
  fetchRecruiterStats,
  fetchJobStats,
  fetchApplicationStats,
  fetchUserStats,
} from "@/redux/admin/statsSlice";


import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Briefcase, UserCheck, ChevronLeft, ChevronRight, Bot,Users,
  FileText,
  Calendar,
  CheckCircle,
  UserPlus,
  TrendingDown, } from "lucide-react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
 
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { motion } from "framer-motion";
import CountUp from "react-countup";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
} from "recharts";
 
import {
  DASHBOARD_KPI_ENDPOINT,
  DASHBOARD_FUNNEL_ENDPOINT,
  DASHBOARD_TREND_ENDPOINT,
  DASHBOARD_DEPARTMENT_ENDPOINT,
  DASHBOARD_INTERVIEW_ENDPOINT,
  DASHBOARD_FILTER_OPTIONS_ENDPOINT,
} from "@/utils/ApiEndPoint";

import toast from "react-hot-toast";

const CHART_COLORS = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b",
  "#ef4444", "#14b8a6", "#ec4899", "#6366f1",
];

const FUNNEL_COLORS = ["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"];

// ─── LOADER ───
const Loader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
  </div>
);

// ─── EMPTY STATE ───
const EmptyState = ({ message = "No data available" }) => (
  <div className="flex items-center justify-center py-12 text-gray-400">
    <p className="text-xs">{message}</p>
  </div>
);
EmptyState.propTypes = {
  message: PropTypes.string,
};

// ─── RECRUITMENT KPI CARD   ───
const RecruitmentKPICard = ({ title, value, icon: Icon, iconColor = "text-blue-600", loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        {Icon && (
          <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
        {value !== undefined && value !== null ? value.toLocaleString() : 0}
      </p>
    </div>
  );
};

RecruitmentKPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
  loading: PropTypes.bool,
};

// ─── CHART CARD ───
const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

// ─── CUSTOM TOOLTIP ───
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
        <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
          {label}
        </p>
        {payload.map((item, index) => (
          <p key={index} className="text-xs text-gray-600 dark:text-gray-300">
            {item.name}: <span className="font-bold">{item.value?.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Dashboard = () => {
  const dispatch = useDispatch();
  const companyStats = useSelector((state) => state.stats.companyStatsData);
  const { user } = useSelector((state) => state.auth);
  const recruiterStats = useSelector((state) => state.stats.recruiterStatsData);
  const jobStats = useSelector((state) => state.stats.jobStatsData);
  const userStats = useSelector((state) => state.stats.userStatsData);


  useEffect(() => {
    dispatch(fetchCompanyStats());
    dispatch(fetchRecruiterStats());
    dispatch(fetchJobStats());
    dispatch(fetchApplicationStats());
    dispatch(fetchUserStats());
  }, [dispatch]);

  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState(null);
  const [jobPostings, setJobPostedJob] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sourcedCount, setSourcedCount] = useState(0);

  // new code
  const [error, setError] = useState(null);

  const [kpis, setKpis] = useState({
    totalEmployees: 0,
    totalApplications: 0,
    totalInterviews: 0,
    totalSelected: 0,
    totalJoined: 0,
    attritionRate: 0,
  });
  const [funnelData, setFunnelData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [interviewStatusData, setInterviewStatusData] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    department: "all",
    position: "all",
    source: "all",
    recruiter: "all",
  });

  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    positions: [],
    sources: [],
    recruiters: [],
  });

  const fetchFilterOptions = useCallback(async () => {
    try {
      const { data } = await axios.get(DASHBOARD_FILTER_OPTIONS_ENDPOINT, {
        withCredentials: true,
      });
      if (data.success) setFilterOptions(data.data);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value);
      });
      const queryString = params.toString() ? `?${params.toString()}` : "";

      const [kpiRes, funnelRes, trendRes, deptRes, interviewRes] =
        await Promise.all([
          axios.get(`${DASHBOARD_KPI_ENDPOINT}${queryString}`, { withCredentials: true }),
          axios.get(`${DASHBOARD_FUNNEL_ENDPOINT}${queryString}`, { withCredentials: true }),
          axios.get(`${DASHBOARD_TREND_ENDPOINT}${queryString}`, { withCredentials: true }),
          axios.get(`${DASHBOARD_DEPARTMENT_ENDPOINT}${queryString}`, { withCredentials: true }),
          axios.get(`${DASHBOARD_INTERVIEW_ENDPOINT}${queryString}`, { withCredentials: true }),
        ]);

      if (kpiRes.data.success) setKpis(kpiRes.data.data);
      if (funnelRes.data.success) setFunnelData(funnelRes.data.data);
      if (trendRes.data.success) setTrendData(trendRes.data.data);
      if (deptRes.data.success) setDepartmentData(deptRes.data.data);
      if (interviewRes.data.success) setInterviewStatusData(interviewRes.data.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFilters((prev) => ({
      ...prev,
      startDate: firstDay.toISOString().split("T")[0],
      endDate: lastDay.toISOString().split("T")[0],
    }));

    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetchDashboardData();
    }
  }, [filters, fetchDashboardData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFilters({
      startDate: firstDay.toISOString().split("T")[0],
      endDate: lastDay.toISOString().split("T")[0],
      department: "all",
      position: "all",
      source: "all",
      recruiter: "all",
    });
  };


  // Interview completion %
  const interviewTotal = interviewStatusData.reduce((sum, i) => sum + i.count, 0);
  const interviewCompleted =
    interviewStatusData.find((i) => i.status === "Completed" || i.status === "Shortlisted")?.count || 0;
  const interviewCompletionPercent =
    interviewTotal > 0 ? Math.round((interviewCompleted / interviewTotal) * 100) : 0;

  // Track dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      title: "Total Companies",
      count: companyStats?.totalCompanies || 0,
      change: "+10%",
      icon: <HiOutlineBuildingOffice2 size={26} />,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-200/40 dark:bg-indigo-900/30",
    },
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0,
      change: "+8.1%",
      icon: <UserCheck size={26} />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-200/40 dark:bg-purple-900/30",
    },
    {
      title: "Total Job Seekers",
      count: userStats?.totalUsers || 0,
      change: "+12.5%",
      icon: <FaRegUser size={26} />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-200/40 dark:bg-blue-900/30",
    },
    {
      title: "AI Sourced",
      count: sourcedCount,
      change: "candidates",
      icon: <Bot size={26} />,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-200/40 dark:bg-orange-900/30",
    },
    {
      title: "Candidate Database",
      count: userStats?.totalUsers || 0,
      change: "profiles",
      icon: <FaRegUser size={26} />,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-200/40 dark:bg-cyan-900/30",
    },
    {
      title: "Total Jobs",
      count: jobStats?.totalJobs || 0,
      change: "+5.2%",
      icon: <Briefcase size={26} />,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-200/40 dark:bg-green-900/30",
    },
  ];

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  

  const [applicationsData, setApplicationsData] = useState({
    labels: MONTH_LABELS,
    datasets: [
      {
        label: "Applications",
        data: Array(12).fill(0),
        borderColor: "rgba(147,51,234,1)",
        backgroundColor: "rgba(147,51,234,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${ADMIN_STAT_API_END_POINT}/applications?year=${selectedYear}`,
          { withCredentials: true }
        );

        setApplicationsData({
          labels: MONTH_LABELS,
          datasets: [
            {
              label: "Applications",
              data: response.data.data,
              borderColor: isDarkMode ? "rgba(192,132,252,1)" : "rgba(147,51,234,1)",
              backgroundColor: isDarkMode ? "rgba(192,132,252,0.2)" : "rgba(147,51,234,0.3)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching applications data:", error);
      }
    };
    fetchData();
  }, [selectedYear, isDarkMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#f3f4f6' : '#111827',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: isDarkMode ? '#9ca3af' : '#6b7280', font: { size: 11 } },
        grid: { color: isDarkMode ? '#374151' : '#e5e7eb', drawBorder: false },
      },
      y: {
        ticks: { color: isDarkMode ? '#9ca3af' : '#6b7280', font: { size: 11 } },
        grid: { color: isDarkMode ? '#374151' : '#e5e7eb', drawBorder: false },
      },
    },
  };

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(jobPostings.length / jobsPerPage));
  const displayedJobs = jobPostings.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/recent-activity`, { withCredentials: true });
      if (response.data.success) setRecentActivity(response.data.data);
    } catch (err) {
      console.log(`Error in fetch recent activity ${err}`);
    }
  };

  const fetchRecentPostedJob = async () => {
    try {
      const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/recent-job-postings`, { withCredentials: true });
      if (response.data.success) setJobPostedJob(response.data.jobPostings);
    } catch (err) {
      console.log(`Error in fetch recent activity ${err}`);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchRecentActivity();
      fetchRecentPostedJob();
      console.log('Fetching AI sourced count...');
      axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/sourcing/stats`, { withCredentials: true })
        .then(({ data }) => {
          console.log('AI sourced response:', data);
          if (data.success) {
            console.log('Setting sourced count to:', data.stats.total);
            setSourcedCount(data.stats.total);
          }
        })
        .catch((err) => {
          console.error('Error fetching AI sourced count:', err);
        });
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      <Navbar linkName={"Dashboard"} />

      {/* ═══════ MAIN CONTAINER   ═══════ */}
      <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen overflow-x-hidden">

        {/* ═══════ PAGE HEADER ═══════ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Welcome back, {user?.fullname || "Admin"}
            </p>
          </div>
          <div className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* ═══════ SECTION 1: PLATFORM OVERVIEW ═══════ */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            📊 Platform Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      <CountUp end={stat.count} duration={1.5} />
                    </p>
                    <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══════ SECTION 2: RECRUITMENT METRICS ═══════ */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            🎯 Recruitment Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <RecruitmentKPICard title="Total Employees" value={kpis.totalEmployees} icon={Users} iconColor="text-blue-600" loading={loading} />
            <RecruitmentKPICard title="Applications" value={kpis.totalApplications} icon={FileText} iconColor="text-purple-600" loading={loading} />
            <RecruitmentKPICard title="Interviews" value={kpis.totalInterviews} icon={Calendar} iconColor="text-orange-600" loading={loading} />
            <RecruitmentKPICard title="Selected" value={kpis.totalSelected} icon={CheckCircle} iconColor="text-green-600" loading={loading} />
            <RecruitmentKPICard title="Joined" value={kpis.totalJoined} icon={UserPlus} iconColor="text-teal-600" loading={loading} />
            <RecruitmentKPICard title="Attrition %" value={kpis.attritionRate} icon={TrendingDown} iconColor="text-red-600" loading={loading} />
          </div>
        </div>

        {/* ═══════ SECTION 3: FILTERS ═══════ */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
            <div>
              <label className="block text-[15px] font-medium text-gray-500 mb-0.5">From</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[15px] font-medium text-gray-500 mb-0.5">To</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[15px] font-medium text-gray-500 mb-0.5">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className=" dashboard-filter  w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white  "
              >
                <option value="all">All</option>
                {filterOptions.departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[15px] font-medium text-gray-500 mb-0.5">Position</label>
              <select
                value={filters.position}
                onChange={(e) => handleFilterChange("position", e.target.value)}
                className=" dashboard-filter w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                {filterOptions.positions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[15px] font-medium text-gray-500 mb-0.5">Source</label>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange("source", e.target.value)}
                className=" dashboard-filter w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                {filterOptions.sources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[15px] font-medium text-gray-500 mb-0.5">Recruiter</label>
              <select
                value={filters.recruiter}
                onChange={(e) => handleFilterChange("recruiter", e.target.value)}
                className="dashboard-filter w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                {filterOptions.recruiters.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ═══════ ERROR ═══════ */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-1 px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded"
            >
              Retry
            </button>
          </div>
        )}

        {/* ═══════ SECTION 4: CHARTS ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Activities */}
          <Card className="p-6 shadow-sm rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Recent Activities
            </h3>
            <ul className="relative border-l-2 border-purple-300 dark:border-purple-600 ml-4 sm:ml-6">
              {["User Registered", "Company Registered", "Recruiter Registered", "Job Posted", "Application Submitted"].map((label, i) => (
                <li key={i} className="mb-8 ml-4">
                  <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 rounded-full ring-4 ring-white dark:ring-gray-900 text-white shadow-md">
                    {label.charAt(0)}
                  </span>
                  <p className="font-medium text-gray-700 dark:text-gray-300 pl-4">{label}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400 pl-4">
                    {recentActivity?.[i]}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Monthly Hiring Trend  */}
          <Card className="p-6 shadow-sm rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Monthly Hiring Trend
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
              </div>
            ) : trendData.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <p className="text-xs">No trend data available</p>
              </div>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="hires" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Department-wise Hiring */}
          <ChartCard title="Department-wise Hiring">
            {loading ? (
              <Loader />
            ) : departmentData.length === 0 ? (
              <EmptyState message="No department data available" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-[220px] flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        dataKey="count"
                        nameKey="department"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {departmentData.map((_, index) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5">
                  {departmentData.map((item, i) => {
                    const total = departmentData.reduce((s, d) => s + d.count, 0);
                    const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="text-[10px] text-gray-600 dark:text-gray-400">
                          {item.department} ({percent}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </ChartCard>

          {/* Interview Status */}
          <ChartCard title="Interview Status">
            {loading ? (
              <Loader />
            ) : interviewStatusData.length === 0 ? (
              <EmptyState message="No interview status data available" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-[220px] flex-1 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={interviewStatusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                      >
                        {interviewStatusData.map((_, index) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {interviewCompletionPercent}%
                    </span>
                    <span className="text-[9px] text-gray-400">Completed</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {interviewStatusData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-[10px] text-gray-600 dark:text-gray-400">
                        {item.status} ({item.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* ═══════ SECTION 5: RECENT ACTIVITY + APPLICATIONS OVERVIEW ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


          {/* Recruitment Funnel */}
          <ChartCard title="Recruitment Funnel">
            {loading ? (
              <Loader />
            ) : funnelData.length === 0 ? (
              <EmptyState message="No funnel data available" />
            ) : (
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="h-[260px] flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Funnel dataKey="count" data={funnelData} nameKey="stage" isAnimationActive>
                        <LabelList
                          position="right"
                          fill="#374151"
                          stroke="none"
                          style={{ fontSize: 11, fontWeight: 600 }}
                          formatter={(value) => value}
                        />
                        {funnelData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]}
                          />
                        ))}
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full md:w-40 space-y-1.5 border-l-0 md:border-l md:pl-3 border-gray-200 dark:border-gray-700">
                  {funnelData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <span
                          className="w-2 h-2 rounded-sm"
                          style={{ backgroundColor: FUNNEL_COLORS[i % FUNNEL_COLORS.length] }}
                        />
                        {item.stage}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {item.count}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] text-gray-500">Overall Conversion</p>
                    <p className="text-sm font-bold text-blue-600">
                      {funnelData[0]?.count > 0
                        ? Math.round(
                          ((funnelData[funnelData.length - 1]?.count || 0) /
                            funnelData[0].count) *
                          100
                        )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ChartCard>

          {/* Applications Overview */}
          <Card className="p-6 shadow-sm rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                Applications Overview
              </h3>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                variant="outlined"
                size="small"
                style={{ minWidth: 120 }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#8b5cf6' : '#7c3aed',
                  },
                  '& .MuiSelect-select': {
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                  },
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  borderRadius: '0.5rem',
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: isDarkMode ? '#374151' : '#ffffff',
                      color: isDarkMode ? '#f3f4f6' : '#111827',
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          bgcolor: isDarkMode ? '#4b5563' : '#f3f4f6',
                        },
                        '&.Mui-selected': {
                          bgcolor: isDarkMode ? '#4b5563' : '#e5e7eb',
                          '&:hover': {
                            bgcolor: isDarkMode ? '#6b7280' : '#d1d5db',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[320px]">
                <Line data={applicationsData} options={chartOptions} />
              </div>
            </div>
          </Card>
        </div>

        {/* ═══════ SECTION 6: RECENT JOB POSTINGS ═══════ */}
        <Card className="p-6 shadow-sm rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Recent Job Postings
            </h3>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Total Jobs: <span className="font-bold text-gray-900 dark:text-white">{jobPostings.length}</span>
            </h3>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Job Title</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Company</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Posted</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Applications</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedJobs.length > 0 ? (
                    displayedJobs.map((job, index) => (
                      <TableRow key={job._id || `job-${index}`} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <TableCell className="text-gray-900 dark:text-gray-100 font-medium">{job.jobTitle}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{job.company}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{job.posted}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{job.applications}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {job.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No job postings available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {jobPostings.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mt-6 gap-3">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="rounded-full px-4 py-2 flex items-center gap-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} /> Prev
              </Button>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-full px-4 py-2 flex items-center gap-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default Dashboard;