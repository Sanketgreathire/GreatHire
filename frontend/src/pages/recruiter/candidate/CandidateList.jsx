import { useState } from "react";
import axios from "axios";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { FaAngleDown } from "react-icons/fa6";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { decreaseCandidateCredits } from "@/redux/companySlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jobTitles } from "@/utils/constant";

const ITEMS_PER_PAGE = 10;

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    jobTitle: "",
    experience: "",
    salaryBudget: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("Find great talent for your team");

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${COMPANY_API_END_POINT}/candidate-list`,
        {
          params: { ...filters, companyId: company?._id },
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
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="p-4 md:p-6 min-h-screen container mx-auto">
          {/* Header */}
          <div className="flex md:flex-row w-full justify-between border-b-2 border-gray-300 py-2 items-center">
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
                    navigate("/recruiter/dashboard/candidate-plans")
                  }
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-4 mb-4 justify-evenly">
            <Combobox
              value={filters.jobTitle}
              onChange={(value) => setFilters({ ...filters, jobTitle: value })}
              className="w-full md:w-60"
            >
              <div className="relative ">
                <ComboboxInput
                  className="p-2 border border-gray-400 rounded-md w-full"
                  placeholder="Select Job Title"
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <FaAngleDown />
                </ComboboxButton>
                <ComboboxOptions className="absolute bg-white border rounded-md mt-1 shadow-lg h-40 overflow-y-scroll w-full">
                  {jobTitles.map((title) => (
                    <ComboboxOption
                      key={title}
                      value={title}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {title}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </div>
            </Combobox>
            <input
              type="text"
              placeholder="Min Experience (0, 1, 2 years)"
              className="p-2 border rounded-md w-full md:w-60"
              value={filters.experience}
              onChange={(e) =>
                setFilters({ ...filters, experience: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Max CTC (₹) eg.. 0, 50000"
              className="p-2 border rounded-md w-full md:w-60"
              value={filters.salaryBudget}
              onChange={(e) =>
                setFilters({ ...filters, salaryBudget: e.target.value })
              }
            />

            <Button
              onClick={fetchCandidates}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 w-full md:w-40"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Find Candidates"}
            </Button>
          </div>

          {/* Candidates List */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
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
              <div className="flex items-center justify-center py-10">
                <p className="text-4xl text-gray-400">{message}</p>
              </div>
            ) : (
              candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg shadow-md bg-white gap-4"
                >
                  {/* User Info Section */}
                  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Avatar className="h-24 w-24 shadow-lg">
                      <AvatarImage
                        src={
                          candidate?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                        alt="Profile Photo"
                        onError={(e) => (e.target.src = "/default-avatar.png")}
                      />
                    </Avatar>
                    <div className="text-center md:w-60">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {candidate?.fullname || "User Name"}
                      </h1>
                      <p className="text-gray-600 mt-1">
                        {candidate?.profile?.experience.jobProfile}
                      </p>
                    </div>
                  </div>

                  {/* Skills and Details Section */}
                  <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
                    {/* Skills */}
                    <div className="w-full md:w-auto">
                      <h2 className="text-lg font-semibold text-gray-800 pb-2">
                        Skills
                      </h2>
                      <div className="flex flex-wrap gap-2 md:gap-3 px-2">
                        {candidate?.profile?.skills?.length > 0 ? (
                          candidate.profile.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-blue-100 hover:bg-gray-200 px-4 py-2 text-blue-800 rounded-lg font-medium text-sm"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-600">
                            No skills listed
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Experience & Expected CTC */}
                    <div className="flex flex-col items-center md:items-start">
                      <p>
                        <strong>Experience:</strong>{" "}
                        {candidate.profile.experience.duration} years
                      </p>
                      <p>
                        <strong>Expected CTC:</strong> ₹
                        {candidate.profile.expectedCTC}
                      </p>
                    </div>
                  </div>

                  {/* View Resume Button */}
                  <div className="w-full md:w-auto flex justify-center">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 disabled:bg-gray-400"
                      onClick={async () => {
                        // First, call the API to decrease credits
                        await handleViewCandidate(candidate);
                        // Open the resume link in a new tab
                        window.open(candidate.profile.resume, "_blank");
                      }}
                      disabled={company?.creditedForCandidates <= 0}
                    >
                      View Resume
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-2">
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2"
              >
                Next
              </Button>
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
