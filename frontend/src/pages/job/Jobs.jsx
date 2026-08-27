import React, { useState, useCallback } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  FiFilter,
  FiX,
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
import { useJobDetails } from "@/context/JobDetailsContext";

const TABS = ["Overview", "Responsibilities", "Requirements", "Benefits", "Company"];

function AccordionSection({ title, defaultOpen = false, highlighted = false, children }) {
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
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span
          className={`flex items-center gap-2 font-semibold ${
            highlighted
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {highlighted && <HiSparkles className="shrink-0" size={16} />}
          {title}
        </span>
        {open ? (
          <FiChevronUp className="text-gray-400" size={18} />
        ) : (
          <FiChevronDown className="text-gray-400" size={18} />
        )}
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

export default function JobDetailsPage() {
  const { jobs, selectedJob, setSelectedJob, filterJobs, resetFilter, searchMeta, isLoading, fetchJobs } = useJobDetails();

  const [activeTab, setActiveTab] = useState("Overview");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter state
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [workPlaceFilter, setWorkPlaceFilter] = useState("");
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const applyFilters = useCallback((title, location, experience, workPlace) => {
    const count = [title, location, experience, workPlace].filter(Boolean).length;
    setActiveFilterCount(count);
    filterJobs(title, location, undefined, workPlace, experience);
  }, [filterJobs]);

  const handleReset = useCallback(() => {
    setTitleFilter("");
    setLocationFilter("");
    setExperienceFilter("");
    setWorkPlaceFilter("");
    setActiveFilterCount(0);
    resetFilter();
  }, [resetFilter]);

  const job = selectedJob;

  // Helper: get company initial from job
  const getInitial = (j) => {
    const name = j?.jobDetails?.companyName || j?.company?.name || "?";
    return name.charAt(0).toUpperCase();
  };

  const activeDays = (createdAt) =>
    createdAt ? Math.floor((Date.now() - new Date(createdAt)) / 86400000) : 0;

  const FilterSidebarContent = (
    <div className="flex h-full flex-col gap-4">
      {/* Results count */}
      <div className="mt-1 px-1">
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          {isLoading
            ? "Loading..."
            : `Showing ${jobs.length}${searchMeta?.total > jobs.length ? ` of ${searchMeta.total}` : ""} jobs${searchMeta?.query ? ` for "${searchMeta.query}"` : ""}`}
        </p>

        {/* Job list */}
        <div className="flex flex-col gap-3">
          {jobs.map((j) => {
            const isSelected = selectedJob?._id === j._id;
            return (
              <button
                key={j._id}
                onClick={() => {
                  setSelectedJob(j);
                  setActiveTab("Overview");
                  setIsFilterOpen(false);
                }}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/40 dark:ring-blue-500"
                    : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {getInitial(j)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
                    {j.jobDetails?.title}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {j.jobDetails?.companyName} • {j.jobDetails?.location?.split(",")[0]}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {j.jobDetails?.workPlaceFlexibility}
                    </span>
                    {j.matchScore && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        {j.matchScore}% Match
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {!isLoading && jobs.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">No jobs found.</p>
          )}
        </div>
      </div>

      {/* Filters header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={handleReset}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Reset All
        </button>
      </div>

      {/* Job Title filter */}
      <AccordionSection title="Job Title" defaultOpen>
        <input
          type="text"
          placeholder="Search titles..."
          value={titleFilter}
          onChange={(e) => {
            setTitleFilter(e.target.value);
            applyFilters(e.target.value, locationFilter, experienceFilter, workPlaceFilter);
          }}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
        />
      </AccordionSection>

      {/* Location filter */}
      <AccordionSection title="Location" defaultOpen>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="City or zip code"
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              applyFilters(titleFilter, e.target.value, experienceFilter, workPlaceFilter);
            }}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-9 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
          <FiMapPin
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"
          />
        </div>
        {/* Quick location chips */}
        <div className="flex flex-wrap gap-2">
          {["Bengaluru", "Remote", "Hyderabad", "Mumbai"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setLocationFilter(tag);
                applyFilters(titleFilter, tag, experienceFilter, workPlaceFilter);
              }}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                locationFilter === tag
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* GreatHire AI */}
      <AccordionSection title="GreatHire AI" highlighted defaultOpen={false}>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          AI match scores are calculated based on your search query against job title, skills, and details.
        </p>
      </AccordionSection>

      {/* Experience filter */}
      <AccordionSection title="Experience" defaultOpen={false}>
        <div className="flex flex-col gap-2">
          {["Fresher", "1-3", "3-5", "5-8", "8+"].map((exp) => (
            <label key={exp} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="experience"
                checked={experienceFilter === exp}
                onChange={() => {
                  setExperienceFilter(exp);
                  applyFilters(titleFilter, locationFilter, exp, workPlaceFilter);
                }}
                className="accent-blue-600"
              />
              {exp} {exp !== "Fresher" ? "years" : ""}
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* Work Place filter */}
      <AccordionSection title="Work Place" defaultOpen={false}>
        <div className="flex flex-col gap-2">
          {["Remote", "Hybrid", "On-site"].map((wp) => (
            <label key={wp} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="workPlace"
                checked={workPlaceFilter === wp}
                onChange={() => {
                  setWorkPlaceFilter(wp);
                  applyFilters(titleFilter, locationFilter, experienceFilter, wp);
                }}
                className="accent-blue-600"
              />
              {wp}
            </label>
          ))}
        </div>
      </AccordionSection>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto flex w-full max-w-[1500px] gap-4 px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile filter trigger */}
          <div className="fixed bottom-4 right-4 z-30 lg:hidden">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
            >
              <FiFilter size={18} /> Filters
            </button>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden w-[320px] shrink-0 overflow-y-auto max-h-[calc(100vh-80px)] lg:block">
            {FilterSidebarContent}
          </aside>

          {/* Mobile sidebar overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
              <div className="relative h-full w-[85vw] max-w-sm overflow-y-auto bg-white p-4 shadow-2xl dark:bg-gray-900">
                <div className="mb-2 flex justify-end">
                  <button onClick={() => setIsFilterOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <FiX size={20} />
                  </button>
                </div>
                {FilterSidebarContent}
              </div>
            </div>
          )}

          {/* Detail panel */}
          <main className="min-w-0 flex-1">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center text-gray-500 dark:text-gray-400">
                Loading jobs...
              </div>
            ) : job ? (
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-2xl font-bold text-gray-400 shadow-sm dark:border-gray-700">
                      {getInitial(job)}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                        {job.jobDetails?.title}
                      </h1>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base">
                        <span className="font-medium text-blue-600 dark:text-blue-400">{job.jobDetails?.companyName}</span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <FiMapPin size={14} /> {job.jobDetails?.location}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <FiBriefcase size={14} /> {job.jobDetails?.workPlaceFlexibility}
                        </span>
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ₹{job.jobDetails?.salary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {job.jobDetails?.urgentHiring === "Yes" && (
                          <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
                            ⚡ Urgent Hiring
                          </span>
                        )}
                        <span className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                          <FiClock size={12} /> Responds in {job.jobDetails?.respondTime} days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-row items-start gap-2 sm:flex-col sm:items-end">
                    {job.matchScore && (
                      <div className="rounded-xl bg-blue-50 px-4 py-2 text-right dark:bg-blue-950/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">AI Match Score</p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{job.matchScore}%</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button aria-label="Save job" className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                        <FiBookmark size={18} />
                      </button>
                      <button aria-label="Share job" className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                        <FiShare2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick overview */}
                <div className="p-5 sm:p-8">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Quick Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <OverviewStat icon={FiBriefcase} label="Experience" value={job.jobDetails?.experience} />
                    <OverviewStat icon={FiFileText} label="Type" value={job.jobDetails?.jobType} />
                    <OverviewStat icon={FiSun} label="Shift" value={job.jobDetails?.shift} />
                    <OverviewStat icon={FiUsers} label="Openings" value={job.jobDetails?.numberOfOpening} />
                    <OverviewStat icon={FiClock} label="Posted" value={`${activeDays(job.createdAt)}d ago`} />
                    <OverviewStat icon={FiBook} label="Duration" value={job.jobDetails?.duration} />
                  </div>

                  {/* Tabs */}
                  <div className="mt-6 flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                    {TABS.map((tab) => (
                      <button
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

                  {/* Tab content */}
                  <div className="mt-6">
                    {activeTab === "Overview" && (
                      <>
                        {/* AI Job Snapshot */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
                          <p className="mb-3 flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                            <HiSparkles size={16} /> AI Job Snapshot
                          </p>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 text-sm">
                              <p className="text-gray-600 dark:text-gray-300">
                                <span className="text-gray-500 dark:text-gray-400">Skills: </span>
                                {(job.jobDetails?.skills || []).join(", ") || "—"}
                              </p>
                              <p className="text-gray-600 dark:text-gray-300">
                                <span className="text-gray-500 dark:text-gray-400">Salary Type: </span>
                                {job.jobDetails?.salaryType || "—"}
                              </p>
                            </div>
                            <div className="space-y-2 text-sm">
                              {job.matchScore && (
                                <p className="text-gray-600 dark:text-gray-300">
                                  <span className="text-gray-500 dark:text-gray-400">Match Score: </span>
                                  <span className="text-green-600 dark:text-green-400">{job.matchScore}%</span>
                                </p>
                              )}
                              <p className="text-gray-600 dark:text-gray-300">
                                <span className="text-gray-500 dark:text-gray-400">Any Amount: </span>
                                {job.jobDetails?.anyAmount || "—"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <h3 className="mb-2 mt-6 text-lg font-bold text-gray-900 dark:text-gray-100">About this Role</h3>
                        <div
                          className="leading-relaxed text-gray-600 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: job.jobDetails?.details || "" }}
                        />

                        {(job.jobDetails?.responsibilities || []).length > 0 && (
                          <>
                            <h3 className="mb-3 mt-6 text-lg font-bold text-gray-900 dark:text-gray-100">Responsibilities</h3>
                            <ul className="space-y-2">
                              {job.jobDetails.responsibilities.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </>
                    )}

                    {activeTab === "Responsibilities" && (
                      <ul className="space-y-2">
                        {(job.jobDetails?.responsibilities || []).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeTab === "Requirements" && (
                      <ul className="space-y-2">
                        {(job.jobDetails?.qualifications || []).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeTab === "Benefits" && (
                      <ul className="space-y-2">
                        {(job.jobDetails?.benefits || []).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            {item}
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

                {/* Sticky apply footer */}
                <div className="sticky bottom-0 flex flex-col items-start justify-between gap-3 rounded-b-2xl border-t border-gray-100 bg-white/95 p-5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 sm:flex-row sm:items-center sm:p-6">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Ready to apply?</p>
                    <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      ⚡ Typically responds within {job.jobDetails?.respondTime} days
                    </p>
                  </div>
                  <div className="flex w-full gap-2 sm:w-auto">
                    <button aria-label="Save job" className="rounded-lg border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                      <FiBookmark size={18} />
                    </button>
                    <a
                      href={`/jobs/${job._id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 sm:flex-none"
                    >
                      Apply Now →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center text-gray-500 dark:text-gray-400">
                Select a job to see details
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
