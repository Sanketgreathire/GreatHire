// Recruiters.jsx
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
import { Trash, Eye, Briefcase, UserCheck, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FaRegUser } from "react-icons/fa";
import Navbar from "@/components/admin/Navbar";
import {
  ADMIN_RECRUITER_DATA_API_END_POINT,
  RECRUITER_API_END_POINT,
} from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

/**
 * Rewritten Recruiters.jsx
 * - Removes MUI
 * - Uses Tailwind + existing UI components
 * - Adds skeleton loaders, compact pagination, tooltips
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
  // show up to 5 page buttons centered around current page
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

const Recruiters = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All"); // "All" | true | false
  const [page, setPage] = useState(1);

  const [recruiterList, setRecruiterList] = useState([]);
  const [recruiterSummary, setRecruiterSummary] = useState(null);

  const [isFetching, setIsFetching] = useState(false);
  const [loadingMap, setLoadingMap] = useState({}); // toggles per recruiter
  const [dloadingMap, setDLoadingMap] = useState({}); // delete loading
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  const stats = [
    {
      title: "Total Recruiters",
      count: recruiterSummary?.totalRecruiters || 0,
      icon: <FaRegUser size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Recruiters",
      count: recruiterSummary?.activeRecruiters || 0,
      icon: <UserCheck size={20} />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Deactive Recruiter",
      count: recruiterSummary?.deactiveRecruiters || 0,
      icon: <XCircle size={20} />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Posted Jobs",
      count: recruiterSummary?.totalJobPosts || 0,
      icon: <Briefcase size={20} />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  // Fetch data
  const fetchRecruiterList = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${ADMIN_RECRUITER_DATA_API_END_POINT}/recruiter-stats/${companyId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setRecruiterList(response.data.recruiters || []);
        setRecruiterSummary(response.data.summary || {});
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
    fetchRecruiterList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  // Toggle active
  const toggleActive = async (recruiterId, newIsActive, isAdmin) => {
    setLoadingMap((s) => ({ ...s, [recruiterId]: true }));
    try {
      const response = await axios.put(
        `${RECRUITER_API_END_POINT}/toggle-active`,
        { recruiterId, companyId, isActive: newIsActive },
        { withCredentials: true }
      );
      if (response.data.success) {
        if (isAdmin) {
          // if admin changed other recruiters, re-fetch to be safe
          fetchRecruiterList();
        } else {
          setRecruiterList((prev) =>
            prev.map((r) =>
              r._id === recruiterId ? { ...r, isActive: newIsActive } : r
            )
          );
          setRecruiterSummary((prev) => {
            if (!prev) return prev;
            const activeDelta = newIsActive ? 1 : -1;
            return {
              ...prev,
              activeRecruiters: prev.activeRecruiters + activeDelta,
              deactiveRecruiters: prev.deactiveRecruiters - activeDelta,
            };
          });
        }
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

  const deleteRecruiter = async (recruiterId, userEmail) => {
    setDLoadingMap((s) => ({ ...s, [recruiterId]: true }));
    try {
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: { userEmail, companyId },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message || "Recruiter deleted");
        // Refresh list
        fetchRecruiterList();
      } else {
        toast.error(response.data.message || "Failed to delete recruiter");
      }
    } catch (err) {
      console.error("delete recruiter error", err);
      toast.error("Error deleting recruiter");
    } finally {
      setDLoadingMap((s) => ({ ...s, [recruiterId]: false }));
    }
  };

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    if (selectedRecruiter) {
      deleteRecruiter(selectedRecruiter._id, selectedRecruiter.email);
      setSelectedRecruiter(null);
    }
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedRecruiter(null);
  };

  // Filtering and pagination
  const filteredRecruiters = recruiterList.filter((recruiter) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      recruiter.fullname?.toLowerCase().includes(q) ||
      recruiter.email?.toLowerCase().includes(q) ||
      recruiter.phone?.toLowerCase().includes(q);
    const matchesStatus =
      status === "All" ? true : recruiter.isActive === (status === true);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRecruiters.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    // If page exceeds total pages after filtering, reset
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRecruiters.length]);

  const paginatedRecruiters = filteredRecruiters.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar linkName={"Recruiters"} />

      {/* Stats */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <StatCard key={idx} {...s} />
        ))}
      </div>

      {/* Main Card */}
      <div className="m-4 p-4 bg-white shadow rounded-lg">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 w-full md:w-1/2">
            <Input
              placeholder="Search by name, email, contact"
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
            >
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => {
                  const val = e.target.value;
                  setStatus(val === "All" ? "All" : val === "true");
                  setPage(1);
                }}
                className="h-10 px-3 border rounded-md bg-white focus:outline-none"
                aria-label="Filter by status"
              >
                <option value="All">All Status</option>
                <option value="true">Active</option>
                <option value="false">Deactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recruiter</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Posted Jobs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isFetching
              ? // show 6 skeleton rows
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              : paginatedRecruiters.length > 0
              ? paginatedRecruiters.map((recruiter) => (
                  <TableRow
                    key={recruiter._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            {recruiter.fullname
                              ? recruiter.fullname.charAt(0).toUpperCase()
                              : "R"}
                          </div>
                          <div>
                            <div className="font-medium">
                              {recruiter.fullname}{" "}
                              {recruiter.isAdmin && (
                                <span className="ml-2 inline-block text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {recruiter.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{recruiter.phone}</TableCell>
                    <TableCell>{recruiter.position}</TableCell>
                    <TableCell>{recruiter.postedJobs ?? 0}</TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          recruiter.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {recruiter.isActive ? "Active" : "Deactive"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* View */}
                        <button
                          title="View recruiter details"
                          onClick={() =>
                            navigate(`/admin/recruiter/details/${recruiter._id}`)
                          }
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Eye size={18} className="text-slate-600" />
                        </button>

                        {/* Toggle */}
                        {loadingMap[recruiter._id] ? (
                          <div className="text-sm">Updating...</div>
                        ) : (
                          <button
                            title={
                              recruiter.isActive
                                ? "Deactivate recruiter"
                                : "Activate recruiter"
                            }
                            onClick={() =>
                              toggleActive(
                                recruiter._id,
                                !recruiter.isActive,
                                recruiter.isAdmin
                              )
                            }
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            {/* Simple accessible toggle representation */}
                            <input
                              type="checkbox"
                              readOnly
                              checked={Boolean(recruiter.isActive)}
                              className="w-4 h-4"
                              aria-label="Active toggle"
                            />
                          </button>
                        )}

                        {/* Delete */}
                        {dloadingMap[recruiter._id] ? (
                          <div className="text-sm">Deleting...</div>
                        ) : (
                          <button
                            title="Delete recruiter"
                            onClick={() => {
                              setSelectedRecruiter(recruiter);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <Trash size={18} className="text-red-500" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : // no results
                (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-gray-500">No recruiters found.</div>
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>

        {/* Footer: results & pagination */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 mt-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            {filteredRecruiters.length === 0
              ? 0
              : Math.min((page - 1) * ITEMS_PER_PAGE + 1, filteredRecruiters.length)}{" "}
            to{" "}
            {Math.min(page * ITEMS_PER_PAGE, filteredRecruiters.length)} of{" "}
            {filteredRecruiters.length} results
          </div>

          <CompactPagination
            page={page}
            setPage={setPage}
            totalPages={Math.max(1, Math.ceil(filteredRecruiters.length / ITEMS_PER_PAGE))}
          />
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
    </>
  );
};

export default Recruiters;
