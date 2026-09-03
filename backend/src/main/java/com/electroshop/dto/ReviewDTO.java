package com.electroshop.dto;

import java.util.List;

public class ReviewDTO {

    public static class ReviewRequest {
        private Long userId;
        private Double rating;
        private String comment;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class AIReviewSummaryResponse {
        private Long productId;
        private Double averageRating;
        private Integer totalReviews;
        private String summary;
        private List<String> pros;
        private List<String> cons;

        public AIReviewSummaryResponse(Long productId, Double averageRating, Integer totalReviews, String summary, List<String> pros, List<String> cons) {
            this.productId = productId;
            this.averageRating = averageRating;
            this.totalReviews = totalReviews;
            this.summary = summary;
            this.pros = pros;
            this.cons = cons;
        }

        public Long getProductId() { return productId; }
        public Double getAverageRating() { return averageRating; }
        public Integer getTotalReviews() { return totalReviews; }
        public String getSummary() { return summary; }
        public List<String> getPros() { return pros; }
        public List<String> getCons() { return cons; }
    }
}
