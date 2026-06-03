/**
 * aiServiceClient.js
 * HTTP client for communicating with the Python FastAPI AI microservice.
 * All calls are non-blocking — failures are logged but never crash the Node server.
 */
import axios from "axios";

const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
const AI_API_KEY  = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
const TIMEOUT_MS  = 15000;

const aiClient = axios.create({
  baseURL: AI_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    "Content-Type":  "application/json",
    "x-api-key":     AI_API_KEY,
  },
});

// ── Health ────────────────────────────────────────────────────────────────────
export async function checkAiHealth() {
  try {
    const { data } = await aiClient.get("/health");
    return data;
  } catch {
    return { status: "unavailable" };
  }
}

export async function isAiServiceAvailable() {
  const health = await checkAiHealth();
  return health.status === "ok";
}

// ── Embeddings ────────────────────────────────────────────────────────────────
export async function embedText(text) {
  const { data } = await aiClient.post("/embed", { text, normalize: true });
  return data.embedding;
}

export async function embedBatch(texts) {
  const { data } = await aiClient.post("/embed/batch", { texts, normalize: true });
  return data.embeddings;
}

// ── Candidate Indexing ────────────────────────────────────────────────────────
export async function indexCandidate(candidate) {
  const payload = {
    candidate_id:     candidate._id.toString(),
    full_name:        candidate.fullName        || "",
    skills:           candidate.skills          || [],
    normalized_skills: candidate.normalizedSkills || [],
    designation:      candidate.designation     || "",
    current_company:  candidate.currentCompany  || "",
    location:         candidate.location        || "",
    summary:          candidate.summary         || "",
    total_experience: candidate.totalExperience || 0,
    source_type:      candidate.sourceType      || "",
    recruiter_id:     candidate.createdBy?.toString() || "",
    parsed_text:      candidate.parsedText      || null,
  };
  const { data } = await aiClient.post("/candidates/index", payload);
  return data;
}

export async function bulkIndexCandidates(candidates) {
  const payload = {
    candidates: candidates.map((c) => ({
      candidate_id:     c._id.toString(),
      full_name:        c.fullName        || "",
      skills:           c.skills          || [],
      normalized_skills: c.normalizedSkills || [],
      designation:      c.designation     || "",
      current_company:  c.currentCompany  || "",
      location:         c.location        || "",
      summary:          c.summary         || "",
      total_experience: c.totalExperience || 0,
      source_type:      c.sourceType      || "",
      recruiter_id:     c.createdBy?.toString() || "",
    })),
  };
  const { data } = await aiClient.post("/candidates/bulk-index", payload);
  return data;
}

export async function deleteFromVectorStore(candidateId) {
  const { data } = await aiClient.delete("/candidates/delete", {
    data: { candidate_id: candidateId.toString() },
  });
  return data;
}

// ── Semantic Search ───────────────────────────────────────────────────────────
export async function semanticSearch({ query, recruiterId, topK = 20, scoreThreshold = 0.3, filters = null }) {
  const { data } = await aiClient.post("/search/semantic", {
    query,
    recruiter_id:    recruiterId,
    top_k:           topK,
    score_threshold: scoreThreshold,
    filters,
  });
  return data;
}
