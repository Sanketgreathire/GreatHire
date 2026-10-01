import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Briefcase,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  FileText,
  Mail,
  TrendingUp,
  Search,
  Calendar,
  Check,
  Copy,
  RotateCcw,
  ShieldCheck,
  Lock,
  Building,
  HelpCircle,
} from "lucide-react";
import { RECRUITER_CHAT_API_END_POINT } from "../../utils/ApiEndPoint";

const INITIAL_RECRUITER_MESSAGE = {
  id: "recruiter-welcome-1",
  sender: "bot",
  text: `👋 Hello! I am **GreatHire's Recruiter AI Assistant** 💼.

I am specialized strictly in helping recruiters & hiring managers with executive hiring tools:

- 🎯 **Custom Interview Questions & Evaluation Benchmarks**
- 📧 **Recruitment Email & Offer Letter Templates** (Invitations, Offers, Rejections)
- 📊 **CTC Salary Benchmarks & Hiring Market Insights** (India 2026)
- 🔍 **Candidate Resume Screening & ATS Checklists**
- 📅 **GreatHire Platform Tools & 1-Click Google Calendar Sync**

💡 **Quick Action Examples:**
- *"Give me 8 technical interview questions for a React.js Developer with evaluation benchmarks"*
- *"Draft a formal offer letter template for a Senior Python Developer"*
- *"What is the standard CTC range for a Full Stack Developer (3 yrs exp) in Bangalore?"*
- *"How do I schedule an interview and sync it to Google Calendar on GreatHire?"*`,
  suggestions: [
    "React Developer Interview Questions",
    "Job Offer Letter Email Template",
    "Full Stack CTC Salary Benchmark",
    "DevOps ATS Resume Checklist",
  ],
  timestamp: new Date(),
};

