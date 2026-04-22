import { useState, useEffect, useRef } from "react";
import { Star, Quote, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TESTIMONIALS = [
  { text: "GreatHire helped me land my dream job in just 2 weeks! The platform is incredibly easy to use.", name: "Priya Sharma", role: "Software Developer", type: "CANDIDATE", rating: 5 },
  { text: "Best recruitment platform! Found quality candidates quickly and efficiently.", name: "Raviraj", role: "Hiring Manager", type: "RECRUITER", rating: 5 },
  { text: "The AI-powered matching is amazing. Got interview calls from top companies within days!", name: "Rohan Das", role: "Data Analyst", type: "CANDIDATE", rating: 5 },
  { text: "GreatHire transformed our hiring process. Highly recommend for recruiters!", name: "Pallavi Deshpande", role: "HR Head", type: "RECRUITER", rating: 5 },
  { text: "Found my perfect job match through GreatHire. The platform is user-friendly and efficient.", name: "Anshul Gupta", role: "Marketing Specialist", type: "CANDIDATE", rating: 5 },
  { text: "Excellent platform for both job seekers and recruiters. Saved us so much time!", name: "Amit Verma", role: "Operations Manager", type: "RECRUITER", rating: 5 },
];

const STARS = [1, 2, 3, 4, 5];

const CompactTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  // Compute final stats once — no animated counter (saves 66 re-renders)
  const stats = (() => {
    const now = new Date();
    const base = new Date(2026, 0, 1);
    const months = (now.getFullYear() - base.getFullYear()) * 12 + (now.getMonth() - base.getMonth());
    return {
      users: Math.floor((10000 + months * 250) / 1000),
      success: Math.min(95 + months * 0.2, 99).toFixed(1),
      rating: Math.min(4.8 + months * 0.02, 5).toFixed(1),
    };
  })();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 3;
        return next >= TESTIMONIALS.length ? 0 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visible = TESTIMONIALS.slice(activeIndex, activeIndex + 3)
    .concat(activeIndex + 3 > TESTIMONIALS.length ? TESTIMONIALS.slice(0, (activeIndex + 3) - TESTIMONIALS.length) : [])
    .slice(0, 3);

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-black py-16 px-4 overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md mb-4">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Trusted by 10,000+ Users</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">
            What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Community</span> Says
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Real stories from real people</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {visible.map((t, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Quote className="w-5 h-5 text-white" />
              </div>
              <div className="flex gap-1 mb-4">
                {STARS.map((i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 min-h-[80px">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/signup-choice')}
                className="mt-4 w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold text-sm group"
              >
                <span>Read More Reviews</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx * 3)}
              className={`h-2 rounded-full transition-all ${Math.floor(activeIndex / 3) === idx ? "bg-blue-600 w-8" : "bg-gray-300 dark:bg-gray-600 w-2"}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.users}K+</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-1">Happy Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.success}%</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-1">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">{stats.rating}★</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-1">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactTestimonials;
