import { getIO } from "./socket.js";

const onlineUsers = new Map();

export const isUserOnline = (userId) => {
  if (!userId) return false;
  const key = userId.toString();
  return onlineUsers.has(key) && onlineUsers.get(key).size > 0;
};

// Enhanced socket handlers for messaging
export const setupMessageSocketHandlers = (io) => {
  io.on("connection", (socket) => {

    // Handle joining personal user room (for direct messages)
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user_${userId}`);
      const key = userId.toString();
      if (!onlineUsers.has(key)) onlineUsers.set(key, new Set());
      onlineUsers.get(key).add(socket.id);
       
    });

    socket.on("disconnect", () => {
      for (const [uid, sockets] of onlineUsers.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            onlineUsers.delete(uid);
            
          }
          break;
        }
      }
    });

    // Handle joining conversation rooms for messaging
    socket.on("joinConversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      
    });

    // Handle leaving conversation rooms
    socket.on("leaveConversation", (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
       
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

    // Client tells us it opened a conversation — mark all as read
    socket.on("markAsRead", async ({ conversationId, userId }) => {
      try {
        const { Message } = await import("../models/message.model.js");
        await Message.updateMany(
          { conversation: conversationId, sender: { $ne: userId }, isRead: false },
          { $set: { isRead: true }, $addToSet: { readBy: { user: userId, readAt: new Date() } } }
        );

        // Notify the other participant
        socket.to(`conversation_${conversationId}`).emit("messagesRead", {
          conversationId,
          readBy: userId,
          readAt: new Date(),
        });
      } catch (err) {
        console.error("markAsRead error:", err);
      }
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
