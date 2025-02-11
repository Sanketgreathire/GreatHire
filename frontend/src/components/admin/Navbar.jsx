import React from "react";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";

const Navbar = ({ linkName }) => {
  const { user } = useSelector((state) => state.auth);

  // handle log out function
  const handleLogout = async () => {
    try {
    } catch (err) {}
  };

  return (
    <nav className=" flex justify-between items-center fixed top-0 left-0 right-0 ml-16 lg:ml-52 bg-white px-3 py-2 z-30 ">
      {/* Left - Link Name */}
      <div className="text-2xl font-light">{linkName}</div>

      {/* Center - GreatHire (Visible only on mobile) */}
      <div
        className={`text-2xl font-bold md:hidden flex items-center justify-center`}
      >
        <span>Great</span>
        <span className="text-blue-700">Hire</span>
      </div>

      {/* Right - Bell Icon & Profile */}
      <div className="flex items-center gap-4">
        <Bell className="w-6 h-6 cursor-pointer" />
        <div className="  cursor-pointer flex items-center gap-2">
          <img
            src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
            alt={`${user?.fullname || "User"}'s avatar`}
            className="h-10 w-10 rounded-full border object-cover"
          />
          <div >
            <p className="font-bold">{user?.fullname}</p>
            <p className="font-medium text-center text-gray-400">Owner</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
