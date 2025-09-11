import { useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { decreaseCandidateCredits } from "@/redux/companySlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10; // Show 9 per page (3x3 grid)

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    jobTitle: "",
    experience: "",
    salaryBudget: "",
    gender: "",
    qualification: "",
    lastActive: "",
    location: "",
    skills: "",
  });

  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("Find great talent for your team"); // Default message

  // Function to fetch candidates based on filters
  const fetchCandidates = async () => {
    try {
      setIsLoading(true);

      // Convert filters to appropriate types or remove empty ones
      const sanitizedFilters = {
        companyId: company?._id,
        ...(filters.jobTitle && { jobTitle: filters.jobTitle }),
        ...(filters.experience && { experience: Number(filters.experience) }),
        ...(filters.salaryBudget && { salaryBudget: Number(filters.salaryBudget) }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.qualification && { qualification: filters.qualification }),
        ...(filters.lastActive && { lastActive: filters.lastActive }),
        ...(filters.location && { location: filters.location }),
        ...(filters.skills && { skills: filters.skills.split(",").map((skill) => skill.trim()), }),
      };


      const response = await axios.get(
        `${COMPANY_API_END_POINT}/candidate-list`,
        {
          params: sanitizedFilters,
          withCredentials: true,
        }
      );

      if (response.data.success) {
        if (response.data.candidates.length === 0)
          setMessage("No Candidate found");
        setCandidates(response.data.candidates);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error(
        error.response?.data?.message || "Error fetching candidate list"
      );
    } finally {
      setIsLoading(false);
    }
  };


  // Function to decrease credits when a recruiter views a candidate's resume
  const handleViewCandidate = async (candidate) => {
    try {
      const response = await axios.get(
        `${COMPANY_API_END_POINT}/decrease-credit/${company?._id}`,
        { withCredentials: true }
      );

      // Check if the API response is successful
      if (response.data.success) {
        dispatch(decreaseCandidateCredits(1));
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      toast.error("Something went wrong!");
    }
  };

  const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);
  const currentCandidates = candidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {company && user?.isActive ? (
        <div className="p-4 md:p-6 min-h-[80vh] container bg-gray-100 mx-auto pb-20">
          {/* Header */}
          <div className="flex md:flex-row w-full justify-between border-b-2 border-gray-300 py-2 items-center pt-20">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
              Find Candidates
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="text-center sm:text-right">
                <p className="text-xl text-gray-700">
                  Remaining Credits:{" "}
                  <strong className="text-black">
                    {company?.creditedForCandidates}
                  </strong>
                </p>
                <p className="text-gray-500 text-sm">
                  Viewing resume will decrease credits
                </p>
              </div>
              {company?.creditedForCandidates === 0 && (
                <Button
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={() =>
                    navigate("/recruiter/dashboard/upgrade-plans")
                  }
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { label: "Job Title", name: "jobTitle", type: "text", placeholder: "e.g. Frontend Developer" },
                { label: "Experience", name: "experience", type: "text", placeholder: "e.g. 0, 1, 2" },
                { label: "Gender", name: "gender", type: "select", options: ["", "Male", "Female", "Other"] },
                {
                  label: "Qualification",
                  name: "qualification",
                  type: "select",
                  options: [
                    "", "Post Graduation","Under Graduation","B.Tech", "M.Tech", "MBA", "MCA","B.Sc", "M.Sc", "B.Com", "M.Com", "Diploma","12th Pass","10th pass", "Others"
                  ]
                },
                { label: "Last Active", name: "lastActive", type: "text", placeholder: "No.of Days e.g 3" },
                { label: "Location", name: "location", type: "text", placeholder: "e.g. Bangalore" },
                { label: "Skills", name: "skills", type: "text", placeholder: "e.g. React, Node.js" },
                { label: "Expected CTC", name: "salaryBudget", type: "text", placeholder: "e.g. 50000" }

              ].map((field, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <label className="text-lg font-medium text-gray-700 font-sans">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters[field.name]}
                      onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "" ? `Select ${field.label}` : opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={field.placeholder}
                      value={filters[field.name]}
                      onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={fetchCandidates}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 w-full md:w-40"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Find Candidates"}
          </Button> 

          {/* Candidates List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 mb-6">
            {isLoading ? (
              <div className="col-span-3 flex items-center justify-center py-10">
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  <span className="text-xl text-blue-600">Loading...</span>
                </div>
              </div>
            ) : currentCandidates.length === 0 ? (
              <div className="col-span-3 flex items-center justify-center py-10">
                <p className="text-4xl text-gray-400">{message}</p>
              </div>
            ) : (
              currentCandidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="flex flex-col justify-between p-4 border rounded-lg shadow-md bg-white gap-4"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    {/* Profile Photo */}
                    <Avatar className="h-20 w-20 shadow-lg">
                      <AvatarImage
                        src={
                          candidate?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                        alt="Profile Photo"
                        onError={(e) => (e.target.src = "/default-avatar.png")}
                      />
                    </Avatar>

                    {/* Name + Job Profile */}
                    <div>
                      <h1 className="text-lg font-bold text-gray-800">
                        {candidate?.fullname || "User Name"}
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {candidate?.profile?.experience.jobProfile || "Job Profile"}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <span className="font-semibold">Experience :</span>
                      <span className="sm:col-span-3">
                        {candidate?.profile?.experience?.duration || "0"} years
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <span className="font-semibold">Expected CTC :</span>
                      <span className="sm:col-span-3">
                        ₹ {candidate?.profile?.expectedCTC || "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <span className="font-semibold">Last Active :</span>
                      <span className="sm:col-span-3">
                        {candidate?.lastActiveAgo || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h2 className="text-md font-semibold text-gray-800 pb-1">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {candidate?.profile?.skills?.length > 0 ? (
                        candidate.profile.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-100 hover:bg-gray-200 px-3 py-1 text-blue-800 rounded-lg font-medium text-sm"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-600 text-sm">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Resume Button */}
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 w-full"
                    onClick={async () => {
                      await handleViewCandidate(candidate);
                      window.open(candidate.profile.resume, "_blank");
                    }}
                    disabled={company?.creditedForCandidates <= 0}
                  >
                    View Resume
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {candidates.length > 0 && (
            <div className="mt-6">
              {/* Mobile: left-center-right layout */}
              <div className="flex sm:hidden justify-between items-center w-full">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2"
                >
                  Previous
                </Button>

                <span className="px-4 py-2 border rounded-md text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2"
                >
                  Next
                </Button>
              </div>

              {/* Desktop: centered layout */}
              <div className="hidden sm:flex flex-row justify-center items-center gap-2">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2"
                >
                  Previous
                </Button>

                <span className="px-4 py-2 border rounded-md">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">
            GreatHire will verify your company soon.
          </span>
        </p>
      )}
    </>
  );
};

export default CandidateList;


// import { useState } from "react";
// import axios from "axios";
// import {
//   Combobox,
//   ComboboxButton,
//   ComboboxInput,
//   ComboboxOption,
//   ComboboxOptions,
// } from "@headlessui/react";
// import { FaAngleDown } from "react-icons/fa6";
// import { Avatar, AvatarImage } from "../../../components/ui/avatar";
// import { Badge } from "../../../components/ui/badge";
// import { Button } from "../../../components/ui/button";
// import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
// import { useSelector, useDispatch } from "react-redux";
// import { decreaseCandidateCredits } from "@/redux/companySlice";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { jobTitles } from "@/utils/constant";

// const ITEMS_PER_PAGE = 10; // Number of candidates displayed per page

// const CandidateList = () => {
//   const [candidates, setCandidates] = useState([]); // Stores fetched candidate list
//   const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Filters state for candidate search
//   const [filters, setFilters] = useState({
//     jobTitle: "",
//     experience: "",
//     salaryBudget: "",
//     gender: "",
//     qualification: "",
//     lastActive: "",
//     location: "",
//     skills: "",
//   });
  
//   const [currentPage, setCurrentPage] = useState(1); // Pagination state
//   const { company } = useSelector((state) => state.company);
//   const { user } = useSelector((state) => state.auth);
//   const [message, setMessage] = useState("Find great talent for your team"); // Default message

//   // Function to fetch candidates based on filters
//   const fetchCandidates = async () => {
//     try {
//       setIsLoading(true);
  
//       // Convert filters to appropriate types or remove empty ones
//       const sanitizedFilters = {
//         companyId: company?._id,
//         ...(filters.jobTitle && { jobTitle: filters.jobTitle }),
//         ...(filters.experience && { experience: Number(filters.experience) }),
//         ...(filters.salaryBudget && { salaryBudget: Number(filters.salaryBudget) }),
//         ...(filters.gender && { gender: filters.gender }),
//         ...(filters.qualification && { qualification: filters.qualification }),
//         ...(filters.lastActive && { lastActive: filters.lastActive }),
//         ...(filters.location && { location: filters.location }),
//         ...(filters.skills && { skills: filters.skills.split(",").map(skill => skill.trim()) }),
//       };
      
  
//       const response = await axios.get(
//         `${COMPANY_API_END_POINT}/candidate-list`,
//         {
//           params: sanitizedFilters,
//           withCredentials: true,
//         }
//       );
  
//       if (response.data.success) {
//         if (response.data.candidates.length === 0)
//           setMessage("No Candidate found");
//         setCandidates(response.data.candidates);
//         setCurrentPage(1);
//       }
//     } catch (error) {
//       console.error("Error fetching candidates:", error);
//       toast.error(
//         error.response?.data?.message || "Error fetching candidate list"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   // Function to decrease credits when a recruiter views a candidate's resume
//   const handleViewCandidate = async (candidate) => {
//     try {
//       const response = await axios.get(
//         `${COMPANY_API_END_POINT}/decrease-credit/${company?._id}`,
//         { withCredentials: true }
//       );

//       // Check if the API response is successful
//       if (response.data.success) {
//         dispatch(decreaseCandidateCredits(1));
//       }
//     } catch (error) {
//       console.error("Error:", error.response?.data?.message || error.message);
//       toast.error("Something went wrong!");
//     }
//   };
//   console.log("candidates", candidates);
//   // Pagination logic
//   const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);
//   const currentCandidates = candidates.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );
  

//   return (
//     <>
//       {company && user?.isActive ? (
//         <div className="p-4 md:p-6 min-h-[80vh] container bg-gray-100 mx-auto pb-20 ">


//           {/* Header */}
//           <div className="flex md:flex-row w-full justify-between border-b-2 border-gray-300 py-2 items-center pt-20">
//             <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
//               Find Candidates
//             </h1>
//             <div className="flex flex-col sm:flex-row gap-2 items-center">
//               <div className="text-center sm:text-right">
//                 <p className="text-xl text-gray-700">
//                   Remaining Credits:{" "}
//                   <strong className="text-black">
//                     {company?.creditedForCandidates}
//                   </strong>
//                 </p>
//                 <p className="text-gray-500 text-sm">
//                   Viewing resume will decrease credits
//                 </p>
//               </div>
//               {company?.creditedForCandidates === 0 && (
//                 <Button
//                   className="bg-blue-700 hover:bg-blue-800"
//                   onClick={() =>
//                     navigate("/recruiter/dashboard/upgrade-plans")
//                   }
//                 >
//                   Upgrade Plan
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Filters */}
//           {/* Filters Section */}
//           <div className="mt-6 mb-4">
//             {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Candidates</h2> */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
//               {[
//                 { label: "Job Title", name: "jobTitle", type: "text", placeholder: "e.g. Frontend Developer" },
//                 { label: "Experience", name: "experience", type: "text", placeholder: "e.g. 0, 1, 2" },
//                 { label: "Gender", name: "gender", type: "select", options: ["", "Male", "Female", "Other"] },
//                 {
//                   label: "Qualification",
//                   name: "qualification",
//                   type: "select",
//                   options: [
//                     "", "Post Graduation","Under Graduation","B.Tech", "M.Tech", "MBA", "MCA","B.Sc", "M.Sc", "B.Com", "M.Com", "Diploma","12th Pass","10th pass", "Others"
//                   ]
//                 },
//                 { label: "Last Active", name: "lastActive", type: "text", placeholder: "No.of Days e.g 3" },
//                 { label: "Location", name: "location", type: "text", placeholder: "e.g. Bangalore" },
//                 { label: "Skills", name: "skills", type: "text", placeholder: "e.g. React, Node.js" },
//                 { label: "Expected CTC", name: "salaryBudget", type: "text", placeholder: "e.g. 50000" }
//               ].map((field, idx) => (
//                 <div key={idx} className="flex flex-col gap-1">
//                   <label className="text-sm font-medium text-gray-700">{field.label}</label>
//                   {field.type === "select" ? (
//                     <select
//                       className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={filters[field.name]}
//                       onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
//                     >
//                       {field.options.map((opt) => (
//                         <option key={opt} value={opt}>
//                           {opt === "" ? `Select ${field.label}` : opt}
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <input
//                       type="text"
//                       className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder={field.placeholder}
//                       value={filters[field.name]}
//                       onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <Button
//               onClick={fetchCandidates}
//               className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 w-full md:w-40"
//               disabled={isLoading}
//             >
//               {isLoading ? "Loading..." : "Find Candidates"}
//           </Button> 

//           {/* Candidates List */}
//           <div className="flex flex-col gap-4 mb-6">
//             {isLoading ? (
//               <div className="flex items-center justify-center py-10">
//                 <div className="flex items-center space-x-2">
//                   <svg
//                     className="animate-spin h-8 w-8 text-blue-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                     ></path>
//                   </svg>
//                   <span className="text-xl text-blue-600">Loading...</span>
//                 </div>
//               </div>
//             ) : currentCandidates.length === 0 ? (
//               <div className="flex items-center justify-center py-10">
//                 <p className="text-4xl text-gray-400">{message}</p>
//               </div>
//             ) : (
//               currentCandidates.map((candidate) => (
//                 <div
//                   key={candidate._id}
//                   className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg shadow-md bg-white gap-4"
//                 >
//                   {/* User Info Section */}
//                   <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
//                     <Avatar className="h-24 w-24 shadow-lg">
//                       <AvatarImage
//                         src={
//                           candidate?.profile?.profilePhoto ||
//                           "https://github.com/shadcn.png"
//                         }
//                         alt="Profile Photo"
//                         onError={(e) => (e.target.src = "/default-avatar.png")}
//                       />
//                     </Avatar>
//                     <div className="text-center md:w-60">
//                       <h1 className="text-1xl md:text-1xl font-bold text-gray-800">
//                         {candidate?.fullname || "User Name"}
//                       </h1>
//                       <p className="text-gray-600 mt-1">
//                         {candidate?.profile?.experience.jobProfile}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Skills and Details Section */}
//                   <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
//                     {/* Skills */}
//                     <div className="w-full md:w-auto">
//                       <h2 className="text-lg font-semibold text-gray-800 pb-2">
//                         Skills
//                       </h2>
//                       <div className="flex flex-wrap gap-2 md:gap-3 px-2">
//                         {candidate?.profile?.skills?.length > 0 ? (
//                           candidate.profile.skills.map((skill, index) => (
//                             <Badge
//                               key={index}
//                               className="bg-blue-100 hover:bg-gray-200 px-4 py-2 text-blue-800 rounded-lg font-medium text-sm"
//                             >
//                               {skill}
//                             </Badge>
//                           ))
//                         ) : (
//                           <span className="text-gray-600">
//                             No skills listed
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     {/* Experience & Expected CTC */}
//                     <div className="flex flex-col items-center md:items-start">
//                       <p>
//                         <strong>Experience:</strong>{" "}
//                         {candidate.profile.experience.duration} years
//                       </p>
//                       <p>
//                         <strong>Expected CTC:</strong> ₹
//                         {candidate.profile.expectedCTC}
//                       </p>
//                       <p>
//                       <strong>Last Active:</strong>
//                         {candidate.lastActiveAgo}
//                       </p>
//                     </div>
//                   </div>

//                   {/* View Resume Button */}
//                   <div className="w-full md:w-auto flex justify-center">
//                     <Button
//                       className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 disabled:bg-gray-400"
//                       onClick={async () => {
//                         // First, call the API to decrease credits
//                         await handleViewCandidate(candidate);
//                         // Open the resume link in a new tab
//                         window.open(candidate.profile.resume, "_blank");
//                       }}
//                       disabled={company?.creditedForCandidates <= 0}
//                     >
//                       View Resume
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Pagination */}
//           {candidates.length > 0 && (
//           <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-2">
//             <Button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2"
//             >
//               Previous
//             </Button>
//             <span className="px-4 py-2 border rounded-md">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="px-4 py-2"
//             >
//               Next
//             </Button>
//           </div>
//         )}

//         </div>
//       ) : !company ? (
//         <p className="h-screen flex items-center justify-center">
//           <span className="text-4xl text-gray-400">Company not created</span>
//         </p>
//       ) : (
//         <p className="h-screen flex items-center justify-center">
//           <span className="text-4xl text-gray-400">
//             GreatHire will verify your company soon.
//           </span>
//         </p>
//       )}
//     </>
//   );
// };

// export default CandidateList;
