import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom"; // Use Outlet for nested routing
import Navbar from "@/components/shared/Navbar";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import {
  addCompany,
  updateCandidateCredits,
  updateMaxPostJobs,
} from "@/redux/companySlice";
import DashboardNavigations from "./DashboardNavigations";
import { fetchRecruiters } from "@/redux/recruiterSlice";
import { fetchCurrentPlan } from "@/redux/jobPlanSlice";
import { io } from "socket.io-client";
import { BACKEND_URL } from "@/utils/ApiEndPoint";
import { Helmet } from "react-helmet-async";

const socket = io(BACKEND_URL, { transports: ["websocket"] }); // Use your backend URL

const RecruiterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const { recruiters } = useSelector((state) => state.recruiters);
  const { jobPlan } = useSelector((state) => state.jobPlan);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Loading state for API calls

  // Fetch company details by user ID when component mounts or when user changes
  useEffect(() => {
    const fetchCompanyByUserId = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${COMPANY_API_END_POINT}/company-by-userid`,
          { userId: user?._id }, // Sending user ID in request body
          { withCredentials: true } // Include credentials (cookies) in request
        );
        if (response?.data.success) {
          dispatch(addCompany(response?.data.company));
        }
      } catch (err) {
        console.error(`Error fetching company by user: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCompanyByUserId();
  }, [user]);

  // Fetch recruiters and job plan if company exists
  useEffect(() => {
    if (company) {
      // Fetch recruiters if user is active, company is created, and recruiters list is empty
      if (
        user?.isActive &&
        user?.isCompanyCreated &&
        recruiters?.length === 0
      ) {
        dispatch(fetchRecruiters(company?._id));
      }
      // Fetch job plan if it's not available
      if (!jobPlan) {
        dispatch(fetchCurrentPlan(company?._id));
      }
    }
  }, [company, user, recruiters, jobPlan, dispatch]);

  //  Socket.IO for Real-time Plan Expiration Updates
  useEffect(() => {
    socket.on("planExpired", ({ companyId, type }) => {

      // Check if the expired plan belongs to the current company
      if (company && companyId === company?._id) {
        if (type === "job") {
          dispatch(updateMaxPostJobs(0)); // Set max job posts to zero
        } else if (type === "candidate") {
          dispatch(updateCandidateCredits(0)); // Set candidate credits to zero
        }
      }
    });

    return () => {
      socket.off("planExpired");
    };
  }, [company, dispatch]);

  return (
    <>
      <Helmet>
        <title>
          Dashboard | Jobs, Applicants & Hiring Analytics – GreatHire
        </title>

        <meta
          name="description"
          content="GreatHire’s recruiter dashboard empowers companies to manage hiring with confidence and speed, offering real-time insights and analytics. Headquartered in Hyderabad State, India, this platform helps track posted jobs, active and expired roles, applicants, shortlisted candidates, recruiters, and hiring credits from a single, centralized dashboard. Designed for modern recruiters, GreatHire delivers scalable hiring solutions, combining job performance metrics, applicant management, and recruiter oversight. Gain full visibility, smarter control, and faster decision-making to attract top talent, streamline recruitment processes, and grow high-performing teams with a trusted platform built for efficiency and recruitment success."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-1">
          <DashboardNavigations />
          <div className="flex-1 bg-gradient-to-r bg-gray-100 overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-500 py-10">Loading...</div>
            ) : (
              <Outlet /> // Render nested routes
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default RecruiterDashboard;
