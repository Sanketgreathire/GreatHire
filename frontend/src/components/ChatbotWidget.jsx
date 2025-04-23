import React, { useState } from "react";
import axios from "axios";
import { Send, Bot, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:8000/api/v1/chatbot/ask", {
        message: input,
      });
      const botReply = res.data.response;
      setMessages([...newMessages, { from: "bot", text: botReply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { from: "bot", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="font-semibold">GreatHire Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap break-words ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start mr-auto"
                }`}
              >
                {msg.from === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center border-t px-2 py-2 bg-white">
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
              placeholder="Ask about jobs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="ml-2 bg-blue-600 p-2 rounded-full text-white"
              onClick={handleSend}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
          onClick={() => setIsOpen(true)}
        >
          <Bot />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
