import dotenv from "dotenv";
dotenv.config();

import { sendRejectionEmail } from "./utils/emailService.js";

// Test the email service
const testEmail = async () => {
  console.log("🧪 Testing rejection email service...");
  console.log("📧 Email User:", process.env.EMAIL_USER);
  
  const testData = {
    applicantEmail: "test@example.com", // Change this to your test email
    applicantName: "John Doe",
    jobTitle: "Senior Software Engineer",
    companyName: "Tech Corp Inc."
  };

  try {
    const result = await sendRejectionEmail(
      testData.applicantEmail,
      testData.applicantName,
      testData.jobTitle,
      testData.companyName
    );

    if (result) {
      console.log("✅ Test email sent successfully!");
      console.log(`📬 Check inbox: ${testData.applicantEmail}`);
    } else {
      console.log("❌ Failed to send test email");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  process.exit(0);
};

testEmail();
