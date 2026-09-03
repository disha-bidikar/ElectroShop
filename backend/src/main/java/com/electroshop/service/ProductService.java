package com.electroshop.service;

import com.electroshop.entity.Product;
import com.electroshop.entity.ProductView;
import com.electroshop.exception.ResourceNotFoundException;
import com.electroshop.repository.ProductRepository;
import com.electroshop.repository.ProductViewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductViewRepository productViewRepository;

    public ProductService(ProductRepository productRepository, ProductViewRepository productViewRepository) {
        this.productRepository = productRepository;
        this.productViewRepository = productViewRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (userId != null) {
            productViewRepository.save(new ProductView(userId, product));
        }

        return product;
    }

    public List<Product> searchAndFilter(String query, String category, Double maxPrice) {
        String catFilter = (category != null && !"All".equalsIgnoreCase(category)) ? category : null;
        return productRepository.searchAndFilter(query, catFilter, maxPrice);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
