import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Best Career Options After Graduation in India",
  subtitle: "Career Options After Graduation — 2026 Guide",
  date: "May 06, 2026",
  readTime: "12 min read",
  category: "Career Planning",
  keywords: [
    "career options after graduation India",
    "best careers after graduation 2026",
    "what to do after graduation India",
    "career paths for graduates India",
    "jobs after B.Tech BCA B.Com India",
    "graduate career guide India 2026",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "Before choosing a career path, invest 1–2 weeks in genuine self-assessment and market research. Most graduates make the mistake of following peer pressure — 'everyone is doing an MBA' or 'my parents want me in government jobs' — without understanding what each path actually involves day-to-day. Start by listing your strengths, interests, and non-negotiables (location, work style, income timeline). Then research the top 3 paths you're considering: what do professionals in those fields actually do, what do entry-level salaries look like, what's the growth trajectory, and what skills do companies genuinely look for? LinkedIn, Naukri, and Glassdoor are free research tools. Informational interviews with professionals in those fields are even more valuable. Know what you're choosing — and why — before you commit.",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge for Your Chosen Path",
    desc: "Once you've identified your target career path, build the foundational skills that path requires — before you start applying. For IT and tech roles: learn one programming language deeply, build 2–3 real projects, and get comfortable with tools like Git, SQL, or cloud basics. For data and analytics: master SQL and Excel first, then add Python and visualization tools. For management and business roles: build communication, Excel, and business writing skills; consider free business courses on Coursera or NPTEL. For government exams: create a structured study plan with daily targets and mock tests. For entrepreneurship: launch something small first — a freelance project, a micro-product, anything that creates real market feedback. Depth in 2–3 relevant skills consistently outperforms breadth across many. Focus your learning time on what your target role actually requires.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "Your strategy depends heavily on which path you choose — but a few principles apply universally. Build a strong profile before you start applying: clean resume, updated LinkedIn, complete portal profiles on GreatHire, Naukri, or Internshala. For job seekers: apply within 24–48 hours of new listings, use job alerts, and target 20–30 well-matched roles per week minimum. For exam aspirants: register for upcoming exams early, use platforms like Unacademy, Testbook, or BYJU's Exam Prep for structured preparation. For MBA aspirants: start CAT/GMAT prep 12–18 months ahead, build extracurriculars and work experience simultaneously. For freelancers and entrepreneurs: start on Upwork, Fiverr, or LinkedIn before building your own client base. For each path, identify the 3–4 platforms or resources that matter most — and focus there instead of spreading yourself thin.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Whichever path you choose, build a measurement system from day one. Job seekers: track applications sent, response rate, interview conversion rate, and weekly improvement areas. Exam aspirants: track mock test scores, weak subjects by chapter, and daily study hours versus targets. Skill builders: track projects completed, hours practiced, and portfolio items added each month. Review every 2–4 weeks: Are you moving forward? Where are you stuck? What needs to change? The graduates who navigate post-graduation confusion fastest are those who treat their career development like a project — with clear milestones, honest self-assessment, and a willingness to course-correct early. Don't wait 6 months to realize your current approach isn't working. Measure weekly, adjust monthly.",
  },
];

