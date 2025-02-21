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

const statuses = ["All", "Pending", "Shortlisted", "Rejected"];

const AllApplicantsList = () => {
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const companyId = company?._id;
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
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
        setApplicants(response.data.applications);
        setFilteredApplicants(response.data.applications);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = applicants;

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    // Filter by search
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (app) =>
          app.applicant.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicant.emailId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicant.phoneNumber.number.includes(searchTerm)
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
      <div className="flex justify-center mt-4 space-x-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-blue-700 text-white"
                : "bg-white text-blue-700 hover:bg-blue-100"
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
      {company && user?.isActive ? (
        !applicantDetailsModal ? (
          <div className="min-h-screen p-4 sm:p-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                <FiUsers className="text-blue-700 text-3xl" /> All Applicants
              </h1>

              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <Input
                  type="text"
                  placeholder="Search by Name, Email, or Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm"
                />
                <BsSearch className="text-gray-500 text-xl absolute right-10 top-11 hidden md:block" />

                <div className="flex gap-2 overflow-x-auto">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      className={`px-4 py-2 rounded-md text-sm font-semibold ${
                        selectedStatus === status
                          ? "bg-blue-700 text-white hover:bg-blue-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Table of Applicants */}
              <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded-lg shadow-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="text-left p-3">Full Name</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Phone</th>
                      <th className="text-center p-3">Status</th>
                      <th className="text-center p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="p-3">
                            <Skeleton className="w-full h-6" />
                          </td>
                        </tr>
                      ))
                    ) : currentApplicants?.length > 0 ? (
                      currentApplicants.map((app) => (
                        <tr
                          key={app._id}
                          className="border-b hover:bg-gray-100 transition"
                        >
                          <td className="p-3">{app?.applicant?.fullname}</td>
                          <td className="p-3">{app?.applicant?.emailId?.email}</td>
                          <td className="p-3">{app?.applicant?.phoneNumber?.number}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                app.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : app.status === "Shortlisted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {app?.status}
                            </span>
                          </td>
                          <td className="p-3 text-center flex justify-center gap-3">
                            <Button
                              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 text-sm rounded-lg"
                              onClick={() => {
                                setApplicant(app);
                                setApplicantId(app?._id);
                                setApplicantDetailsModal(true);
                                setJobId(app?.job);
                              }}
                            >
                              Details
                            </Button>
                            <Button
                              className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 text-sm rounded-lg"
                              onClick={() =>
                                navigate(`/recruiter/dashboard/job-details/${app?.job}`)
                              }
                            >
                              Job Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center p-4 text-gray-500">
                          No applicants found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Inline Pagination */}
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
          />
        )
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

export default AllApplicantsList;