import React, { useState, useRef } from "react";
import { Bell, MessageSquareText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { resetStats } from "@/redux/admin/statsSlice";
import { logOut } from "@/redux/authSlice";
import useNotification from "@/hooks/useNotification";
import { USER_API_END_POINT, NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = ({ linkName }) => {
  const { user } = useSelector((state) => state.auth);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications, setNotifications } = useNotification();

  const handleShowNotification = async () => {
    try {
      const { data } = await axios.put(
        `${NOTIFICATION_API_END_POINT}/mark-seen`,
        null,
        { withCredentials: true }
      );
      if (data.success) {
        setNotifications(0);
        navigate("/admin/messages");
      }
    } catch (err) {
      console.error("Error in mark seen notifications:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(logOut());
        dispatch(resetStats());
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
    <nav className="flex justify-between items-center fixed top-0 left-0 right-0 ml-16 md:ml-52 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2 z-30 transition-colors">
      
      {/* Page Title */}
      <div className="text-2xl font-light text-gray-900 dark:text-white">
        {linkName}
      </div>

      {/* Mobile Brand Logo */}
      <div className="text-2xl font-bold md:hidden flex items-center justify-center">
        <span className="text-gray-900 dark:text-white">Great</span>
        <span className="text-blue-700 dark:text-blue-400">Hire</span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Dark Mode Toggle */}
        <ThemeToggle />

        {/* Notification/Message Icon */}
        <div className="relative">
          {notifications && notifications > 0 ? (
            <>
              <Bell
                className="w-7 h-7 md:w-8 md:h-8 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={handleShowNotification}
              />
              <span className="absolute top-[-5px] right-0 inline-flex items-center justify-center w-5 h-5 bg-red-600 dark:bg-red-500 text-white text-xs font-bold rounded-full">
                {notifications}
              </span>
            </>
          ) : (
            <MessageSquareText
              className="w-7 h-7 md:w-8 md:h-8 cursor-pointer text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              onClick={() => navigate("/admin/messages")}
            />
          )}
        </div>

        {/* User Profile / Login */}
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
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                />
                <div className="hidden md:block text-left">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {user?.fullname}
                  </p>
                  <p className="font-medium text-gray-400 dark:text-gray-500 text-sm">
                    {user?.role || "User"}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-2xl z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-3">
              <a
                href="/auth"
                className="bg-blue-700 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors font-medium"
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