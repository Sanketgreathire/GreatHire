import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from 'lucide-react';
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const blogContent = {
    'mastering-remote-work': {
      title: "Mastering Remote Work",
      author: "GreatHire Team",
      date: "January 15, 2025",
      readTime: "8 min read",
      icon: "🏠",
      gradient: "from-purple-500 to-pink-500",
      content: {
        intro: "Remote work has evolved from a temporary solution into a long-term transformation in how modern organizations operate. Over the past few years, companies across industries have realized that productivity is no longer limited to a traditional office environment. Advances in cloud computing, digital collaboration tools, and high-speed internet have enabled teams to work effectively from anywhere in the world. Employees now enjoy greater flexibility in managing their work schedules, which often leads to improved job satisfaction and higher productivity levels. At the same time, organizations benefit from reduced operational costs, improved talent accessibility, and the ability to build diverse global teams. As remote work becomes a permanent component of the modern workplace, mastering its strategies and best practices is essential for both employers and employees who want to succeed in the evolving digital economy.",

        sections: [
          {
            heading: "The Evolution of Remote Work",
            content: "The concept of remote work existed long before the pandemic, but it was not widely adopted by most organizations. Traditionally, companies relied heavily on physical offices where employees were expected to be present during fixed working hours. However, the COVID-19 pandemic accelerated a massive shift in workplace culture, forcing organizations to quickly adopt remote work practices in order to maintain business continuity. What started as a temporary adjustment soon revealed numerous benefits that companies had previously overlooked.\n\nBusinesses began to realize that remote work allowed employees to focus better without the distractions of commuting or crowded office spaces. In addition, organizations were able to reduce expenses related to office infrastructure, travel, and utilities. Many companies also discovered that they could access a much wider pool of talent when location was no longer a limiting factor.\n\nToday, remote work is no longer just about working from home. It represents a flexible and technology-driven model where employees can collaborate seamlessly from different cities, countries, or even continents. This shift has fundamentally changed how businesses think about productivity, teamwork, and workplace culture."
          },

          {
            heading: "Building a Strong Remote Culture",
            content: "Creating a strong and effective remote work culture requires intentional planning and consistent communication. Unlike traditional office environments where employees interact naturally throughout the day, remote teams rely heavily on digital communication platforms. Organizations must establish clear guidelines for communication, collaboration, and teamwork in order to ensure that everyone remains connected.\n\nCompanies often use tools like Slack, Microsoft Teams, and Zoom to maintain real-time communication between team members. Regular team meetings, virtual stand-ups, and one-on-one check-ins help maintain alignment and ensure that employees feel supported. Leaders also play an important role in promoting transparency and encouraging open discussions within remote teams.\n\nIn addition to professional communication, organizations should also create opportunities for informal interactions. Virtual coffee breaks, online team-building activities, and casual chats can help strengthen relationships and reduce the sense of isolation that remote workers may experience. A positive remote culture fosters trust, collaboration, and engagement among team members regardless of their physical location."
          },

          {
            heading: "Essential Tools and Technologies",
            content: "Technology plays a critical role in enabling successful remote work environments. Without the right tools and infrastructure, remote teams can struggle with coordination, communication, and productivity. Fortunately, modern technology provides a wide range of solutions designed specifically for distributed teams.\n\nProject management platforms such as Asana, Trello, and Monday.com help teams organize tasks, track progress, and collaborate efficiently on complex projects. Video conferencing tools like Zoom, Google Meet, and Microsoft Teams allow employees to hold face-to-face meetings regardless of distance. Cloud storage services such as Google Drive, Dropbox, and OneDrive ensure that team members can access important files and documents from anywhere.\n\nIn addition, many organizations use time tracking tools, productivity dashboards, and workflow automation systems to improve efficiency and accountability. When implemented correctly, these technologies create a seamless digital workplace where employees can collaborate, share ideas, and complete tasks effectively."
          },

          {
            heading: "Effective Communication Strategies",
            content: "Communication is one of the most important factors that determine the success of remote teams. Without face-to-face interaction, misunderstandings can occur more easily if communication practices are not well defined. To avoid confusion, organizations must establish clear expectations for communication across all departments.\n\nOne effective strategy is the use of asynchronous communication. Instead of expecting immediate responses to every message, employees can communicate through shared documents, task boards, or recorded updates that allow others to respond at convenient times. This approach is particularly useful for teams working across multiple time zones.\n\nIt is also important to document key decisions, meeting outcomes, and project updates. Written documentation ensures that information remains accessible to everyone and prevents important details from being lost. Encouraging transparency and clarity in communication builds trust and keeps remote teams aligned with their goals."
          },

          {
            heading: "Maintaining Work-Life Balance",
            content: "While remote work offers many advantages, it can also blur the boundaries between professional and personal life. Without a clear separation between home and work environments, employees may find themselves working longer hours or struggling to disconnect after work.\n\nTo maintain a healthy balance, employees should establish a dedicated workspace that allows them to focus during working hours. Creating a structured daily routine and setting clear working hours can help maintain discipline and prevent burnout. Taking regular breaks and stepping away from screens is also important for maintaining productivity and mental well-being.\n\nOrganizations should encourage employees to prioritize wellness and provide resources that support mental health. Flexible scheduling, wellness programs, and regular check-ins can help employees manage stress and maintain a healthy work-life balance."
          },

          {
            heading: "Hiring and Onboarding Remote Talent",
            content: "Recruiting remote employees requires a slightly different approach compared to traditional hiring. Since remote employees work independently and communicate digitally, recruiters must evaluate candidates based on their ability to work autonomously, manage time effectively, and communicate clearly.\n\nDuring the hiring process, companies often assess candidates through virtual interviews, online assessments, and practical tasks that simulate real work scenarios. Strong candidates typically demonstrate self-motivation, adaptability, and excellent communication skills.\n\nOnce hired, the onboarding process should provide new employees with clear documentation, access to necessary tools, and structured introductions to their team members. Regular check-ins during the first few weeks can help new hires adjust smoothly and feel supported within the organization."
          },

          {
            heading: "Measuring Remote Work Success",
            content: "Evaluating the effectiveness of remote work requires a shift in how organizations measure performance. Instead of focusing solely on hours worked, companies should prioritize measurable outcomes and results. Clear goals, key performance indicators (KPIs), and project milestones help teams stay focused and accountable.\n\nRegular performance reviews and feedback sessions allow managers to identify areas of improvement and support employee development. Data-driven insights can also help organizations refine their remote work strategies over time.\n\nUltimately, success in remote work depends on creating an environment where employees feel trusted, motivated, and empowered to perform at their best."
          }
        ],

        conclusion: "Mastering remote work is an ongoing process that requires adaptability, collaboration, and continuous improvement. Organizations that invest in effective communication systems, supportive workplace cultures, and reliable digital tools are better positioned to succeed in this new era of work. As businesses continue to evolve, remote work will remain a powerful strategy for attracting top talent and improving employee satisfaction. By embracing flexible work models and focusing on productivity rather than location, companies can build resilient and innovative teams prepared for the future."
      }
    }
  };

  const blog = blogContent[id] || blogContent['mastering-remote-work'];

  return (
    <>
      <Helmet>
        <title>{blog.title} | GreatHire Blog</title>
        <meta name="description" content={blog.content.intro} />
      </Helmet>

      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">

        <div className={`relative overflow-hidden bg-gradient-to-r ${blog.gradient} text-white py-20`}>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative container mx-auto px-6">
            <button
              onClick={() => navigate('/Main_blog_page')}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blogs
            </button>

            <div className="max-w-4xl">
              <div className="text-6xl mb-6">{blog.icon}</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{blog.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">

            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8">
              <p className="text-xl text-gray-700 leading-relaxed">
                {blog.content.intro}
              </p>
            </div>

            {blog.content.sections.map((section, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className={`w-2 h-8 bg-gradient-to-b ${blog.gradient} rounded-full`}></span>
                  {section.heading}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}

            <div className={`bg-gradient-to-r ${blog.gradient} rounded-3xl shadow-lg p-8 md:p-12 text-white`}>
              <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
              <p className="text-lg leading-relaxed">
                {blog.content.conclusion}
              </p>
            </div>

          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;