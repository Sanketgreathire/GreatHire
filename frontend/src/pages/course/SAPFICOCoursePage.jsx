import { useState, lazy, Suspense } from "react";
import { Stars, FaqItem } from "./_shared";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const CourseEnrollModal = lazy(() => import("@/components/CourseEnrollModal"));
const TalkToCounsellorModal = lazy(() => import("@/components/TalkToCounsellorModal"));

// ─── Data ────────────────────────────────────────────────────────────────────

const CURRICULUM = [
  {
    module: "Module 1",
    title: "SAP Overview & ERP Fundamentals",
    duration: "1 Week",
    topics: [
      "Introduction to ERP & SAP",
      "SAP Architecture & Landscape",
      "SAP Modules Overview – FI, CO, MM, SD, PP",
      "SAP Navigation & Screen Elements",
      "Organizational Structure in SAP",
      "SAP S/4 HANA vs ECC Overview",
    ],
  },
  {
    module: "Module 2",
    title: "SAP FI – Financial Accounting",
    duration: "4 Weeks",
    topics: [
      "General Ledger (GL) Accounting",
      "Accounts Payable (AP) Configuration",
      "Accounts Receivable (AR) Configuration",
      "Asset Accounting (AA) – AA Master Data",
      "Bank Accounting & Reconciliation",
      "Document Splitting & New GL",
      "Financial Closing & Period-End Processes",
    ],
  },
  {
    module: "Module 3",
    title: "SAP CO – Controlling",
    duration: "3 Weeks",
    topics: [
      "Cost Center Accounting (CCA)",
      "Internal Orders Management",
      "Profit Center Accounting (PCA)",
      "Product Costing (PC) – Cost Estimates",
      "Profitability Analysis (CO-PA)",
      "Activity-Based Costing",
      "CO-FI Integration & Reporting",
    ],
  },
  {
    module: "Module 4",
    title: "Integration with Other SAP Modules",
    duration: "2 Weeks",
    topics: [
      "FI-MM Integration – Procurement & Invoicing",
      "FI-SD Integration – Billing & Revenue",
      "FI-PP Integration – Production Orders",
      "Controlling Integration Scenarios",
      "Cross-Module Configuration & Testing",
    ],
  },
  {
    module: "Module 5",
    title: "SAP S/4 HANA Finance",
    duration: "2 Weeks",
    topics: [
      "S/4 HANA Architecture & Universal Journal",
      "Migration from ECC to S/4 HANA Finance",
      "Fiori Apps for Finance",
      "Central Finance Overview",
      "New Asset Accounting in S/4 HANA",
      "SAP Analytics Cloud Basics",
    ],
  },
  {
    module: "Module 6",
    title: "Reporting & End-User Training",
    duration: "1 Week",
    topics: [
      "Standard SAP FI Reports",
      "SAP Query & Report Painter",
      "Financial Statements in SAP",
      "Month-End & Year-End Closing",
      "Audit Trail & Compliance Reporting",
    ],
  },
  {
    module: "Module 7",
    title: "Real-World Projects & Interview Prep",
    duration: "2 Weeks",
    topics: [
      "End-to-End FI Configuration Project",
      "CO Integration Scenario Project",
      "Blueprint Document Preparation",
      "Resume Building & LinkedIn Optimization",
      "Mock Interviews & SAP Certification Prep",
      "Client Scenario Role-Play Practice",
    ],
  },
];