// Safe Inline Styles Renderer
function renderInlineStyles(text) {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-gray-700 dark:text-gray-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 text-xs font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200/50 dark:border-indigo-800/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// Formatted Message Component
function FormattedMessage({ content }) {
  if (!content) return null;
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={idx} className="h-1" />;

        // Headings
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={idx}
              className="text-base font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1 flex items-center gap-1.5"
            >
              {renderInlineStyles(trimmed.replace(/^###\s+/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={idx}
              className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-3 mb-1"
            >
              {renderInlineStyles(trimmed.replace(/^##\s+/, ""))}
            </h3>
          );
        }

        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-indigo-500 font-bold leading-5">•</span>
              <span className="text-gray-800 dark:text-gray-200 flex-1">
                {renderInlineStyles(trimmed.replace(/^[-•*]\s+/, ""))}
              </span>
            </div>
          );
        }

        // Numbered list
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-[18px]">
                {numberedMatch[1]}.
              </span>
              <span className="text-gray-800 dark:text-gray-200 flex-1">
                {renderInlineStyles(numberedMatch[2])}
              </span>
            </div>
          );
        }

        // Horizontal divider
        if (trimmed === "---") {
          return (
            <hr key={idx} className="my-2 border-slate-200 dark:border-slate-800" />
          );
        }

        return (
          <p key={idx} className="text-gray-800 dark:text-gray-200">
            {renderInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function RecruiterChatbot() {
  const { user } = useSelector((store) => store.auth);

  // STRICT ACCESS CHECK: Only render for Recruiter role (or admin during testing)
  if (!user || (user.role !== "recruiter" && user.role !== "admin")) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([INITIAL_RECRUITER_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, scrollToBottom]);

  const handleCopyText = (msgId, text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${RECRUITER_CHAT_API_END_POINT}/message`,
        {
          message: queryText,
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: res.data.reply,
          suggestions: res.data.suggestions || [],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(res.data?.message || "Failed to fetch reply");
      }
    } catch (error) {
      console.error("Recruiter Chat error:", error);
      const fallbackMsg = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: `⚠️ **Connection Timeout**\n\nI couldn't connect to GreatHire AI server right now. Please check your internet connection or try again in a few moments.`,
        suggestions: [
          "React Developer Interview Questions",
          "Job Offer Letter Email Template",
          "Full Stack CTC Salary Benchmark",
        ],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_RECRUITER_MESSAGE]);
  };

  const quickFeaturePrompt = (promptText) => {
    handleSendMessage(promptText);
  };

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON (Elevated above WhatsApp Float) ── */}
      {!isOpen && (
        <div className="fixed bottom-[84px] right-4 sm:bottom-[96px] sm:right-6 z-[9990] flex items-center group">
          {/* Hover Tooltip (Laptop/Desktop) */}
          <div className="absolute right-full mr-3 hidden sm:group-hover:flex items-center gap-1.5 bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md whitespace-nowrap transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
            <span>Recruiter AI Copilot</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Recruiter AI Assistant"
            className="group relative flex items-center bg-slate-900 text-white border border-indigo-500/30 shadow-[0_12px_32px_rgba(11,26,45,0.25)] hover:shadow-[0_16px_36px_rgba(79,70,229,0.35)] hover:-translate-y-1 active:scale-95 transition-all duration-300 backdrop-blur-md p-1.5 rounded-full w-14 h-14 justify-center sm:w-auto sm:h-auto sm:p-2 sm:pl-2.5 sm:pr-4 sm:rounded-[22px] sm:gap-2.5"
          >
            {/* Avatar Box with 3D Character & Briefcase Corner Badge */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full sm:rounded-[14px] bg-gradient-to-br from-indigo-900 to-slate-950 border border-indigo-500/40 flex items-center justify-center p-0.5 shrink-0 overflow-visible shadow-xs">
              <img
                src="/whatsapp-helper.png"
                alt="Recruiter AI Avatar"
                className="w-full h-full object-cover rounded-full sm:rounded-[12px] transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="hidden w-full h-full items-center justify-center bg-indigo-600 text-white rounded-full font-black text-xs">
                HR
              </div>

              {/* Bottom-Right Corner Briefcase Badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md border-2 border-slate-900 z-10">
                <Briefcase className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Text Copy Section (Laptop / Desktop Only) */}
            <div className="text-left hidden sm:flex flex-col justify-center min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <strong className="text-xs font-extrabold text-white tracking-tight leading-none">
                  Recruiter AI
                </strong>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-300 leading-tight mt-0.5">
                Hiring & Screening Bot
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Main Recruiter Chatbot Drawer / Modal */}
      {isOpen && (
        <div
          className={`fixed z-[9999] transition-all duration-300 ease-out flex flex-col shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${
            isExpanded
              ? "inset-4 sm:inset-10 rounded-2xl"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[460px] h-[640px] max-h-[90vh] rounded-2xl"
          }`}
        >
          {/* Executive Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-t-2xl flex items-center justify-between border-b border-indigo-500/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 z-10">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center shadow-inner">
                  <Briefcase className="w-5 h-5 text-indigo-300" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base tracking-wide text-white">
                    Recruiter AI Assistant
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Pro
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure DB Logged | Restrict Policy Active</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 z-10">
              <button
                onClick={handleResetChat}
                title="Reset Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="hidden sm:block p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Security & Logging Notice Banner */}
          <div className="bg-slate-100 dark:bg-slate-950/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                Log: <strong className="text-slate-800 dark:text-slate-200">{user?.companyName || user?.fullname || "Recruiter Account"}</strong>
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-500 flex items-center gap-1">
              <Building className="w-3 h-3" />
              GreatHire Talent Copilot
            </span>
          </div>

          {/* Quick Feature Action Bar */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => quickFeaturePrompt("Give me technical interview questions with evaluation benchmarks for React developer")}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Questions</span>
            </button>
            <button
              onClick={() => quickFeaturePrompt("Draft a formal offer letter template for senior developer")}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Emails & Offers</span>
            </button>
            <button
              onClick={() => quickFeaturePrompt("What is the CTC salary benchmark for Full Stack Developer with 3 yrs exp in Bangalore?")}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition whitespace-nowrap"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>CTC Insights</span>
            </button>
            <button
              onClick={() => quickFeaturePrompt("What red flags and ATS keywords should I screen for in a DevOps resume?")}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Resume Screening</span>
            </button>
            <button
              onClick={() => quickFeaturePrompt("How to schedule interview and sync to Google Calendar on GreatHire?")}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 shadow-sm border ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-slate-900 text-white rounded-br-none border-indigo-700"
                      : "bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-bl-none border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <FormattedMessage content={msg.text} />

                  {/* Copy Button for Bot Answers */}
                  {msg.sender === "bot" && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                      <span>GreatHire Recruiter Copilot</span>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Content</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Interactive Suggestion Chips */}
                {msg.sender === "bot" && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[88%]">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition shadow-sm"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-none p-3.5 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-500 font-medium ml-1">
                    Analyzing recruitment query...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about interview questions, emails, CTC benchmarks..."
                className="flex-1 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-sm placeholder:text-slate-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-900 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
