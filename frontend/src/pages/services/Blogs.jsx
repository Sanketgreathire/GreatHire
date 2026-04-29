import React, { memo } from 'react';
import {
  Sparkles, TrendingUp, Users, Briefcase, FileText,
  MessageSquare, Building2, ChevronRight, Star, Zap, Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const CATEGORY_ICONS = {
  "career-advice":    TrendingUp,
  "hiring-advice":    Users,
  "resume-tips":      FileText,
  "news":             Sparkles,
  "hr-insights":      Briefcase,
  "interview-tips":   MessageSquare,
  "company-insights": Building2,
};

// Tailwind purge-safe gradient pairs keyed by colour name
const COLOR_GRADIENTS = {
  blue:    { from: "from-blue-400",    to: "to-blue-600",    text: "text-blue-600" },
  green:   { from: "from-green-400",   to: "to-green-600",   text: "text-green-600" },
  purple:  { from: "from-purple-400",  to: "to-purple-600",  text: "text-purple-600" },
  pink:    { from: "from-pink-400",    to: "to-pink-600",    text: "text-pink-600" },
  orange:  { from: "from-orange-400",  to: "to-orange-600",  text: "text-orange-600" },
  cyan:    { from: "from-cyan-400",    to: "to-cyan-600",    text: "text-cyan-600" },
  emerald: { from: "from-emerald-400", to: "to-emerald-600", text: "text-emerald-600" },
};

const blogPosts = [
  {
    id: "mastering-remote-work",
    title: "Mastering Remote Work",
    description: "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.",
    icon: "🏠",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "ai-recruitment",
    title: "AI Recruitment",
    description: "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening. Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in.",
    icon: "🤖",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "winning-resumes",
    title: "Build Winning Resumes",
    description: "Make a strong first impression with a standout resume with key skills and clean formatting, optimized for ATS. GreatHire.in helps you land your ideal job by connecting you with the best opportunities.",
    icon: "📄",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "interview-preparations",
    title: "Interview Preparations",
    description: "Research the company, practice questions, and present yourself professionally. GreatHire.in provides expert tips and top job opportunities to help you succeed and make a lasting impression.",
    icon: "💼",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "future-of-work",
    title: "The Future Of Work",
    description: "AI-driven hiring, remote work, and flexible roles are reshaping the workplace, making upskilling crucial. GreatHire.in keeps you informed on trends and connects you to top career opportunities.",
    icon: "🚀",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "upskilling-career-growth",
    title: "Upskilling for Career Growth",
    description: "Continuous learning is essential for career advancement, with in-demand skills shifting toward AI, cloud computing, and data analytics. Investing in online courses and certifications pays dividends.",
    icon: "📚",
    gradient: "from-yellow-500 to-orange-500",
  },
];

const categories = [
  {
    id: "career-advice",
    title: "Career Advice",
    color: "blue",
    posts: [
      { title: "Advance Your Career in Tech",      description: "Explore top opportunities with GreatHire.in, gain expert insights, and access resources to accelerate your growth. Stay ahead by upskilling, following industry trends, and landing your dream job.", icon: "💻" },
      { title: "Work-Life Balance Tips",            description: "Balancing work and personal life is essential for success. Set realistic boundaries, take breaks, and manage time to reduce stress. GreatHire.in offers flexible job opportunities for a healthy work-life balance.", icon: "⚖️" },
      { title: "Networking For Career Growth",      description: "Networking opens doors to career growth — engage on LinkedIn, attend events, and build meaningful connections. GreatHire.in helps you find the right opportunities and insights to advance your career.", icon: "🤝" },
    ],
  },
  {
    id: "hiring-advice",
    title: "Hiring Advice",
    color: "green",
    posts: [
      { title: "Mastering Remote Work",     description: "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.", icon: "🌐" },
      { title: "AI in Recruitment",         description: "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening. Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in.", icon: "🤖" },
      { title: "Industry-Specific Hiring",  description: "Tech hiring emphasizes AI, cloud computing, and cybersecurity skills, while non-tech sectors focus on adaptability and customer experience. Remote work and gig economy roles are growing across both industries.", icon: "🏭" },
    ],
  },
  {
    id: "resume-tips",
    title: "Resume Tips",
    color: "purple",
    posts: [
      { title: "Building a Winning Resume", description: "A strong resume showcases skills, achievements, and experience with clear formatting and relevant keywords. GreatHire.in helps you find top talent with ATS-friendly resumes for faster, smarter hiring.", icon: "✍️" },
      { title: "ATS Optimization",          description: "In today's job market, an ATS-friendly resume is crucial to get noticed. Applicant Tracking Systems scan resumes for key criteria before they reach recruiters.", icon: "🎯" },
      { title: "Using Keywords",            description: "Using industry-specific keywords boosts your resume's visibility to ATS. Review job descriptions to spot and include common terms and phrases.", icon: "🔑" },
    ],
  },
  {
    id: "news",
    title: "Trending Topics",
    color: "pink",
    posts: [
      { title: "The Future of Work",                    description: "The workplace is shifting with AI-driven hiring, remote work, and flexible roles, making upskilling essential. GreatHire.in keeps you updated on trends and connects you with top career opportunities.", icon: "🔮" },
      { title: "Future Skills for Job Seekers",         description: "With automation and AI reshaping industries, in-demand skills include cloud computing, cybersecurity, data analytics, and digital marketing. Soft skills like adaptability and collaboration are also essential.", icon: "🎓" },
      { title: "Impact of Global Events on Workforce",  description: "Economic and political events such as recessions, conflicts, and policy changes influence job markets, hiring trends, and remote work adoption. Businesses adjust workforce strategies based on global stability.", icon: "🌍" },
    ],
  },
  {
    id: "hr-insights",
    title: "HR Insights",
    color: "orange",
    posts: [
      { title: "Interview Preparation",           description: "A structured interview process helps assess candidates through behavioral questions, cultural fit, and problem-solving skills. GreatHire.in offers expert insights and AI-driven tools to streamline hiring.", icon: "📋" },
      { title: "Behavioral Interview Techniques", description: "Behavioral interviewing assesses candidates based on past experiences and actions in specific situations. It operates on the principle that past behavior is a strong predictor of future performance.", icon: "🎭" },
      { title: "Cultural Fit Assessment",         description: "Cultural fit assessment evaluates how well a candidate aligns with a company's values, work environment, and team dynamics, ensuring the candidate's work style complements the organization's mission.", icon: "🏢" },
    ],
  },
  {
    id: "interview-tips",
    title: "Interview Tips",
    color: "cyan",
    posts: [
      { title: "Effective Job Interview Strategies", description: "Research the company, practice answers, and use the STAR method to showcase your skills. GreatHire.in provides expert tips and job opportunities to help you ace your interview and land your dream job.", icon: "💡" },
      { title: "Post-Interview Follow-Up",           description: "Sending a thank-you email within 24 hours shows professionalism and reinforces interest in the role. A follow-up message can also restate key qualifications and inquire about the hiring timeline.", icon: "📧" },
      { title: "Common Interview Questions",         description: "Preparing for frequently asked questions like 'Tell me about yourself' and 'What are your strengths?' helps candidates answer confidently and make a strong impression.", icon: "❓" },
    ],
  },
  {
    id: "company-insights",
    title: "Company Insights",
    color: "emerald",
    posts: [
      { title: "Top Companies Hiring in 2025", description: "In 2025, top companies like Amazon, Google, and GE Aerospace are expanding, offering diverse job opportunities. GreatHire.in helps you stay updated on the latest openings, including remote and flexible roles.", icon: "🏆" },
      { title: "Industry Trends",              description: "Emerging trends include AI-driven automation, sustainable business practices, and the rise of remote/hybrid work models. Companies are also focusing on digital transformation and cybersecurity to stay competitive.", icon: "📈" },
      { title: "Development Programs",         description: "Leading companies invest in training, mentorship, and upskilling to boost employee growth. Programs like leadership development, technical certifications, and continuous learning enhance productivity and retention.", icon: "🎯" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sub-components (memo prevents needless re-renders)
// ---------------------------------------------------------------------------

const FeaturedCard = memo(({ post, onNavigate }) => (
  <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-3 border border-gray-100">
    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
    <div className="p-8">
      <div className="relative mb-6">
        <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${post.gradient} flex items-center justify-center text-5xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          {post.icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h3>
      <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">{post.description}</p>
      <button
        type="button"
        onClick={() => onNavigate(`/blog/${post.id}`)}
        className="flex items-center text-blue-600 font-bold cursor-pointer bg-transparent border-0 p-0"
      >
        Read More <ChevronRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Star className="w-5 h-5 text-yellow-500" />
    </div>
  </div>
));
FeaturedCard.displayName = "FeaturedCard";

const CategoryCard = memo(({ post, colorKey }) => {
  const { from, to, text } = COLOR_GRADIENTS[colorKey] ?? COLOR_GRADIENTS.blue;
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-3">
      <div className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center text-3xl shadow-lg`}>
            {post.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800 flex-1 leading-tight mt-1">{post.title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">{post.description}</p>
        <div className={`flex items-center ${text} font-bold cursor-pointer`}>
          Learn More <ChevronRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </div>
  );
});
CategoryCard.displayName = "CategoryCard";

const CategorySection = memo(({ category, index }) => {
  const IconComponent = CATEGORY_ICONS[category.id];
  const { from, to } = COLOR_GRADIENTS[category.color] ?? COLOR_GRADIENTS.blue;
  return (
    <section
      id={category.id}
      className={`py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'}`}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-30" />
            <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${from} ${to} flex items-center justify-center text-white shadow-xl`}>
              {IconComponent && <IconComponent className="w-8 h-8" />}
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center">{category.title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.posts.map((post, i) => (
            <CategoryCard key={`${category.id}-${i}`} post={post} colorKey={category.color} />
          ))}
        </div>
      </div>
    </section>
  );
});
CategorySection.displayName = "CategorySection";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const Blogs = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>GreatHire Blog | Career Guidance, Employment Patterns, and Perspectives on the Future of Work</title>
        <meta
          name="description"
          content="GreatHire Blog: Your one-stop destination for expert career advice, effective hiring strategies, and interview tips, along with guidance on resume optimization and the future of work. Our insight will help both job seekers and employers deal with the most competitive markets, be it AI-driven recruitment and remote work trends or preparing for an interview and upskilling. GreatHire is based in Hyderabad State, India, and serves businesses, recruiters, and professionals throughout the Hyderabad State region with innovative hiring solutions and career guidance."
        />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white -mt-[117px] pt-[117px]">
          <div className="absolute inset-0 bg-black opacity-10" />
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-5 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700" />
          </div>
          <div className="relative container mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-6 shadow-lg border border-white/30">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold">Your Career Hub</span>
              <Star className="w-4 h-4 text-yellow-300" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Unlock Your Potential with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 drop-shadow-lg">
                GreatHire
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto font-light">
              Your all-in-one platform for job applications, recruitment, and career growth.<br />
              <span className="font-semibold text-white">Connecting talent with opportunity!</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">Trusted by 10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">AI-Powered Matching</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Featured Banner ── */}
        <div className="container mx-auto px-6 -mt-8 relative z-10 mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-56 h-56 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-8xl shadow-2xl">
                  🚀
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-full mb-4 text-sm font-bold shadow-lg">
                  <Sparkles className="w-4 h-4" /> Featured Insight
                </div>
                <h3 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text leading-tight">
                  GreatHire Insights<br />
                  <span className="text-2xl md:text-4xl">The Future of Work</span>
                </h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
                  The way people work is evolving, with professionals seizing new opportunities and reshaping industries.
                </p>
                <p className="text-gray-500 italic font-medium">- GreatHire Team</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Featured Articles ── */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full mb-4 text-sm font-bold shadow-lg">
              <Star className="w-4 h-4" /> Top Picks
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-transparent bg-clip-text">
              Featured Articles
            </h2>
            <p className="text-xl text-gray-600">Discover insights to accelerate your career</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <FeaturedCard key={post.id} post={post} onNavigate={navigate} />
            ))}
          </div>
        </section>

        {/* ── Category Sections ── */}
        {categories.map((category, index) => (
          <CategorySection key={category.id} category={category} index={index} />
        ))}

        {/* ── CTA ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700" />
          </div>
          <div className="relative container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-6 shadow-lg border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold">Join Now</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who have found their dream jobs through GreatHire
            </p>
            <button
              type="button"
              className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-3 group"
            >
              Get Started Today{" "}
              <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default Blogs;