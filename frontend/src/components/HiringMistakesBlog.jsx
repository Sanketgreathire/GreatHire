import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Top Hiring Mistakes Companies Make",
  subtitle: "Hiring Mistakes Guide for Employers — 2026",
  date: "May 06, 2026",
  readTime: "11 min read",
  category: "Hiring Strategy",
  keywords: [
    "hiring mistakes companies",
    "common recruitment mistakes 2026",
    "how to avoid bad hires India",
    "talent acquisition mistakes",
    "recruitment process mistakes",
    "hiring best practices India 2026",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — Why Bad Hires Happen and What They Actually Cost",
    desc: "Most hiring mistakes don't start in the interview room — they start weeks earlier, in unclear job descriptions, rushed timelines, and undefined success criteria. Before improving your hiring process, understand where it breaks down. Audit your last 10 hires: how many are still with the company after 12 months? How many underperformed in the first 90 days? How long did it take to fill each role? Which steps caused the most delays? A bad hire at the entry level costs 30–50% of annual salary when you factor in recruiting time, onboarding, lost productivity, and the cost of rehiring. A bad senior hire can cost 2–3x annual salary. Understanding this cost — clearly and honestly — is what gives leadership teams the motivation to fix the process rather than just complain about candidates.",
  },
  {
    num: "02",
    title: "Build Relevant Skills and Systems Within Your Hiring Team",
    desc: "Hiring is a skill — and most hiring managers have never been trained in it. Build capability across your recruiting function: train hiring managers on structured interviewing, bias recognition, and evaluation frameworks. Develop standardized scorecards for each role so every interviewer assesses the same criteria. Build a job description library with clear role requirements, success metrics, and realistic expectations. Create an interview question bank mapped to the competencies each role actually requires. Invest in your ATS (Applicant Tracking System) — if your team is tracking candidates in spreadsheets or email threads, you're losing good candidates to friction. Hiring capability compounds: the investment in training your team pays dividends on every future hire.",
  },
  {
    num: "03",
    title: "Apply Better Strategies and Tools Across Your Recruitment Process",
    desc: "Fix the process at every stage. At sourcing: diversify your channels — don't rely solely on one job portal. Use GreatHire for fresher roles, LinkedIn for experienced and senior hiring, Naukri for volume, and employee referral programs for culture-fit candidates. At screening: use structured phone screens with consistent questions instead of ad hoc conversations. At interviews: implement structured panel interviews with scorecards. Remove unconscious bias by standardizing the questions every candidate is asked. At offers: move fast — top candidates have multiple offers. Delays of more than 5 business days between final interview and offer lose candidates at alarming rates in 2026's market. At onboarding: structure the first 90 days with clear milestones — most new hire failures happen here, not in the interview.",
  },
  {
    num: "04",
    title: "Track Hiring Metrics and Improve the Process Continuously",
    desc: "What gets measured gets improved. Track these hiring metrics consistently: time-to-fill (days from job opening to accepted offer), time-to-productivity (days until new hire is performing independently), offer acceptance rate (if below 70%, your offers or process have problems), 90-day retention rate (if below 80%, your screening or onboarding is broken), quality of hire (manager satisfaction rating at 6 months), and source of hire (which channels produce your best long-term employees). Review these metrics quarterly with your HR and leadership team. When a metric drops, trace it back to the stage where it broke. Hiring improvement is not a one-time project — it's a continuous operational discipline that compounds over years into a genuine talent advantage.",
  },
];

