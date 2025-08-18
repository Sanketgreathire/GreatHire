

// import React, { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../shared/Navbar"; // apne folder structure ke hisaab se path sahi karo
// import Footer from "../../shared/Footer"; // yahan bhi path sahi karo

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [user, setUserState] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSignUpClick = () => {
//     navigate("/signup-choice");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (
//         formData.email === "test@example.com" &&
//         formData.password === "password123"
//       ) {
//         const mockUser = { role: "student", name: "Test User" };
//         setUserState(mockUser);
//         toast.success("Login successful!");
//       } else if (
//         formData.email === "recruiter@example.com" &&
//         formData.password === "password123"
//       ) {
//         const mockUser = { role: "recruiter", name: "Test Recruiter" };
//         setUserState(mockUser);
//         toast.success("Login successful!");
//       } else {
//         toast.error("Invalid email or password. Please try again.");
//       }
//     } catch (err) {
//       console.error(`Error in login: ${err}`);
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gradient-to-b from-white to-blue-300 my-10">
//         <h1 className="text-4xl font-bold text-gray-800 text-center">
//           Great<span className="text-blue-600">Hire</span>
//         </h1>
//         <h2 className="text-2xl font-semibold mt-2 text-center">User Login</h2>
//         <p className="text-sm text-gray-500 mt-1 text-center">
//           Find the job made for you!
//         </p>
//         <p className="mt-4 text-sm text-blue-600 text-center">
//           Don't have an account?{" "}
//           <span
//             onClick={handleSignUpClick}
//             className="cursor-pointer underline font-semibold"
//           >
//             Sign Up
//           </span>
//         </p>

//         <form
//           className="space-y-4 mt-6 w-full max-w-md"
//           onSubmit={handleSubmit}
//         >
//           {/* Email Input */}
//           <div>
//             <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               name="email"
//               placeholder="mail@domain.com"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
//               required
//             />
//           </div>

//           {/* Password Input */}
//           <div>
//             <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
//               required
//             />
//           </div>

//           <p className="text-blue-600 text-sm cursor-pointer hover:underline text-right">
//             Forgot Password?
//           </p>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className={`w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
//               loading ? "cursor-not-allowed bg-blue-400" : ""
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Login;



















import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUserState] = useState(null);

  // OTP ke liye naye states
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      setOtp(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup-choice");
  };

  // Pehle OTP send karne ka function
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/send-login-otp`, // 👈 is endpoint ko backend me banana hoga
        { email: formData.email },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        setShowOtpInput(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(`Error in sending OTP: ${err}`);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // OTP verify + login karne ka function
  const handleVerifyOtpAndLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/login`, // 👈 backend pe login endpoint ko OTP handle karna hoga
        { ...formData, otp },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));
        navigate("/profile");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(`Error in login: ${err}`);
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gradient-to-b from-white to-blue-300 my-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Great<span className="text-blue-600">Hire</span>
        </h1>
        <h2 className="text-2xl font-semibold mt-2 text-center">User Login</h2>
        <p className="text-sm text-gray-500 mt-1 text-center">
          Find the job made for you!
        </p>
        <p className="mt-4 text-sm text-blue-600 text-center">
          Don't have an account?{" "}
          <span
            onClick={handleSignUpClick}
            className="cursor-pointer underline font-semibold"
          >
            Sign Up
          </span>
        </p>

        <form
          className="space-y-4 mt-6 w-full max-w-md"
          onSubmit={showOtpInput ? handleVerifyOtpAndLogin : handleSendOtp}
        >
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="mail@domain.com"
              value={formData.email}
              onChange={handleChange}
              disabled={showOtpInput} // OTP screen par disable
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={showOtpInput} // OTP screen par disable
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              required
            />
          </div>

          {/* OTP Input (conditionally show) */}
          {showOtpInput && (
            <div>
              <label
                htmlFor="otp"
                className="block text-gray-700 font-semibold mb-1"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                name="otp"
                placeholder="6-digit OTP"
                value={otp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                required
              />
            </div>
          )}

          <p className="text-blue-600 text-sm cursor-pointer hover:underline text-right">
            Forgot Password?
          </p>

          {/* Button */}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
              loading ? "cursor-not-allowed bg-blue-400" : ""
            }`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : showOtpInput
              ? "Verify & Login"
              : "Send OTP & Continue"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;

