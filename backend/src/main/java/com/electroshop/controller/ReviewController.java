package com.electroshop.controller;

import com.electroshop.ai.ReviewSummaryService;
import com.electroshop.dto.ReviewDTO;
import com.electroshop.entity.Review;
import com.electroshop.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewSummaryService reviewSummaryService;

    public ReviewController(ReviewService reviewService, ReviewSummaryService reviewSummaryService) {
        this.reviewService = reviewService;
        this.reviewSummaryService = reviewSummaryService;
    }

    @GetMapping("/products/{id}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(id));
    }

    @PostMapping("/products/{id}/reviews")
    public ResponseEntity<Review> addReview(@PathVariable Long id, @RequestBody ReviewDTO.ReviewRequest request) {
        Review review = reviewService.addReview(id, request);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/products/{id}/ai-review-summary")
    public ResponseEntity<ReviewDTO.AIReviewSummaryResponse> getAIReviewSummary(@PathVariable Long id) {
        ReviewDTO.AIReviewSummaryResponse summary = reviewSummaryService.getOrGenerateReviewSummary(id);
        return ResponseEntity.ok(summary);
    }
}
