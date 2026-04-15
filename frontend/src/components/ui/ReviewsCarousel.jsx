import { useState, useEffect, useRef } from "react";
import { BadgeCheck } from "lucide-react";

const ReviewsCarousel = ({ reviews, title, subtitle, pixelsPerSecond = 50 }) => {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  if (reviews.length === 0) return null;

  // Triple the reviews to ensure smooth infinite scroll
  const tripleReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="py-10 relative w-full overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, gray 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center relative z-10">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30 dark:border-blue-500/40 transition-colors duration-300">
            Testimonials
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-blue-600 dark:text-blue-400 mb-4 tracking-tight transition-colors duration-300">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto transition-colors duration-300">{subtitle}</p>
      </div>

      <style>{`
        @keyframes smoothScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .carousel-track {
          animation: smoothScroll linear infinite;
          animation-duration: ${(reviews.length * 8)}s;
        }

        .carousel-track.paused {
          animation-play-state: paused;
        }

        .review-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 24px;
        }

        .review-card:hover {
          transform: translateY(-8px) scale(1.01);
        }

        .review-card:hover .quote-icon {
          animation: float 2s ease-in-out infinite;
        }

        .review-card:hover .star-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .quote-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          transition: all 0.3s ease;
        }

        .star-icon {
          transition: all 0.3s ease;
        }
      `}</style>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className={`carousel-track flex gap-6 ${isPaused ? "paused" : ""}`}
          style={{ width: 'fit-content' }}
        >
          {tripleReviews.map((review, index) => (
            <div
              key={`review-${index}`}
              className="review-card w-[400px] flex-shrink-0 p-8 transition-all duration-300 relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl dark:hover:shadow-blue-500/20"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/30 dark:via-transparent dark:to-purple-950/30 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Quote icon */}
                <div className="quote-icon w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 dark:text-yellow-300 star-icon transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-900 dark:text-gray-100 text-base leading-relaxed mb-8 min-h-[120px] transition-colors duration-300">
                  "{review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg transition-colors duration-300">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-bold text-base transition-colors duration-300">{review.name}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{review.author}</p>
                    {/* Badge */}
                    <div className="mt-1">
                      {review.type === "CLIENT" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <BadgeCheck className="w-3 h-3" />
                          Trusted Recruiter
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <BadgeCheck className="w-3 h-3" />
                          Successfully Placed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="text-center mt-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-300 dark:border-gray-600 transition-colors duration-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Paused - Move mouse away to resume
          </span>
        </div>
      )}
    </div>
  );
};

