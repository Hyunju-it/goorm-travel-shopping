package com.goorm.travelshopping.controller;

import com.goorm.travelshopping.dto.order.OrderCreateRequest;
import com.goorm.travelshopping.dto.order.OrderDetailResponse;
import com.goorm.travelshopping.dto.order.OrderSummaryResponse;
import com.goorm.travelshopping.dto.order.UpdateOrderStatusRequest;
import com.goorm.travelshopping.security.CustomUserDetails;
import com.goorm.travelshopping.service.OrderService;
import com.goorm.travelshopping.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<OrderDetailResponse> createOrder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                           @Valid @RequestBody OrderCreateRequest request) {
        OrderDetailResponse response = orderService.createOrder(userService.getActiveUser(userDetails.getId()), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<OrderSummaryResponse> getOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return orderService.getMyOrders(userService.getActiveUser(userDetails.getId()));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderSummaryResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{orderNumber}")
    public OrderDetailResponse getOrderDetail(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @PathVariable String orderNumber) {
        return orderService.getOrderDetail(userService.getActiveUser(userDetails.getId()), orderNumber);
    }

    @PatchMapping("/{orderNumber}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable String orderNumber,
                                                  @Valid @RequestBody UpdateOrderStatusRequest request) {
        orderService.updateOrderStatus(orderNumber, request.status(), request.paymentStatus());
        return ResponseEntity.noContent().build();
    }
}
