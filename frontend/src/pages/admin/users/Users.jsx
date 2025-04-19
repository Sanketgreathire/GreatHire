// Import necessary modules and dependencies
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
import { Trash, Eye } from "lucide-react";
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


const Users = () => {
  // State for search input
  const [search, setSearch] = useState("");

  // State for pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // State to store the list of users
  const [usersList, setUsersList] = useState([]);
  
  // Hook for navigation
  const navigate = useNavigate();
  
  // Redux dispatch function
  const dispatch = useDispatch();

  // State for tracking delete request loading status
  const [dloading, dsetLoading] = useState({});
  
  // Fetch user details from Redux store
  const { user } = useSelector((state) => state.auth);
  
  // Fetch job statistics from Redux store
  const jobStats = useSelector((state) => state.stats.jobStatsData);
  
  // Fetch application statistics from Redux store
  const applicationStats = useSelector(
    (state) => state.stats.applicationStatsData
  );
  
  // Fetch user statistics from Redux store
  const userStats = useSelector((state) => state.stats.userStatsData);
  
  // State to store selected user's email for deletion
  const [userEmail, setUserEmail] = useState(null);
  
  // State to manage delete confirmation modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Function to fetch the user list from the API
  const fetchUserList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_USER_DATA_API_END_POINT}/user-stats`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setUsersList(response.data.data);
      }
    } catch (err) {
      console.log(`Error in fetching user list: ${err}`);
    }
  };
  
  // Function to handle account deletion
  const handleDeleteAccount = async (email) => {
    try {
      // Show loading state for the specific user
      dsetLoading((prevLoading) => ({ ...prevLoading, [email]: true }));
      
      // API request to delete user account
      const response = await axios.delete(`${USER_API_END_POINT}/delete`, {
        data: { email },
        withCredentials: true,
      });
      
      if (response.data.success) {
        // Remove deleted user from the user list
        setUsersList((prevList) =>
          prevList.filter((user) => user.email !== email)
      );
      
      // Fetch updated user statistics
      dispatch(fetchUserStats());
      dispatch(fetchApplicationStats());
      
      // Show success notification
      toast.success(response.data.message);
    }
  } catch (err) {
    console.error("Error deleting account: ", err.message);
    toast.error("Error in deleting account");
  } finally {
    // Hide loading state
    dsetLoading((prevLoading) => ({ ...prevLoading, [email]: false }));
  }
};

const [selectedUsers, setSelectedUsers] = useState([])


const downloadCSV = () => {
  const headers = ["Name", "Email", "Contact", "Join Date", "Applications", "Resume"];

  // Filter selected users
  const exportUsers = selectedUsers.length > 0
    ? usersList.filter(user => selectedUsers.includes(user._id))
    : filteredUsers;

  const rows = exportUsers.map((user) => [
    user.fullname,
    user.email,
    user.phoneNumber,
    user.joined,
    user.applicationCount,
    user.resumeurl,
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
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

const toggleSelectAll = () => {
  if (selectedUsers.length === paginatedUsers.length) {
    setSelectedUsers([]);
  } else {
    const allUserIds = paginatedUsers.map((user) => user._id);
    setSelectedUsers(allUserIds);
  }
};
const toggleUserSelection = (userId) => {
  setSelectedUsers((prevSelected) =>
    prevSelected.includes(userId)
      ? prevSelected.filter((id) => id !== userId)
      : [...prevSelected, userId]
  );
};
  // Function to confirm deletion and proceed with account deletion
  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    handleDeleteAccount(userEmail);
  };
  
  // Function to cancel deletion
  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };
  
  // Fetch user list on component mount or when user changes
  useEffect(() => {
    if (user) fetchUserList();
  }, [user]);
  
  const stats = [
    {
      title: "Total Users",
      count: userStats?.totalUsers || 0,
      change: "+12.5%",
      icon: <FaRegUser size={30} />,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Total Jobs",
      count: jobStats?.totalJobs || 0,
      change: "+5.2%",
      icon: <Briefcase size={30} />,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      title: "Active Jobs",
      count: jobStats?.totalActiveJobs || 0,
      change: "+5.2%",
      icon: <CheckCircle size={30} />,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Applications",
      count: applicationStats?.totalApplications || 0,
      change: "+15.3%",
      icon: <FileText size={30} />,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
  ];
  
  const filteredUsers = usersList?.filter(
    (user) =>
    user.fullname.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.phoneNumber.toLowerCase().includes(search.toLowerCase())||
    (user.jobRole && user.jobRole.toLowerCase().includes(search.toLowerCase())) ||
    (user.duration && user.duration.toLowerCase().includes(search.toLowerCase()))
  );
  
  const paginatedUsers = filteredUsers?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  // const visiblePages = 20;
  // const startPage = Math.floor((page - 1) / visiblePages) * visiblePages + 1;
  // const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  return (
    <>
      <Navbar linkName={"Users"} />
      {/* Stats Cards */}
      <div className=" p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
          key={index}
          className="p-4 flex items-center justify-between bg-white shadow rounded-xl"
          >
            <div>
              <h3 className="text-lg font-semibold mt-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-left">{stat.count}</p>
              {/* <span className="text-sm text-gray-500">
                {stat.change} from last month
                </span> */}
            </div>
            <div className={`p-2 rounded-full ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>
      {/* -------------------------------------------------------------------------------------- */}
      <div className="w-full overflow-x-auto px-4 m-4">
  <div className="min-w-[1500px] bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search users by name, email, contact, job role, experience"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
        </div>
        <div className="overflow-x-auto w-full">

        <Table className="table-auto min-w-[1500px] w-full text-center border border-gray-300 border-collapse">
          <TableHeader>

            <TableRow>

            <TableHead>
              <input
                type="checkbox"
                checked={selectedUsers.length === paginatedUsers.length}
                onChange={toggleSelectAll}
                />
            </TableHead>
              <TableHead className="border border-gray-300 text-center text-2xl text-blue-700 font-bold font-[Oswald]">Name</TableHead>
              <TableHead className="border border-gray-300 text-center text-2xl text-blue-700 font-bold font-[Oswald]">Email</TableHead>
              <TableHead className="border border-gray-300 text-center text-2xl text-blue-700 font-bold font-[Oswald]">Contact</TableHead>
              <TableHead className="border border-gray-300 text-center text-2xl text-blue-700 font-bold font-[Oswald]">Join Date</TableHead>
              <TableHead className="border border-gray-300 text-center text-2xl text-blue-700 font-bold font-[Oswald]">Applications</TableHead>
              <TableHead className="border border-gray-300 text-center text-2xl text-blue-700 font-bold font-[Oswald]">Job Role</TableHead>
              <TableHead className="border border-gray-300 text-center text-2xl text-blue-700 font-bold font-[Oswald]">Experience</TableHead>
              <TableHead className="border border-gray-300 text-center text-2xl text-blue-700 font-bold font-[Oswald]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {paginatedUsers?.map((user) => (
              
              <TableRow key={user._id}>
          <TableHead>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                    />
                    </TableHead>
                <TableCell className='whitespace-nowrap border border-gray-300' >{user.fullname}</TableCell>
                <TableCell className='whitespace-nowrap border border-gray-300' >{user.email}</TableCell>
                <TableCell className='whitespace-nowrap border border-gray-300' >{user.phoneNumber}</TableCell>
                <TableCell className='whitespace-nowrap border border-gray-300' >{user.joined}</TableCell>
                <TableCell className='whitespace-nowrap border border-gray-300' >{user.applicationCount}</TableCell>
                <TableCell className='whitespace-nowrap border border-gray-300' >{user.jobRole|| "N/A"}</TableCell>
                <TableCell className='whitespace-nowrap border border-gray-300' >{user.duration|| "N/A"}</TableCell>

                <TableCell className="flex gap-4 justify-center">
                  <Eye
                    className="text-blue-500 cursor-pointer"
                    size={16}
                    onClick={() => navigate(`/admin/users/details/${user._id}`)}
                    />
                  {dloading[user?.email] ? (
                    "deleting..."
                  ) : (
                    <Trash
                    className="text-red-500 cursor-pointer"
                    size={16}
                    onClick={() => {
                      setUserEmail(user.email);
                      setShowDeleteModal(true);
                    }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            </div>
            </div>
        <div className="flex gap-2">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>

            {(() => {
              const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
              const visiblePages = 20;
              const startPage = Math.floor((page - 1) / visiblePages) * visiblePages + 1;
              const endPage = Math.min(startPage + visiblePages - 1, totalPages);

              return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const pageNumber = startPage + i;
                return (
                  <Button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={page === pageNumber ? "bg-blue-700 text-white" : ""}
                  >
                    {pageNumber}
                  </Button>
                );
              });
            })()}

            <Button
              disabled={page === Math.ceil(filteredUsers.length / itemsPerPage)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>

        </div>
      
      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
      <div className="flex justify-end items-center mb-4">
        <Button onClick={downloadCSV} className="bg-green-600 text-white">
          Download CSV
        </Button>
      </div>

    </>
  );
};

export default Users;
