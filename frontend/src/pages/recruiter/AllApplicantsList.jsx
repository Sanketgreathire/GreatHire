import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import { FiUsers } from "react-icons/fi";
import ApplicantDetails from "./ApplicantDetails";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Status options for filtering applicants
const statuses = ["All", "Pending", "Shortlisted", "Rejected"];

const AllApplicantsList = () => {
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const companyId = company?._id;
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true);

  const [applicantDetailsModal, setApplicantDetailsModal] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [applicantId, setApplicantId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyId) return;
    fetchApplicants();
  }, [companyId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${COMPANY_API_END_POINT}/applicants/${companyId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        // Filter out applications with null/undefined applicants
        const validApplicants = response.data.applications.filter(
          app => app.applicant != null
        );
        setApplicants(validApplicants);
        setFilteredApplicants(validApplicants);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering applicants based on status and search term
  useEffect(() => {
    let filtered = applicants;

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    // Filter by search input (name, email, or phone number)
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (app) =>
          app.applicant?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicant?.emailId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicant?.phoneNumber?.number?.includes(searchTerm)
      );
    }

    setFilteredApplicants(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedStatus, searchTerm, applicants]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstItem, indexOfLastItem);

  // Inline Pagination Component
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <div className="flex justify-center mt-4 space-x-2 pt-20">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded ${currentPage === page
                ? "bg-blue-700 text-white dark:bg-blue-800 dark:text-white shadow-md"
                : "bg-white text-blue-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        {/* Meta Title */}
        <title>
          Every Applicant | Oversee Employees & Hiring Process - GreatHire
        </title>

        {/* Meta Description */}
        <meta
          name="description"
          content="GreatHire is a robust recruitment platform working out of Hyderabad State in India, helping modern hiring teams manage and review all job applicants with efficiency. This page displays all applicants and thus allows recruiters or employers to easily search, filter, shortlist, or reject candidates while keeping track of the status of applications in real time. Get insights into applicant details, job information, and power your hiring workflow from one single dashboard. Built for speed, clarity, and control, GreatHire supports smart hiring decisions, productivity among recruiters, and faster closures of top talent for companies."
        />
      </Helmet>

      {company && user?.isActive ? (
        !applicantDetailsModal ? (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-12 pt-28">
            {/* Page Wrapper */}
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-12">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                    <FiUsers className="text-blue-600 dark:text-blue-400 text-4xl" /> All Applicants
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Review and manage all candidates who applied to your jobs.
                  </p>
                </div>
                <span className="mt-4 sm:mt-0 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-full font-semibold text-sm">
                  Total: {applicants.length}
                </span>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                {/* Search Box */}
                <div className="relative w-full md:w-1/3">
                  <BsSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-300 text-lg" />
                  <Input
                    type="text"
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedStatus === status
                          ? "bg-blue-600 text-white dark:bg-blue-700 shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Applicants Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full bg-white dark:bg-gray-800">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-blue-700 dark:to-indigo-700">
                    <tr>
                      <th className="text-left p-4">Applicant</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Phone</th>
                      <th className="text-center p-4">Status</th>
                      <th className="text-center p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="p-4">
                            <Skeleton className="w-full h-6" />
                          </td>
                        </tr>
                      ))
                    ) : currentApplicants?.length > 0 ? (
                      currentApplicants.map((app) => (
                        <tr
                          key={app._id}
                          className="border-b last:border-0 hover:bg-gray-50 transition dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-bold">
                              {app?.applicant?.fullname?.charAt(0) || "?"}
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {app?.applicant?.fullname || "Unknown"}
                            </span>
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">
                            {app?.applicant?.emailId?.email || "N/A"}
                          </td>
                          <td className="p-4 text-gray-700 dark:text-gray-300">
                            {app?.applicant?.phoneNumber?.number || "N/A"}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${app.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                  : app.status === "Shortlisted"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                }`}
                            >
                              {app?.status}
                            </span>
                          </td>
                          <td className="p-4 text-center flex justify-center gap-3">
                            <Button
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 px-4 py-2 text-sm rounded-lg"
                              onClick={() => {
                                setApplicant(app);
                                setApplicantId(app?._id);
                                setApplicantDetailsModal(true);
                                setJobId(app?.job);
                              }}
                            >
                              👁 View
                            </Button>
                            <Button
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 px-4 py-2 text-sm rounded-lg"
                              onClick={() => 
                                navigate(`/recruiter/dashboard/job-details/${app?.job}`)
                              }
                            >
                              📄 Job
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center p-6 text-gray-500 dark:text-gray-400">
                          No applicants found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {renderPagination()}
            </div>
          </div>
        ) : (
          <ApplicantDetails
            app={applicant}
            setApplicantDetailsModal={setApplicantDetailsModal}
            applicantId={applicantId}
            jobId={jobId}
            user={user}
            setApplicants={setApplicants}
            shouldDeductCredit={false}
          />
        )
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400 dark:text-gray-500">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400 dark:text-gray-500">
            GreatHire will verify your company soon.
          </span>
        </p>
      )}
    </>
  );

};

export default AllApplicantsList;