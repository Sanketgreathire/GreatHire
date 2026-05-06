import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "How to Crack Your First HR Interview",
  subtitle: "Fresher's Complete Guide",
  date: "May 06, 2026",
  readTime: "10 min read",
  category: "Interview Prep",
  keywords: [
    "HR interview questions for freshers",
    "how to crack HR interview",
    "first HR interview tips",
    "fresher HR interview 2026",
    "common HR interview questions",
    "HR interview preparation India",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and What HR Interviews Are Really About",
    desc: "Most freshers think HR interviews are just formalities after technical rounds. They're not. HR rounds assess your personality, communication style, attitude, cultural fit, and whether you're the kind of person the company wants to invest in. Research the company — their values, product, culture, recent news. Read the job description carefully and understand what the role needs from you. Study 15–20 common HR questions and understand the intent behind each one. HR is evaluating: Do I want to work with this person?",
  },
  {
    num: "02",
    title: "Build Your Answer Framework and Self-Awareness",
    desc: "Prepare structured answers using the STAR method (Situation, Task, Action, Result) for behavioral questions. Know your resume inside out — every line should be something you can speak to for 2 minutes. Develop clear, honest answers for the classics: Tell me about yourself, your strengths/weaknesses, why this company, where do you see yourself in 5 years. Practice articulating your academic projects and internships in ways that demonstrate value, not just activity. Self-awareness — knowing what you're good at and where you're growing — is one of the most impressive qualities in a fresher.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools for Interview Practice",
    desc: "Don't just read answers — practice speaking them out loud. Record yourself answering common HR questions and review: pace, eye contact, filler words, body language. Use mock interview platforms like Pramp, Interviewing.io, or ask a friend to conduct a practice round. Dress appropriately (check company culture), join the call or arrive 5 minutes early, and have thoughtful questions ready for the HR. Treat each real interview as practice too — log what you were asked, how you answered, and what to improve.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "After each interview, write down every question asked and how you answered it — within 24 hours. Identify which questions caught you off-guard and prepare better answers for them. Track patterns: if you're consistently struggling with 'Tell me about a time you failed' or salary negotiation, those become your priority areas. Set targets: practice 5 new questions weekly, do 1 mock interview per week until you feel genuinely confident. Each HR round, whether you pass or not, is data — treat it that way.",
  },
];

const questions = [
  {
    num: "01",
    question: "Tell me about yourself.",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Always Asked",
    tip: "Structure it: who you are → your education/background → your key skills or projects → why you're excited about this role. Keep it under 2 minutes. Don't recite your resume — tell a story. End by connecting your background to why you applied here.",
  },
  {
    num: "02",
    question: "What are your strengths and weaknesses?",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Classic Trap",
    tip: "Strengths: Pick 2 that are relevant to the role and back each with a specific example. Weaknesses: Be genuine — pick a real weakness you're actively improving. Never say 'I'm a perfectionist' or 'I work too hard.' That answer is transparent and irritating to experienced HRs.",
  },
  {
    num: "03",
    question: "Why do you want to work at this company?",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Research Test",
    tip: "Never say 'It's a good company' or 'Good salary.' Show you've done your homework: mention the company's product, culture, growth, recent news, or something that genuinely excited you. Tie it to your own goals. This is your chance to show you actually want this role, not just any role.",
  },
  {
    num: "04",
    question: "Where do you see yourself in 5 years?",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    badgeLabel: "Ambition Check",
    tip: "Show ambition without making them feel you'll leave in 6 months. Frame it around growing in your domain, taking on more responsibility, and contributing meaningfully. Align your 5-year vision loosely with the kind of career path the company enables. Avoid mentioning 'starting my own company' unless it's genuinely relevant.",
  },
  {
    num: "05",
    question: "Tell me about a challenge you faced and how you overcame it.",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "STAR Moment",
    tip: "Use the STAR method: Situation → Task → Action → Result. Pick a real example — academic project problem, team conflict, missed deadline. Focus on what you personally did, the decision you made, and what you learned. HRs want to see how you think under pressure, not that you never face problems.",
  },
  {
    num: "06",
    question: "What are your salary expectations?",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Negotiation",
    tip: "Research the market rate for the role and city (Naukri, Glassdoor, AmbitionBox). Give a range, not a single number, based on your research. For freshers, saying 'I'm open to the company's standard fresher package for this role, and I'd love to understand the full compensation structure' is completely acceptable.",
  },
  {
    num: "07",
    question: "Do you have any questions for us?",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Your Turn",
    tip: "Always have 2–3 thoughtful questions ready. Good options: 'What does success look like in this role in the first 6 months?', 'What does the onboarding process look like?', 'What's one thing you love about working here?' Never say 'No, I'm good.' It signals disinterest.",
  },
  {
    num: "08",
    question: "Why should we hire you?",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Closing Shot",
    tip: "This is your 60-second pitch. Combine your top 2 skills + 1 relevant project or achievement + your attitude/eagerness to contribute. Be specific, be confident, and tie it to what the role needs. Avoid generic answers like 'I'm a hard worker and a team player.' Everyone says that.",
  },
];

const practices = [
  "Practice out loud, not just in your head — speaking an answer is different from thinking it.",
  "Research the company deeply before every interview — products, culture, recent news.",
  "Prepare a clear, engaging 'Tell me about yourself' answer and refine it with each round.",
  "Have 2–3 thoughtful questions ready for the HR every time.",
  "Dress appropriately and join on time — first impressions form in seconds.",
  "Send a short thank-you email within 24 hours of the interview if possible.",
];

