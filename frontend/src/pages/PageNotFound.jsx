// Import necessary modules
// Import React library
import React from 'react'; 

// Import Link component for navigation
import { Link } from 'react-router-dom'; 

// PageNotFound Component - Displays a 404 error page when a user visits an invalid route
const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Display 404 error message */}
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl text-gray-700 mt-4">
        Oops! The page you are looking for does not exist.
      </p>

      {/* Button to navigate back to the homepage */}
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all duration-200"
      >
        Go Back Home
      </Link>
    </div>
  );
};

// Export the component for use in other parts of the application
export default PageNotFound; 
