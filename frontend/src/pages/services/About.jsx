import React, { useState } from "react";
import { Users, Target, Award, Building2, Briefcase, ChevronRight, Sparkles, Crown, BadgeCheck, Linkedin } from 'lucide-react';
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
      about: "An Associate AWS Architect and Full Stack Developer specializing in scalable cloud-native solutions. Experienced in AWS deployments, DevOps automation, and secure infrastructure design. Skilled in building modern web applications with optimized backend systems. Passionate about integrating AI-driven technologies into high-performance cloud environments.",
      isTopPerformer: true,
    },
    {
      name: "Dhanshree Parab",
      image: DhanshreeImg,
      role: ["Full Stack Developer"],
      expertise: "Web Development, Machine Learning, DJango, MongoDB SQL, Python",
      about: "A Full Stack Developer skilled in Django, Python, MongoDB, and SQL. Experienced in developing data-driven web applications and integrating machine learning models. Strong in database design and backend optimization. Focused on building scalable and maintainable digital solutions.",
    },
    {
      name: "Aman",
      image: AmanImg,
      role: ["Frontend Developer"],
      expertise: "React, HTML, CSS, JavaScript",
      about: "A Frontend Developer proficient in React, HTML, CSS, and JavaScript. Skilled in creating responsive and user-friendly interfaces. Strong understanding of UI/UX principles and performance optimization. Dedicated to delivering seamless digital experiences.",
    },
    {
      name: "T.Eswar Reddy",
      image: eswarImg,
      role: ["Full Stack Developer", "AI Engineer", "Test Engineer"],
      expertise: "React, Node.js, MongoDB, Express, JavaScript, Python",
      about: "A Full Stack Developer and AI Engineer experienced in building end-to-end web applications. Skilled in MERN stack development and backend API integration. Strong in authentication systems and database management. Focused on delivering reliable and high-performance applications.",
      isTopPerformer: true,
    },
    {
      name: "Sujeeth Kumar",
      image: SujeethImg,
      role: ["Information Security Analyst", "Full Stack Developer", "AI Engineer", "Team Lead"],
      expertise: "Web Development, Cyber Security, AWS Cloud",
      about: "An Information Security Analyst and Full Stack Developer with expertise in cybersecurity and AWS cloud solutions. Experienced in building secure and scalable web systems. Strong leadership skills in managing technical teams. Committed to delivering enterprise-grade and secure digital platforms.",
      isTopPerformer: true,
    },
    {
      name: "Maheswar Reddy",
      image: MaheshImg,
      role: ["Frontend Developer"],
      expertise: "React, HTML, CSS, JavaScript, Node.js, AWS, MongoDB",
      about: "A Frontend Developer skilled in React and modern JavaScript technologies. Experienced in integrating APIs and cloud-based services. Strong focus on UI performance and scalability. Dedicated to building intuitive and high-performing interfaces.",
    },
    {
      name: "Moiz Qureshi",
      image: MoizImg,
      role: ["Full Stack Developer"],
      expertise: "React, Node.js, MongoDB, Express, JavaScript",
      about: "A MERN Stack Developer experienced in building scalable web applications. Skilled in RESTful API design and efficient database structuring. Strong in frontend-backend integration and authentication systems. Passionate about delivering optimized and maintainable solutions.",
      isTopPerformer: true,
    },
    {
      name: "Virender",
      image: VirendarImg,
      role: ["Mern Stack Developer"],
      expertise: "React, Node.js, MongoDB, Express, JavaScript",
      about: "A MERN Stack Developer specializing in full-stack application development. Skilled in building dynamic frontends and scalable backend systems. Strong in MongoDB and Express framework integration. Focused on delivering secure and reliable web solutions.",
    },
    {
      name: "Nazir",
      image: NazirImg,
      role: ["Full Stack Developer"],
      expertise: "React, Node.js, MongoDB, Express, JavaScript, Python, Tailwind CSS",
      about: "A Full Stack Developer experienced in React, Node.js, and Python technologies. Skilled in building modern UI components using Tailwind CSS. Strong in backend API development and database architecture. Passionate about clean code and scalable application design.",
    },
    {
      name: "Pratibha",
      image: Pratibhaimg,
      role: ["Frontend Developer"],
      expertise: "HTML, CSS, Tailwind, JavaScript, React",
      about: "A Frontend Developer specializing in responsive and modern web design. Skilled in React and Tailwind CSS for interactive UI development. Strong understanding of usability and performance optimization. Dedicated to delivering engaging digital experiences.",
    },
    {
      name: "Saumya",
      image: Saumya,
      role: ["Full Stack Developer"],
      expertise: "HTML, CSS, JavaScript,Node.js, Express",
      about: "A Full Stack Developer experienced in MERN stack development. Skilled in building responsive frontends and efficient backend systems. Strong in REST APIs and authentication implementation. Focused on delivering performance-driven web applications.",
    },
    {
      name: "Sakshi Juwar",
      image: sakshiimg,
      role: "Full Stack Developer",
      expertise: "React.js, Node.js, Express.js, MongoDB, Python, JavaScript, HTML, CSS, Tailwind CSS, Bootstrap, SQL",
      about: "Full-stack Developer specializing in React, Tailwind CSS, Bootstrap, Node.js, and MongoDB. Experienced in building scalable web applications and job portal platforms with optimized performance and clean UI/UX. Skilled in RESTful API development, AWS cloud storage integration, and version control using Git and GitHub, with a strong foundation in modern web technologies and problem-solving.",
      isTopPerformer: true,
    },
    {
      name: "Jitendra",
      image: Jitendraimg,
      role: "Full Stack Developer",
      expertise: "React.js, Node.js, Express.js, MongoDB, Python, Django,JavaScript, HTML, CSS, Tailwind CSS, Bootstrap, SQL",
      about: "Results-driven Full Stack Developer with expertise in React.js, Node.js, and Django-based application development. Experienced in designing secure backend architectures, scalable APIs, and optimized database systems. Committed to delivering enterprise-grade, high-performance web solutions aligned with business objectives.",
      isTopPerformer: true,
    },
    {
      name: "Swapnil Marke",
      image: swapnil,
      role: ["Full Stack Developer"],
      expertise: "Java, SpringBoot , HTML, CSS, JavaScript, React, Node.js, Express, MongoDB",
      about: "A Full Stack Developer with expertise in Java and Spring Boot backend systems. Experienced in building secure APIs and scalable web applications. Skilled in React-based frontend development and system integration. Committed to delivering high-performance software solutions.",
    },
    {
      name: "Krishna Gupta",
      image: krishna,
      role: ["Full Stack Developer"],
      expertise: "Java, SpringBoot, React.js, MySQL, HTML, CSS, JavaScript, Bootstrap",
      about: "A Full Stack Developer specializing in Java backend and React frontend development. Skilled in MySQL database management and REST API design. Strong in responsive UI implementation. Focused on building scalable and maintainable enterprise applications.",
    },
    {
      name: "Prasad Margaj",
      image: prasad,
      role: ["Full Stack Developer"],
      expertise: "React.js, MySQL, HTML, CSS, JavaScript, Bootstrap, Java, SpringBoot",
      about: "A Full Stack Developer experienced in Java Spring Boot and React.js development. Skilled in backend services and dynamic UI creation. Strong in MySQL database integration and API connectivity. Dedicated to delivering reliable and business-focused solutions.",
    },
    {
      name: "Moin Shaikh",
      image: moin,
      role: ["Full Stack Developer"],
      expertise: "Java, SpringBoot, React.js, MySQL, HTML, CSS, JavaScript, Bootstrap",
      about: "A Full Stack Developer skilled in Java and React-based application development. Experienced in backend services using Spring Boot and MySQL optimization. Strong in frontend responsiveness and API integration. Focused on building scalable and secure applications.",
    },
    {
      name: "Samdaniel Nadar",
      image: sam,
      role: ["Full Stack Developer"],
      expertise: "Java, SpringBoot, React.js, MySQL, HTML, CSS, JavaScript, Bootstrap",
      about: "A Full Stack Developer proficient in Java and React technologies. Experienced in building scalable backend systems and responsive frontends. Strong in database management and RESTful API integration. Committed to delivering structured and secure web solutions.",
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
      about: "An HR professional experienced in end-to-end recruitment and employee relations. Skilled in sourcing, screening, and onboarding candidates efficiently. Strong understanding of HR policies and compliance standards. Focused on building a positive and productive workplace culture.",
    },
    {
      name: "Koshistha",
      image: KOIImg,
      role: "Sourcing Specialist",
      expertise: "Talent Sourcing, Networking",
      about: "A Sourcing Specialist skilled in identifying and attracting qualified candidates across platforms. Experienced in talent pipeline development and market research. Strong networking and recruitment tool expertise. Focused on delivering timely and quality hiring solutions.",
    },
    {
      name: "Mounika",
      image: MounikaImg,
      role: "Screening Specialist",
      expertise: "Talent Acquisition, Screening",
      about: "A Screening Specialist experienced in evaluating profiles and conducting initial interviews. Skilled in assessing technical and behavioral competencies. Strong understanding of hiring standards and shortlisting processes. Dedicated to improving screening accuracy and efficiency.",
      isTopPerformer: true,
    },
    {
      name: "Tanmai",
      image: tanmaiImg,
      role: ["Hiring Manager", "Talent & Technology Strategy Leader"],
      expertise: "Technical Leadership, Talent Strategy, Organizational Scaling",
      verified: true,
      leadership: true,
      highlight: "Architect of High-Impact, Growth-Driven Tech Teams",
      about: "A visionary Hiring Leader with strong technical expertise and strategic recruitment leadership. Experienced in building scalable hiring systems aligned with business growth. Skilled in developing high-impact talent strategies that drive innovation and operational excellence. Focused on building future-ready teams and leadership pipelines. Committed to transforming hiring into a strategic driver of organizational success.",
    },
    {
      name: "Lahari",
      image: lahariImg,
      role: "On Boarding Specialist",
      expertise: "Onboarding, Employee Engagement",
      about: "An Onboarding Specialist ensuring smooth employee integration and documentation processes. Skilled in engagement initiatives and cross-team coordination. Strong understanding of compliance and HR best practices. Focused on enhancing employee experience from day one.",
      isTopPerformer: true,
    },
    {
      name: "Madhu Sri",
      image: madhuImg,
      role: "Human Resource",
      expertise: "Recruitment, Employee Relations",
      about: "An HR professional experienced in recruitment coordination and employee support. Skilled in interview scheduling and HR documentation. Strong understanding of workplace policies and compliance. Focused on maintaining smooth HR operations.",
    },
    {
      name: "Rohit",
      image: Gen17Img,
      role: "Interviewer",
      expertise: "Interviewing, Assessment",
      about: "An Interviewer experienced in structured technical and behavioral assessments. Skilled in competency-based evaluation and candidate feedback. Strong understanding of fair hiring practices. Focused on identifying top-performing and culturally aligned talent.",
    },
    {
      name: "Dikshita",
      image: Gen2Img,
      role: "Hiring Specialist",
      expertise: "Hiring, Team Management",
      about: "A Hiring Specialist managing end-to-end recruitment workflows. Skilled in team coordination and workforce planning. Strong understanding of recruitment analytics and process optimization. Focused on aligning hiring decisions with business objectives.",
    },
    {
      name: "Sadaab Hassan",
      image: sadaabimg,
      role: "Human Resource",
      expertise: "Recruitment, Employee Relations",
      about: "An HR specialist experienced in recruitment operations and candidate engagement. Skilled in onboarding coordination and HR documentation. Strong understanding of compliance and communication processes. Focused on strengthening hiring pipelines and retention strategies.",
    },
    {
      name: "Afra Tabassum",
      image: afraimg,
      role: "Human Resource",
      expertise: "Recruitment, Employee Relations",
      about: "An HR professional focused on talent acquisition and employee coordination. Skilled in interview management and recruitment databases. Strong in structured hiring workflows and compliance standards. Dedicated to supporting sustainable organizational growth.",
      isTopPerformer: true,
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
      about: "A Digital Marketing Specialist skilled in SEO, SEM, and content strategies. Experienced in improving search rankings and brand visibility. Strong in campaign optimization and performance analytics. Focused on delivering measurable digital growth.",
    },
    {
      name: "Alekhya",
      image: Gen3Img,
      role: "Digital Marketing Executive",
      expertise: "Social media strategy, content creation",
      about: "A Digital Marketing Executive experienced in social media strategy and content development. Skilled in audience engagement and campaign tracking. Strong understanding of brand positioning. Focused on building consistent digital presence.",
    },
    {
      name: "Darshini",
      image: Gen4Img,
      role: "Digital Marketing Manager",
      expertise: "Content Marketing, conversion rate optimization",
      about: "A Digital Marketing Manager specializing in content strategy and CRO. Experienced in managing performance-driven campaigns. Skilled in ROI analysis and marketing leadership. Focused on maximizing engagement and conversions.",
    },
    {
      name: "Anuskha",
      image: Gen5Img,
      role: "Digital Marketing",
      expertise: "Multi-channel marketing, team leadership",
      about: "A Digital Marketing professional experienced in multi-channel campaigns. Skilled in team coordination and performance optimization. Strong understanding of engagement metrics. Focused on scalable brand growth strategies.",
    },
    {
      name: "Anil",
      image: Gen19Img,
      role: "Content & Digital Marketing Strategist",
      expertise: "Content marketing, email campaigns",
      about: "A Content Strategist experienced in email campaigns and audience engagement. Skilled in automation and conversion funnels. Strong blend of creativity and analytics. Focused on driving measurable marketing success.",
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
      about: "A Technical Recruiter specializing in sourcing and evaluating IT professionals. Experienced in full-cycle recruitment for US-based technical roles. Skilled in candidate assessment and stakeholder coordination. Focused on delivering quality hires within tight timelines.",
      isTopPerformer: true,
    },
    {
      name: "Janki Patel",
      image: janakiImg,
      role: "Talent Acquisition Specialist",
      expertise: "Executive Search, Talent Strategy",
      about: "A Talent Acquisition Specialist experienced in executive and leadership hiring. Skilled in workforce planning and strategic talent mapping. Strong in stakeholder communication and recruitment analytics. Focused on building strong leadership pipelines.",
      isTopPerformer: true,
    },
    {
      name: "Santhosh Kumar",
      image: santhoshImg,
      role: "US IT Recruiter",
      expertise: "Graduate Hiring, University Relations",
      about: "A US IT Recruiter experienced in graduate hiring and university partnerships. Skilled in building campus recruitment pipelines and early talent strategies. Strong understanding of US IT staffing requirements. Focused on attracting emerging technology talent.",
      isTopPerformer: true,
    },
    {
      name: "Mansi Kargar",
      image: mansiImg,
      role: "Talent Acquisition – US IT Staffing",
      expertise: "International Recruitment, Relocation",
      about: "A Talent Acquisition professional specializing in US IT staffing and global recruitment. Skilled in sourcing international candidates and managing compliance processes. Strong in client coordination and niche hiring. Focused on delivering qualified talent efficiently.",
    },
    {
      name: "Riya",
      image: riyaImg,
      role: "Recruitment Operations",
      expertise: "Process Optimization, Tools",
      about: "A Recruitment Operations specialist focused on streamlining hiring workflows. Skilled in ATS management and recruitment analytics. Strong in improving process efficiency and reporting. Dedicated to enhancing overall recruitment productivity.",
    },
    {
      name: "Rashi sharma",
      image: RashiImg,
      role: "Technical Recruiter",
      expertise: "Tech Recruitment, Talent Assessment",
      about: "A Technical Recruiter experienced in sourcing IT professionals for US markets. Skilled in technical screening and cultural fit evaluation. Strong understanding of emerging technologies and staffing trends. Focused on delivering timely and quality placements.",
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
      about: "A Sales Manager experienced in driving B2B growth and strategic account management. Skilled in revenue planning and contract negotiations. Strong in client acquisition and retention strategies. Focused on expanding market presence and profitability.",
    },
    {
      name: "Divya",
      image: Gen6Img,
      role: "Sales Executive",
      expertise: "Solution Sales, Negotiations",
      about: "A Sales Executive specializing in solution-based selling and negotiations. Skilled in understanding client needs and delivering tailored solutions. Strong in relationship management and closing deals. Focused on achieving consistent sales targets.",
    },
    {
      name: "Riya",
      image: Gen12Img,
      role: "Sales and Marketing",
      expertise: "Market Research, Lead Generation",
      about: "A Sales and Marketing professional skilled in market research and lead generation. Experienced in identifying new business opportunities. Strong in campaign coordination and client engagement. Focused on driving revenue growth.",
    },
    {
      name: "Anita Sharma",
      image: Gen8Img,
      role: "Sales and Marketing Executive",
      expertise: "Lead generation, client relationship management",
      about: "A Sales and Marketing Executive experienced in generating qualified leads. Skilled in client relationship management and promotional strategies. Strong understanding of customer lifecycle management. Focused on measurable business growth.",
    },
    {
      name: "Aditi Mishra",
      image: Gen9Img,
      role: "Digital Marketing & Sales Strategist",
      expertise: "SEO, content marketing, email campaigns",
      about: "A Digital Marketing and Sales Strategist blending creativity with analytics. Skilled in SEO, content marketing, and conversion optimization. Strong understanding of customer journey mapping. Focused on turning prospects into loyal clients.",
    },
    {
      name: "Tanaya Suchak",
      image: Gen10Img,
      role: "Sales Representative & Marketing Coordinator",
      expertise: "Customer engagement, promotional planning",
      about: "A Sales Representative and Marketing Coordinator skilled in client engagement and promotional planning. Experienced in managing sales pipelines and marketing initiatives. Strong in customer communication. Focused on strengthening brand presence and loyalty.",
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
      about: "A Bench Sales Specialist experienced in marketing IT consultants to vendors and clients. Skilled in B2B negotiations and contract management. Strong understanding of US staffing processes. Focused on maximizing consultant placements and revenue.",
    },
    {
      name: "Babitha",
      image: Gen2Img,
      role: "Bench Sales Recruiter",
      expertise: "Marketing IT consultants to clients and vendors, handling Negotiations",
      about: "A Bench Sales Recruiter skilled in consultant marketing and vendor coordination. Experienced in handling negotiations and resume positioning. Strong understanding of US IT requirements. Focused on increasing placement opportunities.",
    },
    {
      name: "Cherry",
      image: Gen3Img,
      role: "US IT Bench Sales Executive",
      expertise: "Expertise in sourcing requirements, closing deals with implementation",
      about: "A US IT Bench Sales Executive experienced in sourcing requirements and closing deals. Skilled in vendor networking and consultant marketing. Strong understanding of staffing workflows. Focused on quick turnaround placements.",
    },
    {
      name: "Dakshitha",
      image: Gen4Img,
      role: "Technical Bench Sales Specialist",
      expertise: "Skilled in promoting bench candidates, resume formatting",
      about: "A Technical Bench Sales Specialist skilled in promoting bench candidates effectively. Experienced in resume optimization and vendor communication. Strong in consultant positioning strategies. Focused on consistent placement success.",
    },
    {
      name: "Gunjana",
      image: Gen5Img,
      role: "IT Bench Sales Executive",
      expertise: "Candidate profiling, vendor networking",
      about: "An IT Bench Sales Executive experienced in candidate profiling and vendor networking. Skilled in consultant marketing and negotiations. Strong understanding of staffing cycles. Focused on accelerating placements and revenue growth.",
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
      about: "A Business Development Specialist focused on lead generation and strategic partnerships. Skilled in identifying growth opportunities and client acquisition. Strong in negotiation and relationship building. Focused on driving sustainable business expansion.",
      isTopPerformer: true,
    },
    {
      name: "Mani kumar",
      image: Gen15Img,
      role: "Business Development Manager",
      expertise: "Lead generation, client relationship management",
      about: "A Business Development Manager experienced in expanding operations through strategic initiatives. Skilled in client relationship management and revenue planning. Strong in competitive positioning and deal closures. Focused on long-term growth.",
    },
    {
      name: "Dharshini",
      image: Gen5Img,
      role: "Business Development",
      expertise: "Process Management, Analytics",
      about: "A Business Development professional skilled in process management and analytics-driven strategies. Experienced in client engagement and growth planning. Strong in performance tracking and operational improvements. Focused on closing strategic deals.",
    },
    {
      name: "Shobita",
      image: Gen13Img,
      role: "Business Development Executive",
      expertise: "Market Expansion, Partnerships",
      about: "A Business Development Executive experienced in market expansion and partnership development. Skilled in competitive analysis and opportunity identification. Strong in sales strategy execution. Focused on strengthening brand presence.",
    },
    {
      name: "Aina",
      image: Gen1Img,
      role: "Business Development Associate",
      expertise: "Account Management, Growth",
      about: "A Business Development Associate skilled in account management and client retention. Experienced in supporting revenue growth initiatives. Strong in cross-team coordination and customer satisfaction. Focused on building long-term partnerships.",
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

  // Internship auto growth logic
  const baseInterns = 150;
  const growthPerMonth = 10;
  const startDate = new Date("2024-01-01");

  const now = new Date();

  const monthsPassed =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());

  const currentInternCount =
    baseInterns + (monthsPassed * growthPerMonth);

  const allTeamMembers = departments.flatMap((dept) =>
    dept.members.map((member) => ({
      ...member,
      department: dept.name,
      verified: true,
      isLeader: member.name === "Tanmai"
    }))
  );

  const getDepartmentBadge = (department) => {

    const styles = {
      "Software Developers":
        "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",

      "Human Resources":
        "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",

      "Digital Marketing":
        "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",

      "US IT Recruiters":
        "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",

      "Sales and Marketing":
        "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",

      "Bench Sales Recruiters":
        "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300",

      "Business development":
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
    };

    return styles[department] || "bg-gray-100 text-gray-600";
  };

  const [activeIndex, setActiveIndex] = useState(0);

  return (

    <>

      <Helmet>
        <title>About GreatHire | Hyderabad's AI-Powered Hiring & IT Staffing Company</title>

        <meta
          name="description"
          content="GreatHire is a prominent AI-based recruitment and IT talent solutions company that provides exceptional recruitment outcomes for organizations and professionals alike. With its headquarters based in Hyderabad, Telangana, GreatHire enables organizations to tap into smart recruitment solutions and technological transformations. Our talented and experienced professionals at GreatHire use their astute understanding of human psychology combined with our innovative recruitment solutions for top talent to partner with innovative companies."
        />
      </Helmet>


      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 mt-16 overflow-x-hidden">
        <Navbar />

        {/* Hero Section - Enhanced */}
        <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-b from-blue-300 to-blue-600 dark:from-blue-900 dark:to-purple-900 shadow-2xl max-w-full">
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
            <div className="absolute top-10 left-10 w-40 h-40 sm:w-72 sm:h-72 bg-purple-400/20 dark:bg-purple-600/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-96 sm:h-96 bg-pink-400/20 dark:bg-pink-600/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-white h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-full">
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full mb-2 animate-fade-in">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">About Our Journey</span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-[Oswald] tracking-tight px-2 break-words text-white">
                  About <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-300 dark:from-blue-300 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">GreatHire</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-serif text-blue-50 dark:text-blue-100 leading-relaxed px-2 sm:px-4">
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
        <div className="relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-blue-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-purple-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

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
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 max-w-full">
            <div className="text-center mb-16 mt-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Leadership Excellence</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-[Oswald] bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Our Leadership
              </h2>
            </div>

            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
              {leadership.map((leader, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500 p-8 border border-purple-200 dark:border-purple-700 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Profile Image with highlight ring */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-md opacity-40"></div>

                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-md">
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-center mt-5 text-gray-900 dark:text-white">
                    {leader.name}
                  </h3>

                  {/* Role as text */}
                  <p className="text-purple-600 font-semibold text-center mt-1">
                    {leader.title}
                  </p>

                  {/* Premium divider */}
                  <div className="flex justify-center mt-4">
                    <div className="w-20 h-[3px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed mt-4">
                    {leader.description}
                  </p>

                  {/* Achievements */}
                  <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                    <h4 className="text-sm font-semibold text-purple-600 mb-3 flex items-center gap-2">
                      ⭐ Key Achievements
                    </h4>

                    <ul className="space-y-2">
                      {leader.achievements.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Vision */}
                  <div className="mt-5 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                      Vision
                    </h4>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {leader.vision}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story Section - Enhanced */}
        <div className="py-12 sm:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 dark:opacity-20">
            <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-300 dark:bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-300 dark:bg-purple-600 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 max-w-full">
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
                    className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-gray-600/50 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed flex-1 pt-2">
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
        <div className="py-10 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-900/10"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 max-w-full">
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
                  className="group relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 dark:border-gray-600 overflow-hidden"
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

                    <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
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
        <div className="py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden w-full">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 max-w-full">
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
              spaceBetween={20}
              slidesPerView={2}
              loop={true}
              speed={2000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
              }}
              breakpoints={{
                0: { slidesPerView: 2, spaceBetween: 15 },
                640: { slidesPerView: 3, spaceBetween: 20 },
                768: { slidesPerView: 6, spaceBetween: 25 },
                1024: { slidesPerView: 8, spaceBetween: 30 },
              }}
              className="py-4 w-full max-w-full"
            >
              {clientLogos.map((client, index) => (
                <SwiperSlide key={index}>
                  <div className="group flex items-center justify-center h-20 sm:h-28 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl p-3 sm:p-6 transition-all duration-300 border border-gray-100 dark:border-gray-600">
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

{/* OUR TEAM SECTION */}
<section className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">

  {/* Heading */}
  <div className="text-center mb-12">

    <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
      <Users className="w-4 h-4 text-purple-600" />
      <span className="text-sm font-semibold text-purple-600">
        Our Team
      </span>
    </div>

    <h2 className="text-4xl md:text-5xl font-bold font-[Oswald]
      bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
      Meet Our Team
    </h2>

    <p className="text-gray-600 dark:text-gray-400 mt-3">
      Meet the talented professionals behind GreatHire
    </p>

  </div>


  {/* TEAM HIGHLIGHTS WITH ANIMATION */}
  <div className="flex flex-wrap justify-center gap-6 mt-10 mb-16">

    {/* Team Members */}
    <div className="bg-white dark:bg-gray-900
      border border-purple-200 dark:border-purple-800
      px-8 py-5 rounded-xl shadow-md hover:shadow-xl transition">

      <h3 className="text-3xl font-bold text-purple-600 text-center">

        <NumberCounter end={200} duration={2000} suffix="+" />

      </h3>

      <p className="text-sm text-gray-500 text-center font-semibold">
        Team Members
      </p>

    </div>


    {/* Departments */}
    <div className="bg-white dark:bg-gray-900
      border border-blue-200 dark:border-blue-800
      px-8 py-5 rounded-xl shadow-md hover:shadow-xl transition">

      <h3 className="text-3xl font-bold text-blue-600 text-center">

        <NumberCounter end={10} duration={2000} suffix="+" />

      </h3>

      <p className="text-sm text-gray-500 text-center font-semibold">
        Departments
      </p>

    </div>


    {/* Internship Program */}
    <div className="relative bg-gradient-to-r
      from-yellow-400 to-orange-500
      text-white px-8 py-5 rounded-xl
      shadow-lg hover:shadow-2xl transition scale-105">

      <div className="absolute -top-3 left-1/2 -translate-x-1/2
        bg-white text-orange-500 text-xs
        px-4 py-1 rounded-full font-bold shadow
        whitespace-nowrap">

        INTERNSHIP PROGRAM

      </div>

      <h3 className="text-3xl font-bold text-center">

        <NumberCounter
          end={currentInternCount}
          duration={2000}
          suffix="+"
        />

      </h3>

      <p className="text-sm text-center font-semibold">
        Interns Trained & Placed
      </p>

    </div>

  </div>


  {/* Auto scrolling cards */}
  <div className="relative overflow-hidden">

    <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused] px-6 w-max">

      {[...allTeamMembers, ...allTeamMembers].map((member, index) => (

        <div key={index}
          className="group relative min-w-[300px] max-w-[300px]
          rounded-2xl border border-purple-200 dark:border-purple-800
          bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg hover:scale-[1.02] transition duration-300 overflow-visible">

          {member.isTopPerformer && !member.isLeader && (
            <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              ⭐ Top Performer
            </div>
          )}

          {member.leadership && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-md">
                ⭐ Team Lead
              </span>
            </div>
          )}

          <div className="rounded-2xl flex flex-col px-5 pt-4 pb-6 text-center relative">




            {/* Profile Image */}
            <div className="mt-3 mb-2 flex justify-center">

              <div className={`w-28 h-28 rounded-xl overflow-hidden border-4

                ${member.isLeader
                  ? "border-yellow-400"
                  : "border-gray-300 dark:border-gray-700"
                } shadow-md`}>

                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />

              </div>

            </div>


            {/* NAME WITH VERIFIED ICON */}
            <div className="text-center mt-4 space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">

                {member.name}

                <BadgeCheck
                  className={`w-4 h-4
                    ${member.isLeader
                      ? "text-yellow-500"
                      : "text-blue-500"
                    }`}
                />

              </h3>


              {/* Role */}
              <p className="text-purple-600 font-semibold text-base leading-snug">

                {Array.isArray(member.role)
                  ? member.role.join(" • ")
                  : member.role}

              </p>


              {/* Expertise */}
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {member.expertise}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-2"></div>

            {/* Description */}
            <div className="mt-3 px-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed whitespace-normal break-words">
                {member.about}
              </p>
            </div>


            {/* GreatHire Tag — CENTERED */}
            <div className="flex justify-center mt-3 mb-2">

              <div className="flex items-center gap-1 text-[10px]
                bg-purple-100 dark:bg-purple-900
                text-purple-600 dark:text-purple-300
                px-3 py-1 rounded-full font-semibold">

                <BadgeCheck className="w-3 h-3" />

                GreatHire Team

              </div>

            </div>


            {/* Footer */}
            <div className="flex flex-col items-center mt-6 space-y-2">
              <span className="text-yellow-500 text-lg">★★★★★</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {member.leadership ? "Executive Leadership Rating" : "Team Member Rating"}
              </p>
            </div>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

        <Footer />
      </div>
    </>
  );
}

export default App;
