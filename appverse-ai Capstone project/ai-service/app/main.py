import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.ai_controller import router as ai_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)

app = FastAPI(title="AppVerse AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router, prefix="/api/ai")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
async def startup_event() -> None:
    import os
    logger = logging.getLogger("app.startup")
    api_key = os.getenv("GEMINI_API_KEY", "")
    model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    if api_key and api_key != "YOUR_GEMINI_API_KEY_HERE":
        logger.info("AppVerse AI Service started — Gemini ENABLED (model=%s)", model)
    else:
        logger.warning(
            "AppVerse AI Service started — Gemini DISABLED "
            "(GEMINI_API_KEY not set). All endpoints will use local fallback logic."
        )
