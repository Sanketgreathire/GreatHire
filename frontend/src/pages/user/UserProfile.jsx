import React, { useEffect, useState, useMemo, useCallback } from "react";
import Navbar from "../../components/shared/Navbar";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Mail, Pen, IdCard, FileText } from "lucide-react";
import { LuPhoneIncoming, LuMapPin } from "react-icons/lu";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import AppliedJobTable from "../job/AppliedJobTable";
import UserUpdateProfile from "./UserUpdateProfile";
import { useSelector, useDispatch } from "react-redux";
import Footer from "@/components/shared/Footer";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logOut } from "@/redux/authSlice";
import { toast } from "react-hot-toast";
import { MdOutlineVerified } from "react-icons/md";
import VerifyEmail from "@/components/VerifyEmail";
import VerifyNumber from "@/components/VerifyNumber";
import { Helmet } from "react-helmet-async";

const DOC_ICONS = {
  "PAN Card": <IdCard className="w-4 h-4" />,
  "Aadhar Card": <IdCard className="w-4 h-4" />,
  "Passport": <FileText className="w-4 h-4" />,
};

const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openEmailOTPModal, setOpenEmailOTPModal] = useState(false);
  const [openNumberOTPModal, setOpenNumberOTPModal] = useState(false);

  // Prevent back navigation if resume is missing
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
    const qual = user?.profile?.qualification === "Others"
      ? user?.profile?.otherQualification
      : user?.profile?.qualification;
    const exps = user?.profile?.experiences || [];
    const years = exps.reduce((sum, exp) => sum + (parseFloat(exp.duration) || 0), 0);
    return {
      qualificationToDisplay: qual,
      firstExp: normalizedExperiences[0],
      totalYears: years,
    };
  }, [user?.profile?.qualification, user?.profile?.otherQualification, user?.profile?.experiences, normalizedExperiences]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${USER_API_END_POINT}/delete`, {
        data: { email: user?.emailId?.email },
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(logOut());
        navigate("/");
      }
      toast.success(response.data.message);
    } catch {
      toast.error("Error in deleting account");
    } finally {
      setLoading(false);
    }
  }, [user?.emailId?.email, dispatch, navigate]);

  const onConfirmDelete = useCallback(() => handleDeleteAccount(), [handleDeleteAccount]);
  const onCancelDelete = useCallback(() => {}, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile Dashboard | GreatHire Job Applications, Skills, and Resume</title>
        <meta
          name="description"
          content="Establish and organize your professional profile on GreatHire, an authentic job portal functioning in the Hyderabad State of India. The malleable user profile management page enables individuals to upload resumes, highlight their skill sets, include their experiences, and monitor job applications all through this single dashboard. Validate contact information and organize various documents to produce a recruiter-friendly profile in today's competitive job environment."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <div className="flex-grow">
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 p-8">

            {/* User Info */}
            <div className="flex flex-col items-center text-center border-b pb-8">
              <Avatar className="h-24 w-24 shadow-lg">
                <AvatarImage
                  src={user?.profile?.profilePhoto && !user.profile.profilePhoto.includes('github.com') ? user.profile.profilePhoto : "/src/assets/noprofile.webp"}
                  alt="Profile Photo"
                />
              </Avatar>
              <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
                {user?.fullname || "User Name"}
              </h1>
              <h1 className="mt-1 text-gray-600 dark:text-gray-300">
                {firstExp ? firstExp.jobProfile : "Fresher"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Experience: {totalYears > 0 ? `${totalYears} Year(s)` : "0 Years"}
              </p>
              <Button onClick={() => setOpen(true)} variant="outline" className="mt-4 flex items-center gap-2">
                <Pen className="h-4 w-4" /> Edit Profile
              </Button>
            </div>

            {/* Profile Summary */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Profile Summary</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{user?.profile?.bio || "No bio available"}</p>
            </div>

            {/* Contact Information */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Contact Information</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="text-blue-500 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.emailId?.email || "Not Provided"}</span>
                  {!user?.emailId?.isVerified ? (
                    <span className="text-blue-600 dark:text-blue-400 text-sm cursor-pointer hover:underline" onClick={() => setOpenEmailOTPModal(true)}>Verify</span>
                  ) : (
                    <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2 rounded-lg gap-1">
                      <MdOutlineVerified size={20} /> <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <LuPhoneIncoming size={25} className="text-blue-500 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.phoneNumber?.number || "Not Provided"}</span>
                  {!user?.phoneNumber?.isVerified ? (
                    <span className="text-blue-600 dark:text-blue-400 text-sm hidden cursor-pointer hover:underline" onClick={() => setOpenNumberOTPModal(true)}>Verify</span>
                  ) : (
                    <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2 rounded-lg gap-1">
                      <MdOutlineVerified size={20} /> <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <LuPhoneIncoming size={25} className="text-blue-500 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.alternatePhone?.number || "Not Provided"}</span>
                  {!user?.alternatePhone?.isVerified ? (
                    <span className="text-blue-600 dark:text-blue-400 text-sm hidden cursor-pointer hover:underline" onClick={() => setOpenNumberOTPModal(true)}>Verify</span>
                  ) : (
                    <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2 rounded-lg gap-1">
                      <MdOutlineVerified size={20} /> <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 pb-4">
                  <LuMapPin size={25} className="text-blue-500 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {`${user?.address?.city}, ${user?.address?.state}, ${user?.address?.country}, ${user?.address?.pincode}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Languages Known</h2>
              {user?.profile?.language?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.profile.language.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm">{lang}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mt-2 dark:text-gray-400">Not Specified.</p>
              )}
            </div>

            {/* Gender */}
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Gender</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-gray-700 dark:text-gray-300">{user?.profile?.gender}</span>
              </div>
            </div>

            {/* Qualification */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Qualification</h2>
              {qualificationToDisplay || "-"}
            </div>

            {/* Experience */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Experience Details</h2>
              {normalizedExperiences.length > 0 ? (
                normalizedExperiences.map((exp, index) => (
                  <div key={index} className="mt-4 pb-4">
                    <div className="grid gap-y-4 md:grid-cols-5 md:gap-y-2 md:gap-x-4">
                      <div className="col-span-5 md:col-span-1"><p className="font-semibold text-gray-700 dark:text-gray-300">Company Name:</p></div>
                      <div className="col-span-5 md:col-span-4"><p className="text-gray-600 dark:text-gray-400">{exp.companyName}</p></div>
                      <div className="col-span-5 md:col-span-1"><p className="font-semibold text-gray-700 dark:text-gray-300">Job Profile:</p></div>
                      <div className="col-span-5 md:col-span-4"><p className="text-gray-600 dark:text-gray-400">{exp.jobProfile}</p></div>
                      <div className="col-span-5 md:col-span-1"><p className="font-semibold text-gray-700 dark:text-gray-300">Duration:</p></div>
                      <div className="col-span-5 md:col-span-4"><p className="text-gray-600 dark:text-gray-400">{exp.duration}</p></div>
                      <div className="col-span-5 md:col-span-1"><p className="font-semibold text-gray-700 dark:text-gray-300">Details:</p></div>
                      <div className="col-span-5 md:col-span-4"><p className="text-gray-600 dark:text-gray-400">{exp.experienceDetails}</p></div>
                      {exp.currentlyWorking && (
                        <>
                          <div className="col-span-5 md:col-span-1"><p className="font-semibold text-gray-700 dark:text-gray-300">Current CTC:</p></div>
                          <div className="col-span-5 md:col-span-4"><p className="text-gray-600 dark:text-gray-400">{exp.currentCTC}</p></div>
                          <div className="col-span-5 md:col-span-1"><p className="font-semibold text-gray-700 dark:text-gray-300">Notice Period:</p></div>
                          <div className="col-span-5 md:col-span-4"><p className="text-gray-600 dark:text-gray-400">{exp.noticePeriod}</p></div>
                        </>
                      )}
                    </div>
                    {index !== normalizedExperiences.length - 1 && <hr className="mt-4 border-gray-300 dark:border-gray-700" />}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mt-2 pb-4">No experience details available</p>
              )}
            </div>

            {/* Job Category */}
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Job Category</h2>
              {user?.profile?.category?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.profile.category.map((cat, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm">{cat}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mt-2">Not Specified.</p>
              )}
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <Badge key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium text-sm">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">No skills listed</span>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">ID's / Documents</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {user?.profile?.documents?.length > 0 ? (
                  user.profile.documents.map((doc, i) => (
                    <span key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium text-sm shadow-sm hover:bg-gradient-to-l hover:from-blue-200 hover:to-blue-300 cursor-pointer">
                      {DOC_ICONS[doc] || <FileText className="w-4 h-4" />}
                      {doc}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">Does not have any documents</span>
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Resume</h2>
              <div className="mt-4">
                {user?.profile?.resume ? (
                  <a href={user.profile.resume} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700">
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">No resume uploaded.</span>
                )}
              </div>
            </div>
          </div>

          {/* Applied Jobs */}
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-8 p-8">
            <h2 className="text-lg text-center underline font-semibold border-b pb-2 text-gray-800 dark:text-white">APPLIED JOBS</h2>
            <div className="mt-4"><AppliedJobTable /></div>
          </div>
        </div>

        <UserUpdateProfile open={open} setOpen={setOpen} />
        <Footer className="mt-auto" />

        {openEmailOTPModal && <VerifyEmail setOpenEmailOTPModal={setOpenEmailOTPModal} />}
        {openNumberOTPModal && <VerifyNumber setOpenNumberOTPModal={setOpenNumberOTPModal} />}
      </div>
    </>
  );
};

export default UserProfile;
