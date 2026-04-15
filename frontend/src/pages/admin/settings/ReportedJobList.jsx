// Import necessary modules and dependencies
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/admin/Navbar";
import {
  ADMIN_STAT_API_END_POINT,
  COMPANY_API_END_POINT,
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
  const itemsPerPage = 9;

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
          // Sort newest first by createdAt
          const sorted = [...response.data.data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setReportedJobs(sorted);
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
  const handleDeleteJob = async (reportid) => {
    if (!reportid) return;

    try {
      const response = await axios.delete(
        `${COMPANY_API_END_POINT}/jobReports/${reportid}`,
        { withCredentials: true }
      );

      // If deletion is successful, update the state and show a success message
      if (response?.data?.success) {
        setReportedJobs((prevJobs) =>
          prevJobs.filter((job) => job.id !== reportid)
        );
        toast.success("Reported job deleted successfully!");
      } else {
        toast.error("Failed to delete reported job.");
      }
    } catch (error) {
      toast.error("Error deleting reported job. Please try again.");
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

  // Badge colors per report type
  const reportTypeBadge = {
    offensive: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    money: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    incorrect: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    selling: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    other: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };

  return (
    <>
      <Navbar linkName="Reported Job List" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 max-w-7xl mx-auto rounded-lg shadow-lg relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-xl transition-colors duration-200 mt-2"
        >
          <FiArrowLeft size={28} className="mr-2" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white mt-10">
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
            className="w-full md:w-1/3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-gray-700 dark:text-gray-300 font-semibold">
            Total Reported Jobs : &nbsp;
            <span className="text-indigo-600 dark:text-indigo-400">
              {filteredJobs.length}
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg font-semibold">
            No reported job found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 transition transform hover:-translate-y-1 hover:shadow-xl relative"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {job.job?.title || "N/A"}
                    </h3>
                    <Eye
                      size={25}
                      onClick={() =>
                        navigate(`/admin/job/details/${job.job.jobId}`)
                      }
                      className="cursor-pointer text-blue-600 dark:text-blue-400 shrink-0 mt-1"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {job.job?.companyName || "N/A"}
                  </p>
                  <div className="mb-4">
                    <p className="font-bold text-gray-700 dark:text-gray-300">Report:</p>
                    <p className="text-indigo-600 dark:text-indigo-400">{job.reportTitle}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-bold text-gray-700 dark:text-gray-300">Description:</p>
                    <p className="text-gray-600 dark:text-gray-400 max-h-24 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      {job.description}
                    </p>
                  </div>
                  {/* ── PANEL DETAILS ── */}
                  {job.reportType === "offensive" && job.offensiveDetails && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-600 rounded-lg">
                      <p className="font-bold text-red-800 dark:text-red-300 text-xs uppercase mb-1">🚫 Offensive Details</p>
                      {job.offensiveDetails.offensiveType && (
                        <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Type:</span> {job.offensiveDetails.offensiveType}</p>
                      )}
                      {job.offensiveDetails.offensiveWhere && (
                        <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Where:</span> {job.offensiveDetails.offensiveWhere}</p>
                      )}
                    </div>
                  )}

                  {job.reportType === "money" && job.moneyDetails && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-600 rounded-lg">
                      <p className="font-bold text-yellow-800 dark:text-yellow-300 text-xs uppercase mb-1">⚠️ Money / Fake Job Details</p>
                      {job.moneyDetails.feeAmount && (
                        <p className="text-sm text-gray-600 dark:text-gray-100"><span className="font-semibold">Amount:</span> ₹{job.moneyDetails.feeAmount}</p>
                      )}
                      {job.moneyDetails.paymentMode && (
                        <p className="text-sm text-gray-600 dark:text-gray-100"><span className="font-semibold">Payment Mode:</span> {job.moneyDetails.paymentMode}</p>
                      )}
                      {job.moneyDetails.feeReason && (
                        <p className="text-sm text-gray-600 dark:text-gray-100"><span className="font-semibold">Fee For:</span> {job.moneyDetails.feeReason}</p>
                      )}
                      {job.moneyDetails.didPay && (
                        <p className="text-sm text-gray-600 dark:text-gray-100"><span className="font-semibold">Did Pay:</span> {job.moneyDetails.didPay}</p>
                      )}
                    </div>
                  )}

                  {job.reportType === "incorrect" && job.incorrectDetails && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-600 rounded-lg">
                      <p className="font-bold text-green-800 dark:text-green-300 text-xs uppercase mb-1">✏️ Incorrect Details</p>
                      {job.incorrectDetails.wrongFields?.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-100">
                          <span className="font-semibold">Wrong Fields:</span>{" "}
                          {job.incorrectDetails.wrongFields.join(", ")}
                        </p>
                      )}
                      {job.incorrectDetails.correctInfo && (
                        <p className="text-sm text-gray-600 dark:text-gray-100"><span className="font-semibold">Correct Info:</span> {job.incorrectDetails.correctInfo}</p>
                      )}
                    </div>
                  )}

                  {job.reportType === "selling" && job.sellingDetails && (
                    <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-600 rounded-lg">
                      <p className="font-bold text-purple-800 dark:text-purple-300 text-xs uppercase mb-1">🛒 Selling Details</p>
                      {job.sellingDetails.sellingWhat && (
                        <p className="text-sm text-gray-600 dark:text-gray-100"><span className="font-semibold">Selling:</span> {job.sellingDetails.sellingWhat}</p>
                      )}
                      {job.sellingDetails.askedToBuy && (
                        <p className="text-sm text-gray-600 dark:text-gray-100"><span className="font-semibold">Asked to Buy:</span> {job.sellingDetails.askedToBuy}</p>
                      )}
                    </div>
                  )}

                  {job.reportType === "other" && job.otherDetails?.otherCategory && (
                    <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <p className="font-bold text-slate-600 dark:text-slate-300 text-xs uppercase mb-1">📝 Other Details</p>
                      <p className="text-sm text-gray-600 dark:text-gray-100"><span className="font-semibold">Category:</span> {job.otherDetails.otherCategory}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-700 dark:text-gray-300">Reported By:</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {job.user?.fullname || "N/A"} <br />
                      {job.user?.email || "N/A"} <br />
                      {job.user?.phone || "N/A"}
                    </p>
                  </div>
                  {/* ── SCREENSHOTS ── */}
                  {job.screenshots?.length > 0 && (
                    <div className="mb-4">
                      <p className="font-bold text-gray-700 dark:text-gray-300 mb-2">Screenshots / Proof:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.screenshots.map((url, idx) => (
                          url.endsWith(".pdf") ? (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 underline bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded"
                            >
                              📄 PDF {idx + 1}
                            </a>
                          ) : (
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={url}
                                alt={`screenshot-${idx}`}
                                className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-600 hover:scale-105 transition"
                              />
                            </a>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  <Trash
                    className="text-red-500 dark:text-red-400 cursor-pointer absolute bottom-4 right-4"
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
