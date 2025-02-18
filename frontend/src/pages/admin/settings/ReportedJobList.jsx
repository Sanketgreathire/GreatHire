import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/admin/Navbar";
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";

const ReportedJobList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportedJobs, setReportedJobs] = useState([]);
  const jobsPerPage = 5; // Adjust pagination size

  useEffect(() => {
    const fetchReportedJobs = async () => {
      try {
        const response = await axios.get( `${ADMIN_STAT_API_END_POINT}/reported-job-list`, 
          { withCredentials: true }
        );
        const data = await response.json();
        
        if (data.success) {
          setReportedJobs(data.data);
          
        }
        console.log(data);

      } catch (error) {
        console.error("Error fetching reported jobs:", error);
      }
    };
    fetchReportedJobs();
  }, []);
  

  // Filter jobs based on search query
  const filteredJobs = reportedJobs.filter(
    (job) =>
      job.job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.job.companyName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Page navigation functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar linkName={"Reported Job List"} />
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl text-center underline font-semibold mb-4">
          Reported Job List
        </h2>
        
        {/* Header with Search and Total Count */}
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

        {/* Table Section */}
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
                  <td className="border border-gray-300 p-3">{job.job.title}</td>
                  <td className="border border-gray-300 p-3">{job.job.companyName}</td>
                  <td className="border border-gray-300 p-3">{job.user.fullname}</td>
                  <td className="border border-gray-300 p-3 flex justify-center space-x-4">
                    <button
                      onClick={() => router.push(`/reported-users/${job.reportId}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Reported Users List
                    </button>
                    <button
                      onClick={() => router.push(`/job-details/${job.job.id}`)}
                      className="text-green-500 hover:text-green-700"
                    >
                      Job Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-lg font-semibold">{`Page ${currentPage}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === Math.ceil(filteredJobs.length / jobsPerPage)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
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

