import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import { toast } from "react-hot-toast";
import { decreaseMaxPostJobs } from "@/redux/companySlice";
import axios from "axios";
import { allLocations, jobTitles } from "@/utils/constant";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

const flatLocations = Object.values(allLocations).flat();

// Build a map: location string → state name for fuzzy state-name matching
const locationStateMap = Object.entries(allLocations).reduce((acc, [state, cities]) => {
  cities.forEach(city => { acc[city] = state; });
  return acc;
}, {});

const filterLocations = (query) => {
  if (!query) return flatLocations;
  const q = query.toLowerCase();
  return flatLocations.filter(loc =>
    loc.toLowerCase().includes(q) ||
    (locationStateMap[loc] || "").toLowerCase().includes(q)
  );
};

/* ------------------------------------------------------------------ */
/*  Shared style tokens (visual layer only — no behavioural changes)  */
/* ------------------------------------------------------------------ */
const cardCls =
  "rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none p-5 md:p-6 transition-colors duration-300";
const labelCls =
  "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors duration-300";
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.06] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200 text-sm";
const errorCls = "text-red-500 dark:text-red-400 text-xs mt-1.5";
const primaryBtnCls =
  "inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-violet-600";
const secondaryBtnCls =
  "inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
const chipCls =
  "inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20";

