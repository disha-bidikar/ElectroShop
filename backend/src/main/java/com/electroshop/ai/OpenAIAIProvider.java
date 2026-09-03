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

@Component("openAIAIProvider")
public class OpenAIAIProvider implements AIProvider {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIAIProvider.class);

    @Value("${electroshop.ai.openai-key:}")
    private String apiKey;

    @Value("${electroshop.ai.openai-model:gpt-3.5-turbo}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SmartFallbackAIProvider fallbackProvider = new SmartFallbackAIProvider();

    @Override
    public String generateText(String systemPrompt, String userPrompt) {
        if (!StringUtils.hasText(apiKey)) {
            logger.warn("OpenAI API key is not configured. Falling back to SmartFallbackAIProvider.");
            return fallbackProvider.generateText(systemPrompt, userPrompt);
        }

        try {
            String url = "https://api.openai.com/v1/chat/completions";

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userPrompt));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode textNode = rootNode.path("choices").get(0).path("message").path("content");
                if (!textNode.isMissingNode()) {
                    return textNode.asText();
                }
            }
        } catch (Exception e) {
            logger.error("Error calling OpenAI API: {}. Using fallback provider.", e.getMessage());
        }

        return fallbackProvider.generateText(systemPrompt, userPrompt);
    }
}
