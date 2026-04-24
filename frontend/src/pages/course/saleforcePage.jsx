import CourseEnrollModal from "@/components/CourseEnrollModal";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";
import TalkToCounsellorModal from "@/components/TalkToCounsellorModal";

// ─── Data ────────────────────────────────────────────────────────────────────

const CURRICULUM = [
    {
        module: "Module 1",
        title: "Salesforce Fundamentals & Admin Basics",
        duration: "2 Weeks",
        topics: [
            "Introduction to CRM & Salesforce Ecosystem",
            "Salesforce Architecture – Multi-tenant Cloud",
            "Navigating Salesforce UI – Lightning Experience",
            "Standard & Custom Objects",
            "Fields, Page Layouts & Record Types",
            "Profiles, Roles & Permission Sets",
            "OWD, Sharing Rules & Field-Level Security",
        ],
    },
    {
        module: "Module 2",
        title: "Salesforce Administration",
        duration: "2 Weeks",
        topics: [
            "User Management & License Types",
            "Validation Rules & Formula Fields",
            "Workflow Rules & Process Builder",
            "Approval Processes",
            "Reports & Dashboards",
            "Data Management – Import Wizard, Data Loader",
            "Sandbox & Deployment with Change Sets",
        ],
    },
    {
        module: "Module 3",
        title: "Salesforce Sales & Service Cloud",
        duration: "2 Weeks",
        topics: [
            "Leads, Accounts, Contacts & Opportunities",
            "Sales Process & Opportunity Stages",
            "Forecasting & Quota Management",
            "Cases, Entitlements & SLAs",
            "Service Console & Omni-Channel Setup",
            "Knowledge Base & Communities",
            "CTI Integration Basics",
        ],
    },
    {
        module: "Module 4",
        title: "Salesforce Flow & Automation",
        duration: "2 Weeks",
        topics: [
            "Screen Flows – Input Variables & Components",
            "Record-Triggered Flows",
            "Scheduled & Auto-Launched Flows",
            "Flow Builder – Loops, Decisions, Variables",
            "Migrating from Workflow Rules to Flows",
            "Flow Testing & Debugging Best Practices",
        ],
    },
    {
        module: "Module 5",
        title: "Apex & Visualforce Development",
        duration: "3 Weeks",
        topics: [
            "Apex Basics – Classes, Methods, Data Types",
            "SOQL & SOSL – Queries in Salesforce",
            "Triggers – Before/After Insert, Update, Delete",
            "Governor Limits & Bulk Best Practices",
            "Asynchronous Apex – Batch, Future, Queueable",
            "Visualforce Pages & Controllers",
            "Test Classes & Code Coverage",
        ],
    },
    {
        module: "Module 6",
        title: "Lightning Web Components (LWC)",
        duration: "2 Weeks",
        topics: [
            "LWC Architecture – HTML, JS, CSS",
            "Component Communication – Parent-Child",
            "Wire Service & Apex Integration",
            "Lightning Data Service",
            "Deploying LWC with Salesforce CLI & VS Code",
            "LWC vs Aura Components",
        ],
    },
    {
        module: "Module 7",
        title: "Integration, Certifications & Career Prep",
        duration: "3 Weeks",
        topics: [
            "REST & SOAP API Integration",
            "Connected Apps & OAuth 2.0",
            "MuleSoft Anypoint Basics",
            "Salesforce Admin Cert – Exam Prep (ADM 201)",
            "Platform Developer I Cert – Exam Prep (PD1)",
            "Resume Building & LinkedIn Optimization",
            "Mock Interviews & HR Round Preparation",
        ],
    },
];

