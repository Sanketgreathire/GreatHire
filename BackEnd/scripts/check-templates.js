import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const token = process.env.WHATSAPP_TOKEN;
const wabaId = process.env.WHATSAPP_WABA_ID;

const templatesToCheck = [
  "recruiter_welcome_v2",
  "recruiter_job_posted_v2",
  "recruiter_new_applicant_v2",
];

console.log("==================================================================");
console.log("📋 CHECKING META WHATSAPP TEMPLATE APPROVAL STATUS");
console.log("==================================================================");

for (const name of templatesToCheck) {
  try {
    const url = `https://crmapi.com.bot/api/meta/v20.0/${wabaId}/message_templates?name=${name}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const template = res.data.data?.[0];
    if (template) {
      const statusIcon =
        template.status === "APPROVED"
          ? "✅"
          : template.status === "PENDING"
          ? "⏳"
          : "❌";

      console.log(`\n📌 Template:  ${template.name}`);
      console.log(`   Status:    ${statusIcon} ${template.status}`);
      console.log(`   Category:  ${template.category}`);
      console.log(`   Language:  ${template.language}`);
      console.log(`   ID:        ${template.id}`);
    } else {
      console.log(`\n❌ Template: ${name} -> NOT FOUND`);
    }
  } catch (err) {
    console.error(`\n❌ Error checking ${name}:`, err.response?.data || err.message);
  }
}

console.log("\n==================================================================");
