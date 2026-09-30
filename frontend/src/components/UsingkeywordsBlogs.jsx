import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Using Keywords",
  subtitle: "Strategic Keyword Placement for a Stronger Resume",
  date: "Dec 17, 2025",
  readTime: "10 min read",
  category: "Resume Tips",
  keywords: [
    "resume keywords 2026",
    "industry specific keywords resume",
    "keyword matching ATS",
    "job description keywords",
    "resume optimization strategy",
    "get shortlisted faster",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — Why Keywords Decide Who Gets Seen",
    desc: "Strategically incorporating industry-specific keywords into your resume can significantly improve its visibility to Applicant Tracking Systems. Recruiters and software alike are scanning for specific signals that prove you fit the role — and those signals are almost always expressed as keywords: tool names, certifications, job titles, and core skills. A resume without the right keywords can be technically accurate about your experience and still get overlooked entirely.",
  },
  {
    num: "02",
    title: "Build a Keyword List From the Job Description Itself",
    desc: "By carefully reviewing job descriptions, you can identify the skills, phrases, and qualifications that employers prioritize. Read the posting line by line and highlight every skill, tool, certification, and responsibility mentioned. Pay special attention to terms that repeat more than once — repetition usually signals what the employer values most. This list becomes your keyword target for that specific application.",
  },
  {
    num: "03",
    title: "Apply Keywords Naturally Throughout Your Resume",
    desc: "Naturally weaving these keywords throughout your resume improves ATS matching accuracy and increases the likelihood of your profile being shortlisted. Place your strongest keywords in high-visibility areas: your summary, your skills section, and the first line of relevant experience bullets. Avoid keyword-stuffing — repeating a term unnaturally many times can look suspicious to both software and human reviewers. Every keyword should sit inside a real sentence describing something you actually did.",
  },
  {
    num: "04",
    title: "Review, Refine, and Reapply for Every New Role",
    desc: "Keyword strategy isn't a one-time task — it should be repeated for every application, since different job postings prioritize different terms even within the same industry. After tailoring your resume, do a final check: does your resume include the top 8–10 keywords from this specific posting? If not, revisit your summary or skills section before submitting.",
  },
];

const strategies = [
  {
    num: "01",
    category: "Keyword Discovery",
    title: "Extract Keywords Directly From the Job Posting",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    type: "Research",
    desc: "The job description itself is your best keyword source. Highlight every skill, qualification, tool, and responsibility mentioned. Group them into categories: hard skills (technical tools, certifications), soft skills (communication, leadership), and role-specific terms (job titles, industry jargon). This becomes your target list for that application.",
  },
  {
    num: "02",
    category: "Placement Strategy",
    title: "Prioritize High-Visibility Sections",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    type: "Placement",
    desc: "Not all parts of your resume carry equal weight. Your professional summary and skills section are typically scanned first and weighted most heavily by both recruiters and ATS software. Place your 3–5 most important keywords in these sections, then reinforce them within your experience bullets where they naturally fit.",
  },
  {
    num: "03",
    category: "Natural Integration",
    title: "Weave Keywords Into Real Achievements",
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    type: "Writing",
    desc: "A keyword sitting alone in a list is far less convincing than the same keyword embedded in a specific, measurable achievement. Instead of just listing 'Project Management' as a skill, write: 'Led project management for a 6-month product launch, coordinating 5 cross-functional teams.' This satisfies both ATS matching and human readability.",
  },
  {
    num: "04",
    category: "Abbreviation Handling",
    title: "Include Both Full Terms and Common Abbreviations",
    color: "bg-lime-50 border-lime-200",
    badge: "bg-lime-100 text-lime-700",
    type: "Keywords",
    desc: "Some ATS systems search for the exact abbreviation used in the job posting, while others search for the full term. Cover both by including each once where natural — for example, 'Search Engine Optimization (SEO)' or 'Customer Relationship Management (CRM) software.'",
  },
  {
    num: "05",
    category: "Avoiding Overuse",
    title: "Don't Fall Into Keyword Stuffing",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    type: "Quality Check",
    desc: "Repeating the same keyword unnaturally many times in an attempt to game the system can backfire — some ATS systems flag this as manipulation, and human recruiters will notice immediately. Each keyword should appear a reasonable number of times, always inside a natural, meaningful sentence.",
  },
  {
    num: "06",
    category: "Role-Specific Language",
    title: "Match Job Titles to Industry-Standard Terms",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    type: "Alignment",
    desc: "If your actual title differs from the standard industry term for that role, include both. For example, if you held the internal title 'Growth Associate' but the role is generally known as 'Marketing Coordinator,' write 'Growth Associate (Marketing Coordinator)' so both keyword variants are captured.",
  },
  {
    num: "07",
    category: "Ongoing Refinement",
    title: "Track Which Keyword Sets Get the Best Response",
    color: "bg-cyan-50 border-cyan-200",
    badge: "bg-cyan-100 text-cyan-700",
    type: "Iteration",
    desc: "Keep a simple log of which resume versions (and which keyword emphasis) you used for which applications, and note which ones led to callbacks. Over time, this reveals which specific phrasing and keyword combinations resonate most in your target industry.",
  },
  {
    num: "08",
    category: "Per-Application Tailoring",
    title: "Rebuild Your Keyword List for Every New Role",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    type: "Strategy",
    desc: "Even within the same industry, different companies and different postings prioritize different terms. Resist the urge to reuse one 'master' keyword list across all applications — a few minutes rebuilding your target list for each posting consistently produces stronger keyword matches.",
  },
];

