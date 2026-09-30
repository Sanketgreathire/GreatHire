import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanStr = (s, defaultVal = "") => {
  if (!s) return defaultVal;
  return s.replace(/^["']|["']$/g, "").trim();
};

/**
 * Resolves the Google service account auth client with multiple reliable fallbacks.
 */
const getAuthClient = () => {
  const keyPathEnv = cleanStr(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH);
  const possiblePaths = [
    keyPathEnv ? path.resolve(keyPathEnv) : null,
    keyPathEnv ? path.resolve(__dirname, "..", keyPathEnv) : null,
    path.resolve(__dirname, "../config/google-service-account.json"),
    path.resolve(__dirname, "../config/credentials/great-hire-ea29d88103ac.json"),
  ].filter(Boolean);

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return new google.auth.GoogleAuth({
        keyFile: p,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    }
  }

  // Fallback to credentials if provided directly in environment variables
  const clientEmail = cleanStr(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/^["']|["']$/g, "")
    : null;

  if (clientEmail && privateKey) {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  throw new Error(
    "No Google Service Account credentials found. Please check GOOGLE_SERVICE_ACCOUNT_KEY_PATH in .env"
  );
};

const getSheets = () => {
  const auth = getAuthClient();
  return google.sheets({ version: "v4", auth });
};

/**
 * Date formatter matching the Sheet's format (e.g. "22-Sep")
 */
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()}-${months[d.getMonth()]}`;
};

/**
 * Maps status & screening to the standard Excel Color Code badge
 */
const getColorCode = (recruitmentStatus, status, screeningStatus) => {
  const norm = (recruitmentStatus || status || "").toLowerCase();
  if (norm.includes("join") || norm.includes("select")) {
    return "■ Dark Green (Joined)";
  }
  if (norm.includes("interview")) {
    return "■ Green (Interview)";
  }
  if (norm.includes("shortlist") || screeningStatus === "Passed") {
    return "■ Green (Shortlisted)";
  }
  if (norm.includes("reject") || norm.includes("close") || screeningStatus === "Rejected") {
    return "■ Red (Closed)";
  }
  return "■ Blue (Applied)";
};

/**
 * Determines standard Recruitment Status string
 */
const getRecruitmentStatus = (app) => {
  if (app.recruitmentStatus && app.recruitmentStatus !== "Application") {
    return app.recruitmentStatus;
  }
  if (app.status === "Interview Schedule") return "Interview";
  if (app.status === "Shortlisted") return "Shortlisted";
  if (app.status === "Rejected") return "Closed";
  if (app.screeningStatus === "Passed") return "Shortlisted";
  return "Applied";
};

/**
 * Determines standard Interview column string
 */
const getInterviewText = (app, recruitmentStatus) => {
  if (recruitmentStatus === "Interview") {
    return app.interviewDate ? formatDate(app.interviewDate) : "Pending Schedule";
  }
  if (recruitmentStatus === "Shortlisted") {
    return "Pending Schedule";
  }
  if (recruitmentStatus === "Applied" || app.status === "Pending") {
    return "Pending Review";
  }
  return "-";
};

/**
 * Syncs an application to the configured Google Sheet.
 * If the application already exists in the sheet, its status is updated in-place.
 * If it is new, a row with the next sequence # and CNDxxx ID is written to the end.
 *
 * @param {Object|string} appOrId - Application document, plain object, or application _id
 */
export const syncApplicationToSheet = async (appOrId) => {
  const spreadsheetId = cleanStr(process.env.GOOGLE_SPREADSHEET_ID);
  const sheetName = cleanStr(process.env.GOOGLE_SHEET_NAME, "Sheet1");

  if (!spreadsheetId) {
    console.warn("⚠️ GOOGLE_SPREADSHEET_ID not set in environment. Skipping sheet sync.");
    return { success: false, reason: "SPREADSHEET_ID_NOT_SET" };
  }

  // Hydrate application document if needed
  let app = appOrId;
  const appIdStr = appOrId?._id ? appOrId._id.toString() : (typeof appOrId === "string" ? appOrId : "");

  if (mongoose.connection?.readyState === 1 && appIdStr && (!app?.job?.jobDetails || !app?.applicant?.fullname)) {
    try {
      const { Application } = await import("../models/application.model.js");
      await import("../models/job.model.js");
      await import("../models/user.model.js");
      const fetched = await Application.findById(appIdStr).populate("job applicant");
      if (fetched) app = fetched;
    } catch (e) {
      console.warn("Could not populate application for sheet sync:", e.message);
    }
  }

  const sheets = getSheets();

  // Read existing rows to check headers and determine if row already exists
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:L2000`,
  });

  const rows = res.data.values || [];

  // Write headers if sheet is empty
  if (rows.length === 0) {
    const headers = [
      "#",
      "ID",
      "Candidate Name",
      "Position",
      "Dept",
      "Source",
      "CV Rec",
      "Screening",
      "Recruitment Status",
      "Interview",
      "Excel Color Code",
      "Application ID",
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:L1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [headers] },
    });
    rows.push(headers);
  }

  // Extract candidate fields
  const candidateName =
    app.applicantName ||
    app.applicant?.fullname ||
    "Unknown Candidate";

  const position =
    app.job?.jobDetails?.title ||
    app.jobTitle ||
    "Applicant";

  const dept =
    app.job?.jobDetails?.companyName ||
    app.job?.company?.name ||
    app.company ||
    "GreatHire";

  const source = app.isAutoApplied ? "AI-Sourced" : (app.source || "GreatHire Portal");
  const cvRec = formatDate(app.createdAt || new Date());
  const screening =
    app.screeningStatus === "Passed"
      ? "Passed"
      : app.screeningStatus === "Rejected" || app.status === "Rejected"
      ? "Rejected"
      : "Pending";
  const recruitmentStatus = getRecruitmentStatus(app);
  const interviewText = getInterviewText(app, recruitmentStatus);
  const colorCode = getColorCode(recruitmentStatus, app.status, app.screeningStatus);

  // Search if application already exists in sheet
  let existingRowIndex = -1; // 1-based row index for Google Sheets API

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowAppId = row[11];
    const rowName = (row[2] || "").trim().toLowerCase();
    const rowPos = (row[3] || "").trim().toLowerCase();

    // Priority 1: Match by Application ID in column L
    if (appIdStr && rowAppId && rowAppId === appIdStr) {
      existingRowIndex = i + 1;
      break;
    }

    // Priority 2: Match by Candidate Name AND Position (only if candidateName is specific)
    if (
      candidateName &&
      candidateName !== "Unknown Candidate" &&
      rowName &&
      rowName === candidateName.trim().toLowerCase() &&
      position &&
      rowPos &&
      rowPos === position.trim().toLowerCase()
    ) {
      existingRowIndex = i + 1;
      break;
    }
  }

  if (existingRowIndex > 0) {
    // Update existing row (Columns H to L: Screening, Recruitment Status, Interview, Color Code, AppId)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!H${existingRowIndex}:L${existingRowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[screening, recruitmentStatus, interviewText, colorCode, appIdStr]],
      },
    });

    console.log(
      `✅ Updated Google Sheet row ${existingRowIndex} for application ${appIdStr || candidateName} (${recruitmentStatus})`
    );
    return { success: true, action: "updated", row: existingRowIndex };
  } else {
    // Determine next # and CND sequence ID
    let maxNum = 0;
    let maxCndNum = 0;

    for (let i = 1; i < rows.length; i++) {
      const numVal = parseInt(rows[i][0], 10);
      if (!isNaN(numVal) && numVal > maxNum) maxNum = numVal;

      const idVal = rows[i][1] || "";
      const match = idVal.match(/CND0*(\d+)/i);
      if (match) {
        const cndNum = parseInt(match[1], 10);
        if (!isNaN(cndNum) && cndNum > maxCndNum) maxCndNum = cndNum;
      }
    }

    const nextNum = Math.max(maxNum + 1, rows.length);
    const nextCndSeq = Math.max(maxCndNum + 1, nextNum);
    const nextId = `CND${String(nextCndSeq).padStart(3, "0")}`;
    const nextRow = rows.length + 1;

    const newRow = [
      String(nextNum),
      nextId,
      candidateName,
      position,
      dept,
      source,
      cvRec,
      screening,
      recruitmentStatus,
      interviewText,
      colorCode,
      appIdStr,
    ];

    // Write deterministically to the next row at the end of the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${nextRow}:L${nextRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [newRow],
      },
    });

    console.log(
      `✅ Appended new row to Google Sheet at row ${nextRow}: #${nextNum} ${nextId} - ${candidateName} - ${position} (${recruitmentStatus})`
    );
    return { success: true, action: "appended", id: nextId, row: nextRow };
  }
};

