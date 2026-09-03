package com.electroshop.controller;

import com.electroshop.entity.Product;
import com.electroshop.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping({"/api/products", "/products"})
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(productService.getProductById(id, userId));
    }

    @GetMapping({"/api/products/search", "/api/products/filter"})
    public ResponseEntity<List<Product>> searchAndFilterProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(productService.searchAndFilter(query, category, maxPrice));
    }
}
