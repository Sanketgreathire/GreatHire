// Importing React and necessary hooks for state management and side effects
import React, { useState, useEffect } from "react"; 
// Importing ProgressBar for visualizing step progress
import { ProgressBar } from "react-step-progress-bar"; 
// Importing Info icon for UI elements
import { MdInfo } from "react-icons/md"; 
// Importing Back Arrow icon for navigation
import { BiArrowBack } from "react-icons/bi"; 
// Importing PDF viewer for displaying documents
import { Viewer } from "@react-pdf-viewer/core"; 
// Importing PDF viewer styles
import "@react-pdf-viewer/core/lib/styles/index.css";
// Importing File Remove icon for UI 
import { CgFileRemove } from "react-icons/cg"; 
// Importing File Signature icon for UI
import { FaFileSignature } from "react-icons/fa"; 
// Importing Tick icon for indicating success/completion
import { TiTick } from "react-icons/ti"; 
// Importing ReviewPage component for reviewing the application
import ReviewPage from "./ReviewPage"; 
// Importing Link for navigation
import { Link } from "react-router-dom"; 
// Importing styles for step progress bar
import "react-step-progress-bar/styles.css"; 
// Importing useSelector hook to access Redux store
import { useSelector } from "react-redux"; 
// Importing useNavigate hook for programmatic navigation
import { useNavigate } from "react-router-dom"; 
// Importing JobDetails context for accessing job-related data
import { useJobDetails } from "@/context/JobDetailsContext";
// Importing toast notifications for user feedback 
import { toast } from "react-hot-toast"; 