const TOOLS = [
    { name: "Salesforce CRM", color: "bg-blue-100 text-blue-700", icon: "☁️" },
    { name: "Apex", color: "bg-sky-100 text-sky-700", icon: "⚡" },
    { name: "LWC", color: "bg-indigo-100 text-indigo-700", icon: "🧩" },
    { name: "Salesforce Flow", color: "bg-cyan-100 text-cyan-700", icon: "🔀" },
    { name: "SOQL / SOSL", color: "bg-blue-100 text-blue-800", icon: "🔍" },
    { name: "VS Code", color: "bg-gray-100 text-gray-700", icon: "💻" },
    { name: "Salesforce CLI", color: "bg-slate-100 text-slate-700", icon: "🛠️" },
    { name: "Sales Cloud", color: "bg-green-100 text-green-700", icon: "💼" },
    { name: "Service Cloud", color: "bg-teal-100 text-teal-700", icon: "🎧" },
    { name: "Data Loader", color: "bg-orange-100 text-orange-700", icon: "📦" },
    { name: "REST API", color: "bg-pink-100 text-pink-700", icon: "🔗" },
    { name: "MuleSoft", color: "bg-yellow-100 text-yellow-700", icon: "🔌" },
];

const HIGHLIGHTS = [
    { icon: "🎯", title: "100% Job Assistance", desc: "Direct referrals to 500+ hiring partners — Salesforce ISVs, SIs & enterprises." },
    { icon: "🏅", title: "Certification-Focused", desc: "Fully aligned with Salesforce ADM 201 & Platform Developer I exam patterns." },
    { icon: "👨‍🏫", title: "Certified SF Trainers", desc: "Learn from Salesforce-certified architects and developers with 10+ years' experience." },
    { icon: "📋", title: "Regular Mock Tests", desc: "Weekly Salesforce certification mock exams and scenario-based assignments." },
    { icon: "🎖️", title: "Dual Certification", desc: "Great Hire + IIT Guwahati E&ICT Academy recognized certificate." },
    { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options to suit your schedule." },
    { icon: "💻", title: "LMS Access", desc: "Lifetime access to recorded sessions, orgs, trailhead guides & resources." },
    { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated Salesforce mentor for project guidance and certification strategy." },
];

const TESTIMONIALS = [
    {
        name: "Vinay Reddy",
        role: "Salesforce Developer @ Capgemini",
        avatar: "VR",
        color: "bg-blue-500",
        rating: 5,
        text: "The LWC and Apex modules are extremely detailed. The trainer walked us through real ISV project code which you won't find in any YouTube tutorial. Cracked Capgemini in 45 days!",
    },
    {
        name: "Meena Krishnan",
        role: "Salesforce Admin @ Cognizant",
        avatar: "MK",
        color: "bg-sky-500",
        rating: 5,
        text: "Cleared ADM 201 on the first attempt thanks to the structured mock exams here. The flow automation module alone transformed how I approach configuration. Highly recommend!",
    },
    {
        name: "Harish Kumar",
        role: "SF Consultant @ Infosys",
        avatar: "HK",
        color: "bg-indigo-500",
        rating: 5,
        text: "Went from zero Salesforce knowledge to clearing PD1 and joining Infosys as a consultant. The governor limits and bulkification training is top-notch. Best Salesforce course in Hyderabad!",
    },
];

const BATCHES = [
    { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "6 seats left", urgent: true },
    { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "10 seats left", urgent: false },
    { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "3 seats left", urgent: true },
];

const FAQS = [
    {
        q: "Do I need prior programming knowledge for Salesforce?",
        a: "For the Admin track, no prior coding knowledge is required. For the Developer track, basic programming understanding is helpful. We cover all prerequisites before diving into Apex and LWC.",
    },
    {
        q: "What is the total course duration?",
        a: "The course is 5 months (~100 days). It covers both Salesforce Admin and Developer tracks comprehensively. All sessions are recorded and available on the LMS.",
    },
    {
        q: "Will I be prepared for Salesforce certification exams?",
        a: "Yes! Our curriculum is fully aligned with Salesforce ADM 201 (Admin) and Platform Developer I (PD1) exams. We conduct weekly mock exams and provide study materials and scenario questions.",
    },
    {
        q: "Is placement 100% guaranteed?",
        a: "We provide 100% placement assistance — resume building, mock interviews, and direct referrals to 500+ hiring partners including Salesforce SIs, ISVs, and enterprise clients.",
    },
    {
        q: "What certifications will I receive from Great Hire?",
        a: "You'll receive a Great Hire Training Certificate and an IIT Guwahati E&ICT Academy recognized certificate, along with preparation for official Salesforce certifications.",
    },
    {
        q: "What is the course fee and EMI options?",
        a: "The course fee is ₹38,000 (inclusive of all materials, developer org access, mock exams & placement support). EMI starts from ₹7,000/month. No cost EMI on select cards.",
    },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

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
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-sky-300 shadow-sm" : "border-gray-200"}`}>
            <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 text-xs font-bold bg-sky-100 text-sky-600 px-2.5 py-1 rounded-full">{item.module}</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-sky-500 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </button>
            {isOpen && (
                <div className="px-5 pb-5 bg-sky-50/40 border-t border-sky-100">
                    <p className="text-xs text-sky-600 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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
        body: JSON.stringify({ ...form, courseName: "Salesforce Admin & Developer", type: "demo" }),
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
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900">Salesforce Admin & Developer</h3><p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p></div>
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


// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SalesforcePage() {
    const [openModule, setOpenModule] = useState(0);
    const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* <Navbar /> */}
            <Navbar />
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-sky-950 to-blue-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)" }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                        <div className="lg:col-span-2">
                            <div className="flex flex-wrap gap-2 mb-5">
                                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 High Demand</span>
                                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Salesforce Admin + Developer</span>
                                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Job Guaranteed</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                                Salesforce Admin &<br />
                                <span className="text-yellow-300">Developer Course</span><br />
                                <span className="text-2xl sm:text-3xl font-bold text-sky-200">in Hyderabad</span>
                            </h1>
                            <p className="text-sky-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                                Master Salesforce Administration, Apex, LWC, Flows, Sales Cloud, Service Cloud and REST APIs. Prepare for ADM 201 & PD1 certifications and get placed at top Salesforce SIs and enterprise clients.
                            </p>
                            <div className="flex flex-wrap gap-6 mb-8">
                                {[{ val: "4.9★", label: "Rating" }, { val: "1,200+", label: "Students" }, { val: "5 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (
                                    <div key={s.label}>
                                        <p className="text-xl font-black text-yellow-300">{s.val}</p>
                                        <p className="text-xs text-sky-200 font-medium">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">
                                    🚀 Enroll Now — ₹38,000
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">
                                    📥 Download Syllabus
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6 text-xs text-sky-200">
                                <span>✅ No Cost EMI Available</span><span>✅ ADM 201 & PD1 Cert Prep</span><span>✅ Free Demo Class</span>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.9</span><span className="text-xs text-gray-400">(1,200+ reviews)</span></div>
                                <p className="text-3xl font-black text-sky-600 mb-1">₹38,000</p>
                                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                                <div className="space-y-2.5 mb-5">
                                    {["📅 Next batch starts April 14", "⏱ 5 months duration", "🏅 ADM 201 & PD1 Cert Prep", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS + Dev Org Access"].map((item) => (
                                        <p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>
                                    ))}
                                </div>
                                <button onClick={() => setShowDemo(true)} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
                  Book Free Demo Class
                </button>
                                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to a Counsellor</button>
                                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure payment · Cancel anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile CTA */}
            <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <div><p className="text-xl font-black text-sky-600 leading-none">₹38,000</p><p className="text-xs text-gray-400">EMI from ₹7,000/mo</p></div>
                    <button onClick={() => setShowEnroll(true)} className="bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-14">

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-1 h-7 bg-sky-500 rounded-full inline-block"></span>Course Overview
                            </h2>
                            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 mb-6">
                                <p className="text-gray-700 text-base leading-relaxed mb-4">The <strong>Salesforce Admin & Developer Course</strong> at Great Hire is a comprehensive 5-month job-oriented program that covers everything from CRM fundamentals and Salesforce administration to Apex programming, Lightning Web Components, and API integration.</p>
                                <p className="text-gray-700 text-base leading-relaxed">With complete ADM 201 and Platform Developer I certification preparation, hands-on developer org access, and direct placement support through Great Hire's 500+ company network, this is Hyderabad's most complete Salesforce training.</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[{ icon: "⏱", label: "Duration", val: "5 Months" }, { icon: "📚", label: "Modules", val: "7 Modules" }, { icon: "🖥", label: "Mode", val: "Online + Offline" }, { icon: "🌐", label: "Language", val: "English / Telugu" }].map((item) => (
                                    <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                                        <p className="text-2xl mb-1">{item.icon}</p>
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                                        <p className="text-sm font-bold text-gray-900">{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-7 bg-sky-500 rounded-full inline-block"></span>Why This Course?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {HIGHLIGHTS.map((h) => (
                                    <div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-sky-200 hover:shadow-sm transition-all group">
                                        <div className="w-11 h-11 bg-sky-50 group-hover:bg-sky-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">{h.icon}</div>
                                        <div><p className="font-bold text-gray-900 text-sm mb-0.5">{h.title}</p><p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p></div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                                    <span className="w-1 h-7 bg-sky-500 rounded-full inline-block"></span>Course Curriculum
                                </h2>
                                <span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 16 weeks</span>
                            </div>
                            <div className="space-y-3">
                                {CURRICULUM.map((item, i) => (
                                    <AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />
                                ))}
                            </div>
                            <div className="mt-4 text-center">
                                <button className="text-sky-600 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-7 bg-sky-500 rounded-full inline-block"></span>Tools & Technologies
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {TOOLS.map((t) => (
                                    <span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}>
                                        <span className="text-base">{t.icon}</span>{t.name}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-7 bg-sky-500 rounded-full inline-block"></span>Upcoming Batches
                            </h2>
                            <div className="space-y-4">
                                {BATCHES.map((b) => (
                                    <div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-sky-300 bg-sky-50" : "border-gray-200 bg-white"}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-sky-100" : "bg-gray-100"}`}>📅</div>
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
                                            <button onClick={() => setShowEnroll(true)} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-7 bg-sky-500 rounded-full inline-block"></span>Student Reviews
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
                                <span className="w-1 h-7 bg-sky-500 rounded-full inline-block"></span>Frequently Asked Questions
                            </h2>
                            <div className="space-y-3">
                                {FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 space-y-5">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.9</span><span className="text-xs text-gray-400">(1,200+)</span></div>
                                <p className="text-3xl font-black text-sky-600 leading-none mb-1">₹38,000</p>
                                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                                <div className="space-y-2.5 mb-5 text-sm text-gray-700">
                                    {["📅 Next batch: April 14, 2025", "⏱ Duration: 5 months", "🏅 ADM 201 & PD1 Cert Prep", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Dev Org + LMS Access", "👥 Batch size: 15 students"].map((item) => (
                                        <p key={item} className="flex items-start gap-2">{item}</p>
                                    ))}
                                </div>
                                <button onClick={() => setShowDemo(true)} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
                            </div>
                            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white text-center">
                                <p className="text-2xl mb-2">👫</p>
                                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                                <p className="text-xs text-sky-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                                <a
                                  href={`https://wa.me/?text=${encodeURIComponent("☁️ Check out this Salesforce Admin & Developer Course at Great Hire! Get ADM 201 & PD1 certified with 100% placement support.\n" + window.location.href)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block bg-white text-sky-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-sky-50 transition-colors">
                                  Share & Earn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Banner */}
            <section className="bg-gradient-to-r from-sky-600 to-blue-700 py-14 mt-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Start Your Salesforce Journey Today</h2>
                    <p className="text-sky-100 text-base sm:text-lg mb-8 leading-relaxed">Join 1,200+ students who've built high-paying Salesforce careers with Great Hire's Admin & Developer course.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
                        <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
                    </div>
                </div>
            </section>

            {/* <Footer /> */}
            <Footer />
            {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {showEnroll && <CourseEnrollModal onClose={() => setShowEnroll(false)} courseName="Salesforce" amount={38000} accentColor="blue" />}
        </div>
    );
}
