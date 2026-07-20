import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Clock, Mail, Phone, User, CheckCircle, Circle, RefreshCw } from "lucide-react";
import Navbar from "@/components/admin/Navbar";
import { SUPPORT_QUERIES_API_END_POINT } from "@/utils/ApiEndPoint";

const STATUS_TABS = ["all", "unseen", "seen"];

const statusBadge = (status) =>
  status === "unseen"
    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
    : "bg-green-100 text-green-700 border border-green-200";

const SupportQueries = () => {
  const [queries, setQueries]   = useState([]);
  const [total, setTotal]       = useState(0);
  const [tab, setTab]           = useState("all");
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);
  const LIMIT = 15;

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, ...(tab !== "all" && { status: tab }) };
      const { data } = await axios.get(SUPPORT_QUERIES_API_END_POINT, { params, withCredentials: true });
      if (data.success) { setQueries(data.queries); setTotal(data.total); }
    } catch {
      toast.error("Failed to load support queries");
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => { fetchQueries(); }, [fetchQueries]);

  const markStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(
        `${SUPPORT_QUERIES_API_END_POINT}/${id}/status`,
        { status },
        { withCredentials: true }
      );
      if (data.success) {
        setQueries((prev) => prev.map((q) => (q._id === id ? { ...q, status } : q)));
        toast.success(`Marked as ${status}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);
  const unseenCount = queries.filter((q) => q.status === "unseen").length;

  return (
    <>
      <Navbar linkName="Support Queries" />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 pt-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Support Queries</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{total} total · {unseenCount} unread</p>
            </div>
            <button
              onClick={fetchQueries}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {STATUS_TABS.map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : queries.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">No queries found.</div>
          ) : (
            <div className="space-y-3">
              {queries.map((q) => (
                <div
                  key={q._id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all ${
                    q.status === "unseen"
                      ? "border-yellow-200 dark:border-yellow-700/40"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {/* Row header */}
                  <div
                    className="flex items-start justify-between gap-4 p-4 cursor-pointer"
                    onClick={() => setExpanded(expanded === q._id ? null : q._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800 dark:text-white flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" /> {q.name || "—"}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusBadge(q.status)}`}>
                          {q.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{q.email || "—"}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{q.phoneNumber || "—"}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(q.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {q.status === "unseen" ? (
                        <button
                          onClick={() => markStatus(q._id, "seen")}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-700/40"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Seen
                        </button>
                      ) : (
                        <button
                          onClick={() => markStatus(q._id, "unseen")}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                        >
                          <Circle className="w-3.5 h-3.5" /> Mark Unread
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded message */}
                  {expanded === q._id && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {q.message || "No message content."}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default SupportQueries;
