import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const blog = {
  title: "Cultural Fit Assessment",
  subtitle: "Evaluating Alignment Beyond the Resume — 2026",
  date: "Dec 16, 2025",
  readTime: "10 min read",
  category: "HR Insights",
  keywords: [
    "cultural fit assessment 2026",
    "team dynamics hiring",
    "employee engagement retention",
    "workplace values alignment",
    "hiring for culture add",
    "AI powered hiring tools",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — What Cultural Fit Actually Measures",
    desc: "A cultural fit assessment evaluates how well a candidate aligns with an organization's values, team dynamics, and workplace environment. Beyond technical qualifications, it examines communication styles, work ethics, and behavioral tendencies to determine whether a candidate's approach to collaboration and decision-making complements the company's long-term vision. Before building an assessment, define what your culture actually values — not vague words like 'passionate' or 'team player,' but specific, observable behaviors your best people demonstrate daily.",
  },
  {
    num: "02",
    title: "Build a Values-Based Evaluation Framework",
    desc: "Organizations that prioritize cultural alignment tend to see stronger employee engagement, higher retention, and greater overall performance. Translate your company's core values into 3–5 specific, observable behaviors each — for example, if 'ownership' is a value, define what that looks like in practice: does the person proactively flag problems, or wait to be told? Build interview questions and evaluation criteria directly from these definitions, rather than relying on a vague overall impression.",
  },
  {
    num: "03",
    title: "Apply Structured Techniques to Assess Communication and Work Style",
    desc: "Use behavioral and situational questions specifically focused on how candidates communicate under pressure, handle feedback, and make decisions collaboratively versus independently. Pay attention not just to what candidates say they value, but to how they describe past experiences — do they credit teams appropriately, take ownership of mistakes, and show self-awareness about their own working style?",
  },
  {
    num: "04",
    title: "Distinguish Genuine Fit From Bias, and Refine Continuously",
    desc: "The biggest risk in cultural fit assessment is conflating 'fits our culture' with 'is similar to us,' which produces homogeneous teams and screens out valuable diverse perspectives. Regularly review whether your cultural fit criteria are genuinely predicting engagement and retention, or simply reproducing the existing team's demographics and communication style. Refine your framework based on real outcomes, not comfort.",
  },
];

const mistakes = [
  {
    num: "01",
    title: "Confusing 'Culture Fit' With 'Similarity to Existing Team'",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "Bias Risk",
    desc: "Hiring people who think, communicate, and socialize like the existing team feels comfortable and safe, but it produces groupthink and blind spots rather than genuine cultural strength. True cultural fit is about shared values and work ethic, not shared backgrounds, personalities, or communication styles.",
    fix: "Replace 'would I get along with this person socially' with 'does this person demonstrate our core values in how they've actually worked' as the guiding evaluation question.",
  },
  {
    num: "02",
    title: "Using Vague, Unmeasurable Criteria",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Most Common",
    desc: "Evaluating candidates on vague traits like 'good vibes,' 'passionate,' or 'team player' gives interviewers no consistent basis for comparison and opens the door to unconscious bias filling in the gaps. Different interviewers will interpret these vague terms completely differently.",
    fix: "Translate every cultural value into 3–5 specific, observable behaviors before interviews begin, and evaluate candidates against those concrete behaviors.",
  },
  {
    num: "03",
    title: "Assessing Cultural Fit as an Afterthought",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Process Gap",
    desc: "Technical skills often get the bulk of interview time, while cultural and values alignment gets rushed into a final five-minute question. Given that values misalignment is a leading cause of early attrition, this imbalance means the process under-invests in exactly the area most likely to determine long-term retention.",
    fix: "Dedicate a full, structured interview segment specifically to cultural and values alignment — not just a closing question tacked onto a technical round.",
  },
  {
    num: "04",
    title: "Ignoring How Candidates Handle Feedback and Conflict",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Missed Signal",
    desc: "How a candidate has historically responded to critical feedback or disagreement reveals a great deal about their self-awareness, adaptability, and collaboration style — yet many interviews never touch on this, focusing instead on positive team experiences alone.",
    fix: "Include a specific question about receiving difficult feedback or navigating a disagreement, and evaluate the self-awareness and constructiveness in their answer.",
  },
  {
    num: "05",
    title: "Letting One Interviewer's Personal Preference Drive the Decision",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Groupthink",
    desc: "When a single hiring manager's personal comfort level with a candidate becomes the deciding factor on 'culture fit,' the assessment stops being about organizational values and becomes about one person's individual preferences and biases.",
    fix: "Involve multiple interviewers in the cultural assessment, each scoring independently against the same defined behaviors before group discussion.",
  },
  {
    num: "06",
    title: "Overlooking 'Culture Add' in Favor of 'Culture Fit'",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Missed Diversity",
    desc: "Screening exclusively for existing cultural patterns can systematically filter out candidates who bring valuable new perspectives, working styles, or problem-solving approaches the team currently lacks — even when those differences would genuinely strengthen the organization.",
    fix: "Explicitly ask during evaluation: what perspective or strength does this candidate bring that our current team doesn't already have?",
  },
  {
    num: "07",
    title: "Failing to Define Culture Explicitly Before Hiring",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Foundational Gap",
    desc: "If your organization can't clearly articulate its actual values and the specific behaviors that reflect them, cultural fit assessment becomes entirely subjective, inconsistent between interviewers, and vulnerable to unconscious bias filling the void.",
    fix: "Document your organization's core values explicitly, with concrete behavioral examples, before building any cultural fit interview questions.",
  },
  {
    num: "08",
    title: "Not Using Structured Tools to Support Consistent Evaluation",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    badgeLabel: "Missed Efficiency",
    desc: "Assessing cultural fit purely through informal conversation and interviewer memory makes it difficult to compare candidates fairly or track whether your cultural assessments actually predict engagement and retention over time.",
    fix: "Use AI-powered platforms like GreatHire.in to structure values-based question banks and standardize scoring across your entire hiring pipeline.",
  },
];

