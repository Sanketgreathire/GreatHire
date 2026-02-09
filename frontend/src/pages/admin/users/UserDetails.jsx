// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";
import ApplicationList from "./ApplicationList";
import Navbar from "@/components/admin/Navbar";
import { Badge } from "../../../components/ui/badge";
import { useParams } from "react-router-dom";
import { ADMIN_USER_DATA_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";

const UserDetails = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${ADMIN_USER_DATA_API_END_POINT}/getUser/${userId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.log(`Error in fetching user data: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${ADMIN_USER_DATA_API_END_POINT}/user-all-application/${userId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (err) {
      console.log(`Error in fetching user applications: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchApplications();
  }, []);

  const isValidImageURL = (url) => {
    try {
      const parsed = new URL(url);
      return (
        ["https:", "http:"].includes(parsed.protocol) &&
        /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(parsed.pathname)
      );
    } catch {
      return false;
    }
  };

  return (
    <>
      <Navbar linkName="User Details" />

      <div className="m-3 sm:m-4 p-3 sm:p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT : USER DETAILS */}
          {loading ? (
            <p className="text-xl text-blue-700">Loading...</p>
          ) : (
            <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-300 lg:pr-6 pb-6 lg:pb-0">
              <div className="flex flex-col items-center text-center">
                <img
                  src={
                    isValidImageURL(user?.profile?.profilePhoto)
                      ? encodeURI(user.profile.profilePhoto)
                      : "/default-profile.png"
                  }
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
                />
                <h2 className="mt-4 text-xl sm:text-2xl font-bold">
                  {user?.fullname}
                </h2>
                <p className="text-gray-600 break-all">
                  {user?.emailId?.email}
                </p>
              </div>

              {/* Contact */}
              <div className="mt-6 space-y-1">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {user?.phoneNumber?.number}
                </p>
                <p className="break-words">
                  <span className="font-medium">Address:</span>{" "}
                  {user?.address?.city}, {user?.address?.state},{" "}
                  {user?.address?.country}
                </p>
              </div>

              {/* About */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold">About Me</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {user?.profile?.bio}
                </p>
              </div>

              {/* Professional Details */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Professional Details
                </h3>

                {user?.profile?.coverLetter && (
                  <div>
                    <h4 className="font-semibold">Cover Letter</h4>
                    <p className="text-sm text-gray-700 max-h-32 overflow-y-auto p-2 border rounded">
                      {user.profile.coverLetter}
                    </p>
                  </div>
                )}

                {user?.profile?.experience && (
                  <div className="text-sm space-y-1">
                    <h4 className="font-semibold">Experience</h4>
                    <p>
                      <span className="font-medium">Company:</span>{" "}
                      {user.profile.experience.companyName}
                    </p>
                    <p>
                      <span className="font-medium">Job Profile:</span>{" "}
                      {user.profile.experience.jobProfile}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {user.profile.experience.duration}
                    </p>
                    <div>
                      <span className="font-medium">Details:</span>
                      <p className="max-h-32 overflow-y-auto text-gray-700">
                        {user.profile.experience.experienceDetails}
                      </p>
                    </div>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Skills
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.isArray(user?.profile?.skills) &&
                    user.profile.skills.length > 0 ? (
                      user.profile.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 hover:bg-gray-200 text-blue-800 px-3 py-1 rounded-md text-sm"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-600">
                        No skills listed
                      </span>
                    )}
                  </div>
                </div>

                {/* Resume */}
                {user?.profile?.resume && (
                  <div>
                    <h4 className="font-semibold">Resume</h4>
                    <a
                      href={encodeURI(user.profile.resume)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {user.profile.resumeOriginalName || "View Resume"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT : APPLICATION LIST */}
          <div className="lg:w-2/3">
            {loading ? (
              <p className="text-xl text-blue-700">Loading...</p>
            ) : (
              <ApplicationList applications={applications} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
