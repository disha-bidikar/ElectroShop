package com.electroshop.ai;

import com.electroshop.entity.Product;
import com.electroshop.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductContextService {

    private final ProductRepository productRepository;

    public ProductContextService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public String buildProductContext(List<Product> products) {
        if (products.isEmpty()) {
            return "No matching products found in ElectroShop database.";
        }

        return products.stream()
                .map(p -> String.format(
                        "ID: %d | Name: %s | Brand: %s | Category: %s | Price: ₹%.2f | Rating: %.1f/5 | Specs: %s | Description: %s",
                        p.getId(), p.getName(), p.getBrand(), p.getCategory(), p.getPrice(), p.getRating(), p.getSpecs(), p.getDescription()
                ))
                .collect(Collectors.joining("\n"));
    }
}