const careers = [
  {
    num: "01",
    title: "IT & Software Development",
    category: "Technology",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Highest Demand",
    ctc: "₹3.5–8 LPA (entry)",
    desc: "India's largest employer of graduates in 2026. Software developers, QA engineers, cloud support, DevOps trainees, and data engineers are all actively hiring freshers. Strong demand in Bangalore, Hyderabad, Pune, Chennai, and increasingly in Tier-2 cities. Best suited for: B.Tech, BCA, B.Sc CS graduates — and increasingly open to other streams with demonstrable skills.",
    paths: ["Junior Software Developer", "QA / Software Tester", "Cloud Support Associate", "DevOps Trainee"],
  },
  {
    num: "02",
    title: "Data Analytics & Business Intelligence",
    category: "Data & Analytics",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Fastest Growing",
    ctc: "₹3–6 LPA (entry)",
    desc: "One of the fastest-growing career options after graduation in India in 2026. Companies across fintech, e-commerce, consulting, and healthcare are hiring data analysts at the entry level. The barrier is lower than most think: SQL + Excel + Python basics + one visualization tool (Power BI or Tableau) is often enough to land a first role.",
    paths: ["Junior Data Analyst", "Business Intelligence Analyst", "Operations Analyst", "Data Associate"],
  },
  {
    num: "03",
    title: "Banking, Financial Services & Insurance (BFSI)",
    category: "Finance",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Stable & Scalable",
    ctc: "₹2.5–5 LPA (entry)",
    desc: "One of India's largest employers across private banks, NBFCs, insurance firms, and fintech companies. Roles range from relationship management and operations to credit analysis and financial advisory. Open to B.Com, BBA, BA Economics, and MBA graduates. Strong growth trajectory with structured appraisals and internal mobility.",
    paths: ["Bank PO (via IBPS/SBI exam)", "Financial Analyst Trainee", "Insurance Advisor", "Credit Analyst"],
  },
  {
    num: "04",
    title: "Government Jobs & Public Sector",
    category: "Government",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    badgeLabel: "High Security",
    ctc: "₹3–7 LPA + benefits",
    desc: "Government careers remain one of the most sought-after options after graduation in India — for good reason. Job security, structured pay scales, pension benefits, and social status make them attractive. Competitive exams include UPSC, SSC CGL, IBPS, State PSCs, and Railway boards. Requires disciplined long-term preparation but offers unmatched stability.",
    paths: ["IAS / IPS (via UPSC)", "SSC CGL (Central Government)", "IBPS PO / Clerk (Banking)", "State PSC roles"],
  },
  {
    num: "05",
    title: "MBA & Higher Education",
    category: "Education",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "High ROI (if strategic)",
    ctc: "₹6–20 LPA post-MBA",
    desc: "An MBA from a top-tier institution (IIMs, XLRI, ISB) dramatically accelerates career growth and opens doors to management consulting, investment banking, and senior corporate roles. However, an MBA from an average college with average performance has limited ROI. Be strategic: only pursue an MBA if you have a clear goal for what it unlocks.",
    paths: ["MBA from IIM / XLRI / ISB", "MBA from reputed state colleges", "Specialized Masters (Finance, Analytics)", "Online MBA (NMIMS, BITS)"],
  },
  {
    num: "06",
    title: "Digital Marketing & Content",
    category: "Marketing",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Portfolio-Driven",
    ctc: "₹2.5–5 LPA (entry)",
    desc: "Every company in India needs digital presence — and they're hiring freshers to build and run it. SEO, social media management, content writing, email marketing, and paid ads are all entry-level roles. The barrier to entry is low: build a small personal project (a blog, a social media page) and you already have a portfolio. High creativity required; high demand in startups and agencies.",
    paths: ["SEO Analyst", "Social Media Manager", "Content Writer / Strategist", "Performance Marketing Associate"],
  },
  {
    num: "07",
    title: "Entrepreneurship & Freelancing",
    category: "Independent",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "High Risk, High Reward",
    ctc: "Variable — ₹0 to unlimited",
    desc: "India's startup ecosystem and gig economy have made entrepreneurship and freelancing legitimate post-graduation paths. Freelancing (on Upwork, Fiverr, Toptal) in web development, design, writing, or data work can generate ₹30,000–₹1 lakh/month within 12–18 months with skill and consistency. Starting a business requires deeper capital, timing, and market insight — but the ceiling is unlimited.",
    paths: ["Freelance Developer / Designer", "Independent Consultant", "D2C / E-commerce Founder", "Content Creator / YouTuber"],
  },
  {
    num: "08",
    title: "Teaching, EdTech & Research",
    category: "Education",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Purpose-Driven",
    ctc: "₹2.5–5 LPA (entry)",
    desc: "India's EdTech sector boomed and has stabilized into a sustainable employer of subject matter experts, curriculum designers, and online tutors. Teaching roles in K-12 and competitive exam coaching remain steady. Research roles via M.Tech, M.Sc, or direct PhD programs are ideal for graduates passionate about their subject. Good communication skills are the primary asset here.",
    paths: ["Online Tutor (Unacademy, Vedantu, Byju's)", "School / College Teacher", "Curriculum Designer", "Research Associate (via Masters)"],
  },
];

