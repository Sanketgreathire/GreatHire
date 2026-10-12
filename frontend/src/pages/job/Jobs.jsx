import React, { useState, useCallback, useMemo } from "react";
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

// Parses "Fresher, From 0 To 2" / "From 1 To 3" into { min, max }
const getExperienceRange = (job) => {
  const exp = (job?.jobDetails?.experience || "").toLowerCase();
  const m = exp.match(/(\d+)\s*(?:to|-)\s*(\d+)/);
  if (m) return { min: Number(m[1]), max: Number(m[2]) };
  if (exp.includes("fresher")) return { min: 0, max: 0 };
  return null;
};

// Open to freshers: experience starts at 0
const isFresherJob = (job) => getExperienceRange(job)?.min === 0;

// Open to experienced candidates: range goes above 0
const isExperiencedJob = (job) => (getExperienceRange(job)?.max ?? 0) >= 1;

const normalize = (s) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const matchesCompany = (job, wanted) => {
  const name = normalize(
    job?.jobDetails?.companyName || job?.company?.companyName
  );
  const target = normalize(wanted);
  if (!name || !target) return false;
  // "HCL" matches "HCL Technologies", "Godrej Interio |" matches "Godrej"
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

  const [showMobileFilter, setShowMobileFilter] =
    useState(false);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);

      filterJobs(
        newFilters.jobTitle ||
          searchInfo.titleKeyword,
        newFilters.location,
        newFilters.jobType,
        newFilters.workPlace
      );
    },
    [filterJobs, searchInfo.titleKeyword]
  );

  // Reset all filters
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

    setSearchInfo({
      titleKeyword: "",
    });

    resetFilter();
  }, [resetFilter]);

  // Update search information
  const handleSearchUpdate = useCallback(
    (update) => {
      setSearchInfo((prev) => ({
        ...prev,
        ...update,
      }));
    },
    []
  );

  // Experience categories are filtered locally because job experience values
  // are free-form text entered by recruiters.
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

          {/* Hero Text */}
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

          {/* Search Bar */}
          <JobSearch
            searchInfo={searchInfo}
            onSearchUpdate={handleSearchUpdate}
          />

          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mt-4 mb-2 sm:hidden px-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading
                ? "Loading..."
                : `${hasLocalFilter ? displayedJobs.length : (searchMeta?.total ?? jobs.length)} jobs found`}
            </p>

            <button
              type="button"
              onClick={() =>
                setShowMobileFilter(true)
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 text-sm font-semibold"
            >
              <FiFilter size={16} />
              Filters
            </button>
          </div>

          <div className="flex gap-4 mt-4 items-start">

            {/* Sidebar Filter — Desktop */}
            <aside className="hidden sm:block w-56 lg:w-64 flex-shrink-0 sticky top-[80px] h-[1080px] overflow-y-auto">
              <FilterCard
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
            </aside>
{/* Mobile Filter Overlay */}
{showMobileFilter && (
  <div className="fixed inset-0 z-[100] sm:hidden">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowMobileFilter(false)}
      aria-hidden="true"
    />

    {/* Mobile Filter Panel */}
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

            {/* Jobs List */}
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
