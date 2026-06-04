package com.appverse.dto.request;

import com.appverse.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

// ── Auth DTOs ─────────────────────────────────────────────
public class AuthDTOs {

    @Data
    public static class RegisterRequest {
        @NotBlank @Size(min = 3, max = 50)
        private String username;

        @NotBlank @Email
        private String email;

        @NotBlank @Size(min = 8, max = 100)
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                 message = "Password must contain letters and numbers")
        private String password;

        @NotBlank
        private String fullName;

        private Role role = Role.USER;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;

        private Boolean rememberMe = Boolean.FALSE;
    }

    @Data
    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;
    }

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank @Email
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank
        private String token;

        @NotBlank @Size(min = 8, max = 100)
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Password must contain letters and numbers")
        private String newPassword;
    }

    @Data
    public static class VerifyEmailRequest {
        @NotBlank
        private String token;
    }
}
