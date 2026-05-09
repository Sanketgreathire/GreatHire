import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "How to Hire the Right Candidate Faster",
  subtitle: "Recruitment Excellence in 2026",
  date: "May 06, 2026",
  readTime: "14 min read",
  category: "Hiring Guide",
  keywords: [
    "hire candidates faster",
    "recruitment strategies",
    "talent acquisition",
    "hiring best practices",
    "reduce time to hire",
    "quality hiring process",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Define Your Ideal Candidate",
    desc: "Don't rush to post a generic job description. Spend a week defining: exact role responsibilities, must-have skills vs nice-to-have, team fit, growth potential. Talk to your team about what successful people in this role look like. Document red flags and green flags. Clarity at this stage eliminates 50% of bad hires later. Use data: look at your best performers — what do they have in common?",
  },
  {
    num: "02",
    title: "Build a Robust Sourcing Strategy",
    desc: "Don't rely solely on job portals. Use multiple channels: LinkedIn (active recruiting), employee referrals (highest quality), niche job boards (GreatHire for freshers), university partnerships, bootcamp networks. Set recruitment targets: aim for 3:1 applicant ratio per role. Pre-screen for fit before they apply. Use screening questions in job postings to auto-qualify candidates. Quality sourcing reduces interview volume by 40%.",
  },
  {
    num: "03",
    title: "Streamline Your Screening & Interview Process",
    desc: "Design a structured interview funnel: resume screen (30 min) → phone screening (15 min) → technical assessment (1 hour, async if possible) → round 1 interview (45 min) → round 2 interview (45 min) → offer. Each stage should eliminate 60–70% of candidates. Use standardized evaluation rubrics. Train interviewers beforehand. Use online assessment platforms to run technical tests in parallel, not sequentially. Speed matters: respond within 24 hours of interviews.",
  },
  {
    num: "04",
    title: "Track, Iterate & Improve Hiring Quality",
    desc: "Measure: time-to-hire, cost-per-hire, quality-of-hire (how well new hires perform in first 6 months), retention rate. Review failed hires monthly — what went wrong? Was it poor screening, wrong interview questions, or misaligned expectations? Adjust your process. Track which channels bring best candidates — double down on those. Hiring is a system: optimize it continuously.",
  },
];

const strategies = [
  {
    num: "01",
    category: "Job Description Strategy",
    title: "Write Crystal-Clear Job Descriptions",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    type: "Sourcing",
    desc: "Generic job descriptions attract generic candidates. Be specific about role, team, expectations, and growth. Include salary range (attracts serious candidates). Highlight company culture. Add 3–5 screening questions to filter early. Use inclusive language to attract diverse candidates. Include 'nice-to-have' vs 'must-have' skills clearly.",
  },
  {
    num: "02",
    category: "Sourcing Strategy",
    title: "Diversify Your Recruiting Channels",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    type: "Sourcing",
    desc: "LinkedIn recruiting: Search, headhunt passives, use job ads. Employee referrals: Incentivize (₹5K–20K bonus). Niche boards: GreatHire (freshers), Cutshort (startups), AngelList (tech). Bootcamps: Partner with coding/analytics bootcamps. University tie-ups: Campus recruitment for freshers. Conferences/Meetups: Sponsor tech meetups. Each channel has different cost/quality profile.",
  },
  {
    num: "03",
    category: "Screening Efficiency",
    title: "Async Assessments & Standardized Rubrics",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    type: "Screening",
    desc: "Use technical assessment platforms (HackerRank, LeetCode, Codility) to test skills asynchronously — candidates complete on their schedule, you review results. Use video interviewing for initial rounds — candidates record answers, you watch when convenient. Create standardized evaluation rubric: track 5–7 key competencies. Score candidates objectively. This reduces bias and saves 20+ hours/week.",
  },
  {
    num: "04",
    category: "Interview Process",
    title: "Structured Interviews with Clear Evaluation",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    type: "Interviews",
    desc: "Design 45-min interviews covering: technical skills (30 min), problem-solving (10 min), culture fit (5 min). Use same questions for all candidates (enables comparison). Have 2–3 interviewers score independently, then discuss. Avoid 'gut feeling' — use data. Reduce interview rounds to 2–3 max. Schedule interviews back-to-back on same days. Faster process = faster decisions.",
  },
  {
    num: "05",
    category: "Speed & Communication",
    title: "Fast Feedback & Rapid Offer Process",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    type: "Speed",
    desc: "Communicate status within 24 hours of each interview. For rejected candidates, send brief, respectful feedback. For selected candidates, prepare offer within 48 hours. Don't drag out negotiations — have clarity on salary band, benefits, start date beforehand. Slow hiring loses best candidates to competitors. Speed signals professionalism and respect.",
  },
  {
    num: "06",
    category: "Tools & Platforms",
    title: "Leverage Recruitment Automation Tools",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    type: "Tools",
    desc: "Use ATS (Applicant Tracking System): Workable, Lever, Greenhouse. Use assessment platforms: HackerRank, TestDome, Criterion. Use video interviewing: Willo Recruit, HireVue. Use LinkedIn Recruiter for sourcing. These automate screening, reduce manual work by 60%, and standardize process. Cost: ₹10K–50K/month depending on tool. ROI: hire faster, hire better.",
  },
  {
    num: "07",
    category: "Quality Measures",
    title: "Focus on Hire Quality, Not Just Speed",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    type: "Quality",
    desc: "Measure quality-of-hire: How do new hires perform after 6 months? Track performance ratings, retention, promotion velocity. Speed is useless if hires are poor quality. Balance: 30–45 day time-to-hire is healthy; under 15 days risks poor quality. Wrong hire costs 50% of annual salary + 6 months of lost productivity. Better to hire right in 40 days than hire wrong in 15 days.",
  },
  {
    num: "08",
    category: "Retention Strategy",
    title: "Onboarding & Retention Planning",
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    type: "Retention",
    desc: "Hiring doesn't end at offer — it ends at 6-month retention. Plan onboarding: mentor assignment, 30/60/90 day goals, culture integration. Check in regularly: 1-week, 1-month, 3-month, 6-month. Address issues immediately. Celebrate wins. Engaged new hires = retained new hires. Cost of replacing someone you hired: 1.5–2x their salary.",
  },
];

