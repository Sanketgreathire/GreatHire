import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
  deleteMessage,
  editMessage,
  searchConversations,
} from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Get all conversations for authenticated user
router.route("/conversations").get(isAuthenticated, getConversations);

// Search conversations
router.route("/conversations/search").get(isAuthenticated, searchConversations);

// Start a new conversation
router.route("/conversations/start").post(isAuthenticated, startConversation);

// Get messages for a specific conversation
router.route("/conversations/:conversationId/messages").get(isAuthenticated, getMessages);

// Send a message
router.route("/messages/send").post(isAuthenticated, sendMessage);

// Edit a message
router.route("/messages/:messageId/edit").put(isAuthenticated, editMessage);

// Delete a message
router.route("/messages/:messageId/delete").delete(isAuthenticated, deleteMessage);

export default router;
