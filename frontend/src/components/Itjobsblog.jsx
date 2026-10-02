import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Top 10 IT Jobs for Freshers in India",
  subtitle: "2026 Guide",
  date: "May 06, 2026",
  readTime: "8 min read",
  category: "Career Advice",
  keywords: [
    "IT jobs for freshers 2026",
    "fresher IT jobs India",
    "entry level IT jobs India",
    "best IT jobs for freshers",
    "IT careers 2026",
    "software jobs for freshers",
  ],
};

const jobs = [
  {
    num: "01",
    title: "Junior Software Developer",
    skills: "Python / Java / JavaScript",
    ctc: "₹3.5–6 LPA",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    desc: "The most sought-after software job for freshers in India. You write, test, and maintain code as part of a product or services team. Companies hire freshers who know at least one language well and have built real projects. High demand in Bangalore, Hyderabad, and Pune.",
  },
  {
    num: "02",
    title: "Data Analyst",
    skills: "SQL, Excel, Python, Power BI / Tableau",
    ctc: "₹3–5.5 LPA",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    desc: "One of the fastest-growing entry-level IT jobs in India in 2026. Data analyst freshers help businesses make decisions using numbers. Huge demand in fintech, e-commerce, and consulting.",
  },
  {
    num: "03",
    title: "Manual QA / Software Tester",
    skills: "Test case writing, Selenium basics, SDLC",
    ctc: "₹2.5–4.5 LPA",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    desc: "Underrated but consistently in demand. If you're detail-oriented and systematic, this is one of the easiest IT jobs for freshers to break into — with a clear path to automation testing.",
  },
  {
    num: "04",
    title: "Cloud Support Associate",
    skills: "AWS / Azure basics, networking, Linux",
    ctc: "₹3–5 LPA",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    desc: "Cloud is everywhere in 2026. Companies need freshers who understand cloud infrastructure basics. A free AWS Cloud Practitioner or Azure Fundamentals certification significantly boosts your chances.",
  },
  {
    num: "05",
    title: "Cybersecurity Analyst (Trainee)",
    skills: "Networking basics, ethical hacking, Wireshark",
    ctc: "₹3.5–6 LPA",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    desc: "India faces a severe shortage of cybersecurity professionals. This makes it one of the most promising IT careers for freshers in 2026. IT services firms actively hire trainees for SOC and analyst roles.",
  },
  {
    num: "06",
    title: "Frontend Web Developer",
    skills: "HTML, CSS, JavaScript, React",
    ctc: "₹3–5.5 LPA",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    desc: "Portfolio-driven role — your GitHub and live projects matter more than your degree. If you can build clean, responsive websites, companies will hire you. High demand in startups and agencies.",
  },
  {
    num: "07",
    title: "Technical Support Engineer",
    skills: "Communication, product knowledge, basic scripting",
    ctc: "₹2.5–4 LPA",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    desc: "Often dismissed, but strategically smart. You learn the product deeply, build client-facing skills, and many support engineers transition into product, dev, or sales roles within 2 years.",
  },
  {
    num: "08",
    title: "DevOps Trainee",
    skills: "Linux, Docker, CI/CD pipelines, Git",
    ctc: "₹3.5–6 LPA",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    desc: "Steep learning curve, but DevOps salaries grow fast. If you prefer infrastructure over writing application code, this is worth exploring. Strong growth trajectory in large IT services firms.",
  },
  {
    num: "09",
    title: "Business Analyst (IT / Tech)",
    skills: "Communication, SQL, JIRA, requirement writing",
    ctc: "₹3–5 LPA",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    desc: "You bridge the gap between tech teams and business stakeholders. Strong communication + basic SQL makes you a solid BA candidate right out of college. Open to non-CS backgrounds too.",
  },
  {
    num: "10",
    title: "AI / ML Trainee",
    skills: "Python, statistics, data preprocessing, ML basics",
    ctc: "₹4–7 LPA",
    color: "bg-fuchsia-50 border-fuchsia-200",
    badge: "bg-fuchsia-100 text-fuchsia-700",
    desc: "The hottest category in IT jobs for freshers in 2026. Entry-level roles focus on data prep, model testing, and simple pipelines. A strong Python + statistics foundation is your minimum entry ticket.",
  },
];

const steps = [
  {
    num: "01",
    title: "Understand What Companies Actually Expect",
    desc: "Employers hiring freshers don't expect perfection — they're investing in your potential. Read 10–15 job descriptions for your target role. Note the skills mentioned repeatedly — those are your priority. Join LinkedIn communities. Talk to seniors who were recently placed.",
  },
  {
    num: "02",
    title: "Build Relevant Skills (Depth Over Breadth)",
    desc: "You don't need 15 certifications. You need depth in 2–3 areas that directly match your target role. A developer with strong Python and 3 real projects beats someone with a long list of half-finished courses every time. Use freeCodeCamp, NPTEL, or Coursera (audit mode).",
  },
  {
    num: "03",
    title: "Apply Strategically — Not Just Widely",
    desc: "Sending 200 generic applications rarely works. Target 20–30 companies where you've actually researched the team and product. Customize your resume for each role. Apply on Naukri, LinkedIn, GreatHire, Internshala, and Cutshort. One warm referral is worth 20 cold applications.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Maintain a simple spreadsheet: company, role, date applied, interview stage, outcome. After every interview, log the questions you struggled with and work on them within 48 hours. Treat each rejection as data, not defeat.",
  },
];

