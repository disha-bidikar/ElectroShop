package com.electroshop.controller;

import com.electroshop.dto.CartDTO;
import com.electroshop.entity.CartItem;
import com.electroshop.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping({"/api/cart/{userId}", "/cart/{userId}"})
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping({"/api/cart/add", "/cart/add", "/api/cart/items"})
    public ResponseEntity<CartItem> addToCart(@RequestBody CartDTO.AddToCartRequest request) {
        CartItem cartItem = cartService.addToCart(request);
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping({"/api/cart/{id}", "/cart/{id}", "/api/cart/items/{id}"})
    public ResponseEntity<?> removeCartItem(@PathVariable Long id) {
        cartService.removeCartItem(id);
        return ResponseEntity.ok().build();
    }
}
