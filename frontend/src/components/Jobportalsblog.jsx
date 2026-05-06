import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Top Job Portals in India Compared",
  subtitle: "Best Job Portals Guide 2026",
  date: "May 06, 2026",
  readTime: "11 min read",
  category: "Job Search",
  keywords: [
    "best job portals India",
    "top job sites India 2026",
    "job portals for freshers India",
    "Naukri vs LinkedIn vs GreatHire",
    "where to find jobs in India",
    "job search platforms India",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and What Each Portal Actually Does",
    desc: "Not all job portals work the same way — and using the wrong one for your goal is one of the most common mistakes job seekers make. Some portals like Naukri are volume-based, others like LinkedIn are network-driven, and platforms like GreatHire are specifically built for freshers and entry-level roles. Before you register on six portals and burn out, understand what each one is designed for. Read their 'About' pages, browse roles without logging in, and check if your target companies post there. Matching the right portal to your job-search goal is step one.",
  },
  {
    num: "02",
    title: "Build a Strong Profile on the Right Platforms",
    desc: "Your profile is your digital resume on these platforms — and most freshers set it up once and never touch it again. That's a mistake. On Naukri and GreatHire, keep your profile updated weekly — portal algorithms surface recently-updated profiles to recruiters. On LinkedIn, treat your profile as a personal brand page: clear headline, summary in first person, skills section filled, and at least 1–2 posts or articles showing your knowledge. On Internshala, highlight academic projects and relevant coursework since work experience is not expected. On every platform, upload a clean resume PDF and use keywords from your target job descriptions.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively Across Portals",
    desc: "Use each portal for what it's best at. Use GreatHire for targeted fresher openings. Use Naukri for volume — apply to 10–15 well-matched roles per week. Use LinkedIn to connect with hiring managers and get referrals before applying. Use Internshala for internships that convert to full-time. Use Cutshort for product and tech startups. Set up job alerts on at least 3 portals so you're notified the moment new roles go live. Apply within 24–48 hours of a job posting — recruiters often fill roles fast. Customize your resume for each role category, not just each application.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Most job seekers apply and forget. Create a simple tracker: portal used, company name, role, date applied, response received, interview stage, outcome. Review weekly — which portals are getting you responses? Which aren't? Double down on what works, don't blindly keep applying everywhere. If you're getting views but no calls on Naukri, your resume needs work. If you're getting calls but no offers, focus on interview prep. If LinkedIn is driving referrals, increase your posting frequency. Data from your own job search is your most valuable input.",
  },
];

const portals = [
  {
    num: "01",
    name: "GreatHire",
    tagline: "Best for Freshers & Entry-Level Roles",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    badgeLabel: "Top for Freshers",
    url: "greathire.in",
    pros: ["Purpose-built for fresher and entry-level hiring", "Cleaner interface with less noise than large portals", "Targeted roles across IT, business, and non-tech sectors", "Growing recruiter base actively looking for fresh talent"],
    cons: ["Smaller volume compared to Naukri for experienced roles", "Fewer senior-level listings"],
    bestFor: "Freshers, recent graduates, entry-level job seekers",
  },
  {
    num: "02",
    name: "Naukri.com",
    tagline: "India's Largest Job Portal by Volume",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Highest Volume",
    url: "naukri.com",
    pros: ["Largest database of jobs in India — millions of listings", "Strong recruiter activity across all sectors", "Profile visibility to thousands of recruiters", "Free resume building and upload tools"],
    cons: ["Extremely competitive — freshers get lost in the crowd", "Many outdated or ghost listings", "Spam recruiters and irrelevant calls are common"],
    bestFor: "Mid-level and experienced professionals; freshers who update profiles consistently",
  },
  {
    num: "03",
    name: "LinkedIn",
    tagline: "Best for Networking and Referrals",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    badgeLabel: "Best for Network",
    url: "linkedin.com",
    pros: ["Direct access to hiring managers and recruiters", "Referrals and warm introductions dramatically improve response rates", "Company culture, team insights, and employee reviews in one place", "Content creation builds personal brand and inbound interest"],
    cons: ["Competitive — requires strong profile and networking effort", "Premium features (InMail) gated behind paid plan", "Job listings have high application volumes"],
    bestFor: "All levels; especially powerful for tech, finance, and product roles",
  },
  {
    num: "04",
    name: "Internshala",
    tagline: "Best for Internships That Convert",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Internship-First",
    url: "internshala.com",
    pros: ["India's leading internship platform — thousands of listings", "Many internships convert to PPOs (Pre-Placement Offers)", "Beginner-friendly interface and application process", "Also lists fresher full-time roles and training programs"],
    cons: ["Many listings are unpaid or very low stipend", "Full-time job listings are limited compared to Naukri", "Competition is very high for premium internships"],
    bestFor: "Students, college freshers, and candidates building their first experience",
  },
  {
    num: "05",
    name: "Cutshort",
    tagline: "Best for Tech & Startup Roles",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Startup-Focused",
    url: "cutshort.io",
    pros: ["AI-powered matching connects you to roles that fit your skill profile", "Strong startup and product company listings", "Cleaner, less spammy experience than large portals", "Many roles are unfilled on other platforms"],
    cons: ["Smaller database — fewer listings overall", "Less effective for non-tech or government sector roles", "Limited recruiter activity in Tier-2 cities"],
    bestFor: "Tech freshers and developers targeting product companies and startups",
  },
  {
    num: "06",
    name: "Indeed India",
    tagline: "Strong for Non-IT and Tier-2 City Roles",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Wide Coverage",
    url: "indeed.co.in",
    pros: ["Aggregates listings from company websites and other portals", "Good coverage of non-IT sectors: retail, logistics, healthcare, education", "Strong Tier-2 and Tier-3 city coverage", "Simple, no-frills application process"],
    cons: ["Interface feels dated compared to newer portals", "Fewer premium tech and startup listings", "Less recruiter-direct interaction than LinkedIn or Naukri"],
    bestFor: "Candidates in Tier-2/3 cities and non-IT sectors",
  },
  {
    num: "07",
    name: "Shine.com",
    tagline: "Solid Alternative to Naukri",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Alternative Option",
    url: "shine.com",
    pros: ["Good recruiter database across IT and non-IT sectors", "Strong for BPO, KPO, BFSI, and support roles", "Resume visibility to a different recruiter pool than Naukri", "Free premium features during promotional periods"],
    cons: ["Smaller than Naukri in listing volume", "User interface needs modernizing", "Less effective for senior tech or product roles"],
    bestFor: "BPO, BFSI, support, and operations roles; useful as a secondary portal",
  },
  {
    num: "08",
    name: "Unstop (formerly Dare2Compete)",
    tagline: "Best for Competitions, Hackathons & Campus Hiring",
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    badgeLabel: "Campus & Contests",
    url: "unstop.com",
    pros: ["India's top platform for hackathons, case competitions, and quizzes", "Direct campus hiring drives from top companies", "Great for building a competitive profile and winning recognition", "Strong community for college students and freshers"],
    cons: ["Not a primary job portal — listings are limited", "Best suited for students who are currently in college", "Highly competitive for top prizes and hiring programs"],
    bestFor: "College students wanting campus placements, competitions, and brand-name internships",
  },
];