const faqs = [
  {
    q: "What is the best IT job for freshers in India in 2026?",
    a: "The best role depends on your strengths. If you like building things, go for Software Developer or Frontend Developer. If you prefer numbers, target Data Analyst. If you want quick entry, Manual QA or Technical Support have lower barriers.",
  },
  {
    q: "How long does it take to land a first IT job as a fresher?",
    a: "With a focused strategy, most freshers land their first role within 6 weeks to 5 months. Preparation significantly shortens the window.",
  },
  {
    q: "What tools and platforms should freshers use to find IT jobs?",
    a: "Job searching: LinkedIn, Naukri, GreatHire, Internshala, Cutshort. Learning: freeCodeCamp, NPTEL, Coursera (audit mode), YouTube. Portfolio: GitHub for code, Kaggle for data projects.",
  },
  {
    q: "Can non-CS graduates apply for IT jobs in India?",
    a: "Absolutely. Roles like Technical Support, Business Analyst, Manual QA, and Data Analyst are open to candidates from ECE, Commerce, and even non-technical backgrounds.",
  },
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

export default function ITJobsBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      

      {/* ── HERO ── */}
      <header className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
            {blog.category}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
            {blog.title}
          </h1>
          <p className="text-green-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
          <div className="flex flex-wrap items-center gap-3 text-green-200 text-sm">
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

        {/* ── INTRO ── */}
        <section className="mb-14">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 mb-8">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
              Looking for <strong className="text-green-700">IT jobs for freshers in 2026</strong>? You're not alone — and you're in the right place. India's tech sector is adding thousands of entry-level roles this year, but knowing <em>which</em> role to target, and how to actually land it, makes all the difference.
            </p>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              This guide breaks down the top 10 fresher IT jobs in India, what each role actually involves, the skills you need, and a step-by-step plan to get hired — even with zero work experience.
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Why 2026 Is a Great Year to Start Your IT Career in India</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            India's IT industry is projected to cross <strong>$300 billion</strong> in revenue by 2026, driven by cloud adoption, AI integration, and widespread digital transformation across banking, retail, and government sectors. Companies like Infosys, TCS, Wipro, and hundreds of product startups are actively hiring freshers to fuel this growth.
          </p>
          <p className="text-gray-600 leading-relaxed">
            But the market is also more skill-aware than ever. Simply having a B.Tech or BCA degree isn't enough anymore. Employers want entry-level IT candidates who have built relevant skills, have some projects to show, and understand the basics of the role they're applying for.
          </p>
        </section>

        {/* ── TOP 10 JOBS ── */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Top 10 IT Jobs for Freshers in India (2026)</h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">All roles actively hiring freshers right now across India.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <div key={job.num} className={`border rounded-2xl p-5 sm:p-6 ${job.color} hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl font-black text-gray-200 leading-none">{job.num}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${job.badge}`}>{job.ctc}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-xs text-gray-500 font-medium mb-3">🛠 {job.skills}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{job.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── STEP BY STEP ── */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guide to Landing Your First IT Job</h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">A practical 4-step plan that actually works.</p>
          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

        {/* ── REAL EXAMPLE ── */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: From Zero Experience to Hired in 90 Days</h2>
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">P</div>
              <div>
                <p className="font-bold">Moin</p>
                <p className="text-green-200 text-xs">Graduate</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { month: "Month 1", title: "Clarity", desc: "Researched data analyst roles. Read job descriptions, joined LinkedIn groups, spoke to two placed seniors. Chose her target role." },
                { month: "Month 2", title: "Skills + Profile", desc: "Completed one focused SQL course, built a restaurant data project, polished her LinkedIn profile and resume." },
                { month: "Month 3", title: "Hired ✓", desc: "Applied to 25 chosen companies. Got 3 interviews. Converted 2. Joined a mid-sized e-commerce firm as Junior Data Analyst." },
              ].map((m) => (
                <div key={m.month} className="bg-white/15 rounded-xl p-4">
                  <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-1">{m.month}</p>
                  <p className="font-bold mb-2">{m.title}</p>
                  <p className="text-green-100 text-sm leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-green-100 text-sm italic border-t border-white/20 pt-4">
              "She wasn't doing the most. She was doing the right things, consistently — and that made all the difference."
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
              {[
                "Consistency beats intensity — 45 minutes daily builds more than weekend cramming.",
                "Use the right platforms — LinkedIn for referrals, Naukri for volume, GreatHire for fresher openings.",
                "Act on feedback immediately — log every interview lesson within 48 hours.",
              ].map((item, i) => (
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
              {[
                "Applying to too many roles without focus — pick one direction and build momentum.",
                "Ignoring soft skills — how you communicate gets you the offer, not just tech prep.",
                "Poor attention to basics — typos, no LinkedIn photo, generic emails signal carelessness.",
              ].map((item, i) => (
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
            Landing your first IT job as a fresher in India in 2026 is challenging — but far from impossible. Pick your target role, build the right skills, apply strategically, and keep improving. You don't need to be perfect — you need to be prepared and persistent.
          </p>
          <p className="text-gray-800 font-semibold text-lg">Start today. Even one focused step puts you ahead of the crowd.</p>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Find Your First IT Job?</h2>
          <p className="text-green-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
            Explore thousands of fresher-friendly IT opportunities across India — from software development to data analytics, cloud, and beyond.
          </p>
          <a
            href="https://greathire.in"
            className="inline-block bg-white text-green-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
          >
            Explore IT Jobs on GreatHire →
          </a>
        </section>

      </main>

      {/* ── FOOTER ── */}
        </div>
      <Footer />
    </>
  );
}