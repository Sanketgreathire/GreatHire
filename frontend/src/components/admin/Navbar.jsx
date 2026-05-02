import React, { useState, useRef, useCallback, memo } from "react";
import { Bell, MessageSquareText, LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { resetStats } from "@/redux/admin/statsSlice";
import { logOut } from "@/redux/authSlice";
import useNotification from "@/hooks/useNotification";
import { USER_API_END_POINT, NOTIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = memo(({ linkName }) => {
  const { user } = useSelector((state) => state.auth);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications, setNotifications } = useNotification();

  const handleShowNotification = useCallback(async () => {
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
  }, [navigate, setNotifications]);

  const handleLogout = useCallback(async () => {
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
  }, [dispatch, navigate]);

  const profilePhoto = user?.profile?.profilePhoto && !user.profile.profilePhoto.includes('github.com')
    ? user.profile.profilePhoto
    : "/src/assets/noprofile.webp";

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 transition-colors">

      {/* LEFT — Logo */}
      <Link to="/admin/dashboard" className="flex items-center gap-1 shrink-0">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">Great</span>
        <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">Hire</span>
        <span className="ml-2 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full hidden sm:inline">Admin</span>
      </Link>

      {/* CENTER — Page Title (desktop only) */}
      <div className="hidden md:block text-lg font-medium text-gray-600 dark:text-gray-300 truncate">
        {linkName}
      </div>

      {/* RIGHT — Actions */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* Dark / Light Mode Toggle */}
        <ThemeToggle />

        {/* Notification / Message */}
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={handleShowNotification}
          aria-label="Notifications"
        >
          {notifications && notifications > 0 ? (
            <>
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center w-4 h-4 bg-red-600 dark:bg-red-500 text-white text-[10px] font-bold rounded-full">
                {notifications > 9 ? "9+" : notifications}
              </span>
            </>
          ) : (
            <MessageSquareText className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          )}
        </button>

        {/* Profile */}
        <div ref={profileMenuRef} className="relative">
          {user ? (
            <>
              <button
                onClick={() => setIsProfileMenuOpen((p) => !p)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <img
                  src={profilePhoto}
                  alt={user?.fullname || "Admin"}
                  className="h-8 w-8 md:h-9 md:w-9 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <Link
                    to="/admin/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/admin/login"
              className="bg-blue-700 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "AdminNavbar";
export default Navbar;
