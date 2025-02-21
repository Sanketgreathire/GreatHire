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
import { fetchCurrentPlan, removeJobPlan } from "@/redux/jobPlanSlice";
import { io } from "socket.io-client";
import { BACKEND_URL } from "@/utils/ApiEndPoint";

const socket = io(BACKEND_URL, { transports: ["websocket"] }); // Use your backend URL

const RecruiterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const { recruiters } = useSelector((state) => state.recruiters);
  const { jobPlan } = useSelector((state) => state.jobPlan);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyByUserId = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${COMPANY_API_END_POINT}/company-by-userid`,
          { userId: user?._id },
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

    fetchCompanyByUserId();
  }, [user]);

  useEffect(() => {
    if (company) {
      if (
        user?.isActive &&
        user?.isCompanyCreated &&
        recruiters?.length === 0
      ) {
        dispatch(fetchRecruiters(company?._id));
      }
      if (!jobPlan) {
        dispatch(fetchCurrentPlan(company?._id));
      }
    }
  }, [company, user, recruiters, jobPlan, dispatch]);

  // 🔹 Socket.IO for Real-time Plan Expiration Updates
  useEffect(() => {
    socket.on("planExpired", ({ companyId, type }) => {
      if (company && companyId === company?._id) {
        if (type === "job") {
          dispatch(updateMaxPostJobs(0));
          dispatch(removeJobPlan());
        } else if (type === "candidate") {
          dispatch(updateCandidateCredits(0));
        }
      }
    });

    return () => {
      socket.off("planExpired");
    };
  }, [company, dispatch]);

  return (
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
  );
};

export default RecruiterDashboard;
