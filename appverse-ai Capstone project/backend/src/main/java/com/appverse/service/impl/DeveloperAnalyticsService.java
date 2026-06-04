package com.appverse.service.impl;

import com.appverse.entity.App;
import com.appverse.repository.AppRepository;
import com.appverse.repository.DownloadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DeveloperAnalyticsService {

    private final AppRepository appRepository;
    private final DownloadRepository downloadRepository;
    public Map<String, Object> stats(Long developerId) {
        List<App> apps = appRepository.findByDeveloperId(developerId);
        long totalDownloads = downloadRepository.countByDeveloper(developerId);
        double totalRevenue = appRepository.sumRevenueByDeveloper(developerId) == null
                ? 0.0
                : appRepository.sumRevenueByDeveloper(developerId);
        double avgRating = apps.isEmpty()
                ? 0.0
                : apps.stream()
                        .map(App::getAvgRating)
                        .filter(java.util.Objects::nonNull)
                        .mapToDouble(BigDecimal::doubleValue)
                        .average()
                        .orElse(0.0);

        return Map.of(
                "totalApps", apps.size(),
                "totalDownloads", totalDownloads,
                "totalRevenue", totalRevenue,
                "avgRating", avgRating,
                "recentApps", apps.stream()
                        .sorted(Comparator.comparing(
                                App::getCreatedAt,
                                Comparator.nullsLast(Comparator.reverseOrder())
                        ))
                        .limit(6)
                        .toList(),
                "topApps", appRepository.findByDeveloperIdAndStatus(
                        developerId,
                        com.appverse.enums.AppStatus.APPROVED,
                        PageRequest.of(0, 6)
                ).getContent(),
                "series", monthlySeries(developerId)
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> downloadHistory(Long developerId, int page, int size) {
        var pageable = PageRequest.of(page, size);
        var downloads = downloadRepository.findRecentByDeveloper(developerId, pageable);

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

                    if (download.getUser() != null) {
                        Map<String, Object> user = new LinkedHashMap<>();
                        user.put("id", download.getUser().getId());
                        user.put("username", download.getUser().getUsername());
                        user.put("fullName", download.getUser().getFullName());
                        item.put("user", user);
                    } else {
                        item.put("user", null);
                    }

                    return item;
                })
                .toList();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("content", items);
        data.put("page", downloads.getNumber());
        data.put("size", downloads.getSize());
        data.put("totalElements", downloads.getTotalElements());
        data.put("totalPages", downloads.getTotalPages());
        return data;
    }

    private List<Map<String, Object>> monthlySeries(Long developerId) {
        List<Map<String, Object>> series = new ArrayList<>();
        LocalDate now = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate month = now.minusMonths(i).withDayOfMonth(1);
            LocalDateTime start = month.atStartOfDay();
            LocalDateTime end = month.plusMonths(1).atStartOfDay().minusNanos(1);

            var downloads = downloadRepository.findByDeveloperAndDownloadedAtBetween(developerId, start, end);
            long downloadCount = downloads.size();
            double revenue = downloads.stream()
                    .map(download -> download.getApp() != null ? download.getApp().getPrice() : null)
                    .filter(price -> price != null)
                    .mapToDouble(BigDecimal::doubleValue)
                    .sum();

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month", month.getMonth().name().substring(0, 3));
            entry.put("downloads", downloadCount);
            entry.put("revenue", revenue);
            series.add(entry);
        }

        return series;
    }
}
