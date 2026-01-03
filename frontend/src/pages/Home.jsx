import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BeforeLogin from "../components/auth/user/beforelogin";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ First check if user exists
    if (!user) return;

    // ✅ Then check role
    if (user.role === "student" || user.role === "candidate") {
      navigate("/jobs", { replace: true });
    }
  }, [user, navigate]);

  // 🟦 If user is NOT logged in → Show BeforeLogin
  if (!user) {
    return <BeforeLogin />;
  }

  // 🟦 Logged in users will be redirected by useEffect
  return null;
};

export default Home;