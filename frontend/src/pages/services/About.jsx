import { Users, Target, Award, Building2, Briefcase } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, } from 'swiper/modules';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

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
import SujithImg from "../../assets/user Photos/G.Sujith.jpeg";
import NazirImg from "../../assets/user Photos/Nazir.jpeg";
import SujeethImg from "../../assets/user Photos/Sujeeth.jpeg";
import DhanshreeImg from "../../assets/user Photos/Dhanshree.jpeg";
import KOIImg from "../../assets/user Photos/KOI.jpeg";
import MaheshImg  from "../../assets/user Photos/Mahesh.jpg";
import MoizImg from "../../assets/user Photos/MoizImg.jpg";
import AmanImg from "../../assets/user Photos/Aman.jpeg";
import eswarImg from "../../assets/user Photos/Eswar.jpeg";
import CharanImg from "../../assets/user Photos/Charan.jpeg";
import nabhayImg from "../../assets/user Photos/Nabhay.jpeg";
import NavaneethImg from "../../assets/user Photos/Navaneeth.jpeg";
import VirendarImg from "../../assets/user Photos/Virendar.jpeg";
import santhoshImg from "../../assets/user Photos/Santhosh.jpeg";
import MounikaImg from "../../assets/user Photos/Mounika.jpeg";
import lahariImg from "../../assets/user Photos/Lahari.jpeg";
import riyaImg from "../../assets/user Photos/Riya.jpeg";
import sushmaImg from "../../assets/user Photos/Sushma.jpeg";
import janakiImg from "../../assets/user Photos/Janki.jpeg";
import madhuImg from "../../assets/user Photos/madhu.jpeg";
import mansiImg from "../../assets/user Photos/Mansi.jpeg";
import tanmaiImg from "../../assets/user Photos/Tanmai.jpeg";
import BlankImg from "../../assets/user Photos/Blank.jpg";
import Gen1Img from "../../assets/user Photos/Gen1.jpeg";
import Gen2Img from "../../assets/user Photos/Gen2.jpeg";
import Gen3Img from "../../assets/user Photos/Gen3.jpeg";
import Gen4Img from "../../assets/user Photos/Gen4.jpeg";
import Gen5Img from "../../assets/user Photos/Gen5.jpeg";
import Gen6Img from "../../assets/user Photos/Gen6.jpeg";
import Gen7Img from "../../assets/user Photos/Gen7.jpeg";
import Gen8Img from "../../assets/user Photos/Gen8.jpeg";
import Gen9Img from "../../assets/user Photos/Gen9.jpeg";
import Gen10Img from "../../assets/user Photos/Gen10.jpeg";
import Gen11Img from "../../assets/user Photos/Gen11.jpeg";
import Gen12Img from "../../assets/user Photos/Gen12.jpeg";
import Gen13Img from "../../assets/user Photos/Gen13.jpeg";
import Gen14Img from "../../assets/user Photos/Gen14.jpeg";
import Gen15Img from "../../assets/user Photos/Gen15.jpg";
import Gen16Img from "../../assets/user Photos/Gen16.jpg";
import Gen17Img from "../../assets/user Photos/Gen17.jpg";
import Gen18Img from "../../assets/user Photos/Gen18.jpg";
import Gen19Img from "../../assets/user Photos/Gen19.jpg";
import RashiImg from "../../assets/user Photos/Rashi.jpg";


