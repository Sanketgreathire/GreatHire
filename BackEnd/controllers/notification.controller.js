import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

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
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const role = getUserRoleModel(req.user.role);
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50); // Max 50
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      recipient: req.user._id,
      recipientModel: role,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Better performance

    const totalCount = await Notification.countDocuments({
      recipient: req.user._id,
      recipientModel: role,
    });

    res.status(200).json({ 
      success: true, 
      notifications,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch notifications" 
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
    let role;
    if (req.user.role === "recruiter") role = "Recruiter";
    else if (req.user.role === "admin") role = "Admin";
    else role = "User";

    const count = await Notification.countDocuments({
      recipient: req.user._id,
      recipientModel: role,
      isRead: false,
    });

    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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