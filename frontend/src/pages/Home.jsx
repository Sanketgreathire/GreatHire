// Import necessary modules and dependencies
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import Before Login page
import BeforeLogin from "../components/auth/user/beforelogin";

// Import Redux for accessing user
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // If user is logged in, redirect to /jobs
  useEffect(() => {
    if (
      (user.role === "student" || user.role === "candidate") && user.role !== "recruiter")
      {
        navigate("/jobs", { replace: true });
      }
    }, [user, navigate]);

  // 🟦 If user is NOT logged in → Show Before Login Page
  if (!user) {
    return <BeforeLogin />;
  }

  // This will briefly show before redirect
  return null;
};

export default Home;
