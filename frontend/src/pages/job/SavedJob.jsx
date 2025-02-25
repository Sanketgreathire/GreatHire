// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";
import Job from "./Job";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

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
      <Navbar />
      <div className="w-full mx-auto bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100 min-h-screen">
        <div className="px-4 py-4">
          <h1 className="text-2xl text-center underline font-semibold mb-6">
            My Jobs
          </h1>

          {saveJobsList.length > 0 ? (
            <div>
              {/* Job Listings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentJobs.map((job) => (
                  <Job key={job._id} job={job} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md font-medium ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-600 text-white"
                  }`}
                >
                  Previous
                </button>

                <span className="text-lg font-semibold">
                  Page {currentPage} of {Math.ceil(saveJobsList.length / jobsPerPage)}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={indexOfLastJob >= saveJobsList.length}
                  className={`px-4 py-2 rounded-md font-medium ${
                    indexOfLastJob >= saveJobsList.length
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center">No saved jobs found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SavedJobs;

