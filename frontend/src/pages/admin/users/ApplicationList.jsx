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
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        My Applications
      </h2>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by job title or company"
          className="w-full lg:w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
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
                  ? "bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600"
                  : "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600"
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
          <table className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm transition-colors">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">
                  Job Title
                </th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">
                  Company Name
                </th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">
                  Status
                </th>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentApplications.length ? (
                currentApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                      {app.job.jobDetails.title}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                      {app.job.jobDetails.companyName}
                    </td>
                    <td
                      className={`px-4 py-2 border border-gray-300 dark:border-gray-600 font-medium ${
                        app.status === "Shortlisted"
                          ? "text-green-600 dark:text-green-400"
                          : app.status === "Rejected"
                          ? "text-red-600 dark:text-red-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {app.status}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                      <button
                        className="bg-blue-700 dark:bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800 dark:hover:bg-blue-700 whitespace-nowrap transition-colors"
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
                  <td 
                    colSpan="4" 
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600"
                  >
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
                    ? "bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600"
                    : "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600"
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