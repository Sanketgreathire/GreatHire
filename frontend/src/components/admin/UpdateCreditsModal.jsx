import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const UpdateCreditsModal = ({
  isOpen,
  onClose,
  onUpdate,
  currentData,
}) => {
  const [jobPosts, setJobPosts] = useState("");
  const [customCredits, setCustomCredits] = useState("");
  const [limitCredits, setLimitCredits] = useState("");

  // Load existing values whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    setJobPosts("");
    setCustomCredits("");

    // Correct DB field
    const existingCredits =
      currentData?.aiSourcingCredits ?? 0;

    setLimitCredits(String(existingCredits));
  }, [isOpen, currentData]);

  // AI Credits validation
  const handleLimitCreditChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setLimitCredits("");
      return;
    }

    // Only whole numbers
    if (!/^\d+$/.test(value)) {
      return;
    }

    const numberValue = Number(value);

    // Only allow 0 to 5
    if (numberValue >= 0 && numberValue <= 5) {
      setLimitCredits(value);
    }
  };

  // Job posts validation
  const handleJobPostsChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setJobPosts("");
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    setJobPosts(value);
  };

  // Custom candidate credits validation
  const handleCustomCreditsChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setCustomCredits("");
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    setCustomCredits(value);
  };

  // Update button
  const handleUpdate = () => {
    // AI Credits required
    if (limitCredits === "") {
      toast.error("Please enter AI Credits");
      return;
    }

    const credits = Number(limitCredits);

    if (!Number.isInteger(credits)) {
      toast.error("AI Credits must be a whole number");
      return;
    }

    if (credits < 0 || credits > 5) {
      toast.error("AI Credits must be between 0 and 5");
      return;
    }

    // Company ID required
    if (!currentData?.companyId) {
      console.error(
        "Company ID missing from recruiter:",
        currentData
      );

      toast.error("Company ID is missing");
      return;
    }

    // Send data to parent component
    onUpdate({
      companyId: currentData.companyId,

      jobPosts:
        jobPosts === ""
          ? undefined
          : Number(jobPosts),

      customCredits:
        customCredits === ""
          ? undefined
          : Number(customCredits),

      // Backend expects limitCredits
      limitCredits: credits,
    });
  };

  if (!isOpen) {
    return null;
  }

  const recruiterName =
    currentData?.fullname ||
    currentData?.name ||
    "Recruiter";

  // Correct DB field
  const currentAICredits =
    currentData?.aiSourcingCredits ?? 0;

  const currentJobCredits =
    currentData?.creditedForJobs ??
    currentData?.maxJobPosts ??
    0;

  const currentCandidateCredits =
    currentData?.creditedForCandidates ??
    currentData?.customCreditsForCandidates ??
    0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-xl bg-[#1e2530] p-6 text-white shadow-xl border border-gray-800">

        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Update Credits
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {recruiterName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 mt-2">

          {/* Job Posts */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Add Job Posts
            </label>

            <input
              type="number"
              min="0"
              step="1"
              placeholder="Enter number of job posts to add"
              value={jobPosts}
              onChange={handleJobPostsChange}
              className="w-full rounded-lg bg-[#283141] border border-slate-700 p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-400">
              Current remaining:{" "}
              <span className="font-bold text-slate-200">
                {currentJobCredits}
              </span>
            </p>
          </div>

          {/* Candidate Credits */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Custom Candidate Credits
            </label>

            <input
              type="number"
              min="0"
              step="1"
              placeholder="Leave empty for default"
              value={customCredits}
              onChange={handleCustomCreditsChange}
              className="w-full rounded-lg bg-[#283141] border border-slate-700 p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-400">
              Current:{" "}
              <span className="font-bold text-slate-200">
                {currentCandidateCredits}
              </span>
            </p>
          </div>

          {/* AI Credits */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              AI Credits (0 to 5)
            </label>

            <input
              type="number"
              min="0"
              max="5"
              step="1"
              inputMode="numeric"
              placeholder="Enter credits between 0 and 5"
              value={limitCredits}
              onChange={handleLimitCreditChange}
              className="w-full rounded-lg bg-[#283141] border border-slate-700 p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-400">
              Current AI Credits:{" "}
              <span className="font-bold text-slate-200">
                {currentAICredits}
              </span>
            </p>

            <p className="mt-1 text-xs text-blue-400">
              Allowed range: 0 - 5 credits
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#2d3748] px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            className="rounded-lg bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            Update
          </button>

        </div>
      </div>
    </div>
  );
};

export default UpdateCreditsModal;