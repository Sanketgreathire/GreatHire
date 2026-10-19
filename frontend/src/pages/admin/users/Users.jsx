
import { useEffect, useState } from "react";
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
import { Trash, Eye, Search, FileDown, Bot } from "lucide-react";
import { Briefcase, FileText, CheckCircle } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Navbar from "@/components/admin/Navbar";
import { useSelector, useDispatch } from "react-redux";
import {
  ADMIN_USER_DATA_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/ApiEndPoint";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  fetchUserStats,
  fetchApplicationStats,
} from "@/redux/admin/statsSlice";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import CountUp from "react-countup";

// Safe Date Formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  if (!isNaN(dateString)) {
    return new Date(Number(dateString)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const parts = dateString.split("-");

  if (parts.length === 3 && parts[0].length <= 2) {
    const [day, month, year] = parts;
    const parsed = new Date(`${year}-${month}-${day}`);

    if (!isNaN(parsed)) {
      return parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  const parsed = new Date(dateString);

  if (!isNaN(parsed)) {
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return dateString;
};

// Safe Phone Formatter
const formatPhone = (phone) => {
  if (!phone) return "N/A";

  const digits = String(phone).replace(/\D/g, "");
  let cleaned = digits;

  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    cleaned = cleaned.slice(1);
  }

  return cleaned.length === 10 ? cleaned : "N/A";
};

// Loading Skeleton Row
const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto" />
    </TableCell>

    <TableCell>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    </TableCell>

    <TableCell>
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto" />
    </TableCell>

    <TableCell>
      <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto" />
    </TableCell>

    <TableCell>
      <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto" />
    </TableCell>

    <TableCell>
      <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto" />
    </TableCell>

    <TableCell>
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto" />
    </TableCell>

    <TableCell>
      <div className="flex justify-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </TableCell>
  </TableRow>
);

const Users = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("15");
  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [sourcedCount, setSourcedCount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dloading, dsetLoading] = useState({});
  const { user } = useSelector((state) => state.auth);

  const jobStats = useSelector((state) => state.stats.jobStatsData);
  const applicationStats = useSelector(
    (state) => state.stats.applicationStatsData
  );
  const userStats = useSelector((state) => state.stats.userStatsData);

  const [userEmail, setUserEmail] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch user list
  const fetchUserList = async () => {
    setIsLoadingUsers(true);
    setUsersError("");

    try {
      const response = await axios.get(
        `${ADMIN_USER_DATA_API_END_POINT}/user-stats`,
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to load job seekers"
        );
      }

      const users = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data.users)
          ? response.data.users
          : Array.isArray(response.data.jobSeekers)
            ? response.data.jobSeekers
            : Array.isArray(response.data)
              ? response.data
              : [];

      console.log("Job Seekers API response:", response.data);
      console.log("Job Seekers array:", users);

      setUsersList(users);
    } catch (err) {
      console.error("Error fetching job seekers:", err);
      setUsersError("Unable to load job seekers. Please try again.");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Bulk delete users
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    if (
      !window.confirm(
        `Delete ${selectedUsers.length} selected user(s)?`
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${ADMIN_USER_DATA_API_END_POINT}/bulk-delete`,
        {
          data: { userIds: selectedUsers },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUsersList((prev) =>
          prev.filter((u) => !selectedUsers.includes(u._id))
        );
        setSelectedUsers([]);
        toast.success(response.data.message);
        dispatch(fetchUserStats());
        dispatch(fetchApplicationStats());
      }
    } catch {
      toast.error("Failed to delete selected users");
    }
  };

  // Delete account
  const handleDeleteAccount = async (email) => {
    try {
      dsetLoading((prev) => ({ ...prev, [email]: true }));

      const response = await axios.delete(
        `${USER_API_END_POINT}/delete`,
        {
          data: { email },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUsersList((prev) =>
          prev.filter((u) => u.email !== email)
        );
        dispatch(fetchUserStats());
        dispatch(fetchApplicationStats());
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error("Error deleting account: ", err.message);
      toast.error("Error in deleting account");
    } finally {
      dsetLoading((prev) => ({ ...prev, [email]: false }));
    }
  };

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    handleDeleteAccount(userEmail);
  };

  const onCancelDelete = () => setShowDeleteModal(false);

  useEffect(() => {
    if (user) {
      fetchUserList();

      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/v1/admin/sourcing/stats`,
          { withCredentials: true }
        )
        .then(({ data }) => {
          if (data.success) setSourcedCount(data.stats.total);
        })
        .catch(() => {});
    }
  }, [user]);

  // Stats Section
  const stats = [
    {
      title: "Total Job Seekers",
      count: userStats?.totalUsers || 0,
      icon: (
        <FaRegUser
          size={36}
          className="text-blue-600 dark:text-blue-400"
        />
      ),
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Jobs",
      count: jobStats?.totalJobs || 0,
      icon: (
        <Briefcase
          size={36}
          className="text-orange-600 dark:text-orange-400"
        />
      ),
      color: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Active Jobs",
      count: jobStats?.totalActiveJobs || 0,
      icon: (
        <CheckCircle
          size={36}
          className="text-green-600 dark:text-green-400"
        />
      ),
      color: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Applications",
      count: applicationStats?.totalApplications || 0,
      icon: (
        <FileText
          size={36}
          className="text-purple-600 dark:text-purple-400"
        />
      ),
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "AI Sourced",
      count: sourcedCount,
      icon: (
        <Bot
          size={36}
          className="text-indigo-600 dark:text-indigo-400"
        />
      ),
      color: "bg-indigo-100 dark:bg-indigo-900/30",
    },
  ];

  const filteredUsers = usersList?.filter((u) => {
    const safe = (v) => String(v || "").toLowerCase();
    const searchText = search.toLowerCase();

    return (
      safe(u.fullname).includes(searchText) ||
      safe(u.email).includes(searchText) ||
      safe(u.phoneNumber).includes(searchText) ||
      safe(u.jobRole).includes(searchText) ||
      safe(u.duration).includes(searchText)
    );
  });

  const effectiveItemsPerPage =
    itemsPerPage === "all"
      ? Math.max(filteredUsers.length, 1)
      : Number(itemsPerPage);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / effectiveItemsPerPage)
  );

  const paginatedUsers = (filteredUsers || []).slice(
    (page - 1) * effectiveItemsPerPage,
    page * effectiveItemsPerPage
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u._id));
    }
  };

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Contact",
      "Join Date",
      "Applications",
      "Resume",
    ];

    const exportUsers =
      selectedUsers.length > 0
        ? usersList.filter((u) => selectedUsers.includes(u._id))
        : filteredUsers;

    const rows = exportUsers.map((u) => [
      u.fullname,
      u.email,
      u.phoneNumber,
      u.joined,
      u.applicationCount,
      u.resumeurl,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((r) =>
          r
            .map((f) => `"${String(f).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar linkName={"Users"} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Stat Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl hover:shadow-md transition-all"
            >
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-1">
                  <CountUp end={stat.count} duration={1.5} />
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </Card>
          ))}
        </div>

        {/* User Table */}
        <div className="w-full overflow-x-auto px-6 mt-6 pb-24">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6 transition-colors">
            {/* Search + Actions Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              {/* Search input */}
              <div className="relative w-full sm:w-1/2 md:w-1/3">
                <Search
                  className="absolute left-3 top-3 text-gray-400 dark:text-gray-500"
                  size={18}
                />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                Rows per page
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="all">All</option>
                </select>
              </label>

              {/* CSV + Delete buttons */}
              <div className="flex items-center gap-2 sm:justify-end">
                <Button
                  onClick={downloadCSV}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full shadow-sm px-4 py-2 flex items-center gap-2 transition-colors"
                >
                  <FileDown size={18} />
                  CSV
                </Button>

                <Button
                  disabled={selectedUsers.length === 0}
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-full shadow-sm px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash size={18} />
                  Delete{" "}
                  {selectedUsers.length > 0 &&
                    `(${selectedUsers.length})`}
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table className="w-full border border-gray-200 dark:border-gray-700 rounded-xl">
                <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableHead className="w-[5%] text-center text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === paginatedUsers.length &&
                          paginatedUsers.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer"
                      />
                    </TableHead>

                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
                      Job Seeker
                    </TableHead>

                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Contact
                    </TableHead>

                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Join Date
                    </TableHead>

                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Applications
                    </TableHead>

                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Job Role
                    </TableHead>

                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Experience
                    </TableHead>

                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Actions
                      {selectedUsers.length > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({selectedUsers.length} selected)
                        </span>
                      )}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {/* Loading Skeleton */}
                  {isLoadingUsers ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  ) : usersError ? (
                    /* API Error */
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                      >
                        <p>{usersError}</p>
                        <Button
                          variant="link"
                          onClick={fetchUserList}
                        >
                          Try again
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : paginatedUsers?.length > 0 ? (
                    /* Actual User Rows */
                    paginatedUsers.map((u) => (
                      <TableRow
                        key={u._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
                      >
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u._id)}
                            onChange={() => toggleUserSelection(u._id)}
                            className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer"
                          />
                        </TableCell>

                        <TableCell className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                            {u.fullname?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">
                              {u.fullname}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {u.email}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="text-center text-gray-700 dark:text-gray-300">
                          {(() => {
                            const phone = formatPhone(u.phoneNumber);
                            if (phone === "N/A") return "N/A";
                            return `+91-${phone.slice(0, 5)} ${phone.slice(5)}`;
                          })()}
                        </TableCell>

                        <TableCell className="text-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium whitespace-nowrap">
                            {formatDate(u.joined)}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              u.applicationCount > 0
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {u.applicationCount}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          <div
                            className="max-w-[160px] mx-auto text-sm leading-snug overflow-hidden text-ellipsis line-clamp-2 text-gray-700 dark:text-gray-300"
                            title={u.jobRole}
                          >
                            {u.jobRole || "N/A"}
                          </div>
                        </TableCell>

                        <TableCell className="text-center text-gray-700 dark:text-gray-300">
                          {u.duration || "N/A"}
                        </TableCell>

                        <TableCell className="flex gap-3 justify-center">
                          <button
                            onClick={() =>
                              navigate(`/admin/user-details/${u._id}`)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
                          >
                            <Eye size={16} />
                          </button>

                          {dloading[u?.email] ? (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">
                              Deleting...
                            </span>
                          ) : (
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors"
                              onClick={() => {
                                setUserEmail(u.email);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash size={16} />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    /* No Users Found */
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                      >
                        No Job Seekers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              {(() => {
                const pages = new Set();
                pages.add(1);

                if (totalPages > 1) pages.add(totalPages);

                for (
                  let i = Math.max(2, page - 1);
                  i <= Math.min(totalPages - 1, page + 1);
                  i++
                ) {
                  pages.add(i);
                }

                const sorted = [...pages].sort((a, b) => a - b);
                const finalPages = [];

                for (let i = 0; i < sorted.length; i++) {
                  if (
                    i > 0 &&
                    sorted[i] - sorted[i - 1] > 1
                  ) {
                    finalPages.push("...");
                  }
                  finalPages.push(sorted[i]);
                }

                return (
                  <>
                    {/* LEFT — info text */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap sm:absolute sm:left-0">
                      Showing{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {filteredUsers.length === 0
                          ? 0
                          : (page - 1) * effectiveItemsPerPage + 1}
                        {"–"}
                        {Math.min(
                          page * effectiveItemsPerPage,
                          filteredUsers.length
                        )}
                      </span>
                      {" of "}
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {filteredUsers.length}
                      </span>{" "}
                      jobseekers
                    </p>

                    {/* RIGHT — buttons */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {/* Prev */}
                      <Button
                        onClick={() =>
                          setPage((p) => Math.max(1, p - 1))
                        }
                        disabled={page === 1}
                        className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Prev
                      </Button>

                      {/* Page numbers */}
                      {finalPages.map((p, idx) =>
                        p === "..." ? (
                          <span
                            key={`dots-${idx}`}
                            className="px-2 text-gray-400 select-none"
                          >
                            …
                          </span>
                        ) : (
                          <Button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`min-w-[38px] px-3 py-2 rounded-md transition-colors ${
                              page === p
                                ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {p}
                          </Button>
                        )
                      )}

                      {/* Next */}
                      <Button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={
                          page === totalPages || itemsPerPage === "all"
                        }
                        className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteModal && (
          <DeleteConfirmation
            isOpen={showDeleteModal}
            onConfirm={onConfirmDelete}
            onCancel={onCancelDelete}
          />
        )}
      </div>
    </>
  );
};

export default Users;
