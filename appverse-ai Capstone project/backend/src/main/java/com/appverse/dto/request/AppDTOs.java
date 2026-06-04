package com.appverse.dto.request;

import com.appverse.enums.AppStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

public class AppDTOs {

    @Data
    public static class CreateAppRequest {
        @NotBlank @Size(max = 150)
        private String name;

        @NotBlank
        private String description;

        @Size(max = 300)
        private String shortDesc;

        private String iconUrl;
        private String bannerUrl;

        @NotNull
        private Long categoryId;

        @DecimalMin("0.00")
        private BigDecimal price = BigDecimal.ZERO;

        private String version = "1.0.0";
        private String releaseNotes;
        private String tags;
        private BigDecimal sizeMb;
        private String minOsVersion;
    }

    @Data
    public static class UpdateAppRequest {
        @Size(max = 150)
        private String name;
        private String description;
        private String shortDesc;
        private String iconUrl;
        private String bannerUrl;
        private Long categoryId;
        private BigDecimal price;
        private String version;
        private String releaseNotes;
        private String tags;
        private BigDecimal sizeMb;
    }

    @Data
    public static class AppStatusRequest {
        @NotNull
        private AppStatus status;
        private String reason;
    }

    @Data
    public static class DemoPurchaseRequest {
        @NotBlank
        private String cardHolderName;

        @NotBlank
        @Pattern(regexp = "^[0-9]{12,19}$", message = "Card number must be 12 to 19 digits")
        private String cardNumber;

        @NotBlank
        @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{2}$", message = "Expiry must be in MM/YY format")
        private String expiry;

        @NotBlank
        @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV must be 3 or 4 digits")
        private String cvv;
    }
}
