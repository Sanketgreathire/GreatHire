import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Search, Trash2, Brain, Zap, ChevronLeft, ChevronRight, FileText, X, Play, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/admin/Navbar";
import { SOURCING_API_END_POINT } from "@/utils/ApiEndPoint";

const BASE_API = import.meta.env.VITE_API_URL + "/api/v1";
const ADMIN_SOURCING_API = `${BASE_API}/admin/sourcing`;
const ITEMS_PER_PAGE = 12;

const SOURCE_COLORS = {
  GITHUB:           "bg-orange-100 text-orange-700",
  LINKEDIN:         "bg-blue-200 text-blue-800",
  NAUKRI:           "bg-teal-100 text-teal-700",
  INDEED:           "bg-teal-100 text-teal-700",
  CSV_IMPORT:       "bg-green-100 text-green-700",
  MANUAL:           "bg-pink-100 text-pink-700",
  API_IMPORT:       "bg-purple-100 text-purple-700",
  GITHUB_PROFILE:   "bg-orange-100 text-orange-700",
  LINKEDIN_PROFILE: "bg-blue-200 text-blue-800",
  PUBLIC_PROFILE:   "bg-teal-100 text-teal-700",
};

// ── Manual Entry Modal ────────────────────────────────────────────────────────
function ManualModal({ onClose, onSaved }) {
  const empty = { fullName: "", email: "", phone: "", skills: "", location: "", designation: "", currentCompany: "", githubUrl: "", linkedinUrl: "", totalExperience: "", summary: "" };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) { toast.error("Full name is required"); return; }
    setSaving(true);
    try {
      const { data } = await axios.post(`${ADMIN_SOURCING_API}/manual`, form, { withCredentials: true });
      if (data.success) { toast.success("Candidate added!"); onSaved(); onClose(); }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add candidate");
    } finally { setSaving(false); }
  };

  const inp = "w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Plus size={18} className="text-purple-600" /> Add Candidate Manually</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">Full Name *</label><input className={inp} value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="John Doe" /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Email</label><input className={inp} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@example.com" /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Phone</label><input className={inp} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 9999999999" /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Designation</label><input className={inp} value={form.designation} onChange={e => set("designation", e.target.value)} placeholder="Software Engineer" /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Current Company</label><input className={inp} value={form.currentCompany} onChange={e => set("currentCompany", e.target.value)} placeholder="Acme Corp" /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Location</label><input className={inp} value={form.location} onChange={e => set("location", e.target.value)} placeholder="Pune, India" /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Experience (years)</label><input className={inp} type="number" min="0" value={form.totalExperience} onChange={e => set("totalExperience", e.target.value)} placeholder="3" /></div>
            <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">Skills (comma separated)</label><input className={inp} value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="React, Node.js, MongoDB" /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">GitHub URL</label><input className={inp} value={form.githubUrl} onChange={e => set("githubUrl", e.target.value)} placeholder="https://github.com/..." /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">LinkedIn URL</label><input className={inp} value={form.linkedinUrl} onChange={e => set("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
            <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">Summary</label><textarea className={inp} rows={3} value={form.summary} onChange={e => set("summary", e.target.value)} placeholder="Brief about the candidate..." /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
              {saving ? "Saving..." : "Add Candidate"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Platform Config Modal ─────────────────────────────────────────────────────
function PlatformModal({ onClose }) {
  const platforms = [
    { id: "github",        label: "GitHub",        icon: "🐙", status: "active",   desc: "Fetches developer profiles via GitHub API" },
    { id: "linkedin",      label: "LinkedIn",      icon: "💼", status: "inactive", desc: "Requires LinkedIn API access (not configured)" },
    { id: "indeed",        label: "Indeed",        icon: "📋", status: "inactive", desc: "Requires Indeed API access (not configured)" },
    { id: "naukri",        label: "Naukri",        icon: "🇮🇳", status: "inactive", desc: "Requires Naukri API access (not configured)" },
    { id: "stackoverflow", label: "Stack Overflow", icon: "📚", status: "inactive", desc: "Requires Stack Overflow API access" },
    { id: "devto",         label: "Dev.to",        icon: "✍️", status: "inactive", desc: "Fetches developer articles and profiles" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Settings size={18} className="text-blue-600" /> Sourcing Platforms</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {platforms.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-xl">{p.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.desc}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                {p.status === "active" ? "✓ Active" : "Inactive"}
              </span>
            </div>
          ))}
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">Currently only GitHub is active. Other platforms require API credentials in .env</p>
        </div>
        <div className="p-5 pt-0">
          <Button className="w-full" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

// ── Candidate Card ────────────────────────────────────────────────────────────
function CandidateCard({ candidate, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${candidate.fullName}?`)) return;
    setDeleting(true);
    try {
      const { data } = await axios.delete(`${ADMIN_SOURCING_API}/${candidate._id}`, { withCredentials: true });
      if (data.success) { toast.success("Deleted."); onDelete(candidate._id); }
    } catch { toast.error("Delete failed."); }
    finally { setDeleting(false); }
  };

  const srcType = candidate.sourceType || candidate.aiSourceType || "";
  const colorCls = SOURCE_COLORS[srcType] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{candidate.fullName}</h3>
          {candidate.designation && <p className="text-xs text-gray-500 truncate">{candidate.designation}</p>}
          {candidate.currentCompany && <p className="text-xs text-gray-400 truncate">{candidate.currentCompany}</p>}
        </div>
        <button onClick={handleDelete} disabled={deleting} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 shrink-0 disabled:opacity-50">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        {candidate.totalExperience > 0 && <div>🕐 {candidate.totalExperience}y exp</div>}
        {candidate.location && <div>📍 {candidate.location}</div>}
        {candidate.emails?.[0] && <div className="truncate">✉️ <a href={`mailto:${candidate.emails[0]}`} className="text-blue-600 hover:underline">{candidate.emails[0]}</a></div>}
        {candidate.phones?.[0] && <div>📞 <a href={`tel:${candidate.phones[0]}`} className="text-blue-600 hover:underline">{candidate.phones[0]}</a></div>}
        {candidate.githubUrl && <div>🔗 <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a></div>}
        {candidate.linkedinUrl && <div>💼 <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a></div>}
      </div>

      {candidate.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {candidate.skills.slice(0, 4).map((s, i) => <Badge key={i} className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0">{s}</Badge>)}
          {candidate.skills.length > 4 && <Badge className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0">+{candidate.skills.length - 4}</Badge>}
        </div>
      )}

      <div className="mt-auto">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorCls}`}>{srcType.replace(/_/g, " ")}</span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const AdminAISourcing = () => {
  const [candidates, setCandidates]   = useState([]);
  const [stats, setStats]             = useState(null);
  const [autoStats, setAutoStats]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [triggering, setTriggering]   = useState(false);
  const [pagination, setPagination]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters]         = useState({ q: "", skills: "", location: "", sourceType: "" });
  const [showManual, setShowManual]   = useState(false);
  const [showPlatform, setShowPlatform] = useState(false);

  useEffect(() => { fetchStats(); fetchAutoStats(); fetchCandidates({}, 1); }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${ADMIN_SOURCING_API}/stats`, { withCredentials: true });
      if (data.success) setStats(data.stats);
    } catch {}
  };

  const fetchAutoStats = async () => {
    try {
      const { data } = await axios.get(`${ADMIN_SOURCING_API}/auto-stats`, { withCredentials: true });
      if (data.success) setAutoStats(data.stats);
    } catch {}
  };

  const fetchCandidates = useCallback(async (f, page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: ITEMS_PER_PAGE };
      if (f.q?.trim())          params.q         = f.q.trim();
      if (f.skills?.trim())     params.skills     = f.skills.trim();
      if (f.location?.trim())   params.location   = f.location.trim();
      if (f.sourceType?.trim()) params.sourceType = f.sourceType.trim();
      const { data } = await axios.get(`${ADMIN_SOURCING_API}/candidates`, { params, withCredentials: true });
      if (data.success) { setCandidates(data.candidates); setPagination(data.pagination); setCurrentPage(page); }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to fetch candidates."); }
    finally { setLoading(false); }
  }, []);

  const handleTrigger = async () => {
    if (!window.confirm("Trigger auto-sourcing now? GitHub will be fetched for all verified recruiters.")) return;
    setTriggering(true);
    try {
      const { data } = await axios.post(`${ADMIN_SOURCING_API}/trigger`, {}, { withCredentials: true });
      if (data.success) {
        toast.success("Triggered! Candidates will appear in ~30 seconds.");
        setTimeout(() => { fetchStats(); fetchAutoStats(); fetchCandidates(filters, 1); }, 15000);
      }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to trigger"); }
    finally { setTriggering(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchCandidates(filters, 1); };
  const handleClear  = () => { const f = { q: "", skills: "", location: "", sourceType: "" }; setFilters(f); fetchCandidates(f, 1); };
  const handleDeleted = (id) => { setCandidates(p => p.filter(c => c._id !== id)); fetchStats(); };

  const inp = "w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

  const statCards = [
    { label: "Total Sourced",     value: stats?.total ?? 0,                      color: "text-purple-600" },
    { label: "GitHub",            value: stats?.bySource?.GITHUB_PROFILE ?? 0,   color: "text-orange-600" },
    { label: "LinkedIn",          value: stats?.bySource?.LINKEDIN_PROFILE ?? 0, color: "text-blue-700"   },
    { label: "Public Profiles",   value: stats?.bySource?.PUBLIC_PROFILE ?? 0,   color: "text-teal-600"   },
    { label: "CSV Imports",       value: stats?.bySource?.CSV_IMPORT ?? 0,       color: "text-green-600"  },
    { label: "Manual Entries",    value: stats?.bySource?.MANUAL ?? 0,           color: "text-pink-600"   },
    { label: "API Imports",       value: stats?.bySource?.API_IMPORT ?? 0,       color: "text-indigo-600" },
  ];

  return (
    <>
      <Navbar linkName="AI Sourcing" />
      {showManual   && <ManualModal   onClose={() => setShowManual(false)}   onSaved={() => { fetchStats(); fetchCandidates(filters, 1); }} />}
      {showPlatform && <PlatformModal onClose={() => setShowPlatform(false)} />}

      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain size={24} className="text-purple-600" /> AI Sourcing — Admin View
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All sourced candidates across all recruiters</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setShowPlatform(true)} className="flex items-center gap-2 text-sm">
              <Settings size={15} /> Platforms
            </Button>
            <Button onClick={() => setShowManual(true)} variant="outline" className="flex items-center gap-2 text-sm border-purple-400 text-purple-700 hover:bg-purple-50">
              <Plus size={15} /> Add Manually
            </Button>
            <Button onClick={handleTrigger} disabled={triggering} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2 text-sm">
              {triggering ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Triggering...</> : <><Play size={15} /> Trigger Auto-Sourcing</>}
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
          {statCards.map(c => (
            <Card key={c.label} className="p-3 border-0 shadow-sm bg-white dark:bg-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            </Card>
          ))}
        </div>

        {/* Auto-Sourcing Stats */}
        {autoStats && (
          <Card className="p-4 mb-5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Zap size={15} className="text-purple-600" /> Auto-Sourcing Statistics
              </h3>
              {autoStats.lastRunAt && <span className="text-xs text-gray-500">Last run: {new Date(autoStats.lastRunAt).toLocaleString()}</span>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-xs text-gray-500">Total Runs</p><p className="text-xl font-bold text-purple-600">{autoStats.totalRuns || 0}</p></div>
              <div><p className="text-xs text-gray-500">Total Imported</p><p className="text-xl font-bold text-green-600">{autoStats.totalImported || 0}</p></div>
              <div><p className="text-xs text-gray-500">Total Skipped</p><p className="text-xl font-bold text-orange-600">{autoStats.totalSkipped || 0}</p></div>
              <div><p className="text-xs text-gray-500">Last Run</p><p className="text-xl font-bold text-blue-600">{autoStats.lastRunResult?.imported || 0} imported</p></div>
            </div>
          </Card>
        )}

        {/* Search */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-5 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input className={inp} placeholder="Search name, company, designation..." value={filters.q} onChange={e => setFilters(p => ({ ...p, q: e.target.value }))} />
            <input className={inp} placeholder="Skills (e.g. React, Python)" value={filters.skills} onChange={e => setFilters(p => ({ ...p, skills: e.target.value }))} />
            <input className={inp} placeholder="Location" value={filters.location} onChange={e => setFilters(p => ({ ...p, location: e.target.value }))} />
            <select className={inp} value={filters.sourceType} onChange={e => setFilters(p => ({ ...p, sourceType: e.target.value }))}>
              <option value="">All Sources</option>
              <option value="GITHUB">GitHub</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="NAUKRI">Naukri</option>
              <option value="INDEED">Indeed</option>
              <option value="CSV_IMPORT">CSV Import</option>
              <option value="MANUAL">Manual</option>
              <option value="API_IMPORT">API Import</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5"><Search size={14} className="mr-1.5" /> Search</Button>
            <Button type="button" variant="outline" onClick={handleClear}><X size={14} className="mr-1" /> Clear</Button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20"><span className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" /></div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg">No candidates found.</p>
            <p className="text-sm mt-1">Trigger auto-sourcing or add one manually.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{pagination?.total ?? candidates.length} candidate{(pagination?.total ?? 0) !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {candidates.map(c => <CandidateCard key={c._id} candidate={c} onDelete={handleDeleted} />)}
            </div>
            {pagination?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button variant="outline" size="sm" disabled={!pagination.hasPrev} onClick={() => fetchCandidates(filters, currentPage - 1)}><ChevronLeft size={16} /></Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
                <Button variant="outline" size="sm" disabled={!pagination.hasNext} onClick={() => fetchCandidates(filters, currentPage + 1)}><ChevronRight size={16} /></Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminAISourcing;
