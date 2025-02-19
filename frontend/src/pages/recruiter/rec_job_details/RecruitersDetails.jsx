import React, { useEffect, useState } from "react";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MdOutlineVerified } from "react-icons/md";
import RecruiterJobs from "./RecruiterJobs";
import Navbar from "@/components/admin/Navbar";

const RecruitersDetails = () => {
  const [loading, setLoading] = useState(false);
  const [recruiterDetails, setRecruiterDetails] = useState(null);
  const { recruiterId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const fetchRecruiterDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${RECRUITER_API_END_POINT}/recruiter-by-id/${recruiterId}`
      );
      setRecruiterDetails(response.data.recruiter);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterDetails();
  }, [user]);

  // Function to validate and sanitize image URL
  const getSafeImageUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
        ? url
        : "https://github.com/shadcn.png";
    } catch (error) {
      return "https://github.com/shadcn.png";
    }
  };

  return (
    <>
      {user?.role !== "recruiter" && <Navbar linkName={"Recruiter Details"} />}
      <div className=" flex flex-col md:flex-row gap-2 p-6">
        {loading ? (
          <div className="text-xl font-semibold">Loading...</div>
        ) : recruiterDetails ? (
          <>
            <div className=" bg-white p-8 w-full md:w-1/3 rounded-lg shadow-lg flex flex-col space-y-2 h-fit">
              <div>
                <img
                  src={getSafeImageUrl(
                    recruiterDetails?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                  )}
                  alt={`${recruiterDetails.fullname}'s profile`}
                  className="w-32 h-32 rounded-full mx-auto"
                />
              </div>
              <h2 className="text-3xl text-center font-bold">
                {recruiterDetails?.fullname}
              </h2>
              <p className="text-gray-700 flex items-center gap-2 ">
                <span>
                  <strong>Email:</strong> {recruiterDetails?.emailId?.email}
                </span>
                <span
                  className={`${
                    recruiterDetails?.emailId?.isVerified
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {recruiterDetails?.emailId?.isVerified ? (
                    <MdOutlineVerified size={25} />
                  ) : (
                    "Not verified"
                  )}
                </span>
              </p>
              <p className="text-gray-700 flex items-center gap-2 ">
                <span>
                  <strong>Phone Number:</strong>{" "}
                  {recruiterDetails?.phoneNumber?.number || "N/A"}
                </span>
                {recruiterDetails?.phoneNumber?.number && (
                  <span
                    className={`${
                      recruiterDetails?.phoneNumber?.isVerified
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {recruiterDetails?.phoneNumber.isVerified ? (
                      <MdOutlineVerified size={25} />
                    ) : (
                      "Not verified"
                    )}
                  </span>
                )}
              </p>

              <p className="text-gray-700 ">
                <strong>Position:</strong>{" "}
                {recruiterDetails?.position || "Not specified"}
              </p>
              <p className="text-gray-700">
                <strong>Company Created:</strong>{" "}
                {recruiterDetails?.isCompanyCreated ? "Yes" : "No"}
              </p>
              <p className="text-gray-700 ">
                <strong>Account Status:</strong>{" "}
                <span
                  className={`${
                    recruiterDetails?.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {recruiterDetails?.isActive ? "Active" : "Inactive"}
                </span>
              </p>

              <p className="text-gray-700 ">
                <strong>Role:</strong> {recruiterDetails?.role}
              </p>
            </div>
            <div className="w-2/3">
              <RecruiterJobs recruiterId={recruiterId} />
            </div>
          </>
        ) : (
          <div className="text-xl font-semibold">No details found</div>
        )}
      </div>
    </>
  );
};

export default RecruitersDetails;
