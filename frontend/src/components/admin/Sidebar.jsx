import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Navigation components
import { AiOutlineDashboard, AiOutlineSetting } from "react-icons/ai"; // Dashboard & Settings icons
import {
  FaUsers,
  FaBriefcase,
  FaChartBar,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa"; // Various user interface icons
import { FaUserTie } from "react-icons/fa6"; // Recruiter icon
import { PiBuildingOfficeDuotone } from "react-icons/pi"; // Company icon
import { useSelector, useDispatch } from "react-redux"; // Redux hooks for state management

import {
  fetchCompanyStats,
  fetchRecruiterStats,
  fetchJobStats,
  fetchApplicationStats,
  fetchUserStats,
} from "@/redux/admin/statsSlice"; // Import Redux actions for fetching statistics

// Navigation items for the sidebar menu
const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: AiOutlineDashboard },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  {
    name: "Companies",
    path: "/admin/companies",
    icon: PiBuildingOfficeDuotone,
  },
  { name: "Recruiters", path: "/admin/recruiters-list", icon: FaUserTie },
  { name: "Jobs", path: "/admin/jobs", icon: FaBriefcase },
  { name: "Reports", path: "/admin/reports", icon: FaChartBar },
  { name: "Settings", path: "/admin/settings", icon: AiOutlineSetting },
];

// Sidebar component for navigation
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to track sidebar open/close state
  const [sidebarNavClicked, setSidebarNavClicked] = useState(false); // State to track navigation clicks
  const { user } = useSelector((state) => state.auth); // Get authenticated user from Redux store
  const dispatch = useDispatch();
  const location = useLocation(); // Get current route location

  // Fetch admin statistics when the sidebar navigation is clicked
  useEffect(() => {
    if (sidebarNavClicked) {
      dispatch(fetchCompanyStats()); // Fetch company statistics
      dispatch(fetchRecruiterStats()); // Fetch recruiter statistics
      dispatch(fetchJobStats()); // Fetch job statistics
      dispatch(fetchApplicationStats()); // Fetch application statistics
      dispatch(fetchUserStats()); // Fetch user statistics
      setSidebarNavClicked(false); // Reset the state after data fetch
    }
  }, [location.pathname, user]); // Re-run when the location or user changes

  return (
    <div
      className={`fixed inset-y-0 z-30 overflow-y-scroll bg-white flex flex-col transition-all duration-300 ${
        isOpen ? "w-52" : "w-16"
      } md:w-52`}
    >
      {/* Logo / Title */}
      <div>
        <button
          className="p-4 md:hidden text-blue-700 text-2xl z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="p-4 text-2xl font-bold border-b border-gray-300 hidden md:flex items-center justify-center">
          <span>Great</span>
          <span className="text-blue-700">Hire</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={`flex-1 ${isOpen ? "p-4 pt-8" : "p-2 pt-8"}`}>
        <ul className="space-y-2 text-gray-600">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setSidebarNavClicked(true)} // Set state when sidebar link is clicked
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-4 rounded-lg ${
                    isActive ? "bg-blue-700 text-white" : "hover:bg-blue-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`text-lg ${
                        isActive ? "text-white" : "text-blue-700"
                      }`}
                      size={25}
                    />
                    <span className={`${isOpen ? "block" : "hidden"} md:block`}>
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile Section */}
      <div
        className={`border-t border-gray-300 fixed bottom-0 w-16 md:w-52 ${
          isOpen ? "p-4 w-52" : "w-16"
        }`}
      >
        <NavLink
          to={user ? "/admin/profile" : "/admin/login"}
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-4 rounded ${
              isActive ? "bg-blue-700 text-white" : "hover:bg-gray-100"
            }`
          }
        >
          {user ? (
            <>
              <img
                src={
                  user.profile?.profilePhoto || "https://github.com/shadcn.png"
                }
                alt={`${user.fullname || "User"}'s avatar`}
                className="h-10 w-10 rounded-full border object-cover"
              />
              <div className={`md:block ${isOpen ? "block" : "hidden"}`}>
                <p className="font-bold">{user.fullname}</p>
                <p className="font-medium text-gray-400">{user.role}</p>
              </div>
            </>
          ) : (
            <>
              <FaUser
                className="text-lg bg-blue-100 p-2 rounded-full text-blue-700"
                size={40}
              />
              <span className={`${isOpen ? "block" : "hidden"} md:block`}>
                Login
              </span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
