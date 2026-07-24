import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUsers, FaBriefcase, FaClipboardList, FaTrophy } from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
import { FiGift } from "react-icons/fi";
import { Sparkles, Clock, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import VerifiedRecruiterBadges from "@/components/VerifiedRecruiterBadges";
import { addCompany } from "@/redux/companySlice";

const RecruiterHome = () => {
  const { company } = useSelector((state) => state.company);
  const { jobPlan } = useSelector((state) => state.jobPlan);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recruiters } = useSelector((state) => state.recruiters);
  const [jobsStatistics, setJobsStatistics] = useState(null);
  const [activatingTrial, setActivatingTrial] = useState(false);

  // ── 3-day free trial (Starter plan only) ──────────────────────────────
  const isTrialLive = !!(
    company?.trialActive &&
    company?.trialExpiresAt &&
    new Date(company.trialExpiresAt) > new Date()
  );
  const canStartTrial =
    (company?.plan || "FREE") === "FREE" &&
    !company?.hasSubscription &&
    !company?.hasUsedTrial &&
    !isTrialLive;
  const trialDaysLeft = isTrialLive
    ? Math.max(1, Math.ceil((new Date(company.trialExpiresAt) - new Date()) / (24 * 60 * 60 * 1000)))
    : 0;

  const handleActivateTrial = useCallback(async () => {
    if (activatingTrial) return;
    setActivatingTrial(true);
    try {
      const { data } = await axios.post(
        `${COMPANY_API_END_POINT}/activate-trial`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        dispatch(addCompany(data.company));
        toast.success("3-day trial activated! All features are unlocked (except AI Sourcing).");
      } else {
        toast.error(data.message || "Failed to activate trial.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to activate trial.");
    } finally {
      setActivatingTrial(false);
    }
  }, [activatingTrial, dispatch]);

  const fetchJobsStatistics = useCallback(async () => {
    if (!company?._id) return;
    try {
      const response = await axios.get(
        `${JOB_API_END_POINT}/job-statistics/${company._id}`,
        { withCredentials: true }
      );
      if (response.data.success) setJobsStatistics(response.data.statistics);
    } catch (err) {
      console.error("Failed to fetch job statistics:", err);
    }
  }, [company?._id]);

  useEffect(() => {
    fetchJobsStatistics();
  }, [fetchJobsStatistics]);

  const remainingJobPosts = useMemo(() => {
    const plan = company?.plan || "FREE";
    const limits = { FREE: 1, STANDARD: 5, PREMIUM: 10, PRO: 25, ENTERPRISE: Infinity };
    const referralBonus = user?.remainingJobPosts ?? 0;
    if (plan === "ENTERPRISE" || isTrialLive) return "∞";
    if (company?.maxJobPosts !== null && company?.maxJobPosts !== undefined) {
      const used = plan === "FREE" ? (company?.freeJobsPosted || 0) : (company?.planJobsPostedThisMonth || 0);
      return Math.max(0, company.maxJobPosts - used) + referralBonus;
    }
    if (plan === "FREE") {
      return Math.max(0, (limits[plan] ?? 2) - (company?.freeJobsPosted || 0)) + referralBonus;
    }
    const paidLimit = limits[plan] ?? 0;
    if (paidLimit === Infinity) return "∞";
    const paidUsed = company?.planJobsPostedThisMonth || 0;
    const carryover = paidUsed < 0 ? Math.abs(paidUsed) : 0;
    return Math.max(0, paidLimit - Math.max(0, paidUsed)) + carryover + referralBonus;
  }, [company, user?.remainingJobPosts, isTrialLive]);

  const cards = useMemo(() => [
    { title: "Recruiters", count: recruiters.length, icon: <FaUsers className="text-4xl text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2" />, description: "Recruiters in your company." },
    { title: "Posted Jobs", count: jobsStatistics?.totalJobs, icon: <FaBriefcase className="text-4xl text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg p-2" />, description: "Jobs that you have posted." },
    {
      title: "Remaining Job Posts",
      count: remainingJobPosts,
      icon: <FaClipboardList className="text-4xl text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 rounded-lg p-2" />,
      description: (
        <span>
          Number of jobs you can post.
          {(user?.remainingJobPosts ?? 0) > 0 && (
            <span className="block text-green-500 text-xs mt-0.5">🎁 Includes referral bonus</span>
          )}
        </span>
      ),
    },
    { title: "Active Jobs", count: jobsStatistics?.activeJobs, icon: <FaBriefcase className="text-4xl text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2" />, description: "Currently active and open jobs." },
    { title: "Expired Jobs", count: jobsStatistics?.inactiveJobs, icon: <FaBriefcase className="text-4xl text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2" />, description: "Jobs that have expired." },
    { title: "Applicants", count: jobsStatistics?.totalApplicants, icon: <FaUsers className="text-4xl text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg p-2" />, description: "Total applicants for your jobs." },
    { title: "Shortlisted Candidates", count: jobsStatistics?.selectedCandidates, icon: <FaUsers className="text-4xl text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 rounded-lg p-2" />, description: "Candidates who have been shortlisted." },
    {
      title: "Hiring Success Rate",
      count: jobsStatistics?.selectedCandidates && jobsStatistics?.totalApplicants
        ? `${Math.round((jobsStatistics.selectedCandidates / jobsStatistics.totalApplicants) * 100)}%`
        : "0%",
      icon: <FaTrophy className="text-4xl text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-2" />,
      description: "Percentage of shortlisted candidates.",
    },
    { title: "Invite & Earn", count: <FiGift className="text-3xl text-indigo-500" />, icon: <FiGift className="text-4xl text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-2" />, description: "Refer candidates and earn free job posts.", link: "/recruiter/dashboard/invite-and-earn" },
    { title: "Credits For Database", count: company?.creditedForCandidates || 0, icon: <BsCoin className="text-4xl text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2" />, description: "Credits available for candidate database." },
  ], [recruiters.length, jobsStatistics, remainingJobPosts, user?.remainingJobPosts, company?.creditedForCandidates]);

  const recruiterPlan = jobPlan?.planName || jobPlan?.title || jobPlan?.name || company?.plan || user?.plan;

  const verificationMessage = useMemo(() => {
    const plan = company?.plan || "FREE";
    const jobsPosted = plan === "FREE"
      ? (company?.freeJobsPosted || 0)
      : ((company?.planJobsPostedThisMonth || 0) + (company?.paidPlanFreeJobsPosted || 0));
    return jobsPosted === 0
      ? "Post your first job now. It will be reviewed by admin and published upon approval."
      : "Your first job is under admin review. You cannot post additional jobs until your account is verified.";
  }, [company?.plan, company?.freeJobsPosted, company?.planJobsPostedThisMonth, company?.paidPlanFreeJobsPosted]);

  // RequireCompany guard in App.jsx redirects before this renders if !company
  if (!company) return null;

  return (
    <>
      <Helmet>
        <title>Recruiter's Home | GreatHire's Jobs, Applications, and Hiring Analytics</title>
        <meta name="description" content="GreatHire's Recruiter Home is a comprehensive hiring management system for today's recruiters, based in Hyderabad State, India." />
      </Helmet>

      <div className="min-h-screen p-8 pt-20 bg-gray-50 dark:bg-gray-900">
        {/* Verification Banner */}
        {!company?.isActive && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <span className="font-medium">Verification Pending:</span> {verificationMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3-Day Free Trial CTA (Starter plan only) */}
        {canStartTrial && (
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-8 h-8 flex-shrink-0 text-yellow-300" />
              <div>
                <h3 className="font-bold text-lg">Unlock all premium features free for 3 days</h3>
                <p className="text-blue-100 text-sm mt-1">
                  No credit card required. Unlimited job postings, advanced filters &amp; more.
                  <span className="opacity-80"> (AI Sourcing not included in the trial.)</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleActivateTrial}
              disabled={activatingTrial}
              className="whitespace-nowrap bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {activatingTrial ? "Activating…" : "🚀 Activate 3-Day Free Trial"}
            </button>
          </div>
        )}

        {/* Active trial status banner */}
        {isTrialLive && (
          <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 p-4 rounded flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              <span className="font-medium">Trial Active:</span> {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} left with all premium features unlocked.{" "}
              <span className="inline-flex items-center gap-1 opacity-80">
                <ShieldOff className="w-3.5 h-3.5" /> AI Sourcing is not included.
              </span>
            </p>
          </div>
        )}

        {/* Header */}
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
              👋 Welcome,{" "}
              <span className="text-blue-600 dark:text-blue-400">{company?.companyName || "Recruiter"}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Here's an overview of your recruitment activity.</p>
          </div>
          <div className="flex items-start">
            <VerifiedRecruiterBadges plan={recruiterPlan} status={jobPlan?.status} expiryDate={jobPlan?.expiryDate} />
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => card.link && navigate(card.link)}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1 flex flex-col items-center border-t-4 border-blue-500 dark:border-blue-400 ${card.link ? "cursor-pointer" : ""}`}
            >
              <div className="mb-3">{card.icon}</div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{card.title}</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{card.count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecruiterHome;