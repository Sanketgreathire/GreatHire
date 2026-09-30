import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getIO } from "../utils/socket.js";

import { isUserOnline } from "../utils/messageSocket.js";
import { sendOfflineMessageNotification } from "../utils/sendEmail.js";

// ─────────────────────────────────────────────
// Resolve a participant ID to full profile data
// (checks BOTH User and Recruiter collections)
// ─────────────────────────────────────────────
const resolveParticipant = async (id) => {
  if (!id) return null;
  const idStr = id._id ? id._id.toString() : id.toString();

  // (jobseeker/candidate)
  const userDoc = await User.findById(idStr)
    .select("fullname emailId.email role profile.profilePhoto")
    .lean();
  if (userDoc) {
    return {
      _id: userDoc._id,
      fullname: userDoc.fullname || "Unknown User",
      role: userDoc.role || "student",
      email: userDoc.emailId?.email || "",
      profilePhoto: userDoc.profile?.profilePhoto || "",
    };
  }

  // Recruiter (recruiter account)
  const RecruiterModel = mongoose.models.Recruiter || mongoose.model("Recruiter");
  const recDoc = await RecruiterModel.findById(idStr)
    .select("fullname email profile role")
    .lean();
  if (recDoc) {
    return {
      _id: recDoc._id,
      fullname: recDoc.fullname || recDoc.companyName || "Recruiter",
      role: recDoc.role || "recruiter",
      email: recDoc.email || "",
      profilePhoto: recDoc.profile?.profilePhoto || recDoc.profilePhoto || "",
    };
  }

  // 3) Fallback — ID only
  return {
    _id: idStr,
    fullname: "Unknown User",
    role: "",
    email: "",
    profilePhoto: "",
  };
};

// ─────────────────────────────────────────────
// Format a conversation for a specific viewer
// ─────────────────────────────────────────────
const formatConversationFor = async (conv, viewerId) => {
  const viewerStr = viewerId.toString();

  // Resolve ALL participants
  const resolvedParts = await Promise.all(
    (conv.participants || []).map((p) => resolveParticipant(p))
  );

  // The OTHER participant (the one who isn't the viewer)
  const other = resolvedParts.find(
    (p) => p && p._id.toString() !== viewerStr
  );

  // Resolve last message sender
  let lastMessage = null;
  if (conv.lastMessage) {
    const sender = conv.lastMessage.sender
      ? await resolveParticipant(conv.lastMessage.sender)
      : null;
    lastMessage = {
      _id: conv.lastMessage._id,
      content: conv.lastMessage.content,
      messageType: conv.lastMessage.messageType,
      createdAt: conv.lastMessage.createdAt,
      sender: sender ? { _id: sender._id, fullname: sender.fullname } : null,
    };
  }

  return {
    _id: conv._id,
    participant: other || null,
    lastMessage,
    lastMessageTime: conv.lastMessageTime || null,
    unreadCount: Number(conv.unreadCounts?.[viewerStr]) || 0,
    createdAt: conv.createdAt,
  };
};

// ─────────────────────────────────────────────
// GET all conversations
// ─────────────────────────────────────────────
export const getConversations = async (req, res) => {
  try {
    const userId = req.id;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: { $ne: false },
    })
      .populate({
        path: "lastMessage",
        select: "content messageType createdAt sender",
      })
      .sort({ lastMessageTime: -1 })
      .lean();

    const formattedConversations = await Promise.all(
      conversations.map((conv) => formatConversationFor(conv, userId))
    );

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
};

// ─────────────────────────────────────────────
// GET messages in a conversation
// ─────────────────────────────────────────────
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const rawMessages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Resolve sender for each message
    const messages = await Promise.all(
      rawMessages.map(async (m) => {
        const sender = await resolveParticipant(m.sender);
        let replyTo = null;
        if (m.replyTo) {
          // We don't have the replyTo content here; keep minimal
          replyTo = { _id: m.replyTo };
        }
        return {
          ...m,
          sender: sender ? { _id: sender._id, fullname: sender.fullname, profilePhoto: sender.profilePhoto } : null,
          replyTo,
        };
      })
    );

    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, isRead: false },
      { $addToSet: { readBy: { user: userId, readAt: new Date() } }, isRead: true,  }
    );

    await conversation.resetUnreadCount(userId);

    const io = getIO();
    io.to(`conversation_${conversationId}`).emit("messagesRead", {
      conversationId: conversationId.toString(),
      readBy: userId.toString(),
      readAt: new Date(),
    });

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

