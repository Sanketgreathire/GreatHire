import { githubRateLimitService } from "./githubRateLimit.service.js";

export class GitHubProfileParser {
  constructor() {
    this.skillKeywords = {
      frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'webpack', 'next.js', 'nuxt.js', 'gatsby', 'svelte', 'tailwind'],
      backend: ['node', 'express', 'django', 'flask', 'rails', 'spring', 'laravel', 'php', 'java', 'python', 'ruby', 'go', 'rust', 'elixir', 'scala'],
      database: ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'neo4j', 'influxdb'],
      cloud: ['aws', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel', 'netlify', 'digitalocean', 'alibaba cloud'],
      devops: ['docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions', 'travis ci', 'circleci', 'terraform', 'ansible', 'puppet'],
      ai_ml: ['tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'jupyter', 'machine learning', 'deep learning', 'nlp', 'computer vision'],
      mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin', 'cordova', 'ionic'],
      testing: ['jest', 'mocha', 'jasmine', 'karma', 'cypress', 'selenium', 'playwright', 'rspec', 'pytest'],
      security: ['oauth', 'jwt', 'ssl', 'tls', 'encryption', 'authentication', 'authorization', 'penetration testing'],
      blockchain: ['ethereum', 'bitcoin', 'solidity', 'web3', 'smart contracts', 'dapps', 'defi', 'nft'],
      tools: ['git', 'github', 'gitlab', 'bitbucket', 'vscode', 'vim', 'emacs', 'intellij', 'postman', 'swagger']
    };
  }

  async parseProfile(data) {
    const { user, repositories, organizations } = data;
    
    const profile = {
      basic: this.parseBasicInfo(user),
      repositories: this.parseRepositories(repositories),
      organizations: this.parseOrganizations(organizations),
      skills: this.extractSkills(repositories),
      experience: this.extractExperience(repositories),
      education: this.extractEducation(user),
      portfolio: this.extractPortfolio(repositories),
      bio: this.parseBio(user),
      location: this.parseLocation(user),
      contact: this.parseContactInfo(user),
      languages: this.extractLanguages(repositories),
      contributions: this.calculateContributions(repositories, user),
      activity: this.analyzeActivity(repositories),
      expertise: this.identifyExpertise(repositories)
    };

    return profile;
  }

  parseBasicInfo(user) {
    return {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio,
      email: user.email,
      location: user.location,
      company: user.company,
      blog: user.blog,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      hireable: user.hireable,
      twitterUsername: user.twitter_username
    };
  }

