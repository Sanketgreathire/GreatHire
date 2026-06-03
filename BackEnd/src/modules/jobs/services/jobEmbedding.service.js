import { embedText, embedBatch, isAiServiceAvailable } from "../../../../sourcing/ai/aiServiceClient.js";

export async function generateJobEmbedding(jobData) {
  const { jobId, title, description, skills, experience, location, designation, seniority } = jobData;
  
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  const aiAvailable = await isAiServiceAvailable();
  
  if (!aiAvailable) {
    console.warn('AI service not available, skipping job embedding generation');
    return null;
  }

  try {
    const textToEmbed = constructJobText({ title, description, skills, experience, location, designation, seniority });
    
    if (!textToEmbed || textToEmbed.trim().length < 10) {
      console.warn('Insufficient text content for embedding generation');
      return null;
    }

    const embedding = await embedText(textToEmbed);
    
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      console.warn('Invalid embedding received from AI service');
      return null;
    }

    return {
      jobId,
      embedding,
      textLength: textToEmbed.length,
      embeddingDimension: embedding.length,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error generating job embedding:', error.message);
    throw new Error(`Failed to generate job embedding: ${error.message}`);
  }
}

export async function generateBatchJobEmbeddings(jobsData) {
  if (!Array.isArray(jobsData) || jobsData.length === 0) {
    throw new Error('Jobs data array is required and cannot be empty');
  }

  const aiAvailable = await isAiServiceAvailable();
  
  if (!aiAvailable) {
    console.warn('AI service not available, skipping batch job embedding generation');
    return [];
  }

  try {
    const textsToEmbed = jobsData.map(job => ({
      jobId: job.jobId,
      text: constructJobText(job)
    })).filter(item => item.text && item.text.trim().length >= 10);

    if (textsToEmbed.length === 0) {
      console.warn('No valid text content for batch embedding generation');
      return [];
    }

    const texts = textsToEmbed.map(item => item.text);
    const embeddings = await embedBatch(texts);

    if (!embeddings || !Array.isArray(embeddings) || embeddings.length !== texts.length) {
      console.warn('Invalid batch embeddings received from AI service');
      return [];
    }

    return textsToEmbed.map((item, index) => ({
      jobId: item.jobId,
      embedding: embeddings[index],
      textLength: item.text.length,
      embeddingDimension: embeddings[index] ? embeddings[index].length : 0,
      createdAt: new Date()
    }));
  } catch (error) {
    console.error('Error generating batch job embeddings:', error.message);
    throw new Error(`Failed to generate batch job embeddings: ${error.message}`);
  }
}

export async function indexJobInVectorStore(jobData) {
  const { jobId, title, description, skills, experience, location, designation, seniority } = jobData;
  
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  const aiAvailable = await isAiServiceAvailable();
  
  if (!aiAvailable) {
    console.warn('AI service not available, skipping job vector indexing');
    return null;
  }

  try {
    const payload = {
      job_id: jobId,
      title: title || '',
      description: description || '',
      skills: skills || [],
      experience: experience || '',
      location: location || '',
      designation: designation || '',
      seniority: seniority || '',
      text_content: constructJobText({ title, description, skills, experience, location, designation, seniority }),
      metadata: {
        skills_count: (skills || []).length,
        has_experience: !!experience,
        has_location: !!location,
        has_designation: !!designation,
        has_seniority: !!seniority,
        created_at: new Date().toISOString()
      }
    };

    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
    
    const response = await axios.default.post(
      `${AI_BASE_URL}/jobs/index`,
      payload,
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
    console.error('Error indexing job in vector store:', error.message);
    throw new Error(`Failed to index job in vector store: ${error.message}`);
  }
}

export async function bulkIndexJobsInVectorStore(jobsData) {
  if (!Array.isArray(jobsData) || jobsData.length === 0) {
    throw new Error('Jobs data array is required and cannot be empty');
  }

  const aiAvailable = await isAiServiceAvailable();
  
  if (!aiAvailable) {
    console.warn('AI service not available, skipping bulk job vector indexing');
    return null;
  }

  try {
    const payload = {
      jobs: jobsData.map(job => ({
        job_id: job.jobId,
        title: job.title || '',
        description: job.description || '',
        skills: job.skills || [],
        experience: job.experience || '',
        location: job.location || '',
        designation: job.designation || '',
        seniority: job.seniority || '',
        text_content: constructJobText(job),
        metadata: {
          skills_count: (job.skills || []).length,
          has_experience: !!job.experience,
          has_location: !!job.location,
          has_designation: !!job.designation,
          has_seniority: !!job.seniority,
          created_at: new Date().toISOString()
        }
      }))
    };

    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
    
    const response = await axios.default.post(
      `${AI_BASE_URL}/jobs/bulk-index`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 30000
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error bulk indexing jobs in vector store:', error.message);
    throw new Error(`Failed to bulk index jobs in vector store: ${error.message}`);
  }
}

export async function removeJobFromVectorStore(jobId) {
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  const aiAvailable = await isAiServiceAvailable();
  
  if (!aiAvailable) {
    console.warn('AI service not available, skipping job removal from vector store');
    return null;
  }

  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
    
    const response = await axios.default.delete(
      `${AI_BASE_URL}/jobs/delete`,
      {
        data: { job_id: jobId },
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 10000
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error removing job from vector store:', error.message);
    throw new Error(`Failed to remove job from vector store: ${error.message}`);
  }
}

function constructJobText(jobData) {
  const { title, description, skills, experience, location, designation, seniority } = jobData;
  
  const parts = [];
  
  if (title) parts.push(`Title: ${title}`);
  if (designation) parts.push(`Designation: ${designation}`);
  if (seniority) parts.push(`Seniority: ${seniority}`);
  if (experience) parts.push(`Experience: ${experience}`);
  if (location) parts.push(`Location: ${location}`);
  if (skills && skills.length > 0) parts.push(`Skills: ${skills.join(', ')}`);
  if (description) parts.push(`Description: ${description}`);
  
  return parts.join('. ');
}

export async function validateJobEmbedding(embedding) {
  if (!embedding) {
    return { valid: false, reason: 'Embedding is null or undefined' };
  }
  
  if (!Array.isArray(embedding)) {
    return { valid: false, reason: 'Embedding is not an array' };
  }
  
  if (embedding.length === 0) {
    return { valid: false, reason: 'Embedding array is empty' };
  }
  
  const hasInvalidValues = embedding.some(value => 
    typeof value !== 'number' || isNaN(value) || !isFinite(value)
  );
  
  if (hasInvalidValues) {
    return { valid: false, reason: 'Embedding contains invalid values (NaN, Infinity, or non-numbers)' };
  }
  
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitude === 0) {
    return { valid: false, reason: 'Embedding magnitude is zero (all zeros)' };
  }
  
  if (magnitude < 0.1 || magnitude > 10) {
    return { valid: false, reason: `Embedding magnitude ${magnitude.toFixed(4)} is outside expected range [0.1, 10]` };
  }
  
  return { valid: true, magnitude };
}
