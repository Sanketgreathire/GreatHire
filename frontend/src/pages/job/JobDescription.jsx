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
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

const JobDescription = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // const { jobId } = useParams();
  const { jobId: jobParam } = useParams();
  const jobId = jobParam?.length === 24 ? jobParam : jobParam?.split("-").pop();

  const [job, setJob] = useState(null);
  const [isApplied, setApplied] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [questionsModal, setQuestionsModal] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/v1/job/get/${jobId}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success || !data.job) {
          setError("Job not found");
          return;
        }

        setJob(data.job);

        if (user?._id) {
          const appliedRes = await fetch(
            `/api/v1/job/${jobId}/check-applied/${user._id}`,
            { credentials: "include" }
          );
          const appliedData = await appliedRes.json();
          setApplied(appliedData.applied);
        }
      } catch (err) {
        setError("Network error");
      }
    };

    fetchJob();
  }, [jobId, user]);

  // ================= PROFILE CHECK =================

  const getMissingProfileFields = (userData = user) => {
    if (!userData) return [];

    const missingFields = [];

    const email = userData?.emailId?.email || userData?.email;
    if (!email) missingFields.push({ label: "Email Address", icon: Mail });

    const phone = userData?.phoneNumber?.number || userData?.phoneNumber;
    if (!phone) missingFields.push({ label: "Contact Number", icon: Phone });

    const resume = userData?.profile?.resume;
    if (!resume) missingFields.push({ label: "Resume/CV", icon: FileText });

    const gender = userData?.profile?.gender || userData?.gender;
    if (!gender) missingFields.push({ label: "Gender", icon: User });

    const qualification = userData?.profile?.qualification;
    if (!qualification)
      missingFields.push({ label: "Highest Qualification", icon: GraduationCap });

    const skills = userData?.profile?.skills;
    if (!skills || skills.length === 0)
      missingFields.push({ label: "Skills", icon: Briefcase });

    const bio = userData?.profile?.bio;
    if (!bio) missingFields.push({ label: "Profile Summary/Bio", icon: FileText });

    return missingFields;
  };

  const isProfileComplete = (userData = user) => {
    return getMissingProfileFields(userData).length === 0;
  };

  const missingFields = getMissingProfileFields(user);
  const totalFields = 7;
  const completionPercentage = Math.round(
    ((totalFields - missingFields.length) / totalFields) * 100
  );

  // ================= APPLY HANDLER =================

  const handleApply = async (jobId) => {

    // 🔥 NOT LOGGED IN → REDIRECT TO SIGNUP
    if (!user) {
      toast.error("Please signup or login to apply");

      setTimeout(() => {
        navigate("/jobseeker-login", { state: { from: `/jobs/${jobId}` } });
      }, 600);

      return;
    }

    if (isApplied) {
      toast.error("Already applied");
      return;
    }

    const missingFieldsList = getMissingProfileFields(user);
    if (missingFieldsList.length > 0) {
      return;
    }

    if (job?.questions?.length > 0) {
      setQuestionAnswers(job.questions.map(q => ({ question: q, answer: "" })));
      setQuestionsModal(true);
      return;
    }

    await submitApply(jobId, []);
  };

  const submitApply = async (jobId, answers) => {
    try {
      const payload = {
        applicant: user._id,
        applicantName: user.fullname || user.name,
        applicantEmail: user.email,
        applicantPhone: user.phoneNumber?.number || user.phoneNumber,
        applicantProfile: user.profile,
        answers,
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
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleQuestionsSubmit = async () => {
    if (questionAnswers.some(a => !a.answer.trim())) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    setQuestionsModal(false);
    await submitApply(job._id, questionAnswers);
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  const sanitizedJobDescription = job?.jobDetails?.details
    ? DOMPurify.sanitize(job.jobDetails.details)
    : "";

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading job details...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{job?.jobDetails?.title} | GreatHire</title>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">

          {/* Back */}
          <IoIosArrowRoundBack
            size={35}
            className="cursor-pointer mb-6"
            onClick={() => navigate(-1)}
          />

          {/* Header */}
          <div className="border-b pb-6 mb-8 flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold">
                {job?.jobDetails?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {job?.company?.companyName}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {job?.jobDetails?.location}
              </p>
            </div>

            {/* APPLY BUTTON */}
            <div className="relative group">

              <button
                onClick={() => {
                  setIsClicked(true);
                  handleApply(job?._id);
                  setTimeout(() => setIsClicked(false), 200);
                }}
                disabled={isApplied}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  ${isApplied
                    ? "bg-green-500 dark:bg-green-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-900"
                  }
                  ${isClicked ? "scale-95" : "scale-100"}
                  text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200
                `}
              >
                {isApplied ? "✓ Applied" : "Apply Now"}
              </button>

              {/* PROFILE TOOLTIP */}
              {user && !isProfileComplete(user) && !isApplied && (
                <div className={`absolute right-0 mt-3 w-80 transition-all ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div className="bg-slate-900 text-white dark:bg-gray-700 rounded-xl p-5 shadow-xl">

                    <h3 className="font-bold mb-3">Complete Your Profile</h3>

                    <div className="mb-3 text-sm">
                      Completion: {completionPercentage}%
                    </div>

                    <div className="space-y-2">
                      {missingFields.map((field, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle size={14} className="text-yellow-400 dark:text-yellow-500" />
                          {field.label}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleNavigateToProfile}
                      className="mt-4 w-full bg-purple-600 dark:bg-purple-700 py-2 rounded-lg"
                    >
                      Complete Profile Now
                    </button>

                  </div>
                </div>
              )}

            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-xl font-bold mb-3">Job Description:</h2>

            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: sanitizedJobDescription || "No description provided.",
              }}
            />
          </div>

        </div>
      </div>

      <Footer />

      {/* Questions Modal */}
      {questionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Employer Questions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please answer all questions to complete your application.</p>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {questionAnswers.map((qa, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Q{idx + 1}: {qa.question}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your answer"
                    value={qa.answer}
                    onChange={(e) => {
                      const updated = [...questionAnswers];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      setQuestionAnswers(updated);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setQuestionsModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleQuestionsSubmit}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Submit & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobDescription;