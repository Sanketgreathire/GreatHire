import React, { useEffect, useState } from "react";
import HiringInsights from "@/pages/HiringInsights";
import Lottie from "lottie-react";
import career from "../assets/Career Animation.json";
import hiring from "../assets/Human-Resources-Approval-Animation.json";
import resume from "../assets/Recolored job proposal review animation.json";
import remoteWork from "../assets/Work from Home.json";
import { Link, useNavigate } from "react-router-dom"; //npm install react-router-dom
import ProductDetailPage from "@/components/ProductDetailPage";
import CareerAdvice from "@/components/CareerAdvice";
import bannerBlog from "../assets/blogs images/banner.blog.webp";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import TheFuture from "@/components/TheFuture";

// imported helmet to apply customized meta tags
import { Helmet } from "react-helmet-async";

// Slides data outside component to prevent recreation
const slides = [
  {
    id: 1,
    title: "The future technology",
    description:
      "The future of technology begins with bold ideas. At Capgemini, we bring those ideas to life – as intended.",
    image: "./3320008.jpg",
  },
  {
    id: 2,
    title: "Innovation drives growth",
    description:
      "We transform businesses through cutting-edge technology solutions and innovative approaches.",
    image: "./innovation-bg.png",
  },
  {
    id: 3,
    title: "Digital transformation",
    description:
      "Empowering organizations to thrive in the digital age with our expertise and solutions.",
    image: "./digital_bg.jpg",
  },
  {
    id: 4,
    title: "Technology solutions",
    description:
      "Building the future with scalable, secure, and sustainable technology platforms.",
    image: "./technology-solutions_bg.jpg",
  },
];

