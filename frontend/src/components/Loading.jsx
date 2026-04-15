import React from "react";

const Loading = ({color}) => {
  return (
    <>
      {/* Container with 5 bouncing divs */}
      <div className="flex  item-center justify-center space-x-2 text-md text-gray-800 font-light">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 bg-${color} rounded-full animate-wave-bounce`}
            style={{ animationDelay: `${index * 0.2}s` }} // Staggered animation delay
          ></div>
        ))}
        
      </div>
    </>
  );
};

export default Loading;
