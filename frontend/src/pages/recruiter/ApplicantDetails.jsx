import React, { useState, useEffect } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiFileText,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { APPLICATION_API_END_POINT, COMPANY_API_END_POINT, VERIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";

function Tag({ children, primary }) {
  return (
    <span
      className={`inline-block text-xs px-3 py-1 rounded-full font-medium border ${
        primary
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
      }`}
    >
      {children}
    </span>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 dark:border-gray-700 my-4" />;
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

const STATUS_STYLES = {
  Shortlisted:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  "Interview Schedule":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const normalizeStatus = (value) =>
  String(value || "").trim().toLowerCase();

const ApplicantDetails = ({
  app,
  setApplicantDetailsModal,
  applicantId,
  jobId,
  user,
  setApplicants,
  shouldDeductCredit = false,
}) => {
  // Independent loading states
  const [screeningLoading, setScreeningLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isStartLoading, setIsStartLoading] = useState(false);
  const [callLogsLoading, setCallLogsLoading] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState("");

  // Applicant data
  const [freshApplicant, setFreshApplicant] = useState(null);
  const [matchScore, setMatchScore] = useState(app?.matchScore ?? null);
  const [screeningStatus, setScreeningStatus] = useState(
    app?.screeningStatus || ""
  );
  const [decisionStatus, setDecisionStatus] = useState(
    app?.status || "Pending"
  );

  // Interview data
  const [interviewStatus, setInterviewStatus] = useState(
    app?.aiInterview?.status || ""
  );
  const [logsSaved, setLogsSaved] = useState(
    Boolean(app?.aiInterview?.logsSaved)
  );
  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [callTranscript, setCallTranscript] = useState("");
  const [callRecording, setCallRecording] = useState(null);

  // Modals
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCallLogsModal, setShowCallLogsModal] = useState(false);

  // Credit
  const [creditDeducted, setCreditDeducted] = useState(false);

  // Sync state when a different applicant is opened or parent data refreshes
  useEffect(() => {
    setMatchScore(app?.matchScore ?? null);
    setScreeningStatus(app?.screeningStatus || "");
    setDecisionStatus(app?.status || "Pending");
    setInterviewStatus(app?.aiInterview?.status || "");
    setLogsSaved(Boolean(app?.aiInterview?.logsSaved));
  }, [
    app?._id,
    app?.matchScore,
    app?.screeningStatus,
    app?.status,
    app?.aiInterview?.status,
    app?.aiInterview?.logsSaved,
  ]);

  // Fetch latest applicant profile
  useEffect(() => {
    let active = true;

    const fetchFreshApplicant = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/candidate-information/${app?.applicant?._id}`,
          { withCredentials: true }
        );

        if (active && res.data.success) {
          setFreshApplicant(res.data.candidate);
        }
      } catch (error) {
        console.error("Could not fetch latest applicant profile:", error);
      }
    };

    if (app?.applicant?._id) {
      fetchFreshApplicant();
    }

    return () => {
      active = false;
    };
  }, [app?.applicant?._id]);

  // Merge fresh applicant profile with application data
  const mergedApp = freshApplicant
    ? {
        ...app,
        applicant: {
          ...app?.applicant,
          ...freshApplicant,
        },
      }
    : app;

  // Deduct credit if required
  useEffect(() => {
    const deductCredit = async () => {
      if (!shouldDeductCredit || creditDeducted) return;

      try {
        const res = await axios.post(
          `${COMPANY_API_END_POINT}/deduct-candidate-credit`,
          { companyId: user?.company?._id },
          { withCredentials: true }
        );

        if (res.data.success) {
          setCreditDeducted(true);
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message);
          setTimeout(() => setApplicantDetailsModal(false), 2000);
        }
      }
    };

    deductCredit();
  }, [
    shouldDeductCredit,
    creditDeducted,
    user?.company?._id,
    setApplicantDetailsModal,
  ]);

  // STEP 1: AI Resume Screening
  const handleScreenManually = async () => {
    if (!applicantId) {
      toast.error("Invalid applicant ID");
      return;
    }

    if (decisionStatus === "Shortlisted" || decisionStatus === "Rejected") {
      toast.error("A final decision has already been made.");
      return;
    }

    try {
      setScreeningLoading(true);

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/${applicantId}/score`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Resume screening failed");
        return;
      }

      const score =
        res.data.result?.score ??
        res.data.application?.matchScore ??
        null;

      const resultStatus =
        res.data.application?.screeningStatus ||
        res.data.screeningStatus ||
        res.data.result?.screeningStatus ||
        (score >= 75 ? "Passed" : "Needs Review");

      setMatchScore(score);
      setScreeningStatus(resultStatus);

      setApplicants((prev) =>
        prev.map((item) =>
          item._id === app._id
            ? {
                ...item,
                matchScore: score,
                screeningStatus: resultStatus,
              }
            : item
        )
      );

      toast.success(`Resume screening completed: ${score ?? "N/A"}%`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Resume screening failed"
      );
    } finally {
      setScreeningLoading(false);
    }
  };

  // Screening must be passed before interview can start
  // const screeningPassed = normalizeStatus(screeningStatus) === "passed";
const screeningCompleted = ["passed", "pending"].includes(
  normalizeStatus(screeningStatus)
);


  

  // Interview completion must come from backend/provider status
  const interviewCompleted = [
    "completed",
    "complete",
    "ended",
    "finished",
  ].includes(normalizeStatus(interviewStatus));

  // Final decision is enabled only after screening, completed interview and saved logs
const canMakeDecision =
  screeningCompleted && interviewCompleted && logsSaved === true;

  // STEP 2: Preview interview questions
  const previewInterviewQuestions = async () => {
   if (!screeningCompleted) {
  toast.error("Complete resume screening first.");
  return;
}

    if (interviewQuestions) {
      setShowPreviewModal(true);
      return;
    }

    try {
      setIsPreviewLoading(true);

      const res = await axios.post(
        `/api/v1/interview/preview/${applicantId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setInterviewQuestions(
          res.data.questions || res.data.script || ""
        );
        setShowPreviewModal(true);
      } else {
        toast.error(res.data.message || "Failed to load interview questions");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error loading interview questions"
      );
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // STEP 3: Start AI interview call
  const startAIInterview = async () => {
    if (!applicantId) {
      toast.error("Invalid applicant ID");
      return;
    }

  if (!screeningCompleted) {
  toast.error("Complete AI resume screening first.");
  return;
}

    const currentInterviewStatus = normalizeStatus(interviewStatus);

    if (
      currentInterviewStatus === "scheduled" ||
      currentInterviewStatus === "in progress" ||
      currentInterviewStatus === "connected"
    ) {
      toast.error("An interview is already scheduled or in progress.");
      return;
    }

    if (interviewCompleted) {
      toast.error("This interview is already completed.");
      return;
    }

    try {
      setIsStartLoading(true);

      const res = await axios.post(
        `/api/v1/interview/start/${applicantId}`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to start AI interview");
        return;
      }

      const newInterviewStatus =
        res.data.aiInterview?.status ||
        res.data.status ||
        "Scheduled";

      setInterviewStatus(newInterviewStatus);
      setLogsSaved(Boolean(res.data.aiInterview?.logsSaved));

      setApplicants((prev) =>
        prev.map((item) =>
          item._id === app._id
            ? {
                ...item,
                aiInterview: {
                  ...(item.aiInterview || {}),
                  ...(res.data.aiInterview || {}),
                  status: newInterviewStatus,
                },
              }
            : item
        )
      );

      toast.success(
        `AI Interview initiated. Call ID: ${
          res.data.call?.call_id || "Created"
        }`
      );
   } catch (error) {
  console.log("========== AI INTERVIEW ERROR ==========");
  console.log("Status:", error?.response?.status);
  console.log("Response Data:", error?.response?.data);
  console.log("Error Message:", error?.message);
  console.log("========================================");

  toast.error(
    error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Error starting AI interview"
  );
} finally {
      setIsStartLoading(false);
    }
  };

  // STEP 4: Fetch call logs and refresh interview state
  const fetchCallLogs = async () => {
    if (!applicantId) {
      toast.error("Invalid applicant ID");
      return;
    }

    try {
      setCallLogsLoading(true);

      const res = await axios.post(
        `/api/v1/interview/call-logs/${applicantId}`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to load call logs");
        return;
      }

      const transcript =
        res.data.transcript ||
        res.data.callData?.transcript ||
        res.data.aiInterview?.transcript ||
        "";

      const recording =
        res.data.recording ||
        res.data.callData?.recording ||
        res.data.aiInterview?.recording ||
        null;

      const latestStatus =
        res.data.aiInterview?.status ||
        res.data.callData?.status ||
        res.data.status ||
        interviewStatus;

      const saved =
        res.data.aiInterview?.logsSaved ??
        res.data.logsSaved ??
        false;

      setCallTranscript(transcript);
      setCallRecording(recording);
      setInterviewStatus(latestStatus);
      setLogsSaved(Boolean(saved));

      setApplicants((prev) =>
        prev.map((item) =>
          item._id === app._id
            ? {
                ...item,
                aiInterview: {
                  ...(item.aiInterview || {}),
                  ...(res.data.aiInterview || {}),
                  status: latestStatus,
                  transcript,
                  recording,
                  logsSaved: Boolean(saved),
                },
              }
            : item
        )
      );

      setShowCallLogsModal(true);

      if (interviewCompleted && saved) {
        toast.success("Interview logs loaded and saved.");
      } else {
        toast.success("Call logs refreshed.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error loading call logs"
      );
    } finally {
      setCallLogsLoading(false);
    }
  };

  // STEP 5: Final decision - Shortlist or Reject
  const handleFinalDecision = async (decision) => {
    if (!applicantId) {
      toast.error("Invalid applicant ID");
      return;
    }

    if (!canMakeDecision) {
      toast.error(
        "Complete screening, interview and save interview logs before final decision."
      );
      return;
    }

    if (decisionStatus === "Shortlisted" || decisionStatus === "Rejected") {
      toast.error("A final decision has already been made.");
      return;
    }

    try {
      setDecisionLoading(decision);

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicantId}/update`,
        { status: decision },
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Status update failed");
        return;
      }

      const updatedStatus =
        res.data.application?.status ||
        res.data.status ||
        decision;

      setDecisionStatus(updatedStatus);

      setApplicants((prev) =>
        prev.map((item) =>
          item._id === app._id
            ? {
                ...item,
                status: updatedStatus,
              }
            : item
        )
      );

      toast.success(
        updatedStatus === "Shortlisted"
          ? "Applicant shortlisted successfully."
          : "Applicant rejected successfully."
      );

      // Send status email without blocking the status update
      axios
        .post(
          `${VERIFICATION_API_END_POINT}/send-email-applicants/${jobId}`,
          {
            email: app?.applicant?.emailId?.email,
            status: updatedStatus,
          },
          { withCredentials: true }
        )
        .catch((error) => {
          console.error("Status email failed:", error);
        });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not update applicant status"
      );
    } finally {
      setDecisionLoading("");
    }
  };

  // Applicant profile values
  const p = mergedApp?.applicant?.profile || {};
  const skills = Array.isArray(p.skills) ? p.skills : [];
  const experiences = Array.isArray(p.experiences) ? p.experiences : [];
  const languages = Array.isArray(p.language) ? p.language : [];
  const documents = Array.isArray(p.documents)
    ? p.documents.filter((d) => d !== "None of these")
    : [];
  const categories = Array.isArray(p.category) ? p.category : [];

  const name = mergedApp?.applicant?.fullname || "—";
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const location = [
    mergedApp?.applicant?.address?.city,
    mergedApp?.applicant?.address?.state,
    mergedApp?.applicant?.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const totalExp = experiences.reduce(
    (sum, experience) => sum + (parseFloat(experience.duration) || 0),
    0
  );

  const status = decisionStatus || mergedApp?.status || "Pending";

  return (
    <>
      <Helmet>
        <title>Applicant Details | GreatHire</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setApplicantDetailsModal(false)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition mb-4"
          >
            <IoArrowBackSharp size={18} />
            Back to Applicants
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="px-6 pb-6">
              {/* Applicant heading */}
              <div className="-mt-10 mb-3 flex items-end justify-between">
                {p.profilePhoto && !p.profilePhoto.includes("github.com") ? (
                  <img
                    src={p.profilePhoto}
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-700 dark:text-blue-300 border-4 border-white dark:border-gray-800 shadow-md">
                    {initials}
                  </div>
                )}

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    STATUS_STYLES[status] || STATUS_STYLES.Pending
                  }`}
                >
                  {status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {name}
              </h2>

              {p.qualification && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {p.qualification}
                </p>
              )}

              {app?.job?.jobDetails?.title && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Applied for{" "}
                  <span className="font-semibold">
                    {app.job.jobDetails.title}
                  </span>
                </p>
              )}

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {totalExp > 0 ? totalExp : "0"}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Yrs Exp
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {skills.length}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Skills
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {experiences.length}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Jobs
                  </p>
                </div>
              </div>

              {/* Contact */}
              <Divider />
              <SectionTitle>Contact</SectionTitle>

              <div className="space-y-2">
                {mergedApp?.applicant?.emailId?.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <FiMail className="text-blue-500 shrink-0" size={15} />
                    <span className="text-gray-700 dark:text-gray-300 break-all">
                      {mergedApp.applicant.emailId.email}
                    </span>
                    {mergedApp.applicant.emailId.isVerified && (
                      <MdOutlineVerified size={15} color="green" />
                    )}
                  </div>
                )}

                {mergedApp?.applicant?.phoneNumber?.number && (
                  <div className="flex items-center gap-3 text-sm">
                    <FiPhone className="text-green-500 shrink-0" size={15} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {mergedApp.applicant.phoneNumber.number}
                    </span>
                    {mergedApp.applicant.phoneNumber.isVerified && (
                      <MdOutlineVerified size={15} color="green" />
                    )}
                  </div>
                )}

                {location && (
                  <div className="flex items-start gap-3 text-sm">
                    <FiMapPin
                      className="text-red-400 shrink-0 mt-0.5"
                      size={15}
                    />
                    <span className="text-gray-700 dark:text-gray-300 break-words min-w-0">
                      {location}
                    </span>
                  </div>
                )}

                {(p.currentCTC || p.expectedCTC) && (
                  <div className="flex gap-6 pt-2">
                    {p.currentCTC && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                          Current CTC
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          ₹{p.currentCTC}
                        </p>
                      </div>
                    )}

                    {p.expectedCTC && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                          Expected CTC
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          ₹{p.expectedCTC}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>Skills</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Tag key={index} primary={index === 0}>
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </>
              )}

              {/* Experience */}
              {experiences.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>
                    Experience ·{" "}
                    <span className="text-blue-600 dark:text-blue-400 normal-case">
                      {totalExp} yr{totalExp !== 1 ? "s" : ""} total
                    </span>
                  </SectionTitle>

                  <div className="space-y-4">
                    {experiences.map((experience, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="mt-1 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                          <FiBriefcase size={14} className="text-indigo-500" />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">
                            {experience.jobProfile || "—"}
                          </p>

                          {experience.companyName && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {experience.companyName}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {experience.duration && (
                              <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                                {experience.duration} yr
                                {parseFloat(experience.duration) !== 1
                                  ? "s"
                                  : ""}
                              </span>
                            )}

                            {experience.currentlyWorking && (
                              <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                Currently Working
                              </span>
                            )}
                          </div>

                          {experience.experienceDetails && (
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                              {experience.experienceDetails}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>Languages</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language, index) => (
                      <Tag key={index}>{language}</Tag>
                    ))}
                  </div>
                </>
              )}

              {/* Documents */}
              {documents.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>Documents</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {documents.map((document, index) => (
                      <Tag key={index}>{document}</Tag>
                    ))}
                  </div>
                </>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>Categories</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <Tag key={index}>{category}</Tag>
                    ))}
                  </div>
                </>
              )}

              {/* About */}
              {(p.bio || p.coverLetter) && (
                <>
                  <Divider />
                  <SectionTitle>About</SectionTitle>

                  {p.bio && (
                    <div className="flex gap-3 mb-2">
                      <FiUser
                        size={14}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {p.bio}
                      </p>
                    </div>
                  )}

                  {p.coverLetter && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        Cover Letter
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {p.coverLetter}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Resume */}
              {p.resume && (
                <>
                  <Divider />
                  <SectionTitle>Resume</SectionTitle>

                  <a
                    href={p.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition group"
                  >
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <FiFileText size={16} className="text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 group-hover:underline">
                        {p.resumeOriginalName || "View Resume"}
                      </p>
                      <p className="text-xs text-gray-400">Click to open</p>
                    </div>
                  </a>
                </>
              )}

              {/* Employer Q&A */}
              {app?.answers?.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>Employer Questions</SectionTitle>

                  <div className="space-y-3">
                    {app.answers.map((qa, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"
                      >
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                          Q: {qa.question}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          A: {qa.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* AI Screening Result */}
              {(matchScore != null || mergedApp?.matchScore != null) && (
                <>
                  <Divider />
                  <SectionTitle>AI Resume Screening</SectionTitle>

                  <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                        Screening Score
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Result: {screeningStatus || "Processing"}
                      </span>
                    </div>

                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {matchScore ?? mergedApp?.matchScore}%
                    </span>
                  </div>
                </>
              )}

              {/* Interview status */}
              {interviewStatus && (
                <>
                  <Divider />
                  <SectionTitle>AI Interview</SectionTitle>

                  <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Interview Status
                    </span>

                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {interviewStatus}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Interview logs: {logsSaved ? "Saved" : "Not confirmed saved"}
                  </p>
                </>
              )}

              {/* Recruiter actions */}
              <Divider />

              {user?.role === "recruiter" && (
                <div className="space-y-3">
                  {/* Flow progress */}
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-3 space-y-2">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      HIRING PROCESS
                    </p>

                    <div className="text-xs flex justify-between gap-2">
                      <span>1. Resume Screening</span>
                      <span
                        className={
                         screeningCompleted
                            ? "text-green-600 font-semibold"
                            : "text-gray-500"
                        }
                      >
                        {screeningStatus || "Not Started"}
                      </span>
                    </div>

                    <div className="text-xs flex justify-between gap-2">
                      <span>2. AI Interview</span>
                      <span
                        className={
                          interviewCompleted
                            ? "text-green-600 font-semibold"
                            : "text-gray-500"
                        }
                      >
                        {interviewStatus || "Not Started"}
                      </span>
                    </div>

                    <div className="text-xs flex justify-between gap-2">
                      <span>3. Interview Logs</span>
                      <span
                        className={
                          logsSaved
                            ? "text-green-600 font-semibold"
                            : "text-gray-500"
                        }
                      >
                        {logsSaved ? "Saved" : "Pending"}
                      </span>
                    </div>

                    <div className="text-xs flex justify-between gap-2">
                      <span>4. Final Decision</span>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        {decisionStatus}
                      </span>
                    </div>
                  </div>

                  {/* Screening, Preview, Call and Logs */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleScreenManually}
                      disabled={
                        screeningLoading ||
                        decisionStatus === "Shortlisted" ||
                        decisionStatus === "Rejected"
                      }
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition shadow-sm"
                    >
                      {screeningLoading ? "Screening..." : "⚡ Screen Resume"}
                    </button>

                    <button
                      onClick={previewInterviewQuestions}
                     disabled={!screeningCompleted || isPreviewLoading}
                      className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition shadow-sm"
                    >
                      {isPreviewLoading ? "Loading..." : "👁️ Preview"}
                    </button>

                    <button
                      onClick={startAIInterview}
                      disabled={
                        !screeningCompleted||
                        isStartLoading ||
                        ["scheduled", "in progress", "connected", "completed"].includes(
                          normalizeStatus(interviewStatus)
                        )
                      }
                      className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition shadow-sm"
                    >
                      {isStartLoading
                        ? "Connecting..."
                        : normalizeStatus(interviewStatus) === "scheduled"
                        ? "📞 Call Scheduled"
                        : normalizeStatus(interviewStatus) === "in progress"
                        ? "📞 Call In Progress"
                        : interviewCompleted
                        ? "✓ Interview Completed"
                        : "📞 AI Call"}
                    </button>

                    <button
                      onClick={fetchCallLogs}
                      disabled={
                        !interviewStatus ||
                        callLogsLoading ||
                        decisionStatus === "Shortlisted" ||
                        decisionStatus === "Rejected"
                      }
                      className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition shadow-sm"
                    >
                      {callLogsLoading ? "Loading..." : "📋 Logs"}
                    </button>
                  </div>

                  {/* Final decision */}
                  <div className="space-y-2">
                    {!canMakeDecision && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Final decision will be unlocked only when Resume Screening is Passed, the Interview is Completed, and the Interview Logs are Saved
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        className={`flex-1 py-3 text-white rounded-2xl font-semibold text-sm transition shadow-sm disabled:opacity-50 ${
                          decisionStatus === "Shortlisted"
                            ? "bg-green-600 ring-2 ring-green-300"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                        disabled={
                          !canMakeDecision ||
                          decisionLoading !== "" ||
                          decisionStatus === "Shortlisted" ||
                          decisionStatus === "Rejected"
                        }
                        onClick={() => handleFinalDecision("Shortlisted")}
                      >
                        {decisionLoading === "Shortlisted"
                          ? "Shortlisting..."
                          : decisionStatus === "Shortlisted"
                          ? "✓ Shortlisted"
                          : "✅ Shortlist"}
                      </button>

                      <button
                        className={`flex-1 py-3 text-white rounded-2xl font-semibold text-sm transition shadow-sm disabled:opacity-50 ${
                          decisionStatus === "Rejected"
                            ? "bg-red-600 ring-2 ring-red-300"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                        disabled={
                          !canMakeDecision ||
                          decisionLoading !== "" ||
                          decisionStatus === "Shortlisted" ||
                          decisionStatus === "Rejected"
                        }
                        onClick={() => handleFinalDecision("Rejected")}
                      >
                        {decisionLoading === "Rejected"
                          ? "Rejecting..."
                          : decisionStatus === "Rejected"
                          ? "✕ Rejected"
                          : "❌ Reject"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Interview questions preview modal */}
              {showPreviewModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Interview Questions Preview
                      </h3>

                      <button
                        onClick={() => setShowPreviewModal(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {interviewQuestions}
                    </div>
                  </div>
                </div>
              )}

              {/* Call logs modal */}
              {showCallLogsModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        📞 Call Logs
                      </h3>

                      <div className="flex gap-2">
                        <button
                          onClick={fetchCallLogs}
                          disabled={callLogsLoading}
                          className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition"
                          title="Refresh transcript"
                        >
                          {callLogsLoading ? "Refreshing..." : "🔄 Refresh"}
                        </button>

                        <button
                          onClick={() => setShowCallLogsModal(false)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto mb-4">
                      {callTranscript.trim() &&
                      !callTranscript.toLowerCase().includes("not yet available") &&
                      !callTranscript.toLowerCase().includes("being processed") ? (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-mono whitespace-pre-wrap break-words">
                            {callTranscript}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg text-center">
                          <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                            ⏳ Transcript Processing
                          </p>

                          <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                            Transcript is not available yet. Use Refresh to check again.
                          </p>

                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                            {callTranscript || "No transcript received yet."}
                          </p>

                          <button
                            onClick={fetchCallLogs}
                            disabled={callLogsLoading}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition"
                          >
                            {callLogsLoading ? "Loading..." : "🔄 Refresh Now"}
                          </button>
                        </div>
                      )}
                    </div>

                    {callRecording && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          🎙️ Call Recording
                        </h4>

                        <audio
                          controls
                          className="w-full rounded-lg h-10 bg-gray-100 dark:bg-gray-700"
                          controlsList="nodownload"
                        >
                          <source src={callRecording} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantDetails;