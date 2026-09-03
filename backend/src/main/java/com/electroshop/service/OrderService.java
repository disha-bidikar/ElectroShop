package com.electroshop.service;

import com.electroshop.dto.OrderDTO;
import com.electroshop.entity.CartItem;
import com.electroshop.entity.Order;
import com.electroshop.entity.OrderItem;
import com.electroshop.exception.BadRequestException;
import com.electroshop.exception.ResourceNotFoundException;
import com.electroshop.repository.CartItemRepository;
import com.electroshop.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public Order checkout(OrderDTO.CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(request.getUserId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cannot checkout with an empty cart!");
        }

        double total = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        Order order = new Order(request.getUserId(), total, request.getShippingAddress(), request.getPaymentMethod());
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            orderItems.add(new OrderItem(order, cartItem.getProduct(), cartItem.getQuantity(), cartItem.getProduct().getPrice()));
        }

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after checkout
        cartItemRepository.deleteByUserId(request.getUserId());

        return savedOrder;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