  parseRepositories(repositories) {
    return repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      languages: {}, // Will be populated separately
      url: repo.html_url,
      cloneUrl: repo.clone_url,
      sshUrl: repo.ssh_url,
      size: repo.size,
      stargazersCount: repo.stargazers_count,
      watchersCount: repo.watchers_count,
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
      defaultBranch: repo.default_branch,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      homepage: repo.homepage,
      language: repo.language,
      topics: repo.topics || [],
      hasPages: repo.has_pages,
      archived: repo.archived,
      disabled: repo.disabled,
      license: repo.license ? repo.license.key : null,
      owner: {
        login: repo.owner.login,
        type: repo.owner.type
      },
      isPrivate: repo.private,
      isFork: repo.fork,
      parent: repo.parent ? {
        fullName: repo.parent.full_name,
        url: repo.parent.html_url
      } : null
    }));
  }

  parseOrganizations(organizations) {
    return organizations.map(org => ({
      id: org.id,
      login: org.login,
      description: org.description,
      avatarUrl: org.avatar_url,
      htmlUrl: org.html_url,
      location: org.location,
      blog: org.blog,
      company: org.company,
      email: org.email,
      twitterUsername: org.twitter_username,
      publicRepos: org.public_repos,
      followers: org.followers,
      following: org.following,
      createdAt: org.created_at,
      updatedAt: org.updated_at
    }));
  }

  extractSkills(repositories) {
    const skills = new Set();
    const languageFrequency = {};
    const topicFrequency = {};

    // Extract from languages
    repositories.forEach(repo => {
      if (repo.language) {
        languageFrequency[repo.language] = (languageFrequency[repo.language] || 0) + 1;
        skills.add(repo.language.toLowerCase());
      }
    });

    // Extract from topics
    repositories.forEach(repo => {
      if (repo.topics) {
        repo.topics.forEach(topic => {
          topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
          skills.add(topic.toLowerCase());
        });
      }
    });

    // Extract from repository names and descriptions
    repositories.forEach(repo => {
      const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
      
      Object.entries(this.skillKeywords).forEach(([category, keywords]) => {
        keywords.forEach(keyword => {
          if (text.includes(keyword)) {
            skills.add(keyword);
          }
        });
      });
    });

    return {
      all: Array.from(skills),
      languages: Object.keys(languageFrequency).sort((a, b) => languageFrequency[b] - languageFrequency[a]),
      topics: Object.keys(topicFrequency).sort((a, b) => topicFrequency[b] - topicFrequency[a]),
      frequency: {
        languages: languageFrequency,
        topics: topicFrequency
      }
    };
  }

  extractExperience(repositories) {
    const experience = [];
    const currentDate = new Date();

    // Group repositories by year
    const reposByYear = {};
    repositories.forEach(repo => {
      const year = new Date(repo.created_at).getFullYear();
      if (!reposByYear[year]) reposByYear[year] = [];
      reposByYear[year].push(repo);
    });

    // Create experience entries
    Object.entries(reposByYear)
      .sort(([a], [b]) => b - a)
      .slice(0, 5) // Last 5 years
      .forEach(([year, repos]) => {
        const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

        experience.push({
          title: `${languages[0] || 'Software'} Developer`,
          company: 'Open Source',
          period: `${year}`,
          startDate: `${year}-01-01`,
          endDate: `${year}-12-31`,
          current: year === currentDate.getFullYear(),
          description: `Developed ${repos.length} open source projects`,
          technologies: languages,
          achievements: [
            `${repos.length} repositories`,
            `${totalStars} total stars`,
            `${totalForks} total forks`
          ],
          repositories: repos.map(repo => ({
            name: repo.name,
            url: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language
          }))
        });
      });

    return experience;
  }

  extractEducation(user) {
    // GitHub doesn't provide education info, but we can infer from bio
    const education = [];
    
    if (user.bio) {
      const bio = user.bio.toLowerCase();
      
      // Look for education indicators
      const educationKeywords = [
        'student', 'university', 'college', 'bs', 'ms', 'phd', 'bachelor', 'master', 'doctorate',
        'mit', 'stanford', 'harvard', 'berkeley', 'cmu', 'caltech', 'cornell', 'princeton'
      ];
      
      educationKeywords.forEach(keyword => {
        if (bio.includes(keyword)) {
          education.push({
            institution: keyword,
            degree: 'Not specified',
            field: 'Not specified',
            source: 'bio'
          });
        }
      });
    }

    return education;
  }

  extractPortfolio(repositories) {
    return repositories
      .filter(repo => !repo.archived && !repo.fork && (repo.stargazers_count > 0 || repo.description))
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        homepage: repo.homepage,
        hasDemo: !!repo.homepage,
        isFeatured: repo.stargazers_count > 10
      }));
  }

  parseBio(user) {
    return user.bio || '';
  }

  parseLocation(user) {
    return user.location || '';
  }

  parseContactInfo(user) {
    return {
      email: user.email,
      blog: user.blog,
      twitter: user.twitter_username ? `https://twitter.com/${user.twitter_username}` : null,
      linkedin: this.extractLinkedInFromBio(user.bio),
      website: user.blog
    };
  }

  extractLinkedInFromBio(bio) {
    if (!bio) return null;
    
    const linkedinRegex = /https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+/g;
    const matches = bio.match(linkedinRegex);
    return matches ? matches[0] : null;
  }

  extractLanguages(repositories) {
    const languages = {};
    
    repositories.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .map(([language, count]) => ({
        language,
        count,
        percentage: ((count / repositories.length) * 100).toFixed(1)
      }));
  }

  calculateContributions(repositories, user) {
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalIssues = repositories.reduce((sum, repo) => sum + repo.open_issues_count, 0);
    
    const activeRepos = repositories.filter(repo => {
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      return new Date(repo.pushed_at) > sixMonthsAgo;
    });

    return {
      totalRepositories: repositories.length,
      totalStars,
      totalForks,
      totalIssues,
      activeRepositories: activeRepos.length,
      followers: user.followers,
      following: user.following,
      accountAge: this.calculateAccountAge(user.created_at),
      contributionScore: this.calculateContributionScore(repositories, user),
      languages: this.extractLanguages(repositories)
    };
  }

  calculateAccountAge(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  }

  calculateContributionScore(repositories, user) {
    let score = 0;
    
    // Followers contribution
    score += Math.min(user.followers / 10, 20);
    
    // Repository contributions
    score += repositories.length * 2;
    
    // Star contributions
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    score += Math.min(totalStars / 5, 50);
    
    // Fork contributions
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    score += Math.min(totalForks / 2, 20);
    
    // Activity bonus
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const activeRepos = repositories.filter(repo => new Date(repo.pushed_at) > sixMonthsAgo);
    score += activeRepos.length * 5;
    
    return Math.round(score);
  }

  analyzeActivity(repositories) {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    
    const activity = {
      lastMonth: repositories.filter(repo => new Date(repo.pushed_at) > oneMonthAgo).length,
      lastThreeMonths: repositories.filter(repo => new Date(repo.pushed_at) > threeMonthsAgo).length,
      lastSixMonths: repositories.filter(repo => new Date(repo.pushed_at) > sixMonthsAgo).length,
      total: repositories.length
    };

    activity.lastMonthPercentage = ((activity.lastMonth / activity.total) * 100).toFixed(1);
    activity.lastThreeMonthsPercentage = ((activity.lastThreeMonths / activity.total) * 100).toFixed(1);
    activity.lastSixMonthsPercentage = ((activity.lastSixMonths / activity.total) * 100).toFixed(1);

    return activity;
  }

  identifyExpertise(repositories) {
    const expertise = {
      primary: null,
      secondary: [],
      level: 'junior',
      specializations: []
    };

    const languageCount = {};
    repositories.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    const sortedLanguages = Object.entries(languageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    if (sortedLanguages.length > 0) {
      expertise.primary = sortedLanguages[0][0];
      expertise.secondary = sortedLanguages.slice(1).map(([lang]) => lang);
    }

    // Determine level based on experience
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const activeRepos = repositories.filter(repo => {
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      return new Date(repo.pushed_at) > sixMonthsAgo;
    });

    if (totalStars > 1000 || activeRepos.length > 20) {
      expertise.level = 'senior';
    } else if (totalStars > 100 || activeRepos.length > 5) {
      expertise.level = 'mid';
    }

    // Identify specializations
    const specializations = [];
    
    // Check for frontend specialization
    const frontendRepos = repositories.filter(repo => 
      this.skillKeywords.frontend.some(skill => 
        repo.name.toLowerCase().includes(skill) || 
        (repo.description && repo.description.toLowerCase().includes(skill))
      )
    );
    
    if (frontendRepos.length > 3) {
      specializations.push('frontend');
    }

    // Check for backend specialization
    const backendRepos = repositories.filter(repo => 
      this.skillKeywords.backend.some(skill => 
        repo.name.toLowerCase().includes(skill) || 
        (repo.description && repo.description.toLowerCase().includes(skill))
      )
    );
    
    if (backendRepos.length > 3) {
      specializations.push('backend');
    }

    // Check for full-stack
    if (specializations.includes('frontend') && specializations.includes('backend')) {
      specializations.push('full-stack');
    }

    expertise.specializations = specializations;

    return expertise;
  }
}

export const githubProfileParser = new GitHubProfileParser();
export default githubProfileParser;
