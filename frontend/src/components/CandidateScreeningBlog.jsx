import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Best Ways to Screen Candidates Efficiently",
  subtitle: "Candidate Screening Process Guide — 2026",
  date: "May 06, 2026",
  readTime: "11 min read",
  category: "Hiring Strategy",
  keywords: [
    "candidate screening process",
    "how to screen candidates efficiently",
    "recruitment screening best practices 2026",
    "resume screening tips India",
    "candidate evaluation methods",
    "hiring screening tools India 2026",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — What an Efficient Screening Process Actually Looks Like",
    desc: "Most companies screen candidates reactively — reviewing resumes as they arrive, scheduling calls without criteria, and relying on gut feel to decide who moves forward. The result is inconsistency, bias, and a screening funnel that buries strong candidates under volume. Efficient screening starts with definition: what does a qualified candidate for this role actually look like? Before opening a requisition, align your hiring team on the must-have criteria (skills, experience level, role-specific competencies), the nice-to-haves, and the dealbreakers. Document these as a screening scorecard. Every screening decision should be measured against these criteria — not against vague impressions. When everyone on the team uses the same benchmark, screening becomes faster, fairer, and far more predictive of on-the-job success.",
  },
  {
    num: "02",
    title: "Build the Right Screening Infrastructure Before Applications Arrive",
    desc: "Screening efficiency is built before the first resume arrives — not during. Infrastructure to build: (1) A role-specific screening scorecard with weighted criteria (must-haves vs nice-to-haves). (2) A structured phone screen template with 5–7 consistent questions for every candidate at that stage. (3) A skills assessment or take-home task for roles where technical ability needs to be verified — built and reviewed before the role goes live. (4) Clear SLAs for each screening stage: how long before a recruiter reviews a new application (target: 48 hours), how long between phone screen and next stage (target: 3 business days). (5) A candidate tracking system — whether your ATS or a well-maintained spreadsheet — so no candidate falls through the cracks. Infrastructure built once eliminates the per-hire friction that makes screening feel chaotic.",
  },
  {
    num: "03",
    title: "Apply Smart Strategies and Tools Across Each Screening Stage",
    desc: "Stage 1 — Resume screening: Use your scorecard to evaluate each resume in under 3 minutes. Look for evidence of relevant skills, real projects, and specific accomplishments — not just keyword lists. For high-volume roles, use ATS filters or AI-assisted screening to handle the first pass, but always have a human review borderline cases. Stage 2 — Phone screen: Run a 15–20 minute structured call using your question template. Evaluate role fit, communication quality, and basic competency alignment. Score immediately after the call using your scorecard. Stage 3 — Skills assessment: For technical roles, use a take-home task or timed assessment (30–60 mins max). For non-technical roles, a written exercise or short case study works well. Keep assessments short — anything over 90 minutes drives dropout among top candidates. Stage 4 — Final interview: By this stage, only the top 10–15% of applicants should reach the panel. The interview's job is to confirm what screening already indicated and assess culture and team fit.",
  },
  {
    num: "04",
    title: "Track Screening Metrics and Improve the Funnel Continuously",
    desc: "An efficient screening process is never finished — it's continuously calibrated. Track these screening-specific metrics monthly: Application-to-phone-screen rate (what percentage of applicants are worth a call — if it's under 10%, your JD is attracting the wrong pool; if it's over 40%, your initial filter is too loose). Phone-screen-to-assessment pass rate (if under 30%, your phone screen criteria may be misaligned). Assessment completion rate (if under 60%, your task is too long or unclear). Screening-to-offer conversion time (how many days from application to offer). Screening decision accuracy at 6 months (do candidates who scored well in screening also perform well on the job?). Quarterly, review these with your recruiting team and hiring managers. Adjust scorecards, question banks, and assessment difficulty based on what the data tells you — not what feels right.",
  },
];

