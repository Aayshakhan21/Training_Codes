import json
import logging
import re
from typing import Any, Dict, List, Optional

from app.prompts.templates import (
    chat_prompt,
    recommendation_prompt,
    review_analysis_prompt,
    review_summary_prompt,
    similar_apps_prompt,
    trending_prompt,
)
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)


class AiService:
    POSITIVE_WORDS = {
        "excellent", "amazing", "awesome", "great", "fantastic", "love", "perfect",
        "wonderful", "outstanding", "superb", "brilliant", "recommend", "helpful",
        "easy", "fast", "intuitive", "smooth", "powerful", "useful", "best",
        "good", "nice", "clean", "responsive", "reliable", "stable", "impressive",
        "enjoy", "liked", "like", "helpful",
    }
    NEGATIVE_WORDS = {
        "terrible", "awful", "horrible", "worst", "bad", "poor", "disappointing",
        "broken", "crash", "crashes", "crashed", "freeze", "freezes", "frozen",
        "bug", "bugs", "error", "slow", "lag", "laggy", "useless", "trash", "garbage",
        "waste", "frustrating", "annoying", "fails", "failed", "failure", "hate",
        "scam", "fraud", "fake", "avoid", "uninstall", "refund", "regret", "memory",
        "leak",
    }
    SPAM_PHRASES = {
        "referral code", "earn rewards", "click the link", "click the link below",
        "buy now", "limited offer", "free bonus", "subscribe now", "promo code",
    }

    def __init__(self) -> None:
        self.gemini = GeminiService()

    # ─── Public API ──────────────────────────────────────────────────────────

    def analyze_review(self, payload: Any) -> Dict[str, Any]:
        review, rating = self._extract_review_and_rating(payload)
        prompt = review_analysis_prompt(review, rating)
        gemini = self._try_gemini_json(prompt)
        if gemini:
            normalized = self._normalize_review_analysis(gemini, review, rating)
            if normalized:
                logger.debug("analyze_review: Gemini result used.")
                return normalized
        logger.debug("analyze_review: using local fallback.")
        return self._local_review_analysis(review, rating)

    def recommendations(self, payload: Any) -> Dict[str, Any]:
        data = self._to_dict(payload)
        prompt = recommendation_prompt(data)
        gemini = self._try_gemini_json(prompt)
        if isinstance(gemini, list):
            return {"recommendations": gemini}
        if isinstance(gemini, dict):
            items = gemini.get("recommendations") or gemini.get("items") or gemini.get("data")
            if isinstance(items, list):
                return {"recommendations": items}
        logger.debug("recommendations: using local fallback.")
        return {"recommendations": self._local_recommendations(data)}

    def similar_apps(self, payload: Any) -> Dict[str, Any]:
        data = self._to_dict(payload)
        prompt = similar_apps_prompt(data)
        gemini = self._try_gemini_json(prompt)
        if isinstance(gemini, list):
            return {"similarApps": gemini}
        if isinstance(gemini, dict):
            items = gemini.get("similarApps") or gemini.get("items") or gemini.get("data")
            if isinstance(items, list):
                return {"similarApps": items}
        logger.debug("similar_apps: using local fallback.")
        return {"similarApps": self._local_similar_apps(data)}

    def trending(self, payload: Any) -> Dict[str, Any]:
        data = self._to_dict(payload)
        prompt = trending_prompt(data)
        gemini = self._try_gemini_json(prompt)
        if isinstance(gemini, list):
            return {"trendingApps": gemini, "trendingCategories": []}
        if isinstance(gemini, dict):
            items = gemini.get("trendingApps") or gemini.get("trending") or gemini.get("items") or gemini.get("data")
            if isinstance(items, list):
                return {
                    "trendingApps": items,
                    "trendingCategories": gemini.get("trendingCategories") or [],
                }
        logger.debug("trending: using local fallback.")
        return {"trendingApps": self._local_trending(data), "trendingCategories": []}

    def chat(self, payload: Any) -> Dict[str, Any]:
        data = self._to_dict(payload)
        message = str(data.get("message") or "")
        context = self._safe_dict(data.get("context") or {})
        prompt = chat_prompt({"message": message, "context": context})
        # Chat can return plain text or JSON; try JSON first then text
        gemini_json = self._try_gemini_json(prompt)
        if isinstance(gemini_json, dict):
            answer = gemini_json.get("answer") or gemini_json.get("response") or gemini_json.get("text")
            if answer:
                return {"answer": str(answer).strip(), "suggestedAppIds": gemini_json.get("suggestedAppIds") or []}
        text = self._try_gemini_text(prompt)
        if text:
            return {"answer": text.strip(), "suggestedAppIds": []}
        logger.debug("chat: using local fallback.")
        return {"answer": self._local_chat_answer(message, context), "suggestedAppIds": []}

    def review_summary(self, payload: Any) -> Dict[str, Any]:
        data = self._to_dict(payload)
        prompt = review_summary_prompt(data)
        gemini = self._try_gemini_json(prompt)
        if isinstance(gemini, dict):
            summary = gemini.get("summary")
            if summary:
                return {
                    "summary": str(summary).strip(),
                    "positiveHighlights": self._ensure_list(gemini.get("positiveHighlights")),
                    "negativeHighlights": self._ensure_list(gemini.get("negativeHighlights")),
                    "overallSentiment": str(gemini.get("overallSentiment") or "NEUTRAL").upper(),
                }
        text = self._try_gemini_text(prompt)
        if text:
            return {
                "summary": text.strip(),
                "positiveHighlights": [],
                "negativeHighlights": [],
                "overallSentiment": "NEUTRAL",
            }
        logger.debug("review_summary: using local fallback.")
        return {
            "summary": self._local_review_summary(data),
            "positiveHighlights": [],
            "negativeHighlights": [],
            "overallSentiment": "NEUTRAL",
        }

    # ─── Gemini helpers ───────────────────────────────────────────────────────

    def _try_gemini_json(self, prompt: str) -> Optional[Any]:
        try:
            return self.gemini.generate_json(prompt)
        except Exception as exc:
            logger.warning("Gemini JSON call failed: %s", exc)
            return None

    def _try_gemini_text(self, prompt: str) -> Optional[str]:
        try:
            return self.gemini.generate_text(prompt)
        except Exception as exc:
            logger.warning("Gemini text call failed: %s", exc)
            return None

    # ─── Local fallback implementations ──────────────────────────────────────

    def _local_review_analysis(self, review: str, rating: Optional[int]) -> Dict[str, Any]:
        text = self._normalize_text(review)
        positive_hits, negative_hits, spam_hits = self._count_signals(text)
        text_score = self._text_score(positive_hits, negative_hits)
        rating_score = self._rating_score(rating)

        combined = (text_score * 0.9) + (rating_score * 0.1)
        if negative_hits >= positive_hits + 1:
            sentiment = "NEGATIVE"
        elif positive_hits >= negative_hits + 2:
            sentiment = "POSITIVE"
        elif combined >= 0.62:
            sentiment = "POSITIVE"
        elif combined <= 0.38:
            sentiment = "NEGATIVE"
        else:
            sentiment = "NEUTRAL"

        trust = self._trust_score(text, spam_hits, positive_hits, negative_hits)
        fake = spam_hits >= 2 or trust < 0.4
        predicted = 5 if sentiment == "POSITIVE" else 1 if sentiment == "NEGATIVE" else 3
        confidence = self._confidence(positive_hits, negative_hits, trust)

        if fake:
            reason = "Spam-like or promotional language detected."
        elif sentiment == "NEGATIVE":
            reason = "Review text shows strong negative feedback."
        elif sentiment == "POSITIVE":
            reason = "Review text shows strong positive feedback."
        else:
            reason = "Review text appears mixed or balanced."

        return {
            "sentiment": sentiment,
            "confidence": round(confidence, 4),
            "predictedRating": predicted,
            "fakeReview": fake,
            "trustScore": round(trust, 4),
            "moderationReason": reason,
            "positiveSignals": self._signals(text, self.POSITIVE_WORDS),
            "negativeSignals": self._signals(text, self.NEGATIVE_WORDS),
        }

    def _local_recommendations(self, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        apps = self._ensure_list(payload.get("availableApps") or payload.get("apps") or [])
        downloads = self._ensure_list(payload.get("downloadHistory") or payload.get("userHistory") or [])
        ratings = self._ensure_list(payload.get("ratings") or [])
        categories = self._derive_categories(downloads, ratings, apps)

        ranked: List[Dict[str, Any]] = []
        for app in apps:
            if not isinstance(app, dict):
                continue
            score = 0.45
            reasons = []
            app_id = app.get("appId") or app.get("id")
            name = str(app.get("name") or app.get("appName") or "")
            category = str(app.get("category") or "").lower()
            if category and category in categories:
                score += 0.3
                reasons.append(f"Matches your interest in {category} apps.")
            if self._matches_history(name, downloads):
                score += 0.15
                reasons.append("Similar to apps you already use.")
            if any(
                (r.get("rating") or 0) >= 4 and self._same_app(r, app_id, name)
                for r in ratings if isinstance(r, dict)
            ):
                score += 0.1
                reasons.append("You rated related apps highly.")
            ranked.append({
                "appId": app_id,
                "reason": " ".join(reasons) or "Based on your usage and marketplace activity.",
                "score": round(min(score, 0.99), 4),
            })

        ranked.sort(key=lambda item: item.get("score", 0), reverse=True)
        return ranked[:10]

    def _local_similar_apps(self, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        apps = self._ensure_list(payload.get("availableApps") or [])
        app_name = str(payload.get("appName") or payload.get("name") or "").lower()
        category = str(payload.get("category") or "").lower()
        current_app = payload.get("currentApp")
        if isinstance(current_app, dict):
            app_name = app_name or str(current_app.get("name") or "").lower()
            category = category or str(current_app.get("category") or "").lower()
            apps = apps or self._ensure_list(current_app.get("availableApps") or [])
        tags = {str(tag).lower() for tag in self._ensure_list(payload.get("tags") or [])}

        ranked: List[Dict[str, Any]] = []
        for app in apps:
            if not isinstance(app, dict):
                continue
            candidate_name = str(app.get("name") or "").lower()
            candidate_category = str(app.get("category") or "").lower()
            candidate_tags = {str(tag).lower() for tag in self._ensure_list(app.get("tags") or [])}
            overlap = len(tags.intersection(candidate_tags))
            score = 0.4
            if category and candidate_category == category:
                score += 0.35
            if app_name and candidate_name and app_name != candidate_name and self._same_stem(app_name, candidate_name):
                score += 0.15
            score += min(overlap * 0.05, 0.15)
            ranked.append({
                "appId": app.get("appId") or app.get("id"),
                "reason": self._similarity_reason(category, candidate_category, overlap),
                "score": round(min(score, 0.99), 4),
            })
        ranked.sort(key=lambda item: item.get("score", 0), reverse=True)
        return ranked[:6]

    def _local_trending(self, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        apps = self._ensure_list(payload.get("apps") or payload.get("availableApps") or [])
        ranked: List[Dict[str, Any]] = []
        for app in apps:
            if not isinstance(app, dict):
                continue
            # Support both flat structure and nested app feature
            app_data = app.get("app") if isinstance(app.get("app"), dict) else app
            downloads = self._num(app_data.get("downloads") or app_data.get("downloadCount"))
            ratings = self._num(app_data.get("avgRating") or app_data.get("averageRating") or app_data.get("rating"))
            reviews = self._num(app_data.get("reviewCount") or len(self._ensure_list(app_data.get("reviews") or [])))
            growth = self._num(app_data.get("growthRate") or app_data.get("trendingScore") or app.get("ratingVelocity"))
            trend = round(
                min(1.0, (downloads / 1000.0) * 0.35 + (ratings / 5.0) * 0.25 + (reviews / 100.0) * 0.2 + growth * 0.2),
                4,
            )
            ranked.append({
                "appId": app_data.get("appId") or app_data.get("id"),
                "trendScore": trend,
                "reason": "Strong engagement and review activity." if trend >= 0.7 else "Growing usage and review signals.",
            })
        ranked.sort(key=lambda item: item.get("trendScore", 0), reverse=True)
        return ranked[:10]

    def _local_chat_answer(self, message: str, context: Dict[str, Any]) -> str:
        msg = message.lower()
        if "recommend" in msg:
            return "I can help with recommendations using your downloads, ratings, and app interests."
        if "trend" in msg:
            return "Trending apps are ranked from downloads, ratings, reviews, and growth signals."
        if "similar" in msg:
            return "Similar apps are selected from the marketplace using category and tag overlap."
        if "review" in msg:
            return "Review analysis uses the review text, trust score, and moderation signals."
        if context.get("appName"):
            return f"You are asking about {context.get('appName')}. I can explain similar apps, ratings, and reviews."
        return "I can help with app recommendations, categories, ratings, reviews, and trending apps."

    def _local_review_summary(self, payload: Dict[str, Any]) -> str:
        reviews = self._ensure_list(payload.get("reviews") or [])
        if not reviews:
            return "No reviews are available for this app yet."
        positive = sum(1 for r in reviews if str(r.get("sentiment") or "").upper() == "POSITIVE")
        negative = sum(1 for r in reviews if str(r.get("sentiment") or "").upper() == "NEGATIVE")
        neutral = max(0, len(reviews) - positive - negative)
        tone = "positive" if positive >= negative else "negative"
        return (
            f"This app has {len(reviews)} review(s). "
            f"The overall tone is {tone} with {positive} positive, {negative} negative, and {neutral} neutral reviews. "
            "Users most often mention app quality, reliability, and ease of use."
        )

    # ─── Review normalization ─────────────────────────────────────────────────

    def _normalize_review_analysis(self, data: Dict[str, Any], review: str, rating: Optional[int]) -> Optional[Dict[str, Any]]:
        result = dict(data or {})
        sentiment = str(result.get("sentiment") or result.get("label") or "NEUTRAL").upper()
        if sentiment not in {"POSITIVE", "NEGATIVE", "NEUTRAL"}:
            return None
        result["sentiment"] = sentiment
        result["confidence"] = self._num(result.get("confidence") or 0.8)
        result["predictedRating"] = int(
            result.get("predictedRating") or (5 if sentiment == "POSITIVE" else 1 if sentiment == "NEGATIVE" else 3)
        )
        result["fakeReview"] = bool(result.get("fakeReview", False))
        result["trustScore"] = self._num(result.get("trustScore") or 0.7)
        result["moderationReason"] = str(result.get("moderationReason") or "Review analyzed successfully.")
        result["positiveSignals"] = self._ensure_list(result.get("positiveSignals") or [])
        result["negativeSignals"] = self._ensure_list(result.get("negativeSignals") or [])
        return result

    def _extract_review_and_rating(self, payload: Any) -> tuple:
        data = self._to_dict(payload)
        review = str(data.get("review") or data.get("text") or "").strip()
        rating = data.get("rating")
        try:
            rating = int(rating) if rating is not None and str(rating).strip() != "" else None
        except Exception:
            rating = None
        return review, rating

    # ─── Signal counting ──────────────────────────────────────────────────────

    def _normalize_text(self, review: str) -> str:
        return re.sub(r"\s+", " ", (review or "").strip().lower())

    def _count_signals(self, text: str) -> tuple:
        tokens = re.findall(r"[a-z']+", text)
        positive_hits = 0
        negative_hits = 0
        spam_hits = 0
        for phrase in self.SPAM_PHRASES:
            if phrase in text:
                spam_hits += 1
        negative_phrases = (
            "do not work", "does not work", "did not work", "don't work", "doesn't work",
            "not work", "not working", "stopped working", "keeps freezing", "constantly freezes",
            "too much memory", "consumes too much memory", "won't load",
        )
        positive_phrases = (
            "highly recommended", "works great", "very helpful", "easy to use",
            "love this app", "fast and smooth", "really useful", "best app",
        )
        for phrase in negative_phrases:
            if phrase in text:
                negative_hits += 2
        for phrase in positive_phrases:
            if phrase in text:
                positive_hits += 2
        for token in tokens:
            if token in self.POSITIVE_WORDS:
                positive_hits += 1
            if token in self.NEGATIVE_WORDS:
                negative_hits += 1
        if any(word in text for word in ("referral", "promo", "earn rewards", "click the link")):
            spam_hits += 1
            negative_hits += 1
        return positive_hits, negative_hits, spam_hits

    def _text_score(self, positive_hits: int, negative_hits: int) -> float:
        total = positive_hits + negative_hits
        if total == 0:
            return 0.5
        return positive_hits / total

    def _rating_score(self, rating: Optional[int]) -> float:
        if rating is None:
            return 0.5
        try:
            rating = max(1, min(5, int(rating)))
        except Exception:
            return 0.5
        return (rating - 1) / 4.0

    def _trust_score(self, text: str, spam_hits: int, positive_hits: int, negative_hits: int) -> float:
        trust = 0.72
        if len(text.split()) < 6:
            trust -= 0.12
        if re.search(r"\b[A-Z]{5,}\b", text.upper()):
            trust -= 0.08
        if re.search(r"(.)\1{4,}", text):
            trust -= 0.1
        if "http" in text or "www." in text:
            trust -= 0.15
        trust -= min(spam_hits * 0.08, 0.2)
        if abs(positive_hits - negative_hits) >= 3:
            trust += 0.05
        return max(0.05, min(0.95, trust))

    def _confidence(self, positive_hits: int, negative_hits: int, trust: float) -> float:
        text_signal = min(1.0, (positive_hits + negative_hits) / 5.0)
        return max(0.5, min(0.99, 0.55 + text_signal * 0.25 + (trust - 0.5) * 0.2))

    def _signals(self, text: str, vocab: set) -> List[str]:
        return sorted({word for word in re.findall(r"[a-z']+", text) if word in vocab})[:5]

    # ─── Utility helpers ──────────────────────────────────────────────────────

    def _derive_categories(self, downloads, ratings, apps) -> set:
        categories = []
        for item in downloads:
            if isinstance(item, dict) and item.get("category"):
                categories.append(str(item["category"]).lower())
        for item in ratings:
            if isinstance(item, dict) and item.get("category"):
                categories.append(str(item["category"]).lower())
        if not categories:
            for app in apps[:5]:
                if isinstance(app, dict) and app.get("category"):
                    categories.append(str(app["category"]).lower())
        return set(categories)

    def _matches_history(self, name: str, downloads) -> bool:
        name = name.lower()
        for item in downloads:
            if not isinstance(item, dict):
                continue
            candidate = str(item.get("name") or item.get("appName") or "").lower()
            if candidate and (candidate in name or name in candidate or self._same_stem(candidate, name)):
                return True
        return False

    def _same_app(self, item: dict, app_id: Any, name: str) -> bool:
        if item.get("appId") is not None and app_id is not None and str(item.get("appId")) == str(app_id):
            return True
        candidate = str(item.get("appName") or item.get("name") or "").lower()
        return bool(candidate and candidate == name.lower())

    def _same_stem(self, left: str, right: str) -> bool:
        left = re.sub(r"[^a-z]", "", left.lower())
        right = re.sub(r"[^a-z]", "", right.lower())
        return bool(left and right and (left in right or right in left))

    def _similarity_reason(self, category: str, candidate_category: str, overlap: int) -> str:
        parts = []
        if category and candidate_category and category == candidate_category:
            parts.append(f"Same {category} category.")
        if overlap:
            parts.append("Shared tags with the current app.")
        return " ".join(parts) or "Similar catalog profile."

    def _safe_json(self, value: Any, limit: int = 5000) -> str:
        try:
            return json.dumps(value, default=str, ensure_ascii=False)[:limit]
        except Exception:
            return str(value)[:limit]

    def _to_dict(self, payload: Any) -> Dict[str, Any]:
        if isinstance(payload, dict):
            return payload
        if hasattr(payload, "model_dump"):
            return dict(payload.model_dump())
        if hasattr(payload, "__dict__"):
            return dict(payload.__dict__)
        return {}

    def _safe_dict(self, payload: Any) -> Dict[str, Any]:
        return self._to_dict(payload)

    def _ensure_list(self, value: Any) -> List[Any]:
        return value if isinstance(value, list) else []

    def _num(self, value: Any) -> float:
        try:
            return float(value or 0)
        except Exception:
            return 0.0
