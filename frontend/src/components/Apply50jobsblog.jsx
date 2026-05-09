import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "How to Apply for 50 Jobs a Day",
  subtitle: "Apply Jobs Effectively — 2026 Guide",
  date: "May 06, 2026",
  readTime: "10 min read",
  category: "Job Search Strategy",
  keywords: [
    "apply jobs effectively",
    "how to apply for jobs fast",
    "job application strategy 2026",
    "apply to 50 jobs a day",
    "bulk job application tips",
    "job search strategy freshers India",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — Volume vs. Quality in Job Applications",
    desc: "Before sending 50 applications a day, understand what actually gets responses. Mass applying to random roles wastes time and tanks your morale. The goal isn't 50 applications — it's 50 well-matched applications. Start by defining your target clearly: which role, which industry, which city, which company size. Build a list of your non-negotiables (role type, minimum CTC, location) and your nice-to-haves. Read 20+ job descriptions for your target role and identify the common keywords, tools, and skills. Know what an ideal match looks like before you start applying at speed. Volume only works when paired with focus — scattered applications across 10 different roles will produce worse results than 50 targeted applications in one category.",
  },
  {
    num: "02",
    title: "Build Your Application Infrastructure Before You Start",
    desc: "Applying fast requires having everything ready before you open a single job board. Your infrastructure: (1) A master resume — clean, ATS-optimized, keyword-rich, tailored to your target role category. (2) 2–3 resume variants for slightly different roles (e.g., one for software developer roles, one for support roles). (3) A one-paragraph cover note template you can personalize in 60 seconds. (4) A professional LinkedIn profile and updated Naukri/GreatHire profile. (5) A job tracker spreadsheet with columns for: portal, company, role, date applied, JD link, resume version used, response, stage, outcome. Build this infrastructure once — and it makes every subsequent application take under 3 minutes.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools to Hit 50 Applications a Day",
    desc: "Here's the actual workflow. Morning session (2 hours): Open GreatHire, Naukri, LinkedIn, and Internshala. Filter by your target role, location, and experience level. Sort by 'date posted' and apply only to roles posted in the last 48 hours — older listings fill fast. Use saved/auto-fill profiles on portals to reduce friction. Apply to 20–25 roles here. Midday session (1.5 hours): Work through LinkedIn Easy Apply listings for your target roles. Apply to 15–20 roles. Afternoon session (30 mins): Identify 5–10 companies you genuinely want to work at. Find the careers page on their website and apply directly — these applications often skip the ATS queue. Evening (20 mins): Update your tracker with all applications from the day. Note anything that felt off — wrong role, wrong company type — and tighten your filter for tomorrow.",
  },
  {
    num: "04",
    title: "Track Progress and Improve the System Continuously",
    desc: "Raw application volume without feedback is noise. Review your tracker every 3 days: What's your response rate by portal? Which role titles get callbacks and which don't? Which resume version is performing better? If you've sent 150 applications and have zero responses, the problem is upstream — your resume, your role targeting, or your profile. Fix those before sending more. If you're getting profile views but no calls, your resume isn't converting — get it reviewed. If you're getting calls but failing interviews, shift time from applying to interview prep. Treat the job search as a system: measure inputs (applications sent), outputs (responses, interviews, offers), and improve the conversion at each step. Sending more applications is only one lever — it's often not the most effective one.",
  },
];

