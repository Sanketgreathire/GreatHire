import express from "express";
import { handleRecruiterChat } from "../controllers/recruiterChat.controller.js";

const router = express.Router();

// Recruiter AI Assistant Endpoint
router.post("/message", handleRecruiterChat);

export default router;
