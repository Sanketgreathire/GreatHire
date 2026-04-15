import React from "react";
import { insights } from "../data/insightsData";
import { TrendingUp, Eye, Cpu, User } from "lucide-react";

export default function InsightsDashboard() {
  const totalInsights = insights.length;
  const aiInsights = insights.filter(i => i.isAI).length;
  const humanInsights = totalInsights - aiInsights;

  const topTrending = [...insights]
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          Hiring Insights Analytics Dashboard
        </h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">

          <KpiCard
            title="Total Insights"
            value={totalInsights}
            icon={<TrendingUp />}
          />

          <KpiCard
            title="AI-Generated"
            value={aiInsights}
            icon={<Cpu />}
          />

          <KpiCard
            title="Expert-Written"
            value={humanInsights}
            icon={<User />}
          />

          <KpiCard
            title="Total Views"
            value="12.4K"
            icon={<Eye />}
          />
        </div>

        {/* TRENDING TABLE */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">
            Top Trending Hiring Topics
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Trend Score</th>
                <th>AI</th>
              </tr>
            </thead>

            <tbody>
              {topTrending.map((item) => (
                <tr key={item.id} className="border-b last:border-none">
                  <td className="py-3 font-medium text-gray-800">
                    {item.title}
                  </td>
                  <td>{item.category}</td>
                  <td>{item.author}</td>
                  <td className="text-blue-600 font-semibold">
                    {item.trendingScore || "—"}
                  </td>
                  <td>
                    {item.isAI ? (
                      <span className="text-purple-600">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* KPI COMPONENT */
function KpiCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}