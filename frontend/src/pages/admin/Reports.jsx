import React, { useState } from "react";
import Navbar from "@/components/admin/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
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
  Legend,
} from "recharts";
import { DollarSign, Users, Briefcase, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";

const Reports = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedRange, setSelectedRange] = useState("last7");
  const { statsData } = useSelector((state) => state.stats);

  const applicationSuccessRate = Number(((statsData.shortlistedApplications * 100) / statsData.totalApplications).toFixed(2));


  // Handling Year and Range change
  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleRangeChange = (event) => setSelectedRange(event.target.value);

  const dataRevenue = [
    { month: "Jan", revenue: 30000 },
    { month: "Feb", revenue: 35000 },
    { month: "Mar", revenue: 45000 },
    { month: "Apr", revenue: 40000 },
    { month: "May", revenue: 50000 },
    { month: "Jun", revenue: 46000 },
    { month: "July", revenue: 40000 },
    { month: "Aug", revenue: 35000 },
    { month: "Sep", revenue: 40000 },
    { month: "Oct", revenue: 10000 },
    { month: "Jun", revenue: 13000 },
    { month: "Jun", revenue: 70000 },
  ];

  const dataUsers = [
    { month: "Jan", users: 400 },
    { month: "Feb", users: 800 },
    { month: "Mar", users: 1200 },
    { month: "Apr", users: 1000 },
    { month: "May", users: 1500 },
    { month: "Jun", users: 1300 },
    { month: "Jun", users: 1300 },
    { month: "Jun", users: 1300 },
    { month: "Jun", users: 1300 },
    { month: "Jun", users: 1300 },
    { month: "Jun", users: 1300 },
    { month: "Jun", users: 1300 },
  ];

  const applicationStats = [
    {
      name: "Shortlisted",
      value: statsData.shortlistedApplications || 0,
      color: "#4CAF50",
    },
    {
      name: "Pending",
      value: statsData.pendingApplications || 0,
      color: "#FFC107",
    },
    {
      name: "Rejected",
      value: statsData.rejectedApplications || 0,
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
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              className="h-12"
            >
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Select
              value={selectedRange}
              onChange={handleRangeChange}
              className="h-12"
            >
              <MenuItem value="last7">Last 7 Days</MenuItem>
              <MenuItem value="last30">Last 30 Days</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
              <MenuItem value="last3">Last 3 Months</MenuItem>
              <MenuItem value="last6">Last 6 Months</MenuItem>
            </Select>
          </FormControl>

          <Button
            className="w-60 h-12 bg-blue-700 hover:bg-blue-600 font-bold"
            onClick={() => {
              /* You can handle the action when button is clicked */
            }}
          >
            Filter Reports
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-center">₹45,678</h3>
              {/* <p className="text-green-500 text-sm">+12.5% from last period</p> */}
            </div>
            <DollarSign
              className="text-green-500 bg-green-100 p-2 rounded-lg"
              size={45}
            />
          </Card>
          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">New Users</p>
              <h3 className="text-2xl font-bold text-center">1,234</h3>
              {/* <p className="text-green-500 text-sm">+8.2% from last period</p> */}
            </div>
            <Users
              className="text-blue-500 bg-blue-100 p-2 rounded-lg"
              size={45}
            />
          </Card>
          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Application Success Rate</p>
              <h3 className="text-2xl font-bold text-center">{applicationSuccessRate}%</h3>
              {/* <p className="text-green-500 text-sm">+5.3% from last period</p> */}
            </div>
            <CheckCircle
              className="text-purple-500 bg-purple-100 p-2 rounded-lg"
              size={45}
            />
          </Card>
          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Jobs</p>
              <h3 className="text-2xl font-bold text-center">{statsData.activeJobs}</h3>
              {/* <p className="text-green-500 text-sm">+15.7% from last period</p> */}
            </div>
            <Briefcase
              className="text-yellow-600 bg-yellow-100 p-2 rounded-lg"
              size={45}
            />
          </Card>
        </div>

        {/* Revenue and User Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#6A0DAD" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold">User Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataUsers}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#6A0DAD" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Application */}
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
              <div className="flex flex-col gap-4 ">
                {applicationStats.map((entry, index) => (
                  <div key={index} className="flex items-center mb-2">
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
