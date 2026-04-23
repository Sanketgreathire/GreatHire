import CourseEnrollModal from "@/components/CourseEnrollModal";

import { useState } from "react";
import Navbar from "@/components/shared/Navbar";  
import Footer from "@/components/shared/Footer";
import TalkToCounsellorModal from "@/components/TalkToCounsellorModal";

// ─── Data ────────────────────────────────────────────────────────────────────

const CURRICULUM = [
  {
    module: "Module 1",
    title: "Core Java Programming",
    duration: "3 Weeks",
    topics: [
      "Introduction to Java & JDK/JVM Setup",
      "Variables, Data Types & Operators",
      "Control Flow – if/else, loops, switch",
      "OOP – Classes, Objects, Inheritance, Polymorphism",
      "Interfaces, Abstract Classes & Encapsulation",
      "Exception Handling & Custom Exceptions",
      "Collections Framework – List, Map, Set, Queue",
      "Java 8+ Features – Streams, Lambda, Optional",
    ],
  },
  {
    module: "Module 2",
    title: "Advanced Java & Spring Ecosystem",
    duration: "4 Weeks",
    topics: [
      "JDBC – Database Connectivity with MySQL",
      "Servlets & JSP Basics",
      "Spring Core – IoC, Dependency Injection, Beans",
      "Spring MVC – Architecture & Request Handling",
      "Spring Boot – Auto Configuration & Starters",
      "Spring Data JPA & Hibernate ORM",
      "Spring Security – Authentication & JWT",
      "Microservices with Spring Cloud",
    ],
  },
  {
    module: "Module 3",
    title: "Front-End Development",
    duration: "3 Weeks",
    topics: [
      "HTML5 – Semantic Elements, Forms, Tables",
      "CSS3 – Flexbox, Grid, Responsive Design",
      "Bootstrap 5 – Components & Layouts",
      "JavaScript – ES6+, DOM, Events, Fetch API",
      "React.js – Components, Props, State, Hooks",
      "React Router, Context API & Redux Basics",
    ],
  },
  {
    module: "Module 4",
    title: "Database Management",
    duration: "2 Weeks",
    topics: [
      "SQL Fundamentals & MySQL Workbench",
      "DDL, DML, DCL & TCL Commands",
      "Joins, Subqueries & Stored Procedures",
      "PostgreSQL with Spring Boot",
      "NoSQL – MongoDB Basics",
      "Hibernate – ORM & Caching Strategies",
    ],
  },
  {
    module: "Module 5",
    title: "REST API & Microservices",
    duration: "2 Weeks",
    topics: [
      "RESTful API Design Principles",
      "Spring REST – GET, POST, PUT, DELETE",
      "Swagger/OpenAPI Documentation",
      "Microservices Architecture Patterns",
      "API Gateway & Service Discovery (Eureka)",
      "Inter-Service Communication with Feign",
    ],
  },
  {
    module: "Module 6",
    title: "DevOps, Cloud & Deployment",
    duration: "2 Weeks",
    topics: [
      "Git & GitHub – Branching & Pull Requests",
      "Maven & Gradle Build Tools",
      "Docker – Containerization & Docker Compose",
      "CI/CD with Jenkins & GitHub Actions",
      "AWS EC2, S3, RDS & Elastic Beanstalk",
      "Linux Command Line Essentials",
    ],
  },
  {
    module: "Module 7",
    title: "Real-World Projects & Interview Prep",
    duration: "2 Weeks",
    topics: [
      "E-Commerce App – Full Stack Java Project",
      "Banking System with Microservices",
      "Portfolio Website Deployment",
      "Resume Building & LinkedIn Optimization",
      "Mock Interviews & HR Round Preparation",
      "Aptitude & DSA Coding Round Practice",
    ],
  },
];

