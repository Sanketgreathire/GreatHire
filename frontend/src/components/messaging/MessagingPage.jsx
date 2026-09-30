 
import { MessageProvider } from '../../context/MessageContext';
import ConversationList from './ConversationList';
import ChatInterface from './ChatInterface';
import { useMessages } from '../../context/MessageContext';

import { useState } from "react";
import axios from "axios";

const MessagingContent = () => {
  const { setActiveConversation } = useMessages();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
   


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
        { withCredentials: true }
      );
      setResults(res.data.messages || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = () => {
    // Load the conversation and navigate
    // (You'll need to fetch conversations and find by _id)
    setQuery("");
    setResults([]);
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-400">
      <div className="w-1/3 min-w-[300px] max-w-[400px] dark:bg-gray-400 flex flex-col">
        {/* ✅ Global search bar */}
        <div className="p-3 border-b bg-white">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          {searching && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
        </div>

        {/* ✅ Search results overlay */}
        {query && results.length > 0 && (
          <div className="flex-1 overflow-y-auto bg-white border-b">
            <p className="p-2 text-xs text-gray-500 bg-gray-50">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((r) => (
              <div
                key={r._id}
                onClick={() => handleSelectResult(r)}
                className="p-3 border-b cursor-pointer hover:bg-blue-50"
              >
                <p className="text-sm font-medium">{r.conversationWith?.fullname}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{r.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Existing conversation list */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList onSelectConversation={handleSelectConversation} />
        </div>
      </div>

      <div className="flex-1">
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
