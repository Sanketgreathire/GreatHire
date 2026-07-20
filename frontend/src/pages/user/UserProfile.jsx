import React, { useEffect, useState, useMemo, useCallback, Suspense, lazy } from "react";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Mail, Pen, IdCard, FileText, Plus, Eye, Upload, Briefcase, MapPin, Phone, CheckCircle, Settings, LogOut, User, Shield, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { USER_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logOut } from "@/redux/authSlice";
import { toast } from "react-hot-toast";
import { MdOutlineVerified } from "react-icons/md";
import VerifyEmail from "@/components/VerifyEmail";
import VerifyNumber from "@/components/VerifyNumber";
import { Helmet } from "react-helmet-async";

const UserUpdateProfile = lazy(() => import("./UserUpdateProfile"));

const statusStyles = {
  Shortlisted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const AppliedJobsInline = ({ jobs }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const perPage = 10;
  const total = Math.ceil(jobs.length / perPage) || 1;
  const current = jobs.slice((page - 1) * perPage, page * perPage);
  return (
    <div className="overflow-hidden">
      <div className="space-y-2">
        {current.map((job, i) => (
          <div
            key={i}
            onClick={() => job.job?._id && navigate(`/description/${job.job._id}`)}
            className="flex flex-col gap-0.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight line-clamp-2">
                {job.job?.jobDetails?.title || "N/A"}
              </p>
              <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${statusStyles[job.status] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
                {job.status || "Pending"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{job.job?.company?.companyName || "N/A"}</p>
            <p className="text-[10px] text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {total > 1 && (
        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1} className="px-2 py-1 text-[11px] rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-40">Prev</button>
          <span className="text-[11px] text-gray-500">Page {page}/{total}</span>
          <button onClick={() => setPage(p => Math.min(p+1,total))} disabled={page===total} className="px-2 py-1 text-[11px] rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
};

const DOC_ICONS = {
  "PAN Card": <IdCard className="w-5 h-5 text-blue-600" />,
  "Aadhar Card": <IdCard className="w-5 h-5 text-blue-600" />,
  Passport: <FileText className="w-5 h-5 text-blue-600" />,
};

const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedLoading, setAppliedLoading] = useState(true);
  const [showAppliedJobs, setShowAppliedJobs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openEmailOTPModal, setOpenEmailOTPModal] = useState(false);
  const [openNumberOTPModal, setOpenNumberOTPModal] = useState(false);

  useEffect(() => {
    if (!user?.profile?.resume) {
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        toast.error("You must upload a resume before leaving!");
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [user?.profile?.resume]);

  useEffect(() => {
    axios
      .get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) setAppliedJobs(res.data.application || []);
      })
      .catch(() => {})
      .finally(() => setAppliedLoading(false));
  }, []);

  const normalizedExperiences = useMemo(() => {
    let list = [];
    if (Array.isArray(user?.profile?.experiences)) {
      list = [...user.profile.experiences];
    } else if (typeof user?.profile?.experiences === "string") {
      try {
        const parsed = JSON.parse(user.profile.experiences);
        if (Array.isArray(parsed)) list = [...parsed];
      } catch {}
    }
    if (
      user?.profile?.experience &&
      (user.profile.experience.jobProfile?.trim() !== "" ||
        user.profile.experience.duration?.trim() !== "0")
    ) {
      list.push(user.profile.experience);
    }
    return list;
  }, [user?.profile?.experiences, user?.profile?.experience]);

  const { qualificationToDisplay, firstExp, totalYears } = useMemo(() => {
    const qual =
      user?.profile?.qualification === "Others"
        ? user?.profile?.otherQualification
        : user?.profile?.qualification;
    const exps = user?.profile?.experiences || [];
    const years = exps.reduce((sum, exp) => sum + (parseFloat(exp.duration) || 0), 0);
    return {
      qualificationToDisplay: qual,
      firstExp: normalizedExperiences[0],
      totalYears: years,
    };
  }, [
    user?.profile?.qualification,
    user?.profile?.otherQualification,
    user?.profile?.experiences,
    normalizedExperiences,
  ]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(logOut());
      navigate("/");
    } catch {
      toast.error("Error logging out");
    }
  }, [dispatch, navigate]);

  const resumeDate = user?.profile?.resumeUpdatedAt
    ? new Date(user.profile.resumeUpdatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  const nameInitial = (user?.fullname || "U")[0].toUpperCase();

  return (
    <>
      <Helmet>
        <title>Profile Dashboard | GreatHire</title>
        <meta
          name="description"
          content="Manage your professional profile on GreatHire. Upload resumes, highlight skills, add experience, and track job applications."
        />
      </Helmet>

      <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 flex">
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(v => !v)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => user?.profile?.resume ? navigate(-1) : toast.error("You must upload a resume before leaving!")}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold">
              <span className="text-gray-900 dark:text-white">Great</span><span className="text-blue-600">Hire</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed left-0 z-50 md:z-20 bg-white dark:bg-gray-800 shadow-sm flex flex-col px-4 pb-6 transition-transform duration-300
            w-56 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{height:'calc(100vh - 56px)', top:'56px', overflowY:'auto'}}
        >
          {/* Nav items */}
          <div className="space-y-1 mb-4 pt-4">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button
              onClick={() => { navigate("/ResumeAnalyzer"); setSidebarOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <FileText className="w-4 h-4" /> Resume Analyzer
            </button>
            <button
              onClick={() => { navigate("/jobs"); setSidebarOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <Briefcase className="w-4 h-4" /> Jobs
            </button>
            <button
              onClick={() => { navigate("/profile/settings-policy"); setSidebarOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <Shield className="w-4 h-4" /> Settings &amp; Policy
            </button>
          </div>
          <hr className="border-gray-200 dark:border-gray-700 mb-4" />
        </aside>

        {/* Main Content */}
        <main className="w-full md:ml-56 flex-1 px-3 md:px-5 pb-6" style={{paddingTop:'72px'}}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Center Column */}
            <div className="flex-1 space-y-4">
              {/* Hero Card */}
              <div className="bg-gradient-to-r from-purple-100 via-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 shadow-sm">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto &&
                        !user.profile.profilePhoto.includes("github.com")
                          ? user.profile.profilePhoto
                          : "/noprofile.webp"
                      }
                      alt="Profile"
                    />
                  </Avatar>
                  <button
                    onClick={() => setOpen(true)}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow"
                  >
                    <Pen className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">
                      {user?.fullname || "User Name"}
                    </h1>
                    <MdOutlineVerified className="text-blue-500 w-5 h-5" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-0.5">
                    {firstExp ? firstExp.jobProfile : "Fresher"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {totalYears > 0 ? `${totalYears} Year${totalYears > 1 ? "s" : ""} Experience` : "Fresher"}
                  </p>
                </div>
                <Button
                  onClick={() => setOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 text-sm flex items-center gap-2 shadow sm:ml-auto"
                >
                  <FileText className="w-4 h-4" /> Edit Profile
                </Button>
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
                        <p className="text-sm text-gray-700 dark:text-gray-200 break-all">
                          {user?.emailId?.email || "Not Provided"}
                        </p>
                        {!user?.emailId?.isVerified ? (
                          <span
                            className="text-blue-600 text-xs cursor-pointer hover:underline"
                            onClick={() => setOpenEmailOTPModal(true)}
                          >
                            Verify
                          </span>
                        ) : (
                          <span className="text-green-500 text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone Number</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          {user?.phoneNumber?.number || "Not Provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          {[user?.address?.city, user?.address?.state, user?.address?.country]
                            .filter(Boolean)
                            .join(", ") || "Not Provided"}
                        </p>
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
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                        {user?.profile?.gender || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Highest Qualification</p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">
                        {qualificationToDisplay || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Current CTC</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                        {firstExp?.currentCTC || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Notice Period</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                        {firstExp?.noticePeriod || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800 dark:text-white">Experience Details</h2>
                  <button
                    onClick={() => setOpen(true)}
                    className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
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
                    {user?.profile?.category?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.profile.category.map((cat, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full border border-blue-300 text-blue-700 dark:text-blue-300 dark:border-blue-600 text-xs"
                          >
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
                    {user?.profile?.language?.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {user.profile.language.map((lang, i) => (
                          <span key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            {lang}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Not specified</p>
                    )}
                  </div>
                </div>

                {/* Top Skills */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-800 dark:text-white">Top Skills</h2>
                    <button
                      onClick={() => setOpen(true)}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {user?.profile?.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.profile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No skills listed</p>
                  )}
                </div>
              </div>

              {/* ID's / Documents */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-4">ID's / Documents</h2>
                <div className="flex flex-wrap gap-3">
                  {user?.profile?.documents?.length > 0 ? (
                    user.profile.documents.map((doc, i) => (
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
                    ))
                  ) : null}
                  <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Upload New Document
                  </button>
                </div>
              </div>
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
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white mt-3">Your Resume</p>
                  {resumeDate && (
                    <p className="text-xs text-gray-400 mt-0.5">Last updated: {resumeDate}</p>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  {user?.profile?.resume ? (
                    <a
                      href={user.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View Resume
                    </a>
                  ) : (
                    <p className="text-center text-gray-400 text-sm">No resume uploaded</p>
                  )}
                  <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Update Resume
                  </button>
                </div>
              </div>

              {/* Applied Jobs Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <h2 className="font-semibold text-gray-800 dark:text-white text-sm">Applied Jobs</h2>
                  </div>
                  <span className="min-w-5 h-5 px-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs flex items-center justify-center font-semibold">
                    {appliedLoading ? "…" : appliedJobs.length}
                  </span>
                </div>

                {appliedLoading ? (
                  <p className="text-xs text-gray-400 text-center py-2">Loading...</p>
                ) : appliedJobs.length === 0 ? (
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                      <Briefcase className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No applications found</p>
                    <p className="text-xs text-gray-400 mt-1">You haven't applied to any jobs yet. Start exploring opportunities!</p>
                    <button onClick={() => navigate("/jobs")} className="mt-3 text-blue-600 text-xs hover:underline">Explore Jobs</button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowAppliedJobs((v) => !v)}
                      className="w-full text-blue-600 text-xs hover:underline text-center mb-3"
                    >
                      {showAppliedJobs ? "Hide Applications" : `View All ${appliedJobs.length} Applications`}
                    </button>
                    {showAppliedJobs && (
                      <div className="overflow-y-auto" style={{maxHeight: '550px'}}>
                        <AppliedJobsInline jobs={appliedJobs} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>

      <Suspense fallback={null}>
        <UserUpdateProfile open={open} setOpen={setOpen} />
      </Suspense>

      {openEmailOTPModal && <VerifyEmail setOpenEmailOTPModal={setOpenEmailOTPModal} />}
      {openNumberOTPModal && <VerifyNumber setOpenNumberOTPModal={setOpenNumberOTPModal} />}
    </>
  );
};

export default UserProfile;