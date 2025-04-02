import React from 'react';
import { Users, Target, Award, Building2, Briefcase } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

//logos from assets folder
import a1township from "../../assets/clientLogos/a1township.png";
import accenflair from "../../assets/clientLogos/accenflair.webp";
import aiedge from "../../assets/clientLogos/aiedge.jpeg";
import alkaline from "../../assets/clientLogos/alkaline.png";
import baklava from "../../assets/clientLogos/baklava.avif";
import bandharyglass from "../../assets/clientLogos/bandharyglass.png";
import clevernest from "../../assets/clientLogos/clevernest.jpg";
import dadus from "../../assets/clientLogos/dadus.avif";
import dwlabs from "../../assets/clientLogos/dwlabs.jpeg";
import genericsol from "../../assets/clientLogos/genericsol.jpeg";
import hrh from "../../assets/clientLogos/hrh.jpeg";
import kotaklife from "../../assets/clientLogos/kotaklife.jpg";
import smfibers from "../../assets/clientLogos/smfibers.svg";
import sriramfinance from "../../assets/clientLogos/sriramfinance.jpg";
import techmahindra from "../../assets/clientLogos/techmahindra.png";
import google from "../../assets/clientLogos/google.png";
import teleperformance from "../../assets/clientLogos/teleperformance.png";
import vortalsoft from "../../assets/clientLogos/vortalsoft.jpg";
import wipro from "../../assets/clientLogos/Wipro.svg"; 
import zeelmedia from "../../assets/clientLogos/zeelmedia.png";      
import raviraj from "../../assets/clientLogos/raviraj.svg";
import eeshanya from "../../assets/clientLogos/eeshanya.png";
import tata from "../../assets/clientLogos/tata.png";

// Import User-Team Photos
import sonu from "../../assets/user Photos/sonu.jpeg";
import Mahesh from "../../assets/user Photos/Mahesh.jpeg";
import eswar from "../../assets/user Photos/eswar.jpeg";
import Charan from "../../assets/user Photos/Charan.jpeg";
import nabhay from "../../assets/user Photos/nabhay.jpeg";
import Navaneeth from "../../assets/user Photos/Navaneeth.jpeg";
import Virendar from "../../assets/user Photos/Virendar.jpeg";
import santhosh from "../../assets/user Photos/santhosh.jpeg";
import Mounika from "../../assets/user Photos/Mounika.jpeg";
import lahari from "../../assets/user Photos/lahari.jpeg";
import riya from "../../assets/user Photos/riya.jpeg";
import sushma from "../../assets/user Photos/sushma.jpeg";
import janaki from "../../assets/user Photos/janki.jpeg";
import madhu from "../../assets/user Photos/madhu.jpeg";
import mansi from "../../assets/user Photos/mansi.jpeg";
import tanmai from "../../assets/user Photos/tanmai.jpeg";
import Blank from "../../assets/user Photos/Blank.jpg";

