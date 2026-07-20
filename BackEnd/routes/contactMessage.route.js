import express from "express";
import { sendContactMessage, getContactQueries, updateQueryStatus } from "../controllers/contactMessage.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/sendMessage", sendContactMessage);
router.get("/v1/admin/support-queries", isAuthenticated, getContactQueries);
router.patch("/v1/admin/support-queries/:id/status", isAuthenticated, updateQueryStatus);

export default router;