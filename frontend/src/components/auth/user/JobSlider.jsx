import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Users, Megaphone, BarChart3, ShieldCheck, Lock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JOB_API_END_POINT } from '@/utils/ApiEndPoint';

const ICONS = [Briefcase, Users, Megaphone, BarChart3];
const ICON_BG = ['bg-blue-100 dark:bg-blue-900/50', 'bg-purple-100 dark:bg-purple-900/50', 'bg-pink-100 dark:bg-pink-900/50', 'bg-green-100 dark:bg-green-900/50'];
const ICON_COLOR = ['text-blue-600 dark:text-blue-400', 'text-purple-600 dark:text-purple-400', 'text-pink-600 dark:text-pink-400', 'text-green-600 dark:text-green-400'];

const DEMO_JOBS = [
  { id: 1, title: 'Software Developer', company: 'TCS', location: 'Bangalore', salary: '5-8 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', icon: Briefcase, iconBg: 'bg-blue-100 dark:bg-blue-900/50', iconColor: 'text-blue-600 dark:text-blue-400' },
  { id: 2, title: 'HR Manager', company: 'Infosys', location: 'Mumbai', salary: '4-6 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', icon: Users, iconBg: 'bg-purple-100 dark:bg-purple-900/50', iconColor: 'text-purple-600 dark:text-purple-400' },
  { id: 3, title: 'Marketing Lead', company: 'Flipkart', location: 'Delhi', salary: '5-8 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', icon: Megaphone, iconBg: 'bg-pink-100 dark:bg-pink-900/50', iconColor: 'text-pink-600 dark:text-pink-400' },
  { id: 4, title: 'Data Analyst', company: 'Wipro', location: 'Hyderabad', salary: '6-9 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', icon: BarChart3, iconBg: 'bg-blue-100 dark:bg-blue-900/50', iconColor: 'text-blue-600 dark:text-blue-400' },
  { id: 5, title: 'Frontend Developer', company: 'Amazon', location: 'Pune', salary: '4.5-8 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', icon: Briefcase, iconBg: 'bg-green-100 dark:bg-green-900/50', iconColor: 'text-green-600 dark:text-green-400' },
  { id: 6, title: 'Product Manager', company: 'Google', location: 'Bangalore', salary: '5-10 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', icon: Users, iconBg: 'bg-indigo-100 dark:bg-indigo-900/50', iconColor: 'text-indigo-600 dark:text-indigo-400' },
  { id: 7, title: 'Backend Developer', company: 'Microsoft', location: 'Hyderabad', salary: '8-12 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', icon: Briefcase, iconBg: 'bg-purple-100 dark:bg-purple-900/50', iconColor: 'text-purple-600 dark:text-purple-400' },
  { id: 8, title: 'UI/UX Designer', company: 'Adobe', location: 'Bangalore', salary: '3.8-9 LPA', badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', icon: Megaphone, iconBg: 'bg-pink-100 dark:bg-pink-900/50', iconColor: 'text-pink-600 dark:text-pink-400' },
  { id: 9, title: 'DevOps Engineer', company: 'IBM', location: 'Chennai', salary: '10-15 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', icon: BarChart3, iconBg: 'bg-blue-100 dark:bg-blue-900/50', iconColor: 'text-blue-600 dark:text-blue-400' },
  { id: 10, title: 'React Developer', company: 'GreatHire (On behalf of a Client)', location: 'Hyderabad', salary: '8-12 LPA', badge: 'Hot', badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', icon: Briefcase, iconBg: 'bg-pink-100 dark:bg-pink-900/50', iconColor: 'text-pink-600 dark:text-pink-400' },
];

export default function JobsHiringSection() {
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);
  const navigate = useNavigate();

  // Defer API fetch so it doesn't block initial paint
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`${JOB_API_END_POINT}/slider/latest`);
        const data = await response.json();
        if (data.success && data.jobs?.length) {
          const transformed = data.jobs.map((job, i) => ({
            id: job._id,
            title: job.jobDetails.title,
            company: job.jobDetails.companyName,
            location: job.jobDetails.location,
            salary: job.jobDetails.salary,
            badge: i % 2 === 0 ? 'New' : 'Hot',
            badgeColor: i % 2 === 0
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
              : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
            icon: ICONS[i % 4],
            iconBg: ICON_BG[i % 4],
            iconColor: ICON_COLOR[i % 4],
          }));
          setJobs([...transformed, ...DEMO_JOBS]);
        }
      } catch (e) {
        // keep demo jobs on error
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (jobs.length === 0) return;
    startAutoScroll();
    return () => stopAutoScroll();
  }, [currentIndex, jobs.length]);

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollInterval.current = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const firstCard = container.children[0];
      if (!firstCard) return;
      const cardWidth = firstCard.getBoundingClientRect().width + 16;
      setCurrentIndex((prev) => {
        if (prev >= jobs.length - 1) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          return 0;
        }
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        return prev + 1;
      });
    }, 1500);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
  };

  return (
    <div className="w-full">
      <div className="w-full md:max-w-7xl mx-auto px-3 sm:px-4">
        <div className="relative">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Jobs Hiring Right Now
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto md:overflow-x-hidden scroll-smooth py-4 sm:py-6 snap-x snap-mandatory scrollbar-hide"
              onMouseEnter={stopAutoScroll}
              onMouseLeave={startAutoScroll}
            >
              {jobs.map((job) => {
                const IconComponent = job.icon;
                return (
                  <div
                    key={job.id}
                    className="w-[80vw] sm:w-[280px] md:w-[310px] flex-shrink-0 snap-start bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 pt-4 px-4 pb-2 sm:pt-5 sm:px-5 sm:pb-3 border border-gray-100 dark:border-gray-700 flex flex-col"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-0">
                        <div className={`${job.iconBg} p-3 rounded-lg flex-shrink-0`}>
                          <IconComponent className={`${job.iconColor} w-6 h-6`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{job.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{job.company} · {job.location}</p>
                        </div>
                        <span className={`${job.badgeColor} px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0`}>{job.badge}</span>
                      </div>
                      <div className="pl-[60px] mb-2 line-clamp-1">
                        <p className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">₹{job.salary}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => navigate('/jobseeker-login')}
                        className="w-full sm:w-[140px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-200"
                      >
                        Apply &gt;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-gray-900 py-8 px-4 rounded-xl transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-center gap-4 sm:gap-8">
              {[
                { Icon: ShieldCheck, label: 'Trusted by 6 Crore+ Users' },
                { Icon: Lock, label: 'ISO Secure Platform' },
                { Icon: DollarSign, label: 'Zero Placement Fees' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="bg-blue-500 dark:bg-blue-600 rounded-full p-1.5">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
