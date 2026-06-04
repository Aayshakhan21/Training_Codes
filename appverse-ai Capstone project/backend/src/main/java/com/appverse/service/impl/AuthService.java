package com.appverse.service.impl;

import com.appverse.dto.request.AuthDTOs.*;
import com.appverse.entity.RefreshToken;
import com.appverse.entity.EmailVerificationToken;
import com.appverse.entity.PasswordResetToken;
import com.appverse.entity.User;
import com.appverse.exception.*;
import com.appverse.repository.EmailVerificationTokenRepository;
import com.appverse.repository.PasswordResetTokenRepository;
import com.appverse.repository.RefreshTokenRepository;
import com.appverse.repository.UserRepository;
import com.appverse.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

/**
 * Handles registration, login, token refresh, and logout.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    // ── Register ─────────────────────────────────────────
    @Transactional
    public Map<String, Object> register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new DuplicateResourceException("Email already registered: " + req.getEmail());
        if (userRepository.existsByUsername(req.getUsername()))
            throw new DuplicateResourceException("Username taken: " + req.getUsername());

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .role(com.appverse.enums.Role.USER)
                .isActive(true)
                .emailVerified(false)
                .build();

        User saved = userRepository.save(user);
        EmailVerificationToken token = createVerificationToken(saved);
        return Map.of(
                "user", safeUser(saved),
                "verificationToken", token.getToken()
        );
    }

    // ── Login ────────────────────────────────────────────
    @Transactional
    public Map<String, Object> login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));
        if (Boolean.FALSE.equals(user.getEmailVerified())) {
            throw new BadRequestException("Please verify your email before logging in");
        }

        String accessToken = jwtUtils.generateJwtToken(auth);
        RefreshToken refreshToken = createRefreshToken(user, Boolean.TRUE.equals(req.getRememberMe()));

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken.getToken(),
                "tokenType", "Bearer",
                "user", safeUser(user)
        );
    }

    // ── Refresh Token ─────────────────────────────────────
    @Transactional
    public Map<String, String> refreshToken(String tokenStr) {
        RefreshToken token = refreshTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new BadRequestException("Refresh token expired. Please login again.");
        }

        String newAccessToken = jwtUtils.generateTokenFromUsername(token.getUser().getEmail());
        return Map.of("accessToken", newAccessToken, "tokenType", "Bearer");
    }

    @Transactional
    public Map<String, String> requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));
        PasswordResetToken token = createPasswordResetToken(user);
        return Map.of("message", "Password reset token generated", "token", token.getToken());
    }

    @Transactional
    public void resetPassword(String tokenStr, String newPassword) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (Boolean.TRUE.equals(token.getUsed()) || token.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Reset token expired");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }

    @Transactional
    public Map<String, String> verifyEmail(String tokenStr) {
        EmailVerificationToken token = emailVerificationTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (Boolean.TRUE.equals(token.getUsed()) || token.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Verification token expired");
        }

        User user = token.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        token.setUsed(true);
        emailVerificationTokenRepository.save(token);
        return Map.of("message", "Email verified");
    }

    @Transactional
    public Map<String, String> resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));
        EmailVerificationToken token = createVerificationToken(user);
        return Map.of("message", "Verification token generated", "token", token.getToken());
    }

    // ── Logout ───────────────────────────────────────────
    @Transactional
    public void logout(Long userId) {
        userRepository.findById(userId).ifPresent(refreshTokenRepository::deleteByUser);
    }

    // ── Helper ───────────────────────────────────────────
    private RefreshToken createRefreshToken(User user, boolean rememberMe) {
        refreshTokenRepository.findByUser(user).ifPresent(refreshTokenRepository::delete);
        long ttl = rememberMe ? refreshExpirationMs * 2 : refreshExpirationMs;

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plus(ttl, ChronoUnit.MILLIS))
                .build();

        return refreshTokenRepository.save(token);
    }

    private PasswordResetToken createPasswordResetToken(User user) {
        passwordResetTokenRepository.findByUser(user).ifPresent(passwordResetTokenRepository::delete);
        PasswordResetToken token = PasswordResetToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plus(24, ChronoUnit.HOURS))
                .used(false)
                .build();
        return passwordResetTokenRepository.save(token);
    }

    private EmailVerificationToken createVerificationToken(User user) {
        emailVerificationTokenRepository.findByUser(user).ifPresent(emailVerificationTokenRepository::delete);
        EmailVerificationToken token = EmailVerificationToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plus(48, ChronoUnit.HOURS))
                .used(false)
                .build();
        return emailVerificationTokenRepository.save(token);
    }

    private Map<String, Object> safeUser(User user) {
        java.util.Map<String, Object> payload = new java.util.LinkedHashMap<>();
        payload.put("id", user.getId());
        payload.put("username", user.getUsername());
        payload.put("email", user.getEmail());
        payload.put("fullName", user.getFullName());
        payload.put("avatarUrl", user.getAvatarUrl());
        payload.put("role", user.getRole());
        payload.put("createdAt", user.getCreatedAt());
        payload.put("isActive", user.getIsActive());
        payload.put("emailVerified", user.getEmailVerified());
        return payload;
    }
}