const caseStudy = {
  name: "Nimbus Creative Agency",
  role: "60-person Bengaluru design and marketing agency",
  location: "High attrition among new hires despite strong technical interviews",
  stages: [
    {
      month: "Month 1",
      title: "Diagnosis",
      desc: "Reviewed exit interviews from the past year. Found a consistent pattern: new hires with strong technical portfolios repeatedly cited 'the way the team works together' and 'communication style mismatch' as reasons for leaving within the first 4 months.",
    },
    {
      month: "Month 2",
      title: "Process Rebuild",
      desc: "Defined the agency's core values explicitly, translated each into observable behaviors, and built a dedicated 30-minute cultural fit interview segment with standardized questions on collaboration, feedback, and decision-making style.",
    },
    {
      month: "Month 3–6",
      title: "Results ✓",
      desc: "New hire attrition within the first 6 months dropped by 50%. Team leads reported significantly smoother onboarding, with new hires integrating into collaborative workflows noticeably faster than before.",
    },
  ],
  quote:
    "\"We were hiring great designers who just didn't work the way our teams work. Once we actually defined and tested for that explicitly, retention improved almost immediately.\"",
};

const practices = [
  "Translate abstract values into 3–5 specific, observable behaviors before interviewing.",
  "Dedicate a full, structured interview segment specifically to cultural alignment.",
  "Ask how candidates have handled feedback, conflict, and disagreement in the past.",
  "Involve multiple interviewers scoring independently against the same criteria.",
  "Actively look for valuable 'culture add' perspectives, not just similarity to the team.",
  "Document your organization's actual values explicitly before building interview questions.",
];

const commonMistakes = [
  "Equating cultural fit with personal similarity to the existing team.",
  "Using vague, unmeasurable criteria like 'good vibes' or 'passionate.'",
  "Treating cultural fit as a rushed afterthought instead of a structured evaluation.",
  "Ignoring how candidates handle feedback and conflict in past experiences.",
  "Letting one interviewer's personal preference drive the final decision alone.",
  "Screening out candidates who could bring valuable new perspectives to the team.",
];