// ─────────────────────────────────────────────
// SEND a new message
// ─────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, messageType = "text", replyTo } = req.body;
    const senderId = req.id;

    if (!recipientId || !content?.trim()) {
      return res.status(400).json({ success: false, message: "Recipient and content are required" });
    }

    // Resolve recipient from User OR Recruiter
    const recipient = await resolveParticipant(recipientId);
    if (!recipient || recipient.fullname === "Unknown User") {
      return res.status(404).json({ success: false, message: "Recipient not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      isGroup: false,
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        isActive: true,
        unreadCounts: new Map([[senderId, 0], [recipientId, 0]]),
      });
    }

    const message = new Message({
      conversation: conversation._id,
      sender: senderId,
      content: content.trim(),
      messageType,
      replyTo: replyTo || null,
       
    });

    await message.save();

    conversation.lastMessage = message._id;
    conversation.lastMessageTime = new Date();
    await conversation.incrementUnreadCount(recipientId);
    await conversation.save();

    const io = getIO();

    // Resolve sender for the emit
    const senderResolved = await resolveParticipant(senderId);
    const messageForEmit = {
      _id: message._id,
      conversation: message.conversation,
      content: message.content,
      messageType: message.messageType,
      createdAt: message.createdAt,
      sender: senderResolved
        ? { _id: senderResolved._id, fullname: senderResolved.fullname, profilePhoto: senderResolved.profilePhoto }
        : null,
    };

    // Emit newMessage to recipient
    io.to(`user_${recipientId}`).emit("newMessage", {
      message: messageForEmit,
      conversationId: conversation._id.toString(),
    });

    // Re-fetch conversation to format
    const freshConv = await Conversation.findById(conversation._id)
      .populate({
        path: "lastMessage",
        select: "content messageType createdAt sender",
      })
      .lean();

    // Emit formatted conversationUpdated for BOTH users
    const formattedForSender = await formatConversationFor(freshConv, senderId);
    const formattedForRecipient = await formatConversationFor(freshConv, recipientId);

    io.to(`user_${senderId}`).emit("conversationUpdated", formattedForSender);
    io.to(`user_${recipientId}`).emit("conversationUpdated", formattedForRecipient);

    // ── Email fallback for offline recipient ──
    const recipientOnline = isUserOnline(recipientId);

    if (!recipientOnline) {
       

      // Guard 1: must have an email
      if (!recipient.email || !recipient.email.includes("@")) {
        console.log(`⚠️ No valid email for recipient — skipping email`);
      } else {
        // Guard 2: only send if email is verified (optional — remove if not enforcing)
        const recipientUser = await User.findById(recipientId)
          .select("emailId.isVerified")
          .lean();

        const isVerified = true;

        if (!isVerified) {
          console.log(`⚠️ Recipient email not verified — skipping email`);
        } else {
 
          sendOfflineMessageNotification({
            to: recipient.email,
            recipientName: recipient.fullname,
            senderName: senderResolved.fullname,
            conversationId: conversation._id.toString(),
          })
            
            .catch((err) => console.error("❌ Email notify error:", err));
        }
      }
    } else {
      console.log(`🟢 Recipient ${recipientId} online — no email needed`);
    }

    res.status(201).json({
      success: true,
      message: messageForEmit,
      conversationId: conversation._id,
       delivered: recipientOnline,
    });


  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

// ─────────────────────────────────────────────
// START a new conversation
// ─────────────────────────────────────────────
export const startConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.id;

    if (!recipientId) {
      return res.status(400).json({ success: false, message: "Recipient ID is required" });
    }

    const recipient = await resolveParticipant(recipientId);
    if (!recipient || recipient.fullname === "Unknown User") {
      return res.status(404).json({ success: false, message: "Recipient not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      isGroup: false,
    })
      .populate({
        path: "lastMessage",
        select: "content messageType createdAt sender",
      })
      .lean();

    if (!conversation) {
      const newConv = new Conversation({
        participants: [senderId, recipientId],
        isActive: true,
        unreadCounts: new Map([[senderId, 0], [recipientId, 0]]),
      });
      await newConv.save();
      conversation = newConv.toObject();
    }

    const formatted = await formatConversationFor(conversation, senderId);

    res.status(200).json({ success: true, conversation: formatted });
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ success: false, message: "Failed to start conversation" });
  }
};

// ─────────────────────────────────────────────
// DELETE a message
// ─────────────────────────────────────────────
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    const message = await Message.findOne({ _id: messageId, sender: userId });
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found or unauthorized" });
    }

    await message.softDelete();

    const io = getIO();
    const conversation = await Conversation.findById(message.conversation);
    conversation.participants.forEach((participantId) => {
      io.to(`user_${participantId}`).emit("messageDeleted", {
        messageId,
        conversationId: message.conversation.toString(),
      });
    });

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Failed to delete message" });
  }
};

// ─────────────────────────────────────────────
// EDIT a message
// ─────────────────────────────────────────────
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.id;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const message = await Message.findOne({ _id: messageId, sender: userId });
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found or unauthorized" });
    }

    await message.editMessage(content.trim());

    const senderResolved = await resolveParticipant(userId);
    const messageForEmit = {
      _id: message._id,
      content: message.content,
      messageType: message.messageType,
      createdAt: message.createdAt,
      sender: senderResolved
        ? { _id: senderResolved._id, fullname: senderResolved.fullname }
        : null,
    };

    const io = getIO();
    const conversation = await Conversation.findById(message.conversation);
    conversation.participants.forEach((participantId) => {
      io.to(`user_${participantId}`).emit("messageEdited", {
        message: messageForEmit,
        conversationId: message.conversation.toString(),
      });
    });

    res.status(200).json({ success: true, message: messageForEmit });
  } catch (error) {
    console.error("Error editing message:", error);
    res.status(500).json({ success: false, message: "Failed to edit message" });
  }
};

// ─────────────────────────────────────────────
// SEARCH conversations
// ─────────────────────────────────────────────
export const searchConversations = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.id;

    if (!query?.trim()) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const conversations = await Conversation.find({
      participants: userId,
      isActive: { $ne: false },
    })
      .populate({ path: "lastMessage", select: "content messageType createdAt sender" })
      .lean();

    const formattedAll = await Promise.all(
      conversations.map((conv) => formatConversationFor(conv, userId))
    );

    const filteredConversations = formattedAll.filter(
      (conv) =>
        conv.participant &&
        (conv.participant.fullname?.toLowerCase().includes(query.toLowerCase()) ||
          conv.participant.email?.toLowerCase().includes(query.toLowerCase()))
    );

    res.status(200).json({ success: true, conversations: filteredConversations });
  } catch (error) {
    console.error("Error searching conversations:", error);
    res.status(500).json({ success: false, message: "Failed to search conversations" });
  }
};


// ─────────────────────────────────────────────
// SEARCH messages in user's conversations
// ─────────────────────────────────────────────
export const searchMessages = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.id;

    if (!query?.trim()) {
      return res.status(400).json({ success: false, message: "Query required" });
    }

    // Get user's conversations
    const convos = await Conversation.find({ participants: userId, isActive: { $ne: false } })
      .select("_id")
      .lean();
    const convoIds = convos.map((c) => c._id);

    // Search messages (case-insensitive regex)
    const messages = await Message.find({
      conversation: { $in: convoIds },
      isDeleted: false,
      content: { $regex: query, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Resolve sender + conversation info
    const results = await Promise.all(
      messages.map(async (m) => {
        const sender = await resolveParticipant(m.sender);
        const convo = await Conversation.findById(m.conversation)
          .select("participants")
          .lean();

        // Find the OTHER participant for display
        const otherId = convo.participants.find(
          (p) => p.toString() !== userId.toString()
        );
        const other = await resolveParticipant(otherId);

        return {
          _id: m._id,
          content: m.content,
          createdAt: m.createdAt,
          conversationId: m.conversation,
          sender: sender ? { _id: sender._id, fullname: sender.fullname } : null,
          conversationWith: other ? { _id: other._id, fullname: other.fullname } : null,
        };
      })
    );

    res.status(200).json({ success: true, messages: results });
  } catch (error) {
    console.error("Error searching messages:", error);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};