package com.appverse.dto.ai;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public final class AiServiceDTOs {

    private AiServiceDTOs() {}

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AppFeature {
        private Long id;
        private String name;
        private String description;
        private String category;
        private List<String> tags;
        @JsonProperty("averageRating")
        private BigDecimal averageRating;
        @JsonProperty("downloadCount")
        private Integer downloadCount;
        @JsonProperty("trendingScore")
        private BigDecimal trendingScore;
        @JsonProperty("reviewCount")
        private Integer reviewCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserHistoryItem {
        @JsonProperty("appId")
        private Long appId;
        private String category;
        private Double rating;
        private Boolean downloaded;
        @JsonProperty("reviewText")
        private String reviewText;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendationRequest {
        @JsonProperty("userId")
        private Long userId;
        @JsonProperty("userHistory")
        private List<UserHistoryItem> userHistory;
        @JsonProperty("favoriteCategories")
        private List<String> favoriteCategories;
        @JsonProperty("availableApps")
        private List<AppFeature> availableApps;
        private Integer limit;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendationItem {
        @JsonProperty("appId")
        private Long appId;
        private String reason;
        private BigDecimal score;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendationResponse {
        private List<RecommendationItem> recommendations;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimilarAppsRequest {
        @JsonProperty("currentApp")
        private AppFeature currentApp;
        @JsonProperty("availableApps")
        private List<AppFeature> availableApps;
        private Integer limit;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimilarAppItem {
        @JsonProperty("appId")
        private Long appId;
        private String reason;
        private BigDecimal score;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SimilarAppsResponse {
        @JsonProperty("similarApps")
        private List<SimilarAppItem> similarApps;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendingItem {
        private AppFeature app;
        @JsonProperty("dailyDownloads")
        private Integer dailyDownloads;
        @JsonProperty("weeklyDownloads")
        private Integer weeklyDownloads;
        @JsonProperty("monthlyDownloads")
        private Integer monthlyDownloads;
        @JsonProperty("yearlyDownloads")
        private Integer yearlyDownloads;
        @JsonProperty("ratingVelocity")
        private BigDecimal ratingVelocity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendingCategoryItem {
        private String category;
        private BigDecimal score;
        private String reason;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendingRequest {
        private List<TrendingItem> apps;
        private Integer limit;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendingResponse {
        @JsonProperty("trendingApps")
        private List<Map<String, Object>> trendingApps;
        @JsonProperty("trendingCategories")
        private List<TrendingCategoryItem> trendingCategories;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewAnalysisRequest {
        private String review;
        private Integer rating;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewAnalysisResponse {
        private String sentiment;
        private BigDecimal confidence;
        @JsonAlias("predictedRating")
        private Integer predictedRating;
        @JsonAlias("fakeReview")
        private Boolean fakeReview;
        @JsonAlias("trustScore")
        private BigDecimal trustScore;
        @JsonAlias("moderationReason")
        private String moderationReason;
        @JsonAlias("positiveSignals")
        private List<String> positiveSignals;
        @JsonAlias("negativeSignals")
        private List<String> negativeSignals;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatRequest {
        private String message;
        private Map<String, Object> context;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatResponse {
        private String answer;
        @JsonProperty("suggestedAppIds")
        private List<Long> suggestedAppIds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewSummaryRequest {
        @JsonProperty("appId")
        private Long appId;
        @JsonProperty("appName")
        private String appName;
        private List<Map<String, Object>> reviews;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewSummaryResponse {
        private String summary;
        @JsonProperty("positiveHighlights")
        private List<String> positiveHighlights;
        @JsonProperty("negativeHighlights")
        private List<String> negativeHighlights;
        @JsonProperty("overallSentiment")
        private String overallSentiment;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WrapperResponse<T> {
        private boolean success;
        private String message;
        private T data;
    }
}
