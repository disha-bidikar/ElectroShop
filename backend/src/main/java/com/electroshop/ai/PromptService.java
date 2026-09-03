package com.electroshop.ai;

import org.springframework.stereotype.Service;

@Service
public class PromptService {

    public String buildChatSystemPrompt(String productContext) {
        return "You are 'ElectroShop AI Assistant', a helpful and knowledgeable e-commerce expert for ElectroShop.\n" +
               "IMPORTANT RULES:\n" +
               "1. You must ONLY recommend products present in the database context provided below.\n" +
               "2. NEVER invent fake product names, prices, or specs that are not in the context.\n" +
               "3. Always format prices in Indian Rupees (₹).\n" +
               "4. Provide clear product names, prices, specifications, and reasoning for your recommendations.\n\n" +
               "AVAILABLE PRODUCTS IN ELECTROSHOP DATABASE:\n" + productContext;
    }

    public String buildSearchParsingPrompt() {
        return "You are an AI search query parser for an electronics e-commerce store.\n" +
               "Extract search parameters from the user's natural language query into JSON format.\n" +
               "Return ONLY a JSON object with fields: category (or 'All'), maxPrice (number), keywords (string).\n" +
               "Do not output markdown codeblocks or any additional text.";
    }

    public String buildComparisonPrompt(String productContext) {
        return "You are an AI electronics comparison expert.\n" +
               "Compare the following products based strictly on their database specifications.\n" +
               "Context of products to compare:\n" + productContext + "\n\n" +
               "Provide a clear comparison summary highlighting pros, cons, price-to-performance, and badges like 'BEST FOR PROGRAMMING', 'BEST VALUE', and 'BEST PERFORMANCE'.";
    }

    public String buildReviewSummaryPrompt(String reviewsText) {
        return "You are an AI review summarizer for an e-commerce platform.\n" +
               "Summarize customer reviews into a JSON object with format:\n" +
               "{\"summary\": \"string\", \"pros\": [\"pro1\", \"pro2\"], \"cons\": [\"con1\", \"con2\"]}\n" +
               "Reviews:\n" + reviewsText;
    }

    public String buildDescriptionGenPrompt(String name, String category, String specs, Double price) {
        return String.format(
                "You are an AI e-commerce copywriter. Generate a detailed product listing for:\n" +
                "Product Name: %s\nCategory: %s\nSpecifications: %s\nPrice: ₹%.2f\n\n" +
                "Output JSON format:\n" +
                "{\"description\": \"...\", \"shortDescription\": \"...\", \"keyFeatures\": [\"...\"], \"seoDescription\": \"...\"}",
                name, category, specs, price
        );
    }
}
