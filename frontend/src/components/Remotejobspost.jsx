import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Remote Jobs in India",
  subtitle: "Complete Guide to Working Remotely in 2026",
  date: "May 06, 2026",
  readTime: "11 min read",
  category: "Remote Work",
  keywords: [
    "remote jobs India",
    "work from home jobs India 2026",
    "remote jobs for freshers India",
    "best remote jobs India",
    "online jobs India",
    "remote work opportunities India",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Remote Job Market and What Employers Actually Expect",
    desc: "Remote jobs in India have evolved significantly since 2020. In 2026, companies hiring remotely expect candidates who are self-directed, communicative, and technically set up to work independently. Before applying, understand the difference between fully remote (work from anywhere), hybrid (some office days), and remote-first (company culture built around distributed teams). Research which industries actively hire remotely in India — IT, data analytics, content, digital marketing, customer success, and finance lead the list. Read 15–20 remote job descriptions for your target role. Note what soft skills appear repeatedly alongside technical requirements: async communication, time management, documentation habits. These are non-negotiable in remote roles.",
  },
  {
    num: "02",
    title: "Build the Skills and Setup That Remote Employers Look For",
    desc: "Remote roles demand a specific skill profile beyond just technical competence. Communication skills — especially written — are weighted more heavily than in office roles. You'll need to demonstrate comfort with async tools: Slack, Notion, Jira, Zoom, Trello, or their equivalents. Build your technical skills relevant to your target role (Python, SQL, content writing, digital marketing, etc.) and layer in remote-specific capabilities: writing clear project updates, managing your own deadlines, and documenting your work. Invest in a reliable internet connection, a clean workspace, and a decent microphone — these signal professionalism on video calls. Employers assess your remote readiness from the first interaction.",
  },
  {
    num: "03",
    title: "Apply Strategically Using the Right Platforms and Approaches",
    desc: "Remote job hunting requires a different strategy than traditional job searching. Use platforms that specifically filter for remote roles in India — GreatHire, LinkedIn (filter: Remote), We Work Remotely, Remote.co, and Wellfound for startups. Tailor your resume to highlight remote-friendly traits: self-motivated, strong communicator, delivered X project independently. In your cover letter or application note, explicitly mention your remote setup and past independent work (freelance, internships, projects). Apply within 24–48 hours of listings going live — remote roles attract global applicants and fill fast. Use LinkedIn to connect with hiring managers at remote-first companies before applying — a warm connection dramatically improves response rates.",
  },
  {
    num: "04",
    title: "Track Your Applications and Continuously Improve Your Approach",
    desc: "Remote job searching can feel slower and less visible than traditional job hunting — you're competing with a larger, sometimes global, pool. Maintain a tracker: platform used, company, role, date applied, response, interview stage, outcome. Review weekly — which platforms are generating responses? Which application formats are working? If you're getting interviews but not offers, the problem is interview performance. If you're not getting interviews, your resume or profile needs work. Set weekly targets: 8–10 remote applications, 10 LinkedIn connections with relevant people, 2 profile updates. Treat the job search itself like a remote project — with structure, deadlines, and regular self-reviews.",
  },
];

