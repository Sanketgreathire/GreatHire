// Import React library
import React from 'react'; 
import { useSelector } from "react-redux"; // Import useSelector to get user data from Redux
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// Import Link component for navigation
import { Link } from 'react-router-dom'; 

// PageNotFound Component - Displays a 404 error page when a user visits an invalid route
const PageNotFound = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const { user } = useSelector((state) => state.auth); // Get user from Redux state

  // Function to navigate based on user's role
  const handleGoBack = () => {
    if (user?.role === "recruiter") {
      navigate("/recruiter/dashboard"); // Recruiter goes to recruiter dashboard
    } else {
      navigate("/"); // Other users go to homepage
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Display 404 error message */}
      {/* <h1 className="text-6xl font-bold text-red-500">404</h1> */}
      <p className="text-xl text-gray-900 mt-4 text-center">
        Oops! The page you are looking for does not exist.
      </p>

      {/* Button to navigate back to the homepage */}
      <button
        onClick={handleGoBack}
        className="mt-6 px-6 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-all duration-200"
      >
        Go Back Home
      </button>
    </div>
  );
};

// Export the component for use in other parts of the application
export default PageNotFound; 
