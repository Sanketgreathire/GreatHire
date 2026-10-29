
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  Trash2,
  CalendarCheck,
  Search,
  X,
  Phone,
  Mail,
  Share2,
  AlertTriangle,
} from "lucide-react";
import { CALENDAR_API_END_POINT } from "@/utils/ApiEndPoint";

const RecruiterCalendar = () => {
  const [events, setEvents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [activeTab, setActiveTab] = useState("workspace");

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Custom delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const [deletingInterview, setDeletingInterview] = useState(false);

  const [formData, setFormData] = useState({
    applicationId: "",
    scheduledDate: "",
    scheduledTime: "11:00",
    durationMinutes: 45,
    mode: "Online Video Interview",
    meetingLink: "https://meet.google.com/new",
    notes: "",
  });

  // Format a Date as YYYY-MM-DD using LOCAL date values.
  // Do not use toISOString() for HTML date inputs because it uses UTC.
  const toLocalDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toLocalTimeInput = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const formatIST = (dateStr) => {
    if (!dateStr) return "Not set";

    return new Date(dateStr).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchCalendarData = async () => {
    setLoading(true);

    try {
      const [statusRes, eventsRes, candidatesRes] = await Promise.all([
        axios
          .get(`${CALENDAR_API_END_POINT}/status`, {
            withCredentials: true,
          })
          .catch(() => ({ data: null })),

        axios
          .get(`${CALENDAR_API_END_POINT}/recruiter-events`, {
            withCredentials: true,
          })
          .catch(() => ({ data: { events: [] } })),

        axios
          .get(`${CALENDAR_API_END_POINT}/candidates-for-interview`, {
            withCredentials: true,
          })
          .catch(() => ({ data: { candidates: [] } })),
      ]);

      if (statusRes?.data) setConfigStatus(statusRes.data);

      if (eventsRes?.data?.events) {
        setEvents(eventsRes.data.events);
      }

      if (candidatesRes?.data?.candidates) {
        setCandidates(candidatesRes.data.candidates);
      }
    } catch (error) {
      console.error("Error loading calendar data:", error);
      toast.error("Failed to load interview calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const getGoogleCalendarWebLink = (event) => {
    try {
      const startTime = event.interviewDate
        ? new Date(event.interviewDate)
        : new Date();

      const duration = event.durationMinutes || 45;
      const endTime = new Date(
        startTime.getTime() + duration * 60 * 1000
      );

      const toGCalIso = (date) =>
        date.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const title = encodeURIComponent(
        `Interview: ${
          event.applicant?.fullname || "Candidate"
        } - ${event.job?.jobDetails?.title || "Role"}`
      );

      const details = encodeURIComponent(
        `GreatHire Interview Session\n` +
          `Candidate: ${event.applicant?.fullname || "N/A"}\n` +
          `Email: ${event.applicant?.emailId?.email || ""}\n` +
          `Phone: ${event.applicant?.phoneNumber?.number || ""}\n` +
          `Meeting Link: ${
            event.interviewLink || "https://meet.google.com/new"
          }`
      );

      const location = encodeURIComponent(
        event.interviewLink || "Google Meet"
      );

      const dates = `${toGCalIso(startTime)}/${toGCalIso(endTime)}`;

      return (
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${title}&dates=${dates}&details=${details}&location=${location}`
      );
    } catch {
      return "https://calendar.google.com";
    }
  };

  // Open Schedule / Reschedule Modal
  const handleOpenScheduleModal = (application = null) => {
    setSelectedApplication(application);

    if (application) {
      const appDate = application.interviewDate
        ? new Date(application.interviewDate)
        : selectedDate;

      setFormData({
        applicationId: application._id,
        scheduledDate: toLocalDateInput(appDate),
        scheduledTime: application.interviewDate
          ? toLocalTimeInput(appDate)
          : "11:00",
        durationMinutes: application.durationMinutes || 45,
        mode: application.mode || "Online Video Interview",
        meetingLink:
          application.interviewLink || "https://meet.google.com/new",
        notes: application.notes || "",
      });
    } else {
      // IMPORTANT: Use the date selected in the calendar.
      // Do not automatically use tomorrow's date.
      setFormData({
        applicationId: candidates[0]?._id || "",
        scheduledDate: toLocalDateInput(selectedDate),
        scheduledTime: "11:00",
        durationMinutes: 45,
        mode: "Online Video Interview",
        meetingLink: "https://meet.google.com/new",
        notes: "",
      });
    }

    setIsScheduleModalOpen(true);
  };

  // Schedule / Reschedule interview
  const handleSaveInterview = async (e) => {
    e.preventDefault();

    if (!formData.applicationId) {
      toast.error("Please select a candidate application");
      return;
    }

    if (!formData.scheduledDate || !formData.scheduledTime) {
      toast.error("Please select both date and time");
      return;
    }

    // Build local date/time, then convert to ISO for the backend.
    const combinedDateTime = new Date(
      `${formData.scheduledDate}T${formData.scheduledTime}:00`
    );

    if (Number.isNaN(combinedDateTime.getTime())) {
      toast.error("Please enter a valid interview date and time");
      return;
    }

    const today = new Date();
today.setHours(0, 0, 0, 0);

const interviewDay = new Date(formData.scheduledDate + "T00:00:00");

if (interviewDay < today) {
  toast.error("You cannot schedule an interview for a previous date.");
  return;
}

    setSchedulingLoading(true);

    try {
      const res = await axios.post(
        `${CALENDAR_API_END_POINT}/schedule-interview`,
        {
          applicationId: formData.applicationId,
          scheduledDate: combinedDateTime.toISOString(),
          durationMinutes: Number(formData.durationMinutes),
          mode: formData.mode,
          meetingLink: formData.meetingLink,
          notes: formData.notes,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(
          res.data.message || "Interview scheduled successfully!"
        );

        setIsScheduleModalOpen(false);

        // Keep the selected calendar day in sync with the booked interview.
        setSelectedDate(new Date(combinedDateTime));
        setCurrentDate(
          new Date(
            combinedDateTime.getFullYear(),
            combinedDateTime.getMonth(),
            1
          )
        );

        await fetchCalendarData();
      } else {
        toast.error(res.data.message || "Failed to schedule interview");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);

      toast.error(
        error.response?.data?.message || "Failed to schedule interview"
      );
    } finally {
      setSchedulingLoading(false);
    }
  };

  // Open the custom delete confirmation modal
  const handleCancelInterview = (event) => {
    setInterviewToDelete(event);
    setDeleteModalOpen(true);
  };

  // Actually delete only after the recruiter confirms
  const confirmDeleteInterview = async () => {
    if (!interviewToDelete?._id) return;

    setDeletingInterview(true);

    try {
      const res = await axios.delete(
        `${CALENDAR_API_END_POINT}/cancel-interview/${interviewToDelete._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(
          res.data.message || "Interview cancelled successfully"
        );

        setDeleteModalOpen(false);
        setInterviewToDelete(null);

        await fetchCalendarData();
      } else {
        toast.error(res.data.message || "Failed to cancel interview");
      }
    } catch (error) {
      console.error("Error cancelling interview:", error);

      toast.error(
        error.response?.data?.message || "Failed to cancel interview"
      );
    } finally {
      setDeletingInterview(false);
    }
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNumber: daysInPrevMonth - i,
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        dayNumber: i,
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    const remaining = (7 - (days.length % 7)) % 7;

    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNumber: i,
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [
    year,
    month,
    firstDayIndex,
    daysInMonth,
    daysInPrevMonth,
  ]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase();

    return events.filter(
      (event) =>
        event.applicant?.fullname?.toLowerCase().includes(query) ||
        event.applicant?.emailId?.email?.toLowerCase().includes(query) ||
        event.job?.jobDetails?.title?.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  const eventsOnSelectedDate = useMemo(
    () =>
      filteredEvents.filter((event) => {
        if (!event.interviewDate) return false;

        return isSameDay(
          new Date(event.interviewDate),
          selectedDate
        );
      }),
    [filteredEvents, selectedDate]
  );

  const stats = useMemo(() => {
    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const sevenDaysLater = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    const todayCount = events.filter((event) => {
      if (!event.interviewDate) return false;
      const date = new Date(event.interviewDate);
      return date >= todayStart && date <= todayEnd;
    }).length;

    const upcomingWeekCount = events.filter((event) => {
      if (!event.interviewDate) return false;
      const date = new Date(event.interviewDate);
      return date >= now && date <= sevenDaysLater;
    }).length;

    return {
      total: events.length,
      today: todayCount,
      upcomingWeek: upcomingWeekCount,
      candidatesAvailable: candidates.length,
    };
  }, [events, candidates]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Interview Calendar &amp; Google Meet
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Manage interviews and candidate calls.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={fetchCalendarData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ExternalLink size={15} />
            Open Google Calendar
          </a>

          <button
            onClick={() => handleOpenScheduleModal()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* GOOGLE CALENDAR STATUS */}
      <div className="mb-6 p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-slate-800 flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-emerald-500" size={22} />
          <div>
            <p className="text-sm font-semibold">
              Google Calendar Integration
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calendar ID:{" "}
              <span className="font-mono">
                {configStatus?.calendarId ||
                  "babdegreathire2025@gmail.com"}
              </span>
            </p>
          </div>
        </div>

        <span className="text-xs text-emerald-600 dark:text-emerald-400">
          Automatic synchronization enabled
        </span>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          ["Total Interviews", stats.total, "text-slate-900 dark:text-white"],
          ["Interviews Today", stats.today, "text-blue-600"],
          ["Next 7 Days", stats.upcomingWeek, "text-purple-600"],
          ["Ready Candidates", stats.candidatesAvailable, "text-emerald-600"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            activeTab === "workspace"
              ? "bg-blue-600 text-white"
              : "hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          Interactive Calendar ({filteredEvents.length})
        </button>

        <button
          onClick={() => setActiveTab("google_calendar")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            activeTab === "google_calendar"
              ? "bg-blue-600 text-white"
              : "hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          Official Google Calendar
        </button>
      </div>

      {activeTab === "google_calendar" ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex flex-wrap justify-between gap-3 mb-4">
            <h3 className="font-bold">Google Calendar</h3>
            <a
              href="https://calendar.google.com/calendar/u/0/r"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 flex items-center gap-1"
            >
              Open Full Screen <ExternalLink size={14} />
            </a>
          </div>

          <div className="w-full h-[420px] sm:h-[600px] lg:h-[760px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=babdegreathire2025%40gmail.com&ctz=Asia%2FKolkata&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0"
              title="Google Calendar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CALENDAR */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">
                  {monthName} {year}
                </h2>

                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Previous month">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={goToToday} className="px-3 py-2 text-xs border-x border-slate-200 dark:border-slate-700">
                    Today
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Next month">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate/job..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                  />
                </div>

                <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("month")}
                    className={`px-3 py-1.5 text-xs rounded-md ${viewMode === "month" ? "bg-blue-600 text-white" : ""}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 text-xs rounded-md ${viewMode === "list" ? "bg-blue-600 text-white" : ""}`}
                  >
                    All List
                  </button>
                </div>
              </div>
            </div>

            {viewMode === "month" ? (
              <>
                <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-slate-400">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                  {calendarDays.map((item) => {
                    const dayEvents = filteredEvents.filter((event) => {
                      if (!event.interviewDate) return false;
                      return isSameDay(new Date(event.interviewDate), item.date);
                    });

                    const isToday = isSameDay(new Date(), item.date);
                    const isSelected = isSameDay(selectedDate, item.date);

                    return (
                      <button
                        key={item.date.toDateString()}
                        // onClick={() => {
                        //   setSelectedDate(item.date);

                        //   // If a date from the previous/next month is clicked,
                        //   // navigate to that month too.
                        //   if (!item.isCurrentMonth) {
                        //     setCurrentDate(
                        //       new Date(
                        //         item.date.getFullYear(),
                        //         item.date.getMonth(),
                        //         1
                        //       )
                        //     );
                        //   }
                        // }}
                        onClick={() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const clickedDate = new Date(item.date);
  clickedDate.setHours(0, 0, 0, 0);

  // Do not allow selecting past dates
  if (clickedDate < today) {
    toast.error("You cannot select a previous date.");
    return;
  }

  setSelectedDate(item.date);

  if (!item.isCurrentMonth) {
    setCurrentDate(
      new Date(
        item.date.getFullYear(),
        item.date.getMonth(),
        1
      )
    );
  }
}}
                        className={`min-h-[75px] md:min-h-[90px] p-1.5 rounded-xl text-left border transition ${
                          isSelected
                            ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                            : isToday
                            ? "border-blue-300 dark:border-blue-700"
                            : "border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                        } ${!item.isCurrentMonth ? "opacity-50" : ""}
${item.date < new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
) ? "opacity-30 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${isToday ? "bg-blue-600 text-white" : ""}`}>
                            {item.dayNumber}
                          </span>

                          {dayEvents.length > 0 && (
                            <span className="text-[10px] px-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 space-y-1 overflow-hidden">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div key={event._id} className="truncate text-[10px] px-1 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                              {event.applicant?.fullname || "Candidate"}
                            </div>
                          ))}

                          {dayEvents.length > 2 && (
                            <span className="text-[9px] text-slate-400">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
                {filteredEvents.length === 0 ? (
                  <p className="py-12 text-center text-sm text-slate-400">
                    No scheduled interviews found.
                  </p>
                ) : (
                  filteredEvents.map((event) => (
                    <div key={event._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30">
                          <Video size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">
                            {event.applicant?.fullname || "Candidate"}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {event.job?.jobDetails?.title || "Role"} · {formatIST(event.interviewDate)}
                          </p>
                          {event.interviewLink && (
                            <a href={event.interviewLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600 inline-flex items-center gap-1 mt-1">
                              Meeting Link <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a href={getGoogleCalendarWebLink(event)} target="_blank" rel="noreferrer" className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg">
                          + GCal
                        </a>
                        <button onClick={() => handleOpenScheduleModal(event)} className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-700">
                          Reschedule
                        </button>
                        <button onClick={() => handleCancelInterview(event)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Cancel interview">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* SELECTED DATE DETAILS */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-5">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Selected Date
                  </p>
                  <h3 className="text-base font-bold mt-1">
                    {selectedDate.toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                  {eventsOnSelectedDate.length} Interview{eventsOnSelectedDate.length === 1 ? "" : "s"}
                </span>
              </div>

              {eventsOnSelectedDate.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarCheck size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No interviews scheduled for this date.
                  </p>
                  <button
                    onClick={() => handleOpenScheduleModal()}
                    className="mt-3 inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus size={14} />
                    Book Interview
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto">
                  {eventsOnSelectedDate.map((event) => (
                    <div key={event._id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 flex flex-col gap-2.5">
                      <div className="flex justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold flex items-center gap-1.5">
                            <User size={14} className="text-blue-600" />
                            {event.applicant?.fullname || "Candidate"}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Briefcase size={12} />
                            {event.job?.jobDetails?.title || "Role"}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600">
                          Scheduled
                        </span>
                      </div>

                      <p className="text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Clock size={13} className="text-blue-500" />
                        {formatIST(event.interviewDate)}
                      </p>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
                        {event.applicant?.emailId?.email && (
                          <p className="flex items-center gap-1.5 break-all">
                            <Mail size={12} />
                            {event.applicant.emailId.email}
                          </p>
                        )}
                        {event.applicant?.phoneNumber?.number && (
                          <p className="flex items-center gap-1.5">
                            <Phone size={12} />
                            {event.applicant.phoneNumber.number}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2">
                        {event.interviewLink ? (
                          <a href={event.interviewLink} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                            <Video size={14} />
                            Join Meet
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">No meeting link</span>
                        )}

                        <a href={getGoogleCalendarWebLink(event)} target="_blank" rel="noreferrer" title="Add to Google Calendar" className="p-2 rounded-lg border border-slate-300 dark:border-slate-700">
                          <Share2 size={14} />
                        </a>

                        <button onClick={() => handleOpenScheduleModal(event)} className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs">
                          Edit
                        </button>

                        <button onClick={() => handleCancelInterview(event)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Cancel interview">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* READY CANDIDATES */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold">Ready for Interview</h3>
                <span className="text-xs text-slate-400">
                  {candidates.length} candidates
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Select a candidate to schedule an interview.
              </p>

              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                {candidates.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">
                    No pending candidates without interviews.
                  </p>
                ) : (
                  candidates.slice(0, 10).map((candidate) => (
                    <div key={candidate._id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">
                          {candidate.applicant?.fullname || "Candidate"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {candidate.job?.jobDetails?.title || "Role"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenScheduleModal(candidate)}
                        className="px-2 py-1.5 text-[11px] rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 shrink-0"
                      >
                        Schedule
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE / RESCHEDULE MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div>
                <h3 className="text-lg font-bold">
                  {selectedApplication?.interviewDate
                    ? "Reschedule Interview"
                    : "Schedule Interview"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Schedule your interview and synchronize your calendar.
                </p>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white" aria-label="Close scheduling dialog">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Candidate / Job Application
                </label>

                {selectedApplication ? (
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <p className="font-bold">
                      {selectedApplication.applicant?.fullname || "Candidate"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedApplication.job?.jobDetails?.title || "Role"}
                      {" · "}
                      {selectedApplication.applicant?.emailId?.email || ""}
                    </p>
                  </div>
                ) : (
                  <select
                    value={formData.applicationId}
                    onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    required
                  >
                    <option value="">Select candidate to interview</option>
                    {candidates.map((candidate) => (
                      <option key={candidate._id} value={candidate._id}>
                        {candidate.applicant?.fullname || "Candidate"} — {candidate.job?.jobDetails?.title || "Role"}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    min={toLocalDateInput(new Date())}
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full min-w-0 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Time (IST)
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full min-w-0 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Duration
                  </label>
                  <select
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Interview Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Online Video Interview">Google Meet / Video</option>
                    <option value="Phone Interview">Telephonic</option>
                    <option value="In-Person Interview">In-Person / Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Meeting URL / Location
                </label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  required
                />
                <a href="https://meet.google.com/new" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                  + Create a new Google Meet
                </a>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add interview instructions or notes..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 resize-y"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={schedulingLoading} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 text-sm">
                  {schedulingLoading && <RefreshCw size={14} className="animate-spin" />}
                  {schedulingLoading ? "Saving..." : selectedApplication?.interviewDate ? "Update Interview" : "Schedule Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && interviewToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deletingInterview) {
              setDeleteModalOpen(false);
              setInterviewToDelete(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-interview-title"
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50">
                  <Trash2 size={23} className="text-rose-600 dark:text-rose-400" />
                </div>

                <div className="flex-1">
                  <h3 id="delete-interview-title" className="text-lg font-bold text-slate-900 dark:text-white">
                    Cancel this interview?
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    This action will cancel the scheduled interview. Please review the details before continuing.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (!deletingInterview) {
                      setDeleteModalOpen(false);
                      setInterviewToDelete(null);
                    }
                  }}
                  disabled={deletingInterview}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                  aria-label="Close delete confirmation"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-5 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <User size={18} className="text-blue-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white break-words">
                      {interviewToDelete.applicant?.fullname || "Candidate"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {interviewToDelete.job?.jobDetails?.title || "Interview"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-start gap-1.5">
                      <CalendarIcon size={14} className="shrink-0 mt-0.5" />
                      <span>{formatIST(interviewToDelete.interviewDate)}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2.5 items-start text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>
                  The calendar event may also be removed from Google Calendar, depending on your backend cancellation logic.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                disabled={deletingInterview}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setInterviewToDelete(null);
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 text-sm font-semibold disabled:opacity-50"
              >
                Keep Interview
              </button>

              <button
                type="button"
                disabled={deletingInterview}
                onClick={confirmDeleteInterview}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold disabled:opacity-50"
              >
                {deletingInterview ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Yes, Cancel Interview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterCalendar;
