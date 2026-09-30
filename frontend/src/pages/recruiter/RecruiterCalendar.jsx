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
  AlertCircle,
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
  const [viewMode, setViewMode] = useState("month"); // 'month' | 'list'
  const [activeTab, setActiveTab] = useState("workspace"); // 'workspace' | 'google_calendar'

  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    applicationId: "",
    scheduledDate: "",
    scheduledTime: "11:00",
    durationMinutes: 45,
    mode: "Online Video Interview",
    meetingLink: "https://meet.google.com/new",
    notes: "",
  });

  // Fetch status & events
  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const [statusRes, eventsRes, candidatesRes] = await Promise.all([
        axios.get(`${CALENDAR_API_END_POINT}/status`, { withCredentials: true }).catch(() => ({ data: null })),
        axios.get(`${CALENDAR_API_END_POINT}/recruiter-events`, { withCredentials: true }).catch(() => ({ data: { events: [] } })),
        axios.get(`${CALENDAR_API_END_POINT}/candidates-for-interview`, { withCredentials: true }).catch(() => ({ data: { candidates: [] } })),
      ]);

      if (statusRes?.data) setConfigStatus(statusRes.data);
      if (eventsRes?.data?.events) setEvents(eventsRes.data.events);
      if (candidatesRes?.data?.candidates) setCandidates(candidatesRes.data.candidates);
    } catch (err) {
      console.error("Error loading calendar data:", err);
      toast.error("Failed to load interview calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  // Format Helper
  const formatIST = (dateStr) => {
    if (!dateStr) return "Not set";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Generate Google Calendar 1-Click Link
  const getGoogleCalendarWebLink = (event) => {
    try {
      const startTime = event.interviewDate ? new Date(event.interviewDate) : new Date();
      const endTime = new Date(startTime.getTime() + 45 * 60 * 1000);
      const toGCalIso = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const title = encodeURIComponent(
        `Interview: ${event.applicant?.fullname || "Candidate"} - ${
          event.job?.jobDetails?.title || "Role"
        }`
      );
      const details = encodeURIComponent(
        `GreatHire Interview Session\nCandidate: ${event.applicant?.fullname || "N/A"}\nEmail: ${
          event.applicant?.emailId?.email || ""
        }\nPhone: ${event.applicant?.phoneNumber?.number || ""}\nMeeting Link: ${
          event.interviewLink || "https://meet.google.com/new"
        }`
      );
      const location = encodeURIComponent(event.interviewLink || "Google Meet");
      const dates = `${toGCalIso(startTime)}/${toGCalIso(endTime)}`;

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    } catch {
      return "https://calendar.google.com";
    }
  };

  // Open Schedule / Reschedule Modal
  const handleOpenScheduleModal = (application = null) => {
    if (application) {
      setSelectedApplication(application);
      const appDate = application.interviewDate ? new Date(application.interviewDate) : new Date();
      const yyyy = appDate.getFullYear();
      const mm = String(appDate.getMonth() + 1).padStart(2, "0");
      const dd = String(appDate.getDate()).padStart(2, "0");
      const hh = String(appDate.getHours()).padStart(2, "0");
      const min = String(appDate.getMinutes()).padStart(2, "0");

      setFormData({
        applicationId: application._id,
        scheduledDate: `${yyyy}-${mm}-${dd}`,
        scheduledTime: `${hh}:${min}`,
        durationMinutes: 45,
        mode: "Online Video Interview",
        meetingLink: application.interviewLink || "https://meet.google.com/new",
        notes: "",
      });
    } else {
      setSelectedApplication(null);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const dd = String(tomorrow.getDate()).padStart(2, "0");

      setFormData({
        applicationId: candidates[0]?._id || "",
        scheduledDate: `${yyyy}-${mm}-${dd}`,
        scheduledTime: "11:00",
        durationMinutes: 45,
        mode: "Online Video Interview",
        meetingLink: "https://meet.google.com/new",
        notes: "",
      });
    }
    setIsScheduleModalOpen(true);
  };

  // Submit Schedule / Reschedule
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

    setSchedulingLoading(true);
    try {
      const combinedDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`);

      const res = await axios.post(
        `${CALENDAR_API_END_POINT}/schedule-interview`,
        {
          applicationId: formData.applicationId,
          scheduledDate: combinedDateTime.toISOString(),
          durationMinutes: formData.durationMinutes,
          mode: formData.mode,
          meetingLink: formData.meetingLink,
          notes: formData.notes,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Interview scheduled & synced with Google Calendar!");
        setIsScheduleModalOpen(false);
        fetchCalendarData();
      } else {
        toast.error(res.data.message || "Failed to schedule interview");
      }
    } catch (err) {
      console.error("Error scheduling interview:", err);
      toast.error(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setSchedulingLoading(false);
    }
  };

  // Cancel Interview
  const handleCancelInterview = async (applicationId) => {
    if (!window.confirm("Are you sure you want to cancel this interview? It will be deleted from Google Calendar and candidate will be notified.")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${CALENDAR_API_END_POINT}/cancel-interview/${applicationId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Interview cancelled and Google Calendar updated");
        fetchCalendarData();
      }
    } catch (err) {
      console.error("Error cancelling interview:", err);
      toast.error(err.response?.data?.message || "Failed to cancel interview");
    }
  };

  // Month Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  // Calendar Grid Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const days = [];
    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNumber: daysInPrevMonth - i,
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        dayNumber: i,
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    // Next month padding days to complete 35 or 42 grid
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNumber: i,
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    return days;
  }, [year, month, firstDayIndex, daysInMonth, daysInPrevMonth]);

  // Filter events matching search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.applicant?.fullname?.toLowerCase().includes(q) ||
        e.applicant?.emailId?.email?.toLowerCase().includes(q) ||
        e.job?.jobDetails?.title?.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  // Events on currently selected date
  const eventsOnSelectedDate = useMemo(() => {
    return filteredEvents.filter((e) => {
      if (!e.interviewDate) return false;
      const d = new Date(e.interviewDate);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
      );
    });
  }, [filteredEvents, selectedDate]);

  // Stats calculation
  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const todayCount = events.filter((e) => {
      if (!e.interviewDate) return false;
      const d = new Date(e.interviewDate);
      return d >= todayStart && d <= todayEnd;
    }).length;

    const upcomingWeekCount = events.filter((e) => {
      if (!e.interviewDate) return false;
      const d = new Date(e.interviewDate);
      return d >= now && d <= sevenDaysLater;
    }).length;

    return {
      total: events.length,
      today: todayCount,
      upcomingWeek: upcomingWeekCount,
      candidatesAvailable: candidates.length,
    };
  }, [events, candidates]);

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 md:p-6 lg:p-8">
      {/* ── TOP HEADER & STATUS BAR ── */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Interview Calendar &amp; Google Meet
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Unified Google Calendar synchronization for interview scheduling and candidate calls.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={fetchCalendarData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh Calendar"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : ""} />
            <span>Refresh</span>
          </button>

          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ExternalLink size={15} />
            <span>Open Google Calendar</span>
          </a>

          <button
            onClick={() => handleOpenScheduleModal()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Plus size={16} />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

      {/* ── GOOGLE CALENDAR CONNECTION BANNER ── */}
      <div className="mb-6 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white dark:from-blue-950/40 dark:via-slate-800/40 dark:to-slate-800/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Google Calendar Integration: Active
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synced with calendar ID:{" "}
              <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                {configStatus?.calendarId || "babdegreathire2025@gmail.com"}
              </span>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          <span>Automatic Google Meet link generation enabled</span>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Interviews</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Interviews Today</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.today}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Next 7 Days</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.upcomingWeek}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Ready Candidates</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.candidatesAvailable}</p>
        </div>
      </div>

      {/* ── CALENDAR VIEW TABS ── */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === "workspace"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <CalendarIcon size={16} />
          <span>Interactive Calendar ({filteredEvents.length} Events)</span>
        </button>

        <button
          onClick={() => setActiveTab("google_calendar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === "google_calendar"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Official Google Calendar (Live Embed)</span>
        </button>
      </div>

      {activeTab === "google_calendar" ? (
        /* ── OFFICIAL GOOGLE CALENDAR EMBED ── */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 md:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Google Calendar Web Integration</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Live Sync
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Displaying official Google Calendar for <span className="font-mono text-blue-600 dark:text-blue-400">babdegreathire2025@gmail.com</span> (Asia/Kolkata IST).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://calendar.google.com/calendar/u/0/r"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
              >
                <span>Open in Full Screen</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
          <div className="relative w-full h-[760px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-50 dark:bg-slate-900">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=babdegreathire2025%40gmail.com&ctz=Asia%2FKolkata&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0"
              style={{ border: 0 }}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              title="Google Calendar"
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        /* ── MAIN CONTENT AREA: CALENDAR & DAY DETAILS ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar View (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 md:p-6 shadow-sm">
          {/* Calendar Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {monthName} {year}
              </h2>
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goToToday}
                  className="px-2.5 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-x border-slate-200 dark:border-slate-700 transition"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  aria-label="Next month"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* View Mode & Search */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate/job..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                    viewMode === "month"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  All List
                </button>
              </div>
            </div>
          </div>

          {/* VIEW: MONTH GRID */}
          {viewMode === "month" ? (
            <div>
              {/* Day Name Headers */}
              <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                {calendarDays.map((item, idx) => {
                  const dayEvents = filteredEvents.filter((e) => {
                    if (!e.interviewDate) return false;
                    const ed = new Date(e.interviewDate);
                    return isSameDay(ed, item.date);
                  });

                  const isToday = isSameDay(new Date(), item.date);
                  const isSelected = isSameDay(selectedDate, item.date);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(item.date)}
                      className={`min-h-[70px] md:min-h-[88px] p-1.5 md:p-2 rounded-xl text-left flex flex-col justify-between transition-all border ${
                        isSelected
                          ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                          : isToday
                          ? "border-blue-300 dark:border-blue-700 bg-slate-50 dark:bg-slate-800/80"
                          : item.isCurrentMonth
                          ? "border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800"
                          : "border-transparent text-slate-300 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-900/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                            isToday
                              ? "bg-blue-600 text-white"
                              : item.isCurrentMonth
                              ? "text-slate-700 dark:text-slate-200"
                              : "text-slate-400 dark:text-slate-600"
                          }`}
                        >
                          {item.dayNumber}
                        </span>

                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Event Snippets preview in cell */}
                      <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev, evIdx) => (
                          <div
                            key={evIdx}
                            className="truncate text-[10px] font-medium px-1 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50"
                          >
                            {ev.applicant?.fullname || "Candidate"}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] text-slate-400 font-semibold pl-1">
                            +{dayEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* VIEW: ALL LIST */
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700/60 max-h-[600px] overflow-y-auto pr-1">
              {filteredEvents.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No scheduled interviews found matching criteria.
                </div>
              ) : (
                filteredEvents.map((ev) => (
                  <div key={ev._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                        <Video size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {ev.applicant?.fullname || "Candidate"}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {ev.job?.jobDetails?.title || "Role"} • {formatIST(ev.interviewDate)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            Google Calendar Synced
                          </span>
                          {ev.interviewLink && (
                            <a
                              href={ev.interviewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              Meeting Link <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={getGoogleCalendarWebLink(ev)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Add to personal Google Calendar"
                      >
                        + GCal
                      </a>
                      <button
                        onClick={() => handleOpenScheduleModal(ev)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelInterview(ev._id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Cancel Interview"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Date Details (Right 4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60 mb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Date</p>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedDate.toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {eventsOnSelectedDate.length} Interview{eventsOnSelectedDate.length === 1 ? "" : "s"}
              </span>
            </div>

            {/* List of interviews on selected date */}
            {eventsOnSelectedDate.length === 0 ? (
              <div className="py-8 text-center">
                <CalendarCheck size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No interviews scheduled for this date.
                </p>
                <button
                  onClick={() => handleOpenScheduleModal()}
                  className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                >
                  <Plus size={14} />
                  <span>Book Interview</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
                {eventsOnSelectedDate.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User size={14} className="text-blue-600" />
                          {ev.applicant?.fullname || "Candidate"}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Briefcase size={12} />
                          {ev.job?.jobDetails?.title || "Role"}
                        </p>
                      </div>

                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Scheduled
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock size={13} className="text-blue-500" />
                      <span>{formatIST(ev.interviewDate)}</span>
                    </div>

                    {/* Candidate contacts */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex flex-col gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {ev.applicant?.emailId?.email && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail size={12} />
                          <span className="truncate">{ev.applicant.emailId.email}</span>
                        </div>
                      )}
                      {ev.applicant?.phoneNumber?.number && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} />
                          <span>{ev.applicant.phoneNumber.number}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      {ev.interviewLink ? (
                        <a
                          href={ev.interviewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                        >
                          <Video size={14} />
                          <span>Join Meet</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No meeting link</span>
                      )}

                      <a
                        href={getGoogleCalendarWebLink(ev)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        title="Add to Google Calendar"
                      >
                        <Share2 size={14} />
                      </a>

                      <button
                        onClick={() => handleOpenScheduleModal(ev)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleCancelInterview(ev._id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Cancel"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Schedule Helper: Candidates ready for interview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 md:p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
              <span>Ready for Interview</span>
              <span className="text-xs font-normal text-slate-400">{candidates.length} candidates</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Shortlisted or pending candidates ready to have an interview scheduled on Google Calendar.
            </p>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {candidates.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No pending candidates without interviews.</p>
              ) : (
                candidates.slice(0, 10).map((cand) => (
                  <div
                    key={cand._id}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {cand.applicant?.fullname || "Candidate"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {cand.job?.jobDetails?.title || "Role"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenScheduleModal(cand)}
                      className="px-2 py-1 text-[11px] font-semibold rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 shrink-0"
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

      {/* ── SCHEDULE / RESCHEDULE MODAL ── */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedApplication?.interviewDate ? "Reschedule Interview" : "Schedule Interview"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sync automatically with Google Calendar and notify the candidate.
                </p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="space-y-4 text-xs md:text-sm">
              {/* Candidate Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Candidate / Job Application
                </label>
                {selectedApplication ? (
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {selectedApplication.applicant?.fullname || "Candidate"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedApplication.job?.jobDetails?.title || "Role"} • {selectedApplication.applicant?.emailId?.email || ""}
                    </p>
                  </div>
                ) : (
                  <select
                    value={formData.applicationId}
                    onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select candidate to interview</option>
                    {candidates.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.applicant?.fullname} — {c.job?.jobDetails?.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time (IST)
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Duration and Mode Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <select
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Interview Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Online Video Interview">Google Meet / Video</option>
                    <option value="Phone Interview">Telephonic</option>
                    <option value="In-Person Interview">In-Person / Office</option>
                  </select>
                </div>
              </div>

              {/* Meeting Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting URL (Google Meet / Zoom / Location)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="w-full pl-3 pr-20 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    required
                  />
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + New Meet
                  </a>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={schedulingLoading}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {schedulingLoading && <RefreshCw size={14} className="animate-spin" />}
                  <span>{selectedApplication?.interviewDate ? "Update & Sync" : "Schedule & Sync"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterCalendar;