const tactics = [
  {
    num: "01",
    title: "Build a Master Resume Once, Use Variants Forever",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Foundation",
    desc: "Create one perfectly optimized master resume. Then create 2–3 role-specific variants (e.g., software developer, technical support, data analyst). Each variant takes 10 minutes to create from the master. Every fast application pulls from an existing variant — you never start from scratch.",
  },
  {
    num: "02",
    title: "Use Job Alerts So Listings Come to You",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Automation",
    desc: "Set keyword-based job alerts on GreatHire, Naukri, LinkedIn, and Indeed. New matching listings land in your inbox daily. No time wasted scrolling. Apply to email alerts first — these are freshest and have the lowest competition. 15 minutes of alert-setting once saves hours of searching weekly.",
  },
  {
    num: "03",
    title: "Use LinkedIn Easy Apply for Speed",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Speed Tool",
    desc: "LinkedIn Easy Apply lets you apply to roles in under 60 seconds using your saved profile. Filter by 'Easy Apply' + your target role + 'Past 24 hours'. You can realistically apply to 25–30 LinkedIn roles in an hour. Make sure your LinkedIn profile is complete — that's what gets sent.",
  },
  {
    num: "04",
    title: "Apply Directly on Company Career Pages",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    badgeLabel: "High Quality",
    desc: "For 5–10 dream companies daily, skip the portals and apply directly on their careers page. These applications often bypass ATS queues and land directly with the hiring team. Bookmark 50–100 target company career pages and check them weekly. This is lower volume but significantly higher conversion.",
  },
  {
    num: "05",
    title: "Batch and Time-Block Your Application Sessions",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "Productivity",
    desc: "Don't apply sporadically throughout the day. Block 3 dedicated sessions: morning (Naukri + GreatHire), midday (LinkedIn), afternoon (direct company sites). Batching reduces decision fatigue, keeps you in flow, and makes it easier to hit 50 applications without burning out by noon.",
  },
  {
    num: "06",
    title: "Keep a Live Tracker — Update It Daily",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Measurement",
    desc: "A Google Sheet with 8 columns (portal, company, role, date, JD link, resume version, response, stage) is your command center. Update it every evening. After 50–100 applications, patterns emerge: which portals respond, which role titles get traction, which companies never reply. This data makes every future application smarter.",
  },
  {
    num: "07",
    title: "Personalize Just Enough — Not Everything",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Balance",
    desc: "Full customization for 50 applications a day is impossible. Instead: 90% of applications use your best-fit resume variant. For 5–10 roles you genuinely want, spend 5 extra minutes personalizing the cover note and tweaking 2–3 resume bullet points. This 80/20 approach gives you volume and quality where it counts.",
  },
  {
    num: "08",
    title: "Follow Up Strategically After Applying",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Multiplier",
    desc: "5 days after applying to a company you care about, send a short LinkedIn message to the recruiter or hiring manager: 'Hi [Name], I applied for [Role] on [Date] and wanted to express genuine interest. Happy to share more about my background if useful.' A 3-line follow-up revives 10–15% of stalled applications.",
  },
];

const practices = [
  "Consistency beats intensity — 50 focused applications daily for 2 weeks beats 500 random ones in a weekend.",
  "Set up job alerts on 3+ portals the night before you start — listings flow to you instead of you hunting.",
  "Review your tracker every 3 days and cut what isn't working — stop applying on portals that never respond.",
  "Block dedicated time sessions for applying — morning for Naukri/GreatHire, midday for LinkedIn Easy Apply.",
  "Apply to roles posted in the last 48 hours only — older listings are largely filled or forgotten.",
  "Follow up on your top 10 applications every week — a short LinkedIn message revives stalled applications.",
];

const mistakes = [
  "Applying to every role regardless of fit — mismatched applications waste your time and the recruiter's.",
  "Using the same generic resume for every role type — ATS systems filter out non-matching resumes instantly.",
  "Not tracking applications — without a tracker, you can't identify what's working or follow up properly.",
  "Applying to roles posted weeks ago — competition is highest and slots are often already filled.",
  "Burning out in week one by applying 100+ times daily — sustainable volume beats unsustainable sprints.",
  "Ignoring profile quality on portals — a weak Naukri or LinkedIn profile kills applications before they're read.",
];

