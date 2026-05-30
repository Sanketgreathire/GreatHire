/**
 * aiJdClient.js
 * Extends the AI service client with JD-specific operations.
 * Re-exports common functions and adds JD Qdrant collection support.
 */
import axios from "axios";

const AI_BASE_URL = process.env.AI_SERVICE_URL    || "http://localhost:8001";
const AI_API_KEY  = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
const JOB_COLLECTION = "sourcing_jobs";

const aiClient = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json", "x-api-key": AI_API_KEY },
});

export async function isAiServiceAvailable() {
  try {
    const { data } = await aiClient.get("/health");
    return data.status === "ok";
  } catch { return false; }
}

export async function embedText(text) {
  const { data } = await aiClient.post("/embed", { text, normalize: true });
  return data.embedding;
}

export async function embedBatch(texts) {
  const { data } = await aiClient.post("/embed/batch", { texts, normalize: true });
  return data.embeddings;
}

/**
 * Index a job embedding into the jobs Qdrant collection.
 * We pass collection override via query param (Python service must support it).
 */
export async function indexJobInQdrant(jobId, embedding, payload) {
  // Use the candidates index endpoint with a collection override header
  // The Python service uses QDRANT_COLLECTION env var — for jobs we use a separate call
  // For now, store in same collection with a "type: job" payload field
  const { data } = await aiClient.post("/candidates/index", {
    candidate_id:    `job_${jobId}`,
    full_name:       payload.designation || "",
    skills:          payload.required_skills || [],
    normalized_skills: payload.required_skills || [],
    designation:     payload.designation || "",
    current_company: "",
    location:        payload.location || "",
    summary:         `Job: ${payload.designation} | Domain: ${payload.domain} | Seniority: ${payload.seniority}`,
    total_experience: payload.min_experience || 0,
    source_type:     "JOB_DESCRIPTION",
    recruiter_id:    payload.recruiter_id,
  });
  return data;
}

/**
 * Semantic search for candidates matching a JD embedding.
 */
export async function searchCandidatesForJd({ jdEmbeddingText, recruiterId, topK = 50, scoreThreshold = 0.3 }) {
  // Generate embedding for JD
  const embedding = await embedText(jdEmbeddingText);

  // Search candidates in Qdrant
  const { data } = await aiClient.post("/search/semantic", {
    query:           jdEmbeddingText,
    recruiter_id:    recruiterId,
    top_k:           topK,
    score_threshold: scoreThreshold,
  });

  return { embedding, results: data.results || [] };
}
