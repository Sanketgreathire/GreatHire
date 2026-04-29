import { useState, lazy, Suspense } from "react";
import { Stars, FaqItem } from "./_shared";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const CourseEnrollModal = lazy(() => import("@/components/CourseEnrollModal"));
const TalkToCounsellorModal = lazy(() => import("@/components/TalkToCounsellorModal"));

const CURRICULUM = [
  {
    module: "Module 1",
    title: "Software Testing Fundamentals",
    duration: "1 Week",
    topics: [
      "Introduction to Software Testing & SDLC",
      "STLC – Software Testing Life Cycle",
      "Types of Testing – Manual, Automation, Performance",
      "Test Levels – Unit, Integration, System, UAT",
      "Black Box, White Box & Grey Box Testing",
      "Testing Principles & Best Practices",
    ],
  },
  {
    module: "Module 2",
    title: "Manual Testing",
    duration: "2 Weeks",
    topics: [
      "Test Planning & Test Strategy",
      "Test Case Design – Boundary Value, Equivalence Partitioning",
      "Test Execution & Defect Reporting",
      "Defect Life Cycle & Bug Tracking",
      "Regression Testing & Smoke Testing",
      "Jira – Test Management & Bug Reporting",
      "Agile Testing – Scrum & Sprint Testing",
    ],
  },
  {
    module: "Module 3",
    title: "Selenium WebDriver with Java",
    duration: "4 Weeks",
    topics: [
      "Java Basics for Automation – OOP Concepts",
      "Selenium WebDriver Architecture",
      "Locators – XPath, CSS Selector, ID, Name",
      "WebDriver Commands & Browser Interactions",
      "Handling Dropdowns, Alerts & Frames",
      "TestNG Framework – Annotations & Reports",
      "Page Object Model (POM) Design Pattern",
    ],
  },
  {
    module: "Module 4",
    title: "Advanced Selenium & Frameworks",
    duration: "2 Weeks",
    topics: [
      "Data-Driven Testing with Excel & Apache POI",
      "Cross-Browser Testing with Selenium Grid",
      "Maven Build Tool & Dependency Management",
      "Jenkins CI/CD Integration with Selenium",
      "Cucumber BDD Framework",
      "Extent Reports & Test Reporting",
    ],
  },
  {
    module: "Module 5",
    title: "API Testing",
    duration: "2 Weeks",
    topics: [
      "REST API Testing Concepts",
      "Postman – Manual API Testing",
      "Rest Assured – API Automation with Java",
      "JSON & XML Response Validation",
      "Authentication – OAuth, JWT, Basic Auth",
      "API Testing Best Practices & Frameworks",
    ],
  },
  {
    module: "Module 6",
    title: "Performance Testing with JMeter",
    duration: "1 Week",
    topics: [
      "Performance Testing Concepts – Load, Stress, Soak",
      "JMeter Setup & Test Plan Creation",
      "Thread Groups, Samplers & Listeners",
      "Assertions & Timers in JMeter",
      "Performance Test Reports & Analysis",
      "BlazeMeter Cloud Testing Basics",
    ],
  },
  {
    module: "Module 7",
    title: "Real-World Projects & Interview Prep",
    duration: "2 Weeks",
    topics: [
      "End-to-End Automation Framework Project",
      "API + UI Automation Project",
      "Performance Test Scenario Project",
      "Resume Building & GitHub Portfolio",
      "Mock Interviews & ISTQB Certification Prep",
      "Testing Interview Q&A Practice",
    ],
  },
];

