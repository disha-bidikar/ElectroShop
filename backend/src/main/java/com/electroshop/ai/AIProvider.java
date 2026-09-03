package com.electroshop.ai;

public interface AIProvider {
    String generateText(String systemPrompt, String userPrompt);
}
