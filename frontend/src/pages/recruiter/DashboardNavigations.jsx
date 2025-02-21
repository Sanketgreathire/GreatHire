import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiHome4Line, RiCloseFill } from "react-icons/ri";
import { IoCreateOutline, IoSettingsOutline } from "react-icons/io5";
import { MdWorkOutline, MdPostAdd } from "react-icons/md";
import {
  PiBuildingOffice,
  PiBuildingOfficeLight,
  PiStudent,
} from "react-icons/pi";
import { GiUpgrade } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPersonPlus } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { CiMenuBurger } from "react-icons/ci";
import { useSelector } from "react-redux";

const DashboardNavigations = () => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg w-full transition ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100 text-gray-700"
    }`;

  const iconClass = (isActive) => (isActive ? "text-white" : "text-blue-600");

  return (
    <>
      {/* 🔹 Hamburger Button (Visible on Small Screens) */}
      <button
        className=" z-30 lg:hidden p-2 fixed top-4 left-4   rounded-sm"
        onClick={() => setSidebarOpen(true)}
      >
        <CiMenuBurger size={24} />
      </button>

      {/* 🔹 Sidebar */}
      <div
        className={`
          fixed top-0 lg:top-16 border-t-2 border-gray-300 left-0 z-30 bg-gradient-to-b bg-white transition-transform duration-300 ease-in-out
          w-64 h-screen transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }
          lg:sticky  lg:h-[calc(100vh-4rem)] lg:w-52 lg:translate-x-0
        `}
      >
        {/* Close Button (Only for Mobile) */}
        <button
          className="lg:hidden absolute top-4 right-4 text-gray-600"
          onClick={() => setSidebarOpen(false)}
        >
          <RiCloseFill size={24} />
        </button>

        <div className="flex flex-col h-full p-4 justify-between ">
          {/* Main Navigation */}
          <section>
            <h2 className="flex gap-2 items-center text-lg font-semibold text-gray-700 mb-4">
              <LuLayoutDashboard size={25} className="text-blue-700" />
              <span>Dashboard</span>
            </h2>
            <ul className="w-full flex flex-col gap-2">
              <NavLink
                to="/recruiter/dashboard/home"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <RiHome4Line size={25} className={iconClass(isActive)} />
                    <span>Home</span>
                  </>
                )}
              </NavLink>
              <li className="relative group ml-1 ">
                <span
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex gap-2 px-2 py-2 cursor-pointer rounded-lg text-gray-700 hover:bg-blue-100"
                >
                  <IoCreateOutline size={25} className="text-blue-600" />
                  <span>Create New</span>
                </span>
                <ul
                  className={`
          absolute left-5 bg-gray-50 shadow-lg rounded-xl py-2 w-full
          ${
            isDropdownOpen ? "block" : "hidden"
          }  /* Mobile: controlled by state */
          md:group-hover:block              /* Desktop: show on hover */
        `}
                >
                  {/* Conditionally render submenu links */}
                  {!user?.isCompanyCreated && (
                    <NavLink
                      to="/recruiter/dashboard/create-company"
                      className={navLinkClass}
                      onClick={() => {
                        setSidebarOpen(false);
                        setDropdownOpen(false);
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <PiBuildingOfficeLight
                            size={25}
                            className={iconClass(isActive)}
                          />
                          <span>Company</span>
                        </>
                      )}
                    </NavLink>
                  )}

                  {user?.isActive &&
                    user?.isCompanyCreated &&
                    user?.emailId?.email === company?.adminEmail && (
                      <NavLink
                        to="/recruiter/dashboard/add-recruiter"
                        className={navLinkClass}
                        onClick={() => {
                          setSidebarOpen(false);
                          setDropdownOpen(false);
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <BsPersonPlus
                              size={25}
                              className={iconClass(isActive)}
                            />
                            <span>Add Recruiter</span>
                          </>
                        )}
                      </NavLink>
                    )}
                  {user?.isActive && user?.isCompanyCreated && (
                    <NavLink
                      to="/recruiter/dashboard/post-job"
                      className={navLinkClass}
                      onClick={() => {
                        setSidebarOpen(false);
                        setDropdownOpen(false);
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <MdPostAdd
                            size={25}
                            className={iconClass(isActive)}
                          />
                          <span>Post Job</span>
                        </>
                      )}
                    </NavLink>
                  )}
                </ul>
              </li>
              <NavLink
                to="/recruiter/dashboard/jobs"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <MdWorkOutline size={25} className={iconClass(isActive)} />
                    <span>Jobs</span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/recruiter/dashboard/applicants-list"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <FiUsers size={25} className={iconClass(isActive)} />
                    <span>Applicants</span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/recruiter/dashboard/company-details"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <PiBuildingOffice
                      size={25}
                      className={iconClass(isActive)}
                    />
                    <span>Company Details</span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/recruiter/dashboard/candidate-list"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <PiStudent size={25} className={iconClass(isActive)} />
                    <span>Find Candidates</span>
                  </>
                )}
              </NavLink>
            </ul>
          </section>

          {/* Footer Navigation */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
              <IoSettingsOutline size={25} className="text-blue-700" />
              <span>Settings</span>
            </h2>
            <ul className="flex flex-col gap-2">
              <NavLink
                to="/recruiter/dashboard/recruiter-list"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <FiUsers size={25} className={iconClass(isActive)} />
                    <span>Recruiters</span>
                  </>
                )}
              </NavLink>
              <NavLink
                to="/recruiter/dashboard/your-plans"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <GiUpgrade size={25} className={iconClass(isActive)} />
                    <span>
                      {company?.maxPostJobs === 0
                        ? "Upgrade Plans"
                        : "Current Plan"}
                    </span>
                  </>
                )}
              </NavLink>
              {user?.emailId?.email === company?.adminEmail && (
                <NavLink
                  to="/recruiter/dashboard/delete-account"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <RiDeleteBin6Line
                        size={25}
                        className={iconClass(isActive)}
                      />
                      <span>Delete Account</span>
                    </>
                  )}
                </NavLink>
              )}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default DashboardNavigations;
