import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const blog = {
  title: "Interview Preparation",
  subtitle: "Building a Structured Interview Process That Works — 2026",
  date: "Dec 16, 2025",
  readTime: "11 min read",
  category: "Interview Tips",
  keywords: [
    "structured interview process",
    "interview preparation 2026",
    "behavioral interview questions",
    "candidate evaluation framework",
    "AI powered hiring tools",
    "interview best practices India",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — Why Structure Beats Instinct",
    desc: "A structured interview process helps employers evaluate candidates across key dimensions, including problem-solving ability, cultural alignment, and behavioral competencies. Unstructured interviews — where every candidate is asked different questions and judged on different criteria — feel natural but are one of the weakest predictors of actual job performance. Before building your interview process, accept a simple truth: 'gut feeling' is not a hiring strategy, it's an unmeasured bias with a confident name.",
  },
  {
    num: "02",
    title: "Build the Right Framework and Question Bank",
    desc: "Define the 4–6 core competencies each role actually requires — for example, problem-solving, communication, technical depth, and adaptability. For each competency, prepare 2–3 standardized questions that every candidate for that role will be asked. Behavioral questions ('Tell me about a time you...') combined with situational questions ('What would you do if...') give a fuller picture than technical questions alone. Build this question bank once per role, and reuse it consistently.",
  },
  {
    num: "03",
    title: "Apply Better Tools and Techniques During the Interview",
    desc: "GreatHire.in enhances this process with AI-powered tools and professional insights, enabling recruiters to make faster, more informed hiring decisions and connect with the talent best suited for their organization. Use standardized scorecards during the interview itself — score immediately after each answer, not at the end of the conversation, to reduce recency bias. Where possible, use 2–3 interviewers per candidate and have them score independently before comparing notes, which significantly reduces individual bias.",
  },
  {
    num: "04",
    title: "Track Outcomes and Continuously Refine Your Process",
    desc: "After hiring, track how each new hire performs against the competencies you assessed in the interview. Did strong interview scores actually predict strong on-the-job performance? If not, your questions or scoring criteria may need adjustment. Review your interview process quarterly — a structured process isn't 'set once and forget,' it's a system you refine as you learn what actually predicts success in your organization.",
  },
];

const mistakes = [
  {
    num: "01",
    title: "Asking Different Questions to Different Candidates",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "Bias Risk",
    desc: "When each candidate is asked a different set of questions based on the conversation's natural flow, there's no consistent basis for comparison. One candidate might be asked easy warm-up questions while another faces tough scenario-based ones purely by chance, making the final decision more about interview 'vibe' than actual competency.",
    fix: "Build a fixed set of core questions per role and ask every candidate the same ones, even if follow-up questions vary based on their answers.",
  },
  {
    num: "02",
    title: "Relying on 'Gut Feeling' Instead of Scorecards",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Most Common",
    desc: "'I just knew within 5 minutes' feels like insight but is usually a bias confirmation story — first impressions, communication style, and even accent can unconsciously drive this feeling, often with little connection to actual job performance. Candidates who interview smoothly aren't always the strongest performers, and nervous candidates aren't always weak ones.",
    fix: "Use a written scorecard tied to specific competencies. Score immediately after the interview, before discussing with other panel members.",
  },
  {
    num: "03",
    title: "Overloading the Interview With Too Many Rounds",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Candidate Fatigue",
    desc: "Five, six, or more interview rounds for a single role signals disorganization more than thoroughness, and it exhausts candidates — especially strong candidates who have other options and less patience for a drawn-out process. Excessive rounds rarely add proportional insight beyond the third or fourth interview.",
    fix: "Cap most roles at 3–4 rounds: an initial screen, a skills or scenario-based round, and a final panel or culture interview.",
  },
  {
    num: "04",
    title: "Ignoring Behavioral and Situational Questions",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Missed Signal",
    desc: "Technical questions alone reveal what a candidate knows, but not how they behave under pressure, handle conflict, or make decisions with incomplete information — all of which matter enormously in real jobs. Skipping behavioral and situational questions means missing a huge part of what determines on-the-job success.",
    fix: "Include at least 2 behavioral questions ('Tell me about a time...') and 1 situational question ('What would you do if...') per interview round.",
  },
  {
    num: "05",
    title: "Letting One Loud Voice Dominate the Panel Decision",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Groupthink",
    desc: "When interviewers discuss a candidate together before individually scoring them, the most senior or most vocal person's opinion often anchors everyone else's judgment, effectively turning a panel of 3–4 independent opinions into one opinion with extra signatures.",
    fix: "Require every interviewer to submit their scorecard independently before any group discussion happens.",
  },
  {
    num: "06",
    title: "Not Giving Candidates Time or Context to Prepare",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Signal Distortion",
    desc: "Surprising candidates with unexpected formats, unclear expectations, or last-minute scheduling changes tests how well someone handles surprises — not how well they'd actually perform in the role. This can unfairly disadvantage strong candidates who simply prefer preparation over improvisation.",
    fix: "Share the interview format, rough topics, and interviewer names in advance so candidates can prepare meaningfully.",
  },
  {
    num: "07",
    title: "Skipping a Real Discussion of Cultural Alignment",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Retention Risk",
    desc: "Technical skills get most of the interview's attention, while genuine alignment on values, working style, and expectations often gets a token five minutes at the end — yet mismatched expectations here are a leading cause of early attrition after hiring.",
    fix: "Dedicate a real segment of at least one round specifically to working style, values, and expectations — not just a rushed closing question.",
  },
  {
    num: "08",
    title: "Not Using Tools to Support Better Decisions",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Missed Efficiency",
    desc: "Manually tracking candidates across spreadsheets and memory, without any structured tooling, makes it hard to compare candidates fairly, spot patterns, or scale a good process across multiple roles and interviewers.",
    fix: "Use AI-powered hiring tools and structured platforms like GreatHire.in to standardize scoring, track candidates, and surface insights across your hiring pipeline.",
  },
];

