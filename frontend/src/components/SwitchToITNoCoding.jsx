import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "How to Switch Career to IT Without Coding Background",
  subtitle: "Non-Technical to Tech Professional",
  date: "May 06, 2026",
  readTime: "12 min read",
  category: "Career Transition",
  keywords: [
    "switch to IT without coding",
    "non coding IT jobs",
    "career change to IT",
    "IT roles without programming",
    "business analyst career",
    "tech career for non coders",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "Research IT roles that DON'T require heavy coding: Business Analyst, QA, Product Manager, IT Project Manager, Technical Support, System Administrator. Understand that IT isn't just software development. Talk to professionals in these roles to understand daily work, skill requirements, and growth paths. Identify which roles align with your existing strengths (your domain expertise becomes an asset, not a liability).",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge",
    desc: "Learn foundational IT concepts: how systems work, databases basics, cloud basics, networking fundamentals. Focus on the specific role's skill stack — Business Analyst needs SQL + communication; QA needs testing mindset + tools like Selenium; Product Manager needs business acumen + technical literacy. Leverage your existing domain knowledge (if from finance, e-commerce, HR, etc.) — this gives you an edge over pure technical people without business sense.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "Target companies and industries where your domain background is valuable. A commerce graduate is perfect for fintech roles. An HR professional is ideal for HR-tech or HRIS implementations. An operations person fits supply chain tech perfectly. Apply to roles emphasizing 'domain expertise' + 'technical aptitude' rather than 'coding experience'. Highlight how you bridge business and technology.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Track: courses completed, certifications obtained, interviews attended, feedback received. After each interview, note what technical questions stumped you — close those gaps immediately. After landing the IT role, commit to continuous learning. Your first year is about building technical depth while leveraging your domain expertise. Plan your next certification or specialization for year 2.",
  },
];

const roles = [
  {
    num: "01",
    title: "Business Analyst (BA)",
    salary: "₹3–5.5 LPA (entry), ₹8–15 LPA (3–5 years)",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    coding: "None to Minimal",
    desc: "Bridge between business and technical teams. Gather requirements, write specifications, perform gap analysis. Your communication and business sense matter more than coding. Financial analysts, operations managers, and HR professionals transition here easily. High growth potential: many BAs become Product Managers or IT Directors.",
  },
  {
    num: "02",
    title: "Quality Assurance (QA) / Software Tester",
    salary: "₹2.5–4.5 LPA (entry), ₹6–12 LPA (3–5 years)",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    coding: "Minimal (Some scripting basics for automation)",
    desc: "Test software systematically. Write test cases, execute tests, report bugs. Detail-oriented mindset is key. Clear path to automation testing later. Anyone from finance, operations, or customer service can transition. QA roles grow into QA leads and product quality managers.",
  },
  {
    num: "03",
    title: "IT Project Manager / Scrum Master",
    salary: "₹4–7 LPA (entry), ₹10–20 LPA (3–5 years)",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    coding: "None",
    desc: "Manage IT projects: teams, timelines, budgets. Agile/Scrum expertise needed. Project managers from any field transition easily — your management skills transfer directly. High demand, high growth trajectory. Leadership potential strong. Your domain knowledge is bonus.",
  },
  {
    num: "04",
    title: "Business Systems Analyst / ERP Consultant",
    salary: "₹4–6.5 LPA (entry), ₹12–25 LPA (3–5 years)",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    coding: "None (Configuration, not coding)",
    desc: "Implement business systems: SAP, Oracle, Salesforce. Your domain expertise is crucial here. Finance professionals fit finance module roles, HR professionals fit HRMS roles. Highest salary growth potential among non-coding IT roles. Consulting opportunities abundant.",
  },
  {
    num: "05",
    title: "Technical Support / Customer Success Engineer",
    salary: "₹2–4 LPA (entry), ₹5–10 LPA (3–5 years)",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    coding: "Basic scripting only",
    desc: "Support technical issues, help customers. Strong communication is critical. Customer service background is perfect. Low barrier to entry but steep learning curve. Strategic advantage: many tech support people transition to product management or solutions engineering roles.",
  },
  {
    num: "06",
    title: "IT Business Analyst / Solutions Architect",
    salary: "₹5–7.5 LPA (entry), ₹15–30+ LPA (3–5 years)",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    coding: "None",
    desc: "Design technical solutions for business problems. Requires deep business understanding + technical literacy. Perfect for domain experts transitioning to tech. Highest earning potential among non-coding roles. Requires 2–3 years of IT experience to reach this level.",
  },
  {
    num: "07",
    title: "Product Manager (Tech/SaaS)",
    salary: "₹4–7 LPA (entry), ₹15–40 LPA (3–5 years)",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    coding: "None (Technical literacy needed)",
    desc: "Define product roadmap, manage features, understand user needs. Business acumen + communication key. Finance, marketing, or operations backgrounds transition well. Highest salary potential. Requires 2–3 years in IT first (BA → Product Manager is common path).",
  },
  {
    num: "08",
    title: "IT Training / Technical Documentation Specialist",
    salary: "₹2.5–4 LPA (entry), ₹6–12 LPA (3–5 years)",
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    coding: "None",
    desc: "Create documentation, train users, create training materials. Writers, HR training professionals, educators transition easily. Lower salary but stable growth. Good stepping stone to other IT roles. Communication skills are everything.",
  },
];

