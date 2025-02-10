import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Contact, Mail, Pen, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import RecruiterUpdateProfile from "./RecruiterUpdateProfile";
import { useSelector } from "react-redux";
import Footer from "@/components/shared/Footer";

const RecruiterProfile = () => {
  //const [subscriptionStatus, setSubscriptionStatus] = useState("No");
  const [postedJobs, setPostedJobs] = useState(0);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // const toggleSubscriptionStatus = () =>
  //   setSubscriptionStatus((prevStatus) => (prevStatus === "No" ? "Yes" : "No"));

  // const incrementPostedJobs = () =>
  //   setPostedJobs((prevJobs) => prevJobs + 1);

  // const decrementPostedJobs = () =>
  //   setPostedJobs((prevJobs) => (prevJobs > 0 ? prevJobs - 1 : 0));

  // const handleDeleteAccount = () => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this account?"
  //   );
  //   if (confirmDelete) {
  //     console.log("Account deletion logic goes here.");
  //   }
  // };

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
              </div>
              <div className="flex items-center gap-4">
                <Contact className="text-green-500" />
                <span className="text-gray-700 text-lg">
                  {user?.phoneNumber?.number || "No Phone Number"}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Subscription Status
            </h2>
            <div className="flex items-center gap-6">
              <span className="text-lg text-gray-700">
                Subscribed:
              </span>
              <Button
                onClick={toggleSubscriptionStatus}
                className={`rounded-md px-4 py-2 text-white ${
                  subscriptionStatus === "No"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {subscriptionStatus}
              </Button>
            </div>
          </div> */}

          {/* Posted Jobs */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Posted Jobs
            </h2>
            <div className="flex items-center gap-6">
              <span className="text-lg text-gray-700">
                Number of Jobs Posted:
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {postedJobs}
              </span>
              <div className="flex gap-3">
                <Button
                  onClick={incrementPostedJobs}
                  className="bg-green-500 text-white hover:bg-green-600 px-3 py-2"
                >
                  +
                </Button>
                <Button
                  onClick={decrementPostedJobs}
                  className="bg-red-500 text-white hover:bg-red-600 px-3 py-2"
                >
                  −
                </Button>
              </div>
            </div>
          </div> */}

          {/* Delete Account */}
          {/* <div className="mt-10 flex justify-center">
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-6 py-3 hover:bg-red-700 rounded-md flex gap-2"
            >
              <Trash2 className="h-5 w-5" />
              Delete Account
            </Button>
          </div> */}
        </div>
      </div>

      {/* Recruiter Update Profile */}
      <RecruiterUpdateProfile open={open} setOpen={setOpen} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RecruiterProfile;
