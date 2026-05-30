import { getRecruiterMemory } from "../../../models/recruiterMemory.model.js";
import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { personalizeOutreach } from "./outreachPersonalization.service.js";
import { saveOutreachRecord } from "./outreachHistory.service.js";
import { enqueueBulkOutreach } from "./outreachQueue.service.js";
import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

const OUTREACH_TONES = {
  professional: {
    style: "formal, respectful, and business-oriented",
    greeting: "Dear",
    closing: "Best regards",
    characteristics: ["formal language", "professional tone", "respectful", "business-focused"]
  },
  startup_casual: {
    style: "friendly, casual, and energetic",
    greeting: "Hi",
    closing: "Cheers",
    characteristics: ["casual language", "friendly tone", "energetic", "startup culture"]
  },
  aggressive_hiring: {
    style: "direct, urgent, and compelling",
    greeting: "Hello",
    closing: "Looking forward to hearing from you",
    characteristics: ["direct approach", "urgency", "compelling", "action-oriented"]
  },
  executive_hiring: {
    style: "sophisticated, respectful, and exclusive",
    greeting: "Dear",
    closing: "Sincerely",
    characteristics: ["sophisticated language", "exclusive tone", "respectful", "executive-level"]
  }
};

const OUTREACH_TEMPLATES = {
  email: {
    subject: "Exciting opportunity at {{company}} for {{position}}",
    structure: "{{greeting}} {{candidateName}},\n\n{{personalizedIntro}}\n\n{{jobDescription}}\n\n{{callToAction}}\n\n{{closing}},\n{{recruiterName}}"
  },
  linkedin: {
    subject: "Opportunity that aligns with your {{keySkill}} expertise",
    structure: "Hi {{candidateName}} - {{personalizedIntro}} {{jobDescription}} {{callToAction}}"
  },
  followup: {
    subject: "Following up on {{position}} opportunity",
    structure: "{{greeting}} {{candidateName}},\n\n{{followupContext}}\n\n{{additionalInfo}}\n\n{{callToAction}}\n\n{{closing}},\n{{recruiterName}}"
  },
  cold: {
    subject: "{{position}} opportunity at {{company}}",
    structure: "{{greeting}} {{candidateName}},\n\n{{coldIntro}}\n\n{{valueProposition}}\n\n{{callToAction}}\n\n{{closing}},\n{{recruiterName}}"
  }
};

export async function generateOutreach(options) {
  try {
    const {
      candidateId,
      jobId,
      recruiterId,
      outreachType,
      tone,
      customInstructions,
      templateId
    } = options;

    const candidate = await SourcingCandidate.findById(candidateId).lean();
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const recruiterMemory = await getRecruiterMemory(recruiterId);
    const candidateContext = await buildCandidateContext(candidate, recruiterMemory);
    const jobContext = jobId ? await buildJobContext(jobId) : null;
    const recruiterContext = await buildRecruiterContext(recruiterId, recruiterMemory);

    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);

    let generatedContent;
    
    if (aiAvailable) {
      generatedContent = await generateWithAI({
        candidateContext,
        jobContext,
        recruiterContext,
        outreachType,
        tone,
        customInstructions,
        templateId
      });
    } else {
      generatedContent = await generateWithTemplate({
        candidateContext,
        jobContext,
        recruiterContext,
        outreachType,
        tone,
        customInstructions,
        templateId
      });
    }

    const personalizedContent = await personalizeOutreach(generatedContent, candidateContext, tone);

    const outreachRecord = await saveOutreachRecord({
      recruiterId,
      candidateId,
      jobId,
      outreachType,
      tone,
      generatedContent: personalizedContent,
      templateId,
      customInstructions,
      aiAvailable
    });

    return {
      success: true,
      outreachId: outreachRecord._id,
      message: personalizedContent.message,
      subject: personalizedContent.subject,
      personalizationScore: personalizedContent.personalizationScore,
      matchedSkills: personalizedContent.matchedSkills,
      candidateInsights: personalizedContent.candidateInsights,
      aiGenerated: aiAvailable,
      tone,
      outreachType
    };
  } catch (error) {
    console.error("Error in generateOutreach:", error);
    throw new Error(`Outreach generation failed: ${error.message}`);
  }
}

