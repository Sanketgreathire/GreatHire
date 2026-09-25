import express from "express";
import { verifyHmac } from "../middlewares/verifyHmac.js";
import { handleJobPortalWebhook } from "../sourcing/webhookController.js";

const router = express.Router();

// No isAuthenticated here — external system, verified via HMAC instead
router.post("/ingest", verifyHmac, handleJobPortalWebhook);

export default router;