package com.appverse.service.impl;

import com.appverse.dto.request.AppDTOs.*;
import com.appverse.entity.*;
import com.appverse.enums.AppStatus;
import com.appverse.enums.Role;
import com.appverse.exception.*;
import com.appverse.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Arrays;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Core App business logic – CRUD, pagination, sorting, analytics.
 */
@Service
@RequiredArgsConstructor
public class AppService {

    private final AppRepository appRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final DownloadRepository downloadRepository;
    private final AppPurchaseRepository appPurchaseRepository;
    private final AppVersionRepository appVersionRepository;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    // ── Create ───────────────────────────────────────────
    @Transactional
    public App createApp(CreateAppRequest req, Long developerId) {
        User developer = userRepository.findById(developerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", developerId));
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", req.getCategoryId()));

        String slug = generateSlug(req.getName());

        App app = App.builder()
                .name(req.getName())
                .slug(slug)
                .description(req.getDescription())
                .shortDesc(req.getShortDesc())
                .iconUrl(req.getIconUrl())
                .bannerUrl(req.getBannerUrl())
                .developer(developer)
                .category(category)
                .price(req.getPrice() != null ? req.getPrice() : BigDecimal.ZERO)
                .version(req.getVersion())
                .releaseNotes(req.getReleaseNotes())
                .tags(normalizeTags(req.getTags()))
                .sizeMb(req.getSizeMb())
                .minOsVersion(req.getMinOsVersion())
                .downloadCount(0)
                .avgRating(BigDecimal.ZERO)
                .reviewCount(0)
                .trendingScore(BigDecimal.ZERO)
                .status(AppStatus.PENDING)
                .build();

        App saved = appRepository.save(app);
        appVersionRepository.save(AppVersion.builder()
                .app(saved)
                .version(saved.getVersion())
                .releaseNotes(saved.getReleaseNotes())
                .downloadUrl(null)
                .build());
        return saved;
    }

    // ── Read ─────────────────────────────────────────────
    public Page<App> getApprovedApps(Pageable pageable) {
        return appRepository.findByStatus(AppStatus.APPROVED, pageable);
    }

    public Page<App> getAppsByCategory(Long categoryId, Pageable pageable) {
        return appRepository.findByCategoryIdAndStatus(categoryId, AppStatus.APPROVED, pageable);
    }

    public App getAppById(Long id) {
        return appRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("App", id));
    }

