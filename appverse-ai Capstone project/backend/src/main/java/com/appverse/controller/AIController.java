package com.appverse.controller;

import com.appverse.dto.ai.AiServiceDTOs.*;
import com.appverse.exception.BadRequestException;
import com.appverse.service.impl.AiInsightsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "Gemini-backed AI features")
public class AIController {

    private final AiInsightsService aiInsightsService;

    @PostMapping("/analyze-review")
    @PreAuthorize("hasAnyRole('USER','DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Analyze review sentiment and fake-review signals")
    public ResponseEntity<?> analyzeReview(@Valid @RequestBody ReviewAnalysisRequest request) {
        return ResponseEntity.ok(Map.of("success", true, "data", aiInsightsService.analyzeReview(request.getReview(), request.getRating())));
    }

    @PostMapping("/recommendations")
    @PreAuthorize("hasAnyRole('USER','DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Personalized AI recommendations")
    public ResponseEntity<?> recommendations(@Valid @RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(Map.of("success", true, "data", aiInsightsService.recommendations(request.getLimit())));
    }

    @PostMapping("/similar-apps")
    @Operation(summary = "Find similar apps")
    public ResponseEntity<?> similarApps(@Valid @RequestBody SimilarAppsRequest request) {
        Long appId = request.getCurrentApp() != null ? request.getCurrentApp().getId() : null;
        if (appId == null) {
            throw new BadRequestException("currentApp.id is required");
        }
        return ResponseEntity.ok(Map.of("success", true, "data", aiInsightsService.similarAppsWithReasons(appId, request.getLimit())));
    }

    @PostMapping("/trending")
    @Operation(summary = "Analyze marketplace trends")
    public ResponseEntity<?> trending(@Valid @RequestBody TrendingRequest request) {
        return ResponseEntity.ok(Map.of("success", true, "data", aiInsightsService.trendingWithReasons(request.getLimit())));
    }

    @PostMapping("/chat")
    @PreAuthorize("hasAnyRole('USER','DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Chat with the AppVerse AI assistant")
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(Map.of("success", true, "data", aiInsightsService.chat(request.getMessage(), request.getContext())));
    }

    @PostMapping("/review-summary")
    @Operation(summary = "Summarize app reviews")
    public ResponseEntity<?> reviewSummary(@Valid @RequestBody ReviewSummaryRequest request) {
        return ResponseEntity.ok(Map.of("success", true, "data", aiInsightsService.reviewSummary(request.getAppId())));
    }
}
