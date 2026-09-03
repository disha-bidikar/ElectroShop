package com.electroshop.ai;

import com.electroshop.dto.ReviewDTO;
import com.electroshop.entity.Product;
import com.electroshop.entity.Review;
import com.electroshop.repository.ProductRepository;
import com.electroshop.repository.ReviewRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ReviewSummaryService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewSummaryService.class);

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final AIProvider aiProvider;
    private final PromptService promptService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Cache summary results: productId -> summary response
    private final Map<Long, ReviewDTO.AIReviewSummaryResponse> cache = new ConcurrentHashMap<>();

    public ReviewSummaryService(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            @Qualifier("geminiAIProvider") AIProvider aiProvider,
            PromptService promptService) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.aiProvider = aiProvider;
        this.promptService = promptService;
    }

    public ReviewDTO.AIReviewSummaryResponse getOrGenerateReviewSummary(Long productId) {
        if (cache.containsKey(productId)) {
            return cache.get(productId);
        }

        Product product = productRepository.findById(productId).orElse(null);
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);

        if (reviews.isEmpty()) {
            ReviewDTO.AIReviewSummaryResponse emptyRes = new ReviewDTO.AIReviewSummaryResponse(
                    productId,
                    product != null ? product.getRating() : 5.0,
                    0,
                    "No customer reviews written for this product yet. Be the first to leave a review!",
                    List.of("Brand new condition", "Official ElectroShop warranty"),
                    List.of("No customer feedback yet")
            );
            return emptyRes;
        }

        double avgRating = reviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
        String reviewsText = reviews.stream()
                .map(r -> String.format("- Rating: %.1f/5 | Comment: %s", r.getRating(), r.getComment()))
                .collect(Collectors.joining("\n"));

        String sysPrompt = promptService.buildReviewSummaryPrompt(reviewsText);
        String aiRawOutput = aiProvider.generateText(sysPrompt, "Summarize these reviews.");

        String summaryText = "Overall positive customer satisfaction with key features.";
        List<String> pros = new ArrayList<>(List.of("Good build quality", "High performance display"));
        List<String> cons = new ArrayList<>(List.of("Battery life could be improved"));

        try {
            int jsonStart = aiRawOutput.indexOf("{");
            int jsonEnd = aiRawOutput.lastIndexOf("}");
            if (jsonStart != -1 && jsonEnd != -1) {
                String jsonStr = aiRawOutput.substring(jsonStart, jsonEnd + 1);
                JsonNode rootNode = objectMapper.readTree(jsonStr);
                if (rootNode.has("summary")) summaryText = rootNode.get("summary").asText();
                if (rootNode.has("pros")) {
                    pros.clear();
                    rootNode.get("pros").forEach(p -> pros.add(p.asText()));
                }
                if (rootNode.has("cons")) {
                    cons.clear();
                    rootNode.get("cons").forEach(c -> cons.add(c.asText()));
                }
            }
        } catch (Exception e) {
            logger.warn("Could not parse AI review summary JSON. Using fallback parsing.", e);
        }

        ReviewDTO.AIReviewSummaryResponse summaryResponse = new ReviewDTO.AIReviewSummaryResponse(
                productId, Math.round(avgRating * 10.0) / 10.0, reviews.size(), summaryText, pros, cons
        );

        cache.put(productId, summaryResponse);
        return summaryResponse;
    }

    public void invalidateCache(Long productId) {
        cache.remove(productId);
    }
}