const faqs = [
  {
    q: "Is it possible to switch to IT without any technical background?",
    a: "Yes, absolutely. Roles like Business Analyst, Project Manager, QA, and IT Training don't require coding. Your domain expertise (finance, HR, operations) is actually valuable. Biggest barrier isn't lack of coding — it's lack of IT fundamentals knowledge. Spend 2–4 weeks understanding how systems, databases, and networks work.",
  },
  {
    q: "How long does it take to become job-ready for a non-coding IT role?",
    a: "Business Analyst, Project Manager, QA: 2–3 months of focused learning. Technical Support: 1–2 months. Solutions Architect, Product Manager: 1–2 years (need IT experience first). Your domain expertise shortcuts the timeline — a finance person is job-ready for financial systems analyst role much faster than someone without finance background.",
  },
  {
    q: "What's the first IT role I should target if transitioning from non-tech?",
    a: "Business Analyst or QA are ideal entry points. Low barrier to entry, clear learning paths, high demand. Alternatively, if you have strong communication skills, start as Technical Support and transition to higher roles in 1–2 years. Your goal: get into IT first, climb ladder from inside.",
  },
  {
    q: "Will companies hire me if I don't have an IT degree or IT experience?",
    a: "Yes. Companies care about relevant skills and domain expertise, not degrees. A finance professional with strong SQL + business acumen gets hired as a financial analyst faster than a CS graduate without finance knowledge. Your domain expertise is your competitive advantage.",
  },
  {
    q: "Should I get certifications before switching to IT?",
    a: "Depends on role. For BA: get a business analysis certification (CBAP, CEH-BA) or SQL basics. For QA: ISTQB certification valuable. For PM: Scrum Master certification (CSM) valuable. For technical support: no specific certification needed. But certifications shouldn't delay your job search — apply after 2 months of learning, get certified while working.",
  },
  {
    q: "Will I face salary cuts when switching careers to IT?",
    a: "Depends on your current role and target role. A finance manager (₹8–10 LPA) transitioning to Business Analyst might start at ₹4–5 LPA (short-term cut). But growth is faster in IT — you'll reach ₹8–15 LPA within 2–3 years, then climb further. Long-term, IT offers higher ceiling.",
  },
  {
    q: "How do I explain my non-tech background in interviews?",
    a: "Frame it as strength: 'My background in [domain] gives me unique perspective on business problems. Now I want to bridge business and technology to solve them better.' Companies value business insight + technical curiosity more than pure technical pedigree.",
  },
  {
    q: "What if I'm mid-career (8+ years) in another field? Is it too late?",
    a: "Not at all. Mid-career professionals often transition better than freshers because they have domain expertise + professional maturity. Target roles aligned with your domain (finance → financial systems analyst, HR → HRMS consultant). Your age isn't a barrier; lack of relevant skills is.",
  },
];

const practices = [
  "Leverage your domain expertise — it's your competitive advantage over pure technical people.",
  "Start with IT fundamentals: understand systems, databases, cloud basics before specializing.",
  "Get certifications WHILE job searching, not before — certificates validate your learning, not prerequisites.",
  "Network in your target IT sector early — connect with BAs, PMs, QAs working in your domain.",
  "Build case studies showing how you'd solve business problems using technology.",
  "Take an IT internship or contract role if needed — faster foot-in-the-door than applying directly.",
];

