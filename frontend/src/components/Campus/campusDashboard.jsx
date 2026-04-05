import { useState, useMemo } from "react";

const CANDIDATES = [
  {
    id: 1,
    name: "Aarav Sharma",
    photo: "AS",
    email: "aarav.sharma@email.com",
    phone: "+91 98765 43210",
    college: "IIT Bombay",
    collegeType: "IIT",
    stream: "Computer Science & Engineering",
    year: "2024",
    cgpa: 9.2,
    city: "Mumbai",
    state: "Maharashtra",
    skills: ["React", "Node.js", "Python", "ML", "AWS"],
    status: "Placed",
    type: "Job",
    applications: [
      {
        company: "Google",
        role: "Software Engineer",
        location: "Bangalore",
        package: "45 LPA",
        channel: "Campus Drive",
        status: "Selected",
        date: "2024-02-15",
        round: "Completed",
      },
      {
        company: "Microsoft",
        role: "SDE-2",
        location: "Hyderabad",
        package: "38 LPA",
        channel: "Campus Drive",
        status: "Offered",
        date: "2024-01-20",
        round: "Completed",
      },
    ],
    interviews: [
      { company: "Google", date: "2024-02-10", interviewer: "John D.", feedback: "Excellent", round: "Final" },
    ],
    achievements: ["ACM ICPC Finalist", "Smart India Hackathon Winner"],
    linkedin: "linkedin.com/in/aarav-sharma",
  },
  {
    id: 2,
    name: "Priya Patel",
    photo: "PP",
    email: "priya.patel@email.com",
    phone: "+91 87654 32109",
    college: "NIT Trichy",
    collegeType: "NIT",
    stream: "Electronics & Communication",
    year: "2024",
    cgpa: 8.7,
    city: "Trichy",
    state: "Tamil Nadu",
    skills: ["VLSI", "Embedded C", "Python", "MATLAB", "IoT"],
    status: "Shortlisted",
    type: "Both",
    applications: [
      {
        company: "Texas Instruments",
        role: "Chip Design Intern",
        location: "Bangalore",
        package: "50K/month",
        channel: "Alumni Referral",
        status: "Shortlisted",
        date: "2024-03-01",
        round: "Round 2",
      },
      {
        company: "Qualcomm",
        role: "VLSI Engineer",
        location: "Hyderabad",
        package: "28 LPA",
        channel: "Campus Drive",
        status: "Under Review",
        date: "2024-02-20",
        round: "Round 1",
      },
    ],
    interviews: [],
    achievements: ["IEEE Paper Published", "Best Project Award"],
    linkedin: "linkedin.com/in/priya-patel",
  },
  {
    id: 3,
    name: "Rohit Verma",
    photo: "RV",
    email: "rohit.verma@email.com",
    phone: "+91 76543 21098",
    college: "BITS Pilani",
    collegeType: "BITS",
    stream: "Mechanical Engineering",
    year: "2023",
    cgpa: 7.9,
    city: "Pilani",
    state: "Rajasthan",
    skills: ["AutoCAD", "SolidWorks", "ANSYS", "Python", "Six Sigma"],
    status: "Placed",
    type: "Job",
    applications: [
      {
        company: "Tata Motors",
        role: "Design Engineer",
        location: "Pune",
        package: "12 LPA",
        channel: "Job Portal",
        status: "Selected",
        date: "2023-11-10",
        round: "Completed",
      },
    ],
    interviews: [
      { company: "Tata Motors", date: "2023-11-05", interviewer: "Ravi K.", feedback: "Good", round: "HR" },
    ],
    achievements: ["SAE Baja Participant", "Patent Filed"],
    linkedin: "linkedin.com/in/rohit-verma",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    photo: "SI",
    email: "sneha.iyer@email.com",
    phone: "+91 65432 10987",
    college: "VIT Vellore",
    collegeType: "Private",
    stream: "Data Science",
    year: "2024",
    cgpa: 9.5,
    city: "Vellore",
    state: "Tamil Nadu",
    skills: ["Python", "TensorFlow", "SQL", "Tableau", "Spark"],
    status: "Placed",
    type: "Both",
    applications: [
      {
        company: "Amazon",
        role: "Data Scientist",
        location: "Bangalore",
        package: "32 LPA",
        channel: "Campus Drive",
        status: "Selected",
        date: "2024-01-15",
        round: "Completed",
      },
      {
        company: "Flipkart",
        role: "Data Analyst Intern",
        location: "Bangalore",
        package: "40K/month",
        channel: "Online Test",
        status: "Completed",
        date: "2023-06-01",
        round: "Completed",
      },
    ],
    interviews: [],
    achievements: ["Kaggle Expert", "Google WE Scholar"],
    linkedin: "linkedin.com/in/sneha-iyer",
  },
  {
    id: 5,
    name: "Karan Mehta",
    photo: "KM",
    email: "karan.mehta@email.com",
    phone: "+91 54321 09876",
    college: "DTU Delhi",
    collegeType: "State",
    stream: "Information Technology",
    year: "2025",
    cgpa: 8.1,
    city: "Delhi",
    state: "Delhi",
    skills: ["Java", "Spring Boot", "Microservices", "Docker", "Kubernetes"],
    status: "Applied",
    type: "Internship",
    applications: [
      {
        company: "Infosys",
        role: "System Engineer Intern",
        location: "Mysore",
        package: "30K/month",
        channel: "Campus Drive",
        status: "Applied",
        date: "2024-03-10",
        round: "Pending",
      },
      {
        company: "Wipro",
        role: "Turbo Intern",
        location: "Bangalore",
        package: "25K/month",
        channel: "Job Portal",
        status: "Applied",
        date: "2024-03-08",
        round: "Pending",
      },
    ],
    interviews: [],
    achievements: ["Open Source Contributor", "Hackathon Top 10"],
    linkedin: "linkedin.com/in/karan-mehta",
  },
  {
    id: 6,
    name: "Divya Nair",
    photo: "DN",
    email: "divya.nair@email.com",
    phone: "+91 43210 98765",
    college: "IIT Madras",
    collegeType: "IIT",
    stream: "Chemical Engineering",
    year: "2024",
    cgpa: 8.9,
    city: "Chennai",
    state: "Tamil Nadu",
    skills: ["ASPEN", "MATLAB", "Python", "Process Simulation", "Six Sigma"],
    status: "Shortlisted",
    type: "Job",
    applications: [
      {
        company: "Reliance Industries",
        role: "Process Engineer",
        location: "Mumbai",
        package: "18 LPA",
        channel: "Campus Drive",
        status: "Shortlisted",
        date: "2024-02-28",
        round: "Round 3",
      },
    ],
    interviews: [
      { company: "Reliance", date: "2024-03-05", interviewer: "Suresh M.", feedback: "Very Good", round: "Technical" },
    ],
    achievements: ["Best Thesis Award", "CHEMCON Presenter"],
    linkedin: "linkedin.com/in/divya-nair",
  },
];

