import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";
import TalkToCounsellorModal from "@/components/TalkToCounsellorModal";

const CURRICULUM = [
  {
    module: "Module 1",
    title: "Design Fundamentals & Principles",
    duration: "1 Week",
    topics: [
      "Elements of Design – Line, Shape, Color, Texture",
      "Principles of Design – Balance, Contrast, Hierarchy",
      "Color Theory & Psychology",
      "Typography Fundamentals",
      "Composition & Layout Rules",
    ],
  },
  {
    module: "Module 2",
    title: "Adobe Photoshop – Photo Editing & Compositing",
    duration: "2 Weeks",
    topics: [
      "Workspace, Layers & Masks",
      "Selection Tools & Techniques",
      "Retouching & Restoration",
      "Photo Manipulation & Compositing",
      "Color Correction & Grading",
      "Smart Objects & Filters",
      "Export Optimization for Web & Print",
    ],
  },
  {
    module: "Module 3",
    title: "Adobe Illustrator – Vector Graphics",
    duration: "2 Weeks",
    topics: [
      "Vector vs Raster – Core Concepts",
      "Pen Tool Mastery",
      "Logo & Brand Identity Design",
      "Icon & Infographic Creation",
      "Typography Effects",
      "Print-Ready Artwork Preparation",
    ],
  },
  {
    module: "Module 4",
    title: "Adobe Premiere Pro – Video Editing",
    duration: "3 Weeks",
    topics: [
      "Non-Linear Editing Workflow",
      "Timeline Editing – Cut, Trim, Slip",
      "Color Grading with Lumetri",
      "Audio Mixing & Sound Design",
      "Transitions & Effects",
      "Motion Graphics Basics",
      "Export & Delivery Settings",
    ],
  },
  {
    module: "Module 5",
    title: "Adobe After Effects – Motion Graphics",
    duration: "3 Weeks",
    topics: [
      "Keyframe Animation Principles",
      "Text & Shape Layer Animation",
      "Visual Effects – Tracking & Compositing",
      "Expressions Basics",
      "2D Character Animation",
      "Cinematic Title Sequences",
    ],
  },
  {
    module: "Module 6",
    title: "UI/UX Design with Figma",
    duration: "2 Weeks",
    topics: [
      "Wireframing & Prototyping",
      "Design Systems & Components",
      "Mobile & Web App UI Design",
      "User Flow & Interaction Design",
      "Handoff to Developers",
    ],
  },
  {
    module: "Module 7",
    title: "3D Design & Portfolio Building",
    duration: "3 Weeks",
    topics: [
      "Blender Basics – 3D Modeling",
      "Lighting, Materials & Rendering",
      "Social Media Content Design",
      "Portfolio Website Creation",
      "Freelancing & Client Management",
      "Interview Prep & Mock Sessions",
    ],
  },
];

