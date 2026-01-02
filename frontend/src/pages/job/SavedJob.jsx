// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";
import Job from "./Job";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const SavedJobs = () => {
  const { getSaveJobs, saveJobsList, error, jobs } = useJobDetails();
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  useEffect(() => {
    if (user && jobs) {
      getSaveJobs(user?._id);
    }
  }, [user, jobs]);

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = saveJobsList.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <>
      <Helmet>
        <title>Saved Jobs | Track & Apply to Your Bookmarked Jobs – GreatHire</title>
        <meta
          name="description"
          content="Manage all your bookmarked opportunities in one place with GreatHire's Saved Jobs page. Easily revisit jobs you've saved, compare roles, review salaries, check application status, and apply when you're ready. This page helps job seekers stay organized and never miss important opportunities while planning their next career move. Based in Hyderabad State, India, GreatHire is a trusted hiring platform designed to connect professionals with verified employers across multiple industries and locations."
        />
      </Helmet>

      <Navbar />
      <div className="w-full mx-auto min-h-screen
                      bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100
                      dark:bg-gradient-to-br dark:from-gray-950 dark:via-slate-900 dark:to-blue-950">

        <div className="px-4 py-20">
          {/* Header Section with enhanced styling */}
          <div className="mb-8 p-6 rounded-2xl 
                         bg-white/60 backdrop-blur-sm
                         dark:bg-gray-800/40 dark:backdrop-blur-sm
                         shadow-lg border border-blue-200/50
                         dark:border-blue-800/30">
            <h1 className="text-3xl md:text-4xl p-2 flex flex-wrap items-center gap-4 
                          font-extrabold
                          bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700
                          dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500
                          text-transparent bg-clip-text">
              Your Saved Jobs
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600
                             dark:from-blue-500 dark:to-indigo-500
                             text-white text-lg font-bold px-5 py-2 
                             rounded-full shadow-lg
                             hover:shadow-xl transition-shadow duration-300">
                {saveJobsList.length}
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 ml-2">
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
              <div className="flex justify-between items-center mt-8 p-6 rounded-xl
                            bg-white/70 backdrop-blur-sm
                            dark:bg-gray-800/50 dark:backdrop-blur-sm
                            shadow-md border border-blue-100/50
                            dark:border-blue-900/30">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                  }`}
                >
                  Previous
                </button>

                <span className="text-lg font-bold 
                               text-gray-700 dark:text-gray-200
                               bg-gradient-to-r from-blue-600 to-indigo-600
                               dark:from-blue-400 dark:to-indigo-400
                               text-transparent bg-clip-text">
                  Page {currentPage} of {Math.ceil(saveJobsList.length / jobsPerPage)}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={indexOfLastJob >= saveJobsList.length}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    indexOfLastJob >= saveJobsList.length
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