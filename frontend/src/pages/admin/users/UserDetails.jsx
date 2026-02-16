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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="m-3 sm:m-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT : USER DETAILS */}
            {loading ? (
              <p className="text-xl text-blue-700 dark:text-blue-400">Loading...</p>
            ) : (
              <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700 lg:pr-6 pb-6 lg:pb-0">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      isValidImageURL(user?.profile?.profilePhoto)
                        ? encodeURI(user.profile.profilePhoto)
                        : "/default-profile.png"
                    }
                    alt="Profile"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-lg"
                  />
                  <h2 className="mt-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.fullname}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 break-all">
                    {user?.emailId?.email}
                  </p>
                </div>

                {/* Contact */}
                <div className="mt-6 space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Contact Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">Phone:</span>{" "}
                    {user?.phoneNumber?.number}
                  </p>
                  <p className="break-words text-gray-700 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">Address:</span>{" "}
                    {user?.address?.city}, {user?.address?.state},{" "}
                    {user?.address?.country}
                  </p>
                </div>

                {/* About */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    About Me
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {user?.profile?.bio}
                  </p>
                </div>

                {/* Professional Details */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Professional Details
                  </h3>

                  {user?.profile?.coverLetter && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Cover Letter</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50">
                        {user.profile.coverLetter}
                      </p>
                    </div>
                  )}

                  {user?.profile?.experience && (
                    <div className="text-sm space-y-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Experience</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">Company:</span>{" "}
                        {user.profile.experience.companyName}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">Job Profile:</span>{" "}
                        {user.profile.experience.jobProfile}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">Duration:</span>{" "}
                        {user.profile.experience.duration}
                      </p>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Details:</span>
                        <p className="max-h-32 overflow-y-auto text-gray-700 dark:text-gray-300 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 mt-1">
                          {user.profile.experience.experienceDetails}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
                      Skills
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.isArray(user?.profile?.skills) &&
                      user.profile.skills.length > 0 ? (
                        user.profile.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resume */}
                  {user?.profile?.resume && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Resume</h4>
                      <a
                        href={encodeURI(user.profile.resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline break-all transition-colors"
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
                <p className="text-xl text-blue-700 dark:text-blue-400">Loading...</p>
              ) : (
                <ApplicationList applications={applications} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;