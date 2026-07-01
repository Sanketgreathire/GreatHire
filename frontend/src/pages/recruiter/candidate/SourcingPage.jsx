import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Upload, Search, Trash2, Eye, X, FileText,
  ChevronLeft, ChevronRight, Zap, Brain, BarChart2,
  Github, Linkedin, UserPlus, Table2, CheckCircle2,
  AlertCircle, Loader2, Plus, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOURCING_API_END_POINT, BACKEND_URL } from "@/utils/ApiEndPoint";

const INGESTION_API = "/api/v1/ingestion";
const ITEMS_PER_PAGE = 10;

// ─── Shared Input Class ───────────────────────────────────────────────────────
const inputCls =
  "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 " +
  "text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

// ─── Import Status Banner ─────────────────────────────────────────────────────
function ImportResult({ result, onClose }) {
  if (!result) return null;
  const ok = result.success;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl p-4 text-sm border
        ${ok
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"}`}
    >
      {ok ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
      <div className="flex-1">
        <p className="font-semibold">{ok ? "Import successful!" : "Import failed"}</p>
        {result.message && <p className="mt-0.5 text-xs opacity-80">{result.message}</p>}
        {result.imported != null && (
          <p className="mt-1 text-xs">
            {result.imported} imported · {result.skipped ?? 0} skipped · {result.failed ?? 0} failed
          </p>
        )}
      </div>
      <button onClick={onClose}>
        <X size={16} className="opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
}

// ─── Tab 1: Resume Upload ─────────────────────────────────────────────────────
function ResumeUploadTab({ onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFiles = useCallback((incoming) => {
    const valid = Array.from(incoming).filter(
      (f) =>
        ["application/pdf", "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type) ||
        f.name.match(/\.(pdf|doc|docx)$/i)
    );
    if (!valid.length) return toast.error("Only PDF, DOC, DOCX files allowed.");
    setFiles((prev) => [...prev, ...valid].slice(0, 10));
  }, []);

  const uploadAll = async () => {
    if (!files.length) return toast.error("Select at least one resume.");
    setUploading(true);
    let success = 0;
    for (const file of files) {
      setCurrentFile(file.name);
      try {
        const fd = new FormData();
        fd.append("resume", file);
        const { data } = await axios.post(`${SOURCING_API_END_POINT}/upload-resume`, fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data.success) { success++; onUploaded(data.candidate); }
      } catch { toast.error(`Failed: ${file.name}`); }
    }
    if (success) toast.success(`${success} resume(s) uploaded & parsed.`);
    setFiles([]); setCurrentFile(""); setUploading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Upload PDF/DOC/DOCX resumes — AI will auto-parse name, skills, experience, and contact info.
      </p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${dragging
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700/30"}`}
      >
        <FileText size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Drag & drop resumes here, or{" "}
          <span className="text-purple-600 font-semibold">browse files</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX · Max 10MB each · Up to 10 files</p>
        <input ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx" className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
              <span className="truncate text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText size={13} className="text-purple-400 shrink-0" />
                {f.name}
              </span>
              <button onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                <X size={14} className="text-gray-400 hover:text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button
        onClick={uploadAll}
        disabled={uploading || !files.length}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={15} className="animate-spin" />
            {currentFile ? `Parsing ${currentFile}…` : "Uploading…"}
          </span>
        ) : (
          `Upload${files.length ? ` (${files.length} file${files.length > 1 ? "s" : ""})` : ""}`
        )}
      </Button>
    </div>
  );
}

// ─── Tab 2: CSV Import ────────────────────────────────────────────────────────
function CsvImportTab({ onImported }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (!file) return toast.error("Select a CSV file.");
    setLoading(true); setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await axios.post(`${INGESTION_API}/import-csv`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
      if (data.success && data.candidates?.length) {
        data.candidates.forEach((c) => onImported(c));
      }
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || "CSV import failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Upload a CSV file with candidate data. Expected columns:
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded ml-1">
          name, email, phone, skills, location, designation, experience
        </span>
      </p>

      <ImportResult result={result} onClose={() => setResult(null)} />

      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${file
            ? "border-green-400 bg-green-50 dark:bg-green-900/10"
            : "border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700/30"}`}
      >
        <Table2 size={36} className={`mx-auto mb-2 ${file ? "text-green-500" : "text-gray-300 dark:text-gray-600"}`} />
        {file ? (
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">{file.name}</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click to select CSV file, or drag & drop
            </p>
            <p className="text-xs text-gray-400 mt-1">Only .csv files accepted</p>
          </>
        )}
        <input ref={inputRef} type="file" accept=".csv" className="hidden"
          onChange={(e) => { setFile(e.target.files[0] || null); setResult(null); }} />
      </div>

      {file && (
        <button
          onClick={() => setFile(null)}
          className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
        >
          <X size={12} /> Remove file
        </button>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Importing CSV…</span>
        ) : "Import CSV"}
      </Button>
    </div>
  );
}

// ─── Tab 3: GitHub Import ─────────────────────────────────────────────────────
function GithubImportTab({ onImported }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) return toast.error("Enter a GitHub profile URL.");
    setLoading(true); setResult(null);
    try {
      const { data } = await axios.post(
        `${INGESTION_API}/import-github`,
        { githubUrl: url.trim() },
        { withCredentials: true }
      );
      setResult(data);
      if (data.success && data.candidate) onImported(data.candidate);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || "GitHub import failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Import a candidate's GitHub profile. We'll extract their bio, languages, top repos, and contact info.
      </p>

      <ImportResult result={result} onClose={() => setResult(null)} />

      <div className="space-y-3">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          GitHub Profile URL
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Github size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={`${inputCls} pl-8`}
              placeholder="https://github.com/username"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-purple-600 hover:border-purple-400 transition-colors"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p className="font-medium text-gray-600 dark:text-gray-300">What gets imported:</p>
          <ul className="space-y-0.5 ml-2">
            {["Name & bio from profile", "Public repos and top languages", "Email (if public)", "Follower/following stats"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
        className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Fetching GitHub Profile…</span>
        ) : (
          <span className="flex items-center gap-2"><Github size={15} /> Import from GitHub</span>
        )}
      </Button>
    </div>
  );
}

// ─── Tab 4: LinkedIn Import ───────────────────────────────────────────────────
function LinkedinImportTab({ onImported }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) return toast.error("Enter a LinkedIn profile URL.");
    setLoading(true); setResult(null);
    try {
      const { data } = await axios.post(
        `${INGESTION_API}/import-linkedin`,
        { linkedinUrl: url.trim() },
        { withCredentials: true }
      );
      setResult(data);
      if (data.success && data.candidate) onImported(data.candidate);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || "LinkedIn import failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Import a LinkedIn profile to extract work history, education, and skills automatically.
      </p>

      <ImportResult result={result} onClose={() => setResult(null)} />

      <div className="space-y-3">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          LinkedIn Profile URL
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Linkedin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={`${inputCls} pl-8`}
              placeholder="https://linkedin.com/in/username"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-colors"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>
            LinkedIn may limit automated scraping. Ensure the profile URL is public and accessible.
            Results depend on your backend scraping setup.
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p className="font-medium text-gray-600 dark:text-gray-300">What gets imported:</p>
          <ul className="space-y-0.5 ml-2">
            {["Full name & headline", "Work experience & tenure", "Education & degrees", "Skills & endorsements"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Fetching LinkedIn Profile…</span>
        ) : (
          <span className="flex items-center gap-2"><Linkedin size={15} /> Import from LinkedIn</span>
        )}
      </Button>
    </div>
  );
}

// ─── Tab 5: Manual Entry ──────────────────────────────────────────────────────
function ManualEntryTab({ onImported }) {
  const empty = { fullName: "", email: "", phone: "", designation: "", currentCompany: "", location: "", totalExperience: "", skills: "", summary: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.fullName.trim()) return toast.error("Full name is required.");
    setLoading(true); setResult(null);
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        totalExperience: form.totalExperience ? parseFloat(form.totalExperience) : 0,
        emails: form.email ? [form.email] : [],
        phones: form.phone ? [form.phone] : [],
      };
      const { data } = await axios.post(`${INGESTION_API}/import-manual`, payload, { withCredentials: true });
      setResult(data);
      if (data.success && data.candidate) {
        onImported(data.candidate);
        setForm(empty);
      }
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || "Manual entry failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Manually add a candidate to your talent pool. Fill in as much or as little as you know.
      </p>

      <ImportResult result={result} onClose={() => setResult(null)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Full Name *</label>
          <input className={inputCls} placeholder="Jane Doe" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Email</label>
          <input className={inputCls} placeholder="jane@example.com" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Phone</label>
          <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Designation</label>
          <input className={inputCls} placeholder="Senior Frontend Developer" value={form.designation} onChange={(e) => set("designation", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Current Company</label>
          <input className={inputCls} placeholder="Acme Corp" value={form.currentCompany} onChange={(e) => set("currentCompany", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Location</label>
          <input className={inputCls} placeholder="Pune, Maharashtra" value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Experience (years)</label>
          <input className={inputCls} placeholder="4.5" type="number" min="0" step="0.5" value={form.totalExperience} onChange={(e) => set("totalExperience", e.target.value)} />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Skills (comma-separated)</label>
          <input className={inputCls} placeholder="React, TypeScript, Node.js, PostgreSQL" value={form.skills} onChange={(e) => set("skills", e.target.value)} />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Summary / Notes</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="Brief professional summary or notes about the candidate…"
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !form.fullName.trim()}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Adding Candidate…</span>
        ) : (
          <span className="flex items-center gap-2"><Plus size={15} /> Add Candidate</span>
        )}
      </Button>
    </div>
  );
}

// ─── Import Panel (tabbed left panel) ────────────────────────────────────────
const IMPORT_TABS = [
  { id: "resume",   label: "Resume",   icon: FileText,  color: "purple" },
  { id: "csv",      label: "CSV",      icon: Table2,    color: "emerald" },
  { id: "github",   label: "GitHub",   icon: Github,    color: "gray" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin,  color: "blue" },
  { id: "manual",   label: "Manual",   icon: UserPlus,  color: "orange" },
];

const tabColorMap = {
  purple:  { active: "bg-purple-600 text-white",  dot: "bg-purple-500" },
  emerald: { active: "bg-emerald-600 text-white", dot: "bg-emerald-500" },
  gray:    { active: "bg-gray-900 text-white dark:bg-white dark:text-gray-900", dot: "bg-gray-500" },
  blue:    { active: "bg-blue-600 text-white",    dot: "bg-blue-500" },
  orange:  { active: "bg-orange-500 text-white",  dot: "bg-orange-400" },
};

function ImportPanel({ onCandidateAdded }) {
  const [activeTab, setActiveTab] = useState("resume");
  const tab = IMPORT_TABS.find((t) => t.id === activeTab);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Tab nav */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {IMPORT_TABS.map((t) => {
          const colors = tabColorMap[t.color];
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-[72px] flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors border-b-2
                ${isActive
                  ? "border-b-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
                  : "border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30"}`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === "resume"   && <ResumeUploadTab  onUploaded={onCandidateAdded} />}
        {activeTab === "csv"      && <CsvImportTab     onImported={onCandidateAdded} />}
        {activeTab === "github"   && <GithubImportTab  onImported={onCandidateAdded} />}
        {activeTab === "linkedin" && <LinkedinImportTab onImported={onCandidateAdded} />}
        {activeTab === "manual"   && <ManualEntryTab   onImported={onCandidateAdded} />}
      </div>
    </div>
  );
}

// ─── Stats Panel ──────────────────────────────────────────────────────────────
function StatsPanel({ candidates }) {
  if (!candidates.length) return null;

  const exps = candidates.map((c) => c.totalExperience || 0).filter((e) => e > 0);
  const avgExp = exps.length ? Math.round(exps.reduce((a, b) => a + b, 0) / exps.length) : null;

  const skillCounts = {};
  candidates.forEach((c) => (c.skills || []).forEach((s) => { skillCounts[s] = (skillCounts[s] || 0) + 1; }));
  const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([s]) => s);

  const sources = {};
  candidates.forEach((c) => { const s = c.source || "resume"; sources[s] = (sources[s] || 0) + 1; });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mt-4">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <BarChart2 size={16} className="text-purple-600" /> Pool Stats
      </h2>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Candidates</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{candidates.length}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Exp</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {avgExp != null ? `${avgExp}y` : "—"}
          </p>
        </div>
      </div>

      {Object.keys(sources).length > 1 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">By Source</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(sources).map(([src, count]) => (
              <span key={src} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {src}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {topSkills.length > 0 && (
        <>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Top Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {topSkills.map((s, i) => (
              <Badge key={i} className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar({ onSearch, aiAvailable, showImport, onToggleImport }) {
  const [filters, setFilters] = useState({ skills: "", location: "", designation: "", minExp: "", maxExp: "", jobDescription: "" });
  const [useAI, setUseAI] = useState(false);
  const [showJD, setShowJD] = useState(false);

  const set = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const handleSearch = (e) => { e.preventDefault(); onSearch(filters, useAI && aiAvailable); };
  const handleClear = () => {
    const empty = { skills: "", location: "", designation: "", minExp: "", maxExp: "", jobDescription: "" };
    setFilters(empty);
    setShowJD(false);
    onSearch(empty, false);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">Search Sourced Candidates</h2>
          <button
            type="button"
            onClick={() => setUseAI((v) => !v)}
            disabled={!aiAvailable}
            title={aiAvailable ? "Toggle AI semantic search" : "AI service unavailable"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border
              ${useAI && aiAvailable
                ? "bg-purple-600 text-white border-purple-600"
                : aiAvailable
                  ? "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-200 cursor-not-allowed"}`}
          >
            <Brain size={12} />
            {useAI && aiAvailable ? "AI ON" : "AI OFF"}
            <span className={`ml-0.5 ${aiAvailable ? (useAI ? "text-green-300" : "text-green-500") : "text-red-400"}`}>●</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onToggleImport}
          className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
        >
          {showImport ? "Hide Sourcing" : "Show Sourcing"}
        </button>
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
        <input className={inputCls} placeholder="Skills (e.g. React)" value={filters.skills} onChange={(e) => set("skills", e.target.value)} />
        <input className={inputCls} placeholder="Location" value={filters.location} onChange={(e) => set("location", e.target.value)} />
        <input className={inputCls} placeholder="Designation" value={filters.designation} onChange={(e) => set("designation", e.target.value)} />
        <input className={inputCls} placeholder="Min Experience (yrs)" type="number" min="0" value={filters.minExp} onChange={(e) => set("minExp", e.target.value)} />
        <input className={inputCls} placeholder="Max Experience (yrs)" type="number" min="0" value={filters.maxExp} onChange={(e) => set("maxExp", e.target.value)} />
      </div>

      {/* JD toggle + textarea */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setShowJD(v => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-2"
        >
          <Brain size={13} className={showJD ? "text-purple-500" : ""} />
          {showJD ? "Hide Job Description" : "+ Add Job Description (AI Match)"}
        </button>
        {showJD && (
          <textarea
            className={`${inputCls} resize-none`}
            rows={4}
            placeholder="Paste job description here — AI will source candidates from GitHub and rank them by match score…"
            value={filters.jobDescription}
            onChange={(e) => set("jobDescription", e.target.value)}
          />
        )}
        {showJD && filters.jobDescription?.trim() && (
          <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-400">
            <Brain size={12} className="shrink-0" />
            <span><span className="font-semibold">JD Sourcing active</span> — candidates will be sourced from GitHub &amp; ranked by match</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className={`px-5 flex items-center gap-2 text-white transition-colors ${
            filters.jobDescription?.trim() ? "bg-green-600 hover:bg-green-700"
              : useAI && aiAvailable ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {filters.jobDescription?.trim() ? <><Brain size={14} /> Source &amp; Match</>
            : useAI && aiAvailable ? <><Zap size={14} /> AI Search</>
            : <><Search size={14} /> Search</>}
        </Button>
        <Button type="button" variant="outline" onClick={handleClear}>Clear</Button>
      </div>
    </form>
  );
}

// ─── Candidate Card ───────────────────────────────────────────────────────────
const SOURCE_BADGE = {
  github:   { label: "GitHub",   cls: "bg-gray-900 text-white dark:bg-white dark:text-gray-900" },
  linkedin: { label: "LinkedIn", cls: "bg-blue-600 text-white" },
  indeed:   { label: "Indeed",   cls: "bg-teal-600 text-white" },
  naukri:   { label: "Naukri",   cls: "bg-orange-600 text-white" },
  csv:      { label: "CSV",      cls: "bg-emerald-600 text-white" },
  manual:   { label: "Manual",   cls: "bg-orange-500 text-white" },
  resume:   { label: "Resume",   cls: "bg-purple-600 text-white" },
};

function CandidateCard({ candidate, onDelete, showScore }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${candidate.fullName}?`)) return;
    setDeleting(true);
    try {
      const { data } = await axios.delete(`${SOURCING_API_END_POINT}/${candidate._id}`, { withCredentials: true });
      if (data.success) { toast.success("Candidate deleted."); onDelete(candidate._id); }
    } catch { toast.error("Delete failed."); }
    finally { setDeleting(false); }
  };

  const score = candidate._scores?.hybrid || candidate.matchScore;
  const src = candidate.source || "resume";
  const srcBadge = SOURCE_BADGE[src] || SOURCE_BADGE.resume;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{candidate.fullName}</h3>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${srcBadge.cls}`}>{srcBadge.label}</span>
            {showScore && score !== undefined && score !== null && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                ${score >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                  : score >= 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                {typeof score === 'number' && score < 1 ? Math.round(score * 100) : score}%
              </span>
            )}
          </div>
          {candidate.designation && <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{candidate.designation}</p>}
          {candidate.currentCompany && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{candidate.currentCompany}</p>}
        </div>
        <div className="flex gap-1.5 shrink-0">
          {candidate.resumeUrl && (
            <a href={`${BACKEND_URL}${candidate.resumeUrl}`} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors" title="View Resume">
              <Eye size={15} />
            </a>
          )}
          
          {candidate.linkedinUrl && (
            <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors" title="LinkedIn">
              <Linkedin size={15} />
            </a>
          )}
          <button onClick={handleDelete} disabled={deleting}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors disabled:opacity-50" title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="mt-2.5 space-y-1 text-xs text-gray-600 dark:text-gray-400">
        {candidate.totalExperience > 0 && <div className="flex items-center gap-1">🕐 {candidate.totalExperience} yrs exp</div>}
        {candidate.location && <div className="flex items-center gap-1">📍 {candidate.location}</div>}
        {candidate.emails?.length > 0 && (
          <div className="flex items-start gap-1">
            <span>✉️</span>
            <div className="flex-1 break-all">
              {candidate.emails.map((email, i) => (
                <div key={i}>
                  <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {candidate.phones?.length > 0 && (
          <div className="flex items-start gap-1">
            <span>📞</span>
            <div className="flex-1">
              {candidate.phones.map((phone, i) => (
                <div key={i}>
                  <a href={`tel:${phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {candidate.skills?.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {candidate.skills.slice(0, 5).map((s, i) => (
            <Badge key={i} className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs">{s}</Badge>
          ))}
          {candidate.skills.length > 5 && (
            <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs">+{candidate.skills.length - 5}</Badge>
          )}
        </div>
      )}

      {candidate.summary && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{candidate.summary}</p>
      )}

      {showScore && candidate.matchReasons?.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
            <Brain size={12} className="text-purple-500" />
            Match Analysis:
          </p>
          <div className="space-y-1">
            {candidate.matchReasons.map((reason, i) => (
              <p key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                <span className={`mt-0.5 shrink-0 ${candidate.matchScore >= 70 ? 'text-green-500' : candidate.matchScore >= 40 ? 'text-yellow-500' : 'text-gray-400'}`}>•</span>
                {reason}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main SourcingPage ────────────────────────────────────────────────────────
const SourcingPage = () => {
  const [allCandidates, setAllCandidates] = useState([]);
  const [candidates, setCandidates]       = useState([]);
  const [pagination, setPagination]       = useState(null);
  const [loading, setLoading]             = useState(false);
  const [currentPage, setCurrentPage]     = useState(1);
  const [activeFilters, setActiveFilters] = useState(null);
  const [hasSearched, setHasSearched]     = useState(false);
  const [searchMode, setSearchMode]       = useState("keyword");
  const [aiAvailable, setAiAvailable]     = useState(false);
  const [searchMeta, setSearchMeta]       = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [sourcingProgress, setSourcingProgress] = useState(0);

  useEffect(() => {
    axios
      .get(`${SOURCING_API_END_POINT}/ai-health`, { withCredentials: true })
      .then(({ data }) => setAiAvailable(data.success))
      .catch(() => setAiAvailable(false));
  }, []);

  const fetchCandidates = useCallback(async (filters, useAI = false, page = 1) => {
    setLoading(true);
    setLoadingMessage("");
    setSourcingProgress(0);
    try {
      // If job description is provided, use JD-based sourcing
      if (filters.jobDescription?.trim()) {
        setLoadingMessage("🔍 Sourcing candidates from GitHub...");
        setSourcingProgress(20);
        
        const payload = {
          skills: filters.skills?.split(',').map(s => s.trim()).filter(Boolean) || [],
          location: filters.location || undefined,
          designation: filters.designation || undefined,
          minExperience: filters.minExp ? parseInt(filters.minExp) : undefined,
          maxExperience: filters.maxExp ? parseInt(filters.maxExp) : undefined,
          jobDescription: filters.jobDescription
        };

        setTimeout(() => {
          setLoadingMessage("🎯 Scoring candidates with AI...");
          setSourcingProgress(60);
        }, 3000);

        const { data } = await axios.post(`${SOURCING_API_END_POINT}/source-by-jd`, payload, { withCredentials: true });
        
        setSourcingProgress(100);
        
        if (data.success) {
          setCandidates(data.candidates || []);
          setPagination(null);
          setSearchMode("jd");
          setHasSearched(true);
          setSearchMeta({ mode: data.mode, total: data.total, message: data.message });
          toast.success(`Found ${data.candidates?.length || 0} candidates matching your job description!`);
        }
      } else if (useAI && filters.q?.trim()) {
        const params = { q: filters.q, topK: ITEMS_PER_PAGE, scoreThreshold: 0.2 };
        if (filters.location)    params.location    = filters.location;
        if (filters.designation) params.designation = filters.designation;
        if (filters.minExp)      params.minExp      = filters.minExp;
        if (filters.maxExp)      params.maxExp      = filters.maxExp;
        if (filters.skills)      params.skills      = filters.skills;

        const { data } = await axios.get(`${SOURCING_API_END_POINT}/semantic-search`, { params, withCredentials: true });
        if (data.success) {
          setCandidates(data.results || []);
          setPagination(null);
          setSearchMode("ai");
          setHasSearched(true);
          setSearchMeta({ mode: data.mode, total: data.total, timings: data.timings });
        }
      } else {
        const params = { page, limit: ITEMS_PER_PAGE };
        if (filters.q)           params.q           = filters.q;
        if (filters.skills)      params.skills      = filters.skills;
        if (filters.location)    params.location    = filters.location;
        if (filters.designation) params.designation = filters.designation;
        if (filters.minExp)      params.minExp      = filters.minExp;
        if (filters.maxExp)      params.maxExp      = filters.maxExp;

        const { data } = await axios.get(`${SOURCING_API_END_POINT}/search`, { params, withCredentials: true });
        if (data.success) {
          setCandidates(data.candidates);
          setPagination(data.pagination);
          setCurrentPage(page);
          setSearchMode("keyword");
          setHasSearched(true);
          setSearchMeta(null);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
      setSourcingProgress(0);
    }
  }, []);

  const handleSearch = (filters, useAI) => {
    setActiveFilters({ filters, useAI });
    fetchCandidates(filters, useAI, 1);
  };

  const handlePageChange = (page) => {
    if (activeFilters) fetchCandidates(activeFilters.filters, false, page);
  };

  const handleCandidateAdded = (newCandidate) => {
    setAllCandidates((prev) => [newCandidate, ...prev]);
    setCandidates((prev) => [newCandidate, ...prev]);
    if (!hasSearched) setHasSearched(true);
  };

  const handleDeleted = (id) => {
    setAllCandidates((prev) => prev.filter((c) => c._id !== id));
    setCandidates((prev) => prev.filter((c) => c._id !== id));
    if (pagination) setPagination((p) => ({ ...p, total: p.total - 1 }));
  };

  const totalCount = searchMode === "ai" || searchMode === "jd"
    ? (searchMeta?.total ?? candidates.length)
    : (pagination?.total ?? candidates.length);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-6 pb-20 transition-colors">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">🤖</span> AI Sourcing
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Import candidates from resumes, CSV, GitHub, LinkedIn, or add manually — then search with AI.
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border
          ${aiAvailable
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"}`}>
          <Brain size={13} />
          AI {aiAvailable ? "Ready" : "Offline"}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left — Import Panel + Stats */}
        <div className="xl:col-span-1">
          <ImportPanel onCandidateAdded={handleCandidateAdded} />
          <StatsPanel candidates={allCandidates} />
        </div>

        {/* Right — Search + Results */}
        <div className="xl:col-span-2 space-y-5">
          <SearchBar onSearch={handleSearch} aiAvailable={aiAvailable} />

          {searchMeta && (
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 px-1">
              <span className="flex items-center gap-1">
                <Zap size={12} className="text-purple-500" />
                Mode: <span className="font-semibold text-purple-600 dark:text-purple-400 ml-1">{searchMeta.mode}</span>
              </span>
              {searchMeta.timings?.total_ms && <span>⏱ {searchMeta.timings.total_ms}ms</span>}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
              {loadingMessage && (
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{loadingMessage}</p>
                  {sourcingProgress > 0 && (
                    <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-green-500 transition-all duration-500"
                        style={{ width: `${sourcingProgress}%` }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">This may take 30-60 seconds...</p>
                </div>
              )}
            </div>
          ) : hasSearched && candidates.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <FileText size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-lg">No candidates found.</p>
              <p className="text-sm mt-1">Import candidates or adjust your search filters.</p>
            </div>
          ) : candidates.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalCount} candidate{totalCount !== 1 ? "s" : ""} found
                  {searchMode === "ai" && <span className="ml-2 text-purple-500 font-medium">· AI ranked</span>}
                  {searchMode === "jd" && <span className="ml-2 text-green-500 font-medium">· JD matched</span>}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidates.map((c) => (
                  <CandidateCard key={c._id || c.githubUrl} candidate={c} onDelete={handleDeleted} showScore={searchMode === "ai" || searchMode === "jd"} />
                ))}
              </div>

              {searchMode === "keyword" && pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <Button variant="outline" size="sm" disabled={!pagination.hasPrev} onClick={() => handlePageChange(currentPage - 1)}>
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={!pagination.hasNext} onClick={() => handlePageChange(currentPage + 1)}>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          ) : !hasSearched ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <Search size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-lg">Import candidates or search to get started.</p>
              {aiAvailable && (
                <p className="text-sm mt-2 text-purple-500">✨ AI semantic search is available — toggle it on for smarter results.</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SourcingPage;