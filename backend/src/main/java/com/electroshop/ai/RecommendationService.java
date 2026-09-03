package com.electroshop.ai;

import com.electroshop.entity.*;
import com.electroshop.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ProductRepository productRepository;
    private final ProductViewRepository productViewRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;

    public RecommendationService(
            ProductRepository productRepository,
            ProductViewRepository productViewRepository,
            CartItemRepository cartItemRepository,
            OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.productViewRepository = productViewRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
    }

    public List<Map<String, Object>> getPersonalizedRecommendations(Long userId) {
        List<Product> allProducts = productRepository.findAll();
        if (allProducts.isEmpty()) return Collections.emptyList();

        Set<String> preferredCategories = new HashSet<>();
        Set<Long> excludeProductIds = new HashSet<>();

        if (userId != null) {
            // Check views
            List<ProductView> views = productViewRepository.findTop10ByUserIdOrderByViewedAtDesc(userId);
            for (ProductView view : views) {
                preferredCategories.add(view.getProduct().getCategory());
                excludeProductIds.add(view.getProduct().getId());
            }

            // Check cart
            List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
            for (CartItem item : cartItems) {
                preferredCategories.add(item.getProduct().getCategory());
                excludeProductIds.add(item.getProduct().getId());
            }

            // Check orders
            List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
            for (Order order : orders) {
                for (OrderItem item : order.getItems()) {
                    if (item.getProduct() != null) {
                        preferredCategories.add(item.getProduct().getCategory());
                    }
                }
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (Product product : allProducts) {
            boolean isPreferredCat = preferredCategories.contains(product.getCategory());
            String explanation;

            if (isPreferredCat) {
                explanation = "Recommended because you recently browsed and bought items in " + product.getCategory();
            } else if (product.getRating() >= 4.7) {
                explanation = "Popular choice with top customer rating of " + product.getRating() + "/5★";
            } else if (product.getIsFeatured() != null && product.getIsFeatured()) {
                explanation = "Featured trending product at ElectroShop AI";
            } else {
                explanation = "Top value product in " + product.getCategory();
            }

            Map<String, Object> map = new HashMap<>();
            map.put("product", product);
            map.put("explanation", explanation);
            result.add(map);
        }

        // Sort: category match first, then rating
        result.sort((a, b) -> {
            Product p1 = (Product) a.get("product");
            Product p2 = (Product) b.get("product");
            boolean c1 = preferredCategories.contains(p1.getCategory());
            boolean c2 = preferredCategories.contains(p2.getCategory());
            if (c1 != c2) return c1 ? -1 : 1;
            return Double.compare(p2.getRating(), p1.getRating());
        });

        return result.stream().limit(8).collect(Collectors.toList());
    }
}
