package com.electroshop.ai;

import com.electroshop.dto.AIDTO;
import com.electroshop.entity.*;
import com.electroshop.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    private final ProductRepository productRepository;
    private final ProductContextService productContextService;
    private final RecommendationService recommendationService;
    private final AIProvider aiProvider;
    private final PromptService promptService;
    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;
    private final CartItemRepository cartItemRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIService(
            ProductRepository productRepository,
            ProductContextService productContextService,
            RecommendationService recommendationService,
            @Qualifier("geminiAIProvider") AIProvider aiProvider,
            PromptService promptService,
            AIConversationRepository conversationRepository,
            AIMessageRepository messageRepository,
            CartItemRepository cartItemRepository) {
        this.productRepository = productRepository;
        this.productContextService = productContextService;
        this.recommendationService = recommendationService;
        this.aiProvider = aiProvider;
        this.promptService = promptService;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public AIDTO.ChatResponse processChat(AIDTO.ChatRequest request) {
        String userMsg = request.getMessage();
        Long userId = request.getUserId();
        Long convId = request.getConversationId();

        // Manage Conversation entity
        if (convId == null && userId != null) {
            AIConversation newConv = new AIConversation(userId, userMsg.length() > 30 ? userMsg.substring(0, 30) + "..." : userMsg);
            newConv = conversationRepository.save(newConv);
            convId = newConv.getId();
        }

        if (convId != null) {
            messageRepository.save(new AIMessage(convId, "user", userMsg));
        }

        // 1. Database Retrieval: Filter DB for relevant products matching keywords or return full catalog context
        List<Product> allProducts = productRepository.findAll();
        List<Product> relevantProducts = filterProductsByQuery(allProducts, userMsg);

        if (relevantProducts.isEmpty()) {
            relevantProducts = allProducts.stream().limit(6).collect(Collectors.toList());
        }

        // 2. Build Context String
        String productContext = productContextService.buildProductContext(relevantProducts);
        String systemPrompt = promptService.buildChatSystemPrompt(productContext);

        // 3. LLM Call
        String aiReply = aiProvider.generateText(systemPrompt, userMsg);

        // Persist AI reply
        if (convId != null) {
            messageRepository.save(new AIMessage(convId, "assistant", aiReply));
            AIConversation conv = conversationRepository.findById(convId).orElse(null);
            if (conv != null) {
                conv.setUpdatedAt(LocalDateTime.now());
                conversationRepository.save(conv);
            }
        }

        return new AIDTO.ChatResponse(aiReply, relevantProducts, convId);
    }

    public List<Product> processNaturalLanguageSearch(String userQuery) {
        String sysPrompt = promptService.buildSearchParsingPrompt();
        String aiResponse = aiProvider.generateText(sysPrompt, userQuery);

        String category = null;
        Double maxPrice = null;
        String keywords = userQuery;

        try {
            int jsonStart = aiResponse.indexOf("{");
            int jsonEnd = aiResponse.lastIndexOf("}");
            if (jsonStart != -1 && jsonEnd != -1) {
                String jsonStr = aiResponse.substring(jsonStart, jsonEnd + 1);
                JsonNode root = objectMapper.readTree(jsonStr);
                if (root.has("category") && !"All".equalsIgnoreCase(root.get("category").asText())) {
                    category = root.get("category").asText();
                }
                if (root.has("maxPrice") && root.get("maxPrice").asDouble() > 0) {
                    maxPrice = root.get("maxPrice").asDouble();
                }
                if (root.has("keywords")) {
                    keywords = root.get("keywords").asText();
                }
            }
        } catch (Exception e) {
            logger.warn("Could not parse natural search JSON from AI. Falling back to DB search.", e);
        }

        // Standard Spring Data JPA query execution based on extracted structured parameters
        String searchKeywords = (keywords != null && !keywords.trim().isEmpty()) ? keywords.trim() : null;
        List<Product> products = productRepository.searchAndFilter(searchKeywords, category, maxPrice);
        if (products.isEmpty() && category != null) {
            products = productRepository.findByCategoryIgnoreCase(category);
        }
        if (products.isEmpty()) {
            products = filterProductsByQuery(productRepository.findAll(), userQuery);
        }
        return products;
    }

    public AIDTO.CompareResponse processComparison(List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        if (products.isEmpty()) {
            return new AIDTO.CompareResponse(Collections.emptyList(), "No valid products selected.", "", "", "");
        }

        String context = productContextService.buildProductContext(products);
        String sysPrompt = promptService.buildComparisonPrompt(context);
        String aiSummary = aiProvider.generateText(sysPrompt, "Compare these " + products.size() + " products.");

        // Determine specific award badges deterministically based on spec criteria
        Product bestProg = products.stream()
                .filter(p -> p.getSpecs() != null && (p.getSpecs().toLowerCase().contains("16gb") || p.getSpecs().toLowerCase().contains("32gb") || p.getSpecs().toLowerCase().contains("i7") || p.getSpecs().toLowerCase().contains("m2") || p.getSpecs().toLowerCase().contains("m3")))
                .findFirst().orElse(products.get(0));

        Product bestVal = products.stream()
                .min(Comparator.comparing(Product::getPrice))
                .orElse(products.get(0));

        Product bestPerf = products.stream()
                .max(Comparator.comparing(Product::getRating))
                .orElse(products.get(0));

        return new AIDTO.CompareResponse(
                products,
                aiSummary,
                "BEST FOR PROGRAMMING → " + bestProg.getName(),
                "BEST VALUE → " + bestVal.getName() + " (₹" + bestVal.getPrice() + ")",
                "BEST PERFORMANCE → " + bestPerf.getName() + " (" + bestPerf.getRating() + "/5★)"
        );
    }

    public List<AIDTO.RankedProductMatch> processBudgetAssistant(AIDTO.BudgetAssistantRequest req) {
        Double budget = req.getBudget();
        String purpose = req.getPurpose() != null ? req.getPurpose().toLowerCase() : "";
        String cat = req.getCategory();

        List<Product> candidates = productRepository.searchAndFilter(purpose, cat, budget);
        if (candidates.isEmpty()) {
            candidates = productRepository.findAll().stream()
                    .filter(p -> budget == null || p.getPrice() <= budget)
                    .collect(Collectors.toList());
        }

        List<AIDTO.RankedProductMatch> matches = new ArrayList<>();
        for (Product p : candidates) {
            int score = 70;
            List<String> reasons = new ArrayList<>();

            if (budget != null && p.getPrice() <= budget) {
                score += 15;
                reasons.add("✓ Within your budget (₹" + p.getPrice() + ")");
            }
            if (p.getSpecs() != null) {
                if (p.getSpecs().toLowerCase().contains("16gb") || p.getSpecs().toLowerCase().contains("32gb")) {
                    score += 10;
                    reasons.add("✓ High RAM capacity (16GB+)");
                }
                if (p.getSpecs().toLowerCase().contains("ssd")) {
                    score += 5;
                    reasons.add("✓ Fast SSD Storage included");
                }
            }
            if (p.getRating() >= 4.5) {
                score += 5;
                reasons.add("✓ Rated " + p.getRating() + "/5★ by verified buyers");
            }
            if (purpose.contains("programm") || purpose.contains("cod")) {
                reasons.add("✓ Ideal CPU & Memory for development tasks");
            }

            matches.add(new AIDTO.RankedProductMatch(p, Math.min(score, 98), reasons));
        }

        matches.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));
        return matches;
    }

    public List<Product> processCartSuggestions(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return productRepository.findTop8ByOrderByRatingDesc();
        }

        Set<String> cartCategories = cartItems.stream()
                .map(item -> item.getProduct().getCategory())
                .collect(Collectors.toSet());

        Set<Long> cartProductIds = cartItems.stream()
                .map(item -> item.getProduct().getId())
                .collect(Collectors.toSet());

        // Suggest accessories if laptops or phones in cart
        List<Product> suggestions = productRepository.findAll().stream()
                .filter(p -> !cartProductIds.contains(p.getId()))
                .filter(p -> "Accessories".equalsIgnoreCase(p.getCategory()) || "Wearable".equalsIgnoreCase(p.getCategory()) || !cartCategories.contains(p.getCategory()))
                .limit(4)
                .collect(Collectors.toList());

        if (suggestions.isEmpty()) {
            suggestions = productRepository.findTop8ByOrderByRatingDesc();
        }
        return suggestions;
    }

    public AIDTO.DescriptionGenResponse generateProductDescription(AIDTO.DescriptionGenRequest req) {
        String sysPrompt = promptService.buildDescriptionGenPrompt(req.getName(), req.getCategory(), req.getSpecs(), req.getPrice());
        String aiRaw = aiProvider.generateText(sysPrompt, "Generate product copy.");

        String desc = String.format("%s is a premier %s offering exceptional value and top performance at ₹%.2f. Engineered with %s.", req.getName(), req.getCategory(), req.getPrice(), req.getSpecs());
        String shortDesc = String.format("Top-rated %s with specs: %s", req.getName(), req.getSpecs());
        List<String> keyFeatures = List.of("High performance architecture", "Premium ergonomic build quality", "Official manufacturer warranty", "Fast express delivery");
        String seoDesc = String.format("Buy %s online at ElectroShop AI with best prices, discount offers, and customer support.", req.getName());

        try {
            int jsonStart = aiRaw.indexOf("{");
            int jsonEnd = aiRaw.lastIndexOf("}");
            if (jsonStart != -1 && jsonEnd != -1) {
                String jsonStr = aiRaw.substring(jsonStart, jsonEnd + 1);
                JsonNode root = objectMapper.readTree(jsonStr);
                if (root.has("description")) desc = root.get("description").asText();
                if (root.has("shortDescription")) shortDesc = root.get("shortDescription").asText();
                if (root.has("seoDescription")) seoDesc = root.get("seoDescription").asText();
                if (root.has("keyFeatures")) {
                    List<String> feats = new ArrayList<>();
                    root.get("keyFeatures").forEach(f -> feats.add(f.asText()));
                    if (!feats.isEmpty()) keyFeatures = feats;
                }
            }
        } catch (Exception e) {
            logger.warn("Parsing AI generated description JSON failed. Using formatted fallback.", e);
        }

        return new AIDTO.DescriptionGenResponse(desc, shortDesc, keyFeatures, seoDesc);
    }

    private List<Product> filterProductsByQuery(List<Product> allProducts, String query) {
        if (query == null || query.isBlank()) return allProducts;
        String q = query.toLowerCase();

        return allProducts.stream().filter(p ->
                (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                (p.getBrand() != null && p.getBrand().toLowerCase().contains(q)) ||
                (p.getCategory() != null && p.getCategory().toLowerCase().contains(q)) ||
                (p.getDescription() != null && p.getDescription().toLowerCase().contains(q)) ||
                (p.getSpecs() != null && p.getSpecs().toLowerCase().contains(q))
        ).collect(Collectors.toList());
    }
}