const caseStudy = {
  name: "BrightPath Fintech",
  role: "35-person Mumbai fintech startup",
  location: "Interview process taking 7 weeks per hire with inconsistent outcomes",
  stages: [
    {
      month: "Month 1",
      title: "Diagnosis",
      desc: "Reviewed the last 15 hiring decisions. Found each interviewer was asking different, self-designed questions, no scorecards existed, and hiring decisions were made in a single group discussion dominated by the founding team's opinions.",
    },
    {
      month: "Month 2",
      title: "Process Rebuild",
      desc: "Built a standardized 4-competency scorecard for each core role. Created a shared question bank with behavioral and situational questions. Required independent scoring before any group discussion, and capped rounds at 3 for most roles.",
    },
    {
      month: "Month 3",
      title: "Results ✓",
      desc: "Time-to-hire dropped from 7 weeks to 3.5 weeks. New hire performance ratings at 90 days improved by 30%, and hiring manager confidence in decisions rose sharply, since every decision now had a documented rationale behind it.",
    },
  ],
  quote:
    "\"We weren't hiring worse people before — we just had no consistent way to tell who was actually strong versus who simply interviewed well. Structure fixed that almost immediately.\"",
};

const practices = [
  "Ask every candidate for a role the same core set of standardized questions.",
  "Score each interview independently using a written scorecard, before group discussion.",
  "Include behavioral and situational questions alongside technical ones.",
  "Cap most interview processes at 3–4 rounds to respect candidates' time.",
  "Give candidates advance context on format and topics so they can prepare properly.",
  "Use structured tools and platforms to track scores and decisions consistently.",
];

const hiringMistakesPractices = [
  "Letting interviewers freestyle their own questions with no shared structure.",
  "Making hiring decisions based on a single loud opinion in a group discussion.",
  "Running 5+ interview rounds that exhaust and lose strong candidates.",
  "Treating cultural fit as an afterthought instead of a real evaluation area.",
  "Skipping scorecards and relying entirely on post-interview memory and gut feel.",
  "Surprising candidates with unexpected formats instead of sharing context upfront.",
];

