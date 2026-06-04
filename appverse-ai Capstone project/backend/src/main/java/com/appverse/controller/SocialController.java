package com.appverse.controller;

import com.appverse.enums.Role;
import com.appverse.entity.DeveloperFollow;
import com.appverse.repository.DeveloperFollowRepository;
import com.appverse.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Social", description = "Follow developers and social actions")
public class SocialController {

    private final DeveloperFollowRepository followRepository;
    private final UserRepository userRepository;

    @PostMapping("/follow/{developerId}")
    @Operation(summary = "Follow a developer")
    public ResponseEntity<?> follow(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long developerId) {
        var follower = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        var developer = userRepository.findById(developerId).orElseThrow();
        if (developer.getRole() != Role.DEVELOPER && developer.getRole() != Role.ADMIN) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Target user is not a developer"));
        }
        if (!followRepository.existsByFollowerIdAndDeveloperId(follower.getId(), developerId)) {
            followRepository.save(DeveloperFollow.builder().follower(follower).developer(developer).build());
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/follow/{developerId}")
    @Operation(summary = "Unfollow a developer")
    public ResponseEntity<?> unfollow(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long developerId) {
        var follower = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        followRepository.findByFollowerIdAndDeveloperId(follower.getId(), developerId)
                .ifPresent(followRepository::delete);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/follows")
    @Operation(summary = "List followed developers")
    public ResponseEntity<?> follows(@AuthenticationPrincipal UserDetails userDetails) {
        var follower = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<?> follows = followRepository.findByFollowerIdOrderByCreatedAtDesc(follower.getId());
        return ResponseEntity.ok(Map.of("success", true, "data", follows));
    }
}
