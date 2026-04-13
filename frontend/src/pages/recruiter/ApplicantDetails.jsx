import React, { useState, useEffect } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { FiMail, FiPhone, FiMapPin, FiBriefcase, FiFileText, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { updateCandidateCredits } from "@/redux/companySlice";
import {
  APPLICATION_API_END_POINT,
  VERIFICATION_API_END_POINT,
  COMPANY_API_END_POINT,
} from "@/utils/ApiEndPoint";

function Tag({ children, primary }) {
  return (
    <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium border ${
      primary
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
    }`}>{children}</span>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 dark:border-gray-700 my-4" />;
}

function SectionTitle({ children }) {
  return <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{children}</h3>;
}

const STATUS_STYLES = {
  Shortlisted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  "Interview Schedule": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const ApplicantDetails = ({
  app,
  setApplicantDetailsModal,
  applicantId,
  jobId,
  user,
  setApplicants,
  shouldDeductCredit = false,
}) => {
  const [loading, setLoading] = useState(0);
  const [creditDeducted, setCreditDeducted] = useState(false);
  const [freshApplicant, setFreshApplicant] = useState(null);
  const { company } = useSelector((state) => state.company);
  const dispatch = useDispatch();

  // Always fetch fresh applicant data on open
  useEffect(() => {
    const fetchFresh = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/candidate-information/${app?.applicant?._id}`,
          { withCredentials: true }
        );
        if (res.data.success) setFreshApplicant(res.data.candidate);
      } catch {}
    };
    if (app?.applicant?._id) fetchFresh();
  }, [app?.applicant?._id]);

  // Merge fresh data over cached app data
  const mergedApp = freshApplicant
    ? { ...app, applicant: { ...app.applicant, ...freshApplicant } }
    : app;

  useEffect(() => {
    const deductCredit = async () => {
      if (!shouldDeductCredit || creditDeducted || !company?._id) return;
      try {
        const res = await axios.post(
          `${COMPANY_API_END_POINT}/deduct-candidate-credit`,
          { companyId: company._id },
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(updateCandidateCredits(res.data.remainingCredits));
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
  }, [company, creditDeducted, dispatch, setApplicantDetailsModal, shouldDeductCredit]);

  const updateStatus = async (status) => {
    try {
      setLoading(status);
      const statusString = status === 1 ? "Shortlisted" : "Rejected";
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicantId}/update`,
        { status: statusString },
        { withCredentials: true }
      );
      if (res.data.success) {
        const emailRes = await axios.post(
          `${VERIFICATION_API_END_POINT}/send-email-applicants/${jobId}`,
          { email: app?.applicant?.emailId?.email, status: statusString },
          { withCredentials: true }
        );
        if (emailRes.data.success) {
          setApplicants((prev) =>
            prev.map((a) => a._id === app._id ? { ...a, status: statusString } : a)
          );
          toast.success("Status Updated");
        }
      } else {
        toast.error("Status updation failed");
      }
    } catch {
      toast.error("An error occurred while updating the status");
    } finally {
      setLoading(0);
    }
  };

  const p = mergedApp?.applicant?.profile || {};
  const skills = Array.isArray(p.skills) ? p.skills : [];
  const experiences = Array.isArray(p.experiences) ? p.experiences : [];
  const languages = Array.isArray(p.language) ? p.language : [];
  const documents = Array.isArray(p.documents) ? p.documents.filter(d => d !== "None of these") : [];
  const categories = Array.isArray(p.category) ? p.category : [];
  const name = mergedApp?.applicant?.fullname || "—";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const location = [mergedApp?.applicant?.address?.city, mergedApp?.applicant?.address?.state, mergedApp?.applicant?.address?.country].filter(Boolean).join(", ");
  const totalExp = experiences.reduce((sum, e) => sum + (parseFloat(e.duration) || 0), 0);
  const status = mergedApp?.status || "Pending";

  return (
    <>
      <Helmet><title>Applicant Details | GreatHire</title></Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
        <div className="max-w-2xl mx-auto">

          {/* Back */}
          <button
            onClick={() => setApplicantDetailsModal(false)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition mb-4"
          >
            <IoArrowBackSharp size={18} /> Back to Applicants
          </button>

          {/* Single Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

            {/* Banner + Avatar */}
            <div className="h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <div className="px-6 pb-6">
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
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}>
                  {status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
              {p.qualification && <p className="text-sm text-gray-500 dark:text-gray-400">{p.qualification}</p>}
              {app?.job?.jobDetails?.title && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Applied for <span className="font-semibold">{app.job.jobDetails.title}</span>
                </p>
              )}

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{totalExp > 0 ? totalExp : "0"}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Yrs Exp</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{skills.length}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Skills</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{experiences.length}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Jobs</p>
                </div>
              </div>

              {/* Contact */}
              <Divider />
              <SectionTitle>Contact</SectionTitle>
              <div className="space-y-2">
                {app?.applicant?.emailId?.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <FiMail className="text-blue-500 shrink-0" size={15} />
                    <span className="text-gray-700 dark:text-gray-300 break-all">{app.applicant.emailId.email}</span>
                    {app.applicant.emailId.isVerified && <MdOutlineVerified size={15} color="green" />}
                  </div>
                )}
                {app?.applicant?.phoneNumber?.number && (
                  <div className="flex items-center gap-3 text-sm">
                    <FiPhone className="text-green-500 shrink-0" size={15} />
                    <span className="text-gray-700 dark:text-gray-300">{app.applicant.phoneNumber.number}</span>
                    {app.applicant.phoneNumber.isVerified && <MdOutlineVerified size={15} color="green" />}
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-3 text-sm">
                    <FiMapPin className="text-red-400 shrink-0" size={15} />
                    <span className="text-gray-700 dark:text-gray-300">{location}</span>
                  </div>
                )}
                {(p.currentCTC || p.expectedCTC) && (
                  <div className="flex gap-6 pt-2">
                    {p.currentCTC && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Current CTC</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">₹{p.currentCTC}</p>
                      </div>
                    )}
                    {p.expectedCTC && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Expected CTC</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">₹{p.expectedCTC}</p>
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
                    {skills.map((s, i) => <Tag key={i} primary={i === 0}>{s}</Tag>)}
                  </div>
                </>
              )}

              {/* Experience */}
              {experiences.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>Experience · <span className="text-blue-600 dark:text-blue-400 normal-case">{totalExp} yr{totalExp !== 1 ? "s" : ""} total</span></SectionTitle>
                  <div className="space-y-4">
                    {experiences.map((exp, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="mt-1 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                          <FiBriefcase size={14} className="text-indigo-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{exp.jobProfile || "—"}</p>
                          {exp.companyName && <p className="text-xs text-gray-500 dark:text-gray-400">{exp.companyName}</p>}
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {exp.duration && (
                              <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                                {exp.duration} yr{parseFloat(exp.duration) !== 1 ? "s" : ""}
                              </span>
                            )}
                            {exp.currentlyWorking && (
                              <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                Currently Working
                              </span>
                            )}
                          </div>
                          {exp.experienceDetails && (
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{exp.experienceDetails}</p>
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
                  <div className="flex flex-wrap gap-2">{languages.map((l, i) => <Tag key={i}>{l}</Tag>)}</div>
                </>
              )}

              {/* Documents */}
              {documents.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>Documents</SectionTitle>
                  <div className="flex flex-wrap gap-2">{documents.map((d, i) => <Tag key={i}>{d}</Tag>)}</div>
                </>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <>
                  <Divider />
                  <SectionTitle>Categories</SectionTitle>
                  <div className="flex flex-wrap gap-2">{categories.map((c, i) => <Tag key={i}>{c}</Tag>)}</div>
                </>
              )}

              {/* Bio */}
              {(p.bio || p.coverLetter) && (
                <>
                  <Divider />
                  <SectionTitle>About</SectionTitle>
                  {p.bio && (
                    <div className="flex gap-3 mb-2">
                      <FiUser size={14} className="text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{p.bio}</p>
                    </div>
                  )}
                  {p.coverLetter && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Cover Letter</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{p.coverLetter}</p>
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
                    {app.answers.map((qa, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Q: {qa.question}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">A: {qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Actions */}
              <Divider />
              {user?.role === "recruiter" && app.status === "Pending" ? (
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
                    disabled={loading === 1 || loading === -1}
                    onClick={() => updateStatus(1)}
                  >
                    {loading === 1 ? "Updating..." : "✅ Shortlist"}
                  </button>
                  <button
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
                    disabled={loading === 1 || loading === -1}
                    onClick={() => updateStatus(-1)}
                  >
                    {loading === -1 ? "Updating..." : "❌ Reject"}
                  </button>
                </div>
              ) : (
                <div className={`text-center font-semibold text-sm py-3 rounded-2xl ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}>
                  {status}
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
