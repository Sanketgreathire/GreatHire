// Importing React and necessary hooks for state management and side effects
import React, { useState } from "react";
// Importing back arrow icon
import { BiArrowBack } from "react-icons/bi"; 
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
// PDF viewer for previewing documents
import { Viewer } from "@react-pdf-viewer/core"; 
import "@react-pdf-viewer/core/lib/styles/index.css";
// Notification library
import { toast } from "react-hot-toast"; 
// Axios for making HTTP requests
import axios from "axios"; 
// API endpoint for application submission
import { APPLICATION_API_END_POINT } from "@/utils/ApiEndPoint"; 
// Redux action to update user state
import { setUser } from "@/redux/authSlice"; 
// Custom hook for job details context
import { useJobDetails } from "@/context/JobDetailsContext"; 
// Progress bar for form steps
import { ProgressBar } from "react-step-progress-bar"; 
import "react-step-progress-bar/styles.css";

const ReviewPage = ({ handleReview1, input, fileURL,fileType,user,filename }) => {
  const dispatch = useDispatch(); // Redux dispatcher to update global state
  const [loading, setLoading] = useState(false); // State to manage loading status
  const navigate = useNavigate(); // React Router navigation hook
  const { jobId } = useParams(); // Extract job ID from URL parameters
  const { addApplicationToJob } = useJobDetails(); // Context function to add application to job

  // Function to handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData(); // Create a FormData object to handle file uploads
      Object.entries(input).forEach(([key, value]) => {
        formData.append(key, value); // Append form inputs to FormData
      });
      formData.append("jobId", jobId); // Append job ID to the request

      // Send form data to the backend API
      const response = await axios.post(
        `${APPLICATION_API_END_POINT}/apply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Include credentials for authentication
        }
      );

      if (response.data.success) {
        toast.success(response.data.message); // Show success notification
        dispatch(setUser(response.data.user)); // Update Redux user state
        addApplicationToJob(jobId, response.data.newApplication); // Add application to job context
        navigate("/success"); // Redirect to success page
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit the application."
      ); // Show error notification
      console.error("Error submitting application:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Component to display application info
  const InfoSection = ({ title, value }) => (
    <div>
      <p className="text-sm font-small">{title}</p>
      <h3 className="text-base text-gray-500">{value}</h3>
    </div>
  );


  return (
    <div className="flex justify-center flex-col p-6 bg-white shadow-lg rounded-lg w-full">
      <ProgressBar percent={100} filledBackground="green" />
      <div className="flex items-center mt-4 mb-4">
        <BiArrowBack
          className="text-gray-600 cursor-pointer text-2xl"
          onClick={handleReview1}
        />
        <h6 className="ml-2 text-sm text-gray-500">Application step 5 of 5</h6>
      </div>
      <h2 className="text-2xl font-semibold mb-6">
        Please review your application
      </h2>

      <h4 className="text-lg font-medium mb-4">Contact Information</h4>
      <div className="space-y-4 mb-6">
        <InfoSection title="Full Name" value={input.fullname} />
        <InfoSection title="Email Address" value={input.email} />
        <small className="text-xs text-gray-500 block mt-2">
          To mitigate fraud, Great Hire may mask your email address. If masked,
          the employer will see an address like{" "}
          <strong> Hr@greathire.in</strong>. Some employers, however, may still
          be able to unmask and see your actual email address.
        </small>
        <InfoSection
          title="Address"
          value={`${input.city}, ${input.state}, ${input.country}`}
        />
        <InfoSection title="Phone Number" value={input.number} />
      </div>

      <p className="text-gray-500 text-2xl mb-5">Resume</p>
      <div className="h-96">
        { filename.split(".").pop().toLowerCase() === "pdf" || fileType === "pdf"  ? (
            <Viewer fileUrl={fileURL || input.resume} />
                  ) : (
                    <div className="text-center text-red-600 font-medium p-4 bg-red-100 rounded-lg">
                      You uploaded a .docx or .doc file. It cannot be open here.  
                      <br />
                      <span className="font-bold">Go to Profile → Click "View Resume" to open it.  and check it.</span>
                    </div>
                  )}
      </div>

      <h4 className="text-lg font-medium mt-5 mb-5">Employee Questions</h4>
      <div className="space-y-4 mb-6">
        <InfoSection title="Job Profile" value={input.jobTitle} />
        <InfoSection title="Company Name" value={input.company} />
        <InfoSection title="Experience Details" value={input.experience} />
        <InfoSection title="Cover Letter" value={input.coverLetter} />
      </div>

      <div className="text-center mb-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${
            loading ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-600"
          } text-white px-6 py-2 rounded-md`}
        >
          {loading ? "Submitting..." : "Submit your application"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        Having an issue with this application?{" "}
        <Link to="/contact" className="underline text-blue-700 cursor-pointer">
          Tell us more
        </Link>
      </p>
    </div>
  );
};

export default ReviewPage;