const STATUS_CONFIG = {
  Placed:      { bg: "bg-green-100 dark:bg-green-900/40",      text: "text-green-700 dark:text-green-300",      dot: "bg-green-500",  border: "border-green-200 dark:border-green-700" },
  Shortlisted: { bg: "bg-yellow-100 dark:bg-yellow-900/40",    text: "text-yellow-700 dark:text-yellow-300",    dot: "bg-yellow-500", border: "border-yellow-200 dark:border-yellow-700" },
  Applied:     { bg: "bg-blue-100 dark:bg-blue-900/40",        text: "text-blue-700 dark:text-blue-300",        dot: "bg-blue-500",   border: "border-blue-200 dark:border-blue-700" },
  "Under Review": { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300",    dot: "bg-purple-500", border: "border-purple-200 dark:border-purple-700" },
};

const APP_STATUS = {
  Selected:      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Offered:       "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Shortlisted:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Under Review":"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Applied:       "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Completed:     "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const COLLEGE_COLORS = {
  IIT:     "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
  NIT:     "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700",
  BITS:    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700",
  Private: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-700",
  State:   "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700",
};

const AVATAR_COLORS = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-pink-500 to-pink-700",
  "from-indigo-500 to-indigo-700",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-700",
];

function Avatar({ initials, size = "md", index = 0 }) {
  const gradient = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl" };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white flex-shrink-0 shadow-md`}>
      {initials}
    </div>
  );
}

