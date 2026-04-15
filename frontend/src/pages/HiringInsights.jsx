import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllApprovedInsights, getTrendingInsights, getInsightsByRegion } from "../data/insightsData";
import { Briefcase, User, BarChart3, TrendingUp, Globe, Flame, Sparkles, TrendingDown } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

export default function HiringInsights() {
  const [filter, setFilter] = useState("All");
  const [region, setRegion] = useState("ALL");
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  // Animated counter
  useEffect(() => {
    let start = 0;
    const end = 45;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const allInsights = getAllApprovedInsights();
  
  const filteredInsights = region === "ALL"
    ? allInsights
    : getInsightsByRegion(region);

  const categoryFiltered = filter === "All"
    ? filteredInsights
    : filteredInsights.filter(i => i.category === filter);

  const trendingInsights = getTrendingInsights(3);

  const getBadgeIcon = (insight) => {
    if (insight.trendingScore > 90) return <Flame className="text-red-500" size={14} />;
    if (insight.trendingScore > 80) return <TrendingUp className="text-orange-500" size={14} />;
    if (new Date(insight.publishedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return <Sparkles className="text-blue-500" size={14} />;
    }
    return null;
  };

  const getBadgeText = (insight) => {
    if (insight.trendingScore > 90) return "🔥 Hot";
    if (insight.trendingScore > 80) return "📈 Rising";
    if (new Date(insight.publishedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return "✨ New";
    }
    return null;
  };

  return (
    <>
    <Helmet>
            <title>
              GreatHire Blog | Career Guidance, Employment Patterns, and Perspectives on the Future of Work
            </title>
    
            <meta
              name="description"
              content="GreatHire Blog: Your one-stop destination for expert career advice, effective hiring strategies, and interview tips, along with guidance on resume optimization and the future of work. Our insight will help both job seekers and employers deal with the most competitive markets, be it AI-driven recruitment and remote work trends or preparing for an interview and upskilling. GreatHire is based in Hyderabad State, India, and serves businesses, recruiters, and professionals throughout the Hyderabad State region with innovative hiring solutions and career guidance."
            />
          </Helmet>
    
    
          <Navbar />
    <div className="min-h-screen bg-white dark:bg-gray-950 px-6 py-20 transition-colors duration-300">

      {/* HERO */}
      <div className="max-w-6xl mx-auto text-center mb-16 mt-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          Global Hiring Insights Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4 transition-colors duration-300">
          Provide organizations and candidates with industry data and strategic insights to help them navigate the changing recruitment landscape across regions. Stakeholders may make wise judgments and maintain an advantage in the cutthroat personnel market by comprehending workforce dynamics, developing practices, and global hiring trends.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          {allInsights.length} insights • Updated weekly • AI-powered analysis
        </div>
      </div>

      {/* REGION SELECTOR */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Select Region</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["ALL", "GLOBAL", "INDIA", "US", "EUROPE"].map(r => {
            const regionCount = r === "ALL" ? allInsights.length : getInsightsByRegion(r).length;
            return (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 flex items-center gap-2 ${
                  region === r
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {r === "ALL" ? "All Regions" : r}
                <span className="text-xs opacity-75">({regionCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TRENDING SECTION */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-red-500" size={20} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Trending Hiring Topics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingInsights.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/hiring-insights/${item.id}`)}
              className="border rounded-xl p-6 hover:shadow-md transition-colors duration-300 cursor-pointer bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-red-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                  🔥 Trending #{item.trendingScore}
                </span>
                <div className="flex gap-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full transition-colors duration-300">
                    {item.region}
                  </span>
                  {item.isAI && (
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full transition-colors duration-300">
                      AI
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2 dark:text-white transition-colors duration-300">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">
                {item.summary}
              </p>

              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 rounded-full text-red-700 dark:text-red-300 transition-colors duration-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* METRICS */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20">
        <div>
          <BarChart3 className="mx-auto text-blue-600 mb-2" />
          <h3 className="text-3xl font-bold text-blue-600">{count}%</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Faster Hiring</p>
        </div>
        <div>
          <Briefcase className="mx-auto text-blue-600 mb-2" />
          <h3 className="text-3xl font-bold text-blue-600">30%</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Lower Attrition</p>
        </div>
        <div>
          <User className="mx-auto text-blue-600 mb-2" />
          <h3 className="text-3xl font-bold text-blue-600">2×</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Role Fit</p>
        </div>
        <div>
          <BarChart3 className="mx-auto text-blue-600 mb-2" />
          <h3 className="text-3xl font-bold text-blue-600">{allInsights.length}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Total Insights</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex justify-center gap-4 mb-12">
        {["All", "Employer", "Candidate"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-full border transition-colors duration-300 ${
              filter === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ALL INSIGHTS */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
          {region === "ALL" ? "All Insights" : `${region} Insights`} ({categoryFiltered.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryFiltered.map((item) => {
            const badgeIcon = getBadgeIcon(item);
            const badgeText = getBadgeText(item);
            
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/hiring-insights/${item.id}`)}
                className="border rounded-xl p-6 shadow-xl hover:shadow-md transition-colors duration-300 cursor-pointer bg-white dark:bg-gray-900 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700"
              >

                {/* Meta */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-600 font-medium">
                    {item.category}
                  </span>
                  <div className="flex gap-1">
                    {badgeText && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full flex items-center gap-1 transition-colors duration-300">
                        {badgeIcon}
                        {badgeText}
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full transition-colors duration-300">
                      {item.region}
                    </span>
                    {item.isAI && (
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full transition-colors duration-300">
                        AI
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2 dark:text-white transition-colors duration-300">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                  {item.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 transition-colors duration-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <span>{item.author} • {new Date(item.publishedDate).toDateString()}</span>
                  <span className="font-medium">Score: {item.trendingScore}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <Footer />
  </>);
}