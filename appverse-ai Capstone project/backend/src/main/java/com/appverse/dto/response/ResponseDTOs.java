package com.appverse.dto.response;

import com.appverse.enums.AppStatus;
import com.appverse.enums.Role;
import com.appverse.enums.Sentiment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// ── Auth ──────────────────────────────────────────────────

@Data @Builder @NoArgsConstructor @AllArgsConstructor
class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserResponse user;
}

// ── User ─────────────────────────────────────────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private Role role;
    private LocalDateTime createdAt;
}

// ── App ──────────────────────────────────────────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class AppResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String shortDesc;
    private String iconUrl;
    private String bannerUrl;
    private String version;
    private CategoryResponse category;
    private UserResponse developer;
    private BigDecimal price;
    private Integer downloadCount;
    private BigDecimal avgRating;
    private Integer reviewCount;
    private BigDecimal trendingScore;
    private AppStatus status;
    private String tags;
    private BigDecimal sizeMb;
    private LocalDateTime createdAt;
    private boolean bookmarked;
}

// ── Category ─────────────────────────────────────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private Integer appCount;
}

// ── Review ───────────────────────────────────────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class ReviewResponse {
    private Long id;
    private Long appId;
    private UserResponse user;
    private Integer rating;
    private String title;
    private String content;
    private Sentiment sentiment;
    private BigDecimal sentimentScore;
    private BigDecimal aiConfidence;
    private Integer predictedRating;
    private BigDecimal trustScore;
    private String moderationReason;
    private Boolean isFlagged;
    private Boolean isFake;
    private Integer helpfulCount;
    private LocalDateTime createdAt;
}

// ── Analytics ────────────────────────────────────────────
@Data @Builder @NoArgsConstructor @AllArgsConstructor
class AdminStatsResponse {
    private long totalUsers;
    private long totalDevelopers;
    private long totalApps;
    private long totalDownloads;
    private long pendingApps;
    private double totalRevenue;
    private List<AppResponse> trendingApps;
}

@Data @Builder @NoArgsConstructor @AllArgsConstructor
class DeveloperStatsResponse {
    private long totalApps;
    private long totalDownloads;
    private double totalRevenue;
    private double avgRating;
    private List<AppResponse> recentApps;
}

// ── API Wrapper ───────────────────────────────────────────
@Data @AllArgsConstructor @NoArgsConstructor
class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data);
    }

    public static <T> ApiResponse<T> success(String msg, T data) {
        return new ApiResponse<>(true, msg, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