const mistakes = [
  {
    num: "01",
    title: "Writing Vague or Unrealistic Job Descriptions",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "Most Common",
    desc: "Job descriptions that list 25 requirements for an entry-level role, demand '5 years of experience' for junior positions, or use generic language like 'team player' and 'self-starter' attract the wrong candidates and repel strong ones. A good JD clearly states: what the person will do in the first 90 days, the 3–5 skills that are genuinely required versus nice-to-have, realistic experience requirements, and honest information about the role's challenges. Vague JDs produce vague candidates.",
    fix: "Audit every open JD. Remove inflated requirements. Add a '30-60-90 day expectations' section. Get the hiring manager to validate before posting.",
  },
  {
    num: "02",
    title: "Hiring for Culture Fit Instead of Culture Add",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Bias Risk",
    desc: "Hiring for 'culture fit' often means hiring people who look, think, and communicate like the existing team. This feels safe — but it produces homogeneous teams that lack diverse thinking, blind-spot coverage, and the creative friction that drives innovation. Companies that consistently hire for fit over ability end up with groupthink, not cohesion. The better frame: hire for culture add — what perspective, background, or thinking style does this person bring that we don't already have?",
    fix: "Replace 'culture fit' on scorecards with specific, observable behaviors. Define your culture explicitly so 'fit' means shared values, not shared backgrounds.",
  },
  {
    num: "03",
    title: "Moving Too Slowly Through the Hiring Process",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Costly Delay",
    desc: "In 2026, strong candidates — especially in tech and data roles — receive multiple offers within 1–2 weeks of starting their search. A hiring process that takes 6–8 weeks loses these candidates to faster-moving companies. Common culprits: too many interview rounds, scheduling delays between stages, slow internal approvals, and offer processes that take a week after verbal acceptance. Every unnecessary day in your process is a candidate lost to a competitor.",
    fix: "Audit time-to-offer for your last 20 hires. Cap total interview rounds at 3–4. Set SLAs between stages. Pre-approve offer ranges before the process starts.",
  },
  {
    num: "04",
    title: "Skipping Structured Interviews for Gut-Feel Decisions",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Bias Driver",
    desc: "Unstructured interviews — where different candidates are asked different questions and evaluated on different criteria — are one of the weakest predictors of job performance. Yet most companies still rely on them. 'I just knew within 5 minutes' is not a hiring strategy — it's a bias confirmation story. Candidates who interview well socially often underperform; candidates who seem nervous often outperform. Structured interviews with standardized questions and scorecards dramatically improve both consistency and quality of hire.",
    fix: "Build a 5–7 question interview guide for each role tied to the key competencies. Use the same questions for every candidate. Score immediately after, before discussing with the panel.",
  },
  {
    num: "05",
    title: "Over-Indexing on Pedigree and Under-Indexing on Ability",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Missed Talent",
    desc: "Filtering candidates by college tier, company brand, or degree prestige feels like a quality shortcut — but it's a talent-filtering mistake. India's best developers, analysts, and operators frequently come from Tier-2 colleges with exceptional project portfolios and problem-solving ability. Screening for IIT/IIM pedigree alone means you're competing with every other company doing the same — and missing a vast, high-quality talent pool that doesn't clear your arbitrary filters.",
    fix: "Remove automatic college or company filters from early screening. Replace them with skill-based assessments or portfolio reviews. Judge the work, not the institution.",
  },
  {
    num: "06",
    title: "Neglecting Candidate Experience During the Process",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Brand Impact",
    desc: "Every candidate who goes through your hiring process — whether hired or rejected — forms an opinion of your company that they share with their network. Ghosting candidates after final rounds, providing no feedback on rejection, scheduling interviews with 2-hour notice, or running disorganized panel interviews all damage your employer brand. In 2026, Glassdoor reviews, LinkedIn posts, and candidate word-of-mouth directly affect your ability to attract strong candidates in the future.",
    fix: "Set candidate communication SLAs: respond to all applications within 5 days, give feedback on rejection within 3 days of decision, never ghost after final rounds. Assign ownership to a recruiter for every candidate in the process.",
  },
  {
    num: "07",
    title: "Failing to Define Success Before Hiring",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Process Gap",
    desc: "If your hiring team can't answer 'what does great performance look like in this role at 30, 60, and 90 days?', you're hiring without a target. This leads to mismatched expectations, poor onboarding, and early turnover. The hiring manager and recruiter need to align on success criteria before the first JD goes live — not after the candidate joins.",
    fix: "Create a 30-60-90 day success plan for every role before opening the requisition. Use it to write the JD, design interview questions, and structure onboarding. The plan is the hiring spec.",
  },
  {
    num: "08",
    title: "Treating Onboarding as an Afterthought",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Retention Risk",
    desc: "Most companies spend weeks optimizing hiring and hours on onboarding — then wonder why new hires leave within 6 months. Poor onboarding is the single largest driver of early attrition. A new hire who doesn't have a clear role, a supportive manager, the right tools, or a sense of belonging within the first 4 weeks is already mentally halfway out the door. Strong onboarding dramatically improves retention, time-to-productivity, and new hire satisfaction.",
    fix: "Build a structured 90-day onboarding plan for every role: week 1 orientation, month 1 role clarity, month 2 independent contribution, month 3 performance review. Assign a buddy or mentor for the first 30 days.",
  },
];

