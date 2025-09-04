import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useSelector } from 'react-redux';

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

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!user?._id) return;

    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
      path: '/socket.io',
      withCredentials: true,
    });

    setSocket(socketInstance);

    // Join user room
    socketInstance.emit('joinUserRoom', user._id);
    socketInstance.emit('userOnline', user._id);

    // Fetch conversations when user is authenticated
    fetchConversations();

    return () => {
      socketInstance.emit('userOffline', user._id);
      socketInstance.disconnect();
    };
  }, [user?._id]);

  // Setup Socket.IO listeners
  useEffect(() => {
    if (!socket) return;

    // New message received
    socket.on('newMessage', ({ message, conversationId }) => {
      if (activeConversation?._id === conversationId) {
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

    // Conversation updated
    socket.on('conversationUpdated', (conversation) => {
      setConversations(prev => {
        const exists = prev.find(c => c._id === conversation._id);
        if (exists) {
          return prev.map(c => c._id === conversation._id ? conversation : c);
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
        // Clear typing after 3 seconds
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

    return () => {
      socket.off('newMessage');
      socket.off('conversationUpdated');
      socket.off('messageDeleted');
      socket.off('messageEdited');
      socket.off('userTyping');
      socket.off('userStatusChanged');
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
        recipientId,
        content,
        messageType,
        replyTo
      }, { withCredentials: true });

      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // Start conversation with role validation
  const startConversation = async (recipientId) => {
    try {
      // Validate role compatibility before starting conversation
      if (!user) {
        throw new Error('User must be authenticated to start conversations');
      }

      const response = await axios.post('/api/v1/messages/conversations/start', {
        recipientId
      }, { withCredentials: true });

      const conversation = response.data.conversation;
      setActiveConversation(conversation);
      
      // Join conversation room
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
    
    if (conversation?._id) {
      socket?.emit('joinConversation', conversation._id);
      fetchMessages(conversation._id);
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

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
