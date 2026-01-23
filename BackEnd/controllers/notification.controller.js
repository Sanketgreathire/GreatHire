// import  Notification from "../models/notification.model.js";

// ==============================
// Get notifications for the authenticated user
// ==============================
export const getNotifications = async (req, res) => {
  try {
    let role;
    if (req.user.role === "recruiter") role = "Recruiter";
    else if (req.user.role === "admin") role = "Admin";
    else role = "User";

    const notifications = await Notification.find({
      recipient: req.user._id,
      recipientModel: role,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Mark a single notification as read
// ==============================
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Mark all notifications as read for the authenticated user
// ==============================
export const markAllAsRead = async (req, res) => {
  try {
    let role;
    if (req.user.role === "recruiter") role = "Recruiter";
    else if (req.user.role === "admin") role = "Admin";
    else role = "User";

    await Notification.updateMany(
      {
        recipient: req.user._id,
        recipientModel: role,
        isRead: false,
      },
      { isRead: true, readAt: new Date() }
    );

    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ success: false, message: error.message });
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
    const notifications = await Notification.find({
      recipientModel: "Admin",
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// Mark admin notification as read
// ==============================
export const markAdminNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error marking admin notification as read:", error);
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};
