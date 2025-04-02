// Import necessary modules and dependencies
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplicationList = ({ applications }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // statusFilter is an empty string when no status filter is applied (i.e., "All" is active)
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 15;

  // Filter applications by job title and company, then by status (if a filter is applied)
  const filteredApplications = applications?.filter((app) => {
    const jobDetails = app?.job?.jobDetails; // Ensure jobDetails exists
    if (!jobDetails) return false; // Skip applications with null job

    const matchesSearch =
      app.job.jobDetails.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.job.jobDetails.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const indexOfLast = currentPage * applicationsPerPage;
  const indexOfFirst = indexOfLast - applicationsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle status filter: if "All" is selected or the same active filter is clicked, clear the filter.
  const handleStatusFilter = (status) => {
    if (status === "All") {
      setStatusFilter("");
    } else {
      // Toggle filter: if the same status is clicked again, reset to "All"
      setStatusFilter((prev) => (prev === status ? "" : status));
    }
    setCurrentPage(1);
  };

  // Define the filter buttons including the "All" option
  const statusOptions = ["All", "Shortlisted", "Rejected", "Pending"];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Applications</h2>

      {/* Search input and status filter buttons */}
      <div className="flex flex-col md:flex-row md:items-center mb-4">
        {/* Search Input: Filters by job title and company */}
        <input
          type="text"
          placeholder="Search by job title or company"
          className="w-full md:w-1/2 p-2 border rounded mb-2 md:mb-0 md:mr-4"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* Status Filter Buttons */}
        <div className="flex space-x-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-3 py-1 rounded border transition-colors 
                ${
                  // When no filter is active, "All" is highlighted; otherwise, highlight the selected status.
                  (statusFilter === "" && status === "All") ||
                  statusFilter === status
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-blue-700 border-blue-700 hover:bg-blue-100"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Job Title</th>
              <th className="px-4 py-2 border">Company Name</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentApplications.length ? (
              currentApplications.map((app) => (
                <tr
                  key={app.id}
                  className="text-center border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">
                    {app.job.jobDetails.title}
                  </td>
                  <td className="px-4 py-2 border">
                    {app.job.jobDetails.companyName}
                  </td>
                  <td
                    className={`px-4 py-2 border ${
                      app.status === "Shortlisted"
                        ? "text-green-600"
                        : app.status === "Rejected"
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  >
                    {app.status}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
                      onClick={() =>
                        navigate(`/admin/job/details/${app.job._id}`)
                      }
                    >
                      Job Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 border rounded transition-colors ${
                currentPage === page
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-700 hover:bg-blue-100"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
