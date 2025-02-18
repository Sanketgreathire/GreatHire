import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; 
import Navbar from "@/components/admin/Navbar"; 
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";

const ReportedJobList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportedJobs, setReportedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchReportedJobs = async () => {
      try {
        const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/reported-job-list`, {
          withCredentials: true,
        });
        if (response?.data?.success) {
          setReportedJobs(response.data.data);
        }
        console.log(response.data.data)
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
      ((job.job.title && job.job.title.toLowerCase().includes(search.toLowerCase())) ||
       (job.job.companyName && job.job.companyName.toLowerCase().includes(search.toLowerCase())))
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar linkName="Reported Job List" />
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl text-center underline font-semibold mb-4">
          Reported Job List
        </h2>

        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by Job Title or Company"
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3">Job Title</th>
                  <th className="border border-gray-300 p-3">Company</th>
                  <th className="border border-gray-300 p-3">Reported By</th>
                  <th className="border border-gray-300 p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentJobs.map((job) => (
                  <tr key={job.reportId} className="text-center hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">{job.job?.title || "N/A"}</td>
                    <td className="border border-gray-300 p-3">{job.job?.companyName || "N/A"}</td>
                    <td className="border border-gray-300 p-3">
                      {job.user?.fullname || "Unknown"} ({job.user?.email || "No Email"})
                    </td>
                    <td className="border border-gray-300 p-3 flex justify-center space-x-4">
                      <button
                        onClick={() => (window.location.href = `/reported-users/${job.reportId}`)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Reported Users List
                      </button>
                      <button
                        onClick={() => (window.location.href = `/job-details/${job.job?.id}`)}
                        className="text-green-500 hover:text-green-700"
                        disabled={!job.job}
                      >
                        Job Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>

          <span className="text-lg font-semibold">{`Page ${currentPage}`}</span>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === Math.ceil(filteredJobs.length / jobsPerPage) ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportedJobList;
