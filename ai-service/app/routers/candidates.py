import os
from fastapi import APIRouter, HTTPException, Header
from app.models.schemas import (
    CandidateIndexRequest, CandidateIndexResponse,
    BulkIndexRequest, BulkIndexResponse,
    DeleteCandidateRequest,
)
from app.services.embeddingService import embed_text, build_candidate_text
from app.services.vectorService import index_candidate, bulk_index_candidates, delete_candidate

router  = APIRouter(prefix="/candidates", tags=["Candidates"])
API_KEY = os.getenv("AI_SERVICE_API_KEY", "")

def _verify(key: str):
    if API_KEY and key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

@router.post("/index", response_model=CandidateIndexResponse)
async def index_one(req: CandidateIndexRequest, x_api_key: str = Header(None)):
    _verify(x_api_key)
    text      = build_candidate_text(req.dict())
    embedding = embed_text(text)
    vector_id = index_candidate(req.candidate_id, embedding, req.dict())
    return CandidateIndexResponse(
        success=True, candidate_id=req.candidate_id,
        vector_id=vector_id, message="Indexed successfully",
    )

@router.post("/bulk-index", response_model=BulkIndexResponse)
async def bulk_index(req: BulkIndexRequest, x_api_key: str = Header(None)):
    _verify(x_api_key)
    if not req.candidates:
        raise HTTPException(status_code=400, detail="candidates list is empty")
    if len(req.candidates) > 1000:
        raise HTTPException(status_code=400, detail="Max 1000 candidates per bulk request")

    texts = [build_candidate_text(c.dict()) for c in req.candidates]
    from app.services.embeddingService import embed_batch
    embeddings = embed_batch(texts)

    items = [
        {"candidate_id": c.candidate_id, "embedding": embeddings[i], "payload": c.dict()}
        for i, c in enumerate(req.candidates)
    ]
    stats = bulk_index_candidates(items)
    return BulkIndexResponse(success=True, indexed=stats["indexed"], failed=stats["failed"])

@router.delete("/delete")
async def delete_one(req: DeleteCandidateRequest, x_api_key: str = Header(None)):
    _verify(x_api_key)
    ok = delete_candidate(req.candidate_id)
    return {"success": ok, "candidate_id": req.candidate_id}
