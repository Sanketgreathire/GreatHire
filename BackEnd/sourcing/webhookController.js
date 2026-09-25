import { ingestionEventPublisherService } from "../src/modules/events/services/ingestionEventPublisher.service.js";
import { v4 as uuidv4 } from "uuid";

export const handleJobPortalWebhook = async (req, res) => {
  try {
    const jobId = uuidv4();
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, message: "Empty payload" });
    }

    await ingestionEventPublisherService.publishCandidateDiscovery(
      payload,
      "webhook",
      { correlationId: jobId }
    );

    res.status(200).json({ success: true, message: "Webhook received", jobId });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
};