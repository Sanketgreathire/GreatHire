// src/components/HeroSection.jsx
import React, { useState } from "react";
import JobSearch from "@/pages/job/JobSearch";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/authSlice"; // Corrected import
import { useNavigate } from "react-router-dom";

const HeroSection = ({ searchInfo }) => {
  const [query, setQuery] = useState(""); // Declare query state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query)); // Dispatch setSearchedQuery with the query
    navigate("/browse");
  };

  return (
    <div className="py-3 text-center px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#0233f8] font-medium animate-bounce ">
          No. 1 Job Hunt Website
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-[#384ac2]">Dream Jobs</span>
        </h1>

        <JobSearch searchInfo={searchInfo} />
      </div>
    </div>
  );
};

export default HeroSection;
