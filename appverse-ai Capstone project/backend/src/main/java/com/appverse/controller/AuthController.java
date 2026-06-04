package com.appverse.controller;

import com.appverse.dto.request.AuthDTOs.*;
import com.appverse.service.impl.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication endpoints – register, login, refresh, logout.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "JWT auth endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        Map<String, Object> result = authService.register(req);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registration successful",
                "data", result
        ));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and get JWT tokens")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Map<String, Object> result = authService.login(req);
        return ResponseEntity.ok(Map.of("success", true, "data", result));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshTokenRequest req) {
        Map<String, String> tokens = authService.refreshToken(req.getRefreshToken());
        return ResponseEntity.ok(Map.of("success", true, "data", tokens));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset token")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(Map.of("success", true, "data", authService.requestPasswordReset(req.getEmail())));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using a token")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req.getToken(), req.getNewPassword());
        return ResponseEntity.ok(Map.of("success", true, "message", "Password reset successful"));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify email address")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest req) {
        return ResponseEntity.ok(Map.of("success", true, "data", authService.verifyEmail(req.getToken())));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend email verification token")
    public ResponseEntity<?> resendVerification(@Valid @RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(Map.of("success", true, "data", authService.resendVerification(req.getEmail())));
    }

    @PostMapping("/logout/{userId}")
    @Operation(summary = "Logout and invalidate refresh token")
    public ResponseEntity<?> logout(@PathVariable Long userId) {
        authService.logout(userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out"));
    }
}
