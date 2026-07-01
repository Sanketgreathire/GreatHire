import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader } from "lucide-react";
import axios from "axios";

const ChatAssistant = ({ isOpen, onClose, onApplyJD, onJDGenerated, formValues }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm your Job Description Assistant. I can help you:\n\n• **Generate** a professional JD from scratch\n• **Refine** your existing JD\n\nGenerated JDs are saved and can be imported into your Job Details form.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null); // 'generate' | 'refine' | null
  const [refinementGoal, setRefinementGoal] = useState("");
  const [generatedJD, setGeneratedJD] = useState(null); // Track the currently generated JD
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, sender = "user") => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender,
        timestamp: new Date(),
      },
    ]);
  };

  const handleGenerateJD = async () => {
    if (!formValues?.title || !(formValues?.skills?.length > 0)) {
      addMessage(
        "❌ Please fill in at least the job title and skills in the form first.",
        "bot"
      );
      return;
    }

    setLoading(true);

    const skills = Array.isArray(formValues.skills)
      ? formValues.skills.join(", ")
      : String(formValues.skills || "");

    const benefits = Array.isArray(formValues.benefits)
      ? formValues.benefits.join("; ")
      : String(formValues.benefits || "");

    const qualifications = Array.isArray(formValues.qualifications)
      ? formValues.qualifications.join("; ")
      : String(formValues.qualifications || "");

    const responsibilities = Array.isArray(formValues.responsibilities)
      ? formValues.responsibilities.join("; ")
      : String(formValues.responsibilities || "");

    const questions = Array.isArray(formValues.questions)
      ? formValues.questions.filter(Boolean).join("; ")
      : String(formValues.questions || "");

    const additionalContextParts = [
      formValues.companyName && `Company: ${formValues.companyName}`,
      formValues.urgentHiring && `Urgent hiring: ${formValues.urgentHiring}`,
      formValues.department && `Department: ${formValues.department}`,
      formValues.location && `Location: ${formValues.location}`,
      formValues.jobType && `Job type: ${formValues.jobType}`,
      formValues.numberOfOpening && `Openings: ${formValues.numberOfOpening}`,
      formValues.respondTime && `Response time: ${formValues.respondTime} days`,
      formValues.duration && `Duration: ${formValues.duration}`,
      formValues.shift && `Shift: ${formValues.shift}`,
      formValues.noticePeriod && `Notice period: ${formValues.noticePeriod}`,
      formValues.anyAmount && `Applicants pay charges: ${formValues.anyAmount}`,
      formValues.salary && `Salary: ${formValues.salary} ${formValues.salaryType || ""}`,
      benefits && `Benefits: ${benefits}`,
      qualifications && `Qualifications: ${qualifications}`,
      responsibilities && `Responsibilities: ${responsibilities}`,
      questions && `Application questions: ${questions}`,
      formValues.languages && formValues.languages.length > 0 && `Preferred languages: ${Array.isArray(formValues.languages) ? formValues.languages.join(", ") : formValues.languages}`,
      formValues.details && `Current job description: ${formValues.details}`,
    ].filter(Boolean);

    const payload = {
      companyName: formValues.companyName || "",
      urgentHiring: formValues.urgentHiring || "",
      department: formValues.department || "",
      location: formValues.location || "",
      jobType: formValues.jobType || "",
      seniority: formValues.experience || "",
      work_mode: formValues.workPlaceFlexibility || "",
      numberOfOpening: formValues.numberOfOpening || "",
      respondTime: formValues.respondTime || "",
      duration: formValues.duration || "",
      shift: formValues.shift || "",
      noticePeriod: formValues.noticePeriod || "",
      anyAmount: formValues.anyAmount || "",
      salary: formValues.salary || "",
      salaryType: formValues.salaryType || "",
      benefits,
      qualifications,
      responsibilities,
      languages: Array.isArray(formValues.languages)
        ? formValues.languages.join(", ")
        : String(formValues.languages || ""),
      questions,
      details: formValues.details || "",
      title: formValues.title || "",
      skills,
      additional_context: additionalContextParts.join("\n"),
    };

    try {
      addMessage("Generating professional job description...", "user");
      const response = await axios.post(
        "http://127.0.0.1:8001/generate-jd",
        payload
      );

      const jd = response.data.jd;
      try {
        localStorage.setItem('lastGeneratedJD', jd);
      } catch (e) {}
      onJDGenerated?.();
      setGeneratedJD(jd); // Store the generated JD
      addMessage(
        `✅ Generated JD:\n\n${jd}\n\nThis JD is ready to apply. Would you like to use it?`,
        "bot"
      );
      setMode("generated");
    } catch (error) {
      let errorDetails = error.response?.data || error.response?.statusText || error.message;
      if (typeof errorDetails === "object") {
        errorDetails = JSON.stringify(errorDetails);
      }
      console.error('JD generation failed', error.response?.status, error.response?.data, error);
      addMessage(
        `❌ Error generating JD: ${errorDetails}. Make sure the JD service is running.`,
        "bot"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefineJD = async () => {
    if (!formValues?.details) {
      addMessage(
        "❌ Please enter job details in the form first to refine.",
        "bot"
      );
      return;
    }

    if (!refinementGoal.trim()) {
      addMessage(
        "Please tell me what you'd like to improve (e.g., 'make it more concise', 'add more emphasis on skills').",
        "bot"
      );
      return;
    }

    setLoading(true);
    const payload = {
      current_jd: formValues.details,
      goal: refinementGoal,
    };

    try {
      addMessage(`Refining JD to be: ${refinementGoal}...`, "user");
      const response = await axios.post(
        "http://127.0.0.1:8001/refine-jd",
        payload
      );

      const refined = response.data.refined_jd;
      try {
        localStorage.setItem('lastGeneratedJD', refined);
      } catch (e) {}
      onJDGenerated?.();
      setGeneratedJD(refined); // Store the refined JD
      addMessage(
        `✅ Refined JD:\n\n${refined}\n\nThis refined version is ready to apply. Would you like to use it?`,
        "bot"
      );
      setMode("refined");
      setRefinementGoal("");
    } catch (error) {
      addMessage(
        `❌ Error refining JD: ${error.message}. Make sure the JD service is running.`,
        "bot"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJD = (jdText) => {
    // Extract just the JD text without the bot message wrapper
    const cleanJD = jdText
      .replace(/^✅ Generated JD:\n\n/, "")
      .replace(/^✅ Refined JD:\n\n/, "")
      .replace(/\n\nThis (JD|refined version) is.*?\?$/, "")
      .replace(/\n\nWould you like to apply this.*?\?$/, "");

    onApplyJD(cleanJD);
    addMessage("✅ Applied! Check your job details field.", "bot");
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    addMessage(userMsg, "user");
    setInput("");

    if (mode === "generate") {
      if (userMsg.toLowerCase().includes("yes") || userMsg.toLowerCase().includes("apply")) {
        const lastBotMsg = messages.filter((m) => m.sender === "bot").pop();
        if (lastBotMsg && lastBotMsg.text.includes("Generated JD")) {
          handleApplyJD(lastBotMsg.text);
        }
      } else if (userMsg.toLowerCase().includes("refine")) {
        setMode("refine-prompt");
        addMessage(
          "What improvements would you like? (e.g., 'make it more engaging', 'emphasize remote work benefits')",
          "bot"
        );
      } else {
        addMessage("Would you like to apply this JD or refine it further?", "bot");
      }
    } else if (mode === "refine-prompt") {
      setRefinementGoal(userMsg);
      await handleRefineJD();
    } else if (mode === "refined") {
      if (userMsg.toLowerCase().includes("yes") || userMsg.toLowerCase().includes("apply")) {
        const lastBotMsg = messages.filter((m) => m.sender === "bot").pop();
        if (lastBotMsg && lastBotMsg.text.includes("Refined JD")) {
          handleApplyJD(lastBotMsg.text);
        }
      } else {
        addMessage("Would you like to refine again or apply this version?", "bot");
      }
    } else {
      // Initial state
      if (userMsg.toLowerCase().includes("generate")) {
        setMode("generate");
        await handleGenerateJD();
      } else if (userMsg.toLowerCase().includes("refine")) {
        setMode("refine-prompt");
        addMessage(
          "What would you like to improve about your job description?",
          "bot"
        );
      } else {
        addMessage(
          "I can help you **generate** or **refine** job descriptions. Which would you prefer?",
          "bot"
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-end md:items-center md:justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            🤖 Job Description Assistant
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-blue-700 dark:hover:bg-blue-800 p-1 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap break-words ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white dark:bg-blue-700"
                    : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Loader size={16} className="animate-spin" />
                Processing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions - Show when JD is generated or refined */}
        {(mode === "generated" || mode === "refined") && generatedJD && !loading && (
          <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20">
            <button
              onClick={() => handleApplyJD(generatedJD)}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              ✓ Apply to Job Details
            </button>
            <button
              onClick={() => {
                setMode("refine-prompt");
                addMessage(
                  "What improvements would you like? (e.g., 'make it more engaging', 'emphasize remote work benefits')",
                  "bot"
                );
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              ✏️ Refine Further
            </button>
          </div>
        )}

        {/* Quick Actions or Input */}
        {mode === null && messages.length === 1 && (
          <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setMode("generate");
                handleGenerateJD();
              }}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Generate JD
            </button>
            <button
              onClick={() => {
                setMode("refine-prompt");
                addMessage(
                  "What would you like to improve about your job description?",
                  "bot"
                );
              }}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✏️ Refine JD
            </button>
          </div>
        )}

        {/* Input Box */}
        {(mode !== null || messages.length > 1) && (
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatAssistant;
