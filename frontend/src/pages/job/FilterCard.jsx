import React, { useState } from "react";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
      "Jammu and Kashmir", "Karnataka", "Kerala", "Ladakh", "Maharashtra",
      "Madhya Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
      "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
      "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Arizona",
      "California", "Florida", "Illinois", "New York", "North Carolina",
      "Ohio", "Pennsylvania", "Texas", "Remote"
    ]
  },
  {
    filterType: "Job Title",
    array: [
      "Frontend Developer", "Backend Developer", "FullStack Developer",
      "Website Designer", "Java Developer", "Data Science",
      "Graphic Designer", "Data Entry Operator", "Dotnet Developer"
    ]
  },
  {
    filterType: "Job Type",
    array: [
      "Part-time", "Full-time", "Internship", "Contract", "Hybrid"
    ]
  }
];

const FilterCard = ({ onSearch, resetFilters }) => {
  const [search, setSearch] = useState({ Location: "", "Job Title": "", "Job Type": "", Salary: "" });
  const [showDropdown, setShowDropdown] = useState({ Location: false, "Job Title": false, "Job Type": false });

  const handleSearch = () => {
    onSearch(search);
  };

  const handleReset = () => {
    setSearch({ Location: "", "Job Title": "", "Job Type": "", Salary: "" });
    resetFilters(); // Call the resetFilters function passed via props
  };

  return (
    <div className="sticky top-0 rounded-md p-4 bg-white shadow-md">
      <h1 className="text-2xl text-center">Find Your Ideal Job with Custom Filters</h1>
      <hr className="mt-3" />

      {/* Search Fields in One Row with Four Columns */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {filterData.map((data, index) => (
          <div key={index} className="relative">
            <input
              type="text"
              placeholder={`${data.filterType}...`}
              className="w-full px-2 py-1 border rounded-md mt-2"
              value={search[data.filterType]}
              onFocus={() => setShowDropdown({ ...showDropdown, [data.filterType]: true })}
              onBlur={() => setTimeout(() => setShowDropdown({ ...showDropdown, [data.filterType]: false }), 200)}
              onChange={(e) => setSearch({ ...search, [data.filterType]: e.target.value })}
            />
            {showDropdown[data.filterType] && (
              <div className="absolute mt-2 max-h-40 overflow-y-auto border rounded-md bg-white w-full shadow-md">
                {data.array
                  .filter((item) =>
                    item.toLowerCase().includes(search[data.filterType].toLowerCase())
                  )
                  .map((item, idx) => (
                    <p key={idx} className="text-sm py-1 px-2 cursor-pointer hover:bg-gray-200" onMouseDown={() => setSearch({ ...search, [data.filterType]: item })}>
                      {item}
                    </p>
                  ))}
              </div>
            )}
          </div>
        ))}

        {/* Salary Filter */}
        <div>
          <input
            type="text"
            placeholder="Salary(Monthly)..."
            className="w-full px-2 py-1 border rounded-md mt-2"
            value={search.Salary}
            onChange={(e) => setSearch({ ...search, Salary: e.target.value })}
          />
        </div>
      </div>

      {/* Search and Reset Buttons centered */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={handleSearch}
          className="bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          Find Jobs
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterCard;

