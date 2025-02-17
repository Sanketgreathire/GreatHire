import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL, NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector } from "react-redux";
import axios from "axios";

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // fetch real time notification
  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // fetch unseen notification
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${NOTIFICATION_API_END_POINT}/unseen`,
          {
            withCredentials: true,
          }
        );
        if (data.success) {
          setNotifications(data.totalUnseenNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  return { notifications };
};

export default useNotification;
