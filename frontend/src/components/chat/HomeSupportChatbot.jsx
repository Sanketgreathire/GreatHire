import { useState } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";

const WELCOME = {
  from: "bot",
  text: "Welcome to GreatHire support. I can help you understand our services, recruiter plans, job search, support options, and trending courses.",
};

const quickQuestions = [
  "What services does GreatHire provide?",
  "Show trending courses",
  "How do recruiter plans work?",
  "I need support",
];

function answerFor(question) {
  const text = question.toLowerCase();
  if (/(course|training|learn|skill)/.test(text)) {
    return "### Trending GreatHire courses\n\n- **Java Full Stack Training** — Core Java, Spring Boot, microservices and REST APIs.\n- **Python Full Stack Training** — Python, Django/FastAPI and database-backed applications.\n- **Data Analytics Certification** — SQL, Excel, Power BI and dashboards.\n- **AWS & DevOps Engineering** — Cloud fundamentals, Docker, CI/CD and Kubernetes.\n- **Generative AI Training** — LLM foundations, prompt engineering and practical AI applications.\n\nYou can view course details, duration, and enrolment options from the **Courses** page.";
  }
  if (/(plan|price|payment|recruiter|post.*job|hiring)/.test(text)) {
    return "### Recruiter plans and hiring support\n\nGreatHire plans are designed for different hiring volumes. Start with the free option to create your recruiter profile and explore the platform. Paid plans add higher usage limits and recruitment tools.\n\n**Next steps:**\n1. Open **Recruiter Plans** to compare plan features.\n2. Select **Contact Sales** if you need a plan for a larger team.\n3. Use the secure payment page only after reviewing the selected plan.\n\nFor posting a job, sign in as a recruiter, complete your company profile, and choose **Post a Job** from the dashboard.";
  }
  if (/(support|help|contact|issue|problem)/.test(text)) {
    return "### GreatHire support\n\nFor account, recruiter-plan, job-posting, course, or payment support, please use the **Contact Us** page and include:\n- your registered email address,\n- a short description of the issue, and\n- a screenshot only when it helps explain the problem.\n\nOur team can then route your request to the correct support team.";
  }
  if (/(service|what.*greathire|about)/.test(text)) {
    return "### GreatHire services\n\nGreatHire supports both job seekers and employers through:\n- **Job posting and candidate discovery**\n- **Recruitment and staffing support**\n- **Recruiter plans and hiring tools**\n- **Training and career-focused courses**\n- **Digital, payroll, cloud, cybersecurity, and business-support services**\n\nTell me whether you are a job seeker, recruiter, or business owner and I will point you to the most relevant service.";
  }
  if (/(job|apply|opening|vacancy)/.test(text)) {
    return "### Finding jobs on GreatHire\n\nOpen the **Jobs** page, search by job title, skill, or location, and review the requirements before applying. Keep your profile and resume up to date so recruiters can understand your experience clearly.\n\nIf you need help with a specific application, use the Contact Us page and share the job title or application reference.";
  }
  return "I’m the GreatHire home support assistant. I can help with **services**, **recruiter plans**, **support**, **job search**, and **trending courses**. Please choose one of the quick questions below or ask about one of these topics.";
}

export default function HomeSupportChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([WELCOME]);
  const send = (value = input) => {
    const question = value.trim();
    if (!question) return;
    setMessages((current) => [...current, { from: "user", text: question }, { from: "bot", text: answerFor(question) }]);
    setInput("");
  };
  return <div className="fixed bottom-5 right-5 z-[9998] font-sans">
    {open && <section className="mb-3 flex h-[470px] w-[min(92vw,370px)] flex-col overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-900">
      <header className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-white"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/20"><Sparkles size={18}/></span><div className="min-w-0 flex-1"><b className="block text-sm">GreatHire Support</b><small className="text-xs text-blue-100">Services, plans and platform help</small></div><button onClick={() => setOpen(false)} aria-label="Close support chat"><X size={19}/></button></header>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">{messages.map((message, index) => <div key={index} className={message.from === "user" ? "ml-10 rounded-xl bg-blue-600 p-3 text-sm text-white" : "mr-5 whitespace-pre-line rounded-xl bg-slate-100 p-3 text-sm leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-100"}>{message.text.replace(/### /g, "")}</div>)}</div>
      <div className="flex flex-wrap gap-2 border-t border-slate-200 p-3 dark:border-slate-700">{quickQuestions.map((question) => <button onClick={() => send(question)} key={question} className="rounded-full border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300">{question}</button>)}</div>
      <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-700"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about GreatHire..." className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"/><button className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white" aria-label="Send message"><Send size={16}/></button></form>
    </section>}
    {!open && <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-xl hover:brightness-110"><MessageCircle size={20}/> Need help?</button>}
  </div>;
}
