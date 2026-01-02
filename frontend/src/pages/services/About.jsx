import React, { useState } from "react";
import { Users, Target, Award, Building2, Briefcase, ChevronRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

// imported to customize the meta tag 
import { Helmet } from "react-helmet-async";

import Silk from "../../components/ui/silk";

//logos from assets folder
import a1townshipImg from "../../assets/clientLogos/a1township.png";
import accenflairImg from "../../assets/clientLogos/accenflair.webp";
import aiedgeImg from "../../assets/clientLogos/aiedge.jpeg";
import alkalineImg from "../../assets/clientLogos/alkaline.png";
import baklavaImg from "../../assets/clientLogos/baklava.avif";
import bandharyglassImg from "../../assets/clientLogos/bandharyglass.png";
import clevernestImg from "../../assets/clientLogos/clevernest.jpg";
import dadusImg from "../../assets/clientLogos/dadus.avif";
import dwlabsImg from "../../assets/clientLogos/dwlabs.jpeg";
import genericsolImg from "../../assets/clientLogos/genericsol.jpeg";
import hrhImg from "../../assets/clientLogos/hrh.jpeg";
import kotaklifeImg from "../../assets/clientLogos/kotaklife.jpg";
import smfibersImg from "../../assets/clientLogos/smfibers.svg";
import sriramfinanceImg from "../../assets/clientLogos/sriramfinance.jpg";
import techmahindraImg from "../../assets/clientLogos/techmahindra.png";
import googleImg from "../../assets/clientLogos/Google.png";
import teleperformanceImg from "../../assets/clientLogos/teleperformance.png";
import vortalsoftImg from "../../assets/clientLogos/vortalsoft.jpg";
import wiproImg from "../../assets/clientLogos/Wipro.svg";
import zeelmediaImg from "../../assets/clientLogos/zeelmedia.png";
import ravirajImg from "../../assets/clientLogos/Raviraj.svg";
import eeshanyaImg from "../../assets/clientLogos/eeshanya.png";
import tataImg from "../../assets/clientLogos/tata.png";

// Import User-Team Photos
//import SujithImg from "../../assets/user_photos/G-Sujith.jpeg";
import NazirImg from "../../assets/user_photos/Nazir.jpeg";
import SujeethImg from "../../assets/user_photos/Sujeeth.jpeg";
import DhanshreeImg from "../../assets/user_photos/Dhanshree.jpeg";
import KOIImg from "../../assets/user_photos/KOI.jpeg";
import MaheshImg from "../../assets/user_photos/Mahesh.jpg";
import MoizImg from "../../assets/user_photos/MoizImg.jpg";
import AmanImg from "../../assets/user_photos/Aman.jpeg";
import eswarImg from "../../assets/user_photos/Eswar.jpeg";
import CharanImg from "../../assets/user_photos/Charan.jpeg";
import nabhayImg from "../../assets/user_photos/Nabhay.jpeg";
import NavaneethImg from "../../assets/user_photos/Navaneeth.jpeg";
import VirendarImg from "../../assets/user_photos/Virendar.jpeg";
import santhoshImg from "../../assets/user_photos/Santhosh.jpeg";
import MounikaImg from "../../assets/user_photos/Mounika.jpeg";
import lahariImg from "../../assets/user_photos/Lahari.jpeg";
import riyaImg from "../../assets/user_photos/Riya.jpeg";
import sushmaImg from "../../assets/user_photos/Sushma.jpeg";
import janakiImg from "../../assets/user_photos/Janki.jpeg";
import madhuImg from "../../assets/user_photos/madhu.jpeg";
import mansiImg from "../../assets/user_photos/Mansi.jpeg";
import tanmaiImg from "../../assets/user_photos/Tanmai.jpeg";
import BlankImg from "../../assets/user_photos/Blank.jpg";
import Gen1Img from "../../assets/user_photos/Gen1.jpeg";
import Gen2Img from "../../assets/user_photos/Gen2.jpeg";
import Gen3Img from "../../assets/user_photos/Gen3.jpeg";
import Gen4Img from "../../assets/user_photos/Gen4.jpeg";
import Gen5Img from "../../assets/user_photos/Gen5.jpeg";
import Gen6Img from "../../assets/user_photos/Gen6.jpeg";
import Gen7Img from "../../assets/user_photos/Gen7.jpeg";
import Gen8Img from "../../assets/user_photos/Gen8.jpeg";
import Gen9Img from "../../assets/user_photos/Gen9.jpeg";
import Gen10Img from "../../assets/user_photos/Gen10.jpeg";
import Gen11Img from "../../assets/user_photos/Gen11.jpeg";
import Gen12Img from "../../assets/user_photos/Gen12.jpeg";
import Gen13Img from "../../assets/user_photos/Gen13.jpeg";
import Gen14Img from "../../assets/user_photos/Gen14.jpeg";
import Gen15Img from "../../assets/user_photos/Gen15.jpg";
import Gen16Img from "../../assets/user_photos/Gen16.jpg";
import Gen17Img from "../../assets/user_photos/Gen17.jpg";
import Gen18Img from "../../assets/user_photos/Gen18.jpg";
import Gen19Img from "../../assets/user_photos/Gen19.jpg";
import RashiImg from "../../assets/user_photos/Rashi.jpg";
import NumberCounter from '@/components/ui/NumberCounter';
import Pratibhaimg from '../../assets/user_photos/Pratibhaimg.jpg';
import Saumya from '../../assets/user_photos/Saumya.jpg';
import Jitendraimg from '../../assets/user_photos/Jitendraimg.jpg'
import sakshiimg from '../../assets/user_photos/sakshi.jpeg';
import swapnil from "../../assets/user_photos/Swapnil.jpeg";
import sam from "../../assets/user_photos/sam.jpeg";
import prasad from "../../assets/user_photos/Prasad.jpeg";
import moin from "../../assets/user_photos/Moins.jpeg";
import krishna from "../../assets/user_photos/Krishna.jpeg";
import afraimg from "../../assets/user_photos/afraimg.jpeg";
import sadaabimg from "../../assets/user_photos/sadaabimg.jpeg";


function App() {
  const [teamSwiper, setTeamSwiper] = useState(null);

  const clientLogos = [
    { name: "Tata", logo: tataImg },
    { name: "Tech Mahindra", logo: techmahindraImg },
    { name: "Wipro", logo: wiproImg },
    { name: "Teleperformance", logo: teleperformanceImg },
    { name: "Google", logo: googleImg },
    { name: "Kotak Life", logo: kotaklifeImg },
    { name: "DWLabs", logo: dwlabsImg },
    { name: "Voralsoft", logo: vortalsoftImg },
    { name: "Sriram Finance", logo: sriramfinanceImg },
    { name: "Raviraj", logo: ravirajImg },
    { name: "A1 Township", logo: a1townshipImg },
    { name: "SM Fibers", logo: smfibersImg },
    { name: "Zeel Media", logo: zeelmediaImg },
    { name: "Accenflair", logo: accenflairImg },
    { name: "Generic Sol", logo: genericsolImg },
    { name: "Bandhary Glass", logo: bandharyglassImg },
    { name: "Alkaline", logo: alkalineImg },
    { name: "AI Edge", logo: aiedgeImg },
    { name: "Clever Nest", logo: clevernestImg },
    { name: "Baklava", logo: baklavaImg },
    { name: "HRH", logo: hrhImg },
    { name: "Dadus", logo: dadusImg },
    { name: "Eeshanya", logo: eeshanyaImg },
  ];

  const departments = [
    {
      name: "Software Developers",
      members: [

        {
          name: "Charan Sai",
          image: CharanImg,
          role: ["Associate AWS Architect", "Full Stack Developer", "AI Engineer"],
          expertise: "Cloud Solutions, DevOps, Web Development",
          about: "Specializes in designing and implementing cloud solutions on AWS.",
        },
        {
          name: "Dhanshree Parab",
          image: DhanshreeImg,
          role: ["Full Stack Developer"],
          expertise: "Web Development, Machine Learning, DJango, MongoDB SQL, Python",
          about: "Skilled with expertise in emerging technologies, crafting high-level websites and applications from core logic to polished interfaces.",
        },
        {
          name: "Aman",
          image: AmanImg,
          role: ["Frontend Developer"],
          expertise: "React, HTML, CSS, JavaScript",
          about: "Skilled in creating responsive and interactive user interfaces, with a focus on performance and user experience.",
        },
        {
          name: "T.Eswar Reddy",
          image: eswarImg,
          role: ["Full Stack Developer", "AI Engineer", "Test Engineer"],
          expertise: "React, Node.js, MongoDB, Express, JavaScript, Python",
          about: "Experienced in building full-stack applications with a focus on user experience and performance.",
        },
        {
          name: "Sujeeth Kumar",
          image: SujeethImg,
          role: ["Information Security Analyst", "Full Stack Developer", "AI Engineer", "Team Lead"],
          expertise: "Web Development, Cyber Security, AWS Cloud",
          about: "Skilled in building scalable web applications with modern technologies and security best practices.",
        },
        {
          name: "Maheswar Reddy",
          image: MaheshImg,
          role: ["Frontend Developer"],
          expertise: "React, HTML, CSS, JavaScript, Node.js, AWS, MongoDB",
          about: "Skilled in creating responsive and interactive user interfaces.",
        },
        {
          name: "Moiz Qureshi",
          image: MoizImg,
          role: ["Full Stack Developer"],
          expertise: "React, Node.js, MongoDB, Express, JavaScript",
          about: "Experienced in building full-stack applications with a focus on user experience and performance.",
        },
        {
          name: "Virender",
          image: VirendarImg,
          role: ["Mern Stack Developer"],
          expertise: "React, Node.js, MongoDB, Express, JavaScript",
          about: "Specialized in building full-stack applications with a focus on user experience and performance.",
        },
        {
          name: "Nazir",
          image: NazirImg,
          role: ["Full Stack Developer"],
          expertise: "React, Node.js, MongoDB, Express, JavaScript, Python, Tailwind CSS",
          about: "Experienced in building full-stack applications with a focus on user experience and performance.",
        },
        {
          name: "Pratibha",
          image: Pratibhaimg,
          role: ["Frontend Developer"],
          expertise: "HTML, CSS, Tailwind, JavaScript, React ",
          about: "Dedicated to crafting seamless web solutions that blend creativity with functionality"
        },
        {
          name: "Saumya",
          image: Saumya,
          role: ["Full Stack Developer"],
          expertise: "HTML, CSS, JavaScript, React, Node.js, Express, MongoDB",
          about: "Full Stack Developer focused on building scalable web applications with clean UI, efficient backend architecture, and real-world problem solving.",
        },
        {
          name: "Sakshi Juwar",
          image: sakshiimg,
          role: "Full Stack Developer",
          expertise: "React.js, Node.js, Express.js, MongoDB, Python, AWS, JavaScript, HTML, CSS, Tailwind CSS, Bootstrap, SQL",
          about: "Passionate Full Stack Developer dedicated to creating efficient and user-friendly web applications that solve real-world problems.",
        },
        {
          name: "Jitendra",
          image: Jitendraimg,
          role: "Full Stack developer",
          expertise: "Frontend",
          about: "Crafts engaging digital journeys that connect and convert audiences",
        },
        {
          name: "Swapnil Marke",
          image: swapnil,
          role: ["Full Stack Developer"],
          expertise: "Java, SpringBoot , HTML, CSS, JavaScript, React, Node.js, Express, MongoDB",
          about:
            "Full Stack Developer focused on building scalable web applications with clean UI, efficient backend architecture, and real-world problem solving.",
        },
        {
          name: "Krishna Gupta",
          image: krishna,
          role: ["Full Stack Developer"],
          expertise: "Java, SpringBoot, React.js, MySQL, HTML, CSS, JavaScript, Bootstrap",
          about:
            "Architecting Scalable Full-Stack Web Solutions with Java Backend and Modern Frontend Technologies",
        },
        {
          name: "Prasad Margaj",
          image: prasad,
          role: ["Full Stack Developer"],
          expertise: "React.js, MySQL, HTML, CSS, JavaScript, Bootstrap, Java, SpringBoot",
          about:
            "Full stack developer skilled in java, spring boot, MySQL, and React.js",
        },
        {
          name: "Moin Shaikh",
          image: moin,
          role: ["Full Stack Developer"],
          expertise: "Java, SpringBoot, React.js, MySQL, HTML, CSS, JavaScript, Bootstrap",
          about:
            "Turning ideas into High-Performance Full-Stack Applications",
        },
        {
          name: "Samdaniel Nadar",
          image: sam,
          role: ["Full Stack Developer"],
          expertise: "Java, SpringBoot, React.js, MySQL, HTML, CSS, JavaScript, Bootstrap",
          about:
            "Crafting Robust Full-Stack Application with Java & React",
        },
      ],
    },
    {
      name: "Human Resources",
      members: [
        {
          name: "Naveneeth",
          image: NavaneethImg,
          role: "Human Resource",
          expertise: "Recruitment, Employee Relations",
          about: "Oversees recruitment and employee relations.",
        },
        {
          name: "Koshistha",
          image: KOIImg,
          role: "Sourcing Specialist",
          expertise: "Talent Sourcing, Networking",
          about: "Focuses on sourcing candidates through various channels.",
        },
        {
          name: "Mounika",
          image: MounikaImg,
          role: "Screening Specialist",
          expertise: "Talent Acquisition, Screening",
          about: "Responsible for screening and shortlisting candidates.",
        },
        {
          name: "Tanmai",
          image: tanmaiImg,
          role: "Hiring Manager",
          expertise: "Recruitment Strategy, Team Leadership, Software Development",
          about: "A strategically driven Hiring Manager who effectively balances technical expertise in software development with recruitment leadership, enabling informed hiring decisions, strong team alignment, and seamless collaboration between technical and non-technical stakeholders. Known for building high-performing teams through structured leadership strategies, talent optimization, and a deep understanding of both business and technology requirements.",
        },
        {
          name: "Lahari",
          image: lahariImg,
          role: "On Boarding Specialist",
          expertise: "Onboarding, Employee Engagement",
          about: "Facilitates onboarding and employee engagement activities.",
        },
        {
          name: "Madhu Sri",
          image: madhuImg,
          role: "Human Resource",
          expertise: "Recruitment, Employee Relations",
          about: "Oversees recruitment and employee relations.",
        },
        {
          name: "Rohit",
          image: Gen17Img,
          role: "Interviewer",
          expertise: "Interviewing, Assessment",
          about: "Conducts interviews and assesses candidates skills.",
        },
        {
          name: "Dikshita",
          image: Gen2Img,
          role: "Hiring Specialist",
          expertise: "Hiring, Team Management",
          about: "Responsible for managing the hiring process and team.",
        },
        {
          name: "Sadaab Hassan",
          image: sadaabimg,
          role: "Human Resource",
          expertise: "Recruitment, Employee Relations",
          about: "Oversees recruitment and employee relations.",
        },
        {
          name: "Afra Tabassum",
          image: afraimg,
          role: "Human Resource",
          expertise: "Recruitment, Employee Relations",
          about: "Oversees recruitment and employee relations.",
        },
      ],
    },
    {
      name: "Digital Marketing",
      members: [
        {
          name: "Vikram",
          image: Gen18Img,
          role: "Digital Marketing Specialist",
          expertise: "SEO, SEM, Content Marketing",
          about: "Ensures Brand vsibility and engagement through digital channels to reach right audience effectively.",
        },
        {
          name: "Alekhya",
          image: Gen3Img,
          role: "Digital Marketing Executive",
          expertise: "Social media strategy, content creation",
          about: "Drives brand growth through creative and data-driven digital campaigns.",
        },
        {
          name: "Darshini",
          image: Gen4Img,
          role: "Digital Marketing Manager",
          expertise: "Content Marketing, conversion rate optimization",
          about: "Delivers high-performing digital solutions through deep performance insights.",
        },
        {
          name: "Anuskha",
          image: Gen5Img,
          role: "Digital Marketing",
          expertise: "Multi-channel marketing, team leadership",
          about: "Builds strong digital brands with scalable, results-oriented plans.",
        },
        {
          name: "Anil",
          image: Gen19Img,
          role: "Content & Digital Marketing Strategist",
          expertise: "Content marketing, email campaigns",
          about: "Crafts engaging digital journeys that connect and convert audiences.",
        },
      ],
    },
    {
      name: "US IT Recruiters",
      members: [
        {
          name: "Sushma",
          image: sushmaImg,
          role: "Technical Recruiter",
          expertise: "Tech Recruitment, Talent Assessment",
          about: "Specializes in recruiting top tech talent.",
        },
        {
          name: "Janki Patel",
          image: janakiImg,
          role: "Talent Acquisition Specialist",
          expertise: "Executive Search, Talent Strategy",
          about: "Focuses on executive and leadership recruitment.",
        },
        {
          name: "Santhosh Kumar",
          image: santhoshImg,
          role: "US IT Recruiter",
          expertise: " Graduate Hiring, University Relations",
          about: "Focuses on strategic hiring pratices, I ensure we attract and retain top talent.",
        },
        {
          name: "Mansi Kargar",
          image: mansiImg,
          role: "Talent Acquisition – US IT Staffing",
          expertise: "International Recruitment, Relocation",
          about: "Focuses on identifying and attracting top talent from around the world.",
        },
        {
          name: "Riya",
          image: riyaImg,
          role: "Recruitment Operations",
          expertise: "Process Optimization, Tools",
          about: "Focuses on streamlining recruitment processes by connecting the right talent with the right opportunities.",
        },
        {
          name: "Rashi sharma",
          image: RashiImg,
          role: "Technical Recruiter",
          expertise: "Tech Recruitment, Talent Assessment",
          about: "Specializes in recruiting top tech talent.",
        },
      ],
    },
    {
      name: "Sales and Marketing",
      members: [
        {
          name: "Chirag",
          image: Gen16Img,
          role: "Sales Manager",
          expertise: "B2B Sales, Account Management, campaign strategy",
          about: "Focused on driving business growth through marketing strategies, client relationships, and sales initiatives.",
        },
        {
          name: "Divya",
          image: Gen6Img,
          role: "Sales Executive",
          expertise: "Solution Sales, Negotiations",
          about: "Involves into creating impactful marketing campaigns, fostering client relationship, and ensuring services stand out in competitive market.",
        },
        {
          name: "Riya",
          image: Gen12Img,
          role: "Sales and Marketing",
          expertise: "Market Research, Lead Generation",
          about: "Conducts market research and generates leads for sales.",
        },
        {
          name: "Anita Sharma",
          image: Gen8Img,
          role: "Sales and Marketing Executive",
          expertise: "Lead generation, client relationship management",
          about: " Passionate about driving growth through smart sales strategies and engaging marketing campaigns.",
        },
        {
          name: "Aditi Mishra",
          image: Gen9Img,
          role: " Digital Marketing & Sales Strategist",
          expertise: "SEO, content marketing, email campaigns",
          about: "Blends creativity and analytics to turn prospects into loyal customers.",
        },
        {
          name: "Tanaya Suchak",
          image: Gen10Img,
          role: "Sales Representative & Marketing Coordinator",
          expertise: "Customer engagement, promotional planning",
          about: "Committed to delivering value by connecting the right product to the right audience.",
        },
      ],
    },
    {
      name: "Bench Sales Recruiters",
      members: [
        {
          name: "Neha",
          image: Gen11Img,
          role: "Bench Sales Specialist",
          expertise: "B2B Sales, Account Management",
          about: "Leads bench sales and client relationship management.",
        },
        {
          name: "Babitha",
          image: Gen2Img,
          role: "Bench Sales Recruiter",
          expertise: "Marketing IT consultants to clients and vendors, handling Negotiations",
          about: "Efficient in building vendor relationships and placing bench candidates across various technologies.",
        },
        {
          name: "Cherry",
          image: Gen3Img,
          role: "US IT Bench Sales Executive",
          expertise: "Expertise in sourcing requirements, closing deals with implementation",
          about: "Proven ability to place consultants quickly through strong networking and communication skills.",
        },
        {
          name: "Dakshitha",
          image: Gen4Img,
          role: "Technical Bench Sales Specialist",
          expertise: "Skilled in promoting bench candidates, resume formatting",
          about: "Focused on maximizing consultant utilization and aligning talent with the right opportunities.",
        },
        {
          name: "Gunjana",
          image: Gen5Img,
          role: "IT Bench Sales Executive",
          expertise: "Candidate profiling, vendor networking",
          about: "Skilled in accelerating consultant placements by building long-term vendor relationships.",
        },
      ],
    },
    {
      name: "Business development",
      members: [
        {
          name: "Nabhy Singh",
          image: nabhayImg,
          role: "Business Development Specialist",
          expertise: "Lead generation, strategic partnerships",
          about: "Passionate about driving business growth through meaningful client relationships.",
        },
        {
          name: "Mani kumar",
          image: Gen15Img,
          role: "Business Development Manager",
          expertise: "Lead generation, client relationship management",
          about: "Specilized in business expansion by levaraging marketing insights and innovative sales strategies.",
        },
        {
          name: "Dharshini",
          image: Gen5Img,
          role: "Business Development",
          expertise: "Process Management, Analytics",
          about: "Excelled in client engagement and negotation strageries, leading to the successful deals and strong client relationships.",
        },
        {
          name: "Shobita",
          image: Gen13Img,
          role: "Business Development Executive",
          expertise: "Market Expansion, Partnerships",
          about: "Works towards conducting market research and implementing innovative sales strategies to drive business growth in greathire.",
        },
        {
          name: "Aina",
          image: Gen1Img,
          role: "Business Development Associate",
          expertise: "Account Management, Growth",
          about: "Ensures client satisfaction and retention.",
        },
      ],
    },
  ];

  const achievements = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      value: 500,
      suffix: "+",
      description: "Successful Placements",
      duration: 1500,
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      value: 98,
      suffix: "%",
      description: "Client Satisfaction",
      duration: 1500,
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      value: 28,
      suffix: "+",
      description: "Industry Awards",
      duration: 1500,
    },
    {
      icon: <Building2 className="w-8 h-8 text-white" />,
      value: 573,
      suffix: "+",
      description: "Partner Companies",
      duration: 1500,
    },
  ];

  const services = [
    {
      icon: <Briefcase className="w-7 h-7" />,
      title: "Job Matching",
      description: "AI-powered job matching system connecting the right talent with the right opportunities",
    },
    {
      icon: <Users className="w-7 h-7 " />,
      title: "Talent Assessment",
      description: "Comprehensive skill assessment and verification process",
    },
    {
      icon: <Building2 className="w-7 h-7" />,
      title: "Corporate Solutions",
      description: "Customized hiring solutions for enterprises",
    },
  ];

  const leadership = [
    {
      name: "BABDE SANKET",
      title: "Founder & CEO",
      image: "Sanketsir.jpeg",
      description: "Sanket Babde has been the driving force behind greathire.in and Babde Private Limited since 2017, With a vision to revolutionize IT services. Under his leadership, the company has grown into a trusted platform for AI-driven recruitment, software development, digital marketing, and IT staffing solutions.",
      achievements: [
        "Simplified Hiring for Businesses – Developed a recruitment platform that helps companies streamline their hiring process efficiently.",
        "Achieved 500% Growth in 9 Years – Expanded from a startup to a trusted recruitment partner for businesses across industries.",
        "Built Strong Employer & Candidate Connections – Successfully facilitated thousands of job placements by bridging the gap between recruiters and job seekers.",
        "Recognized for Industry Impact – Featured among emerging leaders in IT tech for driving innovation in modern recruitment solutions.",
      ],
      vision: "To create a recruitment ecosystem that prioritizes both technical excellence and cultural fit, ensuring sustainable growth for companies and fulfilling careers for professionals."
    },
    {
      name: "BABDE SONIKA",
      image: "Sonikamam.jpeg",
      title: "Director of Human Resources Operations",
      description: "Sonika Babde is a dynamic leader in human resources and organizational development, playing a crucial role in shaping HR operations at Great Hire. With a strong commitment to innovation and inclusivity, she has been instrumental in creating a culture that values diversity and empowers employees to thrive.",
      achievements: [
        "Designed and implemented Great Hire's proprietary AI-driven talent matching system, revolutionizing recruitment efficiency and accuracy.",
        "Previously served as a experience in technology-driven HR solutions.",
        "Data-Driven Decision Making: Leveraged advanced analytics to refine hiring strategies, improving workforce planning and talent acquisition outcomes.",
        "Employee-Centric HR Policies: Developed comprehensive policies fostering inclusivity, employee engagement, and long-term retention in the organization. ",
      ],
      vision: "Sonika envisions a future where technology not only enhances hiring efficiency but also promotes fairness and effectiveness in recruitment. She is dedicated to leveraging cutting-edge innovations to create hiring practices that benefit both employers and job seekers, ensuring a more equitable and dynamic job market."
    }
  ];

  const [isCenter, setIsCenter] = useState(false);

  const allTeamMembers = departments.flatMap((dept) =>
    dept.members.map((member) => ({
      ...member,
      department: dept.name,
    }))
  );

  const [activeIndex, setActiveIndex] = useState(0);

  return (

    <>

      <Helmet>
        <title>About GreatHire | AI-Driven Recruitment & IT Staffing Company in Hyderabad</title>

        <meta
          name="description"
          content="GreatHire is a leading AI-driven recruitment, IT staffing, and workforce solutions company delivering high-impact hiring results for businesses and professionals. Headquartered in Hyderabad, Telangana State, GreatHire empowers organizations with smart talent acquisition, digital transformation, and scalable staffing strategies. Our expert team combines advanced technology with human insight to connect top-tier talent with innovative companies across industries."
        />
      </Helmet>


      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:bg-gray-800 dark:text-white transition-colors duration-300 mt-16"> {/* added margin*/}
        <Navbar />

        {/* Hero Section - Enhanced */}
        <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-b from-blue-300 to-blue-600 shadow-2xl">
          {/* <div className="absolute inset-0">
            <Silk
              speed={5}
              scale={1}
              color="#6366f1ff"
              noiseIntensity={1.5}
              rotation={0}
            />
          </div> */}

          {/* Enhanced Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-white h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="max-w-4xl mx-auto text-center space-y-5">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-2 animate-fade-in">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">About Our Journey</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-[Oswald] tracking-tight">
                  About <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 bg-clip-text text-transparent">GreatHire</span>
                </h1>
                <p className="text-lg md:text-xl font-serif text-blue-50 leading-relaxed px-4">
                  GreatHire Business Solutions provides strategic staffing and
                  workforce solutions tailored to meet diverse business needs. We
                  specialize in connecting companies with top-tier talent, driving
                  efficiency, productivity, and long-term success through our expert
                  recruitment services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <section className="max-w-7xl mx-auto px-6 py-16"> */}
        {/* Heading */}

        {/* <div className=" mb-10">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight">
              <span className="text-6xl">Great</span>
              <span className="text-blue-500 text-6xl">Hire </span>
              is Business Solutions connects companies with top talent, driving
              efficiency, productivity, and long-term success.
            </h1>
          </div> */}

        {/* Image */}
        {/* <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src="AboutusBanner.png"
              alt="Real estate team meeting"
              className="w-full h-[500px] object-cover"
            />
          </div> */}

        {/* Content */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-14">
            <h2 className="text-3xl font-semibold text-gray-900">
              “The right job won’t just hire your skills—
              <br />
              it will value your potential.”
            </h2>
          </div> */}
        {/* </section> */}

        {/* Our Mission Section - Enhanced */}
        <div className="">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          {/* <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Our Purpose</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[Oswald] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Our Mission
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-blue-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                  At GreatHire, our mission is to revolutionize the recruitment landscape by bridging the gap between exceptional talent and innovative companies. We believe in creating meaningful connections that drive career growth and business success through cutting-edge technology and human-centric approaches.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-4 transition-all duration-300">
                  <span>Driving excellence in recruitment</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Leadership Section - Enhanced */}
        <div className="">
          {/* Decorative elements */}
          <div className=""></div>
          <div className=""></div>

          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16 mt-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Leadership Excellence</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-[Oswald] bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Our Leadership
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {leadership.map((leader, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Enhanced page curl */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 via-purple-100 to-white dark:from-blue-900 dark:via-purple-900 dark:to-gray-800 [clip-path:polygon(100%_0,0_0,100%_100%)] shadow-lg"></div>
                  </div>

                  <div className="relative z-10 p-10">
                    {/* Leader initial badge */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                      {/* Profile Image */}
                      <img
                        src={leader.image} // path relative to public folder
                        alt={leader.name}
                        className="relative w-full h-full rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-lg"
                      />
                    </div>

                    <h3 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {leader.name}
                    </h3>

                    <div className="text-center mb-6">
                      <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full">
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          {Array.isArray(leader.title)
                            ? leader.title.map((t, i) => <div key={i}>{t}</div>)
                            : leader.title}
                        </p>
                      </div>
                    </div>

                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-8"></div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-center">
                      {leader.description}
                    </p>

                    {/* Achievements */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-6">
                      <h4 className="text-lg font-bold mb-4 text-blue-800 dark:text-blue-300 font-[Oswald] flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-3">
                        {leader.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-2 flex-shrink-0"></div>
                            <span className="text-sm leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Vision */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6">
                      <h4 className="text-lg font-bold mb-3 text-purple-800 dark:text-purple-300 font-[Oswald] flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Vision
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
                        {leader.vision}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story Section - Enhanced */}
        <div className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Our Journey</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-[Oswald] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Our Story
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  "Founded in 2016, GreatHire emerged from a simple yet powerful vision: to transform how companies and talent connect in the digital age. What began as a startup with a handful of passionate individuals has grown into a dynamic platform serving thousands of businesses and job seekers across India.",
                  "Our journey has been marked by continuous innovation, from developing AI-powered matching algorithms to creating comprehensive assessment tools that look beyond just technical skills. We helped over 10,000 professionals find their dream jobs and assisted countless companies in building strong, diverse teams.",
                  "Today, we're proud to be one of India's fastest-growing recruitment platforms, but our mission remains the same: to create meaningful connections that drive careers and businesses forward."
                ].map((text, index) => (
                  <div
                    key={index}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-gray-700/50 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1 pt-2">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section - Enhanced */}
        <div className="py-10 bg-white dark:bg-gray-800 relative overflow-hidden"> {/* py-20 to py-10 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-900/10"></div>

          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Milestones</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-[Oswald] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Achievements
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((a, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {a.icon}
                      </div>
                    </div>

                    <h3 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      <NumberCounter end={a.value} duration={a.duration} suffix={a.suffix} />
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-center font-medium">
                      {a.description}
                    </p>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-3xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Logo Carousel - Enhanced */}
        <div className="py-10 bg-gradient-to-b from-gray-50 to-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
                <Building2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">Our Partners</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-[Oswald] bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Trusted By Leading Companies
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Partnering with industry leaders to deliver exceptional talent solutions
              </p>
            </div>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={2}
              loop={true}
              speed={2000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
              }}
              breakpoints={{
                0: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 6 },
                1024: { slidesPerView: 8 },
              }}
              className="py-4"
            >
              {clientLogos.map((client, index) => (
                <SwiperSlide key={index}>
                  <div className="group flex items-center justify-center h-28 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>


        {/* Team Section - Enhanced */}
        {/* Team Section - Single Fast Continuous Carousel */}
        <div className="relative py-8 bg-gradient-to-b from-white to-gray-50 dark:bg-gray-800 ">
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div className="relative z-10   ">
            {/* HEADER */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 px-4 py-2 rounded-full mb-6">
                <Users className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                  Our People
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold font-[Oswald] bg-gradient-to-br from-yellow-800 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
                Meet Our Team
              </h2>

              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto ">
                Dedicated professionals committed to your success
              </p>
            </div>

            {/* CAROUSEL WRAPPER */}
            <div className="relative w-full ">
              <div className="flex items-center w-full">
                <div className=" [&_.swiper-wrapper]:!transition-linear w-full">
                  <Swiper
                    className="h-[400px] mt-2"
                    modules={[Autoplay]}
                    loop
                    centeredSlides
                    slidesPerView="auto"
                    spaceBetween={60}
                    speed={1500}
                    autoplay={{
                      delay: 0,
                      disableOnInteraction: false,
                    }}
                    allowTouchMove={false}
                    onSwiper={setTeamSwiper}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  >
                    {allTeamMembers.map((member, index) => {
                      const isActive = index === activeIndex;

                      return (
                        <SwiperSlide
                          key={index}
                          className="!w-[260px] flex justify-center"
                        >
                          <div
                            onMouseEnter={() => teamSwiper?.autoplay.stop()}
                            onMouseLeave={() => teamSwiper?.autoplay.start()}
                            className={`flex flex-col items-center text-center transition-all duration-500
                  ${isActive ? "scale-103" : "scale-90 opacity-75"}
                `}
                          >
                            {/* IMAGE WITH ARC */}
                            <div className="relative mb-6">
                              <div
                                className={`w-40 h-40 rounded-full p-2 transition-all duration-500
                      ${isActive
                                    ? "bg-[conic-gradient(#f59e0b_0deg,transparent_120deg,#f59e0b_360deg)]"
                                    : "bg-[conic-gradient(#2563eb_0deg,transparent_120deg,#2563eb_360deg)]"
                                  }
                    `}
                              >
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-full h-full rounded-full object-cover bg-white"
                                />
                              </div>
                            </div>

                            {/* TEXT */}
                            <h4 className="text-xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {member.name}
                            </h4>
                            <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-1 rounded-full">
                              <p className="text-sm font-semibold text-blue-600 ">
                                {member.role}
                              </p>
                            </div>

                            <p className="text-xs text-black-300 mt-2 max-w-[200px] dark:text-black">
                              {member.about}
                            </p>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;
