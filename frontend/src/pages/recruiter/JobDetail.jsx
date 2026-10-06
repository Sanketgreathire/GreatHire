import  { useEffect, useState, useRef } from "react";
import axios from "axios";
import { JOB_API_END_POINT, ADMIN_JOB_DATA_API_END_POINT } from "@/utils/ApiEndPoint";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { useJobDetails } from "@/context/JobDetailsContext";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";




// UI CHANGE: Professional icons add kiye hain for better visuals
import {
  Pencil,
  Briefcase,
  MapPin,
  // DollarSign,
  Users,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Award,
  Wrench,
  ArrowLeft,
  Building2,
  Hourglass, // Assuming 'duration' means working days/hours
} from "lucide-react";

// this will use when user is admin
import { fetchJobStats, fetchApplicationStats } from "@/redux/admin/statsSlice";

const JobDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedJob, setEditedJob] = useState({});
  const [jobOwner, setJobOwner] = useState(null);
  const [dloading, dsetLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { selectedJob } = useJobDetails();

  const editorRef = useRef(null);
  const [boldMode, setBoldMode] = useState(false);
  const [italicMode, setItalicMode] = useState(false);

  // Admins can edit job details too (recruiters could already do this)
  const canEditJob =
    user?.role === "recruiter" ||
    user?.role === "admin" ||
    user?.role === "Owner";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true); // Set loading true at the start
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          const jobData = response.data.job.jobDetails || response.data.job;
          setJobDetails(jobData);
          setJobOwner(response?.data.job.created_by);
        } else {
          setError(response.data.message || "Job details not found.");
        }
      } catch (err) {
        setError("Failed to load job details.");
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // Baaki saare functions (deleteJob, handleSave, etc.) waise hi rahenge, unme koi change nahi hai.
  const deleteJob = async (jobId) => {
    try {
      dsetLoading(true);
      const response = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobId}`,
        {
          data: { companyId: company?._id || null },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        if (user?.role !== "recruiter") {
          dispatch(fetchJobStats());
          dispatch(fetchApplicationStats());
        }
        toast.success(response.data.message);
        navigate(-1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(
        "There was an error deleting the job. Please try again later."
      );
    } finally {
      dsetLoading(false);
    }
  };

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    deleteJob(id);
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJob({ ...editedJob, [name]: value });
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      const isAdminUser = user?.role === "admin" || user?.role === "Owner";

      // Admins edit jobs without being tied to the job's company, so they
      // use a dedicated admin endpoint instead of the recruiter one.
      const url = isAdminUser
        ? `${ADMIN_JOB_DATA_API_END_POINT}/update-job/${id}`
        : `${JOB_API_END_POINT}/update/${id}`;
      const payload = isAdminUser
        ? { editedJob }
        : { editedJob, companyId: company?._id };

      const response = await axios.put(url, payload, {
        withCredentials: true,
      });
      if (response.data.success) {
        setJobDetails(response.data.updatedJob.jobDetails);
        setEditMode(false);
        toast.success("Job updated successfully 😊");
      } else {
        toast.error(response.data.message || "Failed to update job.");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update job."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditedJob(jobDetails);
    setEditMode(true);
  };

  // Auto-open edit mode when navigated here with ?edit=true (e.g. from the
  // admin jobs list "Edit" action)
  useEffect(() => {
    if (
      canEditJob &&
      jobDetails &&
      !editMode &&
      searchParams.get("edit") === "true"
    ) {
      handleEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDetails, canEditJob]);

  // Set editor content when entering edit mode
  useEffect(() => {
    if (editMode && editorRef.current && jobDetails?.details) {
      editorRef.current.innerHTML = jobDetails.details;
    }
  }, [editMode, jobDetails?.details]);

  const toggleBold = () => {
    document.execCommand("bold");
    setBoldMode(!boldMode);
  };

  const toggleItalic = () => {
    document.execCommand("italic");
    setItalicMode(!italicMode);
  };

  const bulletList = () => {
    document.execCommand("insertUnorderedList");
  };

  const numberList = () => {
    document.execCommand("insertOrderedList");
  };
// eslint-disable-next-line no-unused-vars
  const alphaList = () => {
    document.execCommand("insertOrderedList");

    setTimeout(() => {
      const sel = window.getSelection();
      let node = sel.anchorNode;
      while (node && node.nodeName !== "OL") node = node.parentNode;
      if (node) node.style.listStyleType = "lower-alpha";
    }, 0);
  };


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

    // Let browser handle Enter and Backspace naturally
  };


  // --- UI CHANGE START: Loading, Error, and No Data states ko better banaya hai ---
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-xl font-semibold text-slate-600 animate-pulse">
          Loading Job Details...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-xl font-medium text-red-600">{error}</p>
      </div>
    );
  if (!jobDetails)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-xl font-medium text-slate-700">No job details found.</p>
      </div>
    );
  // --- UI CHANGE END ---

  return (
    <>
      <Helmet>
        {/* Meta Title */}
        <title>
          Job Details | View Benefits, Skills, and Requirements - GreatHire
        </title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Detailed descriptions entailing job responsibilities, skills and qualifications required, benefits, salary range, and workplace flexibility can be found on GreatHire. Hyderabad State India-based job platform for recruiters and candidates to make confident hiring and career decisions based on clarity and transparency. GreatHire supports companies, startups, recruiters, and professionals with reliable job management tools, scalable recruitment solutions, and seamless talent connections. Take a closer look at openings, manage postings with ease, and connect with the right candidates through a trusted platform built for modern hiring success, productivity, and growth."
        />
      </Helmet>
      {user?.role !== "recruiter" && <Navbar />}

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
        <main className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${
          user?.role === "recruiter" || user?.role === "admin" || user?.role === "Owner"
            ? "pt-6 pb-10"
            : "pt-20 pb-10"
        }`}>

          {/* Back Button and action buttons header */}
          <div className="flex justify-between items-center mb-6 py-2">
            <Button variant="ghost" onClick={() => navigate(-1)} className=" bg-green-400 border border-green-900 text-slate-900 hover:bg-green-800 hover:text-white dark:bg-green-800 dark:text-slate-200 dark:hover:bg-green-600 dark:hover:text-white">
              <ArrowLeft className=" h-6 w-8 mr-2" />
              Back
            </Button>
            {canEditJob && !editMode && (
              <Button variant="outline" onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
            )}
          </div>

          {/* --- UI CHANGE: Main Job Header Card --- */}
          <div className="bg-gray-100 dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8 mb-8 ">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
              {jobDetails?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                <span>{jobDetails?.companyName || "Company not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                <span>{jobDetails?.location || "Location Not Available"}</span>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
              {editMode ? (
                <div className="flex items-center gap-2">
                  {/* <DollarSign className="h-5 w-5 text-slate-500" /> */}
                  <input
                    type="text"
                    name="salary"
                    value={editedJob.salary || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                    placeholder="e.g., 50000 - 70000"
                  />
                </div>
              ) : (
                <p className="text-xl font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                  {/* <DollarSign className="h-6 w-6"/> */}
                  <span>
                    {jobDetails?.salary
                      ? `₹${jobDetails.salary.replace(/\s/g, "")} monthly`
                      : "Salary Not Specified"}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* --- UI CHANGE: Two-column layout for main content --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Job Description Card */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8 font-geometric">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Job Description</h2>
                {editMode ? (

                  // <textarea
                  //   name="details"
                  //   value={editedJob.details || ""}
                  //   onChange={handleInputChange}
                  //   className="w-full p-2 rounded border border-slate-300 text-slate-600"
                  //   rows={5}
                  // />

                  <div className="w-full">
                    {/* Toolbar */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-t px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">

                      <button
                        type="button"
                        onClick={toggleBold}
                        className={`p-2 rounded font-bold ${boldMode ? "bg-gray-200 dark:bg-gray-600" : "hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                      >
                        B
                      </button>

                      <button
                        type="button"
                        onClick={toggleItalic}
                        className={`p-2 rounded italic ${italicMode ? "bg-gray-200 dark:bg-gray-600" : "hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                      >
                        i
                      </button>

                      <button
                        type="button"
                        onClick={bulletList}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Bullet List"
                      >
                        ●
                      </button>

                      <button
                        type="button"
                        onClick={numberList}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Numbered List"
                      >
                        123
                      </button>

                      {/* <button
                        type="button"
                        onClick={alphaList}
                        className="p-2 rounded hover:bg-gray-200"
                        title="Alphabet List"
                      >
                        abc
                      </button> */}
                    </div>

                    {/* Editor */}
                    <div
                      ref={editorRef}
                      contentEditable
                      className="
  w-full min-h-[150px] p-3
  border border-t-0 border-gray-300 rounded-b dark:bg-gray-700 dark:border-gray-600
  focus:outline-none
  text-slate-600 dark:text-gray-300
  
  text-justify
  [&_p]:text-justify
  [&_li]:text-justify

  [&_ul]:list-disc
  [&_ul]:pl-6

  [&_ol]:list-decimal
  [&_ol]:pl-6

  [&_ul_ul]:list-[circle]
  [&_ul_ul_ul]:list-[square]
  [&_ol_ol]:list-[lower-alpha]
  [&_ol_ol_ol]:list-[lower-roman]

  [&_ol[style*='alpha']]:list-[lower-alpha]
  [&_ol[style*='roman']]:list-[lower-roman]

  [&_li]:list-item dark:text-gray-300
"
                      onKeyDown={handleKeyDown}
                      onInput={(e) =>
                        setEditedJob({
                          ...editedJob,
                          details: e.currentTarget.innerHTML,
                        })
                      }
                    />
                  </div>

                ) : (
                  // <div className="prose prose-slate max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 text-base leading-relaxed font-">
                  //   {jobDetails?.details
                  //     ? jobDetails.details.split("\n").map((line, index) => (
                  //       <p key={index}>{line}</p>
                  //     ))
                  //     : <p>No description provided.</p>}
                  // </div>
                  <div
                    className="
    prose prose-slate max-w-none
    dark:prose-invert
    text-slate-600 dark:text-slate-300
    text-base leading-relaxed
    text-justify
    [&_p]:text-justify
    [&_li]:text-justify
    [&_ul]:list-disc [&_ul]:ml-6
    [&_ol]:list-decimal [&_ol]:ml-6
    [&_li]:mb-1

    [&_ul_ul]:list-[circle]
    [&_ul_ul_ul]:list-[square]
    [&_ol_ol]:list-[lower-alpha]
    [&_ol_ol_ol]:list-[lower-roman]

    [&_ol[type='a']]:list-[lower-alpha]
    [&_ol[type='A']]:list-[upper-alpha]
    [&_ol[type='i']]:list-[lower-roman]
    [&_ol[type='I']]:list-[upper-roman]
  "
                    dangerouslySetInnerHTML={{
                      __html: jobDetails?.details
                        ? DOMPurify.sanitize(jobDetails.details)
                        : "<p>No description provided.</p>",
                    }}
                  />

                )}
              </div>

              {/* Benefits Card */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Benefits</h2>
                {editMode ? (
                  <textarea
                    name="benefits"
                    value={editedJob.benefits ? editedJob.benefits.join("\n") : ""}
                    onChange={(e) => setEditedJob({ ...editedJob, benefits: e.target.value.split("\n") })}
                    className="w-full p-2 rounded border border-slate-300 dark:bg-gray-700 dark:text-gray-300"
                    rows={4}
                    placeholder="Enter each benefit on a new line"
                  />
                ) : (
                  <ul className="space-y-3">
                    {jobDetails?.benefits?.length > 0 ? (
                      jobDetails.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" />
                          <span className="text-slate-600 dark:text-slate-300">{benefit}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Not specified</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Job Requirements Card */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Job Requirements</h2>
                <div className="space-y-6">
                  {/* Qualifications */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-200">Qualifications</h4>
                      {editMode ? <input type="text" name="qualifications" value={editedJob.qualifications || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300 dark:bg-gray-700 dark:text-gray-300" />
                        : <p className="text-slate-600 dark:text-slate-300">{jobDetails?.qualifications?.join(", ") || "Not specified"}</p>}
                    </div>
                  </div>
                  {/* Experience */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                      <Award className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-200">Experience</h4>
                      {editMode ? <input type="text" name="experience" value={editedJob.experience || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300 dark:bg-gray-700 dark:text-gray-300" />
                        : <p className="text-slate-600 dark:text-slate-300">{jobDetails?.experience || "Not specified"}</p>}
                    </div>
                  </div>
                  {/* Skills */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                      <Wrench className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                    </div>
                    {/* <div className="w-full">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-200">Skills Required</h4>
                      {editMode ? <textarea name="skills" value={editedJob.skills ? editedJob.skills.join("\n") : ""} onChange={(e) => setEditedJob({ ...editedJob, skills: e.target.value.split('\n') })} className="w-full p-2 mt-1 rounded border border-slate-300" rows={3} />
                        : <div className="flex flex-wrap gap-2 mt-2">
                          {jobDetails?.skills?.length > 0 ? jobDetails.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                          )) : <p className="text-slate-500">Not specified</p>}
                        </div>}
                    </div> */}
                    <div className="w-full">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-200">
                        Skills Required
                      </h4>

                      {editMode ? (
                        <textarea
                          name="skills"
                          value={editedJob.skills ? editedJob.skills.join("\n") : ""}
                          onChange={(e) =>
                            setEditedJob({
                              ...editedJob,
                              skills: e.target.value.split("\n"),
                            })
                          }
                          className="w-full p-2 mt-1 rounded border border-slate-300 dark:bg-gray-700 dark:text-gray-300"
                          rows={3}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(() => {
                            const rawSkills = jobDetails?.skills || [];

                            const similarity = (a, b) => {
                              a = a.toLowerCase();
                              b = b.toLowerCase();
                              if (a === b) return 1;

                              const dp = Array.from({ length: b.length + 1 }, () =>
                                Array(a.length + 1).fill(0)
                              );

                              for (let i = 0; i <= b.length; i++) dp[i][0] = i;
                              for (let j = 0; j <= a.length; j++) dp[0][j] = j;

                              for (let i = 1; i <= b.length; i++) {
                                for (let j = 1; j <= a.length; j++) {
                                  dp[i][j] =
                                    b[i - 1] === a[j - 1]
                                      ? dp[i - 1][j - 1]
                                      : Math.min(
                                        dp[i - 1][j - 1] + 1,
                                        dp[i][j - 1] + 1,
                                        dp[i - 1][j] + 1
                                      );
                                }
                              }

                              return 1 - dp[b.length][a.length] / Math.max(a.length, b.length);
                            };

                            const splitSkills = rawSkills.flatMap((skill) =>
                              skill
                                .split(/\n+/) // split ONLY by new lines
                                .flatMap((line) => {
                                  const cleaned = line
                                    .replace(/proficient in/i, "")
                                    .replace(/architecture/i, "")
                                    .replace(/concepts?/i, "concepts")
                                    .trim();

                                  let depth = 0;
                                  let buffer = "";
                                  const result = [];

                                  for (const char of cleaned) {
                                    if (char === "(") depth++;
                                    if (char === ")") depth--;

                                    if ((char === "," || char === "&") && depth === 0) {
                                      result.push(buffer.trim());
                                      buffer = "";
                                    } else {
                                      buffer += char;
                                    }
                                  }
                                  if (buffer) result.push(buffer.trim());

                                  return result;
                                })
                            );

                            let unique = [];

                            splitSkills.forEach((skill) => {
                              const idx = unique.findIndex(
                                (u) => similarity(u, skill) >= 0.85
                              );

                              if (idx === -1) unique.push(skill);
                              else if (skill.length > unique[idx].length)
                                unique[idx] = skill;
                            });

                            unique = unique.filter((skill, i) =>
                              !unique.some(
                                (other, j) =>
                                  i !== j &&
                                  other.toLowerCase().includes(skill.toLowerCase()) &&
                                  other.length > skill.length
                              )
                            );

                            return unique.length > 0 ? (
                              unique.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <p className="text-slate-500">Not specified</p>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1">
              <div className="bg-gray-100 dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8 sticky top-20">
                <h3 className=" text-xl font-bold text-slate-800 dark:text-white mb-6">Job Overview</h3>
                <ul className="space-y-5">
                  {/* Job Type */}
                  <li className="flex items-center gap-4">
                    <Briefcase className="h-6 w-6 text-slate-500" />
                    <div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Job Type</span>
                      {editMode ? <input type="text" name="jobType" value={editedJob.jobType || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" />
                        : <p className="font-semibold text-slate-700 dark:text-slate-200">{jobDetails?.jobType || "Not specified"}</p>}
                    </div>
                  </li>
                  {/* Openings */}
                  <li className="flex items-center gap-4">
                    <Users className="h-6 w-6 text-slate-500" />
                    <div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">No. of Openings</span>
                      {editMode ? <input type="number" name="numberOfOpening" value={editedJob.numberOfOpening || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" />
                        : <p className="font-semibold text-slate-700 dark:text-slate-200">{jobDetails?.numberOfOpening || "Not specified"}</p>}
                    </div>
                  </li>
                  {/* Working Days */}
                  <li className="flex items-center gap-4">
                    <Hourglass className="h-6 w-6 text-slate-500" />
                    <div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Working Days</span>
                      {editMode ? <input type="text" name="duration" value={editedJob.duration || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" />
                        : <p className="font-semibold text-slate-700 dark:text-slate-200">{jobDetails?.duration || "Not specified"}</p>}
                    </div>
                  </li>
                  {/* Flexibility */}
                  <li className="flex items-center gap-4">
                    <Sparkles className="h-6 w-6 text-slate-500" />
                    <div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Work Place Flexibility</span>
                      {editMode ? <input type="text" name="workPlaceFlexibility" value={editedJob.workPlaceFlexibility || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" />
                        : <p className="font-semibold text-slate-700 dark:text-slate-200">{jobDetails?.workPlaceFlexibility || "Not specified"}</p>}
                    </div>
                  </li>
                </ul>

                {/* --- UI CHANGE: Action buttons yahan move kar diye for better access --- */}
                <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                  {!editMode ? (
                    <div className="space-y-3">
                      {/* <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        if (user.role === "recruiter")
                          navigate(`/recruiter/dashboard/applicants-details/${id}`);
                        else navigate(`/admin/applicants-list/${id}`);
                      }}
                    >
                      View Applicants List
                    </Button> */}
                      {(user?._id === jobOwner ||
                        user?.emailId?.email === company?.adminEmail ||
                        user?.role === "admin" ||
                        user?.role === "Owner") && (
                          <Button
                            size="lg"
                            variant="destructive"
                            className="w-full"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={dloading}
                          >
                            {dloading ? "Deleting..." : "Delete Job"}
                          </Button>
                        )}
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <Button
                        size="lg"
                        className="w-full bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white"
                        onClick={handleSave}
                        disabled={saveLoading}
                      >
                        {saveLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white hover:text-white"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* --- UI CHANGE END --- */}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
    </>
  );
};

export default JobDetail;