    public App getAppBySlug(String slug) {
        return appRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("App not found: " + slug));
    }

    public Page<App> searchApps(String query, Pageable pageable) {
        return appRepository.searchApps(query, pageable);
    }

    public List<App> getTrendingApps(int limit) {
        return appRepository.findTrendingApps(PageRequest.of(0, limit));
    }

    public List<App> getTopRatedApps(int limit) {
        return appRepository.findTopRatedApps(PageRequest.of(0, limit));
    }

    public boolean hasPurchasedApp(Long userId, Long appId) {
        return appPurchaseRepository.existsByUserIdAndAppId(userId, appId);
    }

    @Transactional
    public AppPurchase demoPurchase(Long appId, Long userId, String cardHolderName) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));
        if (app.getStatus() != AppStatus.APPROVED) {
            throw new BadRequestException("App is not available for purchase");
        }
        if (app.getPrice() == null || app.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("This app is free and does not require payment");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        return appPurchaseRepository.findTopByUserIdAndAppIdOrderByPurchasedAtDesc(userId, appId)
                .orElseGet(() -> appPurchaseRepository.save(AppPurchase.builder()
                        .app(app)
                        .user(user)
                        .amount(app.getPrice())
                        .paymentMethod("DEMO_CARD")
                        .transactionId("DEMO-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                        .status("PAID")
                        .purchasedAt(LocalDateTime.now())
                        .build()));
    }

    public List<App> getDeveloperApps(Long developerId) {
        return appRepository.findByDeveloperId(developerId);
    }

    public Page<App> getDeveloperApps(Long developerId, Pageable pageable) {
        List<App> apps = appRepository.findByDeveloperId(developerId);
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), apps.size());
        List<App> content = start >= apps.size() ? List.of() : apps.subList(start, end);
        return new PageImpl<>(content, pageable, apps.size());
    }

    // ── Update ───────────────────────────────────────────
    @Transactional
    public App updateApp(Long appId, UpdateAppRequest req, Long developerId) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));

        if (!app.getDeveloper().getId().equals(developerId))
            throw new UnauthorizedException("You don't own this app");

        if (req.getName() != null) app.setName(req.getName());
        if (req.getDescription() != null) app.setDescription(req.getDescription());
        if (req.getShortDesc() != null) app.setShortDesc(req.getShortDesc());
        if (req.getIconUrl() != null) app.setIconUrl(req.getIconUrl());
        if (req.getBannerUrl() != null) app.setBannerUrl(req.getBannerUrl());
        if (req.getPrice() != null) app.setPrice(req.getPrice());
        if (req.getVersion() != null) app.setVersion(req.getVersion());
        if (req.getReleaseNotes() != null) app.setReleaseNotes(req.getReleaseNotes());
        if (req.getTags() != null) app.setTags(normalizeTags(req.getTags()));
        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", req.getCategoryId()));
            app.setCategory(cat);
        }

        App saved = appRepository.save(app);
        if (req.getVersion() != null || req.getReleaseNotes() != null) {
            appVersionRepository.save(AppVersion.builder()
                    .app(saved)
                    .version(saved.getVersion())
                    .releaseNotes(saved.getReleaseNotes())
                    .downloadUrl(null)
                    .build());
        }
        return saved;
    }

    // ── Admin: Change Status ──────────────────────────────
    @Transactional
    public App changeStatus(Long appId, AppStatus status) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));
        app.setStatus(status);
        App saved = appRepository.save(app);
        notificationService.notify(
                saved.getDeveloper(),
                status == AppStatus.APPROVED ? com.appverse.entity.NotificationType.APPROVAL : com.appverse.entity.NotificationType.REJECTION,
                status == AppStatus.APPROVED ? "App approved" : "App rejected",
                "Your app '" + saved.getName() + "' is now " + status.name().toLowerCase() + ".",
                "/developer"
        );
        return saved;
    }

    // ── Delete ────────────────────────────────────────────
    @Transactional
    public void deleteApp(Long appId, Long developerId, boolean isAdmin) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));
        if (!isAdmin && !app.getDeveloper().getId().equals(developerId))
            throw new UnauthorizedException("You don't own this app");
        appRepository.delete(app);
    }

    public Page<App> getPendingApps(Pageable pageable) {
        return appRepository.findByStatus(AppStatus.PENDING, pageable);
    }

    public List<AppVersion> getVersions(Long appId) {
        return appVersionRepository.findByAppIdOrderByCreatedAtDesc(appId);
    }

    @Transactional
    public AppVersion addVersion(Long appId, String version, String releaseNotes, String downloadUrl, Long developerId, boolean isAdmin) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));
        if (!isAdmin && !app.getDeveloper().getId().equals(developerId)) {
            throw new UnauthorizedException("You don't own this app");
        }
        app.setVersion(version);
        if (releaseNotes != null) {
            app.setReleaseNotes(releaseNotes);
        }
        appRepository.save(app);
        return appVersionRepository.save(AppVersion.builder()
                .app(app)
                .version(version)
                .releaseNotes(releaseNotes)
                .downloadUrl(downloadUrl)
                .build());
    }

    @Transactional
    public AppVersion rollbackVersion(Long appId, Long versionId, Long developerId, boolean isAdmin) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));
        if (!isAdmin && !app.getDeveloper().getId().equals(developerId)) {
            throw new UnauthorizedException("You don't own this app");
        }
        AppVersion version = appVersionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("AppVersion", versionId));
        if (!version.getApp().getId().equals(appId)) {
            throw new BadRequestException("Version does not belong to this app");
        }
        app.setVersion(version.getVersion());
        app.setReleaseNotes(version.getReleaseNotes());
        appRepository.save(app);
        return version;
    }

    // ── Download ──────────────────────────────────────────
    @Transactional
    public void recordDownload(Long appId, Long userId, String ip) {
        App app = appRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("App", appId));

        if (app.getStatus() != AppStatus.APPROVED)
            throw new BadRequestException("App is not available for download");

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        boolean isPaid = app.getPrice() != null && app.getPrice().compareTo(BigDecimal.ZERO) > 0;

        if (isPaid) {
            if (user == null) {
                throw new BadRequestException("Login required to download paid apps");
            }

            boolean isOwner = app.getDeveloper() != null && app.getDeveloper().getId().equals(user.getId());
            boolean isAdmin = user.getRole() == Role.ADMIN;
            boolean hasPurchased = appPurchaseRepository.existsByUserIdAndAppId(user.getId(), appId);

            if (!isOwner && !isAdmin && !hasPurchased) {
                throw new BadRequestException("Purchase required before download");
            }
        }

        Download dl = Download.builder()
                .app(app)
                .user(user)
                .ipAddress(ip)
                .downloadedAt(LocalDateTime.now())
                .build();
        downloadRepository.save(dl);

        app.setDownloadCount(app.getDownloadCount() + 1);
        appRepository.save(app);
    }

    // ── Trending Score (scheduled every 6 hours) ─────────
    @Scheduled(fixedRate = 21_600_000)
    @Transactional
    public void recalculateTrendingScores() {
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        List<Object[]> rows = downloadRepository.topDownloadedSince(since);

        rows.forEach(row -> {
            Long appId = ((Number) row[0]).longValue();
            long count = ((Number) row[1]).longValue();
            appRepository.findById(appId).ifPresent(app -> {
                // Weighted: recent downloads * 0.6 + rating * 0.4
                double score = count * 0.6 + app.getAvgRating().doubleValue() * 0.4 * 100;
                app.setTrendingScore(BigDecimal.valueOf(score));
                appRepository.save(app);
            });
        });
    }

    // ── Helper ────────────────────────────────────────────
    private String generateSlug(String name) {
        String base = name.toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
        String slug = base;
        int i = 1;
        while (appRepository.findBySlug(slug).isPresent()) slug = base + "-" + i++;
        return slug;
    }

    private String normalizeTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return null;
        }

        String trimmed = tags.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            return trimmed;
        }

        List<String> values = Arrays.stream(trimmed.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();

        if (values.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(values);
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Invalid tags format");
        }
    }
}
