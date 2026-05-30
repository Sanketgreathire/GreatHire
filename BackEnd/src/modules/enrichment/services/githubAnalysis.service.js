import axios from "axios";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

export async function analyzeGitHubProfile(candidate) {
  try {
    const githubLink = candidate.socialLinks?.find(link => link.platform === 'github');
    if (!githubLink) {
      return null;
    }

    const username = extractGitHubUsername(githubLink.url);
    if (!username) {
      return null;
    }

    const [userProfile, repositories, contributions] = await Promise.allSettled([
      getUserProfile(username),
      getUserRepositories(username),
      getUserContributions(username)
    ]);

    const profileData = userProfile.status === 'fulfilled' ? userProfile.value : null;
    const reposData = repositories.status === 'fulfilled' ? repositories.value : [];
    const contributionsData = contributions.status === 'fulfilled' ? contributions.value : null;

    const analysis = {
      username,
      profile: profileData,
      repositories: reposData,
      contributions: contributionsData,
      insights: null
    };

    analysis.insights = generateGitHubInsights(analysis);

    return analysis;
  } catch (error) {
    console.error("Error analyzing GitHub profile:", error);
    return null;
  }
}

function extractGitHubUsername(githubUrl) {
  if (!githubUrl) return null;
  
  const patterns = [
    /github\.com\/([^\/\?]+)/,
    /github\.com\/users\/([^\/\?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = githubUrl.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/\/$/, '');
    }
  }
  
  return null;
}

async function getUserProfile(username) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
      headers,
      timeout: 10000
    });

    return {
      login: response.data.login,
      name: response.data.name,
      bio: response.data.bio,
      location: response.data.location,
      company: response.data.company,
      email: response.data.email,
      blog: response.data.blog,
      publicRepos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      hireable: response.data.hireable,
      type: response.data.type
    };
  } catch (error) {
    console.error("Error fetching GitHub user profile:", error.message);
    throw error;
  }
}

async function getUserRepositories(username) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}/repos`, {
      headers,
      params: {
        type: 'owner',
        sort: 'updated',
        per_page: 100
      },
      timeout: 15000
    });

    return response.data.map(repo => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      size: repo.size,
      stargazersCount: repo.stargazers_count,
      watchersCount: repo.watchers_count,
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      isPrivate: repo.private,
      isFork: repo.fork,
      defaultBranch: repo.default_branch,
      topics: repo.topics || [],
      license: repo.license?.name || null,
      homepage: repo.homepage
    }));
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error.message);
    throw error;
  }
}

async function getUserContributions(username) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}/events`, {
      headers,
      params: {
        per_page: 30
      },
      timeout: 10000
    });

    const events = response.data.slice(0, 30);
    const contributionTypes = {};
    const recentActivity = [];

    events.forEach(event => {
      contributionTypes[event.type] = (contributionTypes[event.type] || 0) + 1;
      
      if (event.created_at) {
        recentActivity.push({
          type: event.type,
          repo: event.repo?.name,
          createdAt: event.created_at
        });
      }
    });

    return {
      contributionTypes,
      recentActivity: recentActivity.slice(0, 10),
      totalEvents: events.length,
      lastActivity: events.length > 0 ? events[0].created_at : null
    };
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error.message);
    return null;
  }
}

function generateGitHubInsights(analysis) {
  const insights = {
    technicalSkills: [],
    languages: {},
    projectComplexity: 'unknown',
    contributionPattern: 'unknown',
    activityLevel: 'unknown',
    expertiseAreas: [],
    collaborationLevel: 'unknown',
    codeQuality: 'unknown',
    innovationScore: 0,
    consistencyScore: 0,
    leadershipIndicators: []
  };

  if (analysis.repositories && analysis.repositories.length > 0) {
    insights.languages = analyzeLanguages(analysis.repositories);
    insights.technicalSkills = extractTechnicalSkills(analysis.repositories);
    insights.projectComplexity = assessProjectComplexity(analysis.repositories);
    insights.codeQuality = assessCodeQuality(analysis.repositories);
    insights.innovationScore = calculateInnovationScore(analysis.repositories);
  }

  if (analysis.contributions) {
    insights.contributionPattern = analyzeContributionPattern(analysis.contributions);
    insights.activityLevel = assessActivityLevel(analysis.contributions);
    insights.consistencyScore = calculateConsistencyScore(analysis.contributions);
  }

  if (analysis.profile) {
    insights.collaborationLevel = assessCollaborationLevel(analysis.profile);
    insights.leadershipIndicators = detectLeadershipIndicators(analysis.profile, analysis.repositories);
  }

  insights.expertiseAreas = identifyExpertiseAreas(insights);

  return insights;
}

