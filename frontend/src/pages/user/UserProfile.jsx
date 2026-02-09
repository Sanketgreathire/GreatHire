// Import React and useState hook for component state management
import React, { useEffect, useState } from "react";

// Import navigation bar component for consistent site-wide navigation
import Navbar from "../../components/shared/Navbar";

// Import user avatar UI components for displaying profile images
import { Avatar, AvatarImage } from "../../components/ui/avatar";

// Import icons for email and edit actions
import { Mail, Pen } from "lucide-react";
//import { Briefcase, Building2, Clock, DollarSign, Calendar } from "lucide-react";
import { IdCard, FileText } from "lucide-react";

// Import phone and location icons for displaying contact details
import { LuPhoneIncoming, LuMapPin } from "react-icons/lu";

// Import badge UI component for labeling user status or achievements
import { Badge } from "../../components/ui/badge";

// Import button UI component for interactive elements
import { Button } from "../../components/ui/button";

// Import table component for displaying applied jobs
import AppliedJobTable from "../job/AppliedJobTable";

// Import modal component for updating user profile information
import UserUpdateProfile from "./UserUpdateProfile";

// Import Redux hooks for managing global state and dispatching actions
import { useSelector, useDispatch } from "react-redux";

// Import footer component for consistent site-wide footer
import Footer from "@/components/shared/Footer";

// Import API endpoint for user-related operations
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";

// Import Axios for making HTTP requests to the server
import axios from "axios";

// Import navigation hook for programmatic routing
import { useNavigate } from "react-router-dom";

// Import Redux action for logging out the user
import { logOut } from "@/redux/authSlice";

// Import toast notifications for displaying alerts and messages
import { toast } from "react-hot-toast";

// Import verified icon for indicating verified users or data
import { MdOutlineVerified } from "react-icons/md";

// Import email verification modal component
import VerifyEmail from "@/components/VerifyEmail";

// Import phone number verification modal component
import VerifyNumber from "@/components/VerifyNumber";
import { FiStar } from "react-icons/fi";

// Import delete confirmation modal for user account or data deletion
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";


// Import Helmet for customized meta tag on head
import { Helmet } from "react-helmet-async";



// const handleFileChange = async (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     if (file.size > 10 * 1024 * 1024) {
//       toast.error("Resume size should be less than 10 MB.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("resume", file);

//     try {
//       const response = await axios.put(
//         `${USER_API_END_POINT}/profile/update`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         dispatch(setUser(response.data.user));
//         toast.success("Resume uploaded successfully!");
//       }
//     } catch (err) {
//       console.error("Resume Upload Error:", err);
//       toast.error(err.response?.data?.message || "Failed to upload resume.");
//     }
//   }
// };

// import SelectedCategoryPreview from "@/components/ui/SelectedCategoryPreview";
// import SelectedLanguagePreview from "@/components/ui/SelectedLanguagePreview";

