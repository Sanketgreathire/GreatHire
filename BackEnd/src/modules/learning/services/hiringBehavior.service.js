// import { checkAiHealth } from "../../../sourcing/ai/aiServiceClient.js";

export async function getRecruiterBehavior(recruiterId) {
  try {
    const learningRecord = await getRecruiterLearningRecord(recruiterId);
    
    if (!learningRecord || !learningRecord.interactionHistory) {
      return getDefaultBehavior();
    }

    const behaviorData = {
      hiringVelocity: calculateHiringVelocity(learningRecord.interactionHistory),
      sourcingPatterns: analyzeSourcingPatterns(learningRecord.interactionHistory),
      topPreferredSkills: extractTopPreferredSkills(learningRecord.interactionHistory),
      hiringSuccessIndicators: calculateHiringSuccessIndicators(learningRecord.interactionHistory),
      interactionPatterns: analyzeInteractionPatterns(learningRecord.interactionHistory),
      timePatterns: analyzeTimePatterns(learningRecord.interactionHistory),
      conversionFunnel: analyzeConversionFunnel(learningRecord.interactionHistory)
    };

    return {
      ...behaviorData,
      lastUpdated: learningRecord.lastBehaviorUpdate,
      confidence: calculateBehaviorConfidence(learningRecord)
    };
  } catch (error) {
    console.error("Error in getRecruiterBehavior:", error);
    return getDefaultBehavior();
  }
}

export async function updateLearningStats(recruiterId, action, candidateId, timestamp) {
  try {
    const learningJob = {
      recruiterId,
      action,
      candidateId,
      timestamp: timestamp || new Date(),
      updateType: 'stats'
    };

    const { enqueueLearningJob } = await import("./learningQueue.service.js");
    const jobId = await enqueueLearningJob('update-stats', learningJob);

    return {
      success: true,
      jobId,
      message: "Learning stats update queued"
    };
  } catch (error) {
    console.error("Error in updateLearningStats:", error);
    throw new Error(`Failed to update learning stats: ${error.message}`);
  }
}

export async function analyzeRecruiterPerformance(recruiterId, timeRange = '30d') {
  try {
    const learningRecord = await getRecruiterLearningRecord(recruiterId);
    
    if (!learningRecord || !learningRecord.interactionHistory) {
      return {
        performanceScore: 0,
        metrics: getDefaultMetrics(),
        timeRange
      };
    }

    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredInteractions = learningRecord.interactionHistory.filter(
      interaction => new Date(interaction.timestamp) >= startDate
    );

    const metrics = calculatePerformanceMetrics(filteredInteractions);
    const performanceScore = calculateOverallPerformanceScore(metrics);

    return {
      performanceScore,
      metrics,
      timeRange,
      totalInteractions: filteredInteractions.length
    };
  } catch (error) {
    console.error("Error in analyzeRecruiterPerformance:", error);
    return {
      performanceScore: 0,
      metrics: getDefaultMetrics(),
      timeRange
    };
  }
}

function calculateHiringVelocity(interactions) {
  try {
    const hiredInteractions = interactions.filter(interaction => interaction.action === 'hired');
    
    if (hiredInteractions.length === 0) {
      return {
        hiresPerMonth: 0,
        averageTimeToHire: 0,
        hiringTrend: 'stable'
      };
    }

    const sortedHires = hiredInteractions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const firstHire = new Date(sortedHires[0].timestamp);
    const lastHire = new Date(sortedHires[sortedHires.length - 1].timestamp);
    const monthsDiff = (lastHire - firstHire) / (1000 * 60 * 60 * 24 * 30);

    const hiresPerMonth = monthsDiff > 0 ? (sortedHires.length / monthsDiff) : 0;

    const timeToHireData = calculateTimeToHire(interactions, hiredInteractions);
    const averageTimeToHire = timeToHireData.reduce((sum, time) => sum + time, 0) / timeToHireData.length || 0;

    const hiringTrend = calculateHiringTrend(sortedHires);

    return {
      hiresPerMonth: Math.round(hiresPerMonth * 10) / 10,
      averageTimeToHire: Math.round(averageTimeToHire),
      hiringTrend,
      totalHires: hiredInteractions.length
    };
  } catch (error) {
    console.error("Error calculating hiring velocity:", error);
    return {
      hiresPerMonth: 0,
      averageTimeToHire: 0,
      hiringTrend: 'stable'
    };
  }
}

