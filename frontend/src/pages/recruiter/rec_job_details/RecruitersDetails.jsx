import React, { useEffect, useState } from "react";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MdOutlineVerified, MdWorkOutline } from "react-icons/md";
import RecruiterJobs from "./RecruiterJobs";
import Navbar from "@/components/admin/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

const RecruitersDetails = () => {
  const [loading, setLoading] = useState(false);
  const [recruiterDetails, setRecruiterDetails] = useState(null);
  const { recruiterId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

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

  const getSafeImageUrl = (url) => {
    if (!url) return "https://github.com/shadcn.png";
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        return encodeURI(url);
      }
    } catch {
      return "https://github.com/shadcn.png";
    }
    return "https://github.com/shadcn.png";
  };

  return (
    <>
      <Helmet>
        <title>
          Recruiter Profile & Job Postings Management | Admin Dashboard – GreatHire
        </title>

        <meta
          name="description"
          content="View and manage detailed recruiter profiles with complete hiring insights across Hyderabad State through GreatHire’s advanced admin dashboard. This powerful interface enables administrators to review recruiter credentials, verification status, company associations, and active job postings from a centralized platform. Track recruiter performance, monitor job activity, validate contact details, and ensure hiring compliance with ease. Designed for scalability and transparency, GreatHire helps organizations streamline recruitment operations, improve decision-making, and maintain full control over recruiter-driven hiring workflows."
        />
      </Helmet>

      {user?.role !== "recruiter" && <Navbar linkName="Recruiter Details" />}

      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-10">
        {loading ? (
          <div className="text-2xl font-semibold text-gray-600">Loading...</div>
        ) : recruiterDetails ? (
          <div className="w-full max-w-6xl space-y-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg text-white p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={getSafeImageUrl(recruiterDetails?.profile?.profilePhoto)}
                alt="Recruiter"
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
              />
              <div className="flex flex-col justify-center space-y-2">
                <h2 className="text-3xl font-bold tracking-wide">
                  {recruiterDetails?.fullname}
                </h2>
                <p className="text-sm text-blue-100">
                  {recruiterDetails?.position || "Recruiter"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {recruiterDetails?.emailId?.email}
                  </span>
                  {recruiterDetails?.emailId?.isVerified && (
                    <MdOutlineVerified className="text-green-300" size={22} />
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Contact Information
                  </h3>
                  <p className="text-gray-600">
                    <strong>Email:</strong> {recruiterDetails?.emailId?.email}
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong>{" "}
                    {recruiterDetails?.phoneNumber?.number || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone Verified:</strong>{" "}
                    <span
                      className={
                        recruiterDetails?.phoneNumber?.isVerified
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {recruiterDetails?.phoneNumber?.isVerified
                        ? "Yes"
                        : "No"}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Company Details
                  </h3>
                  <p className="text-gray-600">
                    <strong>Company:</strong>{" "}
                    {company?.companyName || recruiterDetails?.companyName}
                  </p>
                  <p className="text-gray-600">
                    <strong>Company Created:</strong>{" "}
                    {recruiterDetails?.isCompanyCreated ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Account Status:</strong>{" "}
                    <span
                      className={
                        recruiterDetails?.isActive
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {recruiterDetails?.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Additional Info
                  </h3>
                  <p className="text-gray-600">
                    <strong>Role:</strong> {recruiterDetails?.role}
                  </p>
                  <p className="text-gray-600">
                    <strong>Recruiter ID:</strong> {recruiterId}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Corporate Job Section */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <MdWorkOutline className="text-blue-600" size={26} />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Recruiter’s Job Postings
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <RecruiterJobs recruiterId={recruiterId} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xl font-semibold text-gray-500">
            No recruiter details found.
          </div>
        )}
      </div>
    </>
  );
};

export default RecruitersDetails;