const remoteRoles = [
  {
    num: "01",
    title: "Remote Software Developer",
    category: "Technology",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "High Demand",
    skills: "Python / JavaScript / Java, Git",
    ctc: "₹4–12 LPA",
    desc: "The most common remote role in India. Product companies, SaaS startups, and IT services firms hire developers fully remotely. Strong fundamentals, a GitHub portfolio, and comfort with async communication are your core requirements. High demand across all experience levels.",
  },
  {
    num: "02",
    title: "Remote Data Analyst",
    category: "Data & Analytics",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Fast Growing",
    skills: "SQL, Python, Excel, Power BI / Tableau",
    ctc: "₹3.5–9 LPA",
    desc: "Analytics work translates naturally to remote environments — data pipelines, dashboards, and reporting don't require physical presence. Fintech, e-commerce, and consulting firms hire remote analysts. Strong documentation habits are essential: your work needs to be understandable without you explaining it in person.",
  },
  {
    num: "03",
    title: "Remote Content Writer / Copywriter",
    category: "Content & Marketing",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Entry Friendly",
    skills: "Writing, SEO basics, Research, CMS tools",
    ctc: "₹2.5–6 LPA",
    desc: "One of the most accessible remote jobs for freshers in India. Companies across every sector need content — blogs, product copy, social media, technical documentation. Build a writing portfolio of 5–8 samples across different formats. SEO knowledge significantly increases your earning potential.",
  },
  {
    num: "04",
    title: "Remote Digital Marketing Executive",
    category: "Marketing",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    badgeLabel: "Wide Openings",
    skills: "Google Ads, Meta Ads, SEO, Analytics, Email",
    ctc: "₹3–7 LPA",
    desc: "Digital marketing is almost entirely remote-compatible. Roles span SEO, paid advertising, social media management, email marketing, and performance analytics. Certifications from Google and Meta are free and highly valued. Freshers who can show campaign results — even from personal projects — stand out immediately.",
  },
  {
    num: "05",
    title: "Remote Customer Success / Support",
    category: "Operations",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Quick Entry",
    skills: "Communication, CRM tools, Problem-solving",
    ctc: "₹2.5–5 LPA",
    desc: "SaaS companies globally hire Indian candidates for customer success and support roles. Excellent English communication, empathy, and the ability to learn software products quickly are the core requirements. Shift work is common for global companies. Strong growth path into account management or sales.",
  },
  {
    num: "06",
    title: "Remote UI/UX Designer",
    category: "Design",
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    badgeLabel: "Portfolio-Driven",
    skills: "Figma, User Research, Prototyping, Design Systems",
    ctc: "₹3.5–10 LPA",
    desc: "Design is inherently remote-compatible. Companies need UI/UX designers who can collaborate over Figma and present designs via video calls. Your portfolio is everything — 3–4 strong case studies showing your design process, user research, and final outcomes will outperform any certification.",
  },
  {
    num: "07",
    title: "Remote Financial Analyst / Accountant",
    category: "Finance",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Stable Demand",
    skills: "Excel, Tally, GST, Financial Modelling, QuickBooks",
    ctc: "₹3–7 LPA",
    desc: "Finance and accounting roles have gone remote across Indian SMEs, startups, and global outsourcing firms. Tally, GST compliance, Excel modelling, and QuickBooks skills are in demand. CA-intermediate or B.Com backgrounds with strong tool proficiency find this a solid remote entry point.",
  },
  {
    num: "08",
    title: "Remote QA / Software Tester",
    category: "Quality Assurance",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Underrated",
    skills: "Test case writing, Selenium, JIRA, API testing",
    ctc: "₹3–6 LPA",
    desc: "QA is one of the most remote-friendly IT roles. Test execution, bug reporting, and documentation are fully async-compatible. Manual QA is an accessible entry point for freshers, with a clear path into automation testing (Selenium, Cypress) which commands significantly higher salaries.",
  },
];

const practices = [
  "Update your profile on remote-friendly platforms weekly — active profiles surface higher in recruiter searches.",
  "Apply within 24–48 hours of a remote role going live — competition is higher and roles fill faster.",
  "Explicitly highlight remote-readiness in your resume and cover letter — self-motivation, async communication, independent delivery.",
  "Invest in your remote setup — stable internet, quiet workspace, decent webcam — employers notice professionalism from the first call.",
  "Network in remote work communities on LinkedIn, Slack groups, and Discord servers in your industry.",
  "Treat every async interaction (email, application note, message) as a communication test — remote employers evaluate your writing from day one.",
];

const mistakes = [
  "Applying to remote roles with an office-focused resume — highlight independent work, remote tools, and self-directed projects.",
  "Underestimating written communication — remote work is async-heavy and poor writing is immediately disqualifying.",
  "Applying to every remote role regardless of fit — a focused 20 applications beats 200 scattered ones.",
  "Not investing in your home setup — a noisy background or poor connection in interviews signals you're not remote-ready.",
  "Ignoring time zone requirements — many Indian remote roles for global companies require overlap with US/EU hours.",
  "Not following up after applications — remote hiring pipelines move slower and a polite follow-up often revives stalled applications.",
];

