// src/components/FilterCard.jsx
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FiFilter } from "react-icons/fi";

const filterOptions = {
  jobType: ["Internship", "Part-time", "Full-time", "Contract", "Hybrid"],
  datePosted: ["Last 24 hours", "Last 7 days", "Last 14 days", "Last 30 days"],
  salary: [
    "0-10000",
    "10000-20000",
    "20000-30000",
    "30000-40000",
    "40000-50000",
    "50000-100000",
    "100000+",
  ],
  workPlace: ["Remote", "On-Site", "Hybrid"],
  distance: ["0-5km", "5-10km", "10-20km", "20-50km", "50+km"],
  location: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Jammu and Kashmir", "Karnataka", "Kerala", "Ladakh", "Maharashtra",
    "Madhya Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Arizona", "California", "Florida", "Illinois", "New York",
    "North Carolina", "Ohio", "Pennsylvania", "Texas", "Remote",
  ],
  jobTitle: [
    "Software Engineer", "React Developer", "Java Developer", "Frontend Developer",
    "Backend Developer", "Full Stack Developer", "Data Scientist",
    "Machine Learning Engineer", "AI Engineer", "Cybersecurity Analyst",
    "DevOps Engineer", "Cloud Engineer", "Database Administrator",
    "Blockchain Developer", "Game Developer", "Embedded Systems Engineer",
    "Mobile App Developer", "Product Manager", "Project Manager", "Business Analyst",
    "Scrum Master", "Marketing Manager", "Sales Executive", "SEO Analyst",
    "UI/UX Designer", "Graphic Designer", "Content Writer", "Teacher", "Professor",
    "Civil Engineer", "Mechanical Engineer", "Doctor", "Nurse", "Lawyer", "Judge",
    "Chef", "Tour Guide", "Athlete", "Police Officer", "Entrepreneur",
    "Customer Support Representative",
  ],
  company: [
    "Google", "Microsoft", "Apple", "Amazon", "Meta", "Tesla", "IBM", "Oracle", "Intel",
    "Salesforce", "Infosys", "TCS", "Wipro", "Accenture", "Capgemini", "Cognizant",
    "Adobe", "Uber", "Spotify", "Airbnb", "Snap Inc", "Twitter", "Netflix", "Zoom", "Shopify",
  ],
  qualification: [
    "Master's Degree", "Bachelor's Degree", "Doctoral Degree", "B.Tech",
    "M.Tech", "MBA", "BCA", "MCA", "B.Sc", "M.Sc", "Diploma", "10th", "12th",
    "Bsc.Computer Science", "B.Sc. Information Technology",
  ],
};

const FilterCard = ({ onFilterChange, onReset, onClose }) => {
  const [filters, setFilters] = useState({
    jobType: [],
    datePosted: [],
    salary: [],
    workPlace: [],
    distance: [],
    location: "",
    jobTitle: "",
    company: "",
    qualification: "",
  });

  // ✅ Notify parent when filters change
  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  const handleCheckboxChange = (category, value) => {
    const normalizedValue =
      category === "distance" ? value.replace(/\s+/g, "") : value;

    setFilters((prev) => {
      const current = Array.isArray(prev[category]) ? prev[category] : [];
      const updated = current.includes(normalizedValue)
        ? current.filter((item) => item !== normalizedValue)
        : [...current, normalizedValue];
      return { ...prev, [category]: updated };
    });
  };

  const handleDropdownChange = (category, value) => {
    setFilters((prev) => ({ ...prev, [category]: value }));
  };

  const handleReset = () => {
    const resetFilters = {
      jobType: [],
      datePosted: [],
      salary: [],
      workPlace: [],
      distance: [],
      location: "",
      jobTitle: "",
      company: "",
      qualification: "",
    };
    setFilters(resetFilters);
    onReset?.();
  };

  return (
    <div className="w-72 bg-white shadow-lg rounded-lg pr-8 pl-8 pb-8 sticky top-4 h-[90vh] overflow-y-auto relative filter-scrollbar">
      {onClose && (
        <button
          onClick={onClose}
          title="Close filters"
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 lg:hidden"
        >
          <IoMdClose size={18} />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center justify-start gap-2 pt-8 border-b border-gray-600 pb-3 mb-4 sticky top-0 bg-white z-10">
        <FiFilter className="text-2xl text-blue-500" />
        <h2 className="text-xl font-semibold text-blue-600">Filters</h2>
      </div>

      {/* Checkbox Filters */}
      {["jobType", "datePosted", "salary", "workPlace", "distance"].map(
        (category) => (
          <div key={category} className="mb-8 border-b border-blue-200 pb-4">
            <h3 className="font-semibold text-gray-800 capitalize mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {filterOptions[category].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 text-sm cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    aria-label={opt}
                    checked={
                      Array.isArray(filters[category]) &&
                      filters[category].includes(
                        category === "distance" ? opt.replace(/\s+/g, "") : opt
                      )
                    }
                    onChange={() => handleCheckboxChange(category, opt)}
                    className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition"
                  />
                  <span className="text-gray-700 group-hover:text-blue-600 transition select-none">
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )
      )}

      {/* Dropdown Filters */}
      {["location", "jobTitle", "company", "qualification"].map((category) => (
        <div key={category} className="mb-6">
          <label
            htmlFor={category}
            className="block text-gray-800 mb-2 capitalize font-semibold "
          >
            {category}
          </label>
          <select
            id={category}
            value={filters[category]}
            onChange={(e) => handleDropdownChange(category, e.target.value)}
            className="w-full border border-blue-300 bg-white rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          >
            <option value="">All {category}</option>
            {filterOptions[category].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Reset */}
      <div className="mt-4 flex gap-2 p-4">
        <button
          onClick={handleReset}
          className="px-10 py-2 rounded-full border border-blue-500 text-blue-500 font-medium shadow-sm hover:bg-blue-600 hover:text-white transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterCard;
