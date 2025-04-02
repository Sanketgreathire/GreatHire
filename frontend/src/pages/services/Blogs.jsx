import React from "react";
import { Link } from "react-router-dom";
// import img6 from "../../assets/img6.png";
import img3 from "../../assets/img3.png";
import img8 from "../../assets/img8.png";
import img11 from "../../assets/img11.png";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Typewriter } from "react-simple-typewriter";


const blogPosts = [
    {
      title: "Mastering Remote Work",
      description: "Tips and strategies to stay productive while working remotely.",
      image: img3,
    },
    {
      title: "AI in Recruitment",
      description: "How artificial intelligence is transforming the hiring process.",
      image: img3,
    },
    {
      title: "Building a Winning Resume",
      description: "Essential tips to craft a resume that stands out.",
      image: img3,
    },
    {
      title: "Interview Preparation",
      description: "A step-by-step guide to ace your next job interview.",
      image: img3,
    },
    {
      title: "The Future of Work",
      description: "Emerging trends shaping the workplace of tomorrow.",
      image: img3,
    },
  ];

  const categories = [
    { id: "career-advice", title: "Career Advice", posts: [
        { title: "Advancing Your Career in Tech", description: "Key skills and strategies to grow in the technology industry.", image: img8 },
        { title: "Work-Life Balance Tips", description: "Practical steps to maintain a healthy work-life balance.", image: img8 },
        { title: "Networking for Career Growth", description: "How to leverage professional connections for career success.", image: img8 }
    ]},
    { id: "hiring-advice", title: "Hiring Advice", posts: [
        { title: "Mastering Remote Work", description: "Tips and strategies to stay productive while working remotely.", image: img3 },
        { title: "AI in Recruitment", description: "How artificial intelligence is transforming the hiring process.", image: img3 }
    ]},
    { id: "resume-tips", title: "Resume Tips", posts: [
        { title: "Building a Winning Resume", description: "Essential tips to craft a resume that stands out.", image: img3 }
    ]},
    { id: "news", title: "News", posts: [
        { title: "The Future of Work", description: "Emerging trends shaping the workplace of tomorrow.", image: img3 }
    ]},
    { id: "hr-insights", title: "HR Insights", posts: [
        { title: "Interview Preparation", description: "A step-by-step guide to ace your next job interview.", image: img3 }
    ]},
    { id: "interview-tips", title: "Interview Tips", posts: [
        { title: "Effective Job Interview Strategies", description: "Improve your chances of getting hired with these proven techniques.", image: img3 }
    ]},
    { id: "company-insights", title: "Company Insights", posts: [
        { title: "Top Companies Hiring in 2024", description: "Discover the best companies to work for this year.", image: img3 }
    ]}
  ];

const Blogs = () => {
  return (
    <>
    <Navbar />
    <div min-h-screen flex flex-col>
      <div className="px-4 sm:px-6 lg:px-8 py-6 text-center flex-grow">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-6">
            <span>
              <Typewriter
                words={["Unlock Your Potential With Great"]}
                typeSpeed={50} // Typing speed
                cursor={false} // Hide cursor after typing
              />
            </span>
            <span className="text-blue-700">
              <Typewriter
                words={["Hire"]}
                typeSpeed={50} // Typing speed
                delaySpeed={500} // Delay for a smooth transition
                cursor={false} // Hide cursor after typing
              />
            </span>
          </h1>
        <p className="text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          Your all-in-one platform for job applications, recruitment and many more—connecting talent with opportunity!
        </p>

        {/* Navigation Menu with Lines Above & Below */}
        <div className="mt-10 sm:mt-14 border-t border-b border-blue-200 py-4">
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base md:text-lg font-semibold text-gray-800">
        <a href="#career-advice" className="hover:text-blue-800 transition">Career Advice</a>
        <a href="#hiring-advice" className="hover:text-blue-800 transition">Hiring Advice</a>
        <a href="#resume-tips" className="hover:text-blue-800 transition">Resume Tips</a>
        <a href="#news" className="hover:text-blue-800 transition">News</a>
        <a href="#hr-insights" className="hover:text-blue-800 transition">HR Insights</a>
        <a href="#interview-tips" className="hover:text-blue-800 transition">Interview Tips</a>
        <a href="#company-insights" className="hover:text-blue-800 transition">Company Insights</a>
        </nav>
        </div>

        {/* Blog Section with Image on Left and Text on Right */}
        <div className="mt-10 mb-28 sm:mt-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 max-w-5xl mx-auto text-left">
          <img 
            src={img11}
            alt="Blog" 
            className="w-full md:w-[30%] lg:w-[25%] max-h-[250px] rounded-3xl shadow-lg bg-emerald-600"
          />
          <div className="w-full md:w-1/2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              GreatHire Insights – The Future of Work
            </h2>
            <p className="mt-3 text-gray-700 text-sm sm:text-base text-justify">
              The way people work is evolving, with professionals seizing new opportunities and reshaping industries. GreatHire is here to bridge the gap, connecting top talent with the right opportunities to fuel growth, innovation, and success.
            </p>
            <p className="mt-2 text-gray-500 text-xs sm:text-sm">- GreatHire Team</p>
          </div>
        </div>

        {/* Featured Blog Posts */}
<div className="mt-16 px-4 sm:px-6 lg:px-8">
  <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Featured Articles</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {blogPosts.map((post, index) => (
      <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col max-w-[280px] mx-auto h-[400px] md:h-[450px]">
        <img src={post.image} alt="Blog Cover" className="w-full h-48 object-cover bg-zinc-800 rounded-t-xl" />
        <div className="p-6 flex flex-col justify-between flex-grow">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">{post.description}</p>
        </div>
      </div>
    ))}
  </div>
</div>
        
        {/* Blog Sections */}
        {categories.map((category) => (
            <div key={category.id} id={category.id} className="mt-16 scroll-mt-20 bg-orange-50 py-10 px-4 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {category.posts.map((post, index) => (
                  <div key={index} className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col max-w-[280px] mx-auto h-[400px] md:h-[450px]">
                    <img src={post.image} alt="Blog Cover" className="w-full h-48 object-cover bg-zinc-800 rounded-t-xl" />
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{post.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
              <button
               onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
               className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 
               [@supports(height:100vh)]:bottom-[calc(6rem+env(safe-area-inset-bottom,0px))]"
              >
              <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth="2"
               stroke="currentColor"
               className="w-6 h-6"
              >
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
             </svg>
           </button>
           </div>
          </div>
          ))}

        </div>
        <Footer />
    </div>
    </>
  );
};

export default Blogs;