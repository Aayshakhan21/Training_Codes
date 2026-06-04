from __future__ import annotations

import json
from typing import Any


def _pretty(payload: Any) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2)


def review_analysis_prompt(review: str, rating: int | None) -> str:
    return f"""
You are the moderation and sentiment engine for AppVerse AI.
Analyze the review and return only valid JSON matching the schema.

Review text:
{review}

User rating:
{rating if rating is not None else "unknown"}

Rules:
- sentiment must be POSITIVE, NEGATIVE, or NEUTRAL
- confidence must be between 0 and 1
- predictedRating must be an integer from 1 to 5
- fakeReview must be a boolean
- trustScore must be between 0 and 1 where 1 means highly trustworthy
- moderationReason must be short, specific, and user-friendly
- include positiveSignals and negativeSignals as short arrays of strings

Return JSON only.
""".strip()


def recommendation_prompt(payload: dict[str, Any]) -> str:
    return f"""
You are the personalized recommendation engine for AppVerse AI.
Use only the provided marketplace data and return only valid JSON.

Input data:
{_pretty(payload)}

Rules:
- Rank apps by relevance for the user
- Return at most the requested limit
- Each item must include appId, reason, and score
- reason must explain why the app fits the user based on real patterns from the payload
- score must be between 0 and 1

Return JSON only.
""".strip()


def similar_apps_prompt(payload: dict[str, Any]) -> str:
    return f"""
You are the app similarity engine for AppVerse AI.
Use only the provided app metadata and return only valid JSON.

Input data:
{_pretty(payload)}

Rules:
- Return similar apps ordered from most similar to least similar
- Each item must include appId, reason, and score
- reason should mention shared category, tags, keywords, or audience
- score must be between 0 and 1

Return JSON only.
""".strip()


def trending_prompt(payload: dict[str, Any]) -> str:
    return f"""
You are the trend analysis engine for AppVerse AI.
Use only the provided marketplace data and return only valid JSON.

Input data:
{_pretty(payload)}

Rules:
- Return trending apps and trending categories
- Each item must include a score between 0 and 1
- Explain the growth drivers briefly and concretely

Return JSON only.
""".strip()


def chat_prompt(payload: dict[str, Any]) -> str:
    return f"""
You are AppVerse AI Assistant.
Answer the user's question using only the provided marketplace context.
If the context is not sufficient, say what data is missing and offer a helpful next step.
Return valid JSON only.

Input data:
{_pretty(payload)}

Rules:
- answer should be concise but useful
- if recommendations are requested, include appIds when relevant
- never invent apps, categories, or metrics that are not present in the context

Return JSON only.
""".strip()


def review_summary_prompt(payload: dict[str, Any]) -> str:
    return f"""
You are summarizing reviews for an app in AppVerse AI.
Use only the provided review data and return only valid JSON.

Input data:
{_pretty(payload)}

Rules:
- summary should be 3 to 5 sentences
- include positiveHighlights and negativeHighlights as short arrays
- overallSentiment must be POSITIVE, NEGATIVE, or NEUTRAL
- mention recurring themes, sentiment balance, and trust signals

Return JSON only.
""".strip()

