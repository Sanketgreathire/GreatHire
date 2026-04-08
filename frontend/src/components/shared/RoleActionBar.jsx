import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GUEST_ACTIONS = [
  { label: "Find Jobs",        path: "/jobs",            color: "bg-blue-600 hover:bg-blue-700",   icon: "🔍" },
  { label: "Post a Job",       path: "/recruiter/signup",color: "bg-purple-600 hover:bg-purple-700", icon: "📝" },
  { label: "Campus Hiring",    path: "/college/login",   color: "bg-pink-600 hover:bg-pink-700",   icon: "🎓" },
  { label: "Student Sign Up",  path: "/student/signup",  color: "bg-indigo-600 hover:bg-indigo-700", icon: "🎓" },
];

const STUDENT_ACTIONS = [
  { label: "Browse Jobs",      path: "/jobs",            color: "bg-blue-600 hover:bg-blue-700",   icon: "💼" },
  { label: "Saved Jobs",       path: "/saved-jobs",      color: "bg-purple-600 hover:bg-purple-700", icon: "🔖" },
  { label: "Resume Analyzer",  path: "/ResumeAnalyzer",  color: "bg-pink-600 hover:bg-pink-700",   icon: "📄" },
  { label: "Refer & Boost",    path: "/refer-and-boost", color: "bg-indigo-600 hover:bg-indigo-700", icon: "🚀" },
];

export default function RoleActionBar() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isRecruiter = user?.role === "recruiter";
  if (isRecruiter) return null;

  const actions = user ? STUDENT_ACTIONS : GUEST_ACTIONS;

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs text-white/80 font-medium mr-2 hidden sm:block">
          {user ? "Quick access →" : "Get started →"}
        </span>
        {actions.map(({ label, path, color, icon }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`${color} text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-white/20`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
