import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRecruiterRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "recruiter") {
        navigate("/page/not/found");
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (isChecking) return null;

  return <>{children}</>;
};

export default ProtectedRecruiterRoute;
