import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const blog = {
  title: "Behavioral Interview Techniques",
  subtitle: "Predicting Future Performance From Past Behavior — 2026",
  date: "Dec 16, 2025",
  readTime: "10 min read",
  category: "HR Insights",
  keywords: [
    "behavioral interview questions 2026",
    "STAR method interview technique",
    "candidate evaluation framework",
    "teamwork conflict resolution interview",
    "AI powered hiring tools",
    "predicting job performance",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — Why Past Behavior Predicts Future Performance",
    desc: "Behavioral interview techniques are designed to assess how candidates have handled real-world situations in the past, offering valuable insight into their future performance. The underlying principle is simple: how someone actually behaved under pressure, in conflict, or during a tough decision in the past is a far stronger predictor of how they'll behave in similar future situations than how they describe their skills in the abstract. Before running behavioral interviews, get comfortable with this shift — you're not asking 'what would you do,' you're asking 'what did you actually do.'",
  },
  {
    num: "02",
    title: "Build Structured Questions Around Key Competencies",
    desc: "By evaluating responses to structured questions around teamwork, conflict resolution, and decision-making, employers can identify candidates who are not only skilled but also a strong fit for the team. For each role, identify 3–5 core competencies (e.g., collaboration, adaptability, ownership) and prepare specific behavioral prompts for each: 'Tell me about a time you disagreed with a team decision,' 'Describe a situation where you had to make a decision with incomplete information.' Use the same question set across all candidates for a given role.",
  },
  {
    num: "03",
    title: "Apply the STAR Framework to Evaluate Responses",
    desc: "GreatHire.in provides AI-powered tools and expert insights to help streamline this process, but the evaluation itself relies on a simple structure: Situation, Task, Action, Result (STAR). A strong answer clearly describes the context (Situation), what needed to be done (Task), what the candidate specifically did (Action), and the outcome (Result). Vague answers that skip the 'Action' or 'Result' steps — focusing only on what 'the team' did — are a signal to probe further with follow-up questions.",
  },
  {
    num: "04",
    title: "Score Consistently and Refine Your Question Bank Over Time",
    desc: "Use a written scorecard tied to your core competencies, scoring each answer immediately after the interview rather than relying on memory later. Track which questions reliably surface useful, differentiated answers versus which ones most candidates struggle to answer meaningfully — and refine your question bank accordingly. Behavioral interviewing improves with iteration, just like any other structured process.",
  },
];

const mistakes = [
  {
    num: "01",
    title: "Asking Hypothetical Instead of Behavioral Questions",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "Most Common",
    desc: "'What would you do if a teammate missed a deadline?' invites a rehearsed, idealized answer about how the candidate imagines they'd behave. 'Tell me about a time a teammate missed a deadline and how you responded' forces the candidate to draw from a real memory, which is far harder to fabricate convincingly and far more predictive of real behavior.",
    fix: "Rewrite hypothetical ('What would you do if...') questions into behavioral ones ('Tell me about a time when...') across your entire question bank.",
  },
  {
    num: "02",
    title: "Accepting Vague Answers Without Probing Deeper",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Shallow Signal",
    desc: "Candidates often answer with 'we handled it as a team' or 'we figured it out together,' which sounds collaborative but reveals nothing about the candidate's individual contribution, reasoning, or decision-making. Without follow-up, interviewers walk away with a pleasant but useless answer.",
    fix: "Follow up every vague team-based answer with 'What was your specific role in that?' or 'What did you personally decide or do?'",
  },
  {
    num: "03",
    title: "Focusing Only on Positive Outcomes",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Incomplete Picture",
    desc: "Only asking about successes ('Tell me about a project that went well') misses valuable insight into how candidates handle failure, setbacks, and mistakes — arguably more revealing of character and resilience than success stories, which are easier to rehearse and present favorably.",
    fix: "Include at least one question specifically about a failure or setback, such as 'Tell me about a time a project didn't go as planned and what you learned.'",
  },
  {
    num: "04",
    title: "Letting Confident Storytelling Substitute for Real Substance",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Bias Risk",
    desc: "Articulate, confident candidates can tell a compelling story around a fairly minor contribution, while a less polished communicator with a genuinely stronger example may come across as less impressive. Without the STAR framework guiding evaluation, interviewers can mistake charisma for competence.",
    fix: "Score answers specifically against the Action and Result components of STAR, not the overall storytelling quality or confidence of delivery.",
  },
  {
    num: "05",
    title: "Using the Same Generic Questions for Every Role",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Low Relevance",
    desc: "A conflict-resolution question that works well for a customer-facing role may not surface the most relevant signal for a highly independent technical role, where autonomous decision-making under ambiguity matters more than interpersonal conflict handling.",
    fix: "Map 3–5 core competencies specifically to each role's real demands, and tailor at least half your behavioral questions accordingly.",
  },
  {
    num: "06",
    title: "Not Standardizing Questions Across Interviewers",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Inconsistent Data",
    desc: "When different interviewers ask different behavioral questions to the same pool of candidates, there's no consistent basis to compare answers, making the final hiring decision less about actual evidence and more about which interviewer's subjective impression carried the most weight.",
    fix: "Build a shared behavioral question bank per role and require every interviewer on the panel to draw from it.",
  },
  {
    num: "07",
    title: "Rushing Through Answers Without Enough Time",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Missed Depth",
    desc: "A strong behavioral answer with real Situation-Task-Action-Result detail often takes 3–5 minutes to unpack properly. Cramming 8–10 behavioral questions into a 30-minute interview forces surface-level answers that don't reveal much beyond the candidate's most rehearsed talking points.",
    fix: "Limit behavioral interviews to 3–4 well-chosen questions with enough time for real depth and natural follow-up.",
  },
  {
    num: "08",
    title: "Not Leveraging Tools to Support Consistent Evaluation",
    color: "bg-cyan-50 border-cyan-200",
    badge: "bg-cyan-100 text-cyan-700",
    badgeLabel: "Missed Efficiency",
    desc: "Tracking behavioral interview notes and scores manually across many candidates and interviewers makes it hard to spot patterns, compare fairly, or maintain consistency as your hiring volume grows.",
    fix: "Use AI-powered platforms like GreatHire.in to structure behavioral question banks, standardize scorecards, and surface consistent evaluation insights across your hiring pipeline.",
  },
];

