import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { AlertCircle, User, Phone, Mail, FileText, Briefcase, Star, GraduationCap } from 'lucide-react';

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

// ✅ DOMPurify added (nothing else changed)
import DOMPurify from "dompurify";

const JobDescription = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [isApplied, setApplied] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/v1/job/get/${jobId}`, {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Backend job response:", data);

        if (!data.success || !data.job) {
          setError("Job not found");
          return;
        }

        setJob(data.job);

        // check applied
        if (user?._id) {
          const appliedRes = await fetch(
            `/api/v1/job/${jobId}/check-applied/${user._id}`,
            { credentials: "include" }
          );
          const appliedData = await appliedRes.json();
          setApplied(appliedData.applied);
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Network error");
      }
    };

    fetchJob();
  }, [jobId, user]);

  // ========== PROFILE COMPLETION CHECK LOGIC ==========
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

    if (isApplied) {
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
        setApplied(true);
      }
    } catch (error) {
      console.error("Error applying job:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  // ✅ SANITIZED JOB DESCRIPTION (HTML SAFE)
  const sanitizedJobDescription = job?.jobDetails?.details
    ? DOMPurify.sanitize(job.jobDetails.details, {
        USE_PROFILES: { html: true },
      })
    : "";

  if (!job) {
    return (
      <div>
        <Navbar />
        <div className="text-gray-800 min-h-screen flex items-center justify-center dark:text-gray-100">
          <p className="text-lg">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Job Description & Online Application | GreatHire's Verified Hiring Opportunities
        </title>
        <meta
          name="description"
          content="The entire job details are to be found on the GreatHire website, and application is to be made from there, Hyderabad State, India, with confidence. The entire details regarding job, skills required for that job, nature and pay scales, experience level, and application status are to be found on that particular website."
        />
      </Helmet>

      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-100">
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 dark:bg-gray-700">

            {/* Back Button */}
            <div className="mb-6">
              <IoIosArrowRoundBack
                size={35}
                className="text-gray-700 hover:text-gray-800 cursor-pointer dark:text-gray-100"
                onClick={() => navigate(-1)}
              />
            </div>

            {/* Job Title */}
            <div className="border-b pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  {job?.jobDetails?.title || "Job Title Not Available"}
                </h1>
                <div className="mt-2 space-y-1">
                  <h5 className="text-md text-gray-600 dark:text-gray-100">
                    {job?.company?.companyName || "Company Not Specified"}
                  </h5>
                  <h6 className="text-sm text-gray-500 dark:text-gray-100">
                    {job?.jobDetails?.location || "Location Not Available"}
                  </h6>
                  <h6 className="text-lg text-gray-700 font-medium dark:text-gray-100">
                    {job?.jobDetails?.salary || "Salary Not Specified"}
                  </h6>
                </div>
              </div>

              {/* Apply Button with Tooltip */}
              <div className="relative group w-full md:w-auto mt-4 md:mt-0">
                <button
                  onClick={() => handleApply(job?._id)}
                  disabled={isApplied || !isProfileComplete(user)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`${
                    isApplied
                      ? "bg-green-500 cursor-not-allowed"
                      : !isProfileComplete(user)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-800"
                  } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200 w-full md:w-auto`}
                >
                  {isApplied ? "✓ Applied" : "Apply Now"}
                </button>

                {/* Tooltip for Incomplete Profile */}
                {!isProfileComplete(user) && (
                  <div
                    className={`absolute bottom-full right-0 mb-4 transition-all duration-300 z-50 ${isHovered
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
                          <div className="h-2 bg-slate-700 rounded-full">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all duration-500 relative"
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
                    <div className="absolute top-full right-0 -mt-2">
                      <div className="w-4 h-4 bg-gradient-to-br from-slate-800 to-slate-900 rotate-45 border-r border-b border-purple-500/20"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3 dark:text-gray-100">
                Job Description:
              </h2>

              {/* ✅ HTML rendered correctly */}
              <div
                className="text-gray-700 leading-relaxed text-base text-justify dark:text-gray-100"
                dangerouslySetInnerHTML={{
                  __html: sanitizedJobDescription || "No description provided.",
                }}
              />
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-gray-100">
                  Benefits:
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-base space-y-1 dark:text-gray-100">
                  {job?.jobDetails?.benefits?.length > 0 ? (
                    job.jobDetails.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))
                  ) : (
                    <li>Not specified</li>
                  )}
                </ul>
              </div>

              {/* Job Details */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-gray-100">
                  Job Details:
                </h3>
                <div className="space-y-2 text-base text-gray-600 dark:text-gray-100">
                  <p>
                    <strong>Job Type:</strong>{" "}
                    {job?.jobDetails?.jobType || "Not specified"}
                  </p>
                  <p>
                    <strong>Working Days:</strong>{" "}
                    {job?.jobDetails?.duration || "Not specified"}
                  </p>
                  <p>
                    <strong>No. of Openings:</strong>{" "}
                    {job?.jobDetails?.numberOfOpening || "Not specified"}
                  </p>
                  <p>
                    <strong>Posted Date:</strong>{" "}
                    {job?.createdAt
                      ? new Date(job.createdAt).toLocaleDateString("en-GB")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100">
                Job Requirements:
              </h2>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 dark:text-gray-100">
                    Qualifications:
                  </h4>
                  <p className="text-gray-600 text-base dark:text-gray-100">
                    {job?.jobDetails?.qualifications?.join(", ") ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 dark:text-gray-100">
                    Experience:
                  </h4>
                  <p className="text-gray-600 text-base dark:text-gray-100">
                    {job?.jobDetails?.experience || "Not specified"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 dark:text-gray-100">
                    Skills:
                  </h4>
                  <p className="text-gray-600 text-base dark:text-gray-100">
                    {job?.jobDetails?.skills?.join(", ") || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </div>

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
    </>
  );
};

export default JobDescription;