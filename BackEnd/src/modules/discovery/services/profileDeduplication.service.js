import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
// import { SourceMetadata } from "../../models/sourceMetadata.model.js";
import levenshtein from 'levenshtein-distance';
class ProfileDeduplicationService {
  constructor() {
    this.emailCache = new Map();
    this.githubUrlCache = new Map();
    this.linkedinUrlCache = new Map();
    this.nameCache = new Map();
  }

  async findExistingCandidates(profiles) {
    const candidates = [];
    
    for (const profile of profiles) {
      const existingCandidate = await this.findDuplicateCandidate(profile);
      if (existingCandidate) {
        candidates.push({
          profile,
          existingCandidate,
          duplicateType: this.getDuplicateType(profile, existingCandidate)
        });
      }
    }
    
    return candidates;
  }

  async findDuplicateCandidate(profile) {
    if (profile.email) {
      const emailCandidate = await this.findByEmail(profile.email);
      if (emailCandidate) return emailCandidate;
    }

    if (profile.githubUrl) {
      const githubCandidate = await this.findByGithubUrl(profile.githubUrl);
      if (githubCandidate) return githubCandidate;
    }

    if (profile.linkedinUrl) {
      const linkedinCandidate = await this.findByLinkedinUrl(profile.linkedinUrl);
      if (linkedinCandidate) return linkedinCandidate;
    }

    if (profile.name && profile.location) {
      const nameCandidates = await this.findByNameAndLocation(profile.name, profile.location);
      if (nameCandidates.length > 0) {
        return nameCandidates[0];
      }
    }

    return null;
  }

  async findByEmail(email) {
    if (this.emailCache.has(email)) {
      return this.emailCache.get(email);
    }

    try {
      const candidate = await SourcingCandidate.findOne({ 
        email: email.toLowerCase().trim() 
      });
      
      if (candidate) {
        this.emailCache.set(email, candidate);
      }
      
      return candidate;
    } catch (error) {
      console.error("Error finding candidate by email:", error);
      return null;
    }
  }

  async findByGithubUrl(githubUrl) {
    const normalizedUrl = this.normalizeUrl(githubUrl);
    
    if (this.githubUrlCache.has(normalizedUrl)) {
      return this.githubUrlCache.get(normalizedUrl);
    }

    try {
      const candidate = await SourcingCandidate.findOne({ 
        githubUrl: normalizedUrl 
      });
      
      if (candidate) {
        this.githubUrlCache.set(normalizedUrl, candidate);
      }
      
      return candidate;
    } catch (error) {
      console.error("Error finding candidate by GitHub URL:", error);
      return null;
    }
  }

  async findByLinkedinUrl(linkedinUrl) {
    const normalizedUrl = this.normalizeUrl(linkedinUrl);
    
    if (this.linkedinUrlCache.has(normalizedUrl)) {
      return this.linkedinUrlCache.get(normalizedUrl);
    }

    try {
      const candidate = await SourcingCandidate.findOne({ 
        linkedinUrl: normalizedUrl 
      });
      
      if (candidate) {
        this.linkedinUrlCache.set(normalizedUrl, candidate);
      }
      
      return candidate;
    } catch (error) {
      console.error("Error finding candidate by LinkedIn URL:", error);
      return null;
    }
  }

  async findByNameAndLocation(name, location) {
    const normalizedName = name.toLowerCase().trim();
    const normalizedLocation = location.toLowerCase().trim();
    const cacheKey = `${normalizedName}-${normalizedLocation}`;
    
    if (this.nameCache.has(cacheKey)) {
      return this.nameCache.get(cacheKey);
    }

    try {
      const candidates = await SourcingCandidate.find({
        name: { $regex: new RegExp(normalizedName, 'i') },
        location: { $regex: new RegExp(normalizedLocation, 'i') }
      });

      this.nameCache.set(cacheKey, candidates);
      return candidates;
    } catch (error) {
      console.error("Error finding candidates by name and location:", error);
      return [];
    }
  }

  getDuplicateType(profile, existingCandidate) {
    if (profile.email && existingCandidate.email) {
      if (profile.email.toLowerCase() === existingCandidate.email.toLowerCase()) {
        return 'email';
      }
    }

    if (profile.githubUrl && existingCandidate.githubUrl) {
      if (this.normalizeUrl(profile.githubUrl) === this.normalizeUrl(existingCandidate.githubUrl)) {
        return 'github';
      }
    }

    if (profile.linkedinUrl && existingCandidate.linkedinUrl) {
      if (this.normalizeUrl(profile.linkedinUrl) === this.normalizeUrl(existingCandidate.linkedinUrl)) {
        return 'linkedin';
      }
    }

    if (profile.name && existingCandidate.name && profile.location && existingCandidate.location) {
      const nameSimilarity = this.calculateNameSimilarity(profile.name, existingCandidate.name);
      const locationSimilarity = this.calculateLocationSimilarity(profile.location, existingCandidate.location);
      
      if (nameSimilarity > 0.8 && locationSimilarity > 0.8) {
        return 'fuzzy';
      }
    }

    return 'unknown';
  }

  calculateNameSimilarity(name1, name2) {
    const normalized1 = name1.toLowerCase().trim();
    const normalized2 = name2.toLowerCase().trim();
    
    if (normalized1 === normalized2) return 1.0;
    
    const distance = new levenshtein(normalized1, normalized2).distance;
    const maxLength = Math.max(normalized1.length, normalized2.length);
    
    return 1 - (distance / maxLength);
  }

