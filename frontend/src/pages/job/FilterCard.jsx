// Import necessary React modules
import React, { useState } from "react";

// Define filter options for different categories
const filterData = [
  {
    filterType: "Location",
    array: [
      // India location all state
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Delhi",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Jammu and Kashmir",
      "Karnataka",
      "Kerala",
      "Ladakh",
      "Maharashtra",
      "Madhya Pradesh",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",

      // USA Locations
      "Arizona",
      "California",
      "Florida",
      "Illinois",
      "New York",
      "North Carolina",
      "Ohio",
      "Pennsylvania",
      "Texas",
      "Remote",
    ],
  },
  {
    filterType: "Job Title",
    array: [
      "Software Engineer",
      "React Developer",
      "Java Developer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Data Scientist",
      "Machine Learning Engineer",
      "AI Engineer",
      "Cybersecurity Analyst",
      "DevOps Engineer",
      "Cloud Engineer",
      "Database Administrator",
      "Blockchain Developer",
      "Game Developer",
      "Embedded Systems Engineer",
      "Mobile App Developer",

      // Product & Management
      "Product Manager",
      "Project Manager",
      "Business Analyst",
      "Scrum Master",
      "Operations Manager",
      "Risk Manager",
      "Supply Chain Manager",

      // Sales & Marketing
      "Marketing Manager",
      "Sales Executive",
      "Digital Marketing Specialist",
      "SEO Analyst",
      "Social Media Manager",
      "Brand Manager",
      "Public Relations Specialist",

      // HR & Administration
      "Human Resources Manager",
      "Recruiter",
      "Training and Development Manager",
      "Administrative Officer",

      // Finance & Banking
      "Financial Analyst",
      "Investment Banker",
      "Accountant",
      "Auditor",
      "Tax Consultant",
      "Actuary",
      "Loan Officer",

      // Engineering
      "Civil Engineer",
      "Mechanical Engineer",
      "Electrical Engineer",
      "Automobile Engineer",
      "Aerospace Engineer",
      "Chemical Engineer",
      "Biomedical Engineer",
      "Structural Engineer",

      // Healthcare & Medicine
      "Doctor",
      "Nurse",
      "Pharmacist",
      "Dentist",
      "Physiotherapist",
      "Radiologist",
      "Veterinarian",
      "Surgeon",

      // Legal & Law
      "Lawyer",
      "Judge",
      "Paralegal",
      "Legal Advisor",

      // Education & Research
      "Teacher",
      "Professor",
      "Research Scientist",
      "Librarian",
      "Academic Counselor",

      // Creative & Media
      "Graphic Designer",
      "UI/UX Designer",
      "Content Writer",
      "Journalist",
      "Video Editor",
      "Animator",
      "Art Director",
      "Photographer",
      "Filmmaker",
      "Fashion Designer",
      "Interior Designer",
      "Music Producer",

      // Hospitality & Tourism
      "Hotel Manager",
      "Event Planner",
      "Chef",
      "Tour Guide",
      "Travel Agent",
      "Flight Attendant",

      // Sports & Fitness
      "Athlete",
      "Fitness Trainer",
      "Sports Coach",
      "Physiotherapist",

      // Government & Public Sector
      "Police Officer",
      "Firefighter",
      "Military Officer",
      "Social Worker",
      "Diplomat",

      // Miscellaneous
      "Entrepreneur",
      "Freelancer",
      "Data Entry Operator",
      "Customer Support Representative",
    ],
  },
  {
    filterType: "Job Type",
    array: [
      "Part-time",
      "Full-time",
      "Internship",
      "Contract",
      "Hybrid",
      "Remote",
    ],
  },
];

// FilterCard component that allows users to search for jobs
const FilterCard = ({ onSearch, resetFilters }) => {
  // State to store selected search criteria
  const [search, setSearch] = useState({
    Location: "",
    "Job Title": "",
    "Job Type": "",
    Salary: "",
  });

  // State to manage dropdown visibility for filters
  const [showDropdown, setShowDropdown] = useState({
    Location: false,
    "Job Title": false,
    "Job Type": false,
  });

  // Function to execute the search with the selected criteria
  const handleSearch = () => {
    onSearch(search);
  };

  // Function to reset search filters to their default values
  const handleReset = () => {
    setSearch({ Location: "", "Job Title": "", "Job Type": "", Salary: "" });
    resetFilters(); // Call the resetFilters function passed via props
  };

  return (
    <div className="sticky top-0 rounded-md p-4 bg-white shadow-md">
      <h1 className="text-2xl text-center">
        Find Your Ideal Job with Custom Filters
      </h1>
      <hr className="mt-3" />

      {/* Search Fields in One Row with Four Columns */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {filterData.map((data, index) => (
          <div key={index} className="relative">
            {/* Input field for filter type */}
            <input
              type="text"
              placeholder={`${data.filterType}...`}
              className="w-full px-2 py-1 border rounded-md mt-2"
              value={search[data.filterType]}
              onFocus={() =>
                setShowDropdown({ ...showDropdown, [data.filterType]: true })
              }
              onBlur={() =>
                setTimeout(
                  () =>
                    setShowDropdown({
                      ...showDropdown,
                      [data.filterType]: false,
                    }),
                  200
                )
              }
              onChange={(e) =>
                setSearch({ ...search, [data.filterType]: e.target.value })
              }
            />
            {/* Dropdown suggestions based on user input */}
            {showDropdown[data.filterType] && (
              <div className="absolute mt-2 max-h-40 overflow-y-auto border rounded-md bg-white w-full shadow-md">
                {data.array
                  .filter((item) =>
                    item
                      .toLowerCase()
                      .includes(search[data.filterType].toLowerCase())
                  )
                  .map((item, idx) => (
                    <p
                      key={idx}
                      className="text-sm py-1 px-2 cursor-pointer hover:bg-gray-200"
                      onMouseDown={() =>
                        setSearch({ ...search, [data.filterType]: item })
                      }
                    >
                      {item}
                    </p>
                  ))}
              </div>
            )}
          </div>
        ))}

        {/* Salary Filter Input Field */}
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

      {/* Search and Reset Buttons */}
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
