import React, { useState, useEffect } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";
import { MdOutlineVerified } from "react-icons/md";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { updateCandidateCredits } from "@/redux/companySlice";
import {
  APPLICATION_API_END_POINT,
  VERIFICATION_API_END_POINT,
  COMPANY_API_END_POINT,
} from "@/utils/ApiEndPoint";

const applicantDetails = ({
  app,
  setApplicantDetailsModal,
  applicantId,
  jobId,
  user,
  setApplicants,
}) => {
  const [loading, setLoading] = useState(0);
  const [creditDeducted, setCreditDeducted] = useState(false);
  const { company } = useSelector((state) => state.company);
  const dispatch = useDispatch();

  // Deduct credit when viewing applicant details
  useEffect(() => {
    const deductCredit = async () => {
      if (creditDeducted || !company?._id) return;
      
      try {
        const response = await axios.post(
          `${COMPANY_API_END_POINT}/deduct-candidate-credit`,
          { companyId: company._id },
          { withCredentials: true }
        );
        
        if (response.data.success) {
          dispatch(updateCandidateCredits(response.data.remainingCredits));
          setCreditDeducted(true);
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message);
          setTimeout(() => setApplicantDetailsModal(false), 2000);
        }
      }
    };

    deductCredit();
  }, [company, creditDeducted, dispatch, setApplicantDetailsModal]);

  // Function to update the application status (Shortlisted or Rejected)
  const updateStatus = async (status) => {
    try {
      setLoading(status);
      const statusString = status === 1 ? "Shortlisted" : "Rejected";
      const response = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicantId}/update`,
        { status: statusString },
        { withCredentials: true }
      );
      if (response.data.success) {
        // Send email notification to the applicant about the status update
        const emailResponse = await axios.post(
          `${VERIFICATION_API_END_POINT}/send-email-applicants/${jobId}`,
          {
            email: app?.applicant?.emailId?.email,
            status: statusString,
          },
          { withCredentials: true }
        );
        if (emailResponse.data.success) {
          setApplicants((prevApp) =>
            prevApp.map((appl) =>
              appl._id === app._id ? { ...appl, status: statusString } : appl
            )
          );

          toast.success("Status Updated"); // Show success toast message
        }
      } else {
        toast.error("Status updation failed"); // Show error toast message if update fails
      }
    } catch (err) {
      toast.error("An error occurred while updating the status"); // Show error toast message
      console.error("Error updating status:", err);
    } finally {
      setLoading(0);
    }
  };

  return (
    <>
      <Helmet>
        {/* Meta Title */}
        <title>
          Applicant Details | GreatHire's Candidate Profile Review, and Hiring Insights
        </title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Assess the full information of applicants on the recruitment platform, GreatHire, a smart recruitment system functioning in the region of Hyderabad, the India State. The “Applicant Details” interface gives a full briefing on the candidates, comprising their personal information, contacts, application status in a job, and analysis of their profiles. With a focus on exactness, speed, and ease of understanding, GreatHire is designed to give the hiring team the ability to shortlist the most appropriate candidates, decrease the time span for recruiting, and create a better workforce."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center my-4 py-8">
        <div className="w-11/12 max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-14">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <IoArrowBackSharp
              onClick={() => setApplicantDetailsModal(false)}
              className="cursor-pointer text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
              size={25}
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Applicant Details
            </h1>
          </div>

          {/* applicant Overview */}
          <div className="flex items-center mb-6">
            {app?.applicant?.profile?.profilePhoto && (
              <img
                src={app?.applicant?.profile?.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full mr-4 object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                {app?.applicant?.fullname}
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Personal Details
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="font-semibold">Full Name:</span>
                  {app?.applicant?.fullname}
                </p>
                <p className="text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-2 break-all">
                  <span className="font-semibold">Email:</span>
                  <span className="break-all">{app?.applicant?.emailId?.email}</span>
                  {app?.applicant?.emailId?.isVerified && (
                    <MdOutlineVerified size={20} color="green" title="Verified" />
                  )}
                </p>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="font-semibold">Phone:</span>
                  <span>{app?.applicant?.phoneNumber?.number}</span>
                  {app?.applicant?.phoneNumber?.isVerified && (
                    <MdOutlineVerified size={20} color="green" title="Verified" />
                  )}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Address:</span>{" "}
                  {app?.applicant?.address?.city},{" "}
                  {app?.applicant?.address?.state},{" "}
                  {app?.applicant?.address?.country}
                </p>
              </div>
            </div>

            {/* Salary Details */}
            {app?.applicant?.profile?.currentCTC &&
              app?.applicant?.profile?.expectedCTC && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Salary Details
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Current CTC:</span> ₹
                      {app?.applicant?.profile.currentCTC.toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Expected CTC:</span> ₹
                      {app?.applicant?.profile.expectedCTC.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

            {/* Skills */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pb-2">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {app?.applicant?.profile?.skills?.length > 0 ? (
                  app?.applicant.profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 hover:bg-blue-200 px-4 py-2 text-blue-800 rounded-lg font-medium text-sm dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">No skills listed</span>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex flex-col space-y-2">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Profile</h2>
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                {app?.applicant?.profile?.bio && (
                  <div className="mb-3">
                    <span className="font-semibold">Bio: </span>
                    <span>{app?.applicant.profile.bio}</span>
                  </div>
                )}
                {app?.applicant?.profile?.coverLetter && (
                  <div>
                    <span className="font-semibold">Cover Letter: </span>
                    <span>{app?.applicant.profile.coverLetter}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Experience Details */}
            {app?.applicant?.profile?.experience && (
              <div className="flex flex-col space-y-2">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Experience
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 flex flex-col space-y-1">
                  <span className="font-semibold">Company Name:</span>{" "}
                  <span>{app?.applicant.profile.experience.companyName}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 flex flex-col space-y-1">
                  <span className="font-semibold">Job Profile:</span>{" "}
                  <span>{app?.applicant?.profile.experience.jobProfile}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 flex flex-col space-y-1">
                  <span className="font-semibold">Duration:</span>{" "}
                  <span>
                    {app?.applicant?.profile.experience.duration} year(s)
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 flex flex-col space-y-1">
                  <span className="font-semibold">Details:</span>{" "}
                  <span>
                    {app?.applicant?.profile.experience.experienceDetails}
                  </span>
                </p>
              </div>
            )}

            {/* Resume */}
            {app?.applicant?.profile?.resume && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Resume</h2>
                <a
                  href={app.applicant.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {app.applicant.profile.resumeOriginalName || "View Resume"}
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {user?.role === "recruiter" && app.status === "Pending" ? (
            <div className="mt-6 flex justify-end gap-4">
              <button
                className={`px-6 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg shadow hover:bg-green-600 dark:hover:bg-green-700 transition-colors ${(loading === 1 || loading === -1) && "cursor-not-allowed opacity-50"
                  }`}
                disabled={loading === 1 || loading === -1}
                onClick={() => updateStatus(1)}
              >
                {loading === 1 ? "Updating..." : "Shortlist"}
              </button>
              <button
                className={`px-6 py-2 bg-red-500 text-white dark:bg-red-600 dark:text-white rounded-lg shadow hover:bg-red-600 dark:hover:bg-red-700 transition-colors ${(loading === 1 || loading === -1) && "cursor-not-allowed opacity-50"
                  }`}
                disabled={loading === 1 || loading === -1}
                onClick={() => updateStatus(-1)}
              >
                {loading === -1 ? "Updating..." : "Reject"}
              </button>
            </div>
          ) : (
            <p
              className={`flex justify-end mt-6 font-semibold ${app.status === "Shortlisted" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
            >
              {app.status}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default applicantDetails;