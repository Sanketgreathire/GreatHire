import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "IT vs Non-IT Jobs for Freshers",
  subtitle: "Complete Career Path Comparison",
  date: "May 06, 2026",
  readTime: "11 min read",
  category: "Career Guide",
  keywords: [
    "IT vs non IT jobs",
    "IT jobs for freshers",
    "non IT career options",
    "IT career path",
    "career choice freshers",
    "best career path India",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "Research both IT and non-IT roles in your field of interest. Study job descriptions, salary ranges, skill requirements, and career progression. Talk to professionals already working in both sectors — ask about daily work, growth opportunities, work-life balance, and challenges. Understand what 'IT' truly means: it's not just software development, it includes data, cloud, cybersecurity, and more. Similarly, non-IT encompasses diverse roles from finance to operations to HR.",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge",
    desc: "For IT: Focus on programming, databases, cloud platforms, or data tools depending on your target role. Practice coding daily. For Non-IT: Develop domain knowledge (finance, operations, business analysis), soft skills (communication, negotiation), and tools relevant to the sector. Both require building practical, demonstrable skills — not just coursework. Build projects or portfolios that showcase your chosen path.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "For IT: Leverage platforms like GitHub, LeetCode, Kaggle, and HackerRank. Create a strong coding portfolio. Apply to tech companies, IT services firms, and product startups. For Non-IT: Build on LinkedIn, showcase business acumen through case studies or analyses, apply to corporate companies, consulting firms, banks, and government organizations. Use the right job boards and networks for each sector.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Maintain a career tracker regardless of your choice. Note which interviews you get, which sectors respond to your profile, and where your skills are strongest. Seek feedback from mentors in your chosen path. After 6 months, honestly evaluate: Is this the right fit? Are you growing? Do you enjoy the work? Be willing to pivot if needed — some freshers start IT and switch to non-IT (or vice versa) within a year.",
  },
];

const comparison = [
  {
    num: "01",
    category: "Nature of Work",
    itTitle: "IT Jobs",
    itDesc: "Build software, apps, systems. Work with code, databases, cloud platforms. Problem-solving through technology. Fast-paced innovation. Remote-friendly.",
    nonItTitle: "Non-IT Jobs",
    nonItDesc: "Support business functions: finance, HR, operations, marketing. Work with data, people, processes. Problem-solving through business acumen. Structured environments. Often requires office presence.",
  },
  {
    num: "02",
    category: "Skill Requirements",
    itTitle: "IT Jobs",
    itDesc: "Strong technical foundation: coding, databases, systems design. Logical thinking and problem-solving. Continuous learning (tech changes fast). Some soft skills.",
    nonItTitle: "Non-IT Jobs",
    nonItDesc: "Domain knowledge: finance, HR policies, supply chain, etc. Strong communication and interpersonal skills. Business acumen. Leadership potential valued early.",
  },
  {
    num: "03",
    category: "Starting Salary (2026, India)",
    itTitle: "IT Jobs",
    itDesc: "₹3–6.5 LPA for entry-level roles. Fastest salary growth post-MBA or specialization. Reaches ₹15–30+ LPA by mid-career. Bonus potential high.",
    nonItTitle: "Non-IT Jobs",
    nonItDesc: "₹2.5–5 LPA for entry-level roles. Slower initial salary growth. Reaches ₹10–20+ LPA by mid-career. Performance bonus variable by sector.",
  },
  {
    num: "04",
    category: "Career Growth",
    itTitle: "IT Jobs",
    itDesc: "Clear progression: Developer → Senior Dev → Tech Lead → Manager → Director. Specialization paths: AI/ML, Cloud, Security. Global mobility strong. Entrepreneurship easier.",
    nonItTitle: "Non-IT Jobs",
    itDesc: "Progression: Associate → Officer → Senior Officer → Manager → Director. Slower advancement. Requires higher education (MBA) for top roles. Regional variations.",
  },
  {
    num: "05",
    category: "Work-Life Balance",
    itTitle: "IT Jobs",
    itDesc: "Startups: high pressure, long hours initially. IT Services: structured, better balance post-probation. Product companies: demanding but often remote-friendly. Burnout risk exists.",
    nonItTitle: "Non-IT Jobs",
    nonItDesc: "Finance/Banking: high-pressure, demanding hours, especially early career. HR/Operations: more balanced. Corporate culture varies. Better predictability.",
  },
  {
    num: "06",
    category: "Skill Learning Pace",
    itTitle: "IT Jobs",
    itDesc: "Steep learning curve early. New tools, languages, frameworks constantly. Must stay updated. Community learning through open-source. Faster skill obsolescence.",
    nonItTitle: "Non-IT Jobs",
    nonItDesc: "Moderate learning curve. Core skills stay relevant longer. Policies, regulations change but basics remain. Industry-specific knowledge grows over years.",
  },
  {
    num: "07",
    category: "Opportunities for Non-CS Graduates",
    itTitle: "IT Jobs",
    itDesc: "Non-CS backgrounds struggle initially. Some roles (QA, Business Analyst) more accessible. Bootcamps help bridge gap. IT services firms more open to non-tech backgrounds.",
    nonItTitle: "Non-IT Jobs",
    nonItDesc: "Commerce, Science, Arts graduates actively hired. Any graduate can enter. Domain expertise can be learned on the job. More inclusive hiring.",
  },
  {
    num: "08",
    category: "Remote Work & Flexibility",
    itTitle: "IT Jobs",
    itDesc: "Post-2024, remote work normalized. Most IT roles fully remote or hybrid. Global job market accessible. Location independence possible.",
    nonItTitle: "Non-IT Jobs",
    nonItDesc: "Finance/Banking: returning to offices. HR: increasingly hybrid. Operations: mostly on-site. Geographic limitations exist.",
  },
];

