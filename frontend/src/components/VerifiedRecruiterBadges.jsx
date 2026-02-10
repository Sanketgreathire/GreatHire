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

export default function VerifiedRecruiterBadges({ plan }) {
  if (!plan || plan === "FREE" || plan === "ADMIN") return null;

  switch (plan) {
    case "STANDARD":
      return <StandardBadge />;
    case "PREMIUM":
      return <PremiumBadge />;
    case "ENTERPRISE":
      return <EnterpriseBadge />;
    default:
      return null;
  }
}

/* ================= STANDARD ================= */
function StandardBadge() {
  return (
    <svg width="160" height="90" viewBox="0 0 160 90">
      <rect x="5" y="5" width="150" height="80" rx="12" fill="#ecfdf5" />
      <circle cx="30" cy="45" r="14" fill="#22c55e" />
      <path
        d="M24 45 L29 50 L38 38"
        stroke="#fff"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <text x="60" y="42" fontSize="13" fontWeight="700" fill="#065f46">
        VERIFIED
      </text>
      <text x="60" y="60" fontSize="10" fill="#047857">
        Standard Recruiter
      </text>
    </svg>
  );
}

/* ================= PREMIUM ================= */
function PremiumBadge() {
  return (
    <div className="premium-glow">
      <svg width="180" height="100" viewBox="0 0 180 100">
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        <rect x="5" y="5" width="170" height="90" rx="14" fill="url(#blueGrad)" />
        <polygon
          points="90,18 95,32 110,32 98,42 102,58 90,48 78,58 82,42 70,32 85,32"
          fill="#ffffff"
        />
        <text
          x="90"
          y="78"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="#ffffff"
        >
          PREMIUM VERIFIED
        </text>
      </svg>
    </div>
  );
}

/* ================= ENTERPRISE ================= */
function EnterpriseBadge() {
  return (
    <svg width="220" height="120" viewBox="0 0 220 120">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      <rect x="5" y="5" width="210" height="110" rx="18" fill="url(#goldGrad)" />
      <path
        d="M60 55 L80 35 L100 55 L120 35 L140 55 V70 H60 Z"
        fill="#78350f"
      />
      <text
        x="110"
        y="90"
        textAnchor="middle"
        fontSize="14"
        fontWeight="900"
        fill="#78350f"
      >
        ENTERPRISE ELITE
      </text>
    </svg>
  );
}
