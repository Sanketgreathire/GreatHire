// Dashboard.jsx
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
import { Briefcase, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useSelector } from "react-redux";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import VerifiedRecruiterBadges from "@/components/VerifiedRecruiterBadges";

const Dashboard = () => {
  const companyStats = useSelector((state) => state.stats.companyStatsData);
  const { user } = useSelector((state) => state.auth);
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
      icon: <HiOutlineBuildingOffice2 size={26} />,
      color: "text-indigo-600",
      bg: "bg-indigo-200/40",
    },
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0,
      change: "+8.1%",
      icon: <UserCheck size={26} />,
      color: "text-purple-600",
      bg: "bg-purple-200/40",
    },
    {
      title: "Total Users",
      count: userStats?.totalUsers || 0,
      change: "+12.5%",
      icon: <FaRegUser size={26} />,
      color: "text-blue-600",
      bg: "bg-blue-200/40",
    },
    {
      title: "Total Jobs",
      count: jobStats?.totalJobs || 0,
      change: "+5.2%",
      icon: <Briefcase size={26} />,
      color: "text-green-600",
      bg: "bg-green-200/40",
    },
  ];

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const [applicationsData, setApplicationsData] = useState({
    labels: monthLabels,
    datasets: [
      {
        label: "Applications",
        data: Array(12).fill(0),
        borderColor: "rgba(147,51,234,1)",
        backgroundColor: "rgba(147,51,234,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${ADMIN_STAT_API_END_POINT}/applications?year=${selectedYear}`,
          { withCredentials: true }
        );
        setApplicationsData({
          labels: monthLabels,
          datasets: [
            {
              label: "Applications",
              data: response.data.data,
              borderColor: "rgba(147,51,234,1)",
              backgroundColor: "rgba(147,51,234,0.3)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching applications data:", error);
      }
    };
    fetchData();
  }, [selectedYear]);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const totalPages = Math.ceil(jobPostings.length / jobsPerPage);
  const displayedJobs = jobPostings.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/recent-activity`, { withCredentials: true });
      if (response.data.success) setRecentActivity(response.data.data);
    } catch (err) {
      console.log(`Error in fetch recent activity ${err}`);
    }
  };

  const fetchRecentPostedJob = async () => {
    try {
      const response = await axios.get(`${ADMIN_STAT_API_END_POINT}/recent-job-postings`, { withCredentials: true });
      if (response.data.success) setJobPostedJob(response.data.jobPostings);
    } catch (err) {
      console.log(`Error in fetch recent activity ${err}`);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchRecentActivity();
      fetchRecentPostedJob();
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      <Navbar linkName={"Dashboard"} />

      <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen transition-colors overflow-x-hidden">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              👋 Welcome, Admin
            </h1>
            <VerifiedRecruiterBadges plan="ENTERPRISE" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-4 sm:p-5 md:p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    <CountUp end={stat.count} duration={1.5} />
                  </p>
                  <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-md`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <p className="text-2xl text-blue-700 mt-6">Loading...</p>
        ) : (
          <>
            {/* Recent Activity & Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Card className="p-6 shadow-xl rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
                  Recent Activities
                </h3>
                <ul className="relative border-l-2 border-purple-300 dark:border-purple-600 ml-4 sm:ml-6">
                  {["User Registered","Company Registered","Recruiter Registered","Job Posted","Application Submitted"].map((label, i) => (
                    <li key={i} className="mb-8 ml-4">
                      <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full ring-4 ring-white dark:ring-gray-900 text-white">
                        {label.charAt(0)}
                      </span>
                      <p className="font-medium text-gray-700 dark:text-gray-300 pl-4">{label}</p>
                      <span className="text-sm text-gray-500 dark:text-gray-400 pl-4">{recentActivity?.[i]}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 shadow-xl rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Applications Overview
                  </h3>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    variant="outlined"
                    size="small"
                    style={{ minWidth: 120 }}
                  >
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </div>

                <div className="w-full overflow-x-auto">
                  <div className="min-w-[320px]">
                    <Line data={applicationsData} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Job Postings */}
            <Card className="p-6 mt-8 shadow-xl rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Recent Job Postings
                </h3>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  Total Jobs: <span className="font-bold">{jobPostings.length}</span>
                </h3>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="min-w-[700px]">
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
                          <TableCell>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold">
                              {job.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mt-6 gap-3">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="rounded-full px-4 py-2 flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Prev
                </Button>

                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="rounded-full px-4 py-2 flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
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
