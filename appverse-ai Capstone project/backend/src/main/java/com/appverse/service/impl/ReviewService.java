package com.appverse.service.impl;

import com.appverse.dto.request.ReviewRequest;
import com.appverse.entity.*;
import com.appverse.exception.*;
import com.appverse.repository.*;
import com.appverse.service.impl.SentimentAnalysisService.SentimentResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Review CRUD + sentiment analysis integration.
 */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppRepository appRepository;
    private final UserRepository userRepository;
    private final SentimentAnalysisService sentimentService;
    private final NotificationService notificationService;

    @Transactional
    public Review addReview(Long appId, Long userId, ReviewRequest req) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // AI sentiment analysis
        SentimentResult result = sentimentService.analyse(req.getContent(), req.getRating());

        Review review = Review.builder()
                .app(app)
                .user(user)
                .rating(req.getRating())
                .title(req.getTitle())
                .content(req.getContent())
                .sentiment(result.sentiment())
                .sentimentScore(result.score())
                .aiConfidence(result.confidence())
                .predictedRating(result.predictedRating())
                .trustScore(result.trustScore())
                .moderationReason(result.moderationReason())
                .isFlagged(result.isFlagged())
                .isFake(result.isFake())
                .build();

        Review saved = reviewRepository.save(review);

        // Recalculate average rating
        recalculateAvgRating(app);

        notificationService.notify(
                app.getDeveloper(),
                com.appverse.entity.NotificationType.REVIEW_REPLY,
                "New review on " + app.getName(),
                "Your app received a new review from " + user.getUsername() + ".",
                "/apps/" + app.getId()
        );

        return saved;
    }

    public Page<Review> getReviews(Long appId, Pageable pageable) {
        return reviewRepository.findByAppId(appId, pageable);
    }

    public List<Review> getFlaggedReviews() {
        return reviewRepository.findByIsFlagged(true);
    }

    @Transactional
    public void moderateReview(Long reviewId, boolean approve) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));
        review.setIsFlagged(!approve);
        review.setIsFake(!approve);
        Review saved = reviewRepository.save(review);
        notificationService.notify(
                saved.getUser(),
                approve ? com.appverse.entity.NotificationType.SUCCESS : com.appverse.entity.NotificationType.WARNING,
                approve ? "Review approved" : "Review flagged",
                approve ? "Your review passed moderation." : "Your review was flagged by moderation.",
                "/apps/" + saved.getApp().getId()
        );
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));
        if (!isAdmin && !review.getUser().getId().equals(userId))
            throw new UnauthorizedException("Cannot delete another user's review");
        App app = review.getApp();
        reviewRepository.delete(review);
        recalculateAvgRating(app);
    }

    private void recalculateAvgRating(App app) {
        Double avg = reviewRepository.avgRatingByApp(app.getId());
        app.setAvgRating(avg != null
                ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO);
        app.setReviewCount((int) reviewRepository.countByAppId(app.getId()));
        appRepository.save(app);
    }
}
