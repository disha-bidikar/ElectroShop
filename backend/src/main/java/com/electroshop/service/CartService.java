package com.electroshop.service;

import com.electroshop.dto.CartDTO;
import com.electroshop.entity.CartItem;
import com.electroshop.entity.Product;
import com.electroshop.exception.ResourceNotFoundException;
import com.electroshop.repository.CartItemRepository;
import com.electroshop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCartByUserId(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(CartDTO.AddToCartRequest request) {
        Long pId = request.getProductId();
        Product product = productRepository.findById(pId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + pId));

        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(request.getUserId(), pId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1));
            return cartItemRepository.save(item);
        }

        CartItem item = new CartItem(request.getUserId(), product, request.getQuantity() != null ? request.getQuantity() : 1);
        return cartItemRepository.save(item);
    }

    public void removeCartItem(Long id) {
        cartItemRepository.deleteById(id);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
