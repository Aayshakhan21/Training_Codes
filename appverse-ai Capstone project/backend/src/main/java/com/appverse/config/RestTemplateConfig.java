package com.appverse.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                // Allow up to 5 s to establish a connection to the AI service
                .setConnectTimeout(Duration.ofSeconds(5))
                // Allow up to 35 s for Gemini to respond (Gemini P50 is ~3–8 s)
                .setReadTimeout(Duration.ofSeconds(35))
                .build();
    }
}
