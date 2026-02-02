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
      description:
        "Artificial Intelligence is driving innovation across healthcare, finance, and technology sectors. From machine learning algorithms to neural networks, AI is reshaping how we work and live. In healthcare, AI assists in early disease detection, personalized treatment plans, and drug discovery, enabling faster and more accurate medical decisions. In finance, intelligent algorithms streamline fraud detection, optimize investment strategies, and improve customer experiences through predictive analytics. Meanwhile, the technology sector leverages AI to enhance automation, natural language processing, and computer vision, powering smarter applications and devices. As AI continues to evolve, it not only increases efficiency and productivity but also opens new possibilities for creativity, problem-solving, and transforming industries worldwide. Ethical AI development and responsible implementation remain crucial to ensure these advancements benefit society as a whole.",
      image: "/AI_recruitment.jpg",
    },
    {
      id: 2,
      title: "Innovation Drives Growth",
      description:
        "Innovation drives growth by transforming ideas into actionable solutions that create value, improve efficiency, and open new opportunities. Businesses that embrace innovation stay ahead of competition, adapt to changing markets, and empower their teams to solve complex challenges. In today’s fast-paced world, growth isn’t just about expansion—it’s about evolving intelligently, leveraging technology, and continuously reimagining what’s possible. Blockchain technology, for example, ensures transparency and security in digital systems. This revolutionary technology is transforming industries from finance to supply chain management.",
      image: "/technology_bg.jpg",
    },
    {
      id: 3,
      title: "Digital Transformation",
      description:
        "Digital Transformation is the process of leveraging digital technologies to fundamentally change how businesses operate, deliver value to customers, and stay competitive in a rapidly evolving marketplace. From cloud computing and AI to data analytics and automation, digital transformation enables organizations to streamline processes, enhance customer experiences, and make smarter, data-driven decisions. It’s not just about adopting new tools—it’s about reshaping culture, workflows, and business models to thrive in the digital age.",
      image: "/vector.png",
    },
    {
      id: 4,
      title: "Technology Solutions",
      description:
        "Technology Solutions encompass the tools, platforms, and strategies that help businesses solve complex problems, optimize operations, and drive growth. From software applications and cloud services to AI-driven analytics and automation, technology solutions enable organizations to work smarter, respond faster, and deliver superior experiences to customers. By integrating the right technologies, companies can unlock efficiency, innovation, and scalability, ensuring they stay ahead in an increasingly digital and competitive world.",
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

      <section className="max-w-6xl mx-auto px-4 py-12 my-10">
        {/* Hero Image */}
        <div className="relative w-full h-96 sm:h-[400px] overflow-hidden rounded-xl shadow-lg">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/bannerImage2.png")}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mt-8 mb-4 text-gray-900">
          {currentSlide.title}
        </h1>

        {/* Description split into paragraphs */}
        {currentSlide.description.split(". ").map((para, index) => (
          <p key={index} className="mt-4 text-gray-700 text-lg leading-relaxed">
            {para}.
          </p>
        ))}

        {/* Key Highlights / Callout Box */}
        <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Key Takeaways
          </h2>
          <ul className="list-disc list-inside text-gray-800">
            <li>AI and automation are transforming industries rapidly.</li>
            <li>Innovation drives growth and competitive advantage.</li>
            <li>Digital transformation reshapes culture, workflow, and strategy.</li>
            <li>Technology solutions optimize operations and enhance customer experience.</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate(`/TheFuture/${currentSlide.id + 1}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
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
