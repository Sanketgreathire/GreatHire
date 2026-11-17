import React, { useState, useCallback, useMemo, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import JobSearch from "./JobSearch";
import LatestJobs from "./LatestJobs";
import InlineFilterBar from "./InlineFilterBar";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";

// ── Local filter helpers ──────────────────────────────────────────────────────
const DATE_POSTED_DAYS = {
  "Last 24 hours": 1,
  "Last 7 days": 7,
  "Last 15 days": 15,
  "Past Month": 30,
};

const getExperienceRange = (job) => {
  const exp = (job?.jobDetails?.experience || "").toLowerCase();
  const m = exp.match(/(\d+)\s*(?:to|-)\s*(\d+)/);
  if (m) return { min: Number(m[1]), max: Number(m[2]) };
  if (exp.includes("fresher")) return { min: 0, max: 0 };
  return null;
};

const isFresherJob = (job) => getExperienceRange(job)?.min === 0;
const isExperiencedJob = (job) => (getExperienceRange(job)?.max ?? 0) >= 1;

const normalize = (s) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const matchesCompany = (job, wanted) => {
  const name = normalize(
    job?.jobDetails?.companyName || job?.company?.companyName
  );
  const target = normalize(wanted);
  if (!name || !target) return false;
  return (
    name === target ||
    name.startsWith(target + " ") ||
    target.startsWith(name + " ")
  );
};

const isWithinDays = (job, days) => {
  const posted = new Date(job?.createdAt);
  if (isNaN(posted)) return false;
  return Date.now() - posted.getTime() <= days * 24 * 60 * 60 * 1000;
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Jobs() {
  const {
    jobs = [],
    filterJobs,
    resetFilter,
    fetchJobs,
    isLoading,
    searchMeta,
  } = useJobDetails();

  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    jobTitle: "",
    location: [],
    jobType: [],
    workPlace: [],
    company: "",
    datePosted: [],
    fresher: false,
    experienced: false,
  });

  const [searchInfo, setSearchInfo] = useState({ titleKeyword: "" });

  // ── Applied pill state (lifted here so we can filter displayedJobs) ────────
  const [appliedActive, setAppliedActive] = useState(false);

  // ── Refresh jobs on mount / tab focus ─────────────────────────────────────
  useEffect(() => {
    if (fetchJobs) fetchJobs();
    const timer = setTimeout(() => { if (fetchJobs) fetchJobs(); }, 3000);
    const handleFocus = () => { if (fetchJobs) fetchJobs(); };
    window.addEventListener("focus", handleFocus);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchJobs]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      filterJobs(
        newFilters.jobTitle || searchInfo.titleKeyword,
        newFilters.location,
        newFilters.jobType,
        newFilters.workPlace
      );
    },
    [filterJobs, searchInfo.titleKeyword]
  );

  const handleReset = useCallback(() => {
    setFilters({
      jobTitle: "",
      location: [],
      jobType: [],
      workPlace: [],
      company: "",
      datePosted: [],
      fresher: false,
      experienced: false,
    });
    setSearchInfo({ titleKeyword: "" });
    setAppliedActive(false);
    resetFilter();
  }, [resetFilter]);

  const handleSearchUpdate = useCallback((update) => {
    setSearchInfo((prev) => ({ ...prev, ...update }));
  }, []);

  // ── Computed displayed jobs ───────────────────────────────────────────────
  const displayedJobs = useMemo(() => {
    let list = jobs;

    // Company filter
    if (filters.company) {
      list = list.filter((job) => matchesCompany(job, filters.company));
    }

    // Date posted filter
    const days = DATE_POSTED_DAYS[filters.datePosted?.[0]];
    if (days) list = list.filter((job) => isWithinDays(job, days));

    // Experience filter
    if (filters.fresher) list = list.filter(isFresherJob);
    else if (filters.experienced) list = list.filter(isExperiencedJob);

    // Applied pill filter
    const userId = user?._id ? String(user._id) : null;
    if (userId && appliedActive) {
      list = list.filter((job) =>
        job.application?.some((app) => {
          const appId = String(app.applicant?._id || app.applicant);
          return appId === userId;
        })
      );
    }

    return list;
  }, [jobs, filters.company, filters.datePosted, filters.fresher, filters.experienced, appliedActive, user?._id]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto w-full max-w-[1500px] px-2 sm:px-4 py-4">

          {/* Hero title */}
          <div className="text-center pt-6 pb-2 px-4">
            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
              No. 1 Job Hunt Website
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Search Jobs
              <span className="block mt-1">
                &amp; Get Hired{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Smarter, Faster, Risk Free
                </span>
              </span>
            </h1>
          </div>

          {/* Search bar */}
          <JobSearch
            searchInfo={searchInfo}
            onSearchUpdate={handleSearchUpdate}
          />

          {/* Inline filter bar (all filters + Applied pill) */}
          <div className="mt-5" />
          <InlineFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            jobs={jobs}
            appliedActive={appliedActive}
            onAppliedToggle={setAppliedActive}
          />

          {/* Job count info */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3 mb-1">
            {isLoading
              ? "Loading..."
              : `${displayedJobs.length} jobs found`}
          </p>

          {/* Job listings — full width, no sidebar */}
          <div className="mt-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                Loading jobs...
              </div>
            ) : (
              <LatestJobs jobs={displayedJobs} />
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
