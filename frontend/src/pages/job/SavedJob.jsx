import React, { useEffect, useState } from "react";
import Job from "./Job";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const SavedJobs = () => {
  const { getSaveJobs, saveJobsList, error, jobs } = useJobDetails();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    if (user && jobs) {
      getSaveJobs(user?._id)
    }
  }, [user, jobs]);

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="w-full mx-auto bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100 min-h-screen">
        <div className="px-4 py-4">
          <h1 className="text-2xl text-center underline font-semibold mb-6">
            Saved Jobs
          </h1>

          {saveJobsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {saveJobsList.map((job) => (
                <Job key={job._id} job={job} />
              ))}
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
