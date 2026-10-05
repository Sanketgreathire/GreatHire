import { MessageProvider } from "../../context/MessageContext";
import ConversationList from "./ConversationList";
import ChatInterface from "./ChatInterface";
import { useMessages } from "../../context/MessageContext";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MessagingContent = () => {
  const { activeConversation, setActiveConversation } = useMessages();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();

  // Hide chatbot and WhatsApp widgets only on Messages page
  useEffect(() => {
    const styleTag = document.createElement("style");

    styleTag.id = "hide-widgets-messages-page";

    styleTag.innerHTML = `
      [class*="whatsapp" i],
      [id*="whatsapp" i],
      [class*="chatbot" i],
      [id*="chatbot" i],
      [class*="GreatHire" i],
      [id*="GreatHire" i],
      a[href*="whatsapp.com"],
      a[href*="wa.me"],
      iframe[src*="chatbot"],
      div[style*="z-index: 9999"],
      div[style*="z-index: 99999"],
      div[class*="fixed"][class*="bottom-"],
      div[style*="position: fixed"][style*="bottom"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;

    document.head.appendChild(styleTag);

    return () => {
      const existingTag = document.getElementById(
        "hide-widgets-messages-page"
      );

      if (existingTag) {
        existingTag.remove();
      }
    };
  }, []);

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);

    try {
      const res = await axios.get(
        `/api/v1/messages/messages/search?query=${encodeURIComponent(value)}`,
        {
          withCredentials: true,
        }
      );

      setResults(res.data.messages || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = () => {
    setQuery("");
    setResults([]);
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  return (
    <div className="h-[100dvh] min-h-0 w-full flex overflow-hidden bg-gray-100 dark:bg-gray-400">
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/3 min-w-0 md:min-w-[300px] max-w-none md:max-w-[400px] dark:bg-gray-400 flex-col ${
          activeConversation ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Mobile Back Button */}
        {activeConversation && (
          <button
            onClick={() => setActiveConversation(null)}
            className="md:hidden absolute top-3 left-3 z-50 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-md text-xs font-semibold"
          >
            ← Back
          </button>
        )}

        {/* GreatHire Logo */}
        <div className="p-4 border-b bg-white dark:bg-gray-800 flex items-center justify-between shrink-0">
          <div
            onClick={() => navigate("/profile")}
            className="cursor-pointer flex items-center gap-1 select-none"
          >
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Great
            </span>

            <span className="text-2xl font-black text-blue-600 tracking-tight">
              Hire
            </span>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
            Messages
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="p-3 border-b bg-white dark:bg-gray-800">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
          />

          {searching && (
            <p className="text-xs text-gray-400 mt-1">
              Searching...
            </p>
          )}
        </div>

        {/* Search Results */}
        {query && results.length > 0 && (
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 border-b">
            <p className="p-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-700">
              {results.length} result
              {results.length !== 1 ? "s" : ""}
            </p>

            {results.map((r) => (
              <div
                key={r._id}
                onClick={() => handleSelectResult(r)}
                className="p-3 border-b cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                <p className="text-sm font-medium">
                  {r.conversationWith?.fullname}
                </p>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {r.content}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`${
          !activeConversation ? "hidden md:flex" : "flex"
        } flex-1 flex-col min-w-0 w-full bg-white dark:bg-gray-900 h-full relative overflow-hidden`}
      >
        <ChatInterface />
      </div>
    </div>
  );
};

const MessagingPage = () => {
  return (
    <MessageProvider>
      <MessagingContent />
    </MessageProvider>
  );
};

export default MessagingPage;