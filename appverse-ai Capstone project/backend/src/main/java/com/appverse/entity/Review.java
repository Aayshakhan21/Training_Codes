package com.appverse.entity;

import com.appverse.enums.Sentiment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Review entity – user ratings and comments for an app.
 */
@Entity
@Table(name = "reviews")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_id", nullable = false)
    private App app;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private Sentiment sentiment = Sentiment.NEUTRAL;

    @Column(name = "sentiment_score", precision = 5, scale = 4)
    private BigDecimal sentimentScore = new BigDecimal("0.5000");

    @Column(name = "ai_confidence", precision = 5, scale = 4)
    private BigDecimal aiConfidence = new BigDecimal("0.5000");

    @Column(name = "predicted_rating")
    private Integer predictedRating = 3;

    @Column(name = "trust_score", precision = 5, scale = 4)
    private BigDecimal trustScore = new BigDecimal("0.5000");

    @Column(name = "moderation_reason", length = 1000)
    private String moderationReason;

    @Column(name = "is_flagged")
    private Boolean isFlagged = false;

    @Column(name = "is_fake")
    private Boolean isFake = false;

    @Column(name = "helpful_count")
    private Integer helpfulCount = 0;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
