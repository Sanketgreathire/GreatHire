import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FiSearch,
  FiBriefcase,
  FiUsers,
  FiEye,
} from "react-icons/fi";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const statusOptions = ["All", "Active", "Expired"];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const PostedJobList = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  const jobsPerPage = 10;

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  const handlePostJob = useCallback(
    () => {
      navigate("/recruiter/dashboard/post-job");
    },
    [navigate]
  );

  const handleJobDetailsClick = useCallback(
    (jobId) => {
      navigate(`/recruiter/dashboard/job-details/${jobId}`);
    },
    [navigate]
  );

  const handleApplicantsClick = useCallback(
    (jobId) => {
      navigate(`/recruiter/dashboard/applicants-details/${jobId}`);
    },
    [navigate]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
    },
    []
  );

  // --------------------------------------------------
  // Match Candidates
  // --------------------------------------------------

  const handleMatchCandidates = useCallback(
    async (event, jobId) => {
      event.stopPropagation();

      try {
        const response = await axios.post(
          `http://localhost:8000/api/v1/jd-matching/match-candidates/${jobId}`,
          {},
          {
            withCredentials: true,
            timeout: 10000,
          }
        );

        if (response.data.success) {
          toast.success(
            response.data.queued
              ? "Candidate matching started in background."
              : "Candidate matching completed."
          );
        } else {
          toast.error(
            response.data.message || "Matching failed."
          );
        }
      } catch (error) {
        console.error(
          "MATCH ERROR:",
          error.response?.data || error.message
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to start candidate matching."
        );
      }
    },
    []
  );

  // --------------------------------------------------
  // Fetch Jobs
  // --------------------------------------------------

  const fetchAllJobs = useCallback(
    async (companyId) => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${JOB_API_END_POINT}/jobs-list/${companyId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setJobs(response.data.jobs || []);
        }
      } catch (error) {
        console.error(
          "Error fetching jobs:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load posted jobs."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // --------------------------------------------------
  // Filter Jobs
  // --------------------------------------------------

  const filteredJobs = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const title =
        job?.jobDetails?.title?.toLowerCase() || "";

      const companyName =
        job?.jobDetails?.companyName?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchValue) ||
        companyName.includes(searchValue);

      const isActive = Boolean(
        job?.jobDetails?.isActive
      );

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && isActive) ||
        (statusFilter === "Expired" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(filteredJobs.length / jobsPerPage)
    );
  }, [filteredJobs.length]);

  const currentJobs = useMemo(() => {
    return filteredJobs.slice(
      (currentPage - 1) * jobsPerPage,
      currentPage * jobsPerPage
    );
  }, [filteredJobs, currentPage]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // --------------------------------------------------
  // Toggle Job Status
  // --------------------------------------------------

  const toggleActive = useCallback(
    async (event, jobId, isActive) => {
      event.stopPropagation();

      try {
        setStatusLoading((prev) => ({
          ...prev,
          [jobId]: true,
        }));

        const response = await axios.put(
          `${JOB_API_END_POINT}/toggle-active`,
          {
            jobId,
            isActive,
            companyId: company?._id,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setJobs((prev) =>
            prev.map((job) =>
              job._id === jobId
                ? {
                    ...job,
                    jobDetails: {
                      ...job.jobDetails,
                      isActive,
                    },
                  }
                : job
            )
          );

          toast.success(response.data.message);
        } else {
          toast.error(
            response.data.message ||
              "Unable to update job status."
          );
        }
      } catch (error) {
        console.error(
          "Toggle status error:",
          error.response?.data || error.message
        );

        toast.error(
          error.response?.data?.message ||
            "There was an error toggling the job status."
        );
      } finally {
        setStatusLoading((prev) => ({
          ...prev,
          [jobId]: false,
        }));
      }
    },
    [company?._id]
  );

  // --------------------------------------------------
  // Fetch on Load
  // --------------------------------------------------

  useEffect(() => {
    if (user && company?._id) {
      fetchAllJobs(company._id);
    }
  }, [user, company?._id, fetchAllJobs]);

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const activeJobsCount = useMemo(() => {
    return jobs.filter(
      (job) => job?.jobDetails?.isActive
    ).length;
  }, [jobs]);

  const expiredJobsCount = useMemo(() => {
    return jobs.filter(
      (job) => !job?.jobDetails?.isActive
    ).length;
  }, [jobs]);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      <Helmet>
        <title>
          Posted Jobs | GreatHire Recruiter Dashboard
        </title>

        <meta
          name="description"
          content="Manage your posted jobs, view applicants, match candidates, and control job status from the GreatHire recruiter dashboard."
        />
      </Helmet>

      {/* COMPANY NOT AVAILABLE */}

      {!company ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FiBriefcase
                size={34}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Company Not Created
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Please create your company profile before
              posting jobs.
            </p>
          </div>
        </div>
      ) : !user?.isActive ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <FiBriefcase
                size={34}
                className="text-yellow-600 dark:text-yellow-400"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Company Verification Pending
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              GreatHire will verify your company soon. You
              will be able to manage your jobs once the
              verification is completed.
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <div className="p-4 sm:p-6 lg:p-8 pt-20">

            {/* PAGE HEADER */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Recruiter Dashboard
                </p>

                <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Posted Jobs
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your job postings and track hiring
                  activity.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePostJob}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
              >
                <span className="text-lg">+</span>
                Post New Job
              </button>
            </div>

            {/* STAT CARDS */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Total Jobs */}

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Jobs
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {jobs.length}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <FiBriefcase
                      size={21}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Active Jobs */}

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Active Jobs
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                      {activeJobsCount}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <FaToggleOn
                      size={25}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                </div>
              </div>

              {/* Expired Jobs */}

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Expired Jobs
                    </p>

                    <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                      {expiredJobsCount}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <FaToggleOff
                      size={25}
                      className="text-red-600 dark:text-red-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CARD */}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

              {/* FILTER HEADER */}

              <div className="border-b border-gray-200 p-4 sm:p-5 dark:border-gray-800">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  {/* Search */}

                  <div className="relative w-full lg:max-w-md">
                    <FiSearch
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      placeholder="Search by job title or company..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
                    />
                  </div>

                  {/* Filter */}

                  <div className="flex w-full items-center gap-3 lg:w-auto">
                    <span className="hidden text-sm font-medium text-gray-500 sm:block dark:text-gray-400">
                      Filter:
                    </span>

                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* TABLE */}

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex min-h-[350px] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

                      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Loading posted jobs...
                      </p>
                    </div>
                  </div>
                ) : (
                  <Table className="min-w-[1250px]">
                    <TableHeader>
                      <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800/60 dark:hover:bg-gray-800/60">

                        <TableHead className="w-[70px] whitespace-nowrap px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Sr No.
                        </TableHead>

                        <TableHead className="w-[120px] whitespace-nowrap px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Date
                        </TableHead>

                        <TableHead className="min-w-[210px] whitespace-nowrap px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Job Role
                        </TableHead>

                        <TableHead className="min-w-[200px] whitespace-nowrap px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Company Name
                        </TableHead>

                        <TableHead className="min-w-[120px] whitespace-nowrap px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Status
                        </TableHead>

                        <TableHead className="min-w-[130px] whitespace-nowrap px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Job Status
                        </TableHead>

                        <TableHead className="min-w-[390px] whitespace-nowrap px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Actions
                        </TableHead>

                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {currentJobs.length > 0 ? (
                        currentJobs.map((job, index) => {
                          const isActive = Boolean(
                            job?.jobDetails?.isActive
                          );

                          const companyName =
                            job?.jobDetails?.companyName ||
                            "N/A";

                          const jobTitle =
                            job?.jobDetails?.title ||
                            "Untitled Job";

                          return (
                            <TableRow
                              key={job._id}
                              onClick={() =>
                                handleJobDetailsClick(
                                  job._id
                                )
                              }
                              className="cursor-pointer border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:bg-gray-800/70"
                            >

                              {/* Sr No */}

                              <TableCell className="px-4 py-5 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                {(currentPage - 1) *
                                  jobsPerPage +
                                  index +
                                  1}
                              </TableCell>

                              {/* Date */}

                              <TableCell className="whitespace-nowrap px-4 py-5 text-center text-sm text-gray-600 dark:text-gray-300">
                                {job?.createdAt
                                  ? dateFormatter.format(
                                      new Date(
                                        job.createdAt
                                      )
                                    )
                                  : "N/A"}
                              </TableCell>

                              {/* Job Role */}

                              <TableCell className="px-4 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <FiBriefcase
                                      size={17}
                                      className="text-blue-600 dark:text-blue-400"
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                      {jobTitle}
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-400">
                                      Job ID:{" "}
                                      {job?._id
                                        ?.slice(-6)
                                        .toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Company Name */}

                              <TableCell className="px-4 py-5">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                      {companyName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  </div>

                                  <span className="whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {companyName}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Status Toggle */}

                              {job?.created_by === user?._id ||
                              user?.emailId?.email ===
                                company?.adminEmail ? (
                                <TableCell className="px-4 py-5 text-center">
                                  {statusLoading[job._id] ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />

                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Updating...
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(event) =>
                                        toggleActive(
                                          event,
                                          job._id,
                                          !isActive
                                        )
                                      }
                                      className="mx-auto flex items-center justify-center rounded-full p-1 transition-transform hover:scale-110"
                                      title={
                                        isActive
                                          ? "Deactivate job"
                                          : "Activate job"
                                      }
                                    >
                                      {isActive ? (
                                        <FaToggleOn
                                          size={32}
                                          className="text-green-500"
                                        />
                                      ) : (
                                        <FaToggleOff
                                          size={32}
                                          className="text-gray-400"
                                        />
                                      )}
                                    </button>
                                  )}
                                </TableCell>
                              ) : (
                                <TableCell className="px-4 py-5 text-center">
                                  <span className="text-sm text-gray-400 dark:text-gray-500">
                                    —
                                  </span>
                                </TableCell>
                              )}

                              {/* Job Status */}

                              <TableCell className="px-4 py-5 text-center">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                                    isActive
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      isActive
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  />

                                  {isActive
                                    ? "Active"
                                    : "Expired"}
                                </span>
                              </TableCell>

                              {/* Actions */}

                              <TableCell
                                className="px-4 py-5"
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              >
                                <div className="flex items-center justify-center gap-2">

                                  {/* Job Details */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleJobDetailsClick(
                                        job._id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                                  >
                                    <FiEye size={14} />
                                    Details
                                  </button>

                                  {/* Match Candidates */}

                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleMatchCandidates(
                                        e,
                                        job._id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition-all hover:border-purple-300 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40"
                                  >
                                    <FiUsers size={14} />
                                    Match
                                  </button>

                                  {/* Applicants */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApplicantsClick(
                                        job._id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition-all hover:border-green-300 hover:bg-green-100 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                                  >
                                    <FiUsers size={14} />
                                    Applicants
                                  </button>

                                </div>
                              </TableCell>

                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="px-4 py-16 text-center"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <FiBriefcase
                                  size={28}
                                  className="text-gray-400 dark:text-gray-500"
                                />
                              </div>

                              <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-200">
                                No jobs found
                              </h3>

                              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                                {search
                                  ? "No jobs match your current search."
                                  : "You have not posted any jobs yet."}
                              </p>

                              {!search &&
                                statusFilter === "All" && (
                                  <button
                                    type="button"
                                    onClick={
                                      handlePostJob
                                    }
                                    className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                  >
                                    Post Your First Job
                                  </button>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* PAGINATION */}

              {!loading && filteredJobs.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {(currentPage - 1) *
                        jobsPerPage +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {Math.min(
                        currentPage * jobsPerPage,
                        filteredJobs.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {filteredJobs.length}
                    </span>{" "}
                    jobs
                  </p>

                  <div className="flex items-center justify-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handlePageChange(
                          currentPage - 1
                        )
                      }
                      disabled={currentPage === 1}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>

                    <div className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                      {currentPage} / {totalPages}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handlePageChange(
                          currentPage + 1
                        )
                      }
                      disabled={
                        currentPage === totalPages
                      }
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostedJobList;