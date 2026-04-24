import CourseEnrollModal from "@/components/CourseEnrollModal";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";
import TalkToCounsellorModal from "@/components/TalkToCounsellorModal";


const CURRICULUM = [
  {
    module: "Module 1",
    title: "SAP Overview & MM Introduction",
    duration: "1 Week",
    topics: [
      "Introduction to ERP & SAP Ecosystem",
      "SAP S/4HANA Architecture & Navigation",
      "Organizational Structures in SAP MM",
      "Company Code, Plant, Storage Location, Purchasing Org",
      "Material Master – Views, Fields & Data Creation",
      "Vendor Master – General, Company Code, Purchasing Views",
    ],
  },
  {
    module: "Module 2",
    title: "Procurement Process (Procure-to-Pay)",
    duration: "2 Weeks",
    topics: [
      "Purchase Requisition (PR) – Creation & Approval",
      "Request for Quotation (RFQ) & Quotation Comparison",
      "Purchase Order (PO) – Creation, Types & Release Strategy",
      "Goods Receipt (GR) – MIGO Transaction",
      "Invoice Verification – MIRO & LIV Process",
      "Payment Processing & Vendor Reconciliation",
      "Procure-to-Pay Cycle End-to-End",
    ],
  },
  {
    module: "Module 3",
    title: "Inventory Management",
    duration: "2 Weeks",
    topics: [
      "Goods Movement Types – 101, 201, 301, 311, 601",
      "Stock Types – Unrestricted, Quality, Blocked",
      "Transfer Posting – Plant to Plant, SLoc to SLoc",
      "Physical Inventory – MI01, MI04, MI07",
      "Batch Management & Serial Number Tracking",
      "Special Stocks – Consignment, Subcontracting",
      "Stock Valuation – Moving Average & Standard Price",
    ],
  },
  {
    module: "Module 4",
    title: "Master Data & Vendor Management",
    duration: "1 Week",
    topics: [
      "Material Types & Material Groups",
      "Purchasing Info Records (PIR)",
      "Source Lists & Quota Arrangements",
      "Vendor Evaluation & Rating",
      "Contract & Scheduling Agreement",
      "Outline Agreements – Value vs Quantity Contracts",
    ],
  },
  {
    module: "Module 5",
    title: "Valuation, Account Determination & Special Processes",
    duration: "2 Weeks",
    topics: [
      "Valuation Class & Account Category Reference",
      "Automatic Account Determination (OBYC)",
      "Split Valuation",
      "Subcontracting Process (541 Movement)",
      "Consignment Process",
      "Third-Party & Pipeline Procurement",
      "Inter-Company Stock Transfer",
    ],
  },
  {
    module: "Module 6",
    title: "SAP S/4HANA MM & Reporting",
    duration: "1 Week",
    topics: [
      "S/4HANA Fiori Apps for MM",
      "Material Ledger in S/4HANA",
      "Stock Overview – MMBE Transaction",
      "Purchase Order Reports & Tracking",
      "Goods Movement Analysis",
      "SAP Standard Reports & Custom Reports (ALV)",
    ],
  },
  {
    module: "Module 7",
    title: "Real-World Projects & Interview Prep",
    duration: "3 Weeks",
    topics: [
      "End-to-End P2P Implementation Project",
      "Inventory Management Scenario Simulation",
      "SAP MM Configuration Workbook",
      "Integration with FI, SD & PP Modules",
      "Resume Building & LinkedIn Optimization",
      "Mock Interviews & SAP Scenario Q&A",
    ],
  },
];

