/**
 * Contact Extractor Service
 * Extracts phone numbers, emails, and other contact info from various sources
 */

export class ContactExtractorService {
  /**
   * Extract all emails from text
   */
  static extractEmails(text) {
    if (!text) return [];
    
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex) || [];
    
    // Filter out common fake/example emails
    return [...new Set(emails)].filter(email => 
      !email.includes('noreply') && 
      !email.includes('example.com') &&
      !email.includes('test.com') &&
      !email.includes('domain.com')
    );
  }

  /**
   * Extract phone numbers from text (supports multiple international formats)
   */
  static extractPhones(text) {
    if (!text) return [];
    
    const phones = [];
    
    // Indian format: +91-XXXXX-XXXXX, +91 XXXXX XXXXX, 91XXXXXXXXXX, XXXXXXXXXX
    const indianRegex = /(?:\+91|91)?[\s-]?[6-9]\d{9}/g;
    const indianMatches = text.match(indianRegex) || [];
    phones.push(...indianMatches.map(p => this.normalizePhone(p, 'IN')));
    
    // International format: +XX-XXX-XXX-XXXX
    const intlRegex = /\+\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}/g;
    const intlMatches = text.match(intlRegex) || [];
    phones.push(...intlMatches.map(p => this.normalizePhone(p)));
    
    // US format: (XXX) XXX-XXXX
    const usRegex = /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
    const usMatches = text.match(usRegex) || [];
    phones.push(...usMatches.map(p => this.normalizePhone(p, 'US')));
    
    // UK format: +44 XXXX XXXXXX
    const ukRegex = /(?:\+44|44)?[\s-]?\d{4}[\s-]?\d{6}/g;
    const ukMatches = text.match(ukRegex) || [];
    phones.push(...ukMatches.map(p => this.normalizePhone(p, 'UK')));
    
    // Filter valid phone numbers (10-15 digits)
    return [...new Set(phones)].filter(p => {
      const digits = p.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15;
    });
  }

  /**
   * Normalize phone number format
   */
  static normalizePhone(phone, country = null) {
    // Remove all non-digit characters except +
    let normalized = phone.replace(/[\s()-]/g, '');
    
    // Add country code if missing
    if (country === 'IN' && !normalized.startsWith('+')) {
      if (normalized.startsWith('91')) {
        normalized = '+' + normalized;
      } else if (normalized.length === 10) {
        normalized = '+91' + normalized;
      }
    } else if (country === 'US' && !normalized.startsWith('+')) {
      if (normalized.length === 10) {
        normalized = '+1' + normalized;
      }
    } else if (country === 'UK' && !normalized.startsWith('+')) {
      if (normalized.startsWith('44')) {
        normalized = '+' + normalized;
      }
    }
    
    return normalized;
  }

  /**
   * Extract social media links
   */
  static extractSocialLinks(text) {
    if (!text) return {};
    
    const links = {
      github: null,
      linkedin: null,
      twitter: null,
      portfolio: null,
    };
    
    // GitHub
    const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+)/i);
    if (githubMatch) links.github = `https://github.com/${githubMatch[1]}`;
    
    // LinkedIn
    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
    if (linkedinMatch) links.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
    
    // Twitter
    const twitterMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/i);
    if (twitterMatch) links.twitter = `https://twitter.com/${twitterMatch[1]}`;
    
    // Portfolio (common patterns)
    const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|dev|io|me|tech|in|co))/i);
    if (portfolioMatch && !portfolioMatch[0].includes('github') && !portfolioMatch[0].includes('linkedin')) {
      links.portfolio = portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`;
    }
    
    return links;
  }

  /**
   * Extract location information
   */
  static extractLocation(text) {
    if (!text) return null;
    
    // Common location patterns
    const locationPatterns = [
      /(?:based in|located in|from)\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/i,
      /([A-Z][a-zA-Z]+,\s*[A-Z][a-zA-Z\s]+)/,
      /📍\s*([A-Z][a-zA-Z\s,]+)/,
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    
    return null;
  }

  /**
   * Generate comprehensive profile overview
   */
  static generateProfileOverview(data) {
    const parts = [];
    
    // Name and location
    if (data.fullName) {
      const location = data.location ? ` based in ${data.location}` : '';
      parts.push(`${data.fullName} is a professional${location}.`);
    }
    
    // Current role
    if (data.designation && data.company) {
      parts.push(`Currently working as ${data.designation} at ${data.company}.`);
    } else if (data.designation) {
      parts.push(`Works as ${data.designation}.`);
    } else if (data.company) {
      parts.push(`Currently at ${data.company}.`);
    }
    
    // Experience
    if (data.totalExperience > 0) {
      parts.push(`Has ${data.totalExperience}+ years of professional experience.`);
    }
    
    // Skills
    if (data.skills && data.skills.length > 0) {
      const topSkills = data.skills.slice(0, 5).join(', ');
      parts.push(`Skilled in ${topSkills}.`);
    }
    
    // Education
    if (data.education && data.education.length > 0) {
      const edu = data.education[0];
      if (edu.degree && edu.institution) {
        parts.push(`Holds ${edu.degree} from ${edu.institution}.`);
      }
    }
    
    // Bio/Summary
    if (data.bio) {
      parts.push(data.bio);
    }
    
    // Contact availability
    const hasContact = (data.emails && data.emails.length > 0) || 
                       (data.phones && data.phones.length > 0);
    if (hasContact) {
      parts.push('Contact information available.');
    }
    
    return parts.join(' ');
  }

  /**
   * Enrich profile data with extracted information
   */
  static enrichProfile(profile, additionalText = '') {
    const allText = `${profile.bio || ''} ${additionalText}`.trim();
    
    // Extract additional emails
    const extractedEmails = this.extractEmails(allText);
    profile.emails = [...new Set([...(profile.emails || []), ...extractedEmails])];
    
    // Extract phone numbers
    const extractedPhones = this.extractPhones(allText);
    profile.phones = [...new Set([...(profile.phones || []), ...extractedPhones])];
    
    // Extract social links
    const socialLinks = this.extractSocialLinks(allText);
    if (socialLinks.github && !profile.githubUrl) profile.githubUrl = socialLinks.github;
    if (socialLinks.linkedin && !profile.linkedinUrl) profile.linkedinUrl = socialLinks.linkedin;
    if (socialLinks.portfolio && !profile.portfolioUrl) profile.portfolioUrl = socialLinks.portfolio;
    
    // Extract location if missing
    if (!profile.location) {
      profile.location = this.extractLocation(allText) || '';
    }
    
    // Generate overview if missing
    if (!profile.summary || profile.summary === profile.bio) {
      profile.summary = this.generateProfileOverview(profile);
    }
    
    return profile;
  }
}
