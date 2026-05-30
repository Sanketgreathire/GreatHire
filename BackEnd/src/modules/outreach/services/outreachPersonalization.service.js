import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

export async function personalizeOutreach(generatedContent, candidateContext, tone) {
  try {
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    let personalizedContent;
    
    if (aiAvailable) {
      personalizedContent = await personalizeWithAI(generatedContent, candidateContext, tone);
    } else {
      personalizedContent = await personalizeWithRules(generatedContent, candidateContext, tone);
    }

    const personalizationScore = calculatePersonalizationScore(personalizedContent, candidateContext);
    const matchedSkills = extractMatchedSkills(personalizedContent, candidateContext);
    const candidateInsights = generateCandidateInsights(personalizedContent, candidateContext);

    return {
      message: personalizedContent.message,
      subject: personalizedContent.subject,
      personalizationScore,
      matchedSkills,
      candidateInsights
    };
  } catch (error) {
    console.error("Error in personalizeOutreach:", error);
    throw new Error(`Personalization failed: ${error.message}`);
  }
}

async function personalizeWithAI(generatedContent, candidateContext, tone) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const prompt = buildPersonalizationPrompt(generatedContent, candidateContext, tone);

    const response = await axios.default.post(
      `${AI_BASE_URL}/personalize/outreach`,
      {
        message: generatedContent.message,
        subject: generatedContent.subject,
        candidateContext,
        tone,
        prompt
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 10000
      }
    );

    return response.data;
  } catch (error) {
    console.warn("AI personalization failed, using rule-based:", error.message);
    return await personalizeWithRules(generatedContent, candidateContext, tone);
  }
}

function buildPersonalizationPrompt(generatedContent, candidateContext, tone) {
  let prompt = `Personalize this outreach message for the candidate:\n\n`;
  
  prompt += `ORIGINAL MESSAGE:\n${generatedContent.message}\n\n`;
  prompt += `ORIGINAL SUBJECT:\n${generatedContent.subject}\n\n`;
  
  prompt += `CANDIDATE DETAILS:\n`;
  prompt += `- Name: ${candidateContext.fullName}\n`;
  prompt += `- Current Company: ${candidateContext.currentCompany}\n`;
  prompt += `- Experience: ${candidateContext.experience} years\n`;
  prompt += `- Top Skills: ${candidateContext.topSkills.join(', ')}\n`;
  prompt += `- GitHub Skills: ${candidateContext.githubSkills.join(', ')}\n`;
  prompt += `- Location: ${candidateContext.location}\n`;
  
  if (candidateContext.projects.length > 0) {
    prompt += `- Projects: ${candidateContext.projects.map(p => `${p.name} (${p.language})`).join(', ')}\n`;
  }
  
  if (candidateContext.recentExperience) {
    prompt += `- Recent Experience: ${candidateContext.recentExperience.company} for ${candidateContext.recentExperience.duration}\n`;
  }
  
  if (candidateContext.education) {
    prompt += `- Education: ${candidateContext.education}\n`;
  }
  
  if (candidateContext.recruiterNotes) {
    prompt += `- Recruiter Notes: ${candidateContext.recruiterNotes}\n`;
  }
  
  prompt += `\nTONE: ${tone}\n\n`;
  
  prompt += `PERSONALIZATION REQUIREMENTS:\n`;
  prompt += `1. Reference specific projects and achievements\n`;
  prompt += `2. Mention relevant GitHub repositories and technologies\n`;
  prompt += `3. Include company-specific insights if available\n`;
  prompt += `4. Reference location if relevant\n`;
  prompt += `5. Match experience level with appropriate language\n`;
  prompt += `6. Incorporate any recruiter notes naturally\n`;
  prompt += `7. Maintain the specified tone throughout\n`;
  prompt += `8. Ensure the message feels genuinely personal, not template-based\n`;
  
  return prompt;
}

async function personalizeWithRules(generatedContent, candidateContext, tone) {
  let message = generatedContent.message;
  let subject = generatedContent.subject;

  message = addProjectReferences(message, candidateContext);
  message = addGitHubSkills(message, candidateContext);
  message = addCompanyReferences(message, candidateContext);
  message = addLocationReferences(message, candidateContext);
  message = addExperienceLevel(message, candidateContext, tone);
  message = addRecruiterNotes(message, candidateContext);

  subject = personalizeSubject(subject, candidateContext);

  return {
    message,
    subject
  };
}

function addProjectReferences(message, candidateContext) {
  if (candidateContext.projects.length === 0) return message;

  const project = candidateContext.projects[0];
  const projectReference = `I was particularly impressed by your work on ${project.name}${project.language ? `, especially your use of ${project.language}` : ''}`;

  const insertPoint = message.search(/I noticed|I came across|I found/i);
  if (insertPoint !== -1) {
    return message.substring(0, insertPoint) + projectReference + '. ' + message.substring(insertPoint);
  }

  return message.replace(/I noticed/g, projectReference + '. I noticed');
}

function addGitHubSkills(message, candidateContext) {
  if (candidateContext.githubSkills.length === 0) return message;

  const topGithubSkills = candidateContext.githubSkills.slice(0, 3);
  const skillsReference = `Your GitHub profile shows strong expertise in ${topGithubSkills.join(', ')}`;

  if (message.includes('skills') && !message.includes('GitHub')) {
    return message.replace(/skills/g, `skills, particularly your GitHub expertise in ${topGithubSkills.join(', ')}`);
  }

  const skillsIndex = message.search(/expertise|experience|background/i);
  if (skillsIndex !== -1) {
    return message.substring(0, skillsIndex) + skillsReference + '. ' + message.substring(skillsIndex);
  }

  return message;
}

