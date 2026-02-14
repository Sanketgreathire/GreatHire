import { useEffect } from "react";
import Lottie from "lottie-react";
import career from "../assets/Career Animation.json";
import hiring from "../assets/Human Resources Approval Animation.json";
import resume from "../assets/Recolored job proposal review animation.json";
import remoteWork from "../assets/Work from Home.json";



function BlogPage() {
    useEffect(() => {
        /* ================= BLOG SLIDER ================= */
        const blogCards = document.getElementById("blogCards");
        const nextBtn = document.getElementById("nextBtn");
        const prevBtn = document.getElementById("prevBtn");

        if (!blogCards || !nextBtn || !prevBtn) return;

        const card = document.querySelector(".blog-card");
        if (!card) return;

        const scrollAmount = card.offsetWidth + 24;

        nextBtn.onclick = () => (blogCards.scrollLeft += scrollAmount);
        prevBtn.onclick = () => (blogCards.scrollLeft -= scrollAmount);

        /* ================= INSIGHT SLIDER ================= */
        const slider = document.getElementById("cardSlider");
        const cards = document.querySelectorAll(".insight-card");
        if (!slider || cards.length === 0) return;

        let index = 0;
        const cardWidth = 320;

        const autoSlide = () => {
            index++;
            if (index > cards.length - 3) index = 0;
            slider.style.transform = `translateX(-${index * cardWidth}px)`;
        };

        let interval = setInterval(autoSlide, 4000);
        slider.onmouseenter = () => clearInterval(interval);
        slider.onmouseleave = () => (interval = setInterval(autoSlide, 4000));

        return () => clearInterval(interval);
    }, []);

    const insightData = [
        {
            title: "Career Advice",
            animation: career,
        },
        {
            title: "Hiring Advice",
            animation: hiring,
        },
        {
            title: "Resume Tips",
            animation: resume,
        },
        {
            title: "Trending Topics",
            animation: remoteWork,
        },
    ];

    return (
        <>
            <style>
        {`
          /* Video Container Styles */
          .video-banner-section {
            position: relative;
            width: 100%;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 4rem 4rem;
          }

          .video-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
          }

          /* Optional: Add overlay for better text readability */
          .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.3);
            z-index: 1;
          }

          .content-wrapper {
            position: relative;
            z-index: 10;
            max-width: 640px;
            width: 100%;
            text-align: center;
            color: #000;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.85);
            border-radius: 1rem;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
          }

          .main-title {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1.5rem;
          }

          .brand-name {
            font-size: 3rem;
            font-weight: 700;
          }

          .highlight-text {
            color: #2563eb;
          }

          .description-text {
            font-size: 1rem;
            line-height: 1.7;
            margin-top: 1.5rem;
            padding: 0 2rem;
            color: #374151;
          }

          .author-text {
            font-size: 1rem;
            font-weight: 600;
            font-style: italic;
            margin-top: 1rem;
            color: #1f2937;
          }

          /* Tablet Responsive (768px - 1023px) */
          @media (max-width: 1023px) {
            .video-banner-section {
              min-height: 80vh;
              padding: 3rem 1.5rem;
            }

            .content-wrapper {
              padding: 1.5rem;
            }

            .main-title {
              font-size: 2rem;
            }

            .brand-name {
              font-size: 2.5rem;
            }

            .description-text {
              font-size: 0.95rem;
              padding: 0 1rem;
            }

            .author-text {
              font-size: 0.95rem;
            }
          }

          /* Mobile Responsive (below 768px) */
          @media (max-width: 767px) {
            .video-banner-section {
              min-height: 100vh;
              padding: 2rem 1rem;
              align-items: flex-end;
              justify-content: center;
              padding-bottom: 3rem;
            }

            .content-wrapper {
              padding: 1.5rem 1rem;
              max-width: 100%;
            }

            .main-title {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }

            .brand-name {
              font-size: 2rem;
              display: block;
              margin-bottom: 0.5rem;
            }

            .description-text {
              font-size: 0.875rem;
              line-height: 1.6;
              padding: 0;
              margin-top: 1rem;
            }

            .author-text {
              font-size: 0.875rem;
              margin-top: 0.75rem;
            }
          }

          /* Extra Small Mobile (below 480px) */
          @media (max-width: 479px) {
            .video-banner-section {
              padding: 1.5rem 0.75rem;
            }

            .content-wrapper {
              padding: 1.25rem 0.875rem;
              border-radius: 0.75rem;
            }

            .main-title {
              font-size: 1.25rem;
            }

            .brand-name {
              font-size: 1.75rem;
            }

            .description-text {
              font-size: 0.813rem;
            }

            .author-text {
              font-size: 0.813rem;
            }
          }
        `}
      </style>
            {/* ================= HERO ================= */}
            <section className="video-banner-section">
                {/* Video Background */}
                

                {/* Optional Overlay for better text visibility */}
                <div className="video-overlay"></div>

                {/* Content */}
                <div className="content-wrapper">
                    <h1 className="main-title">
                        <span className="brand-name">
                            Great<span className="highlight-text">Hire</span>
                        </span>
                        <br />
                        Insights – The Future of Work
                    </h1>

                    <p className="description-text">
                        "Your all-in-one platform for job applications and recruitment—connecting talent with opportunity and empowering professionals to seize new possibilities in an evolving world of work."
                    </p>

                    <p className="author-text">– GreatHire</p>
                </div>
            </section>
            {/* ================= BLOG SLIDER ================= */}
            <section className="py-16 px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">Our Recent Articles</h2>
                        <p className="text-gray-500">
                            Stay informed with our latest insights
                        </p>
                    </div>

                    <div className="space-x-2">
                        <button
                            id="prevBtn"
                            className="px-4 py-2 border rounded-full hover:bg-gray-100"
                        >
                            ←
                        </button>
                        <button
                            id="nextBtn"
                            className="px-4 py-2 border rounded-full hover:bg-gray-100"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div
                    id="blogCards"
                    className="flex gap-6 overflow-x-auto scroll-smooth"
                >
                    {[
                        "Mastering Remote Work",
                        "From Store to Online",
                        "Security First",
                        "Smart Analytics",
                    ].map((title, i) => (
                        <div
                            key={i}
                            className="blog-card min-w-[320px] bg-white rounded-xl shadow hover:shadow-lg"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                                className="h-48 w-full object-cover rounded-t-xl"
                            />
                            <div className="p-6">
                                <h3 className="font-semibold text-lg">{title}</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    POS systems now do much more than process payments.
                                </p>
                                <a
                                    href="#"
                                    className="inline-block mt-4 text-blue-600 font-semibold"
                                >
                                    Read More →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= FEATURED ARTICLES ================= */}
            <section className="py-20 bg-gray-50 px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold">
                            <span className="text-blue-600">Featured</span> Articles
                        </h2>
                        <p className="text-gray-600 mt-4">
                            Articles you must read to stay competitive in your field.
                        </p>
                        <img src="/vector1-removebg-preview.png" className="mt-6 w-56" />
                    </div>

                    <div className="space-y-6">
                        {["Retail", "Restaurant", "Hospitality"].map((cat, i) => (
                            <div key={i} className="bg-white rounded-xl shadow p-6">
                                <span className="text-sm text-blue-600 font-semibold">
                                    {cat}
                                </span>
                                <h3 className="font-bold text-lg mt-2">
                                   Using Smart POS to Improve Business.
                                </h3>
                                <p className="text-gray-600 mt-2 text-sm">
                                    Discover how operations are changed by contemporary POS systems.
                                </p>
                                <a
                                    href="#"
                                    className="text-blue-600 font-semibold mt-3 inline-block"
                                >
                                    Read More →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CAREER ADVICE ================= */}
            <section className="py-20 px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        {["Resume Tips", "Hiring Trends", "Interview Prep"].map(
                            (item, i) => (
                                <div key={i} className="bg-white rounded-xl shadow p-6">
                                    <h3 className="font-bold text-lg">{item}</h3>
                                    <p className="text-gray-600 mt-2 text-sm">
                                        Useful tips to advance your career.
                                    </p>
                                    <a
                                        href="#"
                                        className="text-blue-600 font-semibold mt-3 inline-block"
                                    >
                                        Read More →
                                    </a>
                                </div>
                            )
                        )}
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold">
                            Career <span className="text-blue-600">Advice</span>
                        </h2>
                        <p className="text-gray-600 mt-4">
                            Professional advice to help you achieve success.
                        </p>
                        <img src="/vector2-removebg-preview.png" className="mt-6 w-56" />
                    </div>
                </div>
            </section>

            {/* ================= INSIGHTS SLIDER ================= */}
            <section className="bg-gray-50 py-16 px-8 rounded-xl">
                <h2 className="text-center text-3xl font-bold">Industry Insights</h2>
                <p className="text-center text-gray-500 mt-2">
                    Fast advice for experts
                </p>

                <div className="overflow-hidden mt-10">
                    <div
                        id="cardSlider"
                        className="flex gap-6 transition-transform duration-500"
                    >
                        {insightData.map((item, i) => (
                            <div
                                key={i}
                                className="insight-card min-w-[300px] bg-white p-8 rounded-xl shadow flex flex-col items-center text-center"
                            >
                                <Lottie
                                    animationData={item.animation}
                                    loop
                                    className="w-40 h-40"
                                />

                                <h5 className="font-semibold text-lg mt-4">{item.title}</h5>

                                <p className="text-gray-600 mt-2">
                                    advice to advance your career.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default BlogPage;