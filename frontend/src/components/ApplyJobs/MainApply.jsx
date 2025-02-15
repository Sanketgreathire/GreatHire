import React, { useState } from "react";
import ApplyForm from "./ApplyForm";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { useParams } from "react-router-dom";

const MainApply = () => {
  const jobId = useParams();
  const [right, setRight] = useState(true);

  return (
    <div>
      <Navbar />
      <div className="flex shadow-lg rounded-lg  bg-gradient-to-r from-blue-100 via-gray-100 to-blue-100 w-full justify-center">
        
        <div className="my-2 w-1/2">
        <ApplyForm setRight={setRight} jobId={jobId} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainApply;
