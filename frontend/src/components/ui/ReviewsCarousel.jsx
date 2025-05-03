import { useState, useEffect, useRef } from "react";

const ReviewsCarousel = ({ reviews, title, speed = 100 }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Total scrollable width (with duplicated reviews)
    const totalWidth = containerRef.current.scrollWidth;
    const singlePass = totalWidth / 2; // We duplicate reviews, so divide by 2
    const calculatedDuration = singlePass / speed; // Duration to maintain the constant speed
    setDuration(calculatedDuration); // Set duration dynamically
  }, [reviews, speed]);

  return (
    <div
      className="py-8 relative max-w-full mx-auto overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
        {title}
      </h2>

      {/* Left/Right fading overlays */}
      <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className={`carousel ${isPaused ? "paused" : ""}`}
        style={{
          animationDuration: `${duration}s`,
          width: "100%", // Ensure the container spans full width
        }}
      >
        {[...reviews, ...reviews].map((r, i) => (
          <div
            key={i}
            className="relative w-[90%] max-w-[450px] h-[250px] flex-shrink-0 bg-gray-100 p-6 shadow-xl rounded-2xl flex flex-col mx-auto md:mx-0"
          >
            <span className="text-9xl text-gray-300 absolute top-2 left-2 font-serif opacity-50">“</span>
            <div className="text-right mb-5">
              <p className="text-gray-900 font-semibold">{r.name}</p>
              <p className="text-gray-500 text-sm">{r.author}</p>
            </div>
            <p className="text-gray-800 mt-4 text-sm break-words whitespace-normal line-clamp-5 text-justify">
              {r.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ReviewsSection() {
  const clientReviews = [
    {
      text: "We sincerely thank Great Hire Company for providing our learners with valuable internship opportunities that have significantly contributed to their skill development and career growth. Your support plays a vital role in shaping the future of aspiring professionals from ITVEDANT Institute.",
      name: "Kamini ",
      author: "HR and corporate relations executive",
    },
    {
      text: "Great Hire has consistently delivered top-tier candidates who align with both our job requirements and our values. Their attention to understanding our team dynamics makes all the difference  'Raviraj pvt limited'. ",
      name: "Raviraj ",
      author: "Manager",
    },
    {
      text: "We've partnered with several recruiting services in the past, but none have matched the personalized approach of Great Hire. Their candidates are not only qualified but also passionate and eager to contribute.",
      name: "Srinivas",
      author: "Director of Operations",
    },
    {
      text: "Great Hire doesn’t just send resumes—they send the right people. Every candidate they’ve placed with us came prepared and passionate, ready to support our busy agents from day one.",
      name: " ",
      author: "Hiring Manager",
    },
    {
      text: "Real estate is about relationships, and Great Hire understands that. They found us a listing assistant who blends perfectly with our team and impresses clients consistently lead agent. ",
      name: "Tabassum",
      author: "Lead Agent",
    },
    {
      text: "We had trouble finding talent who could keep up with the demands of a high-volume brokerage. Great Hire delivered professionals who not only kept pace but helped us grow.",
      name: " ",
      author: "Sales Managers",
    },
  
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
      text: "I am deeply grateful to Sonika Babde, Sanket Babde, and Ch Tanmai for their invaluable mentorship and support throughout my journey. As I transition to the next chapter in my career, I am confident in my ability to make a meaningful impact. ",
      name: "R Krishnaveni",
      author: "Human Resource",
    },
  
    {
      text: "I’m grateful for the incredible journey at Great Hire, where I received invaluable mentorship and support. Special thanks to Ch Tanmai Ma for her guidance, Sanket Babde Sir for fostering growth, and Sonika Babde Ma for her expertise in talent acquisition. This experience has been phenomenal.",
      name: "Meer Ahmadi",
      author: "Human Resource",
    },
    {
      text: "I'm deeply grateful to Ch Tanmai Ma’am for her support and guidance, which made learning enjoyable. Special thanks to Sanket Babde Sir for fostering a growth-oriented environment and motivating me at every step. I'm also thankful to Sonika Babde Ma’am for her mentorship in talent acquisition. ",
      name: "Lahari",
      author: "Human Resource",
    },
    {
      text: "I am deeply grateful for the guidance and mentorship I received during my journey at GreatHire. Special thanks to Sanket Babde for his leadership, Sonika Babde for her unwavering support, and Ch Tanmai for making the experience smooth and enriching. This internship has been a rewarding experience.",
      name: "Nabhay Singh",
      author: "Business Development",
    },
    {
      text: "I would like to express my deepest gratitude to Sonika Babde, Director of Great Hire, and Sanket Babde, Founder & Director of Great Hire, for their invaluable guidance and support. A special thank you to Ch Tanmai for her exceptional mentorship and motivation throughout my internship.",
      name: "Sai Deepak",
      author: "Human Resource",
    },
    {
      text: "I would like to extend my sincere gratitude to Sonika Babde, Director of Great Hire, and Sanket Babde, Founder & Director of Great Hire, for their exceptional guidance and support throughout my internship. I deeply appreciative of the invaluable mentorship provided by Ch Tanmai during this period.",
      name: "K Navaneeth",
      author: "Human Resource",
    },
  
  
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
  
  return (
    <div className="overflow-x-hidden w-full">
      <ReviewsCarousel
        reviews={clientReviews}
        title={<span className="text-blue-800 text-4xl font-[oswald] font-bold">Our Client Reviews</span>}
        speed={120}
      />
      <ReviewsCarousel
        reviews={candidateReviews}
        title={<span className="text-blue-800 text-4xl font-[oswald] font-bold">Our Employee Reviews</span>}
        speed={120}
      />
    </div>
  );
}
