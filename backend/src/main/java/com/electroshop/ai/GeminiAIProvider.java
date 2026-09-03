package com.electroshop.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component("geminiAIProvider")
public class GeminiAIProvider implements AIProvider {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAIProvider.class);

    @Value("${electroshop.ai.gemini-key:}")
    private String apiKey;

    @Value("${electroshop.ai.gemini-model:gemini-1.5-flash}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SmartFallbackAIProvider fallbackProvider = new SmartFallbackAIProvider();

    @Override
    public String generateText(String systemPrompt, String userPrompt) {
        if (!StringUtils.hasText(apiKey)) {
            logger.warn("Gemini API key is not configured. Falling back to SmartFallbackAIProvider.");
            return fallbackProvider.generateText(systemPrompt, userPrompt);
        }

        try {
            String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", modelName, apiKey);

            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("role", "user");
            contentMap.put("parts", List.of(Map.of("text", systemPrompt + "\n\nUser Question:\n" + userPrompt)));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(contentMap));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                if (!textNode.isMissingNode()) {
                    return textNode.asText();
                }
            }
        } catch (Exception e) {
            logger.error("Error calling Gemini API: {}. Using fallback provider.", e.getMessage());
        }

        return fallbackProvider.generateText(systemPrompt, userPrompt);
    }
}