function analyzeSourcingPatterns(interactions) {
  try {
    const sourcingChannels = {};
    const sourcingMethods = {};
    const timePatterns = {};

    interactions.forEach(interaction => {
      const context = interaction.context || {};
      const source = context.source || 'unknown';
      const method = context.method || 'unknown';
      const hour = new Date(interaction.timestamp).getHours();

      sourcingChannels[source] = (sourcingChannels[source] || 0) + 1;
      sourcingMethods[method] = (sourcingMethods[method] || 0) + 1;
      timePatterns[hour] = (timePatterns[hour] || 0) + 1;
    });

    const totalInteractions = interactions.length;
    const channelDistribution = Object.entries(sourcingChannels)
      .map(([channel, count]) => ({
        channel,
        count,
        percentage: Math.round((count / totalInteractions) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    const methodDistribution = Object.entries(sourcingMethods)
      .map(([method, count]) => ({
        method,
        count,
        percentage: Math.round((count / totalInteractions) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    const peakHours = Object.entries(timePatterns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return {
      channels: channelDistribution,
      methods: methodDistribution,
      peakHours,
      totalInteractions
    };
  } catch (error) {
    console.error("Error analyzing sourcing patterns:", error);
    return {
      channels: [],
      methods: [],
      peakHours: [],
      totalInteractions: 0
    };
  }
}

function extractTopPreferredSkills(interactions) {
  try {
    const successfulInteractions = interactions.filter(interaction => 
      ['shortlisted', 'contacted', 'hired', 'interviewed'].includes(interaction.action)
    );

    const skillCounts = {};
    const industryCounts = {};
    const experienceCounts = {};

    successfulInteractions.forEach(async (interaction) => {
      try {
        const candidateData = await getCandidateData(interaction.candidateId);
        
        if (candidateData.skills) {
          candidateData.skills.forEach(skill => {
            const normalizedSkill = skill.toLowerCase().trim();
            skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
          });
        }

        if (candidateData.currentCompany) {
          const industry = inferIndustryFromCompany(candidateData.currentCompany);
          if (industry) {
            industryCounts[industry] = (industryCounts[industry] || 0) + 1;
          }
        }

        if (candidateData.totalExperience !== undefined) {
          const level = getExperienceLevel(candidateData.totalExperience);
          experienceCounts[level] = (experienceCounts[level] || 0) + 1;
        }
      } catch (error) {
        console.error("Error processing candidate data for skill extraction:", error);
      }
    });

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([skill, count]) => ({ skill, count }));

    const topIndustries = Object.entries(industryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([industry, count]) => ({ industry, count }));

    const topExperienceLevels = Object.entries(experienceCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([level, count]) => ({ level, count }));

    return {
      skills: topSkills,
      industries: topIndustries,
      experienceLevels: topExperienceLevels
    };
  } catch (error) {
    console.error("Error extracting top preferred skills:", error);
    return {
      skills: [],
      industries: [],
      experienceLevels: []
    };
  }
}

function calculateHiringSuccessIndicators(interactions) {
  try {
    const totalInteractions = interactions.length;
    if (totalInteractions === 0) {
      return {
        conversionRate: 0,
        acceptanceRate: 0,
        rejectionRate: 0,
        efficiency: 0
      };
    }

    const actionCounts = {};
    interactions.forEach(interaction => {
      actionCounts[interaction.action] = (actionCounts[interaction.action] || 0) + 1;
    });

    const viewed = actionCounts.viewed || 0;
    const shortlisted = actionCounts.shortlisted || 0;
    const contacted = actionCounts.contacted || 0;
    const interviewed = actionCounts.interviewed || 0;
    const hired = actionCounts.hired || 0;
    const rejected = actionCounts.rejected || 0;
    const notInterested = actionCounts.not_interested || 0;

    const conversionRate = viewed > 0 ? (shortlisted / viewed) * 100 : 0;
    const acceptanceRate = interviewed > 0 ? (hired / interviewed) * 100 : 0;
    const rejectionRate = (shortlisted + contacted + interviewed) > 0 ? 
      ((rejected + notInterested) / (shortlisted + contacted + interviewed)) * 100 : 0;
    const efficiency = viewed > 0 ? (hired / viewed) * 100 : 0;

    return {
      conversionRate: Math.round(conversionRate * 10) / 10,
      acceptanceRate: Math.round(acceptanceRate * 10) / 10,
      rejectionRate: Math.round(rejectionRate * 10) / 10,
      efficiency: Math.round(efficiency * 10) / 10,
      funnel: {
        viewed,
        shortlisted,
        contacted,
        interviewed,
        hired,
        rejected,
        notInterested
      }
    };
  } catch (error) {
    console.error("Error calculating hiring success indicators:", error);
    return {
      conversionRate: 0,
      acceptanceRate: 0,
      rejectionRate: 0,
      efficiency: 0
    };
  }
}

// function analyzeInteractionPatterns(interactions) {
//   try {
//     const patterns = {
//       dailyActivity: {},
//       weeklyActivity: {},
//       monthlyActivity: {},
//       responseTime: [],
//       decisionSpeed: []
//     };

//     interactions.forEach(interaction => {
//       const date = new Date(interaction.timestamp);
//       const dayOfWeek = date.getDay();
//       const hour = date.getHours();
//       const month = date.getMonth();

//       patterns.dailyActivity[hour] = (patterns.dailyActivity[hour] || 0) + 1;
//       patterns.weeklyActivity[dayOfWeek] = (patterns.weeklyActivity[dayOfWeek] || 0) + 1;
//       patterns.monthlyActivity[month] = (patterns.monthlyActivity[month] || 0) + 1;
//     });

//     const responseTimes = calculateResponseTimes(interactions);
//     patterns.responseTime = responseTimes;
//     patterns.decisionSpeed = calculateDecisionSpeed(interactions);

//     return patterns;
//   } catch (error) {
//     console.error("Error analyzing interaction patterns:", error);
//     return {
//       dailyActivity: {},
//       weeklyActivity: {},
//       monthlyActivity: {},
//       responseTime: [],
//       decisionSpeed: []
//     };
//   }
// }

function analyzeTimePatterns(interactions) {
  try {
    const timePatterns = {
      mostActiveDay: null,
      mostActiveHour: null,
      averageInteractionsPerDay: 0,
      peakActivityPeriod: null,
      consistency: 0
    };

    if (interactions.length === 0) return timePatterns;

    const dayCounts = {};
    const hourCounts = {};

    interactions.forEach(interaction => {
      const date = new Date(interaction.timestamp);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const mostActiveDay = Object.entries(dayCounts)
      .sort(([, a], [, b]) => b - a)[0];
    const mostActiveHour = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)[0];

    timePatterns.mostActiveDay = mostActiveDay ? getDayName(mostActiveDay[0]) : null;
    timePatterns.mostActiveHour = mostActiveHour ? mostActiveHour[0] : null;

    const dateRange = calculateDateRange(interactions);
    const daysDiff = dateRange > 0 ? dateRange : 1;
    timePatterns.averageInteractionsPerDay = Math.round((interactions.length / daysDiff) * 10) / 10;

    timePatterns.peakActivityPeriod = determinePeakActivityPeriod(hourCounts);
    timePatterns.consistency = calculateActivityConsistency(dayCounts);

    return timePatterns;
  } catch (error) {
    console.error("Error analyzing time patterns:", error);
    return {
      mostActiveDay: null,
      mostActiveHour: null,
      averageInteractionsPerDay: 0,
      peakActivityPeriod: null,
      consistency: 0
    };
  }
}

function analyzeConversionFunnel(interactions) {
  try {
    const funnel = {
      viewed: 0,
      shortlisted: 0,
      contacted: 0,
      interviewed: 0,
      hired: 0,
      rejected: 0,
      notInterested: 0
    };

    interactions.forEach(interaction => {
      if (funnel[interaction.action] !== undefined) {
        funnel[interaction.action]++;
      }
    });

    const conversionRates = {};
    const stages = ['viewed', 'shortlisted', 'contacted', 'interviewed', 'hired'];
    
    for (let i = 0; i < stages.length - 1; i++) {
      const currentStage = stages[i];
      const nextStage = stages[i + 1];
      
      if (funnel[currentStage] > 0) {
        conversionRates[`${currentStage}_to_${nextStage}`] = 
          Math.round((funnel[nextStage] / funnel[currentStage]) * 100);
      }
    }

    return {
      funnel,
      conversionRates,
      dropOffPoints: identifyDropOffPoints(funnel, conversionRates)
    };
  } catch (error) {
    console.error("Error analyzing conversion funnel:", error);
    return {
      funnel: {},
      conversionRates: {},
      dropOffPoints: []
    };
  }
}

function calculateTimeToHire(allInteractions, hiredInteractions) {
  try {
    const timeToHireData = [];

    hiredInteractions.forEach(hiredInteraction => {
      const candidateId = hiredInteraction.candidateId;
      const hiredDate = new Date(hiredInteraction.timestamp);

      const candidateInteractions = allInteractions.filter(
        interaction => interaction.candidateId === candidateId
      );

      if (candidateInteractions.length > 0) {
        const firstInteraction = candidateInteractions.reduce((earliest, interaction) => {
          const interactionDate = new Date(interaction.timestamp);
          const earliestDate = new Date(earliest.timestamp);
          return interactionDate < earliestDate ? interaction : earliest;
        });

        const daysToHire = Math.floor((hiredDate - new Date(firstInteraction.timestamp)) / (1000 * 60 * 60 * 24));
        timeToHireData.push(daysToHire);
      }
    });

    return timeToHireData;
  } catch (error) {
    console.error("Error calculating time to hire:", error);
    return [];
  }
}

function calculateHiringTrend(sortedHires) {
  try {
    if (sortedHires.length < 2) return 'stable';

    const recentHires = sortedHires.slice(-5);
    const olderHires = sortedHires.slice(-10, -5);

    if (olderHires.length === 0) return 'increasing';

    const recentRate = recentHires.length / 5;
    const olderRate = olderHires.length / 5;

    if (recentRate > olderRate * 1.2) return 'increasing';
    if (recentRate < olderRate * 0.8) return 'decreasing';
    return 'stable';
  } catch (error) {
    console.error("Error calculating hiring trend:", error);
    return 'stable';
  }
}

function calculateResponseTimes(interactions) {
  try {
    const responseTimes = [];
    const candidateInteractions = {};

    interactions.forEach(interaction => {
      const candidateId = interaction.candidateId;
      
      if (!candidateInteractions[candidateId]) {
        candidateInteractions[candidateId] = [];
      }
      
      candidateInteractions[candidateId].push(interaction);
    });

    Object.values(candidateInteractions).forEach(candidateInteractions => {
      if (candidateInteractions.length > 1) {
        for (let i = 1; i < candidateInteractions.length; i++) {
          const currentTime = new Date(candidateInteractions[i].timestamp);
          const previousTime = new Date(candidateInteractions[i - 1].timestamp);
          const responseHours = (currentTime - previousTime) / (1000 * 60 * 60);
          
          if (responseHours >= 0 && responseHours <= 168) { // Within a week
            responseTimes.push(responseHours);
          }
        }
      }
    });

    return responseTimes.sort((a, b) => a - b);
  } catch (error) {
    console.error("Error calculating response times:", error);
    return [];
  }
}

function calculateDecisionSpeed(interactions) {
  try {
    const decisionTimes = [];
    const viewedToShortlisted = [];
    const shortlistedToContacted = [];

    interactions.forEach(interaction => {
      if (interaction.action === 'shortlisted') {
        const viewedInteraction = interactions.find(
          i => i.candidateId === interaction.candidateId && i.action === 'viewed' &&
          new Date(i.timestamp) < new Date(interaction.timestamp)
        );
        
        if (viewedInteraction) {
          const hours = (new Date(interaction.timestamp) - new Date(viewedInteraction.timestamp)) / (1000 * 60 * 60);
          if (hours >= 0 && hours <= 168) {
            viewedToShortlisted.push(hours);
          }
        }
      }
      
      if (interaction.action === 'contacted') {
        const shortlistedInteraction = interactions.find(
          i => i.candidateId === interaction.candidateId && i.action === 'shortlisted' &&
          new Date(i.timestamp) < new Date(interaction.timestamp)
        );
        
        if (shortlistedInteraction) {
          const hours = (new Date(interaction.timestamp) - new Date(shortlistedInteraction.timestamp)) / (1000 * 60 * 60);
          if (hours >= 0 && hours <= 168) {
            shortlistedToContacted.push(hours);
          }
        }
      }
    });

    return {
      viewedToShortlisted: viewedToShortlisted.sort((a, b) => a - b),
      shortlistedToContacted: shortlistedToContacted.sort((a, b) => a - b)
    };
  } catch (error) {
    console.error("Error calculating decision speed:", error);
    return {
      viewedToShortlisted: [],
      shortlistedToContacted: []
    };
  }
}

function calculateDateRange(interactions) {
  try {
    if (interactions.length === 0) return 0;

    const timestamps = interactions.map(i => new Date(i.timestamp));
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));
    
    return Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error("Error calculating date range:", error);
    return 0;
  }
}

function getDayName(dayIndex) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

function determinePeakActivityPeriod(hourCounts) {
  try {
    const totalHours = Object.values(hourCounts).reduce((sum, count) => sum + count, 0);
    if (totalHours === 0) return null;

    const morningHours = [6, 7, 8, 9, 10, 11].reduce((sum, hour) => sum + (hourCounts[hour] || 0), 0);
    const afternoonHours = [12, 13, 14, 15, 16, 17].reduce((sum, hour) => sum + (hourCounts[hour] || 0), 0);
    const eveningHours = [18, 19, 20, 21, 22, 23].reduce((sum, hour) => sum + (hourCounts[hour] || 0), 0);
    const nightHours = [0, 1, 2, 3, 4, 5].reduce((sum, hour) => sum + (hourCounts[hour] || 0), 0);

    const periods = [
      { name: 'morning', count: morningHours },
      { name: 'afternoon', count: afternoonHours },
      { name: 'evening', count: eveningHours },
      { name: 'night', count: nightHours }
    ];

    return periods.sort((a, b) => b.count - a.count)[0].name;
  } catch (error) {
    console.error("Error determining peak activity period:", error);
    return null;
  }
}

function calculateActivityConsistency(dayCounts) {
  try {
    const counts = Object.values(dayCounts);
    if (counts.length === 0) return 0;

    const mean = counts.reduce((sum, count) => sum + count, 0) / counts.length;
    const variance = counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / counts.length;
    const maxVariance = mean * mean;

    if (maxVariance === 0) return 100;
    
    const consistency = Math.max(0, 100 - (variance / maxVariance) * 100);
    return Math.round(consistency);
  } catch (error) {
    console.error("Error calculating activity consistency:", error);
    return 0;
  }
}

function identifyDropOffPoints(funnel, conversionRates) {
  try {
    const dropOffPoints = [];
    const stages = ['viewed', 'shortlisted', 'contacted', 'interviewed', 'hired'];
    
    for (let i = 0; i < stages.length - 1; i++) {
      const currentStage = stages[i];
      const nextStage = stages[i + 1];
      const rate = conversionRates[`${currentStage}_to_${nextStage}`] || 0;
      
      if (rate < 50) {
        dropOffPoints.push({
          from: currentStage,
          to: nextStage,
          conversionRate: rate,
          severity: rate < 25 ? 'high' : 'medium'
        });
      }
    }
    
    return dropOffPoints;
  } catch (error) {
    console.error("Error identifying drop-off points:", error);
    return [];
  }
}

function calculatePerformanceMetrics(interactions) {
  try {
    const metrics = {
      totalInteractions: interactions.length,
      uniqueCandidates: new Set(interactions.map(i => i.candidateId)).size,
      actionDistribution: {},
      averageInteractionsPerCandidate: 0,
      peakActivityDay: null,
      responseTime: 0
    };

    interactions.forEach(interaction => {
      metrics.actionDistribution[interaction.action] = (metrics.actionDistribution[interaction.action] || 0) + 1;
    });

    if (metrics.uniqueCandidates > 0) {
      metrics.averageInteractionsPerCandidate = Math.round((interactions.length / metrics.uniqueCandidates) * 10) / 10;
    }

    return metrics;
  } catch (error) {
    console.error("Error calculating performance metrics:", error);
    return getDefaultMetrics();
  }
}

function calculateOverallPerformanceScore(metrics) {
  try {
    let score = 0;
    
    if (metrics.totalInteractions >= 50) score += 20;
    else if (metrics.totalInteractions >= 25) score += 15;
    else if (metrics.totalInteractions >= 10) score += 10;
    else if (metrics.totalInteractions >= 5) score += 5;
    
    if (metrics.uniqueCandidates >= 20) score += 20;
    else if (metrics.uniqueCandidates >= 10) score += 15;
    else if (metrics.uniqueCandidates >= 5) score += 10;
    
    const hiredCount = metrics.actionDistribution.hired || 0;
    if (hiredCount >= 5) score += 30;
    else if (hiredCount >= 3) score += 20;
    else if (hiredCount >= 1) score += 10;
    
    if (metrics.averageInteractionsPerCandidate >= 3 && metrics.averageInteractionsPerCandidate <= 6) score += 15;
    else if (metrics.averageInteractionsPerCandidate >= 2 && metrics.averageInteractionsPerCandidate <= 8) score += 10;
    
    const shortlistedCount = metrics.actionDistribution.shortlisted || 0;
    const viewedCount = metrics.actionDistribution.viewed || 0;
    if (viewedCount > 0 && (shortlistedCount / viewedCount) >= 0.3) score += 15;
    else if (viewedCount > 0 && (shortlistedCount / viewedCount) >= 0.2) score += 10;
    
    return Math.min(score, 100);
  } catch (error) {
    console.error("Error calculating overall performance score:", error);
    return 0;
  }
}

function calculateBehaviorConfidence(learningRecord) {
  try {
    if (!learningRecord || !learningRecord.interactionHistory) {
      return 0;
    }

    const interactionCount = learningRecord.interactionHistory.length;
    const uniqueCandidates = new Set(learningRecord.interactionHistory.map(i => i.candidateId)).size;
    const actionTypes = new Set(learningRecord.interactionHistory.map(i => i.action)).size;
    
    let confidence = 0;
    
    if (interactionCount >= 50) confidence += 25;
    else if (interactionCount >= 25) confidence += 20;
    else if (interactionCount >= 10) confidence += 15;
    else if (interactionCount >= 5) confidence += 10;
    
    if (uniqueCandidates >= 20) confidence += 25;
    else if (uniqueCandidates >= 10) confidence += 20;
    else if (uniqueCandidates >= 5) confidence += 15;
    
    if (actionTypes >= 4) confidence += 25;
    else if (actionTypes >= 3) confidence += 20;
    else if (actionTypes >= 2) confidence += 15;
    
    if (learningRecord.lastBehaviorUpdate) {
      const daysSinceUpdate = Math.floor((new Date() - new Date(learningRecord.lastBehaviorUpdate)) / (1000 * 60 * 60 * 24));
      if (daysSinceUpdate <= 7) confidence += 25;
      else if (daysSinceUpdate <= 30) confidence += 15;
      else if (daysSinceUpdate <= 90) confidence += 10;
    }

    return Math.min(confidence, 100);
  } catch (error) {
    console.error("Error calculating behavior confidence:", error);
    return 0;
  }
}

function getDefaultBehavior() {
  return {
    hiringVelocity: {
      hiresPerMonth: 0,
      averageTimeToHire: 0,
      hiringTrend: 'stable'
    },
    sourcingPatterns: {
      channels: [],
      methods: [],
      peakHours: [],
      totalInteractions: 0
    },
    topPreferredSkills: {
      skills: [],
      industries: [],
      experienceLevels: []
    },
    hiringSuccessIndicators: {
      conversionRate: 0,
      acceptanceRate: 0,
      rejectionRate: 0,
      efficiency: 0
    },
    interactionPatterns: {
      dailyActivity: {},
      weeklyActivity: {},
      monthlyActivity: {},
      responseTime: [],
      decisionSpeed: {
        viewedToShortlisted: [],
        shortlistedToContacted: []
      }
    },
    timePatterns: {
      mostActiveDay: null,
      mostActiveHour: null,
      averageInteractionsPerDay: 0,
      peakActivityPeriod: null,
      consistency: 0
    },
    conversionFunnel: {
      funnel: {},
      conversionRates: {},
      dropOffPoints: []
    },
    lastUpdated: null,
    confidence: 0
  };
}

function getDefaultMetrics() {
  return {
    totalInteractions: 0,
    uniqueCandidates: 0,
    actionDistribution: {},
    averageInteractionsPerCandidate: 0,
    peakActivityDay: null,
    responseTime: 0
  };
}

async function getRecruiterLearningRecord(recruiterId) {
  try {
    const RecruiterLearning = await import("../../models/recruiterLearning.model.js");
    const record = await RecruiterLearning.default.findOne({ recruiterId }).lean();
    return record;
  } catch (error) {
    console.error("Error getting recruiter learning record:", error);
    return null;
  }
}

async function getCandidateData(candidateId) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    const candidate = await SourcingCandidate.default.findById(candidateId).lean();
    return candidate || {};
  } catch (error) {
    console.error("Error getting candidate data:", error);
    return {};
  }
}

function inferIndustryFromCompany(company) {
  if (!company) return null;
  
  const companyLower = company.toLowerCase();
  
  const industryMap = {
    'google': 'technology',
    'microsoft': 'technology',
    'amazon': 'technology',
    'facebook': 'technology',
    'apple': 'technology',
    'netflix': 'technology',
    'uber': 'technology',
    'airbnb': 'technology',
    'spotify': 'technology',
    'linkedin': 'technology',
    'twitter': 'technology',
    'instagram': 'technology',
    'jpmorgan': 'finance',
    'goldman sachs': 'finance',
    'bank of america': 'finance',
    'citibank': 'finance',
    'wells fargo': 'finance',
    'mckinsey': 'consulting',
    'deloitte': 'consulting',
    'accenture': 'consulting',
    'pwc': 'consulting',
    'kpmg': 'consulting',
    'ernst & young': 'consulting',
    'johnson & johnson': 'healthcare',
    'pfizer': 'healthcare',
    'merck': 'healthcare',
    'novartis': 'healthcare',
    'procter & gamble': 'consumer',
    'coca-cola': 'consumer',
    'pepsico': 'consumer',
    'nestle': 'consumer',
    'unilever': 'consumer',
    'toyota': 'automotive',
    'ford': 'automotive',
    'general motors': 'automotive',
    'volkswagen': 'automotive',
    'bmw': 'automotive'
  };

  for (const [key, industry] of Object.entries(industryMap)) {
    if (companyLower.includes(key)) {
      return industry;
    }
  }

  return null;
}

function getExperienceLevel(experience) {
  if (experience < 2) return 'entry';
  if (experience < 5) return 'junior';
  if (experience < 8) return 'mid';
  return 'senior';
}

export async function updateRecruiterBehavior(recruiterId, behaviorData) {
  try {
    const learningRecord = await getRecruiterLearningRecord(recruiterId);
    
    if (!learningRecord) {
      learningRecord = getDefaultBehavior();
    }
    
    // Update behavior data
    learningRecord.behavior = {
      ...learningRecord.behavior,
      ...behaviorData,
      lastUpdated: new Date().toISOString()
    };
    
    // Save updated record
    await updateRecruiterModel(recruiterId, learningRecord);
    
    return learningRecord;
  } catch (error) {
    console.error("Error updating recruiter behavior:", error);
    throw new Error(`Failed to update recruiter behavior: ${error.message}`);
  }
}

export async function getRecruiterInsights(recruiterId, timeRange = '30d') {
  try {
    const learningRecord = await getRecruiterLearningRecord(recruiterId);
    
    if (!learningRecord || !learningRecord.behavior) {
      return {
        insights: [],
        summary: {
          totalInteractions: 0,
          averageResponseTime: 0,
          preferredSkills: [],
          preferredLocations: [],
          hiringPatterns: []
        }
      };
    }
    
    const behavior = learningRecord.behavior;
    const insights = {
      interactionPatterns: analyzeInteractionPatterns(behavior.interactions || []),
      skillPreferences: analyzeSkillPreferences(behavior.skillPreferences || {}),
      locationPreferences: analyzeLocationPreferences(behavior.locationPreferences || {}),
      hiringTrends: analyzeHiringTrends(behavior.hiringHistory || []),
      timeEfficiency: calculateTimeEfficiency(behavior.interactions || [])
    };
    
    return {
      insights,
      summary: {
        totalInteractions: behavior.interactions?.length || 0,
        averageResponseTime: calculateAverageResponseTime(behavior.interactions || []),
        preferredSkills: Object.keys(behavior.skillPreferences || {}),
        preferredLocations: Object.keys(behavior.locationPreferences || {}),
        hiringPatterns: behavior.hiringHistory?.slice(-10) || []
      },
      timeRange
    };
  } catch (error) {
    console.error("Error getting recruiter insights:", error);
    throw new Error(`Failed to get recruiter insights: ${error.message}`);
  }
}

function analyzeInteractionPatterns(interactions) {
  // Analyze interaction patterns
  return {
    peakHours: calculatePeakHours(interactions),
    averageSessionLength: calculateAverageSessionLength(interactions),
    mostActiveDays: calculateMostActiveDays(interactions)
  };
}

function analyzeSkillPreferences(skillPreferences) {
  return {
    topSkills: Object.entries(skillPreferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, weight]) => ({ skill, weight })),
    diversity: calculateSkillDiversity(skillPreferences)
  };
}

function analyzeLocationPreferences(locationPreferences) {
  return {
    preferredRegions: Object.entries(locationPreferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([location, weight]) => ({ location, weight })),
    coverage: calculateLocationCoverage(locationPreferences)
  };
}

function analyzeHiringTrends(hiringHistory) {
  return {
    recentHiringRate: calculateRecentHiringRate(hiringHistory),
    averageTimeToHire: calculateAverageTimeToHire(hiringHistory),
    successRate: calculateHiringSuccessRate(hiringHistory)
  };
}

function calculateTimeEfficiency(interactions) {
  return {
    averageResponseTime: calculateAverageResponseTime(interactions),
    timePerInteraction: calculateTimePerInteraction(interactions),
    efficiency: calculateEfficiency(interactions)
  };
}

// Helper functions
function calculatePeakHours(interactions) {
  const hourCounts = {};
  interactions.forEach(interaction => {
    const hour = new Date(interaction.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  return Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour, count]) => ({ hour, count }));
}

function calculateAverageSessionLength(interactions) {
  if (interactions.length === 0) return 0;
  const sessionLengths = interactions.map(interaction => interaction.duration || 0);
  return sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length;
}

function calculateMostActiveDays(interactions) {
  const dayCounts = {};
  interactions.forEach(interaction => {
    const day = new Date(interaction.timestamp).getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  return Object.entries(dayCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([day, count]) => ({ day, count }));
}

function calculateSkillDiversity(skillPreferences) {
  const categories = new Set();
  Object.keys(skillPreferences).forEach(skill => {
    const category = categorizeSkill(skill);
    categories.add(category);
  });
  return categories.size;
}

function calculateLocationCoverage(locationPreferences) {
  return Object.keys(locationPreferences).length;
}

function calculateRecentHiringRate(hiringHistory) {
  const recent = hiringHistory.filter(hiring => 
    new Date(hiring.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  return recent.length;
}

function calculateAverageTimeToHire(hiringHistory) {
  if (hiringHistory.length === 0) return 0;
  const times = hiringHistory
    .filter(hiring => hiring.timeToHire)
    .map(hiring => hiring.timeToHire);
  return times.reduce((sum, time) => sum + time, 0) / times.length;
}

function calculateHiringSuccessRate(hiringHistory) {
  if (hiringHistory.length === 0) return 0;
  const successful = hiringHistory.filter(hiring => hiring.status === 'hired');
  return (successful.length / hiringHistory.length) * 100;
}

function calculateAverageResponseTime(interactions) {
  if (interactions.length === 0) return 0;
  const responseTimes = interactions
    .filter(interaction => interaction.responseTime)
    .map(interaction => interaction.responseTime);
  return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
}

function calculateTimePerInteraction(interactions) {
  if (interactions.length === 0) return 0;
  return interactions.reduce((sum, interaction) => sum + (interaction.duration || 0), 0) / interactions.length;
}

function calculateEfficiency(interactions) {
  const totalInteractions = interactions.length;
  const successfulInteractions = interactions.filter(interaction => interaction.success).length;
  return totalInteractions > 0 ? (successfulInteractions / totalInteractions) * 100 : 0;
}

function categorizeSkill(skill) {
  const categories = {
    'javascript': 'frontend',
    'react': 'frontend',
    'vue': 'frontend',
    'angular': 'frontend',
    'node.js': 'backend',
    'python': 'backend',
    'java': 'backend',
    'c#': 'backend',
    'sql': 'database',
    'mongodb': 'database',
    'postgresql': 'database',
    'aws': 'cloud',
    'azure': 'cloud',
    'gcp': 'cloud'
  };
  return categories[skill.toLowerCase()] || 'other';
}
