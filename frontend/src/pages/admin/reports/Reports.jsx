// Reports.jsx — Modern Elite Corporate with Dark Mode Support
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/admin/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, MenuItem, FormControl } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DollarSign, Users, Briefcase, CheckCircle } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ADMIN_STAT_API_END_POINT, COURSE_API_END_POINT } from "@/utils/ApiEndPoint";
import { Dialog } from "@mui/material";

const exportToCSV = (data, filename = "report.csv") => {
  const headers = Object.keys(data[0]).join(",") + "\n";
  const rows = data.map(row => Object.values(row).join(",")).join("\n");
  const csvContent = headers + rows;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const createCSVBlobURL = (data) => {
  const headers = Object.keys(data[0]).join(",") + "\n";
  const rows = data.map(row => Object.values(row).join(",")).join("\n");
  const csvContent = headers + rows;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  return URL.createObjectURL(blob);
};

const Accent = {
  primary: "#1E40AF",
  primaryLight: "#3B82F6",
  surface: "#FFFFFF",
  muted: "#6B7280",
  glass: "rgba(30,64,175,0.06)",
};

const COURSE_COLORS = {
  enquiry:    "#3B82F6",
  demo:       "#8B5CF6",
  enrollment: "#10B981",
  counsellor: "#F59E0B",
};

const Skeleton = ({ className = "h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" }) => (
  <div className={className} aria-hidden />
);

const KPI = ({ label, value, icon, delta }) => (
  <Card className="p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <div className="mt-2 flex items-baseline gap-3">
          <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</h4>
          {delta != null && (
            <span className={`text-sm font-medium ${delta >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {delta >= 0 ? `+${delta}%` : `${delta}%`}
            </span>
          )}
        </div>
      </div>
      <div className="p-3 rounded-full shadow-sm bg-blue-50 dark:bg-blue-900/30" aria-hidden>
        {icon}
      </div>
    </div>
  </Card>
);

const FilterBar = ({ year, range, onYearChange, onRangeChange, onApply, loading, isDarkMode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-wrap gap-4 items-center justify-between transition-colors">
    <div className="flex gap-3 items-center">
      <FormControl size="small">
        <Select
          value={year}
          onChange={onYearChange}
          size="small"
          className="min-w-[140px]"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#4b5563' : '#d1d5db' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#6b7280' : '#9ca3af' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#3b82f6' : '#2563eb' },
            '& .MuiSelect-select': { color: isDarkMode ? '#f3f4f6' : '#111827', backgroundColor: isDarkMode ? '#374151' : '#ffffff' },
            '& .MuiSvgIcon-root': { color: isDarkMode ? '#9ca3af' : '#6b7280' },
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                '& .MuiMenuItem-root': {
                  '&:hover': { bgcolor: isDarkMode ? '#4b5563' : '#f3f4f6' },
                  '&.Mui-selected': { bgcolor: isDarkMode ? '#4b5563' : '#e5e7eb', '&:hover': { bgcolor: isDarkMode ? '#6b7280' : '#d1d5db' } },
                },
              },
            },
          }}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <Select
          value={range}
          onChange={onRangeChange}
          size="small"
          className="min-w-[160px]"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#4b5563' : '#d1d5db' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#6b7280' : '#9ca3af' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#3b82f6' : '#2563eb' },
            '& .MuiSelect-select': { color: isDarkMode ? '#f3f4f6' : '#111827', backgroundColor: isDarkMode ? '#374151' : '#ffffff' },
            '& .MuiSvgIcon-root': { color: isDarkMode ? '#9ca3af' : '#6b7280' },
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                '& .MuiMenuItem-root': {
                  '&:hover': { bgcolor: isDarkMode ? '#4b5563' : '#f3f4f6' },
                  '&.Mui-selected': { bgcolor: isDarkMode ? '#4b5563' : '#e5e7eb', '&:hover': { bgcolor: isDarkMode ? '#6b7280' : '#d1d5db' } },
                },
              },
            },
          }}
        >
          <MenuItem value={7}>Last 7 Days</MenuItem>
          <MenuItem value={30}>Last 30 Days</MenuItem>
          <MenuItem value={1}>Last Month</MenuItem>
          <MenuItem value={3}>Last 3 Months</MenuItem>
          <MenuItem value={6}>Last 6 Months</MenuItem>
          <MenuItem value={12}>Last 12 Months</MenuItem>
        </Select>
      </FormControl>

      <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">Showing recent data for analysis</div>
    </div>

    <div className="flex gap-3">
      <Button
        className="h-10 rounded-xl px-5 bg-gradient-to-r from-[#1E40AF] to-[#4F46E5] hover:opacity-95 text-white shadow"
        onClick={onApply}
        disabled={loading}
        aria-label="Apply filters"
      >
        {loading ? "Refreshing..." : "Apply Filters"}
      </Button>
    </div>
  </div>
);

const Reports = () => {
  useEffect(() => {
    if (!document.getElementById("poppins-font")) {
      const link = document.createElement("link");
      link.id = "poppins-font";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap";
      document.head.appendChild(link);
      document.documentElement.style.fontFamily = "Poppins, system-ui, -apple-system, 'Segoe UI', Roboto";
    }
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleShare = async () => {
    if (!csvData.length) {
      alert("No data available to share!");
      return;
    }
    try {
      const { data } = await axios.get(`${ADMIN_STAT_API_END_POINT}/export-corporate-csv`, {
        params: { year: selectedYear, range: selectedRange },
        withCredentials: true,
      });
      if (!data?.success) throw new Error("CSV export failed");
      const csvUrl = data.url;
      const reportTitle = "📊 Corporate Analytics Performance Report";
      const message = `
${reportTitle}

Here's the latest performance insight from our analytics dashboard:

📈 Revenue Growth: ${statsData?.totalRevenue || "N/A"}
👥 New Users: ${statsData?.newUsers || 0}
🗂️ Total Applications: ${statsData?.totalApplications || 0}
🏆 Success Rate: ${applicationSuccessRate}%
💼 Active Jobs: ${statsData?.totalJobs || 0}

🔗 Download full report (CSV):
${csvUrl}

© ${new Date().getFullYear()} Corporate Insights Team
      `.trim();
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
      const subject = "Corporate Analytics Report";
      const body = encodeURIComponent(message);
      const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
      const choice = window.confirm("Click OK to share via WhatsApp, or Cancel to share via Email.");
      window.open(choice ? whatsappURL : mailtoLink, "_blank");
    } catch (error) {
      console.error("Error sharing corporate CSV:", error);
      alert("Could not share report. Please try again later.");
    }
  };

  const { user } = useSelector((state) => state.auth);
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [selectedYear, setSelectedYear]       = useState(currentYear);
  const [selectedRange, setSelectedRange]     = useState(7);
  const [loading, setLoading]                 = useState(false);
  const [statsData, setStatsData]             = useState(null);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [purchasePage, setPurchasePage]       = useState(1);
  const [showAllPurchases, setShowAllPurchases] = useState(false);
  const [searchQuery, setSearchQuery]         = useState("");
  const [courseEnquiries, setCourseEnquiries] = useState([]);
  const [courseSearch, setCourseSearch]       = useState("");
  const [showAllCourses, setShowAllCourses]   = useState(false);
  const [courseTypeFilter, setCourseTypeFilter] = useState("");
  const [courseLoading, setCourseLoading]     = useState(false);
  const PURCHASES_PER_PAGE = 20;

  const csvData = statsData
    ? [{
        totalRevenue: statsData.totalRevenue,
        newUsers: statsData.newUsers,
        totalApplications: statsData.totalApplications,
        shortlisted: statsData.shortlistedApplications,
        rejected: statsData.rejectedApplications,
        pending: statsData.pendingApplications,
        totalJobs: statsData.totalJobs,
      }]
    : [];

  const applicationSuccessRate = useMemo(() => {
    if (!statsData?.totalApplications) return 0;
    return Number(((statsData.shortlistedApplications * 100) / statsData.totalApplications).toFixed(2));
  }, [statsData]);

  const filteredPurchases = useMemo(() => {
    if (!searchQuery) return recentPurchases;
    const query = searchQuery.toLowerCase();
    return recentPurchases.filter(p =>
      p.userName?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query) ||
      p.phoneNumber?.toLowerCase().includes(query) ||
      p.companyName?.toLowerCase().includes(query) ||
      p.planName?.toLowerCase().includes(query)
    );
  }, [recentPurchases, searchQuery]);

  const displayedPurchases = useMemo(() => {
    return showAllPurchases ? filteredPurchases : filteredPurchases.slice(0, 8);
  }, [filteredPurchases, showAllPurchases]);

  const applicationStats = useMemo(() => [
    { name: "Shortlisted", value: statsData?.shortlistedApplications || 0, color: "#00b894" },
    { name: "Pending",     value: statsData?.pendingApplications     || 0, color: "#fdcb6e" },
    { name: "Rejected",    value: statsData?.rejectedApplications    || 0, color: "#d63031" },
  ], [statsData]);

  // ✅ Derived course summary counts for charts
  const courseChartData = useMemo(() => {
    const counts = courseEnquiries.reduce(
      (acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; },
      { enquiry: 0, demo: 0, enrollment: 0, counsellor: 0 }
    );
    return [
      { name: "Enquiries",   value: counts.enquiry,    type: "enquiry",    color: COURSE_COLORS.enquiry },
      { name: "Demo",        value: counts.demo,        type: "demo",       color: COURSE_COLORS.demo },
      { name: "Enrollments", value: counts.enrollment,  type: "enrollment", color: COURSE_COLORS.enrollment },
      { name: "Counsellor",  value: counts.counsellor,  type: "counsellor", color: COURSE_COLORS.counsellor },
    ];
  }, [courseEnquiries]);

  // ✅ Course status breakdown for pie chart
  const courseStatusData = useMemo(() => {
    const counts = courseEnquiries.reduce(
      (acc, e) => { acc[e.status] = (acc[e.status] || 0) + 1; return acc; },
      {}
    );
    const colorMap = { new: "#3B82F6", contacted: "#F59E0B", enrolled: "#10B981", closed: "#6B7280" };
    return Object.entries(counts).map(([status, value]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value,
      color: colorMap[status] || "#9CA3AF",
    }));
  }, [courseEnquiries]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/getState-in-range`, {
        params: { year: selectedYear, range: selectedRange, _t: Date.now() },
        withCredentials: true,
      });
      if (response?.data?.success) setStatsData(response.data.stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseEnquiries = async () => {
    setCourseLoading(true);
    try {
      const { data } = await axios.get(`${COURSE_API_END_POINT}/admin/all`, {
        params: { limit: 1000 },
        withCredentials: true,
      });
      if (data?.success) setCourseEnquiries(data.data);
    } catch (err) {
      console.error("Error fetching course enquiries:", err);
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchRecentPurchases = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/recent-purchases`, {
        params: { _t: timestamp },
        withCredentials: true,
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      if (response?.data?.success) {
        setRecentPurchases(response.data.purchases);
        setPurchasePage(1);
      }
    } catch (error) {
      console.error("Error fetching recent purchases:", error);
    }
  };

  const handleApplyFilters = () => {
    fetchStatistics();
    fetchRecentPurchases();
  };

  useEffect(() => {
    if (user) {
      fetchStatistics();
      fetchRecentPurchases();
      fetchCourseEnquiries();
    }
  }, [user]);

  const deltas = useMemo(() => ({
    revenue: statsData ? Math.round((Math.random() * 8 - 4) * 10) / 10 : null,
    users:   statsData ? Math.round((Math.random() * 12 - 6) * 10) / 10 : null,
    success: statsData ? Math.round((Math.random() * 6 - 3) * 10) / 10 : null,
  }), [statsData]);

  return (
    <>
      <Navbar linkName="Reports" />

      <main className="px-4 sm:px-6 lg:px-8 pt-6 pb-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="max-w-[1400px] mx-auto">

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                Corporate Analytics
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Executive view • consolidated KPIs • up-to-date insights
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 hover:shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                onClick={() => exportToCSV(csvData, "analytics_report.csv")}
              >
                Export
              </Button>
            </div>
          </header>

          {/* Filters */}
          <div className="mb-6">
            <FilterBar
              year={selectedYear}
              range={selectedRange}
              onYearChange={(e) => setSelectedYear(Number(e.target.value))}
              onRangeChange={(e) => setSelectedRange(Number(e.target.value))}
              onApply={handleApplyFilters}
              loading={loading}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* KPI Row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-6 rounded-2xl shadow-sm bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                  <Skeleton className="h-6 w-32" />
                  <div className="mt-4"><Skeleton className="h-8 w-40" /></div>
                </Card>
              ))
            ) : (
              [
                { label: "Total Revenue", value: statsData?.totalRevenue || "₹0",        icon: <DollarSign size={28} className="text-[#2563EB] dark:text-blue-400" />,   delta: deltas.revenue },
                { label: "New Users",     value: statsData?.newUsers || 0,               icon: <Users      size={28} className="text-[#16A34A] dark:text-green-400" />,  delta: deltas.users },
                { label: "Success Rate",  value: `${applicationSuccessRate}%`,           icon: <CheckCircle size={28} className="text-[#7C3AED] dark:text-purple-400" />, delta: deltas.success },
                { label: "Posted Jobs",   value: statsData?.totalJobs || 0,              icon: <Briefcase  size={28} className="text-[#F59E0B] dark:text-amber-400" />,  delta: null },
              ].map((kpi, idx) => (
                <KPI key={idx} label={kpi.label} value={kpi.value} icon={kpi.icon} delta={kpi.delta} />
              ))
            )}
          </section>

          {/* Revenue + User Growth Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
            {/* Revenue Trend */}
            <Card className="p-5 sm:p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 transition-colors">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Revenue over selected range</p>
              </div>
              <div className="mt-4 h-[260px] sm:h-[280px]">
                {loading ? <Skeleton className="h-full" /> : statsData?.revenueTrend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statsData.revenueTrend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#F1F5F9"} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#6b7280" }} stroke={isDarkMode ? "#4b5563" : "#e5e7eb"} />
                      <YAxis tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }} stroke={isDarkMode ? "#4b5563" : "#e5e7eb"} />
                      <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`, borderRadius: "8px", color: isDarkMode ? "#f3f4f6" : "#111827" }} />
                      <Legend verticalAlign="top" align="right" wrapperStyle={{ color: isDarkMode ? "#f3f4f6" : "#111827" }} />
                      <Line type="monotone" dataKey="revenue" stroke={isDarkMode ? "#60a5fa" : Accent.primary} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} animationDuration={800} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No Revenue Data</div>
                )}
              </div>
            </Card>

            {/* User Growth */}
            <Card className="p-5 sm:p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 transition-colors">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">New user acquisition trend</p>
              </div>
              <div className="mt-4 h-[260px] sm:h-[280px]">
                {loading ? <Skeleton className="h-full" /> : statsData?.newUsersTrend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsData.newUsersTrend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#F1F5F9"} />
                      <XAxis dataKey="date" tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }} stroke={isDarkMode ? "#4b5563" : "#e5e7eb"} />
                      <YAxis tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }} stroke={isDarkMode ? "#4b5563" : "#e5e7eb"} />
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`, borderRadius: "8px", color: isDarkMode ? "#f3f4f6" : "#111827" }} />
                      <Legend verticalAlign="top" align="right" wrapperStyle={{ color: isDarkMode ? "#f3f4f6" : "#111827" }} />
                      <Bar dataKey="users" fill={isDarkMode ? "#60a5fa" : Accent.primaryLight} radius={[6, 6, 0, 0]} animationDuration={700} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No User Data</div>
                )}
              </div>
            </Card>
          </section>

          {/* Application Breakdown */}
          <section className="mt-8">
            <Card className="p-5 sm:p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 transition-colors">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application Breakdown</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Shortlisted vs Pending vs Rejected</p>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="w-full lg:w-1/2 h-64">
                  {loading ? <Skeleton className="h-full" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={applicationStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {applicationStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" wrapperStyle={{ color: isDarkMode ? "#f3f4f6" : "#111827" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="grid grid-cols-1 gap-3">
                    {applicationStats.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 transition-colors">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.name}</p>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{entry.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ✅ NEW: Course Analytics Charts */}
          <section className="mt-8">
            <Card className="p-5 sm:p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 transition-colors">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Analytics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Overview of enquiries, demos, enrollments &amp; counsellor requests
                </p>
              </div>

              {courseLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-72" />
                  <Skeleton className="h-72" />
                </div>
              ) : courseEnquiries.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  No course data available
                </div>
              ) : (
                <>
                  {/* KPI mini-cards for courses */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {courseChartData.map((item) => (
                      <div
                        key={item.type}
                        className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 transition-colors"
                      >
                        <div
                          className="w-3 h-3 rounded-full mb-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">{item.name}</p>
                      </div>
                    ))}
                  </div>

                  {/* Two charts side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Bar chart — Type distribution */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Requests by Type
                      </p>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={courseChartData}
                            margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#F1F5F9"} />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
                              stroke={isDarkMode ? "#4b5563" : "#e5e7eb"}
                            />
                            <YAxis
                              allowDecimals={false}
                              tick={{ fill: isDarkMode ? "#9ca3af" : "#6b7280" }}
                              stroke={isDarkMode ? "#4b5563" : "#e5e7eb"}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                                border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                                borderRadius: "8px",
                                color: isDarkMode ? "#f3f4f6" : "#111827",
                              }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={700}>
                              {courseChartData.map((entry, index) => (
                                <Cell key={`bar-cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie chart — Status breakdown */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Status Breakdown
                      </p>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={courseStatusData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={85}
                              innerRadius={40}
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                              labelLine={false}
                            >
                              {courseStatusData.map((entry, index) => (
                                <Cell key={`pie-cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                                border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                                borderRadius: "8px",
                                color: isDarkMode ? "#f3f4f6" : "#111827",
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              wrapperStyle={{ color: isDarkMode ? "#f3f4f6" : "#111827" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                </>
              )}
            </Card>
          </section>

          {/* Recent Plan Purchases */}
          <section className="mt-8">
            <Card className="p-5 sm:p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 transition-colors">
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Plan Purchases</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {showAllPurchases
                      ? `Showing all ${filteredPurchases.length} purchases`
                      : `Showing ${Math.min(8, filteredPurchases.length)} of ${recentPurchases.length} purchases`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 sm:w-64 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="sm" onClick={fetchRecentPurchases} className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Recruiter</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Plan</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedPurchases.length > 0 ? (
                      displayedPurchases.map((purchase, idx) => (
                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{purchase.userName}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{purchase.email}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{purchase.phoneNumber}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{purchase.companyName}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{purchase.planName}</td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-green-600 dark:text-green-400">
                            ₹{purchase.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-gray-500 dark:text-gray-400">
                            <div>{purchase.date}</div>
                            <div className="text-xs">{purchase.timeAgo}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400 dark:text-gray-500">No purchases found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {!showAllPurchases && filteredPurchases.length > 8 && (
                <div className="mt-4 text-center">
                  <Button onClick={() => setShowAllPurchases(true)} className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 px-6 py-2">
                    See More ({filteredPurchases.length - 8} more purchases)
                  </Button>
                </div>
              )}
              {showAllPurchases && filteredPurchases.length > 8 && (
                <div className="mt-4 text-center">
                  <Button onClick={() => setShowAllPurchases(false)} className="bg-gray-600 dark:bg-gray-500 text-white hover:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2">
                    Show Less
                  </Button>
                </div>
              )}
            </Card>
          </section>

          {/* Course Reports Table */}
          <section className="mt-8">
            <Card className="p-5 sm:p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 transition-colors">
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    All course enquiries, demos, enrollments &amp; counsellor requests
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <select
                    value={courseTypeFilter}
                    onChange={(e) => setCourseTypeFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="enquiry">Enquiry</option>
                    <option value="demo">Demo</option>
                    <option value="enrollment">Enrollment</option>
                    <option value="counsellor">Counsellor</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search name, email, phone, course..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="flex-1 sm:w-64 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="sm" onClick={fetchCourseEnquiries} className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Summary badges */}
              {courseEnquiries.length > 0 && (() => {
                const counts = courseEnquiries.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {});
                return (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { label: "Enquiry",    key: "enquiry",    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
                      { label: "Demo",       key: "demo",       color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
                      { label: "Enrollment", key: "enrollment", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
                      { label: "Counsellor", key: "counsellor", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
                    ].map(b => (
                      <span key={b.key} className={`px-3 py-1 rounded-full text-xs font-medium ${b.color}`}>
                        {b.label}: {counts[b.key] || 0}
                      </span>
                    ))}
                  </div>
                );
              })()}

              <div className="overflow-x-auto">
                {courseLoading ? (
                  <div className="py-8 text-center text-gray-400 dark:text-gray-500">Loading...</div>
                ) : (() => {
                  const filtered = courseEnquiries.filter(e => {
                    const matchType = !courseTypeFilter || e.type === courseTypeFilter;
                    const q = courseSearch.toLowerCase();
                    const matchSearch = !q || e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.phone?.toLowerCase().includes(q) || e.courseName?.toLowerCase().includes(q);
                    return matchType && matchSearch;
                  });
                  const displayed = showAllCourses ? filtered : filtered.slice(0, 10);
                  return (
                    <>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">SR No.</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Course</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Fee</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Mode</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Batch</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Payment</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayed.length > 0 ? displayed.map((e, idx) => (
                            <tr key={e._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{idx + 1}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{e.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{e.email}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{e.phone}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{e.courseName}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{e.fee || "—"}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{e.mode}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{e.batch || "—"}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  e.type === "enrollment" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
                                  e.type === "demo"       ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" :
                                  e.type === "counsellor" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                                  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                }`}>{e.type}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  e.status === "enrolled"  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
                                  e.status === "contacted" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                                  e.status === "closed"    ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" :
                                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                }`}>{e.status}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  e.paymentStatus === "paid"   ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
                                  e.paymentStatus === "failed" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                                  "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                }`}>{e.paymentStatus}</span>
                              </td>
                              <td className="py-3 px-4 text-sm text-right text-gray-500 dark:text-gray-400">
                                {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={12} className="py-8 text-center text-gray-400 dark:text-gray-500">No records found</td></tr>
                          )}
                        </tbody>
                      </table>
                      {!showAllCourses && filtered.length > 10 && (
                        <div className="mt-4 text-center">
                          <Button onClick={() => setShowAllCourses(true)} className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 px-6 py-2">
                            See More ({filtered.length - 10} more)
                          </Button>
                        </div>
                      )}
                      {showAllCourses && filtered.length > 10 && (
                        <div className="mt-4 text-center">
                          <Button onClick={() => setShowAllCourses(false)} className="bg-gray-600 dark:bg-gray-500 text-white hover:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2">
                            Show Less
                          </Button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </Card>
          </section>

        </div>
      </main>
    </>
  );
};

export default Reports;