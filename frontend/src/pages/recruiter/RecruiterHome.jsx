import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Helmet } from "react-helmet-async";
import { RECRUITER_DASHBOARD_API, BACKEND_URL } from "@/utils/ApiEndPoint";
import VerifiedRecruiterBadges from "@/components/VerifiedRecruiterBadges";

const ALLOWED_PACKAGES = ["FREE", "STANDARD", "PREMIUM", "PRO", "ENTERPRISE"];

const EMPTY_STATS = {
  recruiters: 0, postedJobs: 0, activeJobs: 0,
  applicants: 0, shortlisted: 0, successRate: 0, credits: 0,
};

export default function RecruiterHome() {
  const { user } = useSelector((s) => s.auth);
  const { company } = useSelector((s) => s.company);
  const { jobPlan } = useSelector((s) => s.jobPlan);
  const navigate = useNavigate();

  const [stats, setStats] = useState(EMPTY_STATS);
  const [funnelData, setFunnelData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await axios.get(RECRUITER_DASHBOARD_API, { withCredentials: true });
      if (data.success) {
        setStats(data.stats);
        setFunnelData(data.funnelData || []);
        setRoleData(data.roleData || []);
        setTrendData(data.trendData || []);
        setRecentJobs(data.recentJobs || []);
        setApplicants(data.applicants || []);
      }
    } catch (err) {
      console.error("[RecruiterHome] fetchDashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Socket.io — refresh on live events
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
  const maxRole  = useMemo(() => Math.max(...roleData.map((r) => r.applications), 1), [roleData]);
  const maxTrend = useMemo(() => Math.max(...trendData.map((t) => t.applications), 1), [trendData]);

  if (!company) return null;

  if (!ALLOWED_PACKAGES.includes(company?.plan)) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-bold text-gray-700">
        Dashboard Access Available Only For Paid Packages
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Recruiter's Dashboard | GreatHire Jobs, Applicants, &amp; Hiring Analytics</title>
        <meta name="description" content="GreatHire recruiter dashboard with live hiring analytics." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-100 text-gray-900">
        <div className="flex-1 p-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                👋 Welcome,{" "}
                <span className="text-violet-600">{company?.companyName || "Recruiter"}</span>
              </h1>
              <p className="text-violet-500 mt-2 text-lg">Here's an overview of your recruitment activity.</p>
            </div>
            <div className="flex items-center gap-4">
              <VerifiedRecruiterBadges plan={recruiterPlan} status={jobPlan?.status} expiryDate={jobPlan?.expiryDate} />
              <div className="bg-white border border-yellow-300 shadow-md px-6 py-3 rounded-2xl text-sm font-semibold text-orange-500">
                {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Verification Banner */}
          {!company?.isActive && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Verification Pending:</span> Your account is under admin review.
              </p>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-5 mb-8">
            {[
              { title: "Recruiters",   value: stats.recruiters,        color: "from-blue-500 to-blue-700" },
              { title: "Posted Jobs",  value: stats.postedJobs,        color: "from-green-500 to-green-700" },
              { title: "Active Jobs",  value: stats.activeJobs,        color: "from-purple-500 to-purple-700" },
              { title: "Applicants",   value: stats.applicants,        color: "from-pink-500 to-pink-700" },
              { title: "Shortlisted",  value: stats.shortlisted,       color: "from-cyan-500 to-cyan-700" },
              { title: "Success Rate", value: `${stats.successRate}%`, color: "from-yellow-500 to-orange-500" },
              { title: "Credits",      value: stats.credits,           color: "from-orange-500 to-yellow-500" },
            ].map((c) => <StatCard key={c.title} {...c} loading={loading} />)}
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Funnel */}
            <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl p-6 border border-violet-200 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Recruitment Funnel</h2>
              <div className="space-y-3">
                {funnelData.length ? funnelData.map((item, i) => (
                  <div key={i} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-lg text-center text-sm font-medium">
                    {item.name} — {item.value}
                  </div>
                )) : <p className="text-gray-400 text-sm">No data yet.</p>}
              </div>
            </div>

            {/* Jobs Overview */}
            <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl p-6 border border-violet-200 shadow-lg flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">Jobs Overview</h2>
              <div className="w-48 h-48 rounded-full border-[16px] border-green-500 flex items-center justify-center text-center">
                <div>
                  <div className="text-5xl font-bold text-gray-900">{stats.postedJobs}</div>
                  <div className="text-gray-500 mt-1 text-sm">Total Jobs</div>
                </div>
              </div>
            </div>

            {/* Invite & Earn */}
            <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg">
              <div>
                <h2 className="text-2xl font-bold mb-3">Invite &amp; Earn More!</h2>
                <p className="text-violet-100">Refer friends and earn credits for every successful referral.</p>
              </div>
              <button
                onClick={() => navigate("/recruiter/dashboard/invite-and-earn")}
                className="mt-8 bg-white text-violet-700 hover:bg-violet-50 transition-all rounded-xl py-3 font-semibold"
              >
                Invite Now
              </button>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Applications by Role */}
            <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl p-6 border border-violet-200 shadow-lg">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">Applications by Job Role</h2>
              <div className="space-y-4">
                {roleData.length ? roleData.map((r, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1 text-sm text-gray-700">
                      <span>{r.role}</span><span>{r.applications}</span>
                    </div>
                    <div className="bg-violet-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-violet-500 h-full transition-all" style={{ width: `${(r.applications / maxRole) * 100}%` }} />
                    </div>
                  </div>
                )) : <p className="text-gray-400 text-sm">No applications yet.</p>}
              </div>
            </div>

            {/* Applications Trend */}
            <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl p-6 border border-violet-200 shadow-lg">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">Applications Trend</h2>
              <div className="space-y-4">
                {trendData.length ? trendData.map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1 text-sm text-gray-700">
                      <span>{t.day}</span><span>{t.applications}</span>
                    </div>
                    <div className="bg-purple-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-purple-500 h-full transition-all" style={{ width: `${(t.applications / maxTrend) * 100}%` }} />
                    </div>
                  </div>
                )) : <p className="text-gray-400 text-sm">No trend data yet.</p>}
              </div>
            </div>

            {/* Top Job Roles */}
            <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl p-6 border border-violet-200 shadow-lg">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">Top Job Roles</h2>
              <div className="space-y-3">
                {roleData.length ? roleData.map((r, i) => {
                  const pct = stats.applicants > 0 ? Math.round((r.applications / stats.applicants) * 100) : 0;
                  return (
                    <div key={i} className="flex justify-between bg-violet-50 border border-violet-100 p-3 rounded-xl text-sm text-gray-700">
                      <span>{r.role}</span><span className="font-semibold text-violet-600">{pct}%</span>
                    </div>
                  );
                }) : <p className="text-gray-400 text-sm">No data yet.</p>}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Recent Jobs */}
            <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl p-6 border border-violet-200 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Job Posts</h2>
              <div className="space-y-3">
                {recentJobs.length ? recentJobs.map((job, i) => (
                  <div key={i} className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                    <div className="font-semibold text-sm text-gray-800">{job.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{job.date}</div>
                    <div className="text-green-600 text-xs mt-1 font-medium">{job.applications} Applications</div>
                  </div>
                )) : <p className="text-gray-400 text-sm">No jobs posted yet.</p>}
              </div>
            </div>

            {/* Recent Applicants */}
            <div className="bg-gradient-to-br from-white to-violet-50 rounded-2xl p-6 border border-violet-200 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Applicants</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-violet-200 text-gray-500">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.length ? applicants.map((a, i) => (
                      <tr key={i} className="border-b border-violet-100">
                        <td className="py-3 text-gray-800">{a.name}</td>
                        <td className="text-gray-600">{a.role}</td>
                        <td>
                          <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-medium">
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} className="py-4 text-gray-400">No applicants yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-br from-violet-500 via-pink-500 to-fuchsia-500 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg">
              <div>
                <h2 className="text-2xl font-bold mb-3">Upgrade To Premium</h2>
                <ul className="space-y-2 text-violet-100 text-sm">
                  <li>✔ Unlimited Job Posts</li>
                  <li>✔ Advanced Analytics</li>
                  <li>✔ AI Candidate Matching</li>
                  <li>✔ Priority Support</li>
                </ul>
              </div>
              <button
                onClick={() => navigate("/recruiter/dashboard/plans")}
                className="mt-8 bg-white text-violet-700 hover:bg-violet-50 transition-all rounded-xl py-3 font-semibold"
              >
                Upgrade Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, color, loading }) {
  return (
    <div className="bg-gradient-to-br from-white to-violet-50 border-t-4 border-violet-400 rounded-2xl shadow-lg p-6 text-center flex flex-col justify-center min-h-[130px]">
      <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-r ${color} opacity-25 mb-3`} />
      <h3 className="text-violet-700 text-sm font-semibold">{title}</h3>
      <div className="text-4xl font-bold mt-2 text-gray-900">
        {loading ? <span className="text-gray-300 animate-pulse">—</span> : value}
      </div>
    </div>
  );
}
