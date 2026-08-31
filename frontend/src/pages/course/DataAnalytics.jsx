import { useState, lazy, Suspense } from "react";
import { Stars, FaqItem } from "./_shared";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const CourseEnrollModal = lazy(() => import("@/components/CourseEnrollModal"));
const TalkToCounsellorModal = lazy(() => import("@/components/TalkToCounsellorModal"));

// --- Data --------------------------------------------------------------------

const CURRICULUM = [
  {
    module: "Module 1",
    title: "Excel & Spreadsheet Mastery",
    duration: "1 Week",
    topics: [
      "Excel Fundamentals: Formulas, Functions",
      "VLOOKUP, HLOOKUP, INDEX-MATCH",
      "Pivot Tables & Pivot Charts",
      "Data Cleaning & Transformation in Excel",
      "Conditional Formatting & Data Validation",
      "Power Query – ETL in Excel",
    ],
  },
  {
    module: "Module 2",
    title: "SQL for Data Analysis",
    duration: "2 Weeks",
    topics: [
      "SQL Basics – SELECT, WHERE, ORDER BY",
      "Joins – INNER, LEFT, RIGHT, FULL",
      "GROUP BY, HAVING & Aggregations",
      "Subqueries & CTEs",
      "Window Functions – ROW_NUMBER, RANK, LEAD/LAG",
      "Stored Procedures & Views",
      "MySQL & PostgreSQL hands-on practice",
    ],
  },
  {
    module: "Module 3",
    title: "Python for Analytics",
    duration: "2 Weeks",
    topics: [
      "Python Basics – Variables, Control Flow, Functions",
      "Pandas – DataFrames, Merging, GroupBy",
      "NumPy – Arrays & Vectorized Operations",
      "Data Cleaning – Handling Nulls, Duplicates",
      "Exploratory Data Analysis (EDA)",
      "Matplotlib & Seaborn for Visualization",
    ],
  },
  {
    module: "Module 4",
    title: "Power BI",
    duration: "2 Weeks",
    topics: [
      "Power BI Desktop – Interface & Data Import",
      "Data Modelling – Relationships & Star Schema",
      "DAX – Calculated Columns, Measures, KPIs",
      "Building Interactive Dashboards & Reports",
      "Power BI Service – Publish & Share",
      "Row-Level Security & Gateway Setup",
    ],
  },
  {
    module: "Module 5",
    title: "Tableau",
    duration: "1 Week",
    topics: [
      "Tableau Desktop – Connecting to Data Sources",
      "Charts – Bar, Line, Scatter, Maps, Treemaps",
      "Calculated Fields & Parameters",
      "Dashboards, Stories & Filters",
      "Tableau Public – Portfolio Publishing",
      "Tableau vs Power BI – Use Cases",
    ],
  },
  {
    module: "Module 6",
    title: "Statistics & Business Analytics",
    duration: "2 Weeks",
    topics: [
      "Descriptive Statistics & Distributions",
      "Hypothesis Testing for Business Decisions",
      "A/B Testing & Experimentation",
      "Forecasting – Time Series Basics",
      "Cohort Analysis & Funnel Analysis",
      "KPI Framework & Metrics Design",
    ],
  },
  {
    module: "Module 7",
    title: "Capstone Projects & Interview Prep",
    duration: "2 Weeks",
    topics: [
      "Sales Analytics Dashboard – Power BI Project",
      "Customer Segmentation – Python + SQL Project",
      "E-Commerce Performance Analysis",
      "Case Study Practice – FAANG-style Analytics",
      "Resume Building & LinkedIn Optimization",
      "Mock Interviews & HR Round Preparation",
    ],
  },
];