const faqs = [
  {
    q: "Where should I find the right keywords for my resume?",
    a: "The single best source is the job description itself. Read it carefully and note every skill, tool, certification, and responsibility mentioned — especially terms that appear more than once, since repetition usually signals priority. Industry-specific job boards and LinkedIn job postings for similar roles are also useful secondary sources.",
  },
  {
    q: "How many keywords should I include in my resume?",
    a: "There's no fixed number, but a good target is 8–15 relevant keywords naturally spread across your summary, skills section, and experience bullets, matched closely to a specific job posting. The goal is accurate representation of your real skills, not maximizing a raw keyword count.",
  },
  {
    q: "Is it okay to add a keyword even if I only have basic experience with it?",
    a: "Only include keywords that honestly reflect your actual skill level. Misrepresenting your proficiency can backfire seriously during interviews or on the job itself. If you have basic familiarity, it's fine to mention it accurately — just don't imply expert-level experience you don't have.",
  },
  {
    q: "Should I use the exact same keywords for every job application?",
    a: "No. Even similar roles at different companies often emphasize different terms. Rebuilding your keyword list for each specific posting — even if it only takes a few minutes — consistently produces a stronger match than reusing one generic list everywhere.",
  },
  {
    q: "Can too many keywords hurt my resume?",
    a: "Yes. Unnatural repetition or forcing in irrelevant keywords just to increase your count — commonly called 'keyword stuffing' — can look suspicious to ATS systems and immediately turns off human recruiters reading your resume. Every keyword should sit naturally inside a real, meaningful sentence.",
  },
  {
    q: "Do keywords matter more in the summary or the experience section?",
    a: "Both matter, but your professional summary and skills section are typically weighted most heavily and reviewed first by recruiters and ATS software alike. That said, keywords embedded within specific, measurable achievements in your experience section carry additional credibility since they're tied to real outcomes.",
  },
];

const practices = [
  "Extract your keyword list directly from each specific job description.",
  "Place your strongest keywords in your summary and skills section first.",
  "Weave keywords into real, measurable achievements rather than bare lists.",
  "Include both full terms and common abbreviations where relevant.",
  "Rebuild your keyword strategy for every new application, not just once.",
  "Track which keyword choices lead to the most recruiter callbacks over time.",
];

