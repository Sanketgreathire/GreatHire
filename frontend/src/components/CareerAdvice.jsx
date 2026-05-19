import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

/* ─────────────────────────────────────────────
   BLOG DATA
───────────────────────────────────────────── */
const blogs = [
  {
    id: 1,
    title: "Effective Job Interview Strategies",
    subtitle: "",
    category: "Interview Tips",
    date: "Jan 12, 2025",
    readTime: "5 min read",
    image: "/interview_tips_01.webp",
    intro: `Most freshers spend weeks preparing for technical rounds — and then walk into the HR interview completely unprepared. The result? Legal answers, nervous energy, and offers that slip away despite strong technical performance.\n\nThis guide covers the most common HR interview questions for freshers, exactly how to answer them, a step-by-step preparation framework, and real tips that actually work — so you walk in confident and walk out with an offer.`,
    whySection: {
      heading: "Why HR Interviews Matter More Than Most Freshers Realize",
      content: `In 2026, HR rounds are no longer box-ticking exercises. They're genuine cultural-fit assessments. Companies invest months training freshers — they want to make sure they're hiring someone who communicates well, handles pressure gracefully, and fits the team. Many candidates who clear technical rounds get rejected in HR because of poor self-presentation, lack of company research, or rehearsed answers that get exposed.\n\nThe good news: HR questions are highly predictable. The same 15–20 questions appear in over 80% of fresher rounds. Prepare them well, practice them out loud, and you'll consistently convert offers while your peers wonder what went wrong.`,
    },
    steps: [
      {
        number: 1,
        color: "#F97316",
        title: "Understand the Basics and What HR Interviews Are Really About",
        content: `Most freshers think HR interviews are just formalities after technical rounds. They're not. HR rounds assess your personality, communication style, attitude, cultural fit, and whether you're the kind of person the company wants to invest in. Research the company — their values, product, culture, recent news. Read the job description carefully and understand the role. Prepare answers to 15–20 standard HR questions and understand the intent behind each one. HR is evaluating: Do I want to work with this person?`,
      },
      {
        number: 2,
        color: "#8B5CF6",
        title: "Build Your Answer Framework and Self-Awareness",
        content: `Prepare structured answers using the STAR method (Situation, Task, Action, Result). For behavioural questions, know your resume inside-out — every project should be something you can speak to for 2 minutes. Develop clear, honest answers for the classics: Tell me about yourself, your strengths/weaknesses, why this company, where do you see yourself in 5 years. Practice connecting your academic projects and internships to ways that demonstrate value, not just activity. Self-awareness — knowing what you're good at and where you're growing — is one of the most impressive qualities in a fresher.`,
      },
      {
        number: 3,
        color: "#10B981",
        title: "Apply Strategies and Tools for Interview Practice",
        content: `Don't just read answers — practice speaking them out loud. Record yourself answering common HR questions and review your eye contact, filler words, body language. Use mock interview platforms like Pramp, Interviewmocha, or ask a friend to conduct a practice round. Dress appropriately. Check company culture, join the call or arrive 5 minutes early, and have thoughtful questions ready for the HR. Treat each mock interview as practice too — log what you were asked, how you answered, and what to improve.`,
      },
      {
        number: 4,
        color: "#3B82F6",
        title: "Track Progress and Improve Continuously",
        content: `After each interview, write down every question asked and how you answered it — within 24 hours. Identify which questions caught you off guard and prepare better answers for them. Track patterns: if you're consistently struggling with "Tell me about a time you failed" or salary negotiations, those become your priority areas. Set targets: practice 5 new questions weekly, do 1 mock interview per week until you feel genuinely confident. Each HR round, whether you pass or not, is data — treat it that way.`,
      },
    ],
    questionsSection: {
      heading: "8 Most Common HR Interview Questions for Freshers (+ How to Answer)",
      subheading: "These questions appear in over 80% of fresher HR rounds — prepare every single one.",
      questions: [
        {
          q: '"Tell me about yourself."',
          tag: "Always Asked",
          tagColor: "#3B82F6",
          content: `Describe who you are, your educational background, and your key skills in about 90 seconds. Cover your role situation briefly, your education/background, your relevant skills and one standout project, and how you're excited to bring that to this role. Avoid reciting your resume — make it conversational and let your background lead naturally to why you applied here.`,
        },
        {
          q: '"What are your strengths and weaknesses?"',
          tag: "Classic Trap",
          tagColor: "#EF4444",
          content: `Strengths: Pick 2–3 that are relevant to the role and back each with a real example. Don't say "I'm a hard worker" — say "I'm good at breaking down complex problems. In Research, I built a tool that cut data processing time by 40%." Weakness: be real. Pick something you've already started improving and explain your progress clearly. You've already improving them is what an interviewer wants to hear.`,
        },
        {
          q: '"Why do you want to work at this company?"',
          tag: "Research Test",
          tagColor: "#F97316",
          content: `Don't say "It's a good company" or "Good salary." Show that you've done your homework: the company's culture, growth, recent news, or impact on the industry. Tie this to your personal goals. "I've been following your fintech products for a year, and I admire how you're building financial access tools. That aligns closely with my interest in building tech that matters, not just products."`,
        },
        {
          q: '"Where do you see yourself in 5 years?"',
          tag: "Ambition Check",
          tagColor: "#10B981",
          content: `Give a genuine answer to growth in your chosen domain. Show ambition, but tie it loosely with the company's mission. Mention learning, leading in a specialty, taking on responsibility. This is your plan — show that you have one. Avoid saying "I want to start my own company" (in most cases) unless there's specific reason to believe this would resonate with the hiring manager.`,
        },
        {
          q: '"Tell me about a challenge you faced and how you overcame it."',
          tag: "STAR Moment",
          tagColor: "#8B5CF6",
          content: `Use the STAR method: Situation — set the context. Task — what was your responsibility. Action — what specific steps did you take (this is the meat — spend 60% of your time here). Result — what happened. Pick a real story, ideally from college projects or internships. Don't pick a challenge that makes you look reckless. Pick one where the difficulty shows what you're actually like under pressure.`,
        },
        {
          q: '"What are your salary expectations?"',
          tag: "Negotiation",
          tagColor: "#F59E0B",
          content: `Research the market rate for this role, this company's size, and the city. Give a range, not a single number. "Based on my research, for this role in this city, the range is ₹3.5–5 LPA. Given my skills and background, I'd aim for something in that range. I'm also open to discussing the total package." Don't lead with a number that's impossibly high. Know your minimum and your ideal — and know the difference.`,
        },
        {
          q: '"Do you have any questions for us?"',
          tag: "Your Turn",
          tagColor: "#06B6D4",
          content: `Always have 3 thoughtful questions ready. Good options: What does day-to-day growth look like in this role? How do teams give feedback to each other here? What's the onboarding experience for freshers? What would make someone extraordinary in this position within the first 6 months? Never say "No, I think everything is covered." It signals disinterest and a lack of critical thinking, which undercuts the whole interview.`,
        },
        {
          q: '"Why should we hire you?"',
          tag: "Closing Pitch",
          tagColor: "#EC4899",
          content: `This is your 45-second pitch. Structure it in 3 parts: 1 — I have the core skill set you need (name 2–3 relevant strengths). 2 — I have demonstrated these through real examples (name one project or result). 3 — I'm excited about this specific company and I'm ready to grow here. Don't be arrogant. Don't be vague. Be specific, be confident, and show that you're aware of what they're looking for and that you can deliver it.`,
        },
      ],
    },
    realExample: {
      heading: "Real Example: From Nervous Fresher to Confident Offer-Getter in 30 Days",
      person: "Riya",
      subtitle: "B.Tech CSE, 2025 Graduate · No prior internship experience",
      steps: [
        { label: "Week 1", title: "Research & Prep", detail: "Riya mapped 15 target companies, studied each company's mission, products, and culture, and prepared answers to 20 HR questions tailored to each." },
        { label: "Week 2", title: "Mock Practice", detail: "She practiced 2 mock interviews weekly with peers, recorded herself, identified filler words and improved clarity and pacing substantially." },
        { label: "Week 3", title: "Live Applications", detail: "She applied to 25 companies on GreatHire and LinkedIn with tailored resumes and cover notes. She got 8 HR interview calls." },
        { label: "Week 4", title: "Offer Received", detail: "After 5 HR interviews, Riya received 2 offers. She accepted a role at a Bangalore-based SaaS startup at ₹4.8 LPA." },
      ],
      quote: `"The interviews didn't feel scary anymore. I had a clear answer for every question they asked. I offer free mock interview prep to my batch now."`,
    },
    bestPractices: [
      "Practice out loud, not just in your head — speaking and thinking are very different skills.",
      "Research the company: read about their product, culture, recent news, and what the role specifically requires.",
      "Prepare 2–3 thoughtful questions to ask the interviewer — it signals genuine interest and curiosity.",
      "Send a personalised thank-you email within 24 hours of every HR interview you attend.",
    ],
    commonMistakes: [
      "Being vague, clichéd answers without examples, concepts remaining at theoretical, abstract level.",
      "Not researching the company — 'I like this company because it's reputed' is a red flag.",
      "Overthinking the weakness question — choose one, own it, and explain what you've done to improve.",
      "Saying no when asked if you have any questions — always prepare at least 2 relevant questions.",
    ],
    faqs: [
      { q: "What is the most important thing to prepare for an HR interview as a fresher?", a: "Self-awareness and company research. Know your strengths, your story, and why this specific company — backed by actual knowledge of the company's product, mission, and team culture." },
      { q: "How do I answer 'Tell me about yourself' as a fresher with no work experience?", a: "Lead with your education, your key skills or projects, one achievement you're proud of, and your excitement for this role. Keep it under 90 seconds. Practice it until it feels natural, not rehearsed." },
      { q: "Should I be honest about my weaknesses in an HR interview?", a: "Yes — but strategically honest. Pick a real weakness you've already been actively working to improve, and explain the progress you've made. Honesty, paired with growth, is impressive." },
      { q: "How do I handle salary negotiation as a fresher?", a: "Research the market rate for the role in your city, give a range instead of a fixed number, and anchor it to your skills and projects — not to your expenses or desires. Always know your minimum before you walk in." },
      { q: "What should I do if I don't know the answer to an HR question?", a: "Pause, think briefly, and give the most honest and structured answer you can. It's acceptable to say: 'That's a good question — let me think for a moment.' Silence used thoughtfully is far better than a flustered, rambling answer." },
      { q: "How many mock interviews should I do before my real HR round?", a: "At least 3–5 structured mock interviews before your first real round. Each one should be recorded, reviewed, and followed by targeted improvement in the areas where you hesitated or gave weak answers." },
    ],
    conclusion: `Cracking your first HR interview is not about being perfect — it's about being prepared, genuine, and self-aware. Study the common questions, build structured answers, research every company you apply to, and practice out loud until your answers feel natural rather than rehearsed. The freshers who get offers are not the most talented — they're the most prepared.\n\nPrepare once, prepare well — and watch the HR round become your strongest asset, not your biggest fear.`,
    cta: {
      heading: "Ready to Land Your First Job?",
      sub: "Explore thousands of fresher-friendly openings across IT, Business, Data, and more — and walk into every HR round fully prepared.",
      btn: "Explore Fresher Jobs on GreatHire",
    },
    keyTakeaways: [
      "HR interviews assess personality, cultural fit, and communication — not just technical skills.",
      "The same 15–20 questions appear in over 80% of fresher HR rounds — prepare every one.",
      "Use the STAR method (Situation, Task, Action, Result) for all behavioural questions.",
      "Research the company deeply: their product, mission, culture, and recent news.",
      "Always have 3 thoughtful questions ready to ask the interviewer.",
      "Send a thank-you email within 24 hours of every HR interview.",
    ],
  },
  {
    id: 2,
    title: "Post-Interview Follow-Up",
    subtitle: "How to Stand Out After Every Interview",
    category: "Interview Tips",
    date: "Jan 18, 2025",
    readTime: "4 min read",
    image: "/interview_tips_02.webp",
    intro: `Most candidates walk out of an interview, cross their fingers, and wait. The ones who get offers do one more thing — they follow up. A well-crafted post-interview follow-up is one of the most underused, highest-impact tools in a job seeker's arsenal.\n\nThis guide covers exactly what to do after every interview: when to follow up, what to write, how to handle silence, and how to turn a "maybe" into a "yes" through professional, well-timed communication.`,
    whySection: {
      heading: "Why the Follow-Up Is More Powerful Than Most Candidates Realize",
      content: `Interviewers meet dozens of candidates. By the time they sit down to make a decision, most faces have blurred together. A thoughtful follow-up email — sent within 24 hours — puts your name back in front of the decision-maker at exactly the right moment.\n\nMore than a courtesy, a strong follow-up signals three things companies actively value: communication skills, attention to detail, and genuine interest in the role. In competitive fresher hiring where candidates look similar on paper, this small action can be the differentiator that tips a close decision in your favour.`,
    },
    steps: [
      {
        number: 1,
        color: "#F97316",
        title: "Understand What a Follow-Up Is — and What It Isn't",
        content: `A post-interview follow-up is a brief, professional email sent within 24 hours of your interview. It thanks the interviewer for their time, briefly reinforces your interest and fit for the role, and keeps the conversation warm. It is not a pitch for why they should hire you, a demand for an update, or a lengthy email that rehashes everything you said in the interview. Think of it as a professional handshake at the door — short, warm, and purposeful.`,
      },
      {
        number: 2,
        color: "#8B5CF6",
        title: "Build Your Follow-Up Email — Structure and Content",
        content: `Your follow-up email needs four things: a clear subject line (e.g. "Thank you — [Your Name] | [Role]"), a warm opening that thanks the interviewer by name, one or two sentences that connect a specific moment from the interview to your enthusiasm for the role, and a brief, confident close. Reference something real — a problem they mentioned, a project they described, a value they shared. This proves you were genuinely engaged, not just going through the motions. Keep the whole email under 150 words.`,
      },
      {
        number: 3,
        color: "#10B981",
        title: "Apply the Right Timing and Tone for Each Situation",
        content: `Send your thank-you email within 24 hours of the interview — ideally the same evening or the next morning. If you interviewed with multiple people, send a separate, personalised email to each one (don't CC everyone on the same message). If they said they'd get back to you by a specific date and that date passes with no word, send a polite check-in 2 business days later. Keep the tone warm but professional throughout — never pushy, never desperate, never casual.`,
      },
      {
        number: 4,
        color: "#3B82F6",
        title: "Track Follow-Ups and Handle All Outcomes Professionally",
        content: `Log every follow-up in your job search tracker: when you sent it, who you sent it to, and what response (if any) you received. If you get a rejection, reply graciously — thank them for the process, express that you remain interested in the company, and ask if they'd be open to sharing feedback. Many candidates have been reconsidered for future roles specifically because of how professionally they handled a no. Every interaction is a long-term relationship — treat it that way.`,
      },
    ],
    questionsSection: {
      heading: "6 Follow-Up Situations Every Fresher Will Face (+ What to Do)",
      subheading: "Handle each of these correctly and you'll stand out from 90% of candidates.",
      questions: [
        {
          q: "The standard thank-you email after an interview",
          tag: "Most Common",
          tagColor: "#3B82F6",
          content: `Send within 24 hours. Subject: "Thank you — [Your Name] | [Role]." Open with gratitude, reference one specific moment from the interview, restate your interest in 1–2 sentences, and close with a confident sign-off. Keep it under 150 words. One email per interviewer — personalised, not copied.`,
        },
        {
          q: "Following up when they said they'd contact you by a date — and didn't",
          tag: "Handle Carefully",
          tagColor: "#F97316",
          content: `Wait 2 business days past the date they mentioned. Then send a brief check-in: "I wanted to follow up on my application for [role]. I remain very interested and wanted to check if there are any updates on the timeline." Keep it one paragraph. Don't express frustration — delays are normal and often have nothing to do with you.`,
        },
        {
          q: "Following up when you have another offer and need a decision",
          tag: "Time-Sensitive",
          tagColor: "#EF4444",
          content: `Be honest and professional. Email: "I've received another offer with a deadline of [date] and want to be transparent with you. [Company] remains my first choice. I wanted to check if a decision is possible by that date." This is professional, not pushy. Most hiring managers respect candidates who communicate clearly.`,
        },
        {
          q: "Responding to a rejection email",
          tag: "Underused Move",
          tagColor: "#10B981",
          content: `Reply within 24 hours: "Thank you for letting me know. I genuinely enjoyed learning about the team and the role. I would welcome any feedback on my candidacy if you're able to share it — it would help me improve." This leaves a strong impression and occasionally opens doors to future roles or referrals.`,
        },
        {
          q: "Following up after a panel or group interview",
          tag: "Multi-Person",
          tagColor: "#8B5CF6",
          content: `Send a separate, personalised thank-you to each interviewer. Reference something specific from your conversation with each person individually — a question they asked, a topic they raised. Do not send one email CC'd to everyone. This level of personalisation is rare and noticed.`,
        },
        {
          q: "Following up after a recruiter screening call",
          tag: "Easy Win",
          tagColor: "#F59E0B",
          content: `Many candidates skip this — which is exactly why you shouldn't. A brief thank-you after a recruiter screen signals professionalism and enthusiasm. The recruiter is often the first person who advocates for you internally. Making them feel valued is a small effort with a potentially large return.`,
        },
      ],
    },
    realExample: {
      heading: "Real Example: How a Thank-You Email Turned a Rejection Into an Offer",
      person: "Sneha",
      subtitle: "MBA Fresher, Mumbai · Applied for Marketing Analyst Role",
      steps: [
        { label: "Day 1", title: "Interview Done", detail: "Sneha completed a panel interview with 3 people. She took notes during the call — specific topics each interviewer raised, questions they asked, problems they mentioned." },
        { label: "Day 1 Evening", title: "3 Emails Sent", detail: "She sent a separate, personalised thank-you to each interviewer within 6 hours. Each email referenced something specific that person had said during the interview." },
        { label: "Day 10", title: "Rejection Received", detail: "She received a rejection email. She replied graciously, thanked them, and asked if they could share any feedback on her candidacy." },
        { label: "Day 18", title: "Offer Called", detail: "The hiring manager called back — a different role had opened up and Sneha was their first call because of how professionally she'd handled the rejection. She accepted at ₹5.2 LPA." },
      ],
      quote: `"I almost didn't reply to the rejection email. Replying graciously — and asking for feedback — was the single best thing I did in that entire job search."`,
    },
    bestPractices: [
      "Send your thank-you email the same evening or within 24 hours — timing signals urgency and professionalism.",
      "Reference something specific from the interview in every follow-up — generic emails are worse than no email.",
      "Send separate, personalised emails to each interviewer when there are multiple — never one CC'd message.",
      "Always reply to rejections graciously and ask for feedback — it keeps doors open and builds your reputation.",
    ],
    commonMistakes: [
      "Sending a follow-up that's too long — more than 150 words signals poor communication skills.",
      "Using a generic template without any personalisation — interviewers can tell immediately and it backfires.",
      "Following up too frequently — one email after the interview, one check-in if the deadline passes. That's it.",
      "Never following up at all — silence after an interview leaves a weak impression and misses a key opportunity.",
    ],
    faqs: [
      { q: "How soon should I send a thank-you email after an interview?", a: "Within 24 hours — ideally the same evening. The sooner it arrives, the more it reinforces your enthusiasm and the fresher the interview context is in the interviewer's mind." },
      { q: "What should I include in a post-interview thank-you email?", a: "A clear subject line, gratitude for their time, one specific reference to something discussed in the interview, a one-sentence restatement of your enthusiasm for the role, and a brief professional close. Keep it under 150 words." },
      { q: "Should I follow up if they said they'd contact me and haven't?", a: "Yes — but wait 2 business days past the date they mentioned before following up. Send a single, brief, warm check-in. Don't send multiple messages and don't express frustration." },
      { q: "Is it okay to follow up after a rejection?", a: "Absolutely — and most candidates don't, which makes it even more impactful. Reply graciously, thank them for the process, and ask if they can share any feedback. This small action has led to callbacks and future offers for many candidates." },
      { q: "What if I forgot to follow up immediately after the interview?", a: "Send it anyway. A follow-up email 2–3 days after the interview is better than no follow-up at all. Briefly acknowledge the slight delay if you wish — 'I wanted to make sure I sent a proper thank-you' — and keep the rest of the email focused and professional." },
      { q: "Should I follow up after a recruiter call, not just after a formal interview?", a: "Yes. A brief thank-you after a recruiter screening call is rare and appreciated. Recruiters often advocate for candidates internally — making them feel valued with a short, warm note is a low-effort, high-return action." },
    ],
    conclusion: `The follow-up is the part of the interview process that most candidates skip or get wrong. Done well, it reinforces your candidacy, signals professionalism, and keeps your name top-of-mind at exactly the moment hiring decisions are being made.\n\nOne thoughtful email. Under 150 words. Sent within 24 hours. It takes 10 minutes — and it can make the difference between a close call going your way or not.`,
    cta: {
      heading: "Ready to Land Your First Job?",
      sub: "Explore thousands of fresher-friendly openings across IT, Business, Data, and more on GreatHire — and walk into every interview fully prepared.",
      btn: "Explore Fresher Jobs on GreatHire",
    },
    keyTakeaways: [
      "Send a thank-you email within 24 hours of every interview — same evening is ideal.",
      "Reference something specific from the interview — generic emails are worse than none.",
      "Send separate, personalised emails to each interviewer when there are multiple.",
      "Reply graciously to rejections and ask for feedback — it keeps doors open.",
      "Follow up with a polite check-in if the promised date passes without a response.",
      "The follow-up is a communication test — treat it with the same care as the interview itself.",
    ],
  },
  {
    id: 3,
    title: "Top Companies Hiring in 2025",
    subtitle: "Where the Jobs Are and How to Get In",
    category: "Company Insights",
    date: "Jan 25, 2025",
    readTime: "6 min read",
    image: "/company_insight_01.webp",
    intro: `Not all hiring is equal. Some companies are growing aggressively and bringing in thousands of new employees — from software engineers to supply chain managers to digital marketers. Others are quietly laying off while keeping their job boards active. Knowing which companies are genuinely hiring, and for what, gives you a significant edge in your job search.\n\nThis guide covers the top companies actively hiring in 2025, what roles they're recruiting for, and the strategies that actually get you through their hiring pipelines.`,
    whySection: {
      heading: "Why Company Research Is the Most Underrated Job Search Strategy",
      content: `Most job seekers apply to job listings without any knowledge of the company beyond its name. This is a mistake — and companies can tell. Candidates who demonstrate genuine knowledge of the company's product, culture, recent news, and team structure consistently outperform those who don't, even when they have weaker resumes.\n\nIn 2025, companies like Amazon, Google, Microsoft, and GE Aerospace are expanding significantly — but their hiring priorities have shifted. They're looking for candidates in AI, cloud infrastructure, data engineering, and cybersecurity more than ever before. Understanding these priorities lets you position your skills where demand is highest and where the competition for generalist roles is lowest.`,
    },
    steps: [
      {
        number: 1,
        color: "#F97316",
        title: "Identify Which Companies Are Actually Hiring vs. Posting",
        content: `Not every job posting represents an active hire. Companies often keep listings live as a pipeline-building exercise, during hiring freezes, or while reorganising internally. Research signals of genuine growth: recent funding rounds, new product launches, earnings reports citing headcount growth, LinkedIn employee count trends, and news of new office openings or market expansions. Companies with real momentum — not just a live careers page — are where to focus your energy.`,
      },
      {
        number: 2,
        color: "#8B5CF6",
        title: "Build Deep Knowledge of Your Target Companies",
        content: `Before applying to any company, spend 30 minutes researching: what the company's product actually does, who their customers are, what their recent challenges or growth areas are, and what they value in their team. Read their LinkedIn page, their blog, their Glassdoor reviews (not to judge but to understand culture), and their recent press coverage. This research becomes the raw material for your cover letter, your resume customisation, and your interview answers — and it immediately separates you from the majority of applicants.`,
      },
      {
        number: 3,
        color: "#10B981",
        title: "Target the Right Roles Within the Right Companies",
        content: `Large companies like Amazon, Google, and Microsoft hire across hundreds of role types — but their most aggressive hiring in 2025 is concentrated in specific areas: AI/ML engineering, cloud solutions architecture, data analytics, cybersecurity, and supply chain operations. Applying for a role that aligns with the company's publicly stated strategic priorities dramatically improves your chances. Check the company's investor presentations and CEO interviews — they explicitly name the capabilities they're building.`,
      },
      {
        number: 4,
        color: "#3B82F6",
        title: "Get Into the Pipeline — Referrals, Applications, and Persistence",
        content: `Most roles at top companies are filled through internal referrals before they're even posted publicly. Find alumni from your college who work at your target companies on LinkedIn — reach out with a specific, short message that shows you've done your research and asks for a 10-minute call, not a referral upfront. For companies without a referral connection, apply directly on their careers page and on platforms like LinkedIn and GreatHire. Follow up professionally 7–10 days after applying. Persistence, handled gracefully, signals genuine interest.`,
      },
    ],
    questionsSection: {
      heading: "Top Companies Actively Hiring in 2025 — What You Need to Know",
      subheading: "Research each company before applying — know their product, their priorities, and what they value in candidates.",
      questions: [
        {
          q: "Amazon",
          tag: "Aggressive Hiring",
          tagColor: "#F97316",
          content: `Amazon is expanding heavily in cloud (AWS), logistics automation, AI/ML, and fulfillment operations. Key roles in 2025: Software Development Engineers, Cloud Solutions Architects, Data Engineers, Operations Managers, and Supply Chain Analysts. Their hiring process includes the famous Leadership Principles interview — prepare stories for every one of the 16 principles before applying.`,
        },
        {
          q: "Google / Alphabet",
          tag: "AI-First Push",
          tagColor: "#3B82F6",
          content: `Google's 2025 hiring is concentrated in AI research, cloud infrastructure (GCP), and developer tools. Roles in high demand: ML Engineers, Site Reliability Engineers, Product Managers, and Data Scientists. Google's interview process is rigorous — prepare for algorithmic coding rounds, system design questions, and Googleyness-and-leadership interviews. Start preparing at least 6–8 weeks before applying.`,
        },
        {
          q: "Microsoft",
          tag: "AI + Cloud",
          tagColor: "#8B5CF6",
          content: `Microsoft's integration of AI across its product suite — Azure, Office 365, Copilot — is driving massive hiring in AI engineering, cloud sales, and enterprise solutions. Key roles: Azure Cloud Engineers, AI Product Managers, Business Development Managers, and Technical Support Engineers. Microsoft is also one of the most active fresher hirers in India through its MSIDC campus and Hyderabad engineering offices.`,
        },
        {
          q: "GE Aerospace",
          tag: "Engineering Growth",
          tagColor: "#10B981",
          content: `GE Aerospace is investing heavily in next-generation aircraft engines, digital aviation systems, and sustainability research. High-demand roles: Mechanical and Systems Engineers, Data Analysts for predictive maintenance, Software Engineers for avionics, and Supply Chain Specialists. GE runs dedicated graduate hiring programs — research their Edison Engineering Development Program for engineering freshers.`,
        },
        {
          q: "TCS, Infosys, Wipro (India)",
          tag: "Volume Fresher Hiring",
          tagColor: "#EC4899",
          content: `India's Big 3 IT services firms run the largest fresher hiring programs in the country — collectively hiring 50,000+ freshers annually. Roles span software development, testing, cloud support, and business analysis. Their hiring process includes aptitude tests, technical rounds, and HR interviews. Prepare thoroughly for their coding assessments — platforms like TCS iON and InfyTQ publish official preparation material.`,
        },
        {
          q: "Swiggy, Meesho, Razorpay (Indian Startups)",
          tag: "High Growth",
          tagColor: "#F59E0B",
          content: `India's high-growth startup ecosystem is actively hiring freshers in product, engineering, marketing, and operations. These companies move fast, offer steep learning curves, and often provide better early-career growth than established firms. Apply through LinkedIn, GreatHire, AngelList, and Cutshort. Startup hiring values initiative and demonstrated skills over credentials — build projects and apply with a portfolio.`,
        },
      ],
    },
    realExample: {
      heading: "Real Example: How Targeted Company Research Led to a Google Offer",
      person: "Kiran",
      subtitle: "B.Tech CS, IIT Hyderabad · Applied for Software Engineer Role at Google",
      steps: [
        { label: "6 Weeks Out", title: "Deep Research", detail: "Kiran spent 2 weeks studying Google's engineering blog, their recent AI product launches, and the 16 Leadership Principles equivalent in Google's hiring rubric before writing a single line of application." },
        { label: "4 Weeks Out", title: "Prep & Projects", detail: "He built two projects directly aligned with Google's open-source priorities, posted them on GitHub, and added them to his resume — demonstrating not just skills but contextual awareness of what Google values." },
        { label: "2 Weeks Out", title: "Alumni Referral", detail: "He connected with 3 Google employees from his college on LinkedIn. One agreed to refer him internally after a 15-minute call — which moved his application to the front of the pipeline." },
        { label: "Offer Week", title: "Offer Accepted", detail: "After 5 interview rounds, Kiran received an offer from Google's Hyderabad office. He credits 80% of his success to the research and preparation he did before ever submitting an application." },
      ],
      quote: `"Most candidates apply first and research second. I flipped that. By the time I applied to Google, I already knew more about their engineering culture than most candidates in the interview process."`,
    },
    bestPractices: [
      "Research each target company for at least 30 minutes before applying — product, culture, recent news, and strategic priorities.",
      "Look for referral opportunities through college alumni at your target companies before applying cold.",
      "Align your resume and cover letter to the company's publicly stated hiring priorities — not just the job description.",
      "Follow up professionally 7–10 days after applying — persistence handled gracefully signals genuine interest.",
    ],
    commonMistakes: [
      "Applying to hundreds of companies with the same generic resume — volume without targeting wastes everyone's time.",
      "Not preparing for company-specific interview processes — Amazon's Leadership Principles, Google's coding rounds, and Microsoft's system design questions require dedicated preparation.",
      "Ignoring referral pathways — over 50% of roles at top companies are filled through internal referrals before public posting.",
      "Chasing only the biggest brand names — high-growth startups often offer faster career progression, more responsibility, and stronger learning for freshers.",
    ],
    faqs: [
      { q: "Which companies are hiring the most freshers in India in 2025?", a: "TCS, Infosys, and Wipro collectively hire the most freshers by volume. For product companies, Microsoft, Google, and Amazon hire significant numbers in Hyderabad, Bangalore, and Pune. High-growth startups like Swiggy, Meesho, and Razorpay are also actively hiring entry-level talent." },
      { q: "How do I get a referral at a top company like Google or Amazon?", a: "Find alumni from your college who work there on LinkedIn. Send a short, specific message — reference the role you're targeting, mention something genuine about why you want to work there, and ask for a 10-minute call (not a referral upfront). Build the connection before making the ask." },
      { q: "Should I apply to big companies or startups as a fresher?", a: "Both have merit. Large companies offer brand recognition, structured training, and global exposure. Startups offer faster growth, broader responsibilities, and often steeper learning curves. The best choice depends on what you want from your first 2–3 years — deep specialisation or breadth of experience." },
      { q: "How do I prepare for Amazon's Leadership Principles interview?", a: "Read all 16 Leadership Principles on Amazon's website. For each one, prepare a real story from college, projects, or personal experience using the STAR method. Amazon interviewers will ask 2–3 behavioural questions per round — they're evaluating culture fit as much as technical skill." },
      { q: "How do I know if a company is genuinely hiring or just posting?", a: "Look for signals of real growth: recent funding, product launches, LinkedIn employee count trends, earnings reports citing headcount expansion. If a company has had recent layoffs, their active listings may be pipeline-building rather than immediate hiring. Focus on companies with visible growth momentum." },
      { q: "Is GreatHire a good platform to find jobs at top companies?", a: "Yes — GreatHire curates listings from verified employers across IT, business, data, and operations, with a strong focus on fresher and early-career roles. It's particularly useful for finding openings at mid-size and growth-stage companies that may not be on Naukri or LinkedIn's radar." },
    ],
    conclusion: `The companies hiring most aggressively in 2025 are building for an AI-driven, cloud-first future — and they need talent that understands that direction, not just candidates with degrees and test scores.\n\nDo the research. Target the right companies. Build the right skills. Get into the pipeline through referrals wherever possible. And treat every company interaction — application, interview, and follow-up — as part of a long-term professional relationship.\n\nThe jobs are there. The question is whether you're positioned to find them and prepared to win them.`,
    cta: {
      heading: "Find Your Next Opportunity on GreatHire",
      sub: "Explore curated job listings from top companies and high-growth startups across India — verified employers, fresher-friendly roles, zero noise.",
      btn: "Explore Jobs on GreatHire",
    },
    keyTakeaways: [
      "Amazon, Google, Microsoft, and GE Aerospace are aggressively hiring in AI, cloud, and engineering in 2025.",
      "TCS, Infosys, and Wipro run India's largest fresher hiring programs — prepare specifically for their processes.",
      "Over 50% of roles at top companies are filled through referrals before public posting — prioritise alumni connections.",
      "Research each company for 30+ minutes before applying — product, culture, strategic priorities, and recent news.",
      "High-growth startups like Swiggy, Meesho, and Razorpay offer faster career progression for freshers.",
      "Align your resume and skills to each company's stated strategic priorities — not just the job description.",
    ],
  },
  {
    id: 4,
    title: "Top 10 IT Jobs for Freshers in India",
    subtitle: "",
    category: "Career Advice",
    date: "May 06, 2026",
    readTime: "7 min read",
    image: "/networking_bg.webp",
    intro: `Looking for IT jobs for freshers in 2026? You're not alone — and you're in the right place. India's tech sector is adding thousands of entry-level roles this year across software development, data analytics, cloud, cybersecurity, and AI. But knowing which role to target, and how to actually land it, makes all the difference.\n\nIndia's IT industry is projected to cross $300 billion in revenue by 2026, driven by cloud adoption, AI integration, and digital transformation across banking, retail, and government. Companies like Infosys, TCS, Wipro, and hundreds of product startups are actively hiring freshers. The market is real — but it rewards candidates who have built relevant skills and understand the role they're applying for.`,
    whySection: {
      heading: "Why IT Jobs for Freshers Are More Accessible Than Ever in 2026",
      content: `India's digital economy is growing at an unprecedented pace. Government initiatives like Digital India, the explosion of startup ecosystems in Tier 2 cities, and increased offshore contracts from global enterprises have all contributed to a massive demand for entry-level IT talent.\n\nThe shift is clear: companies no longer expect freshers to arrive job-ready in every way. What they want is foundational skill, a learning mindset, and the ability to contribute meaningfully within 3–6 months. That's a bar freshers in 2026 can meet — if they prepare deliberately.`,
    },
    steps: [
      {
        number: 1,
        color: "#F97316",
        title: "Pick One Target Role and Research It Deeply",
        content: `Read 10 to 15 job descriptions for your target position. Note which skills, tools, and qualities appear most often — those repeated mentions are your priority list. Don't target five roles simultaneously. One focused role prepared deeply beats five roles prepared poorly. Each role has its own learning stack, interview style, and portfolio requirement.`,
      },
      {
        number: 2,
        color: "#8B5CF6",
        title: "Build Depth, Not Breadth — Skills and Projects",
        content: `Two or three strong, demonstrable skills beat fifteen half-finished certifications. Build real projects. A junior developer with three live GitHub projects gets more callbacks than one with five certifications and no code to show. Use freeCodeCamp, NPTEL, or Coursera audit mode to learn without spending much. For data roles, build a dashboard. For cloud, deploy a real app. For QA, write a real test suite.`,
      },
      {
        number: 3,
        color: "#10B981",
        title: "Apply Strategically Across the Right Platforms",
        content: `Target 20 to 30 companies where you have researched the product and team. Customize your resume for each role. Apply on Naukri, LinkedIn, GreatHire, Internshala, and Cutshort. One warm referral is worth twenty cold applications — reach out to alumni from your college working at target companies. Keep the message short, specific, and respectful of their time.`,
      },
      {
        number: 4,
        color: "#3B82F6",
        title: "Track Progress and Improve Based on Feedback",
        content: `Keep a spreadsheet of applications, interview stages, and feedback received. Act on every piece of feedback within 48 hours. The freshers who land jobs fastest are the ones who treat each rejection as data, not defeat. Identify patterns in where you drop off — screening, technical round, or HR — and address that stage specifically.`,
      },
    ],
    questionsSection: {
      heading: "Top 10 IT Jobs for Freshers in India (2026)",
      subheading: "These roles are actively hiring freshers — pick one, go deep, and apply with intention.",
      questions: [
        {
          q: "Junior Software Developer",
          tag: "Most In-Demand",
          tagColor: "#3B82F6",
          content: `The most sought-after fresher IT job in India. You write, test, and maintain code as part of a product or services team. Python, Java, or JavaScript are the most in-demand languages. Starting salaries range from ₹3.5 to ₹6 LPA, with high demand in Bangalore, Hyderabad, and Pune.`,
        },
        {
          q: "Data Analyst",
          tag: "Fastest Growing",
          tagColor: "#10B981",
          content: `One of the fastest-growing entry-level IT jobs in India in 2026. You help businesses make decisions using data. SQL, Excel, Python, and tools like Power BI or Tableau are key. Freshers can expect ₹3 to ₹5.5 LPA, with strong demand in fintech, e-commerce, and consulting.`,
        },
        {
          q: "Manual QA / Software Tester",
          tag: "Underrated",
          tagColor: "#8B5CF6",
          content: `Underrated but consistently in demand. If you are detail-oriented and systematic, this is one of the easiest IT jobs for freshers to break into, with a clear growth path toward automation testing. Starting salaries range from ₹2.5 to ₹4.5 LPA.`,
        },
        {
          q: "Cloud Support Associate",
          tag: "High Growth",
          tagColor: "#F97316",
          content: `Cloud is everywhere in 2026. Companies need freshers who understand AWS, Azure, or Google Cloud basics. A free cloud certification like AWS Cloud Practitioner significantly boosts your chances. Entry-level CTC ranges from ₹3 to ₹5 LPA.`,
        },
        {
          q: "Cybersecurity Analyst (Trainee)",
          tag: "Skills Shortage",
          tagColor: "#EF4444",
          content: `India faces a genuine shortage of cybersecurity professionals, making this one of the most promising IT careers for freshers in 2026. Knowledge of networking basics, ethical hacking fundamentals, and tools like Wireshark can get you in. Starting packages range from ₹3.5 to ₹6 LPA.`,
        },
        {
          q: "Frontend Web Developer",
          tag: "Portfolio-Driven",
          tagColor: "#EC4899",
          content: `A portfolio-driven role where your GitHub and live projects matter more than your degree. If you can build clean, responsive websites using HTML, CSS, JavaScript, and React, companies will hire you. Entry-level salaries range from ₹3 to ₹5.5 LPA.`,
        },
        {
          q: "Technical Support Engineer",
          tag: "Gateway Role",
          tagColor: "#06B6D4",
          content: `Often dismissed, but strategically smart. You learn the product deeply, build client-facing communication skills, and many support engineers transition into product, dev, or sales roles within two years. Freshers can earn ₹2.5 to ₹4 LPA.`,
        },
        {
          q: "DevOps Trainee",
          tag: "High Salary Growth",
          tagColor: "#F59E0B",
          content: `A steep learning curve, but DevOps salaries grow fast. Skills in Linux, Docker, CI/CD pipelines, and Git are key. If you prefer infrastructure over writing application code, this path is worth exploring. Starting CTC ranges from ₹3.5 to ₹6 LPA.`,
        },
        {
          q: "AI / ML Trainee",
          tag: "🔥 Hottest Role",
          tagColor: "#EF4444",
          content: `The hottest category in IT jobs for freshers in 2026. Entry-level roles focus on data preparation, model testing, and building simple pipelines. Python and statistics are your minimum entry ticket. Freshers can earn ₹4 to ₹7 LPA.`,
        },
        {
          q: "Business Analyst (IT / Tech)",
          tag: "Non-CS Friendly",
          tagColor: "#10B981",
          content: `You bridge the gap between tech teams and business stakeholders. Strong communication plus basic SQL and JIRA knowledge makes you a solid BA candidate right out of college. This role is also open to non-CS backgrounds. Starting salaries range from ₹3 to ₹5 LPA.`,
        },
      ],
    },
    realExample: {
      heading: "Real Example: From B.Tech Graduate to IT Job Offer in 45 Days",
      person: "Arjun",
      subtitle: "B.Tech IT, 2025 Graduate · Tier 3 College · No prior internship",
      steps: [
        { label: "Week 1–2", title: "Chose Data Analyst", detail: "Arjun read 15 Data Analyst job descriptions, identified SQL, Python, and Power BI as his priority skills, and started building on Kaggle." },
        { label: "Week 3–4", title: "Built Portfolio", detail: "He completed 2 end-to-end projects: a sales dashboard in Power BI and a customer churn analysis in Python. Both uploaded to GitHub." },
        { label: "Week 5–6", title: "Applied Strategically", detail: "Applied to 28 companies on GreatHire and LinkedIn. Got 7 interview calls by customizing his resume around each job description." },
        { label: "Week 7", title: "Offer Accepted", detail: "After 4 interviews, Arjun received 2 offers and accepted a Data Analyst role at a Pune-based fintech at ₹4.2 LPA." },
      ],
      quote: `"I stopped applying everywhere and started applying to the right places. The projects made all the difference — interviewers had something real to discuss."`,
    },
    bestPractices: [
      "Pick one role and go deep — two strong skills beat ten half-finished ones.",
      "Build real projects with visible output: GitHub, live URLs, dashboards, or notebooks.",
      "Use GreatHire, Naukri, LinkedIn, Internshala, and Cutshort for maximum fresher reach.",
      "Get one warm referral through alumni — it's worth twenty cold applications.",
    ],
    commonMistakes: [
      "Targeting five different roles simultaneously — you end up underprepared for all of them.",
      "Applying without customizing your resume — generic resumes get filtered out instantly.",
      "Waiting to feel 'fully ready' before applying — you improve fastest with real interview practice.",
      "Ignoring free certifications that signal intent: AWS Cloud Practitioner, Google Data Analytics, etc.",
    ],
    faqs: [
      { q: "Which IT job is best for freshers in India in 2026?", a: "Junior Software Developer and Data Analyst roles have the highest volume of fresher openings. AI/ML Trainee roles offer the highest starting salaries. The best role is the one that matches your existing skills and interests — go deep on one." },
      { q: "Can I get an IT job without a CS degree?", a: "Yes. Roles like Business Analyst, Technical Support Engineer, Digital Marketing (tech-side), and some QA roles actively hire non-CS graduates. The key is demonstrating relevant skills through projects and certifications." },
      { q: "What is the average fresher IT salary in India in 2026?", a: "The average ranges from ₹2.5 LPA (support/QA) to ₹7 LPA (AI/ML roles). Most software and data roles start between ₹3.5 to ₹5.5 LPA for freshers from Tier 2–3 colleges." },
      { q: "How long does it take to get a job as a fresher in IT?", a: "With consistent effort — daily skill-building, targeted applications, and active interview prep — most freshers land their first offer within 45 to 90 days of starting a focused job search." },
      { q: "Is GreatHire good for fresher IT jobs?", a: "Yes. GreatHire is curated specifically for fresher and early-career job seekers in India, with listings across IT, business, data, and operations roles from verified employers." },
    ],
    conclusion: `The IT industry in India is growing fast, and with the right focus and preparation, freshers have a genuine shot at building a rewarding tech career in 2026. The window is open — but it rewards candidates who pick one role, build deliberately, and apply with intention.\n\nStart today. Pick one role from this list. Build one skill. Apply to one company thoughtfully. Repeat until you have an offer.`,
    cta: {
      heading: "Ready to Land Your First IT Job?",
      sub: "Explore fresher-friendly IT job opportunities across India on GreatHire — curated listings, verified employers, zero noise.",
      btn: "Explore IT Jobs on GreatHire",
    },
    keyTakeaways: [
      "India's IT sector offers 10+ high-demand entry-level roles actively hiring freshers in 2026.",
      "AI/ML Trainee and Cybersecurity roles offer the highest starting salaries (₹4–7 LPA).",
      "Pick one role and build 2–3 strong, demonstrable skills rather than spreading thin.",
      "Free certifications (AWS, Google, NPTEL) significantly boost your shortlisting rate.",
      "One warm referral through alumni is worth more than twenty cold applications.",
      "Use GreatHire.in to find curated IT job listings tailored specifically for freshers.",
    ],
  },
  {
    id: 5,
    title: "How to Get a Job as a Fresher Without Experience",
    subtitle: "",
    category: "Career Advice",
    date: "May 06, 2026",
    readTime: "8 min read",
    image: "/careeradvice_5.webp",
    intro: `Getting your first job without experience feels like a paradox — every role asks for experience, yet no one tells you how to get it in the first place. If you're a fresher in India in 2026, this guide cuts through that frustration and gives you a clear, step-by-step roadmap to land your first job — even with zero professional experience.\n\nThe good news: India's job market is actively hiring freshers across IT, marketing, operations, sales, and finance. Companies like TCS, Infosys, Wipro, Swiggy, Meesho, and thousands of startups run dedicated fresher hiring programs. The challenge is knowing how to position yourself before you have a resume full of work history.`,
    whySection: {
      heading: "Why Freshers Struggle — And Why You Don't Have To",
      content: `Most freshers make the same mistakes: applying to hundreds of roles with a generic resume, waiting until they feel "ready," and treating the job search like a lottery rather than a skill. The result is weeks of silence and mounting frustration.\n\nThe freshers who land jobs quickly do the opposite. They pick one role, build two or three relevant skills with visible proof, apply to 20–30 targeted companies with customized materials, and treat every rejection as feedback. This guide gives you that exact system.`,
    },
    steps: [
      {
        number: 1,
        color: "#F97316",
        title: "Understand What Employers Actually Want From Freshers",
        content: `Most freshers assume employers want years of experience. What they actually want is proof that you can learn fast, work in a team, and solve problems. Before applying anywhere, research the role deeply. Read 10 to 15 job descriptions for your target position. Note which skills, tools, and qualities appear most often. Those repeated mentions are your target list — they tell you exactly what to build before you apply. Also study the industry context. Contextual knowledge impresses interviewers far more than a polished resume with no substance behind it.`,
      },
      {
        number: 2,
        color: "#8B5CF6",
        title: "Build Skills and Projects That Substitute for Experience",
        content: `If you don't have work experience, skills and projects are your currency. Choose one domain — software development, data analysis, digital marketing, HR, finance — and go deep rather than wide. Two strong, demonstrable skills beat ten half-finished online certificates. For technical roles, build real projects with visible output. A junior developer with three live GitHub projects gets more callbacks than one with five certifications and no code to show. Platforms like freeCodeCamp, NPTEL, Coursera (audit mode is free), and Google's free skill certifications are excellent starting points.`,
      },
      {
        number: 3,
        color: "#10B981",
        title: "Apply Strategically — Quality Over Volume",
        content: `Most freshers spray applications across hundreds of job listings and hear nothing back. A better approach is targeted, intentional, and research-backed. Apply to 20 to 30 companies where you have genuinely studied the product, team, or culture. Customize your resume for each role — the summary and skills sections should reflect the specific job description. Use platforms like Naukri, LinkedIn, GreatHire, Internshala, and Cutshort. One warm referral from someone inside the company is worth twenty cold applications.`,
      },
      {
        number: 4,
        color: "#3B82F6",
        title: "Track, Reflect, and Improve Continuously",
        content: `Treat the job search like a project, not a lottery. Keep a spreadsheet tracking every application — company name, role, date applied, stage reached, and feedback received. After every interview, write down the questions you struggled with and research better answers within 48 hours. Record yourself answering common interview questions and watch it back. Most people are unaware of filler words or unclear delivery until they see themselves on camera. This single habit separates candidates who improve quickly from those who repeat the same mistakes.`,
      },
    ],
    questionsSection: {
      heading: "What Employers Actually Evaluate When Hiring Freshers",
      subheading: "These are the signals companies look for — build your positioning around them.",
      questions: [
        {
          q: "Can you learn fast and independently?",
          tag: "Top Signal",
          tagColor: "#3B82F6",
          content: `Show this through projects built without formal guidance. A fresher who taught themselves Python on Coursera and built a working data dashboard is demonstrating exactly the kind of self-directed learning that teams value. Mention the learning process in interviews — not just the outcome.`,
        },
        {
          q: "Do you understand the role you're applying for?",
          tag: "Research Test",
          tagColor: "#F97316",
          content: `Read the job description three times. Understand what the role actually does day-to-day. Research the company's product, team structure, and recent news. Candidates who can speak to why the role interests them specifically — not generically — stand out immediately.`,
        },
        {
          q: "Can you communicate clearly under pressure?",
          tag: "HR Filter",
          tagColor: "#10B981",
          content: `This is what the HR round tests. Clear, structured communication is a learnable skill. Practice answering common questions out loud using the STAR method. Record yourself. Review the footage. Iterate. Most freshers underinvest in this and then wonder why they keep clearing technical rounds but failing HR.`,
        },
        {
          q: "Do you have proof of work — not just credentials?",
          tag: "Portfolio Signal",
          tagColor: "#8B5CF6",
          content: `A marketing fresher with a mock campaign for a real brand. An HR fresher with a documented sample recruitment process. A finance fresher with a personal budget model in Excel. These tangible examples replace the work history you don't yet have and give interviewers something concrete to evaluate.`,
        },
        {
          q: "Are you genuinely interested in this company?",
          tag: "Culture Fit",
          tagColor: "#EC4899",
          content: `Companies can tell the difference between a candidate who applied to 200 companies and one who applied to 20 with research. Know the company's product. Know why you want to work there specifically. Have a thoughtful question ready for the interviewer. These small signals add up.`,
        },
        {
          q: "How do you handle feedback and rejection?",
          tag: "Growth Mindset",
          tagColor: "#F59E0B",
          content: `If a recruiter gives you feedback, act on it immediately. If they don't, ask for it politely. Most people never ask — which means most people never improve as fast as they could. In interviews, acknowledge past struggles honestly and explain what you learned. Resilience is a trait companies actively hire for.`,
        },
      ],
    },
    realExample: {
      heading: "Real Example: From Commerce Graduate to Digital Marketing Role in 60 Days",
      person: "Rahul",
      subtitle: "B.Com Graduate, Pune · No IT background · Zero work experience",
      steps: [
        { label: "Days 1–15", title: "Skill Building", detail: "Rahul completed Google's free Digital Marketing certification and studied 12 job descriptions for Digital Marketing Executive roles to identify his skill gaps." },
        { label: "Days 16–30", title: "Portfolio Project", detail: "He built a mock campaign for a local restaurant — including a content calendar, ad copy, and a performance dashboard in Google Sheets. Uploaded everything publicly." },
        { label: "Days 31–50", title: "Targeted Applications", detail: "Applied to 25 companies on GreatHire and LinkedIn with a one-page resume tailored around his project. Got 6 interview calls within 3 weeks." },
        { label: "Days 51–60", title: "Offer Accepted", detail: "After 4 interviews, received his first offer — a Digital Marketing Executive role at a Pune-based e-commerce startup. Package: ₹3.6 LPA." },
      ],
      quote: `"I had no experience and no IT background. But I had a real project, a targeted resume, and I'd practiced my answers out loud 30 times. That was enough."`,
    },
    bestPractices: [
      "Focus on consistency over intensity — one hour daily beats a 10-hour weekend sprint followed by nothing.",
      "Use the right platforms: GreatHire and Internshala for fresher roles, LinkedIn for warm referrals, Cutshort for startups.",
      "Keep improving based on feedback — every rejection is information. Act on it within 48 hours.",
      "Send a personalized thank-you email after every interview — most candidates don't, and it's noticed.",
    ],
    commonMistakes: [
      "Applying without a plan — sending 200 generic applications wastes weeks and demoralizes you.",
      "Ignoring skill development while applying — job search and skill-building must run in parallel.",
      "Poor communication in applications and interviews — your email, resume, and answers are all communication tests.",
      "Giving up after 10 rejections — most freshers land their first offer between attempt 20 and 50.",
    ],
    faqs: [
      { q: "What is the best way to start as a fresher with no experience?", a: "Pick one target role, read 10 job descriptions for it, identify the two or three most-required skills, and build something tangible with those skills within 30 days. Start applying while you build — don't wait until you feel fully ready." },
      { q: "How long does it take to get your first job as a fresher in India?", a: "With consistent effort — daily skill-building, targeted applications, and active interview prep — most freshers in India land their first offer within 45 to 90 days of starting a focused search." },
      { q: "What tools should freshers use for their job search?", a: "Use Naukri, LinkedIn, GreatHire, and Internshala for applications. Use Notion or Google Sheets to track your progress. Use your phone camera to record and review mock interview answers." },
      { q: "Is this approach suitable for non-CS or arts graduates?", a: "Absolutely. Roles in digital marketing, HR, business analysis, content writing, and operations actively hire freshers from any academic background. The key is demonstrating relevant skills and genuine interest in the domain." },
      { q: "Should I do internships before applying for full-time jobs?", a: "Yes, if possible. Internships — even short, unpaid, or remote ones — give you real experience, references, and stories to tell in interviews. Many full-time roles at startups are filled by interns who performed well. Treat every internship as an extended job interview." },
    ],
    conclusion: `Getting your first job without experience is not about faking it. It is about building the right skills, applying with intention, communicating clearly, and improving faster than your competition. India's job market rewards candidates who treat their job search as seriously as their studies.\n\nStart today. Pick one role. Build one skill. Apply to one company thoughtfully. The first offer is the hardest — everything after it gets easier.`,
    cta: {
      heading: "Ready to Land Your First Job?",
      sub: "Explore thousands of fresher-friendly openings across IT, Business, Data, and more on GreatHire — and take your next step with confidence.",
      btn: "Explore Fresher Jobs on GreatHire",
    },
    keyTakeaways: [
      "Employers want proof of learning ability and problem-solving — not years of work history.",
      "Two strong, demonstrable skills beat ten half-finished certificates every time.",
      "Target 20–30 companies intentionally rather than mass-applying to hundreds.",
      "One warm referral through alumni is worth more than twenty cold applications.",
      "Track every application in a spreadsheet and act on feedback within 48 hours.",
      "Most freshers in India land their first offer within 45–90 days of a focused, consistent search.",
    ],
  },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function HeroBanner({ blog }) {
  return (
    <div className="relative w-full bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 overflow-hidden">
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-white/5" />
      <div className="relative max-w-5xl mx-auto px-6 py-12">
        <p className="text-orange-100 text-sm mb-4 font-semibold uppercase tracking-widest">
          {blog.category}
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-3xl">
          {blog.title}
        </h1>
        {blog.subtitle && (
          <p className="text-orange-100 text-xl mt-2 font-medium">{blog.subtitle}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 mt-5 text-orange-100 text-sm">
          <span>📅 {blog.date}</span>
          <span>⏱ {blog.readTime}</span>
        </div>
        {blog.steps && (
          <div className="flex flex-wrap gap-2 mt-5">
            {["Why It Matters", "Step-by-Step", "Key Questions", "Real Example", "Best Practices", "FAQs", "Conclusion"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/35 text-white text-xs font-medium transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StepCard({ step }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-base"
        style={{ backgroundColor: step.color }}
      >
        {step.number}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{step.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.content}</p>
      </div>
    </div>
  );
}

function QuestionCard({ item }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{item.q}</p>
        <span
          className="flex-shrink-0 px-2 py-0.5 rounded-full text-white text-xs font-semibold whitespace-nowrap"
          style={{ backgroundColor: item.tagColor }}
        >
          {item.tag}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.content}</p>
    </div>
  );
}

function ExampleTimeline({ example }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-orange-200 dark:border-orange-900 shadow-lg">
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-white text-xl font-black">
          {example.person[0]}
        </div>
        <div>
          <p className="text-white font-bold text-lg">{example.person}</p>
          <p className="text-orange-100 text-sm">{example.subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-orange-100 dark:divide-orange-900 bg-orange-50 dark:bg-orange-950/20">
        {example.steps.map((s, i) => (
          <div key={i} className="p-5">
            <span className="inline-block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">{s.label}</span>
            <p className="font-bold text-gray-900 dark:text-white text-sm mb-2">{s.title}</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{s.detail}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-orange-100 dark:border-orange-900">
        <p className="text-gray-700 dark:text-gray-300 text-sm italic">{example.quote}</p>
      </div>
    </div>
  );
}

function FAQAccordion({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white text-sm pr-4">{faq.q}</span>
            <span className="flex-shrink-0 text-gray-400 text-lg">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 bg-white dark:bg-gray-900">
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CTABanner({ cta }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-8 py-12 text-center shadow-xl relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5" />
      <div className="relative">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">{cta.heading}</h2>
        <p className="text-orange-100 text-base mb-6 max-w-xl mx-auto">{cta.sub}</p>
        <a
          href="https://greathire.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 rounded-full bg-white text-orange-600 font-bold text-sm hover:bg-orange-50 shadow-lg hover:shadow-xl transition-all"
        >
          {cta.btn}
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RICH DETAIL VIEW
───────────────────────────────────────────── */
function RichBlogDetail({ blog, navigate }) {
  return (
    <>
      <Helmet>
        <title>GreatHire — {blog.title}</title>
        <meta name="description" content={(blog.intro || blog.description || "").slice(0, 160)} />
      </Helmet>
      <Navbar />
      <HeroBanner blog={blog} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 bg-white dark:bg-gray-950 transition-colors duration-300">

        {/* INTRO */}
        <section className="mb-12">
          {(blog.intro || "").split("\n\n").map((p, i) => (
            <p key={i} className={`text-gray-700 dark:text-gray-300 text-base leading-relaxed ${i > 0 ? "mt-4" : ""}`}>{p}</p>
          ))}
        </section>

        {/* WHY SECTION */}
        {blog.whySection && (
          <section id="why-it-matters" className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{blog.whySection.heading}</h2>
            <div className="w-12 h-1 bg-orange-500 rounded mb-5" />
            {blog.whySection.content.split("\n\n").map((p, i) => (
              <p key={i} className={`text-gray-700 dark:text-gray-300 text-base leading-relaxed ${i > 0 ? "mt-4" : ""}`}>{p}</p>
            ))}
          </section>
        )}

        {/* STEP-BY-STEP */}
        {blog.steps && (
          <section id="step-by-step" className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Step-by-Step Guidance</h2>
            <div className="w-12 h-1 bg-orange-500 rounded mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">4 skills that separate offer-getters from also-rans.</p>
            <div className="flex flex-col gap-4">
              {blog.steps.map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          </section>
        )}

        {/* QUESTIONS GRID */}
        {blog.questionsSection && (
          <section id="key-questions" className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{blog.questionsSection.heading}</h2>
            <div className="w-12 h-1 bg-orange-500 rounded mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{blog.questionsSection.subheading}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blog.questionsSection.questions.map((item, i) => (
                <QuestionCard key={i} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* REAL EXAMPLE */}
        {blog.realExample && (
          <section id="real-example" className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{blog.realExample.heading}</h2>
            <div className="w-12 h-1 bg-orange-500 rounded mb-6" />
            <ExampleTimeline example={blog.realExample} />
          </section>
        )}

        {/* BEST PRACTICES + COMMON MISTAKES */}
        {(blog.bestPractices || blog.commonMistakes) && (
          <section id="best-practices" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blog.bestPractices && (
                <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 p-6">
                  <h3 className="font-extrabold text-green-800 dark:text-green-400 text-lg mb-3 flex items-center gap-2">
                    ✅ Best Practices
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {blog.bestPractices.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-900 dark:text-green-300">
                        <span className="mt-0.5 text-green-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {blog.commonMistakes && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 p-6">
                  <h3 className="font-extrabold text-red-800 dark:text-red-400 text-lg mb-3 flex items-center gap-2">
                    ❌ Common Mistakes
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {blog.commonMistakes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-900 dark:text-red-300">
                        <span className="mt-0.5 text-red-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* KEY TAKEAWAYS */}
        {blog.keyTakeaways && (
          <section className="mb-12">
            <div className="p-6 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-xl">
              <h2 className="text-xl font-extrabold text-blue-700 dark:text-blue-400 mb-3">Key Takeaways</h2>
              <ul className="flex flex-col gap-2">
                {blog.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-200">
                    <span className="text-blue-500 mt-0.5 font-bold">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FAQS */}
        {blog.faqs && (
          <section id="f-a-qs" className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Frequently Asked Questions</h2>
            <div className="w-12 h-1 bg-orange-500 rounded mb-6" />
            <FAQAccordion faqs={blog.faqs} />
          </section>
        )}

        {/* CONCLUSION */}
        {blog.conclusion && (
          <section id="conclusion" className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Conclusion</h2>
            <div className="w-12 h-1 bg-orange-500 rounded mb-4" />
            {blog.conclusion.split("\n\n").map((p, i) => (
              <p key={i} className={`text-gray-700 dark:text-gray-300 text-base leading-relaxed ${i > 0 ? "mt-4" : ""}`}>{p}</p>
            ))}
          </section>
        )}

        {/* CTA */}
        {blog.cta && (
          <section className="mb-12">
            <CTABanner cta={blog.cta} />
          </section>
        )}

        {/* NAV */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            ← Back
          </button>
          {blog.id < blogs.length && (
            <button
              onClick={() => navigate(`/CareerAdvice/${blog.id + 1}`)}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Next →
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────
   SIMPLE DETAIL VIEW
───────────────────────────────────────────── */
function SimpleBlogDetail({ blog, navigate }) {
  return (
    <>
      <Helmet>
        <title>GreatHire — {blog.title}</title>
        <meta name="description" content={(blog.description || "").slice(0, 160)} />
      </Helmet>
      <Navbar />
      <HeroBanner blog={blog} />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 bg-white dark:bg-gray-950 min-h-screen">
        <div className="relative w-full h-72 overflow-hidden rounded-xl shadow-lg mb-8">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => (e.target.src = "/bannerImage2.png")}
          />
        </div>
        {(blog.description || "").split(". ").map((para, i) => (
          <p key={i} className="mt-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            {para}{para.endsWith(".") ? "" : "."}
          </p>
        ))}
        <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-xl">
          <h2 className="text-xl font-extrabold text-blue-700 dark:text-blue-400 mb-3">Key Takeaways</h2>
          <ul className="list-disc list-inside text-gray-800 dark:text-gray-300 text-sm space-y-1">
            <li>Prepare thoroughly and research the company before interviews.</li>
            <li>Follow structured response methods like STAR for clarity.</li>
            <li>Post-interview follow-ups reinforce professionalism and interest.</li>
            <li>Top companies actively seek talent in AI, cloud, and engineering.</li>
          </ul>
        </div>
        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            ← Back
          </button>
          {blog.id < blogs.length && (
            <button
              onClick={() => navigate(`/CareerAdvice/${blog.id + 1}`)}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Next →
            </button>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────
   BLOG LIST VIEW
───────────────────────────────────────────── */
function BlogListView() {
  return (
    <>
      <Helmet><title>GreatHire Blogs</title></Helmet>
      <Navbar />
      <section className="py-16 px-4 bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Our Blogs</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Discover our latest and featured blogs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.id}`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden group"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/bannerImage2.png")}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wide">{blog.category}</span>
                    <span className="text-xs text-gray-400">{blog.date}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-snug mb-2">{blog.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
                    {(blog.intro || blog.description || "").slice(0, 120)}...
                  </p>
                  <span className="inline-block mt-4 text-orange-500 text-sm font-semibold">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const BlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((b) => b.id === Number(id));

  if (id && !blog) {
    return (
      <>
        <Helmet><title>GreatHire - Blog Not Found</title></Helmet>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
          <p className="text-xl font-bold text-gray-900 dark:text-white">Blog not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (id && blog) {
    return blog.steps
      ? <RichBlogDetail blog={blog} navigate={navigate} />
      : <SimpleBlogDetail blog={blog} navigate={navigate} />;
  }

  return <BlogListView />;
};

export default BlogPage;