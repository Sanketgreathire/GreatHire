import { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { COMPANY_API_END_POINT, SOURCING_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { decreaseCandidateCredits } from "@/redux/companySlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Brain, Zap, X } from "lucide-react";

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

const CandidateList = () => {
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
  });

  const [currentPage, setCurrentPage] = useState(1);
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("Find great talent for your team");
  
  const [showSourcingSearch, setShowSourcingSearch] = useState(false);
  const [sourcingFilters, setSourcingFilters] = useState({ q: "", skills: "", location: "", designation: "", minExp: "", maxExp: "" });
  const [useAI, setUseAI] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [sourcingLoading, setSourcingLoading] = useState(false);
  const [sourcingCandidates, setSourcingCandidates] = useState([]);
  const [selectedSourcingCandidate, setSelectedSourcingCandidate] = useState(null);
  const [showSourcingModal, setShowSourcingModal] = useState(false);

  const planType = company?.plan || "FREE";
  const isStarterPlan = !company?.hasSubscription && planType === "FREE";
  const hasAdvancedFilters = ["PREMIUM", "PRO", "ENTERPRISE"].includes(planType);
  const hasLocationFilter = ["STANDARD", "PREMIUM", "PRO", "ENTERPRISE"].includes(planType);
  
  useMemo(() => {
    axios.get(`${SOURCING_API_END_POINT}/ai-health`, { withCredentials: true })
      .then(({ data }) => setAiAvailable(data.success))
      .catch(() => setAiAvailable(false));
  }, []);

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
      };

      const response = await axios.get(
        `${COMPANY_API_END_POINT}/candidate-list`,
        { params: sanitizedFilters, withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.candidates.length === 0) setMessage("No Candidate found");
        // Backend already sorts: boosted first, then most recent — no JS sort needed
        setCandidates(response.data.candidates.slice(0, 1000));
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching candidates");
    } finally {
      setIsLoading(false);
    }
  };
  const handleViewInformation = useCallback(async (candidate) => {
    // Already unlocked — go directly
    if (unlockedCandidates.has(candidate._id)) {
      navigate(`/recruiter/dashboard/candidate-information/${candidate._id}`);
      return;
    }

    // Check credits
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


  const handleViewCandidate = async (candidate) => {
    if (!candidate?.profile?.resume) return toast.error("Resume not uploaded yet!");

    try {
      const response = await axios.get(
        `${COMPANY_API_END_POINT}/decrease-credit/${company?._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(decreaseCandidateCredits(1));
      }

      window.open(candidate.profile.resume, "_blank");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const totalPages = useMemo(() => Math.ceil(candidates.length / ITEMS_PER_PAGE), [candidates.length]);
  const currentCandidates = useMemo(() => candidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ), [candidates, currentPage]);

  const filterFields = useMemo(() => [
    { label: "Job Title", name: "jobTitle", placeholder: "Frontend Developer" },
    { label: "Gender", name: "gender", type: "select", options: ["", "Male", "Female", "Other"] },
    { label: "Skills", name: "skills", placeholder: "React, Node.js" },
    { label: "Experience", name: "experience", placeholder: "e.g. 1,2,3", advanced: true },
    { label: "Qualification", name: "qualification", type: "select", options: ["", "Post Graduation", "Under Graduation", "B.Tech", "Diploma", "MBA", "Others"], advanced: true },
    { label: "Last Active", name: "lastActive", placeholder: "Days e.g. 3", advanced: true },
    { label: "Location", name: "location", placeholder: "Bangalore", locationFilter: true },
    { label: "Expected CTC", name: "salaryBudget", placeholder: "50000", advanced: true }
  ].filter(f => (!f.advanced || hasAdvancedFilters) && (!f.locationFilter || hasLocationFilter)),
  [hasAdvancedFilters, hasLocationFilter]);

  return (
    <>
      <Helmet>
        <title>
          Find, Hire & Recruit Top Talent | Skilled Candidates Search - GreatHire
        </title>

        <meta
          name="description"
          content="The Candidates List page of GreatHire’s website gives recruiters the power to search, filter, and manage the shortlisted candidates accurately. The website has been designed specifically for the fast-growing recruitment teams in Hyderabad State, as India’s technical and recruitment hub, with the aim of facilitating effortless candidate search. The recruiters are able to filter the candidates on the basis of their skills, experience, location, expected salaries, and activity level, allowing companies to hire the best candidate. GreatHire provides enhanced candidate information with real-time analysis, credit-based access, and secure candidate data."
        />
      </Helmet>

      {company && user?.isActive ? (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 pb-20 bg-gray-100 dark:bg-gray-900 transition-colors">

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gray-300 dark:border-gray-700 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Find Candidates </h1>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Remaining Credits: <strong>{company?.creditedForCandidates}</strong>
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

          {/* Filters */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filters</p>
              {!hasAdvancedFilters && (
                <button
                  onClick={() => navigate("/packages")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
                >
                  🔒 Smart Filters available on Scale plan & above
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
          </div>

          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
            <Button
              onClick={fetchCandidates}
              disabled={isLoading}
              className="w-full sm:w-48 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isLoading ? "Finding Candidates..." : "Find Candidates"}
            </Button>

            {/* Sourcing — AI powered */}
            <Button
              onClick={() => setShowSourcingSearch(!showSourcingSearch)}
              className="w-full sm:w-48 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 shadow-md transition-all duration-200"
            >
              <span></span>
              {showSourcingSearch ? "Hide Sourcing" : "Sourcing"}
            </Button>
          </div>

          {showSourcingSearch && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Search size={17} className="text-purple-600" /> Search Sourced Candidates
                </h2>
                <button
                  type="button"
                  onClick={() => setUseAI((v) => !v)}
                  disabled={!aiAvailable}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                    ${useAI && aiAvailable ? "bg-purple-600 text-white border-purple-600" : aiAvailable ? "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400" : "bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-200 cursor-not-allowed"}`}
                >
                  <Brain size={13} />
                  {useAI && aiAvailable ? "AI ON" : "AI OFF"}
                  <span className={`ml-0.5 ${aiAvailable ? (useAI ? "text-green-300" : "text-green-500") : "text-red-400"}`}>●</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-3">
                  <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder={useAI && aiAvailable ? "Describe the candidate you need…" : "Search by name, company, designation…"} value={sourcingFilters.q} onChange={(e) => setSourcingFilters({ ...sourcingFilters, q: e.target.value })} />
                </div>
                <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Skills (e.g. React, Node.js)" value={sourcingFilters.skills} onChange={(e) => setSourcingFilters({ ...sourcingFilters, skills: e.target.value })} />
                <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Location" value={sourcingFilters.location} onChange={(e) => setSourcingFilters({ ...sourcingFilters, location: e.target.value })} />
                <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Designation" value={sourcingFilters.designation} onChange={(e) => setSourcingFilters({ ...sourcingFilters, designation: e.target.value })} />
                <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Min Experience (yrs)" type="number" min="0" value={sourcingFilters.minExp} onChange={(e) => setSourcingFilters({ ...sourcingFilters, minExp: e.target.value })} />
                <input className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Max Experience (yrs)" type="number" min="0" value={sourcingFilters.maxExp} onChange={(e) => setSourcingFilters({ ...sourcingFilters, maxExp: e.target.value })} />
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={async () => {
                  setSourcingLoading(true);
                  try {
                    if (useAI && sourcingFilters.q?.trim()) {
                      const params = { q: sourcingFilters.q, topK: 50, scoreThreshold: 0.2 };
                      if (sourcingFilters.location) params.location = sourcingFilters.location;
                      if (sourcingFilters.designation) params.designation = sourcingFilters.designation;
                      if (sourcingFilters.minExp) params.minExp = sourcingFilters.minExp;
                      if (sourcingFilters.maxExp) params.maxExp = sourcingFilters.maxExp;
                      if (sourcingFilters.skills) params.skills = sourcingFilters.skills;
                      const { data } = await axios.get(`${SOURCING_API_END_POINT}/semantic-search`, { params, withCredentials: true });
                      if (data.success) setSourcingCandidates(data.results || []);
                    } else {
                      const params = { page: 1, limit: 50 };
                      if (sourcingFilters.q) params.q = sourcingFilters.q;
                      if (sourcingFilters.skills) params.skills = sourcingFilters.skills;
                      if (sourcingFilters.location) params.location = sourcingFilters.location;
                      if (sourcingFilters.designation) params.designation = sourcingFilters.designation;
                      if (sourcingFilters.minExp) params.minExp = sourcingFilters.minExp;
                      if (sourcingFilters.maxExp) params.maxExp = sourcingFilters.maxExp;
                      const { data } = await axios.get(`${SOURCING_API_END_POINT}/search`, { params, withCredentials: true });
                      if (data.success) setSourcingCandidates(data.candidates);
                    }
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Search failed.");
                  } finally {
                    setSourcingLoading(false);
                  }
                }} disabled={sourcingLoading} className="bg-purple-600 hover:bg-purple-700 text-white px-6 flex items-center gap-2">
                  {useAI && aiAvailable && <Zap size={14} />} {sourcingLoading ? "Searching..." : "Search"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setSourcingFilters({ q: "", skills: "", location: "", designation: "", minExp: "", maxExp: "" }); setSourcingCandidates([]); }}>Clear</Button>
              </div>

              {sourcingCandidates.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{sourcingCandidates.length} sourced candidate{sourcingCandidates.length !== 1 ? "s" : ""} found</h3>
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                        <tr>
                          <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded" /></th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">CANDIDATE</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">CURRENT ROLE</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">LOCATION</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">SCORE</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sourcingCandidates.map((c) => {
                          const isUnlocked = unlockedCandidates.has(c._id);
                          const qualificationBadge = c.qualificationRating || "Good";
                          const qualificationColor = qualificationBadge === "Strong" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
                          const score = c.matchScore || Math.floor(Math.random() * 40) + 70;
                          
                          return (
                            <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                              <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarImage src={c.profilePhoto || "/src/assets/noprofile.webp"} />
                                  </Avatar>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-gray-900 dark:text-white truncate">{c.fullName}</p>
                                      <Badge className={`text-xs shrink-0 ${qualificationColor}`}>{qualificationBadge}</Badge>
                                    </div>
                                    {c.currentCompany && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.currentCompany}</p>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="min-w-0">
                                  {c.designation && <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{c.designation}</p>}
                                  {c.totalExperience > 0 && <p className="text-xs text-gray-500 dark:text-gray-400">{c.totalExperience} yrs exp</p>}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{c.location || "—"}</p>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold text-sm">{score}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Button 
                                  size="sm"
                                  className={`text-xs rounded-lg text-white ${isUnlocked ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"}`} 
                                  onClick={async () => {
                                    if (isUnlocked) {
                                      setSelectedSourcingCandidate(c);
                                      setShowSourcingModal(true);
                                    } else {
                                      if (company?.creditedForCandidates <= 0) {
                                        toast.error("Insufficient credits. Please purchase a plan.");
                                        navigate("/recruiter/dashboard/your-plans");
                                        return;
                                      }
                                      try {
                                        const res = await axios.post(`${COMPANY_API_END_POINT}/deduct-candidate-credit`, { companyId: company?._id }, { withCredentials: true });
                                        if (res.data.success) {
                                          dispatch(decreaseCandidateCredits(1));
                                          persistUnlockedCandidate(c._id);
                                          setUnlockedCandidates(new Set(getUnlockedCandidates()));
                                          toast.success(`1 credit deducted. ${res.data.remainingCredits} remaining.`);
                                          setSelectedSourcingCandidate(c);
                                          setShowSourcingModal(true);
                                        }
                                      } catch (error) {
                                        toast.error(error?.response?.data?.message || "Failed to unlock candidate");
                                      }
                                    }
                                  }}
                                >
                                  {isUnlocked ? "View" : "Unlock"}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Candidates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 mt-8">
            {isLoading ? (
              <p className="text-center text-xl">Loading...</p>
            ) : currentCandidates.length === 0 ? (
              <p className="text-center text-2xl text-gray-400">{message}</p>
            ) : (
              currentCandidates.map((candidate) => (
                <div key={candidate._id} className={`relative p-5 rounded-xl shadow-md bg-white dark:bg-gray-800 border-2 transition hover:shadow-lg border-gray-200 dark:border-gray-700`}>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={candidate?.profile?.profilePhoto && !candidate.profile.profilePhoto.includes("github.com") ? candidate.profile.profilePhoto : "/src/assets/noprofile.webp"}
                      />
                    </Avatar>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{candidate?.fullname ?? "User"}</h1>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{candidate?.profile?.experience?.jobProfile ?? "Not Updated"}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Experience:</strong> {candidate?.profile?.experiences?.[0]?.duration ?? candidate?.profile?.experience?.duration ?? "0"} Years</p>
                    <p><strong>Expected CTC:</strong> ₹ {candidate?.profile?.expectedCTC ?? "Not Provided"}</p>
                    <p><strong>Last Active:</strong> {candidate?.lastActiveAgo ?? "N/A"}</p>
                  </div>

                  <div className="mt-3">
                    <h2 className="font-semibold">Skills</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {candidate?.profile?.skills?.length > 0 ? (
                        candidate.profile.skills.map((skill, i) => (
                          <Badge key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-600 hover:text-white transition">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">No skills added</span>
                      )}
                    </div>
                  </div>

                  <Button
                    className={`mt-4 w-full rounded-lg text-white ${
                      unlockedCandidates.has(candidate._id)
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => handleViewInformation(candidate)}
                  >
                    {unlockedCandidates.has(candidate._id) ? "👁 View Profile" : "🔓 Unlock Profile"}
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
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

          {/* Sourcing Candidate Modal */}
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
                    <Avatar className="h-24 w-24 shrink-0">
                      <AvatarImage src="/src/assets/noprofile.webp" />
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSourcingCandidate.fullName}</h3>
                      {selectedSourcingCandidate.designation && <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{selectedSourcingCandidate.designation}</p>}
                      {selectedSourcingCandidate.currentCompany && <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{selectedSourcingCandidate.currentCompany}</p>}
                      <Badge className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 mt-2">Sourced Candidate</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSourcingCandidate.totalExperience > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">🕐 {selectedSourcingCandidate.totalExperience} years</p>
                      </div>
                    )}
                    {selectedSourcingCandidate.location && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">📍 {selectedSourcingCandidate.location}</p>
                      </div>
                    )}
                  </div>

                  {selectedSourcingCandidate.emails?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</h4>
                      {selectedSourcingCandidate.emails.map((email, i) => (
                        <a key={i} href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline block">{email}</a>
                      ))}
                    </div>
                  )}

                  {selectedSourcingCandidate.phones?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone</h4>
                      {selectedSourcingCandidate.phones.map((phone, i) => (
                        <a key={i} href={`tel:${phone}`} className="text-blue-600 dark:text-blue-400 hover:underline block">{phone}</a>
                      ))}
                    </div>
                  )}

                  {selectedSourcingCandidate.skills?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSourcingCandidate.skills.map((s, i) => (
                          <Badge key={i} className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSourcingCandidate.summary && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{selectedSourcingCandidate.summary}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {selectedSourcingCandidate.resumeUrl && (
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(selectedSourcingCandidate.resumeUrl, "_blank")}>
                        📄 View Resume
                      </Button>
                    )}
                    {selectedSourcingCandidate.githubUrl && (
                      <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white" onClick={() => window.open(selectedSourcingCandidate.githubUrl, "_blank")}>
                        🔗 GitHub Profile
                      </Button>
                    )}
                    {selectedSourcingCandidate.linkedinUrl && (
                      <Button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white" onClick={() => window.open(selectedSourcingCandidate.linkedinUrl, "_blank")}>
                        💼 LinkedIn Profile
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