const TOOLS = [
  { name: "Excel", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", icon: "📊" },
  { name: "SQL", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", icon: "🗄️" },
  { name: "Python", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300", icon: "🐍" },
  { name: "Power BI", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", icon: "📈" },
  { name: "Tableau", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200", icon: "📉" },
  { name: "Pandas", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300", icon: "🐼" },
  { name: "MySQL", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", icon: "🐬" },
  { name: "PostgreSQL", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200", icon: "🐘" },
  { name: "Looker Studio", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300", icon: "📊" },
  { name: "Power Query", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", icon: "🔄" },
  { name: "Matplotlib", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", icon: "🎨" },
  { name: "Google Sheets", color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", icon: "📋" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Direct referrals to 500+ hiring partners in analytics, BFSI, and tech." },
  { icon: "🛠️", title: "5+ Capstone Projects", desc: "Real dashboards and analysis projects for your portfolio." },
  { icon: "👨‍🏫", title: "Industry Expert Trainers", desc: "Learn from data analysts at top MNCs with 10+ years of experience." },
  { icon: "📋", title: "Case Study Practice", desc: "FAANG-style analytics case studies every week to sharpen problem-solving." },
  { icon: "🎖️", title: "Dual Certification", desc: "Great Hire + IIT Guwahati E&ICT Academy recognized certificate." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options to suit your schedule." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to recorded sessions, datasets, templates & resources." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated analytics mentor for career guidance and project reviews." },
];

const TESTIMONIALS = [
  {
    name: "Rohit Sharma",
    role: "Data Analyst",
    avatar: "RS",
    color: "bg-teal-500",
    rating: 5,
    text: "The Power BI and SQL modules are incredibly comprehensive. I built a complete banking analytics dashboard as my project which directly helped me crack the HDFC interview. Amazing course!",
  },
  {
    name: "Pooja Iyer",
    role: "Business Analyst",
    avatar: "PI",
    color: "bg-blue-500",
    rating: 5,
    text: "Excellent structure from Excel basics to Python analytics. The case study practice was the highlight – it trains you to think like a real analyst. Placed within 6 weeks of completing!",
  },
  {
    name: "Aditya Verma",
    role: "Analytics Engineer",
    avatar: "AV",
    color: "bg-green-500",
    rating: 5,
    text: "The SQL window functions and DAX modules are worth the entire fee. I was doing manual reports before – now I build automated dashboards that the whole team uses. Highly recommend!",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "8 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "11 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "4 seats left", urgent: true },
];

const FAQS = [
  {
    q: "Do I need any prior technical knowledge?",
    a: "No prior coding or technical experience is needed. We begin with Excel fundamentals and progressively move to SQL, Python, Power BI, and Tableau. Basic computer skills are sufficient.",
  },
  {
    q: "What is the total course duration?",
    a: "The course is 4.5 months (~90 days of training). All sessions are recorded and available on the LMS so you can revise any topic anytime.",
  },
  {
    q: "What job roles can I apply for after this course?",
    a: "Graduates are placed as Data Analysts, Business Analysts, BI Analysts, Reporting Analysts, and Analytics Consultants across industries like BFSI, e-commerce, consulting, and tech.",
  },
  {
    q: "Is placement 100% guaranteed?",
    a: "We provide 100% placement assistance – resume building, mock interviews, and direct referrals to 500+ hiring partners. We actively support you until you get placed.",
  },
  {
    q: "What certifications will I receive?",
    a: "You'll receive a Great Hire Training Certificate upon successful course completion.",
  },
  {
    q: "What is the course fee and EMI options?",
    a: "The course fee is ₹38,000 (inclusive of all materials, tools, datasets & placement support). EMI starts from ₹7,000/month. No cost EMI available on select cards.",
  },
];

// ─── Pricing Plans Data ───────────────────────────────────────────────────────

const PRICING_PLANS = [
  {
    id: "iit",
    badge: "IIT Certification Program",
    headerBg: "bg-blue-700 dark:bg-blue-800",
    isIIT: true,
    price: "₹60,000",
    gst: "+ 18% GST",
    emi: "*Pay in easy EMIs starting at INR 7000 per month.",
    features: [
      "3 months 100% paid Internship",
      "Advanced Certification from IIT's",
      "Guest lectures from IIT faculty",
      "Access to 20,000 + courses from top MNC's",
      "Unlimited AI-driven mock interviews",
      "Deadline extension of 6 months for entering TEKS Career Track & Dual Certification",
    ],
    highlight: false,
  },
  {
    id: "employment",
    badge: "Employment Program",
    headerBg: "bg-orange-500 dark:bg-orange-600",
    isIIT: false,
    price: "₹38,000",
    gst: "+ 18% GST",
    emi: "*Pay in easy EMIs starting at INR 7000 per month.",
    features: [
      "Intensive Data Analytics curriculum covering basic to advanced concepts",
      "100+ Live Data Analytics classes, Lifetime access",
      "20+ capstone Data Analytics projects & 1000+ coding problems and assessments",
      "Access to 20,000 + courses from top MNC's",
      "Unlimited AI-driven mock interviews",
      "50+ mock interviews with dedicated career coaches",
    ],
    highlight: true,
  },
];

// --- Sub-components ----------------------------------------------------------

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-teal-300 dark:border-teal-600 shadow-sm" : "border-gray-200 dark:border-gray-700"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-teal-500 text-white rotate-180" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-teal-50/40 dark:bg-gray-800/80 border-t border-teal-100 dark:border-gray-700">
          <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
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
        body: JSON.stringify({ ...form, courseName: "Data Analytics", type: "demo" }),
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
          <div className="p-8 text-center"><div className="text-5xl mb-4">🎓</div><h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Demo Booked!</h3><p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Our counsellor will contact you within 2 hours to confirm your free demo session.</p><button onClick={onClose} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-teal-700">Got it!</button></div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700"><p className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900 dark:text-white">Data Analytics</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">🎯 Free demo class — no commitment required!</p></div>
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
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white ${
                      errors[key] ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                  {errors[key] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[key]}</p>}
                </div>
              ))}
              <div><label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Preferred Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"><option className="dark:bg-gray-800">Online</option><option className="dark:bg-gray-800">Offline</option><option className="dark:bg-gray-800">Hybrid</option></select></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">{loading ? "Submitting..." : "Book Free Demo Class →"}</button>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pricing Plans Section ────────────────────────────────────────────────----

function PricingPlans({ onEnroll, onCounsellor }) {
  return (
    <section className="py-14 bg-gray-50 dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
            Choose Your Learning Path
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            Select the program that best fits your career goals — both include placement support and lifetime LMS access.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl overflow-hidden border-2 shadow-lg flex flex-col transition-transform hover:-translate-y-1 duration-200 bg-white dark:bg-gray-800 ${plan.highlight
                ? "border-orange-400 dark:border-orange-500 shadow-orange-100 dark:shadow-none"
                : "border-blue-300 dark:border-blue-700 shadow-blue-50 dark:shadow-none"
                }`}
            >
              {/* Card Header */}
              <div className={`${plan.headerBg} px-6 py-4`}>
                <h3 className="text-white font-black text-lg sm:text-xl text-center tracking-wide">
                  {plan.badge}
                </h3>
              </div>

              {/* Partners Row */}
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-center gap-4 flex-wrap min-h-[64px]">
                {plan.isIIT ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500 font-black text-base">L</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">Great Hire</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded px-1">®</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xl">+</span>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-600 text-white font-black text-xs px-1 rounded">in</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">LinkedIn Learning</span>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Knowledge Partner</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-black text-base">L</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">Great Hire</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded px-1">®</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-white dark:bg-gray-800 px-6 pt-5 pb-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`text-4xl font-black ${plan.highlight ? "text-orange-500 dark:text-orange-400" : "text-blue-700 dark:text-blue-400"}`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{plan.gst}</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">{plan.emi}</p>
              </div>

              {/* Divider */}
              <div className={`mx-6 my-3 border-t ${plan.highlight ? "border-orange-100 dark:border-gray-700" : "border-blue-100 dark:border-gray-700"}`} />

              {/* Features */}
              <div className="bg-white dark:bg-gray-800 px-6 pb-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-orange-500" : "bg-blue-600"
                          }`}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="bg-white dark:bg-gray-800 px-6 pb-6 pt-2 space-y-3">
                <button
                  onClick={() => onEnroll(plan.id)}
                  className={`w-full font-bold py-3.5 rounded-xl text-sm transition-colors ${plan.highlight
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-blue-700 hover:bg-blue-800 text-white"
                    }`}
                >
                  Enroll Now
                </button>
                <button
                  onClick={onCounsellor}
                  className={`w-full font-semibold py-3 rounded-xl text-sm border-2 transition-colors bg-white dark:bg-gray-800 ${plan.highlight
                    ? "border-orange-400 dark:border-orange-500 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700"
                    : "border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                    }`}
                >
                  Talk to our Admission Team
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── IIT Enroll Modal (₹60,000 + Razorpay) ──────────────────────────────────
function IITEnrollModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", batch: "Weekday Batch", mode: "Online" });
  const [step, setStep] = useState("form"); // form | done | failed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
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
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) { setError("Failed to load Razorpay. Check your internet connection."); setLoading(false); return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: "Data Analytics - IIT Certification Program", amount: 60000 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "GreatHire",
        description: "Data Analytics IIT Certification Program",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, enrollmentId: data.enrollmentId }),
            });
            const verifyData = await verifyRes.json();
            setStep(verifyData.success ? "done" : "failed");
          } catch { setStep("failed"); }
          setLoading(false);
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#1d4ed8" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { setStep("failed"); setLoading(false); });
      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-100 dark:border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-300 text-xl font-bold">×</button>

        {step === "done" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Welcome to the Data Analytics IIT Certification Program! Our team will contact you within 2 hours.</p>
            <button onClick={onClose} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800">Got it!</button>
          </div>
        ) : step === "failed" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Payment Failed</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Something went wrong. Please try again or contact support.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setStep("form"); setError(""); }} className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800">Try Again</button>
              <button onClick={onClose} className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Close</button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs text-blue-700 dark:text-blue-400 font-bold uppercase tracking-widest mb-1">IIT Certification Program</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Data Analytics — ₹60,000</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ 18% GST · EMI from ₹7,000/month</p>
            </div>
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
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white ${
                      errors[key] ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                  />
                  {errors[key] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[key]}</p>}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Batch</label>
                  <select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option className="dark:bg-gray-800">Weekday Batch</option><option className="dark:bg-gray-800">Weekend Batch</option><option className="dark:bg-gray-800">Fast Track</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option className="dark:bg-gray-800">Online</option><option className="dark:bg-gray-800">Offline</option><option className="dark:bg-gray-800">Hybrid</option>
                  </select>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
              <button onClick={handlePay} disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">
                {loading ? "Processing..." : "Pay ₹60,000 & Enroll →"}
              </button>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">🔒 Secure payment via Razorpay</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Page ----------------------------------------------------------------

export default function DataAnalyticsPage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);
  const [showIITEnroll, setShowIITEnroll] = useState(false);

  const handlePricingEnroll = (planId) => {
    if (planId === "iit") setShowIITEnroll(true);
    else setShowEnroll(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-teal-950 to-teal-900 dark:from-gray-950 dark:via-teal-950 dark:to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #14b8a6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 Most Popular</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Data Analytics</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Job Guaranteed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                Data Analytics Course<br />
                <span className="text-yellow-300">with Power BI & SQL</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-teal-200">in Hyderabad</span>
              </h1>
              <p className="text-teal-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master Excel, SQL, Python, Power BI, and Tableau with real business datasets and case studies. Get placed as a Data Analyst or Business Analyst in top MNCs through Great Hire's hiring network.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[{ val: "4.8★", label: "Rating" }, { val: "1,500+", label: "Students" }, { val: "4.5 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-black text-yellow-300">{s.val}</p>
                    <p className="text-xs text-teal-200 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">
                  Enroll Now — ₹38,000
                </button>
                <button onClick={() => setShowIITEnroll(true)}
                  className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap border border-orange-400">
                  🎓 IIT Program — ₹60,000
                </button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">
                  📥 Download Syllabus
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-teal-200">
                <span>✅ No Cost EMI Available</span><span>🎓 IIT Certified</span><span>✅ Free Demo Class</span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700 dark:text-gray-200">4.8</span><span className="text-xs text-gray-400">(1,500+ reviews)</span></div>
                <p className="text-3xl font-black text-teal-600 dark:text-teal-400 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 dark:text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">
                  {["📅 Next batch starts April 14", "⏱ 4.5 months duration", "🎖 Dual Certification", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS Access"].map((item) => (
                    <p key={item} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
                  Book Free Demo Class
                </button>
                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to a Counsellor</button>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">🔒 Secure payment · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div><p className="text-xl font-black text-teal-600 dark:text-teal-400 leading-none">₹38,000</p><p className="text-xs text-gray-400 dark:text-gray-400">EMI from ₹7,000/mo</p></div>
          <button onClick={() => setShowEnroll(true)} className="bg-teal-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-500 rounded-full inline-block"></span>Course Overview
              </h2>
              <div className="bg-teal-50 dark:bg-gray-800/60 border border-teal-100 dark:border-gray-700 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">The <strong className="text-gray-900 dark:text-white">Data Analytics Course</strong> at Great Hire is a comprehensive 4.5-month job-oriented program that takes you from Excel basics to building interactive Power BI dashboards and Python-based analytics pipelines – using real business datasets.</p>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">With 5+ hands-on projects, FAANG-style case studies, and direct placement support through Great Hire's 500+ company network, this is your fastest path to becoming a data analyst.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ icon: "⏱", label: "Duration", val: "4.5 Months" }, { icon: "📚", label: "Modules", val: "7 Modules" }, { icon: "🖥", label: "Mode", val: "Online + Offline" }, { icon: "🌐", label: "Language", val: "English / Telugu" }].map((item) => (
                  <div key={item.label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl mb-1">{item.icon}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-400 font-medium mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.val}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-500 rounded-full inline-block"></span>Why This Course?
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

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-7 bg-teal-500 rounded-full inline-block"></span>Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 dark:text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 12 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => (
                  <AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-teal-600 dark:text-teal-400 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-500 rounded-full inline-block"></span>Tools & Technologies
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
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-500 rounded-full inline-block"></span>Upcoming Batches
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
                      <button onClick={() => setShowEnroll(true)} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-500 rounded-full inline-block"></span>Student Reviews
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

            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-500 rounded-full inline-block"></span>Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700 dark:text-gray-200">4.8</span><span className="text-xs text-gray-400">(1,500+)</span></div>
                <p className="text-3xl font-black text-teal-600 dark:text-teal-400 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 dark:text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700 dark:text-gray-300">
                  {["📅 Next batch: April 14, 2025", "⏱ Duration: 4.5 months", "🎖 Dual Certification", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS Access", "👥 Batch size: 15 students"].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-teal-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("📊 Check out this Data Analytics Course at Great Hire! Get placed as a Data Analyst with 100% placement support.\n" + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-teal-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors">
                  Share & Earn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

       <PricingPlans
        onEnroll={handlePricingEnroll}
        onCounsellor={() => setShowCounsellor(true)}
      />

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Start Your Data Analytics Journey Today</h2>
          <p className="text-teal-100 text-base sm:text-lg mb-8 leading-relaxed">Join 1,500+ students who've already built data-driven careers with Great Hire's Data Analytics course.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now – ₹38,000</button>
            <button onClick={() => setShowIITEnroll(true)}
                  className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap border border-orange-400">
                  🎓 IIT Program — ₹60,000
                </button>
          </div>
        </div>
      </section>

      <Footer />
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {showEnroll && <CourseEnrollModal onClose={() => setShowEnroll(false)} courseName="Data Analytics" amount={38000} accentColor="teal" />}
      {showIITEnroll && <IITEnrollModal onClose={() => setShowIITEnroll(false)} />}
      <Suspense fallback={null}>
        {showCounsellor && <TalkToCounsellorModal courseName="Data Analytics" onClose={() => setShowCounsellor(false)} />}
      </Suspense>
    </div>
  );
}