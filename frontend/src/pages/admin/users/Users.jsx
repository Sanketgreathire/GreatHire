import React, { useEffect, useState } from "react";
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
import { Trash, Eye, Search, FileDown } from "lucide-react";
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
import { useLocation } from "react-router-dom";

// ✅ Safe Date Formatter
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

const Users = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const [usersList, setUsersList] = useState([]);
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
    try {
      const response = await axios.get(
        `${ADMIN_USER_DATA_API_END_POINT}/user-stats`,
        { withCredentials: true }
      );
      if (response.data.success) setUsersList(response.data.data);
    } catch (err) {
      console.log(`Error in fetching user list: ${err}`);
    }
  };
  
  //Bulk delete users
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    if (!window.confirm(`Delete ${selectedUsers.length} selected user(s)?`)) return;

    try {
      const response = await axios.delete(`${ADMIN_USER_DATA_API_END_POINT}/bulk-delete`, {
        data: { userIds: selectedUsers },
        withCredentials: true,
      });

      if (response.data.success) {
        setUsersList(prev => prev.filter(u => !selectedUsers.includes(u._id)));
        setSelectedUsers([]);
        toast.success(response.data.message);
        dispatch(fetchUserStats());
        dispatch(fetchApplicationStats());
      }
    } catch (err) {
      toast.error("Failed to delete selected users");
    }
  };

  // Delete account
  const handleDeleteAccount = async (email) => {
    try {
      dsetLoading((prev) => ({ ...prev, [email]: true }));
      const response = await axios.delete(`${USER_API_END_POINT}/delete`, {
        data: { email },
        withCredentials: true,
      });

      if (response.data.success) {
        setUsersList((prev) => prev.filter((u) => u.email !== email));
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

  const location = useLocation();
  useEffect(() => {
    if (user) fetchUserList();
  }, [user]);

  // Stats Section
  const stats = [
    {
      title: "Total Users",
      count: userStats?.totalUsers || 0,
      icon: <FaRegUser size={36} className="text-blue-600 dark:text-blue-400" />,
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Jobs",
      count: jobStats?.totalJobs || 0,
      icon: <Briefcase size={36} className="text-orange-600 dark:text-orange-400" />,
      color: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Active Jobs",
      count: jobStats?.totalActiveJobs || 0,
      icon: <CheckCircle size={36} className="text-green-600 dark:text-green-400" />,
      color: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Applications",
      count: applicationStats?.totalApplications || 0,
      icon: <FileText size={36} className="text-purple-600 dark:text-purple-400" />,
      color: "bg-purple-100 dark:bg-purple-900/30",
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

  const paginatedUsers = (filteredUsers || []).slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u._id));
    }
  };

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(","))
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
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl hover:shadow-md transition-all"
            >
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-1">
                  <CountUp end={stat.count} duration={1.5} />
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </Card>
          ))}
        </div>

        {/* User Table */}
        <div className="w-full overflow-x-auto px-6 mt-6 pb-24">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6 transition-colors">
            {/* Search */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
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
                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">User</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">Contact</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">Join Date</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">Applications</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">Job Role</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">Experience</TableHead>
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
                  {paginatedUsers?.length > 0 ? (
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-gray-700 dark:text-gray-300">{u.phoneNumber}</TableCell>
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
                            onClick={() => navigate(`/admin/user-details/${u._id}`)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
                          >
                            <Eye size={16} />
                          </button>

                          {dloading[u?.email] ? (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">Deleting...</span>
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
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6 px-4 pb-6">
          {(() => {
            const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
            if (totalPages <= 1) return null;

            const pages = new Set();
            pages.add(1);
            pages.add(totalPages);

            for (
              let i = Math.max(2, page - 2);
              i <= Math.min(totalPages - 1, page + 2);
              i++
            ) {
              pages.add(i);
            }

            const sorted = [...pages].sort((a, b) => a - b);
            const finalPages = [];
            for (let i = 0; i < sorted.length; i++) {
              if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
                finalPages.push("...");
              }
              finalPages.push(sorted[i]);
            }

            return finalPages.map((p, idx) =>
              p === "..." ? (
                <span
                  key={`dots-${idx}`}
                  className="px-3 py-1 text-gray-500 dark:text-gray-400 select-none"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    page === p
                      ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {p}
                </Button>
              )
            );
          })()}
        </div>

        {/* Floating Actions */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-30">
          <Button
            onClick={downloadCSV}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-full shadow-lg px-5 py-3 flex items-center gap-2 transition-colors"
          >
            <FileDown size={18} /> CSV
          </Button>

          <Button
            disabled={selectedUsers.length === 0}
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-full shadow-lg px-5 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash size={18} /> Delete ({selectedUsers.length})
          </Button>
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