const practices = [
  "Update your profile on at least 2 portals every week — algorithms favor active, recent profiles.",
  "Set job alerts with precise keywords on 3+ portals so you apply within 24–48 hours of new listings.",
  "Use LinkedIn for networking alongside applications — one warm referral beats 20 cold applies.",
  "Tailor your resume for each role category, even if you're using the same base document.",
  "Track every application in a spreadsheet — portal, company, role, date, status, outcome.",
  "Don't ignore smaller or niche portals — competition is lower and match quality is often higher.",
];

const mistakes = [
  "Registering on 6+ portals but maintaining none — better to be active on 3 than passive on 8.",
  "Setting up a profile once and never updating it — stale profiles are deprioritized by algorithms.",
  "Applying to roles you're significantly underqualified or overqualified for — it wastes time and hurts your response rate.",
  "Ignoring LinkedIn in favor of only Naukri — network-driven referrals have far higher conversion.",
  "Not customizing your resume — a generic resume sent to 100 roles performs worse than a tailored one sent to 20.",
  "Forgetting to follow up — a polite LinkedIn message or email 5 days after applying can revive a stalled application.",
];

const faqs = [
  {
    q: "Which is the best job portal in India for freshers in 2026?",
    a: "GreatHire is purpose-built for freshers and entry-level roles, making it the most targeted option. Combine it with Internshala for internships, LinkedIn for networking and referrals, and Naukri for volume. Using 3–4 portals strategically beats relying on one.",
  },
  {
    q: "Is Naukri still relevant in 2026?",
    a: "Yes — Naukri remains India's largest job portal by volume and has the widest recruiter database. However, freshers need to work harder to stand out: update your profile weekly, use keywords from job descriptions, and be prepared for high competition and occasional spam calls.",
  },
  {
    q: "Should I use LinkedIn or Naukri as a fresher?",
    a: "Both, for different reasons. Use Naukri for direct job applications at scale. Use LinkedIn to build your professional profile, connect with hiring managers, and get referrals. LinkedIn referrals consistently convert at higher rates than cold applications on any portal.",
  },
  {
    q: "How many job portals should I actively use at once?",
    a: "3–4 portals is the optimal range for most freshers. Any fewer and you miss opportunities; any more and you can't maintain quality profiles on all of them. Recommended starting combination: GreatHire + Naukri + LinkedIn, then add Internshala or Cutshort based on your target roles.",
  },
  {
    q: "Are paid subscriptions on job portals worth it for freshers?",
    a: "Generally no — not at the start. Free tiers on Naukri, LinkedIn, and GreatHire are sufficient for most freshers. Invest in a paid plan only if you've maxed out free tier features and are applying consistently. LinkedIn Premium can be worth it if you're actively networking and sending InMails to recruiters.",
  },
  {
    q: "Why am I getting profile views but no calls on job portals?",
    a: "Profile views without calls usually means your resume or profile isn't converting. Check: Does your headline clearly state your target role? Is your resume ATS-friendly with keywords from job descriptions? Is your experience/projects section specific and results-oriented? Try updating your resume, refreshing your profile, and asking a senior or mentor to review it.",
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
        <span className={`text-teal-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function JobPortalsBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-teal-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-teal-200 text-sm">
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
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                With dozens of job portals available in India, most job seekers make the same mistake: registering on everything, staying active on nothing. The result is a scattered, exhausting job search that produces few results — not because of a lack of effort, but because of a lack of strategy around{" "}
                <strong className="text-teal-700">the best job portals in India</strong>.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide compares the top 8 job portals in India — what each one is actually best for, who should use it, the honest pros and cons, and a step-by-step strategy to use them effectively — so your job search works smarter, not just harder.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Choosing the Right Job Portal Matters in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              India's job search landscape has fragmented significantly. In 2026, you have general portals, niche portals, network-driven platforms, campus-focused tools, and startup-specific sites — all competing for your time and attention. Using the wrong platform for your goal means low response rates, irrelevant calls, and wasted weeks of effort.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The smartest job seekers don't use the most platforms — they use the right 3–4 consistently. They keep their profiles updated, set smart job alerts, apply strategically within 24 hours of new listings, and layer in networking where it multiplies their results. This guide shows you exactly how.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance to Using Job Portals Effectively</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to get the most out of any job portal.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
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

          {/* ── PORTAL CARDS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Top 8 Job Portals in India — Compared</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">Honest pros, cons, and who each portal is actually best for.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {portals.map((portal) => (
                <div key={portal.num} className={`border rounded-2xl p-5 sm:p-6 ${portal.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{portal.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${portal.badge}`}>{portal.badgeLabel}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">{portal.name}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-3">{portal.tagline}</p>

                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pros</p>
                    <ul className="space-y-1">
                      {portal.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-green-500 font-bold mt-px flex-shrink-0">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Cons</p>
                    <ul className="space-y-1">
                      {portal.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-red-400 font-bold mt-px flex-shrink-0">✗</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-gray-200/70">
                    <p className="text-xs text-gray-500">
                      <span className="font-bold text-gray-700">Best for: </span>
                      {portal.bestFor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: How Vikram Used 3 Portals to Land a Job in 6 Weeks</h2>
            <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">V</div>
                <div>
                  <p className="font-bold">Vikram</p>
                  <p className="text-teal-200 text-xs">B.Sc IT Graduate — 4 Months of Scattered Job Search, No Offers</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Week 1–2",
                    title: "Strategy Reset",
                    desc: "Stopped applying randomly on 5 portals. Chose 3: GreatHire for fresher roles, LinkedIn for networking, Naukri for volume. Rebuilt his profile on all three with updated resume and keywords.",
                  },
                  {
                    month: "Week 3–4",
                    title: "Targeted Applying",
                    desc: "Set job alerts on all 3 portals. Applied to 8–10 roles per week on Naukri. Sent 15 connection requests to hiring managers on LinkedIn. Applied to 5 targeted roles on GreatHire. Total: ~25 applications, all tracked.",
                  },
                  {
                    month: "Week 5–6",
                    title: "Hired ✓",
                    desc: "Got 6 interview calls — 3 from GreatHire, 2 from LinkedIn referrals, 1 from Naukri. Converted 2 into offers. Joined a Pune-based IT firm as Technical Support Engineer at ₹3.2 LPA.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-teal-200 text-xs font-bold uppercase tracking-wider mb-1">{m.month}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-teal-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-teal-100 text-sm italic border-t border-white/20 pt-4">
                "He wasn't applying less — he was applying smarter. Three focused portals with maintained profiles outperformed five neglected ones every time."
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
            </div>
          </section>

          {/* ── CONCLUSION ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Conclusion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The best job portal in India isn't one platform — it's the right combination of 3–4 platforms used consistently and strategically. Use GreatHire for fresher-focused roles, LinkedIn for networking and referrals, Naukri for volume, and a niche platform like Cutshort or Internshala based on your target role. Keep your profiles updated, set smart alerts, apply early, and track everything. The job seekers who win aren't the ones on the most platforms — they're the ones who show up consistently on the right ones.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Pick your 3, set them up properly, and let the strategy do the heavy lifting.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Start Your Job Search on GreatHire</h2>
            <p className="text-teal-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              India's fresher-first job portal — thousands of entry-level roles across IT, business, data, and more. Set up your profile in minutes and start applying today.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-teal-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-teal-50 transition-colors shadow-lg"
            >
              Explore Jobs on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}