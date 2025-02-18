import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL, NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector } from "react-redux";
import axios from "axios";

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // Create a ref to hold the audio instance (make sure you have /notification.mp3 in your public folder)
  const audioRef = useRef(null);

  // Setup the audio instance only once
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  // fetch real time notification
  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on("newNotificationCount", ({ totalUnseenNotifications }) => {
      // Update notifications and play sound only if the new count is greater than the previous one
      setNotifications((prevCount) => {
        if (totalUnseenNotifications > prevCount) {
          // Play the notification sound
          if (user?.role === "Owner" || user?.role === "admin") {
            audioRef.current.play().catch((err) => {
              console.error("Failed to play audio:", err);
            });
          }
        }
        return totalUnseenNotifications;
      });
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
