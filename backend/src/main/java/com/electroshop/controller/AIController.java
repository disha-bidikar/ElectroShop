package com.electroshop.controller;

import com.electroshop.ai.AIService;
import com.electroshop.ai.RecommendationService;
import com.electroshop.dto.AIDTO;
import com.electroshop.entity.AIConversation;
import com.electroshop.entity.AIMessage;
import com.electroshop.entity.Product;
import com.electroshop.repository.AIConversationRepository;
import com.electroshop.repository.AIMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;
    private final RecommendationService recommendationService;
    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;

    public AIController(
            AIService aiService,
            RecommendationService recommendationService,
            AIConversationRepository conversationRepository,
            AIMessageRepository messageRepository) {
        this.aiService = aiService;
        this.recommendationService = recommendationService;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    @PostMapping({"/api/ai/chat", "/ai/chat"})
    public ResponseEntity<AIDTO.ChatResponse> chat(@RequestBody AIDTO.ChatRequest request) {
        AIDTO.ChatResponse response = aiService.processChat(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/ai/search")
    public ResponseEntity<List<Product>> naturalLanguageSearch(@RequestBody AIDTO.SearchRequest request) {
        List<Product> products = aiService.processNaturalLanguageSearch(request.getQuery());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/api/ai/compare")
    public ResponseEntity<AIDTO.CompareResponse> compareProducts(@RequestBody AIDTO.CompareRequest request) {
        AIDTO.CompareResponse response = aiService.processComparison(request.getProductIds());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/ai/recommendations")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(@RequestParam(required = false) Long userId) {
        List<Map<String, Object>> recommendations = recommendationService.getPersonalizedRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/api/ai/cart-suggestions")
    public ResponseEntity<List<Product>> getCartSuggestions(@RequestParam(required = false) Long userId) {
        List<Product> suggestions = aiService.processCartSuggestions(userId);
        return ResponseEntity.ok(suggestions);
    }

    @PostMapping("/api/ai/budget-assistant")
    public ResponseEntity<List<AIDTO.RankedProductMatch>> budgetAssistant(@RequestBody AIDTO.BudgetAssistantRequest request) {
        List<AIDTO.RankedProductMatch> matches = aiService.processBudgetAssistant(request);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/api/ai/conversations/user/{userId}")
    public ResponseEntity<List<AIConversation>> getUserConversations(@PathVariable Long userId) {
        return ResponseEntity.ok(conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId));
    }

    @GetMapping("/api/ai/conversations/{id}")
    public ResponseEntity<List<AIMessage>> getConversationMessages(@PathVariable Long id) {
        return ResponseEntity.ok(messageRepository.findByConversationIdOrderByCreatedAtAsc(id));
    }

    @DeleteMapping("/api/ai/conversations/{id}")
    @Transactional
    public ResponseEntity<?> deleteConversation(@PathVariable Long id) {
        messageRepository.deleteByConversationId(id);
        conversationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
