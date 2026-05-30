export class ResumeParserService {
  constructor() {
    this.namePatterns = [
      /^[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/,
      /^[A-Z]\.\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/,
      /^[A-Z][a-z]+\s+[A-Z]\.\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/
    ];
    
    this.emailPatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi
    ];
    
    this.phonePatterns = [
      /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
      /\b(?:\+?44[-.\s]?)?\(?([0-9]{4})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g
    ];
    
    this.skillKeywords = {
      programming: [
        'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'ruby', 'go', 'rust',
        'swift', 'kotlin', 'php', 'scala', 'elixir', 'haskell', 'r', 'matlab'
      ],
      frontend: [
        'react', 'vue', 'angular', 'svelte', 'html', 'css', 'sass', 'less', 'tailwind',
        'bootstrap', 'material-ui', 'ant design', 'chakra ui', 'next.js', 'nuxt.js'
      ],
      backend: [
        'node.js', 'express', 'django', 'flask', 'rails', 'spring', 'laravel', 'symfony',
        'nest', 'fastapi', 'koa', 'hapi', 'loopback'
      ],
      databases: [
        'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra',
        'dynamodb', 'neo4j', 'sqlite', 'oracle', 'sql server'
      ],
      cloud: [
        'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel', 'netlify',
        'digitalocean', 'linode', 'vultr', 'cloudflare'
      ],
      devops: [
        'docker', 'kubernetes', 'jenkins', 'github actions', 'gitlab ci', 'travis ci',
        'circleci', 'terraform', 'ansible', 'puppet', 'chef', 'vagrant'
      ],
      mobile: [
        'react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin',
        'ionic', 'cordova', 'unity'
      ],
      testing: [
        'jest', 'mocha', 'jasmine', 'karma', 'cypress', 'playwright', 'selenium',
        'testing library', 'pytest', 'junit', 'rspec'
      ]
    };
    
    this.designationPatterns = [
      /(?:Software|Web|Full[-\s]?Stack|Front[-\s]?End|Back[-\s]?End|Mobile|DevOps|Data|Cloud) (?:Developer|Engineer|Architect|Manager|Consultant|Specialist)/gi,
      /(?:Senior|Lead|Principal|Staff|Junior|Mid[-\s]?Level) (?:Software|Web|Developer|Engineer)/gi,
      /(?:CTO|VP|Director|Manager|Lead) (?:of )?(?:Engineering|Technology|IT)/gi
    ];
    
    this.educationPatterns = [
      /(?:Bachelor|Master|PhD|M\.S|B\.S|M\.A|B\.A|M\.Tech|B\.Tech|M\.Sc|B\.Sc)[^.\n]*(?:University|College|Institute)[^.\n]*/gi,
      /(?:High School|Secondary School|Diploma|Certificate)[^.\n]*/gi
    ];
    
    this.certificationPatterns = [
      /(?:Certified|Certificate|Certification)[^.\n]*/gi,
      /(?:AWS|Azure|GCP|Google|Microsoft|Oracle)[^.\n]*(?:Certified|Certification)[^.\n]*/gi
    ];
  }

  async parseResume(text, extractedData = {}) {
    try {
      const parsedData = {
        fullName: this.extractFullName(text, extractedData),
        designation: this.extractDesignation(text, extractedData),
        email: this.extractEmail(text, extractedData),
        phone: this.extractPhone(text, extractedData),
        location: this.extractLocation(text, extractedData),
        summary: this.extractSummary(text, extractedData),
        experience: this.extractExperience(text, extractedData),
        skills: this.extractSkills(text, extractedData),
        education: this.extractEducation(text, extractedData),
        certifications: this.extractCertifications(text, extractedData),
        socialLinks: this.extractSocialLinks(text, extractedData),
        languages: this.extractLanguages(text, extractedData),
        projects: this.extractProjects(text, extractedData),
        parsingConfidence: 0
      };

      // Calculate parsing confidence
      parsedData.parsingConfidence = this.calculateParsingConfidence(parsedData, extractedData);

      return parsedData;
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw error;
    }
  }

  extractFullName(text, extractedData) {
    // First try to extract from contact metadata
    if (extractedData.contact?.name) {
      return extractedData.contact.name;
    }

    // Try to find name patterns in text
    const lines = text.split('\n');
    
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const line = lines[i].trim();
      
      if (line.length > 3 && line.length < 50) {
        for (const pattern of this.namePatterns) {
          if (pattern.test(line)) {
            return line;
          }
        }
      }
    }

    // Try to extract from email
    const email = this.extractEmail(text, extractedData);
    if (email) {
      const emailName = email.split('@')[0];
      const nameParts = emailName.split(/[._-]/);
      if (nameParts.length >= 2) {
        return nameParts.map(part => 
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ).join(' ');
      }
    }

    return null;
  }

  extractDesignation(text, extractedData) {
    // First try to extract from professional metadata
    if (extractedData.professional?.title) {
      return extractedData.professional.title;
    }

    // Search for designation patterns
    for (const pattern of this.designationPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        return matches[0].trim();
      }
    }

    return null;
  }

  extractEmail(text, extractedData) {
    // First try to extract from contact metadata
    if (extractedData.contact?.email) {
      return extractedData.contact.email;
    }

    // Search for email patterns
    for (const pattern of this.emailPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        return matches[0].toLowerCase();
      }
    }

    return null;
  }

  extractPhone(text, extractedData) {
    // First try to extract from contact metadata
    if (extractedData.contact?.phone) {
      return extractedData.contact.phone;
    }

    // Search for phone patterns
    for (const pattern of this.phonePatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        return matches[0];
      }
    }

    return null;
  }

  extractLocation(text, extractedData) {
    // First try to extract from contact metadata
    if (extractedData.contact?.location) {
      return extractedData.contact.location;
    }

    // Try to extract location patterns
    const locationPatterns = [
      /(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      /(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
    ];

    for (const pattern of locationPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        return matches[0].trim();
      }
    }

    return null;
  }

  extractSummary(text, extractedData) {
    // Try to extract from summary section
    if (extractedData.sections?.summary) {
      return extractedData.sections.summary.trim();
    }

    // Look for summary section in text
    const summaryPatterns = [
      /(?:summary|objective|profile|about\s*me|professional\s*summary)[^.\n]*[:\n]([^.\n]*(?:\n[^.\n]*)*?)(?=\n\s*\n|\n[A-Z]|\n[0-9]|\n\w+\s*\w)/gi,
      /(?:summary|objective|profile|about\s*me|professional\s*summary)[^.\n]*[:\n]([^.\n]*)/gi
    ];

    for (const pattern of summaryPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        return matches[1] ? matches[1].trim() : matches[0].trim();
      }
    }

    return null;
  }

  extractExperience(text, extractedData) {
    const experiences = [];

    // Try to extract from experience section
    if (extractedData.experienceBlocks && extractedData.experienceBlocks.length > 0) {
      extractedData.experienceBlocks.forEach(block => {
        const experience = this.parseExperienceBlock(block);
        if (experience) {
          experiences.push(experience);
        }
      });
    }

    // If no structured blocks, try to extract from text
    if (experiences.length === 0) {
      const experienceText = this.extractSectionText(text, 'experience');
      if (experienceText) {
        const blockExperiences = this.parseExperienceFromText(experienceText);
        experiences.push(...blockExperiences);
      }
    }

    return experiences;
  }

  parseExperienceBlock(block) {
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    const experience = {
      title: '',
      company: '',
      location: '',
      duration: '',
      description: '',
      responsibilities: [],
      achievements: []
    };

    // Try to extract title and company from first line
    const firstLine = lines[0];
    const titleCompanyMatch = firstLine.match(/^(.+?)\s+(?:at|@)\s+(.+?)\s*(?:\(|,|$)/i);
    if (titleCompanyMatch) {
      experience.title = titleCompanyMatch[1].trim();
      experience.company = titleCompanyMatch[2].trim();
    } else {
      experience.title = firstLine.trim();
    }

    // Extract duration
    const durationPatterns = [
      /(\d{1,2}\s*(?:years?|yrs?)\s*(?:\d{1,2}\s*(?:months?|mos?)?)?)\s*(?:to|-|–)\s*(\d{1,2}\s*(?:years?|yrs?)\s*(?:\d{1,2}\s*(?:months?|mos?)?)?|present|current)/i,
      /(\d{4})\s*(?:to|-|–)\s*(\d{4}|present|current)/i,
      /(\d{1,2}\/\d{4})\s*(?:to|-|–)\s*(\d{1,2}\/\d{4}|present|current)/i
    ];

    const fullText = lines.join(' ');
    for (const pattern of durationPatterns) {
      const match = fullText.match(pattern);
      if (match) {
        experience.duration = match[0].trim();
        break;
      }
    }

    // Extract description
    experience.description = lines.slice(1).join('\n').trim();

    return experience;
  }

  parseExperienceFromText(text) {
    const experiences = [];
    const lines = text.split('\n').filter(line => line.trim());
    let currentExperience = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this is a new experience entry
      if (this.isExperienceHeader(trimmedLine)) {
        if (currentExperience) {
          experiences.push(currentExperience);
        }
        currentExperience = this.parseExperienceBlock(trimmedLine);
      } else if (currentExperience) {
        currentExperience.description += '\n' + trimmedLine;
      }
    });

    if (currentExperience) {
      experiences.push(currentExperience);
    }

    return experiences;
  }

  isExperienceHeader(line) {
    const experiencePatterns = [
      /(?:software|web|full[-\s]?stack|front[-\s]?end|back[-\s]?end|mobile|devops|data) (?:developer|engineer|architect)/i,
      /(?:senior|lead|principal|staff|junior|mid[-\s]?level) (?:software|web|developer|engineer)/i,
      /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|LLC|Corp|Ltd|Company)/
    ];

    return experiencePatterns.some(pattern => pattern.test(line));
  }

  extractSkills(text, extractedData) {
    const skills = new Set();

    // Try to extract from skill blocks
    if (extractedData.skillBlocks && extractedData.skillBlocks.length > 0) {
      extractedData.skillBlocks.forEach(block => {
        const blockSkills = this.parseSkillsFromText(block);
        blockSkills.forEach(skill => skills.add(skill));
      });
    }

    // Extract skills from entire text
    const allText = extractedData.skillBlocks?.join(' ') || text;
    const textSkills = this.parseSkillsFromText(allText);
    textSkills.forEach(skill => skills.add(skill));

    return Array.from(skills);
  }

  parseSkillsFromText(text) {
    const skills = [];
    const textLower = text.toLowerCase();

    Object.entries(this.skillKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (textLower.includes(keyword.toLowerCase())) {
          skills.push(keyword);
        }
      });
    });

    // Extract individual skills using patterns
    const skillPatterns = [
      /\b(?:react|vue|angular|node\.js|python|java|javascript|typescript|aws|docker|kubernetes)\b/gi,
      /\b(?:mongodb|postgresql|mysql|redis|elasticsearch)\b/gi,
      /\b(?:git|github|gitlab|bitbucket)\b/gi
    ];

    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => skills.push(match.toLowerCase()));
      }
    });

    return [...new Set(skills)];
  }

  extractEducation(text, extractedData) {
    const education = [];

    // Try to extract from education blocks
    if (extractedData.educationBlocks && extractedData.educationBlocks.length > 0) {
      extractedData.educationBlocks.forEach(block => {
        const edu = this.parseEducationBlock(block);
        if (edu) {
          education.push(edu);
        }
      });
    }

    // If no structured blocks, try to extract from text
    if (education.length === 0) {
      const educationText = this.extractSectionText(text, 'education');
      if (educationText) {
        const blockEducation = this.parseEducationFromText(educationText);
        education.push(...blockEducation);
      }
    }

    return education;
  }

  parseEducationBlock(block) {
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    const education = {
      degree: '',
      institution: '',
      location: '',
      duration: '',
      gpa: '',
      field: ''
    };

    const fullText = lines.join(' ');

    // Extract degree using patterns
    for (const pattern of this.educationPatterns) {
      const match = fullText.match(pattern);
      if (match) {
        education.degree = match[0].trim();
        break;
      }
    }

    // Extract institution
    const institutionPatterns = [
      /(?:University|College|Institute|School)[^.\n]*/gi,
      /(?:of|in)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/gi
    ];

    for (const pattern of institutionPatterns) {
      const match = fullText.match(pattern);
      if (match) {
        education.institution = match[0].trim();
        break;
      }
    }

    // Extract GPA
    const gpaMatch = fullText.match(/(?:GPA|Grade)[^.\n]*([0-9]\.[0-9]|[0-9])/i);
    if (gpaMatch) {
      education.gpa = gpaMatch[1];
    }

    return education;
  }

  parseEducationFromText(text) {
    const education = [];
    const matches = text.match(this.educationPatterns[0]);

    if (matches) {
      matches.forEach(match => {
        const edu = this.parseEducationBlock(match);
        if (edu) {
          education.push(edu);
        }
      });
    }

    return education;
  }

  extractCertifications(text, extractedData) {
    const certifications = [];

    // Try to extract from structured data
    if (extractedData.structuredData?.certifications) {
      extractedData.structuredData.certifications.forEach(cert => {
        certifications.push({
          name: cert.name,
          issuer: cert.issuer || '',
          date: cert.date || '',
          description: cert.description || ''
        });
      });
    }

    // Extract from text using patterns
    const certMatches = text.match(this.certificationPatterns[0]);
    if (certMatches) {
      certMatches.forEach(match => {
        certifications.push({
          name: match.trim(),
          issuer: '',
          date: '',
          description: ''
        });
      });
    }

    return certifications;
  }

  extractSocialLinks(text, extractedData) {
    const socialLinks = {};

    // First try to extract from contact metadata
    if (extractedData.contact) {
      socialLinks.linkedin = extractedData.contact.linkedin;
      socialLinks.github = extractedData.contact.github;
      socialLinks.website = extractedData.contact.website;
    }

    // Extract from text
    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/);
    if (linkedinMatch && !socialLinks.linkedin) {
      socialLinks.linkedin = linkedinMatch[0];
    }

    const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/);
    if (githubMatch && !socialLinks.github) {
      socialLinks.github = githubMatch[0];
    }

    const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/);
    if (websiteMatch && !socialLinks.website) {
      socialLinks.website = websiteMatch[0];
    }

    return socialLinks;
  }

  extractLanguages(text, extractedData) {
    const languages = [];

    // Common languages
    const languagePatterns = [
      /\b(?:English|Spanish|French|German|Italian|Portuguese|Chinese|Japanese|Korean|Russian|Arabic|Hindi)\b/gi,
      /\b(?:Fluent|Proficient|Native|Basic|Intermediate)\s+(?:in\s+)?(?:English|Spanish|French|German|Italian|Portuguese|Chinese|Japanese|Korean|Russian|Arabic|Hindi)\b/gi
    ];

    const textLower = text.toLowerCase();
    languagePatterns.forEach(pattern => {
      const matches = textLower.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const language = match.replace(/(?:fluent|proficient|native|basic|intermediate)\s+(?:in\s+)?/i, '').trim();
          if (language && !languages.includes(language)) {
            languages.push(language.charAt(0).toUpperCase() + language.slice(1));
          }
        });
      }
    });

    return languages;
  }

  extractProjects(text, extractedData) {
    const projects = [];

    // Try to extract from structured data
    if (extractedData.structuredData?.projects) {
      extractedData.structuredData.projects.forEach(project => {
        projects.push({
          name: project.name,
          description: project.description,
          technologies: project.technologies || [],
          duration: project.duration || '',
          url: project.url || ''
        });
      });
    }

    // Extract from text if no structured data
    if (projects.length === 0) {
      const projectText = this.extractSectionText(text, 'projects');
      if (projectText) {
        const textProjects = this.parseProjectsFromText(projectText);
        projects.push(...textProjects);
      }
    }

    return projects;
  }

  parseProjectsFromText(text) {
    const projects = [];
    const lines = text.split('\n').filter(line => line.trim());
    let currentProject = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this is a new project entry
      if (this.isProjectHeader(trimmedLine)) {
        if (currentProject) {
          projects.push(currentProject);
        }
        currentProject = {
          name: trimmedLine,
          description: '',
          technologies: [],
          duration: '',
          url: ''
        };
      } else if (currentProject) {
        currentProject.description += '\n' + trimmedLine;
      }
    });

    if (currentProject) {
      projects.push(currentProject);
    }

    return projects;
  }

  isProjectHeader(line) {
    const projectPatterns = [
      /^project\s*[:\s]/i,
      /^[A-Z][a-zA-Z0-9\s]+(?:Project|App|System|Platform)/i
    ];

    return projectPatterns.some(pattern => pattern.test(line));
  }

  extractSectionText(text, sectionType) {
    const sectionPatterns = {
      experience: [
        /(?:experience|work\s*experience|employment|career\s*history)[^.\n]*[:\n]([^.\n]*(?:\n[^.\n]*)*?)(?=\n\s*\n|\n[A-Z]|\n[0-9]|\n\w+\s*\w)/gi,
        /(?:experience|work\s*experience|employment|career\s*history)[^.\n]*[:\n]([^.\n]*)/gi
      ],
      education: [
        /(?:education|academic|qualifications|degree|university)[^.\n]*[:\n]([^.\n]*(?:\n[^.\n]*)*?)(?=\n\s*\n|\n[A-Z]|\n[0-9]|\n\w+\s*\w)/gi,
        /(?:education|academic|qualifications|degree|university)[^.\n]*[:\n]([^.\n]*)/gi
      ],
      projects: [
        /(?:projects|portfolio|work\s*samples)[^.\n]*[:\n]([^.\n]*(?:\n[^.\n]*)*?)(?=\n\s*\n|\n[A-Z]|\n[0-9]|\n\w+\s*\w)/gi,
        /(?:projects|portfolio|work\s*samples)[^.\n]*[:\n]([^.\n]*)/gi
      ]
    };

    const patterns = sectionPatterns[sectionType];
    if (!patterns) return null;

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] ? match[1].trim() : match[0].trim();
      }
    }

    return null;
  }

  calculateParsingConfidence(parsedData, extractedData) {
    let confidence = 0;
    const maxConfidence = 100;

    // Personal information confidence
    if (parsedData.fullName) confidence += 15;
    if (parsedData.email) confidence += 10;
    if (parsedData.phone) confidence += 5;
    if (parsedData.location) confidence += 5;

    // Professional information confidence
    if (parsedData.designation) confidence += 10;
    if (parsedData.summary) confidence += 10;

    // Experience confidence
    if (parsedData.experience && parsedData.experience.length > 0) {
      confidence += 15;
      if (parsedData.experience.some(exp => exp.title && exp.company)) {
        confidence += 5;
      }
    }

    // Skills confidence
    if (parsedData.skills && parsedData.skills.length > 0) {
      confidence += 10;
      if (parsedData.skills.length > 5) confidence += 5;
    }

    // Education confidence
    if (parsedData.education && parsedData.education.length > 0) {
      confidence += 10;
      if (parsedData.education.some(edu => edu.degree && edu.institution)) {
        confidence += 5;
      }
    }

    // Additional information confidence
    if (parsedData.certifications && parsedData.certifications.length > 0) confidence += 5;
    if (parsedData.socialLinks && Object.keys(parsedData.socialLinks).length > 0) confidence += 5;

    // Structured extraction bonus
    if (extractedData.sections && Object.keys(extractedData.sections).length > 3) confidence += 5;

    return Math.min(confidence, maxConfidence);
  }
}

export const resumeParser = new ResumeParserService();
export default resumeParser;