const mistakes = [
  "Reusing one generic keyword list across every job application.",
  "Repeating the same keyword excessively in an attempt to game the system.",
  "Listing skills as bare keywords with no supporting context or achievement.",
  "Ignoring repeated terms in the job posting that signal top employer priorities.",
  "Claiming keyword-level expertise in skills you don't actually have.",
  "Only including full terms or only abbreviations, missing the other variant.",
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
        <span className={`text-amber-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function UsingKeywordsBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-amber-500 via-orange-600 to-yellow-700 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-amber-100 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-amber-100 text-sm">
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
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Strategically incorporating <strong className="text-amber-700">industry-specific keywords</strong> into
                your resume can significantly improve its visibility to Applicant Tracking Systems. By
                carefully reviewing job descriptions, you can identify the skills, phrases, and
                qualifications that employers prioritize.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Naturally weaving these keywords throughout your resume improves ATS matching accuracy
                and increases the likelihood of your profile being shortlisted. This guide breaks down
                exactly how to find, place, and refine keywords so your resume speaks the same language
                as both recruiters and the software screening them.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Why Keyword Strategy Is a Core Resume Skill in 2026</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Recruiters and ATS software both rely heavily on pattern matching to quickly assess
              whether a candidate fits a role. Keywords are the shorthand that makes this matching
              possible — a resume that uses the same language as the job posting is instantly easier
              to evaluate, both by machines scanning for terms and by humans scanning for relevance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Two candidates with nearly identical experience can have very different outcomes based
              purely on how well their resume mirrors the specific language of a job posting. Learning
              to identify and naturally apply the right keywords is one of the highest-leverage skills
              in a modern job search.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guide to Using Keywords Effectively</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to find, apply, and refine your resume's keyword strategy.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Proven Keyword Strategies for a Stronger Resume</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">From keyword discovery to natural placement — the complete keyword playbook.</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: How Better Keyword Placement Tripled Interview Requests</h2>
            <div className="bg-gradient-to-br from-amber-500 to-orange-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">P</div>
                <div>
                  <p className="font-bold">Priya Nair</p>
                  <p className="text-amber-100 text-xs">4 Years Experience, HR Coordinator — Pune</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    period: "Before Optimization",
                    status: "2 interview requests in 6 weeks",
                    breakdown: "Skills listed as a bare list with no context → generic terms not matching specific job postings → same resume sent to every role",
                  },
                  {
                    period: "After Optimization",
                    status: "6 interview requests in 3 weeks",
                    breakdown: "Keywords extracted from each posting → embedded inside real achievement bullets → summary rewritten to mirror each role's top priorities",
                  },
                ].map((item) => (
                  <div key={item.period} className="bg-white/15 rounded-xl p-4">
                    <p className="text-amber-100 text-xs font-bold uppercase tracking-wider mb-2">{item.period}</p>
                    <p className="font-bold mb-2">{item.status}</p>
                    <p className="text-amber-50 text-sm leading-relaxed">{item.breakdown}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-amber-50 text-sm leading-relaxed">
                  <strong className="text-white">What changed?</strong> Built a fresh keyword list from every new job posting instead of reusing one resume everywhere, moved key terms into her summary and skills section, and rewrote experience bullets so keywords appeared inside real, measurable achievements.
                </p>
              </div>
              <p className="text-amber-50 text-sm italic border-t border-white/20 pt-4">
                "I had the same experience the whole time — I was just describing it in my own words instead of the words recruiters were actually searching for."
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
              Using keywords effectively isn't about tricking a system — it's about speaking the same
              language as the people and software evaluating your resume. When you extract the right
              terms from each job posting and weave them naturally into real achievements, you make it
              far easier for recruiters to see exactly why you're a fit.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              A few extra minutes spent tailoring your keywords for each application consistently pays
              off in higher shortlist rates. Treat it as a core part of your job search process, not an
              optional extra step.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Speak the employer's language. Get shortlisted faster.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-amber-500 to-orange-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Build a Resume That Speaks the Right Language</h2>
            <p className="text-amber-50 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire.in helps you identify the right keywords for your target roles and connects
              your optimized profile with recruiters actively hiring in your field.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-amber-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-amber-50 transition-colors shadow-lg"
            >
              Optimize Your Resume on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}