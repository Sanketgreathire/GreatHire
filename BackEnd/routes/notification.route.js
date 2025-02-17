import express from "express";
import { getUnseenNotifications } from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

// Define your routes here
router.get("/unseen", isAuthenticated, getUnseenNotifications);

export default router;