const TOOLS = [
  { name: "SAP S/4HANA", color: "bg-blue-100 text-blue-700", icon: "🔷" },
  { name: "SAP ECC 6.0", color: "bg-sky-100 text-sky-700", icon: "🔹" },
  { name: "SAP Fiori", color: "bg-cyan-100 text-cyan-700", icon: "📱" },
  { name: "MIGO", color: "bg-green-100 text-green-700", icon: "📦" },
  { name: "MIRO", color: "bg-emerald-100 text-emerald-700", icon: "🧾" },
  { name: "ME21N/ME51N", color: "bg-teal-100 text-teal-700", icon: "🛒" },
  { name: "MMBE", color: "bg-indigo-100 text-indigo-700", icon: "📊" },
  { name: "SAP GUI", color: "bg-blue-100 text-blue-800", icon: "🖥️" },
  { name: "SAP SRM", color: "bg-orange-100 text-orange-700", icon: "🤝" },
  { name: "MS Excel", color: "bg-green-100 text-green-800", icon: "📋" },
  { name: "SAP ALV Reports", color: "bg-amber-100 text-amber-700", icon: "📈" },
  { name: "Material Ledger", color: "bg-rose-100 text-rose-700", icon: "💰" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Direct referrals to 500+ hiring partners including SAP implementation firms & MNCs." },
  { icon: "🔷", title: "SAP S/4HANA Access", desc: "Hands-on practice on live SAP S/4HANA and ECC systems — not simulations." },
  { icon: "👨‍🏫", title: "SAP Certified Trainers", desc: "Learn from SAP MM consultants with 10+ years of real implementation experience." },
  { icon: "📋", title: "End-to-End P2P Project", desc: "Implement a complete Procure-to-Pay cycle from scratch on a real SAP system." },
  { icon: "🎖️", title: "Dual Certification", desc: "Great Hire + IIT Guwahati E&ICT Academy recognized certificate." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options to suit your schedule." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to recorded sessions, configuration guides & scenario documents." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated SAP MM mentor for scenario practice and client interview prep." },
];

const TESTIMONIALS = [
  {
    name: "Ramesh Babu",
    role: "SAP MM Consultant @ Infosys",
    avatar: "RB",
    color: "bg-blue-500",
    rating: 5,
    text: "The P2P cycle and inventory management modules are incredibly detailed. I practiced on a real S/4HANA system daily. Got placed at Infosys BPO as an SAP MM Consultant in 50 days!",
  },
  {
    name: "Sunita Reddy",
    role: "SAP Functional Analyst @ TCS",
    avatar: "SR",
    color: "bg-teal-500",
    rating: 5,
    text: "The account determination and split valuation sessions were phenomenal — concepts that confuse most beginners were explained clearly with real business scenarios. Highly recommended!",
  },
  {
    name: "Prashanth Kumar",
    role: "SAP MM Lead @ HCL",
    avatar: "PK",
    color: "bg-cyan-500",
    rating: 5,
    text: "Best SAP MM training in Hyderabad. The integration with FI and SD modules gave me a complete functional picture. Cracked HCL's SAP practice round on the first attempt!",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "6 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "10 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "3 seats left", urgent: true },
];

const FAQS = [
  { q: "Do I need any SAP or IT background to join?", a: "No technical background is required. We start from SAP basics, organizational structures, and navigation. Anyone with a supply chain, procurement, or commerce background will find this highly relatable." },
  { q: "What is the total course duration?", a: "The course is 3 months (~65 days). All sessions are recorded and available on LMS so you can revise configuration scenarios anytime." },
  { q: "What roles can I target after this course?", a: "You can target roles such as SAP MM Functional Consultant, SAP MM Analyst, SAP SCM Consultant, Procurement Functional Consultant, and SAP S/4HANA MM Specialist." },
  { q: "Is placement 100% guaranteed?", a: "We provide 100% placement assistance — resume building, mock interviews, and direct referrals to SAP implementation partners, MNCs, and BPO firms in our 500+ hiring network." },
  { q: "What certifications will I receive?", a: "You'll receive a Great Hire Training Certificate and an IIT Guwahati E&ICT Academy recognized certificate. We also prepare you for SAP C_TSCM52_67 certification." },
  { q: "What is the course fee and EMI options?", a: "The course fee is ₹38,000 (inclusive of SAP system access, materials, projects & placement support). EMI starts from ₹7,000/month. No cost EMI on select cards." },
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
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-cyan-300 shadow-sm" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-cyan-100 text-cyan-700 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-cyan-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-cyan-50/40 border-t border-cyan-100">
          <p className="text-xs text-cyan-700 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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
        body: JSON.stringify({ ...form, courseName: "SAP MM", type: "demo" }),
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
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900">SAP MM</h3><p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p></div>
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


export default function SAPMMPage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
       <Navbar /> 
      <section className="bg-gradient-to-br from-slate-900 via-cyan-950 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 High Demand</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">SAP Materials Management</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Job Guaranteed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                SAP MM Course<br /><span className="text-yellow-300">with S/4HANA</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-cyan-200">in Hyderabad</span>
              </h1>
              <p className="text-cyan-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">Master SAP Materials Management — Procure-to-Pay, Inventory Management, Vendor Evaluation, Account Determination and SAP Fiori on live S/4HANA systems. Get placed as an SAP MM Consultant at top firms.</p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[{ val: "4.8★", label: "Rating" }, { val: "1,100+", label: "Students" }, { val: "3 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (<div key={s.label}><p className="text-xl font-black text-yellow-300">{s.val}</p><p className="text-xs text-cyan-200 font-medium">{s.label}</p></div>))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">🚀 Enroll Now — ₹38,000</button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">📥 Download Syllabus</button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-cyan-200"><span>✅ No Cost EMI Available</span><span>✅ SAP C_TSCM52 Cert Prep</span><span>✅ Free Demo Class</span></div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.8</span><span className="text-xs text-gray-400">(1,100+ reviews)</span></div>
                <p className="text-3xl font-black text-cyan-600 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">{["📅 Next batch starts April 14", "⏱ 3 months duration", "🎖 Dual Certification", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Live SAP System Access"].map((item) => (<p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>))}</div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
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
          <div><p className="text-xl font-black text-cyan-600 leading-none">₹38,000</p><p className="text-xs text-gray-400">EMI from ₹7,000/mo</p></div>
          <button onClick={() => setShowEnroll(true)} className="bg-cyan-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2"><span className="w-1 h-7 bg-cyan-600 rounded-full inline-block"></span>Course Overview</h2>
              <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-base leading-relaxed mb-4">The <strong>SAP MM Course</strong> at Great Hire is a comprehensive 3-month job-oriented program covering the complete Materials Management module — from organizational structures and master data to end-to-end Procure-to-Pay implementation on a live SAP S/4HANA system.</p>
                <p className="text-gray-700 text-base leading-relaxed">With scenario-based learning, live system access, and direct placement support through Great Hire's 500+ company network, this is Hyderabad's most hands-on SAP MM training.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[{ icon: "⏱", label: "Duration", val: "3 Months" }, { icon: "📚", label: "Modules", val: "7 Modules" }, { icon: "🖥", label: "Mode", val: "Online + Offline" }, { icon: "🌐", label: "Language", val: "English / Telugu" }].map((item) => (<div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm"><p className="text-2xl mb-1">{item.icon}</p><p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p><p className="text-sm font-bold text-gray-900">{item.val}</p></div>))}</div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-cyan-600 rounded-full inline-block"></span>Why This Course?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{HIGHLIGHTS.map((h) => (<div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-cyan-200 hover:shadow-sm transition-all group"><div className="w-11 h-11 bg-cyan-50 group-hover:bg-cyan-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">{h.icon}</div><div><p className="font-bold text-gray-900 text-sm mb-0.5">{h.title}</p><p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p></div></div>))}</div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-6"><h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2"><span className="w-1 h-7 bg-cyan-600 rounded-full inline-block"></span>Course Curriculum</h2><span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 12 weeks</span></div>
              <div className="space-y-3">{CURRICULUM.map((item, i) => (<AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />))}</div>
              <div className="mt-4 text-center"><button className="text-cyan-600 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button></div>
            </section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-cyan-600 rounded-full inline-block"></span>Tools & Technologies</h2><div className="flex flex-wrap gap-3">{TOOLS.map((t) => (<span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}><span className="text-base">{t.icon}</span>{t.name}</span>))}</div></section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-cyan-600 rounded-full inline-block"></span>Upcoming Batches</h2>
              <div className="space-y-4">{BATCHES.map((b) => (<div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-cyan-300 bg-cyan-50" : "border-gray-200 bg-white"}`}><div className="flex items-center gap-4"><div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-cyan-100" : "bg-gray-100"}`}>📅</div><div><div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-gray-900">{b.type}</p>{b.urgent && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Filling Fast</span>}</div><p className="text-sm text-gray-500 mt-0.5">{b.schedule} · {b.time} · {b.mode}</p></div></div><div className="flex items-center gap-3 sm:flex-col sm:items-end"><p className="text-xs text-gray-500 font-medium">{b.seats}</p><button onClick={() => setShowEnroll(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button></div></div>))}</div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-cyan-600 rounded-full inline-block"></span>Student Reviews</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">{TESTIMONIALS.map((t) => (<div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"><Stars count={t.rating} /><p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">"{t.text}"</p><div className="flex items-center gap-3 pt-3 border-t border-gray-100"><div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div><div><p className="text-sm font-bold text-gray-900">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div></div></div>))}</div>
            </section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-cyan-600 rounded-full inline-block"></span>Frequently Asked Questions</h2><div className="space-y-3">{FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}</div></section>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.8</span><span className="text-xs text-gray-400">(1,100+)</span></div>
                <p className="text-3xl font-black text-cyan-600 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700">{["📅 Next batch: April 14, 2025", "⏱ Duration: 3 months", "🎖 Dual Certification", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Live SAP System Access", "👥 Batch size: 15 students"].map((item) => (<p key={item} className="flex items-start gap-2">{item}</p>))}</div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p><p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-cyan-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("📦 Check out this SAP MM Course at Great Hire! Master Procure-to-Pay on live S/4HANA with 100% placement support.\n" + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-cyan-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-cyan-50 transition-colors">
                  Share & Earn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-cyan-700 to-blue-700 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Start Your SAP MM Career Today</h2>
          <p className="text-cyan-100 text-base sm:text-lg mb-8 leading-relaxed">Join 1,100+ students who've built rewarding SAP careers with Great Hire's hands-on MM program.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
          </div>
        </div>
      </section>
      <Footer />
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {showEnroll && <CourseEnrollModal onClose={() => setShowEnroll(false)} courseName="SAP MM" amount={38000} accentColor="blue" />}
    </div>
  );
}
