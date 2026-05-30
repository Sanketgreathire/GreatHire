import mongoose from "mongoose";
import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { enqueueEmbedding } from "../../../../sourcing/ai/embeddingQueue.js";
import { isAiServiceAvailable, indexCandidate } from "../../../../sourcing/ai/aiServiceClient.js";
import { getRecruiterMemory } from "../../../models/recruiterMemory.model.js";

const EXTENSION_CANDIDATE_SCHEMA = {
  fullName: { type: String, required: true, trim: true },
  headline: { type: String, trim: true },
  bio: { type: String, trim: true },
  location: { type: String, trim: true },
  currentCompany: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  socialLinks: [{
    platform: { type: String, trim: true },
    url: { type: String, trim: true }
  }],
  repositories: [{
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    language: { type: String, trim: true },
    stars: { type: String, trim: true }
  }],
  platform: { type: String, trim: true, required: true },
  profileUrl: { type: String, trim: true },
  recruiterNotes: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  sourcePage: { type: String, trim: true },
  capturedAt: { type: Date, default: Date.now },
  savedByRecruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isExtensionCapture: { type: Boolean, default: true },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: "SourcingCandidate" },
  deduplicationScore: { type: Number, default: 0 }
};

export async function captureCandidate(candidateData, recruiterId) {
  try {
    const normalizedData = normalizeCandidateData(candidateData);
    
    const duplicateCheck = await checkForDuplicates(normalizedData, recruiterId);
    
    if (duplicateCheck.isDuplicate && duplicateCheck.existingCandidate) {
      return await handleDuplicate(normalizedData, duplicateCheck.existingCandidate, recruiterId);
    }

    const candidate = await createNewCandidate(normalizedData, recruiterId);
    
    await triggerIngestionPipeline(candidate);
    
    await updateRecruiterMemory(recruiterId, normalizedData);
    
    return {
      success: true,
      candidateId: candidate._id,
      message: "Candidate captured successfully",
      isNew: true
    };
  } catch (error) {
    console.error("Error in captureCandidate:", error);
    throw new Error(`Candidate capture failed: ${error.message}`);
  }
}

function normalizeCandidateData(candidateData) {
  const normalized = {
    fullName: candidateData.fullName?.trim() || '',
    headline: candidateData.headline?.trim() || '',
    bio: candidateData.bio?.trim() || candidateData.about?.trim() || '',
    location: candidateData.location?.trim() || '',
    currentCompany: candidateData.currentCompany?.trim() || candidateData.company?.trim() || '',
    skills: normalizeSkills(candidateData.skills || []),
    socialLinks: normalizeSocialLinks(candidateData.socialLinks || []),
    repositories: normalizeRepositories(candidateData.repositories || []),
    platform: candidateData.platform?.toLowerCase() || 'unknown',
    profileUrl: candidateData.profileUrl?.trim() || '',
    recruiterNotes: candidateData.recruiterNotes?.trim() || '',
    tags: normalizeTags(candidateData.tags || []),
    sourcePage: candidateData.sourcePage?.trim() || '',
    capturedAt: candidateData.capturedAt ? new Date(candidateData.capturedAt) : new Date(),
    savedByRecruiter: candidateData.savedByRecruiter,
    isExtensionCapture: true
  };

  normalized.fullName = normalizeFullName(normalized.fullName);
  normalized.email = extractEmail(normalized);
  normalized.phone = extractPhone(normalized);
  normalized.experience = extractExperience(normalized);
  normalized.education = extractEducation(normalized);
  normalized.summary = generateSummary(normalized);

  return normalized;
}

function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];
  
  return skills
    .map(skill => skill?.trim())
    .filter(skill => skill && skill.length > 0)
    .map(skill => skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase())
    .filter((skill, index, arr) => arr.indexOf(skill) === index);
}

function normalizeSocialLinks(socialLinks) {
  if (!Array.isArray(socialLinks)) return [];
  
  return socialLinks
    .filter(link => link && link.url)
    .map(link => ({
      platform: link.platform?.toLowerCase() || extractPlatformFromUrl(link.url),
      url: link.url.trim()
    }));
}

