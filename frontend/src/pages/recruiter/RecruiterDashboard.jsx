import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom"; 
import Navbar from "@/components/shared/Navbar";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { addCompany } from "@/redux/companySlice";
import DashboardNavigations from "./DashboardNavigations";
import { fetchRecruiters } from "@/redux/recruiterSlice";
import { fetchCurrentPlan } from "@/redux/jobPlanSlice";
import { io } from "socket.io-client";
import { BACKEND_URL } from "@/utils/ApiEndPoint";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "@/components/shared/ErrorBoundary"; 

const RecruiterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const { recruiters } = useSelector((state) => state.recruiters);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const socketRef = React.useRef(null);

  // Extract IDs to prevent exhaustive-deps warnings
  const userId = user?._id;
  const companyId = company?._id;

  // Fetch company details by user ID when component mounts or when user changes
  useEffect(() => {
    const fetchCompanyByUserId = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${COMPANY_API_END_POINT}/company-by-userid`,
          { userId: userId },
          { withCredentials: true }
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

    if (userId) fetchCompanyByUserId();
  }, [userId, dispatch]);

  // Fetch recruiters and job plan if company exists
  useEffect(() => {
    if (company) {
      if (
        user?.isActive &&
        user?.isCompanyCreated &&
        recruiters?.length === 0
      ) {
        dispatch(fetchRecruiters(companyId));
      }
      // Always fetch latest job plan
      dispatch(fetchCurrentPlan(companyId));
    }
  }, [company, companyId, user?.isActive, user?.isCompanyCreated, recruiters?.length, dispatch]);

  // Socket.IO for Real-time Plan Expiration Updates
  useEffect(() => {
    if (!userId || !BACKEND_URL) return;

    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("planExpired", async ({ companyId: incomingId }) => {
      if (incomingId === companyId) {
        try {
          const response = await axios.post(
            `${COMPANY_API_END_POINT}/company-by-userid`,
            { userId: userId },
            { withCredentials: true }
          );
          if (response?.data.success) {
            dispatch(addCompany(response?.data.company));
          }
          dispatch(fetchCurrentPlan(companyId));
        } catch (err) {
          console.error("Error refreshing company data:", err);
        }
      }
    });

    // Real-time Job Credits updates (triggered when admin edits credits)
    socket.on("companyCreditsUpdated", async ({ companyId: incomingId }) => {
      if (incomingId === companyId) {
        try {
          const response = await axios.post(
            `${COMPANY_API_END_POINT}/company-by-userid`,
            { userId: userId },
            { withCredentials: true }
          );
          if (response?.data.success) {
            dispatch(addCompany(response?.data.company));
          }
        } catch (err) {
          console.error("Error refreshing company data after credits update:", err);
        }
      }
    });

    return () => {
      socket.off("planExpired");
      socket.off("companyCreditsUpdated");
      socket.disconnect();
    };
  }, [userId, companyId, dispatch]);

  const isCompanyCreated = !!user?.isCompanyCreated;
  const hasCompany = isCompanyCreated || !!company;

  // Show loading spinner while fetching company data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Recruiter&apos;s Dashboard | GreatHire Jobs, Applicants, & Hiring Analytics
        </title>
        <meta
          name="description"
          content="The recruiter dashboard provided by GreatHire enables organizations to conduct recruitment with confidence and agility."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        {/* Navbar — always visible */}
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Sidebar — only after company is fetched/created */}
          {hasCompany && <DashboardNavigations />}

          <div className={`flex-1 bg-gray-100 dark:bg-gray-900 overflow-y-auto ${
            hasCompany ? "lg:ml-52" : ""
          }`}>
             
            <ErrorBoundary fallback={<div className="p-6 text-red-500">Something went wrong loading this page. Please refresh.</div>}>
              <Outlet />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard;