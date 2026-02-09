// Reports.jsx — Modern Elite Corporate (Light Mode — Poppins, Royal Blue Accent)
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
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";
import { Dialog } from "@mui/material";


// NOTE: This component injects the Poppins font link to the document head (light-mode corporate).
// If your app already loads fonts globally, you can remove the injection.

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
  primary: "#1E40AF", // Royal Blue (accent)
  primaryLight: "#3B82F6",
  surface: "#FFFFFF",
  muted: "#6B7280",
  glass: "rgba(30,64,175,0.06)",
};

const Skeleton = ({ className = "h-6 w-full bg-gray-200 rounded animate-pulse" }) => (
  <div className={className} aria-hidden />
);

const KPI = ({ label, value, icon, delta }) => (
  <Card className="p-5 rounded-2xl shadow-md border border-gray-100">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <div className="mt-2 flex items-baseline gap-3">
          <h4 className="text-2xl font-semibold text-gray-900">{value}</h4>
          {delta != null && (
            <span
              className={`text-sm font-medium ${delta >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {delta >= 0 ? `+${delta}%` : `${delta}%`}
            </span>
          )}
        </div>
      </div>

      <div
        className="p-3 rounded-full shadow-sm"
        style={{ background: Accent.glass }}
        aria-hidden
      >
        {icon}
      </div>
    </div>
  </Card>
);

const FilterBar = ({ year, range, onYearChange, onRangeChange, onApply, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap gap-4 items-center justify-between">
    <div className="flex gap-3 items-center">
      <FormControl size="small">
        <Select value={year} onChange={onYearChange} size="small" className="min-w-[140px]">
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <Select value={range} onChange={onRangeChange} size="small" className="min-w-[160px]">
          <MenuItem value={7}>Last 7 Days</MenuItem>
          <MenuItem value={30}>Last 30 Days</MenuItem>
          <MenuItem value={1}>Last Month</MenuItem>
          <MenuItem value={3}>Last 3 Months</MenuItem>
          <MenuItem value={6}>Last 6 Months</MenuItem>
          <MenuItem value={12}>Last 12 Months</MenuItem>
        </Select>
      </FormControl>

      <div className="hidden sm:block text-sm text-gray-500">Showing recent data for analysis</div>
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
  // inject Poppins once
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
const handleShare = async () => {
  if (!csvData.length) {
    alert("No data available to share!");
    return;
  }

  try {
    // 1️⃣ Request backend to create a real CSV file
    const { data } = await axios.get(`${ADMIN_STAT_API_END_POINT}/export-corporate-csv`, {
      params: { year: selectedYear, range: selectedRange },
      withCredentials: true,
    });

    if (!data?.success) throw new Error("CSV export failed");
    const csvUrl = data.url;

    // 2️⃣ Craft corporate-style share message
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
  // Get the current year
  const currentYear = new Date().getFullYear();
  // Define available years (current year and previous 5 years)
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Default the selected year to the current year and range to 7 (days)
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedRange, setSelectedRange] = useState(7);
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const csvData = statsData
  ? [
      {
        totalRevenue: statsData.totalRevenue,
        newUsers: statsData.newUsers,
        totalApplications: statsData.totalApplications,
        shortlisted: statsData.shortlistedApplications,
        rejected: statsData.rejectedApplications,
        pending: statsData.pendingApplications,
        totalJobs: statsData.totalJobs
      }
    ]
  : [];


  const applicationSuccessRate = useMemo(() => {
    if (!statsData?.totalApplications) return 0;
    return Number(((statsData.shortlistedApplications * 100) / statsData.totalApplications).toFixed(2));
  }, [statsData]);

  const applicationStats = useMemo(() => [
    { name: "Shortlisted", value: statsData?.shortlistedApplications || 0, color: "#00b894" },
    { name: "Pending", value: statsData?.pendingApplications || 0, color: "#fdcb6e" },
    { name: "Rejected", value: statsData?.rejectedApplications || 0, color: "#d63031" },
  ], [statsData]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/getState-in-range`, {
        params: { year: selectedYear, range: selectedRange },
        withCredentials: true,
      });
      if (response?.data?.success) setStatsData(response.data.stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetch on mount if user exists
    if (user) fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Derived small deltas for KPI flair (demo-friendly)
  const deltas = useMemo(() => ({
    revenue: statsData ? Math.round((Math.random() * 8 - 4) * 10) / 10 : null,
    users: statsData ? Math.round((Math.random() * 12 - 6) * 10) / 10 : null,
    success: statsData ? Math.round((Math.random() * 6 - 3) * 10) / 10 : null,
  }), [statsData]);

  return (
  <>
    <Navbar linkName="Reports" />

    <main className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Corporate Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Executive view • consolidated KPIs • up-to-date insights
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="px-4 py-2 rounded-xl border border-gray-200 text-black bg-white hover:shadow hover:text-white"
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
            onApply={fetchStatistics}
            loading={loading}
          />
        </div>

        {/* KPI Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 rounded-2xl shadow-sm">
                <Skeleton className="h-6 w-32" />
                <div className="mt-4">
                  <Skeleton className="h-8 w-40" />
                </div>
              </Card>
            ))
          ) : (
            [
              {
                label: "Total Revenue",
                value: `₹${statsData?.totalRevenue || 0}`,
                icon: <DollarSign size={28} className="text-[#2563EB]" />,
                delta: deltas.revenue,
              },
              {
                label: "New Users",
                value: statsData?.newUsers || 0,
                icon: <Users size={28} className="text-[#16A34A]" />,
                delta: deltas.users,
              },
              {
                label: "Success Rate",
                value: `${applicationSuccessRate}%`,
                icon: <CheckCircle size={28} className="text-[#7C3AED]" />,
                delta: deltas.success,
              },
              {
                label: "Posted Jobs",
                value: statsData?.totalJobs || 0,
                icon: <Briefcase size={28} className="text-[#F59E0B]" />,
                delta: null,
              },
            ].map((kpi, idx) => (
              <KPI
                key={idx}
                label={kpi.label}
                value={kpi.value}
                icon={kpi.icon}
                delta={kpi.delta}
              />
            ))
          )}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
          {/* Revenue Trend */}
          <Card className="p-5 sm:p-6 rounded-2xl shadow-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Trend
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Revenue over selected range
              </p>
            </div>

            <div className="mt-4 h-[260px] sm:h-[280px]">
              {loading ? (
                <Skeleton className="h-full" />
              ) : statsData?.revenueTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={statsData.revenueTrend}
                    margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(val) => `₹${val}`} />
                    <Legend verticalAlign="top" align="right" />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={Accent.primary}
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No Revenue Data
                </div>
              )}
            </div>
          </Card>

          {/* User Growth */}
          <Card className="p-5 sm:p-6 rounded-2xl shadow-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                User Growth
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                New user acquisition trend
              </p>
            </div>

            <div className="mt-4 h-[260px] sm:h-[280px]">
              {loading ? (
                <Skeleton className="h-full" />
              ) : statsData?.newUsersTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statsData.newUsersTrend}
                    margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" align="right" />
                    <Bar
                      dataKey="users"
                      fill={Accent.primaryLight}
                      radius={[6, 6, 0, 0]}
                      animationDuration={700}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No User Data
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Application Breakdown */}
        <section className="mt-8">
          <Card className="p-5 sm:p-6 rounded-2xl shadow-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Application Breakdown
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Shortlisted vs Pending vs Rejected
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-1/2 h-64">
                {loading ? (
                  <Skeleton className="h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationStats}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {applicationStats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-1 gap-3">
                  {applicationStats.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {entry.name}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  </>
);

};

export default Reports;
