import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiCpu, FiUsers, FiRefreshCw, FiUpload, FiX } from "react-icons/fi";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/ApiEndPoint";

// ── Gemini ────────────────────────────────────────────────────
async function callGemini(prompt) {
  const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  if (!API_KEY) throw new Error("Gemini API key missing. Add VITE_GEMINI_KEY to .env");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 429) throw new Error("Rate limit hit. Wait a moment and try again.");
    if (res.status === 400) throw new Error("Invalid API key. Check VITE_GEMINI_KEY in .env");
    throw new Error(`Gemini error: ${err?.error?.message || res.status}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini.");
  return text;
}

function extractJSON(raw) {
  let text = raw.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON in response.");
  text = text.slice(start);
  const last = text.lastIndexOf("}");
  if (last !== -1) text = text.slice(0, last + 1);
  text = text.replace(/,\s*([\]}])/g, "$1");
  return JSON.parse(text);
}

function buildPrompt(applicants, jobTitle, jobDesc) {
  const profiles = applicants
    .map((a, i) => {
      const skills = a.skills?.join(", ") || "N/A";
      return `[${i}] Name: ${a.name}
Skills: ${skills}
Experience: ${a.experience || "N/A"}
Education: ${a.education || "N/A"}
Bio: ${a.bio || "N/A"}`;
    })
    .join("\n\n");

  return `You are an expert recruiter AI. Analyze these ${applicants.length} applicant profiles for the job role: "${jobTitle}"${jobDesc ? `\n\nJob Description:\n${jobDesc}` : ""}.

APPLICANT PROFILES:
${profiles}

Return ONLY valid JSON. No markdown, no code fences. Start with { end with }.

{
  "results": [
    {
      "index": 0,
      "score": <integer 0-100>,
      "verdict": "<3-5 word verdict>",
      "strengths": ["<strength>", "<strength>"],
      "gaps": ["<gap>", "<gap>"],
      "recommendation": "<one sentence under 120 chars>"
    }
  ]
}`;
}

// ── Resume text extractor ────────────────────────────────────
async function extractTextFromFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "txt") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  if (ext === "pdf") {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent({ normalizeWhitespace: true });
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text.trim();
  }
  if (ext === "docx") {
    const mod = await import("mammoth");
    const mammoth = mod.default ?? mod;
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value.trim();
  }
  throw new Error(`Unsupported file type: .${ext}`);
}

// ── Score helpers ─────────────────────────────────────────────
const scoreColor = (s) =>
  s >= 75 ? "text-green-600 dark:text-green-400" :
  s >= 50 ? "text-yellow-500 dark:text-yellow-400" :
  "text-red-500 dark:text-red-400";

const scoreBg = (s) =>
  s >= 75 ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" :
  s >= 50 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-600" :
  "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";

// ── Main ──────────────────────────────────────────────────────
const RecruiterResumeAnalyzer = () => {
  const navigate = useNavigate();
  const { company } = useSelector((s) => s.company);

  // Step 1 — jobs
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Step 2 — applicants
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // Step 3 — extra job desc override + analyze
  const [jobDescOverride, setJobDescOverride] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("score");

  // Resume uploads per applicant: { [applicantId]: { file, text, loading, error } }
  const [uploadedResumes, setUploadedResumes] = useState({});
  const fileInputRefs = useRef({});

  // ── Fetch company jobs ────────────────────────────────────
  useEffect(() => {
    if (!company?._id) return;
    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/jobs-list/${company._id}`, {
          withCredentials: true,
        });
        if (res.data.success) setJobs(res.data.jobs);
      } catch {
        setError("Failed to load jobs.");
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, [company?._id]);

  // ── Fetch applicants when job selected ───────────────────
  const fetchApplicants = useCallback(async (jobId) => {
    setApplicantsLoading(true);
    setApplicants([]);
    setResults(null);
    setError("");
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const mapped = res.data.applicants
          .filter((a) => a.applicant)
          .map((a) => ({
            _id: a._id,
            name: a.applicant?.fullname || "Unknown",
            email: a.applicant?.emailId?.email || "",
            skills: a.applicant?.profile?.skills || [],
            experience: a.applicant?.profile?.experience?.duration
              ? `${a.applicant.profile.experience.duration} years as ${a.applicant.profile.experience.jobProfile || ""}`
              : "",
            education: a.applicant?.profile?.education?.degree || "",
            bio: a.applicant?.profile?.bio || "",
            resumeUrl: a.applicant?.profile?.resume || "",
            status: a.status,
          }));
        setApplicants(mapped);
        if (mapped.length === 0) setError("No applicants found for this job.");
      }
    } catch {
      setError("Failed to fetch applicants.");
    } finally {
      setApplicantsLoading(false);
    }
  }, []);

  // ── Resume upload handler ─────────────────────────────────
  const handleResumeUpload = useCallback(async (applicantId, file) => {
    if (!file) return;
    setUploadedResumes((prev) => ({ ...prev, [applicantId]: { file, text: "", loading: true, error: "" } }));
    try {
      const text = await extractTextFromFile(file);
      setUploadedResumes((prev) => ({ ...prev, [applicantId]: { file, text, loading: false, error: "" } }));
    } catch (err) {
      setUploadedResumes((prev) => ({ ...prev, [applicantId]: { file, text: "", loading: false, error: err.message } }));
    }
  }, []);

  const removeUploadedResume = useCallback((applicantId) => {
    setUploadedResumes((prev) => { const next = { ...prev }; delete next[applicantId]; return next; });
    if (fileInputRefs.current[applicantId]) fileInputRefs.current[applicantId].value = "";
  }, []);

  const handleJobSelect = useCallback((jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    setSelectedJob(job || null);
    setResults(null);
    setError("");
    setApplicants([]);
    setUploadedResumes({});
    if (job) fetchApplicants(jobId);
  }, [jobs, fetchApplicants]);

  // ── Analyze ───────────────────────────────────────────────
  const analyze = useCallback(async () => {
    if (!selectedJob) { setError("Please select a job first."); return; }
    if (applicants.length === 0) { setError("No applicants to analyze."); return; }
    setError("");
    setAnalyzing(true);
    setResults(null);
    try {
      const jobTitle = selectedJob.jobDetails?.title || "Job Role";
      const jobDesc = jobDescOverride.trim() || selectedJob.jobDetails?.description || "";
      const enrichedApplicants = applicants.map((a) => {
        const uploaded = uploadedResumes[a._id];
        return { ...a, bio: uploaded?.text ? `RESUME TEXT:\n${uploaded.text.slice(0, 3000)}` : a.bio };
      });
      const raw = await callGemini(buildPrompt(enrichedApplicants, jobTitle, jobDesc));
      const parsed = extractJSON(raw);
      if (!Array.isArray(parsed.results)) throw new Error("Invalid AI response format.");
      const merged = parsed.results
        .map((r) => ({ ...r, applicant: applicants[r.index] }))
        .filter((r) => r.applicant);
      setResults(merged);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }, [selectedJob, applicants, jobDescOverride, uploadedResumes]);

  const sorted = useMemo(() =>
    results
      ? [...results].sort((a, b) =>
          sortBy === "score" ? b.score - a.score : a.applicant.name.localeCompare(b.applicant.name)
        )
      : []
  , [results, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 pt-20">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <IoIosArrowRoundBack
          size={32}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer flex-shrink-0"
          onClick={() => navigate(-1)}
        />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FiCpu className="text-indigo-600" /> AI Resume Analyzer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Select a job → fetch applicants → analyze resumes with AI
          </p>
        </div>
      </div>

      {/* Step 1 — Select Job */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
          Step 1 — Select a Job
        </h2>

        {jobsLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Loading your jobs…
          </div>
        ) : (
          <select
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedJob?._id || ""}
            onChange={(e) => handleJobSelect(e.target.value)}
          >
            <option value="">-- Select a job from your posted jobs --</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.jobDetails?.title}
                {job.jobDetails?.isActive ? " (Active)" : " (Expired)"}
              </option>
            ))}
          </select>
        )}

        {jobs.length === 0 && !jobsLoading && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            No jobs posted yet. Post a job first to use the analyzer.
          </p>
        )}
      </div>

      {/* Step 2 — Applicants Preview */}
      {selectedJob && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Step 2 — Applicants for "{selectedJob.jobDetails?.title}"
            </h2>
            <button
              type="button"
              onClick={() => fetchApplicants(selectedJob._id)}
              className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-semibold transition-colors"
            >
              <FiRefreshCw size={12} /> Refresh
            </button>
          </div>

          {applicantsLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-4">
              <span className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Fetching applicants…
            </div>
          ) : applicants.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <FiUsers className="text-indigo-500" size={16} />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {applicants.length} applicant{applicants.length !== 1 ? "s" : ""} found
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Skills</th>
                      <th className="px-4 py-2 text-left">Experience</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((a, i) => {
                      const uploaded = uploadedResumes[a._id];
                      return (
                      <tr key={a._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">{a.name}</td>
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400 max-w-[180px] truncate">
                          {a.skills?.slice(0, 3).join(", ") || "—"}
                          {a.skills?.length > 3 && ` +${a.skills.length - 3}`}
                        </td>
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{a.experience || "—"}</td>
                        <td className="px-4 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            a.status === "Shortlisted" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            a.status === "Rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                            a.status === "Interview Schedule" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {a.resumeUrl ? (
                            <a
                              href={a.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 underline text-xs hover:text-indigo-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : !error ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 py-2">No applicants yet for this job.</p>
          ) : null}
        </div>
      )}

      {/* Step 3 — Analyze */}
      {selectedJob && applicants.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
            Step 3 — Analyze
          </h2>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Additional Job Description
              <span className="text-gray-400 font-normal ml-1">(optional — auto-filled from job if available)</span>
            </label>
            <textarea
              value={jobDescOverride}
              onChange={(e) => setJobDescOverride(e.target.value)}
              rows={3}
              placeholder={
                selectedJob.jobDetails?.description
                  ? "Job description auto-loaded from the selected job. You can override it here…"
                  : "Paste job description for more accurate analysis…"
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {error && (
            <div className="mb-3 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl text-sm text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          <button
            type="button"
            onClick={analyze}
            disabled={analyzing}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base"
          >
            {analyzing ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing {applicants.length} resumes…
              </>
            ) : (
              <>
                <FiCpu size={18} />
                Analyze {applicants.length} Resume{applicants.length !== 1 ? "s" : ""} for "{selectedJob.jobDetails?.title}"
              </>
            )}
          </button>
        </div>
      )}

      {/* Error (no job selected state) */}
      {error && !selectedJob && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl text-sm text-red-600 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">Analysis Results</h2>
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-semibold">
                {results.length} analyzed · Best: {Math.max(...results.map((r) => r.score))}/100
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Sort:</span>
              {["score", "name"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    sortBy === s
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {s === "score" ? "Score ↓" : "Name A-Z"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
            {sorted.map((r, rank) => (
              <div
                key={r.index}
                className={`border-2 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${scoreBg(r.score)}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">#{rank + 1}</span>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">{r.applicant.name}</h3>
                    </div>
                    {r.applicant.email && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{r.applicant.email}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">"{r.verdict}"</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className={`text-3xl font-black leading-none ${scoreColor(r.score)}`}>{r.score}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">/ 100</div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.score >= 75 ? "bg-green-500" : r.score >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${r.score}%` }}
                  />
                </div>

                {/* Strengths */}
                {r.strengths?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">✅ Strengths</p>
                    <ul className="space-y-0.5">
                      {r.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-300">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gaps */}
                {r.gaps?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-red-500 dark:text-red-400 mb-1">❌ Gaps</p>
                    <ul className="space-y-0.5">
                      {r.gaps.map((g, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-300">• {g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendation */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mb-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">{r.recommendation}</p>
                </div>

                {/* Skills + Resume link */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex flex-wrap gap-1">
                    {r.applicant.skills?.slice(0, 3).map((sk, i) => (
                      <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                        {sk}
                      </span>
                    ))}
                    {r.applicant.skills?.length > 3 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">+{r.applicant.skills.length - 3}</span>
                    )}
                  </div>
                  {r.applicant.resumeUrl && (
                    <a
                      href={r.applicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 font-semibold"
                    >
                      View Resume ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterResumeAnalyzer;
