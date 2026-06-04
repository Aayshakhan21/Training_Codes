// package com.appverse.service.impl;

// import com.appverse.client.AiServiceClient;
// import com.appverse.dto.ai.AiServiceDTOs.ReviewAnalysisRequest;
// import com.appverse.dto.ai.AiServiceDTOs.ReviewAnalysisResponse;
// import com.appverse.exception.AiServiceException;
// import com.appverse.enums.Sentiment;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import java.math.BigDecimal;
// import java.math.RoundingMode;

// @Service
// @RequiredArgsConstructor
// public class SentimentAnalysisService {

//     private final AiServiceClient aiServiceClient;

//     public SentimentResult analyse(String text, Integer rating) {
//         try {
//             ReviewAnalysisResponse response = aiServiceClient.analyzeReview(
//                     new ReviewAnalysisRequest(text, rating)
//             );

//             Sentiment sentiment = switch (safe(response.getSentiment())) {
//                 case "POSITIVE" -> Sentiment.POSITIVE;
//                 case "NEGATIVE" -> Sentiment.NEGATIVE;
//                 default -> Sentiment.NEUTRAL;
//             };

//             return new SentimentResult(
//                     sentiment,
//                     scale(response.getConfidence()),
//                     Boolean.TRUE.equals(response.getFakeReview()) || scale(response.getTrustScore()).doubleValue() < 0.4,
//                     Boolean.TRUE.equals(response.getFakeReview()),
//                     response.getPredictedRating(),
//                     scale(response.getTrustScore()),
//                     response.getModerationReason(),
//                     scale(response.getConfidence())
//             );
//         } catch (AiServiceException ex) {
//             return analyseLocally(text, rating);
//         }
//     }

//     public int predictRating(String text) {
//         return analyse(text, null).predictedRating();
//     }

//     private String safe(String value) {
//         return value == null ? "" : value.trim().toUpperCase();
//     }

//     private BigDecimal scale(Double value) {
//         return BigDecimal.valueOf(value == null ? 0.5 : value).setScale(4, RoundingMode.HALF_UP);
//     }

//     private BigDecimal scale(BigDecimal value) {
//         return value == null ? BigDecimal.valueOf(0.5).setScale(4, RoundingMode.HALF_UP) : value.setScale(4, RoundingMode.HALF_UP);
//     }

//     private SentimentResult analyseLocally(String text, Integer rating) {
//         return new SentimentResult(
//                 Sentiment.NEUTRAL,
//                 BigDecimal.valueOf(0.5).setScale(4, RoundingMode.HALF_UP),
//                 false,
//                 false,
//                 3,
//                 BigDecimal.valueOf(0.5).setScale(4, RoundingMode.HALF_UP),
//                 "No review text provided.",
//                 BigDecimal.valueOf(0.5).setScale(4, RoundingMode.HALF_UP)
//         );
//     }

//     public record SentimentResult(
//             Sentiment sentiment,
//             BigDecimal score,
//             boolean isFlagged,
//             boolean isFake,
//             Integer predictedRating,
//             BigDecimal trustScore,
//             String moderationReason,
//             BigDecimal confidence
//     ) {}
// }


package com.appverse.service.impl;

