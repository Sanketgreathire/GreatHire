import React, { useState, useCallback, useMemo, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FilterCard from "./FilterCard";
import JobSearch from "./JobSearch";
import LatestJobs from "./LatestJobs";
import { useJobDetails } from "@/context/JobDetailsContext";
import { FiFilter } from "react-icons/fi";

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

export default function Jobs() {
  const {
    jobs = [],
    filterJobs,
    resetFilter,
    fetchJobs, // 👈 Added this to refresh
    isLoading,
    searchMeta,
  } = useJobDetails();

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

  const [searchInfo, setSearchInfo] = useState({
    titleKeyword: "",
  });

  const [showMobileFilter, setShowMobileFilter] = useState(false);

    useEffect(() => {
    // 1. Refresh immediately
    if (fetchJobs) fetchJobs();

    // 2. Refresh after 3 seconds (waits for auto-apply to finish in backend)
    const timer = setTimeout(() => {
      if (fetchJobs) fetchJobs();
    }, 3000);

    // 3. Refresh when user switches back to this tab
    const handleFocus = () => {
      if (fetchJobs) fetchJobs();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchJobs]);

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
    resetFilter();
  }, [resetFilter]);

  const handleSearchUpdate = useCallback((update) => {
    setSearchInfo((prev) => ({ ...prev, ...update }));
  }, []);

  const hasLocalFilter = Boolean(
    filters.company ||
      filters.datePosted?.length ||
      filters.fresher ||
      filters.experienced
  );

  const displayedJobs = useMemo(() => {
    let list = jobs;

    if (filters.company) {
      list = list.filter((job) => matchesCompany(job, filters.company));
    }

    const days = DATE_POSTED_DAYS[filters.datePosted?.[0]];
    if (days) list = list.filter((job) => isWithinDays(job, days));

    if (filters.fresher) list = list.filter(isFresherJob);
    else if (filters.experienced) list = list.filter(isExperiencedJob);

    return list;
  }, [jobs, filters.company, filters.datePosted, filters.fresher, filters.experienced]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="mx-auto w-full max-w-[1500px] px-2 sm:px-4 py-4">
          
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

          <JobSearch
            searchInfo={searchInfo}
            onSearchUpdate={handleSearchUpdate}
          />

          <div className="flex items-center justify-between mt-4 mb-2 sm:hidden px-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading
                ? "Loading..."
                : `${hasLocalFilter ? displayedJobs.length : (searchMeta?.total ?? jobs.length)} jobs found`}
            </p>
            <button
              type="button"
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 text-sm font-semibold"
            >
              <FiFilter size={16} />
              Filters
            </button>
          </div>

          <div className="flex gap-4 mt-4 items-start">
            <aside className="hidden sm:block w-56 lg:w-64 flex-shrink-0 sticky top-[80px] h-[1080px] overflow-y-auto">
              <FilterCard
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
            </aside>

            {showMobileFilter && (
              <div className="fixed inset-0 z-[100] sm:hidden">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowMobileFilter(false)}
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 top-16 bottom-0 z-[101] overflow-hidden">
                  <FilterCard
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                    onClose={() => setShowMobileFilter(false)}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  Loading jobs...
                </div>
              ) : (
                <LatestJobs jobs={displayedJobs} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}