function analyzeLanguages(repositories) {
  const languageStats = {};
  const totalRepos = repositories.length;

  repositories.forEach(repo => {
    if (repo.language) {
      languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
    }
  });

  const languages = Object.keys(languageStats).map(lang => ({
    name: lang,
    count: languageStats[lang],
    percentage: ((languageStats[lang] / totalRepos) * 100).toFixed(1)
  }));

  return languages.sort((a, b) => b.count - a.count);
}

function extractTechnicalSkills(repositories) {
  const skills = new Set();
  
  repositories.forEach(repo => {
    if (repo.language) {
      skills.add(repo.language);
    }

    if (repo.topics && repo.topics.length > 0) {
      repo.topics.forEach(topic => {
        const techKeywords = extractTechKeywordsFromTopic(topic);
        techKeywords.forEach(keyword => skills.add(keyword));
      });
    }

    const repoNameSkills = extractTechKeywordsFromRepoName(repo.name);
    repoNameSkills.forEach(skill => skills.add(skill));
  });

  return Array.from(skills);
}

function extractTechKeywordsFromTopic(topic) {
  const techKeywords = [];
  const knownTech = [
    'react', 'vue', 'angular', 'node', 'express', 'django', 'flask', 'spring', 'laravel',
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'swift',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
    'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra',
    'tensorflow', 'pytorch', 'scikit-learn', 'keras', 'opencv',
    'react-native', 'flutter', 'swift', 'kotlin', 'ionic',
    'graphql', 'rest', 'api', 'microservices', 'serverless',
    'machine-learning', 'deep-learning', 'ai', 'data-science', 'blockchain',
    'web3', 'ethereum', 'solidity', 'smart-contracts', 'nft'
  ];

  const lowerTopic = topic.toLowerCase();
  knownTech.forEach(tech => {
    if (lowerTopic.includes(tech)) {
      techKeywords.push(tech);
    }
  });

  return techKeywords;
}

function extractTechKeywordsFromRepoName(repoName) {
  const keywords = [];
  const techPatterns = [
    /react/i, /vue/i, /angular/i, /node/i, /express/i, /django/i,
    /python/i, /java/i, /javascript/i, /typescript/i, /go/i, /rust/i,
    /aws/i, /azure/i, /docker/i, /k8s/i, /kubernetes/i,
    /ml/i, /ai/i, /bot/i, /api/i, /web/i, /mobile/i,
    /blockchain/i, /crypto/i, /nft/i, /web3/i
  ];

  techPatterns.forEach(pattern => {
    if (pattern.test(repoName)) {
      keywords.push(repoName.match(pattern)[0].toLowerCase());
    }
  });

  return keywords;
}

function assessProjectComplexity(repositories) {
  if (repositories.length === 0) return 'unknown';

  const avgSize = repositories.reduce((sum, repo) => sum + repo.size, 0) / repositories.length;
  const avgStars = repositories.reduce((sum, repo) => sum + repo.stargazersCount, 0) / repositories.length;
  const avgForks = repositories.reduce((sum, repo) => sum + repo.forksCount, 0) / repositories.length;
  const hasComplexTopics = repositories.some(repo => repo.topics && repo.topics.length > 3);

  if (avgSize > 1000 || avgStars > 100 || avgForks > 50 || hasComplexTopics) {
    return 'high';
  } else if (avgSize > 100 || avgStars > 10 || avgForks > 10) {
    return 'medium';
  } else {
    return 'low';
  }
}

function assessCodeQuality(repositories) {
  if (repositories.length === 0) return 'unknown';

  const qualityIndicators = {
    hasReadme: repositories.filter(repo => repo.description && repo.description.length > 50).length,
    hasLicense: repositories.filter(repo => repo.license).length,
    hasHomepage: repositories.filter(repo => repo.homepage).length,
    hasTopics: repositories.filter(repo => repo.topics && repo.topics.length > 0).length,
    avgStars: repositories.reduce((sum, repo) => sum + repo.stargazersCount, 0) / repositories.length,
    avgForks: repositories.reduce((sum, repo) => sum + repo.forksCount, 0) / repositories.length
  };

  const qualityScore = (
    (qualityIndicators.hasReadme / repositories.length) * 25 +
    (qualityIndicators.hasLicense / repositories.length) * 20 +
    (qualityIndicators.hasHomepage / repositories.length) * 15 +
    (qualityIndicators.hasTopics / repositories.length) * 20 +
    Math.min(qualityIndicators.avgStars / 10, 20)
  );

  if (qualityScore >= 80) return 'excellent';
  if (qualityScore >= 60) return 'good';
  if (qualityScore >= 40) return 'fair';
  return 'poor';
}

