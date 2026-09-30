import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import Job from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import notificationService from "../utils/notificationService.js";
import {
  getCalendarConfigStatus,
  createInterviewEvent,
  updateInterviewEvent,
  cancelInterviewEvent,
  testCalendarConnection,
  listCalendarEvents,
} from "../services/googleCalendarService.js";

const router = express.Router();

/**
 * @route   GET /api/v1/calendar/status
 * @desc    Check Google Calendar integration configuration & connectivity
 * @access  Public / Authenticated
 */
router.get("/status", async (req, res) => {
  try {
    const configStatus = getCalendarConfigStatus();
    let connectionTest = null;
    let isConnected = false;

    if (configStatus.configured) {
      try {
        connectionTest = await testCalendarConnection();
        isConnected = true;
      } catch (connErr) {
        connectionTest = { error: connErr.message };
        isConnected = false;
      }
    }

    return res.status(200).json({
      success: true,
      ...configStatus,
      isConnected,
      connectionDetails: connectionTest,
    });
  } catch (error) {
    console.error("[CalendarRoute] Error checking calendar status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check calendar status",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/calendar/google-events
 * @desc    Get all events directly from Google Calendar
 * @access  Public / Authenticated
 */
router.get("/google-events", async (req, res) => {
  try {
    const events = await listCalendarEvents();
    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("[CalendarRoute] Error fetching raw Google Calendar events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Google Calendar events",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/calendar/recruiter-events
 * @desc    Get all scheduled interviews from database & live Google Calendar for the recruiter's jobs
 * @access  Recruiter (Authenticated)
 */
router.get("/recruiter-events", isAuthenticated, async (req, res) => {
  try {
    const recruiterId = req.id;

    // Find companies associated with recruiter
    const companies = await Company.find({ "userId.user": recruiterId }).select("_id");
    const companyIds = companies.map((c) => c._id);

    // Find all jobs posted by this recruiter or their company
    const jobs = await Job.find({
      $or: [{ created_by: recruiterId }, { company: { $in: companyIds } }],
    }).select("_id jobDetails company");

    const jobIds = jobs.map((j) => j._id);

    // 1. Find all applications in DB with an interview scheduled
    const applications = await Application.find({
      job: { $in: jobIds },
      $or: [
        { status: "Interview Schedule" },
        { interviewDate: { $ne: null } },
        { calendarEventId: { $ne: null } },
      ],
    })
      .populate({
        path: "applicant",
        select: "fullname emailId phoneNumber profile",
      })
      .populate({
        path: "job",
        select: "jobDetails company",
        populate: { path: "company", select: "companyName" },
      })
      .sort({ interviewDate: 1, updatedAt: -1 });

    // 2. Fetch live events directly from Google Calendar
    const googleEvents = await listCalendarEvents();

    // Map existing DB calendarEventIds to avoid duplicates
    const dbEventIds = new Set(
      applications.map((a) => a.calendarEventId).filter(Boolean)
    );

    // Filter Google Calendar events that aren't already represented in DB applications
    const extraGoogleEvents = googleEvents.filter(
      (g) => !dbEventIds.has(g.calendarEventId)
    );

    // Merge both sources: DB applications + live Google Calendar events
    const mergedEvents = [...applications, ...extraGoogleEvents].sort((a, b) => {
      const dateA = new Date(a.interviewDate || a.startTime || 0);
      const dateB = new Date(b.interviewDate || b.startTime || 0);
      return dateA - dateB;
    });

    return res.status(200).json({
      success: true,
      count: mergedEvents.length,
      events: mergedEvents,
      googleEvents,
    });
  } catch (error) {
    console.error("[CalendarRoute] Error fetching recruiter events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter calendar events",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/calendar/jobseeker-events
 * @desc    Get all scheduled interviews and events for the logged-in candidate
 * @access  Job Seeker (Authenticated)
 */
router.get("/jobseeker-events", isAuthenticated, async (req, res) => {
  try {
    const applicantId = req.id;

    // 1. Candidate applications from DB
    const applications = await Application.find({
      applicant: applicantId,
      $or: [
        { status: "Interview Schedule" },
        { interviewDate: { $ne: null } },
        { calendarEventId: { $ne: null } },
      ],
    })
      .populate({
        path: "job",
        select: "jobDetails company location",
        populate: {
          path: "company",
          select: "companyName email phone address",
        },
      })
      .sort({ interviewDate: 1, updatedAt: -1 });

    // 2. Fetch candidate profile details
    const candidate = await User.findById(applicantId).select("emailId email fullname");
    const candidateEmail = (candidate?.emailId?.email || candidate?.email || "").toLowerCase().trim();
    const candidateName = (candidate?.fullname || "").toLowerCase().trim();

    // 3. Fetch Google Calendar events and match by email or name
    const googleEvents = await listCalendarEvents();
    const matchingGoogleEvents = googleEvents.filter((g) => {
      const gEmail = (g.applicant?.emailId?.email || "").toLowerCase().trim();
      const gName = (g.applicant?.fullname || "").toLowerCase().trim();
      return (
        (candidateEmail && gEmail === candidateEmail) ||
        (candidateName && gName && gName.includes(candidateName))
      );
    });

    const dbEventIds = new Set(
      applications.map((a) => a.calendarEventId).filter(Boolean)
    );
    const extraGoogleEvents = matchingGoogleEvents.filter(
      (g) => !dbEventIds.has(g.calendarEventId)
    );

    const mergedEvents = [...applications, ...extraGoogleEvents].sort((a, b) => {
      const dateA = new Date(a.interviewDate || a.startTime || 0);
      const dateB = new Date(b.interviewDate || b.startTime || 0);
      return dateA - dateB;
    });

    return res.status(200).json({
      success: true,
      count: mergedEvents.length,
      events: mergedEvents,
    });
  } catch (error) {
    console.error("[CalendarRoute] Error fetching jobseeker events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobseeker calendar events",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/v1/calendar/candidates-for-interview
 * @desc    Get candidates in "Shortlisted" or "Pending" status to easily schedule interviews
 * @access  Recruiter (Authenticated)
 */
router.get("/candidates-for-interview", isAuthenticated, async (req, res) => {
  try {
    const recruiterId = req.id;

    const companies = await Company.find({ "userId.user": recruiterId }).select("_id");
    const companyIds = companies.map((c) => c._id);

    const jobs = await Job.find({
      $or: [{ created_by: recruiterId }, { company: { $in: companyIds } }],
    }).select("_id jobDetails company");

    const jobIds = jobs.map((j) => j._id);

    const candidates = await Application.find({
      job: { $in: jobIds },
      status: { $in: ["Shortlisted", "Pending"] },
      interviewDate: null,
    })
      .populate({
        path: "applicant",
        select: "fullname emailId phoneNumber profile",
      })
      .populate({
        path: "job",
        select: "jobDetails",
      })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      candidates,
    });
  } catch (error) {
    console.error("[CalendarRoute] Error fetching candidates for interview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidates",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/v1/calendar/schedule-interview
 * @desc    Schedule or reschedule an interview & sync with Google Calendar
 * @access  Recruiter (Authenticated)
 */
router.post("/schedule-interview", isAuthenticated, async (req, res) => {
  try {
    const { applicationId, scheduledDate, durationMinutes, mode, meetingLink, notes } =
      req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "applicationId is required",
      });
    }

    if (!scheduledDate) {
      return res.status(400).json({
        success: false,
        message: "scheduledDate is required",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("applicant")
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Call Google Calendar to create or update event
    let calEvent = null;
    try {
      if (application.calendarEventId) {
        calEvent = await updateInterviewEvent(application.calendarEventId, application, {
          scheduledDate,
          durationMinutes: Number(durationMinutes) || 45,
          mode: mode || "Online Video Interview",
          meetingLink,
        });
      } else {
        calEvent = await createInterviewEvent(application, {
          scheduledDate,
          durationMinutes: Number(durationMinutes) || 45,
          mode: mode || "Online Video Interview",
          meetingLink,
        });
      }
    } catch (gErr) {
      console.warn("[CalendarRoute] Google Calendar sync warning:", gErr.message);
    }

    // Update Application document
    application.status = "Interview Schedule";
    application.recruitmentStatus = "Interview";
    application.interviewDate = new Date(scheduledDate);

    if (calEvent?.eventId) {
      application.calendarEventId = calEvent.eventId;
    }
    if (meetingLink || calEvent?.meetingLink) {
      application.interviewLink = meetingLink || calEvent.meetingLink;
    }

    await application.save();

    // Notify candidate
    try {
      const applicantId = application.applicant?._id || application.applicant;
      const jobTitle = application.job?.jobDetails?.title || "your application";
      const companyName =
        application.job?.jobDetails?.companyName ||
        application.job?.company?.companyName ||
        "GreatHire";

      const formattedDate = new Date(scheduledDate).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      await notificationService.createAndEmit({
        recipient: applicantId,
        recipientModel: "User",
        sender: req.id,
        senderModel: "Recruiter",
        type: "application-status-changed",
        title: "📅 Interview Scheduled!",
        message: `Your interview for ${jobTitle} at ${companyName} has been scheduled for ${formattedDate} (IST). Mode: ${
          mode || "Online Video Interview"
        }.`,
        relatedEntity: application.job?._id,
        relatedEntityModel: "Job",
        priority: "high",
        actionUrl: "/calendar",
        metadata: {
          applicationId: application._id,
          interviewDate: application.interviewDate,
          meetingLink: application.interviewLink,
          notes,
        },
      });
    } catch (notifErr) {
      console.warn("[CalendarRoute] Notification error:", notifErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Interview scheduled and synced with Google Calendar successfully!",
      application,
      calendarEvent: calEvent,
    });
  } catch (error) {
    console.error("[CalendarRoute] Error scheduling interview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/v1/calendar/cancel-interview/:id
 * @desc    Cancel scheduled interview, delete Google Calendar event, and revert application status
 * @access  Recruiter (Authenticated)
 */
router.delete("/cancel-interview/:id", isAuthenticated, async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId)
      .populate("applicant")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Cancel Google Calendar event if exists
    if (application.calendarEventId) {
      try {
        await cancelInterviewEvent(application.calendarEventId);
      } catch (gErr) {
        console.warn("[CalendarRoute] Google Calendar cancellation warning:", gErr.message);
      }
    }

    application.calendarEventId = null;
    application.interviewDate = null;
    application.interviewLink = null;
    application.status = "Pending";
    application.recruitmentStatus = "Screening";
    await application.save();

    // Notify candidate
    try {
      const applicantId = application.applicant?._id || application.applicant;
      const jobTitle = application.job?.jobDetails?.title || "your application";

      await notificationService.createAndEmit({
        recipient: applicantId,
        recipientModel: "User",
        sender: req.id,
        senderModel: "Recruiter",
        type: "application-status-changed",
        title: "Interview Cancelled / Rescheduled",
        message: `Your interview session for ${jobTitle} has been cancelled or moved. The recruiter will be in touch with new details.`,
        relatedEntity: application.job?._id,
        relatedEntityModel: "Job",
        priority: "medium",
        actionUrl: "/calendar",
      });
    } catch (notifErr) {
      console.warn("[CalendarRoute] Notification error:", notifErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Interview cancelled successfully and removed from Google Calendar.",
      application,
    });
  } catch (error) {
    console.error("[CalendarRoute] Error cancelling interview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel interview",
      error: error.message,
    });
  }
});

export default router;