const mistakes = [
  "Giving vague, rehearsed answers without concrete examples or specifics.",
  "Not researching the company — saying 'You're a good company' is a red flag.",
  "Badmouthing previous internships, colleges, or professors — always a dealbreaker.",
  "Saying 'I don't have any questions' at the end — it signals disinterest.",
  "Lying about skills or experiences on your resume — HRs and follow-up rounds will expose it.",
  "Being unprepared for salary questions — research the market before every interview.",
];

const faqs = [
  {
    q: "What is the most important thing to prepare for an HR interview as a fresher?",
    a: "Your 'Tell me about yourself' answer and your understanding of the company. These two things set the tone for the entire conversation. A confident, structured self-introduction and genuine company research immediately separate you from unprepared candidates.",
  },
  {
    q: "How do I answer 'Tell me about yourself' as a fresher with no work experience?",
    a: "Structure it as: who you are → education and key academic focus → skills and projects you've built → what you're looking for in your first role. Keep it under 2 minutes. Mention 1–2 specific projects or achievements. End by connecting to why you're excited about this company.",
  },
  {
    q: "Should I be honest about my weaknesses in an HR interview?",
    a: "Yes — but strategically. Choose a real weakness you're genuinely working to improve, explain what you're doing to address it, and show self-awareness. This demonstrates maturity and honesty. HRs can tell when you're faking a weakness like 'I work too hard.'",
  },
  {
    q: "How do I handle salary negotiation as a fresher?",
    a: "Research market rates on Naukri, Glassdoor, and AmbitionBox before every interview. Give a range (not a single number) based on your research and the role. As a fresher, it's acceptable to say you're open to the company's standard package while asking about the full compensation structure including bonuses or growth.",
  },
  {
    q: "What should I do if I don't know the answer to an HR question?",
    a: "Be honest. Saying 'I haven't faced that situation yet, but here's how I'd approach it' is far better than making something up. HRs value honesty and self-awareness over perfect answers. Follow up with how you would think through the problem or handle it going forward.",
  },
  {
    q: "How many mock interviews should I do before my real HR round?",
    a: "At minimum, 3–5 mock interviews before your first real HR round. After each one, log the questions, your answers, and improvement areas. Quality of review matters more than quantity. One well-reviewed mock is worth more than five casual ones.",
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
        <span className={`text-orange-500 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HRInterviewBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-orange-100 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-orange-200 text-sm">
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
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Most freshers spend weeks preparing for technical rounds — and then walk into the{" "}
                <strong className="text-orange-600">HR interview</strong> completely underprepared. The result? Vague answers, nervous energy, and offers that slip away despite strong technical performance.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide covers the most common <strong className="text-orange-600">HR interview questions for freshers</strong>, exactly how to answer them, a step-by-step preparation framework, and real tips that actually work — so you walk in confident and walk out with an offer.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why HR Interviews Matter More Than Most Freshers Realize
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In 2026, HR rounds are no longer box-ticking exercises. They're genuine cultural fit assessments. Companies invest months training freshers — they want to make sure they're hiring someone who communicates well, handles pressure gracefully, and fits the team. Many candidates who clear technical rounds lose offers in HR because of poor self-presentation, lack of company research, or dishonest answers that get exposed.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The good news: HR interviews are highly predictable. The same 15–20 questions appear in over 80% of fresher rounds. Prepare them well, practice them out loud, and you'll consistently convert offers while your peers wonder what went wrong.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance to Crack Your HR Interview</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to go from unprepared to offer-ready.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── TOP QUESTIONS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Most Common HR Interview Questions for Freshers (+ How to Answer)</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">These questions appear in over 80% of fresher HR rounds — prepare every single one.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {questions.map((q) => (
                <div key={q.num} className={`border rounded-2xl p-5 sm:p-6 ${q.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{q.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${q.badge}`}>{q.badgeLabel}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">"{q.question}"</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{q.tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: From Nervous Fresher to Confident Offer-Getter in 30 Days</h2>
            <div className="bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">R</div>
                <div>
                  <p className="font-bold">Riya</p>
                  <p className="text-orange-200 text-xs">B.Tech Graduate — Failed 3 HR Rounds in a Row</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Week 1–2",
                    title: "Diagnosis",
                    desc: "Identified the problem: she was technically strong but crumbled in HR. Logged the 3 interviews she'd failed. Pattern: vague answers, no company research, said 'I don't have questions' every time.",
                  },
                  {
                    month: "Week 3",
                    title: "Preparation",
                    desc: "Prepared structured answers for 20 common HR questions using STAR. Researched each company she was applying to. Recorded herself answering and fixed filler words. Did 3 mock rounds with a friend.",
                  },
                  {
                    month: "Week 4",
                    title: "Offer ✓",
                    desc: "Applied to 12 companies. Got 5 HR calls. Converted 3 into final-round interviews. Received 2 offers. Joined an IT services company as a Software Trainee. HR round was no longer her weak link.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-orange-200 text-xs font-bold uppercase tracking-wider mb-1">{m.month}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-orange-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-orange-100 text-sm italic border-t border-white/20 pt-4">
                "The technical skills were always there. Once she fixed her HR preparation, the offers followed almost immediately."
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
              Cracking your first HR interview as a fresher isn't about being perfect — it's about being prepared, genuine, and self-aware. Study the common questions, build structured answers, research every company you apply to, and practice out loud until your answers feel natural rather than rehearsed. The HR round rewards freshers who know themselves, communicate clearly, and show genuine interest in the role.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Prepare once, prepare well — and watch the HR round become your strongest asset, not your biggest fear.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Land Your First Job?</h2>
            <p className="text-orange-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Explore thousands of fresher-friendly openings across IT, business, data, and more — and walk into every HR round prepared to convert.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-orange-600 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-lg"
            >
              Explore Fresher Jobs on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}