import React, { useState, useEffect } from "react";
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
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useSelector } from "react-redux";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";

const Dashboard = () => {
  const companyStats = useSelector((state) => state.stats.companyStatsData);
  const recruiterStats = useSelector((state) => state.stats.recruiterStatsData);
  const jobStats = useSelector((state) => state.stats.jobStatsData);
  const userStats = useSelector((state) => state.stats.userStatsData);

  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState(null);
  const [jobPostings, setJobPostedJob] = useState([]);

  const stats = [
    {
      title: "Total Companies",
      count: companyStats?.totalCompanies || 0,
      change: "+10%",
      icon: <HiOutlineBuildingOffice2 size={30} />,
      color: "text-indigo-500",
      bg: "bg-indigo-100",
    },
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0, // Use fetched recruiters count
      change: "+8.1%",
      icon: <UserCheck size={30} />,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      title: "Total Users",
      count: userStats?.totalUsers || 0, // Use fetched total users
      change: "+12.5%",
      icon: <FaRegUser size={30} />,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Total Jobs",
      count: jobStats?.totalJobs || 0, // Use fetched active jobs
      change: "+5.2%",
      icon: <Briefcase size={30} />,
      color: "text-green-500",
      bg: "bg-green-100",
    },
  ];

  // Get the current year
  const currentYear = new Date().getFullYear();
  // Define available years (current year and previous 5 years, adjust as needed)
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Default the selected year to the current year
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Define month labels for all 12 months
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initial chart data (using dummy values for 12 months)
  const [applicationsData, setApplicationsData] = useState({
    labels: monthLabels,
    datasets: [
      {
        label: "Applications",
        data: Array(12).fill(0), // An array of 12 zeros as placeholder
        borderColor: "purple",
        backgroundColor: "rgba(128, 0, 128, 0.1)",
        fill: true,
      },
    ],
  });

  // Fetch data for the selected year
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `${ADMIN_STAT_API_END_POINT}/applications?year=${selectedYear}`
        );
        //  API response returns an array of 12 numbers representing monthly application counts:
        // e.g., { data: [120, 150, 200, ..., 300] }
        setApplicationsData({
          labels: monthLabels,
          datasets: [
            {
              label: "Applications",
              data: response.data.data, // Should be an array of 12 numbers
              borderColor: "purple",
              backgroundColor: "rgba(128, 0, 128, 0.1)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching applications data:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const totalPages = Math.ceil(jobPostings.length / jobsPerPage);

  const displayedJobs = jobPostings.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // fetching recent activity
  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_STAT_API_END_POINT}/recent-activity`
      );
      if (response.data.success) {
        setRecentActivity(response.data.data);
      }
    } catch (err) {
      console.log(`Error in fetch recent activity ${err}`);
    }
  };

  // fetching recent posted job
  const fetchRecentPostedJob = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_STAT_API_END_POINT}/recent-job-postings`
      );
      if (response.data.success) {
        setJobPostedJob(response.data.jobPostings);
      }
    } catch (err) {
      console.log(`Error in fetch recent activity ${err}`);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRecentActivity();
    fetchRecentPostedJob();
    setLoading(false);
  }, []);

  return (
    <>
      <Navbar linkName={"Dashboard"} />
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-4 flex items-center justify-between bg-white shadow rounded-xl"
            >
              <div>
                <h3 className="text-lg  font-semibold mt-2">{stat.title}</h3>
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

        {loading ? (
          <p className="text-2xl text-blue-700">Loading...</p>
        ) : (
          <>
            {/* Recent Activity & Applications Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold">Recent Activities</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 bg-purple-500 text-white flex items-center justify-center rounded-full">
                      U
                    </span>
                    <p>
                      New User Registered{" "}
                      <span className="text-gray-400 text-sm">
                        {recentActivity?.[0]}
                      </span>
                    </p>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                      C
                    </span>
                    <p>
                      New Company Registered{" "}
                      <span className="text-gray-400 text-sm">
                        {recentActivity?.[1]}
                      </span>
                    </p>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 bg-red-500 text-white flex items-center justify-center rounded-full">
                      R
                    </span>
                    <p>
                      New Recruiter Registered{" "}
                      <span className="text-gray-400 text-sm">
                        {recentActivity?.[2]}
                      </span>
                    </p>
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 bg-indigo-500 text-white flex items-center justify-center rounded-full">
                      J
                    </span>
                    <p>
                      New job posted{" "}
                      <span className="text-gray-400 text-sm">
                        {recentActivity?.[3]}
                      </span>
                    </p>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-8 w-8 bg-amber-500 text-white flex items-center justify-center rounded-full">
                      A
                    </span>
                    <p>
                      New Application submitted{" "}
                      <span className="text-gray-400 text-sm">
                        {recentActivity?.[4]}
                      </span>
                    </p>
                  </li>
                </ul>
              </Card>

              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Applications Overview
                  </h3>
                  {/* Year Filter */}
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    variant="outlined"
                    size="small"
                    style={{ minWidth: 120 }}
                  >
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <Line data={applicationsData} />
              </Card>
            </div>

            {/* Recent Job Postings - Table with Pagination */}
            <Card className="p-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Job Postings
                </h3>
                <h3 className="text-lg font-semibold">
                  Total Job:{" "}
                  <span className="text-gray-500">{jobPostings.length}</span>
                </h3>
              </div>
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
                    <TableRow key={job._id}>
                      <TableCell>{job.jobTitle}</TableCell>
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
              <div className="flex items-center justify-end mt-4">
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
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
