import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "How to Find Jobs in Hyderabad Fast",
  subtitle: "Fresher's City Guide 2026",
  date: "May 06, 2026",
  readTime: "10 min read",
  category: "City Job Guide",
  keywords: [
    "jobs in Hyderabad for freshers",
    "fresher jobs Hyderabad 2026",
    "IT jobs Hyderabad freshers",
    "how to find jobs in Hyderabad",
    "Hyderabad job search tips",
    "entry level jobs Hyderabad",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand Hyderabad's Job Market and Industry Expectations",
    desc: "Hyderabad is India's second-largest IT hub after Bangalore, home to HITEC City, Gachibowli, and Madhapur — where companies like Microsoft, Google, Amazon, TCS, Infosys, and hundreds of product startups are headquartered. Before applying anywhere, understand which sectors are actively hiring freshers: IT services, product companies, pharma tech, fintech, and e-commerce lead the way. Research 15–20 job descriptions for your target role in Hyderabad specifically. Note which skills appear repeatedly, what salary ranges look like for freshers, and whether companies prefer candidates from local colleges or hire pan-India. Knowing the local market gives you a real edge.",
  },
  {
    num: "02",
    title: "Build the Skills and Profile Hyderabad Companies Look For",
    desc: "Hyderabad's IT corridor is highly skill-driven. Companies in HITEC City aren't impressed by degrees alone — they want proof of ability. For tech roles: Python, Java, SQL, React, and cloud basics (AWS/Azure) are in constant demand. For non-tech roles: strong communication, Excel, basic data skills, and domain knowledge matter. Build at least 2 real projects and host them on GitHub, Kaggle, or a portfolio site. Get an AWS Cloud Practitioner or Google IT certification if you're targeting cloud or support roles — these certifications are widely recognized by Hyderabad employers. Update your LinkedIn with Hyderabad in your location settings so recruiters in the city can find you.",
  },
  {
    num: "03",
    title: "Apply Using the Right Platforms and Strategies for Hyderabad",
    desc: "Most freshers in Hyderabad rely on Naukri and LinkedIn — which is fine, but incomplete. Also use GreatHire (strong fresher listings), Internshala (internships that convert to full-time), Cutshort (startup roles), and company career pages directly. Target Hyderabad-specific job fairs — companies like TCS, Wipro, and Infosys hold mass recruitment drives in the city regularly. Attend TS (Telangana State) government job fairs and walk-in drives posted in local newspapers and job boards. Network within HITEC City clusters — many fresher roles are filled through referrals before they're posted publicly. Join Hyderabad-focused LinkedIn groups and Telegram communities for job alerts.",
  },
  {
    num: "04",
    title: "Track Your Applications and Improve Continuously",
    desc: "Maintain a job tracker: company name, role, location (HITEC City, Gachibowli, Madhapur, etc.), application date, interview stage, and outcome. Hyderabad has a mix of on-site and hybrid roles — track which mode each company uses. After every interview, log the questions asked and review what you could have answered better within 24 hours. If you're applying to multiple companies in the same sector (say, IT services), refine your pitch as you learn what works. Set weekly targets: X applications, Y follow-ups, Z networking connections. Most freshers who land Hyderabad jobs within 60 days do so through disciplined application tracking, not just volume.",
  },
];

