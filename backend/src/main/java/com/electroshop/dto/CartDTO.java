package com.electroshop.dto;

import com.electroshop.entity.Product;

public class CartDTO {

    public static class AddToCartRequest {
        private Long userId;
        private ProductReference product;
        private Long productId;
        private Integer quantity = 1;

        public static class ProductReference {
            private Long id;
            public Long getId() { return id; }
            public void setId(Long id) { this.id = id; }
        }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public ProductReference getProduct() { return product; }
        public void setProduct(ProductReference product) { this.product = product; }

        public Long getProductId() {
            if (productId != null) return productId;
            if (product != null) return product.getId();
            return null;
        }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
