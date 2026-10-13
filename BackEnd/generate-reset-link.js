import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "./models/user.model.js";
import { Recruiter } from "./models/recruiter.model.js";
import { Admin } from "./models/admin/admin.model.js";
import { DigitalMarketer } from "./models/digitalmarketer.model.js";

async function main() {
  const targetEmail = process.argv[2] ? process.argv[2].trim().toLowerCase() : null;
  const frontendBase = (process.argv[3] || process.env.FRONTEND_URL || "https://greathire.in")
    .replace(/^["']|["']$/g, "")
    .trim()
    .replace(/\/+$/, "") || "https://greathire.in";
  const tokenExpiry = process.env.FORGOT_PASSWORD_TOKEN_EXPIRY || "1h";

  let userId = null;
  let userName = "Demo User";
  let userRole = "student";
  let matchedEmail = targetEmail;

  if (targetEmail) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      const emailQuery = { $regex: new RegExp(`^${targetEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") };

      const user =
        (await User.findOne({ "emailId.email": emailQuery })) ||
        (await Recruiter.findOne({ "emailId.email": emailQuery })) ||
        (await Admin.findOne({ "emailId.email": emailQuery })) ||
        (await DigitalMarketer.findOne({ "emailId.email": emailQuery }));

      if (user) {
        userId = user._id;
        userName = user.fullname || user.name || "User";
        userRole = user.role || "student";
        matchedEmail = user.emailId?.email || targetEmail;
        console.log(`\n✅ Found account: ${userName} (${matchedEmail}) [${userRole}] - ID: ${userId}`);
      } else {
        console.log(`\n⚠️ No user found in DB with email: ${targetEmail}. Generating a generic test link instead.`);
        userId = new mongoose.Types.ObjectId().toString();
      }
      await mongoose.disconnect();
    } catch (err) {
      console.warn("⚠️ Could not query MongoDB:", err.message);
      userId = "demo-user-id";
    }
  } else {
    userId = "demo-user-id";
    console.log("\nℹ️ No email specified. Generating a demo reset link.");
    console.log("   Tip: You can specify an email: node generate-reset-link.js user@example.com");
  }

  const token = jwt.sign(
    { userId, role: userRole },
    process.env.SECRET_KEY,
    { expiresIn: tokenExpiry }
  );

  const resetUrl = `${frontendBase}/reset-password/${token}`;

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  GreatHire — Password Reset Link Generator");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`Target:      ${userName} (${matchedEmail || "N/A"})`);
  console.log(`User ID:     ${userId}`);
  console.log(`Role:        ${userRole}`);
  console.log(`Expires In:  ${tokenExpiry}`);
  console.log("---------------------------------------------------------------");
  console.log("🔗 Generated Password Reset Link:");
  console.log(resetUrl);
  console.log("═══════════════════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