const TOOLS = [
  { name: "Java", color: "bg-orange-100 text-orange-700", icon: "☕" },
  { name: "Spring Boot", color: "bg-green-100 text-green-700", icon: "🌱" },
  { name: "React", color: "bg-blue-100 text-blue-700", icon: "⚛️" },
  { name: "MySQL", color: "bg-orange-100 text-orange-800", icon: "🗄️" },
  { name: "PostgreSQL", color: "bg-indigo-100 text-indigo-700", icon: "🐘" },
  { name: "MongoDB", color: "bg-emerald-100 text-emerald-700", icon: "🍃" },
  { name: "AWS", color: "bg-yellow-100 text-yellow-800", icon: "☁️" },
  { name: "Docker", color: "bg-sky-100 text-sky-700", icon: "🐳" },
  { name: "Hibernate", color: "bg-red-100 text-red-700", icon: "🗂️" },
  { name: "Maven", color: "bg-rose-100 text-rose-700", icon: "🔧" },
  { name: "Git & GitHub", color: "bg-gray-100 text-gray-700", icon: "🐙" },
  { name: "Microservices", color: "bg-purple-100 text-purple-700", icon: "🔗" },
  { name: "Jenkins", color: "bg-red-100 text-red-800", icon: "⚙️" },
  { name: "Swagger", color: "bg-lime-100 text-lime-700", icon: "📄" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Direct referrals to 500+ hiring partners in Great Hire's network." },
  { icon: "🛠️", title: "Hands-On Projects", desc: "Build 3+ real-world projects including E-Commerce & Banking App." },
  { icon: "👨‍🏫", title: "Industry Expert Trainers", desc: "Learn from Java architects with 10+ years of enterprise experience." },
  { icon: "📋", title: "Regular Mock Tests", desc: "Weekly assessments, DSA challenges & system design rounds." },
  { icon: "🎖️", title: "Dual Certification", desc: "Great Hire + IIT Guwahati E&ICT Academy recognized certificate." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options to suit your schedule." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to recorded sessions, notes & interview material." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated mentor for doubt resolution and career guidance." },
];

const TESTIMONIALS = [
  {
    name: "Ravi Teja Reddy",
    role: "Java Developer",
    avatar: "RT",
    color: "bg-orange-500",
    rating: 5,
    text: "The Full Stack Java course at Great Hire was a game changer. Spring Boot + Microservices is exactly what interviewers ask. Got placed in 30 days after completing the course!",
  },
  {
    name: "Priya Nair",
    role: "Full Stack Developer",
    avatar: "PN",
    color: "bg-rose-500",
    rating: 5,
    text: "Excellent curriculum and amazing trainers. The project on microservices architecture gave me real confidence during technical interviews. Highly recommended!",
  },
  {
    name: "Moin Shaikh",
    role: "Software Engineer",
    avatar: "SK",
    color: "bg-emerald-500",
    rating: 5,
    text: "Started with zero Spring Boot knowledge. Now I build and deploy microservices daily at work. The AWS deployment module was particularly brilliant.",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "7 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "11 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "4 seats left", urgent: true },
];

const FAQS = [
  {
    q: "Do I need prior programming knowledge for this course?",
    a: "Basic programming awareness is helpful but not mandatory. We start from Core Java fundamentals and build up gradually. Anyone with a logical mindset and dedication can succeed.",
  },
  {
    q: "What is the total course duration?",
    a: "The course is 6 months (~110 days of training). Weekday fast-track batches may complete earlier. All sessions are recorded so you never miss anything.",
  },
  {
    q: "Which companies hire from Great Hire's network?",
    a: "Our 500+ hiring partners include Infosys, TCS, Wipro, Accenture, HCL, Capgemini, Tech Mahindra, and multiple product-based startups. We provide direct referrals.",
  },
  {
    q: "Is placement 100% guaranteed?",
    a: "We provide 100% placement assistance — resume building, mock interviews, and direct referrals to our hiring partners. We actively support you until you land a job.",
  },
  {
    q: "What certifications will I receive?",
    a: "You'll receive a Great Hire Training Certificate and an IIT Guwahati E&ICT Academy recognized certificate upon successful course completion.",
  },
  {
    q: "What is the course fee and EMI options?",
    a: "The course fee is ₹38,000 (inclusive of all materials, projects & placement support). EMI starts from ₹7,000/month. No cost EMI available on select cards.",
  },
];

// ─── Pricing Plans Data ───────────────────────────────────────────────────────

const PRICING_PLANS = [
  {
    id: "iit",
    badge: "IIT Certification Program",
    headerBg: "bg-blue-700",
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
    headerBg: "bg-orange-500",
    isIIT: false,
    price: "₹38,000",
    gst: "+ 18% GST",
    emi: "*Pay in easy EMIs starting at INR 7000 per month.",
    features: [
      "Intensive Full-Stack Java curriculum covering basic to advanced concepts",
      "100+ Live Full-Stack Java classes, Lifetime access",
      "20+ capstone Full-Stack Java projects & 1000+ coding problems and assessments",
      "Access to 20,000 + courses from top MNC's",
      "Unlimited AI-driven mock interviews",
      "50+ mock interviews with dedicated career coaches",
    ],
    highlight: true,
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
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-orange-300 shadow-sm" : "border-gray-200"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-orange-500 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-orange-50/40 border-t border-orange-100">
          <p className="text-xs text-orange-600 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{item.q}</span>
        <span className={`text-xl font-light text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
          {item.a}
        </div>
      )}
    </div>
  );
}

// ─── Demo Modal ───────────────────────────────────────────────────────────────

function DemoModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", mode: "Online" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: "Full Stack Java Developer", type: "demo" }),
      });
    } catch (_) {}
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {done ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Demo Booked!</h3>
            <p className="text-gray-500 text-sm mb-6">Our counsellor will contact you within 2 hours to confirm your free demo session.</p>
            <button onClick={onClose} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-orange-600">Got it!</button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100">
              <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-1">Book Free Demo</p>
              <h3 className="text-xl font-black text-gray-900">Full Stack Java Developer</h3>
              <p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input
                    required type={type} placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Preferred Mode</label>
                <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">
                {loading ? "Submitting..." : "Book Free Demo Class →"}
              </button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pricing Plans Section ────────────────────────────────────────────────────

function PricingPlans({ onEnroll, onCounsellor }) {
  return (
    <section className="py-14 bg-gray-50 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 flex items-center justify-center gap-2">
            <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
            Choose Your Learning Path
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mt-2">
            Select the program that best fits your career goals — both include placement support and lifetime LMS access.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl overflow-hidden border-2 shadow-lg flex flex-col transition-transform hover:-translate-y-1 duration-200 ${
                plan.highlight
                  ? "border-orange-400 shadow-orange-100"
                  : "border-blue-300 shadow-blue-50"
              }`}
            >
              {/* Card Header */}
              <div className={`${plan.headerBg} px-6 py-4`}>
                <h3 className="text-white font-black text-lg sm:text-xl text-center tracking-wide">
                  {plan.badge}
                </h3>
              </div>

              {/* Partners Row */}
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-center gap-4 flex-wrap min-h-[64px]">
                {plan.isIIT ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500 font-black text-base">L</span>
                      <span className="font-bold text-gray-800 text-sm">Great Hire</span>
                      <span className="text-[10px] text-blue-600 border border-blue-200 rounded px-1">®</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xl">+</span>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-600 text-white font-black text-xs px-1 rounded">in</span>
                        <span className="font-bold text-gray-800 text-sm">LinkedIn Learning</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-0.5">Knowledge Partner</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-black text-base">L</span>
                    <span className="font-bold text-gray-800 text-sm">Great Hire</span>
                    <span className="text-[10px] text-blue-600 border border-blue-200 rounded px-1">®</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-white px-6 pt-5 pb-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`text-4xl font-black ${plan.highlight ? "text-orange-500" : "text-blue-700"}`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">{plan.gst}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 italic">{plan.emi}</p>
              </div>

              {/* Divider */}
              <div className={`mx-6 my-3 border-t ${plan.highlight ? "border-orange-100" : "border-blue-100"}`} />

              {/* Features */}
              <div className="bg-white px-6 pb-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.highlight ? "bg-orange-500" : "bg-blue-600"
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
              <div className="bg-white px-6 pb-6 pt-2 space-y-3">
                <button
                  onClick={() => onEnroll(plan.id)}
                  className={`w-full font-bold py-3.5 rounded-xl text-sm transition-colors ${
                    plan.highlight
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-blue-700 hover:bg-blue-800 text-white"
                  }`}
                >
                  Enroll Now
                </button>
                <button
                  onClick={onCounsellor}
                  className={`w-full font-semibold py-3 rounded-xl text-sm border-2 transition-colors bg-white ${
                    plan.highlight
                      ? "border-orange-400 text-orange-500 hover:bg-orange-50"
                      : "border-blue-400 text-blue-700 hover:bg-blue-50"
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JavaFullStackPage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollAmount, setEnrollAmount] = useState(38000);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

  const handlePricingEnroll = (planId) => {
    setEnrollAmount(planId === "iit" ? 60000 : 38000);
    setShowEnroll(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

      {/* ── Navbar ── */}
       <Navbar />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-950 to-orange-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ef4444 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Left – Content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 Most Popular</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Full Stack Development</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Job Guaranteed</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                Full Stack Java<br />
                <span className="text-yellow-300">Developer Course</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-orange-200">in Hyderabad</span>
              </h1>

              <p className="text-orange-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master Java, Spring Boot, Microservices, React, MySQL, AWS and more with enterprise-grade real-world projects. Get placed in top IT companies through Great Hire's exclusive hiring network — 100% placement assistance included.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { val: "4.9★", label: "Rating" },
                  { val: "3,200+", label: "Students" },
                  { val: "6 Months", label: "Duration" },
                  { val: "100%", label: "Placement" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-black text-yellow-300">{s.val}</p>
                    <p className="text-xs text-orange-200 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setEnrollAmount(38000); setShowEnroll(true); }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">
                  🚀 Enroll Now — ₹38,000
                </button>
                <button onClick={() => { setEnrollAmount(60000); setShowEnroll(true); }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">
                  🚀 Enroll Now — ₹60,000
                </button>
                <button onClick={() => setShowDemo(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">
                  🎯 Book Free Demo
                </button>
              </div>

              

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-orange-200">
                <span className="flex items-center gap-1.5">✅ No Cost EMI Available</span>
                <span className="flex items-center gap-1.5">✅ IIT  Certified</span>
                <span className="flex items-center gap-1.5">✅ Free Demo Class</span>
              </div>
            </div>

            {/* Right – Enroll card (desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1">
                  <Stars />
                  <span className="text-sm font-bold text-gray-700">4.9</span>
                  <span className="text-xs text-gray-400">(3,200+ reviews)</span>
                </div>
                <p className="text-3xl font-black text-orange-500 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>

                <div className="space-y-2.5 mb-5">
                  {[
                    "📅 Next batch starts April 14",
                    "⏱ 6 months duration",
                    "🎖 Dual Certification",
                    "💼 100% Placement Support",
                    "🔄 Online + Offline modes",
                    "🎁 Lifetime LMS Access",
                  ].map((item) => (
                    <p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>
                  ))}
                </div>

                <button onClick={() => setShowDemo(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
                  Book Free Demo Class
                </button>
                <button onClick={() => setShowEnroll(true)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-3 rounded-xl text-sm transition-colors">
                  🚀 Enroll Now — ₹38,000
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure payment · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile CTA strip ── */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-black text-orange-500 leading-none">₹38,000</p>
            <p className="text-xs text-gray-400">EMI from ₹7,000/mo</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowDemo(true)}
              className="bg-white border border-orange-500 text-orange-500 font-bold px-3 py-2.5 rounded-xl text-xs whitespace-nowrap">
              Free Demo
            </button>
            <button onClick={() => setShowEnroll(true)}
              className="bg-orange-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs whitespace-nowrap">
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left col */}
          <div className="lg:col-span-2 space-y-14">

            {/* Course Overview */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
                Course Overview
              </h2>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-base leading-relaxed mb-4">
                  The <strong>Full Stack Java Developer Course</strong> at Great Hire is a comprehensive 6-month job-oriented program designed to take you from zero to enterprise-ready. You'll master both front-end and back-end development using Java, Spring Boot, Microservices, React, and cloud deployment.
                </p>
                <p className="text-gray-700 text-base leading-relaxed">
                  With 3+ real-world enterprise projects, weekly mock interviews, and direct placement support through Great Hire's 500+ company network, this course is your fastest path to a high-paying tech career in Hyderabad.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "⏱", label: "Duration", val: "6 Months" },
                  { icon: "📚", label: "Modules", val: "7 Modules" },
                  { icon: "🖥", label: "Mode", val: "Online + Offline" },
                  { icon: "🌐", label: "Language", val: "English / Telugu" },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl mb-1">{item.icon}</p>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900">{item.val}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Why This Course */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
                Why This Course?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all group">
                    <div className="w-11 h-11 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">
                      {h.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{h.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
                  Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 18 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => (
                  <AccordionItem
                    key={i}
                    item={item}
                    isOpen={openModule === i}
                    onToggle={() => setOpenModule(openModule === i ? -1 : i)}
                  />
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-orange-500 text-sm font-semibold hover:underline">
                  📥 Download Complete Syllabus PDF
                </button>
              </div>
            </section>

            {/* Tools */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
                Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((t) => (
                  <span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}>
                    <span className="text-base">{t.icon}</span>
                    {t.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Batch Schedule */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
                Upcoming Batches
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
                      <button onClick={() => setShowEnroll(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">
                        Enroll →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
                Student Reviews
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <Stars count={t.rating} />
                    <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <FaqItem key={faq.q} item={faq} />
                ))}
              </div>
            </section>
          </div>

          {/* ── Sticky Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Stars />
                  <span className="text-sm font-bold text-gray-700">4.9</span>
                  <span className="text-xs text-gray-400">(3,200+)</span>
                </div>
                <p className="text-3xl font-black text-orange-500 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700">
                  {[
                    "📅 Next batch: April 14, 2025",
                    "⏱ Duration: 6 months",
                    "🎖 Dual Certification",
                    "💼 100% Placement Support",
                    "🔄 Online + Offline modes",
                    "🎁 Lifetime LMS Access",
                    "👥 Batch size: 15 students",
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button onClick={() => setShowEnroll(true)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-3 rounded-xl text-sm mb-3 transition-colors">
                  🚀 Enroll Now — ₹38,000
                </button>
                
                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                  📞 Talk to Counsellor
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-orange-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <button className="bg-white text-orange-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                  Share & Earn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pricing Plans Section ── */}
      <PricingPlans
        onEnroll={handlePricingEnroll}
        onCounsellor={() => setShowCounsellor(true)}
      />

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Start Your Java Journey Today
          </h2>
          <p className="text-orange-100 text-base sm:text-lg mb-8 leading-relaxed">
            Join 3,200+ students who've already transformed their careers with Great Hire's Full Stack Java course.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnroll(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">
              🚀 Enroll Now — ₹38,000
            </button>
            <button onClick={() => openEnroll(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">
                  🚀 Enroll Now — ₹60,000
                </button>
            <button onClick={() => setShowDemo(true)}
              className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">
              🎯 Book Free Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
        <Footer/>

      {/* ── Modals ── */}
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {showEnroll && <CourseEnrollModal onClose={() => setShowEnroll(false)} courseName="Full Stack Java Developer" amount={enrollAmount} accentColor="orange" />}
      {showCounsellor && <TalkToCounsellorModal courseName="Full Stack Java Developer" onClose={() => setShowCounsellor(false)} />}
    </div>
  );
}