package com.electroshop.service;

import com.electroshop.ai.ReviewSummaryService;
import com.electroshop.dto.ReviewDTO;
import com.electroshop.entity.Product;
import com.electroshop.entity.Review;
import com.electroshop.entity.User;
import com.electroshop.exception.ResourceNotFoundException;
import com.electroshop.repository.ProductRepository;
import com.electroshop.repository.ReviewRepository;
import com.electroshop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewSummaryService reviewSummaryService;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            ReviewSummaryService reviewSummaryService) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.reviewSummaryService = reviewSummaryService;
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review addReview(Long productId, ReviewDTO.ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Review review = reviewRepository.findByUserIdAndProductId(request.getUserId(), productId)
                .orElse(new Review(user.getId(), user.getUsername(), product, request.getRating(), request.getComment()));

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review saved = reviewRepository.save(review);

        // Update product average rating
        List<Review> allReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        double avg = allReviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        product.setReviewCount(allReviews.size());
        productRepository.save(product);

        // Invalidate summary cache
        reviewSummaryService.invalidateCache(productId);

        return saved;
    }

    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        Long productId = review.getProduct().getId();
        reviewRepository.deleteById(reviewId);
        reviewSummaryService.invalidateCache(productId);
    }
}
