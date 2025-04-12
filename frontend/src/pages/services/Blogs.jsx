// import React from "react";  
import { Typewriter } from "react-simple-typewriter";  
import Navbar from "@/components/shared/Navbar";  
import Footer from "@/components/shared/Footer";  

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Remote from "../../assets/Animation/Remote.lottie";
import Artificial_intelligence from "../../assets/Animation/Artificial_intelligence.lottie";
import Resume from "../../assets/Animation/Resume.lottie";
import Interview from "../../assets/Animation/Interview.lottie";
import Future from "../../assets/Animation/Future.lottie";
import Career from "../../assets/Animation/Career.lottie";
import Work from "../../assets/Animation/Work.lottie";
import Tech from "../../assets/Animation/Tech.lottie";
import Work_Life from "../../assets/Animation/Work_Life.lottie";
import Network from "../../assets/Animation/Network.lottie";
import Master_Remote from "../../assets/Animation/Master_Remote.lottie";
import Ai_Recruitment from "../../assets/Animation/Ai_Recruitment.lottie";
import Hiring from "../../assets/Animation/Hiring.lottie";
import Winning_Resume from "../../assets/Animation/Winning_Resume.lottie";
import ATS from "../../assets/Animation/ATS.lottie";
import Keywords from "../../assets/Animation/Keywords.lottie";
import Preparation from "../../assets/Animation/Preparation.lottie";
import Behaviour from "../../assets/Animation/Behaviour.lottie";
import Culture from "../../assets/Animation/Culture.lottie";
import Strategy from "../../assets/Animation/Strategy.lottie";
import Post_Interview from "../../assets/Animation/Post_Interview.lottie";
import FAQ from "../../assets/Animation/FAQ.lottie";
import Top_Companies from "../../assets/Animation/Top_Companies.lottie";
import Industry_Trends from "../../assets/Animation/Industry_Trends.lottie";
import Development_Progress from "../../assets/Animation/Development_Progress.lottie";
import Future_Work from "../../assets/Animation/Future_Work.lottie";
import Future_Skills from "../../assets/Animation/Future_Skills.lottie";
import Global_Impact from "../../assets/Animation/Global_Impact.lottie";


// import Lottie from 'lottie-react';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import Player from "react-lottie-player";
import img11 from "../../assets/img11.png";  
import advanceYourCareerImg from "../../assets/blogs images/advance your carrer.png";
import aiInRecruitmentImg from "../../assets/blogs images/ai in recruitment.png";  
import buildingWinningResumeImg from "../../assets/blogs images/building a winnig resume.png";  
import futureOfWorkImg from "../../assets/blogs images/future of work.png";  
import interviewPreparationImg from "../../assets/blogs images/interview preparation.png";  
import networkingForGrowthImg from "../../assets/blogs images/networking for career growth.png";  
import remoteWorkImg from "../../assets/blogs images/remote work.png";  
//import news from "../../assets/blogs images/news.png";  
import worklifebalance from "../../assets/blogs images/work life balance.png";  
import hrinsights from "../../assets/blogs images/hr insights.png";  
import companyinsights from "../../assets/blogs images/company insights.png";  
import ats from "../../assets/blogs images/ats optimization.png";
import keyword from "../../assets/blogs images/keywords.png";
import postinterview from "../../assets/blogs images/post interview follow up.jpg";
import behaviour from "../../assets/blogs images/behaviol interview.png";
import culfit from "../../assets/blogs images/cultural fit assessment.png";
import industrys from "../../assets/blogs images/industry hiring.png";
import industry from "../../assets/blogs images/industry trends.png";
import globalevent from "../../assets/blogs images/global events on work force.png";
import inter from "../../assets/blogs images/interview quest.jpg";
import dev from "../../assets/blogs images/dev pro.jpg";
import hire from "../../assets/blogs images/hiring.jpg";
import upskilling from "../../assets/blogs images/upskilling career.jpg";




const blogPosts = [
  { title:  (
    <>
      Mastering<br />
      remote work
    </>
  ),
    description: "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.",
    animation: Remote
  },
  { title: "AI in Recruitment",
    description: "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening, Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in.",
    animation: Artificial_intelligence
  },
  { title: "Building a Winning Resume", 
    description: "Your resume is your first impression—highlight key skills, use clear formatting, and tailor it for each job. GreatHire.in helps you create an ATS-friendly resume and connect with top opportunities to land your dream role.", 
    animation: Resume
  },  
  { title: "Interview Preparation", 
    description: "Research the company, practice questions, and present yourself professionally. GreatHire.in provides expert tips and top job opportunities to help you succeed and make a lasting impression.", 
    animation: Interview
  },  
  { title: "The Future of Work", 
    description: "The workplace is shifting with AI-driven hiring, remote work, and flexible roles, making upskilling essential. GreatHire.in keeps you updated on trends and connects you with top career opportunities.", 
    animation: Future
  },
  { title: "Upskilling for Career Growth", 
    description: "Continuous learning is essential for career advancement, with in-demand skills shifting toward AI, cloud computing, and data analytics. Investing in online courses, certifications.", 
    animation: Career
  },  
  
];  


const categories = [  
  { id: "career-advice", title: "Career Advice", posts: [  
      { 
        title: "Advancing Your Career in Tech", 
        description: "Explore top opportunities with GreatHire.in, gain expert insights, and access resources to accelerate your growth. Stay ahead by upskilling, following industry trends, and landing your dream job.", 
        animation: Tech
      },
      { 
        title: "Work-Life Balance Tips", 
        description: "Balancing work and personal life is key to success. Set realist boundaries, take breaks, and manage time wisely to reduce stress. GreatHire.in connects you with flexible job opportunities to support a healthy work-life balance.", 
        animation: Work_Life
      },  
      { 
        title: "Networking for Career Growth", 
        description: "Networking opens doors to career growth engage on LinkedIn, attend events, and build meaningful connections. GreatHire.in helps you find the right opportunities and insights to advance your career.", 
        animation: Network
      }  
  ]},  
  { id: "hiring-advice", title: "Hiring Advice", posts: [
      { 
        title: "Mastering Remote Work",
        description: "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.",
        animation: Master_Remote
      },
      { 
        title: "AI in Recruitment",
        description: "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening, Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in.",
        animation: Ai_Recruitment
      } ,
      { 
        title: "Industry-Specific Hiring ", 
        description: "Tech hiring emphasizes AI, cloud computing, and cybersecurity skills, while non-tech sectors focus on adaptability, customer experience. Remote work and gig economy roles are growing across both industries.", 
        animation: Hiring
      } 
  ]},  
  { id: "resume-tips", title: "Resume Tips", posts: [  
      { 
        title: "Building a Winning Resume", 
        description: "A strong resume showcases skills, achievements, and experience with clear formatting and relevant keywords. GreatHire.in helps you find top talent with ATS-friendly resumes for faster, smarter hiring.", 
        animation: Winning_Resume
      },
      { 
        title: "ATS Optimization", 
        description: "In today's competitive job market, crafting an ATS-friendly resume is essential for ensuring your application gets noticed by hiring systems. Applicant Tracking Systems (ATS) scan resumes for specific criteria before they reach human eyes. ", 
        animation: ATS
      } ,
      { 
        title: "Using Keywords", 
        description: "Incorporating industry-specific keywords into your resume is a vital strategy for enhancing its visibility to ATS.Start by thoroughly reviewing the job descriptions of positions you're interested in to identify commonly used terms and phrases. ", 
        animation: Keywords

      } 
  ]},  
  { id: "news", title: "Trending Topics", posts: [  
      { 
        title: "The Future of Work", 
        description: "The workplace is shifting with AI-driven hiring, remote work, and flexible roles, making upskilling essential. GreatHire.in keeps you updated on trends and connects you with top career opportunities.", 
        animation: Future_Work

      },
      { 
        title: "Future Skills for Job Seekers", 
        description: "With automation and AI reshaping industries, in-demand skills include cloud computing, cybersecurity, data analytics, and digital marketing. Soft skills like adaptability, problem-solving, and collaboration are also becoming essential.", 
        animation: Future_Skills

      },
      { 
        title: "Impact of Global Events on Workforce", 
        description: "Economic and political events, such as recessions, conflicts, and policy changes, influence job markets, hiring trends, and remote work adoption.Businesses adjust workforce strategies based on global stability.", 
        animation: Global_Impact

      }
    ]},



  { id: "hr-insights", title: "HR Insights", posts: [  
      { 
        title: "Interview Preparation", 
        description: "A structured interview process helps assess candidates through behavioral questions, cultural fit, and problem-solving skills. GreatHire.in offers expert insights and AI-driven tools to streamline hiring and find the best talent.", 
        animation: Preparation
      },
      {
        title: "Behavioral Interview Techniques", 
        description: "Behavioral interviewing is a technique used to assess candidates based on their past experiences and actions in specific situations. It operates on the principle that past behavior is a strong predictor of future performance.", 
        animation: Behaviour
      },
      { 
        title: "Cultural Fit Assessment", 
        description: "Cultural fit assessment evaluates how well a candidate aligns with a company's values, work environment, and team dynamics. It ensures the candidate’s personality and work style complement the organization's mission and culture.", 
        animation: Culture
      }  ///////////
  ]},  
  { id: "interview-tips", title: "Interview Tips", posts: [  
      { 
        title: "Effective Job Interview Strategies", 
        description: "Research the company, practice answers, and use the STAR method to showcase your skills. GreatHire.in provides expert tips and job opportunities to help you ace your interview and land your dream job.", 
        animation: Strategy
      },

      { 
        title: "Post-Interview Follow-Up", 
        description: "Sending a thank-you email within 24 hours shows professionalism and reinforces interest in the role. A follow-up message can also be used to restate key qualifications and inquire about the hiring timeline.", 
        animation: Post_Interview 
      }, 
   
      { 
        title: "Common Interview Questions", 
        description: "Preparing for frequently asked questions like Tell me about yourself, Why do you want to work here? and What are your strengths and weaknesses? helps candidates answer confidently. ", 
        animation: FAQ

      }  

  ]},

  { id: "company-insights", title: "Company Insights", posts: [  
      { 
        title: "Top Companies Hiring in 2025", 
        description: "In 2025, top companies like Amazon, Google, and GE Aerospace are expanding, offering diverse job opportunities. GreatHire.in helps you stay updated on the latest openings, including remote and flexible roles.", 
        animation: Top_Companies
      } ,
      { 
        title: "Industry Trends", 
        description: " Emerging trends across industries include AI-driven automation, sustainable business practices, and the rise of remote/hybrid work models. Companies are also focusing on digital transformation and cybersecurity to stay competitive.", 
        animation: Industry_Trends
      },  
      { 
        title: "Development Programs", 
        description: "Leading companies invest in training programs, mentorship, and upskilling initiatives to enhance employee growth. Programs like leadership development, technical certifications, and continuous learning platforms improve workforce productivity and retention.", 
        animation: Development_Progress
      }  
  ]},
];


