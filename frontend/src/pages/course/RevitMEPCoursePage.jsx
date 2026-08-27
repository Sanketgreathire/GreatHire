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
    title: "BIM Fundamentals & Revit Interface",
    duration: "1 Week",
    topics: [
      "Introduction to BIM – Concepts & Levels of Detail",
      "Revit Interface – Ribbons, Browser, Properties",
      "Revit File Types – RVT, RFA, RTE",
      "Project Setup – Units, Levels, Grids",
      "Navigation & View Controls",
      "Basic Families & System Types",
    ],
  },
  {
    module: "Module 2",
    title: "Revit MEP – Mechanical (HVAC)",
    duration: "3 Weeks",
    topics: [
      "Mechanical System Basics – HVAC Components",
      "Air Terminals – Supply & Return Diffusers",
      "Duct Routing – Rectangular, Round & Oval",
      "Duct Fittings – Elbows, Tees, Transitions",
      "Mechanical Equipment – AHU, FCU, Chillers",
      "Duct Sizing & Pressure Drop Calculations",
      "Mechanical Spaces & Zone Setup",
    ],
  },
  {
    module: "Module 3",
    title: "Revit MEP – Electrical",
    duration: "3 Weeks",
    topics: [
      "Electrical Systems – Power, Lighting, Low Voltage",
      "Lighting Fixtures – Placement & Calculation",
      "Power Outlets, Panels & Distribution Boards",
      "Cable Tray & Conduit Routing",
      "Electrical Circuits & Panel Schedules",
      "Load Calculations & Reports",
      "Emergency & Fire Alarm Systems",
    ],
  },
  {
    module: "Module 4",
    title: "Revit MEP – Plumbing & Fire Protection",
    duration: "2 Weeks",
    topics: [
      "Plumbing Fixtures – Sinks, WCs, Floor Drains",
      "Domestic Water Supply & Hot Water Systems",
      "Drainage & Vent Piping Systems",
      "Fire Protection – Sprinkler Systems",
      "Fire Suppression Pipe Routing",
      "Slope Settings for Drainage Pipes",
    ],
  },
  {
    module: "Module 5",
    title: "Coordination, Clash Detection & BIM",
    duration: "2 Weeks",
    topics: [
      "Linked Models – Architectural & Structural",
      "Clash Detection Workflow",
      "Navisworks Manage – Clash Testing",
      "RCP & 3D Coordination Views",
      "COBie Data & BIM Handover",
      "IFC Export & Interoperability",
    ],
  },
  {
    module: "Module 6",
    title: "Documentation, Sheets & Projects",
    duration: "2 Weeks",
    topics: [
      "Views & Sheets Setup",
      "Schedules – Equipment, Fixtures, Material Takeoffs",
      "Legends & Drawing Tags",
      "Printing & PDF Export",
      "Full MEP Building Project",
      "Resume, Portfolio & Interview Prep",
    ],
  },
];

