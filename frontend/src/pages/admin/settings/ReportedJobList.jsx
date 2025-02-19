import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/admin/Navbar";
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const ReportedJobList = () => {
  const [search, setSearch] = useState("");
  const [reportedJobs, setReportedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 1;

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
      <div className="relative p-6 bg-white shadow-lg rounded-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 text-lg z-50"
        >
          <FiArrowLeft size={30} className="mr-2" />
        </button>

        <h2 className="text-xl text-center underline font-semibold mb-4">
          Reported Job List
        </h2>

        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by Job, Company, or User"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <div className="text-gray-700 font-semibold">
            Total Reported Jobs: {filteredJobs.length}
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-semibold">
            No reported job found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold">
                    {job.job?.title || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {job.job?.companyName || "N/A"}
                  </p>
                  <p className="font-bold mt-2">Report:</p>
                  <p className="text-red-500">{job.reportTitle}</p>
                  <p className="font-bold mt-2">Description:</p>
                  <p className="text-gray-700 h-20 overflow-y-scroll border p-2 bg-white">
                    {job.description}
                  </p>
                  <p className="font-bold mt-2">Reported By:</p>
                  <p className="text-gray-700">
                    {job.user?.fullname} <br />
                    {job.user?.email} <br />
                    {job.user?.phone}
                  </p>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            {filteredJobs.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-6">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <span className="font-semibold">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
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
