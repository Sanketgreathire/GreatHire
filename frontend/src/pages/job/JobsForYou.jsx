import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark, FaHeart, FaShareAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import JobMajorDetails from "./JobMajorDetails";
import ShareCard from "./ShareJob";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertCircle, User, Phone, Mail, FileText, Briefcase, Star, GraduationCap } from 'lucide-react';

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const JobsForYou = ({ jobs = [] }) => {
  // Access functions from context
  const { selectedJob, setSelectedJob, toggleBookmarkStatus } = useJobDetails();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State for small screen job details
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [shareJobId, setShareJobId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Ref to track the scrollable container & share card container
  const jobContainerRef = useRef(null);
  const shareCardRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // ========== CLICK OUTSIDE HANDLER FOR SHARE CARD ==========
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareCardRef.current && !shareCardRef.current.contains(e.target)) {
        setShareJobId(null);
      }
    };

    if (shareJobId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareJobId]);

  // ========== RESPONSIVE HANDLER ==========
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowJobDetails(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ========== SCROLL MANAGEMENT ==========
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

  // ========== UTILITY FUNCTIONS ==========

  const isApplied =
    selectedJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const hasAppliedToJob = (jobId) =>
    jobs.some(
      (job) =>
        job._id === jobId &&
        job?.application?.some(
          (application) => application.applicant === user?._id
        )
    );

  const isJobBookmarked = (userId) =>
    selectedJob?.saveJob?.includes(userId);

  const calculateActiveDays = (createdAt) => {
    const jobCreatedDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - jobCreatedDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  // ========== BOOKMARK HANDLER ==========
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

  // ========== JOB CLICK HANDLER ==========
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

  // ========== APPLY JOB HANDLER ==========
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

    // try {
    //   const payload = {
    //     applicant: user._id,
    //     applicantName: user.fullname || user.name,
    //     applicantEmail: user.email,
    //     applicantPhone: user.phoneNumber,
    //     applicantProfile: user.profile,
    //   };
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

  // ========== RENDER ==========
  return (
    <>

      <Helmet>
        <title>Jobs Recommended for You | Easily Apply Using Smart Matching - GreatHire</title>
        <meta
          name="description"
          content="GreatHire is a contemporary recruitment portal where talented individuals are paired with authentic organizations for the sectors of technology, business, healthcare, and new sectors within the boundaries of the state of Hyderabad. GreatHire will provide intelligent suggestions for jobs based on your profile, skills, and preferences. Search job openings, compare salaries, explore job details with a one-click functionality, bookmark jobs you like, and apply to jobs without switching screens. The purpose of this webpage is to reduce job searching efforts where more accuracy and response rates can be obtained."
        />
      </Helmet>


      <div className="w-full mt-4 ">
        {/* Job List Container - FIXED OVERFLOW */}
        <div className="flex justify-center gap-6">

          {/* Left: Job Cards List - FIXED WIDTH & OVERFLOW */}
          <div className="flex flex-col gap-4 w-full md:w-1/3 md:max-w-[600px] m-2 md:m-0 overflow-y-auto scrollbar-hide max-h-[calc(152vh-80px)]">
            {jobs?.map((job) => (
              <div
                key={job._id}
                className={`p-5 border rounded-lg cursor-pointer transition-all shadow-md hover:shadow-lg flex-shrink-0 relative ${selectedJob?._id === job._id
                  ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                onClick={() => handleJobClick(job)}
              >
                {/* Top Row: Title, Company & Urgent Badge + Share Icon */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 leading-tight truncate">
                      {job.jobDetails?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {job.jobDetails?.companyName}
                    </p>
                  </div>

                  {/* Right side: Urgent Badge + Share Icon */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Urgent Hiring Badge */}
                    {job?.jobDetails?.urgentHiring === "Yes" && (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded whitespace-nowrap">
                        Urgent Hiring
                      </span>
                    )}

                    {/* Share Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareJobId(shareJobId === job._id ? null : job._id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Share Job"
                    >
                      <FaShareAlt size={16} className="text-gray-600 hover:text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* Share Card - WRAPPED IN REF */}
                {shareJobId === job._id && (
                  <div ref={shareCardRef} onClick={(e) => e.stopPropagation()} className="relative">
                    <ShareCard
                      urlToShare={`${window.location.origin}/jobs/${job._id}`}
                      jobTitle={job.jobDetails?.title}
                      jobLocation={job.jobDetails?.location}
                      jobSalary={job.jobDetails?.salary}
                      jobDuration={job.jobDetails?.duration}
                      jobType={job.jobDetails?.jobType}
                      onClose={() => setShareJobId(null)}
                    />
                  </div>
                )}

                {/* Benefits, Responsibilities, Qualifications Preview */}
                <div className="mb-2 pb-2 border-b border-gray-100">
                  <div className="text-xs text-gray-600 space-y-1">
                    {job.jobDetails?.benefits?.[0] && (
                      <p className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span className="truncate">{job.jobDetails.benefits[0]}</span>
                      </p>
                    )}
                    {job.jobDetails?.responsibilities?.[0] && (
                      <p className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span className="truncate">{job.jobDetails.responsibilities[0]}</span>
                      </p>
                    )}
                    {job.jobDetails?.qualifications?.[0] && (
                      <p className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span className="truncate">{job.jobDetails.qualifications[0]}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle Row: Location, Flexibility & Job Type */}
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  {/* Location */}
                  <span className="text-xs text-gray-700 bg-gray-50 border border-gray-200 px-2 py-1 rounded truncate max-w-[150px]">
                    {job.jobDetails?.location}
                  </span>

                  {/* Workplace Flexibility */}
                  <span className="text-xs text-gray-700 bg-gray-50 border border-gray-200 px-2 py-1 rounded truncate max-w-[120px]">
                    {job.jobDetails?.workPlaceFlexibility}
                  </span>

                  {/* Job Type */}
                  <span className="text-xs text-gray-700 bg-gray-50 border border-gray-200 px-2 py-1 rounded truncate max-w-[100px]">
                    {job.jobDetails?.jobType}
                  </span>

                  {/* Applied Status Badge */}
                  {hasAppliedToJob(job._id) && (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded ml-auto flex-shrink-0">
                      ✓ Applied
                    </span>
                  )}
                </div>

                {/* Bottom Row: Salary, Duration, Active Days & Response Time */}
                <div className="flex flex-wrap justify-between items-center gap-3 text-xs border-t border-gray-100 pt-2">
                  {/* Left Side - Salary & Duration */}
                  <div className="flex gap-2 items-center min-w-0 flex-1">
                    {/* Salary */}
                    <span className="font-semibold text-gray-900 truncate">
                      {job?.jobDetails?.salary
                        .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                        .split("-")
                        .map((part, index) => (
                          <span key={index}>
                            ₹{part.trim()}
                            {index === 0 ? " - " : ""}
                          </span>
                        ))}
                    </span>

                    {/* Duration */}
                    <span className="text-gray-600 truncate">
                      • {job.jobDetails?.duration}
                    </span>
                  </div>

                  {/* Right Side - Active Days & Response Time */}
                  <div className="flex gap-3 items-center text-gray-600 flex-shrink-0">
                    {/* Active Days */}
                    <span className="whitespace-nowrap">
                      {calculateActiveDays(job?.createdAt)}d ago
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Job Details Panel (Desktop only) - FIXED WIDTH & OVERFLOW */}
          {selectedJob && (
            <div className="sticky top-[60px] md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-2/3 md:max-w-[700px] hidden h-[calc(150vh-80px)] dark:text-pink-800">

              {/* Header (Sticky) */} 
              {/* <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50 z-10 shadow-lg border-b-2 border-sky-200 px-6 py-5 space-y-4 w-full relative"> */}
              <div className="flex-shrink-0 bg-gray-100 shadow-lg border-b-2 border-sky-200 px-6 py-5 space-y-4 w-full relative">
                {/* Bookmark Icon - Top Right Corner */}
                {!isApplied && user && (
                  <div className="absolute top-5 right-6">
                    {isJobBookmarked(user?._id) ? (
                      <FaBookmark
                        size={26}
                        onClick={() => handleBookmark(selectedJob._id)}
                        className="text-cyan-600 cursor-pointer hover:text-cyan-700 transition-colors"
                      />
                    ) : (
                      <CiBookmark
                        size={26}
                        onClick={() => handleBookmark(selectedJob._id)}
                        className="cursor-pointer text-sky-500 hover:text-sky-600 transition-colors"
                      />
                    )}
                  </div>
                )}

                {/* Job Title */}
                <h3 className="text-2xl font-bold text-sky-900 truncate pr-12  tracking-wide">
                  {selectedJob?.jobDetails?.title}
                </h3>

                {/* Company Name and Location Row */}
                <div className="flex justify-between items-center gap-4 pr-12">
                  {/* Company Name - Left Side */}
                  <p className="lg:text-lg md:text-md  font-semibold text-cyan-900 truncate">
                    {selectedJob?.jobDetails?.companyName}
                  </p>

                  {/* Location - Right Side */}
                  <p className="lg:text-lg md:text-md text-sky-900 flex items-center gap-1.5 flex-shrink-0">
                    <span className="lg:text-xl md:text-md">📍</span>
                    <span className="whitespace-nowrap">{selectedJob?.jobDetails?.location}</span>
                  </p>
                </div>

                {/* Salary & Response Time Row */}
                <div className="flex justify-between items-center gap-3 pt-1">
                  {/* Salary - Left Side */}
                  <div className="flex-1 px-3 py-1.5 font-bold text-sky-900 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-sky-300 flex items-center justify-center shadow-sm">
                    {selectedJob?.jobDetails?.salary
                      .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                      .split(" - ")
                      .map((part, index) => (
                        <span key={index}>
                          ₹{part.trim()}
                          {index === 0 ? " - " : ""}
                        </span>
                      ))}
                  </div>

                  {/* Response Time - Right Side */}
                  <div className="px-3 py-1.5 flex items-center gap-2 text-sm font-semibold text-cyan-900 bg-gradient-to-r from-cyan-90 to-blue-10 border-2 border-cyan-500 rounded-xl shadow-sm dark:bg-gradient-to-r dark:from-cyan-50 dark:to-blue-50">
                    <AiOutlineThunderbolt className="flex-shrink-0 text-cyan-600" size={18} />
                    <span className="truncate">
                      Typically Responds in {selectedJob?.jobDetails?.respondTime} day(s)
                    </span>
                  </div>
                </div>
                {/* Apply Button - Full Width */}
                <div className="pt-2">
                  <div
                    className={`w-full py-2.5 px-6 rounded-xl text-white font-bold text-center text-lg shadow-md transition-all duration-300 ${isApplied
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-sky-600 hover:from-sky-700 hover:to-blue-700 cursor-pointer transform hover:scale-[1.02]"
                      }`}
                  >
                    {isApplied ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xl">✓</span> Applied
                      </div>
                    ) : (
                      <div
                        className="relative group w-full"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <button
                          className={`w-full flex items-center justify-center gap-2 ${!isProfileComplete(user)
                            ? "cursor-not-allowed"
                            : ""
                            }`}
                          onClick={() => handleApply(selectedJob._id)}
                          disabled={!isProfileComplete(user)}
                        >
                          Apply Now
                        </button>

                        {/* Beautiful Tooltip */}
                        {!isProfileComplete(user) && (
                          <div
                            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 transition-all duration-300 z-50 ${isHovered
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible translate-y-2"
                              }`}
                          >
                            <div className="relative w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/20 backdrop-blur-xl">
                              {/* Animated background gradient */}
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-purple-500/10 animate-pulse"></div>

                              {/* Content */}
                              <div className="relative p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
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
                                    <span className="text-xs font-bold text-purple-400">
                                      {completionPercentage}%
                                    </span>
                                  </div>
                                  <div className="h-2 bg-slate-700 rounded-full ">
                                    <div
                                      className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all duration-500 relative "
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
                                        className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:border-purple-500/50 transition-all duration-200 group/item hover:bg-slate-700/70"
                                        style={{
                                          animationDelay: `${index * 100}ms`,
                                          animation: isHovered
                                            ? "slideIn 0.3s ease-out forwards"
                                            : "none",
                                        }}
                                      >
                                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-lg group-hover/item:from-purple-500/30 group-hover/item:to-violet-600/30 transition-all">
                                          <Icon className="w-4 h-4 text-purple-400" />
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
                                  className="w-full mt-5 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                  Complete Profile Now
                                </button>
                              </div>

                              {/* Decorative elements */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"></div>
                            </div>

                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2">
                              <div className="w-4 h-4 bg-gradient-to-br from-slate-800 to-slate-900 rotate-45 border-r border-b border-purple-500/20"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Details */}
              <div
                ref={jobContainerRef}
                onScroll={handleScroll}
                className="overflow-y-auto scrollbar-hide flex-1 px-4 py-4"
              >
                <JobMajorDetails selectedJob={selectedJob} />
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Full-Screen Job Details */}
        {showJobDetails && selectedJob && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto">

            {/* Close Button */}
            <button
              className="fixed top-[80px] right-4 bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300 transition duration-200 z-[100] flex items-center justify-center w-10 h-10"
              onClick={() => setShowJobDetails(false)}
            >
              <IoMdClose size={22} />
            </button>

            {/* Content */}
            <div className="p-6 pt-20 pb-24">
              <h3 className="text-xl font-semibold text-gray-900 pr-12">
                {selectedJob?.jobDetails?.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {selectedJob?.jobDetails?.companyName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {selectedJob?.jobDetails?.location}
              </p>

              {/* Salary */}
              <p className="mt-2 px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200 max-w-full break-words">
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

              {/* Response Time */}
              <div className="mt-2 flex items-center text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-md w-fit max-w-full">
                <AiOutlineThunderbolt className="mr-1 flex-shrink-0" />
                <span className="truncate">Typically Responds in {selectedJob?.jobDetails?.respondTime} days</span>
              </div>

              {/* Bookmark Button */}
              <div className="p-2 flex items-center gap-8 border-b ml-4 mt-4">
                {user && (
                  isJobBookmarked(user?._id) ? (
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
                  )
                )}
              </div>

              {/* Job Details */}
              <div className="mt-4 space-y-1 ">
                <p className="font-semibold text-gray-700">
                  Job Type:{" "}
                  <span className="text-sm text-gray-500 break-words">
                    {selectedJob?.jobDetails?.jobType}
                  </span>
                </p>
                <p className="font-semibold text-gray-700">
                  Duration:{" "}
                  <span className="text-sm text-gray-500 break-words">
                    {selectedJob?.jobDetails?.duration}
                  </span>
                </p>
              </div>

              <div className="mt-4 ">
                <JobMajorDetails selectedJob={selectedJob} />
              </div>
            </div>

            {/* Apply Button (Fixed at Bottom) */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex justify-center shadow-lg">
              {isApplied ? (
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg w-full max-w-md">
                  Applied
                </button>
              ) : (
                <div className="relative group w-full max-w-md">
                  <button
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg w-full ${!isProfileComplete(user)
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
    </>
  );
};

export default JobsForYou;