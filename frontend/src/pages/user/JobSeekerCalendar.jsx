import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Copy,
  Check,
  CalendarCheck,
  Sparkles,
  RefreshCw,
  Bell,
  HelpCircle,
  Plus,
  Trash2,
  X,
  FileText,
} from "lucide-react";
import { CALENDAR_API_END_POINT } from "@/utils/ApiEndPoint";

const JobSeekerCalendar = () => {
  const [events, setEvents] = useState([]);
  const [customEvents, setCustomEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("gh_user_custom_calendar_events");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'calendar' | 'past'
  const [copiedId, setCopiedId] = useState(null);

  // Add Event Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "Personal Reminder",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    duration: 45,
    meetingLink: "",
    notes: "",
  });

  // Persist custom events
  useEffect(() => {
    try {
      localStorage.setItem("gh_user_custom_calendar_events", JSON.stringify(customEvents));
    } catch (e) {}
  }, [customEvents]);

  // Calendar month state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchJobSeekerEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${CALENDAR_API_END_POINT}/jobseeker-events`, {
        withCredentials: true,
      });
      if (res.data?.events) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error("Error fetching candidate interviews:", err);
      toast.error("Could not load your interview schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobSeekerEvents();
  }, []);

  // Format Helper
  const formatIST = (dateStr) => {
    if (!dateStr) return "To be scheduled";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Google Calendar 1-Click Link
  const getGoogleCalendarWebLink = (event) => {
    try {
      const startTime = event.interviewDate ? new Date(event.interviewDate) : new Date();
      const duration = event.durationMinutes || 45;
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      const toGCalIso = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const titleText = event.title || (event.job?.jobDetails?.title ? `Interview: ${event.job.jobDetails.title}` : "GreatHire Event");
      const title = encodeURIComponent(titleText);
      const details = encodeURIComponent(
        `${event.notes || "GreatHire Scheduled Event"}\nMeeting/Location: ${
          event.interviewLink || event.meetingLink || "Google Meet"
        }`
      );
      const location = encodeURIComponent(event.interviewLink || event.meetingLink || "Google Meet");
      const dates = `${toGCalIso(startTime)}/${toGCalIso(endTime)}`;

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    } catch {
      return "https://calendar.google.com";
    }
  };

  const handleCopyLink = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Meeting link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddCustomEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    const combinedDateTime = new Date(`${newEvent.date}T${newEvent.time}:00`);
    const customItem = {
      _id: `custom-${Date.now()}`,
      isCustom: true,
      title: newEvent.title.trim(),
      category: newEvent.category,
      interviewDate: combinedDateTime.toISOString(),
      durationMinutes: Number(newEvent.duration),
      interviewLink: newEvent.meetingLink.trim(),
      notes: newEvent.notes.trim(),
    };

    setCustomEvents((prev) => [customItem, ...prev]);
    toast.success("Custom event added to your calendar!");
    setIsAddModalOpen(false);
    setNewEvent({
      title: "",
      category: "Personal Reminder",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      duration: 45,
      meetingLink: "",
      notes: "",
    });
  };

  const handleDeleteCustomEvent = (id) => {
    setCustomEvents((prev) => prev.filter((ev) => ev._id !== id));
    toast.success("Event removed from calendar.");
  };

  // All combined events
  const allEvents = useMemo(() => {
    return [...events, ...customEvents];
  }, [events, customEvents]);

  // Split into upcoming and past
  const { upcomingInterviews, pastInterviews, nextInterview } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];

    allEvents.forEach((ev) => {
      if (!ev.interviewDate) return;
      const d = new Date(ev.interviewDate);
      if (d >= now) {
        upcoming.push(ev);
      } else {
        past.push(ev);
      }
    });

    upcoming.sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));
    past.sort((a, b) => new Date(b.interviewDate) - new Date(a.interviewDate));

    return {
      upcomingInterviews: upcoming,
      pastInterviews: past,
      nextInterview: upcoming[0] || null,
    };
  }, [allEvents]);

  // Calendar Grid Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

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
  }, [year, month, firstDayIndex, daysInMonth, daysInPrevMonth]);

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const selectedDateEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (!ev.interviewDate) return false;
      const d = new Date(ev.interviewDate);
      return isSameDay(d, selectedDate);
    });
  }, [allEvents, selectedDate]);

  return (
    <>
      <Helmet>
        <title>My Scheduled Interviews &amp; Calendar | GreatHire</title>
        <meta
          name="description"
          content="Track your scheduled interviews, access Google Meet video links, and add custom events or hiring dates to your Google Calendar on GreatHire."
        />
      </Helmet>

      <Navbar />

      <div className="w-full min-h-screen pt-12 sm:pt-4 pb-16 bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-100/60 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950 text-slate-800 dark:text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* ── HEADER ── */}
          <div className="mb-6 p-6 rounded-2xl bg-white/70 dark:bg-gray-800/50 backdrop-blur-md border border-blue-200/60 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <CalendarIcon size={22} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  My Interview Calendar
                </h1>
              </div>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Manage upcoming interview rounds, personal career reminders, and sync directly with Google Calendar.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2 self-start md:self-center">
              <button
                onClick={fetchJobSeekerEvents}
                disabled={loading}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 hover:bg-slate-50 transition shadow-sm"
              >
                <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition shadow-md hover:shadow-lg"
              >
                <Plus size={16} />
                <span>Add Event</span>
              </button>

              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition shadow-sm"
              >
                <ExternalLink size={14} />
                <span>Google Calendar</span>
              </a>
            </div>
          </div>

          {/* ── NEXT INTERVIEW SPOTLIGHT BANNER ── */}
          {nextInterview && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
                    <Sparkles size={14} className="text-yellow-300" />
                    <span>Next Upcoming Interview</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                    {nextInterview.job?.jobDetails?.title || "Role"}
                  </h2>
                  <p className="text-blue-100 text-sm font-medium mt-1 flex items-center gap-2">
                    <Building2 size={16} />
                    <span>
                      {nextInterview.job?.jobDetails?.companyName ||
                        nextInterview.job?.company?.companyName ||
                        "Company"}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-blue-50">
                    <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-lg">
                      <Clock size={15} />
                      <span>{formatIST(nextInterview.interviewDate)} (IST)</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-lg">
                      <Video size={15} />
                      <span>Google Meet Conference</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  {nextInterview.interviewLink && (
                    <a
                      href={nextInterview.interviewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
                    >
                      <Video size={18} />
                      <span>Join Google Meet</span>
                    </a>
                  )}

                  <a
                    href={getGoogleCalendarWebLink(nextInterview)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm border border-white/30 backdrop-blur-sm transition"
                  >
                    <CalendarCheck size={18} />
                    <span>Add to Google Calendar</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS NAVIGATION ── */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-gray-700 pb-3">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                activeTab === "upcoming"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-gray-800"
              }`}
            >
              Upcoming ({upcomingInterviews.length})
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                activeTab === "calendar"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-gray-800"
              }`}
            >
              Month Calendar View
            </button>
            <button
              onClick={() => setActiveTab("google_calendar")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                activeTab === "google_calendar"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-gray-800"
              }`}
            >
              Google Calendar Live Embed
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                activeTab === "past"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-gray-800"
              }`}
            >
              Past ({pastInterviews.length})
            </button>
          </div>

          {/* ── TAB CONTENT ── */}
          {activeTab === "upcoming" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingInterviews.length === 0 ? (
                <div className="md:col-span-2 py-16 text-center bg-white/70 dark:bg-gray-800/40 rounded-2xl border border-slate-200 dark:border-gray-700 p-8">
                  <CalendarCheck size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    No Upcoming Interviews Scheduled
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    When recruiters schedule an interview with you, it will show up here automatically with meeting links and Google Calendar sync.
                  </p>
                </div>
              ) : (
                upcomingInterviews.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {ev.title || ev.job?.jobDetails?.title || "Event"}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <Building2 size={13} />
                            <span>
                              {ev.category ||
                                ev.job?.jobDetails?.companyName ||
                                ev.job?.company?.companyName ||
                                "GreatHire"}
                            </span>
                          </p>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          ev.isCustom
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        }`}>
                          {ev.isCustom ? ev.category : "Confirmed"}
                        </span>
                      </div>

                      <div className="my-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-col gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
                          <Clock size={14} />
                          <span>{formatIST(ev.interviewDate)} (IST)</span>
                        </div>
                        {ev.notes && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            <strong>Notes:</strong> {ev.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <Video size={13} />
                          <span>{ev.interviewLink ? "Online Video Call" : "Personal Reminder"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-gray-700 flex flex-wrap items-center gap-2">
                      {ev.interviewLink && (
                        <a
                          href={ev.interviewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                        >
                          <Video size={14} />
                          <span>Join Meet</span>
                        </a>
                      )}

                      <a
                        href={getGoogleCalendarWebLink(ev)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                        title="Add to personal Google Calendar"
                      >
                        <CalendarCheck size={14} />
                        <span>+ Google Calendar</span>
                      </a>

                      {ev.isCustom && (
                        <button
                          onClick={() => handleDeleteCustomEvent(ev._id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-gray-700 transition"
                          title="Delete Event"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}

                      {ev.interviewLink && (
                        <button
                          onClick={() => handleCopyLink(ev.interviewLink, ev._id)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-600 dark:text-slate-300 transition"
                          title="Copy Link"
                        >
                          {copiedId === ev._id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Month Grid */}
              <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {monthName} {year}
                  </h3>
                  <div className="flex items-center rounded-lg border border-slate-200 dark:border-gray-700 overflow-hidden">
                    <button
                      onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 transition"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const now = new Date();
                        setCurrentDate(now);
                        setSelectedDate(now);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-gray-700 border-x border-slate-200 dark:border-gray-700 transition"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-slate-400">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((item, idx) => {
                    const dayEvents = events.filter((e) => {
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
                        className={`min-h-[64px] p-1.5 rounded-xl text-left flex flex-col justify-between border transition ${
                          isSelected
                            ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/60 dark:bg-blue-950/40"
                            : isToday
                            ? "border-blue-300 dark:border-blue-700 bg-slate-50 dark:bg-gray-700/60"
                            : item.isCurrentMonth
                            ? "border-slate-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-slate-50"
                            : "border-transparent text-slate-300 dark:text-slate-600 bg-transparent"
                        }`}
                      >
                        <span
                          className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                            isToday
                              ? "bg-blue-600 text-white"
                              : item.isCurrentMonth
                              ? "text-slate-700 dark:text-slate-200"
                              : "text-slate-400"
                          }`}
                        >
                          {item.dayNumber}
                        </span>

                        {dayEvents.length > 0 && (
                          <div className="w-full flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate">
                              Interview
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Details */}
              <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Selected Day
                </h4>
                <p className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-gray-700">
                  {selectedDate.toLocaleDateString("en-IN", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                <div className="mt-4 flex flex-col gap-3">
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-6 text-center">
                      No interviews scheduled on this day.
                    </p>
                  ) : (
                    selectedDateEvents.map((ev) => (
                      <div
                        key={ev._id}
                        className="p-3 rounded-xl border border-blue-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-950/20"
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {ev.job?.jobDetails?.title || "Role"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {ev.job?.jobDetails?.companyName || "Company"} • {formatIST(ev.interviewDate)}
                        </p>
                        {ev.interviewLink && (
                          <a
                            href={ev.interviewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          >
                            <Video size={13} />
                            <span>Join Video Call</span>
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "google_calendar" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-gray-700">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Google Calendar Live View</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Live Sync
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official Google Calendar for GreatHire interview conferences and schedules.
                  </p>
                </div>
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
              <div className="relative w-full h-[700px] rounded-xl overflow-hidden border border-slate-200 dark:border-gray-700 shadow-inner bg-slate-50 dark:bg-slate-900">
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=babdegreathire2025%40gmail.com&ctz=Asia%2FKolkata&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0"
                  style={{ border: 0 }}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  title="Google Calendar Candidate View"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {activeTab === "past" && (
            <div className="flex flex-col gap-3">
              {pastInterviews.length === 0 ? (
                <div className="py-12 text-center bg-white/70 dark:bg-gray-800/40 rounded-2xl border border-slate-200 dark:border-gray-700 p-8">
                  <p className="text-xs text-slate-400">No past interviews on record.</p>
                </div>
              ) : (
                pastInterviews.map((ev) => (
                  <div
                    key={ev._id}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-80 hover:opacity-100 transition"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {ev.job?.jobDetails?.title || "Role"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ev.job?.jobDetails?.companyName || "Company"} • {formatIST(ev.interviewDate)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
                      Completed / Past
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── INTERVIEW TIPS CARD ── */}
          <div className="mt-8 p-5 rounded-2xl bg-white/70 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-2">
              <HelpCircle size={15} />
              <span>GreatHire Candidate Interview Tips</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-700/40 border border-slate-100 dark:border-gray-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">🎧 Audio &amp; Video</span>
                Test your camera, microphone, and internet connection 10 minutes before joining.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-700/40 border border-slate-100 dark:border-gray-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">📄 Documents</span>
                Have your resume and portfolio handy on your screen to reference during the interview.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-700/40 border border-slate-100 dark:border-gray-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">⏰ Punctuality</span>
                Join the Google Meet room 3–5 minutes early to avoid any last-minute delays.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADD CUSTOM EVENT MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-700 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus size={18} className="text-blue-600" />
                  <span>Add Event to Calendar</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Create personal career reminders, interview prep sessions, or custom meetings with 1-click Google Calendar sync.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomEvent} className="space-y-4 text-xs md:text-sm">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Java Interview Prep / HR Follow-up Call"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Category
                </label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Personal Reminder">Personal Reminder</option>
                  <option value="Interview Prep">Interview Preparation</option>
                  <option value="Direct HR Call">Direct HR Call</option>
                  <option value="Skill Learning">Skill Learning Session</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time (IST) *
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Duration & Meeting Link */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <select
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Meeting URL / Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.meetingLink}
                    onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/xxx..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Agenda (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  placeholder="Add any reminders, topics, or links to review..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-gray-700 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-md"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default JobSeekerCalendar;