function normalizeRepositories(repositories) {
  if (!Array.isArray(repositories)) return [];
  
  return repositories
    .filter(repo => repo && repo.name)
    .map(repo => ({
      name: repo.name.trim(),
      description: repo.description?.trim() || '',
      language: repo.language?.trim() || '',
      stars: repo.stars?.trim() || '0'
    }));
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  
  return tags
    .map(tag => tag?.trim())
    .filter(tag => tag && tag.length > 0)
    .map(tag => tag.toLowerCase())
    .filter((tag, index, arr) => arr.indexOf(tag) === index);
}

function normalizeFullName(fullName) {
  if (!fullName) return '';
  
  return fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

function extractPlatformFromUrl(url) {
  if (url.includes('github.com')) return 'github';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('instagram.com')) return 'instagram';
  return 'other';
}

function extractEmail(candidate) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  
  const text = `${candidate.bio} ${candidate.headline} ${candidate.fullName}`;
  const matches = text.match(emailRegex);
  
  return matches && matches.length > 0 ? matches[0] : null;
}

function extractPhone(candidate) {
  const phoneRegex = /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g;
  
  const text = `${candidate.bio} ${candidate.headline}`;
  const matches = text.match(phoneRegex);
  
  return matches && matches.length > 0 ? matches[0] : null;
}

function extractExperience(candidate) {
  const experienceRegex = /\b(\d+)\+?\s*(?:years?|yrs?)\b/gi;
  const text = `${candidate.bio} ${candidate.headline}`;
  const matches = text.match(experienceRegex);
  
  return matches && matches.length > 0 ? parseInt(matches[0]) : 0;
}

function extractEducation(candidate) {
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college'];
  const text = `${candidate.bio} ${candidate.headline}`;
  
  const found = educationKeywords.find(keyword => 
    text.toLowerCase().includes(keyword)
  );
  
  return found || null;
}

function generateSummary(candidate) {
  const parts = [];
  
  if (candidate.headline) parts.push(candidate.headline);
  if (candidate.currentCompany) parts.push(`at ${candidate.currentCompany}`);
  if (candidate.location) parts.push(`based in ${candidate.location}`);
  if (candidate.skills.length > 0) {
    const topSkills = candidate.skills.slice(0, 5).join(', ');
    parts.push(`Skills: ${topSkills}`);
  }
  
  return parts.join(' | ');
}

async function checkForDuplicates(candidateData, recruiterId) {
  try {
    const nameMatch = await SourcingCandidate.findOne({
      fullName: { $regex: new RegExp(`^${candidateData.fullName}$`, 'i') },
      savedByRecruiter: recruiterId
    });

    if (nameMatch) {
      return {
        isDuplicate: true,
        existingCandidate: nameMatch,
        matchType: 'name',
        confidence: 0.8
      };
    }

    if (candidateData.email) {
      const emailMatch = await SourcingCandidate.findOne({
        email: candidateData.email,
        savedByRecruiter: recruiterId
      });

      if (emailMatch) {
        return {
          isDuplicate: true,
          existingCandidate: emailMatch,
          matchType: 'email',
          confidence: 0.95
        };
      }
    }

    if (candidateData.profileUrl) {
      const urlMatch = await SourcingCandidate.findOne({
        profileUrl: candidateData.profileUrl,
        savedByRecruiter: recruiterId
      });

      if (urlMatch) {
        return {
          isDuplicate: true,
          existingCandidate: urlMatch,
          matchType: 'profileUrl',
          confidence: 0.9
        };
      }
    }

    const fuzzyMatches = await findFuzzyMatches(candidateData, recruiterId);
    
    if (fuzzyMatches.length > 0) {
      return {
        isDuplicate: true,
        existingCandidate: fuzzyMatches[0],
        matchType: 'fuzzy',
        confidence: fuzzyMatches[0].similarityScore,
        alternativeMatches: fuzzyMatches.slice(1)
      };
    }

    return {
      isDuplicate: false,
      existingCandidate: null,
      matchType: null,
      confidence: 0
    };
  } catch (error) {
    console.error("Error checking duplicates:", error);
    return {
      isDuplicate: false,
      existingCandidate: null,
      matchType: null,
      confidence: 0
    };
  }
}

