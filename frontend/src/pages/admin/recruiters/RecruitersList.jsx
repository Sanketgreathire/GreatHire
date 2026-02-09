// RecruitersList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash,
  Eye,
  Briefcase,
  UserCheck,
  XCircle,
  MessageSquare,
  Ban,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { FaRegUser } from "react-icons/fa";
import Navbar from "@/components/admin/Navbar";
import { useSelector, useDispatch } from "react-redux";
import {
  ADMIN_RECRUITER_DATA_API_END_POINT,
  RECRUITER_API_END_POINT,
} from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchRecruiterStats, fetchJobStats } from "@/redux/admin/statsSlice";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

/**
 * Rewritten RecruitersList.jsx
 * - Removes MUI
 * - Uses Tailwind + existing UI components
 * - Adds skeleton loaders, compact pagination, tooltips
 * - Keeps blocking, messaging, delete, toggle behaviors and redux updates
 */

const ITEMS_PER_PAGE = 20;

const StatCard = ({ title, count, icon, bg, color }) => (
  <Card className="p-4 flex items-center justify-between bg-white shadow rounded-xl">
    <div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold mt-1">{count}</p>
    </div>
    <div className={`p-2 rounded-full ${bg} ${color}`}>{icon}</div>
  </Card>
);

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 rounded w-40 bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 rounded w-32 bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 rounded w-28 bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 rounded w-24 bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 rounded w-16 bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 rounded w-20 bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
      </div>
    </TableCell>
  </TableRow>
);

