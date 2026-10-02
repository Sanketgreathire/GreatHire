import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getAdminNotifications,
  markAdminNotificationAsRead,
  getUnreadCount,
  testNotification,
  deleteNotification,
  getAllMessages,
  getUnseenMessages,
  deleteContactMessage,
  deleteAllMessages,
  sendReply,
  markMessagesSeen
} from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// 🔹 User Routes
router.get("/", isAuthenticated, getNotifications);                  // Get logged-in user's notifications
router.get("/unread-count", isAuthenticated, getUnreadCount);        // Get unread count
router.put("/:id/read", isAuthenticated, markAsRead);                // Mark one notification as read
router.put("/mark-all-read", isAuthenticated, markAllAsRead);        // Mark all as read
router.delete("/:id", isAuthenticated, deleteNotification);          // Delete a notification
router.post("/test", isAuthenticated, testNotification);             // Test notification endpoint

// 🔹 Admin Routes
router.get("/admin", isAuthenticated, getAdminNotifications);        // Get all admin notifications
router.put("/admin/:id/read", isAuthenticated, markAdminNotificationAsRead); // Mark admin notification as read


// 🔹 Admin Messages
router.get("/getAll-messages", isAuthenticated, getAllMessages);
router.get("/unseen/messages", isAuthenticated, getUnseenMessages);
router.delete("/deleteMessages", isAuthenticated, deleteAllMessages); // must stay above "/:id"
router.delete("/contacts/:id", isAuthenticated, deleteContactMessage);
router.post("/sendreply", isAuthenticated, sendReply);
router.put("/mark-seen", isAuthenticated, markMessagesSeen);

export default router;