package com.electroshop.ai;

import com.electroshop.dto.AIDTO;
import com.electroshop.entity.Product;
import com.electroshop.repository.AIConversationRepository;
import com.electroshop.repository.AIMessageRepository;
import com.electroshop.repository.CartItemRepository;
import com.electroshop.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AIServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductContextService productContextService;

    @Mock
    private RecommendationService recommendationService;

    @Mock
    private AIProvider aiProvider;

    @Mock
    private PromptService promptService;

    @Mock
    private AIConversationRepository conversationRepository;

    @Mock
    private AIMessageRepository messageRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private AIService aiService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product("MacBook Pro", "Apple", "Laptop", 200000.0, "M3 chip", "RAM: 16GB", "img.jpg");
        sampleProduct.setId(1L);
    }

    @Test
    void testProcessChat() {
        AIDTO.ChatRequest req = new AIDTO.ChatRequest();
        req.setMessage("Find me a laptop for programming");

        when(productRepository.findAll()).thenReturn(List.of(sampleProduct));
        when(productContextService.buildProductContext(anyList())).thenReturn("MacBook Pro context");
        when(promptService.buildChatSystemPrompt(anyString())).thenReturn("System Prompt");
        when(aiProvider.generateText(anyString(), anyString())).thenReturn("I recommend the MacBook Pro 16.");

        AIDTO.ChatResponse res = aiService.processChat(req);

        assertNotNull(res);
        assertTrue(res.getReply().contains("MacBook Pro"));
        assertFalse(res.getRecommendedProducts().isEmpty());
    }
}
