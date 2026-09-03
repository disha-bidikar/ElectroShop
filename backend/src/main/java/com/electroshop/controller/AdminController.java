package com.electroshop.controller;

import com.electroshop.ai.AIService;
import com.electroshop.dto.AIDTO;
import com.electroshop.entity.Order;
import com.electroshop.entity.Product;
import com.electroshop.repository.*;
import com.electroshop.service.OrderService;
import com.electroshop.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final AIService aiService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final AIConversationRepository conversationRepository;

    public AdminController(
            ProductService productService,
            OrderService orderService,
            AIService aiService,
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            ReviewRepository reviewRepository,
            AIConversationRepository conversationRepository) {
        this.productService = productService;
        this.orderService = orderService;
        this.aiService = aiService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
        this.conversationRepository = conversationRepository;
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product created = productService.saveProduct(product);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        Product updated = productService.saveProduct(product);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/products/generate-description")
    public ResponseEntity<AIDTO.DescriptionGenResponse> generateDescription(@RequestBody AIDTO.DescriptionGenRequest request) {
        AIDTO.DescriptionGenResponse response = aiService.generateProductDescription(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        double totalRevenue = orderRepository.findAll().stream().mapToDouble(Order::getTotalAmount).sum();
        long totalReviews = reviewRepository.count();
        long totalAIConversations = conversationRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalReviews", totalReviews);
        stats.put("totalAIConversations", totalAIConversations);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllAdminOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
