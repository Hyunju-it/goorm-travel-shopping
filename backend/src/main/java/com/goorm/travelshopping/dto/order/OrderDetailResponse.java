package com.goorm.travelshopping.dto.order;

import com.goorm.travelshopping.entity.enums.OrderStatus;
import com.goorm.travelshopping.entity.enums.PaymentMethod;
import com.goorm.travelshopping.entity.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailResponse(
        String orderNumber,
        OrderStatus status,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        BigDecimal totalAmount,
        BigDecimal discountAmount,
        BigDecimal finalAmount,
        String shippingName,
        String shippingPhone,
        String shippingAddress,
        LocalDateTime orderDate,
        List<OrderItemResponse> items
) {
}
