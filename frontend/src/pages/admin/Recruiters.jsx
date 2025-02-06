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
import { Card } from "@/components/ui/card";
import { Select, MenuItem } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import Navbar from "@/components/admin/Navbar";

const dummyRecruiters = [
  {
    id: 1,
    company: "TechCorp Solutions",
    contactPerson: "Michael Brown",
    email: "hr@techcorp.com",
    activeJobs: 15,
    subscription: "Premium",
    status: "Verified",
  },
  {
    id: 2,
    company: "Global Hire Inc",
    contactPerson: "Sarah Wilson",
    email: "sarah@globalhire.com",
    activeJobs: 8,
    subscription: "Basic",
    status: "Pending",
  },
];

const Recruiters = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const stats = [
    {
      title: "Total Recruiters",
      count: 245,
      change: "+10%",
      icon: <FaRegUser size={30} />, 
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Posted Jobs",
      count: 1234,
      change: "+5.2%",
      icon: <Briefcase size={30} />, 
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Verified Recruiters",
      count: 180,
      change: "+8%",
      icon: <UserCheck size={30} />, 
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
  ];

  const filteredRecruiters = dummyRecruiters.filter(
    (recruiter) =>
      (recruiter.company.toLowerCase().includes(search.toLowerCase()) ||
        recruiter.contactPerson.toLowerCase().includes(search.toLowerCase())) &&
      (status === "All" || recruiter.status === status)
  );

  const paginatedRecruiters = filteredRecruiters.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Navbar linkName={"Recruiters"} />
      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 flex items-center justify-between bg-white shadow rounded-xl">
            <div>
              <h3 className="text-lg font-semibold mt-2">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.count.toLocaleString()}</p>
              {/* <span className="text-sm text-gray-500">{stat.change} from last month</span> */}
            </div>
            <div className={`p-2 rounded-full ${stat.bg} ${stat.color}`}>{stat.icon}</div>
          </Card>
        ))}
      </div>
      <div className="m-4 p-4 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search recruiters by company, contact person"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-1/6 h-10">
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Active Jobs</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecruiters.map((recruiter) => (
              <TableRow key={recruiter.id}>
                <TableCell>{recruiter.company}</TableCell>
                <TableCell>{recruiter.contactPerson}<br />{recruiter.email}</TableCell>
                <TableCell>{recruiter.activeJobs}</TableCell>
                <TableCell>{recruiter.subscription}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    recruiter.status === "Verified" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                  }`}>
                    {recruiter.status}
                  </span>
                </TableCell>
                <TableCell className="flex">
                  <Trash className="text-red-500 cursor-pointer" size={16} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <span>
            Showing {Math.min((page - 1) * itemsPerPage + 1, filteredRecruiters.length)} to {Math.min(page * itemsPerPage, filteredRecruiters.length)} of {filteredRecruiters.length} results
          </span>
          <div className="flex gap-2">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            {[...Array(Math.ceil(filteredRecruiters.length / itemsPerPage))].map((_, i) => (
              <Button key={i} onClick={() => setPage(i + 1)} className={page === i + 1 ? "bg-blue-700 text-white" : ""}>{i + 1}</Button>
            ))}
            <Button disabled={page === Math.ceil(filteredRecruiters.length / itemsPerPage)} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recruiters;
