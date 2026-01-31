import React from "react";
import { useParams } from "react-router-dom";
import bulkInsights from "../data/bulkInsights";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// imported helmet to apply customized meta tags
import { Helmet } from "react-helmet-async";

export default function InsightDetail() {
  const { id } = useParams();
  const insight = bulkInsights.find((i) => i.id === id);

  if (!insight) {
    return <div className="p-20 text-center">Insight not found</div>;
  }

  return (<><Helmet>
          <title>
            GreatHire Blog | Career Guidance, Employment Patterns, and
            Perspectives on the Future of Work
          </title>
  
          <meta
            name="description"
            content="GreatHire Blog: Your one-stop destination for expert career advice, effective hiring strategies, and interview tips, along with guidance on resume optimization and the future of work. Our insight will help both job seekers and employers deal with the most competitive markets, be it AI-driven recruitment and remote work trends or preparing for an interview and upskilling. GreatHire is based in Hyderabad State, India, and serves businesses, recruiters, and professionals throughout the Hyderabad State region with innovative hiring solutions and career guidance."
          />
        </Helmet>
  
        <Navbar />
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        {/* Category + AI */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-blue-600 font-medium">
            {insight.category}
          </span>

          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {insight.region}
          </span>

          {insight.isAI && (
            <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              AI-Generated Insight
            </span>
          )}

          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            Score: {insight.trendingScore}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {insight.title}
        </h1>

        {/* Author & Date */}
        <div className="text-sm text-gray-500 mb-8">
          By <span className="font-medium">{insight.author}</span> •{" "}
          {new Date(insight.publishedDate).toDateString()}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {insight.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">Key Insight</h3>
          <p className="text-gray-700">{insight.summary}</p>
        </div>

        {/* Content */}
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg">
            {insight.content}
          </p>
        </div>

        {/* Quality Score */}
        {insight.qualityScore && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Quality Score</span>
              <span className={`text-lg font-bold ${
                insight.qualityScore >= 85 ? 'text-green-600' :
                insight.qualityScore >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {insight.qualityScore}/100
              </span>
            </div>
          </div>
        )}

        {/* AI Disclosure */}
        {insight.isAI && (
          <div className="mt-12 p-6 border rounded-xl bg-gray-50 text-sm text-gray-600">
            <h4 className="font-semibold text-gray-900 mb-2">AI-Generated Content</h4>
            <p>
              This insight was generated using GreatHire's AI research models
              and reviewed by hiring experts to ensure relevance, accuracy,
              and ethical hiring standards. Quality score: {insight.qualityScore}/100.
            </p>
          </div>
        )}
      </div>
    </div>
  </>);
}