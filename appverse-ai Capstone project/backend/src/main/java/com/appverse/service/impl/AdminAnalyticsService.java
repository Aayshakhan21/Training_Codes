package com.appverse.service.impl;

import com.appverse.repository.DownloadRepository;
import com.appverse.repository.AppRepository;
import com.appverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final DownloadRepository downloadRepository;
    private final UserRepository userRepository;
    private final AppRepository appRepository;

    public List<Map<String, Object>> weeklySeries() {
        List<Map<String, Object>> series = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            LocalDateTime start = day.atStartOfDay();
            LocalDateTime end = day.plusDays(1).atStartOfDay().minusNanos(1);

            long downloads = downloadRepository.countByDownloadedAtBetween(start, end);
            long users = userRepository.countByCreatedAtBetween(start, end);
            long revenue = downloadRepository.findByDownloadedAtBetween(start, end).stream()
                    .map(download -> download.getApp().getPrice())
                    .filter(price -> price != null)
                    .mapToLong(price -> price.movePointRight(2).longValue())
                    .sum();

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("day", day.getDayOfWeek().name().substring(0, 3));
            item.put("downloads", downloads);
            item.put("users", users);
            item.put("revenue", revenue / 100.0);
            series.add(item);
        }

        return series;
    }
}