const faqs = [
  {
    q: "What's the difference between 'culture fit' and 'culture add'?",
    a: "Culture fit traditionally asks whether a candidate matches the existing team's style and values, which can unintentionally produce homogeneous teams. Culture add asks a broader question: what valuable perspective, working style, or strength does this candidate bring that the team doesn't already have? Culture add tends to produce more diverse, resilient teams while still prioritizing shared core values.",
  },
  {
    q: "How do you measure something as subjective as cultural fit?",
    a: "By translating abstract values into specific, observable behaviors before interviewing — for example, defining what 'ownership' looks like in practice, and asking behavioral questions that reveal whether a candidate has demonstrated that behavior in the past. This turns a subjective judgment into a more consistent, evidence-based evaluation.",
  },
  {
    q: "Can cultural fit assessment introduce bias into hiring?",
    a: "Yes, if not done carefully. When 'fit' is judged on personal comfort or similarity rather than defined values and behaviors, it can systematically disadvantage candidates from different backgrounds or communication styles. Using clear, behavior-based criteria and multiple independent evaluators helps reduce this risk significantly.",
  },
  {
    q: "How much interview time should be dedicated to cultural fit?",
    a: "A dedicated segment of at least 20–30 minutes within your overall interview process is generally recommended, rather than a rushed closing question. Given that values misalignment is a leading driver of early attrition, this investment typically pays off in stronger long-term retention.",
  },
  {
    q: "Should cultural fit outweigh technical skill in a hiring decision?",
    a: "Neither should be treated as automatically more important — they answer different questions. Technical skill indicates whether someone can do the job; cultural alignment indicates whether they'll collaborate effectively and stay engaged long-term. A strong hiring process evaluates both deliberately rather than letting one dominate by default.",
  },
  {
    q: "How can AI tools support cultural fit assessment?",
    a: "AI-powered platforms can help structure values-based question banks, standardize scoring criteria across interviewers, and track how well cultural fit assessments actually correlate with engagement and retention over time — helping organizations refine their approach based on real outcomes rather than assumptions.",
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
          className={`text-violet-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${
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

export default function CulturalFitAssessmentBlog() {
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
        <header className="bg-gradient-to-br from-violet-600 via-purple-700 to-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-violet-200 text-xl sm:text-2xl font-light mb-6">
              ({blog.subtitle})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-violet-200 text-sm">
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
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                A <strong className="text-violet-700">cultural fit assessment</strong> evaluates how
                well a candidate aligns with an organization's values, team dynamics, and workplace
                environment. Beyond technical qualifications, it examines communication styles, work
                ethics, and behavioral tendencies to determine whether a candidate's approach to
                collaboration and decision-making complements the company's long-term vision.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Organizations that prioritize cultural alignment tend to see stronger employee
                engagement, higher retention, and greater overall performance. This guide breaks down
                exactly how to build a structured, bias-aware cultural fit assessment that genuinely
                predicts long-term success.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Cultural Alignment Matters as Much as Technical Skill
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A candidate can be technically excellent and still struggle to thrive if their working
              style, communication approach, or values clash with the team around them. Misalignment
              here is one of the most common drivers of early attrition — often surfacing not in
              performance reviews, but in a quiet, gradual disengagement that eventually leads to a
              resignation.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Done well, cultural fit assessment isn't about hiring people who are all alike — it's
              about hiring people who share genuine core values and can collaborate effectively, while
              still bringing diverse perspectives and strengths to the table.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Step-by-Step Guidance to Build a Cultural Fit Assessment
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A 4-step framework to define, evaluate, and refine cultural alignment.
            </p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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
              8 Most Common Cultural Fit Assessment Mistakes (and How to Fix Them)
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
              Real Example: How One Agency Cut New-Hire Attrition by 50%
            </h2>
            <div className="bg-gradient-to-br from-violet-600 to-slate-900 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  N
                </div>
                <div>
                  <p className="font-bold">{caseStudy.name}</p>
                  <p className="text-violet-200 text-xs">
                    {caseStudy.role} — {caseStudy.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {caseStudy.stages.map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-violet-200 text-xs font-bold uppercase tracking-wider mb-1">
                      {m.month}
                    </p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-violet-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-violet-200 text-sm italic border-t border-white/20 pt-4">
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
              Cultural fit assessment done well isn't about finding people who feel comfortably similar
              to the existing team — it's about clearly defining what your organization actually values,
              translating that into observable behaviors, and evaluating every candidate against those
              specific criteria. Done this way, it becomes one of the strongest predictors of engagement,
              retention, and long-term performance.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Define your values. Evaluate the behavior. Build a team that lasts.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-violet-600 to-slate-900 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Build Teams That Truly Fit Your Culture
            </h2>
            <p className="text-violet-200 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire.in helps recruiters structure values-based assessments and connect with
              candidates who align with their organization's culture and long-term vision.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-violet-800 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-violet-50 transition-colors shadow-lg"
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