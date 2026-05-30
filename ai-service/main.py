"""
main.py — GreatHire AI Microservice
Provides: embeddings, vector indexing, semantic search
"""
import os
import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.embeddingService import load_model, MODEL_NAME, DIMENSION
from app.services.vectorService    import ensure_collection, get_collection_info, is_qdrant_connected
from app.routers                   import embeddings, candidates, search
from app.models.schemas            import HealthResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──────────────────────────────────────────────────────────
    logger.info("Starting GreatHire AI Service...")
    load_model()                  # load sentence-transformers model
    ensure_collection()           # create Qdrant collection if needed
    logger.info(f"AI Service ready — model={MODEL_NAME} dim={DIMENSION}")
    yield
    # ── Shutdown ─────────────────────────────────────────────────────────
    logger.info("AI Service shutting down.")


app = FastAPI(
    title="GreatHire AI Service",
    description="Semantic embeddings and vector search for candidate sourcing",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(embeddings.router)
app.include_router(candidates.router)
app.include_router(search.router)


@app.get("/health", response_model=HealthResponse)
async def health():
    info = get_collection_info()
    return HealthResponse(
        status="ok",
        model_loaded=True,
        qdrant_connected=is_qdrant_connected(),
        collection_exists=info["exists"],
        vector_count=info["vector_count"],
    )


@app.get("/")
async def root():
    return {"service": "GreatHire AI", "version": "1.0.0", "status": "running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("AI_SERVICE_HOST", "0.0.0.0"),
        port=int(os.getenv("AI_SERVICE_PORT", "8001")),
        reload=False,
        workers=1,
    )
