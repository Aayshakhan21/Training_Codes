package com.appverse.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

public class UserDTOs {

    @Data
    public static class UpdateProfileRequest {
        @Size(max = 100)
        private String fullName;

        @Size(min = 3, max = 50)
        private String username;

        @Email
        private String email;
    }

    @Data
    public static class ChangePasswordRequest {
        @NotBlank
        private String currentPassword;

        @NotBlank @Size(min = 8, max = 100)
        private String newPassword;
    }

    @Data
    public static class BookmarkRequest {
        private Long appId;
    }
}
