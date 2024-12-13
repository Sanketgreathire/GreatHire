import React, { useState, useRef } from "react";
import { ProgressBar } from "react-step-progress-bar";
import { MdInfo } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { CgFileRemove } from "react-icons/cg";
import { FaFileSignature } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import ReviewPage from "./ReviewPage";
import { Link } from "react-router-dom";

const ApplyForm = ({ setRight }) => {
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [review, setReview] = useState(false);
  const [coverLetter, setCoverLetter] = useState(true);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [resume, setResume] = useState("");
  const inputRef = useRef();

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContinue1 = (e) => {
    e.preventDefault();
    setStep1(false);
    setStep2(true);
  };

  const handleContinue2 = () => {
    setStep2(false);
    setStep3(true);
  };

  const handleContinue3 = (e) => {
    e.preventDefault();
    setStep3(false);
    setStep4(true);
  };

  const handleReview = () => {
    setStep4(false);
    setReview(true);
    setRight(false);
  };

  const handleReview1 = () => {
    setStep4(true);
  };

//   const handleChoose = () => {
//     inputRef.current.click();
//   };

  const handleChoose = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Handle file input change
  const handleChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file.name); // Update the resume name
    }
  };

  const handleCoverLetter = (option) => {
    if (option === "write") {
      setCoverLetter(true);
    } else {
      setCoverLetter(false);
      setCoverLetterText("");
    }
  };

  return (
    <div>
      {step1 && (
        <div className="w-full max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
          <ProgressBar percent={20} unfilledBackground="gray" />
          <h6 className="text-sm text-gray-500 mt-4">
            Application step 1 of 5
          </h6>
          <h4 className="text-xl font-semibold my-4">
            Add your contact information
          </h4>
          <form>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First name
            </label>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />

            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />

            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Phone number
            </label>
            <input
              type="text"
              name="phoneNumber"
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />

            <h4 className="text-sm font-medium mt-4">Email</h4>
            <p className="text-gray-600 text-sm">abc123@gmil.com</p>

            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              City, State <small className="text-gray-400">(optional)</small>
            </label>
            <input
              type="text"
              name="city"
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />

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
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Continue
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Having an issue with this application?{" "}
            <span className="text-blue-500 cursor-pointer">Tell us more</span>
          </p>
        </div>
      )}

      {step2 && (
        <div className="w-full max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
          <ProgressBar percent={40} unfilledBackground="gray" />

          <div className="flex items-center mt-4">
            <BiArrowBack
              className="text-gray-600 cursor-pointer"
              onClick={() => {
                setStep2(false);
                setStep1(true);
              }}
            />

            <h6 className="ml-2 text-sm text-gray-500">
              Application step 2 of 5
            </h6>
          </div>

          <h4 className="text-lg font-bold mt-6">Add a resume</h4>

          {/* Hidden File Input */}
          <input
            type="file"
            name="resume"
            onChange={handleChange1}
            ref={inputRef}
            className="hidden"
          />

          {/* Resume Upload Section */}
          <div
            className="flex items-center mt-6 p-4 border border-gray-300 rounded-md cursor-pointer"
            onClick={handleChoose}
          >
            <BsFileEarmarkArrowUp className="text-gray-500 mr-4" />
            <section>
              <h4 className="text-base font-semibold">
                {resume ? resume : "Upload resume"}
              </h4>
              <p className="text-sm text-gray-500">
                Use a pdf, docx, doc, rtf, or txt
              </p>
            </section>
            {resume && <TiTick className="text-green-500 ml-auto" />}
          </div>

          {/* <h4 className="text-lg font-bold mt-6">Add a resume </h4>

          <input
            type="file"
            name="resume"
            onChange={handleChange}
            ref={inputRef}
            className="hidden"
          />
          <div
            className="flex items-center mt-6 p-4 border border-gray-300 rounded-md cursor-pointer"
            onClick={handleChoose}
          >
            <BsFileEarmarkArrowUp className="text-gray-500 mr-4" />
            <section>
              <h4 className="text-base font-semibold">Upload resume</h4>
              <p className="text-sm text-gray-500">
                Use a pdf, docx, doc, rtf, or txt
              </p>
            </section>
            <TiTick className="text-green-500 ml-auto" />
          </div> */}

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Return to job search
            </Link>
            <button
              onClick={handleContinue2}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Continue
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Having an issue with this application?{" "}
            <span className="text-blue-500 cursor-pointer">Tell us more</span>
          </p>
        </div>
      )}

      {step3 && (
        <div className="w-full max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
          <ProgressBar percent={60} unfilledBackground="gray" />

          <div className="flex items-center mt-4">
            <BiArrowBack
              className="text-gray-600 cursor-pointer"
              onClick={() => {
                setStep3(false);
                setStep2(true);
              }}
            />

            <h6 className="ml-2 text-sm text-gray-500">
              Application step 3 of 5
            </h6>
          </div>

          <h4 className="text-lg font-bold mt-6">
            Add Your Experience<span className="text-gray-400">(optional)</span>
          </h4>

          <textarea
            name="experience"
            onChange={handleChange}
            rows="6"
            className="mt-4 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Add Experience..."
          ></textarea>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Return to job search
            </Link>
            <button
              onClick={handleContinue3}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Continue
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Having an issue with this application?{" "}
            <span className="text-blue-500 cursor-pointer">Tell us more</span>
          </p>
        </div>
      )}
      {step4 && (
        <div className="w-full max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
          <ProgressBar percent={80} unfilledBackground="gray" />

          <div className="flex items-center mt-4">
            <BiArrowBack
              className="text-gray-600 cursor-pointer"
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

          {/* Option to Apply Without Cover Letter */}
          <div
            className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer mt-4"
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

          {/* Option to Write Cover Letter */}
          <div
            className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer mt-4"
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

          {/* Textarea for Cover Letter */}
          {coverLetter && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md mt-4"
              rows="6"
              placeholder="Write your cover letter here..."
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(e.target.value)}
            />
          )}

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Exit
            </Link>
            <button
              onClick={handleReview}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Review your application
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Having an issue with this application?{" "}
            <span className="text-blue-500 cursor-pointer">Tell us more</span>
          </p>
        </div>
      )}

      {review && (
        <ReviewPage formData={formData} handleReview1={handleReview1} />
      )}
    </div>
  );
};

export default ApplyForm;
