import { useState, lazy, Suspense } from "react";
import { Stars, FaqItem } from "./_shared";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const TalkToCounsellorModal = lazy(() => import("@/components/TalkToCounsellorModal"));

// ─── Data ────────────────────────────────────────────────────────────────────

const CURRICULUM = [
  {
    module: "Module 1",
    title: "Introduction to BIM & AEC Industry",
    duration: "1 Week",
    topics: [
      "What is BIM & Its Evolution",
      "BIM Levels 0, 1, 2, 3 Explained",
      "AEC Industry Overview – Architecture, Engineering, Construction",
      "BIM vs CAD – Key Differences",
      "ISO 19650 & BIM Standards",
      "BIM Roles – BIM Manager, Coordinator, Modeler",
    ],
  },
  {
    module: "Module 2",
    title: "Autodesk Revit – Architecture",
    duration: "4 Weeks",
    topics: [
      "Revit Interface & Project Setup",
      "Walls, Floors, Roofs & Ceilings",
      "Doors, Windows & Components",
      "Stairs, Ramps & Railings",
      "Curtain Walls & Facades",
      "Annotations, Tags & Dimensions",
      "Schedules, Legends & Sheet Creation",
    ],
  },
  {
    module: "Module 3",
    title: "Revit – Structural & MEP",
    duration: "3 Weeks",
    topics: [
      "Structural Columns, Beams & Foundations",
      "Structural Framing & Trusses",
      "MEP – Mechanical Systems & Ductwork",
      "Plumbing & Pipe Systems",
      "Electrical Conduits & Cable Trays",
      "Coordination & Clash Detection",
    ],
  },
  {
    module: "Module 4",
    title: "Navisworks – Clash Detection & 4D Simulation",
    duration: "2 Weeks",
    topics: [
      "Navisworks Interface & File Formats",
      "Model Aggregation & Linking",
      "Clash Detective – Rules & Reports",
      "4D Simulation with TimeLiner",
      "Quantification & Model Review",
      "NWC, NWD & NWF File Types",
    ],
  },
  {
    module: "Module 5",
    title: "BIM Collaboration & CDE",
    duration: "1 Week",
    topics: [
      "Common Data Environment (CDE) Concepts",
      "Autodesk BIM 360 / ACC Platform",
      "Model Sharing & Worksharing in Revit",
      "Issue Tracking & RFI Management",
      "BIM Execution Plan (BEP)",
    ],
  },
  {
    module: "Module 6",
    title: "Dynamo & BIM Automation",
    duration: "2 Weeks",
    topics: [
      "Introduction to Dynamo for Revit",
      "Visual Programming Concepts",
      "Automating Repetitive Tasks",
      "Data Extraction to Excel",
      "Custom Dynamo Scripts",
      "Introduction to Revit API Basics",
    ],
  },
  {
    module: "Module 7",
    title: "Real-World Projects & Career Prep",
    duration: "2 Weeks",
    topics: [
      "Residential Building – Full BIM Model",
      "Commercial Complex – MEP Coordination",
      "Clash Report & Resolution Project",
      "Portfolio Building & LinkedIn Profile",
      "Mock Interviews & Technical Q&A",
      "BIM Certification Exam Preparation",
    ],
  },
];

