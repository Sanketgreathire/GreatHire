import express from "express";
import {
  getUnseenNotificationsCount,
  getUnseenMessages,
  getMessages,
  markAsSeen,
  deleteContact,
  deleteJobReport,
  deleteAllMessages,
  sendReplyToMessage,
} from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

// Define your routes here
router.get("/unseen", isAuthenticated, getUnseenNotificationsCount);
router.get("/unseen/messages", isAuthenticated, getUnseenMessages);
router.get("/getAll-messages", isAuthenticated, getMessages);
router.put("/mark-seen", isAuthenticated, markAsSeen);

router.delete("/contacts/:msgId", isAuthenticated, deleteContact);
router.delete("/jobReports/:msgId", isAuthenticated, deleteJobReport);
router.delete("/deleteMessages", isAuthenticated, deleteAllMessages);


router.post("/sendreply", isAuthenticated, sendReplyToMessage);

export default router;
