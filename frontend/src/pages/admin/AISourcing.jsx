import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Search, Eye, Trash2, Brain, Zap, ChevronLeft, ChevronRight, FileText, X, Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/admin/Navbar";
import { SOURCING_API_END_POINT, BACKEND_URL } from "@/utils/ApiEndPoint";

const BASE_API = import.meta.env.VITE_API_URL + "/api/v1";
const ADMIN_SOURCING_API = `${BASE_API}/admin/sourcing`;
const AUTO_SOURCING_API = `${BASE_API}/auto-sourcing`;
const ITEMS_PER_PAGE = 12;

// ── Stats Cards ───────────────────────────────────────────────────────────────
function StatsBar({ stats, autoStats }) {
  const cards = [
    { label: "Total Sourced", value: stats?.total ?? 0, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Resume Uploads", value: stats?.bySource?.RESUME_UPLOAD ?? 0, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "CSV Imports", value: stats?.bySource?.CSV_IMPORT ?? 0, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "GitHub Profiles", value: stats?.bySource?.GITHUB_PROFILE ?? 0, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "LinkedIn Profiles", value: stats?.bySource?.LINKEDIN_PROFILE ?? 0, color: "text-blue-700", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Public Profiles", value: stats?.bySource?.PUBLIC_PROFILE ?? 0, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/20" },
    { label: "Manual Entries", value: stats?.bySource?.MANUAL ?? 0, color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-900/20" },
  ];
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-4">
        {cards.map((c) => (
          <Card key={c.label} className={`p-4 ${c.bg} border-0 shadow-sm`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          </Card>
        ))}
      </div>
      
      {/* Auto-Sourcing Stats */}
      {autoStats && (
        <Card className="p-4 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Zap size={16} className="text-purple-600" /> Auto-Sourcing Statistics
            </h3>
            {autoStats.lastRunAt && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last run: {new Date(autoStats.lastRunAt).toLocaleString()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Runs</p>
              <p className="text-xl font-bold text-purple-600">{autoStats.totalRuns || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Imported</p>
              <p className="text-xl font-bold text-green-600">{autoStats.totalImported || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Skipped</p>
              <p className="text-xl font-bold text-orange-600">{autoStats.totalSkipped || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Run Result</p>
              <p className="text-xl font-bold text-blue-600">
                {autoStats.lastRunResult?.imported || 0} imported
              </p>
            </div>
          </div>
        </Card>
      )}
    </>
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

  const sourceColors = {
    RESUME_UPLOAD: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    CSV_IMPORT: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    GITHUB_PROFILE: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    LINKEDIN_PROFILE: "bg-blue-200 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200",
    PUBLIC_PROFILE: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    MANUAL: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    API_IMPORT: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{candidate.fullName}</h3>
          {candidate.designation && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{candidate.designation}</p>}
          {candidate.currentCompany && <p className="text-xs text-gray-400 truncate">{candidate.currentCompany}</p>}
        </div>
        <div className="flex gap-1.5 shrink-0">
          {candidate.resumeUrl && (
            <a href={`${BACKEND_URL}${candidate.resumeUrl}`} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors" title="View Resume">
              <Eye size={14} />
            </a>
          )}
          <button onClick={handleDelete} disabled={deleting}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors disabled:opacity-50">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
        {candidate.totalExperience > 0 && <div className="flex items-center gap-1">🕐 {candidate.totalExperience}y exp</div>}
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
        {candidate.githubUrl && (
          <div className="flex items-center gap-1">
            <span>🔗</span>
            <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">
              GitHub
            </a>
          </div>
        )}
        {candidate.linkedinUrl && (
          <div className="flex items-center gap-1">
            <span>💼</span>
            <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">
              LinkedIn
            </a>
          </div>
        )}
      </div>

      {candidate.skills?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {candidate.skills.slice(0, 4).map((s, i) => (
            <Badge key={i} className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0">{s}</Badge>
          ))}
          {candidate.skills.length > 4 && <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs px-1.5 py-0">+{candidate.skills.length - 4}</Badge>}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceColors[candidate.sourceType] || "bg-gray-100 text-gray-600"}`}>
          {candidate.sourceType?.replace(/_/g, " ")}
        </span>
        {candidate.createdBy?.fullName && (
          <span className="text-xs text-gray-400 truncate max-w-[100px]">by {candidate.createdBy.fullName}</span>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const AdminAISourcing = () => {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [autoStats, setAutoStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ q: "", skills: "", location: "", sourceType: "" });
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    axios.get(`${SOURCING_API_END_POINT}/ai-health`, { withCredentials: true })
      .then(({ data }) => setAiAvailable(data.success))
      .catch(() => setAiAvailable(false));
    fetchStats();
    fetchAutoStats();
    fetchCandidates({}, 1);
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${ADMIN_SOURCING_API}/stats`, { withCredentials: true });
      if (data.success) setStats(data.stats);
    } catch { /* silent */ }
  };

  const fetchAutoStats = async () => {
    try {
      const { data } = await axios.get(`${AUTO_SOURCING_API}/stats`, { withCredentials: true });
      if (data.success) setAutoStats(data.stats);
    } catch { /* silent */ }
  };

  const handleTriggerAutoSourcing = async () => {
    if (!window.confirm('Trigger auto-sourcing now? This will fetch candidates from all enabled platforms (GitHub, LinkedIn, Indeed, Naukri) for all verified recruiters.')) return;
    
    setTriggering(true);
    try {
      const { data } = await axios.post(`${AUTO_SOURCING_API}/trigger`, {}, { withCredentials: true });
      if (data.success) {
        toast.success(data.message || 'Auto-sourcing triggered! Check console logs for progress.');
        // Refresh stats after a delay
        setTimeout(() => {
          fetchStats();
          fetchAutoStats();
          fetchCandidates(filters, 1);
        }, 5000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to trigger auto-sourcing');
    } finally {
      setTriggering(false);
    }
  };

  const fetchCandidates = useCallback(async (f = filters, page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: ITEMS_PER_PAGE };
      if (f.q?.trim())          params.q          = f.q.trim();
      if (f.skills?.trim())     params.skills      = f.skills.trim();
      if (f.location?.trim())   params.location    = f.location.trim();
      if (f.sourceType?.trim()) params.sourceType  = f.sourceType.trim();

      const { data } = await axios.get(`${ADMIN_SOURCING_API}/candidates`, { params, withCredentials: true });
      if (data.success) {
        setCandidates(data.candidates);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch candidates.");
    } finally { setLoading(false); }
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates(filters, 1);
  };

  const handleClear = () => {
    const empty = { q: "", skills: "", location: "", sourceType: "" };
    setFilters(empty);
    fetchCandidates(empty, 1);
  };

  const handleDeleted = (id) => {
    setCandidates((prev) => prev.filter((c) => c._id !== id));
    if (pagination) setPagination((p) => ({ ...p, total: p.total - 1 }));
    fetchStats();
  };

  const inputCls = "w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <>
      <Navbar linkName="AI Sourcing" />
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain size={24} className="text-purple-600" /> AI Sourcing — Admin View
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All sourced candidates across all recruiters</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border
              ${aiAvailable
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"}`}>
              <Zap size={12} /> AI {aiAvailable ? "Ready" : "Offline"}
            </div>
            <Button 
              onClick={handleTriggerAutoSourcing} 
              disabled={triggering}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 shadow-lg"
            >
              {triggering ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Triggering...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play size={16} /> Trigger Auto-Sourcing
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} autoStats={autoStats} />

        {/* Search */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input className={inputCls} placeholder="Search name, company, designation..." value={filters.q} onChange={(e) => setFilters(p => ({ ...p, q: e.target.value }))} />
            <input className={inputCls} placeholder="Skills (e.g. React, Python)" value={filters.skills} onChange={(e) => setFilters(p => ({ ...p, skills: e.target.value }))} />
            <input className={inputCls} placeholder="Location" value={filters.location} onChange={(e) => setFilters(p => ({ ...p, location: e.target.value }))} />
            <select className={inputCls} value={filters.sourceType} onChange={(e) => setFilters(p => ({ ...p, sourceType: e.target.value }))}>
              <option value="">All Sources</option>
              <option value="RESUME_UPLOAD">Resume Upload</option>
              <option value="CSV_IMPORT">CSV Import</option>
              <option value="GITHUB_PROFILE">GitHub</option>
              <option value="LINKEDIN_PROFILE">LinkedIn</option>
              <option value="PUBLIC_PROFILE">Indeed/Naukri</option>
              <option value="MANUAL">Manual</option>
              <option value="API_IMPORT">API Import</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5">
              <Search size={14} className="mr-1.5" /> Search
            </Button>
            <Button type="button" variant="outline" onClick={handleClear}>
              <X size={14} className="mr-1" /> Clear
            </Button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <FileText size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg">No sourced candidates found.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {pagination?.total ?? candidates.length} candidate{(pagination?.total ?? candidates.length) !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {candidates.map((c) => (
                <CandidateCard key={c._id} candidate={c} onDelete={handleDeleted} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button variant="outline" size="sm" disabled={!pagination.hasPrev} onClick={() => fetchCandidates(filters, currentPage - 1)}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={!pagination.hasNext} onClick={() => fetchCandidates(filters, currentPage + 1)}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminAISourcing;
