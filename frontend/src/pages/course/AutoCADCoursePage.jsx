import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";

const CURRICULUM = [
  {
    module: "Module 1",
    title: "AutoCAD Interface & Fundamentals",
    duration: "1 Week",
    topics: [
      "AutoCAD Interface – Ribbons, Workspaces, CUI",
      "Drawing Setup – Units, Limits, Layers",
      "Coordinate Systems – Absolute, Relative, Polar",
      "Object Snap & Tracking Tools",
      "Basic Drawing Commands – Line, Circle, Arc",
      "Basic Editing – Copy, Move, Trim, Extend",
    ],
  },
  {
    module: "Module 2",
    title: "2D Drafting & Precision Drawing",
    duration: "3 Weeks",
    topics: [
      "Advanced Drawing Tools – Polyline, Spline, Ellipse",
      "Advanced Editing – Offset, Mirror, Array, Fillet",
      "Blocks, Groups & Attributes",
      "Hatch Patterns & Gradient Fills",
      "Dimensioning – Linear, Angular, Radial, Ordinate",
      "Geometric Tolerancing & GD&T Basics",
      "Text, Tables & Multi-Line Attributes",
    ],
  },
  {
    module: "Module 3",
    title: "Layers, Properties & Standards",
    duration: "1 Week",
    topics: [
      "Layer Management – States, Filters, Freeze/Lock",
      "Object Properties – Color, Linetype, Lineweight",
      "Drawing Standards – IS, BS, ISO Conventions",
      "Template Files & Drawing Setup Automation",
      "Design Center & Tool Palettes",
    ],
  },
  {
    module: "Module 4",
    title: "3D Modeling & Visualization",
    duration: "3 Weeks",
    topics: [
      "3D Workspace & UCS Management",
      "Solid Primitives – Box, Cylinder, Sphere, Cone",
      "Boolean Operations – Union, Subtract, Intersect",
      "Extrude, Revolve, Loft & Sweep",
      "3D Editing – Fillet, Chamfer, Shell",
      "Materials, Lighting & Rendering",
      "Isometric Drawing Basics",
    ],
  },
  {
    module: "Module 5",
    title: "Layouts, Printing & Plotting",
    duration: "1 Week",
    topics: [
      "Model Space vs Paper Space",
      "Layouts & Viewports Setup",
      "Plot Styles – CTB & STB Files",
      "Plotting to Scale",
      "PDF & DWF Export",
      "DXF & Industry File Formats",
    ],
  },
  {
    module: "Module 6",
    title: "Civil & Architectural Applications",
    duration: "2 Weeks",
    topics: [
      "Architectural Floor Plans & Site Plans",
      "Structural Drawings – Beams, Columns, Foundations",
      "Road & Drainage Layout Drawings",
      "Electrical & Plumbing Schematic Drawings",
      "Quantity Estimation from Drawings",
    ],
  },
  {
    module: "Module 7",
    title: "Projects & Certification Prep",
    duration: "2 Weeks",
    topics: [
      "Residential Building Drawing Project",
      "Mechanical Part Assembly Drawing",
      "Industrial Layout Drawing Project",
      "Portfolio Building & Presentation",
      "Autodesk Certified Professional Prep",
      "Mock Interviews & HR Round",
    ],
  },
];