// const blogPosts = [
//     {
//       title: "Mastering Remote Work",
//       description: "Tips and strategies to stay productive while working remotely, especially in tech, finance, and healthcare, where remote work is becoming the norm.",
//       image: img3,
//     },
//     {
//       title: "AI in Recruitment",
//       description: "How artificial intelligence is transforming the hiring process.",
//       image: img3,
//     },
//     {
//       title: "Building a Winning Resume",
//       description: "Essential tips to craft a resume that stands out.",
//       image: img3,
//     },
//     {
//       title: "Interview Preparation",
//       description: "A step-by-step guide to ace your next job interview.",
//       image: img3,
//     },
//     {
//       title: "The Future of Work",
//       description: "Emerging trends shaping the workplace of tomorrow.",
//       image: img3,
//     }, 
// ];
const Blogs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="px-4 sm:px-6 lg:px-8 py-6 text-center flex-grow">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-6 font-[Oswald]">
            <span style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}>
              <Typewriter
                words={["Unlock Your Potential With Great"]}
                typeSpeed={50}
                cursor={false}
              />
            </span>
            <span
              className="text-blue-700"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}
            >
              <Typewriter
                words={["Hire"]}
                typeSpeed={50}
                delaySpeed={500}
                cursor={false}
              />
            </span>
            
          </h1>
          <p className="text-base sm:text-2xl mt-4 mx-auto font-serif">
            Your all-in-one platform for job applications, recruitment, and much more.<br/>
            Connecting talent with opportunity!
          </p>

          {/* Navigation Menu */}
          <div className="mt-10 sm:mt-14 border-t  border-blue-200 py-4">
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base md:text-lg font-semibold text-gray-800">
              {/* Navigation links */}
            </nav>
          </div>

          {/* Blog Section */}
          <div className="mt-10 mb-28 sm:mt-12 flex flex-col md:flex-row items-center gap-6 sm:gap-5 max-w-5xl mx-auto" 
          // style={{
          //   // backgroundImage: `url(${bgImage})`,
          //   // backgroundSize: 'cover',
          //   // backgroundPosition: 'center',
          //   // opacity:10
          //   backgroundColor:'lightblue',
          //   borderRadius:'30px'
          // }}
          
          >
            <DotLottieReact
              src={Work}
              loop
              autoplay

              style={{ padding:"0px 0px 10px 10px", width: "450px", height: "450px"}}
            />
            <div className="w-full  pl-7">
              <h3 className="text-4xl font-bold text-gray-800 font-[Oswald]"  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
                GreatHire Insights - The Future of Work
              </h3>
              <p className=" mt-3 mx-auto max-w-2xl text-gray-700 text-xl font-serif ">
                The way people work is evolving, with professionals seizing new
                opportunities and reshaping industries.
              </p>
              <p className="mt-2 text-gray-500 text-lg font-serif">
                - GreatHire Team
              </p>
            </div>
          </div>

          {/* Featured Blog Posts */}
          <div className="mt-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-gray-800 text-center mb-6 pb-5 font-[Oswald]">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {blogPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col max-w-[280px] mx-auto"
                >
                  {post.animation && (
                    <DotLottieReact
                      src={post.animation}
                      loop
                      autoplay
                      style={{ width: "100%", height: "200px" }}
                    />
                  )}
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <h3 className="text-xl font-semibold font-[Oswald]">{post.title}</h3>
                    <p className="text-gray-600 text-lg mt-3 font-[Pacifico]">
                      {post.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Blog Sections */}
          {categories.map((category) => (
            <div
              key={category.id}
              id={category.id}
              className="mt-16 scroll-mt-20 bg-indigo-100 py-10 px-4 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {category.posts.map((post, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col max-w-[280px] mx-auto"
                  >
                    {post.animation ? (
                      <DotLottieReact
                        src={post.animation}
                        loop
                        autoplay
                        style={{ width: "100%", height: "200px" }}
                      />
                    ) :
                     (
                      <img
                        src={post.image}
                        alt={`Blog cover for ${post.title}`}
                        className="w-full h-48 object-cover bg-zinc-800 rounded-t-xl"
                      />
                    )
                    }
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-gray-600 text-sm mt-2">
                        {post.description}
                      </p>
                    </div>
                  </div>
                ))}
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