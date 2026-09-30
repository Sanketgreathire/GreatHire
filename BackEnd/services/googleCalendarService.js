import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";
import { getGoogleAuth } from "../utils/googleAuthHelper.js";

let calendarClient = null;

/**
 * Initialize Google Calendar client using service account
 */
export const getCalendarClient = () => {
  if (calendarClient) return calendarClient;

  try {
    const auth = getGoogleAuth([
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ]);

    calendarClient = google.calendar({ version: "v3", auth });
    return calendarClient;
  } catch (err) {
    console.warn(`[GoogleCalendar] Authentication initialization failed: ${err.message}`);
    return null;
  }
};

/**
 * Test connectivity to the configured Google Calendar
 */
export const testCalendarConnection = async () => {
  const client = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!client || !calendarId) {
    throw new Error("Google Calendar client or GOOGLE_CALENDAR_ID is not configured");
  }

  const res = await client.calendars.get({ calendarId });
  return {
    calendarId,
    summary: res.data.summary,
    timeZone: res.data.timeZone,
  };
};

/**
 * Create an interview event on the Google Calendar
 * 
 * @param {Object} application Mongoose Application document or plain object
 * @param {Object} options Optional customization: { scheduledDate, durationMinutes, mode, meetingLink }
 */
export const createInterviewEvent = async (application, options = {}) => {
  try {
    const client = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!client || !calendarId) {
      console.warn("[GoogleCalendar] Skipping event creation: client or GOOGLE_CALENDAR_ID missing.");
      return null;
    }

    const candidateName =
      application.applicantName ||
      application.applicant?.fullname ||
      "Candidate";

    const candidateEmail =
      application.applicantEmail ||
      application.applicant?.emailId?.email ||
      "";

    const candidatePhone =
      application.applicantPhone ||
      application.applicant?.phoneNumber?.number ||
      "";

    const jobTitle =
      application.job?.jobDetails?.title ||
      application.jobTitle ||
      "Open Position";

    const companyName =
      application.job?.jobDetails?.companyName ||
      application.company ||
      "GreatHire";

    // Determine interview start time: provided scheduledDate, or existing interviewDate, or next business day at 11:00 AM IST
    let startTime;
    if (options.scheduledDate) {
      startTime = new Date(options.scheduledDate);
    } else if (application.interviewDate) {
      startTime = new Date(application.interviewDate);
    } else {
      // Default: tomorrow at 11:00 AM IST
      startTime = new Date();
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(11, 0, 0, 0);
    }

    const durationMinutes = options.durationMinutes || 45;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    const mode = options.mode || "Online Video Interview";
    const meetingLink =
      options.meetingLink ||
      application.interviewLink ||
      "https://meet.google.com/new";

    const eventPayload = {
      summary: `Interview: ${candidateName} - ${jobTitle} (${companyName})`,
      description: [
        `📌 GreatHire Interview Scheduled`,
        `----------------------------------------`,
        `Candidate: ${candidateName}`,
        `Email: ${candidateEmail}`,
        `Phone: ${candidatePhone || "N/A"}`,
        `Role: ${jobTitle}`,
        `Company: ${companyName}`,
        `Mode: ${mode}`,
        `Meeting / Location: ${meetingLink}`,
        `Application ID: ${application._id}`,
        `----------------------------------------`,
        `Created automatically by GreatHire ATS.`
      ].join("\n"),
      location: meetingLink,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    };

    console.log(`[GoogleCalendar] Creating interview event for "${candidateName}" on calendar "${calendarId}"...`);
    const response = await client.events.insert({
      calendarId,
      requestBody: eventPayload,
    });

    const eventData = {
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      meetingLink,
    };

    console.log(`[GoogleCalendar] ✅ Event created: ID ${eventData.eventId} (${eventData.htmlLink})`);
    return eventData;
  } catch (error) {
    console.error("[GoogleCalendar] ❌ Failed to create calendar event:", error.message);
    if (error.response?.data) {
      console.error("[GoogleCalendar] Error details:", JSON.stringify(error.response.data));
    }
    return null;
  }
};

/**
 * Update an existing interview event on Google Calendar
 */
