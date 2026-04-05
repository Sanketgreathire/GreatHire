import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const UpdateCreditsModal = ({ isOpen, onClose, recruiter, onUpdate }) => {
  const [customCreditsForJobs, setCustomCreditsForJobs] = useState("");
  const [customCreditsForCandidates, setCustomCreditsForCandidates] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (recruiter) {
      setCustomCreditsForJobs("");
      setCustomCreditsForCandidates("");
    }
  }, [recruiter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = {
      companyId: recruiter.companyId,
      customCreditsForJobs: customCreditsForJobs ? Number(customCreditsForJobs) * 500 : null,
      customCreditsForCandidates: customCreditsForCandidates ? Number(customCreditsForCandidates) : null,
      customMaxJobPosts: customCreditsForJobs ? Number(customCreditsForJobs) : null,
    };

    await onUpdate(data);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Credits for {recruiter?.fullname}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Add Job Posts
            </label>
            <Input
              type="number"
              min="1"
              placeholder="Enter number of job posts to add"
              value={customCreditsForJobs}
              onChange={(e) => setCustomCreditsForJobs(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(() => {
                const plan = recruiter?.plan || "FREE";
                const maxJobPosts = recruiter?.maxJobPosts ?? null;
                const planLimits = { FREE: 2, STANDARD: 5, PREMIUM: 15, ENTERPRISE: Infinity };
                const used = plan === "FREE"
                  ? (recruiter?.freeJobsPosted || 0)
                  : (recruiter?.planJobsPostedThisMonth || 0);
                const limit = maxJobPosts !== null ? maxJobPosts : (planLimits[plan] ?? 2);
                const remaining = limit === Infinity ? "∞" : Math.max(0, limit - used);
                return (
                  <>
                    Current remaining: <span className="font-semibold text-gray-700 dark:text-gray-200">{remaining}</span> / {limit === Infinity ? "∞" : limit} job posts
                    {customCreditsForJobs && Number(customCreditsForJobs) > 0 && limit !== Infinity && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                        → After update: {Math.max(0, limit - used) + Number(customCreditsForJobs)} / {limit + Number(customCreditsForJobs)}
                      </span>
                    )}
                  </>
                );
              })()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Custom Candidate Credits
            </label>
            <Input
              type="number"
              placeholder="Leave empty for default"
              value={customCreditsForCandidates}
              onChange={(e) => setCustomCreditsForCandidates(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current: {recruiter?.creditedForCandidates || 0}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCreditsModal;
