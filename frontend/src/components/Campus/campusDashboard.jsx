import { useState, useMemo } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
const candidates = [
  {
    id: 1, name: "Aditya Sharma", college: "IIT Bombay", stream: "Computer Science",
    year: "2024", cgpa: 8.9, city: "Mumbai", state: "Maharashtra", type: "Both",
    status: "Placed", gender: "M", skills: ["Python", "React", "ML", "SQL"],
    apps: [
      { company: "Google", role: "SDE Intern", type: "Internship", location: "Bengaluru", date: "Jan 2024", status: "Placed", package: "₹80K/mo", via: "Campus Drive" },
      { company: "Microsoft", role: "Software Engineer", type: "Job", location: "Hyderabad", date: "Mar 2024", status: "Placed", package: "₹45 LPA", via: "Campus Drive" },
    ],
  },
  {
    id: 2, name: "Priya Menon", college: "NIT Trichy", stream: "Electronics & Comm.",
    year: "2024", cgpa: 9.1, city: "Trichy", state: "Tamil Nadu", type: "Job",
    status: "Shortlisted", gender: "F", skills: ["VLSI", "Embedded C", "MATLAB"],
    apps: [
      { company: "Texas Instruments", role: "Analog Design Engineer", type: "Job", location: "Bengaluru", date: "Feb 2024", status: "Shortlisted", package: "₹18 LPA", via: "College Placement Cell" },
      { company: "Qualcomm", role: "Chip Design Engineer", type: "Job", location: "Hyderabad", date: "Mar 2024", status: "Pending", package: "₹22 LPA", via: "College Placement Cell" },
    ],
  },
  {
    id: 3, name: "Rahul Verma", college: "BITS Pilani", stream: "Mechanical",
    year: "2023", cgpa: 7.6, city: "Pilani", state: "Rajasthan", type: "Internship",
    status: "Placed", gender: "M", skills: ["AutoCAD", "SolidWorks", "ANSYS"],
    apps: [
      { company: "Tata Motors", role: "Product Design Intern", type: "Internship", location: "Pune", date: "Jun 2023", status: "Placed", package: "₹30K/mo", via: "Alumni Network" },
    ],
  },
  {
    id: 4, name: "Sneha Kulkarni", college: "Pune University", stream: "MBA – Marketing",
    year: "2024", cgpa: 8.2, city: "Pune", state: "Maharashtra", type: "Both",
    status: "Pending", gender: "F", skills: ["Marketing", "Analytics", "Excel", "CRM"],
    apps: [
      { company: "HUL", role: "Brand Manager Trainee", type: "Job", location: "Mumbai", date: "Mar 2024", status: "Pending", package: "₹12 LPA", via: "Campus Drive" },
      { company: "Flipkart", role: "Marketing Intern", type: "Internship", location: "Remote", date: "Jan 2024", status: "Placed", package: "₹40K/mo", via: "Online Portal" },
    ],
  },
  {
    id: 5, name: "Karthik Raja", college: "VIT Vellore", stream: "Information Technology",
    year: "2024", cgpa: 8.5, city: "Vellore", state: "Tamil Nadu", type: "Job",
    status: "Placed", gender: "M", skills: ["Java", "Spring Boot", "AWS", "Docker"],
    apps: [
      { company: "Infosys", role: "System Engineer", type: "Job", location: "Chennai", date: "Feb 2024", status: "Placed", package: "₹6.5 LPA", via: "Mass Recruitment" },
      { company: "Zoho", role: "Software Developer", type: "Job", location: "Chennai", date: "Jan 2024", status: "Rejected", package: "₹8 LPA", via: "Campus Drive" },
    ],
  },
  {
    id: 6, name: "Divya Nair", college: "IIM Ahmedabad", stream: "MBA – Finance",
    year: "2024", cgpa: 9.4, city: "Ahmedabad", state: "Gujarat", type: "Both",
    status: "Placed", gender: "F", skills: ["Financial Modelling", "Valuation", "Python", "Excel"],
    apps: [
      { company: "Goldman Sachs", role: "IB Analyst", type: "Job", location: "Mumbai", date: "Feb 2024", status: "Placed", package: "₹32 LPA", via: "Campus Placement" },
      { company: "McKinsey", role: "Business Analyst Intern", type: "Internship", location: "Mumbai", date: "Jun 2023", status: "Placed", package: "₹1.8L/mo", via: "Campus Placement" },
    ],
  },
  {
    id: 7, name: "Arjun Patel", college: "Gujarat Tech University", stream: "Civil Engineering",
    year: "2023", cgpa: 7.2, city: "Ahmedabad", state: "Gujarat", type: "Internship",
    status: "Rejected", gender: "M", skills: ["AutoCAD", "SAP 2000", "Primavera"],
    apps: [
      { company: "L&T Construction", role: "Site Intern", type: "Internship", location: "Mumbai", date: "May 2023", status: "Rejected", package: "₹15K/mo", via: "Campus Drive" },
    ],
  },
  {
    id: 8, name: "Meera Iyer", college: "Delhi University", stream: "Economics (Hons)",
    year: "2024", cgpa: 8.7, city: "Delhi", state: "Delhi", type: "Job",
    status: "Shortlisted", gender: "F", skills: ["Econometrics", "R", "STATA", "Policy Analysis"],
    apps: [
      { company: "RBI", role: "Grade B Officer", type: "Job", location: "Mumbai", date: "Mar 2024", status: "Shortlisted", package: "₹14 LPA", via: "Government Exam" },
      { company: "NITI Aayog", role: "Research Analyst", type: "Job", location: "Delhi", date: "Feb 2024", status: "Pending", package: "₹10 LPA", via: "Direct Application" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (name) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const avatarColors = [
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-emerald-100", text: "text-emerald-800" },
  { bg: "bg-violet-100", text: "text-violet-800" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-rose-100", text: "text-rose-800" },
  { bg: "bg-teal-100", text: "text-teal-800" },
  { bg: "bg-indigo-100", text: "text-indigo-800" },
  { bg: "bg-orange-100", text: "text-orange-800" },
];

const statusConfig = {
  Placed:      { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Shortlisted: { pill: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",   dot: "bg-violet-500" },
  Pending:     { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-500" },
  Rejected:    { pill: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",          dot: "bg-rose-500" },
};

const typeConfig = {
  Job:        "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Internship: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  Both:       "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Avatar({ name, index, size = "md" }) {
  const c = avatarColors[index % avatarColors.length];
  const sz = size === "lg" ? "w-14 h-14 text-lg" : "w-9 h-9 text-xs";
  return (
    <div className={`${sz} ${c.bg} ${c.text} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials(name)}
    </div>
  );
}

function Pill({ label, className }) {
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
}

function MetricCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function AppRow({ app }) {
  const sc = statusConfig[app.status] || statusConfig.Pending;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{app.company}</p>
        <p className="text-[11px] text-slate-400 truncate">{app.location} · {app.via}</p>
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-xs text-slate-600">{app.role}</p>
        <p className="text-[10px] text-slate-400">{app.type}</p>
      </div>
      <Pill label={app.status} className={sc.pill} />
      <div className="text-right min-w-fit">
        <p className="text-xs font-semibold text-slate-700">{app.package}</p>
        <p className="text-[10px] text-slate-400">{app.date}</p>
      </div>
    </div>
  );
}

function CampusDetail({ candidate }) {
  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3 py-20">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p className="text-sm">Select a candidate to view profile</p>
      </div>
    );
  }

  const idx = candidates.findIndex((c) => c.id === candidate.id);
  const sc = statusConfig[candidate.status] || statusConfig.Pending;
  const tc = typeConfig[candidate.type];

  return (
    <div className="overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-start gap-4 p-5 border-b border-slate-100">
        <Avatar name={candidate.name} index={idx} size="lg" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-800">{candidate.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{candidate.stream} · {candidate.year} Batch</p>
          <p className="text-xs text-slate-500">{candidate.college} — {candidate.city}, {candidate.state}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Pill label={candidate.type} className={tc} />
            <Pill label={candidate.status} className={sc.pill} />
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-slate-800">{candidate.cgpa}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">CGPA</p>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 p-5 border-b border-slate-100">
        {[
          ["College", candidate.college],
          ["Stream", candidate.stream],
          ["Batch Year", candidate.year],
          ["Location", `${candidate.city}, ${candidate.state}`],
          ["Gender", candidate.gender === "M" ? "Male" : "Female"],
          ["Applications", candidate.apps.length],
        ].map(([k, v]) => (
          <div key={k} className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">{k}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5 truncate">{v}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="p-5 border-b border-slate-100">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {candidate.skills.map((s) => (
            <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">{s}</span>
          ))}
        </div>
      </div>

      {/* Applications */}
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Application history</p>
        {candidate.apps.map((a, i) => <AppRow key={i} app={a} />)}
      </div>
    </div>
  );
}

// ── Mini bar for stream chart ─────────────────────────────────────────────────
function MiniBar({ label, value, max, color }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[11px] text-slate-500 w-28 truncate flex-shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="text-[11px] font-semibold text-slate-600 w-4 text-right">{value}</span>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function CampusPlacementDashboard() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("candidates");

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const q = search.toLowerCase();
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.college.toLowerCase().includes(q) || c.stream.toLowerCase().includes(q);
      const matchT = filterType === "all" || c.type === filterType;
      const matchS = filterStatus === "all" || c.status === filterStatus;
      return matchQ && matchT && matchS;
    });
  }, [search, filterType, filterStatus]);

  // Analytics data
  const totalPlaced = candidates.filter((c) => c.status === "Placed").length;
  const totalShortlisted = candidates.filter((c) => c.status === "Shortlisted").length;
  const avgCgpa = (candidates.reduce((s, c) => s + c.cgpa, 0) / candidates.length).toFixed(1);
  const colleges = new Set(candidates.map((c) => c.college)).size;

  const streamCounts = candidates.reduce((acc, c) => {
    acc[c.stream] = (acc[c.stream] || 0) + 1;
    return acc;
  }, {});
  const maxStream = Math.max(...Object.values(streamCounts));

  const streamColors = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-teal-500"];

  const statusBreakdown = ["Placed", "Shortlisted", "Pending", "Rejected"].map((s) => ({
    label: s,
    count: candidates.filter((c) => c.status === s).length,
    config: statusConfig[s],
  }));

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">Campus Placement</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Placement management dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text" placeholder="Search candidate, college…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 w-48"
          />
          <select
            value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="all">All types</option>
            <option value="Job">Job</option>
            <option value="Internship">Internship</option>
            <option value="Both">Both</option>
          </select>
          <select
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="all">All status</option>
            <option value="Placed">Placed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </header>

      <div className="p-6 max-w-screen-xl mx-auto">
        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <MetricCard label="Total candidates" value={candidates.length} sub="Registered" accent="text-slate-800" />
          <MetricCard label="Placed" value={totalPlaced} sub="Offer letters issued" accent="text-emerald-600" />
          <MetricCard label="Shortlisted" value={totalShortlisted} sub="In process" accent="text-violet-600" />
          <MetricCard label="Colleges" value={colleges} sub="Participating" accent="text-sky-600" />
          <MetricCard label="Avg CGPA" value={avgCgpa} sub="Batch average" accent="text-amber-600" />
          <MetricCard label="Placement rate" value={`${Math.round((totalPlaced / candidates.length) * 100)}%`} sub="Overall batch" accent="text-rose-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-white border border-slate-100 rounded-xl p-1 w-fit shadow-sm">
          {["candidates", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-all capitalize ${
                activeTab === tab ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "candidates" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Candidate list */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">Candidates</h2>
                <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filtered.length} shown</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "560px" }}>
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-12">No candidates match the filters.</p>
                ) : (
                  filtered.map((c, i) => {
                    const sc = statusConfig[c.status] || statusConfig.Pending;
                    const tc = typeConfig[c.type];
                    const isActive = selected?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-slate-50 transition-colors ${
                          isActive ? "bg-slate-900" : "hover:bg-slate-50"
                        }`}
                      >
                        <Avatar name={c.name} index={candidates.indexOf(c)} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-slate-800"}`}>{c.name}</p>
                          <p className={`text-[11px] truncate ${isActive ? "text-slate-300" : "text-slate-400"}`}>{c.college} · {c.stream}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Pill label={c.type} className={isActive ? "bg-white/20 text-white ring-0" : tc} />
                          <Pill label={c.status} className={isActive ? "bg-white/20 text-white ring-0" : sc.pill} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Detail pane */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ minHeight: "400px" }}>
              <div className="px-4 py-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">
                  {selected ? selected.name : "Candidate profile"}
                </h2>
              </div>
              <div style={{ height: "calc(100% - 48px)" }}>
                <CampusDetail candidate={selected} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            {/* Status breakdown + Stream-wise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Status breakdown</h3>
                {statusBreakdown.map(({ label, count, config }) => (
                  <div key={label} className="flex items-center gap-3 mb-3 last:mb-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dot}`} />
                    <span className="text-xs text-slate-600 flex-1">{label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${config.dot}`}
                        style={{ width: `${(count / candidates.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-6 text-right">{count}</span>
                    <span className="text-[11px] text-slate-400 w-8 text-right">{Math.round((count / candidates.length) * 100)}%</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Candidates by stream</h3>
                {Object.entries(streamCounts).map(([stream, count], i) => (
                  <MiniBar key={stream} label={stream} value={count} max={maxStream} color={streamColors[i % streamColors.length]} />
                ))}
              </div>
            </div>

            {/* College table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">College-wise breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs" style={{ tableLayout: "fixed" }}>
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["College", "Stream", "Candidate", "CGPA", "Type", "Status", "Applications"].map((h) => (
                        <th key={h} className="text-left py-2 pr-3 text-[10px] uppercase tracking-wider text-slate-400 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c, i) => {
                      const sc = statusConfig[c.status] || statusConfig.Pending;
                      const tc = typeConfig[c.type];
                      return (
                        <tr
                          key={c.id}
                          className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => { setSelected(c); setActiveTab("candidates"); }}
                        >
                          <td className="py-2.5 pr-3 font-semibold text-slate-700 truncate">{c.college}</td>
                          <td className="py-2.5 pr-3 text-slate-500 truncate">{c.stream}</td>
                          <td className="py-2.5 pr-3">
                            <div className="flex items-center gap-1.5">
                              <Avatar name={c.name} index={i} size="sm" />
                              <span className="text-slate-700 truncate">{c.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-3 font-semibold text-slate-700">{c.cgpa}</td>
                          <td className="py-2.5 pr-3"><Pill label={c.type} className={tc} /></td>
                          <td className="py-2.5 pr-3"><Pill label={c.status} className={sc.pill} /></td>
                          <td className="py-2.5 text-slate-500">{c.apps.length} applied</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CGPA insight cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Highest CGPA", value: Math.max(...candidates.map((c) => c.cgpa)).toFixed(1), sub: candidates.find((c) => c.cgpa === Math.max(...candidates.map((cc) => cc.cgpa)))?.name, accent: "text-emerald-600" },
                { label: "Lowest CGPA", value: Math.min(...candidates.map((c) => c.cgpa)).toFixed(1), sub: candidates.find((c) => c.cgpa === Math.min(...candidates.map((cc) => cc.cgpa)))?.name, accent: "text-rose-500" },
                { label: "Avg CGPA (placed)", value: (candidates.filter((c) => c.status === "Placed").reduce((s, c) => s + c.cgpa, 0) / totalPlaced).toFixed(1), sub: "Placed candidates", accent: "text-blue-600" },
                { label: "Total applications", value: candidates.reduce((s, c) => s + c.apps.length, 0), sub: "Across all candidates", accent: "text-violet-600" },
              ].map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}