const TOOLS = [
  { name: "Selenium", color: "bg-green-100 text-green-700", icon: "🌐" },
  { name: "Java", color: "bg-orange-100 text-orange-700", icon: "☕" },
  { name: "TestNG", color: "bg-blue-100 text-blue-700", icon: "✅" },
  { name: "Postman", color: "bg-orange-100 text-orange-800", icon: "📮" },
  { name: "Rest Assured", color: "bg-teal-100 text-teal-700", icon: "🔗" },
  { name: "JMeter", color: "bg-red-100 text-red-700", icon: "⚡" },
  { name: "Jira", color: "bg-blue-100 text-blue-800", icon: "🐛" },
  { name: "Jenkins", color: "bg-gray-100 text-gray-700", icon: "🔧" },
  { name: "Maven", color: "bg-purple-100 text-purple-700", icon: "📦" },
  { name: "Cucumber BDD", color: "bg-emerald-100 text-emerald-700", icon: "🥒" },
  { name: "Git & GitHub", color: "bg-gray-100 text-gray-800", icon: "🐙" },
  { name: "ISTQB Prep", color: "bg-yellow-100 text-yellow-700", icon: "🎖️" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Placement support with top IT services, product companies & MNCs." },
  { icon: "🛠️", title: "Hands-On Framework Building", desc: "Build a complete automation framework from scratch as part of training." },
  { icon: "👨‍🏫", title: "Industry Expert Trainers", desc: "Learn from QA professionals with 10+ years in manual & automation testing." },
  { icon: "📋", title: "Regular Mock Tests", desc: "Weekly assessments, bug hunting exercises & automation challenges." },
  { icon: "🎖️", title: "ISTQB Certification Prep", desc: "Full preparation for ISTQB Foundation Level certification exam." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options to fit your schedule." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to recorded sessions, test scripts & interview prep." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated QA mentor for framework reviews and career guidance." },
];

const TESTIMONIALS = [
  {
    name: "Srikant Rao",
    role: "Automation Test Enginee",
    avatar: "SR",
    color: "bg-green-500",
    rating: 5,
    text: "The Selenium + TestNG + POM framework training was exactly what HCL was looking for. Building the complete automation framework during the course was the best part. Placed within 30 days!",
  },
  {
    name: "Divya Menon",
    role: "QA Engineer",
    avatar: "DM",
    color: "bg-blue-500",
    rating: 5,
    text: "From manual testing basics to REST API automation with Rest Assured — this course covers everything. The Cucumber BDD module was a real differentiator in my Infosys interview.",
  },
  {
    name: "Naveen Kumar",
    role: "Performance Test Engineer",
    avatar: "NK",
    color: "bg-purple-500",
    rating: 5,
    text: "JMeter and performance testing is rarely taught well, but Great Hire's trainer covered it thoroughly with real scenarios. The ISTQB prep helped me get certified along with placement!",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "6 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "10 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "4 seats left", urgent: true },
];

const FAQS = [
  {
    q: "Do I need programming knowledge to learn Testing Tools?",
    a: "For manual testing, no programming knowledge is required. For Selenium automation, we teach Java from basics — you only need logical thinking and basic computer knowledge to get started.",
  },
  {
    q: "What is the course duration?",
    a: "The Testing Tools course is approximately 4 months (14 weeks) covering manual testing, Selenium automation, API testing with Postman & Rest Assured, JMeter performance testing, and project work.",
  },
  {
    q: "What is ISTQB certification and will you help me get it?",
    a: "ISTQB (International Software Testing Qualifications Board) Foundation Level is a globally recognized testing certification. We fully prepare you for the exam — the registration fee is separate.",
  },
  {
    q: "What are the job roles after this course?",
    a: "Manual Tester, Automation Test Engineer, QA Engineer, API Test Engineer, Performance Tester, Test Analyst, SDET (Software Development Engineer in Test), and QA Lead roles.",
  },
  {
    q: "Is this course suitable for freshers?",
    a: "Absolutely! Many of our students are freshers from CS, IT, or any graduation background. The course starts from absolute basics and builds up to advanced automation frameworks.",
  },
  {
    q: "What is the course fee?",
    a: "The course fee is ₹38,000 including all software tools, project environments, and placement support. EMI from ₹7,000/month available.",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-green-300 shadow-sm" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-green-100 text-green-600 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-green-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-green-50/40 border-t border-green-100">
          <p className="text-xs text-green-600 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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
        body: JSON.stringify({ ...form, courseName: "Testing Tools", type: "demo" }),
      });
    } catch (_) {}
    setLoading(false); setDone(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {done ? (
          <div className="p-8 text-center"><div className="text-5xl mb-4">🎓</div><h3 className="text-xl font-black text-gray-900 mb-2">Demo Booked!</h3><p className="text-gray-500 text-sm mb-6">Our counsellor will contact you within 2 hours to confirm your free demo session.</p><button onClick={onClose} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-teal-700">Got it!</button></div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-teal-600 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900">Testing Tools</h3><p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p></div>
            <div className="space-y-4">
              {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" }].map(({ label, key, type, placeholder }) => (
                <div key={key}><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label><input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
              ))}
              <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Preferred Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"><option>Online</option><option>Offline</option><option>Hybrid</option></select></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">{loading ? "Submitting..." : "Book Free Demo Class →"}</button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function TestingToolsCoursePage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <section className="bg-gradient-to-br from-slate-900 via-green-950 to-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #16a34a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #15803d 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 Top Fresher Course</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">QA & Automation</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">ISTQB Prep</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                Testing Tools<br />
                <span className="text-yellow-300">Training Course</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-green-200">in Hyderabad</span>
              </h1>
              <p className="text-green-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master Manual Testing, Selenium WebDriver, API Testing with Postman & Rest Assured, and JMeter Performance Testing. Build real automation frameworks and land QA roles at top IT companies.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[{ val: "4.8★", label: "Rating" }, { val: "3,500+", label: "Students" }, { val: "4 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (
                  <div key={s.label}><p className="text-xl font-black text-yellow-300">{s.val}</p><p className="text-xs text-green-200 font-medium">{s.label}</p></div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">🚀 Enroll Now — ₹38,000</button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">📥 Download Syllabus</button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-green-200">
                <span>✅ No Cost EMI Available</span><span>✅ ISTQB Certification Prep</span><span>✅ Free Demo Class</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.8</span><span className="text-xs text-gray-400">(3,500+ reviews)</span></div>
                <p className="text-3xl font-black text-green-600 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">
                  {["📅 Next batch starts April 14", "⏱ 4 months duration", "🎖 ISTQB Certification Prep", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS Access"].map((item) => (
                    <p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
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
          <div><p className="text-xl font-black text-green-600 leading-none">₹38,000</p><p className="text-xs text-gray-400">EMI from ₹7,000/mo</p></div>
          <button onClick={() => setShowEnroll(true)} className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-green-600 rounded-full inline-block"></span>Course Overview
              </h2>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-base leading-relaxed mb-4">The <strong>Testing Tools Course</strong> at Great Hire is a comprehensive 4-month program covering Manual Testing, Selenium WebDriver with Java, TestNG, API Testing (Postman + Rest Assured), JMeter Performance Testing, and CI/CD integration with Jenkins. You'll build a complete automation framework from scratch.</p>
                <p className="text-gray-700 text-base leading-relaxed">With real-world project experience, ISTQB exam preparation, and direct placement support through Great Hire's IT hiring network, this course is your gateway to a quality assurance career at top tech companies.</p>
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
                <span className="w-1 h-7 bg-green-600 rounded-full inline-block"></span>Why This Course?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-sm transition-all group">
                    <div className="w-11 h-11 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">{h.icon}</div>
                    <div><p className="font-bold text-gray-900 text-sm mb-0.5">{h.title}</p><p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p></div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-7 bg-green-600 rounded-full inline-block"></span>Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 14 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => <AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />)}
              </div>
              <div className="mt-4 text-center"><button className="text-green-600 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button></div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-green-600 rounded-full inline-block"></span>Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((t) => (
                  <span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}><span className="text-base">{t.icon}</span>{t.name}</span>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-green-600 rounded-full inline-block"></span>Upcoming Batches
              </h2>
              <div className="space-y-4">
                {BATCHES.map((b) => (
                  <div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-green-100" : "bg-gray-100"}`}>📅</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-gray-900">{b.type}</p>{b.urgent && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Filling Fast</span>}</div>
                        <p className="text-sm text-gray-500 mt-0.5">{b.schedule} · {b.time} · {b.mode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p className="text-xs text-gray-500 font-medium">{b.seats}</p>
                      <button onClick={() => setShowEnroll(true)} className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-green-600 rounded-full inline-block"></span>Student Reviews
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
                <span className="w-1 h-7 bg-green-600 rounded-full inline-block"></span>Frequently Asked Questions
              </h2>
              <div className="space-y-3">{FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}</div>
            </section>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.8</span><span className="text-xs text-gray-400">(3,500+)</span></div>
                <p className="text-3xl font-black text-green-600 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700">
                  {["📅 Next batch: April 14, 2025", "⏱ Duration: 4 months", "🎖 ISTQB Certification Prep", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS Access", "👥 Batch size: 15 students"].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-green-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("🧪 Check out this Testing Tools Course at Great Hire! Master Selenium, API Testing & JMeter with 100% placement support.\n" + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-green-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                  Share & Earn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-green-700 to-green-900 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Start Your QA Testing Career Today</h2>
          <p className="text-green-100 text-base sm:text-lg mb-8 leading-relaxed">Join 3,500+ students who've launched successful QA careers at HCL, Infosys, TCS & product companies with Great Hire.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
          </div>
        </div>
      </section>
      <Footer />
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {showEnroll && <CourseEnrollModal onClose={() => setShowEnroll(false)} courseName="Testing Tools" amount={38000} accentColor="green" />}
    </div>
  );
}