const faqs = [
  {
    q: "How long should a typical hiring process take?",
    a: "Best practice: 30–45 days from job posting to offer accepted. For senior roles: 45–60 days acceptable. Under 30 days risks poor quality. Over 60 days loses candidates to competitors. Key: Faster is good, but never sacrifice quality for speed. A wrong hire costs 50%+ of annual salary.",
  },
  {
    q: "What's the best source for hiring quality candidates?",
    a: "Ranked by quality: Employee referrals (90% retention), Direct recruiting on LinkedIn (high quality but time-intensive), Niche job boards like GreatHire for freshers, University partnerships, General portals like Naukri. Use multiple channels — no single source is best. Employee referrals often have highest ROI.",
  },
  {
    q: "How do I reduce bias in hiring?",
    a: "Use standardized questions for all candidates. Score using rubrics, not gut feeling. Have multiple interviewers score independently. Use structured assessments for technical evaluation. Avoid questions about personal life unless relevant. Diverse interview panels reduce bias. Review hiring data quarterly: Are you hiring diverse candidates? If not, adjust your process.",
  },
  {
    q: "Should I hire based on skill or cultural fit?",
    a: "Both matter, but differently. Skills can be taught (60% of role); culture fit is harder to change. Interview for: technical capability (must-have), willingness to learn (high priority), communication style (cultural fit). Prioritize candidate who has 70% of skills + strong culture fit over someone with 100% skills + poor fit.",
  },
  {
    q: "How do I evaluate a candidate's potential vs immediate capability?",
    a: "For freshers: Assess learning ability, problem-solving, adaptability, communication. For experienced: Track record of learning new things, willingness to stretch, past growth trajectory. Ask in interviews: 'Tell me about a time you learned something outside your comfort zone.' Potential is as important as experience.",
  },
  {
    q: "What are red flags I should watch for?",
    a: "Red flags: Frequent job changes without explanation, vague answers to technical questions, lack of enthusiasm for role/company, poor communication, unreliable during interview process. Yellow flags: Overqualified (might leave quickly), underqualified but evasive about gaps, conflicting information between interviews. Trust your gut, but verify with data.",
  },
  {
    q: "How do I retain good hires after they join?",
    a: "Plan onboarding: mentor assignment, 30/60/90 day goals. Check in regularly: 1-week, 1-month, 3-month. Celebrate early wins. Address concerns immediately. Provide growth opportunities early. Engaged new hires stay. Disengaged new hires leave within 12 months. Average cost to replace: 1.5–2x salary.",
  },
  {
    q: "Should I use recruitment agencies or hire internally?",
    a: "Both have pros/cons. Internal: Lower cost, better quality (know company culture). Agencies: Faster for hard-to-fill roles, broader network. Cost: Agencies charge 15–25% of first-year salary. Use agencies for urgent/specialized roles. Use internal for planned hiring. Best: Hybrid approach.",
  },
];

const practices = [
  "Invest time upfront in defining ideal candidate — saves 40% screening time later.",
  "Use multiple sourcing channels — no single channel has all best candidates.",
  "Automate screening with assessments — reduces manual work and bias.",
  "Standardize interviews with rubrics — enables objective comparison.",
  "Communicate status within 24 hours — shows respect, signals professionalism.",
  "Measure quality-of-hire and retention — optimize your hiring system continuously.",
];