const TOOLS = [
  { name: "AutoCAD 2025", color: "bg-red-100 text-red-700", icon: "📐" },
  { name: "AutoCAD LT", color: "bg-orange-100 text-orange-700", icon: "✏️" },
  { name: "AutoCAD Civil 3D", color: "bg-blue-100 text-blue-700", icon: "🏗️" },
  { name: "AutoCAD Architecture", color: "bg-purple-100 text-purple-700", icon: "🏛️" },
  { name: "Autodesk Inventor", color: "bg-yellow-100 text-yellow-700", icon: "⚙️" },
  { name: "Navisworks", color: "bg-teal-100 text-teal-700", icon: "🔍" },
  { name: "Revit Basics", color: "bg-indigo-100 text-indigo-700", icon: "🏠" },
  { name: "SketchUp", color: "bg-green-100 text-green-700", icon: "📦" },
  { name: "PDF Underlay", color: "bg-gray-100 text-gray-700", icon: "📄" },
  { name: "BricsCAD", color: "bg-pink-100 text-pink-700", icon: "🖊️" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Placement Assistance", desc: "Direct referrals to construction, infrastructure & manufacturing firms in Great Hire's network." },
  { icon: "🛠️", title: "Industry-Level Projects", desc: "Complete 3+ real-world drawings — residential, mechanical & infrastructure projects." },
  { icon: "👨‍🏫", title: "Expert Trainers", desc: "Learn from CAD professionals with 10+ years in civil, mechanical & architectural drafting." },
  { icon: "📋", title: "Weekly Drawing Challenges", desc: "Regular timed exercises and industry-standard drawing tests to build speed & accuracy." },
  { icon: "🎖️", title: "Dual Certification", desc: "Great Hire + IIT Guwahati E&ICT Academy recognized certificate. ACP exam guidance included." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options designed for working professionals." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to all drawing files, recorded sessions, and DWG project templates." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated mentor for project reviews and career guidance in your chosen domain." },
];

const TESTIMONIALS = [
  {
    name: "Suresh Kumar",
    role: "CAD Drafter @ L&T Construction",
    avatar: "SK",
    color: "bg-red-500",
    rating: 5,
    text: "Best AutoCAD training in Hyderabad! The civil drafting projects were exactly what L&T asked about in my technical interview. Got placed within 30 days of completing the course.",
  },
  {
    name: "Ananya Reddy",
    role: "Architectural Drafter @ Sterling Wilson",
    avatar: "AR",
    color: "bg-orange-500",
    rating: 5,
    text: "The 3D modeling module completely transformed how I approach architectural drawings. The trainer's industry experience shows in every session.",
  },
  {
    name: "Rajesh Goud",
    role: "Mechanical Design Engineer @ Bharat Forge",
    avatar: "RG",
    color: "bg-blue-500",
    rating: 5,
    text: "Comprehensive course covering both 2D drafting and 3D modeling. The GD&T and tolerancing training was something I hadn't seen in any other course.",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:30 AM – 9:30 AM", mode: "Online", seats: "8 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "9:00 AM – 12:00 PM", mode: "Online + Offline", seats: "11 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "5:30 PM – 8:30 PM", mode: "Offline", seats: "4 seats left", urgent: true },
];

const FAQS = [
  {
    q: "What AutoCAD version is used in training?",
    a: "We train on AutoCAD 2025, the latest version. We also cover features compatible with AutoCAD 2016–2024 since many companies use older versions. You'll get a student license during the course.",
  },
  {
    q: "Is this course for civil, mechanical, or architectural students?",
    a: "This course is designed to cover all disciplines. We teach universal AutoCAD skills first, then cover civil/architectural, mechanical, and electrical applications so you can choose your specialization.",
  },
  {
    q: "Do I need a laptop with specific configuration?",
    a: "You'll need a laptop or PC with Windows 10/11, 8GB RAM (16GB recommended), dedicated graphics, and at least 10GB free storage. We'll guide you with the setup during the first session.",
  },
  {
    q: "What job roles does this course lead to?",
    a: "CAD Drafter, CAD Designer, Structural Drafter, Architectural Drafter, Mechanical Design Engineer, Civil Drafter, and Drawing Engineer. Packages range from ₹2.5L to ₹6L for freshers.",
  },
  {
    q: "What certifications will I receive?",
    a: "You'll receive a Great Hire Training Certificate. We also provide guidance for the Autodesk Certified Professional (ACP) exam.",
  },
  {
    q: "What is the course fee?",
    a: "The course fee is ₹38,000 (inclusive of AutoCAD student license, all drawing files, and placement support). EMI options starting from ₹7,000/month are available.",
  },
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
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-orange-300 shadow-sm" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-orange-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-orange-50/40 border-t border-orange-100">
          <p className="text-xs text-orange-700 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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

function EnrollModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", batch: "Weekday Batch", mode: "Online" });
  const [done, setDone] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {done ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">You're in!</h3>
            <p className="text-gray-500 text-sm mb-6">Our counsellor will call you within 2 hours to confirm your batch.</p>
            <button onClick={onClose} className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-orange-700">Got it!</button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-1">Enroll Now</p>
              <h3 className="text-xl font-black text-gray-900">AutoCAD Course</h3>
              <p className="text-sm text-gray-500 mt-1">⚡ Limited seats — next batch starts soon!</p>
            </div>
            <div className="space-y-4">
              {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" }].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Batch</label>
                  <select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Weekday Batch</option><option>Weekend Batch</option><option>Fast Track</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Online</option><option>Offline</option><option>Hybrid</option>
                  </select>
                </div>
              </div>
              <button onClick={() => form.name && form.email && form.phone && setDone(true)} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1">Book Free Demo Class →</button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AutoCADCoursePage() {
  const [openModule, setOpenModule] = useState(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar/>
      <section className="bg-gradient-to-br from-slate-900 via-orange-950 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ef4444 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">📐 Industry Standard</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Civil & Mechanical</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Job Guaranteed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                AutoCAD<br />
                <span className="text-yellow-300">Course</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-orange-200">in Hyderabad</span>
              </h1>
              <p className="text-orange-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master 2D drafting, 3D modeling, Civil 3D, AutoCAD Architecture & more. Get certified and placed in top construction, infrastructure & manufacturing companies.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[{ val: "4.8★", label: "Rating" }, { val: "4,100+", label: "Students" }, { val: "3 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (
                  <div key={s.label}><p className="text-xl font-black text-yellow-300">{s.val}</p><p className="text-xs text-orange-200 font-medium">{s.label}</p></div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowModal(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">🚀 Enroll Now — ₹38,000</button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">📥 Download Syllabus</button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-orange-200">
                <span>✅ No Cost EMI Available</span>
                <span>✅ IIT Guwahati Certified</span>
                <span>✅ Free Demo Class</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.8</span><span className="text-xs text-gray-400">(4,100+ reviews)</span></div>
                <p className="text-3xl font-black text-orange-600 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">
                  {["📅 Next batch starts April 22", "⏱ 3 months duration", "🎖 Dual Certification", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 AutoCAD Student License"].map((item) => (
                    <p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowModal(true)} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">Book Free Demo Class</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to a Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure payment · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div><p className="text-xl font-black text-orange-600 leading-none">₹38,000</p><p className="text-xs text-gray-400">EMI from ₹7,000/mo</p></div>
          <button onClick={() => setShowModal(true)} className="bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-600 rounded-full inline-block"></span>Course Overview
              </h2>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-base leading-relaxed mb-4">The <strong>AutoCAD Course</strong> at Great Hire is a comprehensive 3-month job-oriented program covering 2D drafting, 3D modeling, and domain-specific applications for civil, mechanical, and architectural engineering.</p>
                <p className="text-gray-700 text-base leading-relaxed">With industry-standard drawing projects, Autodesk certification guidance, and direct placement support through Great Hire's 500+ company network, this course prepares you for a high-demand career in design and drafting.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ icon: "⏱", label: "Duration", val: "3 Months" }, { icon: "📚", label: "Modules", val: "7 Modules" }, { icon: "🖥", label: "Mode", val: "Online + Offline" }, { icon: "🌐", label: "Language", val: "English / Telugu" }].map((item) => (
                  <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl mb-1">{item.icon}</p><p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p><p className="text-sm font-bold text-gray-900">{item.val}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-600 rounded-full inline-block"></span>Why This Course?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all group">
                    <div className="w-11 h-11 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">{h.icon}</div>
                    <div><p className="font-bold text-gray-900 text-sm mb-0.5">{h.title}</p><p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p></div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-7 bg-orange-600 rounded-full inline-block"></span>Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 13 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => (
                  <AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />
                ))}
              </div>
              <div className="mt-4 text-center"><button className="text-orange-600 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button></div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-600 rounded-full inline-block"></span>Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((t) => (
                  <span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}><span className="text-base">{t.icon}</span>{t.name}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-600 rounded-full inline-block"></span>Upcoming Batches
              </h2>
              <div className="space-y-4">
                {BATCHES.map((b) => (
                  <div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-orange-100" : "bg-gray-100"}`}>📅</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{b.type}</p>
                          {b.urgent && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Filling Fast</span>}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{b.schedule} · {b.time} · {b.mode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p className="text-xs text-gray-500 font-medium">{b.seats}</p>
                      <button onClick={() => setShowModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-600 rounded-full inline-block"></span>Student Reviews
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
                <span className="w-1 h-7 bg-orange-600 rounded-full inline-block"></span>Frequently Asked Questions
              </h2>
              <div className="space-y-3">{FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}</div>
            </section>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.8</span><span className="text-xs text-gray-400">(4,100+)</span></div>
                <p className="text-3xl font-black text-orange-600 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700">
                  {["📅 Next batch: April 22, 2025", "⏱ Duration: 3 months", "🎖 Dual Certification", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 AutoCAD Student License", "👥 Batch size: 15 students"].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowModal(true)} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">Book Free Demo Class</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-orange-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <button className="bg-white text-orange-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">Share & Earn</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-orange-700 to-red-700 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Build Your CAD Career Today</h2>
          <p className="text-orange-100 text-base sm:text-lg mb-8 leading-relaxed">Join 4,100+ engineers and designers who've built careers at L&T, Bharat Forge & more with Great Hire's AutoCAD course.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowModal(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
          </div>
        </div>
      </section>
      
      <Footer/>

      {showModal && <EnrollModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
