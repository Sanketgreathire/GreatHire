import React from "react";
import { Bell } from "lucide-react";

const Navbar = ({ linkName }) => {
  return (
    <nav className="flex items-center justify-between bg-white p-3">
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
        <div className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer"></div>
      </div>
    </nav>
  );
};

export default Navbar;
