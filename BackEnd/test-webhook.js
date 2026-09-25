import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";

const secret = process.env.JOBPORTAL_WEBHOOK_SECRET;

if (!secret) {
  console.error("❌ JOBPORTAL_WEBHOOK_SECRET not found in .env");
  process.exit(1);
}

const payload = JSON.stringify({
  name: "Test Candidate",
  email: "test@example.com",
  skills: ["JavaScript", "React"],
});

const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

console.log("Payload:", payload);
console.log("Signature:", signature);