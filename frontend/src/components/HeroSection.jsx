// src/components/HeroSection.jsx
import React, { useState, useRef, useEffect } from "react";
import JobSearch from "@/pages/job/JobSearch";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useJobDetails } from "@/context/JobDetailsContext";
import FilterIcon from "../assets/FilterIcon.png";
import Close from "../assets/close.png";
import Dropdown from "../assets/down-chevron.png";

// Maps filter panel label → filterJobs argument key
const keyMap = {
  "Remote":           "workPlaceFlexibility",
  "Date Posted":      "datePosted",
  "Job Type":         "jobType",
  "Experience Level": "experience",
  "Qualifications":   "qualifications",
};

const FILTER_ITEMS = [
  {
    name: "Remote",
    options: ["On-site", "Hybrid", "Remote"],
  },
  {
    name: "Date Posted",
    options: ["Last 24 hours", "Last 3 days", "Last 7 days", "Last 14 days"],
  },
  {
    name: "Job Type",
    options: ["Full-time", "Permanent", "Part-time", "Internship"],
  },
  {
    name: "Experience Level",
    options: ["Fresher", "1-2 Years", "3-4 Years", "5+ Years"],
  },
  {
    name: "Qualifications",
    options: ["Bachelor's Degree", "12th Pass", "Master's Degree", "10th Pass", "Diploma", "Any Graduation"],
  },
];

const EMPTY_FILTERS = {
  jobType:              null,
  workPlaceFlexibility: null,
  experience:           null,
  qualifications:       null,
  locationDistance:     null,
  datePosted:           null,
};

const HeroSection = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { filterJobs } = useJobDetails();

  // ── Single searchInfo state (no duplicates) ──────────────────────────────
  const [searchInfo, setSearchInfo] = useState({
    titleKeyword: "",
    location:     "",
  });

  // ── Extra filter panel state ──────────────────────────────────────────────
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // ── Dropdown UI state ─────────────────────────────────────────────────────
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [expandedItems,  setExpandedItems]  = useState({});

  const filterBoxRef = useRef(null);

  // Close filter box on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterBoxRef.current && !filterBoxRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  // Called by JobSearch (title input or LocationSearch)
  const handleSearchUpdate = (updates) => {
    setSearchInfo((prev) => ({ ...prev, ...updates }));
  };

  const toggleItem = (itemName) => {
    setExpandedItems((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleOptionClick = (filterKey, option) => {
    const updatedFilters = { ...filters, [filterKey]: option };
    setFilters(updatedFilters);
    filterJobs(
      searchInfo.titleKeyword,
      searchInfo.location,
      updatedFilters.jobType,
      updatedFilters.workPlaceFlexibility,
      updatedFilters.experience,
      updatedFilters.qualifications,
      updatedFilters.datePosted
    );
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    filterJobs(
      searchInfo.titleKeyword,
      searchInfo.location,
      ...Object.values(EMPTY_FILTERS)
    );
  };

  const handleApplyFilters = () => {
    filterJobs(
      searchInfo.titleKeyword,
      searchInfo.location,
      filters.jobType,
      filters.workPlaceFlexibility,
      filters.experience,
      filters.qualifications,
      filters.datePosted
    );
    setShowDropdown(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="py-3 text-center px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-5 my-10">

        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#0233f8] font-medium animate-bounce">
          No. 1 Job Hunt Website
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          Search, Apply & <br />
          Get Your{" "}
          <span className="text-blue-700 dark:text-blue-500">Dream Jobs</span>
        </h1>

        <div className="flex items-center justify-center gap-2">
          <div className="max-w-[900px] w-full">
            {/*
              ✅ searchInfo is passed as prop so JobSearch → LocationSearch
                 can reflect any external changes (e.g. from FilterCard on /jobs page)
            */}
            <JobSearch
              searchInfo={searchInfo}
              onSearchUpdate={handleSearchUpdate}
            />
          </div>

          {/* ── Extra filter panel (HeroSection-specific) ── */}
          <div ref={filterBoxRef}>
            <div className="relative">
              <img
                src={FilterIcon}
                alt="Filter"
                className="w-9 h-auto cursor-pointer pt-5"
                onClick={() => setShowDropdown((prev) => !prev)}
              />

              {showDropdown && (
                <div className="pb-[107px] pt-10 absolute right-0 top-full mt-5 text-gray-800 bg-white border border-gray-400 rounded-md shadow-lg z-20 w-[425px] text-left">
                  <h1 className="text-2xl font-semibold pl-5 absolute top-5">Filter Jobs</h1>
                  <button onClick={() => setShowDropdown(false)}>
                    <img src={Close} alt="close" className="w-4 h-auto absolute right-6 top-7" />
                  </button>

                  {FILTER_ITEMS.map((item) => (
                    <div key={item.name} className="border-b border-gray-400">
                      <img
                        src={Dropdown}
                        alt=""
                        onClick={() => toggleItem(item.name)}
                        className={`w-7 absolute right-5 pt-3 transition-transform duration-300 ${
                          expandedItems[item.name] ? "rotate-180" : ""
                        }`}
                      />
                      <button
                        onClick={() => toggleItem(item.name)}
                        className="w-full text-left px-5 py-2 hover:bg-gray-100 text-xl font-semibold"
                      >
                        {item.name}
                        {/* Show selected value as a badge */}
                        {filters[keyMap[item.name]] && (
                          <span className="ml-2 text-sm font-normal text-blue-600">
                            ({filters[keyMap[item.name]]})
                          </span>
                        )}
                      </button>

                      {expandedItems[item.name] && (
                        <div className="pl-5 pr-5 pt-2 space-y-1">
                          {item.options.map((option, idx) => {
                            const filterKey = keyMap[item.name];
                            const isSelected = filters[filterKey] === option;
                            return (
                              <p
                                key={idx}
                                onClick={() => handleOptionClick(filterKey, option)}
                                className={`py-1 border-b cursor-pointer hover:bg-gray-100 ${
                                  isSelected ? "text-blue-600 font-semibold" : ""
                                }`}
                              >
                                {option}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    className="text-lg hover:bg-slate-300 absolute bottom-7 py-3 px-4 left-4 rounded-lg text-gray-800 font-semibold"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                  <button
                    className="absolute right-2 bottom-7 p-3 text-xl text-white bg-blue-700 rounded-md hover:bg-blue-800"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;