import { useEffect, useRef, useState } from "react";
import NumberCounter from "./NumberCounter";

const AchievementsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const achievements = [
    { id: 1, value: 500, suffix: "+", label: "Projects Completed" },
    { id: 2, value: 98, suffix: "%", label: "Client Satisfaction" },
    { id: 3, value: 28, suffix: "+", label: "Awards Won" },
    { id: 4, value: 573, suffix: "+", label: "Cups of Coffee" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // ek hi baar run karega
        }
      },
      { threshold: 0.3 } // 30% section visible hone par trigger hoga
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-4xl font-bold text-blue-600 mb-2">
                <NumberCounter end={item.value} trigger={isVisible} />{item.suffix}
              </h3>
              <p className="text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsSection;
