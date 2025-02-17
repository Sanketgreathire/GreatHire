import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector } from "react-redux";
import axios from "axios";

const useMessage = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // fetch unseen notification
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${NOTIFICATION_API_END_POINT}/getAll-messages`,
          {
            withCredentials: true,
          }
        );
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    if (user) fetchMessages();
  }, [user]);

  return { messages, setMessages };
};

export default useMessage;
