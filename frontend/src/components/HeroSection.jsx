// src/components/HeroSection.jsx
import React, { useState, useRef, useEffect } from "react";
import JobSearch from "@/pages/job/JobSearch";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useJobDetails } from "@/context/JobDetailsContext";
import FilterIcon from "../assets/FilterIcon.png"
import Close from "../assets/close.png"
import Dropdown from "../assets/down-chevron.png";


const HeroSection = ({ searchInfo }) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filterJobs } = useJobDetails();
  
  const keyMap = {
    "Remote": "workPlaceFlexibility",
    "Date Posted": "datePosted",
    "Job Type": "jobType",
    "Distance": "locationDistance",
    "Experience Level": "experience", // 🔥 Corrected from experienceLevel → experience
    "Qualifications": "qualifications",
  };
  
  const [filters, setFilters] = useState({
    jobType: null,
    workPlaceFlexibility: null,
    experience: null,   // 🔥 experience instead of experienceLevel
    qualifications: null,
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
  const [workPlaceFlexibility, setWorkPlaceFlexibility] = useState(false);
  const [datePosted, setDatePosted] = useState(false);
  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [experienceLevelOpen, setExperienceLevelOpen] = useState(false);
  const [qualificationsOpen, setQualificationsOpen] = useState(false);

const [showDropdown, setShowDropdown] = useState(false);

  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };
  
  const filterBoxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterBoxRef.current && !filterBoxRef.current.contains(event.target)) {
        setShowDropdown(false); // close the entire filter box
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

// -------------------------------------------------------------------------------------------------------------------------------------------
  return (

    <div className="py-3 text-center px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#0233f8] font-medium animate-bounce">
          No. 1 Job Hunt Website
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          Search, Apply & <br /> Get Your <span className=" text-blue-700 dark:text-blue-500">Dream Jobs</span>
        </h1>
        <div className="flex items-center justify-center gap-2 ">
      <div className="max-w-[900px]">
        <JobSearch
          searchInfo={{
            ...searchInfo,
            jobType: filters.jobType,
            workPlaceFlexibility: filters.workPlaceFlexibility,
            experience: filters.experience,
            qualifications: filters.qualifications,
            locationDistance: filters.locationDistance,
            datePosted: filters.datePosted,
          }}
        />
      </div>

        <div ref={filterBoxRef}>
          <div className="relative">
            <img
              src={FilterIcon}
              alt="Filter"
              className="w-9 h-auto cursor-pointer pt-5"
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {showDropdown && (
              <div className=" pb-[107px] pt-10 absolute right-0 top-full mt-5 text-gray-800  bg-white border border-gray-400 rounded-md shadow-lg z-20 w-[425px] text-left">
                <h1 className="text-2xl font-semibold pl-5 absolute top-5 ">Filter Jobs</h1>
                <button onClick={() => setShowDropdown((prev) => !prev)}><img src={Close} alt="" className="w-4 h-auto absolute right-6 top-7 "/></button>
                {[
                  { name: "Remote", state: workPlaceFlexibility, toggle: () => setWorkPlaceFlexibility(!workPlaceFlexibility), options: ["On-site", "Hybrid", "Remote"] },
                  { name: "Date Posted", state: datePosted, toggle: () => setDatePosted(), options: ["Last 24 hours", "Last 3 days", "Last 7 days", "Last 14 days"] },
                  { name: "Job Type", state: jobTypeOpen, toggle: () => setJobTypeOpen(!jobTypeOpen), options: ["Full-time", "Permanent", "Part-time","Internship"] },
                  // { name: "Distance", state: locationOpen, toggle: () => setLocationOpen(!locationOpen), options: ["Exact Location Only", "Within 5 Kilometers", "Within 10 Kilometers", "Within 15 Kilometers", "Within 20 Kilometers", "Within 25 Kilometers", "Within 35 Kilometers", "Within 50 Kilometers", "Within 100 Kilometers"] },
                  { name: "Experience Level", state: experienceLevelOpen, toggle: () => setExperienceLevelOpen(!experienceLevelOpen), options: ["Fresher", "1-2 Years", "3-4 Years", "5+ Years"] },
                  { name: "Qualifications", state: qualificationsOpen, toggle: () => setQualificationsOpen(!qualificationsOpen), options: ["Bachelor's Degree", "12th Pass", "Master's Degree", "10th Pass", "Diploma", "Any Graduation",] },].map((item) => (
                  <div key={item.name} className="border-b border-gray-400">
                    <img 
                      src={Dropdown} 
                      alt="" 
                      onClick={() => toggleItem(item.name)} 
                      className={`w-7 absolute right-5 pt-3  transition-transform duration-300 ${
                        expandedItems[item.name] ? 'rotate-180' : ''
                      }`}
                    />
                    <button
                      onClick={() => toggleItem(item.name)}
                      className="w-full text-left px-5 py-2 hover:bg-gray-100 text-xl font-semibold"
                      >
                      {item.name}
                    </button>

                    {expandedItems[item.name] && (
                      <div className="pl-5 pr-5">
                        <div className="pt-2 space-y-1">
                          {item.options.map((option, index) => (
                            <p
                              key={index}
                              className="py-1 border-b cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                const filterKey = keyMap[item.name];
                                const updatedFilters = {
                                  ...filters,
                                  [filterKey]: option,
                                };
                              
                                updateFilter(filterKey, option);
                                filterJobs(
                                  searchInfo.titleKeyword,
                                  searchInfo.location,
                                  updatedFilters.jobType,
                                  updatedFilters.workPlaceFlexibility,
                                  updatedFilters.experience,
                                  updatedFilters.qualifications,
                                  updatedFilters.datePosted
                                );
                              }}
                            >
                              {option}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button
                className="text-lg hover:bg-slate-300 absolute bottom-7 py-3 px-4 left-4 rounded-lg text-gray-800 font-semibold"
                onClick={() => {
                  const cleared = {
                    jobType: null,
                    workPlaceFlexibility: null,
                    experience: null,
                    qualifications: null,
                    locationDistance: null,
                    datePosted: null,
                  };
                  setFilters(cleared);
                  filterJobs(
                    searchInfo.titleKeyword,
                    searchInfo.location,
                    ...Object.values(cleared)
                  );
                }}>
                  Clear
                    </button>
                    <button className="absolute right-2 bottom-7 p-3  text-xl text-white bg-blue-700 rounded-md hover:bg-blue-800">
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