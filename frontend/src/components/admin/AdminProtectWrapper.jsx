import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/admin/login");
  }, []);

  return <>{children}</>;
};

export default AdminProtectWrapper;
