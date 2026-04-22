import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification } from '../service/notificationservice';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const { user } = useSelector((state) => state.auth);

  // Initialize Socket.IO connection — deferred so it doesn't block initial paint
  useEffect(() => {
    if (!user?._id) return;

    let socketInstance;
    const t = setTimeout(() => {
      socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
        withCredentials: true,
        transports: ['polling', 'websocket'],
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketInstance.on('connect', () => {
        socketInstance.emit('join', user._id);
      });

      setSocket(socketInstance);
    }, 500);

    return () => {
      clearTimeout(t);
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.emit('leave', user._id);
        socketInstance.disconnect();
      }
    };
  }, [user?._id]);

  // Fetch notifications from API with better error handling
  const loadNotifications = useCallback(async () => {
    if (!user?._id) return;
    try {
      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
    try {
      const countData = await getUnreadCount();
      setUnreadCount(countData);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [user?._id]);

  // Setup Socket.IO listeners
  useEffect(() => {
    if (!socket || !user) return;

    socket.on('newNotification', (newNotification) => {
      console.log('📨 New notification received:', newNotification);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Play notification sound if available
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (e) {
        console.log('Audio not available');
      }
    });

    // socket.on('connect', () => {
    //   console.log('🔌 Socket connected');
    //   socket.emit('join', user._id);
    // });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return () => {
      socket.off('newNotification');
      // socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, user]);

  // Load notifications on mount — deferred so it doesn't block initial paint
  useEffect(() => {
    if (!user?._id) return;
    const t = setTimeout(loadNotifications, 800);
    return () => clearTimeout(t);
  }, [loadNotifications]);

  // Mark notification as read
  const handleMarkAsRead = useCallback(async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  // Delete a notification
  const handleDeleteNotification = useCallback(async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n._id === notificationId);
        return notification && !notification.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, [notifications]);

  const contextValue = useMemo(() => ({
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    socket
  }), [notifications, unreadCount, loadNotifications, handleMarkAsRead, handleMarkAllAsRead, handleDeleteNotification, socket]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};