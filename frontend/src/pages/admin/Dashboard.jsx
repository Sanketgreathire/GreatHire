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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Track dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      title: "Total Companies",
      count: companyStats?.totalCompanies || 0,
      change: "+10%",
      icon: <HiOutlineBuildingOffice2 size={26} />,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-200/40 dark:bg-indigo-900/30",
    },
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0,
      change: "+8.1%",
      icon: <UserCheck size={26} />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-200/40 dark:bg-purple-900/30",
    },
    {
      title: "Total Users",
      count: userStats?.totalUsers || 0,
      change: "+12.5%",
      icon: <FaRegUser size={26} />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-200/40 dark:bg-blue-900/30",
    },
    {
      title: "Total Jobs",
      count: jobStats?.totalJobs || 0,
      change: "+5.2%",
      icon: <Briefcase size={26} />,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-200/40 dark:bg-green-900/30",
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
              borderColor: isDarkMode ? "rgba(192,132,252,1)" : "rgba(147,51,234,1)",
              backgroundColor: isDarkMode ? "rgba(192,132,252,0.2)" : "rgba(147,51,234,0.3)",
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
  }, [selectedYear, isDarkMode]);

  // Chart options with dark mode support
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#f3f4f6' : '#111827',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
      },
    },
  };

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
              className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 dark:border-gray-700/40 p-4 sm:p-5 md:p-6 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    <CountUp end={stat.count} duration={1.5} />
                  </p>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">{stat.change}</span>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-md`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <p className="text-2xl text-blue-700 dark:text-blue-400 mt-6">Loading...</p>
        ) : (
          <>
            {/* Recent Activity & Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Card className="p-6 shadow-xl rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
                  Recent Activities
                </h3>
                <ul className="relative border-l-2 border-purple-300 dark:border-purple-600 ml-4 sm:ml-6">
                  {["User Registered","Company Registered","Recruiter Registered","Job Posted","Application Submitted"].map((label, i) => (
                    <li key={i} className="mb-8 ml-4">
                      <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 rounded-full ring-4 ring-white dark:ring-gray-900 text-white shadow-md">
                        {label.charAt(0)}
                      </span>
                      <p className="font-medium text-gray-700 dark:text-gray-300 pl-4">{label}</p>
                      <span className="text-sm text-gray-500 dark:text-gray-400 pl-4">{recentActivity?.[i]}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 shadow-xl rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Applications Overview
                  </h3>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    variant="outlined"
                    size="small"
                    style={{ minWidth: 120 }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#8b5cf6' : '#7c3aed',
                      },
                      '& .MuiSelect-select': {
                        color: isDarkMode ? '#f3f4f6' : '#111827',
                        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                      },
                      '& .MuiSvgIcon-root': {
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                      },
                      backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                      borderRadius: '0.5rem',
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: isDarkMode ? '#374151' : '#ffffff',
                          color: isDarkMode ? '#f3f4f6' : '#111827',
                          '& .MuiMenuItem-root': {
                            '&:hover': {
                              bgcolor: isDarkMode ? '#4b5563' : '#f3f4f6',
                            },
                            '&.Mui-selected': {
                              bgcolor: isDarkMode ? '#4b5563' : '#e5e7eb',
                              '&:hover': {
                                bgcolor: isDarkMode ? '#6b7280' : '#d1d5db',
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </div>

                <div className="w-full overflow-x-auto">
                  <div className="min-w-[320px]">
                    <Line data={applicationsData} options={chartOptions} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Job Postings */}
            <Card className="p-6 mt-8 shadow-xl rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Recent Job Postings
                </h3>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  Total Jobs: <span className="font-bold text-gray-900 dark:text-white">{jobPostings.length}</span>
                </h3>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="min-w-[700px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200 dark:border-gray-700">
                        <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Job Title</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Company</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Posted</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Applications</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedJobs.length > 0 ? (
                        displayedJobs.map((job) => (
                          <TableRow key={job._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <TableCell className="text-gray-900 dark:text-gray-100 font-medium">{job.jobTitle}</TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-100">{job.company}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">{job.posted}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">{job.applications}</TableCell>
                            <TableCell>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                {job.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No job postings available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {jobPostings.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mt-6 gap-3">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="rounded-full px-4 py-2 flex items-center gap-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="rounded-full px-4 py-2 flex items-center gap-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;