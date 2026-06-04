package com.appverse.controller;

import com.appverse.repository.SubscriptionRepository;
import com.appverse.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payments", description = "Subscription and payment scaffold")
public class PaymentController {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @PostMapping("/subscribe")
    @Operation(summary = "Create a subscription record")
    public ResponseEntity<?> subscribe(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> payload) {
        var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        String planName = String.valueOf(payload.getOrDefault("planName", "Premium"));
        String provider = String.valueOf(payload.getOrDefault("provider", "stripe"));
        BigDecimal amount = new BigDecimal(String.valueOf(payload.getOrDefault("amount", "0")));
        int days = Integer.parseInt(String.valueOf(payload.getOrDefault("days", "30")));

        var subscription = subscriptionRepository.save(com.appverse.entity.Subscription.builder()
                .user(user)
                .planName(planName)
                .provider(provider)
                .amount(amount)
                .transactionId(UUID.randomUUID().toString())
                .status("ACTIVE")
                .startedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(days))
                .build());

        return ResponseEntity.ok(Map.of("success", true, "data", subscription));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current subscription")
    public ResponseEntity<?> mySubscription(@AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        java.util.Map<String, Object> payload = new java.util.LinkedHashMap<>();
        payload.put("success", true);
        payload.put("data", subscriptionRepository.findTopByUserIdOrderByStartedAtDesc(user.getId()).orElse(null));
        return ResponseEntity.ok(payload);
    }
}
