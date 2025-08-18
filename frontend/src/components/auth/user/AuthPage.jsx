
// const Loading = ({ color = "white" }) => (
//   <div className="flex justify-center items-center">
//     <div
//       className={`animate-spin h-5 w-5 border-2 rounded-full border-t-${color}-500 border-r-${color}-500 border-b-${color}-500`}
//     ></div>
//   </div>
// );

// const MessageBox = ({ message, type, onClose }) => {
//   if (!message) return null;

//   const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
//   const title = type === 'success' ? 'Success' : 'Error';

//   return (
//     <div className="fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-xl z-50 transition-all duration-300 transform scale-100 ease-out animate-fade-in-down"
//          style={{ animation: 'fade-in-down 0.5s ease-out forwards' }}>
//       <div className={`p-4 rounded-lg text-white ${bgColor} flex items-center justify-between space-x-4`}>
//         <div className="flex items-center space-x-2">
//           {type === 'success' ? (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           )}
//           <div>
//             <h3 className="font-bold text-lg">{title}</h3>
//             <p className="text-sm">{message}</p>
//           </div>
//         </div>
//         <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main AuthPage component
// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [user, setUser] = useState(null);
//   const navigate = () => { /* Mock navigate function */ };
//   const [formData, setFormData] = useState({
//     fullname: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({
//     text: "",
//     type: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     setTimeout(() => {
//       if (isLogin) {
//         if (formData.email === "test@example.com" && formData.password === "password") {
//           setUser({ role: "student", fullname: "Test User" });
//           setMessage({ text: "Login successful!", type: "success" });
//         } else {
//           setMessage({ text: "Invalid credentials. Please try again.", type: "error" });
//         }
//       } else {
//         if (formData.email.includes("@")) {
//           setUser({ role: "recruiter", fullname: formData.fullname });
//           setMessage({ text: "Account created successfully!", type: "success" });
//         } else {
//           setMessage({ text: "An error occurred. Please try again.", type: "error" });
//         }
//       }

//       setFormData({
//         fullname: "",
//         email: "",
//         phoneNumber: "",
//         password: "",
//       });
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">
//       <Navbar />
//       <MessageBox message={message.text} type={message.type} onClose={() => setMessage({ text: "", type: "" })} />
//       <div className="flex flex-1 flex-col md:flex-row relative">
//         {/* Left Section - Form */}
//         <div className="w-full h-full flex flex-col items-center justify-between p-6 md:p-12 lg:p-20 xl:p-24 bg-gradient-to-l from-white to-blue-100">
//           <div className="w-full max-w-sm flex-1 flex flex-col overflow-auto">
//             <h1 className="text-3xl font-bold text-center">
//               Great<span className="text-blue-700">Hire</span>
//             </h1>
//             <h1 className="text-2xl md:text-3xl font-bold text-center mt-2">
//               {isLogin ? "Login" : "Create Account"}
//             </h1>
//             <p className="text-sm md:text-md font-semibold text-gray-500 text-center mt-2">
//               {isLogin ? "Find the job made for you!" : "Where the best company find their teams"}
//             </p>

//             <div className="mt-4">
//               <GoogleLogin text={isLogin ? "Login" : "Sign up"} />
//             </div>

//             <p className="text-sm font-semibold text-gray-400 text-center my-4">
//               ---- or {isLogin ? "Login" : "Sign up"} with email ----
//             </p>

//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <div className="flex flex-col space-y-4">
//                 {!isLogin && (
//                   <>
//                     <label className="font-bold">Full Name</label>
//                     <input
//                       type="text"
//                       name="fullname"
//                       placeholder="Full Name"
//                       value={formData.fullname}
//                       onChange={handleChange}
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                       required
//                     />
//                   </>
//                 )}
//                 <label className="font-bold">{isLogin ? "Email" : "Work Email"}</label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="mail@domain.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-400"
//                   required
//                 />
//                 {!isLogin && (
//                   <>
//                     <label className="font-bold">Mobile Number</label>
//                     <input
//                       type="text"
//                       name="phoneNumber"
//                       placeholder="Contact number"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                       required
//                     />
//                   </>
//                 )}
//                 <label className="font-bold">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder={isLogin ? "Password" : "min 8 characters"}
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                       required
//                     />
//                     {isLogin && (
//                       <div className="flex flex-row-reverse">
//                         <p
//                           className="text-blue-600 text-sm cursor-pointer"
//                           onClick={() => {}} // Mock navigation
//                         >
//                           Forgot Password
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                   <button
//                     type="submit"
//                     className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
//                       loading ? "cursor-not-allowed" : ""
//                     }`}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <Loading color="white" />
//                     ) : (
//                       isLogin ? "Login" : "Create Account"
//                     )}
//                   </button>
//                 </form>
//               </div>
//               <p className="text-center text-sm text-gray-500 mt-4">
//                 {isLogin ? "Don't have an account?" : "Already have an account?"}
//                 <span
//                   className="text-blue-500 hover:underline cursor-pointer ml-1"
//                   onClick={() => setIsLogin(!isLogin)}
//                 >
//                   {isLogin ? "Sign Up" : "Log In"}
//                 </span>
//               </p>
//             </div>
    