const methods = [
  {
    num: "01",
    title: "Structured Resume Screening with a Scorecard",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Foundation",
    desc: "Replace ad hoc resume review with a role-specific scorecard. Score each resume on 4–6 weighted criteria: relevant skills match, project or work quality, experience level alignment, and communication clarity. This takes the same time as gut-feel review — but produces consistent, defensible, and far more accurate decisions. Build the scorecard once per role family; update quarterly.",
    tip: "Tip: Give 'must-have' criteria 3x the weight of 'nice-to-have' criteria. A candidate who nails all must-haves but lacks nice-to-haves beats a candidate with the reverse — every time.",
  },
  {
    num: "02",
    title: "Structured Phone Screen (15–20 Minutes)",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Speed Filter",
    desc: "A short, structured phone screen eliminates 40–60% of unqualified applicants before they enter the interview pipeline. Use 5 consistent questions per role: 1 on motivation and role awareness, 2 on relevant skills or experience, 1 situational or behavioral question, 1 on logistics (location, notice period, salary range). Score using your scorecard immediately after — before your impression fades.",
    tip: "Tip: Record the call (with consent) and review your scorecard decisions quarterly to check for drift or bias in your phone screening judgments.",
  },
  {
    num: "03",
    title: "Skills-Based Assessments for Technical Roles",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Ability Proof",
    desc: "For developer, data, QA, and design roles, a 30–60 minute take-home assessment is the most reliable predictor of on-the-job performance. Platforms like HackerRank, Codility, and TestGorilla automate delivery and scoring. For non-technical roles, a short written exercise or case study works equally well. Keep assessments role-relevant and time-boxed. Anything over 90 minutes drives dropout among your strongest candidates — who have the most options.",
    tip: "Tip: Always give candidates a clear brief, a realistic deadline (48–72 hours), and feedback on their submission — even if they don't progress. It protects your employer brand.",
  },
  {
    num: "04",
    title: "ATS Filtering and AI-Assisted First Pass",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    badgeLabel: "Volume Tool",
    desc: "For high-volume roles receiving 200+ applications, ATS filters and AI-assisted screening tools handle the first-pass triage — flagging candidates who match keyword and criteria thresholds and deprioritizing those who don't. Platforms like Keka, Darwinbox, Zoho Recruit, and Greenhouse offer this capability. Critical caveat: always have a human review the 'borderline' bucket — automated tools miss strong candidates who express qualifications in non-standard ways.",
    tip: "Tip: Never use ATS filters as a hard gate on their own. Use them to sort the queue — humans make the final call on every candidate who reaches the phone screen.",
  },
  {
    num: "05",
    title: "One-Way Video Interviews for Async Screening",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Time Saver",
    desc: "One-way video interview tools (HireVue, Spark Hire, or even a simple Loom-based prompt) let candidates record answers to 3–5 structured questions on their own schedule — and let your team review asynchronously. This eliminates scheduling friction, compresses the time between application and qualified-candidate identification by 3–5 days, and gives your team richer signal than a resume alone. Works especially well for communication-heavy roles.",
    tip: "Tip: Keep video prompts under 5 questions with a 2-minute response limit each. Longer formats drive dropout and signal poor process design to candidates.",
  },
  {
    num: "06",
    title: "Structured Reference Checks (Done Right)",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Validation",
    desc: "Most reference checks are performative — a polite call that confirms dates of employment. Done properly, structured reference checks are a high-signal screening tool. Ask references: 'In what area did [candidate] most need to improve?' and 'How would you describe their work quality under pressure?' and 'Would you rehire them unreservedly?' These questions produce real signal — especially the last one, where hesitation speaks louder than the answer.",
    tip: "Tip: Ask for references who were direct managers, not colleagues or friends. Peer references are easier to game. Manager references reveal performance reality.",
  },
  {
    num: "07",
    title: "Blind Resume Screening to Reduce Bias",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Bias Reduction",
    desc: "Blind screening — removing candidate name, photo, college name, and graduation year before the first review — significantly reduces affinity bias and pedigree bias in the initial screening stage. Several ATS platforms support this natively. For companies without ATS, a simple process of having a recruiter anonymize resumes before passing to hiring managers achieves the same effect. The goal: your screening decisions are driven by skills and evidence, not by names or institutions.",
    tip: "Tip: Combine blind screening with a structured scorecard. The two together eliminate the most common sources of early-stage screening bias.",
  },
  {
    num: "08",
    title: "Calibration Sessions Between Screeners",
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    badgeLabel: "Consistency",
    desc: "When multiple recruiters or hiring managers screen candidates for the same role, their standards drift over time — without either party noticing. Monthly calibration sessions (30 minutes, reviewing 5–10 borderline decisions together) realign scoring standards, surface hidden bias patterns, and keep your screening consistent across the team. Calibration is the maintenance that keeps your screening engine running at the quality it was designed for.",
    tip: "Tip: In calibration sessions, focus on the 'borderline pass' and 'borderline reject' decisions — these are where individual judgment diverges most and where alignment has the highest impact.",
  },
];

