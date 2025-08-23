import { getIO } from "./socket.js";

// Enhanced socket handlers for messaging
export const setupMessageSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    
    // Handle joining conversation rooms for messaging
    socket.on("joinConversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on("leaveConversation", (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Handle typing indicators
    socket.on("typing", ({ conversationId, userId, isTyping }) => {
      socket.to(`conversation_${conversationId}`).emit("userTyping", {
        userId,
        isTyping,
      });
    });

    // Handle user online/offline status
    socket.on("userOnline", (userId) => {
      socket.broadcast.emit("userStatusChanged", {
        userId,
        isOnline: true,
        lastSeen: new Date(),
      });
    });

    socket.on("userOffline", (userId) => {
      socket.broadcast.emit("userStatusChanged", {
        userId,
        isOnline: false,
        lastSeen: new Date(),
      });
    });

    // Handle message delivery confirmation
    socket.on("messageDelivered", ({ messageId, conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit("messageDeliveryConfirmed", {
        messageId,
      });
    });

    // Handle message read confirmation
    socket.on("messageRead", ({ messageId, conversationId, userId }) => {
      socket.to(`conversation_${conversationId}`).emit("messageReadConfirmed", {
        messageId,
        userId,
      });
    });
  });
};

// Utility functions for emitting message events
export const emitNewMessage = (recipientId, messageData) => {
  const io = getIO();
  io.to(`user_${recipientId}`).emit("newMessage", messageData);
};

export const emitConversationUpdate = (userId, conversationData) => {
  const io = getIO();
  io.to(`user_${userId}`).emit("conversationUpdated", conversationData);
};

export const emitMessageDeleted = (conversationId, messageId) => {
  const io = getIO();
  io.to(`conversation_${conversationId}`).emit("messageDeleted", {
    messageId,
    conversationId,
  });
};

export const emitMessageEdited = (conversationId, messageData) => {
  const io = getIO();
  io.to(`conversation_${conversationId}`).emit("messageEdited", messageData);
};
