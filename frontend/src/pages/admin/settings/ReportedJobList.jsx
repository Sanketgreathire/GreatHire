// Import necessary modules and dependencies
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/admin/Navbar";
import {
  ADMIN_STAT_API_END_POINT,
  NOTIFICATION_API_END_POINT,
} from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Eye, Trash } from "lucide-react";
import { toast } from "react-hot-toast";

const ReportedJobList = () => {
  // State to manage the search input value for filtering jobs
  const [search, setSearch] = useState("");

  // State to store the list of reported jobs
  const [reportedJobs, setReportedJobs] = useState([]);

  // State to manage loading status during data fetching
  const [loading, setLoading] = useState(true);

  // State to store error messages in case of failures
  const [error, setError] = useState(null);

  // State to manage the current page for pagination
  const [currentPage, setCurrentPage] = useState(0);

  // Hook for navigation within the application
  const navigate = useNavigate();

  // Number of reported jobs displayed per page
  const itemsPerPage = 6;

  // Fetches the list of reported jobs when the component mounts
  useEffect(() => {
    const fetchReportedJobs = async () => {
      try {
        const response = await axios.get(
          `${ADMIN_STAT_API_END_POINT}/reported-job-list`,
          { withCredentials: true }
        );

        // Updates the reported jobs state if the request is successful
        if (response?.data?.success) {
          setReportedJobs(response.data.data);
        }
      } catch (err) {
        // Sets an error message if fetching fails
        setError("Error fetching reported jobs.");
      } finally {
        // Stops the loading state after fetching is complete
        setLoading(false);
      }
    };
    fetchReportedJobs();
  }, []);

  // Handles the deletion of a reported job by making an API call
  const handleDeleteJob = async (msgId) => {
    if (!msgId) return;

    try {
      const response = await axios.delete(
        `${NOTIFICATION_API_END_POINT}/jobReports/${msgId}`,
        { withCredentials: true }
      );

      // If deletion is successful, update the state and show a success message
      if (response?.data?.success) {
        setReportedJobs((prevJobs) =>
          prevJobs.filter((job) => job.id !== msgId)
        );
        toast("Reported job deleted successfully!");
      } else {
        toast("Failed to delete reported job.");
      }
    } catch (error) {
      // Logs and displays an error message if deletion fails
      console.error("Error deleting reported job:", error);
      toast("Error deleting reported job. Please try again.");
    }
  };

  // Filters jobs based on the search term entered by the user
  const filteredJobs = reportedJobs?.filter(
    (job) =>
      job.job &&
      ((job.job.title &&
        job.job.title.toLowerCase().includes(search.toLowerCase())) ||
        (job.job.companyName &&
          job.job.companyName.toLowerCase().includes(search.toLowerCase())) ||
        (job.user?.fullname &&
          job.user.fullname.toLowerCase().includes(search.toLowerCase())))
  );

  // Calculates the total number of pages based on filtered jobs
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // Determines the jobs to be displayed on the current page
  const currentItems = filteredJobs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <Navbar linkName="Reported Job List" />
      <div className="min-h-screen bg-gray-100 p-6 max-w-7xl mx-auto rounded-lg shadow-lg relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-800 text-xl transition-colors duration-200 mt-2"
        >
          <FiArrowLeft size={28} className="mr-2" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 mt-10">
          Reported Job List
        </h2>

        <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 space-y-4 md:space-y-0">
          <Input
            placeholder="Search by Job, Company, or User"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full md:w-1/3 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-gray-700 font-semibold">
            Total Reported Jobs: {filteredJobs.length}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-semibold">
            No reported job found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition transform hover:-translate-y-1 hover:shadow-xl relative"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {job.job?.title || "N/A"}
                    </h3>
                    <Eye
                      size={25}
                      onClick={() =>
                        navigate(`/admin/job/details/${job.job.jobId}`)
                      }
                      className="cursor-pointer text-blue-700"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {job.job?.companyName || "N/A"}
                  </p>
                  <div className="mb-4">
                    <p className="font-bold text-gray-700">Report:</p>
                    <p className="text-indigo-600">{job.reportTitle}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-bold text-gray-700">Description:</p>
                    <p className="text-gray-600 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                      {job.description}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">Reported By:</p>
                    <p className="text-gray-600">
                      {job.user?.fullname || "N/A"} <br />
                      {job.user?.email || "N/A"} <br />
                      {job.user?.phone || "N/A"}
                    </p>
                  </div>
                  <Trash
                    className="text-red-500 cursor-pointer absolute bottom-4 right-4"
                    size={25}
                    onClick={() => handleDeleteJob(job.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReportedJobList;
