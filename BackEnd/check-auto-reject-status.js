import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Status check script for Auto-Reject feature
 * Usage: node BackEnd/check-auto-reject-status.js
 */

console.log("\n" + "=".repeat(60));
console.log("🔍 AUTO-REJECT FEATURE STATUS CHECK");
console.log("=".repeat(60) + "\n");

let allGood = true;

// Check 1: Environment Variables
console.log("1️⃣  Checking Environment Variables...");
const autoRejectDays = process.env.AUTO_REJECT_DAYS;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (autoRejectDays) {
  console.log(`   ✅ AUTO_REJECT_DAYS: ${autoRejectDays} days`);
} else {
  console.log(`   ⚠️  AUTO_REJECT_DAYS: Not set (will use default: 30)`);
}

if (emailUser) {
  console.log(`   ✅ EMAIL_USER: ${emailUser}`);
} else {
  console.log(`   ❌ EMAIL_USER: Not configured`);
  allGood = false;
}

if (emailPass) {
  console.log(`   ✅ EMAIL_PASS: Configured (${emailPass.length} characters)`);
} else {
  console.log(`   ❌ EMAIL_PASS: Not configured`);
  allGood = false;
}

// Check 2: Required Files
console.log("\n2️⃣  Checking Required Files...");
const requiredFiles = [
  "utils/emailService.js",
  "utils/autoRejectApplications.js",
  "test-email.js",
  "test-auto-reject.js",
  "backdate-applications.js"
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - Missing!`);
    allGood = false;
  }
});

// Check 3: Dependencies
console.log("\n3️⃣  Checking Dependencies...");
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
  );
  
  const requiredDeps = ["nodemailer", "node-cron"];
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep}: Not installed`);
      allGood = false;
    }
  });
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
  allGood = false;
}

// Check 4: NPM Scripts
console.log("\n4️⃣  Checking NPM Scripts...");
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
  );
  
  const requiredScripts = [
    "test:email",
    "test:auto-reject",
    "backdate:applications"
  ];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`   ✅ npm run ${script}`);
    } else {
      console.log(`   ⚠️  npm run ${script} - Not configured`);
    }
  });
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
}

// Check 5: Documentation
console.log("\n5️⃣  Checking Documentation...");
const docFiles = [
  "../AUTO_REJECT_FEATURE.md",
  "../AUTO_REJECT_QUICK_START.md",
  "../AUTO_REJECT_IMPLEMENTATION_SUMMARY.md",
  "../AUTO_REJECT_FLOWCHART.md",
  "../AUTO_REJECT_DEPLOYMENT_CHECKLIST.md"
];

docFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${path.basename(file)}`);
  } else {
    console.log(`   ⚠️  ${path.basename(file)} - Missing`);
  }
});

// Final Summary
console.log("\n" + "=".repeat(60));
if (allGood) {
  console.log("✅ ALL CHECKS PASSED - Feature is ready to use!");
  console.log("\n📝 Next Steps:");
  console.log("   1. Start server: npm run dev");
  console.log("   2. Test email: npm run test:email");
  console.log("   3. Test auto-reject: npm run test:auto-reject");
} else {
  console.log("⚠️  SOME CHECKS FAILED - Please review above");
  console.log("\n📝 Action Required:");
  console.log("   1. Fix any ❌ items above");
  console.log("   2. Run this check again");
  console.log("   3. Review documentation for setup help");
}
console.log("=".repeat(60) + "\n");

// Configuration Summary
console.log("⚙️  Current Configuration:");
console.log(`   • Rejection Period: ${autoRejectDays || 30} days`);
console.log(`   • Cron Schedule: Daily at 2:00 AM`);
console.log(`   • Email Service: ${emailUser ? 'Configured' : 'Not Configured'}`);
console.log(`   • Manual Trigger: POST /api/v1/application/auto-reject/trigger`);

console.log("\n📚 Documentation:");
console.log("   • Full Guide: AUTO_REJECT_FEATURE.md");
console.log("   • Quick Start: AUTO_REJECT_QUICK_START.md");
console.log("   • Deployment: AUTO_REJECT_DEPLOYMENT_CHECKLIST.md");

console.log("\n");
