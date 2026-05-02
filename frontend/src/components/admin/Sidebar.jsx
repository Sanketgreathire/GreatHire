import React, { useEffect, useState, useCallback, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineSetting } from "react-icons/ai";
import { FaUsers, FaBriefcase, FaChartBar, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FaUserTie, FaGraduationCap, FaBookOpen } from "react-icons/fa6";
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
  { name: "Dashboard",   path: "/admin/dashboard",       icon: AiOutlineDashboard      },
  { name: "Job Seekers", path: "/admin/users",            icon: FaUsers                 },
  { name: "Companies",   path: "/admin/companies",        icon: PiBuildingOfficeDuotone },
  { name: "Recruiters",  path: "/admin/recruiters-list",  icon: FaUserTie               },
  { name: "Jobs",        path: "/admin/jobs",             icon: FaBriefcase             },
  { name: "Campus",      path: "/admin/campus-dashboard", icon: FaGraduationCap         },
  { name: "Courses",     path: "/admin/courses",          icon: FaBookOpen              },
  { name: "Reports",     path: "/admin/reports",          icon: FaChartBar              },
  { name: "Settings",    path: "/admin/settings",         icon: AiOutlineSetting        },
];

const NavItem = memo(({ item, onClick }) => (
  <li>
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
          isActive
            ? "bg-blue-700 dark:bg-blue-600 text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={20}
            aria-hidden="true"
            className={isActive ? "text-white shrink-0" : "text-blue-700 dark:text-blue-400 shrink-0"}
          />
          <span>{item.name}</span>
        </>
      )}
    </NavLink>
  </li>
));
NavItem.displayName = "NavItem";

const Sidebar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [navClicked, setNavClicked] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!navClicked) return;
    dispatch(fetchCompanyStats());
    dispatch(fetchRecruiterStats());
    dispatch(fetchJobStats());
    dispatch(fetchApplicationStats());
    dispatch(fetchUserStats());
    setNavClicked(false);
  }, [location.pathname, navClicked, dispatch]);

  const handleNavClick = useCallback(() => setNavClicked(true), []);
  const openSidebar    = useCallback(() => setIsOpen(true),  []);
  const closeSidebar   = useCallback(() => setIsOpen(false), []);

  const profilePhoto =
    user?.profile?.profilePhoto && !user.profile.profilePhoto.includes("github.com")
      ? user.profile.profilePhoto
      : "/src/assets/noprofile.webp";

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-0 left-0 z-40 md:hidden h-16 w-14 flex items-center justify-center text-blue-700 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={openSidebar}
        aria-label="Open navigation menu"
      >
        <FaBars size={20} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Admin navigation"
        className={`
          fixed top-16 left-0 bottom-0 z-50
          w-52
          bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          will-change-transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOP: mobile close row + nav */}
        <div className="flex flex-col min-h-0 overflow-hidden">
          {/* Mobile close row */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Menu</span>
            <button
              onClick={closeSidebar}
              className="p-1 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Close navigation menu"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="py-3 px-3" aria-label="Main navigation">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <NavItem key={item.path} item={item} onClick={handleNavClick} />
              ))}
            </ul>
          </nav>
        </div>

        {/* BOTTOM: profile — always at the very bottom */}
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-3">
          <NavLink
            to={user ? "/admin/profile" : "/admin/login"}
            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            {user ? (
              <>
                <img
                  src={profilePhoto}
                  alt={user.fullname || "Admin"}
                  className="h-9 w-9 rounded-full border border-gray-300 dark:border-gray-600 object-cover shrink-0"
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
                    {user.fullname}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate capitalize">
                    {user.role}
                  </p>
                </div>
              </>
            ) : (
              <>
                <FaUser size={20} aria-hidden="true" className="text-blue-700 dark:text-blue-400 shrink-0" />
                <span className="text-sm text-gray-900 dark:text-gray-100">Login</span>
              </>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "AdminSidebar";
export default Sidebar;