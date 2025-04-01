import React from 'react';
import { Users, Target, Award, Building2, Briefcase } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

function App() {
  const clientLogos = [
    { name: "Tata Consultancy Services", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/240px-Tata_Consultancy_Services_Logo.svg.png" },
    { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/240px-Infosys_logo.svg.png" },
    { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/240px-Wipro_Primary_Logo_Color_RGB.svg.png" },
    { name: "HCL Technologies", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/HCL_Technologies_logo.svg/240px-HCL_Technologies_logo.svg.png" },
    { name: "Tech Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tech_Mahindra_New_Logo.svg/240px-Tech_Mahindra_New_Logo.svg.png" },
    { name: "Larsen & Toubro Infotech", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/LTI_Mindtree_logo.svg/240px-LTI_Mindtree_logo.svg.png" },
    { name: "Reliance Industries", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Reliance_Communications_Logo.svg/240px-Reliance_Communications_Logo.svg.png" },
    { name: "Bharti Airtel", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Airtel_logo.svg/240px-Airtel_logo.svg.png" },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/240px-HDFC_Bank_Logo.svg.png" },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/240px-ICICI_Bank_Logo.svg.png" },
    { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/State_Bank_of_India_logo.svg/240px-State_Bank_of_India_logo.svg.png" },
    { name: "Axis Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Axis_Bank_logo.svg/240px-Axis_Bank_logo.svg.png" },
    { name: "Mahindra Group", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Mahindra_Rise_Logo.svg/240px-Mahindra_Rise_Logo.svg.png" },
    { name: "Tata Motors", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_Motors_Logo.svg/240px-Tata_Motors_Logo.svg.png" },
    { name: "Maruti Suzuki", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Maruti_Suzuki_Logo.svg/240px-Maruti_Suzuki_Logo.svg.png" },
    { name: "Hero MotoCorp", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Hero_MotoCorp_Logo.svg/240px-Hero_MotoCorp_Logo.svg.png" },
    { name: "Bajaj Auto", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Bajaj_Auto_Logo.svg/240px-Bajaj_Auto_Logo.svg.png" },
    { name: "ITC Limited", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/ITC_Limited_Logo.svg/240px-ITC_Limited_Logo.svg.png" },
    { name: "Hindustan Unilever", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Hindustan_Unilever_Logo.svg/240px-Hindustan_Unilever_Logo.svg.png" },
    { name: "Asian Paints", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Asian_Paints_Logo.svg/240px-Asian_Paints_Logo.svg.png" },
    { name: "Adani Group", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Adani_2012_logo.png/240px-Adani_2012_logo.png" },
    { name: "JSW Group", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/JSW_Group_Logo.svg/240px-JSW_Group_Logo.svg.png" },
    { name: "Godrej Group", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Godrej_Logo.svg/240px-Godrej_Logo.svg.png" },
    { name: "Bharat Petroleum", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bharat_Petroleum_Logo.svg/240px-Bharat_Petroleum_Logo.svg.png" }
  ];

  const departments = [
    {
      name: "Software Developers",
      members: [
        {
          name: "CH Tanmai",
          image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
          role: "Team Lead",
          expertise: "Full Stack Developer",
          about: "Experienced in building scalable web applications with a focus on user experience.",
        },
        {
          name: "Charan Sai",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
          role: "AWS Artichect",
          expertise: "Cloud Solutions, DevOps",
          about: "Specializes in designing and implementing cloud solutions on AWS.",
        },
        {
          name: "Sujeeth Kumar",
          image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
          role: "Information Security Analyst & Full Stack Developer",
          expertise: "Web Development, Cyber Security, AWS Cloud",
          about: "Expert in building scalable web applications with modern technologies and security best practices.",
        },
        {
          name: "Eswar Reddy",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
          role: "Full Stack Developer",
          expertise: "React, Node.js, MongoDB, Express, JavaScript, Node.js, Python, ",
          about: "Experienced in building full-stack applications with a focus on user experience and performance.",
        },
        {
          name: "Mahesh Kumar",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
          role: "Frontend Developer",
          expertise: "React, Angular, Vue.js",
          about: "Skilled in creating responsive and interactive user interfaces.",
        },
        {
          name: "Marcus Chen",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
          role: "Mobile Developer",
          expertise: "React Native, iOS, Android",
          about: "Specialized in cross-platform mobile development.",
        },
      ],
    },
    {
      name: "Human Resources",
      members: [
        {
          name: "Jessica Patel",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
          role: "HR Manager",
          expertise: "Employee Relations, Culture Building",
          about: "Expert in workplace culture and employee satisfaction.",
        },
        {
          name: "Robert Wilson",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
          role: "Training Lead",
          expertise: "L&D, Professional Development",
          about: "Specializes in employee training and development programs.",
        },
        {
          name: "Maria Garcia",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
          role: "HR Specialist",
          expertise: "Benefits, Compensation",
          about: "Manages employee benefits and compensation strategies.",
        },
        {
          name: "Thomas Lee",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
          role: "Employee Experience",
          expertise: "Engagement, Wellness Programs",
          about: "Focuses on creating positive workplace experiences.",
        },
        {
          name: "Priya Shah",
          image: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&q=80&w=400",
          role: "HR Analytics",
          expertise: "Data Analysis, Reporting",
          about: "Drives HR decisions through data-driven insights.",
        },
      ],
    },
    {
      name: "Digital Marketing",
      members: [
        {
          name: "John Lee",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
          role: "Marketing Director",
          expertise: "Digital Strategy, SEO",
          about: "Leads digital marketing initiatives and growth strategies.",
        },
        {
          name: "Sophie Wang",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
          role: "Content Strategist",
          expertise: "Content Marketing, SEO",
          about: "Creates engaging content strategies that drive growth.",
        },
        {
          name: "Raj Patel",
          image: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&q=80&w=400",
          role: "Social Media Manager",
          expertise: "Social Media, Community Management",
          about: "Manages social media presence and community engagement.",
        },
        {
          name: "Emma Thompson",
          image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400",
          role: "PPC Specialist",
          expertise: "Paid Advertising, Analytics",
          about: "Manages paid campaigns and performance optimization.",
        },
        {
          name: "David Kim",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
          role: "Marketing Analytics",
          expertise: "Data Analysis, Reporting",
          about: "Drives marketing decisions through data insights.",
        },
      ],
    },
    {
      name: "Talent Acquisition",
      members: [
        {
          name: "Rachel Foster",
          image: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&q=80&w=400",
          role: "Technical Recruiter",
          expertise: "Tech Recruitment, Talent Assessment",
          about: "Specializes in recruiting top tech talent.",
        },
        {
          name: "Michael Zhang",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
          role: "Senior Recruiter",
          expertise: "Executive Search, Talent Strategy",
          about: "Focuses on executive and leadership recruitment.",
        },
        {
          name: "Anita Sharma",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
          role: "Campus Recruiter",
          expertise: "Graduate Hiring, University Relations",
          about: "Manages campus recruitment programs.",
        },
        {
          name: "Carlos Rodriguez",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
          role: "Global Talent Lead",
          expertise: "International Hiring, Relocation",
          about: "Handles international recruitment and talent mobility.",
        },
        {
          name: "Lisa Chen",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
          role: "Recruitment Operations",
          expertise: "Process Optimization, Tools",
          about: "Streamlines recruitment processes and systems.",
        },
      ],
    },
    {
      name: "Bench Sales",
      members: [
        {
          name: "Sarah Anderson",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
          role: "Sales Director",
          expertise: "B2B Sales, Account Management",
          about: "Leads bench sales and client relationship management.",
        },
        {
          name: "James Chen",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
          role: "Account Executive",
          expertise: "Solution Sales, Negotiations",
          about: "Manages key client accounts and sales strategies.",
        },
        {
          name: "Aisha Khan",
          image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
          role: "Sales Operations",
          expertise: "Process Management, Analytics",
          about: "Optimizes sales processes and reporting.",
        },
        {
          name: "Tom Wilson",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
          role: "Business Development",
          expertise: "Market Expansion, Partnerships",
          about: "Develops new business opportunities and partnerships.",
        },
        {
          name: "Maya Patel",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
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
      title: "50+",
      description: "Industry Awards",
    },
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      title: "1000+",
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
      name: "Rajesh Kumar",
      title: "CEO & Founder",
      description: "With over 20 years of experience in the IT industry, Rajesh Kumar founded GreatHire with a vision to revolutionize the recruitment process. His journey began at leading tech companies where he identified the gaps in traditional hiring methods. Under his leadership, GreatHire has grown from a startup to a trusted partner for hundreds of companies across India.",
      achievements: [
        "Pioneer in implementing AI-driven recruitment solutions",
        "Led the company to achieve 500% growth in 3 years",
        "Recognized as Top 40 Under 40 Business Leaders by Economic Times",
      ],
      vision: "To create a recruitment ecosystem that prioritizes both technical excellence and cultural fit, ensuring sustainable growth for companies and fulfilling careers for professionals."
    },
    {
      name: "Priya Sharma",
      title: "Co-Founder & CTO",
      description: "A technology veteran with 15 years of experience in building scalable platforms, Priya Sharma co-founded GreatHire to bring technological innovation to recruitment. Her expertise in AI and machine learning has been instrumental in developing GreatHire's cutting-edge matching algorithms and assessment tools.",
      achievements: [
        "Architected GreatHire's proprietary AI matching system",
        "Published research on ML applications in recruitment",
        "Former Tech Lead at Google India",
      ],
      vision: "To leverage technology not just for efficiency, but to create more equitable and effective hiring practices that benefit both employers and job seekers."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                Founded in 2020, GreatHire emerged from a simple yet powerful vision: to transform how companies and talent connect in the digital age. What began as a startup with a handful of passionate individuals has grown into a dynamic platform serving thousands of businesses and job seekers across India.
              </p>
              <p className="leading-relaxed">
                Our journey has been marked by continuous innovation, from developing AI-powered matching algorithms to creating comprehensive assessment tools that look beyond just technical skills. We've helped over 10,000 professionals find their dream jobs and assisted countless companies in building strong, diverse teams.
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

      {/* Team Section with Free Scroll */}
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
                          <p className="text-blue-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">{member.role}</p>
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
    </div>
  );
}

export default App;