const TOOLS = [
  { name: "Revit MEP 2025", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", icon: "🏗️" },
  { name: "Revit Architecture", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300", icon: "🏛️" },
  { name: "Navisworks", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", icon: "🔍" },
  { name: "AutoCAD MEP", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", icon: "📐" },
  { name: "BIM 360", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300", icon: "☁️" },
  { name: "Dynamo", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300", icon: "⚡" },
  { name: "Insight 360", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", icon: "💡" },
  { name: "IFC Viewer", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300", icon: "📦" },
  { name: "Hevacomp", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", icon: "🌡️" },
  { name: "SketchUp Pro", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", icon: "🧊" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Placement Assistance", desc: "Direct referrals to MEP consultancies, construction firms & BIM companies in Great Hire's network." },
  { icon: "🛠️", title: "Full MEP Building Project", desc: "Design complete MEP systems for a real building — mechanical, electrical & plumbing — as your portfolio piece." },
  { icon: "👨‍🏫", title: "Expert MEP Trainers", desc: "Learn from BIM professionals with 10+ years in MEP design and coordination." },
  { icon: "📋", title: "Weekly Design Exercises", desc: "Practical coordination tasks and industry drawings to build real project confidence." },
  { icon: "🎖️", title: "Dual Certification", desc: "Great Hire + IIT Guwahati E&ICT Academy recognized certificate. Autodesk ACP exam guidance included." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options suited to working MEP professionals." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to all Revit project files, recorded sessions, and BIM interview prep." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated mentor for technical doubts, project review and career guidance." },
];

const TESTIMONIALS = [
  {
    name: "Harish Babu",
    role: "MEP BIM Engineer @ Jacobs India",
    avatar: "HB",
    color: "bg-blue-600",
    rating: 5,
    text: "The Revit MEP training at Great Hire is the most comprehensive I've seen. The HVAC duct routing and clash detection modules directly helped me at Jacobs. Excellent training!",
  },
  {
    name: "Lavanya Reddy",
    role: "Electrical BIM Modeller @ Atkins",
    avatar: "LR",
    color: "bg-indigo-500",
    rating: 5,
    text: "Went from basic AutoCAD knowledge to full Revit MEP expertise in just 3 months. The panel schedule and circuit training was incredibly practical and job-ready.",
  },
  {
    name: "Naveen Kumar",
    role: "MEP Coordinator @ Shapoorji Pallonji",
    avatar: "NK",
    color: "bg-teal-500",
    rating: 5,
    text: "The Navisworks clash detection training was the game changer. My employer was impressed that I already knew the complete BIM coordination workflow before joining.",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "7 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "9:00 AM – 12:00 PM", mode: "Online + Offline", seats: "10 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "5 seats left", urgent: true },
];

const FAQS = [
  {
    q: "Who is this Revit MEP course designed for?",
    a: "This course is ideal for mechanical, electrical, and civil engineers, diploma holders, and architecture graduates looking to specialize in BIM-based MEP design and coordination. Prior AutoCAD knowledge is helpful but not mandatory.",
  },
  {
    q: "Which disciplines does the course cover?",
    a: "The course covers all three MEP disciplines — Mechanical (HVAC), Electrical (Power, Lighting, Low Voltage), and Plumbing/Fire Protection. You'll model complete building systems in all three.",
  },
  {
    q: "Is Navisworks clash detection included?",
    a: "Yes! Module 5 covers full BIM coordination including linked models, Navisworks clash detection and resolution, COBie data, and IFC export — which are essential skills for MEP BIM roles.",
  },
  {
    q: "What job profiles can I target after this course?",
    a: "MEP BIM Modeller/Engineer, BIM Coordinator, MEP Designer, BIM Consultant, MEP Drafter, and Revit Trainer. Salaries range from ₹3.5L to ₹9L depending on experience and company.",
  },
  {
    q: "What certifications will I receive?",
    a: "You'll receive a Great Hire Training Certificate. We also provide guidance for the Autodesk Certified Professional – Revit MEP exam.",
  },
  {
    q: "What is the course fee?",
    a: "The course fee is ₹38,000 (inclusive of Revit student license, all project files, Navisworks access, and placement support). EMI options from ₹7,000/month are available.",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-teal-300 dark:border-teal-600 shadow-sm" : "border-gray-200 dark:border-gray-700"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-teal-600 text-white rotate-180" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-teal-50/40 dark:bg-gray-800/80 border-t border-teal-100 dark:border-gray-700">
          <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
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

function DemoModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", mode: "Online" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = async () => {
    let nameErr = "";
    let emailErr = "";
    let phoneErr = "";

    if (!form.name.trim()) {
      nameErr = "Full name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
      nameErr = "Full name can only contain letters and spaces.";
    }

    if (!form.email.trim()) {
      emailErr = "Email address is required.";
    }

    if (!form.phone.trim()) {
      phoneErr = "Phone number is required.";
    }

    if (nameErr || emailErr || phoneErr) {
      setErrors({ name: nameErr, email: emailErr, phone: phoneErr });
      return;
    }

    setErrors({ name: "", email: "", phone: "" });
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/enquiry`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: "Revit MEP", type: "demo" }),
      });
      setLoading(false);
      setDone(true);
    } catch (_) {
      setLoading(false);
      setErrors({ name: "", email: "", phone: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-100 dark:border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-300 text-xl font-bold">×</button>
        {done ? (
          <div className="p-8 text-center"><div className="text-5xl mb-4">🎓</div><h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Demo Booked!</h3><p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Our counsellor will contact you within 2 hours to confirm your free demo session.</p><button onClick={onClose} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-rose-700">Got it!</button></div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700"><p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900 dark:text-white">Revit MEP</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">🎯 Free demo class — no commitment required!</p></div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input
                    required type={type} placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => {
                      if (key === "name") {
                        const filteredValue = e.target.value.replace(/[^A-Za-z\s]/g, "");
                        setForm({ ...form, name: filteredValue });
                      } else {
                        setForm({ ...form, [key]: e.target.value });
                      }
                    }}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white ${
                      errors[key] ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                  {errors[key] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[key]}</p>}
                </div>
              ))}
              <div><label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Preferred Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"><option className="dark:bg-gray-800">Online</option><option className="dark:bg-gray-800">Offline</option><option className="dark:bg-gray-800">Hybrid</option></select></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">{loading ? "Submitting..." : "Book Free Demo Class →"}</button>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RevitMEPCoursePage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-900 dark:from-gray-950 dark:via-teal-950 dark:to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #14b8a6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0891b2 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🏗️ BIM Specialist</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">MEP Engineering</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Job Guaranteed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                Revit MEP<br />
                <span className="text-yellow-300">Course</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-teal-200">in Hyderabad</span>
              </h1>
              <p className="text-teal-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master Revit MEP for Mechanical (HVAC), Electrical & Plumbing systems. Learn BIM coordination, Navisworks clash detection & get placed in top MEP consultancies and construction companies.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[{ val: "4.9★", label: "Rating" }, { val: "2,600+", label: "Students" }, { val: "3 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (
                  <div key={s.label}><p className="text-xl font-black text-yellow-300">{s.val}</p><p className="text-xs text-teal-200 font-medium">{s.label}</p></div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">🚀 Enroll Now — ₹38,000</button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">📥 Download Syllabus</button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-teal-200">
                <span>✅ No Cost EMI Available</span>
                <span>✅ IIT Guwahati Certified</span>
                <span>✅ Free Demo Class</span>
              </div>
            </div>

            {/* Top Right Card (Desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700 dark:text-gray-200">4.9</span><span className="text-xs text-gray-400">(2,600+ reviews)</span></div>
                <p className="text-3xl font-black text-teal-600 dark:text-teal-400 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 dark:text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">
                  {["📅 Next batch starts April 28", "⏱ 3 months duration", "🎖 Dual Certification", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Revit + Navisworks License"].map((item) => (
                    <p key={item} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
                  Book Free Demo Class
                </button>
                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to a Counsellor</button>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">🔒 Secure payment · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bar */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div><p className="text-xl font-black text-teal-600 dark:text-teal-400 leading-none">₹38,000</p><p className="text-xs text-gray-400 dark:text-gray-400">EMI from ₹7,000/mo</p></div>
          <button onClick={() => setShowEnroll(true)} className="bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            
            {/* Overview */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>Course Overview
              </h2>
              <div className="bg-teal-50 dark:bg-gray-800/60 border border-teal-100 dark:border-gray-700 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">The <strong className="text-gray-900 dark:text-white">Revit MEP Course</strong> at Great Hire is a 3-month BIM-focused program covering complete MEP (Mechanical, Electrical & Plumbing) design using Autodesk Revit — the most in-demand tool in the global construction and infrastructure industry.</p>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">From HVAC duct routing to electrical panel schedules and plumbing drainage systems, you'll design complete building services for a real project, preparing you for immediate deployment at any MEP firm.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ icon: "⏱", label: "Duration", val: "3 Months" }, { icon: "📚", label: "Modules", val: "6 Modules" }, { icon: "🖥", label: "Mode", val: "Online + Offline" }, { icon: "🌐", label: "Language", val: "English / Telugu" }].map((item) => (
                  <div key={item.label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl mb-1">{item.icon}</p><p className="text-xs text-gray-400 dark:text-gray-400 font-medium mb-0.5">{item.label}</p><p className="text-sm font-bold text-gray-900 dark:text-white">{item.val}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>Why This Course?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="flex gap-4 p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-sm transition-all group">
                    <div className="w-11 h-11 bg-teal-50 dark:bg-gray-700 group-hover:bg-teal-100 dark:group-hover:bg-gray-600 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">{h.icon}</div>
                    <div><p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">{h.title}</p><p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{h.desc}</p></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 dark:text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 13 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => (
                  <AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />
                ))}
              </div>
              <div className="mt-4 text-center"><button className="text-teal-600 dark:text-teal-400 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button></div>
            </section>

            {/* Tools */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((t) => (
                  <span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}><span className="text-base">{t.icon}</span>{t.name}</span>
                ))}
              </div>
            </section>

            {/* Upcoming Batches */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>Upcoming Batches
              </h2>
              <div className="space-y-4">
                {BATCHES.map((b) => (
                  <div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-teal-300 dark:border-teal-600 bg-teal-50/50 dark:bg-gray-800/80" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-teal-100 dark:bg-teal-900/50" : "bg-gray-100 dark:bg-gray-700"}`}>📅</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 dark:text-white">{b.type}</p>
                          {b.urgent && <span className="text-xs bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 font-bold px-2 py-0.5 rounded-full">Filling Fast</span>}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{b.schedule} · {b.time} · {b.mode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{b.seats}</p>
                      <button onClick={() => setShowEnroll(true)} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>Student Reviews
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <Stars count={t.rating} />
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-3 mb-4 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div>
                      <div><p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p><p className="text-xs text-gray-400 dark:text-gray-400">{t.role}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>Frequently Asked Questions
              </h2>
              <div className="space-y-3">{FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}</div>
            </section>
          </div>

          {/* Sticky Sidebar Right (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700 dark:text-gray-200">4.9</span><span className="text-xs text-gray-400">(2,600+)</span></div>
                <p className="text-3xl font-black text-teal-600 dark:text-teal-400 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 dark:text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700 dark:text-gray-300">
                  {["📅 Next batch: April 28, 2025", "⏱ Duration: 3 months", "🎖 Dual Certification", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Revit + Navisworks License", "👥 Batch size: 12 students"].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl text-sm transition-colors">📥 Download Syllabus</button>
                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-teal-600 to-cyan-700 dark:from-teal-700 dark:to-cyan-800 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-teal-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("🏗️ Check out this Revit MEP Course at Great Hire! Master HVAC, Electrical & Plumbing BIM with 100% placement support.\n" + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-teal-700 font-bold text-xs px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors">
                  Share & Earn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA Banner */}
      <section className="bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-800 dark:to-cyan-800 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Build the Future with Revit MEP</h2>
          <p className="text-teal-100 text-base sm:text-lg mb-8 leading-relaxed">Join 2,600+ MEP engineers who've landed roles at Jacobs, Atkins, Shapoorji & more through Great Hire's Revit MEP course.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
          </div>
        </div>
      </section>

      <Footer/>
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      <Suspense fallback={null}>
        {showEnroll && <CourseEnrollModal onClose={() => setShowEnroll(false)} courseName="Revit MEP" amount={38000} accentColor="indigo" />}
        {showCounsellor && <TalkToCounsellorModal courseName="Revit MEP" onClose={() => setShowCounsellor(false)} />}
      </Suspense>
    </div>
  );
}