package com.appverse.controller;

import com.appverse.service.impl.SentimentAnalysisService;
import com.appverse.service.impl.SentimentAnalysisService.SentimentResult;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewAnalysisController {

    private final SentimentAnalysisService sentimentAnalysisService;

    @PostMapping("/analyze")
    public SentimentResult analyze(@RequestBody ReviewAnalysisRequest request) {
        return sentimentAnalysisService.analyse(request.content(), request.rating());
    }

    public record ReviewAnalysisRequest(String content, Integer rating) {}
}
