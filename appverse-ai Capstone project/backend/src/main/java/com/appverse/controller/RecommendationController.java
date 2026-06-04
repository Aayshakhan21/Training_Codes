package com.appverse.controller;

import com.appverse.service.impl.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Tag(name = "AI Recommendations", description = "Personalised and trending app recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Personalised recommendations for a user")
    public ResponseEntity<?> forUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(Map.of("success", true,
                "data", recommendationService.getPersonalizedRecommendations(userId, limit)));
    }

    @GetMapping("/trending")
    @Operation(summary = "Platform-wide trending apps")
    public ResponseEntity<?> trending(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(Map.of("success", true,
                "data", recommendationService.getTrendingApps(limit)));
    }

    @GetMapping("/similar/{appId}")
    @Operation(summary = "Apps similar to a given app")
    public ResponseEntity<?> similar(
            @PathVariable Long appId,
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(Map.of("success", true,
                "data", recommendationService.getSimilarApps(appId, limit)));
    }
}