const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white transition-colors duration-300">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const PostJob = () => {
  const [step, setStep] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const plan = company?.plan || "FREE";
  const limits = { FREE: 1, STANDARD: 5, PREMIUM: 10, PRO: 25, ENTERPRISE: Infinity };
  const referralBonus = user?.remainingJobPosts ?? 0;

  const jobsPosted = useMemo(() => plan === "FREE"
    ? (company?.freeJobsPosted || 0)
    : ((company?.planJobsPostedThisMonth || 0) + (company?.paidPlanFreeJobsPosted || 0)),
    [plan, company?.freeJobsPosted, company?.planJobsPostedThisMonth, company?.paidPlanFreeJobsPosted]
  );

  const remainingPosts = useMemo(() => {
    if (company?.maxJobPosts !== null && company?.maxJobPosts !== undefined) {
      const used = plan === "FREE" ? (company?.freeJobsPosted || 0) : (company?.planJobsPostedThisMonth || 0);
      return Math.max(0, company.maxJobPosts - used) + referralBonus;
    }
    if (plan === "FREE") return Math.max(0, (limits[plan] ?? 1) - (company?.freeJobsPosted || 0)) + referralBonus;
    const paidLimit = limits[plan] ?? 0;
    if (paidLimit === Infinity) return Infinity;
    return Math.max(0, paidLimit - (company?.planJobsPostedThisMonth || 0)) + referralBonus;
  }, [company, plan, referralBonus]);

  const remainingPostsLabel = useMemo(() => {
    if (remainingPosts === Infinity || remainingPosts >= 999999 || plan === "ENTERPRISE") return "Unlimited";
    return `${remainingPosts} Job${remainingPosts !== 1 ? "s" : ""}`;
  }, [remainingPosts]);

  const handleChange = (e) => {
    const lines = e.target.value.split("\n");

    // Ensure each new line starts with a single bullet point, avoiding duplicate bullets
    //    formattedText = lines.map(line => {
    //     return line.startsWith("• ") ? line : `• ${line.trim()}`;
    //   }).join("\n");
    // const
    //   formik.setFieldValue("details", formattedText);
  };


  const editorRef = useRef(null);

  // Formatting modes (controlled by React, NOT browser)
  const [boldMode, setBoldMode] = useState(false);
  const [italicMode, setItalicMode] = useState(false);


  const isInsideList = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    let node = selection.anchorNode;

    while (node) {
      if (node.nodeName === "LI") return true;
      node = node.parentElement;
    }

    return false;
  };


  const applyListPadding = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let node = selection.anchorNode;
    while (node && node.nodeName !== "UL" && node.nodeName !== "OL") {
      node = node.parentElement;
    }

    if (node) {
      node.style.paddingLeft = "1.5rem";
    }
  };



  // Keep formatting active while typing
  const handleKeyDown = (e) => {
    // Handle Tab for nested lists
    if (e.key === 'Tab') {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let listItem = range.startContainer;

        // Find the closest li element
        while (listItem && listItem.nodeName !== 'LI') {
          listItem = listItem.parentNode;
        }

        if (listItem) {
          if (e.shiftKey) {
            // Shift+Tab: Outdent
            document.execCommand('outdent');
          } else {
            // Tab: Indent
            document.execCommand('indent');
          }
        }
      }
      return;
    }

    // 🚫 Do NOT interfere when inside a list
    if (isInsideList()) return;

    editorRef.current.focus();

    if (boldMode && !document.queryCommandState("bold")) {
      document.execCommand("bold");
    }

    if (italicMode && !document.queryCommandState("italic")) {
      document.execCommand("italic");
    }
  };


  // Toolbar actions
  const toggleBold = () => {
    editorRef.current.focus();
    document.execCommand("bold");
    setBoldMode((prev) => !prev);
  };

  const toggleItalic = () => {
    editorRef.current.focus();
    document.execCommand("italic");
    setItalicMode((prev) => !prev);
  };

  // Lists
  const bulletList = () => {
    editorRef.current.focus();
    document.execCommand("insertUnorderedList");
    applyListPadding();
  };

  const numberList = () => {
    editorRef.current.focus();
    document.execCommand("insertOrderedList");
    applyListPadding();
  };


  const alphaList = () => {
    editorRef.current.focus();
    document.execCommand("insertOrderedList");

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let node = selection.anchorNode;
    while (node && node.nodeName !== "OL") {
      node = node.parentElement;
    }

    if (node) {
      node.style.listStyleType = "lower-alpha";
      node.style.paddingLeft = "1.5rem"; // 👈 alignment fix
    }
  };



  // Load value (edit / update mode)
  useEffect(() => {
    if (editorRef.current && formik.values.details) {
      editorRef.current.innerHTML = formik.values.details;
    }
  }, []);






  const handleGenerateJD = async (overrideData) => {
    const data = overrideData || aiForm;
    if (!data.title) { toast.error("Job title is required to generate JD"); return; }
    setAiGenerating(true);
    try {
      const res = await axios.post(`${JOB_API_END_POINT}/generate-jd`, data, { withCredentials: true });
      if (res.data.success) {
        const html = res.data.html;
        formik.setFieldValue("details", html);
        if (editorRef.current) editorRef.current.innerHTML = html;
        toast.success("Job description generated!");
      }
    } catch (e) {
      const msg = e.response?.data?.message || "Failed to generate JD. Please try again.";
      toast.error(msg);
      console.error("JD generation error:", e.response?.data || e.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: company?.companyName || "",
      urgentHiring: "",
      title: "",
      details: "",

      skills: [],
      languages: [],
      benefits: [],
      qualifications: [],
      responsibilities: [],

      experience: "",
      salary: "",
      jobType: "",
      workPlaceFlexibility: "",
      location: "",

      numberOfOpening: "",
      respondTime: "",
      duration: "",
      shift: "",
      noticePeriod: "",
      questions: [],
      anyAmount: "No",
    },
    validationSchema: Yup.object({
      urgentHiring: Yup.string(),
      title: Yup.string().required("Job title is required"),
      details: Yup.string().required("Job details are required"),
      salary: Yup.string().required("Salary is required"),
      experience: Yup.string().required("Experience is required"),
      jobType: Yup.string().required("Job type is required"),
      workPlaceFlexibility: Yup.string().required("Work Place Flexibility is required"),
      location: Yup.string().required("Location is required"),
      companyName: Yup.string().required("Company name is required"),
      numberOfOpening: Yup.string().required("Number of openings is required"),
      respondTime: Yup.string().required("Response time is required"),
      duration: Yup.string().required("Duration is required"),
      shift: Yup.string().required("Shift is required"),
      skills: Yup.string().required("Skills are required"),
      benefits: Yup.string().required("Benefits are required"),
      qualifications: Yup.string().required("Qualification is required"),
      // responsibilities: Yup.string().required("Responsibility is required"),
      anyAmount: Yup.string().required("Yes or no is required"),
    }),

    onSubmit: async (values) => {
      // Block 2nd+ job for ALL plans until admin verifies
      const jobsPostedSoFar = jobsPosted;
      if (!company.isActive && jobsPostedSoFar >= 1 && remainingPosts <= 0) {
        toast.error("Your first job is under admin review. You cannot post additional jobs until your account is verified.");
        return;
      }
      if (company.isActive && remainingPosts <= 0) {
        toast.error("You have no remaining job posts. Please upgrade your plan.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          `${JOB_API_END_POINT}/post-job`,
          {
            ...values,
            companyId: company?._id,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          if (company?.maxJobPosts !== null) {
            dispatch(decreaseMaxPostJobs(1));
          }
          const msg = response.data.jobStatus === "pending"
            ? "Job submitted! It will be published after admin verification."
            : "Job posted successfully!";
          toast.success(msg);
          setTimeout(() => { navigate("/recruiter/dashboard/home"); }, 1000);
        } else {
          toast.error("Job post failed");
        }
      } catch (error) {
        console.error("Error posting job:", error);
        if (error.response?.data?.redirectTo) {
          toast.error(error.response.data.message);
          setTimeout(() => {
            navigate(error.response.data.redirectTo);
          }, 1500);
        } else {
          toast.error("Job post failed");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNext = async () => {
    const currentStepFields = [
      ["companyName", "title"], // Step 0
      ["skills", "benefits", "qualifications"], // Step 1
      ["experience", "salary", "jobType", "workPlaceFlexibility", "location"], // Step 2
      ["numberOfOpening", "respondTime", "duration", "shift", "anyAmount"], // Step 3
    ][step];
    // Mark the current step fields as touched to trigger validation messages
    const touchedFields = {};
    currentStepFields.forEach((field) => {
      touchedFields[field] = true;
    });
    formik.setTouched(touchedFields);
    // Trigger validation and ensure required fields show error messages
    await formik.validateForm();
    // Debug: log values and errors to help trace why Next may be blocked
    try {
      // eslint-disable-next-line no-console
      // Debug logging removed per revert request
    } catch (e) { }
    // Check if there are any errors or blank fields in the current step's fields
    const hasErrors = currentStepFields.some(
      (field) => !!formik.errors[field] || !formik.values[field]
    );

    if (hasErrors) {
      return;
    }
    // Move to the next step if all fields are valid
    const nextStep = Math.min(step + 1, steps.length - 1);
    setStep(nextStep);
  };

  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 0));

  const filteredLocations = useMemo(
    () => filterLocations(locationSearch),
    [locationSearch]
  );

  const steps = [
    { title: "Basic Info" },
    { title: "Job Details" },
    { title: "Requirements" },
    { title: "Additional Info" },
    { title: "Review & Submit" },
  ];

  const percentComplete = Math.round(((step + 1) / steps.length) * 100);

  const skillsPreview = useMemo(
    () => String(formik.values.skills || "").split(",").map(s => s.trim()).filter(Boolean),
    [formik.values.skills]
  );

  /* ------------------------------ icons ------------------------------ */
  const IconBriefcase = (
    <svg className="w-4.5 h-4.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>
  );
  const IconSparkle = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.6 4.6L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.4L12 3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></svg>
  );
  const IconTools = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 015 5l-6.6 6.6a2 2 0 01-2.8 0l-2.2-2.2a2 2 0 010-2.8l6.6-6.6z" /><path d="M6 21l3-3" /></svg>
  );
  const IconGraduate = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg>
  );
  const IconMoney = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.5 15a2 2 0 002.2 1.7h.6a2 2 0 000-4h-.6a2 2 0 010-4h.6A2 2 0 0114.5 10" /><path d="M12 6.5v1M12 16.5v1" /></svg>
  );
  const IconPin = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" /><circle cx="12" cy="10" r="3" /></svg>
  );
  const IconUsers = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.9" /><path d="M16 3.1a4 4 0 010 7.8" /></svg>
  );
  const IconSettings = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
  );
  const IconDoc = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>
  );
  const IconEye = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  );
  const IconArrowLeft = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
  );
  const IconArrowRight = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
  );
  const IconRocket = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
  );

  /* ---------------------- live preview side card --------------------- */
  const LivePreview = () => (
    <div className={`${cardCls} lg:sticky lg:top-24`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-indigo-500 dark:text-indigo-400">{IconEye}</span>
        <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Live Preview</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {(formik.values.companyName || "GH").slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {formik.values.title || "Job Title"}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {formik.values.companyName || "Your Company"}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
        {formik.values.location && (
          <div className="flex items-center gap-1.5"><span className="text-slate-400 dark:text-slate-500">{IconPin}</span>{formik.values.location}</div>
        )}
        {formik.values.salary && (
          <div className="flex items-center gap-1.5"><span className="text-slate-400 dark:text-slate-500">{IconMoney}</span>₹{formik.values.salary} {formik.values.salaryType || ""}</div>
        )}
        {(formik.values.jobType || formik.values.workPlaceFlexibility) && (
          <div className="flex items-center gap-1.5"><span className="text-slate-400 dark:text-slate-500">{IconBriefcase}</span>
            {[formik.values.jobType, formik.values.workPlaceFlexibility].filter(Boolean).join(" • ")}
          </div>
        )}
      </div>

      {skillsPreview.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skillsPreview.slice(0, 6).map((s, i) => (
            <span key={i} className={chipCls}>{s}</span>
          ))}
        </div>
      )}

      {formik.values.urgentHiring === "Yes" && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-100 dark:border-orange-500/20">
            Urgent Hiring
          </span>
        </div>
      )}

      <button
        type="button"
        disabled
        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed"
      >
        Apply Now (Preview)
      </button>
    </div>
  );

  /* ------------------------- step indicator --------------------------- */
  const StepIndicator = () => (
    <div className="flex items-center justify-between md:justify-center gap-1 md:gap-3">
      {steps.map((s, i) => (
        <React.Fragment key={s.title}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold border-2 transition-all duration-300 ${
                i < step
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : i === step
                  ? "bg-gradient-to-br from-indigo-600 to-violet-600 border-transparent text-white shadow-md shadow-indigo-500/30"
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"
              }`}
            >
              {i < step ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`hidden md:block text-[11px] font-medium ${i === step ? "text-indigo-600 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500"}`}>
              {s.title}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 rounded-full mb-4 md:mb-5 min-w-[10px] md:min-w-[24px] transition-colors duration-300 ${i < step ? "bg-indigo-500" : "bg-slate-200 dark:bg-white/10"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          Post a Job & Hire Faster | Recruit Top Talent with GreatHire
        </title>

        <meta
          name="description"
          content="Post jobs effortlessly on GreatHire and reach qualified candidates faster with our powerful recruitment tools. Designed for modern hiring teams operating from Hyderabad State, one of India's fastest-growing employment and technology hubs, this platform streamlines job posting end to end. Add job details, skills, salary, benefits, and location with ease while ensuring compliance and transparency. Whether you're hiring urgently or planning long-term growth, GreatHire helps companies attract the right talent, reduce hiring time, and scale recruitment with confidence and speed."
        />
      </Helmet>

      {company ? (
        <div className="min-h-screen px-3 sm:px-4 py-6 pt-20 bg-slate-50 dark:bg-[#0a0e1a] transition-colors duration-300">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {company.plan || "FREE"} Plan
                  <span className="opacity-50">•</span>
                  {remainingPostsLabel} Remaining
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                  Post a New Opportunity
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {steps[step].title} &middot; {percentComplete}% complete
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <StepIndicator />
              </div>
            </div>

            {/* Verification Status Banner */}
            {!company?.isActive && jobsPosted >= 1 && (
              <div className={`${cardCls} mb-5 !p-4 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.06]`}>
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <span className="font-semibold">Pending verification.</span> Your first job is under admin review. You can't post additional jobs until your account is verified.
                  </p>
                </div>
              </div>
            )}

            {/* Verified banner */}
            {company?.isActive && (() => {
              if (plan === "FREE") return company.freeJobsPosted === 1;
              return ((company?.planJobsPostedThisMonth || 0) + (company?.paidPlanFreeJobsPosted || 0)) === 1;
            })() && (
              <div className={`${cardCls} mb-5 !p-4 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.06]`}>
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    <span className="font-semibold">Verified!</span> You can now post more jobs according to your plan.
                  </p>
                </div>
              </div>
            )}

            <div className={`${cardCls} !p-5 md:!p-6 mb-5 bg-gradient-to-r from-indigo-600 to-violet-600 !border-0 text-white`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs font-medium text-indigo-100">Remaining Job Posts</p>
                  <p className="text-2xl font-bold">{remainingPostsLabel}</p>
                </div>
                <span className="text-xs font-semibold bg-white/15 px-3 py-1 rounded-full">{company.plan || "FREE"} Plan</span>
              </div>
            </div>

            {/* Locked state */}
            {!company?.isActive && jobsPosted >= 1 ? (
              <div className={`${cardCls} text-center py-14`}>
                <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">Job Posting Locked</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Your first job is under admin review. You can't post additional jobs until your account is verified.
                </p>
                <div className="mt-6">
                  <Link to="/recruiter/dashboard/home" className={primaryBtnCls}>
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit}>
                <div className={`grid grid-cols-1 ${step !== 4 ? "lg:grid-cols-[1fr_340px]" : ""} gap-5`}>

                  {/* ------------------------------- STEP 0 ------------------------------- */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div className={cardCls}>
                        <SectionHeader icon={IconBriefcase} title="Company Info" subtitle="Tell candidates who's hiring" />

                        <div className="mb-5">
                          <Label className={labelCls}>
                            Company Name<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <input
                            name="companyName"
                            type="text"
                            placeholder="Enter company name"
                            className={inputCls}
                            onChange={formik.handleChange}
                            value={formik.values.companyName}
                          />
                          {formik.touched.companyName && formik.errors.companyName && (
                            <div className={errorCls}>{formik.errors.companyName}</div>
                          )}
                        </div>

                        <div className="mb-5">
                          <Label className={labelCls}>
                            Urgent Hiring<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <select
                            name="urgentHiring"
                            className={inputCls}
                            onChange={formik.handleChange}
                            value={formik.values.urgentHiring}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                          {formik.touched.urgentHiring && formik.errors.urgentHiring && (
                            <div className={errorCls}>{formik.errors.urgentHiring}</div>
                          )}
                        </div>

                        <div>
                          <Label className={labelCls}>
                            Job Title<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <div className="relative">
                            <input
                              name="title"
                              type="text"
                              placeholder="Search or enter job title"
                              className={inputCls}
                              onChange={formik.handleChange}
                              value={formik.values.title}
                              onFocus={(e) => e.target.nextSibling.classList.remove("hidden")}
                              onBlur={(e) => setTimeout(() => e.target.nextSibling.classList.add("hidden"), 200)}
                              autoComplete="off"
                            />
                            <div className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto hidden">
                              {jobTitles
                                .filter(t => t.toLowerCase().includes((formik.values.title || "").toLowerCase()))
                                .map(title => (
                                  <div
                                    key={title}
                                    className="px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-white/5 cursor-pointer text-slate-900 dark:text-slate-100 text-sm"
                                    onMouseDown={() => formik.setFieldValue("title", title)}
                                  >
                                    {title}
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                          {formik.touched.title && formik.errors.title && (
                            <div className={errorCls}>{formik.errors.title}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          disabled={step === 0}
                          className={secondaryBtnCls}
                        >
                          {IconArrowLeft} Previous
                        </button>
                        <button type="button" onClick={handleNext} className={primaryBtnCls}>
                          Next {IconArrowRight}
                        </button>
                      </div>

                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        Have feedback?{" "}
                        <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                          Tell us more
                        </Link>
                      </p>
                    </div>
                  )}

                  {/* ------------------------------- STEP 1 ------------------------------- */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className={cardCls}>
                        <SectionHeader icon={IconTools} title="Required Skills" subtitle="What abilities will this role need" />
                        <textarea
                          id="skills"
                          name="skills"
                          placeholder="Enter skills separated by commas (e.g., HTML, CSS, JavaScript)"
                          className={`${inputCls} min-h-[90px]`}
                          onChange={formik.handleChange}
                          value={formik.values.skills}
                        />
                        {formik.touched.skills && formik.errors.skills && (
                          <div className={errorCls}>{formik.errors.skills}</div>
                        )}
                      </div>

                      <div className={cardCls}>
                        <SectionHeader icon={IconUsers} title="Languages" subtitle="Optional — languages candidates should speak" />
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Search language"
                              className={inputCls}
                              value={langSearch}
                              onChange={(e) => setLangSearch(e.target.value)}
                              onFocus={(e) => e.target.nextSibling.classList.remove("hidden")}
                              onBlur={(e) => setTimeout(() => e.target.nextSibling.classList.add("hidden"), 200)}
                              autoComplete="off"
                            />
                            <div className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto hidden">
                              {[
                                "English", "Hindi", "Telugu", "Tamil", "Kannada",
                                "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi",
                                "Urdu", "Odia", "Arabic", "French", "German",
                              ]
                                .filter(l => l.toLowerCase().includes(langSearch.toLowerCase()) && !formik.values.languages.includes(l))
                                .map(lang => (
                                  <div
                                    key={lang}
                                    className="px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-white/5 cursor-pointer text-slate-900 dark:text-slate-100 text-sm"
                                    onMouseDown={() => {
                                      formik.setFieldValue("languages", [...formik.values.languages, lang]);
                                      setLangSearch("");
                                    }}
                                  >
                                    {lang}
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 flex-1 items-center">
                            {formik.values.languages.map(lang => (
                              <span key={lang} className={chipCls}>
                                {lang}
                                <button
                                  type="button"
                                  className="text-indigo-400 hover:text-red-500 font-bold leading-none ml-0.5"
                                  onClick={() => formik.setFieldValue("languages", formik.values.languages.filter(l => l !== lang))}
                                >×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className={cardCls}>
                        <SectionHeader icon={IconSparkle} title="Benefits" subtitle="Perks that come with this role" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                          {[
                            "Health Insurance",
                            "Provident Fund",
                            "Cell Phone Reimbursement",
                            "Paid Sick Time",
                            "Work From Home",
                            "Paid time Off",
                            "Food Provided",
                            "Life Insurance",
                            "Internet Reimbursement",
                            "Travelling Allowance",
                            "Leave Encashment",
                            "Flexible Schedule",
                            "Others",
                          ].map((benefit) => {
                            const selectedBenefits = String(formik.values.benefits || "").split("\n");
                            const checked = selectedBenefits.includes(benefit);
                            return (
                              <label
                                key={benefit}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer text-sm transition-colors duration-200 ${
                                  checked
                                    ? "border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  name="benefitsCheckbox"
                                  value={benefit}
                                  className="w-4 h-4 accent-indigo-600"
                                  checked={checked}
                                  onChange={(e) => {
                                    let updatedBenefits = [...selectedBenefits].filter(Boolean);
                                    if (e.target.checked) {
                                      updatedBenefits.push(benefit);
                                    } else {
                                      updatedBenefits = updatedBenefits.filter((b) => b !== benefit);
                                    }
                                    formik.setFieldValue("benefits", updatedBenefits.join("\n"));
                                  }}
                                />
                                <span>{benefit}</span>
                              </label>
                            );
                          })}
                        </div>

                        {String(formik.values.benefits || "").split("\n").includes("Others") && (
                          <textarea
                            id="benefits"
                            name="benefits"
                            placeholder="Enter additional benefits..."
                            className={`${inputCls} h-24`}
                            onChange={formik.handleChange}
                            value={String(formik.values.benefits || "")}
                          />
                        )}
                        {formik.touched.benefits && formik.errors.benefits && (
                          <div className={errorCls}>{formik.errors.benefits}</div>
                        )}
                      </div>

                      <div className={cardCls}>
                        <SectionHeader icon={IconGraduate} title="Qualifications" subtitle="Minimum education requirements" />
                        <textarea
                          id="qualifications"
                          name="qualifications"
                          placeholder="Enter qualifications separated by new lines (eg. Bachelor, Master or diploma)"
                          className={`${inputCls} min-h-[80px]`}
                          onChange={formik.handleChange}
                          value={formik.values.qualifications}
                        />
                        {formik.touched.qualifications && formik.errors.qualifications && (
                          <div className={errorCls}>{formik.errors.qualifications}</div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <button type="button" onClick={handlePrevious} className={secondaryBtnCls}>
                          {IconArrowLeft} Previous
                        </button>
                        <button type="button" onClick={handleNext} className={primaryBtnCls}>
                          Next {IconArrowRight}
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        Have feedback?{" "}
                        <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                          Tell us more
                        </Link>
                      </p>
                    </div>
                  )}

                  {/* ------------------------------- STEP 2 ------------------------------- */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className={cardCls}>
                        <SectionHeader icon={IconBriefcase} title="Employment Details" subtitle="Experience, salary and job type" />

                        <div className="mb-5">
                          <Label className={labelCls}>
                            Experience<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <label className="flex items-center gap-2 mb-3 text-sm text-slate-600 dark:text-slate-300">
                            <input
                              type="checkbox"
                              checked={String(formik.values.experience || "").includes("Fresher")}
                              onChange={(e) => {
                                const current = String(formik.values.experience || "");
                                if (e.target.checked) {
                                  formik.setFieldValue("experience", "Fresher, From 0 To 0");
                                } else {
                                  formik.setFieldValue("experience", current.replace("Fresher", "").replace(/^,\s*|,\s*$/g, "").trim());
                                }
                              }}
                              className="w-4 h-4 accent-indigo-600"
                            />
                            <span>Fresher</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">From (years)</label>
                              <select
                                className={inputCls}
                                value={(() => { const m = String(formik.values.experience || "").match(/From (\d+)/); return m ? m[1] : ""; })()}
                                onChange={(e) => {
                                  const current = String(formik.values.experience || "");
                                  const toMatch = current.match(/To (\d+)/);
                                  const toVal = toMatch ? ` To ${toMatch[1]}` : "";
                                  const isFresher = current.includes("Fresher") ? "Fresher, " : "";
                                  formik.setFieldValue("experience", e.target.value ? `${isFresher}From ${e.target.value}${toVal}` : `${isFresher}${toVal}`.trim());
                                }}
                              >
                                <option value="">Select</option>
                                {Array.from({ length: 11 }, (_, i) => i).map(n => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">To (years)</label>
                              <select
                                className={inputCls}
                                value={(() => { const m = String(formik.values.experience || "").match(/To (\d+)/); return m ? m[1] : ""; })()}
                                onChange={(e) => {
                                  const current = String(formik.values.experience || "");
                                  const fromMatch = current.match(/From (\d+)/);
                                  const fromVal = fromMatch ? `From ${fromMatch[1]} ` : "";
                                  const isFresher = current.includes("Fresher") ? "Fresher, " : "";
                                  formik.setFieldValue("experience", e.target.value ? `${isFresher}${fromVal}To ${e.target.value}` : `${isFresher}${fromVal}`.trim());
                                }}
                              >
                                <option value="">Select</option>
                                {Array.from({ length: 11 }, (_, i) => i).map(n => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {formik.touched.experience && formik.errors.experience && (
                            <div className={errorCls}>{formik.errors.experience}</div>
                          )}
                        </div>

                        <div className="mb-5">
                          <Label className={labelCls}>
                            Salary<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <div className="flex flex-col sm:flex-row gap-2.5">
                            <input
                              id="salary"
                              name="salary"
                              type="text"
                              placeholder="Enter salary (e.g., 45000-50000)"
                              className={inputCls}
                              onChange={formik.handleChange}
                              value={formik.values.salary}
                            />
                            <select
                              id="salaryType"
                              name="salaryType"
                              className={`${inputCls} sm:w-40`}
                              onChange={formik.handleChange}
                              value={formik.values.salaryType || "per year"}
                            >
                              <option value="per year">per year</option>
                              <option value="per month">per month</option>
                              <option value="per week">per week</option>
                              <option value="per day">per day</option>
                              <option value="per hour">per hour</option>
                              <option value="Unpaid">Unpaid</option>
                            </select>
                          </div>
                          {formik.touched.salary && formik.errors.salary && (
                            <div className={errorCls}>{formik.errors.salary}</div>
                          )}
                        </div>

                        <div className="mb-5">
                          <Label className={labelCls}>
                            Job Type<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <select
                            id="jobType"
                            name="jobType"
                            className={inputCls}
                            onChange={formik.handleChange}
                            value={formik.values.jobType}
                          >
                            <option value="">Select a job type</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Contract/Temporary">Contract/Temporary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Internship">Internship</option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Fresher">Fresher</option>
                          </select>
                          {formik.touched.jobType && formik.errors.jobType && (
                            <div className={errorCls}>{formik.errors.jobType}</div>
                          )}
                        </div>

                        <div>
                          <Label className={labelCls}>
                            Work Place Flexibility<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {["Remote", "Hybrid", "On-site"].map((mode) => (
                              <button
                                type="button"
                                key={mode}
                                onClick={() => formik.setFieldValue("workPlaceFlexibility", mode)}
                                className={`py-2.5 rounded-xl border text-sm font-medium transition-colors duration-200 ${
                                  formik.values.workPlaceFlexibility === mode
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                          {formik.touched.workPlaceFlexibility && formik.errors.workPlaceFlexibility && (
                            <div className={errorCls}>{formik.errors.workPlaceFlexibility}</div>
                          )}
                        </div>
                      </div>

                      <div className={cardCls}>
                        <SectionHeader icon={IconPin} title="Work Location" />
                        <div className="relative">
                          <input
                            type="text"
                            id="location"
                            name="location"
                            className={inputCls}
                            placeholder="Enter location manually or select from dropdown"
                            value={locationSearch || formik.values.location}
                            onChange={(e) => {
                              setLocationSearch(e.target.value);
                              formik.setFieldValue("location", e.target.value);
                            }}
                            onFocus={() => {
                              setLocationSearch(formik.values.location);
                              setShowLocationDropdown(true);
                            }}
                            onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                            autoComplete="off"
                          />
                          {showLocationDropdown && filteredLocations.length > 0 && (
                            <div className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto">
                              {filteredLocations.map((loc) => (
                                <div
                                  key={loc}
                                  className="px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-white/5 cursor-pointer text-slate-900 dark:text-slate-100 text-sm"
                                  onMouseDown={() => {
                                    formik.setFieldValue("location", loc);
                                    setLocationSearch(loc);
                                    setShowLocationDropdown(false);
                                  }}
                                >
                                  {loc}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {formik.touched.location && formik.errors.location && (
                          <div className={errorCls}>{formik.errors.location}</div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <button type="button" onClick={handlePrevious} className={secondaryBtnCls}>
                          {IconArrowLeft} Previous
                        </button>
                        <button type="button" onClick={handleNext} className={primaryBtnCls}>
                          Next {IconArrowRight}
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        Have feedback?{" "}
                        <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                          Tell us more
                        </Link>
                      </p>
                    </div>
                  )}

                  {/* ------------------------------- STEP 3 ------------------------------- */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className={cardCls}>
                        <SectionHeader icon={IconSettings} title="Hiring Details" subtitle="Openings, timelines and schedule" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                          <div>
                            <Label className={labelCls}>
                              Number of Openings<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                            </Label>
                            <input
                              name="numberOfOpening"
                              type="number"
                              placeholder="e.g. 1, 2"
                              className={inputCls}
                              onChange={formik.handleChange}
                              value={formik.values.numberOfOpening}
                            />
                            {formik.touched.numberOfOpening && formik.errors.numberOfOpening && (
                              <div className={errorCls}>{formik.errors.numberOfOpening}</div>
                            )}
                          </div>

                          <div>
                            <Label className={labelCls}>
                              Response Time (Days)<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                            </Label>
                            <input
                              name="respondTime"
                              type="number"
                              placeholder="e.g. 1, 2"
                              className={inputCls}
                              onChange={formik.handleChange}
                              value={formik.values.respondTime}
                            />
                            {formik.touched.respondTime && formik.errors.respondTime && (
                              <div className={errorCls}>{formik.errors.respondTime}</div>
                            )}
                          </div>
                        </div>

                        <div className="mb-5">
                          <Label className={labelCls}>
                            Working Days<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <select
                            className={inputCls}
                            onChange={(e) => {
                              if (e.target.value === "Other") formik.setFieldValue("duration", "Other");
                              else formik.setFieldValue("duration", e.target.value);
                            }}
                            value={["5 Days A Week", "6 Days A Week"].includes(formik.values.duration) ? formik.values.duration : formik.values.duration ? "Other" : ""}
                          >
                            <option value="">Select duration</option>
                            <option value="5 Days A Week">5 Days A Week</option>
                            <option value="6 Days A Week">6 Days A Week</option>
                            <option value="Other">Other</option>
                          </select>
                          {!(["5 Days A Week", "6 Days A Week", ""].includes(formik.values.duration)) && (
                            <input
                              name="duration"
                              type="text"
                              placeholder="Enter custom duration"
                              className={`${inputCls} mt-2`}
                              onChange={formik.handleChange}
                              value={formik.values.duration === "Other" ? "" : formik.values.duration}
                            />
                          )}
                          {formik.touched.duration && formik.errors.duration && (
                            <div className={errorCls}>{formik.errors.duration}</div>
                          )}
                        </div>

                        <div>
                          <Label className={labelCls}>
                            Shift<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                          </Label>
                          <div className="flex flex-col sm:flex-row gap-2.5">
                            <select
                              name="shift"
                              className={inputCls}
                              onChange={(e) => formik.setFieldValue("shift", e.target.value)}
                              value={formik.values.shift}
                            >
                              <option value="">Select shift</option>
                              <option value="Day shift">Day shift</option>
                              <option value="Night shift">Night shift</option>
                              <option value="Rotational shift">Rotational shift</option>
                            </select>
                            <input
                              name="shiftCustom"
                              type="text"
                              placeholder="Or enter custom shift"
                              className={inputCls}
                              onChange={(e) => formik.setFieldValue("shift", e.target.value)}
                              value={formik.values.shift && !["Day shift", "Night shift", "Rotational shift"].includes(formik.values.shift) ? formik.values.shift : ""}
                            />
                          </div>
                          {formik.touched.shift && formik.errors.shift && (
                            <div className={errorCls}>{formik.errors.shift}</div>
                          )}
                        </div>
                      </div>

                      <div className={cardCls}>
                        <SectionHeader icon={IconDoc} title="Custom Questions" subtitle="Optional — screening questions for applicants" />
                        {formik.values.questions.map((q, idx) => (
                          <div key={idx} className="flex gap-2 mb-2.5">
                            <input
                              type="text"
                              placeholder={`Question ${idx + 1}`}
                              className={inputCls}
                              value={q}
                              onChange={(e) => {
                                const updated = [...formik.values.questions];
                                updated[idx] = e.target.value;
                                formik.setFieldValue("questions", updated);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formik.values.questions.filter((_, i) => i !== idx);
                                formik.setFieldValue("questions", updated);
                              }}
                              className="flex-shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue("questions", [...formik.values.questions, ""])}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium mt-1"
                        >
                          + Add Question
                        </button>
                      </div>

                      <div className={cardCls}>
                        <SectionHeader icon={IconMoney} title="Applicant Charges" />
                        <select
                          name="anyAmount"
                          className={inputCls}
                          onChange={formik.handleChange}
                          value={formik.values.anyAmount}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        {formik.touched.activeColor && formik.errors.anyAmount && (
                          <div className={errorCls}>{formik.errors.anyAmount}</div>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                          <strong>Note:</strong> GreatHire does not support taking any amount from applicants.
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <button type="button" onClick={handlePrevious} className={secondaryBtnCls}>
                          {IconArrowLeft} Previous
                        </button>
                        <button type="button" onClick={handleNext} className={primaryBtnCls}>
                          Next {IconArrowRight}
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        Have feedback?{" "}
                        <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                          Tell us more
                        </Link>
                      </p>
                    </div>
                  )}

                  {step !== 4 && <LivePreview />}

                  {/* ------------------------------- STEP 4 ------------------------------- */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <div className={cardCls}>
                        <div className="flex items-center justify-between mb-4">
                          <SectionHeader icon={IconDoc} title="Job Description" subtitle="Describe the role, team and impact" />
                          <button
                            type="button"
                            disabled={aiGenerating}
                            onClick={() => {
                              handleGenerateJD({
                                title: formik.values.title,
                                skills: formik.values.skills,
                                experience: formik.values.experience,
                                jobType: formik.values.jobType,
                                location: formik.values.location,
                                workPlaceFlexibility: formik.values.workPlaceFlexibility,
                              });
                            }}
                            className="flex-shrink-0 flex items-center gap-1.5 text-xs bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3.5 py-1.5 rounded-full hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity font-medium -mt-8"
                          >
                            {IconSparkle} {aiGenerating ? "Generating..." : "Generate with AI"}
                          </button>
                        </div>

                        <div className="flex items-center gap-1 border border-slate-200 dark:border-white/10 rounded-t-xl px-2 py-1.5 bg-slate-50 dark:bg-white/[0.04] transition-colors duration-300">
                          <button type="button" onClick={toggleBold} className={`w-8 h-8 rounded-lg font-bold text-sm transition-colors duration-200 ${boldMode ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"}`}>B</button>
                          <button type="button" onClick={toggleItalic} className={`w-8 h-8 rounded-lg italic text-sm transition-colors duration-200 ${italicMode ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"}`}><i>i</i></button>
                          <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />
                          <button type="button" onClick={bulletList} className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors duration-200" title="Bullet List">●</button>
                          <button type="button" onClick={numberList} className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs transition-colors duration-200" title="Numbered List">123</button>
                        </div>
                        <div
                          ref={editorRef}
                          contentEditable
                          className="w-full min-h-[150px] p-3.5 border border-t-0 border-slate-200 dark:border-white/10 rounded-b-xl focus:outline-none bg-white dark:bg-white/[0.03] text-slate-900 dark:text-slate-100 text-sm [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square] [&_ol_ol]:list-[lower-alpha] [&_ol_ol_ol]:list-[lower-roman] transition-colors duration-300"
                          onKeyDown={handleKeyDown}
                          onInput={(e) => formik.setFieldValue("details", e.currentTarget.innerHTML)}
                        />
                        {formik.touched.details && formik.errors.details && (
                          <div className={errorCls}>{formik.errors.details}</div>
                        )}
                      </div>

                      <div className={cardCls}>
                        <SectionHeader icon={IconEye} title="Review & Submit" subtitle="Double-check everything before publishing" />

                        <dl className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                          {[
                            ["Company Name", formik.values.companyName || "N/A"],
                            ["Urgent Hiring", formik.values.urgentHiring || "N/A"],
                            ["Job Title", formik.values.title || "N/A"],
                          ].map(([k, v]) => (
                            <div key={k} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5">
                              <dt className="w-full sm:w-48 flex-shrink-0 font-medium text-slate-500 dark:text-slate-400">{k}</dt>
                              <dd className="text-slate-900 dark:text-slate-100">{v}</dd>
                            </div>
                          ))}

                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5">
                            <dt className="w-full sm:w-48 flex-shrink-0 font-medium text-slate-500 dark:text-slate-400">Job Details</dt>
                            <dd
                              className="text-slate-900 dark:text-slate-100 text-sm [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1"
                              dangerouslySetInnerHTML={{
                                __html: formik.values.details
                                  ? DOMPurify.sanitize(formik.values.details)
                                  : "<p>N/A</p>",
                              }}
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5">
                            <dt className="w-full sm:w-48 flex-shrink-0 font-medium text-slate-500 dark:text-slate-400">Skills</dt>
                            <dd className="flex flex-wrap gap-1.5">
                              {formik.values.skills.length > 0
                                ? formik.values.skills.split(",").map((skill, index) => (
                                  <span key={index} className={chipCls}>{skill.trim()}</span>
                                ))
                                : "N/A"}
                            </dd>
                          </div>

                          {[
                            ["Experience", formik.values.experience || "N/A"],
                            ["Benefits", formik.values.benefits ? formik.values.benefits.split("\n").join(", ") : "N/A"],
                            ["Qualification", formik.values.qualifications || "N/A"],
                            ["Salary", formik.values.salary ? `₹${formik.values.salary} ${formik.values.salaryType || ""}`.trim() : "N/A"],
                            ["Job Type", formik.values.jobType || "N/A"],
                            ["Work Place Flexibility", formik.values.workPlaceFlexibility || "N/A"],
                            ["Location", formik.values.location || "N/A"],
                            ["Number of Openings", formik.values.numberOfOpening || "N/A"],
                            ["Response Time", formik.values.respondTime ? `${formik.values.respondTime} days` : "N/A"],
                            ["Duration", formik.values.duration || "N/A"],
                            ["Shift", formik.values.shift || "N/A"],
                            ["Applicant Charges", formik.values.anyAmount || "N/A"],
                          ].map(([k, v]) => (
                            <div key={k} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5">
                              <dt className="w-full sm:w-48 flex-shrink-0 font-medium text-slate-500 dark:text-slate-400">{k}</dt>
                              <dd className="text-slate-900 dark:text-slate-100">{v}</dd>
                            </div>
                          ))}
                        </dl>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-5">
                          If you notice an error in your job post, please{" "}
                          <Link to="/contact" className="underline text-indigo-600 dark:text-indigo-400">
                            contact Great Hire
                          </Link>
                        </p>

                        <small className="text-xs text-slate-500 dark:text-slate-400 block mt-4 leading-relaxed">
                          By pressing apply: 1) you agree to our{" "}
                          <Link to="/policy/privacy-policy" className="underline text-indigo-600 dark:text-indigo-400">
                            Terms, Cookie & Privacy Policies
                          </Link>
                          ; 2) you consent to your jobs being transmitted to the
                          Students (Great Hire does not guarantee receipt), &
                          processed & analyzed in accordance with its & Great Hire's
                          terms & privacy policies; & 3) you acknowledge that when
                          you post to jobs outside your country it may involve you
                          sending your personal data to countries with lower levels
                          of data protection.
                        </small>

                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
                          Having an issue with this job?{" "}
                          <Link to="/contact" className="underline text-indigo-600 dark:text-indigo-400">
                            Tell us more
                          </Link>
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <button type="button" onClick={handlePrevious} className={secondaryBtnCls}>
                          {IconArrowLeft} Previous
                        </button>
                        <button type="submit" className={primaryBtnCls} disabled={loading}>
                          {loading ? "Posting..." : (<>Publish Opportunity {IconRocket}</>)}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0e1a] transition-colors duration-300">
          <span className="text-4xl text-slate-400 dark:text-slate-500 transition-colors duration-300">Company not created</span>
        </div>
      )}
    </>
  );
};

export default PostJob;