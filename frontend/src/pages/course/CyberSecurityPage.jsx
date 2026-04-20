import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";
import TalkToCounsellorModal from "@/components/TalkToCounsellorModal";


const CURRICULUM = [
  {
    module: "Module 1",
    title: "Cybersecurity Fundamentals",
    duration: "1 Week",
    topics: [
      "Introduction to Cybersecurity & Threat Landscape",
      "CIA Triad – Confidentiality, Integrity, Availability",
      "Types of Attacks – Phishing, MITM, DoS, Ransomware",
      "Networking Basics – TCP/IP, DNS, HTTP/S, OSI Model",
      "Linux Command Line for Security Professionals",
      "Virtualization & Lab Setup – VirtualBox, Kali Linux",
    ],
  },
  {
    module: "Module 2",
    title: "Network Security",
    duration: "2 Weeks",
    topics: [
      "Firewalls, IDS/IPS & DMZ Architecture",
      "VPN – IPSec, SSL/TLS, WireGuard",
      "Network Scanning – Nmap, Masscan",
      "Packet Analysis – Wireshark & tcpdump",
      "Wi-Fi Security – WPA2, WPA3, Evil Twin Attacks",
      "VLAN, ACL & Network Segmentation",
      "Zero Trust Network Architecture",
    ],
  },
  {
    module: "Module 3",
    title: "Ethical Hacking & Penetration Testing",
    duration: "3 Weeks",
    topics: [
      "Penetration Testing Methodology – PTES, OWASP",
      "Reconnaissance – OSINT, Shodan, Maltego",
      "Vulnerability Scanning – Nessus, OpenVAS",
      "Exploitation – Metasploit Framework",
      "Web App Pentesting – SQLi, XSS, CSRF, IDOR",
      "Privilege Escalation – Windows & Linux",
      "Post-Exploitation & Lateral Movement",
    ],
  },
  {
    module: "Module 4",
    title: "Web Application Security",
    duration: "2 Weeks",
    topics: [
      "OWASP Top 10 – 2023 Deep Dive",
      "Burp Suite – Intercepting Proxy & Scanner",
      "SQL Injection – Manual & Automated Testing",
      "Authentication Attacks – Brute Force, JWT, OAuth",
      "API Security Testing",
      "Secure Coding Practices & Code Review",
      "Bug Bounty Program Strategy",
    ],
  },
  {
    module: "Module 5",
    title: "SOC, SIEM & Incident Response",
    duration: "2 Weeks",
    topics: [
      "Security Operations Center (SOC) Structure",
      "SIEM Tools – Splunk, IBM QRadar, Microsoft Sentinel",
      "Log Analysis & Alert Triage",
      "Incident Response Lifecycle – NIST Framework",
      "Digital Forensics – FTK, Autopsy",
      "Threat Intelligence – MITRE ATT&CK Framework",
      "Malware Analysis – Static & Dynamic",
    ],
  },
  {
    module: "Module 6",
    title: "Cloud Security & Compliance",
    duration: "1 Week",
    topics: [
      "AWS Security – IAM, GuardDuty, Security Hub",
      "Azure Security Center & Defender",
      "Cloud Security Misconfigurations",
      "ISO 27001, SOC 2 & GDPR Overview",
      "Risk Assessment & Security Audits",
      "DevSecOps – Security in CI/CD Pipelines",
    ],
  },
  {
    module: "Module 7",
    title: "Certifications & Career Prep",
    duration: "3 Weeks",
    topics: [
      "CEH Exam Preparation – Domains & Practice Tests",
      "CompTIA Security+ Preparation",
      "Hands-On CTF (Capture The Flag) Challenges",
      "TryHackMe & HackTheBox Lab Practice",
      "Resume Building & LinkedIn Optimization",
      "Mock Interviews & HR Round Preparation",
    ],
  },
];

