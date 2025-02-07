import React, { useState } from "react";
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
import { Trash } from "lucide-react";
import { Briefcase, FileText, UserCheck } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Select, MenuItem } from "@mui/material";
import Navbar from "@/components/admin/Navbar";
import { useSelector } from "react-redux";

const dummyUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    joinDate: "Jan 15, 2024",
    status: "Active",
    applications: 12,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    joinDate: "Feb 1, 2024",
    status: "Pending",
    applications: 8,
  },
];

const Users = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredUsers = dummyUsers.filter(
    (user) =>
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())) &&
      (status === "All" || user.status === status)
  );

  const paginatedUsers = filteredUsers.slice(
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
              <p className="text-2xl font-bold text-center">
                {stat.count}
              </p>
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
            placeholder="Search users by name, email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-1/6 h-10"
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium  ${
                      user.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.applications}</TableCell>
                <TableCell className="flex ">
                  <Trash className="text-red-500 cursor-pointer" size={16} />
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
