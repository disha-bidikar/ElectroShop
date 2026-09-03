package com.electroshop.service;

import com.electroshop.entity.Product;
import com.electroshop.repository.ProductRepository;
import com.electroshop.repository.ProductViewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductViewRepository productViewRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void testGetAllProducts() {
        Product p = new Product("Laptop X", "Brand A", "Laptop", 50000.0, "Desc", "Specs", "img.jpg");
        when(productRepository.findAll()).thenReturn(List.of(p));

        List<Product> result = productService.getAllProducts();

        assertEquals(1, result.size());
        assertEquals("Laptop X", result.get(0).getName());
    }

    @Test
    void testGetProductById() {
        Product p = new Product("Phone Y", "Brand B", "Mobile", 30000.0, "Desc", "Specs", "img.jpg");
        p.setId(1L);
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        Product result = productService.getProductById(1L, null);

        assertNotNull(result);
        assertEquals("Phone Y", result.getName());
    }
}
