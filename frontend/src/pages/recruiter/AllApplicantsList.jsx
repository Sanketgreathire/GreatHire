import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { COMPANY_API_END_POINT, APPLICATION_API_END_POINT, EMAIL_API_END_POINT } from "@/utils/ApiEndPoint";
import { FiUsers, FiTrash2 } from "react-icons/fi";
import { X } from "lucide-react";
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

  const isStarterPlan = !company?.hasSubscription && (company?.plan === "FREE" || !company?.plan);
  const STARTER_LIMIT = 20;

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiJobTitle, setAiJobTitle] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAnalyzeCandidates = async () => {
    if (applicants.length === 0) return toast.error("No applicants to analyze.");

    const appsToAnalyze = isStarterPlan ? filteredApplicants.slice(0, STARTER_LIMIT) : filteredApplicants;
    const applicationIds = appsToAnalyze.map(a => a._id);

    setAiLoading(true);
    setShowAIModal(true);
    setAiResults([]);
    try {
      const res = await axios.post(
        `${EMAIL_API_END_POINT}/analyze-candidates`,
        { applicationIds },
        { withCredentials: true }
      );
      if (res.data.success) {
        setAiResults(res.data.results);
        setAiJobTitle(res.data.jobTitle);
      } else {
        toast.error("Analysis failed.");
      }
    } catch (err) {
      console.error("AI analysis error:", err);
      toast.error(err?.response?.data?.message || "Analysis failed.");
      setShowAIModal(false);
    } finally {
      setAiLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const visibleApplicants = isStarterPlan ? filteredApplicants.slice(0, STARTER_LIMIT) : filteredApplicants;
  const currentApplicants = visibleApplicants.slice(indexOfFirstItem, indexOfLastItem);

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
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                    {selectedStatus === "All" && !searchTerm.trim()
                      ? `Total: ${isStarterPlan ? Math.min(applicants.length, STARTER_LIMIT) : applicants.length}`
                      : `Showing: ${visibleApplicants.length} of ${isStarterPlan ? Math.min(applicants.length, STARTER_LIMIT) : applicants.length}`}
                  </span>
                  {applicants.length > 0 && (
                    <Button
                      onClick={handleAnalyzeCandidates}
                      disabled={aiLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow"
                    >
                      🤖 {aiLoading ? "Analyzing..." : "Analyze Best Candidates"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Starter plan limit banner */}
              {isStarterPlan && applicants.length > STARTER_LIMIT && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <span className="font-semibold">Starter Plan:</span> You can view the first {STARTER_LIMIT} applicants per job.
                    <button onClick={() => navigate("/packages")} className="ml-2 underline font-semibold">Upgrade to see all {applicants.length}</button>
                  </p>
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border max-h-[60vh] overflow-y-auto">
                <table className="w-full min-w-[950px]">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="p-4 text-left">Applicant</th>
                      <th className="p-4 text-left">Job Title</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Update Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentApplicants.map((app) => (
                      <tr key={app._id} className="border-b">
                        <td className="p-4">{app?.applicant?.fullname}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{app?.job?.jobDetails?.title || "—"}</td>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded disabled:opacity-40"
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
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setCurrentPage(item)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            currentPage === item
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <Button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded disabled:opacity-40"
                  >
                    Next →
                  </Button>
                </div>
              )}

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

      {/* AI Analysis Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">🤖 AI Candidate Matching</h2>
                {aiJobTitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Job: {aiJobTitle}</p>}
              </div>
              <button onClick={() => setShowAIModal(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Analyzing candidates...</p>
                </div>
              ) : aiResults.map((c, idx) => (
                <div key={idx} className={`rounded-xl border-2 p-4 ${
                  idx === 0 ? "border-green-400 bg-green-50 dark:bg-green-900/20" :
                  idx === 1 ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20" :
                  "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`} {c.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        c.status === "Shortlisted" ? "bg-green-100 text-green-700" :
                        c.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{c.status}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${
                        c.score >= 70 ? "text-green-600" : c.score >= 40 ? "text-yellow-600" : "text-red-500"
                      }`}>{c.score}%</span>
                      <p className="text-xs text-gray-400">Match Score</p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        c.score >= 70 ? "bg-green-500" : c.score >= 40 ? "bg-yellow-500" : "bg-red-400"
                      }`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>

                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
                      <p className="text-gray-500">Skills</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{c.skillScore}/40</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
                      <p className="text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{c.expScore}/30 — {c.expNote}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
                      <p className="text-gray-500">Location</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{c.locationScore}/15 — {c.locationNote}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
                      <p className="text-gray-500">CTC</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{c.ctcScore}/15 — {c.ctcNote}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  {c.matchedSkills.length > 0 && (
                    <div className="mb-1">
                      <span className="text-xs text-green-600 font-semibold">✅ Matched: </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{c.matchedSkills.join(", ")}</span>
                    </div>
                  )}
                  {c.missingSkills.length > 0 && (
                    <div>
                      <span className="text-xs text-red-500 font-semibold">❌ Missing: </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{c.missingSkills.join(", ")}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={() => setShowAIModal(false)} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllApplicantsList;