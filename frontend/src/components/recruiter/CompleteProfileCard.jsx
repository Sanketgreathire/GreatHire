import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

const CompleteProfileCard = ({ user }) => {
  const navigate = useNavigate();
  const hasPersonal = !!user;
  const hasCompany = !!user?.isCompanyCreated;

  const steps = [
    { label: "Personal Details", done: hasPersonal },
    { label: "Company Details", done: hasCompany },
    { label: "Access Dashboard / Post Jobs", done: false },
  ];

  const handleCTA = () => {
    if (!hasCompany) navigate("/recruiter/dashboard/create-company");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div
        style={{ width: 420, borderRadius: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
        className="bg-white dark:bg-gray-800 p-10 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Complete Your Profile
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Please complete your personal and company details before posting jobs.
        </p>

        {/* Step indicators */}
        <ol className="text-left mb-8 space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-center gap-3">
              {step.done ? (
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
              ) : (
                <Circle size={20} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
              )}
              <span
                className={`text-sm font-medium ${
                  step.done
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>

        <button
          onClick={handleCTA}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-white font-semibold text-sm"
          style={{ background: "linear-gradient(90deg,#2458f5,#8b3dff)", border: "none" }}
        >
          Complete Company Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CompleteProfileCard;