async function findFuzzyMatches(candidateData, recruiterId) {
  try {
    const nameParts = candidateData.fullName.toLowerCase().split(' ');
    
    if (nameParts.length < 2) return [];
    
    const candidates = await SourcingCandidate.find({
      savedByRecruiter: recruiterId,
      fullName: { $regex: new RegExp(nameParts[0], 'i') }
    }).limit(10);

    const matches = candidates.map(candidate => {
      const similarity = calculateStringSimilarity(
        candidateData.fullName.toLowerCase(),
        candidate.fullName.toLowerCase()
      );
      
      return {
        candidate,
        similarityScore: similarity
      };
    });

    return matches
      .filter(match => match.similarityScore >= 0.7)
      .sort((a, b) => b.similarityScore - a.similarityScore);
  } catch (error) {
    console.error("Error finding fuzzy matches:", error);
    return [];
  }
}

function calculateStringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshtein(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshtein(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

async function handleDuplicate(candidateData, existingCandidate, recruiterId) {
  try {
    const updateData = {
      $set: {
        lastUpdated: new Date(),
        lastCapturedBy: recruiterId
      },
      $addToSet: {
        tags: { $each: candidateData.tags || [] },
        socialLinks: { $each: candidateData.socialLinks || [] }
      }
    };

    if (candidateData.recruiterNotes && !existingCandidate.recruiterNotes) {
      updateData.$set.recruiterNotes = candidateData.recruiterNotes;
    }

    if (candidateData.skills && candidateData.skills.length > 0) {
      updateData.$addToSet.skills = { $each: candidateData.skills };
    }

    await SourcingCandidate.findByIdAndUpdate(existingCandidate._id, updateData);

    return {
      success: true,
      candidateId: existingCandidate._id,
      message: "Existing candidate updated",
      isNew: false,
      duplicateInfo: {
        matchType: 'existing',
        originalCandidateId: existingCandidate._id,
        similarityScore: 1.0
      }
    };
  } catch (error) {
    console.error("Error handling duplicate:", error);
    throw new Error(`Duplicate handling failed: ${error.message}`);
  }
}

async function createNewCandidate(candidateData, recruiterId) {
  try {
    const candidate = new SourcingCandidate(candidateData);
    await candidate.save();
    
    return candidate;
  } catch (error) {
    console.error("Error creating new candidate:", error);
    throw new Error(`Candidate creation failed: ${error.message}`);
  }
}

async function triggerIngestionPipeline(candidate) {
  try {
    const aiAvailable = await isAiServiceAvailable();
    
    if (aiAvailable) {
      try {
        await enqueueEmbedding(candidate._id.toString(), 5);
      } catch (embeddingError) {
        console.warn("Failed to enqueue embedding:", embeddingError.message);
      }

      try {
        await indexCandidate({
          candidate_id: candidate._id.toString(),
          text: candidate.summary || candidate.bio || candidate.fullName,
          metadata: {
            skills: candidate.skills,
            location: candidate.location,
            currentCompany: candidate.currentCompany,
            experience: candidate.experience
          }
        });
      } catch (indexingError) {
        console.warn("Failed to index candidate:", indexingError.message);
      }
    }

    await syncToElasticsearch(candidate);
    
  } catch (error) {
    console.error("Error in ingestion pipeline:", error);
  }
}

async function syncToElasticsearch(candidate) {
  try {
    const esClient = await import("../../../config/elasticsearch.js");
    
    const esData = {
      id: candidate._id.toString(),
      fullName: candidate.fullName,
      headline: candidate.headline,
      bio: candidate.bio,
      location: candidate.location,
      currentCompany: candidate.currentCompany,
      skills: candidate.skills,
      experience: candidate.experience,
      savedByRecruiter: candidate.savedByRecruiter,
      isExtensionCapture: candidate.isExtensionCapture,
      capturedAt: candidate.capturedAt,
      summary: candidate.summary
    };

    await esClient.default.index({
      index: "sourcing-candidates",
      id: candidate._id.toString(),
      body: esData,
      refresh: true
    });

  } catch (error) {
    console.warn("Failed to sync to Elasticsearch:", error.message);
  }
}

async function updateRecruiterMemory(recruiterId, candidateData) {
  try {
    const memory = await getRecruiterMemory(recruiterId);
    
    if (candidateData.skills && candidateData.skills.length > 0) {
      candidateData.skills.forEach(skill => {
        memory.updateSkillWeight(skill, 0.1);
      });
    }

    if (candidateData.location) {
      memory.updateLocationWeight(candidateData.location, 0.05);
    }

    if (candidateData.currentCompany) {
      memory.recordInteraction('viewed', {
        skills: candidateData.skills,
        location: candidateData.location,
        company: candidateData.currentCompany
      });
    }

    await memory.save();
  } catch (error) {
    console.warn("Failed to update recruiter memory:", error.message);
  }
}

export async function saveCandidateNotes(candidateId, recruiterId, notesData) {
  try {
    const updateData = {
      $set: {
        lastUpdated: new Date(),
        lastUpdatedBy: recruiterId
      }
    };

    if (notesData.recruiterNotes !== undefined) {
      updateData.$set.recruiterNotes = notesData.recruiterNotes;
    }

    if (notesData.tags && notesData.tags.length > 0) {
      updateData.$addToSet = { tags: { $each: notesData.tags } };
    }

    const candidate = await SourcingCandidate.findByIdAndUpdate(
      candidateId,
      updateData,
      { new: true }
    );

    return {
      success: true,
      candidate,
      message: "Notes saved successfully"
    };
  } catch (error) {
    console.error("Error saving candidate notes:", error);
    throw new Error(`Notes saving failed: ${error.message}`);
  }
}

export async function getCandidateNotes(candidateId, recruiterId) {
  try {
    const candidate = await SourcingCandidate.findOne({
      _id: candidateId,
      savedByRecruiter: recruiterId
    });

    if (!candidate) {
      return {
        success: false,
        message: "Candidate not found"
      };
    }

    return {
      success: true,
      candidate,
      recruiterNotes: candidate.recruiterNotes,
      tags: candidate.tags
    };
  } catch (error) {
    console.error("Error getting candidate notes:", error);
    throw new Error(`Failed to get candidate: ${error.message}`);
  }
}

export async function updateCandidateNotes(candidateId, recruiterId, updateData) {
  try {
    const candidate = await SourcingCandidate.findOneAndUpdate(
      { _id: candidateId, savedByRecruiter: recruiterId },
      { 
        $set: {
          ...updateData,
          lastUpdated: new Date(),
          lastUpdatedBy: recruiterId
        }
      },
      { new: true }
    );

    if (!candidate) {
      return {
        success: false,
        message: "Candidate not found"
      };
    }

    return {
      success: true,
      candidate,
      message: "Candidate updated successfully"
    };
  } catch (error) {
    console.error("Error updating candidate notes:", error);
    throw new Error(`Candidate update failed: ${error.message}`);
  }
}

export async function deleteCandidateNotes(candidateId, recruiterId) {
  try {
    const candidate = await SourcingCandidate.findOneAndDelete({
      _id: candidateId,
      savedByRecruiter: recruiterId
    });

    if (!candidate) {
      return {
        success: false,
        message: "Candidate not found"
      };
    }

    try {
      const esClient = await import("../../../config/elasticsearch.js");
      await esClient.default.delete({
        index: "sourcing-candidates",
        id: candidateId
      });
    } catch (esError) {
      console.warn("Failed to delete from Elasticsearch:", esError.message);
    }

    try {
      const aiServiceClient = await import("../../../sourcing/ai/aiServiceClient.js");
      await aiServiceClient.deleteFromVectorStore(candidateId);
    } catch (vectorError) {
      console.warn("Failed to delete from vector store:", vectorError.message);
    }

    return {
      success: true,
      message: "Candidate deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw new Error(`Candidate deletion failed: ${error.message}`);
  }
}
