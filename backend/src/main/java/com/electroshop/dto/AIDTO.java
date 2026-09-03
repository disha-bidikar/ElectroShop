package com.electroshop.dto;

import com.electroshop.entity.Product;
import java.util.List;

public class AIDTO {

    public static class ChatRequest {
        private String message;
        private Long userId;
        private Long conversationId;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getConversationId() { return conversationId; }
        public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
    }

    public static class ChatResponse {
        private String reply;
        private List<Product> recommendedProducts;
        private Long conversationId;

        public ChatResponse(String reply, List<Product> recommendedProducts, Long conversationId) {
            this.reply = reply;
            this.recommendedProducts = recommendedProducts;
            this.conversationId = conversationId;
        }

        public String getReply() { return reply; }
        public List<Product> getRecommendedProducts() { return recommendedProducts; }
        public Long getConversationId() { return conversationId; }
    }

    public static class SearchRequest {
        private String query;

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
    }

    public static class CompareRequest {
        private List<Long> productIds;

        public List<Long> getProductIds() { return productIds; }
        public void setProductIds(List<Long> productIds) { this.productIds = productIds; }
    }

    public static class CompareResponse {
        private List<Product> products;
        private String aiComparisonSummary;
        private String bestForProgramming;
        private String bestValue;
        private String bestPerformance;

        public CompareResponse(List<Product> products, String aiComparisonSummary, String bestForProgramming, String bestValue, String bestPerformance) {
            this.products = products;
            this.aiComparisonSummary = aiComparisonSummary;
            this.bestForProgramming = bestForProgramming;
            this.bestValue = bestValue;
            this.bestPerformance = bestPerformance;
        }

        public List<Product> getProducts() { return products; }
        public String getAiComparisonSummary() { return aiComparisonSummary; }
        public String getBestForProgramming() { return bestForProgramming; }
        public String getBestValue() { return bestValue; }
        public String getBestPerformance() { return bestPerformance; }
    }

    public static class BudgetAssistantRequest {
        private Double budget;
        private String purpose;
        private String category;

        public Double getBudget() { return budget; }
        public void setBudget(Double budget) { this.budget = budget; }

        public String getPurpose() { return purpose; }
        public void setPurpose(String purpose) { this.purpose = purpose; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    public static class RankedProductMatch {
        private Product product;
        private int matchScore; // 0 - 100%
        private List<String> matchReasons;

        public RankedProductMatch(Product product, int matchScore, List<String> matchReasons) {
            this.product = product;
            this.matchScore = matchScore;
            this.matchReasons = matchReasons;
        }

        public Product getProduct() { return product; }
        public int getMatchScore() { return matchScore; }
        public List<String> getMatchReasons() { return matchReasons; }
    }

    public static class DescriptionGenRequest {
        private String name;
        private String category;
        private String specs;
        private Double price;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getSpecs() { return specs; }
        public void setSpecs(String specs) { this.specs = specs; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
    }

    public static class DescriptionGenResponse {
        private String description;
        private String shortDescription;
        private List<String> keyFeatures;
        private String seoDescription;

        public DescriptionGenResponse(String description, String shortDescription, List<String> keyFeatures, String seoDescription) {
            this.description = description;
            this.shortDescription = shortDescription;
            this.keyFeatures = keyFeatures;
            this.seoDescription = seoDescription;
        }

        public String getDescription() { return description; }
        public String getShortDescription() { return shortDescription; }
        public List<String> getKeyFeatures() { return keyFeatures; }
        public String getSeoDescription() { return seoDescription; }
    }
}
