// Import necessary modules and dependencies
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplicationList = ({ applications }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 15;

  const filteredApplications = applications?.filter((app) => {
    const jobDetails = app?.job?.jobDetails;
    if (!jobDetails) return false;

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

  const handleStatusFilter = (status) => {
    if (status === "All") {
      setStatusFilter("");
    } else {
      setStatusFilter((prev) => (prev === status ? "" : status));
    }
    setCurrentPage(1);
  };

  const statusOptions = ["All", "Shortlisted", "Rejected", "Pending"];

  return (
    <div className="p-3 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        My Applications
      </h2>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by job title or company"
          className="w-full lg:w-1/2 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-3 py-1 rounded border text-sm transition-colors ${
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

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <table className="w-full bg-white border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
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
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 border">
                      {app.job.jobDetails.title}
                    </td>
                    <td className="px-4 py-2 border">
                      {app.job.jobDetails.companyName}
                    </td>
                    <td
                      className={`px-4 py-2 border font-medium ${
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
                        className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 whitespace-nowrap"
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
                  <td colSpan="4" className="px-4 py-6 text-center">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded text-sm transition-colors ${
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
      )}
    </div>
  );
};

export default ApplicationList;
