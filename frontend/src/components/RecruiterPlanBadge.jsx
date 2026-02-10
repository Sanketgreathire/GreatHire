import React from "react";

const RecruiterPlanBadge = ({ user }) => {
  // HARD BLOCKS
  if (!user) return null;
  if (String(user.role).toUpperCase() !== "RECRUITER") return null;
  if (user.subscriptionStatus !== "ACTIVE") return null;

  // Decide badge by plan
  if (user.plan === "STANDARD") {
    return (
      <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
        ✔ Verified Recruiter
      </span>
    );
  }

  if (user.plan === "PREMIUM") {
    return (
      <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
        ⭐ Premium Recruiter
      </span>
    );
  }

  if (user.plan === "ENTERPRISE") {
    return (
      <span className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-lg shadow-lg">
        👑 Enterprise Elite
      </span>
    );
  }

  return null;
};

export default RecruiterPlanBadge;