//             {/* Right Section - Background Image / Video and Content */}
//             <div className="relative w-full hidden md:flex">
//               {isLogin ? (
//                 <>
//                   <img
//                     src="https://placehold.co/1000x800/dbeafe/1f2937?text=Login+Background"
//                     alt="Background"
//                     className="absolute inset-0 w-full h-full object-cover lg:object-fill opacity-90"
//                   />
//                   <div className="absolute inset-0 mb-20 flex flex-col items-center justify-center text-center space-y-2 p-4 z-10">
//                     <h1 className="font-bold text-3xl md:text-4xl text-gray-800">
//                       Find the job made for you.
//                     </h1>
//                     <p className="font-medium text-gray-900 text-sm md:text-lg max-w-[90%] md:max-w-[70%]">
//                       Browse over 150K jobs at top companies.
//                     </p>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="absolute inset-0 flex flex-col items-center text-center space-y-4 justify-center px-4">
//                     <div className="mt-20 text-gray-900">
//                       <h2 className="text-4xl font-bold mb-2">Follow These <span className="text-blue-600">Simple Steps :</span></h2>
//                       <ul className="text-lg md:text-lg font-semibold text-gray-900 space-y-2">
//                         {["Create An Account", "Create Your Company", "Post Jobs"].map((step, index) => (
//                           <li key={index} className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-lg">
//                             <span className="text-blue-600 font-semibold text-lg">
//                               {index + 1}.
//                             </span>
//                             {step}
//                           </li>
//                         ))}
//                       </ul>
//                       <div className="mt-4 rounded-lg shadow-lg w-full max-w-md mx-auto h-64 bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
//                         Video Placeholder
//                       </div>
//                     </div>
//                     <div className=" flex flex-col items-center text-center space-y-2 px-5">
//                       <h1 className="font-semibold text-xl md:text-2xl text-gray-900">
//                         Powerful recruiting tools to find your{" "}
//                         <span className="text-gray-800">Perfect Team!</span>
//                       </h1>
//                       {[
//                         "Post your job and source candidates.",
//                         "Save time with intelligent applicant sorting.",
//                         "Free built-in ATS to manage your pipeline.",
//                         "Industry high 40% candidate response rate.",
//                       ].map((text, index) => (
//                         <p key={index} className="flex items-center gap-2 font-semibold text-sm md:text-lg text-gray-800 ">
//                           ✔ {text}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//           <Footer />
//         </div>
//       );
//     };
    
//     export default AuthPage;







// import React, { useState } from "react";
// import Navbar from "../shared/Navbar";
// import Footer from "../shared/Footer";
// import Login from "./Login";
// import SignupPage from "../shared/SignupPage"; // ✅ Corrected path

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);

//   const toggleForm = () => {
//     setIsLogin((prev) => !prev);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-b from-white to-blue-300 flex items-center justify-center p-10">
//         <div className="w-full max-w-md my-8">
//           {isLogin ? (
//             <Login toggleForm={toggleForm} />
//           ) : (
//             <SignupPage toggleForm={toggleForm} />
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default AuthPage;



// import React from "react";
// import Login from "./user/Login.jsx"; // sahi path check karo
// import JobSeekerSignup from "./Signup.jsx"; // extension add karo
// import { useLocation } from "react-router-dom";

// const AuthPage = () => {
//   const location = useLocation();

//   // Agar path /login hai to login page dikhao
//   if (location.pathname === "/login") {
//     return <Login />;
//   }

//   // Agar path /signup hai to signup page dikhao
//   if (location.pathname === "/signup") {
//     return <JobSeekerSignup />;
//   }

//   return <div>Invalid Auth Page</div>;
// };

// export default AuthPage;



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
