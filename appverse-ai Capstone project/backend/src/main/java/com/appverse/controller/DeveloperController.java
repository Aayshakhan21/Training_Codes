package com.appverse.controller;

import com.appverse.repository.UserRepository;
import com.appverse.service.impl.AppService;
import com.appverse.service.impl.DeveloperAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Developer", description = "Developer analytics and console")
public class DeveloperController {

    private final DeveloperAnalyticsService analyticsService;
    private final AppService appService;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    @Operation(summary = "Developer stats")
    public ResponseEntity<?> stats(@AuthenticationPrincipal UserDetails userDetails) {
        Long developerId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        return ResponseEntity.ok(Map.of("success", true, "data", analyticsService.stats(developerId)));
    }

    @GetMapping("/apps")
    @Operation(summary = "List apps owned by the current developer")
    public ResponseEntity<?> apps(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long developerId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        return ResponseEntity.ok(Map.of("success", true, "data", appService.getDeveloperApps(developerId, org.springframework.data.domain.PageRequest.of(page, size))));
    }

    @GetMapping("/downloads")
    @Operation(summary = "Recent downloads for the current developer's apps")
    public ResponseEntity<?> downloads(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long developerId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        return ResponseEntity.ok(Map.of("success", true, "data", analyticsService.downloadHistory(developerId, page, size)));
    }
}
