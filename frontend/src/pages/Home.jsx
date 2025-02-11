import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "../components/HeroSection";
//import CategoryCarousel from './CategoryCarousel';
import LatestJobs from "./job/LatestJobs";

const Home = () => {
  const [titleKeyword, setTitleKeyword] = useState("");
  const [location, setLocation] = useState("");

  return (
    <>
      <Navbar />
      <div className="bg-white">
        <HeroSection
          searchInfo={{
            titleKeyword,
            setTitleKeyword,
            location,
            setLocation,
          }}
        />
        {/* <CategoryCarousel/> */}
        <LatestJobs />
      </div>
      <Footer />
    </>
  );
};

export default Home;
