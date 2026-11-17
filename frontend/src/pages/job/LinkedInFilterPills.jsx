import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

/**
 * LinkedIn-style horizontal filter pills shown below the search bar.
 * Props:
 *   - jobs        : full jobs array from context
 *   - activeFilter: currently selected filter key (string | null)
 *   - onFilter    : (filterKey | null) => void  — parent controls filtered list
 */
const PILL_FILTERS = [
  { key: "saved",        label: "Saved" },
  { key: "clickedApply", label: "Clicked apply", hasDropdown: true },
  { key: "applied",      label: "Applied" },
  { key: "interview",    label: "Interview" },
  { key: "archived",     label: "Archived" },
];

const CLICKED_APPLY_OPTIONS = [
  { key: "clickedApply_all",    label: "All" },
  { key: "clickedApply_manual", label: "Manually applied" },
  { key: "clickedApply_auto",   label: "Auto applied" },
];

const LinkedInFilterPills = ({ jobs = [], activeFilter, onFilter }) => {
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  if (!user) return null; // Only show for logged-in jobseekers

  const userId = String(user._id);

  // ── Counts ─────────────────────────────────────────────────────────────────
  const counts = {
    saved: jobs.filter((job) =>
      job.saveJob?.some((id) => String(id) === userId)
    ).length,

    clickedApply: jobs.filter((job) =>
      job.application?.some((app) => {
        const appId = String(app.applicant?._id || app.applicant);
        return appId === userId;
      })
    ).length,

    applied: jobs.filter((job) =>
      job.application?.some((app) => {
        const appId = String(app.applicant?._id || app.applicant);
        return appId === userId && !app.autoApplied && !app.isAutoApplied;
      })
    ).length,

    interview: jobs.filter((job) =>
      job.application?.some((app) => {
        const appId = String(app.applicant?._id || app.applicant);
        return appId === userId && app.status === "interview";
      })
    ).length,

    archived: jobs.filter((job) =>
      job.application?.some((app) => {
        const appId = String(app.applicant?._id || app.applicant);
        return appId === userId && (app.status === "rejected" || app.status === "archived");
      })
    ).length,
  };

  const handlePillClick = (key, hasDropdown) => {
    if (hasDropdown) {
      setDropdownOpen((prev) => !prev);
      return;
    }
    setDropdownOpen(false);
    onFilter(activeFilter === key ? null : key);
  };

  const handleDropdownOption = (key) => {
    setDropdownOpen(false);
    onFilter(activeFilter === key ? null : key);
  };

  const isClickedApplyActive =
    activeFilter === "clickedApply" ||
    activeFilter === "clickedApply_all" ||
    activeFilter === "clickedApply_manual" ||
    activeFilter === "clickedApply_auto";

  return (
    <div className="w-full max-w-4xl mx-auto mt-3 mb-1 px-1">
      <div className="flex flex-wrap items-center gap-2">
        {PILL_FILTERS.map(({ key, label, hasDropdown }) => {
          const count = counts[key] ?? 0;
          const isActive = hasDropdown
            ? isClickedApplyActive
            : activeFilter === key;

          return (
            <div key={key} className="relative" ref={hasDropdown ? dropdownRef : undefined}>
              <button
                type="button"
                onClick={() => handlePillClick(key, hasDropdown)}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium
                  transition-all duration-150 select-none whitespace-nowrap
                  ${
                    isActive
                      ? "bg-[#0a7a56] border-[#0a7a56] text-white shadow-sm"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-400"
                  }
                `}
              >
                <span>{label}</span>
                {count > 0 && (
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? "text-white/90" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    · {count}
                  </span>
                )}
                {hasDropdown && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-150 ${
                      dropdownOpen ? "rotate-180" : ""
                    } ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}
                  />
                )}
              </button>

              {/* Dropdown for "Clicked apply" */}
              {hasDropdown && dropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[180px]">
                  {CLICKED_APPLY_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleDropdownOption(opt.key)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700
                        ${
                          activeFilter === opt.key
                            ? "text-[#0a7a56] font-semibold"
                            : "text-gray-700 dark:text-gray-200"
                        }
                      `}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LinkedInFilterPills;
