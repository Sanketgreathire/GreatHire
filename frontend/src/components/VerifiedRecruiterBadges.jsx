import React from "react";

const PLANS = {
  STANDARD: {
    label: "Growth",
    sublabel: "PLAN",
    icon: "🌱",
    bg: "from-emerald-400 to-green-500",
    border: "border-emerald-400",
    glow: "shadow-emerald-200 dark:shadow-emerald-900",
    text: "text-emerald-700 dark:text-emerald-300",
    pill: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    ring: "#22c55e",
  },
  PREMIUM: {
    label: "Scale",
    sublabel: "PLAN",
    icon: "🚀",
    bg: "from-blue-500 to-indigo-500",
    border: "border-blue-400",
    glow: "shadow-blue-200 dark:shadow-blue-900",
    text: "text-blue-700 dark:text-blue-300",
    pill: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    ring: "#3b82f6",
  },
  PRO: {
    label: "Pro",
    sublabel: "PLAN",
    icon: "⚡",
    bg: "from-violet-500 to-purple-600",
    border: "border-violet-400",
    glow: "shadow-violet-200 dark:shadow-violet-900",
    text: "text-violet-700 dark:text-violet-300",
    pill: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
    ring: "#8b5cf6",
  },
  ENTERPRISE: {
    label: "Enterprise",
    sublabel: "ELITE",
    icon: "👑",
    bg: "from-amber-400 to-orange-500",
    border: "border-amber-400",
    glow: "shadow-amber-200 dark:shadow-amber-900",
    text: "text-amber-700 dark:text-amber-300",
    pill: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    ring: "#f59e0b",
  },
  RPO: {
    label: "Full-Cycle RPO",
    sublabel: "RPO",
    icon: "🎯",
    bg: "from-rose-500 to-pink-600",
    border: "border-rose-400",
    glow: "shadow-rose-200 dark:shadow-rose-900",
    text: "text-rose-700 dark:text-rose-300",
    pill: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
    ring: "#f43f5e",
  },
};

export default function VerifiedRecruiterBadges({ plan, status, expiryDate }) {
  if (!plan || plan === "FREE" || plan === "ADMIN") return null;
  if (status && status !== "Active") return null;
  if (expiryDate && new Date(expiryDate) < new Date()) return null;

  const normalized = String(plan).toUpperCase().trim();
  const planMap = {
    // company.plan values
    "STANDARD": "STANDARD",
    "PREMIUM": "PREMIUM",
    "PRO": "PRO",
    "ENTERPRISE": "ENTERPRISE",
    // jobPlan.planName exact values from DB
    "GROWTH": "STANDARD",
    "SCALE": "PREMIUM",
    "PRO PLAN": "PRO",
    "ENTERPRISE ELITE": "ENTERPRISE",
    "FULL-CYCLE RPO": "RPO",
    "RPO": "RPO",
    // legacy/old names
    "STANDARD PLAN": "STANDARD",
    "GROWTH PLAN": "STANDARD",
    "SCALE PLAN": "PREMIUM",
    "ELITE": "ENTERPRISE",
  };
  const config = PLANS[planMap[normalized]];
  if (!config) return null;

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border-2 ${config.border} bg-white dark:bg-gray-800 shadow-lg ${config.glow}`}>
      {/* Icon circle */}
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.bg} flex items-center justify-center text-lg shadow-sm`}>
        {config.icon}
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-extrabold tracking-wide ${config.text}`}>
            {config.label}
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${config.pill}`}>
            {config.sublabel}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-widest uppercase">
          GreatHire Verified
        </span>
      </div>

      {/* Check mark */}
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="9" fill={config.ring} />
        <path d="M5 9L8 12L13 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
