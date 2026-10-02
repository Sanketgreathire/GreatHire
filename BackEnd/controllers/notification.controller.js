import Notification from "../models/notification.model.js";
import mongoose from "mongoose";
import { Contact } from "../models/contact.model.js";
import nodemailer from "nodemailer";

// Helper function to get user role model
const getUserRoleModel = (role) => {
  switch (role) {
    case "recruiter": return "Recruiter";
    case "admin": return "Admin";
    default: return "User";
  }
};

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==============================
// Get notifications for the authenticated user
// ==============================
export const getNotifications = async (req, res) => {
  try {
    // Check both req.user and req.id
    const userId = req.user?._id || req.id;
    const userRole = req.user?.role || "student";

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const role = getUserRoleModel(userRole);
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      recipient: userId,
      recipientModel: role,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Notification.countDocuments({
      recipient: userId,
      recipientModel: role,
    });

    return res.status(200).json({ 
      success: true, 
      notifications: notifications || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: Math.ceil((totalCount || 0) / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    // Server crash hone ke bajaye clear error details dein
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch notifications" 
    });
  }
};

// ==============================
// Mark a single notification as read
// ==============================
export const markAsRead = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid notification ID" 
      });
    }

    const role = getUserRoleModel(req.user.role);

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: id,
        recipient: req.user._id,
        recipientModel: role
      },
      { isRead: true, readAt: new Date() },
      { new: true, lean: true }
    );

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: "Notification not found or access denied" 
      });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid notification ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to mark notification as read" 
    });
  }
};

// ==============================
// Mark all notifications as read for the authenticated user
// ==============================
export const markAllAsRead = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const role = getUserRoleModel(req.user.role);

    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        recipientModel: role,
        isRead: false,
      },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({ 
      success: true, 
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to mark all notifications as read" 
    });
  }
};

// ==============================
// Create a new notification (internal use)
// ==============================
export const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// ==============================
// Get notifications for admin
// ==============================
export const getAdminNotifications = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Security: Only admins can access admin notifications
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    const notifications = await Notification.find({
      recipientModel: "Admin",
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==============================
// Mark admin notification as read
// ==============================
export const markAdminNotificationAsRead = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Security: Only admins can mark admin notifications as read
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: id,
        recipientModel: "Admin"
      },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Admin notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error marking admin notification as read:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==============================
// Get unread notification count for user
// ==============================
export const getUnreadCount = async (req, res) => {
  try {
    // ✅ Add Auth Check to prevent crash
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const role = getUserRoleModel(req.user.role);

    const count = await Notification.countDocuments({
      recipient: req.user._id,
      recipientModel: role,
      isRead: false, 
    });

    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==============================
// Delete a notification
// ==============================
export const deleteNotification = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid notification ID" 
      });
    }

    const role = getUserRoleModel(req.user.role);

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: req.user._id,
      recipientModel: role
    });

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: "Notification not found or access denied" 
      });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid notification ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete notification" 
    });
  }
};

// Test notification endpoint
export const testNotification = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const role = getUserRoleModel(req.user.role);
    
    const testNotification = new Notification({
      recipient: req.user._id,
      recipientModel: role,
      type: 'system-alert',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working.',
      priority: 'medium'
    });

    await testNotification.save();

    res.status(200).json({ 
      success: true, 
      message: "Test notification created successfully",
      notification: testNotification
    });
  } catch (error) {
    console.error("Error creating test notification:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create test notification" 
    });
  }
};

// ==============================
// Admin Messages (contact form)
// ==============================
const toMessage = (c) => ({
  id: c._id,
  type: "contact",
  name: c.name,
  email: c.email,
  phoneNumber: c.phoneNumber,
  message: c.message,
  status: c.status,
  createdAt: c.createdAt,
});

const requireAdmin = (req, res) => {
  if (!req.user?._id) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return false;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
    return false;
  }
  return true;
};

export const getAllMessages = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, messages: contacts.map(toMessage) });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUnseenMessages = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const contacts = await Contact.find({ status: "unseen" }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, messages: contacts.map(toMessage) });
  } catch (error) {
    console.error("Error fetching unseen messages:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    return res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteAllMessages = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    await Contact.deleteMany({});
    return res.status(200).json({ success: true, message: "All messages deleted" });
  } catch (error) {
    console.error("Error deleting all messages:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const sendReply = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { msgId, type, replyMessage } = req.body;

    if (!msgId || !isValidObjectId(msgId) || !replyMessage?.trim()) {
      return res.status(400).json({ success: false, message: "Message ID and reply are required" });
    }
    if (type !== "contact") {
      return res.status(400).json({ success: false, message: "Replies are only supported for contact messages" });
    }

    const contact = await Contact.findById(msgId);
    if (!contact || !contact.email) {
      return res.status(404).json({ success: false, message: "Message or recipient email not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"GreatHire" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: "Reply from GreatHire",
      text: replyMessage.trim(),
    });

    await Contact.findByIdAndUpdate(msgId, { status: "seen" });
    return res.status(200).json({ success: true, message: "Reply sent" });
  } catch (error) {
    console.error("Error sending reply:", error);
    return res.status(500).json({ success: false, message: "Failed to send reply" });
  }
};

export const markMessagesSeen = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    // Contact messages the admin hasn't opened yet
    await Contact.updateMany({ status: "unseen" }, { status: "seen" });

    // Clear the bell badge (it counts unread admin notifications)
    await Notification.updateMany(
      { recipient: req.user._id, recipientModel: "Admin", isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};