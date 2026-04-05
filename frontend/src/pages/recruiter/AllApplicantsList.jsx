import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { COMPANY_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { FiUsers, FiTrash2 } from "react-icons/fi";
import ApplicantDetails from "./ApplicantDetails";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

const ALL_STATUSES = ["Pending", "Interview Schedule", "Shortlisted", "Rejected"];
const FILTER_OPTIONS = ["All", ...ALL_STATUSES];

const statusBadgeStyles = {
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
  "Interview Schedule": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  Shortlisted: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

const AllApplicantsList = () => {
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const companyId = company?._id;

  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        const validApplicants = response.data.applications.filter(
          (app) => app.applicant != null
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

  useEffect(() => {
    let filtered = applicants;

    if (selectedStatus !== "All") {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (app) =>
          app.applicant?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicant?.emailId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicant?.phoneNumber?.number?.includes(searchTerm)
      );
    }

    setFilteredApplicants(filtered);
    setCurrentPage(1);
  }, [selectedStatus, searchTerm, applicants]);

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
      }
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ✅ DELETE FUNCTION
  const handleDeleteApplicant = async (applicationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this applicant?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${APPLICATION_API_END_POINT}/delete/${applicationId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setApplicants((prev) =>
          prev.filter((app) => app._id !== applicationId)
        );
        toast.success("Applicant deleted successfully");
      } else {
        toast.error("Failed to delete applicant");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting");
    }
  };

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {company && user?.isActive ? (
        !applicantDetailsModal ? (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-12 pt-10">
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 mt-6">

              <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <FiUsers className="text-blue-600 text-4xl" />
                  All Applicants
                </h1>
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                  Total: {applicants.length}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[950px]">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="p-4 text-left">Applicant</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Update Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentApplicants.map((app) => (
                      <tr key={app._id} className="border-b">
                        <td className="p-4">{app?.applicant?.fullname}</td>
                        <td className="p-4">{app?.applicant?.emailId?.email}</td>
                        <td className="p-4">{app?.applicant?.phoneNumber?.number}</td>
                        <td className="p-4 text-center">{app.status}</td>

                        <td className="p-4 text-center dark:text-gray-300 rounded">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(app._id, e.target.value)
                            }
                            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>

                        {/* ✅ UPDATED ACTIONS */}
                        <td className="p-4 text-center dark:text-gray-300">
                          <div className="flex justify-center gap-2">
                            <Button
                              className="bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-300 px-3 py-1 rounded"
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
                              className="bg-green-600 text-white px-3 py-1 rounded"
                              onClick={() =>
                                navigate(`/recruiter/dashboard/job-details/${app?.job}`)
                              }
                            >
                              📄 Job
                            </Button>

                            {/* <Button
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-lg"
                              onClick={() => handleDeleteApplicant(app._id)}
                            >
                              <FiTrash2 size={16} />
                              Delete
                            </Button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Showing{" "}
                      <strong>{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredApplicants.length)}</strong>{" "}
                      of <strong>{filteredApplicants.length}</strong> applicants
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded disabled:opacity-40"
                      >
                        ← Prev
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item, idx) =>
                          item === "..." ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                          ) : (
                            <button
                              key={item}
                              onClick={() => setCurrentPage(item)}
                              className={`px-3 py-1 text-sm rounded border ${currentPage === item
                                  ? "bg-blue-600 text-white border-blue-600 font-medium"
                                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                }`}
                            >
                              {item}
                            </button>
                          )
                        )}

                      <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded disabled:opacity-40"
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
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
      ) : (
        <div className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">
            Company not verified yet.
          </span>
        </div>
      )}
    </>
  );
};

export default AllApplicantsList;