const practices = [
  "Choose depth over breadth — build one career path well before exploring a second simultaneously.",
  "Research what professionals in your target field actually do day-to-day before committing to it.",
  "Use LinkedIn, Naukri, and GreatHire to understand what skills companies are currently hiring for — not just what textbooks say.",
  "Start building skills or preparing for exams within 30 days of graduation — every month of delay costs compounding momentum.",
  "Track your progress monthly: applications sent, skills acquired, exam scores, interviews cleared.",
  "Talk to at least 3 people already working in your target career before finalizing your direction.",
];

const mistakes = [
  "Choosing a career based on peer pressure or family expectation without researching personal fit.",
  "Delaying the decision for months while waiting for 'clarity' — clarity comes from action, not waiting.",
  "Spreading effort across too many paths simultaneously — preparing for government exams and a startup while job hunting produces mediocre results in all three.",
  "Underestimating the timeline — most careers take 6–18 months to break into properly after graduation.",
  "Ignoring soft skills — communication, professional email writing, and presentation matter in every career.",
  "Not building a portfolio or proof of ability before applying — employers need evidence, not just claims.",
];

const faqs = [
  {
    q: "What is the best career option after graduation in India in 2026?",
    a: "There is no single best career — it depends on your degree, strengths, financial goals, and risk tolerance. IT and software development offer the highest fresher demand and strong salary growth. Data analytics is the fastest-growing entry-level field. Government jobs offer the most stability. MBA from top colleges offers the highest long-term salary ceiling. Identify which combination of factors matters most to you, then choose accordingly.",
  },
  {
    q: "Can a non-CS graduate get into IT jobs in India?",
    a: "Absolutely. Many IT companies — especially in QA, technical support, business analysis, and data roles — hire from ECE, B.Com, BBA, and even non-technical backgrounds. What matters is demonstrated skill: a strong portfolio project, a relevant certification, and clear communication of your ability to do the job.",
  },
  {
    q: "Is an MBA necessary after graduation in 2026?",
    a: "Not necessary — but strategically powerful for the right person. An MBA from a top-tier institution (IIMs, XLRI, ISB) provides a significant salary and role jump. An MBA from an average institution with no clear post-MBA plan has limited ROI. If you're considering an MBA, first define exactly what career outcome you want it to unlock — then decide if an MBA is the fastest path to that outcome.",
  },
  {
    q: "How long does it take to get a first job after graduation in India?",
    a: "With focused preparation and consistent applications, most graduates land their first role within 3–6 months of graduation. Graduates who start preparing before their final semester — building skills, updating profiles, and applying — often land offers within the first 4–8 weeks post-graduation.",
  },
  {
    q: "Is government job preparation still worth it in 2026?",
    a: "Yes — for candidates who value job security, work-life balance, and structured benefits over high private sector salaries. However, government exam preparation requires 1–3 years of dedicated study for top roles like UPSC. If you're preparing for government exams, commit fully with a structured plan — half-hearted preparation rarely clears competitive cutoffs.",
  },
  {
    q: "What career options are available after graduation without technical skills?",
    a: "Many. Digital marketing, content writing, HR, business development, sales, banking (via IBPS), operations management, EdTech teaching, and freelancing in communication or creative fields are all accessible without a technical degree. The common thread: you need demonstrable skills in your chosen area — whether that's a writing portfolio, a marketing case study, or a strong IBPS score.",
  },
  {
    q: "How do I choose between a job and further education after graduation?",
    a: "Ask yourself: does further education (MBA, Masters, PhD) unlock a specific career outcome I can't reach otherwise? If yes, and if you can access a reputed institution, pursue it. If further education is primarily a way to delay the job search or follow peer pressure, that's a costly signal to ignore. Many strong careers are built faster through direct work experience than through additional degrees.",
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
          className={`text-rose-500 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${
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

export default function CareerOptionsAfterGraduationBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-rose-200 text-xl sm:text-2xl font-light mb-6">
              ({blog.subtitle})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-rose-200 text-sm">
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
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Graduation is one of the most disorienting transitions in a young professional's life.
                One day you have a structured semester plan — the next, you're staring at an open-ended
                question:{" "}
                <strong className="text-rose-600">
                  what are the best career options after graduation in India?
                </strong>{" "}
                The options feel endless and the pressure feels immense.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide cuts through the noise. It maps the top 8 career paths available to Indian
                graduates in 2026 — what each involves, who it suits, realistic salary expectations, and
                a step-by-step framework to choose, prepare for, and land in the right one — without
                spending months paralyzed by indecision.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Post-Graduation Career Decisions Feel Harder in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              India produces over 9 million graduates annually. The options available to them have
              never been more diverse — IT, data, finance, government, entrepreneurship, digital
              marketing, EdTech, and more. But more options without a framework for choosing creates
              paralysis, not opportunity. Most graduates spend 3–6 months after finishing their degree
              in a fog of indecision — comparing options, deferring choices, and losing critical momentum.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The graduates who navigate this period fastest share one trait: they make a focused,
              informed decision early — even if imperfect — and start moving. Clarity comes from action.
              This guide gives you the map to act on.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Step-by-Step Guidance to Choosing and Launching Your Career After Graduation
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A 4-step framework to go from confusion to clear career momentum.
            </p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
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

          {/* ── CAREER CARDS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Top 8 Career Options After Graduation in India (2026)
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              Realistic paths with salary ranges, role examples, and who each suits best.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {careers.map((career) => (
                <div
                  key={career.num}
                  className={`border rounded-2xl p-5 sm:p-6 ${career.color} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{career.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${career.badge}`}>
                      {career.badgeLabel}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                    {career.category}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{career.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-3">💰 {career.ctc}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{career.desc}</p>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Example Roles
                    </p>
                    <ul className="space-y-1">
                      {career.paths.map((path, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                          {path}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Real Example: From Post-Graduation Confusion to Hired in 90 Days
            </h2>
            <div className="bg-gradient-to-br from-rose-600 to-pink-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  S
                </div>
                <div>
                  <p className="font-bold">Sneha</p>
                  <p className="text-rose-200 text-xs">
                    B.Com Graduate — 3 Months of Post-Grad Confusion, No Direction
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Month 1",
                    title: "Decision Made",
                    desc: "Stopped comparing IT vs MBA vs banking. Researched all three properly. Chose data analytics — matched her Excel strength, open to B.Com graduates, faster ROI than MBA. Committed fully.",
                  },
                  {
                    month: "Month 2",
                    title: "Skills + Portfolio",
                    desc: "Completed SQL + Python basics on freeCodeCamp. Built two analytics projects: e-commerce sales dashboard and HR attrition analysis. Uploaded to GitHub. Updated LinkedIn and GreatHire profiles.",
                  },
                  {
                    month: "Month 3",
                    title: "Hired ✓",
                    desc: "Applied to 25 targeted data analyst roles. Got 4 interview calls. Converted 2 offers. Joined a Pune fintech firm as Junior Data Analyst at ₹3.8 LPA. 90 days from confusion to offer.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
                      {m.month}
                    </p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-rose-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-rose-100 text-sm italic border-t border-white/20 pt-4">
                "The decision itself took 2 weeks. Everything after — skills, portfolio, applications — took 10 weeks. Choosing one path and going all in made all the difference."
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
                {mistakes.map((item, i) => (
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
              Post-graduation in India in 2026 offers more opportunity than any previous generation —
              and more confusion too. The graduates who thrive are the ones who pick a direction early,
              commit to it fully, build the skills it requires, and apply consistently until they break
              through. Whether your path is IT, data, finance, government, an MBA, or entrepreneurship,
              the framework is the same: decide, prepare, apply, measure, improve.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Stop waiting for perfect clarity. Make your best decision with the information you have —
              and start moving today.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Ready to Start Your Career After Graduation?
            </h2>
            <p className="text-rose-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Explore thousands of fresher and graduate-friendly roles across IT, data, finance,
              marketing, and more — companies actively hiring right now across India.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-rose-600 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-rose-50 transition-colors shadow-lg"
            >
              Explore Graduate Jobs on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}