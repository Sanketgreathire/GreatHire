import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const clientReviews = [
  {
    text: "As a fast-growing startup, we needed to find candidates quickly, and Great Hire delivered. The talent pool is extensive, and the platform’s sorting tools allowed us to quickly narrow down our search to candidates who matched our needs. I can confidently say that Great Hire is an essential for our recruiting strategy.",
    name: "Anirban Barman",
    author: "Assistant Manager",
  },
  {
    text: "As a business owner, I have been using Great Hire for the past year to find top-tier talent for our team. The platform’s user-friendly ui and wide range of highly skilled candidates have made it a fantastic resource. The hiring process has been smooth, and able to connect with candidates.",
    name: "Ahmed Shakeel",
    author: "Business Owner",
  },
  {
    text: "I’ve worked with numerous job platforms, but Great Hire stands out because of its ability to match us with candidates who not only have the technical skills we need but also fit our company culture. We've hired a number of employees through Great Hire, and each has brought something unique to the table.",
    name: "Raghav Naidu",
    author: "Hiring Manager",
  },
  {
    text: "Finding the right candidates used to be a challenge, but Great Hire has made it effortless. The platform connects us with top talent that perfectly fits our company’s needs. Highly recommend for any recruiter!",
    name: "Karan Jaiswal",
    author: "Talent Acquisition Manager",
  },
];

const candidateReviews = [
  {
    text: "Great Hire made my job search effortless. The platform matched me with roles that fit my skills perfectly. Within weeks, I landed a data analyst position at a fantastic company. The process was smooth, and the support was excellent. Highly recommend Great Hire to anyone looking for the right opportunity.",
    name: "Rohan Das",
    author: "Data Analyst",
  },
  {
    text: "As a job seeker, my experience with Great Hire has been fantastic. The platform made it so easy to search for opportunities that aligned with my skills and career goals. I received personalized recommendations, and within a few weeks, I found a position that was a perfect fit.",
    name: "Anshul Gupta",
    author: "Software Developer",
  },
  {
    text: "I’ve used several job portals in the past, but Great Hire really stood out. The platform is incredibly user-friendly, and I was able to filter my job search by location, salary, and job type, making it easy to narrow down opportunities. The quality of the job listings was impressive.",
    name: "Sourav Dubey",
    author: "Marketing Specialist",
  },
  {
    text: "Great Hire helped me find the perfect DevOps Engineer role quickly. The platform’s job recommendations were spot on, and the application process was seamless. I’m now working at a great company, thanks to Great Hire!",
    name: "Vikram Roy",
    author: "DevOps Engineer",
  },
];

const ReviewsCarousel = ({ reviews, title }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="mt-10 px-4">
      <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">{title}</h3>

      {/* Wrapper to prevent page-level horizontal scrolling */}
      <div 
        className="relative max-w-7xl mx-auto overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Fading Gradient Effect */}
        <div className="absolute top-0 left-0 w-5 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-5 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        {/* Disable animation on small screens, allow scrolling inside */}
        <div className={`w-full flex gap-6 flex-nowrap overflow-x-auto lg:w-max lg:animate-scroll-infinite scrollbar-hide ${isPaused ? "paused" : ""}`}>
          {[...reviews, ...reviews].map((review, idx) => (
            <div
              key={idx}
              className="relative w-[90%] max-w-[450px] h-[250px] flex-shrink-0 bg-gray-100 p-6 shadow-xl rounded-2xl flex flex-col mx-auto md:mx-0"
            >
              {/* Large Double Quotes on the Left */}
              <span className="text-9xl text-gray-300 absolute top-2 left-2 font-serif opacity-50">“</span>

              {/* Name & Author in Top Right */}
              <div className="text-right mb-5">
              <p className="text-gray-900 font-semibold">{review.name}</p>
              <p className="text-gray-500 text-sm">{review.author}</p>
              </div>
              <p className="text-gray-800 mt-4 text-sm break-words whitespace-normal line-clamp-5 text-justify">
                {review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ReviewsSection() {
  return (
    <div className="py-12 overflow-x-hidden w-full"> {/* Prevent page horizontal scrolling */}
      <div className="max-w-6xl mx-auto px-4">
        <ReviewsCarousel reviews={clientReviews} title={<span className="text-blue-800 text-xl font-semibold">Our Client & Recruiter Reviews</span>}
        />
        <ReviewsCarousel reviews={candidateReviews} title={<span className="text-blue-800 text-xl font-semibold">Our Candidate & Employee Reviews</span>}
        />
      </div>
    </div>
  );
}