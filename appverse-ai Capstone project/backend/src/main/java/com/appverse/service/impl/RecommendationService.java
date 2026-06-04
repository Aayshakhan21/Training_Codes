package com.appverse.service.impl;

import com.appverse.client.AiServiceClient;
import com.appverse.dto.ai.AiServiceDTOs.*;
import com.appverse.entity.App;
import com.appverse.entity.Download;
import com.appverse.entity.Recommendation;
import com.appverse.entity.Review;
import com.appverse.entity.User;
import com.appverse.enums.AppStatus;
import com.appverse.exception.AiServiceException;
import com.appverse.exception.ResourceNotFoundException;
import com.appverse.repository.AppRepository;
import com.appverse.repository.DownloadRepository;
import com.appverse.repository.RecommendationRepository;
import com.appverse.repository.ReviewRepository;
import com.appverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final AppRepository appRepository;
    private final DownloadRepository downloadRepository;
    private final ReviewRepository reviewRepository;
    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;
    private final AiServiceClient aiServiceClient;

    @Transactional
    public List<App> getPersonalizedRecommendations(Long userId, int limit) {
        return resolveAppsByOrder(safeRecommendationResponse(userId, limit).getRecommendations().stream()
                .map(RecommendationItem::getAppId)
                .collect(Collectors.toList()));
    }

    @Transactional
    public RecommendationResponse recommendWithReasons(Long userId, int limit) {
        return safeRecommendationResponse(userId, limit);
    }

    private RecommendationResponse safeRecommendationResponse(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        List<App> candidates = loadApprovedApps(Math.max(limit * 5, 50));
        RecommendationRequest request = new RecommendationRequest(
                userId,
                buildUserHistory(userId),
                buildFavoriteCategories(userId),
                candidates.stream().map(this::toAiAppFeature).toList(),
                limit
        );

        RecommendationResponse response;
        try {
            response = aiServiceClient.recommendations(request);
        } catch (AiServiceException ex) {
            response = null;
        }
        if (response == null || response.getRecommendations() == null || response.getRecommendations().isEmpty()) {
            response = buildLocalRecommendationResponse(userId, limit, candidates);
        }
        persistRecommendations(user, response.getRecommendations());
        return response;
    }

    public List<App> getSimilarApps(Long appId, int limit) {
        return resolveAppsByOrder(similarWithReasons(appId, limit).getSimilarApps().stream()
                .map(SimilarAppItem::getAppId)
                .collect(Collectors.toList()));
    }

    public SimilarAppsResponse similarWithReasons(Long appId, int limit) {
        App currentApp = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));

        List<App> candidates = appRepository.findByCategoryIdAndStatus(
                        currentApp.getCategory().getId(),
                        AppStatus.APPROVED,
                        PageRequest.of(0, Math.max(limit * 5, 50))
                ).getContent()
                .stream()
                .filter(app -> !app.getId().equals(appId))
                .toList();

        SimilarAppsResponse response;
        try {
            response = aiServiceClient.similarApps(
                    new SimilarAppsRequest(
                            toAiAppFeature(currentApp),
                            candidates.stream().map(this::toAiAppFeature).toList(),
                            limit
                    )
            );
        } catch (AiServiceException ex) {
            response = null;
        }

        if (response == null || response.getSimilarApps() == null || response.getSimilarApps().isEmpty()) {
            response = buildLocalSimilarResponse(currentApp, candidates, limit);
        }
        return response;
    }

    public List<App> getTrendingApps(int limit) {
        return resolveAppsByOrder(trendingWithReasons(limit).getTrendingApps().stream()
                .map(this::extractTrendingAppId)
                .filter(java.util.Objects::nonNull)
                .toList());
    }

    public TrendingResponse trendingWithReasons(int limit) {
        return safeTrendingResponse(limit);
    }

    private TrendingResponse safeTrendingResponse(int limit) {
        List<App> candidates = loadApprovedApps(Math.max(limit * 5, 50));
        List<TrendingItem> payload = candidates.stream()
                .map(app -> new TrendingItem(
                        toAiAppFeature(app),
                        (int) countDownloadsSince(app.getId(), LocalDateTime.now().minusDays(1)),
                        (int) countDownloadsSince(app.getId(), LocalDateTime.now().minusDays(7)),
                        (int) countDownloadsSince(app.getId(), LocalDateTime.now().minusDays(30)),
                        (int) countDownloadsSince(app.getId(), LocalDateTime.now().minusDays(365)),
                        BigDecimal.valueOf(app.getAvgRating() != null ? app.getAvgRating().doubleValue() : 0.0)
                ))
                .toList();

        TrendingResponse response;
        try {
            response = aiServiceClient.trending(new TrendingRequest(payload, limit));
        } catch (AiServiceException ex) {
            response = null;
        }

        if (response == null || response.getTrendingApps() == null || response.getTrendingApps().isEmpty()) {
            response = buildLocalTrendingResponse(candidates, limit);
        } else {
            response = normalizeTrendingResponse(response);
        }
        return response;
    }

    private List<AppFeature> buildAppFeatures(List<App> apps) {
        return apps.stream().map(this::toAiAppFeature).toList();
    }

    private void persistRecommendations(User user, List<RecommendationItem> recommendations) {
        if (recommendations == null || recommendations.isEmpty()) {
            return;
        }
        recommendationRepository.saveAll(
                recommendations.stream()
                        .map(item -> appRepository.findById(item.getAppId())
                                .map(app -> Recommendation.builder()
                                        .user(user)
                                        .app(app)
                                        .reason(item.getReason())
                                        .score(item.getScore())
                                        .source("gemini")
                                        .build())
                                .orElse(null))
                        .filter(java.util.Objects::nonNull)
                        .toList()
        );
    }

    private List<UserHistoryItem> buildUserHistory(Long userId) {
        List<UserHistoryItem> history = new ArrayList<>();

        downloadRepository.findByUserId(userId).forEach(download ->
                history.add(new UserHistoryItem(
                        download.getApp().getId(),
                        safeCategory(download.getApp()),
                        null,
                        true,
                        null
                )));

        reviewRepository.findByUserId(userId).forEach(review ->
                history.add(new UserHistoryItem(
                        review.getApp().getId(),
                        safeCategory(review.getApp()),
                        review.getRating() != null ? review.getRating().doubleValue() : null,
                        false,
                        review.getContent()
                )));

        return history;
    }

    private List<String> buildFavoriteCategories(Long userId) {
        Map<String, Long> byCategory = reviewRepository.findByUserId(userId).stream()
                .map(review -> safeCategory(review.getApp()))
                .filter(value -> !value.isBlank())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        downloadRepository.findByUserId(userId).stream()
                .map(download -> safeCategory(download.getApp()))
                .filter(value -> !value.isBlank())
                .forEach(category -> byCategory.merge(category, 1L, Long::sum));

        return byCategory.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()))
                .map(Map.Entry::getKey)
                .limit(5)
                .toList();
    }

    private AppFeature toAiAppFeature(App app) {
        return AppFeature.builder()
                .id(app.getId())
                .name(app.getName())
                .description(app.getDescription() != null ? app.getDescription() : "")
                .category(safeCategory(app))
                .tags(parseTags(app.getTags()))
                .averageRating(app.getAvgRating() != null ? app.getAvgRating() : BigDecimal.ZERO)
                .downloadCount(app.getDownloadCount() != null ? app.getDownloadCount() : 0)
                .trendingScore(app.getTrendingScore() != null ? app.getTrendingScore() : BigDecimal.ZERO)
                .reviewCount(app.getReviewCount() != null ? app.getReviewCount() : 0)
                .build();
    }

    private List<App> loadApprovedApps(int limit) {
        return appRepository.findByStatus(AppStatus.APPROVED, PageRequest.of(0, limit)).getContent();
    }

    private long countDownloadsSince(Long appId, LocalDateTime since) {
        return downloadRepository.findByAppId(appId).stream()
                .filter(download -> download.getDownloadedAt() != null && download.getDownloadedAt().isAfter(since))
                .count();
    }

    private List<String> parseTags(String tagsJson) {
        if (tagsJson == null || tagsJson.isBlank()) {
            return List.of();
        }
        String cleaned = tagsJson.trim();
        if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
            cleaned = cleaned.substring(1, cleaned.length() - 1);
        }
        if (cleaned.isBlank()) {
            return List.of();
        }
        return java.util.Arrays.stream(cleaned.split(","))
                .map(value -> value.replace("\"", "").trim())
                .filter(value -> !value.isBlank())
                .toList();
    }

    private String safeCategory(App app) {
        return app.getCategory() != null ? app.getCategory().getName() : "";
    }

    private List<App> resolveAppsByOrder(List<Long> orderedIds) {
        List<App> resolved = new ArrayList<>();
        for (Long id : orderedIds) {
            if (id == null) {
                continue;
            }
            appRepository.findById(id).ifPresent(resolved::add);
        }
        return resolved.stream().distinct().toList();
    }

    private RecommendationResponse buildLocalRecommendationResponse(Long userId, int limit, List<App> candidates) {
        Set<String> favoriteCategories = buildFavoriteCategories(userId).stream()
                .filter(value -> value != null && !value.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
        List<UserHistoryItem> history = buildUserHistory(userId);

        List<RecommendationItem> ranked = candidates.stream()
                .map(app -> {
                    double score = 0.45;
                    List<String> reasons = new ArrayList<>();
                    String category = safeCategory(app).toLowerCase();
                    String name = app.getName() != null ? app.getName().toLowerCase() : "";

                    if (!category.isBlank() && favoriteCategories.contains(category)) {
                        score += 0.3;
                        reasons.add("Matches your interest in " + category + " apps.");
                    }
                    if (matchesHistory(name, history)) {
                        score += 0.15;
                        reasons.add("Similar to apps you already use.");
                    }
                    if (ratedRelatedAppHigh(app, history)) {
                        score += 0.1;
                        reasons.add("You rated related apps highly.");
                    }

                    return new RecommendationItem(
                            app.getId(),
                            reasons.isEmpty() ? "Based on your usage and marketplace activity." : String.join(" ", reasons),
                            BigDecimal.valueOf(Math.min(score, 0.99))
                    );
                })
                .sorted(Comparator.comparing(RecommendationItem::getScore, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(limit)
                .toList();

        return new RecommendationResponse(ranked);
    }

    private SimilarAppsResponse buildLocalSimilarResponse(App currentApp, List<App> candidates, int limit) {
        String currentName = currentApp.getName() != null ? currentApp.getName().toLowerCase() : "";
        String currentCategory = safeCategory(currentApp).toLowerCase();
        Set<String> currentTags = parseTags(currentApp.getTags()).stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<SimilarAppItem> ranked = candidates.stream()
                .map(app -> {
                    String candidateName = app.getName() != null ? app.getName().toLowerCase() : "";
                    String candidateCategory = safeCategory(app).toLowerCase();
                    Set<String> candidateTags = parseTags(app.getTags()).stream()
                            .map(String::toLowerCase)
                            .collect(Collectors.toSet());

                    int overlap = 0;
                    for (String tag : currentTags) {
                        if (candidateTags.contains(tag)) {
                            overlap++;
                        }
                    }

                    double score = 0.4;
                    if (!currentCategory.isBlank() && currentCategory.equals(candidateCategory)) {
                        score += 0.35;
                    }
                    if (!currentName.isBlank() && !candidateName.isBlank() && !currentName.equals(candidateName) && sameStem(currentName, candidateName)) {
                        score += 0.15;
                    }
                    score += Math.min(overlap * 0.05, 0.15);

                    return new SimilarAppItem(
                            app.getId(),
                            similarityReason(currentCategory, candidateCategory, overlap),
                            BigDecimal.valueOf(Math.min(score, 0.99))
                    );
                })
                .sorted(Comparator.comparing(SimilarAppItem::getScore, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(limit)
                .toList();

        return new SimilarAppsResponse(ranked);
    }

    private TrendingResponse buildLocalTrendingResponse(List<App> candidates, int limit) {
        List<Map<String, Object>> ranked = candidates.stream()
                .map(app -> {
                    double downloads = app.getDownloadCount() != null ? app.getDownloadCount() : 0;
                    double ratings = app.getAvgRating() != null ? app.getAvgRating().doubleValue() : 0;
                    double reviews = app.getReviewCount() != null ? app.getReviewCount() : 0;
                    double trend = Math.min(1.0,
                            (downloads / 1000.0) * 0.35 +
                                    (ratings / 5.0) * 0.25 +
                                    (reviews / 100.0) * 0.2 +
                                    (app.getTrendingScore() != null ? app.getTrendingScore().doubleValue() : 0.0) * 0.2);

                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("appId", app.getId());
                    item.put("trendScore", roundScore(trend));
                    item.put("reason", trend >= 0.7 ? "Strong engagement and review activity." : "Growing usage and review signals.");
                    return item;
                })
                .sorted((left, right) -> Double.compare(scoreOf(right), scoreOf(left)))
                .limit(limit)
                .toList();

        return new TrendingResponse(ranked, List.of());
    }

    private TrendingResponse normalizeTrendingResponse(TrendingResponse response) {
        List<Map<String, Object>> normalized = response.getTrendingApps().stream()
                .map(this::normalizeTrendingItem)
                .filter(java.util.Objects::nonNull)
                .toList();
        return new TrendingResponse(normalized,
                response.getTrendingCategories() != null ? response.getTrendingCategories() : List.of());
    }

    private Map<String, Object> normalizeTrendingItem(Map<String, Object> item) {
        if (item == null) {
            return null;
        }
        Map<String, Object> normalized = new LinkedHashMap<>(item);
        Long appId = extractTrendingAppId(item);
        if (appId != null) {
            normalized.put("appId", appId);
        }
        if (!normalized.containsKey("score") && normalized.containsKey("trendScore")) {
            normalized.put("score", normalized.get("trendScore"));
        }
        return normalized;
    }

    private Long extractTrendingAppId(Map<String, Object> item) {
        if (item == null) {
            return null;
        }
        Object appId = item.get("appId");
        if (appId == null) {
            appId = item.get("app_id");
        }
        if (appId == null) {
            Object app = item.get("app");
            if (app instanceof Map<?, ?> nested) {
                appId = nested.get("id");
            }
        }
        if (appId == null) {
            return null;
        }
        try {
            return Long.valueOf(String.valueOf(appId));
        } catch (Exception ex) {
            return null;
        }
    }

    private boolean matchesHistory(String name, List<UserHistoryItem> history) {
        if (name == null || name.isBlank()) {
            return false;
        }
        for (UserHistoryItem item : history) {
            if (item == null || item.getReviewText() == null || item.getReviewText().isBlank()) {
                continue;
            }
            String text = item.getReviewText().toLowerCase();
            if (text.contains(name) || name.contains(text)) {
                return true;
            }
        }
        return false;
    }

    private boolean ratedRelatedAppHigh(App app, List<UserHistoryItem> history) {
        String appName = app.getName() != null ? app.getName().toLowerCase() : "";
        if (appName.isBlank()) {
            return false;
        }
        for (UserHistoryItem item : history) {
            if (item == null || item.getRating() == null || item.getRating() < 4) {
                continue;
            }
            if (item.getReviewText() == null) {
                continue;
            }
            if (item.getReviewText().toLowerCase().contains(appName)) {
                return true;
            }
        }
        return false;
    }

    private boolean sameStem(String left, String right) {
        String normalizedLeft = left == null ? "" : left.replaceAll("[^a-z]", "").toLowerCase();
        String normalizedRight = right == null ? "" : right.replaceAll("[^a-z]", "").toLowerCase();
        return !normalizedLeft.isBlank() && !normalizedRight.isBlank()
                && (normalizedLeft.contains(normalizedRight) || normalizedRight.contains(normalizedLeft));
    }

    private String similarityReason(String category, String candidateCategory, int overlap) {
        List<String> parts = new ArrayList<>();
        if (!category.isBlank() && category.equals(candidateCategory)) {
            parts.add("Same " + category + " category.");
        }
        if (overlap > 0) {
            parts.add("Shared tags with the current app.");
        }
        return parts.isEmpty() ? "Similar catalog profile." : String.join(" ", parts);
    }

    private double scoreOf(Map<String, Object> item) {
        Object value = item != null ? (item.get("score") != null ? item.get("score") : item.get("trendScore")) : null;
        if (value == null) {
            return 0.0;
        }
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (Exception ex) {
            return 0.0;
        }
    }

    private BigDecimal roundScore(double value) {
        return BigDecimal.valueOf(Math.max(0.0, Math.min(0.99, value)));
    }
}