const CompactPagination = ({ page, setPage, totalPages }) => {
  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Previous
      </Button>

      {pageNumbers[0] > 1 && (
        <>
          <Button size="sm" onClick={() => setPage(1)}>
            1
          </Button>
          {pageNumbers[0] > 2 && <span className="px-2">…</span>}
        </>
      )}

      {pageNumbers.map((p) => (
        <Button
          key={p}
          size="sm"
          onClick={() => setPage(p)}
          className={page === p ? "bg-blue-700 text-white" : ""}
        >
          {p}
        </Button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2">…</span>
          )}
          <Button size="sm" onClick={() => setPage(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="ghost"
        disabled={page === totalPages || totalPages === 0}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      >
        Next
      </Button>
    </div>
  );
};

const RecruitersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All"); // "All" | true | false
  const [page, setPage] = useState(1);

  const [recruiterList, setRecruiterList] = useState([]);
  const recruiterStats = useSelector((state) => state.stats.recruiterStatsData);
  const jobStats = useSelector((state) => state.stats.jobStatsData);
  const { user } = useSelector((state) => state.auth);

  const [isFetching, setIsFetching] = useState(false);
  const [loadingMap, setLoadingMap] = useState({});
  const [dloadingMap, setDLoadingMap] = useState({});
  const [blockingMap, setBlockingMap] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedMessageRecruiter, setSelectedMessageRecruiter] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  const stats = [
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0,
      icon: <FaRegUser size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Recruiters",
      count: recruiterStats?.totalActiveRecruiters || 0,
      icon: <UserCheck size={20} />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Deactive Recruiter",
      count: recruiterStats?.totalDeactiveRecruiters || 0,
      icon: <XCircle size={20} />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Posted Jobs",
      count: jobStats?.totalJobs || 0,
      icon: <Briefcase size={20} />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  // Fetch all recruiters (admin)
  const fetchRecruiterList = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${ADMIN_RECRUITER_DATA_API_END_POINT}/getAllRecruiter-stats`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setRecruiterList(response.data.recruiters || []);
      } else {
        toast.error(response.data.message || "Failed to fetch recruiters");
      }
    } catch (err) {
      console.error("error in recruiter fetching", err);
      toast.error("Error fetching recruiters. Check console for details.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchRecruiterList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Toggle active
  const toggleActive = async (companyId, recruiterId, newIsActive, isAdmin) => {
    setLoadingMap((s) => ({ ...s, [recruiterId]: true }));
    try {
      const response = await axios.put(
        `${RECRUITER_API_END_POINT}/toggle-active`,
        { recruiterId, companyId, isActive: newIsActive },
        { withCredentials: true }
      );
      if (response.data.success) {
        if (isAdmin) {
          setRecruiterList((prevList) =>
            prevList.map((r) =>
              r.companyId === companyId ? { ...r, isActive: newIsActive } : r
            )
          );
        } else {
          setRecruiterList((prevList) =>
            prevList.map((r) =>
              r._id === recruiterId ? { ...r, isActive: newIsActive } : r
            )
          );
        }
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());
        toast.success(response.data.message || "Status updated");
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("toggleActive error", err);
      toast.error("Error toggling status");
    } finally {
      setLoadingMap((s) => ({ ...s, [recruiterId]: false }));
    }
  };

  // Toggle block/unblock
  const toggleBlock = async (recruiterId, companyId, currentBlocked) => {
    setBlockingMap((s) => ({ ...s, [recruiterId]: true }));
    try {
      const updatedBlockStatus = !currentBlocked;
      const response = await axios.put(
        `${RECRUITER_API_END_POINT}/toggle-block`,
        { recruiterId, companyId, isBlocked: updatedBlockStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        setRecruiterList((prevList) =>
          prevList.map((r) =>
            r._id === recruiterId
              ? { ...r, isBlocked: updatedBlockStatus, isActive: !updatedBlockStatus }
              : r
          )
        );
        toast.success(response.data.message || "Block status updated");
      } else {
        toast.error(response.data.message || "Failed to update block status");
      }
    } catch (err) {
      console.error("toggleBlock error", err);
      toast.error("Error toggling block status");
    } finally {
      setBlockingMap((s) => ({ ...s, [recruiterId]: false }));
    }
  };

  // Send message to recruiter
  const sendMessageToRecruiter = async () => {
    if (!selectedMessageRecruiter) return;
    if (!messageText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    setSendingMessage(true);
    try {
      const response = await axios.post(
        `${ADMIN_RECRUITER_DATA_API_END_POINT}/send-message`,
        { recruiterId: selectedMessageRecruiter._id, message: messageText },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Message sent successfully");
        setShowMessageModal(false);
        setMessageText("");
      } else {
        toast.error(response.data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("sendMessage error", err);
      toast.error("Error sending message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Delete recruiter
  const deleteRecruiter = async (recruiterId, userEmail, companyId, isAdmin) => {
    setDLoadingMap((s) => ({ ...s, [recruiterId]: true }));
    try {
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: { userEmail, companyId },
        withCredentials: true,
      });
      if (response.data.success) {
        if (isAdmin) {
          setRecruiterList((prev) =>
            prev.filter((r) => r.companyId !== companyId)
          );
        } else {
          setRecruiterList((prev) => prev.filter((r) => r._id !== recruiterId));
        }
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());
        toast.success(response.data.message || "Recruiter deleted");
      } else {
        toast.error(response.data.message || "Failed to delete recruiter");
      }
    } catch (err) {
      console.error("deleteRecruiter error", err);
      toast.error("Error deleting recruiter");
    } finally {
      setDLoadingMap((s) => ({ ...s, [recruiterId]: false }));
    }
  };

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    if (selectedRecruiter) {
      deleteRecruiter(
        selectedRecruiter._id,
        selectedRecruiter.email,
        selectedRecruiter.companyId,
        selectedRecruiter.isAdmin
      );
      setSelectedRecruiter(null);
    }
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedRecruiter(null);
  };

  // Filters & pagination
  const filteredRecruiters = recruiterList.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (r.fullname || "").toLowerCase().includes(q) ||
      (r.companyName || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
      (String(r.phone ?? "")).toLowerCase().includes(q);
    const matchesStatus = status === "All" ? true : r.isActive === (status === true);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecruiters.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRecruiters.length]);

  const paginatedRecruiters = filteredRecruiters.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
  <>
    <Navbar linkName={"Recruiters List"} />

    {/* Stats */}
    <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, idx) => (
        <StatCard key={idx} {...s} />
      ))}
    </div>

    <div className="mx-4 sm:mx-6 mb-10 p-4 sm:p-6 bg-white shadow rounded-lg">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-1/2">
          <Input
            placeholder="Search by name, email, contact, company"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatus("All");
              setPage(1);
            }}
            title="Reset filters"
            className="self-start sm:self-auto"
          >
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 whitespace-nowrap">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              const val = e.target.value;
              setStatus(val === "All" ? "All" : val === "true");
              setPage(1);
            }}
            className="h-10 px-3 border rounded-md bg-white focus:outline-none w-full sm:w-auto"
            aria-label="Filter by status"
          >
            <option value="All">All Status</option>
            <option value="true">Active</option>
            <option value="false">Deactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-sm">Recruiter Name</TableHead>
              <TableHead className="whitespace-nowrap text-sm">Company</TableHead>
              <TableHead className="whitespace-nowrap text-sm">Contact</TableHead>
              <TableHead className="whitespace-nowrap text-sm">Position</TableHead>
              <TableHead className="whitespace-nowrap text-sm">Posted Jobs</TableHead>
              <TableHead className="whitespace-nowrap text-sm">Status</TableHead>
              <TableHead className="whitespace-nowrap text-sm">Join Date</TableHead>
              <TableHead className="whitespace-nowrap text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isFetching
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : paginatedRecruiters.length > 0
              ? paginatedRecruiters.map((r) => (
                  <TableRow
                    key={r._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-start gap-3 min-w-[220px]">
                        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                          {r.fullname ? r.fullname.charAt(0).toUpperCase() : "R"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium flex flex-wrap items-center gap-2">
                            <span className="break-words">{r.fullname}</span>
                            {r.isAdmin && (
                              <span className="inline-block text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 break-all">
                            {r.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {r.companyName}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {r.phone}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {r.position}
                    </TableCell>

                    <TableCell className="text-center">
                      {r.postedJobs ?? 0}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          r.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {r.isActive ? "Active" : "Deactive"}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {r.joined}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2 min-w-[200px]">
                        {/* View */}
                        <button
                          title="View recruiter details"
                          onClick={() =>
                            navigate(`/admin/recruiter/details/${r._id}`)
                          }
                          className="p-2 rounded bg-slate-100 hover:bg-slate-200"
                        >
                          <Eye size={16} className="text-slate-600" />
                        </button>

                        {/* Toggle */}
                        {loadingMap[r._id] ? (
                          <div className="px-2 text-sm whitespace-nowrap">
                            Updating...
                          </div>
                        ) : (
                          <button
                            title={
                              r.isActive
                                ? "Deactivate recruiter"
                                : "Activate recruiter"
                            }
                            onClick={() =>
                              toggleActive(
                                r.companyId,
                                r._id,
                                !r.isActive,
                                r.isAdmin
                              )
                            }
                            className={`p-2 rounded ${
                              r.isActive
                                ? "bg-green-50 hover:bg-green-100"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <UserCheck
                              size={16}
                              className={
                                r.isActive
                                  ? "text-green-600"
                                  : "text-slate-600"
                              }
                            />
                          </button>
                        )}

                        {/* Block / Unblock */}
                        {blockingMap[r._id] ? (
                          <div className="px-2 text-sm whitespace-nowrap">
                            Processing...
                          </div>
                        ) : (
                          <button
                            title={
                              r.isBlocked
                                ? "Unblock recruiter"
                                : "Block recruiter"
                            }
                            onClick={() =>
                              toggleBlock(r._id, r.companyId, r.isBlocked)
                            }
                            className={`p-2 rounded ${
                              r.isBlocked
                                ? "bg-gray-100 hover:bg-gray-200"
                                : "bg-orange-50 hover:bg-orange-100"
                            }`}
                          >
                            <Ban
                              size={16}
                              className={
                                r.isBlocked
                                  ? "text-gray-600"
                                  : "text-orange-600"
                              }
                            />
                          </button>
                        )}

                        {/* Delete */}
                        {dloadingMap[r._id] ? (
                          <div className="px-2 text-sm whitespace-nowrap">
                            Deleting...
                          </div>
                        ) : (
                          <button
                            title="Delete recruiter"
                            onClick={() => {
                              setSelectedRecruiter(r);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 rounded bg-red-50 hover:bg-red-100"
                          >
                            <Trash size={16} className="text-red-600" />
                          </button>
                        )}

                        {/* Message */}
                        <button
                          title="Send message"
                          onClick={() => {
                            setSelectedMessageRecruiter(r);
                            setShowMessageModal(true);
                          }}
                          className="p-2 rounded bg-blue-50 hover:bg-blue-100"
                        >
                          <MessageSquare
                            size={16}
                            className="text-blue-600"
                          />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">
                        No recruiters found.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-4">
        <div className="text-sm text-gray-600 text-center sm:text-left">
          Showing{" "}
          {filteredRecruiters.length === 0
            ? 0
            : Math.min(
                (page - 1) * ITEMS_PER_PAGE + 1,
                filteredRecruiters.length
              )}{" "}
          to {Math.min(page * ITEMS_PER_PAGE, filteredRecruiters.length)} of{" "}
          {filteredRecruiters.length} results
        </div>

        <CompactPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>

    {/* Delete confirmation */}
    {showDeleteModal && (
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    )}

    {/* Message Modal */}
    {showMessageModal && selectedMessageRecruiter && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 px-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
          <h2 className="text-lg font-semibold mb-4 break-words">
            Message to {selectedMessageRecruiter.fullname}
          </h2>
          <textarea
            className="w-full border rounded-lg p-2 h-32 resize-none"
            placeholder="Type your message here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          ></textarea>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowMessageModal(false);
                setMessageText("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={sendMessageToRecruiter} disabled={sendingMessage}>
              {sendingMessage ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    )}
  </>
);

};

export default RecruitersList;
