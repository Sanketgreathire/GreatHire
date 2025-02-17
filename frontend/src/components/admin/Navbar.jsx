import React, { useState, useRef } from "react";
import { Bell, MessageSquareText } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { logOut } from "@/redux/authSlice";
import useNotification from "@/hooks/useNotification";
import { NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";

const Navbar = ({ linkName }) => {
  const { user } = useSelector((state) => state.auth);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve notifications from your custom hook
  const { notifications } = useNotification();
  console.log(notifications)

  const handleShowNotification = async () => {
    try {
      const { data } = await axios.put(
        `${NOTIFICATION_API_END_POINT}/mark-seen`,
        null, // No request body
        { withCredentials: true } // This is the config object
      );

      if (data.success) {
        navigate("/admin/messages");
      }
    } catch (err) {
      console.error("Error in mark seen notifications:", err);
    }
  };
  // Handle logout function
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(logOut());
        setIsProfileMenuOpen(false);
        toast.success(response.data.message);
        navigate("/admin/login");
      } else {
        toast.error("Error in logout");
      }
    } catch (err) {
      toast.error(`Error in logout ${err}`);
    }
  };

  return (
    <nav className="flex justify-between items-center fixed top-0 left-0 right-0 ml-16 md:ml-52 bg-white px-3 py-2 z-30">
      {/* Left - Link Name */}
      <div className="text-2xl font-light">{linkName}</div>

      {/* Center - GreatHire (Visible only on mobile) */}
      <div className="text-2xl font-bold md:hidden flex items-center justify-center">
        <span>Great</span>
        <span className="text-blue-700">Hire</span>
      </div>

      {/* Right - Notification Bell, Profile, and Extra Links */}
      <div className="flex items-center gap-8">
        {/* Notification Icon with Badge */}
        <div className="relative">
          {notifications && notifications > 0 ? (
            <>
              <Bell
                className="w-8 h-8 cursor-pointer"
                onClick={handleShowNotification}
              />
              <span className="absolute top-[-5px] right-0 inline-flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full">
                {notifications}
              </span>
            </>
          ) : (
            <MessageSquareText
              className="w-8 h-8 cursor-pointer text-blue-700"
              onClick={() => navigate("/admin/messages")}
            />
          )}
        </div>

        {/* Profile Section */}
        <div ref={profileMenuRef} className="relative">
          {user ? (
            <>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <img
                  src={
                    user?.profile?.profilePhoto ||
                    "https://github.com/shadcn.png"
                  }
                  alt={`${user?.fullname || "User"}'s avatar`}
                  className="h-10 w-10 rounded-full border object-cover"
                />
                <div>
                  <p className="font-bold">{user?.fullname}</p>
                  <p className="font-medium text-gray-400">
                    {user?.role || "User"}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-3">
              <a
                href="/admin/login"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Login
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
