package com.electroshop.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("smartFallbackAIProvider")
public class SmartFallbackAIProvider implements AIProvider {

    private static final Logger logger = LoggerFactory.getLogger(SmartFallbackAIProvider.class);

    @Override
    public String generateText(String systemPrompt, String userPrompt) {
        logger.info("Executing Smart Fallback AI Provider for prompt...");
        String lowerPrompt = userPrompt.toLowerCase();

        // 1. Natural language search query parsing
        if (systemPrompt.contains("search query parser") || systemPrompt.contains("search parameters") || lowerPrompt.contains("search")) {
            String category = "All";
            double maxPrice = 250000.0;
            if (lowerPrompt.contains("laptop")) category = "Laptop";
            else if (lowerPrompt.contains("phone") || lowerPrompt.contains("smartphone") || lowerPrompt.contains("mobile")) category = "Mobile";
            else if (lowerPrompt.contains("headphone") || lowerPrompt.contains("accessory") || lowerPrompt.contains("mouse")) category = "Accessories";
            else if (lowerPrompt.contains("watch") || lowerPrompt.contains("wearable")) category = "Wearable";
            else if (lowerPrompt.contains("gaming")) category = "Gaming";

            // Extract numeric budget from prompt if present
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(\\d[\\d,]*000)").matcher(lowerPrompt);
            if (m.find()) {
                try {
                    maxPrice = Double.parseDouble(m.group(1).replace(",", ""));
                } catch (Exception ignored) {}
            }

            // Extract relevant spec or brand keywords (e.g. 16gb, apple, dell, gaming)
            String keywords = "";
            if (lowerPrompt.contains("16gb")) keywords = "16GB";
            else if (lowerPrompt.contains("32gb")) keywords = "32GB";
            else if (lowerPrompt.contains("apple") || lowerPrompt.contains("macbook")) keywords = "Apple";
            else if (lowerPrompt.contains("lenovo")) keywords = "Lenovo";
            else if (lowerPrompt.contains("dell")) keywords = "Dell";
            else if (lowerPrompt.contains("samsung")) keywords = "Samsung";
            else if (lowerPrompt.contains("sony")) keywords = "Sony";
            else if (lowerPrompt.contains("logitech")) keywords = "Logitech";
            else if (lowerPrompt.contains("gaming")) keywords = "gaming";

            return String.format("{\"category\": \"%s\", \"maxPrice\": %.1f, \"keywords\": \"%s\"}", category, maxPrice, keywords);
        }

        // 2. Review summarization
        if (systemPrompt.contains("review summarizer") || systemPrompt.contains("Review Summary") || lowerPrompt.contains("review")) {
            return "{\"summary\": \"Customers praise the build quality, display brightness, and raw performance. Battery performance under heavy load is noted as an area of minor complaint.\", \"pros\": [\"Excellent display clarity\", \"Powerful performance\", \"Sleek design\"], \"cons\": [\"Battery drains quickly during heavy tasks\", \"Speaker bass could be deeper\"]}";
        }

        // 3. Product description generator
        if (systemPrompt.contains("copywriter") || systemPrompt.contains("Product Description Generator") || lowerPrompt.contains("generate description")) {
            return "{\"description\": \"Experience premium technology with state-of-the-art engineering. Built for high performance, reliability, and modern aesthetics.\", \"shortDescription\": \"High-performance device designed for power users and tech enthusiasts.\", \"keyFeatures\": [\"Ultra-fast processor\", \"Stunning crisp display\", \"Ergonomic premium design\", \"All-day battery efficiency\"], \"seoDescription\": \"Buy top-rated electronics online at ElectroShop AI with fast delivery and official warranty.\"}";
        }

        // 4. Comparison summary
        if (systemPrompt.contains("comparison expert") || systemPrompt.contains("Product Comparison") || lowerPrompt.contains("compare")) {
            return "Comparison Analysis:\n- Product 1 offers the best overall performance and top-tier specifications.\n- Product 2 provides maximum value for money with great essential features.\n- Recommended choice depends on whether budget or maximum speed is prioritized.";
        }

        // 5. Default Chat Assistant response
        return "Based on your request, I recommend checking out our top-rated laptops and gadgets in stock. Here are the best options matched to your budget and specifications from ElectroShop's inventory.";
    }
}
