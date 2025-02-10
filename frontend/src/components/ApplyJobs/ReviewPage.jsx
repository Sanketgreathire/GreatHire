import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { toast } from "react-hot-toast";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { setUser } from "@/redux/authSlice";
import { useJobDetails } from "@/context/JobDetailsContext";
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";

const ReviewPage = ({ handleReview1, input, fileURL }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { addApplicationToJob } = useJobDetails();

  const handleSubmit = async () => {
    setLoading(true); // Show loading indicator

    try {
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("number", input.number);
      formData.append("city", input.city); // Flattened structure for compatibility
      formData.append("state", input.state);
      formData.append("country", input.country);
      formData.append("coverLetter", input.coverLetter || "");
      formData.append("experience", input.experience || "");
      formData.append("jobTitle", input.jobTitle || "");
      formData.append("company", input.company || "");
      formData.append("jobId", jobId); // Add jobId to the request body
      if (input.resume instanceof File) {
        formData.append("resume", input.resume);
      }

      const response = await axios.post(
        `${APPLICATION_API_END_POINT}/apply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));
        addApplicationToJob(jobId, response.data.newApplication);
        navigate("/success"); // Navigate to success page or any other page
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit the application."
      );
      console.error("Error submitting application:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="flex justify-center flex-col p-6 bg-white shadow-lg rounded-lg w-full">
      <ProgressBar percent={100} filledBackground="green"/>
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
        <div>
          <p className="text-sm font-small">Full Name</p>
          <h3 className="text-base text-gray-500">{`${input.fullname}`}</h3>
        </div>
        <div>
          <p className="text-sm font-small">Email Address</p>
          <h3 className="text-base text-gray-500">{input.email}</h3>
          <small className="text-xs text-gray-500 block mt-2">
            To mitigate fraud, Great Hire may mask your email address. If
            masked, the employer will see an address like{" "}
            <strong> Hr@greathire.in</strong>. Some employers, however, may
            still be able to unmask and see your actual email address.
          </small>
        </div>
        <div>
          <p className="text-sm font-small">Address</p>
          <h3 className="text-base text-gray-500">
            {`${input.city}, ${input.state}, ${input.country}`}
          </h3>
        </div>
        <div>
          <p className="text-sm font-small">Phone Number</p>
          <h3 className="text-base text-gray-500">{input.number}</h3>
        </div>
      </div>

      <p className="text-gray-500 text-2xl mb-5">Resume</p>
      <div className="h-96">
        <Viewer fileUrl={fileURL || input.resume} />
      </div>

      <h4 className="text-lg font-medium mt-5 mb-5">Employee Questions</h4>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm font-small">Job Profile</p>
          <h3 className="text-base text-gray-500">{input?.jobTitle}</h3>
        </div>
        <div>
          <p className="text-sm font-small">Company Name</p>
          <h3 className="text-base text-gray-500">{input?.company}</h3>
        </div>
        <div>
          <p className="text-sm font-small">
             Experience Details
          </p>
          <h3 className="text-sm text-gray-500">{input?.experience}</h3>
        </div>

        <div>
          <p className="text-sm font-small">Cover Letter</p>
          <h3 className="text-sm text-gray-500">
            {input.coverLetter}
          </h3>
        </div>
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

