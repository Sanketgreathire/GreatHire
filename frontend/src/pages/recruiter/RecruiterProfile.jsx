import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Contact, Mail, Pen } from "lucide-react";
import { Button } from "../../components/ui/button";
import RecruiterUpdateProfile from "./RecruiterUpdateProfile";
import { useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";

// Import verified icon for indicating verified users or data
import { MdOutlineVerified } from "react-icons/md";  

// Import email verification modal component
import VerifyEmail from "@/components/VerifyEmail";  

// Import phone number verification modal component
import VerifyNumber from "@/components/VerifyNumber";  

const RecruiterProfile = () => {
  // State to manage the profile update modal visibility
  const [open, setOpen] = useState(false);
  
  const { user } = useSelector((store) => store.auth);
  const { company } = useSelector((state) => state.company);
  const [openEmailOTPModal, setOpenEmailOTPModal] = useState(false); // Controls email verification modal
  const [openNumberOTPModal, setOpenNumberOTPModal] = useState(false); // Controls phone number verification modal
  
  //console.log(user);
  //console.log(company);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center py-10">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-10">
          {/* Header Section */}
          <div className="flex flex-col items-center border-b pb-6">
            <Avatar className="h-28 w-28 shadow-lg">
              <AvatarImage
                src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                alt="Profile Photo"
              />
            </Avatar>
            <h1 className="mt-4 text-3xl font-semibold text-gray-800">
              {user?.fullname || "User"}
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.position || "Recruiter"}
            </p>
            <p className="text-gray-600 text-lg">
              {company?.companyName || "Company"}
            </p>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="mt-4 flex items-center gap-2 hover:bg-gray-100"
            >
              <Pen className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Contact Information */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Mail className="text-blue-500" />
                <span className="text-gray-700 text-lg">
                  {user?.emailId?.email || "No Email"}
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
                <Contact className="text-green-500" />
                <span className="text-gray-700 text-lg">
                  {user?.phoneNumber?.number || "No Phone Number"}
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
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Update Profile */}
      <RecruiterUpdateProfile open={open} setOpen={setOpen} />

      {/* Footer */}
      <Footer className="mt-auto" />

      {/* OTP Modals */}
      {openEmailOTPModal && (
        <VerifyEmail setOpenEmailOTPModal={setOpenEmailOTPModal} />
      )}
      {openNumberOTPModal && (
        <VerifyNumber setOpenNumberOTPModal={setOpenNumberOTPModal} />
      )}
    </div>
  );
};

export default RecruiterProfile;
