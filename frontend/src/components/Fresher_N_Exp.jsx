import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "How to Get a Job as a Fresher Without Experience",
  subtitle: "2026 Complete Guide",
  date: "May 06, 2026",
  readTime: "9 min read",
  category: "Career Advice",
  keywords: [
    "jobs for freshers without experience",
    "fresher job tips 2026",
    "how to get first job India",
    "entry level jobs freshers",
    "fresher job search strategy",
    "no experience jobs India",
  ],
};

const steps = [
  {
    num: "01",
    icon: "🧭",
    title: "Understand the Basics & Industry Expectations",
    color: "bg-blue-50 border-blue-200",
    accentBg: "bg-blue-600",
    points: [
      "Research your target industry's entry-level expectations — read 10–15 real job descriptions.",
      "Understand that most companies hiring freshers are investing in potential, not perfection.",
      "Identify recurring skills, tools, and keywords that appear across roles.",
      "Talk to seniors or alumni who were recently placed in similar roles.",
    ],
    desc: "Most freshers apply without knowing what employers truly want. Before building skills or sending applications, spend a week researching. Follow hiring managers on LinkedIn, browse job boards for your target role, and decode what 'entry-level' actually means in your industry.",
  },
  {
    num: "02",
    icon: "🛠",
    title: "Build Relevant Skills or Knowledge",
    color: "bg-violet-50 border-violet-200",
    accentBg: "bg-violet-600",
    points: [
      "Choose depth over breadth — be strong in 2–3 skills rather than average at 10.",
      "Build real projects: a portfolio site, a data dashboard, an open-source contribution.",
      "Use free resources — freeCodeCamp, NPTEL, YouTube, Coursera (audit mode).",
      "Get certifications only if they're directly relevant to your target role.",
    ],
    desc: "You don't need years of experience — you need proof of ability. A fresher with 2 solid projects and one focused skill beats someone with a list of half-finished online courses. Build things. Solve real problems. Put them somewhere visible (GitHub, Behance, Kaggle).",
  },
  {
    num: "03",
    icon: "🎯",
    title: "Apply Strategies & Tools Effectively",
    color: "bg-emerald-50 border-emerald-200",
    accentBg: "bg-emerald-600",
    points: [
      "Target 20–30 companies with genuine interest — don't mass-apply to 200.",
      "Customize your resume and cover letter for each role.",
      "Use LinkedIn, Naukri, GreatHire, Internshala, and Cutshort strategically.",
      "Prioritize warm referrals — one referral is worth 20 cold applications.",
    ],
    desc: "Spray-and-pray doesn't work. Strategic, focused applications with a tailored resume and a genuine connection to the company dramatically improve your response rate. Use platforms designed for freshers and actively build your LinkedIn presence before you start applying.",
  },
  {
    num: "04",
    icon: "📈",
    title: "Track Progress & Improve Continuously",
    color: "bg-amber-50 border-amber-200",
    accentBg: "bg-amber-600",
    points: [
      "Maintain a job tracker spreadsheet: company, role, date, stage, outcome.",
      "After every interview, log the questions you struggled with — improve within 48 hours.",
      "Set weekly targets: X applications, Y networking messages, Z skill practice hours.",
      "Treat every rejection as data. Ask for feedback when possible.",
    ],
    desc: "Most freshers apply, wait, and feel stuck. Winners treat the job search like a project with metrics and iterations. A simple tracker and honest self-review after each interview compound into major improvements within weeks.",
  },
];

const bestPractices = [
  {
    title: "Consistency beats intensity",
    desc: "45 minutes of focused effort daily compounds faster than weekend cramming sessions. Build habits, not sprints.",
  },
  {
    title: "Use the right tools and platforms",
    desc: "LinkedIn for networking and referrals, Naukri for volume, GreatHire for fresher-specific openings, Internshala for internships that convert.",
  },
  {
    title: "Keep improving based on feedback",
    desc: "Log every interview lesson within 48 hours. Patterns emerge fast — and fixing them early drastically improves conversion rates.",
  },
];

const mistakes = [
  {
    title: "Lack of planning",
    desc: "Applying without a defined target role, skill roadmap, or timeline. Unfocused effort produces unfocused results.",
  },
  {
    title: "Ignoring skill development",
    desc: "Sending applications without building proof of ability. Without projects or skills to show, even great resumes get ignored.",
  },
  {
    title: "Poor execution strategy",
    desc: "Mass applying with a generic resume, no LinkedIn presence, and zero follow-up. Volume without quality is noise.",
  },
];