export default function ReviewsSection() {
  const clientReviews = [
     {
    text: "Great Hire has been an exceptional recruitment partner for our organization, consistently delivering candidates who not only meet our technical requirements but also align perfectly with our organizational culture and long-term vision.",
    name: "Pallavi Deshpande",
    author: "Head of Human Resources",
    type: "CLIENT",
  },
  {
    text: "We truly appreciate Great Hire's structured and professional hiring approach, as their team took the time to understand our needs and provided us with high-quality candidates who were ready to contribute from day one.",
    name: "Amit Verma",
    author: "Operations Manager",
    type: "CLIENT",
  },
  {
    text: "Partnering with Great Hire has significantly streamlined our hiring process, enabling us to fill critical positions faster while maintaining the quality and reliability of the candidates we onboard.",
    name: "Sandeep Kulkarni",
    author: "Senior Hiring Manager",
    type: "CLIENT",
  },
  {
    text: "Great Hire stands out for their personalized recruitment support, ensuring that every candidate presented to us was carefully screened and well-suited for both the role and our company culture.",
    name: "Neha Kapoor",
    author: "Talent Acquisition Lead",
    type: "CLIENT",
  },
  {
    text: "As a growing organization, we needed a recruitment partner who could scale with us, and Great Hire delivered consistently by providing dependable talent across multiple departments.",
    name: "Rohit Malhotra",
    author: "Business Operations Head",
    type: "CLIENT",
  },
  {
    text: "Great Hire's ability to understand our hiring challenges and deliver timely solutions has made them a trusted partner in our recruitment strategy.",
    name: "Swati Iyer",
    author: "HR Manager",
    type: "CLIENT",
  },
  {
    text: "We were impressed by the professionalism and responsiveness of the Great Hire team, as well as the quality of candidates who demonstrated strong skills and a positive attitude.",
    name: "Kunal Mehta",
    author: "Department Manager",
    type: "CLIENT",
  },
  {
    text: "Great Hire has helped us reduce our hiring turnaround time significantly while ensuring that we onboard candidates who are motivated, capable, and aligned with our business goals.",
    name: "Anjali Nair",
    author: "People & Culture Manager",
    type: "CLIENT",
  },
  {
    text: "The recruitment support provided by Great Hire has been outstanding, as they consistently supply candidates who are well-prepared, confident, and ready to add immediate value to our team.",
    name: "Suresh Rao",
    author: "General Manager",
    type: "CLIENT",
  },
  {
    text: "Working with Great Hire has transformed our hiring experience, as their team focuses not just on filling positions but on building strong, long-term workforce solutions.",
    name: "Manish Tiwari",
    author: "Director – Human Resources",
    type: "CLIENT",
  },
  {
    text: "Great Hire's attention to detail and commitment to understanding our workforce requirements has resulted in successful placements across both technical and non-technical roles.",
    name: "Ritika Sen",
    author: "Staffing Manager",
    type: "CLIENT",
  },
  {
    text: "We value Great Hire as a recruitment partner because of their consistent delivery of candidates who possess the right skills, attitude, and professionalism required for our organization.",
    name: "Vikram Joshi",
    author: "Senior Operations Manager",
    type: "CLIENT",
  },
  {
    text: "Great Hire has been instrumental in supporting our expansion plans by providing a steady pipeline of quality candidates across multiple business functions.",
    name: "Anand Krishnan",
    author: "Chief Operating Officer",
    type: "CLIENT",
  },
  {
    text: "Our collaboration with Great Hire has been extremely positive, as their recruitment expertise has helped us build strong teams efficiently and effectively.",
    name: "Pooja Malhotra",
    author: "HR Business Partner",
    type: "CLIENT",
  },
  {
    text: "Great Hire consistently demonstrates a deep understanding of our hiring needs and delivers candidates who are capable, motivated, and ready to grow with our organization.",
    name: "Rahul Chatterjee",
    author: "Talent Strategy Lead",
    type: "CLIENT",
  },
    {
      text: "We sincerely thank Great Hire Company for providing our learners with valuable internship opportunities that have significantly contributed to their skill development and career growth.",
      name: "Kamini",
      author: "HR and Corporate Relations Executive",
      type: "CLIENT",
    },
    {
      text: "Great Hire has consistently delivered top-tier candidates who align with both our job requirements and our values. Their attention to understanding our team dynamics makes all the difference.",
      name: "Raviraj",
      author: "Manager at Raviraj Pvt Limited",
      type: "CLIENT",
    },
    {
      text: "We've partnered with several recruiting services in the past, but none have matched the personalized approach of Great Hire. Their candidates are not only qualified but also passionate.",
      name: "Srinivas",
      author: "Director of Operations",
      type: "CLIENT",
    },
    {
      text: "Great Hire doesn't just send resumes—they send the right people. Every candidate they've placed with us came prepared and passionate, ready to contribute from day one.",
      name: "Sarath",
      author: "Hiring Manager",
      type: "CLIENT",
    },
    {
      text: "Real estate is about relationships, and Great Hire understands that. They found us a listing assistant who blends perfectly with our team and impresses clients consistently.",
      name: "Tabassum",
      author: "Lead Agent",
      type: "CLIENT",
    },
    {
      text: "We had trouble finding talent who could keep up with the demands of a high-volume brokerage. Great Hire delivered professionals who not only kept pace but helped us grow.",
      name: "Shrikanth",
      author: "Sales Manager",
      type: "CLIENT",
    },
    {
      text: "As a fast-growing startup, we needed to find candidates quickly, and Great Hire delivered. The talent pool is extensive, and the platform's sorting tools made it easy.",
      name: "Anirban Barman",
      author: "Assistant Manager",
      type: "CLIENT",
    },
    {
      text: "As a business owner, I have been using Great Hire for the past year to find top-tier talent for our team. The platform's user-friendly UI and wide range of highly skilled candidates have made it fantastic.",
      name: "Ahmed Shakeel",
      author: "Business Owner",
      type: "CLIENT",
    },
    {
      text: "I've worked with numerous job platforms, but Great Hire stands out because of its ability to match us with candidates who not only have the technical skills but also fit our culture.",
      name: "Raghav Naidu",
      author: "Hiring Manager",
      type: "CLIENT",
    },
    {
      text: "Finding the right candidates used to be a challenge, but Great Hire has made it effortless. The platform connects us with top talent that perfectly fits our company's needs.",
      name: "Karan Jaiswal",
      author: "Talent Acquisition Manager",
      type: "CLIENT",
    },
  ];

  const candidateReviews = [
     {
    text: "I am extremely grateful to the GreatHire team for their constant guidance and encouragement throughout my journey, as the mentorship and structured support helped me build strong professional skills and confidently secure a Human Resource role that perfectly aligned with my career aspirations.",
    name: "Priya Sharma",
    author: "Human Resource Professional",
    type: "CANDIDATE",
    },
    {
    text: "My experience with GreatHire has been truly rewarding, as the platform not only helped me understand the hiring process better but also guided me step by step in securing a Telecaller position that provided stability and growth opportunities.",
    name: "Rahul Mehta",
    author: "Telecaller",
    type: "CANDIDATE",
  },
  {
    text: "I would like to express my sincere gratitude to GreatHire for their exceptional support, as the platform helped me identify suitable opportunities and successfully secure an Accountant role where I can apply my financial knowledge with confidence.",
    name: "Sneha Kapoor",
    author: "Accountant",
    type: "CANDIDATE",
  },
  {
    text: "GreatHire played a crucial role in shaping my career by connecting me with the right organizations and providing continuous guidance, which ultimately helped me secure a Field Sales Executive position that matched my skills and long-term goals.",
    name: "Ankita Verma",
    author: "Field Sales Executive",
    type: "CANDIDATE",
  },
  {
    text: "I am deeply thankful to the GreatHire team for their professionalism and support, as they helped me smoothly transition into an Admin Executive role by offering relevant opportunities and timely assistance throughout the hiring process.",
    name: "Suresh Rao",
    author: "Admin Executive",
    type: "CANDIDATE",
  },
  {
    text: "Thanks to GreatHire, my job search journey became significantly easier, as the platform provided accurate recommendations and constant support that helped me successfully secure a Customer Support Executive role within a short period of time.",
    name: "Komal Deshmukh",
    author: "Customer Support Executive",
    type: "CANDIDATE",
  },
  {
    text: "GreatHire made my job search experience smooth and stress-free by connecting me with suitable employers, which eventually helped me land a Finance Executive position that aligns perfectly with my professional background.",
    name: "Nitin Agarwal",
    author: "Finance Executive",
    type: "CANDIDATE",
  },
  {
    text: "I am truly grateful to GreatHire for their continuous mentorship and structured hiring process, as it helped me secure a Recruitment Coordinator role and gain confidence in my professional journey.",
    name: "Ritika Joshi",
    author: "Recruitment Coordinator",
    type: "CANDIDATE",
  },
  {
    text: "My association with GreatHire has been extremely positive, as the platform guided me at every stage of my job search and helped me secure a Marketing Executive role that offered both learning and growth opportunities.",
    name: "Mohit Sharma",
    author: "Marketing Executive",
    type: "CANDIDATE",
  },
  {
    text: "I would like to thank GreatHire for their reliable support and career guidance, which played a vital role in helping me secure a Logistics Executive position that matched my experience and expectations.",
    name: "Pallavi Nair",
    author: "Logistics Executive",
    type: "CANDIDATE",
  },
  {
    text: "GreatHire supported me throughout my job search by providing consistent guidance and relevant opportunities, ultimately helping me secure a Front Office Executive role with confidence and clarity.",
    name: "Vivek Pandey",
    author: "Front Office Executive",
    type: "CANDIDATE",
  },
  {
    text: "I am sincerely thankful to GreatHire for helping me transition into a Field Marketing Executive role, as their guidance and recommendations made the entire hiring process smooth and effective.",
    name: "Ananya Bose",
    author: "Field Marketing Executive",
    type: "CANDIDATE",
  },
  {
    text: "GreatHire played an important role in my career journey by connecting me with the right employers, which helped me successfully secure a Client Relationship Executive position through a transparent and efficient process.",
    name: "Arjun Patel",
    author: "Client Relationship Executive",
    type: "CANDIDATE",
  },
  {
    text: "With the support of GreatHire, I was able to secure a Payroll Executive role, as the platform provided timely assistance, accurate job matches, and professional guidance throughout the hiring journey.",
    name: "Kavya Iyer",
    author: "Payroll Executive",
    type: "CANDIDATE",
  },
  {
    text: "I am grateful to GreatHire for simplifying my job search and helping me secure a Stock Executive role, as the platform's recommendations and guidance were both relevant and highly effective.",
    name: "Rohit Kulkarni",
    author: "Stock Executive",
    type: "CANDIDATE",
  },
  {
    text: "GreatHire helped me identify the right career opportunity and supported me throughout the process, which ultimately enabled me to secure a Sales Coordinator position that aligned well with my skills.",
    name: "Manish Tiwari",
    author: "Sales Coordinator",
    type: "CANDIDATE",
  },
  {
    text: "Thanks to GreatHire's professional approach and continuous support, I was able to secure a Customer Relationship Manager role and confidently take the next step in my career.",
    name: "Swati Mishra",
    author: "Customer Relationship Manager",
    type: "CANDIDATE",
  },
  {
    text: "I would like to express my sincere appreciation to GreatHire for guiding me throughout my job search, as their support helped me secure an Office Administrator role with ease and confidence.",
    name: "Rakesh Nair",
    author: "Office Administrator",
    type: "CANDIDATE",
  },
  {
    text: "GreatHire made my career transition smooth by offering timely guidance and relevant opportunities, which helped me successfully secure a Marketing Coordinator role.",
    name: "Ankush Singh",
    author: "Marketing Coordinator",
    type: "CANDIDATE",
  },
  {
    text: "I am truly thankful to GreatHire for helping me secure a Receptionist role, as the platform provided consistent support and accurate job recommendations throughout the process.",
    name: "Shalini Gupta",
    author: "Receptionist",
    type: "CANDIDATE",
    },
    {
      text: "I am deeply grateful to Sonika Babde, Sanket Babde, and Ch Tanmai for their invaluable mentorship and support throughout my journey. I'm confident in my ability to make a meaningful impact.",
      name: "R Krishnaveni",
      author: "Human Resource Professional",
      type: "CANDIDATE",
    },
    {
      text: "I'm grateful for the incredible journey at Great Hire, where I received invaluable mentorship and support. Special thanks to Ch Tanmai Ma for her guidance and Sanket Babde Sir for fostering growth.",
      name: "Meer Ahmadi",
      author: "Human Resource Professional",
      type: "CANDIDATE",
    },
    {
      text: "I'm deeply grateful to Ch Tanmai Ma'am for her support and guidance. Special thanks to Sanket Babde Sir for fostering a growth-oriented environment and motivating me at every step.",
      name: "Lahari",
      author: "Human Resource Professional",
      type: "CANDIDATE",
    },
    {
      text: "I am deeply grateful for the guidance and mentorship I received during my journey at GreatHire. Special thanks to the entire team for making the experience smooth and enriching.",
      name: "Nabhay Singh",
      author: "Business Development",
      type: "CANDIDATE",
    },
    {
      text: "I would like to express my deepest gratitude to Sonika Babde and Sanket Babde for their invaluable guidance and support. A special thank you to Ch Tanmai for exceptional mentorship.",
      name: "Sai Deepak",
      author: "Human Resource Professional",
      type: "CANDIDATE",
    },
    {
      text: "I would like to extend my sincere gratitude to the leadership team at Great Hire for their exceptional guidance and support throughout my internship experience.",
      name: "K Navaneeth",
      author: "Human Resource Professional",
      type: "CANDIDATE",
    },
    {
      text: "Great Hire made my job search effortless. The platform matched me with roles that fit my skills perfectly. Within weeks, I landed a data analyst position at a fantastic company.",
      name: "Rohan Das",
      author: "Data Analyst",
      type: "CANDIDATE",
    },
    {
      text: "As a job seeker, my experience with Great Hire has been fantastic. I received personalized recommendations, and within a few weeks, I found a position that was a perfect fit.",
      name: "Anshul Gupta",
      author: "Software Developer",
      type: "CANDIDATE",
    },
    {
      text: "I've used several job portals in the past, but Great Hire really stood out. The platform is incredibly user-friendly, and I was able to filter my job search effectively.",
      name: "Sourav Dubey",
      author: "Marketing Specialist",
      type: "CANDIDATE",
    },
    {
      text: "Great Hire helped me find the perfect DevOps Engineer role quickly. The platform's job recommendations were spot on, and the application process was seamless.",
      name: "Vikram Roy",
      author: "DevOps Engineer",
      type: "CANDIDATE",
    },
  ];

  return (
    <div className="w-full">
      <ReviewsCarousel
        reviews={clientReviews}
        title="What Our Clients Say"
        subtitle="Trusted by companies worldwide"
        pixelsPerSecond={5000}
      />
      
      <ReviewsCarousel
        reviews={candidateReviews}
        title="What Our Candidates Say"
        subtitle="Success stories from job seekers"
        pixelsPerSecond={5000}
      />
    </div>
  );
}