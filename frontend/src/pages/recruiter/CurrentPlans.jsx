import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { subscriptionPlans } from "./RecruiterPlans";

// Icons
import {
  LuBuilding2,
  LuPhone,
  LuMapPin,
  LuIndianRupee,
  LuBriefcase,
  LuDatabase,
  LuCalendar,
  LuCalendarCheck,
  LuClipboardList,
  LuStar,
  LuRefreshCw,
  LuLightbulb,
  LuCrown,
} from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { hasStarterUnlimitedJobs } from "@/utils/starterPlan";

const PLAN_LIMITS = { FREE: 1, STANDARD: 5, PREMIUM: 10, PRO: 25, ENTERPRISE: Infinity };

const CurrentPlans = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const { jobPlan, loading: planLoading } = useSelector((state) => state.jobPlan);


  const jobPostsRemaining = useMemo(() => {
    const plan = company?.plan || "FREE";
    if (hasStarterUnlimitedJobs(company)) return "Unlimited";
    if (plan === "FREE") {
      return Math.max(0, (PLAN_LIMITS.FREE ?? 1) - (company?.freeJobsPosted || 0));
    }
    const limit = PLAN_LIMITS[plan] ?? 0;
    if (limit === Infinity) return "Unlimited";
    return `${Math.max(0, limit - (company?.planJobsPostedThisMonth || 0))}/${limit}`;
  }, [company?.plan, company?.freeJobsPosted, company?.planJobsPostedThisMonth, company?.hasSubscription, company?.starterUnlimitedJobsUntil]);

  const purchaseDateStr = useMemo(
    () => (jobPlan?.purchaseDate ? format(new Date(jobPlan.purchaseDate), "dd MMM yyyy") : "N/A"),
    [jobPlan?.purchaseDate]
  );

  const expiryDateStr = useMemo(
    () => (jobPlan?.expiryDate ? format(new Date(jobPlan.expiryDate), "dd MMM yyyy") : "N/A"),
    [jobPlan?.expiryDate]
  );

  const isExpired = useMemo(
    () => !!(jobPlan?.expiryDate && new Date(jobPlan.expiryDate) < new Date()),
    [jobPlan?.expiryDate]
  );

  // Find the matching plan from RecruiterPlans.jsx based on the plan name
  const matchedPlan = useMemo(() => {
    if (!jobPlan?.planName) return null;

    const lower = String(jobPlan.planName).toLowerCase();

    // Exact match first
    const exact = subscriptionPlans.find(
      (p) => p.title.toLowerCase() === lower
    );
    if (exact) return exact;

    // Fuzzy match based on keywords
    if (lower.includes("month") && !lower.includes("3") && !lower.includes("6") && !lower.includes("12"))
      return subscriptionPlans.find((p) => p.id === "enterprise-monthly");
    if (lower.includes("3 month") || lower.includes("quarter"))
      return subscriptionPlans.find((p) => p.id === "enterprise-3m");
    if (lower.includes("6 month") || lower.includes("half"))
      return subscriptionPlans.find((p) => p.id === "enterprise-6m");
    if (lower.includes("year") || lower.includes("annual") || lower.includes("12"))
      return subscriptionPlans.find((p) => p.id === "enterprise-1y");
    if (lower.includes("enterprise"))
      return subscriptionPlans.find((p) => p.id === "enterprise-1y");
    if (lower.includes("starter") || lower.includes("free"))
      return subscriptionPlans.find((p) => p.id === "starter");

    return null;
  }, [jobPlan?.planName]);

  // Extract the feature list safely  
  const planFeatures = useMemo(() => {
    if (!matchedPlan?.features) {
      return ["Plan details are loading. Please refresh if this persists."];
    }
    return matchedPlan.features
      .filter((f) => typeof f === "string" || !f.excluded)  
      .map((f) => (typeof f === "string" ? f : f.text));
  }, [matchedPlan]);

  // ================= EARLY RETURN / LOADING STATE =================
  if (!user || !company || planLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  // ================= CALCULATIONS SAFE AFTER LOADING =================
  // Moved here to fix the red underline. User and Company are guaranteed to exist.
  const isAdmin = user.emailId?.email === company.adminEmail;

  return (
    <>
      <Helmet>
        <title>Current Subscription Plan | GreatHire&apos;s Hiring Credits &amp; Benefits Management</title>
        <meta
          name="description"
          content="View and manage your existing subscription plan on GreatHire."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-3 lg:p-4">
        <div className="max-w-6xl mx-auto space-y-3">

          {/* HEADER BANNER   */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-2xl p-3 md:p-4 text-white relative overflow-hidden shadow-lg">
            {/* Decorative background blur */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                  <LuCrown className="text-2xl text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-blue-100 text-[11px] font-semibold tracking-wider uppercase mb-1">
                    Your Current Plan
                  </p>
                  <h1 className="text-xl md:text-2xl font-bold truncate">
                    {jobPlan ? (matchedPlan?.title || jobPlan.planName) : "No Active Plan"}
                  </h1>
                  <p className="text-blue-100 mt-1 text-xs">
                    {jobPlan
                      ? `Enjoy exclusive benefits with the ${matchedPlan?.title || jobPlan.planName}.`
                      : "Upgrade to unlock more features."}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 bg-green-500 border border-blue-500 px-3 py-1.5 rounded-full backdrop-blur-sm self-start sm:self-center">
                <FaCheckCircle className="text-green-100 text-sm" />
                <span className="text-green-50 font-medium text-xs">
                  {jobPlan ? "Active Plan" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* ================= MAIN GRID ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] gap-3">

            {/* LEFT PANEL: PLAN OVERVIEW */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <LuClipboardList className="text-2xl text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Plan Overview</h2>
                </div>

                <div className="space-y-2">
                  {/* Company */}
                  <div className="flex justify-between items-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuBuilding2 className="text-lg" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Company:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm text-right max-w-[58%] break-words">
                      {company.companyName}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex justify-between items-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuPhone className="text-lg" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Phone:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm text-right break-words">
                      {company.phone}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex justify-between items-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuMapPin className="text-lg" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Location:</span>
                    </div>
                    <div className="text-right text-sm font-semibold text-gray-800 dark:text-gray-200 max-w-[58%] break-words">
                      <p>{company.address?.streetAddress || "—"}</p>
                      <p>{company.address?.city || "—"}, {company.address?.state || "—"}</p>
                      <p>{company.address?.country || "—"} - {company.address?.postalCode || "—"}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuIndianRupee className="text-lg" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Price:</span>
                    </div>
                    <span className="font-bold text-blue-500 dark:text-gray-100 text-sm">
                      ₹{jobPlan?.price || 0}
                    </span>
                  </div>

                  {/* Max Job Posts */}
                  <div className="flex justify-between items-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuBriefcase className="text-lg" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Max Job Posts Remaining:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm text-right">
                      {jobPostsRemaining}
                    </span>
                  </div>

                  {/* Credits */}
                  <div className="flex justify-between items-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuDatabase className="text-lg" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Credits For Database:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                      {company.creditedForCandidates || 0}
                    </span>
                  </div>

                  {/* Purchase Date */}
                  <div className="flex justify-between items-center gap-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuCalendar className="text-lg" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Purchase Date:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                      {purchaseDateStr}
                    </span>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex justify-between items-center gap-3 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuCalendarCheck className="text-lg" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Expiry Date:</span>
                    </div>
                    <span className={`font-semibold text-sm ${isExpired ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
                      {expiryDateStr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Renew Button */}
              {isAdmin && (
                  <div className="mt-4">
                  <Button
                    onClick={() => navigate("/packages")}
                    className="w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 
                    bg-transparent hover:bg-blue-500 hover:text-white dark:hover:bg-blue-900/30 font-semibold 
                    py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <LuRefreshCw className="font-semibold text-lg " />
                    Renew Plan
                  </Button>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: WHAT'S INCLUDED */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <LuStar className="text-2xl text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">What&apos;s Included in Your Plan</h2>
                </div>

                <ul className="space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 py-0.5">
                      <FaCheckCircle className="text-green-500 mt-0.5 shrink-0 text-base" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-5">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Support Box */}
              <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-2 rounded-xl flex items-start gap-2 mt-4">
                <LuLightbulb className="text-blue-500 mt-0.5 shrink-0 text-lg" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Need to make changes?
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-5">
                    Upgrade, downgrade or cancel your plan anytime from your account settings.
                  </p>
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-2 hover:underline flex items-center gap-1"
                  >
                    Contact Support &rarr;
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentPlans;