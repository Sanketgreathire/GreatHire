import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

// ── Per-slide rich content ──────────────────────────────────────────────────

const slides = [
  {
    id: 1,
    title: "Future of Technology",
    category: "Technology Trends",
    readTime: "8 min read",
    date: "May 06, 2026",
    
    heroGradient: "from-violet-700 via-indigo-700 to-blue-800",
    accentColor: "text-violet-700",
    accentBg: "bg-violet-700",
    highlightBg: "bg-violet-50 border-violet-200",
    highlightText: "text-violet-700",
    faqAccent: "text-violet-600",
    ctaGradient: "from-violet-700 to-blue-800",
    ctaText: "text-violet-700",
    keywords: ["Future of technology", "AI & automation", "Digital innovation", "Tech careers 2026", "Emerging technology India"],
    intro: "The future of technology is not only shaped by innovation, but by the people who bring ideas to life with purpose and determination. At GreatHire, we believe that success begins with identifying the right talent and empowering individuals to thrive in roles where they can create real impact.",
    introExtra: "In today's rapidly evolving digital ecosystem, organizations require more than just talent — they need individuals who can adapt, innovate, and lead change. By combining human insight with smart technology, we aim to redefine how organizations discover talent and how individuals unlock their true potential in an ever-evolving digital landscape.",
    whyTitle: "Why the Future of Technology Matters for Your Career in 2026",
    whyText1: "India's digital economy is projected to reach $1 trillion by 2030, driven by AI adoption, cloud infrastructure growth, and digital public infrastructure. The roles being created in this economy are fundamentally different from those of a decade ago — requiring professionals who combine domain expertise with technology fluency.",
    whyText2: "The professionals who will define the next decade are those who understand technology well enough to apply it creatively, communicate its implications clearly, and adapt as the landscape shifts. This guide is your map.",
    steps: [
      {
        num: "01",
        title: "Understand the Basics and Industry Expectations",
        desc: "Research which technology trends are directly affecting your target industry or career. Read industry reports from Gartner, McKinsey, and NASSCOM. Follow technology leaders on LinkedIn and track what skills appear in the newest job descriptions in your field. The companies and professionals who thrive in the next decade are those who engage with emerging technology proactively — not those who wait until disruption forces adaptation.",
      },
      {
        num: "02",
        title: "Build Relevant Skills or Knowledge",
        desc: "AI literacy is already a baseline expectation in many roles. Cloud computing basics (AWS, Azure, GCP) are required across IT, operations, and data functions. Data literacy — the ability to read, interpret, and act on data — is valued in virtually every industry. Pick 2–3 skills from the emerging technology stack that directly align with your target career path and build them through hands-on projects.",
      },
      {
        num: "03",
        title: "Apply Strategies and Tools Effectively",
        desc: "Build a weekly technology learning habit: 30 minutes of reading (MIT Technology Review, TechCrunch, NASSCOM reports), 1 hour of hands-on experimentation with a new tool, and active participation in technology communities. Experiment with AI APIs, deploy a cloud function, analyze a dataset with a new visualization tool, or contribute to an open-source project.",
      },
      {
        num: "04",
        title: "Track Progress and Improve Continuously",
        desc: "Set quarterly technology goals: one new tool mastered, one project built with an emerging technology, one new certification completed. Monitor how your target industry is changing: which job descriptions added new technology requirements this quarter? Which roles were automated or expanded? Build continuous learning into your routine — not just occasional bursts.",
      },
    ],
    cards: [
      { num: "01", title: "Artificial Intelligence & Generative AI", badge: "Transformative", color: "bg-violet-50 border-violet-200", badgeStyle: "bg-violet-100 text-violet-700", desc: "Generative AI is embedded in software development, content creation, customer service, legal research, and education. AI literacy is rapidly becoming as expected as Excel proficiency was a decade ago.", skills: ["Prompt engineering", "Python + ML basics", "LLM APIs", "AI tool integration"] },
      { num: "02", title: "Cloud Computing & Edge Infrastructure", badge: "Already Here", color: "bg-sky-50 border-sky-200", badgeStyle: "bg-sky-100 text-sky-700", desc: "AWS, Azure, and Google Cloud dominate enterprise IT. Edge computing — processing data closer to where it's generated — is creating new roles in IoT and real-time systems.", skills: ["AWS / Azure fundamentals", "Kubernetes & containers", "Serverless architecture", "Edge computing basics"] },
      { num: "03", title: "Cybersecurity & Data Privacy", badge: "Critical Shortage", color: "bg-red-50 border-red-200", badgeStyle: "bg-red-100 text-red-700", desc: "India faces over 800,000 unfilled cybersecurity roles. Entry-level SOC analyst, security auditing, and ethical hacking are all accessible with 6–12 months of focused preparation.", skills: ["Network security basics", "Ethical hacking (CEH)", "SIEM tools", "Incident response"] },
      { num: "04", title: "Data Science & Advanced Analytics", badge: "High Demand", color: "bg-emerald-50 border-emerald-200", badgeStyle: "bg-emerald-100 text-emerald-700", desc: "Companies are moving beyond basic analytics into real-time decision systems and predictive modelling. Strong SQL, Python, and statistics is enough to begin — the ceiling is one of the highest in tech.", skills: ["Python + Pandas", "SQL and data wrangling", "ML with Scikit-learn", "Power BI / Tableau"] },
    ],
    example: {
      name: "Aarav",
      subtitle: "B.Tech CSE Graduate — No Emerging Tech Experience",
      quote: "He didn't learn everything about AI. He learned enough to build three real things — and the projects spoke louder than any certification.",
      months: [
        { label: "Month 1", title: "Focus Chosen", desc: "Researched AI/ML roles. Identified Python + ML + cloud as the trifecta most in-demand. Started fast.ai and AWS Free Tier simultaneously." },
        { label: "Month 2", title: "Projects Built", desc: "Built a text classifier, sentiment dashboard on AWS Lambda, and a Kaggle submission reaching top 20%. All documented on GitHub." },
        { label: "Month 3", title: "Hired ✓", desc: "Applied to 20 AI/ML trainee roles. Got 6 interview calls. Joined a Bangalore AI startup as ML Engineer Trainee at ₹6 LPA." },
      ],
    },
    practices: ["Build a weekly learning habit — 30 mins reading, 1 hour building, every week.", "Focus on 2–3 technology trends relevant to your specific career path.", "Build projects with emerging tools — portfolio beats course certificates.", "Join technology communities on GitHub, LinkedIn, and Discord.", "Track job descriptions quarterly to see which skills are being added.", "Teach what you learn — writing solidifies understanding faster than passive consumption."],
    mistakes: ["Chasing every trend without depth — 'I know a little about AI, blockchain, and IoT' is weaker than 'I build AI tools in Python.'", "Only reading about future technology without building anything — theory without practice doesn't transfer.", "Waiting for technology to be mainstream before learning it — early-mover advantage is gone by then.", "Ignoring foundational skills (math, programming, data literacy) in favor of trendy tool names.", "Learning in isolation — communities and peer feedback are the fastest learning accelerators.", "Treating technology skills as a one-time certification — the half-life of tool knowledge is shortening."],
    faqs: [
      { q: "Which future technology has the most career opportunity for freshers in India in 2026?", a: "AI and machine learning offer the highest entry-level demand and salary ceiling. Cloud computing offers the highest volume of open roles. Cybersecurity has the most severe talent shortage relative to demand. Choose based on your background — CS graduates have the most options, while non-CS graduates can enter data analytics or cloud support with 3–6 months of focused preparation." },
      { q: "Do I need a CS degree to build a career in future technology?", a: "Not for many roles. Data analytics, AI tools integration, cloud support, and cybersecurity awareness roles are all accessible to non-CS graduates with demonstrated skills. Core ML research and quantum computing do require strong mathematical foundations — but these can be self-taught." },
      { q: "How do I future-proof my career against AI automation?", a: "Focus on skills AI augments rather than replaces: complex problem-solving, creative synthesis, stakeholder communication, and domain expertise combined with technology fluency. Learn to work with AI tools — the professionals most at risk are those who resist adoption." },
      { q: "What is the best free resource to start learning about AI?", a: "fast.ai for practical deep learning, DeepLearning.AI on Coursera (audit for free), Google's Machine Learning Crash Course, and Kaggle's free courses. Start with one resource and one technology — breadth comes after depth." },
    ],
    ctaTitle: "Ready to Build a Future-Ready Career?",
    ctaDesc: "Explore thousands of technology roles — from AI and cloud to data and cybersecurity — actively hiring freshers and graduates across India right now.",
    ctaBtn: "Explore Tech Jobs on GreatHire →",
  },

  {
    id: 2,
    title: "Innovation Drives Growth",
    category: "Business Innovation",
    readTime: "9 min read",
    date: "May 06, 2026",
    
    heroGradient: "from-emerald-600 via-teal-700 to-cyan-800",
    accentColor: "text-emerald-700",
    accentBg: "bg-emerald-600",
    highlightBg: "bg-emerald-50 border-emerald-200",
    highlightText: "text-emerald-700",
    faqAccent: "text-emerald-600",
    ctaGradient: "from-emerald-600 to-teal-700",
    ctaText: "text-emerald-700",
    keywords: ["Innovation drives growth", "Business innovation 2026", "Technology and growth", "Innovation strategy India", "R&D and competitive advantage"],
    intro: "Innovation drives growth by transforming ideas into actionable solutions that create value, improve efficiency, and open new opportunities. Businesses that embrace innovation stay ahead of competition, adapt to changing markets, and empower their teams to solve complex challenges.",
    introExtra: "In today's fast-paced world, growth is not just about expansion — it is about evolving intelligently, leveraging technology, and continuously reimagining what is possible. Organizations that invest in innovation are better positioned to lead the market and sustain long-term competitive advantage.",
    whyTitle: "Why Innovation Is the #1 Growth Driver for Indian Businesses in 2026",
    whyText1: "India's startup ecosystem has crossed 100,000 registered startups. The companies scaling fastest in this environment share one trait: they treat innovation not as a department, but as a cultural operating principle embedded across every team and function.",
    whyText2: "From fintech disrupting traditional banking to agritech transforming rural supply chains, innovation in India in 2026 is sector-agnostic and urgently needed. Understanding how to drive, measure, and sustain innovation is one of the most valuable professional competencies of the decade.",
    steps: [
      {
        num: "01",
        title: "Understand the Basics and Industry Expectations",
        desc: "Research how innovation manifests in your specific industry — it looks different in manufacturing versus SaaS versus healthcare. Study companies that have successfully innovated in your sector: what was the trigger, the approach, and the outcome? Read 10–15 case studies across Indian and global companies. Identify the innovation frameworks (Design Thinking, Lean Startup, Jobs-to-be-Done) most relevant to your domain.",
      },
      {
        num: "02",
        title: "Build Relevant Skills or Knowledge",
        desc: "Innovation skills are a blend of creative and analytical competencies. Build design thinking fluency — Stanford's d.school has free resources. Learn data analysis basics so you can validate ideas with evidence rather than intuition. Develop storytelling and pitching skills — innovation dies without the ability to communicate it compellingly. Study product management fundamentals and agile methodologies that enable fast iteration.",
      },
      {
        num: "03",
        title: "Apply Strategies and Tools Effectively",
        desc: "Use frameworks like the Lean Canvas to structure new ideas before building them. Run small experiments — validate assumptions with the minimum viable version of a concept. Use tools like Miro for collaborative ideation, Notion for knowledge management, and analytics platforms to measure impact. Join hackathons, innovation challenges, and industry incubators to practice innovation in competitive, real-world contexts.",
      },
      {
        num: "04",
        title: "Track Progress and Improve Continuously",
        desc: "Measure innovation output, not just input. Track ideas generated, experiments run, experiments that succeeded, and the revenue or efficiency impact of implemented innovations. Review quarterly: which innovation initiatives moved forward? Which failed and why? Build a culture of learning from failure — the companies with the highest innovation rates are those that de-stigmatize and systematically learn from unsuccessful experiments.",
      },
    ],
    cards: [
      { num: "01", title: "Blockchain for Transparency & Trust", badge: "Maturing Fast", color: "bg-amber-50 border-amber-200", badgeStyle: "bg-amber-100 text-amber-700", desc: "Blockchain ensures transparency and security across finance, supply chain, and digital identity. India's CBDC development, trade finance, and land registry digitization are creating real enterprise blockchain demand.", skills: ["Distributed systems basics", "Solidity / smart contracts", "Web3.js / Ethers.js", "DeFi protocol understanding"] },
      { num: "02", title: "AI-Powered Personalization", badge: "High Impact", color: "bg-violet-50 border-violet-200", badgeStyle: "bg-violet-100 text-violet-700", desc: "AI transforms customer experiences through personalization, automated recommendations, and intelligent response systems — directly driving revenue growth in e-commerce, fintech, and EdTech.", skills: ["Recommendation systems", "NLP for customer data", "A/B testing frameworks", "Customer analytics"] },
      { num: "03", title: "R&D Investment & Open Innovation", badge: "Growth Engine", color: "bg-emerald-50 border-emerald-200", badgeStyle: "bg-emerald-100 text-emerald-700", desc: "Companies that invest in R&D are better positioned to lead markets and sustain long-term growth. Open innovation — collaborating with startups, academia, and external partners — accelerates development cycles.", skills: ["Design thinking", "Lean startup methodology", "IP and patent basics", "Innovation metrics"] },
      { num: "04", title: "Automation & Process Innovation", badge: "Operational Edge", color: "bg-sky-50 border-sky-200", badgeStyle: "bg-sky-100 text-sky-700", desc: "Automation reduces manual effort, increases operational efficiency, and frees human capital for higher-value creative work. RPA, workflow automation, and AI-assisted processes are being adopted across every sector.", skills: ["RPA tools (UiPath, Automation Anywhere)", "Process mapping", "BPM fundamentals", "No-code / low-code platforms"] },
    ],
    example: {
      name: "Priya",
      subtitle: "MBA Graduate — Innovation Manager at a Mid-Size Manufacturing Firm",
      quote: "She didn't wait for a mandate. She ran one experiment, proved the value, and the organization gave her the budget to scale it.",
      months: [
        { label: "Month 1", title: "Problem Identified", desc: "Mapped the firm's biggest operational bottleneck: manual quality inspection taking 4 hours per batch. Studied 5 AI-based computer vision solutions on the market." },
        { label: "Month 2", title: "Experiment Run", desc: "Piloted a low-cost computer vision tool on one production line. Reduced inspection time by 60% and defect miss rate by 40%. Documented results rigorously." },
        { label: "Month 3", title: "Scaled ✓", desc: "Presented results to leadership. Received budget to roll out across all 3 production lines. Promoted to Head of Innovation. Annual saving: ₹1.2 crore." },
      ],
    },
    practices: ["Validate ideas with small, fast experiments before committing large resources.", "Build cross-functional innovation teams — the best ideas sit at the intersection of domains.", "Measure innovation impact in business terms (revenue, cost, time saved) — not just ideation volume.", "Create psychological safety — teams innovate more when failure is treated as learning, not punishment.", "Study competitors and adjacent industries — most breakthrough innovations are borrowed and adapted.", "Celebrate small wins — consistent incremental innovation compounds into transformation."],
    mistakes: ["Treating innovation as a one-time project rather than a continuous cultural practice.", "Pursuing innovation without understanding the problem deeply — solutions in search of problems waste resources.", "Ignoring execution — ideas without implementation create frustration, not growth.", "Over-investing in ideation and under-investing in validation — most ideas fail at assumption, not execution.", "Building in silos — innovation without cross-functional collaboration rarely reaches customers.", "Measuring innovation by activity (workshops, hackathons) rather than outcomes (shipped products, revenue, efficiency)."],
    faqs: [
      { q: "How do companies measure the ROI of innovation investments?", a: "Through a combination of leading indicators (number of experiments run, ideas in the pipeline, speed of iteration) and lagging indicators (revenue from new products, cost savings from process innovation, market share gained). The best companies track innovation portfolios like investment portfolios — balancing incremental improvements with breakthrough bets." },
      { q: "What is the difference between incremental and disruptive innovation?", a: "Incremental innovation improves existing products or processes — it's continuous, lower risk, and compounding. Disruptive innovation creates entirely new markets or fundamentally displaces existing solutions. Both are necessary: incremental innovation sustains the business, disruptive innovation builds the future. Most successful companies actively manage both simultaneously." },
      { q: "How can freshers contribute to innovation in a large organization?", a: "By identifying specific, small problems and running low-risk experiments to solve them. Freshers have an advantage: they haven't internalized 'this is how we've always done it.' The most impactful junior innovation contributors ask the uncomfortable questions, propose data-backed experiments, and document results rigorously enough to make a business case." },
      { q: "Is blockchain actually useful for Indian businesses in 2026?", a: "Yes — in specific applications. Supply chain transparency, cross-border payment settlement, digital identity verification, and trade finance are all live blockchain use cases in India. It's not a silver bullet for all business problems, but for use cases involving multi-party trust and auditability, it provides genuine value over traditional database solutions." },
    ],
    ctaTitle: "Build a Career at the Frontier of Innovation",
    ctaDesc: "Explore roles in product, technology, data, and strategy — companies actively hiring innovators across India right now.",
    ctaBtn: "Explore Innovation Roles on GreatHire →",
  },

  {
    id: 3,
    title: "Digital Transformation",
    category: "Digital Strategy",
    readTime: "10 min read",
    date: "May 06, 2026",
    
    heroGradient: "from-blue-600 via-blue-700 to-indigo-800",
    accentColor: "text-blue-700",
    accentBg: "bg-blue-600",
    highlightBg: "bg-blue-50 border-blue-200",
    highlightText: "text-blue-700",
    faqAccent: "text-blue-600",
    ctaGradient: "from-blue-600 to-indigo-700",
    ctaText: "text-blue-700",
    keywords: ["Digital transformation", "Cloud and AI strategy", "Digital-first business India", "Digital transformation 2026", "Technology adoption strategy"],
    intro: "Digital transformation is the process of leveraging digital technologies to fundamentally change how businesses operate, deliver value to customers, and stay competitive in a rapidly evolving marketplace. From cloud computing and artificial intelligence to data analytics and automation, it enables organizations to streamline processes and make smarter decisions.",
    introExtra: "It is not just about adopting new tools — it is about reshaping culture, workflows, and business models to thrive in the digital age. Organizations that achieve true transformation build greater agility, innovation capacity, and long-term sustainability that compounds over years.",
    whyTitle: "Why Digital Transformation Is Non-Negotiable for Indian Organizations in 2026",
    whyText1: "India's digital transformation wave is accelerating across every sector — BFSI, healthcare, retail, government, and manufacturing. The companies that invested in digital infrastructure through 2020–2023 are now pulling ahead on speed, cost efficiency, and customer experience in ways that are increasingly difficult for laggards to bridge.",
    whyText2: "For professionals, digital transformation creates an enormous talent demand at every level — from strategy and change management to cloud architecture, data analytics, and UX design. Understanding the transformation journey — what it requires, what it breaks, and how it succeeds — is a career asset regardless of your function.",
    steps: [
      {
        num: "01",
        title: "Understand the Basics and Industry Expectations",
        desc: "Digital transformation is not a single project — it's a multi-year organizational journey. Understand the 4 dimensions it touches: customer experience (how you serve people), operational processes (how you work), business models (how you create and capture value), and culture (how your people think and behave). Research your target industry's transformation maturity — BFSI and retail are further ahead; manufacturing and healthcare are accelerating. McKinsey's, BCG's, and NASSCOM's digital transformation reports are free and excellent starting points.",
      },
      {
        num: "02",
        title: "Build Relevant Skills or Knowledge",
        desc: "The skills that drive digital transformation are broader than pure technology. Cloud fundamentals (AWS/Azure basics) give you the infrastructure vocabulary. Data literacy (reading dashboards, interpreting analytics) is essential across all business functions. Change management skills — communicating the why, managing resistance, and driving adoption — are as critical as technical knowledge and far rarer. For technical roles: add API integration, automation scripting, and cloud deployment to your toolkit.",
      },
      {
        num: "03",
        title: "Apply Strategies and Tools Effectively",
        desc: "Approach transformation initiatives with a 'pilot and scale' mindset rather than big-bang rollouts. Identify one high-impact, low-complexity process to digitize first — prove value, build confidence, and use the success to secure broader investment. Use collaboration tools (Notion, Jira, Confluence), analytics platforms (Google Analytics, Power BI), and automation tools (Zapier, Power Automate) to demonstrate digital-first ways of working. Document every initiative's impact in business terms — transformation without measurable results loses organizational support.",
      },
      {
        num: "04",
        title: "Track Progress and Improve Continuously",
        desc: "Track digital maturity using a consistent framework. Key metrics: percentage of customer journeys that are fully digital, process automation rate, data-driven decision-making adoption across teams, cloud migration completion rate, and employee digital skills confidence scores. Review quarterly against targets. Digital transformation stalls when measurement stops — momentum requires visible progress signals at every level of the organization.",
      },
    ],
    cards: [
      { num: "01", title: "Cloud Migration & Infrastructure", badge: "Foundation Layer", color: "bg-sky-50 border-sky-200", badgeStyle: "bg-sky-100 text-sky-700", desc: "Cloud enables real-time collaboration, remote work capabilities, and improved scalability. Migrating core systems to cloud is typically the first and most consequential step in any digital transformation journey.", skills: ["Cloud architecture basics", "Migration planning", "Cost optimization", "Multi-cloud strategy"] },
      { num: "02", title: "AI & Automation Integration", badge: "High Impact", color: "bg-violet-50 border-violet-200", badgeStyle: "bg-violet-100 text-violet-700", desc: "AI-powered automation reduces manual work, improves accuracy, and enables real-time decision-making across operations, customer service, finance, and HR functions.", skills: ["RPA implementation", "AI model integration", "Process automation", "Intelligent document processing"] },
      { num: "03", title: "Data-Driven Decision Making", badge: "Cultural Shift", color: "bg-emerald-50 border-emerald-200", badgeStyle: "bg-emerald-100 text-emerald-700", desc: "Advanced analytics enables organizations to gain insights into customer behavior, predict trends, and optimize decisions. Moving from gut-feel to data-backed choices is one of the most valuable cultural shifts in transformation.", skills: ["Business intelligence", "KPI framework design", "SQL + dashboard tools", "Predictive analytics basics"] },
      { num: "04", title: "Digital Customer Experience", badge: "Revenue Driver", color: "bg-orange-50 border-orange-200", badgeStyle: "bg-orange-100 text-orange-700", desc: "Digital transformation enables more personalized and engaging customer experiences. Organizations leveraging customer data and intelligent automation to personalize journeys see measurably higher retention, NPS, and lifetime value.", skills: ["CRM platforms (Salesforce, HubSpot)", "UX fundamentals", "Customer journey mapping", "Personalization engines"] },
    ],
    example: {
      name: "Rahul",
      subtitle: "Operations Manager at a 200-person FMCG Company",
      quote: "He didn't propose a company-wide transformation. He fixed one painful process — and that small proof of concept changed how leadership thought about digital investment.",
      months: [
        { label: "Month 1", title: "Problem Scoped", desc: "Identified that monthly inventory reporting took 3 people 2 days each month using Excel. Proposed digitizing with a simple Power BI dashboard connected to their ERP." },
        { label: "Month 2", title: "Solution Built", desc: "Built the Power BI dashboard with IT support. Automated data refresh daily. Reporting time reduced from 2 person-days to 30 minutes. Accuracy improved significantly." },
        { label: "Month 3", title: "Scaled ✓", desc: "Leadership approved digitizing 4 more reporting functions. Rahul was made Digital Transformation Lead. Company saved ₹18 lakh annually in manual reporting costs." },
      ],
    },
    practices: ["Start with business problems, not technology solutions — transformation fails when it begins with a tool looking for a use case.", "Pilot on one process, prove value in measurable terms, then scale — avoid big-bang rollouts.", "Invest in change management as much as technology — adoption is the hardest part of transformation.", "Build a transformation dashboard with clear metrics — visibility drives accountability.", "Engage frontline employees early — the people closest to processes identify the best opportunities.", "Celebrate and communicate every win — transformation requires sustained organizational energy over years."],
    mistakes: ["Starting with technology instead of business outcomes — buying cloud or AI without a specific problem to solve.", "Underestimating the people and culture change required — most transformation failures are human, not technical.", "Treating digital transformation as a one-time project with an end date — it is a continuous organizational evolution.", "Skipping the pilot phase and rolling out enterprise-wide before validating — it amplifies both cost and risk.", "Neglecting cybersecurity in the transformation agenda — expanded digital surface = expanded attack surface.", "Measuring transformation by tools deployed rather than business outcomes improved."],
    faqs: [
      { q: "What is the difference between digitization, digitalization, and digital transformation?", a: "Digitization is converting analog information to digital (scanning paper documents). Digitalization is using digital data to improve or automate existing processes. Digital transformation is the fundamental rethinking of business models, customer experiences, and operating models enabled by digital technology. Most organizations do some of the first two and call it transformation — genuine transformation requires the third." },
      { q: "How long does a digital transformation initiative typically take?", a: "Meaningful transformation at the enterprise level takes 3–5 years. Individual process digitization projects can deliver results in 3–6 months. The mistake is treating transformation as a single project with a finish line — the most digitally advanced organizations treat it as a continuous operating model, not a one-time change program." },
      { q: "What roles are most in demand during digital transformation in India?", a: "Cloud architects and engineers, data analysts and BI developers, change management specialists, product managers with technical fluency, cybersecurity professionals, and UX designers. The highest-leverage role is often the change manager or digital program manager — the person who translates technology capability into organizational adoption." },
      { q: "How do small and mid-sized Indian businesses approach digital transformation?", a: "The most effective approach for SMEs is 'start small, prove value, scale': identify 1–2 high-pain processes, digitize them with affordable cloud-based tools (often free tier or low-cost SaaS), measure the impact in business terms, and use that success to build internal confidence and external investment for the next initiative." },
    ],
    ctaTitle: "Find Digital Transformation Roles Across India",
    ctaDesc: "Cloud, data, product, change management — explore thousands of digital transformation roles actively hiring across industries.",
    ctaBtn: "Explore Digital Roles on GreatHire →",
  },

  {
    id: 4,
    title: "Technology Solutions",
    category: "Enterprise Technology",
    readTime: "9 min read",
    date: "May 06, 2026",
    
    heroGradient: "from-orange-500 via-orange-600 to-rose-700",
    accentColor: "text-orange-600",
    accentBg: "bg-orange-500",
    highlightBg: "bg-orange-50 border-orange-200",
    highlightText: "text-orange-600",
    faqAccent: "text-orange-500",
    ctaGradient: "from-orange-500 to-rose-600",
    ctaText: "text-orange-600",
    keywords: ["Technology solutions", "Enterprise technology 2026", "Business technology platforms", "Software solutions India", "IT solutions for business growth"],
    intro: "Technology solutions encompass the tools, platforms, and strategies that help businesses solve complex problems, optimize operations, and drive growth. From software applications and cloud services to AI-driven analytics and automation, these solutions enable organizations to work smarter, respond faster, and deliver superior customer experiences.",
    introExtra: "By integrating the right technologies, companies can unlock efficiency, innovation, and scalability, ensuring they remain competitive in a digital-first world. Modern solutions focus on security, scalability, and seamless system integration — reducing operational costs while improving performance and user satisfaction.",
    whyTitle: "Why Choosing the Right Technology Solutions Is a Strategic Business Decision in 2026",
    whyText1: "The average enterprise uses over 200 software applications. Yet most business leaders report that more technology hasn't automatically meant better outcomes. The companies that extract the most value from technology investments share one trait: they choose solutions based on specific business problems, not vendor popularity or peer pressure.",
    whyText2: "In 2026, the technology solutions landscape is more complex and more powerful than ever. AI-augmented platforms, API-first architectures, and no-code tools have made sophisticated technology accessible to organizations of all sizes. The competitive advantage lies not in having technology — but in selecting, implementing, and continuously optimizing the right combination for your specific context.",
    steps: [
      {
        num: "01",
        title: "Understand the Basics and Industry Expectations",
        desc: "Before evaluating any technology solution, clearly define the business problem you're solving. What process is broken? What outcome are you trying to improve? What does success look like in measurable terms? Research how other companies in your industry have solved the same problem — Gartner Magic Quadrant reports, G2 reviews, and industry case studies are useful starting points. Understand the difference between build vs. buy decisions and when each makes sense for your organization's stage and scale.",
      },
      {
        num: "02",
        title: "Build Relevant Skills or Knowledge",
        desc: "Technology solution professionals need a blend of technical and business skills. Technical: understand APIs and integrations (how systems talk to each other), cloud architecture basics, and data flow between platforms. Business: requirements gathering, vendor evaluation frameworks, total cost of ownership analysis, and ROI calculation. Communication: the ability to translate technical capabilities into business language and vice versa is one of the most valuable skills in any technology solutions role.",
      },
      {
        num: "03",
        title: "Apply Strategies and Tools Effectively",
        desc: "Use a structured evaluation framework for any technology investment: (1) Define requirements clearly before talking to vendors. (2) Run a proof-of-concept before full commitment. (3) Evaluate total cost of ownership — not just license fees, but implementation, training, maintenance, and migration costs. (4) Check integration capability with your existing stack. (5) Assess vendor support quality and roadmap alignment. Use tools like Notion for requirements documentation, Miro for system architecture mapping, and spreadsheets for TCO analysis.",
      },
      {
        num: "04",
        title: "Track Progress and Improve Continuously",
        desc: "Post-implementation, track solution performance against the business problem you set out to solve. Metrics: adoption rate among target users (if people aren't using it, it's not solving the problem), process efficiency improvement, error rate reduction, and cost savings versus baseline. Review quarterly with both technical and business stakeholders. Technology solutions depreciate — what solved the problem 2 years ago may not be optimal today. Build a regular review cadence to assess, optimize, and when necessary, replace.",
      },
    ],
    cards: [
      { num: "01", title: "Cloud Infrastructure & SaaS Platforms", badge: "Foundation", color: "bg-sky-50 border-sky-200", badgeStyle: "bg-sky-100 text-sky-700", desc: "Cloud-based SaaS solutions reduce infrastructure costs, enable remote work, and provide enterprise-grade capabilities to organizations of all sizes. AWS, Azure, Google Cloud, and their SaaS ecosystems are the backbone of modern business technology.", skills: ["Cloud platform fundamentals", "SaaS evaluation frameworks", "API integration basics", "Total cost of ownership analysis"] },
      { num: "02", title: "APIs, Microservices & System Integration", badge: "Scalability Key", color: "bg-indigo-50 border-indigo-200", badgeStyle: "bg-indigo-100 text-indigo-700", desc: "Modern technology solutions are built on flexible, composable architectures. APIs and microservices enable organizations to build flexible, resilient applications that can scale independently and integrate seamlessly with existing systems.", skills: ["REST API fundamentals", "Microservices architecture", "Integration platforms (MuleSoft, Zapier)", "Event-driven systems"] },
      { num: "03", title: "AI-Augmented Business Applications", badge: "Competitive Edge", color: "bg-violet-50 border-violet-200", badgeStyle: "bg-violet-100 text-violet-700", desc: "AI is being embedded into every category of business software — CRM, ERP, HRMS, and analytics platforms. Organizations that use AI-augmented tools effectively make faster, more accurate decisions with less manual effort.", skills: ["AI tool evaluation", "Prompt engineering basics", "AI integration patterns", "Change management for AI adoption"] },
      { num: "04", title: "Cybersecurity & Compliance Solutions", badge: "Non-Negotiable", color: "bg-red-50 border-red-200", badgeStyle: "bg-red-100 text-red-700", desc: "As technology surface area grows, security and compliance become more critical. Modern technology stacks must include identity management, data encryption, access controls, and compliance monitoring — especially in regulated industries like BFSI and healthcare.", skills: ["Identity & access management", "Data encryption basics", "Compliance frameworks (ISO 27001, GDPR)", "Security-first architecture"] },
    ],
    example: {
      name: "Meera",
      subtitle: "IT Manager at a 500-person Logistics Company",
      quote: "She didn't buy the most popular platform. She bought the right one — defined by her team's specific workflow and her company's integration requirements.",
      months: [
        { label: "Month 1", title: "Problem Defined", desc: "Mapped the company's core pain point: 3 disconnected systems for orders, inventory, and billing causing daily reconciliation errors and a 2-day delay in invoicing. Set clear success criteria before evaluating solutions." },
        { label: "Month 2", title: "Solution Evaluated", desc: "Ran 3 POCs with shortlisted vendors. Built a TCO model for each. Selected a mid-market ERP with strong API integration capability over the most popular enterprise option — 40% lower TCO, same core functionality." },
        { label: "Month 3", title: "Deployed ✓", desc: "Deployed in 6 weeks with structured change management. Invoicing delay reduced from 2 days to 4 hours. Reconciliation errors dropped 85%. Annual operational saving: ₹45 lakh. Vendor selection model now standard for all IT decisions." },
      ],
    },
    practices: ["Define the business problem and success metrics before evaluating any technology solution.", "Always run a proof-of-concept before full commitment — assumptions surface quickly in POCs.", "Calculate total cost of ownership, not just license fees — implementation, training, and maintenance are often larger.", "Evaluate integration capability first — a great tool that doesn't connect to your stack creates new problems.", "Involve end users in evaluation — adoption depends on solving their actual workflow pain, not IT's theoretical requirements.", "Build a regular technology review cadence — what's optimal today may not be in 18 months."],
    mistakes: ["Buying technology based on brand recognition or peer pressure rather than specific business fit.", "Skipping the POC phase and committing to a full rollout before validating assumptions.", "Underestimating implementation complexity — most technology projects overrun on time and cost.", "Neglecting user adoption — the best technology unused is a cost center, not a solution.", "Ignoring integration requirements until after purchase — retrofitting integration is expensive and painful.", "Treating technology solutions as permanent — failing to review and optimize as needs and capabilities evolve."],
    faqs: [
      { q: "How do companies decide between building custom technology and buying off-the-shelf solutions?", a: "The core principle: buy for commodity functions (HR, finance, email), build for genuine competitive differentiation. If the business process you're automating is something every company in your industry does the same way, buy. If it's the specific capability that differentiates your product or service in the market, build — or heavily customize. Most companies get this wrong by building where they should buy, consuming engineering resources on non-differentiated problems." },
      { q: "What is the most important factor when evaluating a new technology solution?", a: "Integration capability — how well it connects with your existing systems. A technically superior solution that doesn't integrate well creates data silos, manual workarounds, and adoption failure. After integration, evaluate: total cost of ownership, vendor support quality, user experience for your specific team, and roadmap alignment with your 2–3 year technology direction." },
      { q: "How do small Indian businesses compete with large enterprises on technology?", a: "Through cloud-first and SaaS-first strategies. A small logistics company can use the same quality ERP, CRM, and analytics platform as a Fortune 500 company — at a fraction of the cost — through SaaS. The playing field has genuinely leveled on technology access. The advantage now lies in speed of adoption, quality of implementation, and willingness to make data-driven decisions — none of which require scale." },
      { q: "What technology solution roles are most in demand in India in 2026?", a: "Solution architects, cloud engineers, implementation consultants, product managers with technical fluency, data engineers, and cybersecurity professionals. On the business side: technology program managers, change management leads, and vendor management specialists. The highest-value intersection is technical depth plus business communication — professionals who can translate between engineering and executive leadership are exceptionally rare and well-compensated." },
    ],
    ctaTitle: "Build a Career in Enterprise Technology Solutions",
    ctaDesc: "From cloud and cybersecurity to AI and ERP implementation — explore thousands of technology solutions roles across India.",
    ctaBtn: "Explore Technology Roles on GreatHire →",
  },
];

// ── Shared sub-components ───────────────────────────────────────────────────

function FAQItem({ q, a, accentColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">{q}</span>
        <span className={`${accentColor} font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

const TheFuture = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentSlide = slides.find((s) => s.id === Number(id)) || slides[0];
  const currentIndex = slides.findIndex((s) => s.id === currentSlide.id);
  const prevSlide = slides[currentIndex - 1] || null;
  const nextSlide = slides[currentIndex + 1] || null;

  return (
    <>
      <Helmet>
        <title>GreatHire — {currentSlide.title}</title>
      </Helmet>
      <Navbar />

      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className={`bg-gradient-to-br ${currentSlide.heroGradient} text-white`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {currentSlide.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
              {currentSlide.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-white/70 text-sm mb-6">
              <span>📅 {currentSlide.date}</span>
              <span className="hidden sm:inline">·</span>
              <span>⏱ {currentSlide.readTime}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSlide.keywords.map((kw) => (
                <span key={kw} className="bg-white/15 border border-white/25 text-white text-xs px-3 py-1 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ── HERO IMAGE ── */}
        {/* <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6">
          <div className="relative w-full h-64 sm:h-96 overflow-hidden rounded-2xl shadow-xl">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => (e.target.src = "/bannerImage2.png")}
            />
          </div>
        </div> */}

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* ── INTRODUCTION ── */}
          <section className="mb-14">
            <div className={`${currentSlide.highlightBg} border rounded-2xl p-6 sm:p-8 mb-8`}>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                {currentSlide.intro}
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {currentSlide.introExtra}
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{currentSlide.whyTitle}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{currentSlide.whyText1}</p>
            <p className="text-gray-600 leading-relaxed">{currentSlide.whyText2}</p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to understand, build, apply, and continuously improve.</p>
            <div className="space-y-5">
              {currentSlide.steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${currentSlide.accentBg} text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base`}>
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

          {/* ── TOPIC CARDS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Key Areas to Know</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">What each area involves, why it matters, and which skills to build.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {currentSlide.cards.map((card) => (
                <div key={card.num} className={`border rounded-2xl p-5 sm:p-6 ${card.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{card.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${card.badgeStyle}`}>{card.badge}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{card.desc}</p>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Key Skills</p>
                    <ul className="space-y-1">
                      {card.skills.map((sk, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                          {sk}
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: Structured Steps, Real Results</h2>
            <div className={`bg-gradient-to-br ${currentSlide.ctaGradient} text-white rounded-2xl p-6 sm:p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  {currentSlide.example.name[0]}
                </div>
                <div>
                  <p className="font-bold">{currentSlide.example.name}</p>
                  <p className="text-white/70 text-xs">{currentSlide.example.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentSlide.example.months.map((m) => (
                  <div key={m.label} className="bg-white/15 rounded-xl p-4">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{m.label}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-white/80 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-white/70 text-sm italic border-t border-white/20 pt-4">
                "{currentSlide.example.quote}"
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
                {currentSlide.practices.map((item, i) => (
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
                {currentSlide.mistakes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── KEY TAKEAWAYS ── */}
          <section className="mb-14">
            <div className={`${currentSlide.highlightBg} border rounded-2xl p-6 sm:p-8`}>
              <h2 className={`text-2xl font-bold ${currentSlide.highlightText} mb-4`}>Key Takeaways</h2>
              <ul className="space-y-2">
                {[
                  "AI and automation are transforming industries rapidly — literacy is now a baseline expectation.",
                  "Innovation drives growth through continuous experimentation, not one-time projects.",
                  "Digital transformation reshapes culture, workflow, and strategy — not just tools.",
                  "Technology solutions deliver ROI only when chosen for specific business problems.",
                  "Depth in 2–3 relevant skills consistently outperforms breadth across many.",
                  "Data-driven decision making improves accuracy and strategic planning at every level.",
                  "Security and scalability are non-negotiable in any modern technology investment.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className={`${currentSlide.highlightText} font-bold mt-0.5 flex-shrink-0`}>→</span>
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
              {currentSlide.faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} accentColor={currentSlide.faqAccent} />
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className={`bg-gradient-to-br ${currentSlide.ctaGradient} rounded-2xl p-8 sm:p-12 text-center text-white mb-14`}>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">{currentSlide.ctaTitle}</h2>
            <p className="text-white/80 mb-8 text-sm sm:text-base max-w-xl mx-auto">{currentSlide.ctaDesc}</p>
            <a
              href="https://greathire.in"
              className={`inline-block bg-white ${currentSlide.ctaText} font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:opacity-90 transition-opacity shadow-lg`}
            >
              {currentSlide.ctaBtn}
            </a>
          </section>

          {/* ── NAVIGATION ── */}
          <div className="flex justify-between items-center gap-4">
            {prevSlide ? (
              <button
                onClick={() => navigate(`/TheFuture/${prevSlide.id}`)}
                className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-sm transition-colors"
              >
                ← <span className="hidden sm:inline">{prevSlide.title}</span><span className="sm:hidden">Previous</span>
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              {slides.map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/TheFuture/${s.id}`)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${s.id === currentSlide.id ? currentSlide.accentBg : "bg-gray-300"}`}
                />
              ))}
            </div>
            {nextSlide ? (
              <button
                onClick={() => navigate(`/TheFuture/${nextSlide.id}`)}
                className={`flex items-center gap-2 px-5 py-3 ${currentSlide.accentBg} text-white rounded-xl font-semibold text-sm transition-opacity hover:opacity-90`}
              >
                <span className="hidden sm:inline">{nextSlide.title}</span><span className="sm:hidden">Next</span> →
              </button>
            ) : (
              <div />
            )}
          </div>

        </main>
      </div>

      <Footer />
    </>
  );
};

export default TheFuture;