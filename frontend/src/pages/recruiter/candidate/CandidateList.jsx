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
import { Helmet } from "react-helmet-async";

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
    gender: "",
    qualification: "",
    lastActive: "",
    location: "",
    skills: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("Find great talent for your team");

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);

      const sanitizedFilters = {
        companyId: company?._id,
        ...(filters.jobTitle && { jobTitle: filters.jobTitle }),
        ...(filters.experience && { experience: Number(filters.experience) }),
        ...(filters.salaryBudget && { salaryBudget: Number(filters.salaryBudget) }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.qualification && { qualification: filters.qualification }),
        ...(filters.lastActive && { lastActive: filters.lastActive }),
        ...(filters.location && { location: filters.location }),
        ...(filters.skills && { skills: filters.skills.split(",").map((skill) => skill.trim()) }),
      };

      const response = await axios.get(
        `${COMPANY_API_END_POINT}/candidate-list`,
        { params: sanitizedFilters, withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.candidates.length === 0)
          setMessage("No Candidate found");
        setCandidates(response.data.candidates);
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching candidates");
    } finally {
      setIsLoading(false);
    }
  };
  const handleViewInformation = async (candidate) => {
    try {
      // decrease credit API
      // const response = await axios.get(
      //   `${COMPANY_API_END_POINT}/decrease-credit/${company?._id}`,
      //   { withCredentials: true }
      // );

      // // update redux
      // if (response.data.success) {
      //   dispatch(decreaseCandidateCredits(1));
      // }

      // navigate to candidate information page
      navigate(`/recruiter/dashboard/candidate-information/${candidate._id}`);

    } catch (error) {
      toast.error("Failed to decrease credit");
    }
  };


  const handleViewCandidate = async (candidate) => {
    if (!candidate?.profile?.resume) return toast.error("Resume not uploaded yet!");

    try {
      const response = await axios.get(
        `${COMPANY_API_END_POINT}/decrease-credit/${company?._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(decreaseCandidateCredits(1));
      }

      window.open(candidate.profile.resume, "_blank");
    } catch (error) {
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
      <Helmet>
        <title>
          Find & Hire Top Candidates | Search Skilled Talent Efficiently – GreatHire
        </title>

        <meta
          name="description"
          content="GreatHire’s Candidate List page empowers recruiters to search, filter, and manage qualified job seekers with precision. Designed for fast-growing hiring teams operating from Hyderabad State, India’s leading technology and recruitment hub, this platform enables seamless talent discovery. Recruiters can filter candidates by skills, experience, location, salary expectations, and activity status to make smarter hiring decisions. With real-time insights, credit-based access, and secure candidate profiles, GreatHire simplifies recruitment workflows, saves time, and helps companies build strong teams faster with confidence."
        />
      </Helmet>

      {company && user?.isActive ? (
        <div className="p-4 md:p-6 min-h-[80vh] container bg-gray-100 mx-auto pb-20">

          {/* Header */}
          <div className="flex md:flex-row w-full justify-between border-b-2 border-gray-300 py-2 items-center pt-20">
            <h1 className="text-2xl md:text-3xl font-bold">Find Candidates</h1>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <p className="text-xl">
                Remaining Credits: <strong>{company?.creditedForCandidates}</strong>
              </p>
              {company?.creditedForCandidates === 0 && (
                <Button onClick={() => navigate("/recruiter/dashboard/upgrade-plans")}>
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { label: "Job Title", name: "jobTitle", placeholder: "Frontend Developer" },
                { label: "Experience", name: "experience", placeholder: "e.g. 1,2,3" },
                { label: "Gender", name: "gender", type: "select", options: ["", "Male", "Female", "Other"] },
                {
                  label: "Qualification", name: "qualification", type: "select",
                  options: ["", "Post Graduation", "Under Graduation", "B.Tech", "Diploma", "MBA", "Others"]
                },
                { label: "Last Active", name: "lastActive", placeholder: "Days e.g. 3" },
                { label: "Location", name: "location", placeholder: "Bangalore" },
                { label: "Skills", name: "skills", placeholder: "React, Node.js" },
                { label: "Expected CTC", name: "salaryBudget", placeholder: "50000" }
              ].map((field, idx) => (
                <div key={idx}>
                  <label>{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      value={filters[field.name]}
                      onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                      className="p-2 border rounded"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt || `Select ${field.label}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="p-2 border rounded"
                      placeholder={field.placeholder}
                      value={filters[field.name]}
                      onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button onClick={fetchCandidates} disabled={isLoading} className="mt-4 w-full md:w-40">
            {isLoading ? "Loading..." : "Find Candidates"}
          </Button>

          {/* Candidates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {isLoading ? (
              <p className="text-center text-xl">Loading...</p>
            ) : currentCandidates.length === 0 ? (
              <p className="text-center text-2xl text-gray-400">{message}</p>
            ) : (
              currentCandidates.map((candidate) => (
                <div key={candidate._id} className="p-4 border rounded shadow bg-white">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={candidate?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                      />
                    </Avatar>
                    <div>
                      <h1 className="font-bold">{candidate?.fullname ?? "User"}</h1>
                      <p>{candidate?.profile?.experience?.jobProfile ?? "Not Updated"}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Experience:</strong> {candidate?.profile?.experience?.duration ?? "0"} Years</p>
                    <p><strong>Expected CTC:</strong> ₹ {candidate?.profile?.expectedCTC ?? "Not Provided"}</p>
                    <p><strong>Last Active:</strong> {candidate?.lastActiveAgo ?? "N/A"}</p>
                  </div>

                  <div className="mt-3">
                    <h2 className="font-semibold">Skills</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {candidate?.profile?.skills?.length > 0 ? (
                        candidate.profile.skills.map((skill, i) => (
                          <Badge key={i} className="bg-blue-100 text-blue-800 hover:text-white hover:bg-blue-600  ">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">No skills added</span>
                      )}
                    </div>
                  </div>

                  <Button
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
                    onClick={() => handleViewInformation(candidate)}

                  >
                    View Information
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {candidates.length > 0 && (
            <div className="mt-6 flex justify-center gap-4">
              <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="h-screen flex items-center justify-center text-3xl text-gray-400">
          {company ? "Your company is being verified" : "Company not created"}
        </p>
      )}
    </>
  );
};

export default CandidateList;
