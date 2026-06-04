from typing import Any, Dict

from fastapi import APIRouter, Body, HTTPException

from app.services.ai_service import AiService

router = APIRouter()
service = AiService()


def wrap(data: Any) -> Dict[str, Any]:
    return {"success": True, "message": "Success", "data": data}


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/analyze-review")
def analyze_review(payload: Dict[str, Any] = Body(default_factory=dict)):
    try:
        return wrap(service.analyze_review(payload))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.post("/recommendations")
def recommendations(payload: Dict[str, Any] = Body(default_factory=dict)):
    try:
        return wrap(service.recommendations(payload))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.post("/similar-apps")
def similar_apps(payload: Dict[str, Any] = Body(default_factory=dict)):
    try:
        return wrap(service.similar_apps(payload))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.post("/trending")
def trending(payload: Dict[str, Any] = Body(default_factory=dict)):
    try:
        return wrap(service.trending(payload))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.post("/chat")
def chat(payload: Dict[str, Any] = Body(default_factory=dict)):
    try:
        return wrap(service.chat(payload))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.post("/review-summary")
def review_summary(payload: Dict[str, Any] = Body(default_factory=dict)):
    try:
        return wrap(service.review_summary(payload))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc))
