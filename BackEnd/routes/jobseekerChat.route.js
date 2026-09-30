import express from "express";
import { handleJobseekerChat } from "../controllers/jobseekerChat.controller.js";

const router = express.Router();

// Publicly accessible for job seekers exploring on login page or logged in
router.post("/message", handleJobseekerChat);

export default router;
