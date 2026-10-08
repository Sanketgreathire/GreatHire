import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const { user } = useSelector(store => store.auth);
  const typingTimeoutRef = useRef({});

  // Initialize Socket.IO connection — only when user visits /messages
  useEffect(() => {
    if (!user?._id || socket) return;

    let socketInstance;

    (async () => {
      const { io } = await import('socket.io-client');
      const socketUrl =
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_URL ||
        (typeof window !== "undefined" &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
          ? window.location.origin
          : "http://localhost:8000");

      socketInstance = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketInstance.on('connect', () => {
        socketInstance.emit('joinUserRoom', user._id);
        socketInstance.emit('userOnline', user._id);
      });

      socketInstance.on('connect_error', (err) =>
        console.error('❌ Socket error:', err.message)
      );

      setSocket(socketInstance);
      fetchConversations();
    })();

    return () => {
      if (socketInstance) {
        socketInstance.emit('userOffline', user._id);
        socketInstance.disconnect();
      }
    };
  }, [user?._id]);

  // Setup Socket.IO listeners
  useEffect(() => {
    if (!socket) return;

    // New message received
    socket.on('newMessage', ({ message, conversationId }) => {
      if (activeConversation?._id?.toString() === conversationId?.toString()) {
        setMessages(prev => [...prev, message]);
      }

      // Update conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv._id === conversationId
            ? { ...conv, lastMessage: message, lastMessageTime: message.createdAt }
            : conv
        )
      );
    });

    // ✅ Conversation updated — PRESERVE pendingDelivery flag
    socket.on('conversationUpdated', (conversation) => {
      // If the incoming payload is broken (missing participant), refetch from REST
      if (!conversation?.participant) {
        console.warn('⚠️ Broken socket payload, refetching from REST');
        fetchConversations();
        return;
      }

      setConversations(prev => {
        const exists = prev.find(c => c._id === conversation._id);
        if (exists) {
          return prev.map(c =>
            c._id === conversation._id
              ? {
                  ...conversation,
                  // ✅ Preserve local flag — socket payload doesn't carry it
                  pendingDelivery: c.pendingDelivery || false,
                }
              : c
          );
        }
        return [conversation, ...prev];
      });
    });

    // Message deleted
    socket.on('messageDeleted', ({ messageId, conversationId }) => {
      if (activeConversation?._id === conversationId) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      }
    });

    // Message edited
    socket.on('messageEdited', ({ message, conversationId }) => {
      if (activeConversation?._id === conversationId) {
        setMessages(prev =>
          prev.map(msg => msg._id === message._id ? message : msg)
        );
      }
    });

    // Typing indicators
    socket.on('userTyping', ({ userId, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [userId]: isTyping
      }));

      if (isTyping) {
        if (typingTimeoutRef.current[userId]) {
          clearTimeout(typingTimeoutRef.current[userId]);
        }
        typingTimeoutRef.current[userId] = setTimeout(() => {
          setTypingUsers(prev => ({
            ...prev,
            [userId]: false
          }));
        }, 3000);
      }
    });

    // User status changes
    socket.on('userStatusChanged', ({ userId, isOnline }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (isOnline) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    // ✅ Messages read — clears unread + pendingDelivery
    socket.on("messagesRead", ({ conversationId }) => {
      if (activeConversation?._id?.toString() === conversationId?.toString()) {
        setMessages((prev) =>
          prev.map((m) => {
            const senderId = m.sender?._id?.toString();
            if (senderId === user?._id?.toString()) {
              return { ...m, isRead: true };
            }
            return m;
          })
        );
      }

      // Clear pending delivery flag for this conversation
      setConversations(prev =>
        prev.map(c =>
          c._id?.toString() === conversationId?.toString()
            ? { ...c, pendingDelivery: false }
            : c
        )
      );
    });

    return () => {
      socket.off('newMessage');
      socket.off('conversationUpdated');
      socket.off('messageDeleted');
      socket.off('messageEdited');
      socket.off('userTyping');
      socket.off('userStatusChanged');
      socket.off("messagesRead");
    };
  }, [socket, activeConversation]);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/messages/conversations', {
        withCredentials: true,
      });
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId, page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/messages/conversations/${conversationId}/messages?page=${page}&limit=50`,
        { withCredentials: true }
      );

      if (page === 1) {
        setMessages(response.data.messages);
      } else {
        setMessages(prev => [...response.data.messages, ...prev]);
      }

      setHasMoreMessages(response.data.hasMore);

      setConversations(prev =>
        prev.map(c =>
          c._id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send message with authentication check
  const sendMessage = async (recipientId, content, messageType = 'text', replyTo = null) => {
    try {
      if (!user) {
        throw new Error('User must be authenticated to send messages');
      }

      const response = await axios.post('/api/v1/messages/messages/send', {
        recipientId, content, messageType, replyTo
      }, { withCredentials: true });

      // ✅ Mark conversation as pending delivery if recipient is offline
      const { delivered, conversationId: convId } = response.data;

      if (!delivered && convId) {
        setConversations(prev =>
          prev.map(c =>
            c._id?.toString() === convId?.toString()
              ? { ...c, pendingDelivery: true }
              : c
          )
        );
      }

      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // Start conversation with role validation
  const startConversation = async (recipientId) => {
    try {
      if (!user) {
        throw new Error('User must be authenticated to start conversations');
      }

      const response = await axios.post('/api/v1/messages/conversations/start', {
        recipientId
      }, { withCredentials: true });

      const conversation = response.data.conversation;
      setActiveConversation(conversation);

      if (socket) {
        socket.emit('joinConversation', conversation._id);
      }

      return conversation;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw error;
    }
  };

  // Set active conversation
  const setActiveConversationHandler = (conversation) => {
    if (activeConversation?._id) {
      socket?.emit('leaveConversation', activeConversation._id);
    }

    setActiveConversation(conversation);
    setMessages([]);

    // ✅ Clear unread + pendingDelivery when opening conversation
    if (conversation?._id) {
      setConversations(prev =>
        prev.map(c =>
          c._id === conversation._id
            ? { ...c, unreadCount: 0, pendingDelivery: false }
            : c
        )
      );
    }

    if (conversation?._id) {
      socket?.emit('joinConversation', conversation._id);
      fetchMessages(conversation._id);
      if (socket) {
        socket.emit("markAsRead", {
          conversationId: conversation._id.toString(),
          userId: user._id.toString(),
        });
      }
    }
  };

  // Send typing indicator
  const sendTypingIndicator = (isTyping) => {
    if (socket && activeConversation?._id && user?._id) {
      socket.emit('typing', {
        conversationId: activeConversation._id,
        userId: user._id,
        isTyping
      });
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`/api/v1/messages/messages/${messageId}/delete`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  };

  // Edit message
  const editMessage = async (messageId, content) => {
    try {
      const response = await axios.put(`/api/v1/messages/messages/${messageId}/edit`, {
        content
      }, { withCredentials: true });

      return response.data.message;
    } catch (error) {
      console.error('Failed to edit message:', error);
      throw error;
    }
  };

  const value = {
    conversations,
    activeConversation,
    messages,
    typingUsers,
    onlineUsers,
    loading,
    hasMoreMessages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startConversation,
    setActiveConversation: setActiveConversationHandler,
    sendTypingIndicator,
    deleteMessage,
    editMessage,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};