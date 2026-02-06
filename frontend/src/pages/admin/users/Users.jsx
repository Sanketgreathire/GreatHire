// Users.jsx
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
      icon: <FaRegUser size={36} className="text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Total Jobs",
      count: jobStats?.totalJobs || 0,
      icon: <Briefcase size={36} className="text-orange-600" />,
      color: "bg-orange-100",
    },
    {
      title: "Active Jobs",
      count: jobStats?.totalActiveJobs || 0,
      icon: <CheckCircle size={36} className="text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Applications",
      count: applicationStats?.totalApplications || 0,
      icon: <FileText size={36} className="text-purple-600" />,
      color: "bg-purple-100",
    },
  ];

  // const filteredUsers = usersList?.filter(
  //   (u) =>
  //     u.fullname.toLowerCase().includes(search.toLowerCase()) ||
  //     u.email.toLowerCase().includes(search.toLowerCase()) ||
  //     u.phoneNumber.toLowerCase().includes(search.toLowerCase()) ||
  //     (u.jobRole && u.jobRole.toLowerCase().includes(search.toLowerCase())) ||
  //     (u.duration && u.duration.toLowerCase().includes(search.toLowerCase()))
  // );
  // error solved
  const filteredUsers = usersList?.filter((u) => {
  const name = u.fullname?.toLowerCase() || "";
  const email = u.email?.toLowerCase() || "";
  const phone = u.phoneNumber ? String(u.phoneNumber).toLowerCase() : "";
  const role = u.jobRole? String(u.jobRole).toLowerCase() :"";
  const duration = u.duration? String(u.duration).toLowerCase() : "";
  const safe = (v) => String(v || "").toLowerCase();

  const searchText = search.toLowerCase();

  return (
    safe(u.fullname).includes(search.toLowerCase()) ||
    safe(u.email).includes(search.toLowerCase()) ||
    safe(u.phoneNumber).includes(search.toLowerCase()) ||
    safe(u.jobRole).includes(search.toLowerCase()) ||
    safe(u.duration).includes(search.toLowerCase())
  );
});

  // const paginatedUsers = filteredUsers?.slice(
  //   (page - 1) * itemsPerPage,
  //   page * itemsPerPage
  // );
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

      {/* Stat Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="flex items-center justify-between p-6 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition"
          >
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">
                <CountUp end={stat.count} duration={1.5} />
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
          </Card>
        ))}
      </div>

      {/* User Table */}
      <div className="w-full overflow-x-auto px-6 mt-6">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          {/* Search */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-full border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <Table className="w-full border border-gray-200 rounded-xl">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[5%] text-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-center">Contact</TableHead>
                <TableHead className="text-center">Join Date</TableHead>
                <TableHead className="text-center">Applications</TableHead>
                <TableHead className="text-center">Job Role</TableHead>
                <TableHead className="text-center">Experience</TableHead>
                <TableHead className="text-center">Actions <span className="text-sm text-gray-500 ml-2">
                  {selectedUsers.length > 0 && `(${selectedUsers.length} selected)`}
                </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers?.map((u) => (
                <TableRow
                  key={u._id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u._id)}
                      onChange={() => toggleUserSelection(u._id)}
                    />
                  </TableCell>
                  <TableCell className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {u.fullname?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {u.fullname}
                      </p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{u.phoneNumber}</TableCell>
                  <TableCell className="text-center">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                      {formatDate(u.joined)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.applicationCount > 0
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {u.applicationCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {u.jobRole || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {u.duration || "N/A"}
                  </TableCell>
                  <TableCell className="flex gap-3 justify-center">
                    <button
                      onClick={() => navigate(`/admin/user-details/${u._id}`)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <Eye size={16} />
                    </button>

                    {dloading[u?.email] ? (
                      <span className="text-gray-400 text-sm">Deleting...</span>
                    ) : (
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </Button>
        {(() => {
          const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
          const pages = [];
          pages.push(1);
          if (page > 3) pages.push("...");
          for (
            let i = Math.max(2, page - 2);
            i <= Math.min(totalPages - 1, page + 2);
            i++
          ) {
            pages.push(i);
          }
          if (page < totalPages - 2) pages.push("...");
          if (totalPages > 1) pages.push(totalPages);
          return pages.map((p, idx) =>
            p === "..." ? (
              <span
                key={idx}
                className="px-3 py-1 text-gray-500 select-none"
              >
                ...
              </span>
            ) : (
              <Button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-md ${
                  page === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </Button>
            )
          );
        })()}
        <Button
          disabled={page === Math.ceil(filteredUsers.length / itemsPerPage)}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </Button>
      </div>

      {/* Floating CSV Download */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg px-6 py-3 flex items-center gap-2"
        >
          <FileDown size={18} /> Download CSV
        </Button> 
      
        <Button
            disabled={selectedUsers.length === 0}
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 mt-2 text-white rounded-full shadow-lg px-6 py-3 flex items-center gap-2"
          >
            <Trash size={18} /> Delete Selected ({selectedUsers.length})
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
    </>
  );
};

export default Users;


// // Users.jsx
// import React, { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Trash, Eye, Search, FileDown } from "lucide-react";
// import { Briefcase, FileText, CheckCircle } from "lucide-react";
// import { FaRegUser } from "react-icons/fa";
// import { Card } from "@/components/ui/card";
// import axios from "axios";
// import Navbar from "@/components/admin/Navbar";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   ADMIN_USER_DATA_API_END_POINT,
//   USER_API_END_POINT,
// } from "@/utils/ApiEndPoint";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   fetchUserStats,
//   fetchApplicationStats,
// } from "@/redux/admin/statsSlice";
// import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
// import CountUp from "react-countup";

// // ✅ Safe Date Formatter
// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   if (!isNaN(dateString)) {
//     return new Date(Number(dateString)).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   }
//   const parts = dateString.split("-");
//   if (parts.length === 3 && parts[0].length <= 2) {
//     const [day, month, year] = parts;
//     const parsed = new Date(`${year}-${month}-${day}`);
//     if (!isNaN(parsed)) {
//       return parsed.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     }
//   }
//   const parsed = new Date(dateString);
//   if (!isNaN(parsed)) {
//     return parsed.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   }
//   return dateString;
// };

// const Users = () => {
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 20;
//   const [usersList, setUsersList] = useState([]);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [dloading, dsetLoading] = useState({});
//   const { user } = useSelector((state) => state.auth);
//   const jobStats = useSelector((state) => state.stats.jobStatsData);
//   const applicationStats = useSelector(
//     (state) => state.stats.applicationStatsData
//   );
//   const userStats = useSelector((state) => state.stats.userStatsData);
//   const [userEmail, setUserEmail] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   // Fetch user list
//   const fetchUserList = async () => {
//     try {
//       const response = await axios.get(
//         `${ADMIN_USER_DATA_API_END_POINT}/user-stats`,
//         { withCredentials: true }
//       );
//       if (response.data.success) setUsersList(response.data.data);
//     } catch (err) {
//       console.log(`Error in fetching user list: ${err}`);
//     }
//   };

//   // Delete account
//   const handleDeleteAccount = async (email) => {
//     try {
//       dsetLoading((prev) => ({ ...prev, [email]: true }));
//       const response = await axios.delete(`${USER_API_END_POINT}/delete`, {
//         data: { email },
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         setUsersList((prev) => prev.filter((u) => u.email !== email));
//         dispatch(fetchUserStats());
//         dispatch(fetchApplicationStats());
//         toast.success(response.data.message);
//       }
//     } catch (err) {
//       console.error("Error deleting account: ", err.message);
//       toast.error("Error in deleting account");
//     } finally {
//       dsetLoading((prev) => ({ ...prev, [email]: false }));
//     }
//   };

//   const onConfirmDelete = () => {
//     setShowDeleteModal(false);
//     handleDeleteAccount(userEmail);
//   };

//   const onCancelDelete = () => setShowDeleteModal(false);

//   useEffect(() => {
//     if (user) fetchUserList();
//   }, [user]);

//   // Stats Section
//   const stats = [
//     {
//       title: "Total Users",
//       count: userStats?.totalUsers || 0,
//       icon: <FaRegUser size={36} className="text-blue-600" />,
//       color: "bg-blue-100",
//     },
//     {
//       title: "Total Jobs",
//       count: jobStats?.totalJobs || 0,
//       icon: <Briefcase size={36} className="text-orange-600" />,
//       color: "bg-orange-100",
//     },
//     {
//       title: "Active Jobs",
//       count: jobStats?.totalActiveJobs || 0,
//       icon: <CheckCircle size={36} className="text-green-600" />,
//       color: "bg-green-100",
//     },
//     {
//       title: "Applications",
//       count: applicationStats?.totalApplications || 0,
//       icon: <FileText size={36} className="text-purple-600" />,
//       color: "bg-purple-100",
//     },
//   ];

//   // const filteredUsers = usersList?.filter(
//   //   (u) =>
//   //     u.fullname.toLowerCase().includes(search.toLowerCase()) ||
//   //     u.email.toLowerCase().includes(search.toLowerCase()) ||
//   //     u.phoneNumber.toLowerCase().includes(search.toLowerCase()) ||
//   //     (u.jobRole && u.jobRole.toLowerCase().includes(search.toLowerCase())) ||
//   //     (u.duration && u.duration.toLowerCase().includes(search.toLowerCase()))
//   // );
//   // error solved
//   const filteredUsers = usersList?.filter((u) => {
//   const name = u.fullname?.toLowerCase() || "";
//   const email = u.email?.toLowerCase() || "";
//   const phone = u.phoneNumber ? String(u.phoneNumber).toLowerCase() : "";
//   const role = u.jobRole?.toLowerCase() || "";
//   const duration = u.duration?.toLowerCase() || "";

//   const searchText = search.toLowerCase();

//   return (
//     name.includes(searchText) ||
//     email.includes(searchText) ||
//     phone.includes(searchText) ||
//     role.includes(searchText) ||
//     duration.includes(searchText)
//   );
// });

//   // const paginatedUsers = filteredUsers?.slice(
//   //   (page - 1) * itemsPerPage,
//   //   page * itemsPerPage
//   // );
//   const paginatedUsers = (filteredUsers || []).slice(
//   (page - 1) * itemsPerPage,
//   page * itemsPerPage
// );

//   const toggleSelectAll = () => {
//     if (selectedUsers.length === paginatedUsers.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(paginatedUsers.map((u) => u._id));
//     }
//   };

//   const toggleUserSelection = (id) => {
//     setSelectedUsers((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const downloadCSV = () => {
//     const headers = [
//       "Name",
//       "Email",
//       "Contact",
//       "Join Date",
//       "Applications",
//       "Resume",
//     ];
//     const exportUsers =
//       selectedUsers.length > 0
//         ? usersList.filter((u) => selectedUsers.includes(u._id))
//         : filteredUsers;

//     const rows = exportUsers.map((u) => [
//       u.fullname,
//       u.email,
//       u.phoneNumber,
//       u.joined,
//       u.applicationCount,
//       u.resumeurl,
//     ]);

//     let csvContent =
//       "data:text/csv;charset=utf-8," +
//       [headers, ...rows]
//         .map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(","))
//         .join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "users_data.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <>
//       <Navbar linkName={"Users"} />

//       {/* Stat Cards */}
//       <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, i) => (
//           <Card
//             key={i}
//             className="flex items-center justify-between p-6 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition"
//           >
//             <div>
//               <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
//               <p className="text-3xl font-semibold text-gray-900 mt-1">
//                 <CountUp end={stat.count} duration={1.5} />
//               </p>
//             </div>
//             <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
//           </Card>
//         ))}
//       </div>

//       {/* User Table */}
//       <div className="w-full overflow-x-auto px-6 mt-6">
//         <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
//           {/* Search */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="relative w-full md:w-1/2">
//               <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//               <Input
//                 placeholder="Search users..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-10 rounded-full border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <Table className="w-full border border-gray-200 rounded-xl">
//             <TableHeader className="bg-gray-50">
//               <TableRow>
//                 <TableHead className="w-[5%] text-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedUsers.length === paginatedUsers.length}
//                     onChange={toggleSelectAll}
//                   />
//                 </TableHead>
//                 <TableHead>User</TableHead>
//                 <TableHead className="text-center">Contact</TableHead>
//                 <TableHead className="text-center">Join Date</TableHead>
//                 <TableHead className="text-center">Applications</TableHead>
//                 <TableHead className="text-center">Job Role</TableHead>
//                 <TableHead className="text-center">Experience</TableHead>
//                 <TableHead className="text-center">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {paginatedUsers?.map((u) => (
//                 <TableRow
//                   key={u._id}
//                   className="hover:bg-gray-50 transition"
//                 >
//                   <TableCell className="text-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedUsers.includes(u._id)}
//                       onChange={() => toggleUserSelection(u._id)}
//                     />
//                   </TableCell>
//                   <TableCell className="flex items-center gap-3 text-left">
//                     <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
//                       {u.fullname?.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-800">
//                         {u.fullname}
//                       </p>
//                       <p className="text-xs text-gray-500">{u.email}</p>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-center">{u.phoneNumber}</TableCell>
//                   <TableCell className="text-center">
//                     <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
//                       {formatDate(u.joined)}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         u.applicationCount > 0
//                           ? "bg-green-100 text-green-600"
//                           : "bg-gray-100 text-gray-500"
//                       }`}
//                     >
//                       {u.applicationCount}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {u.jobRole || "N/A"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {u.duration || "N/A"}
//                   </TableCell>
//                   <TableCell className="flex gap-3 justify-center">
//                     <button
//                       onClick={() => navigate(`/admin/user-details/${u._id}`)}
//                       className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
//                     >
//                       <Eye size={16} />
//                     </button>

//                     {dloading[u?.email] ? (
//                       <span className="text-gray-400 text-sm">Deleting...</span>
//                     ) : (
//                       <button
//                         className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
//                         onClick={() => {
//                           setUserEmail(u.email);
//                           setShowDeleteModal(true);
//                         }}
//                       >
//                         <Trash size={16} />
//                       </button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="flex flex-wrap gap-2 justify-center mt-6">
//         <Button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//           className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
//         >
//           Prev
//         </Button>
//         {(() => {
//           const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//           const pages = [];
//           pages.push(1);
//           if (page > 3) pages.push("...");
//           for (
//             let i = Math.max(2, page - 2);
//             i <= Math.min(totalPages - 1, page + 2);
//             i++
//           ) {
//             pages.push(i);
//           }
//           if (page < totalPages - 2) pages.push("...");
//           if (totalPages > 1) pages.push(totalPages);
//           return pages.map((p, idx) =>
//             p === "..." ? (
//               <span
//                 key={idx}
//                 className="px-3 py-1 text-gray-500 select-none"
//               >
//                 ...
//               </span>
//             ) : (
//               <Button
//                 key={p}
//                 onClick={() => setPage(p)}
//                 className={`px-3 py-1 rounded-md ${
//                   page === p
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 {p}
//               </Button>
//             )
//           );
//         })()}
//         <Button
//           disabled={page === Math.ceil(filteredUsers.length / itemsPerPage)}
//           onClick={() => setPage(page + 1)}
//           className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
//         >
//           Next
//         </Button>
//       </div>

//       {/* Floating CSV Download */}
//       <div className="fixed bottom-6 right-6">
//         <Button
//           onClick={downloadCSV}
//           className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg px-6 py-3 flex items-center gap-2"
//         >
//           <FileDown size={18} /> Download CSV
//         </Button>
//       </div>

//       {/* Delete Confirmation */}
//       {showDeleteModal && (
//         <DeleteConfirmation
//           isOpen={showDeleteModal}
//           onConfirm={onConfirmDelete}
//           onCancel={onCancelDelete}
//         />
//       )}
//     </>
//   );
// };

// export default Users;
