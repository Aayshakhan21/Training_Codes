package com.appverse.controller;

import com.appverse.dto.request.UserDTOs.ChangePasswordRequest;
import com.appverse.dto.request.UserDTOs.UpdateProfileRequest;
import com.appverse.service.impl.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "Profile management")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        var user = userService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("success", true, "data", buildUserData(user)));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest req) {
        var user = userService.updateProfile(userDetails.getUsername(), req);
        return ResponseEntity.ok(Map.of("success", true, "data", buildUserData(user)));
    }

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload profile avatar")
    public ResponseEntity<?> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        var user = userService.updateAvatar(userDetails.getUsername(), file);
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("avatarUrl", user.getAvatarUrl())));
    }

    @PostMapping("/me/change-password")
    @Operation(summary = "Change current password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(userDetails.getUsername(), req);
        return ResponseEntity.ok(Map.of("success", true, "message", "Password changed"));
    }

    private Map<String, Object> buildUserData(com.appverse.entity.User user) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", user.getId());
        data.put("username", user.getUsername());
        data.put("email", user.getEmail());
        data.put("fullName", user.getFullName());
        data.put("avatarUrl", user.getAvatarUrl());
        data.put("role", user.getRole());
        data.put("createdAt", user.getCreatedAt());
        data.put("emailVerified", user.getEmailVerified());
        data.put("isActive", user.getIsActive());
        return data;
    }
}