const faqs = [
  {
    q: "How many interview rounds are ideal for most roles?",
    a: "For most entry-level and mid-level roles, 2–4 rounds strike the right balance: an initial screen, a skills or scenario-based assessment, and a final panel or culture-fit conversation. More than 4 rounds for non-senior roles is usually excessive and risks losing strong candidates to faster-moving competitors.",
  },
  {
    q: "What makes a question 'behavioral' versus 'situational'?",
    a: "Behavioral questions ask about a real past experience — 'Tell me about a time you disagreed with a teammate.' Situational questions ask about a hypothetical scenario — 'What would you do if two priorities conflicted at the last minute?' Using both gives a fuller picture: behavioral questions reveal actual past patterns, while situational questions reveal real-time reasoning.",
  },
  {
    q: "How do you reduce bias in interview panels?",
    a: "Use the same standardized questions for every candidate, require independent scoring before group discussion, and build diverse interview panels where possible. Training interviewers to recognize common biases — like the halo effect or affinity bias — also meaningfully improves decision quality.",
  },
  {
    q: "Should technical skills or cultural fit matter more in an interview?",
    a: "Both matter, but they answer different questions. Technical skills indicate whether someone can do the job; cultural and behavioral alignment indicates whether they'll thrive and stay. Neglecting either one increases the risk of either an underperforming hire or an early departure.",
  },
  {
    q: "How can AI tools improve the interview process without replacing human judgment?",
    a: "AI-powered tools can help structure question banks, standardize scorecards, flag inconsistent evaluation patterns, and surface insights across many candidates — but the final judgment on fit and potential should remain a human decision informed by that structured data, not replaced by it.",
  },
  {
    q: "What's the biggest sign that an interview process needs to change?",
    a: "If new hires are frequently underperforming despite strong interview scores, or if your best candidates are dropping out mid-process, that's a clear signal your interview structure isn't measuring the right things or is taking too long. Both point to the same root fix: build more consistency and speed into your process.",
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

export default function InterviewPreparationBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
      {/* ── BACK BUTTON ── */}
  <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
    <Link
      to="/Main_blog_page"
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Blog
    </Link>
  </div>

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 text-white">
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
                A <strong className="text-indigo-700">structured interview process</strong> helps
                employers evaluate candidates across key dimensions, including problem-solving
                ability, cultural alignment, and behavioral competencies. Interviews built on instinct
                alone are inconsistent, hard to compare, and vulnerable to bias — no matter how
                experienced the interviewer.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                GreatHire.in enhances this process with AI-powered tools and professional insights,
                enabling recruiters to make faster, more informed hiring decisions and connect with the
                talent best suited for their organization. This guide breaks down exactly how to build
                a structured, fair, and efficient interview process from the ground up.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Structured Interview Preparation Matters in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Unstructured interviews are one of the weakest predictors of actual job performance, yet
              they remain the default approach at many companies. Without a consistent framework,
              hiring decisions end up shaped more by interview 'chemistry' and confidence than by
              genuine evidence of a candidate's ability to succeed in the role.
            </p>
            <p className="text-gray-600 leading-relaxed">
              A well-prepared, structured interview process protects against bias, respects candidates'
              time, and gives hiring teams a documented, defensible rationale for every decision — all
              of which compound into stronger hires and lower attrition over time.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Step-by-Step Guidance to Build a Structured Interview Process
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A 4-step framework to prepare, run, and continuously refine your interviews.
            </p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-indigo-700 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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
              8 Most Common Interview Mistakes (and How to Fix Them)
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
              Real Example: How One Startup Cut Time-to-Hire in Half With Structured Interviews
            </h2>
            <div className="bg-gradient-to-br from-indigo-700 to-slate-900 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  B
                </div>
                <div>
                  <p className="font-bold">{caseStudy.name}</p>
                  <p className="text-indigo-200 text-xs">
                    {caseStudy.role} — {caseStudy.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {caseStudy.stages.map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                      {m.month}
                    </p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-indigo-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-indigo-200 text-sm italic border-t border-white/20 pt-4">
                {caseStudy.quote}
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
              Great interviews aren't about finding the candidate who happens to click best with the
              interviewer in the room — they're about building a consistent, fair system that reveals
              genuine problem-solving ability, cultural alignment, and behavioral competencies across
              every candidate equally. Structure isn't bureaucracy; it's what makes hiring decisions
              defensible, comparable, and ultimately more accurate.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Prepare the process. Trust the evidence. Hire with confidence.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-indigo-700 to-slate-900 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Make Smarter, Faster Hiring Decisions
            </h2>
            <p className="text-indigo-200 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire connects recruiters with AI-powered tools and professional insights to build
              structured interviews and find the talent best suited for your organization.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-indigo-800 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
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
