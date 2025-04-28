// src/components/HeroSection.jsx
import React, { useState, useRef, useEffect } from "react";
import JobSearch from "@/pages/job/JobSearch";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useJobDetails } from "@/context/JobDetailsContext";

const HeroSection = ({ searchInfo }) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filterJobs } = useJobDetails();

  const keyMap = {
    "REMOTE": "remoteOption",
    "DATE POSTED": "datePosted",
    "JOB TYPE": "jobType",
    "DISTANCE": "locationDistance",
    "EXPERIENCE LEVEL": "experienceLevel",
    "EDUCATION": "education",
  };

  const [filters, setFilters] = useState({
    jobType: null,
    remoteOption: null,
    experienceLevel: null,
    education: null,
    locationDistance: null,
    datePosted: null,
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Dropdown states
  const [remoteOpen, setRemoteOpen] = useState(false);
  const [datePostedOpen, setDatePostedOpen] = useState(false);
  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [experienceLevelOpen, setExperienceLevelOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);

  // Individual refs
  const remoteRef = useRef();
  const datePostedRef = useRef();
  const jobTypeRef = useRef();
  const locationRef = useRef();
  const experienceLevelRef = useRef();
  const educationRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (remoteRef.current && !remoteRef.current.contains(event.target)) setRemoteOpen(false);
      if (datePostedRef.current && !datePostedRef.current.contains(event.target)) setDatePostedOpen(false);
      if (jobTypeRef.current && !jobTypeRef.current.contains(event.target)) setJobTypeOpen(false);
      if (locationRef.current && !locationRef.current.contains(event.target)) setLocationOpen(false);
      if (experienceLevelRef.current && !experienceLevelRef.current.contains(event.target)) setExperienceLevelOpen(false);
      if (educationRef.current && !educationRef.current.contains(event.target)) setEducationOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownClass = "flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-300 transition duration-300 ease-in-out text-sm";
  const menuClass = "absolute z-10 mt-2 min-w-[220px] bg-white border rounded-md shadow-lg";
  const menuItemClass = "w-full text-left px-4 py-2 hover:bg-gray-100";

  return (
    <div className="py-3 text-center px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#0233f8] font-medium animate-bounce">
          No. 1 Job Hunt Website
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          Search, Apply & <br /> Get Your <span className="text-[#384ac2]">Dream Jobs</span>
        </h1>

        <JobSearch searchInfo={{
          ...searchInfo,
          jobType: filters.jobType,
          remoteOption: filters.remoteOption,
          experienceLevel: filters.experienceLevel,
          education: filters.education,
          locationDistance: filters.locationDistance,
          datePosted: filters.datePosted,
        }} />

        <div className="flex flex-wrap justify-center gap-4 mt-5 relative">
          {/* DROPDOWN BUTTONS */}
          {[
            { name: "REMOTE", state: remoteOpen, toggle: () => setRemoteOpen(!remoteOpen), ref: remoteRef, options: ["All Jobs", "Hybrid Work", "Remote"] },
            { name: "DATE POSTED", state: datePostedOpen, toggle: () => setDatePostedOpen(!datePostedOpen), ref: datePostedRef, options: ["Last 24 hours", "Last 3 days", "Last 7 days", "Last 14 days"] },
            { name: "JOB TYPE", state: jobTypeOpen, toggle: () => setJobTypeOpen(!jobTypeOpen), ref: jobTypeRef, options: ["Full-time", "Permanent", "Fresher", "Part-time"] },
            { name: "DISTANCE", state: locationOpen, toggle: () => setLocationOpen(!locationOpen), ref: locationRef, options: ["Exact Location Only", "Within 5 Kilometers", "Within 10 Kilometers", "Within 15 Kilometers", "Within 20 Kilometers", "Within 25 Kilometers", "Within 35 Kilometers", "Within 50 Kilometers", "Within 100 Kilometers"] },
            { name: "EXPERIENCE LEVEL", state: experienceLevelOpen, toggle: () => setExperienceLevelOpen(!experienceLevelOpen), ref: experienceLevelRef, options: ["Junior", "Mid-level", "Senior"] },
            { name: "EDUCATION", state: educationOpen, toggle: () => setEducationOpen(!educationOpen), ref: educationRef, options: ["Bachelor's Degree", "12th Pass", "Master's Degree", "10th Pass", "Diploma"] },
          ].map(({ name, state, toggle, ref, options }, index) => {
            const filterKey = keyMap[name]; // 👈 NOW inside .map()

            return (
              <div className="relative" ref={ref} key={index}>
                <button onClick={toggle} className={dropdownClass}>
                  <span>{filters[filterKey] || name}</span> {/* ✅ Dynamic label */}
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${state ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {state && (
                  <div className={menuClass}>
                    <ul className="py-1 text-sm text-gray-700">
                      {options.map((item, i) => (
                        <li key={i}>
                          <button
                            className={menuItemClass}
                            onClick={() => {
                              const updatedFilters = { ...filters, [filterKey]: item };
                              updateFilter(filterKey, item);
                              toggle();

                              // 🔥 Auto-apply filter immediately
                              filterJobs(
                                searchInfo.titleKeyword,
                                searchInfo.location,
                                updatedFilters.jobType,
                                updatedFilters.remoteOption,
                                updatedFilters.experienceLevel,
                                updatedFilters.education,
                                updatedFilters.locationDistance,
                                updatedFilters.datePosted
                              );
                            }}
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