  calculateLocationSimilarity(location1, location2) {
    const normalized1 = location1.toLowerCase().trim();
    const normalized2 = location2.toLowerCase().trim();
    
    if (normalized1 === normalized2) return 1.0;
    
    const parts1 = normalized1.split(',').map(part => part.trim());
    const parts2 = normalized2.split(',').map(part => part.trim());
    
    let commonParts = 0;
    for (const part1 of parts1) {
      for (const part2 of parts2) {
        if (part1 === part2 || part1.includes(part2) || part2.includes(part1)) {
          commonParts++;
          break;
        }
      }
    }
    
    return commonParts / Math.max(parts1.length, parts2.length);
  }

  calculateSkillSimilarity(skills1, skills2) {
    if (!skills1 || !skills2) return 0;
    
    const set1 = new Set(skills1.map(skill => skill.toLowerCase()));
    const set2 = new Set(skills2.map(skill => skill.toLowerCase()));
    
    const intersection = new Set([...set1].filter(skill => set2.has(skill)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  calculateSemanticSimilarity(profile1, profile2) {
    let score = 0;
    let factors = 0;

    if (profile1.skills && profile2.skills) {
      score += this.calculateSkillSimilarity(profile1.skills, profile2.skills);
      factors++;
    }

    if (profile1.title && profile2.title) {
      const titleSimilarity = this.calculateNameSimilarity(profile1.title, profile2.title);
      score += titleSimilarity;
      factors++;
    }

    if (profile1.experience && profile2.experience && profile1.experience.length > 0 && profile2.experience.length > 0) {
      const exp1 = profile1.experience[0];
      const exp2 = profile2.experience[0];
      
      if (exp1.company && exp2.company) {
        const companySimilarity = this.calculateNameSimilarity(exp1.company, exp2.company);
        score += companySimilarity;
        factors++;
      }
    }

    return factors > 0 ? score / factors : 0;
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

  async mergeProfiles(existingCandidate, newProfile, sourceMetadata) {
    try {
      const mergedSkills = this.mergeSkills(existingCandidate.skills || [], newProfile.skills || []);
      const mergedExperience = this.mergeExperience(existingCandidate.experience || [], newProfile.experience || []);
      const mergedEducation = this.mergeEducation(existingCandidate.education || [], newProfile.education || []);
      const mergedPortfolio = this.mergePortfolio(existingCandidate.portfolio || [], newProfile.portfolio || []);

      existingCandidate.skills = mergedSkills;
      existingCandidate.experience = mergedExperience;
      existingCandidate.education = mergedEducation;
      existingCandidate.portfolio = mergedPortfolio;

      if (newProfile.phone && !existingCandidate.phone) {
        existingCandidate.phone = newProfile.phone;
      }

      if (newProfile.summary && (!existingCandidate.summary || newProfile.summary.length > existingCandidate.summary.length)) {
        existingCandidate.summary = newProfile.summary;
      }

      if (!existingCandidate.sources) {
        existingCandidate.sources = [];
      }
      existingCandidate.sources.push(sourceMetadata);

      await existingCandidate.save();
      return existingCandidate;
    } catch (error) {
      console.error("Error merging profiles:", error);
      throw error;
    }
  }

  mergeSkills(skills1, skills2) {
    const allSkills = [...skills1, ...skills2];
    const uniqueSkills = [...new Set(allSkills)];
    return uniqueSkills.sort();
  }

  mergeExperience(exp1, exp2) {
    const allExperience = [...exp1, ...exp2];
    const uniqueExperience = [];
    const seen = new Set();

    for (const exp of allExperience) {
      const key = `${exp.title}-${exp.company}-${exp.startDate}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueExperience.push(exp);
      }
    }

    return uniqueExperience.sort((a, b) => {
      const dateA = new Date(a.endDate || a.startDate);
      const dateB = new Date(b.endDate || b.startDate);
      return dateB - dateA;
    });
  }

  mergeEducation(edu1, edu2) {
    const allEducation = [...edu1, ...edu2];
    const uniqueEducation = [];
    const seen = new Set();

    for (const edu of allEducation) {
      const key = `${edu.school}-${edu.degree}-${edu.startDate}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueEducation.push(edu);
      }
    }

    return uniqueEducation.sort((a, b) => {
      const dateA = new Date(a.endDate || a.startDate);
      const dateB = new Date(b.endDate || b.startDate);
      return dateB - dateA;
    });
  }

  mergePortfolio(port1, port2) {
    const allPortfolio = [...port1, ...port2];
    const uniquePortfolio = [];
    const seen = new Set();

    for (const port of allPortfolio) {
      const key = port.url || port.title;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePortfolio.push(port);
      }
    }

    return uniquePortfolio.sort((a, b) => {
      const dateA = new Date(a.endDate || a.startDate || 0);
      const dateB = new Date(b.endDate || b.startDate || 0);
      return dateB - dateA;
    });
  }

  async deduplicateProfiles(profiles) {
    if (!profiles || !Array.isArray(profiles)) return [];

    const uniqueProfiles = [];
    const duplicates = [];

    for (const profile of profiles) {
      const existingCandidate = await this.findDuplicateCandidate(profile);
      
      if (existingCandidate) {
        duplicates.push({
          profile,
          existingCandidate,
          duplicateType: this.getDuplicateType(profile, existingCandidate)
        });
      } else {
        uniqueProfiles.push(profile);
      }
    }

    return {
      uniqueProfiles,
      duplicates,
      stats: {
        total: profiles.length,
        unique: uniqueProfiles.length,
        duplicates: duplicates.length
      }
    };
  }
}

export const profileDeduplicationService = new ProfileDeduplicationService();
export default profileDeduplicationService;