function App() {
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
          name: "G Sujith",
          image: SujithImg,
          role: ["ChatGPT Developer"],
          expertise: "ChatGPT, AI, Machine Learning",
          about: "Skilled in creating responsive and interactive user interfaces, with a focus on performance and user experience.",
        },
        {
          name: "Charan Sai",
          image: CharanImg,
          role: ["Associate AWS Architect"],
          expertise: "Cloud Solutions, DevOps",
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
          name: "Eswar Reddy",
          image: eswarImg,
          role: ["Full Stack Developer","Test Engineer"],
          expertise: "React, Node.js, MongoDB, Express, JavaScript, Python",
          about: "Experienced in building full-stack applications with a focus on user experience and performance.",
        },
        {
          name: "Sujeeth Kumar",
          image: SujeethImg,
          role: ["Information Security Analyst","Full Stack Developer","AI Engineer","Team Lead"],
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
          expertise: "Recruitment, Team Management",
          about: "A cross-functional Team Lead, aligns talent with team dynamics and performance goals.",
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
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "500+",
      description: "Successful Placements",
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "98%",
      description: "Client Satisfaction",
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "28+",
      description: "Industry Awards",
    },
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      title: "573+",
      description: "Partner Companies",
    },
  ];

  const services = [
    {
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      title: "Job Matching",
      description: "AI-powered job matching system connecting the right talent with the right opportunities",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Talent Assessment",
      description: "Comprehensive skill assessment and verification process",
    },
    {
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      title: "Corporate Solutions",
      description: "Customized hiring solutions for enterprises",
    },
  ];

  const leadership = [
    {
      name: "BABDE SANKET",
      title: "Founder & CEO",
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
      title: "Director of Human Resources Operations",
      description: "Sonika Babde is a dynamic leader in human resources and organizational development, playing a crucial role in shaping HR operations at Great Hire. With a strong commitment to innovation and inclusivity, she has been instrumental in creating a culture that values diversity and empowers employees to thrive.",
      achievements: [
        "Designed and implemented Great Hire’s proprietary AI-driven talent matching system, revolutionizing recruitment efficiency and accuracy.",
        "Previously served as a experience in technology-driven HR solutions.",
        "Data-Driven Decision Making: Leveraged advanced analytics to refine hiring strategies, improving workforce planning and talent acquisition outcomes.",
        "Employee-Centric HR Policies: Developed comprehensive policies fostering inclusivity, employee engagement, and long-term retention in the organization. ",
      ],
      vision: "Sonika envisions a future where technology not only enhances hiring efficiency but also promotes fairness and effectiveness in recruitment. She is dedicated to leveraging cutting-edge innovations to create hiring practices that benefit both employers and job seekers, ensuring a more equitable and dynamic job market."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">About GreatHire</h1>
          <p className="text-xl text-center max-w-3xl mx-auto font-serif">
          GreatHire Business Solutions provides strategic staffing and workforce solutions tailored to meet diverse business needs. We specialize in connecting companies with top-tier talent, driving efficiency, productivity, and long-term success through our expert recruitment services.          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At GreatHire, our mission is to revolutionize the recruitment landscape by bridging the gap between exceptional talent and innovative companies. We believe in creating meaningful connections that drive career growth and business success through cutting-edge technology and human-centric approaches.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Leadership</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {leadership.map((leader, index) => (
              <div
                key={index}
                className="bg-white border-2 border-blue-600 rounded-lg shadow-lg p-8 flex flex-col items-center text-center space-y-6"
              >
                {/* Name */}
                <h3 className="text-2xl font-bold text-blue-600">{leader.name}</h3>

                {/* Title */}
                <div className="text-lg font-semibold text-gray-600">
                  {Array.isArray(leader.title)
                    ? leader.title.map((t, i) => <div key={i}>{t}</div>)
                    : leader.title}
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">{leader.description}</p>

                {/* Achievements */}
                <div className="w-full text-center">
                  <h4 className="text-lg font-semibold mb-3">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 inline-block text-left">
                    {leader.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                {/* Vision */}
                <div className="w-full text-center">
                  <h4 className="text-lg font-semibold mb-3">Vision:</h4>
                  <p className="text-gray-700 italic">{leader.vision}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Our Story</h2>
            <div className="space-y-6 text-gray-700">
              <p className="leading-relaxed">
                Founded in 2016, GreatHire emerged from a simple yet powerful vision: to transform how companies and talent connect in the digital age. What began as a startup with a handful of passionate individuals has grown into a dynamic platform serving thousands of businesses and job seekers across India.
              </p>
              <p className="leading-relaxed">
                Our journey has been marked by continuous innovation, from developing AI-powered matching algorithms to creating comprehensive assessment tools that look beyond just technical skills. We helped over 10,000 professionals find their dream jobs and assisted countless companies in building strong, diverse teams.
              </p>
              <p className="leading-relaxed">
                Today, we're proud to be one of India's fastest-growing recruitment platforms, but our mission remains the same: to create meaningful connections that drive careers and businesses forward.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{achievement.icon}</div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">{achievement.title}</h3>
                <p className="text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Logo Carousel */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted By Leading Companies</h2>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 6,
              },
            }}
            className="py-4"
          >
            {clientLogos.map((client, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center h-24 bg-white rounded-lg shadow-sm p-4">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section with Sliding Functionality */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          {departments.map((department, dIndex) => (
            <div key={dIndex} className="mb-16 last:mb-0">
              <h3 className="text-2xl font-semibold mb-8 text-blue-600">{department.name}</h3>
              <Swiper
                modules={[FreeMode, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                freeMode={{
                  enabled: true,
                  sticky: false,
                  momentumRatio: 0.25,
                  momentumVelocityRatio: 0.5,
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                  1280: {
                    slidesPerView: 5,
                  },
                }}
                className="team-swiper"
              >
                {department.members.map((member, mIndex) => (
                  <SwiperSlide key={mIndex} className="h-auto">
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="p-6">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-blue-100">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-semibold mb-2 line-clamp-1">{member.name}</h4>
                          <div className="text-blue-600 text-sm mb-3">
                            {Array.isArray(member.role)
                              ? member.role.map((r, index) => <div key={index}>{r}</div>)
                              : member.role}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            <strong className="block mb-1">Expertise:</strong>
                            <span className="line-clamp-2 min-h-[2.5rem]">{member.expertise}</span>
                          </p>
                          <p className="text-gray-700 text-sm line-clamp-3">{member.about}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default App;
