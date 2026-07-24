import { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { COMPANY_API_END_POINT, SOURCING_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { decreaseCandidateCredits, decreaseAiSourcingCredits } from "@/redux/companySlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Brain, Zap, X, Database, Github, Lock } from "lucide-react";

const UNLOCKED_CANDIDATES_KEY = "unlockedCandidateIds";
const getUnlockedCandidates = () => {
  try { return new Set(JSON.parse(localStorage.getItem(UNLOCKED_CANDIDATES_KEY) || "[]")); }
  catch { return new Set(); }
};
const persistUnlockedCandidate = (id) => {
  try {
    const ids = getUnlockedCandidates();
    ids.add(id);
    localStorage.setItem(UNLOCKED_CANDIDATES_KEY, JSON.stringify([...ids]));
  } catch {}
};

const ITEMS_PER_PAGE = 10;

// The 3 top-level sections
const SECTIONS = {
  DATABASE: "database",   // existing candidate-list flow
  FREE: "free",            // GitHub-based, no credits used
  PAID: "paid",             // RecruitKar collab, uses AI Sourcing Credits
};

// Local, UI-only pipeline stage — not persisted server-side
const STAGE_OPTIONS = [
  { value: "New", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" },
  { value: "Contacted", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { value: "Shortlisted", cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  { value: "Rejected", cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
];

const parseExperienceYears = (raw) => {
  const match = raw ? String(raw).match(/[\d.]+/) : null;
  return match ? parseFloat(match[0]) : null;
};

// Normalize a Candidate Database (User model) record into the same row shape
// used by Sourcing results, so both can share one table renderer.
const normalizeDbCandidate = (c) => {
  const exp = c?.profile?.experiences?.[0];
  const qualification = c?.profile?.qualification === "Others" ? c?.profile?.otherQualification : c?.profile?.qualification;
  return {
    _id: c._id,
    fullName: c.fullname,
    designation: exp?.jobProfile || "",
    currentCompany: exp?.companyName || "",
    location: [c.address?.city, c.address?.state].filter(Boolean).join(", "),
    skills: c.profile?.skills || [],
    totalExperience: parseExperienceYears(exp?.duration),
    educationText: [qualification, c.collegeName].filter(Boolean).join(" · "),
    profilePhoto: c.profile?.profilePhoto && !c.profile.profilePhoto.includes("github.com") ? c.profile.profilePhoto : "",
    matchScore: c.matchScore ?? null,
    emails: [],
    linkedinUrl: "",
    raw: c,
  };
};

const CandidateList = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.DATABASE);

  // ---------- Candidate Database state ----------
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unlockedCandidates, setUnlockedCandidates] = useState(getUnlockedCandidates);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    jobTitle: "",
    experience: "",
    salaryBudget: "",
    gender: "",
    qualification: "",
    lastActive: "",
    location: "",
    skills: "",
    designation: "",
    minExp: "",
    maxExp: "",
    jobDescription: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showCandidates, setShowCandidates] = useState(false);
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("Find great talent for your team");
  const [dbSearchMode, setDbSearchMode] = useState(undefined);

  // Local pipeline-stage UI state, shared across all 3 result tables (keyed by "<section>:<id>")
  const [stageMap, setStageMap] = useState({});
  const setCandidateStage = (key, value) => setStageMap((prev) => ({ ...prev, [key]: value }));

  // ---------- Shared sourcing state (used by both Free + Paid) ----------
  const [sourcingFilters, setSourcingFilters] = useState({ skills: "", location: "", designation: "", minExp: "", maxExp: "", searchCount: "", jobDescription: "" });
  const [sourcingLoading, setSourcingLoading] = useState(false);
  const [sourcingCandidates, setSourcingCandidates] = useState([]);
  const [sourcingMode, setSourcingMode] = useState("keyword");
  const [selectedSourcingCandidate, setSelectedSourcingCandidate] = useState(null);
  const [showSourcingModal, setShowSourcingModal] = useState(false);
  const [savedSourcedCandidates, setSavedSourcedCandidates] = useState([]);
  const [savedSourcedLoading, setSavedSourcedLoading] = useState(false);
  const [savedSourcedFilter, setSavedSourcedFilter] = useState("");
  const [savedSourcedContactLoadingId, setSavedSourcedContactLoadingId] = useState(null);

  // 3-day trial unlocks general starter-plan limits (filters, location search,
  // etc.) but NEVER AI Sourcing — that stays gated on the real `hasSubscription`
  // flag via `aiSourcingLocked` below, independent of the trial.
  const isTrialLive = !!(
    company?.trialActive &&
    company?.trialExpiresAt &&
    new Date(company.trialExpiresAt) > new Date()
  );
  const planType = isTrialLive ? "ENTERPRISE" : (company?.plan || "FREE");
  const isStarterPlan = !company?.hasSubscription && !isTrialLive && planType === "FREE";
  const hasAdvancedFilters = !isStarterPlan;
  const hasLocationFilter = ["STANDARD", "PREMIUM", "PRO", "ENTERPRISE"].includes(planType);
  const aiSourcingLocked = !company?.hasSubscription;
  const aiSourcingBalance = company?.aiSourcingCredits ?? 0;

  const loadSavedSourcedCandidates = useCallback(async (designation = savedSourcedFilter) => {
    if (!company?._id) return;
    setSavedSourcedLoading(true);
    try {
      const { data } = await axios.get(`${SOURCING_API_END_POINT}/saved-sourced`, {
        params: { designation: designation || undefined },
        withCredentials: true,
      });
      if (data.success) setSavedSourcedCandidates(data.candidates || []);
    } catch (err) {
      console.error("Failed to load saved sourced candidates", err);
    } finally {
      setSavedSourcedLoading(false);
    }
  }, [company?._id, savedSourcedFilter]);

  useEffect(() => {
    loadSavedSourcedCandidates();
  }, [loadSavedSourcedCandidates]);

  // Reset sourcing results whenever the user switches sections/tabs
  const switchSection = (section) => {
    if (section !== SECTIONS.DATABASE && aiSourcingLocked) {
      toast.error("AI Sourcing is available on paid plans only. Upgrade to unlock it.");
      navigate("/packages");
      return;
    }
    setActiveSection(section);
    setSourcingCandidates([]);
    setSourcingFilters({ skills: "", location: "", designation: "", minExp: "", maxExp: "", searchCount: "", jobDescription: "" });
  };

  // ---------- Candidate Database logic ----------
  const fetchCandidates = async () => {
    try {
      setIsLoading(true);

      const sanitizedFilters = {
        companyId: company?._id,
        ...(filters.jobTitle && { jobTitle: filters.jobTitle }),
        ...(filters.experience && { experience: Number(filters.experience) }),
        ...(filters.salaryBudget && { salaryBudget: Number(filters.salaryBudget) }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.qualification && { qualification: filters.qualification }),
        ...(filters.lastActive && { lastActive: filters.lastActive }),
        ...(filters.location && { location: filters.location }),
        ...(filters.skills && { skills: filters.skills.split(",").map((skill) => skill.trim()) }),
        ...(filters.designation && { designation: filters.designation }),
        ...(filters.minExp && { minExp: Number(filters.minExp) }),
        ...(filters.maxExp && { maxExp: Number(filters.maxExp) }),
        ...(filters.jobDescription && { jobDescription: filters.jobDescription }),
      };

      const response = await axios.post(
        `${COMPANY_API_END_POINT}/candidate-list`,
        sanitizedFilters,
        { withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.candidates.length === 0) setMessage("No Candidate found");
        setCandidates(response.data.candidates.slice(0, 1000));
        setDbSearchMode(response.data.mode);
        setCurrentPage(1);
        setShowCandidates(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching candidates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInformation = useCallback(async (candidate) => {
    if (unlockedCandidates.has(candidate._id)) {
      navigate(`/recruiter/dashboard/candidate-information/${candidate._id}`);
      return;
    }

    if (company?.creditedForCandidates <= 0) {
      toast.error("Insufficient credits. Please purchase a plan.");
      navigate("/recruiter/dashboard/your-plans");
      return;
    }

    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/deduct-candidate-credit`,
        { companyId: company?._id },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(decreaseCandidateCredits(1));
        persistUnlockedCandidate(candidate._id);
        setUnlockedCandidates(new Set(getUnlockedCandidates()));
        toast.success(`1 credit deducted. ${res.data.remainingCredits} remaining.`);
        navigate(`/recruiter/dashboard/candidate-information/${candidate._id}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to view candidate information");
    }
  }, [company, dispatch, navigate, unlockedCandidates]);

  const totalPages = useMemo(() => Math.ceil(candidates.length / ITEMS_PER_PAGE), [candidates.length]);
  const currentCandidates = useMemo(() => candidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ), [candidates, currentPage]);

  const filterFields = useMemo(() => [
    { label: "Job Title", name: "jobTitle", placeholder: "Frontend Developer" },
    { label: "Designation", name: "designation", placeholder: "e.g. Senior Developer" },
    { label: "Gender", name: "gender", type: "select", options: ["", "Male", "Female", "Other"] },
    { label: "Skills", name: "skills", placeholder: "React, Node.js" },
    { label: "Experience", name: "experience", placeholder: "e.g. 1,2,3", advanced: true },
    { label: "Min Experience (yrs)", name: "minExp", type: "number", placeholder: "0" },
    { label: "Max Experience (yrs)", name: "maxExp", type: "number", placeholder: "10" },
    { label: "Qualification", name: "qualification", type: "select", options: ["", "Post Graduation", "Under Graduation", "B.Tech", "Diploma", "MBA", "Others"], advanced: true },
    { label: "Last Active", name: "lastActive", placeholder: "Days e.g. 3", advanced: true },
    { label: "Location", name: "location", placeholder: "Bangalore", locationFilter: true },
    { label: "Expected CTC", name: "salaryBudget", placeholder: "50000", advanced: true }
  ].filter(f => (!f.advanced || hasAdvancedFilters) && (!f.locationFilter || hasLocationFilter)),
  [hasAdvancedFilters, hasLocationFilter]);

  // ---------- Sourcing (Free) — GitHub based, local AI, no credits ----------
  const handleFreeSourcingSearch = async () => {
    if (!company?._id) return toast.error("Please complete your company profile first.");

    setSourcingLoading(true);
    setSourcingCandidates([]);

    try {
      const payload = {
        skills: sourcingFilters.skills || undefined,
        location: sourcingFilters.location || undefined,
        designation: sourcingFilters.designation || undefined,
        minExp: sourcingFilters.minExp ? parseInt(sourcingFilters.minExp) : undefined,
        maxExp: sourcingFilters.maxExp ? parseInt(sourcingFilters.maxExp) : undefined,
        jobDescription: sourcingFilters.jobDescription || undefined,
      };

      const { data } = await axios.post(`${SOURCING_API_END_POINT}/source-by-jd`, payload, { withCredentials: true });
      if (data.success) {
        setSourcingCandidates(data.candidates || []);
        setSourcingMode(data.mode || "github");
        toast.success(`${(data.candidates || []).length} candidate(s) found on GitHub.`);
        await loadSavedSourcedCandidates(sourcingFilters.designation || savedSourcedFilter);
      } else {
        toast.error(data.message || "No candidates found.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "GitHub sourcing failed.");
    } finally {
      setSourcingLoading(false);
    }
  };

  // ---------- Sourcing (Paid) — RecruitKar collab, uses AI Sourcing Credits ----------
  const handlePaidSourcingSearch = async () => {
    if (!company?._id) return toast.error("Please complete your company profile first.");

    const requestedSearchCount = Number.parseInt(sourcingFilters.searchCount, 10);
    const normalizedSearchCount = Number.isFinite(requestedSearchCount) && requestedSearchCount > 0
      ? Math.min(requestedSearchCount, 100)
      : 1;

    if (aiSourcingBalance < normalizedSearchCount) {
      toast.error(`Insufficient AI sourcing credits. You need ${normalizedSearchCount} credits for this search.`);
      navigate("/recruiter/dashboard/packages");
      return;
    }

    setSourcingLoading(true);
    setSourcingCandidates([]);

    try {
      const payload = {
        skills: sourcingFilters.skills || undefined,
        location: sourcingFilters.location || undefined,
        designation: sourcingFilters.designation || undefined,
        minExp: sourcingFilters.minExp ? parseInt(sourcingFilters.minExp) : undefined,
        maxExp: sourcingFilters.maxExp ? parseInt(sourcingFilters.maxExp) : undefined,
        searchCount: normalizedSearchCount,
        jobDescription: sourcingFilters.jobDescription || undefined,
      };

      const { data } = await axios.post(`${SOURCING_API_END_POINT}/recruitkar-search`, payload, { withCredentials: true });
      if (data.success) {
        const deductRes = await axios.post(
          `${COMPANY_API_END_POINT}/deduct-ai-sourcing-credit`,
          { companyId: company._id, amount: normalizedSearchCount },
          { withCredentials: true }
        );
        if (deductRes.data.success) {
          dispatch(decreaseAiSourcingCredits(normalizedSearchCount));
          toast.success(`${normalizedSearchCount} AI sourcing credit${normalizedSearchCount > 1 ? "s" : ""} used. ${deductRes.data.remainingCredits} remaining.`);
        }
        setSourcingCandidates(data.candidates || []);
        setSourcingMode(data.mode || data.source || "filter_matched");
        await loadSavedSourcedCandidates(sourcingFilters.designation || savedSourcedFilter);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed.");
    } finally {
      setSourcingLoading(false);
    }
  };

  const handleSavedSourcedContact = async (candidate) => {
    if (!company?._id) return toast.error("Please complete your company profile first.");
    if (!candidate?.linkedinUrl) return toast.error("LinkedIn profile is not available for this candidate.");

    if ((candidate.emails?.length || 0) > 0 || (candidate.phones?.length || 0) > 0) {
      toast.success("Contact details are already available for this candidate.");
      return;
    }

    if (aiSourcingBalance < 3) {
      toast.error("Insufficient AI sourcing credits. You need 3 credits to fetch contact details.");
      navigate("/recruiter/dashboard/packages");
      return;
    }

    setSavedSourcedContactLoadingId(candidate._id);
    try {
      const { data } = await axios.post(
        `${SOURCING_API_END_POINT}/recruitkar-contact`,
        { linkedin_url: candidate.linkedinUrl, profile: candidate },
        { withCredentials: true }
      );

      if (data.success) {
        const deductRes = await axios.post(
          `${COMPANY_API_END_POINT}/deduct-ai-sourcing-credit`,
          { companyId: company._id, amount: 3 },
          { withCredentials: true }
        );

        if (deductRes.data.success) {
          dispatch(decreaseAiSourcingCredits(3));
          toast.success(`Contact details fetched. 3 AI sourcing credits used. ${deductRes.data.remainingCredits} remaining.`);
        } else {
          toast.error(deductRes.data.message || "Unable to deduct credits.");
          return;
        }

        setSavedSourcedCandidates((prev) =>
          prev.map((item) => item._id === candidate._id ? { ...item, emails: data.emails || [], phones: data.phones || [] } : item)
        );
      } else {
        toast.error("No contact found for this candidate.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch contact details.");
    } finally {
      setSavedSourcedContactLoadingId(null);
    }
  };

  // ---------- Shared candidate results table (used by Database, Free & Paid sections) ----------
  const renderCandidateTable = (list, { accentColor = "purple", mode, onRowClick, tagFor, sectionKey }) => {
    const accentText = accentColor === "green" ? "text-green-600 dark:text-green-400" : accentColor === "blue" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400";
    return (
      <div className="mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {list.length} candidate{list.length !== 1 ? "s" : ""} found
          {mode === "jd_matched" && <span className="ml-2 text-green-600 dark:text-green-400 font-medium">· JD matched &amp; ranked</span>}
          {(mode === "filter_matched" || mode === "recruitkar") && <span className={`ml-2 ${accentText} font-medium`}>· AI matched results</span>}
          {mode === "github" && <span className="ml-2 text-gray-600 dark:text-gray-400 font-medium">· sourced from GitHub</span>}
        </p>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <tr>
                <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded" /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Candidate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Candidate Details</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Stage</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {list.map((c, idx) => {
                const score = c.matchScore ?? null;
                const scoreLabel = score == null ? null : score >= 70 ? "Strong" : score >= 40 ? "Good" : "Fair";
                const scoreLabelCls = score == null ? "" : score >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : score >= 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" : "bg-gray-100 text-gray-500";
                const scoreCircleCls = score == null ? "bg-gray-100 text-gray-500" : score >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : score >= 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" : "bg-gray-100 text-gray-500";
                const bgColors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"];
                const avatarBg = bgColors[idx % bgColors.length];
                const initials = c.fullName?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
                const subtitle = [c.designation, c.currentCompany].filter(Boolean).join(" at ");
                const expText = c.totalExperience > 0 ? `${c.totalExperience}y` : null;
                const tag = tagFor ? tagFor(c) : { label: "Discovered", cls: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" };
                const stageKey = `${sectionKey}:${c._id || c.githubUrl || idx}`;
                const currentStage = stageMap[stageKey] || "New";
                const stageCfg = STAGE_OPTIONS.find((s) => s.value === currentStage) || STAGE_OPTIONS[0];

                return (
                  <tr
                    key={c._id || c.githubUrl || idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    onClick={() => onRowClick?.(c)}
                  >
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded" />
                    </td>

                    <td className="px-4 py-4 min-w-[200px]">
                      <div className="flex items-start gap-3">
                        {c.profilePhoto ? (
                          <img src={c.profilePhoto} alt={c.fullName} className={`h-10 w-10 rounded-full object-cover shrink-0`} onError={e => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className={`h-10 w-10 rounded-full ${avatarBg} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">{c.fullName}</span>
                            {scoreLabel && (
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${scoreLabelCls}`}>{scoreLabel}</span>
                            )}
                          </div>
                          {tag && <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${tag.cls}`}>{tag.label}</span>}
                          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[180px]">{subtitle}{expText ? ` · ${expText}` : ""}</p>}
                          {c.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {c.skills.slice(0, 3).map((s, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{s}</span>
                              ))}
                              {c.skills.length > 3 && <span className="text-[10px] text-gray-400">+{c.skills.length - 3}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 hidden md:table-cell min-w-[260px]">
                      <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                        {(c.designation || c.currentCompany) && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">💼</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wide mr-1">Experience</span>
                            <span className="truncate max-w-[200px]">{[c.designation, c.currentCompany].filter(Boolean).join(" · ")}</span>
                          </div>
                        )}
                        {c.educationText && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">🎓</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wide mr-1">Education</span>
                            <span className="truncate max-w-[200px]">{c.educationText}</span>
                          </div>
                        )}
                        {c.location && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">📍</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-wide mr-1">Location</span>
                            <span>{c.location}</span>
                          </div>
                        )}
                        {c.emails?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">✉️</span>
                            <a href={`mailto:${c.emails[0]}`} className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px]" onClick={e => e.stopPropagation()}>{c.emails[0]}</a>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                      <select
                        value={currentStage}
                        onChange={(e) => setCandidateStage(stageKey, e.target.value)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${stageCfg.cls}`}
                      >
                        {STAGE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.value}</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                      {score != null ? (
                        <span className={`inline-flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm ${scoreCircleCls}`}>{score}</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ---------- Shared sourcing filter inputs row ----------
  const renderSourcingInputsRow = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
      <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Skills (e.g. React, Node.js)" value={sourcingFilters.skills} onChange={(e) => setSourcingFilters(prev => ({ ...prev, skills: e.target.value }))} />
      <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Location" value={sourcingFilters.location} onChange={(e) => setSourcingFilters(prev => ({ ...prev, location: e.target.value }))} />
      <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Designation" value={sourcingFilters.designation} onChange={(e) => setSourcingFilters(prev => ({ ...prev, designation: e.target.value }))} />
      <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Min Experience (yrs)" type="number" min="0" value={sourcingFilters.minExp} onChange={(e) => setSourcingFilters(prev => ({ ...prev, minExp: e.target.value }))} />
      <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Max Experience (yrs)" type="number" min="0" value={sourcingFilters.maxExp} onChange={(e) => setSourcingFilters(prev => ({ ...prev, maxExp: e.target.value }))} />
      {activeSection === SECTIONS.PAID && (
        <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Candidate Search Count" type="number" min="1" max="100" value={sourcingFilters.searchCount} onChange={(e) => setSourcingFilters(prev => ({ ...prev, searchCount: e.target.value }))} />
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          Find, Hire & Recruit Top Talent | Skilled Candidates Search - GreatHire
        </title>
        <meta
          name="description"
          content="The Candidates List page of GreatHire's website gives recruiters the power to search, filter, and manage the shortlisted candidates accurately. The website has been designed specifically for the fast-growing recruitment teams in Hyderabad State, as India's technical and recruitment hub, with the aim of facilitating effortless candidate search. The recruiters are able to filter the candidates on the basis of their skills, experience, location, expected salaries, and activity level, allowing companies to hire the best candidate. GreatHire provides enhanced candidate information with real-time analysis, credit-based access, and secure candidate data."
        />
      </Helmet>

      {company && user?.isActive ? (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 pb-20 bg-gray-100 dark:bg-gray-900 transition-colors">

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gray-300 dark:border-gray-700 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Find Candidates</h1>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Remaining Credits: <strong>{company?.creditedForCandidates}</strong>
              </p>
              <p className="text-sm rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-purple-700 dark:text-purple-300">
                Advance AI Sourcing: <strong>{aiSourcingBalance}</strong>
              </p>
              {company?.creditedForCandidates === 0 && (
                <Button onClick={() => navigate("/recruiter/dashboard/packages")}>
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>

          {/* Starter plan info banner */}
          {isStarterPlan && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <span className="font-semibold">Starter Plan:</span> You have <strong>{company?.creditedForCandidates ?? 5}</strong> candidate view credits. Upgrade to access more candidates and advanced filters.
                <button onClick={() => navigate("/packages")} className="ml-2 underline font-semibold">Upgrade Plan</button>
              </p>
            </div>
          )}

          {/* 3-way Section Toggle */}
          <div className="mt-6 flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-2">
            <button
              onClick={() => switchSection(SECTIONS.DATABASE)}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold text-sm transition-all ${
                activeSection === SECTIONS.DATABASE
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Database size={16} /> Internal Candidate Database
            </button>
            <button
              onClick={() => switchSection(SECTIONS.FREE)}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold text-sm transition-all ${
                activeSection === SECTIONS.FREE
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow"
                  : aiSourcingLocked
                  ? "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {aiSourcingLocked ? <Lock size={16} /> : <Github size={16} />} AI Sourcing (Unlimited)
            </button>
            <button
              onClick={() => switchSection(SECTIONS.PAID)}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold text-sm transition-all ${
                activeSection === SECTIONS.PAID
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                  : aiSourcingLocked
                  ? "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {aiSourcingLocked ? <Lock size={16} /> : <Zap size={16} />} Advance AI Sourcing
            </button>
          </div>

          {/* ================= SECTION 1: CANDIDATE DATABASE ================= */}
          {activeSection === SECTIONS.DATABASE && (
            <>
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filters</p>
                  {!hasAdvancedFilters && (
                    <button
                      onClick={() => navigate("/packages")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
                    >
                      🔒 Smart Filters available on paid plan & above
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filterFields.map((field, idx) => (
                    <div key={idx}>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                      {field.type === "select" ? (
                        <select
                          value={filters[field.name]}
                          onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                          className="w-full p-2.5 rounded-md border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700
                             text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt || `Select ${field.label}`}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          min={field.type === "number" ? 0 : undefined}
                          className="w-full p-2.5 rounded-md border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700
                                     text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={field.placeholder}
                          value={filters[field.name]}
                          onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Brain size={13} className="text-blue-500" /> Job Description <span className="text-gray-400 font-normal">(optional — ranks results by match score)</span>
                  </label>
                  {hasAdvancedFilters ? (
                    <textarea
                      className="w-full p-2.5 rounded-md border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Paste a job description to rank candidates by skill/title match…"
                      value={filters.jobDescription}
                      onChange={(e) => setFilters({ ...filters, jobDescription: e.target.value })}
                    />
                  ) : (
                    <button
                      onClick={() => navigate("/packages")}
                      className="w-full flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 px-3 py-2.5 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
                    >
                      🔒 JD-based ranking available on paid plan & above
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center rounded-xl overflow-hidden shadow-md w-full sm:w-auto">
                  <Button
                    onClick={fetchCandidates}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 rounded-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-5 disabled:opacity-60 disabled:cursor-not-allowed">
                    {isLoading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    {isLoading ? "Finding Candidates..." : "Find Candidates"}
                  </Button>
                  {showCandidates && (
                    <button
                      onClick={() => setShowCandidates(false)}
                      className="bg-indigo-700 hover:bg-red-600 text-white px-3 py-3 transition-colors"
                      title="Close Results"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {showCandidates && (
                <div className="mt-8">
                  {isLoading ? (
                    <p className="text-center text-xl">Loading...</p>
                  ) : currentCandidates.length === 0 ? (
                    <p className="text-center text-2xl text-gray-400">{message}</p>
                  ) : (
                    renderCandidateTable(currentCandidates.map(normalizeDbCandidate), {
                      accentColor: "blue",
                      mode: dbSearchMode,
                      sectionKey: "database",
                      onRowClick: (c) => handleViewInformation(c.raw),
                      tagFor: (c) => unlockedCandidates.has(c._id)
                        ? { label: "Unlocked", cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" }
                        : { label: "Locked", cls: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" },
                    })
                  )}

                  {candidates.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-4 justify-center items-center text-gray-700 dark:text-gray-300">
                      <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                        Previous
                      </Button>
                      <span>Page {currentPage} of {totalPages}</span>
                      <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ================= SECTION 2: SOURCING (FREE) — GitHub-based local AI ================= */}
          {activeSection === SECTIONS.FREE && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Github size={17} className="text-emerald-600" /> Search Sourced Candidates
                </h2>
              </div>

              {renderSourcingInputsRow()}

              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block flex items-center gap-1.5">
                  <Brain size={13} className="text-emerald-500" /> Job Description <span className="text-gray-400">(optional — AI will source from GitHub &amp; rank by match)</span>
                </label>
                <textarea
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={4}
                  placeholder="Paste job description here — AI will source candidates from GitHub and rank them by match score…"
                  value={sourcingFilters.jobDescription}
                  onChange={(e) => setSourcingFilters({ ...sourcingFilters, jobDescription: e.target.value })}
                />
                {sourcingFilters.jobDescription?.trim() && (
                  <div className="flex items-center gap-2 mt-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-400">
                    <Brain size={12} />
                    <span><span className="font-semibold">JD Sourcing active</span> — will source from GitHub &amp; rank by match score</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleFreeSourcingSearch} disabled={sourcingLoading} className="px-6 flex items-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700">
                  {sourcingLoading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sourcing...</> : <><Github size={14} /> Source Candidates</>}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setSourcingFilters({ skills: "", location: "", designation: "", minExp: "", maxExp: "", searchCount: "", jobDescription: "" }); setSourcingCandidates([]); }}>Clear</Button>
              </div>

              {sourcingCandidates.length > 0 && renderCandidateTable(sourcingCandidates, {
                accentColor: "green",
                mode: sourcingMode,
                sectionKey: "free",
                onRowClick: (c) => { setSelectedSourcingCandidate(c); setShowSourcingModal(true); },
              })}
            </div>
          )}

          {/* ================= SECTION 3: SOURCING (PAID) — RecruitKar collab ================= */}
          {activeSection === SECTIONS.PAID && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Search size={17} className="text-purple-600" /> Search Sourced Candidates
                </h2>
              </div>

              {renderSourcingInputsRow()}

              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block flex items-center gap-1.5">
                  <Brain size={13} className="text-purple-500" /> Job Description <span className="text-gray-400">(optional — AI will source &amp; rank by match)</span>
                </label>
                <textarea
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                  placeholder="Paste job description here — AI will source candidates and rank them by match score…"
                  value={sourcingFilters.jobDescription}
                  onChange={(e) => setSourcingFilters({ ...sourcingFilters, jobDescription: e.target.value })}
                />
                {sourcingFilters.jobDescription?.trim() && (
                  <div className="flex items-center gap-2 mt-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-400">
                    <Brain size={12} />
                    <span><span className="font-semibold">JD Sourcing active</span> — will source &amp; rank by match score</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={handlePaidSourcingSearch} disabled={sourcingLoading} className={`px-6 flex items-center gap-2 text-white ${sourcingFilters.jobDescription?.trim() ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}>
                  {sourcingLoading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sourcing...</> : sourcingFilters.jobDescription?.trim() ? <><Brain size={14} /> Source &amp; Match JD</> : <><Search size={14} /> Source Candidates</>}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setSourcingFilters({ skills: "", location: "", designation: "", minExp: "", maxExp: "", searchCount: "", jobDescription: "" }); setSourcingCandidates([]); }}>Clear</Button>
              </div>

              {sourcingCandidates.length > 0 && renderCandidateTable(sourcingCandidates, {
                accentColor: "purple",
                mode: sourcingMode,
                sectionKey: "paid",
                onRowClick: (c) => { setSelectedSourcingCandidate(c); setShowSourcingModal(true); },
              })}
            </div>
          )}

          {/* Sourcing Candidate Modal (shared by Free + Paid) */}
          {showSourcingModal && selectedSourcingCandidate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowSourcingModal(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Candidate Profile</h2>
                  <button onClick={() => setShowSourcingModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    {selectedSourcingCandidate.profilePhoto ? (
                      <img src={selectedSourcingCandidate.profilePhoto} alt={selectedSourcingCandidate.fullName}
                        className="h-20 w-20 rounded-full object-cover shrink-0 border-2 border-gray-200 dark:border-gray-600"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                        {selectedSourcingCandidate.fullName?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSourcingCandidate.fullName}</h3>
                      {selectedSourcingCandidate.designation && <p className="text-base text-gray-600 dark:text-gray-400 mt-0.5">{selectedSourcingCandidate.designation}{selectedSourcingCandidate.currentCompany ? ` · ${selectedSourcingCandidate.currentCompany}` : ""}</p>}
                      {selectedSourcingCandidate.location && <p className="text-sm text-gray-500 mt-0.5">📍 {selectedSourcingCandidate.location}</p>}
                      {selectedSourcingCandidate.totalExperience > 0 && <p className="text-sm text-gray-500 mt-0.5">📅 {selectedSourcingCandidate.totalExperience} years experience</p>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase">Discovered</span>
                        {selectedSourcingCandidate.matchScore != null && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            selectedSourcingCandidate.matchScore >= 70 ? "bg-green-100 text-green-700" :
                            selectedSourcingCandidate.matchScore >= 40 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                          }`}>
                            {selectedSourcingCandidate.matchScore >= 70 ? "Strong" : selectedSourcingCandidate.matchScore >= 40 ? "Good" : "Fair"}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedSourcingCandidate.matchScore != null && (
                      <div className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                        selectedSourcingCandidate.matchScore >= 70 ? "bg-green-100 text-green-700" :
                        selectedSourcingCandidate.matchScore >= 40 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                      }`}>{selectedSourcingCandidate.matchScore}</div>
                    )}
                  </div>

                  {selectedSourcingCandidate.skills?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSourcingCandidate.skills.map((s, i) => (
                          <Badge key={i} className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSourcingCandidate.pastExperience?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Experience</h4>
                      <div className="space-y-3">
                        {[...(selectedSourcingCandidate.designation ? [{ title: selectedSourcingCandidate.designation, company: selectedSourcingCandidate.currentCompany, is_current: true }] : []), ...selectedSourcingCandidate.pastExperience].slice(0, 4).map((exp, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5 text-sm">💼</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{exp.title}</p>
                              <p className="text-xs text-gray-500">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                              {(exp.start_date || exp.end_date) && (
                                <p className="text-xs text-gray-400">
                                  {exp.start_date ? new Date(exp.start_date).getFullYear() : ""}
                                  {exp.end_date ? ` – ${new Date(exp.end_date).getFullYear()}` : exp.is_current ? " – Present" : ""}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSourcingCandidate.allEducation?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Education</h4>
                      <div className="space-y-2">
                        {selectedSourcingCandidate.allEducation.map((edu, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5 text-sm">🎓</span>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{[edu.degree, edu.field_of_study].filter(Boolean).join(" · ") || edu.institution}</p>
                              <p className="text-xs text-gray-500">{edu.institution}{edu.end_date ? ` · ${edu.end_date}` : ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSourcingCandidate.emails?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Contact</h4>
                      {selectedSourcingCandidate.emails.map((e, i) => <a key={i} href={`mailto:${e}`} className="block text-sm text-blue-600 hover:underline">{e}</a>)}
                      {selectedSourcingCandidate.phones?.map((p, i) => <a key={i} href={`tel:${p}`} className="block text-sm text-blue-600 hover:underline mt-1">{p}</a>)}
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    {selectedSourcingCandidate.linkedinUrl && (
                      <Button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white" onClick={() => window.open(selectedSourcingCandidate.linkedinUrl, "_blank")}>
                        💼 LinkedIn Profile
                      </Button>
                    )}
                    {activeSection === SECTIONS.PAID && selectedSourcingCandidate.linkedinUrl && selectedSourcingCandidate.emails?.length === 0 && (
                      <Button
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={async () => {
                          try {
                            const { data } = await axios.post(`${SOURCING_API_END_POINT}/recruitkar-contact`,
                              { linkedin_url: selectedSourcingCandidate.linkedinUrl, profile: selectedSourcingCandidate },
                              { withCredentials: true }
                            );
                            if (data.success) {
                              const deductRes = await axios.post(
                                `${COMPANY_API_END_POINT}/deduct-ai-sourcing-credit`,
                                { companyId: company?._id, amount: 3 },
                                { withCredentials: true }
                              );
                              if (deductRes.data.success) {
                                dispatch(decreaseAiSourcingCredits(3));
                                toast.success(`Contact details fetched. 3 AI sourcing credits used. ${deductRes.data.remainingCredits} remaining.`);
                              } else {
                                toast.error(deductRes.data.message || "Unable to deduct credits.");
                                return;
                              }
                              setSelectedSourcingCandidate(prev => ({ ...prev, emails: data.emails, phones: data.phones }));
                              setSourcingCandidates(prev => prev.map(c => c._id === selectedSourcingCandidate._id ? { ...c, emails: data.emails, phones: data.phones } : c));
                            } else toast.error("No contact found.");
                          } catch (err) {
                            toast.error(err.response?.data?.message || "Failed to fetch contact.");
                          }
                        }}
                      >
                        📧 Get Contact (3 credits)
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="h-screen flex items-center justify-center text-3xl text-gray-400">
          {company ? "Your company is being verified" : "Company not created"}
        </p>
      )}
    </>
  );
};

export default CandidateList;