import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCandidateCredits } from "@/redux/companySlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { COMPANY_API_END_POINT, APPLICATION_API_END_POINT, EMAIL_API_END_POINT, JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { FiUsers, FiTrash2 } from "react-icons/fi";
import { X } from "lucide-react";
import ApplicantDetails from "./ApplicantDetails";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

const ALL_STATUSES = ["Pending", "Interview Schedule", "Shortlisted", "Rejected"];

// Module-level cache — survives component remounts, keyed by companyId
let _cacheCompanyId = localStorage.getItem("gh_cacheCompanyId") || null;
let _cachedApplicants = [];
let _cachedScoreMap = JSON.parse(localStorage.getItem("gh_scoreMap") || "{}");
let _cachedSortedIds = JSON.parse(localStorage.getItem("gh_sortedIds") || "[]");
let _unlockedIds = new Set(JSON.parse(localStorage.getItem(`gh_unlockedIds_${localStorage.getItem("gh_cacheCompanyId")}`) || "[]"));

const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
];

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M8 1a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

function Tag({ children, primary }) {
  return (
    <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium ${
      primary ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
    }`}>{children}</span>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest min-w-[88px] pt-0.5 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1.5 flex-1">{children}</div>
    </div>
  );
}

const AllApplicantsList = () => {
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const companyId = company?._id;

  const [applicants, setApplicants] = useState(_cachedApplicants);
  const [filteredApplicants, setFilteredApplicants] = useState(_cachedApplicants);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedJob, setSelectedJob] = useState("All");
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [applicantDetailsModal, setApplicantDetailsModal] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [applicantId, setApplicantId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyId) return;
    // Clear cache if different company
    if (_cacheCompanyId && _cacheCompanyId !== companyId) {
      _cachedApplicants = [];
      _cachedScoreMap = {};
      _cachedSortedIds = [];
      _unlockedIds = new Set();
      localStorage.removeItem("gh_scoreMap");
      localStorage.removeItem("gh_sortedIds");
      localStorage.removeItem("gh_cacheCompanyId");
      _unlockedIds = new Set();
      setUnlockedIds(new Set());
      setApplicants([]);
      setFilteredApplicants([]);
      setScoreMap({});
      setSortedIdsCount(0);
      setUnlockedIds(new Set());
    }
    _cacheCompanyId = companyId;
    localStorage.setItem("gh_cacheCompanyId", companyId);
    fetchApplicants();
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;
    axios.get(`${JOB_API_END_POINT}/jobs-list/${companyId}`, { withCredentials: true })
      .then(res => { if (res.data.success) setJobsList(res.data.jobs || []); })
      .catch(() => {});
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
        _cachedApplicants = validApplicants;
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

    if (selectedJob !== "All") {
      filtered = filtered.filter((app) => app.job?.jobDetails?.title === selectedJob);
    }

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
  }, [selectedStatus, selectedJob, searchTerm, applicants]);

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
  const hasAIAccess = ["PREMIUM", "PRO", "ENTERPRISE"].includes(company?.plan);
  const STARTER_LIMIT = 20;

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiJobTitle, setAiJobTitle] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState(() => new Set(JSON.parse(localStorage.getItem(`gh_unlockedIds_${localStorage.getItem("gh_cacheCompanyId")}`) || "[]")));
  const [scoreMap, setScoreMap] = useState(() => JSON.parse(localStorage.getItem("gh_scoreMap") || "{}"));
  const [sortedIdsCount, setSortedIdsCount] = useState(() => JSON.parse(localStorage.getItem("gh_sortedIds") || "[]").length);

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
        // Build scoreMap: { applicationId: score }
        const map = {};
        res.data.results.forEach(r => { if (r.applicationId) map[r.applicationId] = r.score; });
        _cachedScoreMap = map;
        localStorage.setItem("gh_scoreMap", JSON.stringify(map));
        _cachedSortedIds = res.data.results.map(r => r.applicationId).filter(Boolean);
        localStorage.setItem("gh_sortedIds", JSON.stringify(_cachedSortedIds));
        setSortedIdsCount(_cachedSortedIds.length);
        setScoreMap(map);
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
  const sortedApplicants = _cachedSortedIds.length > 0
    ? [
        ..._cachedSortedIds.map(id => visibleApplicants.find(a => a._id === id)).filter(Boolean),
        ...visibleApplicants.filter(a => !_cachedSortedIds.includes(a._id))
      ]
    : visibleApplicants;
  const finalApplicants = [
    ...sortedApplicants.filter(a => a.status !== "Rejected"),
    ...sortedApplicants.filter(a => a.status === "Rejected"),
  ];
  const currentApplicants = finalApplicants.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {company && user?.isActive ? (
        !applicantDetailsModal ? (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-12 pt-6">
            <div className="bg-transparent">

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
                  {sortedIdsCount > 0 && applicants.length > sortedIdsCount ? (
                    <span className="text-sm font-semibold bg-orange-100 text-orange-600 border border-orange-300 px-3 py-2 rounded-full animate-pulse">
                      +{applicants.length - sortedIdsCount} new applicants
                    </span>
                  ) : (
                    <span className="text-sm font-semibold bg-green-50 text-green-600 border border-green-200 px-3 py-2 rounded-full">
                      {sortedIdsCount > 0 ? "Up to date" : "Not analyzed yet"}
                    </span>
                  )}
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Credits: {company?.creditedForCandidates ?? 0}
                  </span>
                  {applicants.length > 0 && (
                    <select
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                      className="text-sm border border-gray-200 dark:border-gray-600 rounded-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none"
                    >
                      <option value="All">All Jobs</option>
                      {jobsList.map((job) => (
                        <option key={job._id} value={job.jobDetails?.title}>{job.jobDetails?.title}</option>
                      ))}
                    </select>
                  )}
                  {applicants.length > 0 && (
                    hasAIAccess ? (
                      <Button
                        onClick={handleAnalyzeCandidates}
                        disabled={aiLoading}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow"
                      >
                        🤖 {aiLoading ? "Analyzing..." : "Analyze Best Candidates"}
                      </Button>
                    ) : (
                      <button
                        onClick={() => navigate("/packages")}
                        className="flex items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow"
                      >
                        🔒 Unlock AI Candidate Analyzer
                      </button>
                    )
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

              {/* Cards */}
              <div className="space-y-3">
                {currentApplicants.map((app, idx) => {
                  const p = app.applicant?.profile || {};
                  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const initials = (app.applicant?.fullname || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  const skills = Array.isArray(p.skills)
                    ? p.skills.flatMap(s => s.split(',').map(x => x.trim())).filter(Boolean)
                    : [];
                  const languages = Array.isArray(p.language) ? p.language : [];
                  const documents = Array.isArray(p.documents) ? p.documents.filter(d => d !== "None of these") : [];
                  const categories = Array.isArray(p.category) ? p.category : [];
                  const experiences = Array.isArray(p.experiences) && p.experiences.length > 0
                    ? p.experiences
                    : p.experience && p.experience.jobProfile
                    ? [p.experience]
                    : [];
                  const expText = experiences.length > 0
                    ? `${experiences[0].duration || ""} ${experiences[0].duration ? "yr(s)" : ""} experience as ${experiences[0].jobProfile || ""}`
                    : "Fresher";
                  const location = [app.applicant?.address?.city, app.applicant?.address?.state].filter(Boolean).join(", ") || "—";
                  const score = scoreMap[app._id];

                  return (
                    <div key={app._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-5 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-700 transition-all duration-200">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${color.bg} ${color.text}`}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[15px] font-semibold text-gray-900 dark:text-white leading-tight">{app.applicant?.fullname || "—"}</p>
                            {score != null && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                score >= 70 ? "bg-green-100 text-green-700" : score >= 40 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"
                              }`}>🤖 {score}%</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><LocationIcon /> {location}</span>
                            {p.qualification && <span className="text-xs text-gray-500 dark:text-gray-400">{p.qualification}</span>}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              app.status === "Shortlisted" ? "bg-green-100 text-green-700" :
                              app.status === "Rejected" ? "bg-red-100 text-red-600" :
                              app.status === "Interview Schedule" ? "bg-purple-100 text-purple-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>{app.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Info rows */}
                      {skills.length > 0 && (
                        <Row label="Key Skills">
                          <Tag primary>{skills[0]}</Tag>
                          {skills.slice(1, 3).map(s => <Tag key={s}>{s}</Tag>)}
                          {skills.length > 3 && <span className="text-xs text-blue-500 cursor-pointer hover:underline py-0.5">+{skills.length - 3} more</span>}
                        </Row>
                      )}

                      <Row label="Experience">
                        <span className="text-[13px] text-gray-700 dark:text-gray-300">{expText}</span>
                      </Row>

                      {app.job?.jobDetails?.title && (
                        <Row label="Applied For">
                          <Tag>{app.job.jobDetails.title}</Tag>
                        </Row>
                      )}

                      {languages.length > 0 && (
                        <Row label="Languages">
                          {languages.map(l => <Tag key={l}>{l}</Tag>)}
                        </Row>
                      )}

                      {documents.length > 0 && (
                        <Row label="Documents">
                          {documents.map(d => <Tag key={d}>{d}</Tag>)}
                        </Row>
                      )}

                      {categories.length > 0 && (
                        <Row label="Categories">
                          {categories.slice(0, 3).map(c => <Tag key={c}>{c}</Tag>)}
                          {categories.length > 3 && <span className="text-xs text-blue-500 cursor-pointer hover:underline py-0.5">+{categories.length - 3} more</span>}
                        </Row>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex-wrap gap-2">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          disabled={app.status === "Rejected"}
                          className={`text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ${app.status === "Rejected" ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="flex items-center gap-2">
                          {unlockedIds.has(app._id) ? (
                            <button
                              onClick={() => { setApplicant(app); setApplicantId(app?._id); setJobId(app?.job?._id || app?.job); setApplicantDetailsModal(true); }}
                              className="text-sm font-medium px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-1"
                            >
                              👁 View
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                try {
                                  const res = await axios.post(
                                    `${COMPANY_API_END_POINT}/deduct-candidate-credit`,
                                    { companyId },
                                    { withCredentials: true }
                                  );
                                  if (res.data.success) {
                                    _unlockedIds.add(app._id);
                                    localStorage.setItem(`gh_unlockedIds_${companyId}`, JSON.stringify([..._unlockedIds]));
                                    setUnlockedIds(new Set(_unlockedIds));
                                    dispatch(updateCandidateCredits(res.data.remainingCredits));
                                    toast.success(`1 credit deducted. ${res.data.remainingCredits} remaining.`);
                                    setApplicant(app);
                                    setApplicantId(app?._id);
                                    setJobId(app?.job?._id || app?.job);
                                    setApplicantDetailsModal(true);
                                  }
                                } catch (err) {
                                  toast.error(err?.response?.data?.message || "Failed to unlock.");
                                }
                              }}
                              className="text-sm font-medium px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1"
                            >
                              🔓 Unlock
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/recruiter/dashboard/job-details/${app?.job?._id || app?.job}`)}
                            className="text-sm font-medium px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all"
                          >
                            📄 Job
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
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