function Moin_blog_page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality for blog slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Insight slider functionality
  useEffect(() => {
    const slider = document.getElementById("cardSlider");
    const cards = document.querySelectorAll(".insight-card");
    if (!slider || cards.length === 0) return;

    let index = 0;
    const cardWidth = 320;

    const autoSlide = () => {
      index++;
      if (index > cards.length - 3) index = 0;
      slider.style.transform = `translateX(-${index * cardWidth}px)`;
    };

    let interval = setInterval(autoSlide, 4000);
    slider.onmouseenter = () => clearInterval(interval);
    slider.onmouseleave = () => (interval = setInterval(autoSlide, 4000));

    return () => clearInterval(interval);
  }, []);

  const [CardCurrentSlide, setCardCurrentSlide] = useState(0);

  // Static product data
  const staticProduct = {
    title: "Featured ",
    subtitle: "Articles",
    description:
      "Stay updated with the latest trends, tips, and insights in the job market. Explore our featured articles to enhance your career journey with GreatHire.in.",
    image: "./feature_article.png",
    date: "December 24, 2024",
  };

  // Carousel products data
  const carouselProducts = [
    {
      title: "Mastering",
      subtitle: "remote work",
      description:
        "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.",
      image: "./vector.png",
      date: "December 20, 2024",
      category: "Featured",
    },
    {
      title: "AI",
      subtitle: "Recruitment",
      description:
        "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening, Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in",
      image: "./19276.jpg",
      date: "December 18, 2024",
      category: "Featured",
    },
    {
      title: "Build ",
      subtitle: "Winning Resumes",
      description:
        "Make a strong first impression with a standout resume with key skills and clean formatting, optimized for ATS. GreatHire.in helps you land your ideal job by connecting you with the best opportunities.",
      image: "./Resume_bg.png",
      date: "December 15, 2024",
      category: "Trending",
    },
    {
      title: "Interview",
      subtitle: "Preparations",
      description:
        "Research the company, practice questions, and present yourself professionally. GreatHire.in provides expert tips and top job opportunities to help you succeed and make a lasting impression.",
      image: "./Interview_bg.png",
      date: "December 12, 2024",
      category: "Featured",
    },
    {
      title: "The Future",
      subtitle: "Of Work",
      description:
        "AI-driven hiring, remote work, and flexible roles are reshaping the workplace, making upskilling crucial. GreatHire.in keeps you informed on trends and connects you to top career opportunities.",
      image: "./furure_of_work.png",
      date: "December 10, 2024",
      category: "Trending",
    },
    {
      title: "Upskilling for ",
      subtitle: "Career Growth",
      description:
        "Continuous learning is essential for career advancement, with in-demand skills shifting toward AI, cloud computing, and data analytics. Investing in online courses, certifications.",
      image: "./trendingz-topic_02.png",
      date: "December 10, 2024",
      category: "Trending",
    },
  ];

  const nextCardSlide = () => {
    setCardCurrentSlide((prev) => (prev + 1) % carouselProducts.length);
  };

  const prevCardSlide = () => {
    setCardCurrentSlide(
      (prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length,
    );
  };

  const goToCardSlide = (index) => {
    setCardCurrentSlide(index);
  };

  const articles = [
    {
      id: 1,
      title: "Advance Your Career in Tech",
      description:
        "Explore top opportunities with GreatHire.in, gain expert insights, and access resources to accelerate your growth. Stay ahead by upskilling, following industry trends, and landing your dream job.",
      image: "./971.jpg",
      category: "Business",
      author: "Moin Shaikh",
      date: "December 20, 2024",
    },
    {
      id: 2,
      title: "Work-Life Balance Tips",
      description:
        "Balancing work and personal life is essential for success. Set realistic boundaries, take breaks, and manage time to reduce stress. GreatHire.in offers flexible job opportunities for a healthy work-life balance.",
      image: "./feature_article.png",
      category: "Technology",
      author: "Moin Shaikh",
      date: "December 18, 2024",
    },
    {
      id: 3,
      title: "Networking For Career Growth",
      description:
        "Networking opens doors to career growth engage on LinkedIn, attend events, and build meaningful connections. GreatHire.in helps you find the right opportunities and insights to advance your career.",
      image: "./networking_bg.png",
      category: "Network",
      author: "Moin Shaikh",
      date: "December 15, 2024",
    },
  ];

  const HiringAdvices = [
    {
      id: 1,
      title: "Mastering Remote Work",
      description:
        "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.",
      image: "./Mastering_remote_work.png",
      link: "",
      overlayText: "",
      overlaySubtext: "",
    },
    {
      id: 2,
      title: "AI For Recruitment",
      description:
        "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening, Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in.",
      image: "./AI_recruitment.jpg",
      link: "",
      overlayText: "",
      overlaySubtext: "",
    },
    {
      id: 3,
      title: "Industry-Specific Hiring",
      description:
        "Tech hiring emphasizes AI, cloud computing, and cybersecurity skills, while non-tech sectors focus on adaptability, customer experience. Remote work and gig economy roles are growing across both industries.",
      image: "./Industry_work.png",
      link: "",
      overlayText: "",
      overlaySubtext: "",
    },
  ];

  const TrendingTopics = [
    {
      id: 1,
      title: "The Future of Work",
      description:
        "The workplace is shifting with AI-driven hiring, remote work, and flexible roles, making upskilling essential. GreatHire.in keeps you updated on trends and connects you with top career opportunities.",
      image: "./future_of_work.png",
      link: "",
      overlayText: "",
      overlaySubtext: "",
    },
    {
      id: 2,
      title: "Future Skills for Job Seekers",
      description:
        "With automation and AI reshaping industries, in-demand skills include cloud computing, cybersecurity, data analytics, and digital marketing. Soft skills like adaptability, problem-solving, and collaboration are also becoming essential.",
      image: "./trendingz-topic_02.png",
      link: "",
      overlayText: "",
      overlaySubtext: "",
    },
    {
      id: 3,
      title: "Impact of Global Events on Workforce",
      description:
        "Economic and political events, such as recessions, conflicts, and policy changes, influence job markets, hiring trends, and remote work adoption.Businesses adjust workforce strategies based on global stability.",
      image: "./trendingz_topic_03.png",
      link: "",
      overlayText: "",
      overlaySubtext: "",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselItems = [
    {
      id: 1,
      category: "Resume Tips",
      title: "Creating a Successful CV",
      date: "19 Dec, 2025",
      image: "./Resume_bg.png",
      description:
        "A strong resume successfully highlights a candidate's abilities, accomplishments, and professional experience through the strategic use of pertinent keywords and clear, consistent structure. By offering ATS-friendly resumes that are designed for applicant tracking systems, GreatHire.in helps expedite the recruiting process. This guarantees improved visibility, precise applicant matching, and quicker shortlisting, allowing companies to find top talent and make more intelligent, effective hiring decisions.",
      link: "#",
    },
    {
      id: 2,
      category: "Resume Tips",
      title: "ATS Optimization",
      date: "18 Dec, 2025",
      image: "./ATS_bg.png",
      description:
        "Gaining awareness in the competitive job market of today requires an ATS-friendly resume. Applicant tracking systems (ATS) automatically analyze and assess resumes based on predetermined criteria, including pertinent keywords, abilities, job titles, and formatting, before they are sent to a recruiter. Regardless of a candidate's qualifications, resumes that are not suited for applicant tracking systems may be eliminated early in the process. Making an ATS-compliant resume guarantees that recruiting experts analyze your profile and improves your chances of passing first screenings.",
      link: "#",
    },
    {
      id: 3,
      category: "Resume Tips",
      title: "Using Keywords",
      date: "17 Dec, 2025",
      description:
        "By utilizing industry-specific keywords, you can greatly improve your resume's exposure to applicant tracking systems. Finding frequently used words, abilities, and phrases that employers value can be accomplished by closely examining job descriptions. The likelihood that your profile will be shortlisted for recruiter evaluation is increased and ATS matching accuracy is improved when these pertinent keywords are organically incorporated throughout your CV.",
      image: "./Keyword_bg.png",
      link: "#",
    },
    {
      id: 4,
      category: "HR Insights",
      title: "Interview Preparation",
      date: "16 Dec, 2025",
      description:
        "Candidates are assessed through a methodical interview process that emphasizes problem-solving skills, cultural fit, and behavioral evaluations. GreatHire.in facilitates this process with AI-powered tools and professional insights that assist expedite hiring, enhance decision-making, and swiftly find top personnel most appropriate for your company.",
      image: "./Interview_bg.png",
      link: "#",
    },
    {
      id: 5,
      category: "HR Insights",
      title: "Behavioral Interview Techniques",
      date: "16 Dec, 2025",
      description:
        "During a structured interview process, candidates are assessed using behavioral questions, cultural fit, and problem-solving skills. GreatHire.in offers professional insights and AI-powered solutions to find top talent and speed up recruiting.",
      image: "./HR_Insight_02.png",
      link: "#",
    },
    {
      id: 6,
      category: "HR Insights",
      title: "Cultural Fit Assessment",
      date: "16 Dec, 2025",
      description:
        "The purpose of a cultural fit review is to determine how well a candidate fits with the team dynamics, workplace culture, and basic values of a business. It looks at attitudes, communication styles, work ethics, and behavioral characteristics in addition to technical skills. This assessment aids in determining whether a candidate's methods for problem-solving, teamwork, and decision-making align with the organization's long-term goals and expectations. Cultural fit evaluations help increase employee engagement, teamwork, retention, and overall organizational success by guaranteeing alignment between the individual and the company.",
      image: "./HR_Insight_03.png",
      link: "#",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const autoPlayInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(autoPlayInterval);
  }, [isAutoPlaying, carouselItems.length]);

  const moveToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    setIsAutoPlaying(false); // Pause auto-play when manually navigating
  };

  const moveToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length,
    );
    setIsAutoPlaying(false);
  };

  const selectSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const productItems = [
    {
      id: 1,
      name: "Effective Job Interview Strategies",
      category: "Interview Tips",
      description:
        "Making a good impression during an interview requires careful preparation. Examine the organization and position to learn about its objectives, principles, and standards; rehearse your answers to frequently asked interview questions; and use the STAR (Situation, Task, Action, Result) method to showcase your abilities and accomplishments. GreatHire.in offers professional advice, tools for interview preparation, and access to pertinent career prospects to support candidates at every stage. This will help you perform successfully, make an impression on employers, and land your dream job.",
      readMore: "Read More",
      image: "./interview_tips_01.png",
    },
    {
      id: 2,
      name: "Post-Interview Follow-Up",
      category: "Interview Tips",
      description:
        "It shows professionalism and reaffirms your interest in the job to send a thank-you email within 24 hours of the interview. In order to make a good and lasting impression on the employer, a well-written follow-up message also offers the chance to restate important qualifications, emphasize your appropriateness for the position, and respectfully ask about the next steps or hiring timeframe.",
      image: "./interview_tips_02.png",
      readMore: "Read More",
    },
    {
      id: 3,
      name: "Common Interview Questions",
      category: "Interview Tips",
      description:
        "Candidates can comfortably and successfully react to frequently asked interview questions, such as 'Tell me about yourself, 'Why do you want to work here?' and 'What are your strengths and weaknesses?' Candidates can show self-awareness, clearly communicate their abilities, experiences, and goals, and make a good impression on interviewers by anticipating these inquiries.",
      readMore: "Read More",
      image: "./interview_tips_03.png",
    },
    {
      id: 4,
      name: "Top Companies Hiring in 2025",
      category: "Company Insights",
      description:
        "In 2025, major international corporations like Amazon, Google, and GE Aerospace are expanding significantly and providing a variety of professional options. You may stay up to date on the most recent job openings—including remote and flexible employment—by using GreatHire.in. This allows you to investigate positions that fit your talents, career objectives, and preferred work schedules.",
      readMore: "Read More",
      image: "./company_insight_01.png",
    },
    {
      id: 5,
      name: "Industry Trends",
      category: "Company Insights",
      description:
        "AI-driven automation, sustainable business practices, and the quick growth of remote and hybrid work models are examples of emerging trends in a variety of industries. Businesses are concentrating more on cybersecurity, digital transformation, and the use of cutting-edge technologies that boost productivity, safeguard data, and spur creativity in order to stay competitive in this changing environment. Organizations and professionals looking to match their talents with future prospects must keep an eye on these trends.",
      readMore: "Read More",
      image: "./company_insight_02.png",
    },
    {
      id: 6,
      name: "Development Programs",
      category: "Company Insights",
      description:
        "Prominent companies actively fund training, mentorship, and upskilling initiatives to support staff development and advancement. In addition to improving workforce skills, initiatives like technical certifications, leadership development courses, and ongoing education also boost engagement, productivity, and employee retention. By placing a high priority on employee development, businesses build a workforce that is capable, driven, and prepared for the future, all of which contribute to long-term organizational success.",
      readMore: "Read More",
      image: "./company_insight_03.png",
    },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(productItems.length / itemsPerPage);

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate) return;

    const rotateTimer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(rotateTimer);
  }, [autoRotate, totalPages]);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setAutoRotate(false);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setAutoRotate(false);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setAutoRotate(false);
  };

  const getCurrentProducts = () => {
    const startIndex = currentPage * itemsPerPage;
    return productItems.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <>
      <Helmet>
        <title>
          GreatHire Blog | Career Guidance, Employment Patterns, and
          Perspectives on the Future of Work
        </title>

        <meta
          name="description"
          content="GreatHire Blog: Your one-stop destination for expert career advice, effective hiring strategies, and interview tips, along with guidance on resume optimization and the future of work. Our insight will help both job seekers and employers deal with the most competitive markets, be it AI-driven recruitment and remote work trends or preparing for an interview and upskilling. GreatHire is based in Hyderabad State, India, and serves businesses, recruiters, and professionals throughout the Hyderabad State region with innovative hiring solutions and career guidance."
        />
      </Helmet>

      <Navbar />
      <style>
        {`
          /* ================= VIDEO BANNER SECTION ================= */
          .video-banner-section {
            position: relative;
            width: 100%;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 4rem 4rem;
          }

          .video-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
          }

          .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            z-index: 1;
          }

          .content-wrapper {
            position: relative;
            z-index: 10;
            max-width: 640px;
            width: 100%;
            text-align: center;
            color: #000;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.85);
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(25, 114, 230, 0.4);
            backdrop-filter: blur(10px);
          }

          .main-title {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1.5rem;
          }

          .brand-name {
            font-size: 3rem;
            font-weight: 700;
          }

          .highlight-text {
            color: #2563eb;
          }

          .description-text {
            font-size: 1rem;
            line-height: 1.7;
            margin-top: 1.5rem;
            
            
          }

          .author-text {
            font-size: 1rem;
            font-weight: 600;
            font-style: italic;
            margin-top: 1rem;
            color: #1f2937;
          }

          /* ================= BLOG SLIDER SECTION ================= */
          .slider-section {
            position: relative;
            width: 100%;
            height: 70vh;
            min-height: 500px;
            overflow: hidden;
            background: linear-gradient(135deg, #1e3a5f 0%, #2c5f7e 100%);
          }

          .slider-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transition: opacity 0.6s ease-in-out;
          }

          .slider-background::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%);
          }

          .slider-content {
            position: relative;
            z-index: 10;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 4rem;
            max-width: 1400px;
            margin: 0 auto;
          }

          .content-box {
            background: rgba(31, 41, 55, 0.85);
            backdrop-filter: blur(10px);
            padding: 3rem;
            border-radius: 12px;
            max-width: 600px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          }

          .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 1.5rem;
            line-height: 1.2;
          }

          .slide-description {
            font-size: 1.125rem;
            color: #d1d5db;
            line-height: 1.7;
            margin-bottom: 2rem;
          }

          .slider-controls {
            position: absolute;
            bottom: 3rem;
            left: 4rem;
            display: flex;
            align-items: center;
            gap: 2rem;
            z-index: 20;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            padding: 1rem 1.5rem;
            border-radius: 50px;
          }

          .nav-arrow {
            width: 40px;
            height: 40px;
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #ffffff;
            font-size: 1.25rem;
          }

          .nav-arrow:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: #ffffff;
            transform: scale(1.1);
          }

          .pagination-dots {
            display: flex;
            gap: 0.75rem;
            align-items: center;
          }

          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }

          .dot.active {
            background: #3b82f6;
            width: 14px;
            height: 14px;
            border-color: rgba(59, 130, 246, 0.3);
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }

          .dot:hover {
            background: rgba(255, 255, 255, 0.7);
            transform: scale(1.2);
          }

          .read-more-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            background: transparent;
            color: #ffffff;
            border: 2px solid rgba(255, 255, 255, 0.5);
            padding: 0.75rem 2rem;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .read-more-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #ffffff;
            transform: translateX(5px);
          }

          .read-more-btn .arrow {
            font-size: 1.25rem;
            transition: transform 0.3s ease;
          }

          .read-more-btn:hover .arrow {
            transform: translateX(5px);
          }

          /* ================= TABLET RESPONSIVE (768px - 1023px) ================= */
          @media (max-width: 1023px) {
            /* Video Banner */
            .video-banner-section {
              min-height: 80vh;
              padding: 3rem 1.5rem;
            }

            .content-wrapper {
              padding: 1.5rem;
            }

            .main-title {
              font-size: 2rem;
            }

            .brand-name {
              font-size: 2.5rem;
            }

            .description-text {
              font-size: 0.95rem;
              padding: 0 1rem;
            }

            .author-text {
              font-size: 0.95rem;
            }

            /* Blog Slider */
            .slider-section {
              height: 60vh;
              min-height: 450px;
            }

            .slider-content {
              padding: 0 2rem;
            }

            .content-box {
              padding: 2.5rem;
              max-width: 550px;
            }

            .slide-title {
              font-size: 2rem;
            }

            .slide-description {
              font-size: 1rem;
            }

            .slider-controls {
              bottom: 2rem;
              left: 2rem;
              padding: 0.875rem 1.25rem;
            }
          }

          /* ================= MOBILE RESPONSIVE (below 768px) ================= */
          @media (max-width: 767px) {
            /* Video Banner */
            .video-banner-section {
              min-height: 100vh;
              padding: 2rem 1rem;
              align-items: flex-end;
              justify-content: center;
              padding-bottom: 3rem;
            }

            .content-wrapper {
              padding: 1.5rem 1rem;
              max-width: 100%;
            }

            .main-title {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }

            .brand-name {
              font-size: 2rem;
              display: block;
              margin-bottom: 0.5rem;
            }

            .description-text {
              font-size: 0.875rem;
              line-height: 1.6;
              padding: 0;
              margin-top: 1rem;
            }

            .author-text {
              font-size: 0.875rem;
              margin-top: 0.75rem;
            }

            /* Blog Slider */
            .slider-section {
              height: 100vh;
              min-height: 600px;
            }

            .slider-content {
              padding: 1rem;
              align-items: flex-end;
              padding-bottom: 6rem;
            }

            .content-box {
              padding: 2rem 1.5rem;
              max-width: 100%;
              width: 100%;
            }

            .slide-title {
              font-size: 1.75rem;
              margin-bottom: 1rem;
            }

            .slide-description {
              font-size: 0.938rem;
              line-height: 1.6;
              margin-bottom: 1.5rem;
            }

            .slider-controls {
              bottom: 1.5rem;
              left: 50%;
              transform: translateX(-50%);
              padding: 0.75rem 1rem;
              gap: 1.5rem;
            }

            .nav-arrow {
              width: 36px;
              height: 36px;
              font-size: 1rem;
            }

            .dot {
              width: 10px;
              height: 10px;
            }

            .dot.active {
              width: 12px;
              height: 12px;
            }

            .read-more-btn {
              padding: 0.625rem 1.5rem;
              font-size: 0.938rem;
            }
          }

          /* ================= EXTRA SMALL MOBILE (below 480px) ================= */
          @media (max-width: 479px) {
            /* Video Banner */
            .video-banner-section {
              padding: 1.5rem 0.75rem;
            }

            .content-wrapper {
              padding: 1.25rem 0.875rem;
              border-radius: 0.75rem;
            }

            .main-title {
              font-size: 1.25rem;
            }

            .brand-name {
              font-size: 1.75rem;
            }

            .description-text {
              font-size: 0.813rem;
            }

            .author-text {
              font-size: 0.813rem;
            }

            /* Blog Slider */
            .slider-section {
              min-height: 550px;
            }

            .content-box {
              padding: 1.5rem 1.25rem;
            }

            .slide-title {
              font-size: 1.5rem;
            }

            .slide-description {
              font-size: 0.875rem;
            }

            .slider-controls {
              gap: 1rem;
              padding: 0.625rem 0.875rem;
            }

            .nav-arrow {
              width: 32px;
              height: 32px;
            }

            .pagination-dots {
              gap: 0.5rem;
            }

            .dot {
              width: 8px;
              height: 8px;
            }

            .dot.active {
              width: 10px;
              height: 10px;
            }

            .read-more-btn {
              padding: 0.5rem 1.25rem;
              font-size: 0.875rem;
            }
          }

            /* ================= FEATURED ARTICLES SECTION ================= */
           /* Main Section Container */
          .conversations-section {
            position: relative;
            width: 100%;
            min-height: 350px;
            overflow: hidden;
            display: flex;
            align-items: center;
            background: #1a1d29;
            padding: 4rem 2rem;
          }

          /* Background Image */
          .conversations-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0.4;
            z-index: 0;
          }

          /* Dark Overlay */
          .conversations-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, rgba(26, 29, 41, 0.95) 0%, rgba(26, 29, 41, 0.7) 50%, rgba(26, 29, 41, 0.3) 100%);
            z-index: 1;
          }

          /* Content Container */
          .conversations-content {
            position: relative;
            z-index: 10;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
          }

          /* Text Content Box */
          .text-content {
            max-width: 650px;
            padding: 3rem;
            background: rgba(26, 29, 41, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 0;
          }

          .section-title {
            font-size: 2.75rem;
            font-weight: 400;
            color: #ffffff;
            margin-bottom: 2rem;
            line-height: 1.3;
            letter-spacing: -0.5px;
          }

          .section-description {
            font-size: 1.125rem;
            color: #e5e7eb;
            line-height: 1.8;
            margin-bottom: 3rem;
            font-weight: 300;
          }

          /* Explore Button */
          .explore-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            background: transparent;
            color: #ffffff;
            border: 2px solid rgba(255, 255, 255, 0.6);
            padding: 1rem 2.5rem;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            letter-spacing: 0.3px;
          }

          .explore-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #ffffff;
            transform: translateX(5px);
          }

          .explore-btn .arrow {
            font-size: 1.5rem;
            transition: transform 0.3s ease;
            font-weight: 700;
          }

          .explore-btn:hover .arrow {
            transform: translateX(5px);
          }

          /* Tablet Responsive (768px - 1023px) */
          @media (max-width: 1023px) {
            .conversations-section {
              min-height: 500px;
              padding: 3rem 1.5rem;
            }

            .text-content {
              max-width: 600px;
              padding: 2.5rem;
            }

            .section-title {
              font-size: 2.25rem;
            }

            .section-description {
              font-size: 1rem;
              margin-bottom: 2.5rem;
            }

            .explore-btn {
              padding: 0.875rem 2rem;
              font-size: 0.938rem;
            }
          }

          /* Mobile Responsive (below 768px) */
          @media (max-width: 767px) {
            .conversations-section {
              min-height: 550px;
              padding: 2rem 1rem;
              align-items: center;
            }

            .conversations-overlay {
              background: linear-gradient(to bottom, rgba(26, 29, 41, 0.85) 0%, rgba(26, 29, 41, 0.95) 100%);
            }

            .conversations-background {
              opacity: 0.3;
            }

            .text-content {
              max-width: 100%;
              padding: 2rem 1.5rem;
              background: rgba(26, 29, 41, 0.7);
              text-align: center;
            }

            .section-title {
              font-size: 1.875rem;
              margin-bottom: 1.5rem;
            }

            .section-description {
              font-size: 0.938rem;
              line-height: 1.7;
              margin-bottom: 2rem;
            }

            .explore-btn {
              padding: 0.75rem 2rem;
              font-size: 0.875rem;
              width: 100%;
              justify-content: center;
              max-width: 280px;
            }
          }

          /* Extra Small Mobile (below 480px) */
          @media (max-width: 479px) {
            .conversations-section {
              min-height: 500px;
              padding: 1.5rem 0.75rem;
            }

            .text-content {
              padding: 1.5rem 1.25rem;
            }

            .section-title {
              font-size: 1.625rem;
            }

            .section-description {
              font-size: 0.875rem;
              line-height: 1.6;
            }

            .explore-btn {
              padding: 0.625rem 1.5rem;
              font-size: 0.813rem;
            }

            .explore-btn .arrow {
              font-size: 1.25rem;
            }
          }

          ================= CARDSLIDER =================
            /* Carousel Slide Animations */
          .carousel-slide {
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
          }

          .carousel-slide.active {
            opacity: 1;
            transform: translateX(0);
          }

          .carousel-slide.inactive {
            opacity: 0;
            transform: translateX(20px);
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
          }

          /* Image Hover Effect */
          .product-image-hover {
            transition: transform 0.3s ease;
          }

          .product-card:hover .product-image-hover {
            transform: scale(1.05);
          }

          /* Pagination Dot Animation */
          @keyframes dotPulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            50% {
              box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
            }
          }

          .pagination-dot.active {
            animation: dotPulse 2s infinite;
          }

          /* Arrow Button Hover */
          .carousel-arrow {
            transition: all 0.3s ease;
          }

          .carousel-arrow:hover {
            transform: scale(1.1);
          }

           /* Article Image Hover Effect */
          .article-image-container {
            overflow: hidden;
          }

          .article-image {
            transition: transform 0.4s ease;
          }

          .article-card:hover .article-image {
            transform: scale(1.1);
          }

          /* Category Badge Animation */
          .category-badge {
            transition: all 0.3s ease;
          }

          .article-card:hover .category-badge {
            transform: translateY(-3px);
          }

          /* Read More Link Animation */
          .read-more-link {
            position: relative;
            display: inline-block;
          }

          .read-more-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #10b981;
            transition: width 0.3s ease;
          }

          .read-more-link:hover::after {
            width: 100%;
          }

          /* Author Avatar Placeholder */
          .author-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.875rem;
          }

          /* ================== Job Signup Community ======================== */

             /* Talent Signup Button Hover Animation */
          .talent-signup-button {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .talent-signup-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }

          .talent-signup-button:hover::before {
            width: 300px;
            height: 300px;
          }

          .talent-signup-button:hover {
            transform: translateX(5px);
            box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);
          }

          /* Button Arrow Animation */
          .button-arrow-icon {
            transition: transform 0.3s ease;
          }

          .talent-signup-button:hover .button-arrow-icon {
            transform: translateX(5px);
          }

          /* Community Content Card Animation */
          .community-content-card {
            animation: fadeInUpContent 1s ease-out;
          }

          @keyframes fadeInUpContent {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Background Gradient Animation */
          @keyframes backgroundGradientShift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .talent-community-gradient-bg {
            background-size: 200% 200%;
            animation: backgroundGradientShift 15s ease infinite;
          }

          // =============== Hiring Advice Section ================
           /* Article Card Hover Effects */
          .conversations-article-card {
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
          }

          .conversations-article-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          /* Image Zoom Effect */
          .article-featured-image {
            transition: transform 0.5s ease;
            filter: brightness(0.8);
          }

          .conversations-article-card:hover .article-featured-image {
            transform: scale(1.1);
            filter: brightness(0.6);
          }

          /* Overlay Text Animation */
          .article-image-overlay {
            transition: opacity 0.3s ease;
          }

          .conversations-article-card:hover .article-image-overlay {
            opacity: 1;
          }

          /* Bottom Content Slide Up */
          .article-content-wrapper {
            transition: all 0.3s ease;
          }

          .conversations-article-card:hover .article-content-wrapper {
            background: rgba(26, 32, 44, 0.98);
          }

          /* Link Underline Animation */
          .article-read-more-link {
            position: relative;
            display: inline-block;
          }

          .article-read-more-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #06b6d4;
            transition: width 0.3s ease;
          }

          .article-read-more-link:hover::after {
            width: 100%;
          }

          /* Title Color Shift */
          .article-card-title {
            transition: color 0.3s ease;
          }

          .conversations-article-card:hover .article-card-title {
            color: #06b6d4;
          }

          /* Fade In Animation on Load */
          .conversations-articles-container {
            animation: fadeInContainer 0.8s ease-out;
          }

          @keyframes fadeInContainer {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          ============= Resume Tips and HR Insights Section =============
          /* Carousel Container Styling */
          .hr-carousel-wrapper {
            position: relative;
             z-index: 0;          /* 👈 ADD */
  overflow: visible; 
            background: linear-gradient(135deg, 
              rgba(59, 130, 246, 0.03) 0%, 
              rgba(168, 85, 247, 0.03) 50%, 
              rgba(236, 72, 153, 0.03) 100%
            );
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .hr-carousel-wrapper::before {
            content: '';
            position: absolute;
            inset: -2.5px;
            background: linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%);
            border-radius: inherit;
            opacity: 0;
            z-index: -2;
            pointer-events: none; 
            transition: opacity 0.5s ease-in-out;
          }

          .hr-carousel-wrapper:hover::before {
            opacity: 0.7;
          }

          .hr-carousel-wrapper:hover {
            background: linear-gradient(135deg, 
              rgba(59, 130, 246, 0.06) 0%, 
              rgba(168, 85, 247, 0.06) 50%, 
              rgba(236, 72, 153, 0.06) 100%
            );
          }

          /* Slide Animation */
          .carousel-content-slide {
            transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
          }

          .carousel-content-slide.visible {
            opacity: 1;
            transform: translateY(0);
            display: grid;
          }

          .carousel-content-slide.hidden {
            opacity: 0;
            transform: translateY(20px);
            display: none;
          }

          /* Media Element Effects */
          .carousel-media-item {
            transition: transform 0.6s ease, filter 0.4s ease;
            filter: brightness(0.95) contrast(1.05);
          }

          .hr-carousel-wrapper:hover .carousel-media-item {
            transform: scale(1.07);
            filter: brightness(1.05) contrast(1.1);
          }

          /* Title Gradient Effect */
          .carousel-main-title {
            transition: all 0.4s ease;
          }

          .carousel-main-title {
  position: relative;
  z-index: 3;
}


   .hr-carousel-wrapper:hover .carousel-main-title {
  background: linear-gradient(135deg, #3b82f6, #a855f7, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;

  /* Fallback color (VERY IMPORTANT) */
color: rgb(160, 67, 246);
-webkit-text-fill-color: transparent;

  /* Visibility insurance */
  
  color: rgba(233, 46, 239, 0.92);                 /* solid color fallback */
  -webkit-text-fill-color: #d34ef0;
}



          /* Category Tag Transform */
          .carousel-tag-wrapper {
            transition: all 0.35s ease;
          }

          .hr-carousel-wrapper:hover .carousel-tag-wrapper {
            color: #a855f7;
            transform: translateX(5px);
          }

          .carousel-tag-line {
            transition: all 0.35s ease;
          }

          .hr-carousel-wrapper:hover .carousel-tag-line {
            width: 3.5rem;
            background: linear-gradient(135deg, #3b82f6, #a855f7);
          }

          /* Date Color Shift */
          .carousel-date-display {
            transition: color 0.35s ease;
          }

          .hr-carousel-wrapper:hover .carousel-date-display {
            color: #8b5cf6;
          }

          /* Action Button Styling */
          .carousel-action-btn {
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            overflow: hidden;
          }

          .carousel-action-btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent);
            transform: translate(-50%, -50%);
            transition: width 0.6s ease, height 0.6s ease;
            border-radius: 50%;
          }

          .carousel-action-btn:hover::after {
            width: 300px;
            height: 300px;
          }

          .carousel-action-btn:hover {
            transform: translateX(10px);
          }

          .hr-carousel-wrapper:hover .carousel-action-btn {
            border-color: #a855f7;
            color: #a855f7;
          }

          /* Arrow Slide Animation */
          .btn-arrow-icon {
            transition: transform 0.4s ease;
          }

          .carousel-content-slide {
  position: relative;
  z-index: 2;
}

          .carousel-action-btn:hover .btn-arrow-icon {
            transform: translateX(8px);
          }

          /* Navigation Controls */
          .carousel-nav-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          }

          .nav-direction-btn {
            transition: all 0.35s ease;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          }

          .nav-direction-btn:hover {
            background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 10px 25px rgba(168, 85, 247, 0.25);
          }

          .nav-direction-btn:active {
            transform: scale(0.95);
          }

          /* Progress Dots */
          .progress-dot-item {
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .progress-dot-item.active-dot {
            transform: scaleX(2.8);
            background: linear-gradient(135deg, #3b82f6, #a855f7, #ec4899);
          }

          .progress-dot-item:hover {
            transform: scale(1.2);
          }

          /* Colorful Heading */
          .gradient-heading-text {
            background: linear-gradient(135deg, #3b82f6, #a855f7, #ec4899);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          /* Slide In Animation */
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .carousel-content-slide.visible {
            animation: slideInUp 0.7s ease-out;
          }

          /* Responsive Adjustments */
          @media (max-width: 1023px) {
            .hr-carousel-wrapper {
              padding: 1.5rem !important;
            }
          }

          @media (max-width: 767px) {
            .hr-carousel-wrapper {
              padding: 1rem !important;
              border-radius: 1rem !important;
            }
          }
            ============= Interview & Comapny Insight =============
            /* Main Carousel Container */
          .grid-carousel-container {
            position: relative;
            background: linear-gradient(160deg, 
              rgba(245, 158, 11, 0.04) 0%, 
              rgba(239, 68, 68, 0.04) 50%, 
              rgba(168, 85, 247, 0.04) 100%
            );
            transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .grid-carousel-container::after {
            content: '';
            position: absolute;
            inset: -2.5px;
            background: linear-gradient(160deg, #f59e0b, #ef4444, #a855f7);
            border-radius: inherit;
            opacity: 0;
            z-index: -1;
            transition: opacity 0.7s ease;
          }

          .grid-carousel-container:hover::after {
            opacity: 0.75;
          }

          .grid-carousel-container:hover {
            background: linear-gradient(160deg, 
              rgba(245, 158, 11, 0.07) 0%, 
              rgba(239, 68, 68, 0.07) 50%, 
              rgba(168, 85, 247, 0.07) 100%
            );
          }

          /* Product Card Styling */
          .product-grid-card {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          }

          .product-grid-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
            background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          }

          /* Product Image Container */
          .product-img-box {
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }

          .product-grid-card:hover .product-img-box {
            transform: scale(1.05);
          }

          .product-img-element {
            transition: all 0.6s ease;
            filter: grayscale(0) brightness(1);
          }

          .product-grid-card:hover .product-img-element {
            filter: grayscale(0) brightness(1.1);
            transform: scale(1.1);
          }

          /* Product Title Effect */
          .product-title-text {
            transition: all 0.4s ease;
          }

          .product-grid-card:hover .product-title-text {
            background: linear-gradient(160deg, #f59e0b, #ef4444, #a855f7);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          /* Category Tag Animation */
          .category-tag-box {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .product-grid-card:hover .category-tag-box {
            background: linear-gradient(90deg, #f59e0b, #ef4444);
            color: white;
            transform: scale(1.05);
          }

          /* Price Animation */
          .product-price-tag {
            transition: all 0.4s ease;
          }

          .product-grid-card:hover .product-price-tag {
            color: #ef4444;
            transform: scale(1.1);
          }

          /* Rating Stars */
          .star-rating-box {
            transition: transform 0.4s ease;
          }

          .product-grid-card:hover .star-rating-box {
            transform: scale(1.08);
          }

          /* Add to Cart Button */
          .cart-action-btn {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .cart-action-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent);
            transform: translate(-50%, -50%);
            transition: all 0.6s ease;
            border-radius: 50%;
          }

          .cart-action-btn:hover::before {
            width: 300px;
            height: 300px;
          }

          .cart-action-btn:hover {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4);
          }

          /* Badge Styling */
          .product-badge-label {
            animation: badgeGlowEffect 2s ease-in-out infinite;
          }

          @keyframes badgeGlowEffect {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
            }
          }

          /* Navigation Controls */
          .grid-nav-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
          }

          .page-arrow-btn {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(145deg, #ffffff, #f3f4f6);
          }

          .page-arrow-btn:hover {
            background: linear-gradient(145deg, #f59e0b, #ef4444);
            color: white;
            transform: scale(1.15) rotate(-5deg);
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
          }

          .page-arrow-btn:active {
            transform: scale(0.9);
          }

          /* Page Indicator Dots */
          .page-dot-indicator {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .page-dot-indicator.dot-selected {
            background: linear-gradient(90deg, #f59e0b, #ef4444, #a855f7);
            transform: scaleX(2.5);
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.5);
          }

          .page-dot-indicator:hover {
            transform: scale(1.3);
          }

          /* Gradient Heading */
          .gradient-heading-style {
            background: linear-gradient(160deg, #f59e0b, #ef4444, #a855f7);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          /* Fade In Animation */
          @keyframes gridFadeIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .product-grid-wrapper {
            animation: gridFadeIn 0.8s ease-out;
          }

          /* Responsive Grid Adjustments */
          @media screen and (max-width: 1023px) {
            .grid-carousel-container {
              padding: 2.5rem !important;
            }
          }

          @media screen and (max-width: 767px) {
            .grid-carousel-container {
              padding: 1.75rem !important;
              border-radius: 1.5rem !important;
            }
          }
        `}
      </style>

      {/* ================= VIDEO BANNER SECTION ================= */}
      {/* Banner Section */}
      <section className="video-banner-section mt-20 mb-24 dark:bg-gray-900">
        <img
          className="video-background w-full h-[100px] object-cover"
          src={bannerBlog}
          alt="GreatHire Banner"
        />



        <div className="content-wrapper max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-max p-10 shadow-[0_10px_25px_rgba(59,130,246,0.5)] dark:shadow-[0_10px_25px_rgba(59,130,246,0.3)]">
          <h1 className="main-title text-2xl font-bold text-gray-900 dark:text-white leading-snug text-center">
            <span className="brand-name">
              Great<span className="highlight-text text-blue-600">Hire</span>
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200 text-2xl">
              Insights – The Future of Work
            </span>
          </h1>

          <p className="description-text mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-left">
            Your one-stop shop for recruiting and job applications, matching top
            talent with suitable positions and enabling employers to make more
            informed, data-driven hiring decisions in the dynamic workplace of
            today.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-blue-600 dark:text-blue-400">✔</span>
              Hiring Insights Driven by AI
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="text-blue-600 dark:text-blue-400">✔</span>
              Growing Businesses Trust Us
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="text-blue-600 dark:text-blue-400">✔</span>
              Quicker & More Intelligent Hiring
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="text-blue-600 dark:text-blue-400">✔</span>
              Complete Talent Platform
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <a
              href="#future-of-hiring"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
            >
              Explore Insights
            </a>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Hire more wisely right now.
            </span>
          </div>

          <div className="mt-6 border-t dark:border-gray-600 pt-4 flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>
              <strong className="text-gray-900 dark:text-white">10,000+</strong> Candidates
            </span>
            <span>
              <strong className="text-gray-900 dark:text-white">1,200+</strong> Recruiters
            </span>
            <span>
              <strong className="text-gray-900 dark:text-white">98%</strong> Satisfaction
            </span>
          </div>
        </div>
      </section>

      {/* ================= BLOG SLIDER SECTION ================= */}
      {/* Slider Section */}
      <section className="relative w-full h-[100dvh] min-h-[550px] overflow-hidden dark:bg-gray-900">

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={slides[currentSlide]?.image}
            alt={slides[currentSlide]?.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 dark:from-black/90 dark:via-black/70 dark:to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-end md:items-center h-full px-4 md:px-16 pb-28 md:pb-0">
          <div className="w-full md:max-w-xl bg-gray-900/80 dark:bg-gray-800/90 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-2xl">

            <div className="mb-2 text-xs md:text-sm text-blue-300 font-semibold">
              Slide {currentSlide + 1} of {slides.length}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {slides[currentSlide]?.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
              {slides[currentSlide]?.description}
            </p>

            <Link
              to={`/TheFuture/${slides[currentSlide]?.id}`}
              className="inline-flex items-center gap-2 border border-white/50 px-5 py-2.5 md:px-8 md:py-3 rounded-full text-white text-sm md:text-base font-semibold hover:bg-white/10 transition"
            >
              Read More
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 flex items-center gap-4 md:gap-6 bg-black/60 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full z-20">

          {/* Prev */}
          <button
            onClick={prevSlide}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-white/50 rounded-full text-white text-lg md:text-xl hover:bg-white/20 transition"
          >
            ‹
          </button>

          {/* Dots */}
          <div className="flex gap-2 md:gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${currentSlide === index
                  ? "bg-blue-500 w-3 h-3 md:w-4 md:h-4"
                  : "bg-white/40 w-2 h-2 md:w-3 md:h-3"
                  }`}
              ></button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={nextSlide}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-white/50 rounded-full text-white text-lg md:text-xl hover:bg-white/20 transition"
          >
            ›
          </button>
        </div>

      </section>


      {/* ================= CAREER ADVICE SECTION ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Our <span className="highlight-text"> Blogs</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Discover our latest and featured products
            </p>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Column 1 - Static Product Card */}

            {/* <div className="product-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-500 flex flex-col">
              
              <div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
                <img
                  src={staticProduct.image}
                  alt={staticProduct.title}
                  className="product-image-hover w-full h-full object-cover"
                />
                
                <span className="absolute top-4 left-4 bg-white/95 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  {staticProduct.category}
                </span>
              </div>

              
              <div className="p-6 flex-grow flex flex-col">
                
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                  <span className="text-base">📅</span>
                  <span>{staticProduct.date}</span>
                </div>

                <h3 className="text-2xl lg:text-3xl md:text-xl sm:text-lg font-bold mb-3">
                  <span className="text-gray-900">{staticProduct.title}</span>
                  <span className="text-green-600">{staticProduct.subtitle}</span>
                </h3>

                
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 flex-grow">
                  {staticProduct.description}
                </p>

              </div>
            </div> */}

            <div className="product-card flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
                <img
                  src={staticProduct.image}
                  alt={staticProduct.title}
                  className="product-image-hover w-full aspect-[3/2] sm:aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/10]  object-cover"
                />

                <span className="absolute top-4 left-4 bg-white/95 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  {staticProduct.category}
                </span>
              </div>

              <div className="p-6 flex-grow flex flex-col bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-4">
                  <span className="text-base">📅</span>
                  <span>{staticProduct.date}</span>
                </div>

                <h3 className="text-2xl lg:text-3xl md:text-xl sm:text-lg font-bold mb-3">
                  <span className="text-gray-900 dark:text-white text-5xl">
                    {staticProduct.title}
                  </span>
                  <span className="text-green-600 text-5xl">
                    {staticProduct.subtitle}
                  </span>
                </h3>

                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-grow">
                  {staticProduct.description}
                </p>
              </div>
            </div>

            {/* Column 2 - Carousel Product Card */}
            <div className="product-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              {/* Carousel Container */}
              <div className="relative">
                {/* Navigation Arrows */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 z-20">
                  <button
                    className="carousel-arrow w-10 h-10 sm:w-12 sm:h-12 bg-white/95 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-800 text-xl sm:text-2xl font-bold shadow-lg hover:bg-blue-500 hover:text-white hover:border-blue-500"
                    onClick={prevSlide}
                    aria-label="Previous product"
                  >
                    ‹
                  </button>
                  <button
                    className="carousel-arrow w-10 h-10 sm:w-12 sm:h-12 bg-white/95 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-800 text-xl sm:text-2xl font-bold shadow-lg hover:bg-blue-500 hover:text-white hover:border-blue-500"
                    onClick={nextSlide}
                    aria-label="Next product"
                  >
                    ›
                  </button>
                </div>

                {/* Carousel Slides */}
                <div className="relative overflow-hidden">
                  {carouselProducts.map((product, index) => (
                    <div
                      key={index}
                      className={`carousel-slide ${currentSlide === index ? "active" : "inactive"
                        }`}
                    >
                      {/* Image Container */}
                      <div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="product-image-hover w-full h-full object-cover"
                        />
                        {/* Category Badge */}
                        <span className="absolute top-4 left-4 bg-white/95 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                          {product.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 bg-white dark:bg-gray-800">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-4">
                          <span className="text-base">📅</span>
                          <span>{product.date}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                          {product.title}
                          <span className="highlight-text">
                            {" "}
                            {product.subtitle}
                          </span>
                        </h3>

                        {/* Description */}
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                          {product.description}
                        </p>

                        {/* Button */}
                        {/* <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                          View Details
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 py-6 px-4">
                {carouselProducts.map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-dot w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border-2 ${currentSlide === index
                      ? "bg-blue-500 border-blue-300 w-3 h-3 sm:w-3.5 sm:h-3.5 active"
                      : "bg-gray-300 border-transparent hover:bg-gray-400"
                      }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to product ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= INSIGHTS SLIDER SECTION ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-normal text-black dark:text-white mb-2">
              Career <span className="highlight-text ">Advise</span>
            </h2>
            <p className="text-lg md:text-base sm:text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Keep up with our most recent observations, trends, and
              professional viewpoints on a variety of subjects and industries.
              Stay current on the information and advancements that are most
              important to corporations and professionals alike.
            </p>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {articles.map((article) => (
              <div
                key={article.id}
                className="article-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Article Image */}
                <div className="article-image-container relative h-64 md:h-56 sm:h-52 bg-gradient-to-br from-gray-800 to-gray-600">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="article-image w-full h-full object-cover"
                  />
                  {/* Category Badge */}
                  <span className="category-badge absolute top-4 left-4 bg-white bg-opacity-95 text-green-600 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                    {article.category}
                  </span>
                </div>

                {/* Article Content */}
                <div className="p-6 flex-grow flex flex-col bg-white dark:bg-gray-800">
                  {/* Author & Date Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {/* <div className="author-avatar">
                        {article.author.charAt(0)}
                      </div> */}
                      <div>
                        {/* <p className="text-sm font-semibold text-gray-900">
                          {article.author}
                        </p> */}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {article.readTime}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <span className="text-base">📅</span>
                    <span>{article.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl md:text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-grow line-clamp-3">
                    {article.description}
                  </p>

                  {/* Read More Link */}
                  <Link
                    to={`/CareerAdvice/${article.id}`}
                    className="read-more-link text-green-600 font-semibold text-base flex items-center gap-2 hover:text-green-700 transition-colors duration-300"
                  >
                    Read More
                    <span className="text-xl">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {/* <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-4 rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-base">
              View All Articles
            </button>
          </div> */}
        </div>
      </section>

      {/* =================== Hiring Advice Section ================== */}
      <section className="conversations-articles-section bg-linear-to-br from-gray-900 via-slate-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="conversations-articles-container max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="articles-section-header mb-12 text-center">
            <h2 className="conversations-main-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-normal text-black dark:text-white mb-2">
              Hiring <span className="highlight-text">Advices</span>
            </h2>
          </div>

          {/* Articles Grid */}
          <div className="articles-grid-layout grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {HiringAdvices.map((article) => (
              <div
                key={article.id}
                className="conversations-article-card bg-gray-800 rounded-none overflow-hidden shadow-xl"
              >
                {/* Image Section with Overlay */}
                <div className="article-image-container relative h-80 md:h-72 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="article-featured-image w-full h-full object-cover"
                  />

                  {/* Text Overlay on Image */}
                  {/* <div className="article-image-overlay absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h3 className="overlay-main-text text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontWeight: 300 }}>
                      Crafting
                    </h3>
                    <h3 className="overlay-highlight-text text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
                      Tomorrow
                    </h3>
                    <p className="overlay-subtext text-sm text-gray-300">
                      Leaders' perspective on technology
                    </p>
                  </div> */}
                </div>

                {/* Content Section */}
                <div className="article-content-wrapper bg-gray-900 p-6">
                  {/* Article Title */}
                  <h3 className="article-card-title text-xl md:text-2xl font-semibold text-white mb-4">
                    {article.title}
                  </h3>

                  {/* Article Description */}
                  <p className="article-description-text text-sm md:text-base text-gray-400 leading-relaxed mb-6 line-clamp-4">
                    {article.description}
                  </p>

                  {/* Read More Link */}
                  <a
                    href={article.link}
                    className="article-read-more-link text-cyan-400 text-sm font-normal hover:text-cyan-300 transition-colors"
                  >
                    {article.link}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== Trending Topic ================== */}

      <section className="conversations-articles-section bg-linear-to-br from-gray-900 via-slate-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="conversations-articles-container max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="articles-section-header mb-12 text-center">
            <h2 className="conversations-main-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-normal text-black dark:text-white mb-2">
              Trending <span className="highlight-text">Topics</span>
            </h2>
          </div>

          {/* Articles Grid */}
          <div className="articles-grid-layout grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {TrendingTopics.map((article) => (
              <div
                key={article.id}
                className="conversations-article-card bg-gray-800 rounded-none overflow-hidden shadow-xl"
              >
                {/* Image Section with Overlay */}
                <div className="article-image-container relative h-80 md:h-72 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="article-featured-image w-full h-full object-cover"
                  />

                  {/* Text Overlay on Image */}
                  {/* <div className="article-image-overlay absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h3 className="overlay-main-text text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontWeight: 300 }}>
                      Crafting
                    </h3>
                    <h3 className="overlay-highlight-text text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
                      Tomorrow
                    </h3>
                    <p className="overlay-subtext text-sm text-gray-300">
                      Leaders' perspective on technology
                    </p>
                  </div> */}
                </div>

                {/* Content Section */}
                <div className="article-content-wrapper bg-gray-900 p-6">
                  {/* Article Title */}
                  <h3 className="article-card-title text-xl md:text-2xl font-semibold text-white mb-4">
                    {article.title}
                  </h3>

                  {/* Article Description */}
                  <p className="article-description-text text-sm md:text-base text-gray-400 leading-relaxed mb-6 line-clamp-4">
                    {article.description}
                  </p>

                  {/* Read More Link */}
                  <a
                    href={article.link}
                    className="article-read-more-link text-cyan-400 text-sm font-normal hover:text-cyan-300 transition-colors"
                  >
                    {article.link}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== Resume Tips and HR Insight ================== */}
      <section className="w-full overflow-visible 
                    py-6 sm:py-10 md:py-12 lg:py-16 xl:py-20 
                    px-3 sm:px-4 md:px-6 lg:px-8 
                    bg-gray-50 dark:bg-gray-900 
                    transition-colors duration-300">

        <div className="max-w-screen-2xl mx-auto">

          {/* Main Heading */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                     font-light 
                     text-slate-900 dark:text-white">
              Resume HR &{" "}
              <span className="gradient-heading-text font-medium">
                HR Insights
              </span>
            </h1>
          </div>

          {/* Carousel Box */}
          <div className="rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[3rem] 
                    px-4 py-8 sm:px-6 sm:py-7 md:px-8 md:py-9 
                    lg:px-12 lg:py-12 xl:px-16 xl:py-16 
                    bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700
                    shadow-[0_25px_50px_rgba(0,0,0,0.12)]
                    transition-colors duration-300">

            {/* Slides Container */}
            <div className="relative overflow-visible">
              {carouselItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`${currentIndex === idx ? "grid" : "hidden"
                    } grid-cols-1 lg:grid-cols-12 gap-6 items-center`}
                >

                  {/* Image Column */}
                  <div className="lg:col-span-5 xl:col-span-4">
                    <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 
                              overflow-hidden rounded-xl sm:rounded-2xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center"
                      />

                      {/* Better Dark Overlay */}
                      <div className="absolute inset-0 
                                bg-gradient-to-tr 
                                from-purple-900/10 
                                dark:from-purple-900/30
                                via-transparent to-transparent" />
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-7 xl:col-span-8 
                            flex flex-col justify-center 
                            space-y-4">

                    {/* Category Badge */}
                    <div className="flex items-center gap-2 
                              text-slate-900 dark:text-gray-300 
                              text-sm font-semibold">
                      <span className="block w-10 h-0.5 
                                 bg-slate-900 dark:bg-gray-400"></span>
                      <span>{item.category}</span>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                             font-semibold 
                             text-slate-900 dark:text-white 
                             leading-tight tracking-tight">
                      {item.title}
                    </h2>

                    {/* Date */}
                    <time className="block text-sm md:text-base 
                               text-slate-600 dark:text-gray-400">
                      {item.date}
                    </time>

                    {/* Description */}
                    <p className="text-base md:text-lg 
                            text-slate-700 dark:text-gray-300 
                            leading-relaxed">
                      {item.description}
                    </p>

                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-10">
              <div className="flex items-center justify-center gap-4">

                <button
                  onClick={moveToPrevious}
                  className="flex items-center justify-center 
                       w-12 h-12 md:w-14 md:h-14 
                       border-2 
                       border-slate-900 dark:border-gray-400
                       text-slate-900 dark:text-white
                       rounded-full text-2xl font-bold
                       hover:bg-slate-900 hover:text-white
                       dark:hover:bg-gray-700
                       transition"
                >
                  ‹
                </button>

                <button
                  onClick={moveToNext}
                  className="flex items-center justify-center 
                       w-12 h-12 md:w-14 md:h-14 
                       border-2 
                       border-slate-900 dark:border-gray-400
                       text-slate-900 dark:text-white
                       rounded-full text-2xl font-bold
                       hover:bg-slate-900 hover:text-white
                       dark:hover:bg-gray-700
                       transition"
                >
                  ›
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ======================== Interview Tips & Company Insight ==================== */}

      <section className="min-h-screen w-full 
                    py-7 sm:py-10 md:py-14 lg:py-18 xl:py-24 
                    px-3 sm:px-5 md:px-7 lg:px-9
                    bg-gradient-to-tr 
                    from-orange-50 via-rose-50 to-purple-50
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                    transition-colors duration-500">

        <div className="max-w-screen-2xl mx-auto">

          {/* Section Heading */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl 
                     font-normal 
                     text-gray-900 dark:text-white 
                     mb-2">
              Interview Tips &{" "}
              <span className="highlight-text">
                Company Insights
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl 
                    text-gray-600 dark:text-gray-300 
                    font-medium">
              Explore our Interview Tips & Company Insights
            </p>
          </div>

          {/* Carousel Container */}
          <div className="rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] 
                    lg:rounded-[3.5rem] 
                    p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 
                    bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700
                    shadow-[0_30px_60px_rgba(0,0,0,0.12)]
                    transition-colors duration-300">

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                      gap-6 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12">

              {getCurrentProducts().map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl sm:rounded-3xl 
                       overflow-hidden 
                       bg-gray-50 dark:bg-gray-900
                       shadow-lg 
                       border border-gray-200 dark:border-gray-700
                       hover:border-orange-400
                       transition duration-300"
                >

                  {/* Product Image */}
                  <div className="relative aspect-[4/3] 
                            bg-gradient-to-br 
                            from-gray-200 to-gray-300 
                            dark:from-gray-700 dark:to-gray-800">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge */}
                    <div className="absolute top-4 right-4 
                              bg-amber-500 text-white 
                              px-4 py-2 rounded-full 
                              text-xs sm:text-sm 
                              font-bold uppercase shadow-lg">
                      {product.badge}
                    </div>

                    {/* Stock Label */}
                    <div className="absolute bottom-4 left-4 
                              bg-white/90 dark:bg-gray-800/90 
                              backdrop-blur-sm 
                              text-gray-800 dark:text-gray-200 
                              px-4 py-2 rounded-full 
                              text-xs sm:text-sm font-semibold">
                      {product.stock}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 sm:p-5 md:p-6 
                            space-y-4">

                    {/* Category */}
                    <div className="inline-block 
                              bg-rose-100 dark:bg-rose-900/40 
                              text-rose-700 dark:text-rose-300 
                              px-4 py-2 rounded-full 
                              text-xs sm:text-sm 
                              font-bold uppercase">
                      {product.category}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg sm:text-xl md:text-2xl 
                             font-bold 
                             text-gray-900 dark:text-white 
                             leading-tight">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm md:text-base 
                            text-gray-600 dark:text-gray-300 
                            leading-relaxed line-clamp-3">
                      {product.description}
                    </p>

                    {/* Read More Button */}
                    <Link
                      to={`/ProductDetailPage/${product.id}`}
                      className="w-full 
                           bg-red-500 hover:bg-red-600 
                           dark:bg-red-600 dark:hover:bg-red-700
                           text-white 
                           font-bold 
                           text-sm sm:text-base md:text-lg 
                           py-3 sm:py-4 
                           rounded-xl sm:rounded-2xl 
                           shadow-lg 
                           flex items-center justify-center 
                           transition"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="mt-12">
              <div className="flex items-center justify-center gap-6">

                <button
                  onClick={goToPrevPage}
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20
                       border-2 
                       border-gray-900 dark:border-gray-400
                       text-gray-900 dark:text-white
                       rounded-full 
                       flex items-center justify-center 
                       text-3xl font-black 
                       shadow-xl
                       hover:bg-gray-900 hover:text-white
                       dark:hover:bg-gray-700
                       transition"
                >
                  ‹
                </button>

                <button
                  onClick={goToNextPage}
                  className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20
                       border-2 
                       border-gray-900 dark:border-gray-400
                       text-gray-900 dark:text-white
                       rounded-full 
                       flex items-center justify-center 
                       text-3xl font-black 
                       shadow-xl
                       hover:bg-gray-900 hover:text-white
                       dark:hover:bg-gray-700
                       transition"
                >
                  ›
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FUTURE OF HIRING SECTION ================= */}
      <section className="w-full py-20 px-6 bg-white dark:bg-gray-900" id="future-of-hiring">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Creating the <span className="highlight-text"> Future of Employment</span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-14 leading-relaxed">
            "At GreatHire, we help employers make faster, smarter, and more
            meaningful hiring decisions by combining human knowledge with
            intelligent technology."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Making Wise Hiring Choices
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Improve hiring accuracy and efficiency by utilizing real-time
                data-driven insights that enable recruiters to confidently find
                and engage the right people.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Data-Driven Recruitment
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Utilize modern analytics to ensure a more equitable and
                successful talent acquisition strategy by streamlining hiring
                procedures, increasing productivity, and lowering bias in hiring
                decisions.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Human + AI Collaboration
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Combining human knowledge with AI-driven intelligence to improve
                decision-making and guarantee wiser, more informed results
                without taking the crucial place of human judgment.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Solutions for Scalable Talent
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Integrating AI-driven intelligence with human knowledge to
                enhance decision-making and ensure wiser, more informed outcomes
                without displacing human judgment.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/HiringInsights"
              className="px-8 py-3 inline-block rounded-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
            >
              Explore Hiring Insights
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ARTICLES SECTION ================= */}
      <section className="conversations-section">
        {/* Background Image */}
        <div
          className="conversations-background"
          style={{
            backgroundImage: "url(./971.jpg)", // Replace with your image
          }}
        ></div>

        {/* Dark Overlay */}
        <div className="conversations-overlay"></div>

        {/* Content */}
        <div className="conversations-content">
          <div className="text-content">
            <h2 className="section-title">
              <span className="brand-name" style={{ color: "white" }}>
                Unlock Your Pontential with Great
                <span className="highlight-text">Hire</span>
              </span>
            </h2>

            <p className="section-description">
              For both employers and job seekers, GreatHire.in is your one-stop
              shop. Locate possibilities, submit job applications, and establish
              connections with elite talent. Hiring is more intelligent and
              effective thanks to our resources and insights. We facilitate the
              advancement of careers and allow employers to select the most
              qualified applicants."
            </p>

            <Link
              to="/jobs"
              className="explore-btn inline-flex items-center gap-2"
            >
              Explore all Job Posting
              <span className="arrow transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Job Sign Up ================= */}
      <section className="relative bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[50vh] flex items-center justify-center">
        {/* Decorative Background Blur Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-300 dark:bg-gray-700 opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-300 dark:bg-gray-700 opacity-10 blur-3xl rounded-full"></div>

        {/* Main Content Wrapper */}
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 max-w-5xl mx-auto border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-750 transition-all duration-300">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Join our talent community
            </h1>

            {/* Description Text */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 max-w-4xl">
              Connect with a network of forward-thinking professionals and unlock opportunities tailored to your skills and ambitions. Be the first to hear about new roles, industry insights, and career-defining moments — all in one place.
            </p>

            {/* Call to Action Button */}
            <Link
              to="/HowWeHire"
              className="bg-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full inline-flex items-center gap-3 shadow-lg transition-all duration-300"
            >
              <span>Explore</span>
              <span className="text-xl">▷</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Moin_blog_page;