const TOOLS = [
  { name: "Kali Linux", color: "bg-blue-100 text-blue-800", icon: "🐉" },
  { name: "Metasploit", color: "bg-red-100 text-red-700", icon: "💥" },
  { name: "Burp Suite", color: "bg-orange-100 text-orange-700", icon: "🕷️" },
  { name: "Wireshark", color: "bg-indigo-100 text-indigo-700", icon: "🦈" },
  { name: "Nmap", color: "bg-green-100 text-green-700", icon: "🗺️" },
  { name: "Nessus", color: "bg-teal-100 text-teal-700", icon: "🔍" },
  { name: "Splunk", color: "bg-yellow-100 text-yellow-700", icon: "📊" },
  { name: "Autopsy", color: "bg-gray-100 text-gray-700", icon: "🔬" },
  { name: "OWASP ZAP", color: "bg-purple-100 text-purple-700", icon: "⚡" },
  { name: "AWS Security", color: "bg-amber-100 text-amber-700", icon: "☁️" },
  { name: "TryHackMe", color: "bg-red-100 text-red-800", icon: "🏴" },
  { name: "Maltego", color: "bg-cyan-100 text-cyan-700", icon: "🕵️" },
];

const HIGHLIGHTS = [
  { icon: "🎯", title: "100% Job Assistance", desc: "Direct referrals to 500+ hiring partners including MNCs, banks & cybersecurity firms." },
  { icon: "🏴", title: "CTF & Lab Practice", desc: "Solve real-world CTF challenges on TryHackMe and HackTheBox." },
  { icon: "👨‍🏫", title: "CEH-Certified Trainers", desc: "Learn from ethical hackers and SOC analysts with 10+ years' field experience." },
  { icon: "🛡️", title: "Live Attack Simulations", desc: "Practice attacks and defenses in our isolated virtual lab environment." },
  { icon: "🎖️", title: "CEH & Security+ Prep", desc: "Fully aligned with CEH and CompTIA Security+ certification exam objectives." },
  { icon: "🔄", title: "Flexible Batches", desc: "Weekday, weekend, online & offline options to suit your schedule." },
  { icon: "💻", title: "LMS Access", desc: "Lifetime access to lab VMs, session recordings & cheat sheets." },
  { icon: "🤝", title: "1-on-1 Mentoring", desc: "Dedicated security mentor for lab reviews, certifications and career guidance." },
];

const TESTIMONIALS = [
  {
    name: "Tarun Malhotra",
    role: "Penetration Tester @ Deloitte",
    avatar: "TM",
    color: "bg-red-500",
    rating: 5,
    text: "The Metasploit and Burp Suite modules are absolutely elite. The CTF challenges at the end of each week kept me sharp. Got placed at Deloitte's cybersecurity practice within 45 days!",
  },
  {
    name: "Pavani Reddy",
    role: "SOC Analyst @ IBM",
    avatar: "PR",
    color: "bg-blue-500",
    rating: 5,
    text: "The SOC and Splunk training is the best I've encountered anywhere. The MITRE ATT&CK framework sessions completely changed how I approach threat detection. Joined IBM's SOC team!",
  },
  {
    name: "Karthik Nair",
    role: "Security Engineer @ Wipro",
    avatar: "KN",
    color: "bg-slate-500",
    rating: 5,
    text: "Cleared CEH on my first attempt after this course. The web application pentesting module is incredibly practical. The instructors are real-world practitioners with hands-on case studies.",
  },
];

const BATCHES = [
  { type: "Weekday Batch", schedule: "Mon – Fri", time: "7:00 AM – 9:00 AM", mode: "Online", seats: "7 seats left", urgent: true },
  { type: "Weekend Batch", schedule: "Sat – Sun", time: "10:00 AM – 1:00 PM", mode: "Online + Offline", seats: "11 seats left", urgent: false },
  { type: "Fast Track", schedule: "Mon – Sat", time: "6:00 PM – 9:00 PM", mode: "Offline", seats: "4 seats left", urgent: true },
];

