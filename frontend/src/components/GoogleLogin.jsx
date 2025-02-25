import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setUser } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

const GoogleLogin = ({ text, role, route }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle Google login response
  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const response = await axios.post(
          `http://localhost:8000/api/v1/${route}/googleLogin`,
          { code: authResult.code, role },
          { withCredentials: true }
        );

        if (response.data.success) {
          handleSuccess(response.data);
        } else {
          toast.success(response.data.message);
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Handle successful login
  const handleSuccess = (data) => {
    toast.success(data.message);
    const { role: userRole, user } = data.user;
    dispatch(setUser(user));
    navigateBasedOnRole(userRole);
  };

  // Navigate based on user role
  const navigateBasedOnRole = (userRole) => {
    if (userRole.includes("student")) navigate("/");
    else if (userRole.includes("recruiter")) navigate("/recruiter/dashboard/home");
    else if (userRole.includes("admin")) navigate("/admin/dashboard");
  };

  // Handle login error
  const handleError = (err) => {
    console.error(`Error while Google authentication: ${err}`);
    toast.error("Google Login failed. Please try again.");
  };

  // Google Login configuration
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast("Error occurred during Google Login.", { type: "error" });
    },
    flow: "auth-code",
  });

  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={googleLogin}
    >
      <FcGoogle className="text-xl" />
      <span className="text-gray-600 font-medium">{text} with Google</span>
    </button>
  );
};

export default GoogleLogin;
