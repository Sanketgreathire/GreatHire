import React, { useState, useCallback, useMemo } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FilterCard from "./FilterCard";
import JobSearch from "./JobSearch";
import LatestJobs from "./LatestJobs";
import { useJobDetails } from "@/context/JobDetailsContext";
import { FiFilter } from "react-icons/fi";

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
        newFilters.workPlace,
        newFilters.fresher ? "Fresher" : undefined
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

  // Memoized displayed jobs (applies client-side fresher filtering as well)
  const displayedJobs = useMemo(() => {
    if (!filters.fresher) return jobs;
    return jobs.filter((job) => {
      const exp = (job?.jobDetails?.experience || "").toLowerCase();
      return (
        exp.includes("fresher") ||
        exp.includes("0 to 0") ||
        exp.includes("from 0") ||
        exp.includes("0-0") ||
        exp.includes("0 year") ||
        exp.includes("0 - 1")
      );
    });
  }, [jobs, filters.fresher]);

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
                : `${filters.fresher ? displayedJobs.length : (searchMeta?.total ?? jobs.length)} jobs found`}
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

