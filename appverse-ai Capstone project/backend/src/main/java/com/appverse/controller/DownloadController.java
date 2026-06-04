package com.appverse.controller;

import com.appverse.entity.Download;
import com.appverse.entity.User;
import com.appverse.repository.DownloadRepository;
import com.appverse.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/downloads")
@RequiredArgsConstructor
@Tag(name = "Downloads", description = "Personal download history endpoints")
public class DownloadController {

    private final DownloadRepository downloadRepository;
    private final UserRepository userRepository;

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get the current user's download history")
    public ResponseEntity<?> myDownloads(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = resolveUserId(userDetails);
        Page<Download> downloads = downloadRepository.findByUserIdOrderByDownloadedAtDesc(
                userId,
                PageRequest.of(page, size)
        );

        List<Map<String, Object>> items = downloads.getContent().stream()
                .map(download -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", download.getId());
                    item.put("downloadedAt", download.getDownloadedAt());
                    item.put("platform", download.getPlatform());
                    item.put("ipAddress", download.getIpAddress());

                    Map<String, Object> app = new LinkedHashMap<>();
                    app.put("id", download.getApp().getId());
                    app.put("name", download.getApp().getName());
                    app.put("slug", download.getApp().getSlug());
                    app.put("iconUrl", download.getApp().getIconUrl());
                    app.put("category", download.getApp().getCategory() != null ? download.getApp().getCategory().getName() : null);
                    app.put("version", download.getApp().getVersion());
                    item.put("app", app);

                    return item;
                })
                .toList();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("content", items);
        data.put("page", downloads.getNumber());
        data.put("size", downloads.getSize());
        data.put("totalElements", downloads.getTotalElements());
        data.put("totalPages", downloads.getTotalPages());

        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

    @DeleteMapping("/{downloadId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Remove one app from the current user's download history")
    public ResponseEntity<?> removeDownload(
            @PathVariable Long downloadId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = resolveUserId(userDetails);
        Download download = downloadRepository.findByIdAndUserId(downloadId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Download not found"));

        downloadRepository.delete(download);

        return ResponseEntity.ok(Map.of("success", true, "message", "Download removed"));
    }

    private Long resolveUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow()
                .getId();
    }
}
