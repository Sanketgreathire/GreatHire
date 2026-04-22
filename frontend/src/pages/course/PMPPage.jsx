import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";
import TalkToCounsellorModal from "@/components/TalkToCounsellorModal";


const CURRICULUM = [
  {
    module: "Module 1",
    title: "Project Management Fundamentals",
    duration: "1 Week",
    topics: [
      "Introduction to Project Management & PMI",
      "Project Life Cycle – Predictive, Agile, Hybrid",
      "PMBOK 7th Edition – 12 Principles & 8 Performance Domains",
      "Project vs Program vs Portfolio Management",
      "Organizational Structures & PM Roles",
      "PMP Exam Eligibility & Application Process",
    ],
  },
  {
    module: "Module 2",
    title: "Project Initiation & Stakeholder Management",
    duration: "1 Week",
    topics: [
      "Project Charter Creation & Approval",
      "Business Case & Benefits Realization",
      "Stakeholder Identification & Analysis",
      "Stakeholder Engagement Matrix",
      "Communication Management Plan",
      "Kick-Off Meeting & RACI Matrix",
    ],
  },
  {
    module: "Module 3",
    title: "Scope, Schedule & Cost Management",
    duration: "2 Weeks",
    topics: [
      "Scope Planning – WBS Creation & Decomposition",
      "Scope Baseline – Scope Statement, WBS, WBS Dictionary",
      "Schedule Planning – Activity Sequencing, CPM, PDM",
      "Network Diagrams & Critical Path Method",
      "Resource Planning & Leveling",
      "Cost Estimating – Bottom-Up, Analogous, Parametric",
      "Cost Baseline & Budget Determination",
    ],
  },
  {
    module: "Module 4",
    title: "Risk, Quality & Procurement Management",
    duration: "2 Weeks",
    topics: [
      "Risk Identification – Risk Register & Risk Breakdown Structure",
      "Qualitative & Quantitative Risk Analysis",
      "Risk Response Strategies – Avoid, Transfer, Mitigate, Accept",
      "Quality Management – Plan, Assure, Control",
      "Kaizen, Six Sigma & Cost of Quality",
      "Procurement Planning – Make or Buy Analysis",
      "Contract Types – Fixed Price, Cost Plus, T&M",
    ],
  },
  {
    module: "Module 5",
    title: "Agile & Hybrid Project Management",
    duration: "2 Weeks",
    topics: [
      "Agile Values & Principles – Agile Manifesto",
      "Scrum – Roles, Events, Artifacts",
      "Kanban & Lean Project Management",
      "Scaled Agile – SAFe Overview",
      "Hybrid PM – Combining Waterfall & Agile",
      "Agile Metrics – Velocity, Burn-Down, Lead Time",
      "PMI-ACP Exam Overview",
    ],
  },
  {
    module: "Module 6",
    title: "Earned Value, Monitoring & Closing",
    duration: "1 Week",
    topics: [
      "Earned Value Management (EVM) – SPI, CPI, SV, CV",
      "Forecasting – EAC, ETC, TCPI",
      "Change Control Process & CCB",
      "Integrated Change Control – Perform vs Monitor",
      "Project Closure – Lessons Learned & Final Report",
      "Benefits Realization & Transition Planning",
    ],
  },
  {
    module: "Module 7",
    title: "PMP Exam Prep & Mock Tests",
    duration: "3 Weeks",
    topics: [
      "PMP Exam Format – 180 Questions, 230 Minutes",
      "Predictive vs Agile Question Analysis",
      "Domain 1: People (42%)",
      "Domain 2: Process (50%)",
      "Domain 3: Business Environment (8%)",
      "5 Full-Length 180-Question Mock Exams",
      "Situational Question Strategy & Exam Tips",
    ],
  },
];

