import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "@/components/admin/Navbar";

const JobDetail = () => {
  const { id } = useParams();
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });

        if (!response.data.success) {
          setError(response.data.message || "Job details not found.");
          setJobDetails(null);
          return;
        }
        setJobOwner(response?.data.job.created_by);
        setJobDetails(response.data.job.jobDetails);
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (id && !jobDetails) {
      fetchJobDetails();
    }
  }, [id]);

  const deleteJob = async (jobId) => {
    try {
      dsetLoading(true);
      const response = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobId}`,
        {
          data: { companyId: company._id }, // Send companyId in request body
          withCredentials: true,
        }
      );

      if (response.data.success) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJob({ ...editedJob, [name]: value });
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        { editedJob, companyId: company?._id },
        { withCredentials: true }
      );
      if (response.data.success) {
        setJobDetails(response.data.updatedJob.jobDetails);
        setEditMode(false);
        toast.success("Job updated successfully 😊");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditedJob(jobDetails); // Populate editedJob with jobDetails
    setEditMode(true);
  };

  if (loading)
    return (
      <p className="text-gray-600 text-xl animate-pulse">
        Loading job details...
      </p>
    );
  if (error) return <p className="text-red-500 text-lg">{error}</p>;

  return (
    <>
    {user?.role !== "recruiter" && <Navbar linkName={"Job Details"}/>}
      <div className={`flex flex-col space-y-4 p-6 md:p-10 min-h-screen ${user?.role !== "recruiter" && "bg-white m-4"}`}>
        {/* Job Header */}
        <div className={`${user?.role !== "recruiter" ? "bg-blue-700 text-white":"bg-blue-200"} p-6 rounded-lg shadow-md relative`}>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center hover:underline text-2xl p-2"
          >
            ←
          </button>
          {user?.role === "recruiter" && (
            <button onClick={handleEdit} className="absolute right-4">
              <Pencil className="h-5 w-5 text-black cursor-pointer" />
            </button>
          )}
          <h1 className="text-3xl font-bold">{jobDetails?.title}</h1>
          <p className="text-lg">
            {jobDetails?.companyName || "Company not specified"}
          </p>
          <p className="text-sm mb-2">
            {jobDetails?.location || "Location Not Available"}
          </p>
          {editMode ? (
            <input
              type="text"
              name="salary"
              value={editedJob.salary || ""}
              onChange={handleInputChange}
              className="w-full p-2 rounded"
            />
          ) : (
            <p className="text-lg font-semibold">
              {jobDetails?.salary
                .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                .split("-")
                .map((part, index) => (
                  <span key={index}>
                    ₹{part.trim()}
                    {index === 0 ? " - " : ""}
                  </span>
                ))}{" "}
              monthly
            </p>
          )}
        </div>

        {/* Job Description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Job Description
          </h2>
          {editMode ? (
            <textarea
              name="details"
              value={editedJob.details || ""}
              onChange={handleInputChange}
              className="w-full p-2 rounded border"
              rows={3}
            />
          ) : (
            <p className="text-gray-600 text-lg">
              {jobDetails?.details || "No description provided."}
            </p>
          )}
        </div>

        {/* Benefits and Responsibilities */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* Benefits Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Benefits</h3>
            {editMode ? (
              <textarea
                name="benefits"
                value={editedJob.benefits ? editedJob.benefits.join("\n") : ""}
                onChange={(e) =>
                  setEditedJob({
                    ...editedJob,
                    benefits: e.target.value.split("\n"),
                  })
                }
                className="w-full p-2 rounded border"
                rows={3} // Adjusted for better visibility
              />
            ) : (
              <ul className="list-disc list-inside text-gray-600">
                {jobDetails?.benefits?.length > 0 ? (
                  jobDetails.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))
                ) : (
                  <li>Not specified</li>
                )}
              </ul>
            )}
          </div>

          {/* Responsibilities Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Responsibilities
            </h3>
            {editMode ? (
              <textarea
                name="responsibilities"
                value={
                  editedJob.responsibilities
                    ? editedJob.responsibilities.join("\n")
                    : ""
                }
                onChange={(e) =>
                  setEditedJob({
                    ...editedJob,
                    responsibilities: e.target.value.split("\n"),
                  })
                }
                className="w-full p-2 rounded border"
                rows={3} // Adjusted for better visibility
              />
            ) : (
              <ul className="list-disc list-inside text-gray-600">
                {jobDetails?.responsibilities?.length > 0 ? (
                  jobDetails.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))
                ) : (
                  <li>Not specified</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Additional Details
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700">Job Type</h4>
              {editMode ? (
                <input
                  type="text"
                  name="jobType"
                  value={editedJob.jobType || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border"
                />
              ) : (
                <p className="text-gray-600">
                  {jobDetails?.jobType || "Not specified"}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">No. of Openings</h4>
              {editMode ? (
                <input
                  type="number"
                  name="numberOfOpening"
                  value={editedJob.numberOfOpening || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border"
                />
              ) : (
                <p className="text-gray-600">
                  {jobDetails?.numberOfOpening || "Not specified"}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Working Days</h4>
              {editMode ? (
                <input
                  type="text"
                  name="duration"
                  value={editedJob.duration || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border"
                />
              ) : (
                <p className="text-gray-600">
                  {jobDetails?.duration || "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Job Requirements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Job Requirements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700">Qualifications</h4>
              {editMode ? (
                <input
                  type="text"
                  name="qualifications"
                  value={editedJob.qualifications || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border"
                />
              ) : (
                <p className="text-gray-600">
                  {jobDetails?.qualifications?.join(", ") || "Not specified"}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Experience</h4>
              {editMode ? (
                <input
                  type="text"
                  name="experience"
                  value={editedJob.experience || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border"
                />
              ) : (
                <p className="text-gray-600">
                  {jobDetails?.experience || "Not specified"} years
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Skills</h4>
              {editMode ? (
                <input
                  type="text"
                  name="skills"
                  value={editedJob.skills || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border"
                />
              ) : (
                <p className="text-gray-600">
                  {jobDetails?.skills?.join(", ") || "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end space-x-2">
          {!editMode ? (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (user.role === "recruiter")
                    navigate(`/recruiter/dashboard/applicants-details/${id}`);
                  else navigate(`/admin/applicants-list/${id}`);
                }}
              >
                Applicants List
              </Button>
              {(user?._id === jobOwner ||
                user?.emailId?.email === company?.adminEmail || user?.role === "admin" || user?.role === "Owner") && (
                <Button
                  className={`bg-red-600 hover:bg-red-700 ${
                    dloading ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() => deleteJob(id)}
                  disabled={dloading}
                >
                  {dloading ? "Deleting..." : "Delete"}
                </Button>
              )}
            </>
          ) : (
            // Save & Cancel Buttons in Edit Mode
            <div className="flex space-x-4">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleSave();
                  handleCancel();
                }}
                disabled={saveLoading}
              >
                {saveLoading ? "Saving...." : "Save"}
              </Button>
              <Button
                className="bg-gray-600 hover:bg-gray-700"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobDetail;