const practices = [
  "Define success criteria for every role before opening the requisition — not after the candidate joins.",
  "Use structured interviews with standardized questions and scorecards across every panel member.",
  "Set time-based SLAs for every hiring stage — and hold recruiters and hiring managers accountable to them.",
  "Communicate proactively with every candidate at every stage — silence is a brand-damaging mistake.",
  "Track quality of hire at 6 months — not just time-to-fill — as your primary recruiting success metric.",
  "Treat onboarding as part of the hiring process, not a post-hire admin task.",
];

const hiringMistakesPractices = [
  "Writing JDs without consulting the hiring manager about actual day-to-day requirements.",
  "Running 6+ interview rounds for entry-level roles — it's excessive and loses candidates.",
  "Making offers without pre-approval on salary range, causing delays that cost you the candidate.",
  "Evaluating candidates inconsistently — different questions for different people obscures real comparison.",
  "Relying on referrals alone — it limits diversity and creates echo chambers over time.",
  "Ignoring data — hiring without tracking metrics means repeating the same mistakes indefinitely.",
];

const faqs = [
  {
    q: "What is the most expensive hiring mistake a company can make?",
    a: "Hiring the wrong person for a senior or specialized role. The cost includes: recruiter fees, onboarding investment, 6–12 months of underperformance, team morale impact, and the full cost of rehiring. Studies consistently place the total cost of a bad senior hire at 2–3x annual salary. The most expensive mistake is usually not the process failure — it's the failure to define what success looks like before hiring.",
  },
  {
    q: "How do you avoid bias in hiring?",
    a: "Use structured interviews with the same questions for every candidate. Build diverse interview panels. Evaluate candidates immediately after each interview using a scorecard before discussing with others. Remove identifying information (name, college, photo) during initial screening where possible. Train all interviewers on common cognitive biases — affinity bias, halo effect, and confirmation bias are the most damaging in hiring.",
  },
  {
    q: "How many interview rounds should a company run for fresher roles?",
    a: "2–3 rounds is optimal for most entry-level and fresher roles: a structured phone screen, a skills-based assessment or task, and a final panel interview. More than 3 rounds for junior roles is excessive and signals poor process design. It also drives candidate dropout — especially among the strongest candidates who have multiple options.",
  },
  {
    q: "Why do companies keep making the same hiring mistakes?",
    a: "Three main reasons: they don't track hiring metrics so they never see the pattern, they treat hiring as an HR function rather than a shared business responsibility, and they deprioritize hiring process investment when business is busy. The irony is that bad hires make the business busier — creating more pressure and less time to fix the root cause.",
  },
  {
    q: "What's the best way to improve time-to-hire without reducing quality?",
    a: "Pre-approve offer ranges before the process starts. Cap interview rounds at 3–4. Set SLAs between each stage (e.g., 48-hour response after screening, 5-day gap max between rounds). Use async video interviews or take-home assessments to remove scheduling bottlenecks. The biggest time killers in hiring are scheduling friction, internal approval delays, and undefined decision-making authority.",
  },
  {
    q: "How do you write a job description that attracts the right candidates?",
    a: "Lead with what the candidate will do — not what the company does. Be specific about the first 30–60 days. Separate required skills from nice-to-haves and list no more than 5 genuine requirements. Include realistic salary range (it dramatically increases application quality). Be honest about the role's challenges. Remove inflated experience requirements — if you'd genuinely consider a strong 1-year-experience candidate, don't write '3–5 years required.'",
  },
  {
    q: "What metrics should companies track to measure hiring quality?",
    a: "The five most important: time-to-fill (efficiency), offer acceptance rate (process and employer brand health), 90-day retention rate (screening quality), quality of hire at 6 months (hiring manager satisfaction score), and source of hire (which channels produce your best long-term employees). Track monthly, review quarterly, and use the data to make specific process improvements.",
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
          className={`text-slate-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${
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

export default function HiringMistakesBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-slate-300 text-xl sm:text-2xl font-light mb-6">
              ({blog.subtitle})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-slate-300 text-sm">
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

          {/* ── INTRODUCTION ── */}
          <section className="mb-14">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Hiring is one of the highest-leverage activities a company can do — and one of the
                most consistently mishandled. In 2026, with India's talent market more competitive and
                complex than ever,{" "}
                <strong className="text-slate-700">hiring mistakes companies make</strong> are costing
                them far more than a bad quarter: they're costing them their best people, their team
                culture, and their ability to grow.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide breaks down the 8 most common and costly hiring mistakes companies make in
                India today — what causes each one, the real impact on business outcomes, and exactly
                what to do differently — so your next hire is faster, smarter, and built to last.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Hiring Mistakes Are More Expensive Than Ever in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A bad hire at the entry level costs 30–50% of annual salary. A bad senior hire costs
              2–3x. But the financial cost is only the visible part. The hidden costs — team morale
              damage, manager time spent managing underperformance, delayed projects, and the
              institutional knowledge lost when good people leave — often dwarf the direct expense.
            </p>
            <p className="text-gray-600 leading-relaxed">
              India's job market in 2026 is candidate-rich in volume but quality-scarce at the top.
              Strong candidates have options — and they evaluate companies based on the hiring
              experience itself. Companies that run a disorganized, slow, or biased hiring process lose
              the best candidates before they even make an offer. Fixing hiring isn't just an HR
              priority — it's a strategic business imperative.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Step-by-Step Guidance to Build a Stronger Hiring Process
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A 4-step framework to identify, fix, and continuously improve your talent acquisition.
            </p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── MISTAKES CARDS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              8 Most Costly Hiring Mistakes Companies Make (and How to Fix Them)
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              Each mistake has a root cause, a real impact, and a specific fix.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {mistakes.map((mistake) => (
                <div
                  key={mistake.num}
                  className={`border rounded-2xl p-5 sm:p-6 ${mistake.color} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{mistake.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${mistake.badge}`}>
                      {mistake.badgeLabel}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">{mistake.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{mistake.desc}</p>
                  <div className="pt-3 border-t border-gray-200/70">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      The Fix
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">{mistake.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Real Example: How One Startup Cut Early Attrition by 60% in 6 Months
            </h2>
            <div className="bg-gradient-to-br from-slate-700 to-gray-900 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  Z
                </div>
                <div>
                  <p className="font-bold">ZenTech Solutions</p>
                  <p className="text-slate-300 text-xs">
                    50-person Pune SaaS Startup — 45% Early Attrition Problem
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Month 1–2",
                    title: "Diagnosis",
                    desc: "Audited last 20 hires. Found: vague JDs, no structured interviews, 7-week average time-to-offer, zero onboarding structure. Exit interviews revealed: 'unclear role expectations' was the #1 reason for leaving within 90 days.",
                  },
                  {
                    month: "Month 3–4",
                    title: "Process Rebuild",
                    desc: "Rewrote all JDs with 30-60-90 day expectations. Built structured interview scorecards for 5 core roles. Set 3-week max time-to-offer SLA. Created a 90-day onboarding plan with weekly manager check-ins.",
                  },
                  {
                    month: "Month 5–6",
                    title: "Results ✓",
                    desc: "Early attrition dropped from 45% to 18%. Time-to-offer reduced from 7 weeks to 3. Offer acceptance rate rose from 58% to 81%. Quality-of-hire scores at 6 months up 40%. Same team, better process.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">
                      {m.month}
                    </p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-slate-300 text-sm italic border-t border-white/20 pt-4">
                "They didn't hire different people. They built a better system around the same team — and the results compounded immediately."
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
                    <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
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
                {hiringMistakesPractices.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✗</span>
                    <span>{item}</span>
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
              The hiring mistakes companies make in 2026 are rarely about effort — they're about
              system design. Vague job descriptions, unstructured interviews, slow timelines, poor
              candidate communication, and neglected onboarding are all process failures, not
              people failures. The companies that consistently hire great talent aren't luckier — they
              have better systems, clearer definitions of success, and a commitment to measuring and
              improving every step of their recruiting funnel.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Fix the system. The right people will follow.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Find the Right Talent — Without the Guesswork
            </h2>
            <p className="text-slate-300 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire connects companies with verified, screened fresher and junior talent across
              IT, business, data, and more — so you spend less time on bad fits and more time on great
              hires.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-slate-800 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
            >
              Start Hiring Smarter on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}