const caseStudy = {
  name: "Vantura Logistics",
  role: "80-person Chennai operations company",
  location: "High turnover in team-lead roles within first 6 months",
  stages: [
    {
      month: "Month 1",
      title: "Diagnosis",
      desc: "Reviewed exit interviews for team leads who left within 6 months. Found a pattern: strong technical interview performance, but repeated struggles with conflict resolution and cross-team collaboration once on the job — competencies barely touched on during hiring interviews.",
    },
    {
      month: "Month 2",
      title: "Process Rebuild",
      desc: "Built a dedicated behavioral interview round focused specifically on teamwork, conflict resolution, and decision-making under ambiguity, using the STAR framework and standardized follow-up prompts for vague answers.",
    },
    {
      month: "Month 3–6",
      title: "Results ✓",
      desc: "Team-lead turnover within the first 6 months dropped by 45%. Hiring managers reported significantly more confidence distinguishing genuinely strong collaborators from confident interviewees with weaker real-world track records.",
    },
  ],
  quote:
    "\"We were hiring people who were great at answering interview questions, not necessarily great at the actual behaviors the job required. The behavioral round closed that gap almost immediately.\"",
};

const practices = [
  "Ask behavioral questions ('Tell me about a time...') instead of hypothetical ones.",
  "Use the STAR framework to structure and evaluate every response consistently.",
  "Include at least one question about a failure or setback, not just successes.",
  "Follow up on vague, team-based answers to uncover individual contribution.",
  "Tailor 3–5 core competencies and questions specifically to each role's real demands.",
  "Use a shared, standardized question bank across every interviewer on a panel.",
];

const commonMistakes = [
  "Relying on hypothetical questions that invite rehearsed, idealized answers.",
  "Accepting vague team-based answers without probing for individual contribution.",
  "Letting confident storytelling substitute for genuine evidence of competence.",
  "Using identical generic questions regardless of the role's actual demands.",
  "Cramming too many questions into limited time, sacrificing depth for coverage.",
  "Letting different interviewers ask inconsistent, unstandardized questions.",
];