function StatCard({ label, value, sub, accent = "blue" }) {
  const accents = {
    blue:   "from-blue-50 to-blue-100 border-blue-200 text-blue-700 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800 dark:text-blue-300",
    green:  "from-green-50 to-green-100 border-green-200 text-green-700 dark:from-green-950 dark:to-green-900 dark:border-green-800 dark:text-green-300",
    yellow: "from-yellow-50 to-amber-100 border-yellow-200 text-yellow-700 dark:from-yellow-950 dark:to-amber-900 dark:border-yellow-800 dark:text-yellow-300",
    indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700 dark:from-indigo-950 dark:to-indigo-900 dark:border-indigo-800 dark:text-indigo-300",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800 dark:text-purple-300",
    pink:   "from-pink-50 to-pink-100 border-pink-200 text-pink-700 dark:from-pink-950 dark:to-pink-900 dark:border-pink-800 dark:text-pink-300",
  };
  const c = accents[accent] || accents.blue;
  const parts = c.split(" ");
  return (
    <div className={`bg-gradient-to-br ${parts[0]} ${parts[1]} border ${parts[2]} rounded-2xl p-5 flex flex-col gap-1 shadow-sm`}>
      <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-widest">{label}</span>
      <span className={`text-3xl font-black ${parts[3]} ${parts[4]} ${parts[5]}`}>{value}</span>
      {sub && <span className="text-gray-400 dark:text-gray-500 text-xs">{sub}</span>}
    </div>
  );
}

