import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getAdminNotifications,
  markAdminNotificationAsRead,
  getUnreadCount,
  testNotification
} from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// 🔹 User Routes
router.get("/", isAuthenticated, getNotifications);                  // Get logged-in user's notifications
router.get("/unread-count", isAuthenticated, getUnreadCount);        // Get unread count
router.put("/:id/read", isAuthenticated, markAsRead);                // Mark one notification as read
router.put("/mark-all-read", isAuthenticated, markAllAsRead);        // Mark all as read
router.post("/test", isAuthenticated, testNotification);             // Test notification endpoint

// 🔹 Admin Routes
router.get("/admin", isAuthenticated, getAdminNotifications);        // Get all admin notifications
router.put("/admin/:id/read", isAuthenticated, markAdminNotificationAsRead); // Mark admin notification as read

export default router;