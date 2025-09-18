package com.goorm.travelshopping.dto.order;

import com.goorm.travelshopping.entity.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderSummaryResponse(
        String orderNumber,
        OrderStatus status,
        BigDecimal finalAmount,
        LocalDateTime orderDate,
        List<OrderItemResponse> items
) {
}
