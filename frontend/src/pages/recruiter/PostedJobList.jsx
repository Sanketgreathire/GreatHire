import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
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
      {company && user.isActive ? (
        <div className="p-5 bg-gray-50 shadow-md rounded-lg">
          <div className="mb-6">
            <div className="p-10 bg-white shadow-md rounded-lg flex justify-center items-center">
              <button
                onClick={handlePostJob}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-600 transition flex items-center"
              >
                <span className="text-2xl font-bold mr-1">+</span> Post New Job
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center">
              <p className="text-blue-600 font-bold">Loading jobs...</p>
            </div>
          ) : (
            <>
              {/* Filters Section */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-4">
                <div className="relative w-full md:w-1/3">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by job title"
                    className="pl-10 p-2 border border-gray-300 rounded-md w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="w-full md:w-1/6">
                  <select
                    className="p-2 border border-gray-300 rounded-md w-full"
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
                <Table className="w-full  border border-gray-300 bg-white">
                  <TableHeader className="bg-gray-300">
                    <TableRow>
                      <TableHead className="text-center">Sr No.</TableHead>
                      <TableHead className="text-center">Date</TableHead>
                      <TableHead className="text-center">Job Role</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="text-center">
                    {currentJobs.length > 0 ? (
                      currentJobs.map((job, index) => (
                        <TableRow
                          key={job._id}
                          className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                          onClick={() => handleJobDetailsClick(job._id)}
                        >
                          <TableCell>
                            {(currentPage - 1) * jobsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            {new Date(job.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>{job.jobDetails.title}</TableCell>
                          {job?.created_by === user?._id ||
                          user?.emailId.email === company?.adminEmail ? (
                            <TableCell className="place-items-center ">
                              {statusLoading[job._id] ? (
                                "loading..."
                              ) : job.jobDetails.isActive ? (
                                <FaToggleOn
                                  className="text-green-500 cursor-pointer"
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
                                  className="text-red-500 cursor-pointer"
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
                            <TableCell>-----</TableCell>
                          )}
                          <TableCell className=" p-3 text-center flex justify-center gap-3 ">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJobDetailsClick(job._id);
                              }}
                              className="bg-blue-700 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition"
                            >
                              Job Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApplicantsClick(job._id);
                              }}
                              className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition"
                            >
                              Applicants List
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan="6"
                          className="text-center text-gray-500 py-4"
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
                  className={`px-4 py-2 border rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-700 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-700 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">
          GreatHire will verify your company soon.
          </span>
        </p>
      )}
    </>
  );
};

export default PostedJobList;
