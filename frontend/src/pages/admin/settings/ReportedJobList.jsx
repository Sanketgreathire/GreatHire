import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/admin/Navbar";
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Eye } from "lucide-react";

const ReportedJobList = () => {
  const [search, setSearch] = useState("");
  const [reportedJobs, setReportedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 6; // Increased items per page for a balanced grid layout

  useEffect(() => {
    const fetchReportedJobs = async () => {
      try {
        const response = await axios.get(
          `${ADMIN_STAT_API_END_POINT}/reported-job-list`,
          { withCredentials: true }
        );
        if (response?.data?.success) {
          setReportedJobs(response.data.data);
        }
        console.log(response.data.data);
      } catch (err) {
        setError("Error fetching reported jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchReportedJobs();
  }, []);

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

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentItems = filteredJobs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <Navbar linkName="Reported Job List" />
      <div className="min-h-screen bg-gray-100 p-6 max-w-7xl mx-auto rounded-lg shadow-lg relative">
 
          {/* Back Button */}
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
                setCurrentPage(0); // Reset page on new search
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
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition transform hover:-translate-y-1 hover:shadow-xl"
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
                        className=" cursor-pointer text-blue-700 "
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
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              {filteredJobs.length > itemsPerPage && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </button>
                  <span className="font-semibold text-gray-700">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        
      </div>
    </>
  );
};

export default ReportedJobList;