const practices = [
  "Build and use a role-specific screening scorecard for every open position — evaluate every candidate against the same criteria.",
  "Set 48-hour SLAs for resume review and 3-business-day SLAs between screening stages to keep top candidates in your pipeline.",
  "Use the same structured phone screen questions for every candidate — consistency is the foundation of fair, predictive screening.",
  "Keep skills assessments under 60 minutes — longer tasks drive dropout among the strongest candidates who have the most options.",
  "Review screening metrics quarterly: application-to-screen rate, completion rate, and screening-to-hire accuracy at 6 months.",
  "Run monthly calibration sessions when multiple people are screening — standards drift without deliberate realignment.",
];

const screeningMistakes = [
  "Screening without a scorecard — gut-feel decisions are inconsistent, biased, and poorly predictive of performance.",
  "Letting applications sit for 5–10 days before first review — strong candidates accept other offers while you wait.",
  "Using the same generic assessment for every role — irrelevant tasks signal poor process design and drive dropout.",
  "Relying solely on ATS keyword filters — they miss strong candidates who describe qualifications in non-standard language.",
  "Skipping structured phone screens and going straight to panel interviews — it wastes 3–4 hours per unqualified candidate.",
  "Not giving feedback to screened-out candidates — it damages your employer brand and reduces future application quality.",
];

