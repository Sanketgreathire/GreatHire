"""
vectorService.py
Manages Qdrant vector database operations:
- Collection creation
- Candidate vector indexing
- Semantic similarity search
- Vector deletion
"""
import os
import logging
import time
from typing import List, Optional, Dict, Any

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue,
    SearchRequest, ScoredPoint,
)

logger = logging.getLogger(__name__)

QDRANT_HOST  = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT  = int(os.getenv("QDRANT_PORT", "6333"))
COLLECTION   = os.getenv("QDRANT_COLLECTION", "sourcing_candidates")
DIMENSION    = int(os.getenv("EMBEDDING_DIMENSION", "384"))

_client: QdrantClient = None


def get_client() -> QdrantClient:
    global _client
    if _client is None:
        _client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT, timeout=10)
    return _client


def ensure_collection() -> bool:
    """Create collection if it doesn't exist. Returns True if ready."""
    try:
        client = get_client()
        existing = [c.name for c in client.get_collections().collections]

        if COLLECTION not in existing:
            client.create_collection(
                collection_name=COLLECTION,
                vectors_config=VectorParams(
                    size=DIMENSION,
                    distance=Distance.COSINE,
                ),
            )
            # Create payload indexes for fast filtering
            client.create_payload_index(COLLECTION, "recruiter_id", "keyword")
            client.create_payload_index(COLLECTION, "source_type",  "keyword")
            client.create_payload_index(COLLECTION, "total_experience", "float")
            logger.info(f"Created Qdrant collection: {COLLECTION}")
        return True
    except Exception as e:
        logger.error(f"Qdrant collection setup failed: {e}")
        return False


def index_candidate(candidate_id: str, embedding: List[float], payload: Dict[str, Any]) -> str:
    """
    Upsert a single candidate vector into Qdrant.
    Uses candidate_id as the deterministic point ID (hashed to int).
    """
    client   = get_client()
    point_id = _id_to_int(candidate_id)

    client.upsert(
        collection_name=COLLECTION,
        points=[
            PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "candidate_id":    candidate_id,
                    "recruiter_id":    payload.get("recruiter_id", ""),
                    "full_name":       payload.get("full_name", ""),
                    "designation":     payload.get("designation", ""),
                    "current_company": payload.get("current_company", ""),
                    "location":        payload.get("location", ""),
                    "skills":          payload.get("skills", []),
                    "total_experience": payload.get("total_experience", 0),
                    "source_type":     payload.get("source_type", ""),
                },
            )
        ],
    )
    return str(point_id)


def bulk_index_candidates(items: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Bulk upsert candidate vectors.
    items: list of { candidate_id, embedding, payload }
    """
    client = get_client()
    points = []
    errors = 0

    for item in items:
        try:
            point_id = _id_to_int(item["candidate_id"])
            points.append(PointStruct(
                id=point_id,
                vector=item["embedding"],
                payload={
                    "candidate_id":    item["candidate_id"],
                    "recruiter_id":    item["payload"].get("recruiter_id", ""),
                    "full_name":       item["payload"].get("full_name", ""),
                    "designation":     item["payload"].get("designation", ""),
                    "current_company": item["payload"].get("current_company", ""),
                    "location":        item["payload"].get("location", ""),
                    "skills":          item["payload"].get("skills", []),
                    "total_experience": item["payload"].get("total_experience", 0),
                    "source_type":     item["payload"].get("source_type", ""),
                },
            ))
        except Exception as e:
            logger.error(f"Error preparing point {item.get('candidate_id')}: {e}")
            errors += 1

    if points:
        client.upsert(collection_name=COLLECTION, points=points)

    return {"indexed": len(points), "failed": errors}


def semantic_search(
    query_embedding: List[float],
    recruiter_id: str,
    top_k: int = 20,
    score_threshold: float = 0.3,
    filters: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """
    Search Qdrant for semantically similar candidates.
    Filters by recruiter_id so recruiters only see their own candidates.
    """
    client = get_client()

    # Build filter — always scope to recruiter
    must_conditions = [
        FieldCondition(key="recruiter_id", match=MatchValue(value=recruiter_id))
    ]

    # Optional extra filters
    if filters:
        if filters.get("source_type"):
            must_conditions.append(
                FieldCondition(key="source_type", match=MatchValue(value=filters["source_type"]))
            )

    qdrant_filter = Filter(must=must_conditions)

    results = client.search(
        collection_name=COLLECTION,
        query_vector=query_embedding,
        query_filter=qdrant_filter,
        limit=top_k,
        score_threshold=score_threshold,
        with_payload=True,
    )

    return [
        {
            "candidate_id": r.payload.get("candidate_id", ""),
            "score":        round(r.score, 4),
            "payload":      r.payload,
        }
        for r in results
    ]


def delete_candidate(candidate_id: str) -> bool:
    """Remove a candidate vector from Qdrant."""
    try:
        client   = get_client()
        point_id = _id_to_int(candidate_id)
        client.delete(collection_name=COLLECTION, points_selector=[point_id])
        return True
    except Exception as e:
        logger.error(f"Delete vector failed for {candidate_id}: {e}")
        return False


def get_collection_info() -> Dict[str, Any]:
    """Return collection stats for health check."""
    try:
        client = get_client()
        info   = client.get_collection(COLLECTION)
        return {
            "exists":       True,
            "vector_count": info.vectors_count or 0,
            "status":       str(info.status),
        }
    except Exception:
        return {"exists": False, "vector_count": 0, "status": "unavailable"}


def is_qdrant_connected() -> bool:
    try:
        get_client().get_collections()
        return True
    except Exception:
        return False


def _id_to_int(candidate_id: str) -> int:
    """Convert MongoDB ObjectId string to a stable integer for Qdrant point ID."""
    # Use first 15 hex chars of ObjectId → fits in int64
    hex_str = candidate_id.replace("-", "")[:15]
    return int(hex_str, 16)