async function buildCandidateContext(candidate, recruiterMemory) {
  const skills = candidate.skills || [];
  const experience = candidate.totalExperience || 0;
  const currentCompany = candidate.currentCompany || '';
  const location = candidate.location || '';
  const bio = candidate.bio || candidate.summary || '';
  const repositories = candidate.repositories || [];
  const socialLinks = candidate.socialLinks || [];

  const topSkills = skills.slice(0, 10);
  const githubSkills = extractGitHubSkills(repositories);
  const allSkills = [...new Set([...skills, ...githubSkills])];

  const recentExperience = extractRecentExperience(candidate);
  const projects = extractProjects(repositories);
  const education = extractEducation(candidate);

  const recruiterPreferences = recruiterMemory.preferences || {};
  const preferredSkills = recruiterPreferences.skills || [];
  const matchedSkills = allSkills.filter(skill => 
    preferredSkills.some(pref => skill.toLowerCase().includes(pref.toLowerCase()) || 
                               pref.toLowerCase().includes(skill.toLowerCase()))
  );

  return {
    fullName: candidate.fullName,
    headline: candidate.headline || '',
    bio,
    location,
    currentCompany,
    experience,
    skills: allSkills,
    topSkills,
    githubSkills,
    matchedSkills,
    recentExperience,
    projects,
    education,
    socialLinks,
    profileUrl: candidate.profileUrl || '',
    email: candidate.email || '',
    phone: candidate.phone || '',
    recruiterNotes: candidate.recruiterNotes || '',
    tags: candidate.tags || []
  };
}

function extractGitHubSkills(repositories) {
  const skills = new Set();
  
  repositories.forEach(repo => {
    if (repo.language) {
      skills.add(repo.language);
    }
    
    if (repo.name) {
      const techKeywords = ['react', 'vue', 'angular', 'node', 'python', 'java', 'javascript', 'typescript', 'docker', 'kubernetes', 'aws', 'azure', 'gcp'];
      techKeywords.forEach(tech => {
        if (repo.name.toLowerCase().includes(tech)) {
          skills.add(tech);
        }
      });
    }
  });
  
  return Array.from(skills);
}

function extractRecentExperience(candidate) {
  if (candidate.currentCompany) {
    return {
      company: candidate.currentCompany,
      duration: `${candidate.experience || 0}+ years`,
      position: candidate.headline || 'Professional'
    };
  }
  return null;
}

function extractProjects(repositories) {
  return repositories
    .filter(repo => repo.name && repo.description)
    .slice(0, 5)
    .map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stars || '0'
    }));
}

function extractEducation(candidate) {
  const bio = candidate.bio || '';
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college'];
  
  for (const keyword of educationKeywords) {
    if (bio.toLowerCase().includes(keyword)) {
      return keyword;
    }
  }
  
  return null;
}

async function buildJobContext(jobId) {
  try {
    const Job = await import("../../../models/job.model.js");
    const job = await Job.default.findById(jobId).lean();
    
    if (!job) return null;
    
    return {
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements || [],
      skills: job.skills || [],
      location: job.location || '',
      company: job.company || '',
      type: job.type || '',
      salary: job.salary || '',
      remote: job.remote || false
    };
  } catch (error) {
    console.warn("Error building job context:", error.message);
    return null;
  }
}

async function buildRecruiterContext(recruiterId, recruiterMemory) {
  const preferences = recruiterMemory.preferences || {};
  const settings = recruiterMemory.settings || {};
  
  return {
    recruiterId,
    name: recruiterMemory.recruiterName || 'Recruiter',
    company: preferences.company || '',
    industry: preferences.industry || '',
    location: preferences.location || '',
    preferredSkills: preferences.skills || [],
    tone: preferences.tone || 'professional',
    communicationStyle: settings.communicationStyle || 'professional',
    signature: settings.emailSignature || ''
  };
}

async function generateWithAI(context) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
    
    const {
      candidateContext,
      jobContext,
      recruiterContext,
      outreachType,
      tone,
      customInstructions,
      templateId
    } = context;

    const toneConfig = OUTREACH_TONES[tone];
    const templateConfig = OUTREACH_TEMPLATES[outreachType];

    const prompt = buildAIPrompt({
      candidateContext,
      jobContext,
      recruiterContext,
      outreachType,
      toneConfig,
      templateConfig,
      customInstructions,
      templateId
    });

    const response = await axios.default.post(
      `${AI_BASE_URL}/generate/outreach`,
      { 
        prompt,
        context: {
          candidate: candidateContext,
          job: jobContext,
          recruiter: recruiterContext,
          tone,
          outreachType
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 15000
      }
    );
    
    return response.data;
  } catch (error) {
    console.warn('AI outreach generation failed, falling back to templates:', error.message);
    return await generateWithTemplate(context);
  }
}

