from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, ConfigDict


class AppFeature(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int | None = None
    name: str
    description: str = ""
    category: str = ""
    tags: list[str] = Field(default_factory=list)
    average_rating: float = Field(default=0.0, alias="averageRating")
    download_count: int = Field(default=0, alias="downloadCount")
    trending_score: float = Field(default=0.0, alias="trendingScore")
    review_count: int = Field(default=0, alias="reviewCount")


class UserHistoryItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    app_id: int | None = Field(default=None, alias="appId")
    category: str = ""
    rating: float | None = None
    downloaded: bool = False
    review_text: str | None = Field(default=None, alias="reviewText")


class RecommendationRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    user_id: int = Field(alias="userId")
    user_history: list[UserHistoryItem] = Field(default_factory=list, alias="userHistory")
    favorite_categories: list[str] = Field(default_factory=list, alias="favoriteCategories")
    available_apps: list[AppFeature] = Field(default_factory=list, alias="availableApps")
    limit: int = 10


class RecommendationItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    app_id: int = Field(alias="appId")
    reason: str
    score: float = 0.0


class RecommendationResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    recommendations: list[RecommendationItem] = Field(default_factory=list)


class SimilarAppsRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    current_app: AppFeature = Field(alias="currentApp")
    available_apps: list[AppFeature] = Field(default_factory=list, alias="availableApps")
    limit: int = 6


class SimilarAppItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    app_id: int = Field(alias="appId")
    reason: str
    score: float = 0.0


class SimilarAppsResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    similar_apps: list[SimilarAppItem] = Field(default_factory=list, alias="similarApps")


class TrendingAppItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    app: AppFeature
    daily_downloads: int = Field(default=0, alias="dailyDownloads")
    weekly_downloads: int = Field(default=0, alias="weeklyDownloads")
    monthly_downloads: int = Field(default=0, alias="monthlyDownloads")
    yearly_downloads: int = Field(default=0, alias="yearlyDownloads")
    rating_velocity: float = Field(default=0.0, alias="ratingVelocity")


class TrendingCategoryItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category: str
    score: float = 0.0
    reason: str


class TrendingRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    apps: list[TrendingAppItem] = Field(default_factory=list)
    limit: int = 10


class TrendingResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    trending_apps: list[dict[str, Any]] = Field(default_factory=list, alias="trendingApps")
    trending_categories: list[TrendingCategoryItem] = Field(default_factory=list, alias="trendingCategories")


class ReviewAnalysisRequest(BaseModel):
    review: str
    rating: int | None = None


class ReviewAnalysisResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    sentiment: Literal["POSITIVE", "NEGATIVE", "NEUTRAL"]
    confidence: float
    predicted_rating: int = Field(alias="predictedRating")
    fake_review: bool = Field(alias="fakeReview")
    trust_score: float = Field(alias="trustScore")
    moderation_reason: str = Field(alias="moderationReason")
    positive_signals: list[str] = Field(default_factory=list, alias="positiveSignals")
    negative_signals: list[str] = Field(default_factory=list, alias="negativeSignals")


class ChatRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    message: str
    context: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    answer: str
    suggested_app_ids: list[int] = Field(default_factory=list, alias="suggestedAppIds")


class ReviewSummaryRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    app_id: int = Field(alias="appId")
    app_name: str = Field(alias="appName")
    reviews: list[dict[str, Any]] = Field(default_factory=list)


class ReviewSummaryResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    summary: str
    positive_highlights: list[str] = Field(default_factory=list, alias="positiveHighlights")
    negative_highlights: list[str] = Field(default_factory=list, alias="negativeHighlights")
    overall_sentiment: Literal["POSITIVE", "NEGATIVE", "NEUTRAL"] = Field(alias="overallSentiment")


class ApiResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Any = None
