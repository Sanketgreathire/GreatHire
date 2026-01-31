import bulkInsights from "./bulkInsights";

export const insights = bulkInsights.slice(0, 20); // Show first 20 for demo

// Trending insights service
export const getTrendingInsights = (limit = 3) => {
  return bulkInsights
    .filter(i => i.approvalStatus === "APPROVED")
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
};

// Latest insights service
export const getLatestInsights = (limit = 6) => {
  return bulkInsights
    .filter(i => i.approvalStatus === "APPROVED")
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .slice(0, limit);
};

// Get insights by region
export const getInsightsByRegion = (region = "GLOBAL") => {
  return bulkInsights.filter(i => 
    i.region === region && i.approvalStatus === "APPROVED"
  );
};

// Get all approved insights
export const getAllApprovedInsights = () => {
  return bulkInsights.filter(i => i.approvalStatus === "APPROVED");
};

// Get pending insights for approval
export const getPendingInsights = () => {
  return bulkInsights.filter(i => i.approvalStatus === "PENDING");
};

// Get region statistics
export const getRegionStats = () => {
  const approved = bulkInsights.filter(i => i.approvalStatus === "APPROVED");
  return approved.reduce((acc, insight) => {
    const region = insight.region;
    if (!acc[region]) {
      acc[region] = { total: 0, ai: 0, human: 0, avgTrending: 0 };
    }
    acc[region].total += 1;
    acc[region].ai += insight.isAI ? 1 : 0;
    acc[region].human += insight.isAI ? 0 : 1;
    acc[region].avgTrending += insight.trendingScore;
    return acc;
  }, {});
};

// Auto-approval logic
export const shouldAutoApprove = (insight) => {
  return insight.qualityScore >= 80 && insight.region !== "EUROPE";
};

// Get insights with trending badges
export const getInsightsWithBadges = () => {
  return bulkInsights.map(insight => ({
    ...insight,
    badges: {
      isTrending: insight.trendingScore > 85,
      isNew: new Date(insight.publishedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isRising: insight.trendingScore > 75 && insight.trendingScore <= 85
    }
  }));
};