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
import { Trash, Eye, Pencil } from "lucide-react";
import { Briefcase, FileText, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, MenuItem } from "@mui/material";
import Navbar from "@/components/admin/Navbar";
import { useSelector } from "react-redux";

const dummyJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    type: "Full Time",
    location: "Remote",
    salary: "$80k-120k",
    company: "TechCorp Inc.",
    postedDate: "Jan 15, 2024",
    applications: 45,
    newApplications: 12,
    status: "Active",
  },
  {
    id: 2,
    title: "Product Marketing Manager",
    type: "Full Time",
    location: "On-site",
    salary: "$90k-130k",
    company: "Marketing Pro",
    postedDate: "Jan 12, 2024",
    applications: 28,
    newApplications: 5,
    status: "Pending",
  },
  // Add more dummy data here
];

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { statsData } = useSelector((state) => state.stats);

  const stats = [
    {
      title: "Total Jobs",
      count: statsData.totalJobs || 0,
      icon: <CheckCircle size={30} className="text-green-500" />,
    },
    {
      title: "Active Jobs",
      count: statsData.activeJobs || 0,
      icon: <FileText size={30} className="text-yellow-500" />,
    },
    {
      title: "Expired Jobs",
      count: statsData.expiredJobs || 0,
      icon: <XCircle size={30} className="text-red-500" />,
    },
    {
      title: "Total Applications",
      count: statsData.totalApplications || 0,
      icon: <Briefcase size={30} className="text-blue-500" />,
    },
  ];

  const filteredJobs = dummyJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (status === "All" || job.status === status)
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Navbar linkName={"Jobs"} />
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-4 flex items-center justify-between shadow rounded-xl bg-white"
          >
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-2xl font-bold text-center">{stat.count}</p>
            </div>
            {stat.icon}
          </Card>
        ))}
      </div>

      <div className="m-4 p-4 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search jobs..."
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
              <TableHead>Job Details</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-gray-500">
                    {job.type} • {job.location} • {job.salary}
                  </p>
                </TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.postedDate}</TableCell>
                <TableCell>
                  {job.applications} applications
                  <p className="text-green-500 text-sm">
                    {job.newApplications} new
                  </p>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      job.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Eye className="text-blue-500 cursor-pointer" size={16} />
                  <Trash className="text-red-500 cursor-pointer" size={16} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-end items-center mt-4 space-x-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Jobs;
