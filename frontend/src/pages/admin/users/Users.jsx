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
import { Briefcase, FileText, UserCheck } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Navbar from "@/components/admin/Navbar";
import { useSelector } from "react-redux";
import {
  ADMIN_USER_DATA_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/ApiEndPoint";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Users = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();
  const [dloading, dsetLoading] = useState({});

  // fetch user list
  const fetchUserList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_USER_DATA_API_END_POINT}/user-stats`
      );
      if (response.data.success) {
        setUsersList(response.data.data);
      }
    } catch (err) {
      console.log(`Error in fetch user list ${err}`);
    }
  };

  const handleDeleteAccount = async (email) => {
    try {
      dsetLoading((prevLoading) => ({ ...prevLoading, [email]: true }));
      const response = await axios.delete(`${USER_API_END_POINT}/delete`, {
        data: { email },
        withCredentials: true,
      });
      if (response.data.success) {
        navigate("/");
        dispatch(logOut());
      }
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error deleting account: ", err.message);
      toast.error("Error in deleting account");
    } finally {
      dsetLoading((prevLoading) => ({ ...prevLoading, [email]: false }));
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const { statsData } = useSelector((state) => state.stats);

  const stats = [
    {
      title: "Total Users",
      count: statsData.totalUsers,
      change: "+12.5%",
      icon: <FaRegUser size={30} />,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Active Jobs",
      count: statsData.activeJobs,
      change: "+5.2%",
      icon: <Briefcase size={30} />,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Applications",
      count: statsData.totalApplications,
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
      user.phoneNumber.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Navbar linkName={"Users"} />
      {/* Stats Cards */}
      <div className=" p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-4 flex items-center justify-between bg-white shadow rounded-xl"
          >
            <div>
              <h3 className="text-lg font-semibold mt-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-center">{stat.count}</p>
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
      <div className=" m-4 p-4 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search users by name, email, contact"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
        </div>
        <Table className="text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Contact</TableHead>
              <TableHead className="text-center">Join Date</TableHead>
              <TableHead className="text-center"> Applications</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.joined}</TableCell>

                <TableCell>{user.applicationCount}</TableCell>
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
                      onClick={() => handleDeleteAccount(user.email)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <span>
            Showing{" "}
            {Math.min((page - 1) * itemsPerPage + 1, filteredUsers.length)} to{" "}
            {Math.min(page * itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} results
          </span>
          <div className="flex gap-2">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            {[...Array(Math.ceil(filteredUsers.length / itemsPerPage))].map(
              (_, i) => (
                <Button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={page === i + 1 ? "bg-blue-700 text-white" : ""}
                >
                  {i + 1}
                </Button>
              )
            )}
            <Button
              disabled={page === Math.ceil(filteredUsers.length / itemsPerPage)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
