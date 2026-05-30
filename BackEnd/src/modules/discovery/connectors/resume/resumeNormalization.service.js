export class ResumeNormalizationService {
  constructor() {
    this.skillSynonyms = {
      'javascript': ['js', 'ecmascript', 'node'],
      'typescript': ['ts'],
      'python': ['py', 'python3'],
      'java': ['jdk', 'jre', 'jvm'],
      'c#': ['csharp', '.net'],
      'c++': ['cpp', 'cplusplus'],
      'react': ['reactjs', 'react.js'],
      'vue': ['vuejs', 'vue.js'],
      'angular': ['angularjs', 'angular.js'],
      'node.js': ['node', 'nodejs'],
      'express': ['express.js', 'expressjs'],
      'django': ['djangorestframework', 'drf'],
      'mongodb': ['mongo', 'mongoose'],
      'postgresql': ['postgres', 'psql'],
      'mysql': ['mysql-server'],
      'aws': ['amazon web services', 'amazon cloud'],
      'azure': ['microsoft azure', 'ms azure'],
      'gcp': ['google cloud platform', 'google cloud'],
      'docker': ['docker.io'],
      'kubernetes': ['k8s', 'kube'],
      'git': ['gitlab', 'github'],
      'css': ['css3', 'sass', 'scss', 'less'],
      'html': ['html5', 'xhtml'],
      'sql': ['structured query language'],
      'nosql': ['not only sql']
    };

    this.companyVariations = {
      'inc': ['incorporated', 'inc.'],
      'llc': ['limited liability company', 'l.l.c.'],
      'corp': ['corporation', 'corp.'],
      'ltd': ['limited', 'ltd.'],
      'pte': ['private limited', 'pvt. ltd.'],
      'pvt': ['private']
    };

    this.designationVariations = {
      'software engineer': ['software developer', 'programmer', 'coder'],
      'full stack developer': ['fullstack developer', 'full-stack developer', 'mern developer', 'mean developer'],
      'frontend developer': ['front-end developer', 'ui developer', 'web developer'],
      'backend developer': ['back-end developer', 'server-side developer', 'api developer'],
      'devops engineer': ['devops specialist', 'infrastructure engineer'],
      'mobile developer': ['ios developer', 'android developer', 'app developer'],
      'data scientist': ['data analyst', 'machine learning engineer'],
      'product manager': ['pm', 'product owner'],
      'technical lead': ['team lead', 'tech lead', 'lead developer'],
      'senior developer': ['sr developer', 'senior software engineer'],
      'junior developer': ['jr developer', 'junior software engineer', 'entry-level developer']
    };

    this.locationVariations = {
      'usa': ['united states', 'america', 'us'],
      'uk': ['united kingdom', 'england', 'great britain'],
      'nyc': ['new york', 'new york city'],
      'sf': ['san francisco', 'bay area'],
      'la': ['los angeles'],
      'seattle': ['seattle, wa'],
      'boston': ['boston, ma'],
      'austin': ['austin, tx'],
      'chicago': ['chicago, il'],
      'denver': ['denver, co']
    };

    this.educationVariations = {
      'bachelor of science': ['bs', 'b.s.', 'b.sc.'],
      'bachelor of arts': ['ba', 'b.a.', 'b.a.'],
      'master of science': ['ms', 'm.s.', 'm.sc.'],
      'master of arts': ['ma', 'm.a.', 'm.a.'],
      'master of business administration': ['mba', 'm.b.a.'],
      'doctor of philosophy': ['phd', 'ph.d.', 'doctorate'],
      'bachelor of technology': ['btech', 'b.tech', 'b.e.'],
      'master of technology': ['mtech', 'm.tech', 'm.e.'],
      'computer science': ['cs', 'cse'],
      'information technology': ['it', 'info tech'],
      'computer engineering': ['ce', 'ceng']
    };
  }

  async normalizeResume(parsedData) {
    try {
      const normalizedData = {
        fullName: this.normalizeFullName(parsedData.fullName),
        normalizedEmail: this.normalizeEmail(parsedData.email),
        normalizedPhone: this.normalizePhone(parsedData.phone),
        normalizedLocation: this.normalizeLocation(parsedData.location),
        normalizedDesignation: this.normalizeDesignation(parsedData.designation),
        normalizedExperience: this.normalizeExperience(parsedData.experience),
        normalizedSkills: this.normalizeSkills(parsedData.skills),
        normalizedEducation: this.normalizeEducation(parsedData.education),
        normalizedCertifications: this.normalizeCertifications(parsedData.certifications),
        normalizedSocialLinks: this.normalizeSocialLinks(parsedData.socialLinks),
        normalizedLanguages: this.normalizeLanguages(parsedData.languages),
        normalizedProjects: this.normalizeProjects(parsedData.projects),
        normalizationConfidence: 0
      };

      // Calculate normalization confidence
      normalizedData.normalizationConfidence = this.calculateNormalizationConfidence(parsedData, normalizedData);

      return normalizedData;
    } catch (error) {
      console.error('Error normalizing resume:', error);
      throw error;
    }
  }

  normalizeFullName(name) {
    if (!name) return null;

    // Remove extra whitespace and normalize case
    let normalized = name.trim().replace(/\s+/g, ' ');

    // Remove common prefixes/suffixes
    normalized = normalized.replace(/^(mr|mrs|ms|dr|prof|eng|sr|jr)\.?\s+/i, '');
    normalized = normalized.replace(/\s+(?:sr\.?|jr\.?|i\.?|ii\.?|iii\.?)$/i, '');

    // Convert to title case
    normalized = normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    return normalized;
  }

  normalizeEmail(email) {
    if (!email) return null;

    // Convert to lowercase and remove whitespace
    let normalized = email.toLowerCase().trim();

    // Remove common formatting issues
    normalized = normalized.replace(/\s+at\s+/g, '@');
    normalized = normalized.replace(/\s+dot\s+/g, '.');

    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalized)) {
      return null;
    }

    return normalized;
  }

  normalizePhone(phone) {
    if (!phone) return null;

    // Remove all non-digit characters
    let normalized = phone.replace(/\D/g, '');

    // Handle country codes
    if (normalized.startsWith('1') && normalized.length === 11) {
      normalized = normalized.substring(1);
    }

    // Validate phone number (should be 10 digits for US)
    if (normalized.length !== 10) {
      return null;
    }

    // Format as (XXX) XXX-XXXX
    return `(${normalized.substring(0, 3)}) ${normalized.substring(3, 6)}-${normalized.substring(6)}`;
  }

  normalizeLocation(location) {
    if (!location) return null;

    let normalized = location.trim().toLowerCase();

    // Replace common location variations
    Object.entries(this.locationVariations).forEach(([standard, variations]) => {
      variations.forEach(variation => {
        normalized = normalized.replace(new RegExp(variation, 'gi'), standard);
      });
    });

    // Capitalize properly
    normalized = normalized.split(',').map(part => 
      part.trim().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(', ');

    return normalized;
  }

  normalizeDesignation(designation) {
    if (!designation) return null;

    let normalized = designation.trim().toLowerCase();

    // Replace designation variations
    Object.entries(this.designationVariations).forEach(([standard, variations]) => {
      variations.forEach(variation => {
        normalized = normalized.replace(new RegExp(variation, 'gi'), standard);
      });
    });

    // Capitalize properly
    normalized = normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return normalized;
  }

  normalizeExperience(experience) {
    if (!experience || !Array.isArray(experience)) return [];

    return experience.map(exp => ({
      title: this.normalizeDesignation(exp.title),
      company: this.normalizeCompany(exp.company),
      location: this.normalizeLocation(exp.location),
      duration: this.normalizeDuration(exp.duration),
      description: this.normalizeDescription(exp.description),
      responsibilities: this.normalizeResponsibilities(exp.responsibilities),
      achievements: this.normalizeAchievements(exp.achievements),
      startDate: this.normalizeDate(exp.startDate),
      endDate: this.normalizeDate(exp.endDate)
    })).filter(exp => exp.title || exp.company);
  }

  normalizeCompany(company) {
    if (!company) return null;

    let normalized = company.trim();

    // Remove company variations
    Object.entries(this.companyVariations).forEach(([standard, variations]) => {
      variations.forEach(variation => {
        normalized = normalized.replace(new RegExp(`\\b${variation}\\b`, 'gi'), standard);
      });
    });

    // Remove common legal suffixes
    normalized = normalized.replace(/\b(?:inc|llc|corp|ltd|pte|pvt)\.?\s*$/i, '');

    // Capitalize properly
    normalized = normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return normalized;
  }

  normalizeDuration(duration) {
    if (!duration) return null;

    let normalized = duration.trim().toLowerCase();

    // Standardize duration format
    normalized = normalized.replace(/\b(yr|year|years)\b/g, 'year');
    normalized = normalized.replace(/\b(mo|month|months)\b/g, 'month');
    normalized = normalized.replace(/\b(to|-|–|—)\b/g, '-');
    normalized = normalized.replace(/\b(present|current|ongoing)\b/g, 'present');

    // Add spaces around hyphens
    normalized = normalized.replace(/-/g, ' - ');

    // Remove extra spaces
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  }

  normalizeDescription(description) {
    if (!description) return null;

    let normalized = description.trim();

    // Remove bullet points and normalize
    normalized = normalized.replace(/^[-*•]\s*/gm, '');
    normalized = normalized.replace(/\n[-*•]\s*/g, '; ');
    normalized = normalized.replace(/\n\n+/g, '; ');
    normalized = normalized.replace(/\n/g, ' ');

    // Remove extra whitespace
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  }

  normalizeResponsibilities(responsibilities) {
    if (!responsibilities || !Array.isArray(responsibilities)) return [];

    return responsibilities.map(resp => this.normalizeDescription(resp))
      .filter(resp => resp && resp.length > 10);
  }

  normalizeAchievements(achievements) {
    if (!achievements || !Array.isArray(achievements)) return [];

    return achievements.map(achievement => this.normalizeDescription(achievement))
      .filter(achievement => achievement && achievement.length > 10);
  }

  normalizeDate(date) {
    if (!date) return null;

    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return null;
      }
      return parsedDate.toISOString().split('T')[0];
    } catch (error) {
      return null;
    }
  }

  normalizeSkills(skills) {
    if (!skills || !Array.isArray(skills)) return [];

    const normalizedSkills = new Set();

    skills.forEach(skill => {
      if (!skill) return;

      let normalized = skill.trim().toLowerCase();

      // Replace skill synonyms
      Object.entries(this.skillSynonyms).forEach(([standard, synonyms]) => {
        if (synonyms.includes(normalized)) {
          normalized = standard;
        }
      });

      // Remove common prefixes/suffixes
      normalized = normalized.replace(/^(programming|development|software|web|mobile)\s+/i, '');
      normalized = normalized.replace(/\s+(programming|development|software|web|mobile)$/i, '');

      // Capitalize properly
      const finalSkill = normalized.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      if (finalSkill && finalSkill.length > 1) {
        normalizedSkills.add(finalSkill);
      }
    });

    return Array.from(normalizedSkills);
  }

  normalizeEducation(education) {
    if (!education || !Array.isArray(education)) return [];

    return education.map(edu => ({
      degree: this.normalizeDegree(edu.degree),
      institution: this.normalizeInstitution(edu.institution),
      location: this.normalizeLocation(edu.location),
      duration: this.normalizeDuration(edu.duration),
      gpa: this.normalizeGPA(edu.gpa),
      field: this.normalizeField(edu.field),
      startDate: this.normalizeDate(edu.startDate),
      endDate: this.normalizeDate(edu.endDate)
    })).filter(edu => edu.degree || edu.institution);
  }

  normalizeDegree(degree) {
    if (!degree) return null;

    let normalized = degree.trim().toLowerCase();

    // Replace education variations
    Object.entries(this.educationVariations).forEach(([standard, variations]) => {
      variations.forEach(variation => {
        normalized = normalized.replace(new RegExp(variation, 'gi'), standard);
      });
    });

    // Capitalize properly
    normalized = normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return normalized;
  }

  normalizeInstitution(institution) {
    if (!institution) return null;

    let normalized = institution.trim();

    // Remove university/college suffixes
    normalized = normalized.replace(/\b(?:university|college|institute|school)\b/gi, '');
    normalized = normalized.replace(/\b(?:of|in)\s+[a-z]+/gi, '');

    // Capitalize properly
    normalized = normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return normalized;
  }

  normalizeGPA(gpa) {
    if (!gpa) return null;

    let normalized = gpa.toString().trim();

    // Extract numeric value
    const gpaMatch = normalized.match(/([0-9]\.[0-9]|[0-9])/);
    if (gpaMatch) {
      const value = parseFloat(gpaMatch[1]);
      
      // Validate GPA range (typically 0-4 or 0-10)
      if (value >= 0 && value <= 10) {
        return value;
      }
    }

    return null;
  }

  normalizeField(field) {
    if (!field) return null;

    let normalized = field.trim().toLowerCase();

    // Common field variations
    const fieldVariations = {
      'computer science': ['cs', 'cse', 'computing'],
      'information technology': ['it', 'info tech', 'information systems'],
      'computer engineering': ['ce', 'ceng', 'computer eng'],
      'software engineering': ['se', 'software eng'],
      'business administration': ['bba', 'mba', 'business admin'],
      'electrical engineering': ['ee', 'electrical eng'],
      'mechanical engineering': ['me', 'mechanical eng']
    };

    Object.entries(fieldVariations).forEach(([standard, variations]) => {
      variations.forEach(variation => {
        normalized = normalized.replace(new RegExp(variation, 'gi'), standard);
      });
    });

    // Capitalize properly
    normalized = normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return normalized;
  }

  normalizeCertifications(certifications) {
    if (!certifications || !Array.isArray(certifications)) return [];

    return certifications.map(cert => ({
      name: this.normalizeCertificationName(cert.name),
      issuer: this.normalizeInstitution(cert.issuer),
      date: this.normalizeDate(cert.date),
      description: this.normalizeDescription(cert.description)
    })).filter(cert => cert.name);
  }

  normalizeCertificationName(name) {
    if (!name) return null;

    let normalized = name.trim();

    // Remove common prefixes
    normalized = normalized.replace(/^(certificate|certified|certification)\s+/i, '');

    // Capitalize properly
    normalized = normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return normalized;
  }

  normalizeSocialLinks(socialLinks) {
    if (!socialLinks) return {};

    const normalized = {};

    Object.entries(socialLinks).forEach(([platform, url]) => {
      if (!url) return;

      let normalizedUrl = url.trim();

      // Ensure proper URL format
      if (!normalizedUrl.startsWith('http')) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      // Normalize platform names
      let normalizedPlatform = platform.toLowerCase().trim();
      if (normalizedPlatform.includes('linkedin')) {
        normalizedPlatform = 'linkedin';
      } else if (normalizedPlatform.includes('github')) {
        normalizedPlatform = 'github';
      } else if (normalizedPlatform.includes('twitter')) {
        normalizedPlatform = 'twitter';
      } else if (normalizedPlatform.includes('website') || normalizedPlatform.includes('portfolio')) {
        normalizedPlatform = 'website';
      }

      normalized[normalizedPlatform] = normalizedUrl;
    });

    return normalized;
  }

  normalizeLanguages(languages) {
    if (!languages || !Array.isArray(languages)) return [];

    const normalizedLanguages = new Set();

    languages.forEach(language => {
      if (!language) return;

      let normalized = language.trim().toLowerCase();

      // Common language variations
      const languageVariations = {
        'english': ['eng', 'en'],
        'spanish': ['esp', 'es'],
        'french': ['fra', 'fr'],
        'german': ['deu', 'de'],
        'italian': ['ita', 'it'],
        'portuguese': ['por', 'pt'],
        'chinese': ['chi', 'zh', 'mandarin', 'cantonese'],
        'japanese': ['jpn', 'ja'],
        'korean': ['kor', 'ko'],
        'russian': ['rus', 'ru'],
        'arabic': ['ara', 'ar'],
        'hindi': ['hin', 'hi']
      };

      Object.entries(languageVariations).forEach(([standard, variations]) => {
        if (variations.includes(normalized)) {
          normalized = standard;
        }
      });

      // Capitalize properly
      const finalLanguage = normalized.charAt(0).toUpperCase() + normalized.slice(1);
      normalizedLanguages.add(finalLanguage);
    });

    return Array.from(normalizedLanguages);
  }

  normalizeProjects(projects) {
    if (!projects || !Array.isArray(projects)) return [];

    return projects.map(project => ({
      name: this.normalizeProjectName(project.name),
      description: this.normalizeDescription(project.description),
      technologies: this.normalizeSkills(project.technologies),
      duration: this.normalizeDuration(project.duration),
      url: this.normalizeUrl(project.url)
    })).filter(project => project.name);
  }

  normalizeProjectName(name) {
    if (!name) return null;

    let normalized = name.trim();

    // Remove common prefixes
    normalized = normalized.replace(/^(project|app|application|system)\s+/i, '');

    // Capitalize properly
    normalized = normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return normalized;
  }

  normalizeUrl(url) {
    if (!url) return null;

    let normalized = url.trim();

    // Ensure proper URL format
    if (!normalized.startsWith('http')) {
      normalized = `https://${normalized}`;
    }

    // Remove trailing slashes
    normalized = normalized.replace(/\/+$/, '');

    return normalized;
  }

  calculateNormalizationConfidence(parsedData, normalizedData) {
    let confidence = 0;
    const maxConfidence = 100;

    // Personal information confidence
    if (normalizedData.fullName && parsedData.fullName) confidence += 10;
    if (normalizedData.normalizedEmail && parsedData.email) confidence += 10;
    if (normalizedData.normalizedPhone && parsedData.phone) confidence += 5;
    if (normalizedData.normalizedLocation && parsedData.location) confidence += 5;

    // Professional information confidence
    if (normalizedData.normalizedDesignation && parsedData.designation) confidence += 10;

    // Experience confidence
    if (normalizedData.normalizedExperience && normalizedData.normalizedExperience.length > 0) {
      confidence += 15;
      const normalizedExpCount = normalizedData.normalizedExperience.filter(exp => exp.title && exp.company).length;
      confidence += (normalizedExpCount / normalizedData.normalizedExperience.length) * 10;
    }

    // Skills confidence
    if (normalizedData.normalizedSkills && normalizedData.normalizedSkills.length > 0) {
      confidence += 10;
      if (normalizedData.normalizedSkills.length > 5) confidence += 5;
    }

    // Education confidence
    if (normalizedData.normalizedEducation && normalizedData.normalizedEducation.length > 0) {
      confidence += 10;
      const normalizedEduCount = normalizedData.normalizedEducation.filter(edu => edu.degree && edu.institution).length;
      confidence += (normalizedEduCount / normalizedData.normalizedEducation.length) * 5;
    }

    // Additional information confidence
    if (normalizedData.normalizedCertifications && normalizedData.normalizedCertifications.length > 0) confidence += 5;
    if (normalizedData.normalizedSocialLinks && Object.keys(normalizedData.normalizedSocialLinks).length > 0) confidence += 5;

    return Math.min(confidence, maxConfidence);
  }
}

export const resumeNormalization = new ResumeNormalizationService();
export default resumeNormalization;
