import React, { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BeforeLogin = lazy(() => import("../components/auth/user/beforelogin"));

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
    return (
      <Suspense fallback={null}>
        <BeforeLogin />
      </Suspense>
    );
  }

  return null;
};

export default Home;