const mistakes = [
  "Hiring based on resume alone — skills on paper ≠ actual capability.",
  "Rushing to fill positions — fast hiring often leads to poor-quality hires.",
  "Not defining ideal candidate clearly — attracts wrong candidates.",
  "Using only one sourcing channel — limits your candidate pool.",
  "Interviewing based on gut feeling — introduces bias, misses good candidates.",
  "Slow communication with candidates — loses them to competitors.",
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

export default function HireRightCandidateFaster() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-rose-600 via-pink-700 to-purple-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-rose-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-rose-200 text-sm">
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
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                In 2026, good candidates have options. Your time-to-hire isn't 3 months anymore — it's 30–45 days, or the candidate joins your competitor. Yet most companies still use 1990s hiring processes: slow job postings, unstructured interviews, days between communications. <strong className="text-rose-700">The result? Lost deals. Wrong hires. High turnover.</strong>
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide reveals how to build a hiring system that finds right candidates FAST without sacrificing quality. From defining ideal candidates to streamlined screening to rapid offers — everything you need to hire better, faster.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Why Hiring Speed (Without Sacrificing Quality) Matters in 2026</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The talent market is bipolar: <strong>Great candidates have multiple offers within days.</strong> Average candidates take weeks to find anything. Your speed determines which pool you attract. Fast hiring signals: professional process, respect for candidates' time, operational efficiency. Slow hiring signals: chaos, lack of planning, unprofessionalism.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Data from 2026 hiring reports: Companies with 30–45 day time-to-hire have 40% better retention than those with 60+ day hiring. Why? Faster hiring means less time for candidates to second-guess. Less waiting = higher conversion. Plus, your best candidates often accept first good offer — if you're not first, you lose them.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Hiring Framework</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step system for faster, smarter hiring.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── STRATEGIES ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Proven Hiring Strategies for Speed & Quality</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">From job descriptions to retention — the complete hiring playbook.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {strategies.map((strategy) => (
                <div key={strategy.num} className={`border rounded-2xl p-5 sm:p-6 ${strategy.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{strategy.num}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${strategy.badge}`}>{strategy.type}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-widest">{strategy.category}</p>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{strategy.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{strategy.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: From 90-Day to 35-Day Hiring (Case Study)</h2>
            <div className="bg-gradient-to-br from-rose-600 to-purple-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">T</div>
                <div>
                  <p className="font-bold">Tech Startup (Series B)</p>
                  <p className="text-rose-200 text-xs">Hiring 5 engineers in Q2 2026</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    period: "Before Optimization",
                    status: "90-day hiring cycle",
                    breakdown: "Generic job desc → 300 applicants → 15 interviews → Wrong hires with high turnover",
                  },
                  {
                    period: "After Optimization",
                    status: "35-day hiring cycle",
                    breakdown: "Specific job desc with screening questions → 80 qualified applicants → 8 interviews → Quality hires with 95% retention",
                  },
                ].map((item) => (
                  <div key={item.period} className="bg-white/15 rounded-xl p-4">
                    <p className="text-rose-200 text-xs font-bold uppercase tracking-wider mb-2">{item.period}</p>
                    <p className="font-bold mb-2">{item.status}</p>
                    <p className="text-rose-100 text-sm leading-relaxed">{item.breakdown}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-rose-100 text-sm leading-relaxed">
                  <strong className="text-white">What changed?</strong> Structured job description with screening questions, LinkedIn active recruiting, technical assessments run in parallel, standardized interviews with rubrics, daily communication with candidates, offer prepared within 48 hours of final interview.
                </p>
              </div>
              <p className="text-rose-100 text-sm italic border-t border-white/20 pt-4">
                "Reduced time-to-hire by 61%. Hired 5 quality engineers. Retention after 6 months: 100%. Cost savings: ₹5 LPA in unnecessary extended recruitment. Process now replicable for future hires."
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
              Hiring fast doesn't mean hiring recklessly. It means building systems: clear candidate definition, diverse sourcing, structured screening, standardized interviews, rapid communication. When optimized, a hiring process that once took 90 days takes 30–45 days — without sacrificing quality.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              The companies winning in 2026 aren't those with the biggest budgets — they're those with the most efficient hiring systems. You compete on talent. Talent goes to companies that respect their time and make decisions fast. Your hiring process IS your employer brand.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Build a system. Measure it. Optimize it. Hire right, hire fast.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-rose-600 to-purple-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Optimize Your Hiring?</h2>
            <p className="text-rose-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Access top-quality pre-screened candidates, job board listings, and recruitment tools on GreatHire. Build your hiring system, reduce time-to-hire, and land quality talent.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-rose-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-rose-50 transition-colors shadow-lg"
            >
              Post Jobs & Find Talent on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
