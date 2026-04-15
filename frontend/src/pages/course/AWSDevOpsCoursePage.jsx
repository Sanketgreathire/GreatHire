import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";

const CURRICULUM = [
  {
    module: "Module 1",
    title: "Linux & Networking Fundamentals",
    duration: "1 Week",
    topics: [
      "Linux OS & Command Line Basics",
      "File System, Permissions & User Management",
      "Networking Concepts – IP, DNS, HTTP/S",
      "SSH, SCP & Remote Server Management",
      "Shell Scripting – Bash Automation",
      "Package Management – apt, yum",
    ],
  },
  {
    module: "Module 2",
    title: "AWS Core Services",
    duration: "3 Weeks",
    topics: [
      "AWS Global Infrastructure & IAM",
      "EC2 – Launch, Configure & Manage Instances",
      "S3 – Storage, Buckets, Policies & Versioning",
      "VPC – Subnets, Route Tables, Security Groups",
      "RDS – Managed Database Services",
      "Route 53 – DNS & Load Balancing",
      "CloudWatch – Monitoring & Alerts",
    ],
  },
  {
    module: "Module 3",
    title: "AWS Advanced & Serverless",
    duration: "2 Weeks",
    topics: [
      "Lambda – Serverless Functions",
      "API Gateway & Serverless Architecture",
      "ECS & EKS – Container Services",
      "SNS, SQS & Event-Driven Architecture",
      "CloudFormation – Infrastructure as Code",
      "AWS Cost Optimization & Billing",
    ],
  },
  {
    module: "Module 4",
    title: "DevOps Tools – Git, Docker & Jenkins",
    duration: "3 Weeks",
    topics: [
      "Git & GitHub – Advanced Branching & PR Workflows",
      "Docker – Images, Containers & Dockerfiles",
      "Docker Compose – Multi-Container Apps",
      "Jenkins – CI/CD Pipeline Setup",
      "Jenkins Plugins & Groovy Scripting",
      "Artifact Management with Nexus",
      "SonarQube – Code Quality Analysis",
    ],
  },
  {
    module: "Module 5",
    title: "Kubernetes (K8s)",
    duration: "2 Weeks",
    topics: [
      "Kubernetes Architecture – Master & Worker Nodes",
      "Pods, Deployments & ReplicaSets",
      "Services, Ingress & ConfigMaps",
      "Persistent Volumes & Storage Classes",
      "Helm Charts – K8s Package Manager",
      "Kubernetes on AWS (EKS)",
    ],
  },
  {
    module: "Module 6",
    title: "Terraform & Ansible",
    duration: "2 Weeks",
    topics: [
      "Terraform – Infrastructure as Code (IaC)",
      "Terraform Providers, Resources & Modules",
      "Ansible – Configuration Management",
      "Ansible Playbooks & Roles",
      "Terraform + Ansible Integration",
      "State Management & Remote Backends",
    ],
  },
  {
    module: "Module 7",
    title: "Real-World Projects & Interview Prep",
    duration: "2 Weeks",
    topics: [
      "End-to-End CI/CD Pipeline Project",
      "AWS 3-Tier Architecture Deployment",
      "Kubernetes Microservices Deployment",
      "Resume Building & GitHub Portfolio",
      "Mock Interviews & AWS Certification Prep",
      "Scenario-Based DevOps Interview Practice",
    ],
  },
];

