package com.electroshop.dto;

import java.util.List;

public class OrderDTO {

    public static class CheckoutRequest {
        private Long userId;
        private String shippingAddress;
        private String paymentMethod;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }
}
