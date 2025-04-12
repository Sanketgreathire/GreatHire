// Import necessary modules and dependencies
import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useNotification from "@/hooks/useNotification";
import { Trash2, Eye } from "lucide-react";
import Navbar from "@/components/admin/Navbar";
import { NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { useNavigate } from "react-router-dom";

const MessageList = () => {
  // Assuming useMessage returns messages and setMessages
  const { messages, setMessages } = useNotification();
  const navigate = useNavigate();
  // State to manage replies
  const [replies, setReplies] = React.useState({});

  
  // Manage loading state per message (you can use a single boolean for all or an object keyed by msg.id)
  const [loadingReply, setLoadingReply] = React.useState({});


  // Delete a single message according to its type
  const handleDeleteMessage = async (msgId, type) => {
    try {
      let response;
      if (type === "contact") {
        response = await axios.delete(
          `${NOTIFICATION_API_END_POINT}/contacts/${msgId}`,
          {
            withCredentials: true,
          }
        );
      } else if (type === "job_report") {
        response = await axios.delete(
          `${NOTIFICATION_API_END_POINT}/jobReports/${msgId}`,
          {
            withCredentials: true,
          }
        );
      }
      if (response.data.success) {
        // Update local state after deletion
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  };

  // Delete all messages
  const handleDeleteAllMessages = async () => {
    try {
      const response = await axios.delete(
        `${NOTIFICATION_API_END_POINT}/deleteMessages`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessages([]);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting all messages:", error);
      toast.error("Error deleting all messages");
    }
  };
  // Reply handler
  const handleReplyToUser = async (msgId, type, replyMessage) => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }
    //console.log("Replying to message:", msgId, type, replyMessage);
    // Mark the reply as loading for this message
    setLoadingReply((prev) => ({ ...prev, [msgId]: true }));

    try {
      const response = await axios.post(
        `${NOTIFICATION_API_END_POINT}/sendreply`,
        {
          msgId,
          type,
          replyMessage,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Reply sent successfully!");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply.");
    }finally {
      // Remove loading state after request
      setLoadingReply((prev) => ({ ...prev, [msgId]: false }));
    }
  };


  return (
    <>
      <Navbar linkName={"Messages"} />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-thin">Messages</h1>
            {messages.length > 0 && (
              <button
                onClick={handleDeleteAllMessages}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete All
              </button>
            )}
          </div>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white shadow-md rounded-lg p-6 relative"
              >
                {/* Header Section */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col space-y-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold text-white text-center rounded-full ${
                        msg.type === "contact" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {msg.type === "contact" ? "Contact" : "Job Report"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    {msg.type !== "contact" && (
                      <Eye
                        size={25}
                        onClick={() =>
                          navigate(`/admin/job/details/${msg.job.jobId}`)
                        }
                        className=" cursor-pointer text-blue-700 "
                      />
                    )}
                    {/* Delete Button */}
                    <Trash2
                      onClick={() => handleDeleteMessage(msg.id, msg.type)}
                      className=" cursor-pointer text-red-600 "
                      size={25}
                    />
                  </div>
                </div>

                {/* Content Section */}
                {msg.type === "contact" ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{msg.name}</h2>
                    <p className="text-gray-600">
                      <strong>Email:</strong> {msg.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {msg.phoneNumber}
                    </p>
                    <div className="mt-2">
                      <h3 className="font-semibold mb-1">Message:</h3>
                      {Array.isArray(msg.message) ? (
                        msg.message.map((m, index) => (
                          <p
                            key={index}
                            className="text-gray-700 h-12 overflow-y-scroll"
                          >
                            {m}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-700 h-12 overflow-y-scroll">
                          {msg.message}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {msg.reportTitle}
                    </h2>
                    <p className="text-gray-600 h-12 overflow-y-scroll">
                      <strong>Description:</strong> {msg.description}
                    </p>
                    <div className="flex gap-60">
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-1">
                          Job Details:
                        </h3>
                        <p className="text-gray-600">
                          <strong>Title:</strong> {msg.job?.title}
                        </p>
                        <p className="text-gray-600">
                          <strong>Company:</strong> {msg.job?.companyName}
                        </p>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-1">
                          User Details:
                        </h3>
                        <p className="text-gray-600">
                          <strong>Name:</strong> {msg.user?.fullname}
                        </p>
                        <p className="text-gray-600">
                          <strong>Email:</strong> {msg.user?.email}
                        </p>
                        <p className="text-gray-600">
                          <strong>Phone:</strong> {msg.user?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Reply Section */}
                <div className="mt-4">
                  <textarea
                    rows={2}
                    placeholder="Write your reply here..."
                    value={replies[msg.id] || ""}
                    onChange={(e) =>
                      setReplies((prev) => ({
                        ...prev,
                        [msg.id]: e.target.value,
                      }))
                    }
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                  <button
                    onClick={() =>
                      handleReplyToUser(msg.id, msg.type, replies[msg.id] || "")
                    }
                    disabled={loadingReply[msg.id]}
                    className={`mt-2 px-6 py-2 rounded-lg transition-all duration-200 text-sm font-semibold tracking-wide shadow-md ${
                      loadingReply[msg.id]
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loadingReply[msg.id] ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-gray-500">No messages found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageList;
