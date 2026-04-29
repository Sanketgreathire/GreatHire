import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/admin/Navbar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Search, MessageSquare, Monitor, GraduationCap, PhoneCall,
  ChevronLeft, ChevronRight, Trash2,
} from "lucide-react";
import axios from "axios";
import { COURSE_API_END_POINT } from "@/utils/ApiEndPoint";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

const TABS = [
  { key: "enquiry",    label: "Enquiries",          Icon: MessageSquare },
  { key: "demo",       label: "Demo Sessions",      Icon: Monitor },
  { key: "enrollment", label: "Enrollments",        Icon: GraduationCap },
  { key: "counsellor", label: "Talk to Counsellor", Icon: PhoneCall },
];

const STATUS_COLORS = {
  new:       "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  enrolled:  "bg-green-100 text-green-700",
  closed:    "bg-gray-100 text-gray-600",
};

const ITEMS_PER_PAGE = 15;

const Courses = () => {
  const [activeTab, setActiveTab]         = useState("enquiry");
  const [search, setSearch]               = useState("");
  const [page, setPage]                   = useState(1);
  const [data, setData]                   = useState([]);
  const [total, setTotal]                 = useState(0);
  const [summary, setSummary]             = useState({ enquiry: 0, demo: 0, enrollment: 0, counsellor: 0 });
  const [loading, setLoading]             = useState(false);
  const [updatingId, setUpdatingId]       = useState(null);
  const [deletingId, setDeletingId]       = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord]  = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${COURSE_API_END_POINT}/admin/all`, {
        params: { type: activeTab, page, limit: ITEMS_PER_PAGE },
        withCredentials: true,
      });
      if (res.data.success) {
        setData(res.data.data);
        setTotal(res.data.total);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleTabChange = (tab) => { setActiveTab(tab); setPage(1); setSearch(""); };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.patch(
        `${COURSE_API_END_POINT}/admin/${id}/status`,
        { status },
        { withCredentials: true }
      );
      setData((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await axios.delete(
        `${COURSE_API_END_POINT}/admin/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setData((prev) => prev.filter((r) => r._id !== id));
        setTotal((prev) => prev - 1);
        setSummary((prev) => ({ ...prev, [activeTab]: Math.max(0, prev[activeTab] - 1) }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) ||
      r.phone?.includes(q) || r.courseName?.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const stats = [
    { title: "Total Enquiries",    count: summary.enquiry,    Icon: MessageSquare, color: "text-blue-600",   bg: "bg-blue-100",   tab: "enquiry" },
    { title: "Demo Sessions",      count: summary.demo,       Icon: Monitor,       color: "text-green-600",  bg: "bg-green-100",  tab: "demo" },
    { title: "Enrollments",        count: summary.enrollment, Icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-100", tab: "enrollment" },
    { title: "Talk to Counsellor", count: summary.counsellor, Icon: PhoneCall,     color: "text-orange-600", bg: "bg-orange-100", tab: "counsellor" },
  ];

  return (
    <>
      <Navbar linkName="Courses" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

        {/* Stat Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <Card
              key={i}
              onClick={() => handleTabChange(s.tab)}
              className={`flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow-sm rounded-2xl cursor-pointer transition-all border-2 ${
                activeTab === s.tab
                  ? "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900"
                  : "border-gray-100 dark:border-gray-700 hover:border-blue-300"
              }`}
            >
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{s.title}</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-1">{s.count}</p>
              </div>
              <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}><s.Icon size={26} /></div>
            </Card>
          ))}
        </div>

        {/* Table Section */}
        <div className="px-6 pb-10">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6">

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                {TABS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                      activeTab === key
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400"
                    }`}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <Input
                  placeholder="Search by name, email, course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <Table className="min-w-max w-full">
                <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold w-10">#</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Name</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Email</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Phone</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Course</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Mode</TableHead>
                    {activeTab === "demo" && (
                      <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Batch</TableHead>
                    )}
                    {activeTab === "enrollment" && (
                      <>
                        <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Fee</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Payment ID</TableHead>
                      </>
                    )}
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Date</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                    {/* ✅ Delete column header */}
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-10 text-gray-400">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filtered.length > 0 ? (
                    filtered.map((row, idx) => (
                      <TableRow
                        key={row._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700"
                      >
                        <TableCell className="text-gray-500 text-sm">
                          {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-800 dark:text-gray-200">
                          {row.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                          {row.email}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                          {row.phone}
                        </TableCell>
                        <TableCell>
                          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                            {row.courseName}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                          {row.mode}
                        </TableCell>
                        {activeTab === "demo" && (
                          <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                            {row.batch || "—"}
                          </TableCell>
                        )}
                        {activeTab === "enrollment" && (
                          <>
                            <TableCell className="text-gray-600 dark:text-gray-400 text-sm font-semibold text-green-600">
                              {row.fee || "—"}
                            </TableCell>
                            <TableCell className="text-gray-500 text-xs font-mono">
                              {row.paymentId ? (
                                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{row.paymentId}</span>
                              ) : (
                                <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full">Pending</span>
                              )}
                            </TableCell>
                          </>
                        )}
                        <TableCell className="text-gray-500 text-xs whitespace-nowrap">
                          {new Date(row.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <select
                            value={row.status}
                            disabled={updatingId === row._id}
                            onChange={(e) => handleStatusChange(row._id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[row.status]}`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="closed">Closed</option>
                          </select>
                        </TableCell>

                        {/* ✅ Delete icon cell */}
                        <TableCell className="text-center">
                          {deletingId === row._id ? (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">...</span>
                          ) : (
                            <Trash2
                              size={18}
                              className="text-red-500 dark:text-red-400 cursor-pointer hover:scale-110 transition mx-auto"
                              onClick={() => {
                                setSelectedRecord(row);
                                setShowDeleteModal(true);
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 mt-6 flex-wrap">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  className="px-2"
                >
                  <ChevronLeft size={16} />
                </Button>

                {(() => {
                  const pages = [];
                  const delta = 2;
                  const left = Math.max(2, page - delta);
                  const right = Math.min(totalPages - 1, page + delta);

                  pages.push(1);
                  if (left > 2) pages.push("...");
                  for (let i = left; i <= right; i++) pages.push(i);
                  if (right < totalPages - 1) pages.push("...");
                  if (totalPages > 1) pages.push(totalPages);

                  return pages.map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">…</span>
                    ) : (
                      <Button
                        key={p}
                        onClick={() => setPage(p)}
                        size="sm"
                        className={`px-3 ${
                          page === p
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {p}
                      </Button>
                    )
                  );
                })()}

                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                  className="px-2"
                >
                  <ChevronRight size={16} />
                </Button>

                <span className="text-xs text-gray-400 ml-2">
                  Page {page} of {totalPages} &nbsp;·&nbsp; {total} records
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={() => {
            setShowDeleteModal(false);
            handleDelete(selectedRecord._id);
          }}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedRecord(null);
          }}
        />
      )}
    </>
  );
};

export default Courses;