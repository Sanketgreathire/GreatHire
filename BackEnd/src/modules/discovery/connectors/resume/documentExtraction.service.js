import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export class DocumentExtractionService {
  constructor() {
    this.supportedFormats = ['pdf', 'doc', 'docx', 'txt'];
    this.sectionPatterns = {
      contact: [
        /contact\s*information?/i,
        /personal\s*details?/i,
        /get\s*in\s*touch/i,
        /email|phone|address/i
      ],
      summary: [
        /summary/i,
        /objective/i,
        /profile/i,
        /about\s*me/i,
        /professional\s*summary/i
      ],
      experience: [
        /experience/i,
        /work\s*experience/i,
        /employment/i,
        /career\s*history/i,
        /professional\s*experience/i
      ],
      education: [
        /education/i,
        /academic/i,
        /qualifications/i,
        /degree/i,
        /university/i
      ],
      skills: [
        /skills/i,
        /technical\s*skills/i,
        /competencies/i,
        /expertise/i,
        /technologies/i
      ],
      certifications: [
        /certifications?/i,
        /certificates?/i,
        /licenses?/i,
        /accreditations?/i
      ],
      projects: [
        /projects?/i,
        /portfolio/i,
        /work\s*samples?/i
      ]
    };
  }

  async extractText(filePath, documentType) {
    try {
      let text = '';
      let metadata = {};

      switch (documentType.toLowerCase()) {
        case 'pdf':
          ({ text, ...metadata } = await this.extractFromPDF(filePath));
          break;
        case 'doc':
          ({ text, ...metadata } = await this.extractFromDOC(filePath));
          break;
        case 'docx':
          ({ text, ...metadata } = await this.extractFromDOCX(filePath));
          break;
        case 'txt':
          ({ text, ...metadata } = await this.extractFromTXT(filePath));
          break;
        default:
          throw new Error(`Unsupported document type: ${documentType}`);
      }

      const sections = this.extractSections(text);
      const contactMetadata = this.extractContactMetadata(text);
      const skillBlocks = this.extractSkillBlocks(text);
      const educationBlocks = this.extractEducationBlocks(text);
      const experienceBlocks = this.extractExperienceBlocks(text);

      return {
        text: text.trim(),
        metadata,
        sections,
        contact: contactMetadata,
        skillBlocks,
        educationBlocks,
        experienceBlocks,
        extractionConfidence: this.calculateExtractionConfidence(text, sections, contactMetadata)
      };
    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw error;
    }
  }

  async extractFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      
      return {
        text: data.text,
        metadata: {
          pages: data.numpages,
          info: data.info,
          metadata: data.metadata
        }
      };
    } catch (error) {
      console.error('Error extracting from PDF:', error);
      throw error;
    }
  }

  async extractFromDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      return {
        text: result.value,
        metadata: {
          messages: result.messages,
          warnings: result.warnings
        }
      };
    } catch (error) {
      console.error('Error extracting from DOCX:', error);
      throw error;
    }
  }

  async extractFromDOC(filePath) {
    try {
      // For .doc files, we would need a library like antiword or convert to DOCX first
      // For now, we'll try to read as text and handle gracefully
      const data = await fs.readFile(filePath, 'utf8');
      
      return {
        text: data,
        metadata: {
          format: 'doc',
          note: 'Limited support for .doc format'
        }
      };
    } catch (error) {
      console.error('Error extracting from DOC:', error);
      throw error;
    }
  }

  async extractFromTXT(filePath) {
    try {
      const text = await fs.readFile(filePath, 'utf8');
      
      return {
        text: text,
        metadata: {
          format: 'txt',
          encoding: 'utf8'
        }
      };
    } catch (error) {
      console.error('Error extracting from TXT:', error);
      throw error;
    }
  }

  extractSections(text) {
    const lines = text.split('\n');
    const sections = {};
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (this.isSectionHeader(trimmedLine)) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        
        // Start new section
        currentSection = this.getSectionType(trimmedLine);
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    });

    // Save last section
    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  isSectionHeader(line) {
    return Object.values(this.sectionPatterns).some(patterns =>
      patterns.some(pattern => pattern.test(line))
    );
  }

  getSectionType(line) {
    for (const [sectionType, patterns] of Object.entries(this.sectionPatterns)) {
      if (patterns.some(pattern => pattern.test(line))) {
        return sectionType;
      }
    }
    return 'unknown';
  }

  extractContactMetadata(text) {
    const contact = {};
    
    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailRegex);
    if (emails && emails.length > 0) {
      contact.email = emails[0];
    }

    // Extract phone numbers
    const phoneRegex = /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g;
    const phones = text.match(phoneRegex);
    if (phones && phones.length > 0) {
      contact.phone = phones[0];
    }

    // Extract LinkedIn
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/g;
    const linkedinProfiles = text.match(linkedinRegex);
    if (linkedinProfiles && linkedinProfiles.length > 0) {
      contact.linkedin = linkedinProfiles[0];
    }

    // Extract GitHub
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/g;
    const githubProfiles = text.match(githubRegex);
    if (githubProfiles && githubProfiles.length > 0) {
      contact.github = githubProfiles[0];
    }

    // Extract location (basic)
    const locationRegex = /(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
    const locations = text.match(locationRegex);
    if (locations && locations.length > 0) {
      contact.location = locations[0];
    }

    // Extract website
    const websiteRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
    const websites = text.match(websiteRegex);
    if (websites && websites.length > 0) {
      contact.website = websites[0];
    }

    return contact;
  }

  extractSkillBlocks(text) {
    const skillBlocks = [];
    const lines = text.split('\n');
    let inSkillsSection = false;
    let currentBlock = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (this.sectionPatterns.skills.some(pattern => pattern.test(trimmedLine))) {
        inSkillsSection = true;
        return;
      }
      
      if (this.isSectionHeader(trimmedLine)) {
        inSkillsSection = false;
        if (currentBlock.length > 0) {
          skillBlocks.push(currentBlock.join('\n').trim());
          currentBlock = [];
        }
        return;
      }
      
      if (inSkillsSection && trimmedLine) {
        currentBlock.push(trimmedLine);
      }
    });

    if (currentBlock.length > 0) {
      skillBlocks.push(currentBlock.join('\n').trim());
    }

    return skillBlocks;
  }

  extractEducationBlocks(text) {
    const educationBlocks = [];
    const lines = text.split('\n');
    let inEducationSection = false;
    let currentBlock = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (this.sectionPatterns.education.some(pattern => pattern.test(trimmedLine))) {
        inEducationSection = true;
        return;
      }
      
      if (this.isSectionHeader(trimmedLine)) {
        inEducationSection = false;
        if (currentBlock.length > 0) {
          educationBlocks.push(currentBlock.join('\n').trim());
          currentBlock = [];
        }
        return;
      }
      
      if (inEducationSection && trimmedLine) {
        currentBlock.push(trimmedLine);
      }
    });

    if (currentBlock.length > 0) {
      educationBlocks.push(currentBlock.join('\n').trim());
    }

    return educationBlocks;
  }

  extractExperienceBlocks(text) {
    const experienceBlocks = [];
    const lines = text.split('\n');
    let inExperienceSection = false;
    let currentBlock = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (this.sectionPatterns.experience.some(pattern => pattern.test(trimmedLine))) {
        inExperienceSection = true;
        return;
      }
      
      if (this.isSectionHeader(trimmedLine)) {
        inExperienceSection = false;
        if (currentBlock.length > 0) {
          experienceBlocks.push(currentBlock.join('\n').trim());
          currentBlock = [];
        }
        return;
      }
      
      if (inExperienceSection && trimmedLine) {
        currentBlock.push(trimmedLine);
      }
    });

    if (currentBlock.length > 0) {
      experienceBlocks.push(currentBlock.join('\n').trim());
    }

    return experienceBlocks;
  }

  calculateExtractionConfidence(text, sections, contact) {
    let confidence = 0;
    const maxConfidence = 100;

    // Text quality
    if (text && text.length > 100) confidence += 20;
    if (text && text.length > 500) confidence += 10;

    // Section extraction
    const sectionCount = Object.keys(sections).length;
    if (sectionCount >= 3) confidence += 20;
    if (sectionCount >= 5) confidence += 10;

    // Contact information
    if (contact.email) confidence += 10;
    if (contact.phone) confidence += 5;
    if (contact.linkedin) confidence += 5;
    if (contact.github) confidence += 5;

    // Structured content
    if (sections.experience) confidence += 10;
    if (sections.education) confidence += 10;
    if (sections.skills) confidence += 5;

    return Math.min(confidence, maxConfidence);
  }

  async extractDocumentMetadata(filePath, documentType) {
    try {
      const stats = await fs.stat(filePath);
      
      return {
        fileName: path.basename(filePath),
        fileSize: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        documentType
      };
    } catch (error) {
      console.error('Error extracting document metadata:', error);
      return {};
    }
  }

  validateDocument(filePath, documentType) {
    if (!this.supportedFormats.includes(documentType.toLowerCase())) {
      throw new Error(`Unsupported document type: ${documentType}`);
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    return true;
  }

  async preprocessText(text) {
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Remove common artifacts
    text = text.replace(/\f/g, ' '); // Form feed
    text = text.replace(/\x0B/g, ' '); // Vertical tab
    text = text.replace(/\x0C/g, ' '); // Form feed
    
    // Fix common OCR errors
    text = text.replace(/\bl\b/g, 'I'); // Lowercase L to I
    text = text.replace(/\bO\b/g, '0'); // Letter O to zero in certain contexts
    
    return text;
  }

  async extractStructuredData(text) {
    const structuredData = {
      personal: {},
      professional: {},
      education: [],
      experience: [],
      skills: [],
      certifications: []
    };

    // Extract personal information
    structuredData.personal = this.extractPersonalInfo(text);
    
    // Extract professional information
    structuredData.professional = this.extractProfessionalInfo(text);
    
    // Extract education
    structuredData.education = this.extractEducationInfo(text);
    
    // Extract experience
    structuredData.experience = this.extractExperienceInfo(text);
    
    // Extract skills
    structuredData.skills = this.extractSkillsInfo(text);
    
    // Extract certifications
    structuredData.certifications = this.extractCertificationsInfo(text);

    return structuredData;
  }

  extractPersonalInfo(text) {
    const personal = {};
    
    // Name extraction (basic)
    const namePatterns = [
      /^[A-Z][a-z]+\s+[A-Z][a-z]+/m,
      /^[A-Z][a-z]+\s+[A-Z]\.\s+[A-Z][a-z]+/m
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        personal.name = match[0];
        break;
      }
    }

    return personal;
  }

  extractProfessionalInfo(text) {
    const professional = {};
    
    // Title extraction
    const titlePatterns = [
      /(?:Software|Web|Full[-\s]?Stack|Front[-\s]?End|Back[-\s]?End|Mobile|DevOps|Data) (?:Developer|Engineer|Architect|Manager)/gi,
      /(?:Senior|Lead|Principal|Staff) (?:Software|Web|Developer|Engineer)/gi
    ];
    
    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match) {
        professional.title = match[0];
        break;
      }
    }

    return professional;
  }

  extractEducationInfo(text) {
    const education = [];
    const educationRegex = /(?:Bachelor|Master|PhD|M\.S|B\.S|M\.A|B\.A)[^.\n]*(?:University|College|Institute)[^.\n]*/gi;
    
    const matches = text.match(educationRegex);
    if (matches) {
      matches.forEach(match => {
        education.push({
          degree: match.trim(),
          rawText: match
        });
      });
    }

    return education;
  }

  extractExperienceInfo(text) {
    const experience = [];
    const experienceRegex = /(?:\d{1,2}\+?\s*years?|\d{4}\s*-\s*(?:\d{4}|present|current))/gi;
    
    const matches = text.match(experienceRegex);
    if (matches) {
      matches.forEach(match => {
        experience.push({
          duration: match.trim(),
          rawText: match
        });
      });
    }

    return experience;
  }

  extractSkillsInfo(text) {
    const skills = [];
    
    // Common programming languages
    const programmingLanguages = [
      'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'php', 'scala', 'elixir', 'haskell'
    ];
    
    // Common frameworks
    const frameworks = [
      'react', 'vue', 'angular', 'express', 'django', 'flask', 'rails', 'spring',
      'laravel', 'symfony', 'nest', 'next.js', 'nuxt.js', 'gatsby'
    ];
    
    // Common databases
    const databases = [
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra'
    ];
    
    // Common cloud technologies
    const cloudTech = [
      'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel', 'netlify'
    ];
    
    const allSkills = [...programmingLanguages, ...frameworks, ...databases, ...cloudTech];
    
    allSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      if (regex.test(text)) {
        skills.push(skill);
      }
    });

    return [...new Set(skills)];
  }

  extractCertificationsInfo(text) {
    const certifications = [];
    const certificationRegex = /(?:Certified|Certificate|Certification)[^.\n]*/gi;
    
    const matches = text.match(certificationRegex);
    if (matches) {
      matches.forEach(match => {
        certifications.push({
          name: match.trim(),
          rawText: match
        });
      });
    }

    return certifications;
  }
}

export const documentExtraction = new DocumentExtractionService();
export default documentExtraction;
