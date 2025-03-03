// Importing React and necessary hooks for state management and side effects
import React, { useState } from "react";
import ApplyForm from "./ApplyForm";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { useParams } from "react-router-dom";

const MainApply = () => {
  // Extracts jobId from the URL parameters using React Router's useParams hook
  const jobId = useParams();

  // State to manage whether a certain condition (right) is true or false
  const [right, setRight] = useState(true);

  return (
    <div>
      {/* Navbar component for navigation */}
      <Navbar />

      {/* Container with gradient background, shadow, and rounded corners */}
      <div className="flex shadow-lg rounded-lg bg-gradient-to-r from-blue-100 via-gray-100 to-blue-100 w-full justify-center">
        {/* ApplyForm component, taking jobId and a state setter as props */}
        <div className="my-2 w-1/2">
          <ApplyForm setRight={setRight} jobId={jobId} />
        </div>
      </div>

      {/* Footer component for page footer */}
      <Footer />
    </div>
  );
};

export default MainApply;