const faqs = [
  {
    q: "Are remote jobs in India legitimate and growing in 2026?",
    a: "Yes — remote work in India has matured significantly since 2020. In 2026, thousands of Indian companies and global firms hiring Indian talent offer fully remote or hybrid roles. IT, data, content, digital marketing, finance, and customer success are the most active remote sectors. The key is knowing where to look and how to identify legitimate listings.",
  },
  {
    q: "Which types of remote jobs are most available for freshers in India?",
    a: "Content writing, digital marketing, customer support, manual QA, and junior data analyst roles have the lowest entry barriers for freshers. Software development remote roles are highly available but require stronger technical proof (GitHub portfolio, projects). All remote roles require above-average written communication.",
  },
  {
    q: "How do I spot fake remote job listings in India?",
    a: "Red flags: roles that require you to pay upfront for training or materials, vague job descriptions with no company name, salaries that seem unrealistically high for the role, no official email domain in communications, and pressure to decide immediately. Always verify the company on LinkedIn, check their website, and research them on Glassdoor before sharing personal information.",
  },
  {
    q: "Do remote jobs in India pay less than office roles?",
    a: "Not necessarily. Remote roles at product companies and global firms often pay at or above market rate. Remote roles at Indian startups or SMEs may pay slightly less than equivalent office roles at large IT firms. However, when you factor in commute savings, relocation costs, and quality of life, remote compensation is often effectively higher.",
  },
  {
    q: "What tools should I learn before applying for remote jobs?",
    a: "Core remote work tools: Slack (communication), Notion or Confluence (documentation), Jira or Trello (project management), Zoom or Google Meet (video calls), and Google Workspace (docs, sheets, drive). Beyond these, learn the tools specific to your role — Figma for design, GitHub for development, Power BI for data. Listing these on your resume signals remote readiness.",
  },
  {
    q: "Is a home office setup necessary for remote jobs in India?",
    a: "A basic professional setup is expected: stable internet (minimum 20 Mbps), a quiet workspace, functional webcam, and decent audio. You don't need a high-end studio — but a noisy background, poor connection, or audio issues during interviews signal you're not prepared for remote work. Most employers ask about your setup in early screening calls.",
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
        <span className={`text-indigo-500 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function RemoteJobsBlog() {
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
            <p className="text-indigo-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-indigo-200 text-sm">
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
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                <strong className="text-indigo-700">Remote jobs in India</strong> have moved from pandemic necessity to mainstream career choice. In 2026, thousands of Indian professionals — freshers and experienced alike — are building careers entirely from home, working for Indian companies, global startups, and everything in between.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide breaks down the most in-demand remote roles in India, the skills that make candidates stand out, a step-by-step plan to find and land remote work, and honest advice on avoiding the common pitfalls that trip up most remote job seekers.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Remote Work in India Is a Real Career Path in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Remote work in India has matured far beyond basic data entry and call centre jobs. Product companies, SaaS startups, global consulting firms, and even traditional Indian enterprises now offer fully remote and hybrid roles across development, design, data, finance, marketing, and operations. India's talent is globally competitive and the infrastructure — internet, tools, remote work culture — has caught up.
            </p>
            <p className="text-gray-600 leading-relaxed">
              For freshers and professionals in Tier-2 and Tier-3 cities especially, remote work removes the relocation barrier entirely. You can work for a Bangalore-based startup or a US product company from Indore, Jaipur, or Coimbatore — with the right skills and the right strategy to find these roles.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance to Landing a Remote Job in India</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A practical 4-step framework that works for any remote role.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
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

          {/* ── REMOTE ROLES ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Most In-Demand Remote Jobs in India (2026)</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">Roles actively hiring remotely across India — with skills and salary benchmarks.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {remoteRoles.map((role) => (
                <div key={role.num} className={`border rounded-2xl p-5 sm:p-6 ${role.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{role.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${role.badge}`}>{role.badgeLabel}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{role.category}</p>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{role.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-3">🛠 {role.skills} &nbsp;·&nbsp; 💰 {role.ctc}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: From Tier-2 City to Remote Role in 75 Days</h2>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  P
                </div>
                <div>
                  <p className="font-bold">Priya</p>
                  <p className="text-indigo-200 text-xs">B.Com Graduate, Nagpur — Wanted a Remote Role, Had No Remote Experience</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Month 1",
                    title: "Research & Setup",
                    desc: "Identified remote content writing + digital marketing as her target. Researched 20 remote job descriptions. Set up a proper home workspace. Completed a free Google Digital Marketing certification.",
                  },
                  {
                    month: "Month 2",
                    title: "Portfolio & Apply",
                    desc: "Wrote 6 sample blog posts across different niches. Built a simple portfolio site. Applied to 30 remote content and marketing roles on GreatHire and LinkedIn. Connected with 20 hiring managers directly.",
                  },
                  {
                    month: "Month 3 (Week 1)",
                    title: "Hired ✓",
                    desc: "Got 4 interview calls. 2 moved to paid trial tasks. Converted 1 into a full-time remote Content Marketing role at ₹3.8 LPA. Working fully remote from Nagpur for a Bangalore-based SaaS startup.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">{m.month}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-indigo-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-indigo-100 text-sm italic border-t border-white/20 pt-4">
                "She didn't relocate. She didn't compromise on role quality. She built the right proof of work, applied to the right platforms, and the remote job came to her."
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
              Remote jobs in India in 2026 are real, growing, and accessible — for freshers and experienced professionals alike. The barrier isn't location or degree. It's preparation: the right skills, a professional remote setup, a strong portfolio, and a focused application strategy on platforms that actually list remote roles. Start with one target role, build proof of ability, apply on the right platforms, and treat your remote job search with the same discipline you'd bring to the job itself.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Your city doesn't limit your career anymore — your preparation does. Start building today.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Find Remote Jobs on GreatHire</h2>
            <p className="text-indigo-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Browse thousands of remote and hybrid roles across India — from IT and data to content, marketing, and finance. Set up your profile and start applying today.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-indigo-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Explore Remote Jobs on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}