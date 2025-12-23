// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";

// Import navigation bar component
import Navbar from "@/components/shared/Navbar";

// Import footer component
import Footer from "@/components/shared/Footer";

// Import Hero section component for the homepage
import HeroSection from "../components/HeroSection";

// Import Latest job listings
import LatestJobs from "./job/LatestJobs";

// Import Before Login and After Login pages
import BeforeLogin from "../components/auth/user/beforelogin";
import AfterLogin from "../components/auth/user/afterlogin";

// Import Redux for accessing user
import { useSelector } from "react-redux";

// Import Navigation
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [titleKeyword, setTitleKeyword] = useState("");
  const [location, setLocation] = useState("");

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // If user exists but is NOT a student → redirect to 404
  useEffect(() => {
    if (user && user.role !== "student") {
      navigate("/page/not/found");
    }
  }, [user]);

  // 🟦 Return Before Login Page if user is not logged in
  if (!user) {
    return (
      <>
        <BeforeLogin />
      </>
    );
  }

  // 🟩 After Login Page for student users
  return (
    <>
      <Navbar />

      <div className="p-12 bg-white dark:bg-gray-800">
        <HeroSection
          searchInfo={{
            titleKeyword,
            setTitleKeyword,
            location,
            setLocation,
          }}
        />

        {/* Centered Latest Jobs */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <LatestJobs />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
