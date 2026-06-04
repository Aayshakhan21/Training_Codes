package com.appverse.client;

import com.appverse.dto.ai.AiServiceDTOs.*;
import com.appverse.exception.AiServiceException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiServiceClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.ai-service.base-url:http://ai-service:8001/api/ai}")
    private String baseUrl;

    public ReviewAnalysisResponse analyzeReview(ReviewAnalysisRequest request) {
        WrapperResponse<Map<String, Object>> wrapper = post("/analyze-review", request);
        return convert(wrapper.getData(), ReviewAnalysisResponse.class);
    }

    public RecommendationResponse recommendations(RecommendationRequest request) {
        WrapperResponse<Map<String, Object>> wrapper = post("/recommendations", request);
        return convert(wrapper.getData(), RecommendationResponse.class);
    }

    public SimilarAppsResponse similarApps(SimilarAppsRequest request) {
        WrapperResponse<Map<String, Object>> wrapper = post("/similar-apps", request);
        return convert(wrapper.getData(), SimilarAppsResponse.class);
    }

    public TrendingResponse trending(TrendingRequest request) {
        WrapperResponse<Map<String, Object>> wrapper = post("/trending", request);
        return convert(wrapper.getData(), TrendingResponse.class);
    }

    public ChatResponse chat(ChatRequest request) {
        WrapperResponse<Map<String, Object>> wrapper = post("/chat", request);
        return convert(wrapper.getData(), ChatResponse.class);
    }

    public ReviewSummaryResponse reviewSummary(ReviewSummaryRequest request) {
        WrapperResponse<Map<String, Object>> wrapper = post("/review-summary", request);
        return convert(wrapper.getData(), ReviewSummaryResponse.class);
    }

    private WrapperResponse<Map<String, Object>> post(String path, Object payload) {
        String url = baseUrl + path;
        try {
            ResponseEntity<WrapperResponse<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(payload, jsonHeaders()),
                    new ParameterizedTypeReference<WrapperResponse<Map<String, Object>>>() {}
            );
            if (!response.getStatusCode().is2xxSuccessful()
                    || response.getBody() == null
                    || !response.getBody().isSuccess()) {
                log.error("AI service returned non-success at {}: status={}", url,
                        response.getStatusCode());
                throw new AiServiceException("AI service returned an invalid response for " + path);
            }
            return response.getBody();
        } catch (AiServiceException ex) {
            throw ex;
        } catch (RestClientException ex) {
            log.warn("AI service unreachable at {} — falling back to local logic. Cause: {}",
                    url, ex.getMessage());
            throw new AiServiceException("AI service unavailable: " + path, ex);
        } catch (Exception ex) {
            log.error("Unexpected error calling AI service at {}: {}", url, ex.getMessage(), ex);
            throw new AiServiceException("AI service error: " + path, ex);
        }
    }

    private HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        return headers;
    }

    private <T> T convert(Object data, Class<T> type) {
        if (data == null) {
            throw new AiServiceException("AI service returned null data for type " + type.getSimpleName());
        }
        return objectMapper.convertValue(data, type);
    }
}
