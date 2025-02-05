import React, { useState } from "react";
import Navbar from "@/components/admin/Navbar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, UserCheck } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      count: 24563,
      change: "+12.5%",
      icon: <FaRegUser size={30} />,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Active Jobs",
      count: 1234,
      change: "+5.2%",
      icon: <Briefcase size={30} />,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Total Recruiters",
      count: 892,
      change: "+8.1%",
      icon: <UserCheck size={30} />,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      title: "Applications",
      count: 45789,
      change: "+15.3%",
      icon: <FileText size={30} />,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
  ];

  const applicationsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Applications",
        data: [1000, 1800, 2900, 2700, 3300, 4000],
        borderColor: "purple",
        backgroundColor: "rgba(128, 0, 128, 0.1)",
        fill: true,
      },
    ],
  };

  // Sample job postings data
  const jobPostings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      posted: "2 days ago",
      applications: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "InnovateX",
      posted: "4 days ago",
      applications: 30,
      status: "Closed",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Creative Labs",
      posted: "1 week ago",
      applications: 25,
      status: "Active",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudNet",
      posted: "5 days ago",
      applications: 18,
      status: "Active",
    },
    {
      id: 5,
      title: "Data Scientist",
      company: "BigData Solutions",
      posted: "3 days ago",
      applications: 50,
      status: "Closed",
    },
    {
      id: 6,
      title: "Mobile Developer",
      company: "AppMasters",
      posted: "6 days ago",
      applications: 20,
      status: "Active",
    },
    {
      id: 7,
      title: "Product Manager",
      company: "VisionaryTech",
      posted: "1 week ago",
      applications: 15,
      status: "Active",
    },
    {
      id: 8,
      title: "QA Engineer",
      company: "TestifyQA",
      posted: "2 weeks ago",
      applications: 10,
      status: "Closed",
    },
    {
      id: 9,
      title: "Full Stack Developer",
      company: "CodeCrafters",
      posted: "3 days ago",
      applications: 40,
      status: "Active",
    },
    {
      id: 10,
      title: "Marketing Manager",
      company: "AdWorld",
      posted: "5 days ago",
      applications: 35,
      status: "Active",
    },
    {
      id: 11,
      title: "Cybersecurity Analyst",
      company: "SecureNet",
      posted: "1 week ago",
      applications: 22,
      status: "Active",
    },
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const totalPages = Math.ceil(jobPostings.length / jobsPerPage);

  const displayedJobs = jobPostings.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <>
      <Navbar linkName={"Dashboard"} />
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-4 flex items-center justify-between bg-white shadow rounded-xl"
            >
              <div>
                <h3 className="text-lg font-semibold mt-2">{stat.title}</h3>
                <p className="text-2xl font-bold">
                  {stat.count.toLocaleString()}
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

        {/* Recent Activity & Applications Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-3">
                <span className="h-8 w-8 bg-pink-500 text-white flex items-center justify-center rounded-full">
                  R
                </span>
                <p>
                  New recruiter registration{" "}
                  <span className="text-gray-400 text-sm">2 minutes ago</span>
                </p>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-8 w-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                  J
                </span>
                <p>
                  New job posted{" "}
                  <span className="text-gray-400 text-sm">15 minutes ago</span>
                </p>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-8 w-8 bg-green-500 text-white flex items-center justify-center rounded-full">
                  A
                </span>
                <p>
                  Application submitted{" "}
                  <span className="text-gray-400 text-sm">1 hour ago</span>
                </p>
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold">Applications Overview</h3>
            <Line data={applicationsData} />
          </Card>
        </div>

        {/* Recent Job Postings - Table with Pagination */}
        <Card className="p-4 mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Job Postings</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.posted}</TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell
                    className={
                      job.status === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {job.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-end mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
