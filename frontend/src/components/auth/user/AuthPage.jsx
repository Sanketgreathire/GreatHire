
import React from "react";
import Login from "./Login.jsx";
import JobSeekerSignup from "./Signup.jsx";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <Login />;
  }

  if (location.pathname === "/signup") {
    return <JobSeekerSignup />;
  }

  return <div>Invalid Auth Page</div>;
};

export default AuthPage;
