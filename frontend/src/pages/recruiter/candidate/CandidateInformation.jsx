import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Briefcase, FileText, Eye, CheckCircle, ArrowLeft, Star, IdCard } from "lucide-react";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";

const DOC_ICONS = {
  "PAN Card": <IdCard className="w-5 h-5 text-blue-600" />,
  "Aadhar Card": <IdCard className="w-5 h-5 text-blue-600" />,
  Passport: <FileText className="w-5 h-5 text-blue-600" />,
};

const CandidateInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/candidate-information/${id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setCandidate(res.data.candidate);
          setShortlisted(Boolean(res.data.candidate?.isShortlisted));
        }
      } catch {
        setError("Failed to load candidate");
      }
      setLoading(false);
    };
    fetchCandidate();
  }, [id]);

  const normalizedExperiences = useMemo(() => {
    const profile = candidate?.profile;
    let list = [];
    if (Array.isArray(profile?.experiences)) list = [...profile.experiences];
    else if (typeof profile?.experiences === "string") {
      try {
        const parsed = JSON.parse(profile.experiences);
        if (Array.isArray(parsed)) list = [...parsed];
      } catch {}
    }
    if (profile?.experience && profile.experience.jobProfile?.trim()) {
      list.push(profile.experience);
    }
    return list;
  }, [candidate?.profile]);

  const { qualificationToDisplay, firstExp, totalYears } = useMemo(() => {
    const profile = candidate?.profile;
    const qual = profile?.qualification === "Others" ? profile?.otherQualification : profile?.qualification;
    const years = normalizedExperiences.reduce((sum, exp) => sum + (parseFloat(exp.duration) || 0), 0);
    return { qualificationToDisplay: qual, firstExp: normalizedExperiences[0], totalYears: years };
  }, [candidate?.profile, normalizedExperiences]);

  const handleDownloadResume = () => {
    if (candidate?.profile?.resume) window.open(encodeURI(candidate.profile.resume), "_blank");
    else toast.error("Resume not available");
  };

  const handleShortlistToggle = () => {
    setShortlisted((s) => !s);
    toast.success(!shortlisted ? "Shortlisted" : "Removed from shortlist");
  };

  if (loading) return <p className="text-center mt-20 text-xl dark:text-gray-200">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600 dark:text-red-400">{error}</p>;
  if (!candidate) return <p className="text-center mt-20 text-gray-600 dark:text-gray-400">No candidate found</p>;

  const email = candidate?.emailId?.email || candidate?.email;
  const phone = candidate?.phoneNumber?.number;
  const location = [candidate?.address?.city, candidate?.address?.state, candidate?.address?.country].filter(Boolean).join(", ");
  const skills = Array.isArray(candidate?.profile?.skills)
    ? candidate.profile.skills
    : typeof candidate?.profile?.skills === "string"
    ? candidate.profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <>
      <Helmet>
        <title>Candidate Profile | GreatHire</title>
        <meta name="description" content="View candidate profile, experience, skills and contact details on GreatHire." />
      </Helmet>

      <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900">
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold">
              <span className="text-gray-900 dark:text-white">Great</span>
              <span className="text-blue-600">Hire</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className={`${shortlisted ? "bg-yellow-500 hover:bg-yellow-600" : "bg-indigo-600 hover:bg-indigo-700"} text-white flex items-center gap-1.5`}
              onClick={handleShortlistToggle}
            >
              <Star className={`w-4 h-4 ${shortlisted ? "fill-white" : ""}`} />
              {shortlisted ? "Shortlisted" : "Shortlist"}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-3 md:px-5 pb-6" style={{ paddingTop: "72px" }}>
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4">
            {/* Center Column */}
            <div className="flex-1 space-y-4">
              {/* Hero Card */}
              <div className="bg-gradient-to-r from-purple-100 via-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 shadow-sm">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                    <AvatarImage
                      src={
                        candidate?.profile?.profilePhoto &&
                        !candidate.profile.profilePhoto.includes("github.com")
                          ? encodeURI(candidate.profile.profilePhoto)
                          : "/noprofile.webp"
                      }
                      alt="Profile"
                    />
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">
                    {candidate?.fullname || "—"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-0.5">
                    {firstExp ? firstExp.jobProfile : "Fresher"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {totalYears > 0 ? `${totalYears} Year${totalYears > 1 ? "s" : ""} Experience` : "Fresher"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:ml-auto">
                  {candidate?.profile?.resume && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5"
                      onClick={handleDownloadResume}
                    >
                      <Eye className="w-4 h-4" /> View Resume
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                    onClick={() => { if (email) window.location.href = `mailto:${email}`; else toast.error("Email not available"); }}
                  >
                    <Mail className="w-4 h-4" /> Email
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-800 text-white flex items-center gap-1.5"
                    onClick={() => { if (phone) window.location.href = `tel:${phone}`; else toast.error("Phone not available"); }}
                  >
                    <Phone className="w-4 h-4" /> Call
                  </Button>
                </div>
              </div>

              {/* Contact + Personal Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email Address</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 break-all">{email || "Not Provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone Number</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">{phone || "Not Provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">{location || "Not Provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Personal Info</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Gender</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">{candidate?.profile?.gender || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Highest Qualification</p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{qualificationToDisplay || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Current CTC</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">{firstExp?.currentCTC || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Notice Period</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">{firstExp?.noticePeriod || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Last Active</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                        {candidate?.lastActiveAgo ||
                          (candidate?.updatedAt
                            ? new Date(candidate.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "N/A")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {candidate?.profile?.bio && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-800 dark:text-white mb-3">Summary</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{candidate.profile.bio}</p>
                </div>
              )}

              {/* Experience Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Experience Details</h2>
                {normalizedExperiences.length > 0 ? (
                  normalizedExperiences.map((exp, i) => (
                    <div key={i} className={`flex gap-4 ${i > 0 ? "mt-4 pt-4 border-t dark:border-gray-700" : ""}`}>
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(exp.companyName || "C")[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white text-sm">{exp.jobProfile}</p>
                            <p className="text-blue-600 text-xs">{exp.companyName}</p>
                            <p className="text-gray-400 text-xs mt-0.5">
                              {exp.startDate
                                ? `${exp.startDate} - ${exp.currentlyWorking ? "Present" : exp.endDate || ""} (${exp.duration} Year${exp.duration > 1 ? "s" : ""})`
                                : exp.duration
                                ? `${exp.duration} Year(s)`
                                : ""}
                            </p>
                          </div>
                          {exp.employmentType && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                              {exp.employmentType}
                            </span>
                          )}
                        </div>
                        {exp.experienceDetails && (
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{exp.experienceDetails}</p>
                        )}
                        {exp.currentlyWorking && (
                          <div className="flex gap-6 mt-2">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide">Current CTC</p>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{exp.currentCTC}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide">Notice Period</p>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{exp.noticePeriod}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No experience details available</p>
                )}
              </div>

              {/* Job Categories + Top Skills Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Categories + Languages */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-white mb-3">Job Categories</h2>
                    {candidate?.profile?.category?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {candidate.profile.category.map((cat, i) => (
                          <span key={i} className="px-3 py-1 rounded-full border border-blue-300 text-blue-700 dark:text-blue-300 dark:border-blue-600 text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Not specified</p>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-white mb-3">Languages</h2>
                    {candidate?.profile?.language?.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {candidate.profile.language.map((lang, i) => (
                          <span key={i} className="text-sm text-gray-600 dark:text-gray-300">{lang}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Not specified</p>
                    )}
                  </div>
                </div>

                {/* Top Skills */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-800 dark:text-white mb-3">Top Skills</h2>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium">
                          {String(skill).trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Documents */}
              {Array.isArray(candidate?.profile?.documents) && candidate.profile.documents.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-800 dark:text-white mb-4">ID's / Documents</h2>
                  <div className="flex flex-wrap gap-3">
                    {candidate.profile.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
                      >
                        {DOC_ICONS[doc] || <FileText className="w-5 h-5 text-blue-600" />}
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{doc}</p>
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Uploaded
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-72 lg:flex-shrink-0 lg:self-start lg:sticky lg:top-[72px] space-y-4">
              {/* Resume Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    {candidate?.profile?.resume && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white mt-3">Resume</p>
                </div>
                <div className="mt-4">
                  {candidate?.profile?.resume ? (
                    <button
                      onClick={handleDownloadResume}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View Resume
                    </button>
                  ) : (
                    <p className="text-center text-gray-400 text-sm">No resume uploaded</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => { if (email) window.location.href = `mailto:${email}`; else toast.error("Email not available"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                  >
                    <Mail className="w-4 h-4" /> Send Email
                  </button>
                  <button
                    onClick={() => { if (phone) window.location.href = `tel:${phone}`; else toast.error("Phone not available"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <Phone className="w-4 h-4" /> Call Candidate
                  </button>
                  <button
                    onClick={handleShortlistToggle}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                      shortlisted
                        ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100"
                        : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${shortlisted ? "fill-yellow-500 text-yellow-500" : ""}`} />
                    {shortlisted ? "Shortlisted ✓" : "Add to Shortlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CandidateInformation;