const ApplyForm = ({ setRight }) => {
  // Accessing user details from Redux store
  const { user } = useSelector((state) => state.auth);
  console.log("user",user);
  const navigate = useNavigate();
  // Accessing selected job details from context
  const { selectedJob } = useJobDetails();

  // Checking if the user has already applied for the job
  const isApplied =
    selectedJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  useEffect(() => {
    // Redirect to login page if the user is not authenticated
    if (!user) {
      navigate("/login");
    } else {
      // Notify and redirect if the user has already applied for this job
      if (isApplied) {
        toast("You have already applied for this job.");
        navigate("/");
      }
    }
  }, []);

  // Step management for multi-step form
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [review, setReview] = useState(false);

  // Cover letter state management
  const [coverLetter, setCoverLetter] = useState(true);
  const [showCoverLetterError, setShowCoverLetterError] = useState(false);

  // State to store uploaded file URL
  const [fileURL, setFileURL] = useState(null);
  const [fileType, setFileType] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  const maxChars = 750;

  // Function to handle character limit restriction
  const handleCharLimitChange = (e, field) => {
    console.log(e.key);
    if (e.key === "Backspace") {
      return;
    }
    const text = e.target.value; // Get the input text
    const charCount = text.length; // Count characters

    if (charCount <= maxChars) {
      setInput((prev) => ({
        ...prev,
        [field]: text, // Update state dynamically based on the field name
      }));

      if (field === "coverLetter") {
        setShowCoverLetterError(text.trim() === "");
      }
    } else {
      // Show toast message if the character limit is exceeded
      toast.error(
        `${
          field === "experience" ? "Experience" : "Cover letter"
        } cannot exceed ${maxChars} characters!`
      );
    }
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors as user types
  };

  // Validate Step 1 fields
  const validateStep1 = () => {
    const newErrors = {};
    if (!input.fullname.trim()) newErrors.fullname = "Full Name is required.";
    if (!input.number.trim()) newErrors.number = "Phone Number is required.";
    if (!input.email.trim()) newErrors.email = "Email is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handles transition from Step 1 to Step 2
const handleContinue1 = (e) => {
  console.log("for resume",input);
  e.preventDefault();
  if (validateStep1()) { // Validates Step 1 before proceeding
    setStep1(false);
    setStep2(true);
  }
};

// Handles transition from Step 2 to Step 3
const handleContinue2 = (e) => {
  e.preventDefault();
  if (input.resume) { // Ensures a resume is uploaded before proceeding
    setStep2(false);
    setStep3(true);
  } else {
    setErrors({ resume: "Resume is required to proceed." }); // Displays error if resume is missing
  }
};

// Handles transition from Step 3 to Step 4
const handleContinue3 = (e) => {
  e.preventDefault();
  setStep3(false);
  setStep4(true);
};

// Moves to the review step after completing all steps
const handleReview = () => {
  setStep4(false);
  setReview(true);
  setRight(false); // Hides the right panel (if applicable)
};

// Returns from the review step back to Step 4
const handleReview1 = () => {
  setReview(false);
  setStep4(true);
};

// Handles cover letter selection (write or upload)
const handleCoverLetter = (option) => {
  if (option === "write") {
    setCoverLetter(true); // Enables writing a cover letter
  } else {
    setCoverLetter(false); // Disables writing and possibly enables upload
  }
};

// Stores user input data, initializing with existing user details if available
const [input, setInput] = useState({
  fullname: user?.fullname, // Pre-fills full name from user profile
  number: user?.phoneNumber.number, // Pre-fills phone number
  email: user?.emailId.email, // Pre-fills email
  city: user?.address?.city || "", // Defaults to empty if city is unavailable
  state: user?.address?.state || "", // Defaults to empty if state is unavailable
  country: user?.address?.country || "", // Defaults to empty if country is unavailable
  resume: user?.profile?.resume, // Pre-fills resume if available
  coverLetter: user?.profile?.coverLetter || "", // Pre-fills cover letter if available
  jobTitle: user?.profile?.experience?.jobProfile, // Pre-fills job title from experience
  experience: user?.profile?.experience?.experienceDetails, // Pre-fills experience details
  company: user?.profile?.experience?.companyName, // Pre-fills company name from experience
});

const handleFileChange = (e) => {
  const file = e.target.files[0]; // Get the uploaded file
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size exceeds 10MB. Please choose a smaller file.");
      return;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "pdf") {
      const fileUrl = URL.createObjectURL(file); // Generate URL for PDF preview
      setFileURL(fileUrl);
      setFileType("pdf"); // Set the file type
    } else {
      setFileURL(null); // No preview for non-PDF files
      setFileType(fileExtension);
    }

    setInput((prevData) => ({
      ...prevData,
      resume: file, // Update the resume field with the uploaded file
    }));
    
    setErrors({ ...errors, resume: "" }); // Clear any errors related to the file upload
  }
};


  return (
    <div>
      {step1 && (
        <div className="shadow-md rounded-md p-6 bg-white">
          <ProgressBar percent={20} filledBackground="green" />
          <div className="flex items-center mt-4">
            <h6 className="ml-2 text-sm text-gray-500">
              Application step 1 of 5
            </h6>
          </div>
          <h4 className="text-xl font-semibold my-4">
            Add your contact information
          </h4>
          <form>
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              onChange={handleChange}
              value={input.fullname}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.fullname && (
              <p className="text-red-600 text-sm">{errors.fullname}</p>
            )}

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="number"
              onChange={handleChange}
              value={input.number}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.number && (
              <p className="text-red-600 text-sm">{errors.number}</p>
            )}

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={input.email}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="flex space-x-4">
                {/* City */}
                <div className="flex-1">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    value={input.city || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* State */}
                <div className="flex-1">
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                    value={input.state || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Country */}
                <div className="flex-1">
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    onChange={handleChange}
                    value={input.country || ""}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start mt-4">
              <MdInfo className="text-gray-500 mr-2" />
              <p className="text-sm text-gray-600">
                Your online resume will also be updated with this contact
                information.
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Link
                to="/"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Return to job search
              </Link>

              <button
                onClick={handleContinue1}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Continue
              </button>
            </div>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            Having an issue with this application?{" "}
            <Link to="/contact" className="text-blue-700 cursor-pointer">
              Tell us more
            </Link>
          </p>
        </div>
      )}

      {/* Step 2 */}
      {step2 && (
        <div className=" bg-white p-6  shadow-md rounded-md flex flex-col">
          <ProgressBar percent={40} filledBackground="green" />
          <div className="flex items-center mt-4">
            <BiArrowBack
              className="text-gray-600 cursor-pointer text-2xl"
              onClick={() => {
                setStep2(false);
                setStep1(true);
              }}
            />
            <h6 className="ml-2 text-sm text-gray-500">
              Application step 2 of 5
            </h6>
          </div>
          <div className="mt-4">
          {fileURL || input.resume ? (
        <div className="h-96 flex flex-col items-center">
          {user.profile.resumeOriginalName.split(".").pop().toLowerCase() === "pdf" || fileType === "pdf" ? (
            <Viewer fileUrl={fileURL || input.resume} />
          ) : (
            <div className="text-center text-red-600 font-medium p-4 bg-red-100 rounded-lg">
              You uploaded a .docx or .doc file. It cannot be open here.  
              <br />
              <span className="font-bold">Go to Profile → Click "View Resume" to open it. and check it </span>
            </div>
          )}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() =>
                      document.getElementById("resume-upload").click()
                    }
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Update Resume
                  </button>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                  name="resume"
                />
              </div>
            ) : (
              <div className="mt-2 border-2 border-dashed border-blue-700 p-6 rounded-lg text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                  name="resume"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-blue-700 hover:text-blue-600"
                >
                  <svg
                    className="w-12 h-12 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16v1a3 3 0 003 3h4a3 3 0 003-3v-1M16 11l-4-4m0 0l-4 4m4-4v12"
                    ></path>
                  </svg>
                  <span className="text-sm leading-4 font-medium">
                    Drag & drop your resume here, or
                  </span>
                  <span className="px-3 py-2 border border-blue-700 text-blue-700 rounded-md bg-white hover:bg-indigo-50">
                    Browse
                  </span>
                  <span className="text-sm leading-4 font-medium">
                    Accepted formats: PDF, Word, Text, Excel (.pdf, .doc, .docx, .txt, .xls, .xlsx).
                  </span>
                </label>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-16">
            <Link
              to="/"
              className="text-blue-600 hover:underline text-sm justify-center font-medium"
            >
              Return to job search
            </Link>
            <button
              onClick={handleContinue2}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Continue
            </button>
          </div>

          <p className="text-sm text-center text-gray-600 mt-4">
            Having an issue with this application?{" "}
            <Link to="/contact" className="text-blue-700 cursor-pointer">
              Tell us more
            </Link>
          </p>
        </div>
      )}

      {step3 && (
        <div className="w-full p-6 bg-white shadow-md rounded-md">
          <ProgressBar percent={60} filledBackground="green" />

          <div className="flex items-center mt-4">
            <BiArrowBack
              className="text-gray-600 cursor-pointer text-2xl"
              onClick={() => {
                setStep3(false);
                setStep2(true);
              }}
            />
            <h6 className="ml-2 text-sm text-gray-500 my-4">
              Application step 3 of 5
            </h6>
          </div>

          <label
            htmlFor="jobTitle"
            className="block text-sm font-medium text-gray-700 mt-4"
          >
            Job Profile
          </label>
          <input
            type="text"
            name="jobTitle"
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={input.jobTitle}
          />

          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mt-4"
          >
            Company Name
          </label>
          <input
            type="text"
            name="company"
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={input.company}
          />

          <h4 className="text-lg font-bold mt-6">
            Add Your Experience{" "}
            <span className="text-gray-400">(optional)</span>
          </h4>

          <textarea
            name="experience"
            onChange={(e) => handleCharLimitChange(e, "experience")}
            rows="6"
            className="mt-4 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Add Experience..."
            value={input.experience}
          ></textarea>

          <p className="text-sm text-gray-600 mt-2">
            {input.experience ? input.experience.trim().length : 0} / {maxChars}{" "}
            characters
          </p>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Return to job search
            </Link>
            <button
              onClick={handleContinue3}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Continue
            </button>
          </div>

          <p className="text-sm text-center text-gray-600 mt-4">
            Having an issue with this application?{" "}
            <Link to="/contact" className="text-blue-700 cursor-pointer">
              Tell us more
            </Link>
          </p>
        </div>
      )}

      {step4 && (
        <div className="w-full p-6 bg-white shadow-md rounded-md">
          <ProgressBar percent={80} filledBackground="green" />

          <div className="flex items-center mt-4">
            <BiArrowBack
              className="text-gray-600 cursor-pointer text-2xl"
              onClick={() => {
                setStep4(false);
                setStep3(true);
              }}
            />
            <h6 className="ml-2 text-sm text-gray-500">
              Application step 4 of 5
            </h6>
          </div>

          <h3 className="text-lg font-bold mt-6">
            Want to include any supporting documents?
          </h3>

          <h4 className="text-lg font-bold mt-6">
            Cover letter <span className="text-gray-400">(optional)</span>
          </h4>

          <div
            className={`flex items-center p-4 border ${
              coverLetter ? "border-gray-300" : "border-blue-500"
            } rounded-md cursor-pointer mt-4`}
            onClick={() => handleCoverLetter("without")}
          >
            <CgFileRemove className="text-gray-500 mr-4" />
            <section className="flex-grow">
              <h5 className="text-base font-semibold">
                Apply without cover letter
              </h5>
              <p className="text-sm text-gray-500">
                Cover letter is optional for this job
              </p>
            </section>
            {!coverLetter && <TiTick className="text-green-500" />}
          </div>

          <div
            className={`flex items-center p-4 border ${
              coverLetter ? "border-blue-500" : "border-gray-300"
            } rounded-md cursor-pointer mt-4`}
            onClick={() => handleCoverLetter("write")}
          >
            <FaFileSignature className="text-gray-500 mr-4" />
            <section className="flex-grow">
              <h5 className="text-base font-semibold">Write cover letter</h5>
              <p className="text-sm text-gray-500">
                Explain how you're a good fit
              </p>
            </section>
            {coverLetter && <TiTick className="text-green-500" />}
          </div>

          {coverLetter && (
            <>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md mt-4"
                rows="6"
                placeholder="Write your cover letter here..."
                value={input.coverLetter}
                onChange={(e) => handleCharLimitChange(e, "coverLetter")}
              />
              <p className="text-sm text-gray-600 mt-2">
                {input.coverLetter ? input.coverLetter.trim().length : 0} /{" "}
                {maxChars} characters
              </p>
            </>
          )}

          {coverLetter && showCoverLetterError && (
            <p className="text-sm text-red-500 mt-2">
              Please provide a cover letter before proceeding.
            </p>
          )}

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Exit
            </Link>
            <button
              onClick={() => {
                if (
                  coverLetter &&
                  (!input.coverLetter || !input.coverLetter.trim())
                ) {
                  setShowCoverLetterError(true);
                } else {
                  handleReview();
                }
              }}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Review your application
            </button>
          </div>

          <p className="text-sm text-center text-gray-600 mt-4">
            Having an issue with this application?{" "}
            <Link to="/contact" className="text-blue-700 cursor-pointer">
              Tell us more
            </Link>
          </p>
        </div>
      )}

      {review && (
        <ReviewPage
          input={input}
          handleReview1={handleReview1}
          fileURL={fileURL}
          fileType={fileType}
          user={user}
        />
      )}
    </div>
  );
};

export default ApplyForm;