import { useEffect, useState, useCallback } from "react";
import ApplicationList from "./ApplicationList";
import Navbar from "@/components/admin/Navbar";
import { Badge } from "../../../components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ADMIN_USER_DATA_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Newest experience first
  const primaryExperience =
    user?.profile?.experiences?.[0] || user?.profile?.experience || null;
  const isFresher = user?.profile?.hasExperience === false && !primaryExperience;

  const fetchAll = useCallback(async (signal) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userRes, appRes] = await Promise.all([
        axios.get(`${ADMIN_USER_DATA_API_END_POINT}/getUser/${userId}`, {
          withCredentials: true,
          signal,
        }),
        axios.get(`${ADMIN_USER_DATA_API_END_POINT}/user-all-application/${userId}`, {
          withCredentials: true,
          signal,
        }),
      ]);

      if (userRes.data.success) setUser(userRes.data.data);
      if (appRes.data.success) setApplications(appRes.data.data || []);
    } catch (err) {
      // Ignore cancellation errors (user navigated away)
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      console.error("Error fetching user details:", err);
      setError("Failed to load user details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAll(controller.signal);
    return () => controller.abort();
  }, [fetchAll]);

  return (
    <>
      <Navbar linkName="User Details" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="ps-8 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-green-700 text-white text-md font-semibold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <IoIosArrowRoundBack size={25} />
            Back
          </button>
        </div>
        <div className="m-3 sm:m-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading user details...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => fetchAll()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* LEFT : USER DETAILS */}
              <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700 lg:pr-6 pb-6 lg:pb-0">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      user?.profile?.profilePhoto ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullname || "User"
                      )}&background=3b82f6&color=fff&size=200`
                    }
                    alt={user?.fullname || "Profile"}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-lg bg-gray-100 dark:bg-gray-700"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullname || "User"
                      )}&background=3b82f6&color=fff&size=200`;
                    }}
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
                    {user?.address?.city}, {user?.address?.state}, {user?.address?.country}
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

                  {primaryExperience ? (
                    <div className="text-sm space-y-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Experience</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">Company:</span>{" "}
                        {primaryExperience.companyName}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">Job Profile:</span>{" "}
                        {primaryExperience.jobProfile}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-gray-900 dark:text-white">Duration:</span>{" "}
                        {primaryExperience.duration}
                      </p>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Details:</span>
                        <p className="max-h-32 overflow-y-auto text-gray-700 dark:text-gray-300 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 mt-1">
                          {primaryExperience.experienceDetails}
                        </p>
                      </div>
                    </div>
                  ) : isFresher ? (
                    <div className="text-sm">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Experience</h4>
                      <p className="text-gray-700 dark:text-gray-300">Fresher (no work experience)</p>
                    </div>
                  ) : null}

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
                      Skills
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0 ? (
                        user.profile.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">No skills listed</span>
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

              {/* RIGHT : APPLICATION LIST */}
              <div className="lg:w-2/3">
                <ApplicationList applications={applications} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;