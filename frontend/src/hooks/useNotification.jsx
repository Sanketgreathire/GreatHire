// Import necessary modules and dependencies
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL, NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector } from "react-redux";
import axios from "axios";

const useNotification = () => {
  const [notifications, setNotifications] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  // Create refs to prevent memory leaks
  const audioRef = useRef(null);
  const socketRef = useRef(null);
  const mountedRef = useRef(true);

  // Setup the audio instance only once
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 0.5; // Set reasonable volume
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch real time notification
  useEffect(() => {
    if (!user) {
      // Clean up socket if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      if (mountedRef.current) {
        setIsConnected(true);
        socket.emit('join', user._id);
        console.log('🔌 Socket connected and joined user room');
      }
    });

    socket.on('disconnect', () => {
      if (mountedRef.current) {
        setIsConnected(false);
        console.log('❌ Socket disconnected');
      }
    });

    socket.on("newNotificationCount", async ({ totalUnseenNotifications }) => {
      if (!mountedRef.current) return;
      
      // Update notifications and play sound only if the new count is greater than the previous one
      setNotifications((prevCount) => {
        if (totalUnseenNotifications > prevCount) {
          // Play the notification sound for admin/owner
          if (user && (user?.role === "Owner" || user?.role === "admin")) {
            audioRef.current?.play().catch((err) => {
              console.log("Audio play failed:", err.message);
            });
          }
        }
        return totalUnseenNotifications;
      });
      
      // Fetch unseen messages
      try {
        const response = await axios.get(
          `${NOTIFICATION_API_END_POINT}/unseen/messages`,
          { withCredentials: true }
        );
        if (response.data.success && mountedRef.current) {
          setMessages((prevMessages) => [
            ...response.data.messages,
            ...prevMessages,
          ]);
        }
      } catch (error) {
        console.error("Error fetching unseen messages:", error);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (socket) {
        socket.emit('leave', user._id);
        socket.disconnect();
      }
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [user]);

  // Fetch all messages
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data } = await axios.get(
        `${NOTIFICATION_API_END_POINT}/getAll-messages`,
        { withCredentials: true }
      );
      if (data.success && mountedRef.current) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [user]);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data } = await axios.get(`${NOTIFICATION_API_END_POINT}/unseen`, {
        withCredentials: true,
      });
      if (data.success && mountedRef.current) {
        setNotifications(data.totalUnseenNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchNotifications();
    } else {
      // Reset state when user logs out
      setNotifications(0);
      setMessages([]);
    }
  }, [user, fetchMessages, fetchNotifications]);

  return { 
    notifications, 
    setNotifications, 
    messages, 
    setMessages,
    isConnected,
    fetchMessages,
    fetchNotifications
  };
};

export default useNotification;
