import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import {
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiBookmark,
  FiShare2,
  FiBriefcase,
  FiFileText,
  FiSun,
  FiUsers,
  FiClock,
  FiBook,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const TABS = [
  "Overview",
  "Responsibilities",
  "Requirements",
  "Benefits",
  "Company",
];

function AccordionSection({
  title,
  defaultOpen = false,
  highlighted = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        highlighted
          ? "border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/30"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-left"
      >
        <span
          className={`flex items-center gap-2 font-semibold ${
            highlighted
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {highlighted && (
            <HiSparkles className="shrink-0" size={16} />
          )}

          {title}
        </span>

        {open ? (
          <FiChevronUp
            className="text-gray-400"
            size={18}
          />
        ) : (
          <FiChevronDown
            className="text-gray-400"
            size={18}
          />
        )}
      </button>

      {open && children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}

function OverviewStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <p className="break-words font-semibold text-gray-900 dark:text-gray-100">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

const getInitial = (job) => {
  const name =
    job?.jobDetails?.companyName ||
    job?.company?.name ||
    "G";

  return name.charAt(0).toUpperCase();
};

const getActiveDays = (createdAt) => {
  if (!createdAt) return 0;

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return 0;
  }

  const days = Math.floor(
    (Date.now() - createdDate.getTime()) / 86400000
  );

  return Number.isFinite(days) ? Math.max(days, 0) : 0;
};

const getArrayValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

// Format salary for display: prefix ₹ only for numeric values, and map the
// "Not disclosed" placeholder to a clean label instead of "₹Not disclosed".
const formatSalary = (salary) => {
  if (typeof salary !== "string") return "Salary not specified";
  const value = salary.trim();
  if (!value || /^not\s+disclosed$/i.test(value)) return "Salary not specified";
  if (value.startsWith("₹")) return value;
  if (/^\d/.test(value)) return `₹${value}`;
  return value;
};

// Normalize stored job HTML so the description renders as proper prose:
// plain-text JDs become paragraphs, leading bare text before the first tag
// is promoted into its own paragraph, a dangling truncated tag is removed,
// and runs of blank lines are collapsed.
const normalizeJobHtml = (html) => {
  if (typeof html !== "string" || !html.trim()) {
    return "<p>No description provided.</p>";
  }

  let out = html.trim();

  // No HTML at all → paragraph per blank-line block.
  if (!/<[a-z/!]/i.test(out)) {
    return out
      .split(/\n{2,}/)
      .filter((block) => block.trim())
      .map((block) => `<p>${block.trim().replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }

  // Bare text before the first tag (e.g. a title echo) → its own paragraph.
  const firstTag = out.search(/<[a-z/!]/i);
  if (firstTag > 0) {
    const lead = out.slice(0, firstTag).trim();
    out = (lead ? `<p>${lead}</p>` : "") + out.slice(firstTag);
  }

  // Cut a dangling partial tag left by truncated content.
  const lastLt = out.lastIndexOf("<");
  const lastGt = out.lastIndexOf(">");
  if (lastLt > lastGt) out = out.slice(0, lastLt);

  return out.replace(/(\s*\n\s*){3,}/g, "\n\n");
};

// Skills for the AI Job Snapshot: trimmed, empties dropped, and
// case-insensitively deduped so chips never repeat ("React" / "react").
const dedupeSkills = (value) => {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  const seen = new Set();
  const out = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const skill = item.trim();
    if (!skill) continue;
    const key = skill.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(skill);
  }
  return out;
};

export default function JobDescription() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const authUser = useSelector((state) => state.auth?.user);

  // Extract clean 24-character hex Mongo ObjectId if slug or trailing slash is attached
  const cleanJobId = useMemo(() => {
    if (!jobId) return "";
    const match = jobId.match(/[0-9a-fA-F]{24}/);
    return match ? match[0] : jobId;
  }, [jobId]);

  useEffect(() => {
    if (!cleanJobId) {
      setError("Job ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `${JOB_API_END_POINT}/get/${cleanJobId}`,
          {
            withCredentials: true,
          }
        );

        const jobData =
          response?.data?.job ||
          response?.data?.data ||
          response?.data ||
          null;

        if (!jobData) {
          setError("Job not found or no longer available.");
          setJob(null);
          return;
        }

        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);

        setError(
          err?.response?.data?.message ||
            "Job not found or no longer available."
        );

        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [cleanJobId]);

  const activeDays = useMemo(
    () => getActiveDays(job?.createdAt),
    [job?.createdAt]
  );

  const responsibilities = useMemo(
    () => getArrayValue(job?.jobDetails?.responsibilities),
    [job?.jobDetails?.responsibilities]
  );

  const qualifications = useMemo(
    () => getArrayValue(job?.jobDetails?.qualifications),
    [job?.jobDetails?.qualifications]
  );

  const benefits = useMemo(
    () => getArrayValue(job?.jobDetails?.benefits),
    [job?.jobDetails?.benefits]
  );

  // ── AI Job Snapshot data ─────────────────────────────────────────────
  // Static render of stored jobDetails (no AI call happens on this page).
  const snapshotSkills = useMemo(
    () => dedupeSkills(job?.jobDetails?.skills),
    [job?.jobDetails?.skills]
  );

  const snapshotPairs = useMemo(() => {
    const jd = job?.jobDetails;
    if (!jd) return [];

    const pairs = [];
    const add = (label, value) => {
      const text = Array.isArray(value)
        ? value
            .filter((item) => typeof item === "string" && item.trim())
            .map((item) => item.trim())
            .join(", ")
        : typeof value === "string"
          ? value.trim()
          : "";
      if (text) pairs.push({ label, value: text });
    };

    add("Education", jd.qualifications);
    add("Experience", jd.experience);
    add("Job Type", jd.jobType);
    add("Workplace", jd.workPlaceFlexibility);
    if (jd.salary && !/^not\s+disclosed$/i.test(String(jd.salary).trim())) {
      const salary = String(jd.salary).trim();
      pairs.push({
        label: "Salary",
        value: jd.salaryType ? `${salary} / ${jd.salaryType}` : salary,
      });
    }

    return pairs;
  }, [job?.jobDetails]);

  // Hide the whole card when nothing can be shown — no "—" filler cells.
  const showSnapshot =
    snapshotSkills.length > 0 || snapshotPairs.length > 0;

  const handleApply = () => {
    if (!job?._id) return;

    const applyPath = `/apply/${job._id}`;

    // Logged-in users go straight to the application form; the route guard
    // still validates the role.
    if (authUser) {
      navigate(applyPath);
      return;
    }

    // Automatic routing without asking for an email: a browser that has
    // logged in before (remembered jobseeker email) is treated as an
    // existing user → login page with the email prefilled; any other
    // browser is treated as a new user → signup. Both carry the return
    // path (?from=… / state.from) and each page links to the other, so a
    // misguess still lands back on this application in one click.
    const rememberedEmail = localStorage.getItem("rememberedJobseekerEmail");
    if (rememberedEmail) {
      navigate("/jobseeker-login", {
        state: { from: applyPath, email: rememberedEmail },
      });
      return;
    }

    navigate(`/signup?from=${encodeURIComponent(applyPath)}`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title:
            job?.jobDetails?.title ||
            "Job Opportunity",
          text: `Check out this job opportunity at ${
            job?.jobDetails?.companyName || "GreatHire"
          }.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Job link copied to clipboard.");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <Navbar />

        <main className="flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400">
          Loading job...
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <Navbar />

        <main className="flex flex-1 flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
          <p>{error || "Job not found."}</p>

          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse Jobs
          </button>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-start sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-2xl font-bold text-gray-400 shadow-sm dark:border-gray-700">
                  {getInitial(job)}
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                    {job?.jobDetails?.title || "Job Title"}
                  </h1>

                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base">
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {job?.jobDetails?.companyName || "Company"}
                    </span>

                    <span className="text-gray-300 dark:text-gray-600">
                      •
                    </span>

                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FiMapPin size={14} />
                      {job?.jobDetails?.location || "Location"}
                    </span>

                    <span className="text-gray-300 dark:text-gray-600">
                      •
                    </span>

                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FiBriefcase size={14} />
                      {job?.jobDetails?.workPlaceFlexibility || "—"}
                    </span>
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatSalary(job?.jobDetails?.salary)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {job?.jobDetails?.urgentHiring === "Yes" && (
                      <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
                        ⚡ Urgent Hiring
                      </span>
                    )}

                    <span className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                      <FiClock size={12} />
                      Responds in{" "}
                      {job?.jobDetails?.respondTime ?? "—"} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-row items-start gap-2 sm:flex-col sm:items-end">
                {job?.matchScore != null && (
                  <div className="rounded-xl bg-blue-50 px-4 py-2 text-right dark:bg-blue-950/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      AI Match Score
                    </p>

                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {job.matchScore}%
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Save job"
                    className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <FiBookmark size={18} />
                  </button>

                  <button
                    type="button"
                    aria-label="Share job"
                    onClick={handleShare}
                    className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <FiShare2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Overview */}
            <div className="p-5 sm:p-8">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Quick Overview
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <OverviewStat
                  icon={FiBriefcase}
                  label="Experience"
                  value={job?.jobDetails?.experience}
                />

                <OverviewStat
                  icon={FiFileText}
                  label="Type"
                  value={job?.jobDetails?.jobType}
                />

                <OverviewStat
                  icon={FiSun}
                  label="Shift"
                  value={job?.jobDetails?.shift}
                />

                <OverviewStat
                  icon={FiUsers}
                  label="Openings"
                  value={job?.jobDetails?.numberOfOpening}
                />

                <OverviewStat
                  icon={FiClock}
                  label="Posted"
                  value={`${activeDays}d ago`}
                />

                <OverviewStat
                  icon={FiBook}
                  label="Duration"
                  value={job?.jobDetails?.duration}
                />
              </div>

              {/* Tabs */}
              <div className="mt-6 flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                {TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 pb-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="mt-6 space-y-4">

                {/* Overview */}
                {activeTab === "Overview" && (
                  <>
                    {showSnapshot && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
                        <p className="mb-4 flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                          <HiSparkles size={16} />
                          AI Job Snapshot
                        </p>

                        {snapshotSkills.length > 0 && (
                          <div className="mb-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400">
                              Skills
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                              {snapshotSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {snapshotPairs.length > 0 && (
                          <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-blue-100 pt-4 dark:border-blue-900">
                            {snapshotPairs.map((pair) => (
                              <div key={pair.label} className="min-w-0">
                                <p className="text-xs text-blue-500 dark:text-blue-400">
                                  {pair.label}
                                </p>

                                <p className="mt-0.5 break-words text-sm font-medium text-gray-700 dark:text-gray-200">
                                  {pair.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <AccordionSection
                      title="About this Role"
                      defaultOpen
                    >
                      <div
                        className="max-w-none leading-relaxed text-gray-600 dark:text-gray-300 [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:pl-3 [&_blockquote]:italic [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_hr]:my-4 [&_hr]:border-gray-200 [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p]:last:mb-0 [&_strong]:font-semibold [&_strong]:text-gray-800 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 dark:[&_blockquote]:border-blue-800 dark:[&_h1]:text-gray-100 dark:[&_h2]:text-gray-100 dark:[&_h3]:text-gray-100 dark:[&_hr]:border-gray-700 dark:[&_strong]:text-gray-100"
                        dangerouslySetInnerHTML={{
                          __html: normalizeJobHtml(
                            job?.jobDetails?.details
                          ),
                        }}
                      />
                    </AccordionSection>

                    {responsibilities.length > 0 && (
                      <AccordionSection title="Responsibilities">
                        <ul className="space-y-2">
                          {responsibilities.map(
                            (item, index) => (
                              <li
                                key={`${item}-${index}`}
                                className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </AccordionSection>
                    )}
                  </>
                )}

                {/* Responsibilities */}
                {activeTab === "Responsibilities" && (
                  <>
                    {responsibilities.length > 0 ? (
                      <ul className="space-y-2">
                        {responsibilities.map(
                          (item, index) => (
                            <li
                              key={`${item}-${index}`}
                              className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No responsibilities provided.
                      </p>
                    )}
                  </>
                )}

                {/* Requirements */}
                {activeTab === "Requirements" && (
                  <>
                    {qualifications.length > 0 ? (
                      <ul className="space-y-2">
                        {qualifications.map(
                          (item, index) => (
                            <li
                              key={`${item}-${index}`}
                              className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No requirements provided.
                      </p>
                    )}
                  </>
                )}

                {/* Benefits */}
                {activeTab === "Benefits" && (
                  <>
                    {benefits.length > 0 ? (
                      <ul className="space-y-2">
                        {benefits.map(
                          (item, index) => (
                            <li
                              key={`${item}-${index}`}
                              className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No benefits provided.
                      </p>
                    )}
                  </>
                )}

                {/* Company */}
                {activeTab === "Company" && (
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">
                        Company:
                      </span>{" "}
                      {job?.jobDetails?.companyName ||
                        "—"}
                    </p>

                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {job?.jobDetails?.location || "—"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Footer */}
            <div className="sticky bottom-0 flex flex-col items-start justify-between gap-3 rounded-b-2xl border-t border-gray-100 bg-white/95 p-5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 sm:flex-row sm:items-center sm:p-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Ready to apply?
                </p>

                <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  ⚡ Typically responds within{" "}
                  {job?.jobDetails?.respondTime ?? "—"} days
                </p>
              </div>

              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  type="button"
                  aria-label="Save job"
                  className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <FiBookmark size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 sm:flex-none"
                >
                  Apply Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

