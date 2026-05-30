"""
semanticSearchService.py
Orchestrates: query understanding → embedding → Qdrant search → result formatting
"""
import time
import logging
from typing import List, Dict, Any, Optional

from .embeddingService import embed_text, build_query_text
from .vectorService    import semantic_search

logger = logging.getLogger(__name__)

# Query expansion map — maps domain terms to richer context
QUERY_EXPANSIONS = {
    "fintech":     "financial technology payments banking blockchain",
    "backend":     "server-side API database microservices",
    "frontend":    "UI React Angular Vue JavaScript CSS",
    "fullstack":   "frontend backend full-stack React Node.js",
    "devops":      "CI/CD Docker Kubernetes cloud infrastructure",
    "ml":          "machine learning AI deep learning data science",
    "cloud":       "AWS Azure GCP infrastructure DevOps",
    "startup":     "fast-paced agile product-focused generalist",
    "scaling":     "high performance distributed systems architecture",
    "mobile":      "iOS Android React Native Flutter",
    "data":        "analytics SQL Python pandas visualization",
    "security":    "cybersecurity penetration testing OWASP",
}


def expand_query(query: str) -> str:
    """
    Expand recruiter query with domain-specific context.
    Example: "fintech backend" → "fintech financial technology payments ... backend server-side API ..."
    """
    lower  = query.lower()
    extras = []
    for keyword, expansion in QUERY_EXPANSIONS.items():
        if keyword in lower:
            extras.append(expansion)

    if extras:
        return f"{query} {' '.join(extras)}"
    return query


def run_semantic_search(
    query: str,
    recruiter_id: str,
    top_k: int = 20,
    score_threshold: float = 0.3,
    filters: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Full semantic search pipeline:
    1. Expand query with domain context
    2. Generate query embedding
    3. Search Qdrant
    4. Return ranked results
    """
    t0 = time.time()

    # Step 1: Expand + build query text
    expanded = expand_query(query)
    query_text = build_query_text(expanded)

    # Step 2: Embed query
    t_embed_start = time.time()
    query_embedding = embed_text(query_text, normalize=True)
    embed_ms = round((time.time() - t_embed_start) * 1000, 1)

    # Step 3: Vector search
    t_search_start = time.time()
    results = semantic_search(
        query_embedding=query_embedding,
        recruiter_id=recruiter_id,
        top_k=top_k,
        score_threshold=score_threshold,
        filters=filters,
    )
    search_ms = round((time.time() - t_search_start) * 1000, 1)

    total_ms = round((time.time() - t0) * 1000, 1)
    logger.info(f"Semantic search '{query}' → {len(results)} results in {total_ms}ms (embed={embed_ms}ms search={search_ms}ms)")

    return {
        "query":              query,
        "expanded_query":     expanded,
        "results":            results,
        "total":              len(results),
        "query_embedding_ms": embed_ms,
        "search_ms":          search_ms,
        "total_ms":           total_ms,
    }
