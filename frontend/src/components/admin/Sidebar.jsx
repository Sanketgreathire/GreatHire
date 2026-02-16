import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineSetting } from "react-icons/ai";
import {
  FaUsers,
  FaBriefcase,
  FaChartBar,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import { PiBuildingOfficeDuotone } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchCompanyStats,
  fetchRecruiterStats,
  fetchJobStats,
  fetchApplicationStats,
  fetchUserStats,
} from "@/redux/admin/statsSlice";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: AiOutlineDashboard },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  { name: "Companies", path: "/admin/companies", icon: PiBuildingOfficeDuotone },
  { name: "Recruiters", path: "/admin/recruiters-list", icon: FaUserTie },
  { name: "Jobs", path: "/admin/jobs", icon: FaBriefcase },
  { name: "Reports", path: "/admin/reports", icon: FaChartBar },
  { name: "Settings", path: "/admin/settings", icon: AiOutlineSetting },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarNavClicked, setSidebarNavClicked] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (sidebarNavClicked) {
      dispatch(fetchCompanyStats());
      dispatch(fetchRecruiterStats());
      dispatch(fetchJobStats());
      dispatch(fetchApplicationStats());
      dispatch(fetchUserStats());
      setSidebarNavClicked(false);
    }
  }, [location.pathname, user]);

  return (
    <>
      {/* ✅ MOBILE TOGGLE BUTTON */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-blue-700 dark:bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* ✅ BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 flex flex-col
          transition-all duration-300 ease-in-out
          w-52
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:w-52
          border-r border-gray-200 dark:border-gray-700
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="text-2xl font-bold hidden md:flex">
            <span className="text-gray-900 dark:text-gray-100">Great</span>
            <span className="text-blue-700 dark:text-blue-500">Hire</span>
          </div>

          <button
            className="md:hidden text-blue-700 dark:text-blue-500 text-2xl hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 pt-6 overflow-y-auto">
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    setSidebarNavClicked(true);
                    setIsOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2 px-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-700 dark:bg-blue-600 text-white"
                        : "hover:bg-blue-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={24}
                        className={isActive ? "text-white" : "text-blue-700 dark:text-blue-500"}
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* PROFILE */}
        <div className="border-t border-gray-300 dark:border-gray-700 p-4">
          <NavLink
            to={user ? "/admin/profile" : "/admin/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {user ? (
              <>
                <img
                  src={
                    user.profile?.profilePhoto ||
                    "https://github.com/shadcn.png"
                  }
                  alt="profile"
                  className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">{user.fullname}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{user.role}</p>
                </div>
              </>
            ) : (
              <>
                <FaUser
                  className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-700 dark:text-blue-400"
                  size={36}
                />
                <span className="text-gray-900 dark:text-gray-100">Login</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;