export const updateInterviewEvent = async (calendarEventId, application, options = {}) => {
  if (!calendarEventId) {
    return createInterviewEvent(application, options);
  }

  try {
    const client = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!client || !calendarId) return null;

    const candidateName =
      application.applicantName ||
      application.applicant?.fullname ||
      "Candidate";

    const candidateEmail =
      application.applicantEmail ||
      application.applicant?.emailId?.email ||
      "";

    const jobTitle =
      application.job?.jobDetails?.title ||
      application.jobTitle ||
      "Open Position";

    const companyName =
      application.job?.jobDetails?.companyName ||
      application.company ||
      "GreatHire";

    const startTime = options.scheduledDate ? new Date(options.scheduledDate) : new Date();
    const durationMinutes = options.durationMinutes || 45;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
    const mode = options.mode || "Online Video Interview";
    const meetingLink = options.meetingLink || application.interviewLink || "https://meet.google.com/new";

    const eventPayload = {
      summary: `Interview: ${candidateName} - ${jobTitle} (${companyName})`,
      description: [
        `📌 GreatHire Interview Rescheduled`,
        `----------------------------------------`,
        `Candidate: ${candidateName}`,
        `Email: ${candidateEmail}`,
        `Role: ${jobTitle}`,
        `Company: ${companyName}`,
        `Mode: ${mode}`,
        `Meeting / Location: ${meetingLink}`,
        `Application ID: ${application._id}`,
        `----------------------------------------`,
        `Updated automatically by GreatHire ATS.`
      ].join("\n"),
      location: meetingLink,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };

    const response = await client.events.update({
      calendarId,
      eventId: calendarEventId,
      requestBody: eventPayload,
    });

    return {
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      meetingLink,
    };
  } catch (error) {
    console.error(`[GoogleCalendar] ❌ Failed to update event ${calendarEventId}:`, error.message);
    // If update fails because event was not found on calendar, try creating a fresh one
    return createInterviewEvent(application, options);
  }
};

/**
 * Returns configuration & connectivity status for Google Calendar
 */
export const getCalendarConfigStatus = () => {
  const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "";
  const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  const client = getCalendarClient();

  return {
    configured: !!(client && calendarId),
    hasClientId,
    hasClientSecret,
    calendarId,
    serviceAccount,
  };
};

/**
 * Helper to parse GreatHire structured metadata from Google Calendar event description
 */
export const parseEventDescription = (desc = "") => {
  const getField = (prefix) => {
    const match = desc.match(new RegExp(`${prefix}:\\s*([^\\n]+)`, "i"));
    return match ? match[1].trim() : "";
  };
  return {
    candidateName: getField("Candidate"),
    candidateEmail: getField("Email"),
    candidatePhone: getField("Phone"),
    jobTitle: getField("Role"),
    companyName: getField("Company"),
    mode: getField("Mode"),
    meetingLink: getField("Meeting / Location"),
    applicationId: getField("Application ID"),
  };
};

/**
 * List events directly from Google Calendar
 */
export const listCalendarEvents = async (options = {}) => {
  try {
    const client = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!client || !calendarId) return [];

    const timeMin = options.timeMin || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const response = await client.events.list({
      calendarId,
      timeMin,
      maxResults: options.maxResults || 250,
      singleEvents: true,
      orderBy: "startTime",
    });

    const items = response.data.items || [];
    return items.map((item) => {
      const parsed = parseEventDescription(item.description || "");
      const startTime = item.start?.dateTime || item.start?.date || null;
      const endTime = item.end?.dateTime || item.end?.date || null;

      // Extract candidate and role from summary if description didn't have it
      let fallbackCandidate = parsed.candidateName;
      let fallbackJob = parsed.jobTitle;
      let fallbackCompany = parsed.companyName;

      if (!fallbackCandidate && item.summary) {
        const parts = item.summary.replace(/^Interview:\s*/i, "").split(" - ");
        if (parts[0]) fallbackCandidate = parts[0].trim();
        if (parts[1]) {
          const compMatch = parts[1].match(/(.+)\s*\((.+)\)/);
          if (compMatch) {
            fallbackJob = compMatch[1].trim();
            fallbackCompany = compMatch[2].trim();
          } else {
            fallbackJob = parts[1].trim();
          }
        }
      }

      return {
        _id: item.id,
        calendarEventId: item.id,
        summary: item.summary || "Interview Session",
        description: item.description || "",
        interviewDate: startTime,
        startTime,
        endTime,
        htmlLink: item.htmlLink,
        status: item.status === "cancelled" ? "Cancelled" : "Interview Schedule",
        interviewLink: parsed.meetingLink || item.location || item.hangoutLink || "https://meet.google.com/new",
        applicant: {
          fullname: fallbackCandidate || "Candidate",
          emailId: { email: parsed.candidateEmail || "" },
          phoneNumber: { number: parsed.candidatePhone || "" },
        },
        job: {
          jobDetails: {
            title: fallbackJob || "Interview Role",
            companyName: fallbackCompany || "GreatHire",
          },
          company: {
            companyName: fallbackCompany || "GreatHire",
          },
        },
        isGoogleCalendarEvent: true,
        source: "Google Calendar",
      };
    });
  } catch (error) {
    console.error("[GoogleCalendar] ❌ Failed to list events:", error.message);
    return [];
  }
};

/**
 * Cancel / Delete an existing interview event from Google Calendar
 */
export const cancelInterviewEvent = async (calendarEventId) => {
  if (!calendarEventId) return false;

  try {
    const client = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!client || !calendarId) return false;

    console.log(`[GoogleCalendar] Deleting event "${calendarEventId}" from calendar "${calendarId}"...`);
    await client.events.delete({
      calendarId,
      eventId: calendarEventId,
    });
    console.log(`[GoogleCalendar] ✅ Event ${calendarEventId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`[GoogleCalendar] ❌ Failed to delete event ${calendarEventId}:`, error.message);
    return false;
  }
};



