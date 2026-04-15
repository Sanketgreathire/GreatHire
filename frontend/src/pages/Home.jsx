import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BeforeLogin from "../components/auth/user/beforelogin";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.role === "student" || user.role === "candidate") {
      navigate("/jobs", { replace: true });
    } else if (user.role === "recruiter") {
      navigate("/recruiter/dashboard/home", { replace: true });
    } else if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <BeforeLogin />;
  }

  return null;
};

export default Home;