const faqs = [
  {
    q: "What is the most efficient way to screen a large volume of candidates?",
    a: "A three-stage approach works best for high-volume roles: ATS keyword filtering for the first pass (to sort, not eliminate), a structured scorecard review for the top 20–30% of filtered candidates, and a 15-minute structured phone screen for those who pass resume review. This compresses 200 applications into 10–15 qualified phone screen candidates in under 3 days — without sacrificing screening quality.",
  },
  {
    q: "How long should a candidate screening process take from application to offer?",
    a: "For junior and fresher roles: 2–3 weeks is the target. For mid-level roles: 3–4 weeks. For senior roles: 4–6 weeks. Anything beyond these ranges risks losing strong candidates to faster-moving companies. The biggest time killers are scheduling delays between stages, slow internal approvals, and undefined decision-making authority — all of which are process problems, not candidate problems.",
  },
  {
    q: "Should companies use AI tools for candidate screening?",
    a: "AI tools are effective for first-pass triage and reducing time spent on clearly unqualified applications. They're unreliable as decision-makers on their own. Use AI to sort and surface — but always have a human make the final call on every candidate who reaches the phone screen. AI screening tools also carry bias risks if trained on historical hiring data that reflected past biases — audit their outputs regularly.",
  },
  {
    q: "What questions should a structured phone screen include?",
    a: "A 15–20 minute phone screen should cover: (1) Why this role and company — tests research and genuine motivation. (2) Walk me through a relevant project or experience — tests communication and depth. (3) One skill-specific question tied to a must-have on the JD. (4) One situational question (e.g., 'Tell me about a time you handled a deadline pressure'). (5) Logistics — location, notice period, salary expectations. Score all five on your scorecard immediately after the call.",
  },
  {
    q: "How do you reduce bias in the candidate screening process?",
    a: "Three proven methods: blind resume screening (remove name, photo, college, graduation year before first review), structured scorecards with weighted criteria (replace gut feel with consistent evaluation), and calibration sessions between screeners (align standards monthly). No single method eliminates bias entirely — but combining all three dramatically reduces its impact on screening decisions.",
  },
  {
    q: "What is a good application-to-interview conversion rate for screening?",
    a: "For most roles, 5–15% of applicants should reach the interview stage after screening. If your rate is under 5%, your JD may be attracting a misaligned applicant pool — review and tighten the role description. If it's over 25%, your initial screening criteria may be too loose — tighten the scorecard or add a skills assessment before the interview stage.",
  },
  {
    q: "Should skills assessments be paid for candidates?",
    a: "For assessments over 60 minutes, compensating candidates is increasingly considered best practice — especially for senior roles. For short assessments (30–45 minutes), compensation is less common but appreciated. At minimum, always give every candidate who completes an assessment a response within 5 business days — even if it's a rejection. Ghosting post-assessment is one of the most damaging things a company can do to its employer brand.",
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
          className={`text-indigo-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${
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

export default function CandidateScreeningBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-indigo-200 text-xl sm:text-2xl font-light mb-6">
              ({blog.subtitle})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-indigo-200 text-sm">
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
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                For most hiring teams, the{" "}
                <strong className="text-indigo-700">candidate screening process</strong> is where good
                intentions collapse into chaos. Hundreds of applications arrive, resumes pile up
                unreviewed, strong candidates slip through the cracks, and by the time the team starts
                interviewing, the best people have already accepted other offers.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide lays out the best methods to screen candidates efficiently in 2026 — the
                tools, the workflows, the scorecards, and the metrics that transform a chaotic,
                gut-driven funnel into a consistent, fast, and accurate screening engine that finds the
                right people without burning out your team.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Candidate Screening Is Broken at Most Companies — and Why It Matters
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              India's job market in 2026 is high-volume and fast-moving. A single job posting on
              Naukri or LinkedIn can generate 300–800 applications within 72 hours. Without a
              structured screening process, recruiting teams spend 60–70% of their time reviewing
              applications that should have been filtered in the first pass — and still miss the
              candidates who would have been a great fit.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The companies that hire the best talent consistently aren't those with the biggest
              budgets — they're the ones with the sharpest screening processes. They define what
              qualified looks like before applications arrive, use structured tools at every stage, and
              measure their funnel's performance to improve it continuously. This guide shows you
              exactly how they do it.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Step-by-Step Guidance to Build an Efficient Screening Process
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A 4-step framework to go from chaotic screening to a consistent, high-signal funnel.
            </p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── METHODS CARDS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              8 Best Methods to Screen Candidates Efficiently in 2026
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              Each method works best at a specific stage — use them in combination for maximum impact.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {methods.map((method) => (
                <div
                  key={method.num}
                  className={`border rounded-2xl p-5 sm:p-6 ${method.color} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{method.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${method.badge}`}>
                      {method.badgeLabel}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">{method.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{method.desc}</p>
                  <div className="pt-3 border-t border-gray-200/70">
                    <p className="text-xs text-gray-500 italic leading-relaxed">{method.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Real Example: How a 20-Person Team Reduced Time-to-Qualified-Candidate by 65%
            </h2>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  N
                </div>
                <div>
                  <p className="font-bold">NexaHR (Bengaluru Fintech, 120 Employees)</p>
                  <p className="text-indigo-200 text-xs">
                    Hiring Team of 3 — Drowning in 400+ Applications Per Role
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Month 1",
                    title: "Diagnosis",
                    desc: "Audited their screening funnel. Found: no scorecards, resumes reviewed 6–8 days after posting, no structured phone screen, assessment was a 3-hour task with 35% completion rate. Average time from application to first interview: 19 days.",
                  },
                  {
                    month: "Month 2",
                    title: "Process Rebuilt",
                    desc: "Built scorecards for 4 core roles. Created 5-question phone screen templates. Replaced 3-hour assessment with a 45-minute task. Set 48-hour resume review SLA and 3-day stage-to-stage SLA. Added ATS keyword filter for first-pass triage.",
                  },
                  {
                    month: "Month 3",
                    title: "Results ✓",
                    desc: "Time from application to first interview: 7 days (down from 19). Assessment completion rate: 78% (up from 35%). Phone screen pass rate: 32% more accurate as measured by 6-month performance scores. Team screened 40% more candidates with the same headcount.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                      {m.month}
                    </p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-indigo-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-indigo-100 text-sm italic border-t border-white/20 pt-4">
                "Same team size, same applicant volume — completely different outcomes. The only change was a structured, measured screening process."
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
                {screeningMistakes.map((item, i) => (
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
              An efficient candidate screening process is not a luxury — it's a competitive advantage.
              Companies that screen consistently, fast, and fairly identify strong candidates before
              their competitors do, protect their hiring team from burnout, and build institutional
              knowledge about what good actually looks like in each role. The investment is modest: a
              scorecard, a structured phone screen template, a time-boxed assessment, and a commitment
              to measuring outcomes. The return — faster hires, better retention, lower recruiting
              cost — compounds over every hiring cycle.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Build the screening system once. Calibrate it quarterly. Let it find your best people
              before anyone else does.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Screen Smarter. Hire Faster.
            </h2>
            <p className="text-indigo-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire gives you access to pre-screened, verified fresher and junior talent across IT,
              data, business, and more — so your team spends time on the right candidates, not the
              wrong ones.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-indigo-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Start Hiring on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}