const faqs = [
  {
    q: "Can I get a job as a fresher with absolutely no experience?",
    a: "Yes — but 'no experience' doesn't mean no proof of ability. Projects, certifications, internships (even unpaid), open-source contributions, and personal portfolios all count. Companies hiring freshers know you lack work experience — they're looking for potential and initiative.",
  },
  {
    q: "Which industries hire freshers most actively in India in 2026?",
    a: "IT and tech services, fintech, e-commerce, ed-tech, and BPO/KPO are the most active. Within tech, Data Analytics, Software Development, Cloud Support, QA, and Cybersecurity have the highest fresher hiring volumes.",
  },
  {
    q: "How long does it realistically take to get a first job?",
    a: "With a focused strategy, most freshers land their first offer within 6 weeks to 5 months. The range depends heavily on preparation quality, role competitiveness, and application consistency.",
  },
  {
    q: "What platforms are best for freshers to find jobs without experience?",
    a: "GreatHire, Internshala, and Naukri have dedicated fresher sections. LinkedIn is best for networking and referrals. Cutshort works well for tech roles at startups. Don't rely on one platform — use at least three simultaneously.",
  },
  {
    q: "Should I apply for internships first or go straight for full-time roles?",
    a: "If you have zero projects and no relevant skills, start with internships (even stipend-based) to build proof of experience. If you have at least 2 solid projects and a relevant skill, target full-time fresher roles directly.",
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
        <span
          className={`text-green-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FresherJobsBlog() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white font-sans">

      {/* ── HERO ── */}
      <header className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
            {blog.category}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
            {blog.title}
          </h1>
          <p className="text-green-200 text-xl sm:text-2xl font-light mb-6">
            ({blog.subtitle})
          </p>
          <div className="flex flex-wrap items-center gap-3 text-green-200 text-sm">
            <span>📅 {blog.date}</span>
            <span className="hidden sm:inline">·</span>
            <span>⏱ {blog.readTime}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {blog.keywords.map((kw) => (
              <span
                key={kw}
                className="bg-white/15 border border-white/25 text-white text-xs px-3 py-1 rounded-full"
              >
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
              Searching for{" "}
              <strong className="text-green-700">
                jobs for freshers without experience
              </strong>{" "}
              can feel like a paradox — every job wants experience, but how do
              you get experience without a job? The good news: thousands of
              freshers break into their first roles every month in India without
              traditional work history.
            </p>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              This guide gives you a clear, honest, step-by-step plan — from
              understanding what employers actually want, to building proof of
              ability, to applying strategically and tracking your progress
              until you land the offer.
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Why "No Experience" Is Not the Real Problem
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            When companies say they want experience, they usually mean they want{" "}
            <strong>proof of ability</strong> — evidence that you can do the
            job. Work history is the most common form of that proof, but it's
            not the only one. Projects, certifications, internships, freelance
            work, and even well-documented personal learning all signal
            capability.
          </p>
          <p className="text-gray-600 leading-relaxed">
            India's job market in 2026 is competitive — but freshers who are
            strategic, focused, and prepared consistently outperform those who
            apply widely without direction. The difference is almost never
            experience. It's preparation and execution.
          </p>
        </section>

        {/* ── STEP BY STEP ── */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Step-by-Step Guide to Landing Your First Job Without Experience
          </h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            A practical 4-step framework that works across industries.
          </p>
          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`border rounded-2xl p-5 sm:p-7 ${step.color} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`flex-shrink-0 w-11 h-11 ${step.accentBg} text-white rounded-xl flex items-center justify-center font-black text-sm`}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 pt-2">
                    {step.icon} {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  {step.desc}
                </p>
                <ul className="space-y-2">
                  {step.points.map((pt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── REAL EXAMPLE ── */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Real Example: Zero Experience to Hired in 90 Days
          </h2>
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                A
              </div>
              <div>
                <p className="font-bold">Arjun</p>
                <p className="text-green-200 text-xs">B.Com Graduate — No Tech Background</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  month: "Month 1",
                  title: "Clarity",
                  desc: "Researched Business Analyst roles. Read 15 job descriptions. Identified SQL and communication as key gaps. Spoke to 3 placed seniors. Set a clear target.",
                },
                {
                  month: "Month 2",
                  title: "Skills + Profile",
                  desc: "Completed a focused SQL course, built a sales data project on Kaggle, rewrote his resume with role-specific keywords, activated LinkedIn with 3 posts.",
                },
                {
                  month: "Month 3",
                  title: "Hired ✓",
                  desc: "Applied to 28 targeted companies. Received 4 interview calls. Converted 2 offers. Joined a mid-size fintech firm as Junior Business Analyst.",
                },
              ].map((m) => (
                <div key={m.month} className="bg-white/15 rounded-xl p-4">
                  <p className="text-green-200 text-xs font-bold uppercase tracking-wider mb-1">{m.month}</p>
                  <p className="font-bold mb-2">{m.title}</p>
                  <p className="text-green-100 text-sm leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-green-100 text-sm italic border-t border-white/20 pt-4">
              "He didn't have a CS degree or work experience. He had a clear plan, consistent effort, and proof of ability. That was enough."
            </p>
          </div>
        </section>

        {/* ── BEST PRACTICES + MISTAKES ── */}
        <section className="mb-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span className="text-emerald-600">✓</span> Best Practices
            </h3>
            <ul className="space-y-4">
              {bestPractices.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span>
                    <strong className="text-gray-800 block mb-0.5">{item.title}</strong>
                    {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span className="text-red-500">✗</span> Common Mistakes
            </h3>
            <ul className="space-y-4">
              {mistakes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✗</span>
                  <span>
                    <strong className="text-gray-800 block mb-0.5">{item.title}</strong>
                    {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} />
            ))}
          </div>
        </section>

        {/* ── CONCLUSION ── */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Conclusion</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Getting a job as a fresher without experience in India in 2026 is
            genuinely possible — but it requires a smarter approach than most
            people take. Understand what employers want, build proof of ability
            through projects and skills, apply strategically to the right
            companies, and iterate relentlessly based on feedback.
          </p>
          <p className="text-gray-800 font-semibold text-lg">
            The gap between "no experience" and "hired" is smaller than you think — if you close it with focus and consistency.
          </p>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Ready to Find Your First Job?
          </h2>
          <p className="text-green-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
            Explore thousands of fresher-friendly openings across IT, business,
            data, and more — companies actively hiring candidates just like you.
          </p>
          <a
            href="https://greathire.in"
            className="inline-block bg-white text-green-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
          >
            Explore Fresher Jobs on GreatHire →
          </a>
        </section>
      </main>
    </div>
    <Footer />
    </>
  );
}