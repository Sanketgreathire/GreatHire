import crypto from "crypto";

export const verifyHmac = (req, res, next) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const secret = process.env.JOBPORTAL_WEBHOOK_SECRET;

    if (!signature) {
      return res.status(401).json({ success: false, message: "Missing signature header" });
    }
    if (!secret) {
      console.error("JOBPORTAL_WEBHOOK_SECRET is not set");
      return res.status(500).json({ success: false, message: "Server misconfiguration" });
    }
    if (!req.rawBody) {
      console.error("req.rawBody missing — check express.json() verify option");
      return res.status(500).json({ success: false, message: "Server misconfiguration" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return res.status(401).json({ success: false, message: "Invalid signature" });
    }

    next();
  } catch (error) {
    console.error("HMAC verification error:", error);
    return res.status(500).json({ success: false, message: "Signature verification failed" });
  }
};