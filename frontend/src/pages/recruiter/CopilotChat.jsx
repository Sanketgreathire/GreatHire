import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Send,
  Bot,
  Loader2,
  Sparkles,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  FileText,
  Eye,
  X,
  Mail,
  Phone,
  GraduationCap,
  ExternalLink,
  Award,
  CheckCircle,
} from "lucide-react";
import { COPILOT_API_END_POINT } from "../../utils/ApiEndPoint";

/* eslint-disable react/prop-types */ 
const STARTER_PROMPTS = [
  "Senior React developers in Bangalore, open to work",
  "Backend engineers with 3-6 years, strong in Node.js",
  "Data analysts with SQL and Power BI, remote",
  "Frontend candidates with startup experience",
];

/* ─── Icon map for documents ─────────────────────────────────────────────── */
const DOC_ICONS = {
  "PAN Card": <FileText className="w-5 h-5 text-blue-600" />,
  "Aadhar Card": <FileText className="w-5 h-5 text-blue-600" />,
  Passport: <FileText className="w-5 h-5 text-blue-600" />,
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Candidate Detail Modal (read-only, no actions)                             */
/* ─────────────────────────────────────────────────────────────────────────── */
const CandidateModal = ({ candidate, onClose }) => {
  if (!candidate) return null;
  const profile = candidate.profile || candidate;

  const name =
    profile.fullname ||
    profile.fullName ||
    candidate.fullname ||
    candidate.fullName ||
    candidate.name ||
    "Unnamed candidate";

  const experienceList = Array.isArray(profile.experiences)
    ? profile.experiences
    : typeof profile.experiences === "string"
      ? (() => {
        try {
          const parsed = JSON.parse(profile.experiences);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })()
      : [];

  const firstExp = experienceList[0] || {};
  const designation = firstExp.jobProfile || "";
  const company = firstExp.companyName || "";
  const currentCtc = firstExp.currentCTC || "";
  const noticePeriod = firstExp.noticePeriod || "";

  const totalYears = experienceList.reduce(
    (sum, exp) => sum + (parseFloat(exp.duration) || 0),
    0
  );

  const email = candidate.emailId?.email || profile.email || "";
  const emailVerified = candidate.emailId?.isVerified || false;
  const phone = candidate.phoneNumber?.number || profile.phone || "";

  const location = [
    candidate.address?.city,
    candidate.address?.state,
    candidate.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const gender = profile.gender || "";
  const qualification =
    profile.qualification === "Others"
      ? profile.otherQualification || ""
      : profile.qualification || "";

  const categories = Array.isArray(profile.category) ? profile.category : [];
  const languages = Array.isArray(profile.language) ? profile.language : [];
  const documents = Array.isArray(profile.documents) ? profile.documents : [];

  const rawSkills = profile.skills || candidate.skills || [];
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === "string"
      ? rawSkills.split(",").map((s) => s.trim())
      : [];

  const matchedSkills =
    profile.matchedSkills ||
    candidate.matchedSkills ||
    candidate._scores?.matchedSkills ||
    [];

  const missingSkills =
    profile.missingSkills ||
    candidate.missingSkills ||
    candidate._scores?.missingSkills ||
    [];

  const educationList = Array.isArray(profile.education)
    ? profile.education
    : profile.education
      ? [profile.education]
      : [];

  const certifications = Array.isArray(profile.certifications)
    ? profile.certifications
    : [];

  const summary =
    profile.summary || profile.bio || profile.about || candidate.summary || "";

  const githubUrl = profile.githubUrl || candidate.githubUrl;
  const linkedinUrl = profile.linkedinUrl || candidate.linkedinUrl;
  const resumeUrl = profile.resumeUrl || candidate.resumeUrl;
  const portfolioUrl = profile.portfolioUrl || candidate.portfolioUrl;

  const rawScore =
    candidate._scores?.total ??
    candidate._scores?.semantic ??
    candidate.matchScore;
  const score =
    typeof rawScore === "number"
      ? rawScore > 1
        ? rawScore
        : rawScore * 100
      : null;
  const tier = candidate.tier || candidate._scores?.tier || "";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                <span className="text-xl font-bold">{initials || "?"}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate uppercase tracking-wide">
                  {name}
                </h2>
                {(designation || company) && (
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 truncate">
                    <Briefcase size={14} />
                    {designation}
                    {designation && company ? " · " : ""}
                    {company}
                  </p>
                )}
                {(totalYears > 0 || location) && (
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <MapPin size={14} />
                    {totalYears > 0
                      ? `${totalYears} Year${totalYears > 1 ? "s" : ""} Experience`
                      : "Fresher"}
                    {location ? ` · ${location}` : ""}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {score !== null && (
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {Math.round(score)}% match
              </span>
            )}
            {tier && (
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                {tier.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Contact Info + Personal Info */}
          {(email ||
            phone ||
            location ||
            gender ||
            qualification ||
            currentCtc ||
            noticePeriod) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(email || phone || location) && (
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
                    <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                      Contact Information
                    </h2>
                    <div className="space-y-3">
                      {email && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400">Email Address</p>
                            <p className="text-sm text-gray-700 dark:text-gray-200 break-all">
                              {email}
                            </p>
                            {emailVerified ? (
                              <span className="text-green-500 text-xs flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                Not verified
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {phone && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Phone Number</p>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                              {phone}
                            </p>
                          </div>
                        </div>
                      )}
                      {location && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Location</p>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                              {location}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(gender || qualification || currentCtc || noticePeriod) && (
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
                    <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                      Personal Info
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {gender && (
                        <div>
                          <p className="text-xs text-gray-400">Gender</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                            {gender}
                          </p>
                        </div>
                      )}
                      {qualification && (
                        <div>
                          <p className="text-xs text-gray-400">
                            Highest Qualification
                          </p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">
                            {qualification}
                          </p>
                        </div>
                      )}
                      {currentCtc && (
                        <div>
                          <p className="text-xs text-gray-400">Current CTC</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                            {currentCtc}
                          </p>
                        </div>
                      )}
                      {noticePeriod && (
                        <div>
                          <p className="text-xs text-gray-400">Notice Period</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                            {noticePeriod}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Experience Details */}
          {experienceList.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                Experience Details
              </h2>
              {experienceList.map((exp, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${i > 0 ? "mt-4 pt-4 border-t dark:border-gray-700" : ""
                    }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {(exp.companyName || "C")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">
                          {exp.jobProfile}
                        </p>
                        <p className="text-blue-600 text-xs">
                          {exp.companyName}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {exp.startDate
                            ? `${exp.startDate} - ${exp.currentlyWorking
                              ? "Present"
                              : exp.endDate || ""
                            } (${exp.duration} Year${exp.duration > 1 ? "s" : ""
                            })`
                            : exp.duration
                              ? `${exp.duration} Year(s)`
                              : ""}
                        </p>
                      </div>
                      {exp.employmentType && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full shrink-0">
                          {exp.employmentType}
                        </span>
                      )}
                    </div>
                    {exp.currentlyWorking &&
                      (exp.currentCTC || exp.noticePeriod) && (
                        <div className="flex gap-6 mt-2">
                          {exp.currentCTC && (
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                                Current CTC
                              </p>
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                {exp.currentCTC}
                              </p>
                            </div>
                          )}
                          {exp.noticePeriod && (
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                                Notice Period
                              </p>
                              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                {exp.noticePeriod}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Job Categories + Top Skills */}
          {(categories.length > 0 || skills.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
                  <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                    Job Categories
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full border border-blue-300 text-blue-700 dark:text-blue-300 dark:border-blue-600 text-xs"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
                  <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                    Top Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium"
                      >
                        {typeof skill === "string" ? skill : String(skill)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                Languages
              </h2>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang, i) => (
                  <span
                    key={i}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched / Missing Skills */}
          {(matchedSkills.length > 0 || missingSkills.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedSkills.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
                  <h2 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3">
                    Matched Skills ({matchedSkills.length})
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-medium"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {missingSkills.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
                  <h2 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">
                    Missing Skills ({missingSkills.length})
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* About */}
          {summary && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                About
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {summary}
              </p>
            </div>
          )}

          {/* Education */}
          {educationList.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                Education
              </h2>
              <div className="space-y-2">
                {educationList.map((edu, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <GraduationCap
                        size={16}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {typeof edu === "string"
                          ? edu
                          : edu.degree || edu.field || edu.course || "Degree"}
                      </p>
                      {typeof edu !== "string" &&
                        (edu.institution || edu.school) && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {edu.institution || edu.school}
                            {edu.year ? ` · ${edu.year}` : ""}
                          </p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                Certifications
              </h2>
              <ul className="space-y-1.5">
                {certifications.map((cert, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                  >
                    <Award
                      size={14}
                      className="mt-0.5 text-yellow-600 dark:text-yellow-500 shrink-0"
                    />
                    {typeof cert === "string"
                      ? cert
                      : cert.name || cert.title || ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                IDs / Documents
              </h2>
              <div className="flex flex-wrap gap-3">
                {documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
                  >
                    {DOC_ICONS[doc] || (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {typeof doc === "string" ? doc : doc.name || "Document"}
                      </p>
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Uploaded
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links & Resume */}
          {(githubUrl || linkedinUrl || resumeUrl || portfolioUrl) && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                Links & Resume
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                  >
                    <FileText size={14} /> View Resume
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Github size={14} /> GitHub <ExternalLink size={12} />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Linkedin size={14} /> LinkedIn <ExternalLink size={12} />
                  </a>
                )}
                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <ExternalLink size={14} /> Portfolio
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer — read-only, no actions */}
        <div className="sticky bottom-0 flex items-center justify-between gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Candidate ID: {candidate._id?.slice(-8)?.toUpperCase() || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Candidate Card — only the View button                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const CandidateCard = ({ candidate, onView }) => {
  const profile = candidate.profile || candidate;

  const name =
    profile.fullname ||
    profile.fullName ||
    candidate.fullname ||
    candidate.fullName ||
    candidate.name ||
    "Unnamed candidate";

  const experienceList = Array.isArray(profile.experiences)
    ? profile.experiences
    : [];
  const firstExp = experienceList[0] || {};
  const designation = firstExp.jobProfile || "";
  const company = firstExp.companyName || "";
  const totalYears = experienceList.reduce(
    (sum, exp) => sum + (parseFloat(exp.duration) || 0),
    0
  );
  const location = [
    candidate.address?.city,
    candidate.address?.state,
    candidate.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const rawSkills = profile.skills || candidate.skills || [];
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === "string"
      ? rawSkills.split(",").map((s) => s.trim())
      : [];

  const githubUrl = profile.githubUrl || candidate.githubUrl;
  const linkedinUrl = profile.linkedinUrl || candidate.linkedinUrl;
  const resumeUrl = profile.resumeUrl || candidate.resumeUrl;

  const rawScore =
    candidate._scores?.total ??
    candidate._scores?.semantic ??
    candidate.matchScore;
  const score =
    typeof rawScore === "number"
      ? rawScore > 1
        ? rawScore
        : rawScore * 100
      : null;

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onView(candidate)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </h4>
          {(designation || company) && (
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <Briefcase size={14} />
              {designation}
              {designation && company ? " · " : ""}
              {company}
            </p>
          )}
          {(location || totalYears > 0) && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={14} />
              {location || "Location not specified"}
              {totalYears > 0 && ` · ${totalYears} yrs exp`}
            </p>
          )}
        </div>
        {score !== null && (
          <span className="shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {Math.round(score)}% match
          </span>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.slice(0, 6).map((skill, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {typeof skill === "string" ? skill : String(skill)}
            </span>
          ))}
          {skills.length > 6 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              +{skills.length - 6} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <Github size={16} />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-blue-700"
            >
              <Linkedin size={16} />
            </a>
          )}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <FileText size={16} />
            </a>
          )}
        </div>
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            title="View details"
            onClick={(e) => {
              e.stopPropagation();
              onView(candidate);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
          >

            <Eye size={16} />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main Component                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
const CopilotChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedCandidate(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${COPILOT_API_END_POINT}/chat`,
        { message: trimmed },
        { withCredentials: true }
      );

      if (data?.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", result: data.data },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            error: data?.message || "Something went wrong.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          error:
            err?.response?.data?.message ||
            "Couldn't reach the copilot service. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Only track "viewed" interactions now
  const handleTrackView = async (candidateId) => {
    if (!candidateId) return;
    try {
      await axios.post(
        `${COPILOT_API_END_POINT}/track`,
        { candidateId, interactionType: "viewed" },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to track view:", err.message);
    }
  };

  const handleView = (candidate) => {
    handleTrackView(candidate._id);
    setSelectedCandidate(candidate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-6rem)]">
      <Helmet>
        <title>AI Copilot | GreatHire Recruiter Dashboard</title>
      </Helmet>

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-blue-600" size={22} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          AI Copilot
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <Bot className="mx-auto text-blue-500 mb-3" size={36} />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Describe who you re looking for, in plain English.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {msg.role === "user" ? (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-full w-full">
                {msg.error ? (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-xl">
                    {msg.error}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {msg.result.type === "greeting" && (
                      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                          <Bot size={18} className="text-blue-500" />
                          GreatHire AI Copilot
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {msg.result.reply}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Bot size={16} />
                      Found {msg.result.candidates?.length || 0} candidates ·{" "}
                      {Math.round(
                        (msg.result.insights?.confidence || 0) * 100
                      )}
                      % confidence ·{" "}
                      {msg.result.insights?.searchMode === "hybrid"
                        ? "AI semantic search"
                        : "keyword search"}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {(msg.result.candidates || []).map((candidate, index) => (
                        <CandidateCard
                          key={candidate._id || index}
                          candidate={candidate}
                          onView={handleView}
                        />
                      ))}
                    </div>

                    {msg.result.candidates?.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No matches yet — try broadening the skills, location,
                        or experience range.
                      </p>
                    )}

                    {msg.result.suggestions?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.result.suggestions.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                          >
                            💡 {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <Loader2 className="animate-spin" size={16} />
            Searching candidates...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Senior React developers in Pune, open to work"
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>

      <CandidateModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
};

export default CopilotChat;