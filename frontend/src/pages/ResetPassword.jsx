import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import img5 from "../assets/img5.png";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { VERIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import Loading from "@/components/Loading";
import PageNotFound from "./PageNotFound";

const ResetPassword = () => {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const { token } = useParams();
  const [decoded, setDecodeData] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `${VERIFICATION_API_END_POINT}/verify-token`,
          {
            token,
          }
        );
        if (response.data.success) {
          setDecodeData(response.data.decoded);
          setStatus("valid token");
        }
      } catch (err) {
        console.log(`error in token verification ${err}`);
        setStatus("page not found");
      }
    };
    if (token) verifyToken();
    else navigate("/");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/reset-password`,
        {
          decoded,
          newPassword: password,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(`Error in resetting password: ${err}`);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {status === "loading" && <Loading color="blue-600" />}
      {status === "page not found" && <PageNotFound />}
      {status === "valid token" && (
        <>
          <div className="flex flex-row md:flex-row-reverse  bg-gradient-to-tl from-white to-blue-100 items-center justify-evenly">
            {/* Left Side - Image */}
            <div className="w-full md:w-1/2 h-screen p-10">
              <img
                src={img5}
                alt=""
                className="w-full h-full object-cover opacity-70"
              />
            </div>

            {/* Right Side - Form */}
            <div className="w-full px-8 md:w-1/3  flex flex-col space-y-4">
              <h1 className="text-3xl font-bold text-center">
                Great<span className="text-blue-700">Hire</span>
              </h1>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Reset Password
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Enter your new password below to reset it.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (min length 8)"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPassword;
