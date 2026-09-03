import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Send,
  Bot,
  Loader2,
  Sparkles,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Eye,
} from "lucide-react";
import { COPILOT_API_END_POINT } from "../../utils/ApiEndPoint";

const STARTER_PROMPTS = [
  "Senior React developers in Bangalore, open to work",
  "Backend engineers with 3-6 years, strong in Node.js",
  "Data analysts with SQL and Power BI, remote",
  "Frontend candidates with startup experience",
];

const CandidateCard = ({ candidate, onTrack }) => {
  const name = candidate.profile?.fullName || candidate.fullName || "Unnamed candidate";
  const designation = candidate.profile?.designation || candidate.designation || "";
  const company = candidate.profile?.currentCompany || candidate.currentCompany || "";
  const location = candidate.profile?.location || candidate.location || "";
  const experience = candidate.profile?.totalExperience ?? candidate.totalExperience;
  const skills = candidate.profile?.skills || candidate.skills || [];
  const githubUrl = candidate.profile?.githubUrl || candidate.githubUrl;
  const linkedinUrl = candidate.profile?.linkedinUrl || candidate.linkedinUrl;
  const resumeUrl = candidate.profile?.resumeUrl || candidate.resumeUrl;
  const score = candidate._scores?.total;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{name}</h4>
          {(designation || company) && (
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Briefcase size={14} />
              {designation}
              {designation && company ? " · " : ""}
              {company}
            </p>
          )}
          {location && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={14} />
              {location}
              {experience != null && ` · ${experience} yrs exp`}
            </p>
          )}
        </div>
        {typeof score === "number" && (
          <span className="shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {Math.round(score * 100)}% match
          </span>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.slice(0, 6).map((skill, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
              <Github size={16} />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-700">
              <Linkedin size={16} />
            </a>
          )}
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
              <FileText size={16} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            title="Viewed"
            onClick={() => onTrack(candidate._id, "viewed")}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          >
            <Eye size={16} />
          </button>
          <button
            title="Shortlist"
            onClick={() => onTrack(candidate._id, "shortlisted")}
            className="p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600"
          >
            <ThumbsUp size={16} />
          </button>
          <button
            title="Not a fit"
            onClick={() => onTrack(candidate._id, "rejected")}
            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CopilotChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${COPILOT_API_END_POINT}/chat`,
        { message: trimmed },
        { withCredentials: true }
      );

      if (data?.success) {
        setMessages((prev) => [...prev, { role: "assistant", result: data.data }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", error: data?.message || "Something went wrong." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          error:
            err?.response?.data?.message ||
            "Couldn't reach the copilot service. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (candidateId, interactionType) => {
    if (!candidateId) return;
    try {
      await axios.post(
        `${COPILOT_API_END_POINT}/track`,
        { candidateId, interactionType },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to track interaction:", err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-6rem)]">
      <Helmet>
        <title>AI Copilot | GreatHire Recruiter Dashboard</title>
      </Helmet>

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-blue-600" size={22} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Copilot</h1>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <Bot className="mx-auto text-blue-500 mb-3" size={36} />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Describe who you're looking for, in plain English.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-full w-full">
                {msg.error ? (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-xl">
                    {msg.error}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Bot size={16} />
                      Found {msg.result.candidates?.length || 0} candidates ·{" "}
                      {Math.round((msg.result.insights?.confidence || 0) * 100)}% confidence ·{" "}
                      {msg.result.insights?.searchMode === "hybrid" ? "AI semantic search" : "keyword search"}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {(msg.result.candidates || []).map((candidate) => (
                        <CandidateCard key={candidate._id} candidate={candidate} onTrack={handleTrack} />
                      ))}
                    </div>

                    {msg.result.candidates?.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No matches yet — try broadening the skills, location, or experience range.
                      </p>
                    )}

                    {msg.result.suggestions?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.result.suggestions.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                          >
                            💡 {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <Loader2 className="animate-spin" size={16} />
            Searching candidates...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Senior React developers in Pune, open to work"
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default CopilotChat;