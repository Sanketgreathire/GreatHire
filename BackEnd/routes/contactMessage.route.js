import express from "express";
import { sendContactMessage } from "../controllers/contactMessage.controller.js";

const router = express.Router();

// POST endpoint to send contact form message
router.post("/sendMessage", sendContactMessage);

export default router;