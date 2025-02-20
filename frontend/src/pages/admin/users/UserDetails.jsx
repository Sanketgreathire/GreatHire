import React, { useEffect, useState } from "react";
import ApplicationList from "./ApplicationList";
import Navbar from "@/components/admin/Navbar";
import { Badge } from "../../../components/ui/badge";
import { useParams } from "react-router-dom";
import { ADMIN_USER_DATA_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";

const getSafeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" ? url : "#";
  } catch {
    return "#";
  }
};

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${ADMIN_USER_DATA_API_END_POINT}/getUser/${userId}`
      );
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.log(`error in fetch user data ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${ADMIN_USER_DATA_API_END_POINT}/user-all-application/${userId}`
      );
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (err) {
      console.log(`error in fetch user data ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchApplications();
  }, []);

  return (
    <>
      <Navbar linkName="User Details" />
      <div className="flex shadow-md rounded-lg flex-col md:flex-row bg-white m-4 p-4">
        {loading ? (
          <p className="text-2xl text-blue-700">Loading...</p>
        ) : (
          <div className="md:w-1/3 border-r-2 border-gray-300 md:pr-6">
            <div className="flex flex-col items-center">
              {user ? (
                <div className="flex flex-col items-center">
                  <img
                    src={user.profile?.profilePhoto ? encodeURI(user.profile.profilePhoto) : "/default-profile.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <h2 className="mt-4 text-2xl font-bold">{user?.fullname || "Unknown User"}</h2>
                  <p className="text-gray-600">{user?.emailId?.email || "No email available"}</p>
                </div>
              ) : (
                <p className="text-2xl text-blue-700">Loading profile...</p>
              )}
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Contact Information</h3>
                <p>
                  <span className="font-medium">Phone:</span> {user?.phoneNumber?.number}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {user?.address?.city}, {user?.address?.state}, {user?.address?.country}
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold">About Me</h3>
                <p className="text-gray-700">{user?.profile?.bio}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Professional Details</h3>
                {user?.profile?.coverLetter && (
                  <div className="mt-2">
                    <h4 className="text-lg font-semibold">Cover Letter</h4>
                    <p className="text-gray-700 h-24 overflow-y-scroll p-2">{user?.profile?.coverLetter}</p>
                  </div>
                )}
                {user?.profile?.experience && (
                  <div className="mt-2">
                    <h4 className="text-lg font-semibold">Experience</h4>
                    <p>
                      <span className="font-bold">Company:</span> {user?.profile?.experience.companyName}
                    </p>
                    <p>
                      <span className="font-bold">Job Profile:</span> {user?.profile?.experience.jobProfile}
                    </p>
                    <p>
                      <span className="font-bold">Duration:</span> {user?.profile?.experience.duration}
                    </p>
                    <span className="font-bold">Details:</span>
                    <p className="h-28 overflow-y-scroll">{user?.profile?.experience.experienceDetails}</p>
                  </div>
                )}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Skills</h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {user?.profile?.skills?.length > 0 ? (
                      user?.profile.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 hover:bg-gray-200 px-4 py-2 text-blue-800 rounded-lg font-medium text-sm"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-600">No skills listed</span>
                    )}
                  </div>
                </div>
                {user?.profile?.resume && (
                  <div className="mt-2">
                    <h4 className="text-lg font-semibold">Resume</h4>
                    <a
                      href={encodeURI(user.profile.resume)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {user.profile.resumeOriginalName || "View Resume"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="md:w-2/3 mt-6 md:mt-0 md:pl-6">
          {loading ? (
            <p className="text-2xl text-blue-700">Loading..</p>
          ) : (
            <ApplicationList applications={applications} />
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;
