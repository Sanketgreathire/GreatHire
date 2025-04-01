import React from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

import img6 from "../../assets/img6.png";
import img3 from "../../assets/img3.png";
import img8 from "../../assets/img8.png";
import img11 from "../../assets/img11.png";


import { Users, Target, Award, Briefcase, Building2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

//logos 
import teleperformance from "../../assets/clientLogos/teleperformance.png";
import techmahindra from "../../assets/clientLogos/techmahindra.png";
import aiedge from "../../assets/clientLogos/aiedge.jpeg";
import vortalsoft from "../../assets/clientLogos/vortalsoft.jpg";
import dwlabs from "../../assets/clientLogos/dwlabs.jpeg";
import sevan from "../../assets/clientLogos/sevan.avif";
import sricomfort from "../../assets/clientLogos/sricomfort.png";
import baklava from "../../assets/clientLogos/baklava.avif";
import sindbakery from "../../assets/clientLogos/sindbakery.png";
import marvel from "../../assets/clientLogos/marvel.png";
import smfibers from "../../assets/clientLogos/smfibers.svg";
import a1township from "../../assets/clientLogos/a1township.png";
import zeelmedia from "../../assets/clientLogos/zeelmedia.png";
import alkaline from "../../assets/clientLogos/alkaline.png";
import hrh from "../../assets/clientLogos/hrh.jpeg";
import sriramfinance from "../../assets/clientLogos/sriramfinance.jpg";
import kotaklife from "../../assets/clientLogos/kotaklife.jpg";
import accenflair from "../../assets/clientLogos/accenflair.webp";
import ominnovation from "../../assets/clientLogos/ominnovation.png";
import genericsol from "../../assets/clientLogos/genericsol.jpeg"
import clevernest from "../../assets/clientLogos/clevernest.jpg";
import bandharyglass from "../../assets/clientLogos/bandharyglass.png";
import dadus from "../../assets/clientLogos/dadus.avif"

const About = () => {

    const clientLogos = [
        { name: "GOOGLE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/240px-Google_2015_logo.svg.png" },
        { name: "TELE PERFORMANCE", logo: teleperformance },
        { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/240px-Wipro_Primary_Logo_Color_RGB.svg.png" },
        { name: "NEXUSI", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Nexusi_logo.svg/240px-Nexusi_logo.svg.png" },
        { name: "Tech Mahindra", logo: techmahindra },
        { name: "AIEDGE", logo: aiedge },
        { name: "VORTAL SOFT", logo: vortalsoft },
        { name: "REH LEGAL SOLUTION", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Airtel_logo.svg/240px-Airtel_logo.svg.png" },
        { name: "DW LABS", logo: dwlabs },
        { name: "SEVAN TECHNOLOGIES", logo: sevan },
        { name: "SRI COMFORT", logo: sricomfort },
        { name: "BAKLAVA", logo: baklava },
        { name: "SIND BAKERY", logo: sindbakery },
        { name: "MARVEL", logo: marvel },
        { name: "SM FIBERS", logo: smfibers },
        { name: "A1 TOWNSHIP", logo: a1township },
        { name: "SIMPLE INTERIOR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Bajaj_Auto_Logo.svg/240px-Bajaj_Auto_Logo.svg.png" },
        { name: "ZEELMEDIA", logo: zeelmedia },
        { name: "ALKALINE", logo: alkaline },
        { name: "HRH", logo: hrh },
        { name: "SRI RAM FINANCE", logo: sriramfinance },
        { name: "KOTAK LIFE INSURANCE", logo: kotaklife },
        { name: "ACCENFLAIR", logo: accenflair },
        {name:"TADASTHU", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Tata_Logo.svg/240px-Tata_Logo.svg.png"},
        { name: "OM INNOVATIONS", logo: ominnovation },
        { name: "GENERIC SOLUTIONS", logo: genericsol },
        { name: "CLEVERNEST", logo: clevernest },
        { name: "BANDHARY GLASS", logo: bandharyglass },
        { name: "REKNSMARKETING", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/HDFC_Bank_Logo.svg/240px-HDFC_Bank_Logo.svg.png" },
        {name:"DADUS", logo:dadus},
        { name: "QUIEST", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/HDFC_Bank_Logo.svg/240px-HDFC_Bank_Logo.svg.png" },
        { name: "ASHANERO", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bharat_Petroleum_Logo.svg/240px-Bharat_Petroleum_Logo.svg.png" }
      ];
    
      const teamMembers = {
        leadership: [
          {
            role: "CEO / Founder",
            name: "SANKET",
            // image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
            achievement: "15+ years of industry experience",
            about: " Sanket Babde is the visionary leader behind Great Hire with extensive expertise in recruitment and talent acquisition. Hisstrategic leadership and innovative approach have been instrumental in establishing GreatHire.in as a trusted platform for both job seekers and employers, driving the company's growth and success.",
          },
          {
            role: "Managing Director",
            name: "SONIKA REDDY",
            // image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
            achievement: "Led 3 successful tech startups",
            about: "Sonika Reddy, Managing Director at GreatHire.in, is a seasoned leader in Great Hire. Herstrategic vision for talent development and her dedication to fostering a positive workplace culture have been key to the company’s success. With a focus on excellence, Sonika empowers individuals and organizations, shaping the future of recruitment at GreatHire.in.",
          },
        ],
        developers: [
          {
            name: "David Kumar",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
            specialty: "Full Stack Developer",
            about: "Expert in building scalable web applications with modern technologies. David leads the development of GreatHire's core platform, focusing on performance and user experience.",
          },
          {
            name: "Emily Rodriguez",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
            specialty: "Frontend Specialist",
            about: "A creative developer passionate about building intuitive user interfaces. Emily has been key in developing GreatHire's responsive design system and accessibility features.",
          },
          {
            name: "Alex Thompson",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            specialty: "Backend Engineer",
            about: "Specializes in database architecture and API design. Alex ensures GreatHire's infrastructure remains robust and scalable while handling millions of job searches.",
          },
        ],
        hr: [
          {
            name: "Jessica Patel",
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
            specialty: "Employee Relations",
            about: "With expertise in conflict resolution and workplace culture, Jessica ensures both clients and candidates have a positive experience with GreatHire's services.",
          },
          {
            name: "Robert Wilson",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
            specialty: "Training & Development",
            about: "A certified professional development coach who designs and implements comprehensive training programs for both internal teams and client companies.",
          },
          {
            name: "Maria Garcia",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
            specialty: "Compensation & Benefits",
            about: "An expert in developing competitive compensation packages and benefits strategies that help companies attract and retain top talent.",
          },
        ],
        marketing: [
          {
            name: "John Lee",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
            specialty: "Digital Strategy",
            about: "A digital marketing veteran specializing in SEO and content strategy. John leads GreatHire's online presence and market expansion initiatives.",
          },
          {
            name: "Sophie Wang",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
            specialty: "Content Marketing",
            about: "Creative storyteller focused on producing engaging content that helps job seekers and employers make better career decisions.",
          },
        ],
        talent: [
          {
            name: "Rachel Foster",
            image: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&q=80&w=400",
            specialty: "Technical Recruitment",
            about: "Specialized in tech recruitment with deep understanding of the industry. Rachel has successfully placed hundreds of developers in leading tech companies.",
          },
        ],
      };
    
      const achievements = [
        {
          icon: <Users className="w-8 h-8 text-blue-600" />,
          title: "10,000+",
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
    

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
          {/* Hero Section */}
          <div className="bg-blue-600 text-white py-20">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">About GreatHire</h1>
              <p className="text-xl text-center max-w-3xl mx-auto">
              Sanket serves as a Director at Great Hire and is the driving force behind the strategic direction and growth of greathire.in. Appointed as a Founder of Great Hire in 2017, Mr. Sanket provides visionary leadership to the company.
              </p>
            </div>
          </div>
    
          {/* Our Mission Section */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                Under Mr. Babde's guidance, the mission of Babde Private Limited and greathire.in is to empower businesses with effective hiring solutions, connect professionals with meaningful career opportunities, and provide innovative solutions across all greathire.in services. This mission is underpinned by a steadfast commitment to:
                </p>
                <ul className="list-disc list-inside text-left mt-4 space-y-2">
                  <li className="text-gray-700">Innovation:  Continuously pursuing and integrating cutting-edge technologies and methodologies to enhance the user experience and ensure superior outcomes across all greathire.in services.</li>
                  <li className="text-gray-700">User-Centricity: Prioritizing the needs and satisfaction of our users in every aspect of our decision-making and the development of all greathire.in services.</li>
                  <li className="text-gray-700">Excellence: Maintaining the highest standards of quality and reliability in our platform and the delivery of all greathire.in services.</li>
                  <li className="text-gray-700">Growth & Impact: Fostering the growth and success of our users and making a positive contribution to the relevant industries through the comprehensive offerings of greathire.in.</li>
                  
                </ul>
              </div>
            </div>
          </div>

          {/* Our Vision Section */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Our vision</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                Mr.Sanket envisions greathire.in as a leading platform revolutionizing the landscape of IT services, encompassing areas such as AI, software development, digital marketing, and staffing. His vision is to cultivate a seamless and efficient ecosystem for both businesses and individuals, connecting job seekers with recruiters and empowering users to access valuable resources and achieve sustainable business growth through greathire.in's comprehensive suite of services. He is dedicated to developing a technologically advanced platform that remains deeply attuned to user needs and consistently delivers tangible value across all greathire.in services.

                </p>
              </div>
            </div>
          </div>
    
          {/* Our Story Section */}
          <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-6">Our Story</h2>
                <div className="space-y-6 text-gray-700">
                  <p className="leading-relaxed">
                  Established in 2017 and registered in Hyderabad, Telangana, India, with its operational headquarters in Kondapur, Hyderabad, Great Hire is committed to developing impactful ventures. Mr.Sanket collaborates with fellow Director, Soma Sonika Reddy, who was appointed in 2017, to collaboratively guide the company towards its strategic objectives.

                  </p>
                  {/* <p className="leading-relaxed">
                    Our journey has been marked by continuous innovation, from developing AI-powered matching algorithms to creating comprehensive assessment tools that look beyond just technical skills. We've helped over 10,000 professionals find their dream jobs and assisted countless companies in building strong, diverse teams.
                  </p>
                  <p className="leading-relaxed">
                    Today, we re proud to be one of India s fastest-growing recruitment platforms, but our mission remains the same: to create meaningful connections that drive careers and businesses forward.
                  </p> */}
                </div>
              </div>
            </div>
          </div>

          {/* professional biography Section */}
          {/* <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Professional biography</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <ul className="list-disc list-inside text-left mt-4 space-y-2">
                    <li className="text-gray-700">Specific accomplishments and key milestones overseen by Mr. Babde since 2017.</li>
                    <li className="text-gray-700">Details regarding his relevant background and expertise within the industries served by greathire.in.</li>
                    <li className="text-gray-700">A more precise articulation of the core challenges that greathire.in aims to address through its services.</li>
                    <li className="text-gray-700">A direct quote from Mr. Babde that encapsulates his vision for the future of greathire.in.</li>
                  </ul>
                </p>
              </div>
            </div>
          </div> */}
    
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
    
          {/* Team Section */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
    
              {/* Leadership */}
              <div className="mb-16">
                <h3 className="text-2xl font-semibold mb-8 text-center">Leadership</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {teamMembers.leadership.map((member, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                      <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                      <div className="p-6">
                        <h4 className="text-xl font-semibold mb-1">{member.name}</h4>
                        <p className="text-blue-600 mb-2">{member.role}</p>
                        <p className="text-gray-600 mb-4">{member.achievement}</p>
                        <p className="text-gray-700 text-sm leading-relaxed">{member.about}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
              {/* Other Teams */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Developers */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Software Development</h3>
                  {teamMembers.developers.map((member, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-center space-x-4">
                        <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-gray-600 text-sm">{member.specialty}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{member.about}</p>
                    </div>
                  ))}
                </div>
    
                {/* HR */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Human Resources</h3>
                  {teamMembers.hr.map((member, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-center space-x-4">
                        <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-gray-600 text-sm">{member.specialty}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{member.about}</p>
                    </div>
                  ))}
                </div>
    
                {/* Marketing & Talent */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Digital Marketing</h3>
                    {teamMembers.marketing.map((member, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4 mb-4">
                        <div className="flex items-center space-x-4">
                          <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                          <div>
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-gray-600 text-sm">{member.specialty}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{member.about}</p>
                      </div>
                    ))}
                  </div>
                  
                 
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4">Talent Acquisition</h3>
                    {teamMembers.talent.map((member, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="flex items-center space-x-4">
                          <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                          <div>
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-gray-600 text-sm">{member.specialty}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{member.about}</p>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
  )
}

export default About