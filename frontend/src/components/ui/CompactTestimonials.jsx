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
    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-black py-16 px-4 overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md mb-4 transition-colors duration-300">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors duration-300">Trusted by 10,000+ Users</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 transition-colors duration-300">
            What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Community</span> Says
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">Real stories from real people</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(activeIndex, activeIndex + 3).concat(
            activeIndex + 3 > testimonials.length 
              ? testimonials.slice(0, (activeIndex + 3) - testimonials.length)
              : []
          ).slice(0, 3).map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 min-h-[80px] transition-colors duration-300">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm transition-colors duration-300">{testimonial.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">{testimonial.role}</p>
                </div>
              </div>

              {/* Read More Button */}
              <button
                onClick={() => {
                  navigate('/signup-choice');
                  setTimeout(() => {
                    const element = document.getElementById('testimonials-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm group transition-colors duration-300"
              >
                <span>Read More Reviews</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(Math.ceil(testimonials.length / 3))].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx * 3)}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(activeIndex / 3) === idx
                  ? "bg-blue-600 w-8"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {Math.floor(displayStats.users / 1000)}K+
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-1 transition-colors duration-300">Happy Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {displayStats.success.toFixed(1)}%
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-1 transition-colors duration-300">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              {displayStats.rating.toFixed(1)}★
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-1 transition-colors duration-300">Average Rating</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default CompactTestimonials;