const areas = [
  {
    num: "01",
    area: "HITEC City",
    type: "IT & Product",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    companies: "Microsoft, Google, Amazon, Infosys, TCS",
    desc: "The crown jewel of Hyderabad's tech ecosystem. HITEC City hosts MNC campuses and product company offices. Most high-paying fresher IT roles are concentrated here. Proximity to Madhapur and Gachibowli makes it the epicenter of Hyderabad's tech hiring.",
  },
  {
    num: "02",
    area: "Gachibowli",
    type: "MNC & Finance",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    companies: "Deloitte, HSBC, Facebook, UBS, Goldman Sachs",
    desc: "Adjacent to HITEC City, Gachibowli is home to global finance, consulting, and tech majors. Strong for freshers targeting BFSI tech roles, data analytics, and software development in financial services.",
  },
  {
    num: "03",
    area: "Madhapur",
    type: "Startups & IT Services",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    companies: "Wipro, Zensar, KPIT, Various Startups",
    desc: "Madhapur bridges HITEC City and the broader IT district. A high concentration of IT services firms and mid-sized startups actively recruit freshers here. Great for first jobs in software development, QA, support, and analytics.",
  },
  {
    num: "04",
    area: "Begumpet / Secunderabad",
    type: "BPO & Banking",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    companies: "Conduent, Mphasis, ICICI, HDFC, Axis",
    desc: "Strong BPO, banking, and back-office operations hiring. Freshers looking for non-IT tech support, customer service, or banking operations roles will find consistent openings here. Lower barrier to entry, great for building experience fast.",
  },
  {
    num: "05",
    area: "Genome Valley / Shamirpet",
    type: "Pharma & Biotech",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    companies: "Dr. Reddy's, Aurobindo, Bharat Biotech, Divi's",
    desc: "India's pharma capital for freshers from pharmacy, biotech, and life sciences backgrounds. Hyderabad's Genome Valley houses over 200 biotech and pharma companies actively hiring science graduates.",
  },
  {
    num: "06",
    area: "Nanakramguda",
    type: "Fintech & IT",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    companies: "PayU, Mphasis, NSE, ICICI Prudential",
    desc: "Emerging financial district with growing fintech presence. Companies here hire freshers for roles in software development, data analytics, and financial technology — often with slightly lower competition than HITEC City.",
  },
  {
    num: "07",
    area: "Banjara Hills / Jubilee Hills",
    type: "Media & Consulting",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    companies: "Ad agencies, media firms, boutique consulting",
    desc: "Less IT-focused, but strong for freshers in marketing, communications, media, and business consulting. Smaller firms in these areas often prefer freshers with strong soft skills and cultural awareness over pure technical backgrounds.",
  },
  {
    num: "08",
    area: "Pocharam / Uppal",
    type: "Manufacturing & IT",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    companies: "Cognizant, L&T Infotech, Tata Projects",
    desc: "Growing IT and industrial corridor in eastern Hyderabad. Lower rents attract mid-sized IT firms and manufacturing companies. Strong for freshers targeting core engineering, ERP, and IT support roles outside the premium HITEC City cluster.",
  },
];

const practices = [
  "Set your LinkedIn location to Hyderabad — city-based recruiters filter by location first.",
  "Attend Hyderabad-specific walk-in drives and job fairs announced on Naukri and local Telegram groups.",
  "Apply on GreatHire, Internshala, and Cutshort in addition to Naukri and LinkedIn for fresher roles.",
  "Network in HITEC City communities — many roles are filled by referral before public posting.",
  "Research commute and hybrid policies before applying — Hyderabad traffic is real, and location matters.",
  "Follow Hyderabad IT company pages on LinkedIn and turn on job alerts for instant notification.",
];

const mistakes = [
  "Only applying on Naukri — missing GreatHire, Cutshort, Internshala, and direct company portals.",
  "Not updating LinkedIn location to Hyderabad — city recruiters won't find you in searches.",
  "Ignoring walk-in drives and job fairs — major companies fill hundreds of fresher roles this way.",
  "Applying for roles across all zones without filtering by commute feasibility or hybrid availability.",
  "No Hyderabad-specific networking — not joining local LinkedIn groups or Telegram job communities.",
  "Skipping pharma, BPO, and BFSI sectors — Hyderabad has strong non-pure-IT fresher demand too.",
];

