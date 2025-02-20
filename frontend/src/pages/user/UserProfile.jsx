import React, { useState } from "react";
import Navbar from "../../components/shared/Navbar";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Mail, Pen } from "lucide-react";
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
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openEmailOTPModal, setOpenEmailOTPModal] = useState(false);
  const [openNumberOTPModal, setOpenNumberOTPModal] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${USER_API_END_POINT}/delete`, {
        data: { email: user?.emailId?.email },
        withCredentials: true,
      });

      if (response.data.success) {
        navigate("/");
        dispatch(logOut());
      }
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error deleting account: ", err.message);
      toast.error("Error in deleting account");
    } finally {
      setLoading(false);
    }
  };

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    handleDeleteAccount();
  };

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
                      className="text-blue-600 text-sm cursor-pointer hover:underline"
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
            <h2 className="text-lg text-center font-semibold text-gray-800 border-b pb-2">
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
