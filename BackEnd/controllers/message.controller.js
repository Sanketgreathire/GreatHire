// import { Conversation } from "../models/conversation.model.js";
// import { Message } from "../models/message.model.js";
// import { User } from "../models/user.model.js";
import { getIO } from "../utils/socket.js";

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.id;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate({
        path: "participants",
        select: "fullname email profilePhoto role",
      })
      .populate({
        path: "lastMessage",
        select: "content messageType createdAt sender",
        populate: {
          path: "sender",
          select: "fullname",
        },
      })
      .sort({ lastMessageTime: -1 });

    // Format conversations with unread counts
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== userId
      );
      
      return {
        _id: conv._id,
        participant: otherParticipant,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        unreadCount: conv.unreadCounts.get(userId) || 0,
        createdAt: conv.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

// Get messages for a specific conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate("sender", "fullname profilePhoto")
      .populate("replyTo", "content sender")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        isRead: false,
      },
      {
        $addToSet: { readBy: { user: userId, readAt: new Date() } },
        isRead: true,
      }
    );

    // Reset unread count for this user
    await conversation.resetUnreadCount(userId);

    res.status(200).json({
      success: true,
      messages: messages.reverse(), // Reverse to get chronological order
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, messageType = "text", replyTo } = req.body;
    const senderId = req.id;

    if (!recipientId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Recipient and content are required",
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found",
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      isGroup: false,
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        unreadCounts: new Map([
          [senderId, 0],
          [recipientId, 0],
        ]),
      });
    }

    // Create message
    const message = new Message({
      conversation: conversation._id,
      sender: senderId,
      content: content.trim(),
      messageType,
      replyTo: replyTo || null,
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageTime = new Date();
    await conversation.incrementUnreadCount(recipientId);
    await conversation.save();

    // Populate message for response
    await message.populate("sender", "fullname profilePhoto");
    if (replyTo) {
      await message.populate("replyTo", "content sender");
    }

    // Emit real-time message
    const io = getIO();
    io.to(`user_${recipientId}`).emit("newMessage", {
      message,
      conversationId: conversation._id,
    });

    // Emit conversation update to both users
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "fullname email profilePhoto")
      .populate("lastMessage", "content messageType createdAt sender");

    io.to(`user_${senderId}`).emit("conversationUpdated", populatedConversation);
    io.to(`user_${recipientId}`).emit("conversationUpdated", populatedConversation);

    res.status(201).json({
      success: true,
      message,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// Start a new conversation
export const startConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.id;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: "Recipient ID is required",
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found",
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      isGroup: false,
    }).populate("participants", "fullname email profilePhoto");

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [senderId, recipientId],
        unreadCounts: new Map([
          [senderId, 0],
          [recipientId, 0],
        ]),
      });
      await conversation.save();
      await conversation.populate("participants", "fullname email profilePhoto");
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start conversation",
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found or unauthorized",
      });
    }

    await message.softDelete();

    // Emit real-time update
    const io = getIO();
    const conversation = await Conversation.findById(message.conversation);
    conversation.participants.forEach((participantId) => {
      io.to(`user_${participantId}`).emit("messageDeleted", {
        messageId,
        conversationId: message.conversation,
      });
    });

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

// Edit a message
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.id;

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found or unauthorized",
      });
    }

    await message.editMessage(content.trim());
    await message.populate("sender", "fullname profilePhoto");

    // Emit real-time update
    const io = getIO();
    const conversation = await Conversation.findById(message.conversation);
    conversation.participants.forEach((participantId) => {
      io.to(`user_${participantId}`).emit("messageEdited", {
        message,
        conversationId: message.conversation,
      });
    });

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error editing message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit message",
    });
  }
};

// Search conversations
export const searchConversations = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.id;

    if (!query?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate({
        path: "participants",
        match: {
          $or: [
            { fullname: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
        select: "fullname email profilePhoto",
      })
      .populate("lastMessage", "content messageType createdAt");

    const filteredConversations = conversations.filter(
      (conv) => conv.participants.some((p) => p !== null)
    );

    res.status(200).json({
      success: true,
      conversations: filteredConversations,
    });
  } catch (error) {
    console.error("Error searching conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search conversations",
    });
  }
};