function addCompanyReferences(message, candidateContext) {
  if (!candidateContext.currentCompany) return message;

  const companyReference = candidateContext.currentCompany;
  
  if (!message.includes(candidateContext.currentCompany)) {
    const experiencePoint = message.search(/experience|background|work/i);
    if (experiencePoint !== -1) {
      return message.substring(0, experiencePoint) + `Your experience at ${companyReference} ` + message.substring(experiencePoint);
    }
  }

  return message;
}

function addLocationReferences(message, candidateContext) {
  if (!candidateContext.location) return message;

  const location = candidateContext.location;
  
  if (!message.includes(location) && (location.toLowerCase().includes('remote') || location.toLowerCase().includes(candidateContext.currentCompany?.toLowerCase()))) {
    return message.replace(/opportunity/g, `opportunity${location.includes('remote') ? ' with remote flexibility' : ''}`);
  }

  return message;
}

function addExperienceLevel(message, candidateContext, tone) {
  const experience = candidateContext.experience;
  let levelReference = '';

  if (experience >= 10) {
    levelReference = 'senior professional';
  } else if (experience >= 5) {
    levelReference = 'experienced professional';
  } else if (experience >= 2) {
    levelReference = 'growing professional';
  } else {
    levelReference = 'talented professional';
  }

  if (tone === 'executive_hiring' && experience >= 10) {
    levelReference = 'seasoned executive';
  } else if (tone === 'startup_casual') {
    levelReference = 'talented developer';
  }

  return message.replace(/professional/g, levelReference);
}

function addRecruiterNotes(message, candidateContext) {
  if (!candidateContext.recruiterNotes) return message;

  const notes = candidateContext.recruiterNotes;
  const notesReference = `I also noted that ${notes}`;

  const closingIndex = message.search(/Best regards|Cheers|Looking forward|Sincerely/i);
  if (closingIndex !== -1) {
    return message.substring(0, closingIndex) + notesReference + '.\n\n' + message.substring(closingIndex);
  }

  return message + `\n\n${notesReference}.`;
}

function personalizeSubject(subject, candidateContext) {
  let personalizedSubject = subject;

  if (candidateContext.topSkills.length > 0) {
    personalizedSubject = personalizedSubject.replace(/{{keySkill}}/g, candidateContext.topSkills[0]);
  }

  if (candidateContext.currentCompany && !personalizedSubject.includes(candidateContext.currentCompany)) {
    personalizedSubject += ` - ${candidateContext.currentCompany}`;
  }

  return personalizedSubject;
}

function calculatePersonalizationScore(personalizedContent, candidateContext) {
  let score = 0;
  const maxScore = 10;

  const message = personalizedContent.message.toLowerCase();
  const subject = personalizedContent.subject.toLowerCase();

  if (candidateContext.projects.length > 0 && message.includes(candidateContext.projects[0].name.toLowerCase())) score += 2;
  if (candidateContext.githubSkills.length > 0 && candidateContext.githubSkills.some(skill => message.includes(skill.toLowerCase()))) score += 2;
  if (candidateContext.currentCompany && message.includes(candidateContext.currentCompany.toLowerCase())) score += 1;
  if (candidateContext.location && message.includes(candidateContext.location.toLowerCase())) score += 1;
  if (candidateContext.topSkills.length > 0 && candidateContext.topSkills.some(skill => message.includes(skill.toLowerCase()))) score += 2;
  if (candidateContext.recruiterNotes && message.includes(candidateContext.recruiterNotes.toLowerCase())) score += 1;
  if (subject.includes(candidateContext.topSkills[0]?.toLowerCase())) score += 1;

  return Math.min(maxScore, score);
}

function extractMatchedSkills(personalizedContent, candidateContext) {
  const message = personalizedContent.message.toLowerCase();
  const subject = personalizedContent.subject.toLowerCase();
  const fullText = message + ' ' + subject;

  const mentionedSkills = candidateContext.topSkills.filter(skill => 
    fullText.includes(skill.toLowerCase())
  );

  const mentionedGithubSkills = candidateContext.githubSkills.filter(skill => 
    fullText.includes(skill.toLowerCase())
  );

  return [...new Set([...mentionedSkills, ...mentionedGithubSkills])];
}

function generateCandidateInsights(personalizedContent, candidateContext) {
  const insights = [];
  const message = personalizedContent.message.toLowerCase();

  if (candidateContext.projects.length > 0 && candidateContext.projects.some(project => message.includes(project.name.toLowerCase()))) {
    insights.push(`Referenced specific project: ${candidateContext.projects.find(p => message.includes(p.name.toLowerCase()))?.name}`);
  }

  if (candidateContext.githubSkills.length > 2 && candidateContext.githubSkills.some(skill => message.includes(skill.toLowerCase()))) {
    insights.push(`Highlighted GitHub expertise in ${candidateContext.githubSkills.filter(skill => message.includes(skill.toLowerCase())).slice(0, 2).join(', ')}`);
  }

  if (candidateContext.experience >= 5 && message.includes('senior') || message.includes('experienced')) {
    insights.push('Acknowledged senior experience level');
  }

  if (candidateContext.currentCompany && message.includes(candidateContext.currentCompany.toLowerCase())) {
    insights.push(`Referenced current company: ${candidateContext.currentCompany}`);
  }

  if (candidateContext.recruiterNotes && message.includes(candidateContext.recruiterNotes.toLowerCase())) {
    insights.push('Incorporated recruiter notes');
  }

  if (insights.length === 0) {
    insights.push('Basic personalization applied');
  }

  return insights;
}