/**
 * Tests connection to Google Sheets and returns sheet information.
 */
export const testSheetConnection = async () => {
  const spreadsheetId = cleanStr(process.env.GOOGLE_SPREADSHEET_ID);
  const sheetName = cleanStr(process.env.GOOGLE_SHEET_NAME, "Sheet1");

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SPREADSHEET_ID is not defined in environment variables");
  }

  const sheets = getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const valuesRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:L5`,
  });

  return {
    title: meta.data.properties.title,
    sheetName,
    spreadsheetId,
    sampleRows: valuesRes.data.values || [],
  };
};

/**
 * Syncs all applications from MongoDB to the Google Sheet.
 */
export const syncAllApplicationsToSheet = async () => {
  if (mongoose.connection?.readyState !== 1) {
    throw new Error("MongoDB connection is not active");
  }

  const { Application } = await import("../models/application.model.js");
  await import("../models/job.model.js");
  await import("../models/user.model.js");

  const apps = await Application.find().sort({ createdAt: 1 }).populate("job applicant");
  console.log(`📋 Found ${apps.length} applications in database to sync.`);

  const results = [];
  for (const app of apps) {
    try {
      const res = await syncApplicationToSheet(app);
      results.push({ id: app._id, status: "success", res });
    } catch (err) {
      console.error(`Failed to sync application ${app._id}:`, err.message);
      results.push({ id: app._id, status: "error", error: err.message });
    }
  }

  return { total: apps.length, results };
};