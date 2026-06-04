package com.appverse.controller;

import com.appverse.dto.request.AppDTOs.*;
import com.appverse.entity.App;
import com.appverse.entity.AppVersion;
import com.appverse.enums.AppStatus;
import com.appverse.service.impl.AppService;
import com.appverse.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * App marketplace REST controller.
 */
@RestController
@RequestMapping("/api/apps")
@RequiredArgsConstructor
@Tag(name = "Apps", description = "App marketplace endpoints")
public class AppController {

    private final AppService appService;
    private final UserRepository userRepository;

    // ── Public ───────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List approved apps with pagination and sorting")
    public ResponseEntity<?> listApps(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) Long categoryId) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<App> apps = categoryId != null
                ? appService.getAppsByCategory(categoryId, pageable)
                : appService.getApprovedApps(pageable);

        return ResponseEntity.ok(Map.of("success", true, "data", apps));
    }

    @GetMapping("/search")
    @Operation(summary = "Full-text search across apps")
    public ResponseEntity<?> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(Map.of("success", true, "data", appService.searchApps(q, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get app by ID")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("success", true, "data", appService.getAppById(id)));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get app by slug")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("success", true, "data", appService.getAppBySlug(slug)));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending apps")
    public ResponseEntity<?> trending(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(Map.of("success", true, "data", appService.getTrendingApps(limit)));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated apps")
    public ResponseEntity<?> topRated(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(Map.of("success", true, "data", appService.getTopRatedApps(limit)));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured apps")
    public ResponseEntity<?> featured(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(Map.of("success", true, "data", appService.getTrendingApps(limit)));
    }

    // ── Download ─────────────────────────────────────────

    @PostMapping("/{id}/download")
    @Operation(summary = "Record a download")
    public ResponseEntity<?> download(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {
        Long userId = resolveUserId(userDetails);
        appService.recordDownload(id, userId, request.getRemoteAddr());
        return ResponseEntity.ok(Map.of("success", true, "message", "Download recorded"));
    }

    @GetMapping("/{id}/purchase-status")
    @Operation(summary = "Check whether the current user has purchased the app")
    public ResponseEntity<?> purchaseStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean purchased = false;
        if (userDetails != null) {
            Long userId = resolveUserId(userDetails);
            purchased = appService.hasPurchasedApp(userId, id);
        }
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("purchased", purchased)));
    }

    @PostMapping("/{id}/purchase-demo")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Simulate a payment and record a demo purchase")
    public ResponseEntity<?> purchaseDemo(
            @PathVariable Long id,
            @Valid @RequestBody DemoPurchaseRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Login required"));
        }

        Long userId = resolveUserId(userDetails);
        var purchase = appService.demoPurchase(id, userId, req.getCardHolderName());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Demo payment successful",
                "data", Map.of(
                        "purchaseId", purchase.getId(),
                        "transactionId", purchase.getTransactionId(),
                        "amount", purchase.getAmount(),
                        "status", purchase.getStatus()
                )));
    }

    // ── Developer / Admin ─────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new app (Developer/Admin)")
    public ResponseEntity<?> createApp(
            @Valid @RequestBody CreateAppRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long developerId = resolveUserId(userDetails);
        App app = appService.createApp(req, developerId);
        return ResponseEntity.ok(Map.of("success", true,
                "message", "App submitted for review",
                "data", app));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update app details")
    public ResponseEntity<?> updateApp(
            @PathVariable Long id,
            @RequestBody UpdateAppRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long developerId = resolveUserId(userDetails);
        App app = appService.updateApp(id, req, developerId);
        return ResponseEntity.ok(Map.of("success", true, "message", "App updated", "data", app));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete an app")
    public ResponseEntity<?> deleteApp(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Long developerId = resolveUserId(userDetails);
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        appService.deleteApp(id, developerId, isAdmin);
        return ResponseEntity.ok(Map.of("success", true, "message", "App deleted"));
    }

    // ── Admin ─────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Approve / Reject app (Admin)")
    public ResponseEntity<?> changeStatus(
            @PathVariable Long id,
            @RequestBody AppStatusRequest req) {
        App updated = appService.changeStatus(id, req.getStatus());
        return ResponseEntity.ok(Map.of("success", true, "data", updated));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List pending apps (Admin)")
    public ResponseEntity<?> pendingApps(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(Map.of("success", true,
                "data", appService.getPendingApps(pageable)));
    }

    @GetMapping("/{id}/versions")
    @Operation(summary = "Get app versions")
    public ResponseEntity<?> versions(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("success", true, "data", appService.getVersions(id)));
    }

    @PostMapping("/{id}/versions")
    @PreAuthorize("hasAnyRole('DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new version")
    public ResponseEntity<?> addVersion(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long developerId = resolveUserId(userDetails);
        AppVersion version = appService.addVersion(
                id,
                payload.get("version"),
                payload.get("releaseNotes"),
                payload.get("downloadUrl"),
                developerId,
                false
        );
        return ResponseEntity.ok(Map.of("success", true, "data", version));
    }

    @PostMapping("/{id}/versions/{versionId}/rollback")
    @PreAuthorize("hasAnyRole('DEVELOPER','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Rollback to a previous version")
    public ResponseEntity<?> rollbackVersion(
            @PathVariable Long id,
            @PathVariable Long versionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long developerId = resolveUserId(userDetails);
        AppVersion version = appService.rollbackVersion(id, versionId, developerId, false);
        return ResponseEntity.ok(Map.of("success", true, "data", version));
    }

    private Long resolveUserId(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow()
                .getId();
    }
}