function buildAIPrompt(context) {
  const {
    candidateContext,
    jobContext,
    recruiterContext,
    outreachType,
    toneConfig,
    templateConfig,
    customInstructions,
    templateId
  } = context;

  let prompt = `Generate a personalized ${outreachType} outreach message with the following requirements:\n\n`;
  
  prompt += `TONE: ${toneConfig.style}. Use ${toneConfig.greeting} as greeting and ${toneConfig.closing} as closing. Characteristics: ${toneConfig.characteristics.join(', ')}.\n\n`;
  
  prompt += `CANDIDATE:\n`;
  prompt += `- Name: ${candidateContext.fullName}\n`;
  prompt += `- Bio: ${candidateContext.bio}\n`;
  prompt += `- Current Company: ${candidateContext.currentCompany}\n`;
  prompt += `- Experience: ${candidateContext.experience} years\n`;
  prompt += `- Skills: ${candidateContext.topSkills.join(', ')}\n`;
  prompt += `- Location: ${candidateContext.location}\n`;
  
  if (candidateContext.projects.length > 0) {
    prompt += `- Projects: ${candidateContext.projects.map(p => `${p.name} (${p.language})`).join(', ')}\n`;
  }
  
  if (candidateContext.matchedSkills.length > 0) {
    prompt += `- Matched Skills: ${candidateContext.matchedSkills.join(', ')}\n`;
  }
  
  if (jobContext) {
    prompt += `\nJOB:\n`;
    prompt += `- Title: ${jobContext.title}\n`;
    prompt += `- Company: ${jobContext.company}\n`;
    prompt += `- Location: ${jobContext.location}\n`;
    prompt += `- Required Skills: ${jobContext.skills.join(', ')}\n`;
    prompt += `- Description: ${jobContext.description.substring(0, 200)}...\n`;
  }
  
  prompt += `\nRECRUITER:\n`;
  prompt += `- Name: ${recruiterContext.name}\n`;
  prompt += `- Company: ${recruiterContext.company}\n`;
  prompt += `- Industry: ${recruiterContext.industry}\n`;
  
  if (customInstructions) {
    prompt += `\nCUSTOM INSTRUCTIONS: ${customInstructions}\n`;
  }
  
  prompt += `\nGenerate a compelling, personalized message that:\n`;
  prompt += `1. References specific candidate skills and experience\n`;
  prompt += `2. Mentions relevant projects or achievements\n`;
  prompt += `3. Aligns with the job requirements if applicable\n`;
  prompt += `4. Uses the specified tone and style\n`;
  prompt += `5. Includes a clear call to action\n`;
  prompt += `6. Generates an appropriate subject line\n`;
  
  return prompt;
}

async function generateWithTemplate(context) {
  const {
    candidateContext,
    jobContext,
    recruiterContext,
    outreachType,
    tone,
    customInstructions,
    templateId
  } = context;

  const toneConfig = OUTREACH_TONES[tone];
  const templateConfig = OUTREACH_TEMPLATES[outreachType];

  let message = templateConfig.structure;
  let subject = templateConfig.subject;

  const variables = {
    candidateName: candidateContext.fullName,
    greeting: toneConfig.greeting,
    closing: toneConfig.closing,
    recruiterName: recruiterContext.name,
    company: recruiterContext.company || jobContext?.company || 'our company',
    position: jobContext?.title || 'a relevant position',
    keySkill: candidateContext.topSkills[0] || 'your expertise',
    location: candidateContext.location,
    currentCompany: candidateContext.currentCompany
  };

  variables.personalizedIntro = buildPersonalizedIntro(candidateContext, jobContext, tone);
  variables.jobDescription = buildJobDescription(jobContext, tone);
  variables.callToAction = buildCallToAction(outreachType, tone);
  variables.followupContext = buildFollowupContext(candidateContext, tone);
  variables.additionalInfo = buildAdditionalInfo(jobContext, candidateContext, tone);
  variables.coldIntro = buildColdIntro(candidateContext, recruiterContext, tone);
  variables.valueProposition = buildValueProposition(candidateContext, jobContext, tone);

  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(regex, variables[key]);
    subject = subject.replace(regex, variables[key]);
  });

  if (customInstructions) {
    message += `\n\n${customInstructions}`;
  }

  return {
    message,
    subject,
    personalizationScore: calculatePersonalizationScore(candidateContext, variables),
    matchedSkills: candidateContext.matchedSkills,
    candidateInsights: generateCandidateInsights(candidateContext),
    aiGenerated: false
  };
}