const TOOLS = [
  { name: "Autodesk Revit", color: "bg-blue-100 text-blue-700", icon: "🏗️" },
  { name: "Navisworks", color: "bg-orange-100 text-orange-700", icon: "🔍" },
  { name: "AutoCAD", color: "bg-red-100 text-red-700", icon: "📐" },
  { name: "BIM 360 / ACC", color: "bg-indigo-100 text-indigo-700", icon: "☁️" },
  { name: "Dynamo", color: "bg-yellow-100 text-yellow-700", icon: "⚙️" },
  { name: "Lumion", color: "bg-green-100 text-green-700", icon: "🌿" },
  { name: "SketchUp", color: "bg-teal-100 text-teal-700", icon: "🧊" },
  { name: "Revizto", color: "bg-purple-100 text-purple-700", icon: "🔗" },
  { name: "MS Project", color: "bg-blue-100 text-blue-800", icon: "📅" },
  { name: "3ds Max", color: "bg-pink-100 text-pink-700", icon: "🎨" },
  { name: "Fuzor", color: "bg-emerald-100 text-emerald-700", icon: "🏢" },
  { name: "IFC / COBie", color: "bg-gray-100 text-gray-700", icon: "📋" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Direct referrals to AEC firms, consultancies & construction giants." },
  { icon: "🛠️", title: "Live Project Training", desc: "Work on 3+ real BIM projects – residential, commercial & MEP." },
  { icon: "👨‍🏫", title: "Industry Expert Trainers", desc: "Learn from BIM professionals with 10+ years of global project experience." },
  { icon: "📋", title: "Regular Mock Tests", desc: "Weekly assessments, BIM challenges & coordination exercises." },
  { icon: "🎖️", title: "Autodesk Certification Prep", desc: "Preparation for Autodesk Certified Professional (ACP) exams." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline batches to fit your schedule." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to recorded sessions, BIM templates & study material." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated BIM mentor for project reviews and career guidance." },
];

const TESTIMONIALS = [
  {
    name: "Ravi Teja Naidu",
    role: "BIM Modeler",
    avatar: "RT",
    color: "bg-blue-500",
    rating: 5,
    text: "The BIM course at Great Hire was a game changer. From Revit basics to Navisworks clash detection, everything was hands-on. Got placed in L&T within 2 months of completion!",
  },
  {
    name: "Priya Lakshmi",
    role: "BIM Coordinator",
    avatar: "PL",
    color: "bg-teal-500",
    rating: 5,
    text: "The real-world projects in this course are brilliant. Clash detection with Navisworks and Dynamo automation gave me a huge edge in interviews.",
  },
  {
    name: "Karthik Reddy",
    role: "Revit Specialist",
    avatar: "KR",
    color: "bg-orange-500",
    rating: 5,
    text: "Excellent trainers with real project exposure. The BIM 360 collaboration module is very relevant to current industry practices. Highly recommended!",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "6 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "10 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "4 seats left", urgent: true },
];

const FAQS = [
  {
    q: "Do I need a civil/architecture background to join BIM course?",
    a: "A background in Civil, Architecture, or Mechanical Engineering is recommended. However, students from related fields with basic knowledge of construction drawings can also join.",
  },
  {
    q: "What is the course duration?",
    a: "The BIM course is approximately 4 months (15 weeks) covering architecture, structural, MEP, coordination, and project work.",
  },
  {
    q: "Will I get Autodesk certification?",
    a: "We prepare you thoroughly for the Autodesk Certified Professional (ACP) exams for Revit. The exam fee is separate, but our training aligns completely with the certification syllabus.",
  },
  {
    q: "Is the course available online?",
    a: "Yes, we offer fully live online sessions with screen sharing, hands-on practice files, and recorded backups on our LMS for revision.",
  },
  {
    q: "What are the job roles after this course?",
    a: "BIM Modeler, BIM Coordinator, BIM Manager, Revit Technician, VDC Engineer, Clash Detection Specialist, and 3D Visualization Artist in AEC companies.",
  },
  {
    q: "What is the course fee?",
    a: "The course fee is ₹38,000 inclusive of all software training, project files, certification prep, and placement support. EMI starting ₹7,000/month available.",
  },
  {
    q: "What is the IIT Certification Program?",
    a: "The IIT Certification Program is a premium add-on at Rs. 60,000 + 18% GST (EMI from ₹7,000/month). It includes a 3-month 100% paid internship, Advanced Certification from IIT's, guest lectures from IIT faculty, access to 20,000+ MNC courses, unlimited AI-driven mock interviews, and a 6-month deadline extension for TEKS Career Track & Dual Certification.",
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
      "Intensive BIM curriculum covering basic to advanced concepts",
      "100+ Live BIM classes, Lifetime access",
      "20+ capstone BIM projects & 1000+ coding problems and assessments",
      "Access to 20,000 + courses from top MNC's",
      "Unlimited AI-driven mock interviews",
      "50+ mock interviews with dedicated career coaches",
    ],
    highlight: true,
  },
];


// ─── Sub-components ──────────────────────────────────────────────────────────

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-teal-300 shadow-sm" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-teal-100 text-teal-600 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-teal-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-teal-50/40 border-t border-teal-100">
          <p className="text-xs text-teal-600 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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

function EnrollModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", batch: "Weekday Batch", mode: "Online" });
  const [step, setStep] = useState("form"); // form | done | failed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!form.name || !form.email || !form.phone) { setError("All fields are required"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: "BIM - Employment Program", amount: 38000 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "GreatHire",
        description: "BIM Employment Program",
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
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#0d9488" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => setStep("failed"));
      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {step === "done" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-500 text-sm mb-6">Welcome to the BIM Employment Program! Our team will contact you within 2 hours.</p>
            <button onClick={onClose} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-teal-700">Got it!</button>
          </div>
        ) : step === "failed" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Payment Failed</h3>
            <p className="text-gray-500 text-sm mb-6">Something went wrong. Please try again or contact support.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setStep("form")} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-teal-700">Try Again</button>
              <button onClick={onClose} className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100">
              <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mb-1">Employment Program</p>
              <h3 className="text-xl font-black text-gray-900">BIM Course — ₹38,000</h3>
              <p className="text-sm text-gray-500 mt-1">+ 18% GST · EMI from ₹7,000/month</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Batch</label>
                  <select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Weekday Batch</option><option>Weekend Batch</option><option>Fast Track</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Online</option><option>Offline</option><option>Hybrid</option>
                  </select>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button onClick={handlePay} disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">
                {loading ? "Processing..." : "Pay ₹38,000 & Enroll →"}
              </button>
              <p className="text-center text-xs text-gray-400">🔒 Secure payment via Razorpay</p>
            </div>
          </div>
        )}
      </div>
    </div>
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
        body: JSON.stringify({ ...form, courseName: "BIM", type: "demo" }),
      });
    } catch (_) { }
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
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-rose-600 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900">BIM</h3><p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p></div>
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
              className={`rounded-2xl overflow-hidden border-2 shadow-lg flex flex-col transition-transform hover:-translate-y-1 duration-200 ${plan.highlight
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
              <div className="bg-white px-6 pb-6 pt-2 space-y-3">
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
                  className={`w-full font-semibold py-3 rounded-xl text-sm border-2 transition-colors bg-white ${plan.highlight
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


// ─── IIT Enroll Modal (₹60,000 + Razorpay) ──────────────────────────────────
function IITEnrollModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", batch: "Weekday Batch", mode: "Online" });
  const [step, setStep] = useState("form"); // form | paying | done | failed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!form.name || !form.email || !form.phone) { setError("All fields are required"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName: "BIM - IIT Certification Program", amount: 60000 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "GreatHire",
        description: "BIM IIT Certification Program",
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
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#1d4ed8" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => setStep("failed"));
      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>

        {step === "done" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-500 text-sm mb-6">Welcome to the BIM IIT Certification Program! Our team will contact you within 2 hours.</p>
            <button onClick={onClose} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800">Got it!</button>
          </div>
        ) : step === "failed" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Payment Failed</h3>
            <p className="text-gray-500 text-sm mb-6">Something went wrong. Please try again or contact support.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setStep("form")} className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800">Try Again</button>
              <button onClick={onClose} className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100">
              <p className="text-xs text-blue-700 font-bold uppercase tracking-widest mb-1">IIT Certification Program</p>
              <h3 className="text-xl font-black text-gray-900">BIM Course — ₹60,000</h3>
              <p className="text-sm text-gray-500 mt-1">+ 18% GST · EMI from ₹7,000/month</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
                  <input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Batch</label>
                  <select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option>Weekday Batch</option><option>Weekend Batch</option><option>Fast Track</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option>Online</option><option>Offline</option><option>Hybrid</option>
                  </select>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button onClick={handlePay} disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">
                {loading ? "Processing..." : "Pay ₹60,000 & Enroll →"}
              </button>
              <p className="text-center text-xs text-gray-400">🔒 Secure payment via Razorpay</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BIMCoursePage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showIITEnroll, setShowIITEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

  const openEnroll = (isIIT) => {
    if (isIIT) setShowIITEnroll(true);
    else setShowEnroll(true);
  };

  const handlePricingEnroll = (planId) => {
    if (planId === "iit") setShowIITEnroll(true);
    else setShowEnroll(true);
  };


  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-slate-900 via-teal-950 to-teal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #14b8a6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0d9488 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Left – Content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 High Demand</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">AEC & Construction</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Autodesk Certified</span>
                <span className="bg-orange-400 text-orange-900 text-xs font-bold px-3 py-1 rounded-full">🎓 IIT Certified</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                BIM Training Course<br />
                <span className="text-yellow-300">Revit + Navisworks</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-teal-200">in Hyderabad</span>
              </h1>

              <p className="text-teal-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Master Building Information Modeling with Autodesk Revit, Navisworks, Dynamo & BIM 360. Work on real AEC projects and land your dream job in top construction & engineering firms.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { val: "4.9★", label: "Rating" },
                  { val: "1,800+", label: "Students" },
                  { val: "4 Months", label: "Duration" },
                  { val: "100%", label: "Placement" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-black text-yellow-300">{s.val}</p>
                    <p className="text-xs text-teal-200 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openEnroll(false)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap"
                >
                  🚀 Enroll Now — ₹38,000
                </button>
                <button
                  onClick={() => openEnroll(true)}
                  className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap border border-orange-400"
                >
                  🎓 IIT Program — ₹60,000
                </button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">
                  📥 Download Syllabus
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-teal-200">
                <span>✅ No Cost EMI Available</span>
                <span>✅ Autodesk Certified Prep</span>
                <span>✅ Free Demo Class</span>
                <span>✅ LinkedIn Learning Partner</span>
              </div>
            </div>

            {/* Right – Enroll card (desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1">
                  <Stars />
                  <span className="text-sm font-bold text-gray-700">4.9</span>
                  <span className="text-xs text-gray-400">(1,800+ reviews)</span>
                </div>
                <p className="text-3xl font-black text-teal-600 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI available</p>

                <div className="space-y-2.5 mb-5">
                  {[
                    "📅 Next batch starts April 14",
                    "⏱ 4 months duration",
                    "🎖 Autodesk Certified Prep",
                    "💼 100% Placement Support",
                    "🔄 Online + Offline modes",
                    "🎁 Lifetime LMS Access",
                  ].map((item) => (
                    <p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>
                  ))}
                </div>

                <button
                  onClick={() => setShowDemo(true)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3"
                >
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
            <p className="text-xl font-black text-teal-600 leading-none">₹38,000</p>
            <p className="text-xs text-gray-400">EMI from ₹7,000/mo</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openEnroll(true)}
              className="bg-orange-500 text-white font-bold px-3 py-2.5 rounded-xl text-xs whitespace-nowrap"
            >
              🎓 IIT
            </button>
            <button
              onClick={() => openEnroll(false)}
              className="bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap"
            >
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

            {/* Overview */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>
                Course Overview
              </h2>
              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 text-base leading-relaxed mb-4">
                  The <strong>BIM Training Course</strong> at Great Hire is a comprehensive 4-month job-oriented program covering Autodesk Revit (Architecture, Structural & MEP), Navisworks, Dynamo, and BIM 360. You'll learn to create intelligent 3D models, perform clash detection, 4D simulation, and collaborate on cloud-based CDE platforms.
                </p>
                <p className="text-gray-700 text-base leading-relaxed">
                  With hands-on project training on real AEC models and placement support through Great Hire's construction & engineering network, this course is your gateway to high-paying BIM careers.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "⏱", label: "Duration", val: "4 Months" },
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

            {/* Highlights */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>
                Why This Course?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all group">
                    <div className="w-11 h-11 bg-teal-50 group-hover:bg-teal-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">
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
                  <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>
                  Course Curriculum
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 15 weeks</span>
              </div>
              <div className="space-y-3">
                {CURRICULUM.map((item, i) => (
                  <AccordionItem
                    key={i} item={item}
                    isOpen={openModule === i}
                    onToggle={() => setOpenModule(openModule === i ? -1 : i)}
                  />
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-teal-600 text-sm font-semibold hover:underline">
                  📥 Download Complete Syllabus PDF
                </button>
              </div>
            </section>

            {/* Tools */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>
                Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((t) => (
                  <span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}>
                    <span className="text-base">{t.icon}</span>{t.name}
                  </span>
                ))}
              </div>
            </section>

           

            {/* Batches */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>
                Upcoming Batches
              </h2>
              <div className="space-y-4">
                {BATCHES.map((b) => (
                  <div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-teal-300 bg-teal-50" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-teal-100" : "bg-gray-100"}`}>
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
                      <button
                        onClick={() => openEnroll(false)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors"
                      >
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
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>
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
                <span className="w-1 h-7 bg-teal-600 rounded-full inline-block"></span>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}
              </div>
            </section>
          </div>

          {/* ── Sticky Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">

              {/* Standard Enroll Card */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Stars />
                  <span className="text-sm font-bold text-gray-700">4.9</span>
                  <span className="text-xs text-gray-400">(1,800+)</span>
                </div>
                <p className="text-3xl font-black text-teal-600 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>

                <div className="space-y-2.5 mb-5 text-sm text-gray-700">
                  {[
                    "📅 Next batch: April 14, 2025",
                    "⏱ Duration: 4 months",
                    "🎖 Autodesk Certified Prep",
                    "💼 100% Placement Support",
                    "🔄 Online + Offline modes",
                    "🎁 Lifetime LMS Access",
                    "👥 Batch size: 15 students",
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-2">{item}</p>
                  ))}
                </div>

                <button
                  onClick={() => setShowDemo(true)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors"
                >
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">
                  📥 Download Syllabus
                </button>
                <button onClick={() => setShowCounsellor(true)} className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
                  📞 Talk to Counsellor
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>



              {/* Refer card */}
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p>
                <p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-teal-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("🏗️ Check out this BIM Training Course at Great Hire! Master Revit & Navisworks with 100% placement support.\n" + window.location.href)}`}
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

      {/* ── Pricing Plans Section ── */}
      <PricingPlans
        onEnroll={handlePricingEnroll}
        onCounsellor={() => setShowCounsellor(true)}
      />



      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-600 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Start Your BIM Career Today</h2>
          <p className="text-teal-100 text-base sm:text-lg mb-8 leading-relaxed">
            Join 1,800+ students who've built successful BIM careers with Great Hire's industry-leading program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openEnroll(false)}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors"
            >
              🚀 Book Free Demo
            </button>
            <button
              onClick={() => openEnroll(true)}
              className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors border border-orange-400"
            >
              🎓 IIT Program — ₹60,000
            </button>
            
          </div>
        </div>
      </section>

      <Footer />
      {showEnroll && <EnrollModal onClose={() => setShowEnroll(false)} />}
      {showIITEnroll && <IITEnrollModal onClose={() => setShowIITEnroll(false)} />}
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      <Suspense fallback={null}>
        {showCounsellor && <TalkToCounsellorModal courseName="BIM" onClose={() => setShowCounsellor(false)} />}
      </Suspense>
    </div>
  );
}