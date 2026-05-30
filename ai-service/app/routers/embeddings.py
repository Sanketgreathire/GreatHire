import os
from fastapi import APIRouter, HTTPException, Header
from app.models.schemas import (
    EmbedTextRequest, EmbedResponse,
    EmbedBatchRequest, EmbedBatchResponse,
)
from app.services.embeddingService import embed_text, embed_batch, MODEL_NAME, DIMENSION

router = APIRouter(prefix="/embed", tags=["Embeddings"])
API_KEY = os.getenv("AI_SERVICE_API_KEY", "")

def _verify(key: str):
    if API_KEY and key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

@router.post("", response_model=EmbedResponse)
async def embed_single(req: EmbedTextRequest, x_api_key: str = Header(None)):
    _verify(x_api_key)
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text cannot be empty")
    return EmbedResponse(embedding=embed_text(req.text, req.normalize), dimension=DIMENSION, model=MODEL_NAME)

@router.post("/batch", response_model=EmbedBatchResponse)
async def embed_batch_ep(req: EmbedBatchRequest, x_api_key: str = Header(None)):
    _verify(x_api_key)
    if not req.texts:
        raise HTTPException(status_code=400, detail="texts list is empty")
    if len(req.texts) > 500:
        raise HTTPException(status_code=400, detail="Max 500 texts per batch")
    embs = embed_batch(req.texts, req.normalize)
    return EmbedBatchResponse(embeddings=embs, dimension=DIMENSION, model=MODEL_NAME, count=len(embs))