function buildPersonalizedIntro(candidateContext, jobContext, tone) {
  const intro = [];
  
  if (candidateContext.matchedSkills.length > 0) {
    intro.push(`I noticed your expertise in ${candidateContext.matchedSkills.slice(0, 3).join(', ')}`);
  }
  
  if (candidateContext.projects.length > 0) {
    const project = candidateContext.projects[0];
    intro.push(`and was impressed by your work on ${project.name}`);
  }
  
  if (candidateContext.currentCompany) {
    intro.push(`while you were at ${candidateContext.currentCompany}`);
  }
  
  if (jobContext && jobContext.title) {
    intro.push(`and wanted to reach out about the ${jobContext.title} opportunity`);
  }
  
  return intro.join(' ') + '.';
}

function buildJobDescription(jobContext, tone) {
  if (!jobContext) return "We have an exciting opportunity that aligns with your background.";
  
  const description = [];
  description.push(`We're looking for a ${jobContext.title}`);
  
  if (jobContext.company) {
    description.push(`at ${jobContext.company}`);
  }
  
  if (jobContext.location) {
    description.push(`in ${jobContext.location}`);
  }
  
  if (jobContext.skills.length > 0) {
    description.push(`that requires expertise in ${jobContext.skills.slice(0, 3).join(', ')}`);
  }
  
  return description.join(' ') + '.';
}

function buildCallToAction(outreachType, tone) {
  const actions = {
    email: "Would you be available for a brief call next week to discuss this opportunity further?",
    linkedin: "I'd love to connect and share more details about this role.",
    followup: "Please let me know if you're still interested in exploring this opportunity.",
    cold: "I believe this could be a great match for your skills and experience. Would you like to learn more?"
  };
  
  return actions[outreachType] || actions.email;
}

function buildFollowupContext(candidateContext, tone) {
  return `I wanted to follow up on my previous message regarding the opportunity I mentioned. Given your background in ${candidateContext.topSkills.slice(0, 2).join(' and ')}, I believe this could be an excellent fit for your career goals.`;
}

function buildAdditionalInfo(jobContext, candidateContext, tone) {
  const info = [];
  
  if (jobContext && jobContext.salary) {
    info.push(`This position offers competitive compensation up to ${jobContext.salary}`);
  }
  
  if (jobContext && jobContext.remote) {
    info.push(`with flexible remote work options`);
  }
  
  if (candidateContext.matchedSkills.length > 3) {
    info.push(`Your extensive experience in ${candidateContext.matchedSkills.slice(0, 3).join(', ')} aligns perfectly with our requirements`);
  }
  
  return info.join(' and ') + '.';
}

function buildColdIntro(candidateContext, recruiterContext, tone) {
  return `I came across your profile and was impressed by your work in ${candidateContext.topSkills.slice(0, 2).join(' and ')}. Your experience at ${candidateContext.currentCompany || 'your current role'} caught my attention.`;
}

function buildValueProposition(candidateContext, jobContext, tone) {
  const props = [];
  
  if (jobContext && jobContext.company) {
    props.push(`Join ${jobContext.company}'s innovative team`);
  }
  
  if (candidateContext.matchedSkills.length > 0) {
    props.push(`where your ${candidateContext.matchedSkills.slice(0, 2).join(' and ')} expertise will be highly valued`);
  }
  
  props.push(`and make a significant impact on exciting projects`);
  
  return props.join(' ') + '.';
}

function calculatePersonalizationScore(candidateContext, variables) {
  let score = 0;
  const maxScore = 10;
  
  if (variables.personalizedIntro && variables.personalizedIntro.includes(candidateContext.topSkills[0])) score += 2;
  if (variables.personalizedIntro && variables.personalizedIntro.includes(candidateContext.currentCompany)) score += 1;
  if (candidateContext.projects.length > 0 && variables.personalizedIntro.includes('project')) score += 2;
  if (candidateContext.matchedSkills.length > 2) score += 2;
  if (variables.jobDescription && variables.jobDescription.includes(candidateContext.topSkills[0])) score += 2;
  if (variables.valueProposition && variables.valueProposition.includes(candidateContext.matchedSkills[0])) score += 1;
  
  return Math.min(maxScore, score);
}