const faqs = [
  {
    q: "Is applying to 50 jobs a day actually effective, or is quality better than quantity?",
    a: "Both matter — but they're not mutually exclusive. 50 well-targeted applications per day in your specific role category is very effective. 50 random applications across 10 different roles is largely wasted effort. The key is volume within focus: pick one role type, build the right resume, and apply at scale within that lane.",
  },
  {
    q: "How long does it take to apply to 50 jobs in a day?",
    a: "With the right infrastructure in place (resume ready, profiles updated, job alerts set), 50 applications takes 4–5 hours split across 3 sessions. LinkedIn Easy Apply accounts for 25–30 of those in about 90 minutes. The first day takes longer to set up — by day 3, the workflow becomes fast and familiar.",
  },
  {
    q: "Which portals are best for applying to many jobs quickly?",
    a: "LinkedIn Easy Apply is the fastest — 60 seconds per application with a complete profile. GreatHire and Naukri have saved-profile apply features that reduce friction. Internshala works well for internships and fresher roles. Use all three in sequence: LinkedIn for speed, GreatHire for fresher targeting, Naukri for volume.",
  },
  {
    q: "Should I write a cover letter for every application when applying at scale?",
    a: "No — and trying to will kill your pace. Use a strong, tailored resume as your primary asset. Keep a 3-sentence cover note template that you personalize in 60 seconds for standard applications. Save fully customized cover letters for 5–10 dream companies per week where it genuinely adds value.",
  },
  {
    q: "How do I avoid applying to the same role twice across different portals?",
    a: "Your job tracker is your safeguard. Log every application with the company name and role title. Before applying to a new listing, search your tracker. Many portals also show 'Applied' status on roles you've already applied to — check this before submitting on each platform.",
  },
  {
    q: "What should I do if I'm applying to 50 jobs a day but getting zero responses?",
    a: "Stop and diagnose before sending more. Zero responses after 100+ applications almost always means one of three things: your resume isn't ATS-optimized, you're applying to roles where your profile doesn't match, or your portal profiles are incomplete. Get your resume reviewed, check keyword alignment with job descriptions, and update all profiles before resuming at scale.",
  },
  {
    q: "How many weeks should I apply at this volume before reassessing?",
    a: "Give it 2 weeks of consistent effort before making major changes. After 2 weeks and 500+ applications, you should have enough data — responses, views, call rates — to see what's working. If response rates are under 2%, something upstream needs fixing. If they're above 5%, keep the system going and focus on interview conversion.",
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
        <span className={`text-blue-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Apply50JobsBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-blue-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-blue-200 text-sm">
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
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Most freshers{" "}
                <strong className="text-blue-700">apply jobs ineffectively</strong> — sending 5–10 applications a week, waiting passively, and wondering why nothing is moving. In a competitive market, that pace simply isn't enough. The job seekers who land offers fastest are the ones who treat job applications like a system: high volume, high focus, consistently executed.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide shows you exactly how to apply to 50 jobs a day without burning out — the tools, the workflows, the time blocks, and the tracking system that turns raw volume into real interviews.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why 50 Applications a Day — and Why Most People Never Get There
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The average fresher applies to 3–5 jobs per day. At that rate, it takes months to generate enough pipeline to get consistent interview practice. In 2026, with thousands of candidates competing for the same entry-level roles, low application volume means you're competing with one hand tied behind your back.
            </p>
            <p className="text-gray-600 leading-relaxed">
              50 targeted applications per day — within your specific role category — generates 10x the pipeline of the average job seeker. With a 3–5% response rate (industry standard for freshers), that's 75–125 callbacks from 1,500 applications in a month. The infrastructure to get there is simpler than most people think. This guide builds it for you.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance to Apply Jobs Effectively at Scale</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to go from 5 applications a day to 50 — without chaos.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── TACTICS CARDS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Tactics to Apply Jobs Effectively at High Volume</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">The exact techniques that make 50 applications a day sustainable — not stressful.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {tactics.map((tactic) => (
                <div key={tactic.num} className={`border rounded-2xl p-5 sm:p-6 ${tactic.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{tactic.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${tactic.badge}`}>{tactic.badgeLabel}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">{tactic.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tactic.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: From 5 to 50 Applications a Day — Hired in 3 Weeks</h2>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">K</div>
                <div>
                  <p className="font-bold">Karan</p>
                  <p className="text-blue-200 text-xs">BCA Graduate — Applying for 6 Weeks with No Results</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Week 1",
                    title: "Infrastructure Built",
                    desc: "Stopped random applying. Built master resume + 2 variants (developer, support). Updated GreatHire, Naukri, and LinkedIn profiles. Set job alerts on all 3. Built tracker spreadsheet. Ready to scale.",
                  },
                  {
                    month: "Week 2",
                    title: "50/Day System Running",
                    desc: "Morning: 20 applications on GreatHire + Naukri. Midday: 20 LinkedIn Easy Apply. Afternoon: 10 direct company career pages. Tracked every application. 47 avg. applications per day. 6 responses by end of week.",
                  },
                  {
                    month: "Week 3",
                    title: "Hired ✓",
                    desc: "4 interview rounds from week 2 pipeline. Converted 2 offers. Joined a Bangalore IT firm as Junior Developer at ₹4.2 LPA. Total applications sent: ~300. Total time: 3 weeks of focused execution.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">{m.month}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-blue-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-blue-100 text-sm italic border-t border-white/20 pt-4">
                "He didn't do anything magical. He built a system, ran it consistently for 3 weeks, and let the math work in his favor."
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
              Applying to 50 jobs a day isn't about desperation — it's about building a system that generates enough pipeline to give you real options. Set up your resume variants, build your tracker, activate job alerts, block your daily sessions, and let the workflow do the heavy lifting. Measure your response rate every 3 days and improve what isn't working. The job seekers who get hired fastest aren't the luckiest — they're the most systematic.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Build the system once. Run it consistently. The offers will follow.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Start Applying Smarter Today</h2>
            <p className="text-blue-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire is built for freshers — thousands of entry-level roles across IT, business, and more, with fast apply features that make hitting your daily target effortless.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-blue-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Applying on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}