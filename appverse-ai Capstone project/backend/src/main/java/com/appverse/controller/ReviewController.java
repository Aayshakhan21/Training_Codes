package com.appverse.controller;

import com.appverse.dto.request.ReviewRequest;
import com.appverse.service.impl.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "App reviews with AI sentiment analysis")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/app/{appId}")
    @Operation(summary = "Get reviews for an app")
    public ResponseEntity<?> getReviews(
            @PathVariable Long appId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(Map.of("success", true,
                "data", reviewService.getReviews(appId, pageable)));
    }

    @PostMapping("/app/{appId}/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Submit a review (AI sentiment applied automatically)")
    public ResponseEntity<?> addReview(
            @PathVariable Long appId,
            @PathVariable Long userId,
            @Valid @RequestBody ReviewRequest req) {
        var review = reviewService.addReview(appId, userId, req);
        return ResponseEntity.ok(Map.of("success", true, "data", review));
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('USER','DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a review")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "false") boolean isAdmin) {
        reviewService.deleteReview(reviewId, userId, isAdmin);
        return ResponseEntity.ok(Map.of("success", true, "message", "Review deleted"));
    }

    @GetMapping("/flagged")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get flagged/suspicious reviews (Admin)")
    public ResponseEntity<?> flagged() {
        return ResponseEntity.ok(Map.of("success", true, "data", reviewService.getFlaggedReviews()));
    }

    @PatchMapping("/{reviewId}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Approve or reject a flagged review (Admin)")
    public ResponseEntity<?> moderate(
            @PathVariable Long reviewId,
            @RequestParam boolean approve) {
        reviewService.moderateReview(reviewId, approve);
        return ResponseEntity.ok(Map.of("success", true, "message", "Review moderated"));
    }
}