function generateCandidateInsights(candidateContext) {
  const insights = [];
  
  if (candidateContext.githubSkills.length > 3) {
    insights.push(`Strong GitHub presence with expertise in ${candidateContext.githubSkills.slice(0, 3).join(', ')}`);
  }
  
  if (candidateContext.experience >= 5) {
    insights.push(`${candidateContext.experience}+ years of professional experience`);
  }
  
  if (candidateContext.projects.length > 2) {
    insights.push(`Active contributor with ${candidateContext.projects.length} notable projects`);
  }
  
  if (candidateContext.matchedSkills.length > 3) {
    insights.push(`High skill alignment with ${candidateContext.matchedSkills.length} matching skills`);
  }
  
  return insights;
}

export async function sendOutreachMessage(options) {
  try {
    const {
      candidateId,
      outreachId,
      recruiterId,
      subject,
      message,
      outreachType,
      sendMethod,
      scheduledAt
    } = options;

    const sendRecord = {
      recruiterId,
      candidateId,
      outreachId,
      subject,
      message,
      outreachType,
      sendMethod,
      sentAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      status: scheduledAt ? 'scheduled' : 'sent'
    };

    if (sendMethod === 'email') {
      await sendEmailOutreach(sendRecord);
    } else if (sendMethod === 'linkedin') {
      await sendLinkedInOutreach(sendRecord);
    } else if (sendMethod === 'manual') {
      await markAsManualSend(sendRecord);
    }

    return {
      success: true,
      sendRecord,
      message: scheduledAt ? "Outreach scheduled successfully" : "Outreach sent successfully"
    };
  } catch (error) {
    console.error("Error in sendOutreachMessage:", error);
    throw new Error(`Outreach send failed: ${error.message}`);
  }
}

async function sendEmailOutreach(sendRecord) {
  console.log("Email outreach would be sent here:", sendRecord);
}

async function sendLinkedInOutreach(sendRecord) {
  console.log("LinkedIn outreach would be sent here:", sendRecord);
}

async function markAsManualSend(sendRecord) {
  console.log("Manual outreach marked as sent:", sendRecord);
}

export async function bulkGenerateOutreach(options) {
  try {
    const {
      candidateIds,
      jobId,
      recruiterId,
      outreachType,
      tone,
      customInstructions,
      templateId,
      batchSize
    } = options;

    const queueData = {
      candidateIds,
      jobId,
      recruiterId,
      outreachType,
      tone,
      customInstructions,
      templateId,
      batchSize
    };

    const queueJobId = await enqueueBulkOutreach(queueData);

    return {
      success: true,
      queueJobId: queueJobId,
      message: `Bulk outreach generation initiated for ${candidateIds.length} candidates`,
      totalCandidates: candidateIds.length,
      batchSize,
      estimatedTime: Math.ceil(candidateIds.length / batchSize) * 2
    };
  } catch (error) {
    console.error("Error in bulkGenerateOutreach:", error);
    throw new Error(`Bulk outreach generation failed: ${error.message}`);
  }
}

export async function getOutreachTemplates(recruiterId, filters = {}) {
  try {
    const OutreachTemplate = await import("../../models/outreachTemplate.model.js");
    
    const query = { $or: [{ createdBy: recruiterId }, { isPublic: true }] };
    
    if (filters.outreachType) query.outreachType = filters.outreachType;
    if (filters.tone) query.tone = filters.tone;
    
    const templates = await OutreachTemplate.default
      .find(query)
      .sort({ isPublic: -1, createdAt: -1 })
      .lean();

    return templates;
  } catch (error) {
    console.error("Error getting outreach templates:", error);
    return [];
  }
}

export async function saveOutreachTemplate(templateData) {
  try {
    const OutreachTemplate = await import("../../models/outreachTemplate.model.js");
    
    const template = new OutreachTemplate.default(templateData);
    await template.save();

    return template;
  } catch (error) {
    console.error("Error saving outreach template:", error);
    throw new Error(`Template save failed: ${error.message}`);
  }
}