const faqs = [
  {
    q: "Should I choose IT just because salaries are higher?",
    a: "No. Salary shouldn't be the only factor. IT salaries are higher but learning curve is steep. If you're not interested in coding or technology, you'll burn out within 2 years. Choose IT for genuine interest in tech problem-solving, not just money. Non-IT can offer equal career satisfaction if aligned with your strengths.",
  },
  {
    q: "Can I switch from IT to Non-IT or vice versa after starting my career?",
    a: "Yes, but harder. Switching IT → Non-IT is easier if you develop soft skills and business sense early. Switching Non-IT → IT after 2+ years is challenging due to technical skill gap. Best approach: Start in your best fit. Build hybrid skills (IT professional with business acumen or non-IT professional with tech basics).",
  },
  {
    q: "Which path is safer in terms of job security?",
    a: "IT has more global opportunities but faces automation risk and market volatility. Non-IT sectors (finance, HR, operations) offer more stability but slower growth. Honestly? Neither is 'safe' in 2026. Job security comes from continuous learning and adaptability, not sector choice.",
  },
  {
    q: "I'm a non-CS graduate. Should I do IT or Non-IT?",
    a: "If you have coding interest and time to learn, IT is doable with bootcamps. If you're pragmatic about time-to-job, non-IT is faster. Commerce graduates often thrive in finance/banking/business analyst roles. Science graduates bridge both. Don't force IT just because it's trendy.",
  },
  {
    q: "How much time does it take to become job-ready in each sector?",
    a: "IT: 3–6 months of focused learning minimum (with prior CS knowledge); 6–12 months for non-CS backgrounds. Non-IT: 2–3 months to understand basics and land entry-level roles. However, deeper expertise takes 1–2 years in both.",
  },
  {
    q: "Which sector has better work-life balance?",
    a: "Generalization: Non-IT often better early career, IT better for remote work. But reality varies: some IT startups have brutal hours, some corporate non-IT roles are demanding. It depends more on company culture than sector. Ask this during interviews.",
  },
  {
    q: "Is IT oversaturated with freshers? Should I choose Non-IT instead?",
    a: "IT is competitive but not oversaturated for quality candidates. Strong IT freshers with projects still get hired. Non-IT is less competitive but also offers fewer entry-level roles. Choose based on fit, not just competition levels.",
  },
  {
    q: "Can I combine both: start IT and transition to business roles?",
    a: "Yes, this is increasingly common. Many IT professionals transition to product management, consulting, or business analyst roles. Your technical background becomes an advantage. It's harder to go IT → Non-IT without upskilling, but easier than you think.",
  },
];

const practices = [
  "Be honest about your strengths — coding aptitude? People skills? Business thinking? Let this guide your choice.",
  "Research actual work (shadow professionals, watch day-in-the-life videos) before committing.",
  "Start with the sector aligned with your interest; switching is possible but harder.",
  "Build hybrid skills: IT professionals should develop business sense, non-IT professionals should understand tech basics.",
  "Network in your chosen sector early — who you know matters as much as what you know.",
  "Evaluate company culture, not just sector — a bad IT startup > a good non-IT corporate role (or vice versa).",
];

