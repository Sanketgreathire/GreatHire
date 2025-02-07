import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Job from "./Job";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const SavedJobs = () => {
  const { getSaveJobs, saveJobsList, error } = useJobDetails();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSavedJobs(); // Fetch saved jobs on initial load
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true); // Set loading state
      await getSaveJobs(user._id); // Fetch saved jobs
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="w-full mx-auto bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100 min-h-screen">
        <div className="px-4 py-4">
          <h1 className="text-2xl text-center font-semibold mb-6">My Saved Jobs</h1>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : saveJobsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {saveJobsList.map((job) => (
                <Job key={job._id} job={job} refreshSavedJobs={fetchSavedJobs} />
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

