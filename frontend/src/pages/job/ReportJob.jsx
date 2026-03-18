// Importing React and useState for state management
import React, { useState } from "react";
// Importing an info icon for UI
import { BsFillInfoCircleFill } from "react-icons/bs";
// Importing useNavigate for navigation 
import { useNavigate } from "react-router-dom";
// Importing toast notifications for user feedback
import { toast } from "react-hot-toast";
// Importing job details context 
import { useJobDetails } from "@/context/JobDetailsContext";
// Importing axios for making API requests 
import axios from "axios";
// Importing API endpoint for job reports
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";

import { useSelector } from "react-redux";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const ReportJob = () => {

  const { selectedJob } = useJobDetails(); // Getting selected job details from context
  const navigate = useNavigate(); // Initializing navigation function

  // State variables for selected problem and additional description
  const [selectedProblem, setSelectedProblem] = useState("");
  const [description, setDescription] = useState("");
  const maxChars = 300; // Maximum allowed characters for the description field

  // ADDED these new states:
  const [offensiveType, setOffensiveType] = useState("");
  const [offensiveWhere, setOffensiveWhere] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [feeReason, setFeeReason] = useState("");
  const [didPay, setDidPay] = useState("");
  const [wrongFields, setWrongFields] = useState([]);
  const [correctInfo, setCorrectInfo] = useState("");
  const [sellingWhat, setSellingWhat] = useState("");
  const [askedToBuy, setAskedToBuy] = useState("");
  const [otherCategory, setOtherCategory] = useState("");

  // Screenshot upload states
  const [screenshots, setScreenshots] = useState([]);
  const maxFiles = 3;
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const valid = selected.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
      toast.error(`"${file.name}" is not allowed. Only JPG, PNG, WEBP, and PDF files are accepted.`);
      return false;
    }
      if (file.size > maxFileSize) {
        toast.error(`"${file.name}" exceeds 5MB limit.`);
        return false;
      }
      return true;
    });
    setScreenshots((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed.`);
        return combined.slice(0, maxFiles);
      }
      return combined;
    });
  };

  const removeFile = (index) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleWrongField = (value) => {
    setWrongFields(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  // Function to handle changes in the description input field
  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setDescription(e.target.value);
    }
  };

  // List of predefined problems users can report
  const problems = [
    { value: "offensive", label: "It's offensive or harassing" },
    { value: "money", label: "Asking for money or seems like a fake job" },
    { value: "incorrect", label: "Incorrect company, location or job details" },
    { value: "selling", label: "I think it's NOT a Job, but selling something" },
    { value: "other", label: "Other" },
  ];

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!selectedProblem) {
      toast.error("Please select a problem before submitting."); // Show error if no problem is selected
      return;
    }
    if (selectedProblem === "other" && !description) {
      toast.error("Please provide a description for 'Other'."); // Require description for 'Other' option
      return;
    }

    try {
      // Sending report details to the API
      const formData = new FormData();
      formData.append("jobId", selectedJob?._id);
      formData.append("reportTitle", problems.find(p => p.value === selectedProblem)?.label || selectedProblem);
      formData.append("reportType", selectedProblem);
      formData.append("description", description);

      if (selectedProblem === "offensive") {
        formData.append("offensiveType", offensiveType);
        formData.append("offensiveWhere", offensiveWhere);
      }
      if (selectedProblem === "money") {
        formData.append("feeAmount", feeAmount);
        formData.append("paymentMode", paymentMode);
        formData.append("feeReason", feeReason);
        formData.append("didPay", didPay);
      }
      if (selectedProblem === "incorrect") {
        wrongFields.forEach((f) => formData.append("wrongFields[]", f));
        formData.append("correctInfo", correctInfo);
      }
      if (selectedProblem === "selling") {
        formData.append("sellingWhat", sellingWhat);
        formData.append("askedToBuy", askedToBuy);
      }
      if (selectedProblem === "other") {
        formData.append("otherCategory", otherCategory);
      }
      screenshots.forEach((file) => formData.append("screenshots", file));
      const response = await axios.post(
        `${COMPANY_API_END_POINT}/report-job`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      // Handling the response from the server
      if (response.data.success) {
        toast.success(response.data.message); // Show success notification
        navigate(-1); // Navigate back to the previous page
      } else {
        toast.error(response.data.message); // Show error notification if submission failed
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(msg || "Failed to submit the report. Please try again later.");
    }
  };


  return (
    <>

      <Helmet>
        <title>Report a Job Posting | GreatHire's Safe & Reliable Hiring</title>
        <meta
          name="description"
          content="GreatHire is an employment solutions facilitator, which is currently operational from the state of Hyderabad, India, with the aim of providing a secure and authenticated employment environment for the professionals of the state of Hyderabad only. When you find such employment opportunities, you can report them on GreatHire to ensure the employment platform is safe and sound for all. This page is made to help users to complain about misleading ads, misleading information about companies, offending ads, and misleading ads in a very easy and confidential manner."
        />
      </Helmet>



      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 dark:bg-gray-800">
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg w-full flex flex-col overflow-y-auto max-h-[90vh] dark:bg-gray-900">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Report a Job</h2>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition text-xl"
            >
              ✖
            </button>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {selectedJob?.jobDetails?.title}
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {selectedJob?.jobDetails?.companyName}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {problems.map((problem, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="problem"
                  value={problem.value}
                  checked={selectedProblem === problem.value}
                  onChange={(e) => setSelectedProblem(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 flex items-center justify-center border rounded-full ${selectedProblem === problem.value
                    ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                    : "border-gray-400 dark:border-gray-500"
                    }`}
                >
                  {selectedProblem === problem.value && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </span>
                <span className="text-gray-600 dark:text-gray-300">{problem.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6">
            {/* ── OFFENSIVE PANEL ── */}
            {selectedProblem === "offensive" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-600 rounded-lg flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-red-800 dark:text-red-400">
                  🚫 Offensive / Harassment Details
                </p>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 block mb-1 dark:text-gray-400">
                    Type of Offensive Content
                  </label>
                  <select
                    value={offensiveType}
                    onChange={(e) => setOffensiveType(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">— Select —</option>
                    <option>Inappropriate / Vulgar language</option>
                    <option>Sexual harassment</option>
                    <option>Discriminatory (caste, religion, gender)</option>
                    <option>Threatening or abusive tone</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 block mb-1 dark:text-gray-400">
                    Where did this happen?
                  </label>
                  <select
                    value={offensiveWhere}
                    onChange={(e) => setOffensiveWhere(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">— Select —</option>
                    <option>In the job description itself</option>
                    <option>During interview / call</option>
                    <option>Via message / chat</option>
                    <option>Email communication</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── MONEY / FAKE JOB PANEL ── */}
            {selectedProblem === "money" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg flex flex-col gap-3 dark:bg-yellow-900 dark:border-yellow-600">
                <p className="text-xs font-bold uppercase tracking-wide text-yellow-800 dark:text-yellow-400">
                  ⚠️ Money / Fake Job Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-600 block mb-1 dark:text-gray-400">
                      Amount Demanded (₹)
                    </label>
                    <input
                      type="number"
                      value={feeAmount}
                      onChange={(e) => setFeeAmount(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-600 block mb-1 dark:text-gray-400">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    >
                      <option value="">— Select —</option>
                      <option>UPI / GPay / PhonePe</option>
                      <option>Bank Transfer</option>
                      <option>Cash</option>
                      <option>Gift Cards / Vouchers</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 block mb-1">
                    Fee Was Asked For
                  </label>
                  <select
                    value={feeReason}
                    onChange={(e) => setFeeReason(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">— Select reason —</option>
                    <option>Registration / Joining Fee</option>
                    <option>Training / Course Fee</option>
                    <option>ID Card / Document Processing</option>
                    <option>Security Deposit</option>
                    <option>Background Verification Fee</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 block mb-1">
                    Did you pay?
                  </label>
                  <select
                    value={didPay}
                    onChange={(e) => setDidPay(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">— Select —</option>
                    <option value="yes">Yes, I paid</option>
                    <option value="no">No, I refused in time</option>
                    <option value="partial">Partially paid</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── INCORRECT DETAILS PANEL ── */}
            {selectedProblem === "incorrect" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-green-800 dark:text-green-400">
                  ✏️ What Details Are Wrong?
                </p>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 block mb-2">
                    Select all that are incorrect
                  </label>
                  {[
                    { value: "company", label: "Company name / brand" },
                    { value: "location", label: "Job location / city" },
                    { value: "salary", label: "Salary / compensation" },
                    { value: "role", label: "Job role / responsibilities" },
                    { value: "experience", label: "Experience / qualification required" },
                    { value: "worktype", label: "Work type (Remote / On-site)" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer mb-1">
                      <input
                        type="checkbox"
                        checked={wrongFields.includes(opt.value)}
                        onChange={() => toggleWrongField(opt.value)}
                        className="accent-blue-600 dark:bg-blue-600 w-4 h-4"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 block mb-1">
                    Correct Information (if you know)
                  </label>
                  <textarea
                    value={correctInfo}
                    onChange={(e) => setCorrectInfo(e.target.value)}
                    placeholder="e.g. Actual location is Pune, not Mumbai..."
                    rows={3}
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>
            )}

            {/* ── SELLING PANEL ── */}
            {selectedProblem === "selling" && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-purple-800 dark:text-purple-400">
                  🛒 Product / Service Being Sold
                </p>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 block mb-1">
                    What Are They Selling?
                  </label>
                  <select
                    value={sellingWhat}
                    onChange={(e) => setSellingWhat(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">— Select —</option>
                    <option>Insurance / Financial products</option>
                    <option>Online courses / Certifications</option>
                    <option>MLM / Network marketing</option>
                    <option>Software / Tools / Subscriptions</option>
                    <option>Physical products (direct selling)</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 block mb-1">
                    Did They Ask You to Invest or Buy?
                  </label>
                  <select
                    value={askedToBuy}
                    onChange={(e) => setAskedToBuy(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">— Select —</option>
                    <option value="yes">Yes, they asked me to invest / purchase</option>
                    <option value="no">No, but the job is clearly product sales</option>
                    <option value="unclear">It was unclear / misleading</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── OTHER PANEL ── */}
            {selectedProblem === "other" && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  📝 Additional Details
                </p>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 block mb-1">
                    Category of Issue
                  </label>
                  <select
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="">— Select —</option>
                    <option>Ghost job (never responds)</option>
                    <option>Duplicate / repeated posting</option>
                    <option>Spam / irrelevant content</option>
                    <option>Expired job still showing</option>
                    <option>Data privacy concern</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── SCREENSHOT UPLOAD (shown for any selected problem) ── */}
            {selectedProblem && (
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 block mb-1">
                  Upload Screenshot / Proof{" "}
                  <span className="normal-case font-normal text-gray-400 dark:text-gray-500">
                    (optional · max 3 files · 5MB each)
                  </span>
                </label>

                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-gray-700">
                  <span className="text-2xl mb-1">📎</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Click or drag & drop</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">Images (JPG, PNG, WEBP) or PDF · Max 5MB each</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {screenshots.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {screenshots.map((file, idx) => (
                      <div key={idx} className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-xl">
                            📄
                            <span className="text-xs text-gray-500 dark:text-gray-400">PDF</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <label className="block text-gray-700 dark:text-gray-300 font-medium">
              Describe your problem:
            </label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              maxLength={maxChars}
              rows={4}
              className="w-full mt-2 border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
            <p className="text-right text-sm text-gray-500 dark:text-gray-400">
              {description.length}/{maxChars} characters
            </p>
          </div>

          <div className="mt-4 bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-gray-600 dark:text-gray-300 text-sm flex gap-2">
            <BsFillInfoCircleFill size={20} className="text-blue-600 dark:text-blue-400" />
            <span>
              Do not disclose your financial & personal details. Legitimate jobs never ask for payment.
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition font-semibold"
          >
            Report to Great Hire
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportJob;

