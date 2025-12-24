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
 * Route params: userId
 */
const CandidateInformation = () => {
  const { userId } = useParams();
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
          `${ADMIN_USER_DATA_API_END_POINT}/getUser/${userId}`,
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
  }, [userId]);

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
    return <p className="text-center mt-20 text-xl">Loading.</p>;

  if (error)
    return <p className="text-center mt-20 text-red-600">{error}</p>;

  if (!candidate)
    return <p className="text-center mt-20 text-gray-600">No candidate found</p>;

  return (
    <>
      <Helmet>
        <title>
          Candidate Profile & Resume Details | Review, Shortlist & Contact Talent – GreatHire
        </title>

        <meta
          name="description"
          content="The Candidate Information page on GreatHire enables recruiters to deeply review applicant profiles, experience, skills, and resumes with ease. Built for modern hiring teams operating from Hyderabad State, India, this platform supports recruiters in evaluating talent accuracy, contacting candidates instantly, and managing shortlists efficiently. With a clean interface, real-time data, and secure access, recruiters can make confident hiring decisions faster. GreatHire streamlines candidate assessment, improves recruiter productivity, and ensures every hiring action is data-driven, transparent, and aligned with business growth goals."
        />
      </Helmet>
      <div className="container mx-auto p-6 pt-24">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <Button
              onClick={() => navigate(-1)}
              className="bg-gray-200 text-black"
            >
              ← Back
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column */}
            <div className="md:w-1/3 border-r md:pr-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-28 w-28">
                  <AvatarImage
                    src={
                      isValidImageURL(candidate?.profile?.profilePhoto)
                        ? encodeURI(candidate.profile.profilePhoto)
                        : "/default-profile.png"
                    }
                  />
                </Avatar>

                <h2 className="mt-4 text-2xl font-bold text-center">
                  {candidate?.fullname || "—"}
                </h2>

                <p className="text-gray-600 text-sm text-center">
                  {candidate?.emailId?.email || candidate?.email || ""}
                </p>
              </div>

              <div className="mt-6 text-sm space-y-2">
                <p>
                  <strong>Phone:</strong>{" "}
                  {candidate?.phoneNumber?.number || "Not provided"}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {candidate?.address?.city ||
                    candidate?.address?.state ||
                    candidate?.address?.country ||
                    "Not provided"}
                </p>
                <p>
                  <strong>Last Active:</strong>{" "}
                  {candidate?.lastActiveAgo ||
                    candidate?.updatedAt ||
                    "N/A"}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {candidate?.profile?.resume && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleDownloadResume}
                  >
                    Download Resume
                  </Button>
                )}

                <Button
                  className="bg-blue-600 hover:bg-blue-700"
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
                  className="bg-gray-700 hover:bg-gray-800"
                  onClick={() => {
                    const phone = candidate?.phoneNumber?.number;
                    if (phone) window.location.href = `tel:${phone}`;
                    else toast.error("Phone number not available");
                  }}
                >
                  Call
                </Button>

                <Button
                  className={`mt-2 ${shortlisted ? "bg-yellow-500" : "bg-indigo-600"
                    } hover:opacity-90`}
                  onClick={handleShortlistToggle}
                >
                  {shortlisted ? "Shortlisted ✓" : "Add to Shortlist"}
                </Button>
              </div>
            </div>

            {/* Right column */}
            <div className="md:w-2/3">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Summary</h3>
                <p className="text-gray-700">
                  {candidate?.profile?.bio || "No summary provided."}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold">Experience</h3>

                {Array.isArray(candidate?.profile?.experiences) &&
                  candidate.profile.experiences.length > 0 ? (
                  candidate.profile.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="mb-3 text-sm text-gray-700"
                    >
                      <p>
                        <strong>Job Profile:</strong>{" "}
                        {exp.jobProfile || "—"}
                      </p>
                      <p>
                        <strong>Company:</strong>{" "}
                        {exp.companyName || "—"}
                      </p>
                      <p>
                        <strong>Duration:</strong>{" "}
                        {exp.duration ?? "0"} years
                      </p>
                      <div className="mt-2">
                        <strong>Details:</strong>
                        <p className="max-h-36 overflow-y-auto p-2 bg-gray-50 rounded">
                          {exp.experienceDetails || "—"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : candidate?.profile?.experience ? (
                  <div className="text-sm text-gray-700">
                    <p>
                      <strong>Job Profile:</strong>{" "}
                      {candidate.profile.experience.jobProfile || "—"}
                    </p>
                    <p>
                      <strong>Company:</strong>{" "}
                      {candidate.profile.experience.companyName || "—"}
                    </p>
                    <p>
                      <strong>Duration:</strong>{" "}
                      {candidate.profile.experience.duration ?? "0"}{" "}
                      years
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">No experience details.</p>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(candidate?.profile?.skills) &&
                    candidate.profile.skills.length > 0 ? (
                    candidate.profile.skills.map((s, i) => (
                      <Badge
                        key={i}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded"
                      >
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-600">No skills listed</span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold">Qualification</h3>
                <p className="text-gray-700">
                  {candidate?.profile?.qualification ||
                    candidate?.profile?.otherQualification ||
                    "Not provided"}
                </p>
              </div>

              {Array.isArray(candidate?.profile?.documents) &&
                candidate.profile.documents.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                      Other Documents
                    </h3>
                    <ul className="list-disc pl-6">
                      {candidate.profile.documents.map((doc, idx) => (
                        <li key={idx}>
                          <a
                            href={encodeURI(doc)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
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
    </>
  );
};

export default CandidateInformation;
