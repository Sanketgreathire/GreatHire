import { useState, useMemo } from "react";

// ─── COLLEGE DATA ─────────────────────────────────────────────────────────────
const COLLEGE = {
  name: "IIT Bombay",
  fullName: "Indian Institute of Technology Bombay",
  type: "IIT",
  city: "Mumbai",
  state: "Maharashtra",
  established: 1958,
  naac: "A++",
  nirf: 3,
  website: "www.iitb.ac.in",
  address: "Powai, Mumbai – 400076, Maharashtra",
  tpo: "Dr. Sanjay Mehta",
  tpoEmail: "tpo@iitb.ac.in",
  tpoPhone: "+91 22 2576 7010",
  totalEnrolled: 1240,
  departments: 16,
  placementSeason: "2024–25",
  description:
    "IIT Bombay is one of India's premier engineering institutions, consistently ranked among the top 3 in the country. Known for its exceptional research output and industry-ready graduates.",
};

// ─── STUDENTS DATA ────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: 1,
    name: "Aarav Sharma",
    photo: "AS",
    email: "aarav.sharma@iitb.ac.in",
    phone: "+91 98765 43210",
    stream: "Computer Science & Engineering",
    year: "2024",
    cgpa: 9.2,
    rollNo: "20CS001",
    gender: "Male",
    hometown: "Jaipur, Rajasthan",
    skills: ["React", "Node.js", "Python", "ML", "AWS", "System Design"],
    status: "Placed",
    type: "Job",
    achievements: ["ACM ICPC Finalist", "SIH Winner 2023"],
    linkedin: "linkedin.com/in/aarav-sharma",
    applications: [
      {
        id: "A1", company: "Google", role: "Software Engineer L3", location: "Bangalore",
        package: "45 LPA", channel: "Campus Drive", status: "Selected", date: "2024-02-15",
        round: "Completed", jd: "Backend infra and distributed systems",
      },
      {
        id: "A2", company: "Microsoft", role: "SDE-2", location: "Hyderabad",
        package: "38 LPA", channel: "Campus Drive", status: "Offered", date: "2024-01-20",
        round: "Completed", jd: "Azure cloud services team",
      },
    ],
  },
  {
    id: 2,
    name: "Meera Joshi",
    photo: "MJ",
    email: "meera.joshi@iitb.ac.in",
    phone: "+91 87654 32100",
    stream: "Electrical Engineering",
    year: "2024",
    cgpa: 8.8,
    rollNo: "20EE012",
    gender: "Female",
    hometown: "Pune, Maharashtra",
    skills: ["MATLAB", "Python", "Power Systems", "SCADA", "PLC"],
    status: "Shortlisted",
    type: "Job",
    achievements: ["IEEE Paper Published", "Best Project Award EE"],
    linkedin: "linkedin.com/in/meera-joshi",
    applications: [
      {
        id: "A3", company: "Siemens", role: "Electrical Engineer", location: "Pune",
        package: "22 LPA", channel: "Campus Drive", status: "Shortlisted", date: "2024-03-01",
        round: "Round 3", jd: "Smart grid and automation systems",
      },
      {
        id: "A4", company: "ABB India", role: "Power Systems Analyst", location: "Bangalore",
        package: "18 LPA", channel: "Alumni Referral", status: "Under Review", date: "2024-02-10",
        round: "Round 2", jd: "Power distribution projects",
      },
    ],
  },
  {
    id: 3,
    name: "Arjun Kulkarni",
    photo: "AK",
    email: "arjun.k@iitb.ac.in",
    phone: "+91 76543 21001",
    stream: "Mechanical Engineering",
    year: "2025",
    cgpa: 8.3,
    rollNo: "21ME034",
    gender: "Male",
    hometown: "Nashik, Maharashtra",
    skills: ["AutoCAD", "ANSYS", "SolidWorks", "Python", "FEA"],
    status: "Applied",
    type: "Internship",
    achievements: ["SAE Baja Top 10", "Dean's List 2023"],
    linkedin: "linkedin.com/in/arjun-kulkarni",
    applications: [
      {
        id: "A5", company: "Bosch", role: "Mechanical Intern", location: "Bangalore",
        package: "40K/month", channel: "Job Portal", status: "Applied", date: "2024-03-10",
        round: "Pending", jd: "Product development and R&D",
      },
      {
        id: "A6", company: "Mahindra", role: "Design Engineering Intern", location: "Pune",
        package: "35K/month", channel: "Campus Drive", status: "Applied", date: "2024-03-08",
        round: "Pending", jd: "EV platform design team",
      },
    ],
  },
  {
    id: 4,
    name: "Priya Desai",
    photo: "PD",
    email: "priya.desai@iitb.ac.in",
    phone: "+91 95678 12340",
    stream: "Computer Science & Engineering",
    year: "2024",
    cgpa: 9.6,
    rollNo: "20CS007",
    gender: "Female",
    hometown: "Ahmedabad, Gujarat",
    skills: ["Deep Learning", "PyTorch", "C++", "CUDA", "Research"],
    status: "Placed",
    type: "Job",
    achievements: ["ICLR Paper 2023", "Google Anita Borg Scholar"],
    linkedin: "linkedin.com/in/priya-desai",
    applications: [
      {
        id: "A7", company: "DeepMind", role: "Research Engineer", location: "London (Remote)",
        package: "1.2 Cr", channel: "Online Test", status: "Selected", date: "2024-01-10",
        round: "Completed", jd: "RL and foundational model research",
      },
    ],
  },
  {
    id: 5,
    name: "Rohit Nair",
    photo: "RN",
    email: "rohit.nair@iitb.ac.in",
    phone: "+91 91234 56789",
    stream: "Chemical Engineering",
    year: "2024",
    cgpa: 7.9,
    rollNo: "20CH021",
    gender: "Male",
    hometown: "Thrissur, Kerala",
    skills: ["ASPEN Plus", "MATLAB", "Process Sim", "Python", "Six Sigma"],
    status: "Shortlisted",
    type: "Both",
    achievements: ["CHEMCON 2023 Presenter", "Best Lab Award"],
    linkedin: "linkedin.com/in/rohit-nair",
    applications: [
      {
        id: "A8", company: "Reliance Industries", role: "Process Engineer", location: "Mumbai",
        package: "18 LPA", channel: "Campus Drive", status: "Shortlisted", date: "2024-02-28",
        round: "Round 3", jd: "Refinery process optimization",
      },
      {
        id: "A9", company: "BASF", role: "R&D Intern", location: "Navi Mumbai",
        package: "45K/month", channel: "Alumni Referral", status: "Completed", date: "2023-06-01",
        round: "Completed", jd: "Chemical process intern",
      },
    ],
  },
  {
    id: 6,
    name: "Aisha Khan",
    photo: "AK",
    email: "aisha.khan@iitb.ac.in",
    phone: "+91 88901 23456",
    stream: "Civil Engineering",
    year: "2024",
    cgpa: 8.5,
    rollNo: "20CE009",
    gender: "Female",
    hometown: "Lucknow, UP",
    skills: ["AutoCAD", "Revit", "STAAD Pro", "MS Project", "GIS"],
    status: "Placed",
    type: "Job",
    achievements: ["Best Thesis 2024", "Smart Cities Hackathon Winner"],
    linkedin: "linkedin.com/in/aisha-khan",
    applications: [
      {
        id: "A10", company: "L&T Construction", role: "Project Engineer", location: "Delhi",
        package: "14 LPA", channel: "Campus Drive", status: "Selected", date: "2024-02-05",
        round: "Completed", jd: "Infrastructure and smart city projects",
      },
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "from-orange-400 to-rose-500",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-500",
  "from-fuchsia-400 to-pink-600",
];

const STATUS_CFG = {
  Placed:      { pill: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30", dot: "bg-emerald-400", bar: "bg-emerald-500" },
  Shortlisted: { pill: "bg-amber-500/20 text-amber-300 border border-amber-500/30",       dot: "bg-amber-400",   bar: "bg-amber-500"   },
  Applied:     { pill: "bg-sky-500/20 text-sky-300 border border-sky-500/30",             dot: "bg-sky-400",     bar: "bg-sky-500"     },
};
const APP_STATUS_CFG = {
  Selected:      "bg-emerald-500/20 text-emerald-300",
  Offered:       "bg-teal-500/20 text-teal-300",
  Shortlisted:   "bg-amber-500/20 text-amber-300",
  "Under Review":"bg-violet-500/20 text-violet-300",
  Applied:       "bg-sky-500/20 text-sky-300",
  Completed:     "bg-slate-600/40 text-slate-400",
  Pending:       "bg-slate-600/40 text-slate-400",
};
const TYPE_CFG = {
  Job:        "bg-blue-500/20 text-blue-300",
  Internship: "bg-fuchsia-500/20 text-fuchsia-300",
  Both:       "bg-purple-500/20 text-purple-300",
};

function Avatar({ initials, size = "md", idx = 0 }) {
  const g = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const s = { xs: "w-7 h-7 text-[10px]", sm: "w-9 h-9 text-xs", md: "w-12 h-12 text-sm", lg: "w-16 h-16 text-lg", xl: "w-20 h-20 text-2xl" }[size];
  return <div className={`${s} rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center font-black text-white flex-shrink-0 shadow-lg`}>{initials}</div>;
}

function Pill({ text, cls = "" }) {
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>{text}</span>;
}

function StatCard({ label, value, sub, accent = "blue" }) {
  const accents = {
    blue:   "from-blue-500/20 to-sky-500/5 border-blue-500/25 text-blue-300",
    orange: "from-orange-500/20 to-amber-500/5 border-orange-500/25 text-orange-300",
    emerald:"from-emerald-500/20 to-teal-500/5 border-emerald-500/25 text-emerald-300",
    amber:  "from-amber-500/20 to-yellow-500/5 border-amber-500/25 text-amber-300",
    violet: "from-violet-500/20 to-purple-500/5 border-violet-500/25 text-violet-300",
    rose:   "from-rose-500/20 to-pink-500/5 border-rose-500/25 text-rose-300",
    sky:    "from-sky-500/20 to-cyan-500/5 border-sky-500/25 text-sky-300",
  };
  const c = accents[accent] || accents.blue;
  const [, , , textCol] = c.split(" ");
  return (
    <div className={`bg-gradient-to-br ${c.split(" ").slice(0,2).join(" ")} border ${c.split(" ")[2]} rounded-2xl p-4`}>
      <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">{label}</p>
      <p className={`text-3xl font-black ${c.split(" ")[3]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedId, setSelectedId] = useState(null);
  const [studentTab, setStudentTab] = useState("profile");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterStream, setFilterStream] = useState("All");

  const streams = useMemo(() => ["All", ...new Set(STUDENTS.map(s => s.stream))], []);
  const stats = useMemo(() => ({
    total: STUDENTS.length,
    placed: STUDENTS.filter(s => s.status === "Placed").length,
    shortlisted: STUDENTS.filter(s => s.status === "Shortlisted").length,
    applied: STUDENTS.filter(s => s.status === "Applied").length,
    avgCgpa: (STUDENTS.reduce((a, s) => a + s.cgpa, 0) / STUDENTS.length).toFixed(2),
    totalApps: STUDENTS.reduce((a, s) => a + s.applications.length, 0),
    internships: STUDENTS.filter(s => s.type === "Internship" || s.type === "Both").length,
    placementRate: Math.round(STUDENTS.filter(s => s.status === "Placed").length / STUDENTS.length * 100),
  }), []);

  const filtered = useMemo(() => STUDENTS.filter(s => {
    const q = search.toLowerCase();
    return (
      (!q || s.name.toLowerCase().includes(q) || s.stream.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
      (filterStatus === "All" || s.status === filterStatus) &&
      (filterType === "All" || s.type === filterType) &&
      (filterStream === "All" || s.stream === filterStream)
    );
  }), [search, filterStatus, filterType, filterStream]);

  const student = STUDENTS.find(s => s.id === selectedId);
  const studentIdx = STUDENTS.findIndex(s => s.id === selectedId);

  // Stream distribution
  const streamDist = useMemo(() => {
    const map = {};
    STUDENTS.forEach(s => { map[s.stream] = (map[s.stream] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, []);

  const companyDist = useMemo(() => {
    const map = {};
    STUDENTS.forEach(s => s.applications.forEach(a => { if (a.status === "Selected" || a.status === "Offered") map[a.company] = (map[a.company] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="min-h-screen bg-[#060a10] text-slate-100" style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden border-b border-white/6">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-500/8 blur-3xl" />
          <div className="absolute -top-20 right-1/3 w-80 h-80 rounded-full bg-amber-500/6 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-start gap-6">
            {/* College Logo */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-orange-500/30 flex-shrink-0">
              IB
            </div>

            {/* College Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Pill text="IIT" cls="bg-orange-500/20 text-orange-300 border border-orange-500/30" />
                <Pill text={`NAAC ${COLLEGE.naac}`} cls="bg-white/8 text-slate-400 border border-white/10" />
                <Pill text={`#${COLLEGE.nirf} NIRF`} cls="bg-white/8 text-slate-400 border border-white/10" />
                <Pill text="Autonomous" cls="bg-white/8 text-slate-400 border border-white/10" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-1">{COLLEGE.name}</h1>
              <p className="text-slate-500 text-sm mb-3">{COLLEGE.fullName} · Est. {COLLEGE.established}</p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  {COLLEGE.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
                  {COLLEGE.website}
                </span>
              </div>
            </div>

            {/* TPO Block */}
            <div className="bg-white/4 border border-white/8 rounded-2xl p-4 flex-shrink-0 text-right">
              <p className="text-xs text-slate-600 mb-0.5 uppercase tracking-widest">Training & Placement Officer</p>
              <p className="text-sm font-bold text-white">{COLLEGE.tpo}</p>
              <p className="text-xs text-orange-300 mt-1">{COLLEGE.tpoEmail}</p>
              <p className="text-xs text-slate-500 mt-0.5">{COLLEGE.tpoPhone}</p>
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-slate-600">Season {COLLEGE.placementSeason}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="border-b border-white/6 bg-[#080c14]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Registered", val: STUDENTS.length, accent: "blue" },
            { label: "Placed", val: stats.placed, accent: "emerald" },
            { label: "Shortlisted", val: stats.shortlisted, accent: "amber" },
            { label: "Applied", val: stats.applied, accent: "sky" },
            { label: "Placement %", val: `${stats.placementRate}%`, accent: "orange" },
            { label: "Avg CGPA", val: stats.avgCgpa, accent: "violet" },
            { label: "Total Apps", val: stats.totalApps, accent: "rose" },
            { label: "Internships", val: stats.internships, accent: "violet" },
          ].map(({ label, val, accent }) => (
            <div key={label} className="text-center">
              <p className={`text-xl font-black ${
                accent === "emerald" ? "text-emerald-300" :
                accent === "amber" ? "text-amber-300" :
                accent === "sky" ? "text-sky-300" :
                accent === "orange" ? "text-orange-300" :
                accent === "violet" ? "text-violet-300" :
                accent === "rose" ? "text-rose-300" : "text-blue-300"
              }`}>{val}</p>
              <p className="text-xs text-slate-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN TABS ── */}
      <div className="border-b border-white/6 bg-[#070b12]/80 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {["overview", "students", "applications", "analytics"].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSelectedId(null); }}
              className={`px-5 py-3.5 text-sm font-bold capitalize border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "border-orange-400 text-orange-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
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
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">About the Institution</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{COLLEGE.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                {[
                  { label: "Established", val: COLLEGE.established },
                  { label: "Departments", val: COLLEGE.departments },
                  { label: "Total Students", val: COLLEGE.totalEnrolled.toLocaleString() },
                  { label: "Type", val: COLLEGE.type },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-black/20 rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-slate-200">{val}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Placed" value={stats.placed} sub={`of ${stats.total} registered`} accent="emerald" />
              <StatCard label="Placement Rate" value={`${stats.placementRate}%`} sub="2024–25 season" accent="orange" />
              <StatCard label="Avg CGPA" value={stats.avgCgpa} sub="Batch average" accent="violet" />
              <StatCard label="Total Applications" value={stats.totalApps} sub="Across all students" accent="sky" />
            </div>

            {/* Status Breakdown */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Placement Status Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: "Placed", count: stats.placed, color: "bg-emerald-500", pct: stats.placed / stats.total * 100 },
                  { label: "Shortlisted", count: stats.shortlisted, color: "bg-amber-500", pct: stats.shortlisted / stats.total * 100 },
                  { label: "Applied / Active", count: stats.applied, color: "bg-sky-500", pct: stats.applied / stats.total * 100 },
                ].map(({ label, count, color, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-semibold">{label}</span>
                      <span className="text-slate-500">{count} students · {Math.round(pct)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stream Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Stream Distribution</h2>
                <div className="space-y-2.5">
                  {streamDist.map(([stream, count], i) => (
                    <div key={stream} className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 w-5 font-bold">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300 font-semibold truncate pr-2">{stream}</span>
                          <span className="text-slate-500 flex-shrink-0">{count}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: `${count / STUDENTS.length * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Recruiters */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Top Recruiters</h2>
                <div className="space-y-3">
                  {companyDist.length === 0 && <p className="text-slate-600 text-sm">No placements recorded yet.</p>}
                  {companyDist.map(([company, count], i) => (
                    <div key={company} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        i === 0 ? "bg-amber-500/20 text-amber-300" :
                        i === 1 ? "bg-slate-500/20 text-slate-300" :
                        "bg-orange-900/30 text-orange-400"
                      }`}>{i + 1}</div>
                      <span className="flex-1 text-sm font-semibold text-slate-300">{company}</span>
                      <span className="text-sm font-black text-emerald-300">{count} offer{count > 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TPO Contact */}
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl p-6">
              <h2 className="text-xs font-bold text-orange-500/60 uppercase tracking-widest mb-4">Training & Placement Office</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "TPO Name", val: COLLEGE.tpo, icon: "👤" },
                  { label: "Email", val: COLLEGE.tpoEmail, icon: "✉️" },
                  { label: "Phone", val: COLLEGE.tpoPhone, icon: "📞" },
                ].map(({ label, val, icon }) => (
                  <div key={label} className="bg-black/20 rounded-xl p-4">
                    <p className="text-xs text-slate-600 mb-1">{icon} {label}</p>
                    <p className="text-sm font-bold text-orange-200">{val}</p>
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
                <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
                <input className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition"
                  placeholder="Search name, roll no…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {/* Filters */}
              <div className="flex gap-1">
                {["All", "Placed", "Short.", "Applied"].map((s, i) => {
                  const val = ["All", "Placed", "Shortlisted", "Applied"][i];
                  return <button key={s} onClick={() => setFilterStatus(val)} className={`flex-1 text-xs py-1.5 rounded-lg font-bold transition ${filterStatus === val ? "bg-orange-600 text-white" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}>{s}</button>;
                })}
              </div>
              <div className="flex gap-1">
                {["All", "Job", "Intern", "Both"].map((t, i) => {
                  const val = ["All", "Job", "Internship", "Both"][i];
                  return <button key={t} onClick={() => setFilterType(val)} className={`flex-1 text-xs py-1.5 rounded-lg font-bold transition ${filterType === val ? "bg-amber-600 text-white" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}>{t}</button>;
                })}
              </div>
              <p className="text-xs text-slate-600">{filtered.length} of {STUDENTS.length} students</p>

              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {filtered.map((s, i) => {
                  const sc = STATUS_CFG[s.status] || STATUS_CFG.Applied;
                  const active = selectedId === s.id;
                  return (
                    <button key={s.id} onClick={() => { setSelectedId(s.id); setStudentTab("profile"); }}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${active ? "bg-orange-500/10 border-orange-500/30" : "bg-white/[0.02] border-white/6 hover:bg-white/5 hover:border-white/12"}`}>
                      <div className="flex gap-2.5 items-center">
                        <Avatar initials={s.photo} size="sm" idx={i} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-100 truncate">{s.name}</span>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ml-1 ${sc.dot}`}></span>
                          </div>
                          <p className="text-[10px] text-slate-600 truncate">{s.rollNo} · {s.stream.split(" ")[0]}</p>
                          <div className="flex gap-1 mt-1">
                            <Pill text={s.status} cls={`${sc.pill} text-[9px] px-1.5`} />
                            <Pill text={s.type} cls={`${TYPE_CFG[s.type]} text-[9px] px-1.5`} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && <p className="text-center text-slate-600 text-xs py-8">No students found</p>}
              </div>
            </div>

            {/* ── Student Detail ── */}
            <div className="flex-1 overflow-y-auto">
              {student ? (
                <div className="space-y-4">
                  {/* Student Header */}
                  <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                    <div className="flex flex-wrap items-start gap-4">
                      <Avatar initials={student.photo} size="lg" idx={studentIdx} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-xl font-black text-white">{student.name}</h2>
                          <Pill text={student.status} cls={STATUS_CFG[student.status]?.pill} />
                          <Pill text={student.type} cls={TYPE_CFG[student.type]} />
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{student.stream} · {student.year} Batch · Roll: {student.rollNo}</p>
                        {/* Contact Badges */}
                        <div className="flex flex-wrap gap-2">
                          <a href={`mailto:${student.email}`} className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 rounded-xl px-3 py-1.5 text-xs text-orange-300 font-semibold transition">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            {student.email}
                          </a>
                          <a href={`tel:${student.phone}`} className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-semibold transition">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            {student.phone}
                          </a>
                        </div>
                      </div>
                      <div className="bg-black/30 border border-white/8 rounded-2xl p-4 text-center">
                        <p className="text-xs text-slate-600">CGPA</p>
                        <p className="text-3xl font-black text-amber-300">{student.cgpa}</p>
                        <p className="text-[10px] text-slate-600">/ 10.0</p>
                      </div>
                    </div>
                  </div>

                  {/* Sub Tabs */}
                  <div className="flex gap-2">
                    {["profile", "applications", "contact"].map(t => (
                      <button key={t} onClick={() => setStudentTab(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition ${studentTab === t ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* PROFILE */}
                  {studentTab === "profile" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-2.5">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Personal & Academic</h3>
                        {[
                          ["Full Name", student.name],
                          ["Roll Number", student.rollNo],
                          ["Gender", student.gender],
                          ["Hometown", student.hometown],
                          ["Stream", student.stream],
                          ["Batch Year", student.year],
                          ["CGPA", `${student.cgpa} / 10.0`],
                          ["Application Type", student.type],
                          ["Current Status", student.status],
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                            <span className="text-xs text-slate-600">{l}</span>
                            <span className="text-xs font-semibold text-slate-200 text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Skills</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {student.skills.map((sk, i) => (
                              <span key={i} className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold rounded-xl">{sk}</span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Achievements</h3>
                          <div className="space-y-2">
                            {student.achievements.map((a, i) => (
                              <div key={i} className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                </div>
                                <span className="text-xs font-semibold text-slate-300">{a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Application Summary</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-black/30 rounded-xl p-3 text-center">
                              <p className="text-2xl font-black text-sky-300">{student.applications.length}</p>
                              <p className="text-xs text-slate-600">Total Apps</p>
                            </div>
                            <div className="bg-black/30 rounded-xl p-3 text-center">
                              <p className="text-2xl font-black text-emerald-300">{student.applications.filter(a => ["Selected","Offered"].includes(a.status)).length}</p>
                              <p className="text-xs text-slate-600">Offers</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APPLICATIONS */}
                  {studentTab === "applications" && (
                    <div className="space-y-3">
                      {student.applications.map((app, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-black text-white text-base">{app.company}</h4>
                                <Pill text={app.status} cls={APP_STATUS_CFG[app.status] || ""} />
                              </div>
                              <p className="text-sm text-orange-300 font-bold">{app.role}</p>
                              <p className="text-xs text-slate-600 mt-0.5">{app.jd}</p>
                            </div>
                            <div className="text-right bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
                              <p className="text-xl font-black text-emerald-300">{app.package}</p>
                              <p className="text-xs text-slate-600">Package / Stipend</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
                            {[
                              ["Location", app.location],
                              ["Channel", app.channel],
                              ["Applied On", app.date],
                              ["Round", app.round],
                            ].map(([l, v]) => (
                              <div key={l}>
                                <p className="text-xs text-slate-600 mb-0.5">{l}</p>
                                <p className="text-xs font-semibold text-slate-300">{v}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CONTACT */}
                  {studentTab === "contact" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Student Direct Contact</h3>
                          <div className="space-y-3">
                            <a href={`mailto:${student.email}`} className="flex items-center gap-3 p-3 bg-orange-500/8 border border-orange-500/15 rounded-xl hover:bg-orange-500/15 transition">
                              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-600 uppercase tracking-wider">Email</p>
                                <p className="text-sm font-bold text-orange-300">{student.email}</p>
                              </div>
                            </a>
                            <a href={`tel:${student.phone}`} className="flex items-center gap-3 p-3 bg-emerald-500/8 border border-emerald-500/15 rounded-xl hover:bg-emerald-500/15 transition">
                              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-600 uppercase tracking-wider">Phone</p>
                                <p className="text-sm font-bold text-emerald-300">{student.phone}</p>
                              </div>
                            </a>
                            <a href={`https://${student.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-sky-500/8 border border-sky-500/15 rounded-xl hover:bg-sky-500/15 transition">
                              <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-600 uppercase tracking-wider">LinkedIn</p>
                                <p className="text-sm font-bold text-sky-300">{student.linkedin}</p>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">College TPO Contact</h3>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center font-black text-white mb-3">IB</div>
                          {[
                            ["TPO Name", COLLEGE.tpo],
                            ["Email", COLLEGE.tpoEmail],
                            ["Phone", COLLEGE.tpoPhone],
                            ["College", COLLEGE.name],
                          ].map(([l, v]) => (
                            <div key={l} className="flex justify-between border-b border-white/5 py-2 last:border-0">
                              <span className="text-xs text-slate-600">{l}</span>
                              <span className="text-xs font-semibold text-slate-300">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Applications Table with Contact */}
                      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Applications with Contact Details</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-white/6 text-slate-600 uppercase tracking-wider">
                                {["Company", "Role", "Location", "Package", "Channel", "Status", "Email", "Phone"].map(h => (
                                  <th key={h} className="text-left pb-3 pr-4 font-semibold">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {student.applications.map((app, i) => (
                                <tr key={i} className="hover:bg-white/2 transition">
                                  <td className="py-3 pr-4 font-black text-white">{app.company}</td>
                                  <td className="py-3 pr-4 text-orange-300 font-semibold">{app.role}</td>
                                  <td className="py-3 pr-4 text-slate-400">{app.location}</td>
                                  <td className="py-3 pr-4 text-emerald-300 font-bold">{app.package}</td>
                                  <td className="py-3 pr-4 text-slate-400">{app.channel}</td>
                                  <td className="py-3 pr-4"><Pill text={app.status} cls={APP_STATUS_CFG[app.status] || ""} /></td>
                                  <td className="py-3 pr-4 text-orange-300">{student.email}</td>
                                  <td className="py-3 text-emerald-300">{student.phone}</td>
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
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-orange-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <h3 className="text-lg font-black text-slate-400 mb-1">Select a Student</h3>
                  <p className="text-slate-600 text-sm max-w-xs">Click any student from the list to view their profile, applications, and contact details.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ APPLICATIONS TAB ══ */}
        {activeTab === "applications" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-white">All Applications — {COLLEGE.name}</h2>
              <span className="text-sm text-slate-500">{STUDENTS.reduce((a, s) => a + s.applications.length, 0)} total</span>
            </div>
            {STUDENTS.map((s, si) =>
              s.applications.map((app, ai) => (
                <div key={`${si}-${ai}`} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition">
                  <div className="flex flex-wrap items-start gap-4">
                    <Avatar initials={s.photo} size="sm" idx={si} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-black text-white">{s.name}</span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-xs text-slate-500">{s.rollNo}</span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-xs text-slate-500">{s.stream.split(" ")[0]}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-orange-300">{app.company}</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-sm text-slate-300">{app.role}</span>
                        <Pill text={app.status} cls={APP_STATUS_CFG[app.status] || ""} />
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                        <span>📍 {app.location}</span>
                        <span>📅 {app.date}</span>
                        <span>🔗 {app.channel}</span>
                        <span className="text-orange-300">✉️ {s.email}</span>
                        <span className="text-emerald-300">📞 {s.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-300">{app.package}</p>
                      <p className="text-xs text-slate-600">Package</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══ ANALYTICS TAB ══ */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Placement Rate" value={`${stats.placementRate}%`} sub="Batch 2024" accent="orange" />
              <StatCard label="Avg CGPA" value={stats.avgCgpa} sub="All registered" accent="amber" />
              <StatCard label="Total Offers" value={STUDENTS.flatMap(s => s.applications).filter(a => ["Selected","Offered"].includes(a.status)).length} sub="Across all students" accent="emerald" />
              <StatCard label="Companies" value={new Set(STUDENTS.flatMap(s => s.applications).map(a => a.company)).size} sub="Unique recruiters" accent="violet" />
            </div>

            {/* CGPA Distribution */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">CGPA vs Placement Status</h2>
              <div className="space-y-3">
                {STUDENTS.sort((a, b) => b.cgpa - a.cgpa).map((s, i) => {
                  const sc = STATUS_CFG[s.status] || STATUS_CFG.Applied;
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 w-4 font-bold">{i + 1}</span>
                      <Avatar initials={s.photo} size="xs" idx={i} />
                      <span className="text-xs font-semibold text-slate-300 w-28 truncate">{s.name}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${sc.bar} rounded-full`} style={{ width: `${s.cgpa * 10}%` }} />
                      </div>
                      <span className={`text-xs font-black w-8 text-right ${s.cgpa >= 9 ? "text-emerald-300" : s.cgpa >= 8 ? "text-amber-300" : "text-slate-400"}`}>{s.cgpa}</span>
                      <Pill text={s.status} cls={`${sc.pill} text-[9px]`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Channel Breakdown */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Application Channels</h2>
              <div className="space-y-3">
                {(() => {
                  const map = {};
                  STUDENTS.forEach(s => s.applications.forEach(a => { map[a.channel] = (map[a.channel] || 0) + 1; }));
                  const total = STUDENTS.reduce((a, s) => a + s.applications.length, 0);
                  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([channel, count]) => (
                    <div key={channel}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400 font-semibold">{channel}</span>
                        <span className="text-slate-500">{count} apps · {Math.round(count / total * 100)}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: `${count / total * 100}%` }} />
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
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
      `}</style>
    </div>
  );
}