import os
from fastapi import APIRouter, HTTPException, Header
from app.models.schemas import SemanticSearchRequest, SemanticSearchResponse, SemanticSearchResult
from app.services.semanticSearchService import run_semantic_search

router  = APIRouter(prefix="/search", tags=["Search"])
API_KEY = os.getenv("AI_SERVICE_API_KEY", "")

def _verify(key: str):
    if API_KEY and key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

@router.post("/semantic", response_model=SemanticSearchResponse)
async def semantic_search(req: SemanticSearchRequest, x_api_key: str = Header(None)):
    _verify(x_api_key)
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="query cannot be empty")

    result = run_semantic_search(
        query=req.query,
        recruiter_id=req.recruiter_id,
        top_k=req.top_k,
        score_threshold=req.score_threshold,
        filters=req.filters,
    )

    return SemanticSearchResponse(
        query=result["query"],
        results=[SemanticSearchResult(**r) for r in result["results"]],
        total=result["total"],
        query_embedding_ms=result["query_embedding_ms"],
        search_ms=result["search_ms"],
    )
