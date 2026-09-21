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

const PLAN_LIMITS = { FREE: 1, STANDARD: 5, PREMIUM: 10, PRO: 25, ENTERPRISE: Infinity };

const CurrentPlans = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const { jobPlan, loading: planLoading } = useSelector((state) => state.jobPlan);


  const jobPostsRemaining = useMemo(() => {
    const plan = company?.plan || "FREE";
    if (plan === "FREE") {
      return Math.max(0, (PLAN_LIMITS.FREE ?? 1) - (company?.freeJobsPosted || 0));
    }
    const limit = PLAN_LIMITS[plan] ?? 0;
    if (limit === Infinity) return "Unlimited";
    return `${Math.max(0, limit - (company?.planJobsPostedThisMonth || 0))}/${limit}`;
  }, [company?.plan, company?.freeJobsPosted, company?.planJobsPostedThisMonth]);

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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER BANNER   */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
            {/* Decorative background blur */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                  <LuCrown className="text-3xl text-yellow-400" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-semibold tracking-wider uppercase mb-1">
                    Your Current Plan
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {jobPlan ? (matchedPlan?.title || jobPlan.planName) : "No Active Plan"}
                  </h1>
                  <p className="text-blue-100 mt-1 text-base">
                    {jobPlan
                      ? `Enjoy exclusive benefits with the ${matchedPlan?.title || jobPlan.planName}.`
                      : "Upgrade to unlock more features."}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 bg-green-500 border border-blue-500 px-4 py-2 rounded-full backdrop-blur-sm self-start sm:self-center">
                <FaCheckCircle className="text-green-400" />
                <span className="text-green-50 font-medium text-base">
                  {jobPlan ? "Active Plan" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* ================= MAIN GRID ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT PANEL: PLAN OVERVIEW */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <LuClipboardList className="text-3xl text-blue-600 dark:text-blue-400" />
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Plan Overview</h2>
                </div>

                <div className="space-y-4">
                  {/* Company */}
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuBuilding2 className="text-2xl" />
                      </div>
                      <span className="text-xl text-gray-800 dark:text-gray-200 font-semibold">Company:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xl text-right max-w-[60%]">
                      {company.companyName}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuPhone className="text-2xl" />
                      </div>
                      <span className="text-xl text-gray-800 dark:text-gray-200 font-semibold">Phone:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xl text-right">
                      {company.phone}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuMapPin className="text-2xl" />
                      </div>
                      <span className="text-xl text-gray-800 dark:text-gray-200 font-semibold">Location:</span>
                    </div>
                    <div className="text-right text-xl font-semibold text-gray-800 dark:text-gray-200 max-w-[60%]">
                      <p>{company.address?.streetAddress || "—"}</p>
                      <p>{company.address?.city || "—"}, {company.address?.state || "—"}</p>
                      <p>{company.address?.country || "—"} - {company.address?.postalCode || "—"}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuIndianRupee className="text-2xl" />
                      </div>
                      <span className="text-xl text-gray-800 dark:text-gray-200 font-semibold">Price:</span>
                    </div>
                    <span className="font-bold text-blue-500 dark:text-gray-100 text-xl">
                      ₹{jobPlan?.price || 0}
                    </span>
                  </div>

                  {/* Max Job Posts */}
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuBriefcase className="text-2xl" />
                      </div>
                      <span className="text-xl text-gray-800 dark:text-gray-200 font-semibold">Max Job Posts Remaining:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xl">
                      {jobPostsRemaining}
                    </span>
                  </div>

                  {/* Credits */}
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuDatabase className="text-2xl" />
                      </div>
                      <span className="text-xl text-gray-800 dark:text-gray-200 font-semibold">Credits For Database:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xl">
                      {company.creditedForCandidates || 0}
                    </span>
                  </div>

                  {/* Purchase Date */}
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuCalendar className="text-2xl" />
                      </div>
                      <span className="text-xl text-gray-800 dark:text-gray-200 font-semibold">Purchase Date:</span>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xl">
                      {purchaseDateStr}
                    </span>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <LuCalendarCheck className="text-2xl" />
                      </div>
                      <span className="text-xl text-gray-800 dark:text-gray-200 font-semibold">Expiry Date:</span>
                    </div>
                    <span className={`font-semibold text-xl ${isExpired ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
                      {expiryDateStr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Renew Button */}
              {isAdmin && (
                <div className="mt-8">
                  <Button
                    onClick={() => navigate("/packages")}
                    className="w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 
                    bg-transparent hover:bg-blue-500 hover:text-white dark:hover:bg-blue-900/30 font-semibold 
                    py-8 rounded-xl transition-colors flex items-center justify-center gap-4 text-xl"
                  >
                    <LuRefreshCw className="font-semibold text-2xl " />
                    Renew Plan
                  </Button>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: WHAT'S INCLUDED */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <LuStar className="text-3xl text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">What&apos;s Included in Your Plan</h2>
                </div>

                <ul className="space-y-4">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-10 py-2">
                      <FaCheckCircle className="text-green-500 mt-1 shrink-0 text-2xl" />
                      <span className="text-gray-600 dark:text-gray-300 text-xl font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Support Box */}
              <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3 mt-6">
                <LuLightbulb className="text-blue-500 mt-0.5 shrink-0 text-xl" />
                <div>
                  <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Need to make changes?
                  </p>
                  <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
                    Upgrade, downgrade or cancel your plan anytime from your account settings.
                  </p>
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-blue-600 dark:text-blue-400 text-xl font-semibold mt-2 hover:underline flex items-center gap-1"
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