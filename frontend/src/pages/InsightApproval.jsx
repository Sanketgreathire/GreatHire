import React, { useEffect, useState } from "react";
import { Check, X, Clock, Eye } from "lucide-react";
import { getPendingInsights } from "../data/insightsData";

export default function InsightApproval() {
  const [pending, setPending] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const pendingInsights = getPendingInsights();
    setPending(pendingInsights);
  }, []);

  const approve = (id) => {
    setPending(pending.filter(i => i.id !== id));
    // API call: axios.post(`/api/admin/insights/${id}/approve`)
  };

  const reject = (id) => {
    setPending(pending.filter(i => i.id !== id));
    // API call: axios.post(`/api/admin/insights/${id}/reject`)
  };

  const filteredPending = filter === "ALL" 
    ? pending 
    : pending.filter(i => i.region === filter);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insight Approval Workflow</h1>
            <p className="text-gray-600 mt-2">Examine and accept recruiting insights produced by AI</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-orange-500" size={16} />
            <span className="text-gray-600">{pending.length} pending review</span>
          </div>
        </div>

        {/* REGION FILTER */}
        <div className="flex gap-2 mb-8">
          {["ALL", "GLOBAL", "INDIA", "US", "EUROPE"].map(region => {
            const count = region === "ALL" ? pending.length : pending.filter(i => i.region === region).length;
            return (
              <button
                key={region}
                onClick={() => setFilter(region)}
                className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
                  filter === region
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {region}
                <span className="text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* PENDING INSIGHTS */}
        <div className="space-y-6">
          {filteredPending.map(item => (
            <div key={item.id} className="bg-white border rounded-xl p-6 shadow-sm">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      AI Generated
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {item.region}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{item.summary}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="text-right ml-6">
                  <div className="text-sm text-gray-500 mb-1">Quality Score</div>
                  <div className={`text-2xl font-bold ${
                    item.qualityScore >= 80 ? 'text-green-600' : 
                    item.qualityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.qualityScore || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">Trending: {item.trendingScore}</div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">Content Preview</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.content}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  By {item.author} • {new Date(item.publishedDate).toDateString()}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => reject(item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    <X size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => approve(item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPending.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Check size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No insights pending approval for {filter.toLowerCase()} region.</p>
          </div>
        )}

      </div>
    </div>
  );
}