function App() {
  const clientLogos = [
    { name: "Tata", logo: tata },
    { name: "Tech Mahindra", logo: techmahindra },
    { name: "Wipro", logo: wipro },
    { name: "Teleperformance", logo: teleperformance },
    { name: "Google", logo: google },
    { name: "Kotak Life", logo: kotaklife },
    { name: "DWLabs", logo: dwlabs },
    { name: "Voralsoft", logo: vortalsoft },
    { name: "Sriram Finance", logo: sriramfinance },
    { name: "Raviraj", logo: raviraj },
    { name: "A1 Township", logo: a1township },
    { name: "SM Fibers", logo: smfibers },
    { name: "Zeel Media", logo: zeelmedia },
    { name: "Accenflair", logo: accenflair },
    { name: "Generic Sol", logo: genericsol },
    { name: "Bandhary Glass", logo: bandharyglass },
    { name: "Alkaline", logo: alkaline },
    { name: "AI Edge", logo: aiedge },
    { name: "Clever Nest", logo: clevernest },
    { name: "Baklava", logo: baklava },
    { name: "HRH", logo: hrh },
    { name: "Dadus", logo: dadus },
    { name: "Eeshanya", logo: eeshanya },
  ];

  const departments = [
    {
      name: "Software Developers",
      members: [
        {
          name: "Charan Sai",
          image: Charan,
          role: ["AWS Architect"],
          expertise: "Cloud Solutions, DevOps",
          about: "Specializes in designing and implementing cloud solutions on AWS.",
        },
        {
          name: "Eswar Reddy",
          image: eswar,
          role: ["Full Stack Developer"],
          expertise: "React, Node.js, MongoDB, Express, JavaScript, Python",
          about: "Experienced in building full-stack applications with a focus on user experience and performance.",
        },
        {
          name: "Sujeeth Kumar",
          image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
          role: ["Information Security Analyst", "Full Stack Developer", "Team Lead"],
          expertise: "Web Development, Cyber Security, AWS Cloud",
          about: "Expert in building scalable web applications with modern technologies and security best practices.",
        },
        {
          name: "Maheswar Reddy",
          image: Blank,
          role: ["Frontend Developer"],
          expertise: "React, HTML, CSS, JavaScript, Node.js, AWS, MongoDB",
          about: "Skilled in creating responsive and interactive user interfaces.",
        },
        {
          name: "Virender",
          image: Virendar,
          role: ["Mobile Developer"],
          expertise: "React Native, iOS, Android",
          about: "Specialized in cross-platform mobile development.",
        },
        {
          name: "Sonu Kumar",
          image: Blank,
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
          image: Navaneeth,
          role: "Human Resource",
          expertise: "Recruitment, Employee Relations",
          about: "Oversees recruitment and employee relations.",
        },
        {
          name: "Koshistha",
          image: Blank,
          role: "Sourcing Specialist",
          expertise: "Talent Sourcing, Networking",
          about: "Focuses on sourcing candidates through various channels.",
        },
        {
          name: "Mounika",
          image: Mounika,
          role: "Screening Specialist",
          expertise: "Talent Acquisition, Screening",
          about: "Responsible for screening and shortlisting candidates.",
        },
        {
          name: "Tanmai",
          image: tanmai,
          role: "Hiring Manager & Team Lead",
          expertise: "Recruitment, Team Management",
          about: "Manages HR team and oversees recruitment processes.",
        },
        {
          name: "Lahari",
          image: lahari,
          role: "On Boarding Specialist",
          expertise: "Onboarding, Employee Engagement",
          about: "Facilitates onboarding and employee engagement activities.",
        },
        {
          name: "Madhu",
          image: madhu,
          role: "Human Resource",
          expertise: "Recruitment, Employee Relations",
          about: "Oversees recruitment and employee relations.",
        },
        {
          name: "Rohit",
          image: Blank,
          role: "Interviewer",
          expertise: "Interviewing, Assessment",
          about: "Conducts interviews and assesses candidates skills.",
        },
        {
          name: "Dikshit",
          image: Blank,
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
          image: Blank,
          role: "Digital Marketing Specialist",
          expertise: "SEO, SEM, Content Marketing",
          about: "Ensures Brand vsibility and engagement through digital channels to reach right audience effectively.",
        },
        {
          name: "Alekhya",
          image: Blank,
          role: "Digital Marketing Specialist",
          expertise: "SEO, SEM, Content Marketing",
          about: "Ensures Brand vsibility and engagement through digital channels to reach right audience effectively.",
        },
        {
          name: "Darshini",
          image: Blank,
          role: "Digital Marketing Specialist",
          expertise: "SEO, SEM, Content Marketing",
          about: "Ensures Brand vsibility and engagement through digital channels to reach right audience effectively.",
        },
        {
          name: "Anuskha",
          image: Blank,
          role: "Digital Marketing",
          expertise: "Social Media, Content Creation",
          about: "Specializes in digital marketing strategies, Content marketing, performance analysis and social media management with optimized campaigns.",
        },
        {
          name: "Anil",
          image: Blank,
          role: "Digital Marketing",
          expertise: "SEO, SEM, Content Marketing",
          about: "Works on innovative starategies, Leveraging the latest trends in SEO, PPC, and social media marketing.",
        },
      ],
    },
    {
      name: "US IT Recruiters",
      members: [
        {
          name: "Sushma",
          image: sushma,
          role: "Technical Recruiter",
          expertise: "Tech Recruitment, Talent Assessment",
          about: "Specializes in recruiting top tech talent.",
        },
        {
          name: "Janki",
          image: janaki,
          role: "Talent Acquisition Specialist",
          expertise: "Executive Search, Talent Strategy",
          about: "Focuses on executive and leadership recruitment.",
        },
        {
          name: "Santhosh",
          image: santhosh,
          role: "Talent Acquisition",
          expertise: " Graduate Hiring, University Relations",
          about: "Focuses on strategic hiring pratices, I ensure we attract and retain top talent.",
        },
        {
          name: "Mansi",
          image: mansi,
          role: "Talent Acquisition",
          expertise: "International Recruitment, Relocation",
          about: "Focuses on identifying and attracting top talent from around the world.",
        },
        {
          name: "Riya",
          image: riya,
          role: "Recruitment Operations",
          expertise: "Process Optimization, Tools",
          about: "Focuses on streamlining recruitment processes by connecting the right talent with the right opportunities.",
        },
      ],
    },
    {
      name: "Sales and Marketing",
      members: [
        {
          name: "Chirag",
          image: Blank,
          role: "Sales Manager",
          expertise: "B2B Sales, Account Management",
          about: "Focused on driving business growth through marketing strategies, client relationships, and sales initiatives.",
        },
        {
          name: "Divya",
          image: Blank,
          role: "Sales Executive",
          expertise: "Solution Sales, Negotiations",
          about: "Involves into creating impactful marketing campaigns, fostering client relationship, and ensuring services stand out in competitive market.",
        },
        {
          name: "Riya",
          image: Blank,
          role: "Sales and Marketing",
          expertise: "Market Research, Lead Generation",
          about: "Conducts market research and generates leads for sales.",
        },
        {
          name: "Anita Sharma",
          image: Blank,
          role: "Campus Recruiter",
          expertise: "Graduate Hiring, University Relations",
          about: "Manages campus recruitment programs.",
        },
        {
          name: "Carlos Rodriguez",
          image: Blank,
          role: "Global Talent Lead",
          expertise: "International Hiring, Relocation",
          about: "Handles international recruitment and talent mobility.",
        },
        {
          name: "Lisa Chen",
          image: Blank,
          role: "Recruitment Operations",
          expertise: "Process Optimization, Tools",
          about: "Streamlines recruitment processes and systems.",
        },
      ],
    },
    {
      name: "Bench Sales Recruitment",
      members: [
        {
          name: "Neha",
          image: Blank,
          role: "Bench Sales Specialist",
          expertise: "B2B Sales, Account Management",
          about: "Leads bench sales and client relationship management.",
        },
        {
          name: "Babitha",
          image: Blank,
          role: "Sales Executive",
          expertise: "Solution Sales, Negotiations",
          about: "Manages key client accounts and sales strategies.",
        },
        {
          name: "Cherry",
          image: Blank,
          role: "Sales Operations",
          expertise: "Process Management, Analytics",
          about: "Optimizes sales processes and reporting.",
        },
        {
          name: "Dakshitha",
          image: Blank,
          role: "Business Development",
          expertise: "Market Expansion, Partnerships",
          about: "Develops new business opportunities and partnerships.",
        },
        {
          name: "Gunjana",
          image: Blank,
          role: "Client Success",
          expertise: "Account Management, Growth",
          about: "Ensures client satisfaction and retention.",
        },
      ],
    },
    {
      name: "Business development",
      members: [
        {
          name: "Nabhy Singh",
          image: nabhay,
          role: "Business Development Professional",
          expertise: "B2B Sales, Account Management",
          about: "focused on identifying the new market opportunities anad building startegic partnerships and strategies.",
        },
        {
          name: "Mani kumar",
          image: Blank,
          role: "Sales Executive",
          expertise: "Solution Sales, Negotiations",
          about: "Specilized in business expansion by levaraging marketing insights and innovative sales strategies.",
        },
        {
          name: "Dharshini",
          image: Blank,
          role: "Business Development",
          expertise: "Process Management, Analytics",
          about: "Focuses on lead generation, client acuisition, and partnership building to ensure sustained growth and a competitive market presence.",
        },
        {
          name: "Shobita",
          image: Blank,
          role: "Business Development",
          expertise: "Market Expansion, Partnerships",
          about: "works towards expanding the company's market reach by identifying new opportunities and collaborating with potential partners and strategic planning.",
        },
        {
          name: "Aina",
          image: Blank,
          role: "Client Success",
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
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">About GreatHire</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Transforming the way companies hire and people find their dream jobs through innovative technology and human expertise.
          </p>
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
              <div key={index} className="bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">{leader.name}</h3>
                  <p className="text-lg font-semibold text-gray-600 mb-4">{leader.title}</p>
                  <p className="text-gray-700 mb-6 leading-relaxed">{leader.description}</p>
                </div>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {leader.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                <div>
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

      {/* Team Section with Navigation */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          {departments.map((department, dIndex) => (
            <div key={dIndex} className="mb-16 last:mb-0">
              <h3 className="text-2xl font-semibold mb-8 text-blue-600">{department.name}</h3>
              <Swiper
                modules={[Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  nextEl: `.swiper-button-next-team-${dIndex}`,
                  prevEl: `.swiper-button-prev-team-${dIndex}`,
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
                className="relative"
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
              {/* Navigation Buttons */}
              <div
                className={`swiper-button-prev-team-${dIndex} text-blue-600 hover:text-blue-800 absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer`}
              >
                &#8592;
              </div>
              <div
                className={`swiper-button-next-team-${dIndex} text-blue-600 hover:text-blue-800 absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer`}
              >
                &#8594;
              </div>
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