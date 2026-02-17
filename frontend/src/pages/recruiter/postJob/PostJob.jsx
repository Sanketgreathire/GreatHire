import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import Stepper from "react-stepper-horizontal";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { toast } from "react-hot-toast";
import { decreaseMaxPostJobs } from "@/redux/companySlice";
import axios from "axios";
import { allLocations } from "@/utils/constant";
import { Helmet } from "react-helmet-async";
import { useRef } from "react";
import DOMPurify from "dompurify";

const PostJob = () => {
  const [step, setStep] = useState(0);
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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






  const formik = useFormik({
    initialValues: {
      companyName: company?.companyName,
      urgentHiring: "",
      title: "",
      details: "",

      skills: [],
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
      anyAmount: "No",
    },
    validationSchema: Yup.object({
      urgentHiring: Yup.string().required("This field is required"),
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
      skills: Yup.string().required("Skills are required"),
      benefits: Yup.string().required("Benefits are required"),
      qualifications: Yup.string().required("Qualification is required"),
      // responsibilities: Yup.string().required("Responsibility is required"),
      anyAmount: Yup.string().required("Yes or no is required"),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      console.log("Form values being submitted:", values);
      console.log("anyAmount value:", values.anyAmount);
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
          }//else if(company?.creditedForJobs !== null ){
          //   dispatch(decreaseJobCredits(500));
          // }

          toast.success("Job post successfully");
          // Redirect to the dashboard after 2 seconds
          setTimeout(() => {
            navigate("/recruiter/dashboard/home");
          }, 1000);
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
      ["companyName", "urgentHiring", "title", "details"], // Step 0
      ["skills", "benefits", "qualifications", "responsibilities"], // Step 1
      ["experience", "salary", "jobType", "workPlaceFlexibility", "location"], // Step 2
      ["numberOfOpening", "respondTime", "duration", "anyAmount"], // Step 3
    ][step];
    // Mark the current step fields as touched to trigger validation messages
    const touchedFields = {};
    currentStepFields.forEach((field) => {
      touchedFields[field] = true;
    });
    formik.setTouched(touchedFields);
    // Trigger validation and ensure required fields show error messages
    await formik.validateForm();
    // Check if there are any errors or blank fields in the current step's fields
    const hasErrors = currentStepFields.some(
      (field) => !!formik.errors[field] || !formik.values[field]
    );

    if (hasErrors) {
      console.log(
        "Validation failed. Please fill all required fields before proceeding."
      );
      return; // Block navigation if there are errors or blank fields
    }
    // Move to the next step if all fields are valid
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    { title: "Basic Info" },
    { title: "Job Details" },
    { title: "Requirements" },
    { title: "Additional Info" },
    { title: "Review & Submit" },
  ];

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

      {company && user?.isActive ? (
        <div className="px-2 py-4 pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {/* Credit Status Banner */}
          <div className="max-w-3xl mx-auto mb-4 px-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-lg p-4 shadow-lg transition-colors duration-300">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium">Remaining Job Posts</p>
                  <p className="text-3xl font-bold">
                    {company?.creditedForJobs >= 500 ? Math.floor(company.creditedForJobs / 500) : 0} Jobs
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-3xl mx-auto px-4 md:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-colors duration-300">
            <h1>
              {/* Display only the title of the current step */}
              <h2 className="md:hidden font-bold text-2xl text-blue-700 dark:text-blue-400 py-7 transition-colors duration-300">
                {steps[step].title}
              </h2>
            </h1>

            <form onSubmit={formik.handleSubmit}>
              {step === 0 && (
                <div>
                  <div className="mb-6">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Company Name<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <input
                      name="companyName"
                      type="text"
                      placeholder="Enter company name"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      value={formik.values.companyName}
                      readOnly
                    />
                    {formik.touched.companyName &&
                      formik.errors.companyName && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                          {formik.errors.companyName}
                        </div>
                      )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Urgent Hiring<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <select
                      name="urgentHiring"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.urgentHiring}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {formik.touched.urgentHiring &&
                      formik.errors.urgentHiring && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                          {formik.errors.urgentHiring}
                        </div>
                      )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Job Title<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Enter job title"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.title}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <div className="text-red-500 dark:text-red-400 text-sm">
                        {formik.errors.title}
                      </div>
                    )}
                  </div>



                  <div className="mb-6">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Job Details<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>

                    {/* Toolbar */}
                    <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-t px-3 py-2 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                      {/* Bold */}
                      <button
                        type="button"
                        onClick={toggleBold}
                        className={`p-2 rounded font-bold transition-colors duration-300 ${boldMode ? "bg-gray-200 dark:bg-gray-600" : "hover:bg-gray-200 dark:hover:bg-gray-600"
                          } text-gray-900 dark:text-gray-100`}
                      >
                        B
                      </button>

                      {/* Italic */}
                      <button
                        type="button"
                        onClick={toggleItalic}
                        className={`p-2 rounded italic transition-colors duration-300 ${italicMode ? "bg-gray-200 dark:bg-gray-600" : "hover:bg-gray-200 dark:hover:bg-gray-600"
                          } text-gray-900 dark:text-gray-100`}
                      >
                        <i>i</i>
                      </button>

                      {/* Lists */}
                      {/* Bullet */}
                      <button
                        type="button"
                        onClick={bulletList}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        title="Bullet List"
                      >
                        ●
                      </button>

                      {/* Number */}
                      <button
                        type="button"
                        onClick={numberList}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        title="Numbered List"
                      >
                        123
                      </button>
                    </div>

                    {/* Editor */}
                    <div
                      ref={editorRef}
                      contentEditable
                      className="w-full min-h-[150px] p-3 border border-t-0 border-gray-300 dark:border-gray-600 rounded-b focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square] [&_ol_ol]:list-[lower-alpha] [&_ol_ol_ol]:list-[lower-roman] transition-colors duration-300"
                      onKeyDown={handleKeyDown}
                      onInput={(e) =>
                        formik.setFieldValue("details", e.currentTarget.innerHTML)
                      }
                    />

                    {/* Error */}
                    {formik.touched.details && formik.errors.details && (
                      <div className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {formik.errors.details}
                      </div>
                    )}
                  </div>



                  {/* Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={step === 0} // Disable button if step is 0
                      className={`p-2 rounded transition-colors duration-300 ${step === 0
                          ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed"
                          : "bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500"
                        }`}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-700 dark:bg-blue-600 text-white p-2 rounded hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors duration-300"
                    >
                      Next
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4 transition-colors duration-300">
                    Have feedback?{" "}
                    <Link
                      to="/contact"
                      className="text-blue-700 dark:text-blue-400 cursor-pointer hover:underline"
                    >
                      Tell us more
                    </Link>
                  </p>
                </div>
              )}

              {step === 1 && (
                <div>
                  {/* Skills */}
                  <div className="mb-6">
                    <Label
                      htmlFor="skills"
                      className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                    >
                      Skills<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <textarea
                      id="skills"
                      name="skills"
                      placeholder="Enter skills separated by commas (e.g., HTML, CSS, JavaScript)"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.skills}
                    />
                    {formik.touched.skills && formik.errors.skills && (
                      <div className="text-red-500 dark:text-red-400 text-sm">
                        {formik.errors.skills}
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <Label htmlFor="benefits" className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Benefits<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
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
                        // Ensure benefits is always a string before splitting
                        const selectedBenefits = String(formik.values.benefits || "").split("\n");

                        return (
                          <label key={benefit} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="benefitsCheckbox"
                              value={benefit}
                              className="w-4 h-4"
                              checked={selectedBenefits.includes(benefit)}
                              onChange={(e) => {
                                let updatedBenefits = [...selectedBenefits].filter(Boolean); // Remove empty values

                                if (e.target.checked) {
                                  updatedBenefits.push(benefit);
                                } else {
                                  updatedBenefits = updatedBenefits.filter((b) => b !== benefit);
                                }

                                formik.setFieldValue("benefits", updatedBenefits.join("\n")); // Store as a string
                              }}
                            />
                            <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{benefit}</span>
                          </label>
                        );
                      })}
                    </div>

                    <textarea
                      id="benefits"
                      name="benefits"
                      placeholder="Enter additional benefits..."
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded h-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={String(formik.values.benefits || "")} // Ensure it's always a string
                    />
                    {formik.touched.benefits && formik.errors.benefits && (
                      <div className="text-red-500 dark:text-red-400 text-sm">{formik.errors.benefits}</div>
                    )}
                  </div>
                  {/* Qualifications */}
                  <div className="mb-6">
                    <Label
                      htmlFor="qualifications"
                      className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                    >
                      Qualifications<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <textarea
                      id="qualifications"
                      name="qualifications"
                      placeholder="Enter qualifications separated by new lines (eg. Bechelor, Master or diploma)"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.qualifications}
                    />
                    {formik.touched.qualifications &&
                      formik.errors.qualifications && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                          {formik.errors.qualifications}
                        </div>
                      )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-500 dark:bg-gray-600 text-white p-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-700 dark:bg-blue-600 text-white p-2 rounded hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors duration-300"
                    >
                      Next
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4 transition-colors duration-300">
                    Have feedback?{" "}
                    <Link
                      to="/contact"
                      className="text-blue-700 dark:text-blue-400 cursor-pointer hover:underline"
                    >
                      Tell us more
                    </Link>
                  </p>
                </div>
              )}

              {step === 2 && (
                <div>
                  {/* Experience */}
                  <div className="mb-6">
                    <Label htmlFor="experience" className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Experience<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Fresher",
                        "6 months-1 year",
                        "1-2 years",
                        "2-3 years",
                        "3-4 years",
                        "More than 5 years",
                      ].map((option) => {
                        // Convert the current string value into an array for easier handling
                        const selectedOptions = formik.values.experience
                          ? formik.values.experience.split(", ")
                          : [];
                        return (
                          <label key={option} className="flex items-center space-x-2">
                            {/* Changed input type from radio to checkbox */}
                            <input
                              type="checkbox"
                              name="experience"
                              value={option}
                              // Updated to check if the option exists in the array derived from the string
                              checked={selectedOptions.includes(option)}
                              onChange={(e) => {
                                // Create a mutable copy of the current selections from the string value
                                let updatedOptions = [...selectedOptions];
                                if (e.target.checked) {
                                  // Add the option if checked
                                  updatedOptions.push(option);
                                } else {
                                  // Remove the option if unchecked
                                  updatedOptions = updatedOptions.filter((opt) => opt !== option);
                                }
                                // Join the array back into a string (comma separated) to meet the expected type
                                formik.setFieldValue("experience", updatedOptions.join(", "));
                              }}
                              className="peer hidden"
                            />
                            <div className="w-4 h-4 border border-gray-400 dark:border-gray-500 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-600 transition-colors duration-300">
                              {selectedOptions.includes(option) && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  strokeLinecap="butt"
                                  strokeLinejoin="miter"
                                >
                                  <polyline points="4 12 10 18 20 5" />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                    {formik.touched.experience && formik.errors.experience && (
                      <div className="text-red-500 dark:text-red-400 text-sm">{formik.errors.experience}</div>
                    )}
                  </div>

                  {/* Salary */}
                  <div className="mb-6">
                    <Label
                      htmlFor="salary"
                      className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                    >
                      Salary<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="salary"
                        name="salary"
                        type="text"
                        placeholder="Enter salary (e.g., 45000-50000)"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded h-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                        onChange={formik.handleChange}
                        value={formik.values.salary}
                      />
                      <select
                        id="salaryType"
                        name="salaryType"
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 h-10 w-32 text-gray-700 dark:text-gray-300 transition-colors duration-300"
                        onChange={formik.handleChange}
                        value={formik.values.salaryType || ""}
                      >
                        <option value="" disabled>Rate</option>
                        <option value="per year">per year</option>
                        <option value="per month">per month</option>
                        <option value="per week">per week</option>
                        <option value="per day">per day</option>
                        <option value="per hour">per hour</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </div>
                    {formik.touched.salary && formik.errors.salary && (
                      <div className="text-red-500 dark:text-red-400 text-sm">
                        {formik.errors.salary}
                      </div>
                    )}
                  </div>

                  {/* Job Type */}
                  <div className="mb-6">
                    <Label
                      htmlFor="jobType"
                      className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
                    >
                      Job Type<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <select
                      id="jobType"
                      name="jobType"
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
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
                      <div className="text-red-500 dark:text-red-400 text-sm">
                        {formik.errors.jobType}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Work Place Flexibility <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <select
                      name="workPlaceFlexibility"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.workPlaceFlexibility}
                    >
                      <option value="">Select</option>
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {formik.touched.workPlaceFlexibility &&
                      formik.errors.workPlaceFlexibility && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                          {formik.errors.workPlaceFlexibility}
                        </div>
                      )}
                  </div>

                  {/* Location */}
                  <div className="mb-6 relative">
                    <Label htmlFor="location" className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Location<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      placeholder="Enter location manually or select from dropdown"
                      value={formik.values.location}
                      onChange={(e) => {
                        formik.handleChange(e);
                        e.target.nextSibling.classList.remove("hidden");
                      }}
                      onFocus={(e) => e.target.nextSibling.classList.remove("hidden")}
                      onBlur={(e) => setTimeout(() => e.target.nextSibling.classList.add("hidden"), 200)}
                    />
                    <div className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded mt-1 shadow-md max-h-40 overflow-y-auto hidden transition-colors duration-300">
                      {[
                        ...Object.values(allLocations)
                          .flat()
                          .filter((location) =>
                            location.toLowerCase().includes(formik.values.location.toLowerCase())
                          ),
                        ...Object.values(allLocations)
                          .flat()
                          .filter(
                            (location) =>
                              !location.toLowerCase().includes(formik.values.location.toLowerCase())
                          ),
                      ].map((location) => (
                        <div
                          key={location}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-300"
                          onMouseDown={(e) => {
                            formik.setFieldValue("location", location);
                            e.target.parentNode.classList.add("hidden");
                          }}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                    {formik.touched.location && formik.errors.location && (
                      <div className="text-red-500 dark:text-red-400 text-sm">{formik.errors.location}</div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-500 dark:bg-gray-600 text-white p-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-700 dark:bg-blue-600 text-white p-2 rounded hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors duration-300"
                    >
                      Next
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4 transition-colors duration-300">
                    Have feedback?{" "}
                    <Link
                      to="/contact"
                      className="text-blue-700 dark:text-blue-400 cursor-pointer hover:underline"
                    >
                      Tell us more
                    </Link>
                  </p>
                </div>
              )}

              {step === 3 && (
                <div>
                  {/* Number of Openings */}
                  <div className="mb-6 ">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Number of Openings
                      <span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <input
                      name="numberOfOpening"
                      type="number"
                      placeholder="Enter number of openings (e.g. 1, 2)"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.numberOfOpening}
                    />
                    {formik.touched.numberOfOpening &&
                      formik.errors.numberOfOpening && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                          {formik.errors.numberOfOpening}
                        </div>
                      )}
                  </div>

                  {/* Response Time */}
                  <div className="mb-6">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Response Time<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <input
                      name="respondTime"
                      type="number"
                      placeholder="Enter response time (e.g. 1 day, 2 days)"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.respondTime}
                    />
                    {formik.touched.respondTime &&
                      formik.errors.respondTime && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                          {formik.errors.respondTime}
                        </div>
                      )}
                  </div>

                  {/* Duration */}
                  <div className="mb-6">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Duration<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <input
                      name="duration"
                      type="text"
                      placeholder="Enter duration (e.g. Monday to Friday)"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.duration}
                    />
                    {formik.touched.duration && formik.errors.duration && (
                      <div className="text-red-500 dark:text-red-400 text-sm">
                        {formik.errors.duration}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                      Applicants need to  pay any charges?<span className="text-red-500 dark:text-red-400 ml-1">*</span>
                    </Label>
                    <select
                      name="anyAmount"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                      onChange={formik.handleChange}
                      value={formik.values.anyAmount}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {formik.touched.activeColor &&
                      formik.errors.anyAmount && (
                        <div className="text-red-500 dark:text-red-400 text-sm">
                          {formik.errors.anyAmount}
                        </div>
                      )}

                    {/* Note about GreatHire policy */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
                      <strong>Note:</strong> GreatHire does not support taking any amount from applicants.
                    </p>
                  </div>


                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-500 dark:bg-gray-600 text-white p-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-700 dark:bg-blue-600 text-white p-2 rounded hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors duration-300"
                    >
                      Next
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4 transition-colors duration-300">
                    Have feedback?{" "}
                    <Link
                      to="/contact"
                      className="text-blue-700 dark:text-blue-400 cursor-pointer hover:underline"
                    >
                      Tell us more
                    </Link>
                  </p>
                </div>
              )}

              {step === 4 && (
                <>
                  {/* <h2 className="text-xl font-bold mb-4">Review & Submit</h2> */}
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Company Name:</strong>{" "}
                      {formik.values.companyName || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Urgent Hiring:</strong>{" "}
                      {formik.values.urgentHiring || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Job Title:</strong> {formik.values.title || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Job Details:</strong>{" "}
                      <div
                        className="
    text-justify text-sm
    [&_ul]:list-disc [&_ul]:ml-6
    [&_ol]:list-decimal [&_ol]:ml-6
    [&_li]:mb-1
    [&_ol[type='a']]:list-[lower-alpha]
    [&_ol[type='A']]:list-[upper-alpha]
    [&_ol[type='i']]:list-[lower-roman]
    [&_ol[type='I']]:list-[upper-roman]
  "
                        dangerouslySetInnerHTML={{
                          __html: formik.values.details
                            ? DOMPurify.sanitize(formik.values.details)
                            : "<p>N/A</p>",
                        }}
                      />

                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Skills:</strong>{" "}
                      {formik.values.skills.length > 0
                        ? formik.values.skills
                          .split(",")
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mr-2 mb-2 transition-colors duration-300"
                            >
                              {skill.trim()}
                            </span>
                          ))
                        : "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Experience:</strong>{" "}
                      {formik.values.experience || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Benefits:</strong>{" "}
                      {formik.values.benefits
                        ? formik.values.benefits.split("\n").join(", ") : "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Qualification:</strong>{" "}
                      {formik.values.qualifications || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Salary:</strong>{" "}
                      {formik.values.salary ? `₹${formik.values.salary} ${formik.values.salaryType || ""}`.trim() : "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Job Type:</strong>{" "}
                      {formik.values.jobType || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Work Place Flexibility:</strong>{" "}
                      {formik.values.workPlaceFlexibility || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Location:</strong>{" "}
                      {formik.values.location || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Number of Openings:</strong>{" "}
                      {formik.values.numberOfOpening || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Response Time:</strong>{" "}
                      {formik.values.respondTime + " days" || "N/A"}
                    </div>

                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Duration:</strong>{" "}
                      {formik.values.duration || "N/A"}
                    </div>
                    <div className="mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      <strong>Applicants need to  pay any charges?:</strong>{" "}
                      {formik.values.anyAmount || "N/A"}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-300">
                      If you notice an error in your job post, please <br />
                      <Link to="/contact" className="underline cursor-pointer text-blue-700 dark:text-blue-400">
                        contact Great Hire
                      </Link>
                    </p>

                    <small className="text-xs text-gray-500 dark:text-gray-400 block mb-6 transition-colors duration-300">
                      By pressing apply: 1) you agree to our{" "}
                      <Link
                        to="/policy/privacy-policy"
                        className="underline cursor-pointer text-blue-700 dark:text-blue-400"
                      >
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

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      Having an issue with this job?{" "}
                      <Link
                        to="/contact"
                        className="underline text-blue-700 dark:text-blue-400 cursor-pointer"
                      >
                        Tell us more
                      </Link>
                    </p>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-500 dark:bg-gray-600 text-white p-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className={`bg-blue-700 dark:bg-blue-600 text-white p-2 rounded hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors duration-300 ${loading && "cursor-not-allowed opacity-70"
                        }`}
                      disabled={loading}
                    >
                      {loading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      ) : !company ? (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <span className="text-4xl text-gray-400 dark:text-gray-500 transition-colors duration-300">Company not created</span>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <span className="text-4xl text-gray-400 dark:text-gray-500 transition-colors duration-300">
            GreatHire will verify your company soon.
          </span>
        </div>
      )}
    </>
  );
};

export default PostJob;