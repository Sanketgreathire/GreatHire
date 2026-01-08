import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Users, Megaphone, BarChart3, ShieldCheck, Lock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JobsHiringSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const autoScrollInterval = useRef(null);
    const navigate = useNavigate();

    const jobs = [{ id: 1, title: 'Software Developer', company: 'TCS', location: 'Bangalore', salary: '₹5-8 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Briefcase, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 2, title: 'HR Manager', company: 'Infosys', location: 'Mumbai', salary: '₹4-6 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Users, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }, { id: 3, title: 'Marketing Lead', company: 'Flipkart', location: 'Delhi', salary: '₹5-8 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Megaphone, iconBg: 'bg-pink-100', iconColor: 'text-pink-600' }, { id: 4, title: 'Data Analyst', company: 'Wipro', location: 'Hyderabad', salary: '₹6-9 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: BarChart3, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 5, title: 'Frontend Developer', company: 'Amazon', location: 'Pune', salary: '₹4.5-8 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Briefcase, iconBg: 'bg-green-100', iconColor: 'text-green-600' }, { id: 6, title: 'Product Manager', company: 'Google', location: 'Bangalore', salary: '₹5-10 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Users, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }, { id: 7, title: 'Backend Developer', company: 'Microsoft', location: 'Hyderabad', salary: '₹8-12 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Briefcase, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }, { id: 8, title: 'UI/UX Designer', company: 'Adobe', location: 'Bangalore', salary: '₹3.8-9 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Megaphone, iconBg: 'bg-pink-100', iconColor: 'text-pink-600' }, { id: 9, title: 'DevOps Engineer', company: 'IBM', location: 'Chennai', salary: '₹10-15 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: BarChart3, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 10, title: 'Software Developer', company: 'GreatHire (On behalf of a Client)', location: 'Bangalore', salary: '₹8-12 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Briefcase, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 11, title: 'Frontend Developer', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹6-9 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Briefcase, iconBg: 'bg-green-100', iconColor: 'text-green-600' }, { id: 12, title: 'Backend Developer', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹5-9 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Briefcase, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }, { id: 13, title: 'Full Stack Developer', company: 'GreatHire (On behalf of a Client)', location: 'Bangalore', salary: '₹12-15 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Briefcase, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 14, title: 'Java Developer', company: 'GreatHire (On behalf of a Client)', location: 'Chennai', salary: '₹8-12 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Briefcase, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }, { id: 15, title: 'Python Developer', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹5-7 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Briefcase, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 16, title: 'React Developer', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹8-12 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Briefcase, iconBg: 'bg-pink-100', iconColor: 'text-pink-600' }, { id: 17, title: 'Node.js Developer', company: 'GreatHire (On behalf of a Client)', location: 'Gurgaon', salary: '₹10-15 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Briefcase, iconBg: 'bg-green-100', iconColor: 'text-green-600' }, { id: 18, title: 'DevOps Engineer', company: 'GreatHire (On behalf of a Client)', location: 'Bangalore', salary: '₹8-12 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: BarChart3, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 19, title: 'Cloud Engineer', company: 'GreatHire (On behalf of a Client)', location: 'Pune', salary: '₹12-18 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: BarChart3, iconBg: 'bg-green-100', iconColor: 'text-green-600' }, { id: 20, title: 'Data Analyst', company: 'GreatHire (On behalf of a Client)', location: 'Mumbai', salary: '₹6-10 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: BarChart3, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 21, title: 'Data Science', company: 'GreatHire (On behalf of a Client)', location: 'Bangalore', salary: '₹5-9 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: BarChart3, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 22, title: 'AI Engineer', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹8-12 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: BarChart3, iconBg: 'bg-green-100', iconColor: 'text-green-600' }, { id: 23, title: 'ML Engineer', company: 'GreatHire (On behalf of a Client)', location: 'Pune', salary: '₹8-15 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: BarChart3, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }, { id: 24, title: 'QA Engineer', company: 'GreatHire (On behalf of a Client)', location: 'Chennai', salary: '₹6-10 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Briefcase, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 25, title: 'Automation Tester', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹8-12 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Briefcase, iconBg: 'bg-pink-100', iconColor: 'text-pink-600' }, { id: 26, title: 'HR Executive', company: 'GreatHire (On behalf of a Client)', location: 'Mumbai', salary: '₹4-8 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Users, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }, { id: 27, title: 'HR Manager', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹4-10 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Users, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }, { id: 28, title: 'Recruiter', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹6-8 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Users, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }, { id: 29, title: 'Talent Acquisition Specialist', company: 'GreatHire (On behalf of a Client)', location: 'Bangalore', salary: '₹8-12 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Users, iconBg: 'bg-pink-100', iconColor: 'text-pink-600' }, { id: 30, title: 'Payroll Executive', company: 'GreatHire (On behalf of a Client)', location: 'Pune', salary: '₹6-10 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Users, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 31, title: 'Product Manager', company: 'GreatHire (On behalf of a Client)', location: 'Bangalore', salary: '₹5-12 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Users, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }, { id: 32, title: 'Project Manager', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '₹3-11 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Users, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }, { id: 33, title: 'Program Manager', company: 'GreatHire (On behalf of a Client)', location: 'Mumbai', salary: '₹7-13 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Users, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 34, title: 'Scrum Master', company: 'GreatHire (On behalf of a Client)', location: 'Pune', salary: '₹9-11 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Users, iconBg: 'bg-green-100', iconColor: 'text-green-600' }, { id: 35, title: 'UI/UX Designer', company: 'GreatHire (On behalf of a Client)', location: 'Bangalore', salary: '₹10-15 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Megaphone, iconBg: 'bg-pink-100', iconColor: 'text-pink-600' }, { id: 36, title: 'Graphic Designer', company: 'GreatHire (On behalf of a Client)', location: 'Delhi', salary: '₹6-10 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Megaphone, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' }, { id: 37, title: 'Digital Marketing Executive', company: 'GreatHire (On behalf of a Client)', location: 'Noida', salary: '₹5-8 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Megaphone, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' }, { id: 38, title: 'SEO Specialist', company: 'GreatHire (On behalf of a Client)', location: 'Gurgaon', salary: '₹6-10 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Megaphone, iconBg: 'bg-green-100', iconColor: 'text-green-600' }, { id: 39, title: 'Content Writer', company: 'GreatHire (On behalf of a Client)', location: 'Mumbai', salary: '₹4-8 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600', icon: Megaphone, iconBg: 'bg-pink-100', iconColor: 'text-pink-600' }, { id: 40, title: 'Social Media Manager', company: 'GreatHire (On behalf of a Client)', location: 'Bangalore', salary: '₹8-10 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800', icon: Megaphone, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' }];

    // Auto scroll functionality
    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, [currentIndex]);

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollInterval.current = setInterval(() => {
            if (!scrollContainerRef.current) return;
            const container = scrollContainerRef.current;
            const firstCard = container.children[0];

            if (!firstCard) return;

            const cardWidth = firstCard.getBoundingClientRect().width + 16; // gap-4 = 16px
            setCurrentIndex((prevIndex) => {
                if (prevIndex >= jobs.length - 1) {
                    container.scrollTo({ left: 0, behavior: "smooth" });
                    return 0;
                } else {
                    container.scrollBy({ left: cardWidth, behavior: "smooth" });
                    return prevIndex + 1;
                }
            });
        }, 1500); {/* changed scrolling time from 500 to 1000*/ }
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval.current) {
            clearInterval(autoScrollInterval.current);
        }
    };

    const handleMouseEnter = () => {
        stopAutoScroll();
    };

    const handleMouseLeave = () => {
        startAutoScroll();
    };

    return (
        <div className="w-full bg-50">
            {/* Jobs Hiring Section */}
            <div className="w-full md:max-w-7xl mx-auto px-3 sm:px-4">
                <div className="relative">
                    {/* Jobs Container */}
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Jobs Hiring Right Now
                        </h2>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto md:overflow-x-hidden scroll-smooth py-4 sm:py-6 snap-x snap-mandatory scrollbar-hide"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {jobs.map((job) => {
                            const IconComponent = job.icon;
                            return (
                                <div
                                    key={job.id}
                                    className=" w-[85vw] sm:w-[280px] md:w-[310px] flex-shrink-0 snap-start bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-5 border border-gray-100 flex flex-col"
                                >
                                    {/* Top Section */}
                                    <div className="flex-1">
                                        {/* Top Row: Icon - Title & Company - Badge */}
                                        <div className="flex items-start gap-3 mb-3 sm:mb-4">
                                            {/* Icon */}
                                            <div className={`${job.iconBg} p-3 rounded-lg flex-shrink-0`}>
                                                <IconComponent className={`${job.iconColor} w-6 h-6`} />
                                            </div>

                                            {/* Title + Company & Location & Salary */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                                                    {job.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {job.company} · {job.location}
                                                </p>
                                                <p className="text-sm sm:text-base font-semibold text-green-600">
                                                    {job.salary}
                                                </p>
                                            </div>

                                            {/* Badge */}
                                            <span
                                                className={`${job.badgeColor} px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0`}
                                            >
                                                {job.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Apply Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => navigate("/login")}
                                            className="w-full sm:w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-200"
                                        >
                                            Apply &nbsp; <span>&gt;</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Trust Badges Section */}
                <div className="bg-blue-50 py-8 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row
                    items-start sm:items-center
                    justify-start sm:justify-center
                    gap-4 sm:gap-8">

                            {/* Trusted by 6 Crore+ Users */}
                            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <div className="bg-blue-500 rounded-full p-1.5">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">
                                    Trusted by 6 Crore+ Users
                                </span>
                            </div>

                            {/* ISO Secure Platform */}
                            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <div className="bg-blue-500 rounded-full p-1.5">
                                    <Lock className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">
                                    ISO Secure Platform
                                </span>
                            </div>

                            {/* Zero Placement Fees */}
                            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <div className="bg-blue-500 rounded-full p-1.5">
                                    <DollarSign className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">
                                    Zero Placement Fees
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



// import React, { useRef } from "react";
// import { use } from "react";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// const jobs = [
//     {
//         title: "Software Developer",
//         company: "TCS · Bangalore",
//         salary: "₹12–18 LPA",
//         badge: "New",
//         badgeStyle: "bg-yellow-100 text-yellow-700",
//         iconBg: "bg-blue-100 text-blue-600",
//     },
//     {
//         title: "HR Manager",
//         company: "Infosys · Mumbai",
//         salary: "₹8–15 LPA",
//         badge: "Hot",
//         badgeStyle: "bg-orange-100 text-orange-700",
//         iconBg: "bg-purple-100 text-purple-600",
//     },
//     {
//         title: "Marketing Lead",
//         company: "Flipkart · Delhi",
//         salary: "₹15–25 LPA",
//         badge: "Hot",
//         badgeStyle: "bg-orange-100 text-orange-700",
//         iconBg: "bg-pink-100 text-pink-600",
//     },
//     {
//         title: "Data Analyst",
//         company: "Wipro · Hyderabad",
//         salary: "₹8–12 LPA",
//         badge: "",
//         badgeStyle: "",
//         iconBg: "bg-blue-100 text-blue-600",
//     },
// ];

// const JobsHiringSlider = () => {
//     const sliderRef = useRef(null);

//     const slideLeft = () => {
//         sliderRef.current.scrollLeft -= 320;
//     };

//     const slideRight = () => {
//         sliderRef.current.scrollLeft += 320;
//     };

//     const navigate = useNavigate();

//     return (
//         <div className="relative w-full rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-6">
//             {/* Heading */}
//             <h2 className="mb-4 text-lg font-semibold text-gray-900">
//                 Jobs Hiring Right Now
//             </h2>

//             {/* Left Arrow */}
//             <button
//                 onClick={slideLeft}
//                 className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
//             >
//                 <FiChevronLeft />
//             </button>

//             {/* Slider */}
//             <div
//                 ref={sliderRef}
//                 className="flex gap-4 overflow-x-auto scroll-smooth"
//                 style={{ scrollbarWidth: "none" }}
//             >
//                 {jobs.map((job, index) => (
//                     <div
//                         key={index}
//                         className="min-w-[300px] rounded-xl bg-white p-4 shadow-sm"
//                     >
//                         {/* Top */}
//                         <div className="flex items-start justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div
//                                     className={`flex h-10 w-10 items-center justify-center rounded-lg ${job.iconBg}`}
//                                 >
//                                     💼
//                                 </div>
//                                 <div>
//                                     <h3 className="font-semibold text-gray-900">
//                                         {job.title}
//                                     </h3>
//                                     <p className="text-sm text-gray-500">
//                                         {job.company}
//                                     </p>
//                                 </div>
//                             </div>

//                             {job.badge && (
//                                 <span
//                                     className={`rounded-full px-2 py-0.5 text-xs font-semibold ${job.badgeStyle}`}
//                                 >
//                                     {job.badge}
//                                 </span>
//                             )}
//                         </div>

//                         {/* Salary */}
//                         <p className="mt-3 text-sm font-semibold text-blue-600">
//                             {job.salary}
//                         </p>

//                         {/* Apply Button */}
//                         <button
//                             onClick={() => navigate("/login")}
//                             className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
//                         >
//                             Apply →
//                         </button>

//                     </div>
//                 ))}
//             </div>

//             {/* Right Arrow */}
//             <button
//                 onClick={slideRight}
//                 className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
//             >
//                 <FiChevronRight />
//             </button>
//         </div>
//     );
// };

// export default JobsHiringSlider;