function Badge({ text, className = "" }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>{text}</span>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCollege, setFilterCollege] = useState("All");
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = useMemo(() => ({
    total: CANDIDATES.length,
    placed: CANDIDATES.filter(c => c.status === "Placed").length,
    shortlisted: CANDIDATES.filter(c => c.status === "Shortlisted").length,
    colleges: [...new Set(CANDIDATES.map(c => c.college))].length,
    avgCgpa: (CANDIDATES.reduce((a, c) => a + c.cgpa, 0) / CANDIDATES.length).toFixed(1),
    internships: CANDIDATES.filter(c => c.type === "Internship" || c.type === "Both").length,
  }), []);

  const filtered = useMemo(() => CANDIDATES.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.college.toLowerCase().includes(q) || c.stream.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
    const matchType = filterType === "All" || c.type === filterType;
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchCollege = filterCollege === "All" || c.collegeType === filterCollege;
    return matchSearch && matchType && matchStatus && matchCollege;
  }), [search, filterType, filterStatus, filterCollege]);

  const candidate = selected ? CANDIDATES.find(c => c.id === selected) : null;
  const candidateIndex = candidate ? CANDIDATES.findIndex(c => c.id === selected) : 0;

  return (
    <div
      className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar ── */}
        <aside className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex flex-col`}>
          <div className="p-4 flex flex-col gap-3 flex-1 overflow-hidden">

            {/* Search */}
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
              <input
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition shadow-sm"
                placeholder="Search candidates…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Type Filters */}
            <div className="grid grid-cols-4 gap-1.5">
              {["All", "Job", "Internship", "Both"].map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition ${filterType === t ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="grid grid-cols-2 gap-1.5">
              {["All", "Placed", "Shortlisted", "Applied"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition ${filterStatus === s ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700"}`}>
                  {s}
                </button>
              ))}
            </div>

            {/* College Type Filters */}
            <div className="grid grid-cols-3 gap-1.5">
              {["All", "IIT", "NIT", "BITS", "State", "Private"].map(ct => (
                <button key={ct} onClick={() => setFilterCollege(ct)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition ${filterCollege === ct ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-gray-200 dark:border-gray-700"}`}>
                  {ct}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 font-medium">{filtered.length} of {CANDIDATES.length} candidates</p>

            {/* Candidate List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scroll">
              {filtered.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No candidates match your filters.</div>
              )}
              {filtered.map((c, i) => {
                const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.Applied;
                return (
                  <button key={c.id} onClick={() => { setSelected(c.id); setActiveTab("profile"); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selected === c.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm"
                        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}>
                    <div className="flex items-center gap-3">
                      <Avatar initials={c.photo} size="sm" index={i} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{c.name}</span>
                          <span className={`flex-shrink-0 w-2 h-2 rounded-full ${sc.dot}`}></span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{c.college}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${sc.bg} ${sc.text}`}>{c.status}</span>
                          <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                          <span className="text-xs text-gray-400">{c.type}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto">

          {/* Stats Row */}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Total" value={stats.total} sub="Candidates" accent="blue" />
            <StatCard label="Placed" value={stats.placed} sub={`${Math.round(stats.placed/stats.total*100)}% rate`} accent="green" />
            <StatCard label="Shortlisted" value={stats.shortlisted} sub="In pipeline" accent="yellow" />
            <StatCard label="Colleges" value={stats.colleges} sub="Institutions" accent="indigo" />
            <StatCard label="Avg CGPA" value={stats.avgCgpa} sub="Across batch" accent="purple" />
            <StatCard label="Internships" value={stats.internships} sub="Applicants" accent="pink" />
          </div>

          {candidate ? (
            <div className="p-4 pt-0">

              {/* Candidate Header */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-4 shadow-sm">
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar initials={candidate.photo} size="lg" index={candidateIndex} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">{candidate.name}</h2>
                      <Badge
                        text={candidate.status}
                        className={`${STATUS_CONFIG[candidate.status]?.bg} ${STATUS_CONFIG[candidate.status]?.text} border ${STATUS_CONFIG[candidate.status]?.border}`}
                      />
                      <Badge text={candidate.type} className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{candidate.stream} · {candidate.year} Batch</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        {candidate.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        {candidate.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                        {candidate.city}, {candidate.state}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-center shadow-sm">
                      <p className="text-xs text-gray-400">CGPA</p>
                      <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{candidate.cgpa}</p>
                    </div>
                    <Badge text={candidate.collegeType} className={`border ${COLLEGE_COLORS[candidate.collegeType]}`} />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {["profile", "applications", "interviews", "achievements"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Academic Details</h3>
                    <div className="space-y-3">
                      {[
                        { label: "College", value: candidate.college },
                        { label: "Type", value: candidate.collegeType },
                        { label: "Stream", value: candidate.stream },
                        { label: "Graduation Year", value: candidate.year },
                        { label: "CGPA", value: `${candidate.cgpa} / 10.0` },
                        { label: "Location", value: `${candidate.city}, ${candidate.state}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                          <span className="text-xs text-gray-400">{label}</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Skills & Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl">{s}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Application Summary</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-3 text-center">
                          <p className="text-xl font-black text-blue-600 dark:text-blue-400">{candidate.applications.length}</p>
                          <p className="text-xs text-gray-500">Total Applications</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-xl p-3 text-center">
                          <p className="text-xl font-black text-green-600 dark:text-green-400">{candidate.applications.filter(a => a.status === "Selected" || a.status === "Offered").length}</p>
                          <p className="text-xs text-gray-500">Offers Received</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === "applications" && (
                <div className="space-y-3">
                  {candidate.applications.map((app, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">{app.company}</h4>
                            <Badge text={app.status} className={APP_STATUS[app.status] || "bg-gray-100 text-gray-600"} />
                          </div>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{app.role}</p>
                        </div>
                        <div className="text-right bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-2">
                          <p className="text-lg font-black text-green-600 dark:text-green-400">{app.package}</p>
                          <p className="text-xs text-gray-400">Package</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {[
                          { label: "Location", value: app.location },
                          { label: "Channel", value: app.channel },
                          { label: "Applied", value: app.date },
                          { label: "Round", value: app.round },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-gray-400">{label}</p>
                            <p className="text-gray-700 dark:text-gray-300 font-semibold mt-0.5">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* INTERVIEWS TAB */}
              {activeTab === "interviews" && (
                <div>
                  {candidate.interviews.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <p className="text-sm">No interview records yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {candidate.interviews.map((iv, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">{iv.company}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">{iv.round} Round · {iv.date}</p>
                            </div>
                            <div className="text-right">
                              <Badge text={iv.feedback} className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" />
                              <p className="text-xs text-gray-400 mt-1">by {iv.interviewer}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ACHIEVEMENTS TAB */}
              {activeTab === "achievements" && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Achievements & Highlights</h3>
                  <div className="space-y-3">
                    {candidate.achievements.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{a}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Profile Links</h4>
                    <a href="#" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      {candidate.linkedin}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center mb-6 shadow-md">
                <svg className="w-10 h-10 text-blue-500 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">Select a Candidate</h3>
              <p className="text-gray-400 text-sm max-w-xs">Choose a candidate from the list to view their full placement profile, applications, and interview history.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .custom-scroll::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}