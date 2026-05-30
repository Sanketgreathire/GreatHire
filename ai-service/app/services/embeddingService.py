"""
embeddingService.py
Loads sentence-transformers model once at startup.
Generates normalized embeddings for candidates and queries.
"""
import os
import time
import logging
from typing import List, Union
import numpy as np
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

MODEL_NAME = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
DIMENSION  = int(os.getenv("EMBEDDING_DIMENSION", "384"))
BATCH_SIZE = int(os.getenv("EMBEDDING_BATCH_SIZE", "32"))

_model: SentenceTransformer = None


def load_model() -> SentenceTransformer:
    """Load model at startup — called once."""
    global _model
    if _model is not None:
        return _model
    logger.info(f"Loading embedding model: {MODEL_NAME}")
    start = time.time()
    _model = SentenceTransformer(MODEL_NAME)
    elapsed = round((time.time() - start) * 1000)
    logger.info(f"Model loaded in {elapsed}ms — dimension={DIMENSION}")
    return _model


def get_model() -> SentenceTransformer:
    if _model is None:
        raise RuntimeError("Embedding model not loaded. Call load_model() at startup.")
    return _model


def embed_text(text: str, normalize: bool = True) -> List[float]:
    """Generate embedding for a single text string."""
    model = get_model()
    text  = text.strip()
    if not text:
        return [0.0] * DIMENSION
    vec = model.encode(text, normalize_embeddings=normalize, show_progress_bar=False)
    return vec.tolist()


def embed_batch(texts: List[str], normalize: bool = True) -> List[List[float]]:
    """Generate embeddings for a batch of texts."""
    model  = get_model()
    cleaned = [t.strip() if t else "" for t in texts]
    vecs   = model.encode(
        cleaned,
        batch_size=BATCH_SIZE,
        normalize_embeddings=normalize,
        show_progress_bar=False,
    )
    return vecs.tolist()


def build_candidate_text(candidate: dict) -> str:
    """
    Build a rich text representation of a candidate for embedding.
    Combines the most semantically meaningful fields.
    """
    parts = []

    if candidate.get("full_name"):
        parts.append(candidate["full_name"])

    if candidate.get("designation"):
        parts.append(candidate["designation"])

    if candidate.get("current_company"):
        parts.append(f"at {candidate['current_company']}")

    if candidate.get("normalized_skills") or candidate.get("skills"):
        skills = candidate.get("normalized_skills") or candidate.get("skills", [])
        if skills:
            parts.append("Skills: " + ", ".join(skills[:20]))

    if candidate.get("location"):
        parts.append(f"Location: {candidate['location']}")

    if candidate.get("total_experience"):
        parts.append(f"{candidate['total_experience']} years experience")

    if candidate.get("summary"):
        parts.append(candidate["summary"][:300])

    # Use parsedText for richer context if available (truncated)
    if candidate.get("parsed_text"):
        parts.append(candidate["parsed_text"][:500])

    return " | ".join(parts)


def build_query_text(query: str) -> str:
    """
    Expand a recruiter query for better semantic matching.
    Adds context words to improve embedding quality.
    """
    query = query.strip()
    # Prefix helps the model understand this is a job search query
    return f"Find candidate: {query}"