const faqs = [
  {
    q: "Which area in Hyderabad has the most IT jobs for freshers?",
    a: "HITEC City, Gachibowli, and Madhapur form the core IT triangle with the highest concentration of fresher IT roles. Microsoft, Google, Amazon, Infosys, TCS, Wipro, and hundreds of startups are clustered here. For non-IT roles, Begumpet, Secunderabad, and Banjara Hills offer consistent opportunities.",
  },
  {
    q: "What is the average fresher salary in Hyderabad in 2026?",
    a: "Entry-level IT roles in Hyderabad typically range from ₹3–6 LPA depending on company type and role. Product companies (Google, Microsoft, Amazon) pay ₹8–20 LPA even for freshers. IT services (TCS, Infosys, Wipro) typically offer ₹3–4.5 LPA. Non-IT roles like BPO and banking start at ₹2.5–3.5 LPA.",
  },
  {
    q: "What are the best platforms to find fresher jobs in Hyderabad?",
    a: "Use GreatHire for fresher-specific listings, Naukri for volume, LinkedIn for networking and referrals, Internshala for internships that convert to full-time, Cutshort for startup roles, and company career pages for direct applications. Hyderabad-specific Telegram groups and LinkedIn communities also post real-time walk-in and job alerts.",
  },
  {
    q: "Do Hyderabad companies prefer local candidates or hire pan-India?",
    a: "It varies by company type. Large MNCs and IT services firms hire pan-India and provide relocation support. Mid-sized startups and local companies often prefer candidates already based in Hyderabad or willing to relocate at their own cost. Setting your LinkedIn location to Hyderabad and mentioning your willingness to relocate immediately in your resume helps significantly.",
  },
  {
    q: "Are there walk-in drives for freshers in Hyderabad?",
    a: "Yes — Hyderabad has one of the highest frequencies of walk-in drives in India. TCS, Wipro, Infosys, Cognizant, and various BPO and BFSI firms regularly conduct mass recruitment drives. Follow their LinkedIn pages, check Naukri's walk-in section filtered to Hyderabad, and join local Telegram job groups for real-time alerts.",
  },
  {
    q: "Can non-CS/IT freshers find jobs in Hyderabad?",
    a: "Absolutely. Hyderabad's pharma and biotech sector (Genome Valley) actively hires science and pharma graduates. The BFSI sector hires commerce and finance graduates. BPO and customer service roles are open to all backgrounds. IT roles like Manual QA, Business Analyst, and Technical Support are also accessible to non-CS graduates with relevant skills.",
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
        <span className={`text-cyan-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HyderabadJobsBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-cyan-600 via-cyan-700 to-teal-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-cyan-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-cyan-200 text-sm">
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
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Looking for <strong className="text-cyan-700">jobs in Hyderabad for freshers</strong>? You're targeting the right city. Hyderabad is one of India's fastest-growing tech hubs — home to HITEC City, Genome Valley, and a booming startup ecosystem that collectively generates thousands of fresher openings every month.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide breaks down exactly where the fresher jobs are in Hyderabad, which areas to target, how to apply faster and smarter, and a proven step-by-step strategy to land your first role in the city — with or without prior work experience.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Hyderabad Is One of the Best Cities for Freshers in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Hyderabad has overtaken Pune to become India's second-largest IT employment hub. With a lower cost of living than Bangalore, growing MNC presence, government-backed infrastructure in HITEC City, and strong activity across IT, pharma, fintech, and BFSI — Hyderabad offers freshers a rare combination of opportunity and affordability.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The city's IT corridor stretches from Madhapur to Gachibowli to Nanakramguda — a 15km belt that houses over 1,500 tech companies. But knowing the geography isn't enough. Freshers who land jobs here fast do so with a targeted, city-specific strategy — not a generic job search.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guide to Finding Jobs in Hyderabad Fast</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A city-specific 4-step framework that actually works.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── KEY AREAS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Key Areas in Hyderabad Where Freshers Are Hired</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">Know your target zone before you apply — location shapes opportunity in Hyderabad.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {areas.map((area) => (
                <div key={area.num} className={`border rounded-2xl p-5 sm:p-6 ${area.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{area.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${area.badge}`}>{area.type}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{area.area}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-3">🏢 {area.companies}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{area.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: Relocated to Hyderabad and Hired in 45 Days</h2>
            <div className="bg-gradient-to-br from-cyan-600 to-teal-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">K</div>
                <div>
                  <p className="font-bold">Karthik</p>
                  <p className="text-cyan-200 text-xs">B.Tech Graduate — Relocated from Vijayawada to Hyderabad</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Week 1–2",
                    title: "City Research",
                    desc: "Mapped HITEC City, Gachibowli, and Madhapur companies. Updated LinkedIn location to Hyderabad. Joined 3 local Telegram job groups. Identified 30 target companies with active fresher listings.",
                  },
                  {
                    month: "Week 3–4",
                    title: "Targeted Applications",
                    desc: "Applied on GreatHire, Naukri, and LinkedIn with Hyderabad filter. Attended 2 walk-in drives at Madhapur. Connected with 15 Hyderabad-based recruiters on LinkedIn. Got 4 interview calls.",
                  },
                  {
                    month: "Week 5–6",
                    title: "Hired ✓",
                    desc: "Converted 2 of 4 interviews into final rounds. Received an offer from a mid-sized IT services firm in Madhapur at ₹3.8 LPA. Joined within 2 weeks. Total time: 45 days from relocation.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-cyan-200 text-xs font-bold uppercase tracking-wider mb-1">{m.month}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-cyan-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-cyan-100 text-sm italic border-t border-white/20 pt-4">
                "He didn't know anyone in Hyderabad. A city-specific strategy — the right platforms, location targeting, and walk-in drives — did the work that generic job searching never could."
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
              Hyderabad's job market for freshers in 2026 is large, diverse, and genuinely accessible — if you approach it with a city-specific strategy. Know your target zones, use the right platforms, attend walk-in drives, update your LinkedIn location, and network within local communities. Don't treat it like a generic all-India job search. Hyderabad rewards freshers who show up prepared and focused.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Pick your area, target the right companies, and apply with intent — Hyderabad has a role waiting for you.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Find Your Job in Hyderabad?</h2>
            <p className="text-cyan-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Explore thousands of fresher-friendly openings across HITEC City, Gachibowli, Madhapur, and beyond — filtered for Hyderabad, updated daily.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-cyan-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-cyan-50 transition-colors shadow-lg"
            >
              Explore Hyderabad Jobs on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}