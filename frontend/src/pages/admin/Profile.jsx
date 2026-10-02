// Import necessary modules and dependencies
import React, { useState } from "react";
import Navbar from "@/components/admin/Navbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Contact, Mail, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpdateProfile from "./UpdateProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navbar */}
      <Navbar linkName={"Profile"}/>

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-start sm:items-center px-4 sm:px-6 py-8 sm:py-10">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl dark:shadow-gray-900/50 rounded-lg p-5 sm:p-8 md:p-10 transition-colors">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center border-b border-gray-200 dark:border-gray-700 pb-6">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 shadow-lg ring-4 ring-gray-100 dark:ring-gray-700">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto || "https://github.com/shadcn.png"
                }
                alt="Profile Photo"
              />
            </Avatar>
            <h1 className="mt-4 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
              {user?.fullname || "User"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{user?.role || "Admin"}</p>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="mt-4 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 transition-colors"
            >
              <Pen className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Contact Information */}
          <div className="mt-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">
              Contact Information
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Mail className="text-blue-500 dark:text-blue-400 mt-1 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base break-all">
                  {user?.emailId?.email || "No Email"}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <Contact className="text-green-500 dark:text-green-400 mt-1 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base break-all">
                  {user?.phoneNumber?.number || "No Phone"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Admin Update Profile */}
      <UpdateProfile open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;