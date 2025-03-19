// Import React and useState hook for component state management
import React, { useEffect,useState } from "react";  

// Import navigation bar component for consistent site-wide navigation
import Navbar from "../../components/shared/Navbar";  

// Import user avatar UI components for displaying profile images
import { Avatar, AvatarImage } from "../../components/ui/avatar";  

// Import icons for email and edit actions
import { Mail, Pen } from "lucide-react";  

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

// Import delete confirmation modal for user account or data deletion
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";  


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


  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <Navbar />
        <div className="flex-grow">
          {/* Profile Details Section */}
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-8">
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
              <h1 className="mt-4 text-3xl font-bold text-gray-800">
                {user?.fullname || "User Name"}
              </h1>
              <h1 className="mt-1 text-gray-600">
                {user?.profile?.experience?.jobProfile || "Job Title"}
              </h1>
              <p className="text-gray-500 mt-1">
                {`Experience: ${user?.profile?.experience?.duration} Year`}
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
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Profile Summary
              </h2>
              <div>
                <p className="text-gray-600 mt-2">
                  {user?.profile?.bio || "No bio available"}
                </p>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Contact Information
              </h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="text-blue-500" />
                  <span className="text-gray-700">
                    {user?.emailId?.email || "Not Provided"}
                  </span>
                  {!user?.emailId?.isVerified ? (
                    <span
                      className="text-blue-600 text-sm cursor-pointer hover:underline"
                      onClick={() => setOpenEmailOTPModal(true)}
                    >
                      Verify
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600 bg-green-50 px-2 rounded-lg gap-1">
                      <MdOutlineVerified size={20} /> <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <LuPhoneIncoming size={25} className="text-blue-500" />
                  <span className="text-gray-700">
                    {user?.phoneNumber?.number || "Not Provided"}
                  </span>
                  {!user?.phoneNumber?.isVerified ? (
                    <span
                      className="text-blue-600 text-sm hidden cursor-pointer hover:underline"
                      onClick={() => setOpenNumberOTPModal(true)}
                    >
                      Verify
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600 bg-green-50 px-2 rounded-lg gap-1">
                      <MdOutlineVerified size={20} /> <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <LuMapPin size={25} className="text-blue-500" />
                  <span className="text-gray-700">
                    {`${user?.address?.city}, ${user?.address?.state}, ${user?.address?.country}`}
                  </span>
                </div>
              </div>
            </div>

                      {/* Experience Details Section */}
                      <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Experience Details
              </h2>
              <div className="flex items-center mt-2 pb-2">
                <h2 className="text-sm font-semibold text-gray-800">
                  Company Name:{" "}
                  <span className="text-sm text-gray-600">
                    {user?.profile?.experience?.companyName || "N/A"}
                  </span>
                </h2>
              </div>
              <div>
                <p className="text-gray-600">
                  {user?.profile?.experience?.experienceDetails ||
                    "No experience details available"}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Skills
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 hover:bg-gray-200 px-4 py-2 text-blue-800 rounded-lg font-medium text-sm"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-600">No skills listed</span>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Resume
              </h2>
              <div className="mt-4">
                {user?.profile?.resume ? (
                  <a
                    href={user.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-600">
                    No resume uploaded.{" "}
                    <a href="/upload" className="text-blue-600 underline">
                      Upload now
                    </a>
                  </span>
                )}
              </div>
            </div>

            {/* Delete Account Button */}
            <div className="flex justify-center mt-8">
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
            </div>
          </div>

          {/* Applied Jobs Section */}
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-8 p-8">
            <h2 className="text-lg text-center underline font-semibold text-gray-800 border-b pb-2">
              Applied Jobs
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

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
    </>
  );
};

export default UserProfile;
