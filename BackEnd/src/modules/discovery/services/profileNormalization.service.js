class ProfileNormalizationService {
  constructor() {
    this.skillNormalizationMap = new Map();
    this.titleNormalizationMap = new Map();
    this.companyNormalizationMap = new Map();
    this.locationNormalizationMap = new Map();
    this.initializeNormalizationMaps();
  }

  initializeNormalizationMaps() {
    this.skillNormalizationMap.set('js', 'javascript');
    this.skillNormalizationMap.set('ts', 'typescript');
    this.skillNormalizationMap.set('reactjs', 'react');
    this.skillNormalizationMap.set('nodejs', 'node.js');
    this.skillNormalizationMap.set('node', 'node.js');
    this.skillNormalizationMap.set('py', 'python');
    this.skillNormalizationMap.set('css3', 'css');
    this.skillNormalizationMap.set('html5', 'html');
    this.skillNormalizationMap.set('vuejs', 'vue');
    this.skillNormalizationMap.set('angularjs', 'angular');
    this.skillNormalizationMap.set('aws', 'amazon web services');
    this.skillNormalizationMap.set('gcp', 'google cloud platform');
    this.skillNormalizationMap.set('azure', 'microsoft azure');
    this.skillNormalizationMap.set('sql', 'structured query language');
    this.skillNormalizationMap.set('nosql', 'no-sql');
    this.skillNormalizationMap.set('docker', 'docker containerization');
    this.skillNormalizationMap.set('k8s', 'kubernetes');
    this.skillNormalizationMap.set('k8s', 'kubernetes');
    this.skillNormalizationMap.set('ml', 'machine learning');
    this.skillNormalizationMap.set('ai', 'artificial intelligence');
    this.skillNormalizationMap.set('dl', 'deep learning');
    this.skillNormalizationMap.set('ci/cd', 'continuous integration/continuous deployment');
    this.skillNormalizationMap.set('cicd', 'continuous integration/continuous deployment');
    this.skillNormalizationMap.set('devops', 'devops');
    this.skillNormalizationMap.set('ui/ux', 'user interface/user experience');
    this.skillNormalizationMap.set('ui', 'user interface');
    this.skillNormalizationMap.set('ux', 'user experience');

    this.titleNormalizationMap.set('sr', 'senior');
    this.titleNormalizationMap.set('jr', 'junior');
    this.titleNormalizationMap.set('sde', 'software development engineer');
    this.titleNormalizationMap.set('swe', 'software engineer');
    this.titleNormalizationMap.set('se', 'software engineer');
    this.titleNormalizationMap.set('fe', 'frontend');
    this.titleNormalizationMap.set('be', 'backend');
    this.titleNormalizationMap.set('fs', 'full stack');
    this.titleNormalizationMap.set('qa', 'quality assurance');
    this.titleNormalizationMap.set('pm', 'project manager');
    this.titleNormalizationMap.set('po', 'product owner');
    this.titleNormalizationMap.set('cto', 'chief technology officer');
    this.titleNormalizationMap.set('ceo', 'chief executive officer');
    this.titleNormalizationMap.set('cfo', 'chief financial officer');
    this.titleNormalizationMap.set('coo', 'chief operating officer');

    this.companyNormalizationMap.set('google', 'Google LLC');
    this.companyNormalizationMap.set('microsoft', 'Microsoft Corporation');
    this.companyNormalizationMap.set('amazon', 'Amazon.com, Inc.');
    this.companyNormalizationMap.set('apple', 'Apple Inc.');
    this.companyNormalizationMap.set('facebook', 'Meta Platforms, Inc.');
    this.companyNormalizationMap.set('meta', 'Meta Platforms, Inc.');
    this.companyNormalizationMap.set('netflix', 'Netflix, Inc.');
    this.companyNormalizationMap.set('uber', 'Uber Technologies, Inc.');
    this.companyNormalizationMap.set('lyft', 'Lyft, Inc.');
    this.companyNormalizationMap.set('airbnb', 'Airbnb, Inc.');
    this.companyNormalizationMap.set('spotify', 'Spotify AB');
    this.companyNormalizationMap.set('twitter', 'X Corp.');
    this.companyNormalizationMap.set('x', 'X Corp.');
    this.companyNormalizationMap.set('linkedin', 'LinkedIn Corporation');
  }

  normalizeName(name) {
    if (!name) return '';
    
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  normalizeEmail(email) {
    if (!email) return '';
    
    return email.toLowerCase().trim();
  }

  normalizeSkills(skills) {
    if (!skills || !Array.isArray(skills)) return [];
    
    return skills
      .filter(skill => skill && typeof skill === 'string')
      .map(skill => skill.toLowerCase().trim())
      .map(skill => this.skillNormalizationMap.get(skill) || skill)
      .filter((skill, index, arr) => arr.indexOf(skill) === index)
      .sort();
  }

  normalizeTitle(title) {
    if (!title) return '';
    
    let normalized = title.toLowerCase().trim();
    
    this.titleNormalizationMap.forEach((value, key) => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      normalized = normalized.replace(regex, value);
    });
    
    return normalized
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  normalizeCompany(company) {
    if (!company) return '';
    
    const normalized = company.toLowerCase().trim();
    return this.companyNormalizationMap.get(normalized) || 
           company.charAt(0).toUpperCase() + company.slice(1);
  }

  normalizeLocation(location) {
    if (!location) return '';
    
    return location
      .trim()
      .replace(/\s+/g, ' ')
      .split(',')
      .map(part => part.trim())
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(', ');
  }

  normalizeExperience(experience) {
    if (!experience || !Array.isArray(experience)) return [];
    
    return experience
      .filter(exp => exp && typeof exp === 'object')
      .map(exp => ({
        title: this.normalizeTitle(exp.title),
        company: this.normalizeCompany(exp.company),
        location: this.normalizeLocation(exp.location),
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description || '',
        current: exp.current || false
      }))
      .sort((a, b) => {
        const dateA = new Date(a.endDate || a.startDate);
        const dateB = new Date(b.endDate || b.startDate);
        return dateB - dateA;
      });
  }

  normalizeEducation(education) {
    if (!education || !Array.isArray(education)) return [];
    
    return education
      .filter(edu => edu && typeof edu === 'object')
      .map(edu => ({
        degree: (edu.degree || '').trim(),
        school: this.normalizeCompany(edu.school),
        field: (edu.field || '').trim(),
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
        description: edu.description || ''
      }))
      .sort((a, b) => {
        const dateA = new Date(a.endDate || a.startDate);
        const dateB = new Date(b.endDate || b.startDate);
        return dateB - dateA;
      });
  }

  normalizePortfolio(portfolio) {
    if (!portfolio || !Array.isArray(portfolio)) return [];
    
    return portfolio
      .filter(item => item && typeof item === 'object')
      .map(item => ({
        title: (item.title || '').trim(),
        url: this.normalizeUrl(item.url),
        description: (item.description || '').trim(),
        technologies: this.normalizeSkills(item.technologies),
        startDate: item.startDate,
        endDate: item.endDate
      }));
  }

  normalizeUrl(url) {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      return urlObj.href;
    } catch (error) {
      if (url.startsWith('http')) {
        return url.trim();
      }
      return `https://${url.trim()}`;
    }
  }

  normalizePhone(phone) {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    return cleaned;
  }

  normalizeProfile(profile, sourceType) {
    return {
      name: this.normalizeName(profile.name),
      email: this.normalizeEmail(profile.email),
      phone: this.normalizePhone(profile.phone),
      location: this.normalizeLocation(profile.location),
      skills: this.normalizeSkills(profile.skills),
      experience: this.normalizeExperience(profile.experience),
      education: this.normalizeEducation(profile.education),
      portfolio: this.normalizePortfolio(profile.portfolio),
      githubUrl: this.normalizeUrl(profile.githubUrl),
      linkedinUrl: this.normalizeUrl(profile.linkedinUrl),
      resumeUrl: this.normalizeUrl(profile.resumeUrl),
      title: this.normalizeTitle(profile.title),
      summary: (profile.summary || '').trim(),
      sourceType,
      confidenceScore: profile.confidenceScore || 1.0,
      sourceUrl: profile.sourceUrl || '',
      rawProfile: profile.rawProfile || profile
    };
  }

  async normalizeProfiles(profiles, sourceType) {
    if (!profiles || !Array.isArray(profiles)) return [];
    
    return profiles
      .filter(profile => profile && typeof profile === 'object')
      .map(profile => this.normalizeProfile(profile, sourceType))
      .filter(profile => profile.name || profile.email);
  }
}

export const profileNormalizationService = new ProfileNormalizationService();
export default profileNormalizationService;