const TOOLS = [
  { name: "Photoshop", color: "bg-blue-100 text-blue-700", icon: "🖼️" },
  { name: "Illustrator", color: "bg-orange-100 text-orange-700", icon: "✏️" },
  { name: "Premiere Pro", color: "bg-purple-100 text-purple-700", icon: "🎬" },
  { name: "After Effects", color: "bg-indigo-100 text-indigo-700", icon: "✨" },
  { name: "Figma", color: "bg-pink-100 text-pink-700", icon: "🎨" },
  { name: "Blender", color: "bg-orange-100 text-orange-800", icon: "🧊" },
  { name: "InDesign", color: "bg-red-100 text-red-700", icon: "📰" },
  { name: "Audition", color: "bg-teal-100 text-teal-700", icon: "🎵" },
  { name: "Canva Pro", color: "bg-cyan-100 text-cyan-700", icon: "🖌️" },
  { name: "DaVinci Resolve", color: "bg-gray-100 text-gray-700", icon: "🎥" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Placement Assistance", desc: "Direct referrals to media agencies, studios & tech companies in Great Hire's network." },
  { icon: "🛠️", title: "Real-World Projects", desc: "Build a professional portfolio with 5+ live design & video projects." },
  { icon: "👨‍🏫", title: "Industry Expert Trainers", desc: "Learn from designers with 10+ years of experience at top creative agencies." },
  { icon: "📋", title: "Weekly Design Challenges", desc: "Regular briefs and creative challenges to sharpen your design instincts." },
  { icon: "🎖️", title: "Dual Certification", desc: "Great Hire + IIT Guwahati E&ICT Academy recognized certificate." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options to suit your schedule." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to all project files, recorded sessions, and resources." },
  { icon: "🤝", title: "1-on-1 Portfolio Reviews", desc: "Get personalized feedback on your portfolio from industry mentors." },
];

const TESTIMONIALS = [
  {
    name: "Sneha Reddy",
    role: "Motion Designer",
    avatar: "SR",
    color: "bg-pink-500",
    rating: 5,
    text: "The After Effects and Premiere Pro training is world-class. I went from zero to landing a motion designer role at Ogilvy within 2 months of completing this course!",
  },
  {
    name: "Karthik Rao",
    role: "UI/UX Designer",
    avatar: "KR",
    color: "bg-orange-500",
    rating: 5,
    text: "The Figma curriculum is comprehensive and practical. The portfolio review sessions helped me present my work confidently in interviews. Highly recommended!",
  },
  {
    name: "Deepa Iyer",
    role: "Graphic Designer",
    avatar: "DI",
    color: "bg-teal-500",
    rating: 5,
    text: "From Photoshop to brand identity design, this course covers everything. The trainers are passionate designers who go beyond just teaching tools.",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "8:00 AM – 10:00 AM", mode: "Online", seats: "7 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "12 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "5:00 PM – 8:00 PM", mode: "Offline", seats: "5 seats left", urgent: true },
];

const FAQS = [
  {
    q: "Do I need any prior design experience?",
    a: "No prior experience is needed. We start with design fundamentals and basic tool orientation before progressing to advanced techniques. Anyone with a creative interest can join.",
  },
  {
    q: "What software licenses are included?",
    a: "We provide Adobe Creative Cloud access for the duration of the course. For Figma and Blender (both free tools), we'll guide you through setup. All project assets and templates are included.",
  },
  {
    q: "Will I build a portfolio during the course?",
    a: "Absolutely! By the end of the course you'll have a professional portfolio with 5+ completed projects covering graphic design, motion graphics, UI/UX, and video editing.",
  },
  {
    q: "Is the course available online?",
    a: "Yes! We offer both online live sessions and offline classroom training. Hybrid options are also available. All sessions are recorded and uploaded to the LMS within 24 hours.",
  },
  {
    q: "What certifications will I receive?",
    a: "You'll receive a Great Hire Training Certificate upon successful completion of all modules and projects.",
  },
  {
    q: "What is the course fee?",
    a: "The course fee is ₹38,000 (inclusive of Adobe CC license, all project files, and placement support). EMI options starting from ₹7,000/month are available.",
  },
  {
    q: "What is the IIT Certification Program?",
    a: "The IIT Certification Program is an advanced add-on in partnership with IIT's E&ICT Academy and LinkedIn Learning. At ₹60,000 + 18% GST (EMI from ₹7,000/month), it includes a 3-month paid internship, Advanced IIT certification, guest lectures from IIT faculty, access to 20,000+ MNC courses, unlimited AI-driven mock interviews, and a 6-month deadline extension for TEKS Career Track & Dual Certification.",
  },
];

// ─── IIT Certification features list ────────────────────────────────────────
const IIT_FEATURES = [
  "3 months 100% paid Internship",
  "Advanced Certification from IIT's",
  "Guest lectures from IIT faculty",
  "Access to 20,000+ courses from top MNC's",
  "Unlimited AI-driven mock interviews",
  "Deadline extension of 6 months for entering TEKS Career Track & Dual Certification",
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
    
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-pink-300 shadow-sm" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-pink-100 text-pink-600 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-pink-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-pink-50/40 border-t border-pink-100">
          <p className="text-xs text-pink-600 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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
      {open && (
        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">{item.a}</div>
      )}
    </div>
  );
}


