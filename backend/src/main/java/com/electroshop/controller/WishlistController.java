package com.electroshop.controller;

import com.electroshop.entity.Wishlist;
import com.electroshop.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlistByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistByUserId(userId));
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        Wishlist item = wishlistService.toggleWishlist(userId, productId);
        return ResponseEntity.ok(item != null ? item : "Removed from wishlist");
    }
}
