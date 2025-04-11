// Import necessary modules and dependencies
// Import React and hooks for state and side effects
import React, { useEffect, useState } from "react"; 

import JobsFeed from "@/components/JobsFeed";

// Import navigation bar component
import Navbar from "@/components/shared/Navbar"; 

// Import footer component
import Footer from "@/components/shared/Footer";

// Import Hero section component for the homepage
import HeroSection from "../components/HeroSection"; 

// Import component displaying the latest job listings
import LatestJobs from "./job/LatestJobs"; 

// Import useSelector hook for accessing Redux state
import { useSelector } from "react-redux"; 

// Import useNavigate hook for navigation
import { useNavigate } from "react-router-dom"; 

// Home component - Main landing page
const Home = () => {
  // State variables for search filters
  const [titleKeyword, setTitleKeyword] = useState(""); // State for storing job title keyword input
  const [location, setLocation] = useState(""); // State for storing job location input
  
  // Get the authenticated user details from Redux store
  const { user } = useSelector((state) => state.auth); 

  // Initialize navigation hook
  const navigate = useNavigate(); 

  // Effect to check user role and redirect if not a student
  useEffect(() => {
    if (user && user.role !== "student") navigate("/page/not/found");
  }, [user]);

  return (
    <>
      <Navbar /> {/* Display the navigation bar */}

      {/* Main content area with Hero section and latest job listings */}
      <div className="bg-white">
        <HeroSection
          searchInfo={{
            titleKeyword,
            setTitleKeyword,
            location,
            setLocation,
          }}
        />
        <LatestJobs /> {/* Display latest job postings */}
      </div>
             <section className="my-12 px-4 md:px-8">
                        <h2 className="text-2xl font-bold mb-6">Latest Jobs from Around the Web</h2>
            <JobsFeed />
            </section>
      <Footer /> {/* Display the footer */}
    </>
  );
};

export default Home; // Export the Home component
