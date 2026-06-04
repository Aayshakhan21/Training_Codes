package com.appverse.service.impl;

import com.appverse.client.AiServiceClient;
import com.appverse.dto.ai.AiServiceDTOs.*;
import com.appverse.entity.App;
import com.appverse.entity.AiAnalysisLog;
import com.appverse.entity.Review;
import com.appverse.entity.User;
import com.appverse.exception.AiServiceException;
import com.appverse.exception.ResourceNotFoundException;
import com.appverse.repository.AiAnalysisLogRepository;
import com.appverse.repository.AppRepository;
import com.appverse.repository.ReviewRepository;
import com.appverse.repository.UserRepository;
import com.appverse.dto.ai.AiServiceDTOs.RecommendationResponse;
import com.appverse.dto.ai.AiServiceDTOs.SimilarAppsResponse;
import com.appverse.dto.ai.AiServiceDTOs.TrendingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiInsightsService {

    private final RecommendationService recommendationService;
    private final SentimentAnalysisService sentimentAnalysisService;
    private final AiServiceClient aiServiceClient;
    private final AppRepository appRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AiAnalysisLogRepository aiAnalysisLogRepository;

    public ReviewAnalysisResponse analyzeReview(String review, Integer rating) {
        SentimentAnalysisService.SentimentResult result = sentimentAnalysisService.analyse(review, rating);
        ReviewAnalysisResponse response = new ReviewAnalysisResponse(
                result.sentiment().name(),
                result.confidence(),
                result.predictedRating(),
                result.isFake(),
                result.trustScore(),
                result.moderationReason() != null ? result.moderationReason() : "Review analyzed successfully.",
                List.of(),
                List.of()
        );
        aiAnalysisLogRepository.save(AiAnalysisLog.builder()
                .userId(currentUserId())
                .endpoint("/api/ai/analyze-review")
                .requestSummary("rating=" + rating + ", reviewLength=" + (review != null ? review.length() : 0))
                .responseSummary(response.getSentiment() + ", trust=" + response.getTrustScore())
                .status("SUCCESS")
                .build());
        return response;
    }

    public List<App> personalizedRecommendations(int limit) {
        return recommendationService.getPersonalizedRecommendations(currentUser().getId(), limit);
    }

    public List<App> personalizedRecommendations(Long userId, int limit) {
        return recommendationService.getPersonalizedRecommendations(userId, limit);
    }

    public RecommendationResponse recommendations(int limit) {
        return recommendationService.recommendWithReasons(currentUser().getId(), limit);
    }

    public List<App> similarApps(Long appId, int limit) {
        return recommendationService.getSimilarApps(appId, limit);
    }

    public SimilarAppsResponse similarAppsWithReasons(Long appId, int limit) {
        return recommendationService.similarWithReasons(appId, limit);
    }

    public List<App> trendingApps(int limit) {
        return recommendationService.getTrendingApps(limit);
    }

    public TrendingResponse trendingWithReasons(int limit) {
        return recommendationService.trendingWithReasons(limit);
    }

    public ChatResponse chat(String message, Map<String, Object> context) {
        User user = currentUser();
        List<App> recentApps = appRepository.findTrendingApps(PageRequest.of(0, 10));
        List<Review> recentReviews = reviewRepository.findByUserId(user.getId());

        Map<String, Object> payloadContext = new LinkedHashMap<>();
        payloadContext.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().name()
        ));
        payloadContext.put("message", message);
        payloadContext.put("requestContext", context != null ? context : Map.of());
        payloadContext.put("recentApps", recentApps.stream().map(this::toAppFeature).toList());
        payloadContext.put("recentReviews", recentReviews.stream().limit(10).map(this::toReviewMap).toList());

        ChatResponse response;
        try {
            response = aiServiceClient.chat(new ChatRequest(message, payloadContext));
        } catch (AiServiceException ex) {
            response = buildLocalChatResponse(message, payloadContext, recentApps);
        }
        aiAnalysisLogRepository.save(AiAnalysisLog.builder()
                .userId(user.getId())
                .endpoint("/api/ai/chat")
                .requestSummary("messageLength=" + (message != null ? message.length() : 0))
                .responseSummary(response.getAnswer())
                .status("SUCCESS")
                .build());
        return response;
    }

    public ReviewSummaryResponse reviewSummary(Long appId) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));
        List<Map<String, Object>> reviews = reviewRepository.findByAppId(appId, PageRequest.of(0, 100))
                .getContent()
                .stream()
                .map(this::toReviewMap)
                .toList();

        ReviewSummaryResponse response;
        try {
            response = aiServiceClient.reviewSummary(new ReviewSummaryRequest(app.getId(), app.getName(), reviews));
        } catch (AiServiceException ex) {
            response = buildLocalReviewSummaryResponse(app, reviews);
        }
        aiAnalysisLogRepository.save(AiAnalysisLog.builder()
                .appId(app.getId())
                .endpoint("/api/ai/review-summary")
                .requestSummary("reviewCount=" + reviews.size())
                .responseSummary(response.getSummary())
                .status("SUCCESS")
                .build());
        return response;
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));
    }

    private Long currentUserId() {
        return currentUser().getId();
    }

    private AppFeature toAppFeature(App app) {
        return AppFeature.builder()
                .id(app.getId())
                .name(app.getName())
                .description(app.getDescription() != null ? app.getDescription() : "")
                .category(app.getCategory() != null ? app.getCategory().getName() : "")
                .tags(List.of())
                .averageRating(app.getAvgRating() != null ? app.getAvgRating() : BigDecimal.ZERO)
                .downloadCount(app.getDownloadCount() != null ? app.getDownloadCount() : 0)
                .trendingScore(app.getTrendingScore() != null ? app.getTrendingScore() : BigDecimal.ZERO)
                .reviewCount(app.getReviewCount() != null ? app.getReviewCount() : 0)
                .build();
    }

    private Map<String, Object> toReviewMap(Review review) {
        Map<String, Object> reviewMap = new LinkedHashMap<>();
        reviewMap.put("id", review.getId());
        reviewMap.put("rating", review.getRating());
        reviewMap.put("title", review.getTitle());
        reviewMap.put("content", review.getContent());
        reviewMap.put("sentiment", review.getSentiment() != null ? review.getSentiment().name() : "NEUTRAL");
        reviewMap.put("trustScore", review.getTrustScore());
        reviewMap.put("predictedRating", review.getPredictedRating());
        reviewMap.put("isFake", review.getIsFake());
        reviewMap.put("moderationReason", review.getModerationReason());
        return reviewMap;
    }

    private ChatResponse buildLocalChatResponse(String message, Map<String, Object> context, List<App> recentApps) {
        String msg = message != null ? message.toLowerCase() : "";
        String answer;
        List<Long> suggestedIds = recentApps.stream()
                .limit(3)
                .map(App::getId)
                .filter(java.util.Objects::nonNull)
                .toList();

        if (msg.contains("recommend")) {
            answer = "I can help with recommendations using your downloads, ratings, and app interests.";
        } else if (msg.contains("trend")) {
            answer = "Trending apps are ranked from downloads, ratings, reviews, and growth signals.";
        } else if (msg.contains("similar")) {
            answer = "Similar apps are selected from the marketplace using category and tag overlap.";
        } else if (msg.contains("review")) {
            answer = "Review analysis uses the review text, trust score, and moderation signals.";
        } else if (context != null && context.get("appName") != null) {
            answer = "You are asking about " + context.get("appName") + ". I can explain similar apps, ratings, and reviews.";
        } else {
            answer = "I can help with app recommendations, categories, ratings, reviews, and trending apps.";
        }

        return new ChatResponse(answer, suggestedIds);
    }

    private ReviewSummaryResponse buildLocalReviewSummaryResponse(App app, List<Map<String, Object>> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return new ReviewSummaryResponse(
                    "No reviews are available for " + app.getName() + " yet.",
                    List.of(),
                    List.of(),
                    "NEUTRAL"
            );
        }

        long positive = reviews.stream()
                .filter(review -> "POSITIVE".equalsIgnoreCase(String.valueOf(review.get("sentiment"))))
                .count();
        long negative = reviews.stream()
                .filter(review -> "NEGATIVE".equalsIgnoreCase(String.valueOf(review.get("sentiment"))))
                .count();
        long neutral = Math.max(0, reviews.size() - positive - negative);

        List<String> positiveHighlights = reviews.stream()
                .map(review -> String.valueOf(review.get("content") != null ? review.get("content") : review.get("title")))
                .filter(value -> value != null && !value.isBlank())
                .filter(value -> containsAny(value.toLowerCase(), List.of("good", "great", "love", "easy", "fast", "helpful")))
                .limit(3)
                .toList();

        List<String> negativeHighlights = reviews.stream()
                .map(review -> String.valueOf(review.get("content") != null ? review.get("content") : review.get("title")))
                .filter(value -> value != null && !value.isBlank())
                .filter(value -> containsAny(value.toLowerCase(), List.of("bad", "slow", "bug", "crash", "poor", "worst")))
                .limit(3)
                .toList();

        String tone = positive >= negative ? "positive" : "negative";
        String summary = "This app has " + reviews.size() + " review(s). "
                + "The overall tone is " + tone + " with " + positive + " positive, "
                + negative + " negative, and " + neutral + " neutral reviews. "
                + "Users most often mention app quality, reliability, and ease of use.";

        return new ReviewSummaryResponse(
                summary,
                positiveHighlights,
                negativeHighlights,
                positive >= negative ? "POSITIVE" : "NEGATIVE"
        );
    }

    private boolean containsAny(String value, List<String> needles) {
        return needles.stream().anyMatch(value::contains);
    }
}
