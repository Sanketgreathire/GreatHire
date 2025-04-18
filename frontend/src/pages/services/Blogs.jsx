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
import bg1 from "../../assets/blogs images/bg1.png";




const blogPosts = [
  { title:  (
    < >
      Mastering<br />
      remote work
    </>
  ),
    description: "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.",
    animation: Remote
  },
  { title: (
    < >
      AI<br />
      Recruitment
    </>
  ),
    description: "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening, Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in.",
    animation: Artificial_intelligence
  },
  { title: (
    < >
      Build<br />
      Winning Resumes
    </>
  ), 
    description: "Make a strong first impression with a standout resume with key skills and clean formatting, optimized for ATS. GreatHire.in helps you land your ideal job by connecting you with the best opportunities.", 
    animation: Resume
  },  
  { title: (
    < >
      Interview<br />
      Preparations
    </>
  ), 
    description: "Research the company, practice questions, and present yourself professionally. GreatHire.in provides expert tips and top job opportunities to help you succeed and make a lasting impression.", 
    animation: Interview
  },  
  { title: (
    < >
      The Future<br />
      Of Work
    </>
  ), 
    description: "AI-driven hiring, remote work, and flexible roles are reshaping the workplace, making upskilling crucial. GreatHire.in keeps you informed on trends and connects you to top career opportunities.", 
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
        title: (
          < >
            Advance Your<br />
            Career in Tech
          </>
        ), 
        description: "Explore top opportunities with GreatHire.in, gain expert insights, and access resources to accelerate your growth. Stay ahead by upskilling, following industry trends, and landing your dream job.", 
        animation: Tech
      },
      { 
        title:  (
          < >
            Work-Life<br />
            Balance Tips
          </>
        ), 
        description: "Balancing work and personal life is essential for success. Set realistic boundaries, take breaks, and manage time to reduce stress. GreatHire.in offers flexible job opportunities for a healthy work-life balance.", 
        animation: Work_Life
      },  
      { 
        title: (
          < >
            Networking For<br />
            Career Growth
          </>
        ), 
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
        description: "In today’s job market, an ATS-friendly resume is crucial to get noticed. Applicant Tracking Systems scan resumes for key criteria before they reach recruiters. ", 
        animation: ATS
      } ,
      { 
        title: "Using Keywords", 
        description: "Using industry-specific keywords boosts your resume’s visibility to ATS. Review job descriptions to spot and include common terms and phrases. ", 
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
        description: "Leading companies invest in training, mentorship, and upskilling to boost employee growth. Programs like leadership development, technical certifications, and continuous learning enhance productivity and retention.", 
        animation: Development_Progress
      }  
  ]},
];

// export default Blogs;
const Blogs = () => {
  return (
    <>
      <Navbar />
        <div className="min-h-screen flex flex-col w-screen pt-10">
      
        <div className="py-2 text-center flex-grow w-screen">
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
            Your all-in-one platform for job applications, recruitment, and much more.<br />
            Connecting talent with opportunity!
          </p>

          <div className="mt-5 sm:mt-6 border-t border-blue-200"></div>

{/* ------------------------------------------------------------------------------------------------------------------------------------------------ */}

          {/* Blog Section */}
                  
          <div
  className="mb-2 w-full flex justify-center items-center px-4"
  style={{
    backgroundImage: `url(${bg1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "500px",
    width: "100%",
  }}
>
  <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-6xl text-center">
    <DotLottieReact
      src={Work}
      loop
      autoplay
      className="w-full max-w-[600px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
      style={{
        height: "auto",
        flexShrink: 0,
      }}
    />
    <div className="w-full max-w-xl mt-4 lg:mt-0">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black font-[Oswald] whitespace-nowrap">
        Great<span className="text-blue-700">Hire</span> Insights - The Future of Work
      </h3>
      <p className="mt-3 text-zinc-800 text-base sm:text-lg font-serif">
        The way people work is evolving, with professionals seizing new opportunities and reshaping industries.
      </p>
      <p className="mt-2 text-gray-600 text-sm sm:text-base font-serif">- GreatHire Team</p>
    </div>
  </div>
</div>

{/* ----------------------------------------------------------------------------------------------------------------------------------------------------- */}

          {/* Featured Blog Posts */}
          <div className="mt-9 py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-gray-800 text-center mb-6 pb-5 font-[Oswald]">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-9 max-w-5xl mx-auto">
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
                    <p className="text-gray-600 text-lg mt-3 font-['Pacifico']">
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
              className="mt-16 scroll-mt-20 bg-indigo-100 py-10 px-6 sm:px-12 rounded-xl gap-9"
            >
              <h2 className="text-5xl font-bold mb-4 font-[Oswald]">{category.title}</h2>
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
                    ) : (
                      <img
                        src={post.image}
                        alt={`Blog cover for ${post.title}`}
                        className="w-full h-48 object-cover bg-zinc-800 rounded-t-xl"
                      />
                    )}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <h3 className="text-xl font-bold font-[Oswald]">{post.title}</h3>
                      <p className="text-gray-900 text-lg mt-2 font-['Pacifico']">
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
