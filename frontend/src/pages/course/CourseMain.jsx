import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { DivideCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────

const COURSES = [
  {
    id: 1,
    icon: "💻",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop",
    category: "Full Stack",
    title: "Full Stack Java Developer",
    desc: "Master front-end, back-end, and database management with Java, Spring Boot, React, and more.",
    duration: "6 Months",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "Most Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    skills: ["Java", "Spring Boot", "React", "MySQL", "REST APIs"],
    color: "border-blue-500",
    iconBg: "bg-blue-50",
    link: "/courses/java-training"
  },
  {
    id: 2,
    icon: "🐍",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop",
    category: "Full Stack",
    title: "Full Stack Python Developer",
    desc: "Build scalable web apps using Python, Django/Flask, React, and cloud deployment.",
    duration: "6 Months",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "Trending",
    badgeColor: "bg-emerald-100 text-emerald-700",
    skills: ["Python", "Django", "React", "PostgreSQL", "AWS"],
    color: "border-emerald-500",
    iconBg: "bg-emerald-50",
    link: "/courses/python-training",
  },
  {
    id: 3,
    icon: "📊",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    category: "Data Science",
    title: "Data Science & AI",
    desc: "Learn big data, machine learning, deep learning, and AI with real-world projects.",
    duration: "5 Months",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "High Demand",
    badgeColor: "bg-violet-100 text-violet-700",
    skills: ["Python", "ML", "TensorFlow", "Power BI", "Statistics"],
    color: "border-violet-500",
    iconBg: "bg-violet-50",
    link: "/courses/data-science-training",
  },
  {
    id: 4,
    icon: "☁️",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    category: "Cloud",
    title: "AWS Cloud Practitioner",
    desc: "Get certified in AWS core services, cloud architecture, security, and deployment.",
    duration: "3 Months",
    mode: "Online / Offline",
    fee: "₹18,000",
    badge: "Certified",
    badgeColor: "bg-orange-100 text-orange-700",
    skills: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
    color: "border-orange-500",
    iconBg: "bg-orange-50",
    link: "/courses/aws-cloud",
  },
  {
    id: 5,
    icon: "📱",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop",
    category: "Digital Marketing",
    title: "Digital Marketing",
    desc: "Master SEO, SEM, social media marketing, email marketing and Google Analytics.",
    duration: "3 Months",
    mode: "Online / Offline",
    fee: "₹15,000",
    badge: null,
    badgeColor: "",
    skills: ["SEO", "Google Ads", "Meta Ads", "Email", "Analytics"],
    color: "border-pink-500",
    iconBg: "bg-pink-50",
    link: "/courses/digital-marketing-training",
  },
  {
    id: 6,
    icon: "🧪",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
    category: "Testing",
    title: "Data Analytics",
    desc: "Learn Python, SQL, Power BI, and Machine Learning for data-driven decision-making. Master data visualization, predictive analytics, and real-world projects to boost your Data Analytics career.",
    duration: "4 Months",
    mode: "Online / Offline",
    fee: "₹30,499",
    badge: null,
    badgeColor: "",
    skills: ["Selenium", "TestNG", "Postman", "JIRA", "Cucumber"],
    color: "border-teal-500",
    iconBg: "bg-teal-50",
    link: "/courses/data-analytics-training",
  },
  {
    id: 7,
    icon: "💼",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    category: "SAP",
    title: "Saleforce",
    desc: "The course covers CRM fundamentals, automation, and data management using the latest Salesforce tools. Offering hands-on training in Salesforce Administration, Apex, Lightning, and Integration techniques.",
    duration: "4 Months",
    mode: "Online / Offline",
    fee: "₹20,000",
    badge: null,
    badgeColor: "",
    skills: ["SAP FI", "SAP CO", "FICO Config", "S/4HANA", "Reporting"],
    color: "border-yellow-500",
    iconBg: "bg-yellow-50",
    link: "/courses/saleforce-training",
  },
  {
    id: 8,
    icon: "🤖",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "AI & BA",
    title: "AI & Business Analyst",
    desc: "Combine AI tools with business analytics to drive data-driven decision making.",
    duration: "4 Months",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["ChatGPT APIs", "Power BI", "SQL", "Excel", "Tableau"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/ai-business-analyst",
  },
];

const CATEGORIES = ["All", "Full Stack", "Data Science", "Cloud", "Digital Marketing", "Testing", "SAP", "AI & BA"];

// const STATS = [
//   { value: "50+", label: "Courses Offered" },
//   { value: "15,000+", label: "Students Trained" },
//   { value: "95%", label: "Placement Rate" },
//   { value: "500+", label: "Hiring Partners" },
// ];

const FEATURES = [
  { icon: "🎓", title: "Industry Expert Trainers", desc: "Learn from professionals with 10+ years of real-world industry experience." },
  { icon: "🛠️", title: "Hands-On Projects", desc: "Build a portfolio of real projects that impress recruiters from day one." },
  { icon: "📋", title: "Regular Assessments", desc: "Track your growth with frequent tests, mock interviews, and evaluations." },
  { icon: "💼", title: "100% Placement Assistance", desc: "Get direct connections to 500+ hiring partners through Great Hire's network." },
  { icon: "🎖️", title: "Industry Certifications", desc: "Earn recognized certificates that validate your skills to top employers." },
  { icon: "🔄", title: "Flexible Learning Modes", desc: "Choose from online, offline, or hybrid batch schedules that fit your life." },
];

const TESTIMONIALS = [
  {
    name: "Arjun Sharma",
    role: "Full Stack Developer @ TCS",
    course: "Full Stack Java",
    text: "The training quality was exceptional. I got placed within 2 months of completing the course. The hands-on projects really made the difference.",
    rating: 5,
    avatar: "AS",
    avatarColor: "bg-blue-500",
  },
  {
    name: "Priya Reddy",
    role: "Data Analyst @ Infosys",
    course: "Data Science & AI",
    text: "Best investment of my life. The instructors are extremely knowledgeable and the placement support is top-notch.",
    rating: 5,
    avatar: "PR",
    avatarColor: "bg-violet-500",
  },
  {
    name: "Rahul Mehta",
    role: "AWS Cloud Engineer @ Wipro",
    course: "AWS Cloud",
    text: "I cleared my AWS certification in the first attempt. The study material and mock tests were perfectly aligned with the exam.",
    rating: 5,
    avatar: "RM",
    avatarColor: "bg-orange-500",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CourseCard({ course, onEnroll }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border border-gray-100">
      
      {/* Image Section */}
      <div className="relative h-44 mb-8 overflow-visible">
        <img
          src={course.image}
          alt=""
          className="w-full h-full object-cover"
        />

        {/* Center overlapping box (FIXED) */}
        <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2">
          <div className="sm:text-6xl lg:text-2xl font-bold hover:text-blue-600 transition duration-300 ease-in-out bg-white rounded-xl px-5 py-2.5 shadow-lg flex items-center">
              <span className="text-black dark:text-white">Great</span>
              <span className="text-blue-600">Hire</span>
            </div>
        </div>

        {/* Badge */}
        {course.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${course.badgeColor} shadow-sm`}
          >
            {course.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 pt-6 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
          {course.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed flex-1">
          {course.desc}
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onEnroll(course)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200"
          >
            Enquiry Now
          </button>

          {course.link && (
            <Link
              to={course.link}
              className="flex-1 text-center bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200"
            >
              Know More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Enroll Modal ─────────────────────────────────────────────────────────────

function EnrollModal({ course, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", mode: "Online" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ×
        </button>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enrollment Requested!</h3>
            <p className="text-gray-500 text-sm mb-6">Our team will contact you within 24 hours to confirm your batch.</p>
            <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700">
              Done
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className={`w-10 h-10 ${course.iconBg} rounded-lg flex items-center justify-center text-xl`}>{course.icon}</div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Enrolling in</p>
                <p className="text-sm font-bold text-gray-900">{course.title}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Phone Number</label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Preferred Mode</label>
                <select
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors duration-200 mt-2"
              >
                Submit Enrollment Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrainingCoursesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = COURSES.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Navbar ── */}
      <Navbar/>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            🎓 Great Hire Training partner with Teks Academy
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-5 leading-tight">
            Top Software Training<br />
            <span className="text-yellow-300">Courses in Hyderabad</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Job-oriented IT training with industry experts, real projects, and 100% placement assistance. Get hired faster through Great Hire's network of 500+ companies.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
              <svg className="w-5 h-5 text-gray-400 ml-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses — Python, AWS, Data Science..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-4 text-gray-800 text-sm focus:outline-none placeholder-gray-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-4 transition-colors whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      {/* <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {STATS.map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <p className="text-3xl sm:text-4xl font-black text-blue-600 mb-1">{s.value}</p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Courses ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Explore Our Courses
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            50+ industry-recognized programs designed with leading companies to get you job-ready.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-6 text-center">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} onEnroll={setEnrollCourse} />
              ))}
            </div>

          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg font-medium">No courses found for "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ── Why Great Hire Training ── */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Why Train with Great Hire?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              We don't just train you — we connect you directly to hiring opportunities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:shadow-md transition-shadow">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-base">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Student Success Stories</h2>
            <p className="text-gray-500 text-lg">Real results from real students placed through Great Hire.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <StarRating count={t.rating} />
                <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className={`w-10 h-10 ${t.avatarColor} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                    <span className="text-xs font-medium text-blue-600">{t.course}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Launch Your Tech Career?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join 15,000+ students who trained with Great Hire and got placed in top companies across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setEnrollCourse(COURSES[0])}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap"
            >
              🚀 Enroll Now — Free Demo
            </button>
            <button className="border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-base transition-colors whitespace-nowrap">
              📞 Talk to a Counsellor
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            📍 Centres in Hyderabad · Visakhapatnam · Bangalore &nbsp;|&nbsp; 🌐 Online batches available
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer/>

      {/* ── Enroll Modal ── */}
      {enrollCourse && (
        <EnrollModal course={enrollCourse} onClose={() => setEnrollCourse(null)} />
      )}
    </div>
  );
}



