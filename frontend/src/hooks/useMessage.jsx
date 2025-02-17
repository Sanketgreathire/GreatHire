import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL, NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector } from "react-redux";
import axios from "axios";

const useNotification = () => {
  const [messages, setMessages] = useState([]);
  console.log(messages);
  const { user } = useSelector((state) => state.auth);


  // fetch unseen notification
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${NOTIFICATION_API_END_POINT}/unseen`,
          {
            withCredentials: true,
          }
        );
        if (data.success) {
            setMessages(data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    if (user) fetchMessages();
  }, [user]);

  return { messages };
};

export default useNotification;
