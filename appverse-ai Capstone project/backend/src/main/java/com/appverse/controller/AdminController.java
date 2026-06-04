package com.appverse.controller;

import com.appverse.enums.AppStatus;
import com.appverse.enums.Role;
import com.appverse.entity.User;
import com.appverse.repository.*;
import com.appverse.service.impl.AdminAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.PageImpl;

/**
 * Admin analytics dashboard endpoints.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin dashboard and management")
public class AdminController {

    private final UserRepository userRepository;
    private final AppRepository appRepository;
    private final DownloadRepository downloadRepository;
    private final ReviewRepository reviewRepository;
    private final AdminAnalyticsService analyticsService;

    @GetMapping("/stats")
    @Operation(summary = "Platform-wide statistics")
    public ResponseEntity<?> stats() {
        long totalUsers = userRepository.countByRole(Role.USER);
        long totalDevs = userRepository.countByRole(Role.DEVELOPER);
        long totalApps = appRepository.countByStatus(AppStatus.APPROVED);
        long pendingApps = appRepository.countByStatus(AppStatus.PENDING);
        long totalDownloads = downloadRepository.count();
        var trending = appRepository.findTrendingApps(PageRequest.of(0, 5));

        return ResponseEntity.ok(Map.of("success", true, "data", Map.of(
                "totalUsers", totalUsers,
                "totalDevelopers", totalDevs,
                "totalApps", totalApps,
                "pendingApps", pendingApps,
                "totalDownloads", totalDownloads,
                "recentDownloads", downloadRepository.countSince(LocalDateTime.now().minusDays(7)),
                "trendingApps", trending
        )));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Weekly analytics series")
    public ResponseEntity<?> analytics() {
        return ResponseEntity.ok(Map.of("success", true, "data", analyticsService.weeklySeries()));
    }

    @GetMapping("/users")
    @Operation(summary = "All platform users")
    public ResponseEntity<?> allUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(Map.of("success", true, "data", findUsersByRole(Role.USER, search, page, size)));
    }

    @GetMapping("/developers")
    @Operation(summary = "All developers")
    public ResponseEntity<?> allDevelopers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(Map.of("success", true, "data", findUsersByRole(Role.DEVELOPER, search, page, size)));
    }

    @PatchMapping("/users/{userId}/toggle")
    @Operation(summary = "Toggle user active/inactive")
    public ResponseEntity<?> toggleUser(@PathVariable Long userId) {
        return userRepository.findById(userId).map(user -> {
            user.setIsActive(!user.getIsActive());
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true,
                    "active", user.getIsActive()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/users/{userId}/make-developer")
    @Operation(summary = "Promote user to developer")
    public ResponseEntity<?> makeDeveloper(@PathVariable Long userId) {
        return userRepository.findById(userId).map(user -> {
            if (user.getRole() == Role.ADMIN) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Admin role cannot be changed"));
            }
            user.setRole(Role.DEVELOPER);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "data", user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/developers/{userId}/remove-developer")
    @Operation(summary = "Demote developer to user")
    public ResponseEntity<?> removeDeveloper(@PathVariable Long userId) {
        return userRepository.findById(userId).map(user -> {
            if (user.getRole() != Role.DEVELOPER) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User is not a developer"));
            }
            user.setRole(Role.USER);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "data", user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/apps/pending")
    @Operation(summary = "Apps awaiting approval")
    public ResponseEntity<?> pendingApps(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(Map.of("success", true,
                "data", appRepository.findByStatus(AppStatus.PENDING, pageable)));
    }

    private Page<User> findUsersByRole(Role role, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (search == null || search.trim().isEmpty()) {
            return userRepository.findByRole(role, pageable);
        }

        String trimmed = search.trim();
        if (trimmed.matches("\\d+")) {
            Optional<User> user = userRepository.findById(Long.valueOf(trimmed))
                    .filter(found -> found.getRole() == role);
            List<User> content = user.map(List::of).orElseGet(List::of);
            return new PageImpl<>(content, pageable, content.size());
        }

        return userRepository.findByRoleAndEmailContainingIgnoreCaseOrRoleAndUsernameContainingIgnoreCase(
                role, trimmed, role, trimmed, pageable);
    }
}
