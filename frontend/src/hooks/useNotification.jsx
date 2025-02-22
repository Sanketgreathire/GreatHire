import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL, NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector } from "react-redux";
import axios from "axios";
const useNotification = () => {
  const [notifications, setNotifications] = useState();
  const [messages, setMessages] = useState([]);
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

    socket.on("newNotificationCount", async ({ totalUnseenNotifications }) => {
      // Update notifications and play sound only if the new count is greater than the previous one
      setNotifications((prevCount) => {
        if (totalUnseenNotifications > prevCount) {
          // Play the notification sound
          if (user && (user?.role === "Owner" || user?.role === "admin")) {
            audioRef.current.play().catch((err) => {
              console.error("Failed to play audio:", err);
            });
          }
        }
        return totalUnseenNotifications;
      });
      // Call API to fetch unseen messages from JobReport and Contact models
      try {
        const response = await axios.get(
          `${NOTIFICATION_API_END_POINT}/unseen/messages`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setMessages((prevMessages) => [
            ...response.data.messages,
            ...prevMessages,
          ]);
        }
      } catch (error) {
        console.error("Error fetching unseen messages:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // fetch all message
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

  // fetch all notification
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${NOTIFICATION_API_END_POINT}/unseen`, {
        withCredentials: true,
      });
      if (data.success) {
        setNotifications(data.totalUnseenNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // fetch unseen notification
  useEffect(() => {
    if (user) {
      // this function help to fetch notification and message after user login
      fetchMessages();
      fetchNotifications();
    }
  }, [user]);

  return { notifications, setNotifications, messages, setMessages };
};

export default useNotification;
