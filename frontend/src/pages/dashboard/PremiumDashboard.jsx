import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Helmet } from "react-helmet-async";
import {
  Users, Briefcase, UserCheck, Trophy,
  Database, Activity, TrendingUp, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip,
  FunnelChart, Funnel, LabelList, BarChart, Bar, CartesianGrid,
  XAxis, YAxis, LineChart, Line,
} from "recharts";
import { ANALYTICS_DASHBOARD_API, BACKEND_URL } from "@/utils/ApiEndPoint";
import VerifiedRecruiterBadges from "@/components/VerifiedRecruiterBadges";

const ROLE_COLORS  = ["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#06b6d4"];
const CAT_COLORS   = ["#6366f1", "#f97316", "#ec4899", "#8b5cf6", "#22c55e"];
const HOURS        = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "11 PM"];
const DAYS         = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RecruiterEnterpriseDashboard() {
  const { user }    = useSelector((s) => s.auth);
  const { company } = useSelector((s) => s.company);
  const { jobPlan } = useSelector((s) => s.jobPlan);
  const navigate    = useNavigate();
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await axios.get(ANALYTICS_DASHBOARD_API, { withCredentials: true });
      if (res.data.success) setDashboard(res.data);
    } catch (err) {
      console.error("[EnterpriseDashboard]", err);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  useEffect(() => {
    if (!user?._id || !BACKEND_URL) return;
    const socket = io(BACKEND_URL, { transports: ["websocket", "polling"], withCredentials: true });
    socket.emit("join", user._id);
    const refresh = () => fetchDashboard();
    socket.on("newApplication", refresh);
    socket.on("applicationStatusChanged", refresh);
    socket.on("jobPosted", refresh);
    socket.on("planExpired", refresh);
    return () => {
      socket.off("newApplication", refresh);
      socket.off("applicationStatusChanged", refresh);
      socket.off("jobPosted", refresh);
      socket.off("planExpired", refresh);
      socket.disconnect();
    };
  }, [user?._id, fetchDashboard]);

  const recruiterPlan = jobPlan?.planName || jobPlan?.title || company?.plan || user?.plan;

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f3ff] dark:bg-gray-900">
        <div className="text-violet-700 text-xl font-bold animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  const cards = [
    { title: "Recruiters",       value: dashboard.recruiters,        icon: Users,     color: "from-violet-500 to-purple-500" },
    { title: "Posted Jobs",      value: dashboard.postedJobs,        icon: Briefcase, color: "from-blue-500 to-cyan-500" },
    { title: "Remaining Posts",  value: dashboard.remainingJobPosts, icon: Activity,  color: "from-pink-500 to-rose-500" },
    { title: "Active Jobs",      value: dashboard.activeJobs,        icon: BarChart3, color: "from-indigo-500 to-violet-500" },
    { title: "Applicants",       value: dashboard.applicants,        icon: Users,     color: "from-fuchsia-500 to-purple-500" },
    { title: "Shortlisted",      value: dashboard.shortlisted,       icon: UserCheck, color: "from-cyan-500 to-blue-500" },
    { title: "Success Rate",     value: `${dashboard.successRate}%`, icon: Trophy,    color: "from-orange-400 to-yellow-500" },
    { title: "Database Credits", value: dashboard.databaseCredits,   icon: Database,  color: "from-emerald-500 to-green-500" },
  ];

  const roleData    = (dashboard.applicationsByRole?.length  ? dashboard.applicationsByRole  : [
    { role: "Web Developer",      applications: 68 },
    { role: "UI/UX Designer",     applications: 54 },
    { role: "Data Analyst",       applications: 48 },
    { role: "Backend Developer",  applications: 46 },
    { role: "HR Executive",       applications: 24 },
  ]);
  const catData      = (dashboard.topCategories?.length       ? dashboard.topCategories       : [
    { name: "Development", value: 42 },
    { name: "Design",      value: 18 },
    { name: "Data Science",value: 15 },
    { name: "Marketing",   value: 10 },
    { name: "Others",      value: 15 },
  ]);
  const heatmapData  = (dashboard.heatmap?.length             ? dashboard.heatmap             : [
    { day: "Mon", "12 AM": 1, "4 AM": 0, "8 AM": 3, "12 PM": 8, "4 PM": 12, "8 PM": 6, "11 PM": 2 },
    { day: "Tue", "12 AM": 0, "4 AM": 1, "8 AM": 5, "12 PM": 10, "4 PM": 15, "8 PM": 8, "11 PM": 1 },
    { day: "Wed", "12 AM": 2, "4 AM": 0, "8 AM": 4, "12 PM": 9, "4 PM": 18, "8 PM": 7, "11 PM": 3 },
    { day: "Thu", "12 AM": 0, "4 AM": 2, "8 AM": 6, "12 PM": 11, "4 PM": 20, "8 PM": 9, "11 PM": 2 },
    { day: "Fri", "12 AM": 1, "4 AM": 0, "8 AM": 7, "12 PM": 14, "4 PM": 22, "8 PM": 10, "11 PM": 4 },
    { day: "Sat", "12 AM": 0, "4 AM": 0, "8 AM": 2, "12 PM": 5, "4 PM": 8, "8 PM": 4, "11 PM": 1 },
    { day: "Sun", "12 AM": 0, "4 AM": 0, "8 AM": 1, "12 PM": 3, "4 PM": 6, "8 PM": 3, "11 PM": 0 },
  ]);
  const catTotal = catData.reduce((s, c) => s + c.value, 0);

  return (
    <>
      <Helmet>
        <title>Enterprise Dashboard | GreatHire Analytics</title>
        <meta name="description" content="GreatHire premium enterprise recruitment analytics." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#f6f3ff] via-white to-[#f3e8ff] dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 px-6 py-7 shadow-[0_20px_80px_rgba(124,58,237,0.3)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">
                Welcome, {company?.companyName || "GreatHire"} 👋
              </h1>
              <p className="mt-1 text-violet-100 text-sm">Enterprise Recruitment Intelligence Dashboard</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <VerifiedRecruiterBadges plan={recruiterPlan} status={jobPlan?.status} expiryDate={jobPlan?.expiryDate} />
              <div className="rounded-2xl border border-white/20 bg-white/20 px-5 py-3 backdrop-blur-xl">
                <div className="text-white/70 text-xs">Current Plan</div>
                <div className="mt-1 text-xl font-bold text-white">{dashboard.plan || "Enterprise"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* VERIFICATION BANNER */}
        {!company?.isActive && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 px-4 py-3 rounded-xl">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <span className="font-semibold">Verification Pending:</span> Your account is under admin review.
            </p>
          </div>
        )}

        {/* KPI CARDS */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {cards.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 backdrop-blur-xl px-4 py-4 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.color} opacity-10 blur-2xl`} />
                <div className="relative z-10">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon size={18} />
                  </div>
                  <div className="mt-3">
                    <div className="text-violet-600 dark:text-violet-400 text-xs font-semibold">{item.title}</div>
                    <div className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{item.value}</div>
                  </div>
                  <div className="mt-2 flex items-center text-green-600 text-xs font-semibold">
                    <TrendingUp size={12} className="mr-1" /> Live
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ROW 1: Trend + Funnel + Sources */}
        <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 px-5 py-4 shadow-lg backdrop-blur-xl">
            <h2 className="text-lg font-bold text-violet-700 dark:text-violet-400 mb-4">Applications Trend</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={dashboard.applicationsTrend}>
                <defs>
                  <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stroke="#7c3aed" fill="url(#purpleArea)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 px-5 py-4 shadow-lg backdrop-blur-xl">
            <h2 className="text-lg font-bold text-violet-700 dark:text-violet-400 mb-4">Hiring Funnel</h2>
            <ResponsiveContainer width="100%" height={240}>
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="value" data={dashboard.funnel} isAnimationActive>
                  <LabelList position="right" fill="#7c3aed" stroke="none" fontSize={11} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 px-5 py-4 shadow-lg backdrop-blur-xl">
            <h2 className="text-lg font-bold text-violet-700 dark:text-violet-400 mb-4">Candidate Sources</h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={dashboard.sources} dataKey="value" outerRadius={90} label>
                  {dashboard.sources.map((_, i) => (
                    <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 2: Applications by Job Role */}
        <div className="mt-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-5 pt-4 pb-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Applications by Job Role</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Total applications per job title</p>
            <ResponsiveContainer width="100%" height={Math.max(roleData.length * 38, 120)}>
              <BarChart
                layout="vertical"
                data={roleData}
                margin={{ left: 0, right: 40, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="role"
                  tick={{ fontSize: 11, fill: "var(--recharts-axis-tick, #374151)" }}
                  width={170}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(124,58,237,0.04)" }}
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#1f2937", fontSize: 12 }}
                  formatter={(v) => [`${v} applications`, ""]}
                />
                <Bar dataKey="applications" radius={[0, 5, 5, 0]} barSize={20} label={{ position: "right", fill: "#6b7280", fontSize: 11 }}>
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 3: Top Job Categories + Applications Heatmap */}
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Top Job Categories */}
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-5 pt-4 pb-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Top Job Categories</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Distribution of applications by category</p>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={catData}
                      dataKey="value"
                      innerRadius={38}
                      outerRadius={62}
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {catData.map((_, i) => (
                        <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#1f2937", fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {catData.map((cat, i) => {
                  const pct = catTotal > 0 ? Math.round((cat.value / catTotal) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                      <span className="text-gray-600 dark:text-gray-300 text-sm flex-1">{cat.name}</span>
                      <span className="text-gray-700 dark:text-gray-200 text-sm font-semibold">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Applications Heatmap */}
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-5 pt-4 pb-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Applications Heatmap</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Application activity by day &amp; time</p>
            <HeatmapChart data={heatmapData} />
          </div>
        </div>

        {/* ROW 4: Recruiter Performance + Hiring Growth */}
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 px-5 py-4 shadow-lg backdrop-blur-xl">
            <h2 className="text-lg font-bold text-violet-700 dark:text-violet-400 mb-4">Recruiter Performance</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dashboard.recruitersPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="hires" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 px-5 py-4 shadow-lg backdrop-blur-xl">
            <h2 className="text-lg font-bold text-violet-700 dark:text-violet-400 mb-4">Hiring Growth</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dashboard.monthlyHiring}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="hired" stroke="#7c3aed" strokeWidth={3} dot={{ fill: "#7c3aed", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 5: AI Insights + Activity + Usage */}
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 px-5 py-4 shadow-lg backdrop-blur-xl">
            <h2 className="text-lg font-bold text-violet-700 dark:text-violet-400 mb-4">AI Hiring Insights</h2>
            <div className="space-y-3">
              {dashboard.insights?.map((item, i) => (
                <div key={i} className="rounded-xl border border-violet-100 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/30 dark:to-fuchsia-900/30 px-4 py-3 font-medium text-violet-700 dark:text-violet-300 text-sm">
                  ✨ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 px-5 py-4 shadow-lg backdrop-blur-xl">
            <h2 className="text-lg font-bold text-violet-700 dark:text-violet-400 mb-4">Live Activity Feed</h2>
            <div className="space-y-3">
              {dashboard.activities?.length ? dashboard.activities.map((item, i) => (
                <div key={i} className="rounded-xl border border-violet-100 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 px-4 py-3">
                  <div className="font-semibold text-violet-700 dark:text-violet-300 text-sm">{item.title}</div>
                  <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.time}</div>
                </div>
              )) : <p className="text-gray-400 text-sm">No recent activity.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800 px-5 py-4 shadow-lg backdrop-blur-xl">
            <h2 className="text-lg font-bold text-violet-700 dark:text-violet-400 mb-4">Usage Analytics</h2>
            <Usage label="Database Credits" value={dashboard.databaseCredits} max={100000} />
            <Usage label="Job Posts"        value={dashboard.postedJobs}      max={1000000} />
            <Usage label="Recruiters"       value={dashboard.recruiters}      max={5} />
            <Usage label="Applicants"       value={dashboard.applicants}      max={5000} />
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white px-6 py-6 flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-xl font-bold mb-2">Invite &amp; Earn More!</h2>
              <p className="text-violet-100 text-sm">Refer recruiters and earn credits for every successful referral.</p>
            </div>
            <button onClick={() => navigate("/recruiter/dashboard/invite-and-earn")} className="mt-6 bg-white text-violet-700 hover:bg-violet-50 transition-all rounded-xl py-2.5 font-bold text-sm">
              Invite Now
            </button>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-6 py-6 flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-xl font-bold mb-2">AI Resume Analyzer</h2>
              <p className="text-blue-100 text-sm">Screen candidates faster with AI-powered resume scoring and insights.</p>
            </div>
            <button onClick={() => navigate("/recruiter/dashboard/resume-analyzer")} className="mt-6 bg-white text-blue-600 hover:bg-blue-50 transition-all rounded-xl py-2.5 font-bold text-sm">
              Analyze Resumes
            </button>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white px-6 py-6 flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-xl font-bold mb-2">Find Top Candidates</h2>
              <ul className="space-y-1.5 text-emerald-100 text-sm mt-2">
                <li>✔ Search 10,000+ candidate profiles</li>
                <li>✔ Filter by skills, location &amp; experience</li>
                <li>✔ Direct contact with candidates</li>
                <li>✔ AI-matched recommendations</li>
              </ul>
            </div>
            <button onClick={() => navigate("/recruiter/dashboard/candidate-list")} className="mt-6 bg-white text-emerald-600 hover:bg-emerald-50 transition-all rounded-xl py-2.5 font-bold text-sm">
              Search Candidates
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

/* ── Heatmap ── */
function HeatmapChart({ data }) {
  const max = Math.max(...data.flatMap((row) => HOURS.map((h) => row[h] || 0)), 1);
  const [tooltip, setTooltip] = useState(null);

  const getColor = (val) => {
    if (!val) return "#f1f5f9";
    const t = val / max;
    if (t < 0.25) return "#ddd6fe";
    if (t < 0.5)  return "#8b5cf6";
    if (t < 0.75) return "#c026d3";
    return "#f97316";
  };

  return (
    <div className="relative select-none">
      {data.map((row) => (
        <div key={row.day} className="flex items-center mb-1">
          <span className="w-8 text-[10px] text-gray-500 dark:text-gray-400 flex-shrink-0 font-medium">{row.day}</span>
          {HOURS.map((h) => (
            <div
              key={h}
              className="flex-1 mx-px h-6 rounded-sm cursor-pointer transition-opacity hover:opacity-75"
              style={{ background: getColor(row[h] || 0) }}
              onMouseEnter={(e) => setTooltip({ day: row.day, hour: h, count: row[h] || 0, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>
      ))}

      {/* Hour labels at bottom */}
      <div className="flex mt-1.5 ml-8">
        {HOURS.map((h) => (
          <div key={h} className="flex-1 text-center text-[9px] text-gray-400 dark:text-gray-500">{h}</div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 ml-8">
        <span className="text-[9px] text-gray-400 dark:text-gray-500 mr-1">Low</span>
        {["#f1f5f9", "#ddd6fe", "#8b5cf6", "#c026d3", "#f97316"].map((c) => (
          <div key={c} className="flex-1 h-2 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-[9px] text-gray-400 dark:text-gray-500 ml-1">High</span>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 44 }}
        >
          <div className="font-semibold">{tooltip.day} · {tooltip.hour}</div>
          <div className="text-gray-300 mt-0.5">{tooltip.count} application{tooltip.count !== 1 ? "s" : ""}</div>
        </div>
      )}
    </div>
  );
}

/* ── Usage bar ── */
function Usage({ label, value, max }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex justify-between font-medium text-xs text-gray-700 dark:text-gray-300">
        <span>{label}</span>
        <span>{Number(value).toLocaleString()}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-900/40">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
