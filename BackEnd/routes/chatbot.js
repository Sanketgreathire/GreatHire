// routes/chatbot.js
import express from "express";
import { fetchJobResultsFromQuery } from "../utils/gemini.js";
import Job from "../models/job.model.js"; // ensure .js extension

const router = express.Router();

router.post("/ask", async (req, res) => {
    try {
        const { message } = req.body;
        const jobs = await Job.find({});
        const response = await fetchJobResultsFromQuery(message, jobs);
        res.json({ response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process request" });
    }
});

export default router;
