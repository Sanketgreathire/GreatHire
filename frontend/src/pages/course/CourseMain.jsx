import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState, useMemo, lazy, Suspense, memo, useCallback } from "react";
import { Link } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────

const COURSES = [
  {
    id: 1,
    icon: "💻",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop",
    category: "Full Stack",
    title: "Full Stack Java Developer",
    desc: "Gain expertise in Core Java, Spring Boot, Hibernate, SQL, and REST APIs to build enterprise-level apps. Teks guides you toward high-demand roles like Java Developer and DevOps Engineer.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "Most Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    skills: ["Java", "Spring Boot", "React", "MySQL", "REST APIs"],
    color: "border-blue-500",
    iconBg: "bg-blue-50",
    link: "/courses/java-training",
    tab: "employment",
  },
  {
    id: 2,
    icon: "🐍",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop",
    category: "Full Stack",
    title: "Full Stack Python Developer",
    desc: "Crack Python with Django, Flask, React, and MySQL to build powerful and robust web applications. Get an exclusive opportunity to learn from decades of industry-experienced faculty.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "Trending",
    badgeColor: "bg-emerald-100 text-emerald-700",
    skills: ["Python", "Django", "React", "PostgreSQL", "AWS"],
    color: "border-emerald-500",
    iconBg: "bg-emerald-50",
    link: "/courses/python-training",
    tab: "employment",
  },
  {
    id: 3,
    icon: "📊",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    category: "Data Science",
    title: "Data Science",
    desc: "Learn most simplified and Advanced data science with AI, Machine Learning, Python, Deep Learning, and Big Data to solve real-world challenges. Let's step into the future of data innovations.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "High Demand",
    badgeColor: "bg-violet-100 text-violet-700",
    skills: ["Python", "ML", "TensorFlow", "Power BI", "Statistics"],
    color: "border-violet-500",
    iconBg: "bg-violet-50",
    link: "/courses/data-science-training",
    tab: "employment",
  },
  {
    id: 4,
    icon: "☁️",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    category: "Cloud",
    title: "AWS & DevOps",
    desc: "Explore the power of AWS, CI/CD, Docker, Kubernetes, and Automation to build resilient, cloud-native systems. Gain practical expertise in DevOps tools and practices and build futuristic skills.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "Certified",
    badgeColor: "bg-orange-100 text-orange-700",
    skills: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
    color: "border-orange-500",
    iconBg: "bg-orange-50",
    link: "/courses/aws-devops-training",
    tab: "employment",
  },
  {
    id: 5,
    icon: "📱",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop",
    category: "Digital Marketing",
    title: "Digital Marketing",
    desc: "Become a digital marketer with advanced SEO techniques, high-impact Google Ads strategies, dynamic social media management, data-driven content strategy, and in-depth marketing analytics.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: null,
    badgeColor: "",
    skills: ["SEO", "Google Ads", "Meta Ads", "Email", "Analytics"],
    color: "border-pink-500",
    iconBg: "bg-pink-50",
    link: "/courses/digital-marketing-training",
    tab: "employment",
  },
  {
    id: 6,
    icon: "🧪",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
    category: "Testing",
    title: "Data Analytics",
    desc: "Learn Python, SQL, Power BI, and Machine Learning for data-driven decision-making. Master data visualization, predictive analytics, and real-world projects to boost your Data Analytics career.",
    mode: "Online / Offline",
    fee: "₹30,499",
    badge: null,
    badgeColor: "",
    skills: ["Data Analytics"],
    color: "border-teal-500",
    iconBg: "bg-teal-50",
    link: "/courses/data-analytics-training",
    tab: "employment",
  },
  {
    id: 7,
    icon: "💼",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    category: "SAP",
    title: "Saleforce",
    desc: "The course covers CRM fundamentals, automation, and data management using the latest Salesforce tools. Offering hands-on training in Salesforce Administration, Apex, Lightning, and Integration techniques.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: null,
    badgeColor: "",
    skills: ["Saleforce"],
    color: "border-yellow-500",
    iconBg: "bg-yellow-50",
    link: "/courses/saleforce-training",
    tab: "employment",
  },
  {
    id: 8,
    icon: "🤖",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "SAP FICO",
    title: "SAP FICO",
    desc: "Make your career with SAP FICO Training, designed for high-paying jobs in financial accounting and controlling. Learn SAP ERP, ledger management and AI tools.",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["SAP FICO"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/sap-fico-training",
    tab: "employment",
  },
  {
    id: 9,
    icon: "🏗️",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "BIM",
    title: "BIM",
    desc: "Learn Building Information Modeling (BIM) under guidance of most experienced trainers in AutoCAD, Revit, 3D Visualization, and Construction Technology. Join the best BIM Course!",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["AutoCAD", "Revit", "3D Visualization"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/bim-training",
    tab: "employment",
  },
  {
    id: 10,
    icon: "🏥",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "Medical Coding",
    title: "Medical Coding",
    desc: "Want to become a certified medical coder? Our best medical coding course at Teks is the right choice. Learn ICD-10, CPT, HCPCS, insurance claims, and more to be a medicoder.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["Medical Coding"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/medical-training",
    tab: "employment",
  },
  {
    id: 11,
    icon: "🧰",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "Testing Tools",
    title: "Testing Tools",
    desc: "Become an expert in Manual & Automation Testing with industry-leading tools- Selenium, JIRA, LoadRunner, and QTP. Work on real-time QA and software testing projects.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["Testing Tools"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/testing-tools-training",
    tab: "employment",
  },
  {
    id: 12,
    icon: "🔬",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "VLSI",
    title: "VLSI",
    desc: "Master best VLSI training with practical training in HDL, FPGA, ASIC design, and verification. Semiconductor technology awaits! Secure jobs in electronics and chip design industry.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["VLSI"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/vlsi-training",
    tab: "employment",
  },
  {
    id: 13,
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "Multimedia",
    title: "Multimedia",
    desc: "Turn your passion into a profession with mesmerizing Multimedia Training in Hyderabad. Expertise in graphic design, video editing, 3D animation, and VFX.",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["Graphic Design", "Video Editing", "3D Animation", "VFX"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/multimedia-training",
    tab: "employment",
  },
  {
    id: 14,
    icon: "📈",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "Advance Excel",
    title: "Advance Excel",
    desc: "Excel with Advanced Excel Training and become proficient in pivot tables, macros, VBA, and data visualization. Gain financial modeling, dashboard creation, and business analytics.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["Excel"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/advanced-excel-training",
    tab: "employment",
  },
  {
    id: 15,
    icon: "📐",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "AutoCAD",
    title: "AutoCAD",
    desc: "With the best AutoCAD training institute, you will become an expert with practical training in architectural drafting, 3D modeling, and automation. Learn industry-standard tools for building designs.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["AutoCAD"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/autocad-training",
    tab: "employment",
  },
  {
    id: 16,
    icon: "🔧",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "Revit MEP",
    title: "Revit MEP",
    desc: "Master Revit MEP for Mechanical, Electrical, and Plumbing Design by doing hands-on projects. Gain expertise in BIM workflows, 3D modeling, and coordination with the top Revit MEP training.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["Revit MEP"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/revit-mep-training",
    tab: "employment",
  },
  {
    id: 17,
    icon: "📊",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "Business Analytics",
    title: "Business Analytics",
    desc: "Master Excel, SQL, Power BI & data-driven decisions. This analytics program prepares you for analyst roles with hands-on tools and business intelligence techniques.",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["Business Analytics"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/business-analytics-training",
    tab: "employment",
  },
  {
    id: 18,
    icon: "🤖",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "Generative AI",
    title: "Generative AI",
    desc: "Master GenAI tools like ChatGPT, DALL·E & NLP. Learn prompt engineering and AI content creation with hands-on projects and expert mentoring at Teks Academy.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["Generative AI"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/generative-AI-training",
    tab: "employment",
  },
  {
    id: 19,
    icon: "🗄️",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "SAP MM",
    title: "SAP MM",
    desc: "Learn procurement, inventory management, invoice verification, and SAP tools from experts. Get real-time system access and job-ready training in SAP Materials Management.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["SAP MM"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/sap-mm-training",
    tab: "employment",
  },
  {
    id: 20,
    icon: "🔐",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "Cyber Security",
    title: "Cyber Security",
    desc: "Gain skills in ethical hacking, firewalls, and network security. Learn tools like Wireshark, Metasploit, and SOC operations from certified trainers with placement support.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["Cyber Security"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/cyber-security-training",
    tab: "employment",
  },
  {
    id: 21,
    icon: "📋",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "PMP",
    title: "PMP",
    desc: "Master leadership, team management, risk analysis, and communication with modules in governance, budgeting, negotiation, and conflict resolution to lead modern projects.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["PMP"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/pmp-training",
    tab: "employment",
  },
  // ── TIH-IIT Certification Program courses ────────────────────────────────
  // Add your IIT certification courses here with tab: "certification"
  // Example placeholder:
  {
    id: 22,
    icon: "💻",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop",
    category: "Full Stack",
    title: "Full Stack Java Developer",
    desc: "Gain expertise in Core Java, Spring Boot, Hibernate, SQL, and REST APIs to build enterprise-level apps. Teks guides you toward high-demand roles like Java Developer and DevOps Engineer.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "Most Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    skills: ["Java", "Spring Boot", "React", "MySQL", "REST APIs"],
    color: "border-blue-500",
    iconBg: "bg-blue-50",
    link: "/courses/java-training",
    tab: "certification",
  },
  {
    id: 23,
    icon: "🐍",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop",
    category: "Full Stack",
    title: "Full Stack Python Developer",
    desc: "Crack Python with Django, Flask, React, and MySQL to build powerful and robust web applications. Get an exclusive opportunity to learn from decades of industry-experienced faculty.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "Trending",
    badgeColor: "bg-emerald-100 text-emerald-700",
    skills: ["Python", "Django", "React", "PostgreSQL", "AWS"],
    color: "border-emerald-500",
    iconBg: "bg-emerald-50",
    link: "/courses/python-training",
    tab: "certification",
  },
  {
    id: 24,
    icon: "📊",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    category: "Data Science",
    title: "Data Science",
    desc: "Learn most simplified and Advanced data science with AI, Machine Learning, Python, Deep Learning, and Big Data to solve real-world challenges. Let's step into the future of data innovations.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "High Demand",
    badgeColor: "bg-violet-100 text-violet-700",
    skills: ["Python", "ML", "TensorFlow", "Power BI", "Statistics"],
    color: "border-violet-500",
    iconBg: "bg-violet-50",
    link: "/courses/data-science-training",
    tab: "certification",
  },
  {
    id: 25,
    icon: "📱",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop",
    category: "Digital Marketing",
    title: "Digital Marketing",
    desc: "Become a digital marketer with advanced SEO techniques, high-impact Google Ads strategies, dynamic social media management, data-driven content strategy, and in-depth marketing analytics.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: null,
    badgeColor: "",
    skills: ["SEO", "Google Ads", "Meta Ads", "Email", "Analytics"],
    color: "border-pink-500",
    iconBg: "bg-pink-50",
    link: "/courses/digital-marketing-training",
    tab: "certification",
  },
  {
    id: 26,
    icon: "☁️",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    category: "Cloud",
    title: "AWS & DevOps",
    desc: "Explore the power of AWS, CI/CD, Docker, Kubernetes, and Automation to build resilient, cloud-native systems. Gain practical expertise in DevOps tools and practices and build futuristic skills.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "Certified",
    badgeColor: "bg-orange-100 text-orange-700",
    skills: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
    color: "border-orange-500",
    iconBg: "bg-orange-50",
    link: "/courses/aws-devops-training",
    tab: "certification",
  },
  {
    id: 27,
    icon: "🏗️",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop",
    category: "BIM",
    title: "BIM",
    desc: "Learn Building Information Modeling (BIM) under guidance of most experienced trainers in AutoCAD, Revit, 3D Visualization, and Construction Technology. Join the best BIM Course!",
    mode: "Online / Offline",
    fee: "₹25,000",
    badge: "New",
    badgeColor: "bg-rose-100 text-rose-700",
    skills: ["AutoCAD", "Revit", "3D Visualization"],
    color: "border-rose-500",
    iconBg: "bg-rose-50",
    link: "/courses/bim-training",
   tab: "certification",
  },
  {
    id: 28,
    icon: "☁️",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    category: "Cloud",
    title: "AWS & DevOps",
    desc: "Explore the power of AWS, CI/CD, Docker, Kubernetes, and Automation to build resilient, cloud-native systems. Gain practical expertise in DevOps tools and practices and build futuristic skills.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "Certified",
    badgeColor: "bg-orange-100 text-orange-700",
    skills: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
    color: "border-orange-500",
    iconBg: "bg-orange-50",
    link: "/courses/aws-devops-training",
    tab: "certification",
  },
  {
    id: 29,
    icon: "☁️",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    category: "Cloud",
    title: "AWS & DevOps",
    desc: "Explore the power of AWS, CI/CD, Docker, Kubernetes, and Automation to build resilient, cloud-native systems. Gain practical expertise in DevOps tools and practices and build futuristic skills.",
    mode: "Online / Offline",
    fee: "₹38,000",
    badge: "Certified",
    badgeColor: "bg-orange-100 text-orange-700",
    skills: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
    color: "border-orange-500",
    iconBg: "bg-orange-50",
    link: "/courses/aws-devops-training",
    tab: "certification",
  },
];

// const CATEGORIES = [
//   "All",
//   "Python Full Stack",
//   "Java FUll Stack",
//   "Data Science",
//   "AWS & DevOps",
//   "Digital Marketing",
//   "Data Analytics",
//   "Saleforce",
//   "BIM",
//   "SAP FICO",
//   "Medical Coding",
//   "Testing Tools",
//   "VLSI",
//   "Multimedia",
//   "Advanced Excel",
//   "AutoCAD",
//   "Revit MEP",
//   "Business Analytics",
//   "Generative AI",
//   "SAP MM",
//   "Cyber Security",
//   "PMP",
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
    role: "Full Stack Developer",
    course: "Full Stack Java",
    text: "The training quality was exceptional. I got placed within 2 months of completing the course. The hands-on projects really made the difference.",
    rating: 5,
    avatar: "AS",
    avatarColor: "bg-blue-500",
  },
  {
    name: "Priya Reddy",
    role: "Data Analyst",
    course: "Data Science & AI",
    text: "Best investment of my life. The instructors are extremely knowledgeable and the placement support is top-notch.",
    rating: 5,
    avatar: "PR",
    avatarColor: "bg-violet-500",
  },
  {
    name: "Rahul Mehta",
    role: "AWS Cloud Engineer",
    course: "AWS Cloud",
    text: "I cleared my AWS certification in the first attempt. The study material and mock tests were perfectly aligned with the exam.",
    rating: 5,
    avatar: "RM",
    avatarColor: "bg-orange-500",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const STAR_COUNTS = [1, 2, 3, 4, 5];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {STAR_COUNTS.slice(0, count).map((i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const CourseCard = memo(function CourseCard({ course, onEnroll, priority }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border border-gray-100">
      {/* Image Section */}
      <div className="relative h-44 mb-8 overflow-visible">
        <img
          src={course.image}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "low"}
          width={400}
          height={176}
          className="w-full h-full object-cover"
        />

        {/* Center overlapping logo box */}
        <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2">
          <div className="font-bold hover:text-blue-600 transition duration-300 ease-in-out bg-white rounded-xl px-5 py-2.5 shadow-lg flex items-center text-2xl">
            <span className="text-black dark:text-white">Great</span>
            <span className="text-blue-600">Hire</span>
          </div>
        </div>

        {/* Badge */}
        {course.badge && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${course.badgeColor} shadow-sm`}>
            {course.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 pt-6 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{course.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1">{course.desc}</p>

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
});

// ─── Enroll Modal ─────────────────────────────────────────────────────────────

function EnrollModal({ course, onClose, type = "enquiry" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", mode: "Online" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: course.title, fee: type === "enrollment" ? (course.fee || "") : "", type }),
      });
    } catch (_) {}
    setLoading(false);
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
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors duration-200 mt-2 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Enrollment Request"}
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
  const [activeTab, setActiveTab] = useState("employment");
  const [activeCategory, setActiveCategory] = useState("All");
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [enrollType, setEnrollType] = useState("enquiry");

  const openModal = useCallback((course, type = "enquiry") => {
    setEnrollCourse(course);
    setEnrollType(type);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset category filter when switching tabs
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setActiveCategory("All");
    setSearchQuery("");
  };

  const filtered = useMemo(() => COURSES.filter((c) => {
    const matchTab = c.tab === activeTab;
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTab && matchCat && matchSearch;
  }), [activeTab, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 text-white overflow-hidden -mt-[117px] pt-[117px]">
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

      {/* ── Courses Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Our Courses
          </h2>
          {/* Orange underline accent — matches screenshot */}
          <div className="w-16 h-1 bg-orange-500 rounded-full mx-auto mb-8" />

          {/* ── Tab Switcher ── */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={() => handleTabSwitch("employment")}
              className={`px-7 py-2.5 rounded-full text-sm font-semibold border-2 border-blue-600 transition-all duration-200 ${
                activeTab === "employment"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-blue-600 hover:bg-blue-50"
              }`}
            >
              Employment Program
            </button>
            <button
              onClick={() => handleTabSwitch("certification")}
              className={`px-7 py-2.5 rounded-full text-sm font-semibold border-2 border-blue-600 transition-all duration-200 ${
                activeTab === "certification"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-blue-600 hover:bg-blue-50"
              }`}
            >
              TIH-IIT Certification Program
            </button>
          </div>

          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            50+ industry-recognized programs designed with leading companies to get you job-ready.
          </p>
        </div>

        {/* Category Filter */}
        {/* <div className="flex flex-wrap gap-2 justify-center mb-10">
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
        </div> */}

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-6 text-center">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        </p>

        {/* Course Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((course, idx) => (
              <CourseCard key={course.id} course={course} onEnroll={openModal} priority={idx < 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg font-medium">
              {activeTab === "certification"
                ? "TIH-IIT Certification courses coming soon!"
                : `No courses found for "${searchQuery}"`}
            </p>
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
              onClick={() => openModal(COURSES[0], "enrollment")}
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
      <Footer />

      {/* ── Enroll Modal ── */}
      {enrollCourse && (
        <EnrollModal course={enrollCourse} type={enrollType} onClose={() => { setEnrollCourse(null); setEnrollType("enquiry"); }} />
      )}
    </div>
  );
}
