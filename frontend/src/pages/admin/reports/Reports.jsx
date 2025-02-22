import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "@/components/admin/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, MenuItem, FormControl } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, Users, Briefcase, CheckCircle } from "lucide-react";
import axios from "axios";
import { ADMIN_STAT_API_END_POINT } from "@/utils/ApiEndPoint";

const Reports = () => {
  const { user } = useSelector((state) => state.auth);
  // Get the current year
  const currentYear = new Date().getFullYear();
  // Define available years (current year and previous 5 years)
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Default the selected year to the current year and range to 7 (days)
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedRange, setSelectedRange] = useState(7);
  const [statsData, setStatsData] = useState(null);
  
  const applicationSuccessRate = statsData?.totalApplications
    ? Number(
        (
          (statsData?.shortlistedApplications * 100) /
          statsData?.totalApplications
        ).toFixed(2)
      )
    : 0;

  const handleRangeChange = (event) =>
    setSelectedRange(Number(event.target.value));

  // Function to call the API to get filtered statistics
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_STAT_API_END_POINT}/getState-in-range`,
        {
          params: { year: selectedYear, range: selectedRange },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setStatsData(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    if (user) fetchStatistics();
  }, [user]);

  // Application stats for the pie chart
  const applicationStats = [
    {
      name: "Shortlisted",
      value: statsData?.shortlistedApplications || 0,
      color: "#4CAF50",
    },
    {
      name: "Pending",
      value: statsData?.pendingApplications || 0,
      color: "#FFC107",
    },
    {
      name: "Rejected",
      value: statsData?.rejectedApplications || 0,
      color: "#F44336",
    },
  ];

  return (
    <>
      <Navbar linkName={"Reports"} />
      <div className="p-4">
        <h2 className="text-xl font-bold">Analytics Overview</h2>

        {/* Filters Section */}
        <div className="bg-white p-4 flex items-center justify-evenly gap-2">
          <FormControl fullWidth>
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
          </FormControl>

          <FormControl fullWidth>
            <Select
              value={selectedRange}
              onChange={handleRangeChange}
              className="h-12"
            >
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
              <MenuItem value={1}>Last Month</MenuItem>
              <MenuItem value={3}>Last 3 Months</MenuItem>
              <MenuItem value={6}>Last 6 Months</MenuItem>
              <MenuItem value={12}>12 Months</MenuItem>
            </Select>
          </FormControl>

          <Button
            className="w-60 h-12 bg-blue-700 hover:bg-blue-600 font-bold"
            onClick={fetchStatistics}
          >
            Filter Reports
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-center">
                ₹{statsData?.totalRevenue || 0}
              </h3>
            </div>
            <DollarSign
              className="text-green-500 bg-green-100 p-2 rounded-lg"
              size={45}
            />
          </Card>
          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">New Users</p>
              <h3 className="text-2xl font-bold text-center">
                {statsData?.newUsers || 0}
              </h3>
            </div>
            <Users
              className="text-blue-500 bg-blue-100 p-2 rounded-lg"
              size={45}
            />
          </Card>
          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Application Success Rate</p>
              <h3 className="text-2xl font-bold text-center">
                {applicationSuccessRate}%
              </h3>
            </div>
            <CheckCircle
              className="text-purple-500 bg-purple-100 p-2 rounded-lg"
              size={45}
            />
          </Card>
          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Posted Jobs</p>
              <h3 className="text-2xl font-bold text-center">
                {statsData?.totalJobs || 0}
              </h3>
            </div>
            <Briefcase
              className="text-yellow-600 bg-yellow-100 p-2 rounded-lg"
              size={45}
            />
          </Card>
        </div>

        {/* Revenue and User Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              {statsData?.revenueTrend.length === 0 ? (
                <p className="flex justify-center text-2xl text-gray-400">
                  No Revenue
                </p>
              ) : (
                <LineChart data={statsData?.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#6A0DAD" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold">User Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              {statsData?.newUsersTrend.length === 0 ? (
                <p className="flex justify-center text-2xl text-gray-400">
                  No New User
                </p>
              ) : (
                <BarChart data={statsData?.newUsersTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#6A0DAD" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Application Stats */}
        <div className="grid grid-cols-1 gap-6 mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Application Stats</h3>
            <div className="flex items-center justify-around">
              {/* Pie Chart */}
              <ResponsiveContainer width="70%" height={450}>
                <PieChart>
                  <Pie
                    data={applicationStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={170}
                    dataKey="value"
                    label
                  >
                    {applicationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex flex-col gap-4">
                {applicationStats.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-4 h-4"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <p className="ml-2">{entry.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Reports;
