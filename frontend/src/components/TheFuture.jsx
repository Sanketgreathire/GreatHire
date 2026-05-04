import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

const TheFuture = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const slides = [
     {
    id: 1,
    title: "Future of Technology",
    description: "The future of technology is not only shaped by innovation, but by the people who bring ideas to life with purpose and determination.At GreatHire, we believe that success begins with identifying the right talent and empowering individuals to thrive in roles where they can create real impact. Our approach focuses on aligning skills, potential, and opportunity to build strong, future-ready teams that drive meaningful change across industries.By combining human insight with smart technology, we aim to redefine how organizations discover talent and how individuals unlock their true potential in an ever-evolving digital landscape. In today’s rapidly evolving digital ecosystem, organizations require more than just talent — they need individuals who can adapt, innovate, and lead change.At GreatHire, we are committed to transforming the hiring experience by leveraging intelligent solutions that simplify recruitment while enhancing accuracy and efficiency. Our platform is designed to bridge the gap between opportunity and capability, enabling businesses to make informed hiring decisions and candidates to discover roles where they can truly excel.Through continuous innovation and a people-first approach, we strive to build a smarter, more connected future of work.",
    image: "/AI_recruitment.jpg",
  },
  {
    id: 2,
    title: "Innovation Drives Growth",
    description: "Innovation drives growth by transforming ideas into actionable solutions that create value, improve efficiency, and open new opportunities.Businesses that embrace innovation stay ahead of competition, adapt to changing markets, and empower their teams to solve complex challenges. In today’s fast-paced world, growth is not just about expansion—it is about evolving intelligently, leveraging technology, and continuously reimagining what is possible.Blockchain technology, for example, ensures transparency and security in digital systems and is transforming industries from finance to supply chain management. Moreover, innovation enhances customer experiences through personalization, automation, and faster response systems.Companies that invest in research and development are better positioned to lead the market and sustain long-term growth. By fostering a culture of innovation, organizations can unlock new revenue streams, improve operational efficiency, and remain resilient in a dynamic business environment.",
    image: "/technology_bg.jpg",
  },
  {
    id: 3,
    title: "Digital Transformation",
    description: "Digital transformation is the process of leveraging digital technologies to fundamentally change how businesses operate, deliver value to customers, and stay competitive in a rapidly evolving marketplace.From cloud computing and artificial intelligence to data analytics and automation, it enables organizations to streamline processes, enhance customer experiences, and make smarter, data-driven decisions. It is not just about adopting new tools—it is about reshaping culture, workflows, and business models to thrive in the digital age.Furthermore, it supports real-time collaboration, remote work capabilities, and improved scalability. Organizations can use advanced analytics to gain insights into customer behavior, predict trends, and optimize decision-making.By integrating digital solutions across all levels, businesses achieve greater agility, innovation, and long-term sustainability. Digital transformation also empowers organizations to create more personalized and engaging customer experiences by leveraging data-driven insights and intelligent automation.By integrating advanced technologies such as artificial intelligence, cloud computing, and IoT, businesses can enhance operational efficiency, reduce costs, and respond quickly to changing market demands. This continuous evolution not only strengthens competitiveness but also enables companies to innovate at scale, ensuring long-term growth, resilience, and the ability to adapt in an increasingly digital-first world.",
    image: "/vector.png",
  },
  {
    id: 4,
    title: "Technology Solutions",
    description: "Technology solutions encompass the tools, platforms, and strategies that help businesses solve complex problems, optimize operations, and drive growth.From software applications and cloud services to AI-driven analytics and automation, these solutions enable organizations to work smarter, respond faster, and deliver superior customer experiences. By integrating the right technologies, companies can unlock efficiency, innovation, and scalability, ensuring they remain competitive in a digital-first world.Modern solutions also focus on security, scalability, and seamless system integration. Businesses can leverage APIs, microservices architecture, and cloud infrastructure to build flexible and resilient applications. These advancements reduce operational costs while improving performance, reliability, and user satisfaction.Ultimately, adopting the right technology solutions empowers organizations to innovate continuously and maintain a strong competitive edge.",
    image: "/agentic-bg.png",
  },
  ];

  const slide = slides.find((item) => item.id === Number(id));
  const currentSlide = slide || slides[0];

  if (!currentSlide) {
    return (
      <>
        <Helmet>
          <title>GreatHire - The Future</title>
        </Helmet>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl font-bold">Content not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>GreatHire - {currentSlide.title}</title>
      </Helmet>
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-12 my-10 bg-white dark:bg-gray-950 transition-colors duration-300">
        {/* Hero Image */}
        <div className="relative w-full h-96 sm:h-[400px] overflow-hidden rounded-xl shadow-lg">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => (e.target.src = "/bannerImage2.png")}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mt-8 mb-4 text-gray-900 dark:text-white transition-colors duration-300">
          {currentSlide.title}
        </h1>

        {/* Description split into paragraphs */}
        {currentSlide.description.split(". ").map((para, index) => (
          <p key={index} className="mt-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-300">
            {para}.
          </p>
        ))}

        {/* Key Highlights / Callout Box */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-lg shadow transition-colors duration-300">
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-2 transition-colors duration-300">
            Key Takeaways
          </h2>
          <ul className="list-disc list-inside text-gray-800 dark:text-gray-300 transition-colors duration-300">
            <li>AI and automation are transforming industries rapidly.</li>
            <li>Innovation drives growth and competitive advantage.</li>
            <li>Digital transformation reshapes culture, workflow, and strategy.</li>
            <li>Technology solutions optimize operations and enhance customer experience.</li>
            <li>Automation reduces manual effort and increases operational efficiency.</li>
            <li>Data-driven decision making improves accuracy and strategic planning.</li>
            <li>Security and scalability are essential in modern tech solutions.</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate(`/TheFuture/${currentSlide.id + 1}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Next →
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TheFuture;
