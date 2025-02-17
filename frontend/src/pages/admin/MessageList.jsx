import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useMessage from "@/hooks/useMessage";
import { Trash2 } from "lucide-react";
import Navbar from "@/components/admin/Navbar";
import { NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";

const MessageList = () => {
  // Assuming useMessage returns messages and setMessages
  const { messages, setMessages } = useMessage();

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
                  {/* Delete Button */}
                  <Trash2
                    onClick={() => handleDeleteMessage(msg.id, msg.type)}
                    className=" cursor-pointer text-red-600 "
                    size={25}
                  />
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
                          <p key={index} className="text-gray-700">
                            {m}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-700">{msg.message}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {msg.reportTitle}
                    </h2>
                    <p className="text-gray-600">
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