const mistakes = [
  "Trying to learn coding when your target role doesn't require it — wastes time.",
  "Ignoring your domain expertise — position it as your unique strength, not a liability.",
  "Waiting for perfect preparation before applying — apply while learning (month 2–3).",
  "Targeting senior IT roles directly — entry-level roles (BA, QA) are gateways to higher roles.",
  "Not understanding why you're switching — companies want clarity on motivation, not desperation.",
  "Isolating yourself technically — you need to understand enough tech to communicate with engineers.",
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">{q}</span>
        <span className={`text-green-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function SwitchToITNoCoding() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-cyan-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-cyan-200 text-sm">
              <span>📅 {blog.date}</span>
              <span className="hidden sm:inline">·</span>
              <span>⏱ {blog.readTime}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.keywords.map((kw) => (
                <span key={kw} className="bg-white/15 border border-white/25 text-white text-xs px-3 py-1 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* ── INTRODUCTION ── */}
          <section className="mb-14">
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                You're a finance professional, HR manager, operations lead, or business analyst. You've built a solid career outside tech. But now you're wondering: <strong className="text-cyan-700">Can I switch to IT without learning to code?</strong> The answer is a resounding yes — and your non-tech background might actually be your biggest advantage.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                In 2026, companies desperately need professionals who understand BOTH business AND technology. Pure technologists often lack business acumen. Pure business people lack technical literacy. You're positioned to become invaluable. This guide maps exactly how to make that transition, which IT roles suit non-coders, and how to leverage your existing expertise.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Why Non-Tech Backgrounds Are Assets in IT Today</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The biggest misconception: IT jobs = coding jobs. False. Only ~30% of IT roles require significant coding. The other 70% — Business Analysts, Project Managers, Product Managers, QA, Solutions Architects, Systems Implementers — need business sense + technical literacy, not coding expertise.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Your domain expertise (finance, HR, operations, marketing) is valuable because you understand the problems. A finance professional knows what financial analysts need. An HR person understands HR workflows. An operations manager sees supply chain inefficiencies. Combine that with IT knowledge, and you become the bridge between business and technology — the most valuable professional in any organization.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to transition to IT without coding.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">{step.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── NON-CODING IT ROLES ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 IT Roles Perfect for Non-Coders</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">Your path from non-tech to tech without writing a single line of code.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {roles.map((role) => (
                <div key={role.num} className={`border rounded-2xl p-5 sm:p-6 ${role.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{role.num}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${role.badge}`}>{role.coding}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{role.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-3">💰 {role.salary}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: Finance Manager → Business Analyst in 4 Months</h2>
            <div className="bg-gradient-to-br from-cyan-600 to-purple-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">R</div>
                <div>
                  <p className="font-bold">Ravi</p>
                  <p className="text-cyan-200 text-xs">Finance Manager (₹6 LPA) → IT Business Analyst</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    period: "Month 1",
                    title: "Foundation + Exploration",
                    desc: "Learned IT basics: systems, databases, networks. Researched roles. Identified Business Analyst as fit (combines finance + tech). Started SQL basics course.",
                  },
                  {
                    period: "Month 2",
                    title: "Skills Building",
                    desc: "Completed SQL fundamentals. Learned requirements gathering, creating specifications. Built 2 case studies: how tech solves finance problems. Created portfolio.",
                  },
                  {
                    period: "Month 3",
                    title: "Job Search",
                    desc: "Started applying to finance tech companies, fintech, and enterprise finance roles. Positioned as finance expert + emerging tech talent. Got 3 interview calls.",
                  },
                  {
                    period: "Month 4",
                    title: "Hired ✓",
                    desc: "Joined fintech startup as Business Analyst (Financial Systems), ₹4.5 LPA + stock options. His finance background made him invaluable for that role.",
                  },
                ].map((m) => (
                  <div key={m.period} className="bg-white/15 rounded-xl p-4">
                    <p className="text-cyan-200 text-xs font-bold uppercase tracking-wider mb-1">{m.period}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-cyan-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-cyan-100 text-sm italic border-t border-white/20 pt-4">
                "Short-term salary dip (₹6 → ₹4.5 LPA) but within 2 years I'm projected to reach ₹8–10 LPA. Plus, growth trajectory in IT is faster. Most importantly: I'm solving tech problems in finance domain I understand deeply. Best decision I made."
              </p>
            </div>
          </section>

          {/* ── BEST PRACTICES + MISTAKES ── */}
          <section className="mb-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Best Practices
              </h3>
              <ul className="space-y-3">
                {practices.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="text-red-500">✗</span> Common Mistakes
              </h3>
              <ul className="space-y-3">
                {mistakes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 font-bold mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
            </div>
          </section>

          {/* ── CONCLUSION ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Conclusion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Switching to IT without coding isn't just possible — it might be easier than you think. Your domain expertise is your secret weapon. Companies need professionals who understand business problems AND technology solutions. You're positioned to become invaluable.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Start with IT fundamentals, pick a non-coding role aligned with your domain, learn specific skills for that role, and apply aggressively. Yes, you might take a salary dip initially. But IT offers faster growth, higher ceilings, and global opportunities. Within 2–3 years, you'll earn more than your non-tech counterparts while having the career satisfaction of solving meaningful technology problems.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Your non-tech background isn't a barrier — it's your competitive advantage. Use it.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-cyan-600 to-purple-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Make the Switch?</h2>
            <p className="text-cyan-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Explore IT roles perfect for professionals with non-tech backgrounds. Connect with mentors who made similar transitions. Find opportunities in your domain-adjacent IT roles on GreatHire.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-cyan-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-cyan-50 transition-colors shadow-lg"
            >
              Explore Non-Coding IT Roles on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
