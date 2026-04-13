import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { COMPANY_API_END_POINT, EMAIL_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { decreaseCandidateCredits } from "@/redux/companySlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, X } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const planType = company?.plan || "FREE";
  const isStarterPlan = !company?.hasSubscription && planType === "FREE";
  const hasAdvancedFilters = ["PREMIUM", "PRO", "ENTERPRISE"].includes(planType);
  const hasLocationFilter = ["STANDARD", "PREMIUM", "PRO", "ENTERPRISE"].includes(planType);
  const canSendEmail = planType !== "FREE" || company?.hasSubscription;

  // Bulk email state
  const [selectedIds, setSelectedIds] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const selectedCandidates = candidates.filter((c) => selectedIds.includes(c._id));

  const handleSendBulkEmail = async () => {
    const emails = selectedCandidates
      .map((c) => c?.emailId?.email || c?.email)
      .filter(Boolean);

    if (emails.length === 0) return toast.error("No valid emails found.");
    if (!emailSubject.trim() || !emailMessage.trim())
      return toast.error("Subject and message are required.");

    setSendingEmail(true);
    try {
      const res = await axios.post(
        `${EMAIL_API_END_POINT}/send-bulk-email`,
        { emails, subject: emailSubject, message: emailMessage },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`Email sent to ${emails.length} candidate(s)!`);
        setShowEmailModal(false);
        setEmailSubject("");
        setEmailMessage("");
        setSelectedIds([]);
      }
    } catch {
      toast.error("Failed to send email.");
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    if (company?._id) {
      fetchCandidates();
    }
  }, [company?._id]);

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
        if (response.data.candidates.length === 0)
          setMessage("No Candidate found");
        const sortedCandidates = response.data.candidates
          .sort((a, b) => {
            const totalA = a.daysAgoLastActive * 24 + a.hoursAgoLastActive;
            const totalB = b.daysAgoLastActive * 24 + b.hoursAgoLastActive;
            return totalA - totalB;
          })
          .slice(0, 1000);
        setCandidates(sortedCandidates);
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching candidates");
    } finally {
      setIsLoading(false);
    }
  };
  const handleViewInformation = async (candidate) => {
    try {
      // Check if company has credits
      if (company?.creditedForCandidates <= 0) {
        toast.error("Insufficient credits. Please purchase a plan.");
        navigate("/recruiter/dashboard/your-plans");
        return;
      }

      // Deduct credit
      const response = await axios.get(
        `${COMPANY_API_END_POINT}/decrease-credit/${company?._id}`,
        { withCredentials: true }
      );

      // Update redux
      if (response.data.success) {
        dispatch(decreaseCandidateCredits(1));
      }

      // Navigate to candidate information page
      navigate(`/recruiter/dashboard/candidate-information/${candidate._id}`);

    } catch (error) {
      toast.error("Failed to view candidate information");
    }
  };


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

  const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);
  const currentCandidates = candidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
              {[
                { label: "Job Title", name: "jobTitle", placeholder: "Frontend Developer" },
                { label: "Gender", name: "gender", type: "select", options: ["", "Male", "Female", "Other"] },
                { label: "Skills", name: "skills", placeholder: "React, Node.js" },
                { label: "Experience", name: "experience", placeholder: "e.g. 1,2,3", advanced: true },
                { label: "Qualification", name: "qualification", type: "select",
                  options: ["", "Post Graduation", "Under Graduation", "B.Tech", "Diploma", "MBA", "Others"],
                  advanced: true
                },
                { label: "Last Active", name: "lastActive", placeholder: "Days e.g. 3", advanced: true },
                { label: "Location", name: "location", placeholder: "Bangalore", locationFilter: true },
                { label: "Expected CTC", name: "salaryBudget", placeholder: "50000", advanced: true }
              ].filter(field => (!field.advanced || hasAdvancedFilters) && (!field.locationFilter || hasLocationFilter)).map((field, idx) => (
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

          <div className="mt-6 flex justify-center md:justify-start">
            <Button
              onClick={fetchCandidates}
              disabled={isLoading}
              className="w-full sm:w-48 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isLoading ? "Finding Candidates..." : "Find Candidates"}
            </Button>
          </div>

          {/* Bulk action bar */}
          {selectedIds.length > 0 && (
            <div className="mt-4 flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {selectedIds.length} candidate{selectedIds.length > 1 ? "s" : ""} selected
              </span>
              {canSendEmail ? (
                <Button
                  onClick={() => setShowEmailModal(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-lg"
                >
                  <Mail size={15} /> Send Email
                </Button>
              ) : (
                <span className="text-xs text-gray-400 italic">Email support not available on your plan. <button onClick={() => navigate("/recruiter/dashboard/upgrade-plans")} className="underline text-blue-500">Upgrade</button></span>
              )}
              <button onClick={() => setSelectedIds([])} className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={16} />
              </button>
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
                <div key={candidate._id} className={`relative p-5 rounded-xl shadow-md bg-white dark:bg-gray-800 border-2 transition hover:shadow-lg ${
                  selectedIds.includes(candidate._id)
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}>
                  {/* Selection checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(candidate._id)}
                    onChange={() => toggleSelect(candidate._id)}
                    className="absolute top-4 right-4 w-4 h-4 accent-blue-600 cursor-pointer"
                  />
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
                    <p><strong>Experience:</strong> {candidate?.profile?.experience?.duration ?? "0"} Years</p>
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
                    className="mt-4 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleViewInformation(candidate)}

                  >
                    View Information
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
          </div>
      ) : (
        <p className="h-screen flex items-center justify-center text-3xl text-gray-400">
          {company ? "Your company is being verified" : "Company not created"}
        </p>
      )}

      {/* Bulk Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Send Email to {selectedIds.length} Candidate{selectedIds.length > 1 ? "s" : ""}
              </h2>
              <button onClick={() => setShowEmailModal(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g. Job Opportunity at Our Company"
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                rows={5}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSendBulkEmail}
                disabled={sendingEmail}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {sendingEmail ? "Sending..." : `Send to ${selectedIds.length} Candidate${selectedIds.length > 1 ? "s" : ""}`}
              </Button>
              <Button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateList;
