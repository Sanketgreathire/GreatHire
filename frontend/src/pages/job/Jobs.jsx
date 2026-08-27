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

  // Pre-select job when navigating from marquee
  useEffect(() => {
    const jobId = location.state?.selectedJobId;
    if (jobId && jobs?.length > 0) {
      const job = jobs.find((j) => j._id === jobId);
      if (job) setSelectedJob(job);
    }
  }, [location.state?.selectedJobId, jobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSearchUpdate = useCallback((updates) => {
    setSearchInfo((prev) => ({ ...prev, ...updates }));
    setFilters((prev) => ({
      ...prev,
      jobTitle: updates.titleKeyword !== undefined ? updates.titleKeyword : prev.jobTitle,
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setSearchInfo((prev) => ({
      ...prev,
      titleKeyword: newFilters.jobTitle ?? prev.titleKeyword,
    }));
  }, []);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      if (Array.isArray(filters.location) && filters.location.length > 0) {
        const jobLocation = (job?.jobDetails?.location || job?.location || "").toLowerCase();
        const matchesAny = filters.location.some((loc) =>
          jobLocation.includes(loc.toLowerCase())
        );
        if (!matchesAny) return false;
      }
      if (filters.jobTitle) {
        const jobTitle = (job?.jobDetails?.title || job?.job_title || "").toLowerCase();
        const companyName = (job?.jobDetails?.companyName || "").toLowerCase();
        const keyword = filters.jobTitle.toLowerCase();
        if (!jobTitle.includes(keyword) && !companyName.includes(keyword)) return false;
      }
      if (Array.isArray(filters.jobType) && filters.jobType.length > 0) {
        const jobType = (job?.jobDetails?.jobType || "").toLowerCase();
        if (!filters.jobType.some((type) => jobType.includes(type.toLowerCase()))) return false;
      }
      if (Array.isArray(filters.workPlace) && filters.workPlace.length > 0) {
        const workPlace = (job?.jobDetails?.workPlaceFlexibility || "").toLowerCase();
        if (!filters.workPlace.some((wp) => workPlace.includes(wp.toLowerCase()))) return false;
      }
      if (filters.company) {
        const company = (job?.jobDetails?.companyName || job?.jobDetails?.company || job?.employer_name || job?.company || "").toLowerCase();
        if (!company.includes(filters.company.toLowerCase())) return false;
      }
      if (Array.isArray(filters.datePosted) && filters.datePosted.length > 0) {
        const dateStr = job?.jobDetails?.datePosted || job?.createdAt || job?.jobDetails?.createdAt || job?.postedAt || job?.job_posted_at || null;
        const jobDate = dateStr ? new Date(dateStr) : null;
        if (!jobDate || isNaN(jobDate)) return false;
        const today = new Date();
        const dayMap = { "Last 24 hours": 1, "Last 7 days": 7, "Last 15 days": 15, "Past Month": 30 };
        if (!filters.datePosted.some((d) => (today - jobDate) / 86400000 <= (dayMap[d] || 0))) return false;
      }
      return true;
    });
  }, [jobs, filters]);

  const totalFilteredJobs = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredJobs / jobsPerPage));
  const displayedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handleResetFilters = useCallback(() => {
    setFilters({ jobTitle: "", location: [], jobType: [], workPlace: [], company: "", datePosted: [] });
    setSearchInfo({ titleKeyword: "", location: "" });
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    if (jobListingsRef.current) {
      const y = jobListingsRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);


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
