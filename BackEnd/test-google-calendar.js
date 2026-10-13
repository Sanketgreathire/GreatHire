import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";
import { getGoogleAuth, getServiceAccountCredentials } from "./utils/googleAuthHelper.js";

async function testCalendar() {
  console.log("==========================================");
  console.log("   GOOGLE CALENDAR INTEGRATION TEST       ");
  console.log("==========================================");

  const creds = getServiceAccountCredentials();
  console.log("Configuration Check:");
  console.log(" - GOOGLE_CALENDAR_ID:", process.env.GOOGLE_CALENDAR_ID || "(Not set)");
  console.log(" - Has Base64 Encoded Key:", !!process.env.GOOGLE_SERVICE_ACCOUNT_BASE64);
  console.log(" - Loaded Service Account:", creds ? creds.client_email : "None");

  if (!creds) {
    console.error("❌ No valid Google Service Account credentials found!");
    process.exit(1);
  }

  const auth = getGoogleAuth([
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events"
  ]);

  const calendar = google.calendar({ version: "v3", auth });

  console.log("\n1. Testing calendar.calendarList.list()...");
  try {
    const listRes = await calendar.calendarList.list();
    console.log("   ✅ Successfully authenticated with Google Calendar API!");
    const items = listRes.data.items || [];
    console.log(`   - Calendars visible to Service Account: ${items.length}`);
    items.forEach(cal => {
      console.log(`     * [${cal.id}] "${cal.summary}" (Role: ${cal.accessRole})`);
    });
  } catch (err) {
    console.error("   ❌ Failed calendarList.list():", err.message);
    if (err.response?.data) {
      console.error("   Details:", JSON.stringify(err.response.data, null, 2));
    }
  }

  const targetCalendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!targetCalendarId) {
    console.log("\n⚠️ No GOOGLE_CALENDAR_ID set in .env");
    return;
  }

  console.log(`\n2. Testing access to target calendar: "${targetCalendarId}"...`);
  try {
    const getRes = await calendar.calendars.get({ calendarId: targetCalendarId });
    console.log(`   ✅ Successfully accessed target calendar!`);
    console.log(`   - Summary: "${getRes.data.summary}"`);
    console.log(`   - TimeZone: ${getRes.data.timeZone}`);
  } catch (err) {
    console.error(`   ❌ Failed to access target calendar "${targetCalendarId}":`, err.message);
    if (err.response?.data) {
      console.error("   Details:", JSON.stringify(err.response.data, null, 2));
    }
  }

  console.log(`\n3. Testing event creation permission on target calendar...`);
  try {
    const testEvent = {
      summary: "GreatHire Automation Test Event",
      description: "Testing automated interview scheduling with GreatHire system",
      start: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      end: {
        dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      },
    };

    const insertRes = await calendar.events.insert({
      calendarId: targetCalendarId,
      requestBody: testEvent,
    });
    console.log("   ✅ Successfully created test event on calendar!");
    console.log("   - Event ID:", insertRes.data.id);
    console.log("   - HTML Link:", insertRes.data.htmlLink);

    // Clean up the test event
    await calendar.events.delete({
      calendarId: targetCalendarId,
      eventId: insertRes.data.id,
    });
    console.log("   ✅ Cleaned up test event.");
  } catch (err) {
    console.error(`   ❌ Failed to create event on "${targetCalendarId}":`, err.message);
    if (err.response?.data) {
      console.error("   Details:", JSON.stringify(err.response.data, null, 2));
    }
  }

  console.log("\n==========================================");
}

testCalendar().then(() => process.exit(0)).catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
