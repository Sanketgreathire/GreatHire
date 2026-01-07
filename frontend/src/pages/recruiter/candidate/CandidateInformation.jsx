// /src/pages/recruiter/candidate/CandidateInformation.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import {
  COMPANY_API_END_POINT,
  ADMIN_USER_DATA_API_END_POINT,
} from "@/utils/ApiEndPoint";

/**
 * CandidateInformation
 * - Fetches candidate by id
 * - Shows profile photo, contact, experience, skills and resume download link (if present)
 * - Email / Call buttons
 * - Shortlist toggle
 *
 * Route params: id
 */
const CandidateInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState(false);
  const [error, setError] = useState(null);

  // ⭐⭐⭐ FIX: ALWAYS FETCH UPDATED PROFILE FROM ADMIN API ⭐⭐⭐
  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${ADMIN_USER_DATA_API_END_POINT}/getUser/${id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setCandidate(res.data.data);
          setShortlisted(Boolean(res.data.data?.isShortlisted));
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Failed to load candidate");
      }

      setLoading(false);
    };

    fetchCandidate();
  }, [id]);


  const isValidImageURL = (url) => {
    try {
      if (!url) return false;
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleDownloadResume = () => {
    if (candidate?.profile?.resume) {
      window.open(encodeURI(candidate.profile.resume), "_blank");
    } else {
      toast.error("Resume not available");
    }
  };

  const handleShortlistToggle = async () => {
    setShortlisted((s) => !s);
    toast.success(!shortlisted ? "Shortlisted" : "Removed from shortlist");
  };

  if (loading)
    return <p className="text-center mt-20 text-xl dark:text-gray-200">Loading...</p>;

  if (error)
    return <p className="text-center mt-20 text-red-600 dark:text-red-400">{error}</p>;

  if (!candidate)
    return <p className="text-center mt-20 text-gray-600 dark:text-gray-400">No candidate found</p>;

  return (
    <>
      <Helmet>
        <title>
          Candidate Profile & Resume Information | Examine, Shortlist, & Get in Touch with Talent - GreatHire
        </title>

        <meta
          name="description"
          content="GreatHire's Candidate Information page lets recruiters deeply review applicant profiles, experience, and skills with ease. This is a cutting-edge, full-stack solution for modern hiring teams operating from Hyderabad State, India. It will help recruiters to assess the accuracy of talent, get in touch with them instantly, and manage their shortlists better. This clean interface means recruiters can make confident hiring decisions faster because real-time data will be available at their fingertips through secure access. GreatHire makes candidate evaluation more organized, Boosts recruiter productivity, and ensures every hiring move is data-driven, transparent, and aligned to business growth objectives."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto pt-16">
          <div className="mb-4">
            <Button
              onClick={() => navigate(-1)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ← Back
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              {/* Left column - Profile Card */}
              <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 pb-4 lg:pb-0 lg:pr-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 ring-4 ring-gray-100 dark:ring-gray-700">
                    <AvatarImage
                      src={
                        isValidImageURL(candidate?.profile?.profilePhoto)
                          ? encodeURI(candidate.profile.profilePhoto)
                          : "/default-profile.png"
                      }
                    />
                  </Avatar>

                  <h2 className="mt-4 text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
                    {candidate?.fullname || "—"}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-1">
                    {candidate?.emailId?.email || candidate?.email || ""}
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-900 dark:text-gray-100">
                      <strong className="font-semibold">Phone:</strong>{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {candidate?.phoneNumber?.number || "Not provided"}
                      </span>
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-900 dark:text-gray-100">
                      <strong className="font-semibold">Location:</strong>{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {candidate?.address?.city ||
                          candidate?.address?.state ||
                          candidate?.address?.country ||
                          "Not provided"}
                      </span>
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-900 dark:text-gray-100">
                      <strong className="font-semibold">Last Active:</strong>{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {candidate?.lastActiveAgo ||
                          candidate?.updatedAt ||
                          "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {candidate?.profile?.resume && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white w-full"
                      onClick={handleDownloadResume}
                    >
                      Download Resume
                    </Button>
                  )}

                  <Button
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full"
                    onClick={() => {
                      const email =
                        candidate?.emailId?.email || candidate?.email;
                      if (email) window.location.href = `mailto:${email}`;
                      else toast.error("Email not available");
                    }}
                  >
                    Email
                  </Button>

                  <Button
                    className="bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white w-full"
                    onClick={() => {
                      const phone = candidate?.phoneNumber?.number;
                      if (phone) window.location.href = `tel:${phone}`;
                      else toast.error("Phone number not available");
                    }}
                  >
                    Call
                  </Button>

                  <Button
                    className={`w-full ${
                      shortlisted 
                        ? "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700" 
                        : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                    } text-white`}
                    onClick={handleShortlistToggle}
                  >
                    {shortlisted ? "Shortlisted ✓" : "Add to Shortlist"}
                  </Button>
                </div>
              </div>

              {/* Right column - Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {candidate?.profile?.bio || "No summary provided."}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Experience</h3>

                  {Array.isArray(candidate?.profile?.experiences) &&
                    candidate.profile.experiences.length > 0 ? (
                    <div className="space-y-4">
                      {candidate.profile.experiences.map((exp, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <p className="text-gray-900 dark:text-gray-100 mb-1">
                            <strong className="font-semibold">Job Profile:</strong>{" "}
                            {exp.jobProfile || "—"}
                          </p>
                          <p className="text-gray-900 dark:text-gray-100 mb-1">
                            <strong className="font-semibold">Company:</strong>{" "}
                            {exp.companyName || "—"}
                          </p>
                          <p className="text-gray-900 dark:text-gray-100 mb-2">
                            <strong className="font-semibold">Duration:</strong>{" "}
                            {exp.duration ?? "0"} years
                          </p>
                          <div className="mt-2">
                            <strong className="text-gray-900 dark:text-gray-100 font-semibold">Details:</strong>
                            <p className="mt-1 max-h-32 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900/50 rounded text-gray-700 dark:text-gray-300">
                              {exp.experienceDetails || "—"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : candidate?.profile?.experience ? (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-900 dark:text-gray-100 mb-1">
                        <strong className="font-semibold">Job Profile:</strong>{" "}
                        {candidate.profile.experience.jobProfile || "—"}
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 mb-1">
                        <strong className="font-semibold">Company:</strong>{" "}
                        {candidate.profile.experience.companyName || "—"}
                      </p>
                      <p className="text-gray-900 dark:text-gray-100">
                        <strong className="font-semibold">Duration:</strong>{" "}
                        {candidate.profile.experience.duration ?? "0"}{" "}
                        years
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No experience details.</p>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate?.profile?.skills ? (
                      candidate.profile.skills
                        .split(",")
                        .map((skill, i) => (
                          <Badge
                            key={i}
                            className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700"
                          >
                            {skill.trim()}
                          </Badge>
                        ))
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">No skills listed</span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Qualification</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {candidate?.profile?.qualification ||
                      candidate?.profile?.otherQualification ||
                      "Not provided"}
                  </p>
                </div>

                {Array.isArray(candidate?.profile?.documents) &&
                  candidate.profile.documents.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Other Documents
                      </h3>
                      <ul className="space-y-2">
                        {candidate.profile.documents.map((doc, idx) => (
                          <li key={idx}>
                            <a
                              href={encodeURI(doc)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                            >
                              Document {idx + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateInformation;
