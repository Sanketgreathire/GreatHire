import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiSearch, FiEye } from "react-icons/fi";
import { APPLICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import ApplicantDetails from "./ApplicantDetails";
import Navbar from "@/components/admin/Navbar";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

// ✅ Only 4 allowed statuses — exact strings stored in DB
const ALL_STATUSES = ["Pending", "Interview Schedule", "Shortlisted", "Rejected"];

// Filter bar options
const FILTER_OPTIONS = ["All", ...ALL_STATUSES];

// Badge colors per status
const statusBadgeStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  "Interview Schedule": "bg-purple-100 text-purple-700",
  Shortlisted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const AppliedCandidatesList = () => {
  const [applicants, setApplicants] = useState([]);
  const { user } = useSelector((state) => state.auth); // Get the logged-in user details
  const [search, setSearch] = useState(""); // State for search input
  const [statusFilter, setStatusFilter] = useState("All"); // State for status filter
  const jobId = useParams().id; // Get job ID from the URL parameters
  const [applicantDetailsModal, setApplicantDetailsModal] = useState(false); // State to show/hide applicant details modal
  const [applicant, setApplicant] = useState(null); // Selected applicant details
  const [applicantId, setApplicantId] = useState(null); // Selected applicant ID
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 10;

  // Function to check if a string is a valid URL
  const isValidHttpUrl = (string) => {
    try {
      let url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  // Function to fetch applicants for a given job ID
  const fetchApplicants = async (jobId) => {
    try {
      const response = await axios.get(
        `${APPLICATION_API_END_POINT}/${jobId}/applicants`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setApplicants(response.data.applicants);
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  // Fetch applicants when jobId changes or when closing the applicant details modal
  useEffect(() => {
    if (jobId && !applicantDetailsModal) {
      fetchApplicants(jobId);
    }
  }, [jobId]);

  // ✅ Key fix: explicitly trim the value before sending to avoid whitespace bugs
  const handleStatusChange = async (applicationId, rawValue) => {
    const newStatus = rawValue.trim();

    if (!ALL_STATUSES.includes(newStatus)) {
      toast.error(`"${newStatus}" is not a valid status.`);
      return;
    }

    setUpdatingStatusId(applicationId);
    try {
      const response = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        setApplicants((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        toast.success(`Status updated to "${newStatus}"`);
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      const msg = err?.response?.data?.message || "Failed to update status.";
      toast.error(msg);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filteredApplicants = applicants?.filter((data) => {
    const matchesSearch =
      data?.applicant?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      data?.applicant?.emailId?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || data.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(
    indexOfFirstApplicant,
    indexOfLastApplicant
  );
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

  return (
   <>

      <Helmet>
        <title>
          List of Applied Candidates | Monitor & Handle Job Applications - GreatHire
        </title>

        <meta
          name="description"
          content="GreatHire offers an optimized applied candidate list with great performance capabilities that makes finding the right candidates easy. Known as the recruitment page of great power in teams growing in the state of Hyderabad in India, it allows the recruiter to view applications from applicants as well as access resumes. The recruitment page aims at creating ease of recruitment by streamlining recruiter work with functionalities that increase recruiter productivity while ensuring quick short-listing and easy collaboration. Get the entire visibility of your recruitment process as a recruiter with our secure and scalable applicant management solution."
        />
      </Helmet>


      {user?.role !== "recruiter" && <Navbar linkName={"Applicants List"} />}
      <div
        className={`${user?.role !== "recruiter" ? "bg-white dark:bg-gray-900 dark:text-white m-4" : ""} p-10 min-h-screen bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-md`}
      >
        {!applicantDetailsModal ? (
          <>
            {/* Back Button */}
            <div>
              <IoIosArrowRoundBack
                size={35}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
                onClick={() => navigate(-1)}
              />
            </div>
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-4 text-center underline">
              Applied Candidates List
            </h1>

            {/* Search & Filter Section */}
            <div className="flex flex-wrap justify-between mb-4 gap-4">
              <div className="relative w-full md:w-1/3">
                <FiSearch className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email"
                  className="pl-10 p-2 border border-gray-300 rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <select
                className="p-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md w-full md:w-auto"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {FILTER_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <Table className="w-full border-collapse bg-white dark:bg-gray-800 min-w-[800px]">
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                  <TableRow>
                    <TableHead className="text-center font-semibold">Sr No.</TableHead>
                    <TableHead className="text-center font-semibold">Name</TableHead>
                    <TableHead className="text-center font-semibold">Email</TableHead>
                    <TableHead className="text-center font-semibold">Resume</TableHead>
                    <TableHead className="text-center font-semibold">Status</TableHead>
                    <TableHead className="text-center font-semibold">Update Status</TableHead>
                    <TableHead className="text-center font-semibold">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                  {currentApplicants.length > 0 ? (
                    currentApplicants.map((data, index) => (
                      <TableRow
                        key={data._id}
                        className="hover:bg-gray-50 dark:bg-gray-800 transition duration-150"
                      >
                        {/* Sr No */}
                        <TableCell>{indexOfFirstApplicant + index + 1}</TableCell>

                        {/* Name */}
                        <TableCell className="font-medium">
                          {data.applicant?.fullname}
                        </TableCell>

                        {/* Email */}
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {data.applicant?.emailId?.email}
                        </TableCell>

                        {/* Resume */}
                        <TableCell>
                          <div
                          className="flex justify-center space-x-2"
                          onClick={(e) => e.stopPropagation()} // Prevents row click when clicking the eye button
                        >
                              {isValidHttpUrl(data.applicant.profile.resume) ? (
                            <a
                              href={encodeURI(data.applicant.profile.resume)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline"
                              title="View Resume"
                            >
                              <FiEye size={20} />
                            </a>
                          ) : (
                            <span className="text-red-500 dark:text-red-400">Invalid URL</span>
                          )}
                        </div>
                      </TableCell>

                        {/* Status Badge */}
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              statusBadgeStyles[data.status] ||
                              "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {data.status}
                          </span>
                        </TableCell>

                        {/* ✅ Status Dropdown — value explicitly trimmed on change */}
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <select
                              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 cursor-pointer"
                              value={data.status}
                              disabled={updatingStatusId === data._id}
                              onChange={(e) =>
                                handleStatusChange(data._id, e.target.value)
                              }
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            {updatingStatusId === data._id && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">Saving...</span>
                            )}
                          </div>
                        </TableCell>

                        {/* View Details */}
                        <TableCell>
                          <button
                            className="flex items-center gap-1 mx-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white dark:text-gray-200 text-sm rounded-md transition"
                            onClick={() => {
                              setApplicant(data);
                              setApplicantId(data._id);
                              setApplicantDetailsModal(true);
                            }}
                          >
                            <FiEye size={14} /> View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan="7"
                        className="text-center text-gray-500 dark:text-gray-400 py-8"
                      >
                        No applicants found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls*/}
            {totalPages >= 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`px-4 py-2 text-white rounded-md ${currentPage === 1
                      ? "bg-gray-400 cursor-not-allowed dark:bg-gray-600"
                      : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  }`}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {Math.max(totalPages, 1)}
                </span>

                <button
                  className={`px-4 py-2 text-white dark rounded-md ${currentPage === totalPages || totalPages === 0
                      ? "bg-gray-400 cursor-not-allowed dark:bg-gray-600"
                      : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <ApplicantDetails
            app={applicant}
            applicantId={applicantId}
            jobId={jobId}
            setApplicantDetailsModal={setApplicantDetailsModal}
            user={user}
            setApplicants={setApplicants}
            shouldDeductCredit={false}
          />
        )}
      </div>
    </>
  );
};

export default AppliedCandidatesList;