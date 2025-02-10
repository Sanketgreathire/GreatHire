import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineSetting } from "react-icons/ai";
import {
  FaUsers,
  FaUserTie,
  FaBriefcase,
  FaChartBar,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: AiOutlineDashboard },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  { name: "Recruiters", path: "/admin/recruiters", icon: FaUserTie },
  { name: "Jobs", path: "/admin/jobs", icon: FaBriefcase },
  { name: "Reports", path: "/admin/reports", icon: FaChartBar },
  { name: "Settings", path: "/admin/settings", icon: AiOutlineSetting },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return ( 
    <>
      {/* Sidebar Container */}
      <div
        className={`fixed z-30 h-screen overflow-y-scroll bg-white flex flex-col transition-all duration-300 ${
          isOpen ? "w-52" : "w-16"
        } md:w-52`}
      >
        {/* Logo / Title */}
        {/* Hamburger Button - visible only on mobile */}
        <div>
          <button
            className=" p-4 md:hidden text-blue-700 text-2xl z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div
            className={`p-4 text-2xl font-bold border-b border-gray-300 hidden md:flex items-center justify-center`}
          >
            <span>Great</span>
            <span className="text-blue-700">Hire</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 ${isOpen ? "p-4" : "p-2"}`}>
          <ul className="space-y-2 text-gray-600">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
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
                      <span
                        className={`${isOpen ? "block" : "hidden"} md:block`}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile Link at the bottom */}
        <div
          className={`${
            isOpen ? "p-4 w-52" : "w-16"
          } border-t border-gray-300 fixed bottom-0 md:w-52 `}
        >
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 px-4 rounded ${
                isActive ? "bg-blue-700 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FaUser
                  className={`text-lg bg-blue-100 p-2 rounded-full ${
                    isActive ? "text-white" : "text-blue-700"
                  }`}
                  size={40}
                />
                <span className={`${isOpen ? "block" : "hidden"} md:block`}>
                  Profile
                </span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
