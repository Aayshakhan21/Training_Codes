package com.appverse.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull @Min(1) @Max(5)
    private Integer rating;

    @Size(max = 200)
    private String title;

    @NotBlank @Size(min = 10, max = 2000)
    private String content;
}
