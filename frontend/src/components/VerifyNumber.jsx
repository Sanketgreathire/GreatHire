import React, { useEffect, useState } from "react";
import { VERIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateNumberVerification } from "@/redux/authSlice";

const VerifyNumber = ({ setOpenNumberOTPModal }) => {
  const { user } = useSelector((state) => state.auth);
  const [token, setToken] = useState(null);
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Timer starts at 30 seconds
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Timer Logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval); // Clear the interval on unmount
    }
  }, [timer]);

  // // Request OTP only once on component mount
  useEffect(() => {
    if (user && !token && !user.emailId.isVerify) {
      requestOTP();
      setTimer(30);
    }else{
      navigate("/login");
    }
  }, [user]); // Dependency on user ensures this runs once when user data is available

  const requestOTP = async () => {
    setLoading(true); // Set loading to true
    setOTP(""); // set otp to empty
    try {
      const response = await axios.post(
        `${VERIFICATION_API_END_POINT}/request-otp-mob`,
        {
          number: user.phoneNumber.number,
        },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        // Show success message
        setToken(response.data.token);
        setTimer(30); // Reset the timer
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const verifyOTP = async () => {
    if (token && otp) {
      setLoading(true);
      try {
        // Verify the token
        let response = await axios.post(
          `${VERIFICATION_API_END_POINT}/verify-token`,
          { token }
        );

        if (response?.data?.success) {
          const decoded = response?.data?.decoded;

          // Now, verify the OTP
          response = await axios.post(
            `${VERIFICATION_API_END_POINT}/verify-otp`,
            {
              decodedOTP: decoded?.otp,
              otp,
            },
            { withCredentials: true }
          );

          if (response?.data?.success) {
            // OTP verified, proceed to update email status
            toast.success(response.data.message);

            response = await axios.post(
              `${VERIFICATION_API_END_POINT}/update-number-verification`,
              {
                email: user.emailId.email,
              },
              { withCredentials: true }
            );

            if (response?.data?.success) {
              toast.success(response.data.message);
              setToken(null);
              dispatch(updateNumberVerification(true));
              setOpenNumberOTPModal(false);
            } else {
              toast.error(response.data.message);
            }
          } else {
            toast.error(response.data.message);
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        console.log(`Error in verify OTP: ${err}`);
        toast.error("Error verifying OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-1/3 flex flex-col items-center justify-center p-6 space-y-3 animate-in fade-in duration-200">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6">
              Great<span className="text-blue-700">Hire</span>
            </h1>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-bold mb-2"
              >
                Check Your Number
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={verifyOTP}
              disabled={timer === 0 || !otp || loading || user.emailId.isVerify} // Disable button if no OTP or loading
              className={`w-full py-2 text-white font-semibold rounded-lg ${
                !otp || loading || timer === 0 || user.emailId.isVerify
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-700 hover:bg-blue-800"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {loading ? "Waiting..." : `Verify OTP (${timer}s)`}
            </button>
          </div>
          {timer === 0 && (
            <p
              className="flex  gap-2 text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={requestOTP}
            >
              <span>Resend OTP</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyNumber;