function calculateInnovationScore(repositories) {
  if (repositories.length === 0) return 0;

  let innovationScore = 0;
  
  repositories.forEach(repo => {
    if (repo.topics) {
      const innovativeTopics = repo.topics.filter(topic => 
        topic.includes('ai') || topic.includes('ml') || topic.includes('blockchain') ||
        topic.includes('web3') || topic.includes('ar') || topic.includes('vr') ||
        topic.includes('iot') || topic.includes('quantum') || topic.includes('serverless')
      );
      innovationScore += innovativeTopics.length * 2;
    }

    if (repo.stargazersCount > 50) innovationScore += 5;
    if (repo.forksCount > 20) innovationScore += 3;
    if (repo.license) innovationScore += 1;
  });

  return Math.min(innovationScore, 100);
}

function analyzeContributionPattern(contributions) {
  if (!contributions || !contributions.contributionTypes) return 'unknown';

  const types = contributions.contributionTypes;
  const totalEvents = contributions.totalEvents;

  if (totalEvents === 0) return 'inactive';

  const pushEvents = types['PushEvent'] || 0;
  const createEvents = types['CreateEvent'] || 0;
  const issueEvents = types['IssuesEvent'] || 0;
  const pullRequestEvents = types['PullRequestEvent'] || 0;

  const pushRatio = pushEvents / totalEvents;
  const createRatio = createEvents / totalEvents;
  const engagementRatio = (issueEvents + pullRequestEvents) / totalEvents;

  if (pushRatio > 0.7 && engagementRatio > 0.2) {
    return 'active-developer';
  } else if (createRatio > 0.3 && pushRatio > 0.4) {
    return 'project-creator';
  } else if (engagementRatio > 0.4) {
    return 'collaborative-contributor';
  } else if (pushRatio > 0.8) {
    return 'solo-developer';
  } else {
    return 'mixed-activity';
  }
}

function assessActivityLevel(contributions) {
  if (!contributions || !contributions.lastActivity) return 'unknown';

  const lastActivity = new Date(contributions.lastActivity);
  const now = new Date();
  const daysSinceActivity = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));

  if (daysSinceActivity <= 7) return 'very-active';
  if (daysSinceActivity <= 30) return 'active';
  if (daysSinceActivity <= 90) return 'moderate';
  return 'inactive';
}

function calculateConsistencyScore(contributions) {
  if (!contributions || !contributions.recentActivity || contributions.recentActivity.length === 0) {
    return 0;
  }

  const activities = contributions.recentActivity.slice(0, 10);
  const dates = activities.map(activity => new Date(activity.createdAt));
  
  let consistencyScore = 100;
  
  for (let i = 1; i < dates.length; i++) {
    const dayDiff = Math.abs(dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24);
    if (dayDiff > 7) consistencyScore -= 10;
    else if (dayDiff > 3) consistencyScore -= 5;
  }

  return Math.max(consistencyScore, 0);
}

function assessCollaborationLevel(profile) {
  if (!profile) return 'unknown';

  const followers = profile.followers || 0;
  const following = profile.following || 0;
  const publicRepos = profile.publicRepos || 0;

  if (followers > 100 && following > 50) return 'high';
  if (followers > 20 && following > 10) return 'medium';
  if (followers > 5) return 'low';
  return 'minimal';
}

function detectLeadershipIndicators(profile, repositories) {
  const indicators = [];

  if (profile && profile.followers > 50) {
    indicators.push('community-influence');
  }

  if (repositories && repositories.some(repo => repo.stargazersCount > 100)) {
    indicators.push('project-leadership');
  }

  if (repositories && repositories.filter(repo => repo.forksCount > 20).length > 2) {
    indicators.push('technical-leadership');
  }

  if (repositories && repositories.some(repo => 
    repo.topics && repo.topics.some(topic => 
      topic.includes('framework') || topic.includes('library') || topic.includes('tool')
    )
  )) {
    indicators.push('open-source-leadership');
  }

  return indicators;
}

function identifyExpertiseAreas(insights) {
  const expertiseAreas = [];

  if (insights.languages && insights.languages.length > 0) {
    const topLanguages = insights.languages.slice(0, 3);
    expertiseAreas.push(...topLanguages.map(lang => `${lang.name}-development`));
  }

  if (insights.technicalSkills && insights.technicalSkills.length > 0) {
    const frameworks = insights.technicalSkills.filter(skill => 
      ['react', 'vue', 'angular', 'django', 'flask', 'express', 'spring'].includes(skill)
    );
    frameworks.forEach(framework => {
      expertiseAreas.push(`${framework}-framework`);
    });
  }

  if (insights.innovationScore > 50) {
    expertiseAreas.push('emerging-technologies');
  }

  if (insights.projectComplexity === 'high') {
    expertiseAreas.push('complex-systems');
  }

  if (insights.leadershipIndicators.includes('open-source-leadership')) {
    expertiseAreas.push('open-source');
  }

  return [...new Set(expertiseAreas)];
}
