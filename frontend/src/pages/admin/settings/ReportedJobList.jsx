import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/admin/Navbar";

const ReportedJobList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Adjust pagination size

  // Sample Reported Jobs Data
  const reportedJobs = [
    { id: 1, title: "Software Engineer", company: "Google", reportedUsers: 3 },
    { id: 2, title: "Product Manager", company: "Microsoft", reportedUsers: 5 },
    { id: 3, title: "Data Scientist", company: "Amazon", reportedUsers: 2 },
    { id: 4, title: "Frontend Developer", company: "Meta", reportedUsers: 4 },
    { id: 5, title: "Backend Developer", company: "Netflix", reportedUsers: 6 },
    { id: 6, title: "Cybersecurity Analyst", company: "IBM", reportedUsers: 3 },
    { id: 7, title: "Cloud Engineer", company: "AWS", reportedUsers: 2 },
  ];

  // Filter jobs based on search query
  const filteredJobs = reportedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Page navigation functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
    <Navbar linkName={"Reported Job List"}/>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl text-center underline font-semibold mb-4">
          Reported Job List
        </h2>
        {/* Header with Search and Total Count */}
        <div className="flex justify-between items-center mb-4">
          {/* Search Input */}
          <Input
            placeholder="Search by Job Title or Company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          {/* Total Reported Jobs */}
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
                <th className="border border-gray-300 p-3">Reported Users</th>
                <th className="border border-gray-300 p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.map((job) => (
                <tr key={job.id} className="text-center hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{job.title}</td>
                  <td className="border border-gray-300 p-3">{job.company}</td>
                  <td className="border border-gray-300 p-3">
                    {job.reportedUsers}
                  </td>
                  <td className="border border-gray-300 p-3 flex justify-center space-x-4">
                    {/* Navigate to Reported User List */}
                    <button
                      onClick={() => router.push(`/reported-users/${job.id}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Reported Users List
                    </button>
                    {/* Navigate to Job Details */}
                    <button
                      onClick={() => router.push(`/job-details/${job.id}`)}
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
          {/* Previous Button */}
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

          {/* Current Page Index */}
          <span className="text-lg font-semibold">{`Page ${currentPage}`}</span>

          {/* Next Button */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredJobs.length / jobsPerPage)
            }
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
