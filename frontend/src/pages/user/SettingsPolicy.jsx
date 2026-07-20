import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Shield, HelpCircle, Activity, FileText, Briefcase,
  Settings, LogOut, User, Lock, Trash2, ExternalLink,
  ChevronDown, ChevronUp, Send, Clock, Monitor,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { logOut } from "@/redux/authSlice";
import {
  USER_API_END_POINT,
  APPLICATION_API_END_POINT,
  CONTACT_MESSAGE_API_END_POINT,
} from "@/utils/ApiEndPoint";
import { Helmet } from "react-helmet-async";

// ── Status badge colours (matches UserProfile) ──────────────────────────────
const statusStyles = {
  Shortlisted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Interview Schedule": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

// ── Shared card wrapper ──────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="font-semibold text-gray-800 dark:text-white mb-4">{children}</h2>
);

// ── 1. Security & Policy card ────────────────────────────────────────────────
const SecurityCard = ({ user }) => {
  const navigate = useNavigate();
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) return toast.error("Passwords do not match");
    if (pwForm.next.length < 8) return toast.error("Password must be at least 8 characters");
    setPwLoading(true);
    try {
      // Reuse forgot-password flow: send reset link to email
      await axios.post(`${USER_API_END_POINT}/forgot-password`, {
        email: user?.emailId?.email,
      }, { withCredentials: true });
      toast.success("Password reset link sent to your email");
      setPwForm({ current: "", next: "", confirm: "" });
      setShowPw(false);
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteEmail) return toast.error("Enter your email to confirm");
    try {
      await axios.delete(`${USER_API_END_POINT}/delete`, {
        data: { email: deleteEmail },
        withCredentials: true,
      });
      dispatch(logOut());
      navigate("/");
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <Card>
      <SectionTitle>Security &amp; Policy</SectionTitle>

      {/* Password */}
      <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</span>
          </div>
          <button
            onClick={() => setShowPw((v) => !v)}
            className="text-blue-600 text-xs hover:underline flex items-center gap-1"
          >
            Change {showPw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        {showPw && (
          <form onSubmit={handlePasswordChange} className="mt-3 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A password reset link will be sent to <strong>{user?.emailId?.email}</strong>.
            </p>
            <button
              type="submit"
              disabled={pwLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg disabled:opacity-50"
            >
              {pwLoading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>

      {/* Privacy Policy & Terms */}
      <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 mb-3 space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" /> Legal &amp; Privacy
        </p>
        <div className="flex flex-wrap gap-3 mt-1">
          <a
            href="/policy/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            Privacy Policy <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/policy/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            Terms &amp; Conditions <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/policy/refund-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            Refund Policy <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="border border-red-100 dark:border-red-900/40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</span>
          </div>
          <button
            onClick={() => setShowDelete((v) => !v)}
            className="text-red-500 text-xs hover:underline flex items-center gap-1"
          >
            {showDelete ? "Cancel" : "Delete"} {showDelete ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        {showDelete && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This action is <strong>irreversible</strong>. All your data and applications will be permanently deleted.
            </p>
            <input
              type="email"
              placeholder="Confirm your email address"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg"
            >
              Permanently Delete My Account
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

// ── 2. Help Desk card ────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: "How do I update my resume?", a: "Go to your Profile page and click 'Update Resume' in the right panel." },
  { q: "How do I track my job applications?", a: "Your applications are visible in the Activity section below, or in the Applied Jobs card on your Profile." },
  { q: "How do I change my email or phone?", a: "Click 'Edit Profile' on your Profile page to update contact details." },
  { q: "Why was my application rejected?", a: "Applications pending for more than 30 days are auto-rejected. You can re-apply to the same job." },
  { q: "How do I delete my account?", a: "Use the 'Delete Account' option in the Security & Policy section above." },
];

const HelpDeskCard = ({ user }) => {
  const [form, setForm] = useState({ message: "" });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return toast.error("Please enter a message");
    setLoading(true);
    try {
      await axios.post(CONTACT_MESSAGE_API_END_POINT, {
        fullname: user?.fullname || "User",
        email: user?.emailId?.email || "",
        phoneNumber: user?.phoneNumber?.number || "N/A",
        message: `[Support Request from Profile]\n${form.message}`,
      });
      toast.success("Support request sent! We'll respond within 24 hours.");
      setForm({ message: "" });
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <SectionTitle>Help Desk</SectionTitle>

      {/* Support Form */}
      <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-600" /> Contact Support
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            rows={3}
            placeholder="Describe your issue or question…"
            value={form.message}
            onChange={(e) => setForm({ message: e.target.value })}
            maxLength={500}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{form.message.length}/500</span>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="w-3 h-3" /> {loading ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          Or email us at{" "}
          <a href="mailto:sanketbabde@greathire.in" className="text-blue-600 hover:underline">sanketbabde@greathire.in</a>
          {" "}· Response within 24 hours (Mon–Fri)
        </p>
      </div>

      {/* FAQ */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Frequently Asked Questions</p>
        <div className="space-y-1">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <span>{item.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// ── 3. Activity card ─────────────────────────────────────────────────────────
const ActivityCard = () => {
  const [applications, setApplications] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(true);
  const [tab, setTab] = useState("applications");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true })
      .then((r) => { if (r.data.success) setApplications(r.data.application || []); })
      .catch(() => {})
      .finally(() => setAppLoading(false));

    axios.get(`${USER_API_END_POINT}/login-history`, { withCredentials: true })
      .then((r) => { if (r.data.success) setLoginHistory(r.data.loginHistory || []); })
      .catch(() => {})
      .finally(() => setLoginLoading(false));
  }, []);

  return (
    <Card className="flex flex-col h-full">
      <SectionTitle>Activity</SectionTitle>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        {["applications", "logins"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {t === "applications" ? `Applications (${applications.length})` : "Login History"}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">

      {/* Applications tab */}
      {tab === "applications" && (
        appLoading ? (
          <p className="text-xs text-gray-400 text-center py-4">Loading…</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No applications yet.</p>
        ) : (
          <div className="space-y-2">
            {applications.map((app, i) => (
              <div
                key={i}
                onClick={() => app.job?._id && navigate(`/description/${app.job._id}`)}
                className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {app.job?.jobDetails?.title || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {app.job?.company?.companyName || "N/A"}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyles[app.status] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
                  {app.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Login history tab */}
      {tab === "logins" && (
        loginLoading ? (
          <p className="text-xs text-gray-400 text-center py-4">Loading…</p>
        ) : loginHistory.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">No login history recorded yet.</p>
            <p className="text-xs text-gray-400 mt-1">Login history is tracked from this point forward.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {loginHistory.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {new Date(entry.timestamp).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                  {entry.ip && <p className="text-[11px] text-gray-400 mt-0.5">IP: {entry.ip}</p>}
                  {entry.device && (
                    <p className="text-[11px] text-gray-400 truncate" title={entry.device}>
                      {entry.device.slice(0, 80)}{entry.device.length > 80 ? "…" : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      </div>
    </Card>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
const SettingsPolicy = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const leftColRef = React.useRef(null);
  const [leftHeight, setLeftHeight] = React.useState(null);

  useEffect(() => {
    if (!leftColRef.current) return;
    const ro = new ResizeObserver(() => {
      setLeftHeight(leftColRef.current?.offsetHeight ?? null);
    });
    ro.observe(leftColRef.current);
    return () => ro.disconnect();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(logOut());
      navigate("/");
    } catch {
      toast.error("Error logging out");
    }
  }, [dispatch, navigate]);

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Settings &amp; Policy | GreatHire</title>
      </Helmet>

      <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 flex">
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-30 shadow-sm">
          <span className="text-xl font-bold">
            <span className="text-gray-900 dark:text-white">Great</span><span className="text-blue-600">Hire</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        {/* Left Sidebar */}
        <aside
          className="w-56 bg-white dark:bg-gray-800 shadow-sm flex flex-col px-4 pb-6 fixed left-0 z-20"
          style={{ height: "calc(100vh - 56px)", top: "56px", overflowY: "auto" }}
        >
          <div className="space-y-1 mb-4 pt-4">
            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button
              onClick={() => navigate("/ResumeAnalyzer")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <FileText className="w-4 h-4" /> Resume Analyzer
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <Briefcase className="w-4 h-4" /> Jobs
            </button>
            <button
              onClick={() => navigate("/profile/settings-policy")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm"
            >
              <Shield className="w-4 h-4" /> Settings &amp; Policy
            </button>
          </div>

          <hr className="border-gray-200 dark:border-gray-700 mb-4" />
        </aside>

        {/* Main content */}
        <main className="ml-56 flex-1 px-5 pb-6" style={{ paddingTop: "72px" }}>
          <div className="flex gap-4 items-start">
            {/* Left column — Security + Help Desk */}
            <div ref={leftColRef} className="flex-1 space-y-4">
              <SecurityCard user={user} />
              <HelpDeskCard user={user} />
            </div>

            {/* Right column — Activity: exact same height as left column */}
            <div
              className="w-[420px] flex-shrink-0 sticky top-[72px]"
              style={{ height: leftHeight ? `${leftHeight}px` : 'auto' }}
            >
              <ActivityCard />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SettingsPolicy;