const TOOLS = [
  { name: "MS Project", color: "bg-blue-100 text-blue-700", icon: "📅" },
  { name: "JIRA", color: "bg-indigo-100 text-indigo-700", icon: "🎯" },
  { name: "Asana", color: "bg-pink-100 text-pink-700", icon: "📋" },
  { name: "Trello", color: "bg-cyan-100 text-cyan-700", icon: "📌" },
  { name: "Smartsheet", color: "bg-green-100 text-green-700", icon: "📊" },
  { name: "Confluence", color: "bg-blue-100 text-blue-800", icon: "📝" },
  { name: "Excel / WBS", color: "bg-emerald-100 text-emerald-700", icon: "📈" },
  { name: "Miro", color: "bg-yellow-100 text-yellow-700", icon: "🟡" },
  { name: "Risk Register", color: "bg-red-100 text-red-700", icon: "⚠️" },
  { name: "PMBOK 7th Ed", color: "bg-orange-100 text-orange-700", icon: "📚" },
  { name: "SAFe Agile", color: "bg-purple-100 text-purple-700", icon: "🔷" },
  { name: "Monday.com", color: "bg-rose-100 text-rose-700", icon: "🗓️" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Direct referrals to 500+ hiring partners — IT, construction, pharma & consulting." },
  { icon: "🏅", title: "PMP Exam-Focused", desc: "Aligned with PMI's PMP 2024 exam blueprint. 5 full mock tests of 180 questions." },
  { icon: "👨‍🏫", title: "PMP-Certified Trainers", desc: "Learn from PMP-certified project managers with 15+ years of delivery experience." },
  { icon: "📋", title: "35 PDU Contact Hours", desc: "Receive 35 PMI-approved Contact Hours required for PMP certification eligibility." },
  { icon: "🎖️", title: "Dual Certification", desc: "Great Hire + IIT Guwahati E&ICT Academy recognized certificate." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options to suit your schedule." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to PMBOK summaries, templates, recordings & mock tests." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated PMP mentor for exam strategy, applications and career guidance." },
];

const TESTIMONIALS = [
  {
    name: "Vivek Sharma",
    role: "Project Manager @ Infosys",
    avatar: "VS",
    color: "bg-blue-500",
    rating: 5,
    text: "Cleared PMP on first attempt with a stellar score. The 5 mock tests and situational question training are phenomenal. The trainer's 15 years of real project experience shows in every session!",
  },
  {
    name: "Deepika Rao",
    role: "IT Project Manager @ Accenture",
    avatar: "DR",
    color: "bg-emerald-500",
    rating: 5,
    text: "The Agile + Predictive hybrid approach in PMBOK 7 was confusing until this course. The trainer broke down each domain beautifully. Got promoted to PM at Accenture within 3 months!",
  },
  {
    name: "Sanjay Pillai",
    role: "Senior PM @ TCS",
    avatar: "SP",
    color: "bg-amber-500",
    rating: 5,
    text: "The EVM and schedule management sessions are exceptional. The 35 PDU certificate was provided instantly. The PMP application support was a bonus I didn't expect. Highly recommended!",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "8 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "12 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "4 seats left", urgent: true },
];

const FAQS = [
  { q: "What are the eligibility requirements for PMP?", a: "PMI requires either a 4-year degree with 36 months of project experience + 35 contact hours, or a high school diploma with 60 months of project experience + 35 contact hours. Our course provides the 35 required contact hours." },
  { q: "What is the total course duration?", a: "The course is 3 months (~65 days). This includes all 7 modules and 5 full-length 180-question mock exams. All sessions are recorded on LMS." },
  { q: "What roles can I target after getting PMP certified?", a: "Project Manager, Senior Project Manager, IT Project Manager, Program Manager, Delivery Manager, Scrum Master, and Project Management Consultant across IT, BFSI, pharma, construction, and consulting." },
  { q: "Is placement 100% guaranteed?", a: "We provide 100% placement assistance — resume building, mock interviews, and direct referrals to 500+ hiring partners including IT services firms, consulting companies and product companies." },
  { q: "Do you help with the PMP application process?", a: "Yes! We provide complete PMP application assistance — helping you document your project experience, write project descriptions, and submit the PMI application correctly to avoid rejection." },
  { q: "What is the course fee and EMI options?", a: "The course fee is ₹38,000 (inclusive of 35 PDU certificate, PMBOK guide, 5 mock exams & placement support). EMI starts from ₹7,000/month. No cost EMI on select cards." },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-amber-300 shadow-sm" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-amber-500 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-amber-50/40 border-t border-amber-100">
          <p className="text-xs text-amber-700 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{item.q}</span>
        <span className={`text-xl font-light text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">{item.a}</div>}
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
        body: JSON.stringify({ ...form, courseName: "PMP", type: "demo" }),
      });
    } catch (_) {}
    setLoading(false); setDone(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {done ? (
          <div className="p-8 text-center"><div className="text-5xl mb-4">🎓</div><h3 className="text-xl font-black text-gray-900 mb-2">Demo Booked!</h3><p className="text-gray-500 text-sm mb-6">Our counsellor will contact you within 2 hours to confirm your free demo session.</p><button onClick={onClose} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700">Got it!</button></div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900">PMP</h3><p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p></div>
            <div className="space-y-4">
              {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" }].map(({ label, key, type, placeholder }) => (
                <div key={key}><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label><input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              ))}
              <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Preferred Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Online</option><option>Offline</option><option>Hybrid</option></select></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">{loading ? "Submitting..." : "Book Free Demo Class →"}</button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EnrollModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", batch: "Weekday Batch", mode: "Online" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: "PMP", fee: "₹38,000", type: "enrollment" }),
      });
    } catch (_) {}
    setLoading(false);
    setDone(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {done ? (<div className="p-8 text-center"><div className="text-5xl mb-4">🎉</div><h3 className="text-xl font-black text-gray-900 mb-2">You're in!</h3><p className="text-gray-500 text-sm mb-6">Our counsellor will call you within 2 hours.</p><button onClick={onClose} className="bg-amber-500 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-amber-600">Got it!</button></div>) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-1">Enroll Now</p><h3 className="text-xl font-black text-gray-900">PMP Certification Course</h3><p className="text-sm text-gray-500 mt-1">⚡ Course Fee: <span className="font-bold text-blue-600">₹38,000</span> · EMI from ₹7,000/mo</p></div>
            <div className="space-y-4">
              {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" }].map(({ label, key, type, placeholder }) => (<div key={key}><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label><input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Batch</label><select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"><option>Weekday Batch</option><option>Weekend Batch</option><option>Fast Track</option></select></div>
                <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"><option>Online</option><option>Offline</option><option>Hybrid</option></select></div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">{loading ? "Submitting..." : "Book Free Demo Class →"}</button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PMPPage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <section className="bg-gradient-to-br from-slate-900 via-amber-950 to-yellow-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #78716c 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🏅 PMI Recognized</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">PMP Certification</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">35 PDU Hours</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                PMP Certification<br /><span className="text-yellow-300">Training Course</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-amber-200">in Hyderabad</span>
              </h1>
              <p className="text-amber-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">Master PMBOK 7, Agile, Hybrid PM, EVM, Risk Management and all PMP exam domains. Get your 35 PMI contact hours, crack the PMP on your first attempt, and advance to senior project management roles.</p>
              <div className="flex flex-wrap gap-6 mb-8">{[{ val: "4.9★", label: "Rating" }, { val: "1,800+", label: "Students" }, { val: "3 Months", label: "Duration" }, { val: "95%", label: "Pass Rate" }].map((s) => (<div key={s.label}><p className="text-xl font-black text-yellow-300">{s.val}</p><p className="text-xs text-amber-200 font-medium">{s.label}</p></div>))}</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">🚀 Enroll Now — ₹35,000</button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">📥 Download Syllabus</button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-amber-200"><span>✅ 35 PDU Contact Hours</span><span>✅ PMP Application Support</span><span>✅ Free Demo Class</span></div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.9</span><span className="text-xs text-gray-400">(1,800+ reviews)</span></div>
                <p className="text-3xl font-black text-amber-600 mb-1">₹35,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">{["📅 Next batch starts April 14", "⏱ 3 months duration", "🏅 35 PDU Contact Hours", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 5 Full Mock Exams"].map((item) => (<p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>))}</div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
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
          <div><p className="text-xl font-black text-amber-600 leading-none">₹35,000</p><p className="text-xs text-gray-400">EMI from ₹7,000/mo</p></div>
          <button onClick={() => setShowEnroll(true)} className="bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2"><span className="w-1 h-7 bg-amber-500 rounded-full inline-block"></span>Course Overview</h2><div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-6"><p className="text-gray-700 text-base leading-relaxed mb-4">The <strong>PMP Certification Course</strong> at Great Hire is a comprehensive 3-month exam-preparation and project management mastery program. We cover all three PMP exam domains — People, Process, and Business Environment — with equal focus on predictive and agile methodologies.</p><p className="text-gray-700 text-base leading-relaxed">With 35 PMI-approved contact hours, 5 full 180-question mock exams, complete PMP application assistance, and placement support through Great Hire's 500+ company network, this is the most complete PMP program in Hyderabad.</p></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[{ icon: "⏱", label: "Duration", val: "3 Months" }, { icon: "📚", label: "Modules", val: "7 Modules" }, { icon: "🏅", label: "PDU Hours", val: "35 Hours" }, { icon: "🌐", label: "Language", val: "English / Telugu" }].map((item) => (<div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm"><p className="text-2xl mb-1">{item.icon}</p><p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p><p className="text-sm font-bold text-gray-900">{item.val}</p></div>))}</div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-amber-500 rounded-full inline-block"></span>Why This Course?</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{HIGHLIGHTS.map((h) => (<div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-amber-200 hover:shadow-sm transition-all group"><div className="w-11 h-11 bg-amber-50 group-hover:bg-amber-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">{h.icon}</div><div><p className="font-bold text-gray-900 text-sm mb-0.5">{h.title}</p><p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p></div></div>))}</div></section>
            <section><div className="flex items-center justify-between mb-6"><h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2"><span className="w-1 h-7 bg-amber-500 rounded-full inline-block"></span>Course Curriculum</h2><span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 10 weeks</span></div><div className="space-y-3">{CURRICULUM.map((item, i) => (<AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />))}</div><div className="mt-4 text-center"><button className="text-amber-600 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button></div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-amber-500 rounded-full inline-block"></span>Tools & Technologies</h2><div className="flex flex-wrap gap-3">{TOOLS.map((t) => (<span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}><span className="text-base">{t.icon}</span>{t.name}</span>))}</div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-amber-500 rounded-full inline-block"></span>Upcoming Batches</h2><div className="space-y-4">{BATCHES.map((b) => (<div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-amber-300 bg-amber-50" : "border-gray-200 bg-white"}`}><div className="flex items-center gap-4"><div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-amber-100" : "bg-gray-100"}`}>📅</div><div><div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-gray-900">{b.type}</p>{b.urgent && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Filling Fast</span>}</div><p className="text-sm text-gray-500 mt-0.5">{b.schedule} · {b.time} · {b.mode}</p></div></div><div className="flex items-center gap-3 sm:flex-col sm:items-end"><p className="text-xs text-gray-500 font-medium">{b.seats}</p><button onClick={() => setShowEnroll(true)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button></div></div>))}</div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-amber-500 rounded-full inline-block"></span>Student Reviews</h2><div className="grid grid-cols-1 sm:grid-cols-3 gap-5">{TESTIMONIALS.map((t) => (<div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"><Stars count={t.rating} /><p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">"{t.text}"</p><div className="flex items-center gap-3 pt-3 border-t border-gray-100"><div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div><div><p className="text-sm font-bold text-gray-900">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div></div></div>))}</div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-amber-500 rounded-full inline-block"></span>Frequently Asked Questions</h2><div className="space-y-3">{FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}</div></section>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.9</span><span className="text-xs text-gray-400">(1,800+)</span></div>
                <p className="text-3xl font-black text-amber-600 leading-none mb-1">₹35,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700">{["📅 Next batch: April 14, 2025", "⏱ Duration: 3 months", "🏅 35 PDU Contact Hours", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 5 Full Mock Exams (180Q)", "👥 Batch size: 15 students"].map((item) => (<p key={item} className="flex items-start gap-2">{item}</p>))}</div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p><p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-amber-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <button className="bg-white text-amber-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors">Share & Earn</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-amber-600 to-yellow-700 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Earn Your PMP Certification Today</h2>
          <p className="text-amber-100 text-base sm:text-lg mb-8 leading-relaxed">Join 1,800+ professionals who've advanced their PM careers with Great Hire's PMP Certification program. 95% first-attempt pass rate!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnroll(true)} className="bg-white hover:bg-amber-50 text-amber-700 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
          </div>
        </div>
      </section>
      <Footer />
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {showEnroll && <EnrollModal onClose={() => setShowEnroll(false)} />}
    </div>
  );
}
