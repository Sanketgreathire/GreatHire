import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Contact, Mail, Pen } from "lucide-react";
import { Button } from "../../components/ui/button";
import RecruiterUpdateProfile from "./RecruiterUpdateProfile";
import { useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

// Import verified icon for indicating verified users or data
import { MdOutlineVerified } from "react-icons/md";

// Import email verification modal component
import VerifyEmail from "@/components/VerifyEmail";

// Import phone number verification modal component
//import VerifyNumber from "@/components/VerifyNumber";  

const RecruiterProfile = () => {
  // State to manage the profile update modal visibility
  const [open, setOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const { company } = useSelector((state) => state.company);
  const [openEmailOTPModal, setOpenEmailOTPModal] = useState(false); // Controls email verification modal
  //const [openNumberOTPModal, setOpenNumberOTPModal] = useState(false); // Controls phone number verification modal

  //console.log(user);
  //console.log(company);
  return (
    <>
      <Helmet>
        <title>
          Profile Dashboard | Control Company, Account, and Verification - GreatHire
        </title>

        <meta
          name="description"
          content="The GreatHire Recruiter Profile Dashboard provides recruiters with a streamlined way to manage their own profile, company information, and verified contact. The GreatHire system is designed to work efficiently and effectively to maintain reliability. Currently, our system is situated in Hyderabad State, India. Recruiters and organizations can update their personal information, check their email addresses, highlight their job position, and establish a professional hiring identity all under one safe and efficient platform. The user-friendly and real-time responsive platform provides recruiters with everything they need to establish their authority and successfully hire top talent. Use our system to take charge of your recruiter profile and boost your hiring success."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-24 lg:pt-4 md:pt-0">
        
        <Navbar />

        {/* Main Section */}
        <div className="flex-grow flex justify-center items-start md:items-center px-4 sm:px-6 py-8 md:py-12">
          
          {/* Card */}
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md md:shadow-xl rounded-2xl p-5 sm:p-8 md:p-10 transition-colors duration-300">
            
            {/* Header */}
            <div className="flex flex-col items-center text-center border-b border-gray-200 dark:border-gray-700 pb-6">
              
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 shadow-lg">
                <AvatarImage
                  src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                  alt="Profile Photo"
                />
              </Avatar>

              <h1 className="mt-4 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                {user?.fullname || "User"}
              </h1>

              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                {user?.position || "Recruiter"}
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                {company?.companyName || "Company"}
              </p>

              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="mt-5 w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Pen className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">
                Contact Information
              </h2>

              <div className="space-y-5">

                {/* Email Row */}
                <div className="flex items-start gap-4">
                  <Mail className="text-blue-500 mt-1 shrink-0" />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-full">
                    
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base break-all">
                      {user?.emailId?.email || "No Email"}
                    </span>

                    {!user?.emailId?.isVerified ? (
                      <button
                        onClick={() => setOpenEmailOTPModal(true)}
                        className="text-blue-600 text-sm hover:underline mt-1 sm:mt-0 text-left"
                      >
                        Verify
                      </button>
                    ) : (
                      <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-gray-700 px-2 py-1 rounded-md gap-1 text-sm mt-2 sm:mt-0 w-fit">
                        <MdOutlineVerified size={18} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone Row */}
                <div className="flex items-start gap-4">
                  <Contact className="text-green-500 mt-1 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base break-all">
                    {user?.phoneNumber?.number || "No Phone Number"}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Recruiter Update Profile */}
        <RecruiterUpdateProfile open={open} setOpen={setOpen} />

        <Footer />

        {/* OTP Modals */}
        {openEmailOTPModal && (
          <VerifyEmail setOpenEmailOTPModal={setOpenEmailOTPModal} />
        )}
      </div>
    </>
  );
};

export default RecruiterProfile;