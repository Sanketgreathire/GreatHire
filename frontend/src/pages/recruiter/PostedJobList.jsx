import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiSearch } from "react-icons/fi";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const statusOptions = ["All", "Active", "Expired"];

const PostedJobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]); // State to store the list of jobs
  const [search, setSearch] = useState(""); // State for search input
  const [statusFilter, setStatusFilter] = useState("All"); // State for job status filter
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false); // State to track job fetching
  const [statusLoading, setStatusLoading] = useState({}); // State to track individual job status toggling
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const jobsPerPage = 10; // Number of jobs per page

  // Navigate to post a new job
  const handlePostJob = () => {
    navigate("/recruiter/dashboard/post-job");
  };

  // Navigate to job details page
  const handleJobDetailsClick = (jobId) => {
    navigate(`/recruiter/dashboard/job-details/${jobId}`);
  };

  // Navigate to applicants list for a specific job
  const handleApplicantsClick = (jobId) => {
    navigate(`/recruiter/dashboard/applicants-details/${jobId}`);
  };

  // Fetch all jobs for the logged-in company's ID
  const fetchAllJobs = async (companyId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${JOB_API_END_POINT}/jobs-list/${companyId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        console.error("Error: Unable to fetch jobs.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering jobs based on search and status filter
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job?.jobDetails?.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && job.jobDetails.isActive) ||
      (statusFilter === "Expired" && !job.jobDetails.isActive);
    return matchesSearch && matchesStatus;
  });

  // Implementing pagination
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Toggle job status (Active/Expired)
  const toggleActive = async (event, jobId, isActive) => {
    event.stopPropagation();
    try {
      setStatusLoading((prevLoading) => ({ ...prevLoading, [jobId]: true }));
      const response = await axios.put(
        `${JOB_API_END_POINT}/toggle-active`,
        {
          jobId,
          isActive,
          companyId: company?._id,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId
              ? { ...job, jobDetails: { ...job.jobDetails, isActive } }
              : job
          )
        );

        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast.error(
        "There was an error toggling the job status. Please try again later."
      );
    } finally {
      setStatusLoading((prevLoading) => ({ ...prevLoading, [jobId]: false }));
    }
  };

  // Fetch jobs when component mounts or when user/company data changes
  useEffect(() => {
    if (user && company) {
      fetchAllJobs(company?._id);
    }
  }, [user, company]);

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Helmet>
        <title>
          Dashboard for Posted Jobs | Manage Job Easily
        </title>

        <meta
          name="description"
          content="GreatHire enables recruiters to have a central viewing platform on which they can manage their listed jobs in an effective way in growing organizations in Hyderabad State, providing real-time control and visibility on hiring. The feature-rich and recruiter-centric platform allows effortless viewing of ongoing and lapsed jobs, easy viewing of applicants, effective status management, and smooth hiring process operations. The platform is built with today's business organization in mind, helping in minimizing the time to hire, enabling better hiring outcomes, and retaining full control over the listed jobs. Get equipped with the secure, scalable, and user-friendly hiring platform."
        />
      </Helmet>

      {company && user.isActive ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="p-5 shadow-md rounded-lg pt-20">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
                  <p className="text-blue-600 dark:text-blue-400 font-bold transition-colors duration-300">Loading jobs...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Filters Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                  <div className="relative w-full md:w-1/3">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Search by job title"
                      className="pl-10 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="w-full md:w-1/6">
                    <select
                      className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table Container with overflow for responsiveness */}
                <div className="overflow-x-auto w-full">
                  <Table className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md transition-colors duration-300">
                    <TableHeader className="bg-gray-200 dark:bg-gray-700 transition-colors duration-300">
                      <TableRow className="border-b border-gray-300 dark:border-gray-600">
                        <TableHead className="text-center text-gray-900 dark:text-gray-100 font-semibold">Sr No.</TableHead>
                        <TableHead className="text-center text-gray-900 dark:text-gray-100 font-semibold">Date</TableHead>
                        <TableHead className="text-center text-gray-900 dark:text-gray-100 font-semibold">Job Role</TableHead>
                        <TableHead className="text-center text-gray-900 dark:text-gray-100 font-semibold">Status</TableHead>
                        <TableHead className="text-center text-gray-900 dark:text-gray-100 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="text-center">
                      {currentJobs.length > 0 ? (
                        currentJobs.map((job, index) => (
                          <TableRow
                            key={job._id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                            onClick={() => handleJobDetailsClick(job._id)}
                          >
                            <TableCell className="text-gray-900 dark:text-gray-100">
                              {(currentPage - 1) * jobsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-100">
                              {new Date(job.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-100">{job.jobDetails.title}</TableCell>
                            {job?.created_by === user?._id ||
                              user?.emailId.email === company?.adminEmail ? (
                              <TableCell className="place-items-center">
                                {statusLoading[job._id] ? (
                                  <span className="text-gray-600 dark:text-gray-400">loading...</span>
                                ) : job.jobDetails.isActive ? (
                                  <FaToggleOn
                                    className="text-green-500 dark:text-green-400 cursor-pointer mx-auto transition-colors duration-300"
                                    onClick={(event) =>
                                      toggleActive(
                                        event,
                                        job._id,
                                        !job.jobDetails.isActive
                                      )
                                    }
                                    size={30}
                                  />
                                ) : (
                                  <FaToggleOff
                                    className="text-red-500 dark:text-red-400 cursor-pointer mx-auto transition-colors duration-300"
                                    onClick={(event) =>
                                      toggleActive(
                                        event,
                                        job._id,
                                        !job.jobDetails.isActive
                                      )
                                    }
                                    size={30}
                                  />
                                )}
                              </TableCell>
                            ) : (
                              <TableCell className="text-gray-900 dark:text-gray-100">-----</TableCell>
                            )}
                            <TableCell className="p-3 text-center">
                              <div className="flex justify-center gap-3 flex-wrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJobDetailsClick(job._id);
                                  }}
                                  className="bg-blue-700 dark:bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-300"
                                >
                                  Job Details
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplicantsClick(job._id);
                                  }}
                                  className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 dark:hover:bg-green-500 transition-colors duration-300"
                                >
                                  Applicants List
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan="5"
                            className="text-center text-gray-500 dark:text-gray-400 py-8 transition-colors duration-300"
                          >
                            No jobs found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded transition-colors duration-300 ${currentPage === 1
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                      : "bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500"
                      }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border rounded transition-colors duration-300 ${currentPage === totalPages
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                      : "bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : !company ? (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <span className="text-4xl text-gray-400 dark:text-gray-500 transition-colors duration-300">Company not created</span>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <span className="text-4xl text-gray-400 dark:text-gray-500 transition-colors duration-300">
            GreatHire will verify your company soon.
          </span>
        </div>
      )}
    </>
  );
};

export default PostedJobList;