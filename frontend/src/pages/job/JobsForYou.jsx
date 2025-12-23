
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark, FaHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import JobMajorDetails from "./JobMajorDetails";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertCircle, User, Phone, Mail, FileText, Briefcase, Star, GraduationCap } from 'lucide-react';

const JobsForYou = () => {
  // Access functions from context
  const { jobs, selectedJob, setSelectedJob, toggleBookmarkStatus } = useJobDetails();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Added for small screen job details
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Ref to track the scrollable container
  const jobContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowJobDetails(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    if (jobContainerRef.current) {
      jobContainerRef.current.scrollTop = 0;
    }
  }, [selectedJob]);

  const handleScroll = () => {
    if (jobContainerRef.current) {
      setScrollPosition(jobContainerRef.current.scrollTop);
    }
  };

  // check for current selected job application status
  const isApplied =
    selectedJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  // check is job applied or not in job list
  const hasAppliedToJob = (jobId) =>
    jobs.some(
      (job) =>
        job._id === jobId &&
        job?.application?.some(
          (application) => application.applicant === user?._id
        )
    );

  const isJobBookmarked = (userId) => selectedJob?.saveJob?.includes(userId);

  // for bookmark job for particular user
  const handleBookmark = async (jobId) => {
    try {
      const response = await axios.get(
        `${JOB_API_END_POINT}/bookmark-job/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toggleBookmarkStatus(jobId, user?._id);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error bookmarking job:",
        error.response?.data?.message || error.message
      );
    }
  };

  const calculateActiveDays = (createdAt) => {
    const jobCreatedDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - jobCreatedDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Function for handling the job card clicks
  const handleJobClick = (job) => {
    setSelectedJob(job);
    if (window.innerWidth < 768) {
      setShowJobDetails(true);
    }
  };
  const handleNavigateToProfile = () => {
   navigate('/profile'); 
  };

  // --- PROFILE COMPLETION CHECK LOGIC ---
  const getMissingProfileFields = (userData = user) => {
    if (!userData) return [{ label: "Login / User Data", icon: User }];

    const missingFields = [];

    // Email
    const email = userData?.emailId?.email || userData?.email;
    if (!email || String(email).trim() === "") {
      missingFields.push({ label: "Email Address", icon: Mail });
    }

    // Phone
    const phone = userData?.phoneNumber?.number || userData?.phoneNumber;
    if (!phone || String(phone).trim() === "") {
      missingFields.push({ label: "Contact Number", icon: Phone });
    }

    // Resume
    const resume = userData?.profile?.resume;
    if (!resume || String(resume).trim() === "") {
      missingFields.push({ label: "Resume/CV", icon: FileText });
    }

    // Gender
    const gender = userData?.profile?.gender || userData?.gender;
    if (!gender || String(gender).trim() === "") {
      missingFields.push({ label: "Gender", icon: User });
    }

    // Qualification
    const qualification = userData?.profile?.qualification;
    const otherQualification = userData?.profile?.otherQualification;
    if (!qualification || String(qualification).trim() === "") {
      missingFields.push({ label: "Highest Qualification", icon: GraduationCap });
    } else if (
      qualification === "Others" &&
      (!otherQualification || String(otherQualification).trim() === "")
    ) {
      missingFields.push({ label: "Other Qualification Details", icon: GraduationCap });
    }

    // Skills
    const skillsArr =
      Array.isArray(userData?.profile?.skills) && userData.profile.skills.length > 0
        ? userData.profile.skills
        : typeof userData?.profile?.skills === "string" &&
          userData.profile.skills.trim().length > 0
        ? userData.profile.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    if (!skillsArr || skillsArr.length === 0) {
      missingFields.push({ label: "Skills", icon: Briefcase });
    }

    // Bio
    const bio = userData?.profile?.bio;
    if (!bio || String(bio).trim() === "") {
      missingFields.push({ label: "Profile Summary/Bio", icon: FileText });
    }

    return missingFields;
  };

  const isProfileComplete = (userData = user) => {
    return getMissingProfileFields(userData).length === 0;
  };

  // Calculate completion percentage
  const missingFields = getMissingProfileFields(user);
  const totalFields = 7; // Total profile fields to complete
  const completionPercentage = Math.round(
    ((totalFields - missingFields.length) / totalFields) * 100
  );

  // -------- APPLY JOB FUNCTION ----------
  const handleApply = async (jobId) => {
    if (!user) {
      toast.error("Please login to apply");
      return;
    }

    if (hasAppliedToJob(jobId)) {
      toast.error("Already applied");
      return;
    }

    const missingFieldsList = getMissingProfileFields(user);
    if (missingFieldsList.length > 0) {
      const missingMessage = `Please complete the following details in your profile before applying: ${missingFieldsList
        .map((f) => f.label)
        .join(", ")}.`;
      toast.error(missingMessage, { duration: 6000 });
      return;
    }

    try {
      const payload = {
        applicant: user._id,
        applicantName: user.fullname || user.name,
        applicantEmail: user.email,
        applicantPhone: user.phoneNumber?.number || user.phoneNumber,
        applicantProfile: user.profile,
      };

      const response = await axios.post(
        `${JOB_API_END_POINT}/apply-job/${jobId}`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Applied Successfully");

        setSelectedJob((prev) => ({
          ...prev,
          application: [...(prev.application || []), { applicant: user._id }],
        }));
      }
    } catch (error) {
      console.error("Error applying job:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center mt-4 gap-4 top-10 md:px-6">
      {/* Job List */}
      <div className="flex flex-col gap-4 w-full md:w-1/2 m-5 md:m-0 scrollbar-hide">
        {jobs?.map((job) => (
          <div
            key={job._id}
            className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg relative flex flex-col space-y-2 ${
              selectedJob?._id === job._id ? "border-blue-600" : "border-gray-400"
            }`}
            onClick={() => handleJobClick(job)}
          >
            <div className="flex justify-between items-center">
              {job?.jobDetails?.urgentHiring === "Yes" && (
                <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">
                  Urgent Hiring
                </p>
              )}
            </div>
            <h3 className="text-lg font-semibold dark:text-white">{job.jobDetails?.title}</h3>
            <p className="text-sm text-gray-600 dark:text-white ">{job.jobDetails?.companyName}</p>
            <p className="text-sm text-gray-500 dark:text-white">
              {job.jobDetails?.workPlaceFlexibility} {job.jobDetails?.location}
            </p>

            <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">
              <AiOutlineThunderbolt className="mr-1" />
              <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
            </div>

            <div className="text-sm flex flex-col">
              <div className="flex gap-2 items-center">
                <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200">
                  {job?.jobDetails?.salary
                    .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                    .split("-")
                    .map((part, index) => (
                      <span key={index}>
                        ₹{part.trim()}
                        {index === 0 ? " - " : ""}
                      </span>
                    ))}
                </p>
                <p className="p-1 font-semibold text-green-700 rounded-md bg-green-100 flex items-center gap-1">
                  {job.jobDetails?.jobType} <FaHeart /> +1
                </p>
              </div>
              <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200 w-fit mt-1 ">
                {job.jobDetails?.duration} +1
              </p>
            </div>

            <div className="flex items-center text-sm text-blue-700 ">
              {hasAppliedToJob(job._id) && (
                <span className="text-green-600">Applied</span>
              )}
            </div>

            <div
              className="text-sm text-gray-400 flex flex-col font-semibold dark:text-white"
              style={{ listStyleType: "circle" }}
            >
              <span>{job.jobDetails?.benefits[0]}</span>
              <span>{job.jobDetails?.responsibilities[0]}</span>
              <span>{job.jobDetails?.qualifications[0]}</span>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-white">
                Active {calculateActiveDays(job?.createdAt)} days ago
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Job Details (Large Screen) */}
      {selectedJob && (
        <div className="sticky top-[60px] md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2 hidden h-fit dark:text-blue-800">
          <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-2 flex flex-col space-y-1 w-full">
            <h3 className="text-2xl font-semibold dark: text-gray-800">
              {selectedJob?.jobDetails?.title}
            </h3>
            <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
            <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
            <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
              {selectedJob?.jobDetails?.salary
                .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                .split("-")
                .map((part, index) => (
                  <span key={index}>
                    ₹{part.trim()}
                    {index === 0 ? " - " : ""}
                  </span>
                ))}
            </p>

            <div className="p-1 flex items-center w-fit text-sm text-blue-800 bg-blue-200 rounded-md">
              <AiOutlineThunderbolt className="mr-1" size={20} />
              <span className="text-blue-800">
                Typically Responds in {selectedJob?.jobDetails?.respondTime} days.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isApplied ? (
                <div className="py-2 px-5 rounded-lg text-white bg-green-600 hover:bg-green-700">
                  <div className="flex items-center gap-1">Applied</div>
                </div>
              ) : (
                <div
                  className="relative group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-5 py-2 rounded-lg ${
                      !isProfileComplete(user)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    onClick={() => handleApply(selectedJob._id)}
                    disabled={!isProfileComplete(user)}
                  >
                    Apply Now
                  </button>

                  {/* Beautiful Tooltip */}
                  {!isProfileComplete(user) && (
                    <div
                      className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 transition-all duration-300 z-50 ${
                        isHovered
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-2"
                      }`}
                    >
                      <div className="relative w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden backdrop-blur-xl">
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse"></div>

                        {/* Content */}
                        <div className="relative p-6">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <Star className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-white font-bold text-lg">
                                  Complete Your Profile
                                </h3>
                                <p className="text-gray-400 text-xs">Unlock all features</p>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">Profile Completion</span>
                              <span className="text-xs font-bold text-blue-400">
                                {completionPercentage}%
                              </span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 relative overflow-hidden"
                                style={{ width: `${completionPercentage}%` }}
                              >
                                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                              </div>
                            </div>
                          </div>

                          {/* Missing Fields */}
                          <div className="space-y-3">
                            {missingFields.map((field, index) => {
                              const Icon = field.icon;
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-200 group/item hover:bg-slate-700/70"
                                  style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: isHovered
                                      ? "slideIn 0.3s ease-out forwards"
                                      : "none",
                                  }}
                                >
                                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg group-hover/item:from-pink-500/30 group-hover/item:to-purple-600/30 transition-all">
                                    <Icon className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <span className="text-sm text-gray-300 flex-1">
                                    {field.label}
                                  </span>
                                  <AlertCircle className="w-4 h-4 text-yellow-400 opacity-50 group-hover/item:opacity-100 transition-opacity" />
                                </div>
                              );
                            })}
                          </div>

                          {/* CTA Button */}
                       <button 
                            onClick={handleNavigateToProfile}
                            className="w-full mt-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Complete Profile Now
                          </button>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                      </div>

                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-slate-800 to-slate-900 rotate-45 border-r border-b border-blue-500/20"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isApplied &&
                user &&
                (isJobBookmarked(user?._id) ? (
                  <FaBookmark
                    size={25}
                    onClick={() => handleBookmark(selectedJob._id)}
                    className="text-green-700 cursor-pointer"
                  />
                ) : (
                  <CiBookmark
                    size={25}
                    onClick={() => handleBookmark(selectedJob._id)}
                    className="cursor-pointer"
                  />
                ))}
            </div>
          </div>

          <div
            ref={jobContainerRef}
            onScroll={handleScroll}
            className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4"
          >
            <JobMajorDetails selectedJob={selectedJob} />
          </div>
        </div>
      )}

      {/* SMALL SCREEN JOB DETAILS SECTION */}
      {showJobDetails && selectedJob && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto">
          <button
            className="fixed top-4 right-4 bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300 transition duration-200 z-[100] flex items-center justify-center w-10 h-10"
            onClick={() => setShowJobDetails(false)}
          >
            <IoMdClose size={22} />
          </button>

          <div className="p-6 pt-10">
            <h3 className="text-xl font-semibold text-gray-900 pr-12">
              {selectedJob?.jobDetails?.title}
            </h3>
            <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
            <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
            <p className="mt-2 px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
              {selectedJob?.jobDetails?.salary
                .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                .split("-")
                .map((part, index) => (
                  <span key={index}>
                    ₹{part.trim()}
                    {index === 0 ? " - " : ""}
                  </span>
                ))}
            </p>

            <div className="mt-2 flex items-center text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-md w-fit">
              <AiOutlineThunderbolt className="mr-1" />
              Typically Responds in {selectedJob?.jobDetails?.respondTime} days
            </div>
          </div>

          <div className="p-2 flex items-center gap-8 border-b ml-4">
            {user &&
              (isJobBookmarked(user?._id) ? (
                <FaBookmark
                  size={25}
                  onClick={() => handleBookmark(selectedJob._id)}
                  className="text-green-700 cursor-pointer"
                />
              ) : (
                <CiBookmark
                  size={25}
                  onClick={() => handleBookmark(selectedJob._id)}
                  className="cursor-pointer"
                />
              ))}
          </div>

          <div className="p-6 h-[calc(100vh-300px)] pb-20 overflow-y-auto">
            <div className="mt-4 space-y-1">
              <p className="font-semibold text-gray-700">
                Job Type :{" "}
                <span className="text-sm text-gray-500">
                  {selectedJob?.jobDetails?.jobType}
                </span>
              </p>
              <p className="font-semibold text-gray-700">
                Duration :{" "}
                <span className="text-sm text-gray-500">
                  {selectedJob?.jobDetails?.duration}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <JobMajorDetails selectedJob={selectedJob} />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex justify-center shadow-lg">
            {isApplied ? (
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg w-full max-w-md">
                Applied
              </button>
            ) : (
              <div className="relative group w-full max-w-md">
                <button
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg w-full ${
                    !isProfileComplete(user)
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => handleApply(selectedJob._id)}
                  disabled={!isProfileComplete(user)}
                >
                  Apply Now
                </button>

                {/* Tooltip for incomplete profile - Mobile */}
                {!isProfileComplete(user) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-50">
                    <p className="font-semibold mb-2">Complete Your Profile:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {missingFields.map((field, index) => (
                        <li key={index} className="text-xs">
                          {field.label}
                        </li>
                      ))}
                    </ul>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-8 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default JobsForYou;