// ─── IIT Certification Card ───────────────────────────────────────────────────
function IITCertificationCard({ onEnroll }) {
  return (
    
    <div className="rounded-2xl overflow-hidden border-2 border-orange-400 shadow-lg">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-center">
        <p className="text-white font-black text-base tracking-wide">🎓 IIT Certification Program</p>
      </div>

      {/* Partner logos row */}
      <div className="bg-white px-5 py-3 flex items-center justify-center gap-3 border-b border-gray-100">
        {/* Teks Academy logo mock */}
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-black">T</span>
          </div>
          <span className="text-sm font-black text-blue-700">Teks <span className="text-orange-500">academy</span><sup className="text-gray-400 text-xs">®</sup></span>
        </div>
        <span className="text-gray-400 font-bold text-lg">+</span>
        {/* LinkedIn Learning logo mock */}
        <div className="flex items-center gap-1.5">
          <div className="bg-[#0A66C2] rounded px-1.5 py-0.5 flex items-center gap-0.5">
            <span className="text-white font-black text-xs">in</span>
          </div>
          <div>
            <p className="text-xs font-black text-gray-800 leading-none">LinkedIn</p>
            <p className="text-xs font-bold text-gray-800 leading-none">Learning</p>
            <p className="text-xs text-gray-400 leading-none">Knowledge Partner</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 px-5 pt-4 pb-3">
        <div className="flex items-baseline gap-2 mb-0.5">
          <p className="text-3xl font-black text-gray-900">Rs. 60,000</p>
          <span className="text-sm font-semibold text-gray-500">+ 18% GST</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">*Pay in easy EMIs starting at INR 7000 per month.</p>

        {/* Features */}
        <ul className="space-y-2.5 mb-5">
          {IIT_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700">
              <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <button
          onClick={onEnroll}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition-colors mb-2.5"
        >
          Enroll Now
        </button>
        <button className="w-full border-2 border-orange-400 text-orange-500 hover:bg-orange-50 font-semibold py-2.5 rounded-xl text-sm transition-colors">
          Talk to our Admission Team
        </button>
      </div>
    </div>
  );
}

// ─── IIT Certification Section (inline in main content) ──────────────────────
function IITCertificationSection({ onEnroll }) {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block"></span>
        IIT Certification Program
      </h2>

      <div className="rounded-2xl border-2 border-orange-400 overflow-hidden shadow-md">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-black text-lg">🎓 IIT Certification Program</p>
            <p className="text-orange-100 text-xs mt-0.5">Advanced Upskilling with IIT's E&ICT Academy</p>
          </div>
          <span className="bg-white text-orange-600 text-xs font-black px-3 py-1 rounded-full">Premium</span>
        </div>

        <div className="bg-white p-6">
          {/* Partner logos */}
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-black">T</span>
              </div>
              <span className="font-black text-blue-700">Teks <span className="text-orange-500">academy</span><sup className="text-gray-400 text-xs">®</sup></span>
            </div>
            <span className="text-gray-400 font-bold text-xl">+</span>
            <div className="flex items-center gap-2">
              <div className="bg-[#0A66C2] rounded px-2 py-0.5 flex items-center gap-0.5">
                <span className="text-white font-black text-sm">in</span>
              </div>
              <div>
                <p className="text-sm font-black text-gray-800 leading-tight">LinkedIn Learning</p>
                <p className="text-xs text-gray-400 leading-tight">Knowledge Partner</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-4xl font-black text-gray-900">Rs. 60,000</p>
                <span className="text-base font-semibold text-gray-500">+ 18% GST</span>
              </div>
              <p className="text-sm text-gray-500 mb-5">*Pay in easy EMIs starting at INR 7,000/month</p>
              <button
                onClick={onEnroll}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3.5 rounded-xl text-sm transition-colors mr-3 mb-3"
              >
                Enroll Now
              </button>
              <button className="w-full sm:w-auto border-2 border-orange-400 text-orange-500 hover:bg-orange-50 font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors">
                Talk to Admission Team
              </button>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {IIT_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Enroll Modal ─────────────────────────────────────────────────────────────
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
        body: JSON.stringify({ ...form, courseName: "Multimedia", type: "demo" }),
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
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900">Multimedia</h3><p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p></div>
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

function EnrollModal({ onClose, isIIT = false }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", batch: "Weekday Batch", mode: "Online" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: isIIT ? "Multimedia - IIT Program" : "Multimedia", type: "enrollment" }),
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
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">You're in!</h3>
            <p className="text-gray-500 text-sm mb-6">Our counsellor will call you within 2 hours to confirm your batch.</p>
            <button onClick={onClose} className={`text-white px-8 py-3 rounded-xl font-semibold text-sm ${isIIT ? "bg-orange-500 hover:bg-orange-600" : "bg-pink-600 hover:bg-pink-700"}`}>Got it!</button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100">
              {isIIT ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-600 text-xs font-black px-2.5 py-1 rounded-full">🎓 IIT Program</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900">IIT Certification Program</h3>
                  <p className="text-sm text-gray-500 mt-1">Rs. 60,000 + 18% GST · EMI from ₹7,000/mo</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-pink-600 font-bold uppercase tracking-widest mb-1">Enroll Now</p>
                  <h3 className="text-xl font-black text-gray-900">Multimedia Design Course</h3>
                  <p className="text-sm text-gray-500 mt-1">⚡ Course Fee: <span className="font-bold text-rose-600">₹25,000</span> · EMI from ₹7,000/mo</p>
                </>
              )}
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
                    className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${isIIT ? "focus:ring-orange-500" : "focus:ring-pink-500"}`}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Batch</label>
                  <select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${isIIT ? "focus:ring-orange-500" : "focus:ring-pink-500"}`}>
                    <option>Weekday Batch</option>
                    <option>Weekend Batch</option>
                    <option>Fast Track</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${isIIT ? "focus:ring-orange-500" : "focus:ring-pink-500"}`}>
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60 ${isIIT ? "bg-orange-500 hover:bg-orange-600" : "bg-pink-600 hover:bg-pink-700"}`}
              >
                {loading ? "Submitting..." : (isIIT ? "Book Free Consultation →" : "Book Free Demo Class →")}
              </button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MultimediaCoursePage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);
  const [isIITModal, setIsIITModal] = useState(false);

  const openEnroll = (iit = false) => {
    setIsIITModal(iit);
    setShowEnroll(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
<Navbar/>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-slate-900 via-pink-950 to-rose-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #ec4899 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f43f5e 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Left – Content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🎨 Creative Career</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Design & Motion</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Job Guaranteed</span>
                {/* IIT badge in hero */}
                <span className="bg-orange-400 text-orange-900 text-xs font-bold px-3 py-1 rounded-full">🎓 IIT Certified</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                Multimedia Design<br />
                <span className="text-yellow-300">Course</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-pink-200">in Hyderabad</span>
              </h1>

              <p className="text-pink-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master Adobe Creative Suite, Figma, Motion Graphics & 3D Design. Build a stunning portfolio and get placed in top design agencies, media companies & tech startups.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { val: "4.8★", label: "Rating" },
                  { val: "3,200+", label: "Students" },
                  { val: "6 Months", label: "Duration" },
                  { val: "100%", label: "Placement" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-black text-yellow-300">{s.val}</p>
                    <p className="text-xs text-pink-200 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => openEnroll(false)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">
                  🚀 Enroll Now — ₹38,000
                </button>
                <button onClick={() => openEnroll(true)}
                  className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap border border-orange-400">
                  🎓 IIT Program — ₹60,000
                </button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">
                  📥 Download Syllabus
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-pink-200">
                <span className="flex items-center gap-1.5">✅ No Cost EMI Available</span>
                <span className="flex items-center gap-1.5">✅ IIT Guwahati Certified</span>
                <span className="flex items-center gap-1.5">✅ Free Demo Class</span>
                <span className="flex items-center gap-1.5">✅ LinkedIn Learning Partner</span>
              </div>
            </div>

            {/* Right – Enroll card (desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1">
                  <Stars />
                  <span className="text-sm font-bold text-gray-700">4.8</span>
                  <span className="text-xs text-gray-400">(3,200+ reviews)</span>
                </div>
                <p className="text-3xl font-black text-pink-600 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>

                <div className="space-y-2.5 mb-5">
                  {[
                    "📅 Next batch starts April 18",
                    "⏱ 6 months duration",
                    "🎖 Dual Certification",
                    "💼 100% Placement Support",
                    "🔄 Online + Offline modes",
                    "🎁 Adobe CC License Included",
                  ].map((item) => (
                    <p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>
                  ))}
                </div>

                <button onClick={() => openEnroll(false)}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
                  Book Free Demo Class
                </button>
                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                  📞 Talk to a Counsellor
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
            <p className="text-xl font-black text-pink-600 leading-none">₹38,000</p>
            <p className="text-xs text-gray-400">EMI from ₹7,000/mo</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEnroll(true)}
              className="bg-orange-500 text-white font-bold px-3 py-2.5 rounded-xl text-xs whitespace-nowrap border border-orange-400">
              🎓 IIT
            </button>
            <button onClick={() => openEnroll(false)}
              className="bg-pink-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left col – main content */}
          <div className="lg:col-span-2 space-y-14">

            {/* Course Overview */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-pink-600 rounded-full inline-block"></span>
                Course Overview
              </h2>
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-base leading-relaxed mb-4">
                  The <strong>Multimedia Design Course</strong> at Great Hire is a 6-month creative career program that takes you from design basics to professional-grade work in graphic design, video editing, motion graphics, and UI/UX design using the full Adobe Creative Suite and Figma.
                </p>
                <p className="text-gray-700 text-base leading-relaxed">
                  With 5+ portfolio projects, weekly design critiques, and direct placement support through Great Hire's 500+ creative agency network, this course is your launchpad to a fulfilling design career.
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

            {/* Course Highlights */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-pink-600 rounded-full inline-block"></span>
                Why This Course?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-pink-200 hover:shadow-sm transition-all group">
                    <div className="w-11 h-11 bg-pink-50 group-hover:bg-pink-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">
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
                  <span className="w-1 h-7 bg-pink-600 rounded-full inline-block"></span>
                  Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 16 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => (
                  <AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-pink-600 text-sm font-semibold hover:underline">
                  📥 Download Complete Syllabus PDF
                </button>
              </div>
            </section>

            {/* Tools & Technologies */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-pink-600 rounded-full inline-block"></span>
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

            {/* ── IIT Certification Program Section ── */}
            <IITCertificationSection onEnroll={() => openEnroll(true)} />

            {/* Batch Schedule */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-pink-600 rounded-full inline-block"></span>
                Upcoming Batches
              </h2>
              <div className="space-y-4">
                {BATCHES.map((b) => (
                  <div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-pink-300 bg-pink-50" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-pink-100" : "bg-gray-100"}`}>
                        📅
                      </div>
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
                      <button onClick={() => openEnroll(false)}
                        className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">
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
                <span className="w-1 h-7 bg-pink-600 rounded-full inline-block"></span>
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
                <span className="w-1 h-7 bg-pink-600 rounded-full inline-block"></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <FaqItem key={faq.q} item={faq} />
                ))}
              </div>
            </section>
          </div>

          {/* ── Sticky Sidebar (desktop) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">

              {/* Standard Enroll Card */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Stars />
                  <span className="text-sm font-bold text-gray-700">4.8</span>
                  <span className="text-xs text-gray-400">(3,200+)</span>
                </div>
                <p className="text-3xl font-black text-pink-600 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>

                <div className="space-y-2.5 mb-5 text-sm text-gray-700">
                  {[
                    "📅 Next batch: April 18, 2025",
                    "⏱ Duration: 6 months",
                    "🎖 Dual Certification",
                    "💼 100% Placement Support",
                    "🔄 Online + Offline modes",
                    "🎁 Adobe CC License Included",
                    "👥 Batch size: 15 students",
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>

                <button onClick={() => openEnroll(false)}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">
                  📥 Download Syllabus
                </button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                  📞 Talk to Counsellor
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>

              {/* ── IIT Certification Card (Sidebar) ── */}
              <IITCertificationCard onEnroll={() => openEnroll(true)} />

              {/* Refer card */}
              <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-pink-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <button className="bg-white text-pink-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors">
                  Share & Earn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-pink-700 to-rose-700 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Start Your Creative Journey Today
          </h2>
          <p className="text-pink-100 text-base sm:text-lg mb-8 leading-relaxed">
            Join 3,200+ designers and creators who've launched their careers with Great Hire's Multimedia Design course.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => openEnroll(false)}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">
              🚀 Enroll Now — Free Demo
            </button>
            <button onClick={() => openEnroll(true)}
              className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors border border-orange-400">
              🎓 IIT Program — ₹60,000
            </button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">
              📞 Call: +91 90000 12345
            </button>
          </div>
        </div>
      </section>
<Footer/>
      {/* ── Modal ── */}
      {showModal && <EnrollModal onClose={() => setShowModal(false)} isIIT={isIITModal} />}
    </div>
  );
}