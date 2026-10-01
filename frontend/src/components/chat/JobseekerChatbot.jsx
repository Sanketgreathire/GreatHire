import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  MapPin,
  Briefcase,
  GraduationCap,
  BookOpen,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Building,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { JOBSEEKER_CHAT_API_END_POINT } from "../../utils/ApiEndPoint";

const INITIAL_MESSAGE = {
  id: "welcome-1",
  sender: "bot",
  text: `Hello! 👋 I'm your **GreatHire Career & Education Assistant**.

I am specialized strictly in **educational guidance**, **learning roadmaps**, **skill development**, and **job search** on GreatHire.

💡 **Try asking me:**
- *"I want job in Mumbai and field is Java developer"*
- *"What skills do I need for Python backend roles?"*
- *"Full stack developer roadmap for freshers"*
- *"Common Java interview questions & answers"*`,
  jobs: [],
  courses: [],
  suggestions: [
    "Core Java & OOP Concepts",
    "Python Developer Roadmap",
    "Full Stack Interview Questions",
    "ATS Resume Tips",
  ],
  timestamp: new Date(),
};

// Safe markdown-to-elements renderer without heavy dependencies
function FormattedMessage({ content }) {
  if (!content) return null;

  // Split into lines
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Headers
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={idx}
              className="text-base font-bold text-gray-900 dark:text-white mt-3 mb-1"
            >
              {renderInlineStyles(trimmed.replace(/^###\s+/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={idx}
              className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-3 mb-1"
            >
              {renderInlineStyles(trimmed.replace(/^##\s+/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2
              key={idx}
              className="text-xl font-black text-gray-900 dark:text-white mt-3 mb-1"
            >
              {renderInlineStyles(trimmed.replace(/^#\s+/, ""))}
            </h2>
          );
        }

        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-blue-500 font-bold leading-5">•</span>
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
              <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-[18px]">
                {numberedMatch[1]}.
              </span>
              <span className="text-gray-800 dark:text-gray-200 flex-1">
                {renderInlineStyles(numberedMatch[2])}
              </span>
            </div>
          );
        }

        // Table delimiter line (ignore)
        if (/^\|[-:\s|]+\|$/.test(trimmed)) {
          return null;
        }

        // Table row
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
          const cells = trimmed
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
          return (
            <div
              key={idx}
              className="grid grid-cols-3 gap-2 py-1 px-2 text-xs bg-gray-50 dark:bg-gray-800/60 rounded border border-gray-100 dark:border-gray-800"
            >
              {cells.map((c, cIdx) => (
                <div key={cIdx} className="font-medium text-gray-700 dark:text-gray-300">
                  {renderInlineStyles(c)}
                </div>
              ))}
            </div>
          );
        }

        // Horizontal rule
        if (/^---+$/.test(trimmed)) {
          return <hr key={idx} className="my-2 border-gray-200 dark:border-gray-800" />;
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-gray-800 dark:text-gray-200">
            {renderInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Render bold, code, and markdown links
function renderInlineStyles(text) {
  if (!text) return "";

  // Split by markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(processBoldAndCode(text.substring(lastIndex, match.index)));
    }
    const label = match[1];
    const url = match[2];
    parts.push(
      <a
        key={match.index}
        href={url}
        onClick={(e) => {
          if (url.startsWith("/")) {
            e.preventDefault();
            window.location.assign(url);
          }
        }}
        className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-800 transition-colors inline-flex items-center gap-0.5"
      >
        {label}
        <ExternalLink size={11} className="inline ml-0.5" />
      </a>
    );
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(processBoldAndCode(text.substring(lastIndex)));
  }

  return parts.length > 0 ? parts : processBoldAndCode(text);
}

function processBoldAndCode(text) {
  // Format **bold**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-white">
          {boldText}
        </strong>
      );
    }
    // Format `code`
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((cPart, cIdx) => {
      if (cPart.startsWith("`") && cPart.endsWith("`")) {
        return (
          <code
            key={`${i}-${cIdx}`}
            className="px-1.5 py-0.5 text-xs font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-900"
          >
            {cPart.slice(1, -1)}
          </code>
        );
      }
      return cPart;
    });
  });
}

export default function JobseekerChatbot() {
  const { user } = useSelector((state) => state.auth || {});

  // STRICT RULE: Only render chatbot for logged-in Job Seekers (student / candidate / jobseeker)
  const isJobseeker = Boolean(
    user && (user.role === "student" || user.role === "candidate" || user.role === "jobseeker")
  );

  if (!isJobseeker) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("gh_jobseeker_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [INITIAL_MESSAGE];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("gh_jobseeker_chat_history", JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  // Listen to custom open event from anywhere (e.g., JobseekerLogin button)
  useEffect(() => {
    const handleOpenChat = (e) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e.detail?.prompt) {
        handleSendMessage(e.detail.prompt);
      } else {
        setTimeout(() => inputRef.current?.focus(), 250);
      }
    };

    window.addEventListener("open-jobseeker-chat", handleOpenChat);
    return () => window.removeEventListener("open-jobseeker-chat", handleOpenChat);
  }, []);

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : input;
    if (!query || !query.trim() || isLoading) return;

    const userMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build lightweight conversation history for context
      const historyPayload = messages
        .filter((m) => m.id !== "welcome-1")
        .slice(-4)
        .map((m) => ({ sender: m.sender, text: m.text }));

      const res = await axios.post(
        `${JOBSEEKER_CHAT_API_END_POINT}/message`,
        {
          message: query.trim(),
          history: historyPayload,
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        const botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: res.data.reply,
          jobs: res.data.jobs || [],
          courses: res.data.courses || [],
          searchUrl: res.data.searchUrl,
          suggestions: res.data.suggestions || [],
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
        if (!isOpen) setHasUnread(true);
      } else {
        throw new Error(res.data?.message || "Failed to generate guidance");
      }
    } catch (err) {
      console.error("Jobseeker Chatbot error:", err);
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text: `⚠️ I encountered a temporary connection issue. Please check your network or try again. You can also explore active openings directly on our [Jobs Portal](/jobs).`,
        jobs: [],
        courses: [],
        suggestions: ["Core Java Concepts", "Python Developer Roadmap", "ATS Resume Tips"],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem("gh_jobseeker_chat_history");
  };

  const handleNavigate = (url) => {
    window.location.assign(url);
  };

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON (Rectangle on Laptop, Pure Circle on Mobile) ── */}
      {!isOpen && (
        <div className="fixed bottom-[84px] right-4 sm:bottom-[96px] sm:right-6 z-[9990] flex items-center group">
          {/* Hover Tooltip (Laptop/Desktop) */}
          <div className="absolute right-full mr-3 hidden sm:group-hover:flex items-center gap-1.5 bg-gray-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md whitespace-nowrap transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
            <span>GreatHire AI Assistant</span>
            <Sparkles size={12} className="text-amber-300 fill-amber-300" />
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setHasUnread(false);
            }}
            aria-label="Open GreatHire AI Assistant"
            className="group relative flex items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-blue-500/20 dark:border-gray-700/80 shadow-[0_12px_32px_rgba(11,26,45,0.18)] hover:shadow-[0_16px_36px_rgba(37,99,235,0.25)] hover:-translate-y-1 active:scale-95 transition-all duration-300 backdrop-blur-md p-1.5 rounded-full w-14 h-14 justify-center sm:w-auto sm:h-auto sm:p-2 sm:pl-2.5 sm:pr-4 sm:rounded-[22px] sm:gap-2.5"
          >
            {/* Avatar Box with 3D Character & Corner AI Badge */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full sm:rounded-[14px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-800 border border-blue-100 dark:border-gray-700 flex items-center justify-center p-0.5 shrink-0 overflow-visible shadow-xs">
              <img
                src="/ai-avatar.png"
                alt="GreatHire AI Avatar"
                className="w-full h-full object-cover rounded-full sm:rounded-[12px] transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="hidden w-full h-full items-center justify-center bg-blue-600 text-white rounded-full font-black text-xs">
                GH
              </div>

              {/* Bottom-Right Corner AI Badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 z-10">
                <Sparkles size={11} className="text-amber-300 fill-amber-300" />
              </div>
            </div>

            {/* Text Copy Section (Laptop / Desktop Only) */}
            <div className="text-left hidden sm:flex flex-col justify-center min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <strong className="text-xs font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
                  GreatHire AI
                </strong>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 leading-tight mt-0.5">
                Career & Education Bot
              </span>
            </div>

            {/* Unread badge */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-white shadow-sm z-20">
                1
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── CHAT WINDOW MODAL / WIDGET ── */}
      {isOpen && (
        <div
          className={`fixed z-[9999] transition-all duration-300 ease-out flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl overflow-hidden
          ${
            isMinimized
              ? "bottom-20 right-4 sm:bottom-[98px] sm:right-6 w-80 h-16"
              : "fixed inset-x-2 bottom-2 top-14 sm:top-auto sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[450px] sm:h-[630px] sm:max-h-[85vh] max-h-[calc(100vh-4rem)]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between select-none shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shadow-inner overflow-hidden border-2 border-white/60">
                  <img
                    src="/ai-avatar.png"
                    alt="GreatHire AI Avatar"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextSibling;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center bg-blue-600 text-white rounded-full font-bold text-xs">
                    GH
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  GreatHire Career AI
                  <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider text-blue-100">
                    Edu Mode
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100/90 font-medium">
                  {isLoading ? "Analyzing roadmap & matching jobs..." : "Educational & Job Assistant"}
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleClearChat}
                title="Restart conversation"
                className="p-1.5 rounded-lg hover:bg-white/20 hover:text-white transition-colors"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 rounded-lg hover:bg-white/20 hover:text-white transition-colors hidden sm:block"
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Body (Hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-gradient-to-b from-slate-50/50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                {/* Educational & Recording Notice Banner */}
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/70 text-xs text-blue-900 dark:text-blue-200 shadow-sm">
                  <div className="flex items-start gap-2">
                    <GraduationCap size={16} className="shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <span>
                      <strong>Educational Bot:</strong> Trained exclusively on career guidance, skill
                      roadmaps, interview preparation, and real GreatHire job openings.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-blue-200/70 dark:border-blue-800/70 text-[11px] text-blue-800 dark:text-blue-300 font-semibold">
                    <ShieldCheck size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      Your conversations are recorded by the GreatHire Team for quality assurance, safety, and guidance improvement.
                    </span>
                  </div>
                </div>

                {/* Messages list */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl p-3.5 shadow-sm ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-md"
                      }`}
                    >
                      {msg.sender === "bot" ? (
                        <FormattedMessage content={msg.text} />
                      ) : (
                        <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </p>
                      )}

                      {/* ── MATCHING JOBS CARD CONTAINER ── */}
                      {msg.jobs && msg.jobs.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-gray-700/80 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              <Briefcase size={14} className="text-blue-600 dark:text-blue-400" />
                              Matching Jobs on GreatHire ({msg.jobs.length})
                            </span>
                            {msg.searchUrl && (
                              <button
                                onClick={() => handleNavigate(msg.searchUrl)}
                                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                              >
                                View all <ArrowRight size={11} />
                              </button>
                            )}
                          </div>

                          <div className="grid gap-2">
                            {msg.jobs.map((job) => (
                              <div
                                key={job.id}
                                className="p-3 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 dark:from-gray-900 dark:to-gray-800/90 border border-blue-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all shadow-xs"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                      {job.title}
                                    </h5>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5 font-medium truncate">
                                      <Building size={12} className="shrink-0 text-gray-400" />
                                      {job.company}
                                    </p>
                                  </div>
                                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    {job.jobType}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-gray-600 dark:text-gray-300">
                                  <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700 font-medium">
                                    <MapPin size={11} className="text-rose-500" />
                                    {job.location}
                                  </span>
                                  {job.salary && (
                                    <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700 font-semibold text-emerald-600 dark:text-emerald-400">
                                      {job.salary}
                                    </span>
                                  )}
                                </div>

                                {job.skills && job.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {job.skills.map((skill, sIdx) => (
                                      <span
                                        key={sIdx}
                                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/90 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-600"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-blue-100/60 dark:border-gray-700/60">
                                  <button
                                    onClick={() => handleNavigate(`/jobs/${job.id}`)}
                                    className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-center transition-colors flex items-center justify-center gap-1"
                                  >
                                    View Job <ChevronRight size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleNavigate(`/apply/${job.id}`)}
                                    className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-center transition-colors"
                                  >
                                    Apply
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── RECOMMENDED COURSES CONTAINER ── */}
                      {msg.courses && msg.courses.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/80 space-y-2">
                          <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <BookOpen size={14} className="text-purple-600 dark:text-purple-400" />
                            Recommended Training Courses
                          </span>

                          <div className="grid gap-2">
                            {msg.courses.map((course, cIdx) => (
                              <div
                                key={cIdx}
                                className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 flex items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-purple-950 dark:text-purple-200">
                                      {course.title}
                                    </span>
                                    {course.badge && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 font-semibold">
                                        {course.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                                    {course.description}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleNavigate(course.link)}
                                  className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-1"
                                >
                                  Enroll <ChevronRight size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>

                    {/* Follow-up Suggestions Chips */}
                    {msg.sender === "bot" && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            disabled={isLoading}
                            className="text-xs px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium transition-all hover:scale-[1.02] active:scale-95 text-left disabled:opacity-50"
                          >
                            💡 {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-blue-200 shadow-xs shrink-0 mt-0.5">
                      <img src="/ai-avatar.png" alt="AI Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Analyzing career roadmap & matching jobs...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Footer */}
              <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
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
                    placeholder="e.g. i want job in mumbai and field is java developer..."
                    disabled={isLoading}
                    className="flex-1 text-base sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:opacity-40 disabled:hover:from-blue-600 transition-all shadow-md shrink-0 active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 px-1">
                  <span>Press Enter to send</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-emerald-500" /> Educational AI Guardrails Active
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
