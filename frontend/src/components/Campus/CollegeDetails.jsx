import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { COLLEGE_API_END_POINT } from "@/utils/ApiEndPoint";

// ─── COLLEGE DATA ─────────────────────────────────────────────────────────────

const DEFAULT_COLLEGE = {
  name: "",
  fullName: "",
  type: "",
  established: "",
  naac: "",
  website: "",
  address: "",
  tpo: "",
  tpoEmail: "",
  tpoPhone: "",

};

function currentPlacementSeason() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 6 ? `${y}–${y + 1}` : `${y - 1}–${y}`;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-pink-500 to-pink-700",
  "from-indigo-500 to-indigo-700",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-700",
];

const STATUS_CFG = {
  Placed:      { pill: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700", dot: "bg-green-500", bar: "bg-green-500" },
  Shortlisted: { pill: "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700", dot: "bg-yellow-500", bar: "bg-yellow-500" },
  Applied:     { pill: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700", dot: "bg-blue-500", bar: "bg-blue-500" },
};
const APP_STATUS_CFG = {
  Pending:              "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "Interview Schedule": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  Shortlisted:          "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Rejected:             "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function Avatar({ initials, photoUrl = "", size = "md", idx = 0 }) {
  const g = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const s = { xs: "w-7 h-7 text-[10px]", sm: "w-9 h-9 text-xs", md: "w-12 h-12 text-sm", lg: "w-16 h-16 text-lg", xl: "w-20 h-20 text-2xl" }[size];
  if (photoUrl) return <img src={photoUrl} alt={initials} className={`${s} rounded-2xl object-cover flex-shrink-0 shadow-lg`} />;
  return <div className={`${s} rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg`}>{initials}</div>;
}

function Pill({ text, cls = "" }) {
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>{text}</span>;
}

function StatCard({ label, value, sub, accent = "blue" }) {
  const accents = {
    blue:    "from-blue-50 to-blue-100 border-blue-200 text-blue-700 dark:from-blue-950 dark:to-blue-900 dark:border-blue-700 dark:text-blue-300",
    purple:  "from-purple-50 to-purple-100 border-purple-200 text-purple-700 dark:from-purple-950 dark:to-purple-900 dark:border-purple-700 dark:text-purple-300",
    pink:    "from-pink-50 to-pink-100 border-pink-200 text-pink-700 dark:from-pink-950 dark:to-pink-900 dark:border-pink-700 dark:text-pink-300",
    green:   "from-green-50 to-green-100 border-green-200 text-green-700 dark:from-green-950 dark:to-green-900 dark:border-green-700 dark:text-green-300",
    indigo:  "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700 dark:from-indigo-950 dark:to-indigo-900 dark:border-indigo-700 dark:text-indigo-300",
    cyan:    "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700 dark:from-cyan-950 dark:to-cyan-900 dark:border-cyan-700 dark:text-cyan-300",
    amber:   "from-amber-50 to-amber-100 border-amber-200 text-amber-700 dark:from-amber-950 dark:to-amber-900 dark:border-amber-700 dark:text-amber-300",
  };
  const c = accents[accent] || accents.blue;
  const parts = c.split(" ");
  return (
    <div className={`bg-gradient-to-br ${parts[0]} ${parts[1]} border ${parts[2]} rounded-2xl p-4`}>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-1">{label}</p>
      <p className={`text-3xl font-black ${parts[3]} ${parts[4]} ${parts[5]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const [COLLEGE, setCollege] = useState(DEFAULT_COLLEGE);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedId, setSelectedId] = useState(null);
  const [studentTab, setStudentTab] = useState("profile");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterStream, setFilterStream] = useState("All");
  const [STUDENTS, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load college from sessionStorage, redirect if not logged in
  useEffect(() => {
    const stored = sessionStorage.getItem("college");
    if (!stored) {
      navigate("/college/login", { replace: true });
      return;
    }
    const c = JSON.parse(stored);
    setCollege({
      name: c.collegeName || "",
      fullName: c.fullName || c.collegeName || "",
      type: c.type || "",
      established: c.established || "",
      naac: c.naac || "",
      website: c.website || "",
      address: c.address || "",
      tpo: c.tpo || "",
      tpoEmail: c.tpoEmail || "",
      tpoPhone: c.tpoPhone || "",
    });
  }, [navigate]);

  useEffect(() => {
    if (!COLLEGE.name) return;
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${COLLEGE_API_END_POINT}/students/${encodeURIComponent(COLLEGE.name)}`,
          { withCredentials: true }
        );
        if (res.data.success) setStudents(res.data.students);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [COLLEGE.name]);

  const streams = useMemo(() => ["All", ...new Set(STUDENTS.map(s => s.stream))], [STUDENTS]);
  const stats = useMemo(() => ({
    total: STUDENTS.length,
    placed: STUDENTS.filter(s => s.status === "Placed").length,
    shortlisted: STUDENTS.filter(s => s.applications.some(a => a.status === "Interview Schedule")).length,
    applied: STUDENTS.filter(s => s.status === "Applied").length,
    avgCgpa: STUDENTS.length ? (STUDENTS.reduce((a, s) => a + (s.cgpa || 0), 0) / STUDENTS.length).toFixed(2) : "0.00",
    totalApps: STUDENTS.reduce((a, s) => a + s.applications.length, 0),
    pending: STUDENTS.reduce((a, s) => a + s.applications.filter(ap => ap.status === "Pending").length, 0),
    rejected: STUDENTS.reduce((a, s) => a + s.applications.filter(ap => ap.status === "Rejected").length, 0),
    placementRate: STUDENTS.length ? Math.round(STUDENTS.filter(s => s.status === "Placed").length / STUDENTS.length * 100) : 0,
  }), [STUDENTS]);

  const filtered = useMemo(() => STUDENTS.filter(s => {
    const q = search.toLowerCase();
    return (
      (!q || s.name.toLowerCase().includes(q) || s.stream.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
      (filterStatus === "All" || s.status === filterStatus) &&
      (filterStream === "All" || s.stream === filterStream)
    );
  }), [STUDENTS, search, filterStatus, filterStream]);

  const student = STUDENTS.find(s => s.id === selectedId);
  const studentIdx = STUDENTS.findIndex(s => s.id === selectedId);

  const streamDist = useMemo(() => {
    const map = {};
    STUDENTS.forEach(s => { map[s.stream] = (map[s.stream] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [STUDENTS]);

  const companyDist = useMemo(() => {
    const map = {};
    STUDENTS.forEach(s => s.applications.forEach(a => { if (a.status === "Shortlisted") map[a.company] = (map[a.company] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [STUDENTS]);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading student data…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-white transition-colors duration-300" style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400 dark:bg-blue-600 mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20" />
          <div className="absolute -top-20 right-1/3 w-80 h-80 rounded-full bg-purple-400 dark:bg-purple-600 mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-start gap-6">
            {/* College Logo */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-blue-500/30 flex-shrink-0">
              {COLLEGE.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "C"}
            </div>

            {/* College Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {COLLEGE.type && <Pill text={COLLEGE.type} cls="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700" />}
                {COLLEGE.naac && <Pill text={`NAAC ${COLLEGE.naac}`} cls="bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700" />}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">{COLLEGE.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{COLLEGE.fullName} · Est. {COLLEGE.established}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  {COLLEGE.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
                  {COLLEGE.website}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => { sessionStorage.removeItem("college"); navigate("/college/login"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition flex-shrink-0 self-start"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>

            {/* TPO Block */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex-shrink-0 text-right shadow-md">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5 uppercase tracking-widest">Training & Placement Officer</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{COLLEGE.tpo}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{COLLEGE.tpoEmail}</p>
              <p className="text-xs text-gray-500 mt-0.5">{COLLEGE.tpoPhone}</p>
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-gray-500">Season {currentPlacementSeason()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Registered", val: STUDENTS.length, color: "text-blue-600 dark:text-blue-400" },
            { label: "Placed", val: stats.placed, color: "text-green-600 dark:text-green-400" },
            { label: "Interview", val: stats.shortlisted, color: "text-yellow-600 dark:text-yellow-400" },
            { label: "Applied", val: stats.applied, color: "text-cyan-600 dark:text-cyan-400" },
            { label: "Placement %", val: `${stats.placementRate}%`, color: "text-purple-600 dark:text-purple-400" },
            { label: "Avg CGPA", val: stats.avgCgpa, color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Total Apps", val: stats.totalApps, color: "text-pink-600 dark:text-pink-400" },
            { label: "Pending", val: stats.pending, color: "text-orange-600 dark:text-orange-400" },
            { label: "Rejected", val: stats.rejected, color: "text-red-600 dark:text-red-400" },
          ].map(({ label, val, color }) => (
            <div key={label} className="text-center">
              <p className={`text-xl font-black ${color}`}>{val}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN TABS ── */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {["overview", "students", "applications", "analytics"].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSelectedId(null); }}
              className={`px-5 py-3.5 text-sm font-bold capitalize border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About the Institution</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{COLLEGE.fullName || COLLEGE.name}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
                {[
                  { label: "Established", val: COLLEGE.established },
                  { label: "Type", val: COLLEGE.type },
                  { label: "Registered Students", val: STUDENTS.length },
                ].filter(({ val }) => val).map(({ label, val }) => (
                  <div key={label} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-100 dark:border-blue-900 rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-gray-800 dark:text-gray-100">{val}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Placed" value={stats.placed} sub={`of ${stats.total} registered`} accent="green" />
              <StatCard label="Placement Rate" value={`${stats.placementRate}%`} sub={`${currentPlacementSeason()} season`} accent="blue" />
              <StatCard label="Avg CGPA" value={stats.avgCgpa} sub="Batch average" accent="purple" />
              <StatCard label="Total Applications" value={stats.totalApps} sub="Across all students" accent="cyan" />
            </div>

            {/* Status Breakdown */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Placement Status Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: "Placed (Shortlisted)", count: stats.placed, color: "bg-green-500", pct: stats.total ? stats.placed / stats.total * 100 : 0 },
                  { label: "Interview Scheduled", count: stats.shortlisted, color: "bg-yellow-500", pct: stats.total ? stats.shortlisted / stats.total * 100 : 0 },
                  { label: "Applied / Pending", count: stats.applied, color: "bg-blue-500", pct: stats.total ? stats.applied / stats.total * 100 : 0 },
                  { label: "Rejected", count: stats.rejected, color: "bg-red-500", pct: stats.totalApps ? stats.rejected / stats.totalApps * 100 : 0 },
                ].map(({ label, count, color, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">{label}</span>
                      <span className="text-gray-500">{count} students · {Math.round(pct)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stream Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Stream Distribution</h2>
                <div className="space-y-2.5">
                  {streamDist.map(([stream, count], i) => (
                    <div key={stream} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-5 font-bold">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-700 dark:text-gray-300 font-semibold truncate pr-2">{stream}</span>
                          <span className="text-gray-500 flex-shrink-0">{count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${count / STUDENTS.length * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Recruiters */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Top Recruiters</h2>
                <div className="space-y-3">
                  {companyDist.length === 0 && <p className="text-gray-400 text-sm">No placements recorded yet.</p>}
                  {companyDist.map(([company, count], i) => (
                    <div key={company} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        i === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" :
                        i === 1 ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" :
                        "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>{i + 1}</div>
                      <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{company}</span>
                      <span className="text-sm font-black text-green-600 dark:text-green-400">{count} offer{count > 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TPO Contact */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
              <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">Training & Placement Office</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "TPO Name", val: COLLEGE.tpo, icon: "👤" },
                  { label: "Email", val: COLLEGE.tpoEmail, icon: "✉️" },
                  { label: "Phone", val: COLLEGE.tpoPhone, icon: "📞" },
                ].map(({ label, val, icon }) => (
                  <div key={label} className="bg-white/70 dark:bg-gray-900/50 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                    <p className="text-xs text-gray-500 mb-1">{icon} {label}</p>
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ STUDENTS TAB ══ */}
        {activeTab === "students" && (
          <div className="flex gap-4 h-[calc(100vh-260px)]">

            {/* ── Student List Sidebar ── */}
            <div className="w-72 flex-shrink-0 flex flex-col gap-2 overflow-hidden">
              {/* Search */}
              <div className="relative">
                <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
                <input className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition shadow-sm"
                  placeholder="Search name, roll no…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {/* Filters */}
              <div className="flex gap-1">
                {["All", "Placed", "Applied"].map(val => (
                  <button key={val} onClick={() => setFilterStatus(val)} className={`flex-1 text-xs py-1.5 rounded-lg font-bold transition ${filterStatus === val ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}>{val}</button>
                ))}
              </div>
              <p className="text-xs text-gray-400">{filtered.length} of {STUDENTS.length} students</p>

              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {filtered.map((s, i) => {
                  const sc = STATUS_CFG[s.status] || STATUS_CFG.Applied;
                  const active = selectedId === s.id;
                  return (
                    <button key={s.id} onClick={() => { setSelectedId(s.id); setStudentTab("profile"); }}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${active ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700"}`}>
                      <div className="flex gap-2.5 items-center">
                        <Avatar initials={s.photo} photoUrl={s.profilePhoto} size="sm" idx={i} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{s.name}</span>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ml-1 ${sc.dot}`}></span>
                          </div>
                          <p className="text-[10px] text-gray-400 truncate">{s.rollNo} · {s.stream.split(" ")[0]}</p>
                          <div className="flex gap-1 mt-1 items-center">
                            <Pill text={s.status} cls={`${sc.pill} text-[9px] px-1.5`} />
                            {s.applications.length > 0 && (
                              <span className="text-[9px] font-bold text-gray-400">{s.applications.length} apps</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && <p className="text-center text-gray-400 text-xs py-8">No students found</p>}
              </div>
            </div>

            {/* ── Student Detail ── */}
            <div className="flex-1 overflow-y-auto">
              {student ? (
                <div className="space-y-4">
                  {/* Student Header */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-wrap items-start gap-4">
                      <Avatar initials={student.photo} photoUrl={student.profilePhoto} size="lg" idx={studentIdx} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-xl font-black text-gray-900 dark:text-white">{student.name}</h2>
                          <Pill text={student.status} cls={STATUS_CFG[student.status]?.pill} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{student.stream} · {student.year} Batch · Roll: {student.rollNo}</p>
                        {/* Contact Badges */}
                        <div className="flex flex-wrap gap-2">
                          <a href={`mailto:${student.email}`} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl px-3 py-1.5 text-xs text-blue-700 dark:text-blue-300 font-semibold transition">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            {student.email}
                          </a>
                          <a href={`tel:${student.phone}`} className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl px-3 py-1.5 text-xs text-green-700 dark:text-green-300 font-semibold transition">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            {student.phone}
                          </a>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 text-center">
                        <p className="text-xs text-gray-500">CGPA</p>
                        <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400">{student.cgpa}</p>
                        <p className="text-[10px] text-gray-400">/ 10.0</p>
                      </div>
                    </div>
                  </div>

                  {/* Sub Tabs */}
                  <div className="flex gap-2">
                    {["profile", "applications", "contact"].map(t => (
                      <button key={t} onClick={() => setStudentTab(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition ${studentTab === t ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* PROFILE */}
                  {studentTab === "profile" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-2.5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Personal & Academic</h3>
                        {[
                          ["Full Name", student.name],
                          ["Roll Number", student.rollNo],
                          ["Gender", student.gender],
                          ["Hometown", student.hometown],
                          ["City", student.city],
                          ["State", student.state],
                          ["Stream", student.stream],
                          ["Qualification", student.qualification],
                          ["Batch Year", student.year],
                          ["CGPA", `${student.cgpa} / 10.0`],
                          ["Current Status", student.status],
                        ].filter(([, v]) => v).map(([l, v]) => (
                          <div key={l} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                            <span className="text-xs text-gray-400">{l}</span>
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Skills</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {student.skills.length > 0 ? student.skills.map((sk, i) => (
                              <span key={i} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl">{sk}</span>
                            )) : <p className="text-xs text-gray-400">No skills listed</p>}
                          </div>
                        </div>
                        {student.bio && (
                          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bio</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{student.bio}</p>
                          </div>
                        )}
                        {student.resume && (
                          <a href={student.resume} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            View Resume
                          </a>
                        )}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Application Summary</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-3 text-center">
                              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{student.applications.length}</p>
                              <p className="text-xs text-gray-500">Total Apps</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-xl p-3 text-center">
                              <p className="text-2xl font-black text-green-600 dark:text-green-400">{student.applications.filter(a => a.status === "Shortlisted").length}</p>
                              <p className="text-xs text-gray-500">Offers</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APPLICATIONS */}
                  {studentTab === "applications" && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Applied Companies</h3>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full">{student.applications.length} applied</span>
                      </div>
                      {student.applications.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                          <p className="text-sm font-semibold">No applications yet</p>
                          <p className="text-xs mt-1">This student hasn't applied to any companies</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {student.applications.map((app, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                              {/* Company Initial Avatar */}
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 text-sm flex-shrink-0">
                                {app.company?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              {/* Company + Role */}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{app.company}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate">{app.role}</p>
                                <div className="flex flex-wrap gap-3 mt-1 text-[11px] text-gray-400">
                                  {app.location && app.location !== "N/A" && <span>📍 {app.location}</span>}
                                  {app.date && <span>📅 {app.date}</span>}
                                  {app.package && app.package !== "N/A" && <span className="text-green-600 dark:text-green-400 font-semibold">💰 {app.package}</span>}
                                </div>
                              </div>
                              {/* Status Badge */}
                              <Pill
                                text={app.status}
                                cls={APP_STATUS_CFG[app.status] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CONTACT */}
                  {studentTab === "contact" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Student Direct Contact</h3>
                          <div className="space-y-3">
                            <a href={`mailto:${student.email}`} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
                                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{student.email}</p>
                              </div>
                            </a>
                            <a href={`tel:${student.phone}`} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition">
                              <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</p>
                                <p className="text-sm font-bold text-green-700 dark:text-green-300">{student.phone}</p>
                              </div>
                            </a>

                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">College TPO Contact</h3>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-black text-white mb-3 shadow-lg">{COLLEGE.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "C"}</div>
                          {[
                            ["TPO Name", COLLEGE.tpo],
                            ["Email", COLLEGE.tpoEmail],
                            ["Phone", COLLEGE.tpoPhone],
                            ["College", COLLEGE.name],
                          ].map(([l, v]) => (
                            <div key={l} className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-2 last:border-0">
                              <span className="text-xs text-gray-400">{l}</span>
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Applications Table with Contact */}
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Applications with Contact Details</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 uppercase tracking-wider">
                                {["Company", "Role", "Location", "Package", "Channel", "Status", "Email", "Phone"].map(h => (
                                  <th key={h} className="text-left pb-3 pr-4 font-semibold">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                              {student.applications.map((app, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                  <td className="py-3 pr-4 font-black text-gray-900 dark:text-white">{app.company}</td>
                                  <td className="py-3 pr-4 text-blue-600 dark:text-blue-400 font-semibold">{app.role}</td>
                                  <td className="py-3 pr-4 text-gray-500">{app.location}</td>
                                  <td className="py-3 pr-4 text-green-600 dark:text-green-400 font-bold">{app.package}</td>
                                  <td className="py-3 pr-4 text-gray-500">{app.channel}</td>
                                  <td className="py-3 pr-4"><Pill text={app.status} cls={APP_STATUS_CFG[app.status] || ""} /></td>
                                  <td className="py-3 pr-4 text-blue-600 dark:text-blue-400">{student.email}</td>
                                  <td className="py-3 text-green-600 dark:text-green-400">{student.phone}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-400 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <h3 className="text-lg font-black text-gray-400 mb-1">Select a Student</h3>
                  <p className="text-gray-400 text-sm max-w-xs">Click any student from the list to view their profile, applications, and contact details.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ APPLICATIONS TAB ══ */}
        {activeTab === "applications" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">All Applications — {COLLEGE.name}</h2>
              <span className="text-sm text-gray-500">{STUDENTS.reduce((a, s) => a + s.applications.length, 0)} total</span>
            </div>
            {STUDENTS.reduce((a, s) => a + s.applications.length, 0) === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-14 h-14 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <p className="text-base font-semibold">No applications found</p>
                <p className="text-sm mt-1">Students from {COLLEGE.name} haven't applied to any jobs yet</p>
              </div>
            ) : (
              STUDENTS.map((s, si) =>
                s.applications.map((app, ai) => (
                  <div key={`${si}-${ai}`} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition shadow-sm">
                    <div className="flex flex-wrap items-start gap-4">
                      <Avatar initials={s.photo} photoUrl={s.profilePhoto} size="sm" idx={si} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-black text-gray-900 dark:text-white">{s.name}</span>
                          {s.rollNo && s.rollNo !== "N/A" && <><span className="text-gray-300 dark:text-gray-600 text-xs">·</span><span className="text-xs text-gray-500">{s.rollNo}</span></>}
                          {s.stream && <><span className="text-gray-300 dark:text-gray-600 text-xs">·</span><span className="text-xs text-gray-500">{s.stream.split(" ")[0]}</span></>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{app.company}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{app.role}</span>
                          <Pill text={app.status} cls={APP_STATUS_CFG[app.status] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"} />
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {app.location && app.location !== "N/A" && <span>📍 {app.location}</span>}
                          {app.date && <span>📅 {app.date}</span>}
                          {app.package && app.package !== "N/A" && <span className="text-green-600 dark:text-green-400 font-semibold">💰 {app.package}</span>}
                          {s.email && <span className="text-blue-600 dark:text-blue-400">✉️ {s.email}</span>}
                          {s.phone && <span className="text-green-600 dark:text-green-400">📞 {s.phone}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}

        {/* ══ ANALYTICS TAB ══ */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Placement Rate" value={`${stats.placementRate}%`} sub={`Batch ${currentPlacementSeason()}`} accent="blue" />
              <StatCard label="Avg CGPA" value={stats.avgCgpa} sub="All registered" accent="amber" />
              <StatCard label="Total Offers" value={STUDENTS.flatMap(s => s.applications).filter(a => a.status === "Shortlisted").length} sub="Across all students" accent="green" />
              <StatCard label="Companies" value={new Set(STUDENTS.flatMap(s => s.applications).map(a => a.company)).size} sub="Unique recruiters" accent="purple" />
            </div>

            {/* CGPA Distribution */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">CGPA vs Placement Status</h2>
              <div className="space-y-3">
                {STUDENTS.sort((a, b) => b.cgpa - a.cgpa).map((s, i) => {
                  const sc = STATUS_CFG[s.status] || STATUS_CFG.Applied;
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-4 font-bold">{i + 1}</span>
                      <Avatar initials={s.photo} photoUrl={s.profilePhoto} size="xs" idx={i} />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-28 truncate">{s.name}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${sc.bar} rounded-full`} style={{ width: `${s.cgpa * 10}%` }} />
                      </div>
                      <span className={`text-xs font-black w-8 text-right ${s.cgpa >= 9 ? "text-green-600 dark:text-green-400" : s.cgpa >= 8 ? "text-yellow-600 dark:text-yellow-400" : "text-gray-400"}`}>{s.cgpa}</span>
                      <Pill text={s.status} cls={`${sc.pill} text-[9px]`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Channel Breakdown */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Application Channels</h2>
              <div className="space-y-3">
                {(() => {
                  const map = {};
                  STUDENTS.forEach(s => s.applications.forEach(a => { map[a.channel] = (map[a.channel] || 0) + 1; }));
                  const total = STUDENTS.reduce((a, s) => a + s.applications.length, 0);
                  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([channel, count]) => (
                    <div key={channel}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">{channel}</span>
                        <span className="text-gray-500">{count} apps · {Math.round(count / total * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${count / total * 100}%` }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark ::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}