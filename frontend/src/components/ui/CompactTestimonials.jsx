import { useState, useEffect } from "react";
import { Star, Quote, ArrowRight, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompactTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  /* ================= STATS STATE ================= */

  const baseUsers = 10000;
  const baseSuccess = 95;
  const baseRating = 4.8;
  const baseDate = new Date(2026, 0, 1);

  const [targetStats, setTargetStats] = useState({
    users: baseUsers,
    success: baseSuccess,
    rating: baseRating,
  });

  const [displayStats, setDisplayStats] = useState({
    users: 0,
    success: 0,
    rating: 0,
  });

  /* Calculate monthly increase */
  useEffect(() => {
    const now = new Date();

    const monthsPassed =
      (now.getFullYear() - baseDate.getFullYear()) * 12 +
      (now.getMonth() - baseDate.getMonth());

    setTargetStats({
      users: baseUsers + monthsPassed * 250,
      success: Math.min(baseSuccess + monthsPassed * 0.2, 99),
      rating: Math.min(baseRating + monthsPassed * 0.02, 5),
    });
  }, []);

  /* Animate counter */
  useEffect(() => {
    const duration = 2000;
    const frameRate = 30;
    const totalFrames = duration / frameRate;

    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setDisplayStats({
        users: Math.floor(targetStats.users * progress),
        success: targetStats.success * progress,
        rating: targetStats.rating * progress,
      });

      if (frame >= totalFrames) {
        setDisplayStats(targetStats);
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [targetStats]);

  /* ================= TESTIMONIALS ================= */

  const testimonials = [
    {
      text: "GreatHire helped me land my dream job in just 2 weeks! The platform is incredibly easy to use.",
      name: "Priya Sharma",
      role: "Software Developer",
      type: "CANDIDATE",
      rating: 5,
    },
    {
      text: "Best recruitment platform! Found quality candidates quickly and efficiently.",
      name: "Raviraj",
      role: "Hiring Manager",
      type: "RECRUITER",
      rating: 5,
    },
    {
      text: "The AI-powered matching is amazing. Got interview calls from top companies within days!",
      name: "Rohan Das",
      role: "Data Analyst",
      type: "CANDIDATE",
      rating: 5,
    },
    {
      text: "GreatHire transformed our hiring process. Highly recommend for recruiters!",
      name: "Pallavi Deshpande",
      role: "HR Head",
      type: "RECRUITER",
      rating: 5,
    },
    {
      text: "Found my perfect job match through GreatHire. The platform is user-friendly and efficient.",
      name: "Anshul Gupta",
      role: "Marketing Specialist",
      type: "CANDIDATE",
      rating: 5,
    },
    {
      text: "Excellent platform for both job seekers and recruiters. Saved us so much time!",
      name: "Amit Verma",
      role: "Operations Manager",
      type: "RECRUITER",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = prev + 3;
        return nextIndex >= testimonials.length ? 0 : nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 px-4 overflow-hidden">

      {/* YOUR ENTIRE EXISTING TESTIMONIAL UI REMAINS SAME */}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">

        <div className="text-center">
          <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {Math.floor(displayStats.users / 1000)}K+
          </p>
          <p className="text-gray-600 text-sm font-medium mt-1">
            Happy Users
          </p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {displayStats.success.toFixed(1)}%
          </p>
          <p className="text-gray-600 text-sm font-medium mt-1">
            Success Rate
          </p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            {displayStats.rating.toFixed(1)}★
          </p>
          <p className="text-gray-600 text-sm font-medium mt-1">
            Average Rating
          </p>
        </div>

      </div>

    </div>
  );
};

export default CompactTestimonials;