const TOOLS = [
  { name: "AWS", color: "bg-yellow-100 text-yellow-800", icon: "☁️" },
  { name: "Docker", color: "bg-sky-100 text-sky-700", icon: "🐳" },
  { name: "Kubernetes", color: "bg-blue-100 text-blue-700", icon: "⚓" },
  { name: "Jenkins", color: "bg-red-100 text-red-700", icon: "🔧" },
  { name: "Terraform", color: "bg-purple-100 text-purple-700", icon: "🏗️" },
  { name: "Ansible", color: "bg-red-100 text-red-800", icon: "⚙️" },
  { name: "Git & GitHub", color: "bg-gray-100 text-gray-700", icon: "🐙" },
  { name: "Linux", color: "bg-orange-100 text-orange-700", icon: "🐧" },
  { name: "Helm", color: "bg-indigo-100 text-indigo-700", icon: "⛵" },
  { name: "SonarQube", color: "bg-teal-100 text-teal-700", icon: "🔍" },
  { name: "Prometheus", color: "bg-orange-100 text-orange-800", icon: "📊" },
  { name: "Grafana", color: "bg-emerald-100 text-emerald-700", icon: "📈" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Placement support with top product companies, startups & IT giants." },
  { icon: "🛠️", title: "Hands-On Lab Practice", desc: "Real AWS account labs, Docker containers & Kubernetes clusters." },
  { icon: "👨‍🏫", title: "Industry Expert Trainers", desc: "Learn from DevOps engineers with 10+ years at product companies." },
  { icon: "📋", title: "AWS Certification Prep", desc: "Full preparation for AWS Solutions Architect & DevOps Professional exams." },
  { icon: "🎖️", title: "Dual Certification", desc: "Great Hire Certificate + AWS Certified Professional prep." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline batches available." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to lab recordings, scripts, playbooks & interview prep." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated DevOps mentor for project reviews & job search strategy." },
];

const TESTIMONIALS = [
  {
    name: "Arun Kumar Rao",
    role: "DevOps Engineer @ Amazon",
    avatar: "AK",
    color: "bg-orange-500",
    rating: 5,
    text: "The AWS & DevOps course is extremely hands-on. Setting up real CI/CD pipelines and deploying on EKS gave me the exact skills Amazon was looking for. Best investment in my career!",
  },
  {
    name: "Sneha Reddy",
    role: "Cloud Engineer @ Microsoft",
    avatar: "SR",
    color: "bg-blue-500",
    rating: 5,
    text: "From Docker basics to Kubernetes on AWS, every topic is covered with real labs. The Terraform & Ansible modules gave me an edge over other DevOps candidates in interviews.",
  },
  {
    name: "Venkat Narasimha",
    role: "SRE @ Flipkart",
    avatar: "VN",
    color: "bg-green-500",
    rating: 5,
    text: "The CI/CD pipeline project was exactly what I needed. Understanding Jenkins + Docker + Kubernetes together helped me crack multiple technical rounds at product companies.",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "5 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "9 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "3 seats left", urgent: true },
];

const FAQS = [
  {
    q: "What background is needed to join AWS & DevOps course?",
    a: "Basic knowledge of any programming language and familiarity with computers is sufficient. Knowledge of Linux basics is a plus but not mandatory — we cover it in Module 1.",
  },
  {
    q: "What is the course duration?",
    a: "The AWS & DevOps course is approximately 4 months (15 weeks), covering Linux, AWS core & advanced services, Docker, Kubernetes, Terraform, Ansible, and real-world projects.",
  },
  {
    q: "Will I get AWS certification?",
    a: "We fully prepare you for AWS Certified Solutions Architect (Associate) and AWS Certified DevOps Engineer exams. Exam fees are separate but our training covers the complete syllabus.",
  },
  {
    q: "Is real AWS account access provided?",
    a: "Yes, we provide guided hands-on labs using real AWS accounts with credits. All labs are supervised to ensure you get maximum practice without unexpected billing.",
  },
  {
    q: "What are the salary expectations after this course?",
    a: "Entry-level DevOps/Cloud Engineers in India typically earn ₹5–8 LPA. With 1–2 years of experience and AWS certification, salaries range from ₹12–25 LPA.",
  },
  {
    q: "What is the course fee?",
    a: "The course fee is ₹38,000 including AWS lab access, all tools & project environments, certification prep, and placement support. EMI from ₹7,000/month available.",
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
          <span className="shrink-0 text-xs font-bold bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-orange-500 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-orange-50/40 border-t border-orange-100">
          <p className="text-xs text-orange-600 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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
            <button onClick={onClose} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-orange-600">Got it!</button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-1">Enroll Now</p>
              <h3 className="text-xl font-black text-gray-900">AWS & DevOps Course</h3>
              <p className="text-sm text-gray-500 mt-1">⚡ Limited seats — next batch starts soon!</p>
            </div>
            <div className="space-y-4">
              {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" }].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Batch</label>
                  <select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Weekday Batch</option><option>Weekend Batch</option><option>Fast Track</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Online</option><option>Offline</option><option>Hybrid</option>
                  </select>
                </div>
              </div>
              <button onClick={() => form.name && form.email && form.phone && setDone(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1">Book Free Demo Class →</button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AWSDevOpsCoursePage() {
  const [openModule, setOpenModule] = useState(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <section className="bg-gradient-to-br from-slate-900 via-orange-950 to-orange-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ea580c 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 Highest Salary</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Cloud & DevOps</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">AWS Certified Prep</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                AWS & DevOps<br />
                <span className="text-yellow-300">Training Course</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-orange-200">in Hyderabad</span>
              </h1>
              <p className="text-orange-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master AWS, Docker, Kubernetes, Jenkins, Terraform & Ansible with real-world CI/CD pipeline projects. Get certified and land high-paying DevOps & Cloud Engineer roles at top product companies.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[{ val: "4.9★", label: "Rating" }, { val: "3,200+", label: "Students" }, { val: "4 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (
                  <div key={s.label}><p className="text-xl font-black text-yellow-300">{s.val}</p><p className="text-xs text-orange-200 font-medium">{s.label}</p></div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowModal(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">🚀 Enroll Now — ₹38,000</button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">📥 Download Syllabus</button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-orange-200">
                <span>✅ No Cost EMI Available</span><span>✅ AWS Lab Access Included</span><span>✅ Free Demo Class</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.9</span><span className="text-xs text-gray-400">(3,200+ reviews)</span></div>
                <p className="text-3xl font-black text-orange-500 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">
                  {["📅 Next batch starts April 14", "⏱ 4 months duration", "☁️ AWS Lab Access Included", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS Access"].map((item) => (
                    <p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowModal(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">Book Free Demo Class</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to a Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure payment · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div><p className="text-xl font-black text-orange-500 leading-none">₹38,000</p><p className="text-xs text-gray-400">EMI from ₹7,000/mo</p></div>
          <button onClick={() => setShowModal(true)} className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>Course Overview
              </h2>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-base leading-relaxed mb-4">The <strong>AWS & DevOps Training Course</strong> at Great Hire is a comprehensive 4-month program covering AWS cloud services, Docker, Kubernetes, Jenkins CI/CD, Terraform, and Ansible. You'll build real CI/CD pipelines and deploy production-grade applications on AWS.</p>
                <p className="text-gray-700 text-base leading-relaxed">With hands-on AWS lab access, 3+ real-world projects, and direct placement support through Great Hire's tech network, this course is your fastest path to a high-paying cloud & DevOps career.</p>
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
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>Why This Course?
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
                  <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 15 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => <AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />)}
              </div>
              <div className="mt-4 text-center"><button className="text-orange-500 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button></div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((t) => (
                  <span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}><span className="text-base">{t.icon}</span>{t.name}</span>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>Upcoming Batches
              </h2>
              <div className="space-y-4">
                {BATCHES.map((b) => (
                  <div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-orange-100" : "bg-gray-100"}`}>📅</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-gray-900">{b.type}</p>{b.urgent && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Filling Fast</span>}</div>
                        <p className="text-sm text-gray-500 mt-0.5">{b.schedule} · {b.time} · {b.mode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p className="text-xs text-gray-500 font-medium">{b.seats}</p>
                      <button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>Student Reviews
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
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>Frequently Asked Questions
              </h2>
              <div className="space-y-3">{FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}</div>
            </section>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.9</span><span className="text-xs text-gray-400">(3,200+)</span></div>
                <p className="text-3xl font-black text-orange-500 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700">
                  {["📅 Next batch: April 14, 2025", "⏱ Duration: 4 months", "☁️ AWS Lab Access Included", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 Lifetime LMS Access", "👥 Batch size: 15 students"].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>
                <button onClick={() => setShowModal(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">Book Free Demo Class</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-orange-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <button className="bg-white text-orange-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">Share & Earn</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-orange-600 to-orange-800 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Launch Your Cloud & DevOps Career</h2>
          <p className="text-orange-100 text-base sm:text-lg mb-8 leading-relaxed">Join 3,200+ students who've secured high-paying cloud roles at Amazon, Microsoft, Flipkart & more with Great Hire.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowModal(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
          </div>
        </div>
      </section>
      <Footer />
      {showModal && <EnrollModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
