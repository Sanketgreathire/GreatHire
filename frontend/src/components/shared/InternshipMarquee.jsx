import { useNavigate } from "react-router-dom";

const COURSES = [
  { id: 1, title: "Full Stack Java Developer", category: "Full Stack", link: "/courses/java-training" },
  { id: 2, title: "Full Stack Python Developer", category: "Full Stack", link: "/courses/python-training" },
  { id: 3, title: "Data Science", category: "Data Science", link: "/courses/data-science-training" },
  { id: 4, title: "AWS & DevOps", category: "Cloud", link: "/courses/aws-devops-training" },
  { id: 5, title: "Digital Marketing", category: "Digital Marketing", link: "/courses/digital-marketing-training" },
  { id: 6, title: "Testing Tools", category: "Testing", link: "/courses/testing-tools-training" },
  { id: 7, title: "SAP FICO", category: "SAP", link: "/courses/sap-fico-training" },
  { id: 8, title: "Business Analyst", category: "Business Analyst", link: "/courses/business-analytics-training" },
  { id: 9, title: "BIM", category: "BIM", link: "/courses/bim-training" },
  { id: 10,title: "Medical Training", category: "Medical Training", link: "/courses/medical-training" },
];

const doubled = [...COURSES, ...COURSES];

export default function InternshipMarquee() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-md overflow-hidden">
      {/* Fixed Label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full m-1 border bg-gradient-to-r from-pink-600 via-pink-600 to-pink-600 text-white">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-white text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap">
          Skill Development
        </span>
      </div>

      {/* Scrolling Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-blue-600 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-pink-600 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll-infinite hover:[animation-play-state:paused]">
          {doubled.map((course, i) => (
            <span key={i} className="flex items-center gap-3 px-4 py-2 whitespace-nowrap">
              <span className="text-base">{course.icon}</span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm sm:text-base text-white font-medium">{course.title}</span>
                <span className="text-white/70 text-xs">{course.category}</span>
              </span>
              <button
                onClick={() => navigate(course.link)}
                className="ml-2 px-3 py-1 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/40 transition-colors whitespace-nowrap"
              >
                View
              </button>
              <span className="text-white/50 text-lg leading-none">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
