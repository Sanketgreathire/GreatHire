from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class EmbedTextRequest(BaseModel):
    text: str
    normalize: bool = True


class EmbedBatchRequest(BaseModel):
    texts: List[str]
    normalize: bool = True


class EmbedResponse(BaseModel):
    embedding: List[float]
    dimension: int
    model: str


class EmbedBatchResponse(BaseModel):
    embeddings: List[List[float]]
    dimension: int
    model: str
    count: int


class CandidateIndexRequest(BaseModel):
    candidate_id: str
    full_name: str
    skills: List[str] = []
    normalized_skills: List[str] = []
    designation: str = ""
    current_company: str = ""
    location: str = ""
    summary: str = ""
    total_experience: float = 0.0
    source_type: str = ""
    recruiter_id: str = ""
    parsed_text: Optional[str] = None   # used for richer embedding


class CandidateIndexResponse(BaseModel):
    success: bool
    candidate_id: str
    vector_id: str
    message: str


class BulkIndexRequest(BaseModel):
    candidates: List[CandidateIndexRequest]


class BulkIndexResponse(BaseModel):
    success: bool
    indexed: int
    failed: int
    errors: List[Dict[str, Any]] = []


class SemanticSearchRequest(BaseModel):
    query: str
    recruiter_id: str
    top_k: int = Field(default=20, ge=1, le=100)
    score_threshold: float = Field(default=0.3, ge=0.0, le=1.0)
    filters: Optional[Dict[str, Any]] = None


class SemanticSearchResult(BaseModel):
    candidate_id: str
    score: float
    payload: Dict[str, Any]


class SemanticSearchResponse(BaseModel):
    query: str
    results: List[SemanticSearchResult]
    total: int
    query_embedding_ms: float
    search_ms: float


class DeleteCandidateRequest(BaseModel):
    candidate_id: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    qdrant_connected: bool
    collection_exists: bool
    vector_count: int
