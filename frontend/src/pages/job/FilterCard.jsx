// Import necessary React modules
import React, { useState } from "react";
import { array } from "yup";

// Define filter options for different categories
const filterData = [
  {
    filterType: "Location",
    array: [
      // India location all state
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
      "Jammu and Kashmir", "Karnataka", "Kerala", "Ladakh", "Maharashtra",
      "Madhya Pradesh", "Manipur", "Meghalaya",  "Mizoram", "Nagaland",
      "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
      "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",  "West Bengal",

     // "Pune", "Mumbai", "Thane", "Nashik", "Nagpur",

      // USA Locations
      "Arizona", "California", "Florida", "Illinois", "New York",
      "North Carolina", "Ohio", "Pennsylvania", "Texas", "Remote",
    ],
  },
  {
    filterType: "JobTitle",
    array: [
      "Software Engineer", "React Developer", "Java Developer",
      "Frontend Developer", "Backend Developer", "Full Stack Developer",
      "Data Scientist", "Machine Learning Engineer", "AI Engineer",
      "Cybersecurity Analyst", "DevOps Engineer", "Cloud Engineer",
      "Database Administrator", "Blockchain Developer", "Game Developer",
      "Embedded Systems Engineer", "Mobile App Developer",

      // Product & Management
      "Product Manager", "Project Manager", "Business Analyst",
      "Scrum Master", "Operations Manager", "Risk Manager",
      "Supply Chain Manager",

      // Sales & Marketing
      "Marketing Manager", "Sales Executive", "Digital Marketing Specialist",
      "SEO Analyst", "Social Media Manager", "Brand Manager",
      "Public Relations Specialist",

      // HR & Administration
      "Human Resources Manager", "Recruiter",
      "Training and Development Manager", "Administrative Officer",

      // Finance & Banking
      "Financial Analyst", "Investment Banker", "Accountant", "Auditor",
      "Tax Consultant", "Actuary", "Loan Officer",

      // Engineering
      "Civil Engineer", "Mechanical Engineer", "Electrical Engineer",
      "Automobile Engineer", "Aerospace Engineer", "Chemical Engineer",
      "Biomedical Engineer", "Structural Engineer",

      // Healthcare & Medicine
      "Doctor", "Nurse", "Pharmacist", "Dentist", "Physiotherapist",
      "Radiologist", "Veterinarian", "Surgeon",

      // Legal & Law
      "Lawyer", "Judge", "Paralegal", "Legal Advisor",

      // Education & Research
      "Teacher", "Professor", "Research Scientist", "Librarian", "Academic Counselor",

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
    filterType: "JobType",
    array: [
      "Part-time", 
      "Full-time",
      "Internship",
      "Contract",
      "Hybrid",
      "Remote",
    ],
  },
  {
    filterType: "Company",
    array: [
      "Google",
  "Microsoft",
  "Apple",
  "Amazon",
  "Meta",
  "Tesla",
  "IBM",
  "Oracle",
  "Intel",
  "Salesforce",
  "Infosys",
  "TCS",
  "Wipro",
  "Accenture",
  "Capgemini",
  "Cognizant",
  "Adobe",
  "Uber",
  "Spotify",
  "Airbnb",
  "Snap Inc",
  "Twitter",
  "Netflix",
  "Zoom",
  "Shopify"
    ],
  },
  {
    filterType: "WorkPlace",
    array: [
      "Remote",
      "On-Site",
      "Hybrid",
    ],
  },
  {
  filterType: "Qualification",
  array: [
    "Master's Degree", "Bachelor's Degree", "Doctoral Degree", "B.Tech", 
    "M.Tech", "MBA", "BCA", "MCA", "B.Sc", "M.Sc", "Diploma", 
    "10th", "12th", "Bsc.Computer Science", "B.Sc. Information Technology", 
  ],
},
{
  filterType: "DatePosted",
  array: [
    "Last 24 hours",
    "Last 7 days",
    "Last 14 days",
    "Last 30 days",
  ],
},

];

// FilterCard component that allows users to search for jobs
const FilterCard = ({ onSearch, resetFilters }) => {
  // State to store selected search criteria
  const [search, setSearch] = useState({
    Location: "",
    JobTitle: "",
    JobType: "",
    Company: "",
    WorkPlace: "",
    Salary: "",
    Qualification: "",
    DatePosted: "",
  });

  // State to manage dropdown visibility for filters
  const [showDropdown, setShowDropdown] = useState({
    Location: false,
    JobTitle: false,
    JobType: false,
    Company: false,
    WorkPlace: false,
    Salary: false,
    Qualification: false,
    DatePosted: false,
  });
  //const [showDropdown, setShowDropdown] = useState(false);

  // Function to execute the search with the selected criteria
  const handleSearch = () => {
    onSearch(search);
  };

  // Function to reset search filters to their default values
  const handleReset = () => {
    setSearch({ Location: "", JobTitle: "", JobType: "", Company: "", WorkPlace: "", Salary: "", Qualification: "", DatePosted: "" });
    resetFilters(); // Call the resetFilters function passed via props
  };

  const handleClear = (key) => {
    const newSearch = { ...search, [key]: "" };
    setSearch(newSearch);
    onSearch(newSearch);
  };

  return (

<div className="sticky top-0 rounded-md p-4 bg-white shadow-md dark:bg-gray-800 ">
  <h5 className="dark:text-white font-bold italic ">Find Your Ideal Job with Custom Filters</h5>
  <hr className="mt-3" />

  {/* Responsive auto-fit grid: items grow to text on desktop, stack on mobile */}
  {/* <div className="mt-4 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(14rem,100%),max-content))]"> */}
  <div className="mt-4 flex flex-wrap gap-3 justify-start">

    {/* Location */}
    <div className="relative flex-shrink-0">
      <button
        onClick={() =>
          setShowDropdown(prev => ({
            Location: !prev.Location,
            JobTitle: false,
            JobType: false,
            Company: false,
            WorkPlace: false,
            Salary: false,
            Qualification: false,
            DatePosted: false,
          }))
        }
        //className="inline-flex w-full sm:w-auto max-w-full min-w-[12rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
        // className="inline-flex w-full sm:w-auto max-w-[15rem] min-w-[8rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
        className="inline-flex items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-[width] duration-200 ease-in-out whitespace-nowrap min-w-[8rem] max-w-[20rem]"

      >
        <span className="truncate">{search.Location || "Location"}</span>
        <div className="relative flex-shrink-0">
          {search.Location ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                const newSearch = { ...search, Location: "" };
                setSearch(newSearch);
                onSearch(newSearch);
              }}
              className="cursor-pointer text-white bg-gray-500 rounded-full px-2 py-0.5 hover:bg-gray-700 text-sm"
            >
              &#10005; {/* X symbol */}
            </span>
          ) : (
            <span className="ml-2">&#9662;</span> // Drop down arrow 
          )}
        </div>
      </button>

      {showDropdown.Location && (
        // <div className="absolute left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-[12rem] w-max max-w-[90vw] sm:max-w-[28rem]">
        <div className="absolute top-full left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-full w-max max-w-[28rem]">
          {filterData[0].array.map((loc, idx) => (
            <p
              key={idx}
              className="border rounded-md px-3 py-2 w-auto min-w-[150px] max-w-[250px] flex justify-between items-center dark:text-black"
              onMouseDown={() => {
                const newSearch = { ...search, Location: loc };
                setSearch(newSearch);
                setShowDropdown(prev => ({ ...prev, Location: false }));
                onSearch(newSearch);
              }}
            >
              {loc}
            </p>
          ))}
        </div>
      )}
    </div>

    {/* Job Title */}
    {/* <div className="relative"> */}
    <div className="relative flex-shrink-0">
      <button
        onClick={() =>
          setShowDropdown(prev => ({
            Location: false,
            JobTitle: !prev.JobTitle,
            JobType: false,
            Company: false,
            WorkPlace: false,
            Salary: false,
            Qualification: false,
            DatePosted: false,
          }))
        }
        //className="inline-flex w-full sm:w-auto max-w-full min-w-[12rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
        // className="inline-flex w-full sm:w-auto max-w-[15rem] min-w-[8rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
         className="inline-flex items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-[width] duration-200 ease-in-out whitespace-nowrap min-w-[8rem] max-w-[20rem] "
      >
        <span className="truncate dark:text-gray-700">{search.JobTitle || "Job Title  "}</span>
        <div className="relative flex-shrink-0">
          {search.JobTitle ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                const newSearch = { ...search, JobTitle: "" };
                setSearch(newSearch);
                onSearch(newSearch);
              }}
              className="cursor-pointer text-white bg-gray-500 rounded-full px-2 py-0.5 hover:bg-gray-700 text-sm "
            >
              &#10005; {/* X symbol */}
            </span>
          ) : (
            <span className="ml-2">&#9662;</span> // Drop down arrow 
          )}
        </div>
      </button>

      {showDropdown.JobTitle && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-full w-max max-w-[28rem] dark:bg-700">
          {filterData[1].array
            .filter(item =>
              item.toLowerCase().includes((search.JobTitle || "").toLowerCase())
            )
            .map((jobtitle, idx) => (
              <p
                key={idx}
                className="border rounded-md px-3 py-2 w-auto min-w-[150px] max-w-[250px] flex justify-between items-center dark:text-black"
                onMouseDown={() => {
                  const newSearch = { ...search, JobTitle: jobtitle };
                  setSearch(newSearch);
                  setShowDropdown(prev => ({ ...prev, JobTitle: false }));
                  onSearch(newSearch);
                }}
              >
                {jobtitle}
              </p>
            ))}
        </div>
      )}
    </div>

    {/* Job Type */}
    <div className="relative">
      <button
        onClick={() =>
          setShowDropdown(prev => ({
            Location: false,
            JobTitle: false,
            JobType: !prev.JobType,
            Company: false,
            WorkPlace: false,
            Salary: false,
            Qualification: false,
            DatePosted: false,
          }))
        }
       // className="inline-flex w-full sm:w-auto max-w-full min-w-[12rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
      //  className="inline-flex w-full sm:w-auto max-w-[15rem] min-w-[8rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
       className="inline-flex items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-[width] duration-200 ease-in-out whitespace-nowrap min-w-[8rem] max-w-[20rem]"
      >
        <span className="truncate">{search.JobType || "Job Type"}</span>
        <div className="relative flex-shrink-0">
          {search.JobType ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                const newSearch = { ...search, JobType: "" };
                setSearch(newSearch);
                onSearch(newSearch);
              }}
              className="cursor-pointer text-white bg-gray-500 rounded-full px-2 py-0.5 hover:bg-gray-700 text-sm"
            >
              &#10005; {/* X symbol */}
            </span>
          ) : (
            <span className="ml-2">&#9662;</span> // Drop down arrow 
          )}
        </div>
      </button>

      {showDropdown.JobType && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-full w-max max-w-[28rem]">
          {filterData[2].array
            .filter(item =>
              item.toLowerCase().includes((search.JobType || "").toLowerCase())
            )
            .map((jobtype, idx) => (
              <p
                key={idx}
                className="border rounded-md px-3 py-2 w-auto min-w-[150px] max-w-[250px] flex justify-between items-center dark:text-black"
                onMouseDown={() => {
                  const newSearch = { ...search, JobType: jobtype };
                  setSearch(newSearch);
                  setShowDropdown(prev => ({ ...prev, JobType: false }));
                  onSearch(newSearch);
                }}
              >
                {jobtype}
              </p>
            ))}
        </div>
      )}
    </div>

    {/* Company */}
    <div className="relative">
      <button
        onClick={() =>
          setShowDropdown(prev => ({
            Location: false,
            JobTitle: false,
            JobType: false,
            Company: !prev.Company,
            WorkPlace: false,
            Salary: false,
            Qualification: false,
            DatePosted: false,
          }))
        }
        //className="inline-flex w-full sm:w-auto max-w-full min-w-[12rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
        // className="inline-flex w-full sm:w-auto max-w-[15rem] min-w-[8rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
         className="inline-flex items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-[width] duration-200 ease-in-out whitespace-nowrap min-w-[8rem] max-w-[20rem]"
      >
        <span className="truncate">{search.Company || "Company"}</span>
        <div className="relative flex-shrink-0">
          {search.Company ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                const newSearch = { ...search, Company: "" };
                setSearch(newSearch);
                onSearch(newSearch);
              }}
              className="cursor-pointer text-white bg-gray-500 rounded-full px-2 py-0.5 hover:bg-gray-700 text-sm"
            >
              &#10005; {/* X symbol */}
            </span>
          ) : (
            <span className="ml-2">&#9662;</span> // Drop down arrow 
          )}
        </div>
      </button>

      {showDropdown.Company && (
       <div className="absolute top-full left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-full w-max max-w-[28rem]">
          {filterData[3].array
            .filter(item =>
              item.toLowerCase().includes((search.Company || "").toLowerCase())
            )
            .map((company, idx) => (
              <p
                key={idx}
                className="border rounded-md px-3 py-2 w-auto min-w-[150px] max-w-[250px] flex justify-between items-center dark:text-black"
                onMouseDown={() => {
                  const newSearch = { ...search, Company: company };
                  setSearch(newSearch);
                  setShowDropdown(prev => ({ ...prev, Company: false }));
                  onSearch(newSearch);
                }}
              >
                {company}
              </p>
            ))}
        </div>
      )}
    </div>

    {/* Work Place Flexibility */}
    <div className="relative">
      <button
        onClick={() =>
          setShowDropdown(prev => ({
            Location: false,
            JobTitle: false,
            JobType: false,
            Company: false,
            WorkPlace: !prev.WorkPlace,
            Salary: false,
            Qualification: false,
            DatePosted: false,
          }))
        }
        //className="inline-flex w-full sm:w-auto max-w-full min-w-[12rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
        // className="inline-flex w-full sm:w-auto max-w-[15rem] min-w-[8rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
         className="inline-flex items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-[width] duration-200 ease-in-out whitespace-nowrap min-w-[8rem] max-w-[20rem]"
      >
        <span className="truncate">{search.WorkPlace || "Remote"}</span>
        <div className="relative flex-shrink-0">
          {search.WorkPlace ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                const newSearch = { ...search, WorkPlace: "" };
                setSearch(newSearch);
                onSearch(newSearch);
              }}
              className="cursor-pointer text-white bg-gray-500 rounded-full px-2 py-0.5 hover:bg-gray-700 text-sm "
            >
              &#10005; {/* X symbol */}
            </span>
          ) : (
            <span className="ml-2">&#9662;</span> // Down arrow 
          )}
        </div>
      </button>

      {showDropdown.WorkPlace && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-full w-max max-w-[28rem]">
          {filterData[4].array
            .filter(item =>
              item.toLowerCase().includes((search.WorkPlace || "").toLowerCase())
            )
            .map((workPlace, idx) => (
              <p
                key={idx}
                className="border rounded-md px-3 py-2 w-auto min-w-[150px] max-w-[250px] flex justify-between items-center dark:text-black"
                onMouseDown={() => {
                  const newSearch = { ...search, WorkPlace: workPlace };
                  setSearch(newSearch);
                  setShowDropdown(prev => ({ ...prev, WorkPlace: false }));
                  onSearch(newSearch);
                }}
              >
                {workPlace}
              </p>
            ))}
        </div>
      )}
    </div>

    {/* Salary */}
    <div className="relative">
      <button
        onClick={() =>
          setShowDropdown(prev => ({
            Location: false,
            JobTitle: false,
            JobType: false,
            Company: false,
            WorkPlace: false,
            Salary: !prev.Salary,
            Qualification: false,
            DatePosted: false,
          }))
        }
        //className="inline-flex w-full sm:w-auto max-w-full min-w-[12rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
        // className="inline-flex w-full sm:w-auto max-w-[15rem] min-w-[8rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
         className="inline-flex items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-[width] duration-200 ease-in-out whitespace-nowrap min-w-[8rem] max-w-[20rem]"
      >
        <span className="truncate">{search.Salary || "Salary (Monthly)"}</span>
        <div className="relative flex-shrink-0">
          {search.Salary ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                const newSearch = { ...search, Salary: "" };
                setSearch(newSearch);
                onSearch(newSearch);
              }}
              className="cursor-pointer text-white bg-gray-500 rounded-full px-2 py-0.5 hover:bg-gray-700 text-sm "
            >
              &#10005; {/* X symbol */}
            </span>
          ) : (
            <span className="ml-2">&#9662;</span> // Down arrow 
          )}
        </div>
      </button>

      {showDropdown.Salary && (
       <div className="absolute top-full left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-full w-max max-w-[28rem] ">
          {[
            "0-10000",
            "10000-20000",
            "20000-30000",
            "30000-40000",
            "40000-50000",
            "50000-100000",
            "100000+",
          ].map((range, idx) => (
            <p
              key={idx}
              className="border rounded-md px-3 py-2 w-auto min-w-[150px] max-w-[250px] flex justify-between items-center dark:text-black"
              onMouseDown={() => {
                const newSearch = { ...search, Salary: range };
                setSearch(newSearch);
                setShowDropdown(prev => ({ ...prev, Salary: false }));
                onSearch(newSearch);
              }}
            >
              {range}
            </p>
          ))}
        </div>
      )}
    </div>

    {/* Qualification */}
    <div className="relative">
      <button
        onClick={() =>
          setShowDropdown(prev => ({
            Location: false,
            JobTitle: false,
            JobType: false,
            Company: false,
            WorkPlace: false,
            Salary: false,
            Qualification: !prev.Qualification,
            DatePosted: false,
          }))
        }
        //className="inline-flex w-full sm:w-auto max-w-full min-w-[12rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
        // className="inline-flex w-full sm:w-auto max-w-[15rem] min-w-[8rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
         className="inline-flex items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-[width] duration-200 ease-in-out whitespace-nowrap min-w-[8rem] max-w-[20rem] "      >
        <span className="truncate ">{search.Qualification || "Qualification"}</span>
        <div className="relative flex-shrink-0">
          {search.Qualification ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                const newSearch = { ...search, Qualification: "" };
                setSearch(newSearch);
                onSearch(newSearch);
              }}
              className="cursor-pointer text-white bg-gray-500 rounded-full px-2 py-0.5 hover:bg-gray-700 text-sm "
            >
              &#10005; {/* X symbol */}
            </span>
          ) : (
            <span className="ml-2">&#9662;</span> // Drop down arrow 
          )}
        </div>
      </button>

      {showDropdown.Qualification && (
       <div className="absolute top-full left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-full w-max max-w-[28rem] dark:text-black">
          {filterData[5].array
            .filter(item =>
              item.toLowerCase().includes((search.Qualification || "").toLowerCase())
            )
            .map((qualification, idx) => (
              <p
                key={idx}
                className="border rounded-md px-3 py-2 w-auto min-w-[150px] max-w-[250px] flex justify-between items-center"
                onMouseDown={() => {
                  const newSearch = { ...search, Qualification: qualification };
                  setSearch(newSearch);
                  setShowDropdown(prev => ({ ...prev, Qualification: false }));
                  onSearch(newSearch);
                }}
              >
                {qualification}
              </p>
            ))}
        </div>
      )}
    </div>

    {/* Date Posted */}
    <div className="relative">
      <button
        onClick={() =>
          setShowDropdown(prev => ({
            Location: false,
            JobTitle: false,
            JobType: false,
            Company: false,
            WorkPlace: false,
            Salary: false,
            Qualification: false,
            DatePosted: !prev.DatePosted,
          }))
        }
       // className="inline-flex w-full sm:w-auto max-w-full min-w-[12rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
      //  className="inline-flex w-full sm:w-auto max-w-[15rem] min-w-[8rem] items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-colors whitespace-nowrap"
       className="inline-flex items-center justify-between gap-2 rounded-full bg-sky-200 px-4 py-2 text-sky-800 font-medium hover:bg-sky-300 transition-[width] duration-200 ease-in-out whitespace-nowrap min-w-[8rem] max-w-[20rem] "
      >
        <span className="truncate">{search.DatePosted || "Date Posted"}</span>
        <div className="relative flex-shrink-0">
          {search.DatePosted ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                const newSearch = { ...search, DatePosted: "" };
                setSearch(newSearch);
                onSearch(newSearch);
              }}
              className="cursor-pointer text-white bg-gray-500 rounded-full px-2 py-0.5 hover:bg-gray-700 text-sm"
            >
              &#10005; {/* X symbol */}
            </span>
          ) : (
            <span className="ml-2">&#9662;</span> // Drop down arrow 
          )}
        </div>
      </button>

      {showDropdown.DatePosted && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-56 overflow-y-auto border rounded-md bg-white shadow-md min-w-full w-max max-w-[28rem] dark:text-black">
          {filterData[6].array
            .filter(item =>
              item.toLowerCase().includes((search.DatePosted || "").toLowerCase())
            )
            .map((datePosted, idx) => (
              <p
                key={idx}
                className="border rounded-md px-3 py-2 w-auto min-w-[150px] max-w-[250px] flex justify-between items-center dark:text-black"
                onMouseDown={() => {
                  const newSearch = { ...search, DatePosted: datePosted };
                  setSearch(newSearch);
                  setShowDropdown(prev => ({ ...prev, DatePosted: false }));
                  onSearch(newSearch);
                }}
              >
                {datePosted}
              </p>
            ))}
        </div>
      )}
    </div>

  </div>

  {/* Buttons */}
  <div className="mt-4 flex justify-center space-x-4">
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