const UserProfile = () => {
  // State variables for managing modals and UI state
  const [open, setOpen] = useState(false); // Controls profile update modal
  const [loading, setLoading] = useState(false); // Controls loading state during account deletion
  const navigate = useNavigate(); // Navigation hook
  const dispatch = useDispatch(); // Redux dispatch function
  const { user } = useSelector((state) => state.auth); // Retrieve user data from Redux store
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controls delete confirmation modal
  const [openEmailOTPModal, setOpenEmailOTPModal] = useState(false); // Controls email verification modal
  const [openNumberOTPModal, setOpenNumberOTPModal] = useState(false); // Controls phone number verification modal

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  // Determine the qualification to display
  const qualificationToDisplay =
    user?.profile?.qualification === "Others"
      ? user?.profile?.otherQualification
      : user?.profile?.qualification;

  // ✅ Normalize experiences properly
  const normalizedExperiences = React.useMemo(() => {
    let list = [];

    // New schema: multiple experiences first
    if (Array.isArray(user?.profile?.experiences)) {
      list = [...user?.profile.experiences];
    } else if (typeof user?.profile?.experiences === "string") {
      try {
        const parsed = JSON.parse(user?.profile.experiences);
        if (Array.isArray(parsed)) {
          list = [...parsed];
        }
      } catch (e) {
        console.error("Invalid experiences JSON:", e);
      }
    }

    // Old schema: single experience (only if valid, not "0 year fresher")
    if (
      user?.profile?.experience &&
      (user?.profile.experience.jobProfile?.trim() !== "" ||
        user?.profile.experience.duration?.trim() !== "0")
    ) {
      list.push(user?.profile.experience);
    }

    return list;
  }, [user]);

  const firstExp = normalizedExperiences[0];



  // Prevent back navigation if resume is missing
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (!user?.profile?.resume) {
        toast.error("You must upload a resume before leaving!");
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [user]);

  // Prevent forward navigation if resume is missing
  const handleNext = () => {
    if (!user?.profile?.resume) {
      toast.error("Please upload your resume before proceeding.");
      return;
    }
    navigate("/next-page"); // Change this to your actual next route
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${USER_API_END_POINT}/delete`, {
        data: { email: user?.emailId?.email }, // Sending user email for account deletion
        withCredentials: true, // Ensures authentication is included
      });

      if (response.data.success) {
        navigate("/"); // Redirect to home page after deletion
        dispatch(logOut()); // Logout user after account deletion
      }
      toast.success(response.data.message); // Show success message
    } catch (err) {
      console.error("Error deleting account: ", err.message);
      toast.error("Error in deleting account"); // Show error message
    } finally {
      setLoading(false);
    }
  };

  // Handles delete confirmation
  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    handleDeleteAccount();
  };

  // Handles delete cancellation
  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const docIcons = {
    "PAN Card": <IdCard className="w-4 h-4" />,
    "Aadhar Card": <IdCard className="w-4 h-4" />,
    "Passport": <FileText className="w-4 h-4" />,
  };
  // Get all experiences
  const experiences = user?.profile?.experiences || [];

  // Calculate total years (make sure duration is numeric)
  const totalYears = experiences.reduce((sum, exp) => {
    const years = parseFloat(exp.duration) || 0; // fallback if duration is not valid
    return sum + years;
  }, 0);

  return (
    <>
      <Helmet>
        {/* Meta Title */}
        <title>Profile Dashboard | GreatHire Job Applications, Skills, and Resume</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Establish and organize your professional profile on GreatHire, an authentic job portal functioning in the Hyderabad State of India. The malleable user profile management page enables individuals to upload resumes, highlight their skill sets, include their experiences, and monitor job applications all through this single dashboard. Validate contact information and organize various documents to produce a recruiter-friendly profile in today’s competitive job environment."
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <div className="flex-grow">
          {/* Profile Details Section */}
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-10 p-8">
            {/* User Info Section */}
            <div className="flex flex-col items-center text-center border-b pb-8">
              <Avatar className="h-24 w-24 shadow-lg">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://github.com/shadcn.png"
                  }
                  alt="Profile Photo"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
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

              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="mt-4 flex items-center gap-2"
              >
                <Pen className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Profile Summary Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Profile Summary
              </h2>
              <div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {user?.profile?.bio || "No bio available"}
                </p>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Contact Information
              </h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="text-blue-500 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user?.emailId?.email || "Not Provided"}
                  </span>
                  {!user?.emailId?.isVerified ? (
                    <span
                      className="text-blue-600 dark:text-blue-400 text-sm cursor-pointer hover:underline"
                      onClick={() => setOpenEmailOTPModal(true)}
                    >
                      Verify
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2 rounded-lg gap-1">
                      <MdOutlineVerified size={20} /> <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <LuPhoneIncoming size={25} className="text-blue-500 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user?.phoneNumber?.number || "Not Provided"}
                  </span>
                  {!user?.phoneNumber?.isVerified ? (
                    <span
                      className="text-blue-600 dark:text-blue-400 text-sm hidden cursor-pointer hover:underline"
                      onClick={() => setOpenNumberOTPModal(true)}
                    >
                      Verify
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2 rounded-lg gap-1">
                      <MdOutlineVerified size={20} /> <span>Verified</span>
                    </span>
                  )}
                </div>
                {/* Alternate Phone */}
                <div className="flex items-center gap-4 mt-2">
                  <LuPhoneIncoming size={25} className="text-blue-500 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user?.alternatePhone?.number || "Not Provided"}
                  </span>
                  {!user?.alternatePhone?.isVerified ? (
                    <span
                      className="text-blue-600 dark:text-blue-400 text-sm hidden cursor-pointer hover:underline"
                      onClick={() => setOpenNumberOTPModal(true)}
                    >
                      Verify
                    </span>
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

            {/* Language (Fixed) */}
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Languages Known
              </h2>
              {user?.profile?.language?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {user?.profile.language.map((lang, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mt-2 dark:text-gray-400">Not Specified.</p>
              )}
            </div>

            {/* Gender */}
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Gender
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-gray-700 dark:text-gray-300">
                  {user?.profile?.gender}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Qualification
              </h2>
              {qualificationToDisplay || "-"}
            </div>

            {/* Experience Details Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Experience Details
              </h2>

              {normalizedExperiences.length > 0 ? (
                normalizedExperiences.map((exp, index) => (
                  <div key={index} className="mt-4 pb-4">
                    <div className="grid gap-y-4 md:grid-cols-5 md:gap-y-2 md:gap-x-4">
                      {/* Company Name */}
                      <div className="col-span-5 md:col-span-1">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Company Name:</p>
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <p className="text-gray-600 dark:text-gray-400">{exp.companyName}</p>
                      </div>

                      {/* Job Profile */}
                      <div className="col-span-5 md:col-span-1">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Job Profile:</p>
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <p className="text-gray-600 dark:text-gray-400">{exp.jobProfile}</p>
                      </div>

                      {/* Duration */}
                      <div className="col-span-5 md:col-span-1">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Duration:</p>
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <p className="text-gray-600 dark:text-gray-400">{exp.duration}</p>
                      </div>

                      {/* Details */}
                      <div className="col-span-5 md:col-span-1">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Details:</p>
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <p className="text-gray-600 dark:text-gray-400">{exp.experienceDetails}</p>
                      </div>

                      {/* Current Job (only if working) */}
                      {exp.currentlyWorking && (
                        <>
                          <div className="col-span-5 md:col-span-1">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Current CTC:</p>
                          </div>
                          <div className="col-span-5 md:col-span-4">
                            <p className="text-gray-600 dark:text-gray-400">{exp.currentCTC}</p>
                          </div>

                          <div className="col-span-5 md:col-span-1">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Notice Period:</p>
                          </div>
                          <div className="col-span-5 md:col-span-4">
                            <p className="text-gray-600 dark:text-gray-400">{exp.noticePeriod}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Separator line */}
                    {index !== normalizedExperiences.length - 1 && (
                      <hr className="mt-4 border-gray-300 dark:border-gray-700" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mt-2 pb-4">No experience details available</p>
              )}
            </div>

            {/* Category (Fixed) */}
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Job Category
              </h2>
              {user?.profile?.category?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {user?.profile.category.map((cat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mt-2 ">Not Specified.</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Skills
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {user?.profile?.skills?.length > 0 ? (
                  user?.profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium text-sm"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">No skills listed</span>
                )}
              </div>
            </div>

            {/* ✅ Show documents */}
            <div className="mt-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                ID's / Documents
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {user?.profile?.documents?.length > 0 ? (
                  user.profile.documents.map((doc, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium text-sm shadow-sm hover:bg-gradient-to-l hover:from-blue-200 hover:to-blue-300 cursor-pointer"
                    >
                      {docIcons[doc] || <FileText className="w-4 h-4" />}
                      {doc}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">Does not have any documents</span>
                )}
              </div>
            </div>
            {/* <ul className="list-disc list-inside">
              {user.profile.documents.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul> */}

            {/* Resume Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Resume
              </h2>
              <div className="mt-4">
                {user?.profile?.resume ? (
                  <a
                    href={user?.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">
                    No resume uploaded.{" "}
                    {/* Trigger file input instead of navigation */}
                    {/* <label
                      htmlFor="resumeUpload"
                      className="text-blue-600 underline cursor-pointer"
                    >
                      Upload now
                    </label>
                    <input
                      type="file"
                      id="resumeUpload"
                      accept=".pdf, .doc, .docx"
                      onChange={handleFileChange}
                      className="hidden"
                    /> */}
                  </span>
                )}
              </div>
            </div>


            {/* Delete Account Button */}
            {/* <div className="flex justify-center mt-8">
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="destructive"
                className={`bg-red-500 text-white hover:bg-red-700 ${
                  loading ? "cursor-not-allowed bg-red-400" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Account"}
              </Button>
            </div> */}
          </div>

          {/* Applied Jobs Section */}
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-8 p-8 ">
            <h2 className="text-lg text-center underline font-semibold border-b pb-2 text-gray-800 dark:text-gray-100">
              APPLIED JOBS
            </h2>
            <div className="mt-4">
              <AppliedJobTable />
            </div>
          </div>
        </div>

        <UserUpdateProfile open={open} setOpen={setOpen} />
        <Footer className="mt-auto" />

        {/* OTP Modals */}
        {openEmailOTPModal && (
          <VerifyEmail setOpenEmailOTPModal={setOpenEmailOTPModal} />
        )}
        {openNumberOTPModal && (
          <VerifyNumber setOpenNumberOTPModal={setOpenNumberOTPModal} />
        )}
      </div>

      {/* {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )} */}
    </>
  );
};

export default UserProfile;
