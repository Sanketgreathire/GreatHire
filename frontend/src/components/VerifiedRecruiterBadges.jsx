import React from "react";

export default function VerifiedRecruiterBadges({ plan }) {
  if (!plan || plan === "FREE") return null;

  const badgeMap = {
    STANDARD: {
      label: "VERIFIED",
      level: "BASIC",
      color: "#22c55e", // green
    },
    PREMIUM: {
      label: "VERIFIED",
      level: "PRO",
      color: "#0ea5e9", // blue
    },
    ENTERPRISE: {
      label: "ELITE PARTNER",
      level: "ELITE",
      color: "#f59e0b", // gold
    },
  };

  const badge = badgeMap[plan];
  if (!badge) return null;

  return (
    <div className="flex items-center">
      <svg
        width="180"
        height="110"
        viewBox="0 0 180 110"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ===== SHIELD BASE ===== */}
        <path
          d="
            M15 10
            H165
            V70
            C165 85 120 100 90 105
            C60 100 15 85 15 70
            Z
          "
          fill={badge.color}
          opacity="0.12"
        />

        {/* ===== INNER CARD ===== */}
        <rect
          x="25"
          y="18"
          width="130"
          height="58"
          rx="14"
          fill="#ffffff"
        />

        {/* ===== BRAND ===== */}
        <text
          x="90"
          y="34"
          textAnchor="middle"
          fontSize="9"
          fill="#64748b"
          letterSpacing="1.5"
          fontWeight="600"
        >
          GREATHIRE
        </text>

        {/* ===== VERIFIED TEXT ===== */}
        <text
          x="90"
          y="54"
          textAnchor="middle"
          fontSize="14"
          fill="#0f172a"
          fontWeight="800"
        >
          {badge.label}
        </text>

        {/* ===== LEVEL PILL ===== */}
        <rect
          x="58"
          y="62"
          width="64"
          height="18"
          rx="9"
          fill={badge.color}
        />

        <text
          x="90"
          y="75"
          textAnchor="middle"
          fontSize="10"
          fill="#ffffff"
          fontWeight="700"
        >
          {badge.level}
        </text>

        {/* ===== BIG CLEAN CHECK ICON (UPDATED) ===== */}
        <circle cx="145" cy="30" r="11" fill={badge.color} />
        <path
          d="M139 30 L144 35 L152 25"
          stroke="#ffffff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}


// import React from "react";

// export default function AccreditedBadge({
//   companyName = "GREATHIRE",
//   year = "2026",
//   show = true,
// }) {
//   if (!show) return null;

//   return (
//     <div className="flex items-center justify-center">
//       <svg
//         width="180"
//         height="180"
//         viewBox="0 0 380 360"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         {/* ===== OUTER LIGHT HEXAGON ===== */}
//         <path
//           d="M190 15 L350 110 L350 260 L190 344 L30 260 L30 110 Z"
//           fill="#CFE8F7"
//         />

//         {/* ===== INNER DARK HEXAGON ===== */}
//         <path
//           d="M190 40 L320 120 L320 240 L190 315 L60 240 L60 120 Z"
//           fill="#1F3E56"
//         />

//         {/* ===== TICK MARK ===== */}
//         <path
//           d="M150 80 L180 120 L240 60"
//           stroke="#CFE8F2"
//           strokeWidth="10"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />

//         {/* ===== ACCREDITED TEXT ===== */}
//         <text
//           x="190"
//           y="160"
//           textAnchor="middle"
//           fontSize="30"
//           fontWeight="800"
//           letterSpacing="2"
//           fill="#FFFFFF"
//         >
//           VERIFIED
//         </text>

//         {/* ===== COMPANY NAME ===== */}
//         <text
//           x="190"
//           y="198"
//           textAnchor="middle"
//           fontSize="18"
//           fill="#EAF3F9"
//         >
//           {companyName}
//         </text>

//         {/* ===== BUSINESS PARTNER ===== */}
//         <text
//           x="190"
//           y="222"
//           textAnchor="middle"
//           fontSize="18"
//           fill="#EAF3F9"
//         >
//           Recruiter
//         </text>

//         {/* ===== YEAR ===== */}
//         <text
//           x="190"
//           y="252"
//           textAnchor="middle"
//           fontSize="16"
//           fill="#9FC3D8"
//           fontWeight="500"
//         >
//           {year}
//         </text>

//         {/* ===== ORANGE RIBBON ===== */}
//         <path
//           d="M30 230 L190 315 L350 230 L350 200 L190 285 L30 200 Z"
//           fill="#F38B5A"
//         />
//       </svg>
//     </div>
//   );
// }

// // src/components/VerifiedRecruiterBadge.jsx
// import React from "react";

// /**
//  * Professional & clean recruiter badge
//  * Single-file component
//  * No emojis, no SVGs, no external imports
//  */

// const PLAN_CONFIG = {
//   STANDARD: {
//     label: "Verified Recruiter",
//     border: "border-emerald-300",
//     text: "text-emerald-700",
//     dot: "bg-emerald-500",
//   },
//   PREMIUM: {
//     label: "Professional Recruiter",
//     border: "border-sky-300",
//     text: "text-sky-700",
//     dot: "bg-sky-500",
//   },
//   ENTERPRISE: {
//     label: "Elite Partner",
//     border: "border-amber-300",
//     text: "text-amber-700",
//     dot: "bg-amber-500",
//   },
// };

// export default function VerifiedRecruiterBadge({
//   recruiter,
//   plan, // optional direct prop
//   className = "",
// }) {
//   // Resolve plan safely from all common API shapes
//   const rawPlan =
//     plan ||
//     recruiter?.plan ||
//     recruiter?.subscription?.plan ||
//     recruiter?.currentPlan;

//   if (!rawPlan) return null;

//   const planKey = String(rawPlan).trim().toUpperCase();
//   const cfg = PLAN_CONFIG[planKey];

//   if (!cfg) return null;

//   return (
//     <span
//       className={`
//         inline-flex items-center gap-2
//         px-3 py-1.5
//         rounded-md
//         border
//         bg-white
//         text-sm font-medium
//         select-none
//         ${cfg.border}
//         ${cfg.text}
//         ${className}
//       `}
//       title={cfg.label}
//     >
//       {/* status dot */}
//       <span
//         className={`w-2 h-2 rounded-full ${cfg.dot}`}
//         aria-hidden
//       />
//       {cfg.label}
//     </span>
//   );
// }