const mistakes = [
  "Choosing IT only for higher salary without tech interest — you'll struggle and burn out.",
  "Assuming Non-IT is 'easier' — it's different, not easier. Equally demanding in different ways.",
  "Not evaluating company culture alongside sector choice — wrong company ruins any sector.",
  "Waiting to decide: start building skills for your likely path now, not 6 months later.",
  "Ignoring hybrid roles: many roles (Business Analyst, Product Manager) blend both sectors.",
  "Changing your mind repeatedly — commit to 1–2 years in your chosen path before switching.",
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

export default function ITvsNonITJobs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-amber-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-amber-200 text-sm">
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
                Every fresher faces the same crossroads: Should I pursue IT or Non-IT jobs? The question feels urgent because the answer seems to determine your entire career. But the truth is more nuanced. <strong className="text-amber-700">Both paths offer real opportunities</strong> — the question is which aligns with your strengths, interests, and long-term goals.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide compares IT and Non-IT career paths for freshers in 2026 — salary, growth, skill requirements, work-life balance, and real scenarios to help you make an informed decision that you won't regret two years in.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Why This Choice Matters (But Not As Much As You Think)</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The IT vs Non-IT question has exploded in relevance post-2020. IT jobs offer higher starting salaries, remote work, and global opportunities. Non-IT roles offer stability, structured growth, and lower barriers to entry. But here's the reality: <strong>Most freshers who succeed aren't in the 'right' sector — they're in the right company with the right mentorship.</strong>
            </p>
            <p className="text-gray-600 leading-relaxed">
              A brilliant IT fresher at a toxic startup might regret their choice. A dedicated non-IT fresher at a growth-focused company might outpace their IT peers. The sector matters, but company fit, manager quality, and your own effort matter more. That said, understanding the differences helps you make an informed choice and set realistic expectations.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to decide your career path.</p>
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

          {/* ── COMPARISON ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8-Point Comparison: IT vs Non-IT</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">Head-to-head analysis of key factors.</p>
            <div className="space-y-4">
              {comparison.map((item) => (
                <div key={item.num} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 sm:px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-0">
                      <span className="text-2xl font-black text-amber-200">{item.num}</span>
                      <h3 className="text-lg font-bold text-gray-900">{item.category}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                    <div className="p-5 sm:p-6">
                      <p className="text-sm font-bold text-blue-700 mb-2">🖥️ {item.itTitle}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.itDesc}</p>
                    </div>
                    <div className="p-5 sm:p-6">
                      <p className="text-sm font-bold text-green-700 mb-2">💼 {item.nonItTitle}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.nonItDesc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Examples: Two Freshers, Two Paths</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">A</div>
                  <div>
                    <p className="font-bold text-gray-900">Aditya - IT Path</p>
                    <p className="text-blue-600 text-xs">CS Graduate</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">Month 1–2:</p>
                    <p className="text-gray-600">Learned Python, built 2 projects, portfolio on GitHub.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Month 3:</p>
                    <p className="text-gray-600">Landed junior dev role at startup, ₹4.5 LPA.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Year 2:</p>
                    <p className="text-gray-600">Promoted to mid-level dev, ₹7.5 LPA. Learning cloud platforms.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Challenge:</p>
                    <p className="text-gray-600">Startup burned him out with 12-hour days. Considering job change.</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">P</div>
                  <div>
                    <p className="font-bold text-gray-900">Priya - Non-IT Path</p>
                    <p className="text-green-600 text-xs">Commerce Graduate</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">Month 1–2:</p>
                    <p className="text-gray-600">Learned Excel, SAP basics, case study analysis.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Month 3:</p>
                    <p className="text-gray-600">Finance analyst role at corporate bank, ₹3.5 LPA.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Year 2:</p>
                    <p className="text-gray-600">Senior analyst, ₹5.5 LPA. Taking CFA exam. Stable growth.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Challenge:</p>
                    <p className="text-gray-600">Growth slower than peers in IT. Needs MBA for director roles.</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-6 italic text-center">
              Both are happy. Aditya makes more money but works longer hours. Priya has better work-life balance but slower salary growth. The "right" choice depends on your values, not on salary alone.
            </p>
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
              IT vs Non-IT isn't a binary choice — it's a trade-off. IT offers higher salary and remote work but steeper learning curve. Non-IT offers stability and accessibility but slower growth. Neither is universally "better." The right choice depends on your interests, strengths, and values.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Here's the honest truth: You don't need to nail this choice today. Most successful professionals have worked in multiple sectors. What matters is starting somewhere aligned with your strengths, committing to growth, and being willing to adapt as you learn what actually works for you.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Choose based on fit, not fear. The best career path is the one you actively build, not the one you defaulted into.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-amber-600 to-red-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Explore Your Path?</h2>
            <p className="text-amber-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Whether IT or Non-IT, GreatHire has opportunities across both sectors. Explore roles, talk to professionals, and make an informed decision for your career.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-amber-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-amber-50 transition-colors shadow-lg"
            >
              Explore Both IT & Non-IT Roles on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