const faqs = [
  {
    q: "What is the STAR method in behavioral interviewing?",
    a: "STAR stands for Situation, Task, Action, Result — a framework for structuring and evaluating behavioral interview answers. A strong response describes the context (Situation), what needed to be accomplished (Task), what the candidate specifically did (Action), and the outcome that resulted (Result). It helps interviewers separate genuine individual contribution from vague, team-based storytelling.",
  },
  {
    q: "Why are behavioral questions considered more predictive than hypothetical ones?",
    a: "Behavioral questions ask candidates to describe something they actually did in the past, which is much harder to fabricate convincingly than describing an idealized hypothetical response. Past behavior in similar circumstances tends to be a stronger predictor of future behavior than a candidate's theoretical description of how they'd act.",
  },
  {
    q: "How many behavioral questions should be asked in a single interview?",
    a: "Typically 3–4 well-chosen questions work better than 8–10 rushed ones. A genuinely detailed behavioral answer, explored with follow-up questions, often takes 3–5 minutes to unpack properly — cramming too many questions into limited time sacrifices depth for surface-level coverage.",
  },
  {
    q: "How do you handle a candidate who gives a vague, team-focused answer?",
    a: "Follow up directly: 'What was your specific role in that?' or 'What did you personally decide or do?' This distinguishes candidates who made a genuine individual contribution from those describing a group outcome they were only loosely involved in.",
  },
  {
    q: "Should behavioral questions be the same for every role?",
    a: "The framework (STAR, structured follow-ups) stays consistent, but the specific competencies and questions should be tailored to each role's real demands. A customer-facing role might emphasize conflict resolution, while a highly autonomous technical role might emphasize decision-making under ambiguity.",
  },
  {
    q: "Can AI tools help with behavioral interviewing?",
    a: "Yes — AI-powered platforms can help structure behavioral question banks by competency, standardize scorecards across interviewers, and surface consistent evaluation patterns across many candidates. The final judgment on fit still relies on human evaluation, but structured tools make that evaluation far more consistent and comparable.",
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
          className={`text-teal-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${
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

export default function BehavioralInterviewTechniquesBlog() {
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
        <header className="bg-gradient-to-br from-teal-600 via-cyan-700 to-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-teal-200 text-xl sm:text-2xl font-light mb-6">
              ({blog.subtitle})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-teal-200 text-sm">
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
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                <strong className="text-teal-700">Behavioral interview techniques</strong> are designed
                to assess how candidates have handled real-world situations in the past, offering
                valuable insight into their future performance. By evaluating responses to structured
                questions around teamwork, conflict resolution, and decision-making, employers can
                identify candidates who are not only skilled but also a strong fit for the team.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                GreatHire.in provides AI-powered tools and expert insights to help streamline this
                process. This guide breaks down exactly how to build, run, and refine behavioral
                interviews that reveal genuine evidence of how a candidate will actually perform.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Behavioral Interviewing Outperforms Traditional Approaches
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Traditional interviews often ask candidates to describe their skills in the abstract or
              respond to hypothetical scenarios — both of which are easy to answer with a rehearsed,
              idealized response that may have little connection to how someone actually behaves under
              real pressure.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Behavioral interviewing flips this by asking for specific, real past experiences, which
              are far harder to fabricate convincingly and far more predictive of future behavior in
              similar situations. Mastering this technique is one of the highest-leverage skills a
              hiring team can develop.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Step-by-Step Guidance to Run Effective Behavioral Interviews
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A 4-step framework to prepare, run, and refine behavioral interviews.
            </p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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
              8 Most Common Behavioral Interview Mistakes (and How to Fix Them)
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
              Real Example: How Behavioral Interviews Cut Team-Lead Turnover by 45%
            </h2>
            <div className="bg-gradient-to-br from-teal-600 to-slate-900 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  V
                </div>
                <div>
                  <p className="font-bold">{caseStudy.name}</p>
                  <p className="text-teal-200 text-xs">
                    {caseStudy.role} — {caseStudy.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {caseStudy.stages.map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-teal-200 text-xs font-bold uppercase tracking-wider mb-1">
                      {m.month}
                    </p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-teal-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-teal-200 text-sm italic border-t border-white/20 pt-4">
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
                {commonMistakes.map((item, i) => (
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
              Behavioral interview techniques work because they replace guesswork with evidence — real
              stories about how a candidate has actually handled teamwork, conflict, and decision-making
              in the past. Structured well, with the STAR framework and consistent follow-up, they
              reveal far more about future performance than confidence or rehearsed answers ever could.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Ask about the past. Predict the future. Hire with real evidence.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-teal-600 to-slate-900 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Streamline Your Interview Process With AI-Powered Insights
            </h2>
            <p className="text-teal-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire.in helps recruiters structure behavioral interviews, standardize evaluation,
              and connect with candidates who are both skilled and a genuine fit for the team.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-teal-800 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-teal-50 transition-colors shadow-lg"
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