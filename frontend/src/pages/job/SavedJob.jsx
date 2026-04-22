import React, { useEffect, useState, useMemo, useCallback } from "react";
import Job from "./Job";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Helmet } from "react-helmet-async";

const JOBS_PER_PAGE = 9;

const SavedJobs = () => {
  const { getSaveJobs, saveJobsList, error, jobs } = useJobDetails();
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user?._id && jobs) getSaveJobs(user._id);
  }, [user?._id, jobs]);

  const { currentJobs, totalPages, indexOfLastJob } = useMemo(() => {
    const last = currentPage * JOBS_PER_PAGE;
    const first = last - JOBS_PER_PAGE;
    return {
      currentJobs: saveJobsList.slice(first, last),
      totalPages: Math.ceil(saveJobsList.length / JOBS_PER_PAGE),
      indexOfLastJob: last,
    };
  }, [saveJobsList, currentPage]);

  const handlePrev = useCallback(() => setCurrentPage((p) => p - 1), []);
  const handleNext = useCallback(() => setCurrentPage((p) => p + 1), []);

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <Helmet>
        <title>Jobs You've Saved | Monitor & Apply to Jobs You've Bookmarked - GreatHire</title>
        <meta
          name="description"
          content="Now, all your bookmarked jobs are available on one page. The Saved Jobs page on GreatHire makes it convenient to go back to the jobs that are marked as favorites and apply for them later. This page is useful in helping a job seeker organize his/her future and not miss an opportunity. Started in the region of Hyderabad, India, GreatHire is a reputable hiring platform developed to help professionals connect with authentic employers."
        />
      </Helmet>

      <Navbar />
      <div
  className="w-full mx-auto min-h-screen
             pt-12 sm:pt-0
             bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100
             dark:bg-gradient-to-br dark:from-gray-950 dark:via-slate-900 dark:to-blue-950"
>


        <div className="px-4 py-8 sm:py-20">
          {/* Header Section */}
          <div
            className="mb-4 p-4 rounded-2xl
             bg-white/60 backdrop-blur-sm
             dark:bg-gray-800/40
             shadow-lg border border-blue-200/50
             dark:border-blue-800/30"
          >
            <h1
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl
               p-2 flex flex-wrap items-center gap-4
               leading-tight font-extrabold
               bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700
               dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500
               text-transparent bg-clip-text"
            >
              Your Saved Jobs

              <span
                className="bg-gradient-to-r from-blue-600 to-indigo-600
                 dark:from-blue-500 dark:to-indigo-500
                 text-white text-sm sm:text-base md:text-lg
                 font-bold px-4 py-2 rounded-full
                 shadow-lg hover:shadow-xl
                 transition-shadow duration-300"
              >
                {saveJobsList.length}
              </span>
            </h1>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 pl-2">
              Keep track of opportunities that interest you
            </p>
          </div>

          {saveJobsList.length > 0 ? (
            <div>
              {/* Job Listings with improved container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentJobs.map((job) => (
                  <Job key={job._id} job={job} />
                ))}
              </div>

              {/* Pagination Controls with enhanced design */}
              <div className="flex justify-between items-center mt-8  md:mt-8 p-3 md:p-6 rounded-xl
                            bg-white/70 backdrop-blur-sm
                            dark:bg-gray-800/50 dark:backdrop-blur-sm
                            shadow-md border border-blue-100/50
                            dark:border-blue-900/30 gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg dark:from-blue-500 dark:to-indigo-500"
                    }`}
                >
                  Previous
                </button>

                <span className="text-sm md:text-lg font-bold text-center whitespace-nowrap
                               text-gray-700 dark:text-gray-200
                               bg-gradient-to-r from-blue-600 to-indigo-600
                               dark:from-blue-400 dark:to-indigo-400
                               text-transparent bg-clip-text">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={indexOfLastJob >= saveJobsList.length}
                  className={`px-3 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${indexOfLastJob >= saveJobsList.length
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="inline-block p-8 rounded-2xl
                            bg-white/70 backdrop-blur-sm
                            dark:bg-gray-800/50 dark:backdrop-blur-sm
                            shadow-lg border border-blue-200/50
                            dark:border-blue-800/30">
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No saved jobs yet
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Start exploring and save jobs that interest you
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SavedJobs;