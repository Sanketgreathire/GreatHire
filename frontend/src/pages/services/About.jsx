import React from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

import { Users, Target, Award, Briefcase, Building2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const About = () => {

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
    
      const teamMembers = {
        leadership: [
          {
            role: "Founder",
            name: "Sarah Johnson",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
            achievement: "15+ years of industry experience",
            about: "A visionary leader with a passion for transforming the recruitment industry. Sarah founded GreatHire with the mission to bridge the gap between talent and opportunity using cutting-edge technology. Her background in both tech and HR has been instrumental in shaping GreatHire's innovative approach.",
          },
          {
            role: "CEO",
            name: "Michael Chen",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
            achievement: "Led 3 successful tech startups",
            about: "With a proven track record in scaling tech companies, Michael brings strategic insight and operational excellence to GreatHire. His focus on AI-driven solutions and user experience has revolutionized how companies approach hiring.",
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
    
          {/* Our Story Section */}
          <div className="py-16 bg-gray-50">
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
                    Today, we re proud to be one of India s fastest-growing recruitment platforms, but our mission remains the same: to create meaningful connections that drive careers and businesses forward.
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