import com.appverse.client.AiServiceClient;
import com.appverse.dto.ai.AiServiceDTOs.ReviewAnalysisRequest;
import com.appverse.dto.ai.AiServiceDTOs.ReviewAnalysisResponse;
import com.appverse.exception.AiServiceException;
import com.appverse.enums.Sentiment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SentimentAnalysisService {

    private final AiServiceClient aiServiceClient;

    private static final Set<String> POSITIVE_WORDS = Set.of(
        "good", "great", "love", "amazing", "excellent", "awesome", "helpful",
        "easy", "fast", "best", "perfect", "smooth", "reliable", "fantastic",
        "wonderful", "outstanding", "superb", "brilliant", "recommend", "intuitive",
        "enjoy", "liked", "like", "useful", "clean", "responsive", "stable", "impressive"
    );

    private static final Set<String> NEGATIVE_WORDS = Set.of(
        "bad", "poor", "terrible", "awful", "crash", "crashes", "bug", "bugs",
        "slow", "broken", "worst", "hate", "useless", "fail", "failed", "error",
        "horrible", "disappointing", "freeze", "freezes", "lag", "laggy",
        "trash", "garbage", "waste", "frustrating", "annoying", "scam", "fake",
        "avoid", "uninstall", "refund", "regret"
    );

    private static final String[] POSITIVE_PHRASES = {
        "highly recommended", "works great", "very helpful", "easy to use",
        "love this app", "fast and smooth", "really useful", "best app"
    };

    private static final String[] NEGATIVE_PHRASES = {
        "do not work", "does not work", "did not work", "don't work", "doesn't work",
        "not working", "stopped working", "keeps freezing", "constantly freezes",
        "won't load", "too much memory"
    };

    public SentimentResult analyse(String text, Integer rating) {
        try {
            ReviewAnalysisResponse response = aiServiceClient.analyzeReview(
                    new ReviewAnalysisRequest(text, rating)
            );

            Sentiment sentiment = switch (safe(response.getSentiment())) {
                case "POSITIVE" -> Sentiment.POSITIVE;
                case "NEGATIVE" -> Sentiment.NEGATIVE;
                default -> Sentiment.NEUTRAL;
            };

            return new SentimentResult(
                    sentiment,
                    scale(response.getConfidence()),
                    Boolean.TRUE.equals(response.getFakeReview()) || scale(response.getTrustScore()).doubleValue() < 0.4,
                    Boolean.TRUE.equals(response.getFakeReview()),
                    response.getPredictedRating(),
                    scale(response.getTrustScore()),
                    response.getModerationReason(),
                    scale(response.getConfidence())
            );
        } catch (AiServiceException ex) {
            return analyseLocally(text, rating);
        }
    }

    public int predictRating(String text) {
        return analyse(text, null).predictedRating();
    }

    private String safe(String value) {
        return value == null ? "" : value.trim().toUpperCase();
    }

    private BigDecimal scale(Double value) {
        return BigDecimal.valueOf(value == null ? 0.5 : value).setScale(4, RoundingMode.HALF_UP);
    }

    private BigDecimal scale(BigDecimal value) {
        return value == null ? BigDecimal.valueOf(0.5).setScale(4, RoundingMode.HALF_UP) : value.setScale(4, RoundingMode.HALF_UP);
    }

    private SentimentResult analyseLocally(String text, Integer rating) {
        // No text at all — return neutral defaults
        if (text == null || text.isBlank()) {
            return new SentimentResult(
                    Sentiment.NEUTRAL,
                    BigDecimal.valueOf(0.5).setScale(4, RoundingMode.HALF_UP),
                    false,
                    false,
                    rating != null ? rating : 3,
                    BigDecimal.valueOf(0.5).setScale(4, RoundingMode.HALF_UP),
                    "No review text provided.",
                    BigDecimal.valueOf(0.5).setScale(4, RoundingMode.HALF_UP)
            );
        }

        String lower = text.toLowerCase();
        String[] tokens = lower.split("[^a-z']+");

        int pos = 0;
        int neg = 0;

        // Phrase-level signals (weighted x2)
        for (String phrase : POSITIVE_PHRASES) {
            if (lower.contains(phrase)) pos += 2;
        }
        for (String phrase : NEGATIVE_PHRASES) {
            if (lower.contains(phrase)) neg += 2;
        }

        // Word-level signals
        for (String token : tokens) {
            if (POSITIVE_WORDS.contains(token)) pos++;
            if (NEGATIVE_WORDS.contains(token)) neg++;
        }

        // Rating as a tiebreaker signal
        if (rating != null) {
            if (rating >= 4) pos++;
            else if (rating <= 2) neg++;
        }

        // Determine sentiment
        Sentiment sentiment;
        if (pos > neg + 1)      sentiment = Sentiment.POSITIVE;
        else if (neg > pos + 1) sentiment = Sentiment.NEGATIVE;
        else                    sentiment = Sentiment.NEUTRAL;

        // Predicted rating
        int predicted;
        if (rating != null) {
            predicted = rating; // trust the explicit rating first
        } else {
            predicted = sentiment == Sentiment.POSITIVE ? 5
                      : sentiment == Sentiment.NEGATIVE ? 1
                      : 3;
        }

        // Trust score: penalize very short reviews
        int wordCount = tokens.length;
        double trust = wordCount >= 10 ? 0.72
                     : wordCount >= 5  ? 0.60
                     : 0.45;

        // Confidence: stronger signal = higher confidence
        int totalSignals = pos + neg;
        double confidence = Math.min(0.95, 0.55 + (totalSignals / 10.0) * 0.35);

        String reason = switch (sentiment) {
            case POSITIVE -> "Review text shows positive feedback.";
            case NEGATIVE -> "Review text shows negative feedback.";
            default       -> "Review text appears balanced or mixed.";
        };

        return new SentimentResult(
                sentiment,
                BigDecimal.valueOf(confidence).setScale(4, RoundingMode.HALF_UP),
                false,
                false,
                predicted,
                BigDecimal.valueOf(trust).setScale(4, RoundingMode.HALF_UP),
                reason,
                BigDecimal.valueOf(confidence).setScale(4, RoundingMode.HALF_UP)
        );
    }

    public record SentimentResult(
            Sentiment sentiment,
            BigDecimal score,
            boolean isFlagged,
            boolean isFake,
            Integer predictedRating,
            BigDecimal trustScore,
            String moderationReason,
            BigDecimal confidence
    ) {}
}
