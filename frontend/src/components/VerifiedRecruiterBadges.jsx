// import React from "react";

// export default function VerifiedRecruiterBadges({ plan }) {
//   if (!plan || plan === "FREE") return null;

//   const badgeMap = {
//     STANDARD: {
//       label: "VERIFIED",
//       level: "BASIC",
//       color: "#22c55e", // green
//     },
//     PREMIUM: {
//       label: "VERIFIED",
//       level: "PRO",
//       color: "#0ea5e9", // blue
//     },
//     ENTERPRISE: {
//       label: "ELITE PARTNER",
//       level: "ELITE",
//       color: "#f59e0b", // gold
//     },
//   };

//   const badge = badgeMap[plan];
//   if (!badge) return null;

//   return (
//     <div className="flex items-center">
//       <svg
//         width="180"
//         height="110"
//         viewBox="0 0 180 110"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         {/* ===== SHIELD BASE ===== */}
//         <path
//           d="
//             M15 10
//             H165
//             V70
//             C165 85 120 100 90 105
//             C60 100 15 85 15 70
//             Z
//           "
//           fill={badge.color}
//           opacity="0.12"
//         />

//         {/* ===== INNER CARD ===== */}
//         <rect
//           x="25"
//           y="18"
//           width="130"
//           height="58"
//           rx="14"
//           fill="#ffffff"
//         />

//         {/* ===== BRAND ===== */}
//         <text
//           x="90"
//           y="34"
//           textAnchor="middle"
//           fontSize="9"
//           fill="#64748b"
//           letterSpacing="1.5"
//           fontWeight="600"
//         >
//           GREATHIRE
//         </text>

//         {/* ===== VERIFIED TEXT ===== */}
//         <text
//           x="90"
//           y="54"
//           textAnchor="middle"
//           fontSize="14"
//           fill="#0f172a"
//           fontWeight="800"
//         >
//           {badge.label}
//         </text>

//         {/* ===== LEVEL PILL ===== */}
//         <rect
//           x="58"
//           y="62"
//           width="64"
//           height="18"
//           rx="9"
//           fill={badge.color}
//         />

//         <text
//           x="90"
//           y="75"
//           textAnchor="middle"
//           fontSize="10"
//           fill="#ffffff"
//           fontWeight="700"
//         >
//           {badge.level}
//         </text>

//         {/* ===== BIG CLEAN CHECK ICON (UPDATED) ===== */}
//         <circle cx="145" cy="30" r="11" fill={badge.color} />
//         <path
//           d="M139 30 L144 35 L152 25"
//           stroke="#ffffff"
//           strokeWidth="2.5"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>
//   );
// }


import React from "react";
import "./VerifiedRecruiterBadges.css";

export default function VerifiedRecruiterBadges({ plan, status, expiryDate }) {
  // Don't show badge if no plan, free plan, admin, or plan is not active
  if (!plan || plan === "FREE" || plan === "ADMIN") return null;
  if (status && status !== "Active") return null;
  
  // Check if plan is expired
  if (expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < now) return null;
  }

  // Normalize plan name to uppercase and handle different formats
  const normalizedPlan = String(plan).toUpperCase();
  
  // Determine badge type
  let badgeType = null;
  if (normalizedPlan.includes("STANDARD") || normalizedPlan === "SWIFT HIRE") {
    badgeType = "STANDARD";
  } else if (normalizedPlan.includes("PREMIUM") || normalizedPlan === "GROWTH ENGINE") {
    badgeType = "PREMIUM";
  } else if (normalizedPlan.includes("ENTERPRISE") || normalizedPlan === "ENTERPRISE ELITE") {
    badgeType = "ENTERPRISE";
  }

  if (!badgeType) return null;

  const badgeConfig = {
    STANDARD: {
      label: "VERIFIED",
      level: "STANDARD",
      color: "#22c55e",
    },
    PREMIUM: {
      label: "VERIFIED",
      level: "PREMIUM",
      color: "#0ea5e9",
    },
    ENTERPRISE: {
      label: "ELITE PARTNER",
      level: "ELITE PARTNER",
      color: "#f59e0b",
    },
  };

  const badge = badgeConfig[badgeType];

  return (
    <div className="flex items-center">
      <svg
        width="180"
        height="110"
        viewBox="0 0 180 110"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SHIELD BASE */}
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

        {/* INNER CARD */}
        <rect
          x="25"
          y="18"
          width="130"
          height="58"
          rx="14"
          fill="#ffffff"
        />

        {/* BRAND */}
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

        {/* VERIFIED TEXT */}
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

        {/* LEVEL PILL */}
        <rect
          x="40"
          y="62"
          width="100"
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

        {/* CHECK ICON */}
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