const FAQS = [
  { q: "Do I need a networking or IT background?", a: "Basic computer and networking knowledge is helpful. We cover Linux, TCP/IP, and networking fundamentals in Module 1 from scratch. Anyone passionate about security can join." },
  { q: "What is the total course duration?", a: "The course is 4 months (~85 days). The lab environment is available 24/7 so you can practice attacks and defenses at your own pace." },
  { q: "What roles can I target after this course?", a: "Ethical Hacker, Penetration Tester, SOC Analyst (L1/L2), Security Engineer, Vulnerability Analyst, Cloud Security Engineer, and Cybersecurity Consultant." },
  { q: "Is placement 100% guaranteed?", a: "We provide 100% placement assistance — resume building, mock interviews, and direct referrals to 500+ hiring partners in cybersecurity, BFSI, consulting, and IT services." },
  { q: "What certifications will I receive?", a: "You'll receive a Great Hire Training Certificate and an IIT Guwahati E&ICT Academy recognized certificate. We prepare you for CEH (EC-Council) and CompTIA Security+ exams." },
  { q: "What is the course fee and EMI options?", a: "The course fee is ₹38,000 (inclusive of all materials, lab access, projects & placement support). EMI starts from ₹2,800/month. No cost EMI on select cards." },
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
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-red-300 shadow-sm" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">{item.module}</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline text-xs text-gray-400 font-medium">{item.duration}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-red-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-red-50/40 border-t border-red-100">
          <p className="text-xs text-red-600 font-semibold mb-3 mt-3 uppercase tracking-wider">Topics Covered</p>
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
        body: JSON.stringify({ ...form, courseName: "Cyber Security", type: "demo" }),
      });
    } catch (_) {}
    setLoading(false); setDone(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {done ? (
          <div className="p-8 text-center"><div className="text-5xl mb-4">🎓</div><h3 className="text-xl font-black text-gray-900 mb-2">Demo Booked!</h3><p className="text-gray-500 text-sm mb-6">Our counsellor will contact you within 2 hours to confirm your free demo session.</p><button onClick={onClose} className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-red-700">Got it!</button></div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-red-600 font-bold uppercase tracking-widest mb-1">Book Free Demo</p><h3 className="text-xl font-black text-gray-900">Cyber Security</h3><p className="text-sm text-gray-500 mt-1">🎯 Free demo class — no commitment required!</p></div>
            <div className="space-y-4">
              {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" }].map(({ label, key, type, placeholder }) => (
                <div key={key}><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label><input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              ))}
              <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Preferred Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"><option>Online</option><option>Offline</option><option>Hybrid</option></select></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">{loading ? "Submitting..." : "Book Free Demo Class →"}</button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EnrollModal({ onClose }) {
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
        body: JSON.stringify({ ...form, courseName: "Cyber Security", fee: "₹38,000", type: "enrollment" }),
      });
    } catch (_) {}
    setLoading(false);
    setDone(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold">×</button>
        {done ? (<div className="p-8 text-center"><div className="text-5xl mb-4">🎉</div><h3 className="text-xl font-black text-gray-900 mb-2">You're in!</h3><p className="text-gray-500 text-sm mb-6">Our counsellor will call you within 2 hours.</p><button onClick={onClose} className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-red-700">Got it!</button></div>) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100"><p className="text-xs text-red-600 font-bold uppercase tracking-widest mb-1">Enroll Now</p><h3 className="text-xl font-black text-gray-900">Cybersecurity Course</h3><p className="text-sm text-gray-500 mt-1">⚡ Course Fee: <span className="font-bold text-red-600">₹38,000</span> · EMI from ₹7,000/mo</p></div>
            <div className="space-y-4">
              {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" }].map(({ label, key, type, placeholder }) => (<div key={key}><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label><input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" /></div>))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Batch</label><select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"><option>Weekday Batch</option><option>Weekend Batch</option><option>Fast Track</option></select></div>
                <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"><option>Online</option><option>Offline</option><option>Hybrid</option></select></div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60">{loading ? "Submitting..." : "Book Free Demo Class →"}</button>
              <p className="text-center text-xs text-gray-400">Free demo · No credit card required · Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CyberSecurityPage() {
  const [openModule, setOpenModule] = useState(0);
  const [showEnroll, setShowEnroll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showCounsellor, setShowCounsellor] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar /> 
      <section className="bg-gradient-to-br from-gray-950 via-red-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #ef4444 0%, transparent 50%), radial-gradient(circle at 80% 20%, #64748b 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🔥 High Demand 2025</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Ethical Hacking & Security</span>
                <span className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">Job Guaranteed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                Cybersecurity Course<br /><span className="text-yellow-300">Ethical Hacking & SOC</span><br />
                <span className="text-2xl sm:text-3xl font-bold text-red-200">in Hyderabad</span>
              </h1>
              <p className="text-red-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">Master Ethical Hacking, Penetration Testing, SOC Analysis, Web App Security, Cloud Security and more. Prepare for CEH & CompTIA Security+ and get placed at top cybersecurity firms.</p>
              <div className="flex flex-wrap gap-6 mb-8">{[{ val: "4.9★", label: "Rating" }, { val: "1,300+", label: "Students" }, { val: "4 Months", label: "Duration" }, { val: "100%", label: "Placement" }].map((s) => (<div key={s.label}><p className="text-xl font-black text-yellow-300">{s.val}</p><p className="text-xs text-red-200 font-medium">{s.label}</p></div>))}</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base transition-colors shadow-lg whitespace-nowrap">🚀 Enroll Now — ₹38,000</button>
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-colors whitespace-nowrap">📥 Download Syllabus</button>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 text-xs text-red-200"><span>✅ No Cost EMI Available</span><span>✅ CEH & Security+ Prep</span><span>✅ Free Demo Class</span></div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.9</span><span className="text-xs text-gray-400">(1,300+ reviews)</span></div>
                <p className="text-3xl font-black text-red-600 mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹2,800/month · No cost EMI available</p>
                <div className="space-y-2.5 mb-5">{["📅 Next batch starts April 14", "⏱ 4 months duration", "🎖 CEH & Security+ Prep", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 24/7 Lab VM Access"].map((item) => (<p key={item} className="text-sm text-gray-700 flex items-center gap-2">{item}</p>))}</div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mb-3">
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
          <div><p className="text-xl font-black text-red-600 leading-none">₹38,000</p><p className="text-xs text-gray-400">EMI from ₹2,800/mo</p></div>
          <button onClick={() => setShowEnroll(true)} className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">Enroll Now</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2"><span className="w-1 h-7 bg-red-600 rounded-full inline-block"></span>Course Overview</h2><div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-6"><p className="text-gray-700 text-base leading-relaxed mb-4">The <strong>Cybersecurity Course</strong> at Great Hire is a comprehensive 4-month program covering ethical hacking, network security, web application pentesting, SOC analysis, and cloud security — all with hands-on lab practice on Kali Linux and real attack simulations.</p><p className="text-gray-700 text-base leading-relaxed">With CTF challenges, 24/7 lab access, CEH exam preparation, and direct placement support through Great Hire's 500+ company network, this is Hyderabad's most comprehensive cybersecurity training.</p></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[{ icon: "⏱", label: "Duration", val: "4 Months" }, { icon: "📚", label: "Modules", val: "7 Modules" }, { icon: "🖥", label: "Mode", val: "Online + Offline" }, { icon: "🌐", label: "Language", val: "English / Telugu" }].map((item) => (<div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm"><p className="text-2xl mb-1">{item.icon}</p><p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p><p className="text-sm font-bold text-gray-900">{item.val}</p></div>))}</div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-red-600 rounded-full inline-block"></span>Why This Course?</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{HIGHLIGHTS.map((h) => (<div key={h.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-red-200 hover:shadow-sm transition-all group"><div className="w-11 h-11 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">{h.icon}</div><div><p className="font-bold text-gray-900 text-sm mb-0.5">{h.title}</p><p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p></div></div>))}</div></section>
            <section><div className="flex items-center justify-between mb-6"><h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2"><span className="w-1 h-7 bg-red-600 rounded-full inline-block"></span>Course Curriculum</h2><span className="text-xs text-gray-400 font-medium hidden sm:inline">{CURRICULUM.length} modules · 14 weeks</span></div><div className="space-y-3">{CURRICULUM.map((item, i) => (<AccordionItem key={i} item={item} isOpen={openModule === i} onToggle={() => setOpenModule(openModule === i ? -1 : i)} />))}</div><div className="mt-4 text-center"><button className="text-red-600 text-sm font-semibold hover:underline">📥 Download Complete Syllabus PDF</button></div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-red-600 rounded-full inline-block"></span>Tools & Technologies</h2><div className="flex flex-wrap gap-3">{TOOLS.map((t) => (<span key={t.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${t.color}`}><span className="text-base">{t.icon}</span>{t.name}</span>))}</div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-red-600 rounded-full inline-block"></span>Upcoming Batches</h2><div className="space-y-4">{BATCHES.map((b) => (<div key={b.type} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border gap-4 ${b.urgent ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}><div className="flex items-center gap-4"><div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${b.urgent ? "bg-red-100" : "bg-gray-100"}`}>📅</div><div><div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-gray-900">{b.type}</p>{b.urgent && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Filling Fast</span>}</div><p className="text-sm text-gray-500 mt-0.5">{b.schedule} · {b.time} · {b.mode}</p></div></div><div className="flex items-center gap-3 sm:flex-col sm:items-end"><p className="text-xs text-gray-500 font-medium">{b.seats}</p><button onClick={() => setShowEnroll(true)} className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded-lg whitespace-nowrap transition-colors">Enroll →</button></div></div>))}</div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-red-600 rounded-full inline-block"></span>Student Reviews</h2><div className="grid grid-cols-1 sm:grid-cols-3 gap-5">{TESTIMONIALS.map((t) => (<div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"><Stars count={t.rating} /><p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">"{t.text}"</p><div className="flex items-center gap-3 pt-3 border-t border-gray-100"><div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div><div><p className="text-sm font-bold text-gray-900">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div></div></div>))}</div></section>
            <section><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-7 bg-red-600 rounded-full inline-block"></span>Frequently Asked Questions</h2><div className="space-y-3">{FAQS.map((faq) => <FaqItem key={faq.q} item={faq} />)}</div></section>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-1"><Stars /><span className="text-sm font-bold text-gray-700">4.9</span><span className="text-xs text-gray-400">(1,300+)</span></div>
                <p className="text-3xl font-black text-red-600 leading-none mb-1">₹38,000</p>
                <p className="text-xs text-gray-400 mb-5">EMI from ₹7,000/month · No cost EMI</p>
                <div className="space-y-2.5 mb-5 text-sm text-gray-700">{["📅 Next batch: April 14, 2025", "⏱ Duration: 4 months", "🎖 CEH & Security+ Prep", "💼 100% Placement Support", "🔄 Online + Offline modes", "🎁 24/7 Lab VM Access", "👥 Batch size: 15 students"].map((item) => (<p key={item} className="flex items-start gap-2">{item}</p>))}</div>
                <button onClick={() => setShowDemo(true)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors">
                  Book Free Demo Class
                </button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm mb-3 transition-colors">📥 Download Syllabus</button>
                <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">📞 Talk to Counsellor</button>
                <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure · No spam · Cancel anytime</p>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-slate-700 rounded-2xl p-5 text-white text-center">
                <p className="text-2xl mb-2">👫</p><p className="font-bold text-sm mb-1">Refer a Friend</p>
                <p className="text-xs text-red-100 mb-3">Earn ₹2,000 for every successful referral!</p>
                <button className="bg-white text-red-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">Share & Earn</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-red-700 to-slate-800 py-14 mt-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Start Your Cybersecurity Career Today</h2>
          <p className="text-red-100 text-base sm:text-lg mb-8 leading-relaxed">Join 1,300+ students who've built rewarding security careers with Great Hire's Cybersecurity program.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnroll(true)} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-8 py-4 rounded-xl text-base shadow-lg whitespace-nowrap transition-colors">🚀 Enroll Now — Free Demo</button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-sm whitespace-nowrap transition-colors">📞 Call: +91 90000 12345</button>
          </div>
        </div>
      </section>
      <Footer />
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      {showEnroll && <EnrollModal onClose={() => setShowEnroll(false)} />}
    </div>
  );
}
