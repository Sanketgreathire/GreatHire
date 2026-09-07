import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import {
  FiChevronDown, FiChevronUp, FiMapPin, FiBookmark,
  FiShare2, FiBriefcase, FiFileText, FiSun, FiUsers, FiClock, FiBook,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const TABS = ["Overview", "Responsibilities", "Requirements", "Benefits", "Company"];

function AccordionSection({ title, defaultOpen = false, highlighted = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border p-4 transition-colors ${highlighted ? "border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/30" : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"}`}>
      <button onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between text-left">
        <span className={`flex items-center gap-2 font-semibold ${highlighted ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
          {highlighted && <HiSparkles className="shrink-0" size={16} />}
          {title}
        </span>
        {open ? <FiChevronUp className="text-gray-400" size={18} /> : <FiChevronDown className="text-gray-400" size={18} />}
      </button>
      {open && children && <div className="mt-3">{children}</div>}
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
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{value || "—"}</p>
      </div>
    </div>
  );
}

const getInitial = (job) => {
  const name = job?.jobDetails?.companyName || job?.company?.name || "G";
  return name.charAt(0).toUpperCase();
};

const getActiveDays = (createdAt) => {
  if (!createdAt) return 0;
  const days = Math.floor((Date.now() - new Date(createdAt)) / 86400000);
  return Number.isFinite(days) ? Math.max(days, 0) : 0;
};

export default function JobDescription() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    if (!jobId) return;
    setIsLoading(true);
    axios
      .get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
      .then((res) => {
        setJob(res.data?.job || res.data || null);
      })
      .catch(() => setError("Job not found or no longer available."))
      .finally(() => setIsLoading(false));
  }, [jobId]);

  const activeDays = useMemo(() => getActiveDays(job?.createdAt), [job?.createdAt]);

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
          <button onClick={() => navigate("/jobs")} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
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
                    {job.jobDetails?.title}
                  </h1>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base">
                    <span className="font-medium text-blue-600 dark:text-blue-400">{job.jobDetails?.companyName}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FiMapPin size={14} />{job.jobDetails?.location}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <FiBriefcase size={14} />{job.jobDetails?.workPlaceFlexibility}
                    </span>
                  </p>
                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    ₹{job.jobDetails?.salary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.jobDetails?.urgentHiring === "Yes" && (
                      <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
                        ⚡ Urgent Hiring
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                      <FiClock size={12} />Responds in {job.jobDetails?.respondTime ?? "—"} days
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 flex-row items-start gap-2 sm:flex-col sm:items-end">
                {job.matchScore != null && (
                  <div className="rounded-xl bg-blue-50 px-4 py-2 text-right dark:bg-blue-950/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">AI Match Score</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{job.matchScore}%</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button" aria-label="Save job" className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                    <FiBookmark size={18} />
                  </button>
                  <button type="button" aria-label="Share job" className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                    <FiShare2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Overview */}
            <div className="p-5 sm:p-8">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Quick Overview</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <OverviewStat icon={FiBriefcase} label="Experience" value={job.jobDetails?.experience} />
                <OverviewStat icon={FiFileText} label="Type" value={job.jobDetails?.jobType} />
                <OverviewStat icon={FiSun} label="Shift" value={job.jobDetails?.shift} />
                <OverviewStat icon={FiUsers} label="Openings" value={job.jobDetails?.numberOfOpening} />
                <OverviewStat icon={FiClock} label="Posted" value={`${activeDays}d ago`} />
                <OverviewStat icon={FiBook} label="Duration" value={job.jobDetails?.duration} />
              </div>

              {/* Tabs */}
              <div className="mt-6 flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                {TABS.map((tab) => (
                  <button
                    type="button" key={tab} onClick={() => setActiveTab(tab)}
                    className={`shrink-0 pb-3 text-sm font-medium transition-colors ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {activeTab === "Overview" && (
                  <>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
                      <p className="mb-3 flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                        <HiSparkles size={16} />AI Job Snapshot
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2 text-sm">
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="text-gray-500 dark:text-gray-400">Skills: </span>
                          {(job.jobDetails?.skills || []).join(", ") || "—"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="text-gray-500 dark:text-gray-400">Salary Type: </span>
                          {job.jobDetails?.salaryType || "—"}
                        </p>
                      </div>
                    </div>
                    <AccordionSection title="About this Role" defaultOpen>
                      <div className="leading-relaxed text-gray-600 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: job.jobDetails?.details || "<p>No description provided.</p>" }}
                      />
                    </AccordionSection>
                    {(job.jobDetails?.responsibilities || []).length > 0 && (
                      <AccordionSection title="Responsibilities">
                        <ul className="space-y-2">
                          {job.jobDetails.responsibilities.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />{item}
                            </li>
                          ))}
                        </ul>
                      </AccordionSection>
                    )}
                  </>
                )}
                {activeTab === "Responsibilities" && (
                  <ul className="space-y-2">
                    {(job.jobDetails?.responsibilities || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />{item}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "Requirements" && (
                  <ul className="space-y-2">
                    {(job.jobDetails?.qualifications || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />{item}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "Benefits" && (
                  <ul className="space-y-2">
                    {(job.jobDetails?.benefits || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />{item}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "Company" && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {job.jobDetails?.companyName} — {job.jobDetails?.location}
                  </p>
                )}
              </div>
            </div>

            {/* Apply Footer */}
            <div className="sticky bottom-0 flex flex-col items-start justify-between gap-3 rounded-b-2xl border-t border-gray-100 bg-white/95 p-5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 sm:flex-row sm:items-center sm:p-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Ready to apply?</p>
                <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  ⚡ Typically responds within {job.jobDetails?.respondTime ?? "—"} days
                </p>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <button type="button" aria-label="Save job" className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                  <FiBookmark size={18} />
                </button>
                <a href={`/apply/${job._id}`} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 sm:flex-none">
                  Apply Now →
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