const TOOLS = [
  { name: "SAP FI", color: "bg-blue-100 text-blue-700", icon: "💹" },
  { name: "SAP CO", color: "bg-indigo-100 text-indigo-700", icon: "📊" },
  { name: "SAP S/4 HANA", color: "bg-purple-100 text-purple-700", icon: "🏦" },
  { name: "SAP Fiori", color: "bg-pink-100 text-pink-700", icon: "📱" },
  { name: "SAP ECC 6.0", color: "bg-gray-100 text-gray-700", icon: "🖥️" },
  { name: "SAP Query", color: "bg-orange-100 text-orange-700", icon: "🔍" },
  { name: "SAP MM", color: "bg-green-100 text-green-700", icon: "📦" },
  { name: "SAP SD", color: "bg-yellow-100 text-yellow-700", icon: "🛒" },
  { name: "Report Painter", color: "bg-teal-100 text-teal-700", icon: "📈" },
  { name: "SAP Analytics Cloud", color: "bg-sky-100 text-sky-700", icon: "☁️" },
  { name: "MS Excel", color: "bg-emerald-100 text-emerald-700", icon: "📋" },
  { name: "SAP BW Basics", color: "bg-violet-100 text-violet-700", icon: "🔗" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Placement support with top IT services & SAP consulting firms." },
  { icon: "🛠️", title: "Live System Practice", desc: "Hands-on training on SAP S/4 HANA & ECC live systems." },
  { icon: "👨‍🏫", title: "SAP Certified Trainers", desc: "Learn from SAP consultants with 12+ years of real project experience." },
  { icon: "📋", title: "End-to-End Projects", desc: "Complete FI & CO configuration scenarios on real business processes." },
  { icon: "🎖️", title: "SAP Certification Prep", desc: "Preparation for SAP Certified Application Associate exams." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options available." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to recordings, configuration notes & interview material." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated SAP mentor for doubt clearing and career guidance." },
];

const TESTIMONIALS = [
  {
    name: "Deepika Varma",
    role: "SAP FI Consultant @ Deloitte",
    avatar: "DV",
    color: "bg-blue-500",
    rating: 5,
    text: "The SAP FICO course was extremely detailed and practical. Working on live S/4 HANA systems during training gave me the confidence to handle real client projects from day one at Deloitte.",
  },
  {
    name: "Suresh Babu",
    role: "SAP FICO Analyst @ Wipro",
    avatar: "SB",
    color: "bg-purple-500",
    rating: 5,
    text: "Excellent trainers who explain complex FI-CO integration scenarios with real business examples. The mock interview sessions were exactly what I needed to crack the Wipro technical round.",
  },
  {
    name: "Lakshmi Prasanna",
    role: "SAP Finance Consultant @ Accenture",
    avatar: "LP",
    color: "bg-indigo-500",
    rating: 5,
    text: "From GL to Product Costing, every topic was covered in depth. The S/4 HANA module gave me an edge over other candidates. Got my offer within 3 weeks of placement support!",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "7 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "11 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "4 seats left", urgent: true },
];

const FAQS = [
  {
    q: "Do I need accounting knowledge to join SAP FICO?",
    a: "Basic understanding of accounting concepts (debit/credit, balance sheet, P&L) is recommended. Commerce graduates, CAs, MBA Finance students, or anyone with financial background can join easily.",
  },
  {
    q: "What is the course duration?",
    a: "The SAP FICO course is approximately 4 months (15 weeks). This includes FI, CO, S/4 HANA Finance, integration topics, and real-world project work.",
  },
  {
    q: "Will I get SAP certification support?",
    a: "Yes, we fully prepare you for the SAP Certified Application Associate – SAP S/4HANA for Financial Accounting exam. Exam registration fee is separate.",
  },
  {
    q: "What job roles can I apply for after this course?",
    a: "SAP FICO Consultant, SAP Finance Analyst, SAP FI/CO Support Consultant, S/4 HANA Finance Consultant, SAP Project Manager (with experience), and ERP Analyst roles.",
  },
  {
    q: "Is live SAP system access provided?",
    a: "Yes! We provide access to SAP S/4 HANA and ECC training systems throughout the course duration so you can practice configurations hands-on.",
  },
  {
    q: "What is the course fee?",
    a: "The course fee is ₹38,000 including live system access, project documentation, certification prep, and placement support. EMI options from ₹7,000/month available.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-indigo-300 shadow-sm" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-indigo-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-indigo-50/40 border-t border-indigo-100">
          <p className="text-xs text-indigo-600 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DemoModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", mode: "Online" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/enquiry`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: "SAP FICO", type: "demo" }),
      });
    } catch (_) {}
    setLoading(false); setDone(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {done ? (
          <div className="p-8 text-center"><div className="text-5xl mb-4">🎓</div><h3 className="text-xl font-black text-gray-900 mb-2">Demo Booked!</h3><p className="text-gray-500 text-sm mb-6">Our counsellor will contact you within 2 hours to confirm your free demo session.</p><button onClick={onClose} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-rose-700">Got it!</button></div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900">SAP FICO</h3><p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p></div>
            <div className="space-y-4">
              {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" }].map(({ label, key, type, placeholder }) => (
                <div key={key}><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label><input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" /></div>
              ))}
              <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Preferred Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"><option>Online</option><option>Offline</option><option>Hybrid</option></select></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">{loading ? "Submitting..." : "Book Free Demo Class →"}</button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function SAPFICOCoursePage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4f46e5 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 Most Popular</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Finance & ERP</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">SAP Certified Prep</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                SAP FICO Training<br />
                <span className="text-yellow-300">FI + CO + S/4 HANA</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-indigo-200">in Hyderabad</span>
              </h1>
              <p className="text-indigo-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master SAP Financial Accounting (FI) and Controlling (CO) with S/4 HANA Finance. Work on end-to-end configuration scenarios and land roles at top SAP consulting firms, MNCs & IT companies.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[{ val: "4.8★", label: "Rating" }, { val: "2,100+", label: "Students" }, { val: "4 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (
                  <div key={s.label}><p className="text-xl font-black text-yellow-300">{s.val}</p><p className="text-xs text-indigo-200 font-medium">{s.label}</p></div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">🚀 Enroll Now — ₹38,000</button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">📥 Download Syllabus</button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-indigo-200">
                <span>✅ No Cost EMI Available</span><span>✅ Live SAP System Access</span><span>✅ Free Demo Class</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.8</span><span className="text-xs text-gray-400">(2,100+ reviews)</span></div>
                <p className="text-3xl font-black text-indigo-600 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">
                  {["📅 Next batch starts April 14", "⏱ 4 months duration", "🖥 Live SAP System Access", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS Access"].map((item) => (
                    <p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
                  Book Free Demo Class
                </button>
                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to a Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure payment · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div><p className="text-xl font-black text-indigo-600 leading-none">₹38,000</p><p className="text-xs text-gray-400">EMI from ₹7,000/mo</p></div>
          <button onClick={() => setShowEnroll(true)} className="bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-indigo-600 rounded-full inline-block"></span>Course Overview
              </h2>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-base leading-relaxed mb-4">The <strong>SAP FICO Training Course</strong> at Great Hire is a comprehensive 4-month program covering SAP Financial Accounting (FI), Controlling (CO), and S/4 HANA Finance. You'll gain hands-on experience configuring real business scenarios on live SAP systems.</p>
                <p className="text-gray-700 text-base leading-relaxed">With live system access, end-to-end project work, and placement support through Great Hire's SAP consulting & IT network, this is your fastest path to a high-paying SAP career.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ icon: "⏱", label: "Duration", val: "4 Months" }, { icon: "📚", label: "Modules", val: "7 Modules" }, { icon: "🖥", label: "Mode", val: "Online + Offline" }, { icon: "🌐", label: "Language", val: "English / Telugu" }].map((item) => (
                  <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl mb-1">{item.icon}</p><p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p><p className="text-sm font-bold text-gray-900">{item.val}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-indigo-600 rounded-full inline-block"></span>Why This Course?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                    <div className="w-11 h-11 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">{h.icon}</div>
                    <div><p className="font-bold text-gray-900 text-sm mb-0.5">{h.title}</p><p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p></div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-7 bg-indigo-600 rounded-full inline-block"></span>Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 15 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => (
                  <AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />
                ))}
              </div>
              <div className="mt-4 text-center"><button className="text-indigo-600 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button></div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-indigo-600 rounded-full inline-block"></span>Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((t) => (
                  <span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}><span className="text-base">{t.icon}</span>{t.name}</span>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-indigo-600 rounded-full inline-block"></span>Upcoming Batches
              </h2>
              <div className="space-y-4">
                {BATCHES.map((b) => (
                  <div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-indigo-300 bg-indigo-50" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-indigo-100" : "bg-gray-100"}`}>📅</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-gray-900">{b.type}</p>{b.urgent && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Filling Fast</span>}</div>
                        <p className="text-sm text-gray-500 mt-0.5">{b.schedule} · {b.time} · {b.mode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p className="text-xs text-gray-500 font-medium">{b.seats}</p>
                      <button onClick={() => setShowEnroll(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-indigo-600 rounded-full inline-block"></span>Student Reviews
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <Stars count={t.rating} />
                    <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div>
                      <div><p className="text-sm font-bold text-gray-900">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-indigo-600 rounded-full inline-block"></span>Frequently Asked Questions
              </h2>
              <div className="space-y-3">{FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}</div>
            </section>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.8</span><span className="text-xs text-gray-400">(2,100+)</span></div>
                <p className="text-3xl font-black text-indigo-600 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700">
                  {["📅 Next batch: April 14, 2025", "⏱ Duration: 4 months", "🖥 Live SAP System Access", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS Access", "👥 Batch size: 15 students"].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-indigo-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("💹 Check out this SAP FICO Course at Great Hire! Master FI, CO & S/4HANA with 100% placement support.\n" + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-indigo-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  Share & Earn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-indigo-700 to-indigo-900 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Launch Your SAP FICO Career Today</h2>
          <p className="text-indigo-100 text-base sm:text-lg mb-8 leading-relaxed">Join 2,100+ students who've already secured SAP roles at top consulting & IT companies with Great Hire.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
          </div>
        </div>
      </section>

      <Footer />
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {showEnroll && <CourseEnrollModal onClose={() => setShowEnroll(false)} courseName="SAP FICO" amount={38000} accentColor="blue" />}
    </div>
  );
}
