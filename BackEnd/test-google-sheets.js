import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import {
  testSheetConnection,
  syncAllApplicationsToSheet,
} from "./services/googleSheetsSyncService.js";

async function run() {
  console.log("==========================================");
  console.log("   GOOGLE SHEETS INTEGRATION TEST & SYNC  ");
  console.log("==========================================");

  try {
    console.log("\n1. Verifying Google Sheets connection & permissions...");
    const conn = await testSheetConnection();
    console.log("   ✅ Connected successfully!");
    console.log(`   - Spreadsheet Title: "${conn.title}"`);
    console.log(`   - Target Tab/Sheet: "${conn.sheetName}"`);
    console.log(`   - Spreadsheet ID: ${conn.spreadsheetId}`);

    console.log("\n2. Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("   ✅ Connected to MongoDB successfully!");

    console.log("\n3. Testing application sync...");
    const result = await syncAllApplicationsToSheet();
    console.log(`\n==========================================`);
    console.log(`   SYNC COMPLETE:`);
    console.log(`   - Total Applications Processed: ${result.total}`);
    console.log(`   - Successfully Synced: ${result.results.filter((r) => r.status === "success").length}`);
    console.log(`   - Errors: ${result.results.filter((r) => r.status === "error").length}`);
    console.log(`==========================================`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Google Sheets test failed:", error.message);
    process